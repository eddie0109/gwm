// 건우 대전쟁 · 07-save-login.js
// ════════ 계정 / 저장 ════════
// ▼▼ 클라우드 로그인(Google/GitHub)을 쓰려면 Firebase 웹앱 설정을 여기에 붙여넣으세요.
const FB={
  apiKey:"AIzaSyDJWR1AxeYk2eE2oaF-_hB-DJNTdoRG--I",
  authDomain:"gunwoo-war.firebaseapp.com",
  projectId:"gunwoo-war",
  appId:"1:761839681560:web:d4a0c2ad9607feb948036d"
};
// ▼▼ Google 공식 로그인 버튼(Google Identity Services)용 웹 클라이언트 ID. 비밀값이 아니에요.
// Firebase 콘솔 → Authentication → 로그인 방법 → Google → 「웹 SDK 구성」의 웹 클라이언트 ID를 붙여넣으면
// firebaseapp.com 중계 페이지를 거치지 않는 방식으로 로그인합니다(브라우저 사생활 보호 기능에 막히지 않음).
// 비워 두면 기존 팝업/페이지 이동 방식을 씁니다.
const GOOGLE_CLIENT_ID="761839681560-irahcrvv5mb82ng1lgr9mhspg7f0pdgf.apps.googleusercontent.com";
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
let fbReady=null; // 여러 곳에서 동시에 불러도 Firebase는 한 번만 로드
function fbInit(){return fbReady||(fbReady=fbLoad().catch(e=>{fbReady=null;throw e;}));}
async function fbLoad(){if(!FB)throw new Error('Firebase 설정이 아직 없어요 (코드의 FB 변수)');if(fbA)return;const B='https://www.gstatic.com/firebasejs/10.12.2/';
  await ldScript(B+'firebase-app-compat.js');await ldScript(B+'firebase-auth-compat.js');await ldScript(B+'firebase-firestore-compat.js');
  // 메인 앱은 authDomain 없이 시작: 시작할 때 firebaseapp.com 중계 페이지(숨은 iframe)를 불러오지 않아
  // 학교 기기처럼 그 페이지가 막힌 환경에서도 로그인 프로그램이 멈추지 않습니다. (Google 공식 버튼 로그인·저장에는 필요 없음)
  const main=Object.assign({},FB);delete main.authDomain;
  firebase.initializeApp(main);fbA=firebase.auth();fbDb=firebase.firestore();}
// 팝업/페이지 이동 로그인(GitHub, 또는 Google 버튼을 못 쓸 때)은 중계 페이지가 필요해서 별도 앱에서 하고,
// 받은 자격 증명으로 메인 앱에 로그인합니다.
let popA=null;
function popupAuth(){if(!popA)popA=firebase.initializeApp(FB,'popup').auth();return popA;}
async function signInFromPopupResult(r){
  if(!r||!r.user)return null;
  if(r.credential){const m=await fbA.signInWithCredential(r.credential);return m.user;}
  throw Object.assign(new Error('로그인 정보를 넘겨받지 못했어요'),{code:'auth/missing-credential'});
}
function cloudPush(){if(!user||user.type!=='cloud'||!fbDb)return;clearTimeout(pushT);
  pushT=setTimeout(()=>{fbDb.collection('users').doc(user.uid).set({d:JSON.stringify(snap()),t:Date.now()}).catch(()=>{});},1500);}
async function cloudPull(){const r=await fbDb.collection('users').doc(user.uid).get();
  if(r.exists){try{applyData(JSON.parse(r.data().d));}catch(e){}}save();}
function setUser(u){user=u;UID=u.type==='guest'?'guest':u.id;try{localStorage.setItem('gw_session',JSON.stringify(u));}catch(e){}}
function enter(u){setUser(u);loadAll();save();buildWorld();show('world');}
// ── 클라우드 로그인
// 1) Firebase를 페이지 열 때 미리 불러와 둬서, 버튼을 누르는 즉시 로그인 창이 열리게 합니다(늦게 열리면 브라우저가 창을 막거나 닫음).
// 2) 팝업이 막히는 환경이면 페이지 이동 방식(redirect)으로 다시 시도합니다.
// 3) 카카오톡·인스타그램 등 앱 안 브라우저는 구글이 로그인을 막으므로 외부 브라우저로 열도록 안내합니다.
const IN_APP=/KAKAOTALK|Instagram|NAVER\(|FBAN|FBAV|Line\/|DaumApps|everytimeApp|BAND\//i.test(navigator.userAgent);
// 앱 안 브라우저 → 외부 브라우저로 같은 주소 열기
// 카카오톡: kakaotalk://web/openExternal (아이폰·안드로이드 모두) / 안드로이드의 다른 앱: 크롬 intent / 그 외: 안내
const IS_KAKAO=/KAKAOTALK/i.test(navigator.userAgent),IS_ANDROID=/Android/i.test(navigator.userAgent);
function openExternalBrowser(){
  const m=$('cloudMsg'),url=location.href;
  if(IS_KAKAO){m.textContent='카카오톡에서는 구글 로그인이 막혀 있어서 외부 브라우저로 열어요…';location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(url);}
  else if(IS_ANDROID){m.textContent='앱 안 브라우저에서는 구글 로그인이 막혀 있어서 크롬으로 열어요…';location.href='intent://'+url.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end';}
  else{m.textContent='⚠ 앱 안 브라우저에서는 구글 로그인이 막혀 있어요. 화면의 공유(⋯) 버튼 → "Safari로 열기"를 눌러 주세요.';return;}
  setTimeout(()=>{if(document.visibilityState==='visible')m.textContent='⚠ 외부 브라우저가 열리지 않았다면, 화면 메뉴(⋮ 또는 공유)에서 "다른 브라우저로 열기"를 눌러 주세요.';},2500);
}
const AUTH_MSG={
 'auth/popup-closed-by-user':'로그인 창이 완료 전에 닫혔어요. 다시 눌러 주세요. 창이 저절로 바로 닫힌다면 팝업 차단을 풀거나 크롬·사파리에서 열어 주세요.',
 'auth/cancelled-popup-request':'로그인 창이 이미 열려 있어요. 열린 창에서 계속해 주세요.',
 'auth/popup-blocked':'브라우저가 로그인 창을 막았어요. 주소창의 팝업 차단을 허용한 뒤 다시 눌러 주세요.',
 'auth/unauthorized-domain':'이 주소는 Firebase 승인 도메인에 없어요. Firebase 콘솔 → Authentication → 설정 → 승인된 도메인에 지금 사이트 주소를 추가해 주세요.',
 'auth/network-request-failed':'로그인 서버와 연결하지 못했어요. 광고 차단 확장 프로그램·Brave 쉴드·사파리 "크로스 사이트 추적 방지"를 끄거나 크롬에서 다시 시도해 주세요.',
 'auth/account-exists-with-different-credential':'같은 이메일로 다른 방식(구글/깃허브) 로그인이 이미 있어요. 처음 쓰던 방식으로 로그인해 주세요.',
 'auth/web-storage-unsupported':'이 브라우저는 로그인 정보를 저장할 수 없어요(사생활 보호 모드 등). 일반 창에서 열어 주세요.',
 'auth/operation-not-allowed':'Firebase 콘솔에서 이 로그인 방식이 꺼져 있어요. Authentication → 로그인 방법에서 켜 주세요.'
};
// 로그인에 필요한 서버에 실제로 닿는지 확인 → 막힌 곳이 있으면 원인 안내 문구, 모두 닿으면 null
async function probeAuthNet(){
  if(navigator.onLine===false)return '⚠ 인터넷에 연결되어 있지 않아요. 와이파이·데이터를 확인해 주세요.';
  const reach=async u=>{try{await Promise.race([fetch(u,{mode:'no-cors',cache:'no-store'}),new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),6000))]);return true;}catch(_){return false;}};
  const [auth,api,google]=await Promise.all([reach('https://'+FB.authDomain+'/__/auth/iframe.js'),reach('https://identitytoolkit.googleapis.com/v1/projects?key='+FB.apiKey),reach('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')]);
  const blocked=[!auth&&FB.authDomain,!api&&'identitytoolkit.googleapis.com',!google&&'www.gstatic.com'].filter(Boolean);
  if(!blocked.length)return null;
  return '⚠ 이 브라우저에서 로그인 서버('+blocked.join(', ')+') 연결이 막혀 있어요. 광고 차단 확장 프로그램·Brave 쉴드·보안 앱·학교/회사 와이파이 차단을 끄거나, 다른 브라우저(크롬·사파리)나 모바일 데이터로 다시 시도해 주세요.';
}
const authMsg=e=>'⚠ '+(AUTH_MSG[e&&e.code]||('로그인 실패: '+((e&&e.message)||e)));
async function finishCloudLogin(u){
  setUser({id:'c_'+u.uid,uid:u.uid,name:u.displayName||u.email||'건우',type:'cloud'});loadAll();await cloudPull();buildWorld();show('world');$('cloudMsg').textContent='';
}
// 페이지 이동 방식이 브라우저에 막혀 아무 일도 안 일어나면 10초 뒤 안내
function redirectWatch(){setTimeout(()=>{if(document.visibilityState==='visible'&&!$('login').classList.contains('hide')&&/이동해요/.test($('cloudMsg').textContent)){
  try{sessionStorage.removeItem('gw_login_redirect');}catch(_){}
  $('cloudMsg').textContent='⚠ 이 브라우저가 Firebase 로그인 중계 페이지를 막고 있어요. 다른 브라우저(크롬·사파리)로 시도하거나, 닉네임 로그인으로 먼저 플레이해 주세요. (개발자: GOOGLE_CLIENT_ID를 설정하면 해결됩니다)';loginBusy=false;}},10000);}
// ── Google 공식 로그인 버튼 (GOOGLE_CLIENT_ID가 있을 때): 받은 ID 토큰으로 Firebase에 직접 로그인
let gsiReady=false;
function setupGsi(){
  if(!GOOGLE_CLIENT_ID||gsiReady||IN_APP)return;gsiReady=true;
  ldScript('https://accounts.google.com/gsi/client').then(()=>{
    google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,use_fedcm_for_prompt:true,callback:async res=>{
      const m=$('cloudMsg');m.textContent='로그인 중…';
      let step='1단계: Firebase 준비';
      try{await fbInit();step='2단계: Firebase 로그인';const r=await fbA.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.credential));
        step='3단계: 저장 데이터 불러오기';await finishCloudLogin(r.user);}
      catch(e){console.warn('[로그인]',step,e);m.textContent=authMsg(e)+' ['+step+' · '+((e&&e.code)||(e&&e.name)||'오류')+']';}}});
    const box=$('gsiBtn');box.classList.remove('hide');$('lgG').classList.add('hide');
    google.accounts.id.renderButton(box,{theme:'filled_blue',size:'large',text:'signin_with',shape:'pill',locale:'ko',width:260});
  }).catch(e=>{gsiReady=false;console.warn('Google 로그인 버튼을 불러오지 못했어요',e);});
}
let loginBusy=false;
async function cloudLogin(k){const m=$('cloudMsg');
  if(IN_APP){openExternalBrowser();return;}
  if(loginBusy)return;loginBusy=true;
  try{
    if(!fbA){m.textContent='로그인 준비 중…';await fbInit();m.textContent='준비됐어요! 로그인 버튼을 한 번 더 눌러 주세요.';return;} // 준비 후 첫 클릭은 창이 막힐 수 있어 다시 누르게 함
    m.textContent='로그인 창을 여는 중…';
    const p=k==='g'?new firebase.auth.GoogleAuthProvider():new firebase.auth.GithubAuthProvider();
    if(k==='g')p.setCustomParameters({prompt:'select_account'});
    let r;
    try{r=await popupAuth().signInWithPopup(p);}
    catch(e){
      if(e&&e.code==='auth/network-request-failed'){ // 대부분 브라우저·확장 프로그램이 Google 로그인 서버를 막은 경우
        m.textContent='연결 상태를 확인하는 중…';const why=await probeAuthNet();
        if(why){m.textContent=why;return;}
        m.textContent='팝업 방식이 막혀서 로그인 페이지로 이동해요…';try{sessionStorage.setItem('gw_login_redirect',k);}catch(_){}
        redirectWatch();await popupAuth().signInWithRedirect(p);return;}
      if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment')){
        m.textContent='팝업이 막혀서 로그인 페이지로 이동해요…';try{sessionStorage.setItem('gw_login_redirect',k);}catch(_){}
        redirectWatch();await popupAuth().signInWithRedirect(p);return;}
      throw e;}
    await finishCloudLogin(await signInFromPopupResult(r));
  }catch(e){console.warn('[로그인]',e);m.textContent=authMsg(e)+' ['+((e&&e.code)||'오류')+']';}
  finally{loginBusy=false;}
}
function logout(){try{fbA&&fbA.signOut();popA&&popA.signOut();}catch(e){}user=null;UID='guest';try{localStorage.removeItem('gw_session');}catch(e){}loadAll();show('login');}
$('lgG').disabled=$('lgGH').disabled=!FB;
$('cloudMsg').textContent=FB?'':'(클라우드 로그인은 Firebase 설정 후 사용할 수 있어요)';
$('lgG').onclick=()=>cloudLogin('g');setupGsi();$('lgGH').onclick=()=>cloudLogin('gh');
$('lgLocal').onclick=()=>{const n=$('nick').value.trim().slice(0,12);if(!n){toast('닉네임을 입력하세요');return;}enter({id:'n_'+n.toLowerCase(),name:n,type:'local'});};
// ── 로그인 진단: 로그인에 필요한 서버마다 실제 요청을 보내 어디서 막히는지 표시 (아무 계정 정보도 보내지 않음)
async function runLoginDiag(){
  const out=$('diagOut');out.classList.remove('hide');const lines=['기기: '+navigator.userAgent,'온라인: '+navigator.onLine,'쿠키 사용: '+navigator.cookieEnabled,''];
  const show2=()=>{out.textContent=lines.join('\n');};show2();
  const timed=(pr,ms)=>Promise.race([pr,new Promise((_,no)=>setTimeout(()=>no(new Error('시간 초과')),ms))]);
  const check=async(name,fn)=>{lines.push('… '+name);show2();const i=lines.length-1;
    try{const r=await timed(fn(),8000);lines[i]='✅ '+name+(r?' ('+r+')':'');}catch(e){lines[i]='❌ '+name+' — '+(e&&e.message||e);}show2();};
  const K=FB.apiKey,IT='https://identitytoolkit.googleapis.com';
  await check('Firebase 프로그램 받기 (gstatic)',async()=>{await fbInit();return '준비됨';});
  await check('브라우저 저장소 (IndexedDB)',()=>new Promise((ok,no)=>{try{const q=indexedDB.open('gw_diag');q.onsuccess=()=>{q.result.close();ok('열림');};q.onerror=()=>no(new Error(q.error&&q.error.name||'열기 실패'));q.onblocked=()=>no(new Error('막힘'));}catch(e){no(e);}}));
  await check('중계 페이지 창 열기 (iframe '+FB.authDomain+')',()=>new Promise((ok,no)=>{const f=document.createElement('iframe');f.style.display='none';f.src='https://'+FB.authDomain+'/__/auth/iframe?apiKey='+FB.apiKey+'&appName=diag&v=10.12.2';f.onload=()=>{f.remove();ok('불러옴 (참고: 이 줄이 실패해도 Google 버튼 로그인은 이제 영향 없음)');};f.onerror=()=>{f.remove();no(new Error('불러오기 실패'));};document.body.appendChild(f);}));
  await check('Firebase 로그인 초기화 (SDK)',async()=>{const t0=performance.now();await new Promise(res=>{const un=fbA.onAuthStateChanged(()=>{un();res();});});return Math.round(performance.now()-t0)+'ms';});
  await check('SDK 방식 서버 요청 (createAuthUri)',async()=>{try{await fbA.fetchSignInMethodsForEmail('diag-test@example.com');return '정상';}catch(e){if(e&&e.code&&e.code!=='auth/network-request-failed')return '서버 응답: '+e.code;throw new Error(e&&e.code||e);}});
  await check('로그인 서버 설정 읽기 (identitytoolkit GET)',async()=>{const r=await fetch(IT+'/v1/projects?key='+K);const j=await r.json();return 'HTTP '+r.status+(j.authorizedDomains?' · 승인 도메인에 이 사이트 '+(j.authorizedDomains.includes(location.hostname)?'있음':'없음!'):'');});
  await check('로그인 요청 보내기 (identitytoolkit POST)',async()=>{const r=await fetch(IT+'/v1/accounts:signInWithIdp?key='+K,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});return 'HTTP '+r.status+' (400이면 정상: 서버까지 도착)';});
  await check('로그인 유지 서버 (securetoken POST)',async()=>{const r=await fetch('https://securetoken.googleapis.com/v1/token?key='+K,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token=x'});return 'HTTP '+r.status+' (400이면 정상)';});
  await check('저장 서버 (firestore)',async()=>{const r=await fetch('https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/diag/none?key='+K);return 'HTTP '+r.status+' (403/404면 정상: 서버까지 도착)';});
  await check('로그인 중계 페이지 ('+FB.authDomain+')',async()=>{await fetch('https://'+FB.authDomain+'/__/auth/iframe.js',{mode:'no-cors',cache:'no-store'});return '연결됨';});
  await check('Google 계정 서버 (accounts.google.com)',async()=>{await fetch('https://accounts.google.com/gsi/client',{mode:'no-cors',cache:'no-store'});return '연결됨';});
  let st='알 수 없음';try{if(navigator.storage&&navigator.storage.persisted)st=(await navigator.storage.estimate()).quota>0?'사용 가능':'제한됨';}catch(e){st='오류: '+e.message;}
  lines.push('저장소(IndexedDB 등): '+st,'','❌ 표시가 있는 줄을 캡처해서 보내 주세요.');show2();
}
$('lgDiag').onclick=()=>{void runLoginDiag();};
$('lgGuest').onclick=()=>enter({id:'guest',name:'게스트',type:'guest'});
$('lgBack').onclick=()=>show('start');
$('goOut').onclick=logout;
$('goStart').onclick=()=>{if(user){buildWorld();show('world');}else show('login');};
loadAll();
// Firebase 미리 불러오기 + 페이지 이동 방식 로그인에서 돌아온 경우 처리
if(FB)fbInit().then(async()=>{
  let pending=false;try{pending=!!sessionStorage.getItem('gw_login_redirect');sessionStorage.removeItem('gw_login_redirect');}catch(_){}
  if(!pending)return;
  try{const r=await popupAuth().getRedirectResult();const u=await signInFromPopupResult(r);if(u)await finishCloudLogin(u);else{show('login');$('cloudMsg').textContent='⚠ 로그인이 완료되지 않았어요. 다시 시도하거나 크롬·사파리에서 열어 주세요.';}}
  catch(e){show('login');$('cloudMsg').textContent=authMsg(e);}
}).catch(e=>console.warn('Firebase 준비 실패',e));
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
