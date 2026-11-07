import { createHash } from 'node:crypto';
import {
  closeSync, constants, lstatSync, mkdirSync, mkdtempSync, openSync, readSync, renameSync,
  rmSync, writeFileSync, writeSync,
} from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  buildDlcDistributionPlan, createDlcDistributionReceipt, readDlcDistributionManifests, resolveDlcSelection,
} from './dlcDistribution.mjs';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
import { auditDlcDistribution, DLC_DISTRIBUTION_RECEIPT } from './auditDlcDistribution.mjs';
import {
  assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile, slash,
} from './dlcDistributionFilesystem.mjs';

const ROOT_FILES = ['package.json', 'package-lock.json', 'vite.config.js', 'index.html', 'README.md',
  '.nvmrc', '.gitattributes', '.vercelignore'];
const COMMON_DLC_FILES = ['DLC/index.js', 'DLC/content-identities.json', 'DLC/shared-assets.json'];
const SOURCE_TREES = ['src', 'api', 'scripts', 'config/dlc-profiles'];
const SCRIPT_EXTENSION = /\.(?:[cm]?js|jsx|tsx?)$/;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const ignoredSource = (file) => file.split('/').some((part) =>
  part === '.git' || part === 'node_modules' || part === '.env' || part.startsWith('.env.'));
const isWithin = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return !relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
};

function outputExists(out) {
  try { lstatSync(out); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function ensureParentDirectory(parent) {
  const missing = [];
  let existing = parent;
  while (!outputExists(existing)) {
    missing.push(existing);
    existing = path.dirname(existing);
  }
  assertDistributionDirectory(existing);
  for (const directory of missing.reverse()) mkdirSync(directory);
  return assertDistributionDirectory(parent);
}

function loadProfile(root, profile) {
  if (typeof profile !== 'string') return profile;
  const file = path.resolve(root, profile);
  const parent = assertDistributionDirectory(path.dirname(file));
  return JSON.parse(readDistributionFile(parent, path.basename(file)).toString('utf8'));
}

function collectSourceFiles(root, selection) {
  const files = new Set(COMMON_DLC_FILES);
  for (const file of COMMON_DLC_FILES) inspectDistributionPath(root, file);
  inspectDistributionPath(root, 'src', { directory: true });
  for (const relative of SOURCE_TREES) {
    for (const file of listDistributionFiles({ root, relative, ignore: ignoredSource })) files.add(file);
  }
  for (const file of listDistributionFiles({ root, relative: 'docs', ignore: ignoredSource })) {
    if (file.endsWith('.json')) files.add(file);
  }
  for (const file of ROOT_FILES) {
    if (inspectDistributionPath(root, file, { optional: true })) files.add(file);
  }
  for (const manifest of selection.selectedManifests) {
    for (const tree of ['data', 'runtime']) {
      for (const file of listDistributionFiles({ root, relative: manifest.directory + '/' + tree, ignore: ignoredSource })) files.add(file);
    }
    for (const filename of ['index.js', 'manifest.json', 'assets.json']) {
      const file = manifest.directory + '/' + filename;
      inspectDistributionPath(root, file);
      files.add(file);
    }
    for (const module of manifest.modules) {
      const file = manifest.directory + '/' + module.path;
      if (!files.has(file)) throw new Error('Selected DLC module is missing from the source export: ' + file);
    }
  }
  if (files.has(DLC_DISTRIBUTION_RECEIPT) || files.has('DLC/distribution.json')) {
    throw new Error('Generated distribution metadata must not be copied from a previous export.');
  }
  return [...files].sort(compare);
}

function writeNewFile(root, relative, data) {
  const destination = path.join(root, relative);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, data, { flag: 'wx' });
}

/** Copy through descriptors, verify while copying, and never follow the source file itself. */
function copyAttestedAsset(sourceRoot, destinationRoot, asset, destinationPath) {
  const source = inspectDistributionPath(sourceRoot, asset.sourcePath);
  const destination = path.join(destinationRoot, destinationPath);
  mkdirSync(path.dirname(destination), { recursive: true });
  const input = openSync(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  let output;
  const digest = createHash('sha256');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  let bytes = 0;
  try {
    output = openSync(destination, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o644);
    let count;
    while ((count = readSync(input, buffer, 0, buffer.length, null)) > 0) {
      digest.update(buffer.subarray(0, count));
      bytes += count;
      let written = 0;
      while (written < count) {
        const length = writeSync(output, buffer, written, count - written);
        if (!length) throw new Error('Could not finish copying asset: ' + destinationPath);
        written += length;
      }
    }
  } finally {
    closeSync(input);
    if (output !== undefined) closeSync(output);
  }
  if (bytes !== asset.bytes || digest.digest('hex') !== asset.sha256) {
    throw new Error('Canonical asset changed during export: ' + asset.sourcePath);
  }
}

function compareSnapshots(before, after) {
  const signature = (receipt) => JSON.stringify({
    assets: receipt.assets.map(({ sourcePath, publicPath, destinationPath, ownerPackId, declaredBy, sha256, bytes }) =>
      ({ sourcePath, publicPath, destinationPath, ownerPackId, declaredBy, sha256, bytes })),
    files: receipt.files.filter((file) => before.files.some((previous) => previous.path === file.path)),
  });
  if (signature(before) !== signature(after)) throw new Error('Canonical media or inventory changed during distribution export.');
}

/**
 * Export into a fresh sibling staging directory; publish only after all receipt,
 * source-closure and runtime-import checks succeed.
 */
export function exportDlcDistribution({ root = process.cwd(), profile, out, sourceRevision } = {}) {
  root = assertDistributionDirectory(root);
  if (inspectDistributionPath(root, DLC_DISTRIBUTION_RECEIPT, { optional: true })) {
    throw new Error('An existing distribution cannot be an export source; use the complete canonical source repository.');
  }
  if (typeof out !== 'string' || !out.trim()) throw new Error('A new output directory is required.');
  const destination = path.resolve(out);
  if (isWithin(root, destination)) throw new Error('Distribution output must be outside its source directory.');
  if (outputExists(destination)) throw new Error('Distribution output already exists: ' + destination);
  const manifests = readDlcDistributionManifests({ root });
  const selection = resolveDlcSelection({ manifests, profile: loadProfile(root, profile) });
  const plan = buildDlcDistributionPlan({ root, selection });
  const before = createDlcDistributionReceipt({ root, plan, sourceRevision });
  const sourceFiles = collectSourceFiles(root, selection);
  const transformer = createDlcProfileTransformer({ root, manifests: selection.manifests, installedPackIds: selection.packIds });
  const runtimeModules = new Set(selection.selectedManifests.flatMap((manifest) =>
    manifest.modules.map((module) => manifest.directory + '/' + module.path)));
  const parent = ensureParentDirectory(path.dirname(destination));
  const staging = mkdtempSync(path.join(parent, '.' + path.basename(destination) + '.dlc-staging-'));
  const sourceDigests = new Map();
  const canonicalSourceDigests = new Map();
  const transformedFiles = [];
  let published = false;
  try {
    for (const file of sourceFiles) {
      let bytes = readDistributionFile(root, file);
      canonicalSourceDigests.set(file, { sha256: hash(bytes), bytes: bytes.length });
      const runtime = file.startsWith('src/') || runtimeModules.has(file);
      if (runtime && SCRIPT_EXTENSION.test(file)) {
        const transformed = transformer.transform(bytes.toString('utf8'), path.join(root, file));
        if (transformed) {
          bytes = Buffer.from(transformed.code);
          transformedFiles.push({ path: file, removedImports: transformed.removedImports,
            removedContributions: transformed.removedContributions, omittedPackIds: transformed.omittedPackIds });
        }
      }
      writeNewFile(staging, file, bytes);
      sourceDigests.set(file, hash(bytes));
    }
    const profileBytes = Buffer.from(JSON.stringify(before.profile, null, 2) + '\n');
    writeNewFile(staging, 'DLC/distribution.json', profileBytes);
    sourceDigests.set('DLC/distribution.json', hash(profileBytes));
    for (const asset of before.assets) {
      copyAttestedAsset(root, staging, asset, asset.sourcePath);
      if (asset.destinationPath !== asset.sourcePath) copyAttestedAsset(staging, staging, asset, asset.destinationPath);
    }
    const pinnedMetadata = new Set(plan.metadataFiles);
    const additionalFiles = [...sourceDigests.keys()].filter((file) => !pinnedMetadata.has(file)).sort(compare);
    const receipt = createDlcDistributionReceipt({ root, plan, additionalRoot: staging, additionalFiles, sourceRevision });
    compareSnapshots(before, receipt);
    for (const file of receipt.files) {
      if (sourceDigests.get(file.path) !== file.sha256) throw new Error('Copied source changed before attestation: ' + file.path);
    }
    writeNewFile(staging, DLC_DISTRIBUTION_RECEIPT, JSON.stringify(receipt, null, 2) + '\n');
    const { receipt: _auditedReceipt, ...audit } = auditDlcDistribution({ root: staging });
    const currentSourceFiles = collectSourceFiles(root, selection);
    if (JSON.stringify(currentSourceFiles) !== JSON.stringify(sourceFiles)) {
      throw new Error('Canonical source inventory changed during distribution export.');
    }
    for (const [file, expected] of canonicalSourceDigests) {
      const current = readDistributionFile(root, file);
      if (current.length !== expected.bytes || hash(current) !== expected.sha256) {
        throw new Error('Canonical source changed during distribution export: ' + file);
      }
    }
    if (outputExists(destination)) throw new Error('Distribution output appeared during export: ' + destination);
    renameSync(staging, destination);
    published = true;
    return { root: destination, out: destination, profile: receipt.profile, receipt, audit,
      packCount: selection.packIds.length, assetCount: receipt.assets.length, sourceFileCount: receipt.files.length,
      transformedFiles };
  } finally {
    if (!published) rmSync(staging, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    let profile;
    let out;
    for (let index = 0; index < args.length; index += 2) {
      const flag = args[index];
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw new Error('Usage: node scripts/exportDlcDistribution.mjs --profile FILE --out NEW_DIRECTORY');
      if (flag === '--profile' && profile === undefined) profile = value;
      else if (flag === '--out' && out === undefined) out = value;
      else throw new Error('Unknown or duplicate export option: ' + flag);
    }
    if (!profile || !out) throw new Error('Usage: node scripts/exportDlcDistribution.mjs --profile FILE --out NEW_DIRECTORY');
    const result = exportDlcDistribution({ profile, out });
    console.log(JSON.stringify({ passed: true, output: slash(result.out), profile: result.profile,
      packs: result.packCount, assets: result.assetCount, sources: result.sourceFileCount, transformedFiles: result.transformedFiles.length }));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
