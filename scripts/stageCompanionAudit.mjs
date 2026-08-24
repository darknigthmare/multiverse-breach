import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repositoryRoot = process.cwd();
const promptCatalogPath = path.join(
  repositoryRoot,
  'public',
  'sprites',
  'generated',
  'openai-sprite-prompts.jsonl'
);
const ledgerPath = path.join(
  repositoryRoot,
  'public',
  'sprites',
  'generated',
  'openai-asset-ledger.jsonl'
);

const resolvePublicPath = publicPath => path.join(
  repositoryRoot,
  'public',
  String(publicPath).replace(/^\/+/, '')
);

const sha256 = filePath => createHash('sha256')
  .update(readFileSync(filePath))
  .digest('hex');

const stageEntries = readFileSync(promptCatalogPath, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line))
  .filter(entry => entry.kind === 'stage');
const provenanceByOutput = new Map(readFileSync(ledgerPath, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line))
  .filter(entry => entry.kind === 'stage')
  .map(entry => [entry.output, entry]));

const missing = [];

for (const entry of stageEntries) {
  const sourcePath = resolvePublicPath(entry.output);
  if (!existsSync(sourcePath)) continue;

  for (const companion of entry.companionOutputs || []) {
    const companionPath = resolvePublicPath(companion);
    if (existsSync(companionPath)) continue;

    const metadata = await sharp(sourcePath).metadata();
    const sourceSha256 = sha256(sourcePath);
    const provenance = provenanceByOutput.get(entry.output);
    missing.push({
      id: entry.id,
      universe: entry.universe,
      mode: entry.frame?.mode,
      source: entry.output,
      sourceMetadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        sha256: sourceSha256
      },
      verifiedOpenAiSource: Boolean(
        provenance
        && provenance.generation?.provider === 'OpenAI'
        && provenance.generation?.interface === 'built-in image_gen'
        && provenance.image?.sha256 === sourceSha256
      ),
      generationId: provenance?.generation?.generationId || null,
      companion
    });
  }
}

console.log(JSON.stringify({
  activeStageAssets: stageEntries.filter(entry => existsSync(resolvePublicPath(entry.output))).length,
  missingCompanions: missing.length,
  missing
}, null, 2));
if (missing.length > 0) process.exitCode = 1;
