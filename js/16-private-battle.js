// 건우 대전쟁 · 프라이빗 1:1 (Firebase Firestore)
// 방장 브라우저가 판정을 맡는 친구 간 대전. 공정한 랭크전용 서버는 별도 필요.
(function(){
'use strict';
const pv={room:null,code:'',side:-1,unsub:null,unsubCommands:null,seen:new Set(),sim:null,frame:0,last:0,lastPublish:0,publishing:false,remote:null,closed:false,rendering:false,joining:false};
const $p=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeName=s=>String(s||'건우').slice(0,16);
const PVP_MAX_UNITS=34;
const PVP_COST_MULT=1.5; // 세계편 2장 가격 기준
// 승패는 상대 성 파괴로만 결정. 제한시간과 타이머 표시는 사용하지 않습니다.
const PVP_SYNC_MS=950;
const pvpDeck=()=>{
 const selected=fl().slice(0,10);
 return selected.map(id=>({id,level:Math.max(1,Math.min(30,Number(lv[id])||1)),plus:Math.max(0,Math.min(200,Number(plusLv[id])||0)),form:evolutionStage(MY.find(x=>x.id===id)),trn:tn[id]||{hp:0,atk:0,spd:0}}));
};
// 한 계정의 실제 싱글플레이 보물/기본 능력 효과를 방 생성 또는 참가 시 고정합니다.
const pvpStats=()=>({
 research:Math.max(1,Math.min(20,Number(basicLv.research)||1)),
 baseHp:Math.max(1,Math.min(20,Number(basicLv.baseHp)||1)),
 accounting:Math.max(1,Math.min(20,Number(basicLv.accounting)||1)),
 cannon:Math.max(1,Math.min(20,Number(basicLv.cannon)||1)),
 maxMoney:walletCapacity(),income:incomeMultiplier(),
 ecoWallet:economicProgress(0),
 futureBase:futureTreasureProgress('f_base'),futureForce:futureTreasureProgress('f_force'),
 futureCannon:futureTreasureProgress('f_cannon'),
 fruits:Object.fromEntries(['레드','블랙','부유','천사'].map(t=>[t,futureFruitProgress([t])])),
 traits:Object.fromEntries(TRAITS.map(t=>[t,traitTreasureProgress(t)]))
});
function status(t){$p('pvpStatus').textContent=t;}
function error(e){console.error('[건우도장]',e);toast('프라이빗 배틀: '+(e&&e.message?e.message:String(e)));}
// 대전 저장소: 아이디 계정은 서버 직접 요청(restFs) — 학교 기기처럼 SDK가 막힌 곳에서도 동작. 예전 방식 계정만 SDK.
const pdb=()=>user&&user.rest?restFs:fbDb;
async function needCloud(){
 if(!user||user.type!=='cloud'){toast('대전은 건우 계정(아이디)으로 로그인해서 이용해 주세요. (닉네임·게스트는 불가)');return false;}
 if(user.rest){try{await restToken();return true;}catch(e){toast('로그인이 만료됐어요. 로그아웃 후 다시 로그인해 주세요.');return false;}}
 try{await fbInit();}catch(e){toast('대전 서버 프로그램을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.');return false;}
 if(fbA.currentUser&&fbA.currentUser.uid===user.uid)return true;
 toast('계정 로그인을 다시 진행해 주세요.');return false;
}
function code8(){const arr=new Uint8Array(8);crypto.getRandomValues(arr);const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from(arr,v=>chars[v%chars.length]).join('');}
function showRoom(code){$p('pvpCode').textContent='방 '+code;$p('pvpRoomCode').textContent=code;$p('pvpLobby').classList.remove('hide');$p('pvpPlay').classList.add('hide');$p('privateBattle').classList.remove('playing');show('privateBattle');}
function stopLocal(){
 pv.closed=true;
 if(pv.unsub){pv.unsub();pv.unsub=null;}
 if(pv.unsubCommands){pv.unsubCommands();pv.unsubCommands=null;}
 if(pv.frame)cancelAnimationFrame(pv.frame);
 pv.frame=0;pv.sim=null;pv.remote=null;pv.remotePrevious=null;accumulator=0;lastDraw=0;lastUi=0;pv.room=null;pv.code='';pv.side=-1;pv.seen.clear();pv.rendering=false;pv.publishing=false;resetView();
 $p('privateBattle').classList.remove('playing');
}
async function leaveRoom(){
 const room=pv.room,side=pv.side,active=!!room;
 stopLocal();
 if(active){try{
  if(side===0)await room.update({status:'ended',winner:1,reason:'방장이 나갔습니다',lastActive:Date.now()});
  else if(side===1)await room.update({status:'ended',winner:0,reason:'참가자가 나갔습니다',lastActive:Date.now()});
 }catch(e){console.warn('방 종료 기록 실패',e);}}
 buildWorld();show('world');
}
$p('dojoBack').onclick=()=>{buildWorld();show('world');};
$p('pvpLeave').onclick=()=>{void leaveRoom();};
$p('pvpQuit').onclick=()=>{if(confirm('대전에서 나갈까요? 나가면 패배 처리돼요.'))void leaveRoom();};
$p('pvpCopy').onclick=async()=>{try{await navigator.clipboard.writeText(pv.code);toast('방 코드 복사 완료');}catch(e){toast('방 코드: '+pv.code);}};
$p('dojoCodeInput').addEventListener('input',e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z2-9]/g,'').slice(0,8);});
async function create(){
 if(pv.joining)return;pv.joining=true;
 try{
  if(!await needCloud())return;
  stopLocal();pv.closed=false;
  let ref,code;
  for(let i=0;i<6;i++){code=code8();ref=pdb().collection('dojoRooms').doc(code);const existed=await ref.get();if(!existed.exists)break;ref=null;}
  if(!ref)throw Error('방 코드 생성에 실패했습니다. 다시 시도해 주세요.');
  const now=Date.now();
  await ref.set({hostUid:user.uid,hostName:safeName(user.name),guestUid:'',guestName:'',hostDeck:pvpDeck(),guestDeck:[],hostStats:pvpStats(),guestStats:{},status:'waiting',createdAt:now,lastActive:now,winner:-1,reason:'',snapshot:{}});
  pv.room=ref;pv.code=code;pv.side=0;pv.closed=false;showRoom(code);attachRoom();status('상대방을 기다리고 있습니다');
 }catch(e){error(e);}finally{pv.joining=false;}
}
async function join(){
 if(pv.joining)return;pv.joining=true;
 try{
  if(!await needCloud())return;
  const code=$p('dojoCodeInput').value.trim().toUpperCase();if(!/^[A-HJ-NP-Z2-9]{8}$/.test(code))throw Error('8자리 방 코드를 입력해 주세요.');
  stopLocal();pv.closed=false;
  const ref=pdb().collection('dojoRooms').doc(code);
  await pdb().runTransaction(async tx=>{
   const doc=await tx.get(ref);if(!doc.exists)throw Error('방이 존재하지 않습니다.');const d=doc.data();
   if(d.hostUid===user.uid)throw Error('자신의 방에는 참가할 수 없습니다.');
   if(d.status!=='waiting'||d.guestUid)throw Error('이미 시작했거나 닫힌 방입니다.');
   if(Date.now()-d.createdAt>2*60*60*1000)throw Error('만료된 방입니다. 새 방을 만들어 주세요.');
   tx.update(ref,{guestUid:user.uid,guestName:safeName(user.name),guestDeck:pvpDeck(),guestStats:pvpStats(),status:'playing',lastActive:Date.now()});
  });
  pv.room=ref;pv.code=code;pv.side=1;pv.closed=false;showRoom(code);attachRoom();
 }catch(e){error(e);}finally{pv.joining=false;}
}
$p('dojoCreate').onclick=()=>{void create();};
$p('dojoJoin').onclick=()=>{void join();};
function attachRoom(){
 const expected=pv.room;
 pv.unsub=expected.onSnapshot(doc=>{
  if(pv.closed||pv.room!==expected)return;
  if(!doc.exists){status('방이 사라졌습니다');return;}
  const d=doc.data();
  if(d.status==='waiting'){status('친구가 코드를 입력하기를 기다리는 중');$p('pvpPlayers').textContent=d.hostName+' · 대기 중';return;}
  if(d.status==='playing'){
   if(pv.side===0&&!pv.sim)startHost(d);
   else if(pv.side===1){if(!$p('pvpLobby').classList.contains('hide'))startGuest(d);if(d.snapshot&&d.snapshot.players){pv.remotePrevious=pv.remote;pv.remote=d.snapshot;pv.remoteStart=performance.now();}}
  }else if(d.status==='ended'){
   if(pv.sim)pv.sim.over=true;
   if(d.snapshot&&d.snapshot.players&&pv.side===1){pv.remotePrevious=pv.remote;pv.remote=d.snapshot;pv.remoteStart=performance.now();}
   status(d.reason||((d.winner===pv.side)?'승리!':'패배!'));
   $p('pvpPlayers').textContent=d.winner===pv.side?'승리했습니다!':d.winner===-1?'무승부입니다.':'상대방이 승리했습니다.';
   // 전투 화면에서는 세계편처럼 승리/패배 화면을 먼저 보여주고, 화면을 누르면 결과 로비로 이동
   if(pv.rendering){if(!pv.endShown)pv.endShown={win:d.winner===pv.side,draw:d.winner===-1,at:performance.now(),reason:d.reason||''};return;}
   showResultLobby();
  }
 },error);
}
function activatePlay(d){
 $p('pvpLobby').classList.add('hide');$p('pvpPlay').classList.remove('hide');$p('privateBattle').classList.add('playing');pv.endShown=null;resetView();
 $p('pvpOpponent').textContent=safeName(pv.side===0?d.guestName:d.hostName)+' VS '+safeName(pv.side===0?d.hostName:d.guestName);
 buildButtons(d);
 pv.last=performance.now();pv.rendering=true;accumulator=0;pv.frame=requestAnimationFrame(frame);
}
function startGuest(d){pv.remote=d.snapshot||null;activatePlay(d);}
function startHost(d){
 pv.sim={t:0,over:false,players:[player(d.hostDeck,d.hostStats),player(d.guestDeck,d.guestStats)],units:[],shots:[],events:[],evSeq:0,seq:0,winner:-1};
 pv.unsubCommands=pv.room.collection('commands').onSnapshot(snap=>{
  if(pv.closed||!pv.sim||pv.sim.over)return;
  snap.docChanges().forEach(c=>{
   if(c.type!=='added'||pv.seen.has(c.doc.id))return;pv.seen.add(c.doc.id);
   const cmd=c.doc.data(),side=cmd.side;
   if((side===0&&cmd.uid!==d.hostUid)||(side===1&&cmd.uid!==d.guestUid))return;
   if(side!==1)return;
   command(side,cmd.kind,cmd.slot);
   c.doc.ref.delete().catch(()=>{});
  });
 },error);
 activatePlay(d);
}
// === 1:1 엔진: 두 계정의 경제·보물·강화치를 각자 분리 적용 ===
const bounded=(v,min,max,def=min)=>Number.isFinite(+v)?Math.max(min,Math.min(max,+v)):def;
const econ=(p)=>{
 const b=p.stats,progress=bounded((b.accounting||1)/20,0,1);
 p.maxMoney=Math.round((bounded(b.maxMoney,600,6000,600)+(p.worker-1)*250*(1+bounded(b.ecoWallet,0,1)))/100)*100;
 p.rate=16*(1+(p.worker-1)*.32)*bounded(b.income,1,3,1);
 p.wkCost=Math.round(p.worker*80*(1-.2*progress));
};
function player(deck,stats){
 const b=stats||{},baseHp=1500*(1+bounded((b.baseHp||1)/20,0,1))*(1+.3*bounded(b.futureBase,0,1));
 const p={deck:Array.isArray(deck)?deck.slice(0,10):[],stats:b,money:100,maxMoney:600,rate:16,worker:1,wkCost:80,baseHp,baseMax:baseHp,cool:Array(10).fill(0),coolMax:Array(10).fill(1),cannon:0,cannonReload:Math.max(15,30-15*bounded(b.futureForce,0,1))};
 econ(p);p.money=Math.min(p.money,p.maxMoney);return p;
}
// 폼(1·2·3형)에 맞는 화면용 캐릭터 정의. 세계편 전투와 같은 dsp()로 그립니다.
const viewDefs=new Map();
function viewT(unitId,form){
 const key=unitId+':'+(form||1);if(viewDefs.has(key))return viewDefs.get(key);
 const base=MY.find(x=>x.id===unitId);if(!base)return null;
 const f=Number(form||1);
 const v=f>=3&&base.f3?Object.assign({},base,base.f2||{},base.f3,{f:3,s:base.s}):f>=2&&base.f2?Object.assign({},base,base.f2,{f:2,s:base.s}):Object.assign({},base);
 viewDefs.set(key,v);return v;
}
let deckView=[];
function buildButtons(d){
 const root=$p('pvpSlots');root.replaceChildren();const deck=(pv.side===0?d.hostDeck:d.guestDeck)||[];
 deckView=[];
 for(let i=0;i<10;i++){
  const item=deck[i],T=item?viewT(item.id,item.form):null,b=document.createElement('button');b.type='button';
  if(T){const base=MY.find(x=>x.id===item.id);b.appendChild(ico(base));
   const pr=document.createElement('span');pr.className='pr';const cost=Math.round(T.cost*PVP_COST_MULT);pr.textContent=cost+'원';
   const cd=document.createElement('i');cd.className='cdv';b.append(pr,cd);b._cd=cd;
   b.addEventListener('pointerdown',e=>{e.preventDefault();send('deploy',i);});b.addEventListener('contextmenu',e=>e.preventDefault());
   deckView[i]={cost,btn:b};}
  else{b.disabled=true;deckView[i]=null;}
  root.appendChild(b);
 }
}
function send(kind,slot){
 if(!pv.room||pv.closed||pv.endShown)return;
 if(!['deploy','worker','cannon'].includes(kind))return;
 if(kind==='deploy'&&(!Number.isInteger(slot)||slot<0||slot>9))return;
 if(kind==='deploy')sfx('dep');
 if(pv.side===0){command(0,kind,slot);return;}
 if(pv.side===1)pv.room.collection('commands').add({uid:user.uid,side:1,kind,slot:kind==='deploy'?slot:0,createdAt:Date.now()}).catch(error);
}
$p('pvpWorker').addEventListener('pointerdown',e=>{e.preventDefault();send('worker',0);});
$p('pvpCannon').addEventListener('pointerdown',e=>{e.preventDefault();send('cannon',0);});
addEventListener('keydown',e=>{
 if($p('privateBattle').classList.contains('hide')||$p('pvpPlay').classList.contains('hide'))return;
 if(e.code==='KeyW')send('worker',0);else if(e.code==='KeyE')send('cannon',0);
 else if(/^Digit[0-9]$/.test(e.code))send('deploy',e.code==='Digit0'?9:+e.code[5]-1);
});
function formUnit(p,item){
 const base=MY.find(u=>u.id===item.id);if(!base)return null;
 const total=bounded(Number(item.level||1)+Number(item.plus||0),1,230);
 let v=base;const f=Number(item.form||1);
 if(f>=3&&base.f3&&total>=30)v=Object.assign({},base,base.f2||{},base.f3);
 else if(f>=2&&base.f2&&total>=10)v=Object.assign({},base,base.f2);
 const mult=(1+.1*(total-1))*(f>=3&&base.f3&&total>=30?1.5:f>=2&&base.f2&&total>=10?1.25:1);
 const train=item.trn||{};
 const t=Object.assign({},v,{
  atk:Math.min(100000,v.atk*mult*(1+bounded(train.atk,0,15)*.05)),
  speed:v.speed*(1+bounded(train.spd,0,15)*.05)
 });
 const hp=Math.min(300000,v.hp*mult*(1+bounded(train.hp,0,15)*.05));
 return {T:t,hp};
}
// 화면 연출용 이벤트: 약 1초마다 동기화되는 참가자도 공격·피격·사망 모션을 볼 수 있게 최근 3초를 함께 전송
function ev(k,o){const s=pv.sim;o.q=++s.evSeq;o.k=k;o.t=+s.t.toFixed(2);s.events.push(o);if(s.events.length>140)s.events.splice(0,s.events.length-140);}
function command(side,kind,slot){
 const s=pv.sim;if(!s||s.over)return;const p=s.players[side];if(!p)return;
 if(kind==='worker'){
  if(p.worker>=8||p.money<p.wkCost)return;
  p.money-=p.wkCost;p.worker++;econ(p);return;
 }
 if(kind==='cannon'){
  // 적이 있을 때만 발사, 투사체 도착 후 범위 판정
  if(p.cannon<1)return;
  const targets=s.units.filter(u=>u.side!==side&&u.hp>0);
  if(!targets.length)return;
  const tg=targets.reduce((a,b)=>!a||(side===0?b.x>a.x:b.x<a.x)?b:a,null);
  p.cannon=0;p.cannonReload=Math.max(15,30-15*bounded(p.stats.futureForce,0,1));
  s.shots.push({side,tx:tg.x,elapsed:0,dur:.8});ev('shot',{s:side,tx:Math.round(tg.x)});return;
 }
 if(kind==='deploy'){
  if(!Number.isInteger(slot)||slot<0||slot>=p.deck.length)return;
  const item=p.deck[slot],v=formUnit(p,item);if(!v)return;
  const cost=Math.round(v.T.cost*PVP_COST_MULT);
  if(p.money<cost||p.cool[slot]>0||s.units.filter(u=>u.side===side).length>=PVP_MAX_UNITS)return;
  p.money-=cost;
  const b=p.stats,r=bounded((b.research||1)/20,0,1);
  const floor=v.T.t==='UR'?25:v.T.t==='SR'?10:v.T.t==='EX'&&v.T.cost>=1500?14:v.T.t==='R'&&v.T.cost>=800?7:.8;
  p.cool[slot]=Math.max(floor,v.T.cool*(1-.75*r));p.coolMax[slot]=p.cool[slot];
  const kb=Math.max(1,v.T.kb||2),x=side===0?720:80;
  s.units.push({id:++s.seq,side,unitId:item.id,form:item.form||1,x,hp:v.hp,maxHp:v.hp,atk:v.T.atk,range:bounded(v.T.range,18,400),minR:bounded(v.T.minR||0,0,350,0),speed:v.T.speed,cd:Math.max(.3,v.T.cd),timer:0,area:!!v.T.area,ty:v.T.ty||['무속성'],
   freezeNeutral:v.T.freezeNeutral||0,freezeStrong:v.T.freezeStrong||0,freezeTime:v.T.freezeTime||0,slowS:!!v.T.slowS,dodge:v.T.dodge||0,alienMult:v.T.alienMult||0,hitDelay:v.T.hitDelay||0,kbRecover:!!v.T.kbRecover,zone:v.T.zone||0,
   slow:0,freeze:0,dh:0,mv:false,an:v.T.an||'slash',kb,kbn:v.hp-(v.hp/kb),hitEvT:-1,popT:-1});
  ev('spawn',{x,u:item.id});
 }
}
const effMult=(attackSide,targetTraits,attackerTraits)=>{
 const attacker=pv.sim.players[attackSide],defender=pv.sim.players[1-attackSide];
 const out=1+.5*traitProgressFor(targetTraits,attacker.stats.traits||{});
 const incoming=1-.5*traitProgressFor(attackerTraits,defender.stats.traits||{});
 return out*incoming;
};
function deal(attacker,target,value){
 if(!target||target.hp<=0)return;
 const s=pv.sim;
 if(target.dodge&&Math.random()<target.dodge){if(s.t-target.popT>.25){target.popT=s.t;ev('pop',{x:Math.round(target.x),s:'무효!',c:'#d8b3ff'});}return;}
 const alienHit=!!(attacker.alienMult&&target.ty.includes('에일리언'));
 const affinity=alienHit?attacker.alienMult:tmul(attacker.ty[0],target.ty);
 const fruit=Math.max(0,...(target.ty||[]).map(t=>s.players[attacker.side].stats.fruits?.[t]||0));
 const fruitBonus=affinity>1?1+.2*fruit:affinity<1?1-.2*fruit:1;
 const mult=affinity*fruitBonus*effMult(attacker.side,target.ty,attacker.ty);
 target.hp=Math.max(0,target.hp-value*mult);
 if(s.t-target.hitEvT>.15){target.hitEvT=s.t;ev('hit',{x:Math.round(target.x)});}
 if(affinity!==1&&s.t-target.popT>.3){target.popT=s.t;ev('pop',{x:Math.round(target.x),s:alienHit?'에일리언 특효 ×'+attacker.alienMult+'!':affinity>1?'효과 굉장!':'효과 별로…',c:affinity>1?'#ffe27a':'#9fb3c8'});}
 if(target.hp>0&&target.hp<=target.kbn){while(target.hp<=target.kbn)target.kbn-=target.maxHp/target.kb;target.knock=.35;target.dh=0;ev('kb',{id:target.id});}
 if(attacker.freezeNeutral&&target.ty.includes('무속성')&&Math.random()<attacker.freezeNeutral)target.freeze=Math.max(target.freeze,(attacker.freezeTime||2)*(1+.4*fruit));
 if(attacker.freezeStrong&&mult>1&&Math.random()<attacker.freezeStrong)target.freeze=Math.max(target.freeze,(attacker.freezeTime||2)*(1+.4*fruit));
 if(attacker.slowS&&affinity>1)target.slow=Math.max(target.slow,3*(1+.4*fruit));
}
function strikePv(u){
 const s=pv.sim,dir=u.side===0?-1:1;
 if(u.zone&&u.ztx!=null){for(const v of s.units)if(v.side!==u.side&&v.hp>0&&Math.abs(v.x-u.ztx)<=u.zone)deal(u,v,u.atk);
  const bx=u.side===0?55:745;if(Math.abs(bx-u.ztx)<=u.zone+40){const defend=s.players[1-u.side];defend.baseHp=Math.max(0,defend.baseHp-u.atk*effMult(u.side,['무속성'],u.ty));}return;}
 const foes=s.units.filter(v=>v.side!==u.side&&v.hp>0&&(v.x-u.x)*dir>=-10);
 let target=null,best=Infinity;for(const v of foes){const dist=(v.x-u.x)*dir;if(dist<best){best=dist;target=v;}}
 const baseX=u.side===0?55:745,baseDist=(baseX-u.x)*dir;
 const canHit=target&&best<=u.range&&best>=u.minR,canBase=baseDist<=u.range&&baseDist>=u.minR;
 const targets=u.area?foes.filter(v=>(v.x-u.x)*dir<=u.range&&(v.x-u.x)*dir>=u.minR):canHit?[target]:[];
 for(const v of targets)deal(u,v,u.atk);
 if(canBase&&(u.area||!canHit)){const defend=s.players[1-u.side];defend.baseHp=Math.max(0,defend.baseHp-u.atk*effMult(u.side,['무속성'],u.ty));}
}
function tick(dt){
 const s=pv.sim;if(!s||s.over)return;s.t+=dt;
 for(const p of s.players){p.money=Math.min(p.maxMoney,p.money+p.rate*dt);p.cannon=Math.min(1,p.cannon+dt/p.cannonReload);p.cool=p.cool.map(v=>Math.max(0,v-dt));}
 for(const shot of s.shots){shot.elapsed+=dt;if(shot.elapsed<shot.dur)continue;
  shot.done=true;const src=s.players[shot.side];
  const strength=150*(1+bounded((src.stats.cannon||1)/20,0,1))*(1+.35*bounded(src.stats.futureCannon,0,1));
  for(const foe of s.units){if(foe.side===shot.side||foe.hp<=0||Math.abs(foe.x-shot.tx)>70)continue;
   const mult=effMult(shot.side,foe.ty,['무속성']);foe.hp=Math.max(0,foe.hp-strength*mult);foe.freeze=Math.max(foe.freeze,.25);
   if(foe.hp>0&&foe.knock<=0){foe.knock=.35;foe.dh=0;ev('kb',{id:foe.id});}
  }
 }
 s.shots=s.shots.filter(x=>!x.done);
 for(const u of s.units){
  if(u.hp<=0)continue;
  u.timer-=dt;u.mv=false;
  u.slow=Math.max(0,u.slow-dt);u.freeze=Math.max(0,u.freeze-dt);
  if(u.freeze>0)continue;
  if(u.knock>0){u.knock-=dt;u.dh=0;u.x=Math.max(55,Math.min(745,u.x+(u.side===0?1:-1)*160*dt));if(u.knock<=0&&u.kbRecover)u.timer=0;continue;}
  if(u.dh>0){u.dh-=dt;if(u.dh<=0){u.dh=0;strikePv(u);}continue;}
  const dir=u.side===0?-1:1;
  let target=null,best=Infinity;
  for(const v of s.units){if(v.side===u.side||v.hp<=0)continue;const dist=(v.x-u.x)*dir;if(dist>=-10&&dist<best){best=dist;target=v;}}
  const baseX=u.side===0?55:745,baseDist=(baseX-u.x)*dir;
  const canHit=target&&best<=u.range&&best>=u.minR;
  const canBase=baseDist<=u.range&&baseDist>=u.minR;
  // 사거리 안에 적이 있으면 멈춤 (최소 사거리 유닛은 너무 가까운 적 앞에서도 멈춰서 기다림)
  const blocked=target&&best<=u.range;
  if(canHit||canBase){
   if(u.timer<=0){u.timer=u.cd;if(u.zone)u.ztx=canHit?target.x:baseX;ev('atk',u.zone?{id:u.id,zx:Math.round(u.ztx)}:{id:u.id});
    if(u.hitDelay)u.dh=u.hitDelay;else strikePv(u);}
  }else if(!blocked){u.x=Math.max(55,Math.min(745,u.x+dir*u.speed*(u.slow>0?.25:1)*dt));u.mv=true;}
 }
 // 적 처치 보상: 개인별 회계력과 싱글플레이 적 처치 방식에 맞춰 지급
 for(const u of s.units)if(u.hp<=0&&!u.paid){
  u.paid=true;const winner=s.players[1-u.side],accounting=bounded((winner.stats.accounting||1)/20,0,1);
  const def=MY.find(x=>x.id===u.unitId),reward=Math.round(Math.max(2,((def?def.cost:100)*PVP_COST_MULT)*.24)*2.5*(1+.5*accounting));
  winner.money=Math.min(winner.maxMoney,winner.money+reward);
  ev('die',{id:u.id,u:u.unitId,f:u.form,s:u.side,x:Math.round(u.x)});
  ev('pop',{x:Math.round(u.x),s:'+'+reward+'원',c:'#7be07b',to:1-u.side});
 }
 s.units=s.units.filter(u=>u.hp>0);
 if(s.players[0].baseHp<=0||s.players[1].baseHp<=0){
  const a=s.players[0].baseHp,b=s.players[1].baseHp;
  s.winner=a===b?-1:a>0?0:1;s.over=true;
  pv.room.update({status:'ended',winner:s.winner,reason:s.winner<0?'무승부':s.winner===0?'방장 승리!':'참가자 승리!',lastActive:Date.now(),snapshot:serialize()}).catch(error);
 }
}
function serialize(){
 const s=pv.sim;
 return {t:+s.t.toFixed(2),players:s.players.map(p=>({money:Math.round(p.money),maxMoney:p.maxMoney,rate:Math.round(p.rate),worker:p.worker,wkCost:p.wkCost,baseHp:Math.round(p.baseHp),baseMax:Math.round(p.baseMax),cool:p.cool.map(x=>+x.toFixed(1)),coolMax:p.coolMax.map(x=>+x.toFixed(1)),cannon:+p.cannon.toFixed(2)})),
 units:s.units.map(u=>({id:u.id,side:u.side,unitId:u.unitId,form:u.form,x:Math.round(u.x),hp:Math.round(u.hp),maxHp:Math.round(u.maxHp),mv:u.mv,sp:Math.round(u.speed*(u.slow>0?.25:1)),slow:u.slow>0,freeze:u.freeze>0})),
 events:s.events.filter(e=>e.t>=s.t-3),over:s.over,winner:s.winner};
}

// ════════ 화면: 세계편 전투와 같은 bg()/drawEnemyBase()/drawCan()/dsp() 렌더링 ════════
// 본인은 항상 오른쪽(아군 성), 상대는 왼쪽(적 성). 상대 유닛은 오른쪽을 보고 전진합니다.
const PVP_THEME_STAGE=15; // 세계편 노을 배경
let lastDraw=0,lastUi=0,accumulator=0;
const view={units:new Map(),fx:[],spk:[],pop:[],ring:[],pj:[],bm:[],lastQ:0,t:0,shake:0,lid:0,lastNow:0};
function resetView(){view.units.clear();view.fx=[];view.spk=[];view.pop=[];view.ring=[];view.pj=[];view.bm=[];view.lastQ=0;view.t=0;view.shake=0;view.lid=0;view.lastNow=0;}
const mirrorX=x=>pv.side===1?800-x:x;
const teamOf=side=>side===pv.side?0:1;
function makeViewUnit(id,side,unitId,form,x){
 const T=viewT(unitId,form);if(!T)return null;
 return {id,team:teamOf(side),T,x,tx:x,hp:1,max:1,kt:0,at:0,ad:0,mv:0,sl:0,fr:0,ph:Math.random()*3,pvp:true};
}
function applyEvent(e){
 if(e.k==='atk'){const d=view.units.get(e.id);if(d){d.ad=Math.min(AD[d.T.an]||.35,Math.max(.3,d.T.cd||1)*.8);if(d.T.adFix)d.ad=d.T.adFix;if(e.zx!=null)d.ztx=mirrorX(e.zx);if(d.T.train)d.ad=window.STEAM_TRAIN_TIMING?STEAM_TRAIN_TIMING.attack:.9;d.at=d.ad;}}
 else if(e.k==='hit'){const x=mirrorX(e.x);if(view.spk.length<70)for(let j=0;j<4;j++)view.spk.push({x:x+(Math.random()-.5)*18,y:GY-8-Math.random()*46,t:0,col:j%2?'#81e6ff':'#ffe376'});sfxHit();}
 else if(e.k==='kb'){const d=view.units.get(e.id);if(d)d.kt=.35;}
 else if(e.k==='die'){let d=view.units.get(e.id);if(!d)d=makeViewUnit(e.id,e.s,e.u,e.f,mirrorX(e.x));if(d){view.units.delete(e.id);d.at=0;d.kt=0;view.fx.push({u:d,t:0});}}
 else if(e.k==='spawn'){const def=MY.find(x=>x.id===e.u);if(def&&def.t==='UR'){const x=mirrorX(e.x);view.ring.push({x,t:0,ally:true});view.shake=Math.max(view.shake,.12);for(let q=0;q<16;q++)view.spk.push({x:x+(Math.random()-.5)*75,y:GY-30-Math.random()*100,t:0,col:['#fbec9a','#e989ff','#93ebff'][q%3]});}}
 else if(e.k==='shot'){const mine=teamOf(e.s)===0;view.pj.push({x0:mine?W-75:75,tx:mirrorX(e.tx),t:0,dur:.8});if(mine)view.lid=.3;}
 else if(e.k==='pop'){if(e.to!=null&&e.to!==pv.side)return;view.pop.push({x:mirrorX(e.x),t:0,s:e.s,c:e.c});}
}
function syncView(state,age){
 const seen=new Set();
 for(const su of state.units||[]){
  seen.add(su.id);
  const team=teamOf(su.side),dir=team===0?-1:1;
  let tx=mirrorX(su.x);if(su.mv&&age>0)tx=Math.max(55,Math.min(745,tx+dir*(su.sp||0)*Math.min(1.2,age)));
  let d=view.units.get(su.id);
  if(!d){d=makeViewUnit(su.id,su.side,su.unitId,su.form,tx);if(!d)continue;view.units.set(su.id,d);}
  d.tx=tx;d.hp=su.hp;d.max=su.maxHp;d.sl=su.slow?1:0;d.fr=su.freeze?1:0;d.mv=su.mv&&d.at<=0?1:0;
 }
 for(const e of state.events||[])if(e.q>view.lastQ){view.lastQ=e.q;applyEvent(e);}
 for(const id of [...view.units.keys()])if(!seen.has(id))view.units.delete(id);
}
function stepView(dt){
 view.t+=dt;view.shake=Math.max(0,view.shake-dt);view.lid=Math.max(0,view.lid-dt);
 for(const d of view.units.values()){
  const diff=d.tx-d.x;d.x=Math.abs(diff)>150?d.tx:d.x+diff*Math.min(1,dt*9);
  if(d.fr>0)continue;d.at=Math.max(0,d.at-dt);d.kt=Math.max(0,d.kt-dt);
 }
 view.fx.forEach(f=>f.t+=dt);view.fx=view.fx.filter(f=>f.t<.6);
 view.spk.forEach(p=>p.t+=dt);view.spk=view.spk.filter(p=>p.t<.25);
 view.pop.forEach(p=>p.t+=dt);view.pop=view.pop.filter(p=>p.t<.7);
 view.ring.forEach(r=>r.t+=dt);view.ring=view.ring.filter(r=>r.t<.8);
 for(const p of view.pj){p.t+=dt;if(p.t>=p.dur){p.done=1;view.bm.push({x:p.tx,t:0});view.shake=Math.max(view.shake,.15);}}
 view.pj=view.pj.filter(p=>!p.done);view.bm.forEach(b=>b.t+=dt);view.bm=view.bm.filter(b=>b.t<.5);
}
function renderWorld(state){
 const me=state.players[pv.side],foe=state.players[1-pv.side];
 g.clearRect(0,0,W,300);g.save();
 if(view.shake>0)g.translate((Math.random()-.5)*view.shake*14,(Math.random()-.5)*view.shake*10);
 bg();drawEnemyBase(10,150);drawCan(W-60,150);
 castleHpText(Math.max(0,Math.ceil(foe.baseHp))+' / '+Math.round(foe.baseMax),Math.max(0,Math.ceil(me.baseHp))+' / '+Math.round(me.baseMax));
 // 상대 유닛 먼저, 아군 유닛을 위에 (세계편과 같은 겹침 순서)
 const list=[...view.units.values()].sort((a,b)=>b.team-a.team);
 for(const u of list)dsp(u,0);
 for(const f of view.fx)dsp(f.u,f.t);
 for(const sp2 of view.spk){const q=sp2.t/.25,r=3+q*12;g.save();g.globalAlpha=1-q;g.fillStyle=sp2.col||'#fff6a0';g.fillRect(sp2.x-r,sp2.y-1,r*2,2);g.fillRect(sp2.x-1,sp2.y-r,2,r*2);g.restore();}
 for(const r of view.ring){const q=r.t/.8;g.save();g.globalAlpha=Math.max(0,1-q);g.strokeStyle=r.ally?'#75d9ff':'#ff5a3a';g.lineWidth=4;g.beginPath();g.ellipse(r.x,GY,q*110,6+q*60,0,0,7);g.stroke();g.restore();}
 for(const p of view.pop){const q=p.t/.7,y=GY-80-q*28;g.save();g.globalAlpha=Math.max(0,1-q*q);g.font='bold 13px sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000b';g.strokeText(p.s,p.x,y);g.fillStyle=p.c;g.fillText(p.s,p.x,y);g.restore();}
 for(const p of view.pj){const q=p.t/p.dur,x=p.x0+(p.tx-p.x0)*q,y=135+(GY-16-135)*q-90*Math.sin(q*Math.PI);
  g.save();g.translate(x,y);g.rotate(q*12);g.fillStyle='#8a8f98';g.fillRect(-9,-9,18,18);g.fillStyle='#d9c27a';g.fillRect(-4,-12,6,6);g.fillStyle='#6aa84f';g.fillRect(3,2,7,7);g.fillStyle='#c0392b';g.fillRect(-10,3,6,6);g.restore();}
 for(const b of view.bm){const q=b.t/.5;g.save();g.globalAlpha=1-q;g.fillStyle='#b9a26a';g.beginPath();g.arc(b.x,GY,70*Math.min(1,q*4),Math.PI,2*Math.PI);g.fill();
  ['#8a8f98','#d9c27a','#6aa84f','#c0392b'].forEach((c,i)=>{for(let j=0;j<2;j++){const a=(i*2+j)*Math.PI/4,r=20+q*80;g.fillStyle=c;g.fillRect(b.x+Math.cos(a)*r-4,GY-20+Math.sin(a)*r*.8-4-q*20,8,8);}});g.restore();}
 g.restore();
 const end=pv.endShown;
 if(end){g.fillStyle='#000a';g.fillRect(0,0,W,300);g.fillStyle='#fff';g.font='bold 40px sans-serif';g.textAlign='center';
  g.fillText(end.draw?'무승부':end.win?'승리!':'패배...',W/2,110);g.font='18px sans-serif';
  if(end.reason)g.fillText(end.reason,W/2,146);
  g.fillText('화면을 누르면 결과 화면으로',W/2,206);}
}
function draw(state,now){
 const cv=$p('pvpCanvas'),ctx=cv.getContext('2d');if(!ctx)return;
 ctx.imageSmoothingEnabled=false;
 const dt=view.lastNow?Math.min(.1,Math.max(0,(now-view.lastNow)/1000)):0;view.lastNow=now;
 if(!state||!state.players){ctx.fillStyle='#182939';ctx.fillRect(0,0,800,300);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 18px sans-serif';ctx.fillText('대전 동기화 중...',400,150);return;}
 const age=pv.side===0?0:Math.max(0,(now-(pv.remoteStart||now))/1000);
 syncView(state,age);stepView(dt);
 // 싱글플레이 전역(S·CH·stageIdx)을 잠시 화면용 값으로 바꿔 같은 그리기 함수를 그대로 사용
 const oldS=S,oldCH=CH,oldStage=stageIdx;
 try{
  S={t:view.t,lid:view.lid,shake:view.shake,units:[]};CH=0;stageIdx=PVP_THEME_STAGE;
  renderWorld(state);
  view.shake=Math.max(view.shake,S.shake||0);
 }catch(err){console.warn('[건우도장] 그리기 오류',err);}
 finally{S=oldS;CH=oldCH;stageIdx=oldStage;}
 ctx.drawImage(g.canvas,0,0);
 if(now-lastUi<120)return;lastUi=now;
 const p=state.players[pv.side];if(!p)return;
 $p('pvpMoney').textContent=Math.floor(p.money)+' / '+p.maxMoney+'원';
 const wb=$p('pvpWorker'),wc=Math.round(p.wkCost||80);
 wb.innerHTML=p.worker>=8?'도령<br>Lv8 MAX':'도령 Lv'+p.worker+'<br>'+wc+'원<br><small>[W]</small>';wb.disabled=!!pv.endShown||p.worker>=8||p.money<wc;
 const cb=$p('pvpCannon'),rd=p.cannon>=1,pc=Math.floor(p.cannon*100);
 cb.innerHTML=rd?'쓰레기포<br>발사!<br><small>[E]</small>':'쓰레기포<br>'+pc+'%';
 cb.style.background=rd?'':'linear-gradient(to top,#ffd84a '+pc+'%,#3a4250 '+pc+'%)';cb.style.color=rd?'':'#fff';cb.disabled=!!pv.endShown;
 deckView.forEach((dv,i)=>{if(!dv)return;const cd=p.cool[i]||0,mx=(p.coolMax&&p.coolMax[i])||1;
  dv.btn._cd.style.height=cd>0?Math.min(100,cd/mx*100)+'%':'0';dv.btn.classList.toggle('poor',p.money<dv.cost);dv.btn.disabled=!!pv.endShown;});
}
function showResultLobby(){
 pv.rendering=false;if(pv.frame)cancelAnimationFrame(pv.frame);pv.frame=0;
 $p('pvpLobby').classList.remove('hide');$p('pvpPlay').classList.add('hide');$p('privateBattle').classList.remove('playing');
}
$p('pvpCanvas').addEventListener('click',()=>{if(pv.endShown&&performance.now()-pv.endShown.at>600)showResultLobby();});
function frame(now){
 if(pv.closed||!pv.rendering)return;
 const elapsed=Math.min(.1,Math.max(0,(now-pv.last)/1000));pv.last=now;
 let hostState=null;
 if(pv.side===0&&pv.sim){
  // 고정 시뮬레이션 단계: 저사양 휴대폰의 프레임 저하에 영향받지 않는 공격·경제 판정.
  accumulator=Math.min(.12,accumulator+elapsed);
  let steps=0;
  while(accumulator>=1/30&&steps++<4){tick(1/30);accumulator-=1/30;}
  if(pv.room&&!pv.sim.over&&now-pv.lastPublish>PVP_SYNC_MS&&!pv.publishing){
   pv.lastPublish=now;pv.publishing=true;
   pv.room.update({snapshot:serialize(),lastActive:Date.now()}).catch(error).finally(()=>{pv.publishing=false;});
  }
 }
 const targetFrame=matchMedia('(pointer:coarse)').matches?33:16;
 if(now-lastDraw>=targetFrame){lastDraw=now;if(pv.side===0&&pv.sim)hostState=serialize();draw(pv.side===0?hostState:pv.remote,now);}
 pv.frame=requestAnimationFrame(frame);
}
window.addEventListener('pagehide',()=>{if(pv.room&&pv.side===0&&pv.sim&&!pv.sim.over){pv.room.update({status:'ended',winner:1,reason:'방장 연결 종료'},{keepalive:true}).catch(()=>{});}});
})();
