// Single, cleaned server implementation for HF proxy
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Use global fetch if present (Node 18+), otherwise dynamically import node-fetch
let fetchFn = global.fetch;
if (!fetchFn) fetchFn = (...args) => import('node-fetch').then(m => m.default(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Config
const HF_TOKEN = process.env.HF_TOKEN || process.env.HF_API_KEY || '';
const HF_MODEL = process.env.HF_MODEL || 'google/flan-t5-large';
const MOCK_HF = process.env.MOCK_HF === 'true';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const MAX_MONTHLY_CALLS = parseInt(process.env.MAX_HF_CALLS_PER_MONTH || '500', 10);
const USAGE_FILE = path.join(__dirname, 'usage.json');

// Cache and settings
const cache = new NodeCache({ stdTTL: 60 * 5, checkperiod: 120 });

const SYSTEM_PROMPT = `Tu es "Le Romain", un personnage drôle et un peu bourru du village. ` +
  `Réponds toujours en français. Donne des réponses courtes (2-6 phrases) et utiles.`;

function currentMonthKey(){ const d = new Date(); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`; }
let usage = { month: currentMonthKey(), count: 0 };
try{ if(fs.existsSync(USAGE_FILE)){ const raw = fs.readFileSync(USAGE_FILE,'utf8'); const parsed = JSON.parse(raw); if(parsed && parsed.month && parsed.count != null){ if(parsed.month === usage.month) usage = parsed; } } }catch(e){ console.warn('Could not read usage file', e && e.message); }
function saveUsage(){ try{ fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2), 'utf8'); }catch(e){ console.error('Failed to save usage file', e && e.message); } }

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '8kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for /api
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
app.use('/api/', apiLimiter);

function buildPrompt(userMessage, history){
  let prompt = `System: ${SYSTEM_PROMPT}\n\n`;
  if(Array.isArray(history)) history.slice(-6).forEach(h => { const who = h.role === 'assistant' ? 'Assistant' : 'User'; prompt += `${who}: ${h.content}\n`; });
  prompt += `User: ${userMessage}\nAssistant:`;
  return prompt;
}

// POST /api/roman - proxy to HF router
app.post('/api/roman', apiLimiter, async (req, res) => {
  try{
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    const history = Array.isArray(req.body.history) ? req.body.history : null;
    if(!message) return res.status(400).json({ error: 'Empty message' });
    if(message.length > 2000) return res.status(400).json({ error: 'Message too long' });

    // update usage per month
    const nowKey = currentMonthKey(); if(usage.month !== nowKey){ usage.month = nowKey; usage.count = 0; saveUsage(); }
    if(usage.count >= MAX_MONTHLY_CALLS && !MOCK_HF) return res.status(429).json({ error: 'Monthly HF call quota exceeded' });

    const prompt = buildPrompt(message, history);
    const cacheKey = `${HF_MODEL}::${prompt}`;
    const cached = cache.get(cacheKey);
    if(cached) return res.json({ reply: cached, cached: true });

    if(MOCK_HF){ const mock = `Le Romain (mock) répond à: "${message}" — vive les licences !`; return res.json({ reply: mock, mock: true }); }
    if(!HF_TOKEN) return res.status(503).json({ error: 'HF token not configured on server (HF_TOKEN env var).' });

    const apiUrl = `https://router.huggingface.co/models/${HF_MODEL}`;
    const fallbackApi = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
    const payload = { inputs: prompt, parameters: { max_new_tokens: 256, temperature: 0.7, top_p: 0.9 }, options: { wait_for_model: true } };

    // Try router endpoint first. If the model isn't found (404), fallback to api-inference.
    let upstream = await fetchFn(apiUrl, { method: 'POST', headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    let txt = '';
    if (!upstream.ok && upstream.status === 404) {
      // log and try fallback
      txt = await upstream.text().catch(()=>'<no body>');
      console.warn('HF router returned 404, trying api-inference fallback. Router body:', txt.slice(0,300));
      upstream = await fetchFn(fallbackApi, { method: 'POST', headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }

    if(!upstream.ok){ txt = txt || await upstream.text().catch(()=>'<no body>'); console.error('HF upstream error', upstream.status, txt.slice(0,800)); return res.status(502).json({ error: 'Upstream error', status: upstream.status, details: txt }); }
    const data = await upstream.json();

    let generated = '';
    if(Array.isArray(data) && data.length && data[0].generated_text) generated = data[0].generated_text;
    else if(data.generated_text) generated = data.generated_text;
    else if(typeof data === 'string') generated = data;
    else generated = JSON.stringify(data);

    let reply = generated.replace(prompt, '').trim();
    if(!reply) reply = generated.trim().split('\n').slice(0,6).join('\n');

    cache.set(cacheKey, reply);
    usage.count += 1; saveUsage();
    res.json({ reply, usage });
  }catch(err){ console.error('api/roman error', err); res.status(500).json({ error: 'server error' }); }
});

// Admin usage
app.get('/admin/usage', (req, res) => { const token = req.headers['x-admin-token'] || ''; if(!ADMIN_TOKEN || token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' }); res.json({ usage, max_monthly_calls: MAX_MONTHLY_CALLS }); });

// Serve index
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT} (model=${HF_MODEL})`));
