import assert from 'node:assert/strict';
import test from 'node:test';
import { isUniverseCombatMission } from '../src/game/missions/universeMissionCategory.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { OC_CAMPAIGN_MISSIONS } from '../src/game/ocCampaign.js';

test('every corrected source encounter is discoverable as an independent universe mission', () => {
  for (const stage of Object.values(CANON_PRIORITY_STAGES)) {
    const original = structuredClone(stage);
    assert.equal(isUniverseCombatMission(stage), true, stage.name);
    assert.deepEqual(stage, original, 'classification must not change saved identity or rewards');
  }
});
test('OC campaign missions are never diverted into the independent franchise menu', () => {
  for (const stage of OC_CAMPAIGN_MISSIONS) {
    assert.equal(isUniverseCombatMission(stage, { isMainCampaign: true }), false, stage.id);
    assert.equal(isUniverseCombatMission({ ...stage, baseGameStage: true }), false, stage.id);
  }
});
test('existing dedicated categories retain their arcs, original worlds, trials and finale', () => {
  const source = CANON_PRIORITY_STAGES.metropolisScarab;
  for (const fields of [
    { ocDlc: true }, { campaignDependency: 'originalCampaign' }, { universeArc: { id: 'halo' } },
    { characterArc: { heroId: 'masterchief' } }, { trioArc: { id: 'team' } },
    { fusionMission: { id: 'fusion' } }, { nonCombatTrial: { type: 'collect' } },
    { nonCombat: true }, { nC: true }, { tutorial: true }, { metaStage: true }, { finalGameBoss: true }
  ]) assert.equal(isUniverseCombatMission({ ...source, ...fields }), false, JSON.stringify(fields));
});
test('locked missions stay discoverable without bypassing their access requirement', () => {
  const stage = { ...CANON_PRIORITY_STAGES.xenNihilanth, requiredClears: 6, locked: true };
  assert.equal(isUniverseCombatMission(stage), true);
  assert.equal(stage.requiredClears, 6);
  assert.equal(stage.locked, true);
  for (const invalid of [null, undefined, {}, { id: 'invalid', universe: 'Halo' }]) assert.equal(isUniverseCombatMission(invalid), false);
});
