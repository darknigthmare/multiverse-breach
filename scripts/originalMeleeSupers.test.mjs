import assert from 'node:assert/strict';
import test from 'node:test';
import { EngineSmash } from '../src/game/engineSmash.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveMeleeSuper, resolveSmashSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';
import { getOriginalMeleeSuper } from '../src/game/originalMeleeSupers.js';
import { getRpgActionProfile } from '../src/game/rpgTargeting.js';
import { tickMeleeCombatActor } from '../src/game/melee/meleeCombatRuntime.js';

const manifest = ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => world.heroes);
const originals = manifest.map(source => HEROES_DB.find(hero => hero.id === source.id && hero.universe === source.universe));
const roster = originals.filter(getOriginalMeleeSuper);
const dummy = (id, universe) => ({
  id, name: id, universe, category: 'practice', stats: { hp: 300, atk: 10, def: 0, spd: 5 },
  simple: { name: 'Practice strike', type: 'melee', dmg: 1 }, defense: { reduce: 0.4, dur: 1 },
  primaryColor: '#202020', secondaryColor: '#c0c0c0'
});

function makeBattle(actor, side = 'player', control = 'p2') {
  const universe = actor.universe;
  const stage = { id: 'original-melee-supers', name: 'Original Melee QA', mode: 'Smash', universe, disableHazards: true,
    customBattle: { singleRoster: true, opponentControl: control } };
  const own = [actor, dummy('near-ally', universe), dummy('far-ally', universe)];
  const other = ['front', 'second', 'distant'].map(id => dummy(id, universe));
  const [players, customRoster] = side === 'player' ? [own, other] : [other, own];
  const cues = [];
  const emissions = [];
  const engine = new EngineSmash(1200, 530, players, { monsters: customRoster, bosses: [], worldBoss: null, customRoster },
    { add(...args) { emissions.push(args); } }, cue => cues.push(cue), () => {}, stage);
  engine.syncPreMatchFromServer(3000);
  const [team, opponents] = side === 'player' ? [engine.heroes, engine.enemies] : [engine.enemies, engine.heroes];
  const [source, near, far] = team;
  const facing = side === 'player' ? 1 : -1;
  const profile = engine.getMeleeSuper(source);
  const radius = Math.min(profile.range, profile.areaRadius);
  const positions = [500, 500 + facing * 48, 500 - facing * 390, 500 + facing * 40,
    profile.delivery === 'radial' ? 500 - facing * (radius - 8) : 500 + facing * 64,
    500 + facing * (profile.range + 100)];
  [...team, ...opponents].forEach((unit, index) => Object.assign(unit, {
    x: positions[index], y: engine.groundY, vx: 0, vy: 0, facing: index < 3 ? facing : -facing,
    state: 'idle', stateTimer: 0
  }));
  team.forEach(unit => {
    unit.currentHp = Math.max(1, unit.currentHp - 40);
    unit.statusEffects.glitched = 80;
    unit.statusEffects.infected = 80;
  });
  source.specialCharge = 100;
  return { engine, source, team, near, far, opponents, profile, cues, emissions };
}

function advance(engine, source, seconds) {
  for (let elapsed = 0; elapsed < seconds - 1e-8;) {
    const dt = Math.min(1 / 60, seconds - elapsed);
    tickMeleeCombatActor(source, dt, { resolveActionHit: (actor, action) => engine.resolveMeleeActionHit(actor, action) });
    elapsed += dt;
  }
}

function snapshot(units) {
  return units.map(unit => ({ hp: unit.currentHp, ...unit.statusEffects, support: unit.meleeSuperSupport || null }));
}

test('sixty manifest heroes receive distinct scoped Melee contracts and preserve their other modes', () => {
  assert.equal(originals.length, 60);
  assert.equal(roster.length, 60);
  assert.equal(new Set(roster.map(hero => hero.id)).size, 60);
  assert.equal(new Set(roster.map(hero => JSON.stringify(getOriginalMeleeSuper(hero).special.targeting))).size, 60);
  for (const [index, actor] of originals.entries()) {
    const generic = resolveMeleeSuper(actor);
    const melee = resolveSmashSuper(actor);
    assert.equal(melee.originalMelee === true, roster.includes(actor));
    assert.deepEqual(actor.special, manifest[index].special);
    assert.deepEqual(resolveCombatAbility(actor, 'special'), generic);
    assert.equal(getRpgActionProfile(actor, 'special').name, generic.name);
    assert.ok(resolveUniverseSummon(actor));
    if (melee.originalMelee) {
      assert.equal(melee.name, actor.special.name);
      assert.equal(melee.color, actor.special.color);
      assert.equal(melee.meterCost, 100);
      assert.equal(melee.provenance.identityBasis, 'original-project-manifest');
    } else assert.deepEqual(melee, generic);
  }
});

for (const actor of roster) test(`normal P1 and P2 Melee dispatch resolves ${actor.name}'s ${actor.special.name}`, () => {
  for (const side of ['player', 'p2']) {
    const { engine, source, team, opponents, near, profile, cues, emissions } = makeBattle(actor, side);
    try {
      const { effect, shape, statusEffect } = profile;
      const alliesBefore = snapshot(team);
      const foesBefore = snapshot(opponents);
      const expected = effect === 'damage' ? opponents.slice(0, shape === 'single' ? 1 : 2)
        : profile.targetSide === 'self' ? [source] : [source, near];
      assert.deepEqual(new Set(engine.getMeleeSuperTargets(source, profile)), new Set(expected));
      assert.equal(engine.triggerMeleeAction(side, 'Special'), true);
      const action = source.action;
      assert.equal(action.id, 'super');
      assert.deepEqual(action.superProfile, profile);
      assert.equal(source.specialCharge, 0);
      assert.equal(engine.triggerMeleeAction(side, 'Special'), false);
      assert.equal(cues.filter(cue => cue === 'special').length, 1);
      assert.equal(emissions.filter(args => args.at(-1) === profile.name).length, 1);
      advance(engine, source, action.hitAt - 0.006);
      assert.deepEqual(snapshot(team), alliesBefore);
      assert.deepEqual(snapshot(opponents), foesBefore);
      advance(engine, source, 0.012);
      for (const [index, foe] of opponents.entries()) {
        const accepted = effect === 'damage' && expected.includes(foe);
        assert.equal(foe.currentHp < foesBefore[index].hp, accepted);
        assert.equal(foe.statusEffects.glitched > 0, accepted && statusEffect === 'glitched');
      }
      for (const [index, ally] of team.entries()) {
        const accepted = effect !== 'damage' && expected.includes(ally);
        const before = alliesBefore[index];
        const restored = accepted && effect === 'heal' ? Math.min(ally.maxHp - before.hp, ally.maxHp * profile.healRatio) : 0;
        assert.equal(ally.currentHp, before.hp + restored);
        assert.equal(ally.statusEffects.glitched, accepted && effect === 'cleanse' ? 0 : before.glitched);
        assert.equal(ally.statusEffects.infected, before.infected);
        const support = accepted && (effect === 'guard' || effect === 'buff') ? effect : null;
        assert.equal(ally.meleeSuperSupport?.effect || null, support);
        if (support === 'guard') assert.equal(ally.meleeSuperSupport.guardReduce, profile.guardReduce);
        if (support === 'buff') assert.equal(ally.meleeSuperSupport.buffMultiplier, profile.buffMultiplier);
        if (support) assert.equal(ally.meleeSuperSupport.remaining, profile.effectDuration);
      }
      if (effect === 'damage') assert.equal(action.visualConfirmedContact?.confirmed, true);
      const afterImpact = snapshot([...team, ...opponents]);
      assert.equal(engine.resolveMeleeActionHit(source, action), 0);
      advance(engine, source, action.duration);
      assert.deepEqual(snapshot([...team, ...opponents]), afterImpact);
      assert.equal(source.action, null);
      assert.equal(source.specialCharge, 0);
    } finally {
      engine.dispose();
    }
  }
});

test('a zone whiffs on a target that moves away before release and leaves no confirmed contact', () => {
  const actor = roster.find(hero => hero.id === 'numa_corvinus');
  const { engine, source, opponents, profile } = makeBattle(actor);
  try {
    assert.equal(engine.triggerMeleeAction('player', 'Special'), true);
    assert.deepEqual(engine.getMeleeSuperTargets(source, profile), opponents.slice(0, 2));
    const before = snapshot(opponents);
    opponents.forEach(target => { target.x = source.x + profile.range + 1; });
    advance(engine, source, source.action.hitAt + 0.006);
    assert.deepEqual(snapshot(opponents), before);
    assert.equal(source.action.visualConfirmedContact, undefined);
  } finally {
    engine.dispose();
  }
});

test('the scoped cleanse recognizes the exact ailment for a CPU actor and respects supplied loadouts', () => {
  const actor = roster.find(hero => hero.id === 'aoi_mikazuki');
  const { engine, source, team, near } = makeBattle(actor, 'p2', 'cpu');
  try {
    team.forEach(unit => { unit.statusEffects.glitched = 0; });
    assert.equal(engine.tryCpuMeleeSuper(source), false);
    assert.equal(source.specialCharge, 100);
    near.statusEffects.glitched = 70;
    assert.equal(engine.tryCpuMeleeSuper(source), true);
    advance(engine, source, source.action.hitAt + 0.006);
    assert.equal(near.statusEffects.glitched, 0);
    assert.equal(near.statusEffects.infected, 80);
  } finally {
    engine.dispose();
  }
  const edited = [
    { ...actor, name: 'A different name' }, { ...actor, weaponType: 'unrelated_weapon' },
    { ...actor, loreRole: 'A different hero' }, { ...actor, universe: 'Other universe' },
    { ...actor, sourceUniverse: 'Another continuity' }, { ...actor, sourceType: 'other' },
    { ...actor, originalContent: false }, { ...actor, isBoss: true },
    { ...actor, rpgAttacks: { special: { shape: 'cone' } } }, { ...actor, smashAttacks: { special: { shape: 'line' } } },
    { ...actor, special: { ...actor.special, targeting: { effect: 'guard', targetSide: 'self' } } },
    { ...actor, special: { ...actor.special, animationDuration: 0.8 } }
  ];
  for (const stale of edited) {
    assert.equal(getOriginalMeleeSuper(stale), null);
    assert.deepEqual(resolveSmashSuper(stale), resolveMeleeSuper(stale));
  }
});

test('Doros’s protection changes incoming damage only for covered allies while its timer is active', () => {
  const actor = roster.find(hero => hero.id === 'doros_bronzehand');
  const { engine, source, near, far, opponents, profile } = makeBattle(actor);
  try {
    assert.equal(engine.triggerMeleeAction('player', 'Special'), true);
    advance(engine, source, source.action.hitAt + 0.006);
    assert.equal(near.meleeSuperSupport.guardReduce, 0.44);
    near.currentHp = near.maxHp;
    far.currentHp = far.maxHp;
    const unprotected = engine.applyDamage(opponents[0], far, 100, 0);
    const protectedDamage = engine.applyDamage(opponents[0], near, 100, 0);
    assert.ok(protectedDamage < unprotected * 0.7);
    advance(engine, near, profile.effectDuration + 0.02);
    assert.equal(near.meleeSuperSupport, null);
    assert.ok(engine.applyDamage(opponents[0], near, 100, 0) > protectedDamage);
  } finally {
    engine.dispose();
  }
});
