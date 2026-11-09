import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const prefix = 'docs/combat-fidelity-wave17-2026-11-02/part-a/';
const registryPath = 'src/game/combat/characterAnimationsWave17PartA.generated.json';
const anchorsPath = 'src/game/combat/nativeSuperAnchorsWave17PartA.generated.json';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
// Rebuild the256px cell exclusively from the recorded original source ROI and
// nearest-neighbour transform; this validates provenance without drawing pixels.
async function reconstructFrameCell(normalization, column) {
  const frame = normalization.frameBounds[column];
  const sourceRaw=await sharp(normalization.sourceImage).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const input = await sharp(sourceRaw.data,{raw:sourceRaw.info})
    .extract({ left: frame.source.left, top: frame.source.top,
      width: frame.source.width, height: frame.source.height })
    .resize(frame.output.width, frame.output.height, { kernel: 'nearest' }).png().toBuffer();
  return sharp({ create: { width:256, height:256, channels:4,
    background:{r:0,g:0,b:0,alpha:0} } }).composite([
      { input, left:frame.output.left, top:frame.output.top }
    ]).ensureAlpha().raw().toBuffer();
}
const registry = readJson(registryPath);
const ids = process.argv.filter(value => value.startsWith('--id=')).map(value => value.slice(5));
const entries = registry.entries.filter(entry => !ids.length || ids.includes(entry.heroId));
const manualPath = prefix + 'native-muzzle-review-manual.json';
const plan = readJson('docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json');
const amendmentPrefix = 'docs/combat-fidelity-wave17-2026-11-02/';
const amendmentFiles = fs.readdirSync(amendmentPrefix)
  .filter(file => /^batch-amendments(?:-\d+)?-before-generation\.json$/.test(file))
  .sort((a, b) => Number(a.match(/amendments-(\d+)/)?.[1] || 1)
    - Number(b.match(/amendments-(\d+)/)?.[1] || 1))
  .map(file => amendmentPrefix + file);
const replacements = new Map(amendmentFiles.flatMap(file => readJson(file).replacements)
  .filter(row => row.part === 'A')
  .map(row => [row.withheldId, row.replacementId]));
const expectedIds = plan.parts.A.map(original => {
  const seen = new Set(); let id = original;
  while (replacements.has(id)) {
    assert.ok(!seen.has(id), 'Cyclic identity amendment: ' + original);
    seen.add(id); id = replacements.get(id);
  }
  return id;
});
assert.equal(expectedIds.length, 40);
assert.equal(new Set(expectedIds).size, 40);

if (process.argv.includes('--contact')) {
  for (const entry of entries) {
    const png = fs.readFileSync('public' + entry.sheet);
    assert.equal(sha(png), entry.sha256, entry.heroId);
    const cells = [];
    for (const [row, phase] of ['fatality', 'super'].entries()) {
      cells.push({ input: await sharp(png).extract({ left: 0, top: entry.phases[phase].row * 256,
        width: 1024, height: 256 }).png().toBuffer(), left: 0, top: row * 256 });
    }
    const grid = ['<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512">'];
    for (let column = 0; column < 4; column++) for (let row = 0; row < 2; row++) {
      for (let tick = 32; tick < 256; tick += 32) {
        grid.push(`<path d="M ${column * 256 + tick} ${row * 256} v 256 M ${column * 256} ${row * 256 + tick} h 256" stroke="#47bde0" stroke-opacity="0.16"/>`);
      }
      grid.push(`<text x="${column * 256 + 4}" y="${row * 256 + 14}" font-size="12" fill="white">${row ? 'super' : 'fatality'} ${column}</text>`);
    }
    grid.push('</svg>');
    await sharp({ create: { width: 1024, height: 512, channels: 4,
      background: { r: 30, g: 30, b: 30, alpha: 1 } } }).composite([...cells,
      { input: Buffer.from(grid.join('')), left: 0, top: 0 }]).png()
      .toFile(prefix + 'native-muzzle-review-' + entry.heroId + '.png');
  }
  console.log(JSON.stringify({ contactSheets: entries.length }));
}

if (process.argv.includes('--measure')) {
  const manual = readJson(manualPath), anchors = {}, measurements = [], heroes = [];
  for (const [heroId, reviewed] of Object.entries(manual.heroes)) {
    assert.ok(expectedIds.includes(heroId), heroId + ': identity is outside the effective40');
    const entry = registry.entries.find(value => value.heroId === heroId);
    assert.ok(entry, heroId + ': native registry entry absent');
    const png = fs.readFileSync('public' + entry.sheet);
    assert.equal(sha(png), entry.sha256, heroId + ': native atlas changed');
    assert.equal(entry.sha256, reviewed.sheetSha256, heroId + ': review is stale');
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    anchors[heroId] = {};
    const measuredCrops = [];
    for (const [phaseRow, phase] of ['fatality', 'super'].entries()) {
      const points = reviewed[phase];
      assert.equal(points.length, 4, heroId + '/' + phase);
      const normalization = entry.normalization.rows.find(row => row.phase === phase);
      assert.ok(normalization, heroId + ': phase source trace absent');
      const source = fs.readFileSync(normalization.sourceImage);
      assert.equal(sha(source), normalization.sourceImageSha256);
      anchors[heroId][phase] = [];
      for (const [column, [mx, my]] of points.entries()) {
        const candidates = [];
        for (let y = my - 3; y <= my + 3; y++) for (let x = mx - 3; x <= mx + 3; x++) {
          if (x < 0 || y < 0 || x > 255 || y > 255) continue;
          const offset = ((entry.phases[phase].row * 256 + y) * info.width + column * 256 + x) * 4;
          const rgba = [...data.subarray(offset, offset + 4)];
          if (rgba[3] >= 128) candidates.push({ x, y, rgba, distanceSquared: (x - mx) ** 2 + (y - my) ** 2 });
        }
        candidates.sort((a, b) => a.distanceSquared - b.distanceSquared);
        assert.ok(candidates.length, heroId + '/' + phase + '/' + column + ': selected anatomical/equipment point has no visible pixel within3px');
        const chosen = candidates[0], point = { x: chosen.x, y: chosen.y };
        anchors[heroId][phase].push(point);
        const reconstructed = await reconstructFrameCell(normalization, column);
        const sourceResampledRgba = [...reconstructed.subarray((point.y*256+point.x)*4,(point.y*256+point.x)*4+4)];
        assert.deepEqual(sourceResampledRgba, chosen.rgba, heroId+'/'+phase+'/'+column+': source-to-packed RGBA differs');
        const cell = await sharp(png).extract({ left: column * 256, top: entry.phases[phase].row * 256,
          width: 256, height: 256 }).png().toBuffer();
        const left = Math.max(0, Math.min(216, chosen.x - 20));
        const top = Math.max(0, Math.min(216, chosen.y - 20));
        const marker = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect x="${(chosen.x - left) * 4 - 3}" y="${(chosen.y - top) * 4 - 3}" width="7" height="7" fill="none" stroke="#ff00ff"/></svg>`);
        const crop = await sharp(cell).extract({ left, top, width: 40, height: 40 })
          .resize(160, 160, { kernel: 'nearest' }).composite([{ input: marker, left: 0, top: 0 }]).png().toBuffer();
        measuredCrops.push({ input: crop, left: column * 160, top: phaseRow * 160 });
        const frame = normalization.frameBounds[column];
        const sourcePointApproximate = { x: frame.source.left + (point.x - frame.output.left) * frame.source.width / frame.output.width,
          y: frame.source.top + (point.y - frame.output.top) * frame.source.height / frame.output.height };
        measurements.push({ heroId, phase, column, point, manualPoint: { x: mx, y: my },
          manualToPixelSnapDistance: Math.sqrt(chosen.distanceSquared), rgba: chosen.rgba, visiblePixel: true,
          sourceToPackedRgbaTransformVerified:true, sourceResampledRgba,
          reconstructedCellRawSha256:sha(reconstructed),
          emitter: reviewed.emitters?.[phase]?.[column] || reviewed.emitter,
          semanticSelectionNotes: reviewed.notes, semanticEmitterBox: { left: mx - 7, top: my - 7, width: 15, height: 15 },
          sheet: entry.sheet, sheetSha256: entry.sha256, cellSha256: sha(cell),
          sourceImage: normalization.sourceImage, sourceImageSha256: normalization.sourceImageSha256,
          sourceRow: normalization.sourceRow, sourceColumn: normalization.sourceColumns?.[column] ?? normalization.nativeRegions?.[column]?.physicalColumn ?? normalization.sourceFrameOrder[column],
          sourceFrameBounds: frame.source, packedFrameBounds: frame.output, sourcePointApproximate,
          sourceBodyBounds: frame.sourceBodyBounds,
          sourceBodyCalibration: normalization.statureReview,
          sourcePointIsApproximateDueToRasterResampling: true,
          rowRenderScale: normalization.renderScale,
          contactReview: prefix + 'native-muzzle-review-' + heroId + '.png',
          contactReviewSha256: sha(fs.readFileSync(prefix + 'native-muzzle-review-' + heroId + '.png')),
          actualImagesInspected: reviewed.actualImagesInspected,
          markedCropsVisuallyReviewed: reviewed.markedCropsVisuallyReviewed === true,
          measurementBasis: 'Actual final 256px cells inspected using view_image; manually selected visible anatomy/equipment, then measured opaque RGBA within3px. No body-center rule or inferred muzzle.',
          source1to1Verified: false });
      }
    }
    const cropsPath = prefix + 'native-muzzle-review-' + heroId + '-measured-crops.png';
    await sharp({ create: { width: 640, height: 320, channels: 4,
      background: { r: 30, g: 30, b: 30, alpha: 1 } } }).composite(measuredCrops).png().toFile(cropsPath);
    heroes.push({ heroId, sheet: entry.sheet, sheetSha256: entry.sha256,
      measuredCrops: cropsPath, measuredCropsSha256: sha(fs.readFileSync(cropsPath)),
      poseCountAdded: 0, reviewOnly: true });
  }
  const qaContactSheets=[];
  for(let start=0;start<heroes.length;start+=4) {
    const composites=[];
    for(const [slot,hero] of heroes.slice(start,start+4).entries()) {
      const left=(slot%2)*640,top=Math.floor(slot/2)*344;
      composites.push({input:fs.readFileSync(hero.measuredCrops),left,top:top+24});
      composites.push({input:Buffer.from(`<svg width="640" height="24"><text x="5" y="17" fill="white" font-size="16">${hero.heroId}: fatality0–3 / super0–3</text></svg>`),left,top});
    }
    const path=prefix+'native-muzzle-review-qa-batch-'+(start/4+1)+'.png';
    await sharp({create:{width:1280,height:688,channels:4,background:'#222222'}})
      .composite(composites).png().toFile(path);
    qaContactSheets.push({path,sha256:sha(fs.readFileSync(path)),poseCountAdded:0,reviewOnly:true});
  }
  writeJson(anchorsPath, anchors);
  writeJson(prefix + 'native-muzzle-review.json', { schemaVersion: 1, wave: 17, part: 'A',
    measuredAt: new Date().toISOString(), heroes, qaContactSheets, points: measurements.length, entries: measurements,
    manualSelections: { path: manualPath, sha256: sha(fs.readFileSync(manualPath)) },
    effectivePlanAmendments: amendmentFiles.filter(file => readJson(file).replacements.some(row => row.part === 'A'))
      .map(file => ({ path: file, sha256: sha(fs.readFileSync(file)) })),
    measurementHelper: { path: prefix + 'native-muzzle-measure.mjs',
      sha256: sha(fs.readFileSync(prefix + 'native-muzzle-measure.mjs')) },
    runtimeAnchors: { path: anchorsPath, sha256: sha(fs.readFileSync(anchorsPath)) },
    measuredHeroCount: heroes.length, expectedHeroCount: 40,
    pending: expectedIds.filter(id => !anchors[id]),
    source1to1Verified: false, reviewOnly: true, addedAssetPoses: 0 });
  console.log(JSON.stringify({ heroes: heroes.length, points: measurements.length,
    maxSnap: Math.max(...measurements.map(value => value.manualToPixelSnapDistance)) }));
}

if (process.argv.includes('--check-only')) {
  const review = readJson(prefix + 'native-muzzle-review.json');
  const bindings = readJson(anchorsPath), pixels = new Map(), sourceFiles = new Set();
  assert.deepEqual(Object.keys(bindings).sort(), [...expectedIds].sort());
  assert.equal(review.measuredHeroCount, 40); assert.equal(review.points, 320);
  assert.equal(review.heroes.length, 40); assert.equal(review.entries.length, 320);
  assert.equal(new Set(review.entries.map(entry => entry.heroId + '/' + entry.phase + '/' + entry.column)).size, 320);
  for (const id of expectedIds) for (const phase of ['fatality', 'super']) assert.equal(bindings[id][phase].length, 4);
  assert.deepEqual(review.pending, []);
  for (const record of [review.manualSelections, review.measurementHelper, review.runtimeAnchors])
    assert.equal(sha(fs.readFileSync(record.path)), record.sha256, record.path);
  for (const hero of review.heroes) {
    const asset = registry.entries.find(entry => entry.heroId === hero.heroId);
    const bytes = fs.readFileSync('public' + hero.sheet);
    assert.equal(sha(bytes), hero.sheetSha256, hero.heroId);
    assert.equal(asset.sha256, hero.sheetSha256);
    assert.equal(sha(fs.readFileSync(hero.measuredCrops)), hero.measuredCropsSha256);
    pixels.set(hero.heroId, { asset, ...await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true }) });
  }
  for(const contact of review.qaContactSheets)assert.equal(sha(fs.readFileSync(contact.path)),contact.sha256);
  let minimumVisibleNeighborhoodPixels = 81;
  for (const entry of review.entries) {
    assert.ok(['fatality', 'super'].includes(entry.phase) && Number.isInteger(entry.column) && entry.column >= 0 && entry.column < 4);
    assert.equal(entry.markedCropsVisuallyReviewed, true, entry.heroId);
    const { asset, data, info } = pixels.get(entry.heroId), { x, y } = entry.point;
    const normalization=asset.normalization.rows.find(row=>row.phase===entry.phase);
    assert.equal(entry.sourceImage,normalization.sourceImage);
    assert.equal(entry.sourceImageSha256,normalization.sourceImageSha256);
    assert.deepEqual(entry.sourceFrameBounds,normalization.frameBounds[entry.column].source);
    assert.deepEqual(entry.packedFrameBounds,normalization.frameBounds[entry.column].output);
    assert.equal(entry.sourceToPackedRgbaTransformVerified,true);
    const reconstructed=await reconstructFrameCell(normalization,entry.column);
    assert.equal(sha(reconstructed),entry.reconstructedCellRawSha256);
    assert.deepEqual([...reconstructed.subarray((y*256+x)*4,(y*256+x)*4+4)],entry.rgba);
    assert.deepEqual(entry.sourceResampledRgba,entry.rgba);
    const cell=await sharp('public'+asset.sheet).extract({left:entry.column*256,
      top:asset.phases[entry.phase].row*256,width:256,height:256}).png().toBuffer();
    assert.equal(sha(cell),entry.cellSha256);
    const packedRaw=await sharp(cell).ensureAlpha().raw().toBuffer();
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++) {
      const off=((y+dy)*256+x+dx)*4;
      assert.deepEqual([...reconstructed.subarray(off,off+4)],[...packedRaw.subarray(off,off+4)],entry.heroId+': source-to-packed9x9');
    }
    assert.equal(sha(fs.readFileSync(entry.contactReview)),entry.contactReviewSha256);
    assert.ok(entry.actualImagesInspected.includes(entry.sourceImage));
    assert.ok(entry.actualImagesInspected.includes(entry.contactReview));
    assert.ok(x >= 10 && x < 246 && y >= 10 && y < 246);
    assert.deepEqual(bindings[entry.heroId][entry.phase][entry.column], entry.point);
    const offset = ((asset.phases[entry.phase].row * 256 + y) * info.width + entry.column * 256 + x) * 4;
    assert.deepEqual([...data.subarray(offset, offset + 4)], entry.rgba);
    assert.ok(entry.rgba[3] >= 128);
    let visible = 0;
    for (let py = y - 4; py <= y + 4; py++) for (let px = x - 4; px <= x + 4; px++)
      if (data[((asset.phases[entry.phase].row * 256 + py) * info.width + entry.column * 256 + px) * 4 + 3] > 24) visible++;
    assert.ok(visible >= 3, entry.heroId + '/' + entry.phase + '/' + entry.column);
    minimumVisibleNeighborhoodPixels = Math.min(minimumVisibleNeighborhoodPixels, visible);
    if (!sourceFiles.has(entry.sourceImage)) {
      assert.equal(sha(fs.readFileSync(entry.sourceImage)), entry.sourceImageSha256);
      sourceFiles.add(entry.sourceImage);
    }
  }
  console.log(JSON.stringify({ passed: true, readOnly: true, heroes: pixels.size, points: review.entries.length,
    sourceFiles: sourceFiles.size, minimumVisibleNeighborhoodPixels, pending: [],
    markedCropsAllReviewed: true, addedAssetPoses: 0, source1to1Verified: false }));
}
