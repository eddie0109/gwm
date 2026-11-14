// 건우 대전쟁 · 01-core.js
const $=id=>document.getElementById(id);
const show=n=>['start','login','world','select','tre','up','form','gacha','quest','enemyDex','myDex','attendance','battle'].forEach(s=>$(s).classList.toggle('hide',s!==n));
const W=800,GY=250;
// 960x540 고정 화면을 창 크기에 맞춰 확대/축소
const game=$('game');
function fit(){const k=Math.min(innerWidth/960,innerHeight/540);game.style.transform='translate(-50%,-50%) scale('+k+')';}
addEventListener('resize',fit);addEventListener('orientationchange',fit);fit();
let AC=null,sndOn=true;try{sndOn=localStorage.getItem('gw_snd')!=='0';}catch(e){}
function sfx(t,r){if(!sndOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const now=AC.currentTime,tone=(f,d,ty,v,t0,f2)=>{t0=t0||0;const o=AC.createOscillator(),g2=AC.createGain();o.type=ty||'square';o.frequency.setValueAtTime(f,now+t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,now+t0+d);g2.gain.setValueAtTime(v||0.06,now+t0);g2.gain.exponentialRampToValueAtTime(0.0001,now+t0+d);o.connect(g2);g2.connect(AC.destination);o.start(now+t0);o.stop(now+t0+d+0.02);};
  if(t==='ui')tone(660,0.07,'square',0.04);
  else if(t==='dep')tone(330,0.12,'square',0.05,0,660);
  else if(t==='hit')tone(140,0.06,'sawtooth',0.05,0,60);
  else if(t==='boss'){tone(90,0.7,'sawtooth',0.09,0,35);tone(60,0.7,'square',0.06,0.05,30);}
  else if(t==='win')[523,659,784,1047].forEach((f,i)=>tone(f,0.18,'square',0.06,i*0.12));
  else if(t==='lose')[392,330,262,196].forEach((f,i)=>tone(f,0.22,'triangle',0.07,i*0.16));
  else if(t==='gacha'){const tb=r?2.8:1.8;tone(180,tb,'sawtooth',0.04,0,900);tone(360,tb,'triangle',0.03,0,1800);
    [784,988,1175,1568].forEach((f,i)=>tone(f,0.35,'square',0.06,tb+i*0.08));if(r)[1047,1319,1568,2093].forEach((f,i)=>tone(f,0.5,'triangle',0.05,tb+0.4+i*0.1));}
  }catch(e){}}
let lastHit=0;function sfxHit(){const n=performance.now();if(n-lastHit>90){lastHit=n;sfx('hit');}}
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hide');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.add('hide'),3500);}
const fsOn=()=>document.fullscreenElement||document.webkitFullscreenElement;
$('fsb').onclick=()=>{const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;
  if(fsOn()){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
  if(!rq){toast('이 브라우저는 전체화면을 지원하지 않아요. 공유 버튼에서 "홈 화면에 추가"를 하면 전체화면처럼 실행돼요.');return;}
  Promise.resolve(rq.call(el)).then(()=>{try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{});}catch(e){}}).catch(()=>toast('전체화면을 켤 수 없어요.'));};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{$('fsb').textContent=fsOn()?'🗗':'⛶';}));
$('snd').textContent=sndOn?'🔊':'🔇';
$('snd').onclick=()=>{sndOn=!sndOn;try{localStorage.setItem('gw_snd',sndOn?'1':'0');}catch(e){}$('snd').textContent=sndOn?'🔊':'🔇';if(sndOn)sfx('ui');};
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button');if(b&&!b.disabled&&!b.closest('#slots')&&b.id!=='snd')sfx('ui');});

