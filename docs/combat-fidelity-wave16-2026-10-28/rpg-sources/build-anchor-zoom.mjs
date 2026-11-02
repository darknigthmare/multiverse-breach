// QA crops only. Neither source artwork nor public sprites are changed.
import fs from 'node:fs/promises';
import sharp from 'sharp';
process.env.XDG_CACHE_HOME ||= '/tmp/w16-rpg-font-cache';
const p='docs/combat-fidelity-wave16-2026-10-28/';
const {points}=JSON.parse(await fs.readFile(p+'rpg-sources/native-contact-anchor-selections.json'));
const names=['arrival','preparation','attack','recovery'];
for(const[slug,phases]of Object.entries(points))for(const[phase,anchors]of Object.entries(phases)){
 const pieces=[],png=p+'summon-previews/'+slug+'-packed.png';const{data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const observed=[];
 for(let column=0;column<4;column++){
  const[x,y]=anchors[column],left=Math.max(0,Math.min(448,x-32)),top=Math.max(0,Math.min(192,y-32));
  const offset=((names.indexOf(phase)*256+y)*info.width+column*512+x)*4,rgba=[...data.subarray(offset,offset+4)];observed.push({x,y,rgba});
  const crop=await sharp(png).extract({left:column*512+left,top:names.indexOf(phase)*256+top,width:64,height:64}).resize(256,256,{kernel:sharp.kernel.nearest}).flatten({background:'#111923'}).png().toBuffer();
  pieces.push({input:crop,left:column*256,top:40});const cx=(x-left)*4+2,cy=(y-top)*4+42;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="296"><rect width="256" height="40" fill="#1f2934"/><text x="3" y="13" font-family="monospace" font-size="11" fill="white">${slug} ${phase} col${column}</text><text x="3" y="29" font-family="monospace" font-size="11" fill="white">x${x} y${y} alpha${rgba[3]}</text>${Array.from({length:9},(_,i)=>`<line x1="${i*32}" x2="${i*32}" y1="40" y2="296" stroke="#8cc" stroke-opacity=".2"/><text x="${i*32+1}" y="51" font-family="monospace" font-size="9" fill="#bcc">${left+i*8}</text>`).join('')}<path d="M${cx-12} ${cy}h8 M${cx+4} ${cy}h8 M${cx} ${cy-12}v8 M${cx} ${cy+4}v8" fill="none" stroke="#ff4466" stroke-width="1"/></svg>`;
  pieces.push({input:Buffer.from(svg),left:column*256,top:0});
 }
 await sharp({create:{width:1024,height:296,channels:4,background:'#111923'}}).composite(pieces).png().toFile(p+'rpg-previews/'+slug+'-'+phase+'-anchor-zoom.png');
 console.log(JSON.stringify({slug,phase,observed}));
}
