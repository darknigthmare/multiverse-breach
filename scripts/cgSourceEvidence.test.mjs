import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverCgSourceEvidenceFiles, loadCgSourceEvidence, loadQualifiedCgIdentityLocks } from './cgSourceEvidence.mjs';
import { HEROES_DB } from '../src/game/heroes.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const fixture = t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'cg-evidence-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (name, value) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), JSON.stringify(value)); };
  const image = name => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6T7AAAAAASUVORK5CYII=', 'base64')); return name; };
  return { root, write, image };
};

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
    'brann_crow', 'lyra_hexwind', 'mercy_ash', 'mara_ell', 'orin_vale']) {
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
