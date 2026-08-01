import assert from 'node:assert/strict';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import {
  DEFAULT_CELL_GUARD_PIXELS,
  DEFAULT_GUARD_ALPHA_THRESHOLD,
  DEFAULT_UI_ROW_GUARD_PIXELS,
  EXPECTED_WEBP_FILES,
  assertMinimumFreeSpace,
  buildJobRoot,
  buildCodexArguments,
  buildLedgerRunNamespace,
  buildReferenceDossier,
  buildWorkerPrompt,
  normalizeManifest,
  parseArguments,
  parseOutputPath,
  processUniverseCosmeticJob,
  promoteCompletePack,
  replaceCompletePack,
  resolveFailedArtifactReuse,
  resolveLeadReferencePath,
  resolveSourceMode,
  runProcess,
  selectJobs,
  validateAlphaAtlasGuards,
  validateAtlasSourceDimensions,
  validateFinalAnimationGuards,
  validateWebpPack
} from './generateUniverseCosmeticsEphemeral.mjs';

const animationFilenames = new Set([
  'portal-effects-atlas.webp',
  'ko-effects-atlas.webp',
  'intro-poses-atlas.webp',
  'victory-poses-atlas.webp'
]);

const setOpaqueRectangle = (
  data,
  width,
  x0,
  y0,
  x1,
  y1,
  color = [80, 160, 240],
  alpha = 255
) => {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = alpha;
    }
  }
};

const writeGuardedWebp = async (destination, { contaminate = false } = {}) => {
  const width = 1024;
  const height = 256;
  const data = Buffer.alloc(width * height * 4);
  for (let column = 0; column < 4; column += 1) {
    setOpaqueRectangle(data, width, column * 256 + 64, 64, column * 256 + 192, 192);
  }
  if (contaminate) setOpaqueRectangle(data, width, 256 + 3, 100, 256 + 4, 101);
  await sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true })
    .toFile(destination);
};

const writeStripWebp = async (destination, height = 256) => {
  const width = 1024;
  const data = Buffer.alloc(width * height * 4);
  setOpaqueRectangle(data, width, 96, 48, 928, height - 48);
  await sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true })
    .toFile(destination);
};

const writeTestPack = async (directory, marker) => {
  await mkdir(directory, { recursive: true });
  await Promise.all(EXPECTED_WEBP_FILES.map((filename) => {
    if (animationFilenames.has(filename)) {
      return writeGuardedWebp(path.join(directory, filename));
    }
    return writeStripWebp(
      path.join(directory, filename),
      filename === 'hud-theme.webp' ? 512 : 256
    );
  }));
  await writeFile(
    path.join(directory, 'reference-dossier.json'),
    `${JSON.stringify({ universeKey: 'Harry Potter', marker })}\n`
  );
};

const writeAlphaAtlas = async (
  destination,
  {
    contaminate = false,
    contaminateAlpha = 255,
    uiContaminate = false,
    uiContaminateAlpha = 255
  } = {}
) => {
  const width = 1024;
  const height = 1536;
  const data = Buffer.alloc(width * height * 4);
  for (let row = 2; row <= 5; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      setOpaqueRectangle(
        data,
        width,
        column * 256 + 64,
        row * 256 + 64,
        column * 256 + 192,
        row * 256 + 192
      );
    }
  }
  if (contaminate) {
    setOpaqueRectangle(
      data,
      width,
      256 + 3,
      2 * 256 + 100,
      256 + 4,
      2 * 256 + 101,
      [0, 255, 0],
      contaminateAlpha
    );
  }
  if (uiContaminate) {
    setOpaqueRectangle(
      data,
      width,
      100,
      256,
      101,
      257,
      [0, 255, 0],
      uiContaminateAlpha
    );
  }
  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(destination);
};

const writeLocalRawAtlas = async (destination) => {
  const width = 1024;
  const height = 1536;
  const data = Buffer.alloc(width * height * 3);
  for (let offset = 0; offset < data.length; offset += 3) {
    data[offset] = 0;
    data[offset + 1] = 255;
    data[offset + 2] = 0;
  }
  const paint = (x0, y0, x1, y1, color = [180, 70, 230]) => {
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const offset = (y * width + x) * 3;
        data[offset] = color[0];
        data[offset + 1] = color[1];
        data[offset + 2] = color[2];
      }
    }
  };
  paint(20, 30, 1004, 225);
  paint(24, 288, 1000, 480, [230, 90, 40]);
  for (let row = 2; row <= 5; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      paint(
        column * 256 + 48,
        row * 256 + 42,
        column * 256 + 214,
        row * 256 + 218,
        [40 + row * 25, 80 + column * 30, 220]
      );
    }
  }
  await sharp(data, { raw: { width, height, channels: 3 } }).png().toFile(destination);
};

test('Codex worker command is ephemeral, read-only, and never enables JSON streaming', () => {
  const args = buildCodexArguments('tmp/worker-last-message.txt');
  assert.deepEqual(args, [
    'exec',
    '--ephemeral',
    '--ignore-user-config',
    '--enable',
    'image_generation',
    '-c',
    'model_reasoning_effort=low',
    '-s',
    'read-only',
    '--output-last-message',
    'tmp/worker-last-message.txt',
    '-'
  ]);
  assert.equal(args.includes('--json'), false);
});

test('Codex worker attaches one approved lead reference with an absolute -i path', () => {
  const reference = 'C:\\repo\\public\\sprites\\lead.png';
  const args = buildCodexArguments('tmp/worker-last-message.txt', reference);
  assert.deepEqual(args.slice(args.indexOf('-i'), args.indexOf('-i') + 2), ['-i', reference]);
  assert.equal(args.includes('--json'), false);
  assert.throws(
    () => buildCodexArguments('tmp/message.txt', 'public/sprites/lead.png'),
    /absolute repository path/
  );
});

test('worker prompt permits exactly one built-in image generation call', () => {
  const prompt = buildWorkerPrompt({ prompt: 'EXACT ATLAS PROMPT' });
  assert.match(prompt, /exactly once/i);
  assert.match(prompt, /OUTPUT_PATH=<absolute-path>/);
  assert.match(prompt, /--- BEGIN EXACT PRODUCTION PROMPT ---\nEXACT ATLAS PROMPT\n--- END/);
});

test('worker prompt treats attached Image 1 as context-only and requests image context once', () => {
  const prompt = buildWorkerPrompt({
    prompt: 'EXACT ATLAS PROMPT',
    source: {
      leadReferencePath: 'public/sprites/lead.png',
      leadHeroName: 'Approved Lead',
      medium: 'game'
    }
  });
  assert.match(prompt, /Image 1 is an attached visual reference only, never an edit target/);
  assert.match(prompt, /num_last_images_to_include=1/);
  assert.match(prompt, /Approved Lead/);
  assert.match(prompt, /approved fictional lead/i);
});

test('worker prompt treats live-action and Thread Echo references as non-biometric', () => {
  for (const source of [
    { leadHeroName: 'Film Lead', medium: 'movie' },
    { leadHeroName: 'Anonymous Lead Thread Echo', medium: 'game' }
  ]) {
    const prompt = buildWorkerPrompt({
      prompt: 'EXACT ATLAS PROMPT',
      source: { ...source, leadReferencePath: 'public/sprites/lead.png' }
    });
    assert.match(prompt, /strictly for source-grounded role, costume, carried equipment, palette and broad silhouette/i);
    assert.match(prompt, /Never reproduce or infer its face, facial geometry, body biometrics/i);
    assert.match(prompt, /wholly original anonymous identity/i);
  }
});

test('lead references resolve inside the repository and reject traversal', () => {
  const repository = path.resolve('C:/repo');
  assert.equal(
    resolveLeadReferencePath('public/sprites/lead.png', repository),
    path.resolve(repository, 'public/sprites/lead.png')
  );
  assert.throws(
    () => resolveLeadReferencePath('../outside.png', repository),
    /stay inside the repository/
  );
});

test('OUTPUT_PATH parser accepts one plain path and rejects ambiguous output', () => {
  assert.equal(
    parseOutputPath('OUTPUT_PATH="C:\\Users\\chuck\\.codex\\generated_images\\atlas.png"\n'),
    'C:\\Users\\chuck\\.codex\\generated_images\\atlas.png'
  );
  assert.throws(
    () => parseOutputPath('OUTPUT_PATH=C:\\one.png\nOUTPUT_PATH=C:\\two.png'),
    /exactly one/
  );
});

test('OUTPUT_PATH parser reports safety sentinels and refuses relative paths', () => {
  assert.throws(
    () => parseOutputPath('OUTPUT_PATH=UNAVAILABLE_SAFETY_POLICY\n'),
    /ImageGen safety blocked: worker returned UNAVAILABLE_SAFETY_POLICY/
  );
  assert.throws(
    () => parseOutputPath('The image request was blocked by the safety policy.'),
    /ImageGen safety blocked: the ephemeral worker did not produce an image path/
  );
  assert.throws(
    () => parseOutputPath('OUTPUT_PATH=tmp/generated/atlas.png\n'),
    /must be an absolute local path/
  );
});

test('manifest normalization, universe filters, limits, and resume are deterministic', () => {
  const jobs = normalizeManifest({
    id: 'test-manifest',
    universes: [
      { universeKey: 'Ado', generationPrompt: 'prompt ado', slug: 'ado' },
      { universe: 'Halo', prompt: 'prompt halo' },
      { universeName: 'Alien', dossier: { generationPrompt: 'prompt alien' } }
    ]
  });
  const options = parseArguments([
    '--manifest=manifest.json',
    '--universe', 'halo',
    '--limit=1',
    '--concurrency', '4',
    '--resume'
  ]);
  assert.equal(options.concurrency, 4);
  assert.deepEqual(selectJobs(jobs, options, { jobs: {} }).map(job => job.slug), ['halo']);
  assert.deepEqual(
    selectJobs(jobs, { ...options, universes: ['ado'] }, { jobs: { ado: { status: 'complete' } } }),
    []
  );
  assert.throws(() => parseArguments(['--concurrency', '5']), /between 1 and 4/);
});

test('job roots are isolated by ledger path/hash even for identical attempt numbers', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-ledger-isolation-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const manifestHash = 'a'.repeat(64);
  const firstNamespace = buildLedgerRunNamespace(path.join(root, 'ledger-a.json'), manifestHash);
  const secondNamespace = buildLedgerRunNamespace(path.join(root, 'ledger-b.json'), manifestHash);
  const firstRoot = buildJobRoot({
    tempRoot: root,
    runNamespace: firstNamespace,
    slug: 'same-universe',
    attempt: 1
  });
  const secondRoot = buildJobRoot({
    tempRoot: root,
    runNamespace: secondNamespace,
    slug: 'same-universe',
    attempt: 1
  });
  assert.notEqual(firstRoot, secondRoot);
  await Promise.all([
    mkdir(firstRoot, { recursive: true }),
    mkdir(secondRoot, { recursive: true })
  ]);
  await Promise.all([
    writeFile(path.join(firstRoot, 'owner.txt'), 'ledger-a'),
    writeFile(path.join(secondRoot, 'owner.txt'), 'ledger-b')
  ]);
  const { rm } = await import('node:fs/promises');
  await rm(firstRoot, { recursive: true, force: true });
  assert.equal(await readFile(path.join(secondRoot, 'owner.txt'), 'utf8'), 'ledger-b');
});

test('replacement mode requires at least one explicit universe scope', () => {
  assert.throws(
    () => parseArguments(['--replace-existing']),
    /requires at least one explicit --universe filter/
  );
  const scoped = parseArguments([
    '--replace-existing',
    '--universe', 'Harry Potter'
  ]);
  assert.equal(scoped.replaceExisting, true);
  assert.deepEqual(scoped.universes, ['Harry Potter']);
});

test('failed-artifact reuse requires explicit universe scope', () => {
  assert.throws(
    () => parseArguments(['--reuse-failed-artifact']),
    /requires at least one explicit --universe filter/
  );
  const scoped = parseArguments([
    '--reuse-failed-artifact',
    '--universe', 'Digital Circus'
  ]);
  assert.equal(scoped.reuseFailedArtifact, true);
});

test('local input requires one explicit universe and an absolute PNG', () => {
  const absolutePng = path.resolve('C:/atlas.png');
  assert.throws(
    () => parseArguments(['--input-atlas', absolutePng]),
    /requires exactly one explicit --universe filter/
  );
  assert.throws(
    () => parseArguments([
      '--input-atlas', absolutePng,
      '--universe', 'Star Wars',
      '--universe', 'Digimon'
    ]),
    /requires exactly one explicit --universe filter/
  );
  assert.throws(
    () => parseArguments(['--input-atlas', 'relative.png', '--universe', 'Star Wars']),
    /absolute local PNG path/
  );
  assert.throws(
    () => parseArguments(['--input-atlas', path.resolve('C:/atlas.jpg'), '--universe', 'Star Wars']),
    /PNG files only/
  );
  const parsed = parseArguments([
    '--input-atlas', absolutePng,
    '--universe', 'Star Wars'
  ]);
  assert.equal(parsed.inputAtlasPath, absolutePng);
  assert.equal(resolveSourceMode(parsed), 'local-input');
});

test('selection can require approved leads and excludes web-research gaps by default', () => {
  const jobs = normalizeManifest({
    jobs: [
      {
        universe: 'Approved Lead',
        prompt: 'approved prompt',
        leadReferencePath: 'public/sprites/approved.png'
      },
      { universe: 'No Lead', prompt: 'no lead prompt', leadReferencePath: null },
      {
        universe: 'Needs Research',
        prompt: 'research placeholder prompt',
        leadReferencePath: 'public/sprites/research.png',
        needsWebResearch: true
      }
    ]
  });
  const safeOptions = parseArguments(['--require-lead-reference']);
  assert.equal(safeOptions.requireLeadReference, true);
  assert.equal(safeOptions.allowUnresearched, false);
  assert.deepEqual(
    selectJobs(jobs, safeOptions, { jobs: {} }).map(job => job.universe),
    ['Approved Lead']
  );
  const explicitOverride = parseArguments([
    '--require-lead-reference',
    '--allow-unresearched'
  ]);
  assert.deepEqual(
    selectJobs(jobs, explicitOverride, { jobs: {} }).map(job => job.universe),
    ['Approved Lead', 'Needs Research']
  );
});

test('disk guard enforces a hard five-GiB minimum', () => {
  assert.doesNotThrow(() => assertMinimumFreeSpace(5n * 1024n ** 3n));
  assert.throws(() => assertMinimumFreeSpace(5n * 1024n ** 3n - 1n), /at least 5\.00 GiB/);
});

test('animation guard defaults to 24px and cannot be configured below 12px', () => {
  const defaults = parseArguments([]);
  assert.equal(defaults.cellGuardPixels, DEFAULT_CELL_GUARD_PIXELS);
  assert.equal(defaults.guardAlphaThreshold, DEFAULT_GUARD_ALPHA_THRESHOLD);
  assert.equal(defaults.uiRowGuardPixels, DEFAULT_UI_ROW_GUARD_PIXELS);
  assert.equal(parseArguments(['--cell-guard', '12']).cellGuardPixels, 12);
  assert.equal(
    parseArguments(['--guard-alpha-threshold', '0']).guardAlphaThreshold,
    0
  );
  assert.throws(() => parseArguments(['--cell-guard', '11']), /between 12 and 64/);
  assert.throws(
    () => parseArguments(['--guard-alpha-threshold', '17']),
    /between 0 and 16/
  );
  assert.equal(parseArguments(['--ui-row-guard', '12']).uiRowGuardPixels, 12);
  assert.throws(() => parseArguments(['--ui-row-guard', '11']), /between 12 and 64/);
  assert.equal(parseArguments([]).normalizeAtlas, true);
  assert.equal(parseArguments(['--no-normalize-atlas']).normalizeAtlas, false);
});

test('dossier records the ephemeral built-in mode and exact manifest prompt', () => {
  const [job] = normalizeManifest({
    jobs: [{
      universe: 'Halo',
      prompt: 'exact halo prompt',
      rightsClass: 'third-party',
      referenceConfidence: 'high',
      officialReferenceUrls: ['https://www.halowaypoint.com/'],
      canonicalMotif: 'Halo ring surface',
      visualAnchors: ['Forerunner monolith'],
      localReferencePaths: ['public/sprites/generated/heroes/halo/master-chief.png'],
      leadReferencePath: 'public/sprites/generated/heroes/halo/master-chief.png',
      leadHeroName: 'Master Chief'
    }]
  });
  const dossier = buildReferenceDossier(job, {
    id: 'cosmetic-manifest',
    schemaVersion: 1,
    promptVersion: 'atlas-v1'
  });
  assert.equal(dossier.mode, 'built-in-imagegen-ephemeral-worker');
  assert.equal(dossier.generationPrompt, 'exact halo prompt');
  assert.deepEqual(dossier.officialReferenceUrls, ['https://www.halowaypoint.com/']);
  assert.equal(dossier.sourceManifest.id, 'cosmetic-manifest');
  assert.equal(dossier.canonicalStage, 'Halo ring surface');
  assert.equal(dossier.canonicalMotif, 'Halo ring surface');
  assert.deepEqual(dossier.visualAnchors, ['Forerunner monolith']);
  assert.equal(dossier.leadHeroName, 'Master Chief');
  assert.equal(dossier.leadReferencePath, 'public/sprites/generated/heroes/halo/master-chief.png');
  assert.deepEqual(dossier.localReferencePaths, [
    'public/sprites/generated/heroes/halo/master-chief.png'
  ]);
});

test('promotion accepts exactly seven WebPs and refuses to overwrite a pack', async (context) => {
  const stableRoot = path.join(tmpdir(), `cosmetic-promote-stable-${process.pid}-${Math.random()}`);
  await mkdir(stableRoot, { recursive: true });
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(stableRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const staging = path.join(stableRoot, 'staging');
  const destination = path.join(stableRoot, 'final', 'halo');
  await writeTestPack(staging, 'new');
  await writeFile(path.join(staging, 'reference-dossier.json'), '{"universeKey":"Halo"}\n');
  assert.deepEqual(await validateWebpPack(staging), EXPECTED_WEBP_FILES);
  await promoteCompletePack(staging, destination);
  assert.equal(JSON.parse(await readFile(path.join(destination, 'reference-dossier.json'))).universeKey, 'Halo');
  await assert.rejects(() => promoteCompletePack(staging, destination), /Refusing to overwrite/);
});

test('alpha atlas accepts guarded cells, rejects cell-edge contamination, and enforces size', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-alpha-guard-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  await mkdir(root, { recursive: true });
  const clean = path.join(root, 'clean.png');
  const contaminated = path.join(root, 'contaminated.png');
  const lowResidue = path.join(root, 'low-residue.png');
  const highResidue = path.join(root, 'high-residue.png');
  const uiContaminated = path.join(root, 'ui-contaminated.png');
  const wrongSize = path.join(root, 'wrong-size.png');
  await writeAlphaAtlas(clean);
  await writeAlphaAtlas(contaminated, { contaminate: true });
  await writeAlphaAtlas(lowResidue, { contaminate: true, contaminateAlpha: 16 });
  await writeAlphaAtlas(highResidue, { contaminate: true, contaminateAlpha: 17 });
  await writeAlphaAtlas(uiContaminated, { uiContaminate: true });
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png().toFile(wrongSize);

  await assert.doesNotReject(() => validateAtlasSourceDimensions(clean));
  await assert.doesNotReject(() => validateAlphaAtlasGuards(clean));
  await assert.doesNotReject(() => validateAlphaAtlasGuards(lowResidue));
  await assert.rejects(
    () => validateAlphaAtlasGuards(highResidue),
    /alpha=17; allowed chroma residue <=16/
  );
  await assert.rejects(
    () => validateAlphaAtlasGuards(uiContaminated),
    /UI row guard violation in row 1, top edge at \(100,256\)/
  );
  await assert.rejects(
    () => validateAlphaAtlasGuards(contaminated),
    /transparent cell guard violation in row 2, column 1, left edge/
  );
  await assert.rejects(
    () => validateAtlasSourceDimensions(wrongSize),
    /expected exactly 1024x1536/
  );
});

test('failed artifact reuse accepts only a retained alpha from a failed ledger job', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-reuse-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const [job] = normalizeManifest({
    jobs: [{ universe: 'Digital Circus', prompt: 'exact retained prompt' }]
  });
  const alphaPath = path.join(root, job.slug, 'attempt-1', 'atlas-alpha.png');
  await mkdir(path.dirname(alphaPath), { recursive: true });
  await writeAlphaAtlas(alphaPath);
  const contextResult = await resolveFailedArtifactReuse({
    job,
    tempRoot: root,
    ledgerJob: { status: 'failed', attempts: 1, tempRoot: root }
  });
  assert.equal(contextResult.attempt, 1);
  assert.equal(contextResult.alphaPath, alphaPath);
  await assert.rejects(
    () => resolveFailedArtifactReuse({
      job,
      tempRoot: root,
      ledgerJob: { status: 'complete', attempts: 1, tempRoot: root }
    }),
    /requires ledger status failed/
  );
  await assert.rejects(
    () => resolveFailedArtifactReuse({
      job: { ...job, slug: 'missing-artifact' },
      tempRoot: root,
      ledgerJob: { status: 'failed', attempts: 1, tempRoot: root }
    }),
    /retained failed alpha source is unavailable/
  );
});

test('local input bypasses the Codex worker, validates, promotes, and preserves external raw', {
  timeout: 30_000
}, async (context) => {
  const root = path.join(tmpdir(), `cosmetic-local-input-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  await mkdir(root, { recursive: true });
  const externalRaw = path.join(root, 'external-star-wars.png');
  const tempRoot = path.join(root, 'work');
  const runtimeRoot = path.join(root, 'runtime');
  await writeLocalRawAtlas(externalRaw);
  const rawBefore = await readFile(externalRaw);
  const [job] = normalizeManifest({
    jobs: [{
      universe: 'Star Wars',
      prompt: 'exact local-input Star Wars cosmetic prompt',
      rightsClass: 'third-party',
      officialReferenceUrls: ['https://www.starwars.com/']
    }]
  });
  let codexWorkerCalls = 0;
  const guardedRunner = async (request) => {
    if (request.command === 'NEVER_CALL_CODEX') {
      codexWorkerCalls += 1;
      throw new Error('Codex worker must not run for local input');
    }
    return runProcess(request);
  };
  const chromaHelperPath = path.join(
    process.env.CODEX_HOME || path.join(process.env.USERPROFILE, '.codex'),
    'skills',
    '.system',
    'imagegen',
    'scripts',
    'remove_chroma_key.py'
  );
  const result = await processUniverseCosmeticJob({
    job,
    attempt: 1,
    tempRoot,
    manifestMeta: { id: 'local-input-test', schemaVersion: 1 },
    codexExecutable: 'NEVER_CALL_CODEX',
    pythonExecutable: 'python',
    chromaHelperPath,
    replaceExisting: false,
    cellGuardPixels: 24,
    guardAlphaThreshold: 16,
    uiRowGuardPixels: 12,
    reuseContext: null,
    runNamespace: 'b'.repeat(16),
    normalizeAtlas: true,
    inputAtlasPath: externalRaw,
    runtimeRoot,
    processRunner: guardedRunner,
    systemDiskGuard: async () => {}
  });
  assert.equal(result.status, 'complete');
  assert.equal(codexWorkerCalls, 0);
  assert.equal((await readFile(externalRaw)).equals(rawBefore), true);
  const destination = path.join(runtimeRoot, 'star-wars');
  assert.deepEqual(await validateWebpPack(destination), EXPECTED_WEBP_FILES);
  await assert.doesNotReject(() => validateFinalAnimationGuards(destination));
  await assert.rejects(() => access(buildJobRoot({
    tempRoot,
    runNamespace: 'b'.repeat(16),
    slug: 'star-wars',
    attempt: 1
  })));
});

test('final animation guard blocks promotion before a runtime directory appears', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-promotion-guard-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const staging = path.join(root, 'staging');
  const destination = path.join(root, 'runtime', 'blocked');
  await writeTestPack(staging, 'contaminated');
  await writeGuardedWebp(
    path.join(staging, 'ko-effects-atlas.webp'),
    { contaminate: true }
  );
  await assert.rejects(
    () => validateFinalAnimationGuards(staging),
    /ko-effects-atlas\.webp: transparent cell guard violation/
  );
  await assert.rejects(
    () => promoteCompletePack(staging, destination),
    /transparent cell guard violation/
  );
  await assert.rejects(() => access(destination));
});

test('scoped replacement installs a complete pack and preserves the old pack backup', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-replace-success-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const staging = path.join(root, 'staging');
  const destination = path.join(root, 'runtime', 'harry-potter');
  const backups = path.join(root, 'backups');
  await writeTestPack(staging, 'new');
  await writeTestPack(destination, 'old');

  const { backupDirectory } = await replaceCompletePack(
    staging,
    destination,
    backups,
    { now: new Date('2026-08-01T12:34:56.789Z') }
  );
  assert.equal(
    JSON.parse(await readFile(path.join(destination, 'reference-dossier.json'))).marker,
    'new'
  );
  assert.equal(
    JSON.parse(await readFile(path.join(backupDirectory, 'reference-dossier.json'))).marker,
    'old'
  );
  assert.match(backupDirectory, /harry-potter-20260801T123456789Z$/);
});

test('failed replacement restores the previous runtime pack intact', async (context) => {
  const root = path.join(tmpdir(), `cosmetic-replace-failure-${process.pid}-${Math.random()}`);
  context.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  });
  const staging = path.join(root, 'staging');
  const destination = path.join(root, 'runtime', 'harry-potter');
  const backups = path.join(root, 'backups');
  await writeTestPack(staging, 'new');
  await writeTestPack(destination, 'old');
  let renameCount = 0;
  const { rename } = await import('node:fs/promises');
  const failInstallRename = async (source, target) => {
    renameCount += 1;
    if (renameCount === 2) throw new Error('simulated install failure');
    await rename(source, target);
  };

  await assert.rejects(
    () => replaceCompletePack(staging, destination, backups, {
      renameDirectory: failInstallRename,
      now: new Date('2026-08-01T12:35:00.000Z')
    }),
    /simulated install failure/
  );
  assert.equal(
    JSON.parse(await readFile(path.join(destination, 'reference-dossier.json'))).marker,
    'old'
  );
  assert.equal(
    JSON.parse(await readFile(path.join(
      backups,
      'harry-potter-20260801T123500000Z',
      'reference-dossier.json'
    ))).marker,
    'old'
  );
});
