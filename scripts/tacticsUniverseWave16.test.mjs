import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 as fields } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS as wave14Fields } from '../src/game/tacticsUniverseBattlefields.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as wave15Fields } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_VERTICAL_BATTLEFIELDS as nexusFields } from '../src/game/tacticsVerticalBattlefields.js';
import {
  normalizeTacticsTerrain, getTerrainSurface, getTerrainNeighbors, getSurfacesAt,
  getTerrainUnitFootprint, canOccupyTerrainSurface, findTerrainPath,
  terrainLineOfSight, terrainHeightAdvantage
} from '../src/game/tacticsTerrain.js';

const human = { tacticsHeight: 1.6 };
const giant = { tacticsHeight: 3, tacticsFootprint: { width: 2, height: 2 } };
const boards = Object.values(fields);
const at = (field, x, y, layer = 'ground') => `${field.id}:${layer}:${x}:${y}`;
const occupiedByScenery = field => surface => field.obstacles.some(obstacle => obstacle.hp > 0 && obstacle.surfaceId === surface.id);
const options = (field, unit = human) => ({ unit, isOccupied: occupiedByScenery(field) });
const objectives = field => field.objective === 'extract' ? field.extractionZone
  : field.objective === 'disable' ? field.obstacles.filter(obstacle => obstacle.type === 'objective')
    : field.surfaces.filter(surface => surface.type === ({ control: 'objective', artifact: 'artifact' }[field.objective]));
const adjacent = (t, ref) => {
  const s = getTerrainSurface(t, ref);
  return t.surfaces.filter(candidate => Math.abs(candidate.x - s.x) + Math.abs(candidate.y - s.y) === 1);
};
const topology = field => createHash('sha256').update(JSON.stringify({
  cols: field.cols, rows: field.rows,
  surfaces: field.surfaces.map(({ x, y, z, cornerZ, walkable, shape }) => ({ x, y, z, cornerZ, walkable, shape }))
})).digest('hex');

test('four W16 exclusive Tactics sectors bind actual roster universes to explicit source works without certifying official plans', () => {
  assert.equal(boards.length, 4);
  const universes = new Set(HEROES_DB.map(hero => hero.universe));
  const expected = [
    ['cuphead_inkwell_tactics', 'Cuphead', '2017', 'inkwell-cartoon'],
    ['titanfall_reclamation_tactics', 'Titanfall 2', '2016', 'imc-foundry'],
    ['fma_central_station_tactics', 'Fullmetal Alchemist', '2009', 'central-railway'],
    ['wakfu_sadida_tactics', 'Wakfu', '2008', 'sadida-canopy']
  ];
  for (const [id, universe, year, biome] of expected) {
    const field = fields[id];
    assert.equal(field.modeExclusive, 'Tactics'); assert.equal(field.formatVersion, 2);
    assert.equal(field.source.universe, universe); assert.ok(universes.has(universe));
    assert.ok(field.source.work.includes(year)); assert.ok(field.source.period);
    assert.ok(field.source.location); assert.match(field.source.reference, /^https:\/\//);
    assert.equal(field.source.source1to1Verified, false); assert.equal(field.source.canonicalLayoutVerified, false);
    assert.equal(field.source.networkVerified, false); assert.match(field.source.adaptation, /original grid/);
    assert.equal(field.tacticsPresentation.biome, biome); assert.equal(field.tacticsPresentation.id, id);
    assert.ok(field.cols >= 12 && field.cols <= 16); assert.ok(field.rows >= 9 && field.rows <= 12);
    assert.equal(field.background, undefined, 'A Tactics sector must not select a painted background from another engine');
    assert.ok(Object.isFrozen(field)); assert.ok(Object.isFrozen(field.surfaces));
  }
});

test('the four W16 sector topologies differ from each other, W14, W15 and the earlier Nexus boards without relying on palette or IDs', () => {
  const signatures = boards.map(topology);
  assert.equal(new Set(signatures).size, boards.length);
  const old = new Set([...Object.values(nexusFields), ...Object.values(wave14Fields), ...Object.values(wave15Fields)].map(topology));
  assert.ok(signatures.every(signature => !old.has(signature)));
  assert.equal(new Set(boards.map(field => field.layoutId)).size, 4);
  const objectivesInUse = new Set(boards.map(field => field.objective));
  assert.deepEqual([...objectivesInUse].sort(), ['artifact', 'control', 'disable', 'extract']);
});

for (const field of boards) test(`${field.id}: source-addressed spawns, scenery, pickups and mission routes are physically valid`, () => {
  const before = JSON.stringify(field), t = normalizeTacticsTerrain(field);
  assert.equal(t.surfaces.length, field.surfaces.length); assert.equal(t.byId.size, field.surfaces.length);
  assert.equal(field.heroSpawns.length, 3); assert.equal(field.monsterSpawns.length, 3);
  assert.equal(field.bossSpawns.length, 2); assert.equal(field.pickupSpawns.length, 5);
  const spawnRefs = [...field.heroSpawns, ...field.monsterSpawns, ...field.bossSpawns, field.worldBossSpawn];
  assert.equal(new Set(spawnRefs.map(ref => ref.surfaceId)).size, spawnRefs.length);
  for (const ref of [...field.heroSpawns, ...field.monsterSpawns]) {
    assert.ok(canOccupyTerrainSurface(t, ref, options(field)), ref.surfaceId);
    assert.ok(findTerrainPath(t, field.heroSpawns[0], ref, options(field)), ref.surfaceId + ': isolated combatant');
  }
  const allSpawnCells = new Set();
  for (const [refs, unit] of [[field.heroSpawns, human], [field.monsterSpawns, human], [[...field.bossSpawns, field.worldBossSpawn], giant]]) {
    for (const ref of refs) {
      assert.ok(canOccupyTerrainSurface(t, ref, options(field, unit)), ref.surfaceId + ': insufficient footprint/headroom');
      const footprint = getTerrainUnitFootprint(t, ref, unit);
      assert.equal(footprint.length, unit === giant ? 4 : 1);
      for (const support of footprint) {
        assert.equal(allSpawnCells.has(support.id), false, support.id + ': overlapping authored spawns');
        allSpawnCells.add(support.id);
      }
    }
  }
  for (const ref of [...field.pickupSpawns, ...field.extractionZone]) {
    assert.ok(getTerrainSurface(t, ref), ref.surfaceId);
    assert.ok(canOccupyTerrainSurface(t, ref, options(field)), ref.surfaceId + ': blocked pickup/extraction');
    for (const start of field.heroSpawns) assert.ok(findTerrainPath(t, start, ref, options(field)), ref.surfaceId + ': unreachable pickup/extraction');
  }
  const targets = objectives(field); assert.ok(targets.length > 0);
  if (field.objective === 'artifact' || field.objective === 'disable') assert.equal(targets.length, field.objectiveTarget);
  for (const target of targets) {
    assert.ok(getTerrainSurface(t, target), target.surfaceId || target.id);
    for (const start of field.heroSpawns) {
      if (field.objective === 'disable') {
        const approaches = adjacent(t, target).filter(cell => canOccupyTerrainSurface(t, cell, options(field))
          && terrainLineOfSight(t, cell, target, { obstacles: field.obstacles }));
        assert.ok(approaches.some(cell => findTerrainPath(t, start, cell, options(field))), 'No legal attack position for ' + target.id);
      } else assert.ok(findTerrainPath(t, start, target, options(field)), 'No mission route to ' + (target.surfaceId || target.id));
    }
  }
  for (const obstacle of field.obstacles) {
    assert.ok(getTerrainSurface(t, obstacle)); assert.ok(obstacle.tacticsHeight > 0);
    assert.equal(allSpawnCells.has(obstacle.surfaceId), false, 'Scenery collides with an authored spawn');
  }
  assert.equal(JSON.stringify(field), before, 'Navigation/normalization must not alter authored source data');
});

test('Inkwell separates a slow ford from its artifact bridge and admits only bodies fitting beneath the planks', () => {
  const f = fields.cuphead_inkwell_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 7, 3), high = at(f, 7, 3, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 7, 3).map(s => s.z), [-.75, 1.5]);
  assert.equal(getTerrainSurface(t, low).moveCost, 2);
  assert.equal(canOccupyTerrainSurface(t, low, options(f)), true);
  assert.equal(canOccupyTerrainSurface(t, low, options(f, { tacticsHeight: 2.3 })), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(getTerrainNeighbors(t, low).some(s => s.surfaceId === high), false);
  assert.ok(findTerrainPath(t, f.heroSpawns[0], high, options(f)).path.some(id => t.byId.get(id).shape === 'ramp'));
  assert.equal(getTerrainSurface(t, low).type, 'artifact');
  assert.equal(getTerrainSurface(t, high).type, 'artifact');
});

test('World Foundry has two decks, negative-altitude maintenance access and a human-only low underpass', () => {
  const f = fields.titanfall_reclamation_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 7, 8), high = at(f, 7, 8, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 7, 8).map(s => s.z), [-1.5, 1]);
  assert.equal(canOccupyTerrainSurface(t, low, options(f)), true);
  assert.equal(canOccupyTerrainSurface(t, low, options(f, { tacticsHeight: 2.5 })), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  const path = findTerrainPath(t, f.heroSpawns[0], low, options(f));
  assert.ok(path.path.some(id => t.byId.get(id).z < 0));
  assert.deepEqual(f.obstacles.filter(o => o.type === 'objective').map(o => getTerrainSurface(t, o).z).sort(), [-1.5, 2.5]);
});

test('Central control posts share XY but keep separate floor occupancy, sight and physical rail-cutting routes', () => {
  const f = fields.fma_central_station_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 6, 6), high = at(f, 6, 6, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 6, 6).map(s => s.z), [-1, 2]);
  assert.equal(getTerrainSurface(t, low).materialId, 'central-rail');
  assert.equal(canOccupyTerrainSurface(t, low, options(f, { tacticsHeight: 3 })), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.ok(findTerrainPath(t, f.heroSpawns[0], high, options(f)).path.some(id => t.byId.get(id).shape === 'ramp'));
  assert.deepEqual(f.surfaces.filter(s => s.type === 'objective').map(s => s.z), [-1, 2]);
  assert.equal(terrainHeightAdvantage(t, high, at(f, 7, 6)).multiplier, 1.15);
});

test('Sadida extraction offers a canopy exit and a lower path while root slopes route around the flooded hollow', () => {
  const f = fields.wakfu_sadida_tactics, t = normalizeTacticsTerrain(f);
  assert.deepEqual(f.extractionZone.map(ref => getTerrainSurface(t, ref).z), [3, 0]);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 6), options(f)), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 6, 'bridge'), options(f)), true);
  const high = findTerrainPath(t, f.heroSpawns[0], f.extractionZone[0], options(f));
  assert.ok(high.path.some(id => t.byId.get(id).materialId === 'sadida-root'));
  assert.ok(high.path.some(id => t.byId.get(id).z >= 3));
  const low = findTerrainPath(t, f.heroSpawns[0], at(f, 5, 9), options(f));
  assert.ok(low.path.some(id => t.byId.get(id).z < 0));
  assert.equal(terrainLineOfSight(t, at(f, 1, 9), at(f, 3, 9), { obstacles: f.obstacles }), false);
});

