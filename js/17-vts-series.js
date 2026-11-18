// VTS 시리즈: 매일 다섯 스테이지 전부 도전 가능. 원래 기본 캐릭터와 별도로 획득합니다.
// hp/atk는 실제 전투 수치. VTS 보스는 모두 무속성이라 무속성 대항 보물이 적용됩니다
// (올보물 완성 시 주는 피해 +50% → 실질 체력 hp/1.5, 받는 피해 −50% → 실질 공격력 atk×0.5).
// VTS 준치는 "무속성 대항 올보물 기준 체력 25만 · 공격력 9000"이 되도록 hp 375000 / atk 18000으로 설정했습니다.
// multi: 보스가 여러 마리 출현 (count=시작 마리 수, respawn=추가 출현 간격(초), maxAlive=동시 최대, wave=한 번에 나오는 수)
const VTS_BOSSES=[
 {id:'VJ',name:'VTS 준치',reward:'vts_junchi',grid:FISH,sprite:'assets/vts-junchi.png',spriteW:30,spriteH:16,spriteFlip:true,size:5,hp:375000,atk:18000,basis:{hp:250000,atk:9000},range:145,speed:27,cd:2.0,area:false,an:'slash',support:'DST',interval:6.5,castle:60000},
 {id:'VG',name:'VTS 건우통',reward:'vts_gtong',grid:CAN,sprite:'assets/vts-geonwootong.png',spriteW:20,spriteH:17,size:7,hp:400000,atk:15000,range:200,speed:11,cd:3.1,area:true,an:'smash',support:'DSH',interval:7.0,castle:64000},
 {id:'VH',name:'VTS 한치',reward:'vts_hanchi',grid:SQUID,sprite:'assets/vts-hanchi.png',spriteW:20,spriteH:19,size:6,hp:20000,atk:2000,range:165,speed:21,cd:2.7,area:true,an:'tent',support:'DSTJ',interval:6.7,castle:50000,
  kb:3,multi:{count:3,respawn:6,wave:2,maxAlive:8},note:'한치가 여러 마리 계속 몰려와요'},
 {id:'VD',name:'VTS 도라지과자맨',reward:'vts_dorag',grid:DORA,sprite:'assets/vts-doraji.png',spriteW:22,spriteH:27,size:5,hp:300000,atk:20000,range:95,speed:28,cd:2.2,area:true,an:'fire',support:'DSTP',interval:6.8,castle:48000,
  freezeAll:true,freezeTime:3,note:'공격에 맞은 아군은 100% 확률로 3초 정지'},
 // 광란의 황소 스테이지 스타일: 빠르고 공격이 잦은 돌격형 보스가 무리 지어 계속 돌진
 {id:'VE',name:'VTS 에너지원',reward:'vts_energy',grid:ORB,sprite:'assets/vts-energy.png',spriteW:20,spriteH:20,size:6,hp:60000,atk:1500,range:120,speed:72,cd:0.7,area:true,an:'beam',support:'DS',interval:9.0,castle:50000,
  kb:3,multi:{count:3,respawn:12,wave:3,maxAlive:7,firstDelay:1.2,stagger:0.9},note:'광란의 황소처럼 빠른 에너지원이 무리 지어 계속 돌진'}
];
function vtsFmt(n){return n>=10000&&n%10000===0?(n/10000)+'만':n.toLocaleString();}
function buildVTSStages(){
 const box=$('vtsStages');box.innerHTML='<h2>VTS 시리즈 · 초고난도</h2><p>월요일부터 일요일까지 <b>5개 스테이지 모두 상시 개방</b>됩니다. 최초 승리 시 VTS 캐릭터를 별도로 획득합니다. VTS 보스는 모두 <b>무속성</b>이에요.</p>';
 VTS_BOSSES.forEach((boss,i)=>{
   const row=document.createElement('button');row.className='tr vts-stage-entry';
   const img=document.createElement('img');img.src=boss.sprite;img.alt=boss.name;img.width=boss.spriteW*3;img.height=boss.spriteH*3;img.className='vts-stage-icon';
   const text=document.createElement('span');const completed=!!vtsCleared[boss.id];
   const name=document.createElement('b');name.textContent=boss.name+' · 초고난도'+(completed?' ✓ 클리어':'');
   const detail=document.createElement('small');
   detail.textContent=boss.basis
     ?'무속성 대항 올보물 기준 체력 '+vtsFmt(boss.basis.hp)+' · 공격력 '+boss.basis.atk.toLocaleString()+' (보물 없이 '+vtsFmt(boss.hp)+' / '+boss.atk.toLocaleString()+') · 사거리 '+boss.range
     :'체력 '+vtsFmt(boss.hp)+(boss.multi?' (여러 마리)':'')+' · 공격력 '+boss.atk.toLocaleString()+' · 사거리 '+boss.range;
   const reward=document.createElement('small');reward.textContent=(boss.note?boss.note+' · ':'')+(own[boss.reward]?'획득 완료: '+boss.name:'최초 클리어 보상: '+boss.name+' 캐릭터');
   text.append(name,document.createElement('br'),detail,document.createElement('br'),reward);row.append(img,text);
   row.onclick=()=>startVTSStage(i);box.appendChild(row);
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
// 여러 마리 보스: 시작 시 순차 출현 → 이후 일정 간격으로 무리 추가
function vtsBossTick(dt){
 const boss=VTS_BOSSES[S.vtsStage];if(!boss||!boss.multi)return;const m=boss.multi;
 if(S.vtsQueue&&S.vtsQueue.length){S.vtsQueue[0]-=dt;if(S.vtsQueue[0]<=0){S.vtsQueue.shift();spawnVTSBoss(boss,80,S.vtsQueue.length>0);}return;}
 S.vtsBossT-=dt;
 if(S.vtsBossT<=0){
   S.vtsBossT=m.respawn;
   const alive=S.units.filter(u=>u.team===1&&u.code===boss.id&&u.hp>0).length;
   const n=Math.max(0,Math.min(m.wave||1,m.maxAlive-alive));
   for(let k=0;k<n;k++)S.vtsQueue.push(k===0?0.01:(m.stagger||0.8));
 }
}
function startVTSStage(i){
 const boss=VTS_BOSSES[i];if(!boss)return;
 stageIdx=i;CH=0;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();buildSlots();
 const tsd={};TSETS.forEach(set=>{if(set.trait)tsd[set.trait]=traitTreasureProgress(set.trait);});
 const castle=boss.castle||Math.round(boss.hp*0.16);
 S={vtsMode:true,vtsStage:i,t:0,money:Math.min(100,walletCapacity()),units:[],cool:MY.map(()=>0),over:null,boss:true,drop:'',drop2:'',fx:[],pop:[],cn:0,cnr:60,lid:0,pj:[],bm:[],dust:[],spk:[],ring:[],shake:0,bw:0,
   walM:1,rateM:incomeMultiplier(),tsd,cm:CHC[0],future:false,maxM:1000,rate:14,
   my:{hp:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base')),max:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base'))},
   en:{hp:castle,max:castle},eSpawn:3,spawnN:0,mult:1,wl:1,vtsQueue:[],vtsBossT:0};applyWk();
 if(boss.multi){
   const m=boss.multi;S.vtsBossT=m.respawn;
   S.vtsQueue=Array.from({length:m.count},(_,k)=>k===0?(m.firstDelay||0.01):(m.stagger||1.6));
   if(!m.firstDelay){S.vtsQueue.shift();spawnVTSBoss(boss,80,true);}
 }else spawnVTSBoss(boss,80,true);
 $('stageTitle').textContent=boss.name+' 초고난도';show('battle');$('pmenu').classList.add('hide');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
