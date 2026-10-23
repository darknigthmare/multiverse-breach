import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';
import { CG_GALLERY_CATALOG, CG_ROSTER_CATALOG } from '../src/game/cg/cgRosterCatalog.js';
import { filterCgCatalogByRegulation } from '../src/game/cg/cgSchema.js';
import { resolveCgVersions } from '../src/game/cg/cgRevisions.js';
import { buildCgRosterProductionPlan, buildCgRosterProductionReport, rosterDefinitionsForHero, serializeCgRosterProductionPlan } from './buildCgRosterProductionPlan.mjs';
import { loadQualifiedCgIdentityLocks } from './cgSourceEvidence.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const plan = JSON.parse(readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8'));

test('an empty-delivery receipt retains Mistral real refusals when later slots are not retried', () => {
  const matrix = plan.subjects.find(subject => subject.characterId === 'mistral_mgr').matrix;
  assert.match(matrix.CG04.generationStatus, /^blocked/);
  assert.equal(matrix.CG04.generationEvidenceFile, 'docs/cg/mistral-wave5-2026-10-22.json');
  for (const slot of ['CG09', 'CG10']) {
    assert.match(matrix[slot].generationStatus, /^blocked/, `${slot}: a later non-attempt is not a successful retry`);
    assert.equal(matrix[slot].generationEvidenceFile, 'docs/cg/mistral-complete-2026-10-18.json');
    assert.ok(matrix[slot].themeSource.includes('docs/cg/mistral-wave5-2026-10-22.json'));
  }
  for (const slot of ['CG05', 'CG06', 'CG07', 'CG08', 'CG11', 'CG12', 'CG13', 'CG14', 'CG15']) {
    assert.match(matrix[slot].generationStatus, /^not-attempted/);
    assert.notEqual(matrix[slot].status, 'not-applicable');
  }
});

test('the plan covers exactly every playable hero and the separate Anchor', () => {
  assert.equal(plan.summary.heroesDbCount, HEROES_DB.length);
  assert.deepEqual(new Set(plan.subjects.map(subject => subject.characterId)), new Set(['player_anchor', ...HEROES_DB.map(hero => hero.id)]));
  assert.equal(plan.subjects.length, HEROES_DB.length + 1);
  assert.equal(plan.summary.universes, new Set(HEROES_DB.map(hero => hero.universe)).size);
  assert.equal(plan.summary.reusedPublishedCg, 83);
  assert.equal(plan.summary.additionalCharacterSoloTargets, HEROES_DB.length + 1 - 6);
  for (const subject of plan.subjects) {
    assert.equal(plan.entries.filter(entry => entry.characterId === subject.characterId && entry.type === 'characterSolo').length, 1, `${subject.characterId}: exactly one foundation`);
  }
});

test('the exact 25 source-remediation P0 identities precede the rest of the roster', () => {
  const p0 = JSON.parse(readFileSync(path.join(ROOT, 'docs/audits/fidelity-p0-wave4-2026-10-01.json'), 'utf8')).entries;
  assert.equal(plan.summary.p0Subjects, 25);
  assert.deepEqual(new Set(plan.subjects.filter(subject => subject.priority === 'P0').map(subject => subject.characterId)), new Set(p0.map(entry => entry.id)));
  for (const entry of plan.entries) {
    if (entry.priority === 'P0') assert.ok(entry.productionOrder < 25);
    else assert.ok(entry.productionOrder >= 25);
  }
});

test('inspected incarnation targets replace old proposals without approving the generated images', () => {
  const locks = loadQualifiedCgIdentityLocks(ROOT);
  for (const id of ['doomslayer', 'sonic_hedgehog', 'devil_may_cry_dante', 'horizon_zero_dawn_aloy', 'chris_redfield']) {
    const qualified = locks.get(id);
    assert.ok(qualified, `${id}: inspected identity source`);
    const identity = plan.subjects.find(subject => subject.characterId === id).identity;
    assert.equal(identity.incarnation, qualified.incarnation);
    assert.equal(identity.identityLock, qualified.visualAnchor);
    assert.deepEqual(identity.equipment, qualified.equipment);
    assert.deepEqual(identity.identityVisualReferences, qualified.identityVisualReferences);
    assert.equal(identity.evidenceStatus, 'source-inspected-target-not-fidelity-approval');
    assert.equal(identity.visualFidelityApproved, false);
  }
});

test('all production entries have explicit distinct physical background proposals', () => {
  assert.equal(plan.backgrounds.length, plan.entries.length);
  assert.equal(new Set(plan.backgrounds.map(background => background.id)).size, plan.entries.length);
  assert.equal(new Set(plan.backgrounds.map(background => background.description)).size, plan.entries.length);
  for (const entry of plan.entries) {
    const background = plan.backgrounds.find(background => background.id === entry.backgroundId);
    assert.equal(background.characterId, entry.characterId);
    assert.equal(background.type, entry.type);
    assert.ok(background.sourceSetting);
    assert.ok(background.characterContext);
    for (const field of ['location', 'foreground', 'midground', 'background', 'lighting']) assert.ok(background.originalScene[field]?.length > 15, `${entry.id}: ${field}`);
    assert.equal(background.sceneIsOriginal, true);
    if (background.status === 'delivered-and-visually-reviewed') {
      assert.equal(background.currentImageUsesThisBackground, true);
      assert.ok(background.reviewEvidence);
      assert.equal(entry.status, 'generated');
    } else assert.equal(background.currentImageUsesThisBackground, false, 'A proposed background must never masquerade as a verified existing scene.');
  }
  const authored = JSON.parse(readFileSync(path.join(ROOT, 'docs/cg/roster-background-briefs.json'), 'utf8')).p0;
  assert.equal(Object.keys(authored).length, 25);
  assert.equal(new Set(Object.values(authored).map(scene => scene.location)).size, 25);
});

test('the 15-slot matrix retains alternatives, distinct poses, themes and outstanding production work', () => {
  assert.equal(plan.slots.length, 15);
  assert.deepEqual(plan.slots.find(slot => slot.slot === 'CG13').types, ['genderSwap', 'iconicOutfitSwap']);
  assert.deepEqual(plan.slots.find(slot => slot.slot === 'CG15').types, ['firstStep', 'futureExperienced']);
  for (const subject of plan.subjects) {
    assert.equal(Object.keys(subject.matrix).length, 15);
    for (const [slot, cell] of Object.entries(subject.matrix)) {
      if (cell.entryId) {
        const entry = plan.entries.find(entry => entry.id === cell.entryId);
        assert.equal(entry.characterId, subject.characterId);
        assert.ok(plan.slots.find(definition => definition.slot === slot).types.includes(entry.type));
      } else assert.ok(['not-applicable-in-published-pilot', 'not-applicable-source-reviewed', 'needs-theme/reference'].includes(cell.status));
      if (cell.status === 'not-applicable-source-reviewed') {
        assert.ok(cell.reason.length > 20);
        assert.ok(cell.sourceRefs.length);
      }
      if (!cell.status.startsWith('not-applicable')) {
        assert.ok(cell.poseBrief?.length > 20);
        assert.ok(cell.themeBrief?.length >= 20);
        assert.ok(cell.themeSource?.length);
        assert.ok(cell.backgroundId);
        if (!cell.entryId) {
          assert.equal(cell.themeStatus, cell.authoredBriefFile ? 'documented-character-brief-not-generated' : 'documented-template-character-theme-unresolved');
          assert.equal(cell.generatedImageCount, 0);
          assert.ok(plan.extensionTemplates.some(template => template.id === cell.backgroundTemplateId));
          assert.ok(plan.backgrounds.some(background => background.id === cell.environmentSourceId && background.characterId === subject.characterId));
        }
      }
    }
    const plannedCells = Object.values(subject.matrix).filter(cell => !cell.status.startsWith('not-applicable'));
    assert.equal(new Set(plannedCells.map(cell => cell.poseBrief)).size, plannedCells.length, `${subject.characterId}: each CG needs its own pose`);
    assert.equal(new Set(plannedCells.map(cell => cell.backgroundId)).size, plannedCells.length, `${subject.characterId}: each CG needs its own background`);
  }
  assert.equal(plan.summary.matrixCells, plan.subjects.length * 15);
  assert.equal(plan.summary.matrixNotApplicablePilot, 7);
  assert.equal(plan.summary.matrixNotApplicableTotal, plan.summary.matrixNotApplicablePilot + plan.summary.matrixNotApplicableSourceReviewed);
  const allPlannedCells = plan.subjects.flatMap(subject => Object.values(subject.matrix)).filter(cell => !cell.status.startsWith('not-applicable'));
  assert.equal(new Set(allPlannedCells.map(cell => cell.backgroundId)).size, allPlannedCells.length, 'Every applicable roster slot needs its own background ID.');
  assert.equal(plan.summary.totalRequestedSlotsNotProduced, allPlannedCells.filter(cell => cell.status !== 'generated').length);
});

test('complete roster series retain every delivered slot and reject conflicting alternatives', () => {
  const hero = { id: 'source_hero', universe: 'Source World' };
  const delivered = [
    { id: 'base', type: 'characterSolo' },
    { id: 'intro', type: 'introPose' },
    { id: 'outfit', type: 'iconicOutfitSwap' },
    { id: 'future', type: 'futureExperienced' }
  ];
  assert.deepEqual(rosterDefinitionsForHero(hero, [], delivered).map(entry => entry.id), ['base', 'intro', 'outfit', 'future']);
  assert.throws(() => rosterDefinitionsForHero(hero, [], [...delivered, { id: 'gender', type: 'genderSwap' }]), /more than one CG selected for CG13/);
  assert.throws(() => rosterDefinitionsForHero(hero, [], [...delivered, { id: 'first', type: 'firstStep' }]), /more than one CG selected for CG15/);
  assert.equal(plan.summary.additionalSeriesCgGenerated, CG_ROSTER_CATALOG.filter(entry => entry.type !== 'characterSolo').length);
});

test('generated means three real delivered files, while planned images never enter the gallery', () => {
  const published = new Set(CG_CATALOG.map(entry => entry.id));
  const extra = new Set(CG_ROSTER_CATALOG.map(entry => entry.id));
  assert.equal(CG_CATALOG.length, 83);
  assert.equal(CG_GALLERY_CATALOG.length, 83 + extra.size);
  for (const definition of CG_ROSTER_CATALOG) {
    const entry = plan.entries.find(entry => entry.id === definition.id);
    const current = resolveCgVersions(definition, { unlockedHeroes: [definition.characterId] })[0];
    assert.equal(current.imagePath, entry.currentAssets.master.path);
    assert.equal(current.thumbnailPath, entry.currentAssets.thumbnail.path);
    assert.equal(current.sourcePath, entry.currentAssets.source.path);
  }
  for (const entry of plan.entries) {
    if (entry.status === 'generated') {
      assert.ok(published.has(entry.id) || extra.has(entry.id));
      assert.equal(entry.generatedImageCount, 1);
      assert.equal(Object.keys(entry.currentAssets).length, 3);
      for (const asset of Object.values(entry.currentAssets)) assert.ok(existsSync(path.join(ROOT, 'public', asset.path.replace(/^\//, ''))));
    } else {
      assert.equal(entry.status, 'needs-reference');
      assert.equal(entry.currentAssets, null);
      assert.equal(entry.generatedImageCount, 0);
      assert.ok(entry.plannedAssets && entry.missing.length);
      assert.ok(!CG_GALLERY_CATALOG.some(cg => cg.id === entry.id));
    }
  }
});

test('Doom uses the imposed Canon, Nexus, Fan Art and What If slot families', () => {
  const doom = CG_ROSTER_CATALOG.filter(entry => entry.characterId === 'doomslayer');
  assert.equal(doom.length, 15);
  for (const entry of doom) {
    const slot = Number(plan.slots.find(definition => definition.types.includes(entry.type)).slot.slice(2));
    const expected = slot === 5 ? ['Nexus', 'nexus-variant'] : slot >= 12 ? ['What If', 'what-if'] : slot >= 9 ? ['Fan Art', 'fan-art'] : ['Canon', 'canon-inspired'];
    assert.deepEqual([entry.family, entry.canonStatus], expected, `${entry.type}: imposed theme family`);
  }
});

test('the production plan follows current revisions, including corrected roster art and themes', () => {
  const revisions = JSON.parse(readFileSync(path.join(ROOT, 'src/game/cg/cgRevisions.generated.json'), 'utf8')).revisions;
  const latest = new Map(revisions.map(revision => [revision.cgId, revision]));
  for (const id of [
    'cg:tekken:true-ogre-tekken:characterSolo:openai-v1',
    'cg:tekken:true-ogre-tekken:iconicOutfitSwap:openai-v1',
    'cg:les-aventures-de-saturnin:saturnin-duck:iconicOutfitSwap:openai-v1'
  ]) assert.ok(latest.has(id), `Missing corrected roster regression fixture: ${id}`);

  for (const [id, revision] of latest) {
    const definition = CG_GALLERY_CATALOG.find(entry => entry.id === id);
    const current = resolveCgVersions(definition, { unlockedHeroes: [definition.characterId] })[0];
    const entry = plan.entries.find(entry => entry.id === id);
    assert.equal(entry.currentRevisionId, current.revisionId, id);
    assert.equal(entry.currentAssets.master.path, current.imagePath, `${id}: current master`);
    assert.equal(entry.currentAssets.thumbnail.path, current.thumbnailPath, `${id}: current thumbnail`);
    assert.equal(entry.currentAssets.source.path, current.sourcePath, `${id}: current source`);
    assert.notEqual(entry.currentAssets.master.path, definition.imagePath, `${id}: the catalog original remains a variant`);
    if (revision.assets) assert.deepEqual(Object.values(entry.currentAssets).map(asset => asset.sha256), Object.values(revision.assets).map(asset => asset.sha256));
    assert.equal(entry.poseBrief, revision.poseBrief || revision.poseDescription, `${id}: revised pose`);
    const theme = revision.themeBrief || revision.promptSummary;
    assert.equal(entry.themeBrief, typeof theme === 'string' ? theme : theme.fr || theme.en, `${id}: revised theme`);
    assert.equal(entry.sourceEvidence, 'src/game/cg/cgRevisions.generated.json');
    const background = plan.backgrounds.find(background => background.id === entry.backgroundId);
    assert.equal(background.id, revision.backgroundId);
    if (revision.background) {
      assert.deepEqual(background.originalScene, revision.background, `${id}: revised background`);
      assert.equal(background.currentImageUsesThisBackground, true);
    } else {
      assert.equal(background.currentImageUsesThisBackground, false, `${id}: an old proposal cannot be certified for revised media`);
      assert.equal(background.status, 'proposed-needs-source-and-visual-review');
    }
  }
});

test('unproduced Batman, Mistral and Vader slots retain their written briefs without claiming delivery', () => {
  for (const [characterId, filename] of [
    ['batman_tdk', 'docs/cg/batman-tdk-complete-2026-10-18.json'],
    ['mistral_mgr', 'docs/cg/mistral-complete-plan-2026-10-18.json'],
    ['vader', 'docs/cg/vader-complete-plan-2026-10-18.json']
  ]) {
    const source = JSON.parse(readFileSync(path.join(ROOT, filename), 'utf8'));
    const subject = plan.subjects.find(subject => subject.characterId === characterId);
    for (const brief of source.slots || source.productionPlan) {
      const slot = typeof brief.slot === 'number' ? `CG${String(brief.slot).padStart(2, '0')}` : brief.slot;
      const cell = subject.matrix[slot];
      if (cell.status === 'generated') continue;
      assert.equal(cell.poseBrief, brief.poseBrief, `${characterId}/${slot}: written pose`);
      assert.equal(cell.backgroundBrief, brief.backgroundBrief || brief.backgroundDescription, `${characterId}/${slot}: written background`);
      assert.ok(cell.themeBrief.endsWith(typeof brief.themeBrief === 'string' ? brief.themeBrief : brief.title.fr));
      assert.equal(cell.themeStatus, 'documented-character-brief-not-generated');
      assert.ok(cell.themeSource.includes(filename));
      assert.ok(!['generated', 'ready', 'delivered'].includes(cell.status));
      const entry = plan.entries.find(entry => entry.id === cell.entryId);
      if (entry) {
        assert.equal(entry.currentAssets, null);
        assert.equal(entry.generatedImageCount, 0);
        assert.equal(entry.galleryRegistered, false);
        assert.equal(entry.backgroundVerifiedInCurrentImage, false);
      }
    }
  }
  const batman = plan.subjects.find(subject => subject.characterId === 'batman_tdk');
  assert.equal(batman.matrix.CG01.generationStatus, 'tool-blocked');
  assert.equal(batman.matrix.CG07.generationStatus, 'not-attempted-after-character-tool-blocks');
  const vader = plan.subjects.find(subject => subject.characterId === 'vader');
  assert.equal(vader.matrix.CG04.generationStatus, 'blocked-output-moderation');
  assert.equal(vader.matrix.CG05.generationStatus, 'not-attempted-after-provider-blocks');
});

test('new wave plans preserve actual refusals and non-attempts without manufacturing images or N/A', () => {
  const slotOf = value => {
    const raw = value && typeof value === 'object' ? value.slot : value;
    return typeof raw === 'number' ? `CG${String(raw).padStart(2, '0')}` : raw;
  };
  let checked = 0;
  for (const [id, name] of [['stitch_626', 'stitch'], ['raven_tt', 'raven'], ['starfire_tt', 'starfire'], ['jack_sparrow_potc', 'jack-sparrow']]) {
    const file = `docs/cg/${name}-wave3-2026-10-20.json`;
    const receipt = JSON.parse(readFileSync(path.join(ROOT, file), 'utf8'));
    const subject = plan.subjects.find(subject => subject.characterId === id);
    const blocked = new Set([...(receipt.blockages || []), ...(receipt.blockedSlots || [])].map(slotOf));
    const unattempted = new Set((receipt.unattemptedSlots || []).map(slotOf));
    for (const slot of new Set([...blocked, ...unattempted])) {
      const cell = subject.matrix[slot];
      if (cell.status === 'generated') continue; // A later real delivery supersedes an old failed attempt.
      checked++;
      assert.ok(cell.authoredBriefFile.includes('wave3-plan-2026-10-20'), `${id}/${slot}: authored wave3 brief`);
      assert.equal(cell.generationEvidenceFile, file);
      assert.ok(cell.themeSource.includes(cell.authoredBriefFile));
      assert.equal(cell.generatedImageCount, 0);
      assert.ok(!cell.status.startsWith('not-applicable'));
      if (blocked.has(slot)) assert.match(cell.generationStatus, /blocked|refused/, `${id}/${slot}: actual service refusal`);
      else assert.match(cell.generationStatus, /not-attempted|unattempted/, `${id}/${slot}: no invented request`);
    }
  }
  assert.ok(checked > 0, 'The partial wave contains documented unresolved slots.');
});

test('reserve regulation hides every new roster CG by the universe name used in game settings', () => {
  assert.ok(CG_ROSTER_CATALOG.length > 0);
  for (const definition of CG_ROSTER_CATALOG) {
    const universeName = typeof definition.universeName === 'string' ? definition.universeName : definition.universeName.fr;
    assert.deepEqual(filterCgCatalogByRegulation([definition], { hiddenUniverses: [universeName] }), []);
    assert.deepEqual(filterCgCatalogByRegulation([definition], { hiddenUniverses: [definition.universeKey] }), []);
    assert.deepEqual(filterCgCatalogByRegulation([definition], { disabledHeroes: [definition.characterId] }), []);
    assert.equal(filterCgCatalogByRegulation([definition], {}).length, 1);
  }
});

test('production plan and concise report reproduce from the current inputs', async () => {
  const rebuilt = await buildCgRosterProductionPlan();
  assert.equal(serializeCgRosterProductionPlan(rebuilt), readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8'));
  assert.equal(buildCgRosterProductionReport(rebuilt), readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.md'), 'utf8'));
});
