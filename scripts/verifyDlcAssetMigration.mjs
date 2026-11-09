import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

// Historical migration receipt, intentionally opt-in: later artwork revisions
// may legitimately change their blobs. This does not inspect LFS payload bytes.
export function verifyDlcAssetMigration(root = ROOT) {
  const receipt = JSON.parse(readFileSync(resolve(root, 'docs/development/dlc-assets-migration-2026-11-07.json'), 'utf8'));
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.entries.length, receipt.counts.relocatedPaths);
  const tracked = new Map(execFileSync('git', ['ls-files', '--stage', '-z'], {
    cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024
  }).split('\0').filter(Boolean).map(line => {
    const [metadata, path] = line.split('\t');
    const [mode, blob, stage] = metadata.split(' ');
    return [path, { mode, blob, stage }];
  }));
  const destinations = new Set();
  for (const entry of receipt.entries) {
    assert.match(entry.from, /^public\//);
    assert.match(entry.to, /^DLC\/[A-Za-z0-9]+\/assets\//);
    assert.equal(entry.to.replace(/^DLC\/[A-Za-z0-9]+\/assets\//, 'public/'), entry.from, `Public URL changed: ${entry.to}`);
    assert.ok(!destinations.has(entry.to.toLowerCase()), `Duplicate destination: ${entry.to}`);
    destinations.add(entry.to.toLowerCase());
    assert.ok(!tracked.has(entry.from), `Legacy source is still tracked: ${entry.from}`);
    assert.deepEqual(tracked.get(entry.to), { mode: entry.mode, blob: entry.blob, stage: '0' }, `Asset blob or mode changed: ${entry.to}`);
  }
  const attributes = execFileSync('git', ['check-attr', '--cached', '-z', '--stdin', 'filter', 'diff', 'merge', 'text'], {
    cwd: root, encoding: 'utf8', input: `${receipt.entries.map(entry => entry.to).join('\0')}\0`, maxBuffer: 16 * 1024 * 1024
  }).split('\0');
  const byPath = new Map();
  for (let index = 0; index < attributes.length - 1; index += 3) {
    const [path, name, value] = attributes.slice(index, index + 3);
    if (!byPath.has(path)) byPath.set(path, {});
    byPath.get(path)[name] = value;
  }
  for (const entry of receipt.entries) {
    const actual = byPath.get(entry.to);
    assert.equal(actual?.filter === 'lfs', Boolean(entry.lfs), `LFS filter changed: ${entry.to}`);
    if (entry.lfs) assert.deepEqual(actual, { filter: 'lfs', diff: 'lfs', merge: 'lfs', text: 'unset' });
  }
  return {
    referenceCommit: receipt.referenceCommit,
    relocatedPaths: receipt.entries.length,
    identicalGitBlobs: receipt.entries.length,
    preservedLfsPaths: receipt.entries.filter(entry => entry.lfs).length,
    scope: receipt.scope
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { console.log(JSON.stringify(verifyDlcAssetMigration(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
