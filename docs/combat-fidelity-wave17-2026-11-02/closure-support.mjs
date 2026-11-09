import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const WAVE17_DIRECTORY = 'docs/combat-fidelity-wave17-2026-11-02/';
const readLocal = name => readFileSync(new URL('./' + name, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const WAVE17_PLAN_SHA256 = '1f8685e68f25a13ca1c321d6899257f102f5a327ce01f8f58678931832926604';
export const WAVE17_AMENDMENTS = Object.freeze([
  ['batch-amendments-before-generation.json', '32fbdd64d187a7ac96543da9c99e382cc016d4f1ef65563e360fb695961e72d9'],
  ['batch-amendments-2-before-generation.json', '7e6a9cca0530b00a99c75536c0edf3f5637f73a782333912bbbe5f598eff6117'],
  ['batch-amendments-3-before-generation.json', 'ce899059e88d6320860c5e7fee0f2fe0c038c22950bede5e3cb589170f8f7485'],
  ['batch-amendments-4-before-generation.json', '6b09730aa01ea7b005dad70f457b603d1f64becb7965f0d7ca648c7cdd49d95f']
]);
export function effectiveBatchPlanWave17() {
  const bytes = readLocal('batch-plan-before.json');
  assert.equal(hash(bytes), WAVE17_PLAN_SHA256, 'Initial W17 pre-generation plan changed');
  const plan = JSON.parse(bytes), parts = structuredClone(plan.parts), reviewedParts = structuredClone(plan.parts);
  const heroes = [...plan.heroes], withheld = [], amendments = [], additionalNative16 = [];
  for (const [file, sha256] of WAVE17_AMENDMENTS) {
    const bytes = readLocal(file); assert.equal(hash(bytes), sha256, 'W17 pre-generation amendment changed');
    const amendment = JSON.parse(bytes);
    assert.equal(amendment.initialPlan.sha256, WAVE17_PLAN_SHA256);
    for (const replacement of amendment.replacements) {
      const index = parts[replacement.part].indexOf(replacement.withheldId);
      assert.ok(index >= 0, 'Replacement must occupy an existing drawing slot');
      assert.ok(!Object.values(reviewedParts).flat().includes(replacement.replacementId), 'A replacement must be a distinct identity');
      parts[replacement.part][index] = replacement.replacementId;
      reviewedParts[replacement.part].push(replacement.replacementId);
      heroes.push({ hero: replacement.replacementHero, part: replacement.part,
        alreadyAuthored: replacement.alreadyAuthored, priorAuthored: replacement.priorAuthored,
        missingExplicitSlots: ['simple', 'secondary', 'defense'].filter(slot => !replacement.priorAuthored?.[slot]) });
      withheld.push(replacement);
    }
    amendments.push({ path: WAVE17_DIRECTORY + file, sha256 });
    additionalNative16.push(...(amendment.additionalNative16 || []));
  }
  assert.deepEqual(Object.values(parts).map(ids => ids.length), [40, 40, 40]);
  assert.equal(new Set(Object.values(parts).flat()).size, 120);
  return { ...plan, parts, reviewedParts, heroes, reviewedRows: heroes, reviewedIds: Object.values(reviewedParts).flat(), withheld, amendments, additionalNative16 };
}

export const prefix = WAVE17_DIRECTORY;
export const root = path.resolve(import.meta.dirname, '../..');
export const sha = hash;
export const relative = file => path.isAbsolute(file) ? path.relative(root, file).split(path.sep).join('/') : file;
export const read = file => readFileSync(path.resolve(root, file));
export const json = file => JSON.parse(read(file));
export const fingerprint = file => { const bytes = read(file); return { path: relative(file), sha256: sha(bytes), bytes: bytes.length }; };
export function verifyFile(proof) {
  assert.ok(proof?.path && proof.sha256, 'Missing bound artifact fingerprint');
  const actual = fingerprint(proof.path);
  assert.equal(actual.sha256, proof.sha256, 'Bound artifact changed: ' + proof.path);
  if (proof.bytes !== undefined) assert.equal(actual.bytes, proof.bytes, proof.path);
  return actual;
}
export function walk(directory, filter = () => true) {
  return readdirSync(path.resolve(root, directory), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile()).map(entry => relative(path.join(entry.parentPath, entry.name))).filter(filter);
}
export const effectiveBatchPlan = effectiveBatchPlanWave17;
export const expected = Object.freeze({ newCharacters: 120, newBase16: 120, full45States: 45, full45Poses: 180,
  rpg16Atlases: 6, rpg16Poses: 96, action16Atlases: 1, npc16Atlases: 1,
  maxNewPng: 254, maxNewPoses: 6068, newRegistryFiles: 11 });
export function historicalBaseline() {
  const receipt = json(prefix + 'baseline-receipt.json');
  for (const [file, expected] of Object.entries(receipt.files)) assert.equal(sha(read(file)), expected, 'W17 baseline changed: ' + file);
  return { baseline: json(prefix + 'baseline-current-wave16.json'), preservation: json(prefix + 'baseline-preservation.json') };
}
export function validateInventory(audit) {
  assert.equal(audit.assetInventory.registryFiles, audit.assetInventory.registries.length);
  assert.equal(audit.assetInventory.deliveredUniquePngFiles, audit.assetInventory.sheets.length);
  const actual = new Map();
  for (const registry of audit.assetInventory.registries) for (const entry of json(registry).entries || []) {
    if (!entry.sheet) continue;
    const file = 'public' + entry.sheet;
    assert.ok(existsSync(path.resolve(root, file)), 'Missing production PNG: ' + file);
    const bytes = read(file);
    assert.equal(sha(bytes), entry.sha256, 'Registry PNG hash mismatch: ' + file);
    assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
    assert.equal(bytes.readUInt32BE(16), entry.width ?? entry.dimensions?.width, file + ': width');
    assert.equal(bytes.readUInt32BE(20), entry.height ?? entry.dimensions?.height, file + ': height');
    assert.ok([4, 6].includes(bytes[25]), file + ': no PNG alpha channel');
    if (actual.has(entry.sheet)) assert.equal(actual.get(entry.sheet), entry.sha256, 'Conflicting shared PNG metadata');
    actual.set(entry.sheet, entry.sha256);
  }
  assert.deepEqual([...actual.keys()].sort(), [...audit.assetInventory.sheets].sort());
  return { pngFiles: actual.size, registryFiles: audit.assetInventory.registries.length };
}
export function assertDeliveryReady(audit) {
  const plan = effectiveBatchPlanWave17(), ids = Object.values(plan.parts).flat().sort();
  assert.equal(audit.batch.wave, 17);
  for (const key of ['deliveredNativeCharacterIds', 'deliveredBaseCharacterIds']) assert.deepEqual([...audit.batch[key]].sort(), ids, key);
  for (const row of audit.presentations.wave17Delivery) {
    for (const key of ['nativeAnimationDelivered', 'baseCorrectionDelivered', 'baseRuntimeBindingConfirmed', 'recipeRegistered', 'nativeSuperHelperAcceptsResolvedAction']) assert.equal(row[key], true, row.id + ': ' + key);
    assert.equal(row.namedSlots, 4, row.id + ': source-authored slots');
    assert.equal(row.source1to1Verified, false);
  }
  assert.ok(audit.meleeBindings.fullDetailedMeleeManifestHeroes.includes('beyond_good_evil_jade'));
  assert.equal(audit.entities.wave17Native16Atlases, expected.rpg16Atlases);
  assert.equal(audit.entities.wave17CaptureNpc16Atlases, expected.npc16Atlases);
  assert.equal(audit.actions.wave17Action16Atlases, expected.action16Atlases);
  assert.equal(audit.tacticsTerrain.selectableVerticalBattlefields, 23);
  assert.equal(audit.tacticsTerrain.uniqueTopologyCount, 23);
  assert.equal(audit.tacticsTerrain.materials, 52);
  const anchors = Object.assign({}, ...['A', 'B', 'C'].map(part => json(`src/game/combat/nativeSuperAnchorsWave17Part${part}.generated.json`)));
  assert.deepEqual(Object.keys(anchors).sort(), ids, 'All120 measured native emission bindings must be ready before freezing');
  for (const id of ids) for (const phase of ['super', 'fatality']) {
    assert.equal(anchors[id][phase]?.length, 4, id + ': missing measured ' + phase + ' cells');
    assert.ok(anchors[id][phase].every(point => Number.isFinite(point.x) && Number.isFinite(point.y)), id + ': invalid emission point');
  }
  const joe = json('src/game/combat/characterAnimationsWave17PartC.generated.json').entries.find(entry => entry.heroId === 'joe_gomamon');
  const fish = anchors.joe_gomamon.projectileRegion;
  assert.equal(fish?.reviewed, true); assert.equal(fish.fishCount, 3); assert.equal(fish.newDrawing, false);
  assert.equal(fish.sheet, joe.sheet); assert.equal(fish.atlasSha256, joe.sha256);
  assert.equal(fish.phase, 'super'); assert.equal(fish.row, 7); assert.equal(fish.column, 2); assert.equal(fish.col, 2);
  assert.equal(audit.source1to1Verified, false);
  const before = historicalBaseline().baseline;
  assert.equal(audit.assetInventory.sheets.length - before.assetInventory.sheets.length, expected.maxNewPng);
  assert.equal(audit.assetInventory.registries.length - before.assetInventory.registries.length, expected.newRegistryFiles);
  return true;
}
export function validateFreeze() {
  const freeze = json(prefix + 'production-freeze.json');
  assert.equal(freeze.productionFrozen, true);
  assert.equal(freeze.wave, 17);
  assert.ok(Object.keys(freeze.files).length > 0);
  for (const [file, expected] of Object.entries(freeze.files)) assert.equal(sha(read(file)), expected, 'Frozen production input changed: ' + file);
  assert.equal(sha(Buffer.from(JSON.stringify(freeze.files))), freeze.filesSha256);
  return freeze;
}
export function writeReports(reports) {
  for (const [file, value] of reports) {
    const target = path.resolve(root, file); mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target + '.tmp', typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
    renameSync(target + '.tmp', target);
  }
}
