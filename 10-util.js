'use strict';
var S=null; // the whole world lives here
const IS_BROWSER=typeof document!=='undefined';
const R={
  f:()=>Math.random(),
  i:(a,b)=>a+Math.floor(Math.random()*(b-a+1)),
  pick:a=>a[Math.floor(Math.random()*a.length)],
  chance:p=>Math.random()<p,
  pickn(a,n){const c=a.slice(),o=[];while(c.length&&o.length<n)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o},
  wpick(items,wf){let t=0;const ws=items.map(x=>{const w=Math.max(0,wf(x));t+=w;return w});if(t<=0)return items[Math.floor(Math.random()*items.length)];let r=Math.random()*t;for(let i=0;i<items.length;i++){r-=ws[i];if(r<=0)return items[i]}return items[items.length-1]},
  g(){return (Math.random()+Math.random()+Math.random()-1.5)/1.5}
};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(n){n=Math.floor(n||0);if(n<1e4)return n.toLocaleString('en-US');if(n<1e6)return (n/1e3).toFixed(n<1e5?1:0).replace(/\.0$/,'')+'K';return (n/1e6).toFixed(n<1e7?2:1).replace(/\.?0+$/,'')+'M'}
function hash(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function uid(p){S.nid=(S.nid||1)+1;return p+S.nid.toString(36)}
function cap1(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s}
function uniq(a){return Array.from(new Set(a))}
function lines(s){return String(s||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)}
function csv(s){return String(s||'').split(/[,\n;]+/).map(x=>x.trim()).filter(Boolean)}
function timeAgo(hr){const d=S.hour-hr;if(d<1)return 'now';if(d<24)return Math.floor(d)+'h';if(d<168)return Math.floor(d/24)+'d';if(d<24*60)return Math.floor(d/168)+'w';if(d<24*365)return Math.floor(d/(24*30))+'mo';return Math.floor(d/(24*365))+'y'}
function simDate(hr){const d=new Date((S.t0||Date.now())+hr*3600e3);return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
function simClock(){const d=new Date((S.t0||Date.now())+S.hour*3600e3);return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' · '+String(d.getHours()).padStart(2,'0')+':00'}
function humanAgo(h){if(h<3)return 'earlier';if(h<30)return 'yesterday';const d=Math.round(h/24);if(d<7)return d+' days ago';const w=Math.round(d/7);if(d<30)return w===1?'last week':w+' weeks ago';const m=Math.round(d/30);if(m<12)return m===1?'last month':m+' months ago';const y=Math.round(d/365);return y===1?'last year':y+' years ago'}
function words(t){return String(t).toLowerCase().replace(/[^a-z0-9'\s]/g,' ').split(/\s+/).filter(Boolean)}
const STOP=new Set('the a an and or but if then so of to in on at for with from by is are was were be been it its this that these those i you he she they we me my your his her their our not no yes do does did have has had will would can could should just very really about into out up down over under than too also as who what when where why how all any some more most such only own same there here which while'.split(' '));
function sigWords(t){return words(t).filter(w=>w.length>3&&!STOP.has(w))}
