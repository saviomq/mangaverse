/* Mosaico do hero: 3 fileiras iguais.
   Coloque suas imagens em cada fileira (uma lista por fileira).
   Ex.: "assets/hero/a1.jpg". Use apenas arte que você tenha licença/permissão
   para usar. Fileira vazia = painéis coloridos do site, prontos para receber imagens. */
(function(){
  const ROW_IMAGES=[
    [/* fileira 1 (de cima): "assets/hero/a1.jpg", "assets/hero/a2.jpg" */],
    [/* fileira 2 (meio):    "assets/hero/b1.jpg", "assets/hero/b2.jpg" */],
    [/* fileira 3 (baixo):   "assets/hero/c1.jpg", "assets/hero/c2.jpg" */]
  ];
  const MIN_PANELS=8;        // cards por volta (cobre telas largas; as imagens se repetem se forem menos)
  const SPEED=[80,64,92];    // segundos por volta de cada fileira
  const host=document.getElementById(`mosaic`);if(!host)return;
  const wall=document.createElement(`div`);wall.className=`wall`;
  ROW_IMAGES.forEach((imgs,r)=>{
    const row=document.createElement(`div`);row.className=`row`+(r%2?` rev`:``);
    const tr=document.createElement(`div`);tr.className=`track`;tr.style.setProperty(`--dur`,SPEED[r]+`s`);
    const n=imgs.length?imgs.length*Math.ceil(MIN_PANELS/imgs.length):MIN_PANELS;
    const set=()=>{const f=document.createDocumentFragment();
      for(let i=0;i<n;i++){
        const p=document.createElement(`div`);p.className=`panel`;
        const a=document.createElement(`div`);a.className=`art`;
        if(imgs.length){const g=document.createElement(`i`);g.style.backgroundImage=`url("${imgs[i%imgs.length]}")`;a.appendChild(g)}
        else a.className+=` k v`+(((i+r)%4)+1);
        p.appendChild(a);f.appendChild(p)}
      return f};
    tr.appendChild(set());tr.appendChild(set());row.appendChild(tr);wall.appendChild(row)});
  host.appendChild(wall);
})();
