import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let vite, EngineFighter, EngineRpg, EngineSmash, heroes, resolveMeleeSuper, getVisual, drawVisual, getAnimationAssets, tickMeleeCombatActor, beginMeleeShield;
const engines = [], observations = [], noop = () => {}, particles = { add: noop };
const dummy = id => ({ id, name: id, universe: 'Contact regression', stats: { hp: 5000, atk: 20, def: 8, spd: 5 },
  simple: { name: 'Training strike', type: 'melee', dmg: 1 }, secondary: { name: 'Training shot', type: 'bullet', dmg: 1 },
  defense: { name: 'Training guard', type: 'shield', reduce: 0.4 }, special: { name: 'Training strike', type: 'melee', dmg: 2 } });
const hero = id => { const found = heroes.find(h => h.id === id); assert.ok(found, id); return found; };
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?contact-wave6'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?contact-wave6'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?contact-wave6'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ getCharacterSuperVisualState: getVisual, drawCharacterSuperVisuals: drawVisual } = await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js'));
  ({ getCharacterAnimationAssets: getAnimationAssets } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  ({ tickMeleeCombatActor, beginMeleeShield } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
after(async () => {
  engines.forEach(engine => engine.dispose?.()); await vite?.close();
  if (process.env.CONTACT_WAVE6_REPORT_PATH) {
    const sources = [];
    for (const path of ['src/game/engineRpg.js', 'src/game/engineFighter.js', 'src/game/combat/nativeSuperVisualsWave6.js', 'src/game/engineSmash.js'])
      sources.push({ path, sha256: createHash('sha256').update(await readFile(path)).digest('hex') });
    await writeFile(process.env.CONTACT_WAVE6_REPORT_PATH, `${JSON.stringify({ date: '2026-10-20', method: 'Real Vite-SSR runtime and canvas-command assertions; no browser or official source-game fidelity claim.', sources, observations }, null, 2)}\n`);
  }
});
const recorder = () => {
  const calls = [], stack = []; let properties = { globalAlpha: 0.7, lineWidth: 9, strokeStyle: '#123456', fillStyle: '#654321' };
  const initial = { ...properties };
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { args.filter(arg => typeof arg === 'number').forEach(arg => assert.ok(Number.isFinite(arg), String(key))); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), String(key)); properties[key] = value; return true; }
  });
  return { ctx, calls, balanced: () => { assert.equal(stack.length, 0); assert.deepEqual(properties, initial); } };
};
const render = (engine, actor) => {
  const record = recorder(); engine.drawPersonalSuper(record.ctx, actor); record.balanced(); return record.calls;
};
const snapshot = c => JSON.stringify({ actor: c.actor, target: c.target, projectiles: c.engine.projectiles,
  impacts: c.engine.projectileVisualImpacts, queue: c.engine.actionQueue, stats: c.engine.stats });
const fighter = (id, side) => {
  const engine = new EngineFighter(1800, 500, side === 'player' ? [hero(id)] : [dummy('target')],
    side === 'player' ? [dummy('target')] : [hero(id)], particles, noop, noop, { opponentControl: 'p2' });
  engines.push(engine); engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getOpponent(side), facing = side === 'player' ? 1 : -1;
  actor.x = side === 'player' ? 300 : 1500; actor.facing = facing; actor.meter = 100;
  target.x = actor.x + facing * 100; target.currentHp = 5000; target.maxHp = 5000;
  return { engine, actor, target, side, facing };
};
const visual = c => getVisual({ actor: c.actor, profile: c.actor.action.identity, action: c.actor.action,
  target: c.target, height: 142, contactVisual: c.actor.action.visualConfirmedContact || { confirmed: false } });
const pauseFighter = c => {
  const before = snapshot(c), drawing = render(c.engine, c.actor);
  for (let i = 0; i < 100; i++) {
    c.engine.updateActions(0); c.engine.updateProjectiles(0);
    assert.deepEqual(render(c.engine, c.actor), drawing);
  }
  assert.equal(snapshot(c), before);
};

for (const side of ['player', 'enemy']) for (const edge of ['left', 'right']) test(`RPG ${side} ${edge} edge records Snake/Raiden visual facing after physical approach`, () => {
  for (const id of ['snake', 'raiden']) {
    const players = side === 'player' ? [hero(id)] : [dummy('edge-target')];
    const opponents = side === 'player' ? [dummy('edge-target')] : [hero(id)];
    const engine = new EngineRpg(1000, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, particles, noop, noop,
      { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
    engines.push(engine); engine.autoBattle = false;
    const actor = (side === 'player' ? engine.heroes : engine.enemies)[0], target = (side === 'player' ? engine.enemies : engine.heroes)[0];
    for (const [unit, x] of [[actor, edge === 'left' ? 30 : 970], [target, edge === 'left' ? 55 : 945]]) {
      unit.x = x; unit.y = 330; unit.state = 'idle'; unit.atb = 100; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 5000;
      engine.fitCombatantToArena(unit);
    }
    const originalDirection = Math.sign(target.x - actor.x), beforeHp = target.currentHp;
    assert.equal(side === 'player' ? engine.triggerAbility(actor, 'special', [target.battleId]) : engine.triggerEnemyAbility(actor, 'special', [target.battleId]), true);
    const committed = actor.rpgSpecialVisual;
    assert.ok(committed); assert.equal(committed.facing, actor.facing); assert.equal(actor.facing, -originalDirection);
    const actualPosition = { x: actor.x, y: actor.y };
    const state = getVisual({ actor, profile: committed.profile, action: { duration: 1.1, elapsed: 0.47, hitAt: 0.451, facing: committed.facing }, target: committed.target });
    assert.equal(state.contactEligible, true); assert.equal(state.target.x, target.x);
    const record = recorder(), beforeDraw = JSON.stringify({ actor, target, queue: engine.actionQueue });
    drawVisual(record.ctx, state); record.balanced(); assert.equal(JSON.stringify({ actor, target, queue: engine.actionQueue }), beforeDraw);
    engine.setPaused(true); for (let i = 0; i < 100; i++) engine.update();
    assert.equal(JSON.stringify({ actor, target, queue: engine.actionQueue }), beforeDraw); engine.setPaused(false);
    let impacts = 0; const apply = engine.applyRpgImpact.bind(engine);
    engine.applyRpgImpact = (...args) => { impacts++; return apply(...args); };
    for (let i = 0; i < 80; i++) engine.update();
    assert.equal(impacts, 1); assert.ok(target.currentHp < beforeHp); assert.equal(actor.specialCharge, 0);
    observations.push({ case: 'RPG edge approach', id, side, edge, actorAtImpact: actualPosition, targetX: committed.target.x,
      bodyFacing: state.facing, visualFacing: committed.facing, contactEligible: state.contactEligible, impacts, damage: beforeHp - target.currentHp, passed: true });
  }
});

for (const side of ['player', 'cpu']) test(`Fighter ${side} Snake/Raiden contact marks require the actual92px collision, alive target and committed facing`, () => {
  for (const id of ['snake', 'raiden']) for (const scenario of ['height92', 'height94', 'height220', 'behind', 'range', 'invulnerable', 'dead']) {
    const c = fighter(id, side), { engine, actor, target, facing } = c;
    assert.equal(engine.triggerSideAction(side, 'super'), true);
    const range = actor.action.range;
    if (scenario.startsWith('height')) target.y -= Number(scenario.slice(6));
    if (scenario === 'behind') target.x = actor.x - facing * 100;
    if (scenario === 'range') target.x = actor.x + facing * (range + 1);
    if (scenario === 'invulnerable') target.invulnerable = 10;
    if (scenario === 'dead') target.currentHp = 0;
    const beforeHp = target.currentHp;
    engine.updateActions(0.47); assert.equal(target.currentHp, beforeHp); assert.equal(actor.action.visualConfirmedContact, undefined);
    assert.equal(visual(c).contactEligible, false);
    // These two actions have no miss trails: any target ellipse or blade line
    // here would falsely claim a contact that the authoritative engine rejected.
    assert.equal(render(engine, actor).some(call => ['ellipse', 'lineTo'].includes(call[0])), false);
    pauseFighter(c);
    observations.push({ case: 'Fighter rejected contact', id, side, scenario, dy: target.y - actor.y, contactEligible: false, damage: 0, passed: true });
  }
});

for (const side of ['player', 'cpu']) test(`Fighter ${side} confirmed Snake/Raiden hits lock their contact point across knockback, death and repeated paused draws`, () => {
  for (const id of ['snake', 'raiden']) for (const lethal of [false, true]) {
    const c = fighter(id, side), { engine, actor, target } = c;
    target.y = actor.y - 91.99; if (lethal) target.currentHp = 1;
    const beforeHp = target.currentHp, confirmedPoint = { x: target.x, y: target.y };
    assert.equal(engine.triggerSideAction(side, 'super'), true);
    engine.updateActions(0.3); assert.equal(target.currentHp, beforeHp); assert.equal(visual(c).contactEligible, false);
    engine.updateActions(0.17); assert.ok(target.currentHp < beforeHp);
    assert.deepEqual(actor.action.visualConfirmedContact, { confirmed: true, ...confirmedPoint });
    assert.equal(visual(c).contactEligible, true); assert.deepEqual(visual(c).target, confirmedPoint);
    const afterHit = snapshot(c), firstDraw = render(engine, actor);
    assert.ok(firstDraw.some(call => ['ellipse', 'lineTo'].includes(call[0]))); assert.equal(snapshot(c), afterHit);
    const hpAfter = target.currentHp; target.x -= c.facing * 400; target.y += 180;
    assert.deepEqual(render(engine, actor), firstDraw, 'accepted hit must not follow or retarget a displaced/dead victim');
    pauseFighter(c);
    engine.updateActions(0.01); assert.equal(target.currentHp, hpAfter, 'drawing must not create another impact');
    observations.push({ case: 'Fighter confirmed contact', id, side, lethal, contact: confirmedPoint, damage: beforeHp - hpAfter, contactLockedAfterTargetMove: true, passed: true });
  }
});

for (const side of ['player', 'cpu']) test(`Fighter ${side} Lady/Parasoul keep actual projectile travel, frozen clocks and exactly one accepted impact`, () => {
  for (const id of ['devil_may_cry_lady', 'skullgirls_parasoul']) {
    const c = fighter(id, side), { engine, actor, target, facing } = c;
    target.x = actor.x + facing * 500;
    const beforeHp = target.currentHp; let hits = 0; const apply = engine.applyHit.bind(engine);
    engine.applyHit = (...args) => { hits++; return apply(...args); };
    assert.equal(engine.triggerSideAction(side, 'super'), true); engine.updateActions(0.3);
    assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 0); pauseFighter(c);
    engine.updateActions(0.17); assert.equal(engine.projectiles.length, 1); assert.equal(target.currentHp, beforeHp);
    const projectile = engine.projectiles[0]; actor.facing = -facing;
    const flight = recorder(); engine.drawProjectile(flight.ctx, projectile); flight.balanced();
    if (id === 'devil_may_cry_lady') {
      assert.ok(flight.calls.some(call => call[0] === 'translate' && call[1] === projectile.x && call[2] === projectile.y));
      assert.ok(flight.calls.some(call => call[0] === 'scale' && call[1] === facing));
    } else {
      assert.ok(flight.calls.some(call => call[0] === 'lineTo' && call[1] === projectile.x + facing * 4 * 142 / 72));
    }
    const pauseState = snapshot(c);
    for (let i = 0; i < 100; i++) { engine.updateActions(0); engine.updateProjectiles(0); const r = recorder(); engine.drawProjectile(r.ctx, projectile); r.balanced(); assert.deepEqual(r.calls, flight.calls); }
    assert.equal(snapshot(c), pauseState);
    let budget = 300;
    while (!engine.projectileVisualImpacts.length && budget-- > 0) { engine.updateActions(1 / 120); engine.updateProjectiles(1 / 120); }
    assert.ok(budget > 0); assert.equal(hits, 1); assert.ok(target.currentHp < beforeHp); assert.equal(engine.projectiles.length, 0);
    const impact = engine.projectileVisualImpacts[0], impactX = target.x;
    assert.equal(impact.x, impactX); const r = recorder(); engine.drawProjectileImpact(r.ctx, impact); r.balanced();
    target.x -= facing * 400; const moved = recorder(); engine.drawProjectileImpact(moved.ctx, impact); moved.balanced(); assert.deepEqual(moved.calls, r.calls);
    const hpAfter = target.currentHp; for (let i = 0; i < 200; i++) { engine.updateActions(1 / 120); engine.updateProjectiles(1 / 120); }
    assert.equal(hits, 1); assert.equal(target.currentHp, hpAfter); assert.equal(engine.projectileVisualImpacts.length, 0);
    observations.push({ case: 'Tracked projectile', id, side, impacts: hits, damage: beforeHp - hpAfter, contactX: impactX, passed: true });
  }
});

test('Wave6 controlled contact keeps miss trails while previous native visual families ignore the new optional contract', () => {
  const sonic = hero('sonic_hedgehog'), profile = resolveMeleeSuper(sonic);
  const options = { actor: { ...sonic, x: 300, y: 350 }, profile,
    action: { duration: profile.duration, hitAt: profile.hitAt, elapsed: 0.47, facing: 1 }, target: { x: 400, y: 350 }, height: 142 };
  const before = JSON.stringify(options), miss = getVisual({ ...options, contactVisual: { confirmed: false } });
  const record = recorder(); drawVisual(record.ctx, miss); record.balanced();
  assert.equal(record.calls.filter(call => call[0] === 'lineTo').length, 3, 'miss keeps speed trails');
  assert.equal(record.calls.some(call => call[0] === 'ellipse'), false, 'miss never acquires an impact ring');
  assert.equal(JSON.stringify(options), before);
  let previousFamilies = 0;
  for (const asset of getAnimationAssets()) {
    const actor = heroes.find(candidate => candidate.id === asset.heroId); if (!actor) continue;
    const source = resolveMeleeSuper(actor), base = { actor: { ...actor, x: 300, y: 350 }, profile: source,
      action: { duration: source.duration, hitAt: source.hitAt, elapsed: 0.55, facing: 1 }, target: { x: 400, y: 350 } };
    const original = getVisual(base); if (!original || ['native-wave6', 'native-wave7', 'native-wave8', 'native-wave9', 'native-wave10', 'native-wave11'].includes(original.family)) continue;
    assert.deepEqual(getVisual({ ...base, contactVisual: { confirmed: false } }), original);
    previousFamilies++;
  }
  assert.ok(previousFamilies >= 30, `Expected previous FF8/party/native families, found ${previousFamilies}`);
  observations.push({ case: 'Legacy families and Sonic miss trails', previousFamilies, pureDraw: true, passed: true });
});

const smash = (id, side) => {
  const own = hero(id), other = dummy('smash-contact-target'), events = [];
  const players = side === 'player' ? [own] : [other], opponents = side === 'player' ? [other] : [own];
  const engine = new EngineSmash(1000, 500, players, { monsters: opponents, bosses: [], customRoster: opponents },
    { add: (...args) => events.push(args) }, noop, noop,
    { universe: 'Nexus de Convergence', disableHazards: true, mode: 'Smash', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine); engine.syncPreMatchFromServer(3000);
  const actor = (side === 'player' ? engine.heroes : engine.enemies)[0], target = (side === 'player' ? engine.enemies : engine.heroes)[0];
  const facing = side === 'player' ? 1 : -1;
  actor.x = side === 'player' ? 300 : 700; actor.y = engine.groundY; actor.facing = facing; actor.specialCharge = 100; actor.state = 'idle';
  target.x = actor.x + facing * 100; target.y = actor.y; target.maxHp = target.currentHp = 5000;
  assert.equal(engine.triggerMeleeSuper(actor), true);
  return { engine, actor, target, side, facing, events };
};
const advanceSmash = (c, seconds) => {
  for (let remaining = seconds; remaining > 1e-9;) {
    const dt = Math.min(1 / 120, remaining);
    tickMeleeCombatActor(c.actor, dt, { resolveActionHit: (actor, action) => c.engine.resolveMeleeActionHit(actor, action) }); remaining -= dt;
  }
};
const drawSmash = c => {
  const record = recorder(); c.engine.drawMeleeSuper(record.ctx, c.actor); record.balanced(); return record.calls;
};
const smashState = c => JSON.stringify({ actor: c.actor, target: c.target, damageDealt: c.engine.damageDealt, damageTaken: c.engine.damageTaken });

test('Smash Snake/Raiden perfect shields keep their own feedback and reject offensive contact marks in both camps', () => {
  for (const side of ['player', 'cpu']) for (const id of ['snake', 'raiden']) {
    const c = smash(id, side), { actor, target } = c, hp = target.currentHp;
    advanceSmash(c, 0.44); assert.equal(beginMeleeShield(target), true); advanceSmash(c, 0.03);
    assert.equal(actor.action.impactResolved, true); assert.equal(target.currentHp, hp); assert.equal(target.state, 'perfectShield');
    assert.equal(target.meleeMetrics.perfectShields, 1); assert.ok(c.events.some(event => event.includes('PERFECT')));
    assert.equal(actor.action.visualConfirmedContact, undefined);
    const before = smashState(c); assert.equal(drawSmash(c).some(call => ['ellipse', 'lineTo'].includes(call[0])), false); assert.equal(smashState(c), before);
    observations.push({ case: 'Smash rejected perfect shield contact', id, side, damage: 0, shieldState: target.state, originalShieldFeedback: true, offensiveMarks: 0, passed: true });
  }
});

test('Smash misses cannot acquire a contact when a target crosses back into range after the resolved hit', () => {
  for (const side of ['player', 'cpu']) for (const id of ['snake', 'raiden']) for (const reason of ['range', 'behind', 'height']) {
    const c = smash(id, side), { actor, target, facing } = c;
    advanceSmash(c, 0.44);
    if (reason === 'range') target.x = actor.x + facing * (actor.action.superProfile.range + 100);
    if (reason === 'behind') target.x = actor.x - facing * 100;
    if (reason === 'height') target.y = actor.y - 220;
    const hp = target.currentHp; advanceSmash(c, 0.03);
    assert.equal(actor.action.impactResolved, true); assert.equal(target.currentHp, hp); assert.equal(actor.action.impactPoint, undefined);
    target.x = actor.x + facing * 100; target.y = actor.y;
    assert.equal(actor.action.visualConfirmedContact, undefined);
    const before = smashState(c); assert.equal(drawSmash(c).some(call => ['ellipse', 'lineTo'].includes(call[0])), false); assert.equal(smashState(c), before);
    observations.push({ case: 'Smash miss followed by target movement', id, side, reason, damage: 0, impactResolved: true, offensiveMarks: 0, passed: true });
  }
});

test('Smash accepted Snake/Raiden contacts keep the original hit point through movement and death in both camps', () => {
  for (const side of ['player', 'cpu']) for (const id of ['snake', 'raiden']) for (const lethal of [false, true]) {
    const c = smash(id, side), { actor, target } = c;
    if (lethal) target.currentHp = 1;
    const hp = target.currentHp, point = { x: target.x, y: target.y };
    advanceSmash(c, 0.47);
    assert.ok(target.currentHp < hp); assert.deepEqual(actor.action.visualConfirmedContact, { confirmed: true, ...point });
    if (lethal) assert.equal(target.currentHp, 0);
    const first = drawSmash(c), before = smashState(c); assert.ok(first.some(call => ['ellipse', 'lineTo'].includes(call[0]))); assert.equal(smashState(c), before);
    target.x -= c.facing * 400; target.y += 180;
    assert.deepEqual(drawSmash(c), first);
    const hpAfter = target.currentHp;
    for (let i = 0; i < 100; i++) { tickMeleeCombatActor(actor, 0); assert.deepEqual(drawSmash(c), first); }
    assert.equal(target.currentHp, hpAfter);
    observations.push({ case: 'Smash accepted contact locked after move', id, side, lethal, point, damage: hp - hpAfter, pausedDraws: 100, passed: true });
  }
});

test('Smash Sonic retains only speed trails after a miss and repeated zero-delta draws keep gameplay frozen', () => {
  for (const side of ['player', 'cpu']) {
    const c = smash('sonic_hedgehog', side), { actor, target, facing } = c;
    target.x = actor.x + facing * (actor.action.superProfile.range + 100); advanceSmash(c, 0.47);
    target.x = actor.x + facing * 100;
    const before = smashState(c), first = drawSmash(c);
    assert.equal(first.filter(call => call[0] === 'lineTo').length, 3); assert.equal(first.some(call => call[0] === 'ellipse'), false);
    for (let i = 0; i < 100; i++) { tickMeleeCombatActor(actor, 0); assert.deepEqual(drawSmash(c), first); }
    assert.equal(smashState(c), before); assert.equal(target.currentHp, 5000);
    observations.push({ case: 'Smash Sonic miss trails and paused draws', side, damage: 0, speedTrails: 3, offensiveRings: 0, pausedDraws: 100, passed: true });
  }
});
