import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { TACTICS_ORIGINAL_BATTLEFIELDS } from '../src/game/tacticsOriginalBattlefields.js';
import { TACTICS_ORIGINAL_MATERIALS } from '../src/game/tacticsOriginalPresentation.js';
import { getTacticsEnvironmentProfile, drawTacticsScenery } from '../src/game/tacticsEnvironmentRenderer.js';
import { LANTERN_SHIP_ID } from '../src/game/tacticsCrownlessSea.js';
import { canOccupyTerrainSurface, findTerrainPath, getTerrainUnitFootprint, getSurfacesAt,
  normalizeTacticsTerrain, terrainLineOfSight } from '../src/game/tacticsTerrain.js';
import { drawTerrainFace, getTerrainDrawList } from '../src/game/tacticsTerrainRenderer.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getExpandedStages } = await import('../src/game/expandedUniverses.js');
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { HEROES_DB } = await import('../src/game/heroes.js');
const { EngineTactics } = await import('../src/game/engineTactics.js');
const { getTacticsBattlefield, getUniverseTacticsBattlefield } = await import('../src/game/tacticsBattlefields.js');
const { buildCustomRuntimeStage, normalizeCustomBattlePreset } = await import('../src/game/customBattle.js');
const { getTacticsEscortBriefing } = await import('../src/game/tacticsEscort.js');

const field = TACTICS_ORIGINAL_BATTLEFIELDS.crownless_dead_calm_graveyard_tactics;
const instance = normalizeTacticsTerrain(field);
const stage = getExpandedStages().find(item => item.stageKey === field.source.stageKey);
const ground = (x, y) => `${field.id}:ground:${x}:${y}`;
const channel = x => `${field.id}:channel:${x}:4`;
const deck = x => `${field.id}:wreck-deck:${x}:4`;
const foot = { tacticsHeight: 1.6 };
const giant = { tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 } };
const playerOptions = { unit: foot,
  isBlocked: surface => surface.layerId === 'channel' || field.obstacles.some(item => item.surfaceId === surface.id) };
const noop = () => {};

function startBoard() {
  const hero = HEROES_DB.find(item => item.id === 'ysara_flint');
  const enemy = ENEMIES_DB[stage.universe].bosses.find(item => item.id === stage.bossId);
  assert.ok(hero && enemy);
  const outcomes = [];
  const engine = new EngineTactics(1040, 560, [hero], { monsters: [enemy], bosses: [], customRoster: [enemy] },
    { add: noop }, noop, result => outcomes.push(result), {
      ...stage, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  return { engine, actor: engine.heroes[0], ship: engine.escortUnit, outcomes };
}

function recordCanvas() {
  const calls = [];
  const ctx = new Proxy({ lineWidth: 1 }, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        assert.ok(args.filter(value => typeof value === 'number').every(Number.isFinite));
        calls.push([key, ...args]);
      };
    },
    set(target, key, value) { target[key] = value; calls.push([key, value]); return true; }
  });
  return { ctx, calls };
}

test('the original escort campaign and Custom routes use the graveyard only in Tactics', () => {
  assert.equal(stage.universe, 'The Crownless Sea');
  assert.equal(stage.objectiveType, 'escort');
  assert.equal(getTacticsBattlefield(stage), field);
  assert.equal(getTacticsBattlefield({ ...stage, dlcSuppressedArena: true }).id, 'training_grid');
  assert.equal(getUniverseTacticsBattlefield({ ...stage, stageKey: 'unrelated', contentStageId: null }), null);
  const archive = { ...stage, image: '/another-engine.png' };
  for (const id of ['auto', field.id]) {
    const preset = normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: id });
    const selected = buildCustomRuntimeStage({ preset, archive, enemyData: {} });
    assert.equal(getTacticsBattlefield(selected), field);
    assert.equal(selected.image, null);
    for (const mode of ['Fighter', 'RPG', 'Smash']) {
      const other = buildCustomRuntimeStage({ preset: { ...preset, mode }, archive, enemyData: {} });
      assert.equal(other.tacticsBattlefieldId, null);
      assert.equal(other.image, archive.image);
      assert.equal(getTacticsEnvironmentProfile(field, mode), null);
    }
  }
  assert.equal(getTacticsEnvironmentProfile(field).usesSharedBackdrop, false);
  assert.match(getTacticsEscortBriefing(stage, 'en', field.escort), /Lantern ship.*Original mission vessel/);
});

test('the high wreck crosses the channel on three distinct supports and the shore remains traversable', () => {
  assert.equal(instance.surfaces.length, 126);
  for (const x of [5, 6, 7]) {
    const [water, wood] = getSurfacesAt(instance, x, 4);
    assert.deepEqual([water.id, wood.id], [channel(x), deck(x)]);
    assert.ok(Math.abs(wood.solidBottom - water.z - 2.72) < 1e-9);
    assert.equal(terrainLineOfSight(instance, water, wood), false);
    assert.equal(canOccupyTerrainSurface(instance, wood, playerOptions), true);
  }
  const occupied = new Set();
  for (const [unit, spawns] of [[foot, [...field.heroSpawns, ...field.monsterSpawns]], [giant, [...field.bossSpawns, field.worldBossSpawn]]]) {
    for (const spawn of spawns) {
      assert.ok(canOccupyTerrainSurface(instance, spawn, { ...playerOptions, unit }), spawn.surfaceId);
      for (const support of getTerrainUnitFootprint(instance, spawn, unit)) {
        assert.ok(!occupied.has(support.id), support.id);
        occupied.add(support.id);
      }
    }
  }
  for (const pickup of field.pickupSpawns) {
    assert.ok(!occupied.has(pickup.surfaceId), pickup.surfaceId);
    for (const spawn of field.heroSpawns) assert.ok(findTerrainPath(instance, spawn, pickup, playerOptions), pickup.surfaceId);
  }
  for (const surface of instance.surfaces.filter(surface => !playerOptions.isBlocked(surface))) {
    assert.ok(findTerrainPath(instance, field.heroSpawns[0], surface, playerOptions), surface.id);
  }
  const crossing = findTerrainPath(instance, ground(6, 7), ground(6, 1), playerOptions);
  assert.ok(crossing.path.some(id => [5, 6, 7].some(x => id === deck(x))));
  assert.equal(crossing.path.filter(id => instance.byId.get(id).shape === 'stairs').length, 2);
  assert.equal(instance.byId.get(ground(7, 5)).moveCost, 2);
  assert.equal(instance.byId.get(ground(6, 5)).moveCost, 1);
});

test('the six materials and wreck covers are drawn on their addressed surfaces', () => {
  const examples = new Map(instance.surfaces.map(surface => [surface.materialId, surface]));
  assert.equal(examples.size, 6);
  const traces = new Set();
  for (const [id, surface] of examples) {
    assert.ok(surface.materialLabel.fr && surface.materialLabel.en);
    assert.ok(TACTICS_ORIGINAL_MATERIALS[id]);
    const face = getTerrainDrawList({ vertical: true, surfaces: [surface] }, {
      project: (x, y, z) => ({ x: 150 + (x - y) * 20, y: 80 + (x + y) * 10 - z * 20 })
    }).find(item => item.kind === 'top');
    const { ctx, calls } = recordCanvas();
    drawTerrainFace(ctx, face);
    assert.ok(calls.filter(call => call[0] === 'lineTo').length >= 6, id);
    traces.add(JSON.stringify(calls));
  }
  assert.equal(traces.size, 6);
  for (const obstacle of field.obstacles) {
    const { ctx, calls } = recordCanvas();
    assert.equal(drawTacticsScenery(ctx, { obstacle, point: { x: 10, y: 20 }, width: 22, height: 30 }), true);
    assert.ok(calls.filter(call => call[0] === 'lineTo').length >= 6);
  }
});

test('the live boat stays in the chenal and a hero on the upper support cannot tow it', () => {
  const { engine, actor, ship } = startBoard();
  try {
    assert.equal(ship.runtimeId, LANTERN_SHIP_ID);
    assert.equal(engine.escortIdentity.provisional, false);
    assert.equal(engine.escortIdentity.spritePath, null);
    const runtime = engine.verticalTerrain;
    const route = runtime.getEscortRoute(ship, runtime.pathOptions(ship));
    assert.deepEqual(route.path, Array.from({ length: 11 }, (_, index) => channel(index + 1)));
    assert.equal(engine.getReachableCells(actor, Infinity).some(cell => cell.surfaceId.includes(':channel:')), false);
    assert.equal(runtime.move(actor, channel(2)), false);
    assert.equal(runtime.move(ship, ground(1, 5)), false);

    const setSupport = (unit, id) => {
      const surface = runtime.surface(id);
      Object.assign(unit, { gridX: surface.x, gridY: surface.y, gridZ: surface.z, surfaceId: id });
    };
    setSupport(ship, channel(6));
    setSupport(actor, deck(6));
    engine.advanceEscortUnit();
    assert.equal(ship.surfaceId, channel(6));
    assert.equal(ship.terrainMotion, undefined);
    setSupport(actor, ground(6, 5));
    engine.advanceEscortUnit();
    assert.equal(ship.surfaceId, channel(7));
    assert.ok(ship.terrainMotion);
    assert.equal(ship.terrainRenderPosition.surfaceId, channel(6));
    const { ctx, calls } = recordCanvas();
    engine.drawTacticsUnit(ctx, { unit: ship, type: 'escort' }, 0);
    assert.ok(calls.some(call => call[0] === 'fillStyle' && call[1] === '#ffc774'));
    assert.equal(calls.some(call => call[0] === 'drawImage'), false);
  } finally { engine.dispose(); }
});

test('real move and End Turn commands tow all the way to the exit and win on visible arrival', () => {
  const { engine, actor, ship, outcomes } = startBoard();
  let paid = 0, heldInPause = false, reservedExit = false;
  const track = new Set([ship.surfaceId]);
  try {
    for (let turn = 0; turn < 60 && !engine.gameOver; turn++) {
      if (engine.activeUnit === actor && actor.gridX !== ship.gridX) {
        const target = ground(ship.gridX, 5);
        const available = engine.movementRange.find(cell => cell.surfaceId === target);
        assert.ok(available, target);
        assert.equal(engine.handleSurfaceClick(target).handled, true);
        assert.equal(engine.movementSpent, available.cost);
        paid += available.cost;
        for (let tick = 0; tick < 90 && actor.terrainMotion; tick++) engine.update();
        assert.equal(actor.surfaceId, target);
        assert.equal(actor.terrainMotion, undefined);
      }
      const serial = engine.turnSerial;
      engine.endActiveTurn();
      if (ship.terrainMotion && !heldInPause) {
        engine.setPaused(true);
        const motion = JSON.stringify(ship.terrainMotion);
        for (let tick = 0; tick < 25; tick++) engine.update();
        assert.equal(JSON.stringify(ship.terrainMotion), motion);
        assert.equal(engine.turnSerial, serial);
        engine.setPaused(false);
        heldInPause = true;
      }
      if (ship.terrainMotion && ship.surfaceId === channel(11)) {
        engine.updateTacticsObjective();
        assert.equal(engine.objectiveProgress, 0);
        assert.equal(engine.gameOver, false);
        reservedExit = true;
      }
      for (let tick = 0; tick < 160 && engine.turnSerial === serial && !engine.gameOver; tick++) engine.update();
      assert.ok(engine.turnSerial > serial || engine.gameOver);
      track.add(ship.surfaceId);
    }
    assert.equal(paid, 11);
    assert.equal(heldInPause && reservedExit, true);
    assert.deepEqual([...track], Array.from({ length: 11 }, (_, index) => channel(index + 1)));
    assert.equal(ship.extracted, true);
    assert.equal(ship.gridZ, -1);
    assert.equal(engine.objectiveProgress, 1);
    assert.equal(engine.battleResult, 'victory');
    for (let tick = 0; tick < 300; tick++) engine.update();
    assert.deepEqual(outcomes, ['victory']);
  } finally { engine.dispose(); }
});

test('allied AI can follow the towpath once the escort is alone with the crew', () => {
  const { engine, actor, ship } = startBoard();
  try {
    engine.enemies[0].currentHp = 0;
    const spareDock = instance.byId.get(ground(0, 7));
    Object.assign(actor, { gridX: spareDock.x, gridY: spareDock.y, gridZ: spareDock.z, surfaceId: spareDock.id });
    engine.autoBattle = true;
    engine.startTurn();
    for (let tick = 0; tick < 500 && ship.gridX < 3; tick++) engine.update();
    assert.ok(ship.gridX >= 3);
    assert.equal(actor.gridZ, -1);
    assert.equal(instance.byId.get(actor.surfaceId).layerId, 'ground');
    assert.equal(engine.gameOver, false);
  } finally { engine.dispose(); }
});
