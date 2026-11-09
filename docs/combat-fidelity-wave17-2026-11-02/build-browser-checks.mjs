// No browser is launched and no capture is declared inspected by this module.
import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { prefix, root, read, json, sha, walk, fingerprint, verifyFile, historicalBaseline,
  effectiveBatchPlan, validateFreeze, writeReports } from './closure-support.mjs';

export const time = value => { const n = Date.parse(value); assert.ok(Number.isFinite(n), 'Missing actual timestamp: ' + value); return n; };
export const sorted = values => [...values].sort();
export const requiredProofDomains = Object.freeze([
  'native-presentations', 'base-corrections', '120-character-authoritative-runtime',
  '240-tactics-engine-contracts', 'universe-tactics-custom-gamecanvas', 'ten-universe-stage-canvas-studies',
  'jade-fourteen-browser-flows', 'rpg-gamecanvas', 'canonical-npc-rpg-smash', 'canonical-npc-tactics-fighter'
]);
export const browserReports = Object.freeze([
  ['native-presentations', prefix + 'browser/native-presentations.json'],
  ['base-corrections', prefix + 'browser/base-corrections.json'],
  ['120-character-authoritative-runtime', prefix + 'browser/native-super-runtime.json'],
  ['240-tactics-engine-contracts', prefix + 'browser/tactics-engine-contracts.json'],
  ['universe-tactics-custom-gamecanvas', 'docs/tactics-universes-2026-11-02/result.json'],
  ['ten-universe-stage-canvas-studies', prefix + 'browser/stages-wave17.json'],
  ['jade-fourteen-browser-flows', prefix + 'jade-sources/browser/jade-evidence.json'],
  ['rpg-gamecanvas', prefix + 'summon-wave17-result.json'],
  ['canonical-npc-rpg-smash', prefix + 'capture-npc/rpg-smash-final-result.json'],
  ['canonical-npc-tactics-fighter', prefix + 'capture-npc/tactics-fighter-final-result.json']
]);
export const visualReviewPath = domain => prefix + 'browser/' + domain + '-visual-review-final.json';

// These are authoritative scenarios, not a claim that every attempted action
// can execute. Fighter exposes one active ally: Medic cannot target himself or
// an invisible bench unit. Its two refused actions remain separately measured.
export function validateAuthoritativeRuntimeRows(v, ids) {
  const idSet = new Set(ids), tuples = new Set(), refused = [];
  assert.equal(idSet.size, ids.length);
  assert.equal(v.actualAuthoritativeFixtures, ids.length * 6);
  assert.equal(v.expectedCases, ids.length * 6); assert.equal(v.results.length, ids.length * 6);
  for (const r of v.results) {
    assert.ok(idSet.has(r.id)); assert.ok(['fighter', 'rpg', 'melee'].includes(r.mode)); assert.ok(['player', 'opponent'].includes(r.side));
    const key = [r.id, r.mode, r.side].join(':'); assert.equal(tuples.has(key), false, key); tuples.add(key);
    assert.equal(r.passed, true, key); assert.equal(r.pauseStable, true, key); assert.equal(r.nativeAssetId, r.id, key);
    if (r.committed === false) {
      assert.equal(r.id, 'team_fortress_2_medic', key); assert.equal(r.mode, 'fighter', key);
      assert.equal(r.reason, 'no-visible-ally', key); assert.equal(r.effect, 'heal', key); assert.equal(r.delivery, 'support', key);
      assert.equal(r.bodyKind, 'native-conditionally-unavailable', key); assert.equal(r.bodyCell, null, key); assert.equal(r.bodyTransform, null, key);
      assert.equal(r.chargeBefore, 100, key); assert.equal(r.chargeAfter, 100, key); assert.equal(r.visibleAlliedPatients, 0, key);
      assert.equal(r.hpUnchanged, true, key); assert.equal(r.beamStarted, false, key); assert.equal(r.acceptedDamageEvents, 0, key);
      assert.deepEqual(r.physicalProjectiles, [], key); assert.ok(Array.isArray(r.allyHpDelta) && r.allyHpDelta.length > 0 && r.allyHpDelta.every(n => n === 0), key);
      assert.deepEqual(r.steps, [{ tick: 0, event: 'refused', accepted: false, paid: 0, reason: 'no-visible-ally' }], key);
      assert.equal(r.bodySheet, '/sprites/generated/combat-character-animations-wave17-part-b/team_fortress_2_medic.png', key);
      const library = r.libraryNativeProof;
      assert.equal(library.sheet, r.bodySheet, key); assert.equal(library.frames, 32, key); assert.equal(library.row, 7, key); assert.equal(library.col, 0, key);
      assert.equal(library.libraryOnly, true, key); assert.equal(library.actionExecuted, false, key);
      assert.equal(library.facing, r.side === 'player' ? 1 : -1, key);
      assert.equal(library.actualPngDraw.sheet, r.bodySheet, key);
      assert.deepEqual(library.actualPngDraw.args, [0, 1792, 256, 256, -128, 0, 256, 256], key);
      assert.equal(library.actualPngDraw.transform.a, library.facing, key); assert.equal(library.actualPngDraw.transform.d, 1, key);
      assert.ok(Object.values(library.actualPngDraw.transform).every(Number.isFinite), key);
      refused.push({ id: r.id, mode: r.mode, side: r.side, committed: false, reason: r.reason });
      continue;
    }
    assert.equal(r.committed, true, key); assert.ok(['native32', 'native-action16'].includes(r.bodyKind), key);
    assert.ok(r.bodySheet && Array.isArray(r.bodyCell) && r.bodyCell.length === 4, key);
    assert.ok(r.steps.some(s => s.event === 'commit' && s.accepted), key);
    if (r.effect === 'damage') assert.ok(r.acceptedDamageEvents > 0, key); else assert.equal(r.acceptedDamageEvents, 0, key);
    for (const p of r.physicalProjectiles || []) if (p.nativeMuzzleActive) assert.ok(Number.isFinite(p.measuredError) && p.measuredError < 1e-7, key);
  }
  const expectedRefusals = idSet.has('team_fortress_2_medic') ? ['player', 'opponent'].map(side => ({
    id: 'team_fortress_2_medic', mode: 'fighter', side, committed: false, reason: 'no-visible-ally'
  })) : [];
  const sortRefusals = rows => [...rows].sort((a, b) => a.side.localeCompare(b.side));
  assert.deepEqual(sortRefusals(refused), sortRefusals(expectedRefusals));
  assert.deepEqual(sortRefusals(v.conditionallyUnavailableCases), sortRefusals(expectedRefusals));
  const committedCasts = v.results.filter(r => r.committed === true).length;
  assert.equal(committedCasts, ids.length * 6 - expectedRefusals.length); assert.equal(v.committedCastCases, committedCasts);
  return { cases: tuples.size, committedCasts, conditionallyUnavailableCases: refused.length, characters: ids.length, engines: 3, camps: 2 };
}

// Run after every source owner finishes, before freezing. In particular Jade's
// resource snapshot includes CSS, source PNGs and data beyond the JS imports.
export async function collectRequiredSourceUnion() {
  const { snapshotPresentationInputs, wave17Assets } = await import('./browser/presentation-input-integrity.mjs');
  const { resourcePaths } = await import('./jade-sources/browser/jade-browser-support.mjs');
  const code = [...walk(prefix.slice(0, -1), p => /\.(?:[cm]?jsx?|py)$/.test(p)),
    ...walk('scripts', p => /\.(?:[cm]?jsx?|py)$/.test(p))];
  const native = await wave17Assets('native', { preliminary: true });
  const base = await wave17Assets('base', { preliminary: true });
  const snapshot = await snapshotPresentationInputs({ preliminary: true,
    extraFiles: [...code, ...native.provenancePaths, ...base.provenancePaths] });
  const paths = new Set([...Object.keys(snapshot.hashes), ...resourcePaths,
    ...walk('src'), 'package.json', 'package-lock.json', 'vite.config.js', 'index.html',
    prefix + 'batch-plan-before.json', prefix + 'baseline-receipt.json', prefix + 'baseline-preservation.json',
    prefix + 'baseline-current-wave16.json', prefix + 'baseline-validation-wave16.json',
    prefix + 'baseline-authored-abilities.json', prefix + 'baseline-rift-before.json',
    'docs/rift-dossiers/catalog.json', 'docs/rift-dossiers/character-reference-quality.json',
    'src/game/riftDossierAssets.json']);
  // The refresh receipt is itself an input to the freeze, not a later claim.
  const refreshPath = prefix + 'rift-refresh/result.json';
  if (existsSync(path.resolve(root, refreshPath))) {
    const refresh = json(refreshPath); assert.equal(refresh.success, true, 'Complete the real Rift refresh before collecting its final source union');
    paths.add(refreshPath);
    for (const step of refresh.steps || []) {
      verifyFile({ path: step.log, sha256: step.logSha256 }); paths.add(step.log);
    }
    // The only pending URL correction is planned against the exact published
    // W16 registry. Its failed first attempt and real close-event progress are
    // retained as provenance, never promoted into successful command receipts.
    for (const proof of [refresh.pendingAssetPathCorrectionPlan, refresh.publishedAvailabilityBaseline,
      refresh.publishedAvailabilityOrigin, refresh.publishedWave16Audit, refresh.progressReceipt]) {
      verifyFile(proof); paths.add(proof.path);
    }
    const pendingPlan = json(refresh.pendingAssetPathCorrectionPlan.path), archiveProof = pendingPlan.failedAttemptArchive;
    verifyFile(archiveProof); paths.add(archiveProof.path);
    for (const proof of json(archiveProof.path).artifacts) { verifyFile(proof); paths.add(proof.path); }
  }
  // Store a stable copy for the README gate; do not freeze README.md itself,
  // which is an authorized documentation output after completed validation.
  if (existsSync(path.resolve(root, prefix + 'baseline-project-readme-wave16.md'))) paths.add(prefix + 'baseline-project-readme-wave16.md');
  assert.equal(paths.has(prefix + 'proof-source-union.json'), false, 'A source union must not include itself');
  const files = Object.fromEntries(sorted(paths).map(p => [p, sha(read(p))]));
  return { schemaVersion: 1, wave: 17, createdAt: new Date().toISOString(),
    scope: 'Union of every final browser input, all production sources and all verification helper code; generated browser results and captures are separately bound.',
    files, fileCount: Object.keys(files).length, filesSha256: sha(Buffer.from(JSON.stringify(files))), source1to1Verified: false };
}

export function collectBrowserChecks() {
  const { baseline } = historicalBaseline(), freeze = validateFreeze(), plan = effectiveBatchPlan();
  const frozenProof = fingerprint(prefix + 'production-freeze.json'), ids = sorted(Object.values(plan.parts).flat()), idSet = new Set(ids);
  const files = new Map(), checks = [], verify = proof => { const actual = verifyFile(proof); files.set(actual.path, actual); return actual; };
  const frozen = proof => { verify(proof); assert.equal(freeze.files[proof.path], proof.sha256, proof.path + ': input was not frozen'); };
  function inputs(value) {
    const records = Array.isArray(value) ? value : Object.entries(value || {}).map(([path, sha256]) => ({ path, sha256 }));
    assert.ok(records.length, 'Missing observed input snapshot'); records.forEach(frozen); return records;
  }
  function stable(before, after) { assert.deepEqual(after, before, 'Observed browser inputs changed'); inputs(before); }
  function artifacts(value) {
    for (const proof of value.artifacts || []) verify(proof);
    return sorted(new Set([...(value.artifacts || []).filter(p => p.path.endsWith('.png')).map(p => p.path),
      ...['captures', 'refusedCaptures'].flatMap(key => (value[key] || []).map(p => typeof p === 'string' ? p : p.path)).filter(p => p?.endsWith('.png'))]));
  }
  function execution(value, reportPath) {
    assert.equal(value.passed, true, reportPath); assert.equal(value.preliminary, false, reportPath);
    if (value.phase) assert.equal(value.phase, 'final', reportPath);
    assert.equal(value.allBrowserWindowsClosed, true, reportPath);
    assert.ok(time(value.startedAt) >= time(freeze.createdAt), reportPath + ': began before freeze');
    assert.ok(time(value.browserClosedAt) >= time(value.startedAt)); assert.ok(time(value.finishedAt) >= time(value.browserClosedAt));
    for (const key of ['errors', 'pageErrors', 'httpErrors', 'failures']) if (value[key]) assert.deepEqual(value[key], [], reportPath + ': ' + key);
    if (value.failure !== undefined) assert.ok(!value.failure, reportPath);
    const failed = value.failedRequests || [];
    for (const row of failed) { assert.match(row.url, /^https:\/\/fonts\.googleapis\.com\//); assert.equal(row.error ?? row.failure, 'net::ERR_TUNNEL_CONNECTION_FAILED'); }
    if (value.consoleErrors) assert.equal(value.consoleErrors.length, failed.length, reportPath + ': unexplained console error');
    if (value.harness) frozen({ path: value.harness, sha256: value.harnessSha256 });
    if (value.productionFreezeSha256) assert.equal(value.productionFreezeSha256, frozenProof.sha256);
  }
  function review(domain, reportPath, closedAt, captures) {
    assert.ok(captures.length, domain + ': actual captures absent');
    const reviewPath = visualReviewPath(domain), value = json(reviewPath);
    assert.equal(value.passed, true); assert.equal(value.preliminary, false);
    assert.ok(time(value.reviewedAt) >= time(closedAt), domain + ': review precedes final browser close');
    verify(value.report); assert.equal(value.report.path, reportPath); assert.equal(value.report.sha256, sha(read(reportPath)));
    const viewed = value.artifacts || value.rows;
    assert.ok(Array.isArray(viewed) && viewed.length > 0);
    assert.equal(new Set(viewed.map(p => p.path)).size, viewed.length);
    for (const image of viewed) {
      verify(image); assert.equal(image.inspected, true, image.path);
      assert.equal(image.inspectionMethod, 'view_image', image.path + ': record the actual image viewing tool');
      assert.ok(time(image.inspectedAt) >= time(closedAt)); assert.ok(time(image.inspectedAt) <= time(value.reviewedAt));
      assert.ok(typeof image.observation === 'string' && image.observation.trim().length >= 12, image.path + ': missing specific observed result');
    }
    const actualCount = value.actualCapturesInspected ?? value.actualContactSheetsViewed;
    assert.equal(actualCount, viewed.length, 'Only genuinely viewed images count');
    for (const capture of captures) {
      if (viewed.some(p => p.path === capture)) continue;
      const tile = value.sourceCaptures?.find(p => p.path === capture); assert.ok(tile, capture + ': unreviewed capture'); verify(tile);
      assert.ok(viewed.some(p => p.path === tile.inspectedViaContactSheet), capture + ': unviewed contact page');
      assert.ok(tile.tile && Number.isFinite(tile.tile.x) && Number.isFinite(tile.tile.y) && tile.tile.width > 0 && tile.tile.height > 0);
    }
    verify(fingerprint(reviewPath)); return { ...fingerprint(reviewPath), actualImagesInspected: viewed.length, capturedSourceImages: captures.length };
  }
  const delivery = json(prefix + 'deliverables.json'); assert.equal(delivery.preliminary, false);
  assert.deepEqual(sorted(delivery.completeNative32.map(p => p.heroId)), ids); assert.deepEqual(sorted(delivery.base16.map(p => p.heroId)), ids);
  function presentation(v, name) {
    assert.equal(v.productionInputsUnchanged, true); assert.equal(v.productionInputsStableDuringRun, true);
    assert.equal(v.newCharacters, 120); assert.deepEqual(v.pendingIds, []); assert.deepEqual(sorted(v.actualDeliveredIds), ids);
    assert.equal(v.newFrameDraws, 120 * (name === 'native-presentations' ? 64 : 32));
    assert.equal(v.historicalPngHashesPreserved, 1237); assert.equal(v.historicalRegistryHashesPreserved, 138);
    const historical = name === 'native-presentations' ? (baseline.meleeBindings.nativePresentationHeroes * 32 + baseline.meleeBindings.nativePartialPresentationEntries.reduce((n, p) => n + p.frames, 0)) * 2 : baseline.baseSpriteCorrections.heroes * 16 * 2;
    assert.equal(v.historicalDrawGeometryUnchanged, historical);
    const beforePath = v.attempt + '/' + name + '-inputs-before.json', afterPath = v.attempt + '/' + name + '-inputs-after.json';
    const before = json(beforePath), after = json(afterPath); stable(before.hashes, after.hashes); assert.deepEqual(before, after);
    assert.equal(before.sha256, sha(Buffer.from(JSON.stringify(before.hashes))));
    assert.equal(before.productionFreezeSha256, frozenProof.sha256); verify(fingerprint(beforePath)); verify(fingerprint(afterPath));
    return { characters: 120, frameDraws: v.newFrameDraws, historicalDrawsPreserved: historical };
  }
  function runtime(v) {
    assert.equal(v.partial, false); assert.equal(v.stable, true); stable(v.before.hashes, v.after.hashes);
    assert.equal(v.before.sha256, sha(Buffer.from(JSON.stringify(v.before.hashes)))); assert.equal(v.before.sha256, v.after.sha256);
    assert.equal(v.before.productionFreezeSha256, frozenProof.sha256); assert.equal(v.after.productionFreezeSha256, frozenProof.sha256);
    assert.deepEqual(sorted(v.selectedParts), ['A', 'B', 'C']); assert.equal(v.actualAuthoritativeFixtures, 720);
    frozen({ path: v.runtimeSource, sha256: v.runtimeSourceSha256 });
    const metrics = validateAuthoritativeRuntimeRows(v, ids);
    assert.equal(metrics.committedCasts, 718); assert.equal(metrics.conditionallyUnavailableCases, 2);
    return metrics;
  }
  function tactics(v) {
    assert.equal(v.productionInputsStableDuringRun, true); stable(v.sourceHashesBefore, v.sourceHashesAfter);
    assert.equal(v.actualTacticsFixtures, 240); assert.equal(v.rows.length, 240); const tuples = new Set();
    for (const row of v.rows) {
      assert.ok(idSet.has(row.id)); assert.ok(['player', 'opponent'].includes(row.side)); const key = row.id + ':' + row.side;
      assert.equal(tuples.has(key), false); tuples.add(key); assert.equal(row.passed, true); assert.equal(row.paused, true);
      assert.equal(row.storedTeamsUnchanged, true); assert.ok(row.nativeDraws > 0); assert.ok(row.nativeSheet.includes('wave17'));
      assert.equal(row.chargeBefore, 100); assert.equal(row.chargeAfter, 0); assert.equal(row.observedHits, row.expectedHits);
      if (row.profile.effect === 'damage') assert.ok(row.finalHP < row.initialHP); else assert.equal(row.finalHP, row.initialHP);
    }
    return { cases: tuples.size, camps: 2 };
  }
  function ui(v) {
    assert.equal(v.harnessStableDuringRun, true); assert.equal(v.productionInputsStableDuringRun, true); stable(v.sourceHashesBefore, v.sourceHashesAfter);
    assert.equal(v.actualCustomBattleLaunches, 6); assert.equal(v.actualSourceSectorLaunches, 4); assert.equal(v.actualLegacyControlLaunches, 2);
    const launches = v.rows.filter(r => r.check === 'real-custom-source-sector-launch-with-dedicated-environment');
    assert.equal(new Set(launches.map(r => r.fieldId)).size, 6);
    assert.equal(v.rows.filter(r => r.check === 'mobile375-source-board-and-touch-controls').length, 4);
    assert.equal(v.artifacts.filter(p => p.path.endsWith('.png')).length, 10); assert.ok(v.rows.every(r => r.passed));
    return { customBattleFlows: 6, newSectors: 4, controls: 2, captures: 10 };
  }
  function stages(v) {
    assert.equal(v.productionInputsStableDuringRun, true); assert.equal(v.rows.length, 10); assert.equal(v.actualCanvasFrames, 40); assert.equal(v.captures.length, 2);
    const before = v.artifacts.find(p => p.path.endsWith('/inputs-before.json')), after = v.artifacts.find(p => p.path.endsWith('/inputs-after.json'));
    assert.ok(before && after); stable(json(before.path).hashes, json(after.path).hashes);
    for (const row of v.rows) {
      for (const key of ['cyclic', 'reducedMotionStable', 'pausedSimulationFrameStable', 'allFourModeSelections', 'stageImmutable']) assert.equal(row[key], true);
      assert.equal(row.frames.length, 4); assert.ok(row.frames.every(f => f.visiblePixels > 0 && f.rendered && /^[a-f0-9]{64}$/.test(f.sha256)));
      assert.notEqual(row.frames[0].sha256, row.frames[1].sha256);
    }
    return { studies: 10, actualRgbaFrames: 40, contactPages: 2 };
  }
  function jade(v) {
    const e = v.execution; execution({ ...v, ...e }, prefix + 'jade-sources/browser/jade-evidence.json');
    assert.equal(e.resourcesUnchangedDuringRun, true); stable(e.resourcesBefore, e.resourcesAfter); verify(v.productionFreeze);
    assert.equal(v.productionFreeze.sha256, frozenProof.sha256);
    const expectedIds = ['core', 'physical-ledge', ...['movement', 'attack', 'guard', 'charge', 'photo', 'gyrodisk'].flatMap(kind => ['player', 'cpu'].map(side => kind + '-' + side))];
    assert.deepEqual(sorted(v.flows.map(r => r.id)), sorted(expectedIds)); assert.equal(e.commands.length, 14);
    for (const [i, flow] of v.flows.entries()) {
      verify(flow.report); verify(flow.closure); frozen(flow.harness); const child = json(flow.report.path), closure = json(flow.closure.path), command = e.commands[i];
      assert.equal(command.id, flow.id); assert.equal(command.exitCode, 0); assert.equal(command.signal, null); assert.equal(command.spawnError, null);
      assert.equal(command.receiptOrigin, 'node-child-process-close-event'); assert.equal(sha(read(command.log)), command.logSha256); verify(fingerprint(command.log));
      assert.ok(time(command.startedAt) >= time(e.startedAt)); assert.ok(time(command.finishedAt) <= time(e.finishedAt));
      if (i) assert.ok(time(e.commands[i - 1].finishedAt) <= time(command.startedAt));
      execution(child, flow.report.path); execution(closure, flow.closure.path); stable(child.resourcesBefore, child.resourcesAfter);
      assert.equal(closure.browserConnectedAfterClose, false); assert.equal(child.productionInputsStableDuringRun, true);
      assert.equal(child.harnessSha256, flow.harness.sha256); assert.deepEqual(closure.resourcesBefore, child.resourcesBefore); assert.deepEqual(closure.resourcesAfter, child.resourcesAfter);
      if (flow.id === 'core') { assert.equal(child.states, 45); assert.equal(child.coreFrameDraws, 360); assert.equal(child.distinctCorePoses, 180); assert.equal(child.gripFrameDraws, 8); }
      else if (flow.id === 'physical-ledge') { assert.equal(child.caseCount, 20); assert.equal(child.attachedDraws, 28); }
      else { assert.equal(child.keyboard, true); assert.ok(child.actualTrustedKeyboardEvents > 0); assert.ok(child.drawCount > 0); }
    }
    for (const [key, count] of Object.entries({ flows: 14, keyboardFlows: 12, keyboardKinds: 6, controlledFlows: 2, nativeDistinctPoses: 196, coreDraws: 360, physicalLedgeCases: 20, physicalGripDraws: 28 })) assert.equal(v.counts[key], count);
    return v.counts;
  }
  function rpg(v) {
    assert.equal(v.productionInputsStableDuringRun, true); stable(v.sourceFiles, v.sourceFilesAfter);
    for (const [key, n] of Object.entries({ actualGameCanvasFlows: 12, nativeFlows: 12, fallbackFlows: 0, distinctSourceCells: 96, nativeCells: 96, opposingNativeCells: 96, nativePixelMirrorChecks: 192, offensiveFlows: 10, offensiveHpImpacts: 10, supportFlows: 2, supportEffectEvents: 2, supportDamageImpacts: 0 })) assert.equal(v[key], n, key);
    for (const key of ['allEffectsOnce', 'supportAlliedHpUnchanged', 'actualEngineUrlResolvedFromGameCanvas', 'bothSidesThroughGameCanvasControls']) assert.equal(v[key], true);
    const tuples = new Set();
    for (const row of v.rows) {
      const key = row.identity.sourceHeroId + ':' + row.identity.side; assert.equal(tuples.has(key), false); tuples.add(key);
      assert.equal(row.pause.unchanged, true); assert.equal(row.native.bodyKind, 'native16'); assert.equal(row.native.pixelMirrorChecks, 16);
      assert.equal(new Set(row.native.calls.map(c => c.row + ':' + c.col)).size, 16); assert.equal(row.native.canSummonAgain, false);
      if (row.identity.effect === 'damage') assert.equal(row.native.hpChanges.length, 1);
      else {
        assert.equal(row.identity.sourceHeroId, 'team_fortress_2_medic'); assert.deepEqual(row.native.hpChanges, []);
        assert.equal(row.precharge.realMediGunCommand, true); assert.equal(row.precharge.beamConnected, true);
        assert.ok(Math.abs(row.precharge.totalBeamSimulationSeconds - 40) < 1e-6); assert.ok(row.precharge.simulationTicks >= 2300);
        assert.equal(row.native.finalAllies.find(a => a.mediGun)?.mediGun.uberRemaining, 8);
        const beam = row.selection.nativeBeamProof; assert.equal(beam.sourceNozzleMatchesDraw, true); assert.equal(beam.renderReadOnly, true); assert.equal(beam.syringeGunPoseUsed, false);
        assert.ok(Math.hypot(beam.actualDrawnNozzle.x - beam.actualBeamStart.x, beam.actualDrawnNozzle.y - beam.actualBeamStart.y) < .001);
      }
    }
    assert.equal(tuples.size, 12); return { flows: 12, nativeRpgAtlases: 6, distinctCells: 96, mirroredDrawChecks: 192, offensiveImpacts: 10, supportImpacts: 0 };
  }
  function npc(v, tf) {
    assert.equal(v.productionInputsStableDuringRun, true); stable(tf ? v.sourceHashesBefore : v.productionInputsBefore, tf ? v.sourceHashesAfter : v.productionInputsAfter);
    const registryPath = 'src/game/combat/sourceCaptureEnemiesWave17.generated.json';
    const asset = json(registryPath).entries.find(r => r.sourceEnemyId === 'tail_concerto_red_vest_kitten');
    assert.ok(asset); assert.equal(asset.frames, 16); frozen(fingerprint(registryPath)); frozen({ path: 'public' + asset.sheet, sha256: asset.sha256 });
    assert.equal(v.rows.length, 4); const keys = v.rows.map(r => r.mode + ':' + r.side);
    assert.deepEqual(sorted(keys), sorted((tf ? ['Tactics', 'Fighter'] : ['RPG', 'Smash']).flatMap(mode => ['player', 'enemy'].map(side => mode + ':' + side))));
    if (tf) {
      assert.equal(v.actualGameCanvasFlows, 2); assert.equal(v.actualFighterModeFlows, 2); assert.equal(v.captures.length, 12);
      frozen(fingerprint(prefix + 'capture-npc/verify-tactics-fighter-report.mjs'));
      let observedCells = 0;
      for (const row of v.rows) {
        assert.equal(row.passed, true); assert.equal(row.actorId, 'tail_concerto_waffle');
        assert.equal(row.actualInterface, row.mode === 'Tactics' ? 'GameCanvas' : 'FighterMode');
        assert.equal(row.npcAsset.sheet, asset.sheet); assert.equal(row.npcAsset.sha256, asset.sha256);
        assert.equal(row.npcAsset.width, asset.width); assert.equal(row.npcAsset.height, asset.height);
        assert.equal(row.actualNativeCellsObserved, row.mode === 'Fighter' ? 16 : 12);
        for (const phase of ['idle', 'captured', 'released']) assert.deepEqual(row.phases[phase], [0, 1, 2, 3]);
        assert.deepEqual(row.phases.run, row.mode === 'Fighter' ? [0, 1, 2, 3] : []);
        for (const snapshot of [row.captured, row.userPause, row.released, row.current]) {
          assert.equal(snapshot.sourceEnemyId, 'tail_concerto_red_vest_kitten'); assert.equal(snapshot.currentHp, row.initial.currentHp);
          assert.equal(snapshot.name, row.initial.name); assert.equal(snapshot.maxHp, row.initial.maxHp); assert.equal(snapshot.universe, 'Tail Concerto');
          for (const key of ['y', 'side', 'inHeroes', 'inEnemies']) assert.equal(snapshot[key], row.initial[key]);
          assert.equal(snapshot.capture.lift, 0); assert.equal(snapshot.capture.nonlethal, true); assert.equal(snapshot.capture.changesFaction, false); assert.equal(snapshot.capture.inputProxy, null);
        }
        assert.equal(row.captured.capture.active, true); assert.equal(row.userPause.capture.active, true); assert.equal(row.released.capture.active, false);
        for (const key of ['x', 'gridX', 'gridY', 'surfaceId']) assert.equal(row.userPause[key], row.captured[key]);
        assert.equal(row.released.capture.endedBy, row.mode === 'Tactics' ? 'target-turn-consumed' : 'expired');
        const bodyDraws = row.draws.filter(d => d.sw === asset.frameWidth && d.sh === asset.frameHeight); assert.ok(bodyDraws.length > 0);
        for (const phase of Object.keys(asset.phases)) assert.deepEqual([...new Set(bodyDraws.filter(d => d.phase === phase).map(d => d.col))].sort(), row.phases[phase]);
        for (const draw of bodyDraws) {
          assert.equal(draw.sx, draw.col * asset.frameWidth); assert.equal(draw.sy, draw.row * asset.frameHeight); assert.equal(draw.row, asset.phases[draw.phase].row);
          assert.ok(Number.isInteger(draw.col) && draw.col >= 0 && draw.col < 4); assert.ok(draw.dw > 0 && draw.dh > 0 && draw.transform.every(Number.isFinite));
        }
        observedCells += row.actualNativeCellsObserved;
      }
      assert.equal(observedCells, 56);
    } else {
      assert.equal(v.flows, 4); assert.equal(v.actualGameCanvasFlows, 4); assert.equal(v.browserClosed, true);
      for (const row of v.rows) {
        for (const key of ['realUiCommand', 'pauseStable', 'renderReadOnly', 'noHpChange', 'noLift', 'noFactionChange', 'noInputProxy']) assert.equal(row[key], true, key);
        assert.deepEqual(row.capturedColumns, [0, 1, 2, 3]); assert.deepEqual(row.releasedColumns, [0, 1, 2, 3]);
        assert.equal(row.initialNpcSource?.sourceEnemyId, 'tail_concerto_red_vest_kitten'); assert.ok(row.actualDraws.length > 0);
        assert.equal(row.bodySheet, asset.sheet); assert.equal(row.bodySha256, asset.sha256);
      }
    }
    return { actualFlows: 4, modes: tf ? ['Tactics', 'Fighter'] : ['RPG', 'Smash'], nonlethal: true, factionChanges: 0 };
  }
  const inspectors = { 'native-presentations': v => presentation(v, 'native-presentations'), 'base-corrections': v => presentation(v, 'base-corrections'),
    '120-character-authoritative-runtime': runtime, '240-tactics-engine-contracts': tactics, 'universe-tactics-custom-gamecanvas': ui,
    'ten-universe-stage-canvas-studies': stages, 'jade-fourteen-browser-flows': jade, 'rpg-gamecanvas': rpg,
    'canonical-npc-rpg-smash': v => npc(v, false), 'canonical-npc-tactics-fighter': v => npc(v, true) };
  for (const [domain, reportPath] of browserReports) {
    const value = json(reportPath), e = domain === 'jade-fourteen-browser-flows' ? { ...value, ...value.execution } : value;
    execution(e, reportPath); const captures = artifacts(value), metrics = inspectors[domain](value);
    const visualReview = review(domain, reportPath, e.browserClosedAt, captures), proof = verify(fingerprint(reportPath));
    checks.push({ domain, reportPath, reportSha256: proof.sha256, reportBytes: proof.bytes, startedAt: e.startedAt, browserClosedAt: e.browserClosedAt,
      finishedAt: e.finishedAt, metrics, visualReview, source1to1Verified: false });
  }
  assert.deepEqual(sorted(checks.map(r => r.domain)), sorted(requiredProofDomains)); historicalBaseline(); validateFreeze();
  return { schemaVersion: 3, wave: 17, passed: true, preliminary: false, generatedAt: new Date().toISOString(),
    requiredProofDomains, checks, productionFreeze: frozenProof, observedInternalRuntimeErrors: 0,
    verifiedFiles: sorted(files.keys()).map(p => files.get(p)), permittedPostBrowserShaTransitions: [], source1to1Verified: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--source-union-before-freeze')) {
    assert.equal(existsSync(path.resolve(root, prefix + 'production-freeze.json')), false, 'The union must be completed before freezing');
    const union = await collectRequiredSourceUnion();
    if (!process.argv.includes('--check-only')) writeReports([[prefix + 'proof-source-union.json', union]]);
    console.log(JSON.stringify({ sourceUnion: true, files: union.fileCount, sha256: union.filesSha256, written: !process.argv.includes('--check-only') }));
  } else {
    assert.ok(process.argv.includes('--after-final-browser-reviews'));
    const report = collectBrowserChecks();
    if (!process.argv.includes('--check-only')) writeReports([[prefix + 'browser-checks.json', report]]);
    console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'), domains: report.checks.length, verifiedFiles: report.verifiedFiles.length }));
  }
}
