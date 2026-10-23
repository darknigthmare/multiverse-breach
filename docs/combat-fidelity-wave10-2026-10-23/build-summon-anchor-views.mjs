import fs from'node:fs';import sharp from'sharp';
const prefix='docs/combat-fidelity-wave10-2026-10-23',reg=JSON.parse(fs.readFileSync('src/game/combat/summonAnimationsWave10.generated.json'));
fs.mkdirSync(prefix+'/summon-anchor-views',{recursive:true});
let svg='<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="512">';
for(let row=0;row<2;row++)for(let col=0;col<4;col++){
 for(let x=0;x<512;x+=32)svg+=`<path d="M${col*512+x} ${row*256}v256" stroke="#5df1e1" opacity=".2"/><text x="${col*512+x+2}" y="${row*256+13}" font-size="11" fill="#9ff">${x}</text>`;
 for(let y=32;y<256;y+=32)svg+=`<path d="M${col*512} ${row*256+y}h512" stroke="#5df1e1" opacity=".2"/><text x="${col*512+2}" y="${row*256+y-2}" font-size="11" fill="#9ff">${y}</text>`;
}svg+='</svg>';
for(const e of reg.entries.filter(e=>!['ghostbusters-egon','left4dead-coach'].includes(e.id))){await sharp('public'+e.sheet).extract({left:0,top:256,width:2048,height:512}).flatten({background:'#202330'}).composite([{input:Buffer.from(svg)}]).png().toFile(`${prefix}/summon-anchor-views/${e.id}.png`);}
console.log('6 QA views; runtime images untouched');
