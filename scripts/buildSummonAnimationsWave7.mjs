import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const root = new URL('../', import.meta.url);
const docs = 'docs/combat-fidelity-wave7-2026-10-20';
const registryPath = 'src/game/combat/summonAnimationsWave7.generated.json';
const phases = ['arrival', 'preparation', 'attack', 'recovery'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFile(new URL(path, root));
const json = async path => JSON.parse(await read(path));
const encoded = value => `${JSON.stringify(value, null, 2)}\n`;

// Every phase uses the same scale. A barrage/ice plume must not shrink only
// the attack body; a crouch or a bank remains smaller according to its source.
async function packRow(row, scale) {
  const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
  const composites = [], frameBounds = [];
  for (const [col, frame] of row.frames.entries()) {
    const b = frame.bounds;
    const width = Math.max(1, Math.round(b.width * scale));
    const height = Math.max(1, Math.round(b.height * scale));
    const left = Math.round(128 + (b.left - frame.centerX) * scale);
    const top = Math.round(244 - (bottom - b.top) * scale);
    assert.ok(left >= 10 && top >= 10 && left + width <= 246 && top + height <= 246, 'native cell would be cropped');
    const input = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height })
      .resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
    composites.push({ input, left: col * 256 + left, top });
    frameBounds.push({ source: b, output: { left, top, width, height } });
  }
  const bytes = await sharp({ create: { width: 1024, height: 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
  return { bytes, frameBounds };
}

async function review(bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  const all = [], phaseReviews = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [], visiblePixels = [];
    for (let col = 0; col < 4; col++) {
      const cell = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(cell, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `opaque edge ${row}:${col}`);
      }
      assert.ok(visible > 300); frameHashes.push(hash(cell)); visiblePixels.push(visible);
    }
    assert.equal(new Set(frameHashes).size, 4); all.push(...frameHashes);
    phaseReviews.push({ phase: phases[row], row, distinctFrames: 4, frameHashes, visiblePixels, transparentMarginPixels: 10 });
  }
  assert.equal(new Set(all).size, 16);
  return { distinctCells: 16, phaseReviews };
}

export async function buildSummonAnimationsWave7(check = false) {
  const { records } = await json(`${docs}/summon-generation-records.json`);
  assert.deepEqual(records.map(record => record.slug), ['bahamut', 'yamada', 'black-egrets']);
  const entries = [], sources = [];
  for (const record of records) {
    assert.equal(record.reviewed, true, `${record.slug}: visual review missing`);
    const sourceImage = record.acceptedSource || `${docs}/summon-sources/${record.slug}-original.png`;
    const referenceImage = `${docs}/summon-sources/${record.slug}-reference.png`;
    const promptFile = record.acceptedPrompt || `${docs}/summon-sources/${record.slug}-prompt.txt`;
    const source = await read(sourceImage), reference = await read(referenceImage), prompt = await read(promptFile);
    assert.equal(prompt.toString(), record.prompt);
    assert.deepEqual(await read(`public${record.referenceAsset}`), reference);
    const atlas = await segmentAtlas(fileURLToPath(new URL(sourceImage, root)), 4);
    assert.ok(atlas.rows.every(row => row.seamReview.crossedOpaquePixels === 0 && row.seamReview.crossedVisiblePixels === 0));
    const candidates = await Promise.all(atlas.rows.map(normalizeRow));
    // Small extra margin makes nearest-neighbor rounding stay inside10px.
    const scale = Math.min(...candidates.map(candidate => candidate.scale)) * 0.99;
    const rows = await Promise.all(atlas.rows.map(row => packRow(row, scale)));
    const bytes = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(rows.map((row, index) => ({ input: row.bytes, left: 0, top: index * 256 }))).png({ compressionLevel: 9 }).toBuffer();
    const pixels = await review(bytes);
    const sheet = `/sprites/generated/summon-animations-wave7/${record.slug}.png`;
    const entry = { id: record.id, key: record.key, universe: record.universe, entityName: record.entityName, actionName: record.actionName,
      kind: record.kind, sheet, columns: 4, rows: 4, frames: 16, width: 1024, height: 1024, frameWidth: 256, frameHeight: 256,
      phases: Object.fromEntries(phases.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: 8, loop: false }])),
      sha256: hash(bytes), alpha: true, assetMissing: false, sourceImage, sourceImageSha256: hash(source), sourceDimensions: [atlas.width, atlas.height],
      referenceAsset: record.referenceAsset, referenceImage, referenceAssetSha256: hash(reference), sourceWork: record.sourceWork,
      sourceReference: `Local legacy entity reference and explicit character source role; ${record.sourceWork}. All sixteen poses are newly generated adaptations, not verified source frames.`,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, canonicalVerified: false, canon1to1Verified: false, networkVerified: false,
      normalization: { method: 'alpha-seams-common-entity-scale-v1', sharedScaleAcrossAllPhases: true, scale, baseline: 244,
        rows: rows.map((row, index) => ({ phase: phases[index], sourceImage, sourceImageSha256: hash(source), sourceRow: index,
          sourceBounds: atlas.rows[index].sourceBounds, scale, baseline: 244, frameBounds: row.frameBounds, ...atlas.rows[index].seamReview })) },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fullSubjectContained: true, defaultFacing: 'right', ...pixels,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, noNewGameplayEvents: true } };
    entries.push(entry);
    sources.push({ id: record.id, archivedPath: sourceImage, sha256: hash(source), originalGeneratedPath: record.file,
      promptFile, promptSha256: hash(prompt), prompt: record.prompt, referenceImage, referencedSourceSha256: hash(reference),
      provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null, nativeGenerationCalls: 1 + (record.correctiveAttempts?.length || 0), correctiveAttempts: record.correctiveAttempts || [], initialGeneration: record.initialGeneration || null, accepted: true,
      sourceWork: record.sourceWork, reviewed: true, networkVerified: false, canon1to1Verified: false });
    if (check) assert.deepEqual(await read(`public${sheet}`), bytes, `${record.id}: native reconstruction differs`);
    else {
      await mkdir(new URL('public/sprites/generated/summon-animations-wave7/', root), { recursive: true });
      await writeFile(new URL(`public${sheet}`, root), bytes);
      await sharp(bytes).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#151b29' }).png().toFile(fileURLToPath(new URL(`${docs}/summon-${record.slug}-contact.png`, root)));
    }
  }
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const provenance = { schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    actualNativeGenerationCalls: records.reduce((sum, record) => sum + 1 + (record.correctiveAttempts?.length || 0), 0), nativePoses: 48, preservedHistoricalEntityAtlases: 28, sources, entries, source1to1Verified: false };
  for (const [path, object] of [[registryPath, registry], [`${docs}/summon-provenance.json`, provenance]]) {
    if (check) assert.equal((await read(path)).toString(), encoded(object), `${path}: stale registry/provenance`);
    else await writeFile(new URL(path, root), encoded(object));
  }
  return { check, entities: 3, poses: 48, sharedBodyScale: true, reconstructedExactly: true };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildSummonAnimationsWave7(process.argv.includes('--check'))));
