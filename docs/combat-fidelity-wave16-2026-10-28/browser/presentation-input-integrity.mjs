import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { effectiveBatchPlan } from '../closure-support.mjs';

export const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const waveDirectory = 'docs/combat-fidelity-wave16-2026-10-28';
const previousDirectory = 'docs/combat-fidelity-wave15-2026-10-26';
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export const readBytes = relative => fs.readFile(path.resolve(repositoryRoot, relative));
export const readJson = async relative => JSON.parse(await readBytes(relative));
const fileExists = async relative => fs.access(path.resolve(repositoryRoot, relative)).then(() => true, () => false);
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export const equivalent = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

async function walk(directory, filter = () => true) {
  const files = [];
  for (const entry of await fs.readdir(path.resolve(repositoryRoot, directory), { withFileTypes: true })) {
    const relative = directory + '/' + entry.name;
    if (entry.isDirectory()) files.push(...await walk(relative, filter));
    else if (filter(relative)) files.push(relative);
  }
  return files;
}

export async function previousWaveBaseline() {
  const auditPath = previousDirectory + '/current.json', validationPath = previousDirectory + '/validation.json';
  const [auditBytes, validation] = await Promise.all([readBytes(auditPath), readJson(validationPath)]);
  assert.equal(validation.passed, true);
  assert.equal(sha(auditBytes), validation.currentAuditSha256, 'Historical W15 audit is not its actually validated snapshot');
  const audit = JSON.parse(auditBytes), registries = [], native = [], bases = [];
  for (const relative of audit.assetInventory.registries) {
    const bytes = await readBytes(relative);
    assert.equal(sha(bytes), audit.inputHashes[relative], relative + ': W15 registry changed');
    const record = { path: relative, sha256: sha(bytes) };
    registries.push(record);
    const entries = JSON.parse(bytes).entries || [];
    if (/\/characterAnimations[^/]*\.generated\.json$/.test(relative)) native.push(...entries);
    if (/\/characterSpriteCorrections[^/]*\.generated\.json$/.test(relative)) bases.push(...entries);
  }
  assert.equal(registries.length, 127);
  assert.equal(native.length, 428); assert.equal(bases.length, 374);
  assert.equal(native.filter(entry => Object.keys(entry.phases).length === 8).length, 426);
  assert.equal(native.filter(entry => Object.keys(entry.phases).length < 8).length, 2);
  assert.equal(validation.distAssets.length, 982);
  for (const asset of validation.distAssets) assert.equal(sha(await readBytes('public' + asset.sheet)), asset.sha256, asset.sheet + ': W15 PNG changed');
  const nativeReportPath = previousDirectory + '/browser/native-presentations.json';
  const baseReportPath = previousDirectory + '/browser/base-corrections.json';
  for (const relative of [nativeReportPath, baseReportPath]) {
    assert.equal(sha(await readBytes(relative)), audit.inputHashes[relative], relative + ': validated W15 browser report changed');
  }
  const nativeReport = await readJson(nativeReportPath), baseReport = await readJson(baseReportPath);
  assert.equal(nativeReport.passed, true); assert.equal(baseReport.passed, true);
  assert.equal(nativeReport.preliminary, false); assert.equal(baseReport.preliminary, false);
  async function traceFromBoundArtifact(report, filename) {
    const proof = report.artifacts.find(artifact => artifact.path.endsWith('/' + filename));
    assert.ok(proof, filename + ': absent from validated W15 artifact manifest');
    const bytes = await readBytes(proof.path);
    assert.equal(sha(bytes), proof.sha256, proof.path + ': W15 recorded geometry changed');
    return JSON.parse(bytes);
  }
  const nativeTrace = await traceFromBoundArtifact(nativeReport, 'native-presentations-trace.json');
  const baseTrace = await traceFromBoundArtifact(baseReport, 'base-corrections-trace.json');
  const historicalFallbackTrace = await traceFromBoundArtifact(nativeReport, 'historical-partial-fallback-trace.json');
  assert.equal(nativeTrace.length, 27328); assert.equal(baseTrace.length, 11968);
  assert.equal(historicalFallbackTrace.length, 128);
  return {
    auditPath, auditSha256: sha(auditBytes), validationPath, validationSha256: sha(await readBytes(validationPath)),
    registries, native, bases, pngs: validation.distAssets,
    nativeTrace, baseTrace, historicalFallbackTrace
  };
}

export async function wave16Assets(kind, { preliminary }) {
  const planPath = waveDirectory + '/batch-plan-before.json', plan = effectiveBatchPlan();
  const selectedIds = Object.values(plan.parts).flat();
  assert.equal(selectedIds.length, 120); assert.equal(new Set(selectedIds).size, 120);
  const stem = kind === 'native' ? 'characterAnimationsWave16Part' : 'characterSpriteCorrectionsWave16Part';
  const registries = [];
  for (const part of Object.keys(plan.parts)) {
    const relative = 'src/game/combat/' + stem + part + '.generated.json';
    if (!await fileExists(relative)) { assert.ok(preliminary, relative + ': final registry absent'); continue; }
    const bytes = await readBytes(relative), record = JSON.parse(bytes);
    registries.push({ path: relative, sha256: sha(bytes), part, entries: record.entries });
  }
  const entries = registries.flatMap(record => record.entries.map(entry => ({ ...entry, browserReviewPart: record.part })));
  assert.ok(entries.length > 0, 'No actually delivered W16 ' + kind + ' registry is available yet');
  assert.equal(new Set(entries.map(entry => entry.heroId)).size, entries.length);
  for (const entry of entries) {
    assert.ok(selectedIds.includes(entry.heroId), entry.heroId + ': outside frozen 120-character selection');
    assert.equal(sha(await readBytes('public' + entry.sheet)), entry.sha256, entry.heroId + ': native delivery hash mismatch');
    assert.equal(entry.frameWidth, 256); assert.equal(entry.frameHeight, 256);
    assert.equal(entry.width, 1024); assert.equal(entry.height, kind === 'native' ? 2048 : 1024);
  }
  const refusals = [], provenancePaths = plan.amendments.map(record => record.path);
  const reviewed = new Map(plan.reviewedRows.map(row => [row.hero.id, row]));
  // Withheld original identities remain explicit evidence outside the effective
  // 3x40 drawing cohort. Read the real error verbatim; different request scopes
  // (Robin RPG16 versus the three native48 requests) are never conflated.
  for (const decision of plan.withheld) {
    const { withheldId: id, refusal } = decision;
    assert.equal(selectedIds.includes(id), false);
    assert.ok(!entries.some(entry => entry.heroId === id), id + ': withheld identity counted as new artwork');
    const bytes = await readBytes(refusal.path);
    assert.equal(sha(bytes), refusal.sha256); assert.ok(bytes.toString().includes(refusal.requestId));
    assert.ok(bytes.toString().includes('moderation_blocked'));
    const original = reviewed.get(id); assert.ok(original?.referenceAsset && original.referenceSha256, id);
    assert.equal(sha(await readBytes('public' + original.referenceAsset)), original.referenceSha256, id + ': fallback changed');
    refusals.push({ heroId: id, path: refusal.path, sha256: sha(bytes), requestId: refusal.requestId,
      actualScope: refusal.actualScope, classification: decision.nativeRequestStatus,
      effectiveDrawingSlot: false, retryPerformed: false,
      referenceAsset: original.referenceAsset, referenceSha256: original.referenceSha256 });
    provenancePaths.push(refusal.path);
  }
  const refusedIds = refusals.map(entry => entry.heroId).sort();
  const missingIds = selectedIds.filter(id => !entries.some(entry => entry.heroId === id)).sort();
  if (!preliminary) assert.deepEqual(missingIds, [], 'All120 effective identities must have their real final delivery');
  for (const part of ['part-a', 'part-b', 'part-c']) {
    const directory = waveDirectory + '/' + part;
    if (await fileExists(directory + '/sources')) provenancePaths.push(...await walk(directory + '/sources', file => /\.(?:png|txt|json)$/.test(file)));
    for (const name of ['generation-records.json', 'native-provenance.json', 'base-provenance.json']) {
      if (await fileExists(directory + '/' + name)) provenancePaths.push(directory + '/' + name);
    }
  }
  return { kind, planPath, planSha256: sha(await readBytes(planPath)), selectedIds, registries,
    entries, refusedIds, refusals, missingIds, provenancePaths: [...new Set(provenancePaths)].sort(),
    initialRefusalIds: refusals.filter(entry => entry.classification === 'initial-native48-request-refused').map(entry => entry.heroId).sort(),
    sourceRejectedIds: refusals.filter(entry => entry.classification === 'source-rejected-correction-refused').map(entry => entry.heroId).sort(),
    pendingIds: missingIds.filter(id => !refusedIds.includes(id)) };
}

export async function snapshotPresentationInputs({ preliminary, extraFiles = [] } = {}) {
  const paths = new Set(['package.json', ...await walk('src', file => /\.(?:js|jsx|json)$/.test(file)), ...extraFiles]);
  const previous = await previousWaveBaseline();
  for (const asset of previous.pngs) paths.add('public' + asset.sheet);
  const plan = effectiveBatchPlan();
  for (const record of plan.amendments) paths.add(record.path);
  for (const entry of plan.reviewedRows) if (entry.referenceAsset) paths.add('public' + entry.referenceAsset);
  // Retained Star Wars images remain historical fallbacks after explicit W15
  // refusals. Hash both existing Obi-Wan filenames without choosing an alias.
  for (const file of await walk('public/sprites/generated/heroes/star-wars', file => file.endsWith('.png'))) paths.add(file);
  for (const relative of [...paths].filter(file => file.endsWith('.generated.json'))) {
    const record = await readJson(relative);
    for (const entry of record.entries || []) if (typeof entry.sheet === 'string' && entry.sheet.startsWith('/sprites/')) paths.add('public' + entry.sheet);
  }
  const freezePath = waveDirectory + '/production-freeze.json';
  let freeze = null, freezeSha256 = null;
  if (await fileExists(freezePath)) {
    const bytes = await readBytes(freezePath); freeze = JSON.parse(bytes); freezeSha256 = sha(bytes);
    if (!preliminary) assert.equal(freeze.productionFrozen, true);
    for (const relative of Object.keys(freeze.files || {})) paths.add(relative);
  } else assert.ok(preliminary, 'Final production-freeze.json is required');
  const hashes = {};
  for (const relative of [...paths].sort()) hashes[relative] = sha(await readBytes(relative));
  if (!preliminary) for (const [relative, expected] of Object.entries(freeze.files)) assert.equal(hashes[relative], expected, relative + ': final freeze mismatch');
  return { hashes, sha256: sha(Buffer.from(JSON.stringify(hashes))), productionFreezePath: freeze ? freezePath : null,
    productionFreezeSha256: freezeSha256, productionFreezeFileCount: Object.keys(freeze?.files || {}).length,
    historicalRegistryHashesPreserved: previous.registries.length, historicalPngHashesPreserved: previous.pngs.length };
}

export async function finishPresentationIntegrity(before, options) {
  const after = await snapshotPresentationInputs(options);
  const stable = equivalent(before, after);
  if (!options.preliminary) assert.ok(stable, 'A production input changed during the final browser verification');
  return { after, stable, productionInputCount: Object.keys(before.hashes).length };
}

export async function writeJson(relative, value) {
  await fs.mkdir(path.dirname(path.resolve(repositoryRoot, relative)), { recursive: true });
  await fs.writeFile(path.resolve(repositoryRoot, relative), JSON.stringify(value, null, 2) + '\n');
}
export async function hashPresentationArtifacts(files) {
  const artifacts = [];
  for (const relative of [...new Set(files)].sort()) {
    const bytes = await readBytes(relative);
    artifacts.push({ path: relative, sha256: sha(bytes), bytes: bytes.length });
  }
  return artifacts;
}
