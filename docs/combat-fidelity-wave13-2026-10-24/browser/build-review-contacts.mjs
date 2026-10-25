// QA contact sheets crop only actual Chromium captures, never production art.
// Column 2 is the representative visual sample; the browser trace tests all four.
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { repositoryRoot, readJson, sha, readBytes, writeJson } from './presentation-input-integrity.mjs';

// Fontconfig's normal user cache is read-only in the verification container.
process.env.XDG_CACHE_HOME ||= '/tmp/w13-browser-contact-cache';
await fs.mkdir(path.join(process.env.XDG_CACHE_HOME, 'fontconfig'), { recursive: true });

const reportPath = process.argv[2];
assert.ok(reportPath, 'Pass the actual native/base browser report path');
const report = await readJson(reportPath);
assert.equal(report.passed, true); assert.equal(report.allBrowserWindowsClosed, true);
const kind = reportPath.endsWith('/native-presentations.json') ? 'native' : 'base';
assert.ok(kind === 'native' || reportPath.endsWith('/base-corrections.json'));
const rowHeight = kind === 'native' ? 210 : 150, deliveredRows = kind === 'native' ? 8 : 4;
const stripWidth = 256, headerHeight = 38, column = 2;
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const outputDirectory = path.posix.dirname(reportPath);
const artifacts = [], groups = [];
const selections = [...new Set(report.captures.map(capture => capture.part))].sort().map(part => ({
  part, rows: deliveredRows, captureKind: 'delivered', captures: report.captures.filter(capture => capture.part === part)
}));
if (process.argv.includes('--include-refusals')) selections.push({
  part: 'refused', rows: 8, captureKind: 'retained-historical-fallback', captures: report.refusedCaptures || []
});
for (const { part, rows, captureKind, captures } of selections) {
  for (let start = 0; start < captures.length; start += 5) {
    const page = captures.slice(start, start + 5), width = page.length * stripWidth, height = rows * rowHeight + headerHeight;
    const composite = [];
    for (const [index, capture] of page.entries()) {
      const actual = await readBytes(capture.path), expected = report.artifacts.find(item => item.path === capture.path);
      assert.ok(expected, capture.path + ': actual capture is not manifest-bound');
      assert.equal(sha(actual), expected.sha256, capture.path + ': actual capture changed');
      for (const side of [0, 1]) {
        const pivot = (kind === 'native' ? 140 : 144) + (side * 4 + column) * 128;
        const crop = await sharp(actual).extract({ left: pivot - 64, top: 0, width: 128, height: rows * rowHeight }).png().toBuffer();
        composite.push({ input: crop, left: index * stripWidth + side * 128, top: headerHeight });
      }
    }
    const title = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${headerHeight}"><rect width="100%" height="100%" fill="#18212c"/>${page.map((capture, index) => `<text x="${index * stripWidth + 8}" y="15" font-family="monospace" font-size="12" fill="#e5f4ed">${xml(capture.heroId)}</text><text x="${index * stripWidth + 8}" y="30" font-family="monospace" font-size="10" fill="#a4b8c9">${kind} ${captureKind === 'delivered' ? '' : 'fallback '}· col2 · P1 / P2 · ${rows} rows</text>`).join('')}</svg>`);
    composite.push({ input: title, left: 0, top: 0 });
    const relative = `${outputDirectory}/${kind}-review-part-${part.toLowerCase()}-${Math.floor(start / 5) + 1}.png`;
    const bytes = await sharp({ create: { width, height, channels: 4, background: '#10141c' } }).composite(composite).png().toBuffer();
    await fs.writeFile(path.resolve(repositoryRoot, relative), bytes);
    artifacts.push({ path: relative, sha256: sha(bytes), bytes: bytes.length });
    groups.push({ path: relative, part, captureKind, rows, heroIds: page.map(capture => capture.heroId) });
  }
}
const manifestPath = `${outputDirectory}/${kind}-review-contacts.json`;
await writeJson(manifestPath, { generatedAt: new Date().toISOString(), sourceReport: reportPath,
  sourceReportSha256: sha(await readBytes(reportPath)), preliminary: report.preliminary, source1to1Verified: false,
  capturedByActualBrowserRenderer: true, selectedColumn: column, camps: ['P1', 'P2'], rows: deliveredRows,
  includesRefusedFallbacks: process.argv.includes('--include-refusals'),
  scope: 'Representative column 2 from actual browser captures; all four source columns are checked in the bound runtime trace. This file does not record a completed human review.',
  groups, artifacts });
console.log(JSON.stringify({ kind, preliminary: report.preliminary, characters: report.captures.length, groups: groups.length, manifest: manifestPath }));
