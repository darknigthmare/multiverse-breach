import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRpgSourceEffectPresentation } from '../src/game/rpgTargetingPresentation.js';

const uber = { sourceHeroId: 'team_fortress_2_medic', universe: 'Team Fortress 2', name: 'ÜberCharge du Medi Gun stock', effect: 'guard', multiplier: 0,
  action: { targeting: { sourceUberWave17: true } } };
const photo = { sourceHeroId: 'beyond_good_evil_jade', universe: 'Beyond Good & Evil', name: 'Jade photographie les preuves', effect: 'buff', multiplier: 0,
  action: { informationOnly: true } };
test('stock ÜberCharge presentation explains both protected actors and its beam/charge condition in French and English', () => {
  for (const lang of ['fr', 'en']) {
    const view = getRpgSourceEffectPresentation({ profile: uber }, lang);
    assert.match(view.label, /ÜBERCHARGE.*8 s.*Medic/);
    assert.match(view.label, /patient/);
    assert.doesNotMatch(view.label, /0%|GARDE/);
    assert.equal(view.hideDamageEstimate, true);
    assert.match(view.detail, /(?:Charge complète|full charge)/);
  }
});
test('an action name or forged source cannot invent the ÜberCharge label', () => {
  for (const profile of [{ ...uber, sourceHeroId: 'team_fortress_2_scout' }, { ...uber, universe: 'Other' },
    { ...uber, action: { name: 'ÜberCharge' } }, { ...uber, name: 'Forged power' }, { ...uber, multiplier: 1 }])
    assert.equal(getRpgSourceEffectPresentation({ profile }), null);
});
test('informative photography hides damage and explicitly excludes an attack bonus', () => {
  const view = getRpgSourceEffectPresentation({ profile: photo });
  assert.match(view.label, /PHOTOGRAPHIE.*3 s/);
  assert.match(view.detail, /Aucun dégât, soin ou bonus/);
  assert.equal(view.hideDamageEstimate, true);
  assert.equal(getRpgSourceEffectPresentation({ profile: { ...photo, multiplier: 1 } }), null);
});
test('nonlethal capture presentation requires the exact source contract and hides HP estimates', () => {
  const profile = { sourceHeroId: 'tail_concerto_waffle', universe: 'Tail Concerto', effect: 'control', delivery: 'control',
    controlKind: 'bubble-capture', targetSide: 'enemy', shape: 'single', maxTargets: 1, multiplier: 0,
    requiresExplicitTargetEligibility: true, nonlethal: true, controlDuration: 1.25 };
  const view = getRpgSourceEffectPresentation({ profile });
  assert.match(view.label, /CAPTURE NON LÉTALE.*1,25 s/);
  assert.equal(view.hideDamageEstimate, true);
  for (const invalid of [{ ...profile, nonlethal: false }, { ...profile, multiplier: 1 }, { ...profile, universe: 'Other' }])
    assert.equal(getRpgSourceEffectPresentation({ profile: invalid }), null);
});
