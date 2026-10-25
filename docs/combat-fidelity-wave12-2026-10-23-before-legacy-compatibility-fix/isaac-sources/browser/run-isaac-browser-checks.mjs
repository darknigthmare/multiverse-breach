import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { base, resourceSnapshot, collect } from './collect-isaac-evidence.mjs';

const startedAt = new Date().toISOString();
const before = await resourceSnapshot();
const commands = [];
for (const id of ['core', 'movement', 'super', 'physical-ledge']) {
  const script = `${base}/isaac-${id}-browser.mjs`;
  const log = `${base}/isaac-${id}.log`;
  const output = [];
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], { stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', data => output.push(data));
    child.stderr.on('data', data => output.push(data));
    child.on('error', reject); child.on('close', resolve);
  });
  await fs.writeFile(log, Buffer.concat(output));
  commands.push({ command: `node ${script}`, exitCode, log });
  if (exitCode !== 0) {
    await fs.writeFile(`${base}/isaac-runner-failure.json`, JSON.stringify({ passed: false, startedAt, failedAt: new Date().toISOString(), commands }, null, 2) + '\n');
    throw new Error(`Isaac ${id} browser flow failed with exit ${exitCode}; see ${log}`);
  }
  console.log(JSON.stringify({ passed: true, flow: id, exitCode }));
}
const after = await resourceSnapshot();
assert.deepEqual(after, before, 'Isaac artwork, generated registries and engine resources must stay unchanged during all four browser flows');
const execution = { startedAt, finishedAt: new Date().toISOString(), commands, resourcesUnchangedDuringRun: true, resourcesBefore: before, resourcesAfter: after };
const evidence = await collect({ execution });
await fs.writeFile(`${base}/isaac-evidence.json`, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, counts: evidence.counts, evidence: `${base}/isaac-evidence.json` }));
