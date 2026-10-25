import fs from 'node:fs';
import sharp from 'sharp';
const root = new URL('../../', import.meta.url), dir = new URL('./', import.meta.url);
// Local cell coordinates measured against the native strips, independently for
// each pose. Null denotes a lowered weapon rather than an invented firing point.
const measured = {
  dutch: { super: [null, [204, 135], [194, 136], [206, 142]], fatality: [null, [204, 134], [192, 126], [206, 140]] },
  mac_predator: { super: [[210, 153], [221, 154], [197, 155], [216, 157]], fatality: [[214, 156], [216, 158], [194, 131], [212, 134]] },
  harrigan_predator: { super: [[191, 112], [198, 111], [187, 108], [184, 113]], fatality: [[189, 93], [198, 91], [185, 97], [184, 109]] },
  royce_predators_core: { super: [[207, 127], [203, 126], [193, 130], [196, 140]], fatality: [[199, 109], [202, 98], [196, 97], null] }
};
const anchors = {}, reviews = [];
for (const [id, phases] of Object.entries(measured)) {
  const { data, info } = await sharp(fs.readFileSync(new URL(`public/sprites/generated/combat-character-animations-wave12-part-b/${id}.png`, root)))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  anchors[id] = {};
  for (const [phase, positions] of Object.entries(phases)) {
    const row = phase === 'super' ? 7 : 4;
    anchors[id][phase] = positions.map((point, column) => {
      if (!point) return null;
      let best = null;
      for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
        const x = point[0] + dx, y = point[1] + dy;
        const offset = ((row * 256 + y) * info.width + column * 256 + x) * 4;
        if (data[offset + 3] <= 24 || data[offset] + data[offset + 1] + data[offset + 2] > 360) continue;
        const distance = dx * dx + dy * dy;
        if (!best || distance < best.distance) best = { x, y, distance, rgba: [...data.subarray(offset, offset + 4)] };
      }
      if (!best) throw new Error(`${id}/${phase}/${column}: no existing dark muzzle at the visually measured point`);
      reviews.push({ id, phase, column, visuallyMeasuredPoint: point, point: { x: best.x, y: best.y },
        rgba: best.rgba, adjustmentSquaredDistance: best.distance,
        meaning: 'Existing dark barrel exit pixel, measured per native pose; no shared offset or floating projectile point' });
      return { x: best.x, y: best.y };
    });
  }
}
fs.writeFileSync(new URL('part-b-native-anchors.json', dir), JSON.stringify(anchors, null, 2) + '\n');
fs.writeFileSync(new URL('part-b-native-anchor-review.json', dir), JSON.stringify({ schemaVersion: 1, part: 'B',
  passed: true, projectileHeroes: Object.keys(anchors), measuredOpaquePoints: reviews.length, loweredWeaponNulls: 3,
  review: 'Direct inspection of native256-cell strips, then validation against an existing alpha>24 dark barrel pixel within6pixels of the measured location. Source-calibrated render scale is kept separately.',
  technicalReview: reviews, source1to1Verified: false }, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, heroes: Object.keys(anchors).length, points: reviews.length,
  maximumAdjustment: Math.sqrt(Math.max(...reviews.map(review => review.adjustmentSquaredDistance))) }));
