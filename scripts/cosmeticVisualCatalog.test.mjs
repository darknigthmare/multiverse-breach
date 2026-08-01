import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { GENERATED_UNIVERSE_COSMETIC_PACK_CATALOG } from '../src/game/cosmeticVisualPackCatalog.generated.js';
import { UNIVERSE_COSMETIC_VISUAL_PACKS } from '../src/game/cosmeticVisualAssets.js';
import {
  DEFAULT_COSMETIC_UNIVERSE_ROOT,
  REQUIRED_COSMETIC_WEBPS,
  collectCompleteUniverseCosmeticPackCandidates,
  collectCompleteUniverseCosmeticPacks,
  renderCosmeticVisualCatalog
} from './syncCosmeticVisualCatalog.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');

test('generated runtime catalog matches visually accepted packs on disk', () => {
  const scanned = collectCompleteUniverseCosmeticPacks();
  assert.deepEqual(GENERATED_UNIVERSE_COSMETIC_PACK_CATALOG, scanned);
  assert.equal(
    renderCosmeticVisualCatalog(scanned),
    renderCosmeticVisualCatalog(GENERATED_UNIVERSE_COSMETIC_PACK_CATALOG)
  );
  assert.deepEqual(
    Object.keys(UNIVERSE_COSMETIC_VISUAL_PACKS),
    scanned.map(({ universe }) => universe)
  );
  for (const { universe, hudHeight, portalFile } of scanned) {
    const pack = UNIVERSE_COSMETIC_VISUAL_PACKS[universe];
    assert.equal(pack.hudTheme.height, hudHeight);
    assert.ok(pack.portalEffect.sheet.endsWith(`/${portalFile}`));
  }
});

test('scanner excludes unreviewed packs and retains an accepted pilot P3 override', () => {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'cosmetic-catalog-'));
  try {
    const pilotSlug = '28-days-later';
    const source = path.join(DEFAULT_COSMETIC_UNIVERSE_ROOT, 'alien');
    const complete = path.join(temporaryRoot, pilotSlug);
    const incomplete = path.join(temporaryRoot, 'incomplete-pack');
    mkdirSync(complete);
    mkdirSync(incomplete);
    for (const file of [
      'reference-dossier.json',
      ...Object.values(REQUIRED_COSMETIC_WEBPS).map(({ file: requiredFile }) => requiredFile)
    ]) {
      cpSync(path.join(source, file), path.join(complete, file));
    }
    cpSync(
      path.join(source, REQUIRED_COSMETIC_WEBPS.portalEffect.file),
      path.join(complete, 'portal-effects-atlas-p3.webp')
    );
    cpSync(
      path.join(source, 'reference-dossier.json'),
      path.join(incomplete, 'reference-dossier.json')
    );

    const candidates = collectCompleteUniverseCosmeticPackCandidates(temporaryRoot);
    assert.equal(candidates.length, 1);
    assert.deepEqual(collectCompleteUniverseCosmeticPacks(temporaryRoot, []), []);
    const scanned = collectCompleteUniverseCosmeticPacks(temporaryRoot, [{
      universe: candidates[0].universe,
      slug: candidates[0].slug,
      packSha256: candidates[0].packSha256
    }]);
    assert.equal(scanned.length, 1);
    assert.equal(scanned[0].universe, 'Alien');
    assert.equal(scanned[0].portalFile, 'portal-effects-atlas-p3.webp');
    assert.equal(scanned[0].hudHeight, 512);
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test('scanner rejects a stale visual acceptance fingerprint', () => {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'cosmetic-catalog-stale-'));
  try {
    const slug = 'alien';
    const source = path.join(DEFAULT_COSMETIC_UNIVERSE_ROOT, slug);
    const complete = path.join(temporaryRoot, slug);
    mkdirSync(complete);
    for (const file of [
      'reference-dossier.json',
      ...Object.values(REQUIRED_COSMETIC_WEBPS).map(({ file: requiredFile }) => requiredFile)
    ]) {
      cpSync(path.join(source, file), path.join(complete, file));
    }
    assert.throws(
      () => collectCompleteUniverseCosmeticPacks(temporaryRoot, [{
        universe: 'Alien',
        slug,
        packSha256: '0'.repeat(64)
      }]),
      /asset fingerprint is stale/
    );
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test('catalog check does not require 380 packs unless explicitly requested', () => {
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, 'scripts', 'syncCosmeticVisualCatalog.mjs'), '--check'],
    { cwd: projectRoot, encoding: 'utf8' }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Checked \d+ visually accepted cosmetic packs\./);
});
