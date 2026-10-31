/* Exact Java Edition anvil planner. Needs ench_data.js (EBY, conflicts, canTake). Works in a page, a Web Worker, or Node. */
const PEN=w=>Math.pow(2,w)-1;
function anvilSolve(spec){
  const {type,want}=spec,limit=spec.limit||39,budget=spec.budget||250000;
  const item=spec.item?{ench:{...spec.item.ench},work:spec.item.work||0}:null;
  // relevant enchantments
  const idSet=new Set(Object.keys(want));
  if(item)Object.keys(item.ench).forEach(k=>idSet.add(k));
  spec.books.forEach(b=>Object.keys(b.ench).forEach(k=>idSet.add(k)));
  const ids=[...idSet],m=ids.length,J=Object.fromEntries(ids.map((k,i)=>[k,i]));
  const MB=ids.map(k=>EBY[k].mb),MAX=ids.map(k=>EBY[k].max),APP=ids.map(k=>canTake(type,k));
  const CF=ids.map(a=>ids.map(b=>a!==b&&conflicts(a,b)));
  const CFL=ids.map((a,j)=>ids.map((b,i)=>CF[i][j]?i:-1).filter(i=>i>=0));
  const toArr=map=>{const a=new Array(m).fill(0);for(const[k,v]of Object.entries(map))a[J[k]]=v;return a};
  const toMap=a=>{const o={};a.forEach((v,j)=>{if(v)o[ids[j]]=v});return o};
  const key=a=>{let k=0;for(let j=m-1;j>=0;j--)k=k*8+a[j];return k};
  // one anvil step, right side is always a book
  function merge(L,R){
    let cost=PEN(L.work)+PEN(R.work),changed=false;const out=L.arr.slice();
    for(let j=0;j<m;j++){const lv=R.arr[j];if(!lv)continue;
      if(L.isItem&&!APP[j])continue;
      let inc=0;const cl=CFL[j];for(let q=0;q<cl.length;q++)if(out[cl[q]])inc++;
      if(inc){cost+=inc;continue}
      const cur=out[j],fin=cur===lv?Math.min(lv+1,MAX[j]):Math.max(cur,lv);
      if(fin!==cur)changed=true;out[j]=fin;cost+=fin*MB[j];
    }
    return {cost,arr:out,changed,work:Math.max(L.work,R.work)+1};
  }
  // kinds: identical inputs grouped
  let kinds=[];const addKind=(arr,work,isItem,tag,n,chain)=>{const k=key(arr);let f=kinds.find(x=>!x.isItem&&!isItem&&x.k===k&&x.work===work&&x.tag===tag);if(f)f.count+=n;else{f={arr,k,work,isItem,tag,count:n,chains:[]};kinds.push(f)}if(chain)f.chains.push(chain);return f};
  if(item)kinds.push({arr:toArr(item.ench),k:key(toArr(item.ench)),work:item.work,isItem:true,tag:'item',count:1});
  const useless=[];
  spec.books.forEach(b=>{const useful=Object.keys(b.ench).some(k=>want[k]&&(!item||canTake(type,k)));
    if(useful)addKind(toArr(b.ench),b.work||0,false,b.tag||'new',b.count||1);else useless.push({ench:{...b.ench},work:b.work||0,tag:b.tag||'new',n:b.count||1})});
  const rawKinds=kinds.map(x=>({ench:toMap(x.arr),work:x.work,tag:x.tag,isItem:x.isItem,count:x.count}));
  kinds.forEach((x,i)=>{x.chains=Array.from({length:x.count},()=>({steps:[],leaves:[i]}))});
  const est=ks=>ks.reduce((p,x)=>p*(x.count+1)*(x.count+2)/2,1);
  // pre-merge identical low books when there are too many to search every order
  const pre=[];
  while(est(kinds)>budget){
    const cand=kinds.filter(x=>!x.isItem&&x.count>=2&&x.arr.filter(v=>v).length===1&&x.arr.some((v,j)=>v&&v<MAX[j]))
      .sort((a,b)=>Math.max(...a.arr)-Math.max(...b.arr)||b.count-a.count)[0];
    if(!cand)break;
    const one={arr:cand.arr,work:cand.work,isItem:false},r=merge(one,one);
    cand.count-=2;const c1=cand.chains.pop(),c2=cand.chains.pop();
    pre.push({left:{ench:toMap(cand.arr),work:cand.work,isItem:false,tag:cand.tag},right:{ench:toMap(cand.arr),work:cand.work,isItem:false,tag:cand.tag},cost:r.cost,res:{ench:toMap(r.arr),work:r.work,isItem:false},levelUp:ids.filter((k,j)=>cand.arr[j]),pre:true});
    addKind(r.arr,r.work,false,'combined',1,{steps:[...c1.steps,...c2.steps,pre.length-1],leaves:[...c1.leaves,...c2.leaves]});kinds=kinds.filter(x=>x.count>0);
  }
  const approx=est(kinds)>budget;
  function dp(ks,lim,beam){
    const R=ks.map(x=>x.count+1),MU=[];let N=1;R.forEach((r,i)=>{MU[i]=N;N*=r});
    const memo=new Array(N),VEC=new Array(N);
    const byTot=[];for(let s=0;s<N;s++){const v=R.map((r,i)=>Math.floor(s/MU[i])%r);VEC[s]=v;const t=v.reduce((a,b)=>a+b,0);(byTot[t]=byTot[t]||[]).push(s)}
    const vec=idx=>VEC[idx];
    ks.forEach((x,i)=>{memo[MU[i]]=[{arr:x.arr,work:x.work,isItem:x.isItem,cost:0,max:0,leaf:i}]});
    const hasItem=ks.length&&ks[0].isItem;
    for(let t=2;t<byTot.length;t++)for(const S of byTot[t]||[]){
      const s=VEC[S],groups=new Map();
      const a=new Array(ks.length).fill(0);
      while(true){
        let i=0;while(i<a.length&&a[i]===s[i]){a[i]=0;i++}
        if(i===a.length)break;a[i]++;
        let Ai=0,tot=0;for(let q=0;q<a.length;q++){Ai+=a[q]*MU[q];tot+=a[q]}
        if(tot===t)continue;
        if(hasItem&&s[0]===1&&a[0]===0)continue;
        const LA=memo[Ai],RB=memo[S-Ai];if(!LA||!RB)continue;
        for(const L of LA){const pl=PEN(L.work);for(const Rr of RB){
          if(Rr.isItem||pl+PEN(Rr.work)>lim)continue;
          const st=merge(L,Rr);if(!st.changed||st.cost>lim)continue;
          const cost=L.cost+Rr.cost+st.cost,mx=Math.max(L.max,Rr.max,st.cost),k=key(st.arr);
          let g=groups.get(k);if(!g){g=[];groups.set(k,g)}
          if(g.some(e=>e.work<=st.work&&e.cost<=cost))continue;
          for(let q=g.length-1;q>=0;q--)if(g[q].work>=st.work&&g[q].cost>=cost)g.splice(q,1);
          g.push({arr:st.arr,work:st.work,isItem:L.isItem,cost,max:mx,l:L,r:Rr,step:st.cost});
        }}
      }
      let all=[];groups.forEach(g=>all.push(...g));
      if(beam&&all.length>beam){all.sort((x,y)=>score(y)-score(x)||x.cost-y.cost||x.work-y.work);all=all.slice(0,beam)}
      if(all.length)memo[S]=all;
    }
    return {memo,N,vec,MU};
  }
  const WI=Object.entries(want).map(([k,v])=>[J[k],v]);
  const score=e=>WI.reduce((a,[j,v])=>a+Math.min(e.arr[j],v),0);
  const better=(x,y)=>{if(!y)return true;const a=score(x),b=score(y);if(a!==b)return a>b;if(x.cost!==y.cost)return x.cost<y.cost;if(x.work!==y.work)return x.work<y.work;return x.max<y.max};
  const D=dp(kinds,limit,approx?8:0);
  let best=null,bestS=0;
  for(let S=0;S<D.N;S++){const v=D.vec(S);if(item&&v[0]!==1)continue;(D.memo[S]||[]).forEach(e=>{if(better(e,best)){best=e;bestS=S}})}
  const label=e=>({ench:toMap(e.arr),work:e.work,isItem:e.isItem,tag:e.leaf!==undefined?kinds[e.leaf].tag:'combined'});
  const stepsOf=(e,ks)=>{const out=[];(function w(n){if(n.leaf!==undefined)return;w(n.l);w(n.r);
    const lu=ids.filter((k,j)=>n.r.arr[j]&&n.l.arr[j]===n.r.arr[j]&&n.l.arr[j]<MAX[j]&&(!n.l.isItem||APP[j]));
    out.push({left:label(n.l),right:label(n.r),cost:n.step,res:{ench:toMap(n.arr),work:n.work,isItem:n.isItem},levelUp:lu})})(e);return out};
  const result={approx,pre,ids};
  if(!best){result.none=true;return result}
  const used=D.vec(bestS);
  // only the pre-merges whose books are actually used, and count leftovers as the original books
  const preIdx=new Set(),leafUse=rawKinds.map(()=>0);
  kinds.forEach((x,i)=>{x.chains.slice(0,used[i]).forEach(c=>{c.steps.forEach(q=>preIdx.add(q));c.leaves.forEach(l=>leafUse[l]++)})});
  const preUsed=pre.filter((_,q)=>preIdx.has(q)),preCost=preUsed.reduce((a,x)=>a+x.cost,0);
  result.pre=preUsed;
  result.plan={cost:best.cost+preCost,work:best.work,max:Math.max(best.max,...preUsed.map(x=>x.cost),0),ench:toMap(best.arr),steps:[...preUsed,...stepsOf(best)]};
  result.missing=WI.filter(([j,v])=>best.arr[j]<v).map(([j,v])=>({id:ids[j],have:best.arr[j],want:v}));
  result.leftover=[...rawKinds.map((x,i)=>({ench:x.ench,work:x.work,tag:x.tag,isItem:x.isItem,n:x.count-leafUse[i]})).filter(x=>x.n>0&&!x.isItem),...useless];
  // "book first" comparison: same books, all merged into one book, then onto the item last
  const bookKinds=kinds.map((x,i)=>({...x,count:used[i]})).filter(x=>!x.isItem&&x.count>0);
  const nBooks=bookKinds.reduce((a,x)=>a+x.count,0);
  if(item&&nBooks>=2){
    const itemE={arr:kinds[0].arr,work:kinds[0].work,isItem:true};
    const pick=lim=>{const B=dp(bookKinds,lim,0),full=B.N-1;let bb=null;
      (B.memo[full]||[]).forEach(e=>{const f=merge(itemE,e),tot=e.cost+f.cost;if(f.cost<=lim&&(!bb||tot<bb.tot))bb={e,f,tot}});return bb};
    let bf=pick(limit);
    if(bf)result.bookFirst={ok:true,cost:bf.tot+preCost,finalCost:bf.f.cost};
    else{
      bf=pick(1e9);
      if(bf){const st=stepsOf(bf.e).map(s=>s.cost);st.push(bf.f.cost);const idx=st.findIndex(c=>c>limit);
        result.bookFirst={ok:false,overStep:idx+1+preUsed.length,overCost:st[idx],steps:st.length+preUsed.length,finalCost:bf.f.cost,bookValue:bf.f.cost-PEN(bf.e.work)-PEN(kinds[0].work),bookPenalty:PEN(bf.e.work)}}
    }
  }
  return result;
}
/* How many of each book level you'd need; finds the cheapest single extra book when the max can't be reached */
function reachLevel(counts,max){const c=counts.slice();for(let l=1;l<max;l++){c[l+1]=(c[l+1]||0)+Math.floor((c[l]||0)/2)}let top=0;for(let l=1;l<=max;l++)if(c[l])top=l;return top}
function inventoryCheck(id,target,stacks){
  const max=EBY[id].max,counts=new Array(max+2).fill(0);stacks.forEach(([l,n])=>{counts[l]+=n});
  const top=reachLevel(counts,max);
  const res={id,target,top};
  if(top<target){for(let l=1;l<=target;l++){const c=counts.slice();c[l]++;if(reachLevel(c,max)>=target){res.need=l;break}}}
  // books that can never pair up (odd one out below the level you end with)
  const c=counts.slice(),waste=[];for(let l=1;l<max;l++){const odd=c[l]%2;c[l+1]+=Math.floor(c[l]/2);if(odd&&l<top)waste.push(l)}
  res.waste=waste;return res;
}
function anvilStep(type,L,R){ // L,R: {ench,work,isItem}
  const ids=[...new Set([...Object.keys(L.ench),...Object.keys(R.ench)])];let cost=PEN(L.work||0)+PEN(R.work||0);const out={...L.ench};
  for(const [k,lv] of Object.entries(R.ench)){if(L.isItem&&!canTake(type,k))continue;const inc=Object.keys(out).filter(o=>out[o]&&conflicts(o,k)).length;if(inc){cost+=inc;continue}
    const cur=out[k]||0,fin=cur===lv?Math.min(lv+1,EBY[k].max):Math.max(cur,lv);out[k]=fin;cost+=fin*(R.isItem?EBY[k].mi:EBY[k].mb)}
  return {cost,ench:out}}
if(typeof module!=='undefined')module.exports={anvilSolve,inventoryCheck,anvilStep};
