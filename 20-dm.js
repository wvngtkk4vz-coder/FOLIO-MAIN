// ---------- direct messages ----------
function classifyMsg(t){
  t=String(t||'');
  if(/\b(shut up|stupid|idiot|dumb|stop messaging|leave me alone|go away|annoying|pathetic|loser|hate you|get lost|screw you|clown|moron)\b/i.test(t))return 'rude';
  if(/\b(i('ll| will) send|sending you|signed copy|i'll sign|i will sign|send you a|free copy|bookplate|tickets?|invite you|meet up|come to my|gift you)\b/i.test(t))return 'offer';
  if(/\b(can't say|cant say|no spoilers|won't say|not telling|no comment|wait and see|can't tell|you'll see|spoilers?|not going to say|can't confirm|neither confirm)\b/i.test(t))return 'refuse';
  if(/^\s*(yes|yeah|yep|correct|exactly|right|that's right|spot on|good guess|you got it|true|confirmed)\b/i.test(t)||/\b(you('re| are) (right|close|onto)|you're warm|that's true)\b/i.test(t))return 'yes';
  if(/^\s*(no|nope|nah|not quite|wrong|incorrect|false|never)\b/i.test(t)||/\b(you('re| are) (wrong|off)|not true|never happened|i never said|that's false)\b/i.test(t))return 'no';
  if(/\?/.test(t))return 'question';
  if(/\b(thank|thanks|appreciate|means a lot|love hearing|cheers)\b/i.test(t))return 'thanks';
  if(t.length>220)return 'long';
  if(t.length<18)return 'short';
  return 'warm'}
function toneOf(t){
  if(/\b(shut up|stupid|idiot|dumb|pathetic|loser|clown|moron|you people|delusional|ridiculous|wrong|go away|hate|annoying|whatever|get over it|obviously|read the book|try reading|do better|cry about it)\b/i.test(t))return -1;
  if(/\b(thank|love|appreciate|means|glad|lovely|kind|sweet|wonderful|happy|haha|lol|hug|welcome|great|amazing|beautiful)\b/i.test(t))return 1;return 0}
function threadFor(pid){return S.threads.find(t=>t.pid===pid)}
const DM_KINDS=['thanks','loreQ','advice','helped','excited','nervous','writing','theory','signed','chat','critic','author','journalist','publisher','celeb','veteran'];
function incomingDM(kind,person,seed){
  const fame=S.stats.fame;
  const bonded=S.threads.filter(t=>t.bond>=3&&!t.closed&&['fan'].includes(t.kind));
  if(!kind&&bonded.length&&R.chance(.3)){const t=R.pick(bonded);const p=P(t.pid);const ctx=makeCtx(p,{},{type:'plain',ents:[],words:[],flags:{}},null);const r=genFrom(DMO.chat,ctx,p,'D:chat',{intent:'D'});if(r){t.msgs.push({me:false,text:r.text,hour:S.hour});t.unread++;t.topic=null;touch()}return t}
  if(!kind)kind=R.wpick(DM_KINDS,k=>({thanks:1,loreQ:1.2,advice:.7,helped:.7,excited:1,nervous:.8,writing:.7,theory:1,signed:.6,chat:1.6,critic:.3+S.stats.controv/60,author:fame/35,journalist:fame/32+S.stats.hype/90,publisher:fame>25?fame/60:0,celeb:fame>55?fame/90:0,veteran:S.hour>24*20?.6:0}[k]));
  let p=person;
  if(!p){
    if(kind==='author')p=P(R.pick(S.specials.author));
    else if(kind==='journalist')p=P(R.pick(S.specials.journalist));
    else if(kind==='publisher')p=P(R.pick(S.specials.publisher));
    else if(kind==='celeb')p=P(R.pick(S.specials.celeb));
    else if(kind==='critic')p=pickFan(p=>.2+(['reviewer','skeptic','hater'].includes(p.pa)?2:0),null,70);
    else if(kind==='veteran')p=pickFan(p=>.2+(p.joinHour<-24*200?3:0)+p.obs,null,70);
    else p=pickFan(p=>.3+p.obs*(['loreQ','theory'].includes(kind)?p.know*2:1),null,60);}
  if(!p)return null;
  const existing=threadFor(p.id);
  if(existing){const last=existing.msgs[existing.msgs.length-1];if(last&&!last.me&&S.hour-last.hour<96)return null}
  const sc={type:'plain',ents:[],words:[],flags:{}};const ctx=makeCtx(p,{},sc,null);
  ctx.x={outlet:p.outlet||'The Margin Review',pub:p.pub||'Harrowgate Books',celeb:p.name,AU:p.name};
  if(kind==='author'&&p.name)ctx.AU=p.name;
  const pool=DMO[kind]||DMO.chat;
  const r=genFrom(pool,ctx,p,'D:o:'+kind,{intent:'D',noEmoji:p.kind!=='fan'});
  if(!r)return null;
  let t=existing;
  if(!t){t={id:uid('d'),pid:p.id,kind:p.kind==='fan'?(kind==='critic'?'critic':kind==='veteran'?'veteran':'fan'):p.kind,topic:null,msgs:[],unread:0,bond:0,asked:0,closed:false,decided:false};S.threads.unshift(t)}
  t.msgs.push({me:false,text:r.text,hour:S.hour});t.unread++;
  if(ctx.claim&&(kind==='loreQ'||kind==='theory'))t.topic={claim:ctx.claim};else if(!existing)t.topic=null;
  if(kind==='signed'||kind==='helped'||kind==='thanks'||kind==='excited')t.mood=kind;
  S.threads=[t,...S.threads.filter(x=>x!==t)];
  if(!seed)notify({type:'dm',pid:p.id,text:`${p.kind==='fan'?'@'+p.user:p.name} sent you a message.`,link:{view:'dm',id:t.id}});
  touch();return t}
function startThread(pid){
  let t=threadFor(pid);if(t)return t;const p=P(pid);
  t={id:uid('d'),pid,kind:p.kind==='fan'?'fan':p.kind,topic:null,msgs:[],unread:0,bond:0,asked:0,closed:false,decided:false};S.threads.unshift(t);return t}
function applyDecision(t,cls){
  const p=P(t.pid);if(t.decided)return;
  const pos=['yes','warm','offer','thanks','long'].includes(cls)||(cls==='question'&&R.chance(.5)),neg=['no','rude','refuse'].includes(cls);
  if(t.kind==='journalist'&&pos){t.decided=true;schedule(()=>{makeNews('interview');S.stats.fame=clamp(S.stats.fame+1.2,0,100);S.stats.rep=clamp(S.stats.rep+1,0,100);notify({type:'press',text:`${p.outlet} published your interview.`,link:{view:'home'}})},4500,false)}
  else if(t.kind==='journalist'&&neg){t.decided=true;S.stats.rep=clamp(S.stats.rep-.5,0,100)}
  if(t.kind==='publisher'&&pos){t.decided=true;S.stats.bookPop=clamp(S.stats.bookPop+4,0,100);S.stats.hype=clamp(S.stats.hype+8,0,100);S.stats.fame=clamp(S.stats.fame+1,0,100);schedule(()=>{makeNews('industry');logEvent(`Agreed a new deal with ${p.pub}.`,true)},4000,false)}
  else if(t.kind==='publisher'&&neg)t.decided=true;
  if(t.kind==='author'&&pos){t.decided=true;p.rel='friendly';S.stats.hype=clamp(S.stats.hype+9,0,100);S.stats.fame=clamp(S.stats.fame+1.5,0,100);schedule(()=>{makeNews('industry');logEvent(`Announced a collaboration with ${p.name}.`,true)},4200,false)}
  else if(t.kind==='author'&&neg){t.decided=true;if(cls==='rude'){p.rel='rival';S.stats.controv=clamp(S.stats.controv+3,0,100)}}
  if(t.kind==='celeb'&&pos){t.decided=true;S.stats.hype=clamp(S.stats.hype+10,0,100);S.stats.fame=clamp(S.stats.fame+3,0,100);S.followers*=1.012;schedule(()=>{makeNews('rare',{celebName:p.name});logEvent(`${p.name} posted about your book.`,true)},4000,false)}
  else if(t.kind==='celeb'&&neg)t.decided=true;
  if(t.kind==='critic'&&pos){S.stats.critic=clamp(S.stats.critic+1,0,100);S.stats.controv=clamp(S.stats.controv-1,0,100)}
  else if(t.kind==='critic'&&cls==='rude'){S.stats.controv=clamp(S.stats.controv+4,0,100);addControversy('You snapped at a critic in DMs',10);if(R.chance(.5))schedule(()=>makeNews('controversy'),5000,false)}}
function dmReplyText(t,cls,myText){
  const p=P(t.pid);const sc={type:'plain',ents:[],words:[],flags:{}};const ctx=makeCtx(p,{},sc,null);
  ctx.x={mood:R.pick(MOODS)};
  let pool;
  if(['journalist','publisher','author','celeb','critic'].includes(t.kind)){const pos=['yes','warm','offer','thanks','long'].includes(cls)||cls==='question';pool=DMR[t.kind+(pos?'_yes':'_no')]}
  else pool=DMR[cls]||DMR.warm;
  const r=genFrom(pool,ctx,p,'D:'+t.kind+':'+cls,{intent:'D',noEmoji:p.kind!=='fan'});return r?r.text:null}
function sendDM(t,text,opt){
  opt=opt||{};text=String(text||'').trim();if(!text)return;
  const p=P(t.pid);
  t.msgs.push({me:true,text,hour:S.hour});t.unread=0;S.lastActive=S.hour;t.bond++;
  const cls=classifyMsg(text),tone=toneOf(text);
  remember(p,{t:'dm',text});tickMood(p,tone*.3+.15);
  S.stats.loyalty=clamp(S.stats.loyalty+(tone>=0?.12:-.2),0,100);
  if(t.topic&&t.topic.claim&&(cls==='yes'||cls==='no'||opt.canon)){
    const status=(opt.canon==='false'||cls==='no')?'false':'true';
    canonAdd({text:t.topic.claim,status,src:'dm'});resolveTheoriesByText(t.topic.claim,status);
    remember(p,{t:status==='true'?'canon':'denied',text:t.topic.claim});
    S.stats.trust=clamp(S.stats.trust+.8,0,100);S.stats.loreEng=clamp(S.stats.loreEng+1.5,0,100);
    if(status==='true')S.revealCount=(S.revealCount||0)+1;
    logEvent((status==='true'?'Confirmed in DM: ':'Denied in DM: ')+t.topic.claim);
    t.topic=null}
  else if(t.topic&&cls==='refuse'){S.stats.mystery=clamp(S.stats.mystery+1.2,0,100);remember(p,{t:'ignored',ent:(findEnts(t.topic.claim)[0]&&S.ents[findEnts(t.topic.claim)[0]].short)||'that'});t.topic=null}
  if(cls==='offer'&&/sign/i.test(text))S.pendingFx=(S.pendingFx||[]).concat([{at:S.hour+R.i(60,200),type:'signed',pid:p.id}]);
  applyDecision(t,cls);
  if(cls==='rude'&&t.kind==='fan'){S.stats.rep=clamp(S.stats.rep-.5,0,100);if(R.chance(.35)){t.closed=true}}
  t.typing=true;touch();
  schedule(()=>{
    t.typing=false;const r=dmReplyText(t,cls,text);
    if(r&&!(t.closed&&cls!=='rude')){t.msgs.push({me:false,text:r,hour:S.hour});t.unread++}
    if(['fan','veteran'].includes(t.kind)&&t.bond>=2&&t.asked<2&&!['rude','refuse','no'].includes(cls)&&R.chance(.4)){
      t.asked++;t.typing=true;touch();
      schedule(()=>{t.typing=false;const ctx=makeCtx(p,{},{type:'plain',ents:[],words:[],flags:{}},null);const f=genFrom(DMR.follow,ctx,p,'D:follow',{intent:'D'});if(f){t.msgs.push({me:false,text:f.text,hour:S.hour});t.unread++}touch()},R.i(1800,3500),true)}
    else if(t.bond>=4&&R.chance(.25)){const ctx=makeCtx(p,{},{type:'plain',ents:[],words:[],flags:{}},null);const f=genFrom(DMR.sign,ctx,p,'D:sign',{intent:'D'});if(f){schedule(()=>{t.msgs.push({me:false,text:f.text,hour:S.hour});t.unread++;touch()},2500,true)}}
    touch()},R.i(1300,3600),true)}
function resolveTheoriesByText(text,status){
  S.theories.forEach(t=>{if(t.status!=='open'&&t.status!=='close')return;if(overlap(t.text,text)>=.66){t.status=status==='true'?'confirmed':'denied';
    const by=P(t.by);if(status==='true'){S.stats.loreEng=clamp(S.stats.loreEng+2,0,100);S.stats.hype=clamp(S.stats.hype+5,0,100);
      if(t.secretId){const sc=S.secrets.find(s=>s.id===t.secretId);if(sc){sc.leaked=true;sc.leakedHour=S.hour}}
      if(t.hit>=.66){logEvent(`@${by.user}'s theory was proven correct: “${t.text}”.`,true);schedule(()=>{const post=makeFanPost(by,'theory',{react:2});if(post){post.text=`IT WAS TRUE. ${t.text}. I told you. I TOLD YOU.`;post.heat*=2.5;goViral(post)}},1500,true)}}
    else{S.stats.mystery=clamp(S.stats.mystery+1,0,100)}}})}
function processFx(){
  if(!S.pendingFx||!S.pendingFx.length)return;
  const due=S.pendingFx.filter(f=>f.at<=S.hour);if(!due.length)return;S.pendingFx=S.pendingFx.filter(f=>f.at>S.hour);
  due.forEach(f=>{const p=P(f.pid);if(f.type==='signed'&&!p.ghost){const post=makeFanPost(p,'fan',{react:3});if(post){post.text=R.pick(['my signed copy just arrived!! ','it came. the signed copy actually came. ','signed copy unboxing, please be normal for me ','look what the postman brought. ']).concat(R.pick(['','I may cry','cannot believe you actually did this']));post.img={art:'shelf',labels:[S.books[0].title],seed:post.id};remember(p,{t:'dm',text:'signed copy'})}}})}
