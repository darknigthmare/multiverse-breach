import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefields.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 } from '../src/game/tacticsUniverseBattlefieldsWave17.js';
import { TACTICS_TERRAIN_MATERIALS } from '../src/game/tacticsTerrainRenderer.js';
import { TACTICS_RUNTIME_ENVIRONMENT_BIOMES } from '../src/game/tacticsEnvironmentRenderer.js';
import { TACTICS_APERTURE_BATTLEFIELD } from '../src/game/tacticsApertureBattlefield.js';
import { TACTICS_APERTURE_MATERIALS, TACTICS_APERTURE_ENVIRONMENT } from '../src/game/tacticsAperturePresentation.js';
import { TACTICS_APERTURE_AMENDMENT_PATH, TACTICS_APERTURE_AMENDMENT_SHA256,
  assertReviewedTacticsApertureDefinitions, projectTacticsSectorsBeforeAperture,
  projectTacticsMaterialsBeforeAperture, projectTacticsBiomesBeforeAperture } from './tacticsHistoricalAperture20261113.mjs';
import { projectTacticsSectorsBeforeWave17, projectTacticsMaterialsBeforeWave17,
  projectTacticsBiomesBeforeWave17 } from './tacticsHistoricalBaselineWave17.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const id = 'portal2_maintenance_shaft_tactics';
const materialIds = Object.keys(TACTICS_APERTURE_MATERIALS);
const sectors = {
  ...TACTICS_UNIVERSE_BATTLEFIELDS, ...TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15,
  ...TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16, ...TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17,
  [id]: TACTICS_APERTURE_BATTLEFIELD,
};

test('closed Aperture fixture pins the full sector, three materials and complete environment without changing W17 history', () => {
  const bytes = readFileSync(new URL('../' + TACTICS_APERTURE_AMENDMENT_PATH, import.meta.url));
  assert.equal(hash(bytes), TACTICS_APERTURE_AMENDMENT_SHA256);
  const contract = JSON.parse(bytes);
  assert.equal(contract.sector.id, id);
  assert.equal(contract.materials.length, 3);
  assert.equal(contract.environment.id, 'aperture-maintenance');
  assert.equal(contract.changesHistoricalInputs, false);
  assert.equal(contract.changesRuntime, false);
  assert.equal(contract.source1to1Verified, false);
  assert.equal(hash(readFileSync(new URL('../docs/tactics-universes-2026-11-02/baseline-tactics-stages-before.json', import.meta.url))),
    '2aea8ab9fd69823f4bea48d2176a69bb243617dc61a742e683989b044b6063ee');
  assert.equal(hash(readFileSync(new URL('../docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json', import.meta.url))),
    '6063699c4e2e8424d7f9eb1574aabe6a433801442c2ec8cc1239020a6725503f');
  assertReviewedTacticsApertureDefinitions();
});

test('exact new additions are proved before the complete historical W17 projections', () => {
  assert.equal(Object.keys(sectors).length, 21);
  assert.equal(Object.keys(TACTICS_TERRAIN_MATERIALS).length, 55);
  assert.equal(TACTICS_RUNTIME_ENVIRONMENT_BIOMES.length, 21);
  assert.equal(Object.keys(projectTacticsSectorsBeforeWave17(sectors)).length, 16);
  assert.equal(Object.keys(projectTacticsMaterialsBeforeWave17(TACTICS_TERRAIN_MATERIALS)).length, 42);
  assert.equal(projectTacticsBiomesBeforeWave17(TACTICS_RUNTIME_ENVIRONMENT_BIOMES).length, 16);
});

test('historical intermediate inventories with all Aperture additions absent remain accepted', () => {
  const previousSectors = { ...sectors }; delete previousSectors[id];
  const previousMaterials = Object.fromEntries(Object.entries(TACTICS_TERRAIN_MATERIALS).filter(([key]) => !materialIds.includes(key)));
  const previousBiomes = TACTICS_RUNTIME_ENVIRONMENT_BIOMES.filter(key => key !== 'aperture-maintenance');
  assert.deepEqual(projectTacticsSectorsBeforeWave17(previousSectors), projectTacticsSectorsBeforeWave17(sectors));
  assert.deepEqual(projectTacticsMaterialsBeforeWave17(previousMaterials), projectTacticsMaterialsBeforeWave17(TACTICS_TERRAIN_MATERIALS));
  assert.deepEqual(projectTacticsBiomesBeforeWave17(previousBiomes), projectTacticsBiomesBeforeWave17(TACTICS_RUNTIME_ENVIRONMENT_BIOMES));
});

test('new geometry, source authority, spawns, presentation and extra fields cannot borrow the reviewed sector identity', () => {
  for (const mutate of [
    field => { field.surfaces[0].cornerZ[2] += 1; },
    field => { field.source.source1to1Verified = true; },
    field => { field.heroSpawns[0].surfaceId = 'invented:spawn'; },
    field => { field.tacticsPresentation.weather = 'invented-storm'; },
    field => { field.obstacles[0].tacticsHeight += 3; },
    field => { field.unreviewedMechanic = true; },
    field => { field.unreviewedMechanic = undefined; },
    field => { field.unreviewedHandler = () => true; },
  ]) {
    const changed = structuredClone(sectors); mutate(changed[id]);
    assert.throws(() => projectTacticsSectorsBeforeWave17(changed), /reviewed Aperture definition changed/);
  }
});

test('all three new material definitions and the complete biome profile are exact, never ID-only approval', () => {
  for (const key of materialIds) {
    const changed = structuredClone(TACTICS_TERRAIN_MATERIALS);
    changed[key].top = '#ffffff';
    assert.throws(() => projectTacticsMaterialsBeforeWave17(changed), /reviewed Aperture definition changed/);
  }
  const partial = { ...TACTICS_TERRAIN_MATERIALS }; delete partial['aperture-frame'];
  assert.throws(() => projectTacticsMaterialsBeforeWave17(partial), /all present or all absent/);
  for (const mutate of [
    profile => { profile.sky[0] = '#ffffff'; },
    profile => { profile.architecture = 'unreviewed-laboratory'; },
    profile => { profile.artApproved = true; },
  ]) {
    const environment = structuredClone(TACTICS_APERTURE_ENVIRONMENT); mutate(environment);
    assert.throws(() => assertReviewedTacticsApertureDefinitions({ environment }), /reviewed Aperture definition changed/);
  }
});

test('an Aperture addition cannot mask mutated old sectors, old materials or prior W17 definitions', () => {
  const oldSector = structuredClone(sectors); oldSector.ff7_mt_nibel_tactics.surfaces[0].z += 1;
  assert.throws(() => projectTacticsSectorsBeforeWave17(oldSector), /historical definition changed/);
  const oldMaterial = structuredClone(TACTICS_TERRAIN_MATERIALS); oldMaterial.grass.top = '#ffffff';
  assert.throws(() => projectTacticsMaterialsBeforeWave17(oldMaterial), /historical definition changed/);
  const wave17 = structuredClone(sectors); wave17.bge_lighthouse_tactics.source.universe = 'Portal';
  assert.throws(() => projectTacticsSectorsBeforeWave17(wave17), /live W17 definition differs/);
  const wave17Material = structuredClone(TACTICS_TERRAIN_MATERIALS); wave17Material['hillys-grass'].family = 'panel';
  assert.throws(() => projectTacticsMaterialsBeforeWave17(wave17Material), /live W17 definition differs/);
});

test('unknown identities, same-prefix aliases and removed old definitions still fail the real historical guards', () => {
  const unknown = { ...sectors, portal2_unreviewed_tactics: TACTICS_APERTURE_BATTLEFIELD };
  assert.equal(projectTacticsSectorsBeforeAperture(unknown).portal2_unreviewed_tactics, TACTICS_APERTURE_BATTLEFIELD,
    'unknown current values must survive for the complete historical guard');
  assert.throws(() => projectTacticsSectorsBeforeWave17(unknown), /exact historical and W17 union/);
  assert.throws(() => projectTacticsMaterialsBeforeWave17({ ...TACTICS_TERRAIN_MATERIALS, 'aperture-unreviewed': TACTICS_APERTURE_MATERIALS['aperture-panel'] }), /exact historical and W17 union/);
  assert.throws(() => projectTacticsBiomesBeforeWave17([...TACTICS_RUNTIME_ENVIRONMENT_BIOMES, 'aperture-unreviewed']), /exactly W16 plus/);
  assert.throws(() => projectTacticsBiomesBeforeWave17([...TACTICS_RUNTIME_ENVIRONMENT_BIOMES, 'aperture-maintenance']), /Duplicate runtime biome/);
  const missing = { ...sectors }; delete missing.ff7_mt_nibel_tactics;
  assert.throws(() => projectTacticsSectorsBeforeWave17(missing), /exact historical and W17 union/);
});

test('projection never mutates or freezes caller data and preserves unrelated object identities', () => {
  const current = { sectors: structuredClone(sectors), materials: structuredClone(TACTICS_TERRAIN_MATERIALS),
    biomes: [...TACTICS_RUNTIME_ENVIRONMENT_BIOMES] };
  const before = JSON.stringify(current);
  const old = current.sectors.ff7_mt_nibel_tactics;
  const projected = projectTacticsSectorsBeforeAperture(current.sectors);
  assert.equal(projected.ff7_mt_nibel_tactics, old);
  assert.ok(Object.isFrozen(projected));
  assert.equal(Object.isFrozen(current.sectors), false);
  assert.equal(Object.isFrozen(old), false);
  projectTacticsSectorsBeforeWave17(current.sectors);
  projectTacticsMaterialsBeforeAperture(current.materials);
  projectTacticsMaterialsBeforeWave17(current.materials);
  projectTacticsBiomesBeforeAperture(current.biomes);
  projectTacticsBiomesBeforeWave17(current.biomes);
  assert.equal(JSON.stringify(current), before);
});
