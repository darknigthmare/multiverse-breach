import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { effectiveBatchPlanWave17 } from '../docs/combat-fidelity-wave17-2026-11-02/closure-support.mjs';
import { projectHammondSourceAuthoringForHistory } from './gearsDeadSpaceHammondAuthoringErratum20261113.mjs';

const directory = 'docs/combat-fidelity-wave17-2026-11-02/';
const read = name => readFileSync(new URL('../' + directory + name, import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const planBytes = read('batch-plan-before.json');
assert.equal(sha(planBytes), '1f8685e68f25a13ca1c321d6899257f102f5a327ce01f8f58678931832926604');
const plan = effectiveBatchPlanWave17();
const baselineBytes = read('baseline-authored-abilities.json');
assert.equal(sha(baselineBytes), 'cbcf903387bd4359a192b053d83a22071696953059cbb0b4194a758e13f1fad3');
export const HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17 = Object.freeze(JSON.parse(baselineBytes));
const baseline = HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17;
export const WAVE17_REVIEWED_IDS = new Set(plan.reviewedIds);
export const WAVE17_PRESENTATION_IDS = new Set(Object.values(plan.parts).flat());
export const WAVE17_NEW_AUTHORING_IDS = new Set(plan.heroes.filter(row => !row.alreadyAuthored).map(row => row.hero.id));
export const WAVE17_REVISED_AUTHORING_IDS = new Set(plan.heroes.filter(row => row.alreadyAuthored).map(row => row.hero.id));
const roster = new Map(plan.heroes.map(row => [row.hero.id, row.hero]));
assert.equal(WAVE17_REVIEWED_IDS.size, 125);
assert.equal(WAVE17_PRESENTATION_IDS.size, 120);
assert.equal(WAVE17_NEW_AUTHORING_IDS.size, 80);
assert.equal(WAVE17_REVISED_AUTHORING_IDS.size, 45);
assert.equal(Object.keys(baseline).length, 1582);
export const WAVE17_ABILITY_COUNT_DELTA = Object.freeze({
  authoredHeroes: WAVE17_NEW_AUTHORING_IDS.size,
  authoredSlots: plan.heroes.reduce((sum, row) => sum + row.missingExplicitSlots.length, 0),
  completeThreeSlotKits: plan.heroes.filter(row => row.missingExplicitSlots.length > 0).length,
  partialSlotKits: -plan.heroes.filter(row => row.alreadyAuthored && row.missingExplicitSlots.length > 0).length
});

// This adapter proves W17's exact additions before the unchanged W16
// projection receives its original input. Unknown additions and unrelated
// mutations cannot disappear into a historical fixture.
export function projectAbilitiesBeforeWave17(current) {
  const currentIds = Object.keys(current).sort();
  const previousIds = Object.keys(baseline).sort();
  if (JSON.stringify(currentIds) === JSON.stringify(previousIds)) {
    const historicalSourceLabels = { ...current,
      zach_hammond: projectHammondSourceAuthoringForHistory(current.zach_hammond, baseline.zach_hammond) };
    assert.deepEqual(historicalSourceLabels, baseline, 'An incomplete W17 rollout cannot alter the published baseline');
    return baseline;
  }
  assert.deepEqual(currentIds, [...previousIds, ...WAVE17_NEW_AUTHORING_IDS].sort(), 'W17 must preserve the exact authoring union');
  const result = {};
  for (const [id, prior] of Object.entries(baseline)) {
    const live = id === 'zach_hammond'
      ? projectHammondSourceAuthoringForHistory(current[id], prior) : current[id];
    if (!WAVE17_REVISED_AUTHORING_IDS.has(id)) {
      assert.deepEqual(live, prior, id + ': authoring outside the W17 cohort changed');
      result[id] = live;
      continue;
    }
    assert.equal(live.universe, prior.universe, id + ': source universe changed');
    assert.equal(live.versionRevision, 'wave17-explicit-source-version', id + ': missing explicit W17 revision');
    assert.equal(live.priorSourceReference, prior.sourceReference, id + ': prior provenance was not retained');
    assert.equal(live.priorSourceWork, prior.sourceWork, id + ': prior source version was not retained');
    assert.equal(typeof live.sourceReference, 'string');
    assert.ok(live.sourceReference.length > 0, id + ': missing source provenance');
    result[id] = prior;
  }
  for (const id of WAVE17_NEW_AUTHORING_IDS) {
    const live = current[id];
    assert.equal(live.universe, roster.get(id).universe, id + ': new source universe changed');
    assert.ok(live.sourceWork && live.sourceReference, id + ': new identity lacks source provenance');
    assert.equal(live.source1to1Verified, false, id + ': new adaptation cannot claim verified original frames');
    for (const slot of ['simple', 'secondary', 'defense']) assert.ok(live[slot]?.name, id + ': missing new explicit ' + slot);
  }
  return Object.freeze(result);
}

const previousAuditBytes = read('baseline-current-wave16.json');
const receipt = JSON.parse(read('baseline-receipt.json'));
assert.equal(sha(previousAuditBytes), receipt.files[directory + 'baseline-current-wave16.json']);
const previousAudit = JSON.parse(previousAuditBytes);
export const HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE17 = new Set(previousAudit.presentations.entries.map(entry => entry.id));
for (const id of WAVE17_PRESENTATION_IDS) assert.equal(HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE17.has(id), false);
export function projectPresentationIdsBeforeWave17(currentIds) {
  const ids = [...currentIds];
  assert.equal(new Set(ids).size, ids.length, 'Duplicate live presentation identity');
  const old = [...HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE17];
  if (JSON.stringify([...ids].sort()) === JSON.stringify([...old].sort())) return ids;
  assert.deepEqual([...ids].sort(), [...old, ...WAVE17_PRESENTATION_IDS].sort(), 'W17 must preserve the exact presentation union');
  return ids.filter(id => !WAVE17_PRESENTATION_IDS.has(id));
}
