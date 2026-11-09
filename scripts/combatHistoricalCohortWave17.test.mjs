import assert from 'node:assert/strict';
import { test } from 'node:test';
import { effectiveBatchPlanWave17 } from '../docs/combat-fidelity-wave17-2026-11-02/closure-support.mjs';
import { HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17 as baseline,
  HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE17, WAVE17_REVIEWED_IDS, WAVE17_PRESENTATION_IDS,
  WAVE17_NEW_AUTHORING_IDS, WAVE17_REVISED_AUTHORING_IDS,
  projectAbilitiesBeforeWave17, projectPresentationIdsBeforeWave17 } from './combatFidelityHistoricalCohortWave17.mjs';

const plan = effectiveBatchPlanWave17();
function futureFixture() {
  const current = structuredClone(baseline);
  for (const id of WAVE17_REVISED_AUTHORING_IDS) current[id] = { ...current[id],
    sourceReference: 'Explicit test fixture revision', versionRevision: 'wave17-explicit-source-version',
    priorSourceReference: baseline[id].sourceReference, priorSourceWork: baseline[id].sourceWork };
  for (const row of plan.heroes.filter(row => !row.alreadyAuthored)) current[row.hero.id] = {
    universe: row.hero.universe, sourceWork: 'Test source', sourceReference: 'Test source reference', source1to1Verified: false,
    simple: { name: 'Fixture simple' }, secondary: { name: 'Fixture secondary' }, defense: { name: 'Fixture defense' }
  };
  return current;
}

test('W17 projection preserves the published baseline and restores precisely the planned future union without mutation', () => {
  const current = futureFixture(), snapshot = structuredClone(current);
  assert.deepEqual(projectAbilitiesBeforeWave17(baseline), baseline);
  assert.deepEqual(projectAbilitiesBeforeWave17(current), baseline);
  assert.deepEqual(current, snapshot);
});
test('W17 projection rejects missing and extra identities rather than concealing catalog drift', () => {
  const missing = futureFixture(), extra = futureFixture();
  delete missing[[...WAVE17_NEW_AUTHORING_IDS][0]];
  extra.unplanned = { universe: 'Unplanned' };
  for (const current of [missing, extra]) assert.throws(() => projectAbilitiesBeforeWave17(current), /exact authoring union/);
});
test('W17 projection rejects changes outside its cohort, source swaps and lost prior provenance', () => {
  const unrelated = futureFixture(), changedUniverse = futureFixture(), lost = futureFixture();
  const oldId = Object.keys(baseline).find(id => !WAVE17_REVIEWED_IDS.has(id));
  unrelated[oldId].sourceReference += ' changed';
  assert.throws(() => projectAbilitiesBeforeWave17(unrelated), /outside the W17 cohort changed/);
  const id = [...WAVE17_REVISED_AUTHORING_IDS][0];
  changedUniverse[id].universe = 'Unrelated source';
  lost[id].priorSourceReference = 'Unrelated prior source';
  assert.throws(() => projectAbilitiesBeforeWave17(changedUniverse), /source universe changed/);
  assert.throws(() => projectAbilitiesBeforeWave17(lost), /prior provenance was not retained/);
});
test('new W17 records require all three slots and cannot falsely certify original source frames', () => {
  const missing = futureFixture(), certified = futureFixture(), id = [...WAVE17_NEW_AUTHORING_IDS][0];
  delete missing[id].simple;
  certified[id].source1to1Verified = true;
  assert.throws(() => projectAbilitiesBeforeWave17(missing), /missing new explicit simple/);
  assert.throws(() => projectAbilitiesBeforeWave17(certified), /cannot claim verified original frames/);
});
test('W17 presentation projection proves the exact 120 additions and rejects unrelated or duplicate recipes', () => {
  const prior = [...HISTORICAL_PRESENTATION_IDS_BEFORE_WAVE17], current = [...prior, ...WAVE17_PRESENTATION_IDS];
  assert.deepEqual(projectPresentationIdsBeforeWave17(current), prior);
  assert.throws(() => projectPresentationIdsBeforeWave17([...current, current[0]]), /Duplicate/);
  assert.throws(() => projectPresentationIdsBeforeWave17([...current, 'unplanned']), /exact presentation union/);
  assert.throws(() => projectPresentationIdsBeforeWave17(current.slice(1)), /exact presentation union/);
});
