// Measurement contact sheet only. Enlarged source ROIs and crosshairs are
// verification annotations, never selected as native artwork or game frames.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
const measured = JSON.parse(await fs.readFile(`${dir}/native-hand-points.json`, 'utf8'));
const groups = Object.entries(measured.states).map(([state, points]) => [state, state === 'ledgeClimb' ? 'ripley-corrective-ledge' : 'ripley-ledge', points.map(point => point.palm)]);
const layers = [];
for (let row = 0; row < groups.length; row += 1) {
  const [state, id, points] = groups[row];
  const metadata = await sharp(`${dir}/${id}.native.png`).metadata();
  for (let column = 0; column < 4; column += 1) {
    const [x, y] = points[column], left = Math.max(0, x - 32), top = Math.max(0, y - 32);
    const crop = await sharp(`${dir}/${id}.native.png`).extract({ left, top, width: Math.min(64, metadata.width - left), height: Math.min(64, metadata.height - top) }).resize(256, 256, { kernel: 'nearest' }).png().toBuffer();
    const label = Buffer.from(`<svg width="256" height="286"><text x="6" y="17" font-size="12" fill="white">${state} F${column} source ${left},${top}</text><path d="M${(x-left)*4-8},${(y-top)*4+26}h16 M${(x-left)*4},${(y-top)*4+18}v16" stroke="#5bffff" stroke-width="1" fill="none"/></svg>`);
    layers.push({ input: crop, left: column * 256, top: row * 286 + 26 });
    layers.push({ input: label, left: column * 256, top: row * 286 });
  }
}
await sharp({ create: { width: 1024, height: 858, channels: 4, background: '#10202a' } }).composite(layers).png().toFile(`${dir}/native-hand-roi-review.png`);
await fs.writeFile(`${dir}/hand-roi-inspection.json`, JSON.stringify({ kind: 'technical-inspection-only', syntheticGamePoses: 0, rows: groups.map(([state, id, points]) => ({ state, source: `${id}.native.png`, initialInspectionCenters: points })), cropSize: 64, displayScale: 4 }, null, 2) + '\n');
