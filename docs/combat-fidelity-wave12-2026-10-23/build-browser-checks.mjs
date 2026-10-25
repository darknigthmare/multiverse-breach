import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { getCharacterAnimationAssets } from '../../src/game/combat/characterAnimationCatalog.js';
import { getSummonAnimationAssets } from '../../src/game/combat/summonAnimationCatalog.js';

// This collector reads retained observations. It never opens a browser, runs a
// game fixture, creates artwork, or turns a missing/preliminary report into QA.
const directory = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(directory, '../..');
const prefix = path.relative(project, directory).split(path.sep).join('/');
const final = process.argv.includes('--final');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(path.resolve(project, file));
const json = file => JSON.parse(read(file));
const local = file => `${prefix}/${file}`;
const exists = file => fs.existsSync(path.resolve(project, file));
const missing = [];
const checks = [];
const verifiedFiles = new Map();
const permittedRiftTransitions = [];
const timestamp = (value, label) => {
  const result = Date.parse(value);
  assert.ok(Number.isFinite(result), `${label}: missing/invalid timestamp`);
  return result;
};

function fingerprint(file) {
  const bytes = read(file);
  return { path: file, bytes: bytes.length, sha256: digest(bytes) };
}
function verifyFile(record, label) {
  assert.equal(typeof record?.path, 'string', `${label}: missing path`);
  assert.match(record.sha256 || '', /^[a-f0-9]{64}$/, `${label}: missing SHA256`);
  const actual = fingerprint(record.path);
  assert.equal(actual.sha256, record.sha256, `${label}: retained bytes changed: ${record.path}`);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, `${label}: byte count changed`);
  verifiedFiles.set(record.path, actual);
  return actual;
}
function verifyInput(record, report, label) {
  const actual = fingerprint(record.path);
  if (actual.sha256 === record.sha256) return verifyFile(record, label);
  assert.equal(record.path, 'src/game/riftDossierAssets.json', `${label}: observed production input changed: ${record.path}`);
  const refresh = json(local('rift-refresh/result.json'));
  const gate = json(local('rift-refresh/allow-final-writes.json'));
  assert.equal(refresh.success, true, 'Rift transition requires a completed refresh');
  assert.deepEqual(refresh.finalWriteGate, gate, 'Rift result must retain the exact final write gate');
  for (const key of ['authorized', 'productionFrozen', 'allBrowserWindowsClosed', 'rootFinalSignalReceived']) assert.equal(gate[key], true, `Rift gate ${key}`);
  assert.equal(refresh.generatedSha256Before[record.path], record.sha256, 'Rift observed SHA must equal the recorded pre-refresh SHA');
  assert.equal(refresh.generatedSha256After[record.path], actual.sha256, 'Rift current SHA must equal the recorded post-refresh SHA');
  const step3 = refresh.steps.find(step => step.id.startsWith('03-'));
  const step2 = refresh.steps.find(step => step.id.startsWith('02-'));
  assert.ok(step3 && step2, 'Rift transition requires steps02/03');
  const finished = timestamp(report.finishedAt || report.execution?.finishedAt, label + ' finish');
  const gateTime = timestamp(gate.createdAt, 'Rift gate');
  assert.ok(finished <= gateTime && gateTime <= timestamp(step3.startedAt, 'Rift step03'), 'Observed flow must finish before the final write barrier and step03');
  assert.ok(timestamp(step2.finishedAt, 'Rift step02') <= gateTime, 'Rift gate must follow step02');
  const transition = { path: record.path, observedSha256: record.sha256, currentSha256: actual.sha256, reportFinishedAt: report.finishedAt || report.execution?.finishedAt, gateCreatedAt: gate.createdAt };
  permittedRiftTransitions.push(transition);
  verifiedFiles.set(record.path, actual);
  return actual;
}
function verifyInputList(records, report, label) {
  assert.ok(Array.isArray(records) && records.length, `${label}: no observed input hashes`);
  assert.equal(new Set(records.map(record => record.path)).size, records.length, `${label}: duplicate inputs`);
  records.forEach(record => verifyInput(record, report, label));
}
function verifyInputMap(records, report, label) {
  assert.ok(records && Object.keys(records).length, `${label}: no observed input map`);
  verifyInputList(Object.entries(records).map(([path, sha256]) => ({ path, sha256 })), report, label);
}
function verifyDiagnostics(report, label) {
  const errors = [...(report.pageErrors || []), ...(report.errors || [])];
  assert.deepEqual(errors, [], label + ': runtime errors');
  for (const request of report.failedRequests || []) {
    assert.match(request.url || '', /^https:\/\/fonts\.googleapis\.com\//, label + ': internal request failed');
    assert.equal(request.error, 'net::ERR_TUNNEL_CONNECTION_FAILED', label + ': unexpected request failure');
  }
  if (report.consoleErrors) assert.equal(report.consoleErrors.length, (report.failedRequests || []).length, label + ': unexplained console errors');
  return { errors, externalFontRequestFailures: (report.failedRequests || []).length };
}
function verifyTimes(report, label, closed = false) {
  const start = timestamp(report.startedAt, label + ' start');
  const finish = timestamp(report.finishedAt, label + ' finish');
  assert.ok(start <= finish, label + ': reversed execution interval');
  if (closed) {
    assert.equal(report.allBrowserWindowsClosed, true, label + ': browser was not observed closed');
    const close = timestamp(report.browserClosedAt, label + ' browser close');
    assert.ok(start <= close && close <= finish, label + ': invalid browser closure order');
  }
}
function verifyHarness(report, fallback, label) {
  verifyFile({ path: report.harness || report.validator || fallback, sha256: report.harnessSha256 || report.validatorSha256 }, label + ' harness');
}
function verifyArtifacts(report, label) {
  assert.ok(Array.isArray(report.artifacts) && report.artifacts.length, label + ': no retained artifact hashes');
  report.artifacts.forEach(record => verifyFile(record, label + ' artifact'));
}
function retain(file, domain, examine) {
  const reportPath = local(file);
  if (!exists(reportPath)) { missing.push(file); return null; }
  const report = json(reportPath);
  assert.equal(report.passed, true, file + ': not an observed passing result');
  const diagnostics = verifyDiagnostics(report, file);
  const observed = examine(report);
  const item = { domain, ...fingerprint(reportPath), observedPassed: true, freezeStatus: 'retained-observation', ...diagnostics, source1to1Verified: false, ...observed };
  checks.push(item);
  return item;
}

const baseline = json(local('runtime-baseline.json'));
const native = getCharacterAnimationAssets();
const summons = getSummonAnimationAssets();
const fullNative = native.filter(asset => Object.keys(asset.phases).length === 8);
const partialNative = native.filter(asset => Object.keys(asset.phases).length < 8);
const partialDetails = partialNative.map(asset => ({ heroId: asset.heroId, poses: asset.frames, phases: Object.keys(asset.phases) }));
const newBases = ['A', 'B', 'C', 'D'].flatMap(part => json(`src/game/combat/characterSpriteCorrectionsWave12Part${part}.generated.json`).entries);
const newSummons = json('src/game/combat/summonAnimationsWave12.generated.json').entries;
const nativeDraws = native.reduce((sum, asset) => sum + Object.keys(asset.phases).length * 8, 0);
const historicalNativeDraws = baseline.characterAssets.reduce((sum, asset) => sum + Object.keys(asset.phases).length * 8, 0);
assert.deepEqual([native.length, fullNative.length, partialNative.length, newBases.length, baseline.baseAssets.length, newSummons.length], [233, 231, 2, 39, 140, 7]);
assert.equal(new Set(native.map(asset => asset.heroId)).size, native.length);
assert.equal(new Set([...baseline.baseAssets, ...newBases].map(asset => asset.heroId)).size, 179);
for (const asset of [...native, ...summons, ...baseline.baseAssets, ...newBases]) verifyFile({ path: 'public' + asset.sheet, sha256: asset.sha256 }, 'registered PNG');
for (const record of baseline.historicalRegistryFiles) verifyFile(record, 'historical registry');
for (const record of baseline.historicalPngFiles) verifyFile({ path: 'public' + record.sheet, sha256: record.sha256 }, 'historical PNG');

function presentationIntegrity(report, name) {
  verifyTimes(report, name);
  if (report.allBrowserWindowsClosed === true) verifyTimes(report, name, true);
  else {
    // These two harnesses emitted their reports inside try and then closed
    // Chromium in finally. A separate observed process-close receipt preserves
    // that chronology without rewriting the completed browser reports.
    const closurePath = local('browser/presentation-browser-closure.json');
    const closure = json(closurePath);
    assert.equal(closure.passed, true);
    assert.equal(closure.allBrowserWindowsClosed, true);
    assert.ok(timestamp(report.finishedAt, name + ' finish') <= timestamp(closure.observedAt, name + ' closure'));
    const receipt = closure.reports.find(item => item.path === local(`browser/${name}.json`));
    assert.ok(receipt, name + ': missing observed process closure');
    assert.equal(receipt.exitCode, 0);
    verifyFile(receipt, name + ' process-close report');
    assert.equal(receipt.observedExecExitCode, 0);
    assert.equal(receipt.browserCloseAwaitedByFinally, true);
    verifyFile({ path: receipt.harnessPath, sha256: receipt.harnessSha256 }, name + ' closed harness');
    verifyFile(receipt.log, name + ' process log');
    assert.deepEqual(closure.liveBrowserProcesses, []);
    assert.deepEqual(closure.liveHarnessProcesses, []);
    if (exists(local('rift-refresh/allow-final-writes.json'))) assert.ok(timestamp(closure.observedAt, name + ' closure') <= timestamp(json(local('rift-refresh/allow-final-writes.json')).createdAt, 'Rift gate'), 'Presentation closure observation must precede Rift final writes');
    verifiedFiles.set(closurePath, fingerprint(closurePath));
  }
  verifyHarness(report, local(`browser/${name}.mjs`), name);
  const before = json(local(`browser/${name}-inputs-before.json`));
  const after = json(local(`browser/${name}-inputs-after.json`));
  assert.deepEqual(after, before, name + ': inputs changed during execution');
  assert.equal(before.sha256, digest(Buffer.from(JSON.stringify(before.hashes))), name + ': invalid snapshot digest');
  assert.equal(report.productionInputsUnchanged, true);
  assert.equal(report.productionInputCount, Object.keys(before.hashes).length);
  assert.equal(report.productionInputSha256, before.sha256);
  verifyFile({ path: report.productionFreezePath, sha256: report.productionFreezeSha256 }, name + ' production freeze');
  const freeze = json(report.productionFreezePath);
  assert.equal(freeze.productionFrozen, true);
  assert.equal(report.productionFreezeFileCount, Object.keys(freeze.files).length);
  for (const [file, hash] of Object.entries(freeze.files)) assert.equal(before.hashes[file], hash, name + ': snapshot omitted a frozen file');
  verifyInputMap(before.hashes, report, name);
  verifyArtifacts(report, name);
}
retain('browser/native-presentations.json', 'native-presentations', report => {
  presentationIntegrity(report, 'native-presentations');
  assert.deepEqual([report.characters, report.full32Count, report.partialCount, report.partialPoses], [native.length, fullNative.length, partialNative.length, partialNative.reduce((sum, asset) => sum + asset.frames, 0)]);
  assert.deepEqual([report.actualFrameDraws, report.geometryChecks, report.fixedProgressFrames], [nativeDraws, nativeDraws, nativeDraws]);
  assert.equal(report.historicalAssetRecordsUnchanged, baseline.characterAssets.length);
  assert.equal(report.historicalDrawGeometryUnchanged, historicalNativeDraws);
  assert.deepEqual([report.newCharacters, report.newFrameDraws, report.mortyReusedPresentationDraws, report.janineReusedPresentationDraws, report.humanFallbackFrameDraws], [39, 2496, 64, 16, 48]);
  assert.equal(report.realDrawImageCalls, nativeDraws + 128);
  assert.equal(report.captures.length, 39);
  return { metrics: { characters: report.characters, full32: report.full32Count, partialCharacters: report.partialCount, partialPoses: report.partialPoses, nativeFrameDraws: report.actualFrameDraws, actualDrawImageCalls: report.realDrawImageCalls, newNativeFrameDraws: report.newFrameDraws, historicalGeometryDraws: report.historicalDrawGeometryUnchanged, mortyReuseDraws: report.mortyReusedPresentationDraws }, scope: 'Controlled real renderer: exposed native phases, four columns and both facings. Morty, Janine and old refused-pose reuses are separate draws, never new native deliveries.' };
});
retain('browser/base-corrections.json', 'base-corrections', report => {
  presentationIntegrity(report, 'base-corrections');
  assert.deepEqual([report.newCharacters, report.newFrameDraws, report.legacyCharacters, report.legacyFrameDraws, report.totalFrameDraws], [39, 1248, 140, 4480, 5728]);
  assert.equal(report.historicalGeometryUnchangedDraws, 4480);
  assert.equal(report.historicalBaseRecordsUnchanged, 140);
  assert.equal(report.historicalCompleteBaseRegistryHashesUnchanged, baseline.baseRegistryFiles.length);
  assert.deepEqual([report.mortyReusedBaseDraws, report.adaptedPresentationFallbackDraws, report.refusedLegacyFallbackDraws, report.quietSupportDraws, report.realDrawImageCalls], [128, 64, 384, 48, 6352]);
  assert.equal(report.captures.length, 39);
  return { metrics: { newCharacters: report.newCharacters, historicalCharacters: report.legacyCharacters, dedicatedBaseFrameDraws: report.totalFrameDraws, actualDrawImageCalls: report.realDrawImageCalls, historicalGeometryDraws: report.historicalGeometryUnchangedDraws, mortyReuseDraws: report.mortyReusedBaseDraws }, scope: 'Controlled real base renderer: 179 dedicated bases, sixteen cells and two facings. All adapted ordinary/support reuses remain separate.' };
});
retain('browser/native-super-runtime.json', 'forty-character-super-runtime', report => {
  verifyTimes(report, 'native super runtime', true);
  verifyHarness(report, local('browser/native-super-runtime.browser.mjs'), 'native super runtime');
  verifyInputList(report.inputHashes, report, 'native super runtime');
  verifyArtifacts(report, 'native super runtime');
  assert.equal(report.results.length, 240);
  assert.equal(new Set(report.results.map(row => row.id)).size, 40);
  assert.ok(report.results.every(row => row.impactUnique && row.pauseStable && row.renderReadOnly));
  const legacy = report.results.filter(row => row.id === 'morty');
  const current = report.results.filter(row => row.id !== 'morty');
  assert.equal(legacy.length, 6);
  assert.ok(legacy.every(row => row.bodyKind === 'legacy-fallback' && row.declaredNativePoses === 0));
  assert.equal(current.length, 234);
  assert.ok(current.every(row => row.bodyKind === 'native32'));
  assert.equal(report.projectileCases.length, 28);
  assert.ok(report.projectileCases.every(row => row.nativeSpawn.kind === 'measured-native' && row.acceptedDamageEvents === 1 && row.pauseStable && row.realFlightCoordinates && row.movedDeadTargetPreservesContact));
  return { method: report.method, metrics: { identities: 40, authoritativeEngineFixtures: 240, nativeFixtures: 234, retainedMortyFixtures: 6, physicalProjectileFlights: 28, keyboardUiJourneysClaimed: 0 }, scope: 'Three actual engines and both camps in Chromium, authoritative stepping and real PNG draws; 28 physical Fighter flights. These 240 fixtures are not keyboard UI journeys.' };
});
retain('isaac-sources/browser/isaac-evidence.json', 'isaac-native-motion', report => {
  assert.equal(report.heroId, 'isaac');
  assert.equal(report.source1to1Verified, false);
  assert.deepEqual(report.counts, { flows: 4, states: 45, nativePoses: 180, coreDraws: 360, controlledGripDraws: 8, physicalLedgeCases: 20, physicalGripDraws: 32 });
  const execution = report.execution;
  verifyTimes(execution, 'Isaac runner');
  assert.equal(execution.resourcesUnchangedDuringRun, true);
  assert.deepEqual(execution.resourcesBefore, execution.resourcesAfter);
  assert.deepEqual(report.resources, execution.resourcesAfter);
  verifyFile(report.productionFreeze, 'Isaac production freeze');
  report.resources.forEach(record => verifyInput(record, report, 'Isaac resource'));
  assert.equal(execution.commands.length, 4);
  assert.ok(execution.commands.every(command => command.exitCode === 0));
  assert.equal(report.flows.length, 4);
  let fontFailures = 0;
  for (const flow of report.flows) {
    [flow.harness, flow.report, ...flow.captures, ...flow.traces].forEach(record => verifyFile(record, 'Isaac ' + flow.id));
    const observed = json(flow.report.path);
    assert.equal(observed.passed, true);
    fontFailures += verifyDiagnostics(observed, 'Isaac ' + flow.id).externalFontRequestFailures;
  }
  assert.equal(report.flows.filter(flow => flow.type.startsWith('real-gamecanvas-keyboard')).length, 2);
  return { metrics: { ...report.counts, gameCanvasKeyboardJourneys: 2, controlledRendererOrEngineSequences: 2 }, externalFontRequestFailures: fontFailures, flows: report.flows.map(({ id, type, summary }) => ({ id, type, summary })), scope: report.scope, limitations: report.limitations };
});
retain('summon-runtime-result.json', 'rpg-reinforcement-engine', report => {
  verifyTimes(report, 'RPG engine');
  verifyHarness(report, null, 'RPG engine');
  assert.equal(report.preliminary, false);
  assert.equal(report.finalProductionFreezeClaimed, true);
  assert.equal(report.productionInputsStableDuringRun, true);
  assert.deepEqual(report.sourceHashesBefore, report.sourceHashesAfter);
  verifyInputMap(report.sourceHashesBefore, report, 'RPG engine');
  assert.deepEqual([report.actualSsrEngineFlows, report.offensiveFlows, report.guardFlows, report.shieldCases, report.deadTargetCases, report.removedTargetCases, report.callerAbortCases], [14, 12, 2, 12, 12, 12, 28]);
  assert.deepEqual([report.historicalPngPreserved, report.historicalRegistriesPreserved], [465, 93]);
  assert.equal(report.rows.length, 14);
  assert.ok(report.rows.every(row => row.passed));
  return { metrics: { ssrEngineFlows: 14, offensiveFlows: 12, guardFlows: 2, shieldCases: 12, deadTargetCases: 12, removedTargetCases: 12, callerAbortCases: 28 }, scope: 'Separate production SSR engine fixtures: committed costs, accepted contacts, support, invalid targets and interrupted callers. These are not additional browser journeys.' };
});
retain('summon-wave12-result.json', 'rpg-reinforcement-gamecanvas', report => {
  verifyTimes(report, 'RPG GameCanvas', true);
  verifyHarness(report, null, 'RPG GameCanvas');
  assert.equal(report.preliminary, false);
  assert.equal(report.finalProductionFreezeClaimed, true);
  assert.equal(report.productionInputsStableDuringRun, true);
  assert.deepEqual(report.sourceFiles, report.sourceFilesAfter);
  verifyInputList(report.sourceFiles, report, 'RPG GameCanvas');
  verifyArtifacts(report, 'RPG GameCanvas');
  assert.deepEqual([report.actualGameCanvasFlows, report.nativeFlows, report.fallbackFlows, report.distinctSourceCells, report.nativeCells, report.opposingNativeCells, report.nativePixelMirrorChecks], [14, 14, 0, 112, 112, 112, 224]);
  assert.deepEqual([report.offensiveFlows, report.offensiveHpImpacts, report.supportFlows, report.supportEffectEvents, report.supportDamageImpacts], [12, 12, 2, 2, 0]);
  assert.equal(report.supportAlliedHpUnchanged, true);
  assert.equal(report.allEffectsOnce, true);
  assert.equal(report.rows.length, 14);
  assert.equal(new Set(report.rows.map(row => row.identity.performerHeroId)).size, 7);
  assert.ok(report.rows.every(row => row.native.bodyKind === 'native16' && row.native.newNativeCells === 16));
  return { metrics: { gameCanvasJourneys: 14, nativeAssets: 7, distinctNativePoses: 112, pixelMirrorChecks: 224, offensiveHpImpacts: 12, guardFlows: 2, supportDamageImpacts: 0 }, scope: 'Seven new roster partners, both camps, real GameCanvas command controls, one committed effect per journey. Twelve offensive journeys and two guard journeys are counted separately.' };
});
retain('stage-browser.json', 'stage-mechanisms', report => {
  verifyTimes(report, 'stage mechanisms');
  assert.deepEqual([report.mechanisms, report.universes, report.modeRenderChecks, report.additionalViewportChecks], [14, 7, 56, 42]);
  assert.equal(report.rows.length, 14);
  assert.ok(report.rows.every(row => row.changedChannels > 0 && row.pausedTimeStable && row.reducedMotionFrozen && row.stageReducedMotionFrozen && row.mirroredTransformPreserved && row.combatLaneClear && row.stageStateUnchanged && row.actorsAndTerrainUnchanged && row.fullCycleRepeats && row.canvasStylesPreserved));
  assert.deepEqual([report.historicalComparison.historicalDefinitions, report.historicalComparison.preservedCanvasSignatures], [401, 802]);
  assert.deepEqual(report.historicalComparison.failedImageLoads, []);
  assert.equal(report.historicalComparison.signatures.length, 802);
  assert.equal(report.source1to1Validated, 0);
  assert.equal(report.newOfficialFrames, 0);
  return { metrics: { scenes: 14, universes: 7, modeRenderChecks: 56, additionalViewportChecks: 42, preservedHistoricalCanvasSignatures: 802 }, evidenceBinding: 'Current source/harness/capture hashes are bound by the separate independent review; no pre-run snapshot is invented.', scope: 'Architectural stage studies rendered through the actual stage mechanisms, with pause/reduced motion, mirror, formats and historical signature comparisons. These are not official source frames or gameplay events.' };
});
const independentReview = retain('independent-review.json', 'independent-retention-and-runtime-review', report => {
  verifyTimes(report, 'independent review');
  assert.equal(report.sourcesStableDuringReview, true);
  assert.deepEqual(report.sourceHashes, report.sourceHashesAfter);
  verifyInputMap(report.sourceHashes, report, 'independent review');
  assert.ok(Array.isArray(report.checks) && report.checks.length);
  assert.ok(report.checks.every(check => check.passed === true || check.status === 'passed'));
  const stage = report.retainedStageEvidence;
  assert.equal(stage.retentionOnly, true);
  const original = json(local('stage-browser.json'));
  assert.equal(stage.originalStartedAt, original.startedAt);
  assert.equal(stage.originalFinishedAt, original.finishedAt);
  assert.ok(timestamp(original.finishedAt, 'stage finish') <= timestamp(stage.retainedAt, 'stage retention'));
  assert.ok(Array.isArray(stage.artifacts) && stage.artifacts.length >= 7);
  stage.artifacts.forEach(record => verifyFile(record, 'independent stage retention'));
  assert.ok(stage.artifacts.some(record => record.path === local('stage-browser.json')));
  if (report.artifacts) report.artifacts.forEach(record => verifyFile(record, 'independent review artifact'));
  return { metrics: { checks: report.checks.length }, checks: report.checks, risks: report.risks, scope: 'Independent retained-source/runtime review. It does not create additional native drawings or browser journeys.' };
});
retain('tactics-documentation-browser/result.json', 'tactics-documentation-prototype', report => {
  const provenance = json(local('tactics-documentation-browser/archive-provenance.json'));
  assert.equal(provenance.sourceFilesUnchanged, true);
  timestamp(provenance.archivedAt, 'Tactics documentation archive');
  const entries = provenance.files.map(record => ({ path: record.archivedPath, sha256: record.sha256, bytes: record.bytes }));
  entries.forEach(record => verifyFile(record, 'Tactics documentation archive'));
  assert.ok(entries.some(record => record.path === local('tactics-documentation-browser/result.json')), 'Tactics archive must bind the exact report');
  assert.equal(report.checkCount, 10);
  assert.equal(report.checks.length, 10);
  assert.deepEqual([report.surfaces, report.groundSurfaces, report.bridgeSurfaces, report.defaultBridgeRouteCost], [68, 63, 5, 6]);
  assert.equal(report.screenshots.length, 3);
  for (const original of report.screenshots) assert.ok(provenance.files.some(record => record.originalPath === original), 'Tactics screenshot must have an archived SHA');
  return { metrics: { documentaryJourneys: 10, surfaces: 68, groundSurfaces: 63, bridgeSurfaces: 5, captures: 3 }, scope: report.scope, archive: fingerprint(local('tactics-documentation-browser/archive-provenance.json')) };
});

let retainedVisualReview = null;
const visualReviewPath = local('browser/presentation-visual-review.json');
if (exists(visualReviewPath)) {
  const review = json(visualReviewPath);
  assert.equal(review.passed, true);
  assert.equal(review.source1to1Verified, false);
  assert.deepEqual([review.newCharacters, review.reviewedContactSheets, review.sampledColumn], [39, 8, 2]);
  assert.deepEqual(review.camps, ['P1', 'P2']);
  assert.equal(review.contactMethod.characterPixelChanges, false);
  review.artifacts.forEach(record => verifyFile(record, 'retained visual review'));
  retainedVisualReview = { ...fingerprint(visualReviewPath), observedAt: review.observedAt, reviewedContactSheets: 8, characters: 39, sampledColumn: 2, camps: review.camps, scope: review.scope, limitations: review.limitations, additionalBrowserJourneys: 0 };
}

if (final) assert.deepEqual(missing, [], 'Final aggregation requires every actually observed evidence file');
const allPresent = missing.length === 0;
const report = {
  schemaVersion: 1, date: '2026-10-23', generatedAt: new Date().toISOString(),
  collector: fingerprint(local('build-browser-checks.mjs')),
  browser: 'local Chromium', status: allPresent ? 'retained-browser-checks-frozen' : 'awaiting-retained-evidence',
  passed: allPresent && independentReview?.observedPassed === true,
  observedRegistryCounts: { nativeHeroEntries: native.length, complete32: fullNative.length, partialCharacters: partialNative.length, partialPoses: partialNative.reduce((sum, asset) => sum + asset.frames, 0), partialDetails, dedicatedBases16: baseline.baseAssets.length + newBases.length, newDedicatedBases16: newBases.length, nativeSummonAssets: summons.length, newNativeSummonAssets: newSummons.length },
  officialSourceFramesImported: 0, source1to1Verified: false, missingEvidence: missing,
  countsAreSeparate: 'Native poses, source rectangles, draw calls, pixel mirrors, authoritative engine fixtures, GameCanvas keyboard journeys and documentary prototype journeys remain separate observations.',
  observedInternalRuntimeErrors: checks.reduce((sum, check) => sum + check.errors.length, 0),
  externalFontRequestFailures: checks.reduce((sum, check) => sum + check.externalFontRequestFailures, 0),
  externalFailure: 'Only explicitly recorded Google Fonts proxy failures are accepted; internal requests and page errors fail aggregation.',
  validationScope: 'Retained browser observations, separate SSR engine checks and a documentary Tactics prototype. Build and production HTTP evidence are validated separately after audit.',
  sourceTransitionPolicy: 'Only src/game/riftDossierAssets.json may change from the observed pre-refresh SHA to the completed refresh post-SHA after the flow and final write barrier; no other production input exception.',
  permittedRiftTransitions,
  verifiedRetainedFiles: [...verifiedFiles.values()].sort((a, b) => a.path.localeCompare(b.path)),
  retainedVisualReview, checks,
};
fs.writeFileSync(path.join(directory, 'browser-checks.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, observedDomains: checks.length, missingEvidence: missing, registry: report.observedRegistryCounts, permittedRiftTransitions: permittedRiftTransitions.length }));
