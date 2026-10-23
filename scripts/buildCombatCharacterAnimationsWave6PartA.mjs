import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave6-2026-10-20');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimationsWave6PartA.generated.json');
const PROVENANCE = path.resolve(DOCS, 'part-a-provenance.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const EXPECTED = ['sonic_hedgehog', 'miles_tails_prower', 'knuckles_echidna', 'jotaro_kujo', 'giorno_giovanna'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};

// Manually reviewed body rectangles, excluding projecting weapons, smoke and
// energy effects. Native rectangles use x across the source atlas and y within
// the segmented row; applyStatureMetadata records their absolute atlas y too.
// Their heights describe each actual pose, so a lunge/kneel is not stretched
// to the height of a standing reference. These are approximate visual ROIs,
// not an automatic semantic body segmentation or a source-game certification.
const STATURE_MEASUREMENTS = {
  "sonic_hedgehog": {
    "referenceColumn": 0,
    "referenceBodyBounds": [
      47,
      12,
      181,
      232
    ],
    "nativeReferenceRowBodyBounds": [
      41,
      34,
      156,
      200
    ],
    "calibrationTargetBodyHeight": 190,
    "intro": {
      "column": 0,
      "bodyBounds": [
        47,
        12,
        181,
        232
      ],
      "nativeRowBodyBounds": [
        41,
        34,
        156,
        200
      ]
    },
    "outro": {
      "column": 3,
      "bodyBounds": [
        21,
        35,
        212,
        209
      ],
      "nativeRowBodyBounds": [
        683,
        26,
        184,
        181
      ]
    },
    "roundVictory": {
      "column": 3,
      "bodyBounds": [
        39,
        23,
        176,
        217
      ],
      "nativeRowBodyBounds": [
        696,
        22,
        159,
        196
      ]
    },
    "roundDefeat": {
      "column": 3,
      "bodyBounds": [
        44,
        57,
        173,
        184
      ],
      "nativeRowBodyBounds": [
        690,
        18,
        177,
        188
      ]
    },
    "fatality": {
      "column": 3,
      "bodyBounds": [
        34,
        75,
        185,
        168
      ],
      "nativeRowBodyBounds": [
        683,
        29,
        183,
        167
      ]
    },
    "victory": {
      "column": 3,
      "bodyBounds": [
        49,
        12,
        155,
        231
      ],
      "nativeRowBodyBounds": [
        705,
        13,
        140,
        209
      ]
    },
    "defeat": {
      "column": 3,
      "bodyBounds": [
        40,
        65,
        180,
        179
      ],
      "nativeRowBodyBounds": [
        693,
        17,
        170,
        169
      ]
    },
    "super": {
      "column": 3,
      "bodyBounds": [
        50,
        43,
        159,
        201
      ],
      "nativeRowBodyBounds": [
        698,
        19,
        158,
        200
      ]
    },
    "reason": "Calibrate the normal blue Adventure Sonic standing body to190px, matching the new45state melee sources. The reference source body is200px tall; preserve each pose’s natural source height, including bowed/crouched bodies and curled LightSpeedAttack balls. Do not inflate a rolled body to standing height or use the cyan speed-trail extent as body."
  },
  "miles_tails_prower": {
    "referenceColumn": 0,
    "referenceBodyBounds": [
      23,
      14,
      218,
      230
    ],
    "nativeReferenceRowBodyBounds": [
      21,
      12,
      187,
      197
    ],
    "fatality": {
      "column": 0,
      "bodyBounds": [
        66,
        106,
        128,
        136
      ],
      "nativeRowBodyBounds": [
        22,
        12,
        183,
        195
      ]
    },
    "super": {
      "column": 0,
      "bodyBounds": [
        69,
        107,
        128,
        137
      ],
      "nativeRowBodyBounds": [
        27,
        14,
        181,
        194
      ]
    },
    "reason": "The full piloted Cyclone is the actor body, measured from Tails ear/tuft top to mechanical foot soles, with tails and cockpit included. Compare the initial braced pose without laser charge. Exclude the third-column laser beam; retain mechanical knee compression and the seated pilot rather than comparing the fox alone with the whole machine."
  },
  "knuckles_echidna": {
    "referenceColumn": 3,
    "referenceBodyBounds": [
      34,
      26,
      181,
      218
    ],
    "nativeReferenceRowBodyBounds": [
      696,
      34,
      154,
      185
    ],
    "fatality": {
      "column": 3,
      "bodyBounds": [
        62,
        54,
        141,
        186
      ],
      "nativeRowBodyBounds": [
        706,
        35,
        149,
        197
      ]
    },
    "super": {
      "column": 3,
      "bodyBounds": [
        72,
        77,
        125,
        158
      ],
      "nativeRowBodyBounds": [
        711,
        26,
        146,
        185
      ]
    },
    "reason": "Use head-quill-to-shoe body bounds in the ready/recovery guards, excluding lightning shafts and the raised glove above the head in the charge pose. Retain the real low crouch at super column0 and the compact body when knees bend; no weapon or beam sets body stature."
  },
  "jotaro_kujo": {
    "referenceColumn": 0,
    "referenceBodyBounds": [
      67,
      12,
      174,
      230
    ],
    "nativeReferenceRowBodyBounds": [
      52,
      17,
      167,
      221
    ],
    "fatality": {
      "column": 3,
      "bodyBounds": [
        43,
        63,
        111,
        179
      ],
      "nativeRowBodyBounds": [
        673,
        56,
        135,
        217
      ]
    },
    "super": {
      "column": 3,
      "bodyBounds": [
        45,
        50,
        119,
        194
      ],
      "nativeRowBodyBounds": [
        679,
        44,
        139,
        227
      ]
    },
    "reason": "Measure Jotaro alone, cap/hair top to black shoe soles, excluding the taller StarPlatinum head, purple Stand limbs, scarf and fist trails. The Stand stays complete and scales together with Jotaro; its larger silhouette does not shrink the human. Native human stance differences217/221/227px remain intact."
  },
  "giorno_giovanna": {
    "referenceColumn": 0,
    "referenceBodyBounds": [
      75,
      15,
      130,
      229
    ],
    "nativeReferenceRowBodyBounds": [
      64,
      23,
      115,
      203
    ],
    "fatality": {
      "column": 3,
      "bodyBounds": [
        49,
        50,
        117,
        189
      ],
      "nativeRowBodyBounds": [
        691,
        37,
        126,
        204
      ]
    },
    "super": {
      "column": 3,
      "bodyBounds": [
        48,
        45,
        111,
        199
      ],
      "nativeRowBodyBounds": [
        693,
        32,
        116,
        208
      ]
    },
    "reason": "Measure Giorno alone from blond forehead curls to purple shoe soles, excluding GoldExperience helmet, golden limbs and fist echoes. Both full bodies remain visible and are drawn together; no Requiem or causal effect is inferred. Preserve the small native human pose-height differences203/204/208px."
  }
};
const round = value => Math.round(value * 1e6) / 1e6;

function applyStatureMetadata(entry) {
  const measurement = STATURE_MEASUREMENTS[entry.heroId];
  assert.ok(measurement, `Missing explicit stature review: ${entry.heroId}`);
  const reference = entry.normalization.rows[0];
  const referenceBodyHeight = measurement.referenceBodyBounds[3];
  const nativeReferenceBodyHeight = measurement.nativeReferenceRowBodyBounds[3];
  const referenceRenderScale = measurement.calibrationTargetBodyHeight ? measurement.calibrationTargetBodyHeight / referenceBodyHeight : 1;
  for (const row of entry.normalization.rows) {
    row.renderScale = 1;
    delete row.statureReview;
    const sample = measurement[row.phase];
    if (!sample) continue;
    const normalizedBodyHeight = sample.bodyBounds[3];
    const nativeComparableBodyHeight = sample.nativeRowBodyBounds[3];
    const expectedBodyHeight = referenceBodyHeight * referenceRenderScale * nativeComparableBodyHeight / nativeReferenceBodyHeight;
    row.renderScale = round(expectedBodyHeight / normalizedBodyHeight);
    assert.ok(row.renderScale >= 0.5 && row.renderScale <= 3);
    const absoluteBounds = (bounds, sourceRow) => [bounds[0], bounds[1] + sourceRow.sourceBounds.top, bounds[2], bounds[3]];
    row.statureReview = {
      referencePhase: 'intro', referenceColumn: measurement.referenceColumn, referenceBodyHeight,
      sourceComparableColumn: sample.column, normalizedBodyHeight, nativeComparableBodyHeight, nativeReferenceBodyHeight,
      referenceRenderScale, referenceRenderedBodyHeight: round(referenceBodyHeight * referenceRenderScale),
      ...(measurement.calibrationTargetBodyHeight ? { calibrationTargetBodyHeight: measurement.calibrationTargetBodyHeight } : {}),
      reason: measurement.reason, measurementKind: 'visual-body-roi',
      bodyBounds: [...sample.bodyBounds], referenceBodyBounds: [...measurement.referenceBodyBounds], excludesWeaponEffects: true,
      nativeBodyBounds: absoluteBounds(sample.nativeRowBodyBounds, row),
      nativeReferenceBodyBounds: absoluteBounds(measurement.nativeReferenceRowBodyBounds, reference),
      nativeSourceImage: row.sourceImage, nativeSourceImageSha256: row.sourceImageSha256,
      nativeReferenceSourceImage: reference.sourceImage, nativeReferenceSourceImageSha256: reference.sourceImageSha256,
      coordinateSpaces: { bodyBounds: 'local normalized256px cell', nativeBodyBounds: 'absolute archived native atlas pixels' },
      ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight) * (referenceRenderScale ?? 1)',
      expectedBodyHeight: round(expectedBodyHeight), correctedBodyHeight: round(normalizedBodyHeight * row.renderScale),
      posturePreserved: true, visualRoiApproximation: true, scaleAroundBaseline: 244,
      changesBitmap: false, source1to1Verified: false
    };
  }
  entry.normalization.renderScaleMethod = 'explicit-visual-body-roi-with-native-posture-ratio-v1';
  entry.normalization.renderScaleDoesNotModifyBitmap = true;
  entry.visualValidation.statureScaleReviewed = true;
  entry.visualValidation.statureNotes = 'Canvas-only whole-cell scaling around baseline244 reverses the weapon/effect-driven packing reduction. Approximate reviewed body ROIs and retained native stance-height ratios determine the factors; no PNG, source rectangle, anatomy or animation pose is modified.';
  return entry;
}

function statureProvenance(entries) {
  return { method: 'explicit-visual-body-roi-with-native-posture-ratio-v1', date: '2026-10-20',
    source1to1Verified: false, modifiesBitmap: false, rendererAnchorBaseline: 244,
    ratioFormula: '(referenceBodyHeight / normalizedBodyHeight) * (nativeComparableBodyHeight / nativeReferenceBodyHeight) * (referenceRenderScale ?? 1)',
    measuredRows: entries.flatMap(entry => entry.normalization.rows.filter(row => row.statureReview)
      .map(row => ({ heroId: entry.heroId, phase: row.phase, renderScale: row.renderScale, ...row.statureReview }))) };
}

export async function updateCombatCharacterAnimationsWave6PartAStature() {
  const manifest = await read(MANIFEST), provenance = await read(PROVENANCE);
  // Metadata-only mode deliberately never opens a PNG for writing.
  manifest.entries.forEach(applyStatureMetadata);
  provenance.entries = manifest.entries;
  provenance.statureReview = statureProvenance(manifest.entries);
  await write(MANIFEST, manifest); await write(PROVENANCE, provenance);
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), provenance.statureReview);
  return checkCombatCharacterAnimationsWave6PartA();
}

async function reviewFrames(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 2048);
  const allHashes = [], phaseReviews = [];
  for (let row = 0; row < 8; row++) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const rgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha) data.copy(rgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}: cut edge at ${PHASES[row]}/${column}`);
      }
      assert.ok(visible > 300, `${file}: empty cell ${PHASES[row]}/${column}`);
      const digest = hash(rgba); frameHashes.push(digest); allHashes.push(digest);
    }
    assert.equal(new Set(frameHashes).size, 4, `${file}: repeated ${PHASES[row]} pose`);
    phaseReviews.push({ phase: PHASES[row], distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(allHashes).size, 32);
  return { distinctCells: 32, phaseReviews };
}

async function archive(file, output) {
  const input = await exists(file) ? file : output;
  const bytes = await fs.readFile(input);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, bytes);
  return { input: output, archivedPath: relative(output), bytes, sha256: hash(bytes) };
}

export async function checkCombatCharacterAnimationsWave6PartA() {
  const manifest = await read(MANIFEST);
  const provenance = await read(PROVENANCE);
  assert.deepEqual(manifest.entries.map(entry => entry.heroId), EXPECTED);
  for (const entry of manifest.entries) {
    const hero = HEROES_DB.find(item => item.id === entry.heroId);
    assert.equal(hero?.universe, entry.universe);
    assert.equal(resolveCombatAbility(hero, 'special').name, entry.abilityName);
    const file = path.resolve(ROOT, `public${entry.sheet}`);
    assert.equal(hash(await fs.readFile(file)), entry.sha256);
    assert.equal((await sharp(file).metadata()).hasAlpha, true);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
    for (const reference of entry.additionalReferences || []) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.archivedPath))), reference.sha256);
    for (let row = 0; row < PHASES.length; row++) {
      assert.equal(entry.phases[PHASES[row]].row, row); assert.equal(entry.phases[PHASES[row]].frames, 4);
      const normalized = entry.normalization.rows[row];
      assert.equal(hash(await fs.readFile(path.resolve(ROOT, normalized.sourceImage))), normalized.sourceImageSha256);
      assert.ok(Number.isInteger(normalized.sourceRow)); assert.equal(normalized.crossedOpaquePixels, 0);
      const expected = applyStatureMetadata(structuredClone(entry)).normalization.rows[row];
      assert.equal(normalized.renderScale, expected.renderScale);
      assert.deepEqual(normalized.statureReview, expected.statureReview);
      if (normalized.statureReview) {
        const review = normalized.statureReview;
        assert.ok(Math.abs(review.correctedBodyHeight - review.expectedBodyHeight) < 0.001);
        assert.equal(review.normalizedBodyHeight, review.bodyBounds[3]);
        assert.equal(review.nativeComparableBodyHeight, review.nativeBodyBounds[3]);
        assert.equal(review.nativeReferenceBodyHeight, review.nativeReferenceBodyBounds[3]);
      }
    }
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.equal(entry.visualValidation.networkVerified, false);
    assert.equal(entry.visualValidation.eidolonPresent, false);
    await reviewFrames(file);
  }
  assert.ok(provenance.sources.length >= 5);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null); assert.equal(source.jobId, null);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.promptFile))), source.promptSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.referenceImage))), source.referencedSourceSha256);
    for (const reference of source.additionalReferences || []) assert.equal(hash(await fs.readFile(path.resolve(ROOT, reference.archivedPath))), reference.sha256);
    assert.ok(source.prompt.length > 100);
  }
  assert.deepEqual(provenance.statureReview, statureProvenance(manifest.entries));
  return { heroes: 5, phases: 40, frames: 160, alphaAndMargins: true, sourceAndReferenceHashes: true,
    fourDistinctFramesPerPhase: true, namedSupers: true, nativeSources: provenance.sources.length, canvasStatureRows: manifest.entries.flatMap(entry => entry.normalization.rows).filter(row => row.statureReview).length, pixelsUnmodifiedByStatureReview: true };
}

export async function buildCombatCharacterAnimationsWave6PartA() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave6-part-a-generation.json'), previous.generationRecords);
  assert.equal(records?.length, 5, 'Five actual native generation records are required');
  await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(record.universe, hero.universe);
    const ability = resolveCombatAbility(hero, 'special');
    assert.equal(ability.name, record.ability);
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-reference.png`));
    const additionalReferences = [];
    for (const [index, extraAsset] of (record.extraRefs || []).entries()) {
      const extra = await archive(path.resolve(ROOT, `public${extraAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-additional-reference-${index + 1}.png`));
      additionalReferences.push({ referenceAsset: extraAsset, archivedPath: extra.archivedPath, sha256: extra.sha256 });
    }
    const base = await archive(record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-original.png`));
    const addSource = async (archived, generation, usage, accepted, targetRowsUsed, reason) => {
      const sourceIndex = sources.filter(source => source.heroId === heroId).length;
      const promptFile = path.resolve(DOCS, 'part-a-sources', `${heroId}-prompt-${sourceIndex + 1}.txt`);
      await fs.writeFile(promptFile, generation.prompt);
      const refFile = generation.referencedImage || path.resolve(ROOT, `public${referenceAsset}`);
      const actualReference = await archive(refFile, path.resolve(DOCS, 'part-a-sources', `${heroId}-generation-reference-${sourceIndex + 1}.png`));
      sources.push({ heroId, archivedPath: archived.archivedPath, sha256: archived.sha256, originalGeneratedPath: generation.file,
        prompt: generation.prompt, promptFile: relative(promptFile), promptSha256: hash(Buffer.from(generation.prompt)),
        referenceImage: actualReference.archivedPath, referencedSourceSha256: actualReference.sha256, referenceAsset, referenceAssetSha256: reference.sha256,
        additionalReferences: sourceIndex === 0 ? additionalReferences : [],
        provider: 'OpenAI', model: null, generationId: null, jobId: null, operation: sourceIndex ? 'native-imagegen-correction' : 'native-imagegen',
        accepted, usage, targetRowsUsed, reason: reason || null, sourceWork: record.sourceWork, sourceReference: record.sourceReference,
        canon1to1Verified: false, networkVerified: false });
    };
    await addSource(base, record, record.correction ? 'superseded-native-source' : 'preserved-native-phase-rows', !record.correction,
      record.correction ? [] : PHASES.map((_, row) => row).filter(row => !(record.missingRow && row === record.missingRow.targetRow)),
      record.correction?.reason || record.missingRow?.reason);
    for (const [index, prior] of (record.correction?.previousCorrections || []).entries()) {
      const archived = await archive(prior.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-rejected-correction-${index + 1}.png`));
      await addSource(archived, prior, 'rejected-native-correction', false, [], prior.reason);
    }
    const correction = record.correction ? await archive(record.correction.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-corrected.png`)) : null;
    if (correction) await addSource(correction, record.correction, 'complete-native-redraw', true, PHASES.map((_, row) => row), record.correction.reason);
    const missing = record.missingRow ? await archive(record.missingRow.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-missing-${PHASES[record.missingRow.targetRow]}-row.png`)) : null;
    if (missing) await addSource(missing, record.missingRow, 'missing-native-phase-row', true, [record.missingRow.targetRow], record.missingRow.reason);
    const source = correction || base;
    const atlas = await segmentAtlas(source.input, record.correction ? 8 : (record.sourceRows || 8));
    const missingAtlas = missing ? await segmentAtlas(missing.input, 1) : null;
    const composites = [], normalizedRows = [];
    for (let row = 0; row < PHASES.length; row++) {
      const selectedAtlas = missing && row === record.missingRow.targetRow ? missingAtlas : atlas;
      const selectedSource = missing && row === record.missingRow.targetRow ? missing : source;
      const selectedRow = missing && row === record.missingRow.targetRow ? 0 : (missing && row > record.missingRow.targetRow ? row - 1 : row);
      assert.equal(selectedAtlas.rows[selectedRow].seamReview.crossedOpaquePixels, 0, `${heroId}/${PHASES[row]}: seam crosses opaque artwork`);
      const normalized = await normalizeRow(selectedAtlas.rows[selectedRow]);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ phase: PHASES[row], sourceImage: selectedSource.archivedPath, sourceImageSha256: selectedSource.sha256,
        sourceRow: selectedRow, sourceBounds: selectedAtlas.rows[selectedRow].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selectedAtlas.rows[selectedRow].seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-animations-wave6/${heroId}.png`;
    const file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const review = await reviewFrames(file);
    await sharp(bytes).resize(512, 1024, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png()
      .toFile(path.resolve(DOCS, `part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'fatality' || phase === 'super' ? 12 : 8, loop: false }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
      referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256, additionalReferences,
      originalSourceImage: correction ? base.archivedPath : null, originalSourceImageSha256: correction ? base.sha256 : null, nativeCorrection: !!(record.correction || record.missingRow),
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: record.ability, identityCorrection: record.identityCorrection,
      sourceAbility: { id: ability.id, name: ability.name, effect: ability.effect, delivery: ability.delivery, duration: ability.duration, hitAt: ability.hitAt },
      provider: 'OpenAI', model: null, generationId: null, jobId: null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, eidolonPresent: false, defaultFacing: 'right',
        weaponReviewed: true, versionReviewed: true, allBodiesPresent: true,
        notes: `${record.sourceReference} ${record.identityCorrection} This is original generated choreography; official pixels and source-game cinematic fidelity are not certified.` } });
  }
  entries.forEach(applyStatureMetadata);
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-20', part: 'A', provider: 'OpenAI', model: null, generationId: null,
    method: 'Five actual native image_gen character atlases, with any necessary native corrections archived separately. Sharp only segments via alpha valleys/adaptive transparent seams, scales uniformly within each phase and packs genuine poses; no poses or substitute art are synthesized in code.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries, statureReview: statureProvenance(entries) });
  await write(path.resolve(DOCS, 'part-a-stature-review.json'), statureProvenance(entries));
  return checkCombatCharacterAnimationsWave6PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const operation = process.argv.includes('--check') ? checkCombatCharacterAnimationsWave6PartA
    : process.argv.includes('--metadata-only') ? updateCombatCharacterAnimationsWave6PartAStature : buildCombatCharacterAnimationsWave6PartA;
  console.log(JSON.stringify(await operation()));
}
