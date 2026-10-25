import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const waveDirectory = 'docs/combat-fidelity-wave13-2026-10-24';
const previousDirectory = 'docs/combat-fidelity-wave12-2026-10-23';
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
  assert.equal(sha(auditBytes), validation.currentAuditSha256, 'Historical W12 audit is not its actually validated snapshot');
  const audit = JSON.parse(auditBytes), registries = [], native = [], bases = [];
  for (const relative of audit.assetInventory.registries) {
    const bytes = await readBytes(relative);
    assert.equal(sha(bytes), audit.inputHashes[relative], relative + ': W12 registry changed');
    const record = { path: relative, sha256: sha(bytes) };
    registries.push(record);
    const entries = JSON.parse(bytes).entries || [];
    if (/\/characterAnimations[^/]*\.generated\.json$/.test(relative)) native.push(...entries);
    if (/\/characterSpriteCorrections[^/]*\.generated\.json$/.test(relative)) bases.push(...entries);
  }
  assert.equal(registries.length, 104);
  assert.equal(native.length, 233); assert.equal(bases.length, 179);
  assert.equal(validation.distAssets.length, 556);
  for (const asset of validation.distAssets) assert.equal(sha(await readBytes('public' + asset.sheet)), asset.sha256, asset.sheet + ': W12 PNG changed');
  const nativeReport = await readJson(previousDirectory + '/browser/native-presentations.json');
  const baseReport = await readJson(previousDirectory + '/browser/base-corrections.json');
  const fallbackFiles = ['beast-boy-fallback-trace.json', 'janine-presentation-fallback-trace.json', 'morty-presentation-fallback-trace.json'];
  for (const [report, file] of [[nativeReport, 'native-presentations-trace.json'], [baseReport, 'base-corrections-trace.json'], ...fallbackFiles.map(file => [nativeReport, file])]) {
    const relative = previousDirectory + '/browser/' + file;
    const proof = report.artifacts.find(artifact => artifact.path === relative);
    assert.ok(proof, relative + ': absent from W12 artifact manifest');
    assert.equal(sha(await readBytes(relative)), proof.sha256, relative + ': W12 recorded geometry changed');
  }
  const historicalFallbackTrace = (await Promise.all(fallbackFiles.map(file => readJson(previousDirectory + '/browser/' + file)))).flat();
  assert.equal(historicalFallbackTrace.length, 128);
  return {
    auditPath, auditSha256: sha(auditBytes), validationPath, validationSha256: sha(await readBytes(validationPath)),
    registries, native, bases, pngs: validation.distAssets,
    nativeTrace: await readJson(previousDirectory + '/browser/native-presentations-trace.json'),
    baseTrace: await readJson(previousDirectory + '/browser/base-corrections-trace.json'), historicalFallbackTrace
  };
}

export async function wave13Assets(kind, { preliminary }) {
  const planPath = waveDirectory + '/batch-plan-before.json', plan = await readJson(planPath);
  const selectedIds = Object.values(plan.parts).flat();
  assert.equal(selectedIds.length, 40); assert.equal(new Set(selectedIds).size, 40);
  const stem = kind === 'native' ? 'characterAnimationsWave13Part' : 'characterSpriteCorrectionsWave13Part';
  const registries = [];
  for (const part of Object.keys(plan.parts)) {
    const relative = 'src/game/combat/' + stem + part + '.generated.json';
    if (!await fileExists(relative)) { assert.ok(preliminary, relative + ': final registry absent'); continue; }
    const bytes = await readBytes(relative), record = JSON.parse(bytes);
    registries.push({ path: relative, sha256: sha(bytes), part, entries: record.entries });
  }
  const entries = registries.flatMap(record => record.entries.map(entry => ({ ...entry, browserReviewPart: record.part })));
  assert.ok(entries.length > 0, 'No actually delivered W13 ' + kind + ' registry is available yet');
  assert.equal(new Set(entries.map(entry => entry.heroId)).size, entries.length);
  for (const entry of entries) {
    assert.ok(selectedIds.includes(entry.heroId), entry.heroId + ': outside frozen 40-character selection');
    assert.equal(sha(await readBytes('public' + entry.sheet)), entry.sha256, entry.heroId + ': native delivery hash mismatch');
    assert.equal(entry.frameWidth, 256); assert.equal(entry.frameHeight, 256);
    assert.equal(entry.width, 1024); assert.equal(entry.height, kind === 'native' ? 2048 : 1024);
  }
  const refusals = [], provenancePaths = [];
  for (const part of ['part-a', 'part-b']) {
    const sources = waveDirectory + '/' + part + '/sources';
    if (!await fileExists(sources)) continue;
    for (const file of await walk(sources, file => file.endsWith('-tool-result.json'))) {
      const bytes = await readBytes(file), value = JSON.parse(bytes);
      if (!value.failed || value.code !== 'moderation_blocked') continue;
      // Corrective requests use IDs such as "ahsoka_adult-correction16".
      // They document the correction attempt rather than an initial refusal
      // of another roster identity, and must not be treated as one.
      if (!selectedIds.includes(value.heroId)) continue;
      if (!file.endsWith('/' + value.heroId + '-tool-result.json')) continue;
      assert.ok(selectedIds.includes(value.heroId), file + ': unknown refused identity');
      assert.equal(value.imageReturned, false); assert.equal(value.retryPerformed, false);
      assert.ok(value.requestId);
      assert.ok(!entries.some(entry => entry.heroId === value.heroId), value.heroId + ': refused request counted as native delivery');
      const original = plan.heroes.find(entry => entry.hero?.id === value.heroId);
      assert.ok(original?.referenceAsset && original.referenceSha256, value.heroId + ': no independently frozen pre-edit image');
      assert.equal(sha(await readBytes('public' + original.referenceAsset)), original.referenceSha256, value.heroId + ': historical fallback image was replaced');
      refusals.push({ heroId: value.heroId, path: file, sha256: sha(bytes), code: value.code, requestId: value.requestId,
        classification: 'initial-request-refused', initialImageReturned: false, retryPerformed: false,
        referenceAsset: original.referenceAsset, referenceSha256: original.referenceSha256 });
      provenancePaths.push(file);
    }
  }
  // A received source may fail visual review before its corrective requests
  // are refused. Such a character is still absent, but is not an initial
  // refusal. Bind the artist's explicit decision to every real receipt/image.
  for (const part of ['part-a', 'part-b']) {
    const manifestPath = waveDirectory + '/' + part + '/request-failures.json';
    if (!await fileExists(manifestPath)) continue;
    const manifestBytes = await readBytes(manifestPath), manifest = JSON.parse(manifestBytes);
    provenancePaths.push(manifestPath);
    for (const failure of manifest.failures || []) {
      if (failure.initialImageReturned !== true) continue;
      const id = failure.heroId;
      assert.ok(selectedIds.includes(id), manifestPath + ': unselected rejected identity');
      assert.equal(failure.native32Published, false); assert.equal(failure.base16Published, false);
      assert.equal(failure.historicalFallbackIsNewDelivery, false); assert.equal(failure.retryPerformed, false);
      assert.ok(!entries.some(entry => entry.heroId === id), id + ': rejected source published');
      assert.ok(!refusals.some(entry => entry.heroId === id), id + ': initial/source-rejected categories overlap');
      const initialPath = waveDirectory + '/' + part + '/sources/' + id + '-tool-result.json';
      const initialBytes = await readBytes(initialPath), initial = JSON.parse(initialBytes);
      assert.equal(initial.heroId, id); assert.equal(initial.imageReturned, true); assert.notEqual(initial.failed, true);
      provenancePaths.push(initialPath);
      const rejectedSources = [];
      assert.ok(failure.rejectedNativeSources?.length > 0, id + ': no reviewed source was recorded');
      for (const source of failure.rejectedNativeSources) {
        assert.equal(source.acceptedForDelivery, false);
        assert.equal(sha(await readBytes(source.path)), source.sha256, id + ': rejected source provenance changed');
        provenancePaths.push(source.path); rejectedSources.push(source);
      }
      const corrections = [];
      assert.ok(failure.receipts?.length > 0, id + ': no real correction refusal was recorded');
      for (const receipt of failure.receipts) {
        const bytes = await readBytes(receipt.receipt), value = JSON.parse(bytes);
        assert.equal(sha(bytes), receipt.receiptSha256); assert.ok(value.heroId.startsWith(id + '-correction'));
        assert.equal(value.failed, true); assert.equal(value.code, 'moderation_blocked');
        assert.equal(value.imageReturned, false); assert.equal(value.retryPerformed, false);
        assert.equal(value.requestId, receipt.requestId);
        provenancePaths.push(receipt.receipt); corrections.push(receipt);
      }
      const original = plan.heroes.find(entry => entry.hero?.id === id);
      assert.equal(failure.referenceAsset, original.referenceAsset);
      assert.equal(failure.referenceSha256, original.referenceSha256);
      assert.equal(sha(await readBytes('public' + original.referenceAsset)), original.referenceSha256);
      refusals.push({ heroId: id, path: manifestPath, sha256: sha(manifestBytes), code: failure.code,
        classification: 'source-rejected-and-corrections-refused', initialImageReturned: true,
        initialReceipt: initialPath, initialReceiptSha256: sha(initialBytes), corrections, rejectedSources,
        retryPerformed: false, referenceAsset: original.referenceAsset, referenceSha256: original.referenceSha256 });
    }
  }
  const refusedIds = [...new Set(refusals.map(entry => entry.heroId))].sort();
  const missingIds = selectedIds.filter(id => !entries.some(entry => entry.heroId === id)).sort();
  if (!preliminary) assert.deepEqual(missingIds, refusedIds, 'Every selected non-refused character must have a final delivery');
  return { kind, planPath, planSha256: sha(await readBytes(planPath)), selectedIds, registries,
    entries, refusedIds, refusals, missingIds, provenancePaths: [...new Set(provenancePaths)].sort(),
    initialRefusalIds: refusals.filter(entry => !entry.initialImageReturned).map(entry => entry.heroId).sort(),
    sourceRejectedIds: refusals.filter(entry => entry.initialImageReturned).map(entry => entry.heroId).sort(),
    pendingIds: missingIds.filter(id => !refusedIds.includes(id)) };
}

export async function snapshotPresentationInputs({ preliminary, extraFiles = [] } = {}) {
  const paths = new Set(['package.json', ...await walk('src', file => /\.(?:js|jsx|json)$/.test(file)), ...extraFiles]);
  const previous = await previousWaveBaseline();
  for (const asset of previous.pngs) paths.add('public' + asset.sheet);
  // Retained Star Wars images remain historical fallbacks after explicit W13
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
