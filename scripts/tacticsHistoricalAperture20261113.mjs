// One closed current addition is checked before the unchanged historical guards.
// This module is test tooling only; it never changes runtime definitions.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { TACTICS_APERTURE_BATTLEFIELD } from '../src/game/tacticsApertureBattlefield.js';
import { TACTICS_APERTURE_MATERIALS, TACTICS_APERTURE_ENVIRONMENT } from '../src/game/tacticsAperturePresentation.js';

export const TACTICS_APERTURE_AMENDMENT_PATH = 'scripts/fixtures/tactics-aperture-historical-amendment-2026-11-13.json';
export const TACTICS_APERTURE_AMENDMENT_SHA256 = '79b17a7ac81e3b0fbbc1c75eb97b16ca2abb8a0985d79a3574db30da09663185';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const jsonHash = value => digest(JSON.stringify(value));
const bytes = readFileSync(new URL('./fixtures/tactics-aperture-historical-amendment-2026-11-13.json', import.meta.url));
assert.equal(digest(bytes), TACTICS_APERTURE_AMENDMENT_SHA256, 'The closed Aperture amendment changed; append a reviewed contract');
const contract = JSON.parse(bytes);
const sectorId = 'portal2_maintenance_shaft_tactics';
const materialIds = ['aperture-panel', 'aperture-frame', 'aperture-grate'];
const biomeId = 'aperture-maintenance';
const sorted = values => [...values].sort();
const map = (value, label) => assert.ok(value && typeof value === 'object' && !Array.isArray(value), label + ': expected definitions');

assert.equal(contract.schemaVersion, 1);
assert.equal(contract.kind, 'closed-aperture-tactics-additions-before-W17-historical-projection');
assert.equal(contract.historicalBaselineSha256, '2aea8ab9fd69823f4bea48d2176a69bb243617dc61a742e683989b044b6063ee');
assert.equal(contract.changesHistoricalInputs, false);
assert.equal(contract.changesRuntime, false);
assert.equal(contract.source1to1Verified, false);
assert.equal(contract.sector.id, sectorId);
assert.deepEqual(contract.materials.map(pin => pin.id), materialIds);
assert.equal(contract.environment.id, biomeId);
for (const pin of [contract.sector, ...contract.materials, contract.environment]) {
  assert.equal(jsonHash(pin.definition), pin.jsonSha256, 'Aperture readable definition must match its exact JSON pin');
}

const exactDefinition = (actual, pin, label) => {
  map(actual, label);
  assert.equal(jsonHash(actual), pin.jsonSha256, label + ': reviewed Aperture definition changed: ' + pin.id);
  // JSON hashes alone ignore extra undefined/function properties. The readable
  // closed record also rejects those values and incompatible object shapes.
  assert.deepEqual(actual, pin.definition, label + ': reviewed Aperture definition changed: ' + pin.id);
};

/** Verify every reviewed source object, including the complete biome profile. */
export function assertReviewedTacticsApertureDefinitions({
  sector = TACTICS_APERTURE_BATTLEFIELD,
  materials = TACTICS_APERTURE_MATERIALS,
  environment = TACTICS_APERTURE_ENVIRONMENT,
} = {}) {
  exactDefinition(sector, contract.sector, 'Tactics sector');
  map(materials, 'Aperture materials');
  assert.deepEqual(sorted(Object.keys(materials)), sorted(materialIds), 'Aperture source materials must be the exact three reviewed identities');
  for (const pin of contract.materials) exactDefinition(materials[pin.id], pin, 'Tactics material');
  exactDefinition(environment, contract.environment, 'Tactics biome profile');
}

// Unknown keys are deliberately retained. The caller MUST immediately run its
// old complete W17 guard on this projection; nothing else is replaced or reset.
export function projectTacticsSectorsBeforeAperture(actual) {
  assertReviewedTacticsApertureDefinitions();
  map(actual, 'Tactics sectors');
  if (Object.hasOwn(actual, sectorId)) exactDefinition(actual[sectorId], contract.sector, 'Tactics sector');
  return Object.freeze(Object.fromEntries(Object.entries(actual).filter(([id]) => id !== sectorId)));
}

export function projectTacticsMaterialsBeforeAperture(actual) {
  assertReviewedTacticsApertureDefinitions();
  map(actual, 'Tactics materials');
  const present = materialIds.filter(id => Object.hasOwn(actual, id));
  assert.ok(present.length === 0 || present.length === materialIds.length,
    'Aperture materials must be all present or all absent in a historical intermediate inventory');
  for (const pin of contract.materials) if (Object.hasOwn(actual, pin.id)) exactDefinition(actual[pin.id], pin, 'Tactics material');
  return Object.freeze(Object.fromEntries(Object.entries(actual).filter(([id]) => !materialIds.includes(id))));
}

export function projectTacticsBiomesBeforeAperture(actual) {
  assertReviewedTacticsApertureDefinitions();
  assert.ok(Array.isArray(actual), 'Tactics biomes: expected an identity list');
  assert.equal(new Set(actual).size, actual.length, 'Duplicate runtime biome');
  return Object.freeze(actual.filter(id => id !== biomeId));
}
