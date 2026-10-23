import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getNativeSuperVisualStateWave5, supportsTrackedProjectileVisualWave5 } from '../src/game/combat/nativeSuperVisualsWave5.js';

let vite, EngineFighter, heroes;
const noop = () => {}, engines = [];
before(async () => {
  vite = await createServer({ root: process.cwd(), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?projectile-wave5'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });
const make = (id, side) => {
  const hero = heroes.find(candidate => candidate.id === id);
  assert.ok(hero, id);
  const dummy = { id: 'projectile-audit-dummy', name: 'Training target', universe: 'Test', stats: { hp: 5000, atk: 10, def: 8, spd: 5 } };
  const engine = new EngineFighter(1800, 500, side === 'player' ? [hero] : [dummy], side === 'player' ? [dummy] : [hero],
    { add: noop }, noop, noop, { opponentControl: 'p2' });
  engines.push(engine); engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getOpponent(side), facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 1500; actor.facing = facing; actor.meter = 100;
  target.x = actor.x + facing * 600; target.maxHp = 5000; target.currentHp = 5000;
  return { engine, actor, target, facing, side };
};
const step = context => { context.engine.updateActions(1 / 120); context.engine.updateProjectiles(1 / 120); };
const until = (context, condition, label) => {
  let budget = 1000;
  while (!condition() && budget-- > 0) step(context);
  assert.ok(budget > 0, label);
};
const recorder = () => {
  const calls = [], stack = [];
  let props = { globalAlpha: 0.7, fillStyle: '#123456', strokeStyle: '#654321', lineWidth: 9 };
  const initial = { ...props };
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in props) return props[key];
      if (key === 'save') return () => { stack.push({ ...props }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); props = stack.pop(); calls.push(['restore']); };
      return (...args) => { for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value)); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value)); props[key] = value; return true; }
  });
  return { ctx, calls, assertBalanced: () => { assert.equal(stack.length, 0); assert.deepEqual(props, initial); } };
};
const render = context => {
  const rec = recorder(), { engine, actor } = context;
  if (actor.action) engine.drawPersonalSuper(rec.ctx, actor);
  engine.projectiles.forEach(projectile => engine.drawProjectile(rec.ctx, projectile));
  engine.projectileVisualImpacts.forEach(impact => engine.drawProjectileImpact(rec.ctx, impact));
  rec.assertBalanced(); return rec.calls;
};
const snapshot = context => JSON.stringify({ actor: context.actor, target: context.target,
  projectiles: context.engine.projectiles, impacts: context.engine.projectileVisualImpacts, stats: context.engine.stats });
const assertPaused = context => {
  const beforeState = snapshot(context), beforeDraw = render(context);
  for (let i = 0; i < 100; i++) {
    context.engine.updateActions(0); context.engine.updateProjectiles(0);
    assert.deepEqual(render(context), beforeDraw);
  }
  assert.equal(snapshot(context), beforeState);
};

for (const id of ['boruto_uzumaki', 'leon']) for (const side of ['player', 'cpu']) {
  test(`${id} ${side}: native travel follows the real projectile and only its confirmed collision creates contact`, () => {
    const context = make(id, side), { engine, actor, target, facing } = context;
    const beforeHp = target.currentHp;
    assert.equal(engine.triggerSideAction(side, 'super'), true); assert.equal(actor.meter, 0);
    engine.updateActions(0.3);
    assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 0);
    const startup = render(context);
    for (const call of startup) if (['ellipse', 'lineTo', 'fillRect'].includes(call[0]))
      assert.ok(Math.abs(call[1] - actor.x) < 142, 'startup showed a projectile or explosion at the distant target');
    assertPaused(context);
    until(context, () => engine.projectiles.length === 1, 'projectile did not launch');
    assert.equal(target.currentHp, beforeHp); assert.equal(engine.projectileVisualImpacts.length, 0);
    const projectile = engine.projectiles[0], launchFacing = projectile.action.facing;
    const savedActorX = actor.x; actor.x += facing * 100; actor.facing = -facing;
    const early = recorder(); engine.drawProjectile(early.ctx, projectile); early.assertBalanced();
    if (id === 'boruto_uzumaki') {
      const orbs = early.calls.filter(call => call[0] === 'ellipse'); assert.equal(orbs.length, 3);
      orbs.forEach(call => { assert.equal(call[1], projectile.x); assert.equal(call[2], projectile.y); });
    } else {
      const rocket = early.calls.find(call => call[0] === 'fillRect'); assert.ok(rocket);
      assert.equal(rocket[1] + rocket[3] / 2, projectile.x);
      const trail = early.calls.find(call => call[0] === 'lineTo');
      assert.equal(Math.sign(projectile.x - trail[1]), launchFacing, 'trail followed the owner turning instead of the committed shot');
    }
    actor.x = savedActorX; actor.facing = facing;
    until(context, () => Math.abs(projectile.x - projectile.visualOriginX) / projectile.visualFlightDistance >= 0.6, 'projectile did not cross midflight');
    assert.equal(target.currentHp, beforeHp); assert.equal(engine.projectileVisualImpacts.length, 0);
    const midway = recorder(); engine.drawProjectile(midway.ctx, projectile); midway.assertBalanced();
    if (id === 'boruto_uzumaki') assert.equal(midway.calls.some(call => ['ellipse', 'arc', 'fillRect'].includes(call[0])), false, 'Vanishing Rasengan acquired a generic visible ball while invisible');
    else assert.ok(midway.calls.some(call => call[0] === 'fillRect'));
    assertPaused(context);
    until(context, () => !actor.action, 'action did not finish');
    assert.equal(engine.projectiles.length, 1, 'finishing the body action removed the travelling projectile');
    assert.equal(target.currentHp, beforeHp);
    until(context, () => engine.projectileVisualImpacts.length === 1, 'confirmed collision did not produce its visual contact');
    assert.equal(engine.projectiles.length, 0); assert.ok(target.currentHp < beforeHp);
    const impact = engine.projectileVisualImpacts[0], confirmedX = target.x;
    assert.equal(impact.x, confirmedX);
    const afterHp = target.currentHp, beforeRender = snapshot(context), impactDraw = render(context);
    if (id === 'boruto_uzumaki') {
      const rings = impactDraw.filter(call => call[0] === 'ellipse'); assert.equal(rings.length, 3);
      rings.forEach(call => assert.equal(call[1], confirmedX));
    } else {
      const rays = impactDraw.filter(call => call[0] === 'lineTo'); assert.equal(rays.length, 7);
      assert.ok(Math.abs(rays.reduce((sum, call) => sum + call[1], 0) / rays.length - confirmedX) < 1e-8);
    }
    assert.equal(snapshot(context), beforeRender);
    target.x += facing * 100; target.y -= 70;
    assert.deepEqual(render(context), impactDraw, 'confirmed contact retargeted a moving/replacement opponent');
    assertPaused(context);
    until(context, () => engine.projectileVisualImpacts.length === 0, 'impact did not expire on its simulation clock');
    for (let i = 0; i < 300; i++) step(context);
    assert.equal(target.currentHp, afterHp, 'cosmetic contact produced another damage event');
    assert.equal(render(context).length, 0);
  });
}

for (const id of ['boruto_uzumaki', 'leon']) test(`${id}: interrupted startup, misses, invulnerable contact and lifecycle cleanup never manufacture an impact`, () => {
  const interrupted = make(id, 'player'); interrupted.engine.triggerSideAction('player', 'super');
  interrupted.engine.updateActions(0.1); interrupted.actor.action = null;
  for (let i = 0; i < 300; i++) step(interrupted);
  assert.equal(interrupted.engine.projectiles.length, 0); assert.equal(interrupted.engine.projectileVisualImpacts.length, 0);
  for (const scenario of ['vertical-miss', 'invulnerable', 'dispose', 'freeze', 'round-reset']) {
    const context = make(id, 'cpu'), { engine, actor, target } = context, beforeHp = target.currentHp;
    engine.triggerSideAction('cpu', 'super');
    until(context, () => engine.projectiles.length === 1, 'missing launch');
    if (scenario === 'vertical-miss') target.y -= 300;
    if (scenario === 'invulnerable') target.invulnerable = 5;
    let expectedHp = beforeHp;
    if (['dispose', 'freeze', 'round-reset'].includes(scenario)) {
      until(context, () => engine.projectileVisualImpacts.length === 1, 'missing confirmed collision before lifecycle cleanup');
      expectedHp = target.currentHp; assert.ok(expectedHp < beforeHp);
    }
    if (scenario === 'dispose') engine.dispose();
    if (scenario === 'freeze') engine.freezeCombat();
    if (scenario === 'round-reset') engine.resetForNextRound();
    if (['vertical-miss', 'invulnerable'].includes(scenario)) for (let i = 0; i < 300; i++) step(context);
    assert.equal(engine.projectileVisualImpacts.length, 0, scenario);
    assert.equal(engine.projectiles.length, 0, scenario);
    assert.equal(target.currentHp, expectedHp, scenario);
    if (scenario === 'round-reset') assert.equal(engine.getActive('cpu').meter, 0);
    else assert.ok(!actor.action || scenario === 'dispose' || scenario === 'freeze');
  }
});

for (const id of ['doomslayer', 'doom_marine_classic']) for (const side of ['player', 'cpu']) test(`${id} ${side}: BFG retains its single area impact and the condensed Melee/RPG helper path`, () => {
  const context = make(id, side), { engine, actor, target } = context;
  engine.triggerSideAction(side, 'super');
  const action = actor.action, profile = action.identity, beforeHp = target.currentHp;
  assert.equal(profile.delivery, 'area'); assert.equal(supportsTrackedProjectileVisualWave5(profile), false);
  engine.updateActions(0.3); assert.equal(target.currentHp, beforeHp);
  engine.updateActions(0.2); assert.ok(target.currentHp < beforeHp);
  assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 0);
  const options = { actor, profile, action, target, height: 142 };
  assert.deepEqual(getNativeSuperVisualStateWave5({ ...options, projectileVisual: { phase: 'flight', x: 0, y: 0 } }), getNativeSuperVisualStateWave5(options));
  const state = getNativeSuperVisualStateWave5(options); assert.ok(state); assert.equal(state.projectileVisual, undefined);
  const hpAfter = target.currentHp;
  for (let i = 0; i < 100; i++) render(context);
  assert.equal(target.currentHp, hpAfter); assertPaused(context);
});
