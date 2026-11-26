/* Shares the site theme with the games: reads and saves the same setting as the terminal's `theme` command. */
(()=>{
const TH=['light','dark','dracula','gruvbox','nord','solarized','matrix','batman'],r=document.documentElement,b=document.getElementById('thm');
const now=()=>r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
const paint=()=>{if(b)b.textContent='theme: '+now()};
paint();
if(b)b.onclick=()=>{const n=TH[(TH.indexOf(now())+1)%TH.length];r.dataset.theme=n;try{localStorage.setItem('kj-theme',n)}catch(_){}paint()};
addEventListener('storage',e=>{if(e.key==='kj-theme'&&TH.includes(e.newValue)){r.dataset.theme=e.newValue;paint()}});
})();
