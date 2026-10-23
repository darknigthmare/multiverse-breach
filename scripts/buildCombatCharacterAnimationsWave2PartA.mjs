import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { segmentAtlas, normalizeRow } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave2-2026-10-18');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimationsWave2PartA.generated.json');
const BASE_MANIFEST = path.resolve(ROOT, 'src/game/combat/characterSpriteCorrectionsWave2.generated.json');
const PROVENANCE = path.resolve(DOCS, 'part-a-provenance.json');
const BASE_PROVENANCE = path.resolve(DOCS, 'seifer-base-provenance.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const EXPECTED = ['squall_ff8', 'rinoa_ff8', 'quistis_ff8', 'seifer_ff8'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};

async function reviewFrames(file, phases) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, phases.length * 256);
  const frameHashes = [], phaseReviews = [];
  for (let row = 0; row < phases.length; row++) {
    const hashes = [];
    for (let column = 0; column < 4; column++) {
      const visibleRgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(visibleRgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${file}: cut edge at ${phases[row]}/${column}`);
      }
      assert.ok(visible > 300, `${file}: empty cell ${phases[row]}/${column}`);
      const digest = hash(visibleRgba); frameHashes.push(digest); hashes.push(digest);
    }
    assert.equal(new Set(hashes).size, 4, `${file}: repeated ${phases[row]} pose`);
    phaseReviews.push({ phase: phases[row], distinctFrames: 4, frameHashes: hashes });
  }
  assert.equal(new Set(frameHashes).size, phases.length * 4, `${file}: repeated pose across phases`);
  return { distinctCells: new Set(frameHashes).size, phaseReviews };
}

async function archive(file, archived) {
  const input = await exists(file) ? file : archived;
  const bytes = await fs.readFile(input);
  await fs.mkdir(path.dirname(archived), { recursive: true });
  await fs.writeFile(archived, bytes);
  return { input: archived, bytes, archivedPath: relative(archived), sha256: hash(bytes) };
}

async function pack(source, phases, sheet, contact) {
  const atlas = await segmentAtlas(source.input, phases.length);
  const composites = [], normalizedRows = [];
  for (let row = 0; row < phases.length; row++) {
    assert.equal(atlas.rows[row].seamReview.crossedOpaquePixels, 0, `${phases[row]}: opaque seam crosses artwork`);
    const normalized = await normalizeRow(atlas.rows[row]);
    composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
    normalizedRows.push({ phase: phases[row], sourceImage: source.archivedPath, sourceImageSha256: source.sha256,
      sourceRow: row, sourceBounds: atlas.rows[row].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
      frameBounds: normalized.frameBounds, ...atlas.rows[row].seamReview });
  }
  const bytes = await sharp({ create: { width: 1024, height: phases.length * 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const file = path.resolve(ROOT, `public${sheet}`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, bytes);
  const review = await reviewFrames(file, phases);
  await sharp(bytes).resize(512, phases.length * 128, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png().toFile(contact);
  return { sha256: hash(bytes), sourceDimensions: [atlas.width, atlas.height], review,
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows } };
}

const note = record => `${record.sourceReference} ${record.identityCorrection} Original generated choreography, not certified official-source frames.`;

async function checkEntries(manifest, phases) {
  for (const entry of manifest.entries) {
    const hero = HEROES_DB.find(item => item.id === entry.heroId);
    assert.equal(hero?.universe, entry.universe, `${entry.heroId}: universe mismatch`);
    const file = path.resolve(ROOT, `public${entry.sheet}`);
    assert.equal(hash(await fs.readFile(file)), entry.sha256);
    assert.equal((await sharp(file).metadata()).hasAlpha, true);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
    for (let row = 0; row < phases.length; row++) {
      const phase = (entry.phases || entry.states)[phases[row]];
      assert.equal(phase.row, row); assert.equal(phase.frames, 4);
      assert.equal(entry.normalization.rows[row].sourceImageSha256, entry.sourceImageSha256);
      assert.equal(entry.normalization.rows[row].crossedOpaquePixels, 0);
    }
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.equal(entry.visualValidation.networkVerified, false);
    await reviewFrames(file, phases);
  }
}

export async function checkCombatCharacterAnimationsWave2PartA() {
  const manifest = await read(MANIFEST);
  const base = await read(BASE_MANIFEST);
  const provenance = await read(PROVENANCE);
  const baseProvenance = await read(BASE_PROVENANCE);
  assert.deepEqual(manifest.entries.map(entry => entry.heroId), EXPECTED);
  assert.equal(base.entries.length, 1); assert.equal(base.entries[0].heroId, 'seifer_ff8');
  await checkEntries(manifest, PHASES); await checkEntries(base, STATES);
  assert.equal(provenance.sources.length, 4); assert.equal(baseProvenance.sources.length, 1);
  for (const source of [...provenance.sources, ...baseProvenance.sources]) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null);
    assert.ok(source.prompt.length > 100);
  }
  const identitySource = base.entries[0].nativeIdentityReference;
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, identitySource.archivedPath))), identitySource.sha256);
  return { heroes: 4, phases: 32, frames: 128, correctedBaseHeroes: 1, correctedBaseFrames: 16,
    alphaAndMargins: true, fourDistinctFramesPerPhase: true, sourceAndReferenceHashes: true, nativeSources: 5 };
}

export async function buildCombatCharacterAnimationsWave2PartA() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave2-part-a-generation.json'), previous.generationRecords);
  const previousBase = await read(BASE_PROVENANCE, {});
  const baseRecord = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave2-seifer-base-generation.json'), previousBase.generationRecords?.[0]);
  assert.equal(records?.length, 4); assert.equal(baseRecord?.heroId, 'seifer_ff8');
  await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    assert.ok(record?.file, `${heroId}: no actual native source`);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(hero.universe, 'Final Fantasy VIII');
    const source = await archive(record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}.png`));
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-reference.png`));
    const sheet = `/sprites/generated/combat-character-animations-wave2/${heroId}.png`;
    const packed = await pack(source, PHASES, sheet, path.resolve(DOCS, `part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'fatality' || phase === 'super' ? 12 : 8, loop: false }])),
      sha256: packed.sha256, alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: packed.sourceDimensions,
      referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: record.ability,
      identityCorrection: record.identityCorrection, originalSourceImage: null, originalSourceImageSha256: null, nativeCorrection: false,
      provider: 'OpenAI', model: null, generationId: null, normalization: packed.normalization,
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...packed.review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, notes: note(record) } });
    sources.push({ heroId, archivedPath: source.archivedPath, sha256: source.sha256, originalGeneratedPath: record.file,
      prompt: record.prompt, referenceImage: reference.archivedPath, referenceAsset, referenceAssetSha256: reference.sha256,
      provider: 'OpenAI', model: null, generationId: null, operation: 'native-imagegen', accepted: true,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, identityCorrection: record.identityCorrection,
      networkVerified: false, sourceUrl: record.sourceUrl || null, sourceAccess: record.sourceAccess || { networkVerified: false, status: 'not-read' } });
  }
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', part: 'A', provider: 'OpenAI', model: null, generationId: null,
    method: 'Four actual native image_gen atlases. Sharp only extracts via alpha valleys/adaptive transparent seams, scales each phase uniformly and packs the genuine distinct frames. No new poses are synthesized in code.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries });

  const source = await archive(baseRecord.file, path.resolve(DOCS, 'seifer-base-sources', 'seifer_ff8.png'));
  const wrongReference = await archive(baseRecord.source, path.resolve(DOCS, 'seifer-base-sources', 'seifer_ff8-previous-reference.png'));
  const correctIdentitySource = await archive(baseRecord.reference, path.resolve(DOCS, 'seifer-base-sources', 'seifer_ff8-corrected-identity-reference.png'));
  const sheet = '/sprites/generated/combat-character-corrections-wave2/seifer_ff8.png';
  const packed = await pack(source, STATES, sheet, path.resolve(DOCS, 'seifer-base-contact.png'));
  const referenceAsset = '/sprites/generated/heroes/final-fantasy-viii/seifer-ff8.png';
  const baseEntry = { id: 'seifer_ff8', heroId: 'seifer_ff8', name: HEROES_DB.find(hero => hero.id === 'seifer_ff8').name, universe: 'Final Fantasy VIII', sheet,
    width: 1024, height: 1024, columns: 4, rows: 4, frames: 16, frameWidth: 256, frameHeight: 256,
    states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'run' ? 10 : 8, loop: state === 'idle' || state === 'run' }])),
    sha256: packed.sha256, alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: packed.sourceDimensions,
    referenceAsset, referenceImage: wrongReference.archivedPath, referenceAssetSha256: wrongReference.sha256,
    nativeIdentityReference: { archivedPath: correctIdentitySource.archivedPath, sha256: correctIdentitySource.sha256,
      note: 'Actual image_gen reference: the previously generated corrected white-coat Seifer atlas. The preceding black-coat bitmap is archived as a counterexample, not copied as a costume.' },
    sourceWork: baseRecord.sourceWork, sourceReference: baseRecord.sourceReference, provider: 'OpenAI', model: null, generationId: null,
    networkVerified: false, canon1to1Verified: false, canonicalVerified: false, operation: 'native-imagegen-identity-correction',
    normalization: { ...packed.normalization, sharedScalePerState: true },
    visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...packed.review,
      canon1to1Verified: false, networkVerified: false, whiteCoat: true, redCrossMotifs: true, hyperionWeapon: true,
      notes: 'Corrected original FFVIII Seifer identity: long pale coat/red crosses, blonde hair, dark clothing and Hyperion. Ordinary run, one-handed blade attack and recoil frames replace the black fur-jacket/unarmed mismatch. Official pixel or complete costume fidelity is not certified.' } };
  await write(BASE_MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries: [baseEntry] });
  await write(BASE_PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null,
    method: 'One distinct native 4×4 identity correction, based on the corrected native FFVIII Seifer atlas. Sharp only extracts/scales/packs real poses. Previous mistaken base bitmap and actual generated reference are both archived unchanged.',
    networkVerified: false, canon1to1Verified: false, generationRecords: [baseRecord],
    sources: [{ heroId: 'seifer_ff8', archivedPath: source.archivedPath, sha256: source.sha256, originalGeneratedPath: baseRecord.file,
      prompt: baseRecord.prompt, referencedImage: correctIdentitySource.archivedPath, referencedSourceSha256: correctIdentitySource.sha256,
      previousReferenceImage: wrongReference.archivedPath, previousReferenceSha256: wrongReference.sha256,
      provider: 'OpenAI', model: null, generationId: null, operation: 'native-imagegen', accepted: true }], entries: [baseEntry] });
  return checkCombatCharacterAnimationsWave2PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterAnimationsWave2PartA() : buildCombatCharacterAnimationsWave2PartA())));
}
