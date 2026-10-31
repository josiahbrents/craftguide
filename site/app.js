/* ---------- icons: generated pixel tiles (no external images) ---------- */
const COL=[
['pale oak','#e3d8d0'],['dark oak','#4b3219'],['mangrove','#7a3a36'],['cherry','#e6b5b5'],['bamboo','#d8c64f'],['crimson','#7a3150'],['warped','#2e8a82'],['spruce','#7b5a35'],['birch','#d8cb8e'],['jungle','#b5875f'],['acacia','#ad5d32'],['oak','#b8945f'],
['netherite','#4d4a50'],['copper','#c4704a'],['diamond','#4aedd9'],['emerald','#17dd62'],['golden','#fcdc40'],['gold','#fcdc40'],['iron','#d9d9d9'],['lapis','#2a4eb0'],['charcoal','#3a332e'],['coal','#2d2d2d'],['quartz','#ece6de'],['amethyst','#9a6fd1'],
['cobbled deepslate','#4d4d52'],['deepslate','#474750'],['blackstone','#2f2b33'],['glowstone','#f6cf6b'],['redstone','#c8211a'],['lodestone','#7b7f86'],['end stone','#dde5a5'],
['red sand','#bf6b2e'],['sandstone','#d9cd96'],['sand','#dbd3a0'],['red nether','#4a1418'],['nether brick','#2e1519'],['dark prismarine','#2f6b5d'],['prismarine','#5aa896'],['purpur','#a77ba7'],['obsidian','#1a1426'],['tuff','#6b6d62'],['andesite','#888a8a'],['diorite','#c6c6c6'],['granite','#9a6b58'],['packed mud','#8b6a50'],['mud','#5a4a40'],['brick','#a05545'],['cobblestone','#7f7f7f'],['stone','#7d7d7d'],['gravel','#837f7e'],
['light gray','#9d9d97'],['light blue','#3ab3da'],['gray','#474f52'],['black','#1f1f23'],['brown','#835432'],['magenta','#c74ebd'],['purple','#8932b8'],['pink','#f38baa'],['orange','#f9801d'],['yellow','#fed83d'],['lime','#80c71f'],['cyan','#169c9c'],['green','#5e7c16'],['blue','#3c44aa'],['white','#eaeded'],['red','#b02e26'],
['slime','#7ebf6e'],['honey','#e8a825'],['leather','#a0602f'],['string','#efefef'],['paper','#eeeee4'],['sugar','#f4f4f4'],['bone','#e6e4d2'],['wheat','#d8b64c'],['bread','#c58b3e'],['apple','#d22d2d'],['carrot','#ee8a1e'],['pumpkin','#d5731b'],['melon','#88b92a'],['cake','#f3e3d6'],['cookie','#b57a3c'],['flint','#3a3a3a'],['feather','#f4f4f4'],['gunpowder','#606060'],['glass','#c6e6ee'],['ender','#1f6f65'],['blaze','#f5a31a'],['egg','#d9c9a6'],['milk','#ffffff'],['wart','#8a1f2a'],['moss','#5f7d33'],['vine','#4c7a2a'],['hay','#cdb040'],['kelp','#3f5a2f'],['scute','#4f8a3c'],['shulker','#8e608e'],['snow','#f2f8f8'],['ice','#8fb4f5'],['clay','#a2a8b8'],['dirt','#866043'],['terracotta','#9a5b42'],['magma','#8a2f10'],['soul','#5b4a3d'],['chorus','#8e6aa0'],['sea','#bfe5df'],['mushroom','#a9644a'],['book','#7a4a2a'],['stick','#8a6234'],['bow','#8a6234'],['arrow','#8a6234'],['rod','#d99a2b'],['rabbit','#b99a6b'],['spider','#6b2a2a'],['ink','#1f1f23'],['ghast','#eef3f3'],['nether star','#f2f2d8'],['heart','#2a6f8c'],['nautilus','#d6b98a']
];
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
function hsl2hex(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}
const colorOf=n=>{const l=n.toLowerCase();for(const [k,v] of COL)if(l.includes(k))return v;return hsl2hex(hash(n)%360,42,52)};
const SHAPES=[
[/pickaxe/i,'pickaxe'],[/ axe$/i,'axe'],[/shovel/i,'shovel'],[/hoe$/i,'hoe'],[/sword/i,'sword'],
[/helmet|\bcap$|turtle shell/i,'helmet'],[/chestplate|tunic/i,'chest'],[/leggings|pants/i,'legs'],[/boots/i,'boots'],
[/glass pane|iron bars/i,'pane'],[/glass$/i,'glass'],
[/fence gate/i,'gate'],[/fence$/i,'fence'],[/trapdoor/i,'trapdoor'],[/door$/i,'door'],
[/slab$/i,'slab'],[/stairs$/i,'stairs'],[/wall$/i,'wall'],
[/button$/i,'button'],[/pressure plate/i,'plate'],
[/hanging sign/i,'hsign'],[/sign$/i,'sign'],
[/boat|raft/i,'boat'],[/bed$/i,'bed'],[/banner/i,'banner'],[/carpet/i,'carpet'],[/candle/i,'candle'],
[/sea lantern|jack o/i,'block'],[/torch$/i,'torch'],[/lantern$/i,'lantern'],
[/rail$/i,'rail'],[/minecart/i,'cart'],[/chest$/i,'chest2'],
[/(planks|bricks|wool|terracotta|concrete|cobble|sandstone|tuff|deepslate|blackstone|table|furnace|barrel|bookshelf|lamp|piston|dropper|dispenser|observer|hopper|jukebox|note block|anvil|smoker|lectern|grindstone|stonecutter|composter|cauldron|beacon|conduit|lodestone|respawn|beehive|daylight|hay bale|glowstone$|magma|scaffolding|crafter|snow block|coarse dirt|packed mud|amethyst block|quartz pillar|purpur|obsidian|polished|chiseled|copper grate|copper bulb|cut copper|bone block|mossy|bamboo mosaic|prismarine$)/i,'block'],
[/^(block of|tnt$|loom$|target$|stone$|clay$|andesite$|diorite$|granite$|melon$|snow$|honey block|honeycomb block|slime block|sponge)/i,'block'],
[/(ingot|^brick|nether brick|scrap)$/i,'ingot'],[/nugget/i,'nugget'],
[/(diamond|emerald|quartz|amethyst shard|lapis lazuli|prismarine shard|prismarine crystals|echo shard|nether star|heart of the sea|ghast tear)$/i,'gem'],
[/(dust|powder|meal|sugar|^redstone|dye)$/i,'dust'],
[/(stick|rod)$/i,'rod'],[/bucket/i,'bucket'],[/bowl/i,'bowl'],[/bottle/i,'bottle']
];
const shapeOf=n=>{for(const [r,s] of SHAPES)if(r.test(n))return s;return 'item'};
const h2r=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const shade=(h,f)=>{const [r,g,b]=h2r(h),t=f<0?0:255,p=Math.abs(f);return `rgb(${Math.round(r+(t-r)*p)},${Math.round(g+(t-g)*p)},${Math.round(b+(t-b)*p)})`};
const rng=seed=>{let s=hash(seed)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}};
const ICONS=new Map();
function draw(name){
  const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');
  const base=colorOf(name),rnd=rng(name),shape=shapeOf(name);
  const px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)};
  const rect=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  const tex=(x,y,w,h,col=base,amp=.1)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,shade(col,(rnd()-.5)*amp*2))};
  const edge=(x,y,w,h,col=base)=>{rect(x,y,w,1,shade(col,.28));rect(x,y,1,h,shade(col,.16));rect(x,y+h-1,w,1,shade(col,-.32));rect(x+w-1,y,1,h,shade(col,-.24))};
  const solid=(x,y,w,h,col=base)=>{tex(x,y,w,h,col);edge(x,y,w,h,col)};
  const line=(x0,y0,x1,y1,col,th=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)rect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),th,th,col)};
  const wood='#8a6234',dk=shade(base,-.4),lt=shade(base,.35);
  const handle=()=>{line(2,14,11,5,'#5b3d1e');line(3,14,12,5,wood)};
  switch(shape){
    case 'block':{solid(0,0,16,16);
      if(/planks/i.test(name)){[4,8,12].forEach(y=>rect(0,y,16,1,dk))}
      else if(/brick|tiles/i.test(name)){[3,7,11,15].forEach((y,i)=>{rect(0,y,16,1,dk);const xs=i%2?[3,11]:[7];xs.forEach(x=>rect(x,y-3,1,3,dk))})}
      else if(/wool/i.test(name)){tex(0,0,16,16,base,.18);edge(0,0,16,16)}
      else if(/table/i.test(name)){rect(0,0,16,4,shade('#b8945f',-.1));rect(3,5,10,1,dk);rect(3,9,10,1,dk)}
      else if(/furnace|smoker/i.test(name)){rect(3,7,10,6,'#222');rect(4,8,8,4,'#d9731b')}
      break}
    case 'slab':solid(0,8,16,8);if(/planks|oak|spruce|birch|jungle|acacia|mangrove|cherry|bamboo|crimson|warped/i.test(name))rect(0,12,16,1,dk);break;
    case 'stairs':solid(0,8,16,8);solid(8,0,8,8);break;
    case 'wall':solid(2,6,12,10);solid(5,0,6,7);break;
    case 'fence':solid(1,0,4,16);solid(11,0,4,16);solid(5,3,6,3);solid(5,9,6,3);break;
    case 'gate':solid(0,2,3,14);solid(13,2,3,14);solid(3,4,10,3);solid(3,10,10,3);solid(6,7,4,3);break;
    case 'door':solid(3,0,10,16);rect(5,2,6,5,shade(base,-.2));rect(5,9,6,5,shade(base,-.2));px(10,8,'#d0d0d0');break;
    case 'trapdoor':solid(1,1,14,14);rect(4,4,8,8,shade(base,-.2));rect(4,7,8,2,base);break;
    case 'button':solid(4,6,8,4);break;
    case 'plate':solid(2,10,12,4);break;
    case 'sign':solid(1,2,14,8);rect(7,10,2,5,wood);break;
    case 'hsign':rect(3,0,1,3,'#4a4a4a');rect(12,0,1,3,'#4a4a4a');rect(2,2,12,1,'#4a4a4a');solid(2,4,12,8);break;
    case 'boat':solid(1,8,14,5);solid(0,5,2,4);solid(14,5,2,4);rect(2,12,12,1,dk);break;
    case 'bed':rect(2,12,2,3,wood);rect(12,12,2,3,wood);solid(1,5,14,8);solid(1,5,5,8,'#eaeaea');break;
    case 'banner':rect(1,0,14,1,wood);solid(3,1,10,12);rect(3,13,3,2,base);rect(10,13,3,2,base);break;
    case 'carpet':solid(0,11,16,5);break;
    case 'candle':rect(7,2,2,2,'#f6b73c');solid(5,5,6,9);break;
    case 'glass':rect(0,0,16,16,'rgba(190,230,240,.28)');if(!/^glass$/i.test(name)){rect(0,0,16,16,base);g.globalAlpha=.55;rect(1,1,14,14,'#fff');g.globalAlpha=1;}edge(0,0,16,16,/^glass$/i.test(name)?'#cfe9ef':base);px(2,2,'#fff');px(3,3,'#fff');px(2,4,'#fff');break;
    case 'pane':{const col=/iron/i.test(name)?'#b8b8b8':base;if(/iron/i.test(name)){[3,7,11].forEach(x=>rect(x,0,2,16,col));rect(0,0,16,1,col);rect(0,15,16,1,col)}else{g.globalAlpha=.7;rect(6,0,4,16,col);g.globalAlpha=1;rect(6,0,1,16,'#fff');}break}
    case 'torch':{const f=/redstone/i.test(name)?'#d1291d':/soul/i.test(name)?'#4fd0e0':'#f6b73c';rect(7,6,2,9,wood);rect(6,2,4,4,f);px(7,1,f);rect(7,3,2,2,'#fff4c2');break}
    case 'lantern':{const f=/soul/i.test(name)?'#4fd0e0':'#f6b73c';rect(6,1,4,2,'#3a3a3a');solid(3,3,10,10,'#4a4a4a');rect(5,5,6,6,f);rect(7,6,2,3,'#fff4c2');break}
    case 'rail':{const rc=/powered/i.test(name)?'#d9b72f':/detector|activator/i.test(name)?'#a14a2a':'#bdbdbd';[2,7,12].forEach(y=>rect(2,y,12,2,wood));rect(3,0,2,16,rc);rect(11,0,2,16,rc);break}
    case 'cart':solid(1,6,14,7,'#9a9a9a');rect(3,13,3,3,'#444');rect(10,13,3,3,'#444');if(/chest/i.test(name))solid(4,3,8,4,wood);if(/tnt/i.test(name))solid(4,3,8,4,'#c33');if(/furnace/i.test(name))solid(4,3,8,4,'#777');if(/hopper/i.test(name))solid(4,3,8,4,'#555');break;
    case 'chest2':solid(1,4,14,10,/ender/i.test(name)?'#1f4f4a':wood);rect(1,8,14,1,'rgba(0,0,0,.45)');rect(7,7,2,3,'#d6d6d6');break;
    case 'pickaxe':handle();line(5,4,8,2,base,2);line(8,2,13,4,base,2);line(13,4,14,9,base,2);break;
    case 'axe':handle();solid(7,2,5,3);solid(9,5,4,3);break;
    case 'shovel':handle();solid(10,2,4,4);break;
    case 'hoe':handle();solid(8,2,5,2);solid(8,4,2,3);break;
    case 'sword':line(4,12,13,3,base,2);line(5,13,6,12,'#5b3d1e',2);line(3,9,8,14,'#5b3d1e');line(2,14,4,12,wood,2);break;
    case 'helmet':solid(3,3,10,5);solid(3,8,3,4);solid(10,8,3,4);break;
    case 'chest':solid(1,3,4,6);solid(11,3,4,6);solid(4,3,8,11);rect(6,3,4,2,'rgba(0,0,0,.3)');break;
    case 'legs':solid(3,2,10,5);solid(3,7,4,8);solid(9,7,4,8);break;
    case 'boots':solid(2,7,5,6);solid(9,7,5,6);solid(1,11,6,3);solid(9,11,6,3);break;
    case 'ingot':solid(2,5,12,7);rect(3,5,10,1,lt);rect(3,11,10,1,dk);break;
    case 'nugget':solid(6,6,4,4);break;
    case 'gem':for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.abs(x-7.5)+Math.abs(y-7.5);if(d<=6.5)px(x,y,d>5.5?dk:(x+y<12&&d<4)?lt:shade(base,(rnd()-.5)*.2))}break;
    case 'dust':for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-8);if(d<5.2)px(x,y,d>4.3?dk:shade(base,(rnd()-.5)*.35))}break;
    case 'rod':line(3,13,12,4,/blaze/i.test(name)?'#f5a31a':wood,2);break;
    case 'bucket':rect(3,4,10,1,'#9a9a9a');for(let y=5;y<14;y++){const i=Math.floor((y-5)/4);rect(3+i,y,10-2*i,1,y%2?'#c8c8c8':'#bdbdbd')}rect(4,5,8,1,'#555');break;
    case 'bowl':for(let y=7;y<12;y++){const i=y-7>2?y-9:0;rect(2+i,y,12-2*i,1,y===7?shade('#8a6234',.2):'#8a6234')}break;
    case 'bottle':rect(6,2,4,2,'#9b7a4b');rect(7,4,2,2,'#cfe9ef');solid(4,6,8,8,'#bfe0e8');break;
    default:for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-8);if(d<5.8)px(x,y,d>4.9?dk:shade(base,(rnd()-.5)*.25+((x+y<14&&d<3.8)?.12:0)))}
  }
  return c.toDataURL();
}
const icon=n=>{let u=ICONS.get(n);if(!u){const k=TXN[n];u=k?'data:image/png;base64,'+TXK[k]:draw(n);ICONS.set(n,u)}return u};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const img=(n,cls='ic')=>{const t=TAGS[n];return `<img class="${cls}" ${t?`data-tag="${esc(n)}" `:''}src="${icon(t?t[0]:n)}" alt="" width="16" height="16">`};

/* ---------- indexes ---------- */
const byOut=new Map(),usedIn=new Map();
RECIPES.forEach(r=>{if(!byOut.has(r.out))byOut.set(r.out,[]);byOut.get(r.out).push(r)});
const members=n=>TAGS[n]||[n];
RECIPES.forEach(r=>new Set(r.grid.filter(Boolean)).forEach(i=>{[i,...members(i)].forEach(m=>{if(!usedIn.has(m))usedIn.set(m,new Set());usedIn.get(m).add(r.out)})}));
const ALL=[...byOut.keys()].sort((a,b)=>a.localeCompare(b));
const CATS=[['all','All'],['building','Building'],['tools','Tools & armor'],['utility','Workstations'],['redstone','Redstone'],['transport','Transport'],['food','Food'],['decor','Decoration'],['materials','Materials']];
const catOf=n=>byOut.get(n)[0].cat;

/* ---------- search ---------- */
const norm=s=>s.toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
function score(name,q,toks){const l=name.toLowerCase();if(l===q)return 0;if(l.startsWith(q))return 1;if(l.split(/[ ']/).some(w=>w.startsWith(q)))return 2;return toks.every(t=>l.includes(t))?3:null}
const state={mode:'item',cat:'all',q:'',sel:null,variant:0,limit:60,usedAll:false};
function results(){
  const q=norm(state.q),toks=q.split(' ').filter(Boolean);let list;
  if(state.mode==='item'){
    list=q?ALL.map(n=>[n,score(n,q,toks)]).filter(x=>x[1]!==null).sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0])).map(x=>x[0]):ALL.slice();
  }else{
    if(!q)return null;
    const best=new Map();
    usedIn.forEach((outs,ing)=>{const s=score(ing,q,toks);if(s===null)return;outs.forEach(o=>{if(!best.has(o)||best.get(o)>s)best.set(o,s)})});
    list=[...best].sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0])).map(x=>x[0]);
  }
  return state.cat==='all'?list:list.filter(n=>catOf(n)===state.cat);
}

/* ---------- rendering ---------- */
const $=s=>document.querySelector(s);
function variantLabel(r){
  const m=new Map();r.grid.forEach(i=>i&&m.set(i,(m.get(i)||0)+1));
  const s=[...m].map(([k,v])=>(v>1?v+'× ':'')+k).join(' + ');return s.length>30?s.slice(0,29)+'…':s;
}
function renderList(){
  const box=$('#list'),res=results();
  if(res===null){box.innerHTML='<p class="hint">Type an ingredient, like <button class="link" data-q="iron ingot">iron ingot</button> or <button class="link" data-q="sand">sand</button>, to see everything it goes into.</p>';return}
  if(!res.length){
    let h=`<p class="hint">No recipes match “${esc(state.q)}”.</p>`;
    if(state.mode==='item'&&state.q){const alt=norm(state.q);let any=false;usedIn.forEach((_,k)=>{if(k.toLowerCase().includes(alt))any=true});
      if(any)h+=`<p class="hint">Nothing crafts this at a crafting table, but it is an ingredient. <button class="link" data-mode="ing">Search by ingredient</button></p>`}
    else if(state.cat!=='all')h+=`<p class="hint"><button class="link" data-cat="all">Show every category</button></p>`;
    box.innerHTML=h;return;
  }
  const shown=res.slice(0,state.limit);
  box.innerHTML=`<p class="count">${res.length} ${res.length===1?'item':'items'}</p><ul class="rows">${shown.map(n=>`<li><button class="row" data-name="${esc(n)}" ${n===state.sel?'aria-current="true"':''}>${img(n)}<span>${esc(n)}</span></button></li>`).join('')}</ul>${res.length>shown.length?`<button class="more" id="more">Show ${Math.min(60,res.length-shown.length)} more</button>`:''}`;
}
function renderPanel(){
  const n=state.sel,box=$('#panel');if(!n){box.innerHTML='';return}
  const rs=byOut.get(n)||[];state.variant=Math.min(state.variant,Math.max(rs.length-1,0));
  const r=rs[state.variant];
  const used=[...(usedIn.get(n)||[])].sort((a,b)=>a.localeCompare(b));
  const usedShown=state.usedAll?used:used.slice(0,18);
  let h=`<div class="head">${img(n,'ic big')}<h2>${esc(n)}</h2></div>`;
  if(rs.length>1)h+=`<div class="variants" role="group" aria-label="Recipes for ${esc(n)}">${rs.map((v,i)=>`<button class="var" data-v="${i}" aria-pressed="${i===state.variant}">${esc(variantLabel(v))}</button>`).join('')}</div>`;
  if(r){
    const cells=r.grid.map((it,i)=>it?`<button class="slot" data-name="${esc(it)}" title="${esc(it)}" aria-label="${esc(it)}">${img(it,'ic fill')}</button>`:'<div class="slot empty"></div>').join('');
    const fits=r.type==='shaped'?(r.w<=2&&r.h<=2):r.cnt<=4;
    const counts=new Map();r.grid.forEach(i=>i&&counts.set(i,(counts.get(i)||0)+1));
    h+=`<div class="craft"><div class="grid3">${cells}</div><svg class="arrow" viewBox="0 0 14 10" aria-hidden="true" shape-rendering="crispEdges"><path d="M0 4h9V0h2v1h1v1h1v1h1v4h-1v1h-1v1h-1v1H9V6H0z"/></svg><div class="slot out">${img(n,'ic fill')}${r.n>1?`<span class="qty">${r.n}</span>`:''}</div></div>
    <p class="meta"><span class="tag">${r.type==='shaped'?'Shaped':'Shapeless'}</span><span>${r.type==='shaped'?'Keep the ingredients in this pattern.':'Place the ingredients in any arrangement.'}</span></p>
    <p class="meta"><span>${fits?'Fits the 2×2 grid in your inventory.':'Needs a crafting table.'}</span></p>
    ${r.note?`<p class="note">${esc(r.note)}</p>`:''}
    <h3>Ingredients</h3><ul class="ings">${[...counts].map(([k,v])=>`<li><button class="ing" data-name="${esc(k)}">${img(k)}<b>${v}×</b><span>${esc(k)}</span></button></li>`).join('')}</ul>`;
  }else{
    h+=`<p class="plain">${esc(n)} isn’t made at a crafting table. It might be mined, dropped by a mob, found in the world, or smelted.</p>`;
  }
  if(used.length)h+=`<h3>Used to craft</h3><ul class="chips">${usedShown.map(u=>`<li><button class="chip" data-name="${esc(u)}">${img(u)}<span>${esc(u)}</span></button></li>`).join('')}</ul>${used.length>18&&!state.usedAll?`<button class="more" id="usedmore">Show all ${used.length}</button>`:''}`;
  box.innerHTML=h;
}
function renderChips(){
  $('#cats').innerHTML=CATS.map(([k,l])=>`<button class="cat" data-cat="${k}" aria-pressed="${k===state.cat}">${l}</button>`).join('');
  document.querySelectorAll('#modes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===state.mode)));
  $('#q').placeholder=state.mode==='item'?'Search items, like “piston”':'Search ingredients, like “iron ingot”';
}
function select(name,scroll){
  if(TAGS[name])name=TAGS[name][0];
  state.sel=name;state.variant=0;state.usedAll=false;
  try{history.replaceState(null,'','#craft/'+encodeURIComponent(name))}catch(e){}
  renderPanel();renderList();
  if(scroll&&matchMedia('(max-width:859px)').matches)$('#panel-wrap').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t||!t.closest('#tab-craft'))return;
  if(t.dataset.name){select(t.dataset.name,!!t.closest('#list')||!!t.closest('.chips'));return}
  if(t.dataset.v!==undefined){state.variant=+t.dataset.v;renderPanel();return}
  if(t.dataset.cat){state.cat=t.dataset.cat;state.limit=60;renderChips();renderList();return}
  if(t.dataset.m||t.dataset.mode){state.mode=(t.dataset.m||'ing')==='ing'?'ing':'item';state.limit=60;renderChips();renderList();return}
  if(t.dataset.q){$('#q').value=t.dataset.q;state.q=t.dataset.q;state.mode='ing';renderChips();renderList();return}
  if(t.id==='more'){state.limit+=60;renderList();return}
  if(t.id==='usedmore'){state.usedAll=true;renderPanel();return}
});
$('#q').addEventListener('input',e=>{state.q=e.target.value;state.limit=60;renderList()});
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){const r=results();if(r&&r.length)select(r[0],true)}});
$('#clear').addEventListener('click',()=>{const q=$('#q');q.value='';state.q='';renderList();q.focus()});

/* ingredient groups cycle through their members, like in the game */
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let k=0;setInterval(()=>{k++;document.querySelectorAll('img[data-tag]').forEach(im=>{const m=TAGS[im.dataset.tag];im.src=icon(m[k%m.length])})},1100)}

/* init */
renderChips();
let start='Crafting Table';
try{let h=decodeURIComponent(location.hash.slice(1));if(h.startsWith('craft/'))h=h.slice(6);if(h&&(byOut.has(h)||usedIn.has(h)))start=h}catch(e){}
state.sel=start;renderPanel();renderList();
