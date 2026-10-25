// Run once all production owners declare their actual files complete.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resourcePaths as ripleyResources } from './ripley-sources/browser/collect-ripley-evidence.mjs';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
const root = fileURLToPath(new URL('../../',import.meta.url));
const directory = fileURLToPath(new URL('./',import.meta.url));
assert.ok(process.argv.includes('--all-production-owners-finished'));
const read = relative => fs.readFileSync(path.resolve(root,relative));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function walk(relative){return fs.readdirSync(path.resolve(root,relative),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(relative+'/'+entry.name):[relative+'/'+entry.name]);}
const audit = measureCombatFidelity(), plan = JSON.parse(read('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json'));
assert.equal(audit.batch.actualCharacterIds.length,40);
const files = new Set([...walk('src'),...ripleyResources,'package.json','package-lock.json',...audit.assetInventory.sheets.map(sheet=>'public'+sheet),...plan.heroes.map(entry=>'public'+entry.referenceAsset)]);
const result = {schemaVersion:1,productionFrozen:true,createdAt:new Date().toISOString(),files:Object.fromEntries([...files].sort().map(file=>[file,sha(read(file))])),
  reason:'All W13 production owners have finished. Final browser proofs begin after this snapshot; prior preliminary reports remain separate.',
  intentionalPostBrowserTransition:{path:'src/game/riftDossierAssets.json',beforeSha256:sha(read('src/game/riftDossierAssets.json')),
    boundTo:'rift-refresh/result.json generatedSha256Before/generatedSha256After; final writes require all browsers closed and real step02 success.'}};
const output = path.join(directory,'production-freeze.json');
if(fs.existsSync(output)){
  const previous=JSON.parse(fs.readFileSync(output));
  const name='production-freeze-before-'+result.createdAt.replace(/[^0-9]/g,'')+'.json';
  fs.copyFileSync(output,path.join(directory,name));
  result.previousFreezeArchive='docs/combat-fidelity-wave13-2026-10-24/'+name;
  result.changedSincePreviousFreeze=Object.keys(result.files).filter(file=>result.files[file]!==previous.files[file]);
  result.reason='The first source freeze preceded discovery of an inherited Wave7 body lunge in selected Wave13 source versions. It was superseded before any final browser run. Final proofs must start after this corrected production freeze; references, PNGs and package remain unchanged.';
}
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({productionFrozen:true,createdAt:result.createdAt,files:files.size}));
