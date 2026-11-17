// 건우 대전쟁 · 09-stage-selection-formation.js
// ════════ 스테이지 선택 / 보물 ════════

const STAGE_FLAGS=['🇰🇷','🇲🇳','🇨🇳','🇹🇭','🇰🇭','🇵🇭','🇯🇵','🇦🇺','🇸🇬','🇲🇻','🇮🇳','🇳🇵','🇦🇪','🇸🇦','🇰🇪','🇲🇬','🇿🇦','🇬🇭','🏜️','🇪🇬','🇹🇷','🇷🇺','🇬🇷','🇮🇹','🇲🇨','🇪🇸','🇫🇷','🇩🇪','🇩🇰','🇳🇴','🇬🇧','🇬🇱','🇨🇦','🗽','🇧🇲','🇯🇲','🇨🇴','🇧🇷','🇦🇷','🇵🇪','🗿','🇲🇽','🚀','🇺🇸','🎬','🏔️','🌺','🌕'];
function stageFlag(i){return STAGE_FLAGS[i]||'🌍';}

function buildGrid(){
  $('cur').textContent='👤'+(user?user.name:'게스트')+'  🎫'+tk+' 🌟'+rt+' 💎'+em+(CH>=3?' ⚡'+currentEnergy()+'/'+maxEnergy():'');
  const tb=$('chtab');tb.innerHTML='';
  (CH>=3?[3,4,5]:[0,1,2]).forEach(c=>{const b=document.createElement('button'),lk=c>=(CH>=3?4:1)&&!cleared[(c-1)*100+47];
    b.textContent=(lk?'🔒 ':'')+(c%3+1)+'장 (적 ×'+CHM[c]+')';b.disabled=lk;if(c===CH)b.className='on';b.onclick=()=>{CH=c;buildGrid();};tb.appendChild(b);});
  const gr=$('grid');gr.innerHTML='';
  STS[CH].forEach((s,i)=>{const b=document.createElement('button'),lock=i>0&&!cleared[ck(i-1)];if(cleared[ck(i)])b.className='cl';
    b.title=s[0];b.innerHTML='<b>'+(i+1)+'</b><span class="stage-flag">'+stageFlag(i)+'</span><span class="stage-name">'+s[0]+'</span>'+(lock?'<span class="stage-ok">🔒</span>':(cleared[ck(i)]?'<span class="stage-ok">✓</span>':''))+(stageTreasure(CH,i).some(t=>hasTreasure(CH,t))?'<span class="tre-badge" title="보물 획득">★</span>':'');b.disabled=lock;b.onclick=()=>startStage(i);gr.appendChild(b);});
}
const tdone=s=>setDone(CH,s);
function buildTr(){
  const sets=treasureChapter>=3?F_TSETS:TSETS,items=sets.flatMap(x=>x.items);const n=items.filter(t=>hasTreasure(treasureChapter,t)).length;
  $('trl').innerHTML='<div class="chtab" id="treTabs"></div><p><small>'+(treasureChapter>=3?'미래편 ':'세계편 ')+(treasureChapter%3+1)+'장 보물 '+n+' / '+items.length+' · 스테이지마다 지정된 보물이 있으며 승리 시 50% 확률로 획득합니다. 각 보물은 조금씩 효과가 누적됩니다.</small></p><div style="height:6px"></div>'+sets.map(set=>{
    const got=treasureCount(treasureChapter,set.items),done=got===set.items.length;
    return '<div class="tr"><b>'+set.name+'</b> '+(done?'<span style="color:#1d7a2a;font-weight:900">✔ 올보물</span>':'<small>('+got+' / '+set.items.length+')</small>')+'<br><small>'+set.eff+'</small><br>'+set.items.map(item=>'<button type="button" class="tit treasure-jump'+(hasTreasure(treasureChapter,item)?' on':'')+'" data-stage="'+(items.indexOf(item)%48)+'" title="해당 스테이지로 이동">'+(hasTreasure(treasureChapter,item)?item:'???')+'</button>').join('')+'</div>';}).join('');
  (CH>=3?[3,4,5]:[0,1,2]).forEach(ch=>{const b=document.createElement('button');b.textContent=(ch%3+1)+'장';b.className=ch===treasureChapter?'on':'';b.onclick=()=>{treasureChapter=ch;buildTr();};$('treTabs').appendChild(b);});
  $('trl').querySelectorAll('.treasure-jump').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.stage,ch=treasureChapter;if((ch>0&&ch!==3&&!cleared[(ch-1)*100+47])||(ch===3&&!cleared[47])){toast(ch+'장을 클리어하지 않아 '+(ch+1)+'장 스테이지가 잠겨 있어요.');return;}if(i>0&&!cleared[ch*100+i-1]){toast('아직 열리지 않은 스테이지예요. 이전 스테이지를 먼저 클리어하세요.');return;}CH=ch;buildGrid();show('select');startStage(i);}));
}

let SL=[],gres=null;
const lvCap=()=>cleared[247]?30:cleared[147]?20:10; // XP 레벨 상한, +레벨은 무제한
const lvCost=(u,L)=>Math.round(120*L*(0.7+0.3*L)*TM[u.t]/10)*10;
const avail=u=>u.t==='N'?(u.unlock==null||!!cleared[u.unlock]||!!own[u.id]):!!own[u.id];
const lockTxt=u=>u.id.startsWith('vts_')?u.name+' 전용 VTS 스테이지 승리 보상':u.t==='N'?(u.unlock+1)+'번 맵 클리어 또는 일반 뽑기':u.t==='EX'?({'fist':'1','cornbar':'2','healthytooth':'3'}[u.id]||'1')+'장 마지막 스테이지 보스를 쓰러뜨리면 획득':'레어 뽑기에서만 획득';
const totalLevel=id=>(lv[id]||1)+(plusLv[id]||0);
const evolveLevel=u=>10;
const evolutionStage=u=>{
  if(!u.f2||totalLevel(u.id)<10)return 1;
  const choice=fsel[u.id];
  if(choice===1)return 1;
  if(u.t==='EX'&&u.f3&&(lv[u.id]||1)>=20&&cleared[({'fist':347,'cornbar':447,'healthytooth':547}[u.id]||9999)]){return choice===22?2:3;}
  if(u.t==='N'&&u.f3&&totalLevel(u.id)>=30){
    // 기존 2형 저장값은 3형 자동 진화를 막지 않습니다. 2형 고정은 별도 값 22.
    return choice===22?2:3;
  }
  return 2;
};
const f2on=id=>{const u=MY.find(x=>x.id===id);return !!(u&&evolutionStage(u)>=2);};
const lm=id=>{const u=MY.find(x=>x.id===id),stage=u?evolutionStage(u):1;
  return (1+0.1*(totalLevel(id)-1))*(stage===3?1.5:stage===2?1.25:1);
};
const fm=u=>{const stage=evolutionStage(u);
  return stage===3?Object.assign({},u,u.f2,u.f3,{f:3,s:u.s}):
    stage===2?Object.assign({},u,u.f2,{f:2,s:u.s}):u;
}; // 기본: 10레벨 2형, 30레벨 3형. 비기본: 10레벨 2형.
const tnm=(id,k)=>1+0.05*((tn[id]||{})[k]||0);
const fl=()=>(form.length?form:MY.map(u=>u.id)).filter(id=>{const u=MY.find(x=>x.id===id);return u&&avail(u);}).slice(0,10);
function ico(u){
 const v=fm(u),cv=document.createElement('canvas');cv.className='ic';
 cv.width=(v.spriteW||Math.max(...v.grid.map(r=>r.length)))*v.s;
 cv.height=(v.spriteH||v.grid.length)*v.s;
 const paint=()=>{const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);drawUnitSprite(c,v,0,0,v.s,false);};
 paint();const pic=unitSpriteImage(v);if(pic&&!pic.complete)pic.addEventListener('load',paint,{once:true});
 return cv;
}
function tbadge(ty){return ty.map(t=>'<span class="tag" style="background:'+TCOL[t]+(t==='블랙'||t==='악마'?';color:#fff':'')+'">'+t+'</span>').join('');}
const tier=u=>'<span class="tag" style="background:'+TIERC[u.t]+'">'+TIERN[u.t]+'</span>';
$('goForm').onclick=()=>{buildForm();show('form');};
$('goGa').onclick=()=>{gres=null;gst={mode:'idle',t0:0,kind:'n'};show('gacha');buildGa();gStart();};
$('goQ').onclick=()=>{buildQ();show('quest');};
document.querySelectorAll('.bk').forEach(b=>b.onclick=()=>{buildGrid();show('select');});
let formCategory='N';
function buildForm(){
 const current=fl(),bar=$('formationBar'),tabs=$('formTabs'),box=$('forml');
 $('fc').textContent=current.length+'/10 · 꾹 눌러 이동';bar.innerHTML='';tabs.innerHTML='';box.innerHTML='';
 [['N','기본'],['EX','EX'],['R','레어'],['SR','슈퍼레어'],['UR','울슈레']].forEach(([k,n])=>{const b=document.createElement('button');b.textContent=n;b.className=k===formCategory?'on':'';b.onclick=()=>{formCategory=k;buildForm();};tabs.appendChild(b);});
 const assign=(id,idx)=>{let a=fl().slice().filter(x=>x!==id);if(idx!=null&&idx>=0){if(a[idx])a.splice(idx,1,id);else a.splice(idx,0,id);}else if(a.length<10)a.push(id);form=a.slice(0,10);save();buildForm();};
 const drag=(el,id)=>{el.draggable=true;el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',id);});let timer=null,active=false;
   el.addEventListener('pointerdown',e=>{active=false;timer=setTimeout(()=>{active=true;el.style.opacity='.55';toast('편성칸으로 끌어 놓거나 원하는 칸을 눌러 배치하세요.');},420);});
   el.addEventListener('pointerup',e=>{clearTimeout(timer);el.style.opacity='';if(active){const xy=document.elementFromPoint(e.clientX,e.clientY),slot=xy&&xy.closest('[data-slot]');if(slot)assign(id,+slot.dataset.slot);}});
   el.addEventListener('pointercancel',()=>clearTimeout(timer));el.addEventListener('pointermove',e=>{if(e.buttons===0)clearTimeout(timer);});};
 for(let i=0;i<10;i++){const btn=document.createElement('button');btn.dataset.slot=i;const id=current[i],u=MY.find(x=>x.id===id);if(u){btn.appendChild(ico(u));btn.append(document.createTextNode(fm(u).name));}else btn.textContent=(i+1)+'번 빈칸';
 btn.onclick=()=>{if(id){form=current.filter(x=>x!==id);save();buildForm();}};
 btn.addEventListener('dragover',e=>e.preventDefault());btn.addEventListener('drop',e=>{e.preventDefault();const dragged=e.dataTransfer.getData('text/plain');if(dragged)assign(dragged,i);});bar.appendChild(btn);}
 MY.filter(u=>u.t===formCategory).forEach(u=>{const d=document.createElement('div');d.className='tr';d.appendChild(ico(u));const info=document.createElement('div'),idx=current.indexOf(u.id);info.innerHTML='<b>'+fm(u).name+'</b><small>Lv'+(lv[u.id]||1)+(plusLv[u.id]?' +'+plusLv[u.id]:'')+'</small>';
 if(avail(u)){const b=document.createElement('button');b.textContent=idx>=0?'편성 '+(idx+1):'편성하기';b.onclick=()=>assign(u.id,null);info.appendChild(b);drag(d,u.id);}else info.innerHTML+='<small>🔒 미획득</small>';d.appendChild(info);box.appendChild(d);});
}

