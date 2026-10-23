import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const dir='docs/combat-fidelity-wave11-2026-10-23/browser';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const native=await read(dir+'/native-presentations.json'),base=await read(dir+'/base-corrections.json');
assert.equal(native.passed,true);assert.equal(base.passed,true);
assert.equal(native.characters,194);assert.equal(native.actualFrameDraws,12352);
assert.equal(base.newCharacters,37);assert.equal(base.totalFrameDraws,4480);
const montageFiles=[];
for(const part of ['a','b','c','d']){
  const heroes=native.captures.filter(capture=>capture.part===part);
  for(let group=0;group<2;group++)for(const [kind,captures,cellHeight]of[['native',native.captures,210],['bases',base.captures,150]]){
    const selected=heroes.slice(group*5,group*5+5).filter(hero=>captures.some(capture=>capture.heroId===hero.heroId));
    const panels=[];
    for(const[index,hero]of selected.entries()){
      const capture=captures.find(item=>item.heroId===hero.heroId);
      for(let sample=0;sample<2;sample++){
        const row=kind==='native'?(sample?7:0):(sample?2:0);
        const input=await sharp(capture.path).extract({left:0,top:row*cellHeight,width:1120,height:cellHeight}).png().toBuffer();
        panels.push({input,left:0,top:(index*2+sample)*cellHeight});
      }
    }
    if(!selected.length)continue;
    const file=`${dir}/${kind}-${part}-${group+1}-both-sides.png`;
    await sharp({create:{width:1120,height:selected.length*2*cellHeight,channels:4,background:{r:16,g:20,b:28,alpha:1}}}).composite(panels).png().toFile(file);
    montageFiles.push(file);
  }
}
const oldDir='docs/combat-fidelity-wave10-2026-10-23/browser';
const oldEvidence=await read(oldDir+'/evidence.json');assert.equal(oldEvidence.frozen,true);
const historicalEvidence=[];
for(const name of ['native-presentations.json','native-presentations-trace.json','base-corrections.json','base-corrections-trace.json']){
  const path=oldDir+'/'+name,digest=sha(await fs.readFile(path));
  assert.equal(digest,oldEvidence.artifacts.find(item=>item.path===path).sha256,'Historical W10 evidence changed: '+path);
  historicalEvidence.push({path,sha256:digest,access:'read-only; never an output'});
}
const deliveryPath='docs/combat-fidelity-wave11-2026-10-23/part-a-delivery.json',delivery=await read(deliveryPath);
for(const item of delivery.artifacts)assert.equal(sha(await fs.readFile(item.path)),item.sha256,item.path+': frozen PartA input changed');
const moduleInputs=[];
for(const path of ['src/game/renderer.js','src/game/spriteAssets.js','src/game/combat/characterAnimationCatalog.js','src/game/combat/characterLegacyFallbacksWave11.js'])moduleInputs.push({path,sha256:sha(await fs.readFile(path))});
let lilithCorrection=null;
const beforeLilithPath=dir+'/before-lilith-handedness/production-input-snapshot.json';
let beforeLilithSnapshot=null;
try{beforeLilithSnapshot=await read(beforeLilithPath);}catch(error){if(error.code!=='ENOENT')throw error;}
if(beforeLilithSnapshot){
  const snapshot=beforeLilithSnapshot;
  const {getCharacterAnimationAssets}=await import('../../../src/game/combat/characterAnimationCatalog.js');
  const currentNative=getCharacterAnimationAssets();
  const baseNames=(await fs.readdir('src/game/combat')).filter(name=>/^characterSpriteCorrections(?:Wave(?:[2-9]|10|11)(?:Part[A-D])?)?\.generated\.json$/.test(name));
  const currentBases=[];for(const name of baseNames)currentBases.push(...(await read('src/game/combat/'+name)).entries);
  assert.equal(currentNative.length,194);assert.equal(currentBases.length,140);
  const changedPngs=[];
  let unchangedPngs=0,unchangedNonLilithRecords=0;
  for(const previous of snapshot.assets){
    const current=(previous.kind==='native'?currentNative:currentBases).find(entry=>entry.heroId===previous.heroId);
    assert.ok(current,previous.kind+': missing current entry '+previous.heroId);
    const digest=sha(await fs.readFile('public'+current.sheet));
    assert.equal(digest,current.sha256,current.sheet+': registry SHA differs from PNG');
    if(previous.heroId!=='lilith_borderlands'){
      assert.deepEqual(JSON.parse(JSON.stringify(current)),previous.entry,previous.kind+': unrelated record changed '+previous.heroId);
      assert.equal(digest,previous.sha256,previous.kind+': unrelated PNG changed '+previous.heroId);
      unchangedPngs++;unchangedNonLilithRecords++;
    }else{
      assert.equal(current.universe,previous.entry.universe);assert.equal(current.sheet,previous.sheet);
      assert.notEqual(digest,previous.sha256,previous.kind+': Lilith correction did not replace the wrong-arm source');
      assert.notDeepEqual(JSON.parse(JSON.stringify(current)),previous.entry,previous.kind+': corrected PNG record did not change');
      changedPngs.push({kind:previous.kind,heroId:previous.heroId,sheet:current.sheet,beforeSha256:previous.sha256,sha256:digest});
    }
  }
  assert.equal(changedPngs.length,2);assert.equal(unchangedPngs,332);
  const previousEvidence=dir+'/before-lilith-handedness/evidence.json';
  assert.deepEqual(moduleInputs,(await read(previousEvidence)).runtimeModules.sourceFiles,'Rendering source files changed outside the two Lilith records');
  lilithCorrection={beforeSnapshot:{path:beforeLilithPath,sha256:sha(await fs.readFile(beforeLilithPath))},beforeEvidence:{path:previousEvidence,sha256:sha(await fs.readFile(previousEvidence))},changedPngs,changedAssetRecords:2,totalAssetRecords:334,unchangedPngs,unchangedNonLilithRecords,renderingSourceFilesUnchanged:true,mechanicsChanged:false,source1to1Verified:false};
}
let review=null;
try{review=await read(dir+'/visual-review.json');}catch(error){if(error.code!=='ENOENT')throw error;}
if(review){assert.equal(review.passed,true);for(const item of [...review.reviewedArtifacts,...(review.supportingArtifacts??[])])assert.equal(sha(await fs.readFile(item.path)),item.sha256,item.path+': reviewed capture changed');}
const files=[...['native-presentations.mjs','base-corrections.mjs','build-evidence.mjs','native-presentations.json','base-corrections.json','native-presentations-trace.json','base-corrections-trace.json','beast-boy-fallback-trace.json','janine-presentation-fallback-trace.json','janine-base-reuse-trace.json','janine-base-reuse.png','refused-legacy-fallback-trace.json','quiet-support-pose-trace.json',...(review?['visual-review.json','review.md']:[])].map(file=>dir+'/'+file),...native.captures.map(item=>item.path),...base.captures.map(item=>item.path),...base.fallbackCaptures.map(item=>item.path),...montageFiles,...(review?.supportingArtifacts??[]).map(item=>item.path)];
const artifacts=[];for(const path of files)artifacts.push({path,sha256:sha(await fs.readFile(path))});
const evidence={schemaVersion:1,date:'2026-10-23',passed:true,frozen:!!review,source1to1Verified:false,
  nativeHeroEntries:native.characters,newFull32Count:native.captures.length,full32Count:native.full32Count,partialCount:native.partialCount,partialPoses:native.partialPoses,partialDetails:native.partialDetails,
  nativePhases:native.phases,nativeDrawImageCalls:native.actualFrameDraws,nativeCallsIncludingFallback:native.realDrawImageCalls,
  gorillaFallbackDraws:native.humanFallbackFrameDraws,janineReusedPresentationDraws:native.janineReusedPresentationDraws,
  baseHeroes:base.newCharacters+base.legacyCharacters,newBaseHeroes:base.newCharacters,baseDrawImageCalls:base.totalFrameDraws,baseCallsIncludingReuse:base.realDrawImageCalls,
  janineReusedOrdinaryDraws:base.adaptedPresentationFallbackDraws,refusedLegacyFallbackDraws:base.refusedLegacyFallbackDraws,quietSupportDraws:base.quietSupportDraws,
  fallbacks:{newPixelsCounted:0,newDedicatedPosesCounted:0,refusedLegacyHeroes:base.missingNewBaseHeroIds,legacyIdentityTags:['sourceHeroId','sourceId'],foreignUniverseRejected:true,snapeFixedColumn:0,quietSupportHeroes:['dumbledore','giles_buffy','ron_weasley'],quietSupportStates:['support','defense'],quietSupportSourceRow:0},
  historical:{nativeAssetRecordsAndPngHashes:native.historicalAssetRecordsUnchanged,nativeDrawGeometry:native.historicalDrawGeometryUnchanged,baseRecords:base.historicalBaseRecordsUnchanged,basePngHashes:base.historicalPngHashesUnchanged,baseDrawGeometry:base.historicalGeometryUnchangedDraws,completeBaseRegistryHashes:base.historicalCompleteBaseRegistryHashesUnchanged,fullMeleeManifests:native.historicalFullMeleeManifestsUnchanged,summonAssetsAndHashes:native.historicalSummonAssetRecordsAndPngHashesUnchanged,reportsOverwritten:false,evidence:historicalEvidence,previousEvidence:{path:oldDir+'/evidence.json',sha256:sha(await fs.readFile(oldDir+'/evidence.json'))}},
  geometry:{complete256pxSourceCells:true,calibratedBaseline244:true,preWave6LegacyBaseline232:true,mirroredP2:true,actorMutation:false,assetRegistryMutation:false,baseLayoutMutation:false,authoritativeProgressChecks:native.fixedProgressFrames,crossedIdentityRejections:native.rejectedCrossedIdentities},
  runtimeModules:{rendererUrl:native.rendererUrl,catalogUrl:native.catalogUrl,spriteAssetsUrl:base.spriteAssetsUrl,sourceFiles:moduleInputs},
  frozenPartAInputs:{passed:true,files:delivery.artifacts.length,manifest:deliveryPath,manifestSha256:sha(await fs.readFile(deliveryPath))},
  lilithCorrection,
  visualReview:{newPresentationCaptures:native.captures.length,newDedicatedBaseCaptures:base.captures.length,reusedJanineCapture:dir+'/janine-base-reuse.png',refusedLegacyCaptures:base.fallbackCaptures,montageFiles,reviewed:review?.reviewedArtifacts.map(item=>item.path)??[],notes:review?.notes??'Pending direct visual review of diagnostic montage views and reused-pose captures; no additional art is created by this script.'},
  missingNativeHeroIds:native.missingNativeHeroIds,missingNewBaseHeroIds:base.missingNewBaseHeroIds,errors:[...native.errors,...base.errors],externalRequestLimitations:[...native.failedRequests,...base.failedRequests],artifacts};
await fs.writeFile(dir+'/evidence.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({passed:true,nativeDraws:native.actualFrameDraws,baseDraws:base.totalFrameDraws,montages:montageFiles.length,reviewPending:!review,frozen:!!review}));
