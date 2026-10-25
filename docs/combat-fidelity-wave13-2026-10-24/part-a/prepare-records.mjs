import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {locateNativeRegions,importNativeRegions} from './source-regions.mjs';
import {normalizePartARecord} from './builder.mjs';
import {ABILITIES_WAVE13_DEFINITIONS as ABILITIES} from '../../../src/game/combat/abilities/abilitiesWave13Definitions.js';

const ROOT=path.resolve(import.meta.dirname,'../../..'),DOCS='docs/combat-fidelity-wave13-2026-10-24',DIR=DOCS+'/part-a';
const file=p=>path.resolve(ROOT,p),read=p=>fs.readFile(file(p)),json=async p=>JSON.parse(await read(p));
const hash=b=>createHash('sha256').update(b).digest('hex'),write=async(p,v)=>fs.writeFile(file(p),JSON.stringify(v,null,2)+'\n');
const PHASES=['intro','outro','roundVictory','roundDefeat','fatality','victory','defeat','super'];
const bodyBounds=frame=>{
 let left=frame.width,top=frame.height,right=-1,bottom=-1,pixels=0;
 for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);pixels++;}
 assert.ok(pixels);return{left:left+frame.sourceOrigin.left,top:top+frame.sourceOrigin.top,width:right-left+1,height:bottom-top+1,pixels};
};
const exists=p=>fs.access(file(p)).then(()=>true,()=>false);
const plan=await json(DOCS+'/batch-plan-before.json'),attempts=(await json(DIR+'/generation-attempts.json')).attempts;
const prior=await json(DIR+'/generation-records.json').catch(()=>({records:[]}));
const approved=new Set(process.argv.filter(a=>a.startsWith('--approve=')).flatMap(a=>a.slice(10).split(',')));
const records=[],results=[],targetHeights={atlas:140,pbody:190,glados:170,wheatley:95,nanny_ogg_dw:165,twoflower_dw:180,death_dw:210};
await fs.mkdir(file(DIR+'/references'),{recursive:true});await fs.mkdir(file(DIR+'/review'),{recursive:true});

async function sourceRecord(attempt,heroId) {
 const regionFile=DIR+'/sources/'+attempt.key+'-region-review.json';
 if(process.argv.includes('--refresh-regions')||!await exists(regionFile)) {
  const report=await locateNativeRegions(file(attempt.archivedPath),{rows:attempt.key==='parker_correction8'?2:6,columns:['ripley_correction24','parker_correction8'].includes(attempt.key)?4:8});
  report.sourceImage=attempt.archivedPath;report.sourceImageSha256=hash(await read(attempt.archivedPath));report.harness=DIR+'/source-regions.mjs';report.harnessSha256=hash(await read(report.harness));
  await write(regionFile,report);
 }
 const regionBytes=await read(regionFile),review=JSON.parse(regionBytes),bytes=await read(attempt.archivedPath);
 const imported=await importNativeRegions(bytes,{frameRegions:review.sequences});
 const calibrationRow=attempt.key==='ripley_correction24'?2:attempt.key==='parker_correction8'?0:heroId==='ripley'?0:8;
 const bounds=imported.rows[calibrationRow].frames.map(bodyBounds),frameIndex=bounds.findIndex(b=>b.height===Math.max(...bounds.map(b=>b.height)));
 const calibration={measurementKind:'visible-native-body-import-bounds',sequence:calibrationRow,column:frameIndex,bodyBounds:bounds[frameIndex],notes:'One shared scale per source. Alpha>24 locates import bounds only; retained RGBA samples are never recolored or alpha-thresholded.'};
 let calibratedHeight=bounds[frameIndex].height;
 if(heroId==='death_dw'){calibratedHeight=129;calibration.measurementKind='manually-reviewed-hood-crown-to-lowest-foot';calibration.fullSubjectBounds=bounds[frameIndex];calibration.bodyBounds={left:42,top:712,width:98,height:129};calibration.hoodCrownNativePoint={x:95,y:712};calibration.lowestFootY=840;calibration.notes='Visible hood crown at(95,712) and lowest native foot atY840 on idle0. The scythe blade and upper wooden shaft above the hood are excluded from standing-body stature. All source poses retain the resulting single scale.';}
 return{archivedPath:attempt.archivedPath,sha256:hash(bytes),generatedPath:attempt.generatedPath,prompt:attempt.prompt,promptFile:attempt.promptFile,rows:review.rows,columns:review.columns,bodyHeight:calibratedHeight,excludesWeaponEffects:true,referenceInputs:attempt.referenceInputs,nativeDrawingsObserved:review.sourceBodiesObserved,nativeDrawingsRetainedByImport:review.retainedDrawings,importRegionsFile:regionFile,importRegionsSha256:hash(regionBytes),anchorMode:['glados','wheatley'].includes(heroId)?'body-center':'native-foot-median',calibration};
}

for(const selected of plan.heroes.filter(h=>h.part==='A')) {
 const id=selected.hero.id,attempt=attempts.find(a=>a.key===id&&a.kind==='original');
 if(!attempt){results.push({heroId:id,status:'not-generated'});continue;}
 try {
  const sources=[await sourceRecord(attempt,id)],nativeSelections=PHASES.map((_,row)=>({source:0,row})),baseSelections=Array.from({length:4},(_,i)=>({source:0,row:8+i}));
  if(id==='ripley') {
   const corrected=attempts.find(a=>a.key==='ripley_correction24');assert.ok(corrected,'Ripley edge corrections remain pending');sources.push(await sourceRecord(corrected,id));
   nativeSelections[0]={source:1,row:0};nativeSelections[1]={source:1,row:1};
   baseSelections.forEach((_,i)=>{baseSelections[i]={source:1,row:2+i};});
  }
  if(id==='parker_alien'){const corrected=attempts.find(a=>a.key==='parker_correction8');assert.ok(corrected,'Parker base lower-edge corrections remain pending');sources.push(await sourceRecord(corrected,id));baseSelections[2]={source:1,row:0};baseSelections[3]={source:1,row:1};}
  const referenceArchive=DIR+'/references/'+id+'-historical.png';const referenceBytes=await read('public'+selected.referenceAsset);
  assert.equal(hash(referenceBytes),selected.referenceSha256);if(!await exists(referenceArchive))await fs.writeFile(file(referenceArchive),referenceBytes);
  const previous=prior.records.find(r=>r.heroId===id),reviewed=approved.has(id)||previous?.reviewed===true;
  const record={heroId:id,name:selected.hero.name,universe:selected.hero.universe,sourceWork:selected.source.sourceWork,sourceReference:selected.source.sourceReference,version:selected.source.appearance,referenceAsset:selected.referenceAsset,referenceAssetSha256:selected.referenceSha256,referenceArchive,referenceUse:'Historical image is archived and visually inspected for comparison only. Generated text fixes the selected original version; defective old equipment is not treated as a source of truth.',targetBodyHeight:targetHeights[id]||190,simpleName:ABILITIES[id].simple.name,superName:selected.source.name,effect:selected.source.effect,reviewed,reviewNotes:'Generated adaptation. Every retained body must be complete, individually isolated and coherent with the selected source. Supports have ordinary nonoffensive gestures. Native pixels are imported through transparent seams; no body, equipment or alpha is repainted by code. No source1:1 certification.',sources,nativeSelections,baseSelections};
  const [native,base]=await Promise.all([normalizePartARecord(record,'native'),normalizePartARecord(record,'base')]);
  for(const[kind,result]of[['native',native],['base',base]]) {
   await fs.writeFile(file(DIR+'/review/'+id+'-'+kind+'.png'),result.bytes);
   await sharp(result.bytes).resize(512,result.entry.rows*128,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toFile(file(DIR+'/review/'+id+'-'+kind+'-contact.png'));
  }
  records.push(record);results.push({heroId:id,status:'technical-pass',visualReview:reviewed?'reviewed':'pending',nativePoses:32,basePoses:16,nativeSha256:native.entry.sha256,baseSha256:base.entry.sha256,standingBodyHeight:record.targetBodyHeight,bodyScales:native.entry.normalization.rows.map(r=>r.scale)});
 }catch(error){results.push({heroId:id,status:'rejected-import',error:String(error)});}
}
const remainingHeroIds=plan.parts.A.filter(id=>!records.some(record=>record.heroId===id));
await write(DIR+'/generation-records.json',{schemaVersion:1,part:'A',wave:13,records,remainingHeroIds,blockedHeroIds:[]});
await write(DIR+'/technical-import-review.json',{schemaVersion:1,preliminary:true,source1to1Verified:false,method:'Measured native import seams. Exact source RGBA values within retained regions; no image synthesis or alpha editing. No public sprite promoted before visual approval.',results});
console.log(JSON.stringify({acceptedTechnical:records.length,visuallyReviewed:records.filter(r=>r.reviewed).length,remainingHeroIds,results:results.map(r=>({heroId:r.heroId,status:r.status,error:r.error}))},null,2));
