/* Mangáverso – utilitários compartilhados.
   Integração com Supabase: senhas ficam no Supabase Auth (nunca na tabela) e o perfil
   (nome, e-mail, plano) fica na tabela `perfis`. A chave publishable pode ficar no front-end,
   mas a tabela precisa de RLS ligada com políticas (veja as instruções no final da resposta). */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??``).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const NV=`#0a0f45`,BL=`#1a2bf5`,LI=`#c6ff2e`;
const SB={
  url:`https://cekbqrkysrsvxkpfvuoe.supabase.co`,
  key:`sb_publishable_-ZWLJ7maCN_V52r7oZw6Bw_u9dV7UPc`
};
const MV={
  K:{s:`mv_session`,a:`mv_token`,r:`mv_refresh`,p:`mv_profile`},
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
  async register(name,email,pw,ref){
    email=email.trim().toLowerCase();name=name.trim();
    const meta={nome:name};if(ref&&/^[A-Za-z0-9]{6,12}$/.test(ref))meta.ref=ref.toUpperCase();
    let d;
    try{d=await this.api(`/auth/v1/signup`,{method:`POST`,body:{email,password:pw,data:meta}})}
    catch(e){
      if(e.code==`user_already_exists`||/already registered/i.test(e.message))throw new Error(`Este e-mail já está cadastrado.`);
      if(e.code==`weak_password`||/password/i.test(e.message))throw new Error(`Senha muito fraca. Use pelo menos 6 caracteres.`);
      throw e}
    if(!d.access_token)return{confirm:true};
    this.saveTokens(d);this.set(this.K.s,email);
    await this.loadProfile(email,name);await this.claimRef(meta.ref);return{confirm:false}},
  async login(email,pw){
    email=email.trim().toLowerCase();let d;
    try{d=await this.api(`/auth/v1/token?grant_type=password`,{method:`POST`,body:{email,password:pw}})}
    catch(e){
      if(e.code==`email_not_confirmed`)throw new Error(`Confirme seu e-mail antes de entrar.`);
      if(e.status==400||e.status==401)throw new Error(`E-mail ou senha incorretos.`);
      throw e}
    this.saveTokens(d);this.set(this.K.s,email);
    await this.loadProfile(email,d.user&&d.user.user_metadata&&d.user.user_metadata.nome);
    await this.claimRef(d.user&&d.user.user_metadata&&d.user.user_metadata.ref)},
  /* convite: registra quem indicou (o servidor valida e só paga a recompensa quando o amigo escolhe um plano) */
  async claimRef(ref){ref=ref||this.get(`mv_ref`,null);if(!ref)return;
    try{await this.rpc(`convite_aceitar`,{p_codigo:ref});this.del(`mv_ref`)}catch(e){}},
  rpc(fn,body){return this.api(`/rest/v1/rpc/`+fn,{method:`POST`,auth:true,body:body||{}})},
  logout(){[this.K.s,this.K.a,this.K.r,this.K.p].forEach(k=>this.del(k));location.href=`index.html`},
  /* atualiza na hora no cache local e grava no Supabase; devolve uma Promise */
  setPlan(p){
    const u=this.me();if(!u)return Promise.resolve(false);
    u.plan=p;this.set(this.K.p,u);
    return this.api(`/rest/v1/perfis?email=eq.`+encodeURIComponent(u.email),{method:`PATCH`,auth:true,prefer:`return=minimal`,body:{plano:p}})
      .then(()=>true).catch(()=>{this.toast(`Não foi possível salvar o plano no servidor.`);return false})},
  guard(){
    if(!this.me()){location.replace(`login.html?next=`+encodeURIComponent(this.page()+location.search));return false}
    document.documentElement.classList.remove(`gate`);return true},
  page(){return location.pathname.split(`/`).pop()||`index.html`},
  next(def){const n=new URLSearchParams(location.search).get(`next`);return n&&/^[a-z]+\.html(\?[A-Za-z0-9=&_.%-]*)?$/.test(n)?n:def},
  toast(m){let t=$(`#toast`);if(!t){t=document.createElement(`div`);t.id=`toast`;t.className=`toast`;t.setAttribute(`role`,`status`);document.body.appendChild(t)}
    t.textContent=m;t.classList.add(`on`);clearTimeout(this._t);this._t=setTimeout(()=>t.classList.remove(`on`),2000)}
};
/* Manga Coin: o saldo e todas as regras ficam no servidor (Supabase). Este objeto só chama as
   funções do banco; o número guardado aqui no navegador serve apenas para exibir no menu. */
MV.coins={
  CK:`mv_coin_cache_`,
  bal(){const u=MV.me();return u?+MV.get(this.CK+u.email,0)||0:0},
  show(n){const u=MV.me();if(u)MV.set(this.CK+u.email,n);document.querySelectorAll(`#nb`).forEach(e=>e.textContent=n)},
  rpc(fn,body){return MV.rpc(fn,body)},
  async refresh(){const d=await this.rpc(`moedas_estado`);this.show(d.saldo);return d},
  async ler(obra,paginas){const d=await this.rpc(`moedas_ler`,{p_obra:obra,p_paginas:paginas});this.show(d.saldo);
    if(d.ganho>0)MV.toast(`+`+d.ganho+` Manga Coins · `+d.motivo+(d.mult>1?` · ofensiva ×`+(+d.mult).toLocaleString(`pt-BR`):``));
    document.dispatchEvent(new CustomEvent(`mv:coins`,{detail:d}));return d}
};
let _cn=0;
/* moeda no estilo do site: aro lime, face azul com meio-tom e raios, livro aberto em quadros.
   full=false gera a versão pequena (sem textos) para menu e preços */
function coinSVG(sz=120,full=true){
  const id=`cn`+(++_cn);let rays=``;
  for(let i=0;i<16;i+=2){const a=i*Math.PI/8,b=(i+1)*Math.PI/8,f=n=>n.toFixed(1);
    rays+=`<path d="M100 100L${f(100+Math.cos(a)*90)} ${f(100+Math.sin(a)*90)}L${f(100+Math.cos(b)*90)} ${f(100+Math.sin(b)*90)}Z"/>`}
  const ff=`'Dela Gothic One','Zen Kaku Gothic New',Impact,sans-serif`;
  const txt=full?`<text font-family="${ff}" fill="${NV}" text-anchor="middle"><textPath href="#${id}t" startOffset="50%" font-size="15" letter-spacing="1.5">MANGA COIN</textPath></text><text font-family="${ff}" fill="${NV}" text-anchor="middle"><textPath href="#${id}b" startOffset="50%" font-size="10.5" letter-spacing="2.5">MANGÁVERSO</textPath></text><path d="M20 94l6 6-6 6-6-6zM180 94l6 6-6 6-6-6z" fill="${NV}"/>`:``;
  return `<svg class="coin" width="${sz}" height="${sz}" viewBox="0 0 200 200" role="img" aria-label="Manga Coin" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}c"><circle cx="100" cy="100" r="63"/></clipPath><pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.2" fill="${NV}" opacity=".32"/></pattern><path id="${id}t" d="M26 100A74 74 0 0 1 174 100"/><path id="${id}b" d="M16 100A84 84 0 0 0 184 100"/></defs>`
  +`<circle cx="100" cy="100" r="98" fill="${NV}"/><circle cx="100" cy="100" r="93" fill="${LI}"/><circle cx="100" cy="100" r="90" fill="none" stroke="${NV}" stroke-width="1.5" opacity=".35"/><circle cx="100" cy="100" r="68" fill="${NV}"/><circle cx="100" cy="100" r="63" fill="${BL}"/>`
  +`<g clip-path="url(#${id}c)"><g fill="#fff" opacity=".13">${rays}</g><circle cx="100" cy="100" r="63" fill="url(#${id}h)"/></g>`
  +`<path d="M50 90A52 52 0 0 1 82 52" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".28"/>`
  +`<g transform="translate(0 -4)" stroke="${NV}" stroke-linejoin="round"><path d="M48 80L100 92L152 80V122Q126 118 100 130Q74 118 48 122Z" fill="${NV}" stroke-width="2"/><path d="M53 80Q78 78 100 90V126Q78 114 53 117Z" fill="#fff" stroke-width="2.5"/><path d="M147 80Q122 78 100 90V126Q122 114 147 117Z" fill="#fff" stroke-width="2.5"/>`
  +`<g fill="none" stroke-width="2"><rect x="58" y="86" width="14" height="11"/><rect x="75" y="89" width="17" height="10" fill="${LI}"/><rect x="58" y="100" width="34" height="13"/><rect x="128" y="86" width="14" height="11"/><rect x="108" y="89" width="17" height="10"/><rect x="108" y="100" width="34" height="13" fill="${LI}"/></g><circle cx="65" cy="91.5" r="3" fill="${NV}" stroke="none"/><path d="M62 109q8-6 16 0t14-2M112 94l5 3 4-4 4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/></g>`
  +`<path d="M140 56l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" fill="${LI}"/><path d="M62 62l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#fff"/>${txt}</svg>`
}
function layout(){
  const u=MV.me(),cur=MV.page();
  const n=$(`#nav`);
  if(n){
    const acts=u
      ?[
        ...(cur!==`biblioteca.html`?[`<a class="btn sm w" href="biblioteca.html">Biblioteca</a>`]:[]),
        ...(cur!==`loja.html`?[`<a class="btn sm w" href="loja.html">Loja</a>`]:[]),
        ...(cur!==`listas.html`?[`<a class="btn sm w" href="listas.html">Listas</a>`]:[]),
        ...(cur!==`moedas.html`?[`<a class="btn sm w coinlink" href="moedas.html" aria-label="Moedas">${coinSVG(20,false)}Moedas <b id="nb">${MV.coins.bal()}</b></a>`]:[]),
        ...(cur!==`planos.html`?[`<a class="btn sm w" href="planos.html">${u.plan?`Plano `+u.plan:`Planos`}</a>`]:[]),
        `<button class="btn sm" id="out">Sair</button>`
      ]
      :[];
    n.innerHTML=`<nav><div class="wrap"><a class="logo" href="index.html" aria-label="Mangáverso"><i></i>Mangáverso</a><div class="act">${acts.join(``)}</div></div></nav>`;
  }
  const f=$(`#foot`);
  if(f)f.innerHTML=`<footer class="blue"><div class="wrap"><div class="big dsp">Mangáverso</div><div><p>Distribuição de mangás por assinatura e venda física.</p></div><div><p><a href="index.html">Início</a><a href="sobre.html">Sobre nós</a><a href="faq.html">FAQ</a>${u?`<a href="biblioteca.html">Biblioteca</a><a href="loja.html">Loja</a><a href="listas.html">Listas</a><a href="moedas.html">Moedas</a>`:`<a href="login.html">Entrar</a>`}</p><p>© 2026 Mangáverso. Todos os direitos reservados.</p></div></div></footer>`;
  const o=$(`#out`);if(o)o.onclick=()=>MV.logout();
  if(u&&n)MV.coins.refresh().catch(()=>{});
}
layout();
/* revelação ao rolar (desligada com prefers-reduced-motion) */
if(!matchMedia(`(prefers-reduced-motion:reduce)`).matches&&`IntersectionObserver` in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add(`in`);io.unobserve(t);setTimeout(()=>t.classList.remove(`rv`,`in`),1500)}}),{threshold:.12});
  document.querySelectorAll(`main .card,main .sh,main .prose,main details,.band .wrap>*`).forEach((e,i)=>{e.classList.add(`rv`);e.style.setProperty(`--d`,(i%3)*90+`ms`);io.observe(e)});
}
/* limpeza única de dados antigos guardados no navegador por versões anteriores (tema claro/escuro e moedas locais) */
try{Object.keys(localStorage).filter(k=>/^(mv_theme$|mv_coins_|mv_redeem_|mv_done_|mv_seen_|mv_time_)/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}
