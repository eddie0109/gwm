// 건우 대전쟁 · 10-gacha.js
// ════════ 뽑기 (건우통이 빙글빙글) ════════
let gst={mode:'idle',t0:0,kind:'n'},grun=false,chosenBanner=0;
const gcv=$('gcv');
function sp(c,grid,pal,x,y,ps,rot,sc){c.save();c.translate(x,y);c.rotate(rot||0);c.scale(sc||1,sc||1);
  const gw=Math.max(...grid.map(r=>r.length));spr(grid,-gw*ps/2,-grid.length*ps/2,ps,false,pal,c);c.restore();}
function gDraw(now){
  const c=gcv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,800,360);
  const rare=gst.kind==='r',T=(now-gst.t0)/1000,D=rare?4.2:3.2,tB=D-1.4,m=gst.mode,reveal=(m==='anim'&&T>=tB)||m==='show';
  const g0=c.createRadialGradient(400,180,10,400,180,480);
  g0.addColorStop(0,reveal?(rare?'#6a2aa8':'#2f4f8f'):(rare?'#3a1466':'#1c2f55'));g0.addColorStop(1,rare?'#0b0418':'#060a14');c.fillStyle=g0;c.fillRect(0,0,800,360);
  c.fillStyle='#ffffff10';c.beginPath();c.ellipse(400,300,210,26,0,0,7);c.fill();
  for(let i=0;i<24;i++){const x=(i*113+now*0.02*(1+i%4))%800,y=360-((i*47+now*0.05*(1+i%3))%380);c.fillStyle=rare?'#ffd8ff':'#bfe0ff';c.globalAlpha=0.25+0.5*Math.abs(Math.sin(now*0.003+i));c.fillRect(x,y,3,3);}c.globalAlpha=1;
  if(!reveal){ // 건우통이 빙글빙글
    const can=fm(MY.find(u=>u.id==='gtong')),k=m==='idle'?0:Math.min(1,T/tB);
    const ang=m==='idle'?now*0.0015:(0.6*T+9*T*T*(0.4+k*0.6));
    const sc=1+(m==='idle'?0.04*Math.sin(now*0.004):0.12*Math.sin(T*10)*k+0.25*k),sh=m==='anim'?Math.sin(T*50)*4*k*k:0;
    c.save();c.globalAlpha=0.25+0.35*k;const ag=c.createRadialGradient(400+sh,170,10,400+sh,170,120+k*80);ag.addColorStop(0,rare?'#ffd84a':'#8fd0ff');ag.addColorStop(1,'#0000');c.fillStyle=ag;c.fillRect(150,0,500,360);c.restore();
    sp(c,can.grid,pl(can),400+sh,170,11,ang,sc);
    if(m==='anim')for(let i=0;i<10;i++){const a=i*0.628+T*(4+k*10),r=110+k*50;c.fillStyle=i%2?'#ffe27a':'#fff';c.fillRect(400+Math.cos(a)*r,170+Math.sin(a)*r*0.5,5,5);}
    c.font='bold 20px sans-serif';c.textAlign='center';c.lineWidth=4;c.strokeStyle='#000';c.fillStyle='#fff';
    const tx=m==='idle'?'건우통이 뽑기 기계를 돌리고 있어요…':(T<1?'두근두근…':'뭐가 나올까!?');c.strokeText(tx,400,336);c.fillText(tx,400,336);
    if(m==='anim'&&T>tB-0.3){c.fillStyle='rgba(255,255,255,'+Math.min(1,(T-(tB-0.3))/0.3)+')';c.fillRect(0,0,800,360);}
  }else{ // 펑! 캐릭터 등장
    const u=gres&&gres.u;if(!u)return;
    const q=m==='anim'?T-tB:9,e=Math.min(1,q/0.7),sc=e<1?(1+0.35*Math.sin(e*Math.PI))*e:1,v=fm(u),ps=Math.max(3,Math.floor(150/v.grid.length));
    c.save();c.translate(400,170);for(let i=0;i<18;i++){const a=i*Math.PI/9+now*0.0007;c.fillStyle=i%2?(rare?'#ffd84a66':'#ffe27a55'):'#ffffff33';c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a-0.09)*520,Math.sin(a-0.09)*520);c.lineTo(Math.cos(a+0.09)*520,Math.sin(a+0.09)*520);c.closePath();c.fill();}c.restore();
    sp(c,v.grid,pl(v),400,170+Math.sin(now*0.004)*4,ps,0,sc);
    if(m==='anim'){c.globalAlpha=Math.max(0,1.3-q);for(let i=0;i<26;i++){const a=i*0.241,r=Math.min(1,q*2)*(100+i%5*35);c.fillStyle=i%2?'#ffe27a':'#fff';c.fillRect(400+Math.cos(a)*r,170+Math.sin(a)*r,5,5);}c.globalAlpha=1;
      if(q<0.2){c.fillStyle='rgba(255,255,255,'+(1-q/0.2)+')';c.fillRect(0,0,800,360);}}
    if(q>0.4){c.textAlign='center';c.lineWidth=5;c.strokeStyle='#000';c.font='bold 30px sans-serif';c.strokeText(v.name,400,292);c.fillStyle='#fff';c.fillText(v.name,400,292);
      c.font='bold 18px sans-serif';const lab='★ '+TIERN[u.t]+' ★';c.strokeText(lab,400,324);c.fillStyle=u.t==='UR'?'hsl('+(now*0.2%360)+',90%,70%)':TIERC[u.t];c.fillText(lab,400,324);
      if(gres.dup){c.save();c.translate(580,80);c.rotate(-0.12);c.font='bold 42px sans-serif';c.lineWidth=6;c.strokeText('+1',0,0);c.fillStyle='#7dff9b';c.fillText('+1',0,0);c.restore();}
      if(!gres.dup){c.save();c.translate(580,80);c.rotate(0.2);c.font='bold 28px sans-serif';c.lineWidth=5;c.strokeText('NEW!',0,0);c.fillStyle='#ffe27a';c.fillText('NEW!',0,0);c.restore();}}
  }
  if(m==='anim'&&T>=D&&!gst.fin){gst.fin=1;gst.mode='show';if(gres)gres.anim=0;buildGa();}
}
function gLoop(now){if($('gacha').classList.contains('hide')){grun=false;return;}gDraw(now);requestAnimationFrame(gLoop);}
function gStart(){if(!grun){grun=true;requestAnimationFrame(gLoop);}}
function buildGa(){
  $('gc').textContent='🎫'+tk+'  🌟'+rt+'  💎'+em;const bt=$('bannerTabs');bt.innerHTML='';GACHA_BANNERS.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.className=i===chosenBanner?'selected':'';b.onclick=()=>{chosenBanner=i;gres=null;buildGa();};bt.appendChild(b);});
  const p=$('gp');p.innerHTML='';const busy=!!(gres&&gres.anim),pend=!!(gres&&gres.dup&&!gres.done);
  const msg=document.createElement('div');msg.style.cssText='min-height:22px;font-size:.9rem';
  if(busy)msg.textContent='뽑는 중…';
  else if(gres)msg.innerHTML='<b>'+fm(gres.u).name+'</b> 획득! <small>'+(gres.dup?('중복 획득 '+gres.done+' · XP 레벨과 별도'):'새 캐릭터를 얻었어요!')+'</small>';
  else msg.innerHTML='<small>일반 뽑기: 기본 / 레어 뽑기: 공통 레어 70% · 공통 슈퍼레어 25% · 울슈레 5%</small>'; 
  p.appendChild(msg);
  const row=document.createElement('div');row.className='nav';
  const mk=(t,fn,dis)=>{const b=document.createElement('button');b.textContent=t;b.disabled=!!dis;b.onclick=fn;row.appendChild(b);};
  if(pend&&!busy){const next=(plusLv[gres.u.id]||0)+1;
    mk('중복 강화 +'+next+' 받기',()=>{plusLv[gres.u.id]=next;gres.done='+'+next+' 적용! (XP Lv'+(lv[gres.u.id]||1)+'과 별도)';save();buildGa();},false);
    p.appendChild(row);return;}
  const lock=busy||pend;
  mk('일반 뽑기 (🎫1)',()=>pull('n'),lock||tk<1);
  mk('🌟 레어 뽑기 (🌟1)',()=>pull('r'),lock||rt<1);
  mk('💎30 → 🎫1',()=>{em-=30;tk++;save();buildGa();},busy||em<30);
  mk('💎100 → 🌟1',()=>{em-=100;rt++;save();buildGa();},busy||em<100);
  p.appendChild(row);
}
function pull(kind){
  if(gres&&(gres.anim||(gres.dup&&!gres.done)))return;
  if(kind==='r'){if(rt<1)return;rt--;}else{if(tk<1)return;tk--;}
  qs.ga++;
  let pool;if(kind==='r'){const x=Math.random();pool=MY.filter(u=>u.t===(x<0.05?'UR':x<0.30?'SR':'R'));}else pool=MY.filter(u=>u.t==='N');
  const u=pool[Math.floor(Math.random()*pool.length)],dup=avail(u);
  if(dup)plusLv[u.id]=(plusLv[u.id]||0)+1;
  else own[u.id]=1;
  gres={u,dup,done:dup?'+'+plusLv[u.id]+' 강화 적용!':null,anim:1,kind};gst={mode:'anim',t0:performance.now(),kind};save();sfx('gacha',kind==='r');buildGa();gStart();}

