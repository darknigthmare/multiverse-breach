// Read-only preservation assertions for historical tests against the live W16 union.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const bytes = readFileSync(new URL('../docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
assert.equal(digest(bytes), '6063699c4e2e8424d7f9eb1574aabe6a433801442c2ec8cc1239020a6725503f',
  'The pre-W16 Tactics baseline must remain byte-identical');
const baseline = JSON.parse(bytes);
const sorted = values => [...values].sort();
const keys = value => sorted(Object.keys(value));
const definitionHash = value => digest(JSON.stringify(value));
const nexusIds = ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks'];
const addedSectorIds = ['cuphead_inkwell_tactics', 'titanfall_reclamation_tactics', 'fma_central_station_tactics', 'wakfu_sadida_tactics'];
const addedMaterialIds = ['inkwell-grass', 'inkwell-wood', 'imc-deck', 'imc-grate', 'central-stone', 'central-rail', 'sadida-grass', 'sadida-root'];

export function assertWave16SectorExtension(actual, additions) {
  assert.equal(keys(baseline.fields).length, 15);
  for (const id of nexusIds) assert.ok(Object.hasOwn(baseline.fields, id), id);
  const previousIds = keys(baseline.fields).filter(id => !nexusIds.includes(id));
  assert.equal(previousIds.length, 12);
  assert.deepEqual(keys(additions), sorted(addedSectorIds));
  assert.ok(addedSectorIds.every(id => !Object.hasOwn(baseline.fields, id)), 'New sectors cannot replace a historical sector');
  assert.deepEqual(keys(actual), sorted([...previousIds, ...addedSectorIds]), 'Live sectors must be exactly W15 plus the four W16 additions');
  for (const id of previousIds) assert.equal(definitionHash(actual[id]), baseline.fields[id], id + ': historical topology/source changed');
  for (const id of addedSectorIds) assert.deepEqual(actual[id], additions[id], id + ': live W16 sector differs from its dedicated definition');
}

export function assertWave16MaterialExtension(actual, additions) {
  const previousIds = keys(baseline.materialDefinitions);
  assert.equal(previousIds.length, 34);
  assert.deepEqual(keys(additions), sorted(addedMaterialIds));
  assert.ok(addedMaterialIds.every(id => !Object.hasOwn(baseline.materialDefinitions, id)), 'New materials cannot replace a historical material');
  assert.deepEqual(keys(actual), sorted([...previousIds, ...addedMaterialIds]), 'Live materials must be exactly W15 plus the eight W16 additions');
  for (const id of previousIds) assert.equal(definitionHash(actual[id]), baseline.materialDefinitions[id], id + ': historical material changed');
  for (const id of addedMaterialIds) assert.deepEqual(actual[id], additions[id], id + ': live W16 material differs from its dedicated definition');
}

export function assertWave16EnvironmentExtension(historicalBiomes, runtimeBiomes, wave15Profiles, wave16Profiles) {
  const originalIds = ['nibel-crags', 'archylte', 'wetlands', 'alpine', 'woodland', 'enchanted-forest', 'volcanic', 'forerunner-valley'];
  assert.deepEqual(sorted(historicalBiomes), sorted(originalIds), 'The eight-biome historical export must remain bounded and unchanged');
  assert.equal(keys(wave15Profiles).length, 4);
  assert.deepEqual(keys(wave16Profiles), sorted(['inkwell-cartoon', 'imc-foundry', 'central-railway', 'sadida-canopy']));
  const previousIds = [...originalIds, ...keys(wave15Profiles)];
  assert.equal(new Set(previousIds).size, 12);
  const expectedIds = [...previousIds, ...keys(wave16Profiles)];
  assert.equal(new Set(expectedIds).size, 16, 'W16 environments must not replace historical biomes');
  assert.deepEqual(sorted(runtimeBiomes), sorted(expectedIds), 'Runtime environments must be exactly W15 plus four W16 profiles');
}
