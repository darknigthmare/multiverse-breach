import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = 'docs/combat-fidelity-wave4-2026-10-18';
const REGISTRY = 'src/game/combat/characterAnimationsWave4PartC.generated.json';
const PROVENANCE = `${DOCS}/part-c-provenance.json`;
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const EXPECTED = ['piccolo_dbz', 'kakashi_war'];
const ABILITIES = ['Special Beam Cannon', 'Kamui'];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (relative, data) => fs.writeFile(file(relative), `${JSON.stringify(data, null, 2)}\n`);

async function reviewPixels(bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048);
  assert.equal((await sharp(bytes).metadata()).hasAlpha, true);
  const phaseReviews = [], all = [];
  for (const [row, phase] of PHASES.entries()) {
    const frameHashes = [];
    for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${phase}/${col}: clipped pose`);
      }
      assert.ok(visible > 300, `${phase}/${col}: empty pose`);
      frameHashes.push(hash(rgba));
    }
    assert.equal(new Set(frameHashes).size, 4, `${phase}: repeated frame`);
    all.push(...frameHashes); phaseReviews.push({ phase, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(all).size, 32, 'a pose was reused between phases');
  return { distinctCells: 32, phaseReviews };
}

async function sourceRecord(record, correction = false) {
  const details = correction ? record.correction : record;
  const archivedPath = `${DOCS}/part-c-sources/${record.heroId}-${correction ? 'correction' : 'original'}.png`;
  const bytes = await read(archivedPath), metadata = await sharp(bytes).metadata();
  const referenceArchive = `${DOCS}/part-c-references/${record.heroId}.png`;
  return { heroId: record.heroId, universe: record.universe, sourceWork: record.sourceWork, ability: record.ability,
    archivedPath, sha256: hash(bytes), sourceDimensions: [metadata.width, metadata.height], originalGeneratedPath: details.file,
    prompt: details.prompt, promptFile: `${DOCS}/part-c-prompts/${record.heroId}${correction ? '-correction' : ''}.txt`,
    provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    operation: correction ? 'native-imagegen-row-correction' : 'native-imagegen', accepted: true,
    transparentBackgroundRequested: true, referenceAsset: record.referenceAsset,
    referenceAssetSha256: hash(await read(`public${record.referenceAsset}`)), referenceArchive,
    referenceArchiveSha256: hash(await read(referenceArchive)), sourceReference: record.sourceReference,
    visuallyReviewed: record.reviewed, networkVerified: false, canon1to1Verified: false,
    nativeRowCount: correction ? record.correction.targetRows.length : record.sourceRows,
    sourceRowsUsed: correction ? record.correction.sourceRows : record.sourceRowByTarget.filter((row, target) => row !== null && !record.correction?.targetRows.includes(target)),
    ...(correction ? { targetRows: record.correction.targetRows, reason: record.correction.reason }
      : record.correction ? record.sourceRows < 8
        ? { filledMissingTargetRows: record.correction.targetRows, usage: 'seven-native-rows-preserved' }
        : { supersededRows: record.correction.targetRows, usage: 'preserved-native-phase-rows' } : {}) };
}

export async function buildCombatCharacterAnimationsWave4PartC() {
  const { records } = await json(`${DOCS}/part-c-generation-records.json`);
  assert.deepEqual(records.map(record => record.heroId), EXPECTED);
  const entries = [], sources = [];
  for (const [index, record] of records.entries()) {
    const hero = HEROES_DB.find(value => value.id === record.heroId);
    assert.equal(hero?.universe, record.universe);
    const ability = resolveCombatAbility(hero, 'special'); assert.equal(ability.name, ABILITIES[index]);
    const original = await sourceRecord(record); sources.push(original);
    const originalAtlas = await segmentAtlas(file(original.archivedPath), record.sourceRows);
    const correction = record.correction ? await sourceRecord(record, true) : null;
    if (correction) sources.push(correction);
    const correctionAtlas = correction ? await segmentAtlas(file(correction.archivedPath), record.correction.targetRows.length) : null;
    const composites = [], rows = [];
    for (const [row, phase] of PHASES.entries()) {
      const correctionIndex = record.correction?.targetRows.indexOf(row) ?? -1;
      const source = correctionIndex >= 0 ? correction : original;
      const sourceRow = correctionIndex >= 0 ? record.correction.sourceRows[correctionIndex] : record.sourceRowByTarget[row];
      const selected = (correctionIndex >= 0 ? correctionAtlas : originalAtlas).rows[sourceRow];
      assert.equal(selected.seamReview.crossedOpaquePixels, 0, `${record.heroId}:${phase}: seam cuts opaque artwork`);
      const normalized = await normalizeRow(selected);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      rows.push({ phase, row, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceRow,
        sourceBounds: selected.sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selected.seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewPixels(bytes), sheet = `/sprites/generated/combat-character-animations-wave4/${record.heroId}.png`;
    await fs.mkdir(path.dirname(file(`public${sheet}`)), { recursive: true });
    await fs.writeFile(file(`public${sheet}`), bytes);
    const contact = `${DOCS}/part-c-contacts/${record.heroId}.png`;
    await sharp(bytes).resize(512, 1024, { kernel: sharp.kernel.nearest }).flatten({ background: '#141c2b' }).png().toFile(file(contact));
    const activeSource = correction || original;
    entries.push({ id: record.heroId, heroId: record.heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, columns: 4, rows: 8, frameWidth: 256, frameHeight: 256, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4,
        fps: ['fatality', 'super'].includes(phase) ? 12 : 8, loop: false }])),
      sha256: hash(bytes), alpha: true, sourceImage: activeSource.archivedPath, sourceImageSha256: activeSource.sha256,
      sourceDimensions: activeSource.sourceDimensions, referenceAsset: record.referenceAsset,
      referenceAssetSha256: original.referenceAssetSha256, referenceImage: original.referenceArchive,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: ability.name,
      characterVersion: record.version, provider: 'OpenAI', model: null, generationId: null, jobId: null,
      originalSourceImage: correction ? original.archivedPath : null, originalSourceImageSha256: correction ? original.sha256 : null,
      nativeCorrection: !!correction, ...(correction ? { nativeCorrectionReason: record.correction.reason } : {}),
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows },
      visualValidation: { identityReviewed: record.reviewed, allFramesReviewed: record.reviewed, technicalAlphaReviewed: true,
        fourPhasesDistinct: true, ...review, canon1to1Verified: false, networkVerified: false, canonicalVerified: false,
        adaptedChoreography: true, fatalityIsExecution: false, sourceGameAsset: false,
        notes: `${record.version} Native generated illustration and authored compact choreography. Not official-source timing or1:1 verified frames.` } });
  }
  await write(REGISTRY, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', part: 'C', provider: 'OpenAI', tool: 'image_gen',
    model: null, generationId: null, jobId: null, networkVerified: false, canon1to1Verified: false,
    method: 'Two actual native image_gen atlases plus two separate native strips. The first Kakashi source contains seven actual rows; its missing finale is newly drawn, with explicit native row remapping to eight final phases. A second strip replaces only Piccolo finale/super with a compact paired-finger beam to preserve body scale. Sharp only extracts using adaptive alpha seams, rescales each phase uniformly with nearest-neighbor filtering, pads transparency and packs genuine source poses. No procedural anatomy, mirrored replacements or repeated cells are synthesized.',
    sourceAccess: 'Local sprites and effective project kits inspected before generation. Known-work adaptations only; no new network verification or external quotation is claimed.',
    generationRecords: records, sources, entries });
  return checkCombatCharacterAnimationsWave4PartC();
}

export async function checkCombatCharacterAnimationsWave4PartC() {
  const registry = await json(REGISTRY), provenance = await json(PROVENANCE), unique = new Set(), nativeAtlases = new Map();
  assert.deepEqual(registry.entries.map(entry => entry.heroId), EXPECTED); assert.equal(provenance.sources.length, 4);
  for (const source of provenance.sources) {
    assert.equal(hash(await read(source.archivedPath)), source.sha256);
    assert.equal((await read(source.promptFile)).toString(), source.prompt);
    assert.equal(hash(await read(source.referenceArchive)), source.referenceArchiveSha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
  }
  for (const [index, entry] of registry.entries.entries()) {
    const reconstruction = [];
    assert.equal(entry.universe, HEROES_DB.find(hero => hero.id === entry.heroId).universe);
    assert.equal(entry.abilityName, ABILITIES[index]);
    const bytes = await read(`public${entry.sheet}`); assert.equal(hash(bytes), entry.sha256);
    const review = await reviewPixels(bytes); assert.deepEqual(review.phaseReviews, entry.visualValidation.phaseReviews);
    for (const phase of review.phaseReviews) for (const digest of phase.frameHashes) { assert.equal(unique.has(digest), false); unique.add(digest); }
    for (const [row, phase] of PHASES.entries()) {
      assert.equal(entry.phases[phase].row, row); assert.equal(entry.phases[phase].frames, 4);
      const source = entry.normalization.rows[row]; assert.equal(hash(await read(source.sourceImage)), source.sourceImageSha256);
      assert.equal(source.crossedOpaquePixels, 0);
      if (!nativeAtlases.has(source.sourceImage)) {
        const lineage = provenance.sources.find(value => value.archivedPath === source.sourceImage);
        assert.ok(lineage, `${entry.heroId}:${phase}: source is not archived`);
        nativeAtlases.set(source.sourceImage, await segmentAtlas(file(source.sourceImage), lineage.nativeRowCount));
      }
      const reconstructed = await normalizeRow(nativeAtlases.get(source.sourceImage).rows[source.sourceRow]);
      reconstruction.push({ input: reconstructed.bytes, left: 0, top: row * 256 });
    }
    const reconstructedAtlas = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(reconstruction).png({ compressionLevel: 9 }).toBuffer();
    assert.equal(hash(reconstructedAtlas), entry.sha256, `${entry.heroId}: final pixels do not match their stated native source rows`);
    assert.equal(hash(await read(entry.sourceImage)), entry.sourceImageSha256);
    assert.equal(hash(await read(`public${entry.referenceAsset}`)), entry.referenceAssetSha256);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
  }
  assert.equal(unique.size, 64);
  return { heroes: 2, phases: 16, poses: 64, nativeSources: 4, newlyDrawnMissingPhaseRows: 1, correctedPhaseRows: 2,
    distinctRgbaPoses: unique.size, alphaAndMargins: true, sourceAndReferenceHashes: true,
    nativeRowReconstructionMatches: true,
    visualReviewComplete: registry.entries.every(entry => entry.visualValidation.identityReviewed && entry.visualValidation.allFramesReviewed),
    canon1to1Verified: false, networkVerified: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterAnimationsWave4PartC() : buildCombatCharacterAnimationsWave4PartC())));
}
