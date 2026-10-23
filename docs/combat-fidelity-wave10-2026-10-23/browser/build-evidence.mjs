import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const dir='docs/combat-fidelity-wave10-2026-10-23/browser';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const native=await read(dir+'/native-presentations.json'),base=await read(dir+'/base-corrections.json');
assert.equal(native.passed,true);assert.equal(base.passed,true);
const rerun=await read(dir+'/native-final-rerun-verification.json'),baseScope=await read(dir+'/base-evidence-scope-verification.json');
assert.equal(rerun.passed,true);assert.equal(baseScope.passed,true);
assert.equal(rerun.realDraws,native.actualFrameDraws);assert.equal(baseScope.bodyDrawsRetained,base.totalFrameDraws);
const nickRegistry=await read('src/game/combat/characterAnimationsWave10PartD.generated.json'),nick=nickRegistry.entries.find(entry=>entry.heroId==='nick_l4d');
assert.equal(sha(await fs.readFile('public'+nick.sheet)),nick.sha256);
const montageFiles=[];
for(const part of ['a','b','c','d']){
  const heroes=native.captures.filter(capture=>capture.part===part);
  for(let group=0;group<2;group++)for(const [kind,captures,cellHeight]of[['native',native.captures,210],['bases',base.captures,150]]){
    const selected=heroes.slice(group*5,group*5+5).filter(hero=>captures.some(capture=>capture.heroId===hero.heroId));
    const panels=[];
    for(const[index,hero]of selected.entries()){
      const capture=captures.find(item=>item.heroId===hero.heroId);
      for(let sample=0;sample<2;sample++){
        const dimensions=await sharp(capture.path).metadata();
        const row=kind==='native'?(sample?(hero.partial?dimensions.height/cellHeight-1:7):0):(sample?2:0);
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
const historicalEvidence=[];
for(const name of ['native-presentations.json','native-presentations-trace.json','base-corrections.json','base-corrections-trace.json']){
  const path='docs/combat-fidelity-wave9-2026-10-22/browser/'+name;
  historicalEvidence.push({path,sha256:sha(await fs.readFile(path)),access:'read-only; never an output',mtime:(await fs.stat(path)).mtime.toISOString()});
}
const delivery=await read('docs/combat-fidelity-wave10-2026-10-23/part-a-delivery.json');
for(const item of delivery.artifacts)assert.equal(sha(await fs.readFile(item.path)),item.sha256,item.path+': frozen PartA input changed');
let review=null;
try{review=await read(dir+'/visual-review.json');}catch(error){if(error.code!=='ENOENT')throw error;}
if(review){assert.equal(review.passed,true);for(const item of review.reviewedArtifacts)assert.equal(sha(await fs.readFile(item.path)),item.sha256,item.path+': reviewed capture changed');}
const files=[...['native-presentations.mjs','base-corrections.mjs','build-evidence.mjs','native-presentations.json','base-corrections.json','native-presentations-trace.json','base-corrections-trace.json','beast-boy-fallback-trace.json','janine-presentation-fallback-trace.json','janine-base-reuse-trace.json','janine-base-reuse.png','base-evidence-scope-before-nick.json','base-evidence-scope-verification.json','native-final-rerun-verification.json','native-before-nick-correction/archive-manifest.json','review.md',...(review?['visual-review.json']:[])].map(file=>dir+'/'+file),...native.captures.map(item=>item.path),...base.captures.map(item=>item.path),...montageFiles];
const artifacts=[];for(const path of files)artifacts.push({path,sha256:sha(await fs.readFile(path))});
const evidence={schemaVersion:1,date:'2026-10-23',passed:true,frozen:!!review,source1to1Verified:false,
  nativeRerunPending:false,
  finalNativeRerun:{passed:true,afterFinalProductionFreeze:true,verification:dir+'/native-final-rerun-verification.json',archivedFirstPass:rerun.archivedFirstPass,archivedFirstPassManifestSha256:rerun.archivedFirstPassManifestSha256,unchangedOtherCaptures:rerun.unchangedOtherCaptures,nick:{...rerun.nick,sheet:nick.sheet,sheetSha256:nick.sha256,sourceImage:nick.normalization.rows.find(row=>row.phase==='super').sourceImage,sourceImageSha256:nick.normalization.rows.find(row=>row.phase==='super').sourceImageSha256}},
  retainedBaseEvidence:{passed:true,verification:dir+'/base-evidence-scope-verification.json',snapshot:baseScope.snapshot,snapshotSha256:baseScope.snapshotSha256,baseRecords:baseScope.baseRecords,bodyDrawsRetained:baseScope.bodyDrawsRetained,janineReusedDrawsRetained:baseScope.janineReusedDrawsRetained,reason:'Every dedicated base entry, PNG, actor, runtime layout, registry and renderer dependency matches the saved scope exactly; the Nick native super correction does not affect base evidence.'},
  nativeHeroEntries:native.characters,full32Count:native.full32Count,partialCount:native.partialCount,partialPoses:native.partialPoses,partialDetails:native.partialDetails,
  nativePhases:native.phases,nativeDrawImageCalls:native.actualFrameDraws,gorillaFallbackDraws:native.humanFallbackFrameDraws,janineReusedPresentationDraws:native.janineReusedPresentationDraws,
  nativeCallsIncludingFallback:native.realDrawImageCalls,baseHeroes:base.newCharacters+base.legacyCharacters,newBaseHeroes:base.newCharacters,baseDrawImageCalls:base.totalFrameDraws,
  janineReusedOrdinaryDraws:base.adaptedPresentationFallbackDraws,baseCallsIncludingReuse:base.realDrawImageCalls,
  historical:{nativeAssetRecordsAndPngHashes:native.historicalAssetRecordsUnchanged,nativeDrawGeometry:native.historicalDrawGeometryUnchanged,baseRecords:base.historicalBaseRecordsUnchanged,basePngHashes:base.historicalPngHashesUnchanged,baseDrawGeometry:base.historicalGeometryUnchangedDraws,fullMeleeManifests:native.historicalFullMeleeManifestsUnchanged,summonAssetsAndHashes:native.historicalSummonAssetRecordsAndPngHashesUnchanged,reportsOverwritten:false,evidence:historicalEvidence},
  geometry:{complete256pxSourceCells:true,calibratedBaseline244:true,preWave6LegacyBaseline232:true,mirroredP2:true,actorMutation:false,assetRegistryMutation:false,baseLayoutMutation:false,authoritativeProgressChecks:native.fixedProgressFrames,crossedIdentityRejections:native.rejectedCrossedIdentities},
  frozenPartAInputs:{passed:true,files:delivery.artifacts.length,manifest:'docs/combat-fidelity-wave10-2026-10-23/part-a-delivery.json',manifestSha256:sha(await fs.readFile('docs/combat-fidelity-wave10-2026-10-23/part-a-delivery.json'))},
  visualReview:{newPresentationCaptures:native.captures.length,newDedicatedBaseCaptures:base.captures.length,reusedJanineCapture:dir+'/janine-base-reuse.png',montageFiles,reviewed:review?.reviewedArtifacts.map(item=>item.path)??[],notes:review?.notes??'Pending explicit visual inspection. Real captures contain whole source cells on both sides; these montage crops are diagnostic selection views, not additional art.'},
  missingNativeHeroIds:native.missingNativeHeroIds,errors:[...native.errors,...base.errors],externalRequestLimitations:native.failedRequests,artifacts};
await fs.writeFile(dir+'/evidence.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({passed:true,nativeDraws:native.actualFrameDraws,baseDraws:base.totalFrameDraws,montages:montageFiles.length,reviewPending:!review,frozen:!!review}));
