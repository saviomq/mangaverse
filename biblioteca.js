/* Biblioteca do Mangáverso (requer app.js). Capas reais: assets/covers/ID.jpg
   Páginas reais: assets/manga/ID/1.jpg, 2.jpg... (ajuste "pages" abaixo conforme o número de páginas). */
const U=MV.me();
/* estado por usuário */
const FK=`mv_fav_`+U.email,PK=id=>`mv_prog_${U.email}_${id}`;
let cat=-1,cur=null;const fav=new Set(MV.get(FK,[])),prog={};
B.forEach(b=>{const v=MV.get(PK(b.id),null);if(v!==null)prog[b.id]=+v});
$(`#hi`).textContent=`Olá, ${U.name.split(` `)[0]}! Escolha uma categoria ou continue de onde parou.`;
$(`#plan`).innerHTML=U.plan?`Plano ${U.plan} ativo`:`Você ainda não escolheu um plano. <a href="planos.html" style="text-decoration:underline">Ver planos</a>`;
$(`#chips`).innerHTML=[`Todas`,...CATS.map(c=>c.id)].map((c,i)=>`<button class="chip" data-c="${i-1}" aria-pressed="${i==0}">${c}</button>`).join(``);
$(`#chips`).onclick=e=>{const v=e.target.dataset.c;if(v===undefined)return;cat=+v;document.querySelectorAll(`#chips .chip`).forEach(c=>c.setAttribute(`aria-pressed`,c.dataset.c==v));render()};
$(`#q`).oninput=render;
$(`#onlyFav`).onclick=e=>{const t=e.currentTarget;t.setAttribute(`aria-pressed`,t.getAttribute(`aria-pressed`)!=`true`);render()};
const card=b=>{const i=B.indexOf(b),pr=prog[b.id]!==undefined?`<div class="bar"><i style="width:${Math.round((prog[b.id]+1)/b.pages*100)}%"></i></div>`:``;
  return `<div class="cv"><button class="fav" data-f="${i}" aria-label="Favoritar ${b.n}">${fav.has(b.n)?`♥`:`♡`}</button><button class="o" data-i="${i}">${cover(b)}<div class="meta">${b.n}<span>${b.au}</span>${pr}</div></button></div>`};
function render(){
  const q=$(`#q`).value.toLowerCase().trim(),of=$(`#onlyFav`).getAttribute(`aria-pressed`)==`true`;
  const ok=b=>(cat<0||b.cat==cat)&&(!of||fav.has(b.n))&&(b.n+b.au).toLowerCase().includes(q);
  let h=``;const cont=B.filter(b=>prog[b.id]!==undefined&&ok(b));
  if(cont.length)h+=`<div class="cat"><h3>Continuar lendo</h3><div class="row">${cont.map(card).join(``)}</div></div>`;
  CATS.forEach((c,ci)=>{const r=B.filter(b=>b.cat==ci&&ok(b)).sort((a,b)=>a.s-b.s);
    if(r.length)h+=`<div class="cat"><h3><span class="lab" style="font-size:22px">${c.id}</span><small>${c.d}</small></h3><div class="row">${r.map(card).join(``)}</div></div>`});
  $(`#cats`).innerHTML=h||`<div class="empty">Nenhuma obra encontrada. Limpe a busca ou escolha outra categoria.</div>`;
}
document.addEventListener(`click`,e=>{
  const f=e.target.closest(`[data-f]`);if(f){toggleFav(B[+f.dataset.f].n);return}
  const c=e.target.closest(`.cv [data-i]`);if(c){cur=+c.dataset.i;openB()}});
function toggleFav(n){fav.has(n)?(fav.delete(n),MV.toast(`Removido dos favoritos`)):(fav.add(n),MV.toast(`Adicionado aos favoritos`));MV.set(FK,[...fav]);render();if($(`#dlg`).open)openB()}
function openB(){const b=B[cur];
  $(`#dbody`).innerHTML=`<div>${cover(b)}</div><div><span class="tag">${CATS[b.cat].id} · domínio público</span><h3 style="margin-top:14px">${b.n}</h3><div class="by">${b.au}</div><p style="margin:0;color:var(--mute);font-weight:500">${b.d}</p><dl><dt>Período</dt><dd>${b.y}</dd><dt>Época</dt><dd>${b.era}</dd><dt>Formato</dt><dd>${b.fmt}</dd></dl><div class="da"><button class="btn b" id="rd1">${prog[b.id]!==undefined?`Continuar leitura`:`Ler agora`}</button><button class="btn" id="fv">${fav.has(b.n)?`Remover favorito`:`Favoritar`}</button><button class="btn w" id="al">Adicionar a uma lista</button><a class="btn w" href="${b.l}" target="_blank" rel="noopener">Acervo original</a></div></div>`;
  $(`#fv`).onclick=()=>toggleFav(b.n);$(`#al`).onclick=()=>pickList(b);$(`#rd1`).onclick=()=>{$(`#dlg`).close();openR(b)};if(!$(`#dlg`).open)$(`#dlg`).showModal()}
$(`#close`).onclick=()=>$(`#dlg`).close();$(`#dlg`).onclick=e=>{if(e.target==$(`#dlg`))$(`#dlg`).close()};
/* páginas de demonstração (usadas quando não há imagens reais) */
const L=[[[14,14,372,200],[14,226,180,180],[206,226,180,180],[14,418,372,168]],[[14,14,180,270],[206,14,180,130],[206,156,180,128],[14,296,372,290]],[[14,14,372,130],[14,156,120,200],[146,156,240,200],[14,368,372,218]]];
const SX=[`ドン!`,`ゴゴゴ`,`シュッ`,`ババッ`],TX=[`Olha isso…`,`Será?!`,`Continua…`,`!?`];
const wrapT=(t,m)=>{const o=[];let l=``;t.split(` `).forEach(w=>{if((l+` `+w).trim().length>m){o.push(l.trim());l=w}else l+=` `+w});o.push(l.trim());return o};
function demo(b,n,N){
  let o=`<svg viewBox="0 0 400 600" class="dp" aria-hidden="true"><rect width="400" height="600" fill="#fffdf6"/>`;
  if(n==0){const c=P[b.p];
    o+=`<rect x="14" y="14" width="372" height="572" fill="${c[0]}" stroke="${NV}" stroke-width="5"/><svg class="art" x="14" y="14" width="372" height="400" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" style="--b:${c[0]};--f:${c[1]}">${ART[b.art]}</svg><rect x="14" y="414" width="372" height="172" fill="#fff" stroke="${NV}" stroke-width="5"/>`;
    wrapT(b.n.toUpperCase(),19).forEach((t,i)=>o+=`<text x="30" y="${458+i*30}" font-size="26" fill="${NV}">${t}</text>`);
    o+=`<text x="30" y="550" font-family="Zen Kaku Gothic New" font-weight="800" font-size="14" fill="${BL}">${b.au} · ${b.y}</text><text x="372" y="574" text-anchor="end" font-size="58" fill="${LI}" stroke="${NV}" stroke-width="2">${b.k}</text>`;
  }else L[n%3].forEach((r,i)=>{
    const [x,y,w,h]=r,c=P[(b.p+i+n)%4],k=(i+n)%3==0?b.art:KEYS[(i*3+n)%KEYS.length];
    o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c[0]}"/><svg class="art" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" style="--b:${c[0]};--f:${c[1]}">${ART[k]}</svg>`;
    if(i==1+n%2){let ln=``;for(let a=0;a<28;a++){const t=a/28*6.283,cx=w/2,cy=h/2;ln+=`<line x1="${cx+Math.cos(t)*w*.3}" y1="${cy+Math.sin(t)*h*.3}" x2="${cx+Math.cos(t)*w}" y2="${cy+Math.sin(t)*w}"/>`}
      o+=`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g stroke="${NV}" stroke-width="1.6" opacity=".6">${ln}</g><text x="${w/2}" y="${h/2+14}" text-anchor="middle" font-size="40" fill="${LI}" stroke="${NV}" stroke-width="3" paint-order="stroke">${SX[(n+i)%4]}</text></svg>`}
    o+=`<rect x="${x}" y="${y+h*.58}" width="${w}" height="${h*.42}" fill="url(#ht)"/>`;
    if(i%2==0)o+=`<ellipse cx="${x+w-62}" cy="${y+34}" rx="52" ry="24" fill="#fff" stroke="${NV}" stroke-width="3"/><text x="${x+w-62}" y="${y+39}" text-anchor="middle" font-family="Zen Kaku Gothic New" font-weight="800" font-size="13" fill="${NV}">${TX[(n+i)%4]}</text>`;
    o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${NV}" stroke-width="4"/>`});
  return o+`<text x="386" y="598" text-anchor="end" font-family="Zen Kaku Gothic New" font-size="9" fill="#4a5180">Demonstração · ${n+1}/${N}</text></svg>`}
const pageEl=(b,n)=>`<div class="pg" data-n="${n}">${demo(b,n,b.pages)}<img src="assets/manga/${b.id}/${n+1}.jpg" alt="${b.n}, página ${n+1}" onerror="this.remove()"></div>`;
/* leitor */
const R={b:null,i:0,mode:`page`,rtl:true,z:1};
function openR(b){R.b=b;R.i=Math.min(prog[b.id]??0,b.pages-1);$(`#rtitle`).textContent=b.n;buyLink(b);streakInit();$(`#sl`).max=b.pages;rdr();if(!$(`#rd`).open)$(`#rd`).showModal();fit()}
function rdr(){
  const b=R.b,N=b.pages;
  $(`#inner`).style.setProperty(`--z`,R.z);$(`#inner`).style.setProperty(`--n`,R.mode==`spread`?2:1);$(`#stage`).classList.toggle(`vs`,R.mode==`scroll`);
  let h=``;
  if(R.mode==`scroll`){for(let n=0;n<N;n++)h+=pageEl(b,n)}
  else if(R.mode==`spread`){const a=R.i-(R.i%2),pg=[a,a+1].filter(n=>n<N);if(R.rtl)pg.reverse();h=pg.map(n=>pageEl(b,n)).join(``)}
  else h=pageEl(b,R.i);
  $(`#inner`).innerHTML=h;$(`#sl`).value=R.i+1;$(`#sl`).style.direction=R.rtl?`rtl`:`ltr`;$(`#ct`).textContent=(R.i+1)+` / `+N;
  document.querySelectorAll(`.rbt[data-m]`).forEach(x=>x.setAttribute(`aria-pressed`,x.dataset.m==R.mode));
  $(`#rtl`).setAttribute(`aria-pressed`,R.rtl);$(`#rtl`).textContent=R.rtl?`日本式 ← direita p/ esquerda`:`Ocidental → esquerda p/ direita`;
  prog[b.id]=R.i;MV.set(PK(b.id),R.i);
  if(R.mode==`page`)seen(b,[R.i]);else if(R.mode==`spread`){const a=R.i-(R.i%2);seen(b,[a,a+1])}else watch()
  requestAnimationFrame(fit);
}
function go(d){const s=R.mode==`spread`?2:1,N=R.b.pages;R.i=Math.max(0,Math.min(N-1,(R.mode==`spread`?R.i-(R.i%2):R.i)+d*s));if(R.mode==`scroll`)$(`#stage`).scrollTo({top:0});rdr()}
$(`#rn`).onclick=()=>go(1);$(`#rp`).onclick=()=>go(-1);
$(`#sl`).oninput=e=>{R.i=+e.target.value-1;rdr()};
document.querySelectorAll(`.rbt[data-m]`).forEach(x=>x.onclick=()=>{R.mode=x.dataset.m;rdr()});
$(`#rtl`).onclick=()=>{R.rtl=!R.rtl;rdr()};
$(`#zi`).onclick=()=>{R.z=Math.min(2.5,R.z+.25);rdr()};$(`#zo`).onclick=()=>{R.z=Math.max(.5,R.z-.25);rdr()};
$(`#fs`).onclick=()=>{document.fullscreenElement?document.exitFullscreen():$(`#rd`).requestFullscreen&&$(`#rd`).requestFullscreen()};
$(`#rx`).onclick=()=>$(`#rd`).close();$(`#rd`).addEventListener(`close`,render);
$(`#inner`).onclick=e=>{if(R.mode==`scroll`)return;const r=e.currentTarget.getBoundingClientRect(),left=e.clientX<r.left+r.width/2;go(left==R.rtl?1:-1)};
document.addEventListener(`keydown`,e=>{if(!$(`#rd`).open||!$(`#afk`).hidden)return;
  if(e.key==`ArrowLeft`)go(R.rtl?1:-1);else if(e.key==`ArrowRight`)go(R.rtl?-1:1);
  else if(e.key==`+`||e.key==`=`)$(`#zi`).click();else if(e.key==`-`)$(`#zo`).click()});

/* Manga Coins: o servidor valida tudo. Aqui só informamos quais páginas estão na tela e se o leitor está ativo. */
const AFK_MS=120000;
let vis=[],visKey=``,lastTurn=Date.now(),waiting=null,io=null,beat=0;
function report(){
  if(!R.b||!$(`#rd`).open||document.hidden||!$(`#afk`).hidden)return;
  MV.coins.ler(R.b.id,vis).catch(()=>{})}
function seen(b,list){            /* chamada pelo leitor com as páginas visíveis */
  const k=b.id+`:`+list.join(`,`);if(k==visKey)return;
  visKey=k;vis=list.filter(i=>i>=0&&i<b.pages);lastTurn=Date.now();
  report();clearTimeout(waiting);waiting=setTimeout(report,3500)}   /* 2ª chamada confirma os 3 s na tela */
function watch(){                 /* modo vertical: páginas que aparecem na tela */
  if(io)io.disconnect();const s=new Set();
  io=new IntersectionObserver(es=>{es.forEach(e=>{const n=+e.target.dataset.n;e.isIntersecting?s.add(n):s.delete(n)});seen(R.b,[...s].sort((x,y)=>x-y))},{root:$(`#stage`),threshold:.5});
  document.querySelectorAll(`#inner .pg`).forEach(p=>io.observe(p))}
$(`#rd`).addEventListener(`close`,()=>{visKey=``;clearTimeout(waiting);$(`#afk`).hidden=true});
$(`#afkgo`).onclick=()=>{$(`#afk`).hidden=true;lastTurn=Date.now();report()};
setInterval(()=>{                 /* a cada 5 s: pede confirmação se ficou parado; a cada 30 s: sinal de vida */
  if(!$(`#rd`).open||document.hidden)return;
  if(Date.now()-lastTurn>=AFK_MS){$(`#afk`).hidden=false;return}
  if(++beat%6==0)report()},5000);
/* mede as barras do leitor para as páginas ocuparem toda a altura que sobra */
function fit(){const r=$(`#rd`);if(!r.open)return;
  r.style.setProperty(`--ch`,(r.querySelector(`.rt`).offsetHeight+r.querySelector(`.rb`).offsetHeight+20)+`px`)}
addEventListener(`resize`,fit);document.addEventListener(`fullscreenchange`,()=>setTimeout(fit,50));
render();

/* compra da edição física: link discreto na barra do leitor, abre em outra aba para não interromper a leitura */
function buyLink(b){$(`#buy`).href=`loja.html?q=`+encodeURIComponent(b.n)+`&obra=`+encodeURIComponent(b.id)}
/* selo de ofensiva diária no leitor (o servidor calcula; aqui só exibimos) */
function streakShow(n,m){const e=$(`#strk`);if(!(n>0)){e.hidden=true;return}
  e.textContent=`Ofensiva ${n} ${n==1?`dia`:`dias`}`+(m>1?` · ×${(+m).toLocaleString(`pt-BR`)}`:``);e.hidden=false}
function streakInit(){MV.rpc(`ofensiva_estado`).then(s=>streakShow(s.atual,s.mult)).catch(()=>{$(`#strk`).hidden=true})}
document.addEventListener(`mv:coins`,e=>{const d=e.detail||{};if(d.ofensiva!==undefined)streakShow(d.ofensiva,d.mult)});
/* listas personalizadas: escolher em quais listas a obra aparece */
async function pickList(b){
  let d=$(`#dlL`);
  if(!d){d=document.createElement(`dialog`);d.id=`dlL`;d.innerHTML=`<button class="tbtn x" id="dlLx" aria-label="Fechar">✕</button><div class="dlgbox" id="dlLb"></div>`;document.body.appendChild(d);
    $(`#dlLx`).onclick=()=>d.close();d.onclick=e=>{if(e.target==d)d.close()}}
  const box=$(`#dlLb`);box.innerHTML=`<h3>Adicionar a uma lista</h3><p class="mute" style="margin:6px 0 0">${esc(b.n)}</p><div id="dlLl"><p class="mute">Carregando…</p></div>
<form class="lnew" id="dlLf"><input id="dlLn" maxlength="80" placeholder="Nova lista" aria-label="Nome da nova lista"><button class="btn b sm" type="submit">Criar e adicionar</button></form><p class="err" id="dlLe" role="alert"></p>`;
  if(!d.open)d.showModal();
  const draw=async()=>{let L=[];
    try{L=await MV.api(`/rest/v1/listas?select=id,titulo,lista_itens(obra)&order=atualizado_em.desc`,{auth:true})}
    catch(e){$(`#dlLl`).innerHTML=`<p class="err">Não foi possível carregar suas listas agora.</p>`;return}
    $(`#dlLl`).innerHTML=L.length?L.map(l=>`<label class="lrow"><input type="checkbox" data-l="${esc(l.id)}"${l.lista_itens.some(i=>i.obra==b.id)?` checked`:``}>${esc(l.titulo)}<small>${l.lista_itens.length}</small></label>`).join(``):`<p class="mute" style="margin-top:14px">Você ainda não tem listas. Crie a primeira abaixo.</p>`};
  $(`#dlLl`).onchange=async e=>{const c=e.target,id=c.dataset.l;if(!id)return;c.disabled=true;
    try{if(c.checked)await MV.api(`/rest/v1/lista_itens`,{method:`POST`,auth:true,prefer:`resolution=ignore-duplicates,return=minimal`,body:{lista_id:id,obra:b.id}});
      else await MV.api(`/rest/v1/lista_itens?lista_id=eq.`+encodeURIComponent(id)+`&obra=eq.`+encodeURIComponent(b.id),{method:`DELETE`,auth:true,prefer:`return=minimal`});
      MV.toast(c.checked?`Adicionada à lista`:`Removida da lista`)}
    catch(x){c.checked=!c.checked;MV.toast(x.message)}c.disabled=false};
  $(`#dlLf`).onsubmit=async e=>{e.preventDefault();const t=$(`#dlLn`).value.trim();if(!t)return;$(`#dlLe`).textContent=``;
    try{const r=await MV.api(`/rest/v1/listas`,{method:`POST`,auth:true,prefer:`return=representation`,body:{titulo:t}});
      await MV.api(`/rest/v1/lista_itens`,{method:`POST`,auth:true,prefer:`return=minimal`,body:{lista_id:r[0].id,obra:b.id}});
      $(`#dlLn`).value=``;MV.toast(`Lista criada`);draw()}
    catch(x){$(`#dlLe`).textContent=x.message}};
  draw()}
