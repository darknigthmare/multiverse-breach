import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const generatedRoot = path.join(root, 'public', 'sprites', 'generated');
const promptsPath = path.join(generatedRoot, 'openai-sprite-prompts.jsonl');
const ledgerPath = path.join(generatedRoot, 'openai-asset-ledger.jsonl');

const readJsonl = file => readFileSync(file, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const sha256 = value => createHash('sha256').update(value).digest('hex');
const publicFile = publicPath => path.join(root, 'public', publicPath.replace(/^\/+/, ''));
const keyOf = entry => `${entry.kind}:${entry.id}`;

const assertSheetCells = async (file, label, issues) => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      let opaquePixels = 0;
      let guardPixels = 0;
      for (let y = 0; y < 256; y += 1) {
        for (let x = 0; x < 256; x += 1) {
          const alpha = data[(((row * 256 + y) * info.width) + column * 256 + x) * 4 + 3];
          if (alpha > 12) opaquePixels += 1;
          if (alpha > 12 && (x < 12 || x >= 244 || y < 12 || y >= 244)) guardPixels += 1;
        }
      }
      if (opaquePixels < 64) issues.push(`${label}: empty sprite cell ${row * 4 + column}`);
      if (guardPixels > 0) issues.push(`${label}: sprite cell ${row * 4 + column} violates the 12 px guard`);
    }
  }
};

const main = async () => {
  if (!existsSync(ledgerPath)) throw new Error('Missing OpenAI asset provenance ledger');
  const prompts = readJsonl(promptsPath);
  const ledger = readJsonl(ledgerPath);
  const promptsByKey = new Map(prompts.map(entry => [keyOf(entry), entry]));
  const seen = new Set();
  const issues = [];
  let generationPromptsRecorded = 0;

  for (const record of ledger) {
    const key = keyOf(record);
    if (seen.has(key)) issues.push(`${key}: duplicate ledger record`);
    seen.add(key);
    const prompt = promptsByKey.get(key);
    if (!prompt) {
      issues.push(`${key}: no matching catalog prompt`);
      continue;
    }
    const catalogHash = sha256(Buffer.from(prompt.prompt, 'utf8'));
    if ((record.catalogPromptSha256 || record.promptSha256) !== catalogHash) {
      issues.push(`${key}: catalog prompt hash mismatch`);
    }
    if (record.output !== prompt.output) issues.push(`${key}: output path differs from catalog`);
    if (record.generation?.provider !== 'OpenAI') issues.push(`${key}: provider is not OpenAI`);
    if (record.generation?.interface !== 'built-in image_gen') issues.push(`${key}: interface is not built-in image_gen`);
    const generationId = String(record.generation?.generationId || '');
    const isNativeImageGenerationId = /^exec-[a-z0-9-]+$/iu.test(generationId)
      || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(generationId);
    if (!isNativeImageGenerationId) issues.push(`${key}: invalid generation id`);
    if (record.generationPromptStatus === 'recorded-verbatim') {
      generationPromptsRecorded += 1;
      const actualHash = sha256(Buffer.from(record.generationPrompt || '', 'utf8'));
      if (!record.generationPrompt || actualHash !== record.generationPromptSha256) {
        issues.push(`${key}: generation prompt hash mismatch`);
      }
    }

    const file = publicFile(record.output);
    if (!existsSync(file)) {
      issues.push(`${key}: output file is missing`);
      continue;
    }
    const encoded = readFileSync(file);
    if (sha256(encoded) !== record.image?.sha256) issues.push(`${key}: output hash mismatch`);
    const metadata = await sharp(encoded).metadata();
    if (metadata.width !== record.image?.width || metadata.height !== record.image?.height) {
      issues.push(`${key}: recorded dimensions do not match output`);
    }
    if (record.kind === 'item') {
      if (metadata.width !== 512 || metadata.height !== 512 || metadata.format !== 'png' || metadata.channels !== 4) {
        issues.push(`${key}: item must be 512x512 RGBA PNG`);
      }
    } else if (record.kind === 'stage') {
      if (metadata.width !== 1536 || metadata.height !== 864 || metadata.format !== 'webp' || metadata.channels !== 3) {
        issues.push(`${key}: stage must be 1536x864 RGB WebP`);
      }
    } else {
      if (metadata.width !== 1024 || metadata.height !== 1024 || metadata.format !== 'png' || metadata.channels !== 4) {
        issues.push(`${key}: sheet must be 1024x1024 RGBA PNG`);
      } else {
        await assertSheetCells(file, key, issues);
      }
    }
  }

  const summary = {
    ledgerAssets: ledger.length,
    verifiedAssets: ledger.length - new Set(issues.map(issue => issue.split(':').slice(0, 2).join(':'))).size,
    generationPromptsRecorded,
    generationPromptsCatalogOnly: ledger.length - generationPromptsRecorded,
    issues
  };
  console.log(JSON.stringify(summary, null, 2));
  if (issues.length > 0) process.exitCode = 1;
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
