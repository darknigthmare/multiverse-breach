import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
    auditDlcDistributionFiles, buildDlcDistributionPlan, createDlcDistributionReceipt,
    readDlcDistributionManifests, resolveDlcSelection,
} from './dlcDistribution.mjs';
import { prepareDlcAssets } from './prepareDlcAssets.mjs';

const profile = (mode = 'all', packIds = []) => ({ schemaVersion: 1, mode, packIds, sharedPolicy: 'preserve-all' });
const identity = (id, universe, catalogOrder, registration = 'runtime') => ({
    schemaVersion: 1, id, universe, directory: 'DLC/' + universe, registration, catalogOrder,
    modules: [], assetManifest: 'assets.json',
});
const identities = () => [identity('halo', 'Halo', 20), identity('half-life', 'HalfLife', 10),
    identity('cloud-meadow', 'CloudMeadow', 30, 'artwork-only')];
const publicAsset = (publicPath) => ({ sourcePath: 'public' + publicPath, publicPath });
const ownedAsset = (manifest, publicPath) => ({ sourcePath: manifest.directory + '/assets' + publicPath, publicPath });
const lfsPointer = '\uFEFFversion https://git-lfs.github.com/spec/v1\r\noid sha256:' + 'a'.repeat(64) + '\r\nsize 1234\r\n';
const digest = (data) => createHash('sha256').update(data).digest('hex');
const createDirectory = (t) => {
    const root = mkdtempSync(join(tmpdir(), 'multiverse-dlc-distribution-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    return root;
};
const write = (root, path, contents) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
};
const writeJson = (root, path, value) => write(root, path, JSON.stringify(value, null, 2) + '\n');
const changeJson = (root, path, change) => {
    const value = JSON.parse(readFileSync(join(root, path), 'utf8'));
    change(value);
    writeJson(root, path, value);
};
const fixture = (t) => {
    const root = createDirectory(t);
    const manifests = identities();
    const shared = [publicAsset('/backgrounds/common.bin'), publicAsset('/fonts/main.bin')];
    for (const [index, asset] of shared.entries()) write(root, asset.sourcePath, Buffer.from([0, 255, 10, index]));
    writeJson(root, 'DLC/shared-assets.json', { schemaVersion: 1, assets: shared });
    for (const [index, manifest] of manifests.entries()) {
        writeJson(root, manifest.directory + '/manifest.json', manifest);
        const assets = [ownedAsset(manifest, '/images/' + manifest.id + '.bin')];
        if (manifest.id === 'halo') assets.push(ownedAsset(manifest, '/audio/halo.bin'));
        for (const asset of assets) write(root, asset.sourcePath, Buffer.from([0, 255, 128, 42, index]));
        writeJson(root, manifest.directory + '/assets.json', { schemaVersion: 1, universe: manifest.universe,
            assets, sharedDependencies: ['/backgrounds/common.bin'] });
    }
    return { root, manifests };
};
const select = (manifests, packIds) => resolveDlcSelection({ manifests, profile: profile(packIds.length ? 'selected' : 'base', packIds) });
const selectedPlan = (f, packIds = ['halo']) => buildDlcDistributionPlan({ root: f.root, selection: select(f.manifests, packIds) });
const exportSources = (t, f, plan) => {
    const root = createDirectory(t);
    for (const path of [...plan.assets.map((asset) => asset.sourcePath), ...plan.metadataFiles]) {
        write(root, path, readFileSync(join(f.root, path)));
    }
    return root;
};

test('a static common UI reference refuses an export that would omit its declared DLC media', (t) => {
    const f = fixture(t);
    write(f.root, 'src/components/Intro.jsx', 'export const intro = <main style={{ backgroundImage: "url(/images/halo.bin)" }} />;\n');
    assert.throws(() => selectedPlan(f, []), /Common UI asset would be excluded: src\/components\/Intro.jsx -> \/images\/halo.bin \(pack halo\)/);
    assert.throws(() => selectedPlan(f, ['half-life']), /Common UI asset would be excluded/);
    assert.equal(selectedPlan(f).assets.some(asset => asset.publicPath === '/images/halo.bin'), true);
    assert.equal(buildDlcDistributionPlan({ root: f.root }).assets.length, 6);
});

test('an unlisted static common UI asset cannot silently escape the inventory guard', (t) => {
    const f = fixture(t);
    write(f.root, 'src/components/NewScreen.jsx', 'export const screen = <img src="/images/unlisted.png" />;\n');
    assert.throws(() => selectedPlan(f, []), /Undeclared common UI asset: src\/components\/NewScreen.jsx -> \/images\/unlisted.png/);
    assert.throws(() => buildDlcDistributionPlan({ root: f.root }), /Undeclared common UI asset/);
});

test('encoding a static UI asset filename does not allow it to be omitted from an export', (t) => {
    const f = fixture(t);
    write(f.root, 'src/components/Intro.jsx', 'export const intro = <img src="/images/%68alo%2ebin?revision=1" />;\n');
    assert.throws(() => selectedPlan(f, []), /Common UI asset would be excluded: src\/components\/Intro.jsx -> \/images\/halo.bin \(pack halo\)/);
    assert.equal(selectedPlan(f).assets.some(asset => asset.publicPath === '/images/halo.bin'), true);
    write(f.root, 'src/components/Intro.jsx', 'export const intro = <img src="/images/missing%2epng" />;\n');
    assert.throws(() => buildDlcDistributionPlan({ root: f.root }), /Undeclared common UI asset/);
});

test('promoting common UI media preserves its URL and SHA in base and selected distributions', (t) => {
    const f = fixture(t);
    const publicPath = '/images/halo.bin';
    const source = 'DLC/Halo/assets' + publicPath;
    const bytes = readFileSync(join(f.root, source));
    write(f.root, 'src/components/Intro.jsx', 'export const intro = <img src="' + publicPath + '" />;\n');
    changeJson(f.root, 'DLC/Halo/assets.json', inventory => {
        inventory.assets = inventory.assets.filter(asset => asset.publicPath !== publicPath);
        inventory.sharedDependencies.push(publicPath);
    });
    changeJson(f.root, 'DLC/shared-assets.json', inventory => inventory.assets.push(publicAsset(publicPath)));
    write(f.root, 'public' + publicPath, bytes);
    rmSync(join(f.root, source));
    for (const packIds of [[], ['halo']]) {
        const plan = selectedPlan(f, packIds);
        const receipt = createDlcDistributionReceipt({ root: f.root, plan });
        const promoted = receipt.assets.find(asset => asset.publicPath === publicPath);
        assert.equal(promoted.sourcePath, 'public' + publicPath);
        assert.equal(promoted.sha256, digest(bytes));
        const exported = exportSources(t, f, plan);
        auditDlcDistributionFiles({ root: exported, receipt, layout: 'sources', exact: true });
        assert.deepEqual(readFileSync(join(exported, promoted.sourcePath)), bytes);
    }
});

test('profiles resolve in catalogue order and preserve immutable complete identities', () => {
    const manifests = identities();
    const before = structuredClone(manifests);
    const all = resolveDlcSelection({ manifests, profile: profile() });
    assert.deepEqual(all.packIds, ['half-life', 'halo', 'cloud-meadow']);
    assert.deepEqual(all.requestedPackIds, []);
    const selected = select(manifests, ['cloud-meadow', 'halo']);
    assert.deepEqual(selected.packIds, ['halo', 'cloud-meadow']);
    assert.deepEqual(selected.requestedPackIds, ['halo', 'cloud-meadow']);
    assert.deepEqual(selected.excludedPackIds, ['half-life']);
    assert.deepEqual(select(manifests, []).selectedManifests, []);
    assert.deepEqual(manifests, before);
    assert.equal(Object.isFrozen(manifests[0]), false);
    assert.equal(Object.isFrozen(selected.manifests[0]), true);
    assert.throws(() => selected.packIds.push('half-life'), TypeError);
    assert.deepEqual(resolveDlcSelection({ manifests: [], profile: profile('base') }).packIds, []);
});

for (const [name, invalid, expected] of [
    ['unknown IDs', profile('selected', ['missing']), /Unknown DLC pack ID/],
    ['duplicate IDs', profile('selected', ['halo', 'halo']), /Duplicate/],
    ['empty selected', profile('selected'), /require/],
    ['IDs in base', profile('base', ['halo']), /require/],
    ['IDs in all', profile('all', ['halo']), /require/],
    ['unknown mode', profile('auto'), /Invalid/],
    ['different shared policy', { ...profile(), sharedPolicy: 'selected-only' }, /Invalid/],
    ['unknown fields', { ...profile(), silentFallback: true }, /Invalid/],
    ['path-like IDs', profile('selected', ['../halo']), /Invalid/],
]) {
    test('rejects profile ' + name, () => assert.throws(() => resolveDlcSelection({ manifests: identities(), profile: invalid }), expected));
}

for (const [name, change] of [
    ['ID', (m) => { m[1].id = m[0].id; }],
    ['universe', (m) => { m[1].universe = m[0].universe; }],
    ['case-insensitive directory', (m) => { m[1].directory = 'DLC/halo'; }],
    ['catalogue order', (m) => { m[1].catalogOrder = m[0].catalogOrder; }],
    ['module path traversal', (m) => { m[1].modules = [{ path: '../secret.js', runtimeAdapter: 'src/game/test.js' }]; }],
]) {
    test('rejects ambiguous catalogue ' + name, () => {
        const manifests = identities();
        change(manifests);
        assert.throws(() => resolveDlcSelection({ manifests, profile: profile() }), /Duplicate|Unsafe/);
    });
}

test('plans retain all shared assets and require no excluded asset blobs', (t) => {
    const f = fixture(t);
    rmSync(join(f.root, 'DLC/HalfLife/assets'), { recursive: true });
    const plan = selectedPlan(f);
    assert.deepEqual(plan.counts, { selectedPacks: 1, sharedAssets: 2, selectedDlcAssets: 2,
        excludedDlcAssets: 2, publishedAssets: 4 });
    assert.deepEqual(plan.publicSourcePaths, ['public/backgrounds/common.bin', 'public/fonts/main.bin']);
    assert.equal(plan.dlcAssets.every((asset) => asset.ownerPackId === 'halo'), true);
    assert.equal(plan.metadataFiles.includes('DLC/HalfLife/assets.json'), false);
    assert.equal(plan.inventoryInputs.includes('DLC/HalfLife/assets.json'), true);
    assert.equal(buildDlcDistributionPlan({ root: f.root, selection: [] }).assets.length, 2);
    assert.equal(buildDlcDistributionPlan({ root: f.root }).assets.length, 6);
    assert.deepEqual(readDlcDistributionManifests({ root: f.root }).map((manifest) => manifest.id),
        ['half-life', 'halo', 'cloud-meadow']);
});

test('a resolved full catalogue permits absent excluded folders and rejects absent selected folders', (t) => {
    const f = fixture(t);
    const selection = select(f.manifests, ['halo']);
    rmSync(join(f.root, 'DLC/HalfLife'), { recursive: true });
    assert.equal(buildDlcDistributionPlan({ root: f.root, selection }).dlcAssets.length, 2);
    rmSync(join(f.root, 'DLC/Halo'), { recursive: true });
    assert.throws(() => buildDlcDistributionPlan({ root: f.root, selection }), /Selected DLC directory is missing/);
});

test('public source declarations in excluded packs survive selection and source export', (t) => {
    const f = fixture(t);
    changeJson(f.root, 'DLC/HalfLife/assets.json', (inventory) => inventory.assets.push(publicAsset('/shared/retained.bin')));
    write(f.root, 'public/shared/retained.bin', Buffer.from([1, 2, 3, 4]));
    const plan = selectedPlan(f);
    assert.equal(plan.publicSourcePaths.includes('public/shared/retained.bin'), true);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    assert.equal(receipt.retainedPublicSources.length, 1);
    const root = exportSources(t, f, plan);
    assert.equal(existsSync(join(root, 'DLC/HalfLife')), false);
    assert.equal(auditDlcDistributionFiles({ root, receipt }).passed, true);
});

test('excluded pack declarations still participate in ownership and collision checks', (t) => {
    const f = fixture(t);
    changeJson(f.root, 'DLC/HalfLife/assets.json', (inventory) => {
        inventory.assets.push({ sourcePath: 'DLC/HalfLife/assets/images/halo.bin', publicPath: '/images/halo.bin' });
    });
    assert.throws(() => selectedPlan(f), /Duplicate asset publication/);
});

test('missing shared dependency declarations fail before receipt materialization', (t) => {
    const f = fixture(t);
    changeJson(f.root, 'DLC/HalfLife/assets.json', (inventory) => { inventory.sharedDependencies = ['/unknown.bin']; });
    assert.throws(() => selectedPlan(f), /Undeclared shared dependency/);
});

test('foreign asset ownership and traversal declarations are refused', (t) => {
    const f = fixture(t);
    changeJson(f.root, 'DLC/HalfLife/assets.json', (inventory) => {
        inventory.assets[0] = { sourcePath: 'DLC/Halo/assets/images/stolen.bin', publicPath: '/images/stolen.bin' };
    });
    assert.throws(() => selectedPlan(f), /Asset ownership mismatch/);
    changeJson(f.root, 'DLC/HalfLife/assets.json', (inventory) => {
        inventory.assets[0] = { sourcePath: 'public/../secrets.bin', publicPath: '/../secrets.bin' };
    });
    assert.throws(() => selectedPlan(f), /Invalid asset path mapping/);
});

test('changed identities and modified resolved selections cannot be silently used', (t) => {
    const f = fixture(t);
    const selection = select(f.manifests, ['halo']);
    const changed = structuredClone(selection);
    changed.packIds = [];
    assert.throws(() => buildDlcDistributionPlan({ root: f.root, selection: changed }), /modified/);
    changeJson(f.root, 'DLC/HalfLife/manifest.json', (manifest) => { manifest.catalogOrder = 4; });
    assert.throws(() => buildDlcDistributionPlan({ root: f.root, selection }), /Unknown or changed DLC manifest/);
});

test('symlinked identity metadata is refused even for an excluded pack', (t) => {
    const f = fixture(t);
    const path = join(f.root, 'DLC/HalfLife/assets.json');
    rmSync(path);
    symlinkSync('../Halo/assets.json', path);
    assert.throws(() => selectedPlan(f), /Symlink/);
});

test('receipts attest actual canonical bytes and selected metadata deterministically', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const options = { root: f.root, plan, sourceRevision: 'a'.repeat(40) };
    const receipt = createDlcDistributionReceipt(options);
    assert.deepEqual(receipt, createDlcDistributionReceipt(options));
    assert.deepEqual(receipt.profile, profile('selected', ['halo']));
    assert.deepEqual(receipt.packs.map((pack) => pack.id), ['halo']);
    assert.equal(receipt.files.length, 3);
    for (const asset of receipt.assets) {
        const bytes = readFileSync(join(f.root, asset.sourcePath));
        assert.equal(asset.sha256, digest(bytes));
        assert.equal(asset.bytes, bytes.length);
    }
    assert.equal(Object.isFrozen(receipt.assets[0]), true);
});

test('a published copy never substitutes for a missing canonical source', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const asset = plan.dlcAssets[0];
    write(f.root, asset.destinationPath, readFileSync(join(f.root, asset.sourcePath)));
    rmSync(join(f.root, asset.sourcePath));
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan }), /ENOENT/);
});

test('receipts reject LFS placeholders and symlinked canonical sources', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const asset = plan.dlcAssets[0];
    write(f.root, asset.sourcePath, lfsPointer);
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan }), /LFS pointer/);
    rmSync(join(f.root, asset.sourcePath));
    symlinkSync(join(f.root, 'public/fonts/main.bin'), join(f.root, asset.sourcePath));
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan }), /Symlink/);
});

test('inventory edits invalidate an already resolved media plan', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    changeJson(f.root, 'DLC/Halo/assets.json', (inventory) => { inventory.assets.pop(); });
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan }), /plan changed/);
});

test('an autonomous selected source export passes with exact canonical hashes', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    const root = exportSources(t, f, plan);
    assert.deepEqual(auditDlcDistributionFiles({ root, receipt }), {
        passed: true, layout: 'sources', exact: true, packCount: 1, assetFileCount: 4,
        metadataFileCount: 3, totalBytes: receipt.assets.reduce((total, asset) => total + asset.bytes, 0)
            + receipt.files.reduce((total, file) => total + file.bytes, 0),
    });
    assert.equal(existsSync(join(root, '.git')), false);
    assert.equal(existsSync(join(root, 'DLC/HalfLife')), false);
});

for (const [name, mutate, expectedKey] of [
    ['missing source', (root, plan) => rmSync(join(root, plan.dlcAssets[0].sourcePath)), 'missingPaths'],
    ['changed source', (root, plan) => write(root, plan.dlcAssets[0].sourcePath, Buffer.from([2, 2, 2])), 'changedPaths'],
    ['extra public file', (root) => write(root, 'public/unexpected.bin', 'extra'), 'extraPaths'],
    ['extra pack file', (root) => write(root, 'DLC/Halo/assets/unexpected.bin', 'extra'), 'extraPaths'],
    ['excluded empty folder', (root) => mkdirSync(join(root, 'DLC/HalfLife')), 'extraPaths'],
    ['changed inventory', (root) => write(root, 'DLC/Halo/assets.json', '{}'), 'changedPaths'],
]) {
    test('strict export audit rejects ' + name, (t) => {
        const f = fixture(t);
        const plan = selectedPlan(f);
        const receipt = createDlcDistributionReceipt({ root: f.root, plan });
        const root = exportSources(t, f, plan);
        mutate(root, plan);
        assert.throws(() => auditDlcDistributionFiles({ root, receipt }),
            (error) => error.code === 'INVALID_DLC_DISTRIBUTION' && error[expectedKey].length > 0);
    });
}

for (const owner of ['halo', null]) {
    test('a receipt cannot omit an inventory entry owned by ' + (owner ?? 'shared'), (t) => {
        const f = fixture(t);
        const plan = selectedPlan(f);
        const receipt = structuredClone(createDlcDistributionReceipt({ root: f.root, plan }));
        const root = exportSources(t, f, plan);
        const omitted = receipt.assets.find((asset) => asset.ownerPackId === owner);
        receipt.assets = receipt.assets.filter((asset) => asset !== omitted);
        rmSync(join(root, omitted.sourcePath));
        assert.throws(() => auditDlcDistributionFiles({ root, receipt }), /does not match the exported inventories|shared dependency/);
    });
}

test('audit rejects symlinks both on expected paths and on unexpected paths', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    const root = exportSources(t, f, plan);
    symlinkSync('/tmp', join(root, 'public/unexpected'));
    assert.throws(() => auditDlcDistributionFiles({ root, receipt }), /Symlink/);
    rmSync(join(root, 'public/unexpected'));
    const asset = plan.dlcAssets[0];
    rmSync(join(root, asset.sourcePath));
    symlinkSync(join(f.root, asset.sourcePath), join(root, asset.sourcePath));
    assert.throws(() => auditDlcDistributionFiles({ root, receipt }), /Symlink/);
});

test('audit rejects a placeholder even when it is a regular file', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    const root = exportSources(t, f, plan);
    write(root, plan.dlcAssets[0].sourcePath, lfsPointer);
    assert.throws(() => auditDlcDistributionFiles({ root, receipt }), /LFS pointer/);
});

test('both layout checks generated public copies as well as canonical DLC files', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    const root = exportSources(t, f, plan);
    prepareDlcAssets({ root, selection: plan.selection });
    assert.equal(auditDlcDistributionFiles({ root, receipt, layout: 'both' }).assetFileCount, 6);
    assert.equal(auditDlcDistributionFiles({ root, receipt, layout: 'public' }).assetFileCount, 4);
    write(root, plan.dlcAssets[0].destinationPath, 'changed-copy');
    assert.throws(() => auditDlcDistributionFiles({ root, receipt, layout: 'both' }),
        (error) => error.changedPaths.includes(plan.dlcAssets[0].destinationPath));
});

test('a base-only export contains all common files and no pack directory', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f, []);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    const root = exportSources(t, f, plan);
    assert.equal(auditDlcDistributionFiles({ root, receipt }).packCount, 0);
    assert.equal(receipt.assets.length, 2);
    assert.equal(receipt.files.length, 1);
});

test('a single receipt binds canonical media to transformed files from a separate export root', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const root = exportSources(t, f, plan);
    write(f.root, 'src/game/adapter.js', 'original full catalogue');
    write(root, 'src/game/adapter.js', 'transformed selected catalogue');
    const receipt = createDlcDistributionReceipt({
        root: f.root, plan, additionalRoot: root, additionalFiles: ['src/game/adapter.js'],
    });
    assert.equal(receipt.files.find((file) => file.path === 'src/game/adapter.js').sha256,
        digest('transformed selected catalogue'));
    assert.equal(auditDlcDistributionFiles({ root, receipt }).passed, true);
    write(root, plan.dlcAssets[0].sourcePath, 'corrupted during copying');
    assert.throws(() => auditDlcDistributionFiles({ root, receipt }), /changed/);
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan, additionalFiles: ['DLC/Halo/assets.json'] }), /Duplicate/);
    assert.throws(() => createDlcDistributionReceipt({ root: f.root, plan, additionalFiles: ['../outside'] }), /Unsafe/);
});

test('receipt schema errors fail closed before audit', (t) => {
    const f = fixture(t);
    const plan = selectedPlan(f);
    const receipt = createDlcDistributionReceipt({ root: f.root, plan });
    for (const change of [
        (value) => { value.assets[0].sha256 = 'invalid'; },
        (value) => { value.sourceRevision = ['a'.repeat(40)]; },
        (value) => { value.assets[0].destinationPath = 'public/wrong.bin'; },
        (value) => { value.files.pop(); },
        (value) => { value.profile.packIds = ['half-life']; },
        (value) => { value.retainedPublicSources.push({ sourcePath: '../outside' }); },
    ]) {
        const value = structuredClone(receipt);
        change(value);
        assert.throws(() => auditDlcDistributionFiles({ root: f.root, receipt: value }));
    }
});

for (const mode of ['all', 'artwork-only']) {
    test('the ' + mode + ' profile produces a consistent strict receipt', (t) => {
        const f = fixture(t);
        const selection = mode === 'all'
            ? resolveDlcSelection({ manifests: f.manifests, profile: profile() })
            : select(f.manifests, ['cloud-meadow']);
        const plan = buildDlcDistributionPlan({ root: f.root, selection });
        const receipt = createDlcDistributionReceipt({ root: f.root, plan });
        const root = exportSources(t, f, plan);
        assert.equal(auditDlcDistributionFiles({ root, receipt }).packCount, mode === 'all' ? 3 : 1);
        assert.equal(receipt.assets.length, mode === 'all' ? 6 : 3);
    });
}
