import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const { buildCgRosterProductionMetadataPlan, serializeCgRosterProductionPlan, buildCgRosterProductionReport } = await import('./buildCgRosterProductionPlan.mjs');
const { validateCgRosterProductionSnapshot } = await import('./cgRosterPlanSnapshot.mjs');
const { projectCgContinuation02MetadataAmendment, CG_CONTINUATION02_METADATA_AMENDMENT_PATH } = await import('./cgContinuation02MetadataAmendment.mjs');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const publishedText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8');
const published = JSON.parse(publishedText);
const fixtureText = readFileSync(path.join(ROOT, CG_CONTINUATION02_METADATA_AMENDMENT_PATH), 'utf8');
const fixture = JSON.parse(fixtureText);
const clone = value => structuredClone(value);
const hash = value => createHash('sha256').update(value).digest('hex');
const project = (projected, heroes = HEROES_DB, root = ROOT) => projectCgContinuation02MetadataAmendment({ root, published, projected, heroes, catalog: CG_CATALOG });
const validate = rebuilt => validateCgRosterProductionSnapshot({ root: ROOT, rebuilt, heroes: HEROES_DB, catalog: CG_CATALOG,
  serialize: serializeCgRosterProductionPlan, buildReport: buildCgRosterProductionReport });
let actualPromise;
const actual = () => actualPromise ||= buildCgRosterProductionMetadataPlan().then(result => result.plan);

// Build only the closed case values on the historical document for cheap guard
// tests. The first test separately runs the real producer and every old guard.
function scopedPlan() {
  const plan = { ...published, subjects: published.subjects.slice(), entries: published.entries.slice(), backgrounds: published.backgrounds.slice() };
  for (const actor of fixture.actors) {
    const index = plan.subjects.findIndex(subject => subject.characterId === actor.characterId);
    const subject = clone(plan.subjects[index]);
    for (const field of fixture.identityFields) {
      if (Object.hasOwn(actor.subject.identity.current, field)) subject.identity[field] = clone(actor.subject.identity.current[field]);
      else delete subject.identity[field];
    }
    subject.matrix.CG01.themeSource = clone(actor.subject.cg01ThemeSource.current); plan.subjects[index] = subject;
    for (const family of ['entries', 'backgrounds']) for (const pin of actor[family]) {
      const at = plan[family].findIndex(item => item.id === pin.id);
      plan[family][at] = { ...plan[family][at], ...clone(pin.current) };
    }
  }
  const at = plan.subjects.findIndex(subject => subject.characterId === 'batman_tdk');
  const subject = clone(plan.subjects[at]), gate = fixture.quarantine.record;
  const warning = `Sprite runtime en quarantaine (${gate.reason}); les anciens bitmaps restent OLD, sans sélection runtime ni qualification de source.`;
  subject.identity.localCandidates = subject.identity.localCandidates.map(candidate => ({ ...candidate, archivalOnly: true,
    selectedInRuntime: false, runtimeEligible: false, status: 'OLD-quarantined-project-art-not-current-or-canon-reference', quarantineReason: gate.reason }));
  subject.identity.runtimeSpriteQuarantine = { characterId: 'batman_tdk', ...gate };
  subject.identity.missing.push(warning); plan.subjects[at] = subject;
  const entryIndex = plan.entries.findIndex(entry => entry.characterId === 'batman_tdk' && entry.type === 'characterSolo');
  plan.entries[entryIndex] = { ...plan.entries[entryIndex], missing: subject.identity.missing };
  return plan;
}
const mutate = (plan, family, predicate, change) => {
  const records = plan[family].slice(), at = records.findIndex(predicate); assert.ok(at >= 0);
  records[at] = clone(records[at]); change(records[at]); return { ...plan, [family]: records };
};

test('the real current producer passes every historical guard after the closed continuation02 amendment', async () => {
  const current = await actual(), proof = validate(current);
  assert.equal(proof.deliveredEntriesPreserved, 1436);
  assert.equal(proof.publishedPlanSha256, 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e');
  const amendment = proof.continuation02CurrentMetadataAmendment;
  assert.equal(amendment.actorCount, 31); assert.equal(amendment.quarantinedActor, 'batman_tdk');
  assert.equal(amendment.quarantineObjectsVerified, 3);
  assert.equal(amendment.changesDeliveredImages, false); assert.equal(amendment.visualFidelityApproved, false);
  assert.equal(amendment.fullSource1to1Verified, false);
});

test('the scoped projection is immutable and restores the entire historical serialization exactly', () => {
  const plan = scopedPlan(), before = hash(JSON.stringify(plan)), result = project(plan);
  assert.equal(hash(JSON.stringify(plan)), before);
  assert.equal(serializeCgRosterProductionPlan(result.projected), publishedText);
  assert.equal(result.evidence.actorCount, 31);
  assert.equal(result.evidence.frozenSourceFiles, 17);
});

test('a changed current target value cannot enter through an otherwise allowed field', async t => {
  const plan = scopedPlan(), actorId = fixture.actors[0].characterId;
  for (const field of fixture.identityFields) await t.test(field, () => {
    const changed = mutate(plan, 'subjects', row => row.characterId === actorId, row => {
      row.identity[field] = Array.isArray(row.identity[field]) ? [...row.identity[field], 'Unreviewed addition'] : 'Unreviewed replacement';
    });
    assert.throws(() => project(changed), /Continuation02 current identity changed/);
  });
});

test('states, assets, approvals, rewards and unknown fields remain forbidden inside the cohort', async t => {
  const plan = scopedPlan(), actorId = fixture.actors[0].characterId;
  for (const [name, edit] of Object.entries({
    status: entry => { entry.status = 'generated'; }, asset: entry => { entry.currentAssets = { source: { path: '/cg/unreviewed.png' } }; },
    generation: entry => { entry.generatedImageCount += 1; }, review: entry => { entry.fidelityReview = 'approved-1-to-1'; },
    reward: entry => { entry.reward = 999999; }, unknown: entry => { entry.unreviewedAuthority = true; }
  })) await t.test(name, () => assert.throws(() => project(mutate(plan, 'entries', entry => entry.characterId === actorId, edit)), /outside current-target fields/));
  await t.test('identity approval', () => assert.throws(() => project(mutate(plan, 'subjects', row => row.characterId === actorId,
    row => { row.identity.visualFidelityApproved = true; })), /cannot approve identity/));
});

test('Batman cannot regain the wrong bitmap, rewrite CG01 or change either delivered CG', async t => {
  const plan = scopedPlan();
  for (const [name, family, edit] of [
    ['selected sprite', 'subjects', row => { row.identity.localCandidates[0].selectedInRuntime = true; }],
    ['quarantine hash', 'subjects', row => { row.identity.runtimeSpriteQuarantine.sha256 = '0'.repeat(64); }],
    ['identity approval', 'subjects', row => { row.identity.visualFidelityApproved = true; }],
    ['invented backdrop', 'backgrounds', row => { row.sourceSetting = 'Unreviewed Gotham reconstruction'; }],
    ['backdrop delivery', 'backgrounds', row => { row.currentImageUsesThisBackground = true; }],
    ['CG01 delivery', 'entries', row => { row.generatedImageCount = 1; }],
    ['missing warning', 'entries', row => { row.missing = []; }]
  ]) await t.test(name, () => assert.throws(() => project(mutate(plan, family, row => row.characterId === 'batman_tdk'
    && (family === 'subjects' || row.type === 'characterSolo'), edit))));
  const changed = mutate(plan, 'entries', row => row.characterId === 'batman_tdk' && row.type === 'weaponSolo', row => { row.generatedImageCount = 2; });
  const projected = project(changed).projected;
  assert.equal(projected.entries.find(row => row.characterId === 'batman_tdk' && row.type === 'weaponSolo').generatedImageCount, 2,
    'unrelated deliveries must survive the projection and fail the complete historical guard');
  assert.notEqual(hash(serializeCgRosterProductionPlan(projected)), hash(publishedText));
});

test('mutations outside all 32 cases survive and are rejected by the real full historical validator', async () => {
  const changed = mutate(await actual(), 'subjects', row => row.characterId === 'player_anchor', row => { row.unreviewedAuthority = true; });
  assert.throws(() => validate(changed), /Plan changed outside pinned current-reference metadata amendments/);
  const scoped = mutate(scopedPlan(), 'subjects', row => row.characterId === 'player_anchor', row => { row.unreviewedAuthority = true; });
  assert.equal(project(scoped).projected.subjects.find(row => row.characterId === 'player_anchor').unreviewedAuthority, true);
});

test('all 32 runtime source records reject undeclared changes', async t => {
  const plan = scopedPlan();
  for (const pin of [...fixture.actors, fixture.quarantine]) await t.test(pin.characterId, () => {
    const heroes = HEROES_DB.map(hero => hero.id === pin.characterId ? { ...hero, unreviewedSourceField: true } : hero);
    assert.throws(() => project(plan, heroes), /runtime declaration changed/);
  });
});

test('the closed fixture and each of 17 frozen source files reject tampering without editing canonical files', async t => {
  const plan = scopedPlan(), temporary = mkdtempSync(path.join(tmpdir(), 'cg-continuation02-test-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const fixtureFile = path.join(temporary, CG_CONTINUATION02_METADATA_AMENDMENT_PATH);
  mkdirSync(path.dirname(fixtureFile), { recursive: true });
  writeFileSync(fixtureFile, JSON.stringify({ ...fixture, arbitraryOverride: true }));
  assert.throws(() => project(plan, HEROES_DB, temporary), /Closed continuation02 CG amendment changed/);
  writeFileSync(fixtureFile, fixtureText);
  for (const pin of fixture.sourceFiles) {
    const target = path.join(temporary, pin.path); mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(ROOT, pin.path), target);
  }
  for (const pin of fixture.sourceFiles) await t.test(pin.path, () => {
    const target = path.join(temporary, pin.path), bytes = readFileSync(target);
    writeFileSync(target, Buffer.concat([bytes, Buffer.from('\n')]));
    assert.throws(() => project(plan, HEROES_DB, temporary), /source byte count changed/);
    writeFileSync(target, bytes);
  });
});
