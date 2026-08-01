import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const APPROVALS_PATH = path.join(PROJECT_ROOT, 'docs', 'cg', 'character-reference-approvals.json');
const WAVE_APPROVALS_PATH = path.join(PROJECT_ROOT, 'docs', 'cg', 'wave-approvals.json');
const VARIANT_WAVE_APPROVALS_PATH = path.join(PROJECT_ROOT, 'docs', 'cg', 'variant-wave-approvals.json');

const CG_ASSETS = CG_CATALOG.map((definition) => {
  const sourcePublicPath = definition.imagePath.replace(/\.webp$/, '.png');
  return {
    id: definition.id,
    source: path.join(PROJECT_ROOT, 'public', sourcePublicPath.replace(/^\//, '')),
    master: path.join(PROJECT_ROOT, 'public', definition.imagePath.replace(/^\//, '')),
    thumbnail: path.join(PROJECT_ROOT, 'public', definition.thumbnailPath.replace(/^\//, ''))
  };
});

const assertImage = async (filePath, expected) => {
  const fileStats = await stat(filePath);
  assert.equal(fileStats.isFile(), true, `${filePath} must be a file`);
  assert.ok(fileStats.size > 0, `${filePath} must not be empty`);

  const metadata = await sharp(filePath, { failOn: 'error' }).metadata();
  assert.equal(metadata.format, expected.format, `${filePath} format`);
  assert.equal(metadata.width, expected.width, `${filePath} width`);
  assert.equal(metadata.height, expected.height, `${filePath} height`);
  assert.equal(metadata.channels, 3, `${filePath} must be RGB`);
  assert.equal(metadata.hasAlpha, false, `${filePath} must not have alpha`);
  return metadata;
};

test('all eighty-three OpenAI PNG sources are non-empty exact 3:4 RGB portraits', async () => {
  assert.equal(CG_ASSETS.length, 83);
  for (const asset of CG_ASSETS) {
    const metadata = await sharp(asset.source, { failOn: 'error' }).metadata();
    assert.equal(metadata.format, 'png', `${asset.source} format`);
    assert.ok(metadata.width >= 1000, `${asset.source} generation detail`);
    assert.ok(metadata.height >= 1300, `${asset.source} generation detail`);
    assert.equal(metadata.channels, 3, `${asset.source} must be RGB`);
    assert.equal(metadata.hasAlpha, false, `${asset.source} must not have alpha`);
    assert.equal(metadata.width * 4, metadata.height * 3, `${asset.id} exact 3:4 source ratio`);
    assert.ok((await stat(asset.source)).size > 0, `${asset.source} must not be empty`);
  }
});

test('all eighty-three CG masters are 1536x2048 RGB WebP images', async () => {
  for (const asset of CG_ASSETS) {
    await assertImage(asset.master, { format: 'webp', width: 1536, height: 2048 });
  }
});

test('all eighty-three CG thumbnails are 384x512 RGB WebP images', async () => {
  for (const asset of CG_ASSETS) {
    await assertImage(asset.thumbnail, { format: 'webp', width: 384, height: 512 });
  }
});

test('all eighty-three PNG sources have unique SHA-256 digests', async () => {
  const digests = [];
  for (const asset of CG_ASSETS) {
    const bytes = await readFile(asset.source);
    assert.ok(bytes.length > 0, `${asset.source} must not be empty`);
    digests.push(createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(new Set(digests).size, 83, 'all source images must be distinct');
});

test('the previous Continue ledger remains locked to CG06-CG08', async () => {
  const ledger = JSON.parse(await readFile(WAVE_APPROVALS_PATH, 'utf8'));
  assert.equal(ledger.approvalSignal, 'Continue');
  assert.equal(ledger.approvedBaseline.range, 'CG01-CG05');
  assert.equal(ledger.approvedBaseline.catalogEntryCount, 30);
  assert.equal(
    ledger.approvedBaseline.manifestSha256,
    'ff6bba12825e2d20f39999a5d04868752785be6300da53794c6ecac5152dd34e'
  );
  assert.equal(ledger.openedWave.range, 'CG06-CG08');
  assert.deepEqual(ledger.openedWave.types, ['introPose', 'victoryPose', 'defeatPose']);
  assert.equal(ledger.openedWave.targetEntryCount, 18);
});

test('the latest Continue ledger opens exactly thirty-five applicable CG09-CG15 variants', async () => {
  const ledger = JSON.parse(await readFile(VARIANT_WAVE_APPROVALS_PATH, 'utf8'));
  assert.equal(ledger.approvalSignal, 'Continue');
  assert.equal(ledger.approvedBaseline.range, 'CG01-CG08');
  assert.equal(ledger.approvedBaseline.catalogEntryCount, 48);
  assert.equal(
    ledger.approvedBaseline.manifestSha256,
    '5ee71ee95fcdd90cdda39a08e6c8c659b813d59911ebee8a6a5a16f342509d54'
  );
  assert.equal(ledger.openedWave.range, 'CG09-CG15');
  assert.equal(ledger.openedWave.targetEntryCount, 35);
  assert.equal(ledger.openedWave.generationAllowed, true);
  assert.deepEqual(ledger.openedWave.manualReview, {
    referenceDossiers: true,
    rightsAndLore: true,
    contentRating: 'family-safe fan art; non-graphic corruption',
    approvedBySignal: 'Continue'
  });
  assert.equal(
    ledger.openedWave.characters.reduce((total, character) => total + character.approvedTypes.length, 0),
    35
  );
  for (const character of ledger.openedWave.characters) {
    const catalogTypes = CG_CATALOG
      .filter(({ characterId, family }) => (
        characterId === character.characterId && ['Fan Art', 'What If'].includes(family)
      ))
      .map(({ type }) => type);
    assert.deepEqual(catalogTypes, character.approvedTypes, `${character.characterId} ledger/catalog sync`);
  }
  assert.deepEqual(ledger.excluded, [
    'romantic affection',
    'furryHuman option',
    'new characters',
    'new universes'
  ]);
});

test('the six approved CG01 identity anchors still match their locked hashes', async () => {
  const ledger = JSON.parse(await readFile(APPROVALS_PATH, 'utf8'));
  assert.equal(ledger.approvalSignal, 'Continue');
  assert.equal(ledger.entries.length, 6);
  for (const entry of ledger.entries) {
    assert.equal(entry.approvedForCg02To05, true);
    const absolutePath = path.join(PROJECT_ROOT, 'public', entry.path.replace(/^\/cg\//, 'cg/'));
    const digest = createHash('sha256').update(await readFile(absolutePath)).digest('hex');
    assert.equal(digest, entry.sha256, `${entry.characterId} approval hash`);
  }
});
