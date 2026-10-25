import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root = path.resolve(import.meta.dirname,'../../..');
const directory = path.join(import.meta.dirname,'anchor-contacts');
fs.mkdirSync(directory,{recursive:true});
const ids = ['meryl_mgs','ocelot_mgs','big_boss','joel_tlou','tess_tlou','tommy_tlou','dina_tlou2','abby_tlou2'];
const grid = ['<svg width="1024" height="512" xmlns="http://www.w3.org/2000/svg">'];
for(let r=0;r<2;r++)for(let c=0;c<4;c++){
  for(let p=32;p<256;p+=32){
    grid.push('<path d="M'+(c*256+p)+' '+(r*256)+'v256 M'+(c*256)+' '+(r*256+p)+'h256" stroke="#7796ac" opacity=".35" stroke-width="1"/>');
    grid.push('<text x="'+(c*256+p+2)+'" y="'+(r*256+12)+'" font-size="9" fill="#d3e9ff">'+p+'</text>');
    grid.push('<text x="'+(c*256+2)+'" y="'+(r*256+p+9)+'" font-size="9" fill="#d3e9ff">'+p+'</text>');
  }
  grid.push('<rect x="'+(c*256)+'" y="'+(r*256)+'" width="256" height="256" fill="none" stroke="#d3e9ff"/>');
}
grid.push('</svg>');
for(const id of ids){
  const file=path.join(root,'public/sprites/generated/combat-character-animations-wave13-part-b',id+'.png');
  const fatal=await sharp(file).extract({left:0,top:1024,width:1024,height:256}).png().toBuffer();
  const superRow=await sharp(file).extract({left:0,top:1792,width:1024,height:256}).png().toBuffer();
  await sharp({create:{width:1024,height:512,channels:4,background:{r:36,g:49,b:72,alpha:1}}})
    .composite([{input:fatal,left:0,top:0},{input:superRow,left:0,top:256},{input:Buffer.from(grid.join('')),left:0,top:0}])
    .png().toFile(path.join(directory,id+'-grid.png'));
}
console.log(JSON.stringify({grids:ids.length,gridStep:32,actualCellSize:256}));
