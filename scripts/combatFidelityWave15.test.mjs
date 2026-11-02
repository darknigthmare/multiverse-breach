import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { ABILITIES_WAVE15, ABILITY_REVISIONS_WAVE15 } from '../src/game/combat/abilities/abilitiesWave15.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 as sources } from '../src/game/combat/combatSourceDefinitionsWave15.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES } from '../src/game/combat/presentationCatalog.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getNativeSuperVisualStateWave15, supportsNativeSuperWave15, supportsTrackedProjectileVisualWave15 } from '../src/game/combat/nativeSuperVisualsWave15.js';
const read = path => readFileSync(new URL('../' + path, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const directory = 'docs/combat-fidelity-wave15-2026-10-26';
const bytes = read(directory + '/batch-plan-before.json');
assert.equal(hash(bytes), '08c143270255b5bc83fc051d37f5203351da868b232856d9f43a4dc943463dd1');
const plan = JSON.parse(bytes), ids = Object.values(plan.parts).flat();
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const sorted = values => [...values].sort();
const sourcePlanHashes = {
  A: 'f6cc9213b714927b2f4c234cdbecffb502801893e20b68106c29b6185e0d615d',
  B: '398ec9c7c1347bcd3ab47afaa118d6f1edbc6bd694cb326c234b660e2e54b276',
  C: '4199c46e0dd7d8c66a02a61e350c8ffe58d665c1fa336169c7973e84873e2776'
};
const declaredSources = {};
for (const part of ['A', 'B', 'C']) {
  const bytes = read(`${directory}/part-${part.toLowerCase()}/source-plan.json`);
  assert.equal(hash(bytes), sourcePlanHashes[part], `${part}: frozen source plan changed`);
  const sourcePlan = JSON.parse(bytes);
  const entries = part === 'A' ? Object.entries(sourcePlan.entries)
    : part === 'B' ? sourcePlan.entries.map(record => [record.heroId, record])
      : sourcePlan.records.map(record => [record.heroId, record.source]);
  assert.deepEqual(sorted(entries.map(([id]) => id)), sorted(plan.parts[part]));
  Object.assign(declaredSources, Object.fromEntries(entries));
}
// Source corrections use an explicit erratum with per-request timing. The
// initial frozen plan and its independently recorded SHA remain unchanged.
const errata = JSON.parse(read(directory + '/part-b/source-plan-errata.json'));
assert.equal(errata.originalFrozenPlanSha256, sourcePlanHashes.B);
assert.equal(errata.beforeAnyGenerationForAffectedHero, errata.corrections.every(correction => correction.beforeFirstGeneration === true));
for (const correction of errata.corrections) {
  assert.ok(plan.parts.B.includes(correction.heroId));
  assert.ok(correction.beforeFirstGeneration === true || (correction.beforeCorrectiveGeneration === true && correction.initialSourceExcluded === true));
  const source = declaredSources[correction.heroId];
  assert.deepEqual(source[correction.field] ?? null, correction.before, correction.heroId + ': erratum before value');
  source[correction.field] = correction.after;
}
const errataC = JSON.parse(read(directory + '/part-c/source-plan-errata.json'));
assert.equal(errataC.originalFrozenPlanSha256, sourcePlanHashes.C);
assert.equal(errataC.beforeAnyGenerationForAffectedHero, false);
assert.equal(errataC.beforeCorrectiveGenerationForAffectedHero, true);
assert.equal(errataC.initialImageReturnedBeforeClarification.allInitialDrawingsExcluded, true);
for (const correction of errataC.corrections) {
  assert.equal(correction.heroId, 'evolve_val');
  const source = declaredSources[correction.heroId];
  assert.deepEqual(source[correction.field] ?? null, correction.before, correction.heroId + ': erratum before value');
  source[correction.field] = correction.after;
}
const effectiveC = JSON.parse(read(directory + '/part-c/source-plan-effective.json'));
for (const record of effectiveC.records) {
  assert.deepEqual(record.source, declaredSources[record.heroId], record.heroId + ': effective source plan');
}
const effectiveB = JSON.parse(read(directory + '/part-b/source-plan-effective.json'));
for (const source of effectiveB.entries) {
  for (const [key, value] of Object.entries(declaredSources[source.heroId])) assert.deepEqual(source[key], value, source.heroId + ': effective source plan');
}

test('W15 composes three disjoint groups of40 and exactly42 new /78 source-version revisions', () => {
  assert.equal(ids.length, 120); assert.equal(new Set(ids).size, 120);
  for (const part of Object.values(plan.parts)) assert.equal(part.length, 40);
  assert.deepEqual(sorted(Object.keys(sources)), sorted(ids));
  assert.deepEqual(sorted(Object.keys(ABILITIES_WAVE15)), sorted(plan.heroes.filter(row => !row.alreadyAuthored).map(row => row.hero.id)));
  assert.deepEqual(sorted(Object.keys(ABILITY_REVISIONS_WAVE15)), sorted(plan.heroes.filter(row => row.alreadyAuthored).map(row => row.hero.id)));
  assert.equal(Object.keys(ABILITIES_WAVE15).length, 42); assert.equal(Object.keys(ABILITY_REVISIONS_WAVE15).length, 78);
  assert.equal(Object.keys(COMBAT_ABILITY_OVERRIDES).length, 1582);
  const sourceKeys = ['universe', 'sourceWork', 'appearance', 'weapon', 'actionName', 'effect', 'delivery', 'pose', 'bodyHeight', 'sourceReference', 'kind', 'weaponType'];
  for (const row of plan.heroes) {
    const id = row.hero.id, hero = roster.get(id), source = sources[id], declared = declaredSources[id];
    assert.ok(hero); assert.equal(row.native32Before, false);
    for (const key of sourceKeys) assert.deepEqual(source[key], declared[key], `${id}: source ${key}`);
    assert.equal(source.source1to1Verified, false); assert.equal(source.networkVerified, false);
    assert.equal(hero.weaponType, source.weaponType);
    for (const slot of ['simple', 'secondary', 'defense', 'special']) assert.deepEqual(hero[slot], row.hero[slot], `${id}: raw historical action rewritten`);
    if (row.alreadyAuthored) {
      assert.equal(COMBAT_ABILITY_OVERRIDES[id].versionRevision, 'wave15-explicit-source-version');
      assert.equal(COMBAT_ABILITY_OVERRIDES[id].priorSourceWork, row.priorAuthored.sourceWork);
    }
  }
});

test('W15 current provenance replaces obsolete mechanics while preserving its historical reference and unrelated records', () => {
  const id = 'borderlands_2_maya_phaselock', current = COMBAT_ABILITY_OVERRIDES[id], original = plan.heroes.find(row => row.hero.id === id).priorAuthored;
  assert.equal(current.sourceReference, ABILITY_REVISIONS_WAVE15[id].sourceReference);
  assert.equal(current.priorSourceReference, original.sourceReference); assert.match(current.priorSourceReference, /protection temporaire/);
  const action = resolveCombatAbility(roster.get(id), 'special');
  assert.match(action.provenance.sourceReference, /Phaselock controls one accepted enemy/);
  assert.doesNotMatch(action.provenance.sourceReference, /contrôle traduit en protection temporaire|La zone de dégâts se fonde/);
  const baseline = JSON.parse(read(directory + '/baseline-authoring-preservation.json')), witness = 'jim_28dl';
  assert.equal(ids.includes(witness), false);
  assert.equal(hash(JSON.stringify(COMBAT_ABILITY_OVERRIDES[witness])), baseline.recordHashes[witness], 'A non-W15 record must remain exactly unchanged');
});

test('W15 resolves480 explicitly named slots with source equipment, zero-damage supports and exact super delivery', () => {
  let slots = 0;
  for (const id of ids) {
    const hero = roster.get(id), source = sources[id];
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      const action = resolveCombatAbility(hero, slot); slots++;
      assert.equal(action.sourceHeroId, id); assert.equal(action.universe, source.universe);
      assert.equal(action.provenance.sourceWork, source.sourceWork); assert.equal(action.provenance.identityAuthored, true);
      assert.equal(action.provenance.canonicalVerified, false); assert.equal(action.provenance.networkVerified, false);
      assert.doesNotMatch(action.name, /Signature Strike|Breach Technique|Origin Burst|Signature Guard/);
      assert.ok(action.hitAt > 0 && action.hitAt < action.duration, `${id}/${slot}`);
      if (action.effect === 'damage') { assert.ok(action.multiplier > 0); assert.equal(action.targetSide, 'enemy'); }
      else if (action.effect === 'control') { assert.equal(id, 'borderlands_2_maya_phaselock'); assert.equal(action.multiplier, 0); assert.equal(action.delivery, 'control'); assert.equal(action.targetSide, 'enemy'); assert.equal(action.shape, 'single'); assert.equal(action.controlKind, 'phaselock'); }
      else { assert.equal(action.multiplier, 0); assert.equal(action.delivery, 'support'); assert.notEqual(action.targetSide, 'enemy'); }
    }
    const action = resolveCombatAbility(hero, 'special');
    assert.equal(action.name, source.actionName); assert.equal(action.effect, source.effect); assert.equal(action.delivery, source.delivery);
    assert.equal(supportsNativeSuperWave15(action), true);
    assert.equal(supportsTrackedProjectileVisualWave15(action), source.effect === 'damage' && source.delivery === 'projectile');
    assert.equal(CHARACTER_PRESENTATIONS[id].sourceAction, source.actionName);
    assert.deepEqual(sorted(Object.keys(CHARACTER_PRESENTATIONS[id].phases)), sorted(PRESENTATION_PHASES));
  }
  assert.equal(slots, 480);
});

test('W15 same-universe non-self relays use the selected partner action without transferring powers across universes', () => {
  for (const id of ids) {
    const hero = roster.get(id), descriptor = resolveUniverseSummon(hero);
    assert.equal(descriptor.kind, 'reinforcement'); assert.equal(descriptor.universe, hero.universe);
    assert.notEqual(descriptor.sourceHeroId, id); assert.ok(roster.has(descriptor.sourceHeroId));
    assert.equal(descriptor.provenance.partnerSelection, 'wave15-explicit-source-version');
    assert.equal(descriptor.action.name, resolveCombatAbility(roster.get(descriptor.sourceHeroId), 'special').name);
    assert.equal(resolveUniverseSummon({ ...hero, universe: 'Foreign continuity' })?.provenance.partnerSelection === 'wave15-explicit-source-version', false);
  }
  const currentShephard = resolveUniverseSummon(roster.get('shephard'));
  assert.equal(currentShephard.universe, 'Half-Life'); assert.equal(currentShephard.performer.id, 'barney');
  assert.equal(currentShephard.action.name, resolveCombatAbility(roster.get('barney'), 'special').name);
  assert.equal(currentShephard.provenance.partnerSelection, 'wave15-explicit-source-version');
});

test('W15 source-specific safety and role constraints remain real mechanics', () => {
  const special = id => resolveCombatAbility(roster.get(id), 'special');
  for (const id of ['splinter_cell_anna_grim', 'hitman_woa_diana_burnwood', 'vega_doom', 'cortana', 'dr_kirk', 'turok_adon']) {
    assert.equal(special(id).effect, 'buff'); assert.equal(special(id).multiplier, 0); assert.equal(special(id).delivery, 'support');
  }
  assert.equal(special('borderlands_2_maya_phaselock').effect, 'control');
  assert.equal(special('borderlands_2_maya_phaselock').targetSide, 'enemy');
  assert.equal(special('borderlands_2_maya_phaselock').delivery, 'control');
  assert.equal(special('borderlands_2_maya_phaselock').controlDuration, 2.4);
  assert.equal(special('borderlands_2_maya_phaselock').multiplier, 0);
  assert.equal(special('evolve_val').effect, 'heal'); assert.equal(special('evolve_val').shape, 'group');
  assert.equal(special('evolve_markov').delivery, 'beam'); assert.equal(special('evolve_markov').range, 480);
  for (const id of ['hexen_baratus', 'quake_franchise_ranger', 'dog_hl2']) assert.equal(special(id).delivery, 'melee');
  assert.match(sources.wesker.sourceWork, /1996/); assert.match(sources.cortana.sourceWork, /Halo 3 \(2007\)/);
  assert.match(sources.valtweller.sourceWork, /1997/);
});

test('W15 native helpers reject changed identities, source universes, effects and delivery without inventing native availability', () => {
  for (const id of ids) {
    const hero = roster.get(id), profile = resolveCombatAbility(hero, 'special');
    const options = { actor: { ...hero, x: 500, y: 350 }, profile, action: { duration: profile.duration, hitAt: profile.hitAt, elapsed: .6, facing: 1 }, target: { x: 560, y: 350 }, contactVisual: { confirmed: false } };
    const state = getNativeSuperVisualStateWave15(options);
    assert.equal(state.family, 'native-wave15'); assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    assert.equal(state.contactEligible, false);
    for (const invalid of [{ actor: { ...options.actor, universe: 'Foreign' } }, { profile: { ...profile, name: 'Generic burst' } }, { profile: { ...profile, sourceHeroId: 'Foreign' } }, { profile: { ...profile, effect: profile.effect === 'damage' ? 'buff' : 'damage' } }, { profile: { ...profile, delivery: 'Foreign' } }])
      assert.equal(getNativeSuperVisualStateWave15({ ...options, ...invalid }), null, id);
    if (!['damage', 'control'].includes(profile.effect)) assert.deepEqual(state.target, { x: 500, y: 350 });
    if (profile.effect === 'control') { assert.equal(state.controlling, true); assert.equal(state.supportive, false); }
  }
});

test('W15 final native coverage has120 presentation32 and120 exact-universe base16 bindings', () => {
  const native = getCharacterAnimationAssets().filter(entry => ids.includes(entry.heroId));
  assert.equal(native.length, 120, 'Every selected identity requires native32 artwork or an explicitly reviewed scope correction');
  for (const id of ids) {
    const entry = native.find(entry => entry.heroId === id), hero = roster.get(id);
    assert.equal(entry.frames, 32); assert.equal(entry.universe, hero.universe);
    const path = getHeroSpriteSheetSrc(hero, 'rpg'); assert.match(path, /combat-character-corrections-wave15-part-[abc]/);
    assert.equal(getHeroSpriteSheetSrc({ ...hero, id: 'enemy-local-' + id, sourceHeroId: id }, 'rpg'), path);
    assert.notEqual(getHeroSpriteSheetSrc({ ...hero, id: 'foreign-local-' + id, sourceHeroId: id, universe: 'Foreign continuity' }, 'rpg'), path);
  }
});
