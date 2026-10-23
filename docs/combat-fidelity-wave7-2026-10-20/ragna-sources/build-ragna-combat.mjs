import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd(), docs = 'docs/combat-fidelity-wave7-2026-10-20/ragna-sources';
const output = 'public/sprites/generated/melee-ragna-wave7', checkOnly = process.argv.includes('--check');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(path.join(root, docs, file), 'utf8'));
const write = async (file, bytes) => {
  if (checkOnly) assert.deepEqual(await fs.readFile(file), Buffer.from(bytes), `${file}: rebuild reviewed Ragna combat assets`);
  else await fs.writeFile(file, bytes);
};
const { plans } = await json('native-prompts.json'), corrective = await json('ragna-combat-correction-prompt.json');
const aerialCorrective = await json('ragna-aerial-intro-correction-prompt.json');
const reviewed = true;
let contacts = {};
try { contacts = await json('hand-measurements-combat.json'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const sourcePlans = {
  a: { id: 'ragna-combat-a-initial', file: '/workspace/generated_images/exec-8e40a6e3-b124-47d8-a210-9610674f180b.png', rows: 8,
    calibration: { state: 'chargeRecovery', row: 7, frame: 3, sourceRoi: { x: 701, y: 1528, width: 183, height: 224 }, sourceBodyHeight: 224 } },
  b: { id: 'ragna-combat-b-initial', file: '/workspace/generated_images/exec-fa2d4b49-058a-4a36-b51c-6103d4f727b6.png', rows: 8,
    calibration: { state: 'intro', row: 5, frame: 0, sourceRoi: { x: 15, y: 1095, width: 193, height: 216 }, sourceBodyHeight: 216 } },
  ledge: { id: 'ragna-ledge', file: '/workspace/generated_images/exec-2d48a884-4493-41c3-bec1-87071a4c163a.png', rows: 5,
    calibration: { state: 'ledgeHang', row: 1, frame: 0, sourceRoi: { x: 53, y: 337, width: 154, height: 252 }, sourceBodyHeight: 252,
      headAnchor: { x: 155, y: 337 }, footAnchor: { x: 135, y: 588 }, measurement: 'Visually inspected approximate white-hair outline to boot sole in straight-legged hanging pose; raised arms, fists and the back-mounted sword are excluded from the body-height interval.' } },
  corrective: { id: 'ragna-combat-correction', file: '/workspace/generated_images/exec-8ca00fa0-6f11-4ac0-a06c-b55019d49908.png', rows: 7,
    calibration: { state: 'excluded-upright-calibration', row: 6, frame: 0, sourceRoi: { x: 50, y: 1428, width: 143, height: 205 }, sourceBodyHeight: 205 } },
  aerial: { id: 'ragna-aerial-intro-correction', file: '/workspace/generated_images/exec-cfa85d51-c6b1-48e0-ab6a-d18ecd63435f.png', rows: 3,
    calibration: { state: 'excluded-upright-calibration', row: 2, frame: 0, sourceRoi: { x: 95, y: 730, width: 179, height: 333 }, sourceBodyHeight: 333 } }
};
const selections = {
  'ragna-combat-a': [['corrective', 0], ['corrective', 1], ['corrective', 2], ['corrective', 3], ['a', 4], ['a', 5], ['corrective', 4], ['a', 7]],
  'ragna-combat-b': [['corrective', 5], ['b', 1], ['b', 2], ['b', 3], ['aerial', 0], ['aerial', 1], ['b', 6], ['b', 7]],
  'ragna-ledge': Array.from({ length: 5 }, (_, row) => ['ledge', row])
};
await fs.mkdir(path.join(root, output), { recursive: true });
const sources = {};
for (const [key, spec] of Object.entries(sourcePlans)) {
  const archive = `${docs}/${spec.id}-source.png`;
  let bytes;
  try { bytes = await fs.readFile(spec.file); } catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, archive)); }
  await write(path.join(root, archive), bytes);
  sources[key] = { ...spec, path: archive, sha256: hash(bytes), byteLength: bytes.length, atlas: await segmentAtlas(path.join(root, archive), spec.rows) };
}
const referencePath = `${docs}/ragna-combat-reference-original.png`, reference = await fs.readFile(path.join(root, referencePath));
assert.equal(hash(reference), '817e9ee373ad036a5ce3ffecbbd70d12717a094bc620601ab4715b77585753ec');
const selectedBySource = Object.fromEntries(Object.keys(sources).map(key => [key, new Set(Object.values(selections).flat().filter(([source]) => source === key).map(([, row]) => row))]));
for (const [key, source] of Object.entries(sources)) {
  const rows = [...selectedBySource[key]].map(row => source.atlas.rows[row]);
  const maxWidth = Math.max(...rows.flatMap(row => row.frames.map(frame => frame.bounds.width)));
  const maxHeight = Math.max(...rows.map(row => Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height)) - Math.min(...row.frames.map(frame => frame.bounds.top))));
  const requestedScale = 190 / source.calibration.sourceBodyHeight, safetyScale = Math.min(232 / maxWidth, 232 / maxHeight);
  const scale = Math.min(requestedScale, safetyScale), normalizedBodyHeight = source.calibration.sourceBodyHeight * scale;
  source.stature = { ...source.calibration, sourceImage: source.path, targetBodyHeight: 190, requestedScale, safetyScale, scale, normalizedBodyHeight,
    renderScale: 190 / normalizedBodyHeight, effectiveBodyHeight: 190, safetyLimited: scale < requestedScale,
    scope: 'One common source-wide nearest-neighbor pixel scale and one common source-wide render factor. All selected poses from this source share both; no per-row or per-pose stature fitting.',
    measurement: source.calibration.measurement || 'Visually inspected upright hair-tip to boot-sole interval in the named native calibration pose. Weapon and aura do not determine stature.' };
}
const entries = [], reviews = [];
for (const plan of plans) {
  const rows = [], overlays = [], frameChecks = [], usedSources = new Set();
  for (const [rowIndex, state] of plan.states.entries()) {
    const [key, sourceRow] = selections[plan.id][rowIndex], source = sources[key], row = source.atlas.rows[sourceRow], scale = source.stature.scale;
    usedSources.add(key);
    assert.equal(row.seamReview.crossedVisiblePixels, 0, `${state}: native seam crosses visible art`);
    assert.equal(row.seamReview.crossedOpaquePixels, 0, `${state}: native seam crosses opaque art`);
    const bottom = Math.max(...row.frames.map(frame => frame.bounds.top + frame.bounds.height));
    const frameBounds = [], pieces = [];
    for (const [frame, native] of row.frames.entries()) {
      const b = native.bounds, width = Math.max(1, Math.round(b.width * scale)), height = Math.max(1, Math.round(b.height * scale));
      const left = Math.round((256 - width) / 2), top = Math.round(244 - (bottom - b.top) * scale);
      assert.ok(left >= 10 && top >= 10 && left + width <= 246 && top + height <= 246, `${state}/${frame}: native pose does not fit padding`);
      const input = await sharp(native.data, { raw: { width: native.width, height: native.height, channels: 4 } }).extract(b).resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
      pieces.push({ input, left: frame * 256 + left, top });
      frameBounds.push({ source: b, output: { left, top, width, height }, sourceFrameRgbaSha256: hash(native.data) });
    }
    const bytes = await sharp({ create: { width: 1024, height: 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(pieces).png().toBuffer();
    await write(path.join(root, docs, `${plan.id}-row-${rowIndex}.png`), bytes); overlays.push({ input: bytes, left: 0, top: rowIndex * 256 });
    rows.push({ state, row: rowIndex, sourceImage: source.path, sourceImageSha256: source.sha256, sourceRow, sourceBounds: row.sourceBounds,
      scale, renderScale: source.stature.renderScale, statureCalibration: source.stature, baseline: 244, frameBounds,
      nativeFrameRgbaSha256: frameBounds.map(frame => frame.sourceFrameRgbaSha256), ...row.seamReview,
      visualReview: { manuallyInspected: reviewed, fourDistinctNativePoses: reviewed, action: state === 'special' || state === 'chargeRelease' ? 'Dead Spike ground-origin casting gesture; runtime projectile travels separately, no transformation.' : state } });
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-ragna-wave7/${plan.id}.png`;
  await write(path.join(root, 'public', sheet), bytes);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height, info.channels], [1024, 2048, 4]);
  for (let row = 0; row < 8; row++) {
    const hashes = new Set();
    for (let frame = 0; frame < 4; frame++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const at = ((row * 256 + y) * 1024 + frame * 256 + x) * 4; data.copy(rgba, (y * 256 + x) * 4, at, at + 4);
        if (data[at + 3] > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(data[at + 3], 0, `${plan.id}/${row}/${frame}: unsafe alpha margin`);
      }
      assert.ok(row < plan.states.length ? visible > 1000 : visible === 0, 'Reserved empty cells do not count as poses');
      const sha256 = hash(rgba); hashes.add(sha256); frameChecks.push({ row, frame, visiblePixels: visible, rgbaSha256: sha256 });
      if (plan.id === 'ragna-ledge' && row < 5) await write(path.join(root, docs, `grip-${plan.states[row]}-${frame}.png`), await sharp(rgba, { raw: { width: 256, height: 256, channels: 4 } }).png().toBuffer());
    }
    if (row < plan.states.length) assert.equal(hashes.size, 4, `${plan.id}/${row}: four native drawings required`);
  }
  const primary = sources[plan.id === 'ragna-ledge' ? 'ledge' : plan.id.endsWith('-a') ? 'a' : 'b'];
  const calibratedSources = [...usedSources].map(key => sources[key].stature);
  entries.push({ id: plan.id, heroId: 'ragna', universe: 'BlazBlue', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: ['chargeLoop', 'ledgeHang'].includes(state) ? 8 : 12,
      loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state), renderScale: rows[row].renderScale }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length, frames: plan.states.length * 4,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 }, width: 1024, height: 2048, frameWidth: 256, frameHeight: 256,
    alpha: true, sha256: hash(bytes), sourceImage: primary.path, sourceImageSha256: primary.sha256, sourceDimensions: [primary.atlas.width, primary.atlas.height], originalSourceRows: primary.rows,
    referenceAsset: '/sprites/generated/heroes/blazblue/ragna.png', referenceAssetSha256: hash(reference), archivedReferenceAsset: referencePath,
    sourceWork: 'BlazBlue: Continuum Shift Extend (2011)',
    sourceReference: 'CSE-era Ragna costume and Blood-Scythe. Effective kit was resolved before prompts: Taille de Blood-Scythe / Dead Spike / Carnage Scissors. Current ability metadata cites Centralfiction; these newly drawn CSE-era poses are project adaptations, not verified game frames. Back-carried sword and ledge traversal are physical gameplay adaptations.',
    normalization: { method: 'alpha-segmentation-common-source-scale-with-body-render-calibration', frameSize: 256, padding: 12, margins: 10, baseline: 244,
      sharedScalePerSource: true, sharedScalePerState: false, frameOrder: [0, 1, 2, 3], sourceAlphaBoundsThreshold: 4,
      sourceScaleFactors: Object.fromEntries([...usedSources].map(key => [sources[key].path, sources[key].stature.scale])),
      statureCalibration: primary.stature, sourceCalibrations: calibratedSources, rows,
      emptyRows: Array.from({ length: 8 - plan.states.length }, (_, i) => plan.states.length + i),
      contactAnchorMeasurements: plan.id === 'ragna-ledge' ? contacts : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: reviewed, fourNativePosesPerStateReviewed: reviewed, technicalAlphaReviewed: true,
      fullOutputSilhouetteContained: true, canon1to1Verified: false, source1to1Verified: false, networkVerified: false,
      notes: 'Shared190 effective standing stature through one measured scale and render factor per source. All84 final native poses visually inspected. Whole Blood-Scythe/VFX retained without per-row size fit. Twelve primary glove palms and twelve adjoining wrists manually inspected in normalized pixels; Catch0 is pre-contact.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-20', nativeGeneratedArtwork: true, sourceGameAsset: false,
      canonicalAnimationVerified: false, generatedSourcePath: primary.file, promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt,
      promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: [...(usedSources.has('corrective') ? [{ sourceImage: sources.corrective.path, sourceImageSha256: sources.corrective.sha256,
        generatedSourcePath: sources.corrective.file, selectedStates: rows.filter(row => row.sourceImage === sources.corrective.path).map(row => row.state),
        calibrationRow: 6, calibrationPosesExcludedFromSelectedCount: 4, promptFile: `${docs}/ragna-combat-correction-prompt.json`, prompt: corrective.prompt, reason: corrective.reason }] : []),
        ...(usedSources.has('aerial') ? [{ sourceImage: sources.aerial.path, sourceImageSha256: sources.aerial.sha256, generatedSourcePath: sources.aerial.file,
          selectedStates: ['aerialDown', 'intro'], calibrationRow: 2, calibrationPosesExcludedFromSelectedCount: 4,
          promptFile: `${docs}/ragna-aerial-intro-correction-prompt.json`, prompt: aerialCorrective.prompt, reason: aerialCorrective.reason }] : [])],
      conditioning: 'Native image_gen drawing only. Sharp performs alpha-aware segmentation, extraction, one common nearest-neighbor source scale, transparent packing and diagnostic crops. No procedural body drawing, mirrored/rotated substitute or copied fake pose.' }
  });
  reviews.push({ id: plan.id, rows, frameChecks });
}
await write(path.join(root, 'src/game/combat/ragnaMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await write(path.join(root, docs, 'technical-review-combat.json'), `${JSON.stringify({ date: '2026-10-20', reviews }, null, 2)}\n`);
await write(path.join(root, docs, 'provenance-combat.json'), `${JSON.stringify({ schemaVersion: 1, date: '2026-10-20', provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null,
  plannedGenerations: 3, correctiveGenerations: 2, canonicalAnimationVerified: false, networkVerified: false,
  generationClaim: '84 initial native poses plus40 corrective/calibration drawings. Select84 final combat/traversal poses; exclude32 replaced initial poses and8 calibration poses. Empty ledge rows are never counted.',
  nativeSources: Object.entries(sources).map(([key, s]) => ({ id: s.id, key, path: s.path, sha256: s.sha256, bytes: s.byteLength, dimensions: [s.atlas.width, s.atlas.height], originalGeneratedPath: s.file,
    selectedSourceRows: [...selectedBySource[key]], statureCalibration: s.stature, model: null, generationId: null })),
  references: [{ path: referencePath, sha256: hash(reference), originalAsset: '/sprites/generated/heroes/blazblue/ragna.png' }], entries }, null, 2)}\n`);
const referenceRecord = toolPath => ({ toolPath, archivedPath: referencePath, sha256: hash(reference) });
const nativeRecord = key => ({ toolPath: sources[key].file, archivedPath: sources[key].path, sha256: sources[key].sha256 });
const calls = [
  ...plans.map((plan, i) => ({ internalLabel: plan.id, executionGroup: 'initial-three-parallel', prompt: plan.prompt,
    promptFile: `${docs}/native-prompts.json`, source: sources[['a', 'b', 'ledge'][i]], references: [referenceRecord('/workspace/multiverse-breach/public/sprites/generated/heroes/blazblue/ragna.png')] })),
  { internalLabel: 'ragna-combat-correction', executionGroup: 'corrective-after-native-seam-review', prompt: corrective.prompt,
    promptFile: `${docs}/ragna-combat-correction-prompt.json`, source: sources.corrective,
    references: [referenceRecord('/workspace/multiverse-breach/public/sprites/generated/heroes/blazblue/ragna.png'), nativeRecord('a'), nativeRecord('b')] },
  { internalLabel: 'ragna-aerial-intro-correction', executionGroup: 'corrective-after-normalized-visual-review', prompt: aerialCorrective.prompt,
    promptFile: `${docs}/ragna-aerial-intro-correction-prompt.json`, source: sources.aerial,
    references: [referenceRecord(path.join(root, referencePath)), nativeRecord('b')] }
].map(({ source, ...call }) => ({ ...call, provider: 'OpenAI', tool: 'image_gen.imagegen', model: null, generationId: null, toolCallId: null,
  transparentBackground: true, promptSha256: hash(Buffer.from(call.prompt)), output: { originalGeneratedPath: source.file, archivedPath: source.path, sha256: source.sha256 }, source1to1Verified: false }));
await write(path.join(root, docs, 'actual-tool-calls-combat.json'), `${JSON.stringify({ date: '2026-10-20', unknownIdentifiersRemainNull: true, calls }, null, 2)}\n`);
console.log(JSON.stringify({ states: 21, nativePoses: 84, reviewed, atlases: entries.map(e => ({ id: e.id, sha256: e.sha256, sourceCalibrations: e.normalization.sourceCalibrations.map(s => ({ sourceImage: s.sourceImage, sourceBodyHeight: s.sourceBodyHeight, normalizedBodyHeight: s.normalizedBodyHeight, renderScale: s.renderScale, effectiveBodyHeight: s.effectiveBodyHeight })) })) }));
