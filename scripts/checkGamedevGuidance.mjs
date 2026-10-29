import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = resolve(root, 'vendor/gamedev-skills');
const manifestPath = resolve(vendor, 'UPSTREAM.json');
const failures = [];
const fail = message => failures.push(message);
const hash = (algorithm, content) => createHash(algorithm).update(content).digest('hex');

function safeRelativePath(path) {
  return typeof path === 'string' && path.length > 0 &&
    !/^[a-z]:/i.test(path) &&
    !path.includes('\\') && !path.startsWith('/') &&
    path.split('/').every(part => part.length > 0 && part !== '.' && part !== '..');
}

async function regularFiles(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) {
      fail(`Symbolic link is not part of an immutable source snapshot: ${relative(root, absolute)}`);
    } else if (entry.isDirectory()) {
      paths.push(...await regularFiles(absolute));
    } else if (entry.isFile()) {
      paths.push(relative(vendor, absolute).split(sep).join('/'));
    } else {
      fail(`Unsupported file type: ${relative(root, absolute)}`);
    }
  }
  return paths;
}

async function checkDocumentLinks(path) {
  const absolute = resolve(root, path);
  const text = await readFile(absolute, 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const destination = match[1].split('#')[0];
    if (!destination || /^[a-z][a-z0-9+.-]*:/i.test(destination)) continue;
    const target = resolve(dirname(absolute), destination);
    const location = relative(root, target);
    if (location.startsWith('..' + sep) || location === '..') {
      fail(`${path}: link escapes the repository: ${destination}`);
      continue;
    }
    try {
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) fail(`${path}: link resolves to a symlink: ${destination}`);
    } catch {
      fail(`${path}: missing local link: ${destination}`);
    }
  }
}

try {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== 1) fail('Unsupported manifest schemaVersion.');
  if (!/^[a-f0-9]{40}$/.test(manifest.revision || '')) fail('Upstream revision must be a full commit SHA.');
  if (manifest.repository !== 'https://github.com/gamedev-skills/awesome-gamedev-agent-skills') {
    fail('Unexpected upstream repository.');
  }
  if (!Array.isArray(manifest.files) || !manifest.files.length) {
    throw new Error('The manifest must list its vendored files.');
  }

  const expected = new Set();
  for (const item of manifest.files) {
    if (!safeRelativePath(item.path) || item.path === 'UPSTREAM.json') {
      fail(`Invalid vendored path: ${String(item.path)}`);
      continue;
    }
    if (expected.has(item.path)) fail(`Duplicate manifest path: ${item.path}`);
    expected.add(item.path);
    if (!/^[a-f0-9]{64}$/.test(item.sha256 || '')) fail(`Invalid SHA-256 for ${item.path}`);
    if (!/^[a-f0-9]{40}$/.test(item.gitBlobSha1 || '')) fail(`Invalid Git blob SHA for ${item.path}`);
    try {
      const content = await readFile(resolve(vendor, item.path));
      if (content.length !== item.bytes) fail(`Byte length changed: ${item.path}`);
      if (hash('sha256', content) !== item.sha256) fail(`SHA-256 changed: ${item.path}`);
      const gitObject = Buffer.concat([Buffer.from(`blob ${content.length}\0`), content]);
      if (hash('sha1', gitObject) !== item.gitBlobSha1) fail(`Upstream Git blob changed: ${item.path}`);
    } catch (error) {
      fail(`Cannot read ${item.path}: ${error.message}`);
    }
  }
  for (const required of ['LICENSE', 'NOTICE', 'docs/VERSION-SUPPORT.md', 'router/SKILL.md']) {
    if (!expected.has(required)) fail(`Required upstream attribution/resource missing from manifest: ${required}`);
  }
  if (!Array.isArray(manifest.skills) || !manifest.skills.length) fail('No selected skills declared.');
  for (const skill of manifest.skills || []) {
    if (!expected.has(skill.path)) fail(`Selected skill is not in the snapshot: ${skill.name}`);
  }
  for (const path of await regularFiles(vendor)) {
    if (path !== 'UPSTREAM.json' && !expected.has(path)) fail(`Untracked vendored file: ${path}`);
  }
  await checkDocumentLinks('AGENTS.md');
  await checkDocumentLinks('docs/development/GAMEDEV_GUIDE.md');

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Gamedev guidance OK: ${expected.size} upstream files, ${manifest.skills.length} skills/router entries, revision ${manifest.revision}.`);
  }
} catch (error) {
  console.error(`Gamedev guidance check failed: ${error.message}`);
  process.exitCode = 1;
}
