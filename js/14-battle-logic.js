// 건우 대전쟁 · 14-battle-logic.js
const AD={tent:.5,beam:.35,fire:.4,burst:.45,smash:.6,claw:.3,slash:.35};
const CHXP=[1,1.5,2.5,2.2,3.3,4.5];
function update(dt){
  if(S.over)return;
  const d=S.vtsMode?['VTS 전투',0,null,[]]:STS[CH][stageIdx];
  S.t+=dt;S.money=Math.min(S.maxM,S.money+dt*S.rate);S.cn=Math.min(1,S.cn+dt/S.cnr);S.lid=Math.max(0,S.lid-dt);S.cool=S.cool.map(c=>Math.max(0,c-dt));
  S.shake=Math.max(0,S.shake-dt);S.bw=Math.max(0,S.bw-dt);
  if(!S.vtsMode&&!S.boss&&d[2]&&S.en.hp<S.en.max){S.boss=true;spawnEn(d[2],true);}
  S.eSpawn-=dt;
  if(S.vtsMode&&S.eSpawn<=0&&S.units.filter(u=>u.team===1).length<9){
    const boss=VTS_BOSSES[S.vtsStage],pool=boss.support;
    spawnEn(pool[S.spawnN%pool.length],false);S.spawnN++;
    S.eSpawn=boss.interval;
  }
  if(!S.vtsMode&&S.eSpawn<=0&&S.units.filter(u=>u.team===1).length<12){
    const list=d[3];const code=CH>=3?list[Math.min(list.length-1,Math.floor(S.spawnN/2))]:list[Math.floor(Math.random()*list.length)];spawnEn(code,false);S.spawnN++;
    S.eSpawn=CH>=3?(3.0+Math.random()*1.4):(4.8+Math.random()*1.7);
  }
  for(const p of S.pj)p.t+=dt;
  for(const p of S.pj)if(p.t>=p.dur){p.done=1;const dm=150*S.mult*(1+basicProgress('cannon'))*(1+0.4*futureTreasureProgress('f_cannon'));
    for(const o of S.units)if(o.team===1&&o.hp>0&&Math.abs(o.x-p.tx)<=70){hit(o,dm*treasureOutgoingMult(o.T.ty,S.tsd));if(o.hp>0&&o.kt<=0){o.kt=0.35;o.t=Math.max(o.t,0.6);}}
    S.bm.push({x:p.tx,t:0});}
  S.pj=S.pj.filter(p=>!p.done);S.bm.forEach(b=>b.t+=dt);S.bm=S.bm.filter(b=>b.t<0.5);
  for(const u of S.units){
    const dir=u.team===0?-1:1,sf=u.sl>0?0.22:1;if(u.sl>0)u.sl=Math.max(0,u.sl-dt);if(u.fr>0){u.fr=Math.max(0,u.fr-dt);u.at=0;u.mv=0;continue;}u.t-=dt*sf;u.at=Math.max(0,u.at-dt);u.mv=0;if(u.hp<=0)continue;
    if(u.pend!=null){u.pend-=dt;if(u.pend<=0){u.pend=null;for(const o of S.units)if(o.team!==u.team&&o.hp>0&&Math.abs(o.x-u.tx)<=55){hitT(u,o,u.T.atk);if(o.hp>0&&o.kt<=0){o.kt=0.35;o.t=Math.max(o.t,0.6);}}if(u.bt){(u.team===0?S.en:S.my).hp-=u.T.atk*(u.team===1?treasureIncomingMult(u.T.ty,S.tsd):1);u.bt=0;}}}
    if(u.kt>0){u.kt-=dt;u.x=Math.max(60,Math.min(W-60,u.x-dir*(u.kv||160)*dt));if(u.kt<=0)u.kv=0;continue;}
    let target=null,best=1e9;
    for(const o of S.units){if(o.team===u.team||o.hp<=0)continue;const dd=(o.x-u.x)*dir;if(dd>-10&&dd<best){best=dd;target=o;}}
    const baseX=u.team===0?75:W-75,bd=(baseX-u.x)*dir,bs=u.team===0?S.en:S.my,R=u.T.range;
    let vt=null,b2=1e9;if(u.T.leap){for(const o of S.units){if(o.team===u.team||o.hp<=0)continue;const dd=(o.x-u.x)*dir;if(dd>=u.T.minR&&dd<=R&&dd<b2){b2=dd;vt=o;}}}
    if((target&&best<=R)||bd<=R){
      if(u.T.leap){if(u.t<=0&&(vt||(bd>=u.T.minR&&bd<=R))){u.t=u.T.cd;u.ad=1;u.at=1;u.pend=0.4;if(vt){u.tx=vt.x;u.bt=0;}else{u.tx=baseX;u.bt=1;}}}
      else if(u.t<=0){u.t=u.T.cd;u.ad=Math.min(AD[u.T.an]||0.35,u.T.cd*0.8);u.at=u.ad;
        if(u.T.area){for(const o of S.units){if(o.team!==u.team&&o.hp>0){const dd=(o.x-u.x)*dir;if(dd>-10&&dd<=R)hitT(u,o,u.T.atk);}}if(bd<=R)bs.hp-=u.T.atk*(u.team===1?treasureIncomingMult(u.T.ty,S.tsd):1);}
        else if(target&&best<=R)hitT(u,target,u.T.atk);else bs.hp-=u.T.atk*(u.team===1?treasureIncomingMult(u.T.ty,S.tsd):1);}
    }else{ // 이동: 걷기 모션 + 먼지
      u.mv=1;u.x+=dir*u.T.speed*sf*dt;
    }
  }
  for(const u of S.units)if(u.hp<=0){S.fx.push({u,t:0});if(u.team===1){qs.kills++;const rw=Math.round(u.T.rw*(1+0.5*basicProgress('accounting')));S.money=Math.min(S.maxM,S.money+rw);S.pop.push({x:u.x,t:0,s:'+'+rw+'원',c:'#7be07b'});}}
  S.units=S.units.filter(u=>u.hp>0);
  S.fx.forEach(f=>f.t+=dt);S.fx=S.fx.filter(f=>f.t<0.6);S.pop.forEach(p=>p.t+=dt);S.pop=S.pop.filter(p=>p.t<0.7);
  S.dust.forEach(p=>p.t+=dt);S.dust=S.dust.filter(p=>p.t<0.4);S.spk.forEach(p=>p.t+=dt);S.spk=S.spk.filter(p=>p.t<0.25);S.ring.forEach(r=>r.t+=dt);S.ring=S.ring.filter(r=>r.t<0.8);
  S.my.hp=Math.max(0,S.my.hp);S.en.hp=Math.max(0,S.en.hp);
  if(S.en.hp<=0){S.over='win';sfx('win');if(S.vtsMode){
    const boss=VTS_BOSSES[S.vtsStage],first=!vtsCleared[boss.id],gx=first?9000:1800;
    xp+=gx;qs.wins++;S.xpg=gx;vtsCleared[boss.id]=1;
    if(!own[boss.reward]){own[boss.reward]=1;S.drop2='캐릭터 획득: '+boss.name+'!';}
    S.drop=first?'VTS 최초 클리어!':'VTS 재도전 클리어!';save();
  }else{const first=!cleared[ck(stageIdx)];
    const gx=Math.round((300+stageIdx*60+stageIdx*stageIdx*3)*CHXP[CH]*(first?1:0.2));xp+=gx;qs.wins++;S.xpg=gx;
    const left=stageTreasure(CH,stageIdx).filter(t=>!hasTreasure(CH,t));
    if(!left.length){S.drop='이 스테이지의 보물은 이미 획득했어요!';}
    else if(Math.random()<0.5){ // 매번 승리할 때 독립적으로 50% 확률
      const t=left[Math.floor(Math.random()*left.length)];trc[treasureKey(CH,t)]=1;
      const st=(CH>=3?F_TSETS:TSETS).find(s=>s.items.includes(t));
      S.drop='보물 획득: '+t+(setDone(CH,st)?' — '+st.name+' 완성!':'');
    }else S.drop='이번엔 보물이 나오지 않았어요 (획득 확률 50%)';
    if(first){cleared[ck(stageIdx)]=1;
      if(CH===0){if(stageIdx===2)S.drop2='새 캐릭터: 건우통!';if(stageIdx===7)S.drop2='새 캐릭터: 한치!';if(stageIdx===13)S.drop2='새 캐릭터: 도라지과자맨!';if(stageIdx===17)S.drop2='새 캐릭터: 에너지원!';
        if(stageIdx===6){rt++;S.drop2='🌟 레어 티켓 +1!';}
        if(stageIdx===47&&!own.fist){own.fist=1;S.drop2='EX 캐릭터 획득: 격투가 강철!';}}
      if(CH===1&&stageIdx===47&&!own.cornbar){own.cornbar=1;S.drop2='EX 캐릭터 획득: 옥수수익어가는바!';}
      if(CH===2&&stageIdx===47&&!own.healthytooth){own.healthytooth=1;S.drop2='EX 캐릭터 획득: 건치!';}
       if(CH>=3&&stageIdx===47){S.drop2=['격투가 강철','옥수수익어가는바','건치'][CH-3]+' EX 3형 해금! (해당 유닛 XP Lv20 필요)';}
      if(stageIdx===47)S.drop2=(S.drop2?S.drop2+' / ':'')+(CH===0?'세계편 2장 · 미래편 해금!':CH===1?'세계편 3장 · Lv20 해금!':CH===2?'Lv30 해금!':CH===3?'미래편 2장 해금!':CH===4?'미래편 3장 해금!':'미래편 완주!');}
    grantClearedRewards();save();}}
  else if(S.my.hp<=0){S.over='lose';sfx('lose');}
}

function hit(o,d){sfxHit();o.hp-=d;if(S.spk.length<70)for(let j=0;j<4;j++)S.spk.push({x:o.x+(Math.random()-.5)*18,y:GY-8-Math.random()*46,t:0,seed:Math.random(),col:j%2?'#81e6ff':'#ffe376'});
  if(o.hp>0&&o.hp<=o.nk){while(o.hp<=o.nk)o.nk-=o.max/o.kbn;o.kt=0.35;o.t=Math.max(o.t,0.6);}} // 히트백
function hitT(a,o,d){
  const affinity=tmul(a.T.ty[0],o.T.ty);
  // 적 속성이 보물의 대상. 기존 속성 상성(×2/×0.5)과 별도로 모든 공격에 적용.
  const treasureMult=a.team===0
    ?treasureOutgoingMult(o.T.ty,S.tsd)
    :treasureIncomingMult(a.T.ty,S.tsd);
  // 미래편의 속성 열매는 해당 속성에 강한 능력이 실제로 발동했을 때만 보강합니다.
  const fruit= a.team===0?futureFruitProgress(o.T.ty):0;
  const fruitEffect=affinity>1?1+0.2*fruit:affinity<1?1-0.2*fruit:1;
  hit(o,d*affinity*treasureMult*fruitEffect);
  if(affinity!==1&&!S.pop.some(p=>p.t<0.3&&Math.abs(p.x-o.x)<30))
    S.pop.push({x:o.x,t:0,s:affinity>1?'효과 굉장!':'효과 별로…',c:affinity>1?'#ffe27a':'#9fb3c8'});
  if(affinity>1&&a.T.slowS)o.sl=3*(1+0.4*(a.team===0?futureFruitProgress(o.T.ty):0)); // 황소개구리: 강한 속성의 적은 3초 슬로우
  if(a.T.slowOnHit)o.sl=Math.max(o.sl||0,a.T.slowOnHit); // 2장 보스: 맞은 아군은 누구든 느려짐
  if(((affinity>1&&a.T.freezeStrong&&Math.random()<a.T.freezeStrong)||(a.T.freezeNeutral&&o.T.ty.includes('무속성')&&Math.random()<a.T.freezeNeutral))){o.fr=Math.max(o.fr||0,(a.T.freezeTime||2)*(1+0.4*(a.team===0?futureFruitProgress(o.T.ty):0)));if(!S.pop.some(p=>p.s==='정지!'&&p.t<0.2))S.pop.push({x:o.x,t:0,s:'정지!',c:'#9bdfff'});}
}
