import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
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
  assert.equal(identity.length, 2, 'Only the historical/current aliases of the film face remain identity inputs');
  assert.ok(identity.every(ref => ref.sha256 === 'e46b5f36ee394d58c5c7ae41a44cb3ee8e35891207c956f82f9d7d5d9ed9e98d'));
  const body = actual.references.filter(ref => ['ad6cc777d241e815eb775219ff2b58ccc3abca35a56132db66582aad0d5e09a2',
    '22ffaf0709467e93276b644476b43553769a8f192625cc5c97ba8d0ab30febaf'].includes(ref.sha256));
  assert.equal(body.length, 4);
  assert.ok(body.every(ref => ref.referencePurpose === 'body-costume-support' && ref.usedForIdentity === false));
  assert.equal(body.filter(ref => ref.referenceUseCorrection).length, 2);

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
