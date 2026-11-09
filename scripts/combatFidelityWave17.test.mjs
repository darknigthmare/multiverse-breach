import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from '../src/game/combat/combatSourceDefinitionsWave17.js';
import { WAVE_17_IDS, WAVE_17_REVIEWED_IDS } from '../src/game/combat/cohortWave17.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { supportsNativeSuperWave17 } from '../src/game/combat/nativeSuperAdmissionWave17.js';
import { getNativeSuperVisualStateWave17 } from '../src/game/combat/nativeSuperVisualsWave17.js';
import { resolveCharacterAnimationAsset, getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { effectiveBatchPlanWave17, expected } from '../docs/combat-fidelity-wave17-2026-11-02/closure-support.mjs';
import { projectAbilitiesBeforeWave17 } from './combatFidelityHistoricalCohortWave17.mjs';

const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const readJson = file => JSON.parse(readFileSync(new URL('../' + file, import.meta.url)));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('W17 explicit source profiles preserve the exact planned identities and expose no generic or falsely certified actions', () => {
  const plan = effectiveBatchPlanWave17();
  assert.deepEqual([...WAVE_17_IDS].sort(), Object.values(plan.parts).flat().sort());
  assert.deepEqual([...WAVE_17_REVIEWED_IDS].sort(), plan.reviewedIds.sort());
  assert.equal(new Set(WAVE_17_IDS).size, 120);
  projectAbilitiesBeforeWave17(COMBAT_ABILITY_OVERRIDES);
  for (const id of WAVE_17_REVIEWED_IDS) {
    const hero = roster.get(id), source = COMBAT_SOURCE_DEFINITIONS_WAVE17[id];
    assert.equal(source.universe, hero.universe, id);
    assert.equal(source.source1to1Verified, false, id);
    assert.equal(COMBAT_ABILITY_OVERRIDES[id].source1to1Verified, false, id);
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      const profile = resolveCombatAbility(hero, slot);
      assert.equal(profile.sourceHeroId, id, `${id}:${slot}`);
      assert.equal(profile.provenance.identityAuthored, true, `${id}:${slot}`);
      assert.doesNotMatch(profile.name, /Signature Strike|Breach Technique|Signature Guard|Origin Burst/i, `${id}:${slot}`);
    }
    assert.equal(supportsNativeSuperWave17(resolveCombatAbility(hero, 'special')), true, id);
  }
});
test('W17 explicit super projection rejects crossed identities and cannot apply simulation damage', () => {
  for (const id of WAVE_17_REVIEWED_IDS) {
    const hero = roster.get(id), profile = resolveCombatAbility(hero, 'special');
    const actor = { ...hero, id: 'runtime:' + id, sourceHeroId: id, x: 200, y: 300, facing: 1 };
    const action = { duration: profile.duration, hitAt: profile.hitAt, elapsed: profile.hitAt, facing: 1, identity: profile };
    const target = { id: 'target', x: 250, y: 300, currentHp: 1000 };
    const options = { actor, profile, action, target, contactVisual: { confirmed: false } };
    const before = JSON.stringify({ actor, target });
    const state = getNativeSuperVisualStateWave17(options);
    assert.ok(state, id);
    assert.equal(state.gameplayEffect, 'none', id);
    assert.equal(state.contactEligible, false, id + ': a visual must not invent an accepted hit');
    assert.equal(JSON.stringify({ actor, target }), before, id + ': projection changed actors');
    assert.equal(getNativeSuperVisualStateWave17({ ...options, actor: { ...actor, universe: 'Other' } }), null, id);
    assert.equal(getNativeSuperVisualStateWave17({ ...options, profile: { ...profile, name: profile.name + ' forged' } }), null, id);
  }
});
test('W17 withheld identities retain historical art and never acquire a native atlas through their replacements', () => {
  const plan = effectiveBatchPlanWave17();
  for (const item of plan.withheld) {
    assert.equal(WAVE_17_IDS.includes(item.withheldId), false);
    assert.equal(resolveCharacterAnimationAsset(roster.get(item.withheldId)), null, item.withheldId);
    assert.ok(WAVE_17_IDS.includes(item.replacementId));
  }
});
test('W17 complete delivery binds all120 native32 atlases and all120 base16 sheets to their actual source characters', () => {
  const native = getCharacterAnimationAssets().filter(entry => WAVE_17_IDS.includes(entry.heroId));
  const bases = ['A', 'B', 'C'].flatMap(part => readJson(`src/game/combat/characterSpriteCorrectionsWave17Part${part}.generated.json`).entries);
  assert.equal(native.length, expected.newCharacters);
  assert.equal(bases.length, expected.newBase16);
  for (const entries of [native, bases]) {
    assert.deepEqual(entries.map(entry => entry.heroId).sort(), [...WAVE_17_IDS].sort());
    for (const entry of entries) {
      const bytes = readFileSync(new URL('../public' + entry.sheet, import.meta.url));
      assert.equal(hash(bytes), entry.sha256, entry.heroId);
      assert.equal(entry.visualValidation.source1to1Verified, false, entry.heroId);
      assert.equal(entry.visualValidation.allFramesReviewed, true, entry.heroId);
    }
  }
  for (const entry of bases) {
    const hero = roster.get(entry.heroId);
    assert.equal(entry.frames, 16);
    assert.equal(getHeroSpriteSheetSrc(hero, 'rpg'), entry.sheet, entry.heroId);
    assert.notEqual(getHeroSpriteSheetSrc({ ...hero, universe: 'Other' }, 'rpg'), entry.sheet, entry.heroId);
  }
});
