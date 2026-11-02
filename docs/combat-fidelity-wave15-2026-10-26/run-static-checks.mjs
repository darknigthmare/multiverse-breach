import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { validateFreeze, writeReports } from './closure-support.mjs';
assert.ok(process.argv.includes('--after-production-freeze'), 'Run static closure checks after the root production freeze');
validateFreeze();
if (process.argv.includes('--check-only')) {
  console.log(JSON.stringify({ checkOnly: true, wouldRun: [['npm', 'run', 'lint'], ['git', 'diff', '--check']], frozenInputsValid: true }));
  process.exit(0);
}
const directory = new URL('./', import.meta.url), cwd = fileURLToPath(new URL('../../', import.meta.url));
async function run(command, log) {
  const startedAt = new Date().toISOString(), file = new URL(log, directory), fd = fs.openSync(file, 'w');
  let error = null;
  const child = spawn(command[0], command.slice(1), { cwd, stdio: ['ignore', fd, fd] });
  child.once('error', value => { error = value.message; });
  const result = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode: exitCode ?? 127, signal })));
  if (error) fs.writeSync(fd, error + '\n');
  fs.closeSync(fd);
  return { command, startedAt, finishedAt: new Date().toISOString(), ...result, spawnError: error,
    log, logSha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
}
const [lint, diffCheck] = await Promise.all([run(['npm', 'run', 'lint'], 'final-closure-lint.log'), run(['git', 'diff', '--check'], 'final-closure-diff-check.log')]);
validateFreeze();
const report = { date: '2026-10-26', passed: lint.exitCode === 0 && diffCheck.exitCode === 0, lint, diffCheck };
writeReports([['docs/combat-fidelity-wave15-2026-10-26/static-check-results.json', report]]);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.passed ? 0 : 1;
