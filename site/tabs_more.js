/* ---------- furnace fuel (a card in Tools): how many items each fuel smelts ---------- */
function renderFuel(){return `<article class="bpanel" id="fuel"><div class="bhead">${img('Furnace','ic big')}<h2>Furnace fuel</h2></div>
  <ul class="srows">${FUELS.map(([f,per])=>`<li class="srow" data-at="${esc(f)}">${linkItem(f,`${img(f)}<span class="sio"><b>${esc(f)}</b></span>`)}<span class="need"><b>${per}</b><small>item${per===1?'':'s'}</small></span></li>`).join('')}</ul></article>`}

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
  const sel=(attr,pc,opts,cur,label)=>`<select data-${attr}="${pc}" aria-label="${label}">${opts.map(([v,l])=>`<option value="${v}"${v===cur?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
  return `<div class="stage3d" id="stage3d" role="img" aria-label="3D armor preview. Drag to turn it."><canvas id="trimcv3" width="300" height="340"></canvas></div><div class="pmode four">${['front','side','back','right'].map(v=>`<button data-view3d="${v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div>
  <div class="tpieces">${PIECES.map(([k,l])=>{const P=S.pieces[k];return `<div class="tpiece"><b>${l}</b>${sel('tmat',k,ARMOR_MATS,P.mat,l+' armor')}${sel('tpat',k,pats,P.pat,l+' trim pattern')}${sel('ttm',k,TRIM_MAT_PAL,P.tm,l+' trim material')}</div>`}).join('')}</div>
  <div class="eactions"><button class="btn small" data-tall="1">Copy helmet to all pieces</button></div>`;
}
function renderNetherite(){
  const S=TS.smith,items=NETHERITE_GEAR.filter(g=>S.up[g]),n=items.length,owned=Math.max(0,Math.floor(+S.owned||0)),copies=n>owned?(owned?n-owned:n-1):0;
  const dia=S.diag?items.reduce((a,g)=>a+DIAMOND_COST[g],0):0;
  return `<div class="pchips">${NETHERITE_GEAR.map(g=>`<button class="pchip" data-nup="${g}" aria-pressed="${!!S.up[g]}">${img('Netherite '+g)}<span>${g}</span></button>`).join('')}</div>
  <div class="eactions"><button class="btn small" data-nset="armor">Full armor</button><button class="btn small" data-nset="all">Everything</button><button class="btn small" data-nset="none">Clear</button></div>
  <label class="exrow"><span>Upgrade templates you have</span><select data-nowned="1">${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<option${i===owned?' selected':''}>${i}</option>`).join('')}</select></label>
  <label class="exrow"><span>Include diamonds for the diamond gear</span><input type="checkbox" data-ndia="1"${S.diag?' checked':''}></label>
  ${n?`<div class="esum"><div><b>${n}</b><span>netherite ingots</span></div><div><b>${n*4}</b><span>ancient debris</span></div><div><b>${n*4}</b><span>gold ingots</span></div></div>
  <ul class="ilist">${irow('Ancient Debris',`${img('Ancient Debris')}<span><b>${n*4}×</b> Ancient Debris → Netherite Scrap</span>`)}${irow('Gold Ingot',`${img('Gold Ingot')}<span><b>${n*4}×</b> Gold Ingot</span>`)}${irow('Netherite Upgrade',`${img('Netherite Upgrade')}<span><b>${copies}</b> template cop${copies===1?'y':'ies'} to craft</span>`)}${irow('Diamond',`${img('Diamond')}<span><b>${copies*7+dia}×</b> Diamond${dia?` (${copies*7} for templates, ${dia} for gear)`:''}</span>`)}${irow('Netherrack',`${img('Netherrack')}<span><b>${copies}×</b> Netherrack</span>`)}</ul>
  ${!owned?'<p class="note">First template: bastion remnants.</p>':''}`:'<p class="hint">Pick at least one item.</p>'}`;
}
function renderTemplates(){
  const S=TS.smith,all=[['Netherite Upgrade','Bastion remnants','Netherrack'],...TRIMS.map(([n,w,m])=>[n+' Armor Trim',w,m])],got=all.filter(t=>S.found[t[0]]).length;
  return `<div class="chk"><span>${got} of ${all.length} found</span></div>
  <ul class="srows">${all.map(([n,w,m])=>`<li class="srow tcheck${S.found[n]?' got':''}" role="button" tabindex="0" data-tfound="${esc(n)}" data-at="${esc(n)}" aria-pressed="${!!S.found[n]}">${img(n)}<span class="sio"><b>${S.found[n]?'✓ ':''}${esc(n.replace(' Armor Trim',''))}</b><small>${esc(w)}. Copy: 7 diamonds + ${esc(m)}.</small></span><button class="link" data-item="${esc(n)}">Recipe</button></li>`).join('')}</ul>
  <h3 class="eh3">Trim colors</h3>${ilist(TRIM_MATS)}`;
}
function renderSmith(){const S=TS.smith;const body=S.sub==='net'?renderNetherite():S.sub==='temp'?renderTemplates():renderTrim();
  return head('Smithing')+subnav('smith',[['trim','Trim preview'],['net','Netherite'],['temp','Templates']])+
  (S.sub==='net'?`<article class="bpanel"><div class="srecipe">${['Netherite Upgrade','Diamond Chestplate','Netherite Ingot'].map((n,i)=>`<div class="sslot">${linkItem(n,img(n,'ic big'))}<small>${['Template','Diamond item','Ingot'][i]}</small></div>${i<2?'<span class="plus">+</span>':''}`).join('')}<span class="arr">→</span><div class="sslot">${img('Netherite Chestplate','ic big')}<small>Keeps enchantments</small></div></div></article>`:'')+body}

/* ---------- food ---------- */
function renderFoodList(){
  const F=TS.food;let list=FOODS.filter(f=>!(F.hideBad&&f.bad));const key={best:f=>f.h+f.s,h:f=>f.h,s:f=>f.s}[F.sort];list=list.slice().sort((a,b)=>key(b)-key(a)||b.s-a.s);
  return `<div class="pmode">${pill('fsort','best',F.sort,'Best overall')}${pill('fsort','h',F.sort,'Hunger')}${pill('fsort','s',F.sort,'Saturation')}</div>
  <label class="exrow"><span>Hide food with bad effects</span><input type="checkbox" data-fbad="1"${F.hideBad?' checked':''}></label>
  <ul class="srows">${list.map(f=>`<li class="srow" data-at="${esc(f.name)}">${linkItem(f.name,`${img(f.name)}<span class="sio"><b>${esc(f.name)}</b>${f.note?`<small${f.bad?' class="badn"':''}>${esc(f.note)}</small>`:''}</span>`)}<span class="need"><b>${f.h}</b><small>hunger</small></span><span class="need"><b>${f.s}</b><small>saturation</small></span></li>`).join('')}</ul>`;
}
function renderFood(){return head('Food')+renderFoodList()}

/* ---------- tools: nether portal converter, saved portals, XP to level ---------- */
function xpOut(){
  const X=TS.tools,cur=Math.max(0,Math.floor(+X.cur||0)),tg=Math.max(0,Math.floor(+X.target||0)),need=xpTotal(tg)-xpTotal(cur);
  return need>0?`<p class="bdur"><b>${need.toLocaleString()} points</b></p>`:'<p class="bdur"><b>Already there</b></p>';
}
function linkCheck(list){
  const d=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),cheb=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.z-b.z));
  return list.map((p,i)=>{const issues=[];
    const tN={x:Math.floor(p.o.x/8),z:Math.floor(p.o.z/8)},nn=list.map((q,j)=>({j,dd:d(q.n,tN),c:cheb(q.n,tN)})).filter(x=>x.c<=16).sort((a,b)=>a.dd-b.dd)[0];
    if(!nn)issues.push('To the Nether: no portal within 16 blocks, so a new one gets built.');else if(nn.j!==i)issues.push(`To the Nether: comes out at “${list[nn.j].name}”.`);
    const tO={x:p.n.x*8,z:p.n.z*8},no=list.map((q,j)=>({j,dd:d(q.o,tO),c:cheb(q.o,tO)})).filter(x=>x.c<=128).sort((a,b)=>a.dd-b.dd)[0];
    if(!no)issues.push('Coming back: no portal within 128 blocks, so a new one gets built.');else if(no.j!==i)issues.push(`Coming back: comes out at “${list[no.j].name}”.`);
    return issues;});
}
function renderMyPortals(){
  const P=TS.tools,list=P.saved,checks=linkCheck(list),xyz=(p,l)=>['X','Y','Z'].map(a=>`<input id="${p}${a.toLowerCase()}" class="num" type="number" inputmode="numeric" placeholder="${a}" aria-label="${l} ${a}">`).join('');
  return `<article class="bpanel"><h2 class="eh">Saved portals</h2><input id="pname" class="tin wide" placeholder="Name, like “Base”" aria-label="Portal name">
  <p class="plabel">Overworld</p><div class="pgrid">${xyz('po','Overworld')}</div>
  <p class="plabel">Nether (optional)</p><div class="pgrid">${xyz('pn','Nether')}</div>
  <button class="btn primary" data-padd="1">Save portal</button>
  ${list.length?`<ul class="vlist">${list.map((p,i)=>`<li class="vcard">${img('Obsidian','ic big')}<div class="vbody"><b>${esc(p.name)}</b><small>Overworld ${p.o.x}, ${p.o.y}, ${p.o.z} · Nether ${p.n.x}, ${p.n.y}, ${p.n.z}</small>${checks[i].length?checks[i].map(t=>`<span class="pwarn">${esc(t)}</span>`).join(''):'<span class="pok">✓ Links both ways</span>'}</div><button class="link" data-prm="${i}">Remove</button></li>`).join('')}</ul>`:'<p class="hint">No portals saved yet.</p>'}</article>`;
}
function renderTools(){
  const P=TS.tools,f=(k,a,side)=>`<label class="pfield"><span>${a}</span><input class="num" type="number" inputmode="numeric" data-pt="${k}" value="${esc(P[k])}" aria-label="${side} ${a}"></label>`;
  return head('Tools')+`<article class="bpanel" id="portal"><div class="bhead">${linkItem('Obsidian',img('Obsidian','ic big'))}<h2>Nether portal</h2></div>
  <div class="pconv"><b>Overworld</b>${f('ox','X','Overworld')}${f('oz','Z','Overworld')}<b>Nether</b>${f('nx','X','Nether')}${f('nz','Z','Nether')}</div></article>
  ${renderMyPortals()}
  <article class="bpanel" id="xp"><div class="bhead">${linkItem("Bottle o' Enchanting",img("Bottle o' Enchanting",'ic big'))}<h2>XP to level</h2></div>
  <div class="pgrid two"><label class="pfield"><span>Level now</span>${numIn('xp="cur"',P.cur,'min="0" max="1000"')}</label><label class="pfield"><span>Target level</span>${numIn('xp="target"',P.target,'min="1" max="1000"')}</label></div>
  <div id="xpout">${xpOut()}</div></article>
  ${renderFuel()}`;
}
/* typing in one side of the converter fills in the other side */
function portalSync(k){
  const P=TS.tools,from=k[0],to=from==='o'?'n':'o',axis=k[1],v=P[k];
  P[to+axis]=v===''||isNaN(+v)?'':from==='o'?Math.floor(+v/8):Math.floor(+v)*8;
  const el=document.querySelector(`[data-pt="${to+axis}"]`);if(el)el.value=P[to+axis];
}

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
