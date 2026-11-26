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
// ── 일일·주간·월간 퀘스트
// 기간이 시작될 때의 누적 기록을 기준점(base)으로 저장하고, (지금 기록 − 기준점)을 이번 기간 진행도로 봅니다.
// 기간 기준은 한국 시간: 하루(00시) · 주(월요일 00시) · 달(1일 00시).
const QSTAT=()=>({wins:qs.wins||0,kills:qs.kills||0,dep:qs.dep||0,cn:qs.cn||0,ga:qs.ga||0,boss:qs.boss||0,att:(daily&&daily.total)||0});
const PQ={
 day:[['wins','전투 승리',3,'e',20],['kills','적 처치',50,'e',15],['dep','캐릭터 출격',30,'e',10],['cn','쓰레기포 발사',3,'t',1],['ga','뽑기',1,'e',10]],
 week:[['wins','전투 승리',20,'t',3],['kills','적 처치',500,'e',80],['boss','보스 처치',5,'r',1],['dep','캐릭터 출격',300,'e',60],['ga','뽑기',10,'e',50],['att','출석',5,'t',2]],
 month:[['wins','전투 승리',80,'r',2],['kills','적 처치',3000,'e',300],['boss','보스 처치',25,'r',3],['dep','캐릭터 출격',1500,'e',200],['ga','뽑기',40,'t',10],['att','출석',20,'r',2]]
};
const PQ_NAME={day:'일일',week:'주간',month:'월간',ach:'업적'};
const REWARD_NAME={t:'🎫 건우 티켓',e:'💎 에메랄드',r:'🌟 레어 티켓'};
function periodKey(kind){const d=koreanDate();if(kind==='day')return d;if(kind==='month')return d.slice(0,7);
  const dt=new Date(d+'T00:00:00Z');dt.setUTCDate(dt.getUTCDate()-((dt.getUTCDay()+6)%7));return 'W'+dt.toISOString().slice(0,10);}
function syncPeriods(){let ch=false;for(const k of ['day','week','month']){const key=periodKey(k);if(!pq[k]||pq[k].key!==key){pq[k]={key,base:QSTAT(),got:{}};ch=true;}}if(ch)save();}
function resetText(kind){ // 한국 시간 기준 다음 초기화까지 남은 시간
  const kst=new Date(Date.now()+9*3600e3),y=kst.getUTCFullYear(),m=kst.getUTCMonth(),d=kst.getUTCDate(),dow=kst.getUTCDay();
  const next=kind==='month'?Date.UTC(y,m+1,1):kind==='week'?Date.UTC(y,m,d+(((1-dow+7)%7)||7)):Date.UTC(y,m,d+1);
  const ms=next-kst.getTime(),h=Math.floor(ms/3600e3),dd=Math.floor(h/24);
  return dd>0?dd+'일 '+(h%24)+'시간 뒤 초기화':h+'시간 '+Math.floor(ms%3600e3/60e3)+'분 뒤 초기화';
}
function giveReward(ty,amt){if(ty==='t')tk+=amt;else if(ty==='r')rt+=amt;else em+=amt;}
// 모든 퀘스트 목록: [탭, id, 이름, 현재, 목표, 보상종류, 수량, 받았는지, 받기 함수]
function allQuests(){syncPeriods();const st=QSTAT(),list=[];
  for(const k of ['day','week','month'])for(const [stat,nm,goal,ty,amt] of PQ[k]){const id=k+'_'+stat;
    list.push({tab:k,id,nm:nm+' '+goal+(stat==='att'?'일':'회'),n:Math.max(0,st[stat]-(pq[k].base[stat]||0)),goal,ty,amt,got:!!pq[k].got[id],take:()=>{pq[k].got[id]=1;}});}
  for(const [id,nm,fn,goal,ty,amt] of QS)list.push({tab:'ach',id,nm,n:fn(),goal,ty,amt,got:!!qc[id],take:()=>{qc[id]=1;}});
  return list;
}
let qTab='day';
function buildQ(){const box=$('ql');box.innerHTML='';const list=allQuests();
  const ready=list.filter(q=>!q.got&&q.n>=q.goal);
  const head=document.createElement('div');head.className='q-head';
  const tabs=document.createElement('div');tabs.className='chtab';
  for(const k of ['day','week','month','ach']){const b=document.createElement('button'),cnt=ready.filter(q=>q.tab===k).length;b.textContent=PQ_NAME[k]+(cnt?' ('+cnt+')':'');b.className=k===qTab?'on':'';b.onclick=()=>{qTab=k;buildQ();};tabs.appendChild(b);}
  const all=document.createElement('button');all.className='q-all';all.textContent=ready.length?'🎁 모두 받기 ('+ready.length+')':'받을 보상 없음';all.disabled=!ready.length;
  all.onclick=()=>{const sum={t:0,e:0,r:0};for(const q of allQuests())if(!q.got&&q.n>=q.goal){q.take();giveReward(q.ty,q.amt);sum[q.ty]+=q.amt;}
    save();sfx('win');toast('🎁 모두 받기: '+Object.keys(sum).filter(k=>sum[k]).map(k=>REWARD_NAME[k]+' ×'+sum[k]).join(' · '));buildQ();};
  head.append(tabs,all);box.appendChild(head);
  if(qTab!=='ach'){const info=document.createElement('p');info.className='q-reset';info.textContent='⏰ '+PQ_NAME[qTab]+' 퀘스트 · '+resetText(qTab);box.appendChild(info);}
  list.filter(q=>q.tab===qTab).sort((a,b)=>(a.got-b.got)||((b.n>=b.goal)-(a.n>=a.goal))).forEach(q=>{
    const n=Math.min(q.goal,q.n),ok=n>=q.goal,d=document.createElement('div');d.className='tr up'+(q.got?' q-done':'');
    const i=document.createElement('div');i.innerHTML='<b>'+q.nm+'</b><div class="q-bar"><i style="width:'+Math.round(n/q.goal*100)+'%"></i></div><small>'+n.toLocaleString()+' / '+q.goal.toLocaleString()+' · 보상 '+REWARD_NAME[q.ty]+' ×'+q.amt+'</small>';
    const b=document.createElement('button');b.textContent=q.got?'수령 완료':(ok?'보상 받기':'진행 중');b.disabled=!ok||q.got;
    b.onclick=()=>{q.take();giveReward(q.ty,q.amt);save();buildQ();};
    d.append(i,b);box.appendChild(d);});
}
const sc=$('sc'),sg=sc.getContext('2d');let sT=0;
(function sa(){if(!$('start').classList.contains('hide')){sT+=0.016;sg.clearRect(0,0,800,120);sg.fillStyle='#2a3a28';sg.fillRect(0,104,800,16);
  const f=MY.filter(u=>u.t==='N'||u.t==='R');
  f.forEach((u,i)=>{const x=((sT*70+i*80)%900)-70,v=u.grid,h=v.length*Math.min(u.s,3);spr(v,x,104-h+Math.sin(sT*10+i)*2,Math.min(u.s,3),false,pl(u),sg);});}
  requestAnimationFrame(sa);})();
$('goTr').onclick=()=>{treasureChapter=CH>=6?0:CH;buildTr();show('tre');};
$('backSel').onclick=()=>{buildGrid();show('select');};
$('goUp').onclick=()=>{buildUp();show('up');};
$('backSel2').onclick=()=>show('select');

