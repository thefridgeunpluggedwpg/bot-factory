(function(){
  // Live status: reads ./status.json (updated by bots via office-status script). Falls back to data.js.
  var D = window.MONEYLINE, R = D.revenue, POLL = 60000;
  var S = null, stale = false, lastOk = null;
  var NT = '<i class="ml-nt">not yet tracked</i>';
  function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function money(n){return (n==null||isNaN(n))?NT:'$'+Number(n).toLocaleString('en-CA')}
  function when(t){if(!t)return NT;var d=new Date(t);return isNaN(d)?esc(t):d.toLocaleString('en-CA',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
  function fallback(){return {updatedAt:null,money:{currency:R.currency,lifetimeCAD:R.lifetime,monthLabel:R.month,monthCAD:R.monthToDate,goalMonthlyCAD:R.goalMonthly,milestones:[{name:R.milestone}]},
    bots:D.bots.map(function(b){return {id:b.id,name:b.name,status:b.status,currentTask:b.next,lastActive:null}}),events:[]}}
  function bot(b){var s=S&&S.bots&&S.bots.filter(function(x){return x.id===b.id||x.name===b.name})[0];return s||{}}
  function kind(st){st=String(st||'').toLowerCase();return /block/.test(st)?'bad':/pause/.test(st)?'warn':''}
  var top,feed,det,list,sel=null;
  function render(){
    var M=S.money||{}, cur=M.currency||'CAD', g=M.goalMonthlyCAD, m=M.monthCAD;
    var pct=(g>0&&m!=null)?Math.min(100,m/g*100):null, ms=(M.milestones&&M.milestones[0])||{};
    top.innerHTML='<div class="ml-title">MONEYLINE <span>BOT FACTORY</span></div>'+
      '<div class="ml-rev"><div><b>'+money(m)+'</b><small>'+esc(M.monthLabel||M.month||'This month')+' '+cur+'</small></div>'+
      '<div><b>'+money(M.lifetimeCAD)+'</b><small>Lifetime '+cur+'</small></div>'+
      '<div><b>'+money(g)+'</b><small>Monthly goal</small></div></div>'+
      '<div class="ml-bar"><i style="width:'+Math.max(pct||0,0.6)+'%"></i></div>'+
      '<div class="ml-ms">First milestone: '+(ms.name?esc(ms.name):NT)+(pct!=null?' · '+pct.toFixed(1)+'% of goal':'')+'</div>'+
      '<div class="ml-upd'+(stale?' stale':'')+'">'+(S._fallback?'Live status unavailable — showing built-in figures':'Last updated: '+when(S.updatedAt))+(stale&&!S._fallback?' · ⚠ offline/stale, retrying':'')+'</div>';
    var ev=(S.events||[]).slice(-100).reverse();
    feed.innerHTML='<em>LIVE FEED</em><div class="ml-tt">'+(ev.length?ev.map(function(e){return '<span class="ml-ev">'+when(e.ts)+' · <b>'+esc(e.bot||'')+'</b> '+esc(e.text||'')+'</span>'}).join(''):'<span class="ml-ev">No events yet</span>')+'</div>';
    list.querySelectorAll('.ml-chip').forEach(function(c,i){var b=D.bots[i],k=kind(bot(b).status||b.status);c.className='ml-chip '+b.tier+(k=='bad'?' blocked':k=='warn'?' paused':'')});
    if(sel)show(sel);
  }
  function show(b){sel=b;var s=bot(b),st=s.status||b.status;
    det.innerHTML='<b>'+esc(b.name)+'</b> <span class="ml-st '+kind(st)+'">'+esc(st)+'</span><div>Role: '+esc(b.role)+'</div><div>Now: '+(s.currentTask?esc(s.currentTask):NT)+'</div><div>Last active: '+when(s.lastActive)+'</div><div>Revenue: '+NT+'</div>'}
  function send(d){window.dispatchEvent(new MessageEvent('message',{data:d}))}
  var spawned=false;
  function anim(){if(!spawned)return;D.bots.forEach(function(b,i){var st=String(bot(b).status||b.status).toLowerCase();
    send({type:'agentStatus',id:i+1,status:/work|active|busy|running/.test(st)?'active':'waiting',awaitingInput:/block|pause/.test(st)})})}
  function load(){
    return fetch('./status.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw r.status;return r.json()})
      .then(function(j){S=j;stale=false;lastOk=Date.now();render();anim()})
      .catch(function(){stale=true;if(!S){S=fallback();S._fallback=true}render()});
  }
  window.__mlReload=load;
  function boot(){
    top=el('div','ml-top');document.body.appendChild(top);
    feed=el('div','ml-tick');document.body.appendChild(feed);
    var sheet=el('div','ml-sheet');list=el('div','ml-list');
    D.bots.forEach(function(b,i){var c=el('button','ml-chip '+b.tier,esc(b.name));c.onclick=function(){show(b);send({type:'agentSelected',id:i+1})};list.appendChild(c)});
    det=el('div','ml-det','<i>Tap a bot for role, status &amp; current task</i>');
    sheet.appendChild(det);sheet.appendChild(list);
    sheet.appendChild(el('div','ml-cred','Engine &amp; art: <a href="https://github.com/pablodelucca/pixel-agents">Pixel Agents</a> (MIT) — see CREDITS.txt. Characters are decorative; figures, statuses &amp; feed come from status.json.'));
    document.body.appendChild(sheet);
    load();setInterval(load,POLL);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)load()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('moneyline-ready',function(){setTimeout(function(){
    D.bots.forEach(function(b,i){send({type:'agentCreated',id:i+1,directoryName:b.name,palette:i%6,hueShift:(i*47)%360})});spawned=true;anim()},300)});
  if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){})});
})();
