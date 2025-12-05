// snake_launcher.js — simple unlock mechanism for hidden Snake
document.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('pwd');
  const btn = document.getElementById('unlock');
  const status = document.getElementById('status');
  const gameRoot = document.getElementById('game-root');
  if(!input || !btn || !status) return;

  function unlockWith(p){
    const stored = (() => { try{ return localStorage.getItem('nuit_secret'); }catch(e){ return null;} })();
    const passed = (() => { try{ return localStorage.getItem('nuit_passed') === '1'; }catch(e){ return false;} })();
    if(p === stored && passed){
      status.textContent = 'Déverrouillé — lancement du Snake...';
      gameRoot.innerHTML = '<iframe src="/snake/index.html" style="width:100%;height:520px;border:0;border-radius:8px"></iframe>';
      return true;
    }
    if(p === stored && !passed){
      status.textContent = "Mot de passe correct, mais vous devez d'abord visiter la Forêt pour l'activer.";
      return false;
    }
    status.textContent = 'Mot de passe incorrect.'; return false;
  }

  btn.addEventListener('click', ()=>{
    const val = input.value.trim();
    if(!val) return status.textContent = 'Entrez un mot de passe.';
    unlockWith(val);
  });

  try{
    const auto = localStorage.getItem('nuit_secret');
    if(auto){ input.value = auto; unlockWith(auto); }
  }catch(e){}
});
