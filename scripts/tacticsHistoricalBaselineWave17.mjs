// Prove the exact W17 extension before presenting the immutable W16 inventory
// to older assertions. Unknown identities and historical changes are rejected.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 } from '../src/game/tacticsUniverseBattlefieldsWave17.js';
import { TACTICS_TERRAIN_MATERIALS_WAVE17, TACTICS_ENVIRONMENT_PROFILES_WAVE17 } from '../src/game/tacticsUniversePresentationWave17.js';
import { projectTacticsSectorsBeforeAperture, projectTacticsMaterialsBeforeAperture,
  projectTacticsBiomesBeforeAperture } from './tacticsHistoricalAperture20261113.mjs';

const directory = '../docs/tactics-universes-2026-11-02/';
const bytes = readFileSync(new URL(directory + 'baseline-tactics-stages-before.json', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
assert.equal(digest(bytes), '2aea8ab9fd69823f4bea48d2176a69bb243617dc61a742e683989b044b6063ee', 'The pre-W17 Tactics baseline must remain byte-identical');
const baseline = JSON.parse(bytes);
const planBytes = readFileSync(new URL(directory + 'source-plan-before.json', import.meta.url));
assert.equal(digest(planBytes), baseline.sourcePlanSha256, 'The pre-production source plan changed');
const plan = JSON.parse(planBytes);
const sorted = values => [...values].sort();
const keys = value => sorted(Object.keys(value));
const definitionHash = value => digest(JSON.stringify(value));
const nexusIds = ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks'];
const sectorIds = ['bge_lighthouse_tactics', 'rayman_teensies_forest_tactics', 'atomic_vdnh_gallery_tactics', 'zootopia_rainforest_tactics'];
const materialIds = ['hillys-grass', 'hillys-stone', 'hillys-dock', 'legends-moss', 'legends-root', 'vdnh-marble', 'vdnh-inlay', 'vdnh-grate', 'rainforest-fern', 'rainforest-boardwalk'];
const biomeIds = ['hillys-coast', 'legends-dream-forest', 'vdnh-exhibition', 'zootopia-rainforest'];
assert.equal(keys(baseline.fields).length, 19); assert.equal(keys(baseline.materialDefinitions).length, 42);
assert.equal(baseline.biomes.length, 16);
assert.deepEqual(sorted(plan.sectors.map(sector => sector.id)), sorted(sectorIds));
assert.deepEqual(sorted(plan.sectors.flatMap(sector => sector.newMaterials)), sorted(materialIds));
assert.deepEqual(keys(TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17), sorted(sectorIds));
assert.deepEqual(keys(TACTICS_TERRAIN_MATERIALS_WAVE17), sorted(materialIds));
assert.deepEqual(keys(TACTICS_ENVIRONMENT_PROFILES_WAVE17), sorted(biomeIds));

function projectDefinitions(actual, previousHashes, additions, label) {
  const priorIds = keys(previousHashes), addedIds = keys(additions);
  assert.ok(addedIds.every(id => !Object.hasOwn(previousHashes, id)), label + ': W17 cannot replace a historical identity');
  assert.deepEqual(keys(actual), sorted([...priorIds, ...addedIds]), label + ': expected the exact historical and W17 union');
  for (const id of priorIds) assert.equal(definitionHash(actual[id]), previousHashes[id], label + ': historical definition changed: ' + id);
  for (const id of addedIds) assert.equal(definitionHash(actual[id]), definitionHash(additions[id]), label + ': live W17 definition differs: ' + id);
  return Object.freeze(Object.fromEntries(priorIds.map(id => [id, actual[id]])));
}

export function projectTacticsSectorsBeforeWave17(actual) {
  actual = projectTacticsSectorsBeforeAperture(actual);
  const previous = Object.fromEntries(Object.entries(baseline.fields).filter(([id]) => !nexusIds.includes(id)));
  assert.equal(keys(previous).length, 16);
  return projectDefinitions(actual, previous, TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17, 'Tactics sectors');
}

export function projectTacticsMaterialsBeforeWave17(actual) {
  actual = projectTacticsMaterialsBeforeAperture(actual);
  return projectDefinitions(actual, baseline.materialDefinitions, TACTICS_TERRAIN_MATERIALS_WAVE17, 'Tactics materials');
}

export function projectTacticsBiomesBeforeWave17(actual) {
  actual = projectTacticsBiomesBeforeAperture(actual);
  assert.equal(new Set(actual).size, actual.length, 'Duplicate runtime biome');
  assert.ok(biomeIds.every(id => !baseline.biomes.includes(id)), 'W17 cannot replace a historical biome');
  assert.deepEqual(sorted(actual), sorted([...baseline.biomes, ...biomeIds]), 'Runtime biomes must be exactly W16 plus the four W17 additions');
  return Object.freeze(actual.filter(id => !biomeIds.includes(id)));
}
