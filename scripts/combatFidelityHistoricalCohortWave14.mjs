import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';

// Reconstruct the exact pre-W14 cohort from its independently frozen records.
// Live source-version behavior is tested separately by the W14 kit/runtime tests.
const bytes = readFileSync(new URL('../docs/combat-fidelity-wave14-2026-10-25/batch-plan-before.json', import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'), '458be3e604ee16a49b06da0d355c9328db7b9799a9bda242679702db201918f0');
const rows = JSON.parse(bytes).heroes;
export const WAVE14_PRESENTATION_IDS = new Set(rows.map(row => row.hero.id));
export const WAVE14_NEW_ABILITY_IDS = new Set(rows.filter(row => !row.alreadyAuthored).map(row => row.hero.id));
assert.equal(WAVE14_PRESENTATION_IDS.size, 40);
assert.equal(WAVE14_NEW_ABILITY_IDS.size, 12);
assert.equal(rows.filter(row => row.priorAuthored).length, 28);

export const HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE14 = Object.fromEntries(
  Object.entries(COMBAT_ABILITY_OVERRIDES).filter(([id]) => !WAVE14_NEW_ABILITY_IDS.has(id))
);
for (const row of rows) if (row.priorAuthored) {
  assert.ok(Object.hasOwn(COMBAT_ABILITY_OVERRIDES, row.hero.id), row.hero.id);
  HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE14[row.hero.id] = row.priorAuthored;
}

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
const prior = summarize(HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE14), current = summarize(COMBAT_ABILITY_OVERRIDES);
export const WAVE14_ABILITY_COUNT_DELTA = Object.fromEntries(Object.keys(prior).map(key => [key, current[key] - prior[key]]));
// Twelve new full kits plus the Traveller's previously absent third slot.
assert.deepEqual(WAVE14_ABILITY_COUNT_DELTA, { authoredHeroes: 12, authoredSlots: 37, completeThreeSlotKits: 13, partialSlotKits: -1 });
