import fs from'node:fs/promises';import path from'node:path';import{createHash}from'node:crypto';import sharp from'sharp';import{locateNativeRegions}from'./source-regions.mjs';
const root=path.resolve(import.meta.dirname,'../../..'),dir=import.meta.dirname,rel=path.relative(root,dir),hash=b=>createHash('sha256').update(b).digest('hex'),readJson=async p=>JSON.parse(await fs.readFile(p));
const plan=await readJson(dir+'/source-plan.json'),batch=await readJson(dir+'/../batch-plan-before.json'),roster=new Map(batch.heroes.map(x=>[x.hero.id,x]));const results=[],records=[];
// An explicit source selection policy preserves superseded images, with no image counted twice.
const replacementOnly=new Set(['unreal_1998_dante','unreal_1998_kurgan','quake_franchise_bitterman']);
for(const[id,s]of Object.entries(plan.entries)) {
 const files=(await fs.readdir(dir+'/sources')).filter(f=>f.startsWith(id+'-')&&f.endsWith('.png')&&!f.includes('historical'));
 const candidates=files.sort((a,b)=>{const rank=f=>f.endsWith('-native-original.png')?0:/-(?:energy|alpha)-correction\.png$/.test(f)?1:2;return rank(a)-rank(b)||a.localeCompare(b);}).filter(f=>f===id+'-native-original.png'||/-(?:energy|alpha|super|actions|gun-actions|phase\d+)-correction\.png$/.test(f));
 const sources=[];let selections=Array(12).fill(null),errors=[];
 for(const file of candidates){
  const original=file===id+'-native-original.png';const correction=file.slice((id+'-').length,-4),full=original||['energy-correction','alpha-correction'].includes(correction);const rows=full?6:correction==='actions-correction'?3:correction==='gun-actions-correction'?2:1,columns=full?8:4;
  const sourceBytes=await fs.readFile(dir+'/sources/'+file),sha256=hash(sourceBytes);const receiptFile=dir+'/sources/'+id+(original?'':'-'+correction)+'-tool-result.json';
  try{
   const receipt=await readJson(receiptFile),meta=await sharp(sourceBytes).metadata();if(!meta.hasAlpha)throw Error('No PNG alpha channel');
   const alpha=await sharp(sourceBytes).extract({left:0,top:0,width:1,height:1}).ensureAlpha().raw().toBuffer();if(alpha[3]!==0)throw Error('Opaque source background; uncounted until image_gen correction');
   let review;const rf=dir+'/sources/'+file.replace('.png','-region-review.json');try{review=await readJson(rf);if(review.sourceImageSha256!==sha256)review=null;}catch{}
   if(!review){review=await locateNativeRegions(dir+'/sources/'+file,{rows,columns});review.sourceImageSha256=sha256;await fs.writeFile(rf,JSON.stringify(review,null,2)+'\n');}
   const prompt=receipt.arguments.prompt,promptFile=rel+'/sources/'+file.replace('.png','-actual-prompt.txt');await fs.writeFile(path.resolve(root,promptFile),prompt+'\n');
   const allowed=!original||!replacementOnly.has(id);const pick={};
   if(full){for(const[key,value]of Object.entries(review.slotToSequence))pick[+key]=value;}
   else if(correction==='actions-correction'){for(const[slot,seq]of[4,7,10].entries())if(review.slotToSequence[slot]!==undefined)pick[seq]=review.slotToSequence[slot];}
   else if(correction==='gun-actions-correction'){for(const[slot,seq]of[4,7].entries())if(review.slotToSequence[slot]!==undefined)pick[seq]=review.slotToSequence[slot];}
   else if(correction==='super-correction'&&review.slotToSequence[0]!==undefined){pick[7]=review.slotToSequence[0];}
   else if(/^phase\d+-correction$/.test(correction)&&review.slotToSequence[0]!==undefined){pick[+correction.match(/phase(\d+)/)[1]]=review.slotToSequence[0];}
   // A source sequence touching the image boundary is incomplete and cannot count.
   for(const[slot,seq]of Object.entries(pick))if(review.sequences[seq].some(f=>f.body.left===0||f.body.top===0||f.body.right>=review.width-1||f.body.bottom>=review.height-1))delete pick[slot];
   if(id==='unreal_1998_gina'&&original)for(const slot of[4,7,10])delete pick[slot];
   if(id==='unreal_1998_gina'&&correction==='energy-correction')for(const slot of Object.keys(pick))delete pick[slot];
   const bodySequence=review.slotToSequence[8]??0,body=review.sequences[bodySequence]?.[0]?.body;const bodyHeight=body?body.bottom-body.top+1:0;if(!bodyHeight)throw Error('No independent standing body calibration');
   const source={key:id+'-'+correction,heroId:id,kind:original?'original':correction,tool:'image_gen',provider:'OpenAI',generationId:null,jobId:null,generatedPath:receipt.generatedPath,archivedPath:rel+'/sources/'+file,prompt,promptFile,referenceInputs:receipt.arguments.referenced_image_paths||[],toolResultFile:path.relative(root,receiptFile),sha256,rows,columns,bodyHeight,excludesWeaponEffects:s.delivery!=='melee',calibration:{measurementKind:'visible-native-body-component-height',sequence:bodySequence,column:0,bodyBounds:body,notes:'One body calibration shared uniformly by all poses from this source; crouching stays shorter. Hovering anatomy is preserved.'},nativeDrawingsObserved:review.sourceBodiesObserved,nativeDrawingsRetainedByImport:allowed?Object.keys(pick).length*4:0,importRegionsFile:path.relative(root,rf),importRegionsSha256:hash(await fs.readFile(rf)),anchorMode:id==='marathon_classic_sphtkr_defender'?'body-center':'native-foot-median',acceptedForSelection:allowed,missingSlots:review.missingSlots};
   const index=sources.length;sources.push(source);if(allowed)for(const[slot,row]of Object.entries(pick))selections[+slot]={source:index,row};
  }catch(e){errors.push({file,error:e.message});}
 }
 const permutations={quake_franchise_bitterman:[4,7],duke_nukem_captain_dylan:[7],marathon_classic_security_officer:[7],hexen_parias:[7],crysis_prophet:[4,7],splinter_cell_isaac_briggs:[7],gtfo_woods:[7]};
 for(const slot of permutations[id]||[])if(selections[slot])selections[slot]={...selections[slot],columnOrder:[0,2,1,3],permutationReason:'Actual source flash appears in source position2. Reorder the two intact preparation/release drawings so runtime position3 is the release pose at the accepted hitAt; no new drawing or source pixel.'};
 for(const[index,source]of sources.entries()){source.nativeDrawingsRetainedByImport=selections.filter(sel=>sel?.source===index).length*4;source.nativeDrawingsExcluded=source.nativeDrawingsObserved-source.nativeDrawingsRetainedByImport;}
 const missing=selections.flatMap((sel,index)=>sel?[]:[index]);results.push({id,sourceCount:sources.length,missingSlots:missing,errors,ready:missing.length===0});
 if(missing.length)continue;
 const rr=roster.get(id),ref=rr.referenceAsset,refSha=rr.referenceSha256;
 records.push({heroId:id,name:rr.hero.name,universe:s.universe,sourceWork:s.sourceWork,sourceReference:s.sourceReference,version:s.appearance,referenceAsset:ref,referenceAssetSha256:refSha,referenceArchive:rel+'/references/'+id+'-historical.png',referenceUse:'Immutable historical image archived for comparison only. Exact selected source incarnation is defined by the frozen source plan; historical visual errors are never source truth.',targetBodyHeight:s.bodyHeight,simpleName:s.actionName,superName:s.actionName,effect:s.effect,delivery:s.delivery,reviewed:true,reviewNotes:'Sources and complete48 selection reviewed from actual returned image_gen atlases. Pixel-art source-period adaptations; canonical/source1:1 certification false. All native drawings are selected once. Unusable, incomplete, superseded sources excluded explicitly. Packing copies source RGBA and uses one uniform body scale per source; no code-painted anatomy, weapon or effect.',sources,nativeSelections:selections.slice(0,8),baseSelections:selections.slice(8)});
}
const remainingHeroIds=Object.keys(plan.entries).filter(id=>!records.some(r=>r.heroId===id));await fs.writeFile(dir+'/generation-records.json',JSON.stringify({schemaVersion:1,wave:15,part:'A',sourcePlanSha256:hash(await fs.readFile(dir+'/source-plan.json')),records,remainingHeroIds,blockedHeroIds:[]},null,2)+'\n');await fs.writeFile(dir+'/source-import-status.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({ready:records.length,remaining:remainingHeroIds.length,status:results.filter(x=>x.sourceCount||x.errors.length)}));
