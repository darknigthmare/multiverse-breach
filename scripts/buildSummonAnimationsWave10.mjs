import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { segmentAtlas } from './buildCombatEntityAssets.mjs';

const root = new URL('../', import.meta.url);
const docs = 'docs/combat-fidelity-wave10-2026-10-23';
const registryPath = 'src/game/combat/summonAnimationsWave10.generated.json';
const phases = ['arrival', 'preparation', 'attack', 'recovery'];
const frameWidth = 512, frameHeight = 256, baseline = 244, margin = 10;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFile(new URL(path, root));
const json = async path => JSON.parse(await read(path));
const encoded = value => `${JSON.stringify(value, null, 2)}\n`;

async function packRow(row, scale) {
  const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
  const composites = [], frameBounds = [];
  for (const [col, frame] of row.frames.entries()) {
    const b = frame.bounds, width = Math.max(1, Math.round(b.width * scale)), height = Math.max(1, Math.round(b.height * scale));
    const left = Math.round(frameWidth / 2 + (b.left - frame.centerX) * scale), top = Math.round(baseline - (bottom - b.top) * scale);
    assert.ok(left >= margin && top >= margin && left + width <= frameWidth - margin && top + height <= frameHeight - margin, 'native subject would be cropped');
    const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height }).resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
    composites.push({ input, left: col * frameWidth + left, top });
    frameBounds.push({ source: b, output: { left, top, width, height } });
  }
  const bytes = await sharp({ create: { width: frameWidth * 4, height: frameHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
  return { bytes, frameBounds };
}

async function review(bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, frameWidth * 4); assert.equal(info.height, frameHeight * 4);
  const all = [], phaseReviews = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [], visiblePixels = [];
    for (let col = 0; col < 4; col++) {
      const cell = Buffer.alloc(frameWidth * frameHeight * 4); let visible = 0;
      for (let y = 0; y < frameHeight; y++) for (let x = 0; x < frameWidth; x++) {
        const offset = ((row * frameHeight + y) * info.width + col * frameWidth + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(cell, (y * frameWidth + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < margin || y < margin || x >= frameWidth - margin || y >= frameHeight - margin) assert.equal(alpha, 0, `opaque edge ${row}:${col}`);
      }
      assert.ok(visible > 300); frameHashes.push(hash(cell)); visiblePixels.push(visible);
    }
    assert.equal(new Set(frameHashes).size, 4); all.push(...frameHashes);
    phaseReviews.push({ phase: phases[row], row, distinctFrames: 4, frameHashes, visiblePixels, transparentMarginPixels: margin });
  }
  assert.equal(new Set(all).size, 16);
  return { distinctCells: 16, phaseReviews };
}

export async function buildSummonAnimationsWave10(check = false) {
  const { records, attempts } = await json(`${docs}/summon-generation-records.json`);
  assert.deepEqual(records.map(record => record.slug), ['trinity', 'tealc', 'alyx', 'nick', 'hicks', 'chains', 'egon', 'coach']);
  const entries = [], sources = [];
  for (const record of records) {
    assert.equal(record.reviewed, true, `${record.slug}: visual review missing`);
    const sourceImage = record.sourceImage, source = await read(sourceImage), prompt = await read(record.promptFile);
    const reference = record.referenceImage ? await read(record.referenceImage) : null;
    assert.equal(prompt.toString().trimEnd(), record.prompt);
    const atlas = await segmentAtlas(fileURLToPath(new URL(sourceImage, root)), 4);
    assert.ok(atlas.rows.every(row => row.seamReview.crossedOpaquePixels === 0 && row.seamReview.crossedVisiblePixels === 0));
    const body = atlas.rows[record.calibration.row].frames[record.calibration.column].bounds;
    const sourceBodyHeight = body.height;
    const halfWidth = Math.max(...atlas.rows.flatMap(row => row.frames.map(frame => Math.max(frame.centerX - frame.bounds.left, frame.bounds.left + frame.bounds.width - frame.centerX))));
    const envelopeHeight = Math.max(...atlas.rows.map(row => Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height)) - Math.min(...row.frames.map(frame => frame.bounds.top))));
    // Wider transparent cells preserve physical sword reach while retaining a
    // single body scale. Packing never draws, stretches or repairs anatomy.
    const scale = Math.min(record.calibration.targetBodyHeight / sourceBodyHeight, (frameWidth / 2 - margin - 1) / halfWidth, (baseline - margin - 1) / envelopeHeight);
    const rows = await Promise.all(atlas.rows.map(row => packRow(row, scale)));
    const bytes = await sharp({ create: { width: frameWidth * 4, height: frameHeight * 4, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(rows.map((row, index) => ({ input: row.bytes, left: 0, top: index * frameHeight }))).png({ compressionLevel: 9 }).toBuffer();
    const pixels = await review(bytes), sheet = `/sprites/generated/summon-animations-wave10/${record.slug}.png`;
    const entry = { id: record.id, key: record.key, universe: record.universe, entityName: record.entityName, actionName: record.actionName,
      kind: 'reinforcement', bodySource: 'roster-performer', performerHeroId: record.performerHeroId,
      sheet, columns: 4, rows: 4, frames: 16, width: frameWidth * 4, height: frameHeight * 4, frameWidth, frameHeight,
      phases: Object.fromEntries(phases.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: 8, loop: false }])),
      sha256: hash(bytes), alpha: true, assetMissing: false, sourceImage, sourceImageSha256: hash(source), sourceDimensions: [atlas.width, atlas.height],
      referenceImage: record.referenceImage, referenceImageSha256: reference ? hash(reference) : null, sourceWork: record.sourceWork,
      sourceReference: `${record.sourceWork}. Genuine roster performer with sixteen newly generated poses; adaptation, not verified source frames. ${record.reviewNotes}`,
      effectAnchors: record.effectAnchors || null,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
      normalization: { method: 'alpha-seams-wide-cell-common-body-scale-v1', sharedScaleAcrossAllPhases: true, scale, baseline,
        bodyCalibration: { ...record.calibration, sourceBodyHeight, outputBodyHeight: Math.round(sourceBodyHeight * scale), constrainedByEnvelope: scale < record.calibration.targetBodyHeight / sourceBodyHeight },
        rows: rows.map((row, index) => ({ phase: phases[index], sourceImage, sourceImageSha256: hash(source), sourceRow: index,
          sourceBounds: atlas.rows[index].sourceBounds, scale, baseline, frameBounds: row.frameBounds, ...atlas.rows[index].seamReview })) },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fullSubjectContained: true, defaultFacing: 'right', ...pixels,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, noNewGameplayEvents: true } };
    entries.push(entry);
    sources.push({ id: record.id, archivedPath: sourceImage, sha256: hash(source), originalGeneratedPath: record.file,
      promptFile: record.promptFile, promptSha256: hash(prompt), prompt: record.prompt, referenceImage: record.referenceImage, referencedSourceSha256: reference ? hash(reference) : null,
      identityReferenceImage: record.identityReferenceImage, originalSourceFile: record.originalSourceFile || null,
      originalPrompt: record.originalPrompt || null, originalToolArguments: record.originalToolArguments || null,
      toolArguments: record.toolArguments, provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
      nativeGenerationCalls: record.nativeGenerationCalls, accepted: true, sourceWork: record.sourceWork, reviewed: true, reviewNotes: record.reviewNotes, networkVerified: false, canon1to1Verified: false });
    if (check) assert.deepEqual(await read(`public${sheet}`), bytes, `${record.id}: native reconstruction differs`);
    else {
      await mkdir(new URL('public/sprites/generated/summon-animations-wave10/', root), { recursive: true });
      await writeFile(new URL(`public${sheet}`, root), bytes);
      await sharp(bytes).resize(1536, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#151b29' }).png().toFile(fileURLToPath(new URL(`${docs}/summon-${record.slug}-contact.png`, root)));
    }
  }
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const provenance = { schemaVersion: 1, date: '2026-10-23', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    actualNativeGenerationCalls: attempts.length, nativePoses: 128, rosterPerformers: 8, supernaturalEntityBodies: 0, preservedHistoricalEntityAtlases: 28,
    rectangularCellsPreserveBodyScaleAndWeaponReach: true, sources, entries, source1to1Verified: false };
  for (const [path, object] of [[registryPath, registry], [`${docs}/summon-provenance.json`, provenance]]) {
    if (check) assert.equal((await read(path)).toString(), encoded(object), `${path}: stale registry/provenance`);
    else await writeFile(new URL(path, root), encoded(object));
  }
  return { check, rosterPerformers: 8, poses: 128, sharedBodyScale: true, reconstructedExactly: true };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildSummonAnimationsWave10(process.argv.includes('--check'))));
