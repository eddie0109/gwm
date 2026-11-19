// 건우 대전쟁 · 06c-math-chapter.js
// ════════ 수학편 (3장 · 각 24스테이지) ════════
// 내부 장 번호: CH 6·7·8. 적은 수학 기호 캐릭터, 각 장 마지막 보스는 필쌤(18-math-boss.js).
// 스테이지 배열: [이름, 성 기준 체력, 보스 코드, 적 구성, 출현 패턴, 출격 조건]
const MATH_CH0=6,isMathCH=c=>c>=MATH_CH0&&c<MATH_CH0+3;

// ── 수학 기호 적 도트 (오른쪽을 봐요) K 윤곽 / C 몸 / D 그림자 / H 하이라이트 / A 포인트 / E·P 눈 / W 흰색
const MATH_ART={
 '+':["....KKKK....","....KCCK....","....KCCK....","KKKKKCCKKKKK","KCCEPCCEPCCK","KCCCCWWCCCCK","KKKKKCCKKKKK","....KCCK....","....KCCK....","...KKKKKK...","...KK..KK..."],
 '-':["KKKKKKKKKKKK","KHHEPCCEPCCK","KCCCCCCCCCCK","KDDDCWWCDDDK","KKKKKKKKKKKK","..KK....KK..","..KK....KK.."],
 '×':["KKK......KKK","KCCK....KCCK",".KCCK..KCCK.","..KCCKKCCK..","...KEPEPK...","...KCAACK...","..KCCKKCCK..",".KCCK..KCCK.","KCCK....KCCK","KKK......KKK"],
 '÷':[".....KKK.....","....KAAAK....",".....KKK.....","KKKKKKKKKKKKK","KCCEPCCCEPCCK","KCCCCCWWCCCCK","KKKKKKKKKKKKK",".....KKK.....","....KAAAK....",".....KKK.....","...KK...KK..."],
 '=':["KKKKKKKKKKKKKK","KCCEPCCCCEPCCK","KHHCCCCCCCCCCK","KKKKKKKKKKKKKK","..............","KKKKKKKKKKKKKK","KCCCCCWWCCCCCK","KDDCCCCCCCCDDK","KKKKKKKKKKKKKK","..KKK....KKK.."],
 '%':["KKK.......KK","KAK......KCK","KKK.....KCK.",".......KCK..","......KEPK..",".....KCCK...","....KCK.....","...KCK......","..KCK...KKK.",".KCK....KAK.",".KK.....KKK."],
 '√':["......KKKKKKKK",".....KCCCCCCCK",".....KCKKKKKKK","....KCK.......","K..KCEPK......","KK.KCCK.......","KCKCCK........",".KCCCK........","..KCK.........","..KK.........."],
 'π':["KKKKKKKKKKKKKK","KCCCCCCCCCCCCK","KCEPCCCCCCEPCK","KKKCCKKKKCCKKK","...KCK..KCCK..","...KCK..KCCK..","..KCK...KCCK..","..KCK....KCCK.",".KCK.....KCCKK",".KK.......KKK."],
 '!':["..KKKK..",".KCCCCK.",".KEPEPK.",".KCCCCK.",".KCAACK.","..KCCK..","..KCCK..","..KKKK..","........","..KKKK..","..KCCK..","..KKKK.."],
 '∑':["KKKKKKKKKKKK","KCCCCCCCCCCK","KKKCCKKKKKKK","..KKCCK.....","....KCEPK...","....KCCK....","..KKCCK.....","KKKCCKKKKKKK","KCCCCCCCCCCK","KKKKKKKKKKKK",".KK......KK."],
 '∫':["......KKKK",".....KCCAK",".....KCKKK","....KCK...","....KEPK..","....KCCK..","....KCK...","...KCK....","KKKCCK....","KACCK.....","KKKK......"],
 '∞':[".KKKK....KKKK.","KCCCCK..KCCCCK","KCEPCCKKCCEPCK","KCCKKCCCCKKCCK","KCCKKCCCCKKCCK","KCCCCCKKCWWCCK","KCCCCK..KCCCCK",".KKKK....KKKK."]
};
// [이름, 체력, 공격, 속도, 사거리, 몸색, 크기, 모양(미사용), 포인트색]
const MATH_EN={
 '+':['플러스군',600,30,40,30,'#ff6b6b',3,'r','#ffffff'],
 '-':['마이너스양',350,20,55,25,'#6bb8ff',3,'r','#ffffff'],
 '×':['곱하기맨',1400,55,28,45,'#ffb43b',4,'r','#ffffff'],
 '÷':['나누기박사',1000,48,24,150,'#9d7bff',4,'r','#ffe066'],
 '=':['이퀄형제',4500,40,16,30,'#a0b4c8',4,'r','#ffffff'],
 '%':['퍼센트',1300,45,34,60,'#ff9ad0',4,'r','#7fd4ff'],
 '√':['루트선생',1800,95,18,240,'#9be36d',4,'r','#ffffff'],
 'π':['파이',2200,60,30,40,'#ffe066',4,'r','#ffffff'],
 '!':['팩토리얼',2600,180,22,35,'#ff5a4a',4,'r','#ffffff'],
 '∑':['시그마',9000,120,18,60,'#7fd4ff',5,'r','#ffffff'],
 '∫':['인테그랄',3500,80,36,120,'#ff8fa3',4,'r','#ffffff'],
 '∞':['인피니티',14000,150,26,90,'#ffe066',5,'r','#9a6bff']
};
const MATH_TY={'+':'무속성','-':'무속성','×':'레드','÷':'블랙','=':'메탈','%':'부유','√':'천사','π':'무속성','!':'레드','∑':'메탈','∫':'부유','∞':'천사'};
const MATH_AN={'+':'slash','-':'claw','×':'smash','÷':'beam','=':'smash','%':'claw','√':'beam','π':'slash','!':'burst','∑':'smash','∫':'beam','∞':'burst'};
const MATH_RW={'+':40,'-':30,'×':90,'÷':80,'=':150,'%':90,'√':140,'π':120,'!':180,'∑':400,'∫':200,'∞':600};
for(const k in MATH_EN){const e=MATH_EN[k];e[2]*=ATKM;EN[k]=e;ENTY[k]=[MATH_TY[k]];ENAN[k]=MATH_AN[k];ENR[k]=MATH_RW[k];ENEMY_ART[k]=MATH_ART[k];}
ENAR+='×∑∞%';ENEMY_FLOAT['∫']=1;

// ── 보스 필쌤 (업로드된 1·2·3장 시안 기준, 체력은 게임 밸런스를 위해 시안의 1/10)
// hitTimes: 공격 모션 시작 후 실제 피해가 들어가는 순간(초) — 모션의 기호 낙하·찌르기·참격파와 맞춤
const MATH_BOSSES={
 '①':{n:1,name:'필쌤 · 수학책',hp:100000,atk:3141,range:260,speed:6,cd:5.0,kb:2,area:true,rw:3000,
   note:'수학책을 타고 등장. 마법진을 그린 뒤 π·∑·∫ 기호 3개를 하늘에서 내리꽂는 범위 3연타'},
 '②':{n:2,name:'필쌤 · 빨간펜',hp:200000,atk:6283,range:200,speed:6,cd:4.5,kb:2,area:false,redPen:3,rw:5000,
   note:'칠판을 타고 적 앞까지 돌진해 5연속 찌르기. 맞은 아군은 3초 동안 공격력 50% 감소(빨간펜 채점)'},
 '③':{n:3,name:'필쌤 · 무한',hp:500000,atk:9999,range:330,speed:4,cd:6.0,kb:1,area:true,rw:9999,
   note:'메쓰칼리버를 세 번 휘둘러 π·∑ 참격파와 사거리 안 모두를 가르는 ∞ 대참격'}
};
for(const k in MATH_BOSSES){const b=MATH_BOSSES[k];EN[k]=[b.name,b.hp,b.atk,b.speed,b.range,'#7fa38a',6,'r','#e0aa1f'];ENTY[k]=['무속성'];ENAN[k]='pilssam';ENR[k]=b.rw;}
for(const k in MATH_BOSSES)EN_SPECIAL[k]={description:MATH_BOSSES[k].note};

// ── 출격 조건: 몇몇 스테이지에만 붙어요
const MATH_RULES={
 basic:{name:'기본 캐릭터만 출격',ok:u=>u.t==='N'},
 lowR:{name:'기본·레어 캐릭터만 출격',ok:u=>u.t==='N'||u.t==='R'},
 cheap:{name:'생산 비용 600원 이하만 출격',ok:u=>Math.round(fm(u).cost*1.5)<=600},
 five:{name:'편성 앞 5칸만 출격',slots:5},
 noBig:{name:'울트라 슈퍼 레어·EX 출격 금지',ok:u=>u.t!=='UR'&&u.t!=='EX'},
 area:{name:'범위 공격 캐릭터만 출격',ok:u=>!!fm(u).area},
 single:{name:'단일 공격 캐릭터만 출격',ok:u=>!fm(u).area}
};
const MATH_RULE_KEYS=Object.keys(MATH_RULES);
// 슬롯 k(편성 칸 번호)의 캐릭터 u가 현재 출격 조건을 만족하는지
function ruleAllows(rule,u,slot){const r=MATH_RULES[rule];if(!r||!u)return true;if(r.slots!=null&&slot>=r.slots)return false;return r.ok?r.ok(u):true;}

const MATH_STAGE_NAMES=[
 ['덧셈 마을','뺄셈 언덕','구구단 숲','나눗셈 강','분수 다리','소수점 동굴','짝수 들판','홀수 섬','약수 계곡','배수 탑','최대공약수 성','최소공배수 성','비와 비율 호수','백분율 시장','정비례 길','반비례 길','방정식 광장','부등식 사막','좌표 평면','일차함수 언덕','도형 공원','넓이 박물관','부피 창고','수학책 교실'],
 ['소인수분해 광산','제곱근 숲','무리수 해안','인수분해 공장','이차방정식 협곡','포물선 계곡','피타고라스 신전','삼각비 등대','원의 정원','확률 카지노','경우의 수 미로','대푯값 도서관','산포도 평원','지수 화산','로그 빙하','수열 계단','등차수열 철도','등비수열 탑','시그마 궁전','점화식 감옥','귀납법 다리','빨간펜 시험장','오답노트 서고','빨간펜 교무실'],
 ['극한 절벽','연속 고원','미분 폭포','접선 해안','증감 산맥','극대 극소 봉우리','변곡점 숲','적분 사막','넓이 분지','회전체 공방','정적분 신전','벡터 항로','행렬 미궁','복소수 차원','오일러 정원','무한급수 바다','수렴 소용돌이','발산 폭풍','집합의 탑','논리 미로','증명 법정','블랙홀 칠판','무한의 문','무한의 필쌤']
];
const MATH_ICONS=['➕','➖','✖️','➗','🟰','📐','📏','📊','🔢','🧮','💯','♾️'];
const MATH_KINDS=['+-×=÷π%','+-×÷=π%√!','×÷=π%√!∑∫∞'];
function makeMathStage(ch,i){
 const rnd=seededRand(77777*(ch+1)+i*104729+5);
 const kinds=MATH_KINDS[ch],unlocked=Math.min(kinds.length,2+Math.floor(i/3)),pool=new Set();
 pool.add(kinds[unlocked-1]);
 const n=2+Math.floor(rnd()*3);for(let k=0;k<n*3&&pool.size<n;k++)pool.add(kinds[Math.floor(rnd()*unlocked)]);
 const boss=i===23?['①','②','③'][ch]:i===11?['∑','!','∞'][ch]:'';
 const pat=i===0?'mixed':FUTURE_PATTERNS[Math.floor(rnd()*FUTURE_PATTERNS.length)];
 // 출격 조건: 3번째 스테이지부터 약 1/3 확률(스테이지마다 고정). 최종 보스 스테이지는 조건 없음.
 const rule=i>=3&&i!==23&&rnd()<0.36?MATH_RULE_KEYS[Math.floor(rnd()*MATH_RULE_KEYS.length)]:'';
 return [MATH_STAGE_NAMES[ch][i],Math.round((6000+i*700+i*i*30)*(1+ch*0.5)),boss,[...pool].join(''),pat,rule];
}
STS.push(...[0,1,2].map(ch=>Array.from({length:24},(_,i)=>makeMathStage(ch,i))));
if(STS.length!==9)throw Error('수학편 장 번호 오류: '+STS.length);
