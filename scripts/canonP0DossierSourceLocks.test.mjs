import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { createServer } from 'vite';

import { HEROES_DB } from '../src/game/heroes.js';
import { CANON_P0_SOURCE_KIT_IDS } from '../src/game/canonP0SourceKits.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';

const readJson = relative => JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8'));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const catalog = readJson('../docs/rift-dossiers/catalog.json');
const registry = readJson('../src/game/riftDossierAssets.json');
const remediation = readJson('../docs/rift-dossiers/canon-p0-source-remediation-2026-10-01.json');
const heroes = new Map(HEROES_DB.map(hero => [hero.id, hero]));
let vite;
let plaques;
let arcs;

test.before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  plaques = await vite.ssrLoadModule('/src/game/characterPlaques.js?p0-dossier-tests');
  const narrative = await vite.ssrLoadModule('/src/game/narrativeSystems.js?p0-dossier-tests');
  arcs = narrative.CHARACTER_NARRATIVE_ARCS;
});
test.after(async () => { await vite?.close(); });

test('the nineteen playable identities, actual character arcs and public archive plaques share the same incarnation', () => {
  assert.equal(remediation.affectedStages.length, 19);
  assert.deepEqual(remediation.affectedStages.map(entry => entry.heroId).sort(), [...CANON_P0_SOURCE_KIT_IDS].sort());
  for (const affected of remediation.affectedStages) {
    const hero = heroes.get(affected.heroId);
    const arc = arcs.find(entry => entry.heroId === hero.id);
    assert.ok(arc, hero.id);
    assert.equal(arc.stageId, affected.stageId, hero.id);
    assert.equal(hero.canonCombatPresentation, true, hero.id);
    assert.equal(hero.visualReviewStatus, 'pending', hero.id);
    const plaque = plaques.getCharacterPlaque(hero);
    assert.equal(plaque.origin.en, hero.incarnation, hero.id);
    assert.equal(plaque.dossier.en, hero.loreLocalized.en, hero.id);
    assert.match(plaque.doctrine.en, /(?:game adaptation|adapt the source to combat)/, hero.id);
    assert.match(plaque.doctrine.en, /visual review remains pending/, hero.id);
  }
});

test('the dedicated dossiers use source references, props and anchors from the selected hero rather than franchise defaults', () => {
  for (const affected of remediation.affectedStages) {
    const hero = heroes.get(affected.heroId);
    const entry = catalog.entrees.find(entry => entry.id === affected.stageId);
    assert.ok(entry, hero.id);
    assert.equal(entry.famille, 'arc-personnage', hero.id);
    assert.deepEqual(entry.ancragesVisuels.slice(0, 2), [hero.incarnation, hero.visualAnchor], hero.id);
    assert.equal(entry.verrouSourcePersonnage.incarnation, hero.incarnation, hero.id);
    assert.deepEqual(entry.verrouSourcePersonnage.equipment, hero.equipment, hero.id);
    assert.deepEqual(entry.referenceUrls, [...new Set([
      hero.referenceUrl, ...hero.referenceUrls, ...entry.bossReferenceUrls
    ].filter(Boolean))], hero.id);
    assert.ok(entry.promptOpenAI.includes(`source-locked equipment: ${hero.equipment.join(', ')}`), hero.id);
    assert.ok(entry.promptOpenAI.includes(`selected source incarnation: ${hero.incarnation}`), hero.id);
  }
});

test('present hero sprites remain audit candidates and do not approve the nineteen missing dossier images', () => {
  for (const affected of remediation.affectedStages) {
    const hero = heroes.get(affected.heroId);
    const entry = catalog.entrees.find(entry => entry.id === affected.stageId);
    const sprite = getHeroSpriteSheetSrc(hero);
    assert.equal(existsSync(new URL(`../public${sprite}`, import.meta.url)), true, hero.id);
    assert.ok(entry.candidatsReferencesLocalesAudit.length > 0, hero.id);
    assert.deepEqual(entry.referencesLocalesOpenAI, [], hero.id);
    assert.ok(entry.promptOpenAI.includes('No local character bitmap is supplied.'), hero.id);
    assert.doesNotMatch(entry.promptOpenAI, /Approved local character reference supplied:/, hero.id);
    assert.equal(registry.entries.find(item => item.stageId === entry.id).status, 'pending', hero.id);
    assert.equal(affected.visualFidelityApproved, false, hero.id);
  }
});

test('the public remediation hashes match the current prompts and retain the source-lock metadata without publishing historical prompt bodies', () => {
  const forbiddenKeys = new Set(['promptOpenAI', 'prompt', 'generationId', 'generationID', 'requestId', 'requestID',
    'currentLocalReferencePaths', 'historicalGenerationRecord', 'historicalPrompt']);
  function checkPublicShape(value) {
    if (Array.isArray(value)) return value.forEach(checkPublicShape);
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        assert.equal(forbiddenKeys.has(key), false, key);
        checkPublicShape(child);
      }
    } else if (typeof value === 'string') {
      assert.doesNotMatch(value, /(?:^|\s)(?:\/workspace\/|\/tmp\/)/);
    }
  }
  checkPublicShape(remediation);
  for (const affected of remediation.affectedStages) {
    const hero = heroes.get(affected.heroId);
    const entry = catalog.entrees.find(entry => entry.id === affected.stageId);
    assert.match(affected.oldPromptSha256, /^[a-f0-9]{64}$/);
    assert.notEqual(affected.oldPromptSha256, affected.currentPromptSha256, hero.id);
    assert.equal(affected.currentPromptSha256, sha256(entry.promptOpenAI), hero.id);
    assert.equal(affected.incarnation, hero.incarnation, hero.id);
    assert.deepEqual(affected.equipment, hero.equipment, hero.id);
    assert.equal(affected.visualAnchor, hero.visualAnchor, hero.id);
    assert.deepEqual(affected.referenceUrls, entry.referenceUrls, hero.id);
  }
});

test('source corrections preserve the immutable historical generation ledger while allowing future evidence to be appended', () => {
  const ledger = readFileSync(new URL('../public/images/rift-dossiers/openai/openai-prompts.jsonl', import.meta.url));
  const proof = remediation.historicalLedgerProof;
  assert.ok(proof.recordCount > 0);
  assert.ok(ledger.length >= proof.byteLength);
  assert.equal(sha256(ledger.subarray(0, proof.byteLength)), proof.prefixSha256);
  assert.equal(ledger.subarray(0, proof.byteLength).toString('utf8').split(/\r?\n/u).filter(Boolean).length, proof.recordCount);
  assert.deepEqual(remediation.visualP0Status, { tracked: 25, approved: 0, allPending: true });
});
