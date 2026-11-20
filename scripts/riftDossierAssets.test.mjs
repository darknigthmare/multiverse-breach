import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  RIFT_DOSSIER_ASSET_COUNTS,
  RIFT_DOSSIER_ASSET_ENTRIES,
  RIFT_DOSSIER_ASSET_REGISTRY_META,
  auditRiftDossierAssetEntries,
  auditRiftDossierAssets,
  auditRiftDossierAssetPath,
  requireRiftDossierAssetSrc,
  resolveRiftDossierAssetSrc
} from '../src/game/riftDossierAssets.js';
import { createRiftDossierFileResolver } from './riftDossierMedia.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const riftDossierCatalog = JSON.parse(readFileSync(
  path.join(projectRoot, 'docs', 'rift-dossiers', 'catalog.json'),
  'utf8'
));
const toPublicFile = createRiftDossierFileResolver({ projectRoot, mediaRoot: process.env.RIFT_DOSSIER_MEDIA_ROOT });

test('rift dossier registry has a valid unique schema and all available files exist', () => {
  const audit = auditRiftDossierAssets({
    assetExists: assetPath => Boolean(toPublicFile(assetPath))
  });

  assert.deepEqual(RIFT_DOSSIER_ASSET_REGISTRY_META, {
    schemaVersion: 1,
    source: 'openai',
    assetRoot: '/images/rift-dossiers/openai/'
  });
  assert.equal(audit.valid, true, JSON.stringify(audit, null, 2));
  assert.equal(audit.counts.available, RIFT_DOSSIER_ASSET_COUNTS.available);
  assert.equal(audit.counts.pending, RIFT_DOSSIER_ASSET_COUNTS.pending);
  assert.equal(Object.hasOwn(RIFT_DOSSIER_ASSET_COUNTS, 'pending'), true);
  assert.equal(
    new Set(RIFT_DOSSIER_ASSET_ENTRIES.map(entry => String(entry.stageId))).size,
    RIFT_DOSSIER_ASSET_ENTRIES.length
  );
  assert.equal(
    new Set(RIFT_DOSSIER_ASSET_ENTRIES.map(entry => entry.assetPath)).size,
    RIFT_DOSSIER_ASSET_ENTRIES.length
  );
  assert.equal(RIFT_DOSSIER_ASSET_ENTRIES.length, riftDossierCatalog.total);

  const availableHashes = RIFT_DOSSIER_ASSET_ENTRIES
    .filter(entry => entry.status === 'available')
    .map((entry) => {
      const filePath = toPublicFile(entry.assetPath);
      assert.ok(filePath && existsSync(filePath), `${entry.stageId}: missing ${entry.assetPath}`);
      assert.ok(statSync(filePath).size > 0, `${entry.stageId}: empty ${entry.assetPath}`);
      return createHash('sha256').update(readFileSync(filePath)).digest('hex');
    });
  assert.equal(
    new Set(availableHashes).size,
    availableHashes.length,
    'Every available rift dossier must have a distinct bitmap'
  );
});

test('isolated Rift media supply absent files and LFS pointers while preserving local bytes and route containment', t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'rift-media-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const mediaRoot = path.join(root, 'isolated');
  const route = '/images/oc-worlds/v2/aevum/stages/stage-01.png';
  const localFile = path.join(root, 'public', route);
  const extraFile = path.join(mediaRoot, route);
  const pointer = 'version https://git-lfs.github.com/spec/v1\noid sha256:' + 'f'.repeat(64) + '\nsize 42\n';
  mkdirSync(path.dirname(extraFile), { recursive: true });
  mkdirSync(path.dirname(localFile), { recursive: true });
  writeFileSync(extraFile, 'isolated bytes');
  const resolveFile = createRiftDossierFileResolver({ projectRoot: root, mediaRoot });
  assert.equal(resolveFile(route), realpathSync(extraFile));
  writeFileSync(localFile, pointer);
  assert.equal(resolveFile(route), realpathSync(extraFile));
  assert.equal(createRiftDossierFileResolver({ projectRoot: root })(route), null);
  writeFileSync(localFile, 'local bytes');
  assert.equal(resolveFile(route), localFile);
  assert.equal(resolveFile('/images/oc-worlds/v2/aevum/stages/../stage-01.png'), null);
  rmSync(localFile);
  writeFileSync(extraFile, pointer);
  assert.equal(resolveFile(route), null);
  rmSync(extraFile);
  const outsideFile = path.join(root, 'outside.png');
  writeFileSync(outsideFile, 'outside');
  symlinkSync(outsideFile, extraFile);
  assert.equal(resolveFile(route), null);
  assert.throws(() => createRiftDossierFileResolver({ projectRoot: root, mediaRoot: outsideFile }), /must point to a directory/);
});

test('strict resolver never substitutes a fallback for missing or pending stages', () => {
  assert.equal(
    resolveRiftDossierAssetSrc(8801),
    '/images/rift-dossiers/openai/mission-8801-name-lock-v1.png'
  );
  assert.equal(resolveRiftDossierAssetSrc({ id: '8801' }), resolveRiftDossierAssetSrc(8801));
  assert.equal(resolveRiftDossierAssetSrc('stage-not-declared'), null);
  assert.equal(resolveRiftDossierAssetSrc(null), null);
  assert.throws(
    () => requireRiftDossierAssetSrc('stage-not-declared'),
    /No dedicated rift-dossier thumbnail/
  );
});

test('pending generation entries are counted explicitly without resolving as missing files', () => {
  const audit = auditRiftDossierAssetEntries(
    [{
      stageId: 'future-stage',
      assetPath: '/images/rift-dossiers/openai/future-stage-v1.png',
      status: 'pending'
    }],
    { assetExists: () => false }
  );

  assert.equal(audit.valid, true);
  assert.deepEqual(audit.counts, {
    declared: 1,
    available: 0,
    pending: 1,
    invalid: 0,
    missingFiles: 0,
    duplicateStageIds: 0,
    duplicateAssetPaths: 0
  });
});

test('path and uniqueness audits reject shared, unsafe, or ambiguous assets', () => {
  assert.equal(auditRiftDossierAssetPath('/backgrounds/shared-stage.webp').valid, false);
  assert.equal(
    auditRiftDossierAssetPath('/images/oc-worlds/v2/aevum/stages/stage-01.png').valid,
    true
  );
  assert.equal(
    auditRiftDossierAssetPath('/images/rift-dossiers/openai/../shared.png').valid,
    false
  );

  const duplicateAudit = auditRiftDossierAssetEntries([
    {
      stageId: 'duplicate',
      assetPath: '/images/rift-dossiers/openai/duplicate-v1.png',
      status: 'available'
    },
    {
      stageId: 'duplicate',
      assetPath: '/images/rift-dossiers/openai/duplicate-v1.png',
      status: 'available'
    }
  ]);

  assert.equal(duplicateAudit.valid, false);
  assert.deepEqual(duplicateAudit.duplicateStageIds, ['duplicate']);
  assert.deepEqual(
    duplicateAudit.duplicateAssetPaths,
    ['/images/rift-dossiers/openai/duplicate-v1.png']
  );
});
