import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { resourcePaths as senuaResourcePaths } from './senua-sources/browser/collect-senua-evidence.mjs';
import { root, prefix, read, json, sha, fingerprint, verifyFile, verifyHashes, walk,
  historicalBaseline, effectiveBatchPlan, assertDeliveryReady, writeReports, time } from './closure-support.mjs';

assert.ok(process.argv.includes('--all-production-owners-finished'));
historicalBaseline();
const audit = measureCombatFidelity(); assertDeliveryReady(audit);
const refresh = json(prefix + 'rift-refresh/result.json');
assert.equal(refresh.success, true); assert.equal(refresh.steps.length, 5);
assert.equal(refresh.sourceFilesUnchanged, true); assert.equal(refresh.availabilityUnchanged, true);
verifyHashes(refresh.sourceFilesAfter);
Object.values(refresh.outputsAfter).forEach(verifyFile);
for (const step of refresh.steps) {
  assert.equal(step.exitCode, 0); assert.equal(step.signal, null); assert.equal(step.spawnError, null);
  assert.equal(step.receiptOrigin, 'node-child-process-close-event');
  assert.equal(sha(read(step.log)), step.logSha256);
}
const plan = effectiveBatchPlan(), freezePath = prefix + 'production-freeze.json';
const mutableExecution = file => file === freezePath
  || file.startsWith('docs/tactics-universes-2026-10-28/')
    && file !== 'docs/tactics-universes-2026-10-28/README.md'
    && !/\.(?:js|jsx|mjs|py)$/.test(file)
  || file.startsWith(prefix)
  && ((file.includes('/browser/') && !/\.(?:js|jsx|mjs|py)$/.test(file))
    || path.posix.dirname(file) === prefix.slice(0, -1)
      && (file.endsWith('.png')
        || /(?:-result|-visual-review(?:-final)?|browser-checks|deliverables|static-check-results|validation|build-exit|current)\.json$/.test(file)));
const files = new Set([
  ...senuaResourcePaths,
  'docs/tactics-universes-2026-10-28/source-plan-before.json',
  'docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json',
  ...Object.keys(audit.inputHashes).filter(file => !mutableExecution(file)),
  ...walk('src'), ...walk('scripts', file => /\.(?:js|mjs|json|py)$/.test(file)),
  ...walk(prefix.slice(0, -1), file => /\.(?:js|jsx|mjs|py)$/.test(file)),
  ...audit.assetInventory.sheets.map(sheet => 'public' + sheet),
  // Presentation regression checks also read these retained historical fallbacks.
  ...walk('public/sprites/generated/heroes/star-wars', file => file.endsWith('.png')),
  ...plan.reviewedRows.map(row => row.referenceAsset && 'public' + row.referenceAsset).filter(Boolean),
  'public/sprites/generated/bosses/oddworld/slig.png', 'package.json', 'package-lock.json'
]);
const createdAt = new Date().toISOString(); assert.ok(time(refresh.finishedAt) <= time(createdAt));
const result = { schemaVersion: 1, productionFrozen: true, createdAt,
  riftCompletedBeforeFreeze: true, postFreezeWritesPermitted: false,
  riftReceipt: fingerprint(prefix + 'rift-refresh/result.json'),
  files: Object.fromEntries([...files].sort().map(file => [file, sha(read(file))])),
  reason: 'All W16 production owners and tools are complete. Every final proof must start after this freeze; no SHA transition is allowed.' };
if (fs.existsSync(path.resolve(root, freezePath))) {
  const archive = prefix + 'production-freeze-before-' + createdAt.replace(/[^0-9]/g, '') + '.json';
  if (!process.argv.includes('--check-only')) fs.copyFileSync(path.resolve(root, freezePath), path.resolve(root, archive));
  result.previousFreezeArchive = archive;
}
writeReports([[freezePath, result]]);
console.log(JSON.stringify({ productionFrozen: !process.argv.includes('--check-only'), createdAt, files: files.size, postFreezeWritesPermitted: false }));
