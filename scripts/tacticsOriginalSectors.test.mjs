import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { TACTICS_ORIGINAL_BATTLEFIELDS } from '../src/game/tacticsOriginalBattlefields.js';
import { TACTICS_ORIGINAL_MATERIALS } from '../src/game/tacticsOriginalPresentation.js';
import { getTacticsEnvironmentProfile } from '../src/game/tacticsEnvironmentRenderer.js';
import {
  canOccupyTerrainSurface, findTerrainPath, getSurfacesAt, getTerrainNeighbors,
  getTerrainUnitFootprint, normalizeTacticsTerrain, terrainLineOfSight
} from '../src/game/tacticsTerrain.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getExpandedStages } = await import('../src/game/expandedUniverses.js');
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { HEROES_DB } = await import('../src/game/heroes.js');
const { EngineTactics } = await import('../src/game/engineTactics.js');
const { getTacticsBattlefield, getTacticsPickupPositions, getUniverseTacticsBattlefield } = await import('../src/game/tacticsBattlefields.js');
const { buildCustomRuntimeStage, normalizeCustomBattlePreset } = await import('../src/game/customBattle.js');

const observatory = TACTICS_ORIGINAL_BATTLEFIELDS.drowned_observatory_angles_tactics;
const crossroads = TACTICS_ORIGINAL_BATTLEFIELDS.valedor_free_city_crossroads_tactics;
const campaign = getExpandedStages();
const campaignStage = field => campaign.find(stage => stage.stageKey === field.source.stageKey);
const terrainOptions = field => ({ isBlocked: surface => field.obstacles.some(o => o.surfaceId === surface.id) });
const armyOptions = { tacticsFootprint: { width: 2, height: 2 }, tacticsHeight: 3 };
const noop = () => {};

for (const field of [observatory, crossroads]) {
  test(`${field.id} routes the real campaign and custom presets to the same exclusive topology`, () => {
    const stage = campaignStage(field);
    assert.equal(stage?.mode, 'Tactics');
    assert.equal(stage.objectiveType, field.objective);
    assert.equal(getTacticsBattlefield(stage), field);
    assert.equal(getTacticsBattlefield({ ...stage, dlcSuppressedArena: true }).id, 'training_grid');
    assert.equal(getUniverseTacticsBattlefield({ ...stage, stageKey: 'unrelated', contentStageId: null }), null);
    for (const beside of campaign.filter(item => item.universe === stage.universe && item.mode !== 'Tactics')) {
      assert.equal(getUniverseTacticsBattlefield(beside), null);
    }
    const archive = { universe: stage.universe, name: stage.name, image: '/check-other-mode.png' };
    for (const terrain of ['auto', field.id]) {
      const preset = normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: terrain });
      const selected = buildCustomRuntimeStage({ preset, archive, enemyData: {} });
      assert.equal(selected.tacticsBattlefieldId, field.id);
      assert.equal(selected.image, null);
      for (const mode of ['RPG', 'Smash', 'Fighter']) {
        const other = buildCustomRuntimeStage({ preset: { ...preset, mode }, archive, enemyData: {} });
        assert.equal(other.image, archive.image);
        assert.equal(other.tacticsBattlefieldId, null);
        assert.equal(getTacticsEnvironmentProfile(field, mode), null);
      }
    }
    const environment = getTacticsEnvironmentProfile(field);
    assert.equal(environment.sourceSpecific, true);
    assert.equal(environment.usesSharedBackdrop, false);
    assert.equal(environment.biome, field.tacticsPresentation.biome);
    assert.deepEqual(getTacticsPickupPositions(stage).map(item => item.surfaceId), field.pickupSpawns.map(ref => ref.surfaceId));
  });

  test(`${field.id} has reachable marked surfaces, floor materials and independent native spawn volumes`, () => {
    const terrain = normalizeTacticsTerrain(field);
    const opt = terrainOptions(field);
    const occupied = new Set();
    for (const [unit, spawns] of [[{}, [...field.heroSpawns, ...field.monsterSpawns]], [armyOptions, [...field.bossSpawns, field.worldBossSpawn]]]) {
      for (const spawn of spawns) {
        assert.ok(canOccupyTerrainSurface(terrain, spawn, { ...opt, unit }), spawn.surfaceId);
        for (const support of getTerrainUnitFootprint(terrain, spawn, unit)) {
          assert.ok(!occupied.has(support.id), support.id);
          occupied.add(support.id);
        }
      }
    }
    for (const target of [...field.tiles, ...field.pickupSpawns]) {
      assert.ok(!occupied.has(target.surfaceId), target.surfaceId);
      for (const spawn of field.heroSpawns) assert.ok(findTerrainPath(terrain, spawn, target, opt), target.surfaceId);
    }
    for (const surface of terrain.surfaces) {
      assert.ok(TACTICS_ORIGINAL_MATERIALS[surface.materialId], surface.id);
      assert.ok(surface.materialLabel.fr.length && surface.materialLabel.en.length);
    }
  });
}

test('the observatory links two matching pairs while stacked floors still block sight', () => {
  const field = observatory, terrain = normalizeTacticsTerrain(field), options = terrainOptions(field);
  const [lower, upper] = getSurfacesAt(terrain, 6, 4);
  assert.deepEqual([lower.z, upper.z], [-1, 2.5]);
  assert.equal(terrainLineOfSight(terrain, lower, upper), false);
  assert.equal(getTerrainNeighbors(terrain, lower, options).some(next => next.surfaceId === upper.id), false);
  for (const { from, to } of field.links) {
    assert.equal(terrain.byId.get(from).materialId, terrain.byId.get(to).materialId);
    for (const [start, end] of [[from, to], [to, from]]) {
      const passage = getTerrainNeighbors(terrain, start, options).find(edge => edge.surfaceId === end);
      assert.equal(passage?.kind, 'teleport');
      assert.equal(passage?.cost, 2);
      assert.ok(!getTerrainNeighbors(terrain, start, { ...options, isOccupied: s => s.id === end }).some(edge => edge.surfaceId === end));
    }
  }
  const staircase = findTerrainPath(terrain, field.heroSpawns[0], upper, {
    ...options, allowLink: link => link.kind !== 'teleport'
  });
  assert.ok(staircase.path.some(id => terrain.byId.get(id).shape === 'stairs'));
});

test('the Free City puts four control squares on their own supports and supplies two climbs to the garden', () => {
  const terrain = normalizeTacticsTerrain(crossroads);
  assert.deepEqual(crossroads.tiles.map(ref => ref.z).sort((a, b) => a - b), [-1, 0, 1.5, 2]);
  assert.equal(new Set(crossroads.tiles.map(ref => terrain.byId.get(ref.surfaceId).materialId)).size, 4);
  const garden = crossroads.tiles.find(ref => ref.z === 1.5);
  const northRamp = terrain.surfaces.find(s => s.x === 2 && s.y === 4);
  const westStairs = terrain.surfaces.find(s => s.x === 5 && s.y === 2);
  for (const [enabled, blocked] of [[northRamp, westStairs], [westStairs, northRamp]]) {
    const otherBlocking = terrainOptions(crossroads).isBlocked;
    const route = findTerrainPath(terrain, crossroads.heroSpawns[0], garden, {
      isBlocked: surface => otherBlocking(surface) || surface.id === blocked.id
    });
    assert.ok(route.path.includes(enabled.id));
    assert.equal(terrain.byId.get(enabled.id).moveCost, 2);
  }
});

test('an objective override does not report the original terrain directive', () => {
  const tactics = { objective: 'rout', battlefield: observatory };
  assert.match(EngineTactics.prototype.getObjectiveText.call(tactics, 'en'), /neutralize the hostile cell/);
});

function playField(field, heroId) {
  const stage = campaignStage(field);
  const hero = HEROES_DB.find(unit => unit.id === heroId);
  const threat = ENEMIES_DB[stage.universe].bosses.find(unit => unit.id === stage.bossId);
  assert.ok(hero && threat, stage.bossId);
  const enemies = { monsters: [threat], bosses: [], customRoster: [threat] };
  const outcomes = [], arrivals = [];
  // The real campaign stage runs with its authored boss and layout. Local
  // second-player control removes AI variance during this deterministic replay.
  const engine = new EngineTactics(1040, 560, [hero], enemies,
    { add: noop }, noop, result => outcomes.push(result),
    { ...stage, customBattle: { singleRoster: true, opponentControl: 'p2' } }, event => arrivals.push(event));
  return { engine, outcomes, arrivals, actor: engine.heroes[0] };
}

function runTurn(engine) {
  const serial = engine.turnSerial;
  engine.endActiveTurn();
  for (let tick = 0; tick < 160 && serial === engine.turnSerial && !engine.gameOver; tick++) engine.update();
  assert.ok(serial < engine.turnSerial || engine.gameOver, 'the next actor gets its real turn');
}

function advanceToward(engine, actor, goal, trackMotion = noop) {
  const route = engine.getReachableCells(actor, Infinity).find(entry => entry.surfaceId === goal);
  assert.ok(route?.path.length > 1, goal);
  const reachable = new Map(engine.movementRange.map(entry => [entry.surfaceId, entry]));
  const destination = route.path.slice(1).reverse().map(id => reachable.get(id)).find(Boolean);
  assert.ok(destination?.cost <= engine.movementBudget);
  const spent = engine.movementSpent;
  assert.equal(engine.handleSurfaceClick(destination.surfaceId).handled, true);
  assert.equal(engine.movementSpent, spent + destination.cost);
  for (let tick = 0; tick < 120 && actor.terrainMotion; tick++) {
    trackMotion(actor.terrainMotion, actor.terrainRenderPosition);
    engine.update();
  }
  assert.equal(actor.terrainMotion, undefined);
  assert.equal(actor.surfaceId, destination.surfaceId);
}

function assertVictoryOnce(engine, outcomes) {
  assert.equal(engine.battleResult, 'victory');
  for (let tick = 0; tick < 300; tick++) engine.update();
  assert.deepEqual(outcomes, ['victory']);
}

test('the Observatory spends normal AP, holds the entrance pose and collects three distinct charts on arrival', () => {
  const { engine, actor, arrivals, outcomes } = playField(observatory, 'oona_vell');
  let framesAtEntrance = 0;
  try {
    assert.match(engine.getObjectiveText('en'), /three charts/);
    const expected = [2.5, 2.5, -1];
    const goals = [observatory.tiles[1], observatory.tiles[2], observatory.tiles[0]].map(tile => tile.surfaceId);
    for (let turn = 0; turn < 100 && !engine.gameOver; turn++) {
      if (engine.activeUnit === actor) {
        advanceToward(engine, actor, goals[engine.objectiveProgress], (motion, pose) => {
          const transition = motion.transitions[motion.segment];
          if (transition.kind !== 'teleport') return;
          const origin = engine.terrain.byId.get(transition.from);
          assert.equal(transition.cost, 2);
          assert.equal(pose.surfaceId, origin.id);
          assert.deepEqual([pose.x, pose.y, pose.z], [origin.x, origin.y, origin.z]);
          framesAtEntrance++;
        });
      }
      if (!engine.gameOver) runTurn(engine);
    }
    assert.ok(framesAtEntrance >= 8);
    assert.equal(engine.objectiveProgress, 3);
    assert.deepEqual([...engine.collectedArtifactKeys], goals);
    assert.deepEqual(goals.map(id => engine.terrain.byId.get(id).z), expected);
    assert.ok(arrivals.some(event => event.surfaceId === goals[1]));
    assertVictoryOnce(engine, outcomes);
  } finally {
    engine.dispose();
  }
});

test('the Free City advances control only at turn end on its elevated garden square and completes once', () => {
  const { engine, actor, outcomes } = playField(crossroads, 'aelwen_starbough');
  try {
    assert.match(engine.getObjectiveText(), /quatre quartiers/);
    const goal = crossroads.tiles.find(ref => ref.z === 1.5).surfaceId;
    const movementHeights = [];
    for (let turn = 0; turn < 100 && !engine.gameOver; turn++) {
      if (engine.activeUnit === actor && actor.surfaceId !== goal) {
        advanceToward(engine, actor, goal, (_move, pose) => movementHeights.push(pose.z));
      }
      const before = engine.objectiveProgress;
      engine.updateTacticsObjective();
      engine.updateTacticsObjective();
      assert.equal(engine.objectiveProgress, before);
      runTurn(engine);
      assert.equal(engine.objectiveProgress, before + (actor.surfaceId === goal ? 1 : 0));
    }
    assert.equal(actor.gridZ, 1.5);
    assert.ok(movementHeights.some(z => z > 0 && z < 1.5));
    assert.equal(engine.objectiveProgress, 8);
    assertVictoryOnce(engine, outcomes);
  } finally {
    engine.dispose();
  }
});
