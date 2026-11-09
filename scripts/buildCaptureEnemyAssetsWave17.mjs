import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {segmentAtlas} from './buildCombatEntityAssets.mjs';
const root=new URL('../',import.meta.url),docs='docs/combat-fidelity-wave17-2026-11-02';
const sourceImage=docs+'/rpg-sources/kitten-original.png',registryPath='src/game/combat/sourceCaptureEnemiesWave17.generated.json';
const sheet='/sprites/generated/source-capture-enemies-wave17/black-cat-gang-kitten.png';
const phases=['idle','run','captured','released'],width=256,height=256,baseline=244,margin=12;
const read=path=>fs.readFile(new URL(path,root));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const encoded=data=>JSON.stringify(data,null,2)+'\n';
export async function buildCaptureEnemyAssetsWave17(check=false,prepare=false){
 assert.ok(!(check&&prepare));
 const planPath=docs+'/rpg-sources/kitten-source-plan-before.json',plan=JSON.parse(await read(planPath));
 assert.equal(hash(await read(planPath)),JSON.parse(await read(docs+'/rpg-sources/kitten-source-plan-receipt.json')).sha256);
 const source=await read(sourceImage),atlas=await segmentAtlas(fileURLToPath(new URL(sourceImage,root)),4);
 assert.ok(atlas.rows.every(row=>row.seamReview.crossedVisiblePixels===0&&row.seamReview.crossedOpaquePixels===0));
 // Alpha threshold locates the native import rectangle only. Retain every
 // original RGBA value inside it; no alpha or visible pixels are repainted.
 for(const row of atlas.rows)for(const frame of row.frames){let left=frame.width,top=frame.height,right=-1,bottom=-1;
  for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
  assert.ok(right>=left&&bottom>=top);frame.bounds={left,top,width:right-left+1,height:bottom-top+1};
  const feet=[];for(let y=top+Math.floor((bottom-top+1)*.82);y<=bottom;y++)for(let x=left;x<=right;x++)if(frame.data[(y*frame.width+x)*4+3]>128)feet.push(x);feet.sort((a,b)=>a-b);assert.ok(feet.length);frame.centerX=feet[Math.floor(feet.length/2)];}
 const calibration=atlas.rows[1].frames[0].bounds;
 const halfWidth=Math.max(...atlas.rows.flatMap(row=>row.frames.map(frame=>Math.max(frame.centerX-frame.bounds.left,frame.bounds.left+frame.bounds.width-frame.centerX))));
 const envelopeHeight=Math.max(...atlas.rows.map(row=>Math.max(...row.frames.map(frame=>frame.bounds.top+frame.bounds.height))-Math.min(...row.frames.map(frame=>frame.bounds.top))));
 const scale=Math.min(190/calibration.height,(width/2-margin-1)/halfWidth,(baseline-margin-1)/envelopeHeight);
 const rows=[];
 for(const[rowIndex,row]of atlas.rows.entries()){
  const bottom=Math.max(...row.frames.map(frame=>frame.bounds.top+frame.bounds.height)),composites=[],frameBounds=[];
  for(const[column,frame]of row.frames.entries()){
   const b=frame.bounds,w=Math.max(1,Math.round(b.width*scale)),h=Math.max(1,Math.round(b.height*scale));
   const left=Math.round(width/2+(b.left-frame.centerX)*scale),top=Math.round(baseline-(bottom-b.top)*scale);
   assert.ok(left>=margin&&top>=margin&&left+w<=width-margin&&top+h<=height-margin,'complete familiar would be cropped');
   const input=await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}}).extract({left:b.left,top:b.top,width:b.width,height:b.height}).resize(w,h,{kernel:'nearest'}).png().toBuffer();
   composites.push({input,left:column*width+left,top});frameBounds.push({source:b,output:{left,top,width:w,height:h}});
  }
  const bytes=await sharp({create:{width:width*4,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(composites).png().toBuffer();
  rows.push({bytes,phase:phases[rowIndex],frameBounds,...row.seamReview,sourceBounds:row.sourceBounds});
 }
 const bytes=await sharp({create:{width:1024,height:1024,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(rows.map((row,index)=>({input:row.bytes,left:0,top:index*height}))).png({compressionLevel:9}).toBuffer();
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});const frameHashes=[],visiblePixels=[];
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const cell=Buffer.alloc(width*height*4);let visible=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const offset=((row*height+y)*info.width+col*width+x)*4,alpha=data[offset+3];
   if(alpha>0)data.copy(cell,(y*width+x)*4,offset,offset+4);if(alpha>24)visible++;
   if(x<margin||x>=width-margin||y<margin||y>=height-margin)assert.equal(alpha,0,'nontransparent frame margin');
  }
  assert.ok(visible>500);frameHashes.push(hash(cell));visiblePixels.push(visible);
 }
 assert.equal(new Set(frameHashes).size,16,'native drawings must be distinct');
 await fs.mkdir(new URL(docs+'/rpg-sources/',root),{recursive:true});
 if(prepare){await fs.writeFile(new URL(docs+'/rpg-sources/kitten-packed-review.png',root),bytes);
  await fs.writeFile(new URL(docs+'/rpg-sources/kitten-packing-measurements.json',root),encoded({draftOnly:true,sha256:hash(bytes),scale,baseline,sourceBodyHeight:calibration.height,outputBodyHeight:Math.round(calibration.height*scale),rows:rows.map(({bytes:_bytes,...row})=>row),frameHashes,visiblePixels}));
  return{prepare:true,publicFilesWritten:0,nativePoses:16};
 }
 const reviewPath=docs+'/rpg-sources/kitten-artwork-review.json',review=JSON.parse(await read(reviewPath));assert.equal(review.actuallyViewed,true);assert.equal(review.packedSha256,hash(bytes));
 const referenceImage=plan.referenceImage,entry={id:'tail-concerto-kitten-wave17',sourceEnemyId:'tail_concerto_red_vest_kitten',universe:'Tail Concerto',kind:'source-capture-enemy',bodyHeight:110,sheet,width:1024,height:1024,frameWidth:width,frameHeight:height,columns:4,rows:4,frames:16,
  phases:Object.fromEntries(phases.map((phase,row)=>[phase,{row,frames:4,columns:4,fps:10,loop:phase==='idle'||phase==='run'||phase==='captured'}])),
  sha256:hash(bytes),alpha:true,sourceImage,sourceImageSha256:hash(source),sourceDimensions:[atlas.width,atlas.height],
  sourceImages:[{path:sourceImage,sha256:hash(source),role:'accepted-generated-native-entity-atlas'}],referenceImage,referenceImageSha256:hash(await read(referenceImage)),
  sourceWork:plan.sourceWork,sourceReference:plan.sourceFacts+' Native new pixel-art adaptation; capture state never damages, lifts or changes factions.',sourceUrl:plan.sourceUrl,
  provider:'OpenAI',model:null,generationId:null,jobId:null,canonicalVerified:false,canon1to1Verified:false,source1to1Verified:false,networkVerified:false,
  normalization:{method:'alpha-seams-common-scale-nearest-neighbor',baseline,sharedScaleAcrossAllPhases:true,scale,bodyCalibration:{row:1,column:0,targetBodyHeight:190,sourceBodyHeight:calibration.height,outputBodyHeight:Math.round(calibration.height*scale)},rows:rows.map(({bytes:_bytes,...row})=>row)},
  visualValidation:{identityReviewed:true,allFramesReviewed:true,fullSubjectContained:true,distinctCells:16,frameHashes,visiblePixels,transparentMarginPixels:margin,source1to1Verified:false,noNewGameplayEvents:true,review:reviewPath,reviewSha256:hash(await read(reviewPath))}};
 const registry={schemaVersion:1,source:'OpenAI',category:'sourceCaptureEnemy',entries:[entry]};
 const provenance={schemaVersion:1,category:'sourceCaptureEnemy',actualGenerationCalls:1,observedNativePoses:16,retainedNativePoses:16,excludedNativePoses:0,generatedAtlases:1,affectsRpgSummonCounters:false,sourcePlan:planPath,sourcePlanSha256:hash(await read(planPath)),sourceImages:entry.sourceImages,references:[{file:referenceImage,sha256:hash(await read(referenceImage))}],excludedAttempts:[],acceptedReceipt:docs+'/rpg-sources/kitten-tool-result.json',entries:[entry],source1to1Verified:false};
 for(const[path,content]of[[registryPath,Buffer.from(encoded(registry))],[docs+'/source-capture-enemy-provenance.json',Buffer.from(encoded(provenance))],['public'+sheet,bytes]]){
  if(check)assert.deepEqual(await read(path),content,path+' stale');else{await fs.mkdir(new URL(path.slice(0,path.lastIndexOf('/'))+'/',root),{recursive:true});await fs.writeFile(new URL(path,root),content);}
 }
 return{check,category:'sourceCaptureEnemy',atlases:1,nativePoses:16,actualGenerationCalls:1,observedNativePoses:16,excludedNativePoses:0,reconstructedExactly:true};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify(await buildCaptureEnemyAssetsWave17(process.argv.includes('--check'),process.argv.includes('--prepare'))));
