// ---------- simulation core ----------
const QUEUE=[];
function schedule(fn,delay,direct){QUEUE.push({at:Date.now()+delay,fn,direct:!!direct})}
function touch(){if(typeof uiTouch==='function')uiTouch()}
function notify(n){n.id=uid('n');n.hour=S.hour;n.read=false;S.notifs.unshift(n);if(S.notifs.length>220)S.notifs.length=220;touch()}
function logEvent(text,rare){S.events.push({h:S.hour,text,rare:!!rare});if(S.events.length>200)S.events.splice(0,40);touch()}
function poisson(l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L&&k<20);return k-1}
function authorShort(){const t=(S.author.pen||S.author.name).split(/\s+/).filter(Boolean);const f=(t[0]||'').replace(/\./g,'');return f.length<=2&&t.length>1?t[t.length-1]:(f||'the author')}
function authorDisplay(){return S.author.pen||S.author.name}
function genBookTitle(){return R.pick(['The ','','A '])+R.pick(PL_A)+' '+R.pick(R.chance(.5)?OBJ_B:PL_B)}
const COLORS=['#0a7c78','#7a3b2e','#2d3a6b','#5b2a6b','#8a5a14','#1f5f3a','#6b1f3a','#244b5a'];
function bgFor(seed){const h=hash(seed)%360;return `linear-gradient(145deg,hsl(${h} 45% 26%),hsl(${(h+40)%360} 50% 14%))`}
function hashtagFor(name){return '#'+name.replace(/^the\s+/i,'').replace(/[^a-z0-9]/gi,'')}
function tagsFromText(t){return (t.match(/#[A-Za-z0-9_]+/g)||[])}
// ---------- world creation ----------
function newWorld(cfg){
  const a=cfg.author;
  S={v:1,nid:1,hour:0,t0:Date.now(),author:Object.assign({},a),books:[],ents:{},canon:[],secrets:[],mysteries:[],quirks:[],timeline:[],ships:[],theories:[],rumours:[],
   stats:{},followers:Math.max(1,a.followers|0),followingIds:[],people:{},pids:[],handles:{},specials:null,posts:[],stories:[],threads:[],notifs:[],news:[],events:[],controversies:[],statements:[],teasers:[],
   highlights:[],mem:{hashes:[],recent:[],tpl:[],intents:[],emo:[],opens:[]},mentLog:[],imgs:{},speed:'normal',paused:false,lastActive:0,teaseDebt:0,revealCount:0,lastRare:-100,
   settings:{theme:'auto'},seen:{},saved:[],pinnedPosts:[],sales:0,dmQuota:0,authorHandle:uniqueHandleMe(a.user||'author')};
  const rp=REP_PRESET[a.reputation]||REP_PRESET.unknown;const fame=famFromFollowers(S.followers);
  S.stats={fame,loyalty:rp.loyalty,rep:rp.rep,critic:rp.critic,controv:rp.controv,trust:rp.trust,mystery:30,hype:20,bookPop:fame*.8,loreEng:Math.max(10,fame*.5)};
  const pub=cfg.books.filter(b=>b.status!=='upcoming'),up=cfg.books.filter(b=>b.status==='upcoming');
  let num=1;pub.forEach(b=>addBook(b,'published',num++));
  const want=Math.max(a.numBooks|0,pub.length);
  while(S.books.filter(b=>b.status==='published').length<want){addBook({title:genBookTitle(),genre:a.genre,desc:'',agoDays:R.i(200,3000)},'published',num++)}
  up.forEach(b=>addBook(b,'upcoming',num++));
  if(!S.books.length)addBook({title:genBookTitle(),genre:a.genre},'published',num++);
  S.books.forEach(b=>lines(b.future||'').forEach(t=>{}));
  cfg.books.forEach(b=>lines(b.future).forEach(t=>{if(!S.books.some(x=>x.title.toLowerCase()===t.toLowerCase()))addBook({title:t,genre:b.genre},'upcoming',num++)}));
  finishLore();
  S.pids=[];S.people={};S.specials=null;
  ensurePeople(true);
  seedWorld();
  return S}
function uniqueHandleMe(h){return String(h).replace(/^@/,'').replace(/[^a-z0-9_.]/gi,'').toLowerCase()||'author'}
function finishLore(){
  const g=S.author.genre;
  while(entList('character').length<5)addEnt({name:genName('character',g),type:'character',role:'minor',gen:true,known:.3,pop:R.f()*.4});
  while(entList('place').length<3)addEnt({name:genName('place',g),type:'place',gen:true,known:.4});
  while(entList('faction').length<2)addEnt({name:genName('faction',g),type:'faction',gen:true,known:.4});
  while(entList('object').length<2)addEnt({name:genName('object',g),type:'object',gen:true,known:.4});
  if(!S.mysteries.length)expandLore(6);
  expandLore(4);
  while(!S.quirks.length)expandLore(2);
  if(!S.timeline.length)S.timeline.push('the Collapse','the first war');
  const cs=entList('character');
  if(!S.ships.length&&cs.length>1){const t=R.pickn(cs,2);S.ships.push({a:t[0].id,b:t[1].id,kind:'bond'})}
  _entRe=null}
// ---------- fan content ----------
const ARCH_FP={lore:{theory:4,lore:4,timeline:3,predict:1.5},meme:{meme:8},reviewer:{review:5,ranking:3,criticism:1.5},shipper:{ship:8,art:1.5},emotional:{discussion:4,art:2,quote:2},solver:{theory:6},wrong:{theory:6,predict:2},conspiracy:{theory:5,lore:3},hater:{criticism:7},veteran:{ranking:3,lore:2,quote:2,timeline:1},newbie:{discussion:4,fan:3,review:2},supporter:{quote:3,discussion:2,art:1},defender:{quote:2,discussion:2},casual:{discussion:3,fan:3,quote:2},stan:{art:3,ranking:2,quote:2},antistan:{criticism:3,ranking:2},skeptic:{criticism:4,review:2},chatty:{discussion:3,fan:2},asker:{lore:1,discussion:2},lurker:{quote:2,fan:2}};
const FAN_BASE={review:3,discussion:3,art:1.5,meme:1.8,quote:2,fan:1.5,theory:1,ranking:.8,ship:1.1,lore:.5,criticism:1,predict:.5,passage:1,timeline:.25};
function chooseFanType(p){
  return R.wpick(Object.keys(FAN_BASE),t=>{let w=FAN_BASE[t];if(t==='theory'||t==='lore'||t==='timeline')w*=1+S.stats.loreEng/50+S.stats.mystery/80;if(t==='criticism')w*=1+S.stats.controv/40;
    p.arch.forEach((a,i)=>{const v=(ARCH_FP[a]||{})[t];if(v)w*=1+v*(i?.3:1)});return w})}
function fanImg(ptype,ctx,p,post){
  const Cn=ctx.Cs[0],C2=ctx.Cs[1]||ctx.allC[0];
  switch(ptype){
    case 'theory':return {art:'board',labels:[Cn,C2,ctx.Ps[0]||'?'],text:post.claim?post.claim.text:'',use:'doc',seed:post.id};
    case 'art':return {art:'portrait',labels:[Cn],use:'character',shows:Cn,seed:Cn+p.id};
    case 'meme':return {art:'meme',text:post.text.slice(0,110),seed:post.id};
    case 'quote':case 'passage':return ctx.BQ?{art:ptype==='quote'?'quote':'page',text:ctx.BQ,seed:post.id}:null;
    case 'ship':return {art:'edit',labels:[Cn,C2],use:'character',shows:Cn+' and '+C2,seed:post.id};
    case 'ranking':return {art:'ranking',labels:uniq([Cn,C2,ctx.CF,ctx.CH,...ctx.allC].filter(Boolean)).slice(0,5),seed:post.id};
    case 'timeline':return {art:'timeline',labels:R.pickn(S.timeline,Math.min(4,S.timeline.length)),seed:post.id,use:'doc'};
    case 'lore':return R.chance(.6)?{art:'symbol',seed:post.id,use:'symbol',labels:[ctx.Fs[0]||'']}:null;
    case 'fan':return R.chance(.6)?{art:'shelf',labels:[ctx.B],seed:post.id}:null;
    default:return null}}
function makeFanPost(p,ptype,opt){
  opt=opt||{};ptype=ptype||chooseFanType(p);
  const post={id:uid('f'),by:p.id,kind:'fan',ptype,hour:S.hour,likes:0,commentsCount:0,shares:0,views:0,comments:[],heat:1,text:'',img:null,tags:[],liked:false,saved:false};
  const sc={type:'plain',ents:[],words:[],flags:{},img:null};
  const ctx=makeCtx(p,post,sc,null);
  if(opt.ent){ctx.Cs=[opt.ent.short,...ctx.Cs.filter(x=>x!==opt.ent.short)]}
  if(ptype==='missing'){const r=genFrom(T.missing,ctx,p,'F:missing',{intent:'missing'});post.text=r?r.text:'where did the author go?';post.ptype='discussion'}
  else{
    if(ptype==='rumour'){ctx.rum=opt.rum||fill(expand(R.pick(RUMOURS)),ctx);post.rumour=ctx.rum}
    const r=genFrom(FP[ptype]||FP.discussion,ctx,p,'F:'+ptype,{intent:'F:'+ptype});
    if(!r)return null;post.text=r.text;
    if(ctx.claim&&(ptype==='theory'||ptype==='predict')){post.claim={text:ctx.claim};const t=addTheory(ctx.claim,p.id,post.id);post.theoryId=t.id}
    if(ptype==='theory'&&!post.claim){ctx.claim=makeClaim({C:ctx.Cs[0],C2:ctx.Cs[1]||ctx.allC[0],P:ctx.Ps[0],F:ctx.Fs[0],O:ctx.O,M:ctx.M});post.claim={text:ctx.claim};const t=addTheory(ctx.claim,p.id,post.id);post.theoryId=t.id;post.text+=' '+ctx.claim+'.'}
  }
  post.img=fanImg(post.ptype,ctx,p,post);
  const ents=findEnts(post.text);ents.slice(0,2).forEach(id=>post.tags.push(hashtagFor(S.ents[id].name)));
  const fam=1+S.stats.fame/120;
  post.likes=Math.round(p.followers*(.02+R.f()*.05)*fam*(p.reg?1.6:1));post.commentsCount=Math.round(post.likes*(.025+R.f()*.03));post.views=post.likes*R.i(7,13);
  post.heat=ptype==='theory'?1.5:ptype==='criticism'?1.6:ptype==='meme'?1.3:1;
  S.posts.unshift(post);S.mentLog.push({h:S.hour,e:ents});
  p.comments++;
  if(opt.react!==0)fanReact(post,opt.react||R.i(1,4),{heated:ptype==='criticism'});
  trimPosts();touch();return post}
function trimPosts(){if(S.posts.length>420){const keep=S.posts.filter(p=>p.by==='me'||p.pinned||S.hour-p.hour<120);S.posts=keep.slice(0,380)}}
function addTheory(text,by,pid){
  let t=S.theories.find(x=>overlap(x.text,text)>=.85);
  if(t){t.support+=R.i(1,6);return t}
  const sm=secretMatch(text);
  t={id:uid('t'),text,ents:findEnts(text),by,pid,hour:S.hour,support:R.i(2,12),against:R.i(0,4),status:'open',secretId:sm?sm.s.id:null,hit:sm?sm.score:0};
  S.theories.push(t);if(S.theories.length>140)S.theories.splice(0,20);return t}
// ---------- other authors, news, rumours ----------
function otherAuthorPost(){
  const a=P(R.pick(S.specials.author));const ctx=makeCtx(a,{},{ents:[],words:[],flags:{}},null);
  ctx.x={ob:a.bookTitle||'a new novel'};
  const r=genFrom(AUP,ctx,a,'AU',{raw:true,noSim:false});if(!r)return null;
  const post={id:uid('f'),by:a.id,kind:'fan',ptype:'author',hour:S.hour,likes:Math.round(a.followers*(.01+R.f()*.02)),commentsCount:0,shares:0,views:0,comments:[],heat:1,text:r.text,img:/Cover reveal/.test(r.text)?{art:'cover',labels:[a.bookTitle||'New Book',a.name],seed:a.id+S.hour}:null,tags:[],liked:false,saved:false};
  post.commentsCount=Math.round(post.likes*.03);post.views=post.likes*9;
  S.posts.unshift(post);fanReact(post,R.i(1,3));touch();return post}
const NB={review:["A patient, intricate read that asks a lot of its audience and mostly repays it.","The reviewer praises {C}'s arc but questions the pacing of the {P} chapters.","Dense with invention, the book is stronger on character than on plot momentum."],
 interview:["{A} declined to say whether {C} survives, but did allow that 'the {P} chapters were the hardest to write'.","In a wide-ranging chat the author discusses worldbuilding, doubt and the fans who dissect every sentence."],
 ranking:["Readers voted {C} the most likely to betray you, narrowly ahead of {C2}.","The list puts {B} among the most discussed series of the year."],
 controversy:["Some readers say the recent posting style feels like bait. Others call it part of the fun.","The debate has split the fandom into camps, with {C} at the centre."],
 release:["Bookshops expect strong demand, with pre-orders already ahead of the previous title.","Early reactions focus on {C} and the scale of the ending."],
 industry:["{pub} says sales of {B} are climbing across all formats.","The series now sits among the most reprinted titles on the publisher's list."],
 theory:["The idea has spread across fan spaces, with supporters pointing to the {P} chapters.","The author has not commented, which has only fuelled the discussion."],
 leak:["The material has not been verified. Representatives for the author did not respond.","Fans are split on whether to look or wait for an official release."],
 award:["The shortlist was announced this morning. Winners will be named later this season.","Judges praised the worldbuilding and the control of tone."],
 rare:["The post has been shared widely and sent readers rushing to bookshops.","Reaction online has been immediate."]};
function makeNews(type,x){
  const j=P(R.pick(S.specials.journalist));x=x||{};
  const ctx=makeCtx(j,{},{ents:[],words:[],flags:{}},null);
  ctx.x=Object.assign({outlet:j.outlet,pub:R.pick(PUBLISHERS),award:R.pick(AWARDS),celeb:x.celebName||'a well-known actor',rk:R.i(2,8)},x);
  ctx.claim=ctx.claim||makeClaim({C:ctx.Cs[0],C2:ctx.Cs[1]||ctx.allC[0],P:ctx.Ps[0],F:ctx.Fs[0],O:ctx.O,M:ctx.M});
  if(x.book)ctx.B=x.book;
  const r=genFrom(NEWS[type]||NEWS.industry,ctx,j,'N:'+type,{raw:true,noSim:true});if(!r)return null;
  const body=fill(expand(R.pick(NB[type]||NB.industry)),ctx);
  const post={id:uid('n'),by:j.id,kind:'news',newsType:type,hour:S.hour,headline:r.text.replace(/\s+/g,' '),text:body,outlet:j.outlet,likes:Math.round(j.followers*(.01+R.f()*.02)*(1+S.stats.fame/100)),commentsCount:0,shares:0,views:0,comments:[],heat:type==='controversy'?1.8:1.2,tags:[],liked:false,saved:false,img:null};
  post.commentsCount=Math.round(post.likes*.03);post.views=post.likes*10;
  S.posts.unshift(post);S.news.push({id:post.id,type,hour:S.hour,headline:post.headline});S.mentLog.push({h:S.hour,e:findEnts(post.headline+' '+body)});
  fanReact(post,R.i(2,5),{heated:type==='controversy'});touch();return post}
function spawnRumour(txt,by){
  const p=by||pickFan(p=>.3+p.obs+(p.arch[0]==='conspiracy'?2:0));if(!p)return null;
  const ctx=makeCtx(p,{},{ents:[],words:[],flags:{}},null);
  const rum=txt||fill(expand(R.pick(RUMOURS)),ctx);
  const r={id:uid('r'),text:rum,hour:S.hour,spread:R.i(5,25),status:'circulating'};S.rumours.push(r);if(S.rumours.length>40)S.rumours.shift();
  const post=makeFanPost(p,'rumour',{rum,react:R.i(2,5)});if(post)post.rumourId=r.id;
  S.stats.hype=clamp(S.stats.hype+1.5,0,100);
  return r}
function addControversy(title,inten){
  const ex=S.controversies.find(c=>c.title===title);if(ex){ex.intensity=Math.min(100,ex.intensity+inten);return ex}
  const c={id:uid('x'),title,intensity:inten,hour:S.hour};S.controversies.push(c);logEvent('Controversy: '+title);return c}
// ---------- stories by fans ----------
function fanStory(){
  const p=pickFan(p=>.2+p.obs);if(!p)return;const ctx=makeCtx(p,{},{ents:[],words:[],flags:{}},null);
  const r=genFrom(FP.discussion,ctx,p,'ST',{intent:'story'});if(!r)return;
  S.stories.push({id:uid('s'),by:p.id,text:r.text,bg:bgFor(p.id),hour:S.hour,exp:24,views:0})}
// ---------- seeding ----------
function seedWorld(){
  const pubs=S.books.filter(b=>b.status==='published');
  pubs.slice(0,5).forEach((b,i)=>{
    createMyPost({ptype:'release',text:`${b.title} is out in the world. Thank you for reading it.`,bookId:b.id,img:{art:'cover',labels:[b.title,authorDisplay()],use:'cover',seed:b.id,shows:b.title}},{silent:true,agoHours:24*R.i(12,400)+i*24*60,likes:S.followers*.05*(1+R.f()*.8),react:R.i(6,12)})});
  S.posts.filter(p=>p.by==='me').slice(0,2).forEach(p=>{p.pinned=true;S.pinnedPosts.push(p.id)});
  for(let i=0;i<R.i(14,20);i++){const p=pickFan(p=>.2+p.obs,null,60);if(!p)continue;const post=makeFanPost(p,null,{react:R.i(2,5)});if(post){const ago=R.i(1,70);post.hour=S.hour-ago;post.comments.forEach(c=>c.hour=S.hour-R.i(0,ago))}}
  for(let i=0;i<3;i++){const post=makeNews(R.pick(['review','industry','ranking','interview']));if(post){post.hour=S.hour-R.i(3,60)}}
  const sp=R.pickn(S.specials.author,3);sp.forEach(id=>S.followingIds.push(id));
  S.followingIds.push(...R.pickn(S.pids.filter(id=>S.people[id].kind==='fan'&&S.people[id].reg),R.i(6,12)));
  for(let i=0;i<5;i++)fanStory();
  spawnRumour();
  for(let i=0;i<R.i(2,4);i++)incomingDM(R.pick(['thanks','loreQ','helped','chat','nervous','writing']),null,true);
  S.threads.forEach(t=>{t.msgs.forEach(m=>m.hour=S.hour-R.i(2,40))});
  notify({type:'system',text:`Welcome to Folio, ${authorShort()}. Your world is live. Post something.`,link:{view:'home'}});
  S.highlights=[{id:uid('h'),name:'Books',stories:[],color:0},{id:uid('h'),name:'Lore',stories:[],color:1},{id:uid('h'),name:'Q&A',stories:[],color:2}];
  S.lastActive=S.hour}
