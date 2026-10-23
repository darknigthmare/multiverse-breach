import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = 'docs/combat-fidelity-wave8-2026-10-20';
const REGISTRY = 'src/game/combat/characterAnimationsWave8PartB.generated.json';
const MANIFEST = `${DOCS}/part-b-generation-records.json`;
const PROVENANCE = `${DOCS}/part-b-provenance.json`;
const IDS = ['kiryu_yakuza', 'majima_yakuza', 'ichiban_yakuza', 'saejima_yakuza', 'akiyama_yakuza'];
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFile(path.resolve(ROOT, file));
const json = async file => JSON.parse(await fs.readFile(path.resolve(ROOT, file), 'utf8'));
const writeJson = async (file, value) => {
  await fs.mkdir(path.dirname(path.resolve(ROOT, file)), { recursive: true });
  await fs.writeFile(path.resolve(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
};

async function reviewFrames(bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048); assert.equal(info.channels, 4);
  const frameHashes = [], phaseReviews = [];
  for (let row = 0; row < 8; row++) {
    const hashes = [], visiblePixels = [];
    for (let col = 0; col < 4; col++) {
      const visible = Buffer.alloc(256 * 256 * 4); let pixels = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(visible, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) pixels++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, `${PHASES[row]}:${col}: nontransparent outer margin`);
      }
      assert.ok(pixels > 300 && pixels < 45000, `${PHASES[row]}:${col}: empty pose or opaque background panel`);
      const digest = sha256(visible); hashes.push(digest); frameHashes.push(digest); visiblePixels.push(pixels);
    }
    assert.equal(new Set(hashes).size, 4, `${PHASES[row]}: repeated native cell`);
    phaseReviews.push({ phase: PHASES[row], distinctFrames: 4, frameHashes: hashes, visiblePixels, transparentMarginPixels: 10 });
  }
  assert.equal(new Set(frameHashes).size, 32, 'Repeated native cell across phases');
  return { distinctCells: 32, phaseReviews };
}

async function nativeRecords() {
  const manifest = await json(MANIFEST);
  const attempts = await json(`${DOCS}/part-b-attempts.json`);
  const calls = attempts.batches.flatMap(batch => batch.calls);
  assert.equal(calls.length, attempts.actualToolInvocations);
  assert.equal(calls.filter(call => call.outcome === 'returned-image').length, attempts.returnedArchivedNativeImages);
  for (const call of calls) {
    assert.equal(sha256(await read(call.promptFile)), call.promptSha256);
    assert.equal((await read(call.promptFile)).toString(), call.exactArguments.prompt);
    assert.equal(call.exactArguments.transparent_background, true);
    for (const reference of call.referenceInputs) assert.equal(sha256(await read(reference.archivedPath)), reference.sha256);
    assert.equal(call.model, null); assert.equal(call.generationId, null); assert.equal(call.jobId, null);
  }
  assert.deepEqual(manifest.records.map(record => record.heroId), IDS);
  assert.equal(manifest.provider, 'OpenAI'); assert.equal(manifest.model, null);
  for (const source of manifest.nativeSources) {
    assert.equal(sha256(await read(source.archivedPath)), source.sha256, source.archivedPath);
    assert.equal(sha256(await read(source.promptFile)), source.promptSha256, source.archivedPath);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
  }
  for (const record of manifest.records) {
    assert.equal(sha256(await read(record.sourceImage)), record.sourceImageSha256, record.heroId);
    assert.equal(sha256(await read(record.referenceArchive)), record.referenceAssetSha256, record.heroId);
    assert.equal(sha256(await read(`public${record.referenceAsset}`)), record.referenceAssetSha256, record.heroId);
    assert.equal(sha256(await read(record.promptFile)), record.promptSha256, record.heroId);
    assert.equal(record.model, null); assert.equal(record.generationId, null); assert.equal(record.jobId, null);
    assert.equal(record.identityReviewed, true); assert.equal(record.allFramesReviewed, true);
    assert.deepEqual(record.phaseSources.map(source => source.phase), PHASES);
    record.phaseSources.forEach(source => assert.ok(manifest.nativeSources.some(native => native.archivedPath === source.sourceImage && native.sha256 === source.sourceImageSha256)));
  }
  return manifest;
}

export async function buildCombatCharacterAnimationsWave8PartB() {
  const manifest = await nativeRecords();
  const entries = [], sources = [];
  await fs.mkdir(path.resolve(ROOT, 'public/sprites/generated/combat-character-animations-wave8'), { recursive: true });
  await fs.mkdir(path.resolve(ROOT, DOCS, 'part-b-contacts'), { recursive: true });
  for (const record of manifest.records) {
    const atlasCache = new Map();
    const getAtlas = async source => {
      const key = `${source.sourceImage}:${source.sourceRows}`;
      if (!atlasCache.has(key)) atlasCache.set(key, await segmentAtlas(path.resolve(ROOT, source.sourceImage), source.sourceRows));
      return atlasCache.get(key);
    };
    const originalAtlas = await getAtlas({ sourceImage: record.sourceImage, sourceRows: record.originalSourceRows });
    const composites = [], rows = [];
    for (let row = 0; row < 8; row++) {
      const source = record.phaseSources[row], atlas = await getAtlas(source), nativeRow = atlas.rows[source.sourceRow];
      assert.equal(nativeRow.seamReview.crossedOpaquePixels, 0, `${record.heroId}:${row}: opaque native pose crossed a column seam`);
      const normalized = await normalizeRow(nativeRow);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      rows.push({ phase: PHASES[row], sourceImage: source.sourceImage, sourceImageSha256: source.sourceImageSha256,
        sourceRow: source.sourceRow, sourceRows: source.sourceRows, sourceBounds: nativeRow.sourceBounds, scale: normalized.scale,
        baseline: normalized.baseline, frameBounds: normalized.frameBounds, ...nativeRow.seamReview,
        ...(record.statureByPhase?.[PHASES[row]] || {}) });
    }
    const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewFrames(bytes);
    const sheet = `/sprites/generated/combat-character-animations-wave8/${record.heroId}.png`;
    await fs.writeFile(path.resolve(ROOT, `public${sheet}`), bytes);
    const contact = `${DOCS}/part-b-contacts/${record.heroId}.png`;
    await sharp(bytes).resize(512, 1024, { kernel: sharp.kernel.nearest }).flatten({ background: '#172238' }).png().toFile(path.resolve(ROOT, contact));
    const entry = {
      id: record.heroId, heroId: record.heroId, universe: record.universe, name: record.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'super' || phase === 'fatality' ? 12 : 8, loop: false }])),
      sha256: sha256(bytes), alpha: true, sourceImage: record.sourceImage, sourceImageSha256: record.sourceImageSha256,
      sourceDimensions: [originalAtlas.width, originalAtlas.height], referenceAsset: record.referenceAsset, referenceAssetSha256: record.referenceAssetSha256,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, sourceFacts: record.sourceFacts, referenceUsage: record.referenceUsage,
      originalSourceImage: record.nativeCorrection ? record.sourceImage : null,
      originalSourceImageSha256: record.nativeCorrection ? record.sourceImageSha256 : null,
      nativeCorrection: record.nativeCorrection, nativeCorrectionDetails: record.correctionDetails,
      preservedInitialNativeCells: record.phaseSources.filter(source => source.sourceImage === record.sourceImage).length * 4,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, sourceWideBodyCalibration: record.sourceWideBodyCalibration, rows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, notes: record.notes }
    };
    entries.push(entry);
    sources.push({ heroId: record.heroId, universe: record.universe, sourceWork: record.sourceWork,
      sourceReference: record.sourceReference, archivedPath: record.sourceImage, sha256: record.sourceImageSha256,
      sourceDimensions: entry.sourceDimensions, originalGeneratedPath: record.originalGeneratedPath,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: 'native-imagegen',
      transparentBackgroundRequested: true, accepted: true,
      sourceRowsUsed: record.phaseSources.filter(source => source.sourceImage === record.sourceImage).map(source => source.sourceRow),
      phaseSources: record.phaseSources, nativeCorrectionDetails: record.correctionDetails,
      promptFile: record.promptFile, promptSha256: record.promptSha256, referenceAsset: record.referenceAsset,
      referenceAssetSha256: record.referenceAssetSha256, referenceArchive: record.referenceArchive,
      referenceArchiveSha256: record.referenceAssetSha256, referenceUsage: record.referenceUsage,
      contact, networkVerified: false, canon1to1Verified: false });
  }
  await writeJson(REGISTRY, { schemaVersion: 1, source: 'OpenAI', entries });
  await writeJson(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', part: 'B', provider: 'OpenAI',
    model: null, generationId: null, jobId: null,
    method: 'Five initial native image_gen atlases and the actual archived native correction calls after inspection of local references and generated poses. Missing, incomplete or clipped rows are replaced only by new native rows. Sharp only extracts alpha-separated cells, applies shared per-phase scale and baseline normalization, and builds review contacts. No limb, pose, clone, weapon or effect is procedurally painted or synthesized. Renderer-only body-stature metadata uses the same single source-wide body scale calibrated from an inspected standing BODY190px reference. The native body-height ratio of crouches and jumps, density changes between native sources, and baseline244 are preserved; no body or weapon is redrawn or cropped. Concrete source facts and blocked page reads are archived separately; global 1:1 is not certified.',
    nativeGenerationCount: manifest.nativeSources.filter(source => source.operation === 'native-imagegen-initial').length,
    nativeCorrectionCount: manifest.nativeSources.filter(source => source.operation === 'native-imagegen-correction').length,
    networkVerified: false, canon1to1Verified: false, globalFidelity1to1: false,
    attemptArchive: `${DOCS}/part-b-attempts.json`,
    blockedPresentationIds: [],
    authorizedReplacementIds: [],
    nativeSources: manifest.nativeSources, sources, entries,
    renderStatureCorrections: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview)
      .map(row => ({ heroId: entry.heroId, phase: row.phase, renderScale: row.renderScale, statureReview: row.statureReview,
        unchangedPngSha256: entry.sha256 }))) });
  return checkCombatCharacterAnimationsWave8PartB();
}

export async function checkCombatCharacterAnimationsWave8PartB() {
  const manifest = await nativeRecords(), registry = await json(REGISTRY), provenance = await json(PROVENANCE);
  assert.deepEqual(registry.entries.map(entry => entry.heroId), IDS);
  assert.equal(provenance.sources.length, 5); assert.equal(provenance.canon1to1Verified, false);
  assert.equal(provenance.model, null); assert.equal(provenance.generationId, null); assert.equal(provenance.jobId, null);
  let poses = 0;
  for (const [index, entry] of registry.entries.entries()) {
    const record = manifest.records[index];
    assert.equal(entry.universe, record.universe); assert.equal(entry.sourceWork, record.sourceWork);
    assert.equal(entry.sourceImageSha256, record.sourceImageSha256); assert.equal(entry.referenceAssetSha256, record.referenceAssetSha256);
    assert.deepEqual(Object.keys(entry.phases), PHASES); assert.equal(entry.frames, 32); assert.equal(entry.normalization.baseline, 244);
    PHASES.forEach((phase, row) => { assert.equal(entry.phases[phase].row, row); assert.equal(entry.phases[phase].frames, 4); });
    entry.normalization.rows.forEach(row => { assert.equal(row.crossedOpaquePixels, 0); assert.equal(row.baseline, 244); });
    for (const row of entry.normalization.rows) {
      const measured = record.statureByPhase?.[row.phase];
      assert.deepEqual(row.renderScale, measured?.renderScale); assert.deepEqual(row.statureReview, measured?.statureReview);
      if (measured) {
        const review = measured.statureReview;
        assert.ok(row.renderScale >= 0.5 && row.renderScale <= 3);
        assert.equal(review.measurementKind, 'visual-body-roi'); assert.equal(review.excludesWeaponEffects, true);
        assert.equal(review.bodyBounds[3], review.normalizedBodyHeight); assert.equal(review.referenceBodyBounds[3], review.referenceBodyHeight);
        assert.ok(review.nativeComparableBodyHeight > 0 && review.nativeReferenceBodyHeight > 0);
        const expectedHeight = review.calibrationTargetBodyHeight * review.nativeComparableBodyHeight / review.nativeReferenceBodyHeight;
        assert.ok(Math.abs(row.renderScale * review.normalizedBodyHeight - expectedHeight) < 1);
      }
    }
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.identityReviewed, true);
    const bytes = await read(`public${entry.sheet}`); assert.equal(sha256(bytes), entry.sha256);
    const reconstruction = [], nativeAtlases = new Map();
    for (const [row, source] of record.phaseSources.entries()) {
      const key = `${source.sourceImage}:${source.sourceRows}`;
      if (!nativeAtlases.has(key)) nativeAtlases.set(key, await segmentAtlas(path.resolve(ROOT, source.sourceImage), source.sourceRows));
      const normalized = await normalizeRow(nativeAtlases.get(key).rows[source.sourceRow]);
      reconstruction.push({ input: normalized.bytes, left: 0, top: row * 256 });
    }
    const reconstructed = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(reconstruction).png({ compressionLevel: 9 }).toBuffer();
    assert.equal(sha256(reconstructed), entry.sha256, `${entry.heroId}: final pixels differ from archived native rows`);
    const review = await reviewFrames(bytes); assert.equal(review.distinctCells, 32);
    assert.deepEqual(review.phaseReviews, entry.visualValidation.phaseReviews);
    const source = provenance.sources[index];
    assert.equal(source.heroId, entry.heroId); assert.equal(source.sha256, entry.sourceImageSha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    assert.equal(source.promptSha256, sha256(await read(source.promptFile)));
    assert.equal(source.referenceArchiveSha256, sha256(await read(source.referenceArchive)));
    const contact = await sharp(await read(source.contact)).metadata(); assert.equal(contact.width, 512); assert.equal(contact.height, 1024);
    poses += review.distinctCells;
  }
  return { checked: true, atlases: registry.entries.length, phases: 40, nativeDistinctPoses: poses,
    width: 1024, height: 2048, baseline: 244, transparentMarginPixels: 10, canon1to1Verified: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = process.argv.includes('--check') ? await checkCombatCharacterAnimationsWave8PartB() : await buildCombatCharacterAnimationsWave8PartB();
  console.log(JSON.stringify(result));
}
