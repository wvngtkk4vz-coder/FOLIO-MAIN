// ---------- people factory ----------
function P(id){return S.people[id]||{id:id,name:'Deleted account',user:'deleted',kind:'fan',age:30,emojis:[],hist:[],arch:['casual'],casing:'normal',slang:0,tic:'',emoji:0,care:.3,verb:.4,terse:.3,obs:.1,know:.1,snark:.2,emo:.3,likeMe:0,likeBooks:0,favChars:[],hateChars:[],opinions:{},life:{},followers:10,hue:200,ghost:true}}
function uniqueHandle(h){h=h.replace(/[^a-z0-9_.]/gi,'').toLowerCase().slice(0,22)||'reader'+R.i(10,99);let x=h,n=0;while(S.handles[x]){n++;x=h+(n>2?R.i(10,9999):n+1)}S.handles[x]=1;return x}
function makeHandle(first,last,arch,fav){
  const f=first.toLowerCase().replace(/[^a-z]/g,''),l=last.toLowerCase().replace(/[^a-z]/g,'');const r=R.f();
  const fs=fav?fav.short.toLowerCase().replace(/[^a-z]/g,''):f;
  if(fav&&(arch==='stan'||arch==='shipper')&&r<.7)return uniqueHandle(fs+R.pick(H_SUF.stan));
  if(fav&&['lore','conspiracy','solver','veteran'].includes(arch)&&r<.65)return uniqueHandle(fs+R.pick(H_SUF.lore));
  if(arch==='meme'&&r<.7)return uniqueHandle((fav?fs:R.pick(H_NOUN))+R.pick(H_SUF.meme));
  if(r<.2)return uniqueHandle(R.pick(['bookworm','readingwith','pages_by','tbr_','reads_with'])+f);
  if(r<.4)return uniqueHandle(R.pick(H_ADJ)+R.pick(H_NOUN)+(R.chance(.5)?R.i(1,99):''));
  if(r<.6)return uniqueHandle(f+'_'+l[0]+R.i(1,99));
  if(r<.72)return uniqueHandle(f+l+R.i(70,99));
  if(r<.84)return uniqueHandle(R.pick(H_NOUN)+'_'+f);
  if(r<.92)return uniqueHandle(f+R.pick(H_SUF.default));
  return uniqueHandle(R.pick(H_ADJ)+'_'+f+R.i(1,9))}
function makePerson(o){
  o=o||{};const kind=o.kind||'fan';
  const keys=Object.keys(ARCH);
  const adj=k=>(k==='hater'?(1+S.stats.controv/40+(55-S.stats.rep)/60):k==='defender'?(1+S.stats.loyalty/60):k==='veteran'?(S.hour>24*200?1:.2):k==='lore'?(1+S.stats.loreEng/60):k==='newbie'?(1+S.stats.fame/60):k==='conspiracy'?(1+S.stats.mystery/60):1);
  const arch=o.arch||R.wpick(keys,k=>ARCH[k].w*adj(k));
  const sec=R.pickn(keys.filter(k=>k!==arch),R.chance(.5)?1:2);
  const A=ARCH[arch];const tr={};Object.keys(A.t).forEach(k=>tr[k]=clamp(A.t[k]+R.g()*.2,0,1));
  const age=o.age||clamp(Math.round(14+Math.abs(R.g())*8+R.f()*30+(arch==='veteran'?8:0)),14,74);
  let first,last,name,handle,fav;
  const chars=entList('character').filter(e=>!e.gen||e.known>.2);
  const favChars=chars.length?uniq([R.wpick(chars,e=>.1+e.pop),...(R.chance(.5)?[R.wpick(chars,e=>.1+e.pop)]:[])]).map(x=>x.id):[];
  fav=favChars.length?S.ents[favChars[0]]:null;
  if(kind==='fan'){first=R.pick(FIRST);last=R.pick(LAST);name=first+(R.chance(.6)?' '+last:R.chance(.5)?' '+last[0]+'.':'');handle=makeHandle(first,last,arch,fav)}
  else{first=o.first||R.pick(FIRST_AU);last=o.last||R.pick(LAST_AU);name=first+' '+last;handle=uniqueHandle(R.pick([first+last,first+'.'+last,first+'_'+last+'_'+R.pick(['writes','books','official']),first+last+R.i(1,9)]))}
  const cohort=age<30?'young':age<46?'mid':'old';
  let casing='normal';
  if(tr.care>.6&&R.chance(.7))casing='lower';else if(tr.verb>.8&&tr.care<.25)casing='proper';else if(age>=46&&R.chance(.75))casing='proper';else if(R.chance(.12))casing='lower';
  const att=clamp(A.att+(S.stats.rep-55)/160+(S.stats.controv>40?-.08:0)+R.g()*.25,-1,1);
  const hateChars=[];if(chars.length>1&&(arch==='antistan'||R.chance(.14))){const h=R.wpick(chars,e=>e.pop+.1);if(!favChars.includes(h.id))hateChars.push(h.id)}
  const pubBooks=S.books.filter(b=>b.status==='published');
  let ship=null;if(S.ships.length&&(arch==='shipper'||R.chance(.2))){const sh=R.pick(S.ships);ship=[sh.a,sh.b]}else if(arch==='shipper'&&chars.length>1){const two=R.pickn(chars,2);ship=[two[0].id,two[1].id]}
  const id=uid('p');
  const popBig=['lore','meme','reviewer','veteran','conspiracy','solver'].includes(arch);
  const p={id,kind,name,user:handle,first,age,loc:R.pick(LOCS),arch:[arch,...sec],pa:arch,
   obs:tr.obs,know:tr.know,snark:tr.snark,emo:tr.emo,verb:tr.verb,care:tr.care,terse:tr.terse,
   casing,slang:cohort==='young'?R.f()*.6+.35:cohort==='mid'?R.f()*.25:0,
   tic:R.chance(.45)?R.pick(TICS[cohort]):'',emoji:R.chance(.28)?0:clamp((cohort==='young'?.55:cohort==='mid'?.3:.12)+R.g()*.2+tr.emo*.2,0,.9),
   emojis:uniq([...R.pickn(EMO_SETS[A.em],2),...R.pickn(EMO_SETS[R.pick(Object.keys(EMO_SETS))],1)]),
   likeBooks:clamp(att+R.g()*.3,-1,1),likeMe:clamp(att*.7+(S.stats.rep-50)/150+R.g()*.35,-1,1),
   favChars,hateChars,favBook:pubBooks.length?R.pick(pubBooks).id:null,ship,
   opinions:{endingBad:R.chance(att<0?.6:.2),tooLong:R.chance(.3),newestWeak:R.chance(att<0?.5:.18),retcon:R.chance(att<0?.35:.1),overrated:att<-.3},
   joinHour:o.joinHour!=null?o.joinHour:(arch==='veteran'?-24*R.i(300,1500):arch==='newbie'?S.hour-24*R.i(0,25):S.hour-24*R.i(0,Math.round(120+S.stats.fame*10))),
   followers:Math.round(Math.exp(R.f()*5.2+3.2)*(popBig?R.i(3,40):1)),verified:false,
   life:{job:R.pick(JOBS),hobby:R.pick(HOBBIES),pet:R.pick(PETS),show:R.pick(SHOWS)},
   hist:[],mood:0,comments:0,reg:false,follows:R.chance(.35+S.stats.fame/400),hue:R.i(0,359),says:[]};
  p.reg=p.obs>.8&&R.chance(.5);
  S.people[id]=p;S.pids.push(id);
  return p}
function makeSpecial(kind){
  const base={kind,arch:kind==='journalist'?'reviewer':kind==='author'?'reviewer':'casual'};
  const p=makePerson(Object.assign({age:R.i(28,62),arch:base.arch},{kind}));
  p.verified=true;p.casing='proper';p.emoji=R.chance(.2)?.1:0;p.slang=0;p.tic='';p.reg=true;p.hateChars=[];p.followers=R.i(15000,400000);
  if(kind==='journalist'){p.outlet=R.pick(OUTLETS);p.user=uniqueHandle(p.first.toLowerCase()+'.'+p.name.split(' ')[1].toLowerCase()+'_'+p.outlet.split(' ').pop().toLowerCase());p.followers=R.i(8000,90000)}
  if(kind==='author'){p.genre=R.pick(['fantasy','sci-fi','thriller','literary fiction','romantasy','historical fiction']);p.books=[1,2,3].slice(0,R.i(1,3)).map(()=>({title:cap1(R.pick(PL_A).toLowerCase())+' '+R.pick(['of','and','for'])+' '+cap1(R.pick(PL_B).toLowerCase()+'s')}));p.rel=R.pick(['friendly','friendly','rival','neutral','neutral']);p.followers=R.i(30000,1200000);p.bookTitle=R.pick(p.books).title}
  if(kind==='publisher'){p.pub=R.pick(PUBLISHERS);p.name='Editorial · '+p.pub;p.user=uniqueHandle(p.pub.replace(/[^a-z]/gi,'').toLowerCase());p.followers=R.i(40000,300000)}
  if(kind==='celeb'){p.known=R.pick(['actor','musician','podcaster','footballer','comedian']);p.followers=R.i(1500000,9000000);p.user=uniqueHandle(p.first.toLowerCase()+p.name.split(' ')[1].toLowerCase()+'official')}
  return p}
function ensurePeople(initial){
  const target=clamp(Math.round(80+Math.pow(Math.max(S.followers,50),.45)*2),80,3600);
  const cur=S.pids.length;let add=Math.max(0,target-cur);if(!initial)add=Math.min(add,24);else add=Math.min(add,1300);
  for(let i=0;i<add;i++)makePerson();
  if(!S.specials){S.specials={author:[],journalist:[],publisher:[],celeb:[]};}
  const want={author:9,journalist:6,publisher:3,celeb:4};
  Object.keys(want).forEach(k=>{while(S.specials[k].length<want[k]){const sp=makeSpecial(k);S.specials[k].push(sp.id)}});
}
function specials(kind){return S.specials[kind].map(P)}
function sampleP(n,filter){const out=[];const L=S.pids.length;if(!L)return out;for(let i=0;i<n*3&&out.length<n;i++){const p=S.people[S.pids[Math.floor(Math.random()*L)]];if(p&&p.kind==='fan'&&p.joinHour<=S.hour&&(!filter||filter(p)))out.push(p)}return out}
function pickFan(weightFn,filter,sample){const c=sampleP(sample||50,filter);if(!c.length)return null;return R.wpick(c,weightFn||(p=>.2+p.obs))}
function remember(p,h){h.hour=S.hour;p.hist.push(h);if(p.hist.length>14)p.hist.splice(0,p.hist.length-14)}
function tickMood(p,d){p.mood=clamp(p.mood+d,-1,1);p.likeMe=clamp(p.likeMe+d*.5,-1,1)}
