// Read-only crops for physical emission-point review. These are QA artifacts,
// never additional artwork or frames. Run only after the artist confirms the
// selected production PNG is final.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const directory = path.dirname(fileURLToPath(import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const registryPath = 'src/game/combat/characterAnimationsWave15PartB.generated.json';
const registry = JSON.parse(fs.readFileSync(path.join(root, registryPath)));
const ids = process.argv.slice(2); assert.ok(ids.length);
for (const id of ids) {
  const entry = registry.entries.find(entry => entry.heroId === id); assert.ok(entry, id);
  const bytes = fs.readFileSync(path.join(root, 'public' + entry.sheet)); assert.equal(sha(bytes), entry.sha256);
  assert.equal(entry.frameWidth, 256); assert.equal(entry.frameHeight, 256); assert.equal(entry.columns, 4);
  const output = path.join(directory, 'crops', id + '-' + entry.sha256.slice(0, 12));
  assert.equal(fs.existsSync(path.join(output, 'input.json')), false, 'Preserve an earlier measured PNG snapshot');
  fs.mkdirSync(output, { recursive: true });
  const crops = [], cells = [];
  for (const [phaseIndex, phase] of ['super', 'fatality'].entries()) {
    const row = entry.phases[phase].row; assert.equal(entry.phases[phase].frames, 4);
    for (let col = 0; col < 4; col++) {
      const crop = await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).png().toBuffer();
      const file = path.join(output, `${phase}-${col}.png`); fs.writeFileSync(file, crop);
      crops.push({ phase, col, row, path: path.relative(root, file), sha256: sha(crop), bytes: crop.length });
      cells.push({ input: crop, left: col * 256, top: phaseIndex * 256 });
    }
  }
  const contact = await sharp({ create: { width: 1024, height: 512, channels: 4, background: '#283749' } })
    .composite(cells).png().toBuffer();
  const contactFile = path.join(output, 'super-then-fatality-contact.png'); fs.writeFileSync(contactFile, contact);
  const geometry = { sheet: entry.sheet, sha256: entry.sha256, frameWidth: entry.frameWidth, frameHeight: entry.frameHeight,
    columns: entry.columns, rows: entry.rows, phases: entry.phases, normalization: entry.normalization };
  const input = { schemaVersion: 1, id, createdAt: new Date().toISOString(), registryPath, sheet: entry.sheet, sheetSha256: entry.sha256,
    geometrySha256: sha(JSON.stringify(geometry)), geometry, crops,
    contact: { path: path.relative(root, contactFile), sha256: sha(contact), bytes: contact.length },
    scope: 'Original 256px source cells, top row super0–3, bottom row fatality0–3. Production PNG is unchanged. No point is measured by this crop builder.' };
  fs.writeFileSync(path.join(output, 'input.json'), JSON.stringify(input, null, 2) + '\n');
  console.log(JSON.stringify({ id, sheet: entry.sheet, sha256: entry.sha256, contact: input.contact.path }));
}
