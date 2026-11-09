import { buildKartMesh } from './kartModel.js';

const isColor = value => /^#[0-9a-f]{6}$/i.test(String(value));
const clampByte = value => Math.max(0, Math.min(255, Math.round(value)));

/** Collection paint changes the personal chassis, never its driver or geometry. */
export function applyKartLivery(spec, cosmetic) {
  if (!spec) return spec;
  const sourceColor = spec.livery?.sourceColor || spec.color;
  if (!cosmetic || !isColor(cosmetic.color)) {
    if (!spec.livery) return spec;
    const { livery: _livery, ...original } = spec;
    return { ...original, color: sourceColor };
  }
  const color = cosmetic.color.toLowerCase();
  return {
    ...spec,
    color,
    livery: Object.freeze({
      id: cosmetic.id || `paint:${color}`,
      name: cosmetic.name || null,
      sourceColor,
      color,
      style: cosmetic.style || null,
      treatment: 'personal-chassis-primary-paint',
      spriteTreatment: 'visible-mesh-face-paint-mask'
    })
  };
}

/**
 * Paint only the visible faces whose material actually changes in the mesh.
 * Projection and lighting match the deterministic atlas exporter. A depth mask
 * distinguishes paint from tyres/ornaments even when they share the same RGB.
 * Source-pixel matching prevents painting a source that no longer matches the
 * technical projection. This never paints character or illustration images.
 */
export function recolorKartPixels(pixels, spec, { width, height } = {}) {
  const result = new Uint8ClampedArray(pixels);
  if (!spec?.livery || spec.color === spec.livery.sourceColor) return result;
  const size = height || Math.sqrt(pixels.length / (8 * 4));
  const atlasWidth = width || size * 8;
  if (!Number.isInteger(size) || size < 1 || atlasWidth !== size * 8 || pixels.length !== atlasWidth * size * 4) {
    throw new Error('The kart paint mask requires a complete eight-view square-frame RGBA atlas.');
  }
  const source = buildKartMesh({ ...spec, color: spec.livery.sourceColor });
  const target = buildKartMesh(spec);
  const light = [-0.42, 0.82, 0.38];
  const dot = (vector, basis) => vector[0] * basis[0] + vector[1] * basis[1] + vector[2] * basis[2];
  const edge = (a, b, x, y) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  const bound = value => Math.max(0, Math.min(size - 1, value));
  for (let view = 0; view < 8; view += 1) {
    const angle = view * Math.PI / 4, se = Math.sin(0.56), ce = Math.cos(0.56);
    const sa = Math.sin(angle), ca = Math.cos(angle);
    const right = [ca, 0, -sa], up = [-sa * se, ce, -ca * se], forward = [sa * ce, se, ca * ce];
    const scale = size * 0.203125;
    const project = position => [size * 0.5 + dot(position, right) * scale,
      size * 0.67 - dot(position, up) * scale, dot(position, forward)];
    const depth = new Float64Array(size * size).fill(-Infinity);
    for (let vertex = 0; vertex < source.positions.length / 3; vertex += 3) {
      const normal = source.normals.subarray(vertex * 3, vertex * 3 + 3);
      if (dot(normal, forward) <= 0) continue;
      const points = [0, 1, 2].map(corner => project(source.positions.subarray((vertex + corner) * 3, (vertex + corner + 1) * 3)));
      const [a, b, c] = points, area = edge(a, b, c[0], c[1]);
      if (Math.abs(area) < 1e-8) continue;
      const minX = bound(Math.floor(Math.min(a[0], b[0], c[0]))), maxX = bound(Math.ceil(Math.max(a[0], b[0], c[0])));
      const minY = bound(Math.floor(Math.min(a[1], b[1], c[1]))), maxY = bound(Math.ceil(Math.max(a[1], b[1], c[1])));
      const illumination = 0.5 + Math.max(0, dot(normal, light)) * 0.48;
      const original = [0, 1, 2].map(channel => clampByte(source.colors[vertex * 4 + channel] * 255 * illumination));
      const painted = [0, 1, 2].map(channel => clampByte(target.colors[vertex * 4 + channel] * 255 * illumination));
      for (let y = minY; y <= maxY; y += 1) for (let x = minX; x <= maxX; x += 1) {
        const w0 = edge(b, c, x + 0.5, y + 0.5) / area;
        const w1 = edge(c, a, x + 0.5, y + 0.5) / area;
        const w2 = 1 - w0 - w1;
        if (w0 < -1e-7 || w1 < -1e-7 || w2 < -1e-7) continue;
        const z = w0 * a[2] + w1 * b[2] + w2 * c[2], location = y * size + x;
        if (z <= depth[location]) continue;
        depth[location] = z;
        const index = (y * atlasWidth + view * size + x) * 4;
        const matches = pixels[index + 3] === 255 && original.every((value, channel) => value === pixels[index + channel]);
        for (let channel = 0; channel < 3; channel += 1) result[index + channel] = matches ? painted[channel] : pixels[index + channel];
      }
    }
  }
  return result;
}

/**
 * Recolour an image/canvas into a new drawable canvas. No cache is retained;
 * callers cache by atlas URL + source colour + target colour. Without a livery
 * the original source is returned. The registered character image is never an
 * input to this function. Canvas/readback errors propagate to the caller.
 */
export function recolorKartAtlas(source, spec, { canvasFactory } = {}) {
  if (!source || !spec?.livery || spec.color === spec.livery.sourceColor) return source;
  const width = source.naturalWidth || source.width;
  const height = source.naturalHeight || source.height;
  if (!(width > 0 && height > 0)) return source;
  const canvas = canvasFactory?.(width, height)
    || source.ownerDocument?.createElement('canvas')
    || (typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(width, height) : null)
    || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
  if (!canvas) throw new Error('No canvas is available for the kart livery.');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('The kart livery canvas could not be initialized.');
  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, width, height);
  image.data.set(recolorKartPixels(image.data, spec, { width, height }));
  context.putImageData(image, 0, 0);
  return canvas;
}

/** Engine angles grow clockwise in X/Y; atlas views grow rear -> right. */
export function getKartRelativeDirection(kartAngle, cameraAngle) {
  if (!Number.isFinite(kartAngle) || !Number.isFinite(cameraAngle)) return 0;
  const step = Math.PI / 4;
  return ((Math.round((kartAngle - cameraAngle) / step) % 8) + 8) % 8;
}
