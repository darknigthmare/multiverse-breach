import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createDlcInstallation } from '../src/game/dlcInstallation.js';
import { buildDlcDistributionPlan, resolveDlcSelection } from './dlcDistribution.mjs';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import { exportDlcDistribution } from './exportDlcDistribution.mjs';
import { applyDlcDistributionDelta, createDlcDistributionDelta } from './dlcDistributionDelta.mjs';
import { DLC_SHARED_DEPENDENCIES, REVIEWED_SHARED_POLICY } from './dlcSharedAssetDependencies.mjs';
import { createSharedDependencyFixture } from './fixtures/dlcSharedDependencyFixture.mjs';

const profile = (packIds = [], sharedPolicy = REVIEWED_SHARED_POLICY) => ({ schemaVersion: 1,
  mode: packIds === 'all' ? 'all' : packIds.length ? 'selected' : 'base', packIds: packIds === 'all' ? [] : packIds, sharedPolicy });
const plan = (f, packIds = [], policy) => buildDlcDistributionPlan({ root: f.root,
  selection: resolveDlcSelection({ manifests: f.manifests, profile: profile(packIds, policy) }) });
const exportTo = (f, name, packIds, policy) => exportDlcDistribution({ root: f.root,
  profile: profile(packIds, policy), sourceRevision: 'a'.repeat(40), out: path.join(f.parent, name) });
const urls = assets => assets.map(asset => asset.publicPath);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const modifyJson = (f, file, change) => {
  const value = JSON.parse(readFileSync(path.join(f.root, file)));
  change(value); f.json(file, value);
};

test('reviewed policy removes only explicitly proven shared backdrops while preserve-all stays compatible', t => {
  const f = createSharedDependencyFixture(t);
  const reviewed = plan(f);
  assert.deepEqual(urls(reviewed.excludedSharedAssets), [f.alienBackdrop]);
  assert.deepEqual(urls(reviewed.publicAssets), [f.haloBackdrop, '/common.bin']);
  assert.equal(reviewed.sharedDependencyProof.assets[0].consumers.length, 2);
  assert.ok(reviewed.metadataFiles.includes(DLC_SHARED_DEPENDENCIES));
  const historical = plan(f, [], 'preserve-all');
  assert.deepEqual(urls(historical.excludedSharedAssets), []);
  assert.ok(urls(historical.publicAssets).includes(f.alienBackdrop));
  assert.equal(historical.sharedDependencyProof, null);
  assert.equal(createDlcInstallation({ manifests: f.manifests, profile: profile(['halo']) }).isUniverseInstalled('Halo'), true);
  assert.equal(createDlcInstallation({ manifests: f.manifests, profile: profile(['halo']) }).isUniverseInstalled('Alien'), false);
});

for (const packs of [[], ['halo'], ['alien'], ['aliens'], ['halo', 'aliens'], 'all']) {
  test('audited source export retains the same backdrop bytes for ' + (packs.length ? packs : 'base'), t => {
    const f = createSharedDependencyFixture(t);
    const result = exportTo(f, 'export', packs);
    assert.equal(result.audit.passed, true);
    assert.equal(result.profile.sharedPolicy, REVIEWED_SHARED_POLICY);
    const expectedAlien = packs === 'all' || packs.includes('alien') || packs.includes('aliens');
    assert.equal(existsSync(path.join(result.out, 'public' + f.alienBackdrop)), expectedAlien);
    assert.ok(existsSync(path.join(result.out, 'public' + f.haloBackdrop)), 'common intro image always remains');
    if (expectedAlien) {
      const original = readFileSync(path.join(f.root, 'public' + f.alienBackdrop));
      assert.deepEqual(readFileSync(path.join(result.out, 'public' + f.alienBackdrop)), original);
      assert.equal(result.receipt.assets.find(asset => asset.publicPath === f.alienBackdrop).sha256, sha(original));
    }
    assert.equal(auditDlcDistribution({ root: result.out }).passed, true);
    assert.deepEqual(result.receipt.packs.map(pack => pack.id), packs === 'all' ? ['alien', 'aliens', 'halo'] : [...packs].sort());
  });
}

test('an unrelated shared resource is retained even when no literal consumer is observed', t => {
  const f = createSharedDependencyFixture(t);
  modifyJson(f, 'DLC/shared-assets.json', value => value.assets.push({ publicPath: '/unknown.bin', sourcePath: 'public/unknown.bin' }));
  f.write('public/unknown.bin', 'unclassified');
  assert.ok(urls(plan(f).publicAssets).includes('/unknown.bin'));
});

for (const [label, edit, pattern] of [
  ['common JSX reference', f => f.write('src/components/Other.jsx', 'export const x = <img src="' + f.alienBackdrop + '" />;'), /Unreviewed shared backdrop consumer/],
  ['encoded JSX reference', f => f.write('src/components/Other.jsx', 'export const x = <img src="/backgrounds/%61lien-smash-openai.png" />;'), /Unreviewed shared backdrop consumer/],
  ['computed constant reference', f => f.write('src/extra.js', "export const x = '/backgrounds/' + 'alien-smash-openai.png';"), /Unreviewed shared backdrop consumer/],
  ['CSS reference', f => f.write('src/extra.css', 'body { background: url(' + f.alienBackdrop + '); }'), /Unreviewed shared backdrop data/],
  ['generated registry value', f => f.json('src/game/generatedStageAssets.json', { byProfile: { Base: { RPG: { assetPath: f.alienBackdrop } } } }), /Unreviewed shared backdrop data/],
  ['public JSON alias', f => f.json('public/runtime.json', { image: f.alienBackdrop }), /Unreviewed shared backdrop data/],
  ['dynamic template producer', f => f.write('src/extra.js', 'export const make = name => `/backgrounds/${name}-openai.png`;'), /Unreviewed dynamic backdrop URL/],
  ['dynamic concatenation producer', f => f.write('src/extra.js', "export const make = name => '/backgrounds/' + name;"), /Unreviewed dynamic backdrop URL/],
  ['implicit mode fallback', f => f.write('src/game/renderer.js', readFileSync(path.join(f.root, 'src/game/renderer.js'), 'utf8').replace('|| null;', '|| OPENAI_BACKDROPS.Smash.Alien;')), /Reviewed backdrop resolver changed/],
  ['missing dependency identity', f => modifyJson(f, DLC_SHARED_DEPENDENCIES, value => { value.assets[0].packIds = ['alien']; }), /consumers differ/],
  ['unknown dependency identity', f => modifyJson(f, DLC_SHARED_DEPENDENCIES, value => { value.assets[0].packIds.push('unknown'); }), /Unknown pack/],
  ['duplicate declaration', f => modifyJson(f, DLC_SHARED_DEPENDENCIES, value => { value.assets.push(value.assets[0]); }), /Invalid or duplicate/],
  ['new registry alias', f => f.write('src/extra.js', "import { OPENAI_BACKDROPS as choices } from './game/renderer.js'; export const x = choices;"), /external backdrop registry access/],
  ['unclassified dependency', f => modifyJson(f, DLC_SHARED_DEPENDENCIES, value => { value.assets[0].publicPath = '/backgrounds/unknown-openai.png'; }), /not a shared canonical asset/],
]) {
  test('reviewed export refuses ' + label + ' and leaves no output', t => {
    const f = createSharedDependencyFixture(t);
    edit(f);
    assert.throws(() => exportTo(f, 'refused', []), pattern);
    assert.equal(existsSync(path.join(f.parent, 'refused')), false);
  });
}

test('missing opt-in metadata fails closed without breaking the historical preserve-all profile', t => {
  const f = createSharedDependencyFixture(t);
  rmSync(path.join(f.root, DLC_SHARED_DEPENDENCIES));
  assert.throws(() => plan(f), /requires DLC\/shared-asset-dependencies/);
  assert.equal(exportTo(f, 'historical', [], 'preserve-all').audit.passed, true);
});

test('selected pack inventory cannot request an asset excluded by the reviewed mapping', t => {
  const f = createSharedDependencyFixture(t);
  modifyJson(f, 'DLC/Halo/assets.json', value => value.sharedDependencies.push(f.alienBackdrop));
  assert.throws(() => plan(f, ['halo']), /Selected shared dependency would be excluded/);
});

test('audits reject both a missing required shared image and an extra excluded image', t => {
  const f = createSharedDependencyFixture(t);
  const selected = exportTo(f, 'alien', ['alien']);
  rmSync(path.join(selected.out, 'public' + f.alienBackdrop));
  assert.throws(() => auditDlcDistribution({ root: selected.out }), /missing/);
  const base = exportTo(f, 'base', []);
  writeFileSync(path.join(base.out, 'public' + f.alienBackdrop), readFileSync(path.join(f.root, 'public' + f.alienBackdrop)));
  assert.throws(() => auditDlcDistribution({ root: base.out }), /extra/);
});

test('a repinned receipt cannot silently omit a selected shared dependency', t => {
  const f = createSharedDependencyFixture(t);
  const selected = exportTo(f, 'alien', ['alien']);
  const receipt = JSON.parse(readFileSync(path.join(selected.out, DLC_DISTRIBUTION_RECEIPT)));
  receipt.assets = receipt.assets.filter(asset => asset.publicPath !== f.alienBackdrop);
  rmSync(path.join(selected.out, 'public' + f.alienBackdrop));
  writeFileSync(path.join(selected.out, DLC_DISTRIBUTION_RECEIPT), JSON.stringify(receipt));
  assert.throws(() => auditDlcDistribution({ root: selected.out }), /Exported shared dependency is unavailable/);
});

test('deltas preserve reviewed policy across base, both consumers, Halo and the complete edition', t => {
  const f = createSharedDependencyFixture(t);
  const definitions = [['legacy-base', [], 'preserve-all'], ['base', []], ['alien', ['alien']],
    ['aliens', ['aliens']], ['halo', ['halo']], ['all', 'all']];
  const editions = definitions.map(([name, packs, policy]) => exportTo(f, name, packs, policy));
  for (const [index, target] of editions.slice(1).entries()) {
    const base = editions[index];
    const delta = createDlcDistributionDelta({ base: base.out, target: target.out, out: path.join(f.parent, 'delta-' + index) });
    const installed = applyDlcDistributionDelta({ base: base.out, delta: delta.out,
      out: path.join(f.parent, 'installed-' + index), expectedManifestSha256: delta.manifestSha256 });
    assert.equal(installed.passed, true);
    const audit = auditDlcDistribution({ root: installed.out });
    assert.deepEqual(audit.receipt.profile, target.receipt.profile);
    assert.deepEqual(audit.receipt.assets, target.receipt.assets);
    assert.equal(existsSync(path.join(base.out, DLC_DISTRIBUTION_RECEIPT)), true);
    if (index === 2) {
      const manifest = JSON.parse(readFileSync(path.join(delta.out, 'delta.json')));
      assert.ok(manifest.files.find(file => file.path === 'public' + f.alienBackdrop).basePath,
        'switching between the two consumers reuses the same shared image');
    }
  }
});
