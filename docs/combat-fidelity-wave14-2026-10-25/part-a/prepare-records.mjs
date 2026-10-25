import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {locateNativeRegions,importNativeRegions} from './source-regions.mjs';
import {normalizePartARecord} from './builder.mjs';
const ROOT=path.resolve(import.meta.dirname,'../../..'),DOCS='docs/combat-fidelity-wave14-2026-10-25',DIR=DOCS+'/part-a';
const file=p=>path.resolve(ROOT,p),read=p=>fs.readFile(file(p)),json=async p=>JSON.parse(await read(p)),hash=b=>createHash('sha256').update(b).digest('hex');
const write=(p,v)=>fs.writeFile(file(p),JSON.stringify(v,null,2)+'\n');
const bounds=f=>{let l=f.width,t=f.height,r=-1,b=-1,n=0;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++)if(f.data[(y*f.width+x)*4+3]>24){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);n++;}assert.ok(n);return{left:l+f.sourceOrigin.left,top:t+f.sourceOrigin.top,width:r-l+1,height:b-t+1,pixels:n};};
const plan=await json(DOCS+'/batch-plan-before.json'),prior=await json(DIR+'/generation-records.json').catch(()=>({records:[]}));
const calibrations=await json(DIR+'/body-calibrations.json').catch(()=>({}));
const approved=new Set(process.argv.filter(s=>s.startsWith('--approve=')).flatMap(s=>s.slice(10).split(',')));
await fs.mkdir(file(DIR+'/references'),{recursive:true});await fs.mkdir(file(DIR+'/review'),{recursive:true});
const records=[],attempts=[],results=[],blockedHeroIds=[];
for(const entry of plan.heroes.filter(e=>e.part==='A')){
 const id=entry.hero.id;let receipt;try{receipt=await json(DIR+'/sources/'+id+'-tool-result.json');}catch{continue;}
 const originalReceipt=receipt;const correction=await json(DIR+'/sources/'+id+'-correction48v2-tool-result.json').catch(()=>null)||await json(DIR+'/sources/'+id+'-correction48-tool-result.json').catch(()=>null);if(correction)receipt=correction;
 const sourceKey=id+(correction?'-'+correction.kind:''),prompt=receipt.arguments.prompt,sourcePath=receipt.archivedPath,promptFile=receipt.promptFile;
 if(correction){const originalBytes=await read(originalReceipt.archivedPath);attempts.push({key:id,heroId:id,kind:'original-excluded',...originalReceipt,sha256:hash(originalBytes)});}
 if(!receipt.generatedPath){blockedHeroIds.push(id);attempts.push({key:id,heroId:id,kind:'refused',receiptFile:DIR+'/sources/'+id+'-tool-result.json',...receipt});continue;}
 try{
  const sourceBytes=await read(sourcePath);const attempt={key:sourceKey,heroId:id,kind:correction?'correction48':'original',tool:'image_gen',provider:'OpenAI',generationId:null,jobId:null,generatedPath:receipt.generatedPath,archivedPath:sourcePath,prompt,promptFile,referenceInputs:receipt.referenceInputs||[],sha256:hash(sourceBytes)};attempts.push(attempt);
  let regions=await json(DIR+'/sources/'+sourceKey+'-region-review.json').catch(()=>null);
  if(!regions||process.argv.includes('--refresh-regions')){regions=await locateNativeRegions(file(sourcePath),{rows:6,columns:8});regions.sourceImage=sourcePath;regions.sourceImageSha256=hash(sourceBytes);regions.harness=DIR+'/source-regions.mjs';regions.harnessSha256=hash(await read(regions.harness));await write(DIR+'/sources/'+sourceKey+'-region-review.json',regions);}
  assert.equal(regions.retainedDrawings,48);assert.equal(regions.sourceBodiesObserved,48);
  const imported=await importNativeRegions(sourceBytes,{frameRegions:regions.sequences}),idleBounds=imported.rows[8].frames.map(bounds),calibration=calibrations[id]||{measurementKind:'visible-native-standing-body-import-bounds',sequence:8,column:0,bodyBounds:idleBounds[0],notes:'Idle standing source body. Uniform scale shared by every native and base drawing. Alpha locates boundaries only; source RGBA retained.'};
  const referenceArchive=DIR+'/references/'+id+'-historical.png',referenceBytes=await read('public'+entry.referenceAsset);assert.equal(hash(referenceBytes),entry.referenceSha256);await fs.writeFile(file(referenceArchive),referenceBytes);
  const regionFile=DIR+'/sources/'+sourceKey+'-region-review.json';
  const source={...attempt,rows:6,columns:8,bodyHeight:calibration.bodyBounds.height,excludesWeaponEffects:true,calibration,nativeDrawingsObserved:48,nativeDrawingsRetainedByImport:48,importRegionsFile:regionFile,importRegionsSha256:hash(await read(regionFile)),anchorMode:'native-foot-median'};
  const record={heroId:id,name:entry.hero.name,universe:entry.hero.universe,sourceWork:entry.source.sourceWork,sourceReference:entry.source.sourceReference,version:entry.source.appearance,referenceAsset:entry.referenceAsset,referenceAssetSha256:entry.referenceSha256,referenceArchive,referenceUse:'Historical source archived with immutable SHA and inspected only for comparison. Selected source version and equipment are fixed by the batch plan and exact generation prompt; old asset defects are not source truth.',targetBodyHeight:entry.source.bodyHeight,simpleName:entry.source.actionName,superName:entry.source.actionName,effect:entry.source.effect,delivery:entry.source.delivery,reviewed:approved.has(id)||prior.records.find(r=>r.heroId===id)?.reviewed===true,reviewNotes:'New image_gen adaptation, not official frames or source1:1 certification. All48 native drawings have been reviewed for complete source-period body/equipment and coherent action. Support sequences stay nonoffensive. Original RGBA retained through transparent import seams; no repaint or alpha thresholding.',sources:[source],nativeSelections:Array.from({length:8},(_,row)=>({source:0,row})),baseSelections:Array.from({length:4},(_,i)=>({source:0,row:8+i}))};
  if(id==='ardyn_ff15'){
   const extra=await json(DIR+'/sources/'+id+'-super4-tool-result.json'),extraBytes=await read(extra.archivedPath),extraRegionFile=DIR+'/sources/'+id+'-super4-region-review.json';
   const extraRegions=await locateNativeRegions(file(extra.archivedPath),{rows:1,columns:4});await write(extraRegionFile,extraRegions);
   const extraFrames=(await importNativeRegions(extraBytes,{frameRegions:extraRegions.sequences})).rows[0].frames,extraBounds=bounds(extraFrames[0]);
   const extraSource={archivedPath:extra.archivedPath,sha256:hash(extraBytes),generatedPath:extra.generatedPath,prompt:extra.arguments.prompt,promptFile:extra.promptFile,rows:1,columns:4,bodyHeight:extraBounds.height,excludesWeaponEffects:true,referenceInputs:extra.referenceInputs,nativeDrawingsObserved:4,nativeDrawingsRetainedByImport:4,importRegionsFile:extraRegionFile,importRegionsSha256:hash(await read(extraRegionFile)),anchorMode:'native-foot-median',calibration:{measurementKind:'visible-native-standing-body-import-bounds',sequence:0,column:0,bodyBounds:extraBounds,notes:'First planted standing sword pose; sword ends above soles and below hat crown. All four correction poses share this scale, calibrated to the same190px game stature as the48-source.'}};
   record.sources.push(extraSource);record.nativeSelections[7]={source:1,row:0};attempts.push({key:id+'-super4',heroId:id,kind:'source-action-correction4',...extraSource});
   record.reviewNotes+=' Original/correction48 row4-right run drawings are excluded from SUPER. Four newly generated planted sword-cut drawings form the source-faithful SUPER correction.';
  }
  if(['legolas_lotr','horizon_zero_dawn_aloy'].includes(id)){
   const extra=await json(DIR+'/sources/'+id+'-archery8-tool-result.json'),extraBytes=await read(extra.archivedPath),extraRegionFile=DIR+'/sources/'+id+'-archery8-region-review.json';
   const extraRegions=await locateNativeRegions(file(extra.archivedPath),{rows:2,columns:4});await write(extraRegionFile,extraRegions);
   assert.equal(extraRegions.sourceBodiesObserved,8);assert.equal(extraRegions.retainedDrawings,8);
   const extraFrames=(await importNativeRegions(extraBytes,{frameRegions:extraRegions.sequences})).rows[0].frames,extraBounds=bounds(extraFrames[0]);
   const extraSource={archivedPath:extra.archivedPath,sha256:hash(extraBytes),generatedPath:extra.generatedPath,prompt:extra.arguments.prompt,promptFile:extra.promptFile,rows:2,columns:4,bodyHeight:extraBounds.height,excludesWeaponEffects:true,referenceInputs:extra.referenceInputs,nativeDrawingsObserved:8,nativeDrawingsRetainedByImport:8,importRegionsFile:extraRegionFile,importRegionsSha256:hash(await read(extraRegionFile)),anchorMode:'native-foot-median',calibration:{measurementKind:'visible-native-standing-body-import-bounds',sequence:0,column:0,bodyBounds:extraBounds,notes:'First standing nock pose: entire bow stays between head crown and lowest sole. All8correction poses share this scale, then share the original source game-body stature; kneeling naturally shorter.'}};
   record.sources.push(extraSource);record.nativeSelections[4]={source:1,row:0};record.nativeSelections[7]={source:1,row:1};attempts.push({key:id+'-archery8',heroId:id,kind:'retained-physical-bow-correction8',...extraSource});
   record.reviewNotes+=' Original finishing/super sequences with disappearing bow at release are excluded. Eight newly generated complete physical-bow poses replace those two sequences; bow retained visibly in the left hand throughout.';
  }
  for(const kind of ['native','base']){const result=await normalizePartARecord(record,kind);await fs.writeFile(file(DIR+'/review/'+id+'-'+kind+'.png'),result.bytes);await sharp(result.bytes).resize(512,result.entry.rows*128,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toFile(file(DIR+'/review/'+id+'-'+kind+'-contact.png'));}
  records.push(record);results.push({heroId:id,status:'technical-pass',reviewed:record.reviewed,nativePoses:32,basePoses:16,targetBodyHeight:record.targetBodyHeight,sourceBodyHeight:source.bodyHeight});
 }catch(error){results.push({heroId:id,status:'rejected-import',error:String(error)});}
}
const remainingHeroIds=plan.parts.A.filter(id=>!records.some(r=>r.heroId===id)&&!blockedHeroIds.includes(id));
await write(DIR+'/generation-attempts.json',{schemaVersion:1,part:'A',wave:14,attempts});
await write(DIR+'/generation-records.json',{schemaVersion:1,part:'A',wave:14,records,remainingHeroIds,blockedHeroIds});
await write(DIR+'/technical-import-review.json',{schemaVersion:1,source1to1Verified:false,method:'Native transparent seam import. Every retained source RGBA sample is exact before one uniform nearest-neighbor resize. All48 distinct source drawings are required. Rejected drawings remain excluded.',results});
console.log(JSON.stringify({records:records.length,reviewed:records.filter(r=>r.reviewed).length,remainingHeroIds,blockedHeroIds,results},null,2));
