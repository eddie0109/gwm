// 건우 대전쟁 · 08-world-navigation.js
// ════════ 월드 선택 (로그인 직후) ════════
const WORLDS=[{n:'세계편',i:'🌏',s:'3장 · 각 48스테이지',ok:true},{n:'미래편',i:'🚀',s:'3장 · 각 48스테이지',ok:true},{n:'우주편',i:'🪐',s:'만드는 중',ok:false},{n:'레전드 스토리',i:'📜',s:'만드는 중',ok:false},{n:'건우 도장',i:'🥋',s:'친구와 프라이빗 대전',ok:true}];
function buildWorld(){
  $('wdUser').textContent='👤'+(user?user.name:'게스트');
  const w=$('wgrid');w.innerHTML='';
  WORLDS.forEach(x=>{const b=document.createElement('button');b.className='wcard'+(x.ok?'':' wip');
    b.innerHTML='<span class="wi">'+x.i+'</span><b>'+x.n+'</b><small>'+(x.ok?x.s:'🚧 만드는 중이에요')+'</small>';
    b.onclick=()=>{if(!x.ok){toast('🚧 '+x.n+'은(는) 아직 만드는 중이에요!');return;}if(x.n==='건우 도장'){show('dojo');return;}if(x.n==='미래편'&&!cleared[47]){toast('세계편 1장 달을 클리어하면 미래편이 열립니다!');return;}CH=x.n==='미래편'?3:0;buildGrid();show('select');};w.appendChild(b);});
}
// ── 적도감: 종류별 첫 조우를 계정에 저장
function buildDex(){
  const codes=Object.keys(EN),found=codes.filter(code=>seenEnemies[code]).length;
  $('dexTotal').textContent='발견 '+found+' / '+codes.length;
  const box=$('dexList');box.innerHTML='';
  codes.forEach(code=>{
    const e=EN[code],known=!!seenEnemies[code],bt=document.createElement('button');bt.className='dex-item';
    const cv=document.createElement('canvas'),scale=code==='O'||code==='C'?2:3,grid=code==='O'?CORN_EX:code==='C'?TOOTH_EX:TPL[e[7]];
    cv.width=Math.max(...grid.map(row=>row.length))*scale;cv.height=grid.length*scale;
    if(known){spr(grid,0,0,scale,false,code==='O'?pl(MY.find(u=>u.id==='cornbar')):code==='C'?pl(MY.find(u=>u.id==='healthytooth')):cp(e[5],e[8]),cv.getContext('2d'));}else{const ctx=cv.getContext('2d');ctx.font='bold 26px sans-serif';ctx.fillStyle='#99a6ba';ctx.fillText('?',cv.width/2-7,cv.height/2+9);}
    const span=document.createElement('span');span.innerHTML='<b>'+(known?e[0]:'???')+'</b><small>'+(known?(ENTY[code].join(' / ')+' · '+(code==='F'?'세계편 1장 보스':code==='O'?'세계편 2장 보스':code==='C'?'세계편 3장 보스':'적 캐릭터')):'아직 발견하지 못한 적')+'</small>';
    bt.append(cv,span);box.appendChild(bt);
    if(known){bt.onclick=()=>{const old=box.querySelector('.dex-detail');if(old)old.remove();if(bt.dataset.open==='1'){bt.dataset.open='';return;}box.querySelectorAll('.dex-item').forEach(x=>x.dataset.open='');bt.dataset.open='1';const d=document.createElement('div');d.className='dex-detail';const sp=EN_SPECIAL[code];d.innerHTML='<b>'+e[0]+'</b><p>속성: '+ENTY[code].join(' / ')+'<br>기본 체력: '+e[1].toLocaleString()+' · 기본 공격력: '+Math.round(e[2]).toLocaleString()+'<br>이동속도: '+e[3]+' · 기본 사거리: '+e[4]+'<br>공격 범위: '+(ENAR.includes(code)?'범위 공격':'단일 공격')+'<br>처치 시 기본 보상: '+ENR[code]+'원'+(sp?'<br>특수 효과: '+sp.description:'')+'</p><small>실제 전투 능력치는 장·스테이지 배율과 보스 보정에 따라 달라집니다.</small>';bt.after(d);};}
  });
}
$('goDex').onclick=()=>{buildDex();show('enemyDex');};$('dexBack').onclick=()=>{buildGrid();show('select');};
// ── 일일 출석: Asia/Seoul 달력 날짜를 기준으로 계정마다 하루 한 번
const koreanDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const previousKoreanDay=date=>{const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10);};
const ATTEND_EXTRA=[['💎 보석',15,'em'],['⭐ 레어 티켓',1,'rt'],['💎 보석',25,'em'],['🎫 건우티켓',2,'tk'],['💎 보석',35,'em'],['⭐ 레어 티켓',1,'rt'],['💎 보석',60,'em']];
function buildDaily(){const today=koreanDate(),done=daily.last===today,nextStreak=done?daily.streak:(daily.last===previousKoreanDay(today)?daily.streak+1:1),day=((nextStreak-1)%7),info=ATTEND_EXTRA[day],box=$('dailyList');
  $('dailyDate').textContent=today;box.innerHTML='<div class="tr"><b>오늘의 출석 보상</b><p>기본 보상: 🎫 건우티켓 1장 (매일)<br>추가 보상: '+info[0]+' ×'+info[1]+'</p><p>연속 출석 '+(done?daily.streak:nextStreak)+'일째 · 총 출석 '+daily.total+'회</p></div>';
  const wrap=document.createElement('div');wrap.className='daily-grid';ATTEND_EXTRA.forEach((r,i)=>{const el=document.createElement('div');el.className='daily-cell'+(i===day?' today':'');el.innerHTML='<b>'+(i+1)+'일차</b><p>🎫 1</p><p>'+r[0]+'<br>×'+r[1]+'</p>';wrap.appendChild(el);});box.appendChild(wrap);
  const controls=document.createElement('div');controls.className='tr daily-action';const b=document.createElement('button');b.textContent=done?'오늘 출석 완료 ✓':'오늘 보상 받기';b.disabled=done;
  b.onclick=()=>{const current=koreanDate();if(daily.last===current){buildDaily();return;}const streak=daily.last===previousKoreanDay(current)?daily.streak+1:1,bonus=ATTEND_EXTRA[(streak-1)%7];tk++;if(bonus[2]==='tk')tk+=bonus[1];if(bonus[2]==='rt')rt+=bonus[1];if(bonus[2]==='em')em+=bonus[1];daily.last=current;daily.streak=streak;daily.total++;daily.history=(daily.history||[]).concat(current).slice(-31);save();sfx('win');toast('🎫 건우티켓 1장 + '+bonus[0]+' '+bonus[1]+' 획득!');buildDaily();};
  controls.appendChild(b);const note=document.createElement('small');note.textContent='매일 한국 시간 00:00에 새 보상이 열려요. 하루를 빠뜨리면 1일차부터 다시 시작해요.';controls.appendChild(note);box.appendChild(controls);
}
$('goDaily').onclick=()=>{buildDaily();show('attendance');};$('dailyBack').onclick=()=>{buildGrid();show('select');};
$('wdBack').onclick=()=>show('start');
$('backStart').onclick=()=>{buildWorld();show('world');};


let myDexCategory='N';
function buildMyDex(){
 const tabs=$('myDexTabs'),list=$('myDexList');tabs.innerHTML='';list.innerHTML='';
 $('myDexCount').textContent='획득 '+MY.filter(avail).length+' / '+MY.length;
 [['N','기본'],['EX','EX'],['R','레어'],['SR','슈퍼레어'],['UR','울슈레']].forEach(([k,n])=>{const b=document.createElement('button');b.textContent=n;b.className=myDexCategory===k?'on':'';b.onclick=()=>{myDexCategory=k;buildMyDex();};tabs.appendChild(b);});
 MY.filter(u=>u.t===myDexCategory).forEach(u=>{const got=avail(u),v=fm(u),div=document.createElement('div');div.className='tr';if(got)div.appendChild(ico(u));
 div.insertAdjacentHTML('beforeend','<b>'+(got?v.name:'???')+'</b><small>'+(got?'Lv'+(lv[u.id]||1)+' +'+(plusLv[u.id]||0)+' · '+u.ty.join(' / '):'미획득')+'</small>');
 if(got){const btn=document.createElement('button');btn.textContent='능력 보기';btn.onclick=()=>alert(v.name+'\n'+u.desc+'\n체력 '+Math.round(v.hp*lm(u.id))+' / 공격 '+Math.round(v.atk*lm(u.id))+' / 사거리 '+v.range+' / 생산 비용 '+Math.round(v.cost*1.5)+'원 (2장 기준)');div.appendChild(btn);}list.appendChild(div);});
}
$('goMyDex').onclick=()=>{buildMyDex();show('myDex');};$('myDexBack').onclick=()=>{buildGrid();show('select');};
