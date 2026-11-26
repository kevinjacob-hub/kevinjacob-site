// Home page + terminal + keyboard. Uses the map in game.js.
// ---- terminal + screens ----
const say=(t,c)=>{const o=$(inGame?'#gout':'#iout'),d=document.createElement('div');d.textContent=t;if(c)d.className=c;o.append(d);o.scrollTop=o.scrollHeight};
const sayLink=(label,url,note)=>{const o=$(inGame?'#gout':'#iout'),d=document.createElement('div'),a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener';d.append(a);if(note){const n=document.createElement('span');n.className='d';n.textContent=' '+note;d.append(n)}o.append(d);o.scrollTop=o.scrollHeight};
const THEMES=['light','dark','dracula','gruvbox','nord','solarized','matrix','batman'];
let punBag=[];
const play=()=>{if(!started){started=true;GL=initGame()}
 if(!GL){say('3D isn’t available in this browser, so the road trip can’t start.','d');return}
 document.activeElement.blur();inGame=true;$('#intro').hidden=true;$('#game').hidden=false;fit();last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
 if(!$('#gout').children.length)say('drive onto Washington or Texas and the map zooms in. pins mark where I’ve been; park on a city or landmark to read more. type pins for the list.')};
const leave=()=>{inGame=false;cancelAnimationFrame(raf);for(const k in keys)keys[k]=0;closeP();$('#game').hidden=true;$('#intro').hidden=false};
// scroll only the editor pane: scrollIntoView would also shift the window itself
const jump=id=>{const ed=$('#ed'),el=$('#'+id);if(!ed||!el)return;ed.scrollTo({top:Math.max(0,ed.scrollTop+el.getBoundingClientRect().top-ed.getBoundingClientRect().top-14),behavior:'smooth'})};
[['seattle',()=>fly('s')],['texas',()=>fly('t')],['asia',()=>flyAsia()],...Object.keys(Z).map(k=>[k,()=>go(k)]),['exit',()=>leave()]].forEach(([n,f])=>{const b=document.createElement('button');b.textContent=n;b.onclick=f;$('#nav').append(b)});
const CMD={
 help:()=>{const L=inGame?[['map','cd <place or pin> · pins · random · fly seattle|texas|asia · exit'],['find','grep <word> · stats · tree · hire'],['fun','pun · theme [name] · bake · print · games'],['faith','verse · pray · church · invite · rm -rf sin'],['reach me','email · linkedin · instagram']]:[['read','about me · projects · experience · skills · bakes · korner · resume · gallery · blog · testimony · contact'],['find','grep <word> · stats · tree · hire'],['map','random · pins'],['fun','pun · theme [name] · bake · print · games'],['faith','verse · pray · church · invite · rm -rf sin'],['reach me','email · linkedin · instagram · rsvp']];L.forEach(([k,v])=>say(k.padEnd(9)+v,'pre'));say('also: ls · whoami · clear · Tab completes','d')},
 about:()=>inGame?say('you’re already on the road trip.','d'):play(),
 ls:()=>say(inGame?Object.keys(Z).join('  ')+'  (type pins for the rest)':'about-me  experience  projects  skills  off-the-clock  bakes  korner  resume  gallery  blog  testimony  contact'),
 cd:a=>!inGame?say('start the road trip first: about me','d'):Object.hasOwn(Z,a||'')?go(a):Object.hasOwn(PK,a||'')?goPin(a):say('no such place: '+(a||'(none)')+'. try ls or pins','d'),
 fly:a=>!inGame?say('start the road trip first: about me','d'):a==='seattle'?fly('s'):a==='texas'?fly('t'):a==='asia'?flyAsia():say('fly seattle | texas | asia','d'),
 exit:()=>inGame?leave():say('nothing to exit.','d'),
 pins:()=>{const g=c=>PINS.filter(p=>p[2]===c).map(p=>p[0]).join('  ');say('national parks: '+g('p'));say('trails and state parks: '+g('t'));say('cities: '+g('c'));say(inGame?'cd <name> jumps to one.':'start the road trip with: about me','d')},
 whoami:()=>say('visitor. nice to meet you.'),
 bake:()=>say('preheating to 220°C ... proofing ... done. smells great.'),
 print:()=>say('slicing ... layer 240/240 ... first layer looked perfect.'),
 theme:a=>{const r=document.documentElement,now=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  if(a==='list'||a==='ls')return say('themes: '+THEMES.join('  ')+'  (theme alone flips light/dark)');
  const n=THEMES.includes(a)?a:a?null:now==='dark'?'light':'dark';
  if(!n)return say('no such theme: '+a+'. try: '+THEMES.join(', '),'d');
  r.dataset.theme=n;try{localStorage.setItem('kj-theme',n)}catch(_){}applyTheme();say('theme: '+n)},
 clear:()=>{$(inGame?'#gout':'#iout').textContent=''},
 sudo:a=>a==='hire'?(say('permission granted.','u'),CMD.hire()):say('nice try.','d')};

// ---- find, stats and contact commands ----
const clip=(s,k)=>{const i=s.toLowerCase().indexOf(k),a=Math.max(0,i-40),e=Math.min(s.length,i+k.length+70);return(a?'…':'')+s.slice(a,e)+(e<s.length?'…':'')};
const corpus=()=>{const L=[],add=(src,x)=>{if(x)L.push([src,String(x)])};
 let p=$('#about');if(p)for(p=p.nextElementSibling;p&&p.tagName==='P';p=p.nextElementSibling)add('about',p.textContent);
 EXPERIENCE.forEach(e=>{add('experience',e.org+' · '+e.role+' · '+e.when);e.pts.forEach(x=>add('experience',x))});
 PROJECTS.forEach(g=>g.items.forEach(x=>{add('projects',x.n+': '+x.d);add('projects',x.meta)}));
 [...SKILLS.strengths,...SKILLS.tools,SKILLS.languages].forEach(x=>add('skills',x));OFF.forEach(x=>add('off-the-clock',x));
 BAKES.cakes.forEach(c=>add('bakes',[c.n,c.meta,c.d].filter(Boolean).join(' · ')));add('bakes',BAKES.bs.n+' · '+BAKES.bs.d);BAKES.bs.items.forEach(c=>add('bakes',c.n+(c.d?': '+c.d:'')));
 VERSES.forEach(v=>add('verse',[v.t,v.r,v.n].filter(Boolean).join(' ')));
 POSTS.forEach(x=>add('blog',x.title+' · '+x.sum));add('korner',KK.tagline);KK.events.forEach(v=>add('korner',[v.title,v.date,v.menu,v.note].filter(Boolean).join(' · ')));
 PINS.forEach(x=>add('pins',x[1]+' ('+({p:'national park',t:'trail or state park',c:'city'}[x[2]])+')'));
 return L};
CMD.grep=a=>{if(!a)return say('usage: grep <word>   e.g. grep migration','d');
 const hits=corpus().filter(([,x])=>x.toLowerCase().includes(a));
 if(!hits.length)return say('no matches for “'+a+'”.','d');
 hits.slice(0,8).forEach(([s,x])=>say(s.padEnd(14)+clip(x,a),'pre'));
 say(hits.length>8?(hits.length-8)+' more. narrow it down.':hits.length+' match'+(hits.length>1?'es':''),'d')};
CMD.tree=()=>{const kids={'projects/':PROJECTS.flatMap(g=>g.items.map(x=>x.n)),'bakes/':[...BAKES.cakes.map(c=>c.n),BAKES.bs.n],'kevins-korner/':KK.events.map(v=>(v.title||'KK #'+v.n)+(v.date?' ('+v.date+')':'')),'blog/':POSTS.map(x=>x.title),'gallery/':[]};
 const top=['README.md','about.md','testimony.md','experience.log','projects/','skills.json','off-the-clock.md','bakes/','kevins-korner/','resume.pdf','gallery/','blog/','contact.md','road-trip.exe'];
 say('kevinjacob/','pre');top.forEach((n,i)=>{const last=i===top.length-1;say((last?'└── ':'├── ')+n,'pre');(kids[n]||[]).forEach((k,j,a)=>say((last?'    ':'│   ')+(j===a.length-1?'└── ':'├── ')+k,'pre'))})};
CMD.stats=()=>{const by=k=>PINS.filter(p=>p[2]===k).length,abroad=PINS.filter(p=>p[3]>0).length;
 const states=Object.keys(ST).filter(ab=>PINS.some(p=>{const w=proj(p[3],p[4]);return p[3]<0&&pip(w[0],w[1],outer(ST[ab]))})).length;
 const nights=KK.events.filter(v=>v.date).length,projects=PROJECTS.reduce((n,g)=>n+g.items.length,0);
 const rows=[['national parks',by('p')],['trails and state parks',by('t')],['cities',by('c')],['states with a pin',states],['countries','3 (US, India, China)'],['pins abroad',abroad],['projects',projects]];
 if(nights)rows.push(['Kevin’s Korner nights',nights]);rows.push(['pins total',PINS.length]);
 rows.forEach(([k,v])=>say(String(k).padEnd(24)+v,'pre'))};
CMD.random=()=>{const ks=Object.keys(PK),k=ks[Math.floor(Math.random()*ks.length)];if(!inGame)play();if(!GL)return;goPin(k);say('→ '+PK[k].name+' ('+k+')')};
CMD.pun=()=>{if(!punBag.length)punBag=PUNS.map((_,i)=>i).sort(()=>Math.random()-.5);say(PUNS[punBag.pop()])};
CMD.hire=()=>{say('Kevin Jacob · Digital Product Manager, Orders & Fulfillment · Seattle, WA');
 say('5+ years across logistics, ecommerce fulfillment, vendor operations and returns. I turn manual, fragmented processes into automated, measurable ones.','d');
 ['MercuryGate migration, ~$250K annual contract savings','ProShip rate shopping, $700K+ estimated annual savings','Digital Branch Orders, ~$500K processed in one month'].forEach(x=>say('[ship] '+x));
 sayLink('resume.pdf',RESUME);CMD.email();CMD.linkedin()};
CMD.email=()=>{sayLink(EMAIL,'mailto:'+EMAIL);try{navigator.clipboard.writeText(EMAIL).then(()=>say('(copied to clipboard)','d'),()=>{})}catch(_){}};
CMD.linkedin=()=>sayLink('linkedin.com/in/kevin--jacob',LINKEDIN);
CMD.instagram=()=>sayLink('@Kevin_nose_all',INSTAGRAM);
// ---- faith commands ----
let verseBag=[];
CMD.verse=()=>{if(!verseBag.length)verseBag=VERSES.map((_,i)=>i).sort(()=>Math.random()-.5);const v=VERSES[verseBag.pop()];if(v.t){say('“'+v.t+'”');say('— '+v.r+' (KJV)','d')}else say(v.r+' (whole chapter)');if(v.n)say(v.n,'d')};
CMD.pray=()=>{say('praying for you. if there’s something specific on your heart, tell me and I’ll pray for it too.');sayLink('send a prayer request','mailto:'+EMAIL+'?subject='+encodeURIComponent('Prayer request'))};
CMD.church=()=>{const c=CHURCH;say('Join me this Sunday at '+c.name+'!');
 if(c.when)say('when   '+c.when,'pre');if(c.where)say('where  '+c.where,'pre');
 if(!c.when&&!c.where)say('message me and I’ll send the time and place, and save you a seat.','d');
 if(c.note)say(c.note);
 sayLink('tell me you’re coming','mailto:'+EMAIL+'?subject='+encodeURIComponent('Joining you at church this Sunday'));
 if(c.url)sayLink(c.url.replace(/^https?:\/\//,''),c.url)};
CMD.invite=()=>{say('you’re invited. two ways to join me:');say('1. church, this Sunday   type: church','pre');
 say('2. Kevin’s Korner dinner   type: korner'+(KK.next&&KK.next.when?'  (next: '+KK.next.when+')':''),'pre');say('come with a friend, or come alone and leave with a few.','d')};
CMD.rm=a=>/^-(rf|fr)\s+sin\/?$/.test(a||'')?(say('rm: cannot remove ‘sin’: Permission denied','pre'),say('only Jesus can do that. (1 John 1:9)','d')):say('rm: permission denied. this portfolio is read-only.','d');
CMD.mail=CMD.email;CMD.insta=CMD.ig=CMD.instagram;
CMD.quit=CMD.home=CMD.exit;CMD.goto=CMD.open=CMD.cd;
for(const[c,id]of Object.entries({gallery:'gallery',contact:'contact',resume:'resume',testimony:'testimony',projects:'projects',experience:'experience',log:'experience',skills:'skills',blog:'blog',bakes:'bakes',cheesecake:'bakes',cheesecakes:'bakes',breadspace:'bakes',bread:'bakes',korner:'korner',rsvp:'korner',join:'korner',kk:'korner',dinner:'korner',potluck:'korner',interests:'off',neofetch:'home'}))CMD[c]=()=>inGame?say(c+' is on the home page. type exit.','d'):jump(id);
CMD.faith=CMD.story=CMD.testimony;
CMD['road-trip']=CMD.drive=CMD.play=CMD.about;
CMD.games=CMD.imposter=CMD.party=CMD.wavelength=CMD.guess=()=>inGame?say('games are on the home page. type exit first.','d'):(say('opening party games...','d'),setTimeout(()=>{location.href='games/'},350));
const exec=v=>{say('$ '+v,'d');const[c,...r]=v.toLowerCase().split(/\s+/);Object.hasOwn(CMD,c)?CMD[c](r.length?r.join(' '):undefined):say('command not found: '+c+'. try help','d')};
const H=[];let hi=0;
/* zsh-style completion: ghost suggestion (right arrow accepts), Tab / Shift+Tab cycle matches, tappable suggestion chips */
const ALIAS={goto:'cd',open:'cd'},ARGP=()=>({cd:inGame?[...Object.keys(Z),...PINS.map(p=>p[0])]:[],theme:[...THEMES,'list'],fly:['seattle','texas','asia']});
const cands=v=>{const t=v.replace(/^\s+/,''),sp=t.indexOf(' ');
 if(sp<0){const q=t.toLowerCase();return{pre:'',tail:t,list:[...new Set(Object.keys(CMD))].filter(k=>k.startsWith(q)).sort()}}
 const c=t.slice(0,sp).toLowerCase(),rest=t.slice(sp+1),pool=ARGP()[ALIAS[c]||c]||[];
 return{pre:t.slice(0,sp+1),tail:rest,list:[...new Set(pool)].filter(k=>k.startsWith(rest.toLowerCase())).sort()}};
const lcp=l=>l.reduce((p,x)=>{let n=0;while(n<p.length&&n<x.length&&p[n]===x[n])n++;return p.slice(0,n)});
const wire=(f,i)=>{
 const ig=document.createElement('div');ig.className='ig';i.parentNode.insertBefore(ig,i);ig.append(i);
 const gh=document.createElement('span');gh.className='gh';gh.setAttribute('aria-hidden','true');ig.insertBefore(gh,i);
 const sug=document.createElement('div');sug.className='sug';sug.setAttribute('role','listbox');sug.hidden=true;f.after(sug);
 i.setAttribute('aria-autocomplete','list');
 let st=null;
 const ghost=()=>{const v=i.value;if(!v||document.activeElement!==i)return'';
  const h=[...H].reverse().find(x=>x.length>v.length&&x.toLowerCase().startsWith(v.toLowerCase()));if(h)return h.slice(v.length);
  const c=cands(v),m=c.list.find(k=>k.length>c.tail.length&&k.startsWith(c.tail.toLowerCase()));return m?m.slice(c.tail.length):''};
 const render=()=>{
  const g=ghost();gh.textContent='';
  if(g){const h=document.createElement('span');h.style.visibility='hidden';h.textContent=i.value;gh.append(h,g)}
  const c=st||cands(i.value),show=document.activeElement===i&&i.value.trim()&&c.list.length>(st?0:0)&&!(c.list.length===1&&c.list[0]===c.tail.toLowerCase());
  sug.hidden=!show;if(!show){sug.textContent='';return}
  const idx=st?st.idx:-1,start=Math.max(0,Math.min(idx-3,c.list.length-8));
  sug.textContent='';
  c.list.slice(start,start+12).forEach((k,n)=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.setAttribute('role','option');b.setAttribute('aria-selected',String(start+n===idx));if(start+n===idx)b.className='on';
   b.onpointerdown=e=>e.preventDefault();b.onclick=()=>{i.value=c.pre+k+(c.pre===''&&Object.hasOwn(ARGP(),k)?' ':'');st=null;i.focus();render()};sug.append(b)});
  if(c.list.length>start+12){const m=document.createElement('span');m.className='d';m.textContent='+'+(c.list.length-start-12)+' more';sug.append(m)}};
 const tab=back=>{
  if(!st||st.val!==i.value){
   const c=cands(i.value);if(!c.list.length)return;
   const p=lcp(c.list);
   if(c.list.length===1){i.value=c.pre+c.list[0]+(c.pre===''&&Object.hasOwn(ARGP(),c.list[0])?' ':'');st=null;render();return}
   if(p.length>c.tail.length){i.value=c.pre+p;st={...c,idx:-1,val:i.value};render();return}
   st={...c,idx:back?c.list.length-1:0,val:''}
  }else st.idx=(st.idx+(back?-1:1)+st.list.length)%st.list.length;
  i.value=st.pre+st.list[st.idx];st.val=i.value;render()};
 f.onsubmit=e=>{e.preventDefault();const v=i.value.trim();i.value='';st=null;render();if(!v)return;H.push(v);hi=H.length;exec(v)};
 i.addEventListener('input',()=>{st=null;render()});
 i.addEventListener('focus',render);i.addEventListener('blur',()=>setTimeout(render,120));
 i.addEventListener('keydown',e=>{
  if(e.key==='Tab'){if(!i.value.trim())return;e.preventDefault();tab(e.shiftKey);return}
  if(e.key==='Escape'&&(st||!sug.hidden)){st=null;sug.hidden=true;gh.textContent='';e.stopPropagation();return}
  if((e.key==='ArrowRight'||e.key==='End')&&i.selectionStart===i.value.length){const g=ghost();if(g){e.preventDefault();i.value+=g;st=null;render();return}}
  if(e.key==='ArrowUp'){hi=Math.max(0,hi-1);i.value=H[hi]||'';e.preventDefault();st=null;render()}
  if(e.key==='ArrowDown'){hi=Math.min(H.length,hi+1);i.value=H[hi]||'';st=null;render()}})};
wire($('#if'),$('#iin'));wire($('#gf'),$('#gin'));
$('#themebtn').onclick=()=>CMD.theme();
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=e=>{e.preventDefault();jump(b.dataset.s)});
document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>exec(b.dataset.c));
const kn=e=>e.key.length===1?e.key.toLowerCase():e.key;
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){if(e.key==='Escape')e.target.blur();return}
 if(e.key==='/'||e.key==='`'){e.preventDefault();$(inGame?'#gin':'#iin').focus();return}
 if(!inGame)return;if(e.key.startsWith('Arrow'))e.preventDefault();keys[kn(e)]=1});
addEventListener('keyup',e=>{keys[kn(e)]=0});addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;b.onpointerdown=e=>{e.preventDefault();keys[k]=1};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{keys[k]=0}});
say('type “about me” to start the road trip, or try help.');


try{const s=localStorage.getItem('kj-theme');if(s&&THEMES.includes(s))document.documentElement.dataset.theme=s}catch(_){}
