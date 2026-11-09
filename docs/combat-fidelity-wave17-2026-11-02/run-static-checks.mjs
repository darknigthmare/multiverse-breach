// Receipts come only from real child close events; failed attempts are retained.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prefix, root, read, sha, fingerprint, validateFreeze, writeReports } from './closure-support.mjs';

export const staticCommands = Object.freeze([
  ['lint', ['npm', 'run', 'lint']], ['diffCheck', ['git', 'diff', '--check']]
]);
export async function runStaticChecks({ checkOnly = false } = {}) {
  const freeze = validateFreeze();
  if (checkOnly) return { checkOnly: true, wouldRun: staticCommands, executedCommands: 0, frozenInputsValid: true };
  const reportPath = prefix + 'static-check-results.json';
  assert.equal(fs.existsSync(path.resolve(root, reportPath)), false, 'Archive the previous real static receipt before rerunning');
  const startedAt = new Date().toISOString(), records = {};
  for (const [name, command] of staticCommands) {
    const log = prefix + 'final-' + name + '.log', descriptor = fs.openSync(path.resolve(root, log), 'wx');
    const commandStartedAt = new Date().toISOString(); let spawnError = null;
    const child = spawn(command[0], command.slice(1), { cwd: root, stdio: ['ignore', descriptor, descriptor] });
    child.once('error', error => { spawnError = error.message; });
    const observed = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode, signal })));
    fs.closeSync(descriptor);
    records[name] = { command, startedAt: commandStartedAt, finishedAt: new Date().toISOString(), ...observed,
      processId: child.pid ?? null, spawnError, receiptOrigin: 'node-child-process-close-event', log, logSha256: sha(read(log)) };
  }
  let frozenInputsUnchanged = true, frozenInputError = null;
  try { assert.equal(validateFreeze().filesSha256, freeze.filesSha256); }
  catch (error) { frozenInputsUnchanged = false; frozenInputError = error.message; }
  const report = { schemaVersion: 1, wave: 17, startedAt, finishedAt: new Date().toISOString(), ...records,
    passed: frozenInputsUnchanged && Object.values(records).every(r => r.exitCode === 0 && r.signal === null && r.spawnError === null),
    frozenInputsUnchanged, frozenInputError, productionFreeze: fingerprint(prefix + 'production-freeze.json'), source1to1Verified: false };
  writeReports([[reportPath, report]]); return report;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv.includes('--after-production-freeze'));
  const result = await runStaticChecks({ checkOnly: process.argv.includes('--check-only') });
  console.log(JSON.stringify(result)); if (!result.checkOnly) process.exitCode = result.passed ? 0 : 1;
}
