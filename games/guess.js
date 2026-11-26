/* Guess the Thing: pass the phone so everyone can secretly type a word,
   then the group asks yes/no questions to guess each word. All on one device, no server. */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const CATS=['Anything','People','Places','Objects','Food','Animals','Movies & shows','Characters','Songs','Jobs'];
const KEY='kj-guess-settings',STUMP=3;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const S=Object.assign({n:4,names:[],limit:20,cat:'Anything'},(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}})());
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}};
let G=null,ei=0;

const nameOf=i=>(S.names[i]||'').trim()||'Player '+(i+1);

function renderSetup(){
 S.n=Math.min(12,Math.max(2,S.n|0));S.limit=Math.min(40,Math.max(5,S.limit|0));
 if(!Array.isArray(S.names))S.names=[];
 $('#nv').textContent=S.n;$('#lv').textContent=S.limit;
 $('#names').innerHTML=[...Array(S.n)].map((_,i)=>'<div class="nm"><span>'+(i+1)+'</span><input type="text" data-i="'+i+'" maxlength="20" placeholder="Player '+(i+1)+'" value="'+esc(S.names[i]||'')+'" aria-label="Name of player '+(i+1)+'" autocomplete="off"></div>').join('');
 $('#cats').innerHTML=CATS.map(c=>'<button data-c="'+esc(c)+'" aria-pressed="'+(c===S.cat)+'">'+esc(c)+'</button>').join('');
 save();
}

const show=v=>{['setup','hand','enter','ready','play','result','end'].forEach(s=>$('#'+s).hidden=s!==v);scrollTo(0,0)};

function start(){
 G={p:[...Array(S.n)].map((_,i)=>({n:nameOf(i),w:'',s:0})),limit:S.limit,cat:S.cat,order:[],r:0,q:0,owner:0,askers:[],ap:0,log:[]};
 ei=0;renderHand();
}

function renderHand(){
 $('#hmsg').textContent='Pass the phone to '+G.p[ei].n;
 $('#hsub').textContent=ei===0?'Everyone else, look away while they type.':'Previous word locked in and hidden.';
 $('#hgo').textContent='I’m '+G.p[ei].n;
 show('hand');
}

function openEnter(){
 $('#ename').textContent=G.p[ei].n+', your word';
 $('#ecat').textContent=G.cat;
 const w=$('#w');w.value='';w.type='password';$('#wshow').checked=false;$('#werr').hidden=true;
 show('enter');w.focus();
}

function lockWord(){
 const w=$('#w'),v=w.value.trim();
 if(!v){$('#werr').textContent='type a word first.';$('#werr').hidden=false;return}
 if(G.p.some((p,i)=>i!==ei&&p.w&&p.w.toLowerCase()===v.toLowerCase())){$('#werr').textContent='someone already has that word. pick another.';$('#werr').hidden=false;return}
 G.p[ei].w=v;w.value='';w.type='password';
 ei++;
 if(ei<G.p.length)renderHand();else show('ready');
}

function startRound(){
 G.owner=G.order[G.r];G.q=0;G.log=[];
 G.askers=shuffle(G.p.map((_,i)=>i).filter(i=>i!==G.owner));G.ap=0;
 renderPlay();show('play');
}

const asker=()=>G.askers[G.ap%G.askers.length];

function renderPlay(){
 $('#rno').textContent='word '+(G.r+1)+' of '+G.p.length;
 $('#own').textContent=G.p[G.owner].n+'’s word';
 $('#pcat').textContent=G.cat;
 $('#qno').textContent='question '+(G.q+1)+' of '+G.limit;
 $('#asker').textContent=G.p[asker()].n;
 $('#qtext').value='';
 $('#qpanel').hidden=false;$('#gpanel').hidden=true;
 $('#log').innerHTML=G.log.slice().reverse().slice(0,10).map(l=>'<li>'+esc(l.t)+' <span class="'+(l.k==='yes'?'y':l.k==='no'?'n':'d')+'">'+esc(l.k)+'</span></li>').join('')||'<li class="d">none yet</li>';
}

function afterTurn(){
 G.ap++;
 if(G.q>=G.limit)endRound(null);else renderPlay();
}

function answer(k){
 const who=G.p[asker()].n,t=$('#qtext').value.trim();
 G.q++;G.log.push({k,t:'Q'+G.q+' '+who+': '+(t||'(asked out loud)')});
 afterTurn();
}

function openGuess(){
 $('#guesser').textContent=G.p[asker()].n;$('#owner2').textContent=G.p[G.owner].n;
 $('#qpanel').hidden=true;$('#gpanel').hidden=false;
}

function guessResult(ok){
 const gi=asker();
 G.q++;
 if(ok){G.log.push({k:'correct',t:'Q'+G.q+' '+G.p[gi].n+': guessed it!'});endRound(gi);return}
 G.log.push({k:'wrong guess',t:'Q'+G.q+' '+G.p[gi].n+': guessed wrong'});
 afterTurn();
}

const board=(el,final)=>{
 const r=G.p.map((p,i)=>({n:p.n,s:p.s})).sort((a,b)=>b.s-a.s);
 el.innerHTML=r.map((x,i)=>'<div class="row"><span>'+(final&&i===0?'★ ':'')+esc(x.n)+'</span><b class="a">'+x.s+'</b></div>').join('');
};

function endRound(gi){
 const o=G.p[G.owner];let pts;
 if(gi==null){o.s+=STUMP;
  $('#rtitle').textContent='stumped!';
  $('#rsub').innerHTML='Nobody guessed it in '+G.limit+' questions. <b class="a">'+esc(o.n)+'</b> gets <b class="a">+'+STUMP+'</b>.';
 }else{
  pts=Math.max(1,Math.round(5*(G.limit-G.q+1)/G.limit));G.p[gi].s+=pts;
  $('#rtitle').textContent='got it!';
  $('#rsub').innerHTML='<b class="a">'+esc(G.p[gi].n)+'</b> guessed '+esc(o.n)+'’s word in '+G.q+' question'+(G.q>1?'s':'')+' and gets <b class="a">+'+pts+'</b>.';
 }
 $('#rev').hidden=false;$('#wordwrap').hidden=true;$('#wordwrap').textContent='';
 board($('#board'));
 $('#nextw').textContent=G.r<G.p.length-1?'next word ▶':'final scores ▶';
 show('result');
}

function end(){
 board($('#fboard'),true);
 const top=Math.max(...G.p.map(p=>p.s)),w=G.p.filter(p=>p.s===top).map(p=>p.n);
 $('#win').innerHTML=(w.length>1?'tie between ':'winner: ')+'<b class="a">'+esc(w.join(', '))+'</b> with '+top+' points';
 show('end');
}

/* ---------- wiring ---------- */
renderSetup();show('setup');
$('#nm').onclick=()=>{S.n--;renderSetup()};$('#np').onclick=()=>{S.n++;renderSetup()};
$('#lm').onclick=()=>{S.limit-=5;renderSetup()};$('#lp').onclick=()=>{S.limit+=5;renderSetup()};
$('#names').oninput=e=>{const i=e.target.dataset.i;if(i!=null){S.names[+i]=e.target.value;save()}};
$('#cats').onclick=e=>{const b=e.target.closest('button');if(b){S.cat=b.dataset.c;renderSetup()}};
$('#go').onclick=start;
$('#hgo').onclick=openEnter;
$('#wshow').onchange=e=>{$('#w').type=e.target.checked?'text':'password'};
$('#lock').onclick=lockWord;
$('#w').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();lockWord()}};
$('#begin').onclick=()=>{G.order=shuffle(G.p.map((_,i)=>i));G.r=0;startRound()};
$('#yes').onclick=()=>answer('yes');$('#no').onclick=()=>answer('no');$('#maybe').onclick=()=>answer('sort of');
$('#guessbtn').onclick=openGuess;
$('#right').onclick=()=>guessResult(true);$('#wrong').onclick=()=>guessResult(false);
$('#rev').onclick=()=>{$('#wordwrap').textContent=G.p[G.owner].w;$('#wordwrap').hidden=false;$('#rev').hidden=true};
$('#nextw').onclick=()=>{if(G.r<G.p.length-1){G.r++;startRound()}else end()};
$('#again').onclick=start;
$('#change').onclick=()=>{G=null;show('setup')};
})();
