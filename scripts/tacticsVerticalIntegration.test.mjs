import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { canOccupyTerrainSurface, getTerrainUnitFootprint } from '../src/game/tacticsTerrain.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const engines = [], noop = () => {};
let vite, EngineTactics, getTacticsBattlefield, getTacticsPickupPositions;
before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?vertical-integration'));
  ({ getTacticsBattlefield, getTacticsPickupPositions } = await vite.ssrLoadModule('/src/game/tacticsBattlefields.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

const profile = (extra = {}) => ({ delivery: 'ranged', shape: 'single', range: 8, minRange: 0, requiresLineOfSight: true, ...extra });
const makeHero = (id = 'vertical-hero') => ({
  id, name: id, universe: 'Nexus de Convergence', category: 'vertical-test',
  primaryColor: '#39c5bb', weaponType: 'rifle',
  stats: { hp: 250, atk: 35, def: 8, spd: 20 },
  simple: { name: 'Conventional shot', dmg: 1, tactics: profile() },
  secondary: { name: 'Conventional second shot', dmg: 1.2, cd: 3, tactics: profile({ range: 3 }) },
  special: { name: 'Conventional heavy shot', dmg: 1.8, tactics: profile() },
  defense: { name: 'Guard', reduce: 0.4, dur: 1 }
});
const makeEnemy = (index = 0, extra = {}) => ({
  id: `vertical-enemy-${index}`, name: `Enemy ${index}`, universe: 'Nexus de Convergence',
  hp: 250, atk: 18, def: 5, spd: 5, weapon: 'melee', ...extra
});
const makeEngine = (id = 'nexus_skybridge', options = {}) => {
  const enemies = options.enemies || [makeEnemy(0), makeEnemy(1), makeEnemy(2)];
  const engine = new EngineTactics(1050, 700, options.heroes || [makeHero()], {
    monsters: enemies, bosses: [], worldBoss: null, customRoster: enemies
  }, { add: noop }, noop, noop, {
    id: 'vertical-integration', universe: 'Nexus de Convergence', tacticsBattlefieldId: id,
    difficulty: 'Medium', customBattle: { singleRoster: true, opponentControl: 'p2' }
  });
  engines.push(engine);
  return engine;
};
const place = (engine, unit, id) => {
  const support = engine.terrain.byId.get(id);
  assert.ok(support, id);
  Object.assign(unit, { surfaceId: id, gridX: support.x, gridY: support.y, gridZ: support.z });
  engine.syncActorsToCamera();
};
const heroTurn = engine => {
  engine.activeUnit = engine.heroes[0]; engine.activeUnitType = 'hero';
  engine.movementBudget = 2; engine.movementSpent = 0; engine.actionPhase = 'move';
  engine.selectedAction = null; engine.selectedActionExplicit = false;
  engine.calculateMovementRange();
};

test('all three vertical boards are selectable in the real catalogue and pickups keep both floors', () => {
  for (const id of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
    const field = getTacticsBattlefield({ tacticsBattlefieldId: id, universe: 'Nexus de Convergence' });
    assert.equal(field.id, id); assert.equal(field.formatVersion, 2);
    const pickups = getTacticsPickupPositions({ tacticsBattlefieldId: id, universe: 'Nexus de Convergence' });
    assert.equal(pickups.length, 5);
    assert.ok(pickups.every(item => item.surfaceId && item.key === item.surfaceId && Number.isFinite(item.z)));
    const engine = makeEngine(id);
    assert.equal(engine.verticalTerrain.terrain, engine.terrain);
    assert.ok(engine.heroes.every(unit => unit.surfaceId));
    assert.ok(engine.enemies.every(unit => unit.surfaceId));
  }
  const stacked = getTacticsPickupPositions({ tacticsBattlefieldId: 'nexus_skybridge' }).filter(item => item.gridX === 4 && item.gridY === 3);
  assert.deepEqual(stacked.map(item => item.z), [0, 3]);
  assert.equal(getTacticsBattlefield({ forceBaseArena: true, tacticsBattlefieldId: 'nexus_skybridge' }).id, 'training_grid');
  assert.equal(getTacticsBattlefield({ universe: 'Unmapped Flat Test' }).id, 'training_grid');
});

test('movement spends staircase AP, animates the real route, freezes on pause and cannot refund AP', () => {
  const engine = makeEngine(), hero = engine.heroes[0];
  place(engine, hero, 'ground:0:3'); heroTurn(engine);
  const result = engine.handleCellClick(1, 3, 'stairs:1:3');
  assert.equal(result.handled, true); assert.equal(result.cost, 2);
  assert.deepEqual(result.path, ['ground:0:3', 'stairs:1:3']);
  assert.equal(engine.actionPhase, 'moving'); assert.equal(engine.movementSpent, 2);
  assert.equal(hero.surfaceId, 'stairs:1:3');
  engine.update();
  const paused = { x: hero.x, y: hero.y, segment: hero.terrainMotion.segment, elapsed: hero.terrainMotion.elapsed };
  engine.setPaused(true);
  for (let frame = 0; frame < 40; frame++) engine.update();
  assert.deepEqual({ x: hero.x, y: hero.y, segment: hero.terrainMotion.segment, elapsed: hero.terrainMotion.elapsed }, paused);
  engine.setPaused(false);
  for (let frame = 0; frame < 40; frame++) engine.update();
  assert.equal(hero.terrainMotion, undefined); assert.equal(engine.actionPhase, 'action');
  assert.deepEqual({ x: hero.x, y: hero.y }, engine.getUnitScreenPosition(1, 3, 'stairs:1:3'));
  assert.equal(engine.cancelSelectedAction(), true);
  assert.equal(engine.movementSpent, 2);
  assert.equal(engine.movementRange.length, 1);
  assert.equal(engine.handleCellClick(2, 3, 'stairs:2:3').handled, false);
});

test('two units at one XY remain separately occupied and targetable by floor', () => {
  const engine = makeEngine(), hero = engine.heroes[0], top = engine.enemies[0], low = engine.enemies[1];
  place(engine, hero, 'ground:4:3'); place(engine, top, 'bridge:5:3'); place(engine, low, 'ground:5:3');
  assert.equal(engine.getUnitAtCell(5, 3, 'bridge:5:3').unit, top);
  assert.equal(engine.getUnitAtCell(5, 3, 'ground:5:3').unit, low);
  assert.equal(engine.getUnitAtCell(5, 3), null);
  assert.equal(engine.isCellOccupied(4, 3, null, 'ground:4:3'), true);
  assert.equal(engine.isCellOccupied(4, 3, null, 'bridge:4:3'), false);
  assert.equal(engine.handleCellClick(4, 3).handled, false, 'an ambiguous click must not select an upper floor implicitly');
});

test('real shot resolution changes the lower target only and refuses a shot through the deck', () => {
  const engine = makeEngine(), hero = engine.heroes[0], low = engine.enemies[0], top = engine.enemies[1];
  place(engine, hero, 'ground:4:3'); place(engine, low, 'ground:5:3'); place(engine, top, 'bridge:5:3');
  heroTurn(engine); engine.selectAction('simple');
  const lowerHp = low.currentHp, upperHp = top.currentHp;
  assert.equal(engine.handleSurfaceClick('bridge:5:3').handled, false);
  assert.equal(low.currentHp, lowerHp); assert.equal(top.currentHp, upperHp);
  const hit = engine.handleSurfaceClick('ground:5:3');
  assert.equal(hit.handled, true); assert.ok(low.currentHp < lowerHp);
  assert.equal(top.currentHp, upperHp);
});

test('the bridge blocks cross-floor shots even when a profile ignores ordinary line of sight', () => {
  const engine = makeEngine(), hero = engine.heroes[0], enemy = engine.enemies[0];
  place(engine, hero, 'ground:4:3'); place(engine, enemy, 'bridge:4:3');
  hero.simple.tactics = profile({ requiresLineOfSight: false });
  assert.equal(engine.canAttackCell(hero, enemy, 'simple'), false);
  hero.simple.tactics.pierceTerrain = true;
  assert.equal(engine.canAttackCell(hero, enemy, 'simple'), true, 'cross-terrain action must opt in explicitly');
});

test('a large splash on the bridge does not damage the unit directly beneath its floor', () => {
  const engine = makeEngine(), hero = engine.heroes[0], top = engine.enemies[0], low = engine.enemies[1];
  place(engine, hero, 'bridge:4:3'); place(engine, top, 'bridge:5:3'); place(engine, low, 'ground:5:3');
  hero.simple.tactics = profile({ shape: 'area', areaRadius: 4, maxTargets: 20 });
  const targets = engine.getAttackTargets(hero, top, 'simple', 'hero').map(entry => entry.unit);
  assert.ok(targets.includes(top)); assert.equal(targets.includes(low), false);
  const before = low.currentHp;
  engine.applyProfiledAttack(hero, top, 'simple', 70, null, 'hero');
  assert.equal(low.currentHp, before); assert.ok(top.currentHp < top.maxHp);
});

test('a capture and extraction require their declared surface rather than an XY match', () => {
  const engine = makeEngine(), hero = engine.heroes[0];
  place(engine, hero, 'ground:5:3'); engine.updateTacticsObjective();
  assert.equal(engine.objectiveProgress, 0);
  place(engine, hero, 'bridge:5:3'); engine.updateTacticsObjective();
  assert.equal(engine.objectiveProgress, 1);
  const extraction = makeEngine('cyber_catwalks');
  place(extraction, extraction.heroes[0], 'ground:8:5'); extraction.updateTacticsObjective();
  assert.equal(extraction.objectiveProgress, 0);
  place(extraction, extraction.heroes[0], 'catwalk:8:5'); extraction.updateTacticsObjective();
  assert.equal(extraction.objectiveProgress, 1);
});

test('barrel damage keeps its source floor and does not cross the bridge slab', () => {
  const engine = makeEngine(), hero = engine.heroes[0], low = engine.enemies[0], top = engine.enemies[1];
  place(engine, hero, 'ground:4:3'); place(engine, low, 'ground:6:3'); place(engine, top, 'bridge:5:3');
  const upperHp = top.currentHp, lowerHp = low.currentHp, heroHp = hero.currentHp;
  engine.triggerBarrelExplosion(5, 3, 'ground:5:3');
  assert.ok(low.currentHp < lowerHp); assert.ok(hero.currentHp < heroHp);
  assert.equal(top.currentHp, upperHp);
});

test('hazard pulses respect the source volume even when their configured radius spans both floors', () => {
  const engine = makeEngine('cyber_catwalks'), hero = engine.heroes[0], top = engine.enemies[0];
  engine.terrain.byId.get('ground:5:3').type = 'normal';
  engine.terrain.byId.get('ground:5:2').type = 'hazard';
  place(engine, hero, 'ground:5:2'); place(engine, top, 'catwalk:5:2');
  engine.missionProfile = { ...engine.missionProfile, hazardRadius: 4, pressure: 2 };
  const topHp = top.currentHp;
  engine.applyHazardPulse();
  assert.equal(hero.currentHp, hero.maxHp - 12); assert.equal(top.currentHp, topHp);
});

test('reinforcement candidate selection distinguishes a free deck from its occupied lower floor', () => {
  const engine = makeEngine();
  place(engine, engine.heroes[0], 'ground:4:3');
  const spawn = engine.findOpenTacticsSpawn([
    { x: 4, y: 3, surfaceId: 'ground:4:3' }, { x: 4, y: 3, surfaceId: 'bridge:4:3' }
  ]);
  assert.equal(spawn.surfaceId, 'bridge:4:3');
});

test('view cuts change selection visibility without changing occupancy or damage rules', () => {
  const engine = makeEngine(), hero = engine.heroes[0], top = engine.enemies[0];
  place(engine, hero, 'ground:4:3'); place(engine, top, 'bridge:5:3');
  assert.equal(engine.selectTerrainSurface('bridge:4:3'), true);
  assert.equal(engine.setTerrainLevel(0), true);
  assert.equal(engine.isTerrainSurfaceVisible('bridge:4:3'), false);
  assert.equal(engine.isCellOccupied(5, 3, null, 'bridge:5:3'), true);
  assert.equal(engine.canAttackCell(hero, top, 'simple'), false);
  assert.equal(engine.selectTerrainSurface('bridge:4:3'), false);
  assert.equal(engine.getTerrainViewState().selectedSurfaceId, 'ground:4:3');
  assert.equal(engine.setTerrainLevel(null), true);
  assert.equal(engine.selectTerrainSurface('bridge:4:3'), true);
});

test('automatic heroes choose the physical staircase when their objective is on the bridge', async () => {
  const engine = makeEngine(), hero = engine.heroes[0];
  place(engine, hero, 'ground:0:3'); heroTurn(engine);
  hero.simple.tactics = profile({ delivery: 'melee', range: 1 });
  hero.secondary.tactics = profile({ delivery: 'melee', range: 1 });
  hero.special.tactics = profile({ delivery: 'melee', range: 1 });
  engine.runHeroAI();
  assert.equal(engine.verticalTerrain.lastMove.path.at(-1), 'stairs:1:3');
  assert.equal(engine.movementSpent, 2); assert.equal(engine.actionPhase, 'moving');
  for (let frame = 0; frame < 40; frame++) engine.update();
  assert.equal(hero.terrainMotion, undefined);
  assert.equal(hero.surfaceId, 'stairs:1:3');
  assert.equal(engine.actionPhase, 'end');
  assert.equal(engine.turnsElapsed, 1);
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.equal(engine.activeUnitType, 'enemy');
});

test('real camera selection preserves surface identity after pan, zoom and an underside cut', () => {
  const engine = makeEngine();
  const check = (id, level) => {
    assert.equal(engine.setTerrainLevel(level), true);
    const support = engine.terrain.byId.get(id);
    const point = engine.gridToScreen(support.x, support.y, true, id);
    assert.equal(engine.screenToGrid(point.x, point.y).surfaceId, id);
  };
  check('bridge:4:3', null); check('ground:4:3', 0);
  engine.panCameraBy(25, 18);
  const anchor = engine.gridToScreen(4, 3, true, 'ground:4:3');
  engine.zoomCameraAt(1.25, anchor.x, anchor.y);
  check('bridge:4:3', null); check('ground:4:3', 0);
});

test('panning and zooming during a move reproject its current feet without advancing the path or snapping to its destination', () => {
  const engine = makeEngine(), hero = engine.heroes[0];
  place(engine, hero, 'ground:0:3'); heroTurn(engine);
  assert.equal(engine.handleSurfaceClick('stairs:1:3').handled, true);
  engine.panCameraBy(15, 10);
  const beginning = engine.verticalTerrain.project(0.5, 3.5, 0);
  assert.deepEqual({ x: hero.x, y: hero.y }, beginning, 'a camera event before the first simulation tick must keep the feet at the route origin');
  for (let frame = 0; frame < 5; frame++) engine.update();
  const rendered = { ...hero.terrainRenderPosition };
  const elapsed = hero.terrainMotion.elapsed;
  engine.panCameraBy(-22, 4);
  let point = engine.verticalTerrain.project(rendered.x + 0.5, rendered.y + 0.5, rendered.z);
  assert.deepEqual({ x: hero.x, y: hero.y }, point);
  engine.setPaused(true);
  engine.zoomCameraAt(1.2, point.x, point.y);
  point = engine.verticalTerrain.project(rendered.x + 0.5, rendered.y + 0.5, rendered.z);
  assert.deepEqual({ x: hero.x, y: hero.y }, point);
  assert.deepEqual(hero.terrainRenderPosition, rendered);
  assert.equal(hero.terrainMotion.elapsed, elapsed);
  assert.equal(engine.movementSpent, 2); assert.equal(engine.actionPhase, 'moving');
  engine.setPaused(false);
  for (let frame = 0; frame < 40; frame++) engine.update();
  assert.equal(hero.terrainMotion, undefined); assert.equal(engine.actionPhase, 'action');
});

test('headroom excludes tall units from the underpass and forced movement stops at the deck edge', () => {
  const engine = makeEngine(), hero = engine.heroes[0];
  hero.tacticsHeight = 3;
  place(engine, hero, 'ground:4:2');
  assert.equal(engine.getReachableCells(hero, 2).some(entry => entry.surfaceId === 'ground:4:3'), false);
  hero.tacticsHeight = 1.6;
  place(engine, hero, 'bridge:5:3');
  place(engine, engine.enemies[0], 'ground:6:3');
  engine.pushUnitHorizontally(hero, 5);
  assert.equal(hero.surfaceId, 'bridge:7:3'); assert.equal(hero.gridZ, 3);
  assert.equal(hero.gridX, 7); assert.equal(hero.gridY, 3);
});

for (const id of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
  test(`${id} binds a six-boss custom roster to non-overlapping supported volumes`, () => {
    const enemies = Array.from({ length: 6 }, (_, index) => makeEnemy(index, {
      isBoss: true, tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 }
    }));
    const engine = makeEngine(id, { enemies });
    const occupied = new Set([...engine.heroes.map(unit => unit.surfaceId), ...engine.obstacles.map(unit => unit.surfaceId)]);
    for (const unit of engine.enemies) {
      assert.equal(canOccupyTerrainSurface(engine.terrain, unit, { unit }), true, `${unit.id}: ${unit.surfaceId}`);
      const supports = getTerrainUnitFootprint(engine.terrain, unit, unit);
      for (const support of supports) {
        assert.equal(occupied.has(support.id), false, `${unit.id}: overlapping ${support.id}`);
        occupied.add(support.id);
      }
    }
  });
}
