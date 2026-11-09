import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 as fields } from '../src/game/tacticsUniverseBattlefieldsWave17.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS as wave14Fields } from '../src/game/tacticsUniverseBattlefields.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as wave15Fields } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 as wave16Fields } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
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

test('four W17 exclusive Tactics sectors bind actual roster universes to explicit source works without certifying official plans', () => {
  assert.equal(boards.length, 4);
  const universes = new Set(HEROES_DB.map(hero => hero.universe));
  const expected = [
    ['bge_lighthouse_tactics', 'Beyond Good & Evil', '2003', 'hillys-coast'],
    ['rayman_teensies_forest_tactics', 'Rayman', '2013', 'legends-dream-forest'],
    ['atomic_vdnh_gallery_tactics', 'Atomic Heart', '2023', 'vdnh-exhibition'],
    ['zootopia_rainforest_tactics', 'Zootopia', '2016', 'zootopia-rainforest']
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

test('the four W17 sector topologies differ from each other, W14, W15 and the earlier Nexus boards without relying on palette or IDs', () => {
  const signatures = boards.map(topology);
  assert.equal(new Set(signatures).size, boards.length);
  const old = new Set([...Object.values(nexusFields), ...Object.values(wave14Fields), ...Object.values(wave15Fields), ...Object.values(wave16Fields)].map(topology));
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

test('Hillys gives its two markers distinct floors, real stairs, lower dock cost and an impassable sea', () => {
  const f = fields.bge_lighthouse_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 7, 5), high = at(f, 7, 5, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 7, 5).map(s => s.z), [-1, 2]);
  assert.equal(getTerrainSurface(t, low).materialId, 'hillys-dock');
  assert.equal(getTerrainSurface(t, low).moveCost, 1.5);
  assert.equal(canOccupyTerrainSurface(t, low, options(f)), true);
  assert.equal(canOccupyTerrainSurface(t, low, options(f, { tacticsHeight: 2.8 })), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(terrainHeightAdvantage(t, high, at(f, 7, 6)).multiplier, 1.15);
  assert.equal(getTerrainNeighbors(t, low).some(s => s.surfaceId === high), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 2), options(f)), false);
  const upper = findTerrainPath(t, f.heroSpawns[0], high, options(f));
  assert.ok(upper.path.some(id => t.byId.get(id).shape === 'stairs'));
  const lower = findTerrainPath(t, f.heroSpawns[0], low, options(f));
  assert.ok(lower.path.some(id => t.byId.get(id).shape === 'ramp'));
  assert.deepEqual(f.surfaces.filter(s => s.type === 'artifact').map(s => s.z), [-1, 2]);
});

test('Legends keeps the curved root route above its slow ravine without bridging the missing shortcut', () => {
  const f = fields.rayman_teensies_forest_tactics, t = normalizeTacticsTerrain(f);
  const high = at(f, 6, 3, 'bridge'), low = at(f, 6, 3), gap = at(f, 6, 4);
  assert.deepEqual(getSurfacesAt(t, 6, 3).map(s => s.z), [-1.5, 3]);
  assert.equal(getTerrainSurface(t, low).moveCost, 2);
  assert.equal(getSurfacesAt(t, 6, 4).some(s => s.z === 3), false);
  assert.equal(getTerrainNeighbors(t, high).some(s => s.surfaceId === gap), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.ok(findTerrainPath(t, f.heroSpawns[0], high, options(f)).path.some(id => t.byId.get(id).materialId === 'legends-root'));
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 6), options(f)), false);
  assert.deepEqual(f.surfaces.filter(s => s.type === 'objective').map(s => s.z), [-1.5, 3]);
});

test('VDNH has three independently supported levels, width-two stairs and a real height-limited service slab', () => {
  const f = fields.atomic_vdnh_gallery_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 7, 8), mid = `${f.id}:service-slab:7:8`, high = at(f, 7, 8, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 7, 8).map(s => s.z), [-1.5, .75, 3]);
  for (const ref of [low, mid, high]) assert.equal(canOccupyTerrainSurface(t, ref, options(f)), true, ref);
  for (const ref of [low, mid]) assert.equal(canOccupyTerrainSurface(t, ref, options(f, { tacticsHeight: 2.1 })), false, ref);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(terrainLineOfSight(t, mid, high), false);
  assert.equal(getTerrainNeighbors(t, low).some(s => s.surfaceId === mid || s.surfaceId === high), false);
  const service = findTerrainPath(t, at(f, 3, 8), at(f, 11, 8), options({ ...f, obstacles: [] }));
  assert.ok(service, 'The maintenance crossing must have a legal route from each bank');
  assert.ok(findTerrainPath(t, at(f, 4, 8), mid, options(f)).path.includes(at(f, 5, 8, 'bridge')));
  assert.ok(findTerrainPath(t, mid, at(f, 11, 8), options(f)));
  for (const y of [2, 3]) assert.equal(getTerrainSurface(t, at(f, 1, y)).shape, 'stairs');
  assert.equal(terrainLineOfSight(t, at(f, 2, 8), at(f, 4, 8), { obstacles: f.obstacles }), false);
  assert.deepEqual(f.obstacles.filter(o => o.type === 'objective').map(o => getTerrainSurface(t, o).z).sort(), [-1.5, 3]);
});

test('Rainforest canopy extraction and broad lower route remain distinct, with a real pool and slower wet soil', () => {
  const f = fields.zootopia_rainforest_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 5, 5), high = at(f, 5, 5, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 5, 5).map(s => s.z), [-1, 3.5]);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(getTerrainSurface(t, at(f, 4, 8)).moveCost, 2);
  assert.equal(canOccupyTerrainSurface(t, at(f, 6, 7), options(f)), false);
  assert.deepEqual(f.extractionZone.map(ref => getTerrainSurface(t, ref).z), [3.5, 0]);
  const upper = findTerrainPath(t, f.heroSpawns[0], f.extractionZone[0], options(f));
  assert.ok(upper.path.some(id => t.byId.get(id).materialId === 'rainforest-boardwalk'));
  const lower = findTerrainPath(t, f.heroSpawns[0], f.extractionZone[1], options(f, giant));
  assert.ok(lower, 'A two-by-two body must have an actual route to the broad lower exit');
  assert.ok(lower.path.every(id => t.byId.get(id).z < 1));
});
