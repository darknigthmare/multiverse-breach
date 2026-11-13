import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { prepareSourceSignature } from '../src/game/signatureSourceKits.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { getHeroSpriteSheetSrc, getEnemySpriteSheetSrc } from '../src/game/spriteAssets.js';

const folder = new URL('../docs/assets/p0-p1-p2-continuation-02-2026-11-13/gears-deadspace-040/', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, folder)));
const write = (file, data) => fs.writeFileSync(new URL(file, folder), JSON.stringify(data, null, 2) + '\n');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const before = JSON.parse(gunzipSync(fs.readFileSync(new URL('baseline-runtime.json.gz', folder))));
const selection = read('reserved-actors.json');
const semantic = profile => profile && Object.fromEntries(Object.entries(profile).filter(([key]) => !['provenance', 'sourceAbility'].includes(key)));
assert.equal(before.sourceCommit, selection.sourceCommit);
assert.equal(before.rows.length, 40);
const rows = before.rows.map(row => {
  const universe = row.actor.universe;
  const actor = row.kind === 'hero' ? HEROES_DB.find(hero => hero.id === row.actor.id && hero.universe === universe)
    : { ...(row.kind === 'worldBoss' ? ENEMIES_DB[universe].worldBoss : ENEMIES_DB[universe][row.kind === 'boss' ? 'bosses' : 'monsters'].find(actor => actor.name === row.actor.name)), universe };
  assert.ok(actor?.name, row.actorKey);
  const prepared = structuredClone(actor), sourceKitKey = prepareSourceSignature(prepared)?.key || null;
  const resolved = {}, preparedResolved = {};
  for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    resolved[slot] = resolveCombatAbility(actor, slot); preparedResolved[slot] = resolveCombatAbility(prepared, slot);
    assert.deepEqual(semantic(resolved[slot]), semantic(row.resolved[slot]), row.actorKey + ':' + slot);
    assert.deepEqual(semantic(preparedResolved[slot]), semantic(row.preparedResolved[slot]), row.actorKey + ':' + slot + ':prepared');
  }
  assert.equal(sourceKitKey, row.sourceKitKey);
  for (const key of ['id', 'name', 'universe', 'stats', 'hp', 'atk', 'def', 'spd']) assert.deepEqual(actor[key], row.actor[key]);
  if (row.kind === 'hero') for (const mode of ['auto', 'rpg', 'melee']) assert.equal(getHeroSpriteSheetSrc(actor, mode), getHeroSpriteSheetSrc(row.actor, mode));
  else assert.equal(getEnemySpriteSheetSrc(actor), getEnemySpriteSheetSrc(row.actor));
  const backlog = buildActorFidelityBacklog(actor, { kind: row.kind, rasterProbes: row.backlog.rasterProbes, sourceCommit: selection.sourceCommit });
  return { actorKey: row.actorKey, kind: row.kind, actor, resolved, prepared, preparedResolved, sourceKitKey, backlog };
});
const count = rows => rows.reduce((sum, row) => {
  for (const task of row.backlog.tasks) sum[task.priority] = (sum[task.priority] || 0) + 1;
  return sum;
}, {});
const removedCounts = {}, addedCounts = {};
const actors = rows.map(row => {
  const previous = before.rows.find(old => old.actorKey === row.actorKey);
  const oldCodes = previous.backlog.tasks.map(task => task.code), newCodes = row.backlog.tasks.map(task => task.code);
  const removed = oldCodes.filter(code => !newCodes.includes(code)), added = newCodes.filter(code => !oldCodes.includes(code));
  for (const code of removed) {
    assert.ok(['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING', 'GENERIC_TECHNIQUE_NAMES'].includes(code));
    removedCounts[code] = (removedCounts[code] || 0) + 1;
  }
  for (const code of added) { assert.equal(code, 'REFERENCE_SCENE_REVIEW'); addedCounts[code] = (addedCounts[code] || 0) + 1; }
  assert.deepEqual(row.backlog.missingRasterPaths, previous.backlog.missingRasterPaths);
  return { actorKey: row.actorKey, name: row.actor.name, removed, added,
    remainingP1: row.backlog.tasks.filter(task => task.priority === 'P1').map(task => task.code),
    source1to1Verified: false, artApproved: false };
});
const runtimeFiles = [...['GearsOfWar', 'DeadSpace'].flatMap(pack => [
  `DLC/${pack}/manifest.json`, ...['actorSourceContracts', 'heroes', 'enemies', 'loreAccuratePacks'].map(name => `DLC/${pack}/data/${name}.js`)
]), 'DLC/GearsOfWar/data/loreWorldBossOverrides.js', 'src/game/combat/combatSourceDefinitionsWave15PartC.js'];
const testFiles = ['scripts/gearsDeadSpaceSourceContracts20261113.test.mjs', 'scripts/gearsDeadSpaceCatalogEditions20261113.mjs',
  'scripts/gearsDeadSpaceHammondAuthoringErratum20261113.mjs', 'scripts/gearsDeadSpaceSourceDelta20261113.mjs',
  'scripts/combatCanonicalEditionFixtures.mjs', 'scripts/combatFidelityHistoricalCohortWave17.mjs', 'scripts/combatFidelityWave15.test.mjs'];
const pin = path => ({ path, sha256: hash(fs.readFileSync(new URL('../' + path, import.meta.url))) });
fs.writeFileSync(new URL('runtime-after.json.gz', folder), gzipSync(JSON.stringify({ sourceCommit: selection.sourceCommit,
  snapshotScope: 'Working tree files pinned in delta.json; sourceCommit denotes the before baseline only.', node: process.version, rows }), { level: 9 }));
write('delta.json', { schemaVersion: 1, baselineCommit: selection.sourceCommit, actorCount: rows.length,
  before: count(before.rows), after: count(rows), removedCounts, addedCounts,
  resolvedSlotLookupsUnchanged: 160, effectiveHeroSlotsUnchanged: 60, preparedSlotLookupsUnchanged: 160,
  sourceSignatureKitChanges: 0, rasterChanges: 0, artApprovals: 0, closedActorDossiers: 0,
  note: 'Raw generic labels were already supplied by existing resolved kits. This projection aligns catalog labels and source contracts; it does not grant new techniques or certify images/animation.',
  unresolved: ['Necromorph Infector Pod canonical source/edition/model remain unresolved; T-Virus wording removed only.',
    'hammond_ds retains its distinct historical ID and old mechanics; dedicated source-action review remains open.',
    'Scene/model comparisons, eight costume/animation dimensions and all missing rasters remain open.'],
  runtimeSourceFiles: runtimeFiles.map(pin), testSourceFiles: testFiles.map(pin),
  immutableEvidence: ['reserved-actors.json', 'baseline-runtime.json.gz'].map(file => ({ file, sha256: hash(fs.readFileSync(new URL(file, folder))) })),
  actors });
console.log(JSON.stringify({ actors: rows.length, before: count(before.rows), after: count(rows), removedCounts, addedCounts }));
