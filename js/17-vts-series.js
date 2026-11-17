// VTS series: 별도 스테이지/적 구성. 세계편 전투 엔진과 그래픽을 재사용하며 건우 도장(PVP)은 건드리지 않습니다.
const VTS_BOSSES=[
  {id:'VJ',name:'VTS 준치',hp:250000,atk:18000,range:150,speed:1.8,cd:3,col:'#c65b42',acc:'#ffe0a8',tpl:'w',size:7},
  {id:'VG',name:'VTS 건우통',hp:500000,atk:35000,range:200,speed:0.8,cd:4,col:'#7254a6',acc:'#e5d5ff',tpl:'h',size:8}
];
function buildVTSStages(){
  const box=$('vtsStages');box.innerHTML='<h2>VTS 시리즈 · 초고난도</h2><p>현재는 두 스테이지만 공개되어 있습니다.</p>';
  VTS_BOSSES.forEach((b,i)=>{const row=document.createElement('button');row.className='tr';row.style.cssText='display:block;width:100%;text-align:left;margin:10px 0;padding:16px';row.innerHTML='<b>'+b.name+' 초고난도</b><br><small>체력 '+b.hp.toLocaleString()+' · 공격력 '+b.atk.toLocaleString()+' · 사거리 '+b.range+' · 공격 간격 '+b.cd+'초</small>';row.onclick=()=>startVTSStage(i);box.appendChild(row);});
}
$('vtsBack').onclick=()=>{buildWorld();show('world');};
function startVTSStage(i){
  const boss=VTS_BOSSES[i];stageIdx=i;CH=0;$('unitInfoLayer').classList.add('hide');speedUp=false;renderSpeedToggle();buildSlots();
  const tsd={};TSETS.forEach(set=>{if(set.trait)tsd[set.trait]=traitTreasureProgress(set.trait);});
  S={vtsMode:true,t:0,money:Math.min(100,walletCapacity()),units:[],cool:MY.map(()=>0),over:null,boss:true,drop:'',drop2:'',fx:[],pop:[],cn:0,cnr:60,lid:0,pj:[],bm:[],dust:[],spk:[],ring:[],shake:0,bw:0,
    walM:1,rateM:incomeMultiplier(),tsd,cm:CHC[0],future:false,maxM:1000,rate:14,
    my:{hp:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base')),max:1500*(1+basicProgress('baseHp'))*(1+0.3*futureTreasureProgress('f_base'))},
    en:{hp:boss.hp,max:boss.hp},eSpawn:99999,spawnN:0,mult:1,wl:1};applyWk();
  S.units.push({team:1,boss:true,code:boss.id,T:{name:boss.name,hp:boss.hp,atk:boss.atk,speed:boss.speed,range:boss.range,cd:boss.cd,s:boss.size,col:boss.col,tpl:boss.tpl,acc:boss.acc,ty:['무속성'],rw:0,an:'smash',area:true},x:80,hp:boss.hp,max:boss.hp,kbn:2,nk:boss.hp-boss.hp/2,t:0,kt:0,at:0,ph:Math.random()*3});
  $('stageTitle').textContent=boss.name+' 초고난도';show('battle');$('pmenu').classList.add('hide');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
