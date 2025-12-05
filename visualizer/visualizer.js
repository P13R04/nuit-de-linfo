/* Visualizer script: uses Web Audio API to draw colorful bars and pulse the vlcix element */
(function(){
  const canvas = document.getElementById('visCanvas');
  const fileInput = document.getElementById('fileInput');
  const micBtn = document.getElementById('micBtn');
  const stopBtn = document.getElementById('stopBtn');
  const sample1Btn = document.getElementById('sample1');
  const sample2Btn = document.getElementById('sample2');
  const vlcix = document.getElementById('vlcix');

  let audioCtx = null;
  let analyser = null;
  let source = null;
  let dataArray = null;
  let rafId = null;

  function setupCanvas(){
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
  }

  function ensureAudio(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(!analyser){
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
  }

  function stopAll(){
    if(source && source.stop){ try{ source.stop(); }catch(e){} }
    if(rafId) cancelAnimationFrame(rafId);
    if(audioCtx && audioCtx.state !== 'closed'){
      try{ /* keep audio context open for reuse */ }catch(e){}
    }
  }

  async function playFile(file){
    stopAll();
    ensureAudio();
    const array = await file.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(array.slice(0));
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    source.start(0);
    render();
  }

  async function playSampleUrl(url){
    try{
      stopAll();
      ensureAudio();
      const resp = await fetch(url);
      if(!resp.ok) throw new Error('Fichier introuvable');
      const array = await resp.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(array.slice(0));
      source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      source.start(0);
      render();
    }catch(err){
      alert('Impossible de charger le sample : ' + (err && err.message ? err.message : err));
    }
  }

  async function useMic(){
    stopAll();
    ensureAudio();
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      render();
    }catch(err){
      alert('Micro inaccessible : ' + (err && err.message ? err.message : err));
    }
  }

  function render(){
    if(!analyser) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    // Ensure MIN_BAR_HEIGHT is available for all draw logic
    const MIN_BAR_HEIGHT = 12;

    function draw(){
      rafId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0,0,w,h);

      let bass = 0;
      for(let i=0;i<32;i++) bass += dataArray[i];
      bass = bass/32/255;
      const glowAlpha = Math.min(0.5, 0.08 + bass*0.7);
      const grad = ctx.createRadialGradient(w*0.5, h*0.8, 10, w*0.5, h*0.8, Math.max(w,h));
      grad.addColorStop(0, `rgba(255,180,80,${0.12 + bass*0.18})`);
      grad.addColorStop(0.5, `rgba(160,220,255,${0.06 + bass*0.06})`);
      grad.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);

      const barCount = 64;
      const step = Math.floor(bufferLength / barCount);
      const barWidth = (w / barCount) * 0.78;
      for(let i=0;i<barCount;i++){
        const idx = i * step;
        let sum = 0;
        for(let j=0;j<step;j++) sum += dataArray[idx + j] || 0;
        const v = sum / step / 255;
        const x = i * (w / barCount) + (w / barCount - barWidth)/2;
        const barH = Math.max(MIN_BAR_HEIGHT, v * h * 0.7);
        const hue = 200 - (i/barCount)*160 + bass*40;
        ctx.fillStyle = `hsl(${hue} ${60 + v*30}% ${50 + v*10}%)`;
        const y = h - barH - 6;
        roundRect(ctx, x, y, barWidth, barH, barWidth*0.35);
        ctx.fill();
      }

      let avg = 0;
      for(let i=0;i<bufferLength;i++) avg += dataArray[i];
      avg = avg / bufferLength / 255;
      const scale = 1 + avg*0.65;
      if(vlcix && vlcix.firstElementChild){
        vlcix.firstElementChild.style.transform = `scale(${scale})`;
      }

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, h - Math.max(8, MIN_BAR_HEIGHT / 2), w, Math.max(8, MIN_BAR_HEIGHT / 2));
    }
    draw();
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) playFile(f);
  });
  micBtn.addEventListener('click', ()=>{
    useMic();
  });
  stopBtn.addEventListener('click', ()=>{
    stopAll();
    if(vlcix && vlcix.firstElementChild) vlcix.firstElementChild.style.transform = 'scale(1)';
  });

  if(sample1Btn) sample1Btn.addEventListener('click', ()=> playSampleUrl('/assets/ambient1.mp3'));
  if(sample2Btn) sample2Btn.addEventListener('click', ()=> playSampleUrl('/assets/ambient2.mp3'));

  let resizeTimer = null;
  function handleResize(){
    if(resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      setupCanvas();
    },120);
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('load', ()=>{
    setupCanvas();
  });

})();
