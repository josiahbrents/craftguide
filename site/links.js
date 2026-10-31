/* ---------- links between tabs: item cards, jumping to an item, back bar, toasts, search clear buttons ---------- */
const searchBox=(attrs,type='search')=>`<div class="field sfield"><input class="esearch" type="${type}" ${attrs}><button class="xclear" type="button" aria-label="Clear">×</button></div>`;

/* toast: one short message at a time, with an optional action button */
let toastTimer=0;
function toast(msg,action,fn,ms=5000){
  const t=document.getElementById('toast');if(!t)return;
  t.innerHTML=`<span>${esc(msg)}</span>${action?`<button type="button" class="tbtn">${esc(action)}</button>`:''}`;t.hidden=false;
  const b=t.querySelector('.tbtn');if(b)b.onclick=()=>{hideToast();if(fn)fn()};
  clearTimeout(toastTimer);if(ms)toastTimer=setTimeout(hideToast,ms);
}
function hideToast(){const t=document.getElementById('toast');if(t)t.hidden=true}
/* remove an entry and offer Undo, which puts it back where it was */
function undoable(arr,i,label,redraw){const [x]=arr.splice(i,1);redraw();toast(label,'Undo',()=>{arr.splice(Math.min(i,arr.length),0,x);redraw()})}

/* which tabs have something to say about an item */
let LX=null;
function linkIndex(){
  if(LX)return LX;
  const add=(m,k,v)=>{if(!m.has(k))m.set(k,[]);m.get(k).push(v)},smOut=new Map(),smIn=new Map(),sells=new Map(),buys=new Map(),ws=new Map();
  SMELT.forEach(r=>{add(smOut,r[1],r);add(smIn,r[0],r)});
  PROFS.forEach(p=>{p.sells.forEach(n=>add(sells,n,p));p.buys.forEach(n=>add(buys,n,p));add(ws,p.ws,p)});
  return LX={smOut,smIn,sells,buys,ws,pot:new Map(POTIONS.map(p=>[p.name,p])),ing:new Set(ALL_ING()),food:new Map(FOODS.map(f=>[f.name,f])),fuel:new Map(FUELS),
    tmpl:new Set(TRIMS.map(t=>t[0]+' Armor Trim')),tmat:new Set(TRIM_MATS),pat:new Map(BAN_PAT.filter(p=>p.item).map(p=>[p.item,p]))};
}
const gearType=n=>{const t=ITEM_TYPES.find(([k,l])=>n===l||n.endsWith(' '+l));return t?t[0]:null};
const SINGLE_VIEW=['craft','food','tools']; // tabs with one view: a link back to the same tab adds nothing
const smeltFrom=n=>{const so=linkIndex().smOut.get(n);return so?[...new Set(so.map(r=>r[0]))].slice(0,2).join(' or '):''};
/* rows with a tab are jump buttons; rows without one are plain facts (smelting has no tab of its own) */
function itemInfo(n,here){
  const X=linkIndex(),out=[],go=(label,tab,arg,sub)=>{if(!(tab===here&&SINGLE_VIEW.includes(tab)))out.push({label,tab,arg:arg||'',sub})},fact=(label,sub)=>out.push({label,sub});
  const uses=usedIn.get(n),nu=uses?uses.size:0,ut=`Used to craft ${nu} item${nu===1?'':'s'}`;
  if(byOut.has(n))go('Recipe','craft',n,nu?ut:'');else if(nu)go(ut,'craft',n);
  if(X.smOut.has(n))fact('Smelt it','from '+smeltFrom(n));
  const si=X.smIn.get(n);if(si)fact('Smelts into '+si[0][1]);
  if(X.fuel.has(n)){const per=X.fuel.get(n);go('Furnace fuel','tools','fuel:'+n,`smelts ${per} item${per===1?'':'s'}`)}
  const p=X.pot.get(n);if(p)go('How to brew it','brew','p:'+p.id);
  if(X.ing.has(n))go('Brewing ingredient','brew','i:'+n);
  if(n==='Brewing Stand')go('Potions','brew','');
  (X.ws.get(n)||[]).forEach(v=>go(v.name+' workstation','trade',v.id));
  (X.sells.get(n)||[]).forEach(v=>go('Sold by '+v.name.toLowerCase(),'trade',v.id));
  (X.buys.get(n)||[]).slice(0,2).forEach(v=>go(v.name+' buys it','trade',v.id));
  if(n==='Enchanted Book')go('All enchantments','ench','all');
  if(n==='Netherite Upgrade'||['Netherite Ingot','Netherite Scrap','Ancient Debris'].includes(n)||(n.startsWith('Netherite ')&&NETHERITE_GEAR.includes(n.slice(10))))go('Netherite upgrade','smith','net');
  if(X.tmpl.has(n))go('Template checklist','smith','temp:'+n);
  if(X.tmat.has(n))go('Trim material','smith','trim');
  if(n==='Smithing Table')go('Trim preview','smith','trim');
  if(X.food.has(n))go('Food stats','food',n,`${X.food.get(n).h} hunger, ${X.food.get(n).s} saturation`);
  const bp=X.pat.get(n);if(bp)go('Banner pattern','banner',bp.id,bp.name);
  if(n==='Loom')go('Banner designer','banner','');
  const g=gearType(n);if(g)go('Enchantments','ench','item:'+g,TYPE[g].n);
  if(['Enchanting Table','Anvil','Bookshelf'].includes(n))go('Enchanting planner','ench','planner');
  if(n==='Obsidian'||n==='Flint and Steel')go('Nether portal','tools','portal');
  if(n==="Bottle o' Enchanting")go('XP to level','tools','xp');
  return out;
}
/* wrap something in a button that opens the item card, only when another tab has something on the item */
function linkItem(name,inner,here){here=here||(typeof curTab==='string'?curTab:'');return itemInfo(name,here).some(d=>d.tab)?`<button type="button" class="ilink" data-item="${esc(name)}" data-here="${here}">${inner}</button>`:inner}
const linkInl=(name,text)=>linkItem(name,esc(text||name)).replace('class="ilink"','class="ilink inl"');

/* the item card */
const cardRows=(info,cls='')=>`<div class="iclist${cls}">${info.map(d=>{const t=`<span class="icl"><b>${esc(d.label)}</b>${d.sub?`<small>${esc(d.sub)}</small>`:''}</span>`;
  return d.tab?`<button type="button" class="icgo" data-go="${d.tab}|${esc(d.arg)}">${t}<span class="ictab">${TAB_NAMES[d.tab]} ›</span></button>`:`<div class="icinfo">${t}</div>`}).join('')}</div>`;
let cardFrom=null;
function openCard(name,here){
  const card=document.getElementById('icard'),box=card&&card.querySelector('.icard-box');if(!box)return;
  const info=itemInfo(name,here),bp=linkIndex().pat.get(name);
  box.innerHTML=`<div class="ichead">${img(name,'ic big')}<h2 id="icard-title">${esc(name)}</h2><button type="button" class="sbtn" data-icclose="1" aria-label="Close">✕</button></div>
  ${bp&&!byOut.has(name)&&bp.how?`<p class="small">${esc(bp.how)}</p>`:''}
  ${cardRows(info)}`;
  cardFrom=document.activeElement;card.hidden=false;document.documentElement.classList.add('card-open');
  const f=box.querySelector('.icgo');if(f)f.focus({preventScroll:true});
}
function closeCard(){const card=document.getElementById('icard');if(!card||card.hidden)return;card.hidden=true;document.documentElement.classList.remove('card-open');if(cardFrom&&cardFrom.focus)cardFrom.focus({preventScroll:true});cardFrom=null}

/* jumping to a tab at an item, and the back bar that returns to where you were */
const NAV=[];
function navSnap(){return {tab:curTab,y:window.scrollY,ts:TS[curTab]?JSON.stringify(TS[curTab]):null,e:JSON.stringify({sub:E.sub,byItem:E.byItem,openId:E.openId||null,q:E.q}),sel:state.sel}}
function navClear(){NAV.length=0;updateBackBar()}
function updateBackBar(){const b=document.getElementById('navback');if(!b)return;const s=NAV[NAV.length-1];b.hidden=!s;if(s)b.textContent='← '+TAB_NAMES[s.tab]}
function goTo(tab,arg){
  closeCard();cardFrom=null;NAV.push(navSnap());if(NAV.length>20)NAV.shift();
  const i=arg.indexOf(':'),k=i<0?arg:arg.slice(0,i),v=i<0?'':arg.slice(i+1);let at=null;
  if(tab==='brew'){const B=TS.brew;if(k==='p'){B.sub='potion';B.sel=v}else if(k==='i'){B.sub='ing';B.ing=v}}
  else if(tab==='trade'){if(arg)TS.trade.sel=arg}
  else if(tab==='smith'){if(k){TS.smith.sub=k;at=v||null}}
  else if(tab==='food'){const f=linkIndex().food.get(arg);if(f&&f.bad)TS.food.hideBad=false;at=arg}
  else if(tab==='banner'){const B=TS.banner;B.sub='design';B.edit=null;if(arg){B.picking=true;at=arg}}
  else if(tab==='ench'){if(k==='item'){E.sub='item';E.byItem=v}else if(k==='all'){E.sub='all';E.q='';E.openId=v||null}else if(k==='planner')E.sub='planner'}
  else if(tab==='tools'){if(k==='xp'&&v){TS.tools.cur=0;TS.tools.target=+v}at=k==='fuel'?v:k==='xp'?'#xp':'#portal'}
  showTab(tab);
  if(tab==='craft'){select(arg,false);const w=document.getElementById('panel-wrap');if(w)w.scrollIntoView({block:'start'})}
  if(at){const root=document.getElementById('tab-'+tab),el=at[0]==='#'?document.getElementById(at.slice(1)):root&&[...root.querySelectorAll('[data-at]')].find(x=>x.dataset.at.split('|').includes(at));if(el)flash(el)}
  updateBackBar();
}
function flash(el){el.scrollIntoView({block:'center'});if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}
function goBack(){
  const s=NAV.pop();if(!s)return;
  if(s.ts&&TS[s.tab])Object.assign(TS[s.tab],JSON.parse(s.ts));
  Object.assign(E,JSON.parse(s.e));
  showTab(s.tab,true);
  if(s.tab==='craft'&&s.sel&&s.sel!==state.sel){navBack=true;select(s.sel,false)}
  window.scrollTo(0,s.y);updateBackBar();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-item],[data-go],[data-icclose],#navback,.xclear');if(!b)return;
  if(b.id==='navback'){goBack();return}
  if(b.dataset.icclose){closeCard();return}
  if(b.classList.contains('xclear')){const inp=b.parentElement.querySelector('input');if(!inp)return;inp.value='';inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));inp.focus();return}
  if(b.dataset.item){openCard(b.dataset.item,b.dataset.here||curTab);return}
  if(b.dataset.go){const j=b.dataset.go.indexOf('|');goTo(b.dataset.go.slice(0,j),b.dataset.go.slice(j+1));return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCard()});
