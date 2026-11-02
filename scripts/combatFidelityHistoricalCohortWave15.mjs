import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE16 as COMBAT_ABILITY_OVERRIDES } from './combatFidelityHistoricalCohortWave16.mjs';

// W15 is exactly three independently selected groups of forty. Only these
// records may be projected backwards; every unrelated live record is hashed
// against the authoring union captured before any W15 runtime integration.
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const read = name => readFileSync(new URL(`../docs/combat-fidelity-wave15-2026-10-26/${name}`, import.meta.url));
const planBytes = read('batch-plan-before.json');
assert.equal(digest(planBytes), '08c143270255b5bc83fc051d37f5203351da868b232856d9f43a4dc943463dd1');
const plan = JSON.parse(planBytes), rows = plan.heroes;
const preservationBytes = read('baseline-authoring-preservation.json');
assert.equal(digest(preservationBytes), '93bbaa12de5eca049779a42aa1bde1deec8f3513c243d53506a3242a87dc63a1');
const preservation = JSON.parse(preservationBytes);
export const WAVE15_PRESENTATION_IDS = new Set(rows.map(row => row.hero.id));
export const WAVE15_NEW_ABILITY_IDS = new Set(rows.filter(row => !row.alreadyAuthored).map(row => row.hero.id));
export const WAVE15_PRIOR_AUTHORED_IDS = new Set(rows.filter(row => row.alreadyAuthored).map(row => row.hero.id));
assert.equal(WAVE15_PRESENTATION_IDS.size, 120);
assert.equal(WAVE15_NEW_ABILITY_IDS.size, 42);
assert.equal(WAVE15_PRIOR_AUTHORED_IDS.size, 78);
for (const ids of Object.values(plan.parts)) assert.equal(ids.length, 40);
assert.deepEqual(preservation.selectedPriorPresentationIds, []);
assert.equal(preservation.authoredCount, 1540);

const priorEntries = Object.entries(COMBAT_ABILITY_OVERRIDES).filter(([id]) => !WAVE15_NEW_ABILITY_IDS.has(id));
const prior = Object.fromEntries(priorEntries);
for (const row of rows) {
  const id = row.hero.id;
  assert.ok(Object.hasOwn(COMBAT_ABILITY_OVERRIDES, id), `${id}: W15 authoring is missing`);
  assert.equal(COMBAT_ABILITY_OVERRIDES[id].universe, row.hero.universe, `${id}: changed universe`);
  if (row.priorAuthored) {
    assert.equal(digest(JSON.stringify(row.priorAuthored)), preservation.recordHashes[id], `${id}: frozen prior record changed`);
    prior[id] = row.priorAuthored;
  } else assert.equal(Object.hasOwn(preservation.recordHashes, id), false, `${id}: not a new authoring identity`);
}
assert.deepEqual(Object.keys(prior).sort(), Object.keys(preservation.recordHashes).sort(), 'W15 changed identities outside its exact selected cohort');
for (const [id, record] of Object.entries(prior)) {
  assert.equal(digest(JSON.stringify(record)), preservation.recordHashes[id], `${id}: non-cohort authoring changed`);
}
export const HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE15 = Object.freeze(prior);
const slots = ['simple', 'secondary', 'defense'];
const summarize = records => {
  const kits = Object.values(records);
  return {
    authoredHeroes: kits.length,
    authoredSlots: kits.reduce((sum, kit) => sum + slots.filter(slot => kit[slot]).length, 0),
    completeThreeSlotKits: kits.filter(kit => slots.every(slot => kit[slot])).length,
    partialSlotKits: kits.filter(kit => slots.some(slot => kit[slot]) && !slots.every(slot => kit[slot])).length
  };
};
const before = summarize(prior), current = summarize(COMBAT_ABILITY_OVERRIDES);
assert.deepEqual(before, { authoredHeroes: 1540, authoredSlots: 4517, completeThreeSlotKits: 1468, partialSlotKits: 72 });
export const WAVE15_ABILITY_COUNT_DELTA = Object.freeze(Object.fromEntries(Object.keys(before).map(key => [key, current[key] - before[key]])));
// Forty-two new full kits and seven existing two-slot records gain their
// missing simple action. The seventy-one other revisions change no counts.
assert.deepEqual(WAVE15_ABILITY_COUNT_DELTA, { authoredHeroes: 42, authoredSlots: 133, completeThreeSlotKits: 49, partialSlotKits: -7 });
for (const id of WAVE15_PRESENTATION_IDS) assert.ok(slots.every(slot => COMBAT_ABILITY_OVERRIDES[id][slot]), `${id}: W15 kit is incomplete`);

// Project inventory cardinalities with exact paths from the immutable W14
// snapshot. New W15 registry filenames cannot silently become old evidence.
const inventoryBytes = read('baseline-preservation.json');
assert.equal(digest(inventoryBytes), plan.baselinePreservation.sha256);
const inventory = JSON.parse(inventoryBytes);
export const HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE15 = new Set(Object.keys(inventory.registries));
export const HISTORICAL_PNG_PATHS_BEFORE_WAVE15 = new Set(Object.keys(inventory.pngFiles));
assert.equal(HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE15.size, 118);
assert.equal(HISTORICAL_PNG_PATHS_BEFORE_WAVE15.size, 730);
