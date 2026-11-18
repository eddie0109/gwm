// 건우 대전쟁 · 06-enemies-stages.js
// ════════ 적 ════════
// [이름, 체력, 공격, 속도, 사거리, 몸색, 크기, 모양, 포인트색]
const EN={
D:['Doge',110,8,28,24,'#e8e0c8',3,'e','#b08a4a'],S:['Snache',90,6,38,22,'#6aa84f',3,'l','#e6e29a'],T:['Those Guys',70,5,45,20,'#f0f0f0',3,'t','#777'],
H:['Hippoe',600,30,14,30,'#8a8f98',4,'w','#e89bb0'],P:['Pigge',260,14,26,26,'#f4a6b8',4,'e','#d66a8a'],J:['Jackie Peng',230,12,24,24,'#3b6ea5',4,'t','#ffffff'],
G:['Gory',450,22,22,26,'#5c4030',4,'w','#c9a27a'],B:['Baa Baa',300,10,20,24,'#f5f5f5',4,'r','#aaaaaa'],R:['Croco',400,18,24,28,'#4d8f4a',3,'l','#d8d27a'],
Z:['Sir Seal',500,20,20,26,'#aab7c4',4,'r','#ffffff'],L:["Le'boin",700,26,16,28,'#b5651d',5,'h','#f2d04a'],K:['Kang Roo',800,30,30,28,'#c97a3a',5,'e','#f0d0a0'],
Q:['Squire Rel',900,25,28,26,'#9a6a3a',5,'e','#e8c89a'],M:['Mooth',2000,50,12,34,'#8e44ad',5,'p','#f0e0ff'],N:['One Horn',1500,40,14,32,'#d35400',6,'h','#ffffff'],
X:['Teacher Bear',2500,60,12,34,'#6b4a2f',5,'w','#d9b38c'],U:['B.B.Bunny',700,22,26,26,'#f7c6d9',5,'p','#ffffff'],
F:['격투왕 강철',6000,120,16,40,'#d89a68',6,'f','#d8301a'],Y:['Teacher Bun Bun',4000,90,38,30,'#f7c6d9',6,'p','#cc3355'],
O:['옥수수익어가는바',4600,65,15,230,'#f0c837',4,'r','#fff4a8'],C:['건치',9200,47,33,105,'#e3f7ff',6,'w','#66cbf2']};
// 보상 / 속성 / 공격 모션 / 범위 공격 여부 (몇몇은 개체 공격)
const ENR={D:15,S:30,T:75,H:400,P:6,J:6,G:12,B:150,R:10,Z:12,L:16,K:18,Q:20,M:40,N:35,X:50,U:14,F:200,Y:150,O:240,C:330};
const ENTY={D:['무속성'],S:['무속성'],T:['무속성'],H:['무속성'],P:['레드'],J:['무속성'],G:['무속성'],B:['무속성'],R:['무속성'],Z:['레드'],L:['무속성'],K:['무속성'],Q:['무속성'],M:['부유'],N:['레드'],X:['무속성'],U:['레드'],F:['무속성'],Y:['부유'],O:['무속성'],C:['무속성']};
const ENAN={D:'claw',S:'claw',T:'slash',H:'smash',P:'slash',J:'slash',G:'smash',B:'slash',R:'claw',Z:'slash',L:'smash',K:'claw',Q:'claw',M:'slash',N:'smash',X:'smash',U:'slash',F:'burst',Y:'claw',O:'beam',C:'smash'};
let ENAR='HGLKNMXUYFROC';
const EN_SPECIAL={O:{slow:2,description:'무속성 · 사거리 230 · 느린 공격 · 공격에 맞은 아군을 2초 동안 강하게 느리게'},C:{description:'무속성 · 거대한 상어 형태 · 빠른 공격 · 높은 체력'}};
// 원작 기준 일반 속성: Snache, Hippoe, Jackie Peng, Gory, Croco, Le'boin, Kang Roo, Squire Rel, Teacher Bear 등은 무속성. Sir Seal과 B.B.Bunny는 빨간 적.
// 세계편에서는 미래편/레전드 전용 속성을 적에게 부여하지 않음.
const BOSS_HP_FACTOR=0.72,BOSS_ATK_FACTOR=0.72,ENEMY_HP_NERF=0.78,ENEMY_ATK_NERF=0.72;
Object.values(EN).forEach(e=>{e[2]*=ATKM;});
// 적 모양 (오른쪽을 봐요) — K 윤곽 / C 몸 / D 그림자 / H 하이라이트 / A 포인트
const TPL={
r:["...KKKKKK...","..KHHCCCCK..",".KHCCCCCCCK.","KHCCEPCCEPCK","KCCCCCCCCCCK","KCCDCAAACCDK","KDCCCCCCCCDK",".KDDDDDDDDK.","..KK.KK.KK.."],
e:["KK........KK","KAK......KAK",".KKKKKKKKKK.","KHHCCCCCCCCK","KHCEPCCEPCCK","KCCCCAACCCCK","KCCCCWWCCCCK",".KDCCCCCCDK.",".KDDCCCCDDK.","KDDK....KDDK","KKK......KKK"],
h:["W..........W","KW........WK",".KWKKKKKKWK.","KHHCCCCCCCCK","KHCEPCCEPCCK","KCCCCCCCCCCK","KCCKWKWKCCCK",".KDCCCCCCDK.",".KDDCCCCDDK.","KDDK....KDDK","KKK......KKK"],
t:["..KKKKK..",".KHHCCCK.",".KCEPEPK.",".KCCAACK.","..KKKKK..",".KAAAAAK.","KCAAAAACK","KCDAAADCK","KC.KAK.CK",".KK.K.KK.","..KDKDK..","..KDKDK..",".KKK.KKK."],
w:["..KKKKKKKKKK..",".KHHCCCCCCCCK.","KHCCEPCCCEPCCK","KCCCCCCCCCCCCK","KCCKWWKWWKCCCK","KCCCCCCCCCCCCK","KDCCCCCCCCCCDK",".KDDCCCCCCDDK.","..KDDCKKCDDK..",".KDDK.KK.KDDK.",".KKK......KKK."],
l:["KK..............","KCKKKKKKKKKKKK..","KCCHHCCCCCCCCKK.",".KCCCCCCCCCCCEPK",".KDDCCCCCCCCCWWK","..KDDDDDDDDDKKK.","...KKKKKKKKK...."],
f:["...KAAAAK...","..KHHCCCCK..","..KCCEPCCK..","...KCCCCK...",".KKKCCCCKKK.","KAAAKCCKAAAK","KAAAKCDDKAAK",".KKKKCCCKKK.","....KCCCK...","...KDDKDDK..","...KDK.KDK..","..KKKK.KKKK."],
p:["..KK....KK..",".KAK....KAK.",".KAK....KAK.",".KCKKKKKKCK.","KHCCCCCCCCCK","KHCEPCCEPCCK","KCCCCAACCCCK","KCCCCCCCCCCK",".KDCCCCCCDK.",".KDDCCCCDDK.","..KDKKKKDK..","..KDK..KDK..","..KKK..KKK.."]};
// 스테이지: [이름, 원작 성 체력, 보스, 일반 적들]
const ST=[["한국",500,"","D"],["몽골",500,"","DS"],["중국",500,"","DST"],["태국",500,"","DST"],["캄보디아",750,"","DST"],["필리핀",750,"","DST"],
["일본",2400,"H","DST"],["호주",1500,"","DST"],["싱가포르",3000,"","DST"],["몰디브",2500,"P","DST"],["인도",3500,"","DSTH"],["네팔",4000,"","DSTP"],
["두바이",5000,"","DSTJ"],["사우디아라비아",6000,"","DSTH"],["케냐",6100,"","DSTPH"],["마다가스카르",7000,"G","TD"],["남아프리카공화국",7000,"","DSTJPH"],
["가나",8000,"","DSTJP"],["사하라",9000,"","TGB"],["이집트",9000,"","DSTBPHG"],["터키",10000,"","DSTBPHGJ"],["러시아",12000,"","STBJG"],
["그리스",15000,"Z","TP"],["이탈리아",15000,"","HPJG"],["모나코",15000,"","DSTHBJ"],["스페인",15000,"","RZ"],["프랑스",15000,"","DSTRBGZ"],
["독일",15000,"","DSTRGZJHP"],["덴마크",18000,"L","DSTR"],["노르웨이",15000,"","STRBGZJHP"],["영국",8000,"","RTBLP"],["그린란드",18000,"","TUZP"],
["캐나다",18000,"","STRBGZJHP"],["뉴욕",18000,"","STRBGZJHP"],["버뮤다",20000,"K","DSTRU"],["자메이카",20000,"","DSTRUBHPL"],["콜롬비아",20000,"","DSTRUBHPK"],
["브라질",20000,"M","DTQGR"],["아르헨티나",20000,"","DSTQGZJ"],["마추픽추",20000,"","DSTQGZJLK"],["이스터섬",20000,"N","TRQ"],["멕시코",25000,"","DSTQGZJLK"],
["NASA",20000,"","DSTRUPZN"],["라스베이거스",25000,"X","DSTQ"],["할리우드",20000,"","HPJGZLKM"],["알래스카",20000,"","QXPUM"],["하와이",30000,"","THJGZLKNX"],["달",99999,"F","THJGK"]];
// 2장·3장: 같은 48개 나라, 적이 더 다양해지고 마지막 보스가 바뀌어요 (적 구성은 이 게임용으로 새로 섞은 값)
function mkCh(c){return ST.map((s,i)=>{const ex=c===1?(i<8?'':i<24?'PB':i<40?'JKR':'LQUN'):(i<8?'H':i<24?'GZ':i<40?'KQXU':'MNLY');
  return [s[0],s[1],i===47?(c===1?'O':'C'):s[2],[...new Set((s[3]+ex).split(''))].join('')];});}
const STS=[ST,mkCh(1),mkCh(2)];
// 세계편 옥수수 보스는 2장 달의 보스 하나에만 등장. 일반 적 풀에 포함하지 않는다.
for(let ch=0;ch<3;ch++)for(let i=0;i<48;i++){STS[ch][i][3]=STS[ch][i][3].replaceAll('O','');if(STS[ch][i][2]==='O'&&(ch!==1||i!==47))STS[ch][i][2]='';}
STS[1][47][2]='O';

// 미래편 3개 장: 원작 등장 적 종류를 참고하되 출현 시각은 게임용 별도 설계.
// 기존 에일리언은 무보물 상태에서 강력하며 각 미래편 크리스탈이 배율을 1배씩 깎아요.
const FUTURE_EN={
 a:['Shibalien',210,15,34,35,'#7aeed9',4,'e','#f3d2ff'],b:['Hyppoh',1000,35,18,35,'#67d9c9',5,'w','#fff'],c:['Helmut Krabbe',720,30,22,36,'#77badc',5,'r','#fff'],d:['Imperator Sael',900,38,20,40,'#ae83ea',5,'r','#fff'],e:['Maawth',1100,42,24,46,'#cf88f1',5,'p','#fff'],f:['I.M. Phace',3800,85,18,135,'#8fe5bb',7,'w','#f0f'],g:['Ursamajor',1800,67,26,52,'#99d9f3',6,'w','#fff'],h:['Kroxo',310,21,30,26,'#8fe5e7',3,'l','#fff'],i:['LeMurr',620,27,30,40,'#81c8ee',4,'e','#fff'],j:['Elizabeth the LVIth',1600,60,22,45,'#df8ee7',6,'e','#fff'],k:['Nimoy Bore',3600,86,26,46,'#78a2eb',6,'h','#fff'],l:['Cli-One',8000,110,10,265,'#a3e7f6',8,'p','#fff'],
 m:['Scissoroo',1600,65,24,45,'#8cd5c9',6,'e','#fff'],n:['Cyberhorn',5400,120,14,42,'#a6c6dc',6,'h','#fff'],o:['Mistress Celeboodle',1300,55,24,55,'#c9acf9',5,'p','#fff'],p:['Galactic Overseer Nyandam',11000,170,10,240,'#8fa1ed',9,'w','#fff'],q:['Corrupted Valkyrie',13000,185,36,135,'#ac76e9',8,'p','#fff'],
 r:['Calamary',3000,120,18,180,'#73cfea',7,'p','#fff'],s:['Alpacky',7500,140,20,205,'#be8ce8',7,'h','#fff'],t:['Bun Bun Symbiote',18000,230,42,65,'#ad8df9',9,'p','#fff'],v:['Elder Sloth',16000,260,9,235,'#99cfb9',9,'w','#fff'],z:['Raging Bahamut Cat',25000,300,52,95,'#735bef',10,'p','#fff'],
 A:['에일리언 격투왕 강철',14000,170,34,63,'#7b7df1',9,'f','#9bedf7'],Ω:['에일리언 옥수수익어가는바',15000,185,18,230,'#71d0e6',9,'r','#f0e37c'],'0':['에일리언 건치',23000,155,43,125,'#80d8ed',11,'w','#fff']
};
Object.assign(EN,FUTURE_EN);for(const k in FUTURE_EN){const ch=FUTURE_EN[k];ch[2]*=ATKM;ENR[k]=k==='A'||k==='Ω'||k==='0'?600:k==='a'?90:k==='b'?350:80;ENTY[k]=['에일리언'];ENAN[k]='beam';}
ENAR+='abcdefghijklmnopqrstvzAΩ0';
// 미래편 보물: 원작의 11가지 세트 분류와 역할을 참고한 건우 대전쟁 전용 48개 보물.
// 크리스탈(에일리언 보정), 성 방어, 대포 충전/공격, 속성 열매, 에너지 회복/상한.
const FUTURE_CRYSTALS=['에일리언 크리스탈 α','에일리언 크리스탈 β','에일리언 크리스탈 γ','에일리언 크리스탈 δ','에일리언 크리스탈 ε','에일리언 크리스탈 ζ'];
const LEGACY_FUTURE_ITEMS=FUTURE_CRYSTALS.concat(...['전력 코어','초합금 금고','연구 기록','우주 발광석','생명 결정','미래 조준기'].map(pre=>Array.from({length:7},(_,i)=>pre+' '+(i+1))));
const F_TSETS=[
 {id:'f_crystal',name:'아쿠아·플라즈마 크리스탈',eff:'비스타 에일리언 기본 배율 감소 (완성 시 700% → 100%)',items:FUTURE_CRYSTALS},
 {id:'f_base',name:'고대의 석판',eff:'건우성 최대 체력 증가 (최대 30%)',items:['고대 석판 Ⅰ','고대 석판 Ⅱ','고대 석판 Ⅲ']},
 {id:'f_force',name:'신비한 힘',eff:'쓰레기포 충전 시간 감소 (최대 15초)',items:['신비한 코어 Ⅰ','신비한 코어 Ⅱ','신비한 코어 Ⅲ']},
 {id:'f_cannon',name:'우주의 에너지',eff:'쓰레기포 추가 위력 증가',items:['우주 동력 Ⅰ','우주 동력 Ⅱ','우주 동력 Ⅲ','우주 동력 Ⅳ','우주 동력 Ⅴ']},
 {id:'f_black',name:'공허의 열매',eff:'블랙 적에게 유리한 특수능력 강화',items:['검은 열매 Ⅰ','검은 열매 Ⅱ','검은 열매 Ⅲ','검은 열매 Ⅳ']},
 {id:'f_red',name:'피의 열매',eff:'레드 적에게 유리한 특수능력 강화',items:['붉은 열매 Ⅰ','붉은 열매 Ⅱ','붉은 열매 Ⅲ','붉은 열매 Ⅳ']},
 {id:'f_floating',name:'하늘의 열매',eff:'부유 적에게 유리한 특수능력 강화',items:['하늘 열매 Ⅰ','하늘 열매 Ⅱ','하늘 열매 Ⅲ','하늘 열매 Ⅳ']},
 {id:'f_angel',name:'천상의 열매',eff:'천사 적에게 유리한 특수능력 강화',items:['성스러운 열매 Ⅰ','성스러운 열매 Ⅱ','성스러운 열매 Ⅲ','성스러운 열매 Ⅳ']},
 {id:'f_time',name:'타임머신',eff:'기력 회복 간격 60초 → 최대 30초',items:['시간의 톱니 Ⅰ','시간의 톱니 Ⅱ','시간의 톱니 Ⅲ','시간의 톱니 Ⅳ','시간의 톱니 Ⅴ']},
 {id:'f_capacity',name:'미래 기술',eff:'최대 기력 증가 (최대 +90)',items:['미래 설계도 Ⅰ','미래 설계도 Ⅱ']},
 {id:'f_memorial',name:'미래편 기념품',eff:'장식 수집 보물 (추가 전투 강화 없음)',items:['미래 기념장 Ⅰ','미래 기념장 Ⅱ','미래 기념장 Ⅲ','미래 기념장 Ⅳ','미래 기념장 Ⅴ','미래 기념장 Ⅵ','미래 기념장 Ⅶ','미래 기념장 Ⅷ']}
];
const FUTURE_ITEMS=F_TSETS.flatMap(x=>x.items);
if(FUTURE_ITEMS.length!==48)throw Error('미래편 보물 개수 오류: '+FUTURE_ITEMS.length);
const futureTreasureProgress=id=>{const set=F_TSETS.find(x=>x.id===id);return set?[3,4,5].reduce((n,c)=>n+set.items.filter(x=>hasTreasure(c,x)).length,0)/(set.items.length*3):0;};
const alienCrystalCount=()=>[3,4,5].reduce((n,c)=>n+FUTURE_CRYSTALS.filter(x=>hasTreasure(c,x)).length,0);
const futureAlienMult=()=>Math.max(1,7-alienCrystalCount()/3);
const futureFruitProgress=traits=>Math.max(0,...(traits||[]).map(t=>futureTreasureProgress(({'레드':'f_red','블랙':'f_black','부유':'f_floating','천사':'f_angel'})[t]||'_')));
// 이전 게임의 48개 미래편 보물은 같은 스테이지 번호의 새 보물로 이관합니다.
function migrateFutureTreasures(){let changed=false;for(const ch of [3,4,5])for(let i=0;i<48;i++){
 const old=ch+':'+LEGACY_FUTURE_ITEMS[i],now=ch+':'+FUTURE_ITEMS[i];
 if(trc[old]&&!trc[now]){trc[now]=1;changed=true;}
}return changed;}
const FUTURE_STAGE_NAMES=ST.map(x=>x[0]);
// 스테이지마다 고정된 시드로 적 조합·출현 패턴을 다르게 만듭니다 (같은 스테이지는 항상 같은 구성).
// 패턴: mixed(골고루) / rush(에일리언 돌격 + 몰려오기) / tank(강한 적 위주, 느린 출현) / swarm(약한 적 대량) / wave(점점 커지는 무리)
const FUTURE_PATTERNS=['mixed','rush','tank','swarm','wave'];
const FUTURE_PATTERN_NAMES={mixed:'혼전',rush:'돌격',tank:'중장갑',swarm:'물량',wave:'파도'};
function seededRand(seed){let x=seed>>>0||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
function makeFutureStage(ch,i){
 const boss=i===47?['A','Ω','0'][ch]:i===23?['f','p','t'][ch]:i===42?['k','n','s'][ch]:i===37?['e','q','v'][ch]:'';
 const kinds=ch===0?'abhicdejgk':ch===1?'abhicdejgkmno':'abhicdejgkmnorstv';
 const rnd=seededRand(9973*(ch+1)+i*7919+31);
 const unlocked=Math.min(kinds.length,3+Math.floor(i/5)+ch*2),pool=new Set();
 pool.add(kinds[unlocked-1-Math.floor(rnd()*Math.min(3,unlocked))]); // 새로 등장한 에일리언 중 하나는 꼭 포함
 const nAlien=2+Math.floor(rnd()*(i<10?2:3));
 for(let k=0;k<nAlien*3&&pool.size<nAlien;k++)pool.add(kinds[Math.floor(rnd()*unlocked)]);
 const fillers=i<16?'DST':i<32?'DSTHPJB':'DSTHPJGBRZ';
 const nFill=1+Math.floor(rnd()*3);for(let k=0;k<nFill;k++)pool.add(fillers[Math.floor(rnd()*fillers.length)]);
 const pat=i===0?'mixed':FUTURE_PATTERNS[Math.floor(rnd()*FUTURE_PATTERNS.length)];
 const hpMul=pat==='tank'?1.25:pat==='swarm'?0.85:1;
 return [FUTURE_STAGE_NAMES[i],Math.round((3500+i*360+i*i*25)*(1+ch*.65)*hpMul),boss,[...pool].join(''),pat];
}
STS.push(...[0,1,2].map(ch=>ST.map((_,i)=>makeFutureStage(ch,i))));
// 게임의 첫 스테이지가 한국인 순서를 유지: 한국에서는 멍뭉이/낼름이/놈놈놈/하마양, 성 공격 시 에일리언 멍뭉이 1마리만 등장.
for(let ch=3;ch<6;ch++){STS[ch][0][3]='DSTH';STS[ch][0][2]='a';STS[ch][1][3]='DST';STS[ch][1][2]='a';}



