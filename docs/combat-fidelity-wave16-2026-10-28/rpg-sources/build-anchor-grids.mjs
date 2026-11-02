// QA overlays only: never writes production artwork or creates a native pose.
import fs from 'node:fs/promises';
import sharp from 'sharp';
process.env.XDG_CACHE_HOME ||= '/tmp/w16-rpg-font-cache';
await fs.mkdir(process.env.XDG_CACHE_HOME + '/fontconfig', {recursive:true});
const p='docs/combat-fidelity-wave16-2026-10-28/';
const names=['arrival','preparation','attack','recovery'];
for(const slug of ['crash','faye','alphonse','bt7274','fox-devil','starfire']){
 for(const phase of slug==='fox-devil'?names:['attack']){
  const pieces=[];
  for(let column=0;column<4;column++){
   const left=(column%2)*512,top=Math.floor(column/2)*288;
   const input=await sharp(p+'summon-previews/'+slug+'-packed.png').extract({left:column*512,top:names.indexOf(phase)*256,width:512,height:256}).flatten({background:'#111923'}).png().toBuffer();
   pieces.push({input,left,top:top+32});
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="288"><rect width="512" height="32" fill="#1f2a36"/><text x="6" y="13" font-family="monospace" font-size="12" fill="white">${slug} ${phase} column${column} · native pixel coords</text>${Array.from({length:17},(_,i)=>`<line x1="${i*32}" x2="${i*32}" y1="32" y2="288" stroke="#78caca" stroke-opacity=".16"/><text x="${i*32+1}" y="28" font-family="monospace" font-size="10" fill="#9ab">${i*32}</text>`).join('')}${Array.from({length:9},(_,i)=>`<line x1="0" x2="512" y1="${32+i*32}" y2="${32+i*32}" stroke="#78caca" stroke-opacity=".16"/><text x="2" y="${41+i*32}" font-family="monospace" font-size="10" fill="#9ab">${i*32}</text>`).join('')}</svg>`;
   pieces.push({input:Buffer.from(svg),left,top});
  }
  await sharp({create:{width:1024,height:576,channels:4,background:'#111923'}}).composite(pieces).png().toFile(p+'rpg-previews/'+slug+'-'+phase+'-anchor-grid.png');
 }
}
console.log(JSON.stringify({qaOnly:true,grids:9,productionFilesWritten:0}));
