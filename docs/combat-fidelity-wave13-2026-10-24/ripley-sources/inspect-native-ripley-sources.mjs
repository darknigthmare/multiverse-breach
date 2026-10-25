import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { segmentRipleySource } from './native-ripley-segmentation.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const directory = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
for (const name of process.argv.slice(2)) {
  const file = `${directory}/${name}.native.png`;
  const source = await segmentRipleySource(file, name.includes('corrective') ? 4 : 7);
  const report = {
    file, sha256: source.sha256, width: source.width, height: source.height,
    edgePixels: source.edgePixels, actualSegmentedRows: source.frames.length / 4,
    distinctRealRawFrames: new Set(source.frames.map(frame => hash(frame.raw))).size,
    frames: source.frames.map(frame => ({ nativeRow: frame.nativeRow, nativeColumn: frame.nativeColumn,
      sourceRect: frame.sourceRect, rawSha256: hash(frame.raw),
      canvasClipped: frame.sourceRect.x <= 0 || frame.sourceRect.y <= 0
        || frame.sourceRect.x + frame.sourceRect.width >= source.width
        || frame.sourceRect.y + frame.sourceRect.height >= source.height
    }))
  };
  await fs.writeFile(file.replace('.native.png', '.segmentation.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ name, rows: report.actualSegmentedRows, distinct: report.distinctRealRawFrames,
    clipped: report.frames.filter(frame => frame.canvasClipped).map(frame => [frame.nativeRow, frame.nativeColumn]), edgePixels: report.edgePixels }));
}
