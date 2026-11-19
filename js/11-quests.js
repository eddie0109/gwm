// 건우 대전쟁 · 11-quests.js
// ════════ 퀘스트 / 시작 화면 ════════
const QS=[['q1','첫 승리',()=>qs.wins,1,'t',1],['q2','맵 5개 클리어',()=>Object.keys(cleared).length,5,'e',30],['q3','적 100마리 처치',()=>qs.kills,100,'e',20],['q4','쓰레기포 10번 발사',()=>qs.cn,10,'t',1],['q5','도령 Lv5 달성 (한 판)',()=>qs.wk,5,'e',20],['q6','캐릭터 Lv10 달성',()=>Math.max(1,...MY.map(u=>lv[u.id]||1)),10,'t',2],['q7','맵 15개 클리어',()=>Object.keys(cleared).length,15,'t',2],['q8','적 1000마리 처치',()=>qs.kills,1000,'e',60],['q9','뽑기 10번',()=>qs.ga,10,'e',40],['q10','맵 30개 클리어',()=>Object.keys(cleared).length,30,'t',3]];
// 누적 업적형 퀘스트: 기존 저장된 수령 기록(qc)을 그대로 사용합니다.
for(const [prefix,label,fn,steps,reward] of [
  ['wins','승리',()=>qs.wins,[3,5,10,20,30,50,75,100,150,200,300,500],6],
  ['kills','적 처치',()=>qs.kills,[20,50,200,500,1500,3000,5000,10000,20000],5],
  ['stages','스테이지 클리어',()=>Object.keys(cleared).length,[3,10,20,40,48,60,80,96,120,144],8],
  ['cannon','쓰레기포 발사',()=>qs.cn,[3,20,50,100,200,500],8],
  ['gacha','뽑기',()=>qs.ga,[3,20,50,100,200,500],10],
  ['treasure','보물 획득',()=>totalTreasure(),[1,5,10,20,40,60,80,100,120,144],10],
  ['level','캐릭터 레벨',()=>Math.max(1,...MY.map(u=>lv[u.id]||1)),[3,5,10,15,20,25,30],12]
])steps.forEach((goal,i)=>QS.push(['extra_'+prefix+'_'+goal,label+' '+goal+'회/개 달성',fn,goal,i%4===0?'t':'e',i%4===0?1:reward+Math.floor(i/2)*5]));
function buildQ(){const box=$('ql');box.innerHTML='';
  QS.forEach(([id,nm,fn,goal,ty,amt])=>{const n=Math.min(goal,fn()),ok=n>=goal,d=document.createElement('div');d.className='tr up';
    const i=document.createElement('div');i.innerHTML='<b>'+nm+'</b><br><small>'+n+' / '+goal+' · 보상 '+(ty==='t'?'🎫 건우 티켓 ×'+amt:'💎 에메랄드 ×'+amt)+'</small>';
    const b=document.createElement('button');b.textContent=qc[id]?'수령 완료':(ok?'보상 받기':'진행 중');b.disabled=!ok||!!qc[id];
    b.onclick=()=>{if(ty==='t')tk+=amt;else em+=amt;qc[id]=1;save();buildQ();};
    d.appendChild(i);d.appendChild(b);box.appendChild(d);});}
const sc=$('sc'),sg=sc.getContext('2d');let sT=0;
(function sa(){if(!$('start').classList.contains('hide')){sT+=0.016;sg.clearRect(0,0,800,120);sg.fillStyle='#2a3a28';sg.fillRect(0,104,800,16);
  const f=MY.filter(u=>u.t==='N'||u.t==='R');
  f.forEach((u,i)=>{const x=((sT*70+i*80)%900)-70,v=u.grid,h=v.length*Math.min(u.s,3);spr(v,x,104-h+Math.sin(sT*10+i)*2,Math.min(u.s,3),false,pl(u),sg);});}
  requestAnimationFrame(sa);})();
$('goTr').onclick=()=>{treasureChapter=CH>=6?0:CH;buildTr();show('tre');};
$('backSel').onclick=()=>{buildGrid();show('select');};
$('goUp').onclick=()=>{buildUp();show('up');};
$('backSel2').onclick=()=>show('select');

