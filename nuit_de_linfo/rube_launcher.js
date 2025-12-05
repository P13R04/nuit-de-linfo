// rube_launcher.js — small helper to simulate running the Rube Goldberg and revealing a password
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('run');
  const secret = document.getElementById('secret');
  if(!btn || !secret) return;
  btn.addEventListener('click', ()=>{
    btn.disabled = true; btn.textContent = 'Machine en cours...';
    // simulate running for 2s
    setTimeout(()=>{
      const pwd = 'nuit-' + Math.random().toString(36).slice(2,10);
      secret.textContent = pwd;
      // store reveal so chatbot or other pages can access it via localStorage
      try{ localStorage.setItem('nuit_secret', pwd); }catch(e){}
      btn.textContent = 'Relancer la machine'; btn.disabled = false;
    }, 1800);
  });
});
