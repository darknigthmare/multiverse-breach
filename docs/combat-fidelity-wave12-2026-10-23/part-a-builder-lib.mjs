import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {segmentAtlas} from '../../scripts/buildCombatEntityAssets.mjs';
const ROOT=path.resolve(import.meta.dirname,'../..');
const DOCS='docs/combat-fidelity-wave12-2026-10-23';
const PHASES=['intro','outro','roundVictory','roundDefeat','fatality','victory','defeat','super'];
const STATES=['idle','run','attack','hit'];
const file=p=>path.resolve(ROOT,p),read=p=>fs.readFile(file(p)),json=async p=>JSON.parse(await read(p));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const writeJson=(p,v)=>fs.writeFile(file(p),JSON.stringify(v,null,2)+'\n');

async function segmentedSource(source){
 const bytes=await read(source.archivedPath);assert.equal(hash(bytes),source.sha256,source.archivedPath);
 assert.equal((await read(source.promptFile)).toString(),source.prompt,'Prompt differs from actual archived tool argument');
 const meta=await sharp(bytes).metadata();
 const halves=source.columns===8?[0,1]:[0];const groups=[];
 for(const half of halves){
  const input=source.columns===8?await sharp(bytes).extract({left:half*Math.floor(meta.width/2),top:0,width:half===0?Math.floor(meta.width/2):meta.width-Math.floor(meta.width/2),height:meta.height}).png().toBuffer():bytes;
  const atlas=await segmentAtlas(input,source.rows);
  groups.push({half,...atlas});
 }
 return {source,groups,width:meta.width,height:meta.height};
}
async function normalize(record,kind){
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
   composites.push({input,left:col*256+left,top:rowIndex*256+top});bounds.push({source:{...b,top:b.top+row.sourceBounds.top},output:{left,top,width,height}});hashes.push(hash(input));
  }
  assert.equal(new Set(hashes).size,4,names[rowIndex]+': duplicate native poses');
  rows.push({[kind==='native'?'phase':'state']:names[rowIndex],row:rowIndex,sourceImage:source.source.archivedPath,sourceImageSha256:source.source.sha256,sourceHalf:selection.half||0,sourceRow:selection.row,sourceBounds:row.sourceBounds,scale,baseline:244,frameBounds:bounds,...row.seamReview,renderScale:record.targetBodyHeight/effectiveBodyHeight,statureReview:{measurementKind:'shared-per-native-source-standing-body-calibration',targetBodyHeight:record.targetBodyHeight,sourceBodyHeight:source.source.bodyHeight,normalizedBodyHeight:source.source.bodyHeight*scale,sharedAcrossSource:true,sharedAcrossAllHeroSources:true,excludesWeaponEffects:!!source.source.excludesWeaponEffects,notes:'All poses from this source retain one uniform pixel scale; kneeling and recoil remain naturally shorter. No anatomy or equipment is painted by code.'}});
 }
 const bytes=await sharp({create:{width:1024,height:names.length*256,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(composites).png({compressionLevel:9}).toBuffer();
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,1024);assert.equal(info.height,names.length*256);
 const reviews=[],all=[];
 for(const[r,name]of names.entries()){
  const hashes=[];for(let c=0;c<4;c++){const cell=Buffer.alloc(256*256*4);let visible=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++){const o=((r*256+y)*1024+c*256+x)*4,a=data[o+3];if(a>0)data.copy(cell,(y*256+x)*4,o,o+4);if(a>4)visible++;if(x<10||y<10||x>=246||y>=246)assert.equal(a,0,'Nontransparent final safety border');}assert.ok(visible>300);hashes.push(hash(cell));}assert.equal(new Set(hashes).size,4);all.push(...hashes);reviews.push({[kind==='native'?'phase':'state']:name,distinctFrames:4,frameHashes:hashes});
 }
 assert.equal(new Set(all).size,names.length*4,'Same drawing repeated between phases/states');
 const first=record.sources[0],base=kind==='base',sheet='/sprites/generated/combat-character-'+(base?'corrections':'animations')+'-wave12-part-a/'+record.heroId+'.png';
 const entry={id:record.heroId,heroId:record.heroId,universe:record.universe,name:record.name,sheet,width:1024,height:names.length*256,columns:4,rows:names.length,frameWidth:256,frameHeight:256,frames:names.length*4,[base?'states':'phases']:Object.fromEntries(names.map((name,row)=>[name,{row,frames:4,columns:4,fps:base&&name==='run'?10:['super','fatality'].includes(name)?12:8,loop:base&&['idle','run'].includes(name)}])),sha256:hash(bytes),alpha:true,sourceImage:first.archivedPath,sourceImageSha256:first.sha256,sourceDimensions:[sources[0].width,sources[0].height],sourceImages:record.sources.map(s=>({path:s.archivedPath,sha256:s.sha256})),referenceAsset:record.referenceAsset,referenceAssetSha256:record.referenceAssetSha256,archivedReferenceAsset:record.referenceArchive,referenceImage:record.referenceArchive,referenceUse:record.referenceUse,sourceWork:record.sourceWork,sourceReference:record.sourceReference,abilityName:base?record.simpleName:record.superName,abilityEffect:record.effect,characterVersion:record.version,provider:'OpenAI',model:null,generationId:null,jobId:null,normalization:{method:'native-alpha-segmentation-uniform-source-scale-padding-packing',sharedScalePerSource:true,baseline:244,rows},visualValidation:{identityReviewed:record.reviewed===true,allFramesReviewed:record.reviewed===true,technicalAlphaReviewed:true,fourNativePosesPerRowReviewed:true,distinctCells:names.length*4,[base?'stateReviews':'phaseReviews']:reviews,canonicalVerified:false,canon1to1Verified:false,networkVerified:false,source1to1Verified:false,sourceGameAsset:false,adaptedChoreography:true,fatalityIsExecution:false,notes:record.reviewNotes}};
 return {bytes,entry};
}
export async function buildPartA(kind,{check=false}={}){
 assert.ok(['native','base'].includes(kind));const plan=await json(DOCS+'/part-a-generation-records.json'),entries=[];const expected=(await json(DOCS+'/batch-plan-before.json')).parts.A;assert.deepEqual(plan.records.map(r=>r.heroId),expected);
 for(const record of plan.records){assert.equal(record.reviewed,true,record.heroId+': review remains pending');assert.equal(hash(await read(record.referenceArchive)),record.referenceAssetSha256);const{bytes,entry}=await normalize(record,kind);entries.push(entry);if(check)assert.equal(hash(await read('public'+entry.sheet)),entry.sha256);else{await fs.mkdir(path.dirname(file('public'+entry.sheet)),{recursive:true});await fs.writeFile(file('public'+entry.sheet),bytes);await fs.mkdir(file(DOCS+'/part-a-contacts'),{recursive:true});await sharp(bytes).resize(512,entry.rows*128,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toFile(file(DOCS+'/part-a-contacts/'+record.heroId+'-'+kind+'.png'));}}
 const registry={schemaVersion:1,source:'OpenAI',entries},registryPath='src/game/combat/'+(kind==='base'?'characterSpriteCorrections':'characterAnimations')+'Wave12PartA.generated.json';
 const provenance={schemaVersion:1,date:'2026-10-23',part:'A',kind,provider:'OpenAI',tool:'image_gen',source1to1Verified:false,method:'Native generated pixels only; technical alpha segmentation, one uniform standing-body scale per source, padding and packing. Retained cells must be complete and distinct; rejected or cut cells excluded.',generationRecords:DOCS+'/part-a-generation-records.json',records:plan.records,entries};
 const provPath=DOCS+'/'+(kind==='base'?'base-part-a':'part-a')+'-provenance.json';if(check){assert.deepEqual(await json(registryPath),registry);assert.deepEqual(await json(provPath),provenance);}else{await writeJson(registryPath,registry);await writeJson(provPath,provenance);}return{part:'A',kind,heroes:entries.length,poses:entries.length*entries[0]?.frames,check,source1to1Verified:false};
}
