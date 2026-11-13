import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { register } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { hasCgIdentityPurpose } from './cgSourceEvidence.mjs';
import { CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH, CG_REVIEWED_AVAILABILITY_AMENDMENT_SHA256,
  deriveCgAvailabilityIdentity, inspectCgHistoricalImageAvailability, projectCgReviewedAvailabilityAmendment } from './cgReviewedAvailabilityAmendment.mjs';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const { serializeCgRosterProductionPlan } = await import('./buildCgRosterProductionPlan.mjs');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => readFileSync(path.join(ROOT, file));
const published = JSON.parse(read('docs/cg/roster-production-2026-10-18.json'));
const contract = JSON.parse(read(CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH));
const bitmap = await sharp({ create: { width: 2, height: 3, channels: 4, background: { r: 25, g: 40, b: 80, alpha: 0.5 } } }).png().toBuffer();
const temporary = t => {
  const root = mkdtempSync(path.join(tmpdir(), 'cg-reviewed-availability-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
};
const write = (root, file, bytes) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), bytes); };
const tinyPin = { path: 'public/images/test/identity.png', sha256: digest(bitmap), bytes: bitmap.length, width: 2, height: 3, format: 'PNG' };
const validate = projected => projectCgReviewedAvailabilityAmendment({ root: ROOT, published, projected, heroes: HEROES_DB, catalog: CG_CATALOG });
const currentAvailability = () => {
  const subjects = published.subjects.slice(), entries = published.entries.slice();
  for (const item of contract.cases) {
    const historical = published.subjects[item.subjectIndex];
    const available = historical.identity.identityVisualReferences.filter(reference => {
      if (!hasCgIdentityPurpose(reference)) return false;
      const pin = item.identityImages.find(image => image.referencePath === reference.path && image.sha256 === reference.sha256);
      assert.ok(pin);
      return inspectCgHistoricalImageAvailability(ROOT, pin).available;
    });
    const subject = { ...historical, identity: deriveCgAvailabilityIdentity({ historicalIdentity: historical.identity,
      fallbackIdentity: item.fallbackIdentity, availableIdentityReferences: available }) };
    for (const cell of item.unproducedCells) {
      const old = published.entries[cell.entryIndex];
      const fields = available.length ? Object.fromEntries(contract.entryFields.map(key => [key, old[key]])) : cell.fallback;
      entries[cell.entryIndex] = { ...old, ...fields };
      subject.matrix = { ...subject.matrix, CG01: { ...subject.matrix.CG01, themeSource: fields.themeSource } };
    }
    subjects[item.subjectIndex] = subject;
  }
  return { ...published, subjects, entries };
};

test('the amendment closes 58 owners and exact image receipts without changing any historical pin', () => {
  assert.equal(digest(read(CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH)), CG_REVIEWED_AVAILABILITY_AMENDMENT_SHA256);
  assert.equal(digest(read('docs/cg/roster-production-2026-10-18.json')), 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e');
  assert.equal(contract.cases.length, 58);
  assert.equal(new Set(contract.cases.map(item => item.characterId)).size, 58);
  assert.equal(contract.cases.flatMap(item => item.identityImages).length, 58);
  assert.equal(contract.cases.flatMap(item => item.unproducedCells).length, 5);
  assert.deepEqual(contract.cases.filter(item => item.transition === 'restrict-costume-only-identity-use').map(item => item.characterId), ['aura_7']);
  for (const item of contract.cases) {
    assert.equal(item.fallbackIdentity.evidenceStatus, 'needs-reference');
    assert.equal(item.fallbackIdentity.visualFidelityApproved, false);
    assert.equal(Object.hasOwn(item.fallbackIdentity, 'identityVisualReferences'), false);
  }
});

test('a physically absent image can later be hydrated with its exact real pixels and become available', t => {
  const root = temporary(t);
  assert.deepEqual(inspectCgHistoricalImageAvailability(root, tinyPin), { available: false, reason: 'absent' });
  write(root, tinyPin.path, bitmap);
  assert.deepEqual(inspectCgHistoricalImageAvailability(root, tinyPin), { available: true, reason: 'attested' });
  for (const pin of [{ ...tinyPin, sha256: '0'.repeat(64) }, { ...tinyPin, bytes: bitmap.length + 1 },
    { ...tinyPin, width: 3 }, { ...tinyPin, height: 2 }]) {
    assert.equal(inspectCgHistoricalImageAvailability(root, pin).available, false);
  }
  assert.deepEqual(readFileSync(path.join(root, tinyPin.path)), bitmap);
});

test('LFS pointers, HTML and truncated PNGs cannot become positive evidence even with their own matching text SHA', t => {
  const root = temporary(t);
  for (const bytes of [Buffer.from(`version https://git-lfs.github.com/spec/v1\noid sha256:${tinyPin.sha256}\nsize ${tinyPin.bytes}\n`),
    Buffer.from('<html><body>Download failure</body></html>'), bitmap.subarray(0, 8), bitmap.subarray(0, 40)]) {
    write(root, tinyPin.path, bytes);
    assert.equal(inspectCgHistoricalImageAvailability(root, { ...tinyPin, sha256: digest(bytes), bytes: bytes.length }).available, false);
  }
  write(root, tinyPin.path, bitmap);
  assert.equal(inspectCgHistoricalImageAvailability(root, tinyPin).available, true, 'negative results must not permanently freeze a missing source');
});

test('path traversal, symlinks and invalid ancestor types are errors rather than absence', t => {
  const root = temporary(t);
  assert.throws(() => inspectCgHistoricalImageAvailability(root, { ...tinyPin, path: 'public/images/../private.png' }), /Unsafe historical image path/);
  mkdirSync(path.join(root, 'public/images/test'), { recursive: true });
  symlinkSync(path.join(root, 'not-present.png'), path.join(root, tinyPin.path));
  assert.throws(() => inspectCgHistoricalImageAvailability(root, tinyPin), /symlink/);
  rmSync(path.join(root, 'public/images/test'), { recursive: true });
  writeFileSync(path.join(root, 'public/images/test'), 'not a directory');
  assert.throws(() => inspectCgHistoricalImageAvailability(root, tinyPin), /regular directory ancestors/);
});

test('AURA identity remains separate from valid Sonic CG13 costume support before and after body hydration', t => {
  const root = temporary(t);
  write(root, tinyPin.path, bitmap);
  assert.equal(inspectCgHistoricalImageAvailability(root, tinyPin).available, true);
  const item = contract.cases.find(item => item.characterId === 'aura_7');
  const historical = published.subjects[item.subjectIndex].identity;
  const support = historical.identityVisualReferences.find(reference => !hasCgIdentityPurpose(reference));
  const body = historical.identityVisualReferences.find(hasCgIdentityPurpose);
  assert.ok(support && body);
  assert.equal(support.referencePurpose, 'costume');
  assert.deepEqual(deriveCgAvailabilityIdentity({ historicalIdentity: historical, fallbackIdentity: item.fallbackIdentity,
    availableIdentityReferences: [] }), item.fallbackIdentity);
  assert.throws(() => deriveCgAvailabilityIdentity({ historicalIdentity: historical, fallbackIdentity: item.fallbackIdentity,
    availableIdentityReferences: [support] }), /Costume support/);
  const hydrated = deriveCgAvailabilityIdentity({ historicalIdentity: historical, fallbackIdentity: item.fallbackIdentity,
    availableIdentityReferences: [body] });
  assert.deepEqual(hydrated.identityVisualReferences, [body]);
  assert.equal(hydrated.visualFidelityApproved, false);
  assert.equal(Object.hasOwn(hydrated, 'fullSource1to1Verified'), false);
});

test('the closed availability projection preserves all complete historical bytes and does not mutate its inputs', () => {
  const current = currentAvailability(), before = digest(JSON.stringify(current));
  const result = validate(current);
  assert.equal(result.evidence.subjectsVerified, 58);
  assert.equal(result.evidence.unavailableSubjects.length + result.evidence.attestedHistoricalSubjects.length, 58);
  assert.deepEqual(result.evidence.restrictiveIdentityUseSubjects, ['aura_7']);
  assert.equal(result.evidence.deliveredImageChanges, 0);
  assert.equal(result.evidence.visualFidelityApproved, false);
  assert.equal(result.evidence.futureExactHydrationAllowed, true);
  assert.equal(digest(JSON.stringify(current)), before);
  assert.equal(digest(JSON.stringify(result.projected)), digest(JSON.stringify(published)));
  assert.equal(digest(serializeCgRosterProductionPlan(result.projected)), 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e');
});

test('extra identity claims, changed public inputs, generated CG01s and changed receipts are refused', t => {
  const current = currentAvailability(), item = contract.cases.find(item => item.characterId === 'elise_varenne');
  const mutateSubject = edit => {
    const subjects = current.subjects.slice(); subjects[item.subjectIndex] = structuredClone(subjects[item.subjectIndex]);
    edit(subjects[item.subjectIndex]); return { ...current, subjects };
  };
  assert.throws(() => validate(mutateSubject(subject => { subject.identity.visualFidelityApproved = true; })), /exact attested historical target or unqualified fallback/);
  assert.throws(() => validate(mutateSubject(subject => { subject.identity.extraAuthority = true; })), /exact attested historical target or unqualified fallback/);
  assert.throws(() => validate(mutateSubject(subject => { subject.characterId = 'other-owner'; })), /owner or order/);
  const heroes = HEROES_DB.map(hero => hero.id === item.characterId ? { ...hero, incarnation: 'Unreviewed replacement' } : hero);
  assert.throws(() => projectCgReviewedAvailabilityAmendment({ root: ROOT, published, projected: current, heroes, catalog: CG_CATALOG }), /fallback inputs changed/);
  const entries = current.entries.slice(), cell = item.unproducedCells[0];
  entries[cell.entryIndex] = { ...entries[cell.entryIndex], generatedImageCount: 1 };
  assert.throws(() => validate({ ...current, entries }), /cannot project delivered artwork/);
  const root = temporary(t), first = contract.cases[0];
  for (const file of [CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH, 'docs/cg/roster-production-2026-10-18.json',
    'docs/rift-dossiers/catalog.json', 'docs/audits/fidelity-p0-wave4-2026-10-01.json', first.sourceReceipts[0].path]) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); copyFileSync(path.join(ROOT, file), path.join(root, file));
  }
  writeFileSync(path.join(root, first.sourceReceipts[0].path), '\n', { flag: 'a' });
  assert.throws(() => projectCgReviewedAvailabilityAmendment({ root, published, projected: current, heroes: HEROES_DB, catalog: CG_CATALOG }), /source receipt changed/);
  const changed = { ...contract, arbitraryPatch: true };
  write(root, CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH, JSON.stringify(changed));
  assert.throws(() => projectCgReviewedAvailabilityAmendment({ root, published, projected: current, heroes: HEROES_DB, catalog: CG_CATALOG }), /Closed CG availability amendment changed/);
});

test('unrelated edits remain visible for the caller full historical guard instead of being erased', () => {
  const current = currentAvailability();
  const changed = { ...current, summary: { ...current.summary, generated: current.summary.generated + 1 } };
  const result = validate(changed);
  assert.equal(result.projected.summary.generated, changed.summary.generated);
  assert.notEqual(digest(JSON.stringify(result.projected)), digest(JSON.stringify(published)));
  const index = current.entries.findIndex(entry => entry.generatedImageCount === 1), entries = current.entries.slice();
  entries[index] = { ...entries[index], promptBrief: 'Unreviewed replacement' };
  const delivered = validate({ ...current, entries });
  assert.equal(delivered.projected.entries[index].promptBrief, 'Unreviewed replacement');
  assert.notEqual(digest(JSON.stringify(delivered.projected)), digest(JSON.stringify(published)));
});
