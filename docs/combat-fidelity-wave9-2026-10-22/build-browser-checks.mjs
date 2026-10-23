import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const directory = new URL('./', import.meta.url);
const proof = (path, extract) => {
  const bytes = fs.readFileSync(new URL(path, directory)), data = JSON.parse(bytes);
  const errors = data.pageErrors || data.errors || [];
  assert.deepEqual(errors, [], path);
  for (const request of data.failedRequests || []) assert.match(request.url, /^https:\/\/fonts\.googleapis\.com\//, `${path}: internal request failed`);
  const observed = extract(data); assert.equal(observed.observedPassed, true, path);
  return { path, sha256: createHash('sha256').update(bytes).digest('hex'), ...observed,
    freezeStatus: 'frozen-observation', errors, externalFontRequestFailures: (data.failedRequests || []).length,
    source1to1Verified: false };
};

const checks = [
  proof('browser/native-presentations.json', j => ({ domain: 'native-presentations', observedPassed: j.passed
    && j.characters === 117 && j.full32Count === 116 && j.partialCount === 1 && j.actualFrameDraws === 7440
    && j.historicalAssetRecordsUnchanged === 97 && j.historicalDrawGeometryUnchanged === 6160,
    metrics: { registeredCharacters: j.characters, complete32: j.full32Count, partialCharacters: j.partialCount,
      partialPoses: j.partialPoses, phases: j.phases, nativeFrameDraws: j.actualFrameDraws, geometryChecks: j.geometryChecks,
      preservedHistoricalRecords: j.historicalAssetRecordsUnchanged, preservedHistoricalGeometry: j.historicalDrawGeometryUnchanged,
      preservedFullManifests: j.historicalFullMeleeManifestsUnchanged, preservedSummons: j.historicalSummonAssetRecordsAndPngHashesUnchanged,
      rejectedHumanPoses: j.rejectedHumanPresentationPoses, gorillaFallbackDraws: j.humanFallbackFrameDraws },
    scope: 'All actual phases, four native columns and both facings. Partial Beast Boy remains eight T-Rex poses; rejected human drawings remain excluded.' })),
  proof('browser/base-corrections.json', j => ({ domain: 'base-corrections', observedPassed: j.passed && j.newCharacters === 20
    && j.legacyCharacters === 44 && j.totalFrameDraws === 2048 && j.historicalGeometryUnchangedDraws === 1408,
    metrics: { newCharacters: j.newCharacters, newFrameDraws: j.newFrameDraws, previousCharacters: j.legacyCharacters,
      previousFrameDraws: j.legacyFrameDraws, totalFrameDraws: j.totalFrameDraws, immutableActors: j.immutableActors },
    legacyGeometryUnchanged: j.legacyGeometryUnchanged,
    scope: 'Native cells through the real renderer, common baseline and authored row stature. All44 previous bases retain their PNG bytes and geometry.' })),
  proof('browser/chris-evidence.json', j => ({ domain: 'chris45-state-gamecanvas', observedPassed: j.passed
    && j.coreDraws === 360 && j.distinctSourceRectangles === 180 && j.ledgeGrips === 8 && j.super.hitCount === 1
    && j.super.meterBefore === 100 && j.super.meterAfter === 0,
    metrics: { frameDraws: j.coreDraws, distinctNativeRectangles: j.distinctSourceRectangles, measuredGrips: j.ledgeGrips,
      nativeSuperDraws: j.super.native32Draws, superImpacts: j.super.hitCount, pauseMs: j.pauseMs },
    movementStatesFourColumns: j.movementStatesFourColumns,
    scope: 'Three real GameCanvas runs:45-state core renderer, measured ledges and keyboard movement/pause, then a cold-boot L super using its native32 sheet and external orbital strike.' })),
  proof('browser/native-super-runtime.json', j => ({ domain: 'twenty-character-super-runtime', observedPassed: j.passed
    && j.results.length === 120 && j.projectileCases.length === 24
    && j.results.every(row => row.impactUnique && row.pauseStable && row.renderReadOnly),
    method: j.method, metrics: { characters: [...new Set(j.results.map(row => row.id))], engineCases: j.results.length,
      physicalProjectileCases: j.projectileCases.length, modes: [...new Set(j.results.map(row => row.mode))],
      sides: [...new Set(j.results.map(row => row.side))] },
    scope: 'Twenty identities in three actual engines and both camps, plus24 physical Fighter projectile flows. These isolated engine fixtures do not claim120 keyboard UI journeys.' })),
  proof('browser/summon-wave9-result.json', j => ({ domain: 'rpg-native-roster-reinforcements-gamecanvas',
    observedPassed: j.actualGameCanvasFlows === 8 && j.nativeCells === 64 && j.opposingNativeCells === 64
      && j.nativePixelMirrorChecks === 128 && j.oneImpactEach,
    metrics: { flows: j.actualGameCanvasFlows, nativePlayerCells: j.nativeCells, nativeOpponentCells: j.opposingNativeCells,
      mirrorChecks: j.nativePixelMirrorChecks },
    scope: 'Marcus/Dom, Shepard/Garrus, Motoko/Batou and Chris/Leon, both camps. Actual command controls, cancellation, pause, one cost and one accepted impact. The earlier interrupted HMR attempt is archived separately.' })),
  proof('stage-browser.json', j => ({ domain: 'stage-mechanisms', observedPassed: j.mechanisms === 40 && j.rows.every(row =>
    row.changedChannels > 0 && row.pausedTimeStable && row.reducedMotionFrozen && row.stageReducedMotionFrozen
      && row.combatLaneClear && row.stageStateUnchanged),
    metrics: { mechanisms: j.mechanisms, universes: j.universes, fourModeDraws: j.modeRenderChecks,
      additionalViewportChecks: j.additionalViewportChecks,
      worstMirrorAlphaErrorRatio: Math.max(...j.rows.map(row => row.mirrorAlphaErrorRatio)) },
    scope: 'Forty mechanisms in20 previously unconfigured worlds:four modes, extra formats, pause/reduced motion, mirror and combat-lane clipping. No new gameplay events or official source frames.' }))
];
const independentReview = proof('independent-review.json', j => ({ domain: 'independent-runtime-and-projection-review',
  observedPassed: j.summary.passed === 12 && j.summary.failed === 0 && j.pending.length === 0
    && j.checks.every(check => check.status === 'passed'),
  metrics: { domains: j.summary.passed, pending: j.pending.length }, checks: j.checks,
  scope: 'Real supers, native barrel projection, accepted contact, shields/dead/removed targets, KO/move stability, no post-impact travel, physical Fighter launches and preservation of the11 older summons. Reproduced failures remain in independent-review-before-fix.json.' }));
const result = { date: '2026-10-22', browser: 'local Chromium', status: 'retained-browser-checks-frozen',
  passed: checks.every(check => check.observedPassed) && independentReview.observedPassed,
  officialSourceFramesImported: 0, source1to1Verified: false,
  countsAreSeparate: 'Native poses, source rectangles, draw calls, pixel mirrors, engine fixtures and UI journeys are distinct measurements.',
  observedInternalRuntimeErrors: checks.reduce((n, check) => n + check.errors.length, 0),
  externalFailure: 'Some runs record Google Fonts blocked by the session proxy. Internal asset failures and browser page errors are rejected.',
  validationScope: 'Browser evidence and independent runtime review. Full build and production HTTP distribution are recorded separately in validation.json.',
  checks, independentReview };
fs.writeFileSync(new URL('browser-checks.json', directory), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: result.passed, browserDomains: checks.length,
  independentReviewDomains: independentReview.metrics.domains, runtimeErrors: result.observedInternalRuntimeErrors }));
