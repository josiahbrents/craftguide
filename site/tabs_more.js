/* ---------- smelting ---------- */
const FT={f:['Furnace',10],b:['Blast Furnace',5],s:['Smoker',5]};
function fuelPlan(n,fuels){ // fewest wasted smelts: big fuels first, then the smallest fuel that covers the rest
  const fs=fuels.slice().sort((a,b)=>b[1]-a[1]),use={};let left=n;
  for(const [f,per] of fs){if(per<=left){const k=Math.floor(left/per+1e-9);use[f]=(use[f]||0)+k;left-=k*per}}
  if(left>1e-9){const cover=fs.filter(x=>x[1]>=left).sort((a,b)=>a[1]-b[1])[0]||fs[fs.length-1];const k=Math.ceil(left/cover[1]-1e-9);use[cover[0]]=(use[cover[0]]||0)+k;left-=k*cover[1]}
  return {use,waste:Math.max(0,-left)};
}
function renderRecipes(){
  const S=TS.smelt,q=S.q.trim().toLowerCase(),list=SMELT.filter(r=>!q||r[0].toLowerCase().includes(q)||r[1].toLowerCase().includes(q));
  const where={b:'<span class="etag">Blast furnace</span>',s:'<span class="etag">Smoker</span><span class="etag">Campfire</span>',f:''};
  return `<input class="esearch" type="search" data-sq="1" placeholder="Search, like “iron” or “glass”" value="${esc(S.q)}" aria-label="Search smelting recipes">
  <ul class="srows" id="srows">${list.map(([i,o,xp,w])=>`<li class="srow">${img(i)}<span class="sio"><b>${esc(i)}</b>${SMELT_NOTE[i]?`<small>${esc(SMELT_NOTE[i])}</small>`:''}</span><span class="arr" aria-hidden="true">→</span>${img(o)}<span class="sio"><b>${esc(o)}</b><small>${xp} XP <span class="etag">Furnace</span>${where[w]}</small></span><button class="link" data-sbatch="${esc(i)}">Batch</button></li>`).join('')||'<li class="hint">No smelting recipes match.</li>'}</ul>
  <section class="how"><h3>Which furnace?</h3><p>A <b>furnace</b> smelts anything in 10 seconds an item. A <b>blast furnace</b> does ores, raw metal and metal gear twice as fast, and a <b>smoker</b> does food twice as fast. They burn fuel twice as fast too, so each fuel smelts the same number of items.</p><p>A <b>campfire</b> cooks food without fuel, slowly and with no XP. XP builds up in the furnace until you take the items out.</p></section>`;
}
function renderBatch(){
  const S=TS.smelt,inputs=[...new Set(SMELT.map(r=>r[0]))];if(!inputs.includes(S.item))S.item=inputs[0];
  const r=SMELT.find(x=>x[0]===S.item),ok=['f',r[3]==='b'?'b':null,r[3]==='s'?'s':null].filter(Boolean);if(!ok.includes(S.ftype))S.ftype=ok[ok.length-1];
  const qty=Math.max(1,Math.min(100000,Math.floor(+S.qty||1))),fn=Math.max(1,Math.min(64,Math.floor(+S.furn||1))),[fname,t]=FT[S.ftype];
  const per=Math.ceil(qty/fn),time=per*t,small=Math.floor(qty/fn),big=qty%fn;
  const fuels=FUELS.filter(([f])=>S.fuels[f]);
  let fuelOut='<p class="hint">Pick at least one fuel you have.</p>';
  if(fuels.length){const groups=[[per,big||fn]];if(big&&small)groups.push([small,fn-big]);
    const total={};let waste=0;const lines=groups.map(([n,c])=>{const pl=fuelPlan(n,fuels);Object.entries(pl.use).forEach(([f,k])=>{total[f]=(total[f]||0)+k*c});waste+=pl.waste*c;return `${c>1?c+' furnaces':'1 furnace'} with ${n} item${n===1?'':'s'}: ${Object.entries(pl.use).map(([f,k])=>k+'× '+f).join(' + ')}`});
    fuelOut=`<ul class="ilist">${Object.entries(total).map(([f,k])=>`<li>${img(f)}<span><b>${k}×</b> ${esc(f)}</span></li>`).join('')}</ul><p class="small">${lines.map(esc).join('<br>')}</p>${waste>0.01?`<p class="small">About ${Math.round(waste*10)/10} smelts of fuel go unused.</p>`:'<p class="small">No fuel wasted.</p>'}`}
  return `<div class="bpanel"><label class="exrow"><span>Smelt</span><select data-sitem="1">${inputs.map(i=>`<option${i===S.item?' selected':''}>${esc(i)}</option>`).join('')}</select></label>
  <label class="exrow"><span>How many</span>${numIn('sqty="1"',qty,'min="1"')}</label>
  <div class="pmode">${ok.map(k=>pill('sft',k,S.ftype,FT[k][0])).join('')}</div>
  <label class="exrow"><span>Furnaces side by side</span>${numIn('sfn="1"',fn,'min="1" max="64"')}</label>
  <div class="esum"><div><b>${time<60?time+'s':time<3600?Math.floor(time/60)+'m '+(time%60?time%60+'s':''):(time/3600).toFixed(1)+'h'}</b><span>to finish</span></div><div><b>${(qty*r[2]).toFixed(qty*r[2]<10?1:0)}</b><span>XP</span></div><div><b>${qty}</b><span>${esc(r[1])}</span></div></div>
  <h3 class="eh3">Fuel you have</h3><div class="pchips">${FUELS.map(([f,p])=>`<button class="pchip" data-sfuel="${esc(f)}" aria-pressed="${!!S.fuels[f]}">${img(f)}<span>${esc(f)}</span></button>`).join('')}</div>
  <h3 class="eh3">Fuel to load</h3>${fuelOut}<p class="small">Split the items evenly between furnaces. Bigger fuels go first, then the smallest fuel that finishes the job.</p></div>`;
}
function renderFuel(){const n=Math.max(1,Math.floor(+TS.smelt.n||1));return `<label class="exrow"><span>Items to smelt</span>${numIn('sn="1"',n,'min="1"')}</label><ul class="srows" id="frows">${fuelRows(n)}</ul><p class="small">A lava bucket gives you the empty bucket back. Crimson and warped wood don’t burn.</p>`}
function fuelRows(n){return FUELS.map(([f,per])=>`<li class="srow">${img(f)}<span class="sio"><b>${esc(f)}</b><small>Smelts ${per} item${per===1?'':'s'}</small></span><span class="need"><b>${Math.ceil(n/per-1e-9)}</b><small>needed</small></span></li>`).join('')}
function renderSmelt(){const S=TS.smelt;return head('Smelting','Recipes, a batch calculator for time, XP and fuel, and fuel values.')+subnav('smelt',[['recipes','Recipes'],['batch','Batch calculator'],['fuel','Fuel']])+(S.sub==='batch'?renderBatch():S.sub==='fuel'?renderFuel():renderRecipes())}

/* ---------- smithing ---------- */
const ARMOR_MATS=[['none','None'],['leather','Leather'],['chainmail','Chainmail'],['iron','Iron'],['gold','Gold'],['diamond','Diamond'],['netherite','Netherite'],['copper','Copper']];
const TRIM_MAT_PAL=[['iron','Iron'],['copper','Copper'],['gold','Gold'],['lapis','Lapis'],['emerald','Emerald'],['diamond','Diamond'],['netherite','Netherite'],['redstone','Redstone'],['amethyst','Amethyst'],['quartz','Quartz'],['resin','Resin']];
const PIECES=[['helmet','Helmet'],['chest','Chestplate'],['legs','Leggings'],['boots','Boots']];
const imgCache={};const loadImg=src=>imgCache[src]||(imgCache[src]=new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src}));
async function recolorTrim(pat,layer,tm,armor){
  const im=await loadImg(TRIM_PAT[pat+':'+layer]);if(!im)return null;
  const palKey=(['iron','gold','diamond','netherite','copper'].includes(tm)&&tm===armor&&TRIM_PAL[tm+'_darker'])?tm+'_darker':tm,pal=TRIM_PAL[palKey].map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
  const c=document.createElement('canvas');c.width=64;c.height=32;const g=c.getContext('2d');if(!g||!g.getImageData)return null;g.drawImage(im,0,0);
  const d=g.getImageData(0,0,64,32);if(!d||!d.data)return null;for(let k=0;k<d.data.length;k+=4){if(!d.data[k+3])continue;const idx=TRIM_KEY.indexOf(d.data[k]);if(idx<0)continue;const [r,gg,b]=pal[idx];d.data[k]=r;d.data[k+1]=gg;d.data[k+2]=b}
  g.putImageData(d,0,0);return c;
}
function renderTrim(){
  const S=TS.smith,pats=[['none','No trim'],...TRIMS.map(([n])=>[n.toLowerCase(),n])];
  const sel=(attr,pc,opts,cur)=>`<select data-${attr}="${pc}">${opts.map(([v,l])=>`<option value="${v}"${v===cur?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
  return `<p class="lede">Choose armor, a trim pattern and a trim material for each piece.</p><div class="stage3d" id="stage3d" role="img" aria-label="3D armor preview. Drag to turn it."><canvas id="trimcv3" width="300" height="340"></canvas></div><div class="pmode four">${['front','side','back','right'].map(v=>`<button data-view3d="${v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div><p class="small" style="text-align:center">Drag the model to turn it.</p>
  <div class="tpieces">${PIECES.map(([k,l])=>{const P=S.pieces[k];return `<div class="tpiece"><b>${l}</b>${sel('tmat',k,ARMOR_MATS,P.mat)}${sel('tpat',k,pats,P.pat)}${sel('ttm',k,TRIM_MAT_PAL,P.tm)}</div>`}).join('')}</div>
  <div class="eactions"><button class="btn small" data-tall="1">Copy helmet to all pieces</button></div>
  <p class="small">This is how the armor looks when worn. Trim patterns cover the back and sides too, so turn it around. When the trim material matches the armor, like gold on gold, the game uses a darker shade so it still shows.</p>`;
}
function renderNetherite(){
  const S=TS.smith,items=NETHERITE_GEAR.filter(g=>S.up[g]),n=items.length,owned=Math.max(0,Math.floor(+S.owned||0)),copies=n>owned?(owned?n-owned:n-1):0;
  const dia=S.diag?items.reduce((a,g)=>a+DIAMOND_COST[g],0):0;
  return `<p class="lede">Pick what you’re upgrading to see everything you need.</p>
  <div class="pchips">${NETHERITE_GEAR.map(g=>`<button class="pchip" data-nup="${g}" aria-pressed="${!!S.up[g]}">${img('Netherite '+g)}<span>${g}</span></button>`).join('')}</div>
  <div class="eactions"><button class="btn small" data-nset="armor">Full armor</button><button class="btn small" data-nset="all">Everything</button><button class="btn small" data-nset="none">Clear</button></div>
  <label class="exrow"><span>Upgrade templates you have</span><select data-nowned="1">${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<option${i===owned?' selected':''}>${i}</option>`).join('')}</select></label>
  <label class="exrow"><span>Include diamonds for the diamond gear</span><input type="checkbox" data-ndia="1"${S.diag?' checked':''}></label>
  ${n?`<div class="esum"><div><b>${n}</b><span>netherite ingots</span></div><div><b>${n*4}</b><span>ancient debris</span></div><div><b>${n*4}</b><span>gold ingots</span></div></div>
  <ul class="ilist"><li>${img('Ancient Debris')}<span><b>${n*4}×</b> Ancient Debris → Netherite Scrap</span></li><li>${img('Gold Ingot')}<span><b>${n*4}×</b> Gold Ingot</span></li><li>${img('Netherite Upgrade')}<span><b>${copies}</b> template cop${copies===1?'y':'ies'} to craft</span></li><li>${img('Diamond')}<span><b>${copies*7+dia}×</b> Diamond${dia?` (${copies*7} for templates, ${dia} for gear)`:''}</span></li><li>${img('Netherrack')}<span><b>${copies}×</b> Netherrack</span></li></ul>
  ${!owned?'<p class="note">You need to find one template in a bastion remnant first. Every copy after that takes 7 diamonds and 1 netherrack, and gives you 2 templates.</p>':''}`:'<p class="hint">Pick at least one item.</p>'}`;
}
function renderTemplates(){
  const S=TS.smith,all=[['Netherite Upgrade','Bastion remnants','Netherrack'],...TRIMS.map(([n,w,m])=>[n+' Armor Trim',w,m])],got=all.filter(t=>S.found[t[0]]).length;
  return `<p class="lede">Tick off templates as you find them.</p><div class="chk"><span>${got} of ${all.length} found</span></div>
  <ul class="srows">${all.map(([n,w,m])=>`<li class="srow tcheck${S.found[n]?' got':''}" role="button" tabindex="0" data-tfound="${esc(n)}" aria-pressed="${!!S.found[n]}">${img(n)}<span class="sio"><b>${S.found[n]?'✓ ':''}${esc(n.replace(' Armor Trim',''))}</b><small>${esc(w)}. Copy with 7 diamonds and ${esc(m)}.</small></span></li>`).join('')}</ul>
  <h3 class="eh3">Trim colors</h3>${ilist(TRIM_MATS)}`;
}
function renderSmith(){const S=TS.smith;const body=S.sub==='net'?renderNetherite():S.sub==='temp'?renderTemplates():renderTrim();
  return head('Smithing','Preview armor trims, plan netherite upgrades, and track the templates you’ve found.')+subnav('smith',[['trim','Trim preview'],['net','Netherite'],['temp','Templates']])+
  (S.sub==='net'?`<article class="bpanel"><div class="srecipe">${['Netherite Upgrade','Diamond Chestplate','Netherite Ingot'].map((n,i)=>`<div class="sslot">${img(n,'ic big')}<small>${['Template','Diamond item','Ingot'][i]}</small></div>${i<2?'<span class="plus">+</span>':''}`).join('')}<span class="arr">→</span><div class="sslot">${img('Netherite Chestplate','ic big')}<small>Result</small></div></div><p class="small">The item keeps its enchantments, name and anvil uses, so enchant diamond gear first.</p></article>`:'')+body}

/* ---------- food ---------- */
function renderFoodList(){
  const F=TS.food;let list=FOODS.filter(f=>!(F.hideBad&&f.bad));const key={best:f=>f.h+f.s,h:f=>f.h,s:f=>f.s}[F.sort];list=list.slice().sort((a,b)=>key(b)-key(a)||b.s-a.s);
  return `<div class="pmode">${pill('fsort','best',F.sort,'Best overall')}${pill('fsort','h',F.sort,'Hunger')}${pill('fsort','s',F.sort,'Saturation')}</div>
  <label class="exrow"><span>Hide food with bad effects</span><input type="checkbox" data-fbad="1"${F.hideBad?' checked':''}></label>
  <ul class="srows">${list.map(f=>`<li class="srow">${img(f.name)}<span class="sio"><b>${esc(f.name)}</b>${f.note?`<small${f.bad?' class="badn"':''}>${esc(f.note)}</small>`:''}</span><span class="need"><b>${f.h}</b><small>hunger</small></span><span class="need"><b>${f.s}</b><small>saturation</small></span></li>`).join('')}</ul>
  <section class="how"><h3>Hunger and saturation</h3><p><b>Hunger</b> is the drumstick bar. Each drumstick is 2 points, so 20 is full.</p><p><b>Saturation</b> is hidden. It drains before your hunger bar does, and while it’s high you heal faster. It can’t go above your hunger level.</p></section>`;
}
function renderFill(){
  const F=TS.food,gap=20-F.hunger,food=FOODS.find(f=>f.name===F.fsel)||FOODS[0];
  const need=gap>0?Math.ceil(gap/food.h):0,sat=Math.min(20,need*food.s);
  const best=FOODS.filter(f=>!f.bad).map(f=>({f,n:Math.ceil(gap/f.h),sat:Math.min(20,Math.ceil(gap/f.h)*f.s)})).sort((a,b)=>a.n-b.n||b.sat-a.sat).slice(0,5);
  return `<div class="bpanel"><label class="exrow"><span>Your hunger bar now</span><select data-fh="1">${Array.from({length:21},(_,i)=>`<option value="${i}"${i===F.hunger?' selected':''}>${i/2} drumstick${i===2?'':'s'}</option>`).join('')}</select></label>
  <label class="exrow"><span>Food</span><select data-fsel="1">${FOODS.map(f=>`<option${f.name===food.name?' selected':''}>${esc(f.name)}</option>`).join('')}</select></label>
  ${gap>0?`<p class="bdur"><b>Eat ${need} ${esc(food.name)} to fill up</b> <span>You’ll have about ${sat.toFixed(1)} saturation.${need*food.h>gap?' The last one is partly wasted.':''}</span></p>`:'<p class="bdur"><b>You’re already full.</b></p>'}</div>
  ${gap>0?`<h3 class="eh3">Fewest bites to fill up</h3><ul class="srows">${best.map(b=>`<li class="srow">${img(b.f.name)}<span class="sio"><b>${b.n}× ${esc(b.f.name)}</b><small>About ${b.sat.toFixed(1)} saturation after</small></span></li>`).join('')}</ul>`:''}`;
}
function renderMyFood(){
  const F=TS.food,inv=F.inv.filter(x=>FOODS.find(f=>f.name===x.name));
  const tot=inv.reduce((a,x)=>{const f=FOODS.find(y=>y.name===x.name);a.h+=f.h*x.n;a.s+=f.s*x.n;return a},{h:0,s:0});
  return `<p class="lede">Add what you’re carrying to see how far it’ll get you.</p><div class="bpanel"><div class="drow"><select id="minv" aria-label="Food">${FOODS.map(f=>`<option>${esc(f.name)}</option>`).join('')}</select><select id="minvn" aria-label="How many">${[1,2,4,8,16,32,64].map(n=>`<option value="${n}">${n}×</option>`).join('')}</select><button class="btn" data-fadd="1">Add</button></div></div>
  ${inv.length?`<div class="esum"><div><b>${tot.h}</b><span>hunger points</span></div><div><b>${(tot.h/20).toFixed(1)}</b><span>full bars</span></div><div><b>${Math.round(tot.s)}</b><span>saturation</span></div></div>
  <ul class="srows">${inv.map((x,i)=>`<li class="srow">${img(x.name)}<span class="sio"><b>${x.n}× ${esc(x.name)}</b></span><span class="stepper"><button class="sbtn" data-fdec="${i}" aria-label="One fewer">−</button><button class="sbtn" data-finc="${i}" aria-label="One more">+</button></span></li>`).join('')}</ul>`:'<p class="hint">Nothing added yet.</p>'}`;
}
function renderFood(){const F=TS.food;return head('Food','What fills you up most, how many bites you need, and what your supplies are worth.')+subnav('food',[['list','All food'],['fill','Fill-up'],['mine','My food']])+(F.sub==='fill'?renderFill():F.sub==='mine'?renderMyFood():renderFoodList())}

/* ---------- xp ---------- */
function xpOut(){
  const X=TS.xp,cur=Math.max(0,Math.floor(+X.cur||0)),tg=Math.max(0,Math.floor(+X.target||0)),have=xpTotal(cur)+Math.floor(xpNext(cur)*(+X.prog||0)/100),need=xpTotal(tg)-have;
  if(need<=0)return `<p class="bdur"><b>You’re already there.</b></p>`;
  const rate=+X.rate,mins=rate>0?need/rate:0;
  return `<div class="esum"><div><b>${need.toLocaleString()}</b><span>points needed</span></div><div><b>${Math.ceil(need/7).toLocaleString()}</b><span>bottles o’ enchanting, about</span></div>${rate>0?`<div><b>${mins<60?Math.ceil(mins)+' min':(mins/60).toFixed(1)+' h'}</b><span>at your farm’s rate</span></div>`:''}</div>`;
}
function renderXPCalc(){const X=TS.xp;return `<article class="bpanel">
  <label class="exrow"><span>Your level now</span>${numIn('xp="cur"',X.cur,'min="0" max="1000"')}</label>
  <label class="exrow"><span>Progress into that level</span><select data-xp="prog">${[0,25,50,75].map(v=>`<option value="${v}"${+X.prog===v?' selected':''}>${v}%</option>`).join('')}</select></label>
  <label class="exrow"><span>Level you want</span>${numIn('xp="target"',X.target,'min="1" max="1000"')}</label>
  <div class="eactions">${[[0,30],[0,15],[30,39]].map(([a,b])=>`<button class="btn small" data-xpq="${a}:${b}">${a} → ${b}</button>`).join('')}</div>
  <label class="exrow"><span>Farm rate, points per minute (optional)</span>${numIn('xp="rate"',X.rate,'min="0" placeholder="300"')}</label>
  <div id="xpout">${xpOut()}</div></article>
  <h2 class="eh3">Points from level 0</h2><table class="dtable"><thead><tr><th>Level</th><th>Total points</th><th>Next level</th></tr></thead><tbody>${[5,10,15,16,20,25,30,31,35,39,40,50].map(L=>`<tr><td>${L}</td><td>${xpTotal(L).toLocaleString()}</td><td>${xpNext(L)}</td></tr>`).join('')}</tbody></table>
  <section class="how"><h3>Good to know</h3><p>Each level costs more points than the last, and the cost jumps after levels 15 and 30. Spending levels when you’re high up throws away more points.</p><p>The enchanting table’s level 30 option needs level 30 but only takes 3 levels. When you die you drop 7 points per level, up to 100, and the rest is lost.</p></section>`}
function planCosts(){
  try{const specs=E.mode==='set'?setSpecs():[singleSpec()];const n=specs.reduce((a,s)=>a+s.books.reduce((b,x)=>b+x.count,0),0);if(n>12)return {big:true};
    const rs=specs.map(s=>s.books.length?anvilSolve(s):null).filter(r=>r&&!r.none);return {costs:rs.flatMap(r=>r.plan.steps.map(s=>s.cost)),label:E.mode==='set'?'full armor set':TYPE[E.type].n.toLowerCase()}}catch(e){return {costs:[]}}
}
function renderXPEnch(){
  const X=TS.xp,pc=planCosts();
  if(pc.big)return '<p class="hint">Your enchanting plan uses a lot of books. Open the Enchanting tab to see it, then come back.</p>';
  if(!pc.costs.length)return '<p class="hint">Make a plan in the Enchanting tab first, then this shows how much experience it takes.</p>';
  const total=pc.costs.reduce((a,b)=>a+b,0),fresh=pc.costs.reduce((a,c)=>a+xpTotal(c),0),start=Math.max(total,Math.floor(+X.start||0)),once=xpTotal(start)-xpTotal(start-total);
  return `<p class="lede">Your current enchanting plan for the ${esc(pc.label)}: ${pc.costs.length} anvil steps, ${total} levels in total.</p>
  <article class="bpanel"><h3 class="eh3" style="margin-top:0">Earn the levels for each step separately</h3><p class="bdur"><b>${fresh.toLocaleString()} points</b> <span>Get to each step’s level from 0, do the step, repeat. This is the cheapest way.</span></p>
  <h3 class="eh3">Do every step in one go</h3><label class="exrow"><span>Starting level</span>${numIn('xp="start"',start,'min="'+total+'"')}</label>
  <p class="bdur"><b>${once.toLocaleString()} points</b> <span>From level ${start} down to ${start-total}. That’s ${(once-fresh).toLocaleString()} more points than earning each step separately.</span></p></article>
  <p class="small">Steps that cost more levels are much more expensive in points, which is another reason to keep anvil steps small.</p>`;
}
function renderMending(){
  const X=TS.xp,item=DURABILITY.find(d=>d[0]===X.mItem)||DURABILITY[0],left=Math.max(0,Math.min(100,+X.mLeft||0)),missing=Math.round(item[1]*(100-left)/100),pts=Math.ceil(missing/2);
  return `<div class="bpanel"><label class="exrow"><span>Item</span><select data-mitem="1">${DURABILITY.map(d=>`<option${d[0]===item[0]?' selected':''}>${esc(d[0])}</option>`).join('')}</select></label>
  <label class="exrow"><span>Durability left</span><select data-mleft="1">${[0,10,25,50,75,90].map(v=>`<option value="${v}"${v===left?' selected':''}>${v}%</option>`).join('')}</select></label>
  <div class="esum"><div><b>${pts.toLocaleString()}</b><span>XP points to repair</span></div><div><b>${missing.toLocaleString()}</b><span>durability missing of ${item[1].toLocaleString()}</span></div><div><b>${Math.ceil(pts/7)}</b><span>bottles o’ enchanting, about</span></div></div></div>
  <p class="small">Each experience point repairs 2 durability on a Mending item you’re holding or wearing. If several items need repair, a random one gets each orb. XP spent on repairs doesn’t count toward your level.</p>`;
}
function renderSources(){return `<ul class="srows">${XP_SOURCES.map(([s,v])=>`<li class="srow"><span class="sio"><b>${esc(s)}</b></span><span class="need"><b>${esc(v)}</b><small>points</small></span></li>`).join('')}</ul><p class="small">Baby animals and villagers give no XP. Mobs only drop XP if a player or tamed wolf killed them recently.</p>`}
function renderXP(){const X=TS.xp;return head('Experience','Level math, what your enchanting plan costs in XP, Mending repairs, and where XP comes from.')+subnav('xp',[['calc','Calculator'],['ench','Enchanting cost'],['mend','Mending'],['src','Sources']])+(X.sub==='ench'?renderXPEnch():X.sub==='mend'?renderMending():X.sub==='src'?renderSources():renderXPCalc())}

/* ---------- portals ---------- */
function portalOut(side){
  const P=TS.portal,[x,y,z]=side==='o'?[P.ox,P.oy,P.oz]:[P.nx,P.ny,P.nz];if(x===''||z==='')return '<p class="hint">Enter X and Z.</p>';
  const X=+x,Z=+z,Y=y===''?null:+y;
  if(side==='o')return `<p class="bdur"><b>Nether: X ${Math.floor(X/8)}, ${Y===null?'':'Y '+Y+', '}Z ${Math.floor(Z/8)}</b></p>${Y!==null&&(Y>=123||Y<=4)?'<p class="small">The Nether has bedrock up to Y 4 and from Y 123, so build between those heights.</p>':''}`;
  return `<p class="bdur"><b>Overworld: X ${X*8}, ${Y===null?'':'Y '+Y+', '}Z ${Z*8}</b></p><p class="small">Any spot from X ${X*8} to ${X*8+7} and Z ${Z*8} to ${Z*8+7} matches this Nether block.</p>`;
}
function renderConvert(){const P=TS.portal,f=(k,l)=>`<label class="pfield"><span>${l}</span><input class="num" type="number" inputmode="numeric" data-pt="${k}" value="${esc(P[k])}"></label>`;
  return `<article class="bpanel"><h2 class="eh">Overworld to Nether</h2><div class="pgrid">${f('ox','X')}${f('oy','Y')}${f('oz','Z')}</div><div id="pout1">${portalOut('o')}</div></article>
  <article class="bpanel"><h2 class="eh">Nether to Overworld</h2><div class="pgrid">${f('nx','X')}${f('ny','Y')}${f('nz','Z')}</div><div id="pout2">${portalOut('n')}</div></article>
  <section class="how"><h3>How linking works</h3><p>One block in the Nether is 8 in the Overworld, for X and Z. Height doesn’t scale.</p><p>Going through, the game looks for an existing portal near the matching spot: within 128 blocks in the Overworld, or 16 in the Nether. If there isn’t one, it builds a new portal. Build your second portal right at the matching coordinates so they always link.</p><p>The smallest frame is 4 wide and 5 tall, 10 obsidian without corners. The largest is 23 by 23.</p></section>`}
function linkCheck(list){
  const d=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),cheb=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.z-b.z));
  return list.map((p,i)=>{const issues=[];
    const tN={x:Math.floor(p.o.x/8),z:Math.floor(p.o.z/8)},nn=list.map((q,j)=>({j,dd:d(q.n,tN),c:cheb(q.n,tN)})).filter(x=>x.c<=16).sort((a,b)=>a.dd-b.dd)[0];
    if(!nn)issues.push('Going to the Nether, no saved portal is within 16 blocks of the matching spot, so the game would build a new one.');else if(nn.j!==i)issues.push(`Going to the Nether, it would come out at “${list[nn.j].name}” instead.`);
    const tO={x:p.n.x*8,z:p.n.z*8},no=list.map((q,j)=>({j,dd:d(q.o,tO),c:cheb(q.o,tO)})).filter(x=>x.c<=128).sort((a,b)=>a.dd-b.dd)[0];
    if(!no)issues.push('Coming back, no saved Overworld portal is within 128 blocks, so the game would build a new one.');else if(no.j!==i)issues.push(`Coming back, it would come out at “${list[no.j].name}” instead.`);
    return issues;});
}
function renderMyPortals(){
  const P=TS.portal,list=P.saved,checks=linkCheck(list);
  return `<p class="lede">Save your portal pairs. Each pair is checked against all the others for mixed-up links.</p>
  <div class="bpanel"><input id="pname" class="tin wide" placeholder="Name, like “Base” or “Village”" aria-label="Portal name">
  <p class="small">Overworld portal</p><div class="pgrid"><input id="pox" class="num" type="number" inputmode="numeric" placeholder="X" aria-label="Overworld X"><input id="poy" class="num" type="number" inputmode="numeric" placeholder="Y" aria-label="Overworld Y"><input id="poz" class="num" type="number" inputmode="numeric" placeholder="Z" aria-label="Overworld Z"></div>
  <p class="small">Nether portal (leave empty to use the matching spot)</p><div class="pgrid"><input id="pnx" class="num" type="number" inputmode="numeric" placeholder="X" aria-label="Nether X"><input id="pny" class="num" type="number" inputmode="numeric" placeholder="Y" aria-label="Nether Y"><input id="pnz" class="num" type="number" inputmode="numeric" placeholder="Z" aria-label="Nether Z"></div>
  <button class="btn primary" data-padd="1">Save portal</button></div>
  ${list.length?`<ul class="vlist">${list.map((p,i)=>`<li class="vcard">${img('Obsidian','ic big')}<div class="vbody"><b>${esc(p.name)}</b><small>Overworld ${p.o.x}, ${p.o.y}, ${p.o.z} · Nether ${p.n.x}, ${p.n.y}, ${p.n.z}</small>${checks[i].length?checks[i].map(t=>`<span class="pwarn">${esc(t)}</span>`).join(''):'<span class="pok">✓ Links both ways</span>'}</div><button class="link" data-prm="${i}">Remove</button></li>`).join('')}</ul><p class="small">This checks distances the way the game searches. Very different heights can still change which portal wins.</p>`:'<p class="hint">No portals saved yet.</p>'}`;
}
function renderTravel(){const P=TS.portal,ok=P.ax!==''&&P.az!==''&&P.bx!==''&&P.bz!=='';const f=(k,l)=>`<label class="pfield"><span>${l}</span><input class="num" type="number" inputmode="numeric" data-ptr="${k}" value="${esc(P[k])}"></label>`;
  let out='<p class="hint">Enter where you are and where you’re going, in Overworld coordinates.</p>';
  if(ok){const d=Math.hypot(P.bx-P.ax,P.bz-P.az),n=d/8,t=x=>x<60?Math.round(x)+' s':Math.round(x/60)+' min';out=`<div class="esum"><div><b>${Math.round(d).toLocaleString()}</b><span>blocks in the Overworld</span></div><div><b>${Math.round(n).toLocaleString()}</b><span>blocks through the Nether</span></div><div><b>${t(n/5.6)}</b><span>sprinting in the Nether vs ${t(d/5.6)}</span></div></div><p class="small">Times assume sprinting at about 5.6 blocks a second, not counting the portals.</p>`}
  return `<article class="bpanel"><p class="small">From</p><div class="pgrid two">${f('ax','X')}${f('az','Z')}</div><p class="small">To</p><div class="pgrid two">${f('bx','X')}${f('bz','Z')}</div><div id="trout">${out}</div></article>`}
function renderPortal(){const P=TS.portal;return head('Nether portals','Convert coordinates, save your portals and check their links, and see how much the Nether saves.')+subnav('portal',[['convert','Converter'],['mine','My portals'],['travel','Travel']])+(P.sub==='mine'?renderMyPortals():P.sub==='travel'?renderTravel():renderConvert())}

/* ---------- 3D trim preview: drawn pixel by pixel with a depth buffer, so overlapping faces can never flicker ---------- */
const BOX={head:{s:[8,8,8],uv:[0,0],c:[0,28,0]},body:{s:[8,12,4],uv:[16,16],c:[0,18,0]},rarm:{s:[4,12,4],uv:[40,16],c:[-6,18,0]},larm:{s:[4,12,4],uv:[40,16],c:[6,18,0],m:1},rleg:{s:[4,12,4],uv:[0,16],c:[-2,6,0]},lleg:{s:[4,12,4],uv:[0,16],c:[2,6,0],m:1}};
const PIECE_PARTS={helmet:['humanoid',1,['head']],chest:['humanoid',1,['body','rarm','larm']],legs:['humanoid_leggings',0.5,['body','rleg','lleg']],boots:['humanoid',1,['rleg','lleg']]};
const PART_PRI={body:0,head:1,rleg:2,lleg:3,rarm:4,larm:5};
const SHADE3={front:0.92,back:0.7,right:0.78,left:0.78,top:1,bottom:0.55};
let skinTex=null;
function makeSkin(){ // a plain player skin in the same 64x32 layout as armor
  const c=document.createElement('canvas');c.width=64;c.height=32;const g=c.getContext('2d');if(!g||!g.fillRect)return null;
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  r(0,0,32,16,'#c4986a');r(8,0,8,8,'#5a3a24');r(0,8,32,2,'#5a3a24');r(8,8,8,2,'#5a3a24');r(9,12,2,1,'#fff');r(13,12,2,1,'#fff');r(10,12,1,1,'#3b3bb0');r(13,12,1,1,'#3b3bb0');
  r(16,16,24,16,'#3d7ab8');r(40,16,16,16,'#c4986a');r(40,16,16,7,'#3d7ab8');r(0,16,16,16,'#2f3a7a');return c;
}
const texData=new Map();
function pixels(c){if(!c)return null;let d=texData.get(c);if(d)return d;const g=c.getContext('2d');if(!g||!g.getImageData)return null;const id=g.getImageData(0,0,c.width,c.height);if(!id||!id.data)return null;d={w:c.width,h:c.height,px:id.data};texData.set(c,d);return d}
const texCache={};
async function pieceTex(P,layer){
  const k=[P.mat,P.pat,P.tm,layer].join(':');if(texCache[k])return texCache[k];
  const base=await loadImg(TRIM_BASE[P.mat+':'+layer]);if(!base)return null;
  const c=document.createElement('canvas');c.width=64;c.height=32;const g=c.getContext('2d');if(!g||!g.drawImage)return null;g.drawImage(base,0,0);
  if(P.pat&&P.pat!=='none'){const t=await recolorTrim(P.pat,layer,P.tm,P.mat);if(t)g.drawImage(t,0,0)}
  return texCache[k]=c;
}
/* each face: three corners (top-left, top-right, bottom-left) in model space, plus its texture rectangle */
function boxFaces(part,tex,inf,order){
  const b=BOX[part],[w,h,d]=b.s,[u,v]=b.uv,W=w+2*inf,H=h+2*inf,D=d+2*inf,cx=b.c[0],cy=16-b.c[1],cz=b.c[2];
  const x1=cx-W/2,x2=cx+W/2,y1=cy-H/2,y2=cy+H/2,z1=cz-D/2,z2=cz+D/2;  // y grows downward, z toward the viewer
  const R={top:[u+d,v,w,d],bottom:[u+d+w,v,w,d],right:[u,v+d,d,h],front:[u+d,v+d,w,h],left:[u+d+w,v+d,d,h],back:[u+2*d+w,v+d,w,h]};
  const C={front:[[x1,y1,z2],[x2,y1,z2],[x1,y2,z2]],back:[[x2,y1,z1],[x1,y1,z1],[x2,y2,z1]],right:[[x1,y1,z1],[x1,y1,z2],[x1,y2,z1]],left:[[x2,y1,z2],[x2,y1,z1],[x2,y2,z2]],top:[[x1,y1,z1],[x2,y1,z1],[x1,y1,z2]],bottom:[[x1,y2,z2],[x2,y2,z2],[x1,y2,z1]]};
  return Object.keys(C).map(f=>{const src=b.m&&(f==='left'||f==='right')?(f==='left'?'right':'left'):f;return {p:C[f],r:R[src],m:!!b.m,tex,sh:SHADE3[f],order:order*10+PART_PRI[part]}});
}
let rigY=-28,rigX=-10,buildId=0,FACES=[],drawQueued=false;
function renderRig(){
  drawQueued=false;const cv=document.getElementById('trimcv3');if(!cv)return;const g=cv.getContext('2d');if(!g||!g.createImageData)return;
  const W=cv.width,H=cv.height,img=g.createImageData(W,H);if(!img||!img.data)return;const out=img.data,zb=new Float64Array(W*H).fill(-1e9);
  const ay=rigY*Math.PI/180,ax=rigX*Math.PI/180,cyy=Math.cos(ay),syy=Math.sin(ay),cxx=Math.cos(ax),sxx=Math.sin(ax),k=H/44,ox=W/2,oy=H/2;
  const tf=p=>{const x=p[0]*cyy+p[2]*syy,z0=-p[0]*syy+p[2]*cyy,y=p[1]*cxx-z0*sxx,z=p[1]*sxx+z0*cxx;return [ox+x*k,oy+y*k,z]};
  for(const f of FACES){
    const T=pixels(f.tex);if(!T)continue;
    const A=tf(f.p[0]),B=tf(f.p[1]),Cc=tf(f.p[2]);
    const ex=B[0]-A[0],ey=B[1]-A[1],fx=Cc[0]-A[0],fy=Cc[1]-A[1],det=ex*fy-ey*fx;if(Math.abs(det)<1e-6)continue;
    const D=[B[0]+fx,B[1]+fy];
    const minX=Math.max(0,Math.floor(Math.min(A[0],B[0],Cc[0],D[0]))),maxX=Math.min(W-1,Math.ceil(Math.max(A[0],B[0],Cc[0],D[0])));
    const minY=Math.max(0,Math.floor(Math.min(A[1],B[1],Cc[1],D[1]))),maxY=Math.min(H-1,Math.ceil(Math.max(A[1],B[1],Cc[1],D[1])));
    const [rx,ry,rw,rh]=f.r,dz1=B[2]-A[2],dz2=Cc[2]-A[2],bias=f.order*1e-4;
    for(let y=minY;y<=maxY;y++){const py=y+0.5-A[1];
      for(let x=minX;x<=maxX;x++){const px=x+0.5-A[0],s=(px*fy-py*fx)/det,t=(ex*py-ey*px)/det;
        if(s<0||s>=1||t<0||t>=1)continue;
        const z=A[2]+s*dz1+t*dz2+bias,i=y*W+x;if(z<=zb[i])continue;
        const tu=rx+Math.floor((f.m?1-s:s)*rw*0.99999),tv=ry+Math.floor(t*rh*0.99999),ti=(tv*T.w+tu)*4;
        if(T.px[ti+3]<128)continue;
        zb[i]=z;const o=i*4;out[o]=T.px[ti]*f.sh;out[o+1]=T.px[ti+1]*f.sh;out[o+2]=T.px[ti+2]*f.sh;out[o+3]=255;
      }}
  }
  g.putImageData(img,0,0);
}
const applyRig=()=>{if(!drawQueued){drawQueued=true;(window.requestAnimationFrame||setTimeout)(renderRig)}};
async function drawTrimPreview(){
  if(!document.getElementById('trimcv3'))return;const id=++buildId;
  skinTex=skinTex||makeSkin();const faces=[];
  Object.keys(BOX).forEach(p=>faces.push(...boxFaces(p,skinTex,0,0)));
  let order=1;
  for(const pc of ['legs','boots','chest','helmet']){const P=TS.smith.pieces[pc];if(!P||P.mat==='none'){order++;continue}const [layer,inf,parts]=PIECE_PARTS[pc];
    const tex=await pieceTex(P,layer);if(id!==buildId)return;if(tex)parts.forEach(p=>faces.push(...boxFaces(p,tex,inf,order)));order++}
  FACES=faces;applyRig();
}
(function(){let drag=null;
  document.addEventListener('pointerdown',e=>{const st=e.target.closest('#stage3d');if(!st)return;drag={x:e.clientX,y:e.clientY};st.classList.add('dragging');try{st.setPointerCapture(e.pointerId)}catch(err){}});
  document.addEventListener('pointermove',e=>{if(!drag)return;rigY+=(e.clientX-drag.x)*0.7;rigX=Math.max(-45,Math.min(45,rigX-(e.clientY-drag.y)*0.4));drag={x:e.clientX,y:e.clientY};applyRig()});
  const end=()=>{if(!drag)return;drag=null;const st=document.getElementById('stage3d');if(st)st.classList.remove('dragging')};
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-view3d]');if(!b)return;rigY={front:-28,side:-90,back:180,right:90}[b.dataset.view3d];rigX=-10;applyRig()});
})();
