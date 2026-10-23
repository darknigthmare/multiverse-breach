import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { normalizeRow, segmentAtlas } from './buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.resolve(ROOT, 'docs/combat-fidelity-2026-10-18');
const SOURCES = path.resolve(DOCS, 'character-sprite-correction-sources');
const MANIFEST = path.resolve(ROOT, 'src/game/combat/characterSpriteCorrections.generated.json');
const PROVENANCE = path.resolve(DOCS, 'character-sprite-corrections-provenance.json');
const HERO_ID = 'crypt_necrodancer_aria';
const STATES = ['idle', 'run', 'attack', 'hit'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const write = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const exists = file => fs.access(file).then(() => true, () => false);

async function reviewFrames(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024);
  const hashes = [], states = [];
  for (let row = 0; row < 4; row++) {
    const frameHashes = [];
    for (let column = 0; column < 4; column++) {
      const visibleRgba = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = (((row * 256 + y) * 1024) + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha) data.copy(visibleRgba, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x > 245 || y < 10 || y > 245) assert.equal(alpha, 0, `${STATES[row]}/${column}: cropped cell edge`);
      }
      assert.ok(visible > 300, `${STATES[row]}/${column}: empty pose`);
      const digest = hash(visibleRgba); hashes.push(digest); frameHashes.push(digest);
    }
    assert.equal(new Set(frameHashes).size, 4, `${STATES[row]}: repeated pose`);
    states.push({ state: STATES[row], distinctFrames: 4, frameHashes });
  }
  assert.equal(new Set(hashes).size, 16);
  return { distinctFrames: 16, states };
}

export async function checkCombatCharacterSpriteCorrections() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const provenance = JSON.parse(await fs.readFile(PROVENANCE, 'utf8'));
  assert.equal(manifest.schemaVersion, 1); assert.equal(manifest.entries.length, 1);
  const entry = manifest.entries[0];
  assert.equal(entry.heroId, HERO_ID);
  assert.equal(HEROES_DB.find(hero => hero.id === entry.heroId)?.universe, entry.universe);
  assert.equal(entry.columns, 4); assert.equal(entry.rows, 4);
  const file = path.resolve(ROOT, `public${entry.sheet}`);
  assert.equal(hash(await fs.readFile(file)), entry.sha256);
  assert.equal((await sharp(file).metadata()).hasAlpha, true);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.sourceImage))), entry.sourceImageSha256);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, entry.referenceImage))), entry.referenceAssetSha256);
  STATES.forEach((state, row) => { assert.equal(entry.states[state].row, row); assert.equal(entry.states[state].frames, 4); });
  assert.equal(entry.canon1to1Verified, false); assert.equal(entry.networkVerified, false);
  assert.equal(provenance.sources.length, 1);
  assert.equal(provenance.sources[0].model, null); assert.equal(provenance.sources[0].generationId, null);
  assert.equal(hash(await fs.readFile(path.resolve(ROOT, provenance.sources[0].archivedPath))), provenance.sources[0].sha256);
  assert.ok(provenance.generationRecords[0].prompt.includes('BASIC DAGGER'));
  const review = await reviewFrames(file);
  return { heroes: 1, states: 4, frames: review.distinctFrames, alphaAndMargins: true, hashesVerified: true };
}

export async function buildCombatCharacterSpriteCorrections() {
  const previous = await fs.readFile(PROVENANCE, 'utf8').then(JSON.parse, () => null);
  const record = await fs.readFile(path.resolve(ROOT, '.tmp/combat-fidelity-aria-correction.json'), 'utf8')
    .then(JSON.parse, () => previous?.generationRecords[0]);
  assert.equal(record?.heroId, HERO_ID, 'Actual native Aria generation record is required');
  const hero = HEROES_DB.find(item => item.id === HERO_ID);
  assert.equal(record.universe, hero.universe);
  await fs.mkdir(SOURCES, { recursive: true });
  const archived = path.resolve(SOURCES, `${HERO_ID}.png`);
  const input = await exists(record.file) ? record.file : archived;
  const sourceBytes = await fs.readFile(input);
  await fs.writeFile(archived, sourceBytes);
  const referenceImage = path.resolve(SOURCES, `${HERO_ID}-reference.png`);
  const referenceInput = await exists(record.source) ? record.source : referenceImage;
  const referenceBytes = await fs.readFile(referenceInput);
  await fs.writeFile(referenceImage, referenceBytes);
  const atlas = await segmentAtlas(input, 4);
  const composites = [], normalizedRows = [];
  for (let row = 0; row < 4; row++) {
    const normalized = await normalizeRow(atlas.rows[row]);
    composites.push({ input: normalized.bytes, left: 0, top: row * 256 });
    normalizedRows.push({ state: STATES[row], sourceRow: row, sourceBounds: atlas.rows[row].sourceBounds,
      scale: normalized.scale, baseline: normalized.baseline, frameBounds: normalized.frameBounds, ...atlas.rows[row].seamReview });
  }
  const output = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/combat-character-corrections/${HERO_ID}.png`;
  const file = path.resolve(ROOT, `public${sheet}`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, output);
  const review = await reviewFrames(file);
  await sharp(output).resize(768, 768, { kernel: sharp.kernel.nearest }).flatten({ background: '#131927' }).png()
    .toFile(path.resolve(DOCS, `character-sprite-correction-${HERO_ID}-contact.png`));
  const entry = { id: HERO_ID, heroId: HERO_ID, universe: hero.universe, name: hero.name, sheet,
    columns: 4, rows: 4, frames: 16, frameWidth: 256, frameHeight: 256, width: 1024, height: 1024,
    states: Object.fromEntries(STATES.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'run' ? 10 : 8, loop: state === 'idle' || state === 'run' }])),
    sha256: hash(output), alpha: true, sourceImage: relative(archived), sourceImageSha256: hash(sourceBytes), sourceDimensions: [atlas.width, atlas.height],
    referenceAsset: `/${relative(record.source).replace(/^public\//, '')}`, referenceImage: relative(referenceImage), referenceAssetSha256: hash(referenceBytes),
    sourceWork: record.sourceWork, sourceReference: record.sourceReference, provider: 'OpenAI', model: null, generationId: null,
    operation: 'native-imagegen-canonical-role-correction', networkVerified: false, canon1to1Verified: false, canonicalVerified: false,
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', sharedScalePerState: true, baseline: 244, rows: normalizedRows },
    visualValidation: { allFramesReviewed: true, identityReviewed: true, basicDagger: true, lutePresent: false, elderDesign: true,
      ...review, canon1to1Verified: false, networkVerified: false,
      notes: 'Original generated adaptation of base-game Aria as an elderly dagger user. Purple palette, dark skin and gray hair of the local reference retained; youthful armor/trousers replaced with a hood and layered dark-purple dress. The old bitmap already showed a dagger; the lute error was in its ability/weapon metadata, not a claim about pixels in that bitmap. No official sprite reproduction or certified costume fidelity is claimed.' } };
  await write(MANIFEST, { schemaVersion: 1, source: 'OpenAI', entries: [entry] });
  await write(PROVENANCE, { schemaVersion: 1, date: '2026-10-18', provider: 'OpenAI', model: null, generationId: null,
    networkVerified: false, canon1to1Verified: false,
    method: 'One actual native image_gen correction; Sharp only segments, scales uniformly within each row and packs the sixteen genuine poses. Both generated source and preceding reference are archived unchanged.',
    generationRecords: [record], sources: [{ archivedPath: relative(archived), sha256: hash(sourceBytes), originalGeneratedPath: record.file,
      prompt: record.prompt, referenceImage: relative(referenceImage), referenceAssetSha256: hash(referenceBytes), provider: 'OpenAI', model: null, generationId: null,
      operation: 'native-imagegen', accepted: true }], entries: [entry] });
  return checkCombatCharacterSpriteCorrections();
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  console.log(JSON.stringify(await (process.argv.includes('--check') ? checkCombatCharacterSpriteCorrections() : buildCombatCharacterSpriteCorrections())));
}
