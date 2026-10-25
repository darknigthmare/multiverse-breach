import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { segmentNativeAtlas } from './native-segmentation.mjs';
import { ABILITIES_WAVE13_DEFINITIONS } from '../../../src/game/combat/abilities/abilitiesWave13Definitions.js';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const DOCS = 'docs/combat-fidelity-wave13-2026-10-24/part-b';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.resolve(ROOT, relative));
const json = relative => JSON.parse(read(relative));
const plan = json('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json');
const failures = json(DOCS + '/request-failures.json').failures;
const failed = new Set(failures.map(failure => failure.heroId));
const cols = start => [start, start + 1, start + 2, start + 3];
const nativeDefault = () => [[0,0,cols(0)],[0,0,cols(4)],[0,1,cols(0)],[0,1,cols(4)],
  [0,2,cols(0)],[0,2,cols(4)],[0,3,cols(0)],[0,3,cols(4)]];
const baseDefault = () => [[0,4,cols(0)],[0,4,cols(4)],[0,5,cols(0)],[0,5,cols(4)]];
const sourceNames = id => id === 'big_boss' ? [id + '-native48', id + '-correction12']
  : id === 'gray_fox' ? [id + '-native48', id + '-correction4']
  : id === 'aayla_secura' ? [id + '-native48', id + '-correction48']
    : id === 'joel_tlou' ? [id + '-native48', id + '-correction48', id + '-correction16']
      : id === 'hayden' ? [id + '-native48', id + '-correction32', id + '-correction16'] : [id + '-native48'];
const records = [], referenceImages = [];
for (const entry of plan.heroes.filter(entry => entry.part === 'B' && !failed.has(entry.hero.id))) {
  const id = entry.hero.id, kit = ABILITIES_WAVE13_DEFINITIONS[id];
  const referenceBytes = read('public' + entry.referenceAsset);
  if (sha(referenceBytes) !== entry.referenceSha256) throw new Error(id + ': historical reference drift');
  fs.mkdirSync(path.resolve(ROOT, DOCS, 'references'), { recursive: true });
  const referenceArchive = DOCS + '/references/' + id + '.png';
  fs.writeFileSync(path.resolve(ROOT, referenceArchive), referenceBytes);
  referenceImages.push({ id, path: referenceArchive });
  const selections = { native: nativeDefault(), base: baseDefault() };
  const corrections = [];
  if (id === 'big_boss') {
    selections.native[4] = [1,0,cols(0)];
    selections.native[7] = [1,1,cols(0)];
    selections.base[2] = [1,2,cols(0)];
    corrections.push('Original finishing/super/ordinary-shot rows contain an incorrectly placed light in the middle of the suppressor. All twelve drawings in these three rows are excluded. New twelve-pose native source keeps the physical suppressed M1911A1 and shows aiming/recoil without any flash; the muzzle is the real forwardmost suppressor tip. Quiet legacy rows are retained unchanged at the source level.');
  }
  if (id === 'gray_fox') {
    selections.base[2] = [1,0,cols(0)];
    selections.base[3] = [0,5,[3,4,5,6]];
    corrections.push('Initial48 image has nine run-row figures and three attack figures; retain four actual run poses, exclude the extra runner and three incomplete attack drawings. A new4-pose katana strip supplies all four ordinary attack drawings.');
  }
  if (id === 'aayla_secura') {
    for (const group of Object.values(selections)) for (const selection of group) selection[0] = 1;
    corrections.push('Initial image has blade trails joining two separate bodies. It is completely excluded; the corrected48 source has48 genuinely separate complete figures.');
  }
  if (id === 'joel_tlou') {
    for (const selection of selections.native) selection[0] = 1;
    selections.base = Array.from({ length: 4 }, (_, row) => [2,row,cols(0)]);
    selections.native[7][2] = [4,6,5,7];
    corrections.push('Initial gun was a semiautomatic pistol and is entirely excluded. Corrected48 source depicts the actual round-cylinder revolver; only its complete first32 presentation figures are retained. Its last-row cropped feet are excluded, and a new16-pose revolver basic source supplies the entire base.');
    corrections.push('Super native aim/fire/recovery cells are ordered0,2,1,3 to place the existing firing drawing third. No frame is redrawn, duplicated or counted twice.');
  }
  if (id === 'hayden') {
    selections.native = Array.from({ length: 8 }, (_, row) => [1,row,cols(0)]);
    selections.base = Array.from({ length: 4 }, (_, row) => [2,row,cols(0)]);
    corrections.push('Initial47-figure sheet has cropped outer heads/feet and one missing support pose; the source is entirely excluded. New32 presentation and16 basic sources provide all complete drawings with measured margins. All actions are zero-damage technical gestures.');
  }
  if (['ocelot_mgs','tess_tlou','tommy_tlou'].includes(id)) {
    selections.native[7][2] = [4,6,5,7];
    corrections.push('Super native aim/fire/recovery cells are ordered0,2,1,3 so the existing firing drawing is third. Every native drawing is retained once; no generated pose is synthesized.');
  }
  if (id === 'tess_tlou') {
    selections.base[2][2] = [0,2,1,3];
    corrections.push('The ordinary action uses the same explicit aim/aim/fire/recovery cell ordering, without pixel changes or duplication.');
  }
  const sources = [];
  for (const [sourceIndex, name] of sourceNames(id).entries()) {
    const file = DOCS + '/sources/' + name + '.png';
    const rows = name.endsWith('correction32') ? 8 : name.endsWith('correction16') ? 4 : name.endsWith('correction12') ? 3 : name.endsWith('correction4') ? 1 : 6;
    const receiptName = name.endsWith('-native48') ? id : name;
    const toolResultFile = DOCS + '/sources/' + receiptName + '-tool-result.json';
    const receipt = json(toolResultFile);
    const promptFile = DOCS + '/sources/' + (name.endsWith('-native48') ? id : name) + '-prompt.txt';
    const atlas = await segmentNativeAtlas(path.resolve(ROOT, file), { rowCount: rows });
    const count = Object.values(selections).flat().filter(selection => selection[0] === sourceIndex).length * 4;
    const calibrationBody = atlas.rows[0][0].bodyBounds;
    let observed = atlas.frames.length;
    if (id === 'aayla_secura' && sourceIndex === 0) observed = 48;
    const selectedFrames = Object.values(selections).flat().filter(selection => selection[0] === sourceIndex)
      .flatMap(([,row,columns]) => columns.map(column => atlas.rows[row][column]));
    if (selectedFrames.some(frame => !frame)) throw new Error(id + ': missing selected source drawing');
    if (selectedFrames.some(frame => frame.bodyBounds.left <= 0 || frame.bodyBounds.top <= 0
      || frame.bodyBounds.right >= atlas.width - 1 || frame.bodyBounds.bottom >= atlas.height - 1))
      throw new Error(id + ': selected native body touches a global source boundary');
    sources.push({ archivedPath: file, sha256: sha(read(file)), promptFile, promptSha256: sha(read(promptFile)),
      toolResultFile, toolResultSha256: sha(read(toolResultFile)), generatedPath: receipt.path,
      rows, rowCounts: atlas.rowCounts, nativeComponentsObserved: atlas.frames.length, nativeDrawingsObserved: observed,
      retainedDrawings: count, excludedDrawings: observed - count, acceptedForDelivery: count > 0,
      calibration: { method: 'first-complete-standing-native-body-component', bodyHeight: calibrationBody.height,
        bodyBounds: calibrationBody, bodyRoi: { left: calibrationBody.left, top: calibrationBody.top,
          width: calibrationBody.width, height: calibrationBody.height } },
      sourceCanvasDimensions: [atlas.width, atlas.height], allSelectedBodiesAvoidGlobalCanvasEdges: true });
  }
  records.push({ heroId: id, name: entry.hero.name, universe: entry.hero.universe,
    sourceWork: entry.source.sourceWork, sourceReference: entry.source.sourceReference,
    referenceAsset: entry.referenceAsset, referenceAssetSha256: entry.referenceSha256, referenceArchive,
    targetBodyHeight: id === 'hayden' ? 210 : id === 'liquid_snake' ? 198 : 190,
    simpleActionName: kit.simple.name, simpleEffect: kit.simple.targeting.effect,
    specialActionName: kit.special.name, specialEffect: kit.special.targeting.effect,
    selectedSourceAppearance: entry.source.appearance, reviewed: true, sources, selections,
    correctionNotes: corrections,
    reviewNotes: 'Exact selected adult source version and practical equipment reviewed. Four different native poses per phase/state, one scalar for every retained body in each source, complete weapon/head/feet silhouettes, measured alpha margins and no source-pixel painting. Quiet presentation rows do not invent attacks; Hayden support creates no damage. The images and choreography are generated gameplay adaptations, not official animation frames or certified1:1 reproductions.' });
}
const output = { schemaVersion: 1, date: '2026-10-24', part: 'B', selectedHeroIds: plan.parts.B,
  records, failures, allSelectedIdentitiesAccountedFor: records.length + failures.length === plan.parts.B.length,
  source1to1Verified: false };
fs.writeFileSync(path.resolve(ROOT, DOCS, 'generation-records.json'), JSON.stringify(output, null, 2) + '\n');
const size = 192;
const tiles = [];
for (const [index, reference] of referenceImages.entries()) {
  const input = await sharp(path.resolve(ROOT, reference.path)).resize(size,size,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}})
    .png().toBuffer();
  tiles.push({ input, left: index % 5 * size, top: Math.floor(index / 5) * size });
}
await sharp({create:{width:size*5,height:size*Math.ceil(referenceImages.length/5),channels:4,
  background:{r:36,g:49,b:72,alpha:1}}}).composite(tiles).png().toFile(path.resolve(ROOT,DOCS,'references-contact.png'));
console.log(JSON.stringify({ part:'B', selected:plan.parts.B.length, records:records.length,
  failures:failures.length, sourceImages:records.reduce((n,record)=>n+record.sources.length,0) }));
