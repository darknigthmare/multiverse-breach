import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { projectAbilitiesBeforeWave16, WAVE16_PRESENTATION_IDS, WAVE16_REVIEWED_IDS } from './combatFidelityHistoricalCohortWave16.mjs';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave16-2026-10-28/baseline-authored-abilities.json', import.meta.url)));
const copy = () => structuredClone(baseline);

test('the historical projection restores only an explicitly revised selected identity', () => {
  const current = copy(), id = [...WAVE16_PRESENTATION_IDS][0];
  current[id] = { ...current[id], sourceReference: 'W16 selected work and explicit source version',
    priorSourceReference: baseline[id].sourceReference, versionRevision: 'wave16-explicit-source-version',
    special: { ...current[id].special, name: 'A selected source action' } };
  assert.deepEqual(projectAbilitiesBeforeWave16(current), baseline);
  assert.equal(current[id].special.name, 'A selected source action', 'projection must not rewrite the production record');
});

test('unrelated authoring drift cannot hide behind a historical projection', () => {
  const current = copy(), id = Object.keys(current).find(key => !WAVE16_REVIEWED_IDS.has(key));
  current[id].sourceReference += ' changed';
  assert.throws(() => projectAbilitiesBeforeWave16(current), /outside the W16 cohort changed/);
});

test('a selected identity cannot change universe or lose its prior provenance', () => {
  const id = [...WAVE16_PRESENTATION_IDS][0], crossUniverse = copy(), lost = copy();
  crossUniverse[id].universe = 'Unrelated source';
  assert.throws(() => projectAbilitiesBeforeWave16(crossUniverse), /source universe changed/);
  lost[id].versionRevision = 'wave16-explicit-source-version'; lost[id].sourceReference = 'Revised';
  assert.throws(() => projectAbilitiesBeforeWave16(lost), /prior provenance was not retained/);
});

test('missing or additional identities cannot be projected into a passing historical view', () => {
  const missing = copy(), added = copy();
  delete missing[[...WAVE16_PRESENTATION_IDS][0]];
  added.unplanned = { universe: 'Unplanned' };
  for (const current of [missing, added]) assert.throws(() => projectAbilitiesBeforeWave16(current), /must not add or remove/);
});

test('append-only pre-generation amendments retain124 reviewed identities and120 distinct effective drawing slots', () => {
  assert.equal(WAVE16_PRESENTATION_IDS.size, 120); assert.equal(WAVE16_REVIEWED_IDS.size, 124);
  for (const id of ['tank_matrix', 'meiko', 'kaito', 'oracle_matrix']) {
    assert.ok(WAVE16_PRESENTATION_IDS.has(id));
    const current = copy(); current[id] = { ...current[id], sourceReference: 'An explicit separately planned source',
      priorSourceReference: baseline[id].sourceReference, versionRevision: 'wave16-explicit-source-version' };
    assert.deepEqual(projectAbilitiesBeforeWave16(current), baseline);
  }
  for (const id of ['john_wick', 'robin_tt', 'raven_tt', 'starfire_tt']) {
    assert.ok(WAVE16_REVIEWED_IDS.has(id)); assert.equal(WAVE16_PRESENTATION_IDS.has(id), false);
  }
});
