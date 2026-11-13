import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { loadCgSourceEvidence, loadQualifiedCgIdentityLocks } from './cgSourceEvidence.mjs';

// A fully decodable 1×1 PNG fixture; a signature alone is not an image.
const bitmap = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADUlEQVQImWMwCsj7DwADmAHwphbYCgAAAABJRU5ErkJggg==', 'base64');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fixture = t => {
  const root = mkdtempSync(path.join(tmpdir(), 'cg-identity-purpose-'));
  t.after(() => rmSync(root, { recursive: true }));
  mkdirSync(path.join(root, 'docs/cg'), { recursive: true });
  const image = name => { writeFileSync(path.join(root, name), bitmap); return { path: name, sha256: hash(bitmap), bytes: bitmap.length, viewed: true }; };
  const write = references => writeFileSync(path.join(root, 'docs/cg/aura-reference-evidence.json'), JSON.stringify({
    characterId: 'aura_7', incarnation: 'Helios 56 — AURA-7 original V2 portrait',
    visualLocks: { face: 'Original AURA identity and a specifically selected V2 silhouette, never Sonic anatomy' }, references }));
  return { root, image, write };
};

test('explicit costume-only and CG13 support never qualify the target identity on their own', t => {
  const f = fixture(t), support = f.image('support.png');
  for (const scoped of [{ referencePurpose: 'costume', slot: 'CG13' },
    { role: 'costume-only-scoped-support' },
    { referenceScope: 'external-costume-support-only-not-AURA-identity' },
    { referencePurpose: 'body-costume-support', usedForIdentity: false }]) {
    f.write([{ ...support, ...scoped }]);
    const evidence = loadCgSourceEvidence(f.root).get('aura_7');
    assert.equal(evidence.references.length, 1, 'support remains available as scoped provenance');
    assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
  }
});

test('a real identity plus valid support qualifies only the identity while preserving support history', t => {
  const f = fixture(t), identity = { ...f.image('identity.png'), referencePurpose: 'identity', role: 'canonical-original-project-portrait' };
  const support = { ...f.image('support.png'), referencePurpose: 'costume', slot: 'CG13', role: 'costume-only-scoped-support' };
  f.write([identity, support]);
  const lock = loadQualifiedCgIdentityLocks(f.root).get('aura_7');
  assert.deepEqual(lock.identityVisualReferences.map(ref => ref.path), ['identity.png']);
  assert.equal(lock.visualFidelityApproved, false);
  const history = loadCgSourceEvidence(f.root).get('aura_7').references;
  assert.equal(history.length, 2);
  assert.equal(history[1].slot, 'CG13');
  assert.equal(history[1].referencePurpose, 'costume');
});

test('a missing V2 or LFS pointer cannot borrow a costume support image as identity', t => {
  const f = fixture(t), support = { ...f.image('support.png'), referencePurpose: 'costume', role: 'costume-only-scoped-support' };
  const identity = { path: 'identity.png', sha256: hash(bitmap), bytes: bitmap.length, viewed: true, referencePurpose: 'identity' };
  f.write([identity, support]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
  const pointer = Buffer.from(`version https://git-lfs.github.com/spec/v1\noid sha256:${identity.sha256}\nsize ${bitmap.length}\n`);
  writeFileSync(path.join(f.root, identity.path), pointer);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
  f.write([{ ...identity, sha256: hash(pointer), bytes: pointer.length }, support]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false, 'even a pointer whose text hash matches is not an image');
  writeFileSync(path.join(f.root, identity.path), bitmap);
  f.write([identity, support]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).get('aura_7').identityVisualReferences.length, 1);
});

test('HTML, wrong byte count or a mismatched recorded SHA cannot qualify as a viewed image', t => {
  const f = fixture(t), identity = { ...f.image('identity.png'), referencePurpose: 'identity' };
  const html = Buffer.from('<html>Not an image</html>');
  writeFileSync(path.join(f.root, identity.path), html);
  f.write([{ ...identity, sha256: hash(html), bytes: html.length }]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
  writeFileSync(path.join(f.root, identity.path), bitmap);
  f.write([{ ...identity, sha256: '0'.repeat(64) }]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
  f.write([{ ...identity, bytes: bitmap.length + 1 }]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('aura_7'), false);
});

test('an unknown role with a real viewed identity remains eligible rather than being rejected globally', t => {
  const f = fixture(t), identity = { ...f.image('identity.png'), role: 'unclassified-real-project-view', referencePurpose: 'identity' };
  f.write([identity]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).get('aura_7').identityVisualReferences[0].role, identity.role);
  assert.deepEqual(readFileSync(path.join(f.root, identity.path)), bitmap);
});

test('an explicit face or identity reference is not rejected just because its role also discusses costume or equipment', t => {
  const f = fixture(t), identity = { ...f.image('identity.png'), role: 'identity-and-upper-costume-only', referencePurpose: 'identity', usedForIdentity: true };
  const face = { ...f.image('face.png'), role: 'official-original-v1-art-equipment-and-face-support', referencePurpose: 'equipment' };
  f.write([identity, face]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).get('aura_7').identityVisualReferences.length, 2);
});
