// 레전드 스토리: VTS 시리즈(매일 다섯 스테이지 전부 도전 가능) + 경험치 스테이지.
// 세계편이 아닌 모든 스테이지는 세계편 2장 가격(×1.5) 기준입니다.
const LEGEND_CM=1.5;
// hp/atk는 실제 전투 수치. VTS 보스는 모두 무속성이라 무속성 대항 보물이 적용됩니다
// (올보물 완성 시 주는 피해 +50% → 실질 체력 hp/1.5, 받는 피해 −50% → 실질 공격력 atk×0.5).
// VTS 준치는 "무속성 대항 올보물 기준 체력 25만 · 공격력 9000"이 되도록 hp 375000 / atk 18000으로 설정했습니다.
// multi: 보스가 여러 마리 출현 (count=시작 마리 수, respawn=추가 출현 간격(초), maxAlive=동시 최대, wave=한 번에 나오는 수)
const VTS_BOSSES=[
 {id:'VJ',name:'VTS 준치',reward:'vts_junchi',grid:FISH,sprite:'assets/vts-junchi.png',spriteW:30,spriteH:16,spriteFlip:true,size:5,hp:375000,atk:18000,basis:{hp:250000,atk:9000},range:145,speed:27,cd:2.0,area:true,an:'slash',support:'DST',interval:6.5,castle:60000},
 {id:'VG',name:'VTS 건우통',reward:'vts_gtong',grid:CAN,sprite:'assets/vts-geonwootong.png',spriteW:20,spriteH:17,size:7,hp:400000,atk:15000,range:200,speed:11,cd:3.1,area:true,an:'smash',support:'DSH',interval:7.0,castle:64000},
 {id:'VH',name:'VTS 한치',reward:'vts_hanchi',grid:SQUID,sprite:'assets/vts-hanchi.png',spriteW:20,spriteH:19,size:6,hp:16000,atk:1600,range:165,speed:21,cd:2.7,area:true,an:'tent',support:'DSTJ',interval:6.7,castle:50000,
  kb:3,multi:{count:3,respawn:6,wave:2,maxAlive:8},note:'한치가 여러 마리 계속 몰려와요'},
 {id:'VD',name:'VTS 도라지과자맨',reward:'vts_dorag',grid:DORA,sprite:'assets/vts-doraji.png',spriteW:22,spriteH:27,size:5,hp:300000,atk:20000,range:95,speed:28,cd:2.2,area:true,an:'fire',support:'DSTP',interval:6.8,castle:48000,
  freezeAll:true,freezeTime:3,note:'공격에 맞은 아군은 100% 확률로 3초 정지'},
 // 광란의 황소 스테이지 스타일: 빠르고 공격이 잦은 돌격형 보스가 무리 지어 계속 돌진
 {id:'VE',name:'VTS 에너지원',reward:'vts_energy',grid:ORB,sprite:'assets/vts-energy.png',spriteW:20,spriteH:20,size:6,hp:48000,atk:1200,range:120,speed:72,cd:0.7,area:false,an:'beam',support:'DS',interval:9.0,castle:50000,
  kb:3,multi:{count:3,respawn:12,wave:3,maxAlive:7,firstDelay:1.2,stagger:0.9},note:'광란의 황소처럼 빠른 에너지원이 무리 지어 계속 돌진'}
];
function vtsFmt(n){return n>=10000&&n%10000===0?(n/10000)+'만':n.toLocaleString();}
// 경험치 스테이지: 몇 번이든 도전 가능. 승리하면 XP를 받아요.
const XP_STAGES=[
 {id:'X1',name:'경험치 스테이지 · 초급',xp:8000,castle:6000,pool:'DSTP',interval:2.6,mult:1.5,money:1.6},
 {id:'X2',name:'경험치 스테이지 · 중급',xp:22000,castle:18000,pool:'HGBJRZ',interval:2.4,mult:3,money:1.6},
 {id:'X3',name:'경험치 스테이지 · 상급',xp:55000,castle:42000,pool:'LKQNXMU',interval:2.2,mult:5.5,money:1.6}
];
function legendRow(box,iconEl,title,lines,onclick){
 const row=document.createElement('button');row.className='tr vts-stage-entry';
 const text=document.createElement('span');const name=document.createElement('b');name.textContent=title;text.appendChild(name);
 for(const l of lines){text.appendChild(document.createElement('br'));const sm=document.createElement('small');sm.textContent=l;text.appendChild(sm);}
 row.append(iconEl,text);row.onclick=onclick;box.appendChild(row);
}
function buildVTSStages(){
 const box=$('vtsStages');box.innerHTML='<h2>📜 레전드 스토리</h2><p>모든 스테이지 캐릭터 가격은 <b>세계편 2장 기준(×1.5)</b>이에요.</p><h3>👑 VTS 시리즈 · 초고난도</h3><p>월요일부터 일요일까지 <b>5개 스테이지 모두 상시 개방</b>. 최초 승리 시 VTS 캐릭터를 획득합니다. VTS 보스는 모두 <b>무속성</b>이고, 적 성을 때리면 증원군이 나와요.</p>';
 VTS_BOSSES.forEach((boss,i)=>{
   const img=document.createElement('img');img.src=boss.sprite;img.alt=boss.name;img.width=boss.spriteW*3;img.height=boss.spriteH*3;img.className='vts-stage-icon';
   const detail=boss.basis
     ?'무속성 대항 올보물 기준 체력 '+vtsFmt(boss.basis.hp)+' · 공격력 '+boss.basis.atk.toLocaleString()+' (보물 없이 '+vtsFmt(boss.hp)+' / '+boss.atk.toLocaleString()+') · 사거리 '+boss.range
     :'체력 '+vtsFmt(boss.hp)+(boss.multi?' (여러 마리)':'')+' · 공격력 '+boss.atk.toLocaleString()+' · 사거리 '+boss.range+(boss.area?' · 범위 공격':' · 단일 공격');
   legendRow(box,img,boss.name+' · 초고난도'+(vtsCleared[boss.id]?' ✓ 클리어':''),[detail,(boss.note?boss.note+' · ':'')+(own[boss.reward]?'획득 완료: '+boss.name:'최초 클리어 보상: '+boss.name+' 캐릭터')],()=>startVTSStage(i));
 });
 const h=document.createElement('h3');h.textContent='⭐ 경험치 스테이지';box.appendChild(h);
 const p=document.createElement('p');p.textContent='언제든 반복 도전 가능. 승리하면 많은 XP를 받아요. 적을 쓰러뜨릴 때 돈도 평소보다 많이 들어와요.';box.appendChild(p);
 XP_STAGES.forEach((x,i)=>{
   const ic=document.createElement('span');ic.className='vts-stage-icon xp-icon';ic.textContent=['🥉','🥈','🥇'][i];
   legendRow(box,ic,x.name,['클리어 보상 XP +'+x.xp.toLocaleString()+' · 적 성 체력 '+x.castle.toLocaleString(),'적 배율 ×'+x.mult+' · 등장: '+[...x.pool].map(c=>EN[c][0]).join(', ')],()=>startXPStage(i));
 });
}
$('vtsBack').onclick=()=>{buildWorld();show('world');};
function spawnVTSBoss(boss,x,quiet){
 const enemy={name:boss.name,hp:boss.hp,atk:boss.atk,speed:boss.speed,range:boss.range,cd:boss.cd,s:boss.size,
   col:'#555064',acc:'#bb72ec',grid:boss.grid,sprite:boss.sprite,spriteW:boss.spriteW,spriteH:boss.spriteH,spriteFlip:!!boss.spriteFlip,
   ty:['무속성'],rw:boss.multi?300:100,an:boss.an,area:boss.area,freezeAll:!!boss.freezeAll,freezeTime:boss.freezeTime||0};
 const kb=boss.kb||4;
 S.units.push({team:1,boss:true,code:boss.id,T:enemy,x:x==null?80:x,hp:boss.hp,max:boss.hp,kbn:kb,nk:boss.hp-boss.hp/kb,t:0,kt:0,at:0,ph:Math.random()*3});
 if(!quiet){sfx('boss');S.shake=Math.max(S.shake,0.35);S.ring.push({x:80,t:0});}
}
// 레전드 스토리 공통 진행: 여러 마리 보스 순차 출현 · 무리 추가 · 성 피격 증원 / 경험치 스테이지 출현
function legendTick(dt){
 if(S.xpStage){const x=XP_STAGES[S.xpIdx];S.eSpawn-=dt;
   if(S.eSpawn<=0&&S.units.filter(u=>u.team===1).length<12){const n=S.spawnN%5===4?3:1;for(let k=0;k<n;k++)spawnEn(x.pool[Math.floor(Math.random()*x.pool.length)],false);S.spawnN++;S.eSpawn=x.interval*(0.8+Math.random()*0.5);}
   return;}
 const boss=VTS_BOSSES[S.vtsStage];if(!boss)return;
 // 적 성을 때리면 증원: 첫 피격 · 체력 60% · 30% 에서 한 번씩
 const ratio=S.en.hp/S.en.max;
 for(const th of [0.999,0.6,0.3])if(ratio<th&&!S.castleWaves.includes(th)){S.castleWaves.push(th);
   const pool=boss.support;for(let k=0;k<4;k++)spawnEn(pool[(S.spawnN+k)%pool.length],false);S.spawnN+=4;
   if(boss.multi)for(let k=0;k<(th<0.5?2:1);k++)S.vtsQueue.push(k===0?0.4:(boss.multi.stagger||0.9));
   S.pop.push({x:90,t:0,s:'증원 출현!',c:'#ff8a6a'});S.shake=Math.max(S.shake,0.3);sfx('boss');}
 if(!boss.multi)return;const m=boss.multi;
 if(S.vtsQueue&&S.vtsQueue.length){S.vtsQueue[0]-=dt;if(S.vtsQueue[0]<=0){S.vtsQueue.shift();spawnVTSBoss(boss,80,S.vtsQueue.length>0);}return;}
 S.vtsBossT-=dt;
 if(S.vtsBossT<=0){
   S.vtsBossT=m.respawn;
   const alive=S.units.filter(u=>u.team===1&&u.code===boss.id&&u.hp>0).length;
   const n=Math.max(0,Math.min(m.wave||1,m.maxAlive-alive));
   for(let k=0;k<n;k++)S.vtsQueue.push(k===0?0.01:(m.stagger||0.8));
 }
}
function legendBaseState(extra){
 const tsd={};TSETS.forEach(set=>{if(set.trait)tsd[set.trait]=traitTreasureProgress(set.trait);});
 const myHp=1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base'));
 return Object.assign({vtsMode:true,t:0,money:Math.min(100,walletCapacity()),units:[],cool:MY.map(()=>0),over:null,boss:true,drop:'',drop2:'',fx:[],pop:[],cn:0,cnr:60,lid:0,pj:[],bm:[],dust:[],spk:[],ring:[],shake:0,bw:0,
   walM:1,rateM:incomeMultiplier(),tsd,cm:LEGEND_CM,future:false,maxM:1000,rate:14,my:{hp:myHp,max:myHp},eSpawn:3,spawnN:0,mult:1,wl:1,vtsQueue:[],vtsBossT:0,castleWaves:[]},extra);
}
function legendLaunch(title){
 $('stageTitle').textContent=title;show('battle');$('pmenu').classList.add('hide');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function startXPStage(i){
 const x=XP_STAGES[i];if(!x)return;
 stageIdx=8+i*14;CH=0;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();buildSlots(LEGEND_CM);
 S=legendBaseState({xpStage:true,xpIdx:i,en:{hp:x.castle,max:x.castle},mult:x.mult,eSpawn:1.5,killMoney:x.money,retry:()=>startXPStage(i)});applyWk();
 legendLaunch('⭐ '+x.name);
}
function legendXPWin(){
 const x=XP_STAGES[S.xpIdx];xp+=x.xp;qs.wins++;S.xpg=x.xp;S.drop='경험치 스테이지 클리어!';save();
}
function startVTSStage(i){
 const boss=VTS_BOSSES[i];if(!boss)return;
 stageIdx=i;CH=0;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();buildSlots(LEGEND_CM);
 const castle=boss.castle||Math.round(boss.hp*0.16);
 S=legendBaseState({vtsStage:i,en:{hp:castle,max:castle},retry:()=>startVTSStage(i)});applyWk();
 if(boss.multi){
   const m=boss.multi;S.vtsBossT=m.respawn;
   S.vtsQueue=Array.from({length:m.count},(_,k)=>k===0?(m.firstDelay||0.01):(m.stagger||1.6));
   if(!m.firstDelay){S.vtsQueue.shift();spawnVTSBoss(boss,80,true);}
 }else spawnVTSBoss(boss,80,true);
 legendLaunch(boss.name+' 초고난도');
}
