import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = 'docs/combat-fidelity-wave9-2026-10-22';
const EXPECTED = ['motoko', 'batou', 'togusa', 'aramaki', 'saito_gits'];
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const SUPER_NAMES = ['Salve au pistolet-mitrailleur de Motoko', 'Rafale d’appui de Batou', 'Tir de précision au Mateba', "Autorisation d'opération de la Section 9", 'Œil de faucon — tir de précision'];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (relative, data) => fs.writeFile(file(relative), `${JSON.stringify(data, null, 2)}\n`);

async function reviewPixels(bytes, labels) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, labels.length * 256);
  assert.equal((await sharp(bytes).metadata()).hasAlpha, true);
  const reviews = [], all = [];
  for (const [row, label] of labels.entries()) {
    const frameHashes = [];
    for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha > 0) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${label}/${col}: clipped pose`);
      }
      assert.ok(visible > 300, `${label}/${col}: empty pose`); frameHashes.push(hash(rgba));
    }
    assert.equal(new Set(frameHashes).size, 4, `${label}: repeated frame`);
    all.push(...frameHashes); reviews.push({ [labels.length === 8 ? 'phase' : 'state']: label, row, distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(all).size, labels.length * 4, 'reused pose between rows');
  return { distinctCells: all.length, [labels.length === 8 ? 'phaseReviews' : 'stateReviews']: reviews };
}

async function sourcesFor(record, prefix) {
  return Promise.all(record.sources.map(async source => {
    const bytes = await read(source.archivedPath), metadata = await sharp(bytes).metadata();
    return { ...source, heroId: record.heroId, universe: record.universe, sourceWork: record.sourceWork,
      ability: record.ability, sha256: hash(bytes), sourceDimensions: [metadata.width, metadata.height],
      prompt: (await read(source.promptFile)).toString(), provider: 'OpenAI', tool: 'image_gen',
      model: null, generationId: null, jobId: null, transparentBackgroundRequested: true,
      generationArguments: source.generationArguments,
      referenceAsset: record.referenceAsset, referenceAssetSha256: hash(await read(`public${record.referenceAsset}`)),
      referenceArchive: `${DOCS}/${prefix}references/${record.heroId}.png`,
      referenceArchiveSha256: hash(await read(`${DOCS}/${prefix}references/${record.heroId}.png`)),
      imagegenReferenceInputs: await Promise.all(source.referenceImages.map(async input => ({ path: input, sha256: hash(await read(input)) }))),
      sourceReference: record.sourceReference, visuallyReviewed: record.reviewed,
      networkVerified: false, canon1to1Verified: false };
  }));
}

export async function buildNativeWave9PartC({ base = false, check = false } = {}) {
  const labels = base ? ['idle', 'run', 'attack', 'hit'] : PHASES, prefix = base ? 'base-part-c-' : 'part-c-';
  const registryPath = `src/game/combat/${base ? 'characterSpriteCorrections' : 'characterAnimations'}Wave9PartC.generated.json`;
  const provenancePath = `${DOCS}/${prefix}provenance.json`, recordsPath = `${DOCS}/${prefix}generation-records.json`;
  const { records } = await json(recordsPath);
  assert.deepEqual(records.map(record => record.heroId), EXPECTED);
  if (check) {
    const registry = await json(registryPath), provenance = await json(provenancePath), unique = new Set(), atlases = new Map();
    assert.deepEqual(registry.entries.map(entry => entry.heroId), EXPECTED);
    assert.equal(provenance.sources.length, records.reduce((total, record) => total + record.sources.length, 0));
    for (const source of provenance.sources) {
      assert.equal(hash(await read(source.archivedPath)), source.sha256);
      assert.equal((await read(source.promptFile)).toString(), source.prompt);
      assert.equal(source.generationArguments.prompt, source.prompt); assert.equal(source.generationArguments.transparent_background, true);
      assert.equal(hash(await read(source.referenceArchive)), source.referenceArchiveSha256);
      for (const input of source.imagegenReferenceInputs) assert.equal(hash(await read(input.path)), input.sha256);
      assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    }
    for (const [index, entry] of registry.entries.entries()) {
      assert.equal(entry.universe, HEROES_DB.find(hero => hero.id === entry.heroId).universe);
      assert.equal(entry.abilityName, resolveCombatAbility(HEROES_DB.find(hero => hero.id === entry.heroId), base ? 'simple' : 'special').name);
      if (!base) assert.equal(entry.abilityName, SUPER_NAMES[index]);
      const bytes = await read(`public${entry.sheet}`); assert.equal(hash(bytes), entry.sha256);
      const review = await reviewPixels(bytes, labels), key = base ? 'stateReviews' : 'phaseReviews';
      assert.deepEqual(review[key], entry.visualValidation[key]);
      for (const row of review[key]) for (const digest of row.frameHashes) { assert.equal(unique.has(digest), false); unique.add(digest); }
      const composites = [];
      for (const [row, label] of labels.entries()) {
        const source = entry.normalization.rows[row], declared = records[index].rows[row];
        const lineage = provenance.sources.find(value => value.heroId === entry.heroId && value.key === declared.source);
        assert.ok(lineage?.accepted); assert.equal(source.sourceImage, lineage.archivedPath); assert.equal(source.sourceRow, declared.sourceRow);
        assert.equal(hash(await read(source.sourceImage)), source.sourceImageSha256); assert.equal(source.crossedOpaquePixels, 0);
        const measured = records[index].statureByRow?.[label];
        assert.deepEqual(source.renderScale, measured?.renderScale); assert.deepEqual(source.statureReview, measured?.statureReview);
        if (measured) {
          const roi = measured.statureReview;
          assert.equal(roi.measurementKind, 'visual-body-roi'); assert.equal(roi.excludesWeaponEffects, true);
          assert.equal(roi.bodyBounds[3], roi.normalizedBodyHeight); assert.equal(roi.referenceBodyBounds[3], roi.referenceBodyHeight);
          assert.ok(measured.renderScale >= 0.5 && measured.renderScale <= 3);
          assert.ok(roi.nativeComparableBodyHeight > 0 && roi.nativeReferenceBodyHeight > 0);
          assert.ok(Math.abs(measured.renderScale * roi.normalizedBodyHeight - roi.referenceBodyHeight * (roi.referenceRenderScale ?? 1) * roi.nativeComparableBodyHeight / roi.nativeReferenceBodyHeight) < 1);
        }
        if (!atlases.has(source.sourceImage)) atlases.set(source.sourceImage, await segmentAtlas(file(source.sourceImage), lineage.nativeRowCount));
        const normalized = await normalizeRow(atlases.get(source.sourceImage).rows[source.sourceRow]);
        composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      }
      const rebuilt = await sharp({ create: { width: 1024, height: labels.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
      assert.equal(hash(rebuilt), entry.sha256, `${entry.heroId}: source-row reconstruction differs`);
      assert.equal(hash(await read(`public${entry.referenceAsset}`)), entry.referenceAssetSha256);
      assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    }
    assert.equal(unique.size, EXPECTED.length * labels.length * 4);
    return { heroes: 5, rows: labels.length * 5, poses: unique.size, nativeSources: provenance.sources.length,
      distinctRgbaPoses: unique.size, sourceAndReferenceHashes: true, nativeRowReconstructionMatches: true,
      alphaAndMargins: true, visualReviewComplete: registry.entries.every(entry => entry.visualValidation.identityReviewed && entry.visualValidation.allFramesReviewed), canon1to1Verified: false, networkVerified: false };
  }
  const entries = [], sources = [];
  for (const [index, record] of records.entries()) {
    const hero = HEROES_DB.find(value => value.id === record.heroId); assert.equal(hero?.universe, record.universe);
    const ability = resolveCombatAbility(hero, base ? 'simple' : 'special'); if (!base) assert.equal(ability.name, SUPER_NAMES[index]);
    const nativeSources = await sourcesFor(record, prefix); sources.push(...nativeSources);
    const atlases = new Map(), composites = [], rows = [];
    for (const [row, label] of labels.entries()) {
      const declared = record.rows[row], source = nativeSources.find(source => source.key === declared.source); assert.ok(source?.accepted);
      if (!atlases.has(source.key)) atlases.set(source.key, await segmentAtlas(file(source.archivedPath), source.nativeRowCount));
      const selected = atlases.get(source.key).rows[declared.sourceRow];
      assert.equal(selected.seamReview.crossedOpaquePixels, 0, `${hero.id}/${label}: opaque native silhouette crosses cell seam`);
      const normalized = await normalizeRow(selected); composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      rows.push({ [base ? 'state' : 'phase']: label, row, sourceImage: source.archivedPath, sourceImageSha256: source.sha256,
        sourceRow: declared.sourceRow, sourceBounds: selected.sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selected.seamReview, ...(record.statureByRow?.[label] || {}) });
    }
    const bytes = await sharp({ create: { width: 1024, height: labels.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const review = await reviewPixels(bytes, labels), sheet = `/sprites/generated/${base ? 'combat-character-corrections' : 'combat-character-animations'}-wave9/${record.heroId}.png`;
    await fs.mkdir(path.dirname(file(`public${sheet}`)), { recursive: true }); await fs.writeFile(file(`public${sheet}`), bytes);
    await sharp(bytes).resize(512, labels.length * 128, { kernel: sharp.kernel.nearest }).flatten({ background: '#141c2b' }).png().toFile(file(`${DOCS}/${prefix}contacts/${record.heroId}.png`));
    const active = nativeSources.find(source => source.key === record.rows.at(-1).source), initial = nativeSources[0];
    entries.push({ id: hero.id, heroId: hero.id, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: labels.length * 256, columns: 4, rows: labels.length, frameWidth: 256, frameHeight: 256, frames: labels.length * 4,
      [base ? 'states' : 'phases']: Object.fromEntries(labels.map((label, row) => [label, { row, frames: 4, columns: 4, fps: base ? label === 'run' ? 10 : 8 : ['fatality', 'super'].includes(label) ? 12 : 8, loop: base && ['idle', 'run'].includes(label) }])),
      sha256: hash(bytes), alpha: true, sourceImage: active.archivedPath, sourceImageSha256: active.sha256, sourceDimensions: active.sourceDimensions,
      generationArguments: active.generationArguments,
      referenceAsset: record.referenceAsset, referenceAssetSha256: initial.referenceAssetSha256, referenceImage: initial.referenceArchive,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: ability.name, characterVersion: record.version,
      provider: 'OpenAI', model: null, generationId: null, jobId: null, nativeCorrection: nativeSources.length > 1,
      originalSourceImage: nativeSources.length > 1 ? initial.archivedPath : null, originalSourceImageSha256: nativeSources.length > 1 ? initial.sha256 : null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', [base ? 'sharedScalePerState' : 'sharedScalePerPhase']: true, baseline: 244, rows },
      visualValidation: { identityReviewed: record.reviewed, allFramesReviewed: record.reviewed, technicalAlphaReviewed: true, ...review,
        canon1to1Verified: false, networkVerified: false, canonicalVerified: false, adaptedChoreography: true, fatalityIsExecution: false, sourceGameAsset: false,
        notes: record.reviewNotes || `${record.version} Native generated artwork and adapted choreography, not official frames or1:1 verified animation.` } });
  }
  await write(registryPath, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(provenancePath, { schemaVersion: 1, date: '2026-10-22', part: 'C', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, jobId: null,
    networkVerified: false, canon1to1Verified: false, method: 'Real native image_gen artwork, including declared corrective attempts. Sharp only segments existing alpha silhouettes, uniformly scales source rows, pads and packs genuine distinct poses. No procedural anatomy, mirrors or synthesized duplicate cells. Source-row lineage and rejected attempts are retained. Renderer-only measured body/chassis-ROI scales retain native posture ratios; bent poses remain bent.',
    sourceAccess: 'Local old sprites and effective kits inspected before generation. Read official SAC2002 global character descriptions and Production I.G model-sheet pages1-4. Old missing weapons, Togusa hairstyle and chibi Aramaki are imperfect context, not canonical visual authority. Exact raw prompts and real image inputs retained; no fabricated provider IDs. No official game-frame provenance or global1:1 certification.',
    generationRecords: records, sources, entries,
    renderStatureCorrections: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview).map(row => ({ heroId: entry.heroId, row: row.row, renderScale: row.renderScale, statureReview: row.statureReview, unchangedPngSha256: entry.sha256 }))) });
  return buildNativeWave9PartC({ base, check: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) console.log(JSON.stringify(await buildNativeWave9PartC({ check: process.argv.includes('--check') })));
