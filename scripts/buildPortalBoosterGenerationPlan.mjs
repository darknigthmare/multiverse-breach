import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createServer } from 'vite';

import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';

const projectRoot = path.resolve(import.meta.dirname, '..');
const defaultWorkDir = path.join(projectRoot, 'tmp', 'booster-generation');
const collator = new Intl.Collator('fr', { sensitivity: 'base', numeric: true });

const parseArguments = (argv) => {
  const options = {
    out: path.join(defaultWorkDir, 'plan.json'),
    universes: null,
    includeExisting: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--out') {
      options.out = path.resolve(projectRoot, argv[index + 1]);
      index += 1;
    } else if (argument === '--universes') {
      options.universes = path.resolve(projectRoot, argv[index + 1]);
      index += 1;
    } else if (argument === '--include-existing') {
      options.includeExisting = true;
    } else if (argument === '--help' || argument === '-h') {
      console.log([
        'Usage: node scripts/buildPortalBoosterGenerationPlan.mjs [options]',
        '',
        'Options:',
        '  --out <file>         Plan destination (default: tmp/booster-generation/plan.json)',
        '  --universes <file>   JSON array override; otherwise derive universes from HEROES_DB',
        '  --include-existing   Include already catalogued, valid booster assets',
        '  --help               Show this help'
      ].join('\n'));
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
};

export const slugifyBoosterUniverse = (universe) => {
  const slug = universe
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (slug) return slug;
  return `universe-${createHash('sha1').update(universe).digest('hex').slice(0, 8)}`;
};

const fileIsUsable = async (filePath) => {
  try {
    const fileStats = await stat(filePath);
    return fileStats.isFile() && fileStats.size >= 50_000;
  } catch {
    return false;
  }
};

const loadUniverseSource = async (universeFile) => {
  if (universeFile) {
    const parsed = JSON.parse(await readFile(universeFile, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new TypeError('--universes must point to a JSON array.');
    }
    return parsed.map((entry) => (
      typeof entry === 'string'
        ? { universe: entry, heroes: [] }
        : { universe: entry.universe, heroes: entry.heroes || [] }
    ));
  }

  const vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  try {
    const runtimeModule = await vite.ssrLoadModule('/src/game/heroes.js');
    const groupedHeroes = new Map();
    for (const hero of runtimeModule.HEROES_DB) {
      if (!hero?.universe || !hero?.name) continue;
      const heroes = groupedHeroes.get(hero.universe) || [];
      if (!heroes.includes(hero.name)) heroes.push(hero.name);
      groupedHeroes.set(hero.universe, heroes);
    }
    return [...groupedHeroes].map(([universe, heroes]) => ({ universe, heroes }));
  } finally {
    await vite.close();
  }
};

const buildPrompt = ({ universe, heroes }) => {
  const representativeHeroes = heroes.slice(0, 3).join(', ');
  const subjectLine = representativeHeroes
    ? `Subject: an original fan-made, lore-faithful ensemble evoking ${representativeHeroes}, framed inside the portal with a representative environment from ${universe}.`
    : `Subject: an original fan-made, lore-faithful scene with the most recognizable environment, objects, palette, and silhouettes from ${universe}.`;

  return [
    'Use case: product-mockup',
    'Asset type: vertical collectible-card foil booster for the Multiverse Breach in-game portal',
    `Primary request: create exactly one sealed booster dedicated only to the ${universe} universe.`,
    'Scene/backdrop: dark cosmic void with subtle turquoise breach particles; the complete packet is isolated and fully visible.',
    subjectLine,
    'Style/medium: premium cinematic trading-card packaging, detailed original fan art, metallic foil, embossed accents, dramatic but readable lighting.',
    'Composition/framing: exact 2:3 portrait; one straight-on vertical packet centered with generous margin; crimped foil seams visible at top and bottom; circular luminous breach portal in the middle; no cropped wrapper edge.',
    'Materials/textures: realistic dark metallic foil with a universe-specific accent palette and controlled holographic reflections.',
    `Text (verbatim): "${universe}" at the top; "UNIVERSE"; "BREACH PORTAL BOOSTER"; "5 UNLOCKABLES"; "ANOMALY SERIES".`,
    `Constraints: ${universe} only; one booster and one wrapper; original fan-made illustration; preserve the established Multiverse Breach booster structure; no official key art copied from a source image.`,
    'Avoid: collage, grid, contact sheet, multiple packets, loose cards, hands, store shelf, poster layout, UI mockup, franchise logo, unrelated crossover character, watermark, illegible decorative paragraphs.'
  ].join('\n');
};

const assignCollisionSafeSlugs = (sourceEntries) => {
  const usedSlugs = new Map();
  return sourceEntries.map((entry) => {
    const baseSlug = slugifyBoosterUniverse(entry.universe);
    const existingUniverse = usedSlugs.get(baseSlug);
    const slug = existingUniverse && existingUniverse !== entry.universe
      ? `${baseSlug}-${createHash('sha1').update(entry.universe).digest('hex').slice(0, 6)}`
      : baseSlug;
    usedSlugs.set(slug, entry.universe);
    return { ...entry, slug };
  });
};

const writeJsonAtomically = async (outputPath, value) => {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, outputPath);
};

export const buildPortalBoosterGenerationPlan = async (options) => {
  const rawEntries = await loadUniverseSource(options.universes);
  const universeEntries = assignCollisionSafeSlugs(
    rawEntries
      .filter(({ universe }) => typeof universe === 'string' && universe.trim())
      .filter(({ universe }) => universe !== 'Nexus de Convergence')
      .sort((left, right) => collator.compare(left.universe, right.universe))
  );

  const jobs = [];
  const seenUniverses = new Set();
  for (const entry of universeEntries) {
    if (seenUniverses.has(entry.universe)) continue;
    seenUniverses.add(entry.universe);

    const currentPublicPath = BOOSTER_ART_BY_UNIVERSE[entry.universe] || null;
    const output = currentPublicPath || `/boosters/${entry.slug}.webp`;
    const localAssetPath = path.join(projectRoot, 'public', ...output.split('/').filter(Boolean));
    const assetAvailable = await fileIsUsable(localAssetPath);
    const alreadyCatalogued = Boolean(currentPublicPath);

    if (!options.includeExisting && alreadyCatalogued && assetAvailable) continue;

    jobs.push({
      id: entry.slug,
      universe: entry.universe,
      slug: entry.slug,
      output,
      ratio: '2:3',
      target: { width: 640, height: 960, format: 'webp', quality: 88 },
      prompt: buildPrompt(entry),
      source: {
        heroNames: entry.heroes.slice(0, 3),
        alreadyCatalogued
      }
    });
  }

  const plan = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    generator: 'built-in image_gen (one call per job)',
    processing: {
      sourceFormat: 'PNG',
      requiredSourceRatio: '2:3',
      outputFormat: 'WebP',
      width: 640,
      height: 960,
      quality: 88,
      minimumBytes: 50_000,
      maximumBytes: 800_000
    },
    counts: {
      runtimeUniverses: seenUniverses.size,
      currentCatalog: Object.keys(BOOSTER_ART_BY_UNIVERSE).length,
      jobs: jobs.length
    },
    jobs
  };

  await writeJsonAtomically(options.out, plan);
  return plan;
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const plan = await buildPortalBoosterGenerationPlan(options);
  console.log(JSON.stringify({
    plan: path.relative(projectRoot, options.out),
    ...plan.counts
  }, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
