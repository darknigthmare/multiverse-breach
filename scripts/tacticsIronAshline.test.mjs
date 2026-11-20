import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { TACTICS_IRON_ASHLINE_BATTLEFIELD as field } from '../src/game/tacticsIronAshlineBattlefield.js';
import { TACTICS_ORIGINAL_MATERIALS } from '../src/game/tacticsOriginalPresentation.js';
import { normalizeTacticsTerrain, findTerrainPath, canOccupyTerrainSurface, getTerrainUnitFootprint,
  getTerrainNeighbors, getSurfacesAt, terrainLineOfSight } from '../src/game/tacticsTerrain.js';
import { drawTerrainFace, getTerrainDrawList } from '../src/game/tacticsTerrainRenderer.js';
import { getTacticsEnvironmentProfile } from '../src/game/tacticsEnvironmentRenderer.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getExpandedStages } = await import('../src/game/expandedUniverses.js');
const { HEROES_DB } = await import('../src/game/heroes.js');
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { EngineTactics } = await import('../src/game/engineTactics.js');
const { TACTICS_BATTLEFIELDS, getTacticsBattlefield, getUniverseTacticsBattlefield } = await import('../src/game/tacticsBattlefields.js');
const { buildCustomRuntimeStage, normalizeCustomBattlePreset } = await import('../src/game/customBattle.js');
const campaign = getExpandedStages();
const stage = campaign.find(s => s.stageKey === 'iron_ashline_trenches');
const cell = (x, y) => `${field.id}:ground:${x}:${y}`;
const blocked = surface => field.obstacles.some(obstacle => obstacle.surfaceId === surface.id);
const human = { tacticsHeight: 1.6 };
const options = { unit: human, isBlocked: blocked };
const noop = () => {};

test('the exact Iron Tempest campaign and explicit/automatic custom choices launch this exclusive sector', () => {
  assert.equal(stage.universe, 'Iron Tempest'); assert.equal(stage.mode, 'Tactics');
  assert.equal(stage.objectiveType, 'control');
  assert.equal(TACTICS_BATTLEFIELDS[field.id], field);
  assert.equal(getTacticsBattlefield(stage), field);
  assert.equal(getTacticsBattlefield({ ...stage, forceBaseArena: true }).id, 'training_grid');
  assert.equal(getUniverseTacticsBattlefield({ ...stage, stageKey: 'unrelated', contentStageId: null }), null);
  assert.equal(getUniverseTacticsBattlefield({ ...stage, universe: 'Other original world' }), null);
  for (const selected of ['auto', field.id]) {
    const preset = normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: selected });
    const runtime = buildCustomRuntimeStage({ preset, archive: { ...stage, image: '/other-engine.png' }, enemyData: {} });
    assert.equal(runtime.universe, 'Iron Tempest'); assert.equal(runtime.tacticsBattlefieldId, field.id);
    assert.equal(runtime.image, null); assert.equal(getTacticsBattlefield(runtime), field);
    for (const mode of ['RPG', 'Smash', 'Fighter']) {
      const other = buildCustomRuntimeStage({ preset: { ...preset, mode }, archive: { ...stage, image: '/other-engine.png' }, enemyData: {} });
      assert.equal(other.tacticsBattlefieldId, null); assert.equal(other.image, '/other-engine.png');
      assert.equal(getTacticsEnvironmentProfile(field, mode), null);
    }
  }
  const environment = getTacticsEnvironmentProfile(field);
  assert.equal(environment.biome, 'iron-ashline'); assert.equal(environment.sourceSpecific, true);
  assert.equal(environment.usesSharedBackdrop, false);
});

test('three radio levels, every pickup and independent 2x2 boss volumes have physical access', () => {
  const terrain = normalizeTacticsTerrain(field), occupied = new Set();
  assert.deepEqual(field.tiles.map(t => t.z).sort((a, b) => a - b), [-1, 0, 2]);
  for (const [unit, spawns] of [[human, [...field.heroSpawns, ...field.monsterSpawns]],
    [{ tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 } }, [...field.bossSpawns, field.worldBossSpawn]]]) {
    for (const spawn of spawns) {
      assert.equal(canOccupyTerrainSurface(terrain, spawn, { ...options, unit }), true, spawn.surfaceId);
      for (const support of getTerrainUnitFootprint(terrain, spawn, unit)) {
        assert.equal(occupied.has(support.id), false, support.id); occupied.add(support.id);
      }
    }
  }
  for (const target of [...field.tiles, ...field.pickupSpawns]) {
    assert.equal(occupied.has(target.surfaceId), false, target.surfaceId);
    for (const spawn of field.heroSpawns) assert.ok(findTerrainPath(terrain, spawn, target, options), target.surfaceId);
  }
  assert.equal(field.links, undefined, 'no fabricated teleport/climb bypass');
});

test('the supply crossing saves six AP, while either real ascent can independently reach the ridge radio', () => {
  const terrain = normalizeTacticsTerrain(field);
  const fast = findTerrainPath(terrain, cell(0, 4), cell(11, 4), options);
  const around = findTerrainPath(terrain, cell(0, 4), cell(11, 4), { ...options,
    isBlocked: surface => blocked(surface) || surface.layerId === 'crossing' });
  assert.equal(fast.cost, 13); assert.equal(around.cost, 19);
  assert.ok(fast.path.some(id => id.includes(':crossing:')));
  for (const [closed, open] of [[cell(5, 2), cell(12, 4)], [cell(12, 4), cell(5, 2)]]) {
    const opt = { ...options, isBlocked: s => blocked(s) || s.id === closed };
    const route = findTerrainPath(terrain, field.heroSpawns[0], cell(10, 1), opt);
    assert.ok(route.path.includes(open)); assert.ok(findTerrainPath(terrain, cell(10, 1), field.heroSpawns[0], opt));
  }
  assert.equal(terrain.byId.get(cell(4, 5)).moveCost, 2);
  assert.equal(terrain.byId.get(cell(4, 8)).moveCost, 1);
});

test('the bridge does not teleport a lower unit upward and its true underside restricts tall units and sight', () => {
  const terrain = normalizeTacticsTerrain(field);
  const [floor, deck] = getSurfacesAt(terrain, 4, 4);
  assert.deepEqual([floor.z, deck.z, deck.solidBottom], [-1, 1, 0.75]);
  assert.equal(canOccupyTerrainSurface(terrain, floor, options), true);
  assert.equal(canOccupyTerrainSurface(terrain, floor, { ...options, unit: { tacticsHeight: 3 } }), false);
  assert.equal(getTerrainNeighbors(terrain, floor, options).some(n => n.surfaceId === deck.id), false);
  assert.equal(getTerrainNeighbors(terrain, cell(6, 1), options).some(n => n.surfaceId === cell(7, 1)), false);
  assert.equal(terrainLineOfSight(terrain, floor, deck), false);
  assert.equal(terrainLineOfSight(terrain, cell(5, 5), cell(10, 1), { obstacles: field.obstacles }), false);
});

const record = () => {
  const calls = [], values = { lineWidth: 1 };
  return new Proxy(values, {
    get: (target, key) => key === 'calls' ? calls : key in target ? target[key] : (...args) => {
      args.filter(a => typeof a === 'number').forEach(a => assert.ok(Number.isFinite(a)));
      calls.push([key, ...args]);
    },
    set: (target, key, value) => { if (typeof value === 'number') assert.ok(Number.isFinite(value)); target[key] = value; calls.push(['set', key, value]); return true; }
  });
};
test('all five materials render actual finite and distinct texture geometry without changing terrain', () => {
  const before = structuredClone(field), terrain = normalizeTacticsTerrain(field);
  const traces = new Set();
  for (const id of new Set(field.surfaces.map(s => s.materialId))) {
    const s = field.surfaces.find(s => s.materialId === id);
    assert.ok(TACTICS_ORIGINAL_MATERIALS[id]); assert.ok(s.materialLabel.fr && s.materialLabel.en);
    const face = getTerrainDrawList({ vertical: true, surfaces: [s] }, {
      project: (x, y, z) => ({ x: 200 + (x - y) * 30, y: 100 + (x + y) * 15 - z * 28 })
    }).find(face => face.kind === 'top');
    const ctx = record(); drawTerrainFace(ctx, face, { animTime: 0 });
    assert.ok(ctx.calls.filter(call => call[0] === 'lineTo').length >= 10, id);
    traces.add(JSON.stringify(ctx.calls));
  }
  assert.equal(traces.size, 5); assert.ok(terrain.surfaces.length > field.cols * field.rows);
  assert.deepEqual(field, before);
});

test('real campaign turns pay movement AP, pause the traversal and score six radio transmissions exactly once', () => {
  const hero = HEROES_DB.find(h => h.id === 'mara_veylan');
  const threat = ENEMIES_DB[stage.universe].bosses.find(unit => unit.id === stage.bossId);
  assert.ok(hero && threat); const outcomes = [];
  const engine = new EngineTactics(1040, 560, [hero], { monsters: [threat], bosses: [], customRoster: [threat] },
    { add: noop }, noop, result => outcomes.push(result), { ...stage, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  const actor = engine.heroes[0], goal = cell(5, 5); let moves = 0, pauseObserved = false;
  try {
    assert.equal(engine.battlefield, field); assert.equal(engine.sourceTacticsSector, true);
    assert.match(engine.getObjectiveText('en'), /six transmissions/);
    for (let turn = 0; turn < 80 && !engine.gameOver; turn++) {
      if (engine.activeUnit === actor && actor.surfaceId !== goal) {
        const route = engine.getReachableCells(actor, Infinity).find(entry => entry.surfaceId === goal);
        assert.ok(route?.path.length > 1);
        const reachable = new Map(engine.movementRange.map(entry => [entry.surfaceId, entry]));
        const destination = route.path.slice(1).reverse().map(id => reachable.get(id)).find(Boolean);
        assert.ok(destination); const spent = engine.movementSpent;
        assert.equal(engine.handleSurfaceClick(destination.surfaceId).handled, true);
        assert.equal(engine.movementSpent, spent + destination.cost);
        if (!pauseObserved && actor.terrainMotion) {
          engine.setPaused(true); const motion = actor.terrainMotion, snapshot = JSON.stringify(motion), serial = engine.turnSerial;
          for (let tick = 0; tick < 40; tick++) engine.update();
          assert.equal(actor.terrainMotion, motion); assert.equal(JSON.stringify(actor.terrainMotion), snapshot); assert.equal(engine.turnSerial, serial);
          engine.setPaused(false); pauseObserved = true;
        }
        for (let tick = 0; tick < 180 && actor.terrainMotion; tick++) engine.update();
        assert.equal(actor.surfaceId, destination.surfaceId); moves++;
      }
      const before = engine.objectiveProgress;
      engine.updateTacticsObjective(); engine.updateTacticsObjective();
      assert.equal(engine.objectiveProgress, before, 'refreshing cannot farm a radio');
      const serial = engine.turnSerial; engine.endActiveTurn();
      for (let tick = 0; tick < 180 && engine.turnSerial === serial && !engine.gameOver; tick++) engine.update();
      assert.ok(engine.turnSerial > serial || engine.gameOver);
    }
    assert.ok(moves >= 2 && pauseObserved); assert.equal(actor.gridZ, -1);
    assert.equal(engine.objectiveProgress, 6); assert.equal(engine.battleResult, 'victory');
    for (let tick = 0; tick < 240; tick++) engine.update();
    assert.deepEqual(outcomes, ['victory']);
  } finally { engine.dispose(); }
});
