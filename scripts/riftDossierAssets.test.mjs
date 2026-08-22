import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
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

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const riftDossierCatalog = JSON.parse(readFileSync(
  path.join(projectRoot, 'docs', 'rift-dossiers', 'catalog.json'),
  'utf8'
));
const toPublicFile = (assetPath) => path.join(
  projectRoot,
  'public',
  assetPath.replace(/^\//, '')
);

test('rift dossier registry has a valid unique schema and all available files exist', () => {
  const audit = auditRiftDossierAssets({
    assetExists: assetPath => existsSync(toPublicFile(assetPath))
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
      assert.equal(existsSync(filePath), true, `${entry.stageId}: missing ${entry.assetPath}`);
      assert.ok(statSync(filePath).size > 0, `${entry.stageId}: empty ${entry.assetPath}`);
      return createHash('sha256').update(readFileSync(filePath)).digest('hex');
    });
  assert.equal(
    new Set(availableHashes).size,
    availableHashes.length,
    'Every available rift dossier must have a distinct bitmap'
  );
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
