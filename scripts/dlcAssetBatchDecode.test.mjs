import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { decodeDlcBatchAsset } from './dlcAssetBatchDecode.mjs';

function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'dlc-batch-decode-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return { directory, file: name => path.join(directory, name) };
}
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const hasCode = code => error => error.code === code && error.status === 'UNAVAILABLE';

for (const [extension, format] of [['png', 'png'], ['webp', 'webp'], ['jpg', 'jpeg']]) {
  test('decodes a canonical ' + extension + ' payload at its actual dimensions without changing its bytes', async t => {
    const f = fixture(t);
    const file = f.file('canonical.' + extension);
    await sharp({ create: { width: 7, height: 5, channels: 4, background: '#37a2cc' } }).toFormat(format).toFile(file);
    const before = sha(readFileSync(file));
    const decoded = await decodeDlcBatchAsset({ path: file, sourcePath: 'DLC/Example/assets/images/canonical.' + extension });
    assert.deepEqual(decoded, { status: 'PASSED', format, width: 7, height: 5, pages: 1, decodedPixels: 35, scope: 'sharp-raster-decode-supported-pages' });
    assert.equal(sha(readFileSync(file)), before);
  });
}

test('rejects corrupted pixel data even when a valid PNG header still supplies metadata', async t => {
  const f = fixture(t);
  const file = f.file('corrupt.png');
  const bytes = await sharp({ create: { width: 16, height: 12, channels: 4, background: '#7f3faa' } }).png().toBuffer();
  let offset = 8;
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT') {
      bytes[offset + 8 + Math.floor(length / 2)] ^= 0xff;
      break;
    }
    offset += length + 12;
  }
  assert.ok(offset < bytes.length, 'fixture has compressed PNG pixel data');
  writeFileSync(file, bytes);
  assert.equal((await sharp(file, { failOn: 'error' }).metadata()).width, 16);
  await assert.rejects(decodeDlcBatchAsset({ path: file }), hasCode('DLC_BATCH_DECODE_FAILED'));
});

test('rejects truncated rasters and does not expose native input paths in safe errors', async t => {
  const f = fixture(t);
  const file = f.file('private-url-name.png');
  const bytes = await sharp({ create: { width: 4, height: 3, channels: 4, background: '#234567' } }).png().toBuffer();
  writeFileSync(file, bytes.subarray(0, 40));
  await assert.rejects(decodeDlcBatchAsset({ path: file }), error => {
    assert.equal(error.code, 'DLC_BATCH_DECODE_FAILED');
    assert.ok(!error.message.includes(file));
    assert.ok(!error.message.includes('private-url-name'));
    return true;
  });
});

test('enforces the total pixel budget and identifies every GIF page', async t => {
  const f = fixture(t);
  const file = f.file('canonical.gif');
  const pixels = Buffer.alloc(2 * 4 * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = i < 16 ? 255 : 0;
    pixels[i + 2] = i < 16 ? 0 : 255;
    pixels[i + 3] = 255;
  }
  await sharp(pixels, { raw: { width: 2, height: 4, channels: 4, pageHeight: 2 } }).gif({ delay: [100, 100] }).toFile(file);
  const decoded = await decodeDlcBatchAsset({ path: file, maxPixels: 8 });
  assert.equal(decoded.width, 2);
  assert.equal(decoded.height, 2);
  assert.equal(decoded.pages, 2);
  assert.equal(decoded.decodedPixels, 8);
  await assert.rejects(decodeDlcBatchAsset({ path: file, maxPixels: 7 }), hasCode('DLC_BATCH_DECODE_LIMIT'));
});

test('a renamed raster cannot pass as a different declared format', async t => {
  const f = fixture(t);
  const file = f.file('payload.bin');
  await sharp({ create: { width: 2, height: 2, channels: 3, background: '#345678' } }).png().toFile(file);
  await assert.rejects(decodeDlcBatchAsset({ path: file, sourcePath: 'DLC/Example/assets/images/claimed.webp' }), error => {
    assert.equal(error.code, 'DLC_BATCH_DECODE_FAILED');
    assert.equal(error.reason, 'extension-format-mismatch');
    return true;
  });
});

test('non-raster media explicitly keep an integrity-only scope without a decoder claim', async t => {
  const f = fixture(t);
  const file = f.file('canonical.ogg');
  writeFileSync(file, Buffer.from('fixture-byte-integrity-is-validated-separately'));
  assert.deepEqual(await decodeDlcBatchAsset({ path: file }), { status: 'NOT_APPLICABLE', format: 'ogg', scope: 'integrity-only-no-raster-decode' });
});

test('invalid limits, missing payloads, directories and symlink payloads fail safely', async t => {
  const f = fixture(t);
  const file = f.file('canonical.png');
  await sharp({ create: { width: 2, height: 2, channels: 3, background: '#345678' } }).png().toFile(file);
  await assert.rejects(decodeDlcBatchAsset({ path: file, maxPixels: 0 }), hasCode('DLC_BATCH_DECODE_LIMIT'));
  await assert.rejects(decodeDlcBatchAsset({ path: f.file('missing.png') }), hasCode('DLC_BATCH_DECODE_FAILED'));
  const directory = f.file('directory.png'); mkdirSync(directory);
  await assert.rejects(decodeDlcBatchAsset({ path: directory }), hasCode('DLC_BATCH_DECODE_FAILED'));
  const link = f.file('link.png'); symlinkSync(file, link);
  await assert.rejects(decodeDlcBatchAsset({ path: link }), hasCode('DLC_BATCH_DECODE_FAILED'));
});
