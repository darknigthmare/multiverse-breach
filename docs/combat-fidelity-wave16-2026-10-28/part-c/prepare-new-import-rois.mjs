import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import sharp from 'sharp';import {segmentNativeAtlas} from './native-segmentation.mjs';
process.env.XDG_CACHE_HOME||='/tmp/w16c-font-cache';
const root=path.resolve(import.meta.dirname,'../../..'),P='docs/combat-fidelity-wave16-2026-10-28/part-c/',read=f=>fs.readFile(path.join(root,f),'utf8'),json=async f=>JSON.parse(await read(f)),out=await json(P+'source-import-rois.json'),records=await json(P+'generation-records.json');let added=0,sources=0;
for(const record of records.records)for(const[sourceIndex,source]of record.sources.entries()){
 if(!source.retainedDrawings)continue;
 const old=out.calibrations.find(r=>r.heroId===record.heroId&&r.sourceIndex===sourceIndex);if(old){assert.equal(old.sourceImageSha256,source.sha256);continue;}
 const atlas=await segmentNativeAtlas(path.join(root,source.archivedPath),{rowCount:source.rows}),marks=[];
 for(const[index,sourceRows,columns]of[...record.selections.native,...record.selections.base])if(index===sourceIndex)for(const[columnIndex,sourceColumn]of columns.entries()){
  const sourceRow=Array.isArray(sourceRows)?sourceRows[columnIndex]:sourceRows;
  const frame=atlas.rows[sourceRow][sourceColumn];let minX=frame.width,minY=frame.height,maxX=-1,maxY=-1;
  for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>24){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  assert.ok(maxY>=0);const bottom=Math.min(frame.height,maxY+3),rect={left:0,top:0,width:frame.width,height:bottom};let outsidePixels=0,maxOutsideAlpha=0;
  for(let y=bottom;y<frame.height;y++)for(let x=0;x<frame.width;x++){const a=frame.data[(y*frame.width+x)*4+3];if(a)outsidePixels++;maxOutsideAlpha=Math.max(maxOutsideAlpha,a);}assert.ok(maxOutsideAlpha<=24);
  let sx=0,n=0;for(let x=0;x<frame.width;x++)if(frame.data[(maxY*frame.width+x)*4+3]>24){sx+=x;n++;}const footX=Math.round(sx/n),b=frame.sourceBounds;
  out.records.push({heroId:record.heroId,sourceIndex,sourceRow,sourceColumn,sourceImageSha256:source.sha256,originalSourceBounds:b,rect,sourceOpaqueBounds:{left:minX,top:minY,right:maxX,bottom:maxY},proposedSourceFootPoint:{x:footX,y:maxY},outsidePixels,maxOutsideAlpha,approved:false,method:'Whole rectangular bottom selection with two pixels AA padding; retains exact interior RGBA. Requires direct annotated review of all equipment, hair, effects and shoes, not merely alpha>24.'});added++;
  marks.push(`<rect x="${b.left}" y="${b.top}" width="${rect.width}" height="${rect.height}" fill="none" stroke="#ffbc5a"/><path d="M${b.left} ${b.top+rect.height}h${rect.width}" stroke="#ff5048" stroke-width="2"/><circle cx="${b.left+footX}" cy="${b.top+maxY}" r="3" fill="#3ef08b"/>`);
 }
 const bb=atlas.rows[0][0].bodyBounds;
 out.calibrations.push({heroId:record.heroId,sourceIndex,sourceImage:source.archivedPath,sourceImageSha256:source.sha256,standingReference:{sourceRow:0,sourceColumn:0,sourceBodyBounds:bb,proposedCrownY:bb.top,proposedSoleY:bb.bottom,proposedCrownToSoleHeight:bb.height},reviewed:false});
 marks.push(`<path d="M${bb.left} ${bb.top}h${bb.width} M${bb.left} ${bb.bottom+1}h${bb.width}" stroke="#3ef08b" stroke-width="2"/><text x="${bb.left}" y="${Math.max(12,bb.top-4)}" font-size="12" fill="#fff">crown/sole ${bb.height}px</text>`);
 const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${atlas.width}" height="${atlas.height}">${marks.join('')}</svg>`);
 await sharp(path.join(root,source.archivedPath)).flatten({background:'#15243a'}).composite([{input:svg,left:0,top:0}]).png().toFile(path.join(root,P+'import-roi-review/'+record.heroId+'-source'+sourceIndex+'.png'));sources++;
}
out.updatedAt=new Date().toISOString();await fs.writeFile(path.join(root,P+'source-import-rois.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({newSources:sources,newRoiCandidates:added,alreadyApproved:out.records.filter(r=>r.approved).length}));
