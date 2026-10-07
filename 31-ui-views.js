// ---------- UI views ----------
function findPost(id){return S.posts.find(p=>p.id===id)}
function findThread(id){return S.threads.find(t=>t.id===id)}
function personByUser(u){u=String(u).toLowerCase();if(u===S.authorHandle)return 'me';return S.pids.find(id=>S.people[id].user===u)||null}
function kindLabel(p){return {author:'Author',journalist:'Press',publisher:'Publisher',celeb:'Celebrity'}[p.kind]||''}
function postSub(post){
  if(post.by==='me')return {pinned:'Pinned',release:'New release',teaser:'Teaser',cryptic:'',lore:'Lore',qa:'Q&A',poll:'Poll',bts:'Behind the scenes',writing:'Writing update',character:'Character',quote:'Quote',personal:'',rumour:'',cover:'Cover reveal',delay:'Announcement'}[post.pinned?'pinned':post.ptype]||'';
  if(post.kind==='news')return post.outlet||'News';
  const p=P(post.by);if(post.ptype==='author')return 'Author · '+(p.genre||'');
  const lab={theory:'Theory',meme:'Meme',art:'Fan art',review:'Review',quote:'Quote',passage:'Passage',ship:'Ship',ranking:'Ranking',timeline:'Timeline',lore:'Lore',criticism:'Critique',predict:'Prediction',rumour:'Rumour',fan:'Fan',discussion:''}[post.ptype]||'';
  return lab}
function pollHTML(post){
  const o=post.poll.opts,tot=o.reduce((a,x)=>a+x.v,0)||1;
  return `<div class="polls">${o.map((x,i)=>{const pc=Math.round(x.v/tot*100);return `<div class="o" data-act="vote" data-id="${post.id}" data-i="${i}"><i style="width:${pc}%"></i><span>${esc(x.t)}${post.poll.voted===i?' ✓':''}</span><span>${pc}%</span></div>`}).join('')}<div class="mute sm" style="padding:2px 12px 6px">${fmt(tot)} votes</div></div>`}
function postCard(post,detail){
  const by=post.by,mine=by==='me';
  const sub=postSub(post);
  const hd=`<div class="hd">${avatarOf(by,38)}<div class="sp"><div>${nmHTML(by)}</div><div class="sub">${esc(sub)}${sub?' · ':''}${timeAgo(post.hour)}</div></div><button class="iconbtn" data-act="postmenu" data-id="${post.id}" aria-label="More">${ic('more')}</button></div>`;
  let body='';
  if(post.kind==='news'){
    body=`<div class="news" data-act="openpost" data-id="${post.id}" style="cursor:pointer"><div class="lbl">${esc(post.outlet||'News')}</div><h4>${esc(post.headline)}</h4>${detail||post.text.length<190?`<div>${esc(post.text)}</div>`:`<div>${esc(post.text.slice(0,170))}…</div>`}</div>`}
  else{
    body=mediaHTML(post);
    if(post.poll)body+=pollHTML(post)}
  const acts=`<div class="acts"><button class="${post.liked?'on':''}" data-act="like" data-id="${post.id}" aria-label="Like">${ic('heart')}</button><button data-act="openpost" data-id="${post.id}" aria-label="Comments">${ic('comment')}</button><button data-act="share" data-id="${post.id}" aria-label="Share">${ic('send')}</button><span class="sp"></span><button class="sv ${post.saved?'on':''}" data-act="save" data-id="${post.id}" aria-label="Save">${ic('bookmark')}</button></div>`;
  const stat=`<div class="stat">${fmt(post.likes)} likes${post.viral?' · <span class="pill gold">Trending</span>':''}</div>`;
  let cap='';
  if(post.kind!=='news'){
    const full=post.text||'';const long=!detail&&full.length>240;
    cap=`<div class="cap"><span class="nm" data-act="profile" data-id="${by}">${esc(userOf(by))}</span>${rich(long?full.slice(0,230)+'…':full)}${long?` <span class="mute" data-act="openpost" data-id="${post.id}" style="cursor:pointer">more</span>`:''}</div>`}
  const tags=detail&&post.tags&&post.tags.length&&post.kind!=='news'?`<div class="cap">${post.tags.filter(t=>!(post.text||'').includes(t)).map(t=>`<span class="tag" data-act="tag" data-q="${esc(t)}">${esc(t)}</span>`).join(' ')}</div>`:'';
  const vc=`<div class="vc" data-act="openpost" data-id="${post.id}">${post.commentsCount?`View all ${fmt(post.commentsCount)} comments`:'Be the first to comment'}</div>`;
  return `<article class="post" id="p_${post.id}">${hd}${body}${acts}${stat}${cap}${tags}${detail?'':vc}</article>`}
// ---- stories ----
function storyGroups(){
  const by={};S.stories.forEach(s=>{if(s.by!=='me'){(by[s.by]=by[s.by]||[]).push(s)}});
  return Object.keys(by).map(id=>({id,items:by[id],unseen:by[id].some(s=>!S.seen[s.id])})).sort((a,b)=>(b.unseen-a.unseen)||(S.followingIds.includes(b.id)-S.followingIds.includes(a.id)))}
function storiesRow(){
  const mine=S.stories.filter(s=>s.by==='me');
  const g=storyGroups().slice(0,24);
  return `<div class="stories"><div class="st" data-act="${mine.length?'story':'newstory'}" data-id="me">${mine.length?avatarOf('me',60,true):`<div style="position:relative">${avatarOf('me',60)}<span class="badge" style="background:var(--accent);color:var(--accent-ink);top:auto;bottom:0;right:-2px;min-width:20px;height:20px;font-size:14px">+</span></div>`}<b>Your story</b></div>${g.map(x=>`<div class="st" data-act="story" data-id="${x.id}" style="${x.unseen?'':'opacity:.55'}">${avatarOf(x.id,60,true)}<b>${esc(userOf(x.id))}</b></div>`).join('')}</div>`}
const FILTERS=[['all','For you'],['following','Following'],['mine','You'],['fans','Fans'],['news','News'],['authors','Authors'],['theories','Theories'],['memes','Memes & art'],['reviews','Reviews']];
function feedPosts(){
  const f=UI.feedFilter;const fol=new Set(S.followingIds);
  let a=S.posts.filter(p=>!p.deleted);
  const T=(p,l)=>l.includes(p.ptype);
  if(f==='following')a=a.filter(p=>p.by==='me'||fol.has(p.by));
  else if(f==='mine')a=a.filter(p=>p.by==='me');
  else if(f==='fans')a=a.filter(p=>p.kind==='fan'&&p.ptype!=='author');
  else if(f==='news')a=a.filter(p=>p.kind==='news');
  else if(f==='authors')a=a.filter(p=>p.ptype==='author');
  else if(f==='theories')a=a.filter(p=>T(p,['theory','lore','timeline','predict','rumour']));
  else if(f==='memes')a=a.filter(p=>T(p,['meme','art','ship']));
  else if(f==='reviews')a=a.filter(p=>T(p,['review','criticism','ranking'])||(p.kind==='news'&&p.newsType==='review'));
  return a.sort((x,y)=>y.hour-x.hour||0)}
VIEWS.home=function(){
  const a=feedPosts();const shown=a.slice(0,UI.feedLimit);
  return `${storiesRow()}<div class="chips" role="tablist">${FILTERS.map(([k,l])=>`<button class="${UI.feedFilter===k?'on':''}" data-act="filter" data-f="${k}">${l}</button>`).join('')}</div>
  ${shown.length?shown.map(p=>postCard(p)).join(''):`<div class="empty">Nothing here yet. ${UI.feedFilter==='mine'?'Post something to get the world talking.':'Give the world a little time.'}</div>`}
  ${a.length>shown.length?`<div class="tc" style="padding:14px"><button class="btn" data-act="more">Load more</button></div>`:''}`};
ACT.filter=el=>{UI.feedFilter=el.getAttribute('data-f');UI.feedLimit=24;render(false);$('#view').scrollTop=0};
ACT.more=()=>{UI.feedLimit+=24;render(false)};
// ---- post detail ----
function buildThread(post){
  const cs=post.comments,byId={};cs.forEach(c=>byId[c.id]=c);
  const kids={};const roots=[];
  cs.forEach(c=>{if(c.parent&&byId[c.parent]){(kids[c.parent]=kids[c.parent]||[]).push(c)}else roots.push(c)});
  roots.sort((a,b)=>(b.pinned-a.pinned)||(UI.cmSort==='new'?b.hour-a.hour:(b.by==='me'?1e9:b.likes)-(a.by==='me'?1e9:a.likes)||b.hour-a.hour));
  const out=[];const walk=(c,d)=>{out.push(c);(kids[c.id]||[]).sort((a,b)=>a.hour-b.hour).forEach(k=>walk(k,d+1))};
  roots.forEach(r=>walk(r,0));return out}
function commentHTML(post,c){
  const mine=c.by==='me',pm=post.by==='me';
  const d=Math.min(3,c.depth||0);
  return `<div class="cm ${d?'rep':''}" style="--d:${d}" id="c_${c.id}">${avatarOf(c.by,d?26:34)}<div class="bd">${c.pinned?`<div class="pin">Pinned by author</div>`:''}<span class="nm" data-act="profile" data-id="${c.by}">${esc(userOf(c.by))}</span>${verifiedOf(c.by)?VB:''}${mine?' <span class="pill">Author</span>':''} ${rich(c.text)}
   <div class="ma"><span>${timeAgo(c.hour)}</span>${c.likes?`<span>${fmt(c.likes)} likes</span>`:''}<button data-act="reply" data-pid="${post.id}" data-id="${c.id}">Reply</button>${pm||mine?`<button data-act="cpin" data-pid="${post.id}" data-id="${c.id}">${c.pinned?'Unpin':'Pin'}</button>`:''}${pm||mine?`<button data-act="cdel" data-pid="${post.id}" data-id="${c.id}">Delete</button>`:''}${c.authorLiked&&!mine?'<span title="Liked by you">♥ by you</span>':''}</div></div>
   <div class="lk"><button class="${c.liked?'on':''}" data-act="clike" data-pid="${post.id}" data-id="${c.id}" aria-label="Like comment">${ic('heart')}</button></div></div>`}
VIEWS.post=function(){
  const post=findPost(UI.param);
  if(!post)return `<div class="empty">This post is gone.<br><br><button class="btn" data-act="back">Back</button></div>`;
  const list=buildThread(post);const shown=list.slice(0,UI.cmLimit);
  const rt=UI.replyTo?post.comments.find(c=>c.id===UI.replyTo):null;
  const modes=rt&&rt.by!=='me'?`<div class="modes"><span class="mute sm" style="padding-top:3px">Reply as</span>${[['normal','Normal'],['confirm','Confirm (canon)'],['deny','Deny (canon)'],['secret','Keep secret']].map(([k,l])=>`<button class="${UI.replyMode===k?'on':''}" data-act="rmode" data-m="${k}">${l}</button>`).join('')}</div>`:'';
  let extra='';
  if(post.rumourId){const r=S.rumours.find(x=>x.id===post.rumourId);if(r&&r.status==='circulating')extra+=`<div class="card pad" style="margin:0 12px 10px"><div class="lbl">Rumour is spreading</div><div style="margin:4px 0 8px">“${esc(r.text)}”</div><div class="row wrap"><button class="btn sm pri" data-act="rum" data-id="${r.id}" data-a="confirm">Confirm</button><button class="btn sm" data-act="rum" data-id="${r.id}" data-a="deny">Deny</button></div></div>`}
  if(post.theoryId){const t=S.theories.find(x=>x.id===post.theoryId);if(t&&t.status==='open')extra+=`<div class="card pad" style="margin:0 12px 10px"><div class="lbl">Fan theory${t.hit>=.66?' · dangerously close':''}</div><div style="margin:4px 0 8px">“${esc(t.text)}”</div><div class="row wrap"><button class="btn sm pri" data-act="theory" data-id="${t.id}" data-a="confirm">It's true</button><button class="btn sm" data-act="theory" data-id="${t.id}" data-a="deny">It's false</button><button class="btn sm" data-act="theory" data-id="${t.id}" data-a="secret">Neither</button></div></div>`}
  const rep=UI.replyTo&&rt?`<div class="modes" style="align-items:center"><span class="mute sm">Replying to @${esc(userOf(rt.by))}</span><button data-act="rcancel">Cancel</button></div>`:'';
  return `${postCard(post,true)}${extra}
  <div class="row" style="padding:4px 14px 6px"><span class="lbl sp">${fmt(post.commentsCount||list.length)} comments</span><div class="seg"><button class="${UI.cmSort==='top'?'on':''}" data-act="csort" data-s="top">Top</button><button class="${UI.cmSort==='new'?'on':''}" data-act="csort" data-s="new">Newest</button></div></div>
  <div class="card" style="margin:0 0 10px;border-left:0;border-right:0;border-radius:0">${shown.length?shown.map(c=>commentHTML(post,c)).join(''):'<div class="empty">No comments yet.</div>'}${list.length>shown.length?`<div class="tc" style="padding:10px"><button class="btn sm" data-act="morecm">Show ${Math.min(40,list.length-shown.length)} more</button></div>`:''}</div>
  ${rep}${modes}<div class="cmbox" style="position:sticky;bottom:0"><textarea rows="1" placeholder="${rt?'Reply to @'+esc(userOf(rt.by))+'…':'Add a comment as '+esc(S.authorHandle)+'…'}" data-keep="cm" data-enter="sendcm" id="cminput"></textarea><button class="btn pri" data-act="sendcm">Post</button></div>`};
ACT.openpost=el=>go('post',el.getAttribute('data-id'));
ACT.like=el=>{const p=findPost(el.getAttribute('data-id'));if(p){likePost(p);render(false)}};
ACT.save=el=>{const p=findPost(el.getAttribute('data-id'));if(p){p.saved=!p.saved;S.saved=S.saved||[];if(p.saved)S.saved.push(p.id);else S.saved=S.saved.filter(x=>x!==p.id);render(false);toast(p.saved?'Saved':'Removed from saved')}};
ACT.share=el=>{const p=findPost(el.getAttribute('data-id'));if(p){p.shares++;if(p.by==='me'){}toast('Shared to your story')}};
ACT.vote=el=>{const p=findPost(el.getAttribute('data-id'));if(!p||!p.poll)return;if(p.poll.voted!=null){toast('You already voted');return}const i=+el.getAttribute('data-i');p.poll.voted=i;p.poll.opts[i].v++;render(false)};
ACT.csort=el=>{UI.cmSort=el.getAttribute('data-s');render(false)};
ACT.morecm=()=>{UI.cmLimit+=40;render(false)};
ACT.reply=el=>{UI.replyTo=el.getAttribute('data-id');UI.replyMode='normal';render(false);const post=findPost(el.getAttribute('data-pid'));const c=post&&post.comments.find(x=>x.id===UI.replyTo);const ta=$('#cminput');if(ta&&c){ta.value=c.by==='me'?'':'@'+userOf(c.by)+' ';ta.focus()}};
ACT.rcancel=()=>{UI.replyTo=null;UI.replyMode='normal';render(false)};
ACT.rmode=el=>{UI.replyMode=el.getAttribute('data-m');render(false)};
ACT.sendcm=()=>{
  const post=findPost(UI.param);const ta=$('#cminput');if(!post||!ta)return;const text=ta.value.trim();if(!text)return;
  const parent=UI.replyTo?post.comments.find(c=>c.id===UI.replyTo):null;
  commentOn(post,text,parent,parent?UI.replyMode:'normal');
  UI.replyTo=null;UI.replyMode='normal';ta.value='';render(false);
  const m=$('#view');m.scrollTop=m.scrollHeight};
ACT.clike=el=>{const p=findPost(el.getAttribute('data-pid'));const c=p&&p.comments.find(x=>x.id===el.getAttribute('data-id'));if(c){likeComment(p,c);render(false)}};
ACT.cpin=el=>{const p=findPost(el.getAttribute('data-pid'));const c=p&&p.comments.find(x=>x.id===el.getAttribute('data-id'));if(c){pinComment(p,c);render(false)}};
ACT.cdel=el=>{const p=findPost(el.getAttribute('data-pid'));const c=p&&p.comments.find(x=>x.id===el.getAttribute('data-id'));if(c)confirmBox('Delete this comment and its replies?','Delete',()=>{deleteComment(p,c);render(false)})};
ACT.rum=el=>{rumourAct(el.getAttribute('data-id'),el.getAttribute('data-a'));toast(el.getAttribute('data-a')==='confirm'?'Rumour confirmed':'Rumour denied');render(false)};
ACT.theory=el=>{theoryAct(el.getAttribute('data-id'),el.getAttribute('data-a'));toast({confirm:'Now canon',deny:'Denied',secret:'Kept secret'}[el.getAttribute('data-a')]);render(false)};
ACT.postmenu=el=>{
  const p=findPost(el.getAttribute('data-id'));if(!p)return;const mine=p.by==='me';
  openModal(`<h3>Post</h3><div style="display:flex;flex-direction:column;gap:8px">
   <button class="btn" data-act="openpost" data-id="${p.id}" onclick="closeModal()">Open post</button>
   ${mine?`<button class="btn" data-act="pinpost" data-id="${p.id}">${p.pinned?'Unpin from profile':'Pin to profile'}</button><button class="btn warn" data-act="delpost" data-id="${p.id}">Delete post</button>`:`<button class="btn" data-act="profile" data-id="${p.by}" onclick="closeModal()">View profile</button><button class="btn" data-act="dmperson" data-id="${p.by}">Message ${esc(userOf(p.by))}</button>`}
   <button class="btn" data-act="mclose">Close</button></div>`)};
ACT.pinpost=el=>{const p=findPost(el.getAttribute('data-id'));if(p){pinPost(p);closeModal();render(false);toast(p.pinned?'Pinned':'Unpinned')}};
ACT.delpost=el=>{const p=findPost(el.getAttribute('data-id'));if(p){closeModal();confirmBox('Delete this post permanently?','Delete',()=>{deletePost(p);if(UI.view==='post')back();else render(false)})}};
ACT.dmperson=el=>{closeModal();const t=startThread(el.getAttribute('data-id'));go('dm',t.id)};
ACT.profile=el=>{const id=el.getAttribute('data-id');go('profile',id==='me'?null:id)};
ACT.tag=el=>{UI.q=el.getAttribute('data-q');UI.hist.push({view:UI.view,param:UI.param});UI.view='explore';UI.param=null;render(true)};
ACT.usertag=el=>{const id=personByUser(el.getAttribute('data-u'));if(id)go('profile',id==='me'?null:id);else toast('Account not found')};
// ---- explore / search ----
function personRow(p,sub){return `<div class="item" data-act="profile" data-id="${p.id}">${avatarOf(p.id,42)}<div class="sp"><div class="b">${esc(p.user)}${p.verified?VB:''}</div><div class="mute sm">${esc(p.name)}${sub?' · '+esc(sub):''}</div></div></div>`}
function searchResults(q){
  const ql=q.toLowerCase().trim(),isTag=ql[0]==='#',bare=ql.replace(/^[#@]/,'');if(!bare)return '<div class="empty">Type to search.</div>';
  let h='';
  const ppl=[];if(!isTag){if(S.authorHandle.includes(bare)||authorDisplay().toLowerCase().includes(bare))ppl.push('me');
    for(const id of S.pids){const p=S.people[id];if(p.user.includes(bare)||p.name.toLowerCase().includes(bare)){ppl.push(id);if(ppl.length>=12)break}}}
  if(ppl.length)h+=`<div class="sect lbl">People</div>${ppl.map(id=>id==='me'?`<div class="item" data-act="profile" data-id="me">${avatarOf('me',42)}<div class="sp"><div class="b">${esc(S.authorHandle)}${VB}</div><div class="mute sm">${esc(authorDisplay())} · you</div></div></div>`:personRow(P(id),kindLabel(P(id))||(P(id).reg?'Regular':''))).join('')}`;
  const bks=S.books.filter(b=>b.title.toLowerCase().includes(bare)||hashtagFor(b.title).toLowerCase()===ql);
  if(bks.length)h+=`<div class="sect lbl">Books</div>${bks.map(bookRow).join('')}`;
  const ents=entList().filter(e=>(e.name.toLowerCase().includes(bare)||hashtagFor(e.name).toLowerCase()===ql)&&e.known>.2);
  if(ents.length)h+=`<div class="sect lbl">Characters, places & lore</div><div class="codex-grid" style="padding:0 14px 10px">${ents.slice(0,10).map(entCard).join('')}</div>`;
  const tagMap={};S.posts.forEach(p=>(p.tags||[]).forEach(t=>{if(t.toLowerCase().includes(bare))tagMap[t]=(tagMap[t]||0)+1}));
  const tags=Object.keys(tagMap).sort((a,b)=>tagMap[b]-tagMap[a]).slice(0,6);
  if(tags.length)h+=`<div class="sect lbl">Hashtags</div>${tags.map(t=>`<div class="trend" data-act="tag" data-q="${esc(t)}"><span><b>${esc(t)}</b><span class="mute sm">${tagMap[t]} posts</span></span></div>`).join('')}`;
  const posts=S.posts.filter(p=>!p.deleted&&(((p.text||'')+' '+(p.headline||'')).toLowerCase().includes(bare)||(p.tags||[]).some(t=>t.toLowerCase()===ql)||(isTag&&((p.text||'')+(p.headline||'')).toLowerCase().replace(/[^a-z0-9]/g,'').includes(bare)))).sort((a,b)=>b.likes-a.likes).slice(0,18);
  if(posts.length)h+=`<div class="sect lbl">Posts</div><div class="grid3">${posts.map(tileHTML).join('')}</div>`;
  const lore=S.canon.filter(c=>c.status!=='secret'&&c.text.toLowerCase().includes(bare)).slice(0,6);
  if(lore.length)h+=`<div class="sect lbl">Canon</div>${lore.map(c=>`<div class="item" style="cursor:default"><div class="sp">${esc(c.text)}<div class="mute sm">${c.status==='true'?'Confirmed':'Denied'} · ${esc(c.src)}</div></div></div>`).join('')}`;
  return h||`<div class="empty">No results for “${esc(q)}”.</div>`}
function bookRow(b){const pub=b.status==='published';return `<div class="item" data-act="book" data-id="${b.id}"><div style="width:44px;height:62px;border-radius:5px;overflow:hidden;flex:none">${artHTML({art:'cover',labels:[b.title,authorDisplay()],seed:b.id})}</div><div class="sp"><div class="b">${esc(b.title)}</div><div class="mute sm">${esc(b.genre)} · ${pub?'Published '+simDate(b.relHour):b.relHour?'Releases '+simDate(b.relHour):'Upcoming'}</div></div></div>`}
function entCard(e){return `<div class="ent" data-act="ent" data-id="${e.id}" style="cursor:pointer"><div class="lbl">${esc(e.type)}${e.role&&e.type==='character'?' · '+esc(e.role):''}</div><div class="b" style="margin:2px 0">${esc(e.name)}</div><div class="bar"><i style="width:${Math.round(e.pop*100)}%"></i></div><div class="mute sm" style="margin-top:4px">${fmt(e.mentions)} mentions</div></div>`}
VIEWS.explore=function(){
  const q=UI.q||'';
  const head=`<div style="padding:12px 14px"><input class="in" type="search" placeholder="Search people, books, characters, #hashtags, posts, lore" value="${esc(q)}" data-keep="q" data-on-input="search" aria-label="Search"></div>`;
  if(q.trim())return head+searchResults(q);
  const tr=computeTrends();
  return head+`<div class="sect lbl">Trending</div>${tr.tags.length?tr.tags.slice(0,8).map((t,i)=>`<div class="trend" data-act="tag" data-q="${esc(t.tag)}"><span><span class="mute sm">${i+1} · Trending</span><b>${esc(t.tag)}</b><span class="mute sm">${fmt(t.n)} mentions</span></span></div>`).join(''):'<div class="empty">Nothing trending yet.</div>'}
  ${tr.controv.length?`<div class="sect lbl">Controversies</div>${tr.controv.map(c=>`<div class="trend" style="cursor:default"><span><b>${esc(c.title)}</b><span class="mute sm">Intensity ${Math.round(c.intensity)}</span></span></div>`).join('')}`:''}
  <div class="sect lbl">Books</div>${tr.books.map(x=>bookRow(x.b)).join('')}
  ${tr.theories.length?`<div class="sect lbl">Top theories</div>${tr.theories.map(t=>`<div class="item" data-act="${S.posts.some(p=>p.id===t.pid)?'openpost':'profile'}" data-id="${S.posts.some(p=>p.id===t.pid)?t.pid:t.by}"><div class="sp">“${esc(t.text)}”<div class="mute sm">${fmt(t.support)} supporters · ${t.status==='open'?'unresolved':t.status==='confirmed'?'confirmed':'denied'}</div></div></div>`).join('')}`:''}
  <div class="sect lbl">Fan accounts</div>${tr.accts.map(p=>personRow(p,fmt(p.followers)+' followers')).join('')}
  <div class="sect lbl">Popular right now</div><div class="grid3">${tr.viral.map(tileHTML).join('')}</div>`};
ACT.search=el=>{UI.q=el.value;render(false)};
ACT.book=el=>{const b=S.books.find(x=>x.id===el.getAttribute('data-id'));if(!b)return;
  const cs=b.chars.map(id=>S.ents[id]).filter(Boolean);
  openModal(`<div class="row" style="align-items:flex-start"><div style="width:90px;aspect-ratio:2/3;border-radius:8px;overflow:hidden;flex:none">${artHTML({art:'cover',labels:[b.title,authorDisplay()],seed:b.id})}</div><div class="sp"><h3 style="margin:0">${esc(b.title)}</h3><div class="mute">${esc(b.genre)} · ${b.status==='published'?'Published '+simDate(b.relHour):b.relHour?'Releases '+simDate(b.relHour):'Upcoming'}</div>${b.status==='published'?`<div class="mute sm">★ ${b.rating.toFixed(1)} · ${fmt(b.sales)} copies</div>`:`<div class="mute sm">Hype ${Math.round(b.hype)}</div>`}</div></div>
   <p>${esc(b.desc||'No description yet.')}</p>${b.setting?`<div class="mute sm">Setting: ${esc(b.setting)}</div>`:''}${cs.length?`<div class="row wrap" style="margin-top:8px">${cs.map(e=>`<span class="pill">${esc(e.short)}</span>`).join('')}</div>`:''}<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-act="mclose">Close</button></div>`)};
ACT.ent=el=>{const e=S.ents[el.getAttribute('data-id')];if(!e)return;const cl=canonLines(e.id);const th=S.theories.filter(t=>t.ents.includes(e.id)&&t.status==='open').slice(0,3);
  openModal(`<div class="lbl">${esc(e.type)}${e.role?' · '+esc(e.role):''}${e.book&&S.books.find(b=>b.id===e.book)?' · '+esc(S.books.find(b=>b.id===e.book).title):''}</div><h3>${esc(e.name)}</h3>
   <div class="row"><span class="sp mute sm">Fan popularity</span><div class="bar" style="width:55%"><i style="width:${Math.round(e.pop*100)}%"></i></div></div>
   <div class="row"><span class="sp mute sm">Fan feelings</span><div class="bar" style="width:55%"><i style="width:${Math.round((e.love+1)*50)}%"></i></div></div>
   ${e.desc?`<p>${esc(e.desc)}</p>`:''}<div class="lbl" style="margin-top:12px">Canon</div>${cl.length?cl.map(c=>`<div class="ev">${c.status==='false'?'<span class="pill bad">Not true</span> ':'<span class="pill ok">Canon</span> '}${esc(c.text)}</div>`).join(''):'<div class="mute sm">Nothing established yet.</div>'}
   ${th.length?`<div class="lbl" style="margin-top:12px">Fans are theorising</div>${th.map(t=>`<div class="ev">“${esc(t.text)}”</div>`).join('')}`:''}
   <div class="field" style="margin-top:12px"><input class="in" id="entfact" placeholder="Add a canon fact about ${esc(e.short)}"></div>
   <div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Close</button><button class="btn pri" data-act="entadd" data-id="${e.id}">Add as canon</button></div>`)};
ACT.entadd=el=>{const t=$('#entfact').value.trim();if(!t)return;addCanonFact(t,'true');const e=S.ents[el.getAttribute('data-id')];const last=S.canon.find(c=>c.text===t);if(last&&e&&!last.ents.includes(e.id))last.ents.push(e.id);closeModal();toast('Added to canon')};
// ---- activity ----
VIEWS.activity=function(){
  UI.actKeep=UI.actKeep||{};
  const list=S.notifs.slice(0,80);
  list.forEach(n=>{if(!n.read)UI.actKeep[n.id]=1});
  const html=list.length?list.map(n=>{
    const icn={dm:'send',reply:'comment',mention:'comment',follow:'user',story:'clock',milestone:'heart',traction:'heart',award:'book',release:'book',press:'news',leak:'pin',troll:'pin',theory:'book',celeb:'user',system:'home',missing:'clock'}[n.type]||'heart';
    return `<div class="item ${UI.actKeep[n.id]?'unread':''}" data-act="notif" data-id="${n.id}">${n.pid&&S.people[n.pid]?avatarOf(n.pid,42):`<div class="av" style="width:42px;height:42px;background:var(--soft);color:var(--fg)">${ic(icn)}</div>`}<div class="sp">${esc(n.text)}<div class="mute sm">${timeAgo(n.hour)}</div></div>${UI.actKeep[n.id]?'<span class="dot"></span>':''}</div>`}).join(''):'<div class="empty">No activity yet.</div>';
  list.forEach(n=>n.read=true);
  return `<div class="row" style="padding:14px 14px 6px"><h2 class="h sp" style="margin:0">Activity</h2></div>${html}`};
ACT.notif=el=>{const n=S.notifs.find(x=>x.id===el.getAttribute('data-id'));if(!n)return;const l=n.link||{};
  if(l.view==='post'&&findPost(l.id))go('post',l.id);else if(l.view==='profile'&&l.id&&S.people[l.id])go('profile',l.id);else if(l.view==='dm'&&findThread(l.id))go('dm',l.id);else if(l.view==='messages')go('messages');else if(l.view==='codex')go('codex');else go('home')};
// ---- messages ----
const DMF=[['all','All'],['unread','Unread'],['fan','Fans'],['critic','Critics'],['pro','Industry']];
UI.dmFilter='all';
function lastMsg(t){return t.msgs[t.msgs.length-1]}
VIEWS.messages=function(){
  let a=S.threads.slice().sort((x,y)=>(lastMsg(y)?lastMsg(y).hour:0)-(lastMsg(x)?lastMsg(x).hour:0));
  const f=UI.dmFilter;
  if(f==='unread')a=a.filter(t=>t.unread>0);else if(f==='fan')a=a.filter(t=>t.kind==='fan'||t.kind==='veteran');else if(f==='critic')a=a.filter(t=>t.kind==='critic');else if(f==='pro')a=a.filter(t=>['author','journalist','publisher','celeb'].includes(t.kind));
  return `<div class="row" style="padding:14px 14px 6px"><h2 class="h sp" style="margin:0">Messages</h2><button class="btn sm pri" data-act="newdm">New message</button></div>
  <div class="chips">${DMF.map(([k,l])=>`<button class="${f===k?'on':''}" data-act="dmf" data-f="${k}">${l}</button>`).join('')}</div>
  ${a.length?a.map(t=>{const p=P(t.pid),m=lastMsg(t);return `<div class="item ${t.unread?'unread':''}" data-act="dm" data-id="${t.id}">${avatarOf(t.pid,46)}<div class="sp"><div class="b">${esc(p.kind==='fan'?p.user:p.name)}${p.verified?VB:''} ${kindLabel(p)?`<span class="pill">${kindLabel(p)}</span>`:t.kind==='critic'?'<span class="pill">Critic</span>':''}</div><div class="${t.unread?'b':'mute'}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m?(m.me?'You: ':'')+esc(m.text):'No messages yet'}</div></div><div class="mute sm">${m?timeAgo(m.hour):''}${t.unread?`<br><span class="dot" style="display:inline-block"></span>`:''}</div></div>`}).join(''):'<div class="empty">No messages here. Fans, critics, authors and press will write to you as your fame grows.</div>'}`};
ACT.dmf=el=>{UI.dmFilter=el.getAttribute('data-f');render(false)};
ACT.dm=el=>go('dm',el.getAttribute('data-id'));
VIEWS.dm=function(){
  const t=findThread(UI.param);if(!t)return `<div class="empty">Conversation not found.</div>`;
  const p=P(t.pid);t.unread=0;
  const msgs=t.msgs.map(m=>`${m.story?`<div class="msg sys">${m.me?'You':'They'} replied to a story: “${esc(m.story)}”</div>`:''}<div class="msg ${m.me?'me':''}">${esc(m.text)}</div><div class="${m.me?'':''}" style="font-size:10.5px;color:var(--mute);${m.me?'align-self:flex-end':'align-self:flex-start'};margin:-3px 6px 2px">${timeAgo(m.hour)}</div>`).join('');
  const quick=t.topic&&t.topic.claim?`<div class="modes" style="padding-top:8px"><span class="mute sm" style="padding-top:3px">They asked about: “${esc(t.topic.claim)}”</span></div><div class="modes"><button data-act="dmq" data-v="true">Yes, that's true</button><button data-act="dmq" data-v="false">No, that's false</button><button data-act="dmq" data-v="refuse">I can't say</button></div>`:'';
  return `<div class="item" data-act="profile" data-id="${p.id}" style="border-bottom:1px solid var(--line)">${avatarOf(p.id,44)}<div class="sp"><div class="b">${esc(p.kind==='fan'?p.user:p.name)}${p.verified?VB:''}</div><div class="mute sm">${esc(p.kind==='fan'?p.name:kindLabel(p)+(p.outlet?' · '+p.outlet:p.pub?' · '+p.pub:''))}</div></div></div>
  <div class="thread">${msgs||'<div class="empty">Say hello.</div>'}${t.typing?'<div class="typing">typing…</div>':''}</div>${quick}
  <div class="cmbox" style="position:sticky;bottom:0"><textarea rows="1" placeholder="Message…" data-keep="dm" data-enter="dmsend" id="dminput"></textarea><button class="btn pri" data-act="dmsend">Send</button></div>`};
ACT.dmsend=()=>{const t=findThread(UI.param),ta=$('#dminput');if(!t||!ta)return;const v=ta.value.trim();if(!v)return;ta.value='';sendDM(t,v);render(false);const m=$('#view');m.scrollTop=m.scrollHeight};
ACT.dmq=el=>{const t=findThread(UI.param);if(!t)return;const v=el.getAttribute('data-v');
  if(v==='refuse')sendDM(t,R.pick(["I can't say. No spoilers, I'm afraid.","Not telling. You'll have to wait and see.","I can't confirm or deny that one."]));
  else sendDM(t,v==='true'?R.pick(['Yes. That is true.','Yes, you are right about that.',"Yeah, you've got it."]):R.pick(["No, that isn't true.",'No. That is false.','Nope, not quite.']),{canon:v});
  render(false);const m=$('#view');m.scrollTop=m.scrollHeight};
ACT.newdm=()=>{UI.pickQ='';openPicker()};
function openPicker(){
  const q=(UI.pickQ||'').toLowerCase();
  let ids=[];
  if(!q){ids=[...S.specials.journalist.slice(0,3),...S.specials.author.slice(0,4),...S.specials.publisher.slice(0,2),...S.specials.celeb.slice(0,2),...S.followingIds.filter(id=>S.people[id]&&S.people[id].kind==='fan').slice(0,12)]}
  else for(const id of S.pids){const p=S.people[id];if(p.user.includes(q)||p.name.toLowerCase().includes(q)){ids.push(id);if(ids.length>=14)break}}
  ids=uniq(ids);
  openModal(`<h3>New message</h3><input class="in" id="pickq" placeholder="Search by name or @handle" value="${esc(UI.pickQ||'')}" data-on-input="pickq" autocomplete="off"><div style="margin-top:8px">${ids.map(id=>{const p=P(id);return `<div class="item" data-act="dmperson" data-id="${id}">${avatarOf(id,38)}<div class="sp"><div class="b">${esc(p.user)}${p.verified?VB:''}</div><div class="mute sm">${esc(p.name)}${kindLabel(p)?' · '+kindLabel(p):''}</div></div></div>`}).join('')||'<div class="empty">No matches.</div>'}</div>`);
  const i=$('#pickq');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
ACT.pickq=el=>{UI.pickQ=el.value;openPicker()};
// ---- profile ----
function bioFor(p){if(p.bio)return p.bio;if(p.kind==='journalist')return 'Books reporter, '+p.outlet+'.';if(p.kind==='publisher')return 'Publishing house. Submissions closed.';if(p.kind==='celeb')return 'Public figure. Reads when I can. '+cap1(p.known||'')+'.';if(p.kind==='author')return 'Author of '+(p.books||[]).map(b=>b.title).join(', ')+'. '+cap1(p.genre||'')+'.';
  const A=[p.life.job+(p.loc?' · '+p.loc:''),p.life.hobby,(p.reg?'reads everything':'')].filter(Boolean);return A.join(' · ')}
function highlightsRow(){
  const hs=S.highlights.filter(h=>h.stories.length);
  return `<div class="hl">${hs.map(h=>`<div class="st" data-act="hl" data-id="${h.id}"><div class="av ring" style="width:62px;height:62px;background:conic-gradient(hsl(${h.color*80+170} 55% 45%),var(--line))"><span style="background:hsl(${h.color*80+170} 40% 28%);font-size:20px">${esc((h.name[0]||'•'))}</span></div><b>${esc(h.name)}</b></div>`).join('')}<div class="st" data-act="newhl"><div class="av" style="width:62px;height:62px;background:var(--soft);color:var(--fg);border:1px dashed var(--mute)">${ic('plus')}</div><b>New</b></div></div>`}
VIEWS.profile=function(){
  const id=UI.param&&UI.param!=='me'?UI.param:null;
  return id?personProfile(id):myProfile()};
function myProfile(){
  const A=S.author;const pubs=S.books.filter(b=>b.status==='published'),ups=S.books.filter(b=>b.status==='upcoming');
  const mine=S.posts.filter(p=>p.by==='me'&&!p.deleted);
  let list=mine.slice().sort((a,b)=>b.hour-a.hour),tab=UI.profileTab;
  if(tab==='pinned')list=mine.filter(p=>p.pinned);else if(tab==='popular')list=mine.slice().sort((a,b)=>b.likes-a.likes).slice(0,18);
  let body='';
  if(tab==='books')body=`<div class="sect lbl">Published</div>${pubs.map(bookRow).join('')||'<div class="empty">No published books.</div>'}<div class="sect lbl">Upcoming</div>${ups.map(bookRow).join('')||'<div class="empty">Nothing upcoming.</div>'}`;
  else if(tab==='stats'){const tl=mine.reduce((a,p)=>a+p.likes,0);body=`<div class="pf"><div class="stg"><div class="tile"><b>${fmt(S.followers)}</b><span class="mute sm">followers</span></div><div class="tile"><b>${pubs.length}</b><span class="mute sm">books published</span></div><div class="tile"><b>${fmt(mine.length)}</b><span class="mute sm">posts</span></div><div class="tile"><b>${fmt(tl)}</b><span class="mute sm">total likes</span></div><div class="tile"><b>${fmt(S.books.reduce((a,b)=>a+(b.sales||0),0))}</b><span class="mute sm">copies sold</span></div><div class="tile"><b>${S.canon.filter(c=>c.status==='true').length}</b><span class="mute sm">canon facts</span></div></div><div style="margin-top:14px">${meters()}</div></div>`}
  else body=list.length?`<div class="grid3">${list.map(tileHTML).join('')}</div>`:`<div class="empty">${tab==='pinned'?'Nothing pinned. Use the ⋯ menu on a post.':'No posts yet. Tap + to share something.'}</div>`;
  return `<div class="pf"><div class="row" style="gap:18px">${avatarOf('me',84)}<div class="sp"><div class="nums" style="justify-content:space-between"><div><b>${fmt(mine.length)}</b><span class="mute sm">posts</span></div><div><b>${fmt(S.followers)}</b><span class="mute sm">followers</span></div><div><b>${fmt(S.followingIds.length)}</b><span class="mute sm">following</span></div></div></div></div>
   <div style="margin-top:10px"><div class="b">${esc(authorDisplay())}${VB}</div><div class="mute sm">@${esc(S.authorHandle)} · ${esc(A.genre||'')} author</div><div style="white-space:pre-wrap;margin-top:4px">${esc(A.bio||'')}</div><div class="mute sm" style="margin-top:4px">${pubs.length} book${pubs.length===1?'':'s'} published${ups.length?` · ${ups.length} upcoming`:''}</div></div>
   <div class="row" style="margin-top:12px"><button class="btn sp" data-act="editprofile">Edit profile</button><button class="btn sp" data-act="nav" data-v="studio">Studio</button><button class="btn sp" data-act="nav" data-v="codex">Codex</button></div></div>
   ${highlightsRow()}<div class="tabs">${[['grid','Posts'],['pinned','Pinned'],['popular','Popular'],['books','Books'],['stats','Stats']].map(([k,l])=>`<button class="${tab===k?'on':''}" data-act="ptab" data-t="${k}">${l}</button>`).join('')}</div>${body}`}
function personProfile(id){
  const p=P(id);const fol=S.followingIds.includes(id);
  const posts=S.posts.filter(x=>x.by===id&&!x.deleted).sort((a,b)=>b.hour-a.hour);
  const th=threadFor(id);const cm=p.comments||0;
  return `<div class="pf"><div class="row" style="gap:18px">${avatarOf(id,84)}<div class="sp"><div class="nums" style="justify-content:space-between"><div><b>${fmt(posts.length)}</b><span class="mute sm">posts</span></div><div><b>${fmt(p.followers)}</b><span class="mute sm">followers</span></div><div><b>${fmt(cm)}</b><span class="mute sm">comments</span></div></div></div></div>
   <div style="margin-top:10px"><div class="b">${esc(p.user)}${p.verified?VB:''}</div><div class="mute sm">${esc(p.name)}${kindLabel(p)?' · '+kindLabel(p):''}${p.reg?' · Regular':''}${p.arch&&p.pa==='veteran'?' · Veteran fan':''}${p.pa==='newbie'?' · New reader':''}</div><div style="margin-top:4px">${esc(bioFor(p))}</div>${p.kind==='author'&&p.rel?`<div class="mute sm" style="margin-top:4px">Relationship with you: ${esc(p.rel)}</div>`:''}</div>
   <div class="row" style="margin-top:12px"><button class="btn sp ${fol?'':'pri'}" data-act="follow" data-id="${id}">${fol?'Following':'Follow'}</button><button class="btn sp" data-act="dmperson" data-id="${id}">${th?'Message':'Message'}</button></div></div>
   <div class="tabs"><button class="on">Posts</button></div>${posts.length?`<div class="grid3">${posts.slice(0,60).map(tileHTML).join('')}</div>`:'<div class="empty">No posts yet.</div>'}`}
ACT.follow=el=>{followToggle(el.getAttribute('data-id'));render(false)};
ACT.ptab=el=>{UI.profileTab=el.getAttribute('data-t');render(false)};
ACT.hl=el=>{const h=S.highlights.find(x=>x.id===el.getAttribute('data-id'));if(!h)return;const items=h.stories.map(id=>(S.myStories||[]).find(s=>s.id===id)).filter(Boolean).reverse();openStoryViewer(items,'me',h.name)};
ACT.newhl=()=>{openModal(`<h3>New highlight</h3><div class="field"><input class="in" id="hlname" placeholder="Name, e.g. Maps"></div><div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="hladd">Create</button></div>`)};
ACT.hladd=()=>{const n=$('#hlname').value.trim();if(!n)return;S.highlights.push({id:uid('h'),name:n.slice(0,16),stories:[],color:S.highlights.length%4});closeModal();toast('Highlight created. Pick it when you post a story.')};
// ---- meters ----
const METERS=[['fame','Fame'],['loyalty','Fan loyalty'],['rep','Reputation'],['critic','Critical standing'],['controv','Controversy'],['trust','Trust'],['mystery','Mystery'],['hype','Hype'],['bookPop','Book popularity'],['loreEng','Lore engagement']];
function meters(){return METERS.map(([k,l])=>`<div class="meter"><span>${l}</span><div class="bar"><i style="width:${Math.round(S.stats[k])}%;${k==='controv'?'background:var(--bad)':''}"></i></div><b style="text-align:right;font-variant-numeric:tabular-nums">${Math.round(S.stats[k])}</b></div>`).join('')}
// ---- codex ----
const CTABS=[['lore','Lore'],['canon','Canon'],['theories','Theories'],['rumours','Rumours'],['secrets','Secrets'],['timeline','Timeline']];
VIEWS.codex=function(){
  const t=UI.codexTab;let body='';
  if(t==='lore'){
    const types=[['character','Characters'],['place','Places'],['faction','Factions'],['object','Objects']];
    body=types.map(([k,l])=>{const a=entList(k).sort((x,y)=>y.pop-x.pop);return a.length?`<div class="sect lbl">${l} (${a.length})</div><div class="codex-grid" style="padding:4px 14px 8px">${a.map(entCard).join('')}</div>`:''}).join('')+(S.ships.length?`<div class="sect lbl">Relationships</div>${S.ships.map(s=>S.ents[s.a]&&S.ents[s.b]?`<div class="item" style="cursor:default"><div class="sp"><b>${esc(S.ents[s.a].short)}</b> + <b>${esc(S.ents[s.b].short)}</b><div class="mute sm">${esc(s.kind)}</div></div></div>`:'').join('')}`:'')+(S.quirks.length?`<div class="sect lbl">Details fans have noticed</div>${S.quirks.map(q=>`<div class="item" style="cursor:default"><div class="sp">${esc(q)}</div></div>`).join('')}`:'')}
  else if(t==='canon'){
    body=`<div class="pf"><div class="field"><textarea class="in" id="cfact" placeholder="Write a fact about your world. Fans will treat it as canon."></textarea></div><div class="row wrap"><button class="btn pri sm" data-act="cadd" data-s="true">Add as true</button><button class="btn sm" data-act="cadd" data-s="false">Add as false</button><button class="btn sm" data-act="cadd" data-s="secret">Keep secret</button></div></div>
    ${S.canon.length?S.canon.slice().sort((a,b)=>b.hour-a.hour).map(c=>`<div class="item" style="cursor:default"><div class="sp">${esc(c.text)}<div class="mute sm">${simDate(c.hour)} · via ${esc(c.src)}</div></div><span class="pill ${c.status==='true'?'ok':c.status==='false'?'bad':'gold'}">${c.status==='true'?'True':c.status==='false'?'False':'Secret'}</span></div>`).join(''):'<div class="empty">Nothing is canon yet. Answer fans, confirm theories or post lore and it will appear here.</div>'}`}
  else if(t==='theories'){
    const a=S.theories.slice().sort((x,y)=>(x.status==='open'?0:1)-(y.status==='open'?0:1)||y.support-x.support).slice(0,40);
    body=a.length?a.map(x=>`<div class="item" style="cursor:default;flex-direction:column;gap:6px"><div>“${esc(x.text)}”</div><div class="mute sm">by @${esc(userOf(x.by))} · ${fmt(x.support)} support · ${fmt(x.against)} against${x.hit>=.66?' · <b style="color:var(--bad)">dangerously close</b>':''}</div>${x.status==='open'?`<div class="row wrap"><button class="btn sm pri" data-act="theory" data-id="${x.id}" data-a="confirm">It's true</button><button class="btn sm" data-act="theory" data-id="${x.id}" data-a="deny">It's false</button><button class="btn sm" data-act="theory" data-id="${x.id}" data-a="secret">Neither</button></div>`:`<span class="pill ${x.status==='confirmed'?'ok':'bad'}" style="align-self:flex-start">${x.status}</span>`}</div>`).join(''):'<div class="empty">No theories yet.</div>'}
  else if(t==='rumours'){
    body=`<div class="pf"><div class="field"><input class="in" id="rumtxt" placeholder="Start a rumour, e.g. the next book is a prequel"></div><button class="btn sm pri" data-act="rumstart">Start rumour</button></div>`+
    (S.rumours.length?S.rumours.slice().reverse().map(r=>`<div class="item" style="cursor:default;flex-direction:column;gap:6px"><div>“${esc(r.text)}”</div><div class="mute sm">${timeAgo(r.hour)} · ${r.status==='circulating'?`spreading (${fmt(r.spread)})`:r.status}${r.src==='me'?' · started by you':''}</div>${r.status==='circulating'?`<div class="row wrap"><button class="btn sm pri" data-act="rum" data-id="${r.id}" data-a="confirm">Confirm</button><button class="btn sm" data-act="rum" data-id="${r.id}" data-a="deny">Deny</button></div>`:''}</div>`).join(''):'<div class="empty">No rumours circulating.</div>')}
  else if(t==='secrets'){
    body=`<div class="sect lbl">Your secrets</div>${S.secrets.map(s=>`<div class="item" style="cursor:default"><div class="sp">${esc(s.text)}</div><span class="pill ${s.leaked?'bad':'ok'}">${s.leaked?'Leaked':'Safe'}</span></div>`).join('')||'<div class="empty">No secrets recorded.</div>'}<div class="sect lbl">Mysteries</div>${S.mysteries.map(m=>`<div class="item" style="cursor:default"><div class="sp">${esc(m.text)}${m.gen?'<div class="mute sm">fan-noticed</div>':''}</div><button class="btn sm" data-act="mysolve" data-id="${m.id}">${m.solved?'Solved':'Mark solved'}</button></div>`).join('')}`}
  else body=`<div class="sect lbl">Timeline</div>${S.timeline.map((x,i)=>`<div class="item" style="cursor:default"><span class="dot"></span><div class="sp">${esc(x)}</div></div>`).join('')}<div class="pf"><div class="field"><input class="in" id="tlnew" placeholder="Add an event to the timeline"></div><button class="btn sm" data-act="tladd">Add event</button></div>`;
  return `<div class="row" style="padding:14px 14px 4px"><h2 class="h sp" style="margin:0">Codex</h2><button class="btn sm" data-act="bookform">Add book / lore</button></div><div class="chips" style="padding-top:6px">${CTABS.map(([k,l])=>`<button class="${t===k?'on':''}" data-act="ctab" data-t="${k}">${l}</button>`).join('')}</div>${body}`};
ACT.ctab=el=>{UI.codexTab=el.getAttribute('data-t');render(false)};
ACT.cadd=el=>{const v=$('#cfact').value.trim();if(!v){toast('Write a fact first');return}addCanonFact(v,el.getAttribute('data-s'));$('#cfact').value='';render(false);toast('Added')};
ACT.rumstart=()=>{const v=$('#rumtxt').value.trim();if(!v){toast('Write the rumour first');return}startRumour(v);render(false);toast('Rumour released')};
ACT.mysolve=el=>{const m=S.mysteries.find(x=>x.id===el.getAttribute('data-id'));if(m){m.solved=!m.solved;if(m.solved){S.stats.loreEng=clamp(S.stats.loreEng+2,0,100);canonAdd({text:'Solved: '+m.text,status:'true',src:'codex'})}render(false)}};
ACT.tladd=()=>{const v=$('#tlnew').value.trim();if(!v)return;S.timeline.push(v);render(false)};
// ---- studio ----
const STABS=[['stats','Stats'],['books','Books'],['world','World'],['events','Events']];
VIEWS.studio=function(){
  const t=UI.studioTab;let body='';
  if(t==='stats')body=`<div class="pf"><div class="stg"><div class="tile"><b>${fmt(S.followers)}</b><span class="mute sm">followers</span></div><div class="tile"><b>${S.threads.length}</b><span class="mute sm">conversations</span></div><div class="tile"><b>${fmt(S.pids.length)}</b><span class="mute sm">people in the world</span></div><div class="tile"><b>${Math.floor(S.hour/24)}</b><span class="mute sm">days elapsed</span></div></div><div style="margin-top:14px">${meters()}</div>${S.controversies.length?`<div class="lbl" style="margin-top:14px">Active controversies</div>${S.controversies.slice(-5).reverse().map(c=>`<div class="ev">${esc(c.title)} <span class="pill bad">${Math.round(c.intensity)}</span></div>`).join('')}`:''}</div>`;
  else if(t==='books')body=`<div class="pf"><button class="btn pri" data-act="bookform">Add a book</button></div>${S.books.map(b=>`<div class="item" style="cursor:default;flex-direction:column;gap:6px"><div class="row" style="width:100%"><div style="width:40px;height:56px;border-radius:5px;overflow:hidden;flex:none">${artHTML({art:'cover',labels:[b.title,authorDisplay()],seed:b.id})}</div><div class="sp"><div class="b">${esc(b.title)}</div><div class="mute sm">${esc(b.genre)} · ${b.status==='published'?'Published · '+fmt(b.sales)+' copies':b.relHour?'Releases '+simDate(b.relHour):'Release date not set'}</div></div></div>${b.status==='upcoming'?`<div class="row wrap"><input class="in" type="number" min="0" value="30" id="rel_${b.id}" style="width:90px"><button class="btn sm" data-act="relset" data-id="${b.id}">Set release in days</button><button class="btn sm pri" data-act="relnow" data-id="${b.id}">Release now</button></div>`:''}</div>`).join('')}`;
  else if(t==='world')body=`<div class="pf"><div class="lbl">Simulation speed</div><div class="seg" style="margin:6px 0 14px;flex-wrap:wrap">${[['slow','Slow'],['normal','Normal'],['fast','Fast'],['vfast','Very fast']].map(([k,l])=>`<button class="${S.speed===k?'on':''}" data-act="speed" data-s="${k}">${l}</button>`).join('')}</div>
   <div class="row wrap"><button class="btn ${S.paused?'pri':''}" data-act="pause">${S.paused?'Resume':'Pause'} simulation</button></div>
   <div class="lbl" style="margin-top:16px">Skip time</div><div class="row wrap" style="margin-top:6px"><button class="btn sm" data-act="skip" data-h="6">+6 hours</button><button class="btn sm" data-act="skip" data-h="24">+1 day</button><button class="btn sm" data-act="skip" data-h="72">+3 days</button><button class="btn sm" data-act="skip" data-h="168">+1 week</button></div>
   <div class="lbl" style="margin-top:16px">Theme</div><div class="seg" style="margin-top:6px">${[['auto','System'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${(S.settings.theme||'auto')===k?'on':''}" data-act="theme" data-t="${k}">${l}</button>`).join('')}</div>
   <div class="lbl" style="margin-top:16px">Your world</div><div class="row wrap" style="margin-top:6px"><button class="btn sm" data-act="savenow">Save now</button><button class="btn sm" data-act="expand">Generate more lore</button><button class="btn sm warn" data-act="reset">Start a new world</button></div><div class="mute sm" style="margin-top:8px">The world saves automatically in this browser.</div></div>`;
  else body=`<div class="pf">${S.events.length?S.events.slice().reverse().slice(0,80).map(e=>`<div class="ev ${e.rare?'rare':''}"><div class="mute sm">${simDate(e.h)}${e.rare?' · rare event':''}</div>${esc(e.text)}</div>`).join(''):'<div class="empty">Nothing notable yet.</div>'}</div>`;
  return `<div class="row" style="padding:14px 14px 4px"><h2 class="h sp" style="margin:0">Studio</h2><span class="chip">${esc(simClock())}</span></div><div class="chips" style="padding-top:6px">${STABS.map(([k,l])=>`<button class="${t===k?'on':''}" data-act="stab" data-t="${k}">${l}</button>`).join('')}</div>${body}`};
ACT.stab=el=>{UI.studioTab=el.getAttribute('data-t');render(false)};
ACT.speed=el=>{S.speed=el.getAttribute('data-s');S.paused=false;startLoops();render(false)};
ACT.skip=el=>{const h=+el.getAttribute('data-h');const was=S.paused;toast('Skipping '+h+' hours…');setTimeout(()=>{for(let i=0;i<h;i++){try{tick()}catch(e){console.error(e)}}S.paused=was;saveWorld();render(false);toast('Time moved forward')},40)};
ACT.theme=el=>{S.settings.theme=el.getAttribute('data-t');applyTheme();render(false)};
function applyTheme(){const t=S&&S.settings&&S.settings.theme;const r=document.documentElement;if(t==='light'||t==='dark')r.setAttribute('data-theme',t);else r.removeAttribute('data-theme')}
ACT.savenow=()=>{toast(saveWorld()?'Saved':'Could not save (storage full?)')};
ACT.expand=()=>{const o=expandLore(5);_entRe=null;toast(o.length?o[0]:'World expanded');render(false)};
ACT.reset=()=>confirmBox('Delete this world and start over?','Start over',()=>{stopLoops();resetWorld();location.reload()});
ACT.relset=el=>{const id=el.getAttribute('data-id');const d=+$('#rel_'+id).value||0;setRelease(id,d);render(false);toast('Release date set')};
ACT.relnow=el=>{const b=S.books.find(x=>x.id===el.getAttribute('data-id'));if(b){publishBook(b);render(false);toast('Released')}};
// ---- story viewer ----
let _sv=null;
function openStoryViewer(items,who,title){
  if(!items||!items.length)return;
  _sv={items,i:0,who,t:0,title,paused:false};
  $('#storyv').classList.add('on');drawStory();
  clearInterval(_sv.tm);_sv.tm=setInterval(()=>{if(!_sv||_sv.paused)return;_sv.t+=100;const b=$('#svbar'+_sv.i);if(b)b.style.width=Math.min(100,_sv.t/50)+'%';if(_sv.t>=5000)svNext()},100)}
function drawStory(){
  if(!_sv)return;const s=_sv.items[_sv.i];S.seen[s.id]=1;_sv.t=0;
  const mine=s.by==='me';
  const bg=s.img&&S.imgs[s.img.id]?`background-image:url(${S.imgs[s.img.id]})`:`background:${s.bg||bgFor(s.id)}`;
  let poll='';
  if(s.poll){const tot=s.poll.opts.reduce((a,o)=>a+o.v,0)||1;poll=`<div class="sv-poll"><div class="b">${esc(s.poll.q||'')}</div>${s.poll.opts.map((o,i)=>`<div class="o" data-act="svvote" data-i="${i}"><i style="width:${mine||s.poll.voted!=null?Math.round(o.v/tot*100):0}%"></i><span>${esc(o.t)}${mine||s.poll.voted!=null?' · '+Math.round(o.v/tot*100)+'%':''}</span></div>`).join('')}</div>`}
  const foot=mine?`<div style="position:relative;z-index:2;padding:12px 16px;padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));background:linear-gradient(transparent,rgba(0,0,0,.65));font-size:13px">${fmt(s.views)} views · ${fmt(s.replies||0)} replies · ${fmt(s.reacts||0)} reactions${s.question?' · question sticker':''}</div>`
   :`<div style="position:relative;z-index:2;padding:12px 14px;padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));display:flex;gap:8px;background:linear-gradient(transparent,rgba(0,0,0,.65))"><input id="svreply" class="in" style="background:rgba(0,0,0,.4);color:#fff;border-color:rgba(255,255,255,.4);border-radius:99px" placeholder="Reply to ${esc(userOf(s.by))}…" data-enter="svsend"><button class="btn pri" data-act="svsend">Send</button></div>`;
  const nm=mine?esc(S.authorHandle):esc(userOf(s.by));
  $('#storyv').innerHTML=`<div class="sv-in"><div class="sv-bg" style="${bg}">${s.img&&S.imgs[s.img.id]?'':esc(s.text||'')}</div>
   <div class="sv-top"><div class="row" style="gap:4px;margin-bottom:10px">${_sv.items.map((x,i)=>`<div class="sv-bar sp"><i id="svbar${i}" style="width:${i<_sv.i?100:0}%"></i></div>`).join('')}</div><div class="row">${avatarOf(s.by,34)}<div class="sp b">${nm}${_sv.title?' · '+esc(_sv.title):''} <span style="font-weight:400;opacity:.7">${timeAgo(s.hour)}</span></div><button class="iconbtn" data-act="svclose" aria-label="Close" style="color:#fff">${ic('x')}</button></div></div>
   <div style="position:absolute;inset:80px 0 120px 0;z-index:1;display:flex"><div data-act="svprev" style="flex:1"></div><div data-act="svnext" style="flex:2"></div></div>
   ${s.img&&S.imgs[s.img.id]&&s.text?`<div style="position:relative;z-index:2;margin:auto 20px 10px;padding:10px 14px;border-radius:12px;background:rgba(0,0,0,.55);text-align:center">${esc(s.text)}</div>`:'<div style="flex:1"></div>'}${poll}${foot}</div>`}
function svNext(){if(!_sv)return;if(_sv.i<_sv.items.length-1){_sv.i++;drawStory()}else closeStory()}
function closeStory(){if(_sv)clearInterval(_sv.tm);_sv=null;$('#storyv').classList.remove('on');$('#storyv').innerHTML='';render(false)}
ACT.svnext=()=>svNext();
ACT.svprev=()=>{if(_sv&&_sv.i>0){_sv.i--;drawStory()}};
ACT.svclose=()=>closeStory();
ACT.svvote=el=>{if(!_sv)return;const s=_sv.items[_sv.i];if(s.by==='me'||!s.poll||s.poll.voted!=null)return;const i=+el.getAttribute('data-i');s.poll.voted=i;s.poll.opts[i].v++;drawStory()};
ACT.svsend=()=>{if(!_sv)return;const s=_sv.items[_sv.i];const v=$('#svreply').value.trim();if(!v)return;const t=startThread(s.by);sendDM(t,v);t.msgs[t.msgs.length-1].story=(s.text||'your story').slice(0,40);toast('Sent');$('#svreply').value=''};
ACT.story=el=>{const id=el.getAttribute('data-id');
  const items=S.stories.filter(s=>s.by===id).sort((a,b)=>a.hour-b.hour);
  if(id==='me'){openStoryViewer(items,'me');return}
  openStoryViewer(items,id)};
document.addEventListener('mouseover',e=>{if(_sv&&e.target.closest&&e.target.closest('.sv-in'))_sv.paused=!!e.target.closest('input')},{passive:true});
