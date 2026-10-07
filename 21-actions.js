// ---------- author actions ----------
const HEAT={teaser:1.5,cryptic:1.7,lore:1.3,quote:1.1,release:1.5,cover:1.5,qa:1.3,poll:1.1,personal:.9,bts:.9,writing:1,rumour:1.4,photo:1,character:1.25,delay:1.4,text:1};
function createMyPost(d,opt){
  opt=opt||{};
  const post={id:uid('m'),by:'me',kind:'post',ptype:d.ptype||'text',text:d.text||'',hour:S.hour-(opt.agoHours||0),likes:0,commentsCount:0,shares:0,views:0,comments:[],heat:HEAT[d.ptype]||1,img:d.img||null,tags:tagsFromText(d.text||''),poll:d.poll||null,liked:false,saved:false,pinned:false,bookId:d.bookId||null};
  if(post.poll){post.poll.opts=post.poll.opts.map(o=>({t:o,v:0,bias:/^(yes|absolutely|definitely|sure)/i.test(o)?1.2+R.f():/^(no|never|absolutely not|nope)/i.test(o)?.8+R.f():1}))}
  const sc=sceneOf(post);
  if(sc.flags.threat)post.heat*=1.45;if(sc.flags.reveal)post.heat*=1.2;if(post.img&&post.img.kind==='upload')post.heat*=1.1;
  if(!opt.silent&&sc.ents.length)post.heat*=1+Math.min(.3,sc.ents.length*.08);
  const er=erMe();
  post.likes=Math.round(opt.likes!=null?opt.likes:S.followers*er*(.08+R.f()*.1)*post.heat);
  post.commentsCount=Math.round(post.likes*.03);post.views=post.likes*R.i(8,14);
  S.posts.unshift(post);
  sc.ents.forEach(id=>{S.ents[id].pop=clamp(S.ents[id].pop+.01,0,1)});
  S.mentLog.push({h:S.hour,e:sc.ents});
  if(opt.react)fanReact(post,opt.react);
  if(!opt.silent)processAuthorPost(post,sc);
  trimPosts();touch();return post}
function processAuthorPost(post,sc){
  const s=S.stats,t=post.ptype;S.lastActive=S.hour;
  S.statements.push({text:post.text,hour:S.hour,type:t});if(S.statements.length>80)S.statements.shift();
  if(['teaser','cryptic','cover','writing'].includes(t)||/something is coming|soon|stay tuned|keep watching/i.test(post.text))S.teasers.push(S.hour);if(S.teasers.length>30)S.teasers.shift();
  const fx={teaser:()=>{s.hype+=4;s.mystery+=3;S.teaseDebt+=1},cryptic:()=>{s.mystery+=5;s.hype+=3;S.teaseDebt+=1.2},lore:()=>{s.loreEng+=3;s.mystery-=2;S.revealCount=(S.revealCount||0)+1;S.teaseDebt=Math.max(0,S.teaseDebt-1);s.trust+=1;canonAdd({text:post.text.replace(/\s+/g,' ').slice(0,200),status:'true',src:'lore post',ents:sc.ents})},
   quote:()=>{s.hype+=1;s.loreEng+=.5},bts:()=>{s.loyalty+=1},writing:()=>{s.hype+=2;S.teaseDebt=Math.max(0,S.teaseDebt-.3)},cover:()=>{s.hype+=5;S.teaseDebt=Math.max(0,S.teaseDebt-1)},
   release:()=>{s.hype+=8;S.teaseDebt=Math.max(0,S.teaseDebt-2);if(post.bookId&&post.releaseDays!=null){}},personal:()=>{s.loyalty+=1.2;s.rep+=.4},poll:()=>{s.loyalty+=.5},qa:()=>{s.loyalty+=2;s.trust+=1},photo:()=>{s.hype+=.5},character:()=>{s.hype+=3;s.mystery+=1},
   rumour:()=>{s.mystery+=2;s.hype+=2},delay:()=>{s.hype-=6;s.trust-=2;s.controv+=3;s.rep-=1;addControversy('Release delayed',10)},text:()=>{}};
  (fx[t]||(()=>{}))();
  const tone=toneOf(post.text);if(tone<0){s.rep-=.8;s.controv+=1.5}
  if(S.teaseDebt>=4&&['teaser','cryptic'].includes(t)){notify({type:'troll',text:'Fans are starting to call you a troll. Too many teasers with no payoff.',link:{view:'post',id:post.id}});addControversy('Fans accuse author of baiting',8)}
  Object.keys(s).forEach(k=>s[k]=clamp(s[k],0,100));
  // leaks of secrets
  S.secrets.forEach(sec=>{if(sec.leaked)return;const m=overlap(post.text,sec.text);if(m>=.66&&sec.toks.length>=2&&t!=='lore'){sec.leaked=true;sec.leakedHour=S.hour;
    logEvent('You accidentally revealed a secret: “'+sec.text+'”',true);notify({type:'leak',text:'Fans noticed you revealed something you meant to keep secret.',link:{view:'post',id:post.id}});
    s.mystery=clamp(s.mystery-6,0,100);s.hype=clamp(s.hype+6,0,100);addControversy('Accidental reveal: '+sec.text.slice(0,50),12);S.revealCount=(S.revealCount||0)+1;
    for(let i=0;i<3;i++)schedule(()=>{const p=pickFan(p=>.2+p.know*2+p.obs);if(p){const f=makeFanPost(p,'lore',{react:3});if(f){f.text=R.pick(['SCREENSHOT BEFORE THEY DELETE IT. ','ok the author just accidentally said it. ','NOTICE WHAT WAS JUST POSTED. '])+'"'+post.text.slice(0,90)+'"';f.heat*=2.4}}},2500+i*3000,false);
    canonAdd({text:sec.text,status:'true',src:'accidental reveal'})}});
  // burst of reactions
  const n=clamp(Math.round(4+Math.log10(Math.max(S.followers,10))*1.6+(t==='qa'?5:0)+(post.heat>1.5?2:0)),4,18);
  for(let i=0;i<n;i++)schedule(()=>fanReact(post,1,{heated:post.heat>1.6}),700+i*R.i(450,1300)+(i>3?R.i(0,1800):0),false);
  if(S.followers>8000&&R.chance(.35))schedule(()=>{const a=P(R.pick(S.specials.author));const c=genComment(a,post,null);if(c){addComment(post,c);touch()}},4000+R.i(0,4000),false);
  if(post.poll)post.poll.opts.forEach(o=>{o.v=Math.round(post.likes*.08*(R.f()+.2)*o.bias)});
  touch()}
function createStory(d){
  const st={id:uid('s'),by:'me',text:d.text||'',bg:d.bg||bgFor(S.hour+d.text),img:d.img||null,poll:d.poll?{q:d.poll.q,opts:d.poll.opts.map(o=>({t:o,v:0,bias:/^(yes|absolutely)/i.test(o)?1.3:/^(no|absolutely not|never)/i.test(o)?.9:1}))}:null,question:!!d.question,hour:S.hour,views:Math.round(S.followers*.004),replies:0,reacts:0,hl:d.hl||null,exp:24};
  S.stories.push(st);S.myStories=S.myStories||[];S.myStories.unshift(st);if(S.myStories.length>80)S.myStories.length=80;
  if(d.hl){const h=S.highlights.find(x=>x.id===d.hl);if(h)h.stories.unshift(st.id)}
  S.lastActive=S.hour;S.stats.loyalty=clamp(S.stats.loyalty+.3,0,100);S.statements.push({text:st.text,hour:S.hour,type:'story'});
  if(/tomorrow|soon|announce|coming/i.test(st.text)){S.stats.hype=clamp(S.stats.hype+2,0,100);S.teasers.push(S.hour);S.teaseDebt+=.6}
  for(let i=0;i<4;i++)schedule(()=>storyTick(st),900+i*1400,false);
  touch();return st}
function storyTick(st){
  if(!st||st.by!=='me')return;
  st.views+=Math.round(S.followers*.0012*(.5+R.f()));
  if(st.poll)st.poll.opts.forEach(o=>{o.v+=Math.round(st.views*.01*o.bias*R.f())});
  if(R.chance(.25+Math.min(.3,S.stats.fame/250))&&st.replies<40){
    const p=pickFan(p=>.2+p.obs);if(!p)return;
    const pseudo={id:'story',by:'me',text:st.text||st.poll&&st.poll.q||'',img:st.img,ptype:'text',comments:[],likes:200,hour:S.hour};
    const c=genComment(p,pseudo,null);if(!c)return;
    let t=threadFor(p.id);if(!t){t={id:uid('d'),pid:p.id,kind:'fan',topic:null,msgs:[],unread:0,bond:0,asked:0,closed:false,decided:false};S.threads.unshift(t)}
    t.msgs.push({me:false,text:c.text,hour:S.hour,story:(st.text||'your story').slice(0,40)});t.unread++;st.replies++;
    S.threads=[t,...S.threads.filter(x=>x!==t)];
    notify({type:'story',pid:p.id,text:`@${p.user} replied to your story.`,link:{view:'dm',id:t.id}})}
  if(R.chance(.5))st.reacts+=R.i(1,Math.max(2,Math.round(st.views*.02)));touch()}
function commentOn(post,text,parent,mode){
  text=String(text||'').trim();if(!text)return null;
  const c={id:uid('c'),by:'me',text,hour:S.hour,likes:0,liked:false,pinned:false,parent:parent?parent.id:null,depth:parent?Math.min(3,(parent.depth||0)+1):0,intent:'me',ents:findEnts(text),authorLiked:false};
  post.comments.push(c);post.commentsCount=Math.max(post.commentsCount||0,post.comments.length);S.lastActive=S.hour;
  const tone=toneOf(text);const s=S.stats;
  if(post.by!=='me'){post.heat=Math.max(post.heat*1.8,2);post.likes+=Math.round(S.followers*.002)+5;const pp=P(post.by);remember(pp,{t:'replied',text});tickMood(pp,.6);s.loyalty=clamp(s.loyalty+.3,0,100)}
  if(parent){
    parent.authorReplied=true;const p=P(parent.by);const cls=classifyMsg(text);
    if(!p.ghost){remember(p,{t:'replied',text});tickMood(p,tone*.4+.2)}
    if(tone>=0){s.loyalty=clamp(s.loyalty+.35,0,100);s.rep=clamp(s.rep+.12,0,100)}
    if(POL[(parent.intent||'')]<0&&tone<0){s.controv=clamp(s.controv+3,0,100);s.trust=clamp(s.trust-1,0,100);s.rep=clamp(s.rep-1,0,100);addControversy('Author argued with a reader',9);
      if(R.chance(.55))schedule(fanWar,2500,false);if(R.chance(.3))schedule(()=>makeNews('controversy'),6000,false)}
    if(parent.intent==='qaQ'||parent.intent==='loreQ')s.trust=clamp(s.trust+.4,0,100);
    // canon
    if(mode&&mode!=='normal'){
      const claim=parent.claim||parent.text.replace(/^@\S+\s*/,'').slice(0,160);
      if(mode==='confirm'||mode==='deny'){const st=mode==='confirm'?'true':'false';canonAdd({text:claim,status:st,src:'reply'});resolveTheoriesByText(claim,st);remember(p,{t:st==='true'?'canon':'denied',text:claim});S.revealCount=(S.revealCount||0)+(st==='true'?1:0);s.trust=clamp(s.trust+.6,0,100);s.loreEng=clamp(s.loreEng+1.5,0,100);logEvent((st==='true'?'Confirmed: ':'Denied: ')+claim)}
      else if(mode==='secret'){canonAdd({text:claim,status:'secret',src:'reply'});s.mystery=clamp(s.mystery+2,0,100);remember(p,{t:'ignored',ent:(parent.ents[0]&&S.ents[parent.ents[0]]?S.ents[parent.ents[0]].short:'that')})}}
    else if(/\b(i never said|never said that|i didn't say|didn't say that)\b/i.test(text)){const st=S.statements.find(x=>/./.test(x.text));S.stats.controv=clamp(s.controv+1.5,0,100);for(let i=0;i<2;i++)schedule(()=>{const q=pickFan(p=>.2+p.snark+p.obs);if(q){const c2=genReplyAs(q,post,c,R.pick(['quote','disagree','ask']));if(c2){addComment(post,c2);touch()}}},2500+i*2200,true)}
    // reactions
    if(R.chance(.55+(p.obs||.3)*.4)&&!p.ghost)schedule(()=>{
      const pool=cls==='rude'?DMR.rude:cls==='yes'?DMR.yes:cls==='no'?DMR.no:cls==='refuse'?DMR.refuse:cls==='thanks'?DMR.thanks:cls==='offer'?DMR.offer:DMR.warm;
      const ctx=makeCtx(p,post,sceneOf(post),c);const r=genFrom(pool,ctx,p,'D:r:'+cls,{intent:'R:me'});
      if(r){const rc=mkComment(p,post,{text:'@'+S.authorHandle+' '+r.text,ctx,intent:'react'},c);addComment(post,rc);notify({type:'reply',pid:p.id,text:`@${p.user} replied to your comment.`,link:{view:'post',id:post.id}});touch()}},R.i(1400,3600),true);
    const k=R.i(1,3);for(let i=0;i<k;i++)schedule(()=>{const q=pickFan(p=>.2+p.obs+(p.reg?.5:0),x=>x.id!==parent.by);if(q){const c2=genComment(q,post,c);if(c2){addComment(post,c2);touch()}}},2800+i*2200+R.i(0,1200),true)}
  Object.keys(s).forEach(k=>s[k]=clamp(s[k],0,100));
  touch();return c}
function likePost(post){
  post.liked=!post.liked;post.likes+=post.liked?1:-1;
  if(post.liked&&post.by!=='me'){const p=P(post.by);tickMood(p,.2);remember(p,{t:'liked',text:post.text});post.likes+=Math.round(S.followers*.0005)}
  S.lastActive=S.hour;touch()}
function likeComment(post,c){
  c.liked=!c.liked;c.likes+=c.liked?1:-1;c.authorLiked=c.liked;
  if(c.liked&&c.by!=='me'){const p=P(c.by);tickMood(p,.35);remember(p,{t:'liked',text:c.text});S.stats.loyalty=clamp(S.stats.loyalty+.1,0,100);c.likes+=R.i(2,12)}
  S.lastActive=S.hour;touch()}
function deleteComment(post,c){
  const kids=new Set([c.id]);let ch=true;while(ch){ch=false;post.comments.forEach(x=>{if(x.parent&&kids.has(x.parent)&&!kids.has(x.id)){kids.add(x.id);ch=true}})}
  post.comments=post.comments.filter(x=>!kids.has(x.id));
  if(c.by!=='me'){const p=P(c.by);if(!p.ghost){remember(p,{t:'deleted',text:c.text});tickMood(p,-.6)}S.stats.trust=clamp(S.stats.trust-.6,0,100);
    S.delLog=(S.delLog||[]).filter(h=>S.hour-h<48);S.delLog.push(S.hour);
    if(S.delLog.length>=5)addControversy('Author deleting comments',10);
    if(POL[c.intent]<0&&c.likes>10&&R.chance(.4))schedule(()=>{const q=pickFan(p=>.2+p.snark);if(q){const f=makeFanPost(q,'criticism',{react:2});if(f)f.text='the author just deleted a critical comment that had '+c.likes+' likes. interesting. '+f.text.slice(0,0)}},3500,false)}
  S.lastActive=S.hour;touch()}
function pinComment(post,c){
  const was=c.pinned;post.comments.forEach(x=>x.pinned=false);c.pinned=!was;
  if(c.pinned&&c.by!=='me'){const p=P(c.by);tickMood(p,.5);remember(p,{t:'liked',text:c.text})}touch()}
function deletePost(post){
  S.posts=S.posts.filter(p=>p!==post);S.pinnedPosts=S.pinnedPosts.filter(i=>i!==post.id);
  if(post.viral){S.stats.trust=clamp(S.stats.trust-3,0,100);addControversy('Author deleted a viral post',14)}touch()}
function pinPost(post){
  if(post.pinned){post.pinned=false;S.pinnedPosts=S.pinnedPosts.filter(i=>i!==post.id)}
  else{if(S.pinnedPosts.length>=3){const old=S.posts.find(p=>p.id===S.pinnedPosts.shift());if(old)old.pinned=false}post.pinned=true;S.pinnedPosts.push(post.id)}touch()}
function followToggle(pid){
  const i=S.followingIds.indexOf(pid);if(i>=0)S.followingIds.splice(i,1);else{S.followingIds.push(pid);const p=P(pid);if(!p.ghost){tickMood(p,.4);if(p.kind==='author')p.rel=p.rel==='rival'?'neutral':p.rel;if(R.chance(.6)&&p.kind==='fan')notify({type:'follow',pid,text:`@${p.user} noticed you followed them.`,link:{view:'profile',id:pid}})}}
  S.lastActive=S.hour;touch()}
function rumourAct(id,act){
  const r=S.rumours.find(x=>x.id===id);if(!r)return;const s=S.stats;
  if(act==='confirm'){r.status='confirmed';s.hype=clamp(s.hype+9,0,100);s.mystery=clamp(s.mystery-3,0,100);s.trust=clamp(s.trust+1,0,100);canonAdd({text:r.text,status:'true',src:'rumour'});logEvent('Confirmed rumour: '+r.text)}
  else if(act==='deny'){r.status='denied';r.spread=0;s.hype=clamp(s.hype-3,0,100);s.mystery=clamp(s.mystery+1,0,100);canonAdd({text:r.text,status:'false',src:'rumour'});logEvent('Denied rumour: '+r.text);
    if(R.chance(.5))schedule(()=>{const q=pickFan(p=>.2+p.snark+p.obs);if(q){const f=makeFanPost(q,'discussion',{react:3});if(f)f.text='the author "denied" the rumour about '+r.text.slice(0,50)+'. that is exactly what someone who was sitting on it would say'}},3000,false)}
  S.lastActive=S.hour;
  for(let i=0;i<3;i++)schedule(()=>{const q=pickFan(p=>.2+p.obs);if(q){const f=makeFanPost(q,R.pick(['discussion','meme','theory']),{react:2});if(f&&f.ptype==='discussion'&&act==='confirm')f.text='WAIT '+r.text.slice(0,60)+' IS REAL?? '+f.text.slice(0,0)}},2000+i*2400,false);
  touch()}
function startRumour(text){const r=spawnRumour(text);if(r){r.src='me';S.stats.mystery=clamp(S.stats.mystery+3,0,100);S.stats.hype=clamp(S.stats.hype+3,0,100);S.lastActive=S.hour;logEvent('You started a rumour: '+text)}touch();return r}
function theoryAct(id,act){
  const t=S.theories.find(x=>x.id===id);if(!t)return;
  if(act==='confirm'){canonAdd({text:t.text,status:'true',src:'theory'});resolveTheoriesByText(t.text,'true');t.status='confirmed';S.stats.trust=clamp(S.stats.trust+.8,0,100);S.revealCount=(S.revealCount||0)+1}
  else if(act==='deny'){canonAdd({text:t.text,status:'false',src:'theory'});resolveTheoriesByText(t.text,'false');t.status='denied';if(t.hit>=.66&&R.chance(.7)){addControversy('Fans think the author lied about a theory',12);S.stats.trust=clamp(S.stats.trust-1.5,0,100)}}
  else if(act==='secret'){canonAdd({text:t.text,status:'secret',src:'theory'});S.stats.mystery=clamp(S.stats.mystery+3,0,100)}
  S.lastActive=S.hour;
  const p=P(t.by);if(act!=='secret'&&!p.ghost){schedule(()=>{const post=makeFanPost(p,'discussion',{react:3});if(post)post.text=act==='confirm'?'THE AUTHOR CONFIRMED IT. “'+t.text+'”. do not talk to me.':'so the author says “'+t.text+'” is false. back to the drawing board I guess'},1800,true)}
  touch()}
function addCanonFact(text,status){text=String(text||'').trim();if(!text)return;canonAdd({text,status:status||'true',src:'codex'});if(status==='true')S.revealCount=(S.revealCount||0)+1;S.lastActive=S.hour;touch()}
function setRelease(bookId,days){const b=S.books.find(x=>x.id===bookId);if(!b)return;b.status='upcoming';b.relHour=S.hour+Math.max(0,days)*24;touch()}
