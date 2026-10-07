// ---------- init ----------
function fixAfterLoad(){
  S.pids=Object.keys(S.people);
  S.mem=S.mem||{hashes:[],recent:[],tpl:[],intents:[],emo:[],opens:[]};
  S.imgs=S.imgs||{};S.myStories=S.myStories||[];S.seen=S.seen||{};S.settings=S.settings||{theme:'auto'};
  S.stories=(S.stories||[]).filter(s=>S.hour-s.hour<24);
  _entRe=null;
  try{ensurePeople(false)}catch(e){console.error(e)}}
function boot(){
  let ok=false;try{ok=loadWorld()}catch(e){ok=false}
  if(ok){try{fixAfterLoad();applyTheme();startLoops();render(true)}catch(e){console.error(e);resetWorld();location.reload();return}}
  else openWizard()}
let _warnedSave=false;
function autosave(){if(!S)return;if(!saveWorld()&&!_warnedSave){_warnedSave=true;toast('Browser storage is full. Remove some photos or start fresh to keep saving.')}}
setInterval(autosave,15000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)autosave()});
window.addEventListener('pagehide',autosave);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(_sv)closeStory();else if($('#modal').innerHTML)closeModal()}});
boot();
