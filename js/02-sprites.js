// 건우 대전쟁 · 02-sprites.js
// ════════ 팔레트 / 스프라이트 ════════
const PAL={K:'#1b2430',B:'#5f7f99',S:'#c5d3de',L:'#eef3f7',E:'#ffffff',P:'#101010',C:'#888',A:'#ccc',D:'#555',H:'#ddd',W:'#ffffff',Y:'#ffd84a',R:'#e0402a',O:'#ff9a3c',M:'#aab6c4',N:'#5a6573'};
function shade(hex,p){const n=parseInt(hex.slice(1),16),r=n>>16,g1=(n>>8)&255,b=n&255,f=c=>Math.max(0,Math.min(255,Math.round(p<0?c*(1+p):c+(255-c)*p)));return '#'+((1<<24)+(f(r)<<16)+(f(g1)<<8)+f(b)).toString(16).slice(1);}
function cp(col,acc){return {C:col,A:acc||'#ccc',D:shade(col,-0.3),H:shade(col,0.35)};}
const pl=v=>v.pal||(v.col?cp(v.col,v.acc):null);
function spr(grid,x,y,s,flip,col,c2){c2=c2||g;
  const w=Math.max(...grid.map(r=>r.length)),pal=Object.assign({},PAL,col||{});
  grid.forEach((row,j)=>{for(let i=0;i<row.length;i++){const ch=row[i];if(ch==='.')continue;
    c2.fillStyle=pal[ch];c2.fillRect(Math.round(x+(flip?w-1-i:i)*s),Math.round(y+j*s),s,s);}});
}
const g=$('c').getContext('2d');g.imageSmoothingEnabled=false;

// 진화(폼 체인지) 장식: 왕관·뿔·날개·불꽃·갑옷·망토·가시·후광·방패를 얹어서 겉모습을 크게 바꿔요
function deco(g0,kinds){
  const w=Math.max(...g0.map(r=>r.length)),TP=5,LP=4,RP=3,H=g0.length+TP,Wd=w+LP+RP,a=[];
  for(let y=0;y<H;y++)a.push(Array(Wd).fill('.'));
  g0.forEach((r,y)=>{for(let x=0;x<r.length;x++)a[y+TP][x+LP]=r[x];});
  const set=(x,y,c)=>{if(y>=0&&y<H&&x>=0&&x<Wd&&a[y][x]==='.')a[y][x]=c;};
  const top=a.findIndex(r=>r.some(c=>c!=='.')),row=a[top];
  let x1=row.findIndex(c=>c!=='.'),x2=Wd-1-[...row].reverse().findIndex(c=>c!=='.');
  const tc=(x1+x2)>>1,mid=top+((H-top)>>1);
  let minX=Wd,maxX=0;a.forEach(r=>{const f=r.findIndex(c=>c!=='.');if(f>=0&&f<minX)minX=f;const l=Wd-1-[...r].reverse().findIndex(c=>c!=='.');if(l>maxX)maxX=l;});
  kinds.forEach(k=>{
    if(k==='crown'){for(let i=-2;i<=2;i++)set(tc+i,top-1,'Y');[-2,0,2].forEach(i=>set(tc+i,top-2,'Y'));set(tc,top-1,'R');}
    else if(k==='horns'){set(x1,top-1,'W');set(x1-1,top-2,'W');set(x1-1,top-3,'W');set(x2,top-1,'W');set(x2+1,top-2,'W');set(x2+1,top-3,'W');}
    else if(k==='flame'){for(let x=x1;x<=x2;x++){const hh=2+((x*7)%3);for(let j=1;j<=hh;j++)set(x,top-j,j===hh?'Y':'O');}}
    else if(k==='wings'){for(let j=0;j<6;j++)for(let i=0;i<3;i++)set(minX+2-j+i,mid-2-j,i===0?'K':'W');for(let j=0;j<4;j++)for(let i=0;i<3;i++)set(minX+4-j+i,mid-1-j,'W');}
    else if(k==='armor'){for(let y=mid-1;y<H-1;y++)for(let x=0;x<Wd;x++){const c=a[y][x],m={C:'M',B:'M',S:'W',L:'W',D:'N',H:'W'}[c];if(m)a[y][x]=m;}set(x1,top+1,'N');set(x2,top+1,'N');}
    else if(k==='cape'){for(let y=mid;y<H-1;y++)set(minX-1,y,'R');for(let y=mid+1;y<H-1;y++)set(minX-2,y,'R');set(minX-3,H-3,'R');}
    else if(k==='spikes'){for(let x=x1;x<=x2;x+=2)set(x,top-1,'M');}
    else if(k==='antenna'){set(tc,top-1,'K');set(tc,top-2,'K');set(tc,top-3,'Y');set(tc-1,top-3,'Y');set(tc+1,top-3,'Y');set(tc,top-4,'Y');}
    else if(k==='ring'){for(let i=-3;i<=3;i++)set(tc+i,top-3,i===-3||i===3?'.':'Y');set(tc-3,top-2,'Y');set(tc+3,top-2,'Y');}
  });
  return a.map(r=>r.join('').replace(/\.+$/,''));
}

// ── 아군 스프라이트 (오른쪽을 보고 있고, 전투에서는 좌우 반전돼요)
const FISH=["......KKKKKKKK","....KKBBBBBBBBKK","K..KBBBBBBBBBBBBKK","KK.KBBBBBBBBBBBBBBKK","KKKKSSSSSSSSSSSSSSEPKK","KKKKSSSSSSSSSSSSSSSSSK",".KKKLLLLLLLLLLLLLLLLKK","..K.KLLLLLLLLLLLLLLKK","....KKLLLLLLLLLLKK","......KKKKKKKKKK"];
const CAN=["....KK....",".KKKKKKKK.","KSSSSSSSSK",".KBEPBEPK.",".KBBBBBBK.",".KBLBLBLK.",".KBBBBBBK.",".KBLBLBLK.","..KKKKKK.."];
const SQUID=[".....KK.....","....KCCK....","...KCCCCK...","..KACCCCAK..","..KACCCCAK..",".KKCCCCCCKK.","KCEPCCCCEPCK","KCCCCCCCCCCK",".KCCCCCCCCK.","..KCKCCKCK..",".KCK.KK.KCK.",".KC..K.K..CK"];
const KRAKEN=[".........KKKKKK.........",".......KKCCHHCCKK.......","......KCCCCCCCCCCK......",".K...KCCEPCCCCEPCCK...K.","KCK..KCCCCCCCCCCCCK..KCK","KCCK.KDCCCAAAACCCDK.KCCK",".KCCK.KDCCCCCCCCDK.KCCK.",".KCCKK.KKDDDDDDKK.KKCCK.","KCCK.KCK.KCCCCK.KCK.KCCK","KCK.KCCK.KCCCCK.KCCK.KCK","KCK.KCK..KCCCCK..KCK.KCK","KCCKKCCK.KCKKCK.KCCKKCCK",".KCCKCK..KCK.KCK..KCKCCK.","..KKCCK.KCCK.KCCK.KCCKK..","...KKK..KKK...KKK..KKK..."];
const DORA=["...KKKK...","..KCCCCK..",".KCCACCCK.",".KCEPCEPK.",".KCCCCCCK.","..KCKKCK..",".KCCACCCK.","KCCCCCACCK","KCACCCCCCK",".KCCCCACK.",".KCCACCCK.","..KCCCCK..","..KCCKCK..","..KK..KK.."];
const ORB=["....KKKK....","..KKCCCCKK..",".KCCAACCCCK.",".KCAAACCCCK.","KCCAACCCCCCK","KCCCCCCACCCK","KCCCCCCAACCK","KCCCCCCCCCCK",".KCCCCCCCCK.",".KKCCCCCCKK.","..KKCCCCKK..","....KKKK...."];
const FROG=["..KKKK..KKKK..",".KEPEK..KEPEK.","KCCKKKKKKKKCCK","KCCCCCCCCCCCCK","KCCCCCCCCCCCCK","KCKKKKKKKKKKCK","KCAAAAAAAAAACK",".KAAAAAAAAAAK.","KKCK.KKKK.KCKK","KKK........KKK"];
const MACK=["....KKKKKKK....","..KKCCHHHCCKK..","K.KCCCCCCCCCCKK","KKKCCCCCCCCCEPK","KKKDDCCCCCCCCCK","K.KAADDDCCCCCK.","..KKAAAADDDKK..","....KKKKKKK...."];
const CLAM=["..KKKKKKKK..",".KHHCCCCCCK.","KHCCDCCDCCCK","KCCCDCCDCCCK","KKKKKKKKKKKK","KAEPAAAAEPAK","KAAAAAAAAAAK",".KAAAAAAAAK.","..KKKKKKKK.."];
const PUFF=["..K.KKK.K..",".K.KCCCK.K.","..KCHCCCK..",".KCCCCCCCK.","KCEPCCCEPCK","KCCCCKKCCCK","KDCCCCCCCDK",".KDACCCADK.","K.KDDDDDK.K","..K.KKK.K.."];
const OCTO=["....KKKK....","..KKHHCCKK..",".KHCCCCCCCK.","KCCEPCCEPCCK","KCCCCCCCCCCK","KDCCCAACCCDK",".KDCCCCCCDK.","KCK.KCCK.KCK","KCK.KCCK.KCK",".KCK..K..KCK","..KK.....KK."];
const CRAB=["KK..........KK","KCK........KCK","KCCK.KKKK.KCCK",".KCKKCCCCKKCK.","..KCCEPCEPCCK.","..KCCCCCCCCCK.","..KDCCCCCCDK..",".K.KDDDDDDK.K.","K..K.K..K.K..K"];
const RAY=["................","....KKKKKKKK....","..KKCCCCCCCCKK..",".KCCHHCCCCCCCCK.","KCCCCCCCCCCEPCCK",".KDDCCCCCCCCDDK.","..KKDDDDDDDDKK..","K.....KKKK.....K"];
const SHARK=[".........K......","........KCK.....","......KKKCKK....","..KKKKCCCCCCKK..","KKCCCCCHHCCCCCK.","KCCCCCCCCCCCEPCK","KKCCCCCCCCCCCCK.",".KKDDDDDDDDDDKK.","..KKAAAAAAAAKK..","....KKKKKKKK...."];
const HORSE=["...KKK...","..KCCCKK.",".KCEPCCCK",".KCCCCKKK","..KCCK...",".KCCCCK..",".KCDDCCK.",".KCCCCK..","..KCCDK..","..KDCCK..","..KCCDK..",".KCDDK...",".KCCK....","..KKK...."];
const TURTLE=["....KKKKKK......","..KKCCHHCCKK.KK.",".KCCDCCCCDCCKAAK","KCCDDCCCCDDCKEPK","KDDDDDDDDDDDKAAK",".KKAAAAAAAAKKKK.","..KAK.KAK.KAK...","..KKK.KKK.KKK..."];
const EEL=[".KK...KKKK......","KCCK.KCCCCK..KK.",".KCCKCCHHCCKKCCK","..KCCCCCCCCCCEPK","...KKDDDCCCCCCK.",".....KKKDDDDKK..",".......KKKKK...."];
const SHRIMP=["....KKKKK.....","..KKCCCCCKK...",".KCCHHCCCCKK.K","KCCCCCCCCCCKEP","KCDDCCCCCCCCKK","KDDKDDCCCCCK..",".KK.KDDDDDK...","...KAAK.KAAK..","..KAAK...KAAK."];
const FIGHT=["...KAAAAK...","..KHHCCCCK..","..KCCEPCCK..","...KCCCCK...",".KKKCCCCKKK.","KAAAKCCKAAAK","KAAAKCDDKAAK",".KKKKCCCKKK.","....KCCCK...","...KDDKDDK..","...KDK.KDK..","..KKKK.KKKK."];



// VTS 전용 투명 픽셀아트 PNG를 그릴 때 사용하는 공용 캐시.
const VTS_IMAGE_CACHE=Object.create(null);
function unitSpriteImage(u){
  if(!u||!u.sprite)return null;
  if(!VTS_IMAGE_CACHE[u.sprite]){
    const pic=new Image();pic.src=u.sprite;VTS_IMAGE_CACHE[u.sprite]=pic;
  }
  return VTS_IMAGE_CACHE[u.sprite];
}
// 원본 그리드를 그려 PNG 로딩 전에도 그림이 끊기지 않게 합니다.
function drawUnitSprite(c,u,x,y,s,flip){
  if(u&&u.train&&window.drawSteamTrainIcon){window.drawSteamTrainIcon(c,x,y,(u.spriteW||88)*s,(u.spriteH||42)*s,flip,u.trainSkin);return;}
  const image=unitSpriteImage(u),w=(u.spriteW||Math.max(...u.grid.map(r=>r.length)))*s,h=(u.spriteH||u.grid.length)*s;
  c.imageSmoothingEnabled=false;
  if(image&&image.complete&&image.naturalWidth){
    c.save();c.translate(x,y);
    if(!!flip!==!!u.spriteFlip){c.translate(w,0);c.scale(-1,1);}
    c.drawImage(image,0,0,w,h);c.restore();
  }else{
    spr(u.grid,x,y,s,flip,pl(u),c);
  }
}
