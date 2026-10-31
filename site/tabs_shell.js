/* ---------- tab shell, events ---------- */
const RENDER={brew:renderBrew,trade:renderTrade,smith:renderSmith,banner:renderBanner,food:renderFood,tools:renderTools};
let curTab='craft';
function renderTab(t){const el=document.getElementById('tab-'+t);if(el&&RENDER[t]){el.innerHTML=RENDER[t]();if(t==='smith'&&TS.smith.sub==='trim')drawTrimPreview();if(t==='banner')drawBanners()}saveTS();updateFades()}
function showTab(tab,keepScroll){
  if(!TABS.includes(tab))tab='craft';curTab=tab;if(typeof closeSheet==='function')closeSheet();closeCard();
  TABS.forEach(t=>{const el=document.getElementById('tab-'+t);if(el)el.hidden=t!==tab});
  document.querySelectorAll('.tabs button[data-tab]').forEach(b=>{if(b.dataset.tab===tab){b.setAttribute('aria-current','page');try{const s=b.parentElement;s.scrollTo({left:b.offsetLeft-(s.clientWidth-b.offsetWidth)/2})}catch(e){}}else b.removeAttribute('aria-current')});
  if(tab==='ench'){renderEnch();setHash('ench/'+E.sub)}else if(tab==='craft'){if(state.sel)setHash('craft/'+encodeURIComponent(state.sel))}else{renderTab(tab);setHash(tab)}
  TS.ui.last=tab;saveTS();updateBackBar();updateFades();
  if(!keepScroll)window.scrollTo(0,0);
}
/* soft fade on rows that scroll sideways, on the side that has more to see */
const FADE_SEL='.tabsc,.esubs,.cats,.ichips';
function fadeOne(el){const max=el.scrollWidth-el.clientWidth;el.classList.toggle('fl',max>2&&el.scrollLeft>2);el.classList.toggle('fr',max>2&&el.scrollLeft<max-2)}
function updateFades(){requestAnimationFrame(()=>document.querySelectorAll(FADE_SEL).forEach(fadeOne))}
document.addEventListener('scroll',e=>{const t=e.target;if(t.matches&&t.matches(FADE_SEL))fadeOne(t)},true);
window.addEventListener('resize',updateFades);
/* feel like an app: no pinch zoom (iPhone ignores user-scalable=no, so block its gesture events and two-finger moves) */
['gesturestart','gesturechange','gestureend'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
const toggleKey=(obj,k)=>{if(obj[k])delete obj[k];else obj[k]=1};
function stepToggle(store,key){const i=key.lastIndexOf(':'),sig=key.slice(0,i),n=+key.slice(i+1),s=new Set(store[sig]||[]);s.has(n)?s.delete(n):s.add(n);if(s.size)store[sig]=[...s];else delete store[sig]}
function rerender(){const y=window.scrollY;renderTab(curTab);window.scrollTo(0,y)}
document.addEventListener('click',e=>{
  const card=e.target.closest('[data-ostep],[data-tfound]');
  if(card&&!e.target.closest('button')){if(card.dataset.ostep){stepToggle(TS.brew.done,card.dataset.ostep)}else toggleKey(TS.smith.found,card.dataset.tfound);rerender();return}
  const b=e.target.closest('button');if(!b)return;const d=b.dataset,B=TS.brew,T=TS.trade,M=TS.smith,F=TS.food,P=TS.tools;
  if(d.tsub){const [t,k]=d.tsub.split(':');TS[t].sub=k;renderTab(t);return}
  if(d.potion){B.sel=d.potion;if(d.tsubgo)B.sub='potion';rerender();if(d.tsubgo)window.scrollTo(0,0);return}
  if(d.tsubgo){const [t,k]=d.tsubgo.split(':');TS[t].sub=k;renderTab(t);window.scrollTo(0,0);return}
  if(d.bv){B.v=d.bv;rerender();return}if(d.bform){B.form=d.bform;rerender();return}
  if(d.addorder){B.order.push({id:B.sel,v:B.v,form:B.form,n:B.n});B.sub='order';renderTab('brew');window.scrollTo(0,0);return}
  if(d.oadd){const id=document.getElementById('oid').value,p=PBY[id];let v=document.getElementById('ov').value;if(v==='ext'&&!p.ext)v='base';if(v==='enh'&&!p.enh)v='base';B.order.push({id,v,form:document.getElementById('of').value,n:+document.getElementById('on').value});rerender();return}
  if(d.orm!==undefined){undoable(B.order,+d.orm,'Potion removed',rerender);return}
  if(d.oreset){delete B.done[d.oreset];rerender();return}
  if(d.bing){B.ing=d.bing;rerender();return}
  if(d.prof){T.sel=d.prof;rerender();return}
  if(d.tall){const h=M.pieces.helmet;['chest','legs','boots'].forEach(k=>{M.pieces[k]={...h}});rerender();return}
  if(d.nup){toggleKey(M.up,d.nup);rerender();return}
  if(d.nset){M.up={};(d.nset==='armor'?['Helmet','Chestplate','Leggings','Boots']:d.nset==='all'?NETHERITE_GEAR:[]).forEach(g=>M.up[g]=1);rerender();return}
  if(d.fsort){F.sort=d.fsort;rerender();return}
  if(d.padd){const v=id=>document.getElementById(id).value,num=s=>s===''?null:Math.floor(+s);const ox=num(v('pox')),oz=num(v('poz'));if(ox===null||oz===null)return;const oy=num(v('poy'))??64;
    const nx=num(v('pnx'))??Math.floor(ox/8),nz=num(v('pnz'))??Math.floor(oz/8),ny=num(v('pny'))??oy;P.saved.push({name:v('pname').trim()||'Portal '+(P.saved.length+1),o:{x:ox,y:oy,z:oz},n:{x:nx,y:ny,z:nz}});rerender();return}
  if(d.prm!==undefined){undoable(P.saved,+d.prm,'Portal removed',rerender);return}
});
document.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('[data-ostep],[data-tfound]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();c.click()}});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset||{},M=TS.smith,F=TS.food;
  if(d.bn){TS.brew.n=+t.value;rerender()}
  else if(d.fbad){F.hideBad=t.checked;rerender()}
  else if(d.tmat||d.tpat||d.ttm){const k=d.tmat||d.tpat||d.ttm,f=d.tmat?'mat':d.tpat?'pat':'tm';M.pieces[k][f]=t.value;saveTS();drawTrimPreview()}
  else if(d.nowned){M.owned=+t.value;rerender()}else if(d.ndia){M.diag=t.checked?1:0;rerender()}
});
document.addEventListener('input',e=>{const t=e.target,d=t.dataset||{};
  if(d.xp==='cur'||d.xp==='target'){TS.tools[d.xp]=t.value;document.getElementById('xpout').innerHTML=xpOut();saveTS()}
  else if(d.pt){TS.tools[d.pt]=t.value;portalSync(d.pt);saveTS()}
});
/* crafting tab: for items that aren't crafted, list where they do come from */
const _renderPanel=renderPanel;
renderPanel=function(){_renderPanel();const n=state.sel;if(!n)return;
  if(!byOut.has(n)){const p=document.querySelector('#panel .plain'),info=itemInfo(n,'craft');if(p&&info.length)p.insertAdjacentHTML('afterend',cardRows(info,' inpanel'));return}
  const rec=byOut.get(n)[state.variant]||byOut.get(n)[0],ings=[...new Set(rec.grid.filter(x=>x&&!TAGS[x]))],sm=ings.filter(x=>SMELT.some(s=>s[1]===x)&&!SMELT.filter(s=>s[1]===x).every(s=>/ Ore$/.test(s[0])));
  const box=document.querySelector('#panel .ings');if(sm.length&&box)box.insertAdjacentHTML('afterend',`<p class="note">Smelted: ${sm.map(x=>`${esc(x)} (from ${esc(smeltFrom(x))})`).join(', ')}</p>`)};
document.querySelectorAll('.tabs img[data-ic]').forEach(i=>{i.src=icon(i.dataset.ic)});
/* start on the tab in the link, or else the tab used last */
(function(){let h=decodeURIComponent(location.hash.slice(1)).split('/')[0];if(OLD_TABS[h])h=OLD_TABS[h];
  if(!h&&TS.ui.last&&TABS.includes(TS.ui.last)&&TS.ui.last!=='craft')h=TS.ui.last;
  if(RENDER[h])showTab(h);else if(h==='ench'||(!location.hash&&TS.ui.last==='ench'))showTab('ench');else if(state.sel)renderPanel();updateFades()})();
/* offline copy: the new version installs in the background, then a Reload button appears */
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0){
  const ready=w=>{if(w&&navigator.serviceWorker.controller)toast('Update ready','Reload',()=>w.postMessage('skip'),0)};
  navigator.serviceWorker.register('sw.js').then(reg=>{
    if(reg.waiting)ready(reg.waiting);
    reg.addEventListener('updatefound',()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed')ready(w)})});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{})});
  }).catch(()=>{});
  let reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloaded)return;reloaded=true;location.reload()});
}
/* ---------- crafting calculator: break a recipe down to raw materials ---------- */
const RAW=new Set(['Iron Ingot','Gold Ingot','Copper Ingot','Netherite Ingot','Diamond','Emerald','Redstone','Coal','Charcoal','Lapis Lazuli','Slime Ball','Wheat','Bone Meal','Nether Wart','Dried Kelp','Iron Nugget','Gold Nugget','Raw Iron','Raw Gold','Raw Copper','Amethyst Shard','Nether Quartz','Honeycomb','String','Leather','Sugar']);
function breakdown(item,qty,top){
  const raw={},crafts=[];
  (function need(x,q,stack,forced){
    if(q<=0)return;const rs=byOut.get(x);
    const r=forced||(rs&&!RAW.has(x)&&!TAGS[x]&&!stack.includes(x)?rs.find(r=>!r.grid.some(g=>g&&(g===x||stack.includes(g)))):null);
    if(!r){raw[x]=(raw[x]||0)+q;return}
    const k=Math.ceil(q/r.n),cnt={};r.grid.forEach(g=>{if(g)cnt[g]=(cnt[g]||0)+1});
    crafts.push([x,k,r.n]);for(const [g,c] of Object.entries(cnt))need(g,c*k,[...stack,x],null);
  })(item,qty,[],top);
  const merged={};crafts.forEach(([x,k,n])=>{merged[x]=merged[x]||{k:0,n};merged[x].k+=k});
  return {raw,order:Object.entries(merged).reverse()};
}
const stacks=n=>n>=64?`${Math.floor(n/64)} stack${n>=128?'s':''}${n%64?' + '+n%64:''}`:'';
function craftCalcHtml(){
  const n=state.sel,rec=byOut.get(n)[state.variant]||byOut.get(n)[0],q=Math.max(1,Math.min(10000,Math.floor(+TS.craftQty||rec.n)));
  const {raw,order}=breakdown(n,q,rec);
  return `<ul class="ilist">${Object.entries(raw).map(([x,c])=>irow(x,`${img(x)}<span><b>${c}×</b> ${esc(x)}${c>=64?` <small>(${stacks(c)})</small>`:''}</span>`)).join('')}</ul>
  ${order.length>1?`<p class="small"><b>Order:</b> ${order.map(([x,o])=>`${o.k}× ${esc(x)}`).join(' → ')}</p>`:''}
  ${Math.ceil(q/rec.n)*rec.n>q?`<p class="small">Makes ${Math.ceil(q/rec.n)*rec.n}</p>`:''}`;
}
const _renderPanel2=renderPanel;
renderPanel=function(){_renderPanel2();const n=state.sel;if(!n||!byOut.has(n))return;const box=document.querySelector('#panel');if(!box)return;
  const rec=byOut.get(n)[state.variant]||byOut.get(n)[0];if(!TS.craftQty)TS.craftQty=rec.n;
  box.insertAdjacentHTML('beforeend',`<h3>Crafting calculator</h3><label class="exrow"><span>How many ${esc(n)}</span><input class="num" type="number" inputmode="numeric" min="1" data-cq="1" value="${esc(TS.craftQty)}"></label><div id="ccalc">${craftCalcHtml()}</div>`)};
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.cq){TS.craftQty=e.target.value;const c=document.getElementById('ccalc');if(c)c.innerHTML=craftCalcHtml();saveTS()}});
const _select=select;select=function(name,scroll){TS.craftQty=null;_select(name,scroll)};
if(state.sel&&curTab==='craft')renderPanel();
/* ---------- crafting: back history, recipe sheet on phones, crafting tree ---------- */
const HIST=[];let navBack=false;
const isPhone=()=>matchMedia('(max-width:859px)').matches;
const _select3=select;
select=function(name,scroll){
  if(TAGS[name])name=TAGS[name][0];
  if(!navBack&&state.sel&&state.sel!==name){HIST.push(state.sel);if(HIST.length>40)HIST.shift()}
  navBack=false;
  const wrap=document.getElementById('panel-wrap'),sheetOpen=wrap&&wrap.classList.contains('sheet');
  _select3(name,false);                       // never jump the page
  if(isPhone()&&(scroll||sheetOpen)){if(!sheetOpen){openSheet();renderPanel()}wrap.scrollTop=0}
};
function openSheet(){const w=document.getElementById('panel-wrap');if(!w||w.classList.contains('sheet'))return;w.classList.add('sheet');document.documentElement.classList.add('sheet-open')}
function closeSheet(){const w=document.getElementById('panel-wrap');if(!w)return;w.classList.remove('sheet');document.documentElement.classList.remove('sheet-open')}
function treeOf(item,qty,rec,stack){
  const rs=byOut.get(item),r=rec||(rs&&!RAW.has(item)&&!TAGS[item]&&!stack.includes(item)?rs.find(x=>!x.grid.some(g=>g&&(g===item||stack.includes(g)))):null);
  if(!r)return {item,qty};
  const k=Math.ceil(qty/r.n),cnt={};r.grid.forEach(g=>{if(g)cnt[g]=(cnt[g]||0)+1});
  return {item,qty,crafts:k,makes:k*r.n,kids:Object.entries(cnt).map(([g,c])=>treeOf(g,c*k,null,[...stack,item]))};
}
function treeHtml(n,depth){
  const label=`${img(n.item)}<span class="tname"><b>${n.qty}×</b> ${esc(n.item)}</span>${n.crafts?`<small>${n.crafts} craft${n.crafts>1?'s':''}${n.makes>n.qty?`, ${n.makes-n.qty} spare`:''}</small>`:'<small>gather</small>'}${!TAGS[n.item]&&(byOut.has(n.item)||usedIn.has(n.item))&&depth?`<button class="link" data-name="${esc(n.item)}">Open</button>`:''}`;
  if(!n.kids)return `<li class="tleaf"><div class="tnode">${label}</div></li>`;
  return `<li><details open><summary class="tnode">${label}</summary><ul class="tree">${n.kids.map(k=>treeHtml(k,depth+1)).join('')}</ul></details></li>`;
}
const _renderPanel3=renderPanel;
renderPanel=function(){_renderPanel3();const n=state.sel,box=document.getElementById('panel');if(!n||!box)return;
  const wrap=document.getElementById('panel-wrap'),head=box.querySelector('.head');
  // close and back controls
  const bar=`<div class="pbar">${HIST.length?`<button class="btn small" data-back="1">← ${esc(HIST[HIST.length-1])}</button>`:'<span></span>'}${wrap&&wrap.classList.contains('sheet')?'<button class="btn small" data-closesheet="1" aria-label="Close recipe">✕ Close</button>':''}</div>`;
  box.insertAdjacentHTML('afterbegin',bar);
  if(!byOut.has(n))return;
  const view=TS.craftView||'recipe';
  if(head)head.insertAdjacentHTML('afterend',`<div class="pmode cview">${pill('cview','recipe',view,'Recipe')}${pill('cview','tree',view,'Crafting tree')}</div>`);
  if(view!=='tree')return;
  const keep=new Set([box.querySelector('.pbar'),head,box.querySelector('.cview'),box.querySelector('.variants')]);
  [...box.children].forEach(c=>{if(!keep.has(c))c.remove()});
  const rec=byOut.get(n)[state.variant]||byOut.get(n)[0],q=Math.max(1,Math.min(10000,Math.floor(+TS.craftQty||rec.n)));
  const tree=treeOf(n,q,rec,[]),{raw}=breakdown(n,q,rec);
  box.insertAdjacentHTML('beforeend',`<label class="exrow"><span>How many ${esc(n)}</span><input class="num" type="number" inputmode="numeric" min="1" data-cqt="1" value="${q}"></label>
    <ul class="tree root">${treeHtml(tree,0)}</ul>
    <h3>Everything to gather</h3><ul class="ilist">${Object.entries(raw).map(([x,c])=>irow(x,`${img(x)}<span><b>${c}×</b> ${esc(x)}${c>=64?` <small>(${stacks(c)})</small>`:''}</span>`)).join('')}</ul>`);
};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.closest('#tab-craft'))return;const d=b.dataset;
  if(d.back){const prev=HIST.pop();if(prev){navBack=true;select(prev,false)}return}
  if(d.closesheet){closeSheet();return}
  if(d.cview){TS.craftView=d.cview;saveTS();renderPanel();return}
});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.cqt){TS.craftQty=e.target.value;saveTS();renderPanel()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
