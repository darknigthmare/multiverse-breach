import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';

const script = fileURLToPath(new URL('./cgReferenceImageDecode.mjs', import.meta.url));
const run = input => spawnSync(process.execPath, [script], {
  input, encoding: 'utf8', timeout: 15_000, maxBuffer: 4096,
});
const rejected = input => {
  const result = run(input);
  assert.notEqual(result.status, 0, 'undecodable input must exit unsuccessfully');
  assert.deepEqual(JSON.parse(result.stdout), { ok: false });
  assert.equal(result.stderr, '', 'native decoder details must not leak');
};
const png = await sharp({ create: { width: 19, height: 13, channels: 4, background: '#81c4e5' } }).png().toBuffer();
const jpeg = await sharp({ create: { width: 17, height: 11, channels: 3, background: '#dc7341' } }).jpeg().toBuffer();

test('valid PNG and JPEG are fully decoded from stdin and report bounded metadata', () => {
  for (const [bytes, format, width, height] of [[png, 'png', 19, 13], [jpeg, 'jpeg', 17, 11]]) {
    const result = run(bytes);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.deepEqual(JSON.parse(result.stdout), { ok: true, format, width, height, pages: 1 });
    assert.ok(result.stdout.length < 128);
  }
});

test('empty input, PNG/JPEG signatures, HTML and LFS pointers never become visual evidence', () => {
  for (const bytes of [Buffer.alloc(0), png.subarray(0, 8), jpeg.subarray(0, 3),
    Buffer.from('<html>not an image</html>'),
    Buffer.from('version https://git-lfs.github.com/spec/v1\noid sha256:' + '0'.repeat(64) + '\nsize 123\n')]) rejected(bytes);
});

test('headers with truncated PNG or JPEG pixel data are rejected by full decode', () => {
  // Keep PNG IHDR and JPEG SOF so metadata-only validation would be inadequate.
  rejected(png.subarray(0, png.length - 20));
  rejected(jpeg.subarray(0, jpeg.length - 25));
});

test('animated GIF decodes every reported page and returns per-page dimensions', async () => {
  const pixels = Buffer.alloc(2 * 4 * 4);
  for (let offset = 0; offset < pixels.length; offset += 4) {
    pixels[offset] = offset < 16 ? 255 : 0;
    pixels[offset + 2] = offset < 16 ? 0 : 255;
    pixels[offset + 3] = 255;
  }
  const gif = await sharp(pixels, { raw: { width: 2, height: 4, channels: 4, pageHeight: 2 } })
    .gif({ delay: [100, 100] }).toBuffer();
  const result = run(gif);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { ok: true, format: 'gif', width: 2, height: 2, pages: 2 });
});

test('a complete valid image above the pixel budget is rejected before allocation', () => {
  // This is a complete SVG, not an invalid large header whose compressed data
  // could fail for another reason. Only dimensions exceed the decoder budget.
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="4097"><rect width="8192" height="4097" fill="red"/></svg>');
  rejected(svg);
});

test('stdin above 64 MiB fails without returning payload or decoder diagnostics', () => {
  rejected(Buffer.alloc(64 * 1024 * 1024 + 1));
});
