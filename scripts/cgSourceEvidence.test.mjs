import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyCgReferenceUseCorrection, discoverCgSourceEvidenceFiles, loadCgSourceEvidence, loadQualifiedCgIdentityLocks,
  loadCgReferenceUseCorrections, REFERENCE_USE_CORRECTIONS_FILE } from './cgSourceEvidence.mjs';
import { HEROES_DB } from '../src/game/heroes.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const fixture = t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'cg-evidence-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (name, value) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), JSON.stringify(value)); };
  const image = name => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6T7AAAAAASUVORK5CYII=', 'base64')); return name; };
  return { root, write, image };
};

test('exact historical reference-use corrections restrict Bishop body images without changing other identities or trusting bad hashes', t => {
  const actual = loadCgSourceEvidence(ROOT).get('bishop');
  const identity = loadQualifiedCgIdentityLocks(ROOT).get('bishop').identityVisualReferences;
  const filmSha = 'e46b5f36ee394d58c5c7ae41a44cb3ee8e35891207c956f82f9d7d5d9ed9e98d';
  const availableFilmAliases = actual.references.filter(ref => ref.sha256 === filmSha
    && existsSync(path.join(ROOT, ref.path)));
  assert.equal(identity.length, availableFilmAliases.length, 'Only available film aliases remain identity inputs');
  assert.ok(identity.some(ref => ref.path === 'docs/cg/references/wave12-2026-11-01/bishop/primary-film-aliens1986.jpeg'));
  assert.ok(identity.every(ref => ref.sha256 === 'e46b5f36ee394d58c5c7ae41a44cb3ee8e35891207c956f82f9d7d5d9ed9e98d'));
  const body = actual.references.filter(ref => ['ad6cc777d241e815eb775219ff2b58ccc3abca35a56132db66582aad0d5e09a2',
    '22ffaf0709467e93276b644476b43553769a8f192625cc5c97ba8d0ab30febaf'].includes(ref.sha256));
  assert.equal(body.length, 4);
  assert.ok(body.every(ref => ref.referencePurpose === 'body-costume-support' && ref.usedForIdentity === false));
  assert.equal(body.filter(ref => ref.referenceUseCorrection).length, 2);
  for (const ref of body.filter(item => item.referenceUseCorrection)) {
    const legacyPresent = existsSync(path.join(ROOT, ref.path));
    assert.equal(ref.referenceUseCorrection.legacyAndCurrentHashesVerified, legacyPresent);
    if (!legacyPresent) {
      assert.equal(ref.referenceUseCorrection.legacyArchiveAvailable, false);
      assert.equal(ref.referenceUseCorrection.legacyHashVerifiedInThisRun, false);
      assert.equal(ref.referenceUseCorrection.currentBitmapHashVerified, true);
    }
  }

  const f = fixture(t), film = f.image('film.png'), old = f.image('old-body.png'), current = f.image('current-body.png');
  const sha256 = createHash('sha256').update(readFileSync(path.join(f.root, old))).digest('hex');
  const authority = 'docs/cg/current-reference-evidence.json';
  f.write(authority, { characterId: 'bishop', references: [{ path: current, sha256,
    referencePurpose: 'body-costume-support', usedForIdentity: false, referenceScope: 'licensed-body-only-not-face' }] });
  const rule = { id: 'restricted-body-use', characterId: 'bishop', legacyPath: old, currentPath: current, sha256,
    fromPurpose: 'identity', toPurpose: 'body-costume-support', usedForIdentity: false, referenceScope: 'licensed-body-only-not-face',
    authorityFile: authority, authoritySha256: createHash('sha256').update(readFileSync(path.join(f.root, authority))).digest('hex') };
  f.write(REFERENCE_USE_CORRECTIONS_FILE, { schemaVersion: 1, corrections: [rule] });
  const receipt = 'docs/cg/historical-source-evidence.json';
  f.write(receipt, { characterId: 'bishop', incarnation: 'Concrete film model', visualLocks: { face: 'Specific film face and dark swept-back hair' },
    references: [{ path: film, sha256, viewed: true, referencePurpose: 'identity' },
      { path: old, sha256, viewed: true, referencePurpose: 'identity', role: 'licensed-sculpt-body' }] });
  f.write('docs/cg/other-source-evidence.json', { characterId: 'other', incarnation: 'Other concrete model',
    visualLocks: { face: 'Different specifically documented model face' },
    references: [{ path: old, sha256, viewed: true, referencePurpose: 'identity' }] });
  const before = readFileSync(path.join(f.root, receipt));
  const fixed = loadCgSourceEvidence(f.root).get('bishop').references.find(ref => ref.path === old);
  assert.equal(fixed.referencePurpose, 'body-costume-support');
  assert.equal(fixed.usedForIdentity, false);
  assert.equal(fixed.referenceUseCorrection.original.referencePurpose, 'identity');
  assert.equal(fixed.referenceUseCorrection.additionalIndependentSource, false);
  assert.deepEqual(applyCgReferenceUseCorrection(f.root, 'bishop', fixed, loadCgReferenceUseCorrections(f.root)), fixed, 'Restriction is idempotent');
  const locks = loadQualifiedCgIdentityLocks(f.root);
  assert.deepEqual(locks.get('bishop').identityVisualReferences.map(ref => ref.path), [film]);
  assert.deepEqual(locks.get('other').identityVisualReferences.map(ref => ref.path), [old], 'Exact owner predicate leaves other characters unchanged');
  assert.equal(loadCgSourceEvidence(f.root).get('other').references[0].referenceUseCorrection, undefined);
  assert.deepEqual(readFileSync(path.join(f.root, receipt)), before, 'Historical receipt bytes are immutable');
  writeFileSync(path.join(f.root, current), Buffer.from('altered bitmap'));
  assert.throws(() => loadCgSourceEvidence(f.root), /current bitmap SHA-256 mismatch/, 'Do not silently qualify through a bad current alias');
});

test('a missing private archive keeps public hashes and body-only authority mandatory, including already restricted references', t => {
  const f = fixture(t), old = f.image('.tmp/archive/body.png');
  const current = f.image('docs/cg/references/body.png'), film = f.image('film.png');
  const oldFile = path.join(f.root, old), currentFile = path.join(f.root, current);
  const bitmap = readFileSync(currentFile), hash = bytes => createHash('sha256').update(bytes).digest('hex');
  const authority = 'docs/cg/current-reference-evidence.json', authorityFile = path.join(f.root, authority);
  const source = { characterId: 'bishop', references: [{ path: current, sha256: hash(bitmap),
    referencePurpose: 'body-costume-support', usedForIdentity: false, referenceScope: 'licensed-body-only-not-face' }] };
  f.write(authority, source);
  const authorityBytes = readFileSync(authorityFile);
  const rule = { id: 'private-body-use', characterId: 'bishop', legacyPath: old, currentPath: current,
    sha256: hash(bitmap), fromPurpose: 'identity', toPurpose: 'body-costume-support', usedForIdentity: false,
    referenceScope: 'licensed-body-only-not-face', authorityFile: authority, authoritySha256: hash(authorityBytes) };
  const reference = { path: old, sha256: rule.sha256, referencePurpose: 'identity', viewed: true };
  const apply = item => applyCgReferenceUseCorrection(f.root, 'bishop', item, [rule]);
  const present = apply(reference);
  assert.equal(present.referenceUseCorrection.legacyAndCurrentHashesVerified, true);
  assert.equal(Object.hasOwn(present.referenceUseCorrection, 'legacyArchiveAvailable'), false);
  unlinkSync(oldFile);
  const absent = apply(reference), metadata = absent.referenceUseCorrection;
  assert.equal(absent.usedForIdentity, false);
  assert.equal(absent.referencePurpose, 'body-costume-support');
  assert.equal(metadata.legacyAndCurrentHashesVerified, false);
  assert.equal(metadata.legacyArchiveAvailable, false);
  assert.equal(metadata.legacyHashVerifiedInThisRun, false);
  assert.equal(metadata.currentBitmapHashVerified, true);
  assert.equal(metadata.authorityHashVerified, true);
  assert.deepEqual(apply(present), absent, 'Previously serialized metadata must not falsely attest the missing archive');
  assert.deepEqual(apply(absent), absent, 'Missing-archive restriction remains idempotent');
  assert.equal(applyCgReferenceUseCorrection(f.root, 'other', reference, [rule]), reference);
  assert.equal(apply({ ...reference, referencePurpose: 'environment-only' }).referenceUseCorrection, undefined);
  assert.throws(() => apply({ ...reference, sha256: '0'.repeat(64) }), /declared legacy SHA-256 mismatch/);

  writeFileSync(currentFile, 'altered public bitmap');
  assert.throws(() => apply(reference), /current bitmap SHA-256 mismatch/);
  assert.throws(() => apply(absent), /current bitmap SHA-256 mismatch/);
  writeFileSync(currentFile, bitmap);
  writeFileSync(authorityFile, 'altered authority');
  assert.throws(() => apply(reference), /frozen authority SHA-256 mismatch/);
  assert.throws(() => apply(absent), /frozen authority SHA-256 mismatch/);
  const wrongAuthority = { ...source, references: [{ ...source.references[0], usedForIdentity: true }] };
  f.write(authority, wrongAuthority);
  const wrongRule = { ...rule, authoritySha256: hash(readFileSync(authorityFile)) };
  assert.throws(() => applyCgReferenceUseCorrection(f.root, 'bishop', reference, [wrongRule]), /body-support authority does not match/);
  writeFileSync(authorityFile, authorityBytes);

  writeFileSync(oldFile, 'altered archive');
  assert.throws(() => apply(reference), /legacy bitmap SHA-256 mismatch/);
  assert.throws(() => apply(absent), /legacy bitmap SHA-256 mismatch/);
  writeFileSync(oldFile, bitmap);
  assert.deepEqual(apply(absent), present, 'Restored archive returns the exact prior workspace metadata');
  unlinkSync(oldFile);
  symlinkSync('missing-target.png', oldFile);
  assert.throws(() => apply(reference), /ENOENT/, 'A broken archive symlink is not an absent private file');
  unlinkSync(oldFile);
  const publicLegacy = 'docs/cg/references/missing-body.png';
  assert.throws(() => applyCgReferenceUseCorrection(f.root, 'bishop', { ...reference, path: publicLegacy },
    [{ ...rule, legacyPath: publicLegacy }]), /legacy bitmap SHA-256 mismatch/, 'Only private archives can be absent');

  f.write(REFERENCE_USE_CORRECTIONS_FILE, { schemaVersion: 1, corrections: [rule] });
  f.write('docs/cg/historical-source-evidence.json', { characterId: 'bishop', incarnation: 'Concrete film model',
    visualLocks: { face: 'Specific film face and dark swept-back hair' },
    references: [{ path: film, sha256: rule.sha256, viewed: true, referencePurpose: 'identity' }, reference] });
  assert.deepEqual(loadQualifiedCgIdentityLocks(f.root).get('bishop').identityVisualReferences.map(ref => ref.path), [film]);
});

test('actual Dante identity excludes Nero/V environment screenshots and weapon-only images', () => {
  const lock = loadQualifiedCgIdentityLocks(ROOT).get('devil_may_cry_dante');
  assert.match(lock.incarnation, /Devil May Cry5.*2019/);
  assert.equal(lock.identityVisualReferences.length, 2);
  assert.ok(lock.identityVisualReferences.every(ref => ref.referencePurpose === 'identity'));
  assert.ok(lock.identityVisualReferences.every(ref => !/steam-screen|weapon-DMC5/.test(ref.path)));
  assert.ok(lock.referenceUrls.every(url => !/\/ss_|Ebony_|Ivory/.test(url)));
  assert.equal(lock.visualFidelityApproved, false);
});

test('actual Modern Sonic and Eternal2020 locks do not regress to historical Classic/2016 proposals', () => {
  const locks = loadQualifiedCgIdentityLocks(ROOT);
  const sonic = locks.get('sonic_hedgehog');
  assert.match(sonic.incarnation, /moderne|modern/i);
  assert.ok(sonic.identityVisualReferences.every(ref => /official-modern-profile/.test(ref.path)));
  assert.ok(sonic.identityVisualReferences.every(ref => ref.slot !== 'CG13'));
  const doom = locks.get('doomslayer');
  assert.match(doom.incarnation, /Eternal.*2020/);
  assert.ok(doom.identityVisualReferences.every(ref => ref.referenceScope === 'doom-eternal-2020-design'));
  assert.ok(doom.equipment.some(line => /Doomblade.*LEFT/.test(line)));
  assert.ok(doom.equipment.some(line => /Flame Belch.*LEFT/.test(line)));
  assert.ok(doom.equipment.some(line => /two parallel barrels/.test(line)));
  for (const lock of [sonic, doom]) {
    assert.equal(lock.evidenceStatus, 'source-inspected-target-not-fidelity-approval');
    assert.equal(lock.visualFidelityApproved, false);
  }
});

test('Elara current V2 portrait keeps the divergent navy atlas outside identity evidence', () => {
  const lock = loadQualifiedCgIdentityLocks(ROOT).get('elara_voss');
  assert.ok(lock, 'The actually viewed current project portrait must qualify');
  assert.match(lock.incarnation, /V2 portrait/);
  assert.equal(lock.identityVisualReferences.length, 1);
  const [reference] = lock.identityVisualReferences;
  assert.match(reference.path, /oc-worlds\/v2\/aether_crown\/heroes\/elara_voss\.png$/);
  assert.equal(reference.role, 'canonical-original-project-portrait');
  assert.equal(reference.sha256, 'b684fd073a009907d21b0d8be36818c8bdeaac35a67596168a16b5198fd4a1b4');
  assert.match(lock.visualAnchor, /burgundy\/wine long corsair coat/i);
  assert.match(lock.visualAnchor, /No navy coat/i);
  assert.ok(lock.identityVisualReferences.every(ref => !/sprites\/generated/.test(ref.path)));
  assert.equal(lock.visualFidelityApproved, false);
});

test('Rayman woodland concept art remains environment-only evidence for CG03', () => {
  const evidence = loadCgSourceEvidence(ROOT).get('rayman_rayman');
  const reference = evidence.references.find(ref => /rayman\/steam-screenshot-01\.jpg$/.test(ref.path));
  assert.ok(reference);
  assert.equal(reference.referencePurpose, 'environment-only');
  assert.equal(reference.slot, 'CG03');
  const lock = loadQualifiedCgIdentityLocks(ROOT).get('rayman_rayman');
  assert.ok(lock.identityVisualReferences.every(ref => !/rayman\/steam-screenshot-01\.jpg$/.test(ref.path)));
});

test('original characters keep their selected V2 portrait without qualifying divergent old atlases', () => {
  const locks = loadQualifiedCgIdentityLocks(ROOT);
  for (const id of ['jax_rook', 'seraphine_meridius', 'mara_veylan', 'celeste_ray', 'nefra_balance',
    'brann_crow', 'lyra_hexwind', 'mercy_ash', 'mara_ell', 'orin_vale',
    'nessa_vire', 'aelwen_starbough', 'ysara_flint', 'aurelia_marcellina', 'seyra_tal',
    'imani_quell', 'bram_quill', 'lio_ferrante', 'anton_rook', 'khepri_sen',
    'doros_bronzehand', 'lin_yue', 'eira_hrafnsdottir', 'killa_mayu', 'aoi_mikazuki',
    'thaleia_naxos', 'mei_zhen', 'yrsa_rune_binder', 'sumaq_khipu', 'rei_kagetsu']) {
    const lock = locks.get(id);
    assert.ok(lock, `${id}: the actually inspected internal portrait must qualify`);
    assert.match(lock.incarnation, /V2/);
    assert.equal(lock.identityVisualReferences.length, 1, `${id}: scoped reuses cannot add an identity source`);
    const [reference] = lock.identityVisualReferences;
    const hero = HEROES_DB.find(hero => hero.id === id);
    const selectedPortrait = hero.production.audiovisual.portrait;
    assert.equal(selectedPortrait, hero.portrait);
    assert.match(selectedPortrait, new RegExp(`/oc-worlds/v2/.+/heroes/${id}\\.png$`));
    const selectedBytes = readFileSync(path.join(ROOT, 'public', selectedPortrait));
    assert.equal(reference.sha256, createHash('sha256').update(selectedBytes).digest('hex'), 'An archived source copy is the same selected bitmap, not an independent identity');
    assert.equal(reference.role, 'canonical-original-project-portrait');
    assert.ok(!reference.url, 'An internal original is not an external franchise reference');
    assert.equal(lock.visualFidelityApproved, false);
  }
});

test('Seyra keeps her crystal identity when CG13 borrows only Aurelia’s internal costume', () => {
  const evidence = loadCgSourceEvidence(ROOT).get('seyra_tal');
  const lock = loadQualifiedCgIdentityLocks(ROOT).get('seyra_tal');
  assert.equal(lock.identityVisualReferences.length, 1);
  assert.match(lock.identityVisualReferences[0].path, /ilyr_concordat\/heroes\/seyra_tal\.png$/);
  const costume = evidence.references.find(ref => ref.referencePurpose === 'costume-only');
  assert.ok(costume);
  assert.equal(costume.slot, 'CG13');
  assert.equal(costume.usedForIdentity, false);
  assert.equal(costume.costumeAuthorityCharacterId, 'aurelia_marcellina');
  assert.equal(costume.sha256, '49ecbbb631fc3b3e12a093f2d744b1bab88aa7369525779bd9b68a5cff328824');
  assert.ok(lock.identityVisualReferences.every(ref => !/aurelia_marcellina/.test(ref.path)));
});

test('scoped costume/equipment/environment documents and references never qualify identity', t => {
  const f = fixture(t), image = f.image('public/sprites/source.png');
  for (const purpose of ['costume-only', 'equipment-only', 'environment-only']) f.write(`docs/cg/nested/${purpose}-source-evidence.json`, {
    characterId: purpose, incarnation: 'Specific incarnation', visualLocks: ['Specific red coat with silver clasp'],
    referencePurpose: purpose, references: [{ path: '/sprites/source.png', viewed: true }]
  });
  f.write('docs/cg/full-reference-receipt.json', {
    heroId: 'target', incarnation: 'Specific incarnation', visualLocks: ['Red coat with silver clasp and dark hair'],
    references: [{ path: image, viewed: true, referencePurpose: 'identity' },
      ...['costume-only', 'equipment-only', 'environment-only'].map(referencePurpose => ({ path: image, viewed: true, referencePurpose, slot: 'CG13' }))]
  });
  assert.equal(discoverCgSourceEvidenceFiles(f.root).length, 4);
  const locks = loadQualifiedCgIdentityLocks(f.root);
  assert.deepEqual([...locks.keys()], ['target']);
  assert.equal(locks.get('target').identityVisualReferences.length, 1);
  const evidence = loadCgSourceEvidence(f.root).get('target');
  assert.equal(evidence.references.filter(ref => ref.slot === 'CG13').length, 3, 'scoped evidence remains available as provenance');
});

test('qualified target is backed by an actually present viewed visual, with no generated-target self-approval', t => {
  const f = fixture(t);f.image('public/sprites/real.png');f.image('public/cg/target.png');
  for (const [id, reference] of Object.entries({ missing: { path: '/sprites/missing.png', viewed: true }, unviewed: { path: '/sprites/real.png' }, self: { path: '/cg/target.png', viewed: true }, absoluteSelf: { path: path.join(f.root, 'public/cg/target.png'), viewed: true }, valid: { path: '/sprites/real.png', visuallyInspected: true } })) {
    f.write(`docs/cg/${id}-source-review.json`, { characterId: id, incarnation: 'Concrete model edition', visualLocks: { face: 'Dark hair and distinct silver face plate' }, canonicalFidelityApproved: true, references: [{ ...reference, canonicalFidelityApproved: true }] });
  }
  const locks = loadQualifiedCgIdentityLocks(f.root);
  assert.deepEqual([...locks.keys()], ['valid']);
  assert.equal(locks.get('valid').visualFidelityApproved, false);
  assert.equal(locks.get('valid').identityVisualReferences[0].canonicalFidelityApproved, false);
});

test('documentary-only incarnation stays available to the Bible without visual qualification', t => {
  const f = fixture(t);
  f.write('docs/cg/documentary-source-evidence.json', { characterId: 'documentary', incarnation: 'Documented television1965 filmed animal', visualLocks: { anatomy: 'Real yellow duckling with two wings and webbed feet' }, sourceRefs: ['https://example.test/primary-text'], references: [] });
  f.write('docs/cg/incarnation-only-source-receipt.json', { heroId: 'incarnation-only', incarnation: 'Documented film1980 costume', references: [] });
  const source = loadCgSourceEvidence(f.root).get('documentary');
  assert.equal(source.incarnation, 'Documented television1965 filmed animal');
  assert.ok(source.visualLocks.anatomy[0].includes('duckling'));
  assert.deepEqual(source.identityVisualReferences, []);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('documentary'), false);
  assert.equal(loadCgSourceEvidence(f.root).get('incarnation-only').incarnation, 'Documented film1980 costume');
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('incarnation-only'), false);
});

test('explicit unused identity images and historical/location artwork stay provenance only', t => {
  const f = fixture(t);
  const paths = ['selected.png', 'old.png', 'observatory.png', 'environment.png', 'historical.png'].map(n => f.image(n));
  f.write('docs/cg/source-review.json', { characterId: 'original', incarnation: 'Selected original project atlas', visualLocks: { body: 'Distinct asymmetrical coat and silver braid' }, references: [
    { path: paths[0], viewed: true, usedForIdentity: true },
    { path: paths[1], viewed: true, usedForIdentity: false },
    { path: paths[2], viewed: true, role: 'location-art' },
    { path: paths[3], viewed: true, role: 'environment-art' },
    { path: paths[4], viewed: true, role: 'historical-atlas-not-selected' }
  ] });
  assert.equal(loadCgSourceEvidence(f.root).get('original').references.length, 5);
  assert.deepEqual(loadQualifiedCgIdentityLocks(f.root).get('original').identityVisualReferences.map(r => r.path), [paths[0]]);
});

test('merge complementary axes and provenance without blending incompatible incarnations or other characters', t => {
  const f = fixture(t), old = f.image('old.png'), modern = f.image('modern.png'), absolute = path.join(f.root, modern);
  f.write('docs/cg/old-source-evidence-2020-01-01.json', { characterId: 'model', incarnation: '2016 closed armor', date: '2020-01-01', visualLocks: { armor: 'Closed black upper arm armor 2016' }, references: [{ path: old, viewed: true }] });
  f.write('docs/cg/current-reference-evidence-2026-10-18.json', { characterId: 'model', incarnation: '2020 exposed arm edition', date: '2026-10-18', incarnationDecision: { status: 'explicit-target-change' }, visualLocks: ['Exposed upper arms in olive 2020 armor'], identityLocks: ['Green visor and silver jaw'], visualLockAxes: { leftForearm: 'One blade on anatomical LEFT forearm', leftShoulder: 'One launcher on anatomical LEFT shoulder' }, limitations: ['Resolution limit'], scopeLimitations: ['Hidden side'], limits: ['No1:1'], references: [{ path: absolute, visuallyInspected: true, referencePurpose: 'identity' }, { path: modern, viewed: true, referenceCharacter: 'other-person' }] });
  f.write('docs/cg/more-source-receipt.json', { heroId: 'model', identityLocks: ['Brown utility belt and olive knee armor'], sourceRefs: ['https://example.test/source'], ageStatus: 'unknown-family-safe-only', references: [] });
  const merged = loadCgSourceEvidence(f.root).get('model'), lock = loadQualifiedCgIdentityLocks(f.root).get('model');
  assert.match(lock.incarnation, /^2020/);
  assert.doesNotMatch(lock.visualAnchor, /Closed black upper arm/);
  assert.equal(lock.identityVisualReferences.length, 1);
  assert.equal(lock.identityVisualReferences[0].path, absolute);
  assert.ok(merged.visualLocks.details.includes('Green visor and silver jaw'));
  assert.ok(merged.visualLocks.details.includes('Brown utility belt and olive knee armor'));
  assert.deepEqual(merged.limitations, ['Resolution limit', 'Hidden side', 'No1:1']);
  assert.equal(lock.ageStatus, 'unknown-family-safe-only');
  assert.equal(lock.equipment.length, 2);
});

const declaredCopyFixture = t => {
  const f = fixture(t), legacy = '.tmp/archive/film.png';
  const copy = f.image('docs/cg/references/fixture/film.png');
  const bitmap = readFileSync(path.join(f.root, copy));
  const sha256 = createHash('sha256').update(bitmap).digest('hex');
  const reference = { path: legacy, sha256, bytes: bitmap.length, viewed: true, usedForIdentity: true,
    role: 'independent-canon-reference', referencePurpose: 'identity', referenceScope: 'film-face-only',
    publicByteExactCopy: { path: copy, sha256, bytes: bitmap.length } };
  const receipt = 'docs/cg/fixture-reference-evidence.json';
  const document = { characterId: 'target', incarnation: 'Selected film2022 masked edition',
    visualLocks: { face: 'Elongated pale bone mask and long dark tendrils' }, references: [reference] };
  const write = (refs = [reference]) => f.write(receipt, { ...document, references: refs });
  write();
  return { ...f, legacy, copy, bitmap, sha256, reference, receipt, document, writeDocument: f.write, write };
};

test('a declared exact public copy restores only available viewed identity and preserves historical bytes, roles and incarnation', t => {
  const f = declaredCopyFixture(t);
  f.write([f.reference,
    { ...f.reference, path: '.tmp/body.png', referencePurpose: 'body-costume-support', usedForIdentity: false },
    { ...f.reference, path: '.tmp/unviewed.png', viewed: false },
    { ...f.reference, path: '.tmp/environment.png', role: 'environment-art', referencePurpose: 'environment-only' },
    { ...f.reference, path: '.tmp/other-edition.png', incarnation: 'Other incompatible film1980' }]);
  const before = readFileSync(path.join(f.root, f.receipt));
  const lock = loadQualifiedCgIdentityLocks(f.root).get('target');
  assert.equal(lock.incarnation, f.document.incarnation);
  assert.equal(lock.identityVisualReferences.length, 1);
  const [ref] = lock.identityVisualReferences;
  assert.equal(ref.path, f.copy);
  assert.equal(ref.role, f.reference.role);
  assert.equal(ref.referenceScope, 'film-face-only');
  assert.equal(ref.viewed, true);
  assert.equal(ref.usedForIdentity, true);
  assert.deepEqual(ref.resolvedAlias, { originalPath: f.legacy, path: f.copy, sha256: f.sha256,
    bytes: f.bitmap.length, originalAvailable: false, originalHashVerifiedInThisRun: false,
    publicCopyHashVerified: true, additionalIndependentSource: false });
  assert.equal(ref.canonicalFidelityApproved, false);
  const body = loadCgSourceEvidence(f.root).get('target').references.find(r => r.referencePurpose === 'body-costume-support');
  assert.equal(body.path, f.copy);
  assert.equal(body.usedForIdentity, false);
  assert.deepEqual(readFileSync(path.join(f.root, f.receipt)), before);
});

test('an existing original stays authoritative and a corrupt original never falls back to a valid copy', t => {
  const f = declaredCopyFixture(t), original = path.join(f.root, f.legacy), alias = path.join(f.root, f.copy);
  mkdirSync(path.dirname(original), { recursive: true });writeFileSync(original, f.bitmap);
  writeFileSync(alias, 'unused corrupt alias');
  const ref = loadQualifiedCgIdentityLocks(f.root).get('target').identityVisualReferences[0];
  assert.equal(ref.path, f.legacy);
  assert.equal(ref.resolvedAlias, undefined, 'No replacement metadata while original is available');
  writeFileSync(alias, f.bitmap);writeFileSync(original, 'corrupt original');
  assert.throws(() => loadCgSourceEvidence(f.root), /original SHA-256 mismatch/);
  unlinkSync(original);writeFileSync(alias, 'corrupt public copy');
  assert.throws(() => loadCgSourceEvidence(f.root), /public alias SHA-256 mismatch/);
});

test('declared aliases reject noncanonical paths, mismatched hashes and wrong byte counts', t => {
  const f = declaredCopyFixture(t);
  for (const badPath of ['/tmp/source.png', '../film.png', 'docs/cg/references/../film.png',
    'docs/cg/references//film.png', 'docs/cg/references/fixture\\film.png', 'public/images/film.png']) {
    f.write([{ ...f.reference, publicByteExactCopy: { ...f.reference.publicByteExactCopy, path: badPath } }]);
    assert.throws(() => loadCgSourceEvidence(f.root), /invalid canonical alias/, badPath);
  }
  for (const bad of [
    { ...f.reference, sha256: '0'.repeat(64) },
    { ...f.reference, publicByteExactCopy: { ...f.reference.publicByteExactCopy, sha256: '0'.repeat(64) } },
    { ...f.reference, bytes: f.bitmap.length + 1 },
    { ...f.reference, publicByteExactCopy: { ...f.reference.publicByteExactCopy, bytes: f.bitmap.length + 1 } },
    { ...f.reference, publicByteExactCopy: { ...f.reference.publicByteExactCopy, bytes: -1 } }
  ]) {
    f.write([bad]);assert.throws(() => loadCgSourceEvidence(f.root), /declared SHA-256|byte count/);
  }
});

test('missing copy is unqualified and no undeclared public image is inferred', t => {
  const f = declaredCopyFixture(t), alias = path.join(f.root, f.copy);
  unlinkSync(alias);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('target'), false);
  assert.equal(loadCgSourceEvidence(f.root).get('target').references[0].path, f.legacy);
  writeFileSync(alias, f.bitmap);
  const { publicByteExactCopy, ...undeclared } = f.reference;
  assert.ok(publicByteExactCopy);
  f.write([undeclared]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('target'), false);
});

test('broken links and symlinked alias or original ancestors cannot masquerade as absence', t => {
  const f = declaredCopyFixture(t), original = path.join(f.root, f.legacy), alias = path.join(f.root, f.copy);
  mkdirSync(path.dirname(original), { recursive: true });
  for (const refPath of [f.legacy, original]) {
    symlinkSync('missing-target.png', original);f.write([{ ...f.reference, path: refPath }]);
    assert.throws(() => loadCgSourceEvidence(f.root), /symlinks/);unlinkSync(original);
  }
  f.write();unlinkSync(alias);symlinkSync('missing-target.png', alias);
  assert.throws(() => loadCgSourceEvidence(f.root), /symlinks/);unlinkSync(alias);
  const linked = path.join(f.root, 'docs/cg/references/linked');
  symlinkSync(path.dirname(original), linked, 'dir');
  f.write([{ ...f.reference, publicByteExactCopy: { ...f.reference.publicByteExactCopy,
    path: 'docs/cg/references/linked/film.png' } }]);
  assert.throws(() => loadCgSourceEvidence(f.root), /symlinks/);
  f.write();rmSync(path.dirname(original), { recursive: true });writeFileSync(path.dirname(original), 'not a directory');
  assert.throws(() => loadCgSourceEvidence(f.root), /directory ancestors/);
});

test('reused bitmap identity is deduplicated per selected cohort and purpose without changing ordinary historical aliases', t => {
  const f = declaredCopyFixture(t);
  f.write([f.reference,
    { ...f.reference, path: f.copy, url: 'https://example.test/same-photo' },
    { ...f.reference, path: '.tmp/other-copy.png', url: 'https://example.test/another-alias' },
    { ...f.reference, path: '.tmp/detail.png', referencePurpose: 'identity-detail' }]);
  const refs = loadQualifiedCgIdentityLocks(f.root).get('target').identityVisualReferences;
  assert.equal(refs.length, 2);
  assert.equal(refs.filter(r => r.referencePurpose === 'identity').length, 1);
  assert.ok(refs.every(r => r.resolvedAlias?.additionalIndependentSource === false));
  const plain = f.image('second-film.png');
  f.write([{ path: f.copy, sha256: f.sha256, viewed: true }, { path: plain, sha256: f.sha256, viewed: true }]);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).get('target').identityVisualReferences.length, 2,
    'No broad hash deduplication of historical references without declared fallback');
});

test('restrictive correction runs on the legacy key before public-copy resolution', t => {
  const f = declaredCopyFixture(t), authority = 'docs/cg/body-source-evidence.json';
  f.writeDocument(authority, { characterId: 'target', references: [{ path: f.copy, sha256: f.sha256,
    referencePurpose: 'body-costume-support', usedForIdentity: false, referenceScope: 'licensed-body-only-not-face' }] });
  f.writeDocument(REFERENCE_USE_CORRECTIONS_FILE, { schemaVersion: 1, corrections: [{ id: 'body-restriction',
    characterId: 'target', legacyPath: f.legacy, currentPath: f.copy, sha256: f.sha256,
    fromPurpose: 'identity', toPurpose: 'body-costume-support', usedForIdentity: false,
    referenceScope: 'licensed-body-only-not-face', authorityFile: authority,
    authoritySha256: createHash('sha256').update(readFileSync(path.join(f.root, authority))).digest('hex') }] });
  const evidence = loadCgSourceEvidence(f.root).get('target');
  const ref = evidence.documents.find(doc => doc.file === f.receipt).references[0];
  assert.equal(ref.path, f.copy);assert.equal(ref.usedForIdentity, false);
  assert.equal(ref.referenceUseCorrection.original.referencePurpose, 'identity');
  assert.equal(ref.referenceUseCorrection.legacyAndCurrentHashesVerified, false);
  assert.equal(ref.resolvedAlias.additionalIndependentSource, false);
  assert.equal(loadQualifiedCgIdentityLocks(f.root).has('target'), false);
  writeFileSync(path.join(f.root, f.copy), 'tampered corrected body');
  assert.throws(() => loadCgSourceEvidence(f.root), /current bitmap SHA-256 mismatch/);
});

test('a public copy cannot launder generated targets into independent source identity', t => {
  const f = declaredCopyFixture(t);
  for (const source of ['.tmp/generated_images/native.png', '/cg/generated.png', path.join(f.root, 'public/cg/generated.png')]) {
    f.write([{ ...f.reference, path: source }]);
    const evidence = loadCgSourceEvidence(f.root).get('target');
    assert.equal(evidence.references[0].path, f.copy);
    assert.equal(evidence.references[0].resolvedAlias.originalPath, source);
    assert.equal(evidence.identityVisualReferences.length, 0);
    assert.equal(loadQualifiedCgIdentityLocks(f.root).has('target'), false);
  }
});
