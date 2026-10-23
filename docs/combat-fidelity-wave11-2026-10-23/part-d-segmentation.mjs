// Technical alpha segmentation adapted verbatim from scripts/buildCombatEntityAssets.mjs,
// with explicit measured row-cut hints for the native sources with measured or heuristic row-cut hints.
// No pixels are drawn or reconstructed; only existing RGBA is separated.
import assert from 'node:assert/strict';
import sharp from 'sharp';
function alphaSeam(length, low, high, preferred, alphaAt) {
  const span = high - low + 1;
  let previous = new Float64Array(span);
  const parents = Array.from({ length }, () => new Int16Array(span));
  const cost = (step, value) => {
    const alpha = alphaAt(step, value);
    return alpha * alpha + (value - preferred) ** 2 * 0.035;
  };
  for (let v = 0; v < span; v++) previous[v] = cost(0, low + v);
  for (let step = 1; step < length; step++) {
    const current = new Float64Array(span);
    for (let v = 0; v < span; v++) {
      let best = Infinity;
      let bestParent = v;
      for (let dv = -2; dv <= 2; dv++) {
        const p = v + dv;
        if (p < 0 || p >= span) continue;
        const candidate = previous[p] + Math.abs(dv) * 1.5;
        if (candidate < best) { best = candidate; bestParent = p; }
      }
      current[v] = best + cost(step, low + v);
      parents[step][v] = bestParent;
    }
    previous = current;
  }
  let at = 0;
  for (let v = 1; v < span; v++) if (previous[v] < previous[at]) at = v;
  const result = new Int32Array(length);
  for (let step = length - 1; step >= 0; step--) {
    result[step] = low + at;
    at = parents[step][at];
  }
  return result;
}

function boundsFor(data, width, height, allowEmpty = false) {
  let left = width, top = height, right = -1, bottom = -1, pixels = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] <= 4) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y); pixels++;
  }
  if (right < left || bottom < top) { assert.ok(allowEmpty, 'Native frame has no visible subject'); return null; }
  return { left, top, width: right - left + 1, height: bottom - top + 1, pixels };
}

export async function segmentWithRowCutHints(file, rowCount, rowCutHints, { allowEmptyRows = [] } = {}) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  const { width, height } = info;
  assert.equal(rowCutHints.length,rowCount-1,'Explicit native row cuts must cover all source row boundaries');
  assert.ok(rowCutHints.every((y,i)=>Number.isFinite(y)&&y>0&&y<height-1&&(i===0||y>rowCutHints[i-1])));
  const valleys = rowCutHints;
  const rowSeams = valleys.map(preferred => alphaSeam(width, Math.max(1, preferred - 30), Math.min(height - 2, preferred + 30), preferred,
    (x, y) => data[(y * width + x) * 4 + 3]));
  const rows = [];
  for (let row = 0; row < rowCount; row++) {
    const yStart = row === 0 ? 0 : Math.min(...rowSeams[row - 1]);
    const yEnd = row === rowCount - 1 ? height : Math.max(...rowSeams[row]) + 1;
    const rowHeight = yEnd - yStart;
    const rowData = Buffer.alloc(width * rowHeight * 4);
    for (let y = yStart; y < yEnd; y++) for (let x = 0; x < width; x++) {
      if (row > 0 && y < rowSeams[row - 1][x]) continue;
      if (row < rowCount - 1 && y >= rowSeams[row][x]) continue;
      const sourceOffset = (y * width + x) * 4;
      data.copy(rowData, ((y - yStart) * width + x) * 4, sourceOffset, sourceOffset + 4);
    }
    const columnSeams = [1, 2, 3].map(column => {
      const preferred = Math.round(column * width / 4);
      const radius = Math.round(width / 4 * 0.37);
      return alphaSeam(rowHeight, preferred - radius, preferred + radius, preferred,
        (y, x) => rowData[(y * width + x) * 4 + 3]);
    });
    const frames = [];
    for (let column = 0; column < 4; column++) {
      const frameData = Buffer.alloc(rowData.length);
      for (let y = 0; y < rowHeight; y++) {
        const xStart = column === 0 ? 0 : columnSeams[column - 1][y];
        const xEnd = column === 3 ? width : columnSeams[column][y];
        rowData.copy(frameData, (y * width + xStart) * 4, (y * width + xStart) * 4, (y * width + xEnd) * 4);
      }
      const bounds = boundsFor(frameData, width, rowHeight, allowEmptyRows.includes(row));
      frames.push({ data: frameData, width, height: rowHeight, bounds, centerX: (column + 0.5) * width / 4 });
    }
    const seamSamples = columnSeams.flatMap(seam => [...seam].map((x, y) => rowData[(y * width + x) * 4 + 3]));
    rows.push({ frames, sourceBounds: { top: yStart, bottom: yEnd }, alphaValley: valleys[row] ?? null,
      rowBoundaryReview: { aboveCrossedVisiblePixels:row===0?0:[...rowSeams[row-1]].filter((y,x)=>data[(y*width+x)*4+3]>24).length, belowCrossedVisiblePixels:row===rowCount-1?0:[...rowSeams[row]].filter((y,x)=>data[(y*width+x)*4+3]>24).length },
      seamReview: { crossedOpaquePixels: seamSamples.filter(alpha => alpha > 220).length, crossedVisiblePixels: seamSamples.filter(alpha => alpha > 24).length } });
  }
  return { width, height, rows, alpha: true, rowValleys: valleys };
}

