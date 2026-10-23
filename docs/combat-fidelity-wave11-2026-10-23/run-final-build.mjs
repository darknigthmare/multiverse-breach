// Execute the required full npm lifecycle and retain the observed child exit.
// The receipt is written only after the real process has closed its output.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const directory = new URL('./', import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const auditFile = new URL('current.json', directory);
const logFile = new URL('build.log', directory);
const receiptFile = new URL('build-exit.json', directory);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const command = ['npm', 'run', 'build'];
const startedAt = new Date().toISOString();
const attempt = startedAt.replace(/[^0-9]/g, '');
for (const [file, name] of [[logFile, 'build'], [receiptFile, 'build-receipt']]) {
  if (fs.existsSync(file)) fs.copyFileSync(file, new URL(`${name}-before-${attempt}.log`, directory));
}
const auditSha256 = hash(fs.readFileSync(auditFile));
const output = fs.openSync(logFile, 'w');
let spawnError = null;
const child = spawn(command[0], command.slice(1), { cwd: root, stdio: ['ignore', output, output] });
child.once('error', error => { spawnError = error.message; });
const observed = await new Promise(resolve => child.once('close', (code, signal) => resolve({ code, signal })));
if (spawnError) fs.writeSync(output, `\nBuild process could not start: ${spawnError}\n`);
fs.closeSync(output);
const finishedAt = new Date().toISOString();
const auditSha256After = hash(fs.readFileSync(auditFile));
const receipt = {
  schemaVersion: 1, command, cwd: root, startedAt, finishedAt,
  exitCode: observed.code ?? 127, signal: observed.signal, spawnError,
  log: 'docs/combat-fidelity-wave11-2026-10-23/build.log',
  logSha256: hash(fs.readFileSync(logFile)), auditSha256, auditSha256After,
  auditUnchangedDuringBuild: auditSha256After === auditSha256,
  receiptOrigin: 'node-child-process-close-event', processId: child.pid ?? null
};
fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = receipt.exitCode || (receipt.auditUnchangedDuringBuild ? 0 : 1);
