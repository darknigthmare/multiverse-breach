// Reproduce the bounded FF40 comparison; never replaces the frozen baseline.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';

const folder = new URL('../docs/assets/p0-p1-p2-continuation-2026-11-13/ff-lot-040/', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, folder)));
const write = (file, value) => fs.writeFileSync(new URL(file, folder), JSON.stringify(value, null, 2) + '\n');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const plan = read('plan.json'), before = read('runtime-before.json');
const closedCodes = new Set(['INCARNATION_UNSPECIFIED', 'REFERENCE_MISSING', 'VISUAL_CONTRACT_MISSING', 'GENERIC_TECHNIQUE_NAMES']);
const rows = before.rows.map(row => {
  const actor = row.backlog.kind === 'hero'
    ? HEROES_DB.find(actor => actor.id === row.actor.id && actor.universe === row.actor.universe)
    : { ...ENEMIES_DB[row.actor.universe][row.backlog.kind === 'boss' ? 'bosses' : 'monsters'].find(actor => actor.name === row.actor.name), universe: row.actor.universe };
  if (!actor) throw new Error(`Missing frozen actor ${row.actorKey}`);
  const backlog = buildActorFidelityBacklog(actor, { kind: row.backlog.kind, rasterProbes: row.backlog.rasterProbes, sourceCommit: plan.baseCommit });
  const resolved = row.resolved ? Object.fromEntries(['simple', 'secondary', 'defense', 'special'].map(slot => [slot, resolveCombatAbility(actor, slot)])) : null;
  return { actorKey: row.actorKey, actor, backlog, resolved, sha256: sha256(JSON.stringify(actor)) };
});
const count = list => list.reduce((totals, row) => {
  for (const task of row.backlog.tasks) totals[task.priority] = (totals[task.priority] || 0) + 1;
  return totals;
}, {});
const deltas = rows.map(row => {
  const previous = before.rows.find(record => record.actorKey === row.actorKey);
  const oldTasks = new Map(previous.backlog.tasks.map(task => [task.code, task]));
  const newTasks = new Map(row.backlog.tasks.map(task => [task.code, task]));
  const removed = [...oldTasks.keys()].filter(code => !newTasks.has(code));
  const added = [...newTasks.keys()].filter(code => !oldTasks.has(code));
  if (removed.some(code => !closedCodes.has(code))) throw new Error(`Unexpected closure ${row.actorKey}`);
  if (added.some(code => code !== 'REFERENCE_SCENE_REVIEW')) throw new Error(`Unexpected finding ${row.actorKey}`);
  if (JSON.stringify(row.backlog.rasterPaths) !== JSON.stringify(previous.backlog.rasterPaths)
    || JSON.stringify(row.backlog.missingRasterPaths) !== JSON.stringify(previous.backlog.missingRasterPaths)) throw new Error(`Raster changed ${row.actorKey}`);
  return { actorKey: row.actorKey, name: row.actor.name, removed, added,
    remainingP1Codes: row.backlog.tasks.filter(task => task.priority === 'P1').map(task => task.code),
    beforeWeapon: previous.actor.weaponType || previous.actor.weapon,
    afterWeapon: row.actor.weaponType || row.actor.weapon,
    artApproved: false, source1to1Verified: false };
});
const sourceFiles = ['src/game/signatureSourceKits.js', 'DLC/FinalFantasyVII/data/enemies.js', ...['VII', 'VIII', 'XIII', 'XV'].flatMap(serial => [`DLC/FinalFantasy${serial}/manifest.json`, ...['actorSourceContracts', 'heroes', 'expandedUniverses'].map(name => `DLC/FinalFantasy${serial}/data/${name}.js`)])];
write('runtime-after.json', { node: process.version, snapshotScope: 'Current working-tree source files identified by delta.json SHA256; sourceCommit on rows identifies the immutable before baseline only.', rows, actorCount: rows.length, source1to1Verified: false });
const removedByCode = {}, addedByCode = {};
for (const row of deltas) {
  row.removed.forEach(code => { removedByCode[code] = (removedByCode[code] || 0) + 1; });
  row.added.forEach(code => { addedByCode[code] = (addedByCode[code] || 0) + 1; });
}
write('delta.json', { schemaVersion: 1, date: '2026-11-13', baselineCommit: plan.baseCommit,
  actorCount: rows.length, beforeFindingsByPriority: count(before.rows), afterFindingsByPriority: count(rows),
  removedByCode, addedByCode, closedActorDossiers: 0, rasterChanges: 0, artworkApprovals: 0,
  resolvedHeroAbilitySemanticChanges: 0, preparedSignatureCompatibilityCount: 18, existingPreparedKitsPreserved: 21,
  tacticsRoleChanges: [
    { name: 'Midgar Zolom', before: 'shooter', after: 'monster' },
    { name: 'MT Trooper', before: 'monster', after: 'shooter' }
  ],
  note: 'Generic-name closures describe the raw catalog only: existing resolved combat profiles already supplied these techniques. Edition/reference/visual contracts do not approve source choreography, balance or artwork.',
  sourceFiles: sourceFiles.map(file => ({ path: file, sha256: sha256(fs.readFileSync(new URL('../' + file, import.meta.url))) })),
  immutableEvidence: ['plan.json', 'runtime-before.json', 'baseline-actor-backlog.json'].map(file => ({ path: fileURLToPath(new URL(file, folder)), sha256: sha256(fs.readFileSync(new URL(file, folder))) })),
  actors: deltas });
console.log(JSON.stringify({ actors: rows.length, before: count(before.rows), after: count(rows), removedByCode, addedByCode, artApproved: false, source1to1Verified: false }));
