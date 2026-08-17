import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import sharp from 'sharp';

import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';

const repositoryRoot = path.resolve(import.meta.dirname, '..');

test('every canon roster universe owns one validated unique runtime booster', async () => {
  assert.equal(CANON_ROSTER_WAVE.length, 172);

  const universes = CANON_ROSTER_WAVE.map(entry => entry.universe);
  const universeSet = new Set(universes);
  const mappedCanonUniverses = Object.keys(BOOSTER_ART_BY_UNIVERSE)
    .filter(universe => universeSet.has(universe));

  assert.equal(mappedCanonUniverses.length, universes.length);

  const seenPaths = new Set();
  const seenHashes = new Set();
  for (const universe of universes) {
    const publicPath = BOOSTER_ART_BY_UNIVERSE[universe];
    assert.equal(typeof publicPath, 'string', universe + ': missing catalogue mapping');
    assert.match(publicPath, /^\/boosters\/[a-z0-9][a-z0-9-]*\.webp$/);
    assert.equal(seenPaths.has(publicPath), false, universe + ': duplicate path ' + publicPath);
    seenPaths.add(publicPath);

    const filePath = path.join(
      repositoryRoot,
      'public',
      ...publicPath.split('/').filter(Boolean)
    );
    const [source, fileStats, metadata] = await Promise.all([
      readFile(filePath),
      stat(filePath),
      sharp(filePath, { failOn: 'error' }).metadata()
    ]);

    assert.equal(fileStats.isFile(), true, universe + ': booster is not a file');
    assert.ok(fileStats.size >= 50_000, universe + ': booster is too small');
    assert.ok(fileStats.size <= 800_000, universe + ': booster is too large');
    assert.equal(metadata.format, 'webp', universe + ': expected WebP');
    assert.equal(metadata.width, 640, universe + ': expected width 640');
    assert.equal(metadata.height, 960, universe + ': expected height 960');

    const digest = createHash('sha256').update(source).digest('hex');
    assert.equal(seenHashes.has(digest), false, universe + ': duplicate image hash');
    seenHashes.add(digest);
  }

  assert.equal(seenPaths.size, 172);
  assert.equal(seenHashes.size, 172);
});
