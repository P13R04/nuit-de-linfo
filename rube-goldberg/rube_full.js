// Copied + adapted from original rube-golberg.js
// Sequence: faux chargement -> mini-jeu clicker -> affichage final
(function(){
  const progressEl = document.getElementById('progress');
  const meta = document.getElementById('meta');
  const loader = document.getElementById('loaderScreen');
  const game = document.getElementById('gameScreen');
  const final = document.getElementById('finalScreen');
  const btn = document.getElementById('clickBtn');
  const counter = document.getElementById('counter');
  const fakeMech = document.querySelector('.fake-mech');

  let p = 0;
  const milestoneMsgs = {25: "Préparation de la potion magique", 50: "Ligotage du barde", 75: "Lustrage des menhirs"};
  const milestoneTriggered = {25:false,50:false,75:false};
  let progressMsgTimer = null;

  function showProgressMessage(msg){
    const el = document.getElementById('progressMsg');
    if(!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if(progressMsgTimer) clearTimeout(progressMsgTimer);
    progressMsgTimer = setTimeout(()=>{ el.classList.remove('show'); progressMsgTimer = null; }, 2800);
  }
  function stepProgress(){
    const inc = Math.max(1, Math.round(Math.random()*8));
    p = Math.min(99, p+inc);
    if(progressEl) progressEl.style.width = p + '%';
    if(meta) meta.textContent = p + '%';
    Object.keys(milestoneMsgs).forEach(k=>{
      const num = Number(k);
      if(p >= num && !milestoneTriggered[num]){
        milestoneTriggered[num] = true;
        showProgressMessage(milestoneMsgs[num]);
        if(fakeMech){
          fakeMech.classList.add('mech-buzz');
          setTimeout(()=>fakeMech.classList.remove('mech-buzz'), 900);
        }
      }
    });
    if(p < 85){
      setTimeout(stepProgress, 300 + Math.random()*600);
    } else if (p < 97){
      setTimeout(stepProgress, 800 + Math.random()*900);
    } else {
      setTimeout(()=>{
        if(progressEl) progressEl.style.width = '100%';
        if(meta) meta.textContent = '100%';
        setTimeout(enterGame, 700);
      }, 900 + Math.random()*700);
    }
  }
  stepProgress();

  let clicks = 0;
  let moving = false;

  function enterGame(){
    if(loader) loader.style.display = 'none';
    if(game) game.style.display = 'flex';

    try{
      const ob = document.querySelector('.obelix');
      if(ob) ob.style.display = 'block';
    }catch(e){}

    try{ if(game) game.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.9,.3,1)'}); }catch(e){}

    btn.style.position = 'fixed';
    try{
      const cx = Math.round((window.innerWidth - btn.offsetWidth)/2);
      const cy = Math.round((window.innerHeight - btn.offsetHeight)/2);
      btn.style.left = cx + 'px';
      btn.style.top = cy + 'px';
    }catch(e){}

    setInterval(()=>{
      if(Math.random() < 0.55) jiggleBtn();
      if(Math.random() < 0.35) moveBtnRandom();
    }, 1100);
  }

  if(btn) btn.addEventListener('click', ()=>{
    clicks++;
    if(counter) counter.textContent = clicks + ' / 100';
    try{ btn.animate([{transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:160}); }catch(e){}
    if(Math.random() < Math.min(0.25, clicks/400)) moveBtnRandom();
    if(clicks >= 100){
      finishSequence();
    }
  });

  function jiggleBtn(){
    try{
      btn.animate([
        {transform:'translateX(0) rotate(0deg)'},
        {transform:'translateX(-6px) rotate(-3deg)'},
        {transform:'translateX(6px) rotate(3deg)'},
        {transform:'translateX(0) rotate(0deg)'}
      ],{duration:520});
    }catch(e){}
  }

  function moveBtnRandom(){
    if(moving) return;
    moving = true;
    const pad = 12;
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth - pad);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight - pad);
    const travelFactor = Math.min(1, 0.6 + (clicks / 120));
    const edgeBias = Math.random() < (0.5 + clicks/120);
    let x, y;
    if(edgeBias){
      x = Math.random() < 0.5 ? Math.round(Math.random() * maxX * 0.18) : Math.round(maxX - Math.random() * maxX * 0.18);
      y = Math.random() < 0.5 ? Math.round(Math.random() * maxY * 0.18) : Math.round(maxY - Math.random() * maxY * 0.18);
    } else {
      x = Math.round(Math.random() * maxX * travelFactor + Math.random() * (maxX * (1 - travelFactor)));
      y = Math.round(Math.random() * maxY * travelFactor + Math.random() * (maxY * (1 - travelFactor)));
    }
    const fromLeft = btn.style.left || '0px';
    const fromTop = btn.style.top || '0px';
    try{
      btn.animate([
        {left: fromLeft, top: fromTop},
        {left: x + 'px', top: y + 'px'}
      ], {duration:520, easing: 'cubic-bezier(.22,.9,.35,1)'}).onfinish = function(){
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        moving = false;
      };
    }catch(e){
      btn.style.left = x + 'px'; btn.style.top = y + 'px'; moving = false;
    }
  }

  function finishSequence(){
    if(game) game.style.display = 'none';
    if(final) final.style.display = 'flex';
    try{
      const ob = document.querySelector('.obelix');
      if(ob) ob.style.display = 'none';
    }catch(e){}
    try{ final.animate(
      [{opacity:0,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}],
      {duration:420, easing: 'cubic-bezier(.2,.9,.3,1)'}
    ); }catch(e){}
    for(let i=0;i<20;i++){
      const el = document.createElement('div');
      el.textContent = '•';
      el.style.position = 'absolute';
      el.style.left = (20 + Math.random()*90) + '%';
      el.style.top = (10 + Math.random()*60) + '%';
      el.style.fontSize = (12+Math.random()*30)+'px';
      el.style.color = ['#ff6b6b','#ffd166','#8b5cf6','#6be3ff'][Math.floor(Math.random()*4)];
      el.style.opacity = '0.85';
      el.style.transform = 'translateY(0)';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);
      const dur = 1000+Math.random()*1600;
      try{ el.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-140px)',opacity:0}],{duration:dur}).onfinish = ()=>el.remove(); }catch(e){ setTimeout(()=>el.remove(), dur); }
    }

    try{ localStorage.setItem('nuit_secret','snake'); localStorage.setItem('nuit_passed','1'); }catch(e){}
    // After finishing the machine, return the user to the village rather than the forêt
    setTimeout(()=>{ location.href = '/'; }, 900);
  }

  window.__rubeGoldberg = { start: enterGame };

})();
