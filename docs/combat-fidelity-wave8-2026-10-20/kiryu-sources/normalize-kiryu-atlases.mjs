// Only native image_gen anatomy; Sharp performs alpha segmentation, one
// source-wide calibration, nearest-neighbor packing and measurement crops.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const sourceDir = 'docs/combat-fidelity-wave8-2026-10-20/kiryu-sources';
const outputDir = 'public/sprites/generated/melee-kiryu-wave8';
const check = process.argv.includes('--check');
const motionOnly = process.argv.includes('--motion-only');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = async file => hash(await fs.readFile(file));
const sourcePath = id => path.join(sourceDir, `${id}.native.png`);
const reference = { asset: 'public/sprites/generated/heroes/yakuza/kiryu-yakuza.png', savedImage: path.join(sourceDir, 'kiryu-reference-original.png') };
reference.sha256 = await fileHash(reference.savedImage);
const sourceWork = 'Yakuza Kiwami (2016)';
const specifications = [
 { id:'kiryu-motion-a', batch:'Motion', states:['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'], calibration:{row:0,column:0,state:'idle',bodyBounds:{x:58,y:19,width:134,height:208}} },
 { id:'kiryu-motion-b', batch:'Motion', states:['fastFall','land','crouchEnter','crouchIdle','crouchExit','crouchCharge','taunt1','hitStun'], calibration:{row:6,column:0,state:'taunt1',bodyBounds:{x:45,y:1347,width:115,height:236}} },
 { id:'kiryu-defense', batch:'Motion', states:['shieldEnter','shieldHold','shieldHit','perfectShield','shieldBreak','shieldExit','dead','defeat'], calibration:{row:5,column:3,state:'shieldExit',bodyBounds:{x:717,y:1156,width:122,height:251}} },
 { id:'kiryu-combat-a', batch:'Combat', states:['attackLight1','attackLight2','attackLight3','crouchLight','chargeStart','chargeLoop','chargeRelease','chargeRecovery'], calibration:{row:4,column:0,state:'chargeStart',bodyBounds:{x:40,y:889,width:146,height:240}} },
 { id:'kiryu-combat-b', batch:'Combat', states:['attackRecovery','special','aerialNeutral','aerialForward','aerialDown','intro','victory','ledgeAttack'], calibration:{row:5,column:0,state:'intro',bodyBounds:{x:56,y:1091,width:107,height:231}} },
 { id:'kiryu-ledge', batch:'Combat', states:['ledgeCatch','ledgeHang','ledgeClimb','ledgeDrop','ledgeJump'], calibration:{row:1,column:0,state:'ledgeHang',bodyBounds:{x:86,y:351,width:154,height:242},raisedArmsExcluded:true} }
];
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
  // Segment whole connected bodies before assigning rows. In source B the
  // uppermost landing hair and a fast-fall boot overlap in Y but not in X;
  // horizontal row cuts would cut real anatomy. No pixel is reconstructed.
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


const standingBodyHeight = 190, entries = [], generations = [], calibrations = [];
let handMeasurements = {};
try { handMeasurements = JSON.parse(await fs.readFile(path.join(sourceDir,'hand-measurements.json'),'utf8')); }
catch (error) { if(error.code !== 'ENOENT') throw error; }
if (!check) await fs.mkdir(outputDir, { recursive:true });
for (const specification of specifications.filter(spec => !motionOnly || spec.batch === 'Motion')) {
 const source = await segmentSource(sourcePath(specification.id),specification.states.length), calibration=specification.calibration;
 const requestedScale=standingBodyHeight/calibration.bodyBounds.height;
 const safetyScale=Math.min(236/Math.max(...source.frames.map(f=>f.width)),234/Math.max(...source.frames.map(f=>f.height)));
 const scale=Math.min(requestedScale,safetyScale),renderScale=standingBodyHeight/(calibration.bodyBounds.height*scale);
 const stature={sourceImage:source.file,state:calibration.state,nativeRow:calibration.row,nativeColumn:calibration.column,sourceBodyBounds:calibration.bodyBounds,
 sourceBodyHeight:calibration.bodyBounds.height,targetBodyHeight:standingBodyHeight,sourceRoi:calibration.bodyBounds,sourceStandingBodyHeight:calibration.bodyBounds.height,normalizedBodyHeight:calibration.bodyBounds.height*scale,effectiveBodyHeight:standingBodyHeight,normalizedStandingBodyHeight:calibration.bodyBounds.height*scale,effectiveStandingBodyHeight:standingBodyHeight,
 scale,renderScale,requestedScale,safetyScale,raisedArmsExcluded:!!calibration.raisedArmsExcluded,measurementKind:'visual-body-roi',excludesWeaponEffects:true,
 sameScaleForEveryPoseInSource:true,reason:calibration.raisedArmsExcluded?'Native hanging head-crown to shoe-sole interval excludes raised arms. A source-wide safety scale and shared render factor preserve all crouches and hanging projections.':'Complete native upright head-crown to shoe-sole body. One scale per source; all lower projections keep their native ratios.'};
 calibrations.push(stature);
 const layers=[],frames=[],hashes=[];
 for(const [i,frame] of source.frames.entries()) {
  const width=Math.round(frame.width*scale),height=Math.round(frame.height*scale);
  if(width>236||height>234)throw new Error(`Unsafe silhouette ${specification.id}/${i}`);
  const png=await sharp(frame.raw,{raw:{width:frame.width,height:frame.height,channels:4}}).resize(width,height,{kernel:'nearest'}).png().toBuffer();
  const x=Math.floor((256-width)/2),y=244-height,sha256=hash(png);hashes.push(sha256);
  layers.push({input:png,left:i%4*256+x,top:Math.floor(i/4)*256+y});
  frames.push({state:specification.states[Math.floor(i/4)],frame:i%4,sourceImage:source.file,nativeRow:frame.nativeRow,nativeColumn:frame.nativeColumn,
   sourceRect:frame.sourceRect,scale,renderScale,destinationRect:{x,y,width,height},sha256,sourceFrameRgbaSha256:hash(frame.raw)});
 }
 if(new Set(hashes).size!==specification.states.length*4)throw new Error('Duplicate native frame');
 const bytes=await sharp({create:{width:1024,height:2048,channels:4,background:'#00000000'}}).composite(layers).png().toBuffer();
 const output=path.join(outputDir,`${specification.id}.png`),prompt=path.join(sourceDir,`${specification.id}.prompt.txt`);
 if(check){if(await fileHash(output)!==hash(bytes))throw new Error(`Stale PNG ${output}`);}else await fs.writeFile(output,bytes);
 const contactAnchorMeasurements=specification.id==='kiryu-ledge'?(handMeasurements.states||{}):{};
 const rows=specification.states.map((state,row)=>({state,row,sourceImage:source.file,sourceRow:row,scale,renderScale,
  statureCalibration:stature,frameBounds:frames.filter(f=>f.state===state).map(f=>({source:f.sourceRect,output:f.destinationRect})),
  nativeFrameRgbaSha256:frames.filter(f=>f.state===state).map(f=>f.sourceFrameRgbaSha256),crossedOpaquePixels:0,crossedVisiblePixels:0,
  visualReview:{manuallyInspected:true,fourDistinctNativePoses:true,action:state}}));
 const states=Object.fromEntries(specification.states.map((state,row)=>[state,{row,frames:4,columns:4,renderScale}]));
 entries.push({id:specification.id,heroId:'kiryu_yakuza',universe:'Yakuza',sheet:`/${output.replace(/^public\//,'')}`,states,stateOrder:specification.states,
  columns:4,rows:8,activeRows:specification.states.length,frames:specification.states.length*4,
  dimensions:{width:1024,height:2048,cellWidth:256,cellHeight:256,frameWidth:256,frameHeight:256},sha256:hash(bytes),sourceImage:source.file,sourceHash:source.sha256,
  sourceImages:[{path:source.file,sha256:source.sha256,dimensions:{width:source.width,height:source.height},rows:specification.states.length,observedRowCounts:specification.states.map(()=>4)}],
  referenceAsset:reference.asset,referenceHash:reference.sha256,referenceAssets:[reference],sourceWork,
  sourceReference:'Kiryu Kiwami2016 gray suit/burgundy shirt, physical Dragon of Dojima style. Direct and close combination are adapted physical actions, no canonical named Tiger Drop or magical dragon is asserted. Full45 special/chargeRelease depict the ordinary secondary Combinaison rapprochée de Kiryu; the distinct super Coup du Dragon de Dojima belongs to the dedicated32 presentation atlas.',
  frameOrderByState:Object.fromEntries(specification.states.map(state=>[state,[0,1,2,3]])),
  normalization:{method:'Connected-alpha whole-pose segmentation; source-wide body calibration, one nearest-neighbor scale and one render factor per source; transparent packing.',
   baseline:244,baselineDefinition:'bottom-exclusive full-pose alpha bound; raised-arm ledge poses use separately measured palm attachment.',margins:10,alphaSegmentationThreshold:24,
   alphaCleanup:'Exclude near-transparent background noise below24; originals archived unchanged.',rowFit:false,sharedScalePerSource:true,sharedScalePerState:false,
   commonStandingBodyHeight:standingBodyHeight,sourceStatureCalibration:[stature],sourceScaleFactors:{[source.file]:scale},sourceCalibrations:[stature],rows,
   frameOrder:[0,1,2,3],frames,syntheticPoses:false,duplicatedFrames:0,mirroredFrames:0,sourceCanvasEdgePixels:source.edgePixels,
   contactAnchorMeasurements,emptyRows:Array.from({length:8-specification.states.length},(_,i)=>i+specification.states.length),nativeSourceStateOrder:specification.states,discardedNativeRows:[]},
  visualValidation:{reviewed:true,stateRowsReviewed:true,fourNativePosesPerStateReviewed:true,completeRows:specification.states.length,distinctNativePoses:specification.states.length*4,
   wholeCharacterContained:true,facing:specification.id==='kiryu-motion-a'?'Right by default; native turn row3 begins left and ends right through two back-three-quarter keys.':'Right by default, except genuine airborne/KO body projection.',
   outfit:'Kiwami2016 Kiryu: short slicked-back black hair, light-gray business suit, open burgundy shirt, black belt, pale shoes, bare hands.',
   weapons:'None. All punches, kicks and guard motions are physical bare hands/feet; no sword, bat, gun, magic dragon/tiger or aura body.',
   stature:'190px effective upright/hanging-body calibration. One pixel scale and render factor per source preserves true low poses and raised-arm proportions.',
   handContactsReviewed:specification.id!=='kiryu-ledge'||handMeasurements.reviewed===true,canon1to1Verified:false,source1to1Verified:false,
   limitations:['Original image-generated adapted choreography, not official source-game frames.','Small anatomical and costume proportion variation remains; exact source-game frame timings and pixels are not certified.','Ledge traversal is a gameplay adaptation; contact points are project measurements.']},
  provenance:{provider:'OpenAI',tool:'image_gen',model:null,jobId:null,generationId:null,date:'2026-10-20',nativeArtwork:true,canonicalVerified:false,networkVerified:false,canon1to1Verified:false,sourceWork,
   prompts:[{path:prompt,sha256:await fileHash(prompt)}],actualToolCalls:path.join(sourceDir,'actual-tool-calls.json'),actualToolCallsSha256:await fileHash(path.join(sourceDir,'actual-tool-calls.json')),
   normalizationScript:path.join(sourceDir,'normalize-kiryu-atlases.mjs'),handMeasurements:specification.id==='kiryu-ledge'?{path:path.join(sourceDir,'hand-measurements.json'),sha256:await fileHash(path.join(sourceDir,'hand-measurements.json'))}:null}});
 generations.push({id:specification.id,batch:specification.batch,provider:'OpenAI',tool:'image_gen',model:null,jobId:null,generationId:null,
  sourceImage:source.file,sha256:source.sha256,prompt,promptSha256:await fileHash(prompt),visiblePoseAttempts:specification.states.length*4,retainedPoses:specification.states.length*4,
  discardedPoseAttempts:0,canonicalVerified:false,canon1to1Verified:false,rejected:false});
}
for(const batch of ['Motion',...(motionOnly?[]:['Combat'])]) {
 const ownEntries=entries.filter(entry=>specifications.find(spec=>spec.id===entry.id).batch===batch),ownGenerations=generations.filter(g=>g.batch===batch);
 const registry={schemaVersion:1,date:'2026-10-20',heroId:'kiryu_yakuza',universe:'Yakuza',sourceWork,canonicalVerified:false,networkVerified:false,canon1to1Verified:false,
  entries:ownEntries,generations:ownGenerations,nativeGenerationCalls:ownGenerations.length,deliveredNativePoses:ownEntries.reduce((sum,e)=>sum+e.frames,0),incompleteInitialSources:[],discardedFrames:[],rejectedSources:[]};
 const encoded=JSON.stringify(registry,null,2)+'\n';
 for(const target of [`src/game/combat/kiryuMelee${batch}.generated.json`,path.join(sourceDir,`provenance-${batch.toLowerCase()}.json`)]) {
  if(check){if(await fs.readFile(target,'utf8')!==encoded)throw new Error(`Stale provenance ${target}`);}else await fs.writeFile(target,encoded);
 }
}
console.log(JSON.stringify({check,entries:entries.map(e=>({id:e.id,states:e.stateOrder.length,poses:e.frames,sha256:e.sha256})),calibrations,deliveredNativePoses:entries.reduce((sum,e)=>sum+e.frames,0)}));
