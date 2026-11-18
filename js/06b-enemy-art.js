// 건우 대전쟁 · 06b-enemy-art.js
// 적마다 고유 도트 모델. (오른쪽을 봐요) K 윤곽 / C 몸 / D 그림자 / H 하이라이트 / A 포인트색 / E·P 눈 / W 흰색 / Y·R·O 고정색
// 미래편 에일리언은 같은 동물 계열이라도 안테나·갑옷·뿔 등 장식을 붙여 구분합니다.
const EART={
DOG:["..........KK..",".........KAK..","....KKKKKKAAK.","...KHHCCCCCCK.","..KHCCCCCEPCKK","..KCCCCCCCCCWK","KKKCCCCCCCCKPK","KCKCCCCCCCCCK.",".KCCCCDDCCCK..","..KCCCCCCCCK..","..KCDKKKKDCK..","..KKK....KKK.."],
SNAKE:["..........KKKK..",".........KCCEPK.","........KCCCCCWK","........KCCKKKKR","..KKKK..KCCK...R",".KCHHCK.KCCK....","KCCAACCKKCCK....","KCCKKCCCCCK.....","KDCK.KDDDK......",".KK...KKK......."],
HIPPO:["....KK......KK..","...KCCKKKKKKCCK.","..KHHCCCCCCCCCCK",".KHCCCCCCCEPCCCK","KCCCCCCCCCCCCAAK","KCCCCCCCCCCCKWWK","KCCCCCCCCCCCCAAK","KDCCCCCCCCCCCCK.",".KDDDDDDDDDDDK..",".KCCK.KCCK.KCCK.",".KKKK.KKKK.KKKK."],
PIG:["..K.......K...",".KAK.....KAK..",".KCCKKKKKCCK..","KHHCCCCCCCCCK.","KHCCCCCCEPCCKK","KCCCCCCCCCCKAAK","KCCCCCCCCCCKPAK","KCCCCCCCCCCKAAK","KDCCCCCCCCCCKK.",".KDDDDDDDDDK...",".KCK.KCK.KCK...",".KKK.KKK.KKK..."],
PENGUIN:["...KKKKK...","..KCCCCCK..",".KCCCWEPK..",".KCCCWWWYYK",".KCCWWWWKK.","KCCWWWWWWK.","KCCWWWWWWK.","KCKWWWWWWK.",".KCWWWWWK..","..KYYKYYK..","..KKK.KKK.."],
GORILLA:["....KKKKK.....","...KCCCCCK....","..KCCHHCCCK...","..KCCAAEPAK...","..KCCAAAAAK...",".KKCCKAAAK....","KCCCCCKKKCCK..","KCCDCCCCCCCCK.","KCCKDCCCCCKCCK","KAAKDCCCCDKAAK",".KK.KCCKCCK.KK","....KDDKDDK...","....KKK.KKK..."],
SHEEP:["..KK.KK.KK....",".KWWKWWKWWK...","KWWWWWWWWWWKK.","KWWHWWWWWKCCK.","KWWWWWWWWKCEPK","KWWWWWWWWKCCCK",".KWWWWWWWWKAK.","..KWWKWWWKKK..","..KCCK.KCCK...","..KKK..KKK...."],
CROC:["........KK.KK.....",".......KEPKEPK....","KK....KCCCCCCKKKKK","KCK..KCCCCCCCCCCCK",".KCKKCHHCCCCCCWKWK",".KCCCCCCCCCCCCCCCK","..KCCCCCCCCCKKKKK.","..KDAADAADDK......","..KCK..KCK........","..KKK..KKK........"],
SEAL:["........KKKK...",".......KCCCCK..","......KCCEPCCK.","......KCCCCCAAK",".....KCCCCCCWK.","....KHCCCCCKK..","...KHCCCCCCK...","KK.KCCCCCCCCK..","KCKCCDDCCCCCK..",".KCCDDDDCCCCK..","..KKKKKKKKKK..."],
BOAR:["..K...........K.",".KAK.KKKKKKK.KAK","..KKKCCCCCCCKKK.",".KCCCCCCCCCEPCK.","KHCCCCCCCCCCCAAK","KCCCCCCCCCCCAWAK","KCCCCCCCCCCCKWK.","KDCCCCCCCCCCK...",".KDDDDDDDDDK....",".KCK.KCK.KCK....",".KKK.KKK.KKK...."],
KANGA:["......KK.....",".....KCK.KK..","....KCCKKCK..","....KCCCCCCK.","....KCCCEPCK.","....KCCCCCAAK","...KCCCCCKKK.","..KCCWWCCK...","..KCCWWCKRRK.",".KCCCWWCKRRK.","KCKCCCCCK....","KK.KCCCCK....","...KDDKDDK...","..KKKKKKKKK.."],
SQUIRREL:["KKK............","KAAK.....K.K...","KAAAK...KCKCK..","KAAAAK..KCCCCK.",".KAAAK.KCCEPCK.",".KAAAAKKCCCCCAK","..KAAAKCCCCCKK.","...KAAKCCWWCK..","....KKKCCWWCK..",".....KCCCCCCK..",".....KDDKKDDK..",".....KKK..KKK.."],
MOTH:["..K..........K..","...K..KKKK..K...","KKKKKKCCCCKKKKKK","KAAAAKCEPCKAAAAK","KAHHAKCCCCKAHHAK","KAAAAKCCCCKAAAAK",".KAAKKCCCCKKAAK.","..KKAKCDDCKAKK..","....KKCDDCKK....","......KCCK......",".......KK......."],
RHINO:["...............W..","..KK..........KWK.",".KCCKKKKKKKKKKCWK.","KHHCCCCCCCCCCCCWWK","KHCCCCCCCCCCEPCCCK","KCCCCCCCCCCCCCCCWK","KCCCCCCCCCCCCCKKK.","KDCCCCCCCCCCCCK...",".KDDDDDDDDDDDK....",".KCCK.KCCK.KCCK...",".KKKK.KKKK.KKKK..."],
BEAR:[".KK......KK...","KAAKKKKKKAAK..","KAKCCCCCCKAK..",".KCHCCCCCCCK..",".KCCEPCCEPCK..",".KCCCCAACCCK..",".KCCCKPPKCCK..","KKCCCCWWCCCKK.","KCKCCCCCCCKCK.","KCKCAAAAACKCK.",".KKCAAAAACKK..","..KCCCKCCCK...","..KDDK.KDDK...","..KKK..KKK...."],
BUNNY:["..KK...KK...",".KCAK.KCAK..",".KCAK.KCAK..",".KCAK.KCAK..","..KCKKKCK...",".KHCCCCCCK..","KHCEPCCEPCK.","KCCCCAACCCK.","KCCCCWWCCCK.",".KCCCCCCCK..",".KCWWWWWCK..","KCCWWWWWCCK.",".KDCCCCCDK..","..KDK.KDK...","..KKK.KKK..."],
BIRD:[".......KKKK....","......KCCCCK...",".....KCCCEPKYY.",".....KCCCCCKYYK","KK..KCCCCCK.KK.","KAKKCCCCCCK....","KAAKHHCCCCK....",".KAAKHCCCCCK...","..KAAAKCCCCK...","...KKKKDDDK....","......KYKYK....","......KK.KK...."],
BLOB:["....KKKKKK....","..KKHHCCCCKK..",".KHCCCCCCCCCK.","KHCCEPCCCEPCCK","KCCCCCCCCCCCCK","KCCKKKKKKKKCCK","KCKWKWKWKWKKCK","KCKAAAAAAAAKCK","KCKWKWKWKWKKCK","KCCKKKKKKKKCCK",".KDCCCCCCCCDK.","..KKDDDDDDKK..","...KK....KK..."]
};
const ENEMY_ART={
 D:EART.DOG,S:EART.SNAKE,H:EART.HIPPO,P:EART.PIG,J:EART.PENGUIN,G:EART.GORILLA,B:EART.SHEEP,R:EART.CROC,Z:EART.SEAL,
 L:EART.BOAR,K:EART.KANGA,Q:EART.SQUIRREL,M:EART.MOTH,N:EART.RHINO,X:deco(EART.BEAR,['crown']),U:EART.BUNNY,Y:deco(EART.BUNNY,['crown','cape']),
 a:deco(EART.DOG,['antenna']),b:deco(EART.HIPPO,['antenna']),c:deco(CRAB,['antenna']),d:deco(EART.SEAL,['antenna','spikes']),e:EART.BLOB,
 f:deco(EART.BLOB,['spikes','antenna','horns']),g:deco(EART.BEAR,['antenna']),h:deco(EART.CROC,['antenna']),i:deco(EART.SQUIRREL,['antenna']),
 j:deco(EART.BIRD,['crown']),k:deco(EART.RHINO,['armor','antenna']),l:deco(EART.BLOB,['ring','antenna','wings']),m:deco(EART.KANGA,['antenna']),
 n:deco(EART.RHINO,['armor','spikes']),o:deco(EART.SHEEP,['antenna','crown']),p:deco(EART.BLOB,['crown','antenna','cape']),q:deco(EART.BIRD,['wings','armor']),
 r:deco(SQUID,['antenna']),s:deco(EART.SHEEP,['horns','antenna']),t:deco(EART.BUNNY,['spikes','flame']),v:deco(EART.BEAR,['armor','antenna']),
 z:deco(EART.BIRD,['horns','flame','wings'])
};
const ENEMY_FLOAT={M:1,j:1,l:1,q:1,z:1};
const enemyGrid=code=>ENEMY_ART[code]||TPL[EN[code]&&EN[code][7]]||TPL.r;
// 피격 순간 하얗게 번쩍이는 팔레트
const FLASH_PAL={C:'#ffffff',D:'#e8eef6',H:'#ffffff',A:'#ffffff',B:'#ffffff',S:'#ffffff',L:'#ffffff',M:'#ffffff',N:'#dfe6ef',Y:'#ffffff',O:'#ffffff',R:'#ffffff',W:'#ffffff',E:'#ffffff',P:'#8892a0',K:'#5b6574'};
// 새 모델은 예전 12칸 모델보다 커서, 화면 크기가 예전과 비슷하도록 배율을 맞춥니다 (보스 비율은 유지)
const ENEMY_ART_W={};
function enemyScale(code,s){const g0=ENEMY_ART[code];if(!g0)return s;const w=ENEMY_ART_W[code]||(ENEMY_ART_W[code]=Math.max(...g0.map(r=>r.length)));
  return Math.max(2,Math.round(s*13/Math.max(13,w)));}
