import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { CG_SOURCE64_ACTOR_IDS, CG_SOURCE64_AMENDMENT_PATH, CG_SOURCE64_AMENDMENT_SHA256,
  CG_SOURCE64_HISTORICAL_PLAN_SHA256, projectCgSource64Amendment } from './cgSource64Amendment.mjs';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const root = fileURLToPath(new URL('../', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
const hash = value => digest(JSON.stringify(value));
const amendment = JSON.parse(readFileSync(path.join(root, CG_SOURCE64_AMENDMENT_PATH)));
const historicalBytes = readFileSync(path.join(root, 'docs/cg/roster-production-2026-10-18.json'));
const published = JSON.parse(historicalBytes);
const families = ['subjects', 'entries', 'backgrounds'];
const fields = (record, values, keys) => {
  const result = { ...record };
  for (const key of keys) {
    if (Object.hasOwn(values, key)) result[key] = structuredClone(values[key]);
    else delete result[key];
  }
  return result;
};
// A compact, pinned unit fixture reconstructs only the current source64 fields.
// The producer/complete historical validation is exercised by the owning CG
// suite; this suite never regenerates or modifies the 36MB canonical plan.
function currentFixture() {
  const plan = { ...published, ...Object.fromEntries(families.map(family => [family, published[family].slice()])) };
  for (const pin of amendment.entries) {
    const index = plan.subjects.findIndex(subject => subject.characterId === pin.characterId);
    const old = plan.subjects[index];
    const identity = fields(old.identity, pin.subject.identity.current, amendment.identityFields);
    if (pin.subject.currentRuntimeSource?.current.present) identity.currentRuntimeSource = structuredClone(pin.subject.currentRuntimeSource.current.value);
    plan.subjects[index] = { ...old, identity, matrix: { ...old.matrix,
      CG01: { ...old.matrix.CG01, themeSource: structuredClone(pin.subject.cg01ThemeSource.current) } } };
    for (const family of ['entries', 'backgrounds']) for (const record of pin[family]) {
      const position = plan[family].findIndex(item => item.id === record.id);
      plan[family][position] = fields(plan[family][position], record.current,
        family === 'entries' ? amendment.entryFields : ['characterContext']);
    }
  }
  return plan;
}
const project = (projected, extra = {}) => projectCgSource64Amendment({ root, published, projected,
  heroes: HEROES_DB, catalog: CG_CATALOG, ...extra });
const mutate = (plan, family, id, change) => {
  const result = { ...plan, [family]: plan[family].slice() };
  const index = result[family].findIndex(item => family === 'subjects' ? item.characterId === id : item.id === id);
  assert.ok(index >= 0);
  result[family][index] = structuredClone(result[family][index]);
  change(result[family][index]);
  return result;
};

test('source64 closes only its exact metadata fixture and preserves all historical records', () => {
  assert.equal(digest(historicalBytes), CG_SOURCE64_HISTORICAL_PLAN_SHA256);
  assert.equal(digest(readFileSync(path.join(root, CG_SOURCE64_AMENDMENT_PATH))), CG_SOURCE64_AMENDMENT_SHA256);
  assert.equal(CG_SOURCE64_ACTOR_IDS.length, 64);
  assert.equal(new Set(CG_SOURCE64_ACTOR_IDS).size, 64);
  const current = currentFixture(), originalHash = hash(current), publishedHash = hash(published);
  const result = project(current);
  assert.deepEqual(result.projected, published);
  assert.equal(hash(result.projected), amendment.historicalObjectSha256);
  assert.equal(hash(current), originalHash, 'Projection must not mutate its current input');
  assert.equal(hash(published), publishedHash, 'Projection must not mutate the historical input');
  assert.equal(result.evidence.actorCount, 64);
  assert.equal(result.evidence.entryCount, 88);
  assert.equal(result.evidence.backgroundCount, 88);
  assert.equal(result.evidence.sourceHeroPins, 64);
  assert.equal(result.evidence.runtimeProvenanceCount, 2);
  assert.equal(result.evidence.identityAuthority, false);
  assert.equal(result.evidence.changesGenerationHistory, false);
  assert.equal(result.evidence.fullSource1to1Verified, false);
});

test('source64 rejects changed values inside every allowed identity/entry/background field', () => {
  const current = currentFixture(), pin = amendment.entries[0];
  for (const key of amendment.identityFields) assert.throws(() => project(mutate(current, 'subjects', pin.characterId,
    subject => { subject.identity[key] = 'Altered unreviewed source'; })), /Source64 current identity changed/);
  assert.throws(() => project(mutate(current, 'subjects', pin.characterId,
    subject => { subject.matrix.CG01.themeSource = ['unreviewed']; })), /Source64 current CG01 source changed/);
  for (const key of amendment.entryFields) assert.throws(() => project(mutate(current, 'entries', pin.entries[0].id,
    entry => { entry[key] = 'Altered source'; })), /Source64 current entries metadata changed/);
  assert.throws(() => project(mutate(current, 'backgrounds', pin.backgrounds[0].id,
    background => { background.characterContext = 'Foreign incarnation'; })), /Source64 current backgrounds metadata changed/);
});

test('source64 refuses generation/status/assets/rewards/approval changes for its own actors', () => {
  const current = currentFixture(), pin = amendment.entries[0];
  for (const edit of [
    subject => { subject.identity.visualFidelityApproved = true; },
    subject => { subject.identity.unreviewedAuthority = true; },
    subject => { subject.matrix.CG02.generatedImageCount = 1; }
  ]) assert.throws(() => project(mutate(current, 'subjects', pin.characterId, edit)));
  for (const edit of [
    entry => { entry.status = 'generated'; },
    entry => { entry.generatedImageCount += 1; },
    entry => { entry.currentAssets = { source: { path: '/cg/unreviewed.png' } }; },
    entry => { entry.galleryRegistered = true; },
    entry => { entry.reward = { amount: 999 }; }
  ]) assert.throws(() => project(mutate(current, 'entries', pin.entries[0].id, edit)), /outside the closed metadata fields/);
  assert.throws(() => project(mutate(current, 'backgrounds', pin.backgrounds[0].id,
    background => { background.currentImageUsesThisBackground = true; })), /outside the closed metadata fields/);
});

test('runtime provenance is exact and nonauthoritative for only the two historical Halo pilots', () => {
  const current = currentFixture();
  for (const id of ['masterchief', 'arbiter']) {
    const identity = current.subjects.find(subject => subject.characterId === id).identity;
    const source = identity.currentRuntimeSource;
    const pilot = CG_CATALOG.find(entry => entry.characterId === id && entry.type === 'characterSolo');
    assert.deepEqual(identity.sourceRefs, [...new Set((pilot.sourceRefs || []).filter(Boolean))],
      'Historical CG references must remain those of the CG pilot');
    assert.equal(source.authority, false);
    assert.equal(source.visualFidelityApproved, false);
    for (const edit of [
      subject => { subject.identity.currentRuntimeSource.authority = true; },
      subject => { subject.identity.currentRuntimeSource.visualFidelityApproved = true; },
      subject => { subject.identity.currentRuntimeSource.incarnation += ' other edition'; },
      subject => { subject.identity.currentRuntimeSource.equipment.push('Unreviewed equipment'); },
      subject => { subject.identity.currentRuntimeSource.extra = true; },
      subject => { delete subject.identity.currentRuntimeSource; }
    ]) assert.throws(() => project(mutate(current, 'subjects', id, edit)), /current pilot provenance changed/);
    assert.throws(() => project(mutate(current, 'subjects', id,
      subject => { subject.identity.sourceRefs.push(...source.referenceUrls); })), /current identity changed/);
  }
  assert.throws(() => project(mutate(current, 'subjects', amendment.entries[0].characterId,
    subject => { subject.identity.currentRuntimeSource = { authority: false }; })), /forbidden outside two pilots/);
});

test('all sixty-four runtime declaration pins and both pilot catalog sources reject altered clones', () => {
  const current = currentFixture();
  for (const id of CG_SOURCE64_ACTOR_IDS) {
    const heroes = HEROES_DB.map(hero => hero.id === id ? { ...hero, incarnation: 'Altered edition' } : hero);
    assert.throws(() => project(current, { heroes }), /runtime declaration changed/);
  }
  for (const id of ['masterchief', 'arbiter']) {
    const catalog = CG_CATALOG.map(entry => entry.characterId === id && entry.type === 'characterSolo'
      ? { ...entry, continuityId: 'Foreign continuity' } : entry);
    assert.throws(() => project(current, { catalog }), /CG pilot source changed/);
  }
});

test('unknown outside changes survive the bounded projection and fail the complete historical comparison', () => {
  const current = currentFixture();
  const outsider = published.subjects.find(subject => !CG_SOURCE64_ACTOR_IDS.includes(subject.characterId));
  const changed = mutate(current, 'subjects', outsider.characterId,
    subject => { subject.identity.unreviewedAuthority = true; });
  const result = project(changed).projected;
  assert.equal(result.subjects.find(subject => subject.characterId === outsider.characterId).identity.unreviewedAuthority, true);
  assert.throws(() => assert.deepEqual(result, published));
  const totals = project({ ...current, summary: { ...current.summary, generated: current.summary.generated + 1 } }).projected;
  assert.equal(totals.summary.generated, current.summary.generated + 1);
  assert.throws(() => assert.deepEqual(totals, published));
});

test('known parent key order is restored without accepting unknown values', () => {
  const current = currentFixture(), id = amendment.entries[0].characterId;
  const reordered = mutate(current, 'subjects', id, subject => {
    subject.identity = Object.fromEntries(Object.entries(subject.identity).reverse());
    subject.matrix.CG01 = Object.fromEntries(Object.entries(subject.matrix.CG01).reverse());
  });
  assert.equal(JSON.stringify(project(reordered).projected), JSON.stringify(published));
});

test('closed fixture and frozen b9e source bytes reject tampering without changing canonical files', () => {
  const current = currentFixture(), temporary = mkdtempSync(path.join(tmpdir(), 'cg-source64-test-'));
  const write = (relative, bytes) => { const file = path.join(temporary, relative); mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, bytes); };
  try {
    write(CG_SOURCE64_AMENDMENT_PATH, JSON.stringify({ ...amendment, arbitraryJsonPatch: [{ path: 'summary.generated', value: 999 }] }));
    assert.throws(() => project(current, { root: temporary }), /amendment changed/);
    write(CG_SOURCE64_AMENDMENT_PATH, readFileSync(path.join(root, CG_SOURCE64_AMENDMENT_PATH)));
    for (const pin of amendment.sourceFiles) {
      const destination = path.join(temporary, pin.path); mkdirSync(path.dirname(destination), { recursive: true });
      copyFileSync(path.join(root, pin.path), destination);
    }
    write(amendment.sourceFiles[0].path, Buffer.concat([readFileSync(path.join(root, amendment.sourceFiles[0].path)), Buffer.from('\n')]));
    assert.throws(() => project(current, { root: temporary }), /source byte count changed/);
  } finally { rmSync(temporary, { recursive: true }); }
});
