// Simple Snake implementation on a 16x16 grid
(function(){
  const GRID = 16;
  const board = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const statusEl = document.getElementById('status');
  const overlay = document.getElementById('overlay');
  const overlayMsg = document.getElementById('overlayMsg');
  const overlayRestart = document.getElementById('overlayRestart');
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startBtn');

  // available images in ./images — used for head/body
  const IMAGE_FILES = [
    './images/abraracourcix-Photoroom.png',
    './images/Obelix_tete.png',
    './images/ordralfabetix.png',
    "./images/tete-d'asterix.png"
  ];
  // enforce Asterix as the head image; body images are chosen from the others
  const ASTERIX_FILE = "./images/tete-d'asterix.png";
  const BODY_IMAGES = IMAGE_FILES.filter(f => f !== ASTERIX_FILE);
  let headImage = ASTERIX_FILE;

  let cells = [];
  let snake = [];
  let dir = {x:1,y:0};
  let nextDir = {x:1,y:0};
  let food = null;
  let running = false;
  let tickInterval = 150; // ms
  let timer = null;
  let score = 0;

  function idx(x,y){ return y*GRID + x; }

  function createGrid(){
    board.innerHTML = '';
    cells = [];
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        const c = document.createElement('div');
        c.className = 'cell';
        c.dataset.x = x; c.dataset.y = y;
        board.appendChild(c);
        cells.push(c);
      }
    }
  }

  function placeFood(){
    const free = [];
    for(let y=0;y<GRID;y++) for(let x=0;x<GRID;x++){
      if(!snake.some(s=>s.x===x&&s.y===y)) free.push({x,y});
    }
    if(free.length===0){
      // win condition
      endGame(true);
      return;
    }
    const f = free[Math.floor(Math.random()*free.length)];
    food = f;
  }

  function render(){
    // clear
    cells.forEach(c=>{ c.classList.remove('snake','head','food'); c.style.backgroundImage = ''; });
    // food
    if(food){
      const fcell = cells[idx(food.x, food.y)];
      if(fcell) fcell.classList.add('food');
    }
    // snake
    snake.forEach((s,i)=>{
      const c = cells[idx(s.x,s.y)];
      if(!c) return;
      c.classList.add('snake');
      // apply image for this segment (img property set on segment objects)
      if(s.img) c.style.backgroundImage = `url("${s.img}")`;
      if(i===snake.length-1) c.classList.add('head');
    });
    scoreEl.textContent = score;
  }

  function step(){
    // safety: do nothing when not running
    if(!running) return;
    dir = nextDir; // commit direction
    const head = snake[snake.length-1];
    const nx = head.x + dir.x;
    const ny = head.y + dir.y;
    // collisions with wall
    if(nx < 0 || nx >= GRID || ny < 0 || ny >= GRID){
      endGame(false);
      return;
    }
    // self collision
    if(snake.some(s=>s.x===nx && s.y===ny)){
      endGame(false);
      return;
    }
    const grew = (food && food.x===nx && food.y===ny);
    // previous head becomes a body segment — assign it a random body image
    const prevHead = snake[snake.length-1];
    if(prevHead) prevHead.img = BODY_IMAGES[Math.floor(Math.random()*BODY_IMAGES.length)];
    // push new head with the headImage (Asterix)
    snake.push({x:nx,y:ny, img: headImage});
    if(grew){ score++; food = null; placeFood(); }
    else { snake.shift(); }
    render();
  }

  function start(){
    // begin stepping; reset should already have been called on start click
    running = true;
    statusEl.textContent = 'En jeu';
    timer = setInterval(step, tickInterval);
  }

  function reset(){
    clearInterval(timer);
    timer = null;
    // start snake centered, length 3
    // head is always Asterix; body segments initialized with random body images
    headImage = ASTERIX_FILE;
    snake = [];
    const initCoords = [ {x:6,y:8},{x:7,y:8},{x:8,y:8} ];
    for(let i=0;i<initCoords.length;i++){
      const coord = initCoords[i];
      const isHead = (i === initCoords.length-1);
      snake.push({ x: coord.x, y: coord.y, img: isHead ? headImage : BODY_IMAGES[Math.floor(Math.random()*BODY_IMAGES.length)] });
    }
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    score = 0; food = null; running = false;
    placeFood();
    render();
    // keep any game-over overlay hidden on reset
    if(overlay) overlay.hidden = true;
    statusEl.textContent = 'Appuyez sur une flèche pour démarrer.';
  }

  function endGame(win){
    clearInterval(timer); timer = null; running = false;
    overlay.hidden = false;
    overlayMsg.textContent = win ? 'Vous avez gagné !' : 'Game Over';
    statusEl.textContent = win ? 'Victoire' : 'Game Over';
  }

  // Input
  window.addEventListener('keydown', (e)=>{
    const key = e.key;
    let nd = null;
    if(key === 'ArrowLeft' || key === 'q' || key === 'Q') nd = {x:-1,y:0};
    if(key === 'ArrowRight' || key === 'd' || key === 'D') nd = {x:1,y:0};
    if(key === 'ArrowUp' || key === 'z' || key === 'Z' || key === 'w' || key === 'W') nd = {x:0,y:-1};
    if(key === 'ArrowDown' || key === 's' || key === 'S') nd = {x:0,y:1};
    if(nd){
      // prevent reverse
      if(!(nd.x === -dir.x && nd.y === -dir.y)) nextDir = nd;
      // start the game loop on first input only if the board is visible
      // and no Game Over overlay is showing (avoid accidental immediate restart)
      const canStartByKey = !running && board && !board.classList.contains('hidden') && (!overlay || overlay.hidden);
      if(canStartByKey){ start(); }
      e.preventDefault();
    }
  });

  overlayRestart.addEventListener('click', ()=>{ reset(); start(); });

  // Start screen handling: hide board behind a simple button at load
  if(startBtn){
    startBtn.addEventListener('click', ()=>{
      // reveal the board and initialize the game state; do not start moving until first key press
      if(startScreen) startScreen.hidden = true;
      if(board) board.classList.remove('hidden');
      reset();
    });
  }

  // init: create grid, hide board and show start button
  createGrid();
  if(board) board.classList.add('hidden');
  if(overlay) overlay.hidden = true; // ensure no Game Over at load
  if(startScreen) startScreen.hidden = false;
  statusEl.textContent = 'Cliquez sur Démarrer pour afficher le plateau.';

  // we intentionally do not call reset/start here; reset() will be called when Start is clicked

  // expose for debugging
  window.__simpleSnake = {reset,start,step};

})();
