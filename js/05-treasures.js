// 건우 대전쟁 · 05-treasures.js
// ════════ 보물: 고유 이름 48개 = 4개씩 12세트 ════════
const TR_ITEMS={
'무속성':['무늬없는 방패','심심한 투구','하얀 장갑','평범한 부적'],'레드':['붉은 고추 방패','불꽃 망토','홍옥 팔찌','석양 투구'],
'부유':['구름 신발','풍선 갑옷','바람개비 목걸이','깃털 방패'],'블랙':['먹물 망토','그림자 부적','흑요석 방패','검은 고양이 인형'],
'메탈':['철판 도시락','은빛 볼트','강철 정강이','티타늄 단추'],'천사':['후광 머리띠','날개 깃털','성스러운 종','은빛 하프'],
'에일리언':['우주 칩','외계 젤리','별가루 병','안테나 모자'],'좀비':['마늘 목걸이','해독 약병','십자 말뚝','묘지 랜턴'],
'고대종':['화석 방패','호박 구슬','토기 조각','상형문자 석판'],'악마':['성수 한 방울','봉인 부적','은 십자가','악몽 퇴치 베개']};
const TSETS=[
{id:'wal',name:'건우 금고 세트',eff:'최대 돈 증가',items:['녹슨 동전 주머니','건우 저금통','황금 지갑','무한 금고 열쇠']},
{id:'rate',name:'일꾼 건우 세트',eff:'돈 수입 속도 증가',items:['건우 작업 장갑','에너지 음료','초시계','황금 곡괭이']}
].concat(TRAITS.map(t=>({id:'tr_'+t,trait:t,name:t+' 수호 세트',eff:t+' 적의 모든 공격 피해 감소 · 그 속성 적에게 주는 피해 증가 (3개 장 12개 완성 시 받는 피해 −50% / 주는 피해 +50%)',items:TR_ITEMS[t]})));
const ALLT=TSETS.flatMap(s=>s.items);
const TREASURE_PER_CHAPTER=ALLT.length;
const treasureKey=(chapter,item)=>chapter+':'+item;
const hasTreasure=(chapter,item)=>!!trc[treasureKey(chapter,item)];
const treasureCount=(chapter,items)=>items.filter(item=>hasTreasure(chapter,item)).length;
const setDone=(chapter,set)=>treasureCount(chapter,set.items)===set.items.length;
const treasureStage=(item)=>ALLT.indexOf(item)%48;
const stageTreasure=(chapter,stage)=>chapter>=3?FUTURE_ITEMS.filter((item,i)=>i%48===stage):ALLT.filter(item=>treasureStage(item)===stage);
const totalTreasure=()=>[0,1,2].reduce((n,c)=>n+ALLT.filter(t=>hasTreasure(c,t)).length,0);
const economicProgress=(setIndex)=>[0,1,2].reduce((n,c)=>n+treasureCount(c,TSETS[setIndex].items),0)/12;
// 해당 속성의 보물 12개 가운데 획득한 비율 (각 장 4개)
const traitTreasureProgress=(trait)=>TR_ITEMS[trait]?[0,1,2].reduce((n,c)=>n+treasureCount(c,TR_ITEMS[trait]),0)/12:0;
const traitProgressFor=(traits,progresses)=>Math.max(0,...(traits||[]).map(t=>progresses[t]||0));
// 보물 완성 시 해당 속성 적으로부터 받는 모든 피해 50% 감소, 해당 속성 적에게 주는 피해 50% 증가.
const treasureIncomingMult=(traits,progresses)=>1-0.5*traitProgressFor(traits,progresses);
const treasureOutgoingMult=(traits,progresses)=>1+0.5*traitProgressFor(traits,progresses);
const basicProgress=(key)=>Math.min(1,(basicLv[key]||1)/20);
const walletCapacity=()=>Math.round((600+(6000-600)*(economicProgress(0)+basicProgress('wallet'))/2)/100)*100;
const incomeMultiplier=()=>1+1.75*(economicProgress(1)+basicProgress('worker'))/2;
const researchMultiplier=()=>1-0.75*basicProgress('research');
const futureCooldownBonus=()=>1-0.10*futureTreasureProgress('f_research');
const unitCooldown=u=>basicLv.research>=20&&['junchi','gtong'].includes(u.id)?1.15:Math.max(0.8,u.cool*researchMultiplier()*futureCooldownBonus());


