import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const LEDGER_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'portal-boosters',
  'openai-remediation-v1.json'
);
const ORIGINAL_PLAN_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-plan.json'
);
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const EXPECTED_TOP_LEVEL_SLUGS = Object.freeze([
  'avatar-navi',
  'famille-pirate',
  'happy-wheels',
  'kill-bill',
  'marble-hornets',
  'mr-bean',
  'nicolas-et-pimprenelle',
  'nyan-cat',
  'plants-vs-zombies',
  'poppy-playtime',
  'rick-astley',
  'sartorius-stedim-biotech',
  'scp-foundation',
  'skibidi',
  'skyline',
  'telechat',
  'the-horribly-slow-murderer',
  'the-wild-thornberrys',
  'trololo',
  'alien-vs-predator',
  'dragon-ball-z',
  'godzilla',
  'mass-effect',
  'metal-gear',
  'michael-jackson',
  'minions',
  'naruto',
  'the-batman-who-laughs',
  'donjon-de-naheulbeuk',
  'aventuriers-du-survivaure',
  'adoprixtoxis',
  'reflets-d-acide',
  'unreal-tournament'
]);
const EXPECTED_STYLE_CONTRACT = Object.freeze({
  packetCount: 1,
  aspectRatio: '2:3',
  completeCrimpedSeams: true,
  circularBreachPortal: true,
  darkCosmicMargin: true,
  requiredVisibleText: Object.freeze([
    '<UNIVERSE TITLE>',
    'UNIVERSE',
    'BREACH PORTAL BOOSTER',
    '5 UNLOCKABLES',
    'ANOMALY SERIES'
  ]),
  forbiddenForms: Object.freeze([
    'flat poster',
    'flat card',
    'grid',
    'collage',
    'cropped packet',
    'placeholder',
    'pseudo-text'
  ])
});
const TITLE_OVERLAY_TEXT_BY_SLUG = Object.freeze({
  'michael-jackson': Object.freeze({ universe: 'Michael Jackson', exactText: 'MICHAEL JACKSON' }),
  minions: Object.freeze({ universe: 'Minions', exactText: 'MINIONS' }),
  'the-batman-who-laughs': Object.freeze({
    universe: 'The Batman Who Laughs',
    exactText: 'THE BATMAN WHO LAUGHS'
  })
});
const PUNCTUATION_CORRECTION_BY_SLUG = Object.freeze({
  kemet_devoured_sun: Object.freeze({
    universe: 'Kemet: The Devoured Sun',
    exactText: ':'
  }),
  aetherion_seven_laws: Object.freeze({
    universe: 'Aetherion: Seven Laws of Magic',
    exactText: ':'
  })
});

const errors = [];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function isCanonicalIsoDate(value) {
  if (typeof value !== 'string') return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function normalizeComparableTitle(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\u2019/g, "'")
    .toLocaleLowerCase('fr-FR');
}

function absolutePublicPath(publicPath, label) {
  if (
    typeof publicPath !== 'string'
    || !publicPath.startsWith('/boosters/')
    || publicPath.includes('\\')
    || publicPath.split('/').includes('..')
  ) {
    errors.push(`${label} is not a safe booster public path`);
    return null;
  }
  const absolutePath = path.resolve(
    REPOSITORY_ROOT,
    'public',
    ...publicPath.split('/').filter(Boolean)
  );
  const relative = path.relative(REPOSITORY_ROOT, absolutePath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    errors.push(`${label} resolves outside the repository`);
    return null;
  }
  return absolutePath;
}

async function main() {
  const [ledgerSource, originalPlanSource] = await Promise.all([
    readFile(LEDGER_PATH, 'utf8'),
    readFile(ORIGINAL_PLAN_PATH, 'utf8')
  ]);
  const ledger = JSON.parse(ledgerSource);
  const originalPlan = JSON.parse(originalPlanSource);
  const originalJobs = originalPlan.jobs.filter(job => job.category === 'booster');
  const originalJobsByPath = new Map(originalJobs.map(job => [job.destination, job]));
  const expectedPaths = new Set([
    ...EXPECTED_TOP_LEVEL_SLUGS.map(slug => `/boosters/${slug}.webp`),
    ...originalJobs.map(job => job.destination)
  ]);

  check(ledger.schemaVersion === 1, 'ledger.schemaVersion must be 1');
  check(
    ledger.contractId === 'multiverse-breach-portal-booster-openai-remediation-v1',
    'ledger.contractId is invalid'
  );
  check(isCanonicalIsoDate(ledger.generatedAt), 'ledger.generatedAt must be canonical ISO-8601');
  check(ledger.generator?.provider === 'OpenAI', 'ledger.generator.provider must be OpenAI');
  check(
    ledger.generator?.interface === 'built-in image_gen',
    'ledger.generator.interface must be built-in image_gen'
  );
  check(ledger.generator?.model === 'built-in/imagegen', 'ledger.generator.model is invalid');
  check(
    ledger.generator?.calls === 'one independent call per asset',
    'ledger must declare one independent image call per asset'
  );
  check(
    JSON.stringify(ledger.styleContract) === JSON.stringify(EXPECTED_STYLE_CONTRACT),
    'ledger.styleContract does not match the locked booster design'
  );

  const entries = Array.isArray(ledger.entries) ? ledger.entries : [];
  check(entries.length === 53, `expected 53 remediation entries, received ${entries.length}`);
  check(ledger.counts?.entries === 53, 'ledger.counts.entries must be 53');
  check(ledger.counts?.topLevel === 33, 'ledger.counts.topLevel must be 33');
  check(ledger.counts?.originalV2 === 20, 'ledger.counts.originalV2 must be 20');

  const universes = new Set();
  const paths = new Set();
  const promptHashes = new Set();
  const runtimeHashes = new Set();
  let verifiedBytes = 0;

  for (const [index, entry] of entries.entries()) {
    const label = `entries[${index}] ${entry?.universe || '<unknown>'}`;
    check(typeof entry?.slug === 'string' && entry.slug.trim(), `${label}: slug is missing`);
    check(typeof entry?.universe === 'string' && entry.universe.trim(), `${label}: universe is missing`);
    check(!universes.has(entry.universe), `${label}: duplicate universe`);
    universes.add(entry.universe);

    const generation = entry.generation || {};
    check(generation.provider === 'OpenAI', `${label}: provider must be OpenAI`);
    check(generation.interface === 'built-in image_gen', `${label}: interface is invalid`);
    check(generation.model === 'built-in/imagegen', `${label}: model is invalid`);
    check(isCanonicalIsoDate(generation.generatedAt), `${label}: generatedAt is invalid`);
    check(typeof generation.prompt === 'string' && generation.prompt.trim(), `${label}: prompt is missing`);
    check(SHA256_PATTERN.test(generation.promptSha256 || ''), `${label}: promptSha256 is invalid`);
    check(sha256(generation.prompt || '') === generation.promptSha256, `${label}: prompt hash mismatch`);
    check(!promptHashes.has(generation.promptSha256), `${label}: duplicate generation prompt`);
    promptHashes.add(generation.promptSha256);
    const titleIsDocumentedOverlay = entry.postProcessing?.type === 'typographic-title-overlay';
    if (titleIsDocumentedOverlay) {
      const overlay = TITLE_OVERLAY_TEXT_BY_SLUG[entry.slug];
      check(Boolean(overlay), `${label}: title overlay is not approved for this slug`);
      check(entry.universe === overlay?.universe, `${label}: title overlay universe is invalid`);
      check(entry.postProcessing?.exactText === overlay?.exactText, `${label}: title overlay text is invalid`);
      check(
        entry.postProcessing?.method === 'Sharp SVG composite before WebP normalization',
        `${label}: title overlay method is invalid`
      );
      check(
        typeof entry.postProcessing?.reason === 'string' && entry.postProcessing.reason.trim(),
        `${label}: title overlay reason is missing`
      );
    } else if (entry.postProcessing?.type === 'typographic-punctuation-correction') {
      const correction = PUNCTUATION_CORRECTION_BY_SLUG[entry.slug];
      check(Boolean(correction), `${label}: punctuation correction is not approved for this slug`);
      check(entry.universe === correction?.universe, `${label}: punctuation correction universe is invalid`);
      check(entry.postProcessing?.exactText === correction?.exactText, `${label}: punctuation correction text is invalid`);
      check(
        entry.postProcessing?.method === 'Sharp SVG composite before PNG installation',
        `${label}: punctuation correction method is invalid`
      );
      check(
        typeof entry.postProcessing?.reason === 'string' && entry.postProcessing.reason.trim(),
        `${label}: punctuation correction reason is missing`
      );
    } else {
      check(entry.postProcessing == null, `${label}: unapproved post-processing is present`);
      check(
        normalizeComparableTitle(generation.prompt).includes(normalizeComparableTitle(entry.universe)),
        `${label}: prompt omits the universe title`
      );
    }
    for (const requiredLabel of ['UNIVERSE', 'BREACH PORTAL BOOSTER', '5 UNLOCKABLES', 'ANOMALY SERIES']) {
      check(generation.prompt?.includes(requiredLabel), `${label}: prompt omits ${JSON.stringify(requiredLabel)}`);
    }

    const source = entry.generatedSource || {};
    check(source.format === 'png', `${label}: generated source must be PNG`);
    check(SHA256_PATTERN.test(source.sha256 || ''), `${label}: source SHA-256 is invalid`);
    check(Number.isInteger(source.bytes) && source.bytes >= 50_000, `${label}: source byte size is invalid`);
    check(Number.isInteger(source.width) && source.width >= 900, `${label}: source width is invalid`);
    check(Number.isInteger(source.height) && source.height >= 1300, `${label}: source height is invalid`);
    check(Math.abs((source.width / source.height) - (2 / 3)) <= 0.002, `${label}: source is not 2:3`);

    const runtime = entry.runtime || {};
    check(expectedPaths.has(runtime.publicPath), `${label}: runtime path is outside the remediation set`);
    check(BOOSTER_ART_BY_UNIVERSE[entry.universe] === runtime.publicPath, `${label}: runtime path differs from catalogue`);
    check(!paths.has(runtime.publicPath), `${label}: duplicate runtime path`);
    paths.add(runtime.publicPath);
    check(SHA256_PATTERN.test(runtime.sha256 || ''), `${label}: runtime SHA-256 is invalid`);
    check(!runtimeHashes.has(runtime.sha256), `${label}: duplicate runtime image hash`);
    runtimeHashes.add(runtime.sha256);
    check(entry.visualReview?.approved === true, `${label}: visual review is not approved`);
    check(
      typeof entry.visualReview?.notes === 'string' && entry.visualReview.notes.trim(),
      `${label}: visual review notes are missing`
    );

    const localPath = absolutePublicPath(runtime.publicPath, `${label}.runtime.publicPath`);
    if (!localPath) continue;
    try {
      const [buffer, fileStats, metadata] = await Promise.all([
        readFile(localPath),
        stat(localPath),
        sharp(localPath, { failOn: 'error' }).metadata()
      ]);
      verifiedBytes += fileStats.size;
      check(fileStats.isFile(), `${label}: runtime is not a regular file`);
      check(runtime.repositoryPath === path.relative(REPOSITORY_ROOT, localPath).split(path.sep).join('/'), `${label}: repositoryPath mismatch`);
      check(runtime.sha256 === sha256(buffer), `${label}: runtime SHA-256 mismatch`);
      check(runtime.bytes === fileStats.size, `${label}: runtime byte size mismatch`);
      check(runtime.format === metadata.format, `${label}: runtime format mismatch`);
      check(runtime.width === metadata.width, `${label}: runtime width mismatch`);
      check(runtime.height === metadata.height, `${label}: runtime height mismatch`);
      check(Math.abs((metadata.width / metadata.height) - (2 / 3)) <= 0.002, `${label}: runtime is not 2:3`);
      if (runtime.publicPath.endsWith('.webp')) {
        check(metadata.format === 'webp', `${label}: top-level runtime must be WebP`);
        check(metadata.width === 640 && metadata.height === 960, `${label}: WebP runtime must be 640x960`);
        check(fileStats.size >= 50_000 && fileStats.size <= 800_000, `${label}: WebP byte size is suspicious`);
      } else {
        check(metadata.format === 'png', `${label}: original-v2 runtime must be PNG`);
        check(metadata.width >= 900 && metadata.height >= 1300, `${label}: original-v2 runtime is too small`);
        const job = originalJobsByPath.get(runtime.publicPath);
        check(Boolean(job), `${label}: original-v2 runtime has no canonical job`);
        if (job) {
          check(entry.slug === job.worldKey, `${label}: original-v2 slug mismatch`);
          check(entry.universe === job.universe, `${label}: original-v2 universe mismatch`);
          check(generation.prompt === job.prompt, `${label}: original-v2 prompt is not canonical`);
          check(generation.promptSha256 === job.promptSha256, `${label}: original-v2 prompt hash mismatch`);
        }
      }
    } catch (error) {
      errors.push(`${label}: runtime inspection failed (${error.code || error.message})`);
    }
  }

  const missingPaths = [...expectedPaths].filter(publicPath => !paths.has(publicPath));
  check(paths.size === 53, `expected 53 unique runtime paths, received ${paths.size}`);
  check(missingPaths.length === 0, `missing remediation runtime paths: ${missingPaths.join(', ')}`);

  console.log(JSON.stringify({
    contractId: ledger.contractId,
    entries: entries.length,
    uniqueUniverses: universes.size,
    uniqueRuntimePaths: paths.size,
    uniqueRuntimeHashes: runtimeHashes.size,
    verifiedBytes,
    errors
  }, null, 2));
  if (errors.length > 0) process.exitCode = 1;
}

main().catch(error => {
  console.error(`[portal-booster-remediation-audit] ${error.message}`);
  process.exitCode = 1;
});
