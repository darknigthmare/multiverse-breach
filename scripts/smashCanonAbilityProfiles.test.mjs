import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';

import { getHeroById } from '../src/game/heroes.js';
import { grantCombatEventBuff } from '../src/game/combatEventBuffs.js';
import { initializeMeleeActorRuntime, tickMeleeCombatActor } from '../src/game/melee/meleeCombatRuntime.js';
import { getSmashAbilityProfile } from '../src/game/smashAbilityProfiles.js';
import { MELEE_ACTIONS } from '../src/game/melee/meleeInputMap.js';

let vite;
let EngineSmash;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?canon-smash-profiles'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

function makeEngine(id) {
  const calls = [];
  const cues = [];
  const threat = { id: 'threat', name: 'Threat', hp: 10000, atk: 1, def: 0, spd: 1, weapon: 'melee' };
  const engine = new EngineSmash(760, 420, [getHeroById(id)], { monsters: [threat], customRoster: [threat], bosses: [] },
    { add: (...args) => calls.push(args) }, cue => cues.push(cue), () => {},
    { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'cpu' } });
  engine.syncPreMatchFromServer(3000);
  const hero = engine.heroes[0];
  Object.assign(hero, { x: 100, y: 300, facing: 1, state: 'idle', cooldown: 0, specialCharge: 100 });
  engine.particleCalls = calls;
  engine.soundCues = cues;
  engines.push(engine);
  return engine;
}

function placeTargets(engine, positions) {
  engine.enemies = positions.map(([x, y = 300], index) => initializeMeleeActorRuntime({
    id: `target:${index}`, name: `Target ${index}`, x, y, vx: 0, vy: 0, facing: -1,
    maxHp: 10000, currentHp: 10000, stats: { hp: 10000, atk: 1, def: 0, spd: 1 },
    state: 'idle', stateTimer: 0, statusEffects: { infected: 0, glitched: 0, radiated: 0 },
    defense: { reduce: 0.4, dur: 1 }, cooldown: 10000
  }));
  return engine.enemies;
}
const damaged = targets => targets.filter(target => target.currentHp < target.maxHp).map(target => target.id);
const types = engine => engine.particleCalls.map(call => call[7]);

test('unreviewed legacy heroes retain the old Smash rules until an explicit Smash profile is declared', () => {
  assert.equal(getSmashAbilityProfile({ id: 'legacy', simple: { type: 'bullet', attackProfile: { shape: 'single', range: 999 } } }, 'simple'), null);
  assert.equal(getSmashAbilityProfile({ id: 'custom', simple: { smashProfile: { delivery: 'ranged', range: 200, maxTargets: 5 } } }, 'simple').range, 200);
  const engine = makeEngine('han_solo');
  engine.heroes[0].id = 'legacy';
  const targets = placeTargets(engine, [[120], [140], [500]]);
  engine.triggerAbility(engine.heroes[0], 'special');
  assert.deepEqual(damaged(targets), ['target:0', 'target:1', 'target:2']);
  assert.ok(types(engine).includes('glitch'));
});

test('Han actually fires his simple DL-44 at distance and rejects targets behind, above and beyond its range', () => {
  const engine = makeEngine('han_solo');
  const targets = placeTargets(engine, [[280], [50], [430], [200, 360]]);
  engine.triggerAbility(engine.heroes[0], 'simple');
  assert.deepEqual(damaged(targets), ['target:0']);
  assert.equal(engine.heroes[0].specialCharge, 100);
  assert.ok(engine.particleCalls.some(call => call[7] === 'laser_line' && call[4] === '#ff4136'));
});

test('Han’s special selects at most three nearest in-range enemies instead of exploding across the arena', () => {
  const engine = makeEngine('han_solo');
  const targets = placeTargets(engine, [[350], [150], [200], [250], [60], [450]]);
  engine.triggerAbility(engine.heroes[0], 'special');
  assert.deepEqual(damaged(targets), ['target:1', 'target:2', 'target:3']);
  assert.equal(engine.heroes[0].specialCharge, 0);
  assert.equal(types(engine).includes('glitch'), false);
});

test('Vader’s Force choke damages one selected nearby opponent without a laser or global explosion', () => {
  const engine = makeEngine('vader');
  const targets = placeTargets(engine, [[280], [180], [190], [70], [450]]);
  engine.triggerAbility(engine.heroes[0], 'special');
  assert.deepEqual(damaged(targets), ['target:1']);
  assert.equal(targets[1].vx, 0, 'choke inherited explosive horizontal launch');
  assert.equal(types(engine).includes('laser_line'), false);
  assert.equal(types(engine).includes('glitch'), false);
});

test('Luke’s special is a single close lightsaber duel and telekinesis supplies no electrical ray', () => {
  const engine = makeEngine('luke');
  const targets = placeTargets(engine, [[140], [160], [220]]);
  engine.triggerAbility(engine.heroes[0], 'special');
  assert.deepEqual(damaged(targets), ['target:0']);
  assert.equal(types(engine).includes('glitch'), false);
  targets.forEach(target => { target.currentHp = target.maxHp; });
  engine.triggerAbility(engine.heroes[0], 'secondary');
  assert.deepEqual(damaged(targets), ['target:0']);
  assert.equal(engine.heroes[0].cooldown, engine.heroes[0].secondary.cd * 60);
  assert.equal(types(engine).includes('laser_line'), false);
});

for (const id of ['bob_minions', 'kevin_minions']) {
  test(`${id} comic contact special stays close to one target, and the banana throw replaces its laser`, () => {
    const engine = makeEngine(id);
    const targets = placeTargets(engine, [[180], [150], [160]]);
    engine.triggerAbility(engine.heroes[0], 'special');
    assert.deepEqual(damaged(targets), ['target:1']);
    assert.equal(types(engine).includes('glitch'), false);
    targets.forEach(target => { target.currentHp = target.maxHp; });
    engine.triggerAbility(engine.heroes[0], 'secondary');
    assert.deepEqual(damaged(targets), ['target:1']);
    assert.ok(types(engine).includes('banana'));
    assert.equal(types(engine).includes('laser_line'), false);
    const before = targets.map(target => target.currentHp);
    assert.equal(engine.triggerAbility(engine.heroes[0], 'secondary'), false, 'cooldown was ignored');
    assert.deepEqual(targets.map(target => target.currentHp), before);
  });
}

test('Stuart’s guitar riffs are musical and his area adaptation has a local radius', () => {
  const engine = makeEngine('stuart_minions');
  const targets = placeTargets(engine, [[180], [30], [270], [190, 360], [250, 390]]);
  engine.triggerAbility(engine.heroes[0], 'special');
  assert.deepEqual(damaged(targets), ['target:0', 'target:1', 'target:3']);
  assert.ok(types(engine).includes('music'));
  assert.equal(types(engine).includes('laser_line'), false);
  assert.equal(types(engine).includes('glitch'), false);
});

test('shared RPG group targeting and non-pixel ranges cannot override declared Smash radius and contact distances', () => {
  const stuart = { ...getHeroById('stuart_minions'), special: { ...getHeroById('stuart_minions').special, attackProfile: { shape: 'group', range: 9999 } } };
  const luke = { ...getHeroById('luke'), simple: { ...getHeroById('luke').simple, attackProfile: { shape: 'single', delivery: 'melee', range: 1 } } };
  assert.equal(getSmashAbilityProfile(stuart, 'special').shape, 'area');
  assert.equal(getSmashAbilityProfile(stuart, 'special').range, 160);
  assert.equal(getSmashAbilityProfile(luke, 'simple').range, 70);
  assert.equal(getSmashAbilityProfile({ ...luke, smashAttacks: { simple: { range: 100 } } }, 'simple').range, 100);
});

test('source profiles also govern the real timed keyboard/touch melee special and preserve its meter cost', () => {
  const engine = makeEngine('vader');
  const hero = engine.heroes[0];
  const targets = placeTargets(engine, [[250], [200], [210]]);
  assert.equal(engine.triggerMeleeAction('player', MELEE_ACTIONS.special), true);
  assert.equal(hero.specialCharge, 70);
  for (let frame = 0; frame < 20; frame++) {
    tickMeleeCombatActor(hero, 1 / 60, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
  }
  assert.deepEqual(damaged(targets), ['target:1']);
  assert.equal(types(engine).includes('laser_line'), false);
  assert.equal(types(engine).includes('glitch'), false);
});

test('Han’s timed melee input uses the blaster’s range while retaining its original action damage', () => {
  const engine = makeEngine('han_solo');
  const hero = engine.heroes[0];
  hero.y = engine.arena.groundY;
  const targets = placeTargets(engine, [[280, hero.y], [290, hero.y]]);
  assert.equal(engine.triggerMeleeAction('player', MELEE_ACTIONS.attackLight), true);
  for (let frame = 0; frame < 20; frame++) {
    tickMeleeCombatActor(hero, 1 / 60, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
  }
  assert.deepEqual(damaged(targets), ['target:0']);
  assert.ok(types(engine).includes('laser_line'));
});

test('local P2 retains the source ID, facing and single-target choke when playing Vader', () => {
  const engine = makeEngine('luke');
  const vader = initializeMeleeActorRuntime({ ...getHeroById('vader'), id: 'p2:vader:0', sourceId: 'vader', x: 500, y: 300,
    currentHp: 1000, maxHp: 1000, facing: -1, state: 'idle', stateTimer: 0, specialCharge: 100 });
  engine.enemies = [vader];
  engine.isLocalP2 = true;
  engine.activeOpponentId = vader.id;
  engine.heroes = placeTargets(engine, [[400], [390], [550]]);
  engine.enemies = [vader];
  assert.equal(engine.triggerOpponentAbility('special'), true);
  assert.deepEqual(damaged(engine.heroes), ['target:0']);
  assert.equal(vader.specialCharge, 0);
  assert.equal(types(engine).includes('laser_line'), false);
  assert.equal(types(engine).includes('glitch'), false);
});

test('source-profiled damage still passes through combat buffs and depletion guards', () => {
  const engine = makeEngine('han_solo');
  const hero = engine.heroes[0];
  const [target] = placeTargets(engine, [[240]]);
  const originalRandom = Math.random;
  Math.random = () => 0.5;
  try {
    engine.triggerAbility(hero, 'simple');
    const ordinaryDamage = target.maxHp - target.currentHp;
    target.currentHp = target.maxHp;
    grantCombatEventBuff(hero, 'quad_damage');
    engine.triggerAbility(hero, 'simple');
    assert.equal(target.maxHp - target.currentHp, ordinaryDamage * 2);
    target.currentHp = target.maxHp;
    hero.specialCharge = 99;
    assert.equal(engine.triggerAbility(hero, 'special'), false);
    assert.equal(target.currentHp, target.maxHp);
    assert.equal(hero.specialCharge, 99);
    hero.currentHp = 0;
    engine.triggerAbility(hero, 'simple');
    assert.equal(target.currentHp, target.maxHp);
  } finally { Math.random = originalRandom; }
});
