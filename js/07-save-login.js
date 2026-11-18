// 건우 대전쟁 · 07-save-login.js
// ════════ 계정 / 저장 ════════
// ▼▼ 클라우드 로그인(Google/GitHub)을 쓰려면 Firebase 웹앱 설정을 여기에 붙여넣으세요.
const FB={
  apiKey:"AIzaSyDJWR1AxeYk2eE2oaF-_hB-DJNTdoRG--I",
  authDomain:"gunwoo-war.firebaseapp.com",
  projectId:"gunwoo-war",
  appId:"1:761839681560:web:d4a0c2ad9607feb948036d"
};
let basicLv={wallet:1,worker:1,research:1,accounting:1,baseHp:1,cannon:1},upCategory='N',treasureChapter=0;
let UID='guest',user=null,cleared={},trc={},lv={},plusLv={},xp=0,tk=2,em=0,rt=1,own={},fsel={},tn={},form=[],qc={},qs={wins:0,kills:0,cn:0,wk:1,ga:0},seenEnemies={},vtsCleared={},daily={last:'',streak:0,total:0,history:[]},energy={value:100,updated:Date.now()},CH=0;
const K=k=>k+(UID==='guest'?'':'@'+UID); // 게스트는 예전 저장 키를 그대로 사용
const ck=i=>CH*100+i; // 클리어 기록 키: 1장 0~47, 2장 100~147, 3장 200~247
const snap=()=>({clear:cleared,trc,lv,xp,meta:{tk,em,rt,own,fsel,plusLv,tn,form,qc,qs,basicLv,seenEnemies,vtsCleared,daily,energy,mig}});
function grantClearedRewards(){if(cleared[47])own.fist=1;if(cleared[147])own.cornbar=1;if(cleared[247])own.healthytooth=1;}
function applyData(d){const m=d.meta||{};cleared=d.clear||{};trc=d.trc||{};
  // 기존 단일 보물 저장을 1장 보물로 이관 (로그인 계정별 저장 호환)
  for(const item of ALLT)if(trc[item]&&!trc[treasureKey(0,item)])trc[treasureKey(0,item)]=1;
  for(const item of ALLT)delete trc[item];lv=d.lv||{};plusLv=m.plusLv||{};xp=+d.xp||0;
  basicLv=Object.assign({wallet:1,worker:1,research:1,accounting:1,baseHp:1,cannon:1},m.basicLv||{});
  tk=m.tk===undefined?2:+m.tk||0;em=+m.em||0;rt=m.rt===undefined?1:+m.rt||0;own=m.own||{};fsel=m.fsel||{};tn=m.tn||{};form=Array.isArray(m.form)?m.form:[];qc=m.qc||{};
  qs=Object.assign({wins:0,kills:0,cn:0,wk:1,ga:0},m.qs||{});seenEnemies=m.seenEnemies||{};vtsCleared=m.vtsCleared||{};daily=Object.assign({last:'',streak:0,total:0,history:[]},m.daily||{});energy=Object.assign({value:100,updated:Date.now()},m.energy||{});mig=m.mig||{};migrateFutureTreasures();grantClearedRewards();resetVTSOnce();}
// 2026-11-18: VTS 캐릭터 1회 초기화 (건우 스토리 이전). 이미 가진 VTS 캐릭터·레벨·강화·편성·클리어 기록을 지우고 다시 획득하도록 합니다.
function resetVTSOnce(){if(mig.vtsReset1)return;
  for(const u of MY)if(u.id.startsWith('vts_')){delete own[u.id];delete lv[u.id];delete plusLv[u.id];delete tn[u.id];delete fsel[u.id];}
  form=form.filter(id=>!String(id).startsWith('vts_'));vtsCleared={};mig.vtsReset1=1;}
function loadAll(){const j=(k,d)=>{try{return JSON.parse(localStorage.getItem(K(k))||'null')||d;}catch(e){return d;}};let x=0;try{x=+localStorage.getItem(K('gw_xp'))||0;}catch(e){}
  applyData({clear:j('gw_clear',{}),trc:j('gw_trc',{}),lv:j('gw_lv',{}),xp:x,meta:j('gw_meta',{})});}
let fbA=null,fbDb=null,pushT=0,mig={};
function save(){try{const d=snap();localStorage.setItem(K('gw_clear'),JSON.stringify(d.clear));localStorage.setItem(K('gw_trc'),JSON.stringify(d.trc));localStorage.setItem(K('gw_lv'),JSON.stringify(d.lv));localStorage.setItem(K('gw_xp'),String(d.xp));localStorage.setItem(K('gw_meta'),JSON.stringify(d.meta));}catch(e){}cloudPush();}
const ldScript=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('스크립트를 불러오지 못했어요'));document.head.appendChild(s);});
async function fbInit(){if(!FB)throw new Error('Firebase 설정이 아직 없어요 (코드의 FB 변수)');if(fbA)return;const B='https://www.gstatic.com/firebasejs/10.12.2/';
  await ldScript(B+'firebase-app-compat.js');await ldScript(B+'firebase-auth-compat.js');await ldScript(B+'firebase-firestore-compat.js');
  firebase.initializeApp(FB);fbA=firebase.auth();fbDb=firebase.firestore();}
function cloudPush(){if(!user||user.type!=='cloud'||!fbDb)return;clearTimeout(pushT);
  pushT=setTimeout(()=>{fbDb.collection('users').doc(user.uid).set({d:JSON.stringify(snap()),t:Date.now()}).catch(()=>{});},1500);}
async function cloudPull(){const r=await fbDb.collection('users').doc(user.uid).get();
  if(r.exists){try{applyData(JSON.parse(r.data().d));}catch(e){}}save();}
function setUser(u){user=u;UID=u.type==='guest'?'guest':u.id;try{localStorage.setItem('gw_session',JSON.stringify(u));}catch(e){}}
function enter(u){setUser(u);loadAll();save();buildWorld();show('world');}
async function cloudLogin(k){const m=$('cloudMsg');m.textContent='로그인 중…';
  try{await fbInit();const p=k==='g'?new firebase.auth.GoogleAuthProvider():new firebase.auth.GithubAuthProvider();const r=await fbA.signInWithPopup(p);
    setUser({id:'c_'+r.user.uid,uid:r.user.uid,name:r.user.displayName||r.user.email||'건우',type:'cloud'});loadAll();await cloudPull();buildWorld();show('world');m.textContent='';}
  catch(e){m.textContent='⚠ '+(e.message||e);}}
function logout(){try{fbA&&fbA.signOut();}catch(e){}user=null;UID='guest';try{localStorage.removeItem('gw_session');}catch(e){}loadAll();show('login');}
$('lgG').disabled=$('lgGH').disabled=!FB;
$('cloudMsg').textContent=FB?'':'(클라우드 로그인은 Firebase 설정 후 사용할 수 있어요)';
$('lgG').onclick=()=>cloudLogin('g');$('lgGH').onclick=()=>cloudLogin('gh');
$('lgLocal').onclick=()=>{const n=$('nick').value.trim().slice(0,12);if(!n){toast('닉네임을 입력하세요');return;}enter({id:'n_'+n.toLowerCase(),name:n,type:'local'});};
$('lgGuest').onclick=()=>enter({id:'guest',name:'게스트',type:'guest'});
$('lgBack').onclick=()=>show('start');
$('goOut').onclick=logout;
$('goStart').onclick=()=>{if(user){buildWorld();show('world');}else show('login');};
loadAll();
(async function restore(){try{const s=JSON.parse(localStorage.getItem('gw_session')||'null');if(!s)return;
  if(s.type==='cloud'){if(!FB)return;await fbInit();const u=await new Promise(r=>{const un=fbA.onAuthStateChanged(x=>{un();r(x);});});
    if(u){setUser(s);loadAll();await cloudPull();if(!$('select').classList.contains('hide'))buildGrid();}}
  else{setUser(s);loadAll();}}catch(e){}})();


// 기력: 원작 미래편 타임머신/미래 기술 보물을 실제 게임 자원으로 사용
const maxEnergy=()=>100+Math.round(90*futureTreasureProgress('f_capacity'));
const energyInterval=()=>60-30*futureTreasureProgress('f_time');
function currentEnergy(){
 const now=Date.now(),elapsed=Math.max(0,(now-(+energy.updated||now))/1000);
 const gained=Math.floor(elapsed/energyInterval());
 if(gained>0){energy.value=Math.min(maxEnergy(),Math.max(0,+energy.value||0)+gained);energy.updated=now-(elapsed%energyInterval())*1000;}
 return Math.min(maxEnergy(),Math.floor(Math.max(0,+energy.value||0)));
}
