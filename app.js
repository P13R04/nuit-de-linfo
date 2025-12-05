document.addEventListener('DOMContentLoaded', function(){
  const zones = document.querySelectorAll('.zone');
  const panel = document.getElementById('panel');

  zones.forEach(z=>{
    z.addEventListener('click', ()=>{
      const t = z.dataset.target;
      const page = z.dataset.page;
      // If a page is provided, navigate to it (same tab)
      if(page){
        window.location.href = page;
        return;
      }
      if(t === 'taverne'){
        panel.textContent = 'La Taverne: ici on parle de contributions, idées folles et snacks.';
      } else if(t === 'forge'){
        panel.textContent = 'Forge: dépôt du village — issues, PRs et menhirs numériques.';
      } else if(t === 'temple'){
        panel.innerHTML = 'Temple: lieu sacré des licences libres. <a href="/roman/">Parler au Romain</a>';
      } else {
        panel.textContent = 'Zone: ' + t;
      }
    });
  });

  // keyboard accessibility: focus zones via tab and press Enter
  document.querySelectorAll('.zone').forEach(z=>{
    z.setAttribute('tabindex','0');
    z.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') z.click(); });
  });

  // minimal placeholder for audio visualizer (animated bars)
  const visual = document.getElementById('visual');
  if(visual){
    let bars = [];
    for(let i=0;i<20;i++){
      const b = document.createElement('div');
      b.className = 'vbar';
      b.style.width = '4%';
      b.style.display='inline-block';
      b.style.margin='0 1%';
      b.style.height = (10 + Math.random()*70) + 'px';
      b.style.background = 'linear-gradient(180deg,#c65d1e,#ffb86b)';
      b.style.borderRadius='3px';
      visual.appendChild(b);
      bars.push(b);
    }
    setInterval(()=>{
      bars.forEach(b=> b.style.height = (8 + Math.random()*80) + 'px');
    }, 350);
  }
});
