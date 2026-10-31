/* ---------- tab shell, swiping, events ---------- */
const RENDER={brew:renderBrew,trade:renderTrade,smelt:renderSmelt,smith:renderSmith,banner:renderBanner,food:renderFood,xp:renderXP,portal:renderPortal};
let curTab='craft';
function renderTab(t){const el=document.getElementById('tab-'+t);if(el&&RENDER[t]){el.innerHTML=RENDER[t]();if(t==='smith'&&TS.smith.sub==='trim')drawTrimPreview();if(t==='banner')drawBanners()}saveTS()}
function showTab(tab,keepScroll){
  if(!TABS.includes(tab))tab='craft';curTab=tab;if(typeof closeSheet==='function')closeSheet();
  TABS.forEach(t=>{const el=document.getElementById('tab-'+t);if(el)el.hidden=t!==tab});
  document.querySelectorAll('.tabs button[data-tab]').forEach(b=>{if(b.dataset.tab===tab){b.setAttribute('aria-current','page');try{b.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}}else b.removeAttribute('aria-current')});
  if(tab==='ench'){renderEnch();setHash('ench/'+E.sub)}else if(tab==='craft'){if(state.sel)setHash('craft/'+encodeURIComponent(state.sel))}else{renderTab(tab);setHash(tab)}
  if(!keepScroll)window.scrollTo(0,0);
}
/* swipe left or right on the page to change tabs; rows that scroll sideways keep their own swipes */
(function(){let sx=0,sy=0,st=0,skip=false;
  document.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();
    skip=!!e.target.closest('input,select,textarea,canvas,#stage3d,.sheet,.tabs,.ichips,.esubs,.cats,.pmode,.dtable,.moresheet')},{passive:true});
  document.addEventListener('touchend',e=>{if(skip)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Date.now()-st>700||Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*0.5)return;
    const i=TABS.indexOf(curTab),n=dx<0?i+1:i-1;if(n<0||n>=TABS.length)return;showTab(TABS[n])},{passive:true});
})();
const toggleKey=(obj,k)=>{if(obj[k])delete obj[k];else obj[k]=1};
function stepToggle(store,key){const i=key.lastIndexOf(':'),sig=key.slice(0,i),n=+key.slice(i+1),s=new Set(store[sig]||[]);s.has(n)?s.delete(n):s.add(n);if(s.size)store[sig]=[...s];else delete store[sig]}
function rerender(){const y=window.scrollY;renderTab(curTab);window.scrollTo(0,y)}
document.addEventListener('click',e=>{
  const card=e.target.closest('[data-ostep],[data-tfound]');
  if(card&&!e.target.closest('button')){if(card.dataset.ostep){stepToggle(TS.brew.done,card.dataset.ostep)}else toggleKey(TS.smith.found,card.dataset.tfound);rerender();return}
  const b=e.target.closest('button');if(!b)return;const d=b.dataset,B=TS.brew,T=TS.trade,S=TS.smelt,M=TS.smith,F=TS.food,P=TS.portal;
  if(d.tsub){const [t,k]=d.tsub.split(':');TS[t].sub=k;renderTab(t);return}
  if(d.potion){B.sel=d.potion;if(d.tsubgo)B.sub='potion';rerender();if(d.tsubgo)window.scrollTo(0,0);return}
  if(d.tsubgo){const [t,k]=d.tsubgo.split(':');TS[t].sub=k;renderTab(t);window.scrollTo(0,0);return}
  if(d.goto){const [t,q]=d.goto.split(':');if(t==='smelt'){S.sub='recipes';S.q=q||''}showTab(t);return}
  if(d.bv){B.v=d.bv;rerender();return}if(d.bform){B.form=d.bform;rerender();return}
  if(d.addorder){B.order.push({id:B.sel,v:B.v,form:B.form,n:B.n});B.sub='order';renderTab('brew');window.scrollTo(0,0);return}
  if(d.oadd){const id=document.getElementById('oid').value,p=PBY[id];let v=document.getElementById('ov').value;if(v==='ext'&&!p.ext)v='base';if(v==='enh'&&!p.enh)v='base';B.order.push({id,v,form:document.getElementById('of').value,n:+document.getElementById('on').value});rerender();return}
  if(d.orm!==undefined){B.order.splice(+d.orm,1);rerender();return}
  if(d.oreset){delete B.done[d.oreset];rerender();return}
  if(d.bing){B.ing=d.bing;rerender();return}if(d.bhave){toggleKey(B.have,d.bhave);rerender();return}
  if(d.prof){T.sel=d.prof;rerender();return}
  if(d.hadd){const id=document.getElementById('hid').value,lv=document.getElementById('hlv').value==='max'?1:0;if(!T.targets.some(t=>t.id===id&&t.lv===lv))T.targets.push({id,lv});rerender();return}
  if(d.hplan){const w=Object.keys(E.mode==='set'?Object.assign({},...SETS.map(s=>E.set[s])):E.want);w.filter(id=>!NO_LIBRARIAN.includes(id)).forEach(id=>{if(!T.targets.some(t=>t.id===id))T.targets.push({id,lv:1})});rerender();return}
  if(d.hrm!==undefined){T.targets.splice(+d.hrm,1);rerender();return}
  if(d.hgot!==undefined){const t=T.targets[+d.hgot],e2=EBY[t.id];T.log.push({name:t.lv&&e2.max>1?lvTxt(t.id,e2.max):e2.name,n:T.count});T.targets.splice(+d.hgot,1);T.count=0;rerender();return}
  if(d.hinc){T.count++;rerender();return}if(d.hdec){T.count=Math.max(0,T.count-1);rerender();return}if(d.hzero){T.count=0;rerender();return}
  if(d.vadd){T.vills.push({name:document.getElementById('vname').value.trim(),prof:document.getElementById('vprof').value,note:document.getElementById('vnote').value.trim(),books:[]});rerender();return}
  if(d.vrm!==undefined){T.vills.splice(+d.vrm,1);rerender();return}
  if(d.vbadd!==undefined){const i=+d.vbadd,id=document.querySelector(`[data-vbid="${i}"]`).value,lv=Math.min(+document.querySelector(`[data-vblv="${i}"]`).value,EBY[id].max);T.vills[i].books.push({id,lv});rerender();return}
  if(d.vbrm){const [i,j]=d.vbrm.split(':').map(Number);T.vills[i].books.splice(j,1);rerender();return}
  if(d.sbatch){S.item=d.sbatch;S.sub='batch';renderTab('smelt');window.scrollTo(0,0);return}
  if(d.sft){S.ftype=d.sft;rerender();return}if(d.sfuel){toggleKey(S.fuels,d.sfuel);rerender();return}
  if(d.tall){const h=M.pieces.helmet;['chest','legs','boots'].forEach(k=>{M.pieces[k]={...h}});rerender();return}
  if(d.nup){toggleKey(M.up,d.nup);rerender();return}
  if(d.nset){M.up={};(d.nset==='armor'?['Helmet','Chestplate','Leggings','Boots']:d.nset==='all'?NETHERITE_GEAR:[]).forEach(g=>M.up[g]=1);rerender();return}
  if(d.fsort){F.sort=d.fsort;rerender();return}
  if(d.fadd){const name=document.getElementById('minv').value,n=+document.getElementById('minvn').value,f=F.inv.find(x=>x.name===name);if(f)f.n+=n;else F.inv.push({name,n});rerender();return}
  if(d.finc!==undefined){F.inv[+d.finc].n++;rerender();return}if(d.fdec!==undefined){const x=F.inv[+d.fdec];x.n--;if(x.n<=0)F.inv.splice(+d.fdec,1);rerender();return}
  if(d.xpq){const [a,c]=d.xpq.split(':').map(Number);Object.assign(TS.xp,{cur:a,prog:0,target:c});rerender();return}
  if(d.padd){const v=id=>document.getElementById(id).value,num=s=>s===''?null:Math.floor(+s);const ox=num(v('pox')),oz=num(v('poz'));if(ox===null||oz===null)return;const oy=num(v('poy'))??64;
    const nx=num(v('pnx'))??Math.floor(ox/8),nz=num(v('pnz'))??Math.floor(oz/8),ny=num(v('pny'))??oy;P.saved.push({name:v('pname').trim()||'Portal '+(P.saved.length+1),o:{x:ox,y:oy,z:oz},n:{x:nx,y:ny,z:nz}});rerender();return}
  if(d.prm!==undefined){P.saved.splice(+d.prm,1);rerender();return}
});
document.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('[data-ostep],[data-tfound]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();c.click()}});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset||{},S=TS.smelt,M=TS.smith,F=TS.food,X=TS.xp;
  if(d.bn){TS.brew.n=+t.value;rerender()}
  else if(d.fbad){F.hideBad=t.checked;rerender()}else if(d.fh){F.hunger=+t.value;rerender()}else if(d.fsel){F.fsel=t.value;rerender()}
  else if(d.sitem){S.item=t.value;rerender()}else if(d.sqty){S.qty=t.value;rerender()}else if(d.sfn){S.furn=t.value;rerender()}
  else if(d.tmat||d.tpat||d.ttm){const k=d.tmat||d.tpat||d.ttm,f=d.tmat?'mat':d.tpat?'pat':'tm';M.pieces[k][f]=t.value;saveTS();drawTrimPreview()}
  else if(d.nowned){M.owned=+t.value;rerender()}else if(d.ndia){M.diag=t.checked?1:0;rerender()}
  else if(d.mitem){X.mItem=t.value;rerender()}else if(d.mleft){X.mLeft=+t.value;rerender()}
  else if(d.xp==='prog'){X.prog=+t.value;document.getElementById('xpout').innerHTML=xpOut();saveTS()}
  else if(d.xp==='start'){X.start=t.value;rerender()}
});
document.addEventListener('input',e=>{const t=e.target,d=t.dataset||{},P=TS.portal;
  if(d.sq){TS.smelt.q=t.value;const tmp=document.createElement('div');tmp.innerHTML=renderRecipes();document.getElementById('srows').innerHTML=tmp.querySelector('#srows').innerHTML;saveTS()}
  else if(d.sn){TS.smelt.n=t.value;document.getElementById('frows').innerHTML=fuelRows(Math.max(1,Math.floor(+t.value||1)));saveTS()}
  else if(d.xp&&['cur','target','rate'].includes(d.xp)){TS.xp[d.xp]=t.value;document.getElementById('xpout').innerHTML=xpOut();saveTS()}
  else if(d.pt){P[d.pt]=t.value;document.getElementById('pout1').innerHTML=portalOut('o');document.getElementById('pout2').innerHTML=portalOut('n');saveTS()}
  else if(d.ptr){P[d.ptr]=t.value;const tmp=document.createElement('div');tmp.innerHTML=renderTravel();document.getElementById('trout').innerHTML=tmp.querySelector('#trout').innerHTML;saveTS()}
});
/* crafting tab: show where smelted items and ingredients come from */
const _renderPanel=renderPanel;
renderPanel=function(){_renderPanel();const n=state.sel;if(!n)return;
  if(!byOut.has(n)){const r=SMELT.find(x=>x[1]===n),p=document.querySelector('#panel .plain');if(r&&p)p.insertAdjacentHTML('afterend',`<p class="plain">Smelt <b>${esc(r[0])}</b> in a furnace to get it. <button class="link" data-goto="smelt:${esc(n)}">See smelting</button></p>`);return}
  const rec=byOut.get(n)[state.variant]||byOut.get(n)[0],ings=[...new Set(rec.grid.filter(x=>x&&!TAGS[x]))],sm=ings.filter(x=>SMELT.some(s=>s[1]===x));
  const box=document.querySelector('#panel .ings');if(sm.length&&box)box.insertAdjacentHTML('afterend',`<p class="note">Smelted first: ${sm.map(x=>`<b>${esc(x)}</b> from ${esc(SMELT.filter(s=>s[1]===x).slice(0,2).map(s=>s[0]).join(' or '))} <button class="link" data-goto="smelt:${esc(x)}">See smelting</button>`).join('; ')}</p>`)};
document.querySelectorAll('.tabs img[data-ic]').forEach(i=>{i.src=icon(i.dataset.ic)});
(function(){const h=decodeURIComponent(location.hash.slice(1)).split('/')[0];if(RENDER[h])showTab(h);else{if(h.startsWith('ench'))curTab='ench';if(state.sel&&!h.startsWith('ench'))renderPanel()}})();
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
  return `<ul class="ilist">${Object.entries(raw).map(([x,c])=>`<li>${img(x)}<span><b>${c}×</b> ${esc(x)}${c>=64?` <small>(${stacks(c)})</small>`:''}</span></li>`).join('')}</ul>
  ${order.length>1?`<p class="small"><b>Craft in this order:</b> ${order.map(([x,o])=>`${o.k} craft${o.k>1?'s':''} of ${esc(x)}`).join(', then ')}.</p>`:''}
  <p class="small">You get ${Math.ceil(q/rec.n)*rec.n} ${esc(n)}. Each step is rounded up to whole crafts, so you may have a few extra.</p>`;
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
    <h3>Everything to gather</h3><ul class="ilist">${Object.entries(raw).map(([x,c])=>`<li>${img(x)}<span><b>${c}×</b> ${esc(x)}${c>=64?` <small>(${stacks(c)})</small>`:''}</span></li>`).join('')}</ul>
    <p class="small">Work from the bottom of the tree up. Tap Open on any item to see its recipe. Smelted items like iron ingots count as things to gather.</p>`);
};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.closest('#tab-craft'))return;const d=b.dataset;
  if(d.back){const prev=HIST.pop();if(prev){navBack=true;select(prev,false)}return}
  if(d.closesheet){closeSheet();return}
  if(d.cview){TS.craftView=d.cview;saveTS();renderPanel();return}
});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.cqt){TS.craftQty=e.target.value;saveTS();renderPanel()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
