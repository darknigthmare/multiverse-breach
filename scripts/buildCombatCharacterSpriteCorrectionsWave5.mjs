import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = 'docs/combat-fidelity-wave5-2026-10-20';
const REGISTRY = 'src/game/combat/characterSpriteCorrectionsWave5.generated.json';
const PROVENANCE = `${DOCS}/base-provenance.json`;
const STATES = ['idle', 'run', 'attack', 'hit'];
const EXPECTED = ['leon', 'solbadguy', 'ky'];
const ABILITIES = ['Tir du Silver Ghost', 'Taille de l’Outrage Mk.II', 'Taille de la Thunderseal'];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (relative, data) => fs.writeFile(file(relative), `${JSON.stringify(data, null, 2)}\n`);

async function reviewPixels(bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  assert.equal((await sharp(bytes).metadata()).hasAlpha, true);
  const stateReviews = [], all = [];
  for (const [row, state] of STATES.entries()) {
    const frameHashes = [];
    for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${state}/${col}: clipped pose`);
      }
      assert.ok(visible > 300, `${state}/${col}: empty pose`);
      frameHashes.push(hash(rgba));
    }
    assert.equal(new Set(frameHashes).size, 4, `${state}: repeated frame`);
    all.push(...frameHashes); stateReviews.push({ state, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(all).size, 16, 'a pose was reused between states');
  return { distinctCells: 16, stateReviews };
}

async function sourceRecord(record, correction = false) {
  const details = correction ? record.correction : record;
  const archivedPath = `${DOCS}/base-sources/${record.heroId}-${correction ? 'correction' : 'original'}.png`;
  const bytes = await read(archivedPath), metadata = await sharp(bytes).metadata();
  const referenceArchive = `${DOCS}/base-references/${record.heroId}.png`;
  return { heroId: record.heroId, universe: record.universe, sourceWork: record.sourceWork, ability: record.ability,
    archivedPath, sha256: hash(bytes), sourceDimensions: [metadata.width, metadata.height], originalGeneratedPath: details.file,
    prompt: details.prompt, promptFile: `${DOCS}/base-prompts/${record.heroId}${correction ? '-correction' : ''}.txt`,
    provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    operation: correction ? 'native-imagegen-row-correction' : 'native-imagegen', accepted: true,
    transparentBackgroundRequested: true, referenceAsset: record.referenceAsset,
    referenceAssetSha256: hash(await read(`public${record.referenceAsset}`)), referenceArchive,
    referenceArchiveSha256: hash(await read(referenceArchive)), sourceReference: record.sourceReference,
    imagegenReferenceInputs: await Promise.all((correction ? record.correction.referenceImages : [record.referenceImage]).map(async input => ({path: input, sha256: hash(await read(input))}))),
    visuallyReviewed: record.reviewed, networkVerified: false, canon1to1Verified: false,
    nativeRowCount: correction ? record.correction.targetRows.length : record.sourceRows,
    sourceRowsUsed: correction ? record.correction.sourceRows : record.sourceRowByTarget.filter((row, target) => row !== null && !record.correction?.targetRows.includes(target)),
    ...(correction ? { targetRows: record.correction.targetRows, reason: record.correction.reason }
      : record.correction ? record.sourceRows < 8
        ? { filledMissingTargetRows: record.correction.targetRows, usage: 'seven-native-rows-preserved' }
        : { supersededRows: record.correction.targetRows, usage: 'preserved-native-state-rows' } : {}) };
}

export async function buildCombatCharacterSpriteCorrectionsWave5() {
  const { records } = await json(`${DOCS}/base-generation-records.json`);
  assert.deepEqual(records.map(record => record.heroId), EXPECTED);
  const entries = [], sources = [];
  for (const [index, record] of records.entries()) {
    const hero = HEROES_DB.find(value => value.id === record.heroId);
    assert.equal(hero?.universe, record.universe);
    const ability = resolveCombatAbility(hero, 'simple'); assert.equal(ability.name, ABILITIES[index]);
    const original = await sourceRecord(record); sources.push(original);
    const originalAtlas = await segmentAtlas(file(original.archivedPath), record.sourceRows);
    const correction = record.correction ? await sourceRecord(record, true) : null;
    if (correction) sources.push(correction);
    const correctionAtlas = correction ? await segmentAtlas(file(correction.archivedPath), record.correction.targetRows.length) : null;
    const composites = [], rows = [];
    for (const [row, state] of STATES.entries()) {
      const correctionIndex = record.correction?.targetRows.indexOf(row) ?? -1;
      const source = correctionIndex >= 0 ? correction : original;
      const sourceRow = correctionIndex >= 0 ? record.correction.sourceRows[correctionIndex] : record.sourceRowByTarget[row];
      const selected = (correctionIndex >= 0 ? correctionAtlas : originalAtlas).rows[sourceRow];
      assert.equal(selected.seamReview.crossedOpaquePixels, 0, `${record.heroId}:${state}: seam cuts opaque artwork`);
      const normalized = await normalizeRow(selected);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      rows.push({ state, row, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceRow,
        sourceBounds: selected.sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selected.seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewPixels(bytes), sheet = `/sprites/generated/combat-character-corrections-wave5/${record.heroId}.png`;
    await fs.mkdir(path.dirname(file(`public${sheet}`)), { recursive: true });
    await fs.writeFile(file(`public${sheet}`), bytes);
    const contact = `${DOCS}/base-contacts/${record.heroId}.png`;
    await sharp(bytes).resize(512, 512, { kernel: sharp.kernel.nearest }).flatten({ background: '#141c2b' }).png().toFile(file(contact));
    const activeSource = correction || original;
    entries.push({ id: record.heroId, heroId: record.heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 1024, columns: 4, rows: 4, frameWidth: 256, frameHeight: 256, frames: 16,
      states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4,
        fps: state === 'run' ? 10 : 8, loop: ['idle', 'run'].includes(state) }])),
      sha256: hash(bytes), alpha: true, sourceImage: activeSource.archivedPath, sourceImageSha256: activeSource.sha256,
      sourceDimensions: activeSource.sourceDimensions, referenceAsset: record.referenceAsset,
      referenceAssetSha256: original.referenceAssetSha256, referenceImage: `${DOCS}/base-references/${record.heroId}-old-base.png`,
      nativeReferences: [{path: record.referenceImage, sha256: hash(await read(record.referenceImage))}],
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: ability.name,
      characterVersion: record.version, provider: 'OpenAI', model: null, generationId: null, jobId: null,
      originalSourceImage: correction ? original.archivedPath : null, originalSourceImageSha256: correction ? original.sha256 : null,
      nativeCorrection: !!correction, ...(correction ? { nativeCorrectionReason: record.correction.reason } : {}),
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerState: true, baseline: 244, rows },
      visualValidation: { identityReviewed: record.reviewed, allFramesReviewed: record.reviewed, technicalAlphaReviewed: true,
        fourStatesDistinct: true, ...review, canon1to1Verified: false, networkVerified: false, canonicalVerified: false,
        adaptedChoreography: true, fatalityIsExecution: false, sourceGameAsset: false,
        notes: `${record.version} Native generated illustration and authored compact choreography. Not official-source timing or1:1 verified frames.` } });
  }
  await write(REGISTRY, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', part: 'C', provider: 'OpenAI', tool: 'image_gen',
    model: null, generationId: null, jobId: null, networkVerified: false, canon1to1Verified: false,
    method: 'Three actual native image_gen4x4 atlases for basic idle/run/attack/hit states. Leon uses the RE4 agent costume and Silver Ghost, Sol and Ky use their approved Strive clothes and physical OutrageMkII/Thunderseal. All original project PNGs remain intact. Sharp only segments alpha seams, uniformly scales each state, pads transparency and packs genuine source poses. No procedural anatomy, mirrored replacements or repeated cells are synthesized.',
    sourceAccess: 'Local sprites and effective project kits inspected before generation. Known-work adaptations only; no new network verification or external quotation is claimed.',
    generationRecords: records, sources, entries });
  return checkCombatCharacterSpriteCorrectionsWave5();
}

export async function checkCombatCharacterSpriteCorrectionsWave5() {
  const registry = await json(REGISTRY), provenance = await json(PROVENANCE), unique = new Set(), nativeAtlases = new Map();
  assert.deepEqual(registry.entries.map(entry => entry.heroId), EXPECTED); assert.equal(provenance.sources.length, 3);
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
    const review = await reviewPixels(bytes); assert.deepEqual(review.stateReviews, entry.visualValidation.stateReviews);
    for (const state of review.stateReviews) for (const digest of state.frameHashes) { assert.equal(unique.has(digest), false); unique.add(digest); }
    for (const [row, state] of STATES.entries()) {
      assert.equal(entry.states[state].row, row); assert.equal(entry.states[state].frames, 4);
      const source = entry.normalization.rows[row]; assert.equal(hash(await read(source.sourceImage)), source.sourceImageSha256);
      assert.equal(source.crossedOpaquePixels, 0);
      if (!nativeAtlases.has(source.sourceImage)) {
        const lineage = provenance.sources.find(value => value.archivedPath === source.sourceImage);
        assert.ok(lineage, `${entry.heroId}:${state}: source is not archived`);
        nativeAtlases.set(source.sourceImage, await segmentAtlas(file(source.sourceImage), lineage.nativeRowCount));
      }
      const reconstructed = await normalizeRow(nativeAtlases.get(source.sourceImage).rows[source.sourceRow]);
      reconstruction.push({ input: reconstructed.bytes, left: 0, top: row * 256 });
    }
    const reconstructedAtlas = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(reconstruction).png({ compressionLevel: 9 }).toBuffer();
    assert.equal(hash(reconstructedAtlas), entry.sha256, `${entry.heroId}: final pixels do not match their stated native source rows`);
    assert.equal(hash(await read(entry.sourceImage)), entry.sourceImageSha256);
    assert.equal(hash(await read(`public${entry.referenceAsset}`)), entry.referenceAssetSha256);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
  }
  assert.equal(unique.size, 48);
  return { heroes: 3, states: 12, poses: 48, nativeSources: 3, newlyDrawnMissingStateRows: 0, correctedStateRows: 0,
    distinctRgbaPoses: unique.size, alphaAndMargins: true, sourceAndReferenceHashes: true,
    nativeRowReconstructionMatches: true,
    visualReviewComplete: registry.entries.every(entry => entry.visualValidation.identityReviewed && entry.visualValidation.allFramesReviewed),
    canon1to1Verified: false, networkVerified: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterSpriteCorrectionsWave5() : buildCombatCharacterSpriteCorrectionsWave5())));
}
