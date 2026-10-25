(function(){
  var D = window.MONEYLINE, R = D.revenue;
  function money(n){return '$'+n.toLocaleString('en-CA')}
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
  function boot(){
    var top=el('div','ml-top');
    var pct=Math.min(100,R.monthToDate/R.goalMonthly*100);
    top.innerHTML='<div class="ml-title">MONEYLINE <span>BOT FACTORY</span></div>'+
      '<div class="ml-rev"><div><b>'+money(R.monthToDate)+'</b><small>'+R.month+' '+R.currency+'</small></div>'+
      '<div><b>'+money(R.lifetime)+'</b><small>Lifetime '+R.currency+'</small></div>'+
      '<div><b>'+money(R.goalMonthly)+'</b><small>Monthly goal</small></div></div>'+
      '<div class="ml-bar"><i style="width:'+Math.max(pct,0.6)+'%"></i></div>'+
      '<div class="ml-ms">First milestone: '+R.milestone+' · '+pct.toFixed(1)+'% of $10K</div>';
    document.body.appendChild(top);
    var tick=el('div','ml-tick','<em>SIMULATED FEED</em><div class="ml-tt"><span>'+D.ticker.join(' &nbsp;•&nbsp; ')+' &nbsp;•&nbsp; '+D.ticker.join(' &nbsp;•&nbsp; ')+'</span></div>');
    document.body.appendChild(tick);
    var sheet=el('div','ml-sheet');
    var list=el('div','ml-list');
    D.bots.forEach(function(b){var c=el('button','ml-chip '+b.tier+(b.blocked?' blocked':'')+(b.paused?' paused':''),b.name);c.onclick=function(){show(b);window.dispatchEvent(new MessageEvent('message',{data:{type:'agentSelected',id:D.bots.indexOf(b)+1}}))};list.appendChild(c)});
    var det=el('div','ml-det','<i>Tap a bot for role, status &amp; next action</i>');
    sheet.appendChild(det);sheet.appendChild(list);
    sheet.appendChild(el('div','ml-cred','Engine &amp; art: <a href="https://github.com/pablodelucca/pixel-agents">Pixel Agents</a> (MIT) — see CREDITS.txt. Per-bot revenue: '+R.perBot+'. Characters walk/type as decoration; only the revenue panel is real.'));
    document.body.appendChild(sheet);
    function show(b){det.innerHTML='<b>'+b.name+'</b> <span class="ml-st'+(b.blocked?' bad':b.paused?' warn':'')+'">'+b.status+'</span><div>Role: '+b.role+'</div><div>Next: '+b.next+'</div><div>Revenue: '+R.perBot+'</div>'}
  }
  function spawn(){
    function send(d){window.dispatchEvent(new MessageEvent('message',{data:d}))}
    D.bots.forEach(function(b,i){
      send({type:'agentCreated',id:i+1,directoryName:b.name,palette:i%6,hueShift:(i*47)%360});
    });
    var n=0;
    setInterval(function(){ // SIMULATED activity cycling
      D.bots.forEach(function(b,i){
        if(b.blocked||b.paused){send({type:'agentStatus',id:i+1,status:'waiting',awaitingInput:true});return}
        if((i+n)%3===0){send({type:'agentToolsClear',id:i+1});send({type:'agentToolStart',id:i+1,toolId:'t'+n+'_'+i,status:D.sim[(i+n)%D.sim.length]+' (sim)',toolName:'Read'});send({type:'agentStatus',id:i+1,status:'active'})}
        else if((i+n)%3===1){send({type:'agentToolDone',id:i+1,toolId:'t'+(n-1)+'_'+i});send({type:'agentStatus',id:i+1,status:'waiting'})}
      });n++;
    },3500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('moneyline-ready',function(){setTimeout(spawn,300)});
})();
