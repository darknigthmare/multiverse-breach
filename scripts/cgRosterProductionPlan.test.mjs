import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
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

test('production plan and concise report reproduce from the current inputs', async t => {
  const rebuilt = await buildCgRosterProductionPlan();
  const publishedText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.json'), 'utf8');
  const reportText = readFileSync(path.join(ROOT, 'docs/cg/roster-production-2026-10-18.md'), 'utf8');
  const digest = value => createHash('sha256').update(value).digest('hex');
  const assertExact = (actual, expected, label) => {
    assert.equal(digest(actual), digest(expected), label);
    assert.ok(actual === expected, label);
  };
  const rebuiltText = serializeCgRosterProductionPlan(rebuilt);
  if (digest(rebuiltText) === digest(publishedText)) {
    assertExact(rebuiltText, publishedText, 'Complete workspace plan must reproduce byte-for-byte');
    assertExact(buildCgRosterProductionReport(rebuilt), reportText, 'Concise report must reproduce byte-for-byte');
    t.diagnostic('Exact production snapshot; no source-availability projection used.');
    return;
  }

  // Published inspection history can outlive a private research checkout. Only
  // these known subjects may lose physically absent private image aliases.
  const privateSourceSubjects = new Set(['predator', 'miku', 'noble_six', 'buck', 'bishop', 'sam_carter', 'rin', 'meiko']);
  const unproducedFoundations = new Set(['miku', 'noble_six', 'buck', 'sam_carter', 'rin']);
  const preservation = JSON.parse(readFileSync(path.join(ROOT,
    'docs/cg/Multiverse_Breach_Fidelite_CG.preservation-validation.json'), 'utf8'));
  const sourcePins = preservation.productionRebuild.frozenInputSignatures;
  const fallbackBytes = readFileSync(path.join(ROOT, 'scripts/fixtures/cg-private-source-fallbacks.json'));
  assert.equal(digest(fallbackBytes), 'e6e906db182c881c25649c6c79772c08282ebaf90878dfb900b78ac4d86624fe',
    'Unqualified fallback contract changed; review its readable values and source inputs explicitly');
  const fallbacks = JSON.parse(fallbackBytes);
  assert.equal(fallbacks.notIdentityAuthority, true);
  const dossiers = JSON.parse(readFileSync(path.join(ROOT, 'docs/rift-dossiers/catalog.json'), 'utf8')).entrees;
  const p0 = JSON.parse(readFileSync(path.join(ROOT, 'docs/audits/fidelity-p0-wave4-2026-10-01.json'), 'utf8')).entries;
  const pick = (object, fields) => Object.fromEntries(fields.filter(key => Object.hasOwn(object, key))
    .map(key => [key, object[key]]));
  const imageFile = reference => /^\/(?:sprites|cg|visuals|images)\//.test(reference.path)
    ? path.join(ROOT, 'public', reference.path.slice(1)) : path.resolve(ROOT, reference.path);
  const projected = structuredClone(rebuilt), projectedIds = [], lostQualification = new Set();
  assert.equal(rebuilt.subjects.length, plan.subjects.length);
  for (const [index, published] of plan.subjects.entries()) {
    const current = rebuilt.subjects[index];
    assert.equal(current.characterId, published.characterId, `Subject order changed at ${index}`);
    const references = published.identity.identityVisualReferences || [];
    const missing = references.filter(reference => !existsSync(imageFile(reference)));
    if (!missing.length) continue;
    const id = published.characterId;
    assert.ok(privateSourceSubjects.has(id), `${id}: unexpected missing identity bitmap`);
    assert.ok(missing.every(reference => /(?:^|\/)\.tmp\//.test(reference.path)), `${id}: a public bitmap is missing`);
    assert.ok(published.identity.sourceEvidenceFiles?.length, `${id}: missing public source receipts`);
    // Validate receipt bytes before allowing any metadata projection. Changed
    // source declarations are a regression even when their images are absent.
    for (const file of published.identity.sourceEvidenceFiles) {
      assert.ok(file.startsWith('docs/cg/'), `${id}: source receipt must be public`);
      assert.match(sourcePins[file] || '', /^[a-f0-9]{64}$/, `${id}: source receipt has no frozen public pin`);
      const bytes = readFileSync(path.join(ROOT, file));
      assert.equal(digest(bytes), sourcePins[file], `${id}: source receipt changed: ${file}`);
      const source = JSON.parse(bytes);
      assert.equal(source.characterId || source.heroId, id, `${id}: wrong source receipt owner`);
    }
    const available = references.filter(reference => existsSync(imageFile(reference)));
    for (const reference of available) {
      assert.ok(statSync(imageFile(reference)).isFile(), `${id}: identity bitmap is not a file`);
      assert.equal(digest(readFileSync(imageFile(reference))), reference.sha256, `${id}: identity bitmap changed`);
    }
    assertExact(JSON.stringify(current.identity.identityVisualReferences || []), JSON.stringify(available),
      `${id}: current identity references must be exactly the available published subset`);
    assert.equal(current.identity.visualFidelityApproved, false, `${id}: unavailable evidence cannot approve fidelity`);
    if (available.length) {
      const expected = { ...published.identity, identityVisualReferences: available };
      assertExact(JSON.stringify(current.identity), JSON.stringify(expected), `${id}: available-source identity metadata changed`);
      projected.subjects[index].identity = published.identity;
    } else {
      assert.equal(current.identity.evidenceStatus, 'needs-reference', `${id}: absent images cannot qualify identity`);
      assert.ok(current.identity.missing.some(value => value.startsWith('Ouvrir une référence visuelle source')),
        `${id}: missing images must remain an explicit production prerequisite`);
      assert.deepEqual(Object.keys(current.identity), Object.keys(published.identity)
        .filter(key => !['sourceEvidenceFiles', 'identityVisualReferences'].includes(key)), `${id}: unexpected identity fields`);
      const contract = fallbacks.cases[id];
      assert.ok(contract, `${id}: no reviewed unqualified fallback contract`);
      assert.equal(digest(JSON.stringify(contract.expectedIdentity)), contract.expectedIdentitySha256);
      assert.deepEqual(contract.publicSourceReceipts, published.identity.sourceEvidenceFiles.map(file =>
        ({ path: file, sha256: sourcePins[file] })), `${id}: fallback source-receipt contract changed`);
      const hero = HEROES_DB.find(item => item.id === id);
      const dossier = dossiers.find(item => item.id === published.characterArcStageId);
      const pilot = CG_CATALOG.find(item => item.characterId === id && item.type === 'characterSolo');
      assert.ok(hero && dossier, `${id}: fallback source declarations are missing`);
      const inputs = {
        hero: pick(hero, fallbacks.heroInputFields),
        dossier: { id: dossier.id, lockPresent: Boolean(dossier.verrouSourcePersonnage),
          verrouSourcePersonnage: dossier.verrouSourcePersonnage
            ? pick(dossier.verrouSourcePersonnage, fallbacks.dossierLockInputFields) : null,
          referenceUrls: dossier.referenceUrls || [] },
        pilot: pilot ? pick(pilot, ['id', 'continuityId', 'sourceRefs', 'promptSummary']) : null,
        p0: p0.some(item => item.id === id)
      };
      assert.equal(digest(JSON.stringify(inputs)), contract.sourceInputsSha256,
        `${id}: public HEROES/dossier/pilot/P0 fallback inputs changed`);
      assertExact(JSON.stringify(inputs), JSON.stringify(contract.sourceInputs),
        `${id}: readable public fallback declarations differ from their contract`);
      for (const field of fallbacks.expectedFields) {
        assert.ok(Object.hasOwn(current.identity, field), `${id}.identity.${field}: fallback field missing`);
        assertExact(JSON.stringify(current.identity[field]), JSON.stringify(contract.expectedIdentity[field]),
          `${id}.identity.${field}: fallback metadata changed before projection`);
      }
      const availabilityFields = new Set(['incarnation', 'identityLock', 'equipment', 'sourceRefs',
        'evidenceStatus', 'sourceEvidenceFiles', 'identityVisualReferences', 'missing']);
      projected.subjects[index].identity = Object.fromEntries(Object.keys(published.identity).map(key =>
        [key, availabilityFields.has(key) ? published.identity[key] : current.identity[key]]));
      lostQualification.add(id);
    }
    projectedIds.push(id);
  }
  assert.ok(projectedIds.length > 0, 'Plan drift has no physically absent, pinned private source explanation');
  const projectedCells = [];
  for (const [index, published] of plan.entries.entries()) {
    const current = rebuilt.entries[index];
    assert.equal(current?.id, published.id, `Entry order changed at ${index}`);
    if (!lostQualification.has(published.characterId) || published.type !== 'characterSolo'
      || published.generatedImageCount !== 0) continue;
    const id = published.characterId;
    assert.ok(unproducedFoundations.has(id), `${id}: unexpected unproduced CG01 projection`);
    for (const entry of [published, current]) {
      assert.equal(entry.status, 'needs-reference', `${id}: delivered or blocked cells cannot be projected`);
      assert.equal(entry.generatedImageCount, 0);
      assert.equal(entry.galleryRegistered, false);
      assert.equal(entry.currentAssets, null);
      assert.equal(entry.themeStatus, 'needs-reference');
    }
    const subjectIndex = rebuilt.subjects.findIndex(subject => subject.characterId === id);
    const identity = rebuilt.subjects[subjectIndex].identity;
    assert.deepEqual(current.themeSource, [...new Set([...identity.sourceRefs, 'docs/cg/CG_PILOT_REFERENCE_AUDIT.md'])]);
    assert.equal(current.themeContinuity, identity.incarnation);
    assert.deepEqual(current.missing, identity.missing);
    for (const field of ['themeSource', 'themeContinuity', 'missing']) projected.entries[index][field] = published[field];
    const currentCell = rebuilt.subjects[subjectIndex].matrix.CG01;
    const publishedCell = plan.subjects[subjectIndex].matrix.CG01;
    assert.equal(currentCell.entryId, published.id);
    assert.equal(currentCell.generatedImageCount, 0);
    assert.equal(currentCell.status, 'needs-reference');
    assert.deepEqual(currentCell.themeSource, current.themeSource);
    assert.deepEqual(publishedCell.themeSource, published.themeSource);
    // CG01 mirrors only themeSource into the matrix; every other cell field,
    // all delivered artwork, and the remaining matrix stay byte-exact below.
    projected.subjects[subjectIndex].matrix.CG01.themeSource = publishedCell.themeSource;
    projectedCells.push(id);
  }
  assert.equal(projectedCells.length, new Set(projectedCells).size);
  const projectedText = serializeCgRosterProductionPlan(projected);
  const firstDifference = (actual, expected, location = 'plan') => {
    if (actual === expected) return null;
    if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return location;
    const keys = Object.keys(expected);
    if (Object.keys(actual).join('\0') !== keys.join('\0')) return `${location}.keys`;
    for (const key of keys) {
      const changed = firstDifference(actual[key], expected[key], `${location}.${key}`);
      if (changed) return changed;
    }
    return null;
  };
  const unexpectedPath = digest(projectedText) === digest(publishedText) ? null : firstDifference(projected, plan);
  assertExact(projectedText, publishedText,
    `Plan changed outside pinned private-source identity and unproduced CG01 metadata${unexpectedPath ? ` at ${unexpectedPath}` : ''}`);
  assertExact(buildCgRosterProductionReport(projected), reportText,
    'Concise report must remain exact after the validated source-availability projection');
  t.diagnostic(`Pinned private sources unavailable for ${projectedIds.join(', ')}; derived unproduced CG01 only: ${projectedCells.join(', ')}.`);
});
