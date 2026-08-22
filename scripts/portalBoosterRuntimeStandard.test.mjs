import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import {
  BOOSTER_ART_BY_UNIVERSE,
  BOOSTER_ART_UNIVERSES
} from '../src/game/portalBoosterCatalog.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUNTIME_MANIFEST_PATH = path.join(
  REPOSITORY_ROOT,
  'public',
  'boosters',
  'original-worlds',
  'runtime-manifest.json'
);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const localPathFromPublicPath = publicPath => path.join(
  REPOSITORY_ROOT,
  'public',
  ...publicPath.split('/').filter(Boolean)
);

test('all 524 universe boosters use unique 640x960 WebP runtime assets', async () => {
  assert.equal(BOOSTER_ART_UNIVERSES.length, 524);
  const paths = new Set();
  const hashes = new Set();

  for (const universe of BOOSTER_ART_UNIVERSES) {
    const publicPath = BOOSTER_ART_BY_UNIVERSE[universe];
    assert.match(publicPath, /^\/boosters\/[a-z0-9][a-z0-9-]*\.webp$/, `${universe}: runtime path`);
    assert.ok(!paths.has(publicPath), `${universe}: duplicate runtime path ${publicPath}`);
    paths.add(publicPath);

    const filePath = localPathFromPublicPath(publicPath);
    const [buffer, fileStats, metadata] = await Promise.all([
      readFile(filePath),
      stat(filePath),
      sharp(filePath, { failOn: 'error' }).metadata()
    ]);
    assert.equal(fileStats.isFile(), true, `${universe}: runtime booster is not a file`);
    assert.ok(fileStats.size >= 50_000, `${universe}: runtime booster is too small`);
    assert.ok(fileStats.size <= 800_000, `${universe}: runtime booster is too large`);
    assert.equal(metadata.format, 'webp', `${universe}: expected WebP`);
    assert.equal(metadata.width, 640, `${universe}: expected width 640`);
    assert.equal(metadata.height, 960, `${universe}: expected height 960`);
    const hash = sha256(buffer);
    assert.ok(!hashes.has(hash), `${universe}: duplicate encoded runtime booster`);
    hashes.add(hash);
  }

  assert.equal(paths.size, 524);
  assert.equal(hashes.size, 524);
});

test('the 20 original booster masters remain provenance-backed PNG sources', async () => {
  const manifest = JSON.parse(await readFile(RUNTIME_MANIFEST_PATH, 'utf8'));
  assert.equal(manifest.contractId, 'multiverse-breach-original-booster-runtime-v1');
  assert.deepEqual(manifest.sourceContract, {
    provider: 'OpenAI',
    format: 'PNG',
    width: 1024,
    height: 1536,
    preserved: true
  });
  assert.deepEqual(manifest.runtimeContract, {
    format: 'WebP',
    width: 640,
    height: 960,
    resize: 'aspect-preserving-inside',
    crop: false,
    quality: 88
  });
  assert.equal(manifest.entries.length, 20);
  assert.equal(ORIGINAL_UNIVERSE_DEFINITIONS.length, 20);

  const entriesByWorldKey = new Map(manifest.entries.map(entry => [entry.worldKey, entry]));
  for (const definition of ORIGINAL_UNIVERSE_DEFINITIONS) {
    const entry = entriesByWorldKey.get(definition.key);
    assert.ok(entry, `${definition.key}: missing runtime derivative manifest entry`);
    assert.equal(definition.audiovisual.boosterSourceArt, entry.source.publicPath);
    assert.equal(definition.audiovisual.boosterArt, entry.runtime.publicPath);

    const [source, runtime, ledger] = await Promise.all([
      readFile(localPathFromPublicPath(entry.source.publicPath)),
      readFile(localPathFromPublicPath(entry.runtime.publicPath)),
      readFile(path.join(REPOSITORY_ROOT, ...entry.source.provenanceLedger.split('/')), 'utf8')
    ]);
    const sourceMetadata = await sharp(source, { failOn: 'error' }).metadata();
    const runtimeMetadata = await sharp(runtime, { failOn: 'error' }).metadata();
    const provenance = JSON.parse(ledger);

    assert.equal(sourceMetadata.format, 'png');
    assert.equal(sourceMetadata.width, 1024);
    assert.equal(sourceMetadata.height, 1536);
    assert.equal(sha256(source), entry.source.sha256);
    assert.equal(provenance.image.sha256, entry.source.sha256);
    assert.equal(provenance.generation.provider, 'OpenAI');
    assert.equal(runtimeMetadata.format, 'webp');
    assert.equal(runtimeMetadata.width, 640);
    assert.equal(runtimeMetadata.height, 960);
    assert.equal(sha256(runtime), entry.runtime.sha256);
  }
});
