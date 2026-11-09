import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { inspectReferencedCharacterPng, normalizeReferencedCharacterPng } from './installReferencedCharacterImages.mjs';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const implementationPath = 'scripts/installReferencedCharacterImages.mjs';
const toolPath = 'scripts/revalidateTechnicalSpritePacking.mjs';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const shaPattern = /^[a-f0-9]{64}$/;
const canonicalJson = value => JSON.stringify(sortKeys(value));

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortKeys(value[key])]));
  }
  return value;
}

function resolveRelative(root, relative) {
  assert.equal(typeof relative, 'string', 'Expected a repository-relative path');
  assert(relative && !path.isAbsolute(relative) && !relative.includes('\\')
    && !relative.includes(':') && !relative.split('/').some(part => !part || part === '.' || part === '..'),
  'Expected a canonical repository-relative path: ' + relative);
  return path.resolve(root, ...relative.split('/'));
}

async function readEvidence(root, relative) {
  const bytes = await fs.readFile(resolveRelative(root, relative));
  return { record: { path: relative, sha256: digest(bytes), bytes: bytes.length }, bytes };
}

async function readPinned(root, record) {
  assert(record && shaPattern.test(record.sha256), 'Expected a pinned SHA-256');
  const file = await readEvidence(root, record.path);
  assert.equal(file.record.sha256, record.sha256, 'Changed evidence: ' + record.path);
  if (record.bytes !== undefined) assert.equal(file.record.bytes, record.bytes, 'Changed length: ' + record.path);
  return file;
}

async function loadEvidence(root, promotionPath) {
  const promotionFile = await readEvidence(root, promotionPath);
  const promotion = JSON.parse(promotionFile.bytes);
  assert.equal(promotion.status, 'installed-after-independent-technical-review');
  assert.equal(promotion.newImageGenerationUsed, false);
  assert.equal(promotion.semanticArtworkCreated, false);
  assert.equal(promotion.canonicalFidelityApproved, false);
  const receiptFile = await readPinned(root, promotion.preparationReceipt);
  const reviewFile = await readPinned(root, promotion.independentReview);
  const receipt = JSON.parse(receiptFile.bytes);
  const review = JSON.parse(reviewFile.bytes);
  assert.equal(review.independentOfProducer, true);
  assert.equal(review.status, 'accepted-for-runtime-installation-technical-packing-only');
  assert.equal(review.canonicalFidelityApproved, false);
  assert.equal(review.technicalReceipt.path, promotion.preparationReceipt.path);
  assert.equal(review.technicalReceipt.sha256AtReview, receiptFile.record.sha256);
  assert.equal(receipt.characterId, promotion.characterId);
  assert.equal(review.characterId, promotion.characterId);
  assert.equal(receipt.technicalProvenance.newImageGenerationUsed, false);
  assert.equal(receipt.technicalProvenance.semanticArtworkCreated, false);
  assert.equal(receipt.technicalProvenance.sourceUnmodified, true);
  assert.equal(receipt.technicalProvenance.implementation, implementationPath,
    'The revalidated implementation must be the module actually imported by this tool');
  assert(shaPattern.test(receipt.technicalProvenance.implementationSha256));
  const source = await readPinned(root, receipt.source);
  const snapshot = await readEvidence(root, receipt.source.snapshotPath);
  assert(source.bytes.equals(snapshot.bytes), 'Source snapshot differs from the historical source');
  const output = await readPinned(root, receipt.output);
  assert.equal(review.source.sha256, source.record.sha256);
  assert.equal(review.output.sha256, output.record.sha256);
  assert.equal(promotion.currentRuntimePath, receipt.output.runtimePath);
  const implementation = await readEvidence(root, implementationPath);
  const tool = await readEvidence(root, toolPath);
  return { promotionFile, promotion, receiptFile, receipt, reviewFile, review, source, snapshot, output, implementation, tool };
}

function evidenceBindings(evidence) {
  const { promotionFile, promotion, receiptFile, receipt, reviewFile, source, snapshot, output, implementation, tool } = evidence;
  return {
    characterId: promotion.characterId,
    historicalEvidence: {
      runtimePromotion: promotionFile.record,
      preparationReceipt: receiptFile.record,
      independentReview: reviewFile.record,
      implementation: {
        path: receipt.technicalProvenance.implementation,
        sha256: receipt.technicalProvenance.implementationSha256
      }
    },
    implementation: implementation.record,
    revalidationTool: tool.record,
    artwork: {
      source: source.record,
      snapshot: snapshot.record,
      output: { ...output.record, runtimePath: receipt.output.runtimePath }
    }
  };
}

function expectedReproduction(receipt, review) {
  assert.equal(receipt.comparison.frames.length, 16);
  assert.equal(review.entries.length, 16);
  const frames = receipt.comparison.frames.map((frame, index) => {
    assert.equal(frame.frame, index + 1);
    assert.equal(review.entries[index].frame, index + 1);
    assert.equal(frame.packedFrameSha256, review.entries[index].packedFrameSha256);
    assert.equal(review.entries[index].independentlyViewed, true);
    assert.match(review.entries[index].decision, /^accepted-/);
    return {
      frame: index + 1,
      originalRuntimeSliceSha256: frame.originalRuntimeSliceSha256,
      packedFrameSha256: frame.packedFrameSha256
    };
  });
  assert.equal(new Set(frames.map(frame => frame.packedFrameSha256)).size, 16);
  return {
    exactOutputBytes: true,
    outputSha256: receipt.output.sha256,
    outputBytes: receipt.output.bytes,
    processingSha256: digest(canonicalJson(receipt.processing)),
    geometrySha256: digest(canonicalJson(receipt.geometry)),
    frames
  };
}

async function frameHash(bytes, index) {
  const raw = await sharp(bytes)
    .extract({ left: index % 4 * 256, top: Math.floor(index / 4) * 256, width: 256, height: 256 })
    .raw().toBuffer();
  return digest(raw);
}

/** Build a new implementation proof only after reproducing the reviewed, immutable artwork. */
export async function createTechnicalPackingRevalidation({
  root = defaultRoot,
  promotionPath,
  date
} = {}) {
  assert.match(date || '', /^\d{4}-\d{2}-\d{2}$/, 'An explicit validation date is required');
  root = path.resolve(root);
  const evidence = await loadEvidence(root, promotionPath);
  const { source, output, receipt, review, implementation, tool } = evidence;
  // A fixture/export root may differ from this module's root, but it cannot
  // declare different code as the code that actually produced the proof.
  assert.equal(implementation.record.sha256, digest(await fs.readFile(path.resolve(defaultRoot, implementationPath))),
    'Declared implementation differs from the imported normalizer');
  assert.equal(tool.record.sha256, digest(await fs.readFile(fileURLToPath(import.meta.url))),
    'Declared revalidation tool differs from the executing tool');
  const reproduced = await normalizeReferencedCharacterPng(source.bytes, { componentLayout: true });
  assert(output.bytes.equals(reproduced.buffer), 'Current implementation does not reproduce the exact historical atlas');
  assert.deepEqual(reproduced.processing, receipt.processing, 'Packing processing changed');
  assert.deepEqual(await inspectReferencedCharacterPng(output.bytes), receipt.geometry, 'Packing geometry changed');
  assert.equal(receipt.geometry.nonemptyCells, 16);
  assert(receipt.geometry.minimumGuard >= 12);
  assert.equal(receipt.processing.sourceVisiblePixels, receipt.processing.assignedVisiblePixels);
  assert.equal(receipt.processing.softAlphaOutsideFrameDiscarded, 0);
  assert.equal(receipt.processing.softAlphaAmbiguitiesForReview, 0);
  const metadata = await sharp(output.bytes).metadata();
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1024);
  assert.equal(metadata.channels, 4);
  const reproduction = expectedReproduction(receipt, review);
  for (const [index, frame] of reproduction.frames.entries()) {
    assert.equal(await frameHash(source.bytes, index), frame.originalRuntimeSliceSha256, 'Source frame changed: ' + (index + 1));
    assert.equal(await frameHash(reproduced.buffer, index), frame.packedFrameSha256, 'Reproduced frame changed: ' + (index + 1));
  }
  return {
    schemaVersion: 1,
    validationDate: date,
    kind: 'technical-packing-implementation-revalidation',
    status: 'verified-current-implementation',
    ...evidenceBindings(evidence),
    reproduction,
    newImageGenerationUsed: false,
    semanticArtworkCreated: false,
    canonicalFidelityApproved: false,
    newVisualReviewPerformed: false,
    historicalVisualReviewRetained: true,
    environment: { node: process.version, sharp: sharp.versions.sharp, vips: sharp.versions.vips },
    scope: 'Exact technical reproduction with the current implementation; preserves the original visual review and makes no new artistic approval.'
  };
}

/** Validate explicit proof bindings; the calling gate still performs its full live reproduction. */
export async function verifyTechnicalPackingRevalidation({
  root = defaultRoot,
  promotionPath,
  revalidationPath
} = {}) {
  root = path.resolve(root);
  assert(revalidationPath, 'An explicit implementation revalidation path is required');
  const proofFile = await readEvidence(root, revalidationPath);
  const proof = JSON.parse(proofFile.bytes);
  assert.equal(proof.schemaVersion, 1);
  assert.match(proof.validationDate || '', /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(proof.kind, 'technical-packing-implementation-revalidation');
  assert.equal(proof.status, 'verified-current-implementation');
  for (const field of ['newImageGenerationUsed', 'semanticArtworkCreated', 'canonicalFidelityApproved', 'newVisualReviewPerformed']) {
    assert.equal(proof[field], false, 'Revalidation must not claim new artwork or artistic approval: ' + field);
  }
  assert.equal(proof.historicalVisualReviewRetained, true);
  const evidence = await loadEvidence(root, promotionPath);
  for (const [key, value] of Object.entries(evidenceBindings(evidence))) {
    assert.deepEqual(proof[key], value, 'Stale or mismatched revalidation binding: ' + key);
  }
  assert.deepEqual(proof.reproduction, expectedReproduction(evidence.receipt, evidence.review),
    'Revalidation must retain all historical output, processing, geometry and frame hashes');
  return { path: revalidationPath, sha256: proofFile.record.sha256, implementationSha256: proof.implementation.sha256 };
}

export async function writeTechnicalPackingRevalidation(options = {}) {
  const root = path.resolve(options.root || defaultRoot);
  assert(typeof options.outputPath === 'string' && options.outputPath.startsWith('docs/audits/')
    && options.outputPath.endsWith('.json'), 'Write revalidation evidence under docs/audits/');
  const output = resolveRelative(root, options.outputPath);
  const proof = await createTechnicalPackingRevalidation({ ...options, root });
  const protectedPaths = Object.values(proof.historicalEvidence)
    .filter(record => record && typeof record === 'object').map(record => record.path);
  assert(!protectedPaths.includes(options.outputPath), 'Historical evidence must not be rewritten');
  const bytes = Buffer.from(JSON.stringify(proof, null, 2) + '\n');
  await fs.mkdir(path.dirname(output), { recursive: true });
  try {
    await fs.writeFile(output, bytes, { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    assert((await fs.readFile(output)).equals(bytes), 'Refusing to overwrite different revalidation evidence');
  }
  return { path: options.outputPath, sha256: digest(bytes), bytes: bytes.length, frames: proof.reproduction.frames.length };
}

async function main() {
  const args = process.argv.slice(2);
  const promotionPath = args.shift();
  const options = { promotionPath };
  while (args.length) {
    const flag = args.shift();
    const value = args.shift();
    assert(value && ['--output', '--date', '--root'].includes(flag), 'Unknown or incomplete revalidation option');
    const key = { '--output': 'outputPath', '--date': 'date', '--root': 'root' }[flag];
    assert(options[key] === undefined, 'Duplicate revalidation option: ' + flag);
    options[key] = value;
  }
  const result = await writeTechnicalPackingRevalidation(options);
  console.log(JSON.stringify({ passed: true, ...result }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Technical packing revalidation failed: ' + error.message);
    process.exitCode = 1;
  });
}
