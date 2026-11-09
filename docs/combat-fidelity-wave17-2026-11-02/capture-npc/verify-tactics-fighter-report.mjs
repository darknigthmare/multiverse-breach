import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const reportPath = process.argv[2];
assert.ok(reportPath, 'Pass a completed tactics-fighter result.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const report = JSON.parse(fs.readFileSync(reportPath));
assert.equal(report.passed, true); assert.equal(report.allBrowserWindowsClosed, true);
assert.equal(report.actualGameCanvasFlows, 2); assert.equal(report.actualFighterModeFlows, 2);
assert.equal(report.rows.length, 4); assert.equal(report.captures.length, 12);
assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.httpErrors, []);
assert.ok(report.failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.failure === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
assert.equal(report.consoleErrors.length, report.failedRequests.length);
assert.ok(report.consoleErrors.every(entry => entry.message === 'Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED'));
for (const artifact of report.artifacts) {
  const bytes = fs.readFileSync(artifact.path);
  assert.equal(sha(bytes), artifact.sha256, artifact.path);
  assert.equal(bytes.length, artifact.bytes, artifact.path);
}
const harnessArchive = report.artifacts.find(artifact => artifact.path.endsWith('/harness.mjs'));
assert.ok(harnessArchive); assert.equal(harnessArchive.sha256, report.harnessSha256);
const registryPath = 'src/game/combat/sourceCaptureEnemiesWave17.generated.json';
const registry = JSON.parse(fs.readFileSync(registryPath));
const asset = registry.entries.find(entry => entry.sourceEnemyId === 'tail_concerto_red_vest_kitten');
assert.ok(asset); assert.equal(asset.frames, 16);
assert.equal(sha(fs.readFileSync('public' + asset.sheet)), asset.sha256);
const key = row => `${row.mode}:${row.side}`;
assert.deepEqual(report.rows.map(key).sort(), ['Fighter:enemy', 'Fighter:player', 'Tactics:enemy', 'Tactics:player']);
let observedNativeCellsAcrossFlows = 0;
for (const row of report.rows) {
  assert.equal(row.passed, true); assert.equal(row.actorId, 'tail_concerto_waffle');
  assert.equal(row.actualInterface, row.mode === 'Tactics' ? 'GameCanvas' : 'FighterMode');
  assert.equal(row.npcAsset.sheet, asset.sheet); assert.equal(row.npcAsset.sha256, asset.sha256);
  assert.equal(row.npcAsset.width, asset.width); assert.equal(row.npcAsset.height, asset.height);
  for (const value of [row.captured, row.userPause, row.released, row.current]) {
    assert.equal(value.id, 'tail_concerto_red_vest_kitten');
    assert.equal(value.sourceEnemyId, 'tail_concerto_red_vest_kitten'); assert.equal(value.universe, 'Tail Concerto');
    assert.equal(value.name, row.initial.name); assert.equal(value.currentHp, row.initial.currentHp);
    assert.equal(value.maxHp, row.initial.maxHp); assert.equal(value.y, row.initial.y);
    assert.equal(value.inHeroes, row.initial.inHeroes); assert.equal(value.inEnemies, row.initial.inEnemies);
    assert.equal(value.side, row.initial.side);
    assert.equal(value.capture.lift, 0); assert.equal(value.capture.nonlethal, true);
    assert.equal(value.capture.changesFaction, false); assert.equal(value.capture.inputProxy, null);
  }
  assert.equal(row.captured.capture.active, true); assert.equal(row.userPause.capture.active, true);
  assert.equal(row.userPause.x, row.captured.x, key(row) + ': position changed while actually captured');
  assert.equal(row.userPause.gridX, row.captured.gridX); assert.equal(row.userPause.gridY, row.captured.gridY);
  assert.equal(row.userPause.surfaceId, row.captured.surfaceId);
  assert.equal(row.released.capture.active, false);
  assert.equal(row.released.capture.endedBy, row.mode === 'Tactics' ? 'target-turn-consumed' : 'expired');
  const bodyDraws = row.draws.filter(draw => draw.sw === asset.frameWidth && draw.sh === asset.frameHeight);
  assert.ok(bodyDraws.length > 0, key(row) + ': no actual complete native body cell was drawn');
  for (const phase of Object.keys(asset.phases)) {
    const actualColumns = [...new Set(bodyDraws.filter(draw => draw.phase === phase).map(draw => draw.col))].sort();
    assert.deepEqual(actualColumns, row.phases[phase], key(row) + ': a portrait crop cannot count as body animation');
  }
  for (const phase of ['idle', 'captured', 'released']) assert.deepEqual(row.phases[phase], [0, 1, 2, 3]);
  assert.deepEqual(row.phases.run, row.mode === 'Fighter' ? [0, 1, 2, 3] : []);
  assert.equal(row.actualNativeCellsObserved, row.mode === 'Fighter' ? 16 : 12);
  for (const draw of bodyDraws) {
    assert.equal(draw.sw, asset.frameWidth); assert.equal(draw.sh, asset.frameHeight);
    assert.equal(draw.sx, draw.col * asset.frameWidth); assert.equal(draw.sy, draw.row * asset.frameHeight);
    assert.equal(draw.row, asset.phases[draw.phase].row); assert.ok(draw.col >= 0 && draw.col < 4);
    assert.ok(draw.dw > 0 && draw.dh > 0);
    assert.ok(draw.transform.every(Number.isFinite));
  }
  observedNativeCellsAcrossFlows += row.actualNativeCellsObserved;
}
assert.equal(observedNativeCellsAcrossFlows, 56);
if (!report.preliminary) {
  assert.equal(report.productionInputsStableDuringRun, true);
  assert.equal(typeof report.productionFreezeSha256, 'string');
  assert.ok(report.productionFreezePath);
}
console.log(JSON.stringify({ passed: true, preliminary: report.preliminary,
  actualGameCanvasFlows: 2, actualFighterModeFlows: 2, captures: 12,
  observedNativeCellsAcrossFlows, uniqueNpcAtlasCells: 16,
  source1to1Verified: false, report: path.normalize(reportPath) }));
