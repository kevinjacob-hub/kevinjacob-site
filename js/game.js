// The 3D map: lenses, pins, driving, theme. Content comes from content.js.
// Europe and Africa aren't drawn, so everything east of the Atlantic is shifted west by GAP degrees to shrink the ocean in between.
// X0..X1 is the world's edge: fly off one side and you come in from the other.
const GAP=55,GT=-42,X0=-205,X1=520,proj=(lo,la)=>[(lo-(lo>0?GAP:0)+96)*2.6,(38-la)*3.2];
// a lens opens over the state when you drive onto it, and closes when you drive out
const INS={s:{c:proj(-122.33,47.6),r:30,t:'Seattle, WA',tg:'WA',poly:outer(ST.WA)},t:{c:proj(-96.2,32.2),r:38,t:'Texas',tg:'TX',poly:outer(ST.TX)},
 // the Pearl River Delta is tiny on this map, so it gets a stronger lens (k) that opens over a box around it
 h:{c:proj(113.85,22.7),r:22,k:9,t:'Pearl River Delta',tg:'PRD',poly:[[[112.4,21.5],[115.3,21.5],[115.3,23.9],[112.4,23.9]]]}};
const tile=([c,h,s],auto)=>`<figure class="ph" style="background:linear-gradient(135deg,hsl(${h} 65% 55%),hsl(${h+45} 55% 35%))">${s||auto?`<img src="${s||auto}" alt="${c}" loading="lazy">`:''}<figcaption>${c}</figcaption></figure>`;
const RK={s:'seattle',t:'texas',h:'pearl-river-delta'};
for(const k in Z){const z=Z[k],c=INS[z.i].c;z.p=[c[0]+z.o[0],c[1]+z.o[1]]}
// a pin that sits under a zoom lens is hidden while the lens is open; pins that fit inside a lens also get a magnified twin there
const PI=[],PK={},KP=3.75;
for(const[k,name,kind,lo,la]of PINS){const w=proj(lo,la),q={k,name,kind,w,cov:[],tw:[]};PK[k]=q;
 for(const n in INS){const I=INS[n];if(Math.hypot(w[0]-I.c[0],w[1]-I.c[1])<I.r+1)q.cov.push(n);const K=I.k||KP,o=[(w[0]-I.c[0])*K,(w[1]-I.c[1])*K];if(Math.hypot(o[0],o[1])<I.r-3)q.tw.push({n,o,p:[I.c[0]+o[0],I.c[1]+o[1]]})}}
const $=s=>document.querySelector(s),css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let mode='car',tm=1,alt=.15,usT=0,roll=0,poof=null,carM,planeM,shade,GL=false,started=false,inGame=false,R,S,cam,car,gnd,ang=0,sp=0,cur=null,dis=null,raf=0,last=0,fit=()=>{};const keys={},L={land:[],dim:[],accM:[],accL:[],ins:[],stl:[]};
const pip=(x,z,rs)=>{const l=x/2.6-96,lo=l>=GT?l+GAP:l,la=38-z/3.2;return rs.some(r=>{let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const[a,b]=r[i],[d,e]=r[j];if((b>la)!==(e>la)&&lo<(d-a)*(la-b)/(e-b)+a)c=!c}return c})};
// the car turns into a plane whenever it leaves the US: the lower 48 (from the state shapes) plus Alaska and Hawaii, or an open Seattle/Texas lens
const US_RINGS=[].concat(...Object.values(ST).map(outer),outer(USX));
const inUS=(x,z)=>{for(const k of['s','t']){const n=INS[k];if(n.open&&Math.hypot(x-n.c[0],z-n.c[1])<n.r+1)return true}const r=US_RINGS;return pip(x,z,r)||pip(x+1.2,z,r)||pip(x-1.2,z,r)||pip(x,z+1.2,r)||pip(x,z-1.2,r)};
const setMode=(m,instant)=>{if(m===mode&&!instant)return;mode=m;usT=0;tm=instant?1:0;
 if(instant){alt=m==='plane'?7:.15;car.position.y=alt}
 else{const r=new THREE.Mesh(new THREE.RingGeometry(.6,1,28),new THREE.MeshBasicMaterial({color:0xffc857,transparent:true,opacity:.8,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;S.add(r);poof={m:r,t:0}}};
const syncMode=()=>setMode(inUS(car.position.x,car.position.z)?'car':'plane',true);
// photo grids: images load by file name, missing ones remove themselves, click to enlarge
const photoGrid=(base,n,alt)=>`<div class="kkp">${Array.from({length:n},(_,i)=>`<figure class="kkph"><img src="${base}${i+1}.jpg" alt="${esc(alt)}, photo ${i+1}" loading="lazy"></figure>`).join('')}</div>`;
const gals=z=>(z.gal||[]).map(g=>`<p class="sub">// ${g.h}</p>`+(g.kk?KK.events.map(v=>`<p class="d">${esc(v.title||'KK #'+v.n)}${v.date?' · '+esc(v.date):''}</p>`+photoGrid('images/kk-'+v.n+'-',8,v.title||'KK #'+v.n)).join(''):photoGrid(g.base,g.n,g.alt))).join('');
const P=$('#panel'),closeP=()=>{P.hidden=true},openP=k=>{const z=Z[k]||REG[k]||CITY[k];$('#pt').textContent='~/'+k;$('#pb').innerHTML=`<p class="d">visitor@${HANDLE}:~$ cat ${k}.md</p><h4>${z.t}</h4><div class="d">${z.sub}</div>`+(z.pics?`<div class="g">${z.pics.map((p,n)=>tile(p,'images/'+k+'-'+(n+1)+'.jpg')).join('')}</div>`:'')+gals(z)+z.html;$('#pb').scrollTop=0;P.hidden=false};
$('#pb').addEventListener('error',e=>{const f=e.target.tagName==='IMG'&&e.target.closest('.kkph');if(f)f.remove()},true);
$('#pb').addEventListener('click',e=>{const f=e.target.closest('.kkph');if(f)f.classList.toggle('big')});
$('#px').onclick=()=>{dis=cur;closeP()};
const paint=(a,v)=>a.forEach(m=>m.material.color.set(css(v)));
const applyTheme=()=>{if(!S)return;const b=css('--bg');S.background=new THREE.Color(b);S.fog=new THREE.Fog(b,60,170);const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=b;x.fillRect(0,0,128,128);x.strokeStyle=css('--line');x.lineWidth=3;x.strokeRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(325,225);gnd.material.map=t;gnd.material.needsUpdate=true;paint(L.land,'--land');paint(L.dim,'--dim');paint(L.accM,'--acc');paint(L.accL,'--acc');paint(L.ins,'--inset');paint(L.stl,'--dim')};
const initGame=()=>{
 try{R=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true})}catch(e){return false}
 const M=c=>new THREE.MeshLambertMaterial({color:c});
 const box=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);p.add(m);return m};
 const cyl=(a,b,h,c,x,y,z,p,s=16,ry=0)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s),M(c));m.position.set(x,y,z);m.rotation.y=ry;p.add(m);return m};
 const lab=(t,p,x,y,z,sc)=>{const cv=document.createElement('canvas');cv.width=288;cv.height=64;const g=cv.getContext('2d');g.font='bold 24px monospace';g.textAlign='center';g.lineWidth=6;g.strokeStyle='#000';g.strokeText(t,144,42);g.fillStyle='#fff';g.fillText(t,144,42);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));s.scale.set(9*sc,2*sc,1);s.position.set(x,y,z);p.add(s);return s};
 R.setPixelRatio(Math.min(devicePixelRatio,2));S=new THREE.Scene();cam=new THREE.PerspectiveCamera(60,1,.1,400);cam.position.set(-22,10,-5);
 S.add(new THREE.AmbientLight(0xffffff,.75));const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(20,40,10);S.add(dl);
 gnd=new THREE.Mesh(new THREE.PlaneGeometry(1300,900),new THREE.MeshBasicMaterial());gnd.rotation.x=-Math.PI/2;gnd.position.set(250,0,70);S.add(gnd);
 const draw=(mp,y,mArr,lArr,op)=>{const P2=r=>r.map(([a,b])=>{const[x,z]=proj(a,b);return new THREE.Vector2(x,-z)});
  for(const poly of mp){const sh=new THREE.Shape(P2(poly[0]));for(let h=1;h<poly.length;h++)sh.holes.push(new THREE.Path(P2(poly[h])));
   const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({side:THREE.DoubleSide,transparent:op<1,opacity:op}));m.rotation.x=-Math.PI/2;m.position.y=y;S.add(m);mArr.push(m);
   for(const r of poly){const l=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(r.map(([a,b])=>{const[x,z]=proj(a,b);return new THREE.Vector3(x,y+.03,z)})),new THREE.LineBasicMaterial());S.add(l);lArr.push(l)}}};
 const cen=r=>{let a=0,x=0,z=0;for(let i=0,j=r.length-1;i<r.length;j=i++){const p=proj(r[j][0],r[j][1]),q=proj(r[i][0],r[i][1]),f=p[0]*q[1]-q[0]*p[1];a+=f;x+=(p[0]+q[0])*f;z+=(p[1]+q[1])*f}a/=2;return[x/(6*a),z/(6*a),Math.abs(a)]};
 const flat=(t,x,z,s)=>{const cv=document.createElement('canvas');cv.width=128;cv.height=64;const g=cv.getContext('2d');g.font='bold 40px monospace';g.textAlign='center';g.fillStyle='#fff';g.fillText(t,64,46);const m=new THREE.Mesh(new THREE.PlaneGeometry(s*2,s),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,opacity:.8,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.12,z);S.add(m);L.stl.push(m)};
 for(const nm in WLD)draw(WLD[nm],.01,L.land,L.dim,1);
 draw(USX,.02,L.land,L.dim,1);
 for(const nm of['India','China'])draw(WLD[nm],.07,L.accM,L.accL,.45);
 for(const[nm,lo,la]of[['India',78.5,19],['China',103,35]]){const p=proj(lo,la);flat(nm,p[0],p[1],6)}
 for(const ab in ST){draw(ST[ab],.02,L.land,L.dim,1);if(ab==='TX'||ab==='WA')continue;let b=null;for(const poly of ST[ab]){const c=cen(poly[0]);if(!b||c[2]>b[2])b=c}if(b[2]>=14)flat(ab,b[0],b[1],3)}
 draw(ST.TX,.07,L.accM,L.accL,.45);draw(ST.WA,.07,L.accM,L.accL,.45);
 for(const k in INS){const n=INS[k],g=new THREE.Group();g.position.set(n.c[0],0,n.c[1]);g.scale.setScalar(.001);g.visible=false;S.add(g);n.g=g;n.s=0;n.open=false;
  const d=new THREE.Mesh(new THREE.CircleGeometry(n.r,64),new THREE.MeshBasicMaterial());d.rotation.x=-Math.PI/2;d.position.y=.15;g.add(d);L.ins.push(d);
  const rg=new THREE.Mesh(new THREE.RingGeometry(n.r-.5,n.r,64),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));rg.rotation.x=-Math.PI/2;rg.position.y=.2;g.add(rg);L.accM.push(rg);
  lab(n.t,g,0,9,-n.r+4,1.3);n.tag=lab(n.tg,S,n.c[0],3,n.c[1],.7)}
 car=new THREE.Group();carM=new THREE.Group();car.add(carM);box(2,.7,3.6,0xffc857,0,.7,0,carM);box(1.7,.6,1.7,0xf4ecd8,0,1.3,-.2,carM);box(.5,.2,.1,0xffffff,.6,.75,1.8,carM);box(.5,.2,.1,0xffffff,-.6,.75,1.8,carM);
 [[-1,1.3],[1,1.3],[-1,-1.3],[1,-1.3]].forEach(([x,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.4,12),M(0x1a1a1a));w.rotation.z=Math.PI/2;w.position.set(x,.45,z);carM.add(w)});car.position.set(-28,.15,2);ang=-Math.PI/2;S.add(car);
 // the plane the car turns into outside the US: same yellow and cream, nose along +z
 planeM=new THREE.Group();planeM.scale.setScalar(.001);planeM.visible=false;car.add(planeM);
 const fu=cyl(.6,.6,4.6,0xf4ecd8,0,.6,0,planeM,14);fu.rotation.x=Math.PI/2;
 const nz=cyl(0,.6,1.3,0xffc857,0,.6,2.95,planeM,14);nz.rotation.x=Math.PI/2;
 const tl=cyl(.6,.15,1.6,0xf4ecd8,0,.6,-3.1,planeM,14);tl.rotation.x=Math.PI/2;
 box(7.2,.14,1.5,0xffc857,0,.5,.3,planeM);box(2.6,.12,.9,0xffc857,0,.75,-3.3,planeM);box(.12,1.3,1,0xffc857,0,1.4,-3.2,planeM);box(.9,.3,.9,0x2b3a5c,0,1.1,.9,planeM);
 planeM.userData.prop=box(.14,2.4,.12,0x333333,0,.6,3.65,planeM);
 shade=new THREE.Mesh(new THREE.CircleGeometry(2.4,20),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.2,depthWrite:false}));shade.rotation.x=-Math.PI/2;shade.visible=false;S.add(shade);
 syncMode();
 const loaf=g=>{const d=new THREE.Mesh(new THREE.SphereGeometry(1.9,18,10,0,Math.PI*2,0,Math.PI/2),M(0xc98a42));d.scale.y=.8;d.position.y=.3;g.add(d);cyl(1.9,1.9,.3,0xf4ecd8,0,.15,0,g,18)};
 const props={
  home:g=>{cyl(.25,.5,5.5,0xf4ecd8,0,2.75,0,g,8);cyl(2.2,1.2,.6,0xe8b04a,0,5.6,0,g);cyl(.4,.4,1.2,0xf4ecd8,0,6.5,0,g,8);cyl(.05,.05,1.6,0xf4ecd8,0,7.9,0,g,6)},
  'upper-room':g=>{ // a small church: nave with a pitched roof, front bell tower with a steeple and a cross
   box(3,1.8,4.4,0xf0e6d2,0,.9,0,g);
   [[-1,.62],[1,-.62]].forEach(([s,a])=>{const r=box(2,.16,4.8,0x8a4b3a,s*.75,2.33,0,g);r.rotation.z=a});
   box(1.3,3.2,1.3,0xf0e6d2,0,1.6,2.5,g);cyl(0,.95,1.8,0x8a4b3a,0,4.1,2.5,g,4,Math.PI/4);
   box(.1,.8,.1,0xe8b04a,0,5.4,2.5,g);box(.45,.1,.1,0xe8b04a,0,5.55,2.5,g);
   box(.6,.95,.05,0x6b3a2a,0,.5,3.17,g);box(.4,.6,.05,0xffe27a,0,2.4,3.17,g);
   [-1.52,1.52].forEach(x=>[-1.1,.3].forEach(z=>box(.05,.8,.45,0xffe27a,x,1,z,g)))},
  'bakery':loaf,
  'workshop':g=>{for(let i=0;i<14;i++)cyl(1.1+.6*Math.sin(i*.45+.5),1.1+.6*Math.sin(i*.45+.5),.22,i%2?0xff7a45:0xffa070,0,.2+i*.22,0,g,20)},
  'ut-tower':g=>{box(3.4,2,3.4,0xe8dcc0,0,1,0,g);box(2,4,2,0xe8dcc0,0,4,0,g);box(2.4,1,2.4,0xd9c9a2,0,6.5,0,g);cyl(0,1.5,1.2,0xbf5700,0,7.6,0,g,4,Math.PI/4);box(.9,.9,.05,0xffffff,0,5.2,1.03,g)},
  'dallas':g=>{cyl(.25,.35,7,0x667,0,3.5,0,g,8);const b=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12),M(0x6a8cff));b.position.y=7.6;g.add(b);box(1.2,3,1.2,0x667,-2.5,1.5,.8,g);box(1.4,4.5,1.4,0x889,2.4,2.25,-.6,g)},
  'texarkana':g=>{box(.3,3,.3,0x666,0,1.5,0,g);box(1.6,1,.1,0xbf5700,-.9,2.5,0,g);box(1.6,1,.1,0xd64545,.9,2.5,0,g)}};
 for(const k in Z){const z=Z[k],g=new THREE.Group();g.position.set(z.o[0],.15,z.o[1]);INS[z.i].g.add(g);
  const r=new THREE.Mesh(new THREE.RingGeometry(4.2,5,40),new THREE.MeshBasicMaterial({color:z.c,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.1;g.add(r);z.ring=r;props[k](g);lab(z.t,g,0,z.ly,0,1)}
 const mkPin=(q,parent,sc,pos,world,hr,n)=>{const c=q.kind==='c'?0xff5d8f:q.kind==='t'?0xe8b04a:0x2fb384,h=q.kind==='c'?3.4:2.4,g=new THREE.Group();g.position.set(pos[0],.15,pos[1]);g.scale.setScalar(sc);parent.add(g);
  cyl(.12,.12,h,0x8892a8,0,h/2,0,g,6);
  const hd=new THREE.Mesh(q.kind==='t'?new THREE.OctahedronGeometry(.8):new THREE.SphereGeometry(q.kind==='c'?.95:.65,14,10),M(c));hd.position.y=h+.3;g.add(hd);
  if(q.kind==='c'){const r=new THREE.Mesh(new THREE.RingGeometry(1.7,2.2,32),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.05;g.add(r)}
  const lb=lab(q.name,g,0,h+2.4,0,.8);lb.visible=false;PI.push({q,g,lb,p:world,hr,n})};
 for(const k in PK){const q=PK[k];mkPin(q,S,1,q.w,q.w,2.8,null);q.tw.forEach(t=>mkPin(q,INS[t.n].g,1.5,t.o,t.p,4.2,t.n))}
 fit=()=>{R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',fit);applyTheme();
 matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);return true};
const loop=t=>{raf=requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;
 const up=keys.ArrowUp||keys.w,dn=keys.ArrowDown||keys.s,lf=keys.ArrowLeft||keys.a,rt=keys.ArrowRight||keys.d;
 const pl=mode==='plane',turn=(lf?1:0)-(rt?1:0);
 sp+=((up?1:0)-(dn?1:0))*(pl?(keys.Shift?140:62):(keys.Shift?55:26))*dt;sp-=sp*1.2*dt;sp=Math.max(-8,Math.min(pl?125:46,sp));
 ang+=turn*(pl?1.5:2)*dt*Math.max(-1,Math.min(1,sp/5))/(1+Math.abs(sp)/(pl?90:30));
 const fx=Math.sin(ang),fz=Math.cos(ang);let px=car.position.x+fx*sp*dt;const pz=car.position.z+fz*sp*dt;
 // the world wraps at the date line: fly off one edge and you come in from the other
 if(px<X0){px+=X1-X0;cam.position.x+=X1-X0}else if(px>X1){px-=X1-X0;cam.position.x-=X1-X0}
 car.position.x=px;car.position.z=Math.max(-145,Math.min(300,pz));if(car.position.z!==pz)sp*=.6;
 const want=inUS(car.position.x,car.position.z)?'car':'plane';if(want!==mode){usT+=dt;if(usT>.3)setMode(want)}else usT=0;
 tm=Math.min(1,tm+dt*2.2);alt+=((mode==='plane'?7:.15)-alt)*Math.min(1,2.5*dt);car.position.y=alt;
 const sC=mode==='car'?tm:Math.max(0,1-tm*3),sP=mode==='plane'?tm:Math.max(0,1-tm*3);
 carM.visible=sC>.02;carM.scale.setScalar(Math.max(.001,sC));planeM.visible=sP>.02;planeM.scale.setScalar(Math.max(.001,sP));
 roll+=(-turn*.5*Math.min(1,Math.abs(sp)/20)-roll)*Math.min(1,5*dt);planeM.rotation.z=roll;planeM.userData.prop.rotation.z+=dt*(8+Math.abs(sp));
 const hi=Math.max(0,Math.min(1,(alt-.15)/6));shade.visible=hi>.05;shade.material.opacity=.2*hi;shade.position.set(car.position.x,.2,car.position.z);
 if(poof){poof.t+=dt*1.8;poof.m.scale.setScalar(1+poof.t*10);poof.m.material.opacity=.8*Math.max(0,1-poof.t);poof.m.position.set(car.position.x,alt+.6,car.position.z);if(poof.t>=1){S.remove(poof.m);poof=null}}
 car.rotation.y=ang;cam.position.lerp(new THREE.Vector3(car.position.x-fx*(pl?20:13),alt+10,car.position.z-fz*(pl?20:13)),Math.min(1,4*dt));cam.lookAt(car.position.x+fx*4,alt*.55,car.position.z+fz*4);
 for(const k in INS){const n=INS[k],x=car.position.x,z=car.position.z;const was=n.open;if(pip(x,z,n.poly))n.open=true;else if(Math.hypot(x-n.c[0],z-n.c[1])>n.r+1)n.open=false;if(n.open!==was){if(n.open){if(!cur)openP(RK[k])}else closeP()}
  n.s+=((n.open?1:0)-n.s)*Math.min(1,4*dt);n.g.visible=n.s>.02;n.g.scale.setScalar(Math.max(n.s,.001));n.tag.visible=!n.g.visible}
 let hit=null;for(const k in Z){const z=Z[k];if(INS[z.i].s<.9)continue;z.ring.scale.setScalar(1+.06*Math.sin(t/250)*(k===cur?2:1));if(Math.hypot(car.position.x-z.p[0],car.position.z-z.p[1])<5)hit=k}
 let bi=null,bd=12,hp=null;for(const i of PI){const on=i.n?INS[i.n].s>=.9:!i.q.cov.some(c=>INS[c].s>.5);if(!i.n)i.g.visible=on;i.lb.visible=false;if(!on)continue;const d=Math.hypot(car.position.x-i.p[0],car.position.z-i.p[1]);if(d<bd){bd=d;bi=i}if(i.q.kind==='c'&&d<i.hr&&!hit){hit=i.q.k;hp=i}}
 if(hp||bi)(hp||bi).lb.visible=true;
 if(hit!==cur){cur=hit;if(!hit){dis=null;closeP()}else if(hit!==dis)openP(hit)}
 R.render(S,cam)};

const go=k=>{const z=Z[k],n=INS[z.i];n.open=true;n.s=1;n.g.visible=true;n.g.scale.setScalar(1);n.tag.visible=false;
 const vx=n.c[0]-z.p[0],vz=n.c[1]-z.p[1],l=Math.hypot(vx,vz);car.position.set(z.p[0]+vx/l*3.5,.15,z.p[1]+vz/l*3.5);ang=Math.atan2(-vx,-vz);sp=0;cur=k;dis=null;syncMode();openP(k)};
const fly=k=>{const n=INS[k];car.position.set(n.c[0],.15,n.c[1]+(k==='s'?4:0));ang=Math.PI;sp=0;cur=null;dis=null;syncMode();closeP()};
const flyAsia=()=>{const p=proj(90,26);car.position.set(p[0],7,p[1]);ang=Math.PI/2;sp=0;cur=null;dis=null;syncMode();closeP()};
const goPin=k=>{const q=PK[k],c=q.kind==='c'?2:4;for(const n of Object.values(INS)){n.open=false;n.s=0;n.g.visible=false;n.tag.visible=true}
 if(q.tw.length){const t=q.tw[0],n=INS[t.n];n.open=true;n.s=1;n.g.visible=true;n.g.scale.setScalar(1);n.tag.visible=false;car.position.set(t.p[0],.15,t.p[1]+c)}
 else car.position.set(q.w[0],.15,q.w[1]+c);ang=Math.PI;sp=0;cur=null;dis=null;syncMode();closeP()};
