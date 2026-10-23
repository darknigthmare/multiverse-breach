import assert from 'node:assert/strict';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../src/game/canonicalCombatOverrides.js';
import { CANONICAL_COMBAT_EXTENSIONS } from '../src/game/combatCanonExtensions.js';
import { combatIdentityText, resolveCombatHeroSpriteActor, resolveCombatPresentation, resolveMeleeSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';

const hero = id => HEROES_DB.find(actor => actor.id === id);

test('adversarial hero sprites preserve battle state while resolving exact source artwork', () => {
  const source = hero('tifa_ff7');
  for (const sourceKey of ['id', 'sourceId', 'sourceHeroId']) {
    const actor = {
      ...source, id: 'p2:tifa_ff7:0', [sourceKey]: source.id,
      currentHp: 37, maxHp: 280, stats: { hp: 280, atk: 44 },
      state: 'special', stateElapsed: 0.45, facing: -1, x: 320, y: 240,
      isBoss: true, secondaryColor: '#abcdef'
    };
    const before = JSON.stringify(actor);
    const spriteActor = resolveCombatHeroSpriteActor(actor);
    assert.equal(spriteActor.id, source.id);
    for (const key of ['currentHp', 'maxHp', 'state', 'stateElapsed', 'facing', 'x', 'y', 'isBoss', 'secondaryColor']) {
      assert.equal(spriteActor[key], actor[key], key);
    }
    assert.deepEqual(spriteActor.stats, actor.stats);
    assert.notEqual(spriteActor, actor);
    assert.equal(JSON.stringify(actor), before, 'rendering identity must not rewrite combat targeting IDs');
  }
});

test('monsters, same-name shells and wrong universes never borrow roster hero artwork', () => {
  const source = hero('tifa_ff7');
  for (const actor of [null, {}, { id: 'monster', name: source.name, universe: source.universe },
    { id: 'monster', universe: source.universe, category: source.category },
    { id: source.id, universe: 'Different continuity' },
    { sourceId: source.id, universe: 'Different continuity' },
    { sourceHeroId: source.id, universe: 'Different continuity' }]) {
    assert.equal(resolveCombatHeroSpriteActor(actor), null);
  }
});

test('every roster hero has a finite super sourced from its own universe', () => {
  const before = JSON.stringify(HEROES_DB);
  const effectNames = new Set(['damage', 'heal', 'guard', 'buff', 'cleanse', 'revive']);
  const deliveries = new Set(['melee', 'projectile', 'beam', 'area', 'support']);
  for (const actor of HEROES_DB) {
    const profile = resolveMeleeSuper(actor);
    assert.ok(profile, actor.id);
    assert.equal(profile.universe, actor.universe);
    assert.equal(profile.sourceHeroId, actor.id);
    assert.equal(profile.sourceAbility.slot, 'special');
    assert.ok(effectNames.has(profile.effect), actor.id);
    assert.ok(deliveries.has(profile.delivery), actor.id);
    for (const key of ['range', 'multiplier', 'duration', 'hitAt', 'meterCost']) assert.ok(Number.isFinite(profile[key]), `${actor.id}:${key}`);
    assert.ok(profile.hitAt < profile.duration, actor.id);
    assert.equal(profile.meterCost, 100, actor.id);
    assert.equal(profile.provenance.canonicalVerified, false);
  }
  assert.equal(JSON.stringify(HEROES_DB), before);
});

test('all authored overrides identify existing heroes in the exact source universe', () => {
  for (const [id, override] of Object.entries({ ...CANONICAL_COMBAT_OVERRIDES, ...CANONICAL_COMBAT_EXTENSIONS })) {
    assert.equal(hero(id)?.universe, override.universe, id);
    assert.ok(override.sourceWork, id);
    assert.ok(override.sourceReference, id);
  }
});

test('famous techniques have their own delivery and support semantics', () => {
  assert.equal(resolveMeleeSuper(hero('cloud_ff7')).name, 'Omnislash');
  assert.equal(resolveMeleeSuper(hero('cloud_ff7')).delivery, 'melee');
  assert.equal(resolveMeleeSuper(hero('goku_dbz')).name, 'Kamehameha');
  assert.equal(resolveMeleeSuper(hero('goku_dbz')).delivery, 'beam');
  assert.equal(resolveMeleeSuper(hero('naruto_six_paths')).delivery, 'projectile');
  const healing = resolveMeleeSuper(hero('aerith_ff7'));
  assert.equal(healing.name, 'Great Gospel');
  assert.equal(healing.effect, 'heal');
  assert.equal(healing.delivery, 'support');
  assert.equal(healing.healRatio, 0.6);
  const transformation = resolveMeleeSuper(hero('vincent_ff7'));
  assert.equal(transformation.effect, 'buff');
  assert.equal(transformation.effectDuration, 5);
  assert.ok(transformation.duration < transformation.effectDuration);
});

test('empty enemy shells and unrelated universe names never borrow a hero super', () => {
  for (const actor of [null, {}, { id: 'enemy', universe: 'Final Fantasy VII' }, { ...hero('cloud_ff7'), special: undefined }]) {
    assert.equal(resolveMeleeSuper(actor), null);
  }
  assert.equal(resolveUniverseSummon({ id: 'enemy', universe: 'Final Fantasy VII' }), null);
  const wrongUniverse = { ...hero('cloud_ff7'), universe: 'Different continuity' };
  assert.equal(resolveMeleeSuper(wrongUniverse).name, wrongUniverse.special.name);
  assert.equal(resolveUniverseSummon(wrongUniverse), null);
});

test('every universe uses its own real performer or an explicitly authored entity', () => {
  const universes = new Set();
  for (const actor of HEROES_DB) {
    universes.add(actor.universe);
    const summon = resolveUniverseSummon(actor);
    assert.ok(summon, actor.id);
    assert.equal(summon.universe, actor.universe);
    assert.equal(summon.provenance.sourceUniverse, actor.universe);
    assert.ok(['summon', 'reinforcement'].includes(summon.kind), actor.id);
    assert.ok(summon.action.type && summon.action.name && Number.isFinite(summon.action.dmg), actor.id);
    assert.ok(summon.action.targeting.effect, actor.id);
    assert.ok(['self', 'ally', 'enemy'].includes(summon.action.targeting.targetSide), actor.id);
    assert.ok(summon.action.targeting.range >= 760, actor.id);
    assert.ok(summon.impactAt > 0 && summon.impactAt < summon.duration, actor.id);
    if (summon.performer) {
      assert.equal(summon.performer.universe, actor.universe, actor.id);
      assert.ok(hero(summon.performer.id), actor.id);
      if (!summon.provenance.kind.includes('deployment') && summon.kind === 'reinforcement') assert.notEqual(summon.performer.id, actor.id);
    } else {
      assert.equal(summon.entityRender.kind, 'sprite-sheet');
      assert.equal(summon.entityRender.asset.universe, actor.universe);
      assert.equal(summon.entityRender.asset.entityName, summon.entityName);
      assert.equal(summon.entityRender.asset.actionName, summon.action.name);
      assert.equal(summon.entityRender.asset.frames, 4);
      assert.equal(summon.entityRender.assetMissing, false);
      assert.equal(summon.provenance.entityAssetMissing, false);
    }
  }
  assert.equal(universes.size, new Set(HEROES_DB.map(actor => actor.universe)).size);
});

test('FFVII materia entities never impersonate a party-member sprite', () => {
  for (const [id, entity, action] of [['cloud_ff7', 'Ifrit', 'Hellfire'], ['tifa_ff7', 'Shiva', 'Diamond Dust'], ['aerith_ff7', 'Bahamut', 'Megaflare']]) {
    const summon = resolveUniverseSummon(hero(id));
    assert.equal(summon.kind, 'summon');
    assert.equal(summon.entityName, entity);
    assert.equal(summon.action.name, action);
    assert.equal(summon.performer, null);
    assert.equal(summon.entityRender.kind, 'sprite-sheet');
    assert.equal(summon.entityRender.assetMissing, false);
    assert.equal(summon.entityRender.asset.id, `ff7-${entity.toLowerCase()}`);
    assert.equal(summon.entityRender.asset.entityName, entity);
    assert.equal(summon.entityRender.asset.actionName, action);
    assert.match(summon.entityRender.asset.sha256, /^[a-f0-9]{64}$/);
    assert.equal(summon.provenance.equipmentAssignment, true);
    assert.equal(summon.provenance.networkVerified, false);
  }
});

test('technical and realistic equipment stays a reinforcement instead of a magical summon', () => {
  for (const id of ['masterchief', 'doomslayer', 'sonic_hedgehog', 'skullgirls_parasoul', 'dallas', 'chell']) {
    const summon = resolveUniverseSummon(hero(id));
    assert.equal(summon.kind, 'reinforcement', id);
    assert.equal(summon.provenance.canonicalEntity, false, id);
  }
});

test('medical and barricade drones preserve healing and guard without damage targeting', () => {
  const medic = resolveUniverseSummon(hero('arca_loom'));
  assert.equal(medic.action.targeting.effect, 'heal');
  assert.equal(medic.action.targeting.targetSide, 'ally');
  assert.equal(medic.performer.id, 'arca_loom');
  const barricade = resolveUniverseSummon(hero('arca_bastion'));
  assert.equal(barricade.action.targeting.effect, 'guard');
  assert.equal(barricade.action.targeting.targetSide, 'ally');
  assert.equal(barricade.sourceAbility.name, hero('arca_bastion').secondary.name);
});

test('explicit support metadata and localized names survive without classifying by genre or name', () => {
  const actor = {
    id: 'test_actor', name: { fr: 'Héroïne', en: 'Hero' }, universe: 'Test universe',
    special: { name: { fr: 'Retour', en: 'Return' }, type: 'signature', dmg: 2, targeting: { effect: 'revive', targetSide: 'ally', shape: 'single', reviveRatio: 0.55 } },
    secondary: { name: 'Clean drone', type: 'summon', dmg: 0, targeting: { effect: 'cleanse', targetSide: 'ally', shape: 'group', cleanses: true } }
  };
  const before = JSON.stringify(actor);
  const profile = resolveMeleeSuper(actor);
  assert.equal(profile.name, 'Retour');
  assert.equal(profile.effect, 'revive');
  assert.equal(profile.reviveRatio, 0.55);
  const summon = resolveUniverseSummon(actor);
  assert.equal(summon.action.targeting.effect, 'cleanse');
  assert.equal(summon.action.targeting.cleanses, true);
  const changedCategory = { ...actor, category: 'different', weaponType: 'different' };
  assert.deepEqual(resolveMeleeSuper(changedCategory), profile);
  summon.sourceAbility.targeting.effect = 'damage';
  summon.performer.secondary.name = 'changed';
  profile.sourceAbility.targeting.reviveRatio = 0;
  assert.equal(JSON.stringify(actor), before);
  assert.equal(combatIdentityText({ en: 'Name' }), 'Name');
});

test('separate calls return independent profile and performer metadata', () => {
  for (const expected of [
    { callerId: 'dallas', performerId: 'chains_pd', abilityName: 'Couverture lourde de Chains', slot: 'special' },
    { callerId: 'houston_pd', performerId: 'dallas', abilityName: 'Sentry Deploy', slot: 'secondary' }
  ]) {
    const actor = hero(expected.callerId), performer = hero(expected.performerId);
    const callerBefore = JSON.stringify(actor), performerBefore = JSON.stringify(performer);
    const first = resolveUniverseSummon(actor), second = resolveUniverseSummon(actor);
    assert.equal(second.sourceHeroId, expected.performerId);
    assert.equal(second.sourceAbility.sourceHeroId, expected.performerId);
    assert.equal(second.sourceAbility.slot, expected.slot);
    assert.equal(second.performer.id, expected.performerId);
    assert.equal(second.performer.universe, actor.universe);
    assert.notEqual(first.action.targeting, second.action.targeting);
    assert.notEqual(first.sourceAbility, second.sourceAbility);
    assert.notEqual(first.performer.stats, second.performer.stats);
    assert.notEqual(first.performer.secondary, second.performer.secondary);
    first.action.targeting.effect = 'heal';
    first.sourceAbility.name = 'changed';
    first.performer.stats.hp = 1;
    first.performer.secondary.name = 'changed';
    assert.equal(second.action.targeting.effect, 'damage');
    assert.equal(second.sourceAbility.name, expected.abilityName);
    assert.deepEqual(second.performer.stats, performer.stats);
    assert.deepEqual(second.performer.secondary, performer.secondary);
    assert.equal(JSON.stringify(actor), callerBefore);
    assert.equal(JSON.stringify(performer), performerBefore);
    assert.deepEqual(resolveUniverseSummon(actor), second);
  }
  const one = resolveMeleeSuper(hero('aerith_ff7'));
  const two = resolveMeleeSuper(hero('aerith_ff7'));
  one.sourceAbility.targeting.healRatio = 0;
  assert.equal(two.sourceAbility.targeting.healRatio, 0.6);
  assert.equal(resolveMeleeSuper(hero('aerith_ff7')).healRatio, 0.6);
});

test('presentation phases preserve hero identity and state that finales are adaptations', () => {
  const actor = hero('cloud_ff7');
  for (const phase of ['intro', 'outro', 'fatality', 'victory', 'defeat', 'roundVictory', 'roundDefeat']) {
    const presentation = resolveCombatPresentation(actor, phase);
    assert.equal(presentation.phase, phase);
    assert.ok(presentation.name.includes(actor.name));
    assert.ok(presentation.description.includes(actor.universe));
    assert.equal(presentation.provenance.canonicalSequence, false);
  }
  assert.match(resolveCombatPresentation(actor, 'fatality').description, /adaptée/);
  assert.equal(resolveCombatPresentation(actor, 'round_win').phase, 'roundVictory');
  assert.equal(resolveCombatPresentation(actor, 'not-a-phase'), null);
  assert.equal(resolveCombatPresentation(null, 'intro'), null);
});
