import { access, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');

const MASTER_SIZE = { width: 1536, height: 2048 };
const THUMBNAIL_SIZE = { width: 384, height: 512 };
const ONLY_MISSING = process.argv.includes('--only-missing');
const REFRESH_STALE = process.argv.includes('--refresh-stale');

const pathExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
};

const derivativeNeedsRefresh = async (sourcePath, outputPath) => {
  try {
    const [sourceStats, outputStats] = await Promise.all([stat(sourcePath), stat(outputPath)]);
    return sourceStats.mtimeMs > outputStats.mtimeMs;
  } catch (error) {
    if (error?.code === 'ENOENT') return true;
    throw error;
  }
};

const assertPortraitRatio = (metadata, sourcePath) => {
  if (!metadata.width || !metadata.height) {
    throw new Error(`Dimensions introuvables pour ${sourcePath}`);
  }

  if (metadata.width * 4 !== metadata.height * 3) {
    throw new Error(
      `${sourcePath} doit etre en 3:4; dimensions recues: ${metadata.width}x${metadata.height}`
    );
  }

  if (
    metadata.format !== 'png'
    || metadata.channels !== 3
    || metadata.hasAlpha
    || metadata.width < 1000
    || metadata.height < 1300
  ) {
    throw new Error(
      `${sourcePath} doit etre un PNG RGB opaque d'au moins 1000x1300; recu: ${metadata.format}, ${metadata.channels} canaux, alpha=${metadata.hasAlpha}`
    );
  }
};

const renderWebp = async (sourcePath, outputPath, size, quality, exclusive) => {
  const bytes = await sharp(sourcePath)
    .resize(size.width, size.height, { fit: 'fill' })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();

  try {
    await writeFile(outputPath, bytes, { flag: exclusive ? 'wx' : 'w' });
    return true;
  } catch (error) {
    if (exclusive && error?.code === 'EEXIST') return false;
    throw error;
  }
};

// Validate every source before writing a single derivative. This prevents a
// partial wave when a late catalog entry is missing or malformed.
const assets = [];
for (const definition of CG_CATALOG) {
  const sourcePublicPath = definition.imagePath.replace(/\.webp$/, '.png');
  const sourcePath = path.join(PROJECT_ROOT, 'public', sourcePublicPath.replace(/^\//, ''));
  const masterPath = path.join(PROJECT_ROOT, 'public', definition.imagePath.replace(/^\//, ''));
  const thumbnailPath = path.join(PROJECT_ROOT, 'public', definition.thumbnailPath.replace(/^\//, ''));
  const metadata = await sharp(sourcePath).metadata();
  assertPortraitRatio(metadata, sourcePath);
  assets.push({ definition, sourcePath, masterPath, thumbnailPath, metadata });
}

for (const { definition, sourcePath, masterPath, thumbnailPath, metadata } of assets) {
  const shouldRenderMaster = REFRESH_STALE
    ? await derivativeNeedsRefresh(sourcePath, masterPath)
    : (!ONLY_MISSING || !(await pathExists(masterPath)));
  const shouldRenderThumbnail = REFRESH_STALE
    ? await derivativeNeedsRefresh(sourcePath, thumbnailPath)
    : (!ONLY_MISSING || !(await pathExists(thumbnailPath)));

  if (!shouldRenderMaster && !shouldRenderThumbnail) {
    console.log(`CG conservee: ${definition.id} (derives deja presents)`);
    continue;
  }

  await mkdir(path.dirname(masterPath), { recursive: true });

  const renderedMaster = shouldRenderMaster
    ? await renderWebp(sourcePath, masterPath, MASTER_SIZE, 92, ONLY_MISSING)
    : false;
  const renderedThumbnail = shouldRenderThumbnail
    ? await renderWebp(sourcePath, thumbnailPath, THUMBNAIL_SIZE, 82, ONLY_MISSING)
    : false;

  console.log(
    `CG traitee: ${definition.universeKey}/${definition.characterKey}/${definition.type} (${metadata.width}x${metadata.height}; master=${renderedMaster}; miniature=${renderedThumbnail})`
  );
}
