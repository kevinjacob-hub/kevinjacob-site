// Fake IDE window: close / minimize / maximize, drag, explorer scroll-spy, mobile drawer.
(()=>{
const $=s=>document.querySelector(s),win=$('#win'),ed=$('#ed'),dot=$('#dot'),empty=$('#empty');
let state='open',moved=[0,0];
const small=()=>innerWidth<=720;
const place=()=>{win.style.transform=win.classList.contains('max')||small()?'':`translate(${moved[0]}px,${moved[1]}px)`};
const sync=()=>{dot.classList.toggle('on',state!=='closed');empty.hidden=state!=='closed';document.body.classList.toggle('wmax',state==='open'&&win.classList.contains('max'))};
const anim=()=>{win.classList.add('anim');clearTimeout(anim.t);anim.t=setTimeout(()=>win.classList.remove('anim'),300)};
const hide=()=>{anim();win.classList.add('gone');setTimeout(()=>{if(state!=='open')win.hidden=true},230)};
const open=()=>{state='open';win.hidden=false;anim();void win.offsetWidth;win.classList.remove('gone');sync();place()};
const close=()=>{state='closed';win.classList.remove('max');moved=[0,0];place();hide();sync()};
const mini=()=>{state='min';hide();sync()};
const maxi=()=>{win.classList.toggle('max');place();sync()};
$('#wc').onclick=close;$('#wm').onclick=mini;$('#wx').onclick=maxi;
$('#reopen').onclick=open;
$('#dk').onclick=()=>state==='open'?mini():open();
$('#tb').addEventListener('dblclick',e=>{if(!e.target.closest('button'))maxi()});
// drag by the title bar
let drag=null;
$('#tb').addEventListener('pointerdown',e=>{if(e.target.closest('button')||win.classList.contains('max')||small())return;drag={x:e.clientX-moved[0],y:e.clientY-moved[1]};$('#tb').setPointerCapture(e.pointerId)});
$('#tb').addEventListener('pointermove',e=>{if(!drag)return;const r=win.getBoundingClientRect(),nx=e.clientX-drag.x,ny=e.clientY-drag.y;
 // keep the whole title bar (and its buttons) on screen
 const left=Math.min(Math.max(r.left+nx-moved[0],0),innerWidth-r.width),top=Math.min(Math.max(r.top+ny-moved[1],0),innerHeight-80);
 moved=[moved[0]+left-r.left,moved[1]+top-r.top];place()});
const end=()=>{drag=null};$('#tb').addEventListener('pointerup',end);$('#tb').addEventListener('pointercancel',end);
// explorer
const files=[...document.querySelectorAll('#files [data-n]')];
const spy=()=>{const top=ed.getBoundingClientRect().top+90;let cur=files[0];
 for(const b of files){const el=document.getElementById(b.dataset.s);if(el&&el.getBoundingClientRect().top<=top)cur=b}
 if(ed.scrollTop+ed.clientHeight>=ed.scrollHeight-4)cur=files[files.length-1];
 files.forEach(b=>b.classList.toggle('on',b===cur));$('#tabname').textContent=cur.dataset.n;$('#crumb').textContent='kevinjacob › '+cur.dataset.n};
ed.addEventListener('scroll',spy,{passive:true});spy();
// mobile drawer
const side=v=>{win.classList.toggle('side-open',v);$('#burger').setAttribute('aria-expanded',String(v))};
$('#burger').onclick=()=>side(!win.classList.contains('side-open'));
$('#files').addEventListener('click',e=>{if(e.target.closest('button'))side(false)});
// opening a section from the terminal while the window is minimized or closed brings it back
['#iin'].forEach(s=>$(s).addEventListener('focus',()=>{if(state!=='open')open()}));
addEventListener('resize',place);
// nothing should ever scroll the desktop itself (a stray scrollIntoView would push the window out of place)
const intro=$('#intro');intro.addEventListener('scroll',()=>{if(intro.scrollTop)intro.scrollTop=0});
})();
