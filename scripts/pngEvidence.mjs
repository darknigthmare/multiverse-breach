/** Bounded evidence decoder, not an art judge. PNG spec: https://www.w3.org/TR/png-3/
 * Supported: static, non-interlaced, 8-bit grayscale/RGB/indexed/gray-alpha/RGBA.
 * Other legal PNG encodings require re-export, not a claim of corrupted artwork.
 * Color profiles are not transformed; pixel hash compares decoded RGBA samples.
 */
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
export const PNG_EVIDENCE_LIMITS = Object.freeze({ bytes: 25 * 1024 * 1024, dimension: 8192, pixels: 16 * 1024 * 1024 });
const signature = Buffer.from('89504e470d0a1a0a', 'hex');
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function pngCrc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function fail(message) { throw new Error(`PNG_EVIDENCE: ${message}`); }
function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}
export function inspectPngEvidence(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 57 || bytes.length > PNG_EVIDENCE_LIMITS.bytes) fail('invalid file size');
  if (!bytes.subarray(0, 8).equals(signature)) fail('signature mismatch');
  let offset = 8, width, height, colorType, channels, palette, transparency;
  let header = false, dataStarted = false, dataClosed = false, ended = false;
  const idat = [];
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) fail('truncated chunk header');
    const length = bytes.readUInt32BE(offset), end = offset + 12 + length;
    if (end > bytes.length) fail('truncated chunk data');
    const type = bytes.toString('latin1', offset + 4, offset + 8);
    if (!/^[A-Za-z]{2}[A-Z][A-Za-z]$/.test(type)) fail('invalid chunk type');
    if (pngCrc32(bytes.subarray(offset + 4, end - 4)) !== bytes.readUInt32BE(end - 4)) fail(`CRC mismatch: ${type}`);
    const data = bytes.subarray(offset + 8, end - 4);
    if (!header && type !== 'IHDR') fail('IHDR must be first');
    if (dataStarted && type !== 'IDAT') dataClosed = true;
    if (['acTL', 'fcTL', 'fdAT'].includes(type)) fail('unsupported animated PNG; export a static frame');
    switch (type) {
      case 'IHDR': {
        if (header || offset !== 8 || length !== 13) fail('invalid or repeated IHDR');
        width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9];
        if (!width || !height || width > PNG_EVIDENCE_LIMITS.dimension || height > PNG_EVIDENCE_LIMITS.dimension || width * height > PNG_EVIDENCE_LIMITS.pixels) fail('dimension budget exceeded');
        channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType];
        if (data[8] !== 8 || !channels || data[12] !== 0) fail('unsupported encoding; export static non-interlaced 8-bit PNG');
        if (data[10] !== 0 || data[11] !== 0) fail('invalid compression/filter method');
        header = true;
        break;
      }
      case 'PLTE':
        if (palette || dataStarted || transparency || [0, 4].includes(colorType) || !length || length > 768 || length % 3) fail('invalid palette');
        palette = data;
        break;
      case 'tRNS':
        if (transparency || dataStarted || [4, 6].includes(colorType)) fail('invalid transparency order/type');
        if ((colorType === 0 && length !== 2) || (colorType === 2 && length !== 6)
          || (colorType === 3 && (!palette || !length || length > palette.length / 3))) fail('invalid transparency length');
        if (colorType !== 3) for (let i = 0; i < length; i += 2) if (data.readUInt16BE(i) > 255) fail('invalid 8-bit transparency sample');
        transparency = data;
        break;
      case 'IDAT':
        if (dataClosed || (colorType === 3 && !palette)) fail('noncontiguous IDAT or missing indexed palette');
        dataStarted = true; idat.push(data);
        break;
      case 'IEND':
        if (length || !dataStarted || end !== bytes.length) fail('invalid IEND or trailing bytes');
        ended = true;
        break;
      default:
        if (type[0] === type[0].toUpperCase()) fail(`unsupported critical chunk: ${type}`);
    }
    offset = end;
    if (ended) break;
  }
  if (!ended || !idat.length) fail('missing image data or IEND');
  const rowBytes = width * channels, expected = (rowBytes + 1) * height;
  const compressed = Buffer.concat(idat);
  let inflated;
  try { inflated = inflateSync(compressed, { info: true, maxOutputLength: expected }); }
  catch { fail('invalid, truncated or oversized deflate stream'); }
  if (inflated.buffer.length !== expected || inflated.engine.bytesWritten !== compressed.length) fail('wrong decoded length or trailing compressed data');
  const raw = inflated.buffer, samples = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (rowBytes + 1)], start = y * rowBytes;
    if (filter > 4) fail('invalid scanline filter');
    for (let x = 0; x < rowBytes; x++) {
      const a = x >= channels ? samples[start + x - channels] : 0;
      const b = y ? samples[start + x - rowBytes] : 0;
      const c = y && x >= channels ? samples[start + x - rowBytes - channels] : 0;
      const prediction = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      samples[start + x] = (raw[y * (rowBytes + 1) + x + 1] + prediction) & 255;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  let visiblePixels = 0;
  for (let i = 0; i < width * height; i++) {
    const s = i * channels, d = i * 4;
    let r, g, b, a = 255;
    if (colorType === 3) {
      const index = samples[s]; if (index * 3 + 2 >= palette.length) fail('palette index out of range');
      [r, g, b] = palette.subarray(index * 3, index * 3 + 3); a = transparency?.[index] ?? 255;
    } else if (colorType === 0 || colorType === 4) {
      r = g = b = samples[s];
      a = colorType === 4 ? samples[s + 1] : transparency && r === transparency.readUInt16BE(0) ? 0 : 255;
    } else {
      [r, g, b] = samples.subarray(s, s + 3);
      a = colorType === 6 ? samples[s + 3] : transparency && r === transparency.readUInt16BE(0) && g === transparency.readUInt16BE(2) && b === transparency.readUInt16BE(4) ? 0 : 255;
    }
    // Fully transparent RGB differences must not manufacture different evidence views.
    rgba[d] = a ? r : 0; rgba[d + 1] = a ? g : 0; rgba[d + 2] = a ? b : 0; rgba[d + 3] = a;
    if (a) visiblePixels++;
  }
  if (!visiblePixels) fail('fully transparent evidence');
  return { sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
    width, height, decoded: true, visiblePixels,
    pixelSha256: createHash('sha256').update(`rgba8:${width}:${height}:`).update(rgba).digest('hex'),
    decoderScope: 'STATIC_8BIT_NONINTERLACED_RGBA_SAMPLES_NO_COLOR_TRANSFORM' };
}
