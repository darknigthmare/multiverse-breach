// Additional preflight of the remaining lifecycle commands. The final build
// still has to execute the entire original npm lifecycle without skips.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const prefix = 'docs/combat-fidelity-wave12-2026-10-23/';
const packageJson = JSON.parse(fs.readFileSync('package.json'));
const all = packageJson.scripts.prebuild.split(' && ');
assert.deepEqual(all.slice(0, 2), ['npm run test:combat-fidelity', 'npm run test:combat-presentation']);
const report = { additionalPreflightOnly: true, startedAt: new Date().toISOString(), steps: [] };
const save = () => fs.writeFileSync(prefix + 'remaining-prebuild.json', JSON.stringify(report, null, 2) + '\n');
save();
for (const [index, source] of all.slice(2).entries()) {
  const command = source.split(' ');
  assert.deepEqual(command.slice(0, 2), ['npm', 'run']);
  const log = prefix + 'remaining-' + String(index + 1).padStart(2, '0') + '.log';
  const step = { command, startedAt: new Date().toISOString(), log };
  report.steps.push(step); save();
  const fd = fs.openSync(log, 'w'); let spawnError = null;
  const child = spawn(command[0], command.slice(1), { stdio: ['ignore', fd, fd] });
  child.once('error', error => { spawnError = error.message; });
  const closed = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode: exitCode ?? 127, signal })));
  if (spawnError) fs.writeSync(fd, spawnError + '\n');
  fs.closeSync(fd);
  Object.assign(step, closed, { finishedAt: new Date().toISOString(), spawnError,
    logSha256: createHash('sha256').update(fs.readFileSync(log)).digest('hex'), receiptOrigin: 'node-child-process-close-event' });
  save(); console.log(JSON.stringify(step));
  if (step.exitCode) { report.finishedAt = new Date().toISOString(); report.passed = false; save(); process.exitCode = step.exitCode; break; }
}
if (!process.exitCode) { report.finishedAt = new Date().toISOString(); report.passed = true; save(); }
