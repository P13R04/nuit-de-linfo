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

  // Fake progress: slow, with small pauses to feel "machine-like"
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
    // variable increments to simulate complexity
    const inc = Math.max(1, Math.round(Math.random()*8));
    p = Math.min(99, p+inc);
    progressEl.style.width = p + '%';
    meta.textContent = p + '%';
    // trigger milestone messages and small mech interaction
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
      // quicker early
      setTimeout(stepProgress, 300 + Math.random()*600);
    } else if (p < 97){
      // slow down
      setTimeout(stepProgress, 800 + Math.random()*900);
    } else {
      // final tiny step, then transition to mini game
      setTimeout(()=>{
        progressEl.style.width = '100%';
        meta.textContent = '100%';
        setTimeout(enterGame, 700);
      }, 900 + Math.random()*700);
    }
  }
  stepProgress();

  // --- Mini-jeu clicker ---
  let clicks = 0;
  let moving = false;

  function enterGame(){
    loader.style.display = 'none';
    game.style.display = 'flex';

    // show Obelix during the clicker
    try{
      const ob = document.querySelector('.obelix');
      if(ob) ob.style.display = 'block';
    }catch(e){/* ignore */}

    // subtle entrance animation
    game.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.9,.3,1)'});

    // occasionally make the button jiggle or move
    // position the button relative to the viewport so it can roam the whole page
    btn.style.position = 'fixed';
    try{
      const cx = Math.round((window.innerWidth - btn.offsetWidth)/2);
      const cy = Math.round((window.innerHeight - btn.offsetHeight)/2); // center in viewport
      btn.style.left = cx + 'px';
      btn.style.top = cy + 'px';
    }catch(e){/* ignore if sizing not ready */}

    setInterval(()=>{
      if(Math.random() < 0.55) jiggleBtn();
      if(Math.random() < 0.35) moveBtnRandom();
    }, 1100);
  }

  btn.addEventListener('click', ()=>{
    clicks++;
    counter.textContent = clicks + ' / 100';

    // small visual feedback
    btn.animate([{transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:160});

    // as clicks increase, sometimes the button flees
    if(Math.random() < Math.min(0.25, clicks/400)) moveBtnRandom();

    if(clicks >= 100){
      finishSequence();
    }
  });

  function jiggleBtn(){
    btn.animate([
      {transform:'translateX(0) rotate(0deg)'},
      {transform:'translateX(-6px) rotate(-3deg)'},
      {transform:'translateX(6px) rotate(3deg)'},
      {transform:'translateX(0) rotate(0deg)'}
    ],{duration:520});
  }

  function moveBtnRandom(){
    if(moving) return;
    moving = true;
    // compute random position across the entire viewport (fixed positioning)
    const pad = 12;
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth - pad);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight - pad);

    // travelFactor grows with clicks so movements get larger as user progresses

    // increased base travelFactor so jumps are wider earlier
    const travelFactor = Math.min(1, 0.6 + (clicks / 120));

    // bias towards larger jumps by favoring edges as clicks increase
    // higher edge bias to favour jumps toward edges more often
    const edgeBias = Math.random() < (0.5 + clicks/120);
    let x, y;
    if(edgeBias){
      // place near an edge (left/right and top/bottom)
      x = Math.random() < 0.5 ? Math.round(Math.random() * maxX * 0.18) : Math.round(maxX - Math.random() * maxX * 0.18);
      y = Math.random() < 0.5 ? Math.round(Math.random() * maxY * 0.18) : Math.round(maxY - Math.random() * maxY * 0.18);
    } else {
      // wide random placement scaled by travelFactor
      x = Math.round(Math.random() * maxX * travelFactor + Math.random() * (maxX * (1 - travelFactor)));
      y = Math.round(Math.random() * maxY * travelFactor + Math.random() * (maxY * (1 - travelFactor)));
    }

    // animate from current absolute position (fallback to 0)
    const fromLeft = btn.style.left || '0px';
    const fromTop = btn.style.top || '0px';
    btn.animate([{left: fromLeft, top: fromTop}, {left: x + 'px', top: y + 'px'}],{duration:520,easing:'cubic-bezier(.22,.9,.35,1)'}).onfinish = ()=>{
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      moving = false;
    };
  }

  // Final sequence after reaching goal
  function finishSequence(){
    game.style.display = 'none';
    final.style.display = 'flex';

    // hide Obelix when finished
    try{
      const ob = document.querySelector('.obelix');
      if(ob) ob.style.display = 'none';
    }catch(e){/* ignore */}

    // small flourish then reveal placeholder in red
    final.animate([{opacity:0,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.2,.9,.3,1)'});

    // optionally: tiny celebratory confetti (canvas-less, simple elements)
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
      el.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-140px)',opacity:0}],{duration:dur}).onfinish = ()=>el.remove();
    }
  }

  // For integration: expose a small API to trigger game directly
  window.__rubeGoldberg = {
    start: enterGame
  };

})();