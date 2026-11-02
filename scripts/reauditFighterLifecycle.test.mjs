import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
let EngineFighter, HEROES_DB, vite;
before(async () => {
  // Native verification uses the same files; the local loader only resolves
  // extensionless imports. CI keeps the existing Vite module loader.
  if (process.env.MULTIVERSE_NATIVE_TESTS === '1') {
    ({ EngineFighter } = await import('../src/game/engineFighter.js'));
    ({ HEROES_DB } = await import('../src/game/heroes.js'));
  } else {
    const { createServer } = await import('vite');
    vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
    ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
    ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  }
});
after(async () => { await vite?.close(); });
const makeHero = (id = 'fighter-qa') => ({ id, name: id, universe: 'Nexus de Convergence',
  stats: { hp: 180, atk: 18, def: 9, spd: 15 }, weaponType: 'rifle',
  simple: { name: 'Strike', dmg: 1, type: 'melee' }, special: { name: 'Test super', dmg: 2 } });
const shot = () => ({ type: 'special', base: 30, range: 430, knockback: 10, guardDamage: 20, facing: 1 });
function fixture() {
  const outcomes = [], sfx = [], assist = { id: 'qa-assist', effect: { damage: 14 } };
  const field = { id: 'qa-field', effect: { damage: 20, healRatio: 0 } };
  const e = new EngineFighter(960, 540, [makeHero('p1'), makeHero('p1-reserve')],
    [makeHero('p2'), makeHero('p2-reserve')], { add() {} }, x => sfx.push(x),
    (...args) => outcomes.push(args), { opponentControl: 'p2', fieldSupers: { player: field, opponent: field }, cosmetics: { npcAssist: assist } });
  e.countdown = 0;
  const a = e.getActive('player'), b = e.getActive('cpu');
  Object.assign(a, { x: 200, facing: 1, meter: 100 }); Object.assign(b, { x: 260, facing: -1, meter: 0 });
  return { e, a, b, outcomes, sfx };
}
const state = e => JSON.stringify({ elapsed: e.elapsed, timer: e.timer, countdown: e.countdown,
  teams: e.teams, inputs: e.inputs, stats: e.stats, projectiles: e.projectiles, result: e.result,
  charge: e.fieldSuperCharge, used: e.fieldSuperUsed });

for (const side of ['player', 'cpu']) for (const blocked of [false, true]) {
  test(`Fighter ${side}: last HP (${blocked ? 'guarded' : 'unguarded'}) cannot inflate score or meters`, () => {
    const { e } = fixture();
    try {
      const a = e.getActive(side), b = e.getOpponent(side);
      a.meter = 0; b.meter = 0; b.currentHp = 0.4; b.guarding = blocked; b.facing = -Math.sign(b.x - a.x);
      const fieldA = e.getFieldSuperState(side).charge, fieldB = e.getFieldSuperState(b.side).charge;
      const assistA = e.getAssistState(side).charge, assistB = e.getAssistState(b.side).charge;
      const dealt = e.applyHit(a, b, { ...shot(), type: 'super', base: 1000 });
      assert.equal(dealt, 0.4); assert.equal(b.currentHp, 0);
      assert.equal(e.stats[side].damage, 0.4); assert.equal(e.stats[b.side].taken, 0.4);
      assert.equal(a.meter, 0.4 * (blocked ? 0.42 : 0.82)); assert.equal(b.meter, 0.4 * 0.55);
      assert.ok(Math.abs(e.getFieldSuperState(side).charge - fieldA - 0.4 * 0.3) < 1e-10);
      assert.ok(Math.abs(e.getFieldSuperState(b.side).charge - fieldB - 0.4 * 0.65) < 1e-10);
      assert.ok(Math.abs(e.getAssistState(side).charge - assistA - 0.4 * 0.45) < 1e-10);
      assert.ok(Math.abs(e.getAssistState(b.side).charge - assistB - 0.4 * 0.72) < 1e-10);
      const after = state(e); assert.equal(e.applyHit(a, b, shot()), 0); assert.equal(state(e), after);
      assert.equal(e.stats[side].kos, 1);
    } finally { e.dispose(); }
  });
}
for (const action of ['__proto__', 'constructor', 'toString', 'missing']) test(`unknown command ${action} is refused without a stuck action`, () => {
  const { e } = fixture(); try { const before = state(e); assert.equal(e.tryAction('player', action), false); assert.equal(state(e), before); } finally { e.dispose(); }
});
for (const side of [null, '', 'Player', 'arbitrary']) test(`unknown side ${String(side)} never becomes P1`, () => {
  const { e } = fixture(); try {
    const before = state(e);
    assert.equal(e.triggerSideAction(side, 'super'), false); assert.equal(e.triggerAssist(side), false);
    assert.equal(e.triggerFieldSuper(side), false); assert.equal(e.setSideInput(side, { left: true }), false);
    assert.equal(e.requestTag(side, 1, true), false); assert.equal(e.getActive(side), null);
    assert.equal(state(e), before);
  } finally { e.dispose(); }
});
for (const index of [null, '', ' ', false, -1, 0.5, NaN, Infinity]) test(`invalid tag index ${String(index)} is refused`, () => {
  const { e } = fixture(); try {
    e.teams.player.activeIndex = 1; const before = state(e);
    assert.equal(e.requestTag('player', index, true), false); assert.equal(state(e), before);
  } finally { e.dispose(); }
});
test('opponent alias and numeric tag string remain supported', () => {
  const { e } = fixture(); try {
    assert.equal(e.triggerSideAction('opponent', 'light'), true);
    assert.equal(e.requestTag('player', '1'), true);
  } finally { e.dispose(); }
});
for (const dt of [undefined, null, 'bad', NaN, Infinity, -1, 0]) test(`invalid delta ${String(dt)} cannot mutate the simulation`, () => {
  const { e, a } = fixture(); try {
    e.tryAction('player', 'special'); e.spawnProjectile(a, shot()); const before = state(e);
    e.update(dt); e.updateActions(dt); e.updateProjectiles(dt); assert.equal(state(e), before);
  } finally { e.dispose(); }
});
test('pause locks public commands and direct impacts and resumes without held inputs', () => {
  const { e, a, b } = fixture(); try {
    e.setSideInput('player', { left: true, guard: true }); e.setSideInput('cpu', { right: true });
    e.tryAction('player', 'special'); e.spawnProjectile(a, shot()); e.setPaused(true);
    assert.deepEqual(e.inputs, { player: {}, cpu: {} }); const before = state(e);
    assert.equal(e.tryAction('cpu', 'super'), false); assert.equal(e.requestTag('player', 1, true), false);
    assert.equal(e.triggerAssist(), false); assert.equal(e.triggerFieldSuper(), false);
    assert.equal(e.spawnProjectile(a, shot()), false); assert.equal(e.applyHit(a, b, shot()), 0);
    assert.equal(e.setSideInput('player', { left: true }), false);
    e.update(0.034); e.updateActions(1); e.updateProjectiles(1); assert.equal(state(e), before);
    e.setPaused(false); assert.deepEqual(e.inputs, { player: {}, cpu: {} });
    e.update(1 / 60); assert.ok(a.action.elapsed > 0);
  } finally { e.dispose(); }
});
test('input is copied and only explicit booleans control movement', () => {
  const { e } = fixture(); try {
    const input = { left: true, guard: 'true', right: 1 };
    e.setSideInput('player', input); input.left = false;
    assert.deepEqual(e.playerInput, { left: true, right: false, down: false, guard: false });
  } finally { e.dispose(); }
});
test('an engine disposed before result reporting cannot pay or mutate again', () => {
  const { e, a, b, outcomes } = fixture();
  e.spawnProjectile(a, shot()); e.tryAction('player', 'heavy'); e.finish('victory'); e.dispose();
  assert.equal(e.projectiles.length, 0); assert.equal(a.action, null); assert.equal(e.onComplete, null);
  const before = state(e); for (let i = 0; i < 120; i++) e.update(1 / 60);
  assert.equal(e.finish('defeat'), false); assert.equal(e.setPaused(false), false);
  assert.equal(e.spawnProjectile(a, shot()), false); assert.equal(e.applyHit(a, b, shot()), 0);
  assert.equal(e.requestTag('player', 1, true), false); e.dispose();
  assert.equal(state(e), before); assert.equal(outcomes.length, 0);
});
test('first terminal outcome wins and is reported exactly once', () => {
  const { e, a, outcomes, sfx } = fixture(); try {
    e.spawnProjectile(a, shot()); e.tryAction('player', 'heavy');
    assert.equal(e.finish('bogus'), false); assert.equal(e.finish('victory'), true);
    const delay = e.completionDelay, sounds = sfx.length;
    assert.equal(e.finish('defeat'), false); assert.equal(e.completionDelay, delay); assert.equal(sfx.length, sounds);
    assert.equal(e.projectiles.length, 0); assert.equal(a.action, null);
    for (let i = 0; i < 120; i++) e.update(1 / 60);
    assert.equal(outcomes.length, 1); assert.equal(outcomes[0][0], 'victory');
    assert.equal(e.finish('defeat'), false); e.update(1 / 60); assert.equal(outcomes.length, 1);
  } finally { e.dispose(); }
});
test('pause freezes the completion delay without losing or duplicating its result', () => {
  const { e, outcomes } = fixture(); try {
    e.finish('victory'); e.setPaused(true); const delay = e.completionDelay;
    for (let i = 0; i < 100; i++) e.update(1 / 60);
    assert.equal(e.completionDelay, delay); assert.equal(outcomes.length, 0);
    e.setPaused(false); for (let i = 0; i < 100; i++) e.update(1 / 60);
    assert.equal(outcomes.length, 1);
  } finally { e.dispose(); }
});
test('Medic protection and pending actions are removed on disposal', () => {
  const source = structuredClone(HEROES_DB.find(h => h.id === 'team_fortress_2_medic'));
  const e = new EngineFighter(960, 540, [source], [makeHero('foe')], { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  e.countdown = 0; const medic = e.getActive('player'); medic.meter = 100;
  assert.equal(e.tryAction('player', 'super'), true); e.updateActions(0.46);
  assert.equal(e.medicSupport.protects(medic), true); e.dispose();
  assert.equal(e.medicSupport.protects(medic), false); assert.equal(medic.action, null);
});
test('KO invalidation immediately deletes only the dead shooter projectiles, even if revived', () => {
  const { e, a, b } = fixture(); try {
    b.x = 700; e.spawnProjectile(a, shot()); e.spawnProjectile(b, { ...shot(), facing: -1 });
    const survivor = e.projectiles[1]; a.currentHp = 1;
    e.applyHit(b, a, { ...shot(), base: 1000 }); a.currentHp = a.maxHp; a.state = 'idle';
    assert.deepEqual(e.projectiles, [survivor]);
    const hp = b.currentHp; e.updateProjectiles(1); assert.equal(b.currentHp, hp);
  } finally { e.dispose(); }
});
test('live tagged-out shooter retains the projectile and its original guard direction', () => {
  const { e, a, b } = fixture(); try {
    b.x = 500; b.guarding = true; b.facing = -1; e.spawnProjectile(a, shot());
    assert.equal(e.requestTag('player', 1), true); const p = e.projectiles[0];
    p.x = 480; a.x = 650; a.facing = -1;
    const hp = b.currentHp; e.updateProjectiles(0.03);
    assert.ok(b.currentHp < hp); assert.ok(b.guard < 100); assert.ok(b.vx > 0);
    assert.equal(e.projectiles.length, 0);
  } finally { e.dispose(); }
});
test('swept projectile collision catches crossing without a guaranteed remote hit', () => {
  const { e, a, b } = fixture(); try {
    b.x = 400; e.spawnProjectile(a, shot()); const hp = b.currentHp;
    e.updateProjectiles(0.5); assert.ok(b.currentHp < hp); assert.equal(e.projectiles.length, 0);
  } finally { e.dispose(); }
});
test('expired projectile never travels the unused portion of a long update', () => {
  const { e, a, b } = fixture(); try {
    b.x = 518; e.spawnProjectile(a, shot()); e.projectiles[0].life = 0.01;
    const hp = b.currentHp; e.updateProjectiles(0.5);
    assert.equal(b.currentHp, hp); assert.equal(e.projectiles.length, 0);
  } finally { e.dispose(); }
});
test('projectile misses a crouching opponent above its hurtbox and expires', () => {
  const { e, a, b } = fixture(); try {
    b.x = 400; b.crouching = true; e.spawnProjectile(a, shot()); const hp = b.currentHp;
    e.updateProjectiles(2); assert.equal(b.currentHp, hp); assert.equal(e.projectiles.length, 0);
  } finally { e.dispose(); }
});
test('stale or malformed projectiles are pruned without damage', () => {
  const { e, a, b } = fixture(); try {
    const hp = b.currentHp;
    for (const patch of [{ life: 0 }, { radius: NaN }, { x: Infinity }, { owner: makeHero() }, { side: 'cpu' }]) {
      e.spawnProjectile(a, shot()); Object.assign(e.projectiles.at(-1), patch); e.updateProjectiles(0.1);
      assert.equal(e.projectiles.length, 0); assert.equal(b.currentHp, hp);
    }
  } finally { e.dispose(); }
});
test('same-frame projectile KO does not remove or skip another identity by shifted index', () => {
  const { e, a, b } = fixture(); try {
    b.x = 400; b.currentHp = 1; e.spawnProjectile(a, { ...shot(), base: 100 });
    e.spawnProjectile(b, { ...shot(), facing: -1 }); e.spawnProjectile(a, shot());
    const hp = a.currentHp; e.updateProjectiles(0.5);
    assert.equal(b.currentHp, 0); assert.equal(a.currentHp, hp); assert.equal(e.stats.player.kos, 1);
    assert.ok(e.projectiles.every(p => p.owner !== b));
  } finally { e.dispose(); }
});
for (const kind of ['dead-shooter', 'self', 'ally', 'reserve', 'foreign']) test(`invalid impact ${kind} is rejected before stats or effects`, () => {
  const { e, a, b } = fixture(); try {
    let attacker = a, target = b;
    if (kind === 'dead-shooter') a.currentHp = 0;
    if (kind === 'self') target = a;
    if (kind === 'ally') target = e.teams.player.fighters[1];
    if (kind === 'reserve') target = e.teams.cpu.fighters[1];
    if (kind === 'foreign') attacker = { ...a };
    const before = state(e); assert.equal(e.applyHit(attacker, target, shot()), 0); assert.equal(state(e), before);
  } finally { e.dispose(); }
});
test('a malformed meter cannot launch a free special or poison damage bookkeeping', () => {
  const { e, a, b } = fixture(); try {
    a.meter = NaN; const hp = b.currentHp;
    assert.equal(e.tryAction('player', 'special'), false); assert.equal(e.applyHit(a, b, shot()), 0);
    assert.equal(b.currentHp, hp); assert.equal(e.stats.player.damage, 0);
  } finally { e.dispose(); }
});
test('zero-damage field support stays non-offensive and invalid negative healing cannot injure allies', () => {
  const { e, a, b } = fixture(); try {
    e.fieldSuper = { id: 'support-only', effect: { damage: 0, healRatio: -1, guardDamage: 0, knockback: 0 } };
    e.fieldSuperCharge = 100; a.currentHp = 100; const hp = b.currentHp;
    assert.equal(e.triggerFieldSuper(), true); assert.equal(a.currentHp, 100); assert.equal(b.currentHp, hp);
    assert.equal(e.stats.player.damage, 0); assert.equal(e.fieldSuperUsed, true);
    assert.equal(e.triggerFieldSuper(), false);
  } finally { e.dispose(); }
});

test('Fighter screen binds pause, hidden-tab events, early exit and disposal to the engine', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../src/components/FighterMode.jsx', import.meta.url), 'utf8');
  assert.match(source, /engineRef\.current\?\.setPaused\(sessionPaused \|\| document\.hidden\)/);
  assert.match(source, /engine\.setPaused\(sessionPausedRef\.current \|\| document\.hidden\)/);
  assert.match(source, /active = false;\s*engine\.dispose\(\);\s*cancelAnimationFrame/);
  assert.match(source, /if \(!active \|\| engine\.disposed\) return;/);
  assert.match(source, /sessionExitRequestRef\.current = sessionExitRequest;\s*engineRef\.current\?\.dispose\(\)/);
  assert.match(source, /data-fighter-runtime-error/);
});

test('hit-stop rejects both players’ commands without spending while impact presentation is frozen', () => {
  const { e, a, b } = fixture();
  try {
    e.hitStop = 0.07;
    e.assists.player.charge = 100; e.assists.cpu.charge = 100;
    e.fieldSuperCharge = 100; e.opponentFieldSuperCharge = 100;
    const before = state(e);
    for (const side of ['player', 'cpu']) {
      assert.equal(e.triggerSideAction(side, 'super'), false);
      assert.equal(e.triggerSideAction(side, 'jump'), false);
      assert.equal(e.triggerAssist(side), false);
      assert.equal(e.triggerFieldSuper(side), false);
      assert.equal(e.requestTag(side, 1), false);
    }
    assert.equal(state(e), before);
    for (let frame = 0; e.hitStop > 0 && frame < 60; frame++) e.update(1 / 60);
    assert.ok(e.hitStop <= 0);
    assert.equal(e.canAct(a), true); assert.equal(e.canAct(b), true);
    assert.equal(e.tryAction('player', 'heavy'), true);
  } finally { e.dispose(); }
});
