// 건우 대전쟁 · 13-battle-controls.js
// ════════ 전투: 도령 / 쓰레기포 / 슬롯 ════════
function applyWk(){S.maxM=Math.round((walletCapacity()+(S.wl-1)*250*(1+economicProgress(0)))/100)*100;S.rate=16*(1+(S.wl-1)*0.32)*incomeMultiplier();}
function wkUp(){if(!S||S.over||S.paused||S.wl>=8)return;const c=Math.round(S.wl*80*(1-0.2*basicProgress('accounting')));if(S.money>=c){S.money-=c;S.wl++;qs.wk=Math.max(qs.wk,S.wl);applyWk();}}
function fireCn(){ // 쓰레기포: 성과 가장 가까운 적에게 범위 타격
  if(!S||S.over||S.paused||S.cn<1)return;
  let tg=null;for(const u of S.units)if(u.team===1&&u.hp>0&&(!tg||u.x>tg.x))tg=u;
  if(!tg)return;
  S.cn=0;S.cnr=Math.max(15,30-15*futureTreasureProgress('f_force'));qs.cn++;S.lid=0.3;S.pj.push({x0:W-75,tx:tg.x,t:0,dur:0.8});
}
$('wk').onpointerdown=e=>{e.preventDefault();wkUp();};$('cn').onpointerdown=e=>{e.preventDefault();fireCn();};
const slotEls=[];
let unitInfoWasPaused=false;
function closeUnitInfo(){
  const lay=$('unitInfoLayer');if(lay.classList.contains('hide'))return;
  lay.classList.add('hide');if(S&&!S.over)S.paused=unitInfoWasPaused;
  last=performance.now();
}
function traitTags(ts){return ts.length?tbadge(ts):'<small>해당 없음</small>';}
function showUnitInfo(k){
  if(!S||S.over||S.paused||!MY[k])return;
  const base=MY[k],u=fm(base),m=lm(base.id),ty=u.ty||[];
  // 아래 정보는 전투 판정 함수 tmul()과 같은 배율로 계산합니다.
  const strong=TRAITS.filter(t=>tmul(ty[0], [t])===2);
  const half=TRAITS.filter(t=>tmul(t,ty)===0.5);
  const weak=TRAITS.filter(t=>tmul(t,ty)===2);
  const atk=u.atk*m*tnm(base.id,'atk');
  const hp=u.hp*m*tnm(base.id,'hp');
  const portrait=$('unitInfoPortrait');portrait.replaceChildren(ico(base));
  $('unitInfoName').innerHTML='<b>'+u.name+'</b><div>Lv'+(lv[base.id]||1)+(plusLv[base.id]?' <span class="unit-plus">+'+plusLv[base.id]+'</span>':'')+' '+tier(base)+' '+traitTags(ty)+'</div>';
  const special=[];
  special.push(u.area?'범위 공격: 사거리 안의 여러 적 공격':'단일 공격: 한 번에 적 하나 공격');
  if(u.leap)special.push('원거리 도약 공격: 가까운 적은 공격하지 못함 (최소 사거리 '+u.minR+')');
  if(u.slowS)special.push('느리게: 강한 속성의 적에게 공격이 적중하면 3초 동안 이동·공격 속도 크게 감소');if(u.freezeStrong)special.push('정지: 강한 속성의 적에게 '+Math.round(u.freezeStrong*100)+'% 확률로 '+u.freezeTime+'초 정지');if(u.freezeNeutral)special.push('정지: 무속성 적에게만 '+Math.round(u.freezeNeutral*100)+'% 확률로 '+u.freezeTime+'초 정지');
  if(u.alienMult)special.push('에일리언 특효: 에일리언 적에게 '+u.alienMult+'배 데미지');
  if(u.kb>=5)special.push('히트백 '+u.kb+'회: 체력이 '+u.kb+'번 깎일 때마다 한 번씩만 밀려남');
  if(u.dodge)special.push('공격 무효: 모든 적의 공격을 '+Math.round(u.dodge*100)+'% 확률로 무효화');
  if(u.hitDelay)special.push('돌진 공격: 증기를 모은 뒤 들이받는 순간 피해 (도중에 밀려나면 공격 취소)');
  if(u.float)special.push('부유하는 외형 (추가 전투 보너스 없음)');
  const desc=(base.desc||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const body=$('unitInfoBody');
  body.innerHTML='<section><b>공격에 강한 상대 (주는 피해 ×2)</b>'+traitTags(strong)+'</section>'+
    '<section><b>방어에 강한 상대 (받는 피해 ×0.5)</b>'+traitTags(half)+'</section>'+
    '<section><b>주의할 상대 (받는 피해 ×2)</b>'+traitTags(weak)+'</section>'+
    '<section><b>특수능력</b>'+special.map(x=>'<div>• '+x+'</div>').join('')+'</section>'+
    '<section class="wide"><b>전투 능력 · 현재 강화 적용</b>체력 '+Math.round(hp).toLocaleString()+' · 공격력 '+Math.round(atk).toLocaleString()+' · 사거리 '+u.range+(u.minR?' (최소 '+u.minR+')':'')+' · 이동속도 '+Math.round(u.speed*tnm(base.id,'spd'))+' · 공격 간격 '+u.cd+'초 · 생산 비용 '+Math.round(u.cost*S.cm).toLocaleString()+'원 · 생산 쿨타임 '+unitCooldown(base).toFixed(1)+'초</section>'+
    '<section class="wide"><b>캐릭터 설명</b>'+desc+'</section>';
  unitInfoWasPaused=!!S.paused;S.paused=true;
  $('unitInfoLayer').classList.remove('hide');
}
$('unitInfoClose').onclick=closeUnitInfo;
$('unitInfoLayer').addEventListener('pointerdown',e=>{if(e.target===$('unitInfoLayer'))closeUnitInfo();});
function buildSlots(cm){ cm=cm==null?CHC[CH]:cm; // 짧게 누름 = 생산, 0.5초 길게 누름 = 캐릭터 정보
  const sl=$('slots');sl.innerHTML='';slotEls.length=0;
  SL=fl().map(id=>MY.findIndex(x=>x.id===id));
  for(let i=0;i<10;i++){const b=document.createElement('button');const u=MY[SL[i]];
    if(u){b.appendChild(ico(u));const pr=document.createElement('span');pr.className='pr';pr.textContent=Math.round(fm(u).cost*cm)+'원';const cd=document.createElement('i');cd.className='cdv';b.append(pr,cd);b._pr=pr;b._cd=cd;}
    else b.disabled=true;
    let holdTimer=null,held=false,down=false,origin=null;
    function cancelHold(){clearTimeout(holdTimer);holdTimer=null;}
    b.addEventListener('pointerdown',e=>{
      if(e.button!==0&&e.pointerType==='mouse')return;
      e.preventDefault();if(!S||S.over||S.paused||!u)return;
      down=true;held=false;origin={x:e.clientX,y:e.clientY};
      try{b.setPointerCapture(e.pointerId);}catch(err){}
      cancelHold();holdTimer=setTimeout(()=>{if(down){held=true;showUnitInfo(SL[i]);}},500);
    });
    b.addEventListener('pointermove',e=>{
      if(down&&origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>16){down=false;cancelHold();}
    });
    b.addEventListener('pointerup',e=>{
      if(!down)return;
      e.preventDefault();down=false;cancelHold();
      if(!held&&!$('unitInfoLayer').classList.contains('hide'))return;
      if(!held)deploy(SL[i]);
    });
    b.addEventListener('pointercancel',()=>{down=false;cancelHold();});
    b.addEventListener('lostpointercapture',()=>{down=false;cancelHold();});
    b.addEventListener('contextmenu',e=>e.preventDefault());
    sl.appendChild(b);slotEls.push(b);
  }
}
let S=null,stageIdx=0,raf=0,last=0;
let speedUp=false;
function renderSpeedToggle(){
  const btn=$('speedToggle');btn.classList.toggle('on',speedUp);
  btn.textContent=speedUp?'스피드업 ON · 2배속':'스피드업 OFF · 1배속';
  btn.setAttribute('aria-pressed',String(speedUp));
}
$('speedToggle').onclick=()=>{speedUp=!speedUp;renderSpeedToggle();};
function startStage(i){
  if(i>0&&!cleared[ck(i-1)]){toast('아직 열리지 않은 스테이지예요.');return;}
  if(CH>=3){if(currentEnergy()<1){toast('기력이 부족해요. 타임머신 보물을 모으면 회복이 빨라져요.');return;}energy.value--;save();}
  stageIdx=i;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();const d=STS[CH][i];buildSlots();
  const eh=Math.round((300+d[1]*0.1)*CHM[CH]);
  const tsd={};TSETS.forEach(set=>{if(set.trait)tsd[set.trait]=traitTreasureProgress(set.trait);});
  S={t:0,money:Math.min(100,walletCapacity()),units:[],cool:MY.map(()=>0),over:null,boss:false,drop:'',drop2:'',fx:[],pop:[],cn:0,cnr:60,lid:0,pj:[],bm:[],dust:[],spk:[],ring:[],shake:0,bw:0,
     walM:1,rateM:incomeMultiplier(),tsd,cm:CHC[CH],future:CH>=3,maxM:1000,rate:14,
     my:{hp:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base')),max:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base'))},en:{hp:eh,max:eh},eSpawn:2,spawnN:0,mult:CHM[CH],wl:1,rng:stageRng(CH*100+i)};applyWk();
  $('stageTitle').textContent=(CH>=3?'미래편 ':'세계편 ')+(CH%3+1)+'장 STAGE '+(i+1)+'  '+d[0]+(CH>=3&&d[4]?'  ['+FUTURE_PATTERN_NAMES[d[4]]+']':'');
  show('battle');$('pmenu').classList.add('hide');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function setPause(p){if(!S||S.over)return;S.paused=p;$('pmenu').classList.toggle('hide',!p);if(!p)last=performance.now();}
$('pause').onclick=()=>setPause(true);
$('resume').onclick=()=>setPause(false);
$('exit').onclick=()=>{const wasVTS=!!(S&&S.vtsMode);closeUnitInfo();cancelAnimationFrame(raf);S=null;$('pmenu').classList.add('hide');if(wasVTS){buildVTSStages();show('vtsSelect');}else{buildGrid();show('select');}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)setPause(true);});
function spawnMy(k){const T=fm(MY[k]),m=lm(T.id),h=T.hp*m*tnm(T.id,'hp');
  S.units.push({team:0,T:Object.assign({},T,{atk:T.atk*m*tnm(T.id,'atk'),speed:T.speed*tnm(T.id,'spd')}),x:W-80,hp:h,max:h,kbn:T.kb,nk:h-h/T.kb,t:0,kt:0,at:0,ph:Math.random()*3});}
// 스타에일리언(STAR_ALIENS에 등록한 적)은 우주편(S.space)에서만 출현합니다. 현재 미래편 적은 모두 일반 에일리언이에요.
const STAR_ALIENS={};
// 같은 스테이지는 항상 같은 순서·타이밍·종류로 적이 나오도록 스테이지 번호로 고정된 난수를 씁니다.
function stageRng(key){return seededRand(1000003+key*7919);}
function spawnEn(code,boss){if(STAR_ALIENS[code]&&!S.space)return;if(code==='O'&&!(CH===1&&stageIdx===47&&boss))return;if(!seenEnemies[code]){seenEnemies[code]=1;save();}const e=EN[code],area=ENAR.includes(code),scale=CH>=3?(ENTY[code].includes('에일리언')?futureAlienMult()*(CH===3?1:CH===4?1.25:1.55):1.15):WORLD_ENEMY_SCALE,h=e[1]*S.mult*ENM*scale*ENEMY_HP_NERF*(boss?2*BOSS_HP_FACTOR:1),kb=boss?2:3;
  S.units.push({team:1,boss,code,T:{name:e[0],grid:enemyGrid(code),float:!!ENEMY_FLOAT[code],hp:h,atk:e[2]*(0.8+S.mult*0.2)*ENM*scale*ENEMY_ATK_NERF*(boss?1.5*BOSS_ATK_FACTOR:1),speed:e[3],range:Math.round(e[4]*(area?1.3:1)),cd:code==='C'&&boss?0.7:code==='O'&&boss?4:boss?1.3:1,s:enemyScale(code,e[6]),col:e[5],tpl:e[7],acc:e[8],ty:ENTY[code],rw:ENR[code],an:ENAN[code],slowOnHit:code==='O'?2:0,area},x:80,hp:h,max:h,kbn:kb,nk:h-h/kb,t:0,kt:0,at:0,ph:Math.random()*3});
  if(boss){sfx('boss');S.shake=0.7;S.bw=1.4;S.ring.push({x:80,t:0});for(const o of S.units)if(o.team===0){o.kt=0.5;o.kv=420;o.t=Math.max(o.t,1);}} // 보스 등장: 아군 전체가 와르르 밀려나요
}
function deploy(k){
  if(!S||S.over||S.paused||!MY[k]||!avail(MY[k]))return;const T=MY[k],c=Math.round(fm(T).cost*S.cm);
  if(S.money>=c&&S.cool[k]<=0){S.money-=c;S.cool[k]=unitCooldown(T);spawnMy(k);if(T.t==='UR'){S.ring.push({x:W-80,t:0,ally:true});S.shake=Math.max(S.shake,.12);for(let q=0;q<16;q++)S.spk.push({x:W-80+(Math.random()-.5)*75,y:GY-30-Math.random()*100,t:0,col:['#fbec9a','#e989ff','#93ebff'][q%3]});}sfx('dep');}
}
addEventListener('keydown',e=>{if($('battle').classList.contains('hide'))return;
  if(e.code==='Escape')setPause(!(S&&S.paused));
  else if(e.code==='Space'){e.preventDefault();deploy(SL[0]);}
  else if(e.code==='KeyW')wkUp();
  else if(e.code==='KeyE')fireCn();
  else if(/^Digit[0-9]$/.test(e.code)){deploy(SL[e.code==='Digit0'?9:+e.code[5]-1]);}});

