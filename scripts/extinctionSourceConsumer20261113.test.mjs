import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { adaptExtinctionSourceAction, getExtinctionFighterProfile, rememberExtinctionPersonalKit,
  restoreExtinctionPersonalKit } from '../src/game/extinctionFighterProfiles.js';
import { EXTINCTION_SIGNATURE_IDS, getExtinctionSignature, createExtinctionProtocolState,
  activateExtinctionProtocol, tickExtinctionProtocols, mitigateExtinctionProtocolDamage,
  clearExtinctionProtocolEffects, getExtinctionActionReach } from '../src/game/extinctionSignatures.js';
import { getExtinctionAimReadout } from '../src/game/extinctionAimReadout.js';
import { getExtinctionSchematicView, drawExtinctionSchematicView } from '../src/game/extinctionSchematicView.js';
import { buildExtinctionFighterCatalog } from './extinctionFighterCatalog.mjs';
import { extinctionSourceConsumerAmendment as fixture, assertExtinctionSourceAmendment } from './fixtures/extinctionSourceConsumerAmendment.mjs';

const heroes = [createPlayerHero(), ...HEROES_DB];
const actor = id => heroes.find(hero => hero.id === id);
const slots = ['simple', 'secondary', 'defense', 'special'];
const guardRow = (hero, slot) => ({ actorId: hero.id, universe: hero.universe, slot,
  name: hero[slot].name, type: hero[slot].type, targeting: hero[slot].targeting || null });
const make = hero => {
  const profile = getExtinctionFighterProfile(hero);
  return { phase: 'running', runId: 'source-consumer-20261113', heroId: hero.id, heroCategory: hero.category,
    hp: 20, maxHp: 120, px: 0, py: 0, angle: 0, t: 0, kills: 0, ammo: 24, reserveAmmo: 72,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: profile.resource.kind },
    enemies: [{ id: 'target', kind: 'Traqueur', wx: 0, wy: 1, hp: 500, maxHp: 500, size: 1 }],
    protocols: createExtinctionProtocolState(profile.signature, 'source-consumer-20261113') };
};
const tick = (state, count) => { for (let i = 0; i < count; i++) { state.t++; tickExtinctionProtocols(state); } };

test('the closed source amendment retains historical evidence and restores exactly all 7,244 current actions', () => {
  assertExtinctionSourceAmendment(heroes);
  assert.equal(fixture.baselineSourceCommit, '98991b161d0116dd9fa8d52d42f2337a243f2091');
  assert.equal(fixture.historicalPublishedCounts.actions, 7244);
  assert.equal(fixture.historicalPublishedCounts.genericSourceReview, 1633);
  assert.deepEqual(fixture.observedBaseline9899, { actions: 7182, genericSourceReview: 1583, ignoredGuardSlots: 61, unsupportedAreaSlots: 1 });
  assert.deepEqual(fixture.observedCurrentBeforeFix, { actions: 7137, genericSourceReview: 1556, ignoredGuardSlots: 106, unsupportedAreaSlots: 1 });
  assert.equal(fixture.newGuardSlotRegressions.length, 45);
  assert.equal(fixture.restoredGuardSlots.length, 106);
  assert.equal(fixture.ballisticClassification.currentProjectionRegressionsRestored.length, 13);
  assert.deepEqual(fixture.ballisticClassification.olderAdapterRegressionRestored, ['masterchief']);
  assert.deepEqual(fixture.intentionalBallisticSourceCorrections, ['baird', 'kait_diaz']);
  assert.deepEqual(fixture.ballisticClassification.intentionalSourceArmamentCorrections, fixture.intentionalBallisticSourceCorrections);
  assert.equal(fixture.ballisticSourceBindings.length, 16);
  assert.deepEqual(heroes.filter(hero => getExtinctionFighterProfile(hero).signature?.actions.simple?.sourceBallisticCompatibility)
    .map(hero => hero.id).sort(), [...fixture.ballisticSourceBindings].sort(), 'exactly the reviewed actors receive the binding');
  const keys = rows => rows.map(row => `${row.universe}/${row.actorId}/${row.slot}`);
  assert.equal(new Set(keys(fixture.restoredGuardSlots)).size, 106);
  assert.ok(keys(fixture.newGuardSlotRegressions).every(key => keys(fixture.restoredGuardSlots).includes(key)));
  assert.equal(fixture.observedBaseline9899.actions - fixture.observedCurrentBeforeFix.actions, 45);
  assert.equal(fixture.expectedCurrentCounts.actions - fixture.observedCurrentBeforeFix.actions, 107);
  assert.deepEqual(buildExtinctionFighterCatalog().counts, fixture.expectedCurrentCounts);
  assert.equal(fixture.source1to1Verified, false); assert.equal(fixture.artApproved, false);
});

test('every declared raw guard is executable self support, with no enemy damage or invented firearm resource', () => {
  const snapshot = JSON.stringify(heroes), actual = [];
  for (const hero of heroes.filter(hero => getExtinctionFighterProfile(hero).eligible)) for (const slot of slots) {
    if (hero[slot]?.type !== 'guard') continue;
    actual.push(guardRow(hero, slot));
    const action = adaptExtinctionSourceAction(hero, slot), state = make(hero);
    assert.equal(action.kind, 'guard', `${hero.id}.${slot}`); assert.equal(action.damage, 0);
    assert.equal(action.resource, 'cooldown'); assert.deepEqual(getExtinctionActionReach(action), { kind: 'self', value: 0 });
    state.protocols.charge = 100;
    const result = activateExtinctionProtocol(state, slot);
    assert.equal(result.activated, true, `${hero.id}.${slot}`); assert.equal(result.damage, 0);
    assert.ok(state.protocols.guard > 0, `${hero.id}.${slot}`);
    assert.ok(mitigateExtinctionProtocolDamage(state, 100) < 100);
    tick(state, 90);
    assert.equal(state.enemies[0].hp, 500); assert.equal(state.weapon.ammo, 24);
    assert.equal(state.protocols.projectiles.length, 0);
  }
  assert.deepEqual(actual, fixture.restoredGuardSlots);
  assert.equal(JSON.stringify(heroes), snapshot);
});

for (const id of fixture.ballisticSourceBindings) test(`${id}: exact selected firearm consumes 24→23 once, hits now, retains cooldown and personal stock`, () => {
  const hero = actor(id), snapshot = JSON.stringify(hero), state = make(hero);
  const action = state.protocols.profile.actions.simple;
  assert.equal(action.kind, 'hitscan'); assert.equal(action.resource, 'ammo');
  assert.equal(action.sourceType, 'projectile'); assert.equal(action.sourceDelivery, 'projectile');
  assert.equal(action.sourceBallisticCompatibility, 'exact-source-firearm-projectile-to-FPS-hitscan');
  assert.equal(activateExtinctionProtocol(state, 'simple').activated, true);
  assert.equal(state.weapon.ammo, 23); assert.equal(state.ammo, 23);
  assert.equal(state.enemies[0].hp, 500 - action.damage); assert.equal(state.protocols.projectiles.length, 0);
  assert.equal(activateExtinctionProtocol(state, 'simple').activated, false);
  assert.equal(state.ammo, 23); assert.equal(state.protocols.cooldowns.simple, 20);
  assert.equal(rememberExtinctionPersonalKit(state), true);
  state.weapon = { type: 'rocket', ammo: 4, maxAmmo: 4 }; state.ammo = 4;
  tick(state, 5);
  assert.equal(restoreExtinctionPersonalKit(state), true);
  assert.equal(state.ammo, 23); assert.equal(state.weapon.ammo, 23); assert.equal(state.protocols.cooldowns.simple, 15);
  assert.equal(restoreExtinctionPersonalKit(state), false);
  assert.equal(JSON.stringify(hero), snapshot);
});

test('firearm aliases reject every changed actor/source discriminator and custom profile instead of making a ballistic copy', () => {
  const mutations = [
    ['identity', h => { h.id += '_custom'; }], ['universe', h => { h.universe = 'Foreign'; }],
    ['name', h => { h.name += ' custom'; }], ['edition', h => { h.incarnation += ' custom'; }],
    ['weapon type', h => { h.weaponType = 'energy'; }], ['equipment', h => { h.equipment = ['Energy projector']; }],
    ['reference', h => { h.referenceUrl += '?custom'; }],
    ['revision', h => { h[['Gears of War', 'Dead Space'].includes(h.universe) ? 'sourceFidelityAudit' : 'sourceContractRevision'] += '-custom'; }],
    ['action name', h => { h.simple.name += ' custom'; }], ['damage', h => { h.simple.dmg += .01; }],
    ['animation duration', h => { h.simple.animationDuration = .6; }], ['hit timing', h => { h.simple.hitAt = .25; }],
    ['missing own key', h => { delete h.simple.hitAt; }], ['extra source key', h => { h.simple.custom = true; }],
    ['custom attack profile', h => { h.simple.attackProfile = { delivery: 'projectile' }; }],
    ['custom RPG profile', h => { h.simple.rpgProfile = { delivery: 'projectile' }; }],
    ['target effect', h => { h.simple.targeting.effect = 'control'; }],
    ['target delivery', h => { h.simple.targeting.delivery = 'energy'; }],
    ['target shape', h => { h.simple.targeting.shape = 'area'; }],
    ['target range', h => { h.simple.targeting.range++; }],
    ['target side', h => { h.simple.targeting.targetSide = 'ally'; }],
    ['extra target key', h => { h.simple.targeting.custom = true; }],
    ['inherited action value', h => { const hitAt = h.simple.hitAt; delete h.simple.hitAt;
      Object.setPrototypeOf(h.simple, { hitAt }); }]
  ];
  for (const id of fixture.ballisticSourceBindings) for (const [label, mutate] of mutations) {
    const hero = structuredClone(actor(id)); mutate(hero);
    const action = adaptExtinctionSourceAction(hero, 'simple');
    assert.equal(action.sourceBallisticCompatibility, undefined, `${id}: ${label}`);
    assert.equal(action.kind, 'projectile', `${id}: ${label}`);
    assert.equal(action.resource, 'cooldown', `${id}: ${label}`);
  }
  for (const id of fixture.ballisticSourceBindings) {
    if (!['Gears of War', 'Dead Space'].includes(actor(id).universe)) continue;
    for (const [key, value] of [['slot', 'secondary'], ['sourceHeroId', 'foreign']]) {
      const hero = structuredClone(actor(id)); hero.simple[key] = value;
      assert.equal(adaptExtinctionSourceAction(hero, 'simple').kind, 'projectile', `${id}: ${key}`);
    }
  }
  const secondary = structuredClone(actor('masterchief')); secondary.secondary = secondary.simple;
  assert.equal(adaptExtinctionSourceAction(secondary, 'secondary').kind, 'projectile');
});

test('energy, magic, plasma, water, cannon and rocket stay travelling cooldown effects even on the selected firearm identity', () => {
  for (const id of fixture.ballisticSourceBindings) for (const type of ['projectile', 'energy', 'magic', 'plasma', 'water', 'cannon_aoe', 'rocket']) {
    const hero = structuredClone(actor(id)); hero.simple = { name: 'Different explicit source', type, dmg: 1.2,
      targeting: { effect: 'damage', delivery: 'projectile', shape: 'single', range: 480, targetSide: 'enemy' } };
    const state = make(hero), action = state.protocols.profile.actions.simple;
    assert.equal(action.kind, 'projectile'); assert.equal(action.resource, 'cooldown');
    assert.equal(action.sourceBallisticCompatibility, undefined);
    assert.equal(activateExtinctionProtocol(state, 'simple').activated, true);
    assert.equal(state.ammo, 24); assert.equal(state.enemies[0].hp, 500);
    assert.equal(state.protocols.projectiles.length, 1);
    assert.equal(state.protocols.projectiles[0].kind, ['rocket', 'cannon_aoe'].includes(type) ? 'rocket' : 'bolt');
  }
  for (const type of ['future-unmapped', 'constructor', '__proto__', null, false, 1]) {
    assert.equal(adaptExtinctionSourceAction({ ...actor('masterchief'), simple: { name: 'Unknown', type } }, 'simple'), null);
  }
});

test('Marcus uses the actual 2.5-second/80% source cover while Chell keeps four non-damaging source supports', () => {
  const marcus = make(actor('marcus'));
  assert.equal(activateExtinctionProtocol(marcus, 'defense').activated, true);
  assert.equal(marcus.protocols.guard, 150); assert.equal(marcus.protocols.reduction, .8);
  assert.ok(Math.abs(mitigateExtinctionProtocolDamage(marcus, 100) - 20) < 1e-9);
  for (const slot of slots) {
    const hero = actor('chell'), state = make(hero), source = hero[slot]; state.protocols.charge = 100;
    const result = activateExtinctionProtocol(state, slot);
    assert.equal(result.activated, true); assert.equal(result.damage, 0);
    assert.equal(state.protocols.guard, Math.round(source.targeting.duration * 60));
    assert.equal(state.protocols.reduction, source.targeting.reduce);
    assert.equal(state.weapon.resource, 'cooldown'); assert.equal(state.weapon.ammo, 24);
    assert.equal(state.enemies[0].hp, 500); assert.equal(state.protocols.projectiles.length, 0);
    assert.equal(state.protocols.charge, slot === 'special' ? 0 : 100, 'non-damaging activation earns no charge');
    const aim = getExtinctionAimReadout(make(hero), 'en', { width: 840, height: 430 });
    assert.equal(aim.condition, 'self'); assert.equal(aim.targetId, null); assert.equal(aim.range, 0);
    state.phase = 'ended'; clearExtinctionProtocolEffects(state); clearExtinctionProtocolEffects(state);
    assert.equal(state.protocols.effects.length, 0); assert.equal(state.protocols.projectiles.length, 0);
    assert.equal(mitigateExtinctionProtocolDamage(state, 100), 100, 'ended support cannot protect a later run');
    const ended = structuredClone(state); tickExtinctionProtocols(state); assert.deepEqual(state, ended);
    const nextRun = make(hero); assert.equal(nextRun.protocols.guard, 0); assert.equal(nextRun.protocols.buff, 0);
    assert.deepEqual(nextRun.protocols.casts, { simple: 0, secondary: 0, defense: 0, special: 0 });
  }
});

test('Liara’s existing declared damaging area is a radial pulse, never a borrowed projectile', () => {
  const hero = actor('liara'), state = make(hero); state.protocols.charge = 100;
  const action = state.protocols.profile.actions.special;
  assert.equal(hero.special.type, 'area'); assert.equal(hero.special.name, 'Singularity');
  assert.equal(action.kind, 'pulse'); assert.equal(action.sourceDelivery, 'area');
  state.enemies.push({ ...state.enemies[0], id: 'outside', wy: action.range + .01 });
  const result = activateExtinctionProtocol(state, 'special');
  assert.equal(result.activated, true); assert.ok(state.enemies[0].hp < 500);
  assert.equal(state.enemies[1].hp, 500); assert.equal(state.protocols.projectiles.length, 0);
  assert.equal(state.ammo, 24); assert.equal(state.protocols.charge, 0);
});

function drawingContext() {
  const operations = []; let depth = 0;
  const methods = new Set(['translate', 'scale', 'beginPath', 'closePath', 'moveTo', 'lineTo', 'bezierCurveTo', 'arc', 'stroke', 'fill']);
  return { operations, depth: () => depth, ctx: new Proxy({}, {
    set() { return true; }, get(_, key) {
      if (key === 'save') return () => { depth++; operations.push(['save']); };
      if (key === 'restore') return () => { depth--; operations.push(['restore']); };
      assert.ok(methods.has(key), `No unreviewed drawing/image/firearm fallback ${String(key)}`);
      return (...args) => { assert.ok(args.every(Number.isFinite)); operations.push([key, ...args]); };
    }
  }) };
}

test('all 17 non-offensive current primaries use a bound support diagram with pure pause-safe geometry and no art claim', () => {
  const snapshot = JSON.stringify(heroes); let count = 0;
  for (const hero of heroes) {
    const profile = getExtinctionFighterProfile(hero);
    if (!['guard', 'buff', 'heal', 'support'].includes(profile.signature?.actions.simple?.kind)) continue;
    count++; const state = make(hero), before = structuredClone(state), drawing = drawingContext();
    const view = getExtinctionSchematicView(state);
    assert.equal(view.ownerId, hero.id); assert.equal(view.source, 'personal'); assert.equal(view.style, 'support');
    assert.equal(view.resource, 'cooldown'); assert.equal(view.artwork, false); assert.equal(view.morphologyInferred, false);
    drawExtinctionSchematicView(drawing.ctx, state, 840, 430);
    assert.equal(drawing.depth(), 0); assert.deepEqual(state, before);
    state.paused = true; const paused = drawingContext(); drawExtinctionSchematicView(paused.ctx, state, 840, 430);
    assert.deepEqual(paused.operations, drawing.operations);
    state.protocols.ownerId = 'foreign'; assert.equal(getExtinctionSchematicView(state).style, 'neutral');
  }
  assert.equal(count, 17); assert.equal(JSON.stringify(heroes), snapshot);
});

test('all twelve authored Nexus kits remain exact and no ownership, progression, reward or source record is mutated', () => {
  const snapshot = JSON.stringify(heroes);
  for (const id of EXTINCTION_SIGNATURE_IDS) assert.deepEqual(getExtinctionFighterProfile(actor(id)).signature, getExtinctionSignature(actor(id)));
  assert.equal(JSON.stringify(heroes), snapshot);
  for (const id of ['chell', 'marcus', 'masterchief']) {
    const state = make(actor(id)); activateExtinctionProtocol(state, 'simple');
    for (const key of ['ownedHeroes', 'inventory', 'save', 'progression', 'rewards', 'currency']) assert.equal(state[key], undefined);
  }
});
