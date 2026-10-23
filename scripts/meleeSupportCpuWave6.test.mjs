import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createFixedStepClock } from '../src/game/fixedStepClock.js';

let vite, EngineSmash, HEROES_DB, resolveCombatAbility, tickMeleeCombatActor;
const noop = () => {};
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?support-cpu-wave6'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
after(async () => { await vite?.close(); });

const hero = id => structuredClone(HEROES_DB.find(value => value.id === id));
function match({ player = 'cloud_ff7', opponent = 'otacon', p2 = false, allies = false, opponentOverride } = {}) {
  const enemy = opponentOverride || hero(opponent);
  const players = [hero(player), ...(allies ? [hero('cloud_ff7')] : [])];
  const opponents = [enemy, ...(allies ? [hero('snake')] : [])];
  const cues = [];
  const engine = new EngineSmash(900, 500, players,
    { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, cue => cues.push(cue), noop,
    { id: 'support-cpu-wave6', universe: 'Metal Gear', mode: 'Smash', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: p2 ? 'p2' : 'cpu' } });
  engine.syncPreMatchFromServer(3000);
  engine.completeMeleeIntros();
  [...engine.heroes, ...engine.enemies].forEach(actor => {
    actor.state = 'idle'; actor.stateTimer = 0; actor.action = null;
    actor.y = engine.groundY; actor.vx = 0; actor.vy = 0; actor.specialCharge = 0;
    actor.cooldown = 99999;
  });
  engine.heroes.forEach((actor, index) => { actor.x = 200 - index * 30; });
  engine.enemies.forEach((actor, index) => { actor.x = 240 + index * 30; });
  engine.enemies[0].cooldown = 0;
  engine.enemies[0].behavior.cooldown = 90;
  return { engine, player: engine.heroes[0], opponent: engine.enemies[0], cues };
}
const step = engine => engine.update({}, {}, { stageDeltaMs: 1000 / 60 });
const hp = engine => [...engine.heroes, ...engine.enemies].map(actor => actor.currentHp);
function advanceAction(engine, actor, duration) {
  for (let elapsed = 0; elapsed < duration - 1e-9;) {
    const delta = Math.min(1 / 60, duration - elapsed);
    tickMeleeCombatActor(actor, delta, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    elapsed += delta;
  }
}

test('custom CPU Otacon commits Codec support, keeps enemy HP and grants one friendly effect', () => {
  const { engine, opponent, cues } = match();
  const initialHp = hp(engine);
  step(engine);
  const action = opponent.action;
  assert.equal(action.abilityProfile.sourceHeroId, 'otacon');
  assert.equal(action.abilityProfile.name, 'Codec Support Ping');
  assert.equal(action.abilityProfile.effect, 'buff');
  assert.equal(action.abilityProfile.multiplier, 0);
  assert.equal(opponent.cooldown, 90);
  assert.equal(opponent.specialCharge, 0);
  assert.deepEqual(hp(engine), initialHp);
  assert.equal(engine.triggerAuthoredMeleeAbility(opponent, 'simple'), false, 'startup cannot be spent twice');
  assert.equal(opponent.action, action);
  assert.equal(opponent.cooldown, 90);
  advanceAction(engine, opponent, action.hitAt - 0.01);
  assert.equal(opponent.meleeSuperSupport, undefined);
  advanceAction(engine, opponent, 0.02);
  assert.equal(opponent.meleeSuperSupport.effect, 'buff');
  assert.equal(opponent.meleeSuperSupport.buffMultiplier, 1.08);
  assert.equal(opponent.meleeSuperSupport.source.name, 'Codec Support Ping');
  assert.equal(engine.heroes[0].meleeSuperSupport, undefined, 'CPU support must stay with the CPU camp');
  assert.deepEqual(hp(engine), initialHp);
  const earned = opponent.specialCharge;
  assert.equal(earned, 8);
  assert.equal(engine.resolveMeleeActionHit(opponent, action), 0, 'duplicate impact is ignored');
  assert.equal(opponent.specialCharge, earned);
  assert.deepEqual(hp(engine), initialHp);
  assert.equal(cues.filter(cue => cue === 'shield').length, 1);
  assert.equal(cues.includes('hit'), false);
});

test('player and P2 Otacon share the authored identity and target only their own allies', () => {
  const { engine, player, opponent } = match({ player: 'otacon', p2: true, allies: true });
  const initialHp = hp(engine);
  player.specialCharge = 25; opponent.specialCharge = 35;
  player.cooldown = 0;
  assert.match(opponent.id, /^p2:otacon:/);
  assert.equal(resolveCombatAbility(player, 'secondary').name, 'Metal Gear Data Hack');
  assert.equal(resolveCombatAbility(opponent, 'secondary').name, 'Metal Gear Data Hack');
  assert.equal(engine.triggerAbility(player, 'secondary'), true);
  assert.equal(player.cooldown, 360);
  assert.equal(player.specialCharge, 25);
  assert.equal(engine.triggerAbility(player, 'secondary'), false);
  advanceAction(engine, player, player.action.hitAt + 0.01);
  assert.ok(engine.heroes.every(actor => actor.meleeSuperSupport?.source.name === 'Metal Gear Data Hack'));
  assert.ok(engine.enemies.every(actor => !actor.meleeSuperSupport));
  assert.equal(player.specialCharge, 33, 'one meter award even when two allies receive support');
  assert.equal(engine.triggerOpponentAbility('secondary'), true);
  assert.equal(opponent.cooldown, 360);
  assert.equal(opponent.specialCharge, 35);
  assert.equal(engine.triggerOpponentAbility('secondary'), false);
  advanceAction(engine, opponent, opponent.action.hitAt + 0.01);
  assert.ok(engine.enemies.every(actor => actor.meleeSuperSupport?.source.name === 'Metal Gear Data Hack'));
  assert.equal(opponent.specialCharge, 43);
  assert.deepEqual(hp(engine), initialHp);
});

test('Snake guard metadata survives P2 copying and a neighboring CPU damage action remains immediate', () => {
  const source = hero('snake');
  source.defense = { ...source.defense, guardSourceMarker: 'preserved', targeting: { ...source.defense.targeting, targetSide: 'self' } };
  const local = match({ opponent: 'snake', p2: true, opponentOverride: source });
  assert.equal(local.opponent.defense.guardSourceMarker, 'preserved');
  assert.equal(local.opponent.defense.targeting.targetSide, 'self');
  const defense = resolveCombatAbility(local.opponent, 'defense');
  assert.equal(defense.name, 'Cardboard Box');
  assert.equal(defense.effect, 'guard');
  assert.equal(defense.guardReduce, 0.4);
  assert.equal(local.engine.triggerOpponentAbility('defense'), true);
  assert.equal(local.opponent.state, 'defense');

  const { engine, player, opponent } = match({ opponent: 'snake' });
  assert.equal(player.currentHp, 105);
  const originalRandom = Math.random;
  Math.random = () => 0.5;
  try { step(engine); } finally { Math.random = originalRandom; }
  assert.equal(player.currentHp, 90, 'existing damage amount at the first CPU strike is preserved at fixed variance');
  assert.equal(opponent.state, 'attack');
  assert.equal(opponent.action, null, 'offensive legacy dispatch is deliberately preserved');
  assert.equal(opponent.stateTimer, 20);
  assert.equal(opponent.cooldown, 90);
  assert.equal(opponent.specialCharge, 10);
  for (let frame = 0; frame < 15; frame++) step(engine);
  assert.equal(player.currentHp, 90);
  assert.equal(opponent.specialCharge, 10);
});

test('Knuckles, Giorno and Joseph CPU contact attacks use melee audio without spawning a projectile', () => {
  for (const id of ['knuckles_echidna', 'giorno_giovanna', 'joseph_joestar']) {
    const { engine, player, opponent, cues } = match({ opponent: id });
    const emitted = [];
    engine.particles.add = (...args) => emitted.push(args);
    const beforeHp = player.currentHp;
    assert.ok(['gun', 'laser'].includes(opponent.weapon), `${id}: stale raw weapon exercises the regression`);
    assert.equal(opponent.weaponType, 'melee', id);
    step(engine);
    assert.deepEqual(cues, ['slash', 'hit'], id);
    assert.equal(cues.includes('shoot'), false, id);
    assert.ok(player.currentHp < beforeHp, `${id}: existing contact damage remains effective`);
    assert.equal(opponent.state, 'attack', id);
    assert.equal(opponent.action, null, `${id}: no projectile or super action is created`);
    assert.equal(engine.heroes.length, 1, id);
    assert.equal(engine.enemies.length, 1, id);
    assert.ok(emitted.length > 0, `${id}: actual impact particles were observed`);
    assert.ok(emitted.every(args => ['text', 'spark'].includes(args[7])), `${id}: no moving shot/laser particle is emitted`);
  }
});

test('the production pause clock freezes a pending CPU support impact and its cooldown', () => {
  const { engine, opponent } = match();
  step(engine);
  const action = opponent.action;
  const before = { elapsed: action.elapsed, cooldown: opponent.cooldown, charge: opponent.specialCharge, hp: hp(engine) };
  const clock = createFixedStepClock(); clock.advance(0);
  for (let time = 17; time <= 500; time += 17) {
    const steps = clock.advance(time, { paused: true });
    assert.equal(steps, 0);
    for (let i = 0; i < steps; i++) step(engine);
  }
  assert.equal(opponent.action, action);
  assert.deepEqual({ elapsed: action.elapsed, cooldown: opponent.cooldown, charge: opponent.specialCharge, hp: hp(engine) }, before);
  assert.equal(opponent.meleeSuperSupport, undefined);
  for (let time = 510; time <= 850; time += 17) for (let i = 0; i < clock.advance(time); i++) step(engine);
  assert.equal(opponent.meleeSuperSupport?.effect, 'buff');
  assert.deepEqual(hp(engine), before.hp);
});
