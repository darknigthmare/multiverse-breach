import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const PUBLIC_ROOT = path.join(PROJECT_ROOT, 'public');
const MANIFEST_PATH = path.join(PUBLIC_ROOT, 'cg', 'cg-manifest.json');

const readManifest = async () => JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
const digestAsset = async (publicPath) => {
  const bytes = await readFile(path.join(PUBLIC_ROOT, publicPath.replace(/^\//, '')));
  return { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
};

test('the generated manifest covers the exact eighty-three-entry CG01-CG15 catalog', async () => {
  const manifest = await readManifest();
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.generationMode, 'openai-imagegen-built-in');
  assert.equal(manifest.publishedAt, '2026-08-01');
  assert.equal(manifest.total, 83);
  assert.equal(manifest.entries.length, CG_CATALOG.length);
  assert.deepEqual(manifest.entries.map(({ id }) => id), CG_CATALOG.map(({ id }) => id));
});

test('all 249 manifest fingerprints match delivered bytes and remain unique', async () => {
  const manifest = await readManifest();
  const fingerprints = [];
  for (const entry of manifest.entries) {
    for (const [variant, asset] of Object.entries(entry.assets)) {
      assert.match(asset.sha256, /^[a-f0-9]{64}$/, `${entry.id}/${variant} SHA-256`);
      assert.ok(asset.bytes > 0, `${entry.id}/${variant} byte size`);
      assert.deepEqual(await digestAsset(asset.path), {
        bytes: asset.bytes,
        sha256: asset.sha256
      });
      fingerprints.push(asset.sha256);
    }
  }
  assert.equal(fingerprints.length, 249);
  assert.equal(new Set(fingerprints).size, 249, 'source, master and thumbnail bytes must all differ');
});

test('manifest variants retain exact production dimensions and RGB delivery formats', async () => {
  const manifest = await readManifest();
  for (const entry of manifest.entries) {
    const { source, master, thumbnail } = entry.assets;
    assert.equal(source.format, 'png', `${entry.id} source format`);
    assert.equal(source.width * 4, source.height * 3, `${entry.id} source ratio`);
    assert.ok(source.width >= 1000, `${entry.id} source width`);
    assert.ok(source.height >= 1300, `${entry.id} source height`);
    assert.deepEqual(
      { format: master.format, width: master.width, height: master.height },
      { format: 'webp', width: 1536, height: 2048 }
    );
    assert.deepEqual(
      { format: thumbnail.format, width: thumbnail.width, height: thumbnail.height },
      { format: 'webp', width: 384, height: 512 }
    );
  }
});

test('manifest provenance preserves prompts, gates and explicit variant reference identities', async () => {
  const manifest = await readManifest();
  const referenceIds = new Set();
  const promptIds = new Set();
  for (const entry of manifest.entries) {
    assert.equal(entry.source, 'openai');
    assert.ok(entry.sourceRefs.length >= 3, `${entry.id} source references`);
    assert.match(entry.promptId, /^cg-[a-z0-9-]+-openai-v1$/);
    assert.ok(entry.ageStatus);
    assert.ok(entry.consentStatus);
    referenceIds.add(entry.characterReferenceId);
    promptIds.add(entry.promptId);
  }
  assert.equal(referenceIds.size, 23);
  assert.equal(promptIds.size, 83);
});
