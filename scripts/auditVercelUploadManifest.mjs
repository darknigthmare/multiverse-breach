import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const safeRelativePath = (value, context) => {
  if (typeof value !== 'string' || !value || /[\\:]/.test(value)
    || Array.from(value).some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
    || value.split('/').some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error(`${context} must be a canonical relative path without traversal: ${JSON.stringify(value)}`);
  }
  return value;
};

/** Pure, case-sensitive coverage check; it does not read or modify assets. */
export function validateVercelUploadManifest(manifest, trackedPublicPaths) {
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.files)) {
    throw new Error('Vercel upload manifest must contain a files array.');
  }
  if (!Array.isArray(trackedPublicPaths) || trackedPublicPaths.length === 0) {
    throw new Error('Expected a non-empty list of Git-tracked public files; run from the repository root.');
  }

  const uploadedPaths = new Set();
  for (const [index, file] of manifest.files.entries()) {
    if (!file || typeof file !== 'object' || Array.isArray(file)) {
      throw new Error(`Manifest files[${index}] must be a file object.`);
    }
    const path = safeRelativePath(file.path, `Manifest files[${index}].path`);
    if (!Number.isSafeInteger(file.size) || file.size < 0) {
      throw new Error(`Manifest file ${JSON.stringify(path)} must have a non-negative integer size.`);
    }
    if (uploadedPaths.has(path)) throw new Error(`Duplicate upload path: ${JSON.stringify(path)}`);
    uploadedPaths.add(path);
  }

  const expectedPaths = new Set();
  for (const value of trackedPublicPaths) {
    const path = safeRelativePath(value, 'Git-tracked public path');
    if (!path.startsWith('public/')) throw new Error(`Expected a path under public/: ${JSON.stringify(path)}`);
    if (expectedPaths.has(path)) throw new Error(`Duplicate Git-tracked path: ${JSON.stringify(path)}`);
    expectedPaths.add(path);
  }
  const missingPaths = [...expectedPaths].filter(path => !uploadedPaths.has(path)).sort();
  if (missingPaths.length) {
    const error = new Error([
      `Vercel upload manifest is missing ${missingPaths.length} Git-tracked public file(s):`,
      ...missingPaths.map(path => `- ${path}`),
      'Check ignored paths and directory symlinks/junctions before uploading; no deployment was started by this audit.'
    ].join('\n'));
    error.code = 'MISSING_PUBLIC_UPLOAD_FILES';
    error.missingPaths = missingPaths;
    throw error;
  }

  return { manifestFileCount: uploadedPaths.size, trackedPublicFileCount: expectedPaths.size, matchedPublicFileCount: expectedPaths.size };
}

async function main() {
  if (process.argv.length > 2 || process.stdin.isTTY) {
    throw new Error('Usage: vercel deploy --dry --json | node scripts/auditVercelUploadManifest.mjs');
  }
  process.stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  let manifest;
  try {
    manifest = JSON.parse(input.trim());
  } catch {
    throw new Error('Expected one JSON manifest on stdin from vercel deploy --dry --json; do not merge stderr into stdout.');
  }
  const trackedPublicPaths = execFileSync('git', ['ls-files', '-z', '--', 'public'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
    .split('\0').filter(Boolean);
  const result = validateVercelUploadManifest(manifest, trackedPublicPaths);
  process.stdout.write(`Vercel upload audit passed: ${result.matchedPublicFileCount}/${result.trackedPublicFileCount} Git-tracked public files present (${result.manifestFileCount} upload files).\n`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(error => {
    process.stderr.write(`Vercel upload audit failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
