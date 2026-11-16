// 건우 대전쟁 · 프라이빗 1:1 (Firebase Firestore)
// 방장 브라우저가 판정을 맡는 친구 간 대전. 공정한 랭크전용 서버는 별도 필요.
(function(){
'use strict';
const pv={room:null,code:'',side:-1,unsub:null,unsubCommands:null,seen:new Set(),sim:null,frame:0,last:0,lastPublish:0,publishing:false,remote:null,closed:false,rendering:false,joining:false};
const $p=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeName=s=>String(s||'건우').slice(0,16);
const PVP_MAX_UNITS=38;
const PVP_COST_MULT=1.5; // 세계편 2장 가격 기준
const PVP_DURATION=180;
const pvpDeck=()=>{
 const selected=fl().slice(0,10);
 return selected.map(id=>({id,level:Math.max(1,Math.min(30,Number(lv[id])||1)),plus:Math.max(0,Math.min(200,Number(plusLv[id])||0)),form:Math.min(3,Math.max(1,Number(fsel[id])||1)),trn:tn[id]||{hp:0,atk:0,spd:0}}));
};
const pvpStats=()=>({research:Math.max(1,Math.min(20,Number(basicLv.research)||1)),baseHp:Math.max(1,Math.min(20,Number(basicLv.baseHp)||1)),wallet:Math.max(1,Math.min(20,Number(basicLv.wallet)||1))});
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
 pv.frame=0;pv.sim=null;pv.remote=null;pv.room=null;pv.code='';pv.side=-1;pv.seen.clear();pv.rendering=false;pv.publishing=false;
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
   else if(pv.side===1){if(!$p('pvpLobby').classList.contains('hide'))startGuest(d);if(d.snapshot&&d.snapshot.players)pv.remote=d.snapshot;}
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
 pv.last=performance.now();pv.rendering=true;pv.frame=requestAnimationFrame(frame);
}
function startGuest(d){pv.remote=d.snapshot||null;activatePlay(d);}
function startHost(d){
 pv.sim={t:0,over:false,players:[player(d.hostDeck,d.hostStats),player(d.guestDeck,d.guestStats)],units:[],seq:0,winner:-1};
 pv.unsubCommands=pv.room.collection('commands').onSnapshot(snap=>{
  if(pv.closed||!pv.sim||pv.sim.over)return;
  snap.docChanges().forEach(c=>{
   if(c.type!=='added'||pv.seen.has(c.doc.id))return;pv.seen.add(c.doc.id);
   const cmd=c.doc.data(),side=cmd.side;
   if((side===0&&cmd.uid!==d.hostUid)||(side===1&&cmd.uid!==d.guestUid))return;
   if(side!==0&&side!==1)return;
   command(side,cmd.kind,cmd.slot);
   c.doc.ref.delete().catch(()=>{});
  });
 },error);
 activatePlay(d);
}
function player(deck,stats){return{deck:Array.isArray(deck)?deck.slice(0,10):[],stats:stats||{},money:250,maxMoney:3000,rate:55,worker:1,baseHp:5000,cool:Array(10).fill(0),cannon:1};}
function buildButtons(d){
 const root=$p('pvpSlots');root.replaceChildren();const deck=pv.side===0?d.hostDeck:d.guestDeck;
 (deck||[]).slice(0,10).forEach((item,i)=>{
  const u=MY.find(x=>x.id===item.id);const b=document.createElement('button');
  if(u){const cv=ico(u);b.appendChild(cv);const l=document.createElement('span');l.textContent=Math.round(u.cost*PVP_COST_MULT)+'원';b.appendChild(l);b.onclick=()=>send('deploy',i);}
  else{b.textContent='—';b.disabled=true;}
  root.appendChild(b);
 });
}
function send(kind,slot){
 if(!pv.room||pv.closed)return;
 if(kind!=='deploy'&&kind!=='worker'&&kind!=='cannon')return;
 if(kind==='deploy'&&(!Number.isInteger(slot)||slot<0||slot>9))return;
 if(pv.side===0){command(0,kind,slot);return;}
 if(pv.side===1)pv.room.collection('commands').add({uid:user.uid,side:1,kind,slot:kind==='deploy'?slot:0,createdAt:Date.now()}).catch(error);
}
$p('pvpWorker').onclick=()=>send('worker',0);
$p('pvpCannon').onclick=()=>send('cannon',0);
function formUnit(p,item){
 const base=MY.find(u=>u.id===item.id);if(!base)return null;
 const total=Math.max(1,Math.min(230,Number(item.level||1)+Number(item.plus||0)));
 let v=base;
 const f=Number(item.form||1);
 if(f>=3&&base.f3&&total>=30)v=Object.assign({},base,base.f3);
 else if(f>=2&&base.f2&&total>=10)v=Object.assign({},base,base.f2);
 const mult=(1+0.1*(total-1))*(f>=3&&v!==base?1.5:f>=2&&v!==base?1.25:1);
 const train=item.trn||{};
 const t=Object.assign({},v,{atk:Math.min(50000,v.atk*mult*(1+Math.min(15,Number(train.atk)||0)*0.05)),speed:v.speed*(1+Math.min(15,Number(train.spd)||0)*.05)});
 const hp=Math.min(150000,v.hp*mult*(1+Math.min(15,Number(train.hp)||0)*.05));
 return {T:t,hp,maxHp:hp};
}
function command(side,kind,slot){
 const s=pv.sim;if(!s||s.over)return;const p=s.players[side];if(!p)return;
 if(kind==='worker'){
  if(p.worker>=8)return;const cost=100*p.worker;if(p.money<cost)return;
  p.money-=cost;p.worker++;p.maxMoney+=350;p.rate+=18;return;
 }
 if(kind==='cannon'){
  if(p.cannon<1)return;p.cannon=0;
  const targets=s.units.filter(u=>u.side!==side&&u.hp>0).sort((a,b)=>side===0?a.x-b.x:b.x-a.x);
  targets.slice(0,5).forEach(u=>damage(u,160));return;
 }
 if(kind==='deploy'){
  if(!Number.isInteger(slot)||slot<0||slot>=p.deck.length)return;
  const item=p.deck[slot],v=formUnit(p,item);if(!v)return;
  const cost=Math.round(v.T.cost*PVP_COST_MULT);
  if(p.money<cost||p.cool[slot]>0||s.units.filter(u=>u.side===side).length>=PVP_MAX_UNITS)return;
  p.money-=cost;
  const research=Math.min(20,Math.max(1,Number(p.stats.research)||1));
  p.cool[slot]=Math.max(1,Math.min(30,v.T.cool*(1-0.035*research)));
  s.units.push({id:++s.seq,side,unitId:item.id,form:item.form||1,x:side===0?720:80,hp:v.hp,maxHp:v.hp,atk:v.T.atk,range:Math.min(380,Math.max(18,v.T.range)),speed:v.T.speed,cd:Math.max(.3,v.T.cd),timer:0,area:!!v.T.area,ty:v.T.ty||['무속성'],freezeNeutral:v.T.freezeNeutral||0,freezeTime:v.T.freezeTime||0,slowS:!!v.T.slowS,slow:0,freeze:0});
 }
}
function damage(u,value){u.hp=Math.max(0,u.hp-Math.max(1,value));}
function tick(dt){
 const s=pv.sim;if(!s||s.over)return;s.t+=dt;
 for(const p of s.players){p.money=Math.min(p.maxMoney,p.money+p.rate*dt);p.cannon=Math.min(1,p.cannon+dt/25);p.cool=p.cool.map(v=>Math.max(0,v-dt));}
 for(const u of s.units){
  if(u.hp<=0)continue;
  u.timer-=dt;u.freeze=Math.max(0,u.freeze-dt);u.slow=Math.max(0,u.slow-dt);
  if(u.freeze>0)continue;
  const dir=u.side===0?-1:1,foes=s.units.filter(v=>v.side!==u.side&&v.hp>0&&dir*(v.x-u.x)>=-10).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x));
  const target=foes[0];const baseX=u.side===0?55:745;
  const dist=target?Math.abs(u.x-target.x):Infinity;
  if(dist<=u.range||Math.abs(u.x-baseX)<=u.range){
   if(u.timer<=0){u.timer=u.cd;
    const hits=u.area?foes.filter(v=>Math.abs(v.x-u.x)<=u.range):target&&dist<=u.range?[target]:[];
    for(const v of hits){
     const mult=tmul(u.ty[0],v.ty);damage(v,u.atk*mult);
     if(u.freezeNeutral&&v.ty.includes('무속성')&&Math.random()<u.freezeNeutral)v.freeze=Math.max(v.freeze,u.freezeTime||2);
     if(u.slowS&&mult>1)v.slow=Math.max(v.slow,3);
    }
    if(Math.abs(u.x-baseX)<=u.range)s.players[1-u.side].baseHp=Math.max(0,s.players[1-u.side].baseHp-u.atk);
   }
  }else u.x=Math.max(55,Math.min(745,u.x+dir*u.speed*(u.slow>0?.3:1)*dt));
 }
 s.units=s.units.filter(u=>u.hp>0);
 if(s.players[0].baseHp<=0||s.players[1].baseHp<=0||s.t>=PVP_DURATION){
  const h=s.players[0].baseHp,g=s.players[1].baseHp;
  s.winner=h===g?-1:h>g?0:1;s.over=true;
  pv.room.update({status:'ended',winner:s.winner,reason:s.winner<0?'무승부':(s.winner===0?'방장 승리!':'참가자 승리!'),lastActive:Date.now(),snapshot:serialize()}).catch(error);
 }
}
function serialize(){
 const s=pv.sim;
 return {t:+s.t.toFixed(1),players:s.players.map(p=>({money:Math.round(p.money),maxMoney:p.maxMoney,rate:Math.round(p.rate),worker:p.worker,baseHp:Math.round(p.baseHp),cool:p.cool.map(x=>+x.toFixed(1)),cannon:+p.cannon.toFixed(2)})),units:s.units.map(u=>({id:u.id,side:u.side,unitId:u.unitId,form:u.form,x:Math.round(u.x),hp:Math.round(u.hp),maxHp:Math.round(u.maxHp),slow:u.slow>0,freeze:u.freeze>0})),over:s.over,winner:s.winner};
}
function frame(now){
 if(pv.closed||!pv.rendering)return;
 const dt=Math.min(.08,Math.max(0,(now-pv.last)/1000));pv.last=now;
 if(pv.side===0&&pv.sim){tick(dt);
  if(pv.room&&!pv.sim.over&&now-pv.lastPublish>450&&!pv.publishing){pv.lastPublish=now;pv.publishing=true;pv.room.update({snapshot:serialize(),lastActive:Date.now()}).catch(error).finally(()=>{pv.publishing=false;});}
 }
 draw(pv.side===0&&pv.sim?serialize():pv.remote);
 pv.frame=requestAnimationFrame(frame);
}
function draw(state){
 const cv=$p('pvpCanvas'),ctx=cv.getContext('2d');if(!ctx)return;
 const grd=ctx.createLinearGradient(0,0,0,295);grd.addColorStop(0,'#8ed4ff');grd.addColorStop(1,'#bce9f1');ctx.fillStyle=grd;ctx.fillRect(0,0,800,295);
 ctx.fillStyle='#6dba67';ctx.fillRect(0,245,800,50);ctx.fillStyle='#55994c';ctx.fillRect(0,246,800,7);
 ctx.fillStyle='#b18a63';ctx.fillRect(20,152,60,94);ctx.fillRect(720,152,60,94);
 ctx.fillStyle='#424e5e';ctx.fillRect(24,157,52,7);ctx.fillRect(724,157,52,7);
 ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillStyle='#111';ctx.fillText('성',50,190);ctx.fillText('성',750,190);
 if(!state||!state.players){ctx.fillText('전투 동기화 중...',400,120);return;}
 const me=pv.side===0?0:1,other=1-me;const mirror=x=>pv.side===0?x:800-x;
 ctx.fillStyle='#263445';ctx.fillRect(10,125,95,10);ctx.fillRect(695,125,95,10);
 ctx.fillStyle='#e15846';ctx.fillRect(10,125,Math.max(0,95*state.players[other].baseHp/5000),10);
 ctx.fillStyle='#4bdb86';ctx.fillRect(695,125,Math.max(0,95*state.players[me].baseHp/5000),10);
 for(const u of state.units){const def=MY.find(x=>x.id===u.unitId);if(!def)continue;
  let v=def;if(u.form>=3&&def.f3)v=Object.assign({},def,def.f3);else if(u.form>=2&&def.f2)v=Object.assign({},def,def.f2);
  const grid=v.grid;const sz=Math.min(4,v.s||4),w=Math.max(...grid.map(r=>r.length))*sz,h=grid.length*sz;
  const x=mirror(u.x),flip=(u.side===0)!==(pv.side===1);
  spr(grid,Math.round(x-w/2),245-h,sz,flip,pl(v),ctx);
  ctx.fillStyle='#19212a';ctx.fillRect(x-22,245-h-9,44,5);
  ctx.fillStyle=u.side===me?'#37c86b':'#ee654c';ctx.fillRect(x-21,245-h-8,42*Math.max(0,u.hp/u.maxHp),3);
  if(u.freeze){ctx.fillStyle='#57c3ff77';ctx.fillRect(x-w/2,245-h,w,h);}
 }
 $p('pvpMoney').textContent='돈 '+state.players[me].money.toLocaleString()+' / '+state.players[me].maxMoney.toLocaleString();
 $p('pvpTimer').textContent='남은 시간 '+Math.ceil(Math.max(0,PVP_DURATION-state.t))+'초';
 $p('pvpWorker').textContent='일꾼 Lv'+state.players[me].worker+'\n강화 '+(state.players[me].worker*100)+'원';
 $p('pvpCannon').textContent=state.players[me].cannon>=1?'대포 발사':'대포 '+Math.round(state.players[me].cannon*100)+'%';
 Array.from($p('pvpSlots').children).forEach((b,i)=>{const cd=state.players[me].cool[i]||0;b.style.opacity=cd>0?'.55':'1';b.title=cd>0?'대기 '+cd.toFixed(1)+'초':'생산 가능';});
}
window.addEventListener('pagehide',()=>{if(pv.room&&pv.side===0&&pv.sim&&!pv.sim.over){pv.room.update({status:'ended',winner:1,reason:'방장 연결 종료'}).catch(()=>{});}});
})();
