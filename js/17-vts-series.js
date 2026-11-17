// VTS 시리즈: 매일 다섯 스테이지 전부 도전 가능. 원래 기본 캐릭터와 별도로 획득합니다.
const VTS_BOSSES=[
 {id:'VJ',name:'VTS 준치',reward:'vts_junchi',grid:FISH,sprite:'assets/vts-junchi.png',spriteW:30,spriteH:16,spriteFlip:true,size:5,hp:140000,atk:900,range:145,speed:27,cd:2.0,area:false,an:'slash',support:'DST',interval:6.5},
 {id:'VG',name:'VTS 건우통',reward:'vts_gtong',grid:CAN,sprite:'assets/vts-geonwootong.png',spriteW:20,spriteH:17,size:7,hp:230000,atk:1450,range:70,speed:11,cd:3.1,area:true,an:'smash',support:'DSH',interval:7.0},
 {id:'VH',name:'VTS 한치',reward:'vts_hanchi',grid:SQUID,sprite:'assets/vts-hanchi.png',spriteW:20,spriteH:19,size:6,hp:170000,atk:1250,range:165,speed:21,cd:2.7,area:true,an:'tent',support:'DSTJ',interval:6.7},
 {id:'VD',name:'VTS 도라지과자맨',reward:'vts_dorag',grid:DORA,sprite:'assets/vts-doraji.png',spriteW:22,spriteH:27,size:5,hp:205000,atk:1600,range:95,speed:28,cd:2.2,area:true,an:'fire',support:'DSTP',interval:6.8},
 {id:'VE',name:'VTS 에너지원',reward:'vts_energy',grid:ORB,sprite:'assets/vts-energy.png',spriteW:20,spriteH:20,size:6,hp:195000,atk:1050,range:185,speed:40,cd:1.8,area:true,an:'beam',support:'DSJR',interval:7.2}
];
function buildVTSStages(){
 const box=$('vtsStages');box.innerHTML='<h2>VTS 시리즈 · 초고난도</h2><p>월요일부터 일요일까지 <b>5개 스테이지 모두 상시 개방</b>됩니다. 최초 승리 시 VTS 캐릭터를 별도로 획득합니다.</p>';
 VTS_BOSSES.forEach((boss,i)=>{
   const row=document.createElement('button');row.className='tr vts-stage-entry';
   const img=document.createElement('img');img.src=boss.sprite;img.alt=boss.name;img.width=boss.spriteW*3;img.height=boss.spriteH*3;img.className='vts-stage-icon';
   const text=document.createElement('span');const completed=!!vtsCleared[boss.id];
   const name=document.createElement('b');name.textContent=boss.name+' · 초고난도'+(completed?' ✓ 클리어':'');
   const detail=document.createElement('small');detail.textContent='체력 '+boss.hp.toLocaleString()+' · 공격력 '+boss.atk.toLocaleString()+' · 사거리 '+boss.range;
   const reward=document.createElement('small');reward.textContent=own[boss.reward]?'획득 완료: '+boss.name:'최초 클리어 보상: '+boss.name+' 캐릭터';
   text.append(name,document.createElement('br'),detail,document.createElement('br'),reward);row.append(img,text);
   row.onclick=()=>startVTSStage(i);box.appendChild(row);
 });
}
$('vtsBack').onclick=()=>{buildWorld();show('world');};
function startVTSStage(i){
 const boss=VTS_BOSSES[i];if(!boss)return;
 stageIdx=i;CH=0;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();buildSlots();
 const tsd={};TSETS.forEach(set=>{if(set.trait)tsd[set.trait]=traitTreasureProgress(set.trait);});
 S={vtsMode:true,vtsStage:i,t:0,money:Math.min(100,walletCapacity()),units:[],cool:MY.map(()=>0),over:null,boss:true,drop:'',drop2:'',fx:[],pop:[],cn:0,cnr:60,lid:0,pj:[],bm:[],dust:[],spk:[],ring:[],shake:0,bw:0,
   walM:1,rateM:incomeMultiplier(),tsd,cm:CHC[0],future:false,maxM:1000,rate:14,
   my:{hp:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base')),max:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base'))},
   en:{hp:Math.round(boss.hp*0.16),max:Math.round(boss.hp*0.16)},eSpawn:3,spawnN:0,mult:1,wl:1};applyWk();
 const enemy={name:boss.name,hp:boss.hp,atk:boss.atk,speed:boss.speed,range:boss.range,cd:boss.cd,s:boss.size,
   col:'#555064',acc:'#bb72ec',grid:boss.grid,sprite:boss.sprite,spriteW:boss.spriteW,spriteH:boss.spriteH,spriteFlip:!!boss.spriteFlip,
   ty:['무속성'],rw:100,an:boss.an,area:boss.area};
 S.units.push({team:1,boss:true,code:boss.id,T:enemy,x:80,hp:boss.hp,max:boss.hp,kbn:4,nk:boss.hp-boss.hp/4,t:0,kt:0,at:0,ph:Math.random()*3});
 $('stageTitle').textContent=boss.name+' 초고난도';show('battle');$('pmenu').classList.add('hide');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
