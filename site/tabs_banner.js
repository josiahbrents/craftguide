/* ---------- banners ---------- */
TS.banner=Object.assign({sub:'design',base:'white',layers:[],saved:[],pickColor:'black',picking:false,sname:'',idea:'popular',lc:'black',bc:'white',word:'HELLO',edit:null},TS.banner||{});
if(!['design','ideas','saved'].includes(TS.banner.sub))TS.banner.sub='design';TS.banner.edit=null;
const BDY=Object.fromEntries(BAN_DYES.map(d=>[d.id,d])),BPAT=Object.fromEntries(BAN_PAT.map(p=>[p.id,p]));
const banPix={};let banReady=null;
function banLoad(){if(banReady)return banReady;banReady=Promise.all(Object.entries(BAN_TEX).map(async([k,src])=>{const im=await loadImg(src);if(!im)return;const c=document.createElement('canvas');c.width=20;c.height=40;const g=c.getContext('2d');if(!g||!g.getImageData)return;g.drawImage(im,0,0);const d=g.getImageData(0,0,20,40);if(d&&d.data)banPix[k]=d.data}));return banReady}
function banPaint(cv,base,layers){
  const g=cv.getContext('2d');if(!g||!g.createImageData)return;const out=g.createImageData(20,40);if(!out||!out.data)return;const o=out.data,acc=new Float32Array(20*40*3);
  const put=(k,hex,first)=>{const P=banPix[k];if(!P)return;const r=parseInt(hex.slice(1,3),16),gg=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    for(let i=0;i<800;i++){const a=first?1:P[i*4+3]/255,l=P[i*4]/255;if(!a)continue;acc[i*3]=acc[i*3]*(1-a)+r*l*a;acc[i*3+1]=acc[i*3+1]*(1-a)+gg*l*a;acc[i*3+2]=acc[i*3+2]*(1-a)+b*l*a}};
  put('base',BDY[base].hex,true);layers.forEach(L=>{if(BPAT[L.p]&&BDY[L.c])put(L.p,BDY[L.c].hex,false)});
  for(let i=0;i<800;i++){o[i*4]=acc[i*3];o[i*4+1]=acc[i*3+1];o[i*4+2]=acc[i*3+2];o[i*4+3]=255}
  g.putImageData(out,0,0);
}
const bspec=(base,layers)=>base+'|'+layers.map(l=>l.p+':'+l.c).join(',');
const bcanvas=(base,layers,cls='bthumb')=>`<canvas class="${cls}" width="20" height="40" data-bspec="${bspec(base,layers)}"></canvas>`;
function drawBanners(){banLoad().then(()=>{document.querySelectorAll('canvas[data-bspec]').forEach(cv=>{const [b,l]=cv.dataset.bspec.split('|');banPaint(cv,b,l?l.split(',').map(x=>{const [p,c]=x.split(':');return {p,c}}):[])})})}
const dyeName=id=>BDY[id]?BDY[id].name:id;
function swatches(attr,cur){return `<div class="swatches">${BAN_DYES.map(d=>`<button class="sw" data-${attr}="${d.id}" aria-pressed="${d.id===cur}" aria-label="${d.name}" title="${d.name}" style="background:${d.hex}"></button>`).join('')}</div>`}
function banSteps(base,layers){
  const dyes={},items=[];layers.forEach(l=>{dyes[l.c]=(dyes[l.c]||0)+1;const it=BPAT[l.p].item;if(it&&!items.includes(it))items.push(it)});
  let h=`<h3 class="eh3">Loom steps</h3><ol class="bsteps"><li class="bstep">${img(dyeName(base)+' Banner')}<div><b>Make a ${esc(dyeName(base).toLowerCase())} banner</b><span>6 ${esc(dyeName(base).toLowerCase())} wool and 1 stick at a crafting table.</span></div></li>`;
  layers.forEach(l=>{const p=BPAT[l.p];h+=`<li class="bstep">${img(dyeName(l.c)+' Dye')}<div><b>Loom: ${esc(dyeName(l.c))} dye${p.item?' + '+esc(p.item):''}</b><span>Pick <b>${esc(p.name)}</b> (${esc(p.desc.toLowerCase())}).</span></div></li>`});
  h+=`</ol><h3 class="eh3">What you need</h3><ul class="ilist"><li>${img(dyeName(base)+' Wool')}<span><b>6×</b> ${esc(dyeName(base))} Wool</span></li><li>${img('Stick')}<span><b>1×</b> Stick</span></li>${Object.entries(dyes).map(([c,n])=>`<li>${img(dyeName(c)+' Dye')}<span><b>${n}×</b> ${esc(dyeName(c))} Dye</span></li>`).join('')}${items.map(it=>`<li>${img(it)}<span>${esc(it)}</span></li>`).join('')}${layers.length?`<li>${img('Loom')}<span>A loom</span></li>`:''}</ul>`;
  if(items.length)h+=`<p class="small">${items.map(it=>{const p=BAN_PAT.find(x=>x.item===it);return esc(it)+': '+esc(p.how)}).join(' ')} Pattern items are never used up.</p>`;
  return h;
}
function renderBanDesign(){
  const B=TS.banner,full=B.layers.length>=6;
  let h=`<div class="bdesign"><div class="bprev"><div class="bpole"></div>${bcanvas(B.base,B.layers,'bbig')}</div><div class="bside">
    <h3 class="eh3" style="margin-top:0">Banner color</h3>${swatches('bbase',B.base)}
    <h3 class="eh3">Layers <small>${B.layers.length} of 6</small></h3>
    ${B.layers.length?`<ol class="blayers">${B.layers.map((l,i)=>{const ed=B.edit&&B.edit.i===i?B.edit.mode:null;return `<li class="blayer${ed?' editing':''}"><div class="blrow">${bcanvas('light_gray',[{p:l.p,c:l.c}],'bmini')}<span class="bln"><button class="blname" data-bpat="${i}" aria-expanded="${ed==='pattern'}">${esc(BPAT[l.p].name)} <small>change</small></button><button class="blcolor" data-bcolor="${i}" aria-expanded="${ed==='color'}" aria-label="Change color, now ${esc(dyeName(l.c))}"><span class="chip" style="background:${BDY[l.c].hex}"></span>${esc(dyeName(l.c))}</button></span><span class="bctl2"><button class="sbtn" data-bup="${i}" aria-label="Move up"${i?'':' disabled'}>↑</button><button class="sbtn" data-bdown="${i}" aria-label="Move down"${i<B.layers.length-1?'':' disabled'}>↓</button><button class="sbtn" data-brm="${i}" aria-label="Remove">✕</button></span></div>
      ${ed==='color'?`<div class="bledit">${BAN_DYES.map(d=>`<button class="sw" data-blc="${i}:${d.id}" aria-pressed="${d.id===l.c}" aria-label="${d.name}" title="${d.name}" style="background:${d.hex}"></button>`).join('')}</div>`:''}
      ${ed==='pattern'?`<div class="bledit"><div class="bpgrid">${BAN_PAT.map(p=>`<button class="bpbtn" data-brep="${i}:${p.id}" title="${esc(p.name)}" aria-pressed="${p.id===l.p}">${bcanvas(B.base,B.layers.map((x,j)=>j===i?{p:p.id,c:x.c}:x),'bmini2')}<small>${esc(p.name)}</small>${p.item?'<span class="bneeds">Item</span>':''}</button>`).join('')}</div></div>`:''}</li>`}).join('')}</ol>`:'<p class="hint">No layers yet. Add one below.</p>'}
    ${full?'<p class="small">That’s the most a loom can do (6 layers).</p>':`<button class="btn primary" data-bpick="1">${B.picking?'Close':'Add a layer'}</button>`}
  </div></div>`;
  if(B.picking&&!full)h+=`<div class="bpanel"><h3 class="eh3" style="margin-top:0">1. Pick a dye color</h3>${swatches('bpc',B.pickColor)}<h3 class="eh3">2. Tap a pattern to add it</h3>
    <div class="bpgrid">${BAN_PAT.map(p=>`<button class="bpbtn" data-badd="${p.id}" title="${esc(p.name)}">${bcanvas(B.base,[...B.layers,{p:p.id,c:B.pickColor}],'bmini2')}<small>${esc(p.name)}</small>${p.item?'<span class="bneeds">Item</span>':''}</button>`).join('')}</div></div>`;
  h+=banSteps(B.base,B.layers);
  h+=`<div class="drow" style="margin-top:12px"><input id="bsname" class="tin" placeholder="Name this banner" value="${esc(B.sname||'')}" aria-label="Banner name"><button class="btn" data-bsave="1">Save</button><button class="btn" data-bclear="1">Start over</button></div>
  <section class="how"><h3>Good to know</h3><p>Each loom step uses one dye. If you make a mistake, use the banner on a water cauldron to wash off the top layer.</p><p><b>Copy a banner:</b> put it in a crafting grid with a blank banner of the same base color. You keep the original.</p><p><b>Shield:</b> craft the banner with a shield to put the design on it. It needs to be a shield without a design already.</p></section>`;
  return h;
}
const letterLayers=(ch,lc,bc)=>(BAN_LETTERS[ch]||[]).map(([p,r])=>({p,c:r==='L'?lc:bc}));
function ideaGrid(list,kind){return `<div class="bgallery">${list.map((p,i)=>`<button class="bgitem" data-bidea="${kind}:${i}">${bcanvas(p.base,p.layers,'bthumb')}<b>${esc(p.name)}</b><small>${p.layers.length} layer${p.layers.length===1?'':'s'}${p.layers.some(l=>BPAT[l.p].item)?', needs a pattern item':''}</small></button>`).join('')}</div>`}
function colorPair(){const B=TS.banner;return `<div class="bpair"><div><b>Letter color</b>${swatches('blcol',B.lc)}</div><div><b>Background</b>${swatches('bbcol',B.bc)}</div></div>`}
function renderBanIdeas(){
  const B=TS.banner,chips=[['popular','Popular'],['letters','Letters and numbers'],['flags','Flags'],['word','Write a word']];
  let h=`<div class="pmode four">${chips.map(([k,l])=>pill('bideatab',k,B.idea,l)).join('')}</div>`;
  if(B.idea==='popular')h+=`<p class="lede">Takes on designs the community loves. Tap one to open it in the designer with its loom steps.</p>`+ideaGrid(BAN_POPULAR,'popular');
  else if(B.idea==='flags')h+=`<p class="lede">${BAN_FLAGS.length} country flags. Banners hang tall, so stripes run the way they do on a hanging flag, and detailed emblems are simplified to fit 6 layers.</p>`+ideaGrid(BAN_FLAGS,'flags');
  else if(B.idea==='letters'){const ks=Object.keys(BAN_LETTERS);h+=`<p class="lede">Pick your colors, then tap a letter or number for its loom steps. Every one fits in 6 layers.</p>${colorPair()}<div class="bgallery letters">${ks.map(k=>`<button class="bgitem" data-bletter="${k}">${bcanvas(B.bc,letterLayers(k,B.lc,B.bc),'bthumb')}<b>${k}</b><small>${BAN_LETTERS[k].length} layers</small></button>`).join('')}</div>`}
  else{const chars=[...B.word.toUpperCase()].slice(0,24),letters=chars.filter(c=>BAN_LETTERS[c]),uniq=[...new Set(letters)];
    const dyes={};uniq.forEach(c=>letterLayers(c,B.lc,B.bc).forEach(l=>{dyes[l.c]=(dyes[l.c]||0)+1}));
    h+=`<p class="lede">Type a word to see it spelled in banners, with everything you need for the whole thing.</p><input class="esearch" data-bword="1" maxlength="24" value="${esc(B.word)}" placeholder="Type a word" aria-label="Word to spell">${colorPair()}
    <div class="bword">${chars.map(c=>BAN_LETTERS[c]?`<button class="bwl" data-bletter="${c}" aria-label="${c}">${bcanvas(B.bc,letterLayers(c,B.lc,B.bc),'bwthumb')}</button>`:'<span class="bwsp"></span>').join('')}</div>
    ${letters.length?`<h3 class="eh3">For the whole word</h3><ul class="ilist"><li>${img(dyeName(B.bc)+' Banner')}<span><b>${letters.length}×</b> ${esc(dyeName(B.bc))} Banner (${letters.length*6} wool, ${letters.length} sticks)</span></li>${Object.entries(dyes).map(([c,n])=>`<li>${img(dyeName(c)+' Dye')}<span><b>${n}×</b> ${esc(dyeName(c))} Dye</span></li>`).join('')}</ul><p class="small">The dye covers one of each of the ${uniq.length} different letter${uniq.length===1?'':'s'}. For repeats, put the finished banner in a crafting grid with a blank ${esc(dyeName(B.bc).toLowerCase())} banner to copy it without using dye. Tap a letter for its steps.</p>`:''}`}
  return h;
}
function renderBanSaved(){const B=TS.banner;return B.saved.length?`<div class="bgallery">${B.saved.map((s,i)=>`<div class="bgitem">${bcanvas(s.base,s.layers,'bthumb')}<b>${esc(s.name)}</b><span class="drow" style="justify-content:center"><button class="btn small" data-bload="${i}">Open</button><button class="btn small" data-bdel="${i}">Delete</button></span></div>`).join('')}</div>`:'<p class="hint">Saved banners show up here. Make one in the designer and tap Save.</p>'}
function renderBanner(){const B=TS.banner;return head('Banners','Design banners with a live preview, get ideas from letters, flags and favorites, and follow the exact loom steps.')+subnav('banner',[['design','Designer'],['ideas','Ideas'],['saved','My banners']])+(B.sub==='ideas'?renderBanIdeas():B.sub==='saved'?renderBanSaved():renderBanDesign())}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.closest('#tab-banner'))return;const d=b.dataset,B=TS.banner;
  const done=()=>{const y=window.scrollY;renderTab('banner');window.scrollTo(0,y)};
  if(d.bbase){B.base=d.bbase;done();return}if(d.bpc){B.pickColor=d.bpc;done();return}
  if(d.bpick){B.picking=!B.picking;B.edit=null;done();return}
  if(d.bcolor!==undefined){const i=+d.bcolor;B.edit=B.edit&&B.edit.i===i&&B.edit.mode==='color'?null:{i,mode:'color'};B.picking=false;done();return}
  if(d.bpat!==undefined){const i=+d.bpat;B.edit=B.edit&&B.edit.i===i&&B.edit.mode==='pattern'?null:{i,mode:'pattern'};B.picking=false;done();return}
  if(d.blc){const [i,c]=d.blc.split(':');B.layers[+i].c=c;B.edit=null;done();return}
  if(d.brep){const [i,p]=d.brep.split(':');B.layers[+i].p=p;B.edit=null;done();return}
  if(d.bideatab){B.idea=d.bideatab;done();return}
  if(d.blcol){B.lc=d.blcol;done();return}if(d.bbcol){B.bc=d.bbcol;done();return}
  if(d.bletter){const ch=d.bletter;B.base=B.bc;B.layers=letterLayers(ch,B.lc,B.bc);B.sname='Letter '+ch;B.sub='design';B.picking=false;B.edit=null;renderTab('banner');window.scrollTo(0,0);return}
  if(d.badd){if(B.layers.length<6)B.layers.push({p:d.badd,c:B.pickColor});if(B.layers.length>=6)B.picking=false;done();return}
  if(d.bup||d.bdown||d.brm)B.edit=null;
  if(d.bup){const i=+d.bup;[B.layers[i-1],B.layers[i]]=[B.layers[i],B.layers[i-1]];done();return}
  if(d.bdown){const i=+d.bdown;[B.layers[i+1],B.layers[i]]=[B.layers[i],B.layers[i+1]];done();return}
  if(d.brm){B.layers.splice(+d.brm,1);done();return}
  if(d.bclear){B.layers=[];B.base='white';B.sname='';done();return}
  if(d.bsave){const n=(document.getElementById('bsname').value||'').trim()||'Banner '+(B.saved.length+1);B.saved.push({name:n,base:B.base,layers:B.layers.map(l=>({...l}))});B.sname=n;done();return}
  if(d.bidea){const [k,i]=d.bidea.split(':'),p=(k==='flags'?BAN_FLAGS:BAN_POPULAR)[+i];B.base=p.base;B.layers=p.layers.map(l=>({...l}));B.sname=p.name;B.sub='design';B.picking=false;renderTab('banner');window.scrollTo(0,0);return}
  if(d.bload){const s=B.saved[+d.bload];B.base=s.base;B.layers=s.layers.map(l=>({...l}));B.sname=s.name;B.sub='design';renderTab('banner');window.scrollTo(0,0);return}
  if(d.bdel){B.saved.splice(+d.bdel,1);done();return}
});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.bword){TS.banner.word=e.target.value;const y=window.scrollY;renderTab('banner');window.scrollTo(0,y)}});
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.bword){TS.banner.word=e.target.value;const t=document.querySelector('.bword');if(!t)return;const tmp=document.createElement('div');tmp.innerHTML=renderBanIdeas();t.innerHTML=tmp.querySelector('.bword').innerHTML;drawBanners();saveTS()}});
