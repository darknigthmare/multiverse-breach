import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS as fields } from '../src/game/tacticsUniverseBattlefields.js';
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

test('eight exclusive Tactics sectors bind actual roster universes to explicit source works without certifying official plans', () => {
  assert.equal(boards.length, 8);
  const universes = new Set(HEROES_DB.map(hero => hero.universe));
  const expected = [
    ['ff7_mt_nibel_tactics', 'Final Fantasy VII', '1997', 'nibel-crags'],
    ['ff13_archylte_steppe_tactics', 'Final Fantasy XIII', '2009', 'archylte'],
    ['ff15_vesperpool_tactics', 'Final Fantasy XV', '2016', 'wetlands'],
    ['lotr_caradhras_tactics', 'The Lord of the Rings', '2001', 'alpine'],
    ['lotr_ithilien_tactics', 'The Lord of the Rings', '2002', 'woodland'],
    ['darksouls_darkroot_tactics', 'Dark Souls', '2011', 'enchanted-forest'],
    ['masseffect_therum_tactics', 'Mass Effect', '2007', 'volcanic'],
    ['halo_valhalla_tactics', 'Halo', '2007', 'forerunner-valley']
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

test('the eight sector topologies differ from each other and the earlier Nexus boards without relying on palette or IDs', () => {
  const signatures = boards.map(topology);
  assert.equal(new Set(signatures).size, boards.length);
  const old = new Set(Object.values(nexusFields).map(topology));
  assert.ok(signatures.every(signature => !old.has(signature)));
  assert.equal(new Set(boards.map(field => field.layoutId)).size, 8);
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

test('Mt. Nibel has two real approaches and a thin maintenance bridge above a traversable floor', () => {
  const f = fields.ff7_mt_nibel_tactics, t = normalizeTacticsTerrain(f);
  const low = at(f, 8, 5), high = at(f, 8, 5, 'bridge');
  assert.deepEqual(getSurfacesAt(t, 8, 5).map(surface => surface.z), [0, 3]);
  assert.equal(canOccupyTerrainSurface(t, low, { unit: human }), true);
  assert.equal(canOccupyTerrainSurface(t, low, { unit: giant }), false);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(getTerrainNeighbors(t, low).some(next => next.surfaceId === high), false);
  const goal = f.surfaces.find(surface => surface.type === 'objective');
  const west = findTerrainPath(t, f.heroSpawns[0], goal, options(f));
  assert.ok(west.path.includes(at(f, 4, 4))); assert.ok(west.transitions.some(step => step.kind === 'walk'));
  const southern = findTerrainPath(t, f.heroSpawns[0], goal, { ...options(f), isBlocked: surface => surface.id === at(f, 4, 4) });
  assert.ok(southern.path.includes(high)); assert.ok(southern.path.includes(at(f, 8, 8)));
});

test('Archylte has negative-altitude travel, two accessible fords and actual cliff occlusion', () => {
  const f = fields.ff13_archylte_steppe_tactics, t = normalizeTacticsTerrain(f);
  const target = at(f, 11, 2);
  const alternate = findTerrainPath(t, f.heroSpawns[0], target, {
    ...options(f), isBlocked: surface => [at(f, 5, 3), at(f, 9, 3)].includes(surface.id)
  });
  assert.ok(alternate.path.includes(at(f, 5, 7))); assert.ok(alternate.path.includes(at(f, 9, 7)));
  assert.ok(alternate.path.some(id => t.byId.get(id).z < 0));
  assert.equal(terrainLineOfSight(t, at(f, 9, 2), at(f, 12, 2)), false, 'The rocky plateau is a solid volume');
  assert.equal(terrainHeightAdvantage(t, target, at(f, 12, 2)).multiplier, 1.15);
  assert.equal(getTerrainNeighbors(t, at(f, 11, 4)).some(next => next.surfaceId === at(f, 11, 3)), false, 'A cliff edge is not an implicit staircase');
});

test('Vesperpool deep water stays blocked while a broad costly ford admits a body that cannot use the narrow boardwalk', () => {
  const f = fields.ff15_vesperpool_tactics, t = normalizeTacticsTerrain(f), target = f.extractionZone[0];
  assert.equal(canOccupyTerrainSurface(t, at(f, 6, 5), { unit: human }), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 6, 3, 'bridge'), { unit: giant }), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 6, 9), { unit: giant }), true);
  const viaFord = findTerrainPath(t, f.heroSpawns[0], target, {
    ...options(f), isBlocked: surface => surface.layerId === 'bridge'
  });
  assert.ok(viaFord.path.some(id => t.byId.get(id).materialId === 'shallow-water'));
  const viaDeck = findTerrainPath(t, f.heroSpawns[0], target, {
    ...options(f), isBlocked: surface => surface.materialId === 'shallow-water' && surface.walkable
  });
  assert.ok(viaDeck.path.some(id => t.byId.get(id).layerId === 'bridge'));
  assert.ok(viaFord.cost > viaDeck.cost, 'The broad ford trades capacity for AP');
  const largeRoute = findTerrainPath(t, f.heroSpawns[0], target, options(f, giant));
  assert.ok(largeRoute); assert.ok(largeRoute.path.some(id => t.byId.get(id).materialId === 'shallow-water'));
});

test('Caradhras has snow costs, an opaque mountain wall and a usable broad lower pass', () => {
  const f = fields.lotr_caradhras_tactics, t = normalizeTacticsTerrain(f);
  assert.equal(t.byId.get(at(f, 1, 6)).moveCost, 2);
  assert.equal(terrainLineOfSight(t, at(f, 1, 2), at(f, 9, 2)), false);
  assert.equal(terrainLineOfSight(t, at(f, 1, 6), at(f, 9, 6)), true);
  const largeRoute = findTerrainPath(t, f.heroSpawns[0], f.extractionZone[1], options(f, giant));
  assert.ok(largeRoute); assert.ok(largeRoute.path.some(id => t.byId.get(id).y === 6));
  assert.ok(t.surfaces.some(surface => surface.z >= 4 && !surface.walkable));
});

test('Ithilien tree cover is a real sight blocker and the ravine crossing preserves two altitudes', () => {
  const f = fields.lotr_ithilien_tactics, t = normalizeTacticsTerrain(f);
  assert.equal(terrainLineOfSight(t, at(f, 2, 5), at(f, 4, 5)), true);
  assert.equal(terrainLineOfSight(t, at(f, 2, 5), at(f, 4, 5), { obstacles: f.obstacles }), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 3, 5), options(f)), false);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 5), { unit: human }), true);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 5), { unit: giant }), false);
  assert.equal(terrainLineOfSight(t, at(f, 7, 5), at(f, 7, 5, 'bridge')), false);
});

test('Darkroot objectives require the courtyard floor and the upper perimeter instead of a single flat destination', () => {
  const f = fields.darksouls_darkroot_tactics, t = normalizeTacticsTerrain(f);
  const goalHeights = objectives(f).map(goal => getTerrainSurface(t, goal).z).sort();
  assert.deepEqual(goalHeights, [0, 2]);
  const lowGoal = objectives(f).find(goal => goal.z === 0);
  const path = findTerrainPath(t, f.heroSpawns[0], lowGoal, options(f));
  assert.ok(path.path.includes(at(f, 6, 4))); assert.ok(path.path.includes(at(f, 6, 5)));
  assert.equal(terrainLineOfSight(t, at(f, 1, 2), at(f, 3, 2)), true);
  assert.equal(terrainLineOfSight(t, at(f, 1, 2), at(f, 3, 2), { obstacles: f.obstacles }), false);
});

test('Therum lava cannot become a walking tile and each relay has a legal, visible attack approach', () => {
  const f = fields.masseffect_therum_tactics, t = normalizeTacticsTerrain(f);
  assert.equal(canOccupyTerrainSurface(t, at(f, 7, 5), { unit: human }), false);
  const target = f.obstacles.find(obstacle => obstacle.type === 'objective');
  const alternate = findTerrainPath(t, f.heroSpawns[0], at(f, 11, 2), {
    ...options(f), isBlocked: surface => surface.y === 2 && surface.x >= 6 && surface.x <= 8
  });
  assert.ok(alternate.path.some(id => t.byId.get(id).layerId === 'bridge'));
  assert.equal(terrainLineOfSight(t, at(f, 11, 2), target, { obstacles: f.obstacles }), true);
  assert.equal(getTerrainSurface(t, at(f, 5, 4)).type, 'hazard');
  assert.equal(getTerrainSurface(t, at(f, 5, 4)).walkable, true);
});

test('Valhalla offers costly shallow-water crossing and a separately reached Forerunner ridge', () => {
  const f = fields.halo_valhalla_tactics, t = normalizeTacticsTerrain(f);
  const water = t.byId.get(at(f, 8, 6));
  assert.equal(water.moveCost, 2); assert.equal(water.z, -0.5); assert.equal(water.walkable, true);
  const upper = objectives(f).find(goal => goal.z > 0);
  const route = findTerrainPath(t, f.heroSpawns[0], upper, options(f));
  assert.ok(route.path.some(id => t.byId.get(id).shape === 'ramp'));
  assert.equal(terrainHeightAdvantage(t, upper, f.heroSpawns[0]).multiplier, 1.15);
  assert.equal(terrainLineOfSight(t, at(f, 2, 6), at(f, 4, 6)), true);
  assert.equal(terrainLineOfSight(t, at(f, 2, 6), at(f, 4, 6), { obstacles: f.obstacles }), false);
});
