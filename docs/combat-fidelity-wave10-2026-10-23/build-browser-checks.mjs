import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { getCharacterAnimationAssets } from '../../src/game/combat/characterAnimationCatalog.js';
import { getSummonAnimationAssets } from '../../src/game/combat/summonAnimationCatalog.js';

// Aggregate retained observations. This script never runs a browser, invents a
// successful journey or replaces the separate build/HTTP validation.
const directory = new URL('./', import.meta.url);
const project = new URL('../../', import.meta.url);
const final = process.argv.includes('--final');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = path => JSON.parse(fs.readFileSync(new URL(path, directory)));
const baseline = json('runtime-baseline.json');
const native = getCharacterAnimationAssets();
const summons = getSummonAnimationAssets();
const fullNative = native.filter(asset => Object.keys(asset.phases).length === 8);
const partialNative = native.filter(asset => Object.keys(asset.phases).length < 8);
const partialDetails = partialNative.map(asset => ({ heroId: asset.heroId, poses: asset.frames, phases: Object.keys(asset.phases) }));
const expectedDraws = native.reduce((sum, asset) => sum + Object.keys(asset.phases).length * 4 * 2, 0);
const historicalDraws = baseline.characterAssets.reduce((sum, asset) => sum + Object.keys(asset.phases).length * 4 * 2, 0);
const oldBases = json('baseline.json').baseSpriteCorrections.entries;
const newBases = ['A','B','C','D'].flatMap(part => JSON.parse(fs.readFileSync(new URL(`src/game/combat/characterSpriteCorrectionsWave10Part${part}.generated.json`, project))).entries);
assert.equal(new Set(native.map(asset => asset.heroId)).size, native.length);
assert.equal(new Set([...oldBases,...newBases].map(asset => asset.heroId)).size, oldBases.length + newBases.length);
for (const asset of [...native,...summons,...oldBases,...newBases]) {
  assert.equal(sha(fs.readFileSync(new URL('public' + asset.sheet, project))), asset.sha256, asset.sheet + ': delivered PNG changed');
}
const missing = [], checks = [];
function proof(path, extract) {
  if (!fs.existsSync(new URL(path, directory))) { missing.push(path); return null; }
  const bytes = fs.readFileSync(new URL(path, directory)), data = JSON.parse(bytes);
  const errors = [...(data.pageErrors || []), ...(data.errors || [])];
  assert.deepEqual(errors, [], path);
  for (const request of data.failedRequests || []) assert.match(request.url, /^https:\/\/fonts\.googleapis\.com\//, path + ': internal request failed');
  for (const source of Array.isArray(data.sources) ? data.sources : []) {
    if (source.path && source.sha256) assert.equal(sha(fs.readFileSync(new URL(source.path, project))), source.sha256, path + ': observed input changed: ' + source.path);
  }
  for (const source of data.inputHashes || []) assert.equal(sha(fs.readFileSync(new URL(source.path, project))), source.sha256, path + ': frozen input changed: ' + source.path);
  for (const artifact of data.artifacts || []) assert.equal(sha(fs.readFileSync(new URL(artifact.path, project))), artifact.sha256, path + ': retained artifact changed: ' + artifact.path);
  const observed = extract(data);
  assert.equal(observed.observedPassed, true, path);
  return { path, sha256: sha(bytes), ...observed, freezeStatus: 'frozen-observation', errors,
    externalFontRequestFailures: (data.failedRequests || []).length, source1to1Verified: false };
}
const retain = (path, extract) => { const item = proof(path, extract); if (item) checks.push(item); };

retain('browser/native-presentations.json', j => ({
  domain: 'native-presentations', observedPassed: j.passed && j.characters === native.length
    && j.full32Count === fullNative.length && j.partialCount === partialNative.length
    && j.partialPoses === partialNative.reduce((sum, asset) => sum + asset.frames, 0)
    && j.actualFrameDraws === expectedDraws && j.geometryChecks === expectedDraws
    && j.historicalAssetRecordsUnchanged === baseline.characterAssets.length
    && j.historicalDrawGeometryUnchanged === historicalDraws
    && j.historicalSummonAssetRecordsAndPngHashesUnchanged === baseline.summonAssets.length
    && j.janineReusedPresentationDraws === 16 && j.humanFallbackFrameDraws === 48,
  metrics: { nativeHeroEntries: j.characters, complete32: j.full32Count, partialCharacters: j.partialCount,
    partialPoses: j.partialPoses, partialDetails: j.partialDetails, nativeFrameDraws: j.actualFrameDraws,
    geometryChecks: j.geometryChecks, preservedHistoricalRecords: j.historicalAssetRecordsUnchanged,
    preservedHistoricalGeometry: j.historicalDrawGeometryUnchanged, preservedFullManifests: j.historicalFullMeleeManifestsUnchanged,
    fullMeleeManifests: j.totalFullMeleeManifests, preservedSummons: j.historicalSummonAssetRecordsAndPngHashesUnchanged,
    gorillaFallbackDraws: j.humanFallbackFrameDraws, janineReusedPresentationDraws: j.janineReusedPresentationDraws },
  scope: 'Actual exposed phases, four native columns and both facings. Beast Boy retains eight T-Rex poses. Janine retains six presentation phases/24 poses; her refused super/finale are explicitly reused accepted intro cells, not additional native poses.'
}));
retain('browser/base-corrections.json', j => ({
  domain: 'base-corrections', observedPassed: j.passed && j.newCharacters === newBases.length
    && j.legacyCharacters === oldBases.length && j.totalFrameDraws === (oldBases.length + newBases.length) * 16 * 2
    && j.historicalGeometryUnchangedDraws === oldBases.length * 16 * 2 && j.adaptedPresentationFallbackDraws === 64,
  metrics: { newCharacters: j.newCharacters, newFrameDraws: j.newFrameDraws, previousCharacters: j.legacyCharacters,
    previousFrameDraws: j.legacyFrameDraws, totalFrameDraws: j.totalFrameDraws,
    janineReusedOrdinaryDraws: j.adaptedPresentationFallbackDraws }, legacyGeometryUnchanged: j.legacyGeometryUnchanged,
  scope: 'Real base renderer, all sixteen cells and both facings. Historical PNG bytes/geometry remain unchanged. Janine reuses accepted presentation art in eight ordinary states; she is excluded from the dedicated base16 count.'
}));
for (const heroId of ['neo','freeman']) retain(`browser/${heroId}-evidence.json`, j => ({
  domain: `${heroId}-45-state-gamecanvas`, observedPassed: j.passed && j.heroId === heroId
    && j.coreDraws === 360 && j.distinctSourceRectangles === 180 && j.ledgeGrips === 8
    && j.flows.core45.passed && j.flows.movementPause.passed && j.flows.super32.passed
    && j.flows.super32.final.hitCount === 1 && j.flows.super32.final.charge === 0
    && JSON.stringify(j.flows.super32.sourceDraws.columns) === '[0,1,2,3]',
  metrics: { frameDraws: j.coreDraws, distinctNativeRectangles: j.distinctSourceRectangles, measuredGrips: j.ledgeGrips,
    nativeSuperDraws: j.flows.super32.sourceDraws.count, superImpacts: j.flows.super32.final.hitCount },
  scope: 'Three real GameCanvas journeys: full45 renderer, keyboard movement/ledge/pause and cold-boot native32 super with one accepted impact. Draw calls, poses and journeys remain separate measurements.'
}));
retain('browser/native-super-runtime.json', j => ({
  domain: 'forty-character-super-runtime', observedPassed: j.passed && j.results.length === 240
    && j.projectileCases.length === 34 && j.results.every(row => row.impactUnique && row.pauseStable && row.renderReadOnly)
    && j.results.filter(row => row.id === 'janine_gb').every(row => row.bodyKind === 'adapted-existing-pose' && row.declaredNativePoses === 24),
  method: j.method, metrics: { characters: [...new Set(j.results.map(row => row.id))], engineCases: j.results.length,
    physicalProjectileCases: j.projectileCases.length, modes: [...new Set(j.results.map(row => row.mode))],
    sides: [...new Set(j.results.map(row => row.side))],
    observedBodyKinds: Object.fromEntries([...new Set(j.results.map(row => row.bodyKind))].map(kind => [kind, j.results.filter(row => row.bodyKind === kind).length])) },
  scope: 'Forty identities in three actual engines and both camps within Chromium, plus34 physical Fighter projectile flows. Janine uses explicitly adapted existing poses for her support; no native super/finale is claimed. Isolated engine fixtures do not claim240 keyboard UI journeys.'
}));
retain('browser/summon-wave10-result.json', j => ({
  domain: 'rpg-native-roster-reinforcements-gamecanvas', observedPassed: j.actualGameCanvasFlows === 16
    && j.distinctSourceCells === 128 && j.nativeCells === 128 && j.opposingNativeCells === 128
    && j.nativePixelMirrorChecks === 256 && j.allEffectsOnce === true && j.rows.length === 16
    && j.offensiveFlows === 12 && j.offensiveHpImpacts === 12 && j.supportFlows === 4
    && j.supportEffectEvents === 4 && j.supportDamageImpacts === 0 && j.supportAlliedHpUnchanged === true,
  metrics: { flows: j.actualGameCanvasFlows, distinctNativeSourceCells: j.distinctSourceCells,
    nativePlayerCells: j.nativeCells, nativeOpponentCells: j.opposingNativeCells, mirrorChecks: j.nativePixelMirrorChecks,
    damagingPartners: new Set(j.rows.filter(row => row.identity.effect === 'damage').map(row => row.identity.performerHeroId)).size,
    supportivePartners: new Set(j.rows.filter(row => row.identity.effect === 'buff').map(row => row.identity.performerHeroId)).size,
    damagingFlows: j.offensiveFlows, acceptedHpImpacts: j.offensiveHpImpacts,
    supportFlows: j.supportFlows, supportEffectEvents: j.supportEffectEvents, supportDamageImpacts: j.supportDamageImpacts,
    supportAlliedHpUnchanged: j.supportAlliedHpUnchanged, allEffectsOnce: j.allEffectsOnce },
  scope: 'Eight real partners in both camps. GameCanvas command controls, confirmation/cancellation/pause, one cost and one effect. Egon/Coach are support effects with no enemy HP loss; sixteen journeys do not mean sixteen damaging attacks.'
}));
retain('stage-browser.json', j => ({
  domain: 'stage-mechanisms', observedPassed: j.mechanisms === 80 && j.universes === 40 && j.modeRenderChecks === 320
    && j.additionalViewportChecks === 240 && j.rows.length === 80 && j.rows.every(row => row.changedChannels > 0
      && row.pausedTimeStable && row.reducedMotionFrozen && row.stageReducedMotionFrozen
      && row.combatLaneClear && row.stageStateUnchanged),
  metrics: { mechanisms: j.mechanisms, universes: j.universes, fourModeDraws: j.modeRenderChecks,
    additionalViewportChecks: j.additionalViewportChecks, worstMirrorAlphaErrorRatio: Math.max(...j.rows.map(row => row.mirrorAlphaErrorRatio)) },
  scope: 'Eighty mechanisms in40 previously ambiance-only roster universes. Real pixels, four modes, extra formats, pause/reduced motion, mirror and clipping. These procedural mechanisms are not official source frames and add no gameplay event.'
}));
const independentReview = proof('independent-review.json', j => ({
  domain: 'independent-runtime-and-projection-review', observedPassed: j.summary.failed === 0 && j.summary.passed === 16
    && j.pending.length === 0 && j.scope.identities === 40 && j.scope.reinforcements === 8
    && j.scope.summonsOnlyPreflight === false && j.checks.every(check => check.status === 'passed'),
  metrics: { domains: j.summary.passed, pending: j.pending.length }, checks: j.checks,
  scope: 'Production Vite SSR, distinct from browser journeys: native aperture projections, accepted contacts, shields/dead/removed targets, move/KO snapshots, physical Fighter launches, support-only partners, fifteen historical native summons and72 legacy bindings.'
}));
const nativeArtifactRetention = proof('browser/evidence.json', j => ({
  observedPassed: j.passed && j.frozen === true && j.nativeRerunPending === false
    && j.finalNativeRerun.passed === true && j.finalNativeRerun.afterFinalProductionFreeze === true
    && j.retainedBaseEvidence.passed === true && j.nativeHeroEntries === native.length
    && j.nativeDrawImageCalls === expectedDraws && j.baseHeroes === oldBases.length + newBases.length
    && j.visualReview.montageFiles.every(path => j.visualReview.reviewed.includes(path))
    && j.visualReview.reviewed.includes(j.visualReview.reusedJanineCapture),
  metrics: { verifiedArtifacts: j.artifacts.length, reviewedPaths: j.visualReview.reviewed.length,
    finalNativeRerun: j.finalNativeRerun.passed, retainedBaseScopeVerification: j.retainedBaseEvidence.passed },
  scope: 'Retained artifact manifest for the two native/base browser domains above. It is not an additional browser journey or an eighth browser domain.'
}));
if (final) assert.deepEqual(missing, [], 'Final aggregation requires every observed evidence file');
const result = { date: '2026-10-23', browser: 'local Chromium',
  status: missing.length ? 'awaiting-retained-evidence' : 'retained-browser-checks-frozen',
  passed: missing.length === 0 && checks.every(check => check.observedPassed) && independentReview?.observedPassed === true && nativeArtifactRetention?.observedPassed === true,
  observedRegistryCounts: { nativeHeroEntries: native.length, complete32: fullNative.length, partialCharacters: partialNative.length,
    partialPoses: partialNative.reduce((sum, asset) => sum + asset.frames, 0), partialDetails,
    dedicatedBases16: oldBases.length + newBases.length, newDedicatedBases16: newBases.length,
    nativeSummonAssets: summons.length, historicalNativeSummonAssets: baseline.summonAssets.length },
  officialSourceFramesImported: 0, source1to1Verified: false, missingEvidence: missing,
  countsAreSeparate: 'Native poses, source rectangles, draw calls, pixel mirrors, engine fixtures and UI journeys are separate observations.',
  observedInternalRuntimeErrors: checks.reduce((sum, check) => sum + check.errors.length, 0),
  externalFailure: 'Only recorded Google Fonts proxy failures are accepted. Internal requests and browser page errors fail aggregation.',
  validationScope: 'Browser observations and a separate independent SSR review. Build and production HTTP distribution are recorded in validation.json.',
  checks, independentReview, nativeArtifactRetention };
fs.writeFileSync(new URL('browser-checks.json', directory), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: result.passed, browserDomains: checks.length,
  independentReviewDomains: independentReview?.metrics.domains || 0, registry: result.observedRegistryCounts, missing }));
