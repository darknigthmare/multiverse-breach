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
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-wave4-2026-10-18');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterAnimationsWave4PartA.generated.json');
const PROVENANCE = path.resolve(DOCS, 'part-a-provenance.json');
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const EXPECTED = ['redxiii_ff7', 'yuffie_ff7', 'vincent_ff7'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
};

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

export async function checkCombatCharacterAnimationsWave4PartA() {
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
    for (let row = 0; row < PHASES.length; row++) {
      assert.equal(entry.phases[PHASES[row]].row, row); assert.equal(entry.phases[PHASES[row]].frames, 4);
      const normalized = entry.normalization.rows[row];
      assert.equal(hash(await fs.readFile(path.resolve(ROOT, normalized.sourceImage))), normalized.sourceImageSha256);
      assert.ok(Number.isInteger(normalized.sourceRow)); assert.equal(normalized.crossedOpaquePixels, 0);
    }
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.equal(entry.visualValidation.networkVerified, false);
    assert.equal(entry.visualValidation.eidolonPresent, false);
    await reviewFrames(file);
  }
  assert.ok(provenance.sources.length >= 3);
  for (const source of provenance.sources) {
    assert.equal(hash(await fs.readFile(path.resolve(ROOT, source.archivedPath))), source.sha256);
    assert.equal(source.model, null); assert.equal(source.generationId, null);
    assert.ok(source.prompt.length > 100);
  }
  return { heroes: 3, phases: 24, frames: 96, alphaAndMargins: true, sourceAndReferenceHashes: true,
    fourDistinctFramesPerPhase: true, namedSupers: true, nativeSources: provenance.sources.length };
}

export async function buildCombatCharacterAnimationsWave4PartA() {
  const previous = await read(PROVENANCE, {});
  const records = await read(path.resolve(ROOT, '.tmp/combat-fidelity-wave4-part-a-generation.json'), previous.generationRecords);
  assert.equal(records?.length, 3, 'Three actual native generation records are required');
  await fs.mkdir(DOCS, { recursive: true });
  const entries = [], sources = [];
  for (const heroId of EXPECTED) {
    const record = records.find(item => item.heroId === heroId);
    const hero = HEROES_DB.find(item => item.id === heroId);
    assert.equal(hero.universe, 'Final Fantasy VII'); assert.equal(record.universe, hero.universe);
    const ability = resolveCombatAbility(hero, 'special');
    assert.equal(ability.name, record.ability);
    const source = await archive(record.correction?.file || record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}.png`));
    const referenceAsset = `/sprites/generated/heroes/${record.ref}`;
    const reference = await archive(path.resolve(ROOT, `public${referenceAsset}`), path.resolve(DOCS, 'part-a-sources', `${heroId}-reference.png`));
    let original = null;
    if (record.correction) {
      original = await archive(record.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-original.png`));
      sources.push({ heroId, archivedPath: original.archivedPath, sha256: original.sha256, originalGeneratedPath: record.file,
        prompt: record.prompt, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256,
        provider: 'OpenAI', model: null, generationId: null, operation: 'native-imagegen', accepted: !!record.correction.rows,
        usage: record.correction.rows ? 'preserved-native-phase-rows' : 'superseded-native-source', reason: record.correction.reason,
        targetRowsUsed: record.correction.rows ? PHASES.map((_, row) => row).filter(row => !record.correction.rows.includes(row)) : [] });
    }
    for (const [index, prior] of (record.correction?.previousCorrections || []).entries()) {
      const archived = await archive(prior.file, path.resolve(DOCS, 'part-a-sources', `${heroId}-rejected-correction-${index + 1}.png`));
      const priorReference = await archive(prior.referencedImage, path.resolve(DOCS, 'part-a-sources', `${heroId}-rejected-correction-${index + 1}-reference.png`));
      sources.push({ heroId, archivedPath: archived.archivedPath, sha256: archived.sha256, originalGeneratedPath: prior.file,
        prompt: prior.prompt, referenceImage: priorReference.archivedPath, referencedSourceSha256: priorReference.sha256, provider: 'OpenAI', model: null, generationId: null,
        operation: 'native-imagegen-correction', accepted: false, usage: 'rejected-native-correction', reason: prior.reason });
    }
    const correctionReference = record.correction ? await archive(record.correction.referencedImage,
      path.resolve(DOCS, 'part-a-sources', `${heroId}-correction-reference.png`)) : null;
    sources.push({ heroId, archivedPath: source.archivedPath, sha256: source.sha256, originalGeneratedPath: record.correction?.file || record.file,
      prompt: record.correction?.prompt || record.prompt, referenceImage: correctionReference?.archivedPath || reference.archivedPath,
      referencedSourceSha256: correctionReference?.sha256 || reference.sha256, referenceAsset, referenceAssetSha256: reference.sha256,
      provider: 'OpenAI', model: null, generationId: null, operation: record.correction ? 'native-imagegen-correction' : 'native-imagegen', accepted: true,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, identityCorrection: record.identityCorrection, networkVerified: false,
      targetRowsUsed: record.correction?.rows || PHASES.map((_, row) => row) });
    const atlas = await segmentAtlas(source.input, record.correction?.sourceRowCount || 8);
    const preserved = record.correction?.rows ? await segmentAtlas(original.input, 8) : null;
    const composites = [], normalizedRows = [];
    for (let row = 0; row < PHASES.length; row++) {
      const keepOriginal = preserved && !record.correction.rows.includes(row);
      const selectedAtlas = keepOriginal ? preserved : atlas;
      const selectedRow = !keepOriginal && record.correction?.sourceRowCount === 1 ? 0 : row;
      const selectedSource = keepOriginal ? original : source;
      assert.equal(selectedAtlas.rows[selectedRow].seamReview.crossedOpaquePixels, 0, `${heroId}/${PHASES[row]}: seam crosses opaque artwork`);
      const normalized = await normalizeRow(selectedAtlas.rows[selectedRow]);
      composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
      normalizedRows.push({ phase: PHASES[row], sourceImage: selectedSource.archivedPath, sourceImageSha256: selectedSource.sha256,
        sourceRow: selectedRow, sourceBounds: selectedAtlas.rows[selectedRow].sourceBounds, scale: normalized.scale, baseline: normalized.baseline,
        frameBounds: normalized.frameBounds, ...selectedAtlas.rows[selectedRow].seamReview });
    }
    const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).png({ compressionLevel: 9 }).toBuffer();
    const sheet = `/sprites/generated/combat-character-animations-wave4/${heroId}.png`;
    const file = path.resolve(ROOT, `public${sheet}`);
    await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes);
    const review = await reviewFrames(file);
    await sharp(bytes).resize(512, 1024, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png()
      .toFile(path.resolve(DOCS, `part-a-${heroId}-contact.png`));
    entries.push({ id: heroId, heroId, universe: hero.universe, name: hero.name, sheet,
      width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, columns: 4, rows: 8, frames: 32,
      phases: Object.fromEntries(PHASES.map((phase, row) => [phase, { row, frames: 4, columns: 4, fps: phase === 'fatality' || phase === 'super' ? 12 : 8, loop: false }])),
      sha256: hash(bytes), alpha: true, sourceImage: source.archivedPath, sourceImageSha256: source.sha256, sourceDimensions: [atlas.width, atlas.height],
      referenceAsset, referenceImage: reference.archivedPath, referenceAssetSha256: reference.sha256,
      originalSourceImage: original?.archivedPath || null, originalSourceImageSha256: original?.sha256 || null, nativeCorrection: !!record.correction,
      sourceWork: record.sourceWork, sourceReference: record.sourceReference, abilityName: record.ability, identityCorrection: record.identityCorrection,
      sourceAbility: { id: ability.id, name: ability.name, effect: ability.effect, delivery: ability.delivery, duration: ability.duration, hitAt: ability.hitAt },
      provider: 'OpenAI', model: null, generationId: null,
      normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerPhase: true, baseline: 244, rows: normalizedRows },
      visualValidation: { identityReviewed: true, allFramesReviewed: true, fourPhasesDistinct: true, ...review,
        canon1to1Verified: false, networkVerified: false, adaptedChoreography: true, fatalityIsExecution: false, eidolonPresent: false, defaultFacing: 'right',
        quadruped: heroId === 'redxiii_ff7', humanPreparationOnly: heroId === 'vincent_ff7',
        ...(heroId === 'vincent_ff7' ? { weaponHand: 'right', clawHand: 'left', separateFormAsset: 'vincent-chaos' } : {}),
        notes: `${record.sourceReference} ${record.identityCorrection} This is original generated choreography; official pixels and source-game cinematic fidelity are not certified.` } });
  }
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', part: 'A', provider: 'OpenAI', model: null, generationId: null,
    method: 'Three actual native image_gen atlases, with any necessary native corrections archived separately. Sharp only segments via alpha valleys/adaptive transparent seams, scales uniformly within each phase and packs genuine poses; no poses or substitute art are synthesized in code.',
    networkVerified: false, canon1to1Verified: false, generationRecords: records, sources, entries });
  return checkCombatCharacterAnimationsWave4PartA();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterAnimationsWave4PartA() : buildCombatCharacterAnimationsWave4PartA())));
}
