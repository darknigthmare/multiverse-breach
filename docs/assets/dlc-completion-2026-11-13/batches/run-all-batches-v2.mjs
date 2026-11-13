// Reproduce this validation from the repository root with Node22. The reusable
// verifier remains in scripts/; this is the recorded four-pipe execution recipe.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { validateDlcAssetBatch, verifyDlcAssetBatchPlan } from '../../../../scripts/dlcAssetBatches.mjs';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const recipeDirectory = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(recipeDirectory, 'verified-v2');
const plan = JSON.parse(fs.readFileSync(path.join(out, 'all-plan.json'), 'utf8'));
const history = JSON.parse(fs.readFileSync(path.join(recipeDirectory, '../historical-lfs/verified-historical-lfs-map.json'), 'utf8'));
const workers = 4;
const started = Date.now();
const coreCache = path.join(root, '.git/lfs/objects');
function fileInventory(directory) {
  const records = [];
  function walk(current) {
    if (!fs.existsSync(current)) return;
    for (const name of fs.readdirSync(current)) {
      const file = path.join(current, name), stat = fs.lstatSync(file);
      if (stat.isDirectory() && !stat.isSymbolicLink()) walk(file);
      else records.push([path.relative(directory, file), stat.size, stat.mtimeMs, stat.isSymbolicLink()]);
    }
  }
  walk(directory);
  records.sort((a,b) => a[0].localeCompare(b[0]));
  return { files: records.length, bytes: records.reduce((sum,item) => sum+item[1],0),
    sha256: createHash('sha256').update(JSON.stringify(records)).digest('hex') };
}
const cacheBefore = fileInventory(coreCache);
const initialTmp = new Set(fs.readdirSync('/tmp').filter(name => name.startsWith('multiverse-dlc-batch-')));
let peakTemporaryBytes = 0, peakProviderDirectories = 0, minimumTmpFreeBytes = Infinity, peakNodeRss = 0;
function sample() {
  let total = 0, directories = 0;
  for (const name of fs.readdirSync('/tmp').filter(name => name.startsWith('multiverse-dlc-batch-') && !initialTmp.has(name))) {
    const directory = path.join('/tmp',name);
    try {
      const marker = JSON.parse(fs.readFileSync(path.join(directory,'.owner.json'),'utf8'));
      if (marker.revision !== plan.sourceRevision) continue;
      const inventory = fileInventory(directory); total += inventory.bytes; directories++;
    } catch (error) { if (!['ENOENT','ENOTDIR'].includes(error.code)) throw error; }
  }
  peakTemporaryBytes = Math.max(peakTemporaryBytes,total);
  peakProviderDirectories = Math.max(peakProviderDirectories,directories);
  const volume=fs.statfsSync('/tmp'); minimumTmpFreeBytes=Math.min(minimumTmpFreeBytes,Number(volume.bavail)*Number(volume.bsize));
  peakNodeRss=Math.max(peakNodeRss,process.memoryUsage().rss);
}
const finished = new Map(); let cursor = 0, fatal = null;
function status() {
  const receipts = [...finished.values()], assets = receipts.flatMap(receipt=>receipt.assets);
  const kinds = {}, codes = {};
  for (const item of assets) {
    if (item.sourceKind) kinds[item.sourceKind]=(kinds[item.sourceKind]||0)+1;
    if (item.code) codes[item.code]=(codes[item.code]||0)+1;
  }
  return { sourceRevision:plan.sourceRevision,planSha256:plan.sha256,runnerSha256:plan.runner.implementationSha256,
    workers,batches:plan.batches.length,finishedBatches:receipts.length,
    passedBatches:receipts.filter(item=>item.status==='PASSED').length,
    unavailableBatches:receipts.filter(item=>item.status!=='PASSED').length,
    pendingBatches:plan.batches.length-receipts.length,
    passedAssets:assets.filter(item=>item.status==='PASSED').length,
    unavailableAssets:assets.filter(item=>item.status!=='PASSED').length,
    rasterDecoded:assets.filter(item=>item.decode?.status==='PASSED').length,
    integrityOnly:assets.filter(item=>item.decode?.status==='NOT_APPLICABLE').length,
    verifiedPayloadBytes:assets.filter(item=>item.status==='PASSED').reduce((sum,item)=>sum+item.bytes,0),
    sourceKinds:kinds,unavailableCodes:codes,elapsedSeconds:Math.round((Date.now()-started)/1000),
    configuredMaximumTemporaryBytes:workers*plan.limits.maxTempBytes,
    observedTemporaryBytesPeak:peakTemporaryBytes,observedProvidersPeak:peakProviderDirectories,
    sampledMinimumTmpFreeBytes:minimumTmpFreeBytes,sampledNodeRssPeak:peakNodeRss,
    observationLimits:'Two-second and batch-boundary disk/RSS samples; RSS excludes subprocesses. Configured source-provider limits remain enforced independently.',
    fatalCode:fatal?.code||null,scope:'Canonical byte integrity and raster decoding in bounded temporary batches; no assembled production distribution or source-fidelity certification.' };
}
function record() {
  const file=path.join(out,'run-summary.json'), temporary=file+'.tmp';
  fs.writeFileSync(temporary,JSON.stringify(status(),null,2)+'\n');fs.renameSync(temporary,file);
}
await verifyDlcAssetBatchPlan({root,plan});
sample();
const timer=setInterval(()=>{ try {sample();record();} catch(error) {fatal={code:'RESOURCE_OBSERVATION_FAILED'};} },2000);
async function pipe() {
  while(!fatal) {
    const index=cursor++;if(index>=plan.batches.length)return;
    const batch=plan.batches[index];
    try {
      const receipt=await validateDlcAssetBatch({root,plan,batchId:batch.id,receiptDir:path.join(out,'all'),allowLfsFetch:true,verifiedHistoricalLfsMap:history});
      finished.set(batch.id,receipt);sample();record();
      console.log(JSON.stringify({batch:batch.id,status:receipt.status,reused:Boolean(receipt.reused),...status()}));
    } catch(error) {fatal={code:error.code||'BATCH_RUN_FATAL'};console.error(JSON.stringify({batch:batch.id,fatal:fatal.code}));}
  }
}
try {await Promise.all(Array.from({length:workers},()=>pipe()));}
finally {
 clearInterval(timer);sample();
 const cacheAfter=fileInventory(coreCache);
 const cleanupLeftovers=fs.readdirSync('/tmp').filter(name=>name.startsWith('multiverse-dlc-batch-')&&!initialTmp.has(name));
 const final={...status(),coreLfsCacheBefore:cacheBefore,coreLfsCacheAfter:cacheAfter,
   coreLfsCacheUnchanged:cacheBefore.sha256===cacheAfter.sha256,temporaryDirectoriesLeft:cleanupLeftovers,
   finalCodeCheckpoint:plan.runner.gitHeadAtPlanCreation};
 fs.writeFileSync(path.join(out,'run-summary.json'),JSON.stringify(final,null,2)+'\n');console.log(JSON.stringify(final));
 if(fatal||final.pendingBatches||final.unavailableAssets||!final.coreLfsCacheUnchanged||cleanupLeftovers.length)process.exitCode=1;
}
