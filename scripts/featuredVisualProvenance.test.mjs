import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildFeaturedVisualPromptEntries } from './buildFeaturedVisualPromptPack.mjs';
import {
  FEATURED_UNIVERSE_ICONS,
  FEATURED_UNIVERSE_KEYS
} from '../src/game/featuredUniversePacks.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const ledgerPath = path.join(
  projectRoot,
  'public',
  'images',
  'generated',
  'featured-openai-icon-provenance.json'
);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const EXPECTED_EXECUTION_IDS = Object.freeze({
  Tomba: 'exec-3dd38153-b83c-4d37-8f7b-9a7c3ef26ce7',
  Woodruff: 'exec-2a1dfdec-2b28-4fd0-98b2-d2a695db21c7',
  Hellraiser: 'exec-f55e41b4-bfc5-47ff-8bc6-031fd7cf492f',
  'A Nightmare on Elm Street': 'exec-457e028a-a4f9-4c01-bec8-19eebbfc6e45',
  'The Ring': 'exec-14d37adf-90ba-4f90-b3ac-5f964ecfbeba',
  'The Grudge': 'exec-1b2b2a38-46e9-4297-9ffc-b6486c7e9b43'
});

test('featured OpenAI icon ledger matches exact prompts and installed sRGB PNGs', async () => {
  assert.equal(existsSync(ledgerPath), true, 'Missing featured icon provenance ledger');
  const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ledger.kind, 'featured-openai-universe-icon-provenance');
  assert.deepEqual(ledger.promptContract, {
    source: 'scripts/buildFeaturedVisualPromptPack.mjs',
    builder: 'buildFeaturedVisualPromptEntries',
    entryKind: 'universe-icon'
  });
  assert.deepEqual(
    ledger.entries.map(entry => entry.universe),
    FEATURED_UNIVERSE_KEYS
  );
  assert.equal(new Set(ledger.entries.map(entry => entry.output)).size, ledger.entries.length);
  assert.equal(
    new Set(ledger.entries.map(entry => entry.generation.executionId)).size,
    ledger.entries.length
  );

  const promptByUniverse = new Map(
    buildFeaturedVisualPromptEntries()
      .filter(entry => entry.kind === 'universe-icon')
      .map(entry => [entry.universe, entry])
  );

  for (const entry of ledger.entries) {
    const promptEntry = promptByUniverse.get(entry.universe);
    assert.ok(promptEntry, `${entry.universe}: missing exact generated icon prompt`);
    assert.equal(entry.output, FEATURED_UNIVERSE_ICONS[entry.universe]);
    assert.equal(entry.output, promptEntry.output);
    assert.equal(entry.promptSha256, sha256(promptEntry.prompt));
    assert.equal(entry.generation.provider, 'OpenAI');
    assert.equal(entry.generation.interface, 'built-in image_gen');
    assert.equal(entry.generation.executionId, EXPECTED_EXECUTION_IDS[entry.universe]);
    assert.match(entry.generation.executionId, /^exec-[0-9a-f-]{36}$/u);

    const imagePath = path.join(projectRoot, 'public', entry.output.replace(/^\//u, ''));
    assert.equal(existsSync(imagePath), true, `${entry.universe}: missing ${entry.output}`);
    const imageBytes = readFileSync(imagePath);
    assert.equal(sha256(imageBytes), entry.image.sha256);
    const metadata = await sharp(imageBytes).metadata();
    assert.deepEqual(
      {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        colorSpace: metadata.space
      },
      {
        width: entry.image.width,
        height: entry.image.height,
        format: entry.image.format,
        colorSpace: entry.image.colorSpace.toLowerCase()
      }
    );
    assert.equal(metadata.width, 512);
    assert.equal(metadata.height, 512);
    assert.equal(metadata.space, 'srgb');
  }

  const ring = ledger.entries.find(entry => entry.universe === 'The Ring');
  assert.equal(
    ring.generation.parentExecutionId,
    'exec-7bf05682-c7f5-4456-b6bf-d9cac2f850ea'
  );
  assert.equal(
    ledger.entries.filter(entry => entry.generation.parentExecutionId).length,
    1,
    'Only the final edited Ring icon should declare a parent generation'
  );
});
