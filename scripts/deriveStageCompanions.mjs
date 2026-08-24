import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repositoryRoot = process.cwd();
const publicRoot = path.join(repositoryRoot, 'public');
const promptCatalogPath = path.join(publicRoot, 'sprites', 'generated', 'openai-sprite-prompts.jsonl');
const spriteManifestPath = path.join(publicRoot, 'sprites', 'generated', 'sprite-manifest.json');
const ledgerPath = path.join(publicRoot, 'sprites', 'generated', 'openai-asset-ledger.jsonl');
const derivationManifestPath = path.join(
  repositoryRoot,
  'docs',
  'audits',
  'stage-companion-derivation-manifest.json'
);

const shouldWrite = process.argv.includes('--write');
const shouldRefresh = process.argv.includes('--refresh');
const shouldCheck = process.argv.includes('--check');
const shouldBuildReview = process.argv.includes('--review');

const sha256Buffer = value => createHash('sha256').update(value).digest('hex');
const sha256File = filePath => sha256Buffer(readFileSync(filePath));
const publicFile = publicPath => path.join(publicRoot, String(publicPath).replace(/^\/+/, ''));
const readJsonLines = filePath => readFileSync(filePath, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const promptEntries = readJsonLines(promptCatalogPath).filter(entry => entry.kind === 'stage');
const spriteManifest = JSON.parse(readFileSync(spriteManifestPath, 'utf8'));
const manifestByOutput = new Map((spriteManifest.entries || [])
  .filter(entry => entry.kind === 'stage')
  .map(entry => [entry.output, entry]));
const ledgerByOutput = new Map(readJsonLines(ledgerPath)
  .filter(entry => entry.kind === 'stage')
  .map(entry => [entry.output, entry]));

const loadDerivationManifest = () => {
  if (!existsSync(derivationManifestPath)) {
    return {
      schemaVersion: 1,
      contract: {
        'melee-backdrop.webp': '1536x864 RGB WebP; stage-cover normalization from the matching Melee primary',
        'melee-platforms.webp': '192x64 RGB WebP repeat texture; lower traversal-surface crop from the matching Melee primary',
        'tactics-tiles.webp': '128x128 RGB WebP repeat texture; central board-surface crop from the matching Tactics primary'
      },
      entries: []
    };
  }
  return JSON.parse(readFileSync(derivationManifestPath, 'utf8'));
};

const getCompanionKind = companion => {
  if (companion.endsWith('/melee-backdrop.webp')) return 'melee-backdrop';
  if (companion.endsWith('/melee-platforms.webp')) return 'melee-platforms';
  if (companion.endsWith('/tactics-tiles.webp')) return 'tactics-tiles';
  throw new Error(`Unsupported companion output: ${companion}`);
};

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

const buildMirroredRepeatTexture = async ({ sourcePath, crop, width, height }) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const base = await sharp(sourcePath)
    .extract(crop)
    .resize(halfWidth, halfHeight, { fit: 'fill', kernel: 'nearest' })
    .removeAlpha()
    .png()
    .toBuffer();
  const [horizontalMirror, verticalMirror, diagonalMirror] = await Promise.all([
    sharp(base).flop().png().toBuffer(),
    sharp(base).flip().png().toBuffer(),
    sharp(base).flip().flop().png().toBuffer()
  ]);
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#000000'
    }
  }).composite([
    { input: base, left: 0, top: 0 },
    { input: horizontalMirror, left: halfWidth, top: 0 },
    { input: verticalMirror, left: 0, top: halfHeight },
    { input: diagonalMirror, left: halfWidth, top: halfHeight }
  ]).webp({ quality: 88, effort: 5 }).toBuffer();
};

const measureRepeatSeams = async filePath => {
  const { data, info } = await sharp(filePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let horizontalDifference = 0;
  let verticalDifference = 0;
  for (let y = 0; y < info.height; y += 1) {
    const left = y * info.width * 3;
    const right = (y * info.width + info.width - 1) * 3;
    for (let channel = 0; channel < 3; channel += 1) {
      horizontalDifference += Math.abs(data[left + channel] - data[right + channel]);
    }
  }
  for (let x = 0; x < info.width; x += 1) {
    const top = x * 3;
    const bottom = ((info.height - 1) * info.width + x) * 3;
    for (let channel = 0; channel < 3; channel += 1) {
      verticalDifference += Math.abs(data[top + channel] - data[bottom + channel]);
    }
  }
  return {
    horizontalMeanAbsoluteDifference: horizontalDifference / (info.height * 3),
    verticalMeanAbsoluteDifference: verticalDifference / (info.width * 3)
  };
};

const deriveCompanion = async (sourcePath, companionKind) => {
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Unreadable source metadata: ${sourcePath}`);

  if (companionKind === 'melee-backdrop') {
    return {
      buffer: await sharp(sourcePath)
        .resize(1536, 864, { fit: 'cover', position: 'centre', kernel: 'nearest' })
        .removeAlpha()
        .webp({ quality: 88, effort: 5 })
        .toBuffer(),
      transformation: {
        operation: 'stage-cover-normalization',
        dimensions: '1536x864',
        crop: 'center-cover',
        kernel: 'nearest',
        format: 'webp',
        quality: 88
      }
    };
  }

  if (companionKind === 'melee-platforms') {
    const width = Math.max(1, Math.round(metadata.width * 0.5));
    const height = Math.max(1, Math.round(metadata.height * 0.2));
    const left = clamp(Math.round((metadata.width - width) / 2), 0, metadata.width - width);
    const top = clamp(Math.round(metadata.height * 0.68), 0, metadata.height - height);
    return {
      buffer: await buildMirroredRepeatTexture({
        sourcePath,
        crop: { left, top, width, height },
        width: 192,
        height: 64
      }),
      transformation: {
        operation: 'melee-repeat-texture-crop+mirror-wrap',
        sourceCrop: { left, top, width, height },
        dimensions: '192x64',
        kernel: 'nearest',
        seamTreatment: 'horizontal-and-vertical-mirror-wrap',
        format: 'webp',
        quality: 88
      }
    };
  }

  const size = Math.max(1, Math.min(
    Math.round(metadata.width * 0.36),
    Math.round(metadata.height * 0.46)
  ));
  const left = clamp(Math.round((metadata.width - size) / 2), 0, metadata.width - size);
  const top = clamp(Math.round((metadata.height * 0.68) - (size / 2)), 0, metadata.height - size);
  return {
    buffer: await buildMirroredRepeatTexture({
      sourcePath,
      crop: { left, top, width: size, height: size },
      width: 128,
      height: 128
    }),
    transformation: {
      operation: 'tactics-repeat-texture-crop+mirror-wrap',
      sourceCrop: { left, top, width: size, height: size },
      dimensions: '128x128',
      kernel: 'nearest',
      seamTreatment: 'horizontal-and-vertical-mirror-wrap',
      format: 'webp',
      quality: 88
    }
  };
};

const getSourceProvenance = (entry, sourceSha256) => {
  const ledgerEntry = ledgerByOutput.get(entry.output);
  if (
    ledgerEntry?.generation?.provider === 'OpenAI'
    && ledgerEntry?.generation?.interface === 'built-in image_gen'
    && ledgerEntry?.image?.sha256 === sourceSha256
  ) {
    return {
      status: 'verified-openai',
      generationId: ledgerEntry.generation.generationId
    };
  }

  const manifestEntry = manifestByOutput.get(entry.output);
  if (
    manifestEntry?.available === true
    && manifestEntry?.source === 'openai'
    && manifestEntry?.provenanceStatus === 'legacy-openai-declared'
  ) {
    return { status: 'legacy-openai-declared', generationId: null };
  }

  return { status: 'unverified', generationId: null };
};

const writeMissingCompanions = async derivationManifest => {
  const recordsByCompanion = new Map((derivationManifest.entries || [])
    .map(record => [record.companion, record]));
  const written = [];
  const refused = [];

  for (const entry of promptEntries) {
    const sourcePath = publicFile(entry.output);
    if (!existsSync(sourcePath)) continue;
    const sourceSha256 = sha256File(sourcePath);
    const provenance = getSourceProvenance(entry, sourceSha256);

    for (const companion of entry.companionOutputs || []) {
      const destinationPath = publicFile(companion);
      const isOwnedDerivative = recordsByCompanion.has(companion);
      if (existsSync(destinationPath) && !(shouldRefresh && isOwnedDerivative)) continue;
      if (provenance.status === 'unverified') {
        refused.push({ id: entry.id, source: entry.output, companion, reason: 'unverified-primary-source' });
        continue;
      }

      const companionKind = getCompanionKind(companion);
      const derived = await deriveCompanion(sourcePath, companionKind);
      mkdirSync(path.dirname(destinationPath), { recursive: true });
      writeFileSync(destinationPath, derived.buffer);
      const outputMetadata = await sharp(derived.buffer).metadata();
      const record = {
        id: entry.id,
        universe: entry.universe,
        mode: entry.frame?.mode,
        companionKind,
        source: entry.output,
        sourceSha256,
        sourceProvenanceStatus: provenance.status,
        sourceGenerationId: provenance.generationId,
        companion,
        outputSha256: sha256Buffer(derived.buffer),
        output: {
          width: outputMetadata.width,
          height: outputMetadata.height,
          format: outputMetadata.format,
          channels: outputMetadata.channels,
          bytes: derived.buffer.length
        },
        transformation: derived.transformation
      };
      recordsByCompanion.set(companion, record);
      written.push(record);
    }
  }

  const nextManifest = {
    ...derivationManifest,
    entries: [...recordsByCompanion.values()].sort((left, right) => (
      left.companion.localeCompare(right.companion, 'en')
    ))
  };
  mkdirSync(path.dirname(derivationManifestPath), { recursive: true });
  writeFileSync(derivationManifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
  return { manifest: nextManifest, written, refused };
};

const checkDerivedCompanions = async derivationManifest => {
  const issues = [];
  const verified = [];
  const outputHashes = new Map();

  for (const record of derivationManifest.entries || []) {
    const sourcePath = publicFile(record.source);
    const companionPath = publicFile(record.companion);
    if (!existsSync(sourcePath)) {
      issues.push(`${record.companion}: missing primary source ${record.source}`);
      continue;
    }
    if (!existsSync(companionPath)) {
      issues.push(`${record.companion}: missing derived output`);
      continue;
    }

    const sourceSha256 = sha256File(sourcePath);
    if (sourceSha256 !== record.sourceSha256) {
      issues.push(`${record.companion}: primary source hash drifted`);
      continue;
    }
    const expected = await deriveCompanion(sourcePath, record.companionKind);
    const expectedSha256 = sha256Buffer(expected.buffer);
    const actualSha256 = sha256File(companionPath);
    if (expectedSha256 !== actualSha256 || record.outputSha256 !== actualSha256) {
      issues.push(`${record.companion}: derived output hash does not match its primary`);
      continue;
    }

    const metadata = await sharp(companionPath).metadata();
    const expectedDimensions = record.companionKind === 'melee-backdrop'
      ? [1536, 864]
      : record.companionKind === 'melee-platforms'
        ? [192, 64]
        : [128, 128];
    if (
      metadata.width !== expectedDimensions[0]
      || metadata.height !== expectedDimensions[1]
      || metadata.format !== 'webp'
      || metadata.channels !== 3
    ) {
      issues.push(`${record.companion}: invalid dimensions or format`);
      continue;
    }
    const stats = await sharp(companionPath).stats();
    if (!Number.isFinite(stats.entropy) || stats.entropy < 1) {
      issues.push(`${record.companion}: derived output lacks material detail`);
      continue;
    }
    if (record.companionKind !== 'melee-backdrop') {
      const seams = await measureRepeatSeams(companionPath);
      if (
        seams.horizontalMeanAbsoluteDifference > 12
        || seams.verticalMeanAbsoluteDifference > 12
      ) {
        issues.push(`${record.companion}: repeat seams exceed tolerance`);
        continue;
      }
    }
    const duplicate = outputHashes.get(actualSha256);
    if (duplicate && duplicate !== record.companion) {
      issues.push(`${record.companion}: duplicates ${duplicate}`);
      continue;
    }
    outputHashes.set(actualSha256, record.companion);
    verified.push(record);
  }

  const missingActiveCompanions = [];
  for (const entry of promptEntries) {
    if (!existsSync(publicFile(entry.output))) continue;
    for (const companion of entry.companionOutputs || []) {
      if (!existsSync(publicFile(companion))) {
        missingActiveCompanions.push({ id: entry.id, source: entry.output, companion });
      }
    }
  }

  return { issues, verified, missingActiveCompanions };
};

const buildReviewSheets = async derivationManifest => {
  const reviewDir = path.join(repositoryRoot, 'tmp', 'stage-companion-review');
  mkdirSync(reviewDir, { recursive: true });
  const outputs = [];

  for (const companionKind of ['melee-backdrop', 'melee-platforms', 'tactics-tiles']) {
    const records = (derivationManifest.entries || []).filter(record => record.companionKind === companionKind);
    if (records.length === 0) continue;
    const columns = 4;
    const cellWidth = 320;
    const cellHeight = 180;
    const rows = Math.ceil(records.length / columns);
    const composites = [];
    for (let index = 0; index < records.length; index += 1) {
      const preview = await sharp(publicFile(records[index].companion))
        .resize(cellWidth - 12, cellHeight - 12, {
          fit: companionKind === 'melee-backdrop' ? 'cover' : 'contain',
          kernel: 'nearest',
          background: '#080b12'
        })
        .png()
        .toBuffer();
      composites.push({
        input: preview,
        left: (index % columns) * cellWidth + 6,
        top: Math.floor(index / columns) * cellHeight + 6
      });
    }
    const destination = path.join(reviewDir, `${companionKind}-review.webp`);
    await sharp({
      create: {
        width: columns * cellWidth,
        height: rows * cellHeight,
        channels: 3,
        background: '#151a24'
      }
    }).composite(composites).webp({ quality: 92, effort: 5 }).toFile(destination);
    outputs.push(destination);
  }
  return outputs;
};

let derivationManifest = loadDerivationManifest();
let writeResult = { written: [], refused: [] };
if (shouldWrite) {
  writeResult = await writeMissingCompanions(derivationManifest);
  derivationManifest = writeResult.manifest;
}

const checkResult = await checkDerivedCompanions(derivationManifest);
const reviewSheets = shouldBuildReview ? await buildReviewSheets(derivationManifest) : [];
const result = {
  contractEntries: derivationManifest.entries.length,
  written: writeResult.written.length,
  verified: checkResult.verified.length,
  verifiedOpenAiSources: checkResult.verified.filter(entry => entry.sourceProvenanceStatus === 'verified-openai').length,
  legacyOpenAiDeclaredSources: checkResult.verified.filter(entry => entry.sourceProvenanceStatus === 'legacy-openai-declared').length,
  refused: writeResult.refused,
  remainingMissingActiveCompanions: checkResult.missingActiveCompanions,
  reviewSheets: reviewSheets.map(filePath => path.relative(repositoryRoot, filePath).replaceAll('\\', '/')),
  issues: checkResult.issues
};

console.log(JSON.stringify(result, null, 2));
if (
  (shouldCheck || shouldWrite)
  && (result.issues.length > 0 || result.refused.length > 0 || result.remainingMissingActiveCompanions.length > 0)
) process.exitCode = 1;
