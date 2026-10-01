import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { reconcileHeroSpriteManifest, sha256, verifyHeroSpriteProof } from './reconcileHeroSpriteManifest.mjs';

const fixture = async () => {
  const image = await sharp({ create: { width: 4, height: 4, channels: 4, background: { r: 80, g: 120, b: 240, alpha: 0.7 } } }).png().toBuffer();
  const entry = {
    kind: 'hero', id: 'test_hero', output: '/sprites/generated/heroes/test/test-hero.png',
    frame: { width: 1, height: 1, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    available: false, source: null, provenanceStatus: 'missing'
  };
  const catalog = { ...entry, prompt: 'Character from the precise 1987 incarnation.' };
  const generationPrompt = 'Original art with researched silhouette and the precise costume.';
  const record = {
    schemaVersion: 2, kind: entry.kind, id: entry.id, output: entry.output,
    prompt: catalog.prompt, promptSha256: sha256(catalog.prompt),
    catalogPrompt: catalog.prompt, catalogPromptSha256: sha256(catalog.prompt),
    generationPrompt, generationPromptSha256: sha256(generationPrompt),
    generation: { provider: 'OpenAI', interface: 'built-in image_gen', generationId: 'exec-valid-image-20261001' },
    image: { width: 4, height: 4, channels: 4, sha256: sha256(image) }
  };
  const manifest = { entries: [entry], availableCounts: { heroes: 0, total: 0 } };
  const options = { manifest, catalog: [catalog], ledger: [record], readAsset: async () => image, reconciledAt: '2026-10-01T10:00:00.000Z' };
  return { image, entry, catalog, record, manifest, options };
};

test('restores a falsely missing sprite only after all latest proofs match', async () => {
  const { options, record } = await fixture();
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.failures.length, 0);
  assert.equal(result.changes.length, 1);
  assert.equal(result.manifest.entries[0].available, true);
  assert.equal(result.manifest.entries[0].outputSha256, record.image.sha256);
  assert.equal(result.manifest.availableCounts.heroes, 1);
  assert.equal(result.manifest.missingCounts.heroes, 0);
  assert.equal(result.manifest.verifiedOpenAiCounts.heroes, 1);
  assert.equal(result.manifest.entries[0].visualReviewStatus, 'pending');
  assert.equal(result.changes[0].visualFidelityApproved, false);
});

test('refreshes stale provenance without changing already present availability', async () => {
  const { options, entry } = await fixture();
  Object.assign(entry, { available: true, source: 'openai', provenanceStatus: 'legacy-openai-declared' });
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.changes[0].wasAvailable, true);
  assert.equal(result.manifest.entries[0].provenanceStatus, 'verified-openai');
});

test('preserves historical records with no generation ledger', async () => {
  const { options, entry } = await fixture();
  Object.assign(entry, { available: true, source: 'openai', provenanceStatus: 'legacy-openai-declared' });
  const result = await reconcileHeroSpriteManifest({ ...options, ledger: [] });
  assert.deepEqual(result.manifest.entries[0], entry);
  assert.equal(result.verifiedHeroes, 0);
  assert.equal(result.heroesWithoutLedger, 1);
});

test('a missing image cannot be marked available from a ledger alone', async () => {
  const { options } = await fixture();
  const result = await reconcileHeroSpriteManifest({ ...options, readAsset: async () => { throw new Error('ENOENT'); } });
  assert.equal(result.changes.length, 0);
  assert.equal(result.manifest.entries[0].available, false);
  assert.deepEqual(result.failures[0].problems, ['missing-image']);
});

test('a modified installed image rejects provenance restoration', async () => {
  const { options, image } = await fixture();
  const tampered = Buffer.from(image);
  tampered[tampered.length - 1] ^= 1;
  const result = await reconcileHeroSpriteManifest({ ...options, readAsset: async () => tampered });
  assert.equal(result.changes.length, 0);
  assert.ok(result.failures[0].problems.includes('installed-image-hash-mismatch'));
});

test('the current catalog prompt must match the recorded catalog prompt', async () => {
  const { options, catalog } = await fixture();
  catalog.prompt = 'A later incarnation with another weapon.';
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.changes.length, 0);
  assert.ok(result.failures[0].problems.includes('catalog-prompt-hash-mismatch'));
});

test('a tampered actual generation prompt cannot hide behind a matching catalog hash', async () => {
  const { options, record } = await fixture();
  record.generationPrompt = 'Unrecorded substitute character.';
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.changes.length, 0);
  assert.ok(result.failures[0].problems.includes('generation-prompt-hash-mismatch'));
});

test('proof belonging to another output cannot be reused', async () => {
  const { options, record } = await fixture();
  record.output = '/sprites/generated/heroes/test/another-hero.png';
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.changes.length, 0);
  assert.ok(result.failures[0].problems.includes('record-identity-mismatch'));
});

test('a bad latest record is not replaced with an earlier matching proof', async () => {
  const { options, record } = await fixture();
  const later = { ...record, image: { ...record.image, sha256: 'a'.repeat(64) } };
  const result = await reconcileHeroSpriteManifest({ ...options, ledger: [record, later] });
  assert.equal(result.changes.length, 0);
  assert.ok(result.failures[0].problems.includes('installed-image-hash-mismatch'));
});

test('repeating reconciliation is idempotent and preserves its audit timestamp', async () => {
  const { options } = await fixture();
  const first = await reconcileHeroSpriteManifest(options);
  const second = await reconcileHeroSpriteManifest({ ...options, manifest: first.manifest, reconciledAt: '2026-10-02T10:00:00.000Z' });
  assert.deepEqual(second.manifest, first.manifest);
  assert.equal(second.changes.length, 0);
});

test('a documented intentional substitute is not certified as faithful 1:1', async () => {
  const { options, record } = await fixture();
  record.generationPrompt = 'A completely original nonhuman automaton, with no resemblance to any existing franchise.';
  record.generationPromptSha256 = sha256(record.generationPrompt);
  const result = await reconcileHeroSpriteManifest(options);
  assert.equal(result.verifiedHeroes, 1);
  assert.equal(result.manifest.entries[0].visualReviewStatus, 'pending');
  assert.equal(result.changes[0].visualFidelityApproved, false);
  assert.match(result.manifest.assetStatusPolicy.verifiedOpenAi, /not approval of visual fidelity/u);
});

test('non-OpenAI generation and invalid identifiers reject the recorded proof', async () => {
  const data = await fixture();
  data.record.generation.provider = 'Other';
  data.record.generation.generationId = 'not-a-generation-id';
  const proof = verifyHeroSpriteProof(data);
  assert.equal(proof.verified, false);
  assert.ok(proof.problems.includes('unsupported-generation-provider'));
  assert.ok(proof.problems.includes('invalid-generation-identifier'));
});

test('a ledger-matching image with the wrong sprite geometry is rejected', async () => {
  const data = await fixture();
  data.record.image.sha256 = sha256(data.image);
  data.entry.frame.width = 2;
  assert.ok(verifyHeroSpriteProof(data).problems.includes('invalid-sprite-sheet-geometry'));
});

test('nonhero records and their counts remain unchanged', async () => {
  const { options } = await fixture();
  const boss = { kind: 'boss', id: 'missing_boss', available: false, provenanceStatus: 'missing' };
  options.manifest.entries.push(boss);
  const result = await reconcileHeroSpriteManifest(options);
  assert.deepEqual(result.manifest.entries[1], boss);
  assert.equal(result.manifest.counts.bosses, 1);
  assert.equal(result.manifest.missingCounts.bosses, 1);
});
