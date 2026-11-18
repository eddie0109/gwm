// 건우 대전쟁 · 02b-steam-train.js
// 울트라 슈퍼 레어 "증기기관차 건우통" 전용 도트 그래픽과 모션.
// 모션: 이동(바퀴·연결봉 회전 + 연기) / 공격대기(들썩임 + 증기) / 공격(후퇴 → 돌진 → 충돌 → 복귀) / 히트백(번쩍 → 튕김)
// 기관차는 오른쪽을 보도록 그려지며, 아군(왼쪽으로 전진)은 좌우 반전해서 그립니다.
(function(){
'use strict';
const LW=200,LH=100,GYL=90,CX=95; // 로컬 캔버스 크기, 로컬 지면 높이, 유닛 중심 x
const mk=(w,h,o)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d',o)];};
const [,tlc]=mk(LW,LH,{willReadFrequently:true}),[cOut,toc]=mk(LW,LH),[cFl,tfc]=mk(LW,LH);
const cTl=tlc.canvas;
const fR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
const fD=(c,cx,cy,r,col)=>{c.fillStyle=col;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*0.6)c.fillRect(cx+x,cy+y,1,1);};
const fL=(c,x0,y0,x1,y1,col)=>{c.fillStyle=col;let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
  for(;;){c.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
const GLY={S:["###","#..","###","..#","###"],E:["###","#..","###","#..","###"],O:["###","#.#","#.#","#.#","###"],U:["#.#","#.#","#.#","#.#","###"],L:["#..","#..","#..","#..","###"],
'-':["...","...","###","...","..."],C:["###","#..","#..","#..","###"],H:["#.#","#.#","###","#.#","#.#"],M:["#...#","##.##","#.#.#","#...#","#...#"],P:["###","#.#","###","#..","#.."],
'&':[".#.","#.#",".#.","#.#","##."],R:["###","#.#","##.","#.#","#.#"],'2':["###","..#","###","#..","###"],
N:["#.#","###","###","#.#","#.#"],J:["..#","..#","..#","#.#","###"],A:[".#.","#.#","###","#.#","#.#"],G:["###","#..","#.#","#.#","###"],W:["#...#","#...#","#.#.#","##.##","#...#"],'6':["###","#..","###","#.#","###"],'7':["###","..#","..#","..#","..#"]};
// mirror=true: 기관차 전체가 좌우 반전돼 그려질 때 글자가 바르게 읽히도록 글자 상자 안에서 미리 뒤집어 둠
let textMirror=false;
function pxText(c,s,x,y,col,sc){sc=sc||1;c.fillStyle=col;
  let tw=0;for(const ch of s){const g0=GLY[ch];tw+=g0?(g0[0].length+1)*sc:2*sc;}tw-=sc;
  let cx=x;for(const ch of s){const g0=GLY[ch];if(!g0){cx+=2*sc;continue;}
  for(let j=0;j<5;j++)for(let i=0;i<g0[0].length;i++)if(g0[j][i]==='#'){const px=cx+i*sc;c.fillRect(textMirror?2*x+tw-sc-px:px,y+j*sc,sc,sc);}cx+=(g0[0].length+1)*sc;}}
// 지붕 위에 타고 있는 건우통
const CANG=["....KK....",".KKKKKKKK.","KSSSSSSSSK",".KBEPBEPK.",".KBBBBBBK.",".KBLBLBLK.",".KBBBBBBK.",".KBLBLBLK.","..KKKKKK.."];
const CANH=["....KK....",".KKKKKKKK.","KSSSSSSSSK",".KBKBBKBK.",".KBBBBBBK.",".KBLBLBLK.",".KBBBBBBK.",".KBLBLBLK.","..KKKKKK.."];
const CPAL={K:'#1b2430',B:'#5f7f99',S:'#c5d3de',L:'#eef3f7',E:'#ffffff',P:'#101010'};
// 폼별 탱크 색: 1형 무쇠 / 2형 붉은 특급
const SKINS={base:{G1:'#2e323c',G0:'#1d2027',G2:'#4b515f',G3:'#3d424f',CR:'#c9ced9'},red:{G1:'#8a2a22',G0:'#561812',G2:'#b84a3a',G3:'#a03a2c',CR:'#ffe27a'}};

function drawTrain(p){
  const c=tlc,gy=GYL,ang=p.ang,SK=SKINS[p.skin]||SKINS.base;textMirror=!!p.mirror;c.clearRect(0,0,LW,LH);c.save();c.translate(6,0);
  const R=(x,y,w,h,col)=>fR(c,x,y,w,h,col),D=(x,y,r,col)=>fD(c,x,y,r,col),L=(a,b,x,y,col)=>fL(c,a,b,x,y,col);
  const G1=SK.G1,G0=SK.G0,G2=SK.G2,BK='#12141a',BK2='#272b35',ST='#b9c0cc',ST2='#7a8496',BR='#8a8f9c',CR=SK.CR,WD='#7d8496',GL='#0b0e13',GS='#4b5568';
  R(6,gy-27,166,4,BK2);R(6,gy-27,166,1,'#5a6070');R(6,gy-23,166,2,BK);
  R(3,gy-27,4,3,ST);R(4,gy-30,3,9,BK2);
  R(160,gy-30,6,12,BK2);R(166,gy-26,8,3,ST);R(172,gy-29,2,9,ST2);R(163,gy-21,8,2,ST2);
  R(132,gy-24,16,16,BK2);R(132,gy-24,16,2,'#5a6070');R(132,gy-10,16,2,BK);R(146,gy-21,3,10,ST2);
  R(113,gy-51,40,26,BK);R(114,gy-51,38,1,'#5a6070');R(113,gy-50,40,3,BK2);R(113,gy-31,40,3,'#101216');R(113,gy-28,40,3,'#0c0d10');
  R(125,gy-51,2,26,BK2);R(141,gy-51,2,26,BK2);R(150,gy-51,4,26,'#2b303b');R(151,gy-47,1,18,'#4a505e');
  D(131,gy-37,4,BR);D(131,gy-37,2,'#4b515f');
  R(151,gy-56,3,5,BK2);R(152,gy-55,2,2,'#f6e7a0');
  R(128,gy-69,9,18,BK);R(128,gy-69,2,18,BK2);R(135,gy-69,2,18,'#101216');
  R(126,gy-71,13,3,BK2);R(126,gy-71,13,1,'#8a93a8');R(126,gy-53,13,2,BK2);
  R(48,gy-48,62,26,G1);R(48,gy-48,62,2,G2);R(48,gy-46,62,1,SK.G3);R(48,gy-26,62,4,G0);R(108,gy-48,2,26,G0);R(48,gy-48,1,26,G2);R(47,gy-49,64,1,BK2);
  for(let rx=51;rx<108;rx+=4){R(rx,gy-45,1,1,G2);R(rx,gy-24,1,1,G2);}
  R(58,gy-45,1,19,G0);R(100,gy-45,1,19,G0);
  pxText(c,'CHUNJAE',66,gy-42,CR);pxText(c,'GUNWOO',67,gy-34,CR);
  R(106,gy-49,11,2,G0);R(107,gy-58,9,10,G1);R(108,gy-59,7,1,G1);R(109,gy-60,5,1,G2);R(108,gy-58,2,9,G2);R(106,gy-53,11,1,BR);pxText(c,'67',108,gy-58,CR);
  R(79,gy-49,15,2,G0);R(80,gy-58,13,9,G1);R(79,gy-59,15,2,G0);R(81,gy-57,2,8,G2);R(86,gy-62,2,3,BK2);
  R(94,gy-52,34,1,ST2);R(100,gy-52,1,4,ST2);R(120,gy-52,1,4,ST2);
  R(9,gy-55,38,33,G1);R(9,gy-54,1,30,G2);R(46,gy-54,2,32,G0);R(9,gy-26,38,4,G0);
  R(48,gy-55,28,7,G1);R(48,gy-55,28,1,G2);R(75,gy-55,2,7,G0);
  D(65,gy-52,3,WD);D(65,gy-52,2,GL);R(69,gy-54,4,4,WD);R(70,gy-53,2,2,GL);
  R(31,gy-50,14,13,WD);R(32,gy-49,12,11,GL);R(33,gy-48,3,1,GS);R(34,gy-47,3,1,GS);R(38,gy-49,1,11,WD);
  R(22,gy-48,8,12,WD);R(23,gy-47,6,10,GL);R(24,gy-46,2,1,GS);
  R(21,gy-52,1,30,G0);R(30,gy-52,1,2,G0);
  pxText(c,'67',10,gy-36,CR,2);
  R(22,gy-21,8,2,BK2);R(24,gy-17,5,1,BK2);
  R(16,gy-61,60,1,G2);R(12,gy-60,66,1,G2);R(10,gy-59,68,2,G1);R(9,gy-57,69,2,G0);R(9,gy-55,69,1,BK);R(9,gy-62,6,1,G0);
  const wheel=(cx,cy,r,a,n,w)=>{D(cx,cy,r,BK);D(cx,cy,r-2,'#2b2f3a');D(cx,cy,r-3,'#3b4050');
    for(let k=0;k<n;k++){const q=a+k*Math.PI*2/n;L(cx,cy,cx+Math.round(Math.cos(q)*(r-3)),cy+Math.round(Math.sin(q)*(r-3)),'#8d93a3');}
    if(w)D(cx+Math.round(-Math.cos(a)*(r-5)),cy+Math.round(-Math.sin(a)*(r-5)),3,'#4a5062');
    D(cx,cy,Math.max(2,r-8),ST);D(cx,cy,1,BK2);R(cx-Math.round(r*0.55),cy-Math.round(r*0.75),2,1,'#cfd6e2');};
  wheel(41,gy-12,12,ang,10,1);wheel(75,gy-12,12,ang,10,1);wheel(110,gy-12,12,ang,10,1);wheel(149,gy-8,8,ang*1.5,6,0);
  const pin=x=>[x+Math.round(Math.cos(ang)*7),gy-12+Math.round(Math.sin(ang)*7)],pA=pin(41),pB=pin(75),pC=pin(110);
  L(pA[0],pA[1],pC[0],pC[1],ST);L(pA[0],pA[1]+1,pC[0],pC[1]+1,ST2);
  const dy=pC[1]-(gy-14),xc=pC[0]+Math.round(Math.sqrt(225-dy*dy));
  L(xc,gy-14,pC[0],pC[1],ST);L(xc,gy-13,pC[0],pC[1]+1,ST2);R(xc-2,gy-16,4,4,ST);R(116,gy-15,16,1,ST2);
  L(110+Math.round(Math.cos(ang+1.57)*4),gy-12+Math.round(Math.sin(ang+1.57)*4),124+Math.round(Math.cos(ang)*3),gy-24,ST2);
  L(124+Math.round(Math.cos(ang)*3),gy-24,134,gy-22,ST2);
  for(const q of [pA,pB,pC])D(q[0],q[1],2,'#cfd6e2');
  const cg=p.canHurt?CANH:CANG,s2=2,bx=46+(p.canDx||0),by=gy-61-9*s2+(p.canDy||0);
  cg.forEach((row,j)=>{for(let i=0;i<10;i++){const ch=row[i];if(ch!=='.')R(bx+i*s2,by+j*s2,s2,s2,CPAL[ch]);}});
  c.restore();
}
function outline(){ // 실루엣 바깥 1픽셀 자동 외곽선
  const a=tlc.getImageData(0,0,LW,LH),d=a.data,o=toc.createImageData(LW,LH),od=o.data;
  for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const i=(y*LW+x)*4;
    if(d[i+3]>40){od[i]=d[i];od[i+1]=d[i+1];od[i+2]=d[i+2];od[i+3]=255;}
    else if((x>0&&d[i-4+3]>40)||(x<LW-1&&d[i+4+3]>40)||(y>0&&d[i-LW*4+3]>40)||(y<LH-1&&d[i+LW*4+3]>40)){od[i]=14;od[i+1]=16;od[i+2]=20;od[i+3]=255;}}
  toc.putImageData(o,0,0);
}
function render(p){drawTrain(p);outline();
  if(p.flash>0){tfc.clearRect(0,0,LW,LH);tfc.globalCompositeOperation='source-over';tfc.drawImage(cOut,0,0);tfc.globalCompositeOperation='source-atop';
    tfc.fillStyle='rgba(255,255,255,'+(Math.min(1,p.flash)*0.85)+')';tfc.fillRect(0,0,LW,LH);tfc.globalCompositeOperation='source-over';return cFl;}
  return cOut;}

// 정지 아이콘(편성/뽑기/도감용). 테두리 여백을 잘라 (sx,sy,sw,sh)=(7,9,176,84) 영역만 그립니다.
const ICON_CACHE={};
function trainIcon(skin){
  if(ICON_CACHE[skin])return ICON_CACHE[skin];
  render({ang:0.7,skin});const cv=document.createElement('canvas');cv.width=176;cv.height=84;
  cv.getContext('2d').drawImage(cOut,7,9,176,84,0,0,176,84);ICON_CACHE[skin]=cv;return cv;
}
window.drawSteamTrainIcon=function(c,x,y,w,h,flip,skin){
  const ic=trainIcon(skin||'base');c.save();c.imageSmoothingEnabled=false;
  if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(ic,0,0,w,h);}else c.drawImage(ic,x,y,w,h);c.restore();
};

// ── 전투 중 모션: 유닛 상태(이동 mv / 공격 at / 히트백 kt)에서 기관차 동작을 계산
function addPuff(tr,u,f,lx,ly,r,vx,vy,life,gr,type){if(tr.P.length>60)return;tr.P.push({x:u.x+(lx-CX)*f,y:GY+ly,r,vx:vx*f,vy,life,max:life,g:gr||6,type:type||'s'});}
function enter(tr,u,f,s){
  tr.state=s;tr.st=0;tr.hitDone=false;tr.spawnT=0;
  if(s==='hit'){tr.flash=1;const cx=tr.off+138,cy=tr.bob-70;
    for(let i=0;i<3;i++)addPuff(tr,u,f,cx+i*2,cy,4,-34+i*10,-46+i*5,1.1,9);
    for(let i=0;i<8;i++){const q=Math.random()*6.28,x=tr.off+100,y=tr.bob-50;addPuff(tr,u,f,x+Math.cos(q)*10,y+Math.sin(q)*10,0,Math.cos(q)*50,Math.sin(q)*50-30,0.55+Math.random()*0.25,0,'k');}}
}
function step(tr,u,f,dt){
  let s=u.kt>0?'hit':u.at>0?'attack':u.mv?'move':'idle';
  if(u.fr>0){s='idle';dt=0;} // 정지 상태에서는 모션도 멈춤
  if(s!==tr.state)enter(tr,u,f,s);
  tr.st+=dt;tr.t+=dt;if(tr.flash>0)tr.flash-=dt*5;
  let o=0,sl=0,b=0;const ckx=tr.off+138,cky=tr.bob-70;
  if(s==='move'){
    tr.ang+=dt*8;b=Math.sin(tr.ang*2)>0.2?-1:0;
    if(Math.floor(tr.ang/Math.PI)!==Math.floor((tr.ang-dt*8)/Math.PI))addPuff(tr,u,f,ckx,cky,3,-46,-16,1.4,7);
  }else if(s==='idle'){
    b=Math.sin(tr.t*2.4)>0.45?1:0;tr.spawnT-=dt;
    if(tr.spawnT<0){tr.spawnT=0.8;addPuff(tr,u,f,ckx,cky,2,-6,-14,1.1,3);}
    if(Math.floor(tr.t/2.2)!==Math.floor((tr.t-dt)/2.2))for(let i=0;i<3;i++)addPuff(tr,u,f,tr.off+152,-10,2,26+i*8,-4-i*3,0.55,5);
  }else if(s==='attack'){const T=Math.max(0,(u.ad||1.3)-u.at)*(1.3/(u.ad||1.3));
    if(T<0.4){const k=T/0.4,e=1-(1-k)*(1-k);o=-12*e+(k>0.6?((Math.floor(T*50)%2)?1:-1):0);sl=-0.025*e;tr.ang-=dt*6;
      tr.spawnT-=dt;if(tr.spawnT<0){tr.spawnT=0.045;addPuff(tr,u,f,ckx,cky,3+Math.random()*2,-12-Math.random()*14,-34-Math.random()*14,0.9,9);}
    }else if(T<0.55){const k=(T-0.4)/0.15,e=k*k*k;o=-12+42*e;sl=0.015*e;tr.ang+=dt*45;
      if(T>=0.52&&!tr.hitDone){tr.hitDone=true;tr.impact={t:0};tr.flash=0.6;if(S&&typeof S.shake==='number')S.shake=Math.max(S.shake,0.18);
        for(let i=0;i<8;i++){const q=-1.2+i*0.35;addPuff(tr,u,f,o+184,-16,0,Math.cos(q)*70,Math.sin(q)*70-10,0.45,0,'k');}}
    }else if(T<0.78){const k=(T-0.55)/0.23;o=30-5*(1-(1-k)*(1-k));tr.ang+=dt*8*(1-k);}
    else{const k=Math.min(1,(T-0.78)/0.52),e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;o=25*(1-e);tr.ang-=dt*6*(1-k);}
  }else if(s==='hit'){const T=tr.st*2,k=Math.min(1,T/0.75); // 실제 밀려나는 거리는 전투 판정이 처리, 여기선 들림·번쩍임만
    sl=T<0.25?-0.16*Math.sin(T/0.25*Math.PI):-0.035*Math.sin((T-0.25)*14)*Math.exp(-(T-0.25)*5);
    b=-Math.round(Math.sin(Math.min(1,T/0.3)*Math.PI)*3);tr.ang-=dt*30*(1-k);
    tr.spawnT-=dt;if(tr.spawnT<0&&k<0.7){tr.spawnT=0.07;for(const dx of [47,155])addPuff(tr,u,f,dx,-2,2,-20+Math.random()*10,-10-Math.random()*8,0.5,8,'d');}
  }
  tr.off=o;tr.slope=sl;tr.bob=b;
  let cx=0,cy=0;tr.canHurt=false;
  if(s==='move')cy=Math.sin(tr.ang*2+1)>0.2?-1:0;
  else if(s==='idle')cy=Math.sin(tr.t*2.4+0.8)>0.45?1:0;
  else if(s==='attack'){const T=Math.max(0,(u.ad||1.3)-u.at)*(1.3/(u.ad||1.3));if(T<0.4)cx=-Math.round(2*Math.min(1,T/0.2));else if(T<0.55)cx=3;else if(T<0.78){cx=-2;cy=-1;}}
  else if(s==='hit'){const T=tr.st*2;cy=-Math.round(Math.sin(Math.min(1,T/0.35)*Math.PI)*5);cx=-Math.round(3*Math.min(1,T/0.15));tr.canHurt=T<0.6;}
  tr.canDx=cx;tr.canDy=cy;
  if(tr.impact){tr.impact.t+=dt;if(tr.impact.t>=0.45)tr.impact=null;}
  for(const p of tr.P){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.g*dt;if(p.type==='k')p.vy+=90*dt;}
  tr.P=tr.P.filter(p=>p.life>0);
}
function blit(c,src,x,y,sl,pivot){
  if(!sl){c.drawImage(src,x,y);return;}
  for(let i=0;i<LW;i++)c.drawImage(src,i,0,1,LH,x+i,y+Math.round((i-pivot)*sl),1,LH);
}
function drawParticles(c,P){
  for(const p of P){const a=p.life/p.max;
    if(p.type==='k'){const x=Math.round(p.x),y=Math.round(p.y);c.fillStyle=a>0.5?'#fff3a0':'#ffd23a';c.fillRect(x-2,y,5,1);c.fillRect(x,y-2,1,5);c.fillStyle='#fff';c.fillRect(x,y,1,1);}
    else{c.globalAlpha=Math.min(1,a*1.6);const col=p.type==='d'?(a>0.5?'#cdb99c':'#a8957a'):(a>0.66?'#ffffff':a>0.33?'#e4ecf6':'#c3d0e0');
      const r=Math.max(1,Math.round(p.r)),x=Math.round(p.x),y=Math.round(p.y);c.beginPath();c.fillStyle=col;c.arc(x,y,r,0,7);c.fill();c.globalAlpha=1;}}
}
// dsp()에서 호출: u는 전투 유닛, ft는 사망 연출 진행 시간(0이면 생존)
window.drawSteamTrainUnit=function(c,u,ft){
  const tm=S?S.t:0,f=u.team===0?-1:1,T=u.T,skin=T.trainSkin||'base';
  const tr=u._tr||(u._tr={state:'',st:0,t:Math.random()*3,ang:Math.random()*6,P:[],spawnT:0,hitDone:false,impact:null,flash:0,off:0,slope:0,bob:0,canDx:0,canDy:0,canHurt:false,lastT:tm});
  const dt=Math.max(0,Math.min(0.1,tm-tr.lastT));tr.lastT=tm;
  if(ft>0){for(const p of tr.P){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}tr.P=tr.P.filter(p=>p.life>0);}
  else step(tr,u,f,dt);
  const src=render({ang:tr.ang,canDx:tr.canDx,canDy:tr.canDy,canHurt:tr.canHurt,skin,mirror:f<0,flash:ft>0?0:tr.flash});
  c.save();c.imageSmoothingEnabled=false;
  if(ft>0){const p=ft/0.6;c.globalAlpha=Math.max(0,1-p);c.translate(u.x-f*p*90,GY-Math.sin(p*Math.PI)*40+p*30);c.rotate(-f*p*0.9);}
  else c.translate(u.x,GY);
  c.scale(f,1);
  if(ft===0){c.fillStyle='rgba(0,0,0,0.3)';c.fillRect(tr.off-CX+12,1,166,2);
    if(T.aura){c.save();c.globalAlpha=0.16+0.08*Math.sin(tm*6);c.fillStyle=T.aura;c.beginPath();c.ellipse(tr.off-CX+95,-44,96,44,0,0,7);c.fill();c.restore();}}
  if(u.at>0&&ft===0){const at=Math.max(0,(u.ad||1.3)-u.at)*(1.3/(u.ad||1.3));if(at>=0.36&&at<0.62){c.fillStyle='rgba(255,255,255,0.85)';
    for(let i=0;i<7;i++){const len=30+((i*13+Math.floor(at*60))%20);c.fillRect(tr.off-CX-len+14,tr.bob-64+i*9,len,1);}}}
  blit(c,src,tr.off-CX,-GYL+tr.bob,tr.slope,47);
  if(ft===0&&tr.impact){const k=tr.impact.t/0.45,x=tr.off-CX+184,y=-16;c.globalAlpha=1-k*0.6;const r=4+Math.round(k*28);
    c.fillStyle=k<0.4?'#fff':'#ffd23a';for(let a=0;a<48;a++){const q=a/48*Math.PI*2;c.fillRect(x+Math.round(Math.cos(q)*r),y+Math.round(Math.sin(q)*r*0.8),2,2);}
    for(let i=0;i<8;i++){const q=i*Math.PI/4+0.4,r0=3+k*6,r1=8+k*22;fL(c,x+Math.round(Math.cos(q)*r0),y+Math.round(Math.sin(q)*r0),x+Math.round(Math.cos(q)*r1),y+Math.round(Math.sin(q)*r1),i%2?'#fff4b0':'#ffb020');}
    c.globalAlpha=1;}
  c.restore();
  drawParticles(c,tr.P);
  if(ft===0&&u.fr>0){c.save();c.globalAlpha=0.35;c.fillStyle='#9bdfff';c.fillRect(u.x-90,GY-80,180,80);c.restore();}
  if(ft===0&&u.sl>0){c.save();c.globalAlpha=0.25;c.fillStyle='#4aa3ff';c.beginPath();c.ellipse(u.x,GY-40,90,44,0,0,7);c.fill();c.restore();}
};
})();
