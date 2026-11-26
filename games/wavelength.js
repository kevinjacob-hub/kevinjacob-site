/* Wavelength: one player sees a secret number from 1 to 10 on a scale and gives a clue.
   The group guesses the number. The clue-giver's card travels in a QR link, with no server. */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* [name, clue prompt, what 1 means, what 10 means] */
const SP=[
 ['Food','Name a food','disgusting','delicious'],
 ['Desserts','Name a dessert','plain','over the top'],
 ['Movies','Name a movie','terrible','a masterpiece'],
 ['Animals','Name an animal','harmless','deadly'],
 ['Places','Name a place','never going','bucket list'],
 ['Jobs','Name a job','easy','brutal'],
 ['Things you own','Name something you could buy','cheap','expensive'],
 ['Heroes & villains','Name a hero or villain','pure villain','pure hero'],
 ['Sports','Name a sport','boring to watch','thrilling'],
 ['Weather','Name a kind of weather','awful','perfect'],
 ['Hobbies','Name a hobby','lazy','intense'],
 ['Cities','Name a city','sleepy town','huge metropolis'],
 ['Temperature','Name something','freezing','scorching'],
 ['Drinks','Name a drink','relaxing','wired'],
 ['Seattle','Name something in Seattle','tourist trap','local favorite'],
 ['Songs & genres','Name a type of music','calm','hype'],
];
const CUSTOM='Your own scale',RANDOM='Random each round';
const KEY='kj-wavelength-settings',ME='kj-wavelength-me',XK='kev-wavelength';
const PTS=[3,2,1];

const enc=a=>{const b=new TextEncoder().encode(JSON.stringify(a)),k=new TextEncoder().encode(XK);return btoa(String.fromCharCode(...b.map((x,i)=>x^k[i%k.length]))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const dec=s=>{try{s=s.replace(/-/g,'+').replace(/_/g,'/');const r=atob(s),k=new TextEncoder().encode(XK),b=Uint8Array.from(r,(c,i)=>c.charCodeAt(0)^k[i%k.length]);return JSON.parse(new TextDecoder().decode(b))}catch(_){return null}};
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function qrSvg(text){const q=qrcode(0,'M');q.addData(text);q.make();const c=q.getModuleCount(),m=4;let d='';
 for(let r=0;r<c;r++)for(let x=0;x<c;x++)if(q.isDark(r,x))d+='M'+(x+m)+' '+(r+m)+'h1v1h-1z';
 return '<svg viewBox="0 0 '+(c+2*m)+' '+(c+2*m)+'" shape-rendering="crispEdges" role="img" aria-label="QR code for the clue-giver"><rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}

/* the 1 to 10 scale; t = target, g = guess (both optional) */
const pos=n=>((n-1)/9*100)+'%';
function scale(sp,t,g){
 let h='<div class="sbar" aria-hidden="true">';
 for(let i=1;i<=10;i++)h+='<i style="left:'+pos(i)+'"></i>';
 if(g!=null)h+='<b class="g" style="left:'+pos(g)+'">guess '+g+'</b>';
 if(t!=null)h+='<b class="t" style="left:'+pos(t)+(g!=null&&g===t?';top:-48px':'')+'">'+(g!=null&&g===t?'target '+t:'target '+t)+'</b>';
 return h+'</div><div class="ends"><span class="u">1 &middot; '+esc(sp.lo)+'</span><span class="a">10 &middot; '+esc(sp.hi)+'</span></div>';
}
const specHead=(sp,extra)=>'<div class="pr">'+esc(sp.prompt)+'</div>'+scale(sp)+(extra||'');

/* hold-to-reveal number card */
function numCard(el,num){
 const hide='<div class="h">hold to reveal</div><div class="h">keep it hidden from everyone</div>';
 el.innerHTML='<div class="card" tabindex="0" role="button" aria-label="Hold to reveal your secret number">'+hide+'</div>';
 const c=el.firstChild;
 const on=()=>{c.classList.add('on');c.innerHTML='<div class="h">your secret number</div><div class="n">'+num+'</div><div class="h">give a clue that fits this spot on the scale.</div>'};
 const off=()=>{c.classList.remove('on');c.innerHTML=hide};
 c.addEventListener('pointerdown',e=>{e.preventDefault();on()});
 ['pointerup','pointerleave','pointercancel'].forEach(t=>c.addEventListener(t,off));
 c.addEventListener('contextmenu',e=>e.preventDefault());
 c.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();on()}});
 c.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')off()});
 c.addEventListener('blur',off);
}

/* ---------- clue-giver's phone (opened from the QR code) ---------- */
function player(p){
 // p = [id, round, giver, prompt, lo, hi, number]
 $('#host').hidden=true;$('#me').hidden=false;
 $('#who').textContent='Player '+p[2]+', you’re the clue-giver';
 $('#mespec').innerHTML=specHead({prompt:p[3],lo:p[4],hi:p[5]});
 numCard($('#mecard'),p[6]);
 $('#hostlink').onclick=e=>{e.preventDefault();try{sessionStorage.removeItem(ME)}catch(_){}location.replace(location.pathname)};
}

/* ---------- host view ---------- */
const S=Object.assign({n:4,rounds:5,topic:'Food',lo:'',hi:'',pr:''},(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}})());
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}};
let G=null;

function renderSetup(){
 S.n=Math.min(12,Math.max(2,S.n|0));S.rounds=Math.min(15,Math.max(1,S.rounds|0));
 $('#nv').textContent=S.n;$('#rv').textContent=S.rounds;
 $('#topics').innerHTML=SP.map(s=>s[0]).concat([RANDOM,CUSTOM]).map(t=>{const s=SP.find(x=>x[0]===t);
  return '<button class="tp" data-t="'+esc(t)+'" aria-pressed="'+(t===S.topic)+'">'+esc(t)+'<small>'+(s?esc(s[2])+' → '+esc(s[3]):t===RANDOM?'a new scale each time':'make your own')+'</small></button>'}).join('');
 $('#customwrap').hidden=S.topic!==CUSTOM;
 $('#clo').value=S.lo;$('#chi').value=S.hi;$('#cpr').value=S.pr;
 save();
}

function specFor(){
 if(S.topic===CUSTOM)return{name:'Custom',prompt:S.pr.trim()||'Give a clue',lo:S.lo.trim(),hi:S.hi.trim()};
 const s=S.topic===RANDOM?pick(SP):SP.find(x=>x[0]===S.topic)||SP[0];
 return{name:s[0],prompt:s[1],lo:s[2],hi:s[3]};
}

function start(){
 if(S.topic===CUSTOM&&(!S.lo.trim()||!S.hi.trim())){$('#err').textContent='fill in both ends of your scale.';$('#err').hidden=false;return}
 $('#err').hidden=true;
 G={id:Math.random().toString(36).slice(2,8),round:1,rounds:S.rounds,n:S.n,score:0,log:[],num:0,guess:null,spec:null};
 nextRound(true);
}

function nextRound(first){
 if(!first)G.round++;
 G.spec=specFor();
 let n;do{n=1+rnd(10)}while(n===G.num&&!first);
 G.num=n;G.guess=null;
 show('clue');renderClue();
}

const giver=()=>((G.round-1)%G.n)+1;
const base=()=>location.href.split('#')[0].split('?')[0];
const link=()=>base()+'#r='+enc([G.id,G.round,giver(),G.spec.prompt,G.spec.lo,G.spec.hi,G.num]);

function renderClue(){
 $('#rhead').textContent='Round '+G.round+' of '+G.rounds;
 $('#giver').textContent='Player '+giver();
 $('#spec').innerHTML=specHead(G.spec);
 $('#qr').innerHTML=qrSvg(link());
 $('#qrwrap').hidden=false;$('#herewrap').hidden=true;
 numCard($('#herecard'),G.num);
}

function renderGuess(){
 $('#gspec').innerHTML=specHead(G.spec);
 $('#nums').innerHTML=[...Array(10)].map((_,i)=>'<button data-v="'+(i+1)+'" aria-pressed="false">'+(i+1)+'</button>').join('');
 $('#lock').disabled=true;G.guess=null;
}

function pickGuess(v){
 G.guess=v;
 $$('#nums button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));
 $('#gspec').innerHTML=specHead(G.spec).replace('</div><div class="ends">','<b class="g" style="left:'+pos(v)+'">guess '+v+'</b></div><div class="ends">');
 $('#lock').disabled=false;
}

function renderResult(){
 const d=Math.abs(G.num-G.guess),pts=PTS[d]||0;
 G.score+=pts;G.log.push({r:G.round,t:G.num,g:G.guess,p:pts,s:G.spec.name});
 $('#verdict').textContent=d===0?'bullseye!':d===1?'so close':d===2?'in the ballpark':'way off';
 $('#pts').textContent='+'+pts;
 $('#rspec').innerHTML=specHead(G.spec).replace('</div><div class="ends">','<b class="g" style="left:'+pos(G.guess)+'">guess '+G.guess+'</b><b class="t" style="left:'+pos(G.num)+(d===0?';top:-48px':'')+'">target '+G.num+'</b></div><div class="ends">');
 $('#tally').innerHTML='total: <b class="a">'+G.score+'</b> of '+(G.round*3);
 $('#nextround').textContent=G.round<G.rounds?'next round ▶':'see final score ▶';
}

function renderEnd(){
 const max=G.rounds*3,r=G.score/max;
 $('#total').textContent=G.score+' / '+max;
 $('#grade').textContent=r>=.9?'mind readers. you are all on the same wavelength.':r>=.7?'great teamwork. you really get each other.':r>=.45?'not bad. you are warming up.':r>=.2?'you have some talking to do.':'strangers. you need to hang out more.';
 $('#log').innerHTML=G.log.map(x=>'<li>round '+x.r+' &middot; '+esc(x.s)+': target '+x.t+', guess '+x.g+' <span class="a">+'+x.p+'</span></li>').join('');
}

function show(v){['setup','clue','guess','result','end'].forEach(s=>$('#'+s).hidden=s!==v);scrollTo(0,0)}

function host(){
 $('#me').hidden=true;$('#host').hidden=false;
 renderSetup();
 $('#nm').onclick=()=>{S.n--;renderSetup()};$('#np').onclick=()=>{S.n++;renderSetup()};
 $('#rm').onclick=()=>{S.rounds--;renderSetup()};$('#rp').onclick=()=>{S.rounds++;renderSetup()};
 $('#topics').onclick=e=>{const b=e.target.closest('button');if(b){S.topic=b.dataset.t;renderSetup()}};
 $('#clo').oninput=e=>{S.lo=e.target.value;save()};$('#chi').oninput=e=>{S.hi=e.target.value;save()};$('#cpr').oninput=e=>{S.pr=e.target.value;save()};
 $('#go').onclick=start;
 $('#here').onclick=()=>{$('#qrwrap').hidden=true;$('#herewrap').hidden=false};
 $('#backqr').onclick=()=>{$('#qrwrap').hidden=false;$('#herewrap').hidden=true};
 $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(link());$('#copy').textContent='copied';setTimeout(()=>$('#copy').textContent='copy link',1200)}catch(_){$('#copy').textContent='copy failed'}};
 $('#cluedone').onclick=()=>{show('guess');renderGuess()};
 $('#nums').onclick=e=>{const b=e.target.closest('button');if(b)pickGuess(+b.dataset.v)};
 $('#lock').onclick=()=>{show('result');renderResult()};
 $('#nextround').onclick=()=>{if(G.round<G.rounds)nextRound();else{show('end');renderEnd()}};
 $('#again').onclick=start;
 $('#change').onclick=()=>show('setup');
}

/* ---------- start ---------- */
let r=null;
if(location.hash.startsWith('#r=')){r=dec(location.hash.slice(3));if(r){try{sessionStorage.setItem(ME,JSON.stringify(r))}catch(_){}}history.replaceState(null,'',location.pathname+location.search)}
else try{r=JSON.parse(sessionStorage.getItem(ME)||'null')}catch(_){}
if(Array.isArray(r)&&r.length>=7)player(r);else host();
})();
