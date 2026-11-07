import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { before, test } from 'node:test';
import {
  createTechnicalPackingRevalidation,
  verifyTechnicalPackingRevalidation,
  writeTechnicalPackingRevalidation
} from './revalidateTechnicalSpritePacking.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const promotionPath = 'docs/audits/elyra-frame-packing-runtime-2026-10-20.json';
const receiptPath = 'docs/audits/elyra-frame-packing-2026-10-20.json';
const reviewPath = 'docs/cg/reviews/wave3-2026-10-20/elyra-frame-packing-independent-review.json';
const sourcePath = 'public/sprites/generated/heroes/nexus-de-convergence/arca-elyra.png';
const snapshotPath = 'docs/cg/references/wave3-2026-10-20/elyra/canonical-selected-atlas.png';
const packedPath = 'public/sprites/generated/heroes/nexus-de-convergence/arca-elyra-frame-packing-2026-10-20.png';
const implementationPath = 'scripts/installReferencedCharacterImages.mjs';
const toolPath = 'scripts/revalidateTechnicalSpritePacking.mjs';
const proofPath = 'docs/audits/test-implementation-revalidation.json';
const date = '2026-11-07';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const originalFiles = new Map();
let templateProof;

async function write(root, relative, bytes) {
  const destination = path.join(root, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
}

async function writeJson(root, relative, value) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  await write(root, relative, bytes);
  return digest(bytes);
}

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'technical-packing-revalidation-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const [relative, bytes] of originalFiles) await write(root, relative, bytes);
  if (templateProof) await writeJson(root, proofPath, templateProof);
  return root;
}

before(async () => {
  for (const relative of [promotionPath, receiptPath, reviewPath, sourcePath, snapshotPath, packedPath, implementationPath, toolPath]) {
    originalFiles.set(relative, await fs.readFile(path.join(repositoryRoot, relative)));
  }
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'technical-packing-proof-template-'));
  try {
    for (const [relative, bytes] of originalFiles) await write(root, relative, bytes);
    templateProof = await createTechnicalPackingRevalidation({ root, promotionPath, date });
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('current implementation reproduces the real reviewed atlas and all sixteen frames without rewriting history', async t => {
  const root = await fixture(t);
  const freshPath = 'docs/audits/fresh-implementation-revalidation.json';
  const result = await writeTechnicalPackingRevalidation({ root, promotionPath, outputPath: freshPath, date });
  assert.equal(result.frames, 16);
  const verified = await verifyTechnicalPackingRevalidation({ root, promotionPath, revalidationPath: freshPath });
  assert.equal(verified.implementationSha256, digest(originalFiles.get(implementationPath)));
  assert.notEqual(verified.implementationSha256, templateProof.historicalEvidence.implementation.sha256);
  assert.equal(templateProof.reproduction.outputSha256, 'd3d9a4825029297f2189f592a28c73bb08b043778e99b58c660e5f83512c9aaa');
  assert.equal(new Set(templateProof.reproduction.frames.map(frame => frame.packedFrameSha256)).size, 16);
  assert.equal(templateProof.newVisualReviewPerformed, false);
  assert.equal(templateProof.canonicalFidelityApproved, false);
  for (const relative of [promotionPath, receiptPath, reviewPath, sourcePath, snapshotPath, packedPath]) {
    assert((await fs.readFile(path.join(root, relative))).equals(originalFiles.get(relative)), relative + ' was rewritten');
  }
  assert.deepEqual(await writeTechnicalPackingRevalidation({ root, promotionPath, outputPath: freshPath, date }), result);
});

test('proof must be explicitly supplied rather than discovered or silently accepted', async t => {
  const root = await fixture(t);
  await assert.rejects(verifyTechnicalPackingRevalidation({ root, promotionPath }), /explicit implementation revalidation/);
});

for (const [label, relative, error] of [
  ['current implementation', implementationPath, /binding: implementation/],
  ['revalidation tool', toolPath, /binding: revalidationTool/],
  ['historical promotion', promotionPath, /binding: historicalEvidence/],
  ['historical preparation receipt', receiptPath, /Changed evidence/],
  ['historical independent review', reviewPath, /Changed evidence/],
  ['source image', sourcePath, /Changed evidence/],
  ['source snapshot', snapshotPath, /Source snapshot differs/],
  ['packed output image', packedPath, /Changed evidence/]
]) {
  test('rejects stale proof after changing ' + label, async t => {
    const root = await fixture(t);
    await fs.appendFile(path.join(root, relative), '\n');
    await assert.rejects(verifyTechnicalPackingRevalidation({ root, promotionPath, revalidationPath: proofPath }), error);
  });
}

for (const [label, mutate, error] of [
  ['historical implementation link', proof => { proof.historicalEvidence.implementation.sha256 = '0'.repeat(64); }, /binding: historicalEvidence/],
  ['declared current implementation hash', proof => { proof.implementation.sha256 = '0'.repeat(64); }, /binding: implementation/],
  ['declared output hash', proof => { proof.artwork.output.sha256 = '0'.repeat(64); }, /binding: artwork/],
  ['frame hash', proof => { proof.reproduction.frames[0].packedFrameSha256 = '0'.repeat(64); }, /retain all historical/],
  ['geometry hash', proof => { proof.reproduction.geometrySha256 = '0'.repeat(64); }, /retain all historical/],
  ['processing hash', proof => { proof.reproduction.processingSha256 = '0'.repeat(64); }, /retain all historical/],
  ['new visual approval claim', proof => { proof.newVisualReviewPerformed = true; }, /must not claim new artwork/]
]) {
  test('rejects modified proof ' + label, async t => {
    const root = await fixture(t);
    const proof = structuredClone(templateProof);
    mutate(proof);
    await writeJson(root, proofPath, proof);
    await assert.rejects(verifyTechnicalPackingRevalidation({ root, promotionPath, revalidationPath: proofPath }), error);
  });
}

test('generation refuses a changed output before writing any proof', async t => {
  const root = await fixture(t);
  await fs.appendFile(path.join(root, packedPath), '\n');
  const outputPath = 'docs/audits/rejected-output-proof.json';
  await assert.rejects(writeTechnicalPackingRevalidation({ root, promotionPath, outputPath, date }), /Changed evidence/);
  await assert.rejects(fs.access(path.join(root, outputPath)), { code: 'ENOENT' });
});

test('generation recomputes frame pixels instead of trusting consistent but false historical claims', async t => {
  const root = await fixture(t);
  const receipt = JSON.parse(originalFiles.get(receiptPath));
  const review = JSON.parse(originalFiles.get(reviewPath));
  const promotion = JSON.parse(originalFiles.get(promotionPath));
  receipt.comparison.frames[0].packedFrameSha256 = '0'.repeat(64);
  review.entries[0].packedFrameSha256 = '0'.repeat(64);
  promotion.preparationReceipt.sha256 = await writeJson(root, receiptPath, receipt);
  review.technicalReceipt.sha256AtReview = promotion.preparationReceipt.sha256;
  promotion.independentReview.sha256 = await writeJson(root, reviewPath, review);
  await writeJson(root, promotionPath, promotion);
  const outputPath = 'docs/audits/rejected-frame-proof.json';
  await assert.rejects(writeTechnicalPackingRevalidation({ root, promotionPath, outputPath, date }), /Reproduced frame changed/);
  await assert.rejects(fs.access(path.join(root, outputPath)), { code: 'ENOENT' });
});

test('generation cannot overwrite the historical receipt or a different existing proof', async t => {
  const root = await fixture(t);
  await assert.rejects(writeTechnicalPackingRevalidation({ root, promotionPath, outputPath: receiptPath, date }), /Historical evidence must not be rewritten/);
  await write(root, proofPath, Buffer.from('user-owned content\n'));
  await assert.rejects(writeTechnicalPackingRevalidation({ root, promotionPath, outputPath: proofPath, date }), /Refusing to overwrite/);
  assert.equal(await fs.readFile(path.join(root, proofPath), 'utf8'), 'user-owned content\n');
});
