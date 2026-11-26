/* Guess the Imposter: a pass-the-phone party game with no server.
   The host sets up a round; each player scans a QR code that carries their own card in the link.
   Nothing is stored online. */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const T={
 'Animals':'lion,penguin,dolphin,giraffe,kangaroo,octopus,elephant,panda,owl,flamingo,wolf,koala,turtle,eagle,shark,hedgehog,zebra,camel,otter,raccoon,peacock,gorilla',
 'Foods':'pizza,sushi,tacos,burger,ramen,pancakes,dumplings,lasagna,biryani,fried rice,hot dog,burrito,pad thai,fish and chips,curry,nachos,falafel,paella,bibimbap,mac and cheese,dosa,fried chicken',
 'Desserts':'cheesecake,tiramisu,brownie,macaron,churros,mochi,cupcake,apple pie,ice cream,donut,crème brûlée,baklava,cannoli,gulab jamun,cookie dough,banana pudding,croissant,cinnamon roll,milkshake,flan',
 'Countries':'Japan,Brazil,Egypt,Canada,India,Italy,Mexico,Australia,Kenya,Norway,Peru,Thailand,Greece,Iceland,Vietnam,Argentina,Morocco,Ireland,Turkey,South Korea,Spain,Jamaica',
 'Famous places':'Eiffel Tower,Taj Mahal,Statue of Liberty,Grand Canyon,Colosseum,Great Wall,Machu Picchu,Big Ben,Golden Gate Bridge,Niagara Falls,Pyramids,Sydney Opera House,Mount Everest,Space Needle,Times Square,Burj Khalifa,Stonehenge,Disneyland,Hollywood Sign,Mount Rushmore',
 'Jobs':'doctor,pilot,chef,teacher,firefighter,plumber,astronaut,lawyer,barber,farmer,nurse,architect,dentist,mechanic,photographer,pastor,electrician,flight attendant,baker,product manager,software engineer,lifeguard',
 'Sports':'basketball,soccer,tennis,golf,swimming,volleyball,baseball,hockey,boxing,surfing,skiing,rugby,cricket,badminton,wrestling,archery,bowling,fencing,rowing,table tennis,gymnastics,pickleball',
 'Household items':'toaster,vacuum,umbrella,pillow,mirror,scissors,blender,remote control,stapler,candle,toothbrush,hair dryer,microwave,clock,backpack,sofa,kettle,bookshelf,lamp,doorbell,rug,fridge',
 'Superpowers':'flying,invisibility,time travel,mind reading,super strength,teleporting,shape shifting,x-ray vision,talking to animals,super speed,freezing time,controlling fire,breathing underwater,healing,growing huge,controlling weather',
 'Drinks':'coffee,boba,lemonade,orange juice,green tea,hot chocolate,smoothie,root beer,chai,espresso,sparkling water,milk,iced tea,kombucha,matcha latte,mango lassi,horchata,cold brew,sweet tea,coconut water',
 'Hobbies':'baking,gaming,hiking,painting,knitting,fishing,chess,photography,gardening,3D printing,skateboarding,karaoke,reading,camping,dancing,woodworking,journaling,rock climbing,cycling,bird watching',
 'Seattle':'Space Needle,Pike Place,Mount Rainier,ferry,Pioneer Square,Capitol Hill,rain,coffee,salmon,Lake Union,Alki Beach,Kerry Park,light rail,Fremont Troll,Discovery Park,Ballard,orca,Chihuly Garden,Seahawks,Gas Works Park',
 'Bible people':'Moses,David,Esther,Paul,Ruth,Daniel,Noah,Peter,Mary,Joseph,Elijah,Abraham,Samson,Jonah,Solomon,Deborah,Joshua,Lazarus,Gideon,Hannah',
 'Star Wars':'Luke Skywalker,Darth Vader,Yoda,Han Solo,Princess Leia,Chewbacca,Obi-Wan Kenobi,R2-D2,C-3PO,Darth Maul,Boba Fett,Jabba the Hutt,Palpatine,Rey,Kylo Ren,Mandalorian,Grogu,Ahsoka Tano,Lando Calrissian,Death Star,Millennium Falcon,Tatooine',
 'DC Comics':'Batman,Superman,Wonder Woman,The Flash,Aquaman,Green Lantern,Joker,Harley Quinn,Robin,Catwoman,Cyborg,Lex Luthor,Supergirl,Batgirl,Nightwing,Shazam,Martian Manhunter,Green Arrow,Black Adam,Deathstroke,Gotham City,Poison Ivy',
 'Movies':'Titanic,Jurassic Park,The Lion King,Frozen,Inception,Shrek,Toy Story,The Godfather,Forrest Gump,Finding Nemo,The Matrix,Jaws,Back to the Future,Avatar,Harry Potter,Home Alone,Grease,Up,Spider-Man,The Lord of the Rings,Moana,Coco',
 'Marvel Movies':'Iron Man,The Avengers,Black Panther,Thor,Captain America,Guardians of the Galaxy,Doctor Strange,Ant-Man,Spider-Man: Homecoming,Captain Marvel,Avengers: Endgame,Avengers: Infinity War,Thor: Ragnarok,Black Widow,Shang-Chi,Eternals,Deadpool & Wolverine,The Incredible Hulk,The Marvels,Thor: Love and Thunder,Black Panther: Wakanda Forever,Ant-Man and the Wasp',
 'Kevin’s places':'Texarkana,Dallas,Austin,Seattle,Portland,Chicago,New York,Toronto,Hong Kong,Shenzhen,Macau,Guangzhou,New Delhi,Vellore,Jabalpur,Dehradun,Taj Mahal,Washington DC'
};
const TOPICS=Object.fromEntries(Object.entries(T).map(([k,v])=>[k,v.split(',')]));
const CUSTOM='Your own words',RANDOM='Random topic';
const KEY='kj-imposter-settings',ME='kj-imposter-me',XK='kev-imposter';

/* tiny scrambling so the link is not readable at a glance (not security) */
const enc=a=>{const b=new TextEncoder().encode(JSON.stringify(a)),k=new TextEncoder().encode(XK);return btoa(String.fromCharCode(...b.map((x,i)=>x^k[i%k.length]))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const dec=s=>{try{s=s.replace(/-/g,'+').replace(/_/g,'/');const r=atob(s),k=new TextEncoder().encode(XK),b=Uint8Array.from(r,(c,i)=>c.charCodeAt(0)^k[i%k.length]);return JSON.parse(new TextDecoder().decode(b))}catch(_){return null}};

const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const maxImp=n=>Math.max(1,Math.floor((n-1)/2));

function qrSvg(text){const q=qrcode(0,'M');q.addData(text);q.make();const c=q.getModuleCount(),m=4;let d='';
 for(let r=0;r<c;r++)for(let x=0;x<c;x++)if(q.isDark(r,x))d+='M'+(x+m)+' '+(r+m)+'h1v1h-1z';
 return '<svg viewBox="0 0 '+(c+2*m)+' '+(c+2*m)+'" shape-rendering="crispEdges" role="img" aria-label="QR code for this player"><rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}

/* a hold-to-reveal card; used on a player's own phone and for "show on this screen" */
function card(el,p){
 // p = {n:player number, t:total, topic, word, imp:bool}
 const showWord=p.imp&&!p.word?'<div class="w imp">YOU ARE THE IMPOSTER</div><div class="h">blend in. work out the word from everyone’s clues.</div>':'<div class="h">'+esc(p.topic)+'</div><div class="w">'+esc(p.word)+'</div><div class="h">give one clue about it without saying it.</div>';
 el.innerHTML='<div class="card" tabindex="0" role="button" aria-label="Hold to reveal your card"><div class="h">hold to reveal</div><div class="h">keep it hidden from everyone</div></div>';
 const c=el.firstChild,hide='<div class="h">hold to reveal</div><div class="h">keep it hidden from everyone</div>';
 const on=()=>{c.classList.add('on');c.innerHTML=showWord},off=()=>{c.classList.remove('on');c.innerHTML=hide};
 c.addEventListener('pointerdown',e=>{e.preventDefault();on()});
 ['pointerup','pointerleave','pointercancel'].forEach(t=>c.addEventListener(t,off));
 c.addEventListener('contextmenu',e=>e.preventDefault());
 c.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();on()}});
 c.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')off()});
 c.addEventListener('blur',off);
}

/* ---------- player view (opened from a QR code) ---------- */
function player(p){
 $('#host').hidden=true;$('#me').hidden=false;
 $('#who').textContent='Player '+p[1]+' of '+p[2];
 card($('#mecard'),{n:p[1],t:p[2],topic:p[3],word:p[4],imp:!!p[5]});
 $('#hostlink').onclick=e=>{e.preventDefault();try{sessionStorage.removeItem(ME)}catch(_){}location.replace(location.pathname)};
}

/* ---------- host view ---------- */
const S=Object.assign({n:5,k:1,mode:'diff',topic:'Animals',custom:''},(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}})());
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}};
let G=null;

function renderSetup(){
 S.n=Math.min(20,Math.max(3,S.n|0));S.k=Math.min(maxImp(S.n),Math.max(1,S.k|0));
 $('#nv').textContent=S.n;$('#kv').textContent=S.k;
 $('#khint').textContent='up to '+maxImp(S.n)+' with '+S.n+' players';
 $$('#mode button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===S.mode));
 $('#topics').innerHTML=Object.keys(TOPICS).concat([RANDOM,CUSTOM]).map(t=>'<button class="tp" data-t="'+esc(t)+'" aria-pressed="'+(t===S.topic)+'">'+esc(t)+'<small>'+(TOPICS[t]?TOPICS[t].length+' words':t===RANDOM?'surprise me':'type your own')+'</small></button>').join('');
 $('#customwrap').hidden=S.topic!==CUSTOM;
 $('#custom').value=S.custom;
 save();
}

function words(){
 let name=S.topic,list;
 if(name===RANDOM){name=pick(Object.keys(TOPICS))}
 if(name===CUSTOM){list=[...new Set(S.custom.split(/[,\n]/).map(s=>s.trim()).filter(Boolean))];name='Custom topic'}
 else list=TOPICS[name];
 return{name,list}
}

function deal(){
 const{name,list}=words();
 if(list.length<2){$('#err').textContent='add at least two words (separate them with commas).';$('#err').hidden=false;return}
 $('#err').hidden=true;
 const secret=pick(list),diff=pick(list.filter(w=>w!==secret));
 const imps=new Set(shuffle([...Array(S.n).keys()]).slice(0,S.k));
 G={n:S.n,k:S.k,mode:S.mode,topic:name,secret,diff,imps,cur:0,first:1+rnd(S.n),id:Math.random().toString(36).slice(2,8)};
 show('pass');renderPass();
}

const payload=i=>{const imp=G.imps.has(i);return[G.id,i+1,G.n,G.topic,imp?(G.mode==='diff'?G.diff:''):G.secret,(imp&&G.mode==='blank')?1:0]};
const base=()=>location.href.split('#')[0].split('?')[0];
const link=i=>base()+'#r='+enc(payload(i));

function renderPass(){
 const i=G.cur;
 $('#pnum').textContent='Player '+(i+1)+' of '+G.n;
 $('#dots').innerHTML=[...Array(G.n)].map((_,j)=>'<i class="'+(j<i?'on':j===i?'cur':'')+'"></i>').join('');
 $('#qr').innerHTML=qrSvg(link(i));
 $('#qrwrap').hidden=false;$('#herewrap').hidden=true;
 $('#prev').disabled=i===0;
 $('#next').textContent=i===G.n-1?'All dealt ▶':'Next player ▶';
 const p=payload(i);card($('#herecard'),{topic:p[3],word:p[4],imp:!!p[5]});
}

function renderDone(){
 $('#first').textContent='Player '+G.first;
 $('#reveal').hidden=true;$('#revbtn').hidden=false;
}

function revealAll(){
 const imps=[...G.imps].sort((a,b)=>a-b).map(i=>'Player '+(i+1));
 $('#reveal').innerHTML='<p>The word was <b class="a">'+esc(G.secret)+'</b>.</p><p>'+(G.k>1?'Imposters':'Imposter')+': <b class="a">'+esc(imps.join(', '))+'</b>'+(G.mode==='diff'?'<br><span class="d">they were given “'+esc(G.diff)+'” instead.</span>':'<br><span class="d">they were given no word.</span>')+'</p>';
 $('#reveal').hidden=false;$('#revbtn').hidden=true;
}

function show(v){['setup','pass','done'].forEach(s=>$('#'+s).hidden=s!==v);scrollTo(0,0)}

function host(){
 $('#me').hidden=true;$('#host').hidden=false;
 renderSetup();
 $('#nm').onclick=()=>{S.n--;renderSetup()};$('#np').onclick=()=>{S.n++;renderSetup()};
 $('#km').onclick=()=>{S.k--;renderSetup()};$('#kp').onclick=()=>{S.k++;renderSetup()};
 $('#mode').onclick=e=>{const b=e.target.closest('button');if(b){S.mode=b.dataset.m;renderSetup()}};
 $('#topics').onclick=e=>{const b=e.target.closest('button');if(b){S.topic=b.dataset.t;renderSetup()}};
 $('#custom').oninput=e=>{S.custom=e.target.value;save()};
 $('#go').onclick=deal;
 $('#prev').onclick=()=>{if(G.cur>0){G.cur--;renderPass()}};
 $('#next').onclick=()=>{if(G.cur<G.n-1){G.cur++;renderPass()}else{show('done');renderDone()}};
 $('#here').onclick=()=>{$('#qrwrap').hidden=true;$('#herewrap').hidden=false};
 $('#backqr').onclick=()=>{$('#qrwrap').hidden=false;$('#herewrap').hidden=true};
 $('#revbtn').onclick=revealAll;
 $('#again').onclick=deal;
 $('#change').onclick=()=>show('setup');
 $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(link(G.cur));$('#copy').textContent='copied';setTimeout(()=>$('#copy').textContent='copy link',1200)}catch(_){$('#copy').textContent='copy failed'}};
}

/* ---------- start ---------- */
let r=null;
if(location.hash.startsWith('#r=')){r=dec(location.hash.slice(3));if(r){try{sessionStorage.setItem(ME,JSON.stringify(r))}catch(_){}}history.replaceState(null,'',location.pathname+location.search)}
else try{r=JSON.parse(sessionStorage.getItem(ME)||'null')}catch(_){}
if(Array.isArray(r)&&r.length>=6)player(r);else host();
})();
