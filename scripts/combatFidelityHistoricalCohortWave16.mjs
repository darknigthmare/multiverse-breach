import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { effectiveBatchPlan } from '../docs/combat-fidelity-wave16-2026-10-28/closure-support.mjs';

// W16 reviews120 initial identities plus4 separately planned additions; the
// effective drawing cohort stays120. Restore only these124 complete records.
const directory = 'docs/combat-fidelity-wave16-2026-10-28/';
const read = file => readFileSync(new URL('../' + directory + file, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const planBytes = read('batch-plan-before.json');
assert.equal(hash(planBytes), 'ea8800d8e9ecde3b9cd47a8da9dab3493a41e0ff092e9d62b9c7e6682b162bf6');
const plan = JSON.parse(planBytes), receipt = JSON.parse(read('baseline-receipt.json'));
const baselineBytes = read('baseline-authored-abilities.json');
assert.equal(hash(baselineBytes), receipt.files[directory + 'baseline-authored-abilities.json']);
const baseline = JSON.parse(baselineBytes);
const effective = effectiveBatchPlan();
export const WAVE16_PRESENTATION_IDS = new Set(Object.values(effective.parts).flat());
export const WAVE16_REVIEWED_IDS = new Set(effective.reviewedIds);
assert.equal(WAVE16_PRESENTATION_IDS.size, 120);
assert.equal(WAVE16_REVIEWED_IDS.size, 124);
assert.equal(Object.keys(baseline).length, 1582);
for (const part of Object.values(plan.parts)) assert.equal(part.length, 40);
assert.ok(plan.heroes.every(row => row.alreadyAuthored && row.priorAuthored));

export function projectAbilitiesBeforeWave16(current) {
  assert.deepEqual(Object.keys(current).sort(), Object.keys(baseline).sort(), 'W16 must not add or remove authoring identities');
  const result = {};
  for (const [id, prior] of Object.entries(baseline)) {
    const live = current[id];
    if (!WAVE16_REVIEWED_IDS.has(id)) {
      assert.deepEqual(live, prior, id + ': authoring outside the W16 cohort changed');
      result[id] = live;
      continue;
    }
    assert.equal(live.universe, prior.universe, id + ': source universe changed');
    if (JSON.stringify(live) !== JSON.stringify(prior)) {
      assert.equal(live.versionRevision, 'wave16-explicit-source-version', id + ': missing explicit W16 revision');
      assert.equal(live.priorSourceReference, prior.sourceReference, id + ': prior provenance was not retained');
      assert.equal(typeof live.sourceReference, 'string');
      assert.ok(live.sourceReference.length > 0, id + ': missing current provenance');
    }
    result[id] = prior;
  }
  return Object.freeze(result);
}

export const HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE16 = projectAbilitiesBeforeWave16(COMBAT_ABILITY_OVERRIDES);

// Presentation cardinalities in older tests describe the exact W15 inventory.
// Prove the live union before removing only the 120 separately planned new
// recipes; the callers still exercise every live recipe and all seven phases.
const presentationSnapshotBytes = read('baseline-current-wave15.json');
assert.equal(hash(presentationSnapshotBytes), 'd13914f9cf8a2175ca71d0b6c1fa8ca4b3ad04f98595a7314636531ec00dd5a2');
const presentationSnapshot = JSON.parse(presentationSnapshotBytes).presentations;
export const HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE16 = new Set(presentationSnapshot.entries.map(entry => entry.id));
assert.equal(HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE16.size, 441);
assert.equal(presentationSnapshot.scriptedHeroes, 440);
assert.deepEqual(presentationSnapshot.nonRosterRecipeHeroes, ['player_anchor']);
for (const id of WAVE16_PRESENTATION_IDS) assert.equal(HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE16.has(id), false,
  id + ': a revised historical presentation must not be subtracted as a new recipe');

export function projectPresentationIdsBeforeWave16(currentIds) {
  const ids = [...currentIds];
  assert.equal(new Set(ids).size, ids.length, 'Duplicate live presentation identity');
  assert.deepEqual([...ids].sort(), [...HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE16, ...WAVE16_PRESENTATION_IDS].sort(),
    'The live presentation union must preserve every historical identity and add only the exact W16 cohort');
  return ids.filter(id => !WAVE16_PRESENTATION_IDS.has(id));
}

export const HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE16 = new Set(Object.keys(JSON.parse(read('baseline-preservation.json')).registries));
export const HISTORICAL_PNG_PATHS_BEFORE_WAVE16 = new Set(Object.keys(JSON.parse(read('baseline-preservation.json')).pngFiles));
assert.equal(HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE16.size, 127);
assert.equal(HISTORICAL_PNG_PATHS_BEFORE_WAVE16.size, 982);
