import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  CLOUD_MEADOW_CHARACTERS,
  CLOUD_MEADOW_REFERENCES,
  CLOUD_MEADOW_SCALE_GROUPS
} from '../src/game/cloudMeadowCharacters.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export async function inspectCloudMeadowImage(src, requireTransparency = true) {
  const bytes = await readFile(resolve(root, `public${src}`));
  const metadata = await sharp(bytes).metadata();
  if (requireTransparency && metadata.format !== 'png') throw new Error(`${src}: artwork must be PNG`);
  if (!['png', 'webp', 'jpeg'].includes(metadata.format)) throw new Error(`${src}: unsupported reference image format`);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width; let y0 = info.height; let x1 = -1; let y1 = -1;
  let transparentPixels = 0; let boundaryPixels = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * info.channels + info.channels - 1];
    if (alpha === 0) transparentPixels++;
    if (alpha > 16) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      if (x === 0 || y === 0 || x === info.width - 1 || y === info.height - 1) boundaryPixels++;
    }
  }
  if (x1 < 0) throw new Error(`${src}: empty image`);
  if (requireTransparency && (!metadata.hasAlpha || transparentPixels === 0)) throw new Error(`${src}: missing real transparency`);
  if (requireTransparency && boundaryPixels > 0) throw new Error(`${src}: visible pixels touch the frame boundary; check for clipped limbs/tail`);
  return {
    sha256: digest(bytes), bytes: bytes.length, format: metadata.format,
    width: info.width, height: info.height,
    hasAlpha: metadata.hasAlpha, transparentPixels, boundaryPixels,
    contentBounds: { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
  };
}

export function validateCloudMeadowAssociations(entries, references, scaleGroups) {
  const unique = (values, label) => {
    if (new Set(values).size !== values.length) throw new Error(`Cloud Meadow: duplicate ${label}`);
  };
  unique(entries.map(entry => entry.id), 'character ID');
  unique(entries.map(entry => entry.src), 'artwork path');
  unique(references.map(reference => reference.id), 'reference ID');
  unique(references.map(reference => reference.src), 'reference path');
  unique(scaleGroups.map(group => group.id), 'scale group ID');
  const byReference = new Map(references.map(reference => [reference.id, reference]));
  const byGroup = new Map(scaleGroups.map(group => [group.id, group]));
  for (const reference of references) {
    if (!reference.src.startsWith('/reviews/cloud-meadow/') || reference.src.includes('..')) throw new Error(`${reference.id}: invalid reference path`);
    if (!reference.label?.fr || !reference.label?.en) throw new Error(`${reference.id}: missing reference labels`);
    if (!Number.isInteger(reference.image?.width) || !Number.isInteger(reference.image?.height)) throw new Error(`${reference.id}: missing reference dimensions`);
  }
  for (const entry of entries) {
    const reference = byReference.get(entry.referenceId);
    if (!reference || entry.referenceSrc !== reference.src) throw new Error(`${entry.id}: incorrect reference association`);
    if (!entry.src.startsWith('/sprites/generated/heroes/cloud-meadow/') || entry.src.includes('..')) throw new Error(`${entry.id}: invalid artwork path`);
    const crop = entry.referenceCrop;
    if (!Array.isArray(crop) || crop.length !== 4 || !crop.every(Number.isInteger)
      || crop[0] < 0 || crop[1] < 0 || crop[2] <= 0 || crop[3] <= 0
      || crop[0] + crop[2] > reference.image.width || crop[1] + crop[3] > reference.image.height) {
      throw new Error(`${entry.id}: crop outside its reference sheet`);
    }
    if (!['reference-based-generated', 'adapted-coverage', 'description-based-adaptation'].includes(entry.fidelityStatus)) throw new Error(`${entry.id}: unknown fidelity status`);
    if (!entry.fidelityNote?.fr || !entry.fidelityNote?.en || entry.canonicalFidelityApproved !== false) throw new Error(`${entry.id}: missing fidelity disclosure`);
    const fromDescription = entry.fidelityStatus === 'description-based-adaptation';
    if (entry.generationMode !== (fromDescription ? 'text-description' : 'reference-image')
      || entry.provenance !== (fromDescription ? 'generated-from-reference-description' : 'generated-from-user-reference')) throw new Error(`${entry.id}: generation mode does not match provenance`);
    if (entry.scaleGroupId === null && entry.referenceRelativeHeight !== null) throw new Error(`${entry.id}: height ratio needs an explicit scale group`);
    if (entry.scaleGroupId !== null) {
      const group = byGroup.get(entry.scaleGroupId);
      if (!group || group.referenceId !== entry.referenceId) throw new Error(`${entry.id}: scale comparison crosses reference sheets`);
      if (!Number.isFinite(entry.referenceRelativeHeight) || entry.referenceRelativeHeight <= 0) throw new Error(`${entry.id}: invalid relative height`);
    }
  }
  for (const group of scaleGroups) {
    const baseline = entries.find(entry => entry.id === group.baselineCharacterId);
    if (!baseline || baseline.scaleGroupId !== group.id || baseline.referenceRelativeHeight !== 1) throw new Error(`${group.id}: invalid scale baseline`);
    if (!group.note?.fr || !group.note?.en) throw new Error(`${group.id}: missing scale qualification`);
  }
}

export async function buildCloudMeadowReviewCatalog() {
  const references = await Promise.all(CLOUD_MEADOW_REFERENCES.map(async reference => ({
    ...reference, image: await inspectCloudMeadowImage(reference.src, false)
  })));
  validateCloudMeadowAssociations(CLOUD_MEADOW_CHARACTERS, references, CLOUD_MEADOW_SCALE_GROUPS);
  const entries = await Promise.all(CLOUD_MEADOW_CHARACTERS.map(async character => ({
    ...character, image: await inspectCloudMeadowImage(character.src)
  })));
  if (new Set(entries.map(entry => entry.image.sha256)).size !== entries.length) throw new Error('Cloud Meadow: duplicated artwork bytes assigned to distinct characters');
  const catalog = {
    schemaVersion: 2,
    universe: 'Cloud Meadow',
    counts: {
      characters: entries.length, images: entries.length, referenceSheets: references.length,
      referenceBased: entries.filter(entry => entry.fidelityStatus === 'reference-based-generated').length,
      adapted: entries.filter(entry => entry.fidelityStatus === 'adapted-coverage').length,
      descriptionBased: entries.filter(entry => entry.fidelityStatus === 'description-based-adaptation').length,
      animationFramesPerImage: 1, pixelIdenticalCertified: 0
    },
    // Retain the original reference key for consumers of the first review catalogue.
    reference: references[0],
    references,
    scaleGroups: CLOUD_MEADOW_SCALE_GROUPS,
    sources: [
      { url: 'https://www.patreon.com/CloudMeadow/about', purpose: 'Primary source naming protagonists Evan and Eve', checkedOn: '2026-10-28' },
      { url: 'https://steamcommunity.com/app/1223750/discussions/0/4361250264578954844/', purpose: 'Forum answer selected by a moderator listing the ten companion names; source-sheet appearance matching is a separate visual identification', checkedOn: '2026-10-29' }
    ],
    limitations: [
      'Generated illustrations; reference-image and text-description methods are distinguished per entry. These are not original source-game exports or pixel-identical certified reproductions.',
      'Coverage adaptations are identified on each affected artwork; added outfits are not presented as official costumes.',
      'Description-based adaptations use neutral text descriptions only; their comparison sheet was not supplied to the image generator.',
      'One static full-body pose per character; no source-game movement/combat animation is claimed.',
      'Visual catalogue only; no invented combat stats, moves, unlocks, bosses or campaign.',
      'Descriptive creature labels identify the visible source designs, not unverified individual canon names.',
      'Relative heights apply only inside an explicitly measured reference-sheet group; no cross-sheet or canonical physical size is inferred.'
    ],
    entries
  };
  return {
    catalog,
    manifest: {
      ...catalog,
      provenance: {
        generator: 'Built-in ImageGen',
        method: 'One separate transparent image per character; reference-image edits and text-description adaptations are distinguished per entry',
        promptFile: 'docs/cloud-meadow/prompts.json',
        postProcessing: 'None: generated PNG bytes copied unchanged into the project.'
      }
    }
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { catalog, manifest } = await buildCloudMeadowReviewCatalog();
  for (const [name, value] of [
    ['public/reviews/cloud-meadow/catalog.json', catalog],
    ['docs/cloud-meadow/manifest.json', manifest]
  ]) {
    const output = resolve(root, name);
    const expected = `${JSON.stringify(value, null, 2)}\n`;
    if (process.argv.includes('--write')) {
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, expected);
    } else if (await readFile(output, 'utf8') !== expected) {
      throw new Error(`${name} is stale; run npm run cloud-meadow:review`);
    }
  }
  console.log(`Cloud Meadow: ${catalog.entries.length} complete transparent PNGs, ${catalog.references.length} source references and review catalogue ${process.argv.includes('--write') ? 'written' : 'verified'}.`);
}
