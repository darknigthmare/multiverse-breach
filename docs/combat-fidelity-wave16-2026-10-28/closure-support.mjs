// Shared W16 checks. Importing this module never publishes evidence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const prefix = 'docs/combat-fidelity-wave16-2026-10-28/';
export const previousPrefix = 'docs/combat-fidelity-wave15-2026-10-26/';
export const expected = Object.freeze({ characters: 120, charactersPerAgent: 40,
  historicalPng: 982, historicalRegistries: 127, maxPng: 1237, maxRegistries: 138,
  maxNewPoses: 6084, maxNewPng: 255, historicalFull45: 16,
  full45: 'hellblade_senua', newFull45: 1, reinforcementAtlases: 7 });
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export const sorted = values => [...values].sort();
export function relative(file) {
  const result = path.relative(root, path.resolve(root, file));
  assert.ok(result && !result.startsWith('..') && !path.isAbsolute(result), 'Evidence outside the repository: ' + file);
  return result.split(path.sep).join('/');
}
export const read = file => fs.readFileSync(path.resolve(root, relative(file)));
export const json = file => JSON.parse(read(file));
export const exists = file => fs.existsSync(path.resolve(root, relative(file)));
export const fingerprint = file => { const bytes = read(file); return { path: relative(file), sha256: sha(bytes), bytes: bytes.length }; };
export function time(value) { const result = Date.parse(value); assert.ok(Number.isFinite(result), 'Invalid timestamp: ' + value); return result; }
export function verifyFile(record) {
  assert.equal(typeof record?.path, 'string');
  const actual = fingerprint(record.path); assert.equal(actual.sha256, record.sha256, record.path);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, record.path);
  return actual;
}
export const hashRows = hashes => Array.isArray(hashes) ? hashes : Object.entries(hashes || {}).map(([path, sha256]) => ({ path, sha256 }));
export function verifyHashes(hashes) {
  const rows = hashRows(hashes); assert.ok(rows.length, 'No frozen input hashes');
  return rows.map(verifyFile);
}
export function effectiveBatchPlan() {
  const originalPath = prefix + 'batch-plan-before.json', original = json(originalPath);
  const amendmentPath = prefix + 'batch-amendments-before-generation.json';
  const amendmentBytes = read(amendmentPath), amendment = JSON.parse(amendmentBytes);
  assert.equal(sha(amendmentBytes), '7275a4777dee4eda1197fe8078b2752f69b4e35de00111d5aa02a953841d6f49');
  assert.equal(amendment.originalPlan.path, originalPath);
  assert.equal(amendment.originalPlan.sha256, sha(read(originalPath)));
  const secondPath = prefix + 'batch-amendments-2-before-generation.json';
  const secondBytes = read(secondPath), second = JSON.parse(secondBytes);
  assert.equal(sha(secondBytes), '5be50e47fad97860d1056ad9a26276d6b19817f622f39a34b74099b3dd18b780');
  assert.equal(second.previousAmendment.path, amendmentPath);
  assert.equal(second.previousAmendment.sha256, sha(amendmentBytes));
  assert.deepEqual(second.originalPlan, amendment.originalPlan);
  const companionPlan = prefix + 'persistent-shield-pal-plan-before-generation.json';
  assert.equal(sha(read(companionPlan)), '2e9de1e899f18abb0ffd3b9b9a0b60175c3e4e2ad501b9c09149dd7ffea234ab');
  const reviewedRows = [...original.heroes, ...amendment.newRows, ...second.newRows];
  const byId = new Map(reviewedRows.map(row => [row.hero.id, row]));
  const ids = Object.values(second.effectiveParts).flat();
  assert.equal(ids.length, 120); assert.equal(new Set(ids).size, 120); assert.equal(byId.size, 124);
  for (const part of Object.values(second.effectiveParts)) assert.equal(part.length, 40);
  for (const change of [...amendment.amendments, ...second.amendments]) {
    const refusal = verifyFile(change.refusal);
    assert.ok(read(refusal.path).toString().includes(change.refusal.requestId));
    assert.ok(original.parts[change.part].includes(change.withheldId));
    assert.ok(second.effectiveParts[change.part].includes(change.addedId));
    assert.equal(ids.includes(change.withheldId), false);
  }
  return { ...original, parts: second.effectiveParts, heroes: ids.map(id => {
    assert.ok(byId.has(id), id); return byId.get(id);
  }), originalParts: original.parts, reviewedRows, reviewedIds: [...byId.keys()],
    withheld: [...amendment.amendments, ...second.amendments], amendment: fingerprint(secondPath),
    amendments: [fingerprint(amendmentPath), fingerprint(secondPath)], inventoryAmendment: fingerprint(companionPlan) };
}
export function historicalBaseline() {
  const baselineBytes = read(prefix + 'baseline-current-wave15.json');
  const baseline = JSON.parse(baselineBytes), validation = json(prefix + 'baseline-validation-wave15.json');
  assert.equal(validation.passed, true); assert.equal(sha(baselineBytes), validation.currentAuditSha256);
  assert.deepEqual(read(previousPrefix + 'current.json'), baselineBytes);
  assert.deepEqual(read(previousPrefix + 'validation.json'), read(prefix + 'baseline-validation-wave15.json'));
  verifyHashes(json(prefix + 'baseline-receipt.json').files);
  assert.equal(baseline.assetInventory.deliveredUniquePngFiles, expected.historicalPng);
  assert.equal(baseline.assetInventory.registryFiles, expected.historicalRegistries);
  assert.equal(validation.distAssets.length, expected.historicalPng);
  const preservation = json(prefix + 'baseline-preservation.json');
  assert.equal(Object.keys(preservation.pngFiles).length, expected.historicalPng);
  assert.equal(Object.keys(preservation.registries).length, expected.historicalRegistries);
  verifyHashes(preservation.pngFiles); verifyHashes(preservation.registries); verifyHashes(preservation.historicalReports);
  return { baseline, validation, preservation };
}
export function validateInventory(audit) {
  const inventory = audit.assetInventory;
  assert.ok(inventory && Array.isArray(inventory.sheets) && Array.isArray(inventory.registries));
  assert.equal(inventory.deliveredUniquePngFiles, inventory.sheets.length);
  assert.equal(inventory.registryFiles, inventory.registries.length);
  assert.equal(new Set(inventory.sheets).size, inventory.sheets.length);
  assert.equal(new Set(inventory.registries).size, inventory.registries.length);
  assert.ok(inventory.sheets.length >= expected.historicalPng && inventory.sheets.length <= expected.maxPng);
  assert.ok(inventory.registries.length >= expected.historicalRegistries && inventory.registries.length <= expected.maxRegistries);
  const baseline = json(prefix + 'baseline-current-wave15.json').assetInventory;
  for (const sheet of baseline.sheets) assert.ok(inventory.sheets.includes(sheet), 'Historical PNG omitted: ' + sheet);
  for (const file of baseline.registries) assert.ok(inventory.registries.includes(file), 'Historical registry omitted: ' + file);
}
export function validateFreeze() {
  const freeze = json(prefix + 'production-freeze.json');
  assert.equal(freeze.productionFrozen, true);
  assert.equal(freeze.postFreezeWritesPermitted, false);
  assert.equal(freeze.riftCompletedBeforeFreeze, true);
  time(freeze.createdAt); verifyHashes(freeze.files);
  return freeze;
}
export function walk(directory, predicate = () => true) {
  return fs.readdirSync(path.resolve(root, relative(directory)), { withFileTypes: true }).flatMap(entry => {
    const file = relative(directory) + '/' + entry.name;
    return entry.isDirectory() ? walk(file, predicate) : predicate(file) ? [file] : [];
  });
}
export function assertDeliveryReady(audit) {
  validateInventory(audit);
  const plan = effectiveBatchPlan(), ids = Object.values(plan.parts).flat();
  assert.equal(ids.length, expected.characters); assert.equal(new Set(ids).size, expected.characters);
  for (const part of Object.values(plan.parts)) assert.equal(part.length, expected.charactersPerAgent);
  const native = new Map(audit.meleeBindings.nativePresentationEntries.map(entry => [entry.heroId, entry]));
  const bases = new Map(audit.baseSpriteCorrections.entries.map(entry => [entry.heroId, entry]));
  for (const id of ids) {
    assert.ok(native.has(id), id + ': native32 delivery still absent');
    assert.ok(bases.has(id), id + ': base16 delivery still absent');
    assert.ok(native.get(id).sheet.includes('wave16'), id + ': prior native32 is not a new drawing');
    assert.ok(bases.get(id).sheet.includes('wave16'), id + ': prior base16 is not a new drawing');
  }
  const full = audit.meleeBindings.fullDetailedMeleeManifestHeroes;
  assert.ok(full.some(entry => (typeof entry === 'string' ? entry : entry.id) === expected.full45), 'Senua full45 is still absent');
  assert.equal(audit.batch.reviewedIdentityCount, 124);
  assert.equal(audit.batch.revisedAbilityIds.length, 124);
  const rows = audit.presentations.wave16Delivery.entries;
  assert.equal(rows.length, 120);
  for (const row of rows) {
    assert.equal(row.sourceDefinitionPresent, true, row.id + ': source definition missing');
    assert.equal(row.namedSlots, 4, row.id + ': incomplete named kit');
    assert.equal(row.recipeRegistered, true, row.id + ': presentation recipe missing');
    assert.equal(row.nativeSuperHelperAcceptsResolvedAction, true, row.id + ': native action not bound');
    assert.ok(row.sameUniverseNonSelfPartner || row.sourceEntityInvocation, row.id + ': invalid or absent same-universe reinforcement/entity');
  }
  assert.equal(audit.entities.wave16Native16Atlases, 7);
  assert.equal(audit.entities.wave16Native16Poses, 112);
  assert.equal(audit.entities.wave16PersistentProtection16Atlases, 1);
  assert.equal(audit.entities.wave16PersistentProtection16Poses, 16);
  assert.equal(audit.actions.nativeAction16Atlases, 1);
  assert.equal(audit.actions.nativeActionPoses, 16);
  assert.equal(audit.tacticsTerrain.selectableVerticalBattlefields, 19);
  assert.equal(audit.tacticsTerrain.universeBattlefields, 16);
  assert.equal(audit.tacticsTerrain.universeBattlefieldsWithReachableObjectives, 16);
  assert.equal(audit.tacticsTerrain.materials, 42);
  assert.equal(audit.stages.sceneMechanismDefinitions, 435);
  assert.equal(audit.stages.rosterUniversesWithSceneMechanismDefinition, 216);
}
export function writeReports(outputs) {
  const prepared = outputs.map(([file, value]) => {
    const normalized = relative(file); assert.ok(normalized.startsWith(prefix), 'Write only W16 evidence: ' + normalized);
    const bytes = typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n';
    if (normalized.endsWith('.json')) JSON.parse(bytes);
    return { file: normalized, bytes };
  });
  if (process.argv.includes('--check-only')) return prepared.map(record => ({ file: record.file, wouldWrite: true }));
  for (const record of prepared) {
    fs.mkdirSync(path.dirname(path.resolve(root, record.file)), { recursive: true });
    fs.writeFileSync(path.resolve(root, record.file), record.bytes);
  }
  return prepared.map(record => ({ file: record.file, bytes: Buffer.byteLength(record.bytes) }));
}
