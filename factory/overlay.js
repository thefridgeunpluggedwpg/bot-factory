(function(){
  // Bot Factory overlay. Roster: ./bots.json (edit to add your bots). Live status: ./status.json (polled every 60 s).
  var POLL=60000, D={title:'Bot Factory',bots:[]}, S=null, stale=false;
  var NT='<i class="ml-nt">not yet tracked</i>';
  function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function when(t){if(!t)return NT;var d=new Date(t);return isNaN(d)?esc(t):d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
  function bot(b){var s=S&&S.bots&&S.bots.filter(function(x){return x.id===b.id||x.name===b.name})[0];return s||{}}
  function kind(st){st=String(st||'').toLowerCase();return /block/.test(st)?'bad':/pause|not connected/.test(st)?'warn':''}
  var top,feed,det,list,sel=null;
  function render(){
    var n=D.bots.length,on=0,bad=0;D.bots.forEach(function(b){var st=String(bot(b).status||'').toLowerCase();if(/online|work|active|busy|running/.test(st))on++;if(/block/.test(st))bad++});
    var t=esc(D.title||'Bot Factory').split(' ');
    top.innerHTML='<div class="ml-title">'+t[0].toUpperCase()+' <span>'+t.slice(1).join(' ').toUpperCase()+'</span></div>'+
      '<div class="ml-rev"><div><b>'+n+'</b><small>Bots</small></div><div><b>'+on+'</b><small>Online / working</small></div><div><b>'+bad+'</b><small>Blocked</small></div></div>'+
      '<div class="ml-upd'+(stale?' stale':'')+'">'+(!S||S._fallback?'Live status unavailable':'Last updated: '+when(S.updatedAt))+(stale&&S&&!S._fallback?' · ⚠ offline/stale, retrying':'')+'</div>';
    var ev=((S&&S.events)||[]).slice(-100).reverse();
    feed.innerHTML='<em>LIVE FEED</em><div class="ml-tt">'+(ev.length?ev.map(function(e){return '<span class="ml-ev">'+when(e.ts)+' · <b>'+esc(e.bot||'')+'</b> '+esc(e.text||'')+'</span>'}).join(''):'<span class="ml-ev">No events yet</span>')+'</div>';
    list.querySelectorAll('.ml-chip').forEach(function(c,i){var b=D.bots[i],k=kind(bot(b).status);c.className='ml-chip '+(b.tier||'small')+(k=='bad'?' blocked':k=='warn'?' paused':'')});
    if(sel)show(sel);
  }
  function show(b){sel=b;var s=bot(b),st=s.status||'Unknown';
    det.innerHTML='<b>'+esc(b.name)+'</b> <span class="ml-st '+kind(st)+'">'+esc(st)+'</span><div>Role: '+esc(b.role||'')+'</div><div>Now: '+(s.currentTask?esc(s.currentTask):NT)+'</div><div>Last active: '+when(s.lastActive)+'</div>'+(b.link&&/^https:\/\//.test(b.link)?'<div><a href="'+esc(b.link)+'" target="_blank" rel="noopener">Open</a></div>':'')}
  function send(d){window.dispatchEvent(new MessageEvent('message',{data:d}))}
  var ready=false,spawned=false;
  function spawn(){if(spawned||!ready||!D.bots.length)return;spawned=true;
    D.bots.forEach(function(b,i){send({type:'agentCreated',id:i+1,directoryName:b.name,palette:i%6,hueShift:(i*47)%360})});anim()}
  function anim(){if(!spawned)return;D.bots.forEach(function(b,i){var st=String(bot(b).status||'').toLowerCase();
    send({type:'agentStatus',id:i+1,status:/work|active|busy|running/.test(st)?'active':'waiting',awaitingInput:/block|pause/.test(st)})})}
  function load(){
    return fetch('./status.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw r.status;return r.json()})
      .then(function(j){S=j;stale=false;render();anim()})
      .catch(function(){stale=true;if(!S)S={_fallback:true,bots:[],events:[]};render()});
  }
  window.__bfReload=load;
  function chips(){list.innerHTML='';D.bots.forEach(function(b,i){var c=el('button','ml-chip '+(b.tier||'small'),esc(b.name));c.onclick=function(){show(b);send({type:'agentSelected',id:i+1})};list.appendChild(c)})}
  function boot(){
    top=el('div','ml-top');document.body.appendChild(top);
    feed=el('div','ml-tick');document.body.appendChild(feed);
    var sheet=el('div','ml-sheet');list=el('div','ml-list');
    det=el('div','ml-det','<i>Tap a bot for role, status &amp; current task</i>');
    sheet.appendChild(det);sheet.appendChild(list);
    sheet.appendChild(el('div','ml-cred','Open-source <a href="https://github.com/thefridgeunpluggedwpg/bot-factory">Bot Factory</a> (MIT). Engine &amp; art: <a href="https://github.com/pablodelucca/pixel-agents">Pixel Agents</a> (MIT). Characters are decorative; statuses &amp; feed come from status.json.'));
    document.body.appendChild(sheet);
    fetch('./bots.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){D=j;if(j.title)document.title=j.title}).catch(function(){})
      .then(function(){chips();spawn();return load()});
    setInterval(load,POLL);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)load()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('factory-ready',function(){setTimeout(function(){ready=true;spawn()},300)});
  if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){})});
})();
