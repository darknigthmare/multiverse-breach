import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
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
const report = { date: '2026-10-23', passed: lint.exitCode === 0 && diffCheck.exitCode === 0, lint, diffCheck };
fs.writeFileSync(new URL('static-check-results.json', directory), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.passed ? 0 : 1;
