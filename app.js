(() => {
"use strict";
const games = [
{id:"snake",name:"Neon Snake",category:"Arcade",emoji:"🐍",desc:"Eat the glowing food. Don't hit the walls or yourself.",glow:"#8cff4d"},
{id:"ttt",name:"Tic Tac Toe",category:"Puzzle",emoji:"⭕",desc:"Get three marks in a row against the computer.",glow:"#9b7bff"},
{id:"rps",name:"Rock Paper Scissors",category:"Casual",emoji:"✊",desc:"Choose your move and beat the computer.",glow:"#ff9e57"},
{id:"guess",name:"Number Hunt",category:"Brain",emoji:"🔢",desc:"Find the secret number from 1 to 100.",glow:"#5de3e8"},
{id:"memory",name:"Memory Match",category:"Puzzle",emoji:"🧠",desc:"Flip cards and find all matching pairs.",glow:"#9b7bff"},
{id:"reaction",name:"Reaction Test",category:"Arcade",emoji:"⚡",desc:"Wait for green, then click as fast as possible.",glow:"#c6ff4d"},
{id:"clicker",name:"Click Rush",category:"Casual",emoji:"👆",desc:"Click as many times as you can in 10 seconds.",glow:"#ff9e57"},
{id:"dice",name:"Dice Duel",category:"Casual",emoji:"🎲",desc:"Roll against the computer. Highest roll wins.",glow:"#5de3e8"},
{id:"typing",name:"Typing Sprint",category:"Brain",emoji:"⌨️",desc:"Type the displayed phrase accurately.",glow:"#9b7bff"},
{id:"math",name:"Quick Maths",category:"Brain",emoji:"➗",desc:"Solve as many quick maths questions as you can.",glow:"#c6ff4d"},
{id:"hangman",name:"Word Rescue",category:"Puzzle",emoji:"🔤",desc:"Guess the hidden word one letter at a time.",glow:"#ff9e57"},
{id:"2048",name:"2048",category:"Puzzle",emoji:"🔲",desc:"Combine matching tiles to reach 2048. Use arrow keys or swipe.",glow:"#9b7bff"},
{id:"mines",name:"Mine Finder",category:"Brain",emoji:"💣",desc:"Reveal safe squares. Avoid the hidden mines.",glow:"#ff655f"},
{id:"simon",name:"Simon Says",category:"Memory",emoji:"🎨",desc:"Repeat the growing sequence of colours.",glow:"#5de3e8"},
{id:"whack",name:"Whack-a-Mole",category:"Arcade",emoji:"🐹",desc:"Hit the mole as many times as possible in 20 seconds.",glow:"#c6ff4d"},
{id:"pong",name:"Neon Pong",category:"Sports",emoji:"🏓",desc:"Move your paddle with mouse, touch or W/S. First to 5.",glow:"#5de3e8"},
{id:"breakout",name:"Brick Breaker",category:"Arcade",emoji:"🧱",desc:"Break every brick with the ball. Move with mouse or arrows.",glow:"#ff9e57"},
{id:"dodge",name:"Meteor Dodge",category:"Action",emoji:"☄️",desc:"Move left and right to avoid falling meteors.",glow:"#ff655f"},
{id:"color",name:"Color Reflex",category:"Casual",emoji:"🌈",desc:"Choose the colour named by the word, not its ink.",glow:"#9b7bff"},
{id:"coin",name:"Coin Flip",category:"Casual",emoji:"🪙",desc:"Call heads or tails and test your luck.",glow:"#c6ff4d"}
];
const $=s=>document.querySelector(s), area=$("#gameArea"), modal=$("#gameModal");
let current=null, cleanup=()=>{}, score=0, soundOn=false, toastTimer;
const storeKey="arcadeworld_v1";
let stats=loadStats();
function loadStats(){try{return JSON.parse(localStorage.getItem(storeKey))||{played:0,scores:[],favorites:{}}}catch{return{played:0,scores:[],favorites:{}}}}
function saveStats(){localStorage.setItem(storeKey,JSON.stringify(stats));renderStats()}
function renderStats(){
 $("#playedCount").textContent=stats.played;
 const best=stats.scores.reduce((m,x)=>Math.max(m,x.score),0);$("#bestScore").textContent=best;
 const fav=Object.entries(stats.favorites).sort((a,b)=>b[1]-a[1])[0];$("#favoriteGame").textContent=fav?games.find(g=>g.id===fav[0])?.name||"—":"—";
 const top=[...stats.scores].sort((a,b)=>b.score-a.score).slice(0,5);
 $("#leaderboardList").innerHTML=top.length?top.map((x,i)=>`<div class="leader-item"><span>${i+1}. ${escapeHTML(x.name)}</span><strong>${x.score}</strong></div>`).join(""):'<p class="muted">Play a game to add your first score.</p>';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderGames(){
 const q=$("#searchInput").value.toLowerCase(),cat=$("#categoryFilter").value;
 const filtered=games.filter(g=>(cat==="All"||g.category===cat)&&(g.name.toLowerCase().includes(q)||g.desc.toLowerCase().includes(q)));
 $("#gameGrid").innerHTML=filtered.length?filtered.map(g=>`<article class="game-card" data-id="${g.id}" tabindex="0" role="button" aria-label="Play ${g.name}"><div class="card-art" style="--glow:${g.glow}"><span class="game-emoji">${g.emoji}</span></div><div class="card-info"><div class="card-top"><h3>${g.name}</h3><span class="game-category">${g.category}</span></div><p>${g.desc}</p><span class="play-arrow">↗</span></div></article>`).join(""):'<div class="empty-state">No games match your search.</div>';
}
function setScore(n){score=Math.max(0,Math.floor(n));$("#liveScore").textContent=score}
function finishGame(message="Game over!"){
 cleanup();cleanup=()=>{};$("#gameHint").textContent=message;
 if(current){stats.played++;stats.favorites[current.id]=(stats.favorites[current.id]||0)+1;stats.scores.push({name:current.name,score,date:Date.now()});stats.scores=stats.scores.slice(-100);saveStats()}
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1900)}
function openGame(id){
 current=games.find(g=>g.id===id);if(!current)return;
 setScore(0);$("#gameTitle").textContent=current.name;$("#gameCategory").textContent=current.category.toUpperCase();$("#gameDescription").textContent=current.desc;$("#gameHint").textContent="";modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";startGame(id);
}
function closeGame(){cleanup();cleanup=()=>{};modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";current=null}
function startGame(id){cleanup();cleanup=()=>{};area.innerHTML="";setScore(0);$("#gameHint").textContent="";const start=handlers[id];if(start)start()}
function button(text,fn,cls="action-btn"){const b=document.createElement("button");b.textContent=text;b.className=cls;b.addEventListener("click",fn);return b}
function message(t){const p=document.createElement("div");p.className="feedback";p.textContent=t;area.append(p);return p}
function input(placeholder="Enter here"){const i=document.createElement("input");i.placeholder=placeholder;i.autocomplete="off";area.append(i);return i}
function row(){const d=document.createElement("div");d.className="button-row";area.append(d);return d}
function canvas(w=400,h=280){const c=document.createElement("canvas");c.width=w;c.height=h;c.className="canvas-game";area.append(c);return [c,c.getContext("2d")]}
function end(msg){finishGame(msg)}
const handlers={};

// 1 Snake
handlers.snake=()=>{
 const [c,x]=canvas(400,300),cell=20,cols=20,rows=15;let snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}],dir={x:1,y:0},next={...dir},food,alive=true,timer;
 const randFood=()=>{do{food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))};randFood();
 function draw(){x.fillStyle="#07101c";x.fillRect(0,0,c.width,c.height);x.fillStyle="#c6ff4d";x.fillRect(food.x*cell+3,food.y*cell+3,14,14);snake.forEach((p,i)=>{x.fillStyle=i?"#6d9d36":"#d7ff86";x.fillRect(p.x*cell+1,p.y*cell+1,18,18)})}
 function tick(){dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.y<0||h.x>=cols||h.y>=rows||snake.some(p=>p.x===h.x&&p.y===h.y)){alive=false;clearInterval(timer);end("Snake hit! Final score: "+score);return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){setScore(score+10);randFood()}else snake.pop();draw()}
 function key(e){const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}}[e.key];if(m&&m.x!==-dir.x&&m.y!==-dir.y){next=m;e.preventDefault()}}
 window.addEventListener("keydown",key);timer=setInterval(tick,125);draw();cleanup=()=>{clearInterval(timer);window.removeEventListener("keydown",key)};
};

// 2 Tic tac toe
handlers.ttt=()=>{
 let board=Array(9).fill(""),over=false;const b=document.createElement("div");b.className="board ttt-board";area.append(b);const msg=message("Your turn — you are X.");
 const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 function winner(){for(const w of wins)if(board[w[0]]&&w.every(i=>board[i]===board[w[0]]))return board[w[0]];return board.every(Boolean)?"draw":null}
 function draw(){b.innerHTML="";board.forEach((v,i)=>{const bt=button(v||" ",()=>move(i),"ttt-cell");bt.disabled=!!v||over;b.append(bt)})}
 function move(i){if(over||board[i])return;board[i]="X";let win=winner();if(win){done(win);return}let empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);if(empty.length){let choice=empty.find(i=>{const t=[...board];t[i]="O";return wins.some(w=>w.every(j=>t[j]==="O"))});if(choice===undefined)choice=empty.find(i=>{const t=[...board];t[i]="X";return wins.some(w=>w.every(j=>t[j]==="X"))});if(choice===undefined)choice=empty[Math.floor(Math.random()*empty.length)];board[choice]="O"}win=winner();if(win)done(win);else msg.textContent="Your turn — X.";draw()}
 function done(w){over=true;msg.textContent=w==="draw"?"Draw!":w==="X"?"You win!":"Computer wins.";if(w==="X")setScore(100);else if(w==="draw")setScore(25);finishGame(msg.textContent)}
 draw();
};

// 3 RPS
handlers.rps=()=>{const choices=[["✊","Rock"],["✋","Paper"],["✌️","Scissors"]];const m=message("Choose your move.");const r=row();choices.forEach(([e,n])=>r.append(button(e+" "+n,()=>{const c=choices[Math.floor(Math.random()*3)][1];const win=n===c?"draw":({Rock:"Scissors",Paper:"Rock",Scissors:"Paper"}[n]===c?"win":"lose");m.textContent=`You: ${n} · Computer: ${c} · ${win==="draw"?"Draw":win==="win"?"You win!":"You lose."}`;if(win==="win")setScore(score+10);else if(win==="lose")setScore(Math.max(0,score-3))})) )};

// 4 Guess
handlers.guess=()=>{const secret=Math.ceil(Math.random()*100);let tries=0;const m=message("Guess a number between 1 and 100.");const i=input("Your number");i.type="number";const b=button("GUESS",check);area.append(b);i.addEventListener("keydown",e=>{if(e.key==="Enter")check()});function check(){const n=Number(i.value);if(!Number.isInteger(n)||n<1||n>100){m.textContent="Enter a whole number from 1 to 100.";return}tries++;if(n===secret){setScore(Math.max(10,110-tries*5));m.textContent=`Correct! You found it in ${tries} tries.`;b.disabled=true;i.disabled=true;finishGame("Number found!")}else m.textContent=n<secret?"Too low — try higher.":"Too high — try lower."}};

// 5 Memory
handlers.memory=()=>{const icons=["🍉","🚀","🐸","🎧","🍩","⚽","🌟","🦊"];let deck=[...icons,...icons].sort(()=>Math.random()-.5),first=null,lock=false,matches=0,moves=0;const b=document.createElement("div");b.className="memory-board";area.append(b);const m=message("Find all 8 pairs.");function draw(){b.innerHTML="";deck.forEach((v,i)=>{const bt=button(flipped.has(i)||matched.has(i)?v:"?",()=>flip(i),"memory-card");if(flipped.has(i)||matched.has(i))bt.classList.add("flipped");b.append(bt)})}let flipped=new Set(),matched=new Set();function flip(i){if(lock||matched.has(i)||flipped.has(i))return;flipped.add(i);draw();if(flipped.size===2){moves++;const [a,z]=[...flipped];if(deck[a]===deck[z]){matched.add(a);matched.add(z);flipped.clear();matches++;setScore(matches*10);m.textContent=`Pairs: ${matches}/8 · Moves: ${moves}`;if(matches===8)finishGame("All pairs matched!")}else{lock=true;setTimeout(()=>{flipped.clear();lock=false;draw();m.textContent=`Pairs: ${matches}/8 · Moves: ${moves}`},750)}}}draw()};

// 6 Reaction
handlers.reaction=()=>{const b=button("WAIT FOR GREEN",()=>{}, "big-tap");area.append(b);const m=message("The button will turn green. Click only then.");let state="wait",timer,start;const delay=1200+Math.random()*3000;timer=setTimeout(()=>{state="ready";b.classList.add("ready");b.textContent="CLICK NOW!";start=performance.now()},delay);b.onclick=()=>{if(state==="wait"){clearTimeout(timer);state="early";m.textContent="Too early! Restart to try again.";b.disabled=true;finishGame("False start.")}else if(state==="ready"){const ms=Math.round(performance.now()-start);setScore(Math.max(0,1000-ms));m.textContent=`Your reaction time: ${ms} ms`;b.disabled=true;finishGame("Reaction test complete.")}};cleanup=()=>clearTimeout(timer)};

// 7 Clicker
handlers.clicker=()=>{let left=10,active=true;const b=button("CLICK AS FAST AS YOU CAN",()=>{if(active)setScore(score+1)},"big-tap");area.append(b);const m=message("10 seconds. Ready?");const t=setInterval(()=>{left--;m.textContent=`Time left: ${left}s`;if(left<=0){clearInterval(t);active=false;b.disabled=true;m.textContent=`Time's up! You clicked ${score} times.`;finishGame("Click Rush finished.")}},1000);cleanup=()=>clearInterval(t)};

// 8 Dice
handlers.dice=()=>{const m=message("Roll the dice. Highest roll wins.");const r=row();r.append(button("🎲 ROLL DICE",()=>{const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);m.textContent=`You rolled ${a}. Computer rolled ${b}. ${a>b?"You win!":a===b?"Draw!":"Computer wins."}`;if(a>b)setScore(score+10);else if(a===b)setScore(score+3)}))};

// 9 Typing
handlers.typing=()=>{const phrases=["practice makes progress","small steps every day","arcade world is fun","keep your focus sharp","javascript powers the web"];const phrase=phrases[Math.floor(Math.random()*phrases.length)];const p=document.createElement("div");p.className="big-number";p.style.fontSize="clamp(18px,4vw,30px)";p.textContent=phrase;area.append(p);const i=input("Type the phrase exactly");const m=message("Complete the phrase to score.");const b=button("CHECK",check);area.append(b);i.addEventListener("keydown",e=>{if(e.key==="Enter")check()});function check(){if(i.value.trim()===phrase){setScore(100);m.textContent="Perfect typing!";finishGame("Phrase completed.")}else m.textContent="Not quite. Check spelling and spaces."}};

// 10 Math
handlers.math=()=>{let q=0;const m=message("Answer as many as you can. 30 seconds.");const p=document.createElement("div");p.className="big-number";area.append(p);const i=input("Answer");i.type="number";const b=button("SUBMIT",check);area.append(b);let a,z,op,answer;function next(){a=1+Math.floor(Math.random()*20);z=1+Math.floor(Math.random()*15);op=["+","−","×"][Math.floor(Math.random()*3)];answer=op==="+"?a+z:op==="−"?a-z:a*z;p.textContent=`${a} ${op} ${z} = ?`;i.value="";i.focus()}function check(){if(Number(i.value)===answer){q++;setScore(score+10);m.textContent=`Correct answers: ${q}`}else m.textContent=`Incorrect. Correct answer: ${answer}`;next()}i.addEventListener("keydown",e=>{if(e.key==="Enter")check()});const t=setTimeout(()=>{b.disabled=true;i.disabled=true;m.textContent=`Time! You solved ${q} questions.`;finishGame("Math sprint complete.")},30000);cleanup=()=>clearTimeout(t);next()};

// 11 Hangman
handlers.hangman=()=>{const words=["JAVASCRIPT","COMPUTER","GALAXY","ARCADE","PUZZLE","KEYBOARD","ROCKET"];const word=words[Math.floor(Math.random()*words.length)];let used=new Set(),mistakes=0,over=false;const shown=document.createElement("div");shown.className="word-letters";area.append(shown);const m=message("Guess the word. You have 6 mistakes.");const letters=document.createElement("div");letters.className="letter-grid";area.append(letters);function draw(){shown.innerHTML=[...word].map(c=>`<span>${used.has(c)?c:" "}</span>`).join("");letters.innerHTML="";"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(c=>{const b=button(c,()=>pick(c),"");b.disabled=used.has(c)||over;letters.append(b)})}function pick(c){if(over)return;used.add(c);if(!word.includes(c))mistakes++;if([...word].every(c=>used.has(c))){over=true;setScore(100);m.textContent=`You won! The word was ${word}.`;finishGame("Word rescued.")}else if(mistakes>=6){over=true;m.textContent=`Game over. The word was ${word}.`;finishGame("Word not found.")}else m.textContent=`Mistakes: ${mistakes}/6`;draw()}draw()};

// 12 2048
handlers["2048"]=()=>{let grid=Array.from({length:4},()=>Array(4).fill(0)),over=false;const board=document.createElement("div");board.className="tile-board";area.append(board);const m=message("Use arrow keys or swipe. Combine equal tiles.");function add(){let empty=[];grid.forEach((r,y)=>r.forEach((v,x)=>{if(!v)empty.push([y,x])}));if(empty.length){const [y,x]=empty[Math.floor(Math.random()*empty.length)];grid[y][x]=Math.random()<.9?2:4}}function draw(){board.innerHTML="";grid.flat().forEach(v=>{const d=document.createElement("div");d.className="tile v"+v;d.textContent=v||"";board.append(d)})}function move(dir){if(over)return;let changed=false;for(let n=0;n<4;n++){let line=dir==="left"?grid[n].slice():dir==="right"?grid[n].slice().reverse():grid.map(r=>r[n]);let compact=line.filter(Boolean);for(let i=0;i<compact.length-1;i++)if(compact[i]===compact[i+1]){compact[i]*=2;setScore(score+compact[i]);compact.splice(i+1,1)}while(compact.length<4)compact.push(0);if(dir==="right")compact.reverse();for(let i=0;i<4;i++){let y=dir==="up"||dir==="down"?i:n,x=dir==="up"||dir==="down"?n:i,v=dir==="up"?compact[i]:dir==="down"?compact[3-i]:compact[i];if(grid[y][x]!==v)changed=true;grid[y][x]=v}}if(changed){add();draw();if(grid.flat().includes(2048)){over=true;m.textContent="2048! You win.";finishGame("2048 achieved.")}}}function key(e){const d={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"}[e.key];if(d){e.preventDefault();move(d)}}window.addEventListener("keydown",key);let sx=0,sy=0;board.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});board.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))>20)move(Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up"))});add();add();draw();cleanup=()=>window.removeEventListener("keydown",key)};

// 13 Mines
handlers.mines=()=>{const N=8,M=10;let mines=new Set(),revealed=new Set(),flags=new Set(),over=false;while(mines.size<M)mines.add(Math.floor(Math.random()*N*N));const b=document.createElement("div");b.className="mine-board";area.append(b);const m=message("Reveal all safe cells. Right-click to flag.");function count(i){let x=i%N,y=Math.floor(i/N),n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){let xx=x+dx,yy=y+dy;if(xx>=0&&xx<N&&yy>=0&&yy<N&&mines.has(yy*N+xx))n++}return n}function reveal(i){if(over||revealed.has(i)||flags.has(i))return;revealed.add(i);if(mines.has(i)){over=true;m.textContent="Boom! You hit a mine.";draw();finishGame("Mine found.");return}const n=count(i);if(n===0){let x=i%N,y=Math.floor(i/N);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){let xx=x+dx,yy=y+dy;if(xx>=0&&xx<N&&yy>=0&&yy<N)reveal(yy*N+xx)}}setScore(revealed.size);if(revealed.size===N*N-M){over=true;m.textContent="Board cleared!";finishGame("All safe cells found.")}draw()}function draw(){b.innerHTML="";for(let i=0;i<N*N;i++){const bt=button(revealed.has(i)?(mines.has(i)?"✹":count(i)||""):(flags.has(i)?"⚑":""),()=>reveal(i),"mine-cell");bt.disabled=revealed.has(i)||over;bt.oncontextmenu=e=>{e.preventDefault();if(!over&&!revealed.has(i)){flags.has(i)?flags.delete(i):flags.add(i);draw()}};if(revealed.has(i))bt.classList.add("revealed");b.append(bt)}}draw()};

// 14 Simon
handlers.simon=()=>{const colors=["#e95b68","#5de3e8","#c6ff4d","#9b7bff"],seq=[],player=[];let level=0,accept=false,timers=[];const pad=document.createElement("div");pad.style.cssText="display:grid;grid-template-columns:repeat(2,105px);gap:9px";area.append(pad);colors.forEach((c,i)=>{const b=button("●",()=>tap(i),"choice-btn");b.style.cssText=`height:90px;background:${c}33;border-color:${c};color:${c};font-size:28px`;pad.append(b)});const m=message("Press Start and repeat the sequence.");const start=button("START",next);area.append(start);function flash(i){const b=pad.children[i];b.style.filter="brightness(2.5)";timers.push(setTimeout(()=>b.style.filter="",280))}function next(){player.length=0;accept=false;seq.push(Math.floor(Math.random()*4));level++;m.textContent=`Level ${level}: watch the sequence`;let t=300;seq.forEach(i=>{timers.push(setTimeout(()=>flash(i),t));t+=550});timers.push(setTimeout(()=>{accept=true;m.textContent="Your turn.";},t))}function tap(i){if(!accept)return;flash(i);player.push(i);if(player[player.length-1]!==seq[player.length-1]){accept=false;m.textContent=`Wrong sequence. You reached level ${level}.`;setScore((level-1)*10);finishGame("Simon sequence ended.");return}if(player.length===seq.length){accept=false;setScore(level*10);timers.push(setTimeout(next,650))}}cleanup=()=>timers.forEach(clearTimeout)};

// 15 Whack
handlers.whack=()=>{let active=true,left=20,hits=0;const b=button("🐹",hit,"big-tap");b.style.fontSize="40px";area.append(b);const m=message("Hit the mole. 20 seconds.");let moleTimer=setInterval(()=>{b.textContent=["🐹","🐰","🦔"][Math.floor(Math.random()*3)]},650);const t=setInterval(()=>{left--;m.textContent=`Time: ${left}s · Hits: ${hits}`;if(left<=0){clearInterval(t);clearInterval(moleTimer);active=false;b.disabled=true;m.textContent=`Time up! You hit ${hits} times.`;finishGame("Whack-a-Mole complete.")}},1000);function hit(){if(active&&b.textContent==="🐹"){hits++;setScore(hits*5);b.textContent="💥";setTimeout(()=>{if(active)b.textContent="🐹"},180)}}cleanup=()=>{clearInterval(t);clearInterval(moleTimer)}};

// 16 Pong
handlers.pong=()=>{const [c,x]=canvas(420,280);let py=110,cy=110,bx=210,by=140,vx=3,vy=2,player=0,comp=0,run=true,keys={};const m=message("Move with mouse, touch or W/S. First to 5.");function key(e){keys[e.key.toLowerCase()]=e.type==="keydown"}function mouse(e){const r=c.getBoundingClientRect();py=(e.clientY-r.top)*c.height/r.height-30}c.addEventListener("mousemove",mouse);c.addEventListener("touchmove",e=>{mouse(e.touches[0]);e.preventDefault()},{passive:false});window.addEventListener("keydown",key);window.addEventListener("keyup",key);let raf;function frame(){if(!run)return;if(keys.w||keys.arrowup)py-=5;if(keys.s||keys.arrowdown)py+=5;py=Math.max(0,Math.min(220,py));cy+=(by-30-cy)*.055;by+=vy;bx+=vx;if(by<5||by>275)vy*=-1;if(bx<28&&by>py&&by<py+60){vx=Math.abs(vx)*1.04;vy+=(by-(py+30))*.05}if(bx>392&&by>cy&&by<cy+60){vx=-Math.abs(vx)*1.04}if(bx<0){comp++;reset()}if(bx>420){player++;setScore(player*20);reset()}x.fillStyle="#07101c";x.fillRect(0,0,420,280);x.fillStyle="#c6ff4d";x.fillRect(12,py,9,60);x.fillStyle="#9b7bff";x.fillRect(399,cy,9,60);x.fillRect(bx-5,by-5,10,10);x.fillStyle="#71809a";for(let y=0;y<280;y+=18)x.fillRect(209,y,2,9);x.font="18px monospace";x.fillText(player,175,25);x.fillText(comp,235,25);if(player>=5||comp>=5){run=false;end(player>=5?"You win Pong!":"Computer wins Pong.");return}raf=requestAnimationFrame(frame)}function reset(){bx=210;by=140;vx=player>comp?-3:3;vy=2}frame();cleanup=()=>{run=false;cancelAnimationFrame(raf);window.removeEventListener("keydown",key);window.removeEventListener("keyup",key)}};

// 17 Breakout
handlers.breakout=()=>{const [c,x]=canvas(420,300);let px=165,bx=210,by=245,vx=3,vy=-3,bricks=[],running=true,keys={};for(let r=0;r<4;r++)for(let col=0;col<8;col++)bricks.push({x:10+col*51,y:25+r*22,on:true});const m=message("Move with mouse or arrow keys. Clear the bricks.");function move(e){const r=c.getBoundingClientRect();px=(e.clientX-r.left)*420/r.width-45}c.addEventListener("mousemove",move);function key(e){keys[e.key]=e.type==="keydown"}window.addEventListener("keydown",key);window.addEventListener("keyup",key);let raf;function frame(){if(!running)return;if(keys.ArrowLeft)px-=5;if(keys.ArrowRight)px+=5;px=Math.max(0,Math.min(330,px));bx+=vx;by+=vy;if(bx<5||bx>415)vx*=-1;if(by<5)vy*=-1;if(by>260&&by<275&&bx>px&&bx<px+90)vy=-Math.abs(vy);bricks.forEach(b=>{if(b.on&&bx>b.x&&bx<b.x+46&&by>b.y&&by<b.y+15){b.on=false;vy*=-1;setScore(score+5)}});x.fillStyle="#07101c";x.fillRect(0,0,420,300);bricks.forEach((b,i)=>{if(b.on){x.fillStyle=["#c6ff4d","#5de3e8","#9b7bff","#ff9e57"][Math.floor(i/8)];x.fillRect(b.x,b.y,46,14)}});x.fillStyle="#c6ff4d";x.fillRect(px,276,90,8);x.fillStyle="white";x.beginPath();x.arc(bx,by,6,0,Math.PI*2);x.fill();if(bricks.every(b=>!b.on)){running=false;end("All bricks cleared!")}else if(by>305){running=false;end("Ball lost. Final score: "+score);return}raf=requestAnimationFrame(frame)}frame();cleanup=()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener("keydown",key);window.removeEventListener("keyup",key)}};

// 18 Dodge
handlers.dodge=()=>{const [c,x]=canvas(400,300);let px=185,rocks=[],alive=true,frames=0,keys={};const m=message("Move with ← → or A/D. Survive as long as possible.");function key(e){keys[e.key.toLowerCase()]=e.type==="keydown"}window.addEventListener("keydown",key);window.addEventListener("keyup",key);c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();px=(e.clientX-r.left)*400/r.width-10});let raf;function frame(){if(!alive)return;frames++;if(keys.arrowleft||keys.a)px-=5;if(keys.arrowright||keys.d)px+=5;px=Math.max(0,Math.min(380,px));if(frames%28===0)rocks.push({x:Math.random()*380,y:-15,s:3+Math.random()*2});rocks.forEach(r=>r.y+=r.s+frames/1000);rocks=rocks.filter(r=>r.y<315);if(rocks.some(r=>r.x<px+20&&r.x+18>px&&r.y<280&&r.y+18>265)){alive=false;setScore(Math.floor(frames/3));end("Meteor hit! You survived "+Math.floor(frames/60)+" seconds.");return}x.fillStyle="#07101c";x.fillRect(0,0,400,300);x.fillStyle="#c6ff4d";x.fillRect(px,265,20,22);x.fillStyle="#ff655f";rocks.forEach(r=>{x.beginPath();x.arc(r.x,r.y,9,0,7);x.fill()});raf=requestAnimationFrame(frame)}frame();cleanup=()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener("keydown",key);window.removeEventListener("keyup",key)}};

// 19 Color
handlers.color=()=>{const names=["RED","BLUE","GREEN","YELLOW","PURPLE"];const colors=["#ff5b65","#55c7ff","#70e58b","#f5d34e","#b38aff"];let left=20;const word=document.createElement("div");word.className="big-number";word.style.fontSize="40px";area.append(word);const r=document.createElement("div");r.className="quiz-options";area.append(r);const m=message("Choose the meaning of the word, ignore its text colour.");let correct;function next(){const wi=Math.floor(Math.random()*5),ink=Math.floor(Math.random()*5);word.textContent=names[wi];word.style.color=colors[ink];correct=wi;r.innerHTML="";names.forEach((n,i)=>r.append(button(n,()=>{if(i===correct){setScore(score+10);m.textContent="Correct!"}else m.textContent="Wrong — read the word.";next()}, "choice-btn")))}next();const t=setTimeout(()=>{m.textContent=`Time! Score: ${score}`;finishGame("Color Reflex complete.")},20000);cleanup=()=>clearTimeout(t)};

// 20 Coin
handlers.coin=()=>{const m=message("Call heads or tails.");const r=row();["HEADS","TAILS"].forEach(call=>r.append(button(call,()=>{const result=Math.random()<.5?"HEADS":"TAILS";m.textContent=`Coin: ${result}. ${call===result?"Correct!":"Not this time."}`;if(call===result)setScore(score+10)})))};

$("#gameGrid").addEventListener("click",e=>{const card=e.target.closest(".game-card");if(card)openGame(card.dataset.id)});
$("#gameGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".game-card")){e.preventDefault();openGame(e.target.dataset.id)}});
$("#searchInput").addEventListener("input",renderGames);$("#categoryFilter").addEventListener("change",renderGames);
$("#closeGame").addEventListener("click",closeGame);$("#modalBackdrop").addEventListener("click",closeGame);
$("#restartGame").addEventListener("click",()=>{if(current)startGame(current.id)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeGame()});
$("#resetStats").addEventListener("click",()=>{if(confirm("Clear all locally saved ArcadeWorld stats?")){stats={played:0,scores:[],favorites:{}};saveStats();toast("Local stats cleared.")}});
$("#soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("#soundToggle").style.background=soundOn?"#26351d":"transparent";toast("Sound effects are not included in this version.")});
$("#year").textContent=new Date().getFullYear();renderGames();renderStats();
})();