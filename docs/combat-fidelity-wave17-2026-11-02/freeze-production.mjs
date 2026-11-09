import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { prefix, root, read, json, sha, walk, assertDeliveryReady, validateInventory, effectiveBatchPlanWave17, writeReports } from './closure-support.mjs';

export function freezeProductionWave17() {
  const target = prefix + 'production-freeze.json';
  assert.equal(existsSync(path.resolve(root, target)), false, 'Archive a failed freeze before creating another; never overwrite it');
  const audit = measureCombatFidelity();
  assertDeliveryReady(audit); validateInventory(audit);
  const paths = new Set(Object.keys(audit.inputHashes));
  const unionPath = prefix + 'proof-source-union.json';
  const union = json(unionPath);
  assert.equal(union.wave, 17);
  assert.equal(union.fileCount, Object.keys(union.files).length);
  assert.equal(union.filesSha256, sha(Buffer.from(JSON.stringify(union.files))));
  for (const [file, expected] of Object.entries(union.files)) {
    assert.equal(sha(read(file)), expected, 'Source union became stale before freezing: ' + file);
    paths.add(file);
  }
  paths.add(unionPath);
  for (const file of walk('src')) paths.add(file);
  paths.add('index.html'); paths.add('vite.config.js');
  for (const file of walk('scripts', file => /\.(?:js|jsx|mjs|py)$/.test(file))) paths.add(file);
  for (const directory of [prefix.slice(0, -1), 'docs/tactics-universes-2026-11-02'])
    for (const file of walk(directory, file => /\.(?:js|jsx|mjs|py)$/.test(file))) paths.add(file);
  for (const sheet of audit.assetInventory.sheets) paths.add('public' + sheet);
  for (const registry of audit.assetInventory.registries) paths.add(registry);
  // These fallbacks are outside the new production registries but remain live
  // after refusals. Preserve both old Obi-Wan paths rather than choosing one.
  for (const file of walk('public/sprites/generated/heroes/star-wars', file => file.endsWith('.png'))) paths.add(file);
  for (const file of walk(prefix.slice(0, -1), file => /\/withheld[^/]*reference[^/]*\.json$/.test(file))) {
    if (!existsSync(path.resolve(root, file))) continue;
    paths.add(file);
    for (const row of json(file).records) paths.add('public' + row.referenceAsset);
  }
  const plan = effectiveBatchPlanWave17();
  for (const item of plan.amendments) paths.add(item.path);
  const files = Object.fromEntries([...paths].sort().map(file => [file, sha(read(file))]));
  const freeze = { schemaVersion: 1, wave: 17, date: '2026-11-02', createdAt: new Date().toISOString(), productionFrozen: true,
    files, fileCount: Object.keys(files).length, filesSha256: sha(Buffer.from(JSON.stringify(files))),
    source1to1Verified: false, permittedPostBrowserShaTransitions: [],
    scope: 'Complete production sources, all helper code including browser .js, accepted native sources and metadata, primary PDF/JPG references, current registry PNGs and retained refusal fallbacks. Build/browser result artifacts are verified separately.' };
  writeReports([[target, freeze]]);
  return freeze;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv.includes('--after-art-and-runtime-checks'), 'Complete actual art, mechanics, Rift refresh and checks first');
  const freeze = freezeProductionWave17();
  console.log(JSON.stringify({ productionFrozen: true, files: freeze.fileCount, sha256: freeze.filesSha256 }));
}
