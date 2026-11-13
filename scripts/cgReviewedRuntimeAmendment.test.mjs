import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'node:module';
import test from 'node:test';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const { buildCgRosterProductionMetadataPlan, serializeCgRosterProductionPlan, buildCgRosterProductionReport } = await import('./buildCgRosterProductionPlan.mjs');
const { validateCgRosterProductionSnapshot } = await import('./cgRosterPlanSnapshot.mjs');
const { CG_REVIEWED_RUNTIME_AMENDMENT_PATH, projectCgReviewedRuntimeAmendment } = await import('./cgReviewedRuntimeAmendment.mjs');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const publishedText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8');
const published = JSON.parse(publishedText);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let planPromise;
const current = () => planPromise ||= buildCgRosterProductionMetadataPlan().then(result => result.plan);
const validate = rebuilt => validateCgRosterProductionSnapshot({ root: ROOT, rebuilt, heroes: HEROES_DB, catalog: CG_CATALOG,
  serialize: serializeCgRosterProductionPlan, buildReport: buildCgRosterProductionReport });
const mutate = (plan, family, id, edit) => {
  const array = plan[family].slice(), index = array.findIndex(item => item.characterId === id);
  assert.ok(index >= 0); array[index] = structuredClone(array[index]); edit(array[index]);
  return { ...plan, [family]: array };
};

test('the real metadata producer passes the unchanged historical guards with the bounded Revan and closed source/availability amendments', async () => {
  const plan = await current(), result = validate(plan);
  assert.equal(result.mode, 'github-2333-source-metadata-amendment');
  assert.equal(result.reviewedRuntimeCorrection.objectsVerified, 3);
  assert.equal(result.reviewedRuntimeCorrection.historicalPlanPreserved, true);
  assert.equal(result.reviewedRuntimeCorrection.visualFidelityApproved, false);
  assert.equal(result.reviewedRuntimeCorrection.fullSource1to1Verified, false);
  assert.equal(result.deliveredEntriesPreserved, 1436);
  const subject = plan.subjects.find(item => item.characterId === 'darth_revan');
  assert.equal(subject.identity.runtimeSpriteCorrection.selectedInRuntime, true);
  assert.equal(subject.identity.runtimeSpriteCorrection.visualFidelityApproved, false);
  assert.ok(plan.backgrounds.find(item => item.characterId === 'darth_revan').sourceSetting.startsWith('Forge Stellaire'));
});

test('the amendment rejects approval, altered bytes, extra fields and a different Revan edition', async t => {
  const plan = await current();
  const edits = {
    approval: subject => { subject.identity.visualFidelityApproved = true; },
    correctionApproval: subject => { subject.identity.runtimeSpriteCorrection.visualFidelityApproved = true; },
    sourceApproval: subject => { subject.identity.runtimeSpriteCorrection.fullSource1to1Verified = true; },
    correctionHash: subject => { subject.identity.runtimeSpriteCorrection.sha256 = '0'.repeat(64); },
    oldBitmapSelected: subject => { subject.identity.localCandidates[0].selectedInRuntime = true; },
    extraField: subject => { subject.unreviewedAuthority = true; },
    otherEdition: subject => { subject.identity.incarnation = 'Star Wars: The Old Republic'; }
  };
  for (const [name, edit] of Object.entries(edits)) await t.test(name, () => {
    assert.throws(() => validate(mutate(plan, 'subjects', 'darth_revan', edit)), /exact reviewed Revan subject fields/);
  });
});

test('the pending CG01 cannot become a delivery or acquire an unreviewed prompt', async t => {
  const plan = await current();
  for (const [name, edit] of Object.entries({
    delivered: entry => { entry.generatedImageCount = 1; },
    registered: entry => { entry.galleryRegistered = true; },
    prompt: entry => { entry.promptBrief += ' Unreviewed addition.'; },
    assets: entry => { entry.currentAssets = { source: { path: '/cg/unreviewed.png' } }; },
    extraField: entry => { entry.unreviewedAuthority = true; }
  })) await t.test(name, () => assert.throws(() => validate(mutate(plan, 'entries', 'darth_revan', edit))));
});

test('the source-place proposal rejects Yavin, invented visual details and image approval', async t => {
  const plan = await current();
  for (const [name, edit] of Object.entries({
    wrongPlace: background => { background.sourceSetting = 'Death Star trench at Yavin'; },
    inventedVisuals: background => { background.sourceContext.architecture = 'Unreviewed gold towers'; },
    approvedImage: background => { background.currentImageUsesThisBackground = true; },
    extraField: background => { background.unreviewedAuthority = true; }
  })) await t.test(name, () => assert.throws(() => validate(mutate(plan, 'backgrounds', 'darth_revan', edit)), /pending KOTOR I background/));
});

test('unrelated identities, delivered entries and totals remain subject to the full historical validator', async () => {
  const plan = await current();
  const unrelated = mutate(plan, 'subjects', 'marcus', subject => { subject.identity.visualFidelityApproved = true; });
  const projection = projectCgReviewedRuntimeAmendment({ root: ROOT, publishedText, published, rebuilt: unrelated, heroes: HEROES_DB });
  assert.equal(projection.projected.subjects.find(item => item.characterId === 'marcus').identity.visualFidelityApproved, true,
    'the bounded projection must not erase an unrelated mutation');
  assert.throws(() => validate(unrelated), /cannot approve CG fidelity/);
  const deliveredIndex = plan.entries.findIndex(entry => entry.generatedImageCount === 1);
  const entries = plan.entries.slice(); entries[deliveredIndex] = { ...entries[deliveredIndex], generatedImageCount: 2 };
  assert.throws(() => validate({ ...plan, entries }));
  assert.throws(() => validate({ ...plan, summary: { ...plan.summary, generated: plan.summary.generated + 1 } }));
});

test('the closed amendment refuses extra metadata and a changed prior amendment, without touching canonical files', async () => {
  const plan = await current(), temporary = mkdtempSync(path.join(tmpdir(), 'cg-reviewed-runtime-test-'));
  try {
    const fixtureFile = path.join(temporary, CG_REVIEWED_RUNTIME_AMENDMENT_PATH);
    mkdirSync(path.dirname(fixtureFile), { recursive: true });
    const source = JSON.parse(readFileSync(path.join(ROOT, CG_REVIEWED_RUNTIME_AMENDMENT_PATH), 'utf8'));
    writeFileSync(fixtureFile, JSON.stringify({ ...source, arbitraryPatch: true }));
    assert.throws(() => projectCgReviewedRuntimeAmendment({ root: temporary, publishedText, published, rebuilt: plan, heroes: HEROES_DB }), /closed factual contract/);
    writeFileSync(fixtureFile, JSON.stringify(source));
    const previous = 'scripts/fixtures/cg-source-metadata-amendment-2026-11-13.json';
    copyFileSync(path.join(ROOT, previous), path.join(temporary, previous));
    writeFileSync(path.join(temporary, previous), '\n', { flag: 'a' });
    assert.throws(() => projectCgReviewedRuntimeAmendment({ root: temporary, publishedText, published, rebuilt: plan, heroes: HEROES_DB }), /Prior source amendment/);
  } finally { rmSync(temporary, { recursive: true }); }
});

test('the original published plan and its three prior amendment pins stay byte-exact', () => {
  for (const [file, sha256] of [
    ['docs/cg/roster-production-2026-10-18.json', 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e'],
    ['scripts/fixtures/cg-source-metadata-amendment-2026-11-13.json', 'eba38c68b819869fc4cc31fd8b430c8562c9cc763fdc1c76a2ed632e30fbb0b4'],
    ['scripts/fixtures/cg-local-candidates-amendment-2026-11-09.json', '8777754e2c113b71661902e21529ec217440f9c15ac5f34467397441a34bd2a3'],
    ['scripts/fixtures/cg-current-descriptors-amendment-2026-11-09.json', '71891cbf57f7f6a580993301db9ee4ba9efc7ca0dd1e7b3d875e9975f31a2ce0']
  ]) assert.equal(hash(readFileSync(path.join(ROOT, file))), sha256, file);
});
