// Landing page: fills the sections from content.js and types in the intro.
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const note=s=>s?` <span class="d">${esc(s)}</span>`:'';
const tags=a=>`<div class="tags">${a.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;

// neofetch-style card
$('#nf').innerHTML=`<pre class="art" aria-hidden="true">${esc(ART)}</pre><div class="kv"><div class="rule"><b class="u">kevin</b>@<b class="u">seattle</b></div><div class="rule">-------------</div>`
 +NEOFETCH.map(([k,v])=>`<div class="k">${esc(k)}</div><div>${esc(v)}</div>`).join('')+'</div>';

// experience as a git-log style timeline
$('#ex').innerHTML='<ol class="log">'+EXPERIENCE.map(e=>`<li><span class="when">${esc(e.when)}</span><h3>${esc(e.org)} <span class="d">${esc(e.role)}</span></h3><ul>${e.pts.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></li>`).join('')+'</ol>';

$('#pj').innerHTML=PROJECTS.map(g=>`<p class="sub">// ${esc(g.g)}</p>`+g.items.map(p=>`<article class="pj"><h3>${esc(p.n)}</h3>${p.meta?`<div class="d">${esc(p.meta)}</div>`:''}<p>${esc(p.d)}${note(p.note)}</p></article>`).join('')).join('');

$('#sk').innerHTML=`<p class="sub">// core strengths</p>${tags(SKILLS.strengths)}<p class="sub">// tools</p>${tags(SKILLS.tools)}<p class="sub">// languages</p><p>${esc(SKILLS.languages)}</p>`;
$('#of').innerHTML=tags(OFF);

// bakes: product cards (photo, name, description) for the cheesecakes and the Breadspace
const bkCard=(c,img,i)=>`<article class="bk"><figure class="bkp" style="background:linear-gradient(135deg,hsl(${24+(i*11)%36} 72% 62%),hsl(${14+(i*11)%36} 55% 38%))"><img src="${img}" alt="${esc(c.n)}" loading="lazy"></figure><div class="bkb"><h3>${esc(c.n)}</h3>${c.meta?`<div class="d">${esc(c.meta)}</div>`:''}<p>${c.d?esc(c.d):'<span class="d">// add a description</span>'}</p></div></article>`;
$('#bk').innerHTML=`<p>${esc(BAKES.intro)}</p><p class="sub">// cheesecakes</p><div class="bks">${BAKES.cakes.map((c,i)=>bkCard(c,c.img||'images/cheesecake-'+(i+1)+'.jpg',i)).join('')}</div>`
 +`<p class="sub">// ${esc(BAKES.bs.n.toLowerCase())}</p><p>${esc(BAKES.bs.d)}</p><div class="bks">${BAKES.bs.items.map((c,i)=>bkCard(c,c.img||'images/breadspace-item-'+(i+1)+'.jpg',i+3)).join('')}</div>`
 +`<p class="sub">// photos from the popup</p>${photoGrid('images/breadspace-',8,BAKES.bs.n)}`;
$('#bk').addEventListener('error',e=>{if(e.target.tagName!=='IMG')return;const f=e.target.closest('.kkph');if(f)f.remove();else e.target.remove()},true);
$('#bk').addEventListener('click',e=>{const f=e.target.closest('.kkph,.bkp');if(f)f.classList.toggle('big')});
$('#bl').innerHTML=POSTS.length?POSTS.map(p=>`<article class="pj"><h3>${p.url?`<a href="${esc(p.url)}" rel="noopener">${esc(p.title)}</a>`:esc(p.title)}</h3><div class="d">${esc(p.date)}</div><p>${esc(p.sum)}</p></article>`).join(''):'<p class="d">No posts yet. They will show up here.</p>';

// gallery, testimony and resume
$('#gal').innerHTML=T.map((p,n)=>tile(p,'images/gallery-'+(n+1)+'.jpg')).join('');
$('#tm').innerHTML=`<p class='d'>// faith is a big part of my life. this is my story, in my own words.</p>`+BAPTISM.map(s=>`<h3 class='fh'>${esc(s.h)}</h3>`+s.p.map(p=>`<p class='fp'>${esc(p)}</p>`).join('')).join('')+`<details class='court'><summary>my statement in court <span class='d'>(heavy read: the accident and my recovery)</span></summary>`+COURT.map(p=>`<p class='fp'>${esc(p)}</p>`).join('')+`</details>`;
// the PDF only loads inline when asked: an embedded viewer grabs focus and scrolls the page to itself
$('#rs').innerHTML=`<div class='chips'><a class='btn' href='${RESUME}' target='_blank' rel='noopener'>open resume.pdf</a><button id='rsv' class='btn'>preview here</button></div><div id='rsp'></div>`;
$('#rsv').onclick=()=>{const p=$('#rsp'),b=$('#rsv');if(p.firstChild){p.textContent='';b.textContent='preview here';return}
 p.innerHTML=`<object class='pdf' data='${RESUME}#view=FitH' type='application/pdf'><p class='d'>Your browser can’t show the PDF inline. Use “open resume.pdf” instead.</p></object>`;b.textContent='hide preview'};

// a missing photo just keeps its gradient; a real photo hides the "add a photo" placeholder caption
addEventListener('error',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.ph'))e.target.remove()},true);
addEventListener('load',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.ph')){const f=e.target.nextElementSibling;if(f&&/^add a/.test(f.textContent))f.remove()}},true);

// the intro types itself once; any key or tap finishes it
const typeIntro=()=>{const el=$('#hello'),chars=INTRO.map(l=>Array.from(l));
 $('#hello-sr').textContent=INTRO.join('. ');
 el.innerHTML=INTRO.map(()=>'<div class="tl"></div>').join('');const rows=[...el.children];
 const done=()=>rows.forEach((r,i)=>{r.textContent=INTRO[i];r.classList.remove('typing')});
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){done();return}
 let li=0,ci=0,stop=false;
 const skip=()=>{stop=true;done()};addEventListener('keydown',skip,{once:true});addEventListener('pointerdown',skip,{once:true});
 const step=()=>{if(stop||li>=rows.length)return;const r=rows[li];r.classList.add('typing');r.textContent=chars[li].slice(0,++ci).join('');
  if(ci>=chars[li].length){r.classList.remove('typing');li++;ci=0;setTimeout(step,240)}else setTimeout(step,24)};step()};
typeIntro();
