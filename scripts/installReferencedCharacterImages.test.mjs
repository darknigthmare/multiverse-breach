import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { normalizeReferencedCharacterPng, installReferencedCharacterImages,
  inspectReferencedCharacterPng, auditReferencedCharacterImages } from './installReferencedCharacterImages.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const output = '/sprites/generated/heroes/installer-test/first.png';
const publicManifestPath = 'docs/audits/installer-test-png.json';
const hasFile = async file => {
  try { await fs.access(file); return true; } catch { return false; }
};

const sourceSheet = async (adjust = () => {}, { width = 256, height = 256 } = {}) => {
  const cellSize = width / 4;
  const pixels = Buffer.alloc(width * height * 4);
  const paint = (x, y, w, h, color) => {
    for (let row = y; row < y + h; row += 1) for (let col = x; col < x + w; col += 1) {
      const index = (row * width + col) * 4;
      pixels[index] = color[0]; pixels[index + 1] = color[1]; pixels[index + 2] = color[2]; pixels[index + 3] = color[3] ?? 255;
    }
  };
  for (let cell = 0; cell < 16; cell += 1) paint(Math.round(cell % 4 * width / 4) + 20,
    Math.round(Math.floor(cell / 4) * height / 4) + 20, 12, 24, [60 + cell * 8, 20 + cell * 4, 80]);
  await adjust({ paint, pixels, width, height, cellSize });
  return sharp(pixels, { raw: { width, height, channels: 4 } }).png().toBuffer();
};

const fixture = async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'referenced-png-install-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const root = path.join(directory, 'repo');
  const privateDir = path.join(directory, 'private');
  await fs.mkdir(root); await fs.mkdir(privateDir);
  const source = await sourceSheet();
  const sourcePath = path.join(privateDir, 'source.png');
  const referencePath = path.join(root, 'public/images/oc-worlds/v2/installer-test/reference.png');
  await fs.mkdir(path.dirname(referencePath), { recursive: true });
  await fs.writeFile(sourcePath, source);
  await fs.writeFile(referencePath, source);
  const job = { kind: 'hero', id: 'first', name: 'Fixture First', universe: 'Installer Test', output,
    source: sourcePath, sourceSha256: digest(source), reference: referencePath, referenceSha256: digest(source),
    provider: 'OpenAI', interface: 'built-in image_gen', visualReview: 'close-to-reference', canonicalFidelityApproved: false };
  const manifestPath = path.join(privateDir, 'plan.json');
  const writePlan = async jobs => fs.writeFile(manifestPath, JSON.stringify({ schemaVersion: 1, jobs }));
  await writePlan([job]);
  return { root, privateDir, sourcePath, referencePath, manifestPath, job, writePlan, source };
};

test('one uniform scale packs all original frames with RGBA and transparent 12 px guards', async () => {
  const source = await sourceSheet(({ paint }) => { paint(20, 20, 24, 24, [60, 20, 80]); });
  const normalized = await normalizeReferencedCharacterPng(source);
  const frameSizes = normalized.processing.frameMeasurements;
  assert.equal(frameSizes[0].normalizedWidth, 232);
  assert.equal(frameSizes[1].normalizedWidth, 145);
  assert.ok(frameSizes.every(frame => frame.normalizedHeight === 232));
  assert.equal(normalized.processing.uniformScale, 232 / 32);
  assert.equal(normalized.processing.sourceVisiblePixels, normalized.processing.assignedVisiblePixels);
  const geometry = await inspectReferencedCharacterPng(normalized.buffer);
  assert.equal(geometry.nonemptyCells, 16);
  assert.ok(geometry.minimumGuard >= 12);
  const { data, info } = await sharp(normalized.buffer).raw().toBuffer({ resolveWithObject: true });
  const colors = new Set();
  for (let index = 0; index < data.length; index += 4) if (data[index + 3]) colors.add(data.subarray(index, index + 4).toString('hex'));
  assert.equal(info.channels, 4);
  assert.equal(colors.size, 16, 'normalization introduced/duplicated/recolored visible frame colors');
});

test('strict source rejects empty cells and clipped poses before any packing', async () => {
  const empty = await sourceSheet(({ pixels, width }) => {
    for (let y = 20; y < 44; y++) for (let x = 20; x < 32; x++) pixels.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 4);
  });
  await assert.rejects(normalizeReferencedCharacterPng(empty), /empty/);
  const clipped = await sourceSheet(({ paint }) => { paint(0, 20, 25, 24, [60, 20, 80]); });
  await assert.rejects(normalizeReferencedCharacterPng(clipped), /clipped|guard/);
});

test('source must be actual RGBA PNG and have a four by four layout', async () => {
  const jpeg = await sharp({ create: { width: 256, height: 256, channels: 3, background: '#fff' } }).jpeg().toBuffer();
  await assert.rejects(normalizeReferencedCharacterPng(jpeg), /RGBA PNG/);
  const rgb = await sharp({ create: { width: 256, height: 256, channels: 3, background: '#fff' } }).png().toBuffer();
  await assert.rejects(normalizeReferencedCharacterPng(rgb), /RGBA PNG/);
  const tiny = await sharp({ create: { width: 63, height: 64, channels: 4, background: '#00000000' } }).png().toBuffer();
  await assert.rejects(normalizeReferencedCharacterPng(tiny), /4 by 4/);
});

test('non-divisible dimensions use rounded source grid edges without resizing before extraction', async () => {
  const source = await sourceSheet(() => {}, { width: 257, height: 257 });
  const normalized = await normalizeReferencedCharacterPng(source);
  assert.deepEqual(normalized.processing.sourceGridEdges, { x: [0, 64, 129, 193, 257], y: [0, 64, 129, 193, 257] });
  assert.equal(normalized.processing.nonemptyCells, 16);
  assert.equal(normalized.processing.sourceVisiblePixels, 16 * 12 * 24);
  assert.equal(normalized.processing.sourceVisiblePixels, normalized.processing.assignedVisiblePixels);
});

test('a complete component crossing a virtual cell boundary remains intact without moving its inner pixels', async () => {
  const source = await sourceSheet(({ paint }) => { paint(30, 30, 40, 6, [60, 20, 80]); });
  await assert.rejects(normalizeReferencedCharacterPng(source), /clipped|guard/);
  const normalized = await normalizeReferencedCharacterPng(source, { componentLayout: true });
  assert.equal(normalized.processing.dominantBodies, 16);
  assert.ok(normalized.processing.crossesVirtualBoundaries.includes(1));
  assert.equal(normalized.processing.sourceVisiblePixels, normalized.processing.assignedVisiblePixels);
  assert.equal(normalized.processing.frameMeasurements[0].sourceVisibleBounds.right, 69);
  assert.equal(normalized.processing.frameMeasurements[0].sourceVisibleBounds.width, 50);
  const { data, info } = await sharp(normalized.buffer).raw().toBuffer({ resolveWithObject: true });
  const frame = normalized.processing.frameMeasurements[0];
  const minX = Math.floor((256 - frame.normalizedWidth) / 2);
  const minY = 244 - frame.normalizedHeight;
  const target = (x, y) => data[(y * info.width + x) * 4 + 3];
  assert.ok(target(minX + Math.round(51 * normalized.processing.uniformScale), minY + Math.round(16 * normalized.processing.uniformScale)) > 12,
    'the crossing weapon tip was lost');
});

test('component layout associates detached satellites by bbox and preserves their original distance', async () => {
  const source = await sourceSheet(({ paint }) => { paint(37, 26, 3, 3, [249, 30, 50]); });
  const normalized = await normalizeReferencedCharacterPng(source, { componentLayout: true });
  assert.equal(normalized.processing.satellites, 1);
  assert.equal(normalized.processing.sourceVisiblePixels, normalized.processing.assignedVisiblePixels);
  assert.equal(normalized.processing.frameMeasurements[0].sourceVisibleBounds.right, 39);
  assert.equal(normalized.processing.frameMeasurements[0].sourceVisibleBounds.left, 20);
});

for (const componentLayout of [false, true]) test(`${componentLayout ? 'component' : 'strict'} packing ignores remote weak alpha noise and preserves the 4 px fringe and feet baseline`, async () => {
  const clean = await sourceSheet();
  const noisy = await sourceSheet(({ paint }) => {
    for (let cell = 0; cell < 16; cell += 1) {
      const baseX = cell % 4 * 64;
      const baseY = Math.floor(cell / 4) * 64;
      paint(baseX + 52, baseY + 52, 3, 3, [240, 230, 210, 10]);
      paint(baseX + 18, baseY + 26, 2, 2, [248, 10, 180, 8]);
    }
  });
  const original = await normalizeReferencedCharacterPng(clean, { componentLayout });
  const result = await normalizeReferencedCharacterPng(noisy, { componentLayout });
  assert.equal(result.processing.uniformScale, original.processing.uniformScale);
  assert.equal(result.processing.maximumSourceFrameWidth, original.processing.maximumSourceFrameWidth);
  assert.equal(result.processing.maximumSourceFrameHeight, original.processing.maximumSourceFrameHeight);
  assert.equal(result.processing.softAlphaOutsideFrameDiscarded, 16 * 9);
  assert.equal(result.processing.softAlphaPixelsPreserved, 16 * 4);
  assert.equal(result.processing.sourceVisiblePixels, 16 * 12 * 24);
  assert.equal(result.processing.sourceVisiblePixels, result.processing.assignedVisiblePixels);
  assert.deepEqual(result.processing.visibleFootBaselinesByCell, original.processing.visibleFootBaselinesByCell);
  assert.equal(new Set(result.processing.visibleFootBaselinesByCell).size, 1);
  assert.equal(result.processing.sourceFringePixels, 4);
  const { data } = await sharp(result.buffer).raw().toBuffer({ resolveWithObject: true });
  let fringeFound = false;
  for (let index = 0; index < data.length; index += 4) {
    if (data[index] === 248 && data[index + 1] === 10 && data[index + 2] === 180 && data[index + 3] === 8) fringeFound = true;
    assert.ok(!(data[index] === 240 && data[index + 1] === 230 && data[index + 2] === 210 && data[index + 3] === 10), 'remote alpha noise survived packing');
  }
  assert.equal(fringeFound, true, 'the retained four-pixel silhouette fringe lost its RGBA color');
});

test('component layout refuses opaque outer borders, missing bodies, fused bodies and ambiguous satellites', async () => {
  const edge = await sourceSheet(({ paint }) => { paint(0, 0, 3, 3, [249, 30, 50]); });
  await assert.rejects(normalizeReferencedCharacterPng(edge, { componentLayout: true }), /external border/);
  const missing = await sourceSheet(({ pixels, width }) => {
    for (let y = 20; y < 44; y++) for (let x = 20; x < 32; x++) pixels.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 4);
  });
  await assert.rejects(normalizeReferencedCharacterPng(missing, { componentLayout: true }), /16 intact/);
  const fused = await sourceSheet(({ paint }) => { paint(30, 30, 60, 4, [249, 30, 50]); });
  await assert.rejects(normalizeReferencedCharacterPng(fused, { componentLayout: true }), /16 intact|fused|distinct|Ambiguous/);
  const ambiguous = await sourceSheet(({ paint }) => { paint(56, 27, 4, 4, [249, 30, 50]); });
  await assert.rejects(normalizeReferencedCharacterPng(ambiguous, { componentLayout: true }), /Ambiguous/);
});

test('successful install emits only public hashes and geometry and never touches historical ledger', async t => {
  const f = await fixture(t);
  const ledger = path.join(f.root, 'public/sprites/generated/openai-asset-ledger.jsonl');
  await fs.mkdir(path.dirname(ledger), { recursive: true });
  const historical = 'historical ledger stays exactly the same\n';
  await fs.writeFile(ledger, historical);
  const proof = JSON.stringify({ prompt: 'private exact prompt', generationId: 'private-tool-identifier', source: '/private/path' });
  const proofFile = path.join(f.privateDir, 'private-proof.json');
  await fs.writeFile(proofFile, proof);
  await f.writePlan([{ ...f.job, proofFile, proofSha256: digest(proof), generationId: 'must-not-publish', prompt: 'must-not-publish' }]);
  const result = await installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath });
  assert.equal(result.installed, 1);
  assert.equal(await fs.readFile(ledger, 'utf8'), historical);
  const manifestText = await fs.readFile(path.join(f.root, publicManifestPath), 'utf8');
  assert.ok(!manifestText.includes('generationId'));
  assert.ok(!manifestText.includes('private exact prompt'));
  assert.ok(!manifestText.includes(f.privateDir));
  const entry = JSON.parse(manifestText).entries[0];
  assert.equal(entry.visualReview.status, 'close-to-reference');
  assert.equal(entry.canonicalFidelityApproved, false);
  assert.equal(entry.privateEvidence.sha256, digest(proof));
  assert.equal(entry.sourceImage.sha256, digest(f.source));
  assert.equal(entry.reference.output, '/images/oc-worlds/v2/installer-test/reference.png');
  assert.deepEqual(await auditReferencedCharacterImages({ root: f.root, manifestPath: publicManifestPath }),
    { verified: 1, canonicalFidelityApproved: false, historicalLedgerModified: false });
});

test('installation refuses traversal, mismatched hashes and false visual fidelity claims', async t => {
  const f = await fixture(t);
  for (const job of [
    { ...f.job, output: '/sprites/generated/heroes/test/../../outside.png' },
    { ...f.job, source: '../source.png' },
    { ...f.job, sourceSha256: '0'.repeat(64) },
    { ...f.job, reference: f.sourcePath },
    { ...f.job, referenceSha256: '0'.repeat(64) },
    { ...f.job, canonicalFidelityApproved: true },
    { ...f.job, provider: 'unknown' }
  ]) {
    await f.writePlan([job]);
    await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath }));
    assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1))), false);
  }
  await f.writePlan([f.job]);
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath: '../unsafe.json' }), /Public manifest/);
});

test('actual OC IDs containing a colon and root-relative reference outputs are supported', async t => {
  const f = await fixture(t);
  await f.writePlan([{ ...f.job, id: 'installer_test:first', reference: '/images/oc-worlds/v2/installer-test/reference.png' }]);
  const result = await installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath });
  assert.equal(result.installed, 1);
  const manifest = JSON.parse(await fs.readFile(path.join(f.root, publicManifestPath), 'utf8'));
  assert.equal(manifest.entries[0].id, 'installer_test:first');
});

test('existing destination and symlink parents are rejected without altering their bytes', async t => {
  const f = await fixture(t);
  const file = path.join(f.root, 'public', output.slice(1));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, 'existing');
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath }), /overwrite/);
  assert.equal(await fs.readFile(file, 'utf8'), 'existing');
  await fs.rm(file);
  await fs.rmdir(path.dirname(file));
  await fs.symlink(f.privateDir, path.dirname(file));
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath }), /symlinks/);
});

test('all jobs validate before mutation and a later failed source leaves no outputs', async t => {
  const f = await fixture(t);
  await f.writePlan([f.job, { ...f.job, id: 'second', output: output.replace('first', 'second'), sourceSha256: '0'.repeat(64) }]);
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath }), /SHA-256 mismatch/);
  assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1))), false);
  assert.equal(await hasFile(path.join(f.root, publicManifestPath)), false);
});

test('commit failure rolls back every newly created PNG and leaves the prior ledger untouched', async t => {
  const f = await fixture(t);
  await f.writePlan([f.job, { ...f.job, id: 'second', output: output.replace('first', 'second') }]);
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath,
    hooks: { afterAssetWrite: index => { if (index === 1) throw new Error('injected commit failure'); } } }), /injected/);
  assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1))), false);
  assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1).replace('first', 'second'))), false);
  assert.equal(await hasFile(path.join(f.root, publicManifestPath)), false);
});

test('failed final audit rolls back both PNG and new public manifest', async t => {
  const f = await fixture(t);
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath,
    hooks: { beforeFinalAudit: async () => fs.writeFile(path.join(f.root, 'public', output.slice(1)), 'corrupted') } }), /SHA-256/);
  assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1))), false);
  assert.equal(await hasFile(path.join(f.root, publicManifestPath)), false);
});

test('duplicate outputs are refused before any installation', async t => {
  const f = await fixture(t);
  await f.writePlan([f.job, { ...f.job, id: 'second' }]);
  await assert.rejects(installReferencedCharacterImages({ root: f.root, manifestPath: f.manifestPath, publicManifestPath }), /Duplicate/);
  assert.equal(await hasFile(path.join(f.root, 'public', output.slice(1))), false);
});
