// ---------- composers, book form, profile editor ----------
const POST_TYPES=[['photo','Photo'],['text','Thought'],['teaser','Teaser'],['character','Character'],['quote','Quote'],['cryptic','Cryptic'],['lore','Lore reveal'],['bts','Behind the scenes'],['writing','Writing update'],['cover','Cover reveal'],['release','Release'],['personal','Personal'],['poll','Poll'],['qa','Q&A'],['rumour','Rumour'],['delay','Delay'],['story','Story']];
const PLACEHOLDER={photo:'Share a photo…',text:'What is on your mind?',teaser:'Give them a hint of what is coming…',character:'Introduce or talk about a character…',quote:'Post a line from your book…',cryptic:'Say something cryptic…',lore:'Reveal something about your world. It becomes canon.',bts:'Show the work behind the work…',writing:'How is the writing going?',cover:'Say something about the cover…',release:'Announce your book…',personal:'Something from your own life…',poll:'Ask your fans a question…',qa:'Ask me anything. Questions open now.',rumour:'Drop a rumour…',delay:'Explain the delay…'};
const ART_KINDS=[['portrait','Character portrait','character'],['map','Map','map'],['symbol','Symbol / sigil','symbol'],['board','Theory board','doc'],['manuscript','Manuscript page','manuscript'],['page','Book page','manuscript'],['note','Handwritten note','note'],['desk','Writing desk','desk'],['doc','Lore document','doc'],['timeline','Timeline','doc'],['quote','Quote card','']];
const USE_OPTS=[['','Nothing special'],['character','A character'],['map','A map'],['symbol','A symbol'],['cover','A cover'],['manuscript','Manuscript'],['note','A note'],['desk','My desk'],['doc','A lore document']];
UI.cmp=null;
function newCmp(type){return {type:type||'photo',text:'',img:null,use:'',shows:'',bookId:null,pollOpts:['',''],relMode:'now',days:30,artKind:'portrait',artLabel:''}}
function openComposer(type){UI.cmp=newCmp(type);drawComposer()}
function syncCmp(){
  const c=UI.cmp;if(!c)return;const g=id=>{const e=$('#'+id);return e?e.value:null};
  const t=g('cmptext');if(t!=null)c.text=t;
  const u=g('cmpuse');if(u!=null){c.use=u;if(c.img)c.img.use=u||undefined}
  const s=g('cmpshows');if(s!=null){c.shows=s;if(c.img)c.img.shows=s}
  const b=g('cmpbook');if(b!=null)c.bookId=b||null;
  const rm=g('cmprel');if(rm!=null)c.relMode=rm;
  const d=g('cmpdays');if(d!=null)c.days=Math.max(0,+d||0);
  const ak=g('cmpart');if(ak!=null)c.artKind=ak;
  const al=g('cmpartlabel');if(al!=null)c.artLabel=al;
  if(c.type==='poll'){c.pollOpts=[0,1,2,3].map(i=>g('cmppo'+i)).filter(x=>x!=null)}}
function bookSel(c,onlyUp){
  const bs=S.books.filter(b=>onlyUp?b.status==='upcoming':true);
  if(!bs.length)return '<div class="mute sm">You have no books for this. Add one in the Codex.</div>';
  if(!c.bookId||!bs.some(b=>b.id===c.bookId))c.bookId=bs[0].id;
  return `<div class="field"><label class="lbl">Which book</label><select class="in" id="cmpbook" data-on-change="cmpredraw">${bs.map(b=>`<option value="${b.id}" ${c.bookId===b.id?'selected':''}>${esc(b.title)} (${b.status})</option>`).join('')}</select></div>`}
function drawComposer(){
  const c=UI.cmp;if(!c)return;
  if(c.type==='story')return drawStoryComposer();
  const t=c.type;
  let extra='';
  if(['cover','release','delay'].includes(t))extra+=bookSel(c,t==='delay');
  if(t==='release'){const b=S.books.find(x=>x.id===c.bookId);if(b&&b.status==='upcoming')extra+=`<div class="g2"><div class="field"><label class="lbl">Release</label><select class="in" id="cmprel" data-on-change="cmpredraw"><option value="now" ${c.relMode==='now'?'selected':''}>Out now</option><option value="date" ${c.relMode==='date'?'selected':''}>Announce a date</option></select></div>${c.relMode==='date'?`<div class="field"><label class="lbl">Days from now</label><input class="in" type="number" min="0" id="cmpdays" value="${c.days}"></div>`:''}</div>`}
  if(t==='delay')extra+=`<div class="field"><label class="lbl">Delay by (days)</label><input class="in" type="number" min="1" id="cmpdays" value="${c.days||30}"></div>`;
  if(t==='poll')extra+=`<div class="field"><label class="lbl">Options</label>${[0,1,2,3].map(i=>`<input class="in" id="cmppo${i}" style="margin-bottom:6px" placeholder="Option ${i+1}${i<2?'':' (optional)'}" value="${esc(c.pollOpts[i]||'')}">`).join('')}</div>`;
  const prev=c.img?`<div class="media" style="max-width:240px;border-radius:12px;margin:8px 0;aspect-ratio:1/1">${c.img.kind==='upload'&&S.imgs[c.img.id]?`<img class="media" src="${S.imgs[c.img.id]}" alt="">`:artHTML(c.img)}</div>`:'';
  const imgBlock=t==='qa'||t==='poll'&&false?'':`<div class="field"><label class="lbl">Image</label><div class="row wrap"><label class="btn sm" style="cursor:pointer">Upload<input type="file" accept="image/*" id="cmpfile" data-on-change="cmpfile" hidden></label>${c.img?`<button class="btn sm warn" data-act="cmprmimg">Remove</button>`:''}</div>
    <div class="row wrap" style="margin-top:6px"><select class="in" id="cmpart" style="width:auto;flex:1">${ART_KINDS.map(([k,l])=>`<option value="${k}" ${c.artKind===k?'selected':''}>${l}</option>`).join('')}</select><input class="in" id="cmpartlabel" style="flex:1" placeholder="Name on it (optional)" value="${esc(c.artLabel)}"><button class="btn sm" data-act="cmpgen">Generate art</button></div>${prev}
    ${c.img?`<div class="g2" style="margin-top:6px"><div class="field"><label class="lbl">This image is…</label><select class="in" id="cmpuse">${USE_OPTS.map(([k,l])=>`<option value="${k}" ${c.use===k?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label class="lbl">What it shows</label><input class="in" id="cmpshows" placeholder="e.g. a character or place name" value="${esc(c.shows)}"></div></div>`:''}</div>`;
  openModal(`<h3>Create</h3><div class="types">${POST_TYPES.map(([k,l])=>`<button class="${t===k?'on':''}" data-act="cmptype" data-t="${k}">${l}</button>`).join('')}</div>${extra}
   <div class="field"><textarea class="in" id="cmptext" rows="4" placeholder="${esc(PLACEHOLDER[t]||'')}">${esc(c.text)}</textarea></div>${imgBlock}
   <div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="cmppost">Post</button></div>`);
  setTimeout(()=>{const x=$('#cmptext');if(x&&!c._f){c._f=1;x.focus()}},30)}
ACT.cmptype=el=>{syncCmp();const t=el.getAttribute('data-t');UI.cmp.type=t;UI.cmp._f=0;drawComposer()};
ACT.cmpredraw=()=>{syncCmp();drawComposer()};
ACT.cmpfile=async el=>{
  const f=el.files&&el.files[0];if(!f)return;syncCmp();
  try{const d=await fileToDataURL(f,900);const id=storeImg(d);UI.cmp.img={kind:'upload',id,use:UI.cmp.use||undefined,shows:UI.cmp.shows||''};}catch(e){toast('Could not read that image')}
  drawComposer()};
ACT.cmprmimg=()=>{syncCmp();UI.cmp.img=null;drawComposer()};
ACT.cmpgen=()=>{syncCmp();const c=UI.cmp;const k=ART_KINDS.find(x=>x[0]===c.artKind)||ART_KINDS[0];
  const lab=c.artLabel.trim();const L=lab?[lab]:c.artKind==='map'?[(entList('place')[0]||{name:'The Reach'}).name]:c.artKind==='portrait'?[(entList('character').filter(e=>!e.gen)[0]||{short:authorDisplay()}).short]:[authorDisplay()];
  c.img={art:k[0],labels:c.artKind==='portrait'||c.artKind==='map'||c.artKind==='symbol'?L:[...L,c.text.slice(0,30)].filter(Boolean),text:c.artKind==='quote'||c.artKind==='note'?(c.text||lab||'…'):'',seed:uid('a')+k[0],use:k[2]||undefined,shows:lab};
  c.use=k[2]||'';c.shows=lab;drawComposer()};
ACT.cmppost=()=>{
  syncCmp();const c=UI.cmp;const t=c.type;let text=c.text.trim();
  if(t!=='release'&&t!=='cover'&&t!=='delay'&&!text&&!c.img){toast('Write something or add an image');return}
  let img=c.img?Object.assign({},c.img):null;if(img&&!img.use)delete img.use;
  const b=S.books.find(x=>x.id===c.bookId);let post=null;
  if(t==='poll'){const opts=c.pollOpts.map(x=>x.trim()).filter(Boolean);if(!text){toast('Ask a question');return}if(opts.length<2){toast('Add at least two options');return}post=createMyPost({ptype:'poll',text,img,poll:{q:text,opts}})}
  else if(t==='cover'){if(!b){toast('Add a book first');return}img=img||{art:'cover',labels:[b.title,authorDisplay()],use:'cover',seed:b.id,shows:b.title};if(!img.use)img.use='cover';post=createMyPost({ptype:'cover',text:text||`Cover reveal: ${b.title}.`,img,bookId:b.id})}
  else if(t==='release'){
    if(!b){toast('Add a book first');return}
    if(b.status==='upcoming'&&c.relMode==='now'){publishBook(b);post=S.posts.find(p=>p.by==='me'&&p.bookId===b.id&&p.ptype==='release');if(post&&text)post.text=text;if(post&&img&&!img.art)post.img=img}
    else{if(b.status==='upcoming'&&c.relMode==='date')setRelease(b.id,c.days);post=createMyPost({ptype:'release',text:text||(b.status==='upcoming'?`${b.title} arrives ${simDate(S.hour+c.days*24)}.`:`${b.title}. Still here, still yours.`),img:img||{art:'cover',labels:[b.title,authorDisplay()],use:'cover',seed:b.id,shows:b.title},bookId:b.id})}}
  else if(t==='delay'){if(!b){toast('You have no upcoming book to delay');return}const d=Math.max(1,c.days||30);const left=b.relHour?Math.max(0,(b.relHour-S.hour)/24):0;setRelease(b.id,left+d);post=createMyPost({ptype:'delay',text:text||`${b.title} is delayed by ${d} days. I am sorry.`,bookId:b.id,img})}
  else post=createMyPost({ptype:t,text,img});
  closeModal();UI.cmp=null;
  if(post){go('post',post.id);toast('Posted')}else{render(false)}};
// ---- story composer ----
UI.stc=null;
function drawStoryComposer(){
  const s=UI.stc||(UI.stc={text:'',bg:0,img:null,poll:false,pq:'',po:['',''],question:false,hl:''});
  const c=UI.cmp||newCmp('story');UI.cmp=c;c.type='story';
  openModal(`<h3>Create</h3><div class="types">${POST_TYPES.map(([k,l])=>`<button class="${k==='story'?'on':''}" data-act="cmptype2" data-t="${k}">${l}</button>`).join('')}</div>
   <div class="field"><textarea class="in" id="stext" rows="3" placeholder="Your story…">${esc(s.text)}</textarea></div>
   <div class="field"><label class="lbl">Background</label><div class="row wrap">${[0,1,2,3,4,5].map(i=>`<button data-act="stbg" data-i="${i}" aria-label="Background ${i+1}" style="width:36px;height:36px;border-radius:50%;background:${bgFor('story'+i)};border:3px solid ${s.bg===i?'var(--accent)':'transparent'}"></button>`).join('')}<label class="btn sm" style="cursor:pointer">${s.img?'Change photo':'Add photo'}<input type="file" accept="image/*" data-on-change="stfile" hidden></label>${s.img?'<button class="btn sm warn" data-act="strm">Remove photo</button>':''}</div></div>
   <div class="row wrap" style="margin-bottom:10px"><label class="row"><input type="checkbox" id="stpoll" data-on-change="stredraw" ${s.poll?'checked':''}> Poll</label><label class="row"><input type="checkbox" id="stq" ${s.question?'checked':''}> Question sticker</label></div>
   ${s.poll?`<div class="field"><input class="in" id="stpq" placeholder="Poll question" value="${esc(s.pq)}" style="margin-bottom:6px"><input class="in" id="stpo0" placeholder="Option 1" value="${esc(s.po[0])}" style="margin-bottom:6px"><input class="in" id="stpo1" placeholder="Option 2" value="${esc(s.po[1])}"></div>`:''}
   <div class="field"><label class="lbl">Save to highlight</label><select class="in" id="sthl"><option value="">Don't save</option>${S.highlights.map(h=>`<option value="${h.id}" ${s.hl===h.id?'selected':''}>${esc(h.name)}</option>`).join('')}</select></div>
   <div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="stpost">Share to story</button></div>`)}
function syncStc(){const s=UI.stc;if(!s)return;const g=id=>{const e=$('#'+id);return e};
  if(g('stext'))s.text=g('stext').value;if(g('stpoll'))s.poll=g('stpoll').checked;if(g('stq'))s.question=g('stq').checked;
  if(g('stpq'))s.pq=g('stpq').value;if(g('stpo0')){s.po=[g('stpo0').value,g('stpo1').value]}if(g('sthl'))s.hl=g('sthl').value}
ACT.cmptype2=el=>{syncStc();const t=el.getAttribute('data-t');if(t==='story')return;UI.cmp=newCmp(t);drawComposer()};
ACT.stbg=el=>{syncStc();UI.stc.bg=+el.getAttribute('data-i');drawStoryComposer()};
ACT.stredraw=()=>{syncStc();drawStoryComposer()};
ACT.stfile=async el=>{const f=el.files&&el.files[0];if(!f)return;syncStc();try{const d=await fileToDataURL(f,900);UI.stc.img={kind:'upload',id:storeImg(d)}}catch(e){toast('Could not read that image')}drawStoryComposer()};
ACT.strm=()=>{syncStc();UI.stc.img=null;drawStoryComposer()};
ACT.stpost=()=>{
  syncStc();const s=UI.stc;
  if(!s.text.trim()&&!s.img&&!(s.poll&&s.pq.trim())){toast('Add some text, a photo or a poll');return}
  let poll=null;if(s.poll){const o=s.po.map(x=>x.trim()).filter(Boolean);if(!s.pq.trim()||o.length<2){toast('A poll needs a question and two options');return}poll={q:s.pq.trim(),opts:o}}
  createStory({text:s.text.trim(),bg:bgFor('story'+s.bg),img:s.img,poll,question:s.question,hl:s.hl||null});
  closeModal();UI.stc=null;UI.cmp=null;toast('Story shared');render(false)};
ACT.newstory=()=>{UI.stc=null;UI.cmp=newCmp('story');drawStoryComposer()};
// ---- book form (shared with wizard) ----
const BOOK_FIELDS=[['title','Title','in',1],['genre','Genre','in',1],['desc','Description','ta'],['characters','Characters (one per line)','ta'],['protagonist','Protagonist','in',1],['antagonist','Antagonist','in',1],['setting','Setting','ta'],['factions','Factions (one per line)','ta'],['locations','Locations (one per line)','ta'],['magic','Magic or rules of the world','ta'],['timeline','Timeline (one event per line)','ta'],['events','Major events','ta'],['secrets','Secrets fans must not know (one per line)','ta'],['mysteries','Mysteries (one per line)','ta'],['quotes','Quotes from the book (one per line)','ta'],['rel','Relationships, e.g. Elias + Seraphine: tragic romance','ta'],['ending','Ending','ta'],['future','Future books (one title per line)','ta']];
function bookFormHTML(i,b,opt){
  b=b||{};opt=opt||{};
  return `<div data-bk="${i}"><div class="g2"><div class="field"><label class="lbl">Status</label><select class="in" data-f="status" data-on-change="bkstatus"><option value="published" ${b.status!=='upcoming'?'selected':''}>Published</option><option value="upcoming" ${b.status==='upcoming'?'selected':''}>Upcoming</option></select></div><div class="field" data-rd ${b.status==='upcoming'?'':'hidden'}><label class="lbl">Releases in (days)</label><input class="in" type="number" min="0" data-f="releaseDays" value="${b.releaseDays==null?90:b.releaseDays}"></div></div>
  <div class="g2">${BOOK_FIELDS.map(([k,l,t,short])=>`<div class="field" ${t==='ta'&&!short?'style="grid-column:1/-1"':''}><label class="lbl">${l}</label>${t==='ta'?`<textarea class="in" data-f="${k}" rows="2">${esc(b[k]||'')}</textarea>`:`<input class="in" data-f="${k}" value="${esc(b[k]||'')}">`}</div>`).join('')}</div></div>`}
ACT.bkstatus=el=>{const root=el.closest('[data-bk]');const rd=root&&root.querySelector('[data-rd]');if(rd)rd.hidden=el.value!=='upcoming'};
function readBookForm(root){const b={};$$('[data-f]',root).forEach(e=>{b[e.getAttribute('data-f')]=e.value.trim()});b.releaseDays=Math.max(0,+b.releaseDays||0);return b}
ACT.bookform=()=>{
  openModal(`<h3>Add a book</h3><p class="mute sm" style="margin-top:-4px">Everything you enter becomes canon. Fill in as much or as little as you like; the world will invent the rest.</p><div id="bf">${bookFormHTML(0,{status:'upcoming',genre:S.author.genre})}</div>
   <label class="row" style="margin:6px 0 12px"><input type="checkbox" id="bfauto" checked> Auto-generate extra lore</label>
   <div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="bfsave">Add book</button></div>`)};
ACT.bfsave=()=>{
  const b=readBookForm($('#bf [data-bk]'));if(!b.title){toast('Give the book a title');return}
  if(S.books.some(x=>x.title.toLowerCase()===b.title.toLowerCase())){toast('You already have a book with that title');return}
  const st=b.status==='published'?'published':'upcoming';
  const bk=addBook(Object.assign({},b,{agoDays:st==='published'?R.i(5,40):null}),st,S.books.length+1);
  if(st==='upcoming'&&!b.releaseDays)bk.relHour=null;
  lines(b.future).forEach(t=>{if(!S.books.some(x=>x.title.toLowerCase()===t.toLowerCase()))addBook({title:t,genre:b.genre},'upcoming',S.books.length+1)});
  if($('#bfauto').checked)expandLore(4);
  _entRe=null;S.stats.hype=clamp(S.stats.hype+(st==='upcoming'?3:0),0,100);logEvent('Added to your world: '+bk.title);
  closeModal();toast('Book added');render(false)};
// ---- profile editor ----
ACT.editprofile=()=>{
  const A=S.author;
  openModal(`<h3>Edit profile</h3><div class="row" style="margin-bottom:12px">${avatarOf('me',64)}<label class="btn sm" style="cursor:pointer">Change photo<input type="file" accept="image/*" data-on-change="avfile" hidden></label></div>
   <div class="g2"><div class="field"><label class="lbl">Name</label><input class="in" id="epname" value="${esc(A.name)}"></div><div class="field"><label class="lbl">Pen name</label><input class="in" id="eppen" value="${esc(A.pen||'')}"></div><div class="field"><label class="lbl">Username</label><input class="in" id="epuser" value="${esc(S.authorHandle)}"></div><div class="field"><label class="lbl">Genre</label><input class="in" id="epgenre" value="${esc(A.genre||'')}"></div></div>
   <div class="field"><label class="lbl">Bio</label><textarea class="in" id="epbio" rows="3">${esc(A.bio||'')}</textarea></div>
   <div class="row" style="justify-content:flex-end"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="epsave">Save</button></div>`)};
ACT.avfile=async el=>{const f=el.files&&el.files[0];if(!f)return;try{const d=await fileToDataURL(f,320);S.author.avatar=storeImg(d);toast('Photo updated');ACT.editprofile()}catch(e){toast('Could not read that image')}};
ACT.epsave=()=>{
  const A=S.author;const n=$('#epname').value.trim();if(!n){toast('Name is required');return}
  A.name=n;A.pen=$('#eppen').value.trim();A.genre=$('#epgenre').value.trim()||A.genre;A.bio=$('#epbio').value.trim();
  const u=uniqueHandleMe($('#epuser').value);if(u&&!S.pids.some(id=>S.people[id].user===u))S.authorHandle=u;
  closeModal();render(false);toast('Profile saved')};
