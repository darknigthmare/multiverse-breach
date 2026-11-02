import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { base, FLOW_IDS, fingerprint, resourceSnapshot, collect } from './collect-sir-daniel-evidence.mjs';

assert.equal(Boolean(process.env.SIR_DANIEL_BROWSER_OUTPUT), false, 'Final runner cannot redirect a flow into preliminary outputs');
const startedAt = new Date().toISOString();
const freezePath = 'docs/combat-fidelity-wave15-2026-10-26/production-freeze.json';
const freeze = JSON.parse(await fs.readFile(freezePath, 'utf8'));
assert.equal(freeze.productionFrozen, true);
assert.ok(Date.parse(startedAt) >= Date.parse(freeze.createdAt));
const before = await resourceSnapshot();
for (const resource of before) assert.equal(resource.sha256, freeze.files[resource.path], resource.path + ': not in final production freeze');
const commands = [];
for (const id of FLOW_IDS) {
  const script = `${base}/sir-daniel-${id}-browser.mjs`;
  const log = `${base}/sir-daniel-${id}.log`;
  const output = [], commandStartedAt = new Date().toISOString();
  let spawnError = null, processId = null;
  const observed = await new Promise(resolve => {
    const child = spawn(process.execPath, [script], { stdio: ['ignore', 'pipe', 'pipe'] });
    processId = child.pid ?? null;
    child.stdout.on('data', data => output.push(data));
    child.stderr.on('data', data => output.push(data));
    child.once('error', error => { spawnError = error.message; });
    child.once('close', (exitCode, signal) => resolve({ exitCode, signal }));
  });
  const commandFinishedAt = new Date().toISOString();
  await fs.writeFile(log, Buffer.concat(output));
  const command = { id, command: `node ${script}`, argv: [process.execPath, script], cwd: process.cwd(),
    startedAt: commandStartedAt, finishedAt: commandFinishedAt, ...observed, spawnError, processId,
    receiptOrigin: 'node-child-process-close-event', log, logSha256: (await fingerprint(log)).sha256 };
  commands.push(command);
  if (observed.exitCode !== 0 || observed.signal || spawnError) {
    await fs.writeFile(`${base}/sir-daniel-runner-failure.json`, JSON.stringify({ passed: false, startedAt, failedAt: new Date().toISOString(), commands }, null, 2) + '\n');
    throw new Error(`Sir Daniel ${id} browser flow failed with exit ${observed.exitCode}; see ${log}`);
  }
  const reportPath = `${base}/sir-daniel-${id}-result.json`;
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
  assert.equal(report.passed, true); assert.equal(report.allBrowserWindowsClosed, true);
  assert.equal(report.preliminary, false); assert.equal(report.phase, 'final');
  assert.ok(Date.parse(report.startedAt) >= Date.parse(commandStartedAt));
  assert.ok(Date.parse(report.finishedAt) <= Date.parse(commandFinishedAt));
  assert.ok(Date.parse(report.browserClosedAt) <= Date.parse(report.finishedAt));
  command.report = await fingerprint(reportPath); command.browserClosedAt = report.browserClosedAt;
  console.log(JSON.stringify({ passed: true, flow: id, exitCode: observed.exitCode, browserClosedAt: report.browserClosedAt }));
}
const after = await resourceSnapshot();
assert.deepEqual(after, before, 'Sir Daniel artwork, registries, engine and harness resources must stay unchanged during all four flows');
const execution = { startedAt, finishedAt: new Date().toISOString(), commands,
  allBrowserWindowsClosed: true, browserClosedAt: commands.at(-1).browserClosedAt,
  receiptOrigin: 'observed-node-child-process-close-events',
  resourcesUnchangedDuringRun: true, resourcesBefore: before, resourcesAfter: after };
const evidence = await collect({ execution });
await fs.writeFile(`${base}/sir-daniel-evidence.json`, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, counts: evidence.counts, evidence: `${base}/sir-daniel-evidence.json` }));
