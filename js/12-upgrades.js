// 건우 대전쟁 · 12-upgrades.js
// ════════ 캐릭터 강화 / 스펙 / 트레이닝 ════════
const rb=()=>{const e=$('upl'),y=e.scrollTop;buildUp();e.scrollTop=y;};
function trainUI(u0){
  const id=u0.id,cfg=u0.trn,cur=tn[id]=Object.assign({hp:0,atk:0,spd:0},tn[id]),names={hp:'체력',atk:'공격력',spd:'이동속도'};
  const used=()=>cur.hp+cur.atk+cur.spd;
  const box=document.createElement('div');box.style.cssText='margin-top:8px;padding:6px;border:2px dashed var(--line);border-radius:6px';
  const head=document.createElement('div');head.innerHTML='<b>트레이닝</b> <small>('+used()+' / '+cfg.pool+' 포인트 사용, 1포인트 = +5%)</small>';box.appendChild(head);
  ['hp','atk','spd'].forEach(k=>{const r=document.createElement('div');r.style.cssText='display:flex;align-items:center;gap:6px;margin-top:4px';
    const mi=document.createElement('button'),pl2=document.createElement('button'),lab=document.createElement('span');
    mi.style.padding=pl2.style.padding='2px 12px';mi.textContent='−';pl2.textContent='＋';
    lab.style.flex='1';lab.innerHTML=names[k]+' <b>'+cur[k]+'</b> / '+cfg.max[k]+' <small>(+'+cur[k]*5+'%)</small>';
    mi.disabled=cur[k]<=0;pl2.disabled=cur[k]>=cfg.max[k]||used()>=cfg.pool;
    mi.onclick=()=>{cur[k]--;save();rb();};pl2.onclick=()=>{cur[k]++;save();rb();};
    r.append(mi,lab,pl2);box.appendChild(r);});
  const rs=document.createElement('button');rs.textContent='초기화';rs.style.cssText='margin-top:6px;padding:4px 10px';rs.onclick=()=>{cur.hp=cur.atk=cur.spd=0;save();rb();};box.appendChild(rs);
  return box;}
function buildUp(){
  $('xpv').textContent='XP '+xp.toLocaleString();const box=$('upl');box.innerHTML='';
  const tabs=document.createElement('div');tabs.className='chtab';[['N','기본'],['EX','EX'],['R','레어'],['SR','슈퍼 레어'],['UR','울트라 슈퍼 레어']].forEach(([key,name])=>{const b=document.createElement('button');b.textContent=name;b.className=upCategory===key?'on':'';b.onclick=()=>{upCategory=key;buildUp();};tabs.appendChild(b);});box.appendChild(tabs);
  if(upCategory==='N')buildBasicUp(box);
  MY.filter(u=>u.t===upCategory).forEach(u0=>{
    const u=fm(u0),L=lv[u.id]||1,bonus=plusLv[u.id]||0,total=L+bonus,m=lm(u.id),cost=lvCost(u0,L),d=document.createElement('div');d.className='tr up';
    const cv=document.createElement('canvas');cv.className='ic';cv.width=Math.max(...u.grid.map(r=>r.length))*u.s;cv.height=u.grid.length*u.s;
    spr(u.grid,0,0,u.s,false,pl(u),cv.getContext('2d'));
    const info=document.createElement('div'),at=u.ty[0],id=u.id;
    const wk=TRAITS.filter(a=>tmul(a,u.ty)>1),rs=TRAITS.filter(a=>tmul(a,u.ty)<1);
    info.innerHTML='<b>'+u.name+(u.f?' ★':'')+' Lv'+L+(bonus?'<span class="unit-plus"> +'+bonus+'</span>':'')+'</b> '+tier(u0)+tbadge(u.ty)+' <small>['+(u.area?'범위':'단일')+' 공격]</small>'
      +'<br><small>'+u0.desc+'</small>'
      +'<br><small>체력 '+Math.round(u.hp*m*tnm(id,'hp'))+' · 공격력 '+(u.atk*m*tnm(id,'atk')).toFixed(1)+' · DPS '+(u.atk*m*tnm(id,'atk')/u.cd).toFixed(1)+' · 사거리 '+u.range+(u.minR?'(최소 '+u.minR+')':'')+' · 이동속도 '+Math.round(u.speed*tnm(id,'spd'))
      +'<br>생산 비용 (세계편 2장 기준) '+Math.round(u.cost*CHC[1]).toLocaleString()+'원 · 쿨타임 '+unitCooldown(u).toFixed(1)+'초 · 히트백 '+u.kb+'회</small>'
      +'<br><small>굉장함(×2) → '+(STR[at].join('·')||'없음')+' 속성의 적 · 받는 피해 반감(×0.5) → '+RES[u.ty[0]].join('·')+' 속성의 공격'
      +'<br>이 캐릭터에게 굉장함인 적 속성: '+(wk.join('·')||'없음')+'</small>';
    if(u0.f2){
      const stages=['1형 '+u0.name,'2형 '+u0.f2.name];
      if(u0.f3)stages.push('3형 '+u0.f3.name);
      info.innerHTML+='<br><small>진화: 총합 Lv10에 2형'+(u0.f3?(u0.t==='EX'?' · 미래편 해당 장 + XP Lv20에 3형':' · 총합 Lv30에 3형'):'')+' (XP 레벨 + 뽑기 +레벨 = '+total+')<br>'+stages.join(' / ')+' · 현재 '+evolutionStage(u0)+'형</small>';
    }
    if(!avail(u0))info.innerHTML+='<br>🔒 '+lockTxt(u0);
    else{const cap=u0.t==='N'?Math.min(20,lvCap()):lvCap(),row=document.createElement('div');row.style.cssText='margin-top:6px;display:flex;gap:6px;flex-wrap:wrap';
      const b=document.createElement('button');b.textContent=L>=cap?'Lv'+cap+' MAX':'강화 ('+cost.toLocaleString()+' XP)';b.disabled=L>=cap||xp<cost;
      b.onclick=()=>{xp-=cost;lv[id]=L+1;save();rb();};row.appendChild(b);
      if(u0.f2&&total>=10){
        const stage=evolutionStage(u0),choices=[{num:1,name:u0.name,value:1},{num:2,name:u0.f2.name,value:u0.f3&&total>=30?22:2}];
        if(u0.f3&&(u0.t==='N'?total>=30:(u0.t==='EX'&&(lv[u0.id]||1)>=20&&cleared[({'fist':347,'cornbar':447,'healthytooth':547}[u0.id]||9999)])))choices.push({num:3,name:u0.f3.name,value:3});
        for(const choice of choices){const fb=document.createElement('button');fb.textContent=choice.num+'형 '+choice.name+(stage===choice.num?' ✓':'');fb.disabled=stage===choice.num;
          fb.onclick=()=>{fsel[id]=choice.value;save();rb();};row.appendChild(fb);}
      }
      info.appendChild(row);info.appendChild(trainUI(u0));}
    d.appendChild(cv);d.appendChild(info);box.appendChild(d);});
  const cap=lvCap();
  box.insertAdjacentHTML('beforeend','<p><small>기본 캐릭터 XP 레벨 상한: 세계편 2장 클리어 전 Lv10, 이후 Lv20 (최대). 그 외 캐릭터 XP 레벨 상한: '+cap+'. 중복 뽑기 +레벨은 별도로 무제한 누적됩니다. 기본 캐릭터는 XP Lv + 중복 +레벨 합계가 10이면 2형, 30이면 3형으로 진화합니다.</small></p>');
}

// 기본 능력: 세계편 2장 클리어 시 레벨 상한 20. 연구력은 생산 대기시간을 단축합니다.
const BASIC_UPGRADES=[['wallet','건우 지갑','초기 지갑 최대 금액'],['worker','일꾼 건우','돈 생산 속도'],['research','연구력','캐릭터 생산 쿨타임'],['accounting','회계력','전투 중 일꾼 강화 비용 감소 · 적 처치 보상 증가'],['baseHp','건우성 체력','아군 성 체력'],['cannon','쓰레기포','쓰레기포 위력']];
function buildBasicUp(box){
  const cap=cleared[147]?20:10;
  const note=document.createElement('div');note.className='tr';note.innerHTML='<b>기본 능력 강화</b><br><small>세계편 2장 달성 후 Lv20 해금. 지갑·일꾼은 3개 장의 보물 12개씩과 강화 Lv20을 모두 달성하면 최종 효과에 도달합니다.</small>';box.appendChild(note);
  BASIC_UPGRADES.forEach(([key,name,desc])=>{const level=basicLv[key]||1,cost=100*level*level,card=document.createElement('div');card.className='tr up';const info=document.createElement('div');info.innerHTML='<b>'+name+' Lv'+level+'/'+cap+'</b><br><small>'+desc+'</small>';const b=document.createElement('button');b.textContent=level>=cap?'MAX':cost.toLocaleString()+' XP';b.disabled=level>=cap||xp<cost;b.onclick=()=>{xp-=cost;basicLv[key]=level+1;save();buildUp();};card.append(info,b);box.appendChild(card);});
  const summary=document.createElement('div');summary.className='tr';summary.innerHTML='<b>현재 적용 수치</b><br><small>기본 지갑 '+walletCapacity().toLocaleString()+'원 / 목표 6,000원 · 돈 생산 배율 ×'+incomeMultiplier().toFixed(2)+' · 생산 쿨타임 ×'+researchMultiplier().toFixed(2)+'</small>';box.appendChild(summary);
}
