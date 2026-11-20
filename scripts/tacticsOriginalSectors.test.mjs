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
const { getTacticsEscortBriefing } = await import('../src/game/tacticsEscort.js');
const { getHeroSpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout } = await import('../src/game/spriteAssets.js');

const observatory = TACTICS_ORIGINAL_BATTLEFIELDS.drowned_observatory_angles_tactics;
const crossroads = TACTICS_ORIGINAL_BATTLEFIELDS.valedor_free_city_crossroads_tactics;
const cliffs = TACTICS_ORIGINAL_BATTLEFIELDS.tawantinsuyu_qhapaq_nan_tactics;
const auditors = TACTICS_ORIGINAL_BATTLEFIELDS.infernum_pit_of_auditors_tactics;
const campaign = getExpandedStages();
const campaignStage = field => campaign.find(stage => stage.stageKey === field.source.stageKey);
const terrainOptions = field => ({ isBlocked: surface => field.obstacles.some(o => o.surfaceId === surface.id) });
const armyOptions = { tacticsFootprint: { width: 2, height: 2 }, tacticsHeight: 3 };
const noop = () => {};

for (const field of [observatory, crossroads, cliffs, auditors]) {
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

function playField(field, heroId, { disableHazards = false } = {}) {
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
    { ...stage, disableHazards, customBattle: { singleRoster: true, opponentControl: 'p2' } }, event => arrivals.push(event));
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

test('the cliff route uses three paired switchbacks and the witness briefing uses the same local proof', () => {
  const terrain = normalizeTacticsTerrain(cliffs);
  for (const goal of cliffs.extractionZone) {
    const route = findTerrainPath(terrain, cliffs.escortSpawn, goal, terrainOptions(cliffs));
    const inclines = route.path.map(id => terrain.byId.get(id)).filter(surface => surface.shape !== 'flat');
    assert.deepEqual(inclines.map(surface => surface.x), [3, 6, 9]);
    assert.ok(inclines[0].y > inclines[1].y && inclines[1].y < inclines[2].y);
    assert.deepEqual(inclines.map(surface => surface.shape), ['ramp', 'stairs', 'ramp']);
  }
  assert.match(getTacticsEscortBriefing(campaignStage(cliffs), 'en', cliffs.escort), /Khipu witness .*memory khipu.*Original mission character/);
});

test('three ledgers occupy three heights, and the basalt channel is isolated from the catwalk', () => {
  const terrain = normalizeTacticsTerrain(auditors);
  const ledgers = auditors.obstacles.filter(item => item.type === 'objective');
  assert.deepEqual(ledgers.map(item => item.z), [2.5, -1.25, 0]);
  const [below, above] = getSurfacesAt(terrain, 6, 4);
  assert.equal(below.id, ledgers[1].surfaceId);
  assert.equal(terrainLineOfSight(terrain, below, above), false);
  const crossing = terrain.byId.get(`${auditors.id}:ground:5:7`);
  const lava = getSurfacesAt(terrain, 5, 4)[0];
  assert.equal(lava.materialId, 'infernum-lava');
  assert.equal(lava.walkable, false);
  assert.equal(canOccupyTerrainSurface(terrain, crossing), true);
  assert.equal(crossing.moveCost, 2);
  assert.equal(crossing.type, 'hazard');
  for (const ledger of ledgers) {
    const approaches = getTerrainNeighbors(terrain, ledger.surfaceId, terrainOptions(auditors));
    assert.ok(approaches.some(approach => findTerrainPath(terrain, auditors.heroSpawns[0], approach.surfaceId, terrainOptions(auditors))));
  }
});

test('the witness climbs all three cliffs alongside the squad and completes extraction only on arrival', () => {
  const { engine, actor, outcomes } = playField(cliffs, 'killa_mayu', { disableHazards: true });
  try {
    const escort = engine.escortUnit;
    assert.equal(escort.runtimeId, cliffs.escort.id);
    assert.equal(engine.escortIdentity.provisional, false);
    assert.equal(engine.escortIdentity.sourceHeroId, 'tactics_khipu_witness');
    const sprite = getHeroSpriteSheetSrc(escort, 'tactics');
    assert.match(sprite, /\/khipu-witness\.png$/);
    assert.equal(sprite, engine.escortIdentity.spritePath);
    const layout = getSpriteSheetLayout(sprite);
    assert.equal(layout.baseline, 240);
    assert.deepEqual(['idle', 'run', 'hit', 'extract'].map(state => getSpriteFrameForLayout(state, 10, layout).row), [0, 1, 2, 3]);
    const traveled = new Set([escort.surfaceId]);
    let sawExtractionReserved = false;
    for (let turn = 0; turn < 90 && !engine.gameOver; turn++) {
      if (engine.activeUnit === actor) {
        const route = cliffs.extractionZone.map(goal => findTerrainPath(engine.terrain, escort, goal, terrainOptions(cliffs)))
          .sort((a, b) => a.cost - b.cost)[0];
        const steps = new Set(getTerrainNeighbors(engine.terrain, escort, { unit: escort }).map(next => next.surfaceId));
        const following = [...engine.movementRange].filter(ref => steps.has(ref.surfaceId) && ref.surfaceId !== route.path[1]);
        const destination = following.find(ref => traveled.has(ref.surfaceId) && ref.surfaceId !== actor.surfaceId) || following[0];
        assert.ok(destination, `follow witness at ${escort.surfaceId}`);
        if (destination.surfaceId !== actor.surfaceId) advanceToward(engine, actor, destination.surfaceId);
      }
      const serial = engine.turnSerial;
      engine.endActiveTurn();
      if (escort.terrainMotion && cliffs.extractionZone.some(zone => zone.surfaceId === escort.surfaceId)) {
        sawExtractionReserved = true;
        assert.equal(engine.objectiveProgress, 0);
        engine.updateTacticsObjective();
        assert.equal(engine.gameOver, false);
      }
      for (let tick = 0; tick < 160 && serial === engine.turnSerial && !engine.gameOver; tick++) engine.update();
      traveled.add(escort.surfaceId);
    }
    assert.ok(sawExtractionReserved);
    assert.equal(escort.gridZ, 3.5);
    assert.equal(engine.objectiveProgress, 1);
    assert.equal(escort.extracted, true);
    assert.equal(escort.state, 'extract');
    assert.deepEqual([0, 1, 2.5, 3.5], [...new Set([...traveled].map(id => engine.terrain.byId.get(id).z))]
      .filter(z => [0, 1, 2.5, 3.5].includes(z)));
    assertVictoryOnce(engine, outcomes);
  } finally {
    engine.dispose();
  }
});

function attackPosition(engine, actor, ledger, action) {
  const profile = engine.getAttackProfile(actor, action);
  return engine.getReachableCells(actor, Infinity).find(ref => engine.canAttackCell({
    ...actor, gridX: ref.x, gridY: ref.y, gridZ: ref.z, surfaceId: ref.surfaceId
  }, ledger, profile));
}

test('the three ledgers break through ordinary move and attack commands before closing', () => {
  const { engine, actor, outcomes } = playField(auditors, 'mercy_ash', { disableHazards: true });
  try {
    const ledgers = engine.obstacles.filter(item => item.type === 'objective');
    const damagedHeights = new Set();
    for (let turn = 0; turn < 90 && !engine.gameOver; turn++) {
      if (engine.activeUnit !== actor) { runTurn(engine); continue; }
      const [ledger] = ledgers.filter(item => item.hp > 0);
      const shot = attackPosition(engine, actor, ledger, 'simple');
      assert.ok(shot, ledger.name);
      if (shot.surfaceId === actor.surfaceId) assert.equal(engine.handleSurfaceClick(actor.surfaceId).handled, true);
      else advanceToward(engine, actor, shot.surfaceId);
      if (engine.canAttackCell(actor, ledger, engine.getAttackProfile(actor, 'simple'))) {
        const hp = ledger.hp;
        const serial = engine.turnSerial;
        assert.equal(engine.handleSurfaceClick(ledger.surfaceId).handled, true);
        assert.ok(ledger.hp < hp, ledger.name);
        damagedHeights.add(engine.terrain.byId.get(ledger.surfaceId).z);
        for (let tick = 0; tick < 160 && serial === engine.turnSerial && !engine.gameOver; tick++) engine.update();
      } else runTurn(engine);
    }
    assert.deepEqual([...damagedHeights], [2.5, -1.25, 0]);
    assert.equal(engine.objectiveProgress, 3);
    assert.ok(engine.alliedTurnsElapsed < auditors.objectiveTurnLimit);
    assertVictoryOnce(engine, outcomes);
  } finally {
    engine.dispose();
  }
});

test('Infernum closing counts completed allied turns, leaves time during enemy turns, and ends once', () => {
  const { engine, outcomes } = playField(auditors, 'mercy_ash', { disableHazards: true });
  try {
    assert.match(engine.getObjectiveText('en'), new RegExp(`Closing in ${auditors.objectiveTurnLimit} allied turns`));
    let enemyTurns = 0;
    for (let turn = 0; turn < 90 && !engine.gameOver; turn++) {
      const before = engine.alliedTurnsElapsed, hero = engine.activeUnitType === 'hero';
      engine.updateTacticsObjective();
      assert.equal(engine.alliedTurnsElapsed, before);
      runTurn(engine);
      if (!hero) enemyTurns++;
      assert.equal(engine.alliedTurnsElapsed, before + (hero ? 1 : 0));
    }
    assert.ok(enemyTurns > 0);
    assert.equal(engine.alliedTurnsElapsed, auditors.objectiveTurnLimit);
    assert.equal(engine.objectiveProgress, 0);
    assert.match(engine.getObjectiveText(), /Clôture dans 0 tours alliés/);
    assert.equal(engine.battleResult, 'defeat');
    for (let tick = 0; tick < 300; tick++) engine.update();
    assert.deepEqual(outcomes, ['defeat']);
  } finally {
    engine.dispose();
  }
});

test('the vertical Auto turn can strike a reachable live ledger', () => {
  const { engine, actor } = playField(auditors, 'mercy_ash', { disableHazards: true });
  try {
    const ledger = engine.obstacles.find(item => item.type === 'objective');
    for (let turn = 0; turn < 15 && !engine.gameOver; turn++) {
      if (engine.activeUnit !== actor) { runTurn(engine); continue; }
      const shot = attackPosition(engine, actor, ledger, 'simple');
      assert.ok(shot);
      if (shot.surfaceId === actor.surfaceId) assert.equal(engine.handleSurfaceClick(actor.surfaceId).handled, true);
      else advanceToward(engine, actor, shot.surfaceId);
      if (!engine.canAttackCell(actor, ledger, engine.getAttackProfile(actor, 'simple'))) {
        runTurn(engine);
        continue;
      }
      const before = ledger.hp;
      engine.runHeroAI();
      for (let tick = 0; tick < 120 && actor.terrainMotion; tick++) engine.update();
      assert.ok(ledger.hp < before, 'Auto selected the physical ledger as an attack target');
      return;
    }
    assert.fail('Mercy reached a normal attack position');
  } finally {
    engine.dispose();
  }
});

test('the vertical Auto escort continues up the cliffs when the last hostile is defeated', () => {
  const { engine, outcomes } = playField(cliffs, 'killa_mayu', { disableHazards: true });
  try {
    for (const enemy of engine.enemies) enemy.currentHp = 0;
    for (let turn = 0; turn < 45 && !engine.gameOver; turn++) {
      const serial = engine.turnSerial;
      if (engine.activeUnitType === 'hero') engine.runHeroAI();
      else engine.endActiveTurn();
      for (let tick = 0; tick < 160 && serial === engine.turnSerial && !engine.gameOver; tick++) engine.update();
    }
    assert.equal(engine.escortUnit.extracted, true, engine.escortUnit.surfaceId);
    assertVictoryOnce(engine, outcomes);
  } finally {
    engine.dispose();
  }
});

test('an intervening 2×2 boss in the Free City blocks a shot through its second row', () => {
  const stage = campaignStage(crossroads);
  const hero = HEROES_DB.find(unit => unit.id === 'aelwen_starbough');
  const template = { ...hero, tacticsAttacks: { ...hero.tacticsAttacks,
    simple: { range: 8, shape: 'single', blocksOnUnits: true } } };
  const roster = [ENEMIES_DB[stage.universe].monsters[0], ENEMIES_DB.Prometheus.worldBoss];
  const engine = new EngineTactics(1040, 560, [template],
    { monsters: roster, bosses: [], customRoster: roster }, { add: noop }, noop, noop,
    { ...stage, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  try {
    const [archer] = engine.heroes;
    const [target, boss] = engine.enemies;
    const support = (x, y) => engine.terrain.byId.get(`${crossroads.id}:ground:${x}:${y}`);
    for (const [unit, x, y] of [[archer, 0, 7], [boss, 2, 6], [target, 6, 7]]) {
      const tile = support(x, y);
      Object.assign(unit, { gridX: x, gridY: y, gridZ: tile.z, surfaceId: tile.id });
    }
    const secondRow = support(2, 7);
    assert.deepEqual([boss.tacticsFootprint.width, boss.tacticsFootprint.height], [2, 2]);
    assert.equal(engine.unitOccupiesCell(boss, 2, 7, secondRow.id), true);
    const profile = engine.getAttackProfile(archer, 'simple');
    assert.equal(profile.blocksOnUnits, true);
    assert.equal(engine.canAttackCell(archer, target, profile), false);
    assert.equal(engine.canAttackCell(archer, target, { ...profile, pierceUnits: true }), true);

    if (engine.activeUnit !== archer) runTurn(engine);
    assert.equal(engine.activeUnit, archer);
    engine.calculateMovementRange();
    assert.equal(engine.handleSurfaceClick(archer.surfaceId).handled, true);
    const targetHp = target.currentHp, bossHp = boss.currentHp;
    assert.equal(engine.handleSurfaceClick(target.surfaceId).handled, false);
    assert.equal(target.currentHp, targetHp);
    assert.equal(engine.handleSurfaceClick(secondRow.id).handled, true);
    assert.ok(boss.currentHp < bossHp);
  } finally {
    engine.dispose();
  }
});
