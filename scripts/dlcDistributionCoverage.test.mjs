import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { buildDlcSharedAssetCoverage } from './dlcSharedAssetCoverage.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'dlc-shared-coverage-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (file, data) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), data);
  };
  write('DLC/Halo/manifest.json', JSON.stringify({ schemaVersion: 1, id: 'halo', universe: 'Halo', directory: 'DLC/Halo',
    registration: 'runtime', catalogOrder: 1, assetManifest: 'assets.json',
    modules: [{ path: 'data/backdrop.js', runtimeAdapter: 'src/game/backdrop.js' }] }));
  write('DLC/Halo/data/backdrop.js', "export const image = '/backgrounds/shared.png';\n");
  write('DLC/shared-assets.json', JSON.stringify({ schemaVersion: 1, assets: [
    { sourcePath: 'public/backgrounds/shared.png', publicPath: '/backgrounds/shared.png', reason: 'multiple-universe-references', referencedBy: ['Halo', 'Other'] },
    { sourcePath: 'public/images/unknown.png', publicPath: '/images/unknown.png', reason: 'shared-or-unclassified' },
  ] }));
  write('public/backgrounds/shared.png', Buffer.from([0, 255, 42, 10]));
  write('public/images/unknown.png', Buffer.from([0, 255, 1]));
  write('src/game/data.json', JSON.stringify({ comment: 'registry fixture', image: '/images/unknown.png' }));
  return { root, write };
}

test('shared coverage is deterministic, counts canonical bytes once, and never authorizes pruning from missing literals', t => {
  const { root, write } = fixture(t);
  const first = buildDlcSharedAssetCoverage({ root });
  assert.deepEqual(buildDlcSharedAssetCoverage({ root }), first);
  assert.equal(first.totals.sharedBytes, 7);
  assert.equal(first.totals.assetsWithLiteral, 2);
  assert.equal(first.totals.dlcOnlyLiteralCandidates, 1);
  assert.equal(first.totals.approvedForRemoval, 0);
  assert.equal(first.multiUniverseAssets[0].mayPrune, false);
  assert.equal(first.multiUniverseAssets[0].retention, 'dynamic-closure-unproven');
  write('src/components/Intro.jsx', 'export const intro = <main style={{ backgroundImage: "url(/backgrounds/shared.png)" }} />;\n');
  const changed = buildDlcSharedAssetCoverage({ root });
  assert.notEqual(changed.inputs.sourceInventorySha256, first.inputs.sourceInventorySha256);
  assert.equal(changed.totals.dlcOnlyLiteralCandidates, 0);
  assert.equal(changed.multiUniverseAssets[0].retention, 'common-ui-reference');
  assert.ok(changed.multiUniverseAssets[0].literalSourceFiles.includes('src/components/Intro.jsx'));
  assert.equal(changed.totals.approvedForRemoval, 0);
});

test('shared coverage refuses missing real media and LFS placeholders instead of reporting their pointer size', t => {
  const { root, write } = fixture(t);
  rmSync(join(root, 'public/images/unknown.png'));
  assert.throws(() => buildDlcSharedAssetCoverage({ root }), /ENOENT/);
  write('public/images/unknown.png', 'version https://git-lfs.github.com/spec/v1\noid sha256:' + 'a'.repeat(64) + '\nsize 100000\n');
  assert.throws(() => buildDlcSharedAssetCoverage({ root }), /not an LFS pointer/);
});
