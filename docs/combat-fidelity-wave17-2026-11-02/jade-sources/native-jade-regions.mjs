// Whole-pose geometric regions with zero-visible-crossing seams. No alpha
// cleanup: every RGBA sample inside a retained region is the original source.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {locateNativeRegions,importNativeRegions} from './native-jade-region-boundaries.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export async function importJadeSource(file,expectedRows,{groupComponentsByGrid=false,minimumBodyHeight}={}){
 const bytes=await fs.readFile(file),regions=await locateNativeRegions(file,{rows:expectedRows,columns:4,groupComponentsByGrid,minimumBodyHeight});
 if(regions.sequences.length!==expectedRows||regions.missingSlots.length)throw new Error(file+': missing source drawing groups '+JSON.stringify(regions.missingSlots));
 const imported=await importNativeRegions(bytes,{frameRegions:regions.sequences}),frames=[];
 for(const[row,sequence]of imported.rows.entries())for(const[col,f]of sequence.frames.entries()){
  let x0=f.width,y0=f.height,x1=-1,y1=-1;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++){if(f.data[(y*f.width+x)*4+3]<=24)continue;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  if(x1<x0||y1<y0)throw new Error(file+': empty retained body');
  x0=Math.max(0,x0-1);y0=Math.max(0,y0-1);x1=Math.min(f.width-1,x1+1);y1=Math.min(f.height-1,y1+1);
  const width=x1-x0+1,height=y1-y0+1,raw=Buffer.alloc(width*height*4);
  for(let y=0;y<height;y++)f.data.copy(raw,y*width*4,((y0+y)*f.width+x0)*4,((y0+y)*f.width+x0+width)*4);
  const visible=Buffer.from(raw);for(let at=0;at<visible.length;at+=4)if(visible[at+3]===0)visible.fill(0,at,at+4);
  const sourceRect={x:f.sourceOrigin.left+x0,y:f.sourceOrigin.top+y0,width,height};
  frames.push({raw,width,height,sourceRect,nativeRow:row,nativeColumn:col,rawSha256:hash(raw),visibleRgbaSha256:hash(visible),originalRgbaComparisonPassed:f.originalRgbaComparisonPassed,retainedPixelCount:f.retainedPixelCount,region:f.sourceRegion,canvasClipped:sourceRect.x===0||sourceRect.y===0||sourceRect.x+width===regions.width||sourceRect.y+height===regions.height});
 }
 return{file,sha256:hash(bytes),width:regions.width,height:regions.height,observedBodies:regions.sourceBodiesObserved,largeComponents:regions.sourceComponentsObserved,seedAlpha:128,regions,frames};
}
