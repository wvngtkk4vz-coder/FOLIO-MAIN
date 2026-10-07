// ---------- comment engine ----------
Object.assign(SI,{
 criticism:{defend:5,petty:2,critique:2.5,support:1,joke:1,praise:.4,reviewer:1.5,short:1.5,compare:1,mixed:1.5},
 fanart:{praise:4,charArt:2,short:2.5,joke:1.2,support:2.5,ship:1.2,stan:2,critique:.4,life:.4},
 theorypost:{clue:3,theory:2,wrong:1,critique:2,praise:1,conspiracy:1.5,defend:1,loreQ:2,short:2,joke:1.5,petty:.4,solver:1},
 review:{defend:2,critique:3,reviewer:2,petty:2,praise:2,compare:1,short:2,joke:1,mixed:2,reread:1},
 ranking:{defend:3,stan:3,antistan:3,joke:2,petty:1,short:2,praise:1,ship:1},
 missing:{missing:12,short:1,support:1,bait:.5,joke:.5}});
const ONLY={delay:['delay'],pollR:['poll'],qaQ:['qa'],rumourR:['rumour'],cover:['cover','release'],missing:['missing'],date:['teaser','writing','release','cover','delay','cryptic'],preorder:['release','cover'],congrats:['writing','release','plain','bts','personal'],mapR:[],charArt:[],symbol:[],manuscript:[],note:[],desk:[],docR:[],helped:['plain','personal','bts','qa']};
const SCENE_FAN={theory:'theorypost',art:'fanart',meme:'plain',review:'review',criticism:'criticism',ranking:'ranking',quote:'quote',ship:'plain',lore:'lore',predict:'plain',timeline:'lore',discussion:'plain',passage:'quote',rumour:'rumour',fan:'plain'};
function attOf(p){return clamp(.6*p.likeBooks+.4*p.likeMe,-1,1)}
function sceneOf(post){
  const text=(post.text||'')+' '+(post.img&&post.img.shows||'');
  const ents=findEnts(text);
  let type=post.by==='me'||post.kind==='news'?(post.kind==='news'?(post.newsType==='release'?'release':post.newsType==='controversy'?'plain':'plain'):(SCENE_FOR_TYPE[post.ptype]||'plain')):(SCENE_FAN[post.ptype]||'plain');
  const f={threat:/\b(die|dies|died|death|dead|kill|killed|surprised|shock|shocked|brutal|won't survive|goodbye|fate|doomed|tragic|loses?)\b/i.test(text),reveal:/\b(reveal|truth|finally|confirm|secret|turns out)\b/i.test(text),delay:/\b(delay|delayed|postpone|postponed|pushed back|later than)\b/i.test(text)};
  if(post.by==='me'){if(['teaser','plain','bts','cryptic'].includes(type)&&f.threat)type=type==='cryptic'?'cryptic':'threat';if(f.delay&&['plain','writing','release','bts'].includes(type))type='delay';else if(type==='plain'&&f.reveal)type='reveal'}
  const entNames=new Set(ents.flatMap(id=>words(S.ents[id].name)));
  const wd=sigWords(text).filter(w=>!entNames.has(w)&&w.length>=4);
  return {type,ents,flags:f,words:wd,img:post.img||null,text}}
function mysteryNoun(){const ms=S.mysteries.filter(m=>!m.solved);if(ms.length){const m=R.pick(ms).text;const x=m.match(/^who (.+?)(?: really)? (?:is|was)\b/i);if(x)return x[1].replace(/^(the) /i,'the ')}return 'the '+R.pick(MASK)}
function makeCtx(p,post,scene,parent){
  const chars=entList('character');
  const known=chars.filter(e=>e.known>=.9||(p.know>.55&&e.known>=.2));
  const kn=known.length?known:chars;
  const wC=e=>(.1+e.pop)*(e.known>=.9?1:.3+p.know);
  let Cs=[];
  const srcEnts=(parent&&parent.ents&&parent.ents.length?parent.ents:scene.ents);
  const sc=srcEnts.map(id=>S.ents[id]).filter(e=>e&&e.type==='character');
  if(sc.length)Cs=R.pickn(sc,2).map(e=>e.short);
  if(!Cs.length||R.chance(.18)){const fav=p.favChars.length&&R.chance(.55)?S.ents[R.pick(p.favChars)]:(kn.length?R.wpick(kn,wC):null);if(fav&&!Cs.includes(fav.short))Cs.unshift(fav.short)}
  if(Cs.length<2&&kn.length>1){const o=R.wpick(kn.filter(e=>e.short!==Cs[0]),wC);if(o)Cs.push(o.short)}
  const places=entList('place'),facs=entList('faction'),objs=entList('object');
  const sp=srcEnts.map(id=>S.ents[id]).filter(e=>e&&e.type==='place'),sf=srcEnts.map(id=>S.ents[id]).filter(e=>e&&e.type==='faction');
  const pb=post&&post.bookId?S.books.find(b=>b.id===post.bookId):null;
  const pubs=S.books.filter(b=>b.status==='published');
  const bk=pb||(p.favBook&&R.chance(.6)?S.books.find(b=>b.id===p.favBook):null)||R.pick(pubs.length?pubs:S.books);
  const bk2=R.pick(S.books.filter(b=>b!==bk))||bk;
  const quotes=S.books.flatMap(b=>b.quotes);
  const aus=S.specials.author.map(P);
  return {p,post,scene,parent,Cs,allC:kn.map(e=>e.short),CF:p.favChars.length?S.ents[p.favChars[0]].short:null,CH:p.hateChars.length?S.ents[p.hateChars[0]].short:null,
   Ps:sp.length?sp.map(e=>e.short):(places.length?[R.wpick(places,e=>.2+e.pop+e.known).short]:[]),allP:places.map(e=>e.short),
   Fs:sf.length?sf.map(e=>e.short):(facs.length?[R.pick(facs).short]:[]),O:objs.length?R.pick(objs).short:'the old crown',M:mysteryNoun(),
   B:bk.title,B2:bk2.title,N:bk.num||1,A:authorShort(),
   AU:aus.length?R.pick(aus).name:'another author',AU2:aus.length?R.pick(aus).name:'someone',QK:S.quirks.length?R.pick(S.quirks):'the royal family all have silver eyes',
   BQ:quotes.length?R.pick(quotes).replace(/^["“]|["”]$/g,''):'',
   W:scene.words.length?R.pick(scene.words):R.pick(['surprised','something','soon','different']),W2:R.pick(['different','simply','finally','maybe','never','quietly']),
   claim:null,x:{}}}
function chooseIntent(p,scene,post,tried){
  const sc=SI[scene.type]||SI.plain;const imgU=scene.img&&IMG_USE_INT[scene.img.use];
  const mem=S.mem.intents.slice(-14);const att=attOf(p);
  const hasQuote=S.books.some(b=>b.quotes.length);
  const pool=Object.keys(POL).filter(i=>T[i]&&!(tried&&tried.has(i)));
  return R.wpick(pool,i=>{
    let w=sc[i]!=null?sc[i]:.25;
    if(ONLY[i]){const ok=ONLY[i].includes(scene.type)||(imgU&&imgU[i]);if(!ok)return 0}
    if(imgU&&imgU[i])w=Math.max(w,imgU[i]);
    if(imgU&&(i==='mapR'||i==='charArt'||i==='symbol'||i==='manuscript'||i==='note'||i==='desk'||i==='docR')&&!imgU[i])return 0;
    let m=1;p.arch.forEach((a,k)=>{const v=(AI[a]||{})[i];if(v!=null)m*=Math.pow(v,k===0?1:.4)});
    w*=m*Math.exp((POL[i]||0)*att*1.3);
    if(i==='recall'&&!(p.hist.length||S.statements.length))return 0;
    if(i==='veteran'&&p.joinHour>-24*150)return 0;
    if(i==='newbie'&&p.joinHour<-24*120)return 0;
    if(i==='favQuote'&&!hasQuote)return 0;
    if(i==='ship'&&!p.ship)return 0;
    if(i==='stan'&&!p.favChars.length)return 0;
    if(i==='antistan'&&!p.hateChars.length)return 0;
    if((i==='solver'||i==='wrong')&&!S.mysteries.length)return 0;
    if(i==='compare'&&!S.specials.author.length)return 0;
    if(i==='ship'&&S.ships.length)w*=1.5;
    if(i==='bait')w*=1+(S.teaseDebt||0)*.35;
    let c=0;for(const x of mem)if(x===i)c++;
    return w/(1+.55*c)})}
function chooseReplyIntent(p,parent,post){
  const pi=(parent.intent||'').replace(/^R:/,'');const pol=POL[pi]||0,att=attOf(p),toMe=parent.by==='me';
  const w={agree:1.6,disagree:1.1,joke:.7+p.snark,counter:.5,pedant:.35+p.know*.6,escalate:.15+p.snark*.3,support:.4,misread:.25+(1-p.know)*.8,ask:.55+(1-p.know)*.5,quote:.35+p.snark*.6,change:.3};
  if(toMe){w.authorpop=7;w.disagree*=.3;w.escalate=0;w.pedant=0;w.misread=0}
  else{
    const conflict=pol*att<-.12||(pol===0&&p.snark>.7&&R.chance(.35));
    if(conflict){w.disagree*=2.8;w.escalate*=3;w.agree*=.35;w.quote*=1.5}else{w.agree*=1.8;w.support*=1.6}
    if(['theory','solver','wrong','conspiracy','clue','predict'].includes(pi)){w.counter*=3;w.change*=1.6;w.pedant*=1.5}
    if(['panic','stan','helped','praise','beg','support'].includes(pi))w.support*=2.5;
    if(pi==='short')w.ask*=.3;
  }
  const mem=S.mem.tpl.slice(-70);
  return R.wpick(Object.keys(w),k=>{let c=0;for(const x of mem)if(x.indexOf('R:'+k)===0)c++;return w[k]/(1+.4*c)})}
function mkComment(p,post,r,parent){
  const text=r.text,ents=findEnts(text);
  const base=Math.max(2,Math.round((post.likes||50)*.0025*(.3+p.verb)));
  const c={id:uid('c'),by:p.id,text,hour:S.hour,likes:R.i(0,base),liked:false,pinned:false,parent:parent?parent.id:null,depth:parent?Math.min(3,(parent.depth||0)+1):0,intent:r.intent,ents,claim:r.ctx.claim||null,authorLiked:false};
  p.comments++;S.mentLog.push({h:S.hour,e:ents});if(S.mentLog.length>2200)S.mentLog.splice(0,500);ents.forEach(id=>S.ents[id].mentions++);
  return c}
function genComment(p,post,parent){
  const scene=sceneOf(post);const tried=new Set();
  for(let a=0;a<5;a++){
    const intent=parent?chooseReplyIntent(p,parent,post):chooseIntent(p,scene,post,tried);
    tried.add(intent);const pool=(parent?TR:T)[intent];if(!pool)continue;
    const ctx=makeCtx(p,post,scene,parent);
    if(!parent&&post.claim&&['theorypost','lore'].includes(scene.type)&&R.chance(.6)){ctx.claim=post.claim.text}
    if(intent==='recall'){ctx.recall=recallLine(p,ctx);if(!ctx.recall)continue}
    const tag=(parent?'R:':'T:')+intent;
    const r=genFrom(pool,ctx,p,tag,{intent:parent?'R:'+intent:intent,extra:parent?null:()=>{const e=pickTpl(ELAB,'E');S.mem.tpl.push(e.key);return fill(expand(e.tpl),ctx)}});
    if(r){r.intent=parent?intent:intent;return mkComment(p,post,r,parent)}
  }
  return null}
function addComment(post,c){post.comments.push(c);post.commentsCount=Math.max(post.commentsCount||0,post.comments.length)}
function pickCommenter(post){
  const sc=sceneOf(post);const counts={};post.comments.forEach(c=>counts[c.by]=(counts[c.by]||0)+1);
  const c=sampleP(40,p=>(counts[p.id]||0)<2&&p.id!==post.by);
  return c.length?R.wpick(c,p=>.15+p.obs*.7+(p.reg?.6:0)+Math.abs(attOf(p))*.3+(p.favChars.some(f=>sc.ents.includes(f))?.9:0)+(p.hist.length?.2:0)):null}
function pickParent(post){
  const cs=post.comments.filter(c=>c.depth<3&&!c.deleted);if(!cs.length)return null;
  return R.wpick(cs,c=>(1+c.likes*.15)*(c.by==='me'?6:1)*(c.depth?.6:1)*(1+(c.authorReplied?.5:0))/(1+post.comments.filter(x=>x.parent===c.id).length*.6)*(S.hour-c.hour<12?1.5:1))}
function fanReact(post,n,opt){
  opt=opt||{};let made=0;const out=[];
  for(let i=0;i<n;i++){
    if(post.comments.length>=(post.by==='me'?90:55))break;
    const tp=post.comments.length>3?Math.min(.52,.1+post.comments.length*.012+(opt.heated?.12:0)):0;
    let parent=null;if(R.chance(tp))parent=pickParent(post);
    let p;
    if(parent&&parent.by==='me')p=pickCommenter(post)||null;
    else if(parent&&post.by!=='me'&&post.by&&R.chance(.22)&&parent.by!==post.by)p=P(post.by);
    else p=pickCommenter(post);
    if(!p)continue;
    const c=genComment(p,post,parent);
    if(c){addComment(post,c);made++;out.push(c);
      if(post.by==='me'&&!parent&&R.chance(.04))notify({type:'comment',pid:p.id,text:`@${p.user} commented on your post: “${c.text.slice(0,70)}”`,link:{view:'post',id:post.id}})}}
  return out}
function commentTick(post){
  // slowly raise like counts on comments
  const age=S.hour-post.hour;if(age>120)return;
  post.comments.forEach(c=>{if(R.chance(.25)){c.likes+=R.i(0,Math.max(1,Math.round((post.likes||20)*.0008*Math.exp(-age/40))))}})}
