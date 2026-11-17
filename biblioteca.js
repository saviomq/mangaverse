/* Biblioteca do Mangáverso (requer app.js). Capas reais: assets/covers/ID.jpg
   Páginas reais: assets/manga/ID/1.jpg, 2.jpg... (ajuste "pages" abaixo conforme o número de páginas). */
const WH=`#ffffff`,A=`https://archive.org/search?query=`;
const U=MV.me();
const ART={
wave:`<circle class="f" cx="145" cy="70" r="30"/><path class="s" d="M-5 190C25 120 80 120 100 170S160 200 210 135"/><path class="s" d="M-5 225C35 170 85 175 115 210S175 230 210 185"/><path class="s" d="M-5 150C15 115 45 100 70 125"/>`,
rabbit:`<ellipse class="f" cx="100" cy="175" rx="52" ry="44"/><ellipse class="f" cx="78" cy="85" rx="13" ry="46"/><ellipse class="f" cx="122" cy="85" rx="13" ry="46" transform="rotate(12 122 85)"/><circle class="w" cx="86" cy="165" r="6"/><circle class="w" cx="114" cy="165" r="6"/>`,
toba:`<circle class="f" cx="100" cy="85" r="45"/><circle class="w" cx="84" cy="80" r="6"/><circle class="w" cx="116" cy="80" r="6"/><path class="s" d="M100 130v70M100 150l-40 30M100 150l40 20M100 200l-28 42M100 200l30 42"/>`,
kib:`<rect class="f" x="22" y="40" width="72" height="80"/><rect class="s" x="106" y="40" width="72" height="80" style="stroke-width:5"/><rect class="s" x="22" y="132" width="156" height="60" style="stroke-width:5"/><circle class="w" cx="58" cy="80" r="14"/><path class="s" d="M118 105l22-44 22 44z" style="stroke-width:5"/>`,
fuji:`<circle class="f" cx="50" cy="60" r="24"/><path class="f" d="M-5 225L95 85l100 140z"/><path class="w" d="M70 120l25-35 25 35-12-8-13 12-13-12z"/><path class="s" d="M-5 245c40-25 80-25 110 0s70 25 100-5" style="stroke-width:5"/>`,
dots:`<g class="f"><circle cx="45" cy="60" r="16"/><circle cx="100" cy="60" r="16"/><circle cx="155" cy="60" r="16"/><circle cx="45" cy="115" r="16"/><circle cx="155" cy="115" r="16"/><circle cx="45" cy="170" r="16"/><circle cx="100" cy="170" r="16"/><circle cx="155" cy="170" r="16"/></g><path class="s" d="M70 115c10-14 50-14 60 0" style="stroke-width:6"/>`,
oni:`<circle class="f" cx="100" cy="130" r="64"/><path class="f" d="M52 90l-12-52 40 30zM148 90l12-52-40 30z"/><circle class="w" cx="78" cy="120" r="9"/><circle class="w" cx="122" cy="120" r="9"/><path class="w" d="M70 160h60l-8 22H78z"/>`,
news:`<rect class="f" x="30" y="36" width="140" height="190" rx="6"/><g class="w"><rect x="44" y="52" width="112" height="22"/><rect x="44" y="88" width="50" height="50"/><rect x="104" y="90" width="52" height="6"/><rect x="104" y="106" width="52" height="6"/><rect x="44" y="152" width="112" height="6"/><rect x="44" y="168" width="112" height="6"/></g>`,
hats:`<path class="f" d="M30 120l35-80 35 80zM100 120l35-80 35 80z"/><circle class="f" cx="65" cy="160" r="26"/><circle class="f" cx="135" cy="160" r="26"/><path class="s" d="M65 186v50M135 186v50" style="stroke-width:6"/>`,
city:`<g class="f"><rect x="20" y="130" width="34" height="110"/><rect x="62" y="80" width="38" height="160"/><rect x="108" y="110" width="30" height="130"/><rect x="146" y="60" width="36" height="180"/></g><path class="f" d="M100 20l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z"/>`,
board:`<path class="s" d="M25 50h150v50H25v50h150v50H35" style="stroke-width:30;opacity:.35"/><g class="f"><rect x="30" y="42" width="20" height="16"/><rect x="82" y="42" width="20" height="16"/><rect x="134" y="92" width="20" height="16"/><rect x="60" y="142" width="20" height="16"/><rect x="112" y="192" width="20" height="16"/></g><circle class="f" cx="160" cy="215" r="16"/>`};
const KEYS=Object.keys(ART),P=[[BL,LI],[LI,BL],[WH,BL],[NV,LI]];
const CATS=[
{id:`Fábulas e folclore`,d:`Animais falantes, demônios e criaturas`},
{id:`Mestre Hokusai`,d:`Os cadernos que popularizaram a palavra manga`},
{id:`Humor e sátira`,d:`Caricaturas, tiras e revistas de humor`},
{id:`Cidade e cotidiano`,d:`A vida moderna nas ruas e nos jogos`}];
const B=[
{id:`choju`,cat:0,n:`Chōjū-jinbutsu-giga`,au:`Atribuído a Toba Sōjō`,y:`séc. XII–XIII`,s:1150,era:`Origens`,k:`戯画`,art:`rabbit`,p:0,fmt:`4 rolos pintados`,d:`Os “rolos dos animais” mostram coelhos, rãs e macacos imitando o comportamento humano. Costumam ser apontados como um dos ancestrais do mangá.`,l:A+`Choju-giga`},
{id:`kyosai`,cat:0,n:`Caricaturas de Kyōsai`,au:`Kawanabe Kyōsai`,y:`séc. XIX`,s:1870,era:`Edo`,k:`暁斎`,art:`oni`,p:1,fmt:`Caricaturas e esboços`,d:`Sátiras e cenas fantásticas do artista Kawanabe Kyōsai (1831–1889), mestre do humor visual e dos demônios no fim do período Edo.`,l:A+`Kawanabe+Kyosai`},
{id:`hokusai-1`,cat:1,n:`Hokusai Manga, vol. 1`,au:`Katsushika Hokusai`,y:`1814`,s:1814,era:`Edo`,k:`北斎`,art:`wave`,p:0,fmt:`Caderno de esboços`,d:`O primeiro dos cadernos em que Hokusai reuniu pessoas, animais, paisagens e criaturas. Foi aqui que a palavra manga ganhou fama.`,l:A+`Hokusai+Manga`},
{id:`hokusai-completo`,cat:1,n:`Hokusai Manga, coleção completa`,au:`Katsushika Hokusai`,y:`1814–1878`,s:1815,era:`Edo`,k:`漫画`,art:`fuji`,p:2,fmt:`15 volumes`,d:`A série de 15 cadernos publicada entre 1814 e 1878, com milhares de esboços de cenas do cotidiano ao sobrenatural.`,l:A+`Hokusai+Manga+15`},
{id:`hokusai-selecao`,cat:1,n:`Seleção de Hokusai Manga`,au:`Katsushika Hokusai`,y:`1835`,s:1835,era:`Edo`,k:`図`,art:`dots`,p:3,fmt:`Gravuras selecionadas`,d:`Imagens escolhidas dos cadernos, digitalizadas pela Biblioteca Pública de Nova York.`,l:`https://digitalcollections.nypl.org/items/ac061560-6bf2-0135-67aa-03ce6a2bed62`},
{id:`toba-e`,cat:2,n:`Toba-e`,au:`Vários artistas`,y:`séc. XVIII`,s:1700,era:`Edo`,k:`鳥羽`,art:`toba`,p:1,fmt:`Livros de caricaturas`,d:`Livrinhos ilustrados de traço rápido e humor, batizados em homenagem ao pintor dos rolos Chōjū-giga.`,l:A+`Toba-e`},
{id:`kibyoshi`,cat:2,n:`Kibyōshi`,au:`Vários autores`,y:`1780–1810`,s:1780,era:`Edo`,k:`黄表紙`,art:`kib`,p:3,fmt:`Livros de imagem e texto`,d:`Os “livros de capa amarela” combinavam desenho e texto na mesma página, com sátira social.`,l:A+`Kibyoshi`},
{id:`jiji`,cat:2,n:`Jiji Manga`,au:`Rakuten Kitazawa`,y:`1890s`,s:1899,era:`Meiji–Taishō`,k:`時事`,art:`news`,p:0,fmt:`Tiras de jornal`,d:`Tiras de humor político no jornal Jiji Shinpō. Em 1899, Kitazawa já usava “manga” para suas caricaturas.`,l:A+`Jiji+Manga+Kitazawa`},
{id:`tokyo-puck`,cat:2,n:`Tokyo Puck`,au:`Rakuten Kitazawa`,y:`1905`,s:1905,era:`Meiji–Taishō`,k:`パック`,art:`city`,p:3,fmt:`Revista de humor`,d:`Revista colorida de sátira e caricatura fundada por Kitazawa, que reunia desenhistas do Japão.`,l:A+`Tokyo+Puck`},
{id:`tagosaku`,cat:3,n:`Tagosaku e Mokubē visitam Tóquio`,au:`Rakuten Kitazawa`,y:`1902`,s:1902,era:`Meiji–Taishō`,k:`東京`,art:`hats`,p:2,fmt:`Tira em quadrinhos`,d:`Dois caipiras exploram a capital em uma tira considerada pioneira dos quadrinhos japoneses modernos.`,l:A+`Tagosaku+Mokube+Tokyo+Kenbutsu`},
{id:`sugoroku`,cat:3,n:`Manga Sugoroku`,au:`Okamoto Ippei`,y:`1929`,s:1929,era:`Meiji–Taishō`,k:`双六`,art:`board`,p:1,fmt:`Jogo de tabuleiro ilustrado`,d:`Jogo criado por Okamoto Ippei (1886–1948) que retrata as escolhas de vida da jovem moderna dos anos 1920.`,l:A+`Okamoto+Ippei`}
];
B.forEach(b=>b.pages=8);
const cover=b=>`<div class="cover" style="--b:${P[b.p][0]};--f:${P[b.p][1]}"><svg class="art" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART[b.art]}</svg><span class="k">${b.k}</span><div class="t">${b.n}<i>${b.au} · ${b.y}</i></div><img src="assets/covers/${b.id}.jpg" alt="Capa de ${b.n}" loading="lazy" onload="this.parentNode.classList.add('real')" onerror="this.remove()"></div>`;
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
  $(`#dbody`).innerHTML=`<div>${cover(b)}</div><div><span class="tag">${CATS[b.cat].id} · domínio público</span><h3 style="margin-top:14px">${b.n}</h3><div class="by">${b.au}</div><p style="margin:0;color:var(--mute);font-weight:500">${b.d}</p><dl><dt>Período</dt><dd>${b.y}</dd><dt>Época</dt><dd>${b.era}</dd><dt>Formato</dt><dd>${b.fmt}</dd></dl><div class="da"><button class="btn b" id="rd1">${prog[b.id]!==undefined?`Continuar leitura`:`Ler agora`}</button><button class="btn" id="fv">${fav.has(b.n)?`Remover favorito`:`Favoritar`}</button><a class="btn w" href="${b.l}" target="_blank" rel="noopener">Acervo original</a></div></div>`;
  $(`#fv`).onclick=()=>toggleFav(b.n);$(`#rd1`).onclick=()=>{$(`#dlg`).close();openR(b)};if(!$(`#dlg`).open)$(`#dlg`).showModal()}
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
const pageEl=(b,n)=>`<div class="pg">${demo(b,n,b.pages)}<img src="assets/manga/${b.id}/${n+1}.jpg" alt="${b.n}, página ${n+1}" onerror="this.remove()"></div>`;
/* leitor */
const R={b:null,i:0,mode:`page`,rtl:true,z:1};
function openR(b){R.b=b;R.i=Math.min(prog[b.id]??0,b.pages-1);$(`#rtitle`).textContent=b.n;$(`#sl`).max=b.pages;rdr();if(!$(`#rd`).open)$(`#rd`).showModal();fit()}
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
  if(R.mode==`page`)seen(b,[R.i]);else if(R.mode==`spread`){const a=R.i-(R.i%2);seen(b,[a,a+1])}
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
document.addEventListener(`keydown`,e=>{if(!$(`#rd`).open)return;
  if(e.key==`ArrowLeft`)go(R.rtl?1:-1);else if(e.key==`ArrowRight`)go(R.rtl?-1:1);
  else if(e.key==`+`||e.key==`=`)$(`#zi`).click();else if(e.key==`-`)$(`#zo`).click()});

/* Manga Coins: +10 ao ver todas as páginas de um título (uma vez por título) e +2 a cada 5 min de leitura ativa */
const COIN_BOOK=10,COIN_TIME=2,DK=id=>`mv_done_${U.email}_${id}`,SK=id=>`mv_seen_${U.email}_${id}`,TK=`mv_time_`+U.email;
function seen(b,list){
  const s=new Set(MV.get(SK(b.id),[])),n0=s.size;list.filter(i=>i>=0&&i<b.pages).forEach(i=>s.add(i));
  if(s.size!=n0)MV.set(SK(b.id),[...s]);
  if(s.size>=b.pages&&!MV.get(DK(b.id),false)){MV.set(DK(b.id),true);MV.coins.add(COIN_BOOK,`você terminou ${b.n}`)}}
$(`#stage`).addEventListener(`scroll`,()=>{const s=$(`#stage`);
  if(R.mode==`scroll`&&R.b&&s.scrollTop+s.clientHeight>=s.scrollHeight-24)seen(R.b,[...Array(R.b.pages).keys()])});
let act=Date.now();
[`pointerdown`,`keydown`,`wheel`,`touchstart`,`scroll`].forEach(ev=>$(`#rd`).addEventListener(ev,()=>act=Date.now(),true));
setInterval(()=>{if(!$(`#rd`).open||document.hidden||Date.now()-act>120000)return;
  let t=MV.get(TK,0)+15;if(t>=300){t-=300;MV.coins.add(COIN_TIME,`5 min de leitura`)}MV.set(TK,t)},15000);
/* mede as barras do leitor para as páginas ocuparem toda a altura que sobra */
function fit(){const r=$(`#rd`);if(!r.open)return;
  r.style.setProperty(`--ch`,(r.querySelector(`.rt`).offsetHeight+r.querySelector(`.rb`).offsetHeight+20)+`px`)}
addEventListener(`resize`,fit);document.addEventListener(`fullscreenchange`,()=>setTimeout(fit,50));
render();
