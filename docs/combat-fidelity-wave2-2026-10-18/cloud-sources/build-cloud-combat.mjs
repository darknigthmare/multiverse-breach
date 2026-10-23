import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { segmentAtlas, normalizeRow } from '../../../scripts/buildCombatEntityAssets.mjs';

const root = process.cwd();
const docs = 'docs/combat-fidelity-wave2-2026-10-18/cloud-sources';
const output = 'public/sprites/generated/melee-cloud-wave2';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sources = {
  'cloud-combat-a': '/workspace/generated_images/exec-8746b46c-fac1-4664-8d3d-ec6635c399f0.png',
  'cloud-combat-b': '/workspace/generated_images/exec-7d9ffea5-3211-4b89-9eac-702c5ce2e88a.png',
  'cloud-ledge': '/workspace/generated_images/exec-112febc8-3987-4dd9-bc44-4455408ca101.png'
};
const plans = JSON.parse(await fs.readFile(path.join(root, docs, 'native-prompts.json'), 'utf8')).plans;
const correctionPrompt = JSON.parse(await fs.readFile(path.join(root, docs, 'cloud-combat-a-correction-prompt.json'), 'utf8'));
const braverPrompt = JSON.parse(await fs.readFile(path.join(root, docs, 'cloud-braver-correction-prompt.json'), 'utf8'));
const corrections = {};
for (const [id, generatedPath, rowCount, prompt] of [
  ['cloud-combat-a-correction', '/workspace/generated_images/exec-6310d773-854f-44a5-a903-cb1254fc97ec.png', 8, correctionPrompt],
  ['cloud-braver-correction', '/workspace/generated_images/exec-b976636f-5f2e-4a8b-b180-535b69aef423.png', 2, braverPrompt]
]) {
  const sourceImage = `${docs}/${id}.png`;
  let bytes;
  try { bytes = await fs.readFile(generatedPath); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await fs.readFile(path.join(root, sourceImage)); }
  await fs.writeFile(path.join(root, sourceImage), bytes);
  corrections[id] = { sourceImage, bytes, sha256: hash(bytes), generatedPath, atlas: await segmentAtlas(path.join(root, sourceImage), rowCount), prompt };
}
const gripPoints = {
  ledgeCatch: [[228, 27, false], [175, 38, true], [168, 44, true], [161, 56, true]],
  ledgeHang: [[168, 27, true], [179, 27, true], [179, 27, true], [117, 27, true]],
  ledgeClimb: [[198, 48, true], [184, 42, true], [149, 164, true], [164, 218, true]],
  ledgeDrop: [[166, 24, true], [167, 27, true], [167, 27, false], [167, 27, false]],
  ledgeJump: [[175, 27, true], [189, 38, true], [189, 38, false], [189, 38, false]]
};
await fs.mkdir(path.join(root, output), { recursive: true });
const referencePath = '/sprites/generated/heroes/final-fantasy-vii/cloud-ff7.png';
const previousAtlasPath = '/sprites/generated/combat-character-animations/cloud_ff7.png';
const reference = await fs.readFile(path.join(root, 'public', referencePath));
const previous = await fs.readFile(path.join(root, 'public', previousAtlasPath));
await fs.writeFile(path.join(root, docs, 'cloud-reference.png'), reference);
await fs.writeFile(path.join(root, docs, 'cloud-previous-presentation-reference.png'), previous);
const entries = [];
const reviews = [];
for (const plan of plans) {
  const originalSourceImage = `${docs}/${plan.id}-source.png`;
  let originalSource;
  try { originalSource = await fs.readFile(sources[plan.id]); }
  catch (error) { if (error.code !== 'ENOENT') throw error; originalSource = await fs.readFile(path.join(root, originalSourceImage)); }
  await fs.writeFile(path.join(root, originalSourceImage), originalSource);
  const originalAtlas = await segmentAtlas(path.join(root, originalSourceImage), plan.states.length);
  const corrected = plan.id === 'cloud-combat-a' ? corrections['cloud-combat-a-correction'] : null;
  const sourceImage = corrected?.sourceImage || originalSourceImage;
  const source = corrected?.bytes || originalSource;
  const atlas = corrected?.atlas || originalAtlas;
  const overlays = [];
  const rows = [];
  for (let row = 0; row < plan.states.length; row++) {
    const state = plan.states[row];
    const braver = plan.id === 'cloud-combat-a' && state === 'chargeRelease' ? { ...corrections['cloud-braver-correction'], sourceRow: 1 }
      : plan.id === 'cloud-combat-b' && state === 'special' ? { ...corrections['cloud-braver-correction'], sourceRow: 0 } : null;
    const preservedCharge = plan.id === 'cloud-combat-a' && state === 'chargeLoop';
    const rowAtlas = braver?.atlas || (preservedCharge ? originalAtlas : atlas);
    const sourceRow = braver?.sourceRow ?? row;
    const sourceRowImage = braver?.sourceImage || (preservedCharge ? originalSourceImage : sourceImage);
    const sourceRowHash = braver?.sha256 || hash(preservedCharge ? originalSource : source);
    const normalized = await normalizeRow(rowAtlas.rows[sourceRow]);
    overlays.push({ input: normalized.bytes, left: 0, top: row * 256 });
    rows.push({ state, row, sourceImage: sourceRowImage, sourceImageSha256: sourceRowHash, sourceRow, sourceBounds: rowAtlas.rows[sourceRow].sourceBounds,
      scale: normalized.scale, baseline: normalized.baseline, frameBounds: normalized.frameBounds,
      ...rowAtlas.rows[sourceRow].seamReview,
      visualReview: { fourDistinctNativePoses: true, manuallyInspected: true,
        action: braver ? 'Braver: raised sword and tucked airborne legs → descending vertical cleave → low point-down impact → rising recovery; no Cross-slash marks.'
          : preservedCharge ? 'Original native row retained: four sustained bracing postures and changing elbow/knee angles, without any detached effects. The broad correction had incorrectly turned this row into normal strikes.'
            : state === 'intro' ? 'Low sword → rising two-handed blade → sword settling against shoulder → relaxed shoulder carry, with different wrist/torso/foot positions.'
              : state.startsWith('ledge') ? 'Actual hanging, grip, pull-up or release silhouettes inspected with four per-cell crops; invisible ledge and no painted scenery.'
                : 'Four native anatomical/sword-angle pose changes inspected in the normalized row, without procedural pose substitution.' }
    });
    await fs.writeFile(path.join(root, docs, `${plan.id}-row-${row}.png`), normalized.bytes);
  }
  const bytes = await sharp({ create: { width: 1024, height: 2048, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(overlays).png({ compressionLevel: 9 }).toBuffer();
  const sheet = `/sprites/generated/melee-cloud-wave2/${plan.id}.png`;
  await fs.writeFile(path.join(root, 'public', sheet), bytes);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1024); assert.equal(metadata.height, 2048); assert.equal(metadata.hasAlpha, true);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const frameChecks = [];
  for (let row = 0; row < 8; row++) {
    const hashes = [];
    for (let col = 0; col < 4; col++) {
      let visible = 0;
      const raw = Buffer.alloc(256 * 256 * 4);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * info.width + col * 256 + x) * 4;
        const alpha = data[offset + 3];
        data.copy(raw, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) visible++;
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, `${plan.id}/${row}/${col}: output edge clipping`);
      }
      if (row < plan.states.length) assert.ok(visible > 1000, `${plan.id}/${row}/${col}: empty active frame`);
      else assert.equal(visible, 0, `${plan.id}/${row}/${col}: inactive row must remain transparent`);
      hashes.push(hash(raw));
      frameChecks.push({ row, col, visiblePixels: visible, sha256: hash(raw) });
    }
    if (row < plan.states.length) assert.equal(new Set(hashes).size, 4, `${plan.id}/${row}: duplicate native frame`);
  }
  entries.push({ id: plan.id, heroId: 'cloud_ff7', universe: 'Final Fantasy VII', sheet,
    states: Object.fromEntries(plan.states.map((state, row) => [state, { row, frames: 4, columns: 4, fps: state === 'chargeLoop' || state === 'ledgeHang' ? 8 : 12, loop: ['chargeLoop', 'ledgeHang', 'victory'].includes(state) }])),
    stateOrder: plan.states, columns: 4, rows: 8, activeRows: plan.states.length,
    dimensions: { width: 1024, height: 2048, frameWidth: 256, frameHeight: 256 },
    width: 1024, height: 2048, frameWidth: 256, frameHeight: 256, frames: plan.states.length * 4,
    sha256: hash(bytes), alpha: true,
    sourceImage, sourceImageSha256: hash(source), sourceDimensions: [atlas.width, atlas.height],
    originalSourceImage, originalSourceImageSha256: hash(originalSource),
    referenceAsset: referencePath, referenceAssetSha256: hash(reference),
    archivedReferenceAsset: `${docs}/cloud-reference.png`,
    previousAtlasReference: previousAtlasPath, previousAtlasReferenceSha256: hash(previous),
    sourceWork: 'Final Fantasy VII (1997)',
    sourceReference: plan.id === 'cloud-combat-b' ? 'Cloud, Buster Sword, Braver (effective secondary technique in abilitiesCanonical.js); physical aerial cuts and sword victory flourish adapted to the project Melee mechanics. The earlier Cross-slash row is archived and excluded.' : plan.id === 'cloud-ledge' ? 'Cloud identity and Buster Sword from FFVII; five ledge states are explicit project traversal adaptations, not canonical FFVII gameplay animations.' : 'Cloud and Buster Sword from FFVII; three physical sword cuts and charge phases adapted to project Melee mechanics. chargeRelease uses the corrected native Braver downward cleave, not Cross-slash.',
    normalization: { method: 'alpha-valley-and-adaptive-seam-v1', frameSize: 256, padding: 12, sharedScalePerState: true, baseline: 244, emptyRows: Array.from({ length: 8 - plan.states.length }, (_, index) => plan.states.length + index), rows,
      contactAnchorMeasurements: plan.id === 'cloud-ledge' ? Object.fromEntries(Object.entries(gripPoints).map(([state, frames]) => [state, frames.map(([x, y, contact], frame) => ({ frame, x, y, normalizedX: x / 256, normalizedY: y / 256, baseline: 'ledgeGrip', contact, measurement: 'manual native-pixel inspection; approximate palm center, not a source-game canonical anchor' }))])) : {} },
    visualValidation: { identityReviewed: true, stateRowsReviewed: true, fourNativePosesPerStateReviewed: true, technicalAlphaReviewed: true, fullOutputSilhouetteContained: true, canon1to1Verified: false, networkVerified: false,
      notes: 'References, all three native atlases, all normalized state rows and per-frame ledge crops inspected. Braver correction replaces only special and chargeRelease. Inactive ledge rows remain fully transparent and are not counted. Ledge contact anchors are per-frame because hands move; hanging sprites must not use the feet baseline244.' },
    provenance: { provider: 'OpenAI', tool: 'image_gen', model: null, generationId: null, date: '2026-10-18', sourceGameAsset: false, nativeGeneratedArtwork: true, canonicalAnimationVerified: false, generatedSourcePath: sources[plan.id],
      promptFile: `${docs}/native-prompts.json`, prompt: plan.prompt, promptSha256: hash(Buffer.from(plan.prompt)), referenceImagesInspectedBeforeGeneration: true,
      nativeCorrections: plan.id === 'cloud-ledge' ? [] : [
        ...(corrected ? [{ sourceImage: corrected.sourceImage, sourceImageSha256: corrected.sha256, generatedSourcePath: corrected.generatedPath, prompt: correctionPrompt.prompt, promptFile: `${docs}/cloud-combat-a-correction-prompt.json`, reason: correctionPrompt.reason, excludedRow: 'chargeLoop', excludedRowReason: 'Correction row did not sustain the charge; the valid original native chargeLoop row is retained.' }] : []),
        { sourceImage: corrections['cloud-braver-correction'].sourceImage, sourceImageSha256: corrections['cloud-braver-correction'].sha256, generatedSourcePath: corrections['cloud-braver-correction'].generatedPath, promptFile: `${docs}/cloud-braver-correction-prompt.json`, prompt: braverPrompt.prompt, reason: braverPrompt.reason, selectedSourceRow: plan.id === 'cloud-combat-a' ? 1 : 0, selectedState: plan.id === 'cloud-combat-a' ? 'chargeRelease' : 'special' }
      ],
      conditioning: 'Only the exported segmentAtlas and normalizeRow helpers perform alpha-seam extraction, nearest-neighbor normalization, transparent padding and atlas assembly. No limb redrawing, procedural pose synthesis or duplicated frames.' }
  });
  reviews.push({ id: plan.id, sourceDimensions: [atlas.width, atlas.height], rows, frameChecks });
}
await fs.writeFile(path.join(root, 'src/game/combat/cloudMeleeCombat.generated.json'), `${JSON.stringify({ schemaVersion: 1, source: 'OpenAI', entries }, null, 2)}\n`);
await fs.writeFile(path.join(root, docs, 'technical-review.json'), `${JSON.stringify({ date: '2026-10-18', reviews }, null, 2)}\n`);
console.log(JSON.stringify({ atlases: entries.map(entry => ({ id: entry.id, activeRows: entry.activeRows, frames: entry.frames, sha256: entry.sha256 })), states: entries.reduce((sum, entry) => sum + entry.activeRows, 0), frames: entries.reduce((sum, entry) => sum + entry.frames, 0), technicalValidation: true }));
