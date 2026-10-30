import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { readStaticStages } from './riftDossierStaticStages.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const hubSource = read('src/components/HubScreen.jsx');
const catalog = JSON.parse(read('docs/rift-dossiers/catalog.json'));
const registry = JSON.parse(read('src/game/riftDossierAssets.json'));
const remediation = JSON.parse(read('docs/rift-dossiers/canon-remediation-2026-10-01.json'));
const ledger = read('public/images/rift-dossiers/openai/openai-prompts.jsonl').trim().split('\n').map(line => JSON.parse(line));

const metadataRevisions = JSON.parse(read('docs/rift-dossiers/canon-metadata-revisions-2026-10-25.json'));
const effectivePromptHash = (affected, revisions = metadataRevisions.revisions) => {
  let value = affected.currentPromptSha256;
  const seen = new Set();
  for (const revision of revisions.filter(row => row.stageId === affected.stageId)) {
    assert.equal(revision.scope, 'gameplay-metadata-only');
    assert.equal(seen.has(revision.stageId), false, 'A metadata transition cannot be repeated');
    seen.add(revision.stageId);
    assert.equal(revision.assetPath, affected.currentAssetPath, 'Metadata cannot retarget an image');
    assert.match(revision.previousPromptSha256, /^[a-f0-9]{64}$/);
    assert.match(revision.currentPromptSha256, /^[a-f0-9]{64}$/);
    assert.notEqual(revision.previousPromptSha256, revision.currentPromptSha256);
    if (value === revision.currentPromptSha256) {
      // A later master commit may already have incorporated this exact text-only
      // revision into remediation. Prove the *prior* prompt rather than replaying it.
      const current = catalog.entrees.find(row => row.id === affected.stageId);
      assert.ok(current && current.promptOpenAI.includes(revision.currentGameplayAdaptation));
      const oldPrompt = current.promptOpenAI.replace(revision.currentGameplayAdaptation, revision.previousGameplayAdaptation);
      assert.equal(hash(oldPrompt), revision.previousPromptSha256, 'Preserved pre-revision prompt must remain verifiable');
      assert.equal(affected.currentGameplayAdaptation, revision.currentGameplayAdaptation);
      continue;
    }
    assert.equal(revision.previousPromptSha256, value, 'Metadata revision must extend the preserved prompt history');
    value = revision.currentPromptSha256;
  }
  return value;
};

test('static dossiers resolve shared runtime stages and retain all 39 unique stage IDs', () => {
  const stages = readStaticStages(hubSource);
  assert.equal(stages.length, 39);
  assert.deepEqual(stages.map(stage => stage.id), [...Array.from({ length: 38 }, (_, index) => index + 1), 90000]);
  assert.deepEqual(stages.find(stage => stage.id === 12), CANON_PRIORITY_STAGES.shadowMoses);
  assert.deepEqual(stages.find(stage => stage.id === 22), CANON_PRIORITY_STAGES.legatesCamp);
  assert.equal(stages.find(stage => stage.id === 30).name, "Rick's Garage Laboratory");
});

test('missing, duplicate or unknown shared stages fail the count and identity contracts', () => {
  assert.throws(() => readStaticStages(hubSource.replace('CANON_PRIORITY_STAGES.shadowMoses,', '')), /Static stage count drifted/);
  assert.throws(() => readStaticStages(hubSource.replace('CANON_PRIORITY_STAGES.shadowMoses,', 'CANON_PRIORITY_STAGES.shadowMoses, CANON_PRIORITY_STAGES.shadowMoses,')), /Static stage count drifted/);
  assert.throws(() => readStaticStages(hubSource.replace('CANON_PRIORITY_STAGES.shadowMoses,', 'CANON_PRIORITY_STAGES.missingStage,')), /Unknown shared static stage missingStage/);
});

test('corrected static prompts use their exact source instead of legacy MGS2 or Fallout 4 references', () => {
  for (const stage of Object.values(CANON_PRIORITY_STAGES)) {
    const entry = catalog.entrees.find(entry => entry.id === stage.id);
    assert.equal(entry.nom.en, stage.name);
    assert.equal(entry.boss, stage.canonicalBossName);
    const sourceReferences = [...new Set([stage.referenceUrl, ...(stage.referenceUrls || [])].filter(Boolean))];
    assert.deepEqual(entry.referenceUrls, sourceReferences);
    assert.deepEqual(entry.bossReferenceUrls, sourceReferences);
    assert.deepEqual(entry.ancragesVisuels, [
      stage.incarnation,
      stage.visualAnchor,
      ...(stage.gameplayAdaptation ? [`Project gameplay adaptation: ${stage.gameplayAdaptation}`] : [])
    ]);
    assert.equal(entry.bossVisualAnchor, stage.visualAnchor);
    assert.ok(entry.promptOpenAI.includes(stage.canonicalBossName));
    assert.ok(entry.promptOpenAI.includes(stage.incarnation));
    if (stage.gameplayAdaptation) assert.ok(entry.promptOpenAI.includes(stage.gameplayAdaptation));
  }
  assert.equal(catalog.comptesParFamille.statique, 39);
  assert.equal(catalog.total, 3199);
});

test('changed dossiers retain historical generation proof and cannot certify stale bitmaps', () => {
  assert.deepEqual(remediation.affectedStages.map(entry => entry.stageId), [
    ...Object.values(CANON_PRIORITY_STAGES).map(stage => stage.id),
    9202, 9204, 9205, 9325, 9530, 9531, 9648, 10483, 10484, 10485
  ].sort((left, right) => left - right));
  for (const affected of remediation.affectedStages) {
    const current = catalog.entrees.find(entry => entry.id === affected.stageId);
    const asset = registry.entries.find(entry => entry.stageId === affected.stageId);
    assert.match(affected.previousPromptSha256, /^[a-f0-9]{64}$/);
    assert.equal(Object.hasOwn(affected, 'historicalPrompt'), false);
    assert.equal(Object.hasOwn(affected, 'historicalGenerationId'), false);
    const currentPromptSha256 = effectivePromptHash(affected);
    assert.equal(hash(current.promptOpenAI), currentPromptSha256);
    assert.notEqual(affected.previousPromptSha256, currentPromptSha256);
    assert.equal(asset.assetPath, current.cheminCibleDedie);
    const currentFile = new URL(`../public${asset.assetPath}`, import.meta.url);
    const currentImageHash = existsSync(currentFile) ? hash(readFileSync(currentFile)) : null;
    const proof = ledger.filter(row => row.output === asset.assetPath);
    const matchesCurrentGeneration = proof.length === 1
      && proof[0].generation?.promptSha256 === currentPromptSha256
      && currentImageHash !== null
      && proof[0].image?.sha256 === currentImageHash;
    assert.equal(asset.status, matchesCurrentGeneration ? 'available' : 'pending');
    const historicalProofs = ledger.filter(row => row.output === affected.previousAssetPath);
    const historicalFile = new URL(`../public${affected.previousAssetPath}`, import.meta.url);
    if (affected.historicalImageSha256 === null) {
      assert.equal(affected.historicalLedgerPromptSha256, null);
      assert.equal(historicalProofs.length, 0, `Unexpected historical generation ${affected.stageId}`);
      assert.equal(existsSync(historicalFile), false, `Unrecorded historical bitmap ${affected.stageId}`);
      continue;
    }
    assert.match(affected.historicalImageSha256, /^[a-f0-9]{64}$/);
    assert.match(affected.historicalLedgerPromptSha256, /^[a-f0-9]{64}$/);
    assert.equal(historicalProofs.length, 1, `Expected one historical generation ${affected.stageId}`);
    const [historical] = historicalProofs;
    assert.equal(historical.output, affected.previousAssetPath);
    assert.equal(historical.generation.promptSha256, affected.historicalLedgerPromptSha256);
    assert.equal(historical.image.sha256, affected.historicalImageSha256);
    assert.equal(affected.historicalLedgerPromptSha256, affected.previousPromptSha256);
    if (typeof historical.prompt === 'string') assert.equal(hash(historical.prompt), affected.historicalLedgerPromptSha256);
    assert.equal(hash(readFileSync(historicalFile)), affected.historicalImageSha256);
  }
});


test('metadata followup preserves the historical remediation and proves the exact Sulaco text-only revision', () => {
  assert.equal(metadataRevisions.schemaVersion, 1);
  assert.equal(metadataRevisions.historicalRemediationFile, 'docs/rift-dossiers/canon-remediation-2026-10-01.json');
  assert.match(metadataRevisions.historicalRemediationSha256, /^[a-f0-9]{64}$/);
  assert.equal(hash(read(metadataRevisions.historicalRemediationFile)),
    metadataRevisions.integratedRemediationSha256 || metadataRevisions.historicalRemediationSha256);
  if (metadataRevisions.integratedRemediationSha256) {
    assert.notEqual(metadataRevisions.integratedRemediationSha256, metadataRevisions.historicalRemediationSha256);
  }
  assert.equal(metadataRevisions.revisions.length, 1);
  const [revision] = metadataRevisions.revisions;
  const affected = remediation.affectedStages.find(row => row.stageId === revision.stageId);
  const current = catalog.entrees.find(row => row.id === revision.stageId);
  assert.equal(revision.stageId, 3);
  assert.equal(revision.previousGameplayAdaptation, affected.currentGameplayAdaptation);
  assert.equal(revision.currentGameplayAdaptation, CANON_PRIORITY_STAGES.hadleysQueen.gameplayAdaptation);
  assert.equal(current.promptOpenAI.split(revision.currentGameplayAdaptation).length, 2);
  const historicalPrompt = current.promptOpenAI.replace(revision.currentGameplayAdaptation, revision.previousGameplayAdaptation);
  assert.equal(hash(historicalPrompt), revision.previousPromptSha256);
  assert.equal(hash(current.promptOpenAI), effectivePromptHash(affected));
  assert.equal(affected.visualReviewStatus, 'pending');
  assert.equal(affected.currentRegistryStatus, 'pending');
  for (const other of remediation.affectedStages.filter(row => row.stageId !== 3)) {
    assert.equal(effectivePromptHash(other), other.currentPromptSha256);
  }
});

test('metadata followup rejects broken history, changed image paths and repeated transitions', () => {
  const original = metadataRevisions.revisions[0];
  const affected = remediation.affectedStages.find(row => row.stageId === 3);
  for (const patch of [{ previousPromptSha256: '0'.repeat(64) }, { assetPath: '/different.webp' },
    { scope: 'image-approved' }, { currentPromptSha256: 'bad' },
    { currentPromptSha256: original.previousPromptSha256 }]) {
    assert.throws(() => effectivePromptHash(affected, [{ ...original, ...patch }]));
  }
  assert.throws(() => effectivePromptHash(affected, [original, original]));
});
