/* Mangáverso – utilitários compartilhados.
   AVISO: o login usa o localStorage do navegador (protótipo). Para produção,
   troque MV.register / MV.login por chamadas a um back-end (Firebase, Supabase etc.). */
const $=(s,r=document)=>r.querySelector(s);
const NV=`#0a0f45`,BL=`#1a2bf5`,LI=`#c6ff2e`;
const MV={
  K:{u:`mv_users`,s:`mv_session`,t:`mv_theme`},
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
const savedTheme=MV.get(MV.K.t,null);
if(savedTheme===`light`||savedTheme===`dark`)document.documentElement.dataset.theme=savedTheme;
function isDarkTheme(){
  const th=document.documentElement.dataset.theme;
  return th?th===`dark`:matchMedia(`(prefers-color-scheme:dark)`).matches;
}
function layout(){
  const u=MV.me(),cur=MV.page();
  const n=$(`#nav`);
  if(n){
    const acts=u
      ?[
        ...(cur!==`biblioteca.html`?[`<a class="btn sm w" href="biblioteca.html">Biblioteca</a>`]:[]),
        ...(cur!==`planos.html`?[`<a class="btn sm w" href="planos.html">${u.plan?`Plano `+u.plan:`Planos`}</a>`]:[]),
        `<button class="btn sm" id="out">Sair</button>`
      ]
      :[
        ...(cur!==`login.html`?[`<a class="btn sm w" href="login.html">Entrar</a>`]:[]),
        ...(cur!==`cadastro.html`?[`<a class="btn sm" href="cadastro.html">Criar conta</a>`]:[])
      ];
    n.innerHTML=`<nav><div class="wrap"><a class="logo" href="index.html" aria-label="Mangáverso"><i></i>Mangáverso</a><div class="act">${acts.join(``)}<button class="tbtn" id="theme" aria-label="Alternar tema" title="Alternar tema">◐</button></div></div></nav>`;
  }
  const f=$(`#foot`);
  if(f)f.innerHTML=`<footer class="blue"><div class="wrap"><div class="big dsp">Mangáverso</div><div><p>Distribuição de mangás por assinatura e venda física.</p></div><div><p><a href="index.html">Início</a><a href="sobre.html">Sobre nós</a><a href="faq.html">FAQ</a>${u?`<a href="biblioteca.html">Biblioteca</a>`:`<a href="login.html">Entrar</a>`}</p><p>© 2026 Mangáverso. Todos os direitos reservados.</p></div></div></footer>`;
  const o=$(`#out`);if(o)o.onclick=()=>MV.logout();
  const t=$(`#theme`);
  if(t){
    const sync=()=>{const d=isDarkTheme();t.setAttribute(`aria-label`,d?`Mudar para modo claro`:`Mudar para modo escuro`);t.title=d?`Mudar para modo claro`:`Mudar para modo escuro`};
    sync();
    t.onclick=()=>{const next=isDarkTheme()?`light`:`dark`;document.documentElement.dataset.theme=next;MV.set(MV.K.t,next);sync()};
  }
}
layout();
/* revelação ao rolar (desligada com prefers-reduced-motion) */
if(!matchMedia(`(prefers-reduced-motion:reduce)`).matches&&`IntersectionObserver` in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add(`in`);io.unobserve(t);setTimeout(()=>t.classList.remove(`rv`,`in`),1500)}}),{threshold:.12});
  document.querySelectorAll(`main .card,main .sh,main .prose,main details,.band .wrap>*`).forEach((e,i)=>{e.classList.add(`rv`);e.style.setProperty(`--d`,(i%3)*90+`ms`);io.observe(e)});
}
