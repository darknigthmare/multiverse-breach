import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { TACTICS_APERTURE_BATTLEFIELD as field } from '../src/game/tacticsApertureBattlefield.js';
import { normalizeTacticsTerrain, findTerrainPath, canOccupyTerrainSurface, getSurfacesAt,
  getTerrainNeighbors, terrainLineOfSight } from '../src/game/tacticsTerrain.js';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { getTacticsBattlefield, getUniverseTacticsBattlefield, TACTICS_SOURCE_BATTLEFIELDS } = await import('../src/game/tacticsBattlefields.js');
const { TACTICS_TERRAIN_MATERIALS } = await import('../src/game/tacticsTerrainRenderer.js');
const { getTacticsEnvironmentProfile } = await import('../src/game/tacticsEnvironmentRenderer.js');
const { buildCustomRuntimeStage, normalizeCustomBattlePreset } = await import('../src/game/customBattle.js');
const { EngineTactics } = await import('../src/game/engineTactics.js');
const human = { tacticsHeight: 1.2, tacticsFootprint: { width: 1, height: 1 } };
const giant = { tacticsHeight: 2.1, tacticsFootprint: { width: 2, height: 2 } };
const options = unit => ({ unit, obstacles: field.obstacles, occupied: () => false });
const noop = () => {};
const hero = id => ({ id, name: id, universe: 'Nexus de Convergence', category: 'fixture',
  weaponType: 'rifle', primaryColor: '#6ad5e0', stats: { hp: 1000, atk: 20, def: 10, spd: 90 },
  simple: { name: 'Fixture shot', dmg: 1, tactics: { delivery: 'ranged', shape: 'single', range: 4 } },
  secondary: { name: 'Fixture second', dmg: 1, cd: 2 }, special: { name: 'Fixture super', dmg: 1 },
  defense: { name: 'Fixture guard', reduce: .4, dur: 1 } });
function make(onComplete = noop) {
  const opponents = [{ id: 'passive', name: 'Passive fixture', universe: 'Nexus de Convergence',
    hp: 99999, atk: 0, spd: 1, simple: { name: 'No advance', dmg: 0 } }];
  return new EngineTactics(1040, 460, [hero('a'), hero('b'), hero('c')],
    { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, onComplete,
    { mode: 'Tactics', universe: 'Portal', tacticsBattlefieldId: field.id, difficulty: 'Custom',
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
}

test('each spawn, pickup and stacked recovery marker has a physically reachable authored support', () => {
  const terrain = normalizeTacticsTerrain(field), before = JSON.stringify(field);
  for (const ref of [...field.heroSpawns, ...field.monsterSpawns, ...field.pickupSpawns,
    ...field.surfaces.filter(s => s.type === 'artifact').map(s => ({ surfaceId: s.id }))]) {
    assert.ok(canOccupyTerrainSurface(terrain, ref, options(human)), ref.surfaceId);
    assert.ok(findTerrainPath(terrain, field.heroSpawns[0], ref, options(human)), ref.surfaceId);
  }
  for (const ref of [...field.bossSpawns, field.worldBossSpawn]) {
    assert.ok(canOccupyTerrainSurface(terrain, ref, options(giant)), ref.surfaceId);
  }
  for (const s of field.surfaces) assert.ok(TACTICS_TERRAIN_MATERIALS[s.materialId], s.materialId);
  assert.equal(JSON.stringify(field), before);
});

test('the same XY has two independently accessible levels and cannot teleport through a solid catwalk', () => {
  const t = normalizeTacticsTerrain(field), low = `${field.id}:ground:8:8`, high = `${field.id}:bridge:8:8`;
  assert.deepEqual(getSurfacesAt(t, 8, 8).map(s => s.z), [-1.5, 3]);
  assert.equal(terrainLineOfSight(t, low, high), false);
  assert.equal(getTerrainNeighbors(t, low, options(human)).some(s => s.surfaceId === high), false);
  const ascent = findTerrainPath(t, field.heroSpawns[0], high, options(human));
  assert.ok(ascent.path.some(id => t.byId.get(id).shape === 'stairs'));
  assert.ok(ascent.path.some(id => t.byId.get(id).layerId === 'bridge'));
  const descent = findTerrainPath(t, field.heroSpawns[0], low, options(human));
  assert.ok(descent.path.some(id => t.byId.get(id).z < 0));
  assert.equal(canOccupyTerrainSurface(t, low, options({ ...human, tacticsHeight: 4.3 })), false);
});

test('the live Custom selector resolves the Portal sector while other engines and forced base keep their contracts', () => {
  assert.ok(TACTICS_SOURCE_BATTLEFIELDS[field.id]);
  assert.equal(getUniverseTacticsBattlefield({ universe: 'Portal', name: 'Aperture maintenance shaft' }).id, field.id);
  for (const stage of [{ name: 'Portal (2007) — Aperture test chamber' }, { sourceWork: 'Portal 1' }]) {
    assert.equal(getUniverseTacticsBattlefield({ universe: 'Portal', ...stage }, { allowDefault: true }), null,
      'An explicit Portal 2007 archive must not silently borrow a Portal 2 sector');
  }
  assert.equal(getTacticsBattlefield({ mode: 'Tactics', universe: 'Portal', tacticsBattlefieldId: field.id }).id, field.id);
  assert.equal(getTacticsBattlefield({ universe: 'Portal', tacticsBattlefieldId: field.id, forceBaseArena: true }).id, 'training_grid');
  const preset = normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: field.id });
  const archive = { id: 'portal', universe: 'Portal', name: 'Aperture', image: '/other-engine.png' };
  const stage = buildCustomRuntimeStage({ preset, archive, enemyData: { monsters: [] } });
  assert.equal(stage.tacticsBattlefieldId, field.id); assert.equal(stage.image, null);
  for (const mode of ['RPG', 'Smash', 'Fighter']) {
    const other = buildCustomRuntimeStage({ preset: { ...preset, mode }, archive, enemyData: {} });
    assert.equal(other.image, archive.image); assert.equal(other.tacticsBattlefieldId, null);
  }
  const profile = getTacticsEnvironmentProfile(field, 'Tactics');
  assert.equal(profile.architecture, 'aperture-maintenance'); assert.equal(profile.usesSharedBackdrop, false);
  assert.equal(getTacticsEnvironmentProfile(field, 'RPG'), null);
  assert.equal(field.source.source1to1Verified, false); assert.equal(field.source.canonicalLayoutVerified, false);
});

test('real engine movement charges AP, pauses in flight and finishes on the selected supported level', () => {
  const e = make();
  try {
    const unit = e.heroes[0]; e.activeUnit = unit; e.activeUnitType = 'hero';
    e.movementBudget = 2; e.movementSpent = 0; e.actionPhase = 'move'; e.calculateMovementRange();
    const choice = e.movementRange.find(c => c.surfaceId !== unit.surfaceId && c.cost > 0 && c.cost <= 2);
    assert.ok(choice); const s = e.terrain.byId.get(choice.surfaceId);
    assert.equal(e.handleCellClick(s.x, s.y, s.id).handled, true); assert.equal(e.movementSpent, choice.cost);
    e.update(); e.setPaused(true);
    const frozen = JSON.stringify({ x: unit.x, y: unit.y, motion: unit.terrainMotion });
    for (let i = 0; i < 20; i++) e.update();
    assert.equal(JSON.stringify({ x: unit.x, y: unit.y, motion: unit.terrainMotion }), frozen);
    e.setPaused(false); for (let i = 0; i < 100 && unit.terrainMotion; i++) e.update();
    assert.equal(unit.terrainMotion, undefined); assert.equal(unit.surfaceId, s.id); assert.equal(unit.gridZ, s.z);
  } finally { e.dispose(); }
});

test('real engine recovers the two same-XY markers exactly once and completes the objective', () => {
  const e = make();
  try {
    const unit = e.heroes[0], markers = e.tiles.filter(s => s.type === 'artifact');
    assert.equal(markers.length, 2); assert.equal(markers[0].x, markers[1].x); assert.equal(markers[0].y, markers[1].y);
    for (const marker of markers) {
      const s = e.terrain.byId.get(marker.id);
      Object.assign(unit, { surfaceId: s.id, gridX: s.x, gridY: s.y, gridZ: s.z });
      e.syncActorsToCamera(); e.applyStartTileEffect(unit); e.applyStartTileEffect(unit);
    }
    assert.equal(e.collectedArtifactKeys.size, 2); assert.equal(e.objectiveProgress, 2);
    assert.equal(e.gameOver, true); assert.equal(e.battleResult, 'victory');
  } finally { e.dispose(); }
});
