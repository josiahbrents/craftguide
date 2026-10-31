/* ---------- shared ---------- */
const TS={brew:{sub:'potion',sel:'strength',v:'base',form:'drink',n:3,order:[],have:{},ing:'Sugar',done:{}},
 trade:{sub:'prof',sel:'librarian',targets:[],count:0,log:[],vills:[]},
 smelt:{sub:'recipes',q:'',n:64,item:'Raw Iron',qty:64,ftype:'b',furn:1,fuels:{'Coal':1,'Block of Coal':1}},
 smith:{sub:'trim',pieces:{helmet:{mat:'diamond',pat:'coast',tm:'gold'},chest:{mat:'diamond',pat:'coast',tm:'gold'},legs:{mat:'diamond',pat:'coast',tm:'gold'},boots:{mat:'diamond',pat:'coast',tm:'gold'}},up:{Helmet:1,Chestplate:1,Leggings:1,Boots:1},owned:1,diag:0,found:{}},
 food:{sub:'list',sort:'best',hideBad:false,hunger:6,fsel:'Steak',inv:[]},
 xp:{sub:'calc',cur:0,prog:0,target:30,rate:'',start:30,mItem:'Diamond Chestplate',mLeft:50},
 portal:{sub:'convert',ox:'',oy:'',oz:'',nx:'',ny:'',nz:'',saved:[],ax:'',az:'',bx:'',bz:''}};
try{const s=JSON.parse(localStorage.getItem('mc-tabs')||'null');if(s)for(const k of Object.keys(TS))if(s[k]&&typeof s[k]==='object')Object.assign(TS[k],s[k])}catch(e){}
const saveTS=()=>{try{localStorage.setItem('mc-tabs',JSON.stringify(TS))}catch(e){}};
const TABS=['craft','ench','brew','trade','smelt','smith','banner','food','xp','portal'];
const secs=s=>{const [m,x]=s.split(':').map(Number);return m*60+x};
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const pill=(attr,val,cur,label)=>`<button data-${attr}="${val}" aria-pressed="${val===cur}">${label}</button>`;
const ilist=names=>`<ul class="ilist">${names.map(n=>`<li>${img(n)}<span>${esc(n)}</span></li>`).join('')}</ul>`;
const subnav=(tab,list)=>`<div class="esubs" role="group" aria-label="Sections">${list.map(([k,l])=>`<button data-tsub="${tab}:${k}" aria-pressed="${TS[tab].sub===k}">${l}</button>`).join('')}</div>`;
const head=(t,p)=>`<header class="top"><h1>${t}</h1><p>${p}</p></header>`;
const pct=p=>p>=0.995?'over 99%':p<0.01&&p>0?'under 1%':Math.round(p*100)+'%';
const hashStr=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(36)};
const numIn=(attr,val,extra='')=>`<input class="num" type="number" inputmode="numeric" data-${attr} value="${esc(val)}" ${extra}>`;

/* ---------- brewing ---------- */
const STAGE=i=>i==='Nether Wart'?0:i==='Fermented Spider Eye'?2:(i==='Redstone'||i==='Glowstone Dust')?3:i==='Gunpowder'?4:i==='Dragon\'s Breath'?5:1;
function brewChain(p,v,form){
  const s=[];
  if(p.from==='water')s.push(['Fermented Spider Eye',p.name]);
  else{s.push(['Nether Wart','Awkward Potion']);
    if(p.from==='awkward')s.push([p.ing,p.name]);else{const b=PBY[p.from];s.push([b.ing,b.name]);s.push(['Fermented Spider Eye',p.name])}}
  if(v==='ext')s.push(['Redstone','Extended '+p.name.replace('Potion of the ','').replace('Potion of ','')]);
  if(v==='enh')s.push(['Glowstone Dust',p.name+' II']);
  if(form!=='drink')s.push(['Gunpowder','Splash version']);
  if(form==='linger'||form==='arrow')s.push(['Dragon\'s Breath','Lingering version']);
  return s;
}
function brewDuration(p,v,form){const raw=v==='ext'?p.ext:v==='enh'?p.enh&&p.enh[0]:p.base;if(!raw||raw==='instant')return 'Instant';return fmt(secs(raw)/(form==='linger'?4:form==='arrow'?8:1))}
const FORMS={drink:'Drinkable',splash:'Splash',linger:'Lingering',arrow:'Tipped arrows'},VARS={base:'',ext:'Extended ',enh:'Level II '};
const lineName=l=>{const p=PBY[l.id];return `${VARS[l.v]}${l.form==='drink'?'':FORMS[l.form]+' '}${p.name.replace('Potion of the ','').replace('Potion of ','')}`};
function potionDetail(){
  const B=TS.brew,p=PBY[B.sel]||POTIONS[0];
  if(B.v==='ext'&&!p.ext)B.v='base';if(B.v==='enh'&&!p.enh)B.v='base';
  const chip=x=>`<button class="pchip" data-potion="${x.id}" aria-pressed="${x.id===p.id}">${img(x.name)}<span>${esc(x.name.replace('Potion of the ','').replace('Potion of ',''))}</span></button>`;
  const chain=brewChain(p,B.v,B.form),batches=Math.ceil(B.n/3);
  const durRow=(l,v)=>`<tr><td>${l}</td><td>${v?esc(v==='instant'?'Instant':v):'—'}</td></tr>`;
  const ing={};chain.forEach(([i])=>{ing[i]=(ing[i]||0)+batches});
  let steps=`<li class="bstep">${img('Glass Bottle')}<div><b>Fill ${batches*3} glass bottles with water</b><span>Up to 3 go in the bottom slots each brew, with blaze powder in the fuel slot.</span></div></li>`;
  chain.forEach(([i,out])=>{steps+=`<li class="bstep">${img(i)}<div><b>Add ${esc(i)}</b><span>Makes ${esc(out)}.</span></div></li>`});
  if(B.form==='arrow')steps+=`<li class="bstep">${img('Arrow')}<div><b>Craft tipped arrows</b><span>A lingering potion in the middle of a crafting table with 8 arrows around it makes 8 tipped arrows.</span></div></li>`;
  const shop=[['Glass Bottle',batches*3],...Object.entries(ing),['Blaze Powder',Math.ceil(chain.length*batches/20)]];if(B.form==='arrow')shop.push(['Arrow',batches*24]);
  return [['good','Helpful'],['mixed','Mixed'],['bad','Harmful or for mobs']].map(([g,l])=>`<h2 class="eh3">${l}</h2><div class="pchips">${POTIONS.filter(x=>x.group===g).map(chip).join('')}</div>`).join('')+
  `<article class="bpanel"><div class="bhead">${img(p.name,'ic big')}<div><h2>${esc(p.name)}</h2><p>${esc(B.v==='enh'?p.enh[1]:p.effect)}</p></div></div><p>${esc(p.desc)}</p>
  <table class="dtable"><thead><tr><th>Version</th><th>Lasts</th></tr></thead><tbody>${durRow('Normal',p.base||(p.enh&&p.enh[0]==='instant'?'instant':null))}${durRow('Extended (redstone)',p.ext)}${durRow('Level II (glowstone)',p.enh&&p.enh[0])}</tbody></table>
  <div class="pmode">${pill('bv','base',B.v,'Normal')}${p.ext?pill('bv','ext',B.v,'Extended'):''}${p.enh?pill('bv','enh',B.v,'Level II'):''}</div>
  <div class="pmode four">${pill('bform','drink',B.form,'Drink')}${pill('bform','splash',B.form,'Splash')}${pill('bform','linger',B.form,'Lingering')}${pill('bform','arrow',B.form,'Arrows')}</div>
  <p class="bdur"><b>${FORMS[B.form]}: ${esc(brewDuration(p,B.v,B.form))}</b>${B.form==='linger'?' <span>Lingering potions last a quarter as long.</span>':B.form==='arrow'?' <span>Tipped arrows last an eighth as long.</span>':B.form==='splash'?' <span>Splash potions last as long as drinkable ones.</span>':''}</p>
  ${ALT_FROM[p.id]?`<p class="small">${esc(ALT_FROM[p.id])}</p>`:''}
  <h3 class="eh3">Steps</h3><ol class="bsteps">${steps}</ol>
  <h3 class="eh3">What to gather</h3><label class="exrow"><span>How many potions</span><select data-bn="1">${[3,6,9,12,18,24,36,48,64].map(n=>`<option value="${n}"${n===B.n?' selected':''}>${n}</option>`).join('')}</select></label>
  <ul class="ilist">${shop.map(([n,c])=>`<li>${img(n)}<span><b>${c}×</b> ${esc(n)}</span></li>`).join('')}</ul>
  <div class="eactions"><button class="btn primary" data-addorder="1">Add ${B.n} to my potion order</button></div></article>
  <section class="how"><h3>How brewing works</h3><p>Almost every potion starts as an <b>awkward potion</b>: water bottle plus nether wart. Then one ingredient gives it an effect.</p><p><b>Redstone</b> makes it last longer and <b>glowstone</b> makes it stronger, but only one of the two.</p><p><b>Fermented spider eye</b> flips some potions into their opposite, like Night Vision into Invisibility. On a plain water bottle it makes Weakness.</p><p><b>Gunpowder</b> makes any potion throwable, and <b>dragon’s breath</b> turns a splash potion into a lingering one.</p></section>`;
}
/* potion order: each brew adds one ingredient to up to 3 bottles, and bottles at different stages can share a brew */
function orderPlan(lines){
  const bottles=[];lines.forEach((l,li)=>{const p=PBY[l.id];if(!p)return;const ch=brewChain(p,l.v,l.form);for(let i=0;i<l.n;i++)bottles.push({li,ch})});
  const byIng={};bottles.forEach(b=>b.ch.forEach(([ing])=>{(byIng[ing]=byIng[ing]||[]).push(b)}));
  const ops=[];Object.keys(byIng).sort((a,b)=>STAGE(a)-STAGE(b)).forEach(ing=>{const bs=byIng[ing];for(let i=0;i<bs.length;i+=3){const grp=bs.slice(i,i+3),cnt={};grp.forEach(b=>{const n=lineName(lines[b.li]);cnt[n]=(cnt[n]||0)+1});ops.push({ing,n:grp.length,what:cnt})}});
  const arrows=lines.filter(l=>l.form==='arrow').reduce((a,l)=>a+l.n,0);
  return {bottles:bottles.length,ops,ing:Object.fromEntries(Object.entries(byIng).map(([k,v])=>[k,Math.ceil(v.length/3)])),blaze:Math.ceil(ops.length/20),arrows};
}
function renderOrder(){
  const B=TS.brew,opts=POTIONS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  let h=`<p class="lede">Add every potion you want. You get one shopping list, and the brews are shared wherever they can be.</p>
  <div class="bpanel"><div class="drow"><select id="oid" aria-label="Potion">${opts}</select></div>
  <div class="drow"><select id="ov" aria-label="Version"><option value="base">Normal</option><option value="ext">Extended</option><option value="enh">Level II</option></select><select id="of" aria-label="Form"><option value="drink">Drinkable</option><option value="splash">Splash</option><option value="linger">Lingering</option><option value="arrow">Tipped arrows</option></select><select id="on" aria-label="How many">${[1,2,3,4,5,6,8,9,12,15,18,24,27,36].map(n=>`<option value="${n}"${n===3?' selected':''}>${n}×</option>`).join('')}</select></div>
  <button class="btn primary" data-oadd="1">Add to order</button><p class="small">Versions a potion can’t have are skipped automatically.</p></div>`;
  if(!B.order.length)return h+'<p class="hint">Your order is empty.</p>';
  const plan=orderPlan(B.order),sig='o'+hashStr(JSON.stringify(B.order)),done=new Set(B.done[sig]||[]);
  h+=`<h3 class="eh3">Your order</h3><ul class="srows">${B.order.map((l,i)=>`<li class="srow">${img(PBY[l.id].name)}<span class="sio"><b>${l.n}× ${esc(lineName(l))}</b><small>${esc(brewDuration(PBY[l.id],l.v,l.form))}</small></span><button class="link" data-orm="${i}">Remove</button></li>`).join('')}</ul>
  <div class="esum"><div><b>${plan.bottles}</b><span>potions</span></div><div><b>${plan.ops.length}</b><span>brews</span></div><div><b>${Math.ceil(plan.ops.length*20/60)}</b><span>minutes of brewing</span></div></div>
  <h3 class="eh3">Shopping list</h3><ul class="ilist"><li>${img('Glass Bottle')}<span><b>${plan.bottles}×</b> Glass Bottle</span></li>${Object.entries(plan.ing).sort((a,b)=>STAGE(a[0])-STAGE(b[0])).map(([n,c])=>`<li>${img(n)}<span><b>${c}×</b> ${esc(n)}${n==='Blaze Powder'?' (for Strength)':''}</span></li>`).join('')}<li>${img('Blaze Powder')}<span><b>${plan.blaze}×</b> Blaze Powder (fuel)</span></li>${plan.arrows?`<li>${img('Arrow')}<span><b>${plan.arrows*8}×</b> Arrow</span></li>`:''}</ul>
  <div class="chk"><span>${done.size} of ${plan.ops.length} brews done</span>${done.size?`<button class="link" data-oreset="${sig}">Reset</button>`:''}</div>
  <ol class="steps">${plan.ops.map((o,i)=>`<li><div class="step${done.has(i)?' done':''}" role="button" tabindex="0" aria-pressed="${done.has(i)}" data-ostep="${sig}:${i}"><div class="shead"><span>${done.has(i)?'✓ ':''}Brew ${i+1}</span><span class="small2">${o.n} bottle${o.n>1?'s':''}</span></div><div class="bline">${img(o.ing)}<span><b>Add ${esc(o.ing)}</b> to ${esc(Object.entries(o.what).map(([k,v])=>v+'× '+k).join(', '))}</span></div><p class="tapnote">${done.has(i)?'Done. Tap to undo.':'Tap when done'}</p></div></li>`).join('')}</ol>
  ${plan.arrows?`<p class="note">Then craft each lingering potion with 8 arrows to make ${plan.arrows*8} tipped arrows.</p>`:''}
  <p class="small">Bottles can be at different stages in the same brew, so one gunpowder brew can turn three different potions into splash potions. Fill bottles in the order shown.</p>`;
  return h;
}
const ALL_ING=()=>{const s=new Set(['Nether Wart']);POTIONS.forEach(p=>s.add(p.ing));['Fermented Spider Eye','Redstone','Glowstone Dust','Gunpowder','Dragon\'s Breath','Blaze Powder'].forEach(x=>s.add(x));return [...s]};
function renderIngredients(){
  const B=TS.brew,list=ALL_ING();if(!list.includes(B.ing))B.ing=list[0];const i=B.ing;
  const uses=[];
  POTIONS.forEach(p=>{const ch=brewChain(p,'base','drink');if(ch.some(c=>c[0]===i))uses.push(p)});
  const special={'Nether Wart':'Turns a water bottle into an awkward potion, the base for almost everything.','Redstone':'Makes a potion last longer. On a water bottle it makes a mundane potion, which is useless.','Glowstone Dust':'Makes a potion stronger (level II). On a water bottle it makes a thick potion, which is useless.','Gunpowder':'Turns any potion into a splash potion you can throw.','Dragon\'s Breath':'Turns a splash potion into a lingering one. Collect it in glass bottles from the ender dragon’s breath attack.','Blaze Powder':'Fuels the brewing stand for 20 brews, and also makes Potion of Strength.','Fermented Spider Eye':'Flips Night Vision into Invisibility, Swiftness or Leaping into Slowness, and Healing or Poison into Harming. On a water bottle it makes Weakness.'};
  return `<p class="lede">Tap an ingredient to see what it’s for.</p><div class="pchips">${list.map(x=>`<button class="pchip" data-bing="${esc(x)}" aria-pressed="${x===i}">${img(x)}<span>${esc(x)}</span></button>`).join('')}</div>
  <article class="bpanel"><div class="bhead">${img(i,'ic big')}<div><h2>${esc(i)}</h2></div></div>${special[i]?`<p>${esc(special[i])}</p>`:''}
  ${uses.length?`<h3 class="eh3">Used in</h3><ul class="srows">${uses.map(p=>`<li class="srow">${img(p.name)}<span class="sio"><b>${esc(p.name)}</b><small>${esc(brewChain(p,'base','drink').map(c=>c[0]).join(' → '))}</small></span><button class="link" data-potion="${p.id}" data-tsubgo="brew:potion">Open</button></li>`).join('')}</ul>`:''}</article>`;
}
function renderCanBrew(){
  const B=TS.brew,list=ALL_ING(),have=x=>!!B.have[x];
  const rows=POTIONS.map(p=>{const need=brewChain(p,'base','drink').map(c=>c[0]);need.push('Blaze Powder');const miss=[...new Set(need.filter(x=>!have(x)))];
    const extra=[p.ext&&have('Redstone')?'Extended':null,p.enh&&have('Glowstone Dust')?'Level II':null,have('Gunpowder')?'Splash':null,have('Gunpowder')&&have('Dragon\'s Breath')?'Lingering':null].filter(Boolean);
    return {p,miss,extra}}).sort((a,b)=>a.miss.length-b.miss.length);
  const can=rows.filter(r=>!r.miss.length),near=rows.filter(r=>r.miss.length===1);
  return `<p class="lede">Tick what you have. Glass bottles and water are assumed.</p><div class="pchips">${list.map(x=>`<button class="pchip" data-bhave="${esc(x)}" aria-pressed="${have(x)}">${img(x)}<span>${esc(x)}</span></button>`).join('')}</div>
  <h3 class="eh3">You can brew</h3>${can.length?`<ul class="srows">${can.map(r=>`<li class="srow">${img(r.p.name)}<span class="sio"><b>${esc(r.p.name)}</b><small>${r.extra.length?'Also: '+esc(r.extra.join(', ')):'Normal version'}</small></span></li>`).join('')}</ul>`:'<p class="hint">Nothing yet. Every potion needs blaze powder for fuel, and most need nether wart.</p>'}
  ${near.length?`<h3 class="eh3">One ingredient away</h3><ul class="srows">${near.map(r=>`<li class="srow">${img(r.p.name)}<span class="sio"><b>${esc(r.p.name)}</b><small>Missing ${esc(r.miss[0])}</small></span></li>`).join('')}</ul>`:''}`;
}
function renderBrew(){
  const B=TS.brew;const body=B.sub==='order'?renderOrder():B.sub==='ing'?renderIngredients():B.sub==='can'?renderCanBrew():potionDetail();
  return head('Brewing','Recipes, a potion order planner with one shopping list, and what you can brew right now.')+subnav('brew',[['potion','Potions'],['order','Order planner'],['ing','Ingredients'],['can','What can I brew?']])+body;
}

/* ---------- trades ---------- */
function renderProf(){
  const T=TS.trade,p=PROFS.find(x=>x.id===T.sel)||PROFS[0];
  return `<div class="ichips">${PROFS.map(x=>`<button class="ichip" data-prof="${x.id}" aria-pressed="${x.id===p.id}">${img(x.ws)}<span>${esc(x.name)}</span></button>`).join('')}</div>
  <article class="bpanel"><div class="bhead">${img(p.ws,'ic big')}<div><h2>${esc(p.name)}</h2><p>Workstation: ${esc(p.ws)}</p></div></div><p>${esc(p.note)}</p>
  <h3 class="eh3">Buys from you</h3>${ilist(p.buys)}<h3 class="eh3">Sells</h3>${ilist(p.sells)}
  ${p.id==='librarian'?'<div class="eactions"><button class="btn primary" data-tsubgo="trade:hunt">Hunt for a book</button></div>':''}
  <p class="small">Each villager gets a random set of these as it levels up.</p></article>
  <section class="how"><h3>How villagers work</h3><p>A villager without a job takes the profession of the nearest free workstation. Nitwits, in green coats, never take a job.</p><p><b>Reroll:</b> before you trade with a villager, break and replace its workstation to get new offers. Once you trade, they’re locked.</p><p><b>Levels:</b> trading levels it up from Novice to Master, unlocking new trades. It restocks up to twice a day while it can reach its workstation.</p><p><b>Discounts:</b> cure a zombie villager with a splash potion of Weakness and a golden apple for a big permanent discount.</p><p class="small">These are the standard Java trades. The experimental villager trade rebalance changes them.</p></section>`;
}
function huntTargets(){return TS.trade.targets.filter(t=>EBY[t.id])}
function renderHunt(){
  const T=TS.trade,tg=huntTargets(),pAny=tg.reduce((a,t)=>a+libOdds(t.id,t.lv?1:0),0);
  const list=ENCH.filter(e=>!NO_LIBRARIAN.includes(e.id));
  let h=`<p class="lede">Rerolls are random every time, so there’s no order to predict. This shows your odds and keeps count while you break and replace the lectern.</p>
  <div class="bpanel"><h3 class="eh3" style="margin-top:0">Books you want</h3>
  <div class="drow"><select id="hid" aria-label="Enchantment">${list.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select><select id="hlv" aria-label="Level"><option value="max">Max level only</option><option value="any">Any level</option></select><button class="btn" data-hadd="1">Add</button></div>
  <button class="link" data-hplan="1">Add the books from my enchanting plan</button>
  ${tg.length?`<ul class="srows" style="margin-top:8px">${tg.map((t,i)=>{const p=libOdds(t.id,t.lv?1:0),e=EBY[t.id];return `<li class="srow">${img('Enchanted Book')}<span class="sio"><b>${esc(t.lv&&e.max>1?lvTxt(t.id,e.max):e.name+(e.max>1?' (any level)':''))}</b><small>1 in ${Math.round(1/p)} per reroll. 50% by ${rollsFor(p,.5)}, 90% by ${rollsFor(p,.9)}.</small></span><button class="link" data-hgot="${i}">Got it</button><button class="link" data-hrm="${i}">Remove</button></li>`}).join('')}</ul>`:'<p class="hint">Add a book to see your odds.</p>'}</div>`;
  if(tg.length){
    const luck=1-Math.pow(1-pAny,T.count);
    h+=`<div class="counter"><div class="cnum"><b>${T.count}</b><span>reroll${T.count===1?'':'s'} so far</span></div>
    <button class="bigbtn" data-hinc="1">+1 reroll</button><div class="eactions"><button class="btn small" data-hdec="1">Undo</button><button class="btn small" data-hzero="1">Start over</button></div>
    <p class="bdur"><b>${tg.length>1?'Chance of any of these':'Chance'} per reroll: 1 in ${Math.round(1/pAny)}</b></p>
    <div class="meter"><div style="width:${Math.min(100,luck*100).toFixed(1)}%"></div></div>
    <p>${T.count?`${pct(luck)} of players would have found ${tg.length>1?'one':'it'} by now. ${luck<0.5?'You’re on track.':luck<0.9?'A bit unlucky, keep going.':'Very unlucky, but each reroll still has the same odds.'}`:'Tap +1 each time you replace the lectern and check the offers.'}</p></div>`;
  }
  if(T.log.length)h+=`<h3 class="eh3">Found so far</h3><ul class="srows">${T.log.slice().reverse().map(l=>`<li class="srow">${img('Enchanted Book')}<span class="sio"><b>${esc(l.name)}</b><small>After ${l.n} reroll${l.n===1?'':'s'}</small></span></li>`).join('')}</ul>`;
  h+=`<section class="how"><h3>How the odds work</h3><p>A new librarian offers an enchanted book as one of its first two trades 2 out of 3 times. The book is one of ${LIB_POOL} enchantments picked evenly, then its level is picked evenly. Soul Speed, Swift Sneak and Wind Burst are never offered.</p><p>Each reroll is independent: 50 misses don’t make the next one more likely. Count a reroll only when the villager got the job back and you checked its offers.</p><p class="small">This is for standard worlds. The experimental villager trade rebalance ties librarian books to biomes instead.</p></section>`;
  return h;
}
function renderVills(){
  const T=TS.trade,profOpts=PROFS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  const books=ENCH.filter(e=>!NO_LIBRARIAN.includes(e.id)).map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('');
  return `<p class="lede">Keep track of your trading hall: who sells what, and where they are.</p>
  <div class="bpanel"><div class="drow"><input id="vname" class="tin" placeholder="Name or spot, like “Hall 3”" aria-label="Villager name"><select id="vprof" aria-label="Profession">${profOpts}</select></div>
  <input id="vnote" class="tin wide" placeholder="Notes, like “locked, cured twice”" aria-label="Notes"><button class="btn primary" data-vadd="1">Add villager</button></div>
  ${T.vills.length?`<ul class="vlist">${T.vills.map((v,i)=>{const p=PROFS.find(x=>x.id===v.prof)||PROFS[0];return `<li class="vcard">${img(p.ws,'ic big')}<div class="vbody"><b>${esc(v.name||p.name)}</b><small>${esc(p.name)}${v.note?' · '+esc(v.note):''}</small>
    ${v.books&&v.books.length?`<span class="vbooks">${v.books.map((b,j)=>`<span class="vbook">${esc(lvTxt(b.id,b.lv))} <button class="link" data-vbrm="${i}:${j}" aria-label="Remove">×</button></span>`).join('')}</span>`:''}
    ${p.id==='librarian'?`<span class="drow"><select data-vbid="${i}" aria-label="Book">${books}</select><select data-vblv="${i}" aria-label="Level">${[1,2,3,4,5].map(n=>`<option value="${n}">${roman(n)}</option>`).join('')}</select><button class="btn small" data-vbadd="${i}">Add book</button></span>`:''}</div><button class="link" data-vrm="${i}">Remove</button></li>`}).join('')}</ul>`:'<p class="hint">No villagers saved yet.</p>'}`;
}
function renderTrade(){const T=TS.trade;return head('Villager trades','What villagers sell, odds for hunting librarian books, and your trading hall.')+subnav('trade',[['prof','Professions'],['hunt','Librarian hunt'],['vills','My villagers']])+(T.sub==='hunt'?renderHunt():T.sub==='vills'?renderVills():renderProf())}
