// Aggregate retained observations; never runs a browser or substitutes them for
// source-frame fidelity. Use --final only after the owners freeze the harnesses.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const directory = new URL('./', import.meta.url);
const final = process.argv.includes('--final');
const proof = (path, extract, pending = false) => {
  const bytes = fs.readFileSync(new URL(path, directory)), data = JSON.parse(bytes);
  const errors = data.pageErrors || data.errors || [];
  assert.deepEqual(errors, [], path);
  const requests = data.failedRequests || [];
  for (const request of requests) assert.match(request.url, /^https:\/\/fonts\.googleapis\.com\//, `${path}: unexpected failed request`);
  const observed = extract(data);
  assert.equal(observed.observedPassed, true, path);
  return { path, sha256: createHash('sha256').update(bytes).digest('hex'), ...observed,
    freezeStatus: pending && !final ? 'awaiting-author-harness-freeze' : 'frozen-observation',
    errors, externalFontRequestFailures: requests.length,
    consoleFailureRecording: data.consoleErrors ? 'recorded-in-linked-proof' : 'not-recorded-in-this-proof',
    source1to1Verified: false };
};
const checks = [
  proof('browser/native-presentations.json', j => ({
    domain: 'native32-presentations', observedPassed: j.passed,
    metrics: { characters: j.characters, phases: j.phases, actualFrameDraws: j.actualFrameDraws, geometryChecks: j.geometryChecks,
      immutableActors: j.immutableActors, rejectedCrossedIdentities: j.rejectedCrossedIdentities, fixedProgressFrames: j.fixedProgressFrames },
    scope: 'All declared delivered presentation atlases, eight phases, four columns and both facings; not45-state coverage.'
  }), true),
  proof('browser/base-corrections.json', j => ({
    domain: 'base16-corrections', observedPassed: j.passed,
    metrics: { newCharacters: j.newCharacters, newFrameDraws: j.newFrameDraws, previousCharacters: j.legacyCharacters,
      previousFrameDraws: j.legacyFrameDraws, totalFrameDraws: j.totalFrameDraws, immutableActors: j.immutableActors },
    missingNewBaseHeroIds: j.missingNewBaseHeroIds, legacyGeometryUnchanged: j.legacyGeometryUnchanged,
    scope: 'New and historical base poses, both facings, actual renderer geometry. The refused Leia base is absent.'
  }), true),
  proof('browser/ragna-evidence.json', j => ({
    domain: 'ragna45-state-gamecanvas', observedPassed: j.passed,
    metrics: { states: j.core.states, nativePoses: j.core.nativePoses, actualFrameDraws: j.core.actualDrawImageCalls,
      gripCalls: j.core.gripCalls, superDraws: j.super.draws.count, acceptedSuperImpacts: j.super.acceptedImpacts },
    realKeys: j.movement.realKeys, pauseUnchanged: j.movement.pauseUnchanged, coldSuperBoot: j.super.coldBoot,
    scope: 'Consolidated Ragna core, physical ledge grips, actual keyboard movement/pause and cold-boot Carnage Scissors; its three component reports are not summed a second time.'
  })),
  proof('browser/fighter-projectiles-result.json', j => ({
    domain: 'fighter-real-projectile-gamecanvas', observedPassed: j.passed && j.results.every(r => r.passed && r.hits === 1 && r.impactEvents === 1),
    metrics: { flows: j.results.length, heroIds: [...new Set(j.results.map(r => r.id))],
      acceptedImpacts: j.results.reduce((n, r) => n + r.impactEvents, 0),
      actualBodyDrawFrames: j.results.reduce((n, r) => n + r.bodyDrawFrames, 0) },
    scope: 'Noel, Han, Leia and May in P1/P2 FighterMode, actual R/O supers, physical projectile flight/impact, pause and expiry. Distinct from RPG summons.'
  })),
  proof('browser/summon-wave7-result.json', j => ({
    domain: 'rpg-native16-entities-gamecanvas', observedPassed: j.actualGameCanvasFlows === 3 && j.nativeCells === 48 && j.opposingNativeCells === 48 && j.nativePixelMirrorChecks === 48 && j.oneImpactEach,
    metrics: { flows: j.actualGameCanvasFlows, nativePlayerCells: j.nativeCells, nativeOpponentCells: j.opposingNativeCells, exactRgbaMirrorChecks: j.nativePixelMirrorChecks,
      acceptedImpacts: j.rows.reduce((n, r) => n + r.native.hpChanges.length, 0) },
    scope: 'Aerith/Bahamut, May/Yamada and Parasoul/BlackEgrets; button, free cancel, U, target confirmation, real sessionPaused and used-command lock. Recaptured after the native Bahamut overlay fix.'
  })),
  proof('stage-browser.json', j => ({
    domain: 'stage-scene-mechanisms', observedPassed: j.mechanisms === 24 && j.rows.every(r => r.changedChannels > 0 && r.pausedTimeStable && r.reducedMotionFrozen && r.stageReducedMotionFrozen && r.combatLaneClear && r.stageStateUnchanged),
    metrics: { mechanisms: j.mechanisms, universes: j.universes, fourModeDraws: j.modeRenderChecks, additionalViewportChecks: j.additionalViewportChecks,
      worstMirrorAlphaErrorRatio: Math.max(...j.rows.map(r => r.mirrorAlphaErrorRatio)) },
    scope: '24new procedural scene mechanisms, four modes, three additional aspect ratios, simulation pause, reduced motion, actual mirrored Canvas and safe clipping; no official frames.'
  }))
];
const result = {
  date: '2026-10-20', browser: 'local Chromium',
  status: final ? 'retained-browser-checks-frozen' : 'observations-collected-awaiting-final-harness-freeze',
  passed: final ? checks.every(check => check.observedPassed) : null,
  countsAreSeparate: 'Draw calls, cells, mirror comparisons, poses and flows are separate measurements; the same native files or Ragna component reports are not summed as extra delivered images.',
  officialSourceFramesImported: 0, source1to1Verified: false,
  observedInternalRuntimeErrors: checks.reduce((n, check) => n + check.errors.length, 0),
  observedExternalFailure: 'Some linked harnesses record the Google Fonts CSS request blocked by the session proxy. This is retained as an observed external request failure, not suppressed or presented as a successful font load.',
  validationScope: 'Retained browser observations only. Compilation and the complete automated suite are recorded separately by the integration owner.',
  checks
};
fs.writeFileSync(new URL('browser-checks.json', directory), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, domains: checks.length, passed: result.passed, runtimeErrors: result.observedInternalRuntimeErrors }));
