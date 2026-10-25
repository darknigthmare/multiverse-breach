import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {importNativeRectangles} from './source-rois.mjs';
import {importNativeRegions} from './source-regions.mjs';
import {segmentAtlas} from '../../../scripts/buildCombatEntityAssets.mjs';
const ROOT=path.resolve(import.meta.dirname,'../../..');
const DOCS='docs/combat-fidelity-wave14-2026-10-25';
const PHASES=['intro','outro','roundVictory','roundDefeat','fatality','victory','defeat','super'];
const STATES=['idle','run','attack','hit'];
const file=p=>path.resolve(ROOT,p),read=p=>fs.readFile(file(p)),json=async p=>JSON.parse(await read(p));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const writeJson=(p,v)=>fs.writeFile(file(p),JSON.stringify(v,null,2)+'\n');

// A visible-alpha threshold locates import rectangles only. Pixel values inside
// every retained rectangle are copied from the native source without alpha edits.
function visibleBounds(frame, threshold=24){
 let left=frame.width,top=frame.height,right=-1,bottom=-1,pixels=0;
 for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>threshold){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);pixels++;}
 assert.ok(right>=left&&bottom>=top,'No visible subject in import frame');
 return{left,top,width:right-left+1,height:bottom-top+1,pixels};
}
function feetAnchor(frame,bounds,mode){
 if(mode==='body-center')return bounds.left+bounds.width/2;
 const xs=[];const low=bounds.top+Math.floor(bounds.height*.82);
 for(let y=low;y<bounds.top+bounds.height;y++)for(let x=bounds.left;x<bounds.left+bounds.width;x++)if(frame.data[(y*frame.width+x)*4+3]>128)xs.push(x);
 assert.ok(xs.length,'No native foot/contact pixels for import anchor');xs.sort((a,b)=>a-b);return xs[Math.floor(xs.length/2)];
}
async function segmentedSource(source){
 const bytes=await read(source.archivedPath);assert.equal(hash(bytes),source.sha256,source.archivedPath);
 assert.equal((await read(source.promptFile)).toString().trimEnd(),source.prompt.trimEnd(),'Prompt differs from actual archived tool argument');
 const meta=await sharp(bytes).metadata();const halves=source.columns===8?[0,1]:[0];const groups=[];
 if(source.importRegionsFile||source.frameRects||source.frameRegions){let regionSource=source;if(source.importRegionsFile){const regionBytes=await read(source.importRegionsFile);assert.equal(hash(regionBytes),source.importRegionsSha256,'Native import boundaries changed');regionSource={...source,frameRegions:JSON.parse(regionBytes).sequences};}const group=regionSource.frameRegions?await importNativeRegions(bytes,regionSource):await importNativeRectangles(bytes,source);for(const row of group.rows)for(const frame of row.frames){frame.bounds=visibleBounds(frame);frame.centerX=feetAnchor(frame,frame.bounds,source.anchorMode);}return{source,groups:[group],width:meta.width,height:meta.height};}
 for(const half of halves){
  const globalLeft=source.columns===8?half*Math.floor(meta.width/2):0;
  const width=source.columns===8?(half===0?Math.floor(meta.width/2):meta.width-Math.floor(meta.width/2)):meta.width;
  const raw=await sharp(bytes).extract({left:globalLeft,top:0,width,height:meta.height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=width,right=-1;for(let y=0;y<meta.height;y++)for(let x=0;x<width;x++)if(raw.data[(y*width+x)*4+3]>24){left=Math.min(left,x);right=Math.max(right,x);}
  assert.ok(right>=left,'No visible native body in source half');
  const cropLeft=Math.max(0,left-6),cropRight=Math.min(width,right+7);
  const input=await sharp(raw.data,{raw:raw.info}).extract({left:cropLeft,top:0,width:cropRight-cropLeft,height:meta.height}).png().toBuffer();
  const atlas=await segmentAtlas(input,source.rows);
  for(const row of atlas.rows)for(const frame of row.frames){frame.bounds=visibleBounds(frame);frame.centerX=feetAnchor(frame,frame.bounds,source.anchorMode);}
  groups.push({half,cropLeft,globalLeft,...atlas});
 }
 return{source,groups,width:meta.width,height:meta.height};
}
export async function normalizePartARecord(record,kind){
 const names=kind==='native'?PHASES:STATES,selections=record[kind+'Selections'];assert.equal(selections.length,names.length);
 const sources=await Promise.all(record.sources.map(segmentedSource));
 const select=selection=>{const source=sources[selection.source],group=source.groups[selection.half||0],row=group.rows[selection.row];assert.ok(row);assert.equal(row.seamReview.crossedVisiblePixels,0,'Visible source crossed by a column seam');return {selection,source,group,row};};
 const selected=selections.map(select),allSelected=[...record.nativeSelections,...record.baseSelections].map(select);
 const fitScales=sources.map((source,index)=>{
  const selectedRows=allSelected.filter(x=>x.selection.source===index);if(!selectedRows.length)return Infinity;
  let fit=Infinity;
  for(const {row}of selectedRows)for(const frame of row.frames){const b=frame.bounds,half=Math.max(frame.centerX-b.left,b.left+b.width-frame.centerX);fit=Math.min(fit,232/(half*2),232/b.height);}
  assert.ok(source.source.bodyHeight>0,'Measured standing-body height missing');
  return fit;
 });
 // Every source for this hero shares the same final standing-body calibration,
 // including correction strips and base16. Weapon reach can limit cell fit;
 // that limit must never make the next source's body suddenly grow.
 const effectiveBodyHeight=Math.min(record.targetBodyHeight,...sources.map((source,index)=>fitScales[index]*source.source.bodyHeight));
 const scales=sources.map(source=>effectiveBodyHeight/source.source.bodyHeight);
 const composites=[],rows=[];
 for(const [rowIndex,{selection,source,row}]of selected.entries()){
  const scale=scales[selection.source],bounds=[],hashes=[];
  for(const[col,frame]of row.frames.entries()){
   const b=frame.bounds;assert.ok(b.top>0||selection.allowTopContact,record.heroId+'/'+kind+'/'+names[rowIndex]+'/'+col+': retained cell touches source upper cut');
   assert.ok(b.top+b.height<frame.height||selection.allowBottomContact,record.heroId+'/'+kind+'/'+names[rowIndex]+'/'+col+': retained cell touches source lower cut');
   const width=Math.max(1,Math.round(b.width*scale)),height=Math.max(1,Math.round(b.height*scale));
   const left=Math.round(128+(b.left-frame.centerX)*scale),top=244-height;
   assert.ok(left>=10&&top>=10&&left+width<=246&&top+height<=246,'Packing would clip a native body');
   const input=await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}}).extract({left:b.left,top:b.top,width:b.width,height:b.height}).resize(width,height,{kernel:sharp.kernel.nearest}).png().toBuffer();
   composites.push({input,left:col*256+left,top:rowIndex*256+top});bounds.push({source:{...b,left:b.left+(frame.sourceOrigin?.left||0),top:b.top+(frame.sourceOrigin?.top??row.sourceBounds.top)},output:{left,top,width,height}});hashes.push(hash(input));
  }
  assert.equal(new Set(hashes).size,4,names[rowIndex]+': duplicate native poses');
  rows.push({[kind==='native'?'phase':'state']:names[rowIndex],row:rowIndex,sourceImage:source.source.archivedPath,sourceImageSha256:source.source.sha256,sourceHalf:row.nativeRegionImport?null:selection.half||0,sourceGroupCropLeft:sources[selection.source].groups[selection.half||0].cropLeft,nativeRegions:row.nativeRegionImport?row.frames.map(f=>({sourceBounds:{left:f.sourceRegion.left,top:f.sourceRegion.top,width:f.sourceRegion.width,height:f.sourceRegion.height},physicalRow:f.sourceRegion.physicalRow,physicalColumn:f.sourceRegion.physicalColumn,boundarySha256s:Object.fromEntries(['upper','lower','leftSeam','rightSeam'].filter(k=>f.sourceRegion[k]).map(k=>[k,f.sourceRegion[k].sha256])),retainedPixelCount:f.retainedPixelCount,originalRgbaComparisonPassed:f.originalRgbaComparisonPassed})):null,sourceSequenceIndex:selection.row,sourceRow:row.nativeRegionImport?row.frames[0].sourceRegion.physicalRow:selection.row,sourceBounds:row.sourceBounds,scale,baseline:244,frameBounds:bounds,...row.seamReview,renderScale:record.targetBodyHeight/effectiveBodyHeight,statureReview:{measurementKind:'shared-per-native-source-standing-body-calibration',targetBodyHeight:record.targetBodyHeight,sourceBodyHeight:source.source.bodyHeight,normalizedBodyHeight:source.source.bodyHeight*scale,sharedAcrossSource:true,sharedAcrossAllHeroSources:true,excludesWeaponEffects:!!source.source.excludesWeaponEffects,notes:'All poses from this source retain one uniform pixel scale; kneeling and recoil remain naturally shorter. No anatomy or equipment is painted by code.'}});
 }
 const bytes=await sharp({create:{width:1024,height:names.length*256,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(composites).png({compressionLevel:9}).toBuffer();
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,1024);assert.equal(info.height,names.length*256);
 const reviews=[],all=[];
 for(const[r,name]of names.entries()){
  const hashes=[];for(let c=0;c<4;c++){const cell=Buffer.alloc(256*256*4);let visible=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++){const o=((r*256+y)*1024+c*256+x)*4,a=data[o+3];if(a>0)data.copy(cell,(y*256+x)*4,o,o+4);if(a>4)visible++;if(x<10||y<10||x>=246||y>=246)assert.equal(a,0,'Nontransparent final safety border');}assert.ok(visible>300);hashes.push(hash(cell));}assert.equal(new Set(hashes).size,4);all.push(...hashes);reviews.push({[kind==='native'?'phase':'state']:name,distinctFrames:4,frameHashes:hashes});
 }
 assert.equal(new Set(all).size,names.length*4,'Same drawing repeated between phases/states');
 const first=record.sources[0],base=kind==='base',sheet='/sprites/generated/combat-character-'+(base?'corrections':'animations')+'-wave14-part-a/'+record.heroId+'.png';
 const entry={id:record.heroId,heroId:record.heroId,universe:record.universe,name:record.name,sheet,width:1024,height:names.length*256,columns:4,rows:names.length,frameWidth:256,frameHeight:256,frames:names.length*4,[base?'states':'phases']:Object.fromEntries(names.map((name,row)=>[name,{row,frames:4,columns:4,fps:base&&name==='run'?10:['super','fatality'].includes(name)?12:8,loop:base&&['idle','run'].includes(name)}])),sha256:hash(bytes),alpha:true,sourceImage:first.archivedPath,sourceImageSha256:first.sha256,sourceDimensions:[sources[0].width,sources[0].height],sourceImages:record.sources.map(s=>({path:s.archivedPath,sha256:s.sha256})),referenceAsset:record.referenceAsset,referenceAssetSha256:record.referenceAssetSha256,archivedReferenceAsset:record.referenceArchive,referenceImage:record.referenceArchive,referenceUse:record.referenceUse,sourceWork:record.sourceWork,sourceReference:record.sourceReference,abilityName:base?record.simpleName:record.superName,abilityEffect:record.effect,characterVersion:record.version,provider:'OpenAI',model:null,generationId:null,jobId:null,normalization:{method:'visible-alpha-roi-detection-native-rgba-extraction-foot-anchor-uniform-source-scale-padding-packing',alphaThresholdForRoiOnly:24,pixelsWithinRoiUnmodifiedBeforeNearestResize:true,nativeFootAnchorPerFrame:true,sharedScalePerSource:true,baseline:244,rows},visualValidation:{identityReviewed:record.reviewed===true,allFramesReviewed:record.reviewed===true,technicalAlphaReviewed:true,fourNativePosesPerRowReviewed:true,distinctCells:names.length*4,[base?'stateReviews':'phaseReviews']:reviews,canonicalVerified:false,canon1to1Verified:false,networkVerified:false,source1to1Verified:false,sourceGameAsset:false,adaptedChoreography:true,fatalityIsExecution:false,notes:record.reviewNotes}};
 return {bytes,entry};
}
export async function buildPartA(kind,{check=false}={}){
 assert.ok(['native','base'].includes(kind));const plan=await json(DOCS+'/part-a/generation-records.json'),entries=[];const expected=(await json(DOCS+'/batch-plan-before.json')).parts.A;assert.equal(new Set(plan.records.map(r=>r.heroId)).size,plan.records.length);for(const record of plan.records)assert.ok(expected.includes(record.heroId),'Outside batch');assert.deepEqual([...plan.records.map(r=>r.heroId),...(plan.remainingHeroIds||[]),...(plan.blockedHeroIds||[])].sort(),[...expected].sort(),'Every selected identity must be delivered, pending or explicitly blocked');
 for(const record of plan.records){assert.equal(record.reviewed,true,record.heroId+': review remains pending');assert.equal(hash(await read(record.referenceArchive)),record.referenceAssetSha256);const{bytes,entry}=await normalizePartARecord(record,kind);entries.push(entry);if(check)assert.equal(hash(await read('public'+entry.sheet)),entry.sha256);else{await fs.mkdir(path.dirname(file('public'+entry.sheet)),{recursive:true});await fs.writeFile(file('public'+entry.sheet),bytes);await fs.mkdir(file(DOCS+'/part-a/contacts'),{recursive:true});await sharp(bytes).resize(512,entry.rows*128,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toFile(file(DOCS+'/part-a/contacts/'+record.heroId+'-'+kind+'.png'));}}
 const registry={schemaVersion:1,source:'OpenAI',entries},registryPath='src/game/combat/'+(kind==='base'?'characterSpriteCorrections':'characterAnimations')+'Wave14PartA.generated.json';
 const provenance={schemaVersion:1,date:'2026-10-25',part:'A',kind,provider:'OpenAI',tool:'image_gen',source1to1Verified:false,method:'Native generated pixels only. Alpha>24 locates source import rectangles; all original RGBA values within those rectangles are preserved before nearest resize. Transparent margins outside rectangles are excluded, not repainted. Per-frame native foot anchor, one uniform standing-body scale per source, transparent padding and packing. No threshold is used to alter retained alpha values. Incomplete or contaminated drawings excluded.',generationRecords:DOCS+'/part-a/generation-records.json',records:plan.records,remainingHeroIds:plan.remainingHeroIds||[],blockedHeroIds:plan.blockedHeroIds||[],entries};
 const provPath=DOCS+'/part-a/'+(kind==='base'?'base':'native')+'-provenance.json';if(check){assert.deepEqual(await json(registryPath),registry);assert.deepEqual(await json(provPath),provenance);}else{await writeJson(registryPath,registry);await writeJson(provPath,provenance);}return{part:'A',kind,heroes:entries.length,poses:entries.length*entries[0]?.frames,check,source1to1Verified:false};
}
