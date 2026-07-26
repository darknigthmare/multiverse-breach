import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { lstat, readFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const resultsDirectory = path.join(
  projectRoot,
  'tmp',
  'booster-generation',
  'results'
);
const generatedImagesRoot = path.resolve(homedir(), '.codex', 'generated_images');
const deleteSources = process.argv.includes('--delete');

const isInsideGeneratedImages = (filePath) => {
  const relativePath = path.relative(generatedImagesRoot, filePath);
  return (
    relativePath
    && !relativePath.startsWith('..')
    && !path.isAbsolute(relativePath)
    && relativePath.split(path.sep).length >= 2
  );
};

const sha256File = async (filePath) => {
  const contents = await readFile(filePath);
  return {
    bytes: contents.length,
    sha256: createHash('sha256').update(contents).digest('hex')
  };
};

const resultFiles = (await readdir(resultsDirectory))
  .filter((fileName) => fileName.endsWith('.json'))
  .sort();

const candidates = [];
const skipped = [];

for (const resultFile of resultFiles) {
  const resultPath = path.join(resultsDirectory, resultFile);
  const result = JSON.parse(await readFile(resultPath, 'utf8'));
  const sourcePath = path.resolve(result.source || '');

  if (
    result.status !== 'success'
    || path.extname(sourcePath).toLowerCase() !== '.png'
    || !isInsideGeneratedImages(sourcePath)
  ) {
    skipped.push({ slug: result.slug, reason: 'source is not a generated PNG' });
    continue;
  }

  let sourceStats;
  try {
    sourceStats = await lstat(sourcePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      skipped.push({ slug: result.slug, reason: 'already removed' });
      continue;
    }
    throw error;
  }

  if (!sourceStats.isFile() || sourceStats.isSymbolicLink()) {
    throw new Error(`${result.slug}: refusing non-regular source ${sourcePath}`);
  }

  const sourceDetails = await sha256File(sourcePath);
  if (
    sourceDetails.sha256 !== result.sourceDetails?.sha256
    || sourceDetails.bytes !== result.sourceDetails?.bytes
  ) {
    throw new Error(`${result.slug}: generated source differs from its result manifest`);
  }

  candidates.push({
    slug: result.slug,
    source: sourcePath,
    bytes: sourceDetails.bytes
  });
}

if (deleteSources) {
  for (const candidate of candidates) {
    await unlink(candidate.source);
  }
}

console.log(JSON.stringify({
  mode: deleteSources ? 'delete' : 'dry-run',
  generatedImagesRoot,
  candidates: candidates.length,
  bytes: candidates.reduce((total, candidate) => total + candidate.bytes, 0),
  skipped: skipped.length
}, null, 2));
