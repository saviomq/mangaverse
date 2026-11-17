/* Mangáverso – utilitários compartilhados.
   Integração com Supabase: senhas ficam no Supabase Auth (nunca na tabela) e o perfil
   (nome, e-mail, plano) fica na tabela `perfis`. A chave publishable pode ficar no front-end,
   mas a tabela precisa de RLS ligada com políticas (veja as instruções no final da resposta). */
const $=(s,r=document)=>r.querySelector(s);
const NV=`#0a0f45`,BL=`#1a2bf5`,LI=`#c6ff2e`;
const SB={
  url:`https://cekbqrkysrsvxkpfvuoe.supabase.co`,
  key:`sb_publishable_-ZWLJ7maCN_V52r7oZw6Bw_u9dV7UPc`
};
const MV={
  K:{s:`mv_session`,a:`mv_token`,r:`mv_refresh`,p:`mv_profile`,t:`mv_theme`},
  get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null||v===undefined?d:v}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(k)}catch(e){}},
  /* chamada HTTP ao Supabase; com auth:true usa o token do usuário e renova se expirar */
  async api(path,o={}){
    const go=async()=>{
      const h={apikey:SB.key,'Content-Type':`application/json`};
      if(o.auth){const t=this.get(this.K.a,null);if(t)h.Authorization=`Bearer `+t}
      if(o.prefer)h.Prefer=o.prefer;
      return fetch(SB.url+path,{method:o.method||`GET`,headers:h,body:o.body?JSON.stringify(o.body):undefined})};
    let r;
    try{r=await go()}catch(e){throw new Error(`Sem conexão com o servidor. Tente novamente.`)}
    if(r.status==401&&o.auth&&await this.refresh())r=await go();
    let d=null;try{d=await r.json()}catch(e){}
    if(!r.ok){const e=new Error((d&&(d.msg||d.message||d.error_description||d.error))||`Erro `+r.status);e.status=r.status;e.code=d&&(d.error_code||d.code);throw e}
    return d},
  async refresh(){
    const rt=this.get(this.K.r,null);if(!rt)return false;
    try{const r=await fetch(SB.url+`/auth/v1/token?grant_type=refresh_token`,{method:`POST`,headers:{apikey:SB.key,'Content-Type':`application/json`},body:JSON.stringify({refresh_token:rt})});
      if(!r.ok)return false;const d=await r.json();this.saveTokens(d);return true}catch(e){return false}},
  saveTokens(d){this.set(this.K.a,d.access_token);if(d.refresh_token)this.set(this.K.r,d.refresh_token)},
  /* converte uma linha da tabela perfis para o formato usado nas páginas */
  fromRow(r){return{id:r.id,name:r.nome,email:r.email,plan:r.plano||null,at:r.created_at}},
  me(){const p=this.get(this.K.p,null),e=this.get(this.K.s,null);return p&&e&&p.email==e&&this.get(this.K.a,null)?p:null},
  async loadProfile(email,nome){
    const q=`/rest/v1/perfis?email=eq.`+encodeURIComponent(email)+`&select=*&limit=1`;
    let rows=await this.api(q,{auth:true});
    if(!rows.length)rows=await this.api(`/rest/v1/perfis`,{method:`POST`,auth:true,prefer:`return=representation`,body:{nome:nome||email.split(`@`)[0],email,plano:null}});
    const p=this.fromRow(rows[0]);this.set(this.K.p,p);return p},
  async register(name,email,pw){
    email=email.trim().toLowerCase();name=name.trim();
    let d;
    try{d=await this.api(`/auth/v1/signup`,{method:`POST`,body:{email,password:pw,data:{nome:name}}})}
    catch(e){
      if(e.code==`user_already_exists`||/already registered/i.test(e.message))throw new Error(`Este e-mail já está cadastrado.`);
      if(e.code==`weak_password`||/password/i.test(e.message))throw new Error(`Senha muito fraca. Use pelo menos 6 caracteres.`);
      throw e}
    if(!d.access_token)throw new Error(`Cadastro criado! Confirme seu e-mail pela mensagem que enviamos e depois entre.`);
    this.saveTokens(d);this.set(this.K.s,email);
    const rows=await this.api(`/rest/v1/perfis`,{method:`POST`,auth:true,prefer:`return=representation`,body:{nome:name,email,plano:null}});
    this.set(this.K.p,this.fromRow(rows[0]))},
  async login(email,pw){
    email=email.trim().toLowerCase();let d;
    try{d=await this.api(`/auth/v1/token?grant_type=password`,{method:`POST`,body:{email,password:pw}})}
    catch(e){
      if(e.code==`email_not_confirmed`)throw new Error(`Confirme seu e-mail antes de entrar.`);
      if(e.status==400||e.status==401)throw new Error(`E-mail ou senha incorretos.`);
      throw e}
    this.saveTokens(d);this.set(this.K.s,email);
    await this.loadProfile(email,d.user&&d.user.user_metadata&&d.user.user_metadata.nome)},
  logout(){[this.K.s,this.K.a,this.K.r,this.K.p].forEach(k=>this.del(k));location.href=`index.html`},
  /* atualiza na hora no cache local e grava no Supabase; devolve uma Promise */
  setPlan(p){
    const u=this.me();if(!u)return Promise.resolve(false);
    u.plan=p;this.set(this.K.p,u);
    return this.api(`/rest/v1/perfis?email=eq.`+encodeURIComponent(u.email),{method:`PATCH`,auth:true,prefer:`return=minimal`,body:{plano:p}})
      .then(()=>true).catch(()=>{this.toast(`Não foi possível salvar o plano no servidor.`);return false})},
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
      :[];
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
