import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';

const execFileAsync = promisify(execFile);
const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const PLAN_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-plan.json'
);
const PLAN_BUILDER_PATH = path.join(
  REPOSITORY_ROOT,
  'scripts',
  'buildOriginalUniverseImagePlan.mjs'
);
const LEDGER_ENTRIES_PATH = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-ledger',
  'entries'
);
const MANIFEST_REPOSITORY_PATH = 'src/game/originalUniversesManifest.json';
const EXPECTED_PLAN_ID = 'multiverse-breach-original-universes-openai-image-v2';
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_INFLATED_IMAGE_BYTES = 256 * 1024 * 1024;
const EXPECTED_CONTRACT = Object.freeze({
  version: 'v2',
  format: 'PNG',
  provider: 'OpenAI',
  interface: 'built-in image_gen',
  model: 'built-in/imagegen',
  planId: EXPECTED_PLAN_ID
});
const EXPECTED_CATEGORY_COUNTS = Object.freeze({
  booster: 20,
  backdrop: 20,
  stage: 60,
  hero: 60,
  enemy: 100,
  boss: 60,
  worldBoss: 20,
  gear: 60,
  battleItem: 100
});
const EXPECTED_ASPECT_RATIOS = Object.freeze({
  booster: '2:3',
  backdrop: '16:9',
  stage: '16:9',
  hero: '3:4',
  enemy: '3:4',
  boss: '3:4',
  worldBoss: '3:4',
  gear: '1:1',
  battleItem: '1:1'
});
const EXPECTED_IMAGE_GEOMETRY = Object.freeze({
  booster: { ratio: 2 / 3, minimumWidth: 900, minimumHeight: 1300 },
  backdrop: { ratio: 16 / 9, minimumWidth: 1500, minimumHeight: 800 },
  stage: { ratio: 16 / 9, minimumWidth: 1500, minimumHeight: 800 },
  hero: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  enemy: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  boss: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  worldBoss: { ratio: 3 / 4, minimumWidth: 1000, minimumHeight: 1300 },
  gear: { ratio: 1, minimumWidth: 1200, minimumHeight: 1200 },
  battleItem: { ratio: 1, minimumWidth: 1200, minimumHeight: 1200 }
});
const ASPECT_RATIO_TOLERANCE = 0.002;
const V2_ASSET_ROOTS = Object.freeze([
  path.join(REPOSITORY_ROOT, 'public', 'boosters', 'original-worlds', 'v2'),
  path.join(REPOSITORY_ROOT, 'public', 'images', 'oc-worlds', 'v2')
]);

const errors = [];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function checkEqual(actual, expected, label) {
  check(actual === expected, `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}

function checkArrayEqual(actual, expected, label) {
  check(
    Array.isArray(actual) && JSON.stringify(actual) === JSON.stringify(expected),
    `${label} does not exactly match the generation plan`
  );
}

function checkUnique(values, label, expectedCount = values.length) {
  check(values.length === expectedCount, `${label}: expected ${expectedCount}, received ${values.length}`);
  check(new Set(values).size === values.length, `${label} must be unique`);
}

function isCanonicalIsoDate(value) {
  if (typeof value !== 'string') return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function repositoryPathToAbsolute(repositoryPath, label) {
  if (
    typeof repositoryPath !== 'string'
    || !repositoryPath.startsWith('public/')
    || repositoryPath.includes('\\')
    || repositoryPath.split('/').includes('..')
  ) {
    errors.push(`${label} is not a safe repository-relative public path`);
    return null;
  }

  const absolutePath = path.resolve(REPOSITORY_ROOT, ...repositoryPath.split('/'));
  const relative = path.relative(REPOSITORY_ROOT, absolutePath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    errors.push(`${label} resolves outside the repository`);
    return null;
  }
  return absolutePath;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function inspectPng(buffer, label) {
  if (buffer.length < 45 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} does not have a valid PNG signature`);
  }

  let offset = PNG_SIGNATURE.length;
  let header = null;
  let foundEnd = false;
  let chunkIndex = 0;
  const imageDataChunks = [];

  while (offset + 12 <= buffer.length) {
    const dataLength = buffer.readUInt32BE(offset);
    const typeBuffer = buffer.subarray(offset + 4, offset + 8);
    const type = typeBuffer.toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + dataLength;
    const chunkEnd = dataEnd + 4;
    if (chunkEnd > buffer.length) {
      throw new Error(`${label} has a ${type || 'unknown'} chunk outside file bounds`);
    }

    const expectedCrc = buffer.readUInt32BE(dataEnd);
    const actualCrc = crc32(Buffer.concat([typeBuffer, buffer.subarray(dataStart, dataEnd)]));
    if (actualCrc !== expectedCrc) {
      throw new Error(`${label} has an invalid ${type} CRC`);
    }

    if (chunkIndex === 0) {
      if (type !== 'IHDR' || dataLength !== 13) {
        throw new Error(`${label} must start with a 13-byte IHDR`);
      }
      header = {
        width: buffer.readUInt32BE(dataStart),
        height: buffer.readUInt32BE(dataStart + 4),
        bitDepth: buffer[dataStart + 8],
        colorType: buffer[dataStart + 9]
      };
      if (header.width < 1 || header.height < 1) {
        throw new Error(`${label} has invalid dimensions`);
      }
    }

    if (type === 'IDAT') {
      imageDataChunks.push(buffer.subarray(dataStart, dataEnd));
    }

    offset = chunkEnd;
    chunkIndex += 1;
    if (type === 'IEND') {
      if (dataLength !== 0 || offset !== buffer.length) {
        throw new Error(`${label} must end with one empty IEND chunk`);
      }
      foundEnd = true;
      break;
    }
  }

  if (!header || !foundEnd || imageDataChunks.length === 0) {
    throw new Error(`${label} is missing IHDR, IDAT or final IEND data`);
  }

  const inflated = inflateSync(Buffer.concat(imageDataChunks), {
    maxOutputLength: MAX_INFLATED_IMAGE_BYTES
  });
  if (inflated.length === 0) {
    throw new Error(`${label} has an empty decoded IDAT stream`);
  }

  return {
    ...header,
    decodedDataSha256: sha256(inflated)
  };
}

function collectRuntimeAssets() {
  const assets = [];
  const add = (definition, category, destination) => {
    assets.push({
      worldKey: definition.key,
      universe: definition.universe,
      category,
      destination
    });
  };

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    check(
      JSON.stringify(definition.audiovisual.imageContract) === JSON.stringify(EXPECTED_CONTRACT),
      `${definition.key}.audiovisual.imageContract does not declare the PNG v2 OpenAI Image contract`
    );
    add(definition, 'booster', definition.audiovisual.boosterSourceArt);
    add(definition, 'backdrop', definition.audiovisual.backdrop);
    definition.stages.forEach(stage => {
      add(
        definition,
        'stage',
        definition.audiovisual.stageCards[stage.stageKey || stage.id]
      );
    });
    definition.heroes.forEach(hero => {
      add(definition, 'hero', definition.audiovisual.heroPortraits[hero.id]);
    });
    definition.enemies.forEach(enemy => {
      add(definition, 'enemy', definition.audiovisual.threatPortraits[enemy.name]);
    });
    definition.bosses.forEach(boss => {
      add(definition, 'boss', definition.audiovisual.threatPortraits[boss.name]);
    });
    add(
      definition,
      'worldBoss',
      definition.audiovisual.threatPortraits[definition.worldBoss.name]
    );
    definition.gear.forEach(item => {
      add(definition, 'gear', definition.audiovisual.itemIcons[item.id]);
    });
    definition.battleItems.forEach(item => {
      add(definition, 'battleItem', definition.audiovisual.itemIcons[item.id]);
    });
  });

  return assets;
}

async function listRepositoryFiles(rootPath) {
  const files = [];

  async function visit(directory) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else {
        files.push(path.relative(REPOSITORY_ROOT, entryPath).split(path.sep).join('/'));
      }
    }
  }

  await visit(rootPath);
  return files;
}

function summarize(values, limit = 8) {
  const visible = values.slice(0, limit);
  const suffix = values.length > limit ? ` (+${values.length - limit} more)` : '';
  return `${visible.join(', ')}${suffix}`;
}

async function validateDeterministicPlan() {
  try {
    await execFileAsync(process.execPath, [PLAN_BUILDER_PATH, '--check'], {
      cwd: REPOSITORY_ROOT,
      maxBuffer: 4 * 1024 * 1024
    });
  } catch (error) {
    const detail = error?.stderr?.trim() || error?.stdout?.trim() || error.message;
    errors.push(`deterministic plan check failed: ${detail}`);
  }
}

async function readLedgerDirectory() {
  try {
    return await readdir(LEDGER_ENTRIES_PATH, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      errors.push('provenance ledger entries directory is missing');
      return [];
    }
    throw error;
  }
}

async function main() {
  await validateDeterministicPlan();

  const planSource = await readFile(PLAN_PATH, 'utf8');
  const planSha256 = sha256(planSource);
  const plan = JSON.parse(planSource);
  const manifestPath = path.join(REPOSITORY_ROOT, ...MANIFEST_REPOSITORY_PATH.split('/'));
  const manifestSource = await readFile(manifestPath);
  const manifest = JSON.parse(manifestSource.toString('utf8'));

  checkEqual(plan.schemaVersion, 1, 'plan.schemaVersion');
  checkEqual(plan.planId, EXPECTED_PLAN_ID, 'plan.planId');
  checkEqual(plan.deterministic, true, 'plan.deterministic');
  checkEqual(plan.generator?.provider, 'OpenAI', 'plan.generator.provider');
  checkEqual(plan.generator?.interface, 'built-in image_gen', 'plan.generator.interface');
  checkEqual(plan.generator?.model, 'built-in/imagegen', 'plan.generator.model');
  checkEqual(plan.source?.manifest, MANIFEST_REPOSITORY_PATH, 'plan.source.manifest');
  checkEqual(plan.source?.manifestSha256, sha256(manifestSource), 'plan.source.manifestSha256');
  checkEqual(plan.counts?.worlds, 20, 'plan.counts.worlds');
  checkEqual(plan.counts?.jobs, 500, 'plan.counts.jobs');

  const jobs = Array.isArray(plan.jobs) ? plan.jobs : [];
  checkEqual(jobs.length, 500, 'plan.jobs.length');
  checkUnique(jobs.map(job => job.assetId), 'plan asset IDs', 500);
  checkUnique(jobs.map(job => job.destination), 'plan destinations', 500);
  checkUnique(jobs.map(job => job.repositoryPath), 'plan repository paths', 500);
  checkUnique(jobs.map(job => job.prompt), 'plan prompts', 500);
  checkUnique(jobs.map(job => job.promptSha256), 'plan prompt hashes', 500);

  Object.entries(EXPECTED_CATEGORY_COUNTS).forEach(([category, expectedCount]) => {
    const actualCount = jobs.filter(job => job.category === category).length;
    checkEqual(actualCount, expectedCount, `plan category ${category}`);
    checkEqual(plan.counts?.byCategory?.[category], expectedCount, `plan.counts.byCategory.${category}`);
  });

  const worldCounts = new Map();
  jobs.forEach(job => {
    worldCounts.set(job.worldKey, (worldCounts.get(job.worldKey) || 0) + 1);
    checkEqual(job.format, 'PNG', `${job.assetId}.format`);
    checkEqual(job.generator, 'OpenAI built-in image_gen', `${job.assetId}.generator`);
    checkEqual(job.model, 'built-in/imagegen', `${job.assetId}.model`);
    checkEqual(job.aspectRatio, EXPECTED_ASPECT_RATIOS[job.category], `${job.assetId}.aspectRatio`);
    checkEqual(sha256(job.prompt || ''), job.promptSha256, `${job.assetId}.promptSha256`);
    check(
      typeof job.destination === 'string'
      && job.destination.startsWith('/')
      && job.destination.endsWith('.png')
      && !job.destination.includes('\\')
      && !job.destination.split('/').includes('..'),
      `${job.assetId}.destination is not a safe PNG public path`
    );
    checkEqual(job.repositoryPath, `public${job.destination}`, `${job.assetId}.repositoryPath`);
    repositoryPathToAbsolute(job.repositoryPath, `${job.assetId}.repositoryPath`);
  });
  checkEqual(worldCounts.size, 20, 'distinct plan worlds');
  for (const [worldKey, count] of worldCounts) {
    checkEqual(count, 25, `${worldKey} plan job count`);
  }

  const manifestWorlds = Array.isArray(manifest.universes) ? manifest.universes : [];
  const manifestByKey = new Map(
    manifestWorlds.map((world, index) => [world.key, { world, index }])
  );
  const sensitiveWorldKeys = new Set();
  const referencedSensitivityNotes = new Set();
  let sensitiveJobCount = 0;

  jobs.forEach(job => {
    const manifestEntry = manifestByKey.get(job.worldKey);
    check(Boolean(manifestEntry), `${job.assetId} references an unknown manifest world`);
    if (!manifestEntry) return;

    const notes = Array.isArray(manifestEntry.world.sensitivityNotes)
      ? manifestEntry.world.sensitivityNotes
      : [];
    const expectedPointers = notes.map(
      (_, noteIndex) => `/universes/${manifestEntry.index}/sensitivityNotes/${noteIndex}`
    );
    const actualPointers = (Array.isArray(job.loreReferences) ? job.loreReferences : [])
      .filter(reference => /\/sensitivityNotes\/\d+$/.test(reference));
    checkArrayEqual(actualPointers, expectedPointers, `${job.assetId}.sensitivity lore references`);
    notes.forEach((note, noteIndex) => {
      const pointer = expectedPointers[noteIndex];
      check((job.prompt || '').includes(note), `${job.assetId}.prompt omits sensitivity note ${pointer}`);
      referencedSensitivityNotes.add(pointer);
    });
    check(
      (job.prompt || '').includes('not a claim that human consultation has occurred'),
      `${job.assetId}.prompt omits the no-false-consultation guardrail`
    );
    if (notes.length > 0) {
      sensitiveJobCount += 1;
      sensitiveWorldKeys.add(job.worldKey);
    }
  });
  checkEqual(sensitiveWorldKeys.size, 15, 'sensitive world count');
  checkEqual(sensitiveJobCount, 375, 'jobs carrying sensitivity notes');
  checkEqual(referencedSensitivityNotes.size, 38, 'distinct sensitivity note pointers');

  const runtimeAssets = collectRuntimeAssets();
  checkEqual(runtimeAssets.length, 500, 'runtime audiovisual asset count');
  checkUnique(runtimeAssets.map(asset => asset.destination), 'runtime audiovisual destinations', 500);
  check(
    runtimeAssets.every(asset => (
      typeof asset.destination === 'string'
      && asset.destination.endsWith('.png')
      && !asset.destination.endsWith('.svg')
    )),
    'runtime audiovisual contract still contains a non-PNG or legacy SVG path'
  );

  const runtimeByDestination = new Map(
    runtimeAssets.map(asset => [asset.destination, asset])
  );
  const planDestinations = new Set(jobs.map(job => job.destination));
  const runtimeDestinations = new Set(runtimeByDestination.keys());
  const absentFromRuntime = [...planDestinations].filter(value => !runtimeDestinations.has(value));
  const absentFromPlan = [...runtimeDestinations].filter(value => !planDestinations.has(value));
  check(
    absentFromRuntime.length === 0,
    `plan destinations absent from runtime: ${summarize(absentFromRuntime)}`
  );
  check(
    absentFromPlan.length === 0,
    `runtime destinations absent from plan: ${summarize(absentFromPlan)}`
  );
  jobs.forEach(job => {
    const runtimeAsset = runtimeByDestination.get(job.destination);
    if (!runtimeAsset) return;
    checkEqual(job.worldKey, runtimeAsset.worldKey, `${job.assetId}.runtime worldKey`);
    checkEqual(job.universe, runtimeAsset.universe, `${job.assetId}.runtime universe`);
    checkEqual(job.category, runtimeAsset.category, `${job.assetId}.runtime category`);
  });

  const expectedRepositoryPaths = new Set(jobs.map(job => job.repositoryPath));
  const actualV2Files = (
    await Promise.all(V2_ASSET_ROOTS.map(listRepositoryFiles))
  ).flat();
  const unexpectedV2Files = actualV2Files.filter(file => !expectedRepositoryPaths.has(file));
  check(
    unexpectedV2Files.length === 0,
    `unexpected files under PNG v2 roots: ${summarize(unexpectedV2Files)}`
  );

  const imageInfoByAssetId = new Map();
  const missingImages = [];
  for (const job of jobs) {
    const absolutePath = repositoryPathToAbsolute(
      job.repositoryPath,
      `${job.assetId}.repositoryPath`
    );
    if (!absolutePath) continue;
    try {
      const imageBuffer = await readFile(absolutePath);
      const png = inspectPng(imageBuffer, job.repositoryPath);
      imageInfoByAssetId.set(job.assetId, {
        buffer: imageBuffer,
        sha256: sha256(imageBuffer),
        bytes: imageBuffer.length,
        ...png
      });
      const geometry = EXPECTED_IMAGE_GEOMETRY[job.category];
      check(Boolean(geometry), `${job.assetId} has no image geometry contract`);
      if (geometry) {
        const actualRatio = png.width / png.height;
        check(
          png.width >= geometry.minimumWidth && png.height >= geometry.minimumHeight,
          `${job.repositoryPath} is undersized for ${job.category}: ${png.width}x${png.height}`
        );
        check(
          Math.abs(actualRatio - geometry.ratio) <= ASPECT_RATIO_TOLERANCE,
          `${job.repositoryPath} has the wrong ${job.category} aspect ratio: ${png.width}x${png.height}`
        );
      }
    } catch (error) {
      if (error?.code === 'ENOENT') {
        missingImages.push(job.repositoryPath);
      } else {
        errors.push(error.message);
      }
    }
  }
  check(
    missingImages.length === 0,
    `missing PNG v2 files (${missingImages.length}): ${summarize(missingImages)}`
  );
  const imageInfos = [...imageInfoByAssetId.values()];
  check(
    new Set(imageInfos.map(image => image.sha256)).size === imageInfos.length,
    'installed PNG files must have distinct encoded SHA-256 hashes'
  );
  check(
    new Set(imageInfos.map(image => image.decodedDataSha256)).size === imageInfos.length,
    'installed PNG files must have distinct decoded IDAT stream hashes'
  );

  const ledgerDirectoryEntries = await readLedgerDirectory();
  const ledgerFileEntries = ledgerDirectoryEntries.filter(entry => (
    entry.isFile() && entry.name.endsWith('.json')
  ));
  const ledgerFileNames = new Set(ledgerFileEntries.map(entry => entry.name));
  const expectedLedgerNames = new Set(
    jobs.map(job => `${sha256(job.assetId)}.json`)
  );
  const missingLedgerNames = [...expectedLedgerNames].filter(name => !ledgerFileNames.has(name));
  const unexpectedLedgerEntries = ledgerDirectoryEntries
    .map(entry => entry.name)
    .filter(name => !expectedLedgerNames.has(name));
  checkEqual(ledgerFileEntries.length, 500, 'provenance ledger JSON file count');
  check(
    missingLedgerNames.length === 0,
    `missing provenance sidecars (${missingLedgerNames.length}): ${summarize(missingLedgerNames)}`
  );
  check(
    unexpectedLedgerEntries.length === 0,
    `unexpected provenance ledger entries: ${summarize(unexpectedLedgerEntries)}`
  );

  for (const job of jobs) {
    const ledgerName = `${sha256(job.assetId)}.json`;
    if (!ledgerFileNames.has(ledgerName)) continue;

    let ledger;
    try {
      ledger = JSON.parse(await readFile(path.join(LEDGER_ENTRIES_PATH, ledgerName), 'utf8'));
    } catch (error) {
      errors.push(`${ledgerName} is not valid JSON: ${error.message}`);
      continue;
    }

    const label = `ledger ${job.assetId}`;
    checkEqual(ledger.schemaVersion, 1, `${label}.schemaVersion`);
    ['assetId', 'worldKey', 'universe', 'category', 'entityName', 'destination', 'repositoryPath']
      .forEach(field => checkEqual(ledger[field], job[field], `${label}.${field}`));
    checkEqual(ledger.generation?.provider, 'OpenAI', `${label}.generation.provider`);
    checkEqual(
      ledger.generation?.interface,
      'built-in image_gen',
      `${label}.generation.interface`
    );
    checkEqual(
      ledger.generation?.model,
      'built-in/imagegen',
      `${label}.generation.model`
    );
    checkEqual(
      ledger.generation?.promptSha256,
      job.promptSha256,
      `${label}.generation.promptSha256`
    );
    check(
      isCanonicalIsoDate(ledger.generation?.date),
      `${label}.generation.date must be canonical ISO-8601`
    );
    checkEqual(
      ledger.lore?.sourceManifest,
      plan.source.manifest,
      `${label}.lore.sourceManifest`
    );
    checkEqual(
      ledger.lore?.sourceManifestSha256,
      plan.source.manifestSha256,
      `${label}.lore.sourceManifestSha256`
    );
    checkArrayEqual(ledger.lore?.references, job.loreReferences, `${label}.lore.references`);
    checkEqual(ledger.plan?.id, EXPECTED_PLAN_ID, `${label}.plan.id`);
    checkEqual(ledger.plan?.sha256, planSha256, `${label}.plan.sha256`);
    check(isCanonicalIsoDate(ledger.installedAt), `${label}.installedAt must be canonical ISO-8601`);
    checkEqual(ledger.image?.format, 'PNG', `${label}.image.format`);
    check(
      typeof ledger.image?.sourceFileName === 'string'
      && ledger.image.sourceFileName.trim().length > 0,
      `${label}.image.sourceFileName must be recorded`
    );

    const image = imageInfoByAssetId.get(job.assetId);
    if (!image) continue;
    checkEqual(ledger.image?.sha256, image.sha256, `${label}.image.sha256`);
    checkEqual(ledger.image?.bytes, image.bytes, `${label}.image.bytes`);
    checkEqual(ledger.image?.width, image.width, `${label}.image.width`);
    checkEqual(ledger.image?.height, image.height, `${label}.image.height`);
    checkEqual(ledger.image?.bitDepth, image.bitDepth, `${label}.image.bitDepth`);
    checkEqual(ledger.image?.colorType, image.colorType, `${label}.image.colorType`);
  }

  if (errors.length > 0) {
    console.error(`[original-universe-image-v2-audit] FAIL (${errors.length} issue(s))`);
    errors.slice(0, 60).forEach(error => console.error(`- ${error}`));
    if (errors.length > 60) {
      console.error(`- ... ${errors.length - 60} additional issue(s) omitted`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    '[original-universe-image-v2-audit] OK: 500 distinct PNG v2 assets, '
    + '500 OpenAI Image provenance sidecars, exact runtime/plan parity, '
    + '38 sensitivity notes across 375 jobs.'
  );
}

main().catch(error => {
  console.error(`[original-universe-image-v2-audit] ${error.stack || error.message}`);
  process.exitCode = 1;
});
