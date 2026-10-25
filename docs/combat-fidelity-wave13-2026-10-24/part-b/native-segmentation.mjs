// Pure alpha-component segmentation. Existing native pixels are assigned to
// their complete figure; this never draws, recolors, mirrors or repairs anatomy.
import assert from 'node:assert/strict';
import sharp from 'sharp';

export async function segmentNativeAtlas(file, { rowCount = 6, minimumBodyPixels = 500, minimumBodyHeight = 40 } = {}) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info, pixels = width * height;
  const labels = new Int32Array(pixels), queue = new Int32Array(pixels), components = [];
  for (let start = 0; start < pixels; start++) {
    if (labels[start] || data[start * 4 + 3] <= 24) continue;
    const id = components.length + 1;
    let at = 0, count = 1, left = width, right = -1, top = height, bottom = -1, sumX = 0, sumY = 0;
    queue[0] = start; labels[start] = id;
    while (at < count) {
      const point = queue[at++], x = point % width, y = Math.floor(point / width);
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
      sumX += x; sumY += y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || xx >= width || yy < 0 || yy >= height) continue;
        const next = yy * width + xx;
        if (!labels[next] && data[next * 4 + 3] > 24) { labels[next] = id; queue[count++] = next; }
      }
    }
    components.push({ id, pixels: count, left, right, top, bottom, width: right - left + 1,
      height: bottom - top + 1, centerX: sumX / count, centerY: sumY / count });
  }
  const bodies = components.filter(c => c.pixels >= minimumBodyPixels && c.height >= minimumBodyHeight);
  assert.ok(bodies.length, 'No complete native figure components found');
  const byComponent = new Map(bodies.map((body, index) => [body.id, index]));
  const bodyBounds = bodies.map(body => ({ ...body, componentIds: [body.id] }));
  for (const component of components) {
    if (byComponent.has(component.id)) continue;
    let best = Infinity, nearest = -1;
    for (const [index, body] of bodies.entries()) {
      const dx = Math.max(body.left - component.right, component.left - body.right, 0);
      const dy = Math.max(body.top - component.bottom, component.top - body.bottom, 0);
      const distance = dx * dx + dy * dy * 1.5
        + ((component.centerX - body.centerX) ** 2 + (component.centerY - body.centerY) ** 2) * 0.001;
      if (distance < best) { best = distance; nearest = index; }
    }
    assert.ok(nearest >= 0);
    byComponent.set(component.id, nearest);
    const b = bodyBounds[nearest];
    b.left = Math.min(b.left, component.left); b.right = Math.max(b.right, component.right);
    b.top = Math.min(b.top, component.top); b.bottom = Math.max(b.bottom, component.bottom);
    b.componentIds.push(component.id);
  }
  // Very faint antialiasing can bridge two bodies. Classify solid components
  // first, then assign every remaining nonzero-alpha pixel to its nearest
  // complete subject. Preserve the exact original RGBA values, including fringe.
  const owner = new Int16Array(pixels);
  let inputVisiblePixels = 0;
  for (let point = 0; point < pixels; point++) {
    if (data[point * 4 + 3] === 0) continue;
    inputVisiblePixels++;
    let index = labels[point] ? byComponent.get(labels[point]) : undefined;
    const x = point % width, y = Math.floor(point / width);
    if (index === undefined) {
      let best = Infinity;
      for (const [candidate, b] of bodyBounds.entries()) {
        const dx = Math.max(b.left - x, x - b.right, 0), dy = Math.max(b.top - y, y - b.bottom, 0);
        const distance = dx * dx + dy * dy * 1.5
          + ((x - bodies[candidate].centerX) ** 2 + (y - bodies[candidate].centerY) ** 2) * 0.001;
        if (distance < best) { best = distance; index = candidate; }
      }
    }
    owner[point] = index + 1;
  }
  for (let point = 0; point < pixels; point++) {
    if (!owner[point]) continue;
    const b = bodyBounds[owner[point] - 1], x = point % width, y = Math.floor(point / width);
    b.left = Math.min(b.left, x); b.right = Math.max(b.right, x); b.top = Math.min(b.top, y); b.bottom = Math.max(b.bottom, y);
  }
  const frames = bodyBounds.map((bounds, index) => {
    const frameWidth = bounds.right - bounds.left + 1, frameHeight = bounds.bottom - bounds.top + 1;
    const rgba = Buffer.alloc(frameWidth * frameHeight * 4);
    let copiedPixels = 0;
    for (let y = bounds.top; y <= bounds.bottom; y++) for (let x = bounds.left; x <= bounds.right; x++) {
      if (owner[y * width + x] !== index + 1) continue;
      const source = (y * width + x) * 4;
      data.copy(rgba, ((y - bounds.top) * frameWidth + x - bounds.left) * 4, source, source + 4);
      copiedPixels++;
    }
    const sourceRow = Math.max(0, Math.min(rowCount - 1, Math.floor(bodies[index].centerY / height * rowCount)));
    return { data: rgba, width: frameWidth, height: frameHeight, sourceRow,
      centerX: bodies[index].centerX - bounds.left,
      sourceBounds: { left: bounds.left, top: bounds.top, width: frameWidth, height: frameHeight },
      bodyBounds: bodies[index], copiedPixels, componentIds: bounds.componentIds };
  });
  const rows = Array.from({ length: rowCount }, (_, row) => frames.filter(frame => frame.sourceRow === row)
    .sort((a, b) => a.bodyBounds.centerX - b.bodyBounds.centerX));
  assert.equal(frames.reduce((sum, frame) => sum + frame.copiedPixels, 0), inputVisiblePixels,
    'Every visible source pixel must occur exactly once after segmentation');
  return { width, height, frames, rows, rowCounts: rows.map(row => row.length),
    inputVisiblePixels, allVisiblePixelsPreservedExactlyOnce: true,
    method: 'eight-connected-alpha-components-with-nearest-disconnected-fragment-assignment' };
}

export function commonSourceScale(frames, calibrationHeight, targetBodyHeight = 194) {
  let scale = targetBodyHeight / calibrationHeight;
  for (const frame of frames) {
    const half = Math.max(frame.centerX, frame.width - frame.centerX);
    scale = Math.min(scale, 112 / half, 230 / frame.height);
  }
  assert.ok(Number.isFinite(scale) && scale > 0);
  return scale;
}

export async function packNativeFrames(frames, scale) {
  const composites = [], frameBounds = [];
  for (const [column, frame] of frames.entries()) {
    const width = Math.max(1, Math.round(frame.width * scale)), height = Math.max(1, Math.round(frame.height * scale));
    const left = Math.round(128 - frame.centerX * scale), top = 244 - height;
    assert.ok(left >= 10 && top >= 10 && left + width <= 246 && top + height <= 246, 'Native art exceeds padded cell');
    const bytes = await sharp(frame.data, { raw: { width: frame.width, height: frame.height, channels: 4 } })
      .resize(width, height, { kernel: sharp.kernel.nearest }).png().toBuffer();
    composites.push({ input: bytes, left: column * 256 + left, top });
    frameBounds.push({ source: frame.sourceBounds, output: { left, top, width, height },
      sourceBodyBounds: frame.bodyBounds, sourceAlphaPixels: frame.copiedPixels,
      completeNativeComponent: true });
  }
  const bytes = await sharp({ create: { width: 1024, height: 256, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).png({ compressionLevel: 9 }).toBuffer();
  return { bytes, frameBounds };
}
