// 건우 대전쟁 · 15-battle-graphics.js
function txt(t,x,y,size){g.font='bold '+size+'px sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000a';g.strokeText(t,x,y);g.fillStyle='#fff';g.fillText(t,x,y);}
// 성 체력 표시: 숫자가 길어도 화면 밖으로 잘리지 않게 위치 보정
function castleHpText(en,my){g.font='bold 14px sans-serif';
  txt(en,Math.max(35,g.measureText(en).width/2+6),128,14);txt(my,Math.min(W-38,W-g.measureText(my).width/2-6),128,14);}
function dsp(u,ft){
  if(u.T.train&&window.drawSteamTrainUnit){window.drawSteamTrainUnit(g,u,ft);return;}
  if(u.T.eunha&&window.drawEunhaUnit){window.drawEunhaUnit(g,u,ft);return;}
  if(u.T.pilssam&&window.PILSSAM){PILSSAM.draw(g,u,ft);return;}
  const T=u.T,grid=u.team===0?T.grid:u.code==='O'?CORN_EX:u.code==='C'||u.code==='0'?TOOTH_EX:u.code==='Ω'?CORN_EX:u.code==='A'?deco(FIGHT,['armor','wings']):(T.grid||TPL[T.tpl]),s=T.s,h=(T.spriteH||grid.length)*s,w=(T.spriteW||Math.max(...grid.map(r=>r.length)))*s,dir=u.team===0?-1:1,an=T.an;
  let ox=0,oy=-(T.float?8:0),rot=0,al=1,sx=1,sy=1;
  if(ft>0){const p=ft/0.6;ox=-dir*p*110;oy=-Math.sin(p*Math.PI)*50+p*40;rot=-dir*p*3;al=1-p;} // 데스 모션
  else{
    // 이동 중에는 정지 자세를 유지합니다. // 걷기 모션
    if(u.kt>0){const p=Math.min(1,u.kt/0.35),ks=T.kbStyle;oy=-Math.sin(p*Math.PI)*14;rot=-dir*0.35; // 히트백 모션 (캐릭터별)
      if(ks==='spin')rot=-dir*(1-p)*Math.PI*2;
      else if(ks==='squash'){const m=Math.sin(p*Math.PI);sx=1+0.3*m;sy=1-0.25*m;rot=0;}
      else if(ks==='bounce'){oy*=1.8;sx=sy=1+0.1*Math.sin(p*Math.PI*2);}
      else if(ks==='roll')rot=-dir*(1-p)*Math.PI;}
    else if(u.at<=0&&u.mv&&!T.float){const t=S.t+(u.ph||0),w=Math.abs(Math.sin(t*8.5)); // 걷기: 통통 튀며 살짝 기울기
      oy-=w*4;rot=dir*0.05*Math.sin(t*8.5);sx=1+0.04*(1-w);sy=1-0.04*(1-w);}
    else if(u.at<=0){const t=S.t+(u.ph||0),id=T.id||'';const bob=Math.sin(t*(id==='energy'?5:id==='frog'?2.4:3.2))* (id==='gtong'?1.5: id==='frog'?2.5:3.5);oy+=T.float?-8+bob:bob;
      if(id==='energy'){rot=Math.sin(t*1.8)*0.10;sx=1+0.035*Math.sin(t*4);}
      else if(id==='starfish'){rot=Math.sin(t*1.5)*0.15;}
      else if(id==='jelly'){sy=1+0.08*Math.sin(t*3);sx=1-0.05*Math.sin(t*3);oy-=3*Math.sin(t*3);}
      else if(id==='urchin'){sx=sy=1+0.03*Math.sin(t*6);}
      else if(id==='swordfish'){rot=Math.sin(t*2.5)*0.06;}
      else if(id==='whale'){oy+=Math.sin(t*1.4)*1.5;sx=1+0.02*Math.sin(t*1.4);}
      else if(id==='lobster'){sx=1+(Math.sin(t*7)>0.6?0.05:0);}
      else if(id==='gtong'){rot=Math.sin(t*1.7)*0.035;}
      else if(id==='frog'){sx=1+0.025*Math.sin(t*2.2);sy=1-0.025*Math.sin(t*2.2);}
      else if(id==='cornbar'){rot=Math.sin(t*2.5)*0.045;}
      else if(id==='healthytooth'){oy+=Math.sin(t*2)*1.5;}
      else if(id==='junchi'||id==='mack'||id==='ray'){rot=Math.sin(t*4)*0.045;}
      else{sx=1+0.018*Math.sin(t*3.5);}
    }
    if(u.at>0){const p=u.at/u.ad,q=1-p;
      if(an==='leap'){const D=(u.tx||u.x)-u.x; // 황소개구리: 점프 → 낙하 → 복귀
        if(q<0.15){const k=q/0.15;sx=1+0.15*k;sy=1-0.2*k;}
        else if(q<0.4){const f=(q-0.15)/0.25;ox=D*f;oy-=Math.sin(f*Math.PI)*110;rot=dir*0.2*Math.sin(f*Math.PI);}
        else{const f=(q-0.4)/0.6;ox=D*(1-f);oy-=Math.sin(f*Math.PI)*35;
          if(q<0.7){const k=(q-0.4)/0.3;g.save();g.globalAlpha=1-k;g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.ellipse(u.tx,GY,55*k,14*k,0,0,7);g.stroke();g.fillStyle='#8a6b3a';for(let i=0;i<6;i++)g.fillRect(u.tx+(i-2.5)*18*k-3,GY-8-Math.sin(k*Math.PI)*30,6,6);g.restore();}}
      }else if(an==='tent'){ // 한치: 몸을 웅크렸다가 촉수 발사
        const k=Math.min(1,q/0.25);ox=dir*(q<0.25?-8*k:14*Math.sin((q-0.25)/0.75*Math.PI));
        sx=q<0.25?1+0.15*k:1-0.1*Math.sin(q*Math.PI);sy=q<0.25?1-0.15*k:1+0.1*Math.sin(q*Math.PI);
        if(q>=0.25){const e=(q-0.25)/0.75,len=T.range*Math.min(1,e*1.8);
          g.save();g.globalAlpha=Math.min(1,p*2);g.lineCap='round';
          for(let i=0;i<4;i++){const y0=GY-h*0.25-i*5;g.strokeStyle=T.acc;g.lineWidth=5-i*0.7;g.beginPath();g.moveTo(u.x+dir*w/2,y0);
            for(let d=0;d<=len;d+=8)g.lineTo(u.x+dir*(w/2+d),y0+Math.sin(d*0.15+q*20+i)*5);g.stroke();}
          g.fillStyle='#3a2a55';
          for(let i=0;i<5;i++){g.beginPath();g.arc(u.x+dir*(w/2+len-i*9),GY-h*0.25-6+Math.sin(i*2+q*9)*6,5-i*0.6,0,7);g.fill();}
          g.restore();}
      }else if(an==='beam'){ // 기 모으기 → 발사
        const x0=u.x+dir*(w/2+6),y0=GY-h/2-8+oy;g.save();
        if(q<0.45){const k=q/0.45;g.globalAlpha=0.9;g.fillStyle=T.acc||'#d5f0ff';g.beginPath();g.arc(x0,y0,4+k*10,0,7);g.fill();g.strokeStyle=T.col||'#7fd0ff';g.lineWidth=2;for(let i=0;i<6;i++){const a=i*1.047+q*8,r1=26-k*14,r2=r1+10;g.beginPath();g.moveTo(x0+Math.cos(a)*r1,y0+Math.sin(a)*r1);g.lineTo(x0+Math.cos(a)*r2,y0+Math.sin(a)*r2);g.stroke();}sx=1-0.08*k;sy=1+0.08*k;ox=-dir*5*k;}
        else{const k=(q-0.45)/0.55,len=(T.range+40)*Math.min(1,k*3),th=(1-k)*14+3;g.globalAlpha=1-k*0.7;g.fillStyle=T.col||'#46a8ff';g.fillRect(Math.min(x0,x0+dir*len),y0-th/2,len,th);g.fillStyle='#fff';g.fillRect(Math.min(x0,x0+dir*len),y0-th/6,len,th/3);g.fillStyle=T.acc||'#d5f0ff';g.beginPath();g.arc(x0+dir*len,y0,th*0.9,0,7);g.fill();ox=dir*6*(1-k);}
        g.restore();
      }else if(an==='fire'){const m=Math.sin(q*Math.PI),len=(T.range+22)*Math.min(1,q*3);rot=dir*0.1*m;
        g.save();g.globalAlpha=Math.min(1,p*2);
        [['#ff4a1a',1],['#ffa63a',.66],['#ffe27a',.35]].forEach(([c,k],i)=>{const sp2=(10+Math.sin(q*30+i)*3)*k,x0=u.x+dir*w/2,y0=GY-h*0.62;g.fillStyle=c;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0+dir*len*k,y0-sp2);g.lineTo(x0+dir*len*(k+0.15),y0+Math.sin(q*40+i)*3);g.lineTo(x0+dir*len*k,y0+sp2);g.closePath();g.fill();});
        g.restore();
      }else if(an==='burst'){const k=Math.min(1,q*1.6),cx=u.x+dir*(T.range*0.45),m=Math.sin(q*Math.PI);ox=-dir*m*5;sx=1+0.12*m;sy=1-0.1*m; // 주변을 펑!
        g.save();g.globalAlpha=Math.max(0,1-q);g.strokeStyle=T.acc||'#fff';g.lineWidth=5;g.beginPath();g.ellipse(cx,GY-h*0.4,8+T.range*0.6*k,6+h*0.5*k,0,0,7);g.stroke();
        g.fillStyle='#ffffff55';g.beginPath();g.ellipse(cx,GY-h*0.4,4+T.range*0.4*k,3+h*0.35*k,0,0,7);g.fill();g.restore();
      }else if(an==='smash'){const up=Math.min(1,q/0.4); // 내려찍기 + 충격파
        if(q<0.4){oy-=Math.sin(up*Math.PI/2)*16;rot=-dir*0.28*up;sy=1+0.06*up;}
        else{const k=(q-0.4)/0.6;rot=dir*0.2*(1-k);ox=dir*16*(1-k);const cx=u.x+dir*(w/2+T.range*0.6);
          g.save();g.globalAlpha=Math.max(0,1-k);g.strokeStyle=T.acc||'#fff';g.lineWidth=5;g.beginPath();g.ellipse(cx,GY,24+k*T.range*0.9,6+k*10,0,0,7);g.stroke();
          g.fillStyle='#8a6b3a';for(let i=0;i<7;i++)g.fillRect(cx+(i-3)*14*k-3,GY-6-Math.sin(k*Math.PI)*(14+i%3*8),6,6);g.restore();}
      }else if(an==='spin'){ // 불가사리: 빙글 돌며 별 표창 투척
        rot=dir*q*Math.PI*4;const sx0=u.x+dir*w/2,len=T.range*Math.min(1,q*1.4),x=sx0+dir*len,y=GY-h*0.55;
        g.save();g.translate(x,y);g.rotate(q*20);g.globalAlpha=Math.min(1,p*3);g.fillStyle=T.acc||'#ffe08a';
        for(let i=0;i<5;i++){g.rotate(Math.PI*2/5);g.beginPath();g.moveTo(0,-10);g.lineTo(3,-2);g.lineTo(-3,-2);g.closePath();g.fill();}
        g.fillStyle='#fff';g.fillRect(-2,-2,4,4);g.restore();
      }else if(an==='zap'){ // 해파리: 부풀었다가 번개 낙뢰
        const m=Math.sin(q*Math.PI);sy=1+0.15*m;sx=1-0.08*m;oy-=6*m;
        if(q>0.3){g.save();g.globalAlpha=Math.min(1,p*2.5);g.strokeStyle=T.acc||'#7fe8ff';g.lineWidth=3;
          for(let i=0;i<3;i++){const bx=u.x+dir*(w/2+T.range*(0.25+i*0.3));let x=bx,y=GY-120;g.beginPath();g.moveTo(x,y);
            for(let k=0;k<6;k++){x=bx+((k+i+Math.floor(q*20))%2?8:-8);y+=20;g.lineTo(x,y);}g.stroke();
            g.fillStyle='#ffffffaa';g.beginPath();g.ellipse(bx,GY,14,4,0,0,7);g.fill();}g.restore();}
      }else if(an==='spike'){ // 성게: 부풀린 뒤 가시 발사
        const k=Math.min(1,q/0.3);sx=sy=1+0.25*(q<0.3?k:1-(q-0.3)/0.7);
        if(q>=0.3){const e=(q-0.3)/0.7,cx=u.x,cy=GY-h/2;g.save();g.globalAlpha=1-e;g.strokeStyle=T.acc||'#ff8ad0';g.lineWidth=3;
          for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r0=w*0.5+e*10,r1=r0+12+e*30;g.beginPath();g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0*0.7);g.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1*0.7);g.stroke();}g.restore();}
      }else if(an==='pierce'){ // 황새치: 살짝 당겼다가 번개처럼 찌르고 복귀
        let d=0;if(q<0.25)d=-8*(q/0.25);else if(q<0.5){const k=(q-0.25)/0.25;d=-8+(T.range*0.7+8)*k*k;}else d=T.range*0.7*(1-(q-0.5)/0.5);
        ox=dir*d;rot=dir*0.05;
        if(q>0.3&&q<0.7){const bx=u.x+ox-dir*w*0.5;g.save();g.globalAlpha=0.75;g.fillStyle='#fff';for(let i=0;i<4;i++)g.fillRect(dir>0?bx-44:bx+4,GY-h*0.25-i*7,40,2);
          if(q>0.45&&q<0.6){const tx=u.x+ox+dir*w*0.5;g.fillStyle=T.acc||'#e8f4ff';g.beginPath();g.arc(tx,GY-h*0.5,10,0,7);g.fill();}g.restore();}
      }else if(an==='water'){ // 고래: 숨 들이쉬기 → 물대포 포물선 → 착탄
        if(q<0.35){const k=q/0.35;sy=1-0.1*k;sx=1+0.06*k;}
        else{const k=(q-0.35)/0.5,e=Math.min(1,k),x0=u.x+dir*w*0.3,y0=GY-h-4,x1=u.x+dir*T.range*0.85;
          g.save();g.fillStyle=T.acc||'#8fd8ff';
          if(k<1)for(let i=0;i<6;i++){const ee=Math.max(0,e-i*0.04),xx=x0+(x1-x0)*ee,yy=y0+(GY-12-y0)*ee-80*Math.sin(ee*Math.PI);g.globalAlpha=0.85-i*0.12;g.beginPath();g.arc(xx,yy,10-i,0,7);g.fill();}
          else{const s2=Math.min(1,(q-0.85)/0.15);g.globalAlpha=1-s2;g.strokeStyle='#bff0ff';g.lineWidth=4;g.beginPath();g.ellipse(x1,GY,20+s2*50,5+s2*10,0,0,7);g.stroke();
            for(let i=0;i<8;i++)g.fillRect(x1+(i-4)*10*s2,GY-10-Math.sin(s2*Math.PI)*(20+i%3*10),4,4);}
          g.restore();}
      }else if(an==='snip'){ // 랍스터: 양 집게 연속 싹둑
        const m=Math.sin(q*Math.PI*2);ox=dir*Math.abs(m)*8;sx=1+0.08*Math.abs(m);const cx=u.x+dir*(w/2+14),e=(q*2)%1;
        g.save();g.globalAlpha=Math.max(0,p*1.6);g.strokeStyle=T.acc||'#fff';g.lineWidth=4;g.lineCap='round';
        g.beginPath();g.moveTo(cx-12,GY-h*0.8);g.lineTo(cx-12+24*e,GY-h*0.8+30*e);g.stroke();
        if(q>0.5){g.beginPath();g.moveTo(cx+12,GY-h*0.8);g.lineTo(cx+12-24*e,GY-h*0.8+30*e);g.stroke();}g.restore();
      }else if(an==='claw'){const e=Math.min(1,q*2),m=Math.sin(q*Math.PI);ox=dir*m*12;rot=dir*m*0.12;const cx=u.x+dir*(w/2+8); // 할퀴기
        g.save();g.globalAlpha=Math.max(0,p*1.5);g.strokeStyle=T.acc||'#fff';g.lineWidth=4;g.lineCap='round';
        for(let i=0;i<3;i++){g.beginPath();g.moveTo(cx+dir*i*10,GY-h*0.95);g.lineTo(cx+dir*(i*10+20*e),GY-h*0.95+34*e);g.stroke();}g.restore();
      }else{const e=Math.min(1,q*1.8),cx=u.x+dir*(w/2),cy=GY-h*0.55,r=Math.max(26,T.range*0.7),m=Math.sin(q*Math.PI); // 초승달 베기
        g.save();g.globalAlpha=Math.max(0,p*1.4);g.lineCap='round';const a0=dir>0?-1.1:Math.PI+1.1,a1=a0+(dir>0?1:-1)*2.2*e;
        g.lineWidth=6;g.strokeStyle=u.team?(T.acc||'#fff'):'#fff';g.beginPath();g.arc(cx-dir*6,cy,r,a0,a1,dir<0);g.stroke();
        g.lineWidth=2;g.strokeStyle='#fff';g.beginPath();g.arc(cx-dir*6,cy,r-4,a0,a1,dir<0);g.stroke();g.restore();ox=dir*m*10;rot=dir*m*0.1;}
    }
  }
  if(u.team===0&&ft===0&&(T.f||T.glow)){g.save();g.globalAlpha=0.22+0.1*Math.sin(S.t*6);g.fillStyle=T.aura||'#ffd84a';g.beginPath();g.ellipse(u.x,GY-h/2+oy,w*0.75,h*0.7,0,0,7);g.fill();g.restore();}
  if(u.boss&&ft===0){g.save();g.globalAlpha=0.18+0.08*Math.sin(S.t*5);g.fillStyle='#ff3a2a';g.beginPath();g.ellipse(u.x,GY-h/2,w*0.8,h*0.75,0,0,7);g.fill();g.restore();}
  g.save();if(ft===0){g.fillStyle='#1b140b55';g.beginPath();g.ellipse(u.x,GY+1,Math.max(12,w*.36),5,0,0,Math.PI*2);g.fill();}g.globalAlpha=al;g.translate(u.x+ox,GY+oy);g.rotate(rot);g.scale(sx,sy);
  const pal=u.team===1&&!u.pvp?(u.code==='O'?pl(MY.find(z=>z.id==='cornbar')):u.code==='C'?pl(MY.find(z=>z.id==='healthytooth')):(T._p||(T._p=cp(T.col,T.acc)))):(T.rainbow?{B:'hsl('+((S.t*75)%360)+',90%,58%)',S:'hsl('+((S.t*75+75)%360)+',95%,69%)',L:'hsl('+((S.t*75+155)%360)+',90%,80%)',Y:'hsl('+((S.t*75+225)%360)+',95%,65%)',O:'hsl('+((S.t*75+295)%360)+',95%,65%)'}:T.gold?{B:'#c98a14',S:'hsl(46,100%,'+(58+12*Math.sin(S.t*6))+'%)',L:'hsl(50,100%,'+(80+10*Math.sin(S.t*6+1))+'%)'}:(T._p||(T._p=pl(T))));
  if(T.sprite)drawUnitSprite(g,T,-w/2,-h,s,u.team===0);
  else spr(grid,-w/2,-h,s,u.team===0,u.hf>0&&ft===0?Object.assign({},pal,FLASH_PAL):pal);
  g.restore();
  if(ft===0&&u.sl>0){g.save();g.globalAlpha=0.28;g.fillStyle='#4aa3ff';g.beginPath();g.ellipse(u.x,GY-h/2+oy,w*0.7,h*0.65,0,0,7);g.fill();g.restore();txt('느림',u.x,GY-h-18,10);}
  if(ft===0&&u.team===1&&!u.pvp)txt(T.name+' '+T.ty.join('/')+(u.boss?' (BOSS)':''),u.x,GY-h-6,u.boss?13:10);
}
function drawCan(x,y){
  const ly=S&&S.lid>0?-Math.sin(S.lid/0.3*Math.PI)*14:0;
  g.fillStyle='#8a97a3';g.fillRect(x-4,y-14+ly,52,8);
  g.fillRect(x+14,y-22+ly,16,8);
  g.fillStyle='#aab6c1';
  g.beginPath();g.moveTo(x,y-6);g.lineTo(x+44,y-6);g.lineTo(x+38,y+100);g.lineTo(x+6,y+100);g.closePath();g.fill();
  g.fillStyle='#6f7c88';[x+13,x+22,x+31].forEach(lx=>g.fillRect(lx,y+4,3,86));
  g.strokeStyle=PAL.K;g.lineWidth=2;g.strokeRect(x-4,y-14+ly,52,8);
}
function drawEnemyBase(x,y){ // 적 성: 벽돌 + 포탑 + 뾰족 지붕 + 펄럭이는 깃발 + 빛나는 창 (장마다 색이 달라져요)
  const c=[['#8b8f99','#6a6e78','#50545e'],['#8a6fb0','#6a5090','#4a3570'],['#6a4a4a','#4a2f2f','#2a1a1a'],['#4896bc','#276e89','#15425a'],['#4f70ba','#263985','#172053'],['#6849ad','#30237d','#171246'],['#4a6a5a','#2f4a3d','#1e3328'],['#7a3b3b','#5a2626','#3a1414'],['#4a3c86','#2c2550','#1a1433']][CH],t=S?S.t:0;
  g.fillStyle=c[0];g.fillRect(x+6,y+14,42,86);
  g.fillStyle=c[1];for(let j=0;j<8;j++)for(let i=0;i<3;i++)g.fillRect(x+8+i*13+(j%2)*5,y+18+j*10,10,2);
  g.fillStyle=c[2];g.fillRect(x+6,y+14,4,86);g.fillRect(x+44,y+14,4,86);
  [[x-6,y+4],[x+36,y+4]].forEach(([tx,ty])=>{g.fillStyle=c[0];g.fillRect(tx,ty,22,28);g.fillStyle=c[2];g.fillRect(tx,ty,3,28);for(let k=0;k<3;k++)g.fillRect(tx+k*8,ty-6,5,6);g.fillStyle=c[1];g.fillRect(tx+8,ty+10,6,2);});
  g.fillStyle='#b8402a';g.beginPath();g.moveTo(x+12,y+14);g.lineTo(x+27,y-18);g.lineTo(x+42,y+14);g.closePath();g.fill();
  g.fillStyle='#8a2a1a';g.beginPath();g.moveTo(x+27,y-18);g.lineTo(x+42,y+14);g.lineTo(x+32,y+14);g.closePath();g.fill();
  g.fillStyle='#25170c';g.fillRect(x+26,y-38,2,22);
  const fw=Math.sin(t*5)*3;g.fillStyle='#c0392b';g.beginPath();g.moveTo(x+28,y-38);g.lineTo(x+46+fw,y-33);g.lineTo(x+28,y-27);g.closePath();g.fill();
  g.fillStyle='#2a1a14';g.beginPath();g.moveTo(x+19,y+100);g.lineTo(x+19,y+72);g.arc(x+27,y+72,8,Math.PI,0);g.lineTo(x+35,y+100);g.fill();
  g.fillStyle='#555';for(let i=0;i<3;i++)g.fillRect(x+21+i*4,y+66,1,34);
  g.globalAlpha=0.6+0.4*Math.sin(t*4);g.fillStyle='#ff5a3a';g.fillRect(x+13,y+40,5,8);g.fillRect(x+36,y+40,5,8);g.fillRect(x+23,y+30,8,5);g.globalAlpha=1;
  const rg=g.createRadialGradient(x+27,y+50,6,x+27,y+50,70);rg.addColorStop(0,'#ff3b3b22');rg.addColorStop(1,'#ff3b3b00');g.fillStyle=rg;g.fillRect(x-40,y-30,140,150);
}
const BGT=[
['#4fa8ff','#d6f1ff','#8fb4d4','#5f9a82','#7cb35b','#659c47',0,0],
['#ff7a45','#ffd98f','#c27a63','#97524a','#cfa45c','#ad8442',0,1],
['#2a2860','#d4709a','#463f7a','#2b2552','#4b3e5a','#392e47',1,2],
['#050918','#1a2a55','#18233f','#0d1630','#1e2b3b','#152131',2,2],
['#000006','#04051a','#15162b','#0b0c1e','#74747f','#5a5a64',3,3]];
const theme=i=>i<10?0:i<22?1:i<34?2:i<47?3:4;
// 수학편 배경: 필쌤 시안의 장별 하늘·땅 색 + 별 + 떠다니는 수식 + 칠판 그림자
const MATH_BG=[{sky:['#0b0820','#140f35','#1d1647','#2a1d57'],ground:['#5b4f86','#7a6daa','#4a3f72'],planet:'saturn'},
 {sky:['#14050c','#260a18','#3a1126','#4a1530'],ground:['#6b3a4f','#8c5068','#552c3e'],planet:'red'},
 {sky:['#020208','#07051a','#0d0826','#120a2e'],ground:['#2c2550','#4b3f86','#221c40'],planet:'galaxy'}];
const MATH_FLOAT=['π','∑','∫','√','∞','÷','×','=','x²','sin','dy/dx','a+b','%','!'];
function mathBg(){
  const M=MATH_BG[CH-MATH_CH0],t=S.t,bh=GY/M.sky.length;
  M.sky.forEach((c,i)=>{g.fillStyle=c;g.fillRect(-20,i*bh-2,W+40,bh+4);});
  g.fillStyle='#fff';for(let i=0;i<70;i++){if(Math.sin(t*2+i)>-0.3){const big=i%9===0;g.fillRect((i*137.5)%W,(i*71.3)%(GY-30),big?3:2,big?3:2);}}
  if(M.planet==='saturn'){g.fillStyle='#e8b04a';g.beginPath();g.arc(660,62,22,0,7);g.fill();g.fillStyle='#c48a2c';g.fillRect(641,65,38,6);g.strokeStyle='#ffd34d';g.lineWidth=4;g.beginPath();g.ellipse(660,62,40,8,-0.3,0,7);g.stroke();}
  else if(M.planet==='red'){g.fillStyle='#d9573f';g.beginPath();g.arc(660,68,30,0,7);g.fill();g.fillStyle='#a8402f';g.beginPath();g.arc(651,60,7,0,7);g.arc(672,78,5,0,7);g.fill();}
  else{g.save();g.translate(650,76);g.rotate(t*0.2);for(let k=0;k<3;k++){g.strokeStyle=k%2?'#9a6bff':'#c9a6ff';g.lineWidth=4;g.beginPath();g.ellipse(0,0,52-k*13,19-k*4,0,k*2,k*2+3.6);g.stroke();}g.fillStyle='#e0d4ff';g.beginPath();g.arc(0,0,7,0,7);g.fill();g.restore();}
  // 떠다니는 수식
  g.save();g.font='bold 22px "Times New Roman",serif';g.textAlign='center';
  for(let i=0;i<9;i++){const x=((i*113+t*(6+i%3*3))%(W+120))-60,y=40+(i*47)%150+Math.sin(t*0.8+i)*6;g.globalAlpha=0.16+0.08*Math.sin(t+i);g.fillStyle=i%2?'#ffe066':'#7fd4ff';g.fillText(MATH_FLOAT[(i+CH)%MATH_FLOAT.length],x,y);}g.restore();
  // 멀리 보이는 칠판들
  g.fillStyle='#0000002a';for(let i=0;i<5;i++){const x=i*170+30;g.fillRect(x,GY-70-(i%2)*14,110,56);}
  g.fillStyle=M.ground[0];g.fillRect(-20,GY,W+40,60);g.fillStyle=M.ground[1];g.fillRect(-20,GY,W+40,4);
  g.fillStyle=M.ground[2];[[90,GY+22,24],[310,GY+16,14],[470,GY+30,20],[690,GY+20,16]].forEach(([x,y,r])=>{g.beginPath();g.ellipse(x,y,r,r*0.3,0,0,7);g.fill();});
  let rg=g.createRadialGradient(40,GY-40,10,40,GY-40,200);rg.addColorStop(0,'#ff3b3b44');rg.addColorStop(1,'#ff3b3b00');g.fillStyle=rg;g.fillRect(0,0,300,300);
  rg=g.createRadialGradient(W-40,GY-40,10,W-40,GY-40,200);rg.addColorStop(0,'#3bb0ff44');rg.addColorStop(1,'#3bb0ff00');g.fillStyle=rg;g.fillRect(W-300,0,300,300);
}
function bg(){
  if(isMathCH(CH)){mathBg();return;}
  const th=theme(stageIdx),B=BGT[th],t=S.t;
  const gr=g.createLinearGradient(0,0,0,GY);gr.addColorStop(0,B[0]);gr.addColorStop(1,B[1]);g.fillStyle=gr;g.fillRect(-20,-20,W+40,340);
  if(B[6]){const n=[0,26,64,120][B[6]];g.fillStyle='#fff';for(let i=0;i<n;i++){g.globalAlpha=0.3+0.7*Math.abs(Math.sin(t*1.4+i*1.7));const big=i%9===0;g.fillRect((i*97.3)%W,(i*53.7)%(GY-70),big?3:2,big?3:2);}g.globalAlpha=1;}
  if(B[7]<2){const rg=g.createRadialGradient(650,70,6,650,70,95);rg.addColorStop(0,B[7]?'#fff2c0':'#fffbe0');rg.addColorStop(1,'#fff0');g.fillStyle=rg;g.fillRect(540,0,230,190);
    g.fillStyle=B[7]?'#ffe08a':'#fff6c8';g.beginPath();g.arc(650,70,B[7]?38:30,0,7);g.fill();}
  else if(B[7]===2){g.fillStyle='#f4f1d8';g.beginPath();g.arc(650,66,26,0,7);g.fill();g.fillStyle='#d9d5b6';[[640,58,6],[660,72,5],[652,52,3]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});}
  else{const rg=g.createRadialGradient(640,76,30,640,76,80);rg.addColorStop(0,'#6fa8ff66');rg.addColorStop(1,'#6fa8ff00');g.fillStyle=rg;g.fillRect(540,0,200,170);
    g.fillStyle='#2f6fd6';g.beginPath();g.arc(640,76,44,0,7);g.fill();g.fillStyle='#4caf5a';[[626,64,14],[652,88,12],[640,58,8]].forEach(([x,y,r])=>{g.beginPath();g.arc(x+Math.sin(t*0.3)*3,y,r,0,7);g.fill();});
    g.fillStyle='#ffffffaa';g.beginPath();g.ellipse(650+Math.sin(t*0.5)*4,66,16,4,0.3,0,7);g.fill();}
  if(th<3){g.fillStyle=th===0?'#ffffffcc':th===1?'#ffe6c2aa':'#9c7fb866';
    for(let i=0;i<5;i++){const x=((i*230+t*(9+i*2))%(W+260))-130,y=26+(i*22)%90;[[0,0,46,14],[26,-8,30,14],[-24,-5,28,11]].forEach(([dx,dy,rx,ry])=>{g.beginPath();g.ellipse(x+dx,y+dy,rx,ry,0,0,7);g.fill();});}}
  const hills=(col,base,amp,sp,f1,f2,off)=>{g.fillStyle=col;g.beginPath();g.moveTo(-20,GY);for(let x=-20;x<=W+20;x+=8){const xx=x+t*sp+off;g.lineTo(x,base-amp-amp*0.6*Math.sin(xx*f1)-amp*0.4*Math.sin(xx*f2+off));}g.lineTo(W+20,GY);g.closePath();g.fill();};
  hills(B[2],GY-30,30,3,0.011,0.027,1);
  if(th===4)hills(B[3],GY-8,16,0,0.05,0.13,3);
  else if(th>=2){const col=B[3];g.fillStyle=col;for(let i=0;i<22;i++){const bw=30+(i*13%20),bh=44+((i*37)%70),x=i*38-10,y=GY-bh;g.fillRect(x,y,bw,bh);
      if(th===3){for(let wy=y+8;wy<GY-8;wy+=14)for(let wx=x+5;wx<x+bw-6;wx+=10){if(((wx*7+wy*3+Math.floor(t*0.6+wx))%5)<2){g.fillStyle='#ffe9a0';g.fillRect(wx,wy,4,6);g.fillStyle=col;}}}}}
  else hills(B[3],GY-6,22,7,0.017,0.041,5);
  g.fillStyle=B[4];g.fillRect(-20,GY,W+40,60);g.fillStyle=B[5];for(let x=0;x<W;x+=40){g.fillRect(x+(GY%7),GY+9,22,3);g.fillRect(x+14,GY+26,18,3);}
  g.fillStyle='#ffffff30';g.fillRect(-20,GY,W+40,2);
  if(th===4){g.fillStyle=B[5];[[120,GY+18,26],[430,GY+32,34],[700,GY+14,20]].forEach(([x,y,r])=>{g.beginPath();g.ellipse(x,y,r,r*0.28,0,0,7);g.fill();});}
  let rg=g.createRadialGradient(40,GY-40,10,40,GY-40,200);rg.addColorStop(0,'#ff3b3b55');rg.addColorStop(1,'#ff3b3b00');g.fillStyle=rg;g.fillRect(0,0,300,300);
  rg=g.createRadialGradient(W-40,GY-40,10,W-40,GY-40,200);rg.addColorStop(0,'#3bb0ff55');rg.addColorStop(1,'#3bb0ff00');g.fillStyle=rg;g.fillRect(W-300,0,300,300);
  g.fillStyle=th===1?'#f0d49a99':th===4?'#ffffff44':'#ffffff66';
  for(let i=0;i<16;i++){g.fillRect(((i*71+t*(25+i%5*9))%(W+40))-20,GY-6-(i*29%90)+Math.sin(t*2+i)*6,3,2);}
}
function draw(){
  g.clearRect(0,0,W,300);
  g.save();if(S.shake>0)g.translate((Math.random()-.5)*S.shake*14,(Math.random()-.5)*S.shake*10);
  bg();drawEnemyBase(10,150);drawCan(W-60,150);
  castleHpText(Math.ceil(S.en.hp)+' / '+Math.round(S.en.max),Math.ceil(S.my.hp)+' / '+Math.round(S.my.max));
  for(const d of S.dust){const q=d.t/0.4;g.globalAlpha=0.5*(1-q);g.fillStyle='#efe3c4';g.fillRect(d.x-2-q*6,GY-3-q*9,4+q*6,3+q*2);}g.globalAlpha=1;
  for(const u of S.units)dsp(u,0);
  for(const f of S.fx)dsp(f.u,f.t);
  for(const sp2 of S.spk){const q=sp2.t/0.25;g.globalAlpha=1-q;g.fillStyle=sp2.col||'#fff6a0';const r=3+q*12;g.save();g.globalAlpha=1-q;g.fillRect(sp2.x-r,sp2.y-1,r*2,2);g.fillRect(sp2.x-1,sp2.y-r,2,r*2);g.restore();}g.globalAlpha=1;
  for(const r of S.ring){const q=r.t/0.8;g.save();g.globalAlpha=Math.max(0,1-q);g.strokeStyle=r.ally?'#75d9ff':'#ff5a3a';g.lineWidth=r.ally?4:7;g.beginPath();g.ellipse(r.x,GY,q*(r.ally?110:760),6+q*(r.ally?60:34),0,0,7);g.stroke();g.restore();}
  for(const p of S.pop){const q=p.t/0.7,y=GY-80-q*28;g.save();g.globalAlpha=Math.max(0,1-q*q);g.font='bold 13px sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000b';g.strokeText(p.s,p.x,y);g.fillStyle=p.c;g.fillText(p.s,p.x,y);g.restore();}
  for(const p of S.pj){const q=p.t/p.dur,x=p.x0+(p.tx-p.x0)*q,y=135+(GY-16-135)*q-90*Math.sin(q*Math.PI);
    g.save();g.translate(x,y);g.rotate(q*12);g.fillStyle='#8a8f98';g.fillRect(-9,-9,18,18);g.fillStyle='#d9c27a';g.fillRect(-4,-12,6,6);g.fillStyle='#6aa84f';g.fillRect(3,2,7,7);g.fillStyle='#c0392b';g.fillRect(-10,3,6,6);g.restore();}
  for(const b of S.bm){const q=b.t/0.5;g.save();g.globalAlpha=1-q;g.fillStyle='#b9a26a';g.beginPath();g.arc(b.x,GY,70*Math.min(1,q*4),Math.PI,2*Math.PI);g.fill();
    ['#8a8f98','#d9c27a','#6aa84f','#c0392b'].forEach((c,i)=>{for(let j=0;j<2;j++){const a=(i*2+j)*Math.PI/4,r=20+q*80;g.fillStyle=c;g.fillRect(b.x+Math.cos(a)*r-4,GY-20+Math.sin(a)*r*0.8-4-q*20,8,8);}});g.restore();}
  g.restore();
  if(S.bw>0){g.save();g.globalAlpha=Math.min(1,S.bw*1.2);g.fillStyle='#ff2a1a22';g.fillRect(0,0,W,300);txt('⚠ BOSS ⚠',W/2,110,46);g.restore();}
  if(S.over){g.fillStyle='#000a';g.fillRect(0,0,W,300);g.fillStyle='#fff';g.font='bold 40px sans-serif';g.textAlign='center';
    g.fillText(S.over==='win'?'승리!':'패배...',W/2,100);g.font='18px sans-serif';
    if(S.over==='win')g.fillText('XP +'+S.xpg.toLocaleString()+'  (보유 '+xp.toLocaleString()+')',W/2,134);
    if(S.drop)g.fillText(S.drop,W/2,162);
    if(S.drop2){g.fillStyle='#ffe27a';g.fillText(S.drop2,W/2,188);g.fillStyle='#fff';}
    g.fillText('화면을 누르면 '+(S.over==='win'?'스테이지 선택으로':'다시 도전'),W/2,226);}
  // DOM 재배치는 모바일 렌더링 비용이 커서 0.12초에 한 번만 갱신합니다.
  const uiNow=performance.now();if(draw.uiLast && uiNow-draw.uiLast<120)return;draw.uiLast=uiNow;
  $('money').textContent=Math.floor(S.money)+' / '+S.maxM+'원';
  {const wb=$('wk'),cost=Math.round(S.wl*80*(1-0.2*basicProgress('accounting')));wb.innerHTML=S.wl>=8?'도령<br>Lv8 MAX':'도령 Lv'+S.wl+'<br>'+cost+'원<br><small>[W]</small>';wb.disabled=!!S.over||S.wl>=8||S.money<cost;}
  {const cb=$('cn'),rd=S.cn>=1,pc=Math.floor(S.cn*100);cb.innerHTML=rd?'쓰레기포<br>발사!<br><small>[E]</small>':'쓰레기포<br>'+pc+'%';
    cb.style.background=rd?'':'linear-gradient(to top,#ffd84a '+pc+'%,#3a4250 '+pc+'%)';cb.style.color=rd?'':'#fff';cb.disabled=!!S.over;}
  SL.forEach((k,i)=>{const u=MY[k],b=slotEls[i],cd=S.cool[k];if(!u||!b._cd)return;
    b.disabled=!!S.over;b._cd.style.height=cd>0?Math.min(100,cd/unitCooldown(u)*100)+'%':'0';b.classList.toggle('poor',S.money<Math.round(fm(u).cost*S.cm));});
}
$('c').addEventListener('click',()=>{if(!S||!S.over)return;
  if(S.over==='win'){const wasVTS=!!S.vtsMode;cancelAnimationFrame(raf);S=null;if(wasVTS){buildVTSStages();show('vtsSelect');}else{buildGrid();show('select');}}else if(S.retry)S.retry();else if(S.vtsMode)startVTSStage(stageIdx);else startStage(stageIdx);});
function loop(n){
  if(!S)return;
  // 모바일 30FPS 목표: 게임시간(dt)은 경과한 실제 시간을 사용해 전투 속도 유지.
  // 화면을 그리지 않을 때는 레이아웃/이펙트 재계산도 건너뜁니다.
  if(matchMedia('(pointer:coarse)').matches&&n-last<33){raf=requestAnimationFrame(loop);return;}
  const dt=Math.min(.06,Math.max(0,(n-last)/1000));last=n;
  if(!S.paused){
    update(dt);
    // 두 번의 시뮬레이션 단계로 실제 이동/공격/쿨타임/자원 모두 2배속 처리
    if(speedUp&&!S.over)update(dt);
  }
  draw();raf=requestAnimationFrame(loop);
}