// ---------- text engine: expand, fill, stylize, anti-repetition ----------
function expand(s){let g=0;while(/\[[^\[\]]*\]/.test(s)&&g++<12)s=s.replace(/\[([^\[\]]*)\]/g,(m,a)=>R.pick(a.split('|')));return s}
const lowerFirst=t=>t?t.charAt(0).toLowerCase()+t.slice(1):t;
const NUMW=['three','four','five','six','seven','nine','ten'];
function charName(e){return e.short}
function slot(k,ctx,cache){
  const get=kk=>{if(!(kk in cache))cache[kk]=slot(kk,ctx,cache);return cache[kk]};
  if(ctx.x&&ctx.x[k]!=null)return ctx.x[k];
  const other=(arr,not)=>{const a=arr.filter(x=>x!==not);return a.length?R.pick(a):(arr[0]||'')};
  switch(k){
    case 'C':return ctx.Cs[0]||'the heir';
    case 'C2':return other(ctx.Cs.length>1?ctx.Cs:ctx.allC,get('C'));
    case 'CF':return ctx.CF||get('C');
    case 'CH':return ctx.CH||other(ctx.allC,get('C'));
    case 'P':return ctx.Ps[0]||'the old capital';
    case 'P2':return other(ctx.allP,get('P'));
    case 'F':return ctx.Fs[0]||'the Court';
    case 'O':return ctx.O;
    case 'M':return ctx.M;
    case 'B':return ctx.B;case 'B2':return ctx.B2;
    case 'N':return String(ctx.N);
    case 'N2':return String(ctx.N>1?ctx.N-1:ctx.N+1);
    case 'ch':return String(R.i(3,68));case 'ch2':return String(R.i(3,68));
    case 'pg':return String(R.i(40,690));case 'pg2':return String(R.i(40,690));
    case 'W':return ctx.W;case 'W2':return ctx.W2;
    case 'A':return ctx.A;case 'AU':return ctx.AU;case 'AU2':return ctx.AU2;
    case 'QK':return ctx.QK;case 'BQ':return ctx.BQ;
    case 'CLAIM':{if(!ctx.claim){ctx.claim=makeClaim({C:get('C'),C2:get('C2'),P:get('P'),F:get('F'),O:get('O'),M:get('M')});ctx.claimEnts=findEnts(ctx.claim)}return ctx.claim}
    case 'ago':return humanAgo(R.i(60,24*110));
    case 'yrs':return R.pick(['two','three','four','five']);
    case 'n3':return R.pick(NUMW);
    case 'job':return ctx.p?ctx.p.life.job:'student';
    case 'hobby':return ctx.p?ctx.p.life.hobby:'reading';
    case 'pet':return ctx.p?ctx.p.life.pet.replace(/^(a|two|no) /,''):'cat';
    case 'show':return ctx.p?ctx.p.life.show:'a show';
    case 'loc':return ctx.p?ctx.p.loc.split(',')[0]:'here';
    case 'age':return String(ctx.p?ctx.p.age:30);
    case 'mood':return R.pick(MOODS);
    case 'T':return R.pick(['late','early','grey','sunny','freezing','muggy']);
    case 'r':{const a=ctx.p?(ctx.p.likeBooks*.6+ctx.p.likeMe*.4):0;return a>.5?R.pick(['4.5','5','4']):a>0?R.pick(['4','3.5','4']):a>-.4?R.pick(['3','2.5','3.5']):R.pick(['1.5','2','2.5'])}
    case 'ev1':return R.pick(S.timeline.length?S.timeline:['the Collapse']);
    case 'ev2':return other(S.timeline.length?S.timeline:['the Siege'],get('ev1'));
    case 'ob':return ctx.x&&ctx.x.ob||'a new novel';
    case 'RUM':return ctx.rum||'something big is coming';
    case '@':return ctx.parent?'@'+P(ctx.parent.by).user:'';
    case 'pq':{if(!ctx.parent)return '';const w=ctx.parent.text.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu,'').replace(/[“”"]/g,'').trim().split(/\s+/);return w.slice(0,6).join(' ').replace(/[.,!?;:]+$/,'')}
    case 'RECALL':return ctx.recall||'you said something once and I remember';
    case 'rk':return String(R.i(2,9));
    default:return '';}
}
function fill(s,ctx){const cache={};return s.replace(/\{([A-Za-z0-9@]+)\}/g,(m,k)=>{if(!(k in cache))cache[k]=slot(k,ctx,cache);return cache[k]}).replace(/([a-z,:'])\s+The\s/g,'$1 the ').replace(/\b(the)\s+the\s/gi,'$1 ')}
// ---------- memory / similarity ----------
const EMOJI_RE=/[\u{1F300}-\u{1FAFF}☀-➿❤]/u;
function rawNorm(t){return t.toLowerCase().replace(/\s+/g,' ').trim()}
function jacc(a,b){if(!a.length||!b.size)return 0;let n=0;for(const x of a)if(b.has(x))n++;return n/(a.length+b.size-n)}
let _hs=null;
function seenSet(){if(!_hs){_hs=new Set(S.mem.hashes||[])}return _hs}
function tooSimilar(text,p,key){
  const m=S.mem,rec=m.recent,n=rawNorm(text);if(!n)return true;
  if(seenSet().has(hash(n)))return true;
  const toks=uniq(sigWords(text));
  for(let i=rec.length-1;i>=0;i--)if(rec[i].n===n)return true;
  if(toks.length>=4){for(let i=rec.length-1;i>=Math.max(0,rec.length-170);i--){const r=rec[i];if(r.toks&&r.toks.length>=4&&jacc(toks,new Set(r.toks))>.55)return true}}
  if(p&&p.says){for(const s of p.says.slice(-6)){if(toks.length>=3&&jacc(toks,new Set(s))>.4)return true}}
  const w=words(text);const open=w.slice(0,3).join(' ');
  if(w.length>=5){let c=0;for(let i=m.opens.length-1;i>=Math.max(0,m.opens.length-90);i--)if(m.opens[i]===open)c++;if(c>=2)return true}
  if(key){let c=0;for(let i=m.tpl.length-1;i>=Math.max(0,m.tpl.length-130);i--)if(m.tpl[i]===key)c++;if(c>=3)return true}
  return false}
function rememberText(text,p,key,intent){
  const m=S.mem,n=rawNorm(text);const toks=uniq(sigWords(text));
  const hh=hash(n);seenSet().add(hh);m.hashes=m.hashes||[];m.hashes.push(hh);if(m.hashes.length>16000)m.hashes.splice(0,2000);
  m.recent.push({n,toks});if(m.recent.length>700)m.recent.splice(0,m.recent.length-700);
  const w=words(text);m.opens.push(w.slice(0,3).join(' '));if(m.opens.length>160)m.opens.splice(0,40);
  if(key){m.tpl.push(key);if(m.tpl.length>260)m.tpl.splice(0,60)}
  if(intent){m.intents.push(intent);if(m.intents.length>60)m.intents.splice(0,20)}
  if(p&&p.says){p.says.push(toks);if(p.says.length>8)p.says.shift()}}
function pickTpl(pool,tag){
  const m=S.mem.tpl,rc={};for(let i=Math.max(0,m.length-130);i<m.length;i++)rc[m[i]]=(rc[m[i]]||0)+1;
  const idx=R.wpick(pool.map((t,i)=>i),i=>1/(1+2.2*(rc[tag+'#'+i]||0)));
  return {tpl:pool[idx],key:tag+'#'+idx}}
// ---------- personal style ----------
function swapTypo(t){const ws=t.split(' ');const idx=ws.map((w,i)=>w.length>=5&&/^[a-z]+$/i.test(w)?i:-1).filter(i=>i>=0);if(!idx.length)return t;const i=R.pick(idx),w=ws[i],j=R.i(1,w.length-3);ws[i]=w.slice(0,j)+w[j+1]+w[j]+w.slice(j+2);return ws.join(' ')}
function addEmoji(t,p,force){
  if(EMOJI_RE.test(t)){S.mem.emo.push((t.match(new RegExp(EMOJI_RE.source,'gu'))||[]).join(''));return t}
  if(!force&&!(p.emoji>0&&R.f()<p.emoji*.85))return t;
  const em=S.mem.emo;
  for(let a=0;a<5;a++){
    const k=Math.min(p.emojis.length,R.chance(.82)?1:2);const s=R.pickn(p.emojis,k).join('');
    let c=0;for(let i=Math.max(0,em.length-70);i<em.length;i++)if(em[i]===s)c++;
    if(c<2){em.push(s);if(em.length>200)em.splice(0,60);return R.chance(.85)?t+' '+s:s+' '+t}}
  return t}
function stylize(text,p,opt){
  opt=opt||{};let t=text.replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').replace(/\(\s*\)/g,'').trim();
  if(p.kind!=='fan'&&p.kind!=='author'){return cap1(t)}
  if(p.tic&&R.chance(.3)&&t.length>14&&!/^[^a-z0-9]/i.test(t)&&!opt.noTic){t=p.tic+(/[,]$/.test(p.tic)?' ':' ')+lowerFirst(t)}
  if(p.slang>.35&&R.chance(p.slang)){t=t.replace(/\bI am\b/g,"I'm").replace(/\bvery\b/gi,'so').replace(/\breally\b/gi,()=>R.pick(['actually','fr','so'])).replace(/\byou are\b/gi,'ur').replace(/\bbecause\b/gi,'cuz').replace(/\bgoing to\b/gi,'gonna').replace(/\bI have\b/g,"I've")}
  if(p.emo>.72&&R.chance(.4)){const ws=t.split(' ');const idx=ws.map((w,i)=>/^[A-Za-z]{4,}$/.test(w)&&!/^[A-Z]/.test(w)?i:-1).filter(i=>i>=0);if(idx.length){const i=R.pick(idx);ws[i]=ws[i].toUpperCase();t=ws.join(' ')}}
  if(p.emo>.6&&R.chance(.22))t=t.replace(/\b(no|so|why|oh|please)\b/i,m=>m+m.slice(-1).repeat(R.i(2,4)));
  if(p.casing==='lower'){t=t.toLowerCase();if(R.chance(.55))t=t.replace(/[.]+$/,'')}
  else if(p.casing==='proper'){t=cap1(t);if(!/[.!?…'"”)]$/.test(t)&&!EMOJI_RE.test(t))t+='.'}
  else if(R.chance(.55))t=cap1(t);
  if(p.care>.55&&R.chance(.55))t=t.replace(/\b(don|can|won|isn|didn|wasn|couldn|wouldn|doesn|aren|haven)'t\b/gi,'$1t').replace(/\bI'm\b/g,'im').replace(/\bit's\b/gi,'its');
  if(p.care>.5&&R.chance(.35))t=t.replace(/[.]+$/,'');
  if(p.care>.62&&R.chance(.22))t=swapTypo(t);
  if(p.terse>.65&&t.length>55&&R.chance(.6)){const parts=t.split(/(?<=[.!?])\s+|\s[—-]\s/);if(parts.length>1)t=parts[0]}
  if(!opt.noEmoji)t=addEmoji(t,p);
  return t.trim()}
// generate text from pool with all checks. returns {text,key,ctx} or null
function genFrom(pool,ctx,p,tag,opt){
  opt=opt||{};
  for(let i=0;i<12;i++){
    const {tpl,key}=pickTpl(pool,tag);
    let raw=fill(expand(tpl),ctx);
    if(opt.extra&&p.verb>.78&&R.chance(.5)){const ex=opt.extra();if(ex)raw=raw.replace(/[\s]+$/,'')+(/[.!?…]$/.test(raw)?' ':'. ')+R.pick(['Also,','And','Plus,','Besides,',''])+' '+(R.chance(.5)?lowerFirst(ex):ex)}
    const text=opt.raw?raw:stylize(raw,p,opt);
    if(opt.noSim||!tooSimilar(text,p,key)){rememberText(text,p,key,opt.intent);return {text,key,ctx}}
  }
  return null}
function recallLine(p,ctx){
  const c=[];const ent=ctx&&ctx.Cs?ctx.Cs[0]:'that character';
  p.hist.forEach(h=>{
    const ago=humanAgo(S.hour-h.hour),ex=(h.text||'').split(/\s+/).slice(0,9).join(' ').replace(/[.]+$/,'');
    if(h.t==='replied'&&ex)c.push(R.pick([`you literally told me ${ago} "${ex}". I TRUSTED YOU`,`${cap1(ago)} you answered me with "${ex}" and I haven't stopped thinking about it`,`you said "${ex}" to me ${ago}. so which is it now`]));
    if(h.t==='deleted')c.push(R.pick([`you deleted my comment ${ago} and I'm still not over it`,`I'm still annoyed you deleted my comment ${ago}`]));
    if(h.t==='liked')c.push(R.pick([`you liked my comment ${ago} and I have not recovered`,`${cap1(ago)} you hearted something I said and I told everyone I know`]));
    if(h.t==='dm')c.push(R.pick([`we spoke in DMs ${ago} so I feel like I can say this`,`you answered my DM ${ago}, so I'll be honest with you`]));
    if(h.t==='ignored'&&h.ent)c.push(`you never answered my question about ${h.ent}. it's been ${ago.replace(' ago','')}`);
    if(h.t==='canon'&&ex)c.push(`you confirmed it ${ago}: "${ex}". so why is this surprising`);
    if(h.t==='denied'&&ex)c.push(`${ago} you shot down "${ex}". I still don't buy it`);
  });
  if(S.statements.length&&R.chance(.7)){const s=R.pick(S.statements);const ex=s.text.split(/\s+/).slice(0,9).join(' ').replace(/[.]+$/,'');if(ex.length>14)c.push(R.pick([`${ago2(s.hour)}, you posted "${ex}". what did you mean by that`,`you said "${ex}" ${ago2(s.hour)} and I think about it daily`]))}
  if(p.know>.5&&S.canon.length&&R.chance(.5)){const k=R.pick(S.canon.filter(x=>x.status!=='secret'));if(k)c.push(k.status==='true'?`it's canon that ${k.text}. you confirmed it ${ago2(k.hour)}`:`you said no to "${k.text}" ${ago2(k.hour)}. people keep forgetting`)}
  if(S.teasers.length&&R.chance(.5)){const t=R.pick(S.teasers);c.push(`remember when you teased that thing ${ago2(t)}? and then nothing`)}
  return c.length?R.pick(c):null}
function ago2(h){return humanAgo(Math.max(1,S.hour-h))}
