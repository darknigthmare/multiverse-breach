import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { prefix, root, read, sha, fingerprint, validateFreeze, writeReports } from './closure-support.mjs';

assert.ok(process.argv.includes('--after-final-browser-and-audits'), 'Complete final runtime proofs and write both actual audits first');
const output = prefix + 'build-exit.json', log = prefix + 'build.log';
assert.equal(fs.existsSync(path.resolve(root, output)), false, 'Archive an earlier actual build receipt before another attempt');
assert.equal(fs.existsSync(path.resolve(root, log)), false, 'Archive an earlier actual build log before another attempt');
const freeze = validateFreeze(), auditSha256 = sha(read(prefix + 'current.json'));
const startedAt = new Date().toISOString();
const stream = fs.createWriteStream(path.resolve(root, log), { flags: 'wx' });
let spawnError = null;
const child = spawn('npm', ['run', 'build'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.on('data', bytes => stream.write(bytes));
child.stderr.on('data', bytes => stream.write(bytes));
child.on('error', error => { spawnError = error.message; });
const result = await new Promise(resolve => child.on('close', (exitCode, signal) => resolve({ exitCode, signal })));
await new Promise(resolve => stream.end(resolve));
const finishedAt = new Date().toISOString(), bytes = read(log);
const cleanLog = bytes.toString().replace(/\x1b\[[0-9;]*m/g, '');
const sums = label => [...cleanLog.matchAll(new RegExp('^(?:#|ℹ) ' + label + '\\s+(\\d+)', 'gm'))].reduce((sum, match) => sum + Number(match[1]), 0);
const testGroups = [...cleanLog.matchAll(/^(?:#|ℹ) tests\s+(\d+)/gm)].map(match => Number(match[1]));
let frozenInputsUnchanged = true, frozenInputError = null;
try { assert.equal(validateFreeze().filesSha256, freeze.filesSha256); }
catch (error) { frozenInputsUnchanged = false; frozenInputError = error.message; }
const auditSha256After = sha(read(prefix + 'current.json'));
const receipt = { schemaVersion: 1, command: ['npm', 'run', 'build'], receiptOrigin: 'node-child-process-close-event',
  processId: child.pid ?? null,
  startedAt, finishedAt, ...result, spawnError, log, logSha256: sha(bytes), auditSha256, auditSha256After,
  auditUnchangedDuringBuild: auditSha256 === auditSha256After, frozenInputsUnchanged, frozenInputError,
  tests: { tests: sums('tests'), pass: sums('pass'), fail: sums('fail'), cancelled: sums('cancelled'), skipped: sums('skipped'), nodeTestGroups: testGroups.length, groups: testGroups },
  productionFreeze: fingerprint(prefix + 'production-freeze.json'), source1to1Verified: false };
writeReports([[output, receipt]]);
console.log(JSON.stringify(receipt));
assert.equal(receipt.exitCode, 0, 'Actual npm run build did not finish successfully');
assert.equal(receipt.signal, null); assert.equal(receipt.spawnError, null);
assert.equal(receipt.auditUnchangedDuringBuild, true); assert.equal(receipt.frozenInputsUnchanged, true);
assert.ok(receipt.tests.tests > 2076 && receipt.tests.nodeTestGroups >= 18);
for (const label of ['fail', 'cancelled', 'skipped']) assert.equal(receipt.tests[label], 0, label);
