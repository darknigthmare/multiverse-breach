import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { segmentAtlas } from '../../scripts/buildCombatEntityAssets.mjs';
import { segmentWithRowCutHints } from './part-d-segmentation.mjs';
const ROOT=path.resolve(import.meta.dirname,'../..'),DOCS='docs/combat-fidelity-wave11-2026-10-23';
const file=p=>path.resolve(ROOT,p),read=p=>fs.readFile(file(p)),hash=b=>createHash('sha256').update(b).digest('hex');
const base=process.argv[2]==='base',prefix=base?'base-part-d':'part-d',records=[],calls=[];
const initial=JSON.parse(await read(`${DOCS}/initial-${prefix}-generation-records.json`));
for(const original of initial.records){
  const record={...original},id=record.heroId;
  const specs=[{stem:`${id}-initial`,rows:base?4:id==='perceval_kaamelott'?7:8,promptFile:record.promptFile,archiveStem:`${id}-original`,operation:'native-imagegen'}];
  if(!base&&id==='korben'){
    Object.assign(specs[0],{rowCutHints:[224,442,657,835,1041,1267,1320],allowEmptyRows:[6],nativeDrawingsObserved:30,missingSourceCells:[{row:6,col:0},{row:6,col:1}]});
    specs.push({stem:'korben-victory-defeat-correction',rows:2,promptFile:`${DOCS}/part-d-prompts/korben-victory-defeat-correction.txt`,archiveStem:'korben-victory-defeat-correction',operation:'native-imagegen-row-correction',reason:'Original source has30drawings: two match-defeat cells are empty, and the other two overlap the victory region. Replace victory/defeat with eight complete native drawings; never count the two missing cells as poses.'});
  }
  if(!base&&id==='perceval_kaamelott')specs.push({stem:'perceval_kaamelott-finale-correction',rows:1,promptFile:`${DOCS}/part-d-prompts/perceval_kaamelott-finale-correction.txt`,archiveStem:'perceval_kaamelott-finale-correction',operation:'native-imagegen-row-correction',reason:'Original source has seven complete rows,28drawings; the adapted guard finale is absent. Four new native guard-support drawings supply only that missing phase.'});
  record.sources=[];
  for(const spec of specs){
    const callRecordFile=`${DOCS}/${prefix}-sources/${spec.stem}-call.json`,call=JSON.parse(await read(callRecordFile));
    assert.ok(!call.error&&call.sourcePath,`${id}: no accepted source or explicit refusal`);
    const archivedPath=`${DOCS}/${prefix}-sources/${spec.archiveStem}.png`;await fs.copyFile(call.sourcePath,file(archivedPath));
    const guessed=spec.rowCutHints?null:await segmentAtlas(file(archivedPath),spec.rows);
    const atlas=await segmentWithRowCutHints(file(archivedPath),spec.rows,spec.rowCutHints||guessed.rowValleys,{allowEmptyRows:spec.allowEmptyRows||[]}),row=atlas.rows[0],frame=row.frames[0];
    assert.ok(frame.bounds,`${id}: source calibration must use a real body`);
    let left=frame.width,top=frame.height,right=-1,bottom=-1,visible=0;
    for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++)if(frame.data[(y*frame.width+x)*4+3]>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);visible++;}
    const bodyBounds={left,top:row.sourceBounds.top+top,width:right-left+1,height:bottom-top+1},proofImage=`${DOCS}/${prefix}-contacts/${spec.archiveStem}-calibration.png`;
    await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}}).extract({left,top,width:bodyBounds.width,height:bodyBounds.height}).png().toFile(file(proofImage));
    const prompt=(await read(spec.promptFile)).toString();assert.equal(call.args.prompt,prompt,`${id}: exact prompt changed`);
    const calibration={kind:'anatomical-head-to-sole-visible-alpha-roi',row:0,col:0,measurementRoi:[left,bodyBounds.top,bodyBounds.width,bodyBounds.height],bodyBounds,bodyHeight:bodyBounds.height,alphaThreshold:24,headAndFeetVisuallyReviewed:true,excludesWeaponEffects:true,proofImage,visibleBodyPixels:visible,nativeAlphaSegmentationUsedForMeasurement:true,notes:'Measured standing/preparation figure, head to full soles. Lateral held equipment does not set stature. One pixel scale per source retains natural crouch/kneel/lunge projections.'};
    record.sources.push({generatedPath:call.sourcePath,archivedPath,sha256:hash(await read(archivedPath)),rows:spec.rows,...(spec.rowCutHints?{rowCutHints:spec.rowCutHints}:{}),...(spec.allowEmptyRows?{allowEmptyRows:spec.allowEmptyRows}:{}),nativeDrawingsObserved:spec.nativeDrawingsObserved??spec.rows*4,missingSourceCells:spec.missingSourceCells||[],prompt,promptFile:spec.promptFile,referenceInputs:call.args.referenced_image_paths||[],operation:spec.operation,...(spec.reason?{reason:spec.reason}:{}),callRecordFile,returnFormat:call.returnFormat||'workspace-path',calibration});
    calls.push({heroId:id,args:call.args,callRecordFile,sourcePath:call.sourcePath,sourceSha256:hash(await read(archivedPath)),model:null,generationId:null,jobId:null,source1to1Verified:false});
  }
  record.rowSelections=Array.from({length:base?4:8},(_,row)=>({source:0,row}));
  if(!base&&id==='korben'){record.rowSelections[5]={source:1,row:0};record.rowSelections[6]={source:1,row:1};}
  if(!base&&id==='perceval_kaamelott')record.rowSelections=[0,1,2,3].map(row=>({source:0,row})).concat([{source:1,row:0},{source:0,row:4},{source:0,row:5},{source:0,row:6}]);
  record.reviewed=true;records.push(record);
}
await fs.writeFile(file(`${DOCS}/${prefix}-generation-records.json`),JSON.stringify({schemaVersion:1,date:'2026-10-23',part:'D',records},null,2)+'\n');
await fs.writeFile(file(`${DOCS}/${prefix}-native-tool-calls.json`),JSON.stringify({schemaVersion:1,part:'D',calls,model:null,generationId:null,jobId:null,source1to1Verified:false},null,2)+'\n');
console.log(JSON.stringify({kind:base?'base':'native',heroes:records.length,sources:records.reduce((n,r)=>n+r.sources.length,0),retainedPoses:records.reduce((n,r)=>n+r.rowSelections.length*4,0)}));
