// ---------- UI core ----------
const UI={view:'home',param:null,hist:[],feedFilter:'all',feedLimit:24,profileTab:'grid',q:'',dmId:null,codexTab:'lore',studioTab:'stats',cmSort:'top',cmLimit:40,replyTo:null,replyMode:'normal',dirty:false,pill:false,sendDraft:{}};
const ICONS={
 home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',plus:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
 heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',send:'<path d="M22 3L2 10l8 3 3 8z"/><path d="M22 3L10 13"/>',
 comment:'<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-5.5A8 8 0 1 1 21 12z"/>',bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',book:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
 gauge:'<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>',more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',back:'<path d="M15 4l-8 8 8 8"/>',x:'<path d="M5 5l14 14M19 5L5 19"/>',
 pin:'<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="M7 4l13 8-13 8z"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M4 18l6-6 4 4 3-3 4 4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',news:'<path d="M5 4h12v16H5zM17 8h3v10a2 2 0 0 1-2 2"/><path d="M8 8h6M8 12h6M8 16h4"/>',grid:'<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>'};
function ic(n,cls){return `<svg class="ic ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`}
const VB='<svg class="vb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="var(--accent)"/><path d="M7 12.5l3.2 3.2L17 9" stroke="var(--accent-ink)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.from((r||document).querySelectorAll(s))}
function toast(t){const b=$('#toastbox');if(!b)return;b.innerHTML=`<div class="toast">${esc(t)}</div>`;clearTimeout(toast._t);toast._t=setTimeout(()=>{b.innerHTML=''},2300)}
function initials(n){return String(n||'?').replace(/[^A-Za-z ]/g,'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('')||'?'}
function avatarOf(id,size,ring){
  size=size||38;
  if(id==='me'){const im=S.author.avatar&&S.imgs[S.author.avatar];const st=im?`background-image:url(${im})`:`background:linear-gradient(135deg,var(--accent),#222)`;
    const inner=im?'':esc(initials(authorDisplay()));
    return ring?`<div class="av ring" style="width:${size}px;height:${size}px"><span style="${st};background-size:cover;font-size:${size*.32}px">${inner}</span></div>`:`<div class="av" style="width:${size}px;height:${size}px;${st};font-size:${size*.36}px">${inner}</div>`}
  const p=P(id);const st=`background:linear-gradient(135deg,hsl(${p.hue} 45% 38%),hsl(${(p.hue+50)%360} 50% 24%))`;
  const inner=esc(initials(p.name));
  return ring?`<div class="av ring" style="width:${size}px;height:${size}px"><span style="${st};font-size:${size*.3}px">${inner}</span></div>`:`<div class="av" style="width:${size}px;height:${size}px;${st};font-size:${size*.36}px">${inner}</div>`}
function userOf(id){return id==='me'?S.authorHandle:P(id).user}
function nameOf(id){return id==='me'?authorDisplay():P(id).name}
function verifiedOf(id){return id==='me'?true:!!P(id).verified}
function nmHTML(id,full){return `<span class="nm" data-act="profile" data-id="${id}">${esc(full?nameOf(id):userOf(id))}</span>${verifiedOf(id)?VB:''}`}
function rich(t){return esc(t).replace(/(^|[^&\w])#([A-Za-z][A-Za-z0-9_]*)/g,'$1<span class="tag" data-act="tag" data-q="#$2">#$2</span>').replace(/@([a-z0-9_.]+)/gi,'<span class="tag" data-act="usertag" data-u="$1">@$1</span>')}
function mediaHTML(post){
  const im=post.img;
  if(im){
    if(im.kind==='upload'&&S.imgs[im.id])return `<div class="media" data-act="openpost" data-id="${post.id}"><img class="media" src="${S.imgs[im.id]}" alt="${esc(im.shows||'Image post')}"></div>`;
    if(im.art)return `<div class="media" data-act="openpost" data-id="${post.id}">${artHTML(im)}</div>`}
  if(post.by==='me'&&post.kind!=='news'){
    const lbl={teaser:'Something is coming',cryptic:'',lore:'Lore',quote:'Quote',writing:'Writing update',release:'Release',personal:'',bts:'Behind the scenes',qa:'Q&A',poll:'Poll',rumour:'Rumour',character:'Character',photo:'',text:''}[post.ptype]||'';
    const dark=post.ptype==='cryptic'?'background:#0b0b0e;font-style:italic':`background:${bgFor(post.id)}`;
    return `<div class="tcard" style="${dark}" data-act="openpost" data-id="${post.id}"><span>${esc((post.text||'').slice(0,200))}</span><small>${esc(lbl)}</small></div>`}
  return ''}
function tileHTML(post){
  const im=post.img;let inner='';
  if(im&&im.kind==='upload'&&S.imgs[im.id])inner=`<img src="${S.imgs[im.id]}" alt="" style="width:100%;height:100%;object-fit:cover">`;
  else if(im&&im.art)inner=artHTML(im);
  else inner=`<div class="tcard" style="background:${bgFor(post.id)}">${esc((post.kind==='news'?post.headline:post.text||'').slice(0,90))}</div>`;
  return `<div data-act="openpost" data-id="${post.id}">${inner}${post.pinned?`<span class="ov">${ic('pin','fill')}</span>`:''}<div class="hov">♥ ${fmt(post.likes)}</div></div>`}
// ---------- render ----------
const VIEWS={};
let _raf=0,_scrollMem={};
function go(view,param,opt){
  opt=opt||{};
  const key=UI.view+':'+(UI.param||'');
  const sc=$('#view');if(sc)_scrollMem[key]=sc.scrollTop;
  if(!opt.replace&&(UI.view!==view||UI.param!==param))UI.hist.push({view:UI.view,param:UI.param});
  if(UI.hist.length>40)UI.hist.shift();
  UI.view=view;UI.param=param==null?null:param;UI.replyTo=null;UI.replyMode='normal';UI.cmLimit=40;
  if(view==='messages'||view==='dm'){UI.dmId=view==='dm'?param:null}
  render(true)}
function back(){const h=UI.hist.pop();if(h){UI.view=h.view;UI.param=h.param;UI.replyTo=null;render(true)}else go('home',null,{replace:true})}
function keepInputs(){const o={};$$('#view [data-keep]').forEach(el=>{o[el.getAttribute('data-keep')]={v:el.value,f:document.activeElement===el,s:el.selectionStart}});return o}
function restoreInputs(o){Object.keys(o).forEach(k=>{const el=$('#view [data-keep="'+k+'"]');if(el){el.value=o[k].v;if(o[k].f){el.focus();try{el.setSelectionRange(o[k].s,o[k].s)}catch(e){}}}})}
function render(nav){
  if(!S)return;
  const sc=$('#view');const key=UI.view+':'+(UI.param||'');
  const kept=nav?{}:keepInputs();const top=nav?(_scrollMem[key]||0):sc.scrollTop;
  if(UI.view!=='activity')UI.actKeep={};const fn=VIEWS[UI.view]||VIEWS.home;
  sc.innerHTML=fn();
  sc.scrollTop=top;restoreInputs(kept);
  renderChrome();UI.dirty=false;UI.pill=false;$('#newpill').hidden=true}
function renderChrome(){
  const unreadN=S.notifs.filter(n=>!n.read).length,unreadD=S.threads.reduce((a,t)=>a+(t.unread>0?1:0),0);
  const nav=[['home','Home','home'],['explore','Explore','search'],['create','Create','plus'],['activity','Activity','heart'],['profile','Profile','user']];
  $('#bottom').innerHTML=nav.map(([v,l,i])=>`<button data-act="nav" data-v="${v}" class="${UI.view===v||(v==='profile'&&UI.view==='profile'&&!UI.param)?'on':''}" aria-label="${l}">${v==='profile'?avatarOf('me',28):ic(i)}${v==='activity'&&unreadN?`<span class="badge">${unreadN>99?'99+':unreadN}</span>`:''}</button>`).join('');
  const side=[['home','Home','home'],['explore','Explore','search'],['activity','Activity','heart'],['messages','Messages','send'],['codex','Codex','book'],['studio','Studio','gauge'],['create','Create','plus'],['profile','Profile','user']];
  $('#side').innerHTML=`<div class="brand" data-act="nav" data-v="home">Fol<i>io</i></div>`+side.map(([v,l,i])=>`<button class="navb ${UI.view===v?'on':''}" data-act="nav" data-v="${v}">${ic(i)}<span>${l}</span>${v==='activity'&&unreadN?`<span class="badge" style="position:static;margin-left:auto">${unreadN}</span>`:''}${v==='messages'&&unreadD?`<span class="badge" style="position:static;margin-left:auto">${unreadD}</span>`:''}</button>`).join('');
  const back=['post','dm','person'].includes(UI.view)||(UI.view==='profile'&&UI.param);
  $('#top').innerHTML=(back?`<button class="iconbtn" data-act="back" aria-label="Back">${ic('back')}</button>`:'')+`<div class="brand" data-act="nav" data-v="home">Fol<i>io</i></div>
   <span class="chip ${S.paused?'paused':'live'}" data-act="nav" data-v="studio" style="cursor:pointer" title="Simulation clock">${esc(simClock())}${S.paused?' · paused':' · '+({slow:'slow',normal:'normal',fast:'fast',vfast:'very fast'}[S.speed])}</span>
   <button class="iconbtn" data-act="pause" aria-label="${S.paused?'Resume':'Pause'}">${ic(S.paused?'play':'pause')}</button>
   <button class="iconbtn" data-act="nav" data-v="codex" aria-label="Codex">${ic('book')}</button>
   <button class="iconbtn" data-act="nav" data-v="messages" aria-label="Messages">${ic('send')}${unreadD?`<span class="badge">${unreadD}</span>`:''}</button>`;
  const bn=$('#banner');bn.hidden=!S.paused;bn.textContent='Simulation paused. The wider world is frozen; people still answer you directly.';
  $('#right').innerHTML=rightCol()}
function rightCol(){
  const s=S.stats,tr=computeTrends();
  const sug=S.specials?S.specials.author.slice(0,3).map(P).filter(p=>!S.followingIds.includes(p.id)):[];
  return `<div class="card pad sec"><div class="row">${avatarOf('me',48)}<div class="sp"><div class="b">${esc(S.authorHandle)}${VB}</div><div class="mute sm">${esc(authorDisplay())}</div></div></div>
   <hr class="s"><div class="nums" style="justify-content:space-between"><div><b>${fmt(S.followers)}</b><span class="mute sm">followers</span></div><div><b>${Math.round(s.hype)}</b><span class="mute sm">hype</span></div><div><b>${Math.round(s.rep)}</b><span class="mute sm">reputation</span></div></div></div>
   <div class="card sec"><div class="sect lbl">Trending now</div>${tr.tags.slice(0,5).map(t=>`<div class="trend" data-act="tag" data-q="${esc(t.tag)}"><span><b>${esc(t.tag)}</b><span class="mute sm">${fmt(t.n)} mentions</span></span></div>`).join('')||'<div class="empty">Quiet for now.</div>'}</div>
   ${sug.length?`<div class="card sec"><div class="sect lbl">Authors to follow</div>${sug.map(p=>`<div class="item" style="cursor:default">${avatarOf(p.id,38)}<div class="sp"><div class="b" data-act="profile" data-id="${p.id}" style="cursor:pointer">${esc(p.name)}${VB}</div><div class="mute sm">${esc(p.genre||'author')}</div></div><button class="btn sm pri" data-act="follow" data-id="${p.id}">Follow</button></div>`).join('')}</div>`:''}`}
let _rt=null;
function uiTouch(){UI.dirty=true;if(_rt)return;_rt=setTimeout(()=>{_rt=null;softRender()},450)}
function softRender(){
  if(!S||!UI.dirty)return;
  const ae=document.activeElement;
  const typing=ae&&(ae.tagName==='TEXTAREA'||ae.tagName==='INPUT')&&ae.closest('#view')&&!ae.hasAttribute('data-keep');
  if($('#modal').innerHTML||$('#storyv').classList.contains('on')||$('#wiz').innerHTML)return renderChrome();
  if(typing)return renderChrome();
  const sc=$('#view');
  if((UI.view==='home'||UI.view==='explore')&&sc.scrollTop>320){renderChrome();if(!UI.pill){UI.pill=true;$('#newpill').hidden=false}return}
  render(false)}
// ---------- event delegation ----------
const ACT={};
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.getAttribute('data-act');
  if(ACT[a]){if(el.tagName==='BUTTON'||el.tagName==='A')e.preventDefault();ACT[a](el,e)}});
document.addEventListener('input',e=>{const t=e.target;if(t.matches&&t.matches('[data-on-input]')){const fn=t.getAttribute('data-on-input');if(ACT[fn])ACT[fn](t,e)}});
document.addEventListener('change',e=>{const t=e.target;if(t.matches&&t.matches('[data-on-change]')){const fn=t.getAttribute('data-on-change');if(ACT[fn])ACT[fn](t,e)}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&e.target.matches&&e.target.matches('[data-enter]')){e.preventDefault();const fn=e.target.getAttribute('data-enter');if(ACT[fn])ACT[fn](e.target,e)}});
ACT.nav=el=>{const v=el.getAttribute('data-v');if(v==='create')return openComposer();if(v==='profile')return go('profile',null);UI.hist=[];go(v,null)};
ACT.back=()=>back();
ACT.pause=()=>{S.paused=!S.paused;render()};
ACT.pill=()=>{$('#view').scrollTop=0;render(false)};
document.addEventListener('DOMContentLoaded',()=>{const p=$('#newpill');if(p)p.setAttribute('data-act','pill')});
// ---------- modal helpers ----------
function openModal(html){$('#modal').innerHTML=`<div class="modal" data-act="mbg"><div class="sheet" role="dialog">${html}</div></div>`;}
function closeModal(){$('#modal').innerHTML='';uiTouch()}
ACT.mbg=(el,e)=>{if(e.target===el)closeModal()};
ACT.mclose=()=>closeModal();
function confirmBox(msg,yes,fn){openModal(`<h3>${esc(msg)}</h3><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn" data-act="mclose">Cancel</button><button class="btn pri" data-act="mconfirm">${esc(yes||'Confirm')}</button></div>`);window._cfn=fn}
ACT.mconfirm=()=>{const f=window._cfn;closeModal();if(f)f()};
function fileToDataURL(file,max){
  return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const img=new Image();img.onerror=()=>rej(new Error('bad image'));img.onload=()=>{const s=Math.min(1,(max||900)/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};img.src=fr.result};fr.readAsDataURL(file)})}
function storeImg(dataUrl){const id=uid('i');S.imgs[id]=dataUrl;return id}
