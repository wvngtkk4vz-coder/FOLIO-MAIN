// ---------- world, lore, canon ----------
let _entRe=null;
const FAME_PRESET={unknown:250,rising:6000,established:90000,bestseller:650000,phenomenon:8000000};
const REP_PRESET={beloved:{rep:82,critic:62,controv:6,trust:82,loyalty:78},respected:{rep:70,critic:78,controv:10,trust:70,loyalty:60},unknown:{rep:50,critic:50,controv:8,trust:55,loyalty:40},polarizing:{rep:48,critic:48,controv:42,trust:48,loyalty:58},controversial:{rep:38,critic:42,controv:62,trust:35,loyalty:52}};
const famFromFollowers=f=>clamp((Math.log10(Math.max(f,10))-2.2)*21,1,100);
const TITLES=/^(captain|lady|lord|king|queen|sir|dr|prince|princess|master|dame|general|duke|duchess|saint|mother|father)$/i;
function shortOf(name){const p=name.split(/\s+/);if(/^the$/i.test(p[0]))return 'the '+p.slice(1).join(' ');if(p.length===1)return name;if(TITLES.test(p[0]))return p[1];return p[0]}
function addEnt(o){
  const nm=String(o.name||'').trim();if(!nm)return null;
  const lc=nm.toLowerCase();const ex=Object.values(S.ents).find(e=>e.name.toLowerCase()===lc||(e.type===(o.type||'character')&&(e.short.toLowerCase()===lc||(e.type==='character'&&e.name.toLowerCase().split(/\s+/).includes(lc)))));
  if(ex){if(o.role&&ex.role==='minor')ex.role=o.role;return ex}
  const e={id:uid('e'),name:nm,short:o.short||(o.type==='character'?shortOf(nm):nm),type:o.type||'character',book:o.book||null,role:o.role||'supporting',desc:o.desc||'',gen:!!o.gen,known:o.known==null?1:o.known,pop:o.pop==null?R.f()*.6+.1:o.pop,love:o.love==null?R.g()*.6:o.love,mentions:0};
  if(e.role==='protagonist'||e.role==='antagonist')e.pop=.85+R.f()*.15;
  S.ents[e.id]=e;_entRe=null;return e}
function entList(type){const a=Object.values(S.ents);return type?a.filter(e=>e.type===type):a}
function entByName(n){n=String(n||'').toLowerCase();return Object.values(S.ents).find(e=>e.name.toLowerCase()===n||e.short.toLowerCase()===n)}
function buildEntRe(){
  _entRe=Object.values(S.ents).map(e=>{const names=uniq([e.name,e.short].filter(x=>x&&x.length>=3));return {id:e.id,re:new RegExp('(^|[^a-z0-9])('+names.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![a-z0-9])','i')}})}
function findEnts(text){if(!_entRe)buildEntRe();const t=String(text||'');return _entRe.filter(x=>x.re.test(t)).map(x=>x.id)}
function genName(type,genre){
  const k=GENRE_KEY(genre);let n='',tries=0;
  do{
    if(type==='character'){n=k==='modern'?R.pick(SYL.modern.a)+' '+R.pick(LAST):cap1(R.pick(SYL[k].a)+R.pick(SYL[k].b));if(R.chance(.35)&&k!=='modern')n+=' '+cap1(R.pick(SYL[k].a)+R.pick(SYL[k].b))}
    else if(type==='place')n=k==='scifi'?cap1(R.pick(SYL.scifi.a)+R.pick(SYL.scifi.b))+' '+R.pick(['Station','Belt','Array','Outpost','Reach']):R.pick(PL_A)+' '+R.pick(PL_B);
    else if(type==='faction')n='The '+R.pick(PL_A)+' '+R.pick(FAC_B);
    else n='the '+R.pick(PL_A)+' '+R.pick(OBJ_B);
    tries++;
  }while(entByName(n)&&tries<20);
  return n}
function parseNames(s){return csv(s).map(x=>x.replace(/\(.*?\)/g,'').split(/\s[-—–|]\s|:/)[0].trim()).filter(Boolean)}
function tokSet(t){return uniq(sigWords(t).map(w=>w.replace(/'s$/,'')))}
function overlap(a,b){const A=tokSet(a),B=tokSet(b);if(!A.length||!B.length)return 0;const s=new Set(B);const n=A.filter(x=>s.has(x)).length;return n/Math.min(A.length,B.length)}
function addBook(b,status,num){
  const id=uid('b');
  const bk={id,num,title:b.title||'Untitled',genre:b.genre||S.author.genre,desc:b.desc||'',status,relHour:status==='upcoming'?(b.releaseDays?S.hour+b.releaseDays*24:null):(b.agoDays!=null?S.hour-b.agoDays*24:S.hour-24*365*Math.max(1,(S.books.length+1)))
   ,setting:b.setting||'',magic:b.magic||'',ending:b.ending||'',timeline:lines(b.timeline),events:lines(b.events),quotes:lines(b.quotes),rel:lines(b.rel),sales:0,hype:status==='upcoming'?20:0,rating:3.6+R.f()*1.1,chars:[],places:[],factions:[]};
  S.books.push(bk);
  const add=(names,type,role)=>names.forEach(n=>{const e=addEnt({name:n,type,book:id,role,known:status==='published'?1:.35,pop:R.f()*.7});if(e){const k=type==='character'?'chars':type==='place'?'places':'factions';if(!bk[k].includes(e.id))bk[k].push(e.id)}});
  add(parseNames(b.characters),'character','supporting');
  parseNames(b.protagonist).slice(0,1).forEach(n=>{const e=addEnt({name:n,type:'character',book:id,role:'protagonist'});e.role='protagonist';e.pop=.95;if(!bk.chars.includes(e.id))bk.chars.push(e.id);bk.protag=e.id});
  parseNames(b.antagonist).slice(0,1).forEach(n=>{const e=addEnt({name:n,type:'character',book:id,role:'antagonist'});e.role='antagonist';e.pop=.9;e.love=-.35;if(!bk.chars.includes(e.id))bk.chars.push(e.id);bk.antag=e.id});
  add(parseNames(b.locations),'place','supporting');
  add(parseNames(b.factions),'faction','supporting');
  lines(b.secrets).forEach(t=>S.secrets.push({id:uid('s'),text:t,toks:tokSet(t),book:id,leaked:false,leakedHour:null}));
  lines(b.mysteries).forEach(t=>S.mysteries.push({id:uid('m'),text:t,toks:tokSet(t),book:id,solved:false,gen:false}));
  S.timeline.push(...bk.timeline,...bk.events);
  lines(b.rel).forEach(l=>{const m=l.match(/^(.+?)\s*[+&x×/]\s*(.+?)\s*(?::\s*(.*))?$/);if(m){const a=addEnt({name:m[1].trim(),type:'character',book:id}),c=addEnt({name:m[2].trim(),type:'character',book:id});if(a&&c)S.ships.push({a:a.id,b:c.id,kind:m[3]||'bond'})}});
  _entRe=null;return bk}
function expandLore(k){
  k=k||4;const out=[];const g=S.author.genre;
  for(let i=0;i<k;i++){
    const r=R.f();let e;
    if(r<.38){e=addEnt({name:genName('character',g),type:'character',role:'minor',gen:true,known:.25,pop:R.f()*.5});out.push('New character: '+e.name)}
    else if(r<.6){e=addEnt({name:genName('place',g),type:'place',gen:true,known:.3});out.push('New place: '+e.name)}
    else if(r<.76){e=addEnt({name:genName('faction',g),type:'faction',gen:true,known:.3});out.push('New faction: '+e.name)}
    else if(r<.88){e=addEnt({name:genName('object',g),type:'object',gen:true,known:.3});out.push('New object: '+e.name)}
    else{const c=R.pick(entList('character').filter(x=>!x.gen)||[])||null;const p=R.pick(entList('place'));
      const opts=['who the '+R.pick(MASK)+' really is','what happened to '+(p?p.name:'the old capital'),'why '+(c?c.short:'the heir')+' survived the Collapse','who wrote the unsigned letter in chapter '+R.i(5,60)];
      const t=R.pick(opts);S.mysteries.push({id:uid('m'),text:t,toks:tokSet(t),book:null,solved:false,gen:true});out.push('New mystery: '+t)}
  }
  if(R.chance(.5)){const q=R.pick(QUIRKS);const f=R.pick(entList('faction')),p=R.pick(entList('place')),o=R.pick(entList('object'));
    const t=q.replace('{F}',f?f.name:'the court').replace('{P}',p?p.name:'the capital').replace('{O}',o?o.name:'the crown');
    if(!S.quirks.includes(t)){S.quirks.push(t);out.push('New detail fans noticed: '+t)}}
  if(R.chance(.5)){const ev=R.pick(['The Night of Bells','The Salt Treaty','The Siege of '+(R.pick(entList('place'))||{name:'the Reach'}).name,'The Fall of '+(R.pick(entList('faction'))||{name:'the Court'}).name]);if(!S.timeline.includes(ev)){S.timeline.push(ev);out.push('New timeline event: '+ev)}}
  _entRe=null;return out}
// ---------- canon ----------
function canonAdd(o){
  const ex=S.canon.find(c=>overlap(c.text,o.text)>=.85);
  if(ex){ex.status=o.status;ex.hour=S.hour;ex.src=o.src||ex.src;return ex}
  const c={id:uid('c'),text:o.text,status:o.status||'true',ents:o.ents||findEnts(o.text),src:o.src||'author',hour:S.hour};S.canon.push(c);return c}
function canonMatch(text,status){return S.canon.find(c=>(!status||c.status===status)&&overlap(c.text,text)>=.66)}
function secretMatch(text){let best=null,bs=0;S.secrets.forEach(s=>{if(s.leaked)return;const o=overlap(text,s.text);if(o>bs){bs=o;best=s}});return bs>=.66?{s:best,score:bs}:(bs>=.5?{s:best,score:bs,close:true}:null)}
function canonLines(entId){return S.canon.filter(c=>c.ents.includes(entId)&&c.status!=='secret')}
// ---------- claims ----------
function makeClaim(x){
  // x: {C,C2,P,F,O,M} as strings -> returns claim string
  const sec=S.secrets.filter(s=>!s.leaked);
  const reveals=S.revealCount||0;
  const pTrue=clamp(.03+S.stats.loreEng/100*.08+Math.min(reveals,8)*.012,0,.22);
  let tries=0,txt;
  while(tries++<8){
    if(sec.length&&R.chance(pTrue)){txt=R.pick(sec).text.replace(/^the /i,'the ')}
    else{const o=[`${x.C} is secretly ${x.C2}`,`${x.C} is still alive`,`${x.C} betrayed ${x.C2}`,`${x.F} has been manipulating ${x.C}`,`the ${x.P} was built by ${x.F}`,`${x.C2} is ${x.C}'s sibling`,`${x.C} knew about ${x.P} from the start`,`${x.M} is ${x.C}`,`the narrator is unreliable`,`${x.O} is the source of ${x.C}'s power`,`${x.C} is working for ${x.F}`,`${x.F} is older than the Collapse`,`${x.C2} was never really dead`,`${x.P} is not where we think it is`];txt=R.pick(o)}
    txt=txt.replace(/^the the /i,'the ').replace(/\bthe the\b/gi,'the');
    const den=canonMatch(txt,'false'),con=canonMatch(txt,'true');
    if(!den&&!con)break;
    if(den&&R.chance(.12))break;}
  return txt}
function saveWorld(){
  if(!S)return false;
  try{
    const imgs=S.imgs||{};const copy=Object.assign({},S);delete copy.imgs;
    let keep=pruneForSave(copy);
    const js=JSON.stringify(keep);
    localStorage.setItem('folio_world_v1',js);
    try{localStorage.setItem('folio_imgs_v1',JSON.stringify(imgs))}catch(e){}
    return true}catch(e){return false}}
function pruneForSave(c){
  const o=Object.assign({},c);
  o.posts=c.posts.filter(p=>p.by==='me'||(S.hour-p.hour)<96||p.pinned).slice(0,260).map(p=>{if(p.by!=='me'&&S.hour-p.hour>48&&p.comments.length>10){const q=Object.assign({},p);q.comments=p.comments.filter(x=>x.by==='me'||x.pinned||x.parent===null).slice(0,12);return q}return p});
  const keep=new Set();
  o.posts.forEach(p=>{keep.add(p.by);p.comments.forEach(x=>keep.add(x.by))});
  o.threads.forEach(t=>keep.add(t.pid));o.notifs.forEach(n=>n.pid&&keep.add(n.pid));o.theories.forEach(t=>keep.add(t.by));(o.followingIds||[]).forEach(i=>keep.add(i));
  const ppl={};let extra=0;
  Object.values(c.people).sort((a,b)=>(b.obs||0)-(a.obs||0)).forEach(p=>{if(keep.has(p.id)||p.hist.length||p.reg||extra<500){ppl[p.id]=p;if(!keep.has(p.id)&&!p.hist.length&&!p.reg)extra++}});
  o.people=ppl;o.mem={hashes:(c.mem.hashes||[]).slice(-12000),recent:(c.mem.recent||[]).slice(-260),tpl:(c.mem.tpl||[]).slice(-120),intents:(c.mem.intents||[]).slice(-40),emo:(c.mem.emo||[]).slice(-60),opens:(c.mem.opens||[]).slice(-90)};
  o.mentLog=(c.mentLog||[]).slice(-1500);o.events=(c.events||[]).slice(-120);o.news=(c.news||[]).slice(-60);o.notifs=(c.notifs||[]).slice(0,120);
  return o}
function loadWorld(){
  try{const js=localStorage.getItem('folio_world_v1');if(!js)return false;S=JSON.parse(js);_hs=null;try{S.imgs=JSON.parse(localStorage.getItem('folio_imgs_v1')||'{}')}catch(e){S.imgs={}}_entRe=null;return true}catch(e){return false}}
function resetWorld(){try{localStorage.removeItem('folio_world_v1');localStorage.removeItem('folio_imgs_v1')}catch(e){}}
