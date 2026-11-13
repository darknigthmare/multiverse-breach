import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createLegacyStageCatalog } from '../src/game/legacyStageCatalog.js';
import { createUniverseModifiers } from '../src/game/universeModifiers.js';
import { readStaticStages } from './riftDossierStaticStages.mjs';

const hubSource = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');

test('the Hub keeps all static mission IDs while loading legacy DLC definitions', () => {
  const stages = readStaticStages(hubSource);
  assert.deepEqual(stages.map(stage => stage.id), [...Array.from({ length: 38 }, (_, index) => index + 1), 90000]);
  assert.equal(stages.find(stage => stage.id === 30).name, "Rick's Garage Laboratory");
  assert.equal(stages.find(stage => stage.id === 90000).universe, 'Nexus de Convergence');
  assert.equal(stages.find(stage => stage.id === 38).universe, 'Matrix');
});

test('the static reader rejects removed, duplicated and unknown DLC stage references', () => {
  const reference = 'LEGACY_STAGES[4],';
  assert.equal(hubSource.split(reference).length, 2);
  assert.throws(() => readStaticStages(hubSource.replace(reference, '')), /Static stage count drifted/);
  assert.throws(() => readStaticStages(hubSource.replace(reference, `${reference} ${reference}`)), /Static stage count drifted/);
  assert.throws(() => readStaticStages(hubSource.replace(reference, 'LEGACY_STAGES[999999],')), /Unknown legacy static stage 999999/);
  const mismatched = createLegacyStageCatalog();
  mismatched[4].id = 5;
  assert.throws(() => readStaticStages(hubSource, undefined, mismatched), /Unknown legacy static stage 4/);
});

test('render-local stage and modifier changes cannot leak into the next Hub projection', () => {
  const firstStages = createLegacyStageCatalog();
  const secondStages = createLegacyStageCatalog();
  const firstModifiers = createUniverseModifiers();
  const secondModifiers = createUniverseModifiers();
  assert.deepEqual(firstStages, secondStages);
  assert.deepEqual(firstModifiers, secondModifiers);
  firstStages[4].bossName = 'Temporary projection';
  firstModifiers.Alien.name.fr = 'Temporary label';
  firstModifiers.Alien.reward = 0;
  assert.equal(secondStages[4].bossName, 'Bad Blood Alpha');
  assert.equal(secondModifiers.Alien.name.fr, 'Sang acide');
  assert.equal(secondModifiers.Alien.reward, 1.2);
  assert.deepEqual(createLegacyStageCatalog(), secondStages);
  assert.deepEqual(createUniverseModifiers(), secondModifiers);
});
