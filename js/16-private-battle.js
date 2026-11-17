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
async function needCloud(){
 if(!user||user.type!=='cloud'){toast('대전은 Google 또는 GitHub 클라우드 로그인으로 이용해 주세요.');return false;}
 await fbInit();
 if(!fbA.currentUser||fbA.currentUser.uid!==user.uid){toast('클라우드 로그인을 다시 진행해 주세요.');return false;}
 return true;
}
function code8(){const arr=new Uint8Array(8);crypto.getRandomValues(arr);const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from(arr,v=>chars[v%chars.length]).join('');}
function showRoom(code){$p('pvpCode').textContent='방 '+code;$p('pvpRoomCode').textContent=code;$p('pvpLobby').classList.remove('hide');$p('pvpPlay').classList.add('hide');show('privateBattle');}
function stopLocal(){
 pv.closed=true;
 if(pv.unsub){pv.unsub();pv.unsub=null;}
 if(pv.unsubCommands){pv.unsubCommands();pv.unsubCommands=null;}
 if(pv.frame)cancelAnimationFrame(pv.frame);
 pv.frame=0;pv.sim=null;pv.remote=null;latestHostState=null;accumulator=0;lastDraw=0;lastUi=0;pv.room=null;pv.code='';pv.side=-1;pv.seen.clear();pv.rendering=false;pv.publishing=false;
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
$p('pvpCopy').onclick=async()=>{try{await navigator.clipboard.writeText(pv.code);toast('방 코드 복사 완료');}catch(e){toast('방 코드: '+pv.code);}};
$p('dojoCodeInput').addEventListener('input',e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z2-9]/g,'').slice(0,8);});
async function create(){
 if(pv.joining)return;pv.joining=true;
 try{
  if(!await needCloud())return;
  stopLocal();pv.closed=false;
  let ref,code;
  for(let i=0;i<6;i++){code=code8();ref=fbDb.collection('dojoRooms').doc(code);const existed=await ref.get();if(!existed.exists)break;ref=null;}
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
  const ref=fbDb.collection('dojoRooms').doc(code);
  await fbDb.runTransaction(async tx=>{
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
   $p('pvpLobby').classList.remove('hide');$p('pvpPlay').classList.add('hide');
   status(d.reason||((d.winner===pv.side)?'승리!':'패배!'));
   $p('pvpPlayers').textContent=d.winner===pv.side?'승리했습니다!':d.winner===-1?'무승부입니다.':'상대방이 승리했습니다.';
  }
 },error);
}
function activatePlay(d){
 $p('pvpLobby').classList.add('hide');$p('pvpPlay').classList.remove('hide');
 $p('pvpOpponent').textContent=safeName(pv.side===0?d.guestName:d.hostName)+' VS '+safeName(pv.side===0?d.hostName:d.guestName);
 buildButtons(d);
 pv.last=performance.now();pv.rendering=true;accumulator=0;scenery=null;pv.frame=requestAnimationFrame(frame);
}
function startGuest(d){pv.remote=d.snapshot||null;activatePlay(d);}
function startHost(d){
 pv.sim={t:0,over:false,players:[player(d.hostDeck,d.hostStats),player(d.guestDeck,d.guestStats)],units:[],shots:[],effects:[],seq:0,winner:-1};
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
 const p={deck:Array.isArray(deck)?deck.slice(0,10):[],stats:b,money:100,maxMoney:600,rate:16,worker:1,wkCost:80,baseHp,baseMax:baseHp,cool:Array(10).fill(0),cannon:0,cannonReload:Math.max(15,30-15*bounded(b.futureForce,0,1))};
 econ(p);p.money=Math.min(p.money,p.maxMoney);return p;
}
function buildButtons(d){
 const root=$p('pvpSlots');root.replaceChildren();const deck=pv.side===0?d.hostDeck:d.guestDeck;
 (deck||[]).slice(0,10).forEach((item,i)=>{
  const u=MY.find(x=>x.id===item.id);const b=document.createElement('button');
  if(u){const cv=ico(u);b.appendChild(cv);const l=document.createElement('span');l.textContent=Math.round(u.cost*PVP_COST_MULT)+'원';b.appendChild(l);b.onclick=()=>send('deploy',i);}
  else{b.textContent='—';b.disabled=true;}root.appendChild(b);
 });
}
function send(kind,slot){
 if(!pv.room||pv.closed)return;
 if(!['deploy','worker','cannon'].includes(kind))return;
 if(kind==='deploy'&&(!Number.isInteger(slot)||slot<0||slot>9))return;
 if(pv.side===0){command(0,kind,slot);return;}
 if(pv.side===1)pv.room.collection('commands').add({uid:user.uid,side:1,kind,slot:kind==='deploy'?slot:0,createdAt:Date.now()}).catch(error);
}
$p('pvpWorker').onclick=()=>send('worker',0);
$p('pvpCannon').onclick=()=>send('cannon',0);
function formUnit(p,item){
 const base=MY.find(u=>u.id===item.id);if(!base)return null;
 const total=bounded(Number(item.level||1)+Number(item.plus||0),1,230);
 let v=base;const f=Number(item.form||1);
 if(f>=3&&base.f3&&total>=30)v=Object.assign({},base,base.f2||{},base.f3);
 else if(f>=2&&base.f2&&total>=10)v=Object.assign({},base,base.f2);
 const mult=(1+.1*(total-1))*(f>=3&&base.f3&&total>=30?1.5:f>=2&&base.f2&&total>=10?1.25:1);
 const train=item.trn||{},bst=p.stats;
 const t=Object.assign({},v,{
  atk:Math.min(100000,v.atk*mult*(1+bounded(train.atk,0,15)*.05)),
  speed:v.speed*(1+bounded(train.spd,0,15)*.05)
 });
 const hp=Math.min(300000,v.hp*mult*(1+bounded(train.hp,0,15)*.05));
 return {T:t,hp};
}
function command(side,kind,slot){
 const s=pv.sim;if(!s||s.over)return;const p=s.players[side];if(!p)return;
 if(kind==='worker'){
  if(p.worker>=8||p.money<p.wkCost)return;
  p.money-=p.wkCost;p.worker++;econ(p);return;
 }
 if(kind==='cannon'){
  // 이전 코드의 즉시 공격/무대상 소모 오류 수정: 적이 있을 때만 발사, 투사체 도착 후 범위 판정
  if(p.cannon<1)return;
  const targets=s.units.filter(u=>u.side!==side&&u.hp>0);
  if(!targets.length)return;
  const tg=targets.reduce((a,b)=>!a||(side===0?b.x>a.x:b.x<a.x)?b:a,null);
  p.cannon=0;
  s.shots.push({side,tx:tg.x,elapsed:0,dur:.8});return;
 }
 if(kind==='deploy'){
  if(!Number.isInteger(slot)||slot<0||slot>=p.deck.length)return;
  const item=p.deck[slot],v=formUnit(p,item);if(!v)return;
  const cost=Math.round(v.T.cost*PVP_COST_MULT);
  if(p.money<cost||p.cool[slot]>0||s.units.filter(u=>u.side===side).length>=PVP_MAX_UNITS)return;
  p.money-=cost;
  const b=p.stats,r=bounded((b.research||1)/20,0,1);
  const special=b.research>=20&&['junchi','gtong'].includes(item.id);
  const floor=v.T.t==='UR'?25:v.T.t==='SR'?10:v.T.t==='EX'&&v.T.cost>=1500?14:v.T.t==='R'&&v.T.cost>=800?7:.8;
  p.cool[slot]=Math.max(floor,v.T.cool*(1-.75*r));
  s.units.push({id:++s.seq,side,unitId:item.id,form:item.form||1,x:side===0?720:80,hp:v.hp,maxHp:v.hp,atk:v.T.atk,range:bounded(v.T.range,18,400),minR:bounded(v.T.minR||0,0,350,0),speed:v.T.speed,cd:Math.max(.3,v.T.cd),timer:0,area:!!v.T.area,ty:v.T.ty||['무속성'],freezeNeutral:v.T.freezeNeutral||0,freezeStrong:v.T.freezeStrong||0,freezeTime:v.T.freezeTime||0,slowS:!!v.T.slowS,slow:0,freeze:0,anim:0,an:v.T.an||'slash',kb:v.T.kb||2,kbn:v.hp-(v.hp/(v.T.kb||2))});
  s.effects.push({x:side===0?720:80,kind:'spawn',life:.3});
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
 const affinity=tmul(attacker.ty[0],target.ty);
 const fruit=Math.max(0,...(target.ty||[]).map(t=>pv.sim.players[attacker.side].stats.fruits?.[t]||0));
 const fruitBonus=affinity>1?1+.2*fruit:affinity<1?1-.2*fruit:1;
 const mult=affinity*fruitBonus*effMult(attacker.side,target.ty,attacker.ty);
 target.hp=Math.max(0,target.hp-value*mult);
 const s=pv.sim;s.effects.push({x:target.x,kind:'hit',life:.23});
 if(target.hp>0&&target.hp<=target.kbn){target.kbn-=target.maxHp/target.kb;target.knock=.2;}
 if(attacker.freezeNeutral&&target.ty.includes('무속성')&&Math.random()<attacker.freezeNeutral)target.freeze=Math.max(target.freeze,(attacker.freezeTime||2)*(1+.4*fruit));
 if(attacker.freezeStrong&&mult>1&&Math.random()<attacker.freezeStrong)target.freeze=Math.max(target.freeze,(attacker.freezeTime||2)*(1+.4*fruit));
 if(attacker.slowS&&affinity>1)target.slow=Math.max(target.slow,3*(1+.4*fruit));
}
function tick(dt){
 const s=pv.sim;if(!s||s.over)return;s.t+=dt;
 for(const p of s.players){p.money=Math.min(p.maxMoney,p.money+p.rate*dt);p.cannon=Math.min(1,p.cannon+dt/p.cannonReload);p.cool=p.cool.map(v=>Math.max(0,v-dt));}
 for(const shot of s.shots){shot.elapsed+=dt;if(shot.elapsed<shot.dur)continue;
  shot.done=true;const src=s.players[shot.side];
  const strength=150*(1+bounded((src.stats.cannon||1)/20,0,1))*(1+.35*bounded(src.stats.futureCannon,0,1));
  for(const foe of s.units){if(foe.side===shot.side||foe.hp<=0||Math.abs(foe.x-shot.tx)>70)continue;
   const mult=effMult(shot.side,foe.ty,['무속성']);foe.hp=Math.max(0,foe.hp-strength*mult);foe.freeze=Math.max(foe.freeze,.25);
  }
  s.effects.push({x:shot.tx,kind:'boom',life:.55});
 }
 s.shots=s.shots.filter(x=>!x.done);
 for(const e of s.effects)e.life-=dt;s.effects=s.effects.filter(x=>x.life>0).slice(-32);
 for(const u of s.units){
  if(u.hp<=0)continue;
  u.timer-=dt;u.anim=Math.max(0,u.anim-dt);
  u.slow=Math.max(0,u.slow-dt);u.freeze=Math.max(0,u.freeze-dt);
  if(u.freeze>0)continue;
  if(u.knock>0){u.knock-=dt;u.x+= (u.side===0?1:-1)*80*dt;continue;}
  const dir=u.side===0?-1:1,foes=s.units.filter(v=>v.side!==u.side&&v.hp>0&&(v.x-u.x)*dir>=-10);
  let target=null,best=Infinity;
  for(const v of foes){const dist=(v.x-u.x)*dir;if(dist<best){best=dist;target=v;}}
  const baseX=u.side===0?55:745,baseDist=(baseX-u.x)*dir;
  const canHit=target&&best<=u.range&&best>=u.minR;
  const canBase=baseDist<=u.range&&baseDist>=u.minR;
  const speedFactor=u.slow>0?.25:1;
  if(canHit||canBase){
   if(u.timer<=0){u.timer=u.cd;u.anim=Math.min(.55,u.cd*.8);
    const targets=u.area?foes.filter(v=>(v.x-u.x)*dir<=u.range&&(v.x-u.x)*dir>=u.minR):canHit?[target]:[];
    for(const v of targets)deal(u,v,u.atk);
    if(canBase){const defend=s.players[1-u.side];defend.baseHp=Math.max(0,defend.baseHp-u.atk*effMult(u.side,['무속성'],u.ty));s.effects.push({x:baseX,kind:'hit',life:.25});}
   }
  }else u.x=Math.max(55,Math.min(745,u.x+dir*u.speed*speedFactor*dt));
 }
 // 적 처치 보상: 개인별 회계력과 싱글플레이 적 처치 방식에 맞춰 지급
 for(const u of s.units)if(u.hp<=0&&!u.paid){
  u.paid=true;const winner=s.players[1-u.side],accounting=bounded((winner.stats.accounting||1)/20,0,1);
  const def=MY.find(x=>x.id===u.unitId),reward=Math.round(Math.max(2,((def?def.cost:100)*PVP_COST_MULT)*.24)*2.5*(1+.5*accounting));
  winner.money=Math.min(winner.maxMoney,winner.money+reward);
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
 return {t:+s.t.toFixed(2),players:s.players.map(p=>({money:Math.round(p.money),maxMoney:p.maxMoney,rate:Math.round(p.rate),worker:p.worker,wkCost:p.wkCost,baseHp:Math.round(p.baseHp),baseMax:p.baseMax,cool:p.cool.map(x=>+x.toFixed(1)),cannon:+p.cannon.toFixed(2)})),
 units:s.units.map(u=>({id:u.id,side:u.side,unitId:u.unitId,form:u.form,x:Math.round(u.x),hp:Math.round(u.hp),maxHp:Math.round(u.maxHp),slow:u.slow>0,freeze:u.freeze>0,an:u.an,attack:u.anim>0})),
 shots:s.shots.map(x=>({side:x.side,tx:x.tx,progress:+(x.elapsed/x.dur).toFixed(2)})),effects:s.effects.map(x=>({x:Math.round(x.x),kind:x.kind,life:+x.life.toFixed(2)})),over:s.over,winner:s.winner};
}
// 모바일 최적화: 24~30FPS로 제한, 스프라이트 사전 렌더/캐싱,
// Firestore 전송은 약 1초 1회만(실시간성/비용 절충).
const sprites=new Map();let lastDraw=0,lastUi=0,latestHostState=null,lastSerialize=0,accumulator=0;
// 싱글플레이의 배경 생성/적 성/쓰레기통 성을 동일한 함수로 1회 그려 캐싱합니다.
// 24FPS 모바일에서 매 프레임 지형을 다시 계산하지 않아 CPU 소모를 줄입니다.
let scenery=null;
function sharedScenery(){
 if(scenery)return scenery;
 const oldS=S,oldCH=CH,oldStage=stageIdx;
 const cv=document.createElement('canvas');cv.width=800;cv.height=300;
 try{
  S={t:0,lid:0};CH=0;stageIdx=0;
  g.save();g.clearRect(0,0,800,300);bg();drawEnemyBase(10,150);drawCan(W-60,150);g.restore();
  cv.getContext('2d').drawImage(g.canvas,0,0);
 }catch(err){console.warn('싱글플레이 배경 캐시 실패',err);}
 finally{S=oldS;CH=oldCH;stageIdx=oldStage;}
 scenery=cv;return scenery;
}

function spriteOf(u,teamSide){
 const key=u.unitId+':'+u.form+':'+teamSide;
 if(sprites.has(key))return sprites.get(key);
 const def=MY.find(x=>x.id===u.unitId);if(!def)return null;
 let v=def;if(u.form>=3&&def.f3)v=Object.assign({},def,def.f2||{},def.f3);else if(u.form>=2&&def.f2)v=Object.assign({},def,def.f2);
 const sc=Math.min(4,v.s||4),w=Math.max(...v.grid.map(r=>r.length))*sc,h=v.grid.length*sc;
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;
 spr(v.grid,0,0,sc,false,pl(v),cv.getContext('2d'));
 const entry={cv,w,h};sprites.set(key,entry);return entry;
}
function frame(now){
 if(pv.closed||!pv.rendering)return;
 const elapsed=Math.min(.1,Math.max(0,(now-pv.last)/1000));pv.last=now;
 if(pv.side===0&&pv.sim){
  // 고정 시뮬레이션 단계: 저사양 휴대폰의 프레임 저하에 영향받지 않는 공격·경제 판정.
  accumulator=Math.min(.12,accumulator+elapsed);
  let steps=0;
  while(accumulator>=1/30&&steps++<4){tick(1/30);accumulator-=1/30;}
  if(now-lastSerialize>100){latestHostState=serialize();lastSerialize=now;}
  if(pv.room&&!pv.sim.over&&now-pv.lastPublish>PVP_SYNC_MS&&!pv.publishing){
   pv.lastPublish=now;pv.publishing=true;
   pv.room.update({snapshot:latestHostState||serialize(),lastActive:Date.now()}).catch(error).finally(()=>{pv.publishing=false;});
  }
 }
 const targetFrame=matchMedia('(pointer:coarse)').matches?42:33;
 if(now-lastDraw>=targetFrame){lastDraw=now;draw(pv.side===0?latestHostState:pv.remote,now);}
 pv.frame=requestAnimationFrame(frame);
}
function draw(state,now){
 const cv=$p('pvpCanvas'),ctx=cv.getContext('2d');if(!ctx)return;
 ctx.imageSmoothingEnabled=false;
 // 싱글플레이에서 쓰는 bg(), drawEnemyBase(), drawCan() 결과를 그대로 사용.
 ctx.drawImage(sharedScenery(),0,0);
 if(!state||!state.players){ctx.fillStyle='#182939';ctx.textAlign='center';ctx.font='bold 16px sans-serif';ctx.fillText('대전 동기화 중...',400,123);return;}
 const me=pv.side,other=1-me,mirror=x=>me===0?x:800-x;
 for(const u of state.units||[]){
  const p=spriteOf(u,u.side);if(!p)continue;
  let realX=u.x;
  if(me===1&&pv.remotePrevious&&pv.remoteStart&&now-pv.remoteStart<950){
   const before=(pv.remotePrevious.units||[]).find(o=>o.id===u.id);
   if(before){const q=Math.min(1,(now-pv.remoteStart)/380);realX=before.x+(u.x-before.x)*q;}
  }
  const x=mirror(realX),flip=u.side===me;
  const bob=u.attack?-Math.abs(Math.sin(now*.012))*3:0;
  ctx.save();ctx.translate(x,250+bob);ctx.scale(flip?-1:1,1);
  const attackOffset=u.attack?10:0;
  ctx.drawImage(p.cv,-p.w/2+attackOffset,-p.h);
  if(u.attack){const range=p.w/2+14;
   ctx.strokeStyle='#fff6ae';ctx.lineWidth=4;ctx.globalAlpha=.8;
   if(u.an==='beam'){ctx.fillStyle='#9beaff99';ctx.fillRect(-range-68,-p.h*.62,70,7);}
   else if(u.an==='fire'){ctx.fillStyle='#ff9b3099';ctx.beginPath();ctx.moveTo(-range,-p.h*.55);ctx.lineTo(-range-50,-p.h*.8);ctx.lineTo(-range-55,-p.h*.3);ctx.fill();}
   else{ctx.beginPath();ctx.arc(-range,-p.h*.55,18,-1.3,1.1);ctx.stroke();}
  }
  ctx.restore();
  if(u.slow){ctx.fillStyle='#65aeff66';ctx.fillRect(x-p.w/2,250-p.h,p.w,p.h);}
  if(u.freeze){ctx.fillStyle='#afeaff99';ctx.fillRect(x-p.w/2,250-p.h,p.w,p.h);}
  // 유닛 HP 바, 성 HP 바 없음: 싱글 전투와 동일한 화면 정책
 }
 // 대포 궤적·착탄. 양쪽 화면에서 원근/방향 자동 반전.
 for(const shot of state.shots||[]){const from=mirror(shot.side===0?750:50),to=mirror(shot.tx),progress=shot.progress;
  ctx.strokeStyle='#fff0a8';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(from,174);ctx.lineTo(from+(to-from)*progress,174-70*Math.sin(progress*Math.PI));ctx.stroke();
  ctx.fillStyle='#ffbd33';ctx.beginPath();ctx.arc(from+(to-from)*progress,174-70*Math.sin(progress*Math.PI),7,0,7);ctx.fill();
 }
 for(const e of state.effects||[]){const x=mirror(e.x),r=e.kind==='boom'?36:e.kind==='spawn'?18:10;
  ctx.globalAlpha=Math.max(.15,Math.min(.85,e.life*2));ctx.strokeStyle=e.kind==='boom'?'#ff8b20':e.kind==='spawn'?'#9fffea':'#fff0b5';
  ctx.lineWidth=e.kind==='boom'?6:3;ctx.beginPath();ctx.ellipse(x,224,r*(1+Math.max(0,.5-e.life)),r*.55,0,0,7);ctx.stroke();ctx.globalAlpha=1;
 }
 // UI는 매 프레임 고치지 않고 0.2초 간격으로만 갱신해 모바일 DOM 비용 감소
 if(now-lastUi<200)return;lastUi=now;
 const p=state.players[me];
 $p('pvpMoney').textContent=Math.round(p.money).toLocaleString()+' / '+p.maxMoney.toLocaleString()+'원';
 $p('pvpWorker').textContent='일꾼 건우 Lv'+p.worker+' · '+Math.round(p.wkCost||80)+'원';
 $p('pvpCannon').textContent=p.cannon>=1?'쓰레기포 발사':'쓰레기포 '+Math.round(p.cannon*100)+'%';
 $p('pvpCannon').disabled=p.cannon<1;
 Array.from($p('pvpSlots').children).forEach((b,i)=>{const cd=p.cool[i]||0;b.style.opacity=cd>0?'.52':'1';b.title=cd>0?'대기 '+cd.toFixed(1)+'초':'생산 가능';});
}
window.addEventListener('pagehide',()=>{if(pv.room&&pv.side===0&&pv.sim&&!pv.sim.over){pv.room.update({status:'ended',winner:1,reason:'방장 연결 종료'}).catch(()=>{});}});
})();
