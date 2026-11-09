import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import path from 'node:path';
import { HEROES_DB } from '../src/game/heroes.js';
import { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } from '../src/game/canonicalSpriteQuarantine.js';

const catalog = JSON.parse(readFileSync(new URL('../docs/rift-dossiers/catalog.json', import.meta.url), 'utf8'));
const remediation = JSON.parse(readFileSync(new URL('../docs/rift-dossiers/canon-remediation-2026-10-01.json', import.meta.url), 'utf8'));
const sourceIds = new Map([
  ['freeman', 9202], ['ripley', 9204], ['predator', 9205], ['ripley_aliens', 9648],
  ['luke', 9325], ['vader', 9530], ['han_solo', 9531],
  ['kevin_minions', 10483], ['stuart_minions', 10484], ['bob_minions', 10485]
]);

// Exercise the production selection block without importing the catalog CLI,
// whose top-level execution would rewrite the generated catalog.
const builderSource = readFileSync(new URL('./buildRiftDossierCatalog.mjs', import.meta.url), 'utf8');
const selectionStart = builderSource.indexOf('        const quarantinedSourceSprite = ');
const selectionEnd = builderSource.indexOf('        const reportedEntry = ', selectionStart);
assert.ok(selectionStart >= 0 && selectionEnd > selectionStart);
const selectLocalCandidates = new Function('hero', 'arc', 'source', 'heroSpriteById',
  'projectRoot', 'path', 'existsSync', 'normalizePublicAssetPath', 'getQuarantinedCanonSprite',
  `${builderSource.slice(selectionStart, selectionEnd)}\nreturn { localReferenceCandidatePaths, sourceSpriteQuarantine };`);
const selection = (hero, current, manifest, fileExists = true) => selectLocalCandidates(
  hero, { heroId: hero.id }, { getHeroSpriteSheetSrc: () => current }, new Map([[hero.id, manifest]]),
  '/fixture', path, () => fileExists, value => value, getQuarantinedCanonSprite
);
const candidates = (...args) => selection(...args).localReferenceCandidatePaths;

test('Rift selection carries the explicit reviewed quarantine policy without approving its artwork', () => {
  for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
    const hero = HEROES_DB.find(actor => actor.id === id && actor.universe === record.universe);
    assert.deepEqual(selection(hero, null, record.asset).sourceSpriteQuarantine,
      { heroId: id, ...record, artApproved: false });
  }
  const aayla = HEROES_DB.find(actor => actor.id === 'aayla_secura' && actor.universe === 'Star Wars');
  assert.equal(selection(aayla, '/aayla.png', null).sourceSpriteQuarantine, null);
});

test('quarantined source editions cannot return through the Rift manifest fallback', () => {
  for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
    const hero = HEROES_DB.find(actor => actor.id === id && actor.universe === record.universe);
    assert.ok(hero && getQuarantinedCanonSprite(hero), id);
    assert.deepEqual(candidates(hero, null, record.asset), [], `${id}: empty public getter`);
    assert.deepEqual(candidates(hero, record.asset, record.asset), [], `${id}: existing old bitmap`);
  }
});

test('Rift quarantine matching preserves other incarnations and other universes', () => {
  for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
    const hero = HEROES_DB.find(actor => actor.id === id && actor.universe === record.universe);
    assert.deepEqual(candidates({ ...hero, incarnation: `${record.incarnation} - other edition` }, null, record.asset), [record.asset]);
    assert.deepEqual(candidates({ ...hero, universe: 'Custom fixture' }, null, record.asset), [record.asset]);
  }
});

test('unaffected Rift references keep current-file priority and the existing manifest fallback', () => {
  const hero = HEROES_DB.find(actor => actor.id === 'aayla_secura' && actor.universe === 'Star Wars');
  assert.equal(getQuarantinedCanonSprite(hero), null);
  assert.deepEqual(candidates(hero, '/current-aayla.png', '/legacy-aayla.png'), ['/current-aayla.png']);
  assert.deepEqual(candidates(hero, '/current-aayla.png', '/legacy-aayla.png', false), ['/legacy-aayla.png']);
  assert.deepEqual(candidates(hero, null, null), []);
});

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
