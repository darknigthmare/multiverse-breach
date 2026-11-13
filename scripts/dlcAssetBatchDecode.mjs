import { lstatSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_MAX_PIXELS = 33_554_432;
const RASTER_FORMATS = new Map([
  ['.png', new Set(['png'])], ['.webp', new Set(['webp'])],
  ['.jpg', new Set(['jpeg'])], ['.jpeg', new Set(['jpeg'])],
  ['.gif', new Set(['gif'])], ['.tif', new Set(['tiff'])], ['.tiff', new Set(['tiff'])],
  ['.avif', new Set(['heif', 'avif'])], ['.heif', new Set(['heif'])], ['.heic', new Set(['heif'])],
  ['.jp2', new Set(['jp2'])], ['.jxl', new Set(['jxl'])],
  // These are raster formats even when the installed Sharp build lacks a
  // decoder. An unsupported raster must not silently become integrity-only.
  ['.bmp', new Set(['magick', 'bmp'])], ['.ico', new Set(['magick', 'ico'])],
]);
let sharpModule;

export class DlcBatchDecodeError extends Error {
  constructor(code, message, reason) {
    super(message);
    this.name = 'DlcBatchDecodeError';
    this.code = code;
    this.status = 'UNAVAILABLE';
    this.reason = reason;
  }
}

const failed = reason => new DlcBatchDecodeError('DLC_BATCH_DECODE_FAILED', 'Raster payload could not be decoded.', reason);
const limited = reason => new DlcBatchDecodeError('DLC_BATCH_DECODE_LIMIT', 'Raster payload exceeds the configured decode limit.', reason);
const positiveInteger = value => Number.isSafeInteger(value) && value > 0;

/**
 * Decode bounded raster payloads without returning a full raw pixel buffer.
 * Byte length/SHA verification belongs to the caller's frozen-source receipt.
 * Passing this check does not establish visual fidelity, gameplay or playback.
 */
export async function decodeDlcBatchAsset({ path: payloadPath, sourcePath, maxPixels = DEFAULT_MAX_PIXELS } = {}) {
  if (!positiveInteger(maxPixels)) throw limited('invalid-pixel-limit');
  if (typeof payloadPath !== 'string' || !payloadPath || (sourcePath !== undefined && typeof sourcePath !== 'string')) {
    throw failed('invalid-local-input');
  }
  const extension = path.extname(sourcePath || payloadPath).toLowerCase();
  let input;
  try {
    const stat = lstatSync(payloadPath);
    if (!stat.isFile() || stat.isSymbolicLink()) throw failed('non-regular-input');
    const expected = RASTER_FORMATS.get(extension);
    if (!expected) return {
      status: 'NOT_APPLICABLE', format: extension.slice(1) || 'unknown',
      scope: 'integrity-only-no-raster-decode',
    };
    sharpModule ??= import('sharp').then(module => module.default);
    const sharp = await sharpModule;
    input = sharp(payloadPath, { failOn: 'error', limitInputPixels: maxPixels, animated: true, sequentialRead: true });
    const metadata = await input.metadata();
    if (!expected.has(metadata.format)) throw failed('extension-format-mismatch');
    const width = metadata.width;
    const height = metadata.pageHeight || metadata.height;
    const pages = metadata.pages || 1;
    if (!positiveInteger(width) || !positiveInteger(height) || !positiveInteger(pages)) throw failed('invalid-raster-dimensions');
    if (width > maxPixels / height / pages) throw limited('pixel-limit');
    // metadata() parses headers. stats() requires native pixel decoding, catches
    // broken compressed data, and avoids allocating a JS RGBA output buffer.
    await input.stats();
    return {
      status: 'PASSED', format: metadata.format, width, height, pages,
      decodedPixels: width * height * pages,
      scope: 'sharp-raster-decode-supported-pages',
    };
  } catch (error) {
    if (error instanceof DlcBatchDecodeError) throw error;
    if (/pixel.*limit|limit.*pixel|out of memory/i.test(String(error?.message || ''))) throw limited('pixel-limit');
    // Native decoder messages may contain paths, URLs, or system details. Keep
    // receipts bounded and expose only a stable, safe code/reason to callers.
    throw failed('decoder-rejected-input');
  } finally {
    input?.destroy();
  }
}
