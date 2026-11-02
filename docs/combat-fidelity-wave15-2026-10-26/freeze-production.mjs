// Run once all production owners declare their actual files complete.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { historicalBaseline, validateInventory, assertDeliveryReady, writeReports, expected } from './closure-support.mjs';
import { validateCompletedRift,completedArchivePath } from './rift-review-support.mjs';
const root = fileURLToPath(new URL('../../',import.meta.url));
const directory = fileURLToPath(new URL('./',import.meta.url));
assert.ok(process.argv.includes('--all-production-owners-finished'));
const resourceModule = new URL('./sir-daniel-sources/browser/collect-sir-daniel-evidence.mjs', import.meta.url);
assert.ok(fs.existsSync(resourceModule), 'Finish the Sir Daniel resource collector before freezing production');
const { resourcePaths: sirDanielResources } = await import(resourceModule);
assert.ok(Array.isArray(sirDanielResources) && sirDanielResources.length > 0);
const read = relative => fs.readFileSync(path.resolve(root,relative));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function walk(relative){return fs.readdirSync(path.resolve(root,relative),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(relative+'/'+entry.name):[relative+'/'+entry.name]);}
const audit = measureCombatFidelity(), plan = JSON.parse(read('docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json'));
assert.equal(audit.batch.actualCharacterIds.length,expected.characters);
historicalBaseline(); validateInventory(audit);assertDeliveryReady(audit);
const files = new Set([...walk('src'),...walk('scripts').filter(file=>/\.(?:mjs|js|py)$/.test(file)),...walk('docs/combat-fidelity-wave15-2026-10-26').filter(file=>/\.(?:mjs|py)$/.test(file)),...sirDanielResources,'package.json','package-lock.json','docs/tactics-terrain-verticality.md',...walk('docs/tactics-universes-2026-10-26').filter(file=>/\.(?:mjs|py)$/.test(file)),...audit.assetInventory.sheets.map(sheet=>'public'+sheet),...plan.heroes.map(entry=>'public'+entry.referenceAsset)]);
const result = {schemaVersion:1,productionFrozen:true,createdAt:new Date().toISOString(),files:Object.fromEntries([...files].sort().map(file=>[file,sha(read(file))])),
  reason:'All W15 production owners have finished. Final browser proofs begin after this snapshot; prior preliminary reports remain separate.',
  intentionalPostBrowserTransition:{path:'src/game/riftDossierAssets.json',beforeSha256:sha(read('src/game/riftDossierAssets.json')),
    boundTo:'rift-refresh/result.json generatedSha256Before/generatedSha256After; final writes require all browsers closed and real step02 success.'}};
const refreshPath=path.join(directory,'rift-refresh/result.json');
if(fs.existsSync(refreshPath)&&JSON.parse(fs.readFileSync(refreshPath)).success===true){
  const completed=validateCompletedRift();
  result.riftReviewMode='completed-refresh-revalidation';
  result.completedRiftAtFreeze=completed.snapshot;
  result.intentionalPostBrowserTransition=null;
  result.files[completedArchivePath]=sha(read(completedArchivePath));
  assert.ok(Date.parse(completed.refresh.finishedAt)<=Date.parse(result.createdAt));
}
const output = path.join(directory,'production-freeze.json');
if(fs.existsSync(output)){
  const previous=JSON.parse(fs.readFileSync(output));
  const name='production-freeze-before-'+result.createdAt.replace(/[^0-9]/g,'')+'.json';
  if(!process.argv.includes('--check-only'))fs.copyFileSync(output,path.join(directory,name));
  result.previousFreezeArchive='docs/combat-fidelity-wave15-2026-10-26/'+name;
  result.changedSincePreviousFreeze=Object.keys(result.files).filter(file=>result.files[file]!==previous.files[file]);
  result.reason='A prior snapshot was explicitly superseded after production changes. Final browser proofs must start after this snapshot, and every previous attempt remains archived.';
}
writeReports([['docs/combat-fidelity-wave15-2026-10-26/production-freeze.json',result]]);
console.log(JSON.stringify({productionFrozen:!process.argv.includes('--check-only'),checkOnly:process.argv.includes('--check-only'),createdAt:result.createdAt,files:Object.keys(result.files).length}));
