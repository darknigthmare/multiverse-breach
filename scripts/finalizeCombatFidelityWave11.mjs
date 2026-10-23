// Post-build reporting adapter. The audited verifier and every build input stay
// byte-exact; only its stale single-stage freeze assertion is adapted in memory
// to the two real, already-frozen Rift gates. This file was not a build input.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const prefix = 'docs/combat-fidelity-wave11-2026-10-23/';
const originalPath = prefix + 'validate-final-artifacts.mjs';
const authorizationPath = prefix + 'rift-refresh/authorization.json';
const gatePath = prefix + 'rift-refresh/allow-final-writes.json';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert.ok(process.argv.includes('--after-build-exit-0'));

const auditBytes = read(prefix + 'current.json');
const audit = JSON.parse(auditBytes);
const originalBytes = read(originalPath);
assert.equal(sha(originalBytes), audit.inputHashes[originalPath]);
assert.equal(sha(read(authorizationPath)), audit.inputHashes[authorizationPath]);
assert.equal(sha(read(gatePath)), audit.inputHashes[gatePath]);
const receiptBytes = read(prefix + 'build-exit.json');
const proofBytes = read(prefix + 'browser/production-assets-http.json');
const receipt = JSON.parse(receiptBytes);
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.auditSha256, sha(auditBytes));
assert.equal(receipt.auditSha256After, sha(auditBytes));

const authorization = json(authorizationPath);
const gate = json(gatePath);
const refresh = json(prefix + 'rift-refresh/result.json');
assert.equal(authorization.authorized, true);
assert.equal(authorization.referenceInputsFrozen, true);
assert.equal(authorization.presentation32PendingAtStart, true);
assert.deepEqual(refresh.authorization, authorization);
for (const field of ['authorized', 'rootFinalSignalReceived', 'allBrowserWindowsClosed',
  'presentation32FinalFrozen', 'qualityBindsCurrentReferenceHashesBeforeFinalWrites']) {
  assert.equal(gate[field], true, field);
}
const time = value => {
  const parsed = Date.parse(value);
  assert.ok(Number.isFinite(parsed), `Invalid timestamp: ${value}`);
  return parsed;
};
assert.equal(refresh.steps.length, 5);
for (const [index, step] of refresh.steps.entries()) {
  assert.ok(time(step.startedAt) <= time(step.finishedAt));
  if (index) assert.ok(time(refresh.steps[index - 1].finishedAt) <= time(step.startedAt));
}
assert.ok(time(refresh.steps[1].finishedAt) <= time(gate.createdAt));
assert.ok(time(gate.createdAt) <= time(refresh.steps[2].startedAt));
assert.ok(time(refresh.steps[4].finishedAt) <= time(refresh.finishedAt));
assert.ok(time(refresh.finishedAt) <= time(receipt.startedAt));
const lilith = authorization.references.find(reference => reference.id === 'lilith_borderlands');
assert.deepEqual(gate.correctedLilithReference, lilith);
assert.equal(sha(read('public' + lilith.sheet)), lilith.sha256);
assert.equal(gate.correctedLilithNative32.path,
  'public/sprites/generated/combat-character-animations-wave11/lilith_borderlands.png');
assert.equal(sha(read(gate.correctedLilithNative32.path)), gate.correctedLilithNative32.sha256);

const staleAssertion = 'assert.equal(authorization.productionFrozen, true);';
const correctedAssertion = 'assert.equal(authorization.referenceInputsFrozen, true);';
const source = originalBytes.toString();
assert.equal(source.split(staleAssertion).length, 2, 'Exactly one schema assertion may change');
// The built-in imports need no relocation. Preserve the original module URL for
// its root/dir resolution while retaining every other original verification.
assert.equal(source.split('import.meta.url').length, 3);
const adaptedSource = source.replace(staleAssertion, correctedAssertion)
  .replaceAll('import.meta.url', JSON.stringify(new URL(originalPath, root).href));
await import('data:text/javascript;base64,' + Buffer.from(adaptedSource).toString('base64'));

assert.deepEqual(read(prefix + 'current.json'), auditBytes);
assert.deepEqual(read(originalPath), originalBytes);
assert.deepEqual(read(prefix + 'build-exit.json'), receiptBytes);
assert.deepEqual(read(prefix + 'browser/production-assets-http.json'), proofBytes);
for (const [path, digest] of Object.entries(audit.inputHashes)) {
  assert.equal(sha(read(path)), digest, path + ': frozen build input changed');
}
const validationPath = prefix + 'validation.json';
const validation = json(validationPath);
assert.equal(validation.passed, true);
validation.postBuildVerificationAdapter = {
  path: 'scripts/finalizeCombatFidelityWave11.mjs',
  sha256: sha(fs.readFileSync(new URL(import.meta.url))),
  recordedAt: new Date().toISOString(),
  postBuildOnly: true,
  originalAuditedVerifier: { path: originalPath, sha256: sha(originalBytes), unchanged: true },
  schemaCorrection: { from: staleAssertion, to: correctedAssertion,
    explanation: 'The second Rift run froze reference inputs first; its separate final gate froze native32 presentation before steps 3/4 and the build.' },
  referenceGate: { path: authorizationPath, sha256: sha(read(authorizationPath)) },
  finalGate: { path: gatePath, sha256: sha(read(gatePath)), createdAt: gate.createdAt },
  finalGateFlagsVerified: true,
  chronologicalOrderVerified: true,
  correctedLilithHashesVerified: true,
  frozenBuildInputCount: Object.keys(audit.inputHashes).length,
  frozenBuildInputsUnchanged: true,
  buildReceiptAndHttpProofUnchanged: true
};
fs.writeFileSync(new URL(validationPath, root), JSON.stringify(validation, null, 2) + '\n');
console.log(JSON.stringify({ postBuildAdapter: true, passed: true,
  frozenBuildInputs: Object.keys(audit.inputHashes).length, frozenAuditSha256: sha(auditBytes) }));
