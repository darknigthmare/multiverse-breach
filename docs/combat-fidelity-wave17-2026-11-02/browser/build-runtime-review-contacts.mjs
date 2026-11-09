// Split actual browser pixels into readable QA pages; no production art edits.
// Preparation deliberately records zero inspections.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { waveDirectory, readJson, readBytes, sha, writeJson } from './presentation-input-integrity.mjs';

const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-final-browser'));
const reportPath = `${waveDirectory}/browser/native-super-${preliminary ? 'preliminary-' : ''}runtime.json`;
const report = await readJson(reportPath);
assert.equal(report.passed, true); assert.equal(report.preliminary, preliminary);
assert.equal(report.allBrowserWindowsClosed, true);
const source = report.artifacts.find(p => p.path.endsWith(`native-super-${preliminary ? 'preliminary-' : ''}contact-sheet.png`));
assert.ok(source);
const bytes = await readBytes(source.path);
assert.equal(sha(bytes), source.sha256);
const meta = await sharp(bytes).metadata();
assert.equal(meta.width, 1440); assert.equal(meta.height, report.actualAuthoritativeFixtures / 6 * 240);
const artifacts = [], sourceCaptures = [];
for (let top = 0, index = 0; top < meta.height; top += 2400, index++) {
  const crop = { left: 0, top, width: meta.width, height: Math.min(2400, meta.height - top) };
  const path = `${waveDirectory}/browser/runtime-${preliminary ? 'preliminary-' : ''}review-page-${index + 1}.png`;
  const page = await sharp(bytes).extract(crop).png().toBuffer();
  await fs.writeFile(path, page);
  artifacts.push({ path, sha256: sha(page), bytes: page.length,
    characterOrdinals: [top / 240, (top + crop.height) / 240 - 1], inspected: false });
  sourceCaptures.push({ ...source, inspectedViaContactSheet: path,
    sourceCrop: crop, tile: { x: 0, y: 0, width: crop.width, height: crop.height } });
}
await writeJson(`${waveDirectory}/browser/runtime-${preliminary ? 'preliminary-' : ''}review-contacts.json`, {
  preliminary, preparedAt: new Date().toISOString(),
  report: { path: reportPath, sha256: sha(await readBytes(reportPath)) },
  scope: 'Lossless consecutive ten-character pages of the actual six-case browser contact grid. All captured rows retained; no resizing or invented poses.',
  actualCapturesInspected: 0, artifacts, sourceCaptures
});
console.log(JSON.stringify({ prepared: true, preliminary, pages: artifacts.length, actualCapturesInspected: 0 }));
