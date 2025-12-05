// talents.js: render a stone-engraved talent card into canvas using form input
(function(){
  const form = document.getElementById('talentForm');
  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');

  function gauloisize(text){
    if(!text) return '';
    const exclam = ['Par la barbe du chef','Ah çà, par Toutatis','Par les moustaches!','Sacré bouclier!'];
    const enhancers = ['vaillant','intrépide','malin','bourru','rutilant','à poigne'];
    let s = text
      .replace(/\bdeveloper\b/ig,'manie le code')
      .replace(/\bprogrammer\b/ig,'manie le code')
      .replace(/\bdesigner\b/ig,'maître du trait')
      .replace(/\bchef\b/ig,'chef au grand casque')
      .replace(/\bteacher\b/ig,'sage instructeur');
    const pick = enhancers[Math.floor(Math.random()*enhancers.length)];
    s = s + ' — ' + pick + ' ' + exclam[Math.floor(Math.random()*exclam.length)];
    return s;
  }

  function clearCanvas(){ ctx.clearRect(0,0,canvas.width,canvas.height); }

  function drawStoneBackground(){
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#cfc9c3'; ctx.fillRect(0,0,w,h);
    for(let i=0;i<28;i++){
      const gx = Math.random()*w; const gy = Math.random()*h; const gw = 60 + Math.random()*220; const gh = 20 + Math.random()*120; const alpha = 0.03 + Math.random()*0.06;
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.beginPath(); ctx.ellipse(gx,gy,gw,gh,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
    }
    const grd = ctx.createRadialGradient(w*0.5,h*0.45,20,w*0.5,h*0.5,Math.max(w,h));
    grd.addColorStop(0,'rgba(255,255,255,0.02)'); grd.addColorStop(0.7,'rgba(0,0,0,0.06)'); ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);
  }

  function drawEngravedText(title, lines){
    const w = canvas.width;
    ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#2b2b2b'; ctx.font = 'bold 36px Georgia';
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.strokeText(title, w/2, 80); ctx.fillStyle = '#0e0e0e'; ctx.fillText(title, w/2, 80);
    ctx.globalAlpha = 0.6; ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120,100); ctx.lineTo(w-120,100); ctx.stroke(); ctx.globalAlpha = 1;
    let y = 140; ctx.font = '18px Georgia'; ctx.textAlign='left';
    lines.forEach((ln)=>{ const wrapped = wrapText(ln, w-260, ctx.font); wrapped.forEach(rline=>{ ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.strokeText(rline, 140, y); ctx.fillStyle = '#141414'; ctx.fillText(rline, 140, y); y += 28; }); y += 6; });
    ctx.restore();
  }

  function wrapText(text, maxWidth, font){ ctx.font = font || ctx.font; const words = text.split(' '); const lines=[]; let line=''; for(let i=0;i<words.length;i++){ const test = line ? line + ' ' + words[i] : words[i]; if(ctx.measureText(test).width > maxWidth){ lines.push(line); line = words[i]; } else line = test; } if(line) lines.push(line); return lines; }

  const formSide = document.querySelector('.form-side'); const editBtn = document.getElementById('edit'); const downloadBtn = document.getElementById('download');

  function generateCard(data, tone){ clearCanvas(); const base = new Image(); base.src = '/assets/blank_pierre.png'; base.onload = ()=>{ ctx.drawImage(base,0,0,canvas.width,canvas.height); drawContent(); if(formSide) formSide.style.display='none'; if(editBtn) editBtn.style.display='inline-block'; if(downloadBtn) downloadBtn.style.display='inline-block'; const wrap = document.querySelector('.card-wrap'); if(wrap) wrap.classList.add('has-frame'); };
    base.onerror = ()=>{ drawStoneBackground(); drawContent(); if(formSide) formSide.style.display='none'; if(editBtn) editBtn.style.display='inline-block'; if(downloadBtn) downloadBtn.style.display='inline-block'; const wrap = document.querySelector('.card-wrap'); if(wrap) wrap.classList.add('has-frame'); };
    function drawContent(){ const title = data.name ? data.name.toUpperCase() : 'Brave inconnu'; let skillText = data.skills || ''; let projText = data.projects || ''; let langText = data.languages || ''; if(tone === 'gaulois'){ skillText = gauloisize(skillText || 'Compétences non renseignées'); projText = gauloisize(projText || 'Projets mystérieux'); langText = gauloisize(langText || 'Langues chantées'); } else if(tone === 'epic'){ skillText = (skillText || 'Compétences') + ' — digne des grandes sagas'; projText = (projText || 'Projets') + ' — gravés pour la postérité'; langText = (langText || 'Langues') + ' — maîtrisées avec fierté'; }
      const lines = ['Compétences : ' + (skillText || '—'),'Langues : ' + (langText || '—'),'Projets : ' + (projText || '—')]; drawEngravedText(title, lines);
    }
  }

  form.addEventListener('submit',(e)=>{ e.preventDefault(); const data = { name: document.getElementById('name').value.trim(), skills: document.getElementById('skills').value.trim(), languages: document.getElementById('languages').value.trim(), projects: document.getElementById('projects').value.trim() }; const tone = document.getElementById('tone').value; generateCard(data,tone); });

  if(editBtn){ editBtn.addEventListener('click', ()=>{ if(formSide) formSide.style.display='block'; editBtn.style.display='none'; if(downloadBtn) downloadBtn.style.display='none'; const wrap = document.querySelector('.card-wrap'); if(wrap) wrap.classList.remove('has-frame'); }); }

  if(downloadBtn){ downloadBtn.addEventListener('click', ()=>{ const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = 'carte-des-talents.png'; document.body.appendChild(a); a.click(); a.remove(); }); }

})();
