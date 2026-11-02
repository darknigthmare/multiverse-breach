import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
export function isWave16NativeSourcePath(file){
 return typeof file==='string'&&file.startsWith('docs/combat-fidelity-wave16-2026-10-28/')
  && !file.split('/').some(part=>part==='..'||part==='.')
  && !/\/(?:references|contacts|browser|previews)\//i.test(file)
  && /\.png$/i.test(file);
}
export function boundCells(entry){
 const width=Number(entry.frameWidth??entry.dimensions?.frameWidth??entry.dimensions?.cellWidth),height=Number(entry.frameHeight??entry.dimensions?.frameHeight??entry.dimensions?.cellHeight);
 assert.ok(Number.isInteger(width)&&width>0&&Number.isInteger(height)&&height>0,'Missing actual cell dimensions: '+entry.sheet);
 const binding=entry.phases??entry.states,cells=[];
 if(binding&&!Array.isArray(binding))for(const spec of Object.values(binding)){assert.ok(Number.isInteger(spec.row)&&spec.row>=0);const count=spec.frames??spec.frameCount;assert.ok(Number.isInteger(count)&&count>0);for(let i=0;i<count;i++)cells.push({row:spec.row,col:(spec.startColumn??0)+i});}
 else{assert.equal(entry.frames,entry.columns*entry.rows,'A sparse atlas needs explicit used-state bindings');for(let i=0;i<entry.frames;i++)cells.push({row:Math.floor(i/entry.columns),col:i%entry.columns});}
 const keys=cells.map(c=>c.row+':'+c.col);assert.equal(new Set(keys).size,keys.length,'Duplicate state/phase cell binding: '+entry.sheet);assert.equal(cells.length,entry.frames,'Declared count differs from used bindings: '+entry.sheet);
 return{width,height,cells};
}
// Technical comparison only: do not write or alter image files. Hidden RGB of
// alpha-zero pixels is not artwork. Cropping transparent padding and canonical
// horizontal orientation prevent either from manufacturing a new drawing.
export function canonicalCell(data,imageWidth,imageHeight,{row,col},width,height){
 assert.ok(Number.isInteger(row)&&row>=0&&Number.isInteger(col)&&col>=0);const left=col*width,top=row*height;assert.ok(left+width<=imageWidth&&top+height<=imageHeight,'Used cell outside decoded PNG');
 let x0=width,y0=height,x1=-1,y1=-1,visiblePixels=0,alphaMin=255,alphaMax=0,alphaZero=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const a=data[((top+y)*imageWidth+left+x)*4+3];alphaMin=Math.min(alphaMin,a);alphaMax=Math.max(alphaMax,a);if(a===0)alphaZero++;else{visiblePixels++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}
 assert.ok(visiblePixels>0,'Empty used cell');assert.ok(alphaZero>0,'Used cell has no transparent separation');const w=x1-x0+1,h=y1-y0+1,rgba=Buffer.alloc(w*h*4),mirrored=Buffer.alloc(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const src=((top+y0+y)*imageWidth+left+x0+x)*4,dst=(y*w+x)*4,flip=(y*w+w-1-x)*4;if(data[src+3]>0){for(let channel=0;channel<4;channel++){rgba[dst+channel]=data[src+channel];mirrored[flip+channel]=data[src+channel];}}}
 const header=Buffer.from(w+'x'+h+':'),direct=sha(Buffer.concat([header,rgba])),mirror=sha(Buffer.concat([header,mirrored]));return{row,col,trim:{x:x0,y:y0,width:w,height:h},visiblePixels,alphaZero,alphaMin,alphaMax,rgbaSha256:direct,mirroredRgbaSha256:mirror,canonicalRgbaSha256:direct<mirror?direct:mirror};
}
