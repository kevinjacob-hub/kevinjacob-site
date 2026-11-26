// Kevin's Korner: past nights with photos, and the guest list sign-up.
// An RSVP is emailed to Kevin through KK.endpoint (FormSubmit), so no database is needed.
// If that can't be reached (for example inside claude.ai, which blocks outside requests), it falls back to
// (2) the artifact's shared list when the viewer can write to it, or (3) an email draft, which is never reported as sent.
(()=>{
const q=s=>document.querySelector(s),root=q('#kk');
if(!root||typeof KK==='undefined')return;
const SLOTS=8,title=v=>v.title||'KK #'+v.n;
const events=KK.events.map(v=>`<article class="pj kkev"><h3>${esc(title(v))}${v.date?` <span class="d">${esc(v.date)}</span>`:''}</h3>${v.menu?`<p>${esc(v.menu)}</p>`:''}${v.note?`<p class="d">${esc(v.note)}</p>`:''}${photoGrid('images/kk-'+v.n+'-',SLOTS,title(v))}</article>`).join('');
const n=KK.next||{};
const next=n.when?`<p class="kk-next"><span class="u">[next]</span> ${esc(n.when)}${n.what?' · '+esc(n.what):''}<br><span class="d">${esc(n.where||'')}</span></p>`:`<p class="kk-next d">Next date coming soon. Join the list and you’ll hear first.</p>`;
root.innerHTML=`<p class="kk-lead">${esc(KK.tagline)}</p>`
 +`<div class="tags">${KK.corners.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`
 +`<p class="sub">// past nights</p>${events}`
 +`<p class="sub">// join the guest list</p>${next}`
 +`<form id="kkf" class="kkf" autocomplete="off">
  <label>name <input name="name" required maxlength="60" placeholder="first name is fine"></label>
  <label>which corner of Kevin’s life? <select name="corner" required><option value="">choose one</option>${KK.corners.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label>
  <label>email or phone (private) <input name="contact" maxlength="120" placeholder="so Kevin can send the address"></label>
  <label>party size <select name="party">${[1,2,3,4].map(x=>`<option>${x}</option>`).join('')}</select></label>
  <label class="w2">allergies or diet (private) <input name="diet" maxlength="160"></label>
  <label class="w2">bringing something? (potluck nights) <input name="bring" maxlength="160"></label>
  <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="w2"><button class="cta" type="submit">add me to the list</button> <span id="kkst" class="d" role="status" aria-live="polite"></span></div>
 </form><div id="kkfb"></div>
 <div id="kklw" hidden><p class="sub">// on the list: <span id="kkc">0</span> <span class="d">(names and corners only)</span></p><div class="tags" id="kkl"></div></div>`;

// photos: drop the ones that don't exist, click one to enlarge
root.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.kkph'))e.target.closest('.kkph').remove()},true);
root.addEventListener('click',e=>{const f=e.target.closest('.kkph');if(f)f.classList.toggle('big')});

const form=q('#kkf'),st=q('#kkst');
const say=(m,ok)=>{st.textContent=m;st.style.color=ok?'var(--ok)':''};

// the shared database, when this view has it and may write to it
let dbp=null;
const getDb=()=>dbp||(dbp=(async()=>{try{
 if(!window.claude||!claude.use)return null;
 const db=await claude.use('db');if(!db)return null;
 const user=await claude.use('user');const id=user&&await user.id();if(!id)return null;
 try{if(user.can&&(await user.can('data.write'))===false)return null}catch(_){}
 return{db,id}}catch(_){return null}})());
getDb().then(d=>{if(!d)return;
 const wrap=q('#kklw'),list=q('#kkl'),cnt=q('#kkc');
 const timer=setTimeout(()=>{if(wrap.hidden){wrap.hidden=false;list.textContent='the live list can’t be reached right now'}},10000);
 try{d.db.collection('kkpub').orderBy('ts').limit(300).onSnapshot(snap=>{
  clearTimeout(timer);wrap.hidden=false;list.textContent='';
  const rows=snap.docs.map(x=>x.data()||{});cnt.textContent=String(rows.length);
  if(!rows.length){list.textContent='be the first';return}
  rows.forEach(r=>{const s=document.createElement('span');s.textContent=String(r.name||'guest')+(r.corner?' · '+r.corner:'');list.append(s)})
 },()=>clearTimeout(timer))}catch(_){clearTimeout(timer)}
});

const done=(r,how)=>{say((how==='email'?'Sent! Kevin got your RSVP by email, '+r.name+'. He’ll send details':'You’re on the list, '+r.name+'. Kevin will send details')+(r.contact?'.':'. (Next time add an email or phone so he can reach you.)'),true);form.reset();q('#kkfb').textContent=''};
// email Kevin through the form endpoint. true only when the service accepted it
const emailIt=async r=>{
 if(!KK.endpoint)return false;
 const body={_subject:'Kevin’s Korner RSVP: '+r.name,_template:'table',_captcha:'false',_honey:'',name:r.name,corner:r.corner,'party size':r.party,contact:r.contact||'(none given)','allergies / diet':r.diet||'(none)',bringing:r.bring||'(nothing yet)',sent:new Date(r.ts).toString()};
 if(/@/.test(r.contact))body.email=r.contact; // lets you hit reply
 const res=await fetch(KK.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
 if(!res.ok)return false;
 let j=null;try{j=await res.json()}catch(_){}
 return !(j&&(j.success===false||j.success==='false'))};
const fallback=r=>{
 const msg=['Hi Kevin, please add me to the Kevin’s Korner guest list.','Name: '+r.name,'Corner: '+r.corner,'Party size: '+r.party,r.contact&&'Contact: '+r.contact,r.diet&&'Allergies/diet: '+r.diet,r.bring&&'Bringing: '+r.bring].filter(Boolean).join('\n');
 const box=q('#kkfb');box.className='kkfb';box.textContent='';
 const p=document.createElement('p');p.append('This page couldn’t send your RSVP automatically, so nothing has been sent yet. Email Kevin instead: ');
 const a=document.createElement('a');a.href='mailto:'+KK.email+'?subject='+encodeURIComponent('Kevin’s Korner guest list')+'&body='+encodeURIComponent(msg);a.textContent='open an email draft';
 p.append(a,' (or send it to '+KK.email+').');
 const pre=document.createElement('pre');pre.textContent=msg;
 const cp=document.createElement('button');cp.type='button';cp.textContent='copy message';
 cp.onclick=async()=>{try{await navigator.clipboard.writeText(msg);cp.textContent='copied'}catch(_){cp.textContent='select the text above to copy'}};
 box.append(p,pre,cp);say('Not sent yet: see below.')};

form.onsubmit=async ev=>{
 ev.preventDefault();const f=new FormData(form);if(f.get('website'))return;
 const g=k=>String(f.get(k)||'').trim();
 const r={name:g('name').slice(0,60),corner:g('corner'),contact:g('contact').slice(0,120),party:g('party')||'1',diet:g('diet').slice(0,160),bring:g('bring').slice(0,160),ts:Date.now()};
 if(!r.name||!r.corner){say('Add your name and pick a corner.');return}
 const btn=form.querySelector('button[type=submit]');btn.disabled=true;say('Adding you…');
 try{
  try{if(await emailIt(r))return done(r,'email')}catch(_){/* blocked or offline: try the next route */}
  const d=await getDb();
  if(d){try{
   await d.db.collection('kkpub').doc(d.id).set({name:r.name,corner:r.corner,party:r.party,ts:r.ts});
   await d.db.collection('kkpriv').doc(d.id).set(r);
   return done(r)}catch(_){/* not allowed to write here: try the next route */}}
  fallback(r)
 }finally{btn.disabled=false}};
})();
