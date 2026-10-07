// ---------- ticking world ----------
const SPEEDS={slow:9000,normal:5000,fast:2200,vfast:800};
let _timer=null,_micro=null;
function startLoops(){
  stopLoops();
  const run=()=>{if(S&&!S.paused){try{tick()}catch(e){console.error(e)}}_timer=setTimeout(run,SPEEDS[S.speed]||5000)};
  _timer=setTimeout(run,SPEEDS[S.speed]||5000);_micro=setInterval(microLoop,500)}
function stopLoops(){clearTimeout(_timer);clearInterval(_micro)}
function microLoop(){
  if(!S)return;const now=Date.now();
  for(let i=0;i<QUEUE.length;i++){const q=QUEUE[i];if(q.at<=now&&(q.direct||!S.paused)){QUEUE.splice(i,1);i--;try{q.fn()}catch(e){console.error(e)}}}}
function erMe(){const s=S.stats;return clamp((.028+s.loyalty*.0005+s.hype*.0004+s.mystery*.0002)*(S.followers>2e6?.55:S.followers>2e5?.8:1)*activityFactor(),.004,.2)}
function activityFactor(){const d=(S.hour-S.lastActive)/24;return d<3?1:Math.max(.25,1-(d-3)*.03)}
function inactiveDays(){return (S.hour-S.lastActive)/24}
function goViral(post,why){
  if(post.viral)return;post.viral=true;post.viralHour=S.hour;post.heat*=3.2;
  const mine=post.by==='me';
  post.likes+=Math.round((mine?S.followers:P(post.by).followers*8)*(.05+R.f()*.08));
  fanReact(post,mine?8:5,{heated:true});
  if(mine){S.stats.hype=clamp(S.stats.hype+14,0,100);S.stats.fame=clamp(S.stats.fame+1.2,0,100);S.followers*=1+R.f()*.015;notify({type:'viral',text:'Your post is going viral right now.',link:{view:'post',id:post.id}});logEvent('One of your posts went viral.',true)}
  else{logEvent('A fan post about your work is going viral: “'+(post.text||'').slice(0,60)+'”',true);notify({type:'viral',text:'A post about your work is going viral.',link:{view:'post',id:post.id}})}
  if(R.chance(.5)&&S.specials)makeNews(R.pick(['theory','industry','rare']),{celebName:'readers'});
  if(S.specials&&mine)R.pickn(S.specials.author,2).forEach(id=>{const a=P(id);const c=genComment(a,post,null);if(c)addComment(post,c)})}
function engagePost(post){
  const age=S.hour-post.hour;const mine=post.by==='me';
  if(age>(mine?260:80)&&!post.viral)return;
  if(post.deleted)return;
  const tau=post.viral?60:(mine?22:14);
  const pp=mine?null:P(post.by);
  const reach=mine?S.followers*erMe():(pp.followers||50)*(.06+R.f()*.04)*(1+S.stats.fame/150);
  const dl=reach*Math.exp(-age/tau)/tau*post.heat*(.6+R.f()*.8)+(R.chance(.2)?R.f():0);
  const add=Math.floor(dl)+(R.f()<dl%1?1:0);
  post.likes+=add;post.views+=add*R.i(8,14);
  const cr=(.018+(mine?S.stats.mystery*.0003+S.stats.controv*.0004:0)+(post.heat>1.4?.012:0));
  const ca=dl*cr;post.commentsCount+=Math.floor(ca)+(R.f()<ca%1?1:0);
  post.shares+=R.chance(.3)?Math.round(add*.04):0;
  const exp=Math.min(4,dl*cr*.4+(mine&&age<8?1.1:0)+(mine&&age<30&&post.ptype==='qa'?1.2:0));
  const k=poisson(exp);if(k>0&&post.comments.length<(mine?90:55))fanReact(post,k,{heated:post.heat>1.8});
  commentTick(post);
  if(post.poll&&age<72){const n=Math.round(add*.1+R.f());for(let i=0;i<n;i++){const o=R.wpick(post.poll.opts,o=>o.bias||1);o.v++}}
  if(mine){
    [1e3,1e4,5e4,1e5,5e5,1e6,5e6].forEach(m=>{if(post.likes>=m&&!(post.mil||{})[m]){post.mil=post.mil||{};post.mil[m]=1;if(m>=1e4||post.likes>S.followers*.1)notify({type:'milestone',text:`Your post reached ${fmt(m)} likes.`,link:{view:'post',id:post.id}})}});
    if(age<10&&!post.traction&&post.likes>S.followers*erMe()*.15&&R.chance(.12)){post.traction=1;notify({type:'traction',text:'Your post is gaining traction.',link:{view:'post',id:post.id}})}
  }
  const vp=(mine?.0016:.0009)*(.5+S.stats.hype/60+S.stats.mystery/100)*(post.heat>1.4?1.6:1);
  if(!post.viral&&age<30&&age>1&&R.f()<(mine?vp:(S.hour-(S.lastFanViral||-999)>72?vp*.45:0))){if(!mine)S.lastFanViral=S.hour;goViral(post)}}
function fanWar(){
  const cand=S.posts.filter(p=>S.hour-p.hour<60&&p.comments.filter(c=>!c.deleted&&c.depth===0).length>=5);if(!cand.length)return;
  const post=R.pick(cand);const tops=post.comments.filter(c=>c.depth===0&&c.by!=='me'&&!c.deleted);if(tops.length<2)return;
  const base=R.pick(tops);let prev=base;
  const people=[P(base.by)];
  const opp=pickFan(p=>.2+p.snark+(Math.sign(attOf(p))!==Math.sign(attOf(people[0]))?1.5:0),p=>p.id!==base.by,60);if(!opp)return;
  const seq=[opp,people[0],opp,people[0],R.chance(.5)?pickFan(p=>.3+p.snark):null].filter(Boolean);
  seq.forEach((pp,i)=>{
    schedule(()=>{const intent=i%2===0?R.pick(['disagree','disagree','escalate','quote']):R.pick(['counter','escalate','disagree','pedant']);
      const c=genReplyAs(pp,post,prev,intent);if(c){addComment(post,c);prev=c;post.heat+=.15;touch()}},1200+i*1800+R.i(0,900),false)});
  S.stats.controv=clamp(S.stats.controv+1,0,100)}
function genReplyAs(p,post,parent,intent){
  const scene=sceneOf(post),ctx=makeCtx(p,post,scene,parent);
  const r=genFrom(TR[intent],ctx,p,'R:'+intent,{intent:'R:'+intent});return r?mkComment(p,post,r,parent):null}
function followersTick(){
  const s=S.stats,F=S.followers;
  const base=F*(.00005+s.hype/100*.00014+s.rep/100*.00003+s.mystery/100*.00004);
  const act=activityFactor();
  let d=base*act*(.6+R.f()*.8);
  const loss=F*(s.controv/100*.00006+(s.trust<35?(35-s.trust)/100*.00018:0)+(inactiveDays()>14?.00012*Math.min(8,(inactiveDays()-14)/10+1):0));
  S.followers=Math.max(1,F+d-loss+(F<3000?R.f()*1.5:0));
  const f=Math.floor(S.followers);[1e3,5e3,1e4,5e4,1e5,2.5e5,5e5,1e6,2.5e6,5e6,1e7,5e7].forEach(m=>{if(f>=m&&!(S.msF||{})[m]){S.msF=S.msF||{};S.msF[m]=1;if(S.hour>0){notify({type:'milestone',text:`You reached ${fmt(m)} followers.`,link:{view:'profile'}});logEvent(`Reached ${fmt(m)} followers.`,true)}}})}
function statsDrift(){
  const s=S.stats;
  s.hype=Math.max(8,s.hype*(1-.012));s.mystery+=(25-s.mystery)*.004;s.controv=Math.max(2,s.controv*(1-.008));
  const open=S.theories.filter(t=>t.status==='open').length;
  const tl=clamp(22+open*.6+(S.revealCount||0)*1.2,10,90);s.loreEng+=(tl-s.loreEng)*.01;
  s.fame+=((famFromFollowers(S.followers)*.85+s.bookPop*.15)-s.fame)*.02;
  s.trust+=(55-s.trust)*.0015;s.rep+=((s.loyalty*.45+s.trust*.35+(100-s.controv)*.2)-s.rep)*.004;
  s.loyalty+=(50-s.loyalty)*.0008;
  if(S.teaseDebt>3)s.trust=Math.max(0,s.trust-.03*(S.teaseDebt-3));
  S.teaseDebt=Math.max(0,S.teaseDebt-.004);
  Object.keys(s).forEach(k=>s[k]=clamp(s[k],0,100));
  S.controversies.forEach(c=>c.intensity*=.985);S.controversies=S.controversies.filter(c=>c.intensity>5);
  S.rumours.forEach(r=>{if(r.status==='circulating'){r.spread=Math.min(100,r.spread+R.f()*.8)}});
  S.books.forEach(b=>{if(b.status==='published'){const days=(S.hour-b.relHour)/24;const rate=S.followers*(.00002+s.hype*.000002)*Math.exp(-days/400)*(b.num===S.books.filter(x=>x.status==='published').length?1.6:1);b.sales+=rate;S.sales+=rate}else if(b.relHour&&b.hype<100)b.hype=Math.min(100,b.hype+.05)});
  const pubs=S.books.filter(b=>b.status==='published');
  if(pubs.length){const recent=pubs.reduce((a,b)=>a+Math.exp(-(S.hour-b.relHour)/24/200)*(b.sales>0?1:.3),0);s.bookPop=clamp(s.bookPop+((Math.min(100,recent*28+s.fame*.4))-s.bookPop)*.01,0,100)}}
function tick(){
  S.hour++;const fame=S.stats.fame;
  const hod=((S.hour%24)+24)%24;const hf=.45+.8*Math.max(0,Math.sin((hod-6)/24*Math.PI*2*.5+.3))+(hod>=18&&hod<=23?.5:0);
  S.posts.forEach(engagePost);
  const lam=clamp(.2*(1+fame/28)*hf*(1+S.stats.hype/200),.05,4);
  for(let i=poisson(lam);i>0;i--){const p=pickFan(p=>.2+p.obs+(p.reg?.5:0),null,60);if(p)makeFanPost(p)}
  if(R.chance(.06*hf))otherAuthorPost();
  if(R.chance(.11))fanStory();
  S.stories=S.stories.filter(s=>S.hour-s.hour<24);
  S.stories.filter(s=>s.by==='me'&&S.hour-s.hour<24).forEach(storyTick);
  const nr=.015*(1+fame/50)+(S.stats.controv>40?.015:0)+(S.stats.hype>60?.01:0);
  if(R.chance(nr))makeNews(R.wpick(Object.keys(NEWS).filter(k=>k!=='rare'&&k!=='leak'&&k!=='award'),k=>k==='controversy'?(S.stats.controv/25):k==='theory'?(S.stats.mystery/25+.5):k==='release'?.4:1));
  const dmr=.035*(.4+fame/45)*(S.stats.loyalty/60+.4)*hf;if(R.chance(dmr))incomingDM();
  if(R.chance(.008*(1+(S.stats.mystery+S.stats.hype)/60)))spawnRumour();
  if(R.chance(.02+S.stats.controv/2500))fanWar();
  if(R.chance(.09*(fame/50+.3))){const p=pickFan(p=>.2+p.obs);if(p)notify({type:'follow',pid:p.id,text:`@${p.user} started following you.`,link:{view:'profile',id:p.id}})}
  if(R.chance(.05)){const rp=S.posts.filter(p=>p.kind==='fan'&&S.hour-p.hour<20&&!p.mentioned&&p.ptype!=='author')[0];if(rp&&P(rp.by).reg){rp.mentioned=1;rp.text+=' @'+S.authorHandle;notify({type:'mention',pid:rp.by,text:`@${P(rp.by).user} mentioned you in a post.`,link:{view:'post',id:rp.id}})}}
  S.theories.filter(t=>t.status==='open'&&R.chance(.05)).slice(0,3).forEach(t=>{t.support+=R.i(1,4+Math.round(S.stats.loreEng/15));if(R.chance(.3))t.against+=R.i(0,3)});
  followersTick();statsDrift();rareEvent();processFx();
  if(S.hour%24===0)dailyTick();
  touch()}
function dailyTick(){
  ensurePeople(false);
  S.books.filter(b=>b.status==='upcoming'&&b.relHour&&b.relHour<=S.hour).forEach(b=>publishBook(b));
  if(S.awardPending&&S.awardPending.hour<=S.hour){const b=S.books.find(x=>x.id===S.awardPending.book);const win=R.chance(.35+S.stats.critic/300);
    makeNews('award',{award:S.awardPending.award,book:b?b.title:undefined,headline:null});
    if(win){S.stats.fame=clamp(S.stats.fame+3,0,100);S.stats.critic=clamp(S.stats.critic+7,0,100);S.stats.hype=clamp(S.stats.hype+14,0,100);notify({type:'award',text:`${b?b.title:'Your book'} won ${S.awardPending.award}.`,link:{view:'home'}});logEvent(`${b?b.title:'Your book'} won ${S.awardPending.award}.`,true)}
    else{notify({type:'award',text:`${b?b.title:'Your book'} did not win ${S.awardPending.award}, but fans are loud about it.`,link:{view:'home'}});logEvent('Lost an award, fans furious.',false)}
    S.awardPending=null}
  const d=inactiveDays();
  if(d>=10){
    const latest=S.posts.find(p=>p.by==='me'&&!p.deleted);
    const n=d>45?4:d>20?3:2;
    if(latest)for(let i=0;i<n;i++){const p=pickFan(p=>.2+p.obs);if(!p)continue;const ctxPost=Object.assign({},latest);const c=genMissingComment(p,latest);if(c)addComment(latest,c)}
    const p2=pickFan(p=>.2+p.obs);if(p2)makeFanPost(p2,'missing',{react:R.i(2,5)});
    if(d>30&&R.chance(.5))makeNews('controversy',{headline:null});
    if(!S.missNotified||S.hour-S.missNotified>24*10){S.missNotified=S.hour;notify({type:'missing',text:`Your fans have noticed you've been quiet for ${Math.floor(d)} days.`,link:{view:'home'}});S.stats.loyalty=clamp(S.stats.loyalty-2,0,100)}
  }
  S.mentLog=S.mentLog.filter(m=>S.hour-m.h<24*8);
  if(typeof saveWorld==='function')saveWorld()}
function genMissingComment(p,post){
  const sc={type:'missing',ents:[],words:[],flags:{},img:null};const ctx=makeCtx(p,post,sc,null);
  const r=genFrom(T.missing,ctx,p,'T:missing',{intent:'missing'});return r?mkComment(p,post,r,null):null}
function publishBook(b){
  b.status='published';b.relHour=S.hour;b.hype=0;
  const post=createMyPost({ptype:'release',text:`${b.title} is out today.`,bookId:b.id,img:{art:'cover',labels:[b.title,authorDisplay()],use:'cover',seed:b.id,shows:b.title}},{silent:true,react:10});
  if(post)post.heat=2;
  S.stats.hype=clamp(S.stats.hype+22,0,100);S.stats.bookPop=clamp(S.stats.bookPop+8,0,100);
  makeNews('release',{book:b.title});
  if(R.chance(.8))makeNews('review',{book:b.title});
  for(let i=0;i<8;i++)schedule(()=>{const p=pickFan(p=>.2+p.obs);if(p){const r=makeFanPost(p,R.pick(['review','review','discussion','discussion','quote','meme']),{react:R.i(1,3)});if(r)r.text=r.text}},2000+i*2500+R.i(0,1500),false);
  S.stats.critic=clamp(S.stats.critic+(R.f()-.45)*8,0,100);
  notify({type:'release',text:`${b.title} is out. Fans are posting their first reactions.`,link:{view:'home'}});
  logEvent(`${b.title} was released.`,true)}
// ---------- rare events ----------
function rareEvent(){
  if(S.hour-S.lastRare<36)return;const s=S.stats;
  if(R.f()>.0035*(.4+s.fame/55+s.hype/150))return;
  const mine=S.posts.find(p=>p.by==='me'&&!p.viral&&S.hour-p.hour<40&&!p.deleted);
  const closeT=S.theories.filter(t=>t.status==='open'&&t.hit>=.66&&!t.close);
  const ev=R.wpick([
   {k:'viral',w:mine?3:.4},{k:'celeb',w:s.fame>35?2:.3},{k:'proven',w:closeT.length?4:0},{k:'leak',w:1.5},{k:'obscure',w:2},
   {k:'award',w:S.books.some(b=>b.status==='published')&&!S.awardPending&&s.fame>25?1.2:0},{k:'pubReview',w:2},{k:'praise',w:2},{k:'attack',w:1.2+s.controv/40}],e=>e.w);
  S.lastRare=S.hour;
  RARE[ev.k](mine,closeT)}
const RARE={
 viral(mine){const p=mine||S.posts.find(x=>x.kind==='fan'&&S.hour-x.hour<30);if(p)goViral(p)},
 celeb(){const c=P(R.pick(S.specials.celeb));const b=R.pick(S.books.filter(x=>x.status==='published')||S.books)||S.books[0];
   makeNews('rare',{celebName:c.name,book:b.title});S.stats.fame=clamp(S.stats.fame+3,0,100);S.stats.hype=clamp(S.stats.hype+16,0,100);S.followers*=1.01+R.f()*.02;
   incomingDM('celeb',c);notify({type:'celeb',text:`${c.name} says they're reading ${b.title}.`,link:{view:'messages'}});logEvent(`${c.name} (${c.known}) publicly said they're reading ${b.title}.`,true)},
 proven(m,ts){const t=R.pick(ts);t.close=true;t.support+=R.i(80,400);const p=P(t.by);const post=S.posts.find(x=>x.id===t.pid)||makeFanPost(p,'theory',{react:2});
   if(post){post.heat*=2.2;post.text='I think I actually solved it. '+t.text+'.';goViral(post)}
   notify({type:'theory',pid:t.by,text:`@${p.user}'s theory (“${t.text}”) is dangerously close to something you've kept secret. Confirm or deny it in the Codex.`,link:{view:'codex'}});logEvent(`A fan theory is very close to your secret: “${t.text}”.`,true);S.stats.mystery=clamp(S.stats.mystery+6,0,100)},
 leak(){const up=S.books.find(b=>b.status==='upcoming')||R.pick(S.books);const txt=R.pick([`the cover of ${up.title} has leaked`,`a chapter title from ${up.title} is going around`,`the first page of ${up.title} has been posted somewhere`]);
   const r=spawnRumour('Leak: '+txt);makeNews('leak',{book:up.title});addControversy('Leak: '+up.title,18);S.stats.hype=clamp(S.stats.hype+9,0,100);
   notify({type:'leak',text:`Rumour: ${txt}. Confirm or deny it in the Codex.`,link:{view:'codex'}});logEvent('A leak surfaced: '+txt,true)},
 obscure(){const p=pickFan(p=>.2+p.know*3,p=>p.know>.5);if(!p)return;const cs=entList('character'),pl=entList('place');if(cs.length<1||pl.length<1)return;
   const a=R.pick(cs),b=R.pick(pl),f=R.pick(entList('faction'));
   const post=makeFanPost(p,'lore',{react:2,ent:a});if(post){post.text=`wait. has anyone else noticed that ${a.short} is only ever described near ${b.short}, and ${f?f.short:'the court'} shows up every single time? that can't be an accident`;post.heat*=2.4;post.likes*=3;S.stats.loreEng=clamp(S.stats.loreEng+4,0,100);logEvent(`A fan discovered an obscure lore link between ${a.short} and ${b.short}.`,true);notify({type:'theory',pid:p.id,text:`@${p.user} found a lore connection nobody had noticed.`,link:{view:'post',id:post.id}})}},
 award(){const b=R.pick(S.books.filter(x=>x.status==='published'));const a=R.pick(AWARDS);S.awardPending={book:b.id,hour:S.hour+48,award:a};makeNews('award',{award:a,book:b.title});notify({type:'award',text:`${b.title} was shortlisted for ${a}.`,link:{view:'home'}});logEvent(`${b.title} shortlisted for ${a}.`,true);S.stats.hype=clamp(S.stats.hype+8,0,100)},
 pubReview(){const b=R.pick(S.books);const good=R.chance(.45+S.stats.critic/250);const post=makeNews('review',{book:b.title});if(post){post.outlet='The Times Literary Supplement-style Review';post.heat*=2;S.stats.critic=clamp(S.stats.critic+(good?6:-6),0,100);S.stats.fame=clamp(S.stats.fame+(good?1.5:.3),0,100);notify({type:'press',text:`A major publication reviewed ${b.title}: ${good?'mostly glowing':'mixed to negative'}.`,link:{view:'post',id:post.id}});logEvent(`A major publication reviewed ${b.title} (${good?'positive':'harsh'}).`,true)}},
 praise(){const a=P(R.pick(S.specials.author));const b=R.pick(S.books);const post={id:uid('f'),by:a.id,kind:'fan',ptype:'author',hour:S.hour,likes:Math.round(a.followers*.03),commentsCount:0,shares:0,views:0,comments:[],heat:2,text:`Just finished ${b.title} by @${S.authorHandle}. I'm furious that I didn't write it. Read it.`,img:null,tags:[],liked:false,saved:false};post.commentsCount=Math.round(post.likes*.03);post.views=post.likes*9;S.posts.unshift(post);fanReact(post,6,{heated:false});
   S.stats.fame=clamp(S.stats.fame+2,0,100);S.stats.rep=clamp(S.stats.rep+2,0,100);S.stats.hype=clamp(S.stats.hype+7,0,100);a.rel='friendly';notify({type:'mention',pid:a.id,text:`${a.name} publicly praised ${b.title}.`,link:{view:'post',id:post.id}});logEvent(`${a.name} praised your work in public.`,true);R.chance(.7)&&incomingDM('author',a)},
 attack(){const b=R.pick(S.books);const j=P(R.pick(S.specials.journalist));const post=makeNews('controversy',{book:b.title});S.stats.critic=clamp(S.stats.critic-6,0,100);S.stats.controv=clamp(S.stats.controv+8,0,100);addControversy('A major critic attacked '+b.title,22);
   for(let i=0;i<3;i++)schedule(()=>{const p=pickFan(p=>.2+p.snark+(attOf(p)<0?1:0));if(p)makeFanPost(p,'criticism',{react:R.i(2,4)})},2500+i*2200,false);
   incomingDM('critic',j);notify({type:'press',text:`A prominent critic published a harsh take on ${b.title}.`,link:post?{view:'post',id:post.id}:{view:'home'}});logEvent('A major critic attacked your work.',true)}
};
// ---------- trends ----------
let _tr=null,_trH=-1;
function computeTrends(){
  if(_tr&&_trH===S.hour)return _tr;
  const since=S.hour-72,cnt={},prev={};
  S.mentLog.forEach(m=>{if(m.h<since-72)return;m.e.forEach(id=>{if(m.h>=since)cnt[id]=(cnt[id]||0)+1+(m.h>S.hour-18?1:0);else prev[id]=(prev[id]||0)+1})});
  const ents=Object.keys(cnt).map(id=>({e:S.ents[id],n:cnt[id],up:cnt[id]>(prev[id]||0)})).filter(x=>x.e).sort((a,b)=>b.n-a.n).slice(0,8);
  const tags=ents.map(x=>({tag:hashtagFor(x.e.name),n:x.n,e:x.e}));
  S.theories.filter(t=>t.status==='open'&&S.hour-t.hour<96).sort((a,b)=>b.support-a.support).slice(0,2).forEach(t=>{const m=t.text.match(/^(?:the )?([A-Z][a-z]+(?: [A-Z][a-z]+)?) is/);tags.push({tag:'#Who'+(m?m[1].replace(/\W/g,''):'IsIt'),n:t.support,t})});
  S.books.filter(b=>b.status==='upcoming').forEach(b=>tags.push({tag:hashtagFor(b.title),n:Math.round(b.hype),b}));
  tags.sort((a,b)=>b.n-a.n);
  const books=S.books.map(b=>({b,score:(b.status==='upcoming'?b.hype*3:Math.max(0,b.sales/Math.max(1,S.followers)*400)+S.stats.hype/2)+(S.mentLog.filter(m=>m.h>=since&&m.e.some(id=>S.ents[id]&&S.ents[id].book===b.id)).length)})).sort((a,b)=>b.score-a.score).slice(0,4);
  const theories=S.theories.filter(t=>t.status!=='denied').sort((a,b)=>b.support-a.support).slice(0,5);
  const viral=S.posts.filter(p=>S.hour-p.hour<72&&!p.deleted).sort((a,b)=>b.likes-a.likes).slice(0,4);
  const accts=Object.values(S.people).filter(p=>p.kind==='fan'&&(p.reg||p.comments>2)).sort((a,b)=>(b.followers*(1+b.comments*.1))-(a.followers*(1+a.comments*.1))).slice(0,5);
  _tr={ents,tags:tags.slice(0,8),books,theories,viral,accts,controv:S.controversies.slice().sort((a,b)=>b.intensity-a.intensity).slice(0,4)};_trH=S.hour;return _tr}
