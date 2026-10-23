// Technical normalization only. All selected anatomy/props are native image_gen pixels.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const index=process.argv.indexOf('--config');
if(index<0)throw new Error('Explicit reviewed packing plan required: --config');
const configPath=process.argv[index+1],cfg=JSON.parse(await fs.readFile(configPath,'utf8'));
const check=process.argv.includes('--check');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash=async p=>hash(await fs.readFile(p));
if(!['neo','freeman'].includes(cfg.heroId))throw new Error('W10 two-hero scope only');
if(cfg.atlases.length!==6||new Set(cfg.atlases.flatMap(a=>a.states)).size!==45)throw new Error('Six atlases and45 distinct states required');
async function segmentSource(file, expectedRows) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const size = info.width * info.height;
  const labels = new Int32Array(size).fill(-1), queue = new Int32Array(size), components = [];
  for (let start = 0; start < size; start++) {
    if (labels[start] >= 0 || data[start * 4 + 3] < 24) continue;
    const id = components.length;
    let head = 0, tail = 1, x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    queue[0] = start; labels[start] = id;
    while (head < tail) {
      const at = queue[head++], x = at % info.width, y = Math.floor(at / info.width);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
        const next = ny * info.width + nx;
        if (labels[next] < 0 && data[next * 4 + 3] >= 24) { labels[next] = id; queue[tail++] = next; }
      }
    }
    components.push({ id, pixels: tail, x0, y0, x1, y1 });
  }
  // Whole connected bodies are assigned before rows. A horizontal grid cut
  // can otherwise cut a real raised arm, shoe or lowered crouch. No anatomy
  // is reconstructed and no pose is rotated, mirrored or duplicated.
  const bodies = [...components].sort((a, b) => b.pixels - a.pixels).slice(0, expectedRows * 4);
  if (bodies.length !== expectedRows * 4 || bodies.at(-1).pixels < 1000) throw new Error(`Incomplete native source ${file}`);
  bodies.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const ordered = [];
  for (let row = 0; row < expectedRows; row++) ordered.push(...bodies.slice(row * 4, row * 4 + 4).sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1)));
  const bodyFrames = new Map(ordered.map((body, i) => [body.id, i]));
  const owner = components.map(component => {
    if (bodyFrames.has(component.id)) return bodyFrames.get(component.id);
    const cx = (component.x0 + component.x1) / 2, cy = (component.y0 + component.y1) / 2;
    let selected = 0, best = Infinity;
    ordered.forEach((body, i) => {
      const dx = Math.max(body.x0 - cx, 0, cx - body.x1), dy = Math.max(body.y0 - cy, 0, cy - body.y1);
      const distance = dx * dx + dy * dy + 0.01 * ((cx - (body.x0 + body.x1) / 2) ** 2 + (cy - (body.y0 + body.y1) / 2) ** 2);
      if (distance < best) { best = distance; selected = i; }
    });
    return selected;
  });
  const bounds = ordered.map(() => ({ x0: info.width, y0: info.height, x1: -1, y1: -1 }));
  for (const component of components) {
    const target = bounds[owner[component.id]];
    target.x0 = Math.min(target.x0, component.x0); target.y0 = Math.min(target.y0, component.y0);
    target.x1 = Math.max(target.x1, component.x1); target.y1 = Math.max(target.y1, component.y1);
  }
  const buffers = bounds.map(bound => Buffer.alloc((bound.x1 - bound.x0 + 1) * (bound.y1 - bound.y0 + 1) * 4));
  for (let at = 0; at < size; at++) {
    if (labels[at] < 0) continue;
    const frame = owner[labels[at]], bound = bounds[frame];
    const offset = ((Math.floor(at / info.width) - bound.y0) * (bound.x1 - bound.x0 + 1) + at % info.width - bound.x0) * 4;
    data.copy(buffers[frame], offset, at * 4, at * 4 + 4);
  }
  const edgePixels = { top: 0, bottom: 0, left: 0, right: 0 };
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 24) continue;
    if (y === 0) edgePixels.top++;
    if (y === info.height - 1) edgePixels.bottom++;
    if (x === 0) edgePixels.left++;
    if (x === info.width - 1) edgePixels.right++;
  }
  if (Object.values(edgePixels).some(Boolean)) throw new Error(`Native canvas clips a pose: ${file}`);
  return { file, sha256: hash(bytes), width: info.width, height: info.height, edgePixels,
    frames: bounds.map((bound, i) => ({ raw: buffers[i], width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1,
      sourceImage: file, nativeRow: Math.floor(i / 4), nativeColumn: i % 4,
      sourceRect: { x: bound.x0, y: bound.y0, width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1 } })) };
}

const sourceDir=cfg.archiveDir,outputDir=cfg.outputDir,sourceWork=cfg.sourceWork,correction=cfg.correctionId;
const reference={asset:cfg.reference.asset,savedImage:cfg.reference.savedImage,sha256:await fileHash(cfg.reference.savedImage)};
const sourceCache=new Map(),standingBodyHeight=190;
for(const spec of cfg.sources){
 const source=await segmentSource(spec.image,spec.states.length),c=spec.calibration;
 if(c?.reviewed!==true||!c.bodyBounds?.height)throw new Error(`Reviewed anatomical source ROI required: ${spec.id}`);
 const requestedScale=standingBodyHeight/c.bodyBounds.height;
 const safetyScale=Math.min(236/Math.max(...source.frames.map(f=>f.width)),234/Math.max(...source.frames.map(f=>f.height)));
 const scale=Math.min(requestedScale,safetyScale),renderScale=standingBodyHeight/(c.bodyBounds.height*scale);
 const stature={sourceImage:source.file,state:c.state,nativeRow:c.row,nativeColumn:c.column,sourceBodyBounds:c.bodyBounds,sourceBodyHeight:c.bodyBounds.height,sourceStandingBodyHeight:c.bodyBounds.height,sourceRoi:c.bodyBounds,
  targetBodyHeight:190,normalizedBodyHeight:c.bodyBounds.height*scale,normalizedStandingBodyHeight:c.bodyBounds.height*scale,effectiveBodyHeight:190,effectiveStandingBodyHeight:190,
  scale,renderScale,requestedScale,safetyScale,raisedArmsExcluded:!!c.raisedArmsExcluded,measurementKind:'visual-body-roi',excludesWeaponEffects:true,sameScaleForEveryPoseInSource:true,
  reason:c.reason||'Measured crown-to-sole body excludes raised hands, weapons, captured props and VFX. One source-wide scale preserves all genuine lower body projections.'};
 sourceCache.set(spec.id,{...source,spec,scale,renderScale,stature});
}
const actualCalls=JSON.parse(await fs.readFile(path.join(sourceDir,'actual-tool-calls.json'),'utf8'));
let handMeasurements={};
try{handMeasurements=JSON.parse(await fs.readFile(path.join(sourceDir,'hand-measurements.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
if(!check)await fs.mkdir(outputDir,{recursive:true});
const entries=[];
for(const spec of cfg.atlases){
 const primary=sourceCache.get(spec.id),layers=[],frames=[],rows=[],usedSources=new Map();
 for(const[stateRow,state]of spec.states.entries()){
  const selection=spec.selection[state],source=sourceCache.get(selection?.sourceId);
  const nativeRow=selection?.row;
  if(!source||source.spec.states[nativeRow]!==state)throw new Error(`Invalid native selection ${state}`);
  if(nativeRow<0)throw new Error(`Missing real native state ${state}`);
  usedSources.set(source.spec.id,source);
  const rowFrames=[];
  for(let column=0;column<4;column++){
   const frame=source.frames[nativeRow*4+column],width=Math.round(frame.width*source.scale),height=Math.round(frame.height*source.scale);
   if(width>236||height>234)throw new Error(`Unsafe real silhouette ${spec.id}/${state}/${column}`);
   const png=await sharp(frame.raw,{raw:{width:frame.width,height:frame.height,channels:4}}).resize(width,height,{kernel:'nearest'}).png().toBuffer();
   const x=Math.floor((256-width)/2),y=244-height;
   layers.push({input:png,left:column*256+x,top:stateRow*256+y});
   const mapping={state,frame:column,sourceImage:source.file,nativeRow,nativeColumn:column,sourceRect:frame.sourceRect,scale:source.scale,renderScale:source.renderScale,destinationRect:{x,y,width,height},sha256:hash(png),sourceFrameRgbaSha256:hash(frame.raw)};
   frames.push(mapping);rowFrames.push(mapping);
  }
  rows.push({state,row:stateRow,sourceImage:source.file,sourceRow:nativeRow,scale:source.scale,renderScale:source.renderScale,statureCalibration:source.stature,
   frameBounds:rowFrames.map(f=>({source:f.sourceRect,output:f.destinationRect})),nativeFrameRgbaSha256:rowFrames.map(f=>f.sourceFrameRgbaSha256),crossedOpaquePixels:0,crossedVisiblePixels:0,
   visualReview:{manuallyInspected:cfg.visualReview.complete===true,fourDistinctNativePoses:cfg.visualReview.complete===true,action:state}});
 }
 if(new Set(frames.map(f=>f.sourceFrameRgbaSha256)).size!==spec.states.length*4)throw new Error('A native pose was selected twice');
 const bytes=await sharp({create:{width:1024,height:2048,channels:4,background:'#00000000'}}).composite(layers).png().toBuffer(),output=path.join(outputDir,`${spec.id}.png`);
 if(check){if(await fileHash(output)!==hash(bytes))throw new Error(`Stale PNG ${output}`);}else await fs.writeFile(output,bytes);
 const states=Object.fromEntries(spec.states.map((state,row)=>[state,{row,frames:4,columns:4,renderScale:rows[row].renderScale,...(spec.frameOrders?.[state]?{frameOrder:spec.frameOrders[state]}:{})}]));
 entries.push({id:spec.id,heroId:cfg.heroId,universe:cfg.universe,sheet:`/${output.replace(/^public\//,'')}`,states,stateOrder:spec.states,columns:4,rows:8,activeRows:spec.states.length,frames:spec.states.length*4,
  dimensions:{width:1024,height:2048,cellWidth:256,cellHeight:256,frameWidth:256,frameHeight:256},sha256:hash(bytes),sourceImage:primary.file,sourceHash:primary.sha256,
  sourceImages:[...usedSources.values()].map(s=>({path:s.file,sha256:s.sha256,dimensions:{width:s.width,height:s.height},rows:s.spec.states.length,observedRowCounts:s.spec.states.map(()=>4),nativeStateOrder:s.spec.states})),
  referenceAsset:reference.asset,referenceHash:reference.sha256,referenceAssets:[reference],sourceWork,
  sourceReference:cfg.sourceReference,
  frameOrderByState:Object.fromEntries(spec.states.map(state=>[state,spec.frameOrders?.[state]||[0,1,2,3]])),
  normalization:{method:'Connected-alpha whole-pose segmentation; one body calibration, nearest-neighbor pixel scale and render factor per native source. Explicit real corrective rows inserted without synthesizing anatomy.',
   baseline:244,baselineDefinition:'bottom-exclusive full-pose alpha bound; ledge attachment uses separately measured real native palms.',margins:10,alphaSegmentationThreshold:24,
   alphaCleanup:'Exclude near-transparent background noise below24; original PNGs archived unchanged.',rowFit:false,sharedScalePerSource:true,sharedScalePerState:false,commonStandingBodyHeight:190,
   sourceStatureCalibration:[...usedSources.values()].map(s=>s.stature),sourceCalibrations:[...usedSources.values()].map(s=>s.stature),sourceScaleFactors:Object.fromEntries([...usedSources.values()].map(s=>[s.file,s.scale])),rows,
   frameOrder:[0,1,2,3],frames,syntheticPoses:false,duplicatedFrames:0,mirroredFrames:0,sourceCanvasEdgePixels:primary.edgePixels,
   sourceCanvasEdges:Object.fromEntries([...usedSources.values()].map(s=>[s.file,s.edgePixels])),
   contactAnchorMeasurements:spec.states.includes('ledgeCatch')?(handMeasurements.states||{}):{},emptyRows:Array.from({length:8-spec.states.length},(_,i)=>i+spec.states.length),
   nativeSourceStateOrder:primary.spec.states,discardedNativeRows:spec.discardedRows||[]},
  visualValidation:{reviewed:cfg.visualReview.complete===true,stateRowsReviewed:cfg.visualReview.complete===true,fourNativePosesPerStateReviewed:cfg.visualReview.complete===true,completeRows:spec.states.length,distinctNativePoses:spec.states.length*4,wholeCharacterContained:true,
   facing:spec.id.endsWith('motion-a')?'Right by default; turn begins facing left, passes two native rear-three-quarter bodies and ends facing right.':'Right by default apart from genuine KO/airborne anatomical projection.',
   outfit:cfg.visualReview.outfit,
   weapons:cfg.visualReview.weapons,
   stature:'190px effective body calibration per native source; crouches, hanging arms and lowered projections keep their native proportions. Corrective source uses its own documented upright calibration.',
   handContactsReviewed:!spec.states.includes('ledgeCatch')||handMeasurements.reviewed===true,canon1to1Verified:false,source1to1Verified:false,
   limitations:cfg.visualReview.limitations},
  provenance:{provider:'OpenAI',tool:'image_gen',model:null,jobId:null,generationId:null,date:cfg.date,nativeArtwork:true,canonicalVerified:false,networkVerified:false,canon1to1Verified:false,sourceWork,
   prompts:await Promise.all([...usedSources.keys()].map(async id=>({path:(sourceCache.get(id).spec.promptFile||path.join(sourceDir,`${id}.prompt.txt`)),sha256:await fileHash((sourceCache.get(id).spec.promptFile||path.join(sourceDir,`${id}.prompt.txt`)))}))),
   actualToolCalls:path.join(sourceDir,'actual-tool-calls.json'),actualToolCallsSha256:await fileHash(path.join(sourceDir,'actual-tool-calls.json')),normalizationScript:'docs/combat-fidelity-wave10-2026-10-23/melee-tooling/build-native-melee-atlases.mjs',normalizationPlan:configPath,
   handMeasurements:spec.states.includes('ledgeCatch')&&handMeasurements.reviewed?{path:path.join(sourceDir,'hand-measurements.json'),sha256:await fileHash(path.join(sourceDir,'hand-measurements.json'))}:null}});
}
const incompleteInitialSources=cfg.incompleteInitialSources||[];
for(const batch of ['Motion','Combat']){
 const ownEntries=entries.filter(e=>cfg.atlases.find(s=>s.id===e.id).batch===batch),sourcePaths=new Set(ownEntries.flatMap(e=>e.sourceImages.map(s=>s.path)));
 const generations=actualCalls.filter(c=>sourcePaths.has(c.savedSource)).map(c=>({id:c.id,provider:'OpenAI',tool:'image_gen',model:null,jobId:null,generationId:null,sourceImage:c.savedSource,sha256:c.sourceSha256,prompt:c.promptFile,promptSha256:c.promptFileSha256,
  observedNativePoses:c.observedNativePoses,retainedPosesInThisRegistry:ownEntries.flatMap(e=>e.normalization.frames).filter(f=>f.sourceImage===c.savedSource).length,sharedSourceAcrossRegistries:c.id===correction,
  canonicalVerified:false,canon1to1Verified:false,rejected:false}));
 const registry={schemaVersion:1,date:cfg.date,heroId:cfg.heroId,universe:cfg.universe,sourceWork,canonicalVerified:false,networkVerified:false,canon1to1Verified:false,entries:ownEntries,generations,
  nativeGenerationCalls:generations.length,uniqueFull45NativeGenerationCalls:actualCalls.filter(c=>c.savedSource).length,actualToolCallAttempts:actualCalls.length,uniqueObservedFull45NativePoses:actualCalls.reduce((n,c)=>n+(c.observedNativePoses||0),0),sharedCorrectionCallId:correction,deliveredNativePoses:ownEntries.reduce((n,e)=>n+e.frames,0),
  incompleteInitialSources:incompleteInitialSources.filter(s=>ownEntries.some(e=>e.id===s.id)),discardedFrames:ownEntries.flatMap(e=>e.normalization.discardedNativeRows),rejectedSources:[]};
 const encoded=JSON.stringify(registry,null,2)+'\n';
 for(const target of [`src/game/combat/${cfg.registryStem}Melee${batch}.generated.json`,path.join(sourceDir,`provenance-${batch.toLowerCase()}.json`)]){
  if(check){if(await fs.readFile(target,'utf8')!==encoded)throw new Error(`Stale provenance ${target}`);}else await fs.writeFile(target,encoded);
 }
}
console.log(JSON.stringify({check,entries:entries.map(e=>({id:e.id,states:e.stateOrder.length,poses:e.frames,sha256:e.sha256})),sourceCalibrations:[...sourceCache.values()].map(s=>s.stature),uniqueGenerationCalls:actualCalls.filter(c=>c.savedSource).length,observedNativePoses:actualCalls.reduce((n,c)=>n+(c.observedNativePoses||0),0),discardedNativePoses:cfg.atlases.flatMap(a=>a.discardedRows||[]).reduce((n,r)=>n+r.poses,0),deliveredNativePoses:180}));


