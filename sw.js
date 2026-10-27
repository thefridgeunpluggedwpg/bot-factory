// Bot Factory service worker. status.json, bots.json, config.json and messages/ are NETWORK-ONLY (never cached).
const CACHE='bot-factory-v6';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./factory/overlay.js','./factory/factory.css','./factory/board.js','./factory/messages.js']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(/\/(status|bots|config)\.json$/.test(u.pathname)||u.pathname.indexOf('/messages/')>=0){e.respondWith(fetch(e.request,{cache:'no-store'}));return}
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
