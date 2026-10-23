import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { supportsNativeSuperWave6, getNativeSuperVisualStateWave6, drawNativeSuperVisualsWave6, sampleNativeSuperMotionWave6, supportsTrackedProjectileVisualWave6 } from '../src/game/combat/nativeSuperVisualsWave6.js';
import { getCharacterSuperVisualState, drawCharacterSuperVisuals, sampleCharacterSuperMotion } from '../src/game/combat/characterSuperVisuals.js';

let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, resolveCombatAbility, getRpgActionProfile;
const engines = [], noop = () => {}, particles = { add: noop };
const dummy = id => ({
  id, name: id, universe: 'Native wave6 regression', category: 'test', weaponType: 'melee',
  primaryColor: '#88aacc', secondaryColor: '#ddeeff', stats: { hp: 5000, atk: 20, def: 8, spd: 5 },
  simple: { name: 'Training strike', type: 'melee', dmg: 1 }, secondary: { name: 'Training shot', type: 'bullet', dmg: 1, cd: 3 },
  defense: { name: 'Training guard', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'Training finish', type: 'bullet', dmg: 2 }
});
const hero = id => { const h = heroes.find(x => x.id === id); assert.ok(h, id); return h; };
const hp = actors => actors.map(x => x.currentHp);
const meter = context => context.mode === 'fighter' ? context.actor.meter : context.actor.specialCharge;
const setMeter = (context, value) => { if (context.mode === 'fighter') context.actor.meter = value; else context.actor.specialCharge = value; };

function make(mode, side, heroId, withAlly = false) {
  const own = [hero(heroId), ...(withAlly ? [dummy('allied-patient')] : [])];
  const opposing = [dummy('near-one'), dummy('near-two'), dummy('far-one')];
  const players = side === 'player' ? own : opposing;
  const opponents = side === 'opponent' ? own : opposing;
  let engine, engineSide, actor, allies, targets;
  if (mode === 'fighter') {
    engine = new EngineFighter(1800, 500, players, opponents, particles, noop, noop, { opponentControl: 'p2' });
    engine.countdown = 0; engineSide = side === 'player' ? 'player' : 'cpu';
    actor = engine.getActive(engineSide); allies = engine.getTeam(engineSide).fighters;
    targets = engine.getTeam(side === 'player' ? 'cpu' : 'player').fighters;
  } else {
    const data = { monsters: opponents, bosses: [], customRoster: opponents };
    const options = { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
    engine = mode === 'rpg' ? new EngineRpg(1800, 500, players, data, particles, noop, noop, options)
      : new EngineSmash(1800, 500, players, data, particles, noop, noop, { ...options, mode: 'Smash' });
    if (mode === 'rpg') engine.autoBattle = false;
    else engine.syncPreMatchFromServer(3000);
    engineSide = side === 'player' ? 'player' : mode === 'rpg' ? 'enemy' : 'cpu';
    allies = side === 'player' ? engine.heroes : engine.enemies;
    targets = side === 'player' ? engine.enemies : engine.heroes; actor = allies[0];
  }
  engines.push(engine);
  [...allies, ...targets].forEach(unit => {
    unit.maxHp = Math.max(1000, unit.maxHp); unit.currentHp = unit.maxHp;
    unit.state = 'idle'; unit.vx = 0; unit.vy = 0; unit.y = mode === 'rpg' ? 330 : engine.groundY;
    unit.atb = 100; unit.specialCharge = 100;
  });
  const facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 1500; actor.facing = facing; actor.meter = 100;
  allies.slice(1).forEach((unit, i) => { unit.x = actor.x - facing * (80 + i * 15); });
  const close = [100, 115, -350];
  targets.forEach((unit, i) => { unit.x = actor.x + facing * close[i]; });
  return { mode, side, engineSide, engine, actor, allies, targets, facing };
}
function commit(context, index = 0) {
  const { mode, engine, actor, engineSide } = context;
  if (mode === 'fighter') return engine.triggerSideAction(engineSide, 'super');
  if (mode === 'melee') return engineSide === 'player' ? engine.triggerAbility(actor, 'special') : engine.triggerOpponentAbility('special');
  if (!engine.beginTargeting(actor, 'special', engineSide)) return false;
  if (engine.getTargetingState().shape === 'single' && engine.getTargetingState().profile.targetSide === 'enemy') assert.equal(engine.selectTarget(context.targets[index].battleId), true);
  context.expectedTargetIds = [...engine.getTargetingState().previewTargetIds];
  return engine.confirmTargeting();
}
function advance(context, seconds) {
  const { mode, engine, actor } = context;
  if (mode === 'rpg') { for (let i = 0; i < Math.round(seconds * 60); i++) engine.update(); return; }
  for (let elapsed = 0; elapsed < seconds - 1e-9;) {
    const dt = Math.min(1 / 60, seconds - elapsed);
    if (mode === 'fighter') { engine.updateActions(dt); engine.updateProjectiles(dt); }
    else tickMeleeCombatActor(actor, dt, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    elapsed += dt;
  }
}
function pause(context) {
  const { mode, engine, actor } = context;
  const before = JSON.stringify({ actor, hp: hp(context.targets), queue: engine.actionQueue, projectiles: engine.projectiles });
  if (mode === 'rpg') engine.setPaused(true);
  for (let i = 0; i < 120; i++) {
    if (mode === 'rpg') engine.update();
    else if (mode === 'fighter') { engine.updateActions(0); engine.updateProjectiles(0); }
    else tickMeleeCombatActor(actor, 0, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
  }
  if (mode === 'rpg') engine.setPaused(false);
  assert.equal(JSON.stringify({ actor, hp: hp(context.targets), queue: engine.actionQueue, projectiles: engine.projectiles }), before);
}
const recorder = () => {
  const calls = [], stack = []; let properties = { globalAlpha: 0.7, lineWidth: 9, strokeStyle: '#123456', fillStyle: '#654321' };
  const initial = { ...properties };
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { args.filter(arg => typeof arg === 'number').forEach(arg => assert.ok(Number.isFinite(arg), String(key))); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), String(key)); properties[key] = value; calls.push(['set', key, value]); return true; }
  });
  return { ctx, calls, assertBalanced: () => { assert.equal(stack.length, 0); assert.deepEqual(properties, initial); } };
};
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?native-wave6'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?native-wave6'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?native-wave6'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper, resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ getRpgActionProfile } = await vite.ssrLoadModule('/src/game/rpgTargeting.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

const nativeIds = ['sonic_hedgehog', 'miles_tails_prower', 'knuckles_echidna', 'jotaro_kujo', 'giorno_giovanna', 'joseph_joestar', 'devil_may_cry_dante', 'devil_may_cry_nero', 'devil_may_cry_lady', 'skullgirls_parasoul', 'skullgirls_big_band', 'skullgirls_beowulf', 'snake', 'raiden', 'otacon'];
const offensiveIds = nativeIds.filter(id => id !== 'otacon');
for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`${mode} ${side} Wave6 supers spend100 once and apply one authoritative impact per chosen opponent through pause`, () => {
    for (const id of offensiveIds) {
      const context = make(mode, side, id), { engine, actor, targets } = context;
      const original = hp(targets), hits = [], method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
      engine[method] = (source, target, ...args) => { if (source === actor && targets.includes(target)) hits.push(target); return apply(source, target, ...args); };
      const profile = resolveMeleeSuper(actor);
      const expected = mode === 'melee' ? engine.getMeleeSuperTargets(actor, profile, context.facing) : mode === 'fighter' ? [targets[0]] : null;
      setMeter(context, 99); assert.equal(commit(context), false, id); assert.equal(meter(context), 99);
      setMeter(context, 100); assert.equal(commit(context, profile.shape === 'single' ? 1 : 0), true, id);
      assert.equal(meter(context), 0); assert.equal(commit(context), false);
      advance(context, 0.1); assert.deepEqual(hp(targets), original, `${id}: damage before windup`); pause(context);
      advance(context, 2);
      const chosen = mode === 'rpg' ? targets.filter(target => context.expectedTargetIds.includes(target.battleId)) : expected;
      assert.ok(chosen.length > 0, id); assert.equal(new Set(hits).size, hits.length, `${id}: visual effects created repeated damage`);
      assert.deepEqual(new Set(hits), new Set(chosen), id);
      targets.forEach((target, i) => assert.equal(target.currentHp < original[i], chosen.includes(target), id));
      const after = hp(targets); advance(context, 2); assert.deepEqual(hp(targets), after, `${id}: delayed second impact`);
    }
  });
}
for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`${mode} ${side} Wave6 contact supers retain contact range and committed facing`, () => {
  for (const id of ['sonic_hedgehog', 'jotaro_kujo', 'giorno_giovanna', 'joseph_joestar', 'devil_may_cry_nero', 'skullgirls_big_band', 'skullgirls_beowulf', 'snake', 'raiden']) for (const scenario of ['behind', 'range', 'height']) {
    const context = make(mode, side, id), { actor, targets, facing } = context, profile = resolveMeleeSuper(actor);
    assert.equal(profile.delivery, 'melee'); assert.equal(commit(context), true);
    targets.forEach((target, index) => {
      target.x = actor.x + facing * (scenario === 'behind' ? -120 - index * 10 : scenario === 'range' ? profile.range + 150 + index * 10 : 100 + index * 10);
      if (scenario === 'height') target.y -= 220;
    });
    const original = hp(targets); advance(context, 3); assert.deepEqual(hp(targets), original, `${id}:${scenario}`); assert.equal(meter(context), 0);
  }
});

const visualOptions = (id, progress, facing = 1) => {
  const actor = { ...hero(id), x: 400, y: 350, currentHp: 1000, state: 'special' }, profile = resolveMeleeSuper(actor);
  return { actor, profile, action: { duration: profile.duration, elapsed: progress * profile.duration, hitAt: profile.hitAt, facing },
    target: { x: 400 + facing * 180, y: 350, currentHp: 1000 }, height: 100 };
};

test('all15 Wave6 visual identities require exact source, universe, name and effect and never mutate gameplay or canvas', () => {
  for (const id of nativeIds) for (const facing of [1, -1]) for (const progress of [0.2, 0.55, 0.9]) {
    const options = visualOptions(id, progress, facing), original = JSON.stringify(options), profile = options.profile;
    assert.equal(supportsNativeSuperWave6(profile), true, id);
    const state = getNativeSuperVisualStateWave6(options); assert.ok(state, id); assert.equal(state.family, 'native-wave6');
    assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    const first = recorder(), paused = recorder();
    assert.equal(drawNativeSuperVisualsWave6(first.ctx, state), true);
    assert.deepEqual(getCharacterSuperVisualState(options), state); assert.equal(drawCharacterSuperVisuals(paused.ctx, getCharacterSuperVisualState(options)), true);
    assert.deepEqual(paused.calls, first.calls); first.assertBalanced(); paused.assertBalanced(); assert.equal(JSON.stringify(options), original);
    assert.deepEqual(getNativeSuperVisualStateWave6({ ...options, actor: { ...options.actor, id: 'local-alias', sourceHeroId: id } }), state);
    for (const alteration of [
      { ...options, actor: { ...options.actor, id: 'unrelated' } },
      { ...options, actor: { ...options.actor, sourceHeroId: 'unrelated' } },
      { ...options, actor: { ...options.actor, universe: 'Wrong universe' } },
      { ...options, profile: { ...profile, sourceHeroId: 'unrelated' } },
      { ...options, profile: { ...profile, universe: 'Wrong universe' } },
      { ...options, profile: { ...profile, name: 'Generic burst' } },
      { ...options, profile: { ...profile, effect: id === 'otacon' ? 'damage' : 'heal' } }
    ]) assert.equal(getNativeSuperVisualStateWave6(alteration), null, id);
  }
  assert.equal(drawNativeSuperVisualsWave6(recorder().ctx, null), false);
});


function commitSlot(context, slot, selected = null) {
  if (slot === 'special') return commit(context);
  const { mode, engine, actor, engineSide } = context;
  if (mode === 'fighter') return engine.triggerSideAction(engineSide, { simple: 'light', secondary: 'special', defense: 'defense' }[slot]);
  if (mode === 'melee') return engineSide === 'player' ? engine.triggerAbility(actor, slot) : engine.triggerOpponentAbility(slot);
  if (!engine.beginTargeting(actor, slot, engineSide)) return false;
  if (!engine.getTargetingState()) return true; // Authored self-defense executes immediately.
  if (selected) assert.equal(engine.selectTarget(selected.battleId), true);
  context.expectedTargetIds = [...engine.getTargetingState().previewTargetIds];
  return engine.confirmTargeting();
}
function supportState(context, actor) {
  if (context.mode === 'rpg') return { remaining: actor.rpgBuffTicks, multiplier: actor.rpgBuffMultiplier, source: actor.rpgBuffSource };
  if (context.mode === 'fighter') return { remaining: actor.superBuffSeconds, multiplier: actor.superBuffMultiplier, source: actor.superBuffSource };
  return actor.meleeSuperSupport && { remaining: actor.meleeSuperSupport.remaining, multiplier: actor.meleeSuperSupport.buffMultiplier, source: actor.meleeSuperSupport.source };
}
for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`${mode} ${side} Otacon has three allied technical buffs without healing, damage, infection or offensive reticles`, () => {
    for (const slot of ['simple', 'secondary', 'special']) {
      const context = make(mode, side, 'otacon', true), { actor, allies, targets, engine } = context;
      allies[1].currentHp = allies[1].maxHp * 0.25;
      const profile = resolveCombatAbility(actor, slot), before = hp([...allies, ...targets]);
      assert.equal(profile.effect, 'buff'); assert.equal(profile.targetSide, 'ally'); assert.equal(profile.multiplier, 0);
      const method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
      let damages = 0; engine[method] = (...args) => { damages++; return apply(...args); };
      assert.equal(commitSlot(context, slot, mode === 'rpg' && slot === 'simple' ? allies[1] : null), true);
      if (slot === 'special') assert.equal(meter(context), 0);
      assert.deepEqual(hp([...allies, ...targets]), before); advance(context, 0.1); pause(context); advance(context, 0.5);
      assert.deepEqual(hp([...allies, ...targets]), before); assert.equal(damages, 0);
      const affected = allies.filter(unit => supportState(context, unit)?.remaining > 0);
      assert.equal(affected.length, slot === 'simple' ? 1 : allies.length);
      for (const ally of affected) {
        const state = supportState(context, ally);
        assert.equal(state.multiplier, profile.buffMultiplier);
        assert.equal(state.source.sourceHeroId, 'otacon'); assert.equal(state.source.universe, 'Metal Gear');
        assert.equal(state.source.name, profile.name); assert.equal(state.source.slot, slot);
      }
      targets.forEach(unit => assert.ok(!supportState(context, unit)?.remaining));
      advance(context, 0.5); assert.deepEqual(hp([...allies, ...targets]), before); assert.equal(damages, 0);
    }
  });
  test(`${mode} ${side} Snake Cardboard Box grants only its authored personal guard`, () => {
    const context = make(mode, side, 'snake', true), { actor, allies, targets } = context;
    actor.currentHp *= 0.6; const before = hp([...allies, ...targets]);
    const profile = resolveCombatAbility(actor, 'defense');
    assert.ok(profile, 'A runtime opponent must preserve the named authored Cardboard Box defense');
    assert.equal(profile.name, 'Cardboard Box'); assert.equal(profile.effect, 'guard'); assert.equal(profile.targetSide, 'self'); assert.equal(profile.guardReduce, 0.4);
    assert.equal(commitSlot(context, 'defense'), true); advance(context, 0.3); pause(context);
    assert.deepEqual(hp([...allies, ...targets]), before);
    const guard = mode === 'rpg' ? actor.rpgGuardReduce : mode === 'fighter' ? actor.superGuardReduce : resolveCombatAbility(actor, 'defense').guardReduce;
    if (mode === 'melee') assert.equal(actor.state, 'defense');
    assert.equal(guard, 0.4);
    for (const ally of allies.slice(1)) assert.ok(!(ally.rpgGuardTicks || ally.superGuardSeconds || ally.meleeSuperSupport));
    if (mode === 'melee') {
      const unguarded = make(mode, side, 'snake'), random = Math.random;
      const guardedHp = actor.currentHp, unguardedHp = unguarded.actor.currentHp;
      try {
        Math.random = () => 0.5;
        context.engine.applyDamage(targets[0], actor, 100, 0);
        unguarded.engine.applyDamage(unguarded.targets[0], unguarded.actor, 100, 0);
      } finally { Math.random = random; }
      const plainDamage = unguardedHp - unguarded.actor.currentHp;
      assert.ok(plainDamage > 0);
      assert.ok(Math.abs((guardedHp - actor.currentHp) - plainDamage * 0.6) <= 1, 'Cardboard Box must actually absorb its authored40%');
    }
  });
}

test('Metal Gear source actions preserve finite physical contact, not executions, medical effects or a weapon for Otacon', () => {
  const snake = resolveMeleeSuper(hero('snake')), raiden = resolveMeleeSuper(hero('raiden'));
  assert.equal(snake.name, 'Combo de coups de Snake'); assert.equal(snake.range, 170); assert.equal(snake.shape, 'single'); assert.equal(snake.delivery, 'melee');
  assert.equal(raiden.name, 'Zandatsu Overdrive'); assert.equal(raiden.range, 170); assert.equal(raiden.shape, 'single'); assert.equal(raiden.delivery, 'melee');
  const secondary = resolveCombatAbility(hero('raiden'), 'secondary'); assert.equal(secondary.range, 145); assert.equal(secondary.delivery, 'melee'); assert.equal(secondary.shape, 'single');
  for (const profile of [snake, raiden, secondary]) { assert.equal(profile.effect, 'damage'); assert.equal(profile.targetSide, 'enemy'); assert.equal(profile.healRatio, 0); assert.notEqual(profile.effect, 'revive'); assert.equal(profile.sourceAbility.targeting.effect, 'damage'); }
  for (const slot of ['simple', 'secondary', 'special']) { const profile = getRpgActionProfile(hero('otacon'), slot); assert.equal(profile.effect, 'buff'); assert.equal(profile.multiplier, 0); assert.equal(profile.healRatio, 0); }
});

for (const side of ['player', 'opponent']) test(`RPG ${side} Snake and Raiden select one opponent among close neighbours without execution or self-healing`, () => {
  for (const id of ['snake', 'raiden']) for (const slot of ['secondary', 'special']) {
    const context = make('rpg', side, id), { engine, actor, targets } = context;
    if (id === 'snake' && slot === 'secondary') continue;
    actor.currentHp = actor.maxHp * 0.5;
    const before = hp(targets), ownHp = actor.currentHp;
    assert.equal(engine.beginTargeting(actor, slot, context.engineSide), true);
    assert.equal(engine.getTargetingState().shape, 'single');
    assert.equal(engine.selectTarget(targets[1].battleId), true); assert.equal(engine.confirmTargeting(), true);
    advance(context, 0.1); pause(context); advance(context, 2);
    assert.equal(actor.currentHp, ownHp); assert.equal(targets[0].currentHp, before[0]); assert.equal(targets[2].currentHp, before[2]);
    assert.ok(targets[1].currentHp < before[1] && targets[1].currentHp > 0);
  }
});

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`${mode} ${side} Raiden secondary Ninja Run Slash keeps145 contact reach with one opponent`, () => {
  for (const scenario of ['hit', 'behind', 'range', 'height']) {
    const context = make(mode, side, 'raiden'), { actor, targets, facing, engine } = context;
    assert.equal(commitSlot(context, 'secondary'), true); const profile = resolveCombatAbility(actor, 'secondary');
    targets.forEach((target, index) => { target.x = actor.x + facing * (scenario === 'behind' ? -90 : scenario === 'range' ? profile.range + 100 : 110 + index * 10); if (scenario === 'height') target.y -= 220; });
    const before = hp(targets), ownHp = actor.currentHp;
    advance(context, 0.1); pause(context); advance(context, 1);
    assert.equal(actor.currentHp, ownHp); assert.equal(targets.filter((target, i) => target.currentHp < before[i]).length, scenario === 'hit' ? 1 : 0);
    if (mode === 'fighter') assert.equal(engine.projectiles.length, 0);
  }
});

test('Wave6 native body motion is a finite projection preserving positions, HP, action clocks and intentional airborne Moonsault', () => {
  for (const id of nativeIds) for (const facing of [1, -1]) {
    const options = visualOptions(id, 0.5, facing), original = JSON.stringify(options), impactProgress = options.profile.hitAt / options.profile.duration;
    for (const progress of [0, impactProgress / 2, impactProgress, 0.8, 1]) {
      const args = { heroId: id, universe: options.profile.universe, phase: 'super', progress, impactProgress, height: 100 };
      const motion = sampleNativeSuperMotionWave6(args); assert.ok(Number.isFinite(motion.x) && Number.isFinite(motion.y));
      assert.ok(motion.x >= 0 && motion.x <= 65); assert.ok(motion.y <= 0 && motion.y >= -65);
      if (id === 'skullgirls_beowulf' && progress > 0 && progress < impactProgress) assert.ok(motion.y < 0);
      else assert.equal(Math.abs(motion.y), 0);
      const wrapped = sampleCharacterSuperMotion(args); assert.equal(wrapped.x, motion.x); assert.equal(Math.abs(wrapped.y), Math.abs(motion.y));
      assert.deepEqual(sampleNativeSuperMotionWave6({ ...args, phase: 'intro' }), { x: 0, y: 0 });
      assert.deepEqual(sampleNativeSuperMotionWave6({ ...args, universe: 'Incorrect universe' }), { x: 0, y: 0 });
    }
    assert.equal(JSON.stringify(options), original);
  }
});

const shotSnapshot = context => JSON.stringify({ actor: context.actor, targets: context.targets, projectiles: context.engine.projectiles, impacts: context.engine.projectileVisualImpacts });
function renderShots(context) {
  const rec = recorder(), { actor, engine } = context;
  if (actor.action) engine.drawPersonalSuper(rec.ctx, actor);
  engine.projectiles.forEach(projectile => engine.drawProjectile(rec.ctx, projectile));
  engine.projectileVisualImpacts.forEach(impact => engine.drawProjectileImpact(rec.ctx, impact));
  rec.assertBalanced(); return rec.calls;
}
const shotStep = context => { context.engine.updateActions(1 / 120); context.engine.updateProjectiles(1 / 120); };
function until(context, condition, label) {
  let budget = 1000;
  while (!condition() && budget-- > 0) shotStep(context);
  assert.ok(budget > 0, label);
}
function pauseShot(context) {
  const before = shotSnapshot(context), draw = renderShots(context);
  for (let i = 0; i < 50; i++) { context.engine.updateActions(0); context.engine.updateProjectiles(0); assert.deepEqual(renderShots(context), draw); }
  assert.equal(shotSnapshot(context), before);
}
for (const id of ['devil_may_cry_lady', 'skullgirls_parasoul']) for (const side of ['player', 'opponent']) {
  test(`Fighter ${side} ${id}: launch and flight follow the real projectile; only confirmed impact creates a target flash`, () => {
    const context = make('fighter', side, id), { actor, targets, engine, facing } = context, target = targets[0];
    target.x = actor.x + facing * 600;
    const before = hp(targets); assert.equal(commit(context), true); assert.equal(meter(context), 0);
    const profile = actor.action.identity; assert.equal(supportsTrackedProjectileVisualWave6(profile), true);
    engine.updateActions(0.3); assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 0);
    const launch = renderShots(context);
    for (const call of launch) if (['ellipse', 'lineTo', 'fillRect', 'translate'].includes(call[0])) assert.ok(Math.abs(call[1] - actor.x) < 150, 'premature remote flash');
    pauseShot(context); until(context, () => engine.projectiles.length === 1, 'missing real launch');
    const projectile = engine.projectiles[0]; assert.equal(Math.sign(projectile.vx), facing); assert.deepEqual(hp(targets), before);
    assert.equal(engine.projectileVisualImpacts.length, 0);
    const originalX = actor.x; actor.x += facing * 100; actor.facing = -facing;
    const rec = recorder(); engine.drawProjectile(rec.ctx, projectile); rec.assertBalanced();
    if (id === 'devil_may_cry_lady') assert.ok(rec.calls.some(call => call[0] === 'translate' && call[1] === projectile.x && call[2] === projectile.y));
    else { const tracer = rec.calls.find(call => call[0] === 'moveTo'); assert.equal(tracer[1], projectile.x - facing * 12 * (142 / 72)); assert.equal(tracer[2], projectile.y); }
    actor.x = originalX; actor.facing = facing;
    until(context, () => !actor.action, 'body action never finished');
    assert.deepEqual(hp(targets), before); assert.equal(engine.projectiles.length, 1, 'body recovery removed flight'); assert.equal(engine.projectileVisualImpacts.length, 0);
    pauseShot(context); until(context, () => engine.projectileVisualImpacts.length === 1, 'missing confirmed contact');
    assert.equal(engine.projectiles.length, 0); assert.ok(target.currentHp < before[0]); assert.deepEqual(hp(targets).slice(1), before.slice(1));
    const confirmed = engine.projectileVisualImpacts[0]; assert.equal(confirmed.x, target.x);
    const after = shotSnapshot(context), draw = renderShots(context); assert.equal(shotSnapshot(context), after);
    assert.ok(draw.some(call => call[0] === 'ellipse' && call[1] === confirmed.x));
    target.x += facing * 90; target.y -= 70; assert.deepEqual(renderShots(context), draw, 'confirmed contact moved with its former target');
    pauseShot(context); const afterHp = hp(targets);
    until(context, () => engine.projectileVisualImpacts.length === 0, 'contact did not expire on simulation time');
    for (let i = 0; i < 300; i++) shotStep(context);
    assert.deepEqual(hp(targets), afterHp); assert.equal(renderShots(context).length, 0); assert.ok(meter(context) < 100, 'impact refunded a complete new super');
  });
}
for (const side of ['player', 'opponent']) test(`Fighter ${side} Lady and Parasoul misses, interruption and cleanup cannot manufacture remote damage or contact`, () => {
  for (const id of ['devil_may_cry_lady', 'skullgirls_parasoul']) for (const scenario of ['cancel', 'height', 'behind', 'range', 'invulnerable', 'dispose', 'freeze', 'round-reset']) {
    const context = make('fighter', side, id), { engine, actor, targets, facing } = context, target = targets[0];
    target.x = actor.x + facing * 600; const before = hp(targets); assert.equal(commit(context), true);
    if (scenario === 'cancel') { advance(context, 0.1); actor.action = null; }
    else {
      until(context, () => engine.projectiles.length === 1, 'missing launch');
      if (scenario === 'height') target.y -= 300;
      if (scenario === 'behind') target.x = actor.x - facing * 100;
      if (scenario === 'range') target.x = actor.x + facing * (actor.action.range + 250);
      if (scenario === 'invulnerable') target.invulnerable = 5;
    }
    if (scenario === 'dispose') engine.dispose();
    if (scenario === 'freeze') engine.freezeCombat();
    if (scenario === 'round-reset') { engine.endRound('victory'); engine.resetForNextRound(); }
    if (!['dispose', 'freeze', 'round-reset'].includes(scenario)) for (let i = 0; i < 800; i++) shotStep(context);
    assert.deepEqual(hp(targets), before, `${id}:${scenario}`); assert.equal(engine.projectiles.length, 0, `${id}:${scenario}`); assert.equal(engine.projectileVisualImpacts.length, 0, `${id}:${scenario}`);
    assert.equal(meter(context), 0);
  }
});

for (const side of ['player', 'opponent']) test(`Melee ${side} Judgement retains its declared radial area and finite range without extra VFX hits`, () => {
  const context = make('melee', side, 'devil_may_cry_dante'), { actor, targets, facing, engine } = context;
  const profile = resolveMeleeSuper(actor); assert.equal(profile.shape, 'area'); assert.equal(profile.range, 170);
  targets.forEach((target, i) => { target.x = actor.x + facing * [100, -110, 300][i]; });
  const before = hp(targets), hits = [], original = engine.applyDamage.bind(engine);
  engine.applyDamage = (source, target, ...args) => { hits.push(target); return original(source, target, ...args); };
  assert.equal(commit(context), true); advance(context, 0.1); pause(context); advance(context, 2);
  assert.ok(targets[0].currentHp < before[0]); assert.ok(targets[1].currentHp < before[1]); assert.equal(targets[2].currentHp, before[2]);
  assert.equal(hits.length, 2); const after = hp(targets); advance(context, 2); assert.deepEqual(hp(targets), after);
});
