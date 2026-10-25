// MoneyLine Bot Factory — FALLBACK data only (used if status.json can't load). Live data: /status.json. Real figures only.
window.MONEYLINE = {
  revenue: { currency: 'CAD', lifetime: 20, month: 'Oct 2026', monthToDate: 0, goalMonthly: 10000,
    milestone: 'Cover monthly bills', perBot: '$0 / not yet tracked',
    note: 'Lifetime $20 = 2 Johnny videos (Sep 2026). Source: tracker.csv' },
  bots: [
    { id:'moneyline', name:'MoneyLine', tier:'hq', role:'HQ hub — tracks revenue and goals', status:'Online', next:'Log first October sale' },
    { id:'grok', name:'Grok Bot', tier:'core', role:'Router — sends work to the right bot', status:'Online', next:'Route new requests' },
    { id:'jarvis', name:'Jarvis', tier:'core', role:'Manages the bots', status:'Online', next:'Check bot health' },
    { id:'decks', name:'Deadly Decks', tier:'main', role:'Deck offers', status:'Spring offer ready (0 leads)', next:'Get first leads' },
    { id:'halo', name:'Halo Studio Setter', tier:'main', role:'Appointment setting for Halo Studio', status:'BLOCKED — waiting on Darren account auth', next:'Darren grants access', blocked:true },
    { id:'story', name:'Storyboard', tier:'main', role:'Storyboards', status:'Idle', next:'Await brief' },
    { id:'pi', name:'Private Eye', tier:'main', role:'Research / investigations', status:'Idle', next:'Await case' },
    { id:'pibc', name:'Private Eye BC', tier:'main', role:'BC research', status:'Idle', next:'Await case' },
    { id:'flowers', name:'Flower Boxes', tier:'main', role:'Flower box business', status:'Idle', next:'Plan next listing' },
    { id:'bottle', name:'Bottle Shop', tier:'main', role:'Bottle shop', status:'Idle', next:'Plan next listing' },
    { id:'fiverr', name:'Fiverr Fulfillment', tier:'main', role:'Fulfils Fiverr orders', status:'Idle', next:'Wait for order' },
    { id:'web', name:'Website Builder', tier:'main', role:'Builds websites', status:'Idle', next:'Await client' },
    { id:'song', name:'Song Generator', tier:'small', role:'Songs', status:'Idle', next:'—' },
    { id:'soft', name:'Software Builder', tier:'small', role:'Software', status:'Idle', next:'—' },
    { id:'mcp', name:'Model MCP', tier:'small', role:'MCP tooling', status:'Idle', next:'—' },
    { id:'mkt', name:'Marketing Campaign', tier:'small', role:'Marketing', status:'PAUSED', next:'Resume when ready', paused:true },
    { id:'game', name:'Game Guide', tier:'small', role:'Game guides', status:'Idle', next:'—' },
    { id:'karaoke', name:'Karaoke Bot', tier:'small', role:'Karaoke', status:'Idle', next:'—' },
    { id:'movie', name:'Movie Night', tier:'small', role:'Movie picks', status:'Idle', next:'—' },
    { id:'mileage', name:'Mileage Calculator', tier:'small', role:'Mileage', status:'Idle', next:'—' },
    { id:'pep', name:'Pep Talk', tier:'small', role:'Pep talks', status:'Idle', next:'—' }
  ]
};
