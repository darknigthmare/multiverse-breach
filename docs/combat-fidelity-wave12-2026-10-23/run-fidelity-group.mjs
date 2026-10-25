// Re-run the affected complete Node group while the reference audit proceeds.
// The required final npm build still executes its entire own lifecycle.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const prefix = 'docs/combat-fidelity-wave12-2026-10-23/';
const packageJson = JSON.parse(fs.readFileSync('package.json'));
const command = packageJson.scripts['test:combat-fidelity'].split(' && ')[0].split(' ');
assert.deepEqual(command.slice(0, 3), ['node', '--test', '--test-concurrency=1']);
const startedAt = new Date().toISOString();
const log = prefix + 'legacy-compatibility-full-group.log';
const fd = fs.openSync(log, 'w');
let spawnError = null;
const child = spawn(command[0], command.slice(1), { stdio: ['ignore', fd, fd] });
child.once('error', error => { spawnError = error.message; });
const result = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode: exitCode ?? 127, signal })));
if (spawnError) fs.writeSync(fd, spawnError + '\n');
fs.closeSync(fd);
const report = { command, startedAt, finishedAt: new Date().toISOString(), ...result, spawnError,
  log, logSha256: createHash('sha256').update(fs.readFileSync(log)).digest('hex'),
  receiptOrigin: 'node-child-process-close-event', additionalPreflightOnly: true };
fs.writeFileSync(prefix + 'legacy-compatibility-full-group.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.exitCode;
