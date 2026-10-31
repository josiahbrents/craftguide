/* ---------- Enchanting tab ---------- */
const TYPE=Object.fromEntries(ITEM_TYPES.map(([k,n,ic])=>[k,{k,n,ic}]));
const lvTxt=(id,l)=>EBY[id].max===1?EBY[id].name:EBY[id].name+' '+roman(l);
const listTxt=m=>{const k=Object.keys(m);return k.length?k.sort((a,b)=>ENCH.indexOf(EBY[a])-ENCH.indexOf(EBY[b])).map(id=>lvTxt(id,m[id])).join(', '):'No enchantments'};
const E={sub:'planner',type:'boots',want:{...presetFor('boots')},existing:{},uses:0,custom:[],inv:[],draft:null,byItem:'helmet',q:'',mode:'one',set:{helmet:{...presetFor('helmet')},chest:{...presetFor('chest')},legs:{...presetFor('legs')},boots:{...presetFor('boots')}},setOpen:null,setPlanOpen:null,build:{},setBuild:{}};
try{const s=JSON.parse(localStorage.getItem('mc-ench')||'null');if(s&&TYPE[s.type])Object.assign(E,s,{draft:null,inv:Array.isArray(s.inv)?s.inv:[],set:s.set&&s.set.helmet?s.set:E.set,mode:s.mode==='set'?'set':'one',build:s.build&&typeof s.build==='object'?s.build:{},setBuild:s.setBuild&&typeof s.setBuild==='object'?s.setBuild:{}})}catch(e){}
const saveE=()=>{try{const {draft,...rest}=E;localStorage.setItem('mc-ench',JSON.stringify(rest))}catch(e){}};
const typeEnchants=t=>ENCH.filter(e=>canTake(t,e.id)&&e.src!=='curse');
const bookImg=()=>img('Enchanted Book');
function itemChips(sel,attr){return `<div class="ichips" role="group" aria-label="Item">${ITEM_TYPES.map(([k,n,ic])=>`<button class="ichip" data-${attr}="${k}" aria-pressed="${k===sel}">${img(ic)}<span>${esc(n)}</span></button>`).join('')}</div>`}
function lvSelect(id,val,attr,none){const e=EBY[id];let o=none?`<option value="0"${!val?' selected':''}>None</option>`:'';for(let i=1;i<=e.max;i++)o+=`<option value="${i}"${i===val?' selected':''}>${roman(i)}</option>`;return `<select class="lv" data-${attr}="${id}" aria-label="${esc(e.name)} level">${o}</select>`}

/* planner */
const SETS=['helmet','chest','legs','boots'];
const depthFor=(map,id,L)=>Math.max(0,Math.min((map||{})[id]||0,L-1));
const splitBook=(map,id,L)=>{const d=depthFor(map,id,L);return {lv:L-d,count:Math.pow(2,d),d}};
let DONE={};try{DONE=JSON.parse(localStorage.getItem('mc-steps')||'{}')}catch(e){}
const saveDone=()=>{try{localStorage.setItem('mc-steps',JSON.stringify(DONE))}catch(e){}};
const enchOrder=(a,b)=>ENCH.indexOf(EBY[a])-ENCH.indexOf(EBY[b]);
function rowsHtml(t,want,pre){
  return typeEnchants(t).map(e=>{
    const on=want[e.id]!==undefined,clash=Object.keys(want).filter(o=>o!==e.id&&conflicts(o,e.id));
    const tags=[];if(!fromTable(t,e.id))tags.push('<span class="etag">Book only</span>');if(e.src!=='table')tags.push('<span class="etag gold">Treasure</span>');
    return `<div class="erow${on?' on':''}"><button class="etog" data-tog="${pre}${e.id}" aria-pressed="${on}"><span class="box" aria-hidden="true"></span><span class="en"><b>${esc(e.name)}</b>${tags.join('')}${!on&&clash.length?`<small>Replaces ${esc(clash.map(c=>EBY[c].name).join(', '))}</small>`:''}</span></button>${on&&e.max>1?lvSelect(e.id,want[e.id],'lv',false).replace(`data-lv="${e.id}"`,`data-lv="${pre}${e.id}"`):''}</div>`}).join('');
}
const haveIds=()=>{const s=new Set();E.inv.forEach(x=>s.add(x.id));E.custom.forEach(b=>Object.keys(b.ench).forEach(k=>s.add(k)));return s};
function singleSpec(){
  const have=haveIds(),books=[];
  E.inv.forEach(x=>{if(x.n>0)books.push({ench:{[x.id]:x.lv},work:0,count:x.n,tag:'have'})});
  E.custom.forEach(b=>books.push({ench:{...b.ench},work:b.work||0,count:1,tag:'have'}));
  const auto=[];
  for(const [id,lv] of Object.entries(E.want)){if(have.has(id)||(E.existing[id]||0)>=lv)continue;const sp=splitBook(E.build,id,lv);auto.push({ench:{[id]:sp.lv},work:0,count:sp.count,tag:'new',target:lv,d:sp.d})}
  return {type:E.type,want:{...E.want},item:{ench:{...E.existing},work:E.uses},books:[...books,...auto],budget:1800000};
}
function shortfalls(){
  const out=[],have=haveIds();
  for(const [id,lv] of Object.entries(E.want)){
    if(!have.has(id))continue;
    const stacks=E.inv.filter(x=>x.id===id).map(x=>[Math.min(x.lv,EBY[id].max),x.n]);
    E.custom.forEach(b=>{if(b.ench[id])stacks.push([b.ench[id],1])});
    if(E.existing[id])stacks.push([E.existing[id],1]);
    out.push(inventoryCheck(id,lv,stacks));
  }
  return out;
}
function setSpecs(){
  return SETS.map(t=>({type:t,want:{...E.set[t]},item:{ench:{},work:0},books:Object.entries(E.set[t]).map(([id,lv])=>{const sp=splitBook(E.setBuild,id,lv);return {ench:{[id]:sp.lv},count:sp.count,tag:'new'}}),budget:1800000}));
}
function renderPlanner(){
  const modes=`<div class="pmode" role="group" aria-label="Plan for"><button data-pmode="one" aria-pressed="${E.mode==='one'}">One item</button><button data-pmode="set" aria-pressed="${E.mode==='set'}">Full armor set</button></div>`;
  const head=modes;
  if(E.mode==='set')return head+renderSetInputs()+'<div id="eresult" aria-live="polite"></div>';
  const t=E.type,list=typeEnchants(t);
  const ex=list.map(e=>`<label class="exrow"><span>${esc(e.name)}</span>${lvSelect(e.id,E.existing[e.id]||0,'ex',true)}</label>`).join('');
  const usesOpt=[0,1,2,3,4,5].map(i=>`<option value="${i}"${i===E.uses?' selected':''}>${i===0?'0, never used':i+' (adds '+pen(i)+' levels)'}</option>`).join('');
  const stacks=E.inv.map((x,i)=>`<li class="cbook">${bookImg()}<span><b>${x.n}×</b> ${esc(lvTxt(x.id,x.lv))}</span><span class="stepper"><button class="sbtn" data-invdec="${i}" aria-label="One fewer">−</button><button class="sbtn" data-invinc="${i}" aria-label="One more">+</button></span><button class="link" data-invrm="${i}">Remove</button></li>`).join('');
  const custom=E.custom.map((b,i)=>`<li class="cbook">${bookImg()}<span>${esc(listTxt(b.ench))}${b.work?` <small>(${b.work} anvil use${b.work>1?'s':''})</small>`:''}</span><button class="link" data-rmbook="${i}">Remove</button></li>`).join('');
  const enchOpts=list.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('');
  let draft='';
  if(E.draft){
    const opts=ENCH.filter(e=>e.src!=='curse').map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('');
    draft=`<div class="draft"><div class="drow"><select id="dench" aria-label="Enchantment">${opts}</select><select id="dlv" aria-label="Level">${[1,2,3,4,5].map(i=>`<option value="${i}">${roman(i)}</option>`).join('')}</select><button class="btn" data-e="dadd">Add</button></div>
      <p class="small">${Object.keys(E.draft.ench).length?'On this book: '+esc(listTxt(E.draft.ench)):'Nothing added yet.'}</p>
      <label class="exrow"><span>Anvil uses on this book</span><select id="dwork">${[0,1,2,3,4].map(i=>`<option value="${i}"${i===E.draft.work?' selected':''}>${i}</option>`).join('')}</select></label>
      <div class="drow"><button class="btn primary" data-e="dsave">Save book</button><button class="btn" data-e="dcancel">Cancel</button></div></div>`;
  }
  const open=Object.keys(E.existing).length||E.uses||E.custom.length||E.inv.length||E.draft;
  return head+`${itemChips(t,'ptype')}
  <div class="eactions"><button class="btn primary" data-e="preset">Use the god ${esc(TYPE[t].n.toLowerCase())} preset</button><button class="btn" data-e="clear">Clear</button></div>
  <div class="erows">${rowsHtml(t,E.want,'')}</div>
  <details class="adv"${open?' open':''}><summary>Already have books or enchantments?</summary>
    <h3 class="eh3">Books you have</h3>
    <div class="drow"><select id="iench" aria-label="Enchantment">${enchOpts}</select><select id="ilv" aria-label="Level">${[1,2,3,4,5].map(i=>`<option value="${i}">${roman(i)}</option>`).join('')}</select><select id="icount" aria-label="How many">${Array.from({length:16},(_,i)=>`<option value="${i+1}">${i+1}×</option>`).join('')}</select><button class="btn" data-e="invadd">Add</button></div>
    ${stacks?`<ul class="cbooks">${stacks}</ul>`:''}
    <h3 class="eh3">Books with several enchantments</h3>
    ${custom?`<ul class="cbooks">${custom}</ul>`:''}
    ${draft||'<button class="btn" data-e="dnew">Add a book like this</button>'}
    <h3 class="eh3">Your ${esc(TYPE[t].n.toLowerCase())}</h3>
    <label class="exrow"><span>Times it’s been on an anvil</span><select data-e="uses">${usesOpt}</select></label>
    <div class="exgrid">${ex}</div>
  </details>
  <div id="eresult" aria-live="polite"></div>`;
}
function renderSetInputs(){
  return `<div class="eactions"><button class="btn primary" data-e="setpreset">Use god presets</button><button class="btn" data-e="setclear">Clear all</button></div>
  <div class="pieces">${SETS.map(t=>{const w=E.set[t],keys=Object.keys(w).sort(enchOrder),openP=E.setOpen===t;
    return `<div class="piece${openP?' open':''}"><button class="phead" data-setopen="${t}" aria-expanded="${openP}">${img(TYPE[t].ic,'ic big')}<span><b>${esc(TYPE[t].n)}</b><small>${keys.length?esc(keys.map(k=>lvTxt(k,w[k])).join(', ')):'Nothing picked'}</small></span><span class="chev" aria-hidden="true">${openP?'Done':'Edit'}</span></button>${openP?`<div class="erows">${rowsHtml(t,w,t+':')}</div>`:''}</div>`}).join('')}</div>`;
}
function slotHtml(s,type){
  const isItem=s.isItem,name=isItem?'Your '+TYPE[type].n.toLowerCase():s.tag==='have'?'Your book':s.tag==='new'?'New book':'Combined book';
  return `<div class="aslot">${isItem?img(TYPE[type].ic,'ic big'):img('Enchanted Book','ic big')}<div><b>${esc(name)}</b><span>${esc(listTxt(s.ench))}</span>${s.work?`<small>${s.work} anvil use${s.work>1?'s':''}</small>`:''}</div></div>`;
}
const sigOf=(type,steps)=>{let h=0;const s=type+JSON.stringify(steps.map(x=>[x.left.ench,x.right.ench,x.cost]));for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return type+'-'+h.toString(36)};
function stepsHtml(r,type){
  const sig=sigOf(type,r.plan.steps),done=new Set(DONE[sig]||[]),n=r.plan.steps.length;
  let h=`<div class="chk"><span>${done.size} of ${n} steps done</span>${done.size?`<button class="link" data-reset="${sig}">Reset</button>`:''}</div><ol class="steps">`;
  r.plan.steps.forEach((s,i)=>{
    const isDone=done.has(i);
    const lu=(s.levelUp||[]).map(id=>{const a=s.left.ench[id];return `${EBY[id].name} ${roman(a)} + ${roman(a)} → ${roman(Math.min(a+1,EBY[id].max))}`});
    h+=`<li><div class="step${isDone?' done':''}" role="button" tabindex="0" aria-pressed="${isDone}" data-step="${sig}:${i}">
      <div class="shead"><span>${isDone?'<span class="tick" aria-hidden="true">✓</span> ':''}Step ${i+1}${s.pre?' <small class="prep">Prep</small>':''}</span><span class="cost">${s.cost} level${s.cost===1?'':'s'}</span></div>
      <div class="sbody">${slotHtml(s.left,type)}<span class="plus" aria-hidden="true">+</span>${slotHtml(s.right,type)}</div>
      <p class="sres">Makes ${esc(s.res.isItem?'your '+TYPE[type].n.toLowerCase():'a book')}: ${esc(listTxt(s.res.ench))}${lu.length?` <span class="lu">Levels up: ${esc(lu.join(', '))}</span>`:''}</p>
      <p class="tapnote">${isDone?'Done. Tap to undo.':'Tap when done'}</p></div></li>`;
  });
  return h+'</ol>';
}
function bookList(items,scope){return `<ul class="shop">${items.map(([id,lv,n,target,d])=>{
  let ctl='';
  if(scope&&target>1){
    const lower=[];if(lv>1)lower.push(`<button class="btn small" data-build="${scope}:${id}:${(d||0)+1}">Build from ${n*2}× ${esc(lvTxt(id,lv-1))}</button>`);
    if(d)lower.push(`<button class="btn small" data-build="${scope}:${id}:0">Use ${n/Math.pow(2,d)>1?n/Math.pow(2,d)+'× ':''}${esc(lvTxt(id,target))} instead</button>`);
    ctl=(d?`<span class="built">Combined into ${esc(lvTxt(id,target))} in the steps below.</span>`:'')+(lower.length?`<span class="bctl">${lower.join('')}</span>`:'');
  }
  return `<li>${bookImg()}<div><b>${n>1?n+'× ':''}${esc(lvTxt(id,lv))}</b><span>${esc(SOURCES[EBY[id].src])}</span>${ctl}</div></li>`}).join('')}</ul>`}
function singleResult(r){
  const type=E.type;
  if(r.none)return '<div class="warn"><b>Too Expensive!</b><p>Every order has a step over 39 levels.</p></div>';
  let h=`<div class="esum"><div><b>${r.plan.cost}</b><span>levels in total</span></div><div><b>${r.plan.steps.length}</b><span>anvil step${r.plan.steps.length===1?'':'s'}</span></div><div><b>${r.plan.max}</b><span>most for one step</span></div></div>
  <div class="eactions"><button class="btn small" data-go="tools|xp:${r.plan.max}">XP needed for level ${r.plan.max}</button></div>`;
  if(r.approx||r.pre.length)h+=`<p class="note">Prep steps combine identical books first. The total may be 1 or 2 levels over the minimum.</p>`;
  const sf=shortfalls();
  sf.forEach(x=>{if(x.need)h+=`<div class="warn"><p>To reach ${esc(lvTxt(x.id,x.target))}, you need 1 more ${esc(lvTxt(x.id,x.need))}. With what you have, the best is ${esc(lvTxt(x.id,x.top||1))}.</p></div>`});
  const miss=r.missing.filter(m=>!sf.some(x=>x.id===m.id&&x.need));
  if(miss.length)h+=`<div class="warn"><p>Can’t reach ${esc(miss.map(m=>lvTxt(m.id,m.want)).join(', '))} without going over 39 levels.</p></div>`;
  if(r.leftover.length)h+=`<h3 class="eh3">Not used</h3><ul class="shop">${r.leftover.map(x=>`<li>${bookImg()}<div><b>${x.n>1?x.n+'× ':''}${esc(listTxt(x.ench))}</b></div></li>`).join('')}</ul>`;
  const auto=singleSpec().books.filter(b=>b.tag==='new').map(b=>{const id=Object.keys(b.ench)[0];return [id,b.ench[id],b.count,b.target,b.d]});
  if(auto.length)h+=`<h3 class="eh3">Books to get</h3>${bookList(auto,'one')}`;
  h+=`<h3 class="eh3">Anvil steps</h3>`+stepsHtml(r,type);
  h+=`<p class="note">Finished: ${r.plan.work} anvil uses, +${pen(r.plan.work)} levels on later anvil jobs.</p>`;
  return h;
}
function setResult(rs){
  const ok=rs.filter(r=>!r.none),total=ok.reduce((a,r)=>a+r.plan.cost,0),steps=ok.reduce((a,r)=>a+r.plan.steps.length,0);
  const shop={};SETS.forEach(t=>Object.entries(E.set[t]).forEach(([id,lv])=>{const k=id+':'+lv;shop[k]=(shop[k]||0)+1}));
  const items=Object.entries(shop).map(([k,n])=>{const [id,L]=k.split(':'),sp=splitBook(E.setBuild,id,+L);return [id,sp.lv,n*sp.count,+L,sp.d]}).sort((a,b)=>enchOrder(a[0],b[0])||b[3]-a[3]);
  const nBooks=items.reduce((a,x)=>a+x[2],0);
  if(!nBooks)return '<p class="hint">Pick enchantments for at least one piece.</p>';
  let h=`<div class="esum"><div><b>${total}</b><span>levels for the set</span></div><div><b>${steps}</b><span>anvil steps</span></div><div><b>${nBooks}</b><span>books to get</span></div></div>`;
  h+=`<h3 class="eh3">Shopping list</h3>${bookList(items,'set')}<h3 class="eh3">Plans for each piece</h3><div class="pres">`;
  rs.forEach((r,i)=>{const t=SETS[i];if(!Object.keys(E.set[t]).length)return;
    if(r.none){h+=`<details class="pplan"><summary>${img(TYPE[t].ic)}<span><b>${esc(TYPE[t].n)}</b><small>Too Expensive! Try fewer enchantments.</small></span></summary></details>`;return}
    const sig=sigOf(t,r.plan.steps),d=(DONE[sig]||[]).length,n=r.plan.steps.length,openP=E.setPlanOpen===t;
    h+=`<details class="pplan" data-pplan="${t}"${openP?' open':''}><summary>${img(TYPE[t].ic)}<span><b>${esc(TYPE[t].n)}</b><small>${r.plan.cost} levels, ${n} step${n===1?'':'s'}${d?`, ${d} done`:''}</small></span></summary><div class="ppbody">${stepsHtml(r,t)}</div></details>`});
  h+='</div>';
  return h;
}
let worker=null,wid=0;const pending={};
try{if(typeof Worker!=='undefined'&&location.protocol.indexOf('http')===0){worker=new Worker('planner_worker.js');worker.onmessage=e=>{const p=pending[e.data.id];if(!p)return;delete pending[e.data.id];e.data.error?p.rej(e.data.error):p.res(e.data.results)};worker.onerror=()=>{worker=null;Object.values(pending).forEach(p=>p.rej('worker'))}}}catch(e){worker=null}
function solveAsync(specs){return new Promise((res,rej)=>{if(worker){const id=++wid;pending[id]={res,rej};worker.postMessage({id,specs})}else setTimeout(()=>{try{res(specs.map(s=>anvilSolve(s)))}catch(err){rej(err)}},20)})}
let runId=0,lastRes=null;
function runPlanner(){
  const box=document.getElementById('eresult');if(!box)return;
  const id=++runId;
  if(E.mode==='set'){box.innerHTML='<p class="hint">Working out the cheapest order for each piece…</p>';
    solveAsync(setSpecs()).then(rs=>{if(id!==runId)return;lastRes={mode:'set',rs};box.innerHTML=setResult(rs)}).catch(()=>{if(id===runId)box.innerHTML='<p class="hint">Something went wrong working this out. Try again.</p>'});return}
  const spec=singleSpec();
  if(!Object.keys(E.want).length){box.innerHTML='<p class="hint">Pick at least one enchantment.</p>';return}
  if(!spec.books.length){box.innerHTML='<p class="hint">Your item already has everything you picked.</p>';return}
  const n=spec.books.reduce((a,b)=>a+b.count,0);
  box.innerHTML=`<p class="hint">${n>9?'Checking every possible order. With this many books it can take a few seconds…':'Working out the cheapest order…'}</p>`;
  solveAsync([spec]).then(([r])=>{if(id!==runId)return;lastRes={mode:'one',r};box.innerHTML=singleResult(r)}).catch(()=>{if(id===runId)box.innerHTML='<p class="hint">Something went wrong working this out. Try again.</p>'});
}
function toggleStep(key){
  const [sig,i]=[key.slice(0,key.lastIndexOf(':')),+key.slice(key.lastIndexOf(':')+1)];
  const s=new Set(DONE[sig]||[]);s.has(i)?s.delete(i):s.add(i);if(s.size)DONE[sig]=[...s];else delete DONE[sig];saveDone();
  const box=document.getElementById('eresult');if(!box||!lastRes)return;
  const y=window.scrollY;box.innerHTML=lastRes.mode==='set'?setResult(lastRes.rs):singleResult(lastRes.r);window.scrollTo(0,y);
  const el=box.querySelector(`[data-step="${key}"]`);if(el)el.focus({preventScroll:true});
}

/* by item */
function renderByItem(){
  const t=E.byItem,list=ENCH.filter(e=>canTake(t,e.id));
  const tab=list.filter(e=>fromTable(t,e.id)),book=list.filter(e=>!fromTable(t,e.id));
  const row=e=>`<li><button class="erow2" data-eopen="${e.id}">${bookImg()}<span><b>${esc(e.name)}</b> <small>max ${roman(e.max)}</small></span></button></li>`;
  const uniq=[];
  list.forEach(e=>{if(!CONFLICTS[e.id])return;const g=uniq.find(g=>g.every(o=>conflicts(o,e.id)));if(g)g.push(e.id);else uniq.push([e.id])});
  for(let i=uniq.length-1;i>=0;i--)if(uniq[i].length<2)uniq.splice(i,1);
  return `${itemChips(t,'btype')}
  <div class="bihead">${linkItem(TYPE[t].ic,img(TYPE[t].ic,'ic big'))}<h3>${esc(TYPE[t].n)}</h3><button class="btn primary" data-plan="${t}">Plan god ${esc(TYPE[t].n.toLowerCase())}</button></div>
  ${tab.length?`<h3 class="eh3">From the enchanting table</h3><ul class="elist">${tab.map(row).join('')}</ul>`:''}
  ${book.length?`<h3 class="eh3">Book and anvil only</h3><ul class="elist">${book.map(row).join('')}</ul>`:''}
  ${uniq.length?`<h3 class="eh3">Pick only one from each group</h3><ul class="groups">${uniq.map(g=>`<li>${esc(g.map(id=>EBY[id].name).join(', ').replace(/, ([^,]*)$/,' or $1'))}</li>`).join('')}</ul>`:''}`;
}

/* all enchantments */
function enchCard(e,open){
  const items=ITEM_TYPES.filter(([k])=>canTake(k,e.id)).map(([k,n])=>n+(fromTable(k,e.id)?'':' (book only)'));
  const cf=[...(CONFLICTS[e.id]||[])].map(c=>EBY[c].name);
  return `<details class="ecard" id="e-${e.id}"${open?' open':''}><summary>${bookImg()}<span><b>${esc(e.name)}</b><small>Max level ${roman(e.max)}</small></span></summary>
  <div class="ecbody"><p>${esc(e.desc)}</p>
  <dl><dt>Works on</dt><dd>${esc(items.join(', '))}</dd>
  ${cf.length?`<dt>Can’t combine with</dt><dd>${esc(cf.join(', '))}</dd>`:''}
  <dt>Where to get it</dt><dd>${esc(SOURCES[e.src])}</dd>
  <dt>Anvil cost</dt><dd>${e.mb} level${e.mb>1?'s':''} per enchantment level from a book, ${e.mi} from an item.</dd></dl>
  ${NO_LIBRARIAN.includes(e.id)?'':`<div class="eactions"><button class="btn small" data-go="trade|hunt:${e.id}">Librarian odds</button></div>`}</div></details>`;
}
function renderAll(){
  const q=E.q.trim().toLowerCase();
  const list=ENCH.filter(e=>!q||e.name.toLowerCase().includes(q)||ITEM_TYPES.some(([k,n])=>n.toLowerCase().includes(q)&&canTake(k,e.id)));
  return `${searchBox(`id="eq" placeholder="Search, like “mending” or “boots”" value="${esc(E.q)}" aria-label="Search enchantments"`)}
  <div id="ealist">${list.length?list.map(e=>enchCard(e,E.openId===e.id)).join(''):'<p class="hint">No enchantments match.</p>'}</div>`;
}

/* shell */
const SUBS=[['planner','Planner'],['item','By item'],['all','All enchantments']];
function renderEnch(){
  const body=document.getElementById('ebody');if(!body)return;
  if(!SUBS.some(s=>s[0]===E.sub))E.sub='planner';
  document.getElementById('esubs').innerHTML=SUBS.map(([k,l])=>`<button data-sub="${k}" aria-pressed="${k===E.sub}">${l}</button>`).join('');
  body.innerHTML=E.sub==='planner'?renderPlanner():E.sub==='item'?renderByItem():renderAll();
  if(E.sub==='planner')runPlanner();
  if(E.sub==='all'&&E.openId){const el=document.getElementById('e-'+E.openId);if(el)el.scrollIntoView({block:'center'})}
  saveE();
}
function setHash(h){try{history.replaceState(null,'','#'+h)}catch(e){}}
function showTab(tab){
  document.getElementById('tab-craft').hidden=tab!=='craft';
  document.getElementById('tab-ench').hidden=tab!=='ench';
  document.querySelectorAll('.tabs button').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  if(tab==='ench'){renderEnch();setHash('ench/'+E.sub)}else if(state.sel)setHash('craft/'+encodeURIComponent(state.sel));
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const d=b.dataset;
  if(d.tab){navClear();showTab(d.tab);return}
  if(!b.closest('#tab-ench'))return;
  if(d.sub){E.sub=d.sub;E.openId=null;renderEnch();setHash('ench/'+E.sub);return}
  if(d.ptype){E.type=d.ptype;E.want={...presetFor(E.type)};E.existing={};E.uses=0;E.custom=[];E.inv=[];E.draft=null;renderEnch();return}
  if(d.btype){E.byItem=d.btype;renderEnch();return}
  if(d.plan){E.type=d.plan;E.want={...presetFor(d.plan)};E.existing={};E.uses=0;E.custom=[];E.inv=[];E.mode='one';E.sub='planner';renderEnch();setHash('ench/planner');window.scrollTo(0,0);return}
  if(d.eopen){E.sub='all';E.q='';E.openId=d.eopen;renderEnch();setHash('ench/all');return}
  if(d.tog){let w=E.want,id=d.tog;if(id.includes(':')){const [p,x]=id.split(':');w=E.set[p];id=x}
    if(w[id]!==undefined)delete w[id];else{Object.keys(w).forEach(o=>{if(conflicts(o,id))delete w[o]});w[id]=EBY[id].max}renderEnch();return}
  if(d.pmode){E.mode=d.pmode;renderEnch();return}
  if(d.build){const [scope,id,v]=d.build.split(':'),map=scope==='set'?E.setBuild:E.build;if(+v)map[id]=+v;else delete map[id];saveE();runPlanner();return}
  if(d.setopen){E.setOpen=E.setOpen===d.setopen?null:d.setopen;renderEnch();return}
  if(d.reset){delete DONE[d.reset];saveDone();if(lastRes){const box=document.getElementById('eresult');box.innerHTML=lastRes.mode==='set'?setResult(lastRes.rs):singleResult(lastRes.r)}return}
  if(d.invinc!==undefined){E.inv[+d.invinc].n=Math.min(64,E.inv[+d.invinc].n+1);renderEnch();return}
  if(d.invdec!==undefined){const x=E.inv[+d.invdec];x.n--;if(x.n<=0)E.inv.splice(+d.invdec,1);renderEnch();return}
  if(d.invrm!==undefined){undoable(E.inv,+d.invrm,'Books removed',renderEnch);return}
  if(d.rmbook!==undefined){undoable(E.custom,+d.rmbook,'Book removed',renderEnch);return}
  switch(d.e){
    case 'preset':E.want={...presetFor(E.type)};renderEnch();break;
    case 'clear':E.want={};renderEnch();break;
    case 'setpreset':SETS.forEach(t=>{E.set[t]={...presetFor(t)}});renderEnch();break;
    case 'setclear':SETS.forEach(t=>{E.set[t]={}});renderEnch();break;
    case 'invadd':{const id=document.getElementById('iench').value,lv=Math.min(+document.getElementById('ilv').value,EBY[id].max),n=+document.getElementById('icount').value;const f=E.inv.find(x=>x.id===id&&x.lv===lv);if(f)f.n+=n;else E.inv.push({id,lv,n});E.inv.sort((a,b)=>enchOrder(a.id,b.id)||b.lv-a.lv);renderEnch();break}
    case 'dnew':E.draft={ench:{},work:0};renderEnch();break;
    case 'dcancel':E.draft=null;renderEnch();break;
    case 'dadd':{const id=document.getElementById('dench').value,lv=Math.min(+document.getElementById('dlv').value,EBY[id].max);E.draft.work=+document.getElementById('dwork').value;E.draft.ench[id]=lv;renderEnch();break}
    case 'dsave':{E.draft.work=+document.getElementById('dwork').value;if(Object.keys(E.draft.ench).length)E.custom.push(E.draft);E.draft=null;renderEnch();break}
  }
});
document.addEventListener('click',e=>{const st=e.target.closest('[data-step]');if(st&&st.closest('#tab-ench'))toggleStep(st.dataset.step)});
document.addEventListener('keydown',e=>{const st=e.target.closest&&e.target.closest('[data-step]');if(st&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggleStep(st.dataset.step)}});
document.addEventListener('toggle',e=>{const p=e.target;if(p.dataset&&p.dataset.pplan){if(p.open)E.setPlanOpen=p.dataset.pplan;else if(E.setPlanOpen===p.dataset.pplan)E.setPlanOpen=null;saveE()}},true);
document.addEventListener('change',e=>{
  const t=e.target;if(!t.closest||!t.closest('#tab-ench'))return;
  if(t.dataset.lv){const k=t.dataset.lv;if(k.includes(':')){const [p,x]=k.split(':');E.set[p][x]=+t.value;saveE();renderEnch()}else{E.want[k]=+t.value;saveE();runPlanner()}}
  else if(t.dataset.ex){const v=+t.value;if(v)E.existing[t.dataset.ex]=v;else delete E.existing[t.dataset.ex];saveE();runPlanner()}
  else if(t.dataset.e==='uses'){E.uses=+t.value;saveE();runPlanner()}
});
document.addEventListener('input',e=>{
  if(e.target.id==='eq'){E.q=e.target.value;saveE();E.openId=null;const l=document.getElementById('ealist');const q=E.q.trim().toLowerCase();
    const list=ENCH.filter(x=>!q||x.name.toLowerCase().includes(q)||ITEM_TYPES.some(([k,n])=>n.toLowerCase().includes(q)&&canTake(k,x.id)));
    l.innerHTML=list.length?list.map(x=>enchCard(x,false)).join(''):'<p class="hint">No enchantments match.</p>';}
});
document.querySelectorAll('.tabs img[data-ic]').forEach(i=>{i.src=icon(i.dataset.ic)});
(function(){const h=decodeURIComponent(location.hash.slice(1));if(h.startsWith('ench')){const s=h.split('/')[1];if(SUBS.some(x=>x[0]===s))E.sub=s;showTab('ench')}})();
