import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';
import { getCgQuarantineSelectionMessage, getCgQuarantineVisualFlags, getCgQuarantineWorldScope,
  getCgReviewedQuarantineSprite, KOTOR_I_CG_MIDGROUND } from './cgReviewedQuarantineMetadata.mjs';

export const CG_REVIEWED_RUNTIME_AMENDMENT_PATH = 'scripts/fixtures/cg-reviewed-runtime-correction-amendment-2026-11-13.json';
const historicalSha256 = 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e';
const priorSourceSha256 = 'eba38c68b819869fc4cc31fd8b430c8562c9cc763fdc1c76a2ed632e30fbb0b4';
const digest = value => createHash('sha256').update(value).digest('hex');
const fixture = Object.freeze({ schemaVersion: 1, kind: 'exact-reviewed-runtime-correction-metadata',
  actorId: 'darth_revan', universe: 'Star Wars',
  incarnation: 'Star Wars: Knights of the Old Republic I - masked Darth Revan (Legends Sith)',
  historicalPlanSha256: historicalSha256, priorSourceAmendmentSha256: priorSourceSha256,
  rejectedAssetSha256: '78200992ef619c3e7d16907db20496df67b018c1fb99697bcf75dce3ea43169c',
  currentAssetSha256: 'c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf',
  placeReferenceHtmlSha256: '4fd4f37bc026cc3d98ca97d759685d2b588a3817ec35c019ac404f32f54be01b',
  currentObjects: ['subject:darth_revan', 'entry:characterSolo:darth_revan', 'background:characterSolo:darth_revan'],
  runtimeSelectionAuthority: 'src/game/canonicalSpriteQuarantine.js#getReviewedQuarantineCorrection',
  changesDeliveredImages: false, changesSaveOrActorIdentity: false, newImageGenerationUsed: false,
  visualFidelityApproved: false, fullSource1to1Verified: false,
  scope: 'Derive and verify the exact current Revan correction and pending KOTOR I place proposal, then check all remaining data through the unchanged historical snapshot validator. No arbitrary JSON replacements.' });

const only = (items, predicate, label) => {
  const matches = items.map((item, index) => ({ item, index })).filter(({ item }) => predicate(item));
  assert.equal(matches.length, 1, `${label}: exactly one object required`);
  return matches[0];
};

// This function never accepts a generic path/value patch. It derives the three
// expected current objects from the frozen prior records and reviewed runtime
// API. The caller MUST run the unchanged complete historical validator on the
// returned projection; unrelated current data is retained, not discarded.
export function projectCgReviewedRuntimeAmendment({ root, publishedText, published, rebuilt, heroes }) {
  assert.equal(digest(publishedText), historicalSha256, 'Revan amendment requires the unchanged GitHub 2333 snapshot');
  const amendmentText = readFileSync(path.join(root, CG_REVIEWED_RUNTIME_AMENDMENT_PATH), 'utf8');
  assert.deepEqual(JSON.parse(amendmentText), fixture, 'Revan amendment is a closed factual contract');
  assert.equal(digest(readFileSync(path.join(root, 'scripts/fixtures/cg-source-metadata-amendment-2026-11-13.json'))), priorSourceSha256,
    'Prior source amendment must remain unchanged');
  const hero = only(heroes, actor => actor.id === fixture.actorId, 'Revan hero').item;
  const quarantine = getQuarantinedCanonSprite(hero);
  const correction = getCgReviewedQuarantineSprite(hero, getHeroSpriteSheetSrc(hero));
  assert.ok(quarantine && correction, 'Revan requires the exact reviewed runtime edition');
  assert.equal(quarantine.sha256, fixture.rejectedAssetSha256);
  assert.equal(correction.sha256, fixture.currentAssetSha256);
  assert.equal(correction.incarnation, fixture.incarnation);
  assert.equal(digest(readFileSync(path.join(root, 'public', correction.path))), fixture.currentAssetSha256,
    'Selected correction bitmap must match its reviewed bytes');
  const scope = getCgQuarantineWorldScope(hero);
  assert.ok(scope, 'Revan KOTOR I place scope required');
  const reference = JSON.parse(readFileSync(path.join(root, scope.evidenceFile), 'utf8'));
  assert.equal(reference.url, scope.referenceUrl);
  assert.equal(reference.httpStatus, 200);
  assert.equal(reference.sha256, fixture.placeReferenceHtmlSha256);
  assert.equal(reference.sourceImageInspected, false, 'A plot text cannot qualify visual architecture');
  const html = gunzipSync(readFileSync(path.join(root, scope.evidenceFile.replace(/\.json$/, '.html.gz'))));
  assert.equal(digest(html), fixture.placeReferenceHtmlSha256, 'Frozen plot reference changed');

  const oldSubject = only(published.subjects, item => item.characterId === hero.id, 'Historical Revan subject');
  const currentSubject = only(rebuilt.subjects, item => item.characterId === hero.id, 'Current Revan subject');
  const oldEntry = only(published.entries, item => item.characterId === hero.id, 'Historical Revan entry');
  const currentEntry = only(rebuilt.entries, item => item.characterId === hero.id, 'Current Revan entry');
  const oldBackground = only(published.backgrounds, item => item.characterId === hero.id, 'Historical Revan background');
  const currentBackground = only(rebuilt.backgrounds, item => item.characterId === hero.id, 'Current Revan background');
  for (const entry of [oldEntry.item, currentEntry.item]) {
    assert.equal(entry.type, 'characterSolo');
    assert.equal(entry.status, 'needs-reference');
    assert.equal(entry.generatedImageCount, 0);
    assert.equal(entry.currentAssets, null);
    assert.equal(entry.currentRevisionId, null);
    assert.equal(entry.galleryRegistered, false);
    assert.equal(entry.fidelityReview, 'pending-new-1-to-1-review');
  }
  assert.deepEqual(oldSubject.item.identity.runtimeSpriteQuarantine, { characterId: hero.id, ...quarantine });
  const beforeMessage = getCgQuarantineSelectionMessage(quarantine, null);
  assert.equal(oldSubject.item.identity.missing.filter(line => line === beforeMessage).length, 1);
  const missing = oldSubject.item.identity.missing.map(line => line === beforeMessage ? getCgQuarantineSelectionMessage(quarantine, correction) : line);
  const oldCandidates = oldSubject.item.identity.localCandidates;
  assert.equal(oldCandidates.length, 1);
  assert.equal(oldCandidates[0].path, quarantine.asset);
  const candidates = [...oldCandidates.map(candidate => ({ ...candidate,
    exists: existsSync(path.join(root, 'public', candidate.path)) })), {
    path: correction.path, exists: existsSync(path.join(root, 'public', correction.path)),
    role: 'current-reviewed-project-sprite-not-independent-canon-proof',
    ...getCgQuarantineVisualFlags(correction.path, quarantine, correction) }];
  const identity = { ...oldSubject.item.identity, localCandidates: candidates, runtimeSpriteCorrection: correction, missing };
  assert.deepEqual(currentSubject.item, { ...oldSubject.item, identity }, 'Only the exact reviewed Revan subject fields may change');

  const previousBackground = oldBackground.item;
  assert.equal(previousBackground.type, 'characterSolo');
  assert.equal(previousBackground.status, 'proposed-needs-source-and-visual-review');
  assert.equal(previousBackground.currentImageUsesThisBackground, false);
  assert.ok(previousBackground.originalScene.location.startsWith(previousBackground.sourceSetting + ' — '));
  const sourceSetting = scope.world.locations[0];
  const originalScene = { ...previousBackground.originalScene,
    location: previousBackground.originalScene.location.replace(previousBackground.sourceSetting, sourceSetting),
    midground: KOTOR_I_CG_MIDGROUND,
    background: previousBackground.originalScene.background.replace(previousBackground.sourceSetting, sourceSetting) };
  const background = { ...previousBackground, sourceSetting, sourceContext: scope.sourceContext,
    originalScene, description: Object.values(originalScene).join(' ') };
  assert.deepEqual(currentBackground.item, background, 'Only the exact pending KOTOR I background may change');
  assert.equal(oldEntry.item.promptBrief.split(previousBackground.originalScene.location).length, 2);
  const entry = { ...oldEntry.item, missing,
    promptBrief: oldEntry.item.promptBrief.replace(previousBackground.originalScene.location, originalScene.location) };
  assert.deepEqual(currentEntry.item, entry, 'Revan CG01 must remain unproduced with only its current warning/place corrected');

  const subjects = rebuilt.subjects.slice(), entries = rebuilt.entries.slice(), backgrounds = rebuilt.backgrounds.slice();
  subjects[currentSubject.index] = oldSubject.item;
  entries[currentEntry.index] = oldEntry.item;
  backgrounds[currentBackground.index] = oldBackground.item;
  return { projected: { ...rebuilt, subjects, entries, backgrounds }, evidence: {
    mode: 'historical-plan-with-exact-reviewed-Revan-current-metadata-amendment',
    amendment: CG_REVIEWED_RUNTIME_AMENDMENT_PATH, amendmentSha256: digest(amendmentText),
    actorId: hero.id, objectsVerified: 3, selectedRuntimeSprite: correction.path,
    historicalPlanPreserved: true, deliveredImageChanges: 0, visualFidelityApproved: false, fullSource1to1Verified: false } };
}
