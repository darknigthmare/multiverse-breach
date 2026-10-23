import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const directory = new URL('./', import.meta.url);
const proof = (path, extract) => {
  const bytes = fs.readFileSync(new URL(path, directory)), data = JSON.parse(bytes);
  const errors = data.pageErrors || data.errors || [];
  assert.deepEqual(errors, [], path);
  const requests = data.failedRequests || [];
  for (const request of requests) assert.match(request.url, /^https:\/\/fonts\.googleapis\.com\//, `${path}: internal or unexpected request failure`);
  const observed = extract(data); assert.equal(observed.observedPassed, true, path);
  return { path, sha256: createHash('sha256').update(bytes).digest('hex'), ...observed,
    freezeStatus: 'frozen-observation', errors, externalFontRequestFailures: requests.length,
    consoleFailureRecording: data.consoleErrors ? 'recorded-in-linked-proof' : 'not-recorded-in-this-proof', source1to1Verified: false };
};
const checks = [
  proof('browser/native-presentations.json', j => ({ domain: 'native-presentations', observedPassed: j.passed,
    metrics: { registeredCharacters: j.characters, complete32: j.full32Count, partialCharacters: j.partialCount, partialPoses: j.partialPoses,
      phases: j.phases, nativeFrameDraws: j.actualFrameDraws, geometryChecks: j.geometryChecks, preservedHistoricalRecords: j.historicalAssetRecordsUnchanged,
      preservedHistoricalGeometry: j.historicalDrawGeometryUnchanged, rejectedHumanPoses: j.rejectedHumanPresentationPoses, gorillaFallbackDraws: j.humanFallbackFrameDraws },
    missingNewNativeHeroIds: j.missingNativeHeroIds, scope: 'All registered phases and four real columns, both facings. Beast Boy exposes only eight T-Rex cells; twenty-four rejected human drawings are absent.' })),
  proof('browser/base-corrections.json', j => ({ domain: 'base-corrections', observedPassed: j.passed,
    metrics: { newCharacters: j.newCharacters, newFrameDraws: j.newFrameDraws, previousCharacters: j.legacyCharacters,
      previousFrameDraws: j.legacyFrameDraws, totalFrameDraws: j.totalFrameDraws, immutableActors: j.immutableActors },
    legacyGeometryUnchanged: j.legacyGeometryUnchanged, scope: 'Actual renderer cells, baseline and authored stature, including real green gorilla and differentiated Meshi proportions.' })),
  proof('browser/kiryu-evidence.json', j => ({ domain: 'kiryu45-state-gamecanvas', observedPassed: j.passed,
    metrics: { states: j.core.states, nativePoses: j.core.nativePoses, frameDraws: j.core.actualDrawImageCalls, gripCalls: j.core.gripCalls,
      acceptedSuperImpacts: j.super.acceptedImpacts, superDraws: j.super.draws.count },
    realKeys: j.movement.realKeys, pauseUnchanged: j.movement.pauseUnchanged,
    scope: 'Core renderer, measured ledges, actual keyboard movement/pause and cold-boot super. Component reports are not counted as extra assets.' })),
  proof('browser/native-super-runtime.json', j => ({ domain: 'twenty-character-super-runtime',
    observedPassed: j.passed && j.results.length === 120 && j.results.every(row => row.impactUnique && row.pauseStable && row.renderReadOnly),
    method: j.method, metrics: { characterIds: [...new Set(j.results.map(row => row.id))], flows: j.results.length,
      modes: [...new Set(j.results.map(row => row.mode))], sides: [...new Set(j.results.map(row => row.side))] },
    beastBoyPartial: j.beastBoyPartial,
    scope: 'Twenty identities in three actual engine modes and both camps. Supports, costs, impact, pause and drawing are checked separately from complete animation coverage.' })),
  proof('browser/summon-wave8-result.json', j => ({ domain: 'rpg-native-roster-reinforcements-gamecanvas',
    observedPassed: j.actualGameCanvasFlows === 8 && j.nativeCells === 64 && j.opposingNativeCells === 64 && j.nativePixelMirrorChecks === 128 && j.oneImpactEach,
    metrics: { flows: j.actualGameCanvasFlows, nativePlayerCells: j.nativeCells, nativeOpponentCells: j.opposingNativeCells, mirrorChecks: j.nativePixelMirrorChecks },
    scope: 'Robin/Cyborg, Majima/Kiryu, Blade Wolf/Raiden and Marcille/Laios in both camps, real command controls, cancellation, pause and one impact.' })),
  proof('stage-browser.json', j => ({ domain: 'stage-mechanisms',
    observedPassed: j.mechanisms === 40 && j.rows.every(row => row.changedChannels > 0 && row.pausedTimeStable && row.reducedMotionFrozen && row.stageReducedMotionFrozen && row.combatLaneClear && row.stageStateUnchanged),
    metrics: { mechanisms: j.mechanisms, universes: j.universes, fourModeDraws: j.modeRenderChecks, additionalViewportChecks: j.additionalViewportChecks,
      worstMirrorAlphaErrorRatio: Math.max(...j.rows.map(row => row.mirrorAlphaErrorRatio)) },
    scope: 'Forty new scene mechanisms, four modes, additional formats, pause/reduced motion, actual Canvas mirror and clipping; no gameplay effect or official frame.' }))
];
const independentReview = proof('independent-review.json', j => ({ domain: 'independent-code-and-projection-review', observedPassed: j.passed,
  metrics: { cases: j.checks.reduce((n, check) => n + check.cases, 0), domains: j.checks.length, fixedDefects: j.fixedDefects.length }, scope: j.scope }));
const result = { date: '2026-10-20', browser: 'local Chromium', status: 'retained-browser-checks-frozen',
  passed: checks.every(check => check.observedPassed) && independentReview.observedPassed,
  officialSourceFramesImported: 0, source1to1Verified: false,
  countsAreSeparate: 'Draws, cells, native poses, mirror comparisons, code replay and engine/control flows are distinct measurements. Shared assets and component evidence are counted once.',
  observedInternalRuntimeErrors: checks.reduce((n, check) => n + check.errors.length, 0),
  observedExternalFailure: 'Some proofs record Google Fonts CSS blocked by the session proxy; internal sprite and runtime failures are rejected.',
  validationScope: 'Retained browser and independent review evidence. Complete build and production HTTP validation are recorded separately in validation.json.',
  checks, independentReview };
fs.writeFileSync(new URL('browser-checks.json', directory), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: result.passed, browserDomains: checks.length, independentReviewDomains: independentReview.metrics.domains, runtimeErrors: result.observedInternalRuntimeErrors }));
