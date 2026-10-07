// ---------- setup wizard ----------
let W=null;
const FAME_OPTS=[['unknown','Unknown debut author'],['rising','Rising name'],['established','Established author'],['bestseller','Bestselling author'],['phenomenon','Global phenomenon']];
const REP_OPTS=[['beloved','Beloved by readers'],['respected','Respected by critics'],['unknown','No reputation yet'],['polarizing','Polarizing'],['controversial','Controversial']];
function newW(){return {step:1,author:{name:'',pen:'',user:'',age:35,genre:'',style:'',personality:'',bio:'',career:'',fameLevel:'rising',followers:FAME_PRESET.rising,numBooks:1,reputation:'unknown'},books:[{status:'published'}],avatar:null,auto:true,folEdited:false}}
function openWizard(){if(!W)W=newW();drawWizard()}
function readWiz(){
  if(!W)return;const g=id=>{const e=$('#'+id);return e?e.value:null};const A=W.author;
  if(W.step===1){['name','pen','user','genre','style','personality','bio','career'].forEach(k=>{const v=g('w_'+k);if(v!=null)A[k]=v});
    const age=g('w_age');if(age!=null)A.age=clamp(+age||35,14,110);const fl=g('w_fameLevel');if(fl!=null)A.fameLevel=fl;const rp=g('w_reputation');if(rp!=null)A.reputation=rp;
    const fo=g('w_followers');if(fo!=null)A.followers=Math.max(1,Math.round(+fo||1));const nb=g('w_numBooks');if(nb!=null)A.numBooks=clamp(Math.round(+nb||0),0,40)}
  if(W.step===2){const roots=$$('#wbooks [data-bk]');if(roots.length)W.books=roots.map(r=>readBookForm(r))}
  const au=$('#w_auto');if(au)W.auto=au.checked}
function drawWizard(){
  const A=W.author,s=W.step;let body='';
  if(s===1){
    body=`<h2 class="h">Who are you?</h2><p class="mute">Create the author the world will revolve around.</p>
    <div class="row" style="margin:10px 0 16px">${W.avatar?`<div class="av" style="width:72px;height:72px;background-image:url(${W.avatar})"></div>`:`<div class="av" style="width:72px;height:72px;background:linear-gradient(135deg,var(--accent),#222);font-size:26px">${esc(initials(A.pen||A.name||'A'))}</div>`}<label class="btn sm" style="cursor:pointer">Profile photo<input type="file" accept="image/*" data-on-change="wavatar" hidden></label><span class="sp"></span><button class="btn sm" data-act="wfill">Quick-fill example</button></div>
    <div class="g2">
    <div class="field"><label class="lbl">Name</label><input class="in" id="w_name" value="${esc(A.name)}" placeholder="Eleanor Vance-Hale"></div>
    <div class="field"><label class="lbl">Pen name (optional)</label><input class="in" id="w_pen" value="${esc(A.pen)}" placeholder="E. V. Hale"></div>
    <div class="field"><label class="lbl">Username</label><input class="in" id="w_user" value="${esc(A.user)}" placeholder="evhale.writes"></div>
    <div class="field"><label class="lbl">Age</label><input class="in" type="number" id="w_age" min="14" max="110" value="${A.age}"></div>
    <div class="field"><label class="lbl">Genre</label><input class="in" id="w_genre" value="${esc(A.genre)}" placeholder="Epic fantasy, thriller, romance…"></div>
    <div class="field"><label class="lbl">Writing style</label><input class="in" id="w_style" value="${esc(A.style)}" placeholder="Lyrical, slow-burn…"></div>
    <div class="field"><label class="lbl">Personality</label><input class="in" id="w_personality" value="${esc(A.personality)}" placeholder="Dry-humoured, secretive…"></div>
    <div class="field"><label class="lbl">Number of books published</label><input class="in" type="number" min="0" max="40" id="w_numBooks" value="${A.numBooks}"></div>
    <div class="field"><label class="lbl">Fame level</label><select class="in" id="w_fameLevel" data-on-change="wfame">${FAME_OPTS.map(([k,l])=>`<option value="${k}" ${A.fameLevel===k?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="field"><label class="lbl">Starting followers</label><input class="in" type="number" min="1" id="w_followers" value="${A.followers}"></div>
    <div class="field"><label class="lbl">Reputation</label><select class="in" id="w_reputation">${REP_OPTS.map(([k,l])=>`<option value="${k}" ${A.reputation===k?'selected':''}>${l}</option>`).join('')}</select></div></div>
    <div class="field"><label class="lbl">Bio</label><textarea class="in" id="w_bio" rows="2">${esc(A.bio)}</textarea></div>
    <div class="field"><label class="lbl">Career background</label><textarea class="in" id="w_career" rows="2">${esc(A.career)}</textarea></div>`}
  else if(s===2){
    body=`<h2 class="h">Your books and your world</h2><p class="mute">Everything here becomes canon. Characters, secrets and mysteries you list become things fans will love, theorise about and argue over. Leave anything blank and the world will invent it.</p>
    <div id="wbooks">${W.books.map((b,i)=>`<details class="card bookc" ${i===0||W.books.length===1?'open':''}><summary>${esc(b.title||'Book '+(i+1))}${W.books.length>1?`<span class="sp"></span><button class="btn sm warn" data-act="wbrm" data-i="${i}">Remove</button>`:''}</summary><div style="margin-top:12px">${bookFormHTML(i,b)}</div></details>`).join('')}</div>
    <div class="row wrap"><button class="btn" data-act="wbadd">Add another book</button></div>
    <label class="row" style="margin-top:14px"><input type="checkbox" id="w_auto" ${W.auto?'checked':''}> Auto-generate extra lore (new characters, places, factions and mysteries)</label>`}
  else{
    const n=W.books.filter(b=>b.title).length;
    body=`<h2 class="h">Ready to enter</h2><p class="mute">Here is the world you are about to step into.</p>
    <div class="card pad"><div class="b" style="font-size:18px">${esc(A.pen||A.name||'Unnamed author')}</div><div class="mute">@${esc(uniqueHandleMe(A.user||(A.pen||A.name||'author').toLowerCase().replace(/\s+/g,'.')))} · ${esc(A.genre||'fiction')} · age ${A.age}</div><hr class="s"><div class="nums" style="justify-content:space-around"><div><b>${fmt(A.followers)}</b><span class="mute sm">followers</span></div><div><b>${Math.max(A.numBooks,W.books.filter(b=>b.title&&b.status!=='upcoming').length)}</b><span class="mute sm">published</span></div><div><b>${W.books.filter(b=>b.status==='upcoming'&&b.title).length}</b><span class="mute sm">upcoming</span></div></div><hr class="s"><div class="mute sm">${n?W.books.filter(b=>b.title).map(b=>esc(b.title)).join(' · '):'Your books will be generated for you.'}</div></div>
    <p class="mute" style="margin-top:14px">Thousands of readers, critics, rivals, journalists and publishers are about to notice you. They will remember what you say. Time starts moving as soon as you enter.</p>`}
  $('#wiz').className='wiz';
  $('#wiz').innerHTML=`<div class="in-w"><div class="brand" style="font-size:30px;flex:none">Fol<i>io</i></div><h1>Become <i>famous</i>.</h1><div class="steps">${[1,2,3].map(i=>`<i class="${i<=s?'on':''}"></i>`).join('')}</div>${body}
    <div class="wizbar"><button class="btn" data-act="wback" ${s===1?'disabled':''}>Back</button>${s<3?`<button class="btn pri" data-act="wnext">Continue</button>`:`<button class="btn pri" data-act="wenter" style="font-size:16px;padding:12px 28px">ENTER WORLD</button>`}</div></div>`;
  const sc=$('#wiz');sc.scrollTop=0}
ACT.wfame=el=>{readWiz();W.author.fameLevel=el.value;W.author.followers=FAME_PRESET[el.value]||W.author.followers;W.author.numBooks=Math.max(W.author.numBooks,{unknown:1,rising:2,established:5,bestseller:8,phenomenon:12}[el.value]||1);drawWizard()};
ACT.wavatar=async el=>{const f=el.files&&el.files[0];if(!f)return;readWiz();try{W.avatar=await fileToDataURL(f,320)}catch(e){toast('Could not read that image')}drawWizard()};
ACT.wfill=()=>{const E=EXAMPLE_UNIVERSE;W.author=Object.assign({},W.author,{name:E.author.name,pen:E.author.pen,user:E.author.user,age:E.author.age,genre:E.author.genre,style:E.author.style,personality:E.author.personality,bio:E.author.bio,career:E.author.career,fameLevel:E.author.fameLevel,followers:E.author.followers,reputation:E.author.reputation,numBooks:3});W.books=[Object.assign({status:'published'},E.book)];if(W.step!==1)W.step=1;drawWizard();toast('Example filled in. Edit anything you like.')};
ACT.wbadd=()=>{readWiz();W.books.push({status:'upcoming',genre:W.author.genre});drawWizard();const d=$$('#wbooks details');if(d.length)d[d.length-1].open=true};
ACT.wbrm=(el,e)=>{e.preventDefault();readWiz();W.books.splice(+el.getAttribute('data-i'),1);if(!W.books.length)W.books=[{status:'published'}];drawWizard()};
ACT.wback=()=>{readWiz();W.step=Math.max(1,W.step-1);drawWizard()};
ACT.wnext=()=>{
  readWiz();
  if(W.step===1){if(!W.author.name.trim()&&!W.author.pen.trim()){toast('Give your author a name');return}if(!W.author.genre.trim())W.author.genre='Fantasy'}
  W.step=Math.min(3,W.step+1);drawWizard()};
ACT.wenter=()=>{
  readWiz();const A=W.author;
  if(!A.name.trim()&&!A.pen.trim()){W.step=1;drawWizard();toast('Give your author a name');return}
  $('#wiz').innerHTML=`<div class="in-w tc" style="padding-top:30vh"><div class="brand" style="font-size:40px;flex:none">Fol<i>io</i></div><p class="mute">Building your world…</p></div>`;
  setTimeout(()=>{
    try{
      const author=Object.assign({},A);author.name=A.name.trim()||A.pen.trim();author.pen=A.pen.trim();author.genre=A.genre.trim()||'Fantasy';
      author.user=uniqueHandleMe(A.user||(A.pen||A.name).toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,''));
      const books=W.books.filter(b=>b.title&&b.title.trim()).map(b=>Object.assign({},b,{genre:b.genre||author.genre}));
      newWorld({author,books});
      if(W.avatar)S.author.avatar=storeImg(W.avatar);
      if(W.auto)expandLore(6);
      _entRe=null;applyTheme();saveWorld();
      const av=W.avatar;W=null;
      $('#wiz').className='';$('#wiz').innerHTML='';
      UI.hist=[];UI.view='home';UI.param=null;startLoops();render(true);toast('Welcome to Folio');
    }catch(e){console.error(e);$('#wiz').className='wiz';W=W||newW();toast('Something went wrong building the world: '+e.message);drawWizard()}
  },60)};
