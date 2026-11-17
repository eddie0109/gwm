// 건우 대전쟁 · 04-units.js
// ════════ 아군 캐릭터 ════════
// t: N 일반 / R 레어 / SR 슈퍼 레어 / UR 울트라 슈퍼 레어 / EX 스테이지 보상
const trnOf=(hp,atk,spd,pool)=>({pool:pool||12,max:{hp,atk,spd}});
const U=o=>Object.assign({s:4,kb:2,cool:8,cd:1,range:30,speed:34,hp:100,atk:10,cost:100,an:'slash',t:'R',trn:trnOf(8,8,6)},o);

// EX 전용 도트 디자인: 에너지 구체/휴지통 실루엣을 재사용하지 않고 이름에 맞춘 형태
// 옥수수 캐릭터: 양쪽 이파리 + 옥수수 알갱이 + 표정. 아군/적 공용 도트 모델
const CORN_EX=[
'......KKKKKK......',
'.....KYYYYYYK.....',
'....KYOYYOYYK.....',
'...KYYOYYOYYOK....',
'..KYOYYOYYOYYOK...',
'.KYYOYYOYYOYYOK...',
'KWWYOYYOYYOYYOWWK.',
'KWKYYKYYOYYKYYKWK.',
'KWWYYPYYOYYPYYWWK.',
'.KWYYOYYYYOYYWWK..',
'..KWYYOYPYOYYWK...',
'...KWYOYYYOOYWK....',
'....KWYYOYYYWK.....',
'.....KWYYYYWK......',
'......KWWWWK.......',
'.....KWW..WWK......',
'....KWW....WWK.....',
'...KKK......KKK....'];
// 건치는 건강한 이빨을 가진 상어 형태. 적 보스와 아군이 같은 모델을 공유합니다.
const TOOTH_EX=[
'..................K.............',
'.................KWK............',
'................KWWWK...........',
'...........KKKKKWWWWWKK.........',
'.......KKKWWWWWWWWWWWWWWKK......',
'....KKKWWWWWWWWWWWWWWWWWWWKK...',
'..KKWWWWWWWHHHHWWWWWWWWWWWWKK.',
'.KWWWWWWWWWWWWWWWWWWWWWWWWWWWWK',
'KWWWWWWWWWWWWWWWWWWWWWWWKPWKWWWK',
'KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK',
'.KWWWWWWWWWWWWWWWWWWWKKKKKKKKKK.',
'..KKWWWWWWWWWWWWWWWWWWWWWWWWKK..',
'....KKWWWWWWWWWWWWWWWWWWWWKK....',
'......KKKKKKKKKKKKKKKKKKKK......',
'.........KAAAAAAAAAAAAK.........',
'...........KAAAAAAAAK...........',
'.............KKKKKK.............'];

const MY=[
U({id:'junchi',name:'준치',grid:FISH,s:3,hp:100,atk:8,range:65,speed:42,cd:1.23,cost:50,cool:5,kb:3,t:'N',ty:['무속성'],trn:trnOf(8,8,8),desc:'썩어도 준치! 가시가 많은 은빛 물고기예요. 가장 기본이 되는 단일 공격 유닛.',
  f2:{name:'황금준치',grid:deco(FISH,['crown','wings','spikes']),pal:{B:'#c98a14',S:'#ffd84a',L:'#fff2a8'},aura:'#ffd84a',gold:1}}),
U({id:'gtong',name:'건우통',grid:CAN,hp:240,atk:1,range:24,speed:28,cd:1.23,cost:100,cool:5,kb:1,t:'N',ty:['메탈'],unlock:2,trn:trnOf(12,3,4,10),desc:'휴지통 모양의 든든한 고기방패. 공격은 약하지만 체력이 많아서 앞줄을 버텨줘요.',
  f2:{name:'철갑건우통',grid:deco(CAN,['horns','armor','cape']),pal:{S:'#ffd54a',B:'#3f4d5c',L:'#7f8fa0'},aura:'#ffd84a'}}),
U({id:'hanchi',name:'한치',grid:SQUID,hp:80,atk:24,range:100,speed:30,cd:1.5,cost:150,cool:10,kb:2,area:true,an:'tent',col:'#f2a8a0',acc:'#d96a6a',t:'N',ty:['블랙'],unlock:7,trn:trnOf(5,10,6,10),desc:'촉수를 쭉 뻗어 앞의 적들을 한꺼번에 때리는 범위 공격 유닛. 폼 체인지하면 바닥에서 문어발이 솟아오르는 크라켄이 돼요.',
  f2:{name:'대왕한치',grid:KRAKEN,col:'#7a5cd6',acc:'#ff8ad0',aura:'#d9b3ff'}}),
U({id:'dorag',name:'도라지과자맨',grid:DORA,hp:220,atk:14,range:24,speed:34,cd:.9,cost:300,cool:9,kb:2,an:'fire',col:'#e0562a',acc:'#ff9a3c',t:'N',ty:['레드'],unlock:13,trn:trnOf(8,10,6),desc:'도라지과자를 먹고 불꽃을 뿜는 근접 전사. 체력이 좋고 불꽃으로 앞의 적을 태워요.',
  f2:{name:'도라지불꽃맨',grid:deco(DORA,['flame','armor']),col:'#ff2d1a',acc:'#ffd23a',aura:'#ff8a3a'}}),
U({id:'energy',name:'에너지원',grid:ORB,hp:140,atk:6,range:28,speed:70,cd:.45,cost:200,cool:12,kb:2,an:'beam',glow:true,float:true,col:'#46a8ff',acc:'#d5f0ff',aura:'#7fd0ff',t:'N',ty:['에일리언'],unlock:17,trn:trnOf(4,6,12,10),desc:'공중에 떠서 에너지탄을 빠르게 연사하는 유닛. 이동이 빠르고 연타가 좋아요.',
  f2:{name:'초에너지원',grid:deco(ORB,['ring','spikes']),col:'#7a5cff',acc:'#e6dcff',aura:'#b9a6ff'}}),
// ── 레어
U({id:'mack',name:'고등어검사',grid:MACK,s:4,hp:90,atk:11,range:40,speed:52,cd:.7,cost:90,cool:6,kb:3,col:'#3f8ac8',acc:'#e8f4ff',t:'R',ty:['부유'],desc:'칼 한 자루로 빠르게 베는 고등어 검사. 이동이 빠르고 싸게 뽑을 수 있어요.',
  f2:{name:'고등어 사무라이',grid:deco(MACK,['horns','armor','cape']),col:'#2a5ab8',acc:'#ffe27a',aura:'#8fc0ff'}}),
U({id:'clam',name:'조개방패',grid:CLAM,s:4,hp:380,atk:3,range:22,speed:24,cd:1.3,cost:200,cool:9,kb:1,col:'#e8b8c8',acc:'#fff2f6',t:'R',ty:['무속성'],trn:trnOf(12,3,4,10),desc:'단단한 껍데기로 앞을 막는 조개 방패병. 공격은 거의 못 하지만 아주 단단해요.',
  f2:{name:'진주 요새조개',grid:deco(CLAM,['crown','armor']),col:'#d6a0e8',acc:'#ffffff',aura:'#f2d6ff'}}),
U({id:'puffer',name:'복어폭탄',grid:PUFF,s:4,hp:70,atk:16,range:60,speed:30,cd:1.6,cost:170,cool:11,kb:2,area:true,an:'burst',col:'#a8d070',acc:'#fff6a0',t:'R',ty:['좀비'],desc:'적 앞에서 펑! 부풀어 올라 주변을 한꺼번에 터뜨리는 복어 폭탄병.',
  f2:{name:'폭군 복어',grid:deco(PUFF,['spikes','flame']),col:'#f2a03a',acc:'#ff5a3a',aura:'#ffb36a'}}),
U({id:'octo',name:'문어마법사',grid:OCTO,s:4,hp:80,atk:9,range:110,speed:26,cd:.9,cost:210,cool:12,kb:2,an:'beam',col:'#a86ad8',acc:'#ffd84a',t:'R',ty:['악마'],trn:trnOf(5,10,6),desc:'멀리서 먹물 마법탄을 쏘는 문어 마법사. 체력은 약하지만 사거리가 길어요.',
  f2:{name:'대마법 문어',grid:deco(OCTO,['crown','wings']),col:'#5a3ab8',acc:'#ffe27a',aura:'#c8a6ff'}}),
U({id:'crab',name:'집게병',grid:CRAB,s:4,hp:260,atk:12,range:30,speed:32,cd:1,cost:190,cool:10,kb:2,area:true,an:'claw',col:'#e0603a',acc:'#ffd0a0',t:'R',ty:['메탈'],desc:'큰 집게로 앞의 적들을 쓸어버리는 게 집게병. 체력이 좋고 범위 공격을 해요.',
  f2:{name:'철갑 왕게',grid:deco(CRAB,['armor','horns']),col:'#c02a1a',acc:'#ffd84a',aura:'#ff9a6a'}}),
U({id:'ray',name:'가오리글라이더',grid:RAY,s:4,hp:110,atk:8,range:36,speed:74,cd:.5,cost:160,cool:9,kb:2,float:true,col:'#5ac0e8',acc:'#f2fbff',t:'R',ty:['부유'],trn:trnOf(6,6,12),desc:'하늘을 헤엄치듯 날아다니는 가오리 글라이더. 아주 빠르고 연타가 좋아요.',
  f2:{name:'천공 가오리',grid:deco(RAY,['wings','ring']),col:'#3a78e8',acc:'#ffffff',aura:'#a6d0ff'}}),
// ── 슈퍼 레어
U({id:'shark',name:'상어기사',grid:SHARK,s:4,hp:420,atk:34,range:38,speed:40,cd:.9,cost:420,cool:16,kb:3,col:'#5a7aa8',acc:'#f0f6ff',t:'SR',ty:['블랙'],desc:'날카로운 이빨로 한 방이 강한 상어 기사. 체력과 공격력이 모두 높아요.',
  f2:{name:'상어 제독',grid:deco(SHARK,['crown','armor','cape']),col:'#2a4a8a',acc:'#ffe27a',aura:'#8fb0ff'}}),
U({id:'seahorse',name:'해마포수',grid:HORSE,s:4,hp:120,atk:40,range:150,speed:22,cd:1.4,cost:450,cool:18,kb:2,an:'beam',col:'#e8c050',acc:'#fff6c0',t:'SR',ty:['천사'],trn:trnOf(5,12,4),desc:'멀리서 저격하는 해마 포수. 사거리가 매우 길고 한 방이 강해요.',
  f2:{name:'성기사 해마',grid:deco(HORSE,['ring','wings']),col:'#ffe27a',acc:'#ffffff',aura:'#fff2b0'}}),
U({id:'turtle',name:'거북수호신',grid:TURTLE,s:4,hp:1100,atk:14,range:28,speed:18,cd:1.4,cost:520,cool:22,kb:2,col:'#4a9a6a',acc:'#d6c28a',t:'SR',ty:['메탈'],trn:trnOf(12,4,3,14),desc:'아주 단단한 거북 수호신. 느리지만 전선을 오래 지켜줘요.',
  f2:{name:'고대 현무',grid:deco(TURTLE,['spikes','armor','horns']),col:'#2a7a4a',acc:'#ffd84a',aura:'#8fe0b0'}}),
U({id:'eel',name:'전기뱀장어',grid:EEL,s:4,hp:150,atk:26,range:120,speed:30,cd:1.8,cost:480,cool:17,kb:2,area:true,an:'beam',col:'#4a8ae8',acc:'#ffe24a',t:'SR',ty:['에일리언'],desc:'전기 줄기를 뿜어 앞의 적들을 한꺼번에 감전시키는 전기뱀장어 마법사.',
  f2:{name:'뇌룡장어',grid:deco(EEL,['horns','flame']),col:'#2a4ad8',acc:'#fff04a',aura:'#8fb0ff'}}),
U({id:'shrimp',name:'불꽃새우',grid:SHRIMP,s:4,hp:260,atk:22,range:70,speed:32,cd:1.2,cost:560,cool:20,kb:2,area:true,an:'fire',col:'#ff7a3a',acc:'#ffe08a',t:'SR',ty:['레드'],desc:'불꽃을 뿜어 넓은 범위를 태워버리는 새우 마법사. 공격력이 강해요.',
  f2:{name:'불사조 새우',grid:deco(SHRIMP,['wings','flame']),col:'#ff4a1a',acc:'#ffe24a',aura:'#ffb36a'}}),
// ── 울트라 슈퍼 레어 (레어 뽑기 5%)
U({id:'frog',name:'황소개구리',grid:FROG,s:5,hp:180,atk:120,range:280,minR:100,speed:22,cd:3.2,cost:2500,cool:25,kb:5,area:true,leap:true,an:'leap',slowS:true,col:'#4caf3a',acc:'#d6f0a0',aura:'#9be07a',t:'UR',ty:['고대종'],trn:trnOf(8,12,3,14),desc:'크게 점프해서 멀리 있는 적을 내리찍는 범위 공격. 추가 데미지를 줄 수 있는 속성의 적을 맞히면 3초 동안 느리게 만들어요.',
  f2:{name:'황소두꺼비',cost:2500,grid:deco(FROG,['crown','wings','spikes']),col:'#2e8b2e',acc:'#ffe27a',aura:'#ffe27a'}}),
// ── EX (각 장의 마지막 보스를 쓰러뜨리면 획득)
U({id:'fist',name:'격투가 강철',grid:FIGHT,s:4,hp:700,atk:30,range:44,speed:40,cd:.7,cost:3000,cool:14,kb:3,area:true,an:'burst',col:'#d89a68',acc:'#e0402a',t:'EX',ty:['무속성'],trn:trnOf(8,10,6),desc:'1장 보스 격투왕 강철을 쓰러뜨리고 얻은 EX 캐릭터. 빠른 주먹으로 주변을 한꺼번에 때려요. (보스보다는 약해요)',
  f2:{name:'격투왕 강철',grid:deco(FIGHT,['armor','flame']),col:'#c07a4a',acc:'#ff4a2a',aura:'#ff9a5a'}}),
U({id:'cornbar',name:'옥수수익어가는바',grid:CORN_EX,s:5,hp:430,atk:58,range:185,speed:31,cd:3.5,cost:900,cool:24,kb:3,area:true,an:'beam',col:'#f0c837',acc:'#fff4a8',t:'EX',ty:['무속성'],pal:{Y:'#f3c52e',W:'#6f9e35',C:'#fff1a0'},freezeNeutral:0.35,freezeTime:2,trn:trnOf(7,10,6),desc:'세계편 2장 클리어 보상. 무속성 적에게만 35% 확률로 2초간 정지. 범위 공격, 느린 공격 속도, 보스보다 짧은 사거리.'}),
U({id:'healthytooth',name:'건치',grid:TOOTH_EX,s:4,hp:1850,atk:155,range:295,speed:50,cd:2.4,cost:4000/1.5,cool:26,kb:4,area:true,an:'burst',col:'#e3f7ff',acc:'#6ac6ef',t:'EX',ty:['천사'],pal:{W:'#ffffff'},trn:trnOf(8,10,7),desc:'세계편 3장 클리어 보상. 거대한 이빨을 가진 상어 건치! 높은 체력과 공격력, 장거리 범위 공격. 이동은 준수하고 공격 간격은 조금 길어요.'})
];
// VTS: 각 초고난도 스테이지 첫 승리 때 별도로 획득하는 EX 유닛.
// 기본 캐릭터와 동시에 편성할 수 있으며 고유 레벨/쿨타임을 사용합니다.
MY.push(
 U({id:'vts_junchi',name:'VTS 준치',grid:FISH,sprite:'assets/vts-junchi.png',spriteW:30,spriteH:16,spriteFlip:true,s:3,hp:170,atk:13,range:70,speed:54,cd:1.1,cost:100,cool:5,kb:3,t:'EX',ty:['무속성'],trn:trnOf(8,8,8),aura:'#a750eb',desc:'VTS 준치 스테이지를 클리어하면 얻는 광란의 준치. 기본 준치와 함께 편성할 수 있습니다.'}),
 U({id:'vts_gtong',name:'VTS 건우통',grid:CAN,sprite:'assets/vts-geonwootong.png',spriteW:20,spriteH:17,s:3,hp:420,atk:2,range:25,speed:40,cd:1.1,cost:180,cool:6,kb:1,t:'EX',ty:['메탈'],trn:trnOf(12,3,6,12),aura:'#a750eb',desc:'VTS 건우통 스테이지 클리어 보상. 진회색의 튼튼한 방패입니다.'}),
 U({id:'vts_hanchi',name:'VTS 한치',grid:SQUID,sprite:'assets/vts-hanchi.png',spriteW:20,spriteH:19,s:3,hp:135,atk:37,range:115,speed:40,cd:1.5,cost:300,cool:12,kb:2,area:true,an:'tent',col:'#686078',acc:'#c276fb',t:'EX',ty:['블랙'],trn:trnOf(6,10,6,11),aura:'#a750eb',desc:'VTS 한치 스테이지 클리어 보상. 촉수로 넓게 공격합니다.'}),
 U({id:'vts_dorag',name:'VTS 도라지과자맨',grid:DORA,sprite:'assets/vts-doraji.png',spriteW:22,spriteH:27,s:3,hp:350,atk:26,range:30,speed:43,cd:.85,cost:450,cool:12,kb:2,an:'fire',col:'#5e5372',acc:'#ca70ff',t:'EX',ty:['레드'],trn:trnOf(9,10,6,12),aura:'#a750eb',desc:'VTS 도라지과자맨 스테이지 클리어 보상. 광란의 불꽃을 내뿜습니다.'}),
 U({id:'vts_energy',name:'VTS 에너지원',grid:ORB,sprite:'assets/vts-energy.png',spriteW:20,spriteH:20,s:3,hp:190,atk:11,range:45,speed:78,cd:.45,cost:340,cool:15,kb:2,an:'beam',float:true,glow:true,col:'#6659a9',acc:'#df9cff',aura:'#a750eb',t:'EX',ty:['에일리언'],trn:trnOf(6,8,12,12),desc:'VTS 에너지원 스테이지 클리어 보상. 보라색 에너지로 빠르게 연타합니다.'})
);

// 기본 캐릭터 3단 진화: 총합 Lv10에 2형, 총합 Lv30에 3형.
// 3형은 2형에 큰 장식과 독자 팔레트를 추가해 외형을 구분합니다.
const BASIC_THIRD_FORMS={
  junchi:{name:'무지개준치',dec:['crown','wings','ring','spikes'],pal:{B:'#ff5a69',S:'#59c7ff',L:'#a77dff',Y:'#ffe45c',O:'#5ae0a0'},aura:'#a7ddff'},
  gtong:{name:'초합금 건우요새',dec:['armor','horns','spikes','ring'],pal:{B:'#364f68',S:'#d6eafa',L:'#8bdfff',M:'#78aecf',N:'#34445f',Y:'#ffe05c'},aura:'#82d9ff'},
  hanchi:{name:'심해황제 한치',dec:['crown','horns','spikes','wings'],col:'#5035aa',acc:'#eb8bff',aura:'#c19aff'},
  dorag:{name:'초염왕 도라지과자맨',dec:['flame','horns','cape','spikes'],col:'#ed3b19',acc:'#fff06b',aura:'#ff6a24'},
  energy:{name:'궁극 에너지원',dec:['ring','wings','spikes','crown'],col:'#3a65ff',acc:'#e7faff',aura:'#96baff'}
};
MY.filter(u=>u.t==='N'&&u.f2).forEach(u=>{
  const spec=BASIC_THIRD_FORMS[u.id];if(!spec)return;
  const second=u.f2;
  u.f3=Object.assign({},second,{name:spec.name,grid:deco(second.grid,spec.dec),aura:spec.aura});
  if(spec.pal)u.f3.pal=spec.pal;
  if(u.id==='junchi'){u.f3.gold=false;u.f3.rainbow=true;}
  if(spec.col){u.f3.col=spec.col;u.f3.acc=spec.acc;delete u.f3.pal;}
});

// 미래편 보상 EX 3형: XP 레벨 20 이상과 해당 장 클리어 조건
const EX_FINAL_FORMS={fist:['우주강철 격투왕',['armor','wings','flame']],cornbar:['황금 옥수수왕',['crown','wings','ring']],healthytooth:['심해의 제왕 건치',['crown','spikes','wings']]};
for(const u of MY){if(!EX_FINAL_FORMS[u.id])continue;if(!u.f2){u.f2={name:u.id==='cornbar'?'황금 옥수수 장군':'강철턱 건치',grid:deco(u.grid,['armor','spikes']),aura:'#9beaff',col:u.col,acc:u.acc};}const [name,dec]=EX_FINAL_FORMS[u.id];u.f3={name,grid:deco(u.grid,dec),aura:'#a1edff',col:u.col,acc:'#ffffff'};}
// 고비용/고등급 유닛: 기본 연구력으로 지나치게 짧아지지 않게 출격 간격 조정
// 유닛 본래 공격속도(cd)는 변경하지 않고 재생산 시간(cool)만 증가시킵니다.
for(const u of MY){
 const target=u.t==='UR'?Math.max(75,u.cost>=2000?95:75):
              u.t==='SR'?Math.max(30,u.cost>=1000?44:30):
              u.t==='EX'&&u.cost>=1500?Math.max(50,u.cool):
              u.t==='R'&&u.cost>=800?Math.max(23,u.cool):u.cool;
 u.cool=Math.round(target*10)/10;
}
const ATKM=2.5; // 공격력 전체 상향 (전투가 너무 길어서 아군·적 모두 ×2.5)
MY.forEach(u=>{u.atk*=ATKM;});

const GACHA_BANNERS=["기본 레어 뽑기"];

// 공격력 상향은 위 MY.forEach에서 정확히 한 번만 적용합니다.
const TIERN={N:'일반',R:'레어',SR:'슈퍼 레어',UR:'울트라 슈퍼 레어',EX:'EX'};
const TIERC={N:'#d8e8ff',R:'#a8f0b8',SR:'#ffe27a',UR:'#ff9ae0',EX:'#ff9a6a'};
const TM={N:1,R:1.5,SR:2,UR:3,EX:1.5};
const DXP={N:600,R:1500,SR:3000,UR:6000,EX:2000};
const WORLD_ENEMY_SCALE=1.4; // 세계편 1·2·3장 적 체력과 공격력에 동일 적용
const CHM=[1,1.5,4,1.1,1.65,2.35],CHC=[1,1.5,2,1.5,1.5,1.5],ENM=1.25; // 냥코 원작 배율: 1장 100% · 2장 150% · 3장 400% (유닛 가격 ×1 / ×1.5 / ×2)

