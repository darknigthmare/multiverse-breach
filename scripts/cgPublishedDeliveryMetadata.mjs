import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Metadata receipts from GitHub 2333c2c0; these do not certify local image bytes.
export const CG_PUBLISHED_DELIVERY_METADATA_PINS = Object.freeze({
  'docs/cg/roster-production-2026-10-18.json': 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e',
  'docs/cg/roster-production-2026-10-18.md': '7f41a72e423643f671f9443b94ae50a20445a4522b95bdbd343f8e3651dbf0f4',
  'src/game/cg/cgRosterArtwork.generated.json': '1c4f17a19d17462ec9b2e4cadd3239c06706f5a7063d1420ef00da63faa47b5c',
  'src/game/cg/cgRevisions.generated.json': '243eac314849514ec628414ed534963fb1748e0daa9ecd56f251ff216c14d3ee',
  'public/cg/cg-manifest.json': 'd1432abdcaa07edfb654cfd1ef7b2f837a7ec35c6f05da57f2103f11fd236bee'
});
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const exact = (actual, expected, label) => {
  assert.equal(digest(JSON.stringify(actual)), digest(JSON.stringify(expected)), label);
  assert.deepEqual(actual, expected, label);
};

export function assertCgRecordedAssetMetadata(asset, variant) {
  assert.match(asset.path, /^\/cg\/[a-zA-Z0-9/_.,+-]+\.(?:png|webp)$/);
  assert.ok(!asset.path.split('/').includes('..'));
  assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  assert.ok(Number.isSafeInteger(asset.bytes) && asset.bytes > 0);
  assert.equal(asset.channels, 3);
  assert.equal(asset.format, variant === 'source' ? 'png' : 'webp');
  assert.equal(asset.width * 4, asset.height * 3);
  if (variant === 'source') assert.ok(asset.width >= 1000 && asset.height >= 1300);
  else assert.deepEqual([asset.width, asset.height], variant === 'master' ? [1536, 2048] : [384, 512]);
}

/** Frozen delivery declarations only; no call here claims to inspect a CG bitmap. */
export function loadCgPublishedDeliveryMetadata(root) {
  const documents = new Map();
  for (const [relative, sha256] of Object.entries(CG_PUBLISHED_DELIVERY_METADATA_PINS)) {
    const filename = path.join(root, relative);
    assert.ok(lstatSync(filename).isFile(), 'CG metadata source must remain a regular file: ' + relative);
    const bytes = readFileSync(filename);
    assert.equal(digest(bytes), sha256, 'Published CG metadata changed: ' + relative);
    if (relative.endsWith('.json')) documents.set(relative, JSON.parse(bytes));
  }
  const published = documents.get('docs/cg/roster-production-2026-10-18.json');
  const generated = published.entries.filter(entry => entry.generatedImageCount > 0);
  const byId = new Map(generated.map(entry => [entry.id, entry]));
  assert.equal(generated.length, 1436);
  assert.equal(byId.size, 1436);
  assert.equal(documents.get('src/game/cg/cgRosterArtwork.generated.json').entries.length, 1353);
  assert.equal(documents.get('public/cg/cg-manifest.json').entries.length, 83);
  for (const entry of generated) {
    assert.equal(entry.status, 'generated');
    assert.equal(entry.generatedImageCount, 1);
    assert.equal(entry.galleryRegistered, true);
    assert.deepEqual(Object.keys(entry.currentAssets).sort(), ['master', 'source', 'thumbnail']);
  }
  return Object.freeze({
    pins: CG_PUBLISHED_DELIVERY_METADATA_PINS,
    assetsForRevision(definition, hero, currentVersion, currentRevision) {
      const entry = byId.get(definition.id);
      assert.ok(entry, 'Unknown published CG revision: ' + definition.id);
      assert.equal(entry.characterId, hero.id);
      assert.equal(entry.type, definition.type);
      assert.equal(currentRevision.cgId, definition.id);
      assert.equal(entry.currentRevisionId, currentRevision.revisionId);
      assert.equal(entry.currentRevisionId, currentVersion.revisionId);
      const paths = { source: currentVersion.sourcePath, master: currentVersion.imagePath, thumbnail: currentVersion.thumbnailPath };
      for (const [variant, expectedPath] of Object.entries(paths)) {
        assertCgRecordedAssetMetadata(entry.currentAssets[variant], variant);
        assert.equal(entry.currentAssets[variant].path, expectedPath, 'Published CG revision path changed');
        const recorded = currentRevision.assets?.[variant];
        if (recorded) for (const field of ['path', 'sha256', 'bytes', 'width', 'height']) {
          assert.equal(entry.currentAssets[variant][field], recorded[field], 'Published CG revision metadata changed: ' + field);
        }
      }
      return structuredClone(entry.currentAssets);
    },
    assertDeliveredEntries(plan) {
      const actual = plan.entries.filter(entry => entry.generatedImageCount > 0);
      assert.equal(actual.length, generated.length, 'Metadata-only plan cannot add or remove CG deliveries');
      for (const entry of actual) {
        assert.ok(byId.has(entry.id), 'Metadata-only plan cannot create a CG delivery: ' + entry.id);
        exact(entry, byId.get(entry.id), 'Published delivered CG entry changed: ' + entry.id);
      }
      assert.equal(plan.summary.generated, generated.length);
    }
  });
}
