/* Java Edition enchantment data. Source: Minecraft Wiki (Enchantment, Anvil mechanics), checked Oct 2026. */
const ITEM_TYPES=[
 ['helmet','Helmet','Netherite Helmet'],['chest','Chestplate','Netherite Chestplate'],['legs','Leggings','Netherite Leggings'],['boots','Boots','Netherite Boots'],
 ['turtle','Turtle Shell','Turtle Shell'],['sword','Sword','Netherite Sword'],['spear','Spear','Netherite Spear'],['axe','Axe','Netherite Axe'],
 ['pickaxe','Pickaxe','Netherite Pickaxe'],['shovel','Shovel','Netherite Shovel'],['hoe','Hoe','Netherite Hoe'],['mace','Mace','Mace'],
 ['trident','Trident','Trident'],['bow','Bow','Bow'],['crossbow','Crossbow','Crossbow'],['rod','Fishing Rod','Fishing Rod'],
 ['shears','Shears','Shears'],['shield','Shield','Shield'],['elytra','Elytra','Elytra'],['flint','Flint and Steel','Flint and Steel'],
 ['carrot','Carrot on a Stick','Carrot on a Stick'],['fungus','Warped Fungus on a Stick','Warped Fungus on a Stick'],['brush','Brush','Brush']
];
const ARMOR=['helmet','chest','legs','boots','turtle'],TOOLS=['pickaxe','shovel','axe','hoe'];
const DURABLE=[...ARMOR,...TOOLS,'sword','spear','mace','trident','bow','crossbow','rod','shears','shield','elytra','flint','carrot','fungus','brush'];
/* id, name, max, item multiplier, book multiplier, table items, anvil-only items, source key, description */
const ENCH=[
 ['protection','Protection',4,1,1,ARMOR,[],'table','Reduces most types of damage.'],
 ['fire_protection','Fire Protection',4,2,1,ARMOR,[],'table','Reduces fire damage and burn time.'],
 ['blast_protection','Blast Protection',4,4,2,ARMOR,[],'table','Reduces explosion damage and knockback.'],
 ['projectile_protection','Projectile Protection',4,2,1,ARMOR,[],'table','Reduces damage from projectiles.'],
 ['feather_falling','Feather Falling',4,2,1,['boots'],[],'table','Reduces fall damage.'],
 ['thorns','Thorns',3,8,4,['chest'],['helmet','legs','boots','turtle'],'table','Chance to damage attackers, but uses extra durability.'],
 ['respiration','Respiration',3,4,2,['helmet','turtle'],[],'table','Lets you breathe underwater longer.'],
 ['aqua_affinity','Aqua Affinity',1,4,2,['helmet','turtle'],[],'table','Removes the mining slowdown underwater.'],
 ['depth_strider','Depth Strider',3,4,2,['boots'],[],'table','Lets you move faster in water.'],
 ['frost_walker','Frost Walker',2,4,2,[],['boots'],'treasure','Freezes water under your feet and stops magma and campfire damage.'],
 ['soul_speed','Soul Speed',3,8,4,[],['boots'],'soul','Makes you faster on soul sand and soul soil.'],
 ['swift_sneak','Swift Sneak',3,8,4,[],['legs'],'swift','Lets you move faster while sneaking.'],
 ['sharpness','Sharpness',5,1,1,['sword','spear'],['axe'],'table','Increases melee damage.'],
 ['smite','Smite',5,2,1,['sword','spear'],['axe','mace'],'table','Extra damage to undead mobs.'],
 ['bane_of_arthropods','Bane of Arthropods',5,2,1,['sword','spear'],['axe','mace'],'table','Extra damage to spiders, silverfish, endermites and bees.'],
 ['knockback','Knockback',2,2,1,['sword','spear'],[],'table','Knocks mobs back further.'],
 ['fire_aspect','Fire Aspect',2,4,2,['sword','spear'],['mace'],'table','Sets the target on fire.'],
 ['looting','Looting',3,4,2,['sword','spear'],[],'table','More drops from mobs.'],
 ['sweeping_edge','Sweeping Edge',3,4,2,['sword'],[],'table','More damage from sweep attacks to nearby mobs.'],
 ['lunge','Lunge',3,2,1,['spear'],[],'table','Launches you forward on a jab attack, costing some hunger.'],
 ['density','Density',5,2,1,['mace'],[],'table','More smash attack damage for each block fallen.'],
 ['breach','Breach',4,4,2,['mace'],[],'table','Reduces how well the target’s armor protects it.'],
 ['wind_burst','Wind Burst',3,4,2,[],['mace'],'wind','Launches you back up after a smash attack.'],
 ['efficiency','Efficiency',5,1,1,TOOLS,['shears'],'table','Mines faster.'],
 ['silk_touch','Silk Touch',1,8,4,TOOLS,[],'table','Blocks drop themselves, like ores, glass and grass.'],
 ['fortune','Fortune',3,4,2,TOOLS,[],'table','More drops from ores, crops and some other blocks.'],
 ['power','Power',5,1,1,['bow'],[],'table','More arrow damage.'],
 ['punch','Punch',2,4,2,['bow'],[],'table','More arrow knockback.'],
 ['flame','Flame',1,4,2,['bow'],[],'table','Arrows set targets on fire.'],
 ['infinity','Infinity',1,8,4,['bow'],[],'table','Normal arrows aren’t used up. You still need one arrow.'],
 ['quick_charge','Quick Charge',3,2,1,['crossbow'],[],'table','Loads the crossbow faster.'],
 ['multishot','Multishot',1,4,2,['crossbow'],[],'table','Fires three arrows at once.'],
 ['piercing','Piercing',4,1,1,['crossbow'],[],'table','Arrows pass through several mobs.'],
 ['impaling','Impaling',5,4,2,['trident'],[],'table','Extra damage to aquatic mobs.'],
 ['loyalty','Loyalty',3,1,1,['trident'],[],'table','The trident flies back after you throw it.'],
 ['riptide','Riptide',3,4,2,['trident'],[],'table','Launches you when used in water or rain, instead of throwing.'],
 ['channeling','Channeling',1,8,4,['trident'],[],'table','Calls lightning on the target during thunderstorms.'],
 ['luck_of_the_sea','Luck of the Sea',3,4,2,['rod'],[],'table','Better chance of treasure when fishing.'],
 ['lure','Lure',3,4,2,['rod'],[],'table','Fish bite sooner.'],
 ['unbreaking','Unbreaking',3,2,1,['helmet','chest','legs','boots','turtle','pickaxe','shovel','axe','hoe','sword','spear','mace','trident','bow','crossbow','rod'],['shears','shield','elytra','flint','carrot','fungus','brush'],'table','The item loses durability more slowly.'],
 ['mending','Mending',1,4,2,[],DURABLE,'treasure','Experience orbs you pick up repair the item.'],
 ['binding_curse','Curse of Binding',1,8,4,[],[...ARMOR,'elytra'],'curse','Can’t be taken off once worn, except by dying.'],
 ['vanishing_curse','Curse of Vanishing',1,8,4,[],DURABLE,'curse','The item disappears when you die.']
].map(([id,name,max,mi,mb,prim,sec,src,desc])=>({id,name,max,mi,mb,prim,sec,src,desc}));
const EBY=Object.fromEntries(ENCH.map(e=>[e.id,e]));
const CONFLICT_GROUPS=[
 ['protection','fire_protection','blast_protection','projectile_protection'],
 ['sharpness','smite','bane_of_arthropods'],['density','breach'],
 ['density','sharpness'],['density','smite'],['density','bane_of_arthropods'],
 ['breach','sharpness'],['breach','smite'],['breach','bane_of_arthropods'],
 ['silk_touch','fortune'],['depth_strider','frost_walker'],['infinity','mending'],
 ['multishot','piercing'],['riptide','loyalty'],['riptide','channeling']
];
const CONFLICTS={};
CONFLICT_GROUPS.forEach(g=>g.forEach(a=>g.forEach(b=>{if(a!==b){(CONFLICTS[a]=CONFLICTS[a]||new Set()).add(b)}})));
const conflicts=(a,b)=>!!(CONFLICTS[a]&&CONFLICTS[a].has(b));
const SOURCES={
 table:'Enchanting table, librarian villagers, loot chests and fishing.',
 treasure:'Not from the enchanting table. Get it from librarian villagers, loot chests or fishing.',
 soul:'Not from the enchanting table or villagers. Get it from piglin bartering or bastion remnant chests.',
 swift:'Not from the enchanting table or villagers. Found in ancient city chests.',
 wind:'Not from the enchanting table or villagers. Found in ominous vaults in trial chambers.',
 curse:'A curse. Comes from loot chests, fishing and villager trades. It can’t be removed.'
};
const canTake=(type,id)=>{const e=EBY[id];return e.prim.includes(type)||e.sec.includes(type)};
const fromTable=(type,id)=>EBY[id].prim.includes(type);
const PRESETS={
 helmet:{protection:4,unbreaking:3,mending:1,respiration:3,aqua_affinity:1},
 turtle:{protection:4,unbreaking:3,mending:1,respiration:3,aqua_affinity:1},
 chest:{protection:4,unbreaking:3,mending:1},
 legs:{protection:4,unbreaking:3,mending:1,swift_sneak:3},
 boots:{protection:4,feather_falling:4,depth_strider:3,soul_speed:3,unbreaking:3,mending:1},
 sword:{sharpness:5,looting:3,fire_aspect:2,sweeping_edge:3,unbreaking:3,mending:1},
 spear:{sharpness:5,lunge:3,looting:3,fire_aspect:2,unbreaking:3,mending:1},
 axe:{efficiency:5,sharpness:5,unbreaking:3,mending:1},
 pickaxe:{efficiency:5,fortune:3,unbreaking:3,mending:1},
 shovel:{efficiency:5,unbreaking:3,mending:1},
 hoe:{efficiency:5,fortune:3,unbreaking:3,mending:1},
 mace:{density:5,wind_burst:3,fire_aspect:2,unbreaking:3,mending:1},
 trident:{impaling:5,loyalty:3,channeling:1,unbreaking:3,mending:1},
 bow:{power:5,punch:2,flame:1,infinity:1,unbreaking:3},
 crossbow:{quick_charge:3,multishot:1,unbreaking:3,mending:1},
 rod:{luck_of_the_sea:3,lure:3,unbreaking:3,mending:1},
 shears:{efficiency:5,unbreaking:3,mending:1}
};
const presetFor=t=>PRESETS[t]||{unbreaking:3,mending:1};

/* ---------- anvil optimizer (Java Edition rules) ----------
 inputs[0] is the item, the rest are books. Each input: {ench:{id:level}, work:anvilUses, isItem}
 Step cost = penalty(left) + penalty(right) + for each enchantment on the right:
   ignored if the target item can't take it; +1 if it conflicts; otherwise final level x multiplier
   (book multiplier, because the right side is always a book here).
 Penalty = 2^uses - 1. Result uses = max(left, right) + 1. A step over 39 levels is "Too Expensive!". */
const roman=n=>['','I','II','III','IV','V'][n]||String(n);
const pen=w=>Math.pow(2,w)-1;
function mergeStep(L,R,type){
  let cost=pen(L.work)+pen(R.work);const out={...L.ench};
  for(const [id,lv] of Object.entries(R.ench)){
    const e=EBY[id];
    if(L.isItem&&!canTake(type,id))continue;
    if(Object.keys(L.ench).some(o=>o!==id&&conflicts(o,id))){cost+=1;continue}
    const cur=L.ench[id]||0;
    const fin=cur===lv?Math.min(lv+(lv<e.max?1:0),Math.max(e.max,lv)):Math.max(cur,lv);
    out[id]=fin;cost+=fin*(R.isItem?e.mi:e.mb);
  }
  return {cost,ench:out,work:Math.max(L.work,R.work)+1,isItem:L.isItem};
}
const ekey=m=>Object.keys(m).sort().map(k=>k+m[k]).join(',');
function optimize(inputs,type,limit=39){
  const n=inputs.length,full=(1<<n)-1,memo=new Array(full+1);
  for(let i=0;i<n;i++){const x=inputs[i];memo[1<<i]=[{...x,ench:{...x.ench},cost:0,max:0,tree:{leaf:i}}]}
  const popc=m=>{let c=0;while(m){m&=m-1;c++}return c};
  const masks=[];for(let m=1;m<=full;m++)if(popc(m)>1)masks.push(m);
  masks.sort((a,b)=>popc(a)-popc(b));
  for(const S of masks){
    const hasItem=S&1;const states=new Map();
    for(let A=(S-1)&S;A>0;A=(A-1)&S){
      const B=S^A;if(!B)continue;
      if(hasItem&&!(A&1))continue;
      const LA=memo[A],RB=memo[B];if(!LA||!RB)continue;
      for(const L of LA)for(const R of RB){
        if(R.isItem)continue;
        const st=mergeStep(L,R,type);
        if(st.cost>limit)continue;
        const tot=L.cost+R.cost+st.cost,mx=Math.max(L.max,R.max,st.cost);
        const k=st.work+'|'+ekey(st.ench),old=states.get(k);
        if(!old||tot<old.cost||(tot===old.cost&&mx<old.max))states.set(k,{ench:st.ench,work:st.work,isItem:st.isItem,cost:tot,max:mx,tree:{l:L.tree,r:R.tree,lState:L,rState:R,step:st.cost,res:st}});
      }
    }
    // prune: same enchantments, worse or equal on both uses and cost
    let arr=[...states.values()];
    arr=arr.filter(a=>!arr.some(b=>b!==a&&ekey(b.ench)===ekey(a.ench)&&b.work<=a.work&&b.cost<=a.cost&&(b.work<a.work||b.cost<a.cost)));
    if(arr.length)memo[S]=arr;
  }
  const fin=memo[full];if(!fin)return null;
  const target=inputs.reduce((m,x)=>{for(const[k,v]of Object.entries(x.ench))m[k]=Math.max(m[k]||0,v);return m},{});
  const score=s=>Object.values(s.ench).reduce((a,b)=>a+b,0);
  fin.sort((a,b)=>score(b)-score(a)||a.cost-b.cost||a.work-b.work||a.max-b.max);
  return fin[0];
}
function stepsOf(best){
  const steps=[];
  (function walk(t){if(t.leaf!==undefined)return;walk(t.l);walk(t.r);steps.push({left:t.lState,right:t.rState,cost:t.step,res:t.res})})(best.tree);
  return steps;
}
