import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '../../../..');
const directory = import.meta.dirname;
const read = file => fs.readFileSync(path.resolve(root, file));
const json = file => JSON.parse(read(file));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const packageBytes = read('package.json');
const pkg = JSON.parse(packageBytes);
const testScripts = [...pkg.scripts.prebuild.matchAll(/npm run ([\w:-]+)/g)]
  .map(match => match[1]).filter(name => name.startsWith('test:'));
assert.equal(testScripts.length, 18, 'Expected18test groups in the actual prebuild');
const requested = testScripts.filter(name => name !== 'test:combat-fidelity');
assert.equal(requested.length, 17);
const plan = requested.map((name, index) => {
  const declaredCommand = pkg.scripts[name];
  const segments = declaredCommand.split(/\s*&&\s*/);
  const nodeSegment = segments.find(segment => /^node\s+(?:--test\b|scripts\/ocDlcCatalog\.test\.mjs\b)/.test(segment));
  assert.ok(nodeSegment, name + ': no standalone Node test segment');
  const words = nodeSegment.trim().split(/\s+/);
  const normalizedOcDlc = name === 'test:oc-dlc' && !words.includes('--test');
  if (normalizedOcDlc) words.splice(1, 0, '--test');
  assert.equal(words[0], 'node'); assert.ok(words.includes('--test'));
  assert.ok(words.every(word => !/[;&|`$]/.test(word)), 'Only literal Node test arguments');
  return { index: index + 1, script: name, declaredScriptCommand: declaredCommand,
    extractedTestCommand: nodeSegment, actualCommand: words.join(' '), executable: process.execPath,
    args: words.slice(1), normalizedOcDlc,
    omittedNonTestSegments: segments.filter(segment => segment !== nodeSegment),
    logFile: `${String(index + 1).padStart(2, '0')}-${name.replaceAll(':', '-')}.log` };
});
const baseline = json('docs/combat-fidelity-wave15-2026-10-26/baseline-preservation.json');
const historicalBefore = Object.fromEntries(Object.keys(baseline.historicalReports).map(file => [file, sha(read(file))]));
const receipt = { schemaVersion: 1, purpose: 'Read-only Node-test preflight of17remainingprebuildgroups; not a replacement for the final actual npmrunbuild.',
  startedAt: new Date().toISOString(), packageSha256: sha(packageBytes), prebuildCommand: pkg.scripts.prebuild,
  execution: 'Sequential groups; exact extracted Node test arguments. The standalone oc-dlc test file is explicitly normalized with --test for this preflight only.',
  noNpmBuildRun: true, noBuildersOrAuditsInvokedAsTopLevelCommands: true,
  requestedGroups: 17, completePrebuildTestGroups: 18, excludedGroup: 'test:combat-fidelity',
  historicalReportHashesBefore: historicalBefore, plan, results: [] };
const receiptFile = path.join(directory, 'receipt.json');
const persist = () => fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n');
persist();
const parseSummary = output => Object.fromEntries(['tests', 'suites', 'pass', 'fail', 'cancelled', 'skipped', 'todo']
  .map(key => { const matches = [...output.matchAll(new RegExp('^# ' + key + ' (\\d+)\\s*$', 'gm'))]; return [key, matches.length ? Number(matches.at(-1)[1]) : null]; }));
for (const item of plan) {
  const logPath = path.join(directory, item.logFile);
  assert.ok(!fs.existsSync(logPath), 'Never overwrite an observed preflight log: ' + item.logFile);
  const testFiles = item.args.filter(arg => /\.test\.(?:mjs|js|cjs)$/.test(arg));
  const inputHashes = Object.fromEntries(testFiles.map(file => [file, sha(read(file))]));
  const startedAt = new Date().toISOString();
  const start = process.hrtime.bigint();
  const stream = fs.createWriteStream(logPath, { flags: 'wx' });
  let output = '', spawnError = null;
  const child = spawn(process.execPath, item.args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', bytes => { output += bytes.toString(); stream.write(bytes); });
  child.stderr.on('data', bytes => { output += bytes.toString(); stream.write(bytes); });
  child.on('error', error => { spawnError = error.message; });
  const { code, signal } = await new Promise(resolve => child.on('close', (code, signal) => resolve({ code, signal })));
  await new Promise(resolve => stream.end(resolve));
  const endedAt = new Date().toISOString();
  const inputHashesAfter = Object.fromEntries(testFiles.map(file => [file, sha(read(file))]));
  const historicalChanges = Object.entries(historicalBefore).filter(([file, digest]) => sha(read(file)) !== digest).map(([file]) => file);
  const result = { script: item.script, actualCommand: item.actualCommand, startedAt, endedAt,
    elapsedSeconds: Number(process.hrtime.bigint() - start) / 1e9,
    observedExitCode: code, observedSignal: signal, spawnError,
    receiptOrigin: 'node-child-process-close-event', summary: parseSummary(output),
    logFile: item.logFile, logSha256: sha(fs.readFileSync(logPath)), inputHashes, inputHashesAfter,
    testInputsUnchangedDuringExecution: JSON.stringify(inputHashes) === JSON.stringify(inputHashesAfter), historicalReportChanges: historicalChanges,
    failedSubtests: output.split('\n').filter(line => /^not ok\b/.test(line)) };
  receipt.results.push(result); persist();
  console.log(JSON.stringify({ group: item.script, exit: code, signal, summary: result.summary, failedSubtests: result.failedSubtests, inputsStable: result.testInputsUnchangedDuringExecution, historicalReportChanges: historicalChanges }));
}
receipt.endedAt = new Date().toISOString();
receipt.completedGroups = receipt.results.length;
receipt.failedGroups = receipt.results.filter(result => result.observedExitCode !== 0 || result.spawnError || result.summary.fail > 0).map(result => result.script);
receipt.observedTotals = Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(key => [key, receipt.results.reduce((sum,result)=>sum+(result.summary[key]??0),0)]));
receipt.historicalReportsUnchanged = Object.entries(historicalBefore).every(([file,digest])=>sha(read(file))===digest);
receipt.passed = receipt.completedGroups === 17 && !receipt.failedGroups.length && receipt.historicalReportsUnchanged;
persist();
console.log(JSON.stringify({ completed: receipt.completedGroups, passed: receipt.passed, failedGroups: receipt.failedGroups, totals: receipt.observedTotals, historicalReportsUnchanged: receipt.historicalReportsUnchanged }));
