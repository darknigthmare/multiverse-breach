// Pure validation shared by W15 closure helpers. Importing never writes evidence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const prefix = 'docs/combat-fidelity-wave15-2026-10-26/';
export const previousPrefix = 'docs/combat-fidelity-wave14-2026-10-25/';
export const expected = Object.freeze({ historicalPng: 730, historicalRegistries: 118, maxPng: 982, maxRegistries: 127, characters: 120, charactersPerAgent: 40, newFull45: 1, full45: 'sir_daniel_fortesque', historicalFull45: 15, reinforcementAtlases: 6, maxNewPoses: 6036, maxNewPng: 252 });
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function relative(file) {
  const absolute = path.resolve(root, file);
  const result = path.relative(root, absolute);
  assert.ok(result && !result.startsWith('..') && !path.isAbsolute(result), 'Evidence must remain inside the repository: ' + file);
  return result.split(path.sep).join('/');
}
export const read = file => fs.readFileSync(path.resolve(root, relative(file)));
export const json = file => JSON.parse(read(file));
export const exists = file => fs.existsSync(path.resolve(root, relative(file)));
export const fingerprint = file => { const bytes = read(file); return { path: relative(file), sha256: sha(bytes), bytes: bytes.length }; };
export const sorted = values => [...values].sort();
export function time(value) { const parsed = Date.parse(value); assert.ok(Number.isFinite(parsed), 'Invalid receipt timestamp: ' + value); return parsed; }
export function verifyFile(record) {
  assert.equal(typeof record?.path, 'string');
  const actual = fingerprint(record.path); assert.equal(actual.sha256, record.sha256, record.path);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, record.path);
  return actual;
}
export const hashRows = hashes => Array.isArray(hashes) ? hashes : Object.entries(hashes || {}).map(([path, sha256]) => ({ path, sha256 }));
export function verifyHashes(hashes, { refresh, gate, finishedAt } = {}) {
  const rows = hashRows(hashes); assert.ok(rows.length, 'No frozen input hashes');
  return rows.map(record => {
    const actual = fingerprint(record.path);
    if (record.sha256 === actual.sha256) return verifyFile(record);
    assert.equal(relative(record.path), 'src/game/riftDossierAssets.json', 'Undocumented production input drift');
    assert.equal(refresh?.success, true); assert.equal(gate?.authorized, true);
    assert.equal(refresh.generatedSha256Before[actual.path], record.sha256);
    assert.equal(refresh.generatedSha256After[actual.path], actual.sha256);
    if (finishedAt) assert.ok(time(finishedAt) <= time(gate.createdAt));
    assert.ok(time(gate.createdAt) <= time(refresh.steps[2].startedAt));
    return actual;
  });
}
export function historicalBaseline() {
  const baselineBytes = read(prefix + 'baseline-current-wave14.json'), previousBytes = read(previousPrefix + 'current.json');
  const baseline = JSON.parse(baselineBytes), validation = json(previousPrefix + 'validation.json');
  assert.equal(validation.passed, true); assert.equal(sha(previousBytes), validation.currentAuditSha256);
  assert.equal(sha(baselineBytes), sha(previousBytes), 'W15 baseline must be the validated W14 audit');
  const receipt = json(prefix + 'baseline-receipt.json');
  for (const [file, digest] of Object.entries(receipt.files)) assert.equal(fingerprint(file).sha256, digest, file);
  assert.equal(baseline.assetInventory.deliveredUniquePngFiles, expected.historicalPng);
  assert.equal(baseline.assetInventory.registryFiles, expected.historicalRegistries);
  assert.equal(validation.distAssets.length, expected.historicalPng);
  assert.equal(new Set(validation.distAssets.map(asset => asset.sheet)).size, expected.historicalPng);
  for (const file of baseline.assetInventory.registries) verifyFile({ path: file, sha256: baseline.inputHashes[file] });
  for (const asset of validation.distAssets) verifyFile({ path: 'public' + asset.sheet, sha256: asset.sha256 });
  return { baseline, validation };
}
export function validateInventory(audit) {
  const inventory = audit.assetInventory;
  assert.equal(inventory.deliveredUniquePngFiles, inventory.sheets.length);
  assert.equal(inventory.registryFiles, inventory.registries.length);
  assert.equal(new Set(inventory.sheets).size, inventory.sheets.length);
  assert.equal(new Set(inventory.registries).size, inventory.registries.length);
  assert.ok(inventory.sheets.length >= expected.historicalPng && inventory.sheets.length <= expected.maxPng);
  assert.ok(inventory.registries.length >= expected.historicalRegistries && inventory.registries.length <= expected.maxRegistries);
  const baseline = json(prefix + 'baseline-current-wave14.json').assetInventory;
  for (const sheet of baseline.sheets) assert.ok(inventory.sheets.includes(sheet), 'Historical image omitted: ' + sheet);
  for (const file of baseline.registries) assert.ok(inventory.registries.includes(file), 'Historical registry omitted: ' + file);
}
export function verifiedCurrentRefusals() {
  const plan=json(prefix+'batch-plan-before.json'), selected=new Set(Object.values(plan.parts).flat()), records=[];
  for(const part of ['part-a','part-b','part-c']){
    const file=prefix+part+'/request-failures.json';if(!exists(file))continue;
    for(const failure of json(file).failures||[]){
      if(!selected.has(failure.heroId)||failure.code!=='moderation_blocked')continue;
      for(const receipt of failure.receipts||[failure]){
        assert.ok(relative(receipt.receipt).startsWith(prefix),'A historical refusal cannot waive a W15 drawing');
        const bytes=read(receipt.receipt),tool=JSON.parse(bytes);
        assert.equal(tool.code,'moderation_blocked');assert.equal(tool.imageReturned,false);
        assert.ok(typeof tool.requestId==='string'&&tool.requestId.length>0);
        if(tool.failed!==undefined)assert.equal(tool.failed,true);
        if(receipt.requestId)assert.equal(tool.requestId,receipt.requestId);
        if(receipt.receiptSha256)assert.equal(sha(bytes),receipt.receiptSha256);
        records.push({heroId:failure.heroId,path:relative(receipt.receipt),sha256:sha(bytes),requestId:tool.requestId});
      }
    }
  }
  return {records,heroIds:sorted(new Set(records.map(record=>record.heroId)))};
}
export function assertDeliveryReady(audit) {
  const plan=json(prefix+'batch-plan-before.json'), ids=Object.values(plan.parts).flat(), refused=verifiedCurrentRefusals();
  assert.deepEqual(sorted(audit.batch.remainingNativeCharacterIds),refused.heroIds,'Finish pending/rejected native32 art before freezing; only real current-wave moderation refusals remain separately declared');
  assert.deepEqual(sorted(audit.batch.remainingBaseCharacterIds),refused.heroIds,'Finish the same dedicated base16 identities before freezing');
  const delivered=ids.filter(id=>!refused.heroIds.includes(id));
  assert.deepEqual(sorted(audit.batch.deliveredNativeCharacterIds),sorted(delivered));
  assert.deepEqual(sorted(audit.batch.deliveredBaseCharacterIds),sorted(delivered));
  assert.equal(audit.entities.wave15Native16Atlases,expected.reinforcementAtlases);
  assert.equal(audit.entities.wave15Native16Poses,expected.reinforcementAtlases*16);
  const full=audit.meleeBindings.detailedManifestCoverage.find(entry=>entry.id===expected.full45);
  assert.equal(full?.complete,true);assert.equal(full.boundFrames,180);
  const activeParts=Object.values(plan.parts).filter(group=>group.some(id=>delivered.includes(id))).length;
  assert.equal(audit.assetInventory.deliveredUniquePngFiles,expected.historicalPng+delivered.length*2+expected.reinforcementAtlases+6);
  assert.equal(audit.assetInventory.registryFiles,expected.historicalRegistries+activeParts*2+3);
  return {deliveredIds:delivered,refusedIds:refused.heroIds};
}
export function validateFreeze({ refresh, gate } = {}) {
  if (!refresh && exists(prefix + 'rift-refresh/result.json')) refresh = json(prefix + 'rift-refresh/result.json');
  if (!gate && exists(prefix + 'rift-refresh/allow-final-writes.json')) gate = json(prefix + 'rift-refresh/allow-final-writes.json');
  const freeze = json(prefix + 'production-freeze.json');
  assert.equal(freeze.productionFrozen, true); time(freeze.createdAt);
  verifyHashes(freeze.files, { refresh, gate });
  const walk = directory => fs.readdirSync(path.resolve(root, directory), { withFileTypes: true })
    .flatMap(entry => entry.isDirectory() ? walk(directory + '/' + entry.name) : [directory + '/' + entry.name]);
  const currentSources = [...walk('src'), ...walk('scripts').filter(file => /\.(?:mjs|js|py)$/.test(file))];
  for (const file of currentSources) assert.ok(Object.hasOwn(freeze.files, file), 'Production source added after freeze: ' + file);
  return freeze;
}
export function requiredTestCommands(scripts, name = 'prebuild', parents = []) {
  assert.ok(!parents.includes(name), 'Cyclic npm script: ' + name);
  assert.equal(typeof scripts[name], 'string', 'Unknown npm script: ' + name);
  return scripts[name].split('&&').flatMap(raw => {
    const command = raw.trim(), child = command.match(/^npm run ([\w:.-]+)(?:\s|$)/);
    if (child) return requiredTestCommands(scripts, child[1], [...parents, name]);
    return /^node\s/.test(command) && (/\s--test(?:\s|=|$)/.test(command) || /\s[^\s]+\.test\.m?js(?:\s|$)/.test(command)) ? [command] : [];
  });
}
export function writeReports(reports, { checkOnly = process.argv.includes('--check-only') } = {}) {
  // Serialize and validate every report before making the first output mutation.
  const outputs = reports.map(([file, value]) => {
    const outputPath = relative(file);
    const bytes = typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n';
    assert.equal(typeof bytes, 'string');
    if (outputPath.endsWith('.json')) JSON.parse(bytes);
    return { file: outputPath, bytes };
  });
  for (const output of outputs) {
    assert.ok(output.file.startsWith(prefix), 'Closure helpers write only W15 evidence');
    assert.ok(!['current.json', 'baseline-current-wave14.json', 'baseline-validation-wave14.json', 'baseline-receipt.json', 'baseline-preservation.json', 'baseline-authoring-preservation.json', 'batch-plan-before.json'].some(name => output.file === prefix + name), 'Closure helpers cannot rewrite the audit or immutable baselines');
  }
  if (!checkOnly) for (const output of outputs) fs.writeFileSync(path.resolve(root, output.file), output.bytes);
  return { checkOnly, outputs: outputs.map(output => ({ path: output.file, bytes: Buffer.byteLength(output.bytes) })) };
}
