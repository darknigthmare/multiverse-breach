import { spawn } from 'node:child_process';
import { closeSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const files = process.argv.slice(2);
if (!files.length || files.some(file => !/^scripts\/[A-Za-z0-9]+\.test\.mjs$/.test(file))) throw new Error('Pass exact scripts test paths');
const startedAt = new Date().toISOString();
const stamp = startedAt.replaceAll(/[-:.]/g, '').replaceAll('Z', '');
const log = new URL(`targeted-${stamp}.log`, import.meta.url);
const receipt = new URL(`targeted-${stamp}-receipt.json`, import.meta.url);
const fd = openSync(log, 'w');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputHashes = Object.fromEntries(files.map(path => [path, sha(readFileSync(new URL('../../../' + path, import.meta.url)))]));
const command = ['node', '--test', '--test-concurrency=1', ...files];
const child = spawn(process.execPath, command.slice(1), { cwd: root, stdio: ['ignore', fd, fd] });
let spawnError = null;
child.on('error', error => { spawnError = { code: error.code, message: error.message }; });
child.on('close', (exitCode, signal) => {
  closeSync(fd);
  const bytes = readFileSync(log), text = bytes.toString('utf8');
  const count = key => Number(new RegExp(`(?:ℹ |# )${key} (\\d+)`).exec(text)?.[1] || 0);
  const result = { schemaVersion: 1, command, startedAt, completedAt: new Date().toISOString(), exitCode, signal, spawnError,
    receiptOrigin: 'node-child-process-close-event', log: log.pathname.slice(root.length), logSha256: sha(bytes), inputHashes,
    inputHashesAfter: Object.fromEntries(files.map(path => [path, sha(readFileSync(new URL('../../../' + path, import.meta.url)))])),
    tests: Object.fromEntries(['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo'].map(key => [key, count(key)])) };
  writeFileSync(receipt, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = exitCode === 0 && !signal && !spawnError ? 0 : 1;
});
