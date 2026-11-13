import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { isCgReferenceImageAttested } from './cgSourceEvidence.mjs';

const png = await sharp({ create: { width: 2, height: 3, channels: 4, background: '#345678' } }).png().toBuffer();
const jpeg = await sharp({ create: { width: 4, height: 5, channels: 3, background: '#987654' } }).jpeg().toBuffer();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fixture = t => {
  const root = mkdtempSync(path.join(tmpdir(), 'cg-reference-attestation-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (name, bytes) => {
    writeFileSync(path.join(root, name), bytes);
    return { path: name, sha256: sha(bytes), bytes: bytes.length };
  };
  return { root, put };
};

test('readable PNG and JPEG require their declared hash, byte count, dimensions and format', t => {
  const f = fixture(t);
  for (const [name, bytes, width, height, format] of [['valid.png', png, 2, 3, 'PNG'], ['valid.jpg', jpeg, 4, 5, 'jpg']]) {
    const reference = { ...f.put(name, bytes), width, height, format };
    assert.equal(isCgReferenceImageAttested(f.root, reference), true);
    for (const change of [{ sha256: '0'.repeat(64) }, { bytes: bytes.length + 1 }, { width: width + 1 }, { height: height + 1 }, { format: 'webp' }]) {
      assert.equal(isCgReferenceImageAttested(f.root, { ...reference, ...change }), false);
    }
    assert.equal(isCgReferenceImageAttested(f.root, reference), true, 'a bad declaration must not poison the actual-byte decoder cache');
  }
});

test('matching declarations cannot turn headers, truncated images, HTML or pointers into evidence', t => {
  const f = fixture(t);
  const cases = [ ['png-header.png', png.subarray(0, 8)], ['jpeg-header.jpeg', jpeg.subarray(0, 3)],
    ['truncated.png', png.subarray(0, Math.floor(png.length / 2))], ['truncated.jpeg', jpeg.subarray(0, Math.floor(jpeg.length / 2))],
    ['html.png', Buffer.from('<html>not an image</html>')],
    ['pointer.png', Buffer.from('version https://git-lfs.github.com/spec/v1\noid sha256:' + sha(png) + '\nsize ' + png.length + '\n')] ];
  for (const [name, bytes] of cases) assert.equal(isCgReferenceImageAttested(f.root, f.put(name, bytes)), false, name);
});

test('decoder cache follows the actual bytes rather than a previously attested path', t => {
  const f = fixture(t), original = { ...f.put('mutable.png', png), width: 2, height: 3, format: 'png' };
  assert.equal(isCgReferenceImageAttested(f.root, original), true);
  const replacement = { ...f.put('mutable.png', jpeg), width: 4, height: 5, format: 'jpeg' };
  assert.equal(isCgReferenceImageAttested(f.root, original), false);
  assert.equal(isCgReferenceImageAttested(f.root, { ...replacement, width: 2, height: 3, format: 'png' }), false);
  assert.equal(isCgReferenceImageAttested(f.root, replacement), true);
  f.put('mutable.png', png);
  assert.equal(isCgReferenceImageAttested(f.root, original), true);
});
