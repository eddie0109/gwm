// 건우 대전쟁 · 18-math-boss.js
// 수학편 최종 보스 「필쌤」 (1장 수학책 · 2장 빨간펜 · 3장 무한의 필쌤)
// 아래 '원본' 구간은 업로드된 필쌤 모션 데모(1·2·3장)의 캐릭터 그리기 코드를 그대로 옮긴 것입니다.
// 벡터로 그린 뒤 고정 팔레트로 도트화(quantize)해서 픽셀아트로 만듭니다. 게임 연결부는 맨 아래에 있어요.
(function(){
'use strict';
const PX = 3;
/* ===== 원본 시작 ===== */
const OW = 600, OH = 540, OX = 300, OY = 456, FLOAT = 46;
const off = document.createElement('canvas'); off.width = OW/PX; off.height = OH/PX;
const oc = off.getContext('2d', {willReadFrequently:true});

const INK = '#1d1a16', SKIN = '#d9a47a', SKIN_D = '#b98660', STUB = '#c08c66', HAIR = '#2a211a', GOLD = '#e0aa1f';
const KO = {idle:'공격대기', walk:'이동', attack:'공격', hitback:'히트백'};

const clamp01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
const ease = t => { t = clamp01(t); return t*t*(3-2*t); };
const easeOut = t => 1 - Math.pow(1 - clamp01(t), 3);
const lerp = (a,b,t) => a + (b-a)*t;

/* ================= 장별 설정 ================= */
const CHS = {
  1: {
    title:'필쌤 1장 · 수학책의 필쌤', S:1.3, ride:'book',
    hood:['#7fa38a','#6b8f78','#5d7d69'], print:null, orbit:'tools3', lens:'#bfe0f0',
    sky:['#0b0820','#140f35','#1d1647','#2a1d57'], ground:['#5b4f86','#7a6daa','#4a3f72'], planet:'saturn',
    aura:['#ffd34d','#e0aa1f'], atk:2.0, dmg:'-3141', pillar:false, final:null, mode:'sky',
    strikes:[{t:0.85,x:640,ch:'π',col:'#ffe066'},{t:1.05,x:780,ch:'∑',col:'#7fd4ff'},{t:1.25,x:920,ch:'∫',col:'#ff8fa3'}],
    circle:'#ffffff',
    desc:'후드티 차림으로 하늘을 나는 수학책을 타고 등장. 칠판 마법진을 그린 뒤 거대한 수학 기호 3개를 하늘에서 내리꽂는다.',
    stats:[['속성','우주 · 수학 (보스)'],['체력','1,000,000'],['공격력','3,141 × 3연타 (범위)'],['사거리','720'],['이동 속도','매우 느림 (2)'],['공격 빈도','약 5초'],['넉백 횟수','2회'],['특수 능력','보스 충격파 · 공중 부유'],['등장 조건','적 성 체력 99% 이하']],
    motions:['<b>공격대기</b> — 한 손은 허리, 지시봉은 세워 들고 수학책 위에서 둥실둥실. 자·각도기·분필이 공전','<b>이동</b> — 몸을 기울여 책을 서핑하듯 타고 전진, 분필 가루가 흩날림','<b>공격</b> — 지시봉을 하늘로 치켜들면 마법진 3개 → 내리치면 π · ∑ · ∫ 낙하 + 충격파','<b>히트백</b> — 하얗게 번쩍, 책째로 튕겨 날아가 X자 눈'],
  },
  2: {
    title:'필쌤 2장 · 빨간펜 필쌤', S:1.45, ride:'board',
    hood:['#7fa38a','#6b8f78','#5d7d69'], print:null, orbit:'tools5', lens:'#bfe0f0',
    sky:['#14050c','#260a18','#3a1126','#4a1530'], ground:['#6b3a4f','#8c5068','#552c3e'], planet:'red',
    aura:['#ffd34d','#e0aa1f'], atk:2.0, dmg:'-6283', pillar:false, final:null, mode:'melee', hits:[0,1,2,3,4].map(i => 0.808 + i*0.12),
    strikes:[],
    circle:'#ff5a4a',
    desc:'날아다니는 칠판을 탄 각성 형태. 다리를 벌리고 몸을 숙인 채 지시봉을 칼처럼 겨누고 있다가, 적 앞까지 칠판을 타고 돌진해서 직접 5연속 찌르기를 날린다.',
    stats:[['속성','우주 · 수학 (보스)'],['체력','2,000,000'],['공격력','6,283 × 5연타 (근접 단일)'],['사거리','돌진 근접 (돌진 거리 약 400)'],['이동 속도','매우 느림 (2)'],['공격 빈도','약 4.5초'],['넉백 횟수','2회'],['특수 능력','보스 충격파 · 빨간펜 채점 (맞은 아군 공격력 50% ↓, 3초)'],['등장 조건','적 성 체력 99% 이하']],
    motions:['<b>공격대기</b> — 다리를 벌린 펜싱 자세로 지시봉을 앞으로 겨누고, 매서운 눈썹. 도구 5개가 공전','<b>이동</b> — 몸을 더 숙이고 칠판 아래 분필 불꽃을 뿜으며 전진','<b>공격</b> — 지시봉을 가슴까지 당겼다가 칠판을 타고 적 앞까지 돌진 → 직접 5연속 찌르기 (맞을 때마다 수학 기호가 튀어나옴) → 제자리로 복귀','<b>히트백</b> — 번쩍, 칠판째로 튕겨 날아감'],
  },
  3: {
    title:'필쌤 3장 · 무한의 필쌤', S:1.6, ride:'hole',
    hood:['#7fa38a','#6b8f78','#5d7d69'], print:null, orbit:'glyphs', lens:'#bfe0f0',
    sky:['#020208','#07051a','#0d0826','#120a2e'], ground:['#2c2550','#4b3f86','#221c40'], planet:'galaxy',
    aura:['#ffd34d','#e0aa1f'], atk:2.6, dmg:'-9999', pillar:false, final:null, mode:'swing', waves:[{t:0.56,ch:'π',col:'#ffe066'},{t:0.82,ch:'∑',col:'#7fd4ff'},{t:1.2,ch:'∞',col:'#ffe066',big:true}],
    strikes:[],
    circle:'#7ff0ff',
    desc:'강철 막대 무기 「메쓰칼리버」를 어깨에 걸치고 턱을 든 채 블랙홀 원반 위에 선 최종 형태. 메쓰칼리버를 두 손으로 세 번 크게 휘두르고, 휘두를 때마다 수학 기호가 담긴 참격파가 날아간다. 마지막 ∞ 참격파는 사거리 안의 적을 모두 친다.',
    stats:[['속성','우주 · 수학 (최종 보스)'],['체력','5,000,000'],['공격력','9,999 × 2 + ∞ 참격 (관통)'],['사거리','880'],['이동 속도','매우 느림 (1)'],['공격 빈도','약 6초'],['넉백 횟수','1회'],['무기','메쓰칼리버 (강철 막대)'],['특수 능력','참격파가 적을 관통 · 마지막 ∞ 참격은 화면 번쩍 + 충격파'],['등장 조건','적 성 체력 99% 이하']],
    motions:['<b>공격대기</b> — 메쓰칼리버를 어깨에 걸치고 턱을 든 채 넓게 버티고 섬. 수학 기호 5개가 공전','<b>이동</b> — 메쓰칼리버를 어깨에 멘 채 블랙홀 원반을 타고 전진','<b>공격</b> — 뒤로 낮게 젖혔다가 올려베기(π 참격) → 머리 위에서 내려찍기(∑ 참격) → 어깨 뒤로 크게 젖혀 한 바퀴 휘둘러 내려치기(거대 ∞ 참격) → 다시 어깨에 멤','<b>히트백</b> — 번쩍, 원반째로 튕겨 날아가고 메쓰칼리버가 휘청'],
  },
};
let CH = CHS[1], chNum = 1;

/* ================= 팔레트 (픽셀아트 색 고정) ================= */
const BASE = [INK,'#000000','#ffffff','#e6e6e6','#c8c8c8','#9aa0a8','#6c707a','#8f8a84',SKIN,SKIN_D,STUB,HAIR,
  '#3d5a87','#2f4870','#e05a47','#8b5a2b','#a0703c','#d94c4c','#6b1f1f','#d65a5a',
  '#ffe066','#7fd4ff','#ff8fa3','#9be36d','#bfe0f0','#fff0a0',GOLD,'#ffd34d','#9aa0b5','#2f5b3f','#7a3b2e','#fffaf0','#e8b04a','#c48a2c'];
const EXTRA = {
  1:['#bfe0f0','#fff0a0'],
  2:['#f2a39a','#ff8a3d','#e0482f','#ff5a4a','#3e2a1c','#22412d','#d9573f','#a8402f'],
  3:['#7ff0ff','#9a6bff','#c9a6ff','#4a2c8a','#2a1858','#0a0614','#e0d4ff','#3b8fa8'],
};
let PAL = [], cache = new Map();
const hexRgb = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
function buildPalette(){
  const cols = [...BASE, ...EXTRA[chNum], ...CH.hood, ...CH.sky, ...CH.ground, ...CH.aura];
  PAL = cols.map(hexRgb); cache = new Map();
}
function quantize(g, w, h, alphaCut){
  const id = g.getImageData(0,0,w,h), d = id.data;
  for (let i = 0; i < d.length; i += 4){
    if (alphaCut){ if (d[i+3] < 110){ d[i+3] = 0; continue; } d[i+3] = 255; }
    const key = ((d[i]>>2)<<12) | ((d[i+1]>>2)<<6) | (d[i+2]>>2);
    let v = cache.get(key);
    if (v === undefined){
      let best = 1e9;
      for (let k = 0; k < PAL.length; k++){
        const q = PAL[k], dr = d[i]-q[0], dg = d[i+1]-q[1], db = d[i+2]-q[2];
        const dist = dr*dr*0.3 + dg*dg*0.59 + db*db*0.11;
        if (dist < best){ best = dist; v = k; }
      }
      cache.set(key, v);
    }
    const q = PAL[v]; d[i] = q[0]; d[i+1] = q[1]; d[i+2] = q[2];
  }
  g.putImageData(id,0,0);
}

/* ================= 포즈 ================= */
// 장마다 기본 자세가 다름 (wa = 무기의 절대 각도)
const REST = {
  1: {armF:0.4, bendF:2.2, ptr:0.34, wa:null, armB:-0.9, bendB:1.9, lean:0,    brow:0,   legF:0,    legB:0,     chin:0},
  2: {armF:1.2, bendF:0.25, ptr:0,   wa:1.55, armB:-0.9, bendB:1.9, lean:0.06, brow:0.6, legF:0.18, legB:-0.14, chin:-0.04},
  3: {armF:0.3, bendF:2.5,  ptr:0,   wa:4.1,  armB:-0.15, bendB:0.25, lean:0,  brow:0.3, legF:0.2,  legB:-0.2,  chin:0.1},
};
function pose(state, t){
  const ATK = CH.atk, R = REST[chNum];
  const p = {bob:0, mouth:'flat', eyes:'open', flash:0, rot:0, dx:0, dy:0, tilt:0, glow:0,
             flutter:Math.sin(t*4)*2, ride:0, orbit:t*1.6, orbR:1, shake:0, time:t, dash:0, ...R};
  if (state === 'idle'){
    const s = Math.sin(t*2.4);
    p.bob = s*6; p.ride = Math.sin(t*2.4 + 0.8)*0.03;
    if (chNum === 1){ p.bendF = 2.2 - Math.max(0, Math.sin(t*3))*0.12; p.armB = -0.9 - s*0.03; }
    if (chNum === 2){ p.armF = 1.2 + Math.sin(t*2.4)*0.05; p.wa = 1.55 + Math.sin(t*4.8)*0.04; }
    if (chNum === 3){ p.wa = 4.1 + Math.sin(t*3)*0.05; p.bendF = 2.5 + Math.sin(t*3)*0.04; }
    if ((t % 3.1) < 0.13) p.eyes = 'blink';
  } else if (state === 'walk'){
    const c = t*4;
    p.bob = Math.sin(c)*5; p.ride = 0.06 + Math.sin(c)*0.03;
    p.flutter = Math.sin(t*10)*4;
    if (chNum === 1){ p.lean = 0.12; p.armF = 0.45 + Math.sin(c)*0.05; p.armB = -0.9 + Math.sin(c)*0.04; }
    if (chNum === 2){ p.lean = 0.16; p.armF = 1.25 + Math.sin(c)*0.04; }
    if (chNum === 3){ p.lean = 0.08; p.wa = 4.1 + Math.sin(c)*0.06; p.armB = -0.15 + Math.sin(c)*0.2; }
  } else if (state === 'attack'){
    p.bob = Math.sin(t*2.4)*3;
    if (chNum === 1){
      const a = 0.55, h = 0.75, b = 0.9;
      if (t < a){
        const e = ease(t/a);
        p.armF = lerp(0.4, Math.PI, e); p.bendF = lerp(2.2, 0.35, e); p.ptr = lerp(0.34, -0.35, e);
        p.armB = lerp(-0.9, -1.2, e); p.bendB = lerp(1.9, 0.3, e);
        p.lean = lerp(0, -0.1, e); p.mouth = 'grit'; p.brow = e; p.glow = e; p.orbR = lerp(1, 1.35, e); p.ride = lerp(0, -0.05, e);
      } else if (t < h){
        p.armF = Math.PI + Math.sin(t*60)*0.04; p.bendF = 0.35; p.ptr = -0.35; p.armB = -1.2; p.bendB = 0.3; p.lean = -0.1;
        p.mouth = 'grit'; p.brow = 1; p.glow = 1; p.orbR = 1.35; p.shake = 1.5; p.ride = -0.05;
      } else if (t < b){
        const e = easeOut((t-h)/(b-h));
        p.armF = lerp(Math.PI, 1.3, e); p.bendF = 0.35; p.ptr = lerp(-0.35, 0.5, e); p.armB = lerp(-1.2, -0.5, e); p.bendB = 0.3;
        p.lean = lerp(-0.1, 0.18, e); p.mouth = 'shout'; p.brow = 1; p.glow = 1; p.orbR = 1.35; p.ride = lerp(-0.05, 0.06, e);
      } else {
        const e = ease((t-b)/(ATK-b));
        p.armF = lerp(1.3, 0.4, e); p.bendF = lerp(0.35, 2.2, e); p.ptr = lerp(0.5, 0.34, e);
        p.armB = lerp(-0.5, -0.9, e); p.bendB = lerp(0.3, 1.9, e); p.lean = lerp(0.18, 0, e);
        p.mouth = e < 0.4 ? 'shout' : 'flat'; p.brow = 1-e; p.glow = 1-e; p.orbR = lerp(1.35, 1, e); p.ride = lerp(0.06, 0, e);
        if (t < 1.35) p.shake = 1;
      }
    } else if (chNum === 2){
      // 당겼다가 → 적 앞까지 돌진 → 직접 5연속 찌르기 → 제자리로
      if (t < 0.4){
        const e = ease(t/0.4);
        p.armF = lerp(1.2, -0.2, e); p.bendF = lerp(0.25, 1.7, e); p.lean = lerp(0.06, -0.1, e);
        p.mouth = 'grit'; p.brow = lerp(0.6, 1, e); p.glow = e; p.orbR = lerp(1, 1.35, e);
      } else if (t < 0.76){
        const e = ease((t - 0.4)/0.36);
        p.dash = e; p.armF = -0.2; p.bendF = 1.7; p.lean = lerp(-0.1, 0.22, e);
        p.legF = 0.45; p.legB = -0.35; p.flutter = Math.sin(t*30)*6;
        p.mouth = 'grit'; p.brow = 1; p.glow = 1; p.orbR = 1.35; p.ride = lerp(0, 0.1, e);
      } else if (t < 1.4){
        const ph = ((t - 0.76)/0.12) % 1;
        const e = ph < 0.4 ? easeOut(ph/0.4) : 1 - ease((ph - 0.4)/0.6);
        p.dash = 1; p.armF = lerp(0.5, 1.6, e); p.bendF = lerp(1.1, 0.05, e); p.lean = lerp(0.04, 0.24, e); p.wa = lerp(1.55, 1.95, e);
        p.legF = 0.32; p.legB = -0.22;
        p.mouth = 'shout'; p.brow = 1; p.glow = 1; p.orbR = 1.35; p.shake = 0.8; p.ride = 0.03*e;
      } else {
        const e = ease((t - 1.4)/(ATK - 1.4));
        p.dash = 1 - e; p.armF = lerp(0.5, 1.2, e); p.bendF = lerp(1.1, 0.25, e); p.lean = lerp(-0.08, 0.06, e);
        p.mouth = 'flat'; p.brow = lerp(1, 0.6, e); p.glow = 1 - e; p.orbR = lerp(1.35, 1, e);
      }
    } else {
      // 메쓰칼리버 휘두르기: 올려베기 → 내려찍기 → 머리 위 크게 한 바퀴 휘둘러 내려치기
      // [시간, 어깨, 팔꿈치, 무기각도, 기울기, 휘두르는 구간인지]
      const K = [
        [0.00, 0.3, 2.5, 4.10,  0.00, 0],
        [0.45,-0.6, 0.4, 5.00, -0.12, 0],
        [0.62, 1.9, 0.2, 8.68,  0.14, 1],
        [0.72, 2.4, 0.3, 9.42,  0.00, 0],
        [0.88, 1.0, 0.15,7.50,  0.18, 1],
        [1.02, 2.7, 0.4,10.68, -0.12, 0],
        [1.08, 2.7, 0.4,10.68, -0.12, 0],
        [1.25, 1.2, 0.1, 7.85,  0.25, 1],
        [1.90, 1.2, 0.1, 7.85,  0.18, 0],
        [2.60, 0.3, 2.5,10.38,  0.00, 0],
      ];
      let i = 0; while (i < K.length - 2 && t >= K[i+1][0]) i++;
      const A = K[i], B = K[i+1];
      const q = (t - A[0])/(B[0] - A[0]);
      const e = B[5] ? easeOut(q) : ease(q);
      p.armF = lerp(A[1], B[1], e); p.bendF = lerp(A[2], B[2], e); p.wa = lerp(A[3], B[3], e); p.lean = lerp(A[4], B[4], e);
      p.armB = p.armF - 0.25; p.bendB = p.bendF;
      p.legF = 0.3; p.legB = -0.3; p.chin = 0;
      const swinging = B[5] === 1;
      p.mouth = swinging || (t > 1.25 && t < 1.9) ? 'shout' : t < 1.9 ? 'grit' : 'flat';
      p.brow = t < 1.9 ? 1 : 0.3;
      p.glow = t < 0.45 ? t/0.45 : t < 1.9 ? 1 : 1 - (t - 1.9)/0.7;
      p.orbR = lerp(1, 1.35, clamp01(p.glow));
      if (t > 1.02 && t < 1.08) p.shake = 1.8;
      if (t > 1.2 && t < 1.45) p.shake = 1.2;
      p.ride = swinging ? 0.06 : 0;
    }
  } else if (state === 'hitback'){
    p.eyes = 'x'; p.mouth = 'o'; p.orbR = 1.5; p.chin = 0;
    if (t < 0.12) p.flash = 1;
    if (t < 0.55){
      const q = t/0.55;
      p.dx = -140*easeOut(q); p.dy = -Math.sin(q*Math.PI)*60;
      p.rot = -0.45*Math.sin(q*Math.PI); p.ride = 0.2*Math.sin(q*Math.PI); p.tilt = 0.4;
      p.armF = 2.4 + Math.sin(t*25)*0.3; p.armB = -2.5; p.bendF = 0.35; p.bendB = 0.3; p.ptr = 0.5; p.wa = null;
      p.legF = 0.5; p.legB = 0.2;
    } else if (t < 0.75){
      const q = (t-0.55)/0.2;
      p.dx = -140 - 14*easeOut(q); p.dy = -Math.sin(q*Math.PI)*12;
      p.rot = -0.06*Math.sin(q*Math.PI); p.ride = -0.08*Math.sin(q*Math.PI*2); p.tilt = 0.35;
      p.armF = 1.2; p.armB = -1.0; p.bendF = 0.35; p.bendB = 0.3; p.ptr = 0.5; p.wa = null;
    } else {
      const q = ease((t-0.75)/0.25);
      p.dx = -154; p.tilt = lerp(0.35, 0, q); p.orbR = lerp(1.5, 1, q);
      p.eyes = q < 0.6 ? 'dizzy' : 'open'; p.mouth = q < 0.6 ? 'wobble' : 'flat';
      p.armF = lerp(1.2, R.armF, q); p.bendF = lerp(0.35, R.bendF, q); p.armB = lerp(-1.0, R.armB, q); p.bendB = lerp(0.3, R.bendB, q);
      if (R.wa === null){ p.ptr = lerp(0.5, R.ptr, q); p.wa = null; }
      else p.wa = lerp(2.05, R.wa, q);
      p.chin = lerp(0, R.chin, q);
    }
  }
  if (p.wa !== null) p.ptr = p.wa - p.armF - p.bendF;
  return p;
}

/* ================= 캐릭터 그리기 ================= */
function limb(g, x1, y1, x2, y2, col, w){
  g.lineCap = 'round';
  g.strokeStyle = INK; g.lineWidth = w + 6;
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  g.strokeStyle = col; g.lineWidth = w;
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
}
const seg = (x, y, a, len) => [x + Math.sin(a)*len, y + Math.cos(a)*len];

function drawLeg(g, hx, back, ang){
  const fx = hx + 4 + Math.sin(ang || 0)*56, fy = -2;
  limb(g, hx, -58, fx, fy - 4, back ? '#2f4870' : '#3d5a87', 13);
  g.fillStyle = back ? '#e6e6e6' : '#ffffff'; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.roundRect(fx - 8, fy - 10, 26, 11, 5); g.fill(); g.stroke();
  g.fillStyle = '#e05a47'; g.fillRect(fx + 1, fy - 8, 9, 3);
}

function drawArm(g, sx, sy, a, bend, back, ptr){
  const [ex, ey] = seg(sx, sy, a, 25);
  const [hx, hy] = seg(ex, ey, a + bend, 23);
  const sleeve = back ? CH.hood[1] : CH.hood[0];
  limb(g, sx, sy, ex, ey, sleeve, 14);
  limb(g, ex, ey, hx, hy, sleeve, 13);
  if (ptr !== null){
    const pa = a + bend + ptr;
    if (chNum === 3){
      // 메쓰칼리버: 굵은 강철 막대
      const [tx, ty] = seg(hx, hy, pa, 128);
      const [bx, by] = seg(hx, hy, pa + Math.PI, 18);
      limb(g, bx, by, tx, ty, '#9aa0a8', 12);
      const [ox, oy] = [Math.cos(pa)*-3, Math.sin(pa)*3];
      g.strokeStyle = '#e6e6e6'; g.lineWidth = 3; g.lineCap = 'butt';
      g.beginPath(); g.moveTo(bx + ox, by + oy); g.lineTo(tx + ox, ty + oy); g.stroke();
      [0.45, 0.62, 0.8].forEach(f => {
        const [mx, my] = seg(hx, hy, pa, 128*f);
        g.save(); g.translate(mx, my); g.rotate(-pa);
        g.fillStyle = f === 0.62 ? GOLD : '#6c707a'; g.strokeStyle = INK; g.lineWidth = 2.5;
        g.beginPath(); g.rect(-9, -3, 18, 6); g.fill(); g.stroke(); g.restore();
      });
      g.fillStyle = '#6c707a'; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.arc(tx, ty, 9, 0, Math.PI*2); g.fill(); g.stroke();
      g.beginPath(); g.arc(bx, by, 7, 0, Math.PI*2); g.fill(); g.stroke();
    } else {
      const [tx, ty] = seg(hx, hy, pa, 56);
      limb(g, hx, hy, tx, ty, '#8b5a2b', 5);
      g.fillStyle = '#ffffff'; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.arc(tx, ty, 6, 0, Math.PI*2); g.fill(); g.stroke();
    }
  }
  g.fillStyle = SKIN; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.arc(hx, hy, 7.5, 0, Math.PI*2); g.fill(); g.stroke();
}

function hoodiePath(g, f){
  g.beginPath();
  g.moveTo(-20,-132); g.quadraticCurveTo(-36,-128,-37,-108);
  g.lineTo(-38 - f*0.5,-50); g.quadraticCurveTo(-38,-44,-30,-44);
  g.lineTo(32,-44); g.quadraticCurveTo(40,-44,39 + f*0.3,-50);
  g.lineTo(37,-108); g.quadraticCurveTo(36,-128,20,-132); g.closePath();
}
const STAR_DOTS = Array.from({length:14}, (_, i) => [-32 + ((i*23)%66), -124 + ((i*37)%72)]);
function drawHoodie(g, f){
  const [c0, c1, c2] = CH.hood;
  g.fillStyle = c1; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.ellipse(-16,-131,15,9,-0.3,0,Math.PI*2); g.fill(); g.stroke();
  hoodiePath(g, f); g.fillStyle = c0; g.fill();
  g.save(); hoodiePath(g, f); g.clip();
  g.fillStyle = c1; g.fillRect(-45,-125,12,85);          // 그림자
  g.fillStyle = c2; g.fillRect(-45,-53,90,10);            // 밑단 시보리
  if (CH.print === 'chalk'){
    g.strokeStyle = '#ffffff'; g.lineWidth = 2.5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-6,-118); g.lineTo(28,-104); g.moveTo(-4,-104); g.quadraticCurveTo(8,-114,20,-96); g.stroke();
    g.beginPath(); g.arc(-22,-100,6,0,Math.PI*2); g.stroke();
  } else if (CH.print === 'stars'){
    g.fillStyle = '#ffffff';
    STAR_DOTS.forEach(([x,y], i) => g.fillRect(x, y, i%3 ? 3 : 5, i%3 ? 3 : 5));
    g.fillStyle = '#7ff0ff'; g.fillRect(-45,-56,90,3);
  }
  g.restore();
  hoodiePath(g, f); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  // 캥거루 주머니
  g.fillStyle = c1; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-18,-57); g.lineTo(-12,-80); g.lineTo(22,-80); g.lineTo(28,-57); g.closePath(); g.fill(); g.stroke();
  // 목 라인 + 끈
  g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-10,-131); g.quadraticCurveTo(2,-122,14,-131); g.stroke();
  g.strokeStyle = '#ffffff'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-2,-126); g.lineTo(-4,-106); g.moveTo(8,-126); g.lineTo(9,-108); g.stroke();
}

function drawHead(g, p){
  limb(g, 0, -136, 2, -128, SKIN, 13);
  g.save();
  g.translate(2,-134); g.rotate(-p.tilt*0.35 - p.chin); g.translate(-2,134);
  // 귀
  g.fillStyle = SKIN; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.ellipse(-23,-163,6,9,0,0,Math.PI*2); g.fill(); g.stroke();
  // 얼굴 (살짝 네모)
  const face = () => { g.beginPath(); g.roundRect(-23,-196,53,63,[14,14,11,11]); };
  face(); g.fillStyle = SKIN; g.fill();
  g.save(); face(); g.clip();
  g.fillStyle = STUB; g.fillRect(-25,-147,60,16);          // 수염 자국 (턱 그늘)
  g.fillStyle = SKIN; g.fillRect(-2,-147,20,10);           // 입 주변은 밝게
  g.restore();
  face(); g.strokeStyle = INK; g.lineWidth = 3.2; g.stroke();
  // 머리카락
  g.fillStyle = HAIR; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-25,-160); g.quadraticCurveTo(-31,-199,2,-201); g.quadraticCurveTo(33,-201,31,-176);
  g.quadraticCurveTo(22,-186,14,-183); g.quadraticCurveTo(6,-190,-4,-185); g.quadraticCurveTo(-15,-183,-18,-169);
  g.lineTo(-19,-156); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#8f8a84'; g.fillRect(-20,-184,8,4);       // 흰머리 한 줌
  drawEyes(g, p);
  // 눈썹
  const bd = p.brow*4;
  g.strokeStyle = HAIR; g.lineWidth = 4.5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-16,-176); g.lineTo(-2,-174+bd); g.moveTo(11,-174+bd); g.lineTo(27,-177); g.stroke();
  // 코
  g.strokeStyle = INK; g.lineWidth = 2.8;
  g.beginPath(); g.moveTo(8,-158); g.quadraticCurveTo(16,-149,9,-146); g.stroke();
  drawMouth(g, p.mouth);
  // 둥근 안경
  g.save();
  g.translate(4,-162); g.rotate(p.tilt*0.5); g.translate(-4,162 - p.tilt*4);
  let lens = CH.lens;
  if (p.glow > 0.5) lens = '#fff0a0';
  g.fillStyle = lens; g.strokeStyle = INK; g.lineWidth = 3.2;
  [[-6.5,-162],[18.5,-162]].forEach(([x,y]) => { g.beginPath(); g.arc(x,y,9.5,0,Math.PI*2); g.fill(); g.stroke(); });
  g.beginPath(); g.moveTo(3,-163); g.lineTo(9,-163); g.moveTo(-16,-163); g.lineTo(-24,-161); g.stroke();
  // 렌즈 안의 눈
  g.fillStyle = INK;
  g.strokeStyle = INK; g.lineWidth = 2.6;
  [[-6.5,-162],[18.5,-162]].forEach(([x,y]) => drawEye(g, x + 1, y, p));
  g.fillStyle = '#ffffff';
  g.fillRect(-12,-168,3,3); g.fillRect(13,-168,3,3);       // 반짝
  g.restore();
  g.restore();
}
function drawEyes(){ /* 눈은 안경 안에서 그림 */ }
function drawEye(g, x, y, p){
  if (p.eyes === 'open'){ g.fillRect(x-2, y-2.5, 4, 5); }
  else if (p.eyes === 'blink'){ g.beginPath(); g.moveTo(x-4,y); g.lineTo(x+4,y); g.stroke(); }
  else if (p.eyes === 'x'){ g.beginPath(); g.moveTo(x-3.5,y-3.5); g.lineTo(x+3.5,y+3.5); g.moveTo(x+3.5,y-3.5); g.lineTo(x-3.5,y+3.5); g.stroke(); }
  else if (p.eyes === 'dizzy'){ g.beginPath(); g.arc(x,y,4,0,Math.PI*1.5); g.stroke(); }
}

function drawMouth(g, m){
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = 'round';
  if (m === 'flat'){ g.beginPath(); g.moveTo(0,-139); g.lineTo(16,-139); g.stroke(); }
    else if (m === 'grit'){
    g.fillStyle = '#ffffff'; g.beginPath(); g.rect(-1,-144,18,8); g.fill(); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(-1,-140); g.lineTo(17,-140); g.stroke();
  } else if (m === 'shout'){
    g.fillStyle = '#6b1f1f'; g.beginPath(); g.ellipse(8,-139,9,8,0,0,Math.PI*2); g.fill(); g.stroke();
    g.fillStyle = '#ffffff'; g.fillRect(1,-146,14,4);
    g.fillStyle = '#d65a5a'; g.fillRect(4,-136,8,3);
  } else if (m === 'o'){
    g.fillStyle = '#6b1f1f'; g.beginPath(); g.ellipse(8,-139,4.5,6,0,0,Math.PI*2); g.fill(); g.stroke();
  } else if (m === 'wobble'){
    g.beginPath(); g.moveTo(0,-139); for (let i = 1; i <= 4; i++) g.lineTo(i*4, -139 + (i%2 ? -3 : 3)); g.stroke();
  }
}

/* --- 탈것 --- */
function drawBook(g){
  g.fillStyle = '#7a3b2e'; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.rect(-76, 2, 152, 16); g.fill(); g.stroke();
  g.fillStyle = GOLD; g.fillRect(-60, 8, 120, 4);
  g.fillStyle = '#fffaf0';
  g.beginPath(); g.moveTo(-72, 4); g.quadraticCurveTo(-36, -10, 0, 1); g.quadraticCurveTo(36, -10, 72, 4); g.lineTo(72, 6); g.lineTo(-72, 6); g.closePath();
  g.fill(); g.stroke();
}
function drawBoard(g, t){
  // 칠판 아래 분필 불꽃
  const fl = 10 + Math.sin(t*30)*4;
  [[-50],[50]].forEach(([x]) => {
    g.fillStyle = '#ff8a3d'; g.beginPath(); g.moveTo(x-9, 18); g.lineTo(x, 18 + fl*2); g.lineTo(x+9, 18); g.closePath(); g.fill();
    g.fillStyle = '#ffe066'; g.beginPath(); g.moveTo(x-4, 18); g.lineTo(x, 18 + fl); g.lineTo(x+4, 18); g.closePath(); g.fill();
  });
  g.fillStyle = '#8b5a2b'; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.rect(-86, -2, 172, 22); g.fill(); g.stroke();
  g.fillStyle = '#2f5b3f'; g.fillRect(-79, 3, 158, 12);
  g.strokeStyle = '#ffffff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-70, 9); g.lineTo(-40, 9); g.moveTo(-30, 6); g.lineTo(-10, 12); g.moveTo(-10, 6); g.lineTo(-30, 12); g.moveTo(5, 9); g.lineTo(40, 9); g.moveTo(50, 6); g.lineTo(70, 12); g.stroke();
}
function drawHole(g, t){
  g.fillStyle = '#4a2c8a'; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.ellipse(0, 10, 98, 20, 0, 0, Math.PI*2); g.fill(); g.stroke();
  g.fillStyle = '#2a1858'; g.beginPath(); g.ellipse(0, 10, 72, 14, 0, 0, Math.PI*2); g.fill();
  g.strokeStyle = '#9a6bff'; g.lineWidth = 3;
  for (let k = 0; k < 4; k++){
    const a0 = t*3 + k*Math.PI/2;
    g.beginPath(); g.ellipse(0, 10, 86 - k*6, 17 - k, 0, a0, a0 + 1.1); g.stroke();
  }
  g.fillStyle = '#0a0614'; g.beginPath(); g.ellipse(0, 10, 34, 7, 0, 0, Math.PI*2); g.fill();
  g.strokeStyle = '#7ff0ff'; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 10, 34, 7, 0, 0, Math.PI*2); g.stroke();
}

/* --- 공전 도구 --- */
function drawTool(g, k, x, y, sc){
  g.save(); g.translate(x, y); g.scale(sc, sc);
  g.strokeStyle = INK; g.lineWidth = 3;
  if (CH.orbit === 'glyphs'){
    const ch = ['π','∑','∞','√','∫'][k];
    g.font = 'bold 26px "Times New Roman",serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 6; g.strokeText(ch, 0, 0);
    g.fillStyle = k % 2 ? '#7fd4ff' : '#ffe066'; g.fillText(ch, 0, 0);
  } else if (k % 3 === 0){        // 각도기
    g.fillStyle = '#7fd4ff';
    g.beginPath(); g.arc(0, 6, 16, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
  } else if (k % 3 === 1){        // 삼각자
    g.fillStyle = '#ffe066';
    g.beginPath(); g.moveTo(-12, 12); g.lineTo(14, 12); g.lineTo(-12, -16); g.closePath(); g.fill(); g.stroke();
  } else {                        // 분필
    g.rotate(0.6);
    g.fillStyle = '#ffffff'; g.beginPath(); g.rect(-14, -5, 28, 10); g.fill(); g.stroke();
    g.fillStyle = '#ff8fa3'; g.fillRect(5, -3.5, 8, 7);
  }
  g.restore();
}
function drawOrbit(g, p, front){
  const n = CH.orbit === 'tools3' ? 3 : 5;
  const R = CH.orbit === 'glyphs' ? 88 : 80;
  for (let k = 0; k < n; k++){
    const a = p.orbit + k*Math.PI*2/n;
    const depth = Math.sin(a);
    if ((depth > 0) !== front) continue;
    drawTool(g, k, Math.cos(a)*R*p.orbR, -150 + depth*20 - (p.orbR - 1)*30, 0.85 + depth*0.15);
  }
}

/* --- 오라 (픽셀 광선) --- */
function drawAura(g, p){
  if (p.glow <= 0.05) return;
  const n = 14, cx = 4, cy = -140;
  g.save(); g.translate(cx, cy); g.rotate(p.time*0.6);
  for (let k = 0; k < n; k++){
    const a = k*Math.PI*2/n, len = (70 + (k%2)*30)*p.glow + 40;
    g.fillStyle = k%2 ? CH.aura[1] : CH.aura[0];
    g.beginPath(); g.moveTo(Math.cos(a-0.12)*30, Math.sin(a-0.12)*30); g.lineTo(Math.cos(a)*(30+len), Math.sin(a)*(30+len)); g.lineTo(Math.cos(a+0.12)*30, Math.sin(a+0.12)*30); g.closePath(); g.fill();
  }
  g.restore();
}

function drawChar(g, p){
  g.save();
  g.translate(0, p.bob);
  g.translate(0,-60); g.rotate(p.rot); g.translate(0,60);
  if (p.shake) g.translate(Math.round((Math.random()-0.5)*p.shake)*3, 0);
  drawAura(g, p);
  drawOrbit(g, p, false);
  g.save(); g.translate(0,8); g.rotate(p.ride); g.translate(0,-8);
  if (CH.ride === 'book') drawBook(g); else if (CH.ride === 'board') drawBoard(g, p.time); else drawHole(g, p.time);
  const upper = fn => { g.save(); g.translate(0,-60); g.rotate(p.lean); g.translate(0,60); fn(); g.restore(); };
  drawLeg(g, -8, true, p.legB);
  upper(() => drawArm(g, -14, -118, p.armB, p.bendB, true, null));
  drawLeg(g, 8, false, p.legF);
  upper(() => { drawHoodie(g, p.flutter); drawHead(g, p); drawArm(g, 16, -118, p.armF, p.bendF, false, p.ptr); });
  g.restore();
  drawOrbit(g, p, true);
  g.restore();
}

function renderToOff(p){
  oc.setTransform(1,0,0,1,0,0);
  oc.clearRect(0,0,off.width,off.height);
  oc.setTransform(1/PX,0,0,1/PX,0,0);
  oc.save(); oc.translate(OX,OY); oc.scale(CH.S,CH.S); drawChar(oc,p); oc.restore();
  oc.setTransform(1,0,0,1,0,0);
  quantize(oc, off.width, off.height, true);
  if (p.flash > 0){
    oc.save(); oc.globalCompositeOperation = 'source-atop';
    oc.fillStyle = '#ffffff'; oc.fillRect(0,0,off.width,off.height); oc.restore();
  }
}

/* ===== 원본 끝 ===== */

// ── 게임 연결부 ─────────────────────────────────────────────
// 원본 좌표(데모 1008px 화면) → 게임 좌표 배율. off 캔버스 1px을 게임에서 K배로 그립니다.
const K = 1.35, F = K/PX;
const PALS = {};
function useChapter(n){
  if (chNum === n && PAL.length) return;
  chNum = n; CH = CHS[n];
  if (!PALS[n]){ buildPalette(); PALS[n] = {PAL, cache}; } else { PAL = PALS[n].PAL; cache = PALS[n].cache; }
}
// 게임 판정용 타이밍: 공격 모션 길이와, 실제 피해가 들어가는 순간(초)
const ATTACK_INFO = {
  1: {ad:2.0, hits:[1.03, 1.23, 1.43]},                    // π · ∑ · ∫ 낙하 착지
  2: {ad:2.0, hits:[0,1,2,3,4].map(i => 0.808 + i*0.12)},  // 5연속 찌르기
  3: {ad:2.6, hits:[0.66, 0.92, 1.38]}                     // π · ∑ 참격 + ∞ 대참격
};
const SYM_COL = ['#ffe066','#7fd4ff','#ff8fa3','#9be36d','#ffe066'];
function puff(b, x, y, vx, vy, life, r, col){ if (b.dust.length < 90) b.dust.push({x, y, vx, vy, life, max:life, r, col}); }
// 공격 타임라인에 맞춘 이펙트 (실제 피해는 14-battle-logic.js의 hitTimes로 처리)
function attackFx(b, u, n, t, gx){
  const R = u.T.range;
  if (n === 1){
    if (!b.fired.has('c') && t >= 0.3){ b.fired.add('c'); CHS[1].strikes.forEach((s, i) => b.circles.push({x:u.x + R*(0.45 + 0.25*i), age:0, life:s.t - 0.2, col:CHS[1].circle})); }
    CHS[1].strikes.forEach((s, i) => { if (!b.fired.has(i) && t >= s.t){ b.fired.add(i); b.strikes.push({x:u.x + R*(0.45 + 0.25*i), y:-30, ch:s.ch, col:s.col, landed:false, age:0}); } });
  } else if (n === 2){
    CHS[2].hits.forEach((ht, i) => { if (!b.fired.has(i) && t >= ht){ b.fired.add(i);
      const tx = gx + 62, ty = GY - 70; b.shake = 0.15;
      for (let k = 0; k < 10; k++) puff(b, tx, ty, (Math.random() - 0.2)*160, (Math.random() - 0.6)*160, 0.5, Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? '#ffffff' : '#ffe066');
      b.bits.push({x:tx, y:ty, vx:60 + Math.random()*60, vy:-150 - Math.random()*60, ch:['π','∑','∫','√','∞'][i], col:SYM_COL[i], life:0.8});
      b.bursts.push({x:tx, y:ty, age:0}); } });
  } else {
    CHS[3].waves.forEach((w, i) => { if (!b.fired.has(i) && t >= w.t){ b.fired.add(i);
      b.waves.push({x:gx + 40, y:GY - (w.big ? 62 : 56), ch:w.ch, col:w.col, big:!!w.big, vx:w.big ? 280 : 330, end:u.x + R + 60});
      if (w.big){ b.flash = 0.12; b.shake = 0.45; } } });
  }
}
function stepFx(b, dt){
  b.circles.forEach(c => c.age += dt); b.circles = b.circles.filter(c => c.age < c.life);
  for (const s of b.strikes){ s.age += dt;
    if (!s.landed){ s.y += 900*dt; if (s.y >= GY - 16){ s.y = GY - 16; s.landed = true; s.age = 0; b.shake = 0.25;
      b.rings.push({x:s.x, age:0, col:s.col});
      for (let k = 0; k < 16; k++) puff(b, s.x + (Math.random() - 0.5)*12, GY - 2, (Math.random() - 0.5)*160, -Math.random()*140, 0.7, Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? '#ffffff' : s.col); } } }
  b.strikes = b.strikes.filter(s => !s.landed || s.age < 0.45);
  b.rings.forEach(r => r.age += dt); b.rings = b.rings.filter(r => r.age < 0.6);
  b.bursts.forEach(r => r.age += dt); b.bursts = b.bursts.filter(r => r.age < 0.25);
  for (const w of b.waves) w.x += w.vx*dt; b.waves = b.waves.filter(w => w.x < w.end);
  for (const d of b.dust){ d.x += d.vx*dt; d.y += d.vy*dt; d.vy += 260*dt; d.life -= dt; if (d.y > GY){ d.y = GY; d.vy *= -0.3; d.vx *= 0.6; } }
  b.dust = b.dust.filter(d => d.life > 0);
  for (const q of b.bits){ q.x += q.vx*dt; q.y += q.vy*dt; q.vy += 380*dt; q.life -= dt; } b.bits = b.bits.filter(q => q.life > 0);
  b.shake = Math.max(0, b.shake - dt); b.flash = Math.max(0, b.flash - dt);
}
function sym(c, ch, x, y, size, col, lw){
  c.font = 'bold ' + size + 'px "Times New Roman","Cambria Math",serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.lineJoin = 'round'; c.strokeStyle = INK; c.lineWidth = lw; c.strokeText(ch, x, y); c.fillStyle = col; c.fillText(ch, x, y);
}
function drawFx(c, b){
  for (const cc of b.circles){ const grow = easeOut(cc.age/0.35), R = 22*grow;
    c.save(); c.translate(cc.x, GY - 2); c.scale(1, 0.3);
    c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.setLineDash([7,5]); c.lineDashOffset = -cc.age*40;
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI*2); c.stroke(); c.setLineDash([]);
    c.strokeStyle = cc.col; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, R*0.7, 0, Math.PI*2); c.stroke(); c.restore();
    if (grow > 0.5){ c.fillStyle = cc.col; for (let y = 0; y < GY - 10; y += 10) c.fillRect(cc.x - 1, y, 2, 4); } }
  for (const r of b.rings){ const q = r.age/0.6, R = 8 + 46*easeOut(q);
    c.save(); c.translate(r.x, GY - 1); c.scale(1, 0.3); c.strokeStyle = r.col; c.lineWidth = 5*(1 - q) + 2;
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI*2); c.stroke(); c.restore(); }
  for (const s of b.strikes){
    if (!s.landed){ c.fillStyle = '#ffffff'; c.fillRect(s.x - 1.5, 0, 3, Math.max(0, s.y - 18)); }
    else { const k = 1 - s.age/0.45; c.fillStyle = '#ffffffcc'; c.fillRect(s.x - 8*k, 0, 16*k, GY); }
    if (!(s.landed && s.age > 0.3)) sym(c, s.ch, s.x, s.y, 40, s.col, 6);
  }
  for (const w of b.waves){ const R = w.big ? 55 : 26;
    c.save(); c.translate(w.x, w.y); c.lineCap = 'butt';
    c.strokeStyle = INK; c.lineWidth = w.big ? 16 : 9; c.beginPath(); c.arc(-R*0.4, 0, R, -1.05, 1.05); c.stroke();
    c.strokeStyle = '#ffffff'; c.lineWidth = w.big ? 12 : 6; c.beginPath(); c.arc(-R*0.4, 0, R, -1.0, 1.0); c.stroke();
    c.strokeStyle = w.col; c.lineWidth = w.big ? 5 : 3; c.beginPath(); c.arc(-R*0.4 - 3, 0, R, -0.9, 0.9); c.stroke();
    c.fillStyle = '#ffffff'; for (let k = 0; k < 4; k++) c.fillRect(-R*0.4 - 22 - k*15, -R*0.6 + k*R*0.4, 13 - k*2, 2);
    sym(c, w.ch, R*0.15, 0, w.big ? 62 : 24, w.col, w.big ? 6 : 4); c.restore(); }
  for (const r of b.bursts){ const q = r.age/0.25; c.save(); c.translate(r.x, r.y); c.fillStyle = '#ffffff';
    for (let k = 0; k < 8; k++){ c.rotate(Math.PI/4); c.fillRect(4 + q*8, -1, 7*(1 - q) + 2, 2); } c.restore(); }
  for (const d of b.dust) if (d.life > 0.08){ c.fillStyle = d.col; c.fillRect(Math.round(d.x), Math.round(d.y), d.r, d.r); }
  for (const q of b.bits) sym(c, q.ch, q.x, q.y, 18, q.col, 3);
}
// 전투 유닛(u)에서 필쌤 모션 계산 + 그리기. ft>0이면 사망 연출.
function drawUnit(c, u, ft){
  const n = u.T.pilssam; useChapter(n);
  const now = S ? S.t : 0;
  const b = u._pb || (u._pb = {t:0, last:now, hb:9, wasKt:false, atkOn:false, fired:new Set(), dash:0,
    circles:[], strikes:[], rings:[], bursts:[], waves:[], dust:[], bits:[], shake:0, flash:0});
  let dt = Math.max(0, Math.min(0.1, now - b.last)); b.last = now;
  if (u.fr > 0 && ft === 0) dt = 0; // 정지 상태에서는 모션도 멈춤
  b.t += dt;
  if (u.kt > 0 && !b.wasKt) b.hb = 0; b.wasKt = u.kt > 0; b.hb += dt;
  let state = 'idle', t = b.t;
  if (ft === 0 && u.at > 0){
    t = Math.max(0, (u.ad || CH.atk) - u.at)*(CH.atk/(u.ad || CH.atk)); state = 'attack';
    if (!b.atkOn){ b.atkOn = true; b.fired = new Set();
      // 2장: 칠판을 타고 가장 가까운 적 앞까지 돌진
      let best = 1e9; for (const o of S.units) if (o.team !== u.team && o.hp > 0){ const d = o.x - u.x; if (d > -10 && d < best) best = d; }
      b.dash = n === 2 ? Math.max(0, Math.min(u.T.range, best) - 70) : 0; }
    attackFx(b, u, n, t, u.x + (n === 2 ? b.dash : 0));
  } else { b.atkOn = false;
    if (b.hb < 1){ state = 'hitback'; t = b.hb; } else if (u.mv){ state = 'walk'; } }
  stepFx(b, dt);
  if (b.shake > 0 && typeof S.shake === 'number') S.shake = Math.max(S.shake, b.shake*0.6);
  const p = pose(state, Math.min(t, state === 'attack' ? CH.atk : state === 'hitback' ? 1 : t));
  p.dx = 0; p.shake = 0; // 실제 밀려남은 전투 판정이 처리
  if (state !== 'attack') p.orbit = b.t*1.6;
  if (u.hf > 0 && ft === 0) p.flash = 1;
  renderToOff(p);
  const gx = u.x + (p.dash || 0)*b.dash;
  const gy = GY - FLOAT*F + p.dy*F;
  c.save(); c.imageSmoothingEnabled = false;
  if (ft > 0){ const q = ft/0.6; c.globalAlpha = Math.max(0, 1 - q); c.translate(-q*100, -Math.sin(q*Math.PI)*40 + q*30); }
  else { c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.ellipse(gx, GY + 2, 34, 4, 0, 0, Math.PI*2); c.fill();
    c.globalAlpha = 0.16 + 0.06*Math.sin(now*5); c.fillStyle = '#ff3a2a'; c.beginPath(); c.ellipse(gx, GY - 60, 70, 66, 0, 0, 7); c.fill(); c.globalAlpha = 1; }
  c.drawImage(off, Math.round(gx - (OX/PX)*K), Math.round(gy - (OY/PX)*K), Math.round(off.width*K), Math.round(off.height*K));
  c.restore();
  if (ft === 0){
    drawFx(c, b);
    if (b.flash > 0){ c.save(); c.globalAlpha = Math.min(1, b.flash*6); c.fillStyle = '#ffffff'; c.fillRect(-50, -50, 900, 400); c.restore(); }
    if (u.fr > 0){ c.save(); c.globalAlpha = 0.35; c.fillStyle = '#9bdfff'; c.fillRect(gx - 50, GY - 150, 100, 150); c.restore(); }
    txt(u.T.name + ' (BOSS)', gx, GY - FLOAT*F - 205*CH.S*F - 8, 13);
  }
}
// 적도감·목록용 정지 아이콘
const ICONS = {};
function icon(n){
  if (ICONS[n]) return ICONS[n];
  useChapter(n); const p = pose('idle', 0.4); p.orbit = 0.5; renderToOff(p);
  const cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
  const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
  g2.drawImage(off, 40, 40, 120, 125, 0, 0, 96, 100);
  return ICONS[n] = cv;
}
window.PILSSAM = {draw:drawUnit, icon, info:ATTACK_INFO, title:n => CHS[n].title, desc:n => CHS[n].desc};
})();
