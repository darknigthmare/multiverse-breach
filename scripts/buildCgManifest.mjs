import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const PUBLIC_ROOT = path.join(PROJECT_ROOT, 'public');
const MANIFEST_PATH = path.join(PUBLIC_ROOT, 'cg', 'cg-manifest.json');
const CHECK_ONLY = process.argv.includes('--check');

const inspectAsset = async (publicPath) => {
  const absolutePath = path.join(PUBLIC_ROOT, publicPath.replace(/^\//, ''));
  const bytes = await readFile(absolutePath);
  const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
  return {
    path: publicPath,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex')
  };
};

const entries = [];
for (const definition of CG_CATALOG) {
  const sourcePath = definition.imagePath.replace(/\.webp$/, '.png');
  entries.push({
    id: definition.id,
    universeKey: definition.universeKey,
    characterId: definition.characterId,
    type: definition.type,
    family: definition.family,
    canonStatus: definition.canonStatus,
    continuityId: definition.continuityId,
    contentRating: definition.contentRating,
    ageStatus: definition.ageStatus,
    consentStatus: definition.consentStatus,
    characterReferenceId: definition.characterReferenceId,
    promptId: definition.promptId,
    publishedAt: definition.publishedAt,
    source: definition.source,
    rightsClass: definition.rightsClass,
    sourceRefs: definition.sourceRefs,
    assets: {
      source: await inspectAsset(sourcePath),
      master: await inspectAsset(definition.imagePath),
      thumbnail: await inspectAsset(definition.thumbnailPath)
    }
  });
}

const serializedManifest = `${JSON.stringify({
  schemaVersion: 1,
  publishedAt: '2026-08-01',
  generationMode: 'openai-imagegen-built-in',
  total: entries.length,
  entries
}, null, 2)}\n`;

if (CHECK_ONLY) {
  const currentManifest = await readFile(MANIFEST_PATH, 'utf8');
  if (currentManifest !== serializedManifest) {
    throw new Error('CG manifest is stale. Run node scripts/buildCgManifest.mjs.');
  }
  console.log(`Manifeste CG valide: ${entries.length} entrees.`);
} else {
  await writeFile(MANIFEST_PATH, serializedManifest, 'utf8');
  console.log(`Manifeste CG ecrit: ${entries.length} entrees dans ${MANIFEST_PATH}.`);
}
