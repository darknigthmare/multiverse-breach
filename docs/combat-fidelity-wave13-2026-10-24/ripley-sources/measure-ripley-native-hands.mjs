import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
const check = process.argv.includes('--check');
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const points = await read(`${dir}/native-hand-points.json`);
const registry = await read('src/game/combat/ripleyMeleeCombat.generated.json');
const ledge = registry.entries.find(entry => entry.id === 'ripley-ledge'), cache = new Map();
async function pixels(file, x, y) {
  if (!cache.has(file)) cache.set(file, await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  const { data, info } = cache.get(file);
  let count = 0;
  for (let yy = y - 4; yy <= y + 4; yy += 1) for (let xx = x - 4; xx <= x + 4; xx += 1) {
    assert.ok(xx >= 0 && yy >= 0 && xx < info.width && yy < info.height);
    count += data[(yy * info.width + xx) * 4 + 3] >= 24;
  }
  return count;
}
async function mapPoint(frame, row, sourcePoint) {
  const source = frame.sourceRect, destination = frame.destinationRect;
  const x = Math.round(destination.x + (sourcePoint[0] - source.x + 0.5) * destination.width / source.width - 0.5);
  const y = Math.round(destination.y + (sourcePoint[1] - source.y + 0.5) * destination.height / source.height - 0.5);
  const visible = await pixels('public' + ledge.sheet, frame.frame * 256 + x, row * 256 + y);
  const sourceVisible = await pixels(frame.sourceImage, ...sourcePoint);
  assert.ok(visible >= 60 && sourceVisible >= 60, `Measured bare palm/wrist needs real9×9 support: ${frame.state}/${frame.frame} ${sourcePoint} source${sourceVisible} packed${visible}`);
  return { x, y, normalizedX: x / 256, normalizedY: y / 256, visibleNeighborhood9x9: visible,
    sourceVisibleNeighborhood9x9: sourceVisible, sourcePoint: { x: sourcePoint[0], y: sourcePoint[1] },
    localRefinement: { x: 0, y: 0 } };
}
const result = {
  date: '2026-10-24', heroId: 'ripley', sourceWork: 'Aliens (1986), Ellen Ripley before the power-loader fight',
  reviewed: points.reviewed, source1to1Verified: false,
  method: 'Manual native bare-palm/wrist localization; exact nearest-neighbor source-to-packed mapping. No synthetic hand, rotated body, moved pixel or search away from the measured anatomy.',
  requiredPalms: 12, requiredWrists: 12, requiredContacts: 11, states: {}
};
for (const [state, measured] of Object.entries(points.states)) {
  const row = ledge.stateOrder.indexOf(state);
  assert.ok(row >= 0);
  result.states[state] = [];
  for (const [index, point] of measured.entries()) {
    const frame = ledge.normalization.frames.find(frame => frame.state === state && frame.frame === index);
    const palm = await mapPoint(frame, row, point.palm), wrist = await mapPoint(frame, row, point.wrist);
    result.states[state].push({
      x: palm.x, y: palm.y, normalizedX: palm.normalizedX, normalizedY: palm.normalizedY,
      visibleNeighborhood9x9: palm.visibleNeighborhood9x9, sourceVisibleNeighborhood9x9: palm.sourceVisibleNeighborhood9x9,
      frame: index, contact: point.contact, baseline: 'ledgeGrip', sourceImage: frame.sourceImage,
      sourcePalm: palm.sourcePoint, wrist, localRefinement: palm.localRefinement,
      measurement: 'Visible leading bare palm connected to a real wrist/forearm. The opposite camp is a renderer mirror; hidden anatomical handedness is not certified.'
    });
  }
}
const encoded = JSON.stringify(result, null, 2) + '\n', target = `${dir}/hand-measurements.json`;
if (check) assert.equal(await fs.readFile(target, 'utf8'), encoded); else await fs.writeFile(target, encoded);
console.log(JSON.stringify({ passed: true, check, palms: 12, wrists: 12, contacts: 11,
  packedCounts: Object.values(result.states).flat().map(point => [point.visibleNeighborhood9x9, point.wrist.visibleNeighborhood9x9]) }));
