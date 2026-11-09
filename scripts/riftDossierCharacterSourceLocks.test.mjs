import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';

const catalog = JSON.parse(readFileSync(new URL('../docs/rift-dossiers/catalog.json', import.meta.url), 'utf8'));
const remediation = JSON.parse(readFileSync(new URL('../docs/rift-dossiers/canon-remediation-2026-10-01.json', import.meta.url), 'utf8'));
const sourceIds = new Map([
  ['freeman', 9202], ['ripley', 9204], ['predator', 9205], ['ripley_aliens', 9648],
  ['luke', 9325], ['vader', 9530], ['han_solo', 9531],
  ['kevin_minions', 10483], ['stuart_minions', 10484], ['bob_minions', 10485]
]);

test('source-locked characters carry their exact incarnation, equipment and visual anchor into their dossiers', () => {
  for (const [heroId, stageId] of sourceIds) {
    const hero = HEROES_DB.find(hero => hero.id === heroId);
    const entry = catalog.entrees.find(entry => entry.id === stageId);
    assert.ok(entry.promptOpenAI.includes(`selected source incarnation: ${hero.incarnation}`), heroId);
    assert.ok(entry.promptOpenAI.includes(`source-locked visual identity: ${hero.visualAnchor}`), heroId);
    assert.ok(entry.promptOpenAI.includes(`source-locked equipment: ${hero.equipment.join(', ')}`), heroId);
    assert.ok(entry.promptOpenAI.includes(hero.canonStatus), heroId);
    assert.deepEqual(entry.ancragesVisuels.slice(0, 2), [hero.incarnation, hero.visualAnchor], heroId);
    assert.doesNotMatch(entry.promptOpenAI, /combat role or archetype:|project primary palette cue:|project secondary palette cue:/, heroId);
  }
});

test('character references come from the selected hero and explicit subject, without inherited era mixing', () => {
  for (const [heroId, stageId] of sourceIds) {
    const hero = HEROES_DB.find(hero => hero.id === heroId);
    const entry = catalog.entrees.find(entry => entry.id === stageId);
    assert.deepEqual(entry.referenceUrls, [...new Set([
      hero.referenceUrl, ...(hero.referenceUrls || []), ...entry.bossReferenceUrls
    ].filter(Boolean))], heroId);
  }
  assert.doesNotMatch(catalog.entrees.find(entry => entry.id === 9202).referenceUrls.join(' '), /halflife1/);
  for (const stageId of [9325, 9530, 9531]) {
    assert.doesNotMatch(catalog.entrees.find(entry => entry.id === stageId).ancragesVisuels.join(' '), /Yavin|Tranchée/);
  }
  for (const stageId of [10483, 10484, 10485]) {
    assert.doesNotMatch(catalog.entrees.find(entry => entry.id === stageId).referenceUrls.join(' '), /rise-of-gru/);
  }
});

test('pending visual review does not turn a technically present sprite into an approved identity reference', () => {
  for (const [heroId, stageId] of sourceIds) {
    const hero = HEROES_DB.find(hero => hero.id === heroId);
    const entry = catalog.entrees.find(entry => entry.id === stageId);
    assert.equal(hero.visualReviewStatus, 'pending', heroId);
    assert.ok(entry.candidatsReferencesLocalesAudit.length > 0, heroId);
    assert.deepEqual(entry.referencesLocalesOpenAI, [], heroId);
    assert.ok(entry.promptOpenAI.includes('No local character bitmap is supplied.'), heroId);
    assert.doesNotMatch(entry.promptOpenAI, /Approved local character reference supplied:/, heroId);
  }
});

test('characters without a source lock keep semantic descriptors without invented incarnation metadata', () => {
  const controls = HEROES_DB.filter(hero => !hero.incarnation).slice(0, 3);
  assert.equal(controls.length, 3);
  for (const hero of controls) {
    const entry = catalog.entrees.find(entry => entry.famille === 'arc-personnage' && entry.personnage === hero.name);
    assert.ok(entry, hero.id);
    assert.ok(entry.promptOpenAI.includes(`named identity: ${hero.name}`), hero.id);
    assert.ok(entry.promptOpenAI.includes(`combat role or archetype: ${hero.category}`), hero.id);
    assert.doesNotMatch(entry.promptOpenAI, /selected source incarnation:|source-locked equipment:/, hero.id);
  }
});

test('source-lock remediations retain current source metadata alongside historical image evidence', () => {
  for (const [heroId, stageId] of sourceIds) {
    const hero = HEROES_DB.find(hero => hero.id === heroId);
    const affected = remediation.affectedStages.find(entry => entry.stageId === stageId);
    assert.ok(affected, heroId);
    assert.equal(affected.currentIncarnation, hero.incarnation, heroId);
    assert.deepEqual(affected.currentEquipment, hero.equipment, heroId);
    assert.equal(affected.currentVisualAnchor, hero.visualAnchor, heroId);
    assert.deepEqual(affected.currentReferenceUrls, catalog.entrees.find(entry => entry.id === stageId).referenceUrls, heroId);
  }
});
