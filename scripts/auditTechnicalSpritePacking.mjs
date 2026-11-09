import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getHeroById } from '../src/game/heroes.js';
import { CORRECTED_CANON_HERO_SPRITES, CORRECTED_HERO_SPRITE_VARIANTS, getHeroCompleteSpritePack, getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { inspectReferencedCharacterPng, normalizeReferencedCharacterPng } from './installReferencedCharacterImages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readPinned = async record => {
  assert(record.path && !path.isAbsolute(record.path), 'Expected a repository-relative evidence path');
  const file = path.resolve(root, record.path);
  assert(file.startsWith(root + path.sep), 'Evidence escapes the repository');
  const bytes = await readFile(file);
  assert.equal(digest(bytes), record.sha256, `Changed evidence: ${record.path}`);
  if (record.bytes !== undefined) assert.equal(bytes.length, record.bytes);
  return bytes;
};

const promotionPath = process.argv[2];
assert(promotionPath, 'Usage: node scripts/auditTechnicalSpritePacking.mjs RUNTIME_PROMOTION.json');
const promotion = JSON.parse(await readFile(path.resolve(root, promotionPath), 'utf8'));
assert.equal(promotion.status, 'installed-after-independent-technical-review');
assert.equal(promotion.newImageGenerationUsed, false);
assert.equal(promotion.semanticArtworkCreated, false);
assert.equal(promotion.canonicalFidelityApproved, false);
const receiptBytes = await readPinned(promotion.preparationReceipt);
const receipt = JSON.parse(receiptBytes);
const review = JSON.parse(await readPinned(promotion.independentReview));
assert.equal(review.independentOfProducer, true);
assert.equal(review.status, 'accepted-for-runtime-installation-technical-packing-only');
assert.equal(review.technicalReceipt.sha256AtReview, digest(receiptBytes));
assert.equal(review.canonicalFidelityApproved, false);
assert.equal(receipt.characterId, promotion.characterId);
assert.equal(review.characterId, promotion.characterId);
assert.equal(receipt.technicalProvenance.newImageGenerationUsed, false);
assert.equal(receipt.technicalProvenance.semanticArtworkCreated, false);
assert.equal(receipt.technicalProvenance.sourceUnmodified, true);
await readPinned({ path: receipt.technicalProvenance.implementation, sha256: receipt.technicalProvenance.implementationSha256 });
const source = await readPinned(receipt.source);
assert.equal(digest(await readFile(path.resolve(root, receipt.source.snapshotPath))), digest(source));
const output = await readPinned(receipt.output);
assert.equal(review.source.sha256, digest(source));
assert.equal(review.output.sha256, digest(output));
const reproduced = await normalizeReferencedCharacterPng(source, { componentLayout: true });
assert(output.equals(reproduced.buffer), 'Installed PNG differs from the exact technical derivative');
assert.deepEqual(reproduced.processing, receipt.processing);
assert.deepEqual(await inspectReferencedCharacterPng(output), receipt.geometry);
const metadata = await sharp(output).metadata();
assert.equal(metadata.width, 1024);
assert.equal(metadata.height, 1024);
assert.equal(metadata.channels, 4);
assert.equal(receipt.geometry.nonemptyCells, 16);
assert(receipt.geometry.minimumGuard >= 12);
assert.equal(receipt.processing.sourceVisiblePixels, receipt.processing.assignedVisiblePixels);
assert.equal(receipt.processing.softAlphaOutsideFrameDiscarded, 0);
assert.equal(receipt.processing.softAlphaAmbiguitiesForReview, 0);
const frameHashes = [];
for (let frame = 0; frame < 16; frame++) {
  const pixels = await sharp(output).extract({ left: frame % 4 * 256, top: Math.floor(frame / 4) * 256, width: 256, height: 256 }).raw().toBuffer();
  const hash = digest(pixels);
  frameHashes.push(hash);
  assert.equal(hash, receipt.comparison.frames[frame].packedFrameSha256);
  assert.equal(hash, review.entries[frame].packedFrameSha256);
  assert.equal(review.entries[frame].independentlyViewed, true);
  assert.match(review.entries[frame].decision, /^accepted-/);
}
assert.equal(new Set(frameHashes).size, 16, 'A pose was duplicated');
const hero = getHeroById(promotion.characterId);
assert(hero);
assert.equal(getHeroSpriteSheetSrc(hero), receipt.output.runtimePath);
const variants = CORRECTED_HERO_SPRITE_VARIANTS[hero.id];
assert.equal(variants.filter(variant => variant.current).length, 1);
assert(variants.some(variant => variant.current && variant.src === receipt.output.runtimePath));
assert(variants.some(variant => !variant.current && variant.src === '/' + receipt.source.path.replace(/^public\//, '')));
assert.deepEqual(getHeroCompleteSpritePack(hero), variants, 'The Hub must receive both current and previous atlas choices');
assert.equal(getHeroCompleteSpritePack(hero)[0].src, getHeroSpriteSheetSrc(hero), 'The Hub must open the current atlas by default');
assert.equal(promotion.currentRuntimePath, receipt.output.runtimePath);
for (const id of Object.keys(CORRECTED_CANON_HERO_SPRITES)) {
  const choices = getHeroCompleteSpritePack(getHeroById(id));
  assert(choices?.length >= 2, `${id}: current and historical sprite choices must reach the Hub`);
  assert.equal(choices[0].src, getHeroSpriteSheetSrc(getHeroById(id)));
  assert.equal(choices.filter(choice => choice.current).length, 1);
  assert(choices.some(choice => !choice.current));
  for (const choice of choices) {
    assert(choice.src.startsWith('/sprites/') && !choice.src.includes('..'));
    await readFile(path.join(root, 'public', choice.src));
  }
}
console.log(JSON.stringify({ passed: true, characterId: hero.id, operation: receipt.operationKind, frames: 16, sourceUnchanged: true, exactDerivative: true, minimumGuard: receipt.geometry.minimumGuard, uniformScale: receipt.processing.uniformScale, previousAtlasPreserved: true, correctedHeroesWithAccessibleVariants: Object.keys(CORRECTED_CANON_HERO_SPRITES).length, newImageGenerationUsed: false, canonicalFidelityApproved: false }));
