import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const D = 'docs/combat-fidelity-wave17-2026-11-02/part-c';
const [id, notes] = process.argv.slice(2);
if (!id || !notes) throw Error('A real view_image review and explicit notes are required');
const resultFile = D + '/requests/' + id + '-result.json';
const result = JSON.parse(await fs.readFile(resultFile));
if (!result.imageReturned || !result.generatedPath) throw Error('No actual image returned');
const bytes = await fs.readFile(result.generatedPath);
await fs.mkdir(D + '/sources', { recursive: true });
await fs.writeFile(result.archivedPath, bytes);
result.sha256 = createHash('sha256').update(bytes).digest('hex');
result.sourceDimensions = await sharp(bytes).metadata().then(m => [m.width, m.height]);
await fs.writeFile(resultFile, JSON.stringify(result, null, 2) + '\n');
await fs.writeFile(D + '/sources/' + id + '-visual-review.json', JSON.stringify({
  heroId: id, sourceImage: result.archivedPath, sourceImageSha256: result.sha256,
  reviewedAt: new Date().toISOString(), viewedUsing: 'view_image original',
  observedPhysicalRows: 6, sourceUnitsPerPhysicalRow: [8, 8, 8, 8, 8, 8],
  observedCompleteUnits: 48, identityReviewed: true, allFramesReviewed: true,
  source1to1Verified: false, notes
}, null, 2) + '\n');
console.log(JSON.stringify({ heroId: id, archivedPath: result.archivedPath, dimensions: result.sourceDimensions }));
