import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {segmentAtlas} from '../../scripts/buildCombatEntityAssets.mjs';
import {segmentWithRowCutHints} from './part-d-segmentation.mjs';
const ROOT=path.resolve(import.meta.dirname,'../..'),DOCS='docs/combat-fidelity-wave10-2026-10-23';
const read=file=>fs.readFile(path.resolve(ROOT,file)),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const kind=process.argv[2]||'native',base=kind==='base',prefix=base?'base-part-d':'part-d';
const input=JSON.parse(await read(`${DOCS}/initial-${prefix}-generation-records.json`));
const initialCalls={venkman_gb:'initial-call',stantz_gb:'technical-retry-call',zeddemore_gb:'initial-call',spengler_gb:'initial-call',janine_gb:'initial-call',bill_l4d:'initial-call',ellis_l4d:'initial-call',coach_l4d:'initial-call',rochelle_l4d:'resume-call',nick_l4d:'resume-call'};
const phases=['intro','outro','roundVictory','roundDefeat','fatality','victory','defeat','super'];
const records=[],calls=[];
for(const original of input.records){
 const record={...original},id=record.heroId;if(base&&id==='janine_gb')continue;
 const initialStem=!base&&id==='stantz_gb'?`${id}-technical-retry` : id;
 const initialSuffix=!base&&id==='stantz_gb'?'call':base?'resume-call':initialCalls[id];
 const specs=[{stem:initialStem,suffix:initialSuffix,rows:base?4:['coach_l4d','rochelle_l4d'].includes(id)?7:8,promptFile:record.promptFile,archiveStem:`${id}-original`,operation:base?'native-imagegen-technical-resume':'native-imagegen'}];
 if(!base&&['coach_l4d','rochelle_l4d'].includes(id))specs.push({stem:`${id}-defeat-correction`,suffix:'call',rows:1,promptFile:`${DOCS}/part-d-prompts/${id}-defeat-correction.txt`,archiveStem:`${id}-defeat-correction`,operation:'native-imagegen-row-correction',reason:'Initial source has only seven rows: match defeat is missing. Four new native drawings supply that row.'});
 if(base&&id==='spengler_gb')specs.push({stem:`${id}-hit-correction`,suffix:'call',rows:1,promptFile:`${DOCS}/base-part-d-prompts/${id}-hit-correction.txt`,archiveStem:`${id}-hit-correction`,operation:'native-imagegen-row-correction',reason:'Initial base hit row has a final standing figure clipped at ankles. Replace the whole hit row with four complete new native drawings.'});
 if(!base&&id==='venkman_gb'){specs[0].rowCutHints=[224,441,659,844,1051,1260,1392];specs.push({stem:`${id}-bottom-correction`,suffix:'call',rows:2,promptFile:`${DOCS}/part-d-prompts/${id}-bottom-correction.txt`,archiveStem:`${id}-bottom-correction`,operation:'native-imagegen-row-correction',reason:'Original defeat and super rows are compressed, their separator crosses visible art and all four bottom figures are clipped by the source edge. Replace both rows with eight complete native drawings.'});}
 if(!base&&id==='nick_l4d')specs.push({stem:`${id}-super-correction`,suffix:'call',rows:1,promptFile:`${DOCS}/part-d-prompts/${id}-super-correction.txt`,archiveStem:`${id}-super-correction`,operation:'native-imagegen-row-correction',reason:'Original super row touches the lower source canvas on176visible pixels, clipping shoe soles. Replace only that row with four complete new native drawings, with source-wide independent body calibration.'});
 record.sources=[];
 for(const spec of specs){
  const callRecordFile=`${DOCS}/${prefix}-sources/${spec.stem}-${spec.suffix}.json`,call=JSON.parse(await read(callRecordFile));assert.ok(call.sourcePath,`${id}: no accepted native source`);
  const archivedPath=`${DOCS}/${prefix}-sources/${spec.archiveStem}.png`;await fs.copyFile(call.sourcePath,path.resolve(ROOT,archivedPath));
  const atlas=await (spec.rowCutHints?segmentWithRowCutHints(path.resolve(ROOT,archivedPath),spec.rows,spec.rowCutHints):segmentAtlas(path.resolve(ROOT,archivedPath),spec.rows)),row=atlas.rows[0],frame=row.frames[0];let left=frame.width,top=frame.height,right=-1,bottom=-1,visible=0;
  for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);visible++;}
  const bodyBounds={left,top:row.sourceBounds.top+top,width:right-left+1,height:bottom-top+1},proofImage=`${DOCS}/${prefix}-contacts/${spec.archiveStem}-calibration.png`;
  await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}}).extract({left,top,width:bodyBounds.width,height:bodyBounds.height}).png().toFile(path.resolve(ROOT,proofImage));
  const prompt=(await read(spec.promptFile)).toString();assert.equal(call.args.prompt,prompt,`${id}: exact prompt arguments changed`);
  const calibration={kind:'anatomical-head-to-sole-visible-alpha-roi',row:0,col:0,measurementRoi:[left,bodyBounds.top,bodyBounds.width,bodyBounds.height],bodyBounds,bodyHeight:bodyBounds.height,alphaThreshold:24,headAndFeetVisuallyReviewed:true,excludesWeaponEffects:true,proofImage,visibleBodyPixels:visible,nativeAlphaSegmentationUsedForMeasurement:true,notes:'First full standing/preparation figure head-to-sole range. Lowered held equipment is lateral and does not define stature. One source-wide scale; naturally crouched/kneeling/lunging drawings retain their native ratios.'};
  record.sources.push({generatedPath:call.sourcePath,archivedPath,sha256:hash(await read(archivedPath)),rows:spec.rows,...(spec.rowCutHints?{rowCutHints:spec.rowCutHints}:{}),prompt,promptFile:spec.promptFile,referenceInputs:call.args.referenced_image_paths||[],operation:spec.operation,...(spec.reason?{reason:spec.reason}:{}),callRecordFile,recovery:call.recovery||null,returnFormat:call.returnFormat||(call.outputHint?'workspace-path':call.recovery?'recovered-workspace-file':null),calibration});
  calls.push({heroId:id,operation:spec.operation,args:call.args,callRecordFile,sourcePath:call.sourcePath,sourceSha256:hash(await read(archivedPath)),recovery:call.recovery||null,model:null,generationId:null,jobId:null,source1to1Verified:false});
 }
 record.rowSelections=Array.from({length:base?4:8},(_,row)=>({source:0,row}));
 if(!base&&['coach_l4d','rochelle_l4d'].includes(id))record.rowSelections=[0,1,2,3,4,5].map(row=>({source:0,row})).concat([{source:1,row:0},{source:0,row:6}]);
 if(!base&&id==='venkman_gb')record.rowSelections=[0,1,2,3,4,5].map(row=>({source:0,row})).concat([{source:1,row:0},{source:1,row:1}]);
 if(!base&&id==='janine_gb'){
  record.retainedPhases=['intro','outro','roundVictory','roundDefeat','victory','defeat'];record.rowSelections=[0,1,2,3,5,6].map(row=>({source:0,row}));
  record.partialNative={retainedPoses:24,removedPhases:['fatality','super'],removedSourceRows:[4,7],reason:'Two calling poses lack a physically supported telephone base. Native correction was explicitly refused; all further Janine generations stopped. No new base16 or dedicated super/finale is counted.',refusalRecord:`${DOCS}/part-d-sources/janine_gb-phone-correction-refusal.json`,runtimeFallback:'Root maps accepted existing presentation poses to generic support states; not a new native phase or base16.'};
 }
 if(!base&&id==='nick_l4d')record.rowSelections[7]={source:1,row:0};
 if(base&&id==='spengler_gb')record.rowSelections[3]={source:1,row:0};
 record.reviewed=true;record.sourceRows=record.sources[0].rows;record.phases=base?undefined:record.retainedPhases||phases;records.push(record);
}
await fs.writeFile(path.resolve(ROOT,`${DOCS}/${prefix}-generation-records.json`),JSON.stringify({schemaVersion:1,date:'2026-10-23',part:'D',records},null,2)+'\n');
await fs.writeFile(path.resolve(ROOT,`${DOCS}/${prefix}-native-tool-calls.json`),JSON.stringify({schemaVersion:1,part:'D',calls,interruptedInitialBatch:`${DOCS}/part-d-interrupted-jobs.json`,janineRefusal:`${DOCS}/part-d-sources/janine_gb-phone-correction-refusal.json`,model:null,generationId:null,jobId:null,source1to1Verified:false},null,2)+'\n');
console.log(JSON.stringify({kind,heroes:records.length,records:records.map(r=>({id:r.heroId,rows:r.rowSelections.length,sources:r.sources.map(s=>({rows:s.rows,bodyHeight:s.calibration.bodyHeight})),partial:r.partialNative||null}))}));
