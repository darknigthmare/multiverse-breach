import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { sampleNativeSuperMotion, getFf8SuperVisualState, drawFf8SuperVisuals } from '../src/game/combat/ff8SuperVisuals.js';

let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, getRpgActionProfile, tickMeleeCombatActor;
const engines = [];
const noop = () => {};
const particles = { add: noop };
const dummy = id => ({
  id, name: id, universe: 'FF8 runtime regression', category: 'test', weaponType: 'melee',
  primaryColor: '#88aacc', secondaryColor: '#ddeeff', stats: { hp: 5000, atk: 20, def: 8, spd: 5 },
  simple: { name: 'Training strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Training shot', type: 'bullet', dmg: 1, cd: 3 },
  defense: { name: 'Training guard', type: 'shield', reduce: 0.4, dur: 1 },
  special: { name: 'Training finish', type: 'bullet', dmg: 2 }
});
const hero = id => { const found = heroes.find(h => h.id === id); assert.ok(found, id); return found; };
const keep = engine => { engines.push(engine); return engine; };
const hp = actors => actors.map(actor => actor.currentHp);
const rpgId = actor => actor.battleId;
const rpgCosts = actor => ({ atb: actor.atb, charge: actor.specialCharge, cooldown: actor.cooldown });
const tickRpg = (engine, frames = 1) => { for (let i = 0; i < frames; i++) engine.update(); };
const tickMelee = (engine, actor, seconds) => {
  for (let elapsed = 0; elapsed < seconds - 1e-9;) {
    const step = Math.min(1 / 60, seconds - elapsed);
    tickMeleeCombatActor(actor, step, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    elapsed += step;
  }
};
const makeRpg = side => {
  const opposing = [dummy('near-one'), dummy('near-two'), dummy('behind')];
  const players = side === 'player' ? [hero('irvine_ff8')] : opposing;
  const opponents = side === 'enemy' ? [hero('irvine_ff8')] : opposing;
  const engine = keep(new EngineRpg(1100, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, particles, noop, noop,
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } }));
  engine.autoBattle = false;
  [...engine.heroes, ...engine.enemies].forEach(actor => { actor.atb = 100; actor.specialCharge = 100; });
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const targets = side === 'player' ? engine.enemies : engine.heroes;
  const facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 850; actor.y = 330; actor.facing = -facing;
  targets.forEach((target, i) => { target.x = actor.x + facing * [200, 215, -80][i]; target.y = actor.y; });
  return { engine, actor, targets, facing };
};
const makeMelee = side => {
  const opposing = [dummy('near-one'), dummy('near-two'), dummy('behind')];
  const players = side === 'player' ? [hero('irvine_ff8')] : opposing;
  const opponents = side === 'cpu' ? [hero('irvine_ff8')] : opposing;
  const engine = keep(new EngineSmash(1800, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, particles, noop, noop,
    { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } }));
  engine.syncPreMatchFromServer(3000);
  [...engine.heroes, ...engine.enemies].forEach(actor => { actor.state = 'idle'; actor.vx = 0; actor.vy = 0; actor.y = engine.groundY; });
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const targets = side === 'player' ? engine.enemies : engine.heroes;
  const facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 1500; actor.facing = facing; actor.specialCharge = 100;
  targets.forEach((target, i) => { target.x = actor.x + facing * [160, 175, -80][i]; });
  return { engine, actor, targets, facing };
};
const makeFighter = (side, heroId = 'irvine_ff8') => {
  const opposing = [dummy('active-target'), dummy('nearby-bench')];
  const engine = keep(new EngineFighter(1800, 500, side === 'player' ? [hero(heroId)] : opposing,
    side === 'cpu' ? [hero(heroId)] : opposing, particles, noop, noop, { opponentControl: 'p2' }));
  engine.countdown = 0;
  const actor = engine.getActive(side);
  const targets = engine.getTeam(side === 'player' ? 'cpu' : 'player').fighters;
  const facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 1500; actor.facing = -facing; actor.meter = 100;
  targets.forEach((target, i) => { target.x = actor.x + facing * (160 + i * 15); target.y = actor.y; });
  return { engine, actor, targets, facing };
};

before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?ff8-wave2-runtime'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?ff8-wave2-runtime'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?ff8-wave2-runtime'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ getRpgActionProfile } = await vite.ssrLoadModule('/src/game/rpgTargeting.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

test('Hyper Shot uses Pulse Ammo and one enemy while retaining its existing power, timing and cost', () => {
  const identity = resolveMeleeSuper(hero('irvine_ff8'));
  assert.equal(identity.name, 'Hyper Shot');
  assert.equal(identity.sourceAbility.type, 'bullet');
  assert.equal(identity.delivery, 'projectile');
  assert.equal(identity.shape, 'single');
  assert.equal(identity.targetSide, 'enemy');
  assert.equal(identity.maxTargets, 1);
  assert.equal(identity.multiplier, 4.5);
  assert.equal(identity.duration, 1.1);
  assert.ok(Math.abs(identity.hitAt - 1.1 * 0.41) < 1e-12);
  assert.equal(identity.meterCost, 100);
  assert.match(identity.provenance.sourceReference, /Pulse Ammo/);
  assert.equal(identity.provenance.sourceUrl, 'https://guides.gamercorner.net/ffviii/limit-breaks/hyper-shot');
  const rpg = getRpgActionProfile(hero('irvine_ff8'), 'special');
  assert.equal(rpg.shape, 'single'); assert.equal(rpg.maxTargets, 1); assert.equal(rpg.multiplier, 4.5);
});

for (const side of ['player', 'enemy']) test(`RPG Hyper Shot ${side} commits once, pauses and hits only the selected close opponent`, () => {
  const { engine, actor, targets, facing } = makeRpg(side);
  const before = hp(targets), costs = rpgCosts(actor);
  assert.equal(engine.beginTargeting(actor, 'special', side), true);
  assert.equal(engine.selectTarget(rpgId(targets[1])), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.abilityName, 'Hyper Shot'); assert.equal(preview.shape, 'single');
  assert.deepEqual(preview.previewTargetIds, [rpgId(targets[1])]);
  assert.deepEqual(rpgCosts(actor), costs);
  assert.equal(engine.confirmTargeting(), true);
  assert.deepEqual(rpgCosts(actor), { atb: 0, charge: 0, cooldown: 0 });
  assert.equal(actor.facing, facing, 'confirmation did not face the selected opponent');
  assert.equal(engine.confirmTargeting(), false);
  assert.equal(engine.beginTargeting(actor, 'special', side), false);
  assert.equal(actor.rpgSpecialDurationTicks, 45);
  const delay = engine.actionQueue[0].ticks;
  assert.equal(delay, 18, 'the single-target correction changed the existing RPG impact delay');
  tickRpg(engine, delay - 1);
  assert.deepEqual(hp(targets), before);
  engine.setPaused(true);
  const queued = engine.actionQueue[0].ticks;
  tickRpg(engine, 300);
  assert.equal(engine.actionQueue[0].ticks, queued);
  assert.deepEqual(hp(targets), before);
  assert.equal(actor.specialCharge, 0);
  engine.setPaused(false);
  tickRpg(engine);
  const after = hp(targets);
  assert.equal(after[0], before[0]); assert.ok(after[1] < before[1]); assert.equal(after[2], before[2]);
  const dealt = before[1] - after[1];
  assert.ok(dealt >= preview.estimates[0].min && dealt <= preview.estimates[0].max);
  tickRpg(engine, 60);
  assert.deepEqual(hp(targets), after, 'Hyper Shot applied a second impact or splash');
  assert.equal(actor.actionPending, false);
});

for (const side of ['player', 'cpu']) test(`Melee Hyper Shot ${side} hits one forward opponent once and freezes on zero simulation delta`, () => {
  const { engine, actor, targets } = makeMelee(side);
  const before = hp(targets);
  assert.equal(side === 'player' ? engine.triggerAbility(actor, 'special') : engine.triggerOpponentAbility('special'), true);
  const action = actor.action;
  assert.equal(action.superProfile.shape, 'single'); assert.equal(actor.specialCharge, 0);
  assert.equal(engine.triggerMeleeSuper(actor), false);
  for (let i = 0; i < 100; i++) tickMeleeCombatActor(actor, 0, { resolveActionHit: (source, item) => engine.resolveMeleeActionHit(source, item) });
  assert.equal(action.elapsed, 0); assert.deepEqual(hp(targets), before);
  tickMelee(engine, actor, action.hitAt - 0.001);
  assert.deepEqual(hp(targets), before);
  tickMelee(engine, actor, 0.002);
  const after = hp(targets);
  assert.ok(after[0] < before[0]); assert.equal(after[1], before[1]); assert.equal(after[2], before[2]);
  assert.equal(engine.resolveMeleeActionHit(actor, action), 0);
  tickMelee(engine, actor, action.duration + 0.2);
  assert.deepEqual(hp(targets), after); assert.equal(actor.specialCharge, 0);
});

for (const side of ['player', 'cpu']) test(`Melee Hyper Shot ${side} rejects targets behind, beyond range and outside its projectile height`, () => {
  for (const scenario of ['behind', 'range', 'height']) {
    const { engine, actor, targets, facing } = makeMelee(side);
    const profile = resolveMeleeSuper(actor);
    targets.forEach((target, i) => {
      target.x = actor.x + facing * (scenario === 'behind' ? -70 - i * 15 : scenario === 'range' ? profile.range + 30 + i * 15 : 160 + i * 15);
      if (scenario === 'height') target.y -= 200;
    });
    const before = hp(targets);
    assert.equal(engine.triggerMeleeSuper(actor), true);
    tickMelee(engine, actor, profile.duration + 0.1);
    assert.deepEqual(hp(targets), before, scenario);
    assert.equal(actor.specialCharge, 0, 'a committed miss refunded its cost');
  }
});

for (const side of ['player', 'cpu']) test(`Fighter Hyper Shot ${side} launches one timed projectile, hits the active opponent and preserves the close bench`, () => {
  const { engine, actor, targets, facing } = makeFighter(side);
  const before = hp(targets);
  const impacts = [];
  const applyHit = engine.applyHit.bind(engine);
  engine.applyHit = (...args) => { impacts.push(args[1]); return applyHit(...args); };
  assert.equal(engine.triggerSideAction(side, 'super'), true);
  const action = actor.action;
  assert.equal(action.identity.name, 'Hyper Shot'); assert.equal(action.shape, 'single');
  assert.equal(action.delivery, 'projectile'); assert.equal(actor.meter, 0); assert.equal(action.facing, facing);
  assert.equal(engine.triggerSideAction(side, 'super'), false);
  engine.updateActions(action.hitAt - 0.001);
  assert.deepEqual(hp(targets), before); assert.equal(engine.projectiles.length, 0);
  engine.updateActions(0.002);
  assert.equal(engine.projectiles.length, 1);
  assert.deepEqual(hp(targets), before, 'the shot became an instantaneous area hit');
  const snapshot = JSON.stringify({ action: actor.action, projectiles: engine.projectiles });
  for (let i = 0; i < 100; i++) { engine.updateActions(0); engine.updateProjectiles(0); }
  assert.equal(JSON.stringify({ action: actor.action, projectiles: engine.projectiles }), snapshot);
  assert.equal(actor.meter, 0);
  for (let i = 0; i < 120; i++) { engine.updateActions(1 / 60); engine.updateProjectiles(1 / 60); }
  assert.deepEqual(impacts, [targets[0]]);
  assert.ok(targets[0].currentHp < before[0]); assert.equal(targets[1].currentHp, before[1]);
  assert.equal(engine.projectiles.length, 0);
  assert.ok(Math.abs(actor.meter - Math.min(100, (before[0] - targets[0].currentHp) * 0.82)) < 1e-9, 'the established Fighter hit-meter rule changed');
});

for (const side of ['player', 'cpu']) test(`Fighter Hyper Shot ${side} keeps its committed facing and finite projectile range`, () => {
  for (const scenario of ['cross-behind', 'range']) {
    const { engine, actor, targets, facing } = makeFighter(side);
    assert.equal(engine.triggerSideAction(side, 'super'), true);
    const action = actor.action;
    targets[0].x = actor.x + facing * (scenario === 'range' ? action.range + 30 : -160);
    const before = hp(targets);
    for (let i = 0; i < 150; i++) { engine.updateActions(1 / 60); engine.updateProjectiles(1 / 60); }
    assert.deepEqual(hp(targets), before, scenario);
    assert.equal(engine.projectiles.length, 0); assert.equal(actor.meter, 0);
  }
});

const recorder = () => {
  const calls = [], stack = [];
  let properties = {};
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); calls.push(['restore']); };
      return (...args) => { args.filter(arg => typeof arg === 'number').forEach(arg => assert.ok(Number.isFinite(arg), String(key))); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), String(key)); properties[key] = value; calls.push(['set', key, value]); return true; }
  });
  return { ctx, calls, depth: () => stack.length };
};
const segments = calls => calls.flatMap((item, index) => item[0] === 'moveTo' && calls[index + 1]?.[0] === 'lineTo' ? [[item, calls[index + 1]]] : []);

test('Laguna native super motion rises, hangs and returns without moving gameplay coordinates', () => {
  const input = { heroId: 'laguna_ff8', universe: 'Final Fantasy VIII', phase: 'super', height: 100 };
  const sample = progress => sampleNativeSuperMotion({ ...input, progress });
  assert.equal(sample(0).x, 0); assert.equal(Math.abs(sample(0).y), 0);
  assert.equal(sample(0.2).y, -90); assert.equal(sample(0.5).y, -90);
  assert.ok(sample(0.9).y < 0 && sample(0.9).y > -90);
  assert.equal(Math.abs(sample(1).y), 0);
  for (const override of [{ universe: 'Other universe' }, { heroId: 'irvine_ff8' }, { phase: 'intro' }]) assert.deepEqual(sampleNativeSuperMotion({ ...input, ...override, progress: 0.5 }), { x: 0, y: 0 });
  for (const side of ['player', 'cpu']) {
    const { engine, actor, targets } = makeFighter(side, 'laguna_ff8');
    engine.triggerSideAction(side, 'super'); engine.updateActions(actor.action.hitAt * 0.8);
    const before = JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles });
    const args = { actor, profile: actor.action.identity, action: actor.action, target: targets[0], height: 142 };
    const visual = getFf8SuperVisualState(args);
    assert.ok(visual.motion.y < -100); assert.equal(visual.gameplayEffect, 'none');
    const recorded = recorder(); drawFf8SuperVisuals(recorded.ctx, visual); assert.equal(recorded.depth(), 0);
    engine.updateActions(0);
    assert.deepEqual(getFf8SuperVisualState(args), visual, 'paused action time moved the visual');
    assert.equal(JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles }), before);
  }
});

test('The End renders flower petals and short stems without a ray or a beneficial gameplay effect', () => {
  const actor = { ...hero('selphie_ff8'), x: 100, y: 350, currentHp: 100, meter: 100 };
  const target = { x: 500, y: 350, currentHp: 200 };
  const profile = resolveMeleeSuper(hero('selphie_ff8'));
  assert.equal(profile.effect, 'damage');
  for (const elapsed of [0.2, profile.hitAt, 0.9]) {
    const action = { elapsed, duration: profile.duration, hitAt: profile.hitAt, facing: 1 };
    const before = JSON.stringify({ actor, target, profile, action });
    const state = getFf8SuperVisualState({ actor, profile, action, target });
    const recorded = recorder(); assert.equal(drawFf8SuperVisuals(recorded.ctx, state), true);
    assert.ok(recorded.calls.filter(call => call[0] === 'arc').length >= 75);
    assert.equal(recorded.calls.some(call => call[0] === 'fillRect'), false);
    for (const [start, end] of segments(recorded.calls)) { assert.equal(start[1], end[1]); assert.ok(Math.abs(end[2] - start[2]) <= 8); }
    assert.equal(state.gameplayEffect, 'none'); assert.equal(recorded.depth(), 0);
    assert.equal(JSON.stringify({ actor, target, profile, action }), before);
  }
});

test('Hyper Shot Pulse tracer is finite, mirrored and cosmetic, with no sustained ray after arrival', () => {
  const profile = resolveMeleeSuper(hero('irvine_ff8'));
  for (const facing of [1, -1]) {
    const actor = { ...hero('irvine_ff8'), x: 500, y: 350, currentHp: 100, meter: 0 };
    const target = { x: actor.x + facing * 250, y: 350, currentHp: 200 };
    for (const progress of [0, 0.2, 0.41, 0.5, 0.85, 1]) {
      const action = { elapsed: progress * profile.duration, duration: profile.duration, hitAt: profile.hitAt, facing };
      const input = { actor, profile, action, target };
      const before = JSON.stringify(input);
      const state = getFf8SuperVisualState(input);
      const recorded = recorder(); drawFf8SuperVisuals(recorded.ctx, state);
      for (const [start, end] of segments(recorded.calls)) assert.ok(Math.hypot(end[1] - start[1], end[2] - start[2]) <= 22.000001, 'a short pulse became a full-arena ray');
      if (progress < 0.41 || progress >= 0.85) assert.equal(recorded.calls.some(call => ['stroke', 'fill'].includes(call[0])), false);
      if (progress === 0.5) { assert.ok(segments(recorded.calls).length); assert.ok(recorded.calls.some(call => call[0] === 'arc')); }
      assert.equal(state.gameplayEffect, 'none'); assert.equal(recorded.depth(), 0);
      assert.equal(JSON.stringify(input), before);
    }
  }
  assert.equal(getFf8SuperVisualState({ actor: { x: 0, y: 0 }, profile: { ...profile, universe: 'Other universe' }, action: { elapsed: 0, duration: 1, hitAt: 0.4 } }), null);
  assert.equal(getFf8SuperVisualState({ actor: { x: 0, y: 0 }, profile: { ...profile, name: 'Other shot' }, action: { elapsed: 0, duration: 1, hitAt: 0.4 } }), null);
  assert.equal(drawFf8SuperVisuals(recorder().ctx, null), false);
});
