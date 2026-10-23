import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createGlobalBatch, loadAtlasCorrectionHistory, loadCgGenerationHistory, renderGlobalJob, SLOT_IDS } from './buildCgGlobalBatch.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'cg-global-batch-fixture-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (relative, bytes) => {
    const file = path.resolve(root, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, bytes);
    return { path: relative, sha256: hash(bytes) };
  };
  const portrait = put('public/images/alpha.png', 'private test fixture: source bitmap');
  const sourceCopy = put('docs/cg/alpha-source-copy.png', 'private test fixture: source bitmap');
  const environment = put('docs/cg/environment.png', 'private test fixture: environment bitmap');
  const target = put('public/cg/world/alpha/target.png', 'private test fixture: generated target bitmap');
  const receipt = put('docs/cg/alpha-reference-evidence.json', '{}');
  const assets = Object.fromEntries(['source', 'master', 'thumbnail'].map(name => [name, { ...put(`public/cg/world/alpha/${name}.png`, `private test fixture: ${name}`), path: `/cg/world/alpha/${name}.png` }]));
  const matrix = () => Object.fromEntries(SLOT_IDS.map(slot => [slot, {
    status: 'needs-theme/reference', selectedType: slot === 'CG13' ? null : 'coherentScene',
    typeOptions: slot === 'CG13' ? ['genderSwap', 'iconicOutfitSwap'] : ['coherentScene'],
    poseBrief: `Authored source-bound pose ${slot}`, themeBrief: `Character-specific theme ${slot}`,
    themeStatus: 'documented-character-brief-not-generated',
    themeSource: ['docs/cg/source.json'], backgroundId: `alpha-${slot}`,
    backgroundBrief: `Distinct source-bound setting ${slot}`, generatedImageCount: 0
  }]));
  const alphaMatrix = matrix();
  alphaMatrix.CG01 = { ...alphaMatrix.CG01, status: 'generated', type: 'characterSolo', entryId: 'cg:alpha:01', generatedImageCount: 1 };
  alphaMatrix.CG04 = { ...alphaMatrix.CG04, generationStatus: 'blocked-input-moderation', generationEvidenceFile: 'docs/cg/alpha-empty-delivery.json' };
  alphaMatrix.CG05 = { ...alphaMatrix.CG05, generationStatus: 'not-attempted-after-provider-blocks', generationEvidenceFile: 'docs/cg/alpha-empty-delivery.json' };
  const betaMatrix = matrix();
  betaMatrix.CG15 = { status: 'not-applicable-source-reviewed', reason: 'Explicit documented fictional fixture N/A', generatedImageCount: 0 };
  const subjects = [
    { characterId: 'alpha', characterName: 'Alpha', universe: 'World', universeKey: 'world', priority: 'P1', identity: { incarnation: 'Alpha original V2' }, matrix: alphaMatrix },
    { characterId: 'beta', characterName: 'Beta', universe: 'World', universeKey: 'world', priority: 'P1', identity: { incarnation: null }, matrix: betaMatrix }
  ];
  const reference = (pin, extra = {}) => ({ ...pin, role: 'canonical-original-project-portrait', canonicalProjectReference: true,
    sourceFile: receipt.path, viewed: true, exists: true, referencePurpose: 'identity-equipment', ...extra });
  const bible = { subjects: subjects.map(subject => ({
    characterId: subject.characterId, characterName: subject.characterName, name: subject.characterName,
    incarnation: { label: subject.characterId === 'alpha' ? 'Alpha original V2' : 'Unknown', status: 'original-project-canon' },
    identityLock: subject.characterId === 'alpha' ? 'Specific Alpha identity, no automatic approval' : null,
    visualLocks: { silhouette: ['Specific silhouette'], equipment: ['Specific left-hand tool'] },
    localVisuals: [
      { path: '/sprites/old-atlas.png', role: 'project-generated-art', exists: true, selectedInRuntime: true },
      ...(subject.characterId === 'alpha' ? [
        reference(portrait), reference(sourceCopy),
        reference(portrait, { referencePurpose: 'equipment-only' }),
        reference(environment, { role: 'independent-canon-reference', canonicalProjectReference: false, referencePurpose: 'environment-only', url: 'https://publisher.invalid/environment.png' }),
        reference(target, { path: path.resolve(root, target.path), role: 'independent-canon-reference', canonicalProjectReference: false, url: 'https://publisher.invalid/target.png' }),
        reference(environment, { role: 'independent-canon-reference', canonicalProjectReference: false, referencePurpose: 'identity', referenceCharacter: 'Somebody Else', url: 'https://publisher.invalid/somebody-else.png' })
      ] : [reference(environment, { role: 'independent-environment-reference', canonicalProjectReference: false, referencePurpose: 'environment-only', url: 'https://publisher.invalid/environment.png' })])
    ], sources: [], readiness: { missing: ['Hidden details not documented'] }, universeCoherence: { architecture: ['Source-bound architecture'] }, ageStatus: 'not-established'
  })) };
  const plan = {
    summary: { totalSubjects: 2, universes: 1, matrixCells: 30, generated: 1, matrixNotApplicableTotal: 1, totalRequestedSlotsNotProduced: 28 },
    subjects, backgrounds: [], entries: [{ id: 'cg:alpha:01', characterId: 'alpha', type: 'characterSolo', galleryRegistered: true,
      generatedImageCount: 1, currentAssets: assets, fidelityReview: 'pending-new-1-to-1-review', currentRevisionId: 'original' }]
  };
  return { root, put, plan, bible, sourceReceipt: receipt, build: options => createGlobalBatch({ root, plan, bible, inputs: {}, ...options }) };
}

test('whole-roster manifest preserves every production cell and distinguishes real files, N/A, refusal and non-attempt', t => {
  const f = fixture(t);
  const before = structuredClone(f.plan.subjects);
  const batch = f.build();
  assert.equal(batch.summary.subjects, 2);
  assert.equal(batch.summary.cgSlots, 30);
  assert.equal(batch.summary.actualDeliveredCg, 1);
  assert.equal(batch.summary.documentedNotApplicable, 1);
  assert.equal(batch.summary.remainingSlots, 28);
  assert.equal(batch.summary.currentProviderRefusedOrCorrectionRefusedJobs, 1);
  assert.equal(batch.summary.jobsWithRecordedNonAttempt, 1);
  assert.equal(batch.summary.automaticPerfectFidelityApprovals, 0);
  assert.equal(batch.summary.imageCallsMadeByThisBuilder, 0);
  assert.equal(batch.summary.imagesInstalledByThisBuilder, 0);
  for (const subject of batch.subjects) {
    assert.deepEqual(subject.jobs.map(job => job.slot), SLOT_IDS);
    for (const job of subject.jobs) assert.deepEqual(job.production, before.find(s => s.characterId === subject.characterId).matrix[job.slot]);
  }
  const alpha = batch.subjects[0];
  assert.equal(alpha.jobs[0].queueStatus, 'delivered-current', 'Generic pending checklist is not an observed source defect');
  assert.equal(alpha.jobs[3].queueStatus, 'provider-refused');
  assert.equal(alpha.jobs[4].production.generationStatus, 'not-attempted-after-provider-blocks');
  assert.equal(alpha.jobs[4].queueStatus, 'ready-for-generation', 'A never-attempted source-qualified slot is not a refusal');
  assert.equal(alpha.jobs[12].queueStatus, 'needs-character-brief', 'CG13 exclusive alternative must be selected explicitly');
  assert.equal(batch.subjects[1].jobs[14].queueStatus, 'not-applicable-documented');
  assert.deepEqual(f.plan.subjects, before, 'Builder must not mutate source inputs');
});

test('one internal identity bitmap stays one authority; scoped, target and wrong-character images cannot approve identity', t => {
  const f = fixture(t);
  const batch = f.build();
  const alpha = batch.subjects[0];
  assert.equal(alpha.references.identity.length, 1, 'Byte-identical source copy is not another identity source');
  assert.equal(alpha.references.identity[0].identityUse, 'internal-original-authority');
  assert.equal(alpha.references.equipmentOnly.length, 1);
  assert.equal(alpha.references.environmentOnly.length, 1);
  assert.equal(alpha.references.other.filter(ref => ref.path.includes('/cg/') || ref.referenceCharacter).every(ref => !ref.qualifiesIdentity), true);
  assert.equal(batch.summary.subjectsWithInternalOriginalAuthority, 1);
  assert.equal(batch.summary.subjectsWithExternalIdentityReference, 0);
  assert.equal(batch.subjects[1].references.identity.length, 0);
  assert.equal(batch.subjects[1].jobs[1].queueStatus, 'needs-reference');
  assert.equal(alpha.sprite.existingProjectImageQualifiesIdentityByItself, false);
});

test('a viewed source whose bytes, receipt or owner no longer match cannot keep a job generation-ready', t => {
  const f = fixture(t);
  for (const ref of f.bible.subjects[0].localVisuals.filter(ref => ref.referencePurpose === 'identity-equipment')) ref.sha256 = '0'.repeat(64);
  let batch = f.build();
  assert.equal(batch.subjects[0].references.identity.length, 0);
  assert.equal(batch.subjects[0].jobs[1].queueStatus, 'needs-reference');
  rmSync(path.resolve(f.root, f.sourceReceipt.path));
  batch = f.build();
  assert.equal(batch.summary.subjectsWithVerifiedIdentityReference, 0);
  assert.equal(batch.subjects[0].references.equipmentOnly.length, 0);
  assert.equal(batch.subjects[0].references.other.find(ref => ref.referencePurpose === 'equipment-only').sourceReceiptExistsAtBuild, false);
});

test('an explicit registered source correction and its real failed revision stay distinct from delivered CG and N/A', t => {
  const f = fixture(t);
  const history = { byJob: new Map([['alpha/CG01', [{ kind: 'refusal', phase: 'correction', receiptFile: 'docs/cg/old-refusal.json' }]]]), receipts: [] };
  const batch = f.build({ currentVisualReviews: new Map([['cg:alpha:01', { status: 'needs-source-correction', limitations: ['Known missing source equipment'] }]]), generationHistory: history });
  assert.equal(batch.subjects[0].jobs[0].queueStatus, 'source-correction-refused');
  assert.equal(batch.subjects[0].jobs[0].production.status, 'generated');
  assert(batch.subjects[0].jobs[0].currentAssets.source.path);
  assert.equal(batch.summary.actualDeliveredCg, 1);
  assert.equal(batch.summary.documentedNotApplicable, 1);
  assert.equal(batch.summary.currentProviderRefusedOrCorrectionRefusedJobs, 2);
});

test('generated flags without actual registered files and incomplete roster coverage are rejected', t => {
  const f = fixture(t);
  rmSync(path.resolve(f.root, 'public/cg/world/alpha/source.png'));
  assert.throws(() => f.build(), /Missing actual source/);
  const g = fixture(t);
  delete g.plan.subjects[0].matrix.CG15;
  assert.throws(() => g.build(), /expected fifteen slots/);
  const h = fixture(t);
  h.bible.subjects.pop();
  assert.throws(() => h.build(), /same whole roster/);
});

test('empty CG-delivery receipt preserves actual refusal, while atlas and wrong-owner receipts do not become CG histories', t => {
  const f = fixture(t);
  const slots = SLOT_IDS.map(slot => ({ slot }));
  const writeJson = (file, value) => f.put(file, JSON.stringify(value));
  writeJson('docs/cg/alpha-plan.json', { characterId: 'alpha', slots });
  writeJson('docs/cg/alpha-empty-delivery.json', { characterId: 'alpha', entries: [], planFile: 'docs/cg/alpha-plan.json', blockedSlots: [{ slot: 'CG04', status: 'blocked-input-moderation', category: 'fixture-category' }], unattemptedSlots: ['CG05'] });
  writeJson('docs/cg/atlas-plan.json', { characterId: 'alpha', slots: Array.from({ length: 16 }, (_, index) => ({ slot: `CG${String(index + 1).padStart(2, '0')}` })) });
  writeJson('docs/cg/alpha-atlas.json', { characterId: 'alpha', entries: [], planFile: 'docs/cg/atlas-plan.json', blockedSlots: [{ slot: 'CG04', status: 'blocked' }] });
  writeJson('docs/cg/wrong-owner.json', { characterId: 'beta', entries: [], planFile: 'docs/cg/alpha-plan.json', blockedSlots: [{ slot: 'CG04', status: 'blocked' }] });
  const history = loadCgGenerationHistory(f.root, new Set(['alpha', 'beta']));
  assert.equal(history.receipts.length, 1);
  assert.equal(history.byJob.get('alpha/CG04')[0].observed.category, 'fixture-category');
  assert.equal(history.byJob.get('alpha/CG05')[0].kind, 'non-attempt');
  assert.equal(history.byJob.has('beta/CG04'), false);
});

test('rendered work fiche applies the same whole-roster instruction without claiming an image was generated', t => {
  const f = fixture(t);
  const rendered = renderGlobalJob(f.build(), 'beta', 'CG02');
  assert(rendered.startsWith('MULTIVERSE BREACH — UNE CONSIGNE POUR TOUT LE ROSTER'));
  assert(rendered.includes('CG13 une seule alternative genderSwap OU iconicOutfitSwap'));
  assert(rendered.includes('État de travail : needs-reference.'));
  assert(rendered.includes('Cette fiche ne déclenche aucun appel'));
  assert(rendered.includes('"characterId": "beta"'));
  assert.throws(() => renderGlobalJob(f.build(), 'not-on-roster', 'CG01'), /Unknown roster character/);
  assert.throws(() => renderGlobalJob(f.build(), 'alpha', 'CG16'), /Unknown CG slot/);
});

test('a qualified visible identity with an explicit full-body coverage gap stays needs-reference for new CG, never N/A', t => {
  const f = fixture(t);
  f.put(f.sourceReceipt.path, JSON.stringify({ characterId: 'alpha', atlasReadiness: { status: 'needs-full-body-reference', reason: 'Waist and lower legs hidden by an external scene element.' } }));
  const batch = f.build();
  const alpha = batch.subjects[0];
  assert.equal(alpha.references.identity.length, 1, 'The visible identity remains source-qualified');
  assert.equal(alpha.target.sourceCoverage.fullBodyReferenceStillNeeded, true);
  assert.equal(alpha.target.generationReferenceStatus, 'needs-reference');
  assert.equal(alpha.jobs[1].queueStatus, 'needs-reference');
  assert.equal(alpha.jobs[0].queueStatus, 'delivered-current', 'An existing file remains delivered with its recorded review');
  assert.equal(alpha.jobs[3].queueStatus, 'provider-refused', 'An actual CG refusal remains separately preserved');
  assert.equal(batch.summary.subjectsWithExplicitFullBodySourceCoverageGap, 1);
  assert.equal(batch.summary.documentedNotApplicable, 1, 'Source gaps never create a new N/A');
});

test('Harry-shaped current Bible coverage decision gates missing legs and shoes while preserving deliveries and refusals', t => {
  const f = fixture(t);
  f.put(f.sourceReceipt.path, JSON.stringify({ characterId: 'alpha', limitations: [
    'Ces trois cadrages ne constituent pas un turntable ni une vue lisible de la baguette.'
  ] }));
  const decision = 'Not attempted: shoe/ankle/full-leg silhouette and readable wand missing from three inspected stills.';
  f.bible.subjects[0].readiness.currentSprite = { sourceCoverageDecision: decision };
  const biblePin = { path: 'docs/cg/fixture-bible.json', sha256: hash(JSON.stringify(f.bible)) };
  const batch = f.build({ inputs: { bible: biblePin } });
  const alpha = batch.subjects[0];
  assert.equal(alpha.target.sourceCoverage.fullBodyReferenceStillNeeded, true);
  assert.deepEqual(alpha.target.sourceCoverage.explicitSourceCoverageConditions, [{
    sourceKind: 'current-bible-field', sourceFile: biblePin.path, sourceSha256: biblePin.sha256,
    sourceField: 'subjects[characterId=alpha].readiness.currentSprite.sourceCoverageDecision', observedText: decision
  }]);
  assert.equal(alpha.jobs[4].queueStatus, 'needs-reference');
  assert.equal(alpha.jobs[0].queueStatus, 'delivered-current');
  assert.equal(alpha.jobs[3].queueStatus, 'provider-refused');
  assert.equal(batch.summary.documentedNotApplicable, 1);
});

test('Jack-shaped receipt records upper-body-only and missing boot evidence without changing actual CG history', t => {
  const f = fixture(t);
  const pin = f.put(f.sourceReceipt.path, JSON.stringify({ characterId: 'alpha',
    incarnation: 'Film2003 — Alpha, upper-body identity from official film stills only',
    references: [{ path: 'public/images/alpha.png', sha256: hash('private test fixture: source bitmap'),
      usedAsIdentityReference: true, limitations: [
        'Film still2003; not a full model turntable.',
        'Lower-leg and boot details not covered by selected identity stills.'
      ] }]
  }));
  const before = structuredClone(f.plan.subjects);
  const batch = f.build();
  const alpha = batch.subjects[0];
  const conditions = alpha.target.sourceCoverage.explicitSourceCoverageConditions;
  assert.equal(alpha.target.sourceCoverage.fullBodyReferenceStillNeeded, true);
  assert.equal(conditions.length, 2, 'Only upper-body-only and explicit lower-leg gaps count, not turntable absence');
  assert(conditions.every(condition => condition.sourceFile === pin.path && condition.sourceSha256 === pin.sha256));
  assert.equal(conditions[1].sourceField, 'references[0].limitations[1]');
  assert.equal(conditions[1].identityReference.sha256, hash('private test fixture: source bitmap'));
  assert.equal(alpha.jobs[4].queueStatus, 'needs-reference');
  assert.equal(alpha.jobs[4].production.generationStatus, 'not-attempted-after-provider-blocks');
  assert.equal(alpha.jobs[0].queueStatus, 'delivered-current');
  assert.equal(alpha.jobs[3].queueStatus, 'provider-refused');
  assert.equal(batch.summary.documentedNotApplicable, 1);
  assert.deepEqual(f.plan.subjects, before);
});

test('no turntable, unclear equipment or excluded-reference lower-body limits do not invent a body coverage gap', t => {
  const f = fixture(t);
  f.put(f.sourceReceipt.path, JSON.stringify({ characterId: 'alpha',
    limitations: ['Film still; not a full model turntable.', 'Wand design is missing from these stills.'],
    references: [{ path: 'docs/cg/environment.png', sha256: hash('private test fixture: environment bitmap'),
      usedAsIdentityReference: false, limitations: ['Lower-leg and boot details not covered by selected identity stills.'] }],
    excludedReferences: [{ limitations: ['Full-body identity missing.'] }]
  }));
  f.bible.subjects[0].readiness.currentSprite = { sourceCoverageDecision: 'Not attempted: a full turntable and readable wand missing.' };
  const alpha = f.build().subjects[0];
  assert.equal(alpha.target.sourceCoverage.fullBodyReferenceStillNeeded, false);
  assert.equal(alpha.jobs[4].queueStatus, 'ready-for-generation');
  assert.deepEqual(alpha.target.sourceCoverage.explicitSourceCoverageConditions, []);
});

test('a cropped supplementary identity source cannot impose a full-body gap on the other qualified identity bitmap', t => {
  const f = fixture(t);
  const second = f.put('public/images/alpha-complete.png', 'private fixture: another identity bitmap');
  f.bible.subjects[0].localVisuals.push({ ...f.bible.subjects[0].localVisuals[1], ...second });
  f.put(f.sourceReceipt.path, JSON.stringify({ characterId: 'alpha', references: [
    { path: 'public/images/alpha.png', sha256: hash('private test fixture: source bitmap'),
      usedAsIdentityReference: true, limitations: ['Lower legs partly obscured in this crop.'] },
    { ...second, usedAsIdentityReference: true, limitations: ['Front full-body design; rear ornament not established.'] }
  ] }));
  const alpha = f.build().subjects[0];
  assert.equal(alpha.references.identity.length, 2);
  assert.equal(alpha.target.sourceCoverage.referenceSpecificBodyCoverageLimits.length, 1, 'The actual crop limitation remains visible');
  assert.equal(alpha.target.sourceCoverage.fullBodyReferenceStillNeeded, false, 'One cropped image is not a whole-source coverage decision');
  assert.equal(alpha.jobs[4].queueStatus, 'ready-for-generation');
});

test('atlas refusals retain their own receipts, history and active selections without inflating CG refusal counters', t => {
  const f = fixture(t);
  const old = f.put('public/sprites/old-atlas.png', 'private fixture: old atlas bytes');
  const oldAsset = { path: '/sprites/old-atlas.png', sha256: old.sha256 };
  const modern = 'docs/cg/alpha-sprite-wave6-2026-10-23.json';
  f.put(modern, JSON.stringify({ characterId: 'alpha', date: '2026-10-23', plannedFrames: 16,
    newAtlasInstalled: false, status: 'blocked-output-moderation-no-image-delivered', previousAtlas: oldAsset,
    attempts: [{ status: 'blocked-output-moderation', stage: 'output', categories: ['fixture-atlas-category'], requestId: 'private-fixture-request' }] }));
  const historical = 'docs/cg/reviews/fixture/old-sprite-attempts.json';
  f.put(historical, JSON.stringify({ date: '2026-10-18', records: [{ characterId: 'beta', status: 'blocked-output-moderation', moderationStage: 'output', moderationCategories: ['fixture-historical-category'], outputProduced: false, oldAsset }] }));
  f.bible.subjects[1].readiness.currentSprite = { status: 'source-identity-qualified-existing-sprite-too-far-correction-blocked', correctionAttemptEvidence: historical };
  f.put('docs/cg/alpha-cg-wave6-2026-10-23.json', JSON.stringify({ characterId: 'alpha', plannedSlots: 15, status: 'blocked-output-moderation', entries: [] }));
  let atlasHistory = loadAtlasCorrectionHistory(f.root, f.bible);
  assert.equal(atlasHistory.records.length, 2);
  assert.equal(atlasHistory.currentBlockedSubjects, 2);
  assert.equal(atlasHistory.newBlockedSubjects, 1);
  assert.equal(atlasHistory.historicalBlockedSubjects, 1);
  assert.equal(atlasHistory.records.find(record => record.characterId === 'alpha').categories[0], 'fixture-atlas-category');
  const batch = f.build({ atlasHistory });
  assert.equal(batch.summary.currentAtlasRefusedSubjects, 2);
  assert.equal(batch.summary.currentProviderRefusedOrCorrectionRefusedJobs, 1, 'Atlas failure must not become another CG04 failure');
  assert.equal(batch.subjects[0].atlasCorrectionRefusals.length, 1);
  assert.equal(batch.subjects[0].jobs.some(job => job.generationHistory.some(record => record.receiptFile === modern)), false);
  const replacement = f.put('public/sprites/new-atlas.png', 'private fixture: separately delivered atlas');
  f.bible.subjects[0].localVisuals[0].path = '/sprites/new-atlas.png';
  atlasHistory = loadAtlasCorrectionHistory(f.root, f.bible);
  assert(replacement.sha256);
  assert.equal(atlasHistory.records.length, 2, 'Historical failed attempt remains documented after a genuine later replacement');
  assert.equal(atlasHistory.currentBlockedSubjects, 1, 'A failed predecessor must not poison a later selected atlas');
});
