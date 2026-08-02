import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import {
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { BOOSTER_ART_BY_UNIVERSE } from '../src/game/portalBoosterCatalog.js';

const execFileAsync = promisify(execFile);
const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const SOURCE_ROOT = path.join(
  REPOSITORY_ROOT,
  'tmp',
  'booster-fix-openai-2026-08-02'
);
const PLAN_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-plan.json'
);
const REMEDIATION_LEDGER_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'portal-boosters',
  'openai-remediation-v1.json'
);
const INSTALL_ORIGINAL_SCRIPT = path.join(
  REPOSITORY_ROOT,
  'scripts',
  'installOriginalUniverseImage.mjs'
);
const REFRESH_ORIGINAL_LEDGER_SCRIPT = path.join(
  REPOSITORY_ROOT,
  'scripts',
  'refreshOriginalUniverseImageLedgerPlanSha.mjs'
);
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const TOP_LEVEL_OUTPUT = Object.freeze({
  width: 640,
  height: 960,
  format: 'webp',
  quality: 88
});
const STYLE_CONTRACT = Object.freeze({
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
const TITLE_OVERLAY_BY_SLUG = Object.freeze({
  'michael-jackson': Object.freeze({
    universe: 'Michael Jackson',
    exactText: 'MICHAEL JACKSON',
    fontSize: 56,
    lines: Object.freeze([
      Object.freeze({ text: 'MICHAEL JACKSON', y: '19.8%' })
    ]),
    reason: 'OpenAI image moderation blocked the public-figure name; the generated illustration deliberately contains no identifiable real person.'
  }),
  minions: Object.freeze({
    universe: 'Minions',
    exactText: 'MINIONS',
    fontSize: 72,
    lines: Object.freeze([
      Object.freeze({ text: 'MINIONS', y: '19.8%' })
    ]),
    reason: 'OpenAI output moderation repeatedly blocked the licensed universe title; the generated illustration uses wholly original helper robots.'
  }),
  'the-batman-who-laughs': Object.freeze({
    universe: 'The Batman Who Laughs',
    exactText: 'THE BATMAN WHO LAUGHS',
    fontSize: 50,
    lines: Object.freeze([
      Object.freeze({ text: 'THE BATMAN', y: '17.3%' }),
      Object.freeze({ text: 'WHO LAUGHS', y: '21.7%' })
    ]),
    reason: 'OpenAI output moderation repeatedly blocked the licensed universe title; the generated illustration uses a wholly original faceless gothic warlord.'
  })
});
const ORIGINAL_PUNCTUATION_CORRECTION_BY_SLUG = Object.freeze({
  kemet_devoured_sun: Object.freeze({
    universe: 'Kemet: The Devoured Sun',
    exactText: ':',
    x: '74.5%',
    dotYs: Object.freeze(['17.2%']),
    usesGeneratedTopDiamondAsFirstDot: true,
    reason: 'Three exact-prompt OpenAI retries replaced the required title colon with a slash, a diamond, or no punctuation; the final retry otherwise passed the complete visual and lore review.'
  }),
  aetherion_seven_laws: Object.freeze({
    universe: 'Aetherion: Seven Laws of Magic',
    exactText: ':',
    x: '87%',
    dotYs: Object.freeze(['18.3%', '20%']),
    usesGeneratedTopDiamondAsFirstDot: false,
    reason: 'The exact canonical OpenAI prompt produced the complete approved wrapper and scene but omitted the title colon; a minimal punctuation-only correction preserves the generated artwork.'
  })
});

const GROUPS = Object.freeze([
  Object.freeze({
    id: 'derived',
    directory: 'group-derived',
    type: 'top-level',
    expectedSlugs: Object.freeze([
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
      'trololo'
    ])
  }),
  Object.freeze({
    id: 'legacy-missing',
    directory: 'group-legacy-missing',
    type: 'top-level',
    expectedSlugs: Object.freeze([
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
    ])
  }),
  Object.freeze({
    id: 'original-v2',
    directory: 'group-original-v2',
    type: 'original-v2',
    expectedSlugs: null
  })
]);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertCanonicalIsoDate(value, label) {
  assert(typeof value === 'string', `${label} must be an ISO-8601 string`);
  const parsed = new Date(value);
  assert(
    !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value,
    `${label} must be a canonical ISO-8601 timestamp`
  );
}

function repositoryPathFromPublicPath(publicPath) {
  assert(
    typeof publicPath === 'string'
      && publicPath.startsWith('/boosters/')
      && !publicPath.includes('\\')
      && !publicPath.split('/').includes('..'),
    `Unsafe booster public path: ${JSON.stringify(publicPath)}`
  );
  const absolutePath = path.resolve(
    REPOSITORY_ROOT,
    'public',
    ...publicPath.split('/').filter(Boolean)
  );
  const relative = path.relative(REPOSITORY_ROOT, absolutePath);
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Booster path escaped repository');
  return absolutePath;
}

function resolveSourcePath(manifestDirectory, sourceFile, label) {
  assert(typeof sourceFile === 'string' && sourceFile.trim(), `${label}.sourceFile is missing`);
  const sourcePath = path.resolve(manifestDirectory, sourceFile);
  const relative = path.relative(manifestDirectory, sourcePath);
  assert(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative),
    `${label}.sourceFile must stay inside its staging group`
  );
  return sourcePath;
}

async function inspectSource(entry, manifestDirectory, label) {
  const sourcePath = resolveSourcePath(manifestDirectory, entry.sourceFile, label);
  assert(path.extname(sourcePath).toLowerCase() === '.png', `${label} source must be PNG`);
  const [buffer, fileStats, metadata] = await Promise.all([
    readFile(sourcePath),
    stat(sourcePath),
    sharp(sourcePath, { failOn: 'error' }).metadata()
  ]);
  const encodedSha256 = sha256(buffer);
  assert(fileStats.isFile(), `${label} source is not a regular file`);
  assert(metadata.format === 'png', `${label} source is not decoded as PNG`);
  assert(metadata.width >= 900 && metadata.height >= 1300, `${label} source resolution is too small`);
  assert(Math.abs((metadata.width / metadata.height) - (2 / 3)) <= 0.002, `${label} source is not 2:3`);
  assert(entry.width === metadata.width, `${label}.width does not match source`);
  assert(entry.height === metadata.height, `${label}.height does not match source`);
  assert(entry.bytes === fileStats.size, `${label}.bytes does not match source`);
  assert(entry.sourceSha256 === encodedSha256, `${label}.sourceSha256 does not match source`);
  assert(typeof entry.prompt === 'string' && entry.prompt.trim(), `${label}.prompt is missing`);
  assert(SHA256_PATTERN.test(entry.promptSha256 || ''), `${label}.promptSha256 is invalid`);
  assert(sha256(entry.prompt) === entry.promptSha256, `${label}.promptSha256 does not match prompt`);
  assertCanonicalIsoDate(entry.generatedAt, `${label}.generatedAt`);
  assert(
    entry.visualReview?.approved === true
      || entry.requiresTitlePunctuationCorrection === true,
    `${label} was not visually approved`
  );
  assert(
    typeof entry.visualReview?.notes === 'string' && entry.visualReview.notes.trim(),
    `${label}.visualReview.notes is missing`
  );
  return {
    ...entry,
    sourcePath,
    source: {
      sha256: encodedSha256,
      bytes: fileStats.size,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    }
  };
}

async function readGroup(group, originalPlan) {
  const manifestDirectory = path.join(SOURCE_ROOT, group.directory);
  const manifestPath = path.join(manifestDirectory, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert(Array.isArray(manifest.entries), `${group.id} manifest.entries must be an array`);

  const validated = [];
  for (const [index, rawEntry] of manifest.entries.entries()) {
    const label = `${group.id}.entries[${index}]`;
    assert(rawEntry && typeof rawEntry === 'object', `${label} must be an object`);
    assert(typeof rawEntry.slug === 'string' && rawEntry.slug.trim(), `${label}.slug is missing`);
    assert(typeof rawEntry.universe === 'string' && rawEntry.universe.trim(), `${label}.universe is missing`);
    const entry = await inspectSource(rawEntry, manifestDirectory, label);

    if (group.type === 'top-level') {
      const publicPath = BOOSTER_ART_BY_UNIVERSE[entry.universe];
      assert(publicPath, `${label} universe is absent from the booster catalogue`);
      assert(publicPath === `/boosters/${entry.slug}.webp`, `${label} catalogue path does not match slug`);
      if (entry.requiresTitleOverlay) {
        const overlay = TITLE_OVERLAY_BY_SLUG[entry.slug];
        assert(Boolean(overlay), `${label}: title overlay is not approved for this slug`);
        assert(entry.universe === overlay.universe, `${label}: title overlay universe is invalid`);
      }
      validated.push({ ...entry, publicPath, group: group.id, type: group.type });
      continue;
    }

    assert(typeof entry.assetId === 'string' && entry.assetId.trim(), `${label}.assetId is missing`);
    const matchingJobs = originalPlan.jobs.filter(job => job.assetId === entry.assetId);
    assert(matchingJobs.length === 1, `${label}.assetId is not unique in the v2 plan`);
    const job = matchingJobs[0];
    assert(job.category === 'booster', `${label}.assetId is not a booster job`);
    assert(job.worldKey === entry.slug, `${label}.slug does not match job.worldKey`);
    assert(job.universe === entry.universe, `${label}.universe does not match job.universe`);
    assert(job.prompt === entry.prompt, `${label}.prompt is not the exact canonical v2 job.prompt`);
    assert(job.promptSha256 === entry.promptSha256, `${label}.promptSha256 does not match the v2 plan`);
    assert(BOOSTER_ART_BY_UNIVERSE[entry.universe] === job.destination, `${label} catalogue path does not match job.destination`);
    if (entry.requiresTitlePunctuationCorrection) {
      const correction = ORIGINAL_PUNCTUATION_CORRECTION_BY_SLUG[entry.slug];
      assert(Boolean(correction), `${label}: punctuation correction is not approved for this slug`);
      assert(entry.universe === correction.universe, `${label}: punctuation correction universe is invalid`);
      assert(entry.visualReview?.approved === false, `${label}: raw Kemet source must retain its failed punctuation review`);
    }
    validated.push({
      ...entry,
      publicPath: job.destination,
      group: group.id,
      type: group.type,
      job
    });
  }

  const slugs = validated.map(entry => entry.slug).sort();
  assert(new Set(slugs).size === slugs.length, `${group.id} contains duplicate slugs`);
  if (group.expectedSlugs) {
    assert(
      JSON.stringify(slugs) === JSON.stringify([...group.expectedSlugs].sort()),
      `${group.id} does not contain its exact expected slug set`
    );
  } else {
    const expectedJobs = originalPlan.jobs.filter(job => job.category === 'booster');
    assert(validated.length === 20, `${group.id} must contain 20 booster entries`);
    assert(
      JSON.stringify(slugs) === JSON.stringify(expectedJobs.map(job => job.worldKey).sort()),
      `${group.id} does not contain the exact v2 booster world set`
    );
  }
  return validated;
}

async function replaceFileAtomically(destinationPath, buffer) {
  await mkdir(path.dirname(destinationPath), { recursive: true });
  const temporaryPath = `${destinationPath}.remediation-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, buffer, { flag: 'wx' });

  let destinationExists = false;
  try {
    destinationExists = (await stat(destinationPath)).isFile();
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  if (!destinationExists) {
    await rename(temporaryPath, destinationPath);
    return;
  }

  const backupPath = `${destinationPath}.backup-${process.pid}-${Date.now()}`;
  await rename(destinationPath, backupPath);
  try {
    await rename(temporaryPath, destinationPath);
  } catch (error) {
    await rename(backupPath, destinationPath).catch(() => {});
    throw error;
  }
  await unlink(backupPath);
}

async function installTopLevel(entry) {
  let normalizedInput = entry.sourcePath;
  if (entry.requiresTitleOverlay) {
    const overlay = TITLE_OVERLAY_BY_SLUG[entry.slug];
    assert(Boolean(overlay), `${entry.universe}: missing title overlay specification`);
    const textNodes = overlay.lines.flatMap(line => ([
      `<text x="50%" y="${line.y}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${overlay.fontSize}" font-weight="800" letter-spacing="2" fill="#000000" opacity="0.9" transform="translate(3 3)">${line.text}</text>`,
      `<text x="50%" y="${line.y}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${overlay.fontSize}" font-weight="800" letter-spacing="2" fill="#e9d6a2" stroke="#4a2f12" stroke-width="1.5">${line.text}</text>`
    ]));
    const titleOverlay = Buffer.from([
      `<svg width="${entry.source.width}" height="${entry.source.height}" xmlns="http://www.w3.org/2000/svg">`,
      ...textNodes,
      '</svg>'
    ].join(''), 'utf8');
    normalizedInput = await sharp(entry.sourcePath, { failOn: 'error' })
      .composite([{ input: titleOverlay, blend: 'over' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  }
  const output = await sharp(normalizedInput, { failOn: 'error' })
    .resize(TOP_LEVEL_OUTPUT.width, TOP_LEVEL_OUTPUT.height, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3
    })
    .webp({
      quality: TOP_LEVEL_OUTPUT.quality,
      effort: 6,
      smartSubsample: true
    })
    .toBuffer();
  assert(output.length >= 50_000 && output.length <= 800_000, `${entry.universe} WebP size is suspicious`);
  await replaceFileAtomically(repositoryPathFromPublicPath(entry.publicPath), output);
}

async function installOriginal(entry) {
  let installationSourcePath = entry.sourcePath;
  let temporarySourcePath = null;
  if (entry.requiresTitlePunctuationCorrection) {
    const correction = ORIGINAL_PUNCTUATION_CORRECTION_BY_SLUG[entry.slug];
    assert(Boolean(correction), `${entry.universe}: missing punctuation correction specification`);
    const punctuationDots = correction.dotYs.flatMap(dotY => ([
      `<circle cx="${correction.x}" cy="${dotY}" r="9" fill="#070506" opacity="0.85" transform="translate(2 2)"/>`,
      `<circle cx="${correction.x}" cy="${dotY}" r="8" fill="#d8a744" stroke="#5b310c" stroke-width="2"/>`
    ]));
    const punctuationOverlay = Buffer.from([
      `<svg width="${entry.source.width}" height="${entry.source.height}" xmlns="http://www.w3.org/2000/svg">`,
      ...punctuationDots,
      '</svg>'
    ].join(''), 'utf8');
    const correctedSource = await sharp(entry.sourcePath, { failOn: 'error' })
      .composite([{ input: punctuationOverlay, blend: 'over' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
    temporarySourcePath = `${entry.sourcePath}.punctuation-${process.pid}-${Date.now()}.png`;
    await writeFile(temporarySourcePath, correctedSource, { flag: 'wx' });
    installationSourcePath = temporarySourcePath;
  }

  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [
      INSTALL_ORIGINAL_SCRIPT,
      '--source', installationSourcePath,
      '--asset-id', entry.assetId,
      '--destination', entry.publicPath,
      '--date', entry.generatedAt,
      '--replace'
    ], {
      cwd: REPOSITORY_ROOT,
      maxBuffer: 4 * 1024 * 1024
    });
    if (stderr?.trim()) process.stderr.write(stderr);
    if (stdout?.trim()) process.stdout.write(stdout);
  } finally {
    if (temporarySourcePath) await unlink(temporarySourcePath).catch(() => {});
  }
}

async function inspectRuntime(entry) {
  const runtimePath = repositoryPathFromPublicPath(entry.publicPath);
  const [buffer, fileStats, metadata] = await Promise.all([
    readFile(runtimePath),
    stat(runtimePath),
    sharp(runtimePath, { failOn: 'error' }).metadata()
  ]);
  assert(metadata.width > 0 && metadata.height > 0, `${entry.universe} runtime dimensions are invalid`);
  assert(Math.abs((metadata.width / metadata.height) - (2 / 3)) <= 0.002, `${entry.universe} runtime is not 2:3`);
  return {
    publicPath: entry.publicPath,
    repositoryPath: path.relative(REPOSITORY_ROOT, runtimePath).split(path.sep).join('/'),
    format: metadata.format,
    sha256: sha256(buffer),
    bytes: fileStats.size,
    width: metadata.width,
    height: metadata.height
  };
}

async function writeRemediationLedger(entries) {
  const ledgerEntries = [];
  for (const entry of entries) {
    ledgerEntries.push({
      slug: entry.slug,
      universe: entry.universe,
      group: entry.group,
      generation: {
        provider: 'OpenAI',
        interface: 'built-in image_gen',
        model: 'built-in/imagegen',
        generatedAt: entry.generatedAt,
        promptSha256: entry.promptSha256,
        prompt: entry.prompt
      },
      generatedSource: entry.source,
      runtime: await inspectRuntime(entry),
      postProcessing: entry.requiresTitleOverlay
        ? {
            type: 'typographic-title-overlay',
            exactText: TITLE_OVERLAY_BY_SLUG[entry.slug].exactText,
            method: 'Sharp SVG composite before WebP normalization',
            reason: TITLE_OVERLAY_BY_SLUG[entry.slug].reason
          }
        : entry.requiresTitlePunctuationCorrection
          ? {
              type: 'typographic-punctuation-correction',
              exactText: ORIGINAL_PUNCTUATION_CORRECTION_BY_SLUG[entry.slug].exactText,
              method: 'Sharp SVG composite before PNG installation',
              reason: ORIGINAL_PUNCTUATION_CORRECTION_BY_SLUG[entry.slug].reason
            }
          : null,
      visualReview: entry.requiresTitlePunctuationCorrection
        ? {
            approved: true,
            notes: `${entry.visualReview.notes} Final remediation adds the exact required title colon without changing the OpenAI-generated scene.`
          }
        : entry.visualReview
    });
  }
  ledgerEntries.sort((left, right) => left.universe.localeCompare(right.universe, 'fr'));
  const ledger = {
    schemaVersion: 1,
    contractId: 'multiverse-breach-portal-booster-openai-remediation-v1',
    generatedAt: new Date().toISOString(),
    generator: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      model: 'built-in/imagegen',
      calls: 'one independent call per asset'
    },
    styleContract: STYLE_CONTRACT,
    counts: {
      entries: ledgerEntries.length,
      topLevel: ledgerEntries.filter(entry => entry.group !== 'original-v2').length,
      originalV2: ledgerEntries.filter(entry => entry.group === 'original-v2').length
    },
    entries: ledgerEntries
  };
  await mkdir(path.dirname(REMEDIATION_LEDGER_PATH), { recursive: true });
  await replaceFileAtomically(
    REMEDIATION_LEDGER_PATH,
    Buffer.from(`${JSON.stringify(ledger, null, 2)}\n`, 'utf8')
  );
  return ledger;
}

async function main() {
  const apply = process.argv.slice(2).includes('--apply');
  const originalPlan = JSON.parse(await readFile(PLAN_PATH, 'utf8'));
  assert(Array.isArray(originalPlan.jobs) && originalPlan.jobs.length === 500, 'Invalid original v2 plan');

  const groups = [];
  for (const group of GROUPS) groups.push(await readGroup(group, originalPlan));
  const entries = groups.flat();
  assert(entries.length === 53, `Expected 53 remediated boosters, received ${entries.length}`);
  assert(new Set(entries.map(entry => entry.universe)).size === 53, 'Remediation universes must be unique');
  assert(new Set(entries.map(entry => entry.publicPath)).size === 53, 'Remediation runtime paths must be unique');

  if (!apply) {
    console.log(JSON.stringify({ status: 'validated', apply: false, entries: entries.length }, null, 2));
    return;
  }

  for (const entry of entries.filter(candidate => candidate.type === 'top-level')) {
    await installTopLevel(entry);
  }
  for (const entry of entries.filter(candidate => candidate.type === 'original-v2')) {
    await installOriginal(entry);
  }
  await execFileAsync(process.execPath, [REFRESH_ORIGINAL_LEDGER_SCRIPT], {
    cwd: REPOSITORY_ROOT,
    maxBuffer: 16 * 1024 * 1024
  });
  const ledger = await writeRemediationLedger(entries);
  console.log(JSON.stringify({
    status: 'installed',
    entries: ledger.counts.entries,
    topLevel: ledger.counts.topLevel,
    originalV2: ledger.counts.originalV2,
    ledger: path.relative(REPOSITORY_ROOT, REMEDIATION_LEDGER_PATH).split(path.sep).join('/')
  }, null, 2));
}

main().catch(error => {
  console.error(`[install-portal-booster-remediation] ${error.message}`);
  process.exitCode = 1;
});
