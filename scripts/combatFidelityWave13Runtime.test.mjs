import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';

// Independent engine tests. Actual body PNG/crop, projectile flight and browser
// provenance checks live in the new W13 browser harness, not in this SSR proof.
let vite, EngineTactics, HEROES_DB, getFrame, renderer;
const engines = [], noop = () => {}, particles = { add: noop };
const plan = JSON.parse(readFileSync('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json'));
const ids = Object.values(plan.parts).flat();
const refusedIds = JSON.parse(readFileSync('docs/combat-fidelity-wave13-2026-10-24/part-b/request-failures.json')).failures.map(failure => failure.heroId);
before(async () => {
  vite = await createServer({ logLevel: 'silent', appType: 'custom', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ getCharacterAnimationFrame: getFrame } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  renderer = await vite.ssrLoadModule('/src/game/renderer.js');
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
const hero = id => { const found = HEROES_DB.find(unit => unit.id === id); assert.ok(found, id); return found; };
const training = id => ({ id, name: id, universe: 'W13 independent runtime training', category: 'test', weaponType: 'melee', stats: { hp: 5000, atk: 1, def: 0, spd: 1 }, simple: { name: 'Training', type: 'melee', dmg: 1 } });
const hp = units => units.map(unit => unit.currentHp);
const place = (engine, unit, surfaceId) => {
  const surface = engine.terrain.byId.get(surfaceId); assert.ok(surface, surfaceId);
  Object.assign(unit, { surfaceId, gridX: surface.x, gridY: surface.y, gridZ: surface.z, state: 'idle', stateTimer: 0, cooldown: 0, maxHp: 5000, currentHp: 5000, specialCharge: 100 });
};
function fixture(id, side, upper = false) {
  const own = [hero(id), training('ally')], opposing = [training('enemy-one'), training('enemy-two')];
  const players = side === 'hero' ? own : opposing, enemies = side === 'enemy' ? own : opposing;
  const engine = new EngineTactics(1800, 850, players, { monsters: enemies, bosses: [], customRoster: enemies }, particles, noop, noop, {
    universe: 'Nexus de Convergence', tacticsBattlefieldId: 'nexus_skybridge', disableHazards: true,
    customBattle: { singleRoster: true, opponentControl: 'p2' }, difficulty: 'Medium'
  });
  engines.push(engine); assert.ok(engine.verticalTerrain && engine.terrain.vertical);
  const allies = side === 'hero' ? engine.heroes : engine.enemies, targets = side === 'hero' ? engine.enemies : engine.heroes;
  const actor = allies[0], layer = upper ? 'bridge' : 'ground';
  place(engine, actor, `${layer}:${side === 'hero' ? 5 : 6}:3`);
  place(engine, allies[1], `${layer}:${side === 'hero' ? 4 : 7}:3`);
  place(engine, targets[0], `${layer}:${side === 'hero' ? 6 : 5}:3`);
  place(engine, targets[1], 'ground:0:0');
  engine.syncActorsToCamera(); engine.activeUnit = actor; engine.activeUnitType = side;
  engine.actionPhase = 'action'; engine.selectedAction = null; engine.selectedActionExplicit = false;
  return { engine, actor, allies, targets };
}
const snapshot = c => JSON.stringify({ heroes: c.engine.heroes, enemies: c.engine.enemies, phase: c.engine.actionPhase, turns: c.engine.turnsElapsed });

test('all40 W13 specials commit real vertical combat for both human camps with meter, actual effects and pause semantics', () => {
  let cases = 0, offensive = 0, support = 0;
  for (const [index, id] of ids.entries()) for (const side of ['hero', 'enemy']) {
    const c = fixture(id, side, index % 2 === 0), { engine, actor } = c;
    const profile = engine.getAttackProfile(actor, 'special'), beforeEnemy = hp(c.targets);
    actor.specialCharge = 99;
    assert.equal(engine.selectAction('special'), false, id + '/' + side + ': charge99');
    assert.equal(actor.specialCharge, 99);
    actor.specialCharge = 100; assert.equal(engine.selectAction('special'), true, id + '/' + side + ': selection');
    const target = profile.effect === 'damage' ? c.targets[0] : c.allies[1];
    const result = engine.handleSurfaceClick(target.surfaceId);
    assert.equal(result.handled, true, id + '/' + side + ': ' + JSON.stringify(result));
    assert.equal(actor.specialCharge, 0); assert.equal(engine.selectAction('special'), false);
    assert.equal(actor.state, 'special'); assert.equal(actor.stateTimer, 35);
    if (profile.effect === 'damage') {
      offensive++; assert.ok(c.targets[0].currentHp < beforeEnemy[0], id + ': real damage absent');
    } else {
      support++; assert.deepEqual(hp(c.targets), beforeEnemy, id + ': support damaged enemy');
      assert.equal(engine.getActionBaseDamage(actor, 'special'), 0);
      const field = profile.effect === 'guard' ? 'tacticsGuardTicks' : 'tacticsBuffTicks';
      assert.ok(c.allies.every(unit => unit[field] > 0), id + ': actual group ' + profile.effect + ' absent');
    }
    engine.setPaused(true); const paused = snapshot(c);
    for (let tick = 0; tick < 50; tick++) engine.update();
    assert.equal(snapshot(c), paused, id + ': paused simulation advanced'); engine.setPaused(false);
    const settled = { allies: hp(c.allies), enemies: hp(c.targets) };
    for (let tick = 0; tick < 40; tick++) engine.update();
    assert.deepEqual({ allies: hp(c.allies), enemies: hp(c.targets) }, settled, id + ': effect replayed by animation');
    assert.equal(actor.state, 'idle'); engine.dispose(); cases++;
  }
  assert.equal(cases, 80); assert.equal(offensive, 48); assert.equal(support, 32);
});

test('vertical Tactics native super projection follows real simulation stateTimer across all four columns without mutation', () => {
  let testedNativeBodies = 0;
  for (const id of ids) for (const side of ['hero', 'enemy']) {
    const c = fixture(id, side), { engine, actor } = c;
    const profile = engine.getAttackProfile(actor, 'special'); assert.equal(engine.selectAction('special'), true);
    const result = engine.handleSurfaceClick((profile.effect === 'damage' ? c.targets[0] : c.allies[1]).surfaceId);
    assert.equal(result.handled, true);
    let elapsed = 0;
    for (const [column, ticks] of [0, 10, 20, 32].entries()) {
      while (elapsed < ticks) { engine.update(); elapsed++; }
      const before = snapshot(c), view = engine.verticalTerrain.drawActor(actor), frame = getFrame(view);
      assert.equal(snapshot(c), before, id + ': projection mutated the authoritative actor');
      assert.notEqual(view, actor); assert.equal(view.presentationPhase, 'super');
      assert.ok(Math.abs(view.presentationProgress - elapsed / 35) < 1e-12);
      if (frame) { assert.equal(frame.col, column, id + '/' + side + ': native phase did not advance'); if (column === 3) testedNativeBodies++; }
    }
    engine.dispose();
  }
  // This SSR test intentionally permits in-progress source delivery. The browser
  // final-run gate requires every non-refused manifest entry and actual PNG.
  assert.ok(testedNativeBodies > 0, 'No delivered W13 body exercised');
});

test('W13 support respects bridge floor separation and does not spend charge on an unreachable ally', () => {
  for (const id of ['bishop', 'atlas', 'hayden']) for (const side of ['hero', 'enemy']) {
    const c = fixture(id, side), { engine, actor } = c;
    const ally = c.allies[1], x = actor.gridX;
    place(engine, ally, `bridge:${x}:3`); engine.syncActorsToCamera();
    assert.equal(engine.selectAction('special'), true);
    const result = engine.handleSurfaceClick(ally.surfaceId);
    assert.equal(result.handled, false, id + ': support crossed a solid bridge slab');
    assert.equal(actor.specialCharge, 100); assert.deepEqual(hp(c.targets), [5000, 5000]);
    // Selection can move, but failed targeting cannot grant a buff or guard.
    assert.equal(ally.tacticsGuardTicks, undefined); assert.equal(ally.tacticsBuffTicks, undefined);
    assert.equal(actor.state, 'idle'); assert.equal(actor.stateTimer, 0);
    engine.dispose();
  }
});

// PNG dimensions are read from real files, while this small canvas recorder
// isolates renderer dispatch. It is not a claim that SSR displays image pixels.
function recordDraw(draw) {
  const OriginalImage = globalThis.Image, calls = [];
  globalThis.Image = class {
    complete = true;
    set src(value) {
      this._src = value; this.currentSrc = value;
      const bytes = readFileSync('public' + value);
      this.naturalWidth = bytes.readUInt32BE(16); this.naturalHeight = bytes.readUInt32BE(20);
      this.onload?.();
    }
    get src() { return this._src; }
  };
  const context = new Proxy({ globalAlpha: 1, canvas: {} }, { get(target, key) {
    if (key in target) return target[key];
    return (...args) => { calls.push([key, ...args]); };
  } });
  try { draw(context); }
  finally { globalThis.Image = OriginalImage; }
  return calls;
}
const recordEnemyDraw = (actor, animTime = 900) => recordDraw(context => renderer.drawPixelEnemy(context, 300, 250, actor, animTime, -1, 68));

test('opposing heroes draw their dedicated native super source cell before any monster or base sheet', () => {
  const actor = { ...hero('ripley'), id: 'enemy:custom:ripley', sourceHeroId: 'ripley', state: 'special',
    presentationPhase: 'super', presentationProgress: 0.6, presentationImpactProgress: 0.41 };
  const before = structuredClone(actor), frame = getFrame(actor); assert.ok(frame);
  const calls = recordEnemyDraw(actor), draws = calls.filter(call => call[0] === 'drawImage');
  assert.equal(draws.length, 1); assert.equal(draws[0][1].src, frame.asset.sheet);
  assert.deepEqual(draws[0].slice(2, 6), [512, 7 * 256, 256, 256]);
  assert.ok(calls.some(call => call[0] === 'scale' && call[1] === -1));
  assert.deepEqual(actor, before);
});

test('refused opposing hero artwork retains each unchanged historical hero body', () => {
  for (const id of refusedIds) {
    const actor = { ...hero(id), sourceHeroId: id, id: 'enemy:custom:' + id, state: 'special', presentationPhase: 'super', presentationProgress: 0.6 };
    const baseline = plan.heroes.find(entry => entry.hero.id === id);
    const calls = recordEnemyDraw(actor), draw = calls.find(call => call[0] === 'drawImage');
    assert.ok(draw, id); assert.equal(draw[1].src, baseline.referenceAsset);
    assert.equal(getFrame(actor), null, id + ': historical PNG was misreported as new native presentation');
  }
});

test('monster sprites and procedural Origin Forge threats keep their existing renderer dispatch', () => {
  const monster = { id: 'ripley', name: 'Zombie', universe: 'Crypt of the NecroDancer', state: 'special' };
  const monsterCalls = recordEnemyDraw(monster), monsterDraw = monsterCalls.find(call => call[0] === 'drawImage');
  assert.ok(monsterDraw); assert.equal(monsterDraw[1].src, '/sprites/generated/bosses/crypt-of-the-necrodancer/zombie.png');
  const forge = { ...hero('ripley'), visualStyle: 'origin_forge_matrix', state: 'special' };
  const forgeCalls = recordEnemyDraw(forge);
  assert.equal(forgeCalls.some(call => call[0] === 'drawImage'), false);
  assert.ok(forgeCalls.some(call => call[0] === 'ellipse'));
  assert.ok(forgeCalls.some(call => call[0] === 'fillRect'));
});

test('paused refused Tactics bodies keep historical source cells bound to stateTimer for both camps', () => {
  for (const id of refusedIds) for (const side of ['hero', 'enemy']) {
    const c = fixture(id, side), { engine, actor } = c;
    assert.equal(engine.selectAction('special'), true);
    assert.equal(engine.handleSurfaceClick(c.targets[0].surfaceId).handled, true);
    const baseline = plan.heroes.find(entry => entry.hero.id === id);
    let elapsed = 0;
    for (const ticks of [0, 10, 20, 32]) {
      while (elapsed < ticks) { engine.update(); elapsed++; }
      const view = engine.verticalTerrain.drawActor(actor), before = snapshot(c);
      assert.equal(getFrame(view), null, id + ': cannot claim native artwork');
      assert.ok(view.presentationFrame, id + ': historical crop must be explicit');
      const crop = animTime => recordDraw(context => engine.drawTacticsUnit(context, { unit: actor, type: side }, animTime))
        .find(call => call[0] === 'drawImage' && call[1].src === baseline.referenceAsset);
      const first = crop(0); assert.ok(first, id + ': no historical body draw');
      assert.deepEqual(crop(973).slice(2, 6), first.slice(2, 6), id + ': historical crop follows global render clock');
      engine.setPaused(true); for (let i = 0; i < 80; i++) engine.update();
      assert.deepEqual(crop(3211).slice(2, 6), first.slice(2, 6), id + ': paused historical crop advanced');
      assert.equal(snapshot(c), before, id + ': pause or body rendering mutated simulation');
      engine.setPaused(false);
    }
    engine.dispose();
  }
});
