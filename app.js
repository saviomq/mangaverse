/* Mangáverso – utilitários compartilhados.
   AVISO: o login usa o localStorage do navegador (protótipo). Para produção,
   troque MV.register / MV.login por chamadas a um back-end (Firebase, Supabase etc.). */
const $=(s,r=document)=>r.querySelector(s);
const NV=`#0a0f45`,BL=`#1a2bf5`,LI=`#c6ff2e`;
const MV={
  K:{u:`mv_users`,s:`mv_session`},
  get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null||v===undefined?d:v}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  async hash(p){
    if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest(`SHA-256`,new TextEncoder().encode(`mv:`+p));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,`0`)).join(``)}
    return btoa(unescape(encodeURIComponent(p)))},
  users(){return this.get(this.K.u,[])},
  me(){const e=this.get(this.K.s,null);return e?this.users().find(u=>u.email==e)||null:null},
  async register(name,email,pw){
    email=email.trim().toLowerCase();const us=this.users();
    if(us.some(u=>u.email==email))throw new Error(`Este e-mail já está cadastrado.`);
    us.push({name:name.trim(),email,h:await this.hash(pw),plan:null,at:Date.now()});
    this.set(this.K.u,us);this.set(this.K.s,email)},
  async login(email,pw){
    email=email.trim().toLowerCase();const u=this.users().find(x=>x.email==email);
    if(!u||u.h!=await this.hash(pw))throw new Error(`E-mail ou senha incorretos.`);
    this.set(this.K.s,email)},
  logout(){try{localStorage.removeItem(this.K.s)}catch(e){}location.href=`index.html`},
  setPlan(p){const us=this.users(),u=us.find(x=>x.email==this.get(this.K.s,``));if(u){u.plan=p;this.set(this.K.u,us)}},
  guard(){
    if(!this.me()){location.replace(`login.html?next=`+encodeURIComponent(this.page()));return false}
    document.documentElement.classList.remove(`gate`);return true},
  page(){return location.pathname.split(`/`).pop()||`index.html`},
  next(def){const n=new URLSearchParams(location.search).get(`next`);return n&&/^[a-z]+\.html$/.test(n)?n:def},
  toast(m){let t=$(`#toast`);if(!t){t=document.createElement(`div`);t.id=`toast`;t.className=`toast`;t.setAttribute(`role`,`status`);document.body.appendChild(t)}
    t.textContent=m;t.classList.add(`on`);clearTimeout(this._t);this._t=setTimeout(()=>t.classList.remove(`on`),2000)}
};
/* personagens originais em estilo mangá */
const CH=(hair,spiky,acc,iris)=>`<svg viewBox="0 0 300 400" aria-hidden="true">${spiky?``:`<path d="M78 190C55 80 245 80 222 190L242 350 170 308h-40L58 350z" fill="${hair}" stroke="${NV}" stroke-width="5"/>`}<path d="M45 400C58 325 105 305 150 300c45 5 92 25 105 100z" fill="#fff" stroke="${NV}" stroke-width="5"/><path d="M150 302l-24 38 24 60 24-60z" fill="${acc}" stroke="${NV}" stroke-width="4"/><path d="M125 255h50v50c-12 14-38 14-50 0z" fill="#fde7d8" stroke="${NV}" stroke-width="5"/><path d="M96 170C96 112 204 112 204 170 204 232 176 278 150 282 124 278 96 232 96 170z" fill="#fde7d8" stroke="${NV}" stroke-width="5"/><g stroke="${NV}" stroke-width="3"><ellipse cx="124" cy="192" rx="14" ry="18" fill="#fff"/><ellipse cx="176" cy="192" rx="14" ry="18" fill="#fff"/></g><ellipse cx="126" cy="195" rx="10" ry="14" fill="${iris}"/><ellipse cx="174" cy="195" rx="10" ry="14" fill="${iris}"/><circle cx="126" cy="196" r="5" fill="${NV}"/><circle cx="174" cy="196" r="5" fill="${NV}"/><circle cx="121" cy="188" r="4" fill="#fff"/><circle cx="169" cy="188" r="4" fill="#fff"/><path d="M108 168q16-10 32-2M160 166q16-8 32 2M142 238q8 7 16 0" fill="none" stroke="${NV}" stroke-width="4" stroke-linecap="round"/>${spiky?`<path d="M86 178L64 108 104 132 106 62 142 114 168 48 184 112 222 74 220 134 234 178C222 140 196 124 150 122 106 124 90 146 86 178z" fill="${hair}" stroke="${NV}" stroke-width="5" stroke-linejoin="round"/><path d="M120 80l8 36M170 70l-6 34" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`:`<path d="M90 176C92 118 128 98 150 110 176 98 208 118 210 176 192 150 172 136 150 148 128 136 108 150 90 176z" fill="${hair}" stroke="${NV}" stroke-width="5" stroke-linejoin="round"/><path d="M124 112l-6 24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`}</svg>`;
function layout(){
  const u=MV.me(),cur=MV.page();
  const L=[[`index.html`,`Início`],...(u?[[`biblioteca.html`,`Biblioteca`]]:[]),[`sobre.html`,`Sobre nós`],[`faq.html`,`FAQ`]];
  const n=$(`#nav`);
  if(n)n.innerHTML=`<nav><div class="wrap"><a class="logo" href="index.html" aria-label="Mangáverso"><b>Manga</b><span>verso</span></a><div class="pills">${L.map(([h,t])=>`<a href="${h}"${h==cur?` aria-current="page"`:``}>${t}</a>`).join(``)}</div><div class="act">${u?`<a class="btn sm w" href="planos.html">${u.plan?`Plano `+u.plan:`Planos`}</a><button class="btn sm" id="out">Sair</button>`:`<a class="btn sm w" href="login.html">Entrar</a><a class="btn sm" href="cadastro.html">Criar conta</a>`}<button class="tbtn" id="theme" aria-label="Alternar tema">◐</button></div></div></nav>`;
  const f=$(`#foot`);
  if(f)f.innerHTML=`<footer class="blue"><div class="wrap"><div class="big dsp">Mangáverso</div><div><p>Distribuição de mangás por assinatura e venda física.</p></div><div><p><a href="index.html">Início</a><a href="sobre.html">Sobre nós</a><a href="faq.html">FAQ</a>${u?`<a href="biblioteca.html">Biblioteca</a>`:`<a href="login.html">Entrar</a>`}</p><p>© 2026 Mangáverso. Todos os direitos reservados.</p></div></div></footer>`;
  const o=$(`#out`);if(o)o.onclick=()=>MV.logout();
  const t=$(`#theme`);if(t)t.onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).getPropertyValue(`--paper`).trim()==`#0a0f45`;r.dataset.theme=d?`light`:`dark`};
  document.querySelectorAll(`[data-ch]`).forEach(e=>e.innerHTML=e.dataset.ch==`0`?CH(NV,true,LI,BL):CH(LI,false,BL,NV));
}
layout();
