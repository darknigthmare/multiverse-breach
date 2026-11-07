import { createHash } from 'node:crypto';
import { closeSync, constants, lstatSync, openSync, readFileSync, readdirSync, readSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectAssetPath } from './dlcAssetPaths.mjs';
import { collectCommonUiAssetReferences } from './dlcCommonUiAssets.mjs';
import { assertDlcSharedDependencyClosure, DLC_SHARED_DEPENDENCIES, readDlcSharedDependencies,
    REVIEWED_SHARED_POLICY, selectDlcSharedAssets } from './dlcSharedAssetDependencies.mjs';

const PROFILE_KEYS = new Set(['schemaVersion', 'mode', 'packIds', 'sharedPolicy']);
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasControlCharacters = (value) => Array.from(value).some((character) => character.codePointAt(0) < 32 || character.codePointAt(0) === 127);
const canonicalJson = (value) => JSON.stringify(value, function (_key, item) {
    return isObject(item) ? Object.fromEntries(Object.keys(item).sort(compare).map((key) => [key, item[key]])) : item;
});
function freeze(value) {
    if (value && typeof value === 'object') {
        for (const item of Object.values(value)) freeze(item);
        Object.freeze(value);
    }
    return value;
}
function safeRelativePath(value) {
    if (typeof value !== 'string' || !value || /[\\:%?#]/.test(value) || hasControlCharacters(value)
        || value.startsWith('/') || value.split('/').some((part) => !part || part === '.' || part === '..')) {
        throw new Error('Unsafe distribution path: ' + JSON.stringify(value));
    }
    return value;
}
function checkedRoot(root) {
    const absolute = resolve(root);
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Distribution root must be a real directory: ' + absolute);
    return absolute;
}
function inspectPath(root, relative, { directory = false, optional = false } = {}) {
    const parts = safeRelativePath(relative).split('/');
    let current = root;
    for (const [index, part] of parts.entries()) {
        current += '/' + part;
        let stat;
        try { stat = lstatSync(current); } catch (error) {
            if (optional && error.code === 'ENOENT') return null;
            throw error;
        }
        if (stat.isSymbolicLink()) throw new Error('Symlink is not allowed in a DLC distribution: ' + relative);
        const expectDirectory = index < parts.length - 1 || directory;
        if (expectDirectory ? !stat.isDirectory() : !stat.isFile()) {
            throw new Error('Unexpected file type in a DLC distribution: ' + relative);
        }
    }
    return current;
}
function readJson(root, relative) {
    const path = inspectPath(root, relative);
    const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
        const value = JSON.parse(readFileSync(fd, 'utf8'));
        if (!isObject(value)) throw new Error('Expected a JSON object: ' + relative);
        return value;
    } finally { closeSync(fd); }
}
function validateProfile(profile) {
    if (!isObject(profile) || profile.schemaVersion !== 1
        || !['all', 'base', 'selected'].includes(profile.mode)
        || !['preserve-all', REVIEWED_SHARED_POLICY].includes(profile.sharedPolicy) || !Array.isArray(profile.packIds)
        || Object.keys(profile).some((key) => !PROFILE_KEYS.has(key))) {
        throw new Error('Invalid DLC distribution profile; expected schemaVersion 1, mode, packIds and an explicit supported sharedPolicy.');
    }
    if (profile.packIds.some((id) => typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id))) {
        throw new Error('Invalid DLC pack ID in distribution profile.');
    }
    if (new Set(profile.packIds).size !== profile.packIds.length) throw new Error('Duplicate DLC pack IDs in distribution profile.');
    if ((profile.mode === 'selected') !== (profile.packIds.length > 0)) {
        throw new Error('Selected profiles require pack IDs; all and base profiles require an empty packIds array.');
    }
}
function validateManifests(manifests) {
    if (!Array.isArray(manifests)) throw new Error('DLC manifests must be an array.');
    const seen = { id: new Set(), universe: new Set(), directory: new Set(), catalogOrder: new Set() };
    for (const manifest of manifests) {
        if (!isObject(manifest) || manifest.schemaVersion !== 1
            || typeof manifest.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(manifest.id)
            || typeof manifest.universe !== 'string' || !manifest.universe.trim()
            || manifest.universe !== manifest.universe.trim() || hasControlCharacters(manifest.universe)
            || typeof manifest.directory !== 'string' || !/^DLC\/[A-Za-z0-9]+$/.test(manifest.directory)
            || !['runtime', 'artwork-only'].includes(manifest.registration)
            || !Number.isSafeInteger(manifest.catalogOrder) || manifest.catalogOrder < 0
            || manifest.assetManifest !== 'assets.json' || !Array.isArray(manifest.modules)) {
            throw new Error('Invalid DLC identity manifest: ' + JSON.stringify(manifest?.id));
        }
        const modulePaths = new Set();
        for (const module of manifest.modules) {
            if (!isObject(module) || typeof module.path !== 'string' || typeof module.runtimeAdapter !== 'string') {
                throw new Error('Invalid DLC module declaration: ' + manifest.id);
            }
            safeRelativePath(module.path);
            safeRelativePath(module.runtimeAdapter);
            if (modulePaths.has(module.path)) throw new Error('Duplicate DLC module declaration: ' + manifest.id + '/' + module.path);
            modulePaths.add(module.path);
        }
        for (const key of Object.keys(seen)) {
            const value = key === 'directory' ? manifest[key].toLowerCase() : manifest[key];
            if (seen[key].has(value)) throw new Error('Duplicate DLC manifest ' + key + ': ' + manifest[key]);
            seen[key].add(value);
        }
    }
}

/** Resolve an explicit profile against the complete catalogue without reading media. */
export function resolveDlcSelection({ manifests, profile }) {
    validateProfile(profile);
    validateManifests(manifests);
    const catalog = structuredClone(manifests).sort((a, b) => a.catalogOrder - b.catalogOrder || compare(a.id, b.id));
    const requested = new Set(profile.packIds);
    const known = new Set(catalog.map((manifest) => manifest.id));
    for (const id of requested) if (!known.has(id)) throw new Error('Unknown DLC pack ID: ' + id);
    const selectedManifests = catalog.filter((manifest) => profile.mode === 'all'
        || (profile.mode === 'selected' && requested.has(manifest.id)));
    const packIds = selectedManifests.map((manifest) => manifest.id);
    return freeze({
        schemaVersion: 1,
        mode: profile.mode,
        sharedPolicy: profile.sharedPolicy,
        packIds,
        requestedPackIds: profile.mode === 'selected' ? [...packIds] : [],
        manifests: catalog,
        selectedManifests,
        excludedPackIds: catalog.filter((manifest) => !packIds.includes(manifest.id)).map((manifest) => manifest.id),
    });
}

/** Read identities only: asset blobs and contribution modules are not opened. */
export function readDlcDistributionManifests({ root = process.cwd() } = {}) {
    const absolute = checkedRoot(root);
    inspectPath(absolute, 'DLC', { directory: true });
    const manifests = [];
    for (const item of readdirSync(absolute + '/DLC', { withFileTypes: true }).sort((a, b) => compare(a.name, b.name))) {
        if (item.isSymbolicLink()) throw new Error('Symlink is not allowed in DLC: ' + item.name);
        if (!item.isDirectory()) continue;
        const manifest = readJson(absolute, 'DLC/' + item.name + '/manifest.json');
        if (manifest.directory !== 'DLC/' + item.name) throw new Error('DLC manifest directory mismatch: ' + item.name);
        manifests.push(manifest);
    }
    validateManifests(manifests);
    return manifests.sort((a, b) => a.catalogOrder - b.catalogOrder || compare(a.id, b.id));
}
function normalizeSelection(root, selection) {
    const manifests = isObject(selection) && Array.isArray(selection.manifests)
        ? selection.manifests : readDlcDistributionManifests({ root });
    if (selection === undefined || Array.isArray(selection)) {
        const packIds = selection ?? [];
        return resolveDlcSelection({
            manifests,
            profile: { schemaVersion: 1, mode: selection === undefined ? 'all' : packIds.length ? 'selected' : 'base',
                packIds, sharedPolicy: 'preserve-all' },
        });
    }
    if (!isObject(selection)) throw new Error('Expected a resolved DLC selection or an array of pack IDs.');
    const resolved = resolveDlcSelection({
        manifests,
        profile: { schemaVersion: selection.schemaVersion, mode: selection.mode,
            packIds: selection.requestedPackIds, sharedPolicy: selection.sharedPolicy },
    });
    if (canonicalJson(resolved) !== canonicalJson(selection)) throw new Error('DLC selection is stale or has been modified.');
    return resolved;
}
function assetEntry(asset, manifest, declaredBy) {
    if (!isObject(asset)) throw new Error('Invalid asset declaration in ' + declaredBy);
    const projected = projectAssetPath(asset.sourcePath);
    if (!projected || projected.publicPath !== asset.publicPath) {
        throw new Error('Invalid asset path mapping in ' + declaredBy + ': ' + JSON.stringify(asset.sourcePath));
    }
    const destinationPath = 'public' + asset.publicPath;
    const isPublic = asset.sourcePath.startsWith('public/');
    if (isPublic ? asset.sourcePath !== destinationPath
        : !manifest || asset.sourcePath !== manifest.directory + '/assets' + asset.publicPath) {
        throw new Error('Asset ownership mismatch in ' + declaredBy + ': ' + asset.sourcePath);
    }
    return { sourcePath: asset.sourcePath, publicPath: asset.publicPath, destinationPath,
        ownerPackId: isPublic ? null : manifest.id, declaredBy };
}
function assertUniqueAssets(assets) {
    const sources = new Set();
    const destinations = new Set();
    for (const asset of assets) {
        if (sources.has(asset.sourcePath)) throw new Error('Duplicate asset source: ' + asset.sourcePath);
        if (destinations.has(asset.destinationPath)) throw new Error('Duplicate asset publication: ' + asset.destinationPath);
        sources.add(asset.sourcePath);
        destinations.add(asset.destinationPath);
    }
    for (const destination of destinations) {
        const parts = destination.split('/');
        for (let index = 1; index < parts.length; index += 1) {
            const parent = parts.slice(0, index).join('/');
            if (destinations.has(parent)) throw new Error('Asset file/directory collision: ' + parent);
        }
    }
}
function readAssetInventory(root, manifest) {
    const path = manifest.directory + '/assets.json';
    const inventory = readJson(root, path);
    if (inventory.schemaVersion !== 1 || inventory.universe !== manifest.universe
        || !Array.isArray(inventory.assets) || !Array.isArray(inventory.sharedDependencies)) {
        throw new Error('Invalid DLC asset inventory: ' + path);
    }
    return { path, inventory, assets: inventory.assets.map((asset) => assetEntry(asset, manifest, path)) };
}
function readSharedInventory(root) {
    const path = 'DLC/shared-assets.json';
    const inventory = readJson(root, path);
    if (inventory.schemaVersion !== 1 || !Array.isArray(inventory.assets)) throw new Error('Invalid shared asset inventory.');
    const assets = inventory.assets.map((asset) => assetEntry(asset, null, path));
    if (assets.some((asset) => asset.ownerPackId !== null)) throw new Error('Shared assets must have public sources.');
    return { path, inventory, assets };
}

/** Preserve public sources by default; an explicit policy may omit reviewed dependencies only. */
export function buildDlcDistributionPlan({ root = process.cwd(), selection } = {}) {
    const absolute = checkedRoot(root);
    const resolved = normalizeSelection(absolute, selection);
    const known = new Map(resolved.manifests.map((manifest) => [manifest.id, manifest]));
    const selected = new Set(resolved.packIds);
    const present = readDlcDistributionManifests({ root: absolute });
    const assets = [];
    const dependencies = [];
    const inventoryInputs = ['DLC/shared-assets.json'];
    for (const manifest of present) {
        if (!known.has(manifest.id) || canonicalJson(known.get(manifest.id)) !== canonicalJson(manifest)) {
            throw new Error('Unknown or changed DLC manifest: ' + manifest.directory);
        }
        const { path, inventory, assets: declared } = readAssetInventory(absolute, manifest);
        assets.push(...declared);
        inventoryInputs.push(manifest.directory + '/manifest.json', path);
        dependencies.push(...inventory.sharedDependencies.map((dependency) => ({ dependency, path })));
    }
    const presentIds = new Set(present.map((manifest) => manifest.id));
    for (const id of selected) if (!presentIds.has(id)) throw new Error('Selected DLC directory is missing: ' + id);
    const shared = readSharedInventory(absolute);
    assets.push(...shared.assets);
    assertUniqueAssets(assets);
    const allPublicAssets = assets.filter((asset) => asset.ownerPackId === null).sort((a, b) => compare(a.destinationPath, b.destinationPath));
    const publicUrls = new Set(allPublicAssets.map((asset) => asset.publicPath));
    for (const { dependency, path } of dependencies) {
        if (typeof dependency !== 'string' || !publicUrls.has(dependency)) {
            throw new Error('Undeclared shared dependency in ' + path + ': ' + JSON.stringify(dependency));
        }
    }
    const reviewedPolicy = resolved.sharedPolicy === REVIEWED_SHARED_POLICY;
    const sharedDependencies = readDlcSharedDependencies({ root: absolute, required: reviewedPolicy });
    if (sharedDependencies) inventoryInputs.push(DLC_SHARED_DEPENDENCIES);
    const sharedDependencyProof = reviewedPolicy ? assertDlcSharedDependencyClosure({ root: absolute,
        manifests: present, sharedAssets: shared.assets, dependencies: sharedDependencies }) : null;
    const { retained: publicAssets, excluded: excludedSharedAssets } = selectDlcSharedAssets({
        assets: allPublicAssets, selection: resolved, dependencies: sharedDependencies });
    const selectedPublicUrls = new Set(publicAssets.map(asset => asset.publicPath));
    for (const { dependency, path } of dependencies) {
        if (resolved.selectedManifests.some(pack => path === pack.directory + '/assets.json') && !selectedPublicUrls.has(dependency)) {
            throw new Error('Selected shared dependency would be excluded: ' + path + ' -> ' + dependency);
        }
    }
    const dlcAssets = assets.filter((asset) => selected.has(asset.ownerPackId)).sort((a, b) => compare(a.destinationPath, b.destinationPath));
    const excludedDlcAssets = assets.filter((asset) => asset.ownerPackId !== null && !selected.has(asset.ownerPackId))
        .sort((a, b) => compare(a.destinationPath, b.destinationPath));
    const published = [...publicAssets, ...dlcAssets].sort((a, b) => compare(a.destinationPath, b.destinationPath));
    const excludedByUrl = new Map(excludedDlcAssets.map((asset) => [asset.publicPath, asset]));
    const publishedUrls = new Set(published.map((asset) => asset.publicPath));
    for (const { publicPath, sourcePath } of collectCommonUiAssetReferences({ root: absolute })) {
        const excluded = excludedByUrl.get(publicPath);
        if (excluded) throw new Error('Common UI asset would be excluded: ' + sourcePath + ' -> ' + publicPath
            + ' (pack ' + excluded.ownerPackId + '); promote the canonical source to shared public assets.');
        if (!publishedUrls.has(publicPath)) throw new Error('Undeclared common UI asset: ' + sourcePath + ' -> ' + publicPath);
    }
    const metadataFiles = ['DLC/shared-assets.json', ...(sharedDependencies ? [DLC_SHARED_DEPENDENCIES] : []), ...resolved.selectedManifests.flatMap((manifest) =>
        [manifest.directory + '/manifest.json', manifest.directory + '/assets.json'])].sort(compare);
    return freeze({
        schemaVersion: 1, selection: resolved, assets: published, dlcAssets, publicAssets, excludedDlcAssets,
        excludedSharedAssets, sharedDependencyProof,
        publicSourcePaths: publicAssets.map((asset) => asset.destinationPath),
        metadataFiles, inventoryInputs: inventoryInputs.sort(compare),
        counts: { selectedPacks: resolved.packIds.length, sharedAssets: publicAssets.length,
            selectedDlcAssets: dlcAssets.length, excludedDlcAssets: excludedDlcAssets.length, publishedAssets: published.length },
    });
}
function hashRegularFile(root, relative) {
    const path = inspectPath(root, relative);
    const hash = createHash('sha256');
    const buffer = Buffer.allocUnsafe(1024 * 1024);
    let bytes = 0;
    const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
        let count;
        while ((count = readSync(fd, buffer, 0, buffer.length, null)) > 0) {
            if (bytes === 0 && /^\uFEFF?version https:\/\/git-lfs\.github\.com\/spec\/v1(?:\r?\n|$)/.test(buffer.subarray(0, count).toString('utf8'))) {
                throw new Error('Git LFS pointer is not a materialized distribution file: ' + relative);
            }
            hash.update(buffer.subarray(0, count));
            bytes += count;
        }
    } finally { closeSync(fd); }
    return { sha256: hash.digest('hex'), bytes };
}
function profileFromSelection(selection) {
    return { schemaVersion: 1, mode: selection.mode,
        packIds: selection.mode === 'selected' ? [...selection.packIds] : [], sharedPolicy: selection.sharedPolicy };
}

/** Hash canonical sources before export; published copies never substitute for missing sources. */
export function createDlcDistributionReceipt({ root = process.cwd(), plan, additionalFiles = [], additionalRoot = root, sourceRevision } = {}) {
    const absolute = checkedRoot(root);
    if (!isObject(plan) || plan.schemaVersion !== 1 || !Array.isArray(additionalFiles)) throw new Error('Invalid DLC distribution receipt input.');
    if (sourceRevision !== undefined && (typeof sourceRevision !== 'string' || !/^[a-f0-9]{40}$/.test(sourceRevision))) {
        throw new Error('sourceRevision must be a full Git commit SHA.');
    }
    const current = buildDlcDistributionPlan({ root: absolute, selection: plan.selection });
    for (const key of ['assets', 'metadataFiles', 'publicSourcePaths']) {
        if (canonicalJson(plan[key]) !== canonicalJson(current[key])) throw new Error('DLC distribution plan changed before receipt creation: ' + key);
    }
    const assets = current.assets.map((asset) => ({ ...asset, ...hashRegularFile(absolute, asset.sourcePath) }));
    const additionalAbsolute = checkedRoot(additionalRoot);
    const metadata = [...current.metadataFiles.map((path) => ({ path, root: absolute })),
        ...additionalFiles.map((path) => ({ path, root: additionalAbsolute }))].sort((a, b) => compare(a.path, b.path));
    const seen = new Set(assets.flatMap((asset) => [asset.sourcePath, asset.destinationPath]));
    const files = metadata.map(({ path, root: fileRoot }) => {
        safeRelativePath(path);
        if (seen.has(path)) throw new Error('Duplicate receipt path: ' + path);
        seen.add(path);
        return { path, ...hashRegularFile(fileRoot, path) };
    });
    const selectedDirectories = new Set(current.selection.selectedManifests.map((manifest) => manifest.directory));
    const retainedPublicSources = current.publicAssets.filter((asset) =>
        asset.declaredBy !== 'DLC/shared-assets.json' && !selectedDirectories.has(asset.declaredBy.slice(0, -'/assets.json'.length)));
    return freeze({
        schemaVersion: 1, kind: 'dlc-asset-distribution',
        ...(sourceRevision === undefined ? {} : { sourceRevision }),
        profile: profileFromSelection(current.selection),
        packs: current.selection.selectedManifests.map(({ id, universe, directory, registration, catalogOrder }) =>
            ({ id, universe, directory, registration, catalogOrder })),
        retainedPublicSources, assets, files,
    });
}
function validateReceipt(receipt) {
    if (!isObject(receipt) || receipt.schemaVersion !== 1 || receipt.kind !== 'dlc-asset-distribution'
        || !Array.isArray(receipt.packs) || !Array.isArray(receipt.assets) || !Array.isArray(receipt.files)
        || !Array.isArray(receipt.retainedPublicSources)) throw new Error('Invalid DLC distribution receipt.');
    if (receipt.sourceRevision !== undefined && (typeof receipt.sourceRevision !== 'string' || !/^[a-f0-9]{40}$/.test(receipt.sourceRevision))) throw new Error('Invalid receipt sourceRevision.');
    const manifests = receipt.packs.map((pack) => ({ ...pack, schemaVersion: 1, assetManifest: 'assets.json', modules: [] }));
    const selection = resolveDlcSelection({ manifests, profile: receipt.profile });
    if (canonicalJson(selection.packIds) !== canonicalJson(receipt.packs.map((pack) => pack.id))) {
        throw new Error('Receipt pack order or profile selection mismatch.');
    }
    const byId = new Map(manifests.map((manifest) => [manifest.id, manifest]));
    for (const asset of receipt.assets) {
        if (!HASH_PATTERN.test(asset?.sha256) || !Number.isSafeInteger(asset.bytes) || asset.bytes < 0) {
            throw new Error('Invalid asset digest in distribution receipt.');
        }
        safeRelativePath(asset.declaredBy);
        const expected = assetEntry(asset, byId.get(asset.ownerPackId), asset.declaredBy);
        if (expected.ownerPackId !== asset.ownerPackId || expected.destinationPath !== asset.destinationPath) {
            throw new Error('Invalid asset ownership in distribution receipt: ' + asset.sourcePath);
        }
        if (asset.ownerPackId !== null && asset.declaredBy !== byId.get(asset.ownerPackId)?.directory + '/assets.json') {
            throw new Error('Invalid asset declaration provenance: ' + asset.sourcePath);
        }
    }
    assertUniqueAssets(receipt.assets);
    const selectedDirectories = new Set(manifests.map((manifest) => manifest.directory));
    for (const retained of receipt.retainedPublicSources) {
        if (!isObject(retained) || retained.ownerPackId !== null
            || !/^DLC\/[A-Za-z0-9]+\/assets.json$/.test(retained.declaredBy)
            || selectedDirectories.has(retained.declaredBy.slice(0, -'/assets.json'.length))
            || canonicalJson(assetEntry(retained, null, retained.declaredBy)) !== canonicalJson(retained)) {
            throw new Error('Invalid retained public source declaration.');
        }
    }
    assertUniqueAssets(receipt.retainedPublicSources);
    const paths = new Set(receipt.assets.flatMap((asset) => [asset.sourcePath, asset.destinationPath]));
    const metadata = new Set();
    for (const file of receipt.files) {
        if (!isObject(file) || !HASH_PATTERN.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0) {
            throw new Error('Invalid metadata digest in distribution receipt.');
        }
        safeRelativePath(file.path);
        if (paths.has(file.path)) throw new Error('Duplicate receipt path: ' + file.path);
        paths.add(file.path);
        metadata.add(file.path);
    }
    for (const path of ['DLC/shared-assets.json', ...(receipt.profile.sharedPolicy === REVIEWED_SHARED_POLICY ? [DLC_SHARED_DEPENDENCIES] : []), ...manifests.flatMap((manifest) =>
        [manifest.directory + '/manifest.json', manifest.directory + '/assets.json'])]) {
        if (!metadata.has(path)) throw new Error('Missing inventory attestation in distribution receipt: ' + path);
    }
    return selection;
}
function walkFiles(root, relative) {
    const directory = relative ? inspectPath(root, relative, { directory: true, optional: true }) : root;
    if (!directory) return [];
    const files = [];
    for (const item of readdirSync(directory, { withFileTypes: true }).sort((a, b) => compare(a.name, b.name))) {
        const path = relative ? relative + '/' + item.name : item.name;
        if (item.isSymbolicLink()) throw new Error('Symlink is not allowed in a DLC distribution: ' + path);
        if (item.isDirectory()) files.push(...walkFiles(root, path));
        else if (item.isFile()) files.push(path);
        else throw new Error('Unexpected file type in a DLC distribution: ' + path);
    }
    return files;
}
function verifyInventoryClosure(root, receipt, selection) {
    const shared = readSharedInventory(root);
    const reviewedPolicy = selection.sharedPolicy === REVIEWED_SHARED_POLICY;
    const dependencies = readDlcSharedDependencies({ root, required: reviewedPolicy });
    if (dependencies && !receipt.files.some(file => file.path === DLC_SHARED_DEPENDENCIES)) {
        throw new Error('Missing shared dependency manifest attestation');
    }
    if (reviewedPolicy) assertDlcSharedDependencyClosure({ root,
        manifests: readDlcDistributionManifests({ root }), sharedAssets: shared.assets, dependencies });
    const { retained } = selectDlcSharedAssets({ assets: shared.assets, selection, dependencies });
    const expected = [...retained, ...receipt.retainedPublicSources];
    const publicUrls = new Set(receipt.assets.filter((asset) => asset.ownerPackId === null).map((asset) => asset.publicPath));
    for (const manifest of selection.selectedManifests) {
        const identity = readJson(root, manifest.directory + '/manifest.json');
        for (const key of ['id', 'universe', 'directory', 'registration', 'catalogOrder']) {
            if (identity[key] !== manifest[key]) throw new Error('Receipt identity does not match exported manifest: ' + manifest.id);
        }
        const { inventory, assets } = readAssetInventory(root, manifest);
        for (const dependency of inventory.sharedDependencies) {
            if (typeof dependency !== 'string' || !publicUrls.has(dependency)) throw new Error('Exported shared dependency is unavailable: ' + manifest.id);
        }
        expected.push(...assets);
    }
    assertUniqueAssets(expected);
    const stripDigest = ({ sourcePath, publicPath, destinationPath, ownerPackId, declaredBy }) =>
        ({ sourcePath, publicPath, destinationPath, ownerPackId, declaredBy });
    const sorted = (assets) => assets.map(stripDigest).sort((a, b) => compare(a.sourcePath, b.sourcePath));
    if (canonicalJson(sorted(expected)) !== canonicalJson(sorted(receipt.assets))) {
        throw new Error('Distribution receipt asset list does not match the exported inventories.');
    }
}

/**
 * Verify materialized canonical sources, published public copies, or both.
 * Exactness covers public/ and DLC pack asset trees; non-asset project files
 * are verified when explicitly included through additionalFiles in the receipt.
 */
export function auditDlcDistributionFiles({ root = process.cwd(), receipt, layout = 'sources', exact = true } = {}) {
    if (!['sources', 'public', 'both'].includes(layout) || typeof exact !== 'boolean') throw new Error('Invalid DLC distribution audit options.');
    const absolute = checkedRoot(root);
    const selection = validateReceipt(receipt);
    const expectedAssets = new Map();
    const includesSources = layout !== 'public';
    const includesPublic = layout !== 'sources';
    for (const asset of receipt.assets) {
        if (includesSources) expectedAssets.set(asset.sourcePath, asset);
        if (includesPublic) expectedAssets.set(asset.destinationPath, asset);
    }
    const expectedFiles = new Map(expectedAssets);
    if (includesSources) for (const file of receipt.files) expectedFiles.set(file.path, file);
    const missingPaths = [];
    const changedPaths = [];
    let totalBytes = 0;
    for (const [path, expected] of expectedFiles) {
        if (!inspectPath(absolute, path, { optional: true })) { missingPaths.push(path); continue; }
        const actual = hashRegularFile(absolute, path);
        if (actual.sha256 !== expected.sha256 || actual.bytes !== expected.bytes) changedPaths.push(path);
        totalBytes += actual.bytes;
    }
    const extraPaths = [];
    if (exact) {
        const actual = walkFiles(absolute, 'public');
        if (includesSources && inspectPath(absolute, 'DLC', { directory: true, optional: true })) {
            const directories = new Set(selection.selectedManifests.map((manifest) => manifest.directory));
            for (const item of readdirSync(absolute + '/DLC', { withFileTypes: true })) {
                const path = 'DLC/' + item.name;
                if (item.isSymbolicLink()) throw new Error('Symlink is not allowed in a DLC distribution: ' + path);
                if (item.isDirectory()) {
                    if (!directories.has(path)) extraPaths.push(path + '/');
                    actual.push(...walkFiles(absolute, path + '/assets'));
                }
            }
        }
        for (const path of actual) if (!expectedFiles.has(path)) extraPaths.push(path);
    }
    if (missingPaths.length || changedPaths.length || extraPaths.length) {
        const error = new Error('Invalid DLC distribution: ' + [
            missingPaths.length ? 'missing ' + missingPaths.slice(0, 8).join(', ') : '',
            changedPaths.length ? 'changed ' + changedPaths.slice(0, 8).join(', ') : '',
            extraPaths.length ? 'extra ' + extraPaths.slice(0, 8).join(', ') : '',
        ].filter(Boolean).join('; '));
        Object.assign(error, { code: 'INVALID_DLC_DISTRIBUTION',
            missingPaths: missingPaths.sort(compare), changedPaths: changedPaths.sort(compare), extraPaths: [...new Set(extraPaths)].sort(compare) });
        throw error;
    }
    if (includesSources) verifyInventoryClosure(absolute, receipt, selection);
    return { passed: true, layout, exact, packCount: selection.packIds.length,
        assetFileCount: expectedAssets.size, metadataFileCount: includesSources ? receipt.files.length : 0, totalBytes };
}
