import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { CANON_ROSTER_WAVE_PART_A } from '../src/game/canonRosterWavePartA.js';
import { CANON_ROSTER_WAVE_PART_B } from '../src/game/canonRosterWavePartB.js';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB } from '../src/game/heroes.js';
import { getPortalBoosterArt } from '../src/game/portalBoosterCatalog.js';
import { getItemSpriteSrc } from '../src/game/spriteAssets.js';
import { STAGE_LORE_PROFILES } from '../src/game/stageLoreProfiles.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wave = [...CANON_ROSTER_WAVE_PART_A, ...CANON_ROSTER_WAVE_PART_B];
const targetUniverses = new Set(wave.map(entry => entry.universe));
const spriteManifest = JSON.parse(await readFile(
  path.join(repositoryRoot, 'public', 'sprites', 'generated', 'sprite-manifest.json'),
  'utf8'
));
const openAiOutputs = new Set((spriteManifest.entries || [])
  .filter(entry => entry.available === true && entry.source === 'openai')
  .map(entry => entry.output));

const exists = async publicPath => {
  if (!publicPath) return false;
  try {
    await access(path.join(repositoryRoot, 'public', publicPath.replace(/^\/+/, '')));
    return true;
  } catch {
    return false;
  }
};

const threatName = threat => typeof threat === 'string' ? threat : threat?.name;
const heroMetadata = subject => subject?.[3] && typeof subject[3] === 'object' ? subject[3] : {};
const threatMetadata = subject => subject && typeof subject === 'object' ? subject : {};
const httpsReferences = (...values) => values
  .flat(Infinity)
  .filter(value => typeof value === 'string' && value.startsWith('https://'));

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const subjectPath = (universe, subject, hero = false) => {
  if (subject?.output) return subject.output;
  const id = hero ? subject?.[0] : threatName(subject);
  return `/sprites/generated/${hero ? 'heroes' : 'bosses'}/${slugify(universe)}/${slugify(id)}.png`;
};

const subjects = wave.flatMap(entry => [
  ...[entry.hero, ...entry.allies].map(subject => {
    const metadata = heroMetadata(subject);
    return {
      category: 'subject',
      universe: entry.universe,
      id: subject[0],
      output: subjectPath(entry.universe, subject, true),
      referenceUrls: httpsReferences(metadata.referenceUrl, entry.referenceUrls),
      visualAnchor: metadata.visualAnchor,
      canonStatus: metadata.canonStatus,
      manifestRequired: true
    };
  }),
  ...[...entry.monsters, ...entry.bosses, entry.worldBoss].map(subject => {
    const metadata = threatMetadata(subject);
    return {
      category: 'subject',
      universe: entry.universe,
      id: threatName(subject),
      output: subjectPath(entry.universe, subject),
      referenceUrls: httpsReferences(metadata.referenceUrl, entry.referenceUrls),
      visualAnchor: metadata.visualAnchor,
      canonStatus: metadata.canonStatus,
      manifestRequired: true
    };
  })
]);

const gear = EQUIP_ITEMS_DB
  .filter(item => targetUniverses.has(item.universe))
  .map(item => ({
    category: 'gear',
    universe: item.universe,
    id: item.id,
    output: getItemSpriteSrc(item),
    referenceUrls: httpsReferences(item.referenceUrl),
    visualAnchor: item.visualAnchor,
    canonStatus: item.canonStatus,
    manifestRequired: true
  }));

const events = Object.entries(EVENT_ITEMS_DB)
  .filter(([universe]) => targetUniverses.has(universe))
  .map(([universe, item]) => ({
    category: 'event',
    universe,
    id: item.id,
    output: getItemSpriteSrc({ ...item, universe: item.universe || universe }),
    referenceUrls: httpsReferences(item.referenceUrl),
    visualAnchor: item.visualAnchor,
    canonStatus: item.canonStatus,
    manifestRequired: true
  }));

const stages = Object.values(STAGE_LORE_PROFILES)
  .filter(profile => targetUniverses.has(profile.key))
  .flatMap(profile => Object.entries(profile.modes).map(([mode, spec]) => ({
    category: 'stage',
    universe: profile.key,
    id: mode,
    output: spec.assetPath,
    referenceUrls: httpsReferences(profile.referenceUrls),
    visualAnchor: profile.visualAnchor,
    canonStatus: profile.auditStatus,
    manifestRequired: true
  })));

const boosters = wave.map(entry => ({
  category: 'booster',
  universe: entry.universe,
  id: entry.universe,
  output: getPortalBoosterArt(entry.universe),
  referenceUrls: httpsReferences(entry.referenceUrl, entry.referenceUrls),
  visualAnchor: entry.visualAnchor,
  canonStatus: entry.canonStatus,
  manifestRequired: false
}));

const rows = [...subjects, ...gear, ...events, ...stages, ...boosters];
const inspectImage = async row => {
  if (!await exists(row.output)) return null;
  const filePath = path.join(repositoryRoot, 'public', row.output.replace(/^\/+/, ''));
  const source = await readFile(filePath);
  const metadata = await sharp(source, { animated: false, failOn: 'error' }).metadata();
  const problems = [];

  if (['gear', 'event'].includes(row.category)) {
    if (metadata.format !== 'png' || metadata.width !== 512 || metadata.height !== 512) {
      problems.push(`expected 512x512 PNG, received ${metadata.width}x${metadata.height} ${metadata.format}`);
    }
    if (metadata.channels !== 4 || metadata.hasAlpha !== true) problems.push('expected RGBA with alpha');
    const { data } = await sharp(source, { animated: false, failOn: 'error' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let transparentPixels = 0;
    let hiddenRgbPixels = 0;
    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      if (alpha !== 0) continue;
      transparentPixels += 1;
      if (data[index] !== 0 || data[index + 1] !== 0 || data[index + 2] !== 0) hiddenRgbPixels += 1;
    }
    if (transparentPixels === 0) problems.push('expected a detached transparent background');
    if (hiddenRgbPixels > 0) problems.push(`${hiddenRgbPixels} fully transparent pixels retain hidden RGB`);
  } else if (row.category === 'stage') {
    if (metadata.format !== 'webp' || metadata.width !== 1536 || metadata.height !== 864) {
      problems.push(`expected 1536x864 WebP, received ${metadata.width}x${metadata.height} ${metadata.format}`);
    }
  } else if (row.category === 'booster') {
    if (metadata.format !== 'webp' || metadata.width !== 640 || metadata.height !== 960) {
      problems.push(`expected 640x960 WebP, received ${metadata.width}x${metadata.height} ${metadata.format}`);
    }
  }

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    sha256: createHash('sha256').update(source).digest('hex'),
    problems
  };
};

const inspected = await Promise.all(rows.map(async row => {
  const available = await exists(row.output);
  const image = available ? await inspectImage(row) : null;
  const metadataComplete = row.referenceUrls.length > 0
    && Boolean(row.visualAnchor)
    && Boolean(row.canonStatus);
  return {
    ...row,
    available,
    metadataComplete,
    openAiManifest: row.manifestRequired ? openAiOutputs.has(row.output) : null,
    image
  };
}));
const missing = inspected.filter(row => !row.available);
const metadataViolations = inspected.filter(row => !row.metadataComplete);
const manifestViolations = inspected.filter(row => row.available && row.manifestRequired && !row.openAiManifest);
const imageViolations = inspected.filter(row => row.image?.problems.length > 0);
const duplicateImageHashes = [...new Set(inspected
  .filter(row => row.image)
  .filter((row, index, values) => values.findIndex(candidate => candidate.image.sha256 === row.image.sha256) !== index)
  .map(row => row.image.sha256))];
const totals = Object.fromEntries(
  [...new Set(inspected.map(row => row.category))].map(category => {
    const categoryRows = inspected.filter(row => row.category === category);
    return [category, {
      expected: categoryRows.length,
      available: categoryRows.filter(row => row.available).length,
      missing: categoryRows.filter(row => !row.available).length
    }];
  })
);

const report = {
  id: 'multiverse-breach.canon-roster-visual-completeness',
  status: (
    missing.length === 0
    && metadataViolations.length === 0
    && manifestViolations.length === 0
    && imageViolations.length === 0
    && duplicateImageHashes.length === 0
  ) ? 'approved' : 'incomplete',
  universes: wave.length,
  totals,
  provenance: {
    referenceLocked: inspected.length - metadataViolations.length,
    expected: inspected.length,
    openAiManifest: inspected.filter(row => row.available && row.openAiManifest === true).length,
    manifestRequiredAvailable: inspected.filter(row => row.available && row.manifestRequired).length,
    derivedBoosters: inspected.filter(row => row.available && !row.manifestRequired).length
  },
  duplicateImageHashes,
  missing: missing.map(({ category, universe, id, output }) => ({ category, universe, id, output })),
  metadataViolations: metadataViolations.map(({ category, universe, id, output }) => ({ category, universe, id, output })),
  manifestViolations: manifestViolations.map(({ category, universe, id, output }) => ({ category, universe, id, output })),
  imageViolations: imageViolations.map(({ category, universe, id, output, image }) => ({
    category,
    universe,
    id,
    output,
    problems: image.problems
  }))
};

console.log(JSON.stringify(report, null, 2));
if (report.status !== 'approved' && !process.argv.includes('--report-missing')) process.exitCode = 1;
