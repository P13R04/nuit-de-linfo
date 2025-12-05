// snake_launcher.js — simple unlock mechanism for hidden Snake
document.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('pwd');
  const btn = document.getElementById('unlock');
  const status = document.getElementById('status');
  const gameRoot = document.getElementById('game-root');
  if(!input || !btn || !status) return;

  function unlockWith(p){
    // check localStorage secret as fallback
    const stored = (() => { try{ return localStorage.getItem('nuit_secret'); }catch(e){ return null;} })();
    if(p === stored){
      status.textContent = 'Déverrouillé — lancement du Snake...';
      // For now we just show a placeholder; the user will provide the real Snake code.
      gameRoot.innerHTML = '<div style="margin-top:12px;padding:12px;background:#000;color:#0f0;border-radius:6px">Snake placeholder — code à remplacer</div>';
      return true;
    }
    status.textContent = 'Mot de passe incorrect.'; return false;
  }

  btn.addEventListener('click', ()=>{
    const val = input.value.trim();
    if(!val) return status.textContent = 'Entrez un mot de passe.';
    unlockWith(val);
  });

  // Also allow immediate unlock if the secret is already in localStorage
  try{
    const auto = localStorage.getItem('nuit_secret');
    if(auto){ input.value = auto; unlockWith(auto); }
  }catch(e){}
});
