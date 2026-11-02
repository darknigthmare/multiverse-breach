import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { resolveNativeOnlyCorrections } from './builder.mjs';
const root = path.resolve(import.meta.dirname, '../../..');
const dir = import.meta.dirname;
const read = relative => fs.readFile(path.resolve(root, relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file);
const check = process.argv.includes('--check');
const sourcePlanPath = relative(path.join(dir, 'source-plan.json'));
const sourcePlanBytes = await read(sourcePlanPath);
assert.equal(hash(sourcePlanBytes), 'f6cc9213b714927b2f4c234cdbecffb502801893e20b68106c29b6185e0d615d');
const sourcePlan = JSON.parse(sourcePlanBytes);
const plan = await json('docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json');
const records = await json(relative(path.join(dir, 'generation-records.json')));
const preservation = await json('docs/combat-fidelity-wave15-2026-10-26/baseline-preservation.json');
assert.equal(records.records.length, 40);
assert.deepEqual(records.nativeOnlyCorrections.map(correction => correction.heroId).sort(), ['hexen_baratus', 'quake_franchise_ranger']);
assert.deepEqual(records.remainingHeroIds, []);
assert.deepEqual(records.blockedHeroIds, []);
assert.deepEqual(Object.keys(sourcePlan.entries).sort(), [...plan.parts.A].sort());
const prior = [...Object.entries(preservation.pngFiles), ...Object.entries(preservation.registries)];
for (const [file, sha256] of prior) assert.equal(hash(await read(file)), sha256, 'Historical asset changed: ' + file);
const native = await json('src/game/combat/characterAnimationsWave15PartA.generated.json');
const base = await json('src/game/combat/characterSpriteCorrectionsWave15PartA.generated.json');
for (const registry of [native, base]) assert.deepEqual(registry.entries.map(e => e.heroId).sort(), [...plan.parts.A].sort());
const sourceEntries = [], retained = new Set(), allFrameHashes = [], sheets = [], references = [];
for (const original of records.records) {
  const record = resolveNativeOnlyCorrections(original, records.nativeOnlyCorrections);
  const version = sourcePlan.entries[record.heroId];
  assert.equal(record.sourceWork, version.sourceWork);
  assert.equal(record.version, version.appearance);
  assert.equal(record.targetBodyHeight, version.bodyHeight);
  const reference = await read(record.referenceArchive);
  assert.equal(hash(reference), record.referenceAssetSha256);
  assert.equal(hash(await read('public' + record.referenceAsset)), record.referenceAssetSha256);
  references.push({ heroId: record.heroId, referenceAsset: record.referenceAsset, sha256: record.referenceAssetSha256 });
  const sourceUsed = new Map();
  for (const selection of [...record.nativeSelections, ...record.baseSelections]) {
    assert.equal(record.sources[selection.source].importRegionsFile.endsWith('.json'), true);
    const review = await json(record.sources[selection.source].importRegionsFile);
    const sequence = review.sequences[selection.row];
    assert.equal(sequence.length, 4);
    const order = selection.columnOrder || [0, 1, 2, 3];
    assert.deepEqual([...order].sort(), [0, 1, 2, 3]);
    for (const column of order) {
      const region = sequence[column];
      const key = record.sources[selection.source].sha256 + ':' + region.physicalRow + ':' + region.physicalColumn;
      assert.equal(retained.has(key), false, 'Source drawing selected more than once');
      retained.add(key);
      sourceUsed.set(selection.source, (sourceUsed.get(selection.source) || 0) + 1);
      assert.ok(region.body.left > 0 && region.body.top > 0 && region.body.right < review.width - 1 && region.body.bottom < review.height - 1, 'Source-cut selected figure');
    }
  }
  for (const [index, source] of record.sources.entries()) {
    const bytes = await read(source.archivedPath);
    assert.equal(hash(bytes), source.sha256);
    assert.equal(hash(await read(source.importRegionsFile)), source.importRegionsSha256);
    const receipt = await json(source.toolResultFile);
    assert.equal(receipt.tool, 'image_gen');
    assert.equal(receipt.imageReturned, true);
    assert.equal(receipt.arguments.transparent_background, true);
    assert.equal(receipt.arguments.prompt, source.prompt);
    assert.equal((await read(source.promptFile)).toString().trimEnd(), source.prompt.trimEnd());
    assert.equal(source.nativeDrawingsRetainedByImport, sourceUsed.get(index) || 0);
    assert.equal(source.nativeDrawingsExcluded, source.nativeDrawingsObserved - source.nativeDrawingsRetainedByImport);
    sourceEntries.push({ heroId: record.heroId, path: source.archivedPath, sha256: source.sha256,
      receipt: source.toolResultFile, observedDrawings: source.nativeDrawingsObserved,
      retainedDrawings: source.nativeDrawingsRetainedByImport, excludedDrawings: source.nativeDrawingsExcluded });
  }
  const heroHashes = [];
  for (const [kind, registry] of [['native', native], ['base', base]]) {
    const entry = registry.entries.find(e => e.heroId === record.heroId);
    const bytes = await read('public' + entry.sheet);
    assert.equal(hash(bytes), entry.sha256);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 1024);
    assert.equal(info.height, kind === 'native' ? 2048 : 1024);
    const count = kind === 'native' ? 32 : 16;
    for (let cell = 0; cell < count; cell++) {
      const row = Math.floor(cell / 4), column = cell % 4;
      const pixels = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * info.width + column * 256 + x) * 4;
        const alpha = data[offset + 3];
        if (alpha > 0) data.copy(pixels, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 24) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, entry.heroId + ': nontransparent safety border');
      }
      assert.ok(visible > 300);
      const sha256 = hash(pixels);
      heroHashes.push(sha256); allFrameHashes.push(sha256);
    }
    for (const row of entry.normalization.rows) assert.ok(row.renderScale >= 1 && Number.isFinite(row.renderScale));
    sheets.push({ heroId: entry.heroId, kind, sheet: entry.sheet, sha256: entry.sha256, frames: count });
  }
  assert.equal(new Set(heroHashes).size, 48, record.heroId + ': repeated final drawing between phases or base states');
}
assert.equal(new Set(allFrameHashes).size, 1920, 'Repeated final RGBA drawing across the batch');
assert.equal(retained.size, 1920);
assert.equal(sourceEntries.length, 54);
assert.equal(new Set(sourceEntries.map(e => e.sha256)).size, 54);
const observed = sourceEntries.reduce((sum, source) => sum + source.observedDrawings, 0);
const excluded = sourceEntries.reduce((sum, source) => sum + source.excludedDrawings, 0);
assert.equal(observed, 2176);
assert.equal(excluded, 256);
const anchorsPath = 'src/game/combat/nativeSuperAnchorsWave15PartA.generated.json';
const anchors = await json(anchorsPath);
const muzzle = await json(relative(path.join(dir, 'native-muzzle-review.json')));
assert.equal(Object.keys(anchors).length, 32);
assert.equal(muzzle.points, 256);
assert.deepEqual(muzzle.pending, []);
for (const point of muzzle.entries) {
  assert.deepEqual(anchors[point.heroId][point.phase][point.column], point.point);
  const sheetBytes = await read('public' + point.sheet);
  assert.equal(hash(sheetBytes), point.sheetSha256);
  const cellBytes = await read(point.cell);
  assert.equal(hash(cellBytes), point.cellSha256);
  const { data } = await sharp(cellBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const offset = (point.point.y * 256 + point.point.x) * 4;
  assert.deepEqual([...data.subarray(offset, offset + 4)], point.rgba);
  assert.ok(point.rgba[3] >= 128 && point.manualToPixelSnapDistance <= 6);
}
for (const contact of muzzle.contacts) assert.equal(hash(await read(contact.path)), contact.sha256);
const report = { schemaVersion: 1, wave: 15, part: 'A', passed: true, sourcePlanSha256: hash(sourcePlanBytes),
  heroes: 40, nativeAtlases: 40, nativePoses: 1280, baseAtlases: 40, basePoses: 640,
  newProductionPngFiles: 80, distinctNativeDrawings: 1920, generationCalls: 54,
  observedDrawings: observed, excludedDrawings: excluded, refusedCalls: 0,
  historicalPreservation: { pngFiles: Object.keys(preservation.pngFiles).length, registryFiles: Object.keys(preservation.registries).length, byteIdentical: true },
  nativeMuzzleAnchors: { heroes: 32, points: 256, sha256: hash(await read(anchorsPath)), physicalCellPixelsVerified: true },
  source1to1Verified: false, references, sheets, sources: sourceEntries };
const outputs = {
  'verification.json': report,
  'generation-inventory.json': { schemaVersion: 1, part: 'A', tool: 'image_gen', calls: 54, observedDrawings: observed, retainedDrawings: 1920, excludedDrawings: excluded, refusedCalls: 0, entries: sourceEntries, source1to1Verified: false },
  'source-exclusions.json': { schemaVersion: 1, part: 'A', observedDrawings: observed, retainedDrawings: 1920, excludedDrawings: excluded,
    rules: 'Only the actual48 unique source drawings selected per character count. Superseded full sources, missing/incomplete sequences, source-clipped poses and the prior Grey timing order are not additional production poses. The original four Baratus SUPER and four Ranger SUPER drawings are excluded because their impact pose loses or hides the held axe. Their native-only replacements leave all base16 pixels and the original source scales unchanged. Alpha detection only selects import geometry; source RGBA is retained.',
    entries: sourceEntries.filter(e => e.excludedDrawings > 0), source1to1Verified: false }
};
for (const [name, value] of Object.entries(outputs)) {
  const file = path.join(dir, name);
  if (check) assert.deepEqual(JSON.parse(await fs.readFile(file)), value, name + ': stale verification');
  else await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: true, check, heroes: 40, png: 80, poses: 1920, calls: 54, observed, excluded, historicalPng: 730, historicalRegistries: 118 }));
