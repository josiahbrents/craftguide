const CACHE='guide-v12';
const FILES=['./','index.html','style.css','fonts/mojangles.woff','fonts/atkinson-400.woff2','fonts/atkinson-700.woff2','data.js','textures.js','app.js','ench_data.js','ench.js','tabs_data.js','trims_data.js','tabs_brew_trade.js','tabs_more.js','banner_data.js','tabs_banner.js','links.js','tabs_shell.js','anvil_core.js','planner_worker.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
// a new version downloads every file fresh, then waits until the page asks it to take over (the Reload button)
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
// saved copy first, so the app opens instantly even with no signal; anything not saved comes from the network
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>e.request.mode==='navigate'?c.match('index.html'):Response.error()))));
});
