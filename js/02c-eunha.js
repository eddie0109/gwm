// 건우 대전쟁 · 02c-eunha.js
// 울트라 슈퍼 레어 「은하」: 업로드된 스프라이트 시트(assets/eunha_sprite.png, 200×180 칸)를 2배로 그리고,
// 그 위에 성운 빛·공전하는 별·별가루 꼬리·별자리 선·운석 궤적·빛기둥 섬광·충격파를 덧입힙니다.
// 행 0 공격대기(8) / 행 1 이동(8) / 행 2 공격(16, 11번 칸 착탄) / 행 3 히트백(10). 원본은 왼쪽을 바라봄(아군 방향).
(function(){
'use strict';
const META={fw:200,fh:180,ax:100,ay:152,anims:{idle:{row:0,n:8,fps:8,loop:true},walk:{row:1,n:8,fps:10,loop:true},attack:{row:2,n:16,fps:12,hit:11},hitback:{row:3,n:10,fps:12}}};
const SC=2;                        // 게임 표시 배율
const IMPACT_X=-60;                // 운석 착탄 지점 (기준점 기준, 원본 px)
const ATK_T=META.anims.attack.n/META.anims.attack.fps, HIT_T=META.anims.attack.hit/META.anims.attack.fps;
window.EUNHA_TIMING={attack:ATK_T,hit:HIT_T,impact:-IMPACT_X*SC};
const img=new Image();img.src='assets/eunha_sprite.png';
const ready=()=>img.complete&&img.naturalWidth>0;
function frame(c,anim,f,x,y,s,flip){
  const a=META.anims[anim];c.save();c.imageSmoothingEnabled=false;
  if(flip){c.translate(x,y);c.scale(-1,1);c.drawImage(img,f*META.fw,a.row*META.fh,META.fw,META.fh,-META.ax*s,-META.ay*s,META.fw*s,META.fh*s);}
  else c.drawImage(img,f*META.fw,a.row*META.fh,META.fw,META.fh,x-META.ax*s,y-META.ay*s,META.fw*s,META.fh*s);
  c.restore();
}
// 아이콘: 공격대기 첫 칸의 은하 부분만 (원본 bbox 75..158 × 85..157)
window.drawEunhaIcon=function(c,x,y,w,h,flip){
  if(!ready()){c.fillStyle='#6a5cff';c.beginPath();c.ellipse(x+w/2,y+h/2,w/2.2,h/3,-0.3,0,7);c.fill();img.addEventListener('load',()=>{},{once:true});return;}
  c.save();c.imageSmoothingEnabled=false;
  const g=c.createRadialGradient(x+w/2,y+h/2,2,x+w/2,y+h/2,w/1.6);g.addColorStop(0,'#b9a8ff66');g.addColorStop(1,'#b9a8ff00');c.fillStyle=g;c.fillRect(x,y,w,h);
  if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(img,74,84,86,74,0,0,w,h);}else c.drawImage(img,74,84,86,74,x,y,w,h);
  c.restore();
};
window.EUNHA_IMG=img;
// ── 덧입히는 효과 (가산 혼합)
const STAR_COLS=['#ffffff','#ffe27a','#b9d8ff','#d9b8ff'];
function twinkle(c,x,y,r,col,a){c.globalAlpha=a;c.fillStyle=col;c.fillRect(x-r,y-0.5,r*2,1);c.fillRect(x-0.5,y-r,1,r*2);c.fillRect(x-1,y-1,2,2);}
function addP(st,p){if(st.P.length<140)st.P.push(p);}
function step(st,u,dt,state,t,f,fwd){ // fwd: 앞쪽 x 방향(아군 -1, 상대 +1)
  // 공전하는 별 + 핵 맥박은 그리기에서 시간으로 처리. 여기서는 입자 생성/이동.
  if(state==='walk'){st.trail-=dt;if(st.trail<0){st.trail=0.03;addP(st,{x:u.x-fwd*(40+Math.random()*50),y:GY-50-Math.random()*40,vx:-fwd*(20+Math.random()*40),vy:-6+Math.random()*12,life:0.9,max:0.9,k:'dust',col:STAR_COLS[(Math.random()*4)|0]});}}
  if(state==='attack'){
    const ix=u.x+fwd*(-IMPACT_X)*SC;
    if(f>=8&&f<=10&&!st.met[f]){st.met[f]=1; // 운석 3개: 하늘에서 비스듬히 낙하
      for(let k=0;k<2;k++)addP(st,{x:ix+(Math.random()-0.5)*70-fwd*90,y:-20-Math.random()*40,vx:fwd*(150+Math.random()*60),vy:420+Math.random()*80,life:0.32,max:0.32,k:'met',col:k?'#ffe27a':'#9fd8ff'});}
    if(f===11&&!st.boom){st.boom=1;st.flash=0.18;st.pillar=0.45;st.ring.push({x:ix,t:0},{x:ix,t:-0.08});
      if(S&&typeof S.shake==='number')S.shake=Math.max(S.shake,0.35);
      for(let k=0;k<34;k++){const a=Math.random()*Math.PI*2,v=80+Math.random()*220;addP(st,{x:ix,y:GY-12,vx:Math.cos(a)*v,vy:Math.sin(a)*v*0.6-60,life:0.7+Math.random()*0.4,max:1.1,k:'spark',col:STAR_COLS[k%4],g:260});}
      for(let k=0;k<10;k++)addP(st,{x:ix+(Math.random()-0.5)*60,y:GY-10,vx:(Math.random()-0.5)*50,vy:-20-Math.random()*30,life:1.2,max:1.2,k:'smoke',r:10+Math.random()*12});}
  } else {st.met={};st.boom=0;}
  if(state==='hitback'&&!st.hbFx){st.hbFx=1;for(let k=0;k<20;k++){const a=Math.random()*Math.PI*2;addP(st,{x:u.x-fwd*34,y:GY-64,vx:Math.cos(a)*120,vy:Math.sin(a)*90-30,life:0.6,max:0.6,k:'spark',col:STAR_COLS[k%4],g:180});}}
  if(state!=='hitback')st.hbFx=0;
  for(const p of st.P){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.g)p.vy+=p.g*dt;if(p.k==='met'&&p.y>GY-14)p.life=0;if(p.k==='smoke')p.r+=14*dt;}
  st.P=st.P.filter(p=>p.life>0);
  st.ring.forEach(r=>r.t+=dt);st.ring=st.ring.filter(r=>r.t<0.8);
  st.flash=Math.max(0,st.flash-dt);st.pillar=Math.max(0,st.pillar-dt);
}
function drawBack(c,u,st,tm,cx,cy,state){ // 은하 뒤: 성운 빛 + 뒤쪽 공전 별
  c.save();c.globalCompositeOperation='lighter';
  const pulse=0.75+0.25*Math.sin(tm*3.1),R=state==='attack'?120:95;
  let g=c.createRadialGradient(cx,cy,4,cx,cy,R);g.addColorStop(0,'rgba(190,170,255,'+(0.38*pulse)+')');g.addColorStop(0.45,'rgba(110,90,255,'+(0.16*pulse)+')');g.addColorStop(1,'rgba(40,20,120,0)');
  c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,R,R*0.62,-0.3,0,7);c.fill();
  g=c.createRadialGradient(cx+30,cy-10,2,cx+30,cy-10,60);g.addColorStop(0,'rgba(120,220,255,'+(0.15*pulse)+')');g.addColorStop(1,'rgba(120,220,255,0)');c.fillStyle=g;c.fillRect(cx-40,cy-80,140,140);
  c.restore();
  orbit(c,tm,cx,cy,false);
}
function orbit(c,tm,cx,cy,front){
  c.save();c.globalCompositeOperation='lighter';
  for(let k=0;k<9;k++){const a=tm*(0.7+k*0.05)+k*0.7,dep=Math.sin(a);if((dep>0)!==front)continue;
    const rx=70+(k%3)*12,ry=26+(k%3)*5,x=cx+Math.cos(a)*rx,y=cy+dep*ry-(k%2)*6,tw=0.5+0.5*Math.sin(tm*7+k*1.7);
    twinkle(c,x,y,2+tw*3,STAR_COLS[k%4],0.55+0.45*tw);}
  c.restore();
}
function drawFront(c,u,st,tm,cx,cy,state,f,fwd){
  orbit(c,tm,cx,cy,true);
  c.save();c.globalCompositeOperation='lighter';
  // 핵 반짝임
  const core=0.6+0.4*Math.sin(tm*5);twinkle(c,cx+fwd*6,cy+2,6+core*5,'#fff6c8',0.7*core);
  if(state==='attack'){
    const ix=u.x+fwd*(-IMPACT_X)*SC;
    if(f>=2&&f<=10){ // 하늘의 별자리 선: 마법진 별 6개를 잇는 빛줄기
      const k=Math.min(1,(f-2)/5),ccx=ix,ccy=GY-150;c.strokeStyle='rgba(190,215,255,'+(0.55*k)+')';c.lineWidth=1.5;c.beginPath();
      for(let i=0;i<=6;i++){const a=i/6*Math.PI*2+tm*0.6,x=ccx+Math.cos(a)*46,y=ccy+Math.sin(a)*16;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2+tm*0.6;twinkle(c,ccx+Math.cos(a)*46,ccy+Math.sin(a)*16,4,STAR_COLS[i%4],k);}
      if(f===7){const lg=c.createRadialGradient(ccx,ccy,2,ccx,ccy,90);lg.addColorStop(0,'rgba(255,255,255,0.8)');lg.addColorStop(1,'rgba(160,190,255,0)');c.fillStyle=lg;c.fillRect(ccx-90,ccy-90,180,180);c.fillStyle='rgba(255,255,255,0.6)';c.fillRect(ccx-120,ccy-1,240,2);}
    }
    if(st.pillar>0){const k=st.pillar/0.45,w=26*k+6;const pg=c.createLinearGradient(ix-w,0,ix+w,0);pg.addColorStop(0,'rgba(120,200,255,0)');pg.addColorStop(0.5,'rgba(230,245,255,'+(0.9*k)+')');pg.addColorStop(1,'rgba(120,200,255,0)');c.fillStyle=pg;c.fillRect(ix-w,0,w*2,GY);
      const bg=c.createRadialGradient(ix,GY-12,4,ix,GY-12,110*k+20);bg.addColorStop(0,'rgba(255,240,170,'+(0.9*k)+')');bg.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=bg;c.fillRect(ix-140,GY-140,280,160);}
  }
  for(const r of st.ring){if(r.t<0)continue;const q=r.t/0.8;c.strokeStyle='rgba(200,180,255,'+(1-q)+')';c.lineWidth=5*(1-q)+1;c.beginPath();c.ellipse(r.x,GY-4,20+q*150,6+q*26,0,0,7);c.stroke();
    c.strokeStyle='rgba(255,236,150,'+(0.8*(1-q))+')';c.lineWidth=2;c.beginPath();c.ellipse(r.x,GY-4,12+q*110,4+q*18,0,0,7);c.stroke();}
  for(const p of st.P){const a=Math.max(0,p.life/p.max);
    if(p.k==='met'){c.globalAlpha=1;const tl=c.createLinearGradient(p.x,p.y,p.x-p.vx*0.12,p.y-p.vy*0.12);tl.addColorStop(0,p.col);tl.addColorStop(1,'rgba(120,160,255,0)');c.strokeStyle=tl;c.lineWidth=6;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*0.12,p.y-p.vy*0.12);c.stroke();twinkle(c,p.x,p.y,7,'#ffffff',1);}
    else if(p.k==='smoke'){c.globalCompositeOperation='source-over';c.globalAlpha=0.28*a;c.fillStyle='#7a5ad8';c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill();c.globalCompositeOperation='lighter';}
    else twinkle(c,p.x,p.y,p.k==='dust'?2:3.5,p.col,a);}
  c.restore();
  if(st.flash>0){c.save();c.globalAlpha=Math.min(0.55,st.flash*3);c.fillStyle='#e8e4ff';c.fillRect(-50,-50,900,400);c.restore();}
}
// 전투 유닛 그리기: dsp()에서 호출
window.drawEunhaUnit=function(c,u,ft){
  const tm=S?S.t:0,flip=u.team===1;
  const st=u._eh||(u._eh={last:tm,t:Math.random()*3,hb:9,wasKt:false,P:[],ring:[],met:{},boom:0,flash:0,pillar:0,trail:0,hbFx:0});
  let dt=Math.max(0,Math.min(0.1,tm-st.last));st.last=tm;if(u.fr>0&&ft===0)dt=0;st.t+=dt;
  if(u.kt>0&&!st.wasKt)st.hb=0;st.wasKt=u.kt>0;st.hb+=dt;
  let state='idle',t=st.t;
  if(ft===0&&u.at>0){state='attack';t=Math.max(0,(u.ad||ATK_T)-u.at)*(ATK_T/(u.ad||ATK_T));}
  else if(st.hb<META.anims.hitback.n/META.anims.hitback.fps){state='hitback';t=st.hb;}
  else if(u.mv)state='walk';
  const a=META.anims[state],n=Math.floor(t*a.fps),f=a.loop?n%a.n:Math.min(n,a.n-1);
  // 원본은 왼쪽(-x)을 바라봄: 아군(team 0)은 그대로, 상대(team 1)는 좌우 반전.
  const fwd=u.team===0?-1:1; // 앞쪽 x 방향
  if(ft===0)step(st,u,dt,state,t,f,fwd);
  const cx=u.x-fwd*17*SC,cy=GY-32*SC; // 은하 원반 중심 (원본 기준점에서 뒤쪽 17px, 위 32px)
  c.save();
  if(ft>0){const q=ft/0.6;c.globalAlpha=Math.max(0,1-q);c.translate(-fwd*q*60,-q*30);}
  else{c.fillStyle='rgba(20,10,60,0.35)';c.beginPath();c.ellipse(cx,GY+2,70,6,0,0,7);c.fill();}
  if(ft===0)drawBack(c,u,st,st.t,cx,cy,state);
  if(ready())frame(c,state,f,u.x,GY,SC,flip);else window.drawEunhaIcon(c,u.x-80,GY-110,160,140,flip);
  if(u.hf>0&&ft===0){c.globalCompositeOperation='lighter';c.globalAlpha=0.6;window.drawEunhaIcon(c,cx-86,cy-74,172,148,flip);c.globalCompositeOperation='source-over';c.globalAlpha=1;}
  c.restore();
  if(ft===0)drawFront(c,u,st,st.t,cx,cy,state,f,fwd);
  if(ft===0&&u.fr>0){c.save();c.globalAlpha=0.3;c.fillStyle='#9bdfff';c.fillRect(cx-90,cy-70,180,140);c.restore();}
};
})();
