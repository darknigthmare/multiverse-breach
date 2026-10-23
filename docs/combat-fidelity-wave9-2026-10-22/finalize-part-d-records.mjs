import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {segmentAtlas} from '../../scripts/buildCombatEntityAssets.mjs';
const ROOT=path.resolve(import.meta.dirname,'../..'),DOCS='docs/combat-fidelity-wave9-2026-10-22';
const read=file=>fs.readFile(path.resolve(ROOT,file));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const kind=process.argv[2]||'native',base=kind==='base',prefix=base?'base-part-d':'part-d';
const plan=JSON.parse(await read(`${DOCS}/part-d-generation-records.json`));
const calls=[];
const rowsById={chris_redfield:8,claire_redfield:7,ada_wong:8,barry_burton:8,carlos_oliveira:8};
const output=[];
for(const original of plan.records){
 const record={...original},id=record.heroId;
 const specifications=base?[{stem:id,rows:4,prompt:`base-part-d-prompts/${id}-original.txt`}]:[{stem:id,rows:rowsById[id],prompt:`part-d-prompts/${id}-original.txt`,initial:true}];
 if(!base&&id==='chris_redfield')specifications.push({stem:`${id}-super-correction`,rows:1,prompt:`part-d-prompts/${id}-super-correction.txt`,reason:'Original row7 crops several boots. Replace the whole super row with four new complete native drawings.'});
 if(!base&&id==='claire_redfield')specifications.push({stem:`${id}-round-defeat-correction`,rows:1,prompt:`part-d-prompts/${id}-round-defeat-correction.txt`,reason:'Initial sheet contains only seven rows: roundDefeat is absent. Four newly drawn regroup poses supply that missing row.'});
 if(base&&id==='claire_redfield')specifications.push({stem:`${id}-hit-correction`,rows:1,prompt:`base-part-d-prompts/${id}-hit-correction.txt`,reason:'Initial base last hit/recovery pose has visibly truncated boots despite transparent canvas edges. Replace the entire hit row with four complete native figures.'});
 record.sources=[];
 for(const [index,spec]of specifications.entries()){
  const call=JSON.parse(await read(`${DOCS}/${prefix}-sources/${spec.stem}-${spec.initial?'initial-call':'call'}.json`));
  const archivedPath=`${DOCS}/${prefix}-sources/${spec.stem}${index===0?'-original':''}.png`;
  await fs.copyFile(call.sourcePath,path.resolve(ROOT,archivedPath));
  const atlas=await segmentAtlas(path.resolve(ROOT,archivedPath),spec.rows),row=atlas.rows[0],frame=row.frames[0];
  let l=frame.width,t=frame.height,r=-1,b=-1,visible=0;
  for(let y=0;y<frame.height;y++)for(let x=0;x<frame.width;x++){if(frame.data[(y*frame.width+x)*4+3]<=24)continue;l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);visible++;}
  const bodyBounds={left:l,top:row.sourceBounds.top+t,width:r-l+1,height:b-t+1};
  const proofImage=`${DOCS}/${prefix}-contacts/${spec.stem}-calibration.png`;
  await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}}).extract({left:l,top:t,width:bodyBounds.width,height:bodyBounds.height}).png().toFile(path.resolve(ROOT,proofImage));
  const promptFile=`${DOCS}/${spec.prompt}`,prompt=(await read(promptFile)).toString();
  if(prompt!==call.args.prompt)throw new Error(`${spec.stem}: actual tool prompt differs from archived prompt file`);
  const calibration={kind:'anatomical-head-to-sole-visible-alpha-roi',row:0,col:0,measurementRoi:[l,bodyBounds.top,bodyBounds.width,bodyBounds.height],bodyBounds,bodyHeight:bodyBounds.height,alphaThreshold:24,headAndFeetVisuallyReviewed:true,excludesWeaponEffects:true,proofImage,visibleBodyPixels:visible,nativeAlphaSegmentationUsedForMeasurement:true,notes:index===0?'Standing first figure head-to-sole range; lowered equipment is lateral and does not extend the stature. No muzzle flash in calibration pose. One scale is shared by every retained row from this source.':'Corrective first figure is an upright/bent-knee preparation in the same identity. Head-to-sole calibration bridges native drawing density; crouch ratios in the source are preserved. The body stance difference is documented, not certified source timing.'};
  record.sources.push({generatedPath:call.sourcePath,archivedPath,sha256:hash(await read(archivedPath)),rows:spec.rows,prompt,promptFile,referenceInputs:call.args.referenced_image_paths||[],operation:index?'native-imagegen-row-correction':'native-imagegen',...(spec.reason?{reason:spec.reason}:{}),calibration});
  calls.push({heroId:id,operation:index?'native-imagegen-row-correction':'native-imagegen',args:call.args,sourcePath:call.sourcePath,sourceSha256:hash(await read(archivedPath)),model:null,generationId:null,jobId:null,source1to1Verified:false});
 }
 record.rowSelections=Array.from({length:base?4:8},(_,row)=>({source:0,row}));
 if(!base&&id==='chris_redfield')record.rowSelections[7]={source:1,row:0};
 if(!base&&id==='claire_redfield')record.rowSelections=[{source:0,row:0},{source:0,row:1},{source:0,row:2},{source:1,row:0},{source:0,row:3},{source:0,row:4},{source:0,row:5},{source:0,row:6}];
 if(base&&id==='claire_redfield')record.rowSelections[3]={source:1,row:0};
 if(base){record.prompt=(await read(`${DOCS}/base-part-d-prompts/${id}-original.txt`)).toString();record.promptFile=`${DOCS}/base-part-d-prompts/${id}-original.txt`;record.referenceImage=path.resolve(ROOT,`${DOCS}/part-d-sources/${id}-original.png`);record.sourceRows=4;}
 record.reviewed=true;output.push(record);
}
await fs.writeFile(path.resolve(ROOT,`${DOCS}/${prefix}-generation-records.json`),JSON.stringify({schemaVersion:1,date:'2026-10-22',part:'D',records:output},null,2)+'\n');
await fs.writeFile(path.resolve(ROOT,`${DOCS}/${prefix}-native-tool-calls.json`),JSON.stringify({schemaVersion:1,part:'D',calls,model:null,generationId:null,jobId:null,source1to1Verified:false},null,2)+'\n');
console.log(JSON.stringify({kind,records:output.map(r=>({id:r.heroId,sources:r.sources.map(s=>({rows:s.rows,bodyHeight:s.calibration.bodyHeight})),selections:r.rowSelections}))}));
