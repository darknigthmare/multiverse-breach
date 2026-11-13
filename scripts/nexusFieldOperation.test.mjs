import test from 'node:test';
import assert from 'node:assert/strict';
import { NEXUS_FIELD_OPERATION_ID, NEXUS_FIELD_DISTRICT_ID, NEXUS_FIELD_UNIVERSE,
  NEXUS_FIELD_RETURN_POINT, getNexusFieldBriefing, getNexusFieldAccess,
  createNexusFieldOperation, getNexusFieldReturnMarker, getExtinctionLootTarget,
  openNexusFieldReturn, interactNexusFieldReturn, getNexusFieldRunProof,
  clearNexusFieldOperation, getNexusFieldCompletion, getNexusFieldObjective,
  getNexusFieldRadarMarker, drawNexusFieldRadarMarker } from '../src/game/nexusFieldOperation.js';
import { buildMosaicReconnaissanceDossier, normalizeMosaicReconnaissance,
  startMosaicReconnaissance, advanceMosaicReconnaissance } from '../src/game/mosaicReconnaissance.js';
import { advanceMosaicPlayer, resolveMosaicInteraction, getMosaicZoneAnchor } from '../src/game/mosaicCityRuntime.js';
import { createExtinctionRelayOperation, interactExtinctionRelayOperation, tickExtinctionRelayOperation } from '../src/game/extinctionRelayOperation.js';
import { damageExtinctionEnemy } from '../src/game/extinctionSignatures.js';
import { applyExtinctionReport } from '../src/game/immersiveHubState.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';

const resident = { id: 'arca_mirelle', name: 'Mirelle Suture', universe: NEXUS_FIELD_UNIVERSE, category: 'hacker' };
const district = { id: NEXUS_FIELD_DISTRICT_ID, universe: NEXUS_FIELD_UNIVERSE, worldW: 1920, worldH: 1180 };
const anchor = { id: 'nexus-anchor', universe: NEXUS_FIELD_UNIVERSE, action: 'anchor', x: 700, y: 700, w: 100, h: 80 };
const exhibits = ['nexus_anchor_coil', 'arca_signal_lens'].map((id, index) => ({ id, universe: NEXUS_FIELD_UNIVERSE,
  zone: { id: `${district.id}::exhibit::${id}`, exhibitId: id, universe: NEXUS_FIELD_UNIVERSE,
    action: 'exhibit', x: 800 + index * 120, y: 350, w: 80, h: 60 } }));
const dossier = buildMosaicReconnaissanceDossier({ district, residents: [resident], exhibits, anchor });

function earnedReport(exhibitGoal = 2) {
  let progress = startMosaicReconnaissance(normalizeMosaicReconnaissance(), dossier, 'fr', { exhibitGoal }).progress;
  const npc = { hero: resident, x: 650, y: 420 };
  const zones = [anchor, ...exhibits.map(item => item.zone)];
  const state = { player: { x: 900, y: 800, speed: 2.35 }, npcs: [npc], keys: {}, destination: null };
  const targets = [{ type: 'npc', id: resident.id, point: npc },
    ...exhibits.slice(0, exhibitGoal).map(item => ({ type: 'zone', id: item.zone.id, point: getMosaicZoneAnchor(item.zone) })),
    { type: 'zone', id: anchor.id, point: getMosaicZoneAnchor(anchor) }];
  for (const target of targets) {
    assert.equal(getNexusFieldBriefing(progress), null);
    state.destination = { ...target.point }; state.pendingInteraction = { type: target.type, id: target.id };
    let interaction = null, moved = 0;
    for (let tick = 0; tick < 1000 && !interaction; tick++) {
      const before = { ...state.player };
      advanceMosaicPlayer(state, district, 1000 / 60);
      const distance = Math.hypot(state.player.x - before.x, state.player.y - before.y);
      assert.ok(distance <= state.player.speed + 1e-8); moved += distance;
      interaction = resolveMosaicInteraction(state.player, { npcs: [npc], zones }, target);
    }
    assert.ok(interaction && moved > 0);
    const result = advanceMosaicReconnaissance(progress, dossier, interaction);
    assert.equal(result.changed, true); progress = result.progress;
  }
  return progress;
}

function runFixture(progress = earnedReport()) {
  const run = { phase: 'running', runId: 'field-test-1', heroId: 'player_anchor', hp: 120, maxHp: 120,
    px: 0, py: 0, t: 0, wave: 1, beaconsStabilized: 0, enemies: [], loot: [], kills: 0 };
  run.relayOperation = createExtinctionRelayOperation({ enabled: true, runId: run.runId, contested: false });
  run.fieldOperation = createNexusFieldOperation(run, { enabled: true, mode: 'extraction', briefing: getNexusFieldBriefing(progress) });
  run.loot.push(getNexusFieldReturnMarker(run.fieldOperation));
  return run;
}

function synchronizeRelays(run) {
  for (let wave = 1; wave <= 3; wave++) {
    run.wave = wave;
    const item = { id: `beacon-${wave}`, type: 'beacon', wave, wx: wave, wy: 6 + wave, used: false };
    run.loot.push(item); run.px = item.wx; run.py = item.wy;
    run.relayOperation = interactExtinctionRelayOperation(run.relayOperation, run, item).operation;
    for (let tick = 0; tick < 180; tick++) {
      run.t++; run.relayOperation = tickExtinctionRelayOperation(run.relayOperation, run);
    }
    const collected = interactExtinctionRelayOperation(run.relayOperation, run, item);
    assert.equal(collected.allowCollect, true);
    run.relayOperation = collected.operation; item.used = true; run.beaconsStabilized++;
  }
}

function neutralizeChampion(run) {
  run.wave = 4;
  const champion = { id: 'champion', kind: 'Champion de Trame', hp: 120, maxHp: 120, shieldActive: true };
  const drone = { id: 'protector', kind: 'Drone Protecteur', hp: 24, maxHp: 24 };
  run.enemies = [champion, drone];
  assert.equal(damageExtinctionEnemy(run, champion, 200), 0);
  damageExtinctionEnemy(run, drone, 24);
  damageExtinctionEnemy(run, champion, 120);
  assert.equal(run.kills, 2);
  assert.equal(openNexusFieldReturn(run.fieldOperation, run, { paused: true }), run.fieldOperation);
  run.fieldOperation = openNexusFieldReturn(run.fieldOperation, run);
  assert.equal(run.fieldOperation.status, 'return');
}

function returnedRun(progress = earnedReport()) {
  const run = runFixture(progress); synchronizeRelays(run); neutralizeChampion(run);
  const marker = run.loot.find(item => item.type === 'field-return');
  run.px = marker.wx; run.py = marker.wy;
  const result = interactNexusFieldReturn(run.fieldOperation, run, marker);
  assert.equal(result.completed, true); run.fieldOperation = result.operation; marker.used = true;
  return run;
}

test('return radar preserves player bearing, clamps distant targets and draws inside its bounds', () => {
  const run = runFixture(); synchronizeRelays(run); neutralizeChampion(run);
  run.px = -6; run.py = -29.5; run.angle = 0;
  const forward = getNexusFieldRadarMarker(run.fieldOperation, run, 42);
  assert.equal(forward.distance, 30); assert.equal(forward.clamped, true);
  assert.equal(forward.x, 0); assert.equal(forward.y, -35);
  run.angle = Math.PI;
  const behind = getNexusFieldRadarMarker(run.fieldOperation, run, 42);
  assert.ok(Math.abs(behind.x) < 1e-8 && behind.y === 35);
  run.angle = Math.PI / 2;
  assert.ok(getNexusFieldRadarMarker(run.fieldOperation, run, 42).x < 0);
  const points = [], draws = [];
  const ctx = { save() {}, restore() {}, beginPath() {}, closePath() {},
    moveTo(x, y) { points.push({ x, y }); }, lineTo(x, y) { points.push({ x, y }); },
    fill() { draws.push(this.fillStyle); }, stroke() { draws.push(this.strokeStyle); } };
  drawNexusFieldRadarMarker(ctx, run.fieldOperation, run, { x: 80, y: 90, radius: 42 });
  assert.equal(points.length, 4);
  assert.ok(points.every(point => Math.hypot(point.x - 80, point.y - 90) + 1 < 42));
  assert.deepEqual(draws, ['#9ff3ce', '#081c28']);
  assert.match(getNexusFieldObjective(run.fieldOperation, run).text, /30 m.*radar/);
  run.fieldOperation.status = 'combat';
  assert.equal(getNexusFieldRadarMarker(run.fieldOperation, run, 42), null);
  assert.equal(drawNexusFieldRadarMarker(ctx, null, run, { x: 80, y: 90, radius: 42 }), null);
  run.fieldOperation.status = 'return'; run.phase = 'ended';
  assert.equal(getNexusFieldRadarMarker(run.fieldOperation, run, 42), null);
});

function reportFor(run) {
  return { runId: run.runId, reason: 'completed', result: 'victory', mode: 'extraction',
    at: '2026-11-07T00:00:00.000Z', kills: run.kills, waves: run.wave,
    rewards: { gold: 164, shards: 52, modeXp: 240, title: 'Extraction' },
    fieldOperation: getNexusFieldRunProof(run.fieldOperation) };
}

test('the report is earned through real City movement and each ordered interaction before deployment opens', () => {
  const progress = earnedReport();
  const access = getNexusFieldAccess(progress, [resident]);
  assert.equal(access.available, true);
  assert.deepEqual(access.briefing.evidenceIds, ['nexus_anchor_coil', 'arca_signal_lens']);
  assert.equal(access.briefing.witnessId, resident.id);
  assert.equal(getNexusFieldAccess(progress, []).reason, 'roster_required');
  assert.equal(getNexusFieldAccess(progress, [{ ...resident, nonCombat: true }]).available, false);
  assert.equal(getNexusFieldAccess(progress, [{ ...resident, category: 'trial' }]).available, false);
  assert.equal(getNexusFieldAccess({}, [resident]).reason, 'report_required');
  assert.equal(getNexusFieldBriefing({ dossiers: { [district.id]: { universe: district.universe, completed: true } } }), null);
});

test('a standard one-relic report remains valid and the old report shape is not rewritten', () => {
  const progress = earnedReport(1), before = JSON.stringify(progress);
  assert.deepEqual(getNexusFieldBriefing(progress).evidenceIds, ['nexus_anchor_coil']);
  assert.equal(JSON.stringify(progress), before);
  assert.equal('exhibitGoal' in progress.dossiers[district.id], false);
});

test('the optional operation cannot replace an ordinary mode, an unowned selection, or an unavailable report', () => {
  const run = runFixture(), briefing = getNexusFieldBriefing(earnedReport());
  for (const mode of ['hunt', 'last_signal', 'infestation']) assert.equal(createNexusFieldOperation(run, { enabled: true, mode, briefing }), null);
  assert.equal(createNexusFieldOperation(run, { mode: 'extraction', briefing }), null);
  assert.equal(createNexusFieldOperation(run, { enabled: true, mode: 'extraction', briefing: null }), null);
  assert.equal(createNexusFieldOperation({ ...run, heroId: '' }, { enabled: true, mode: 'extraction', briefing }), null);
  assert.equal(interactNexusFieldReturn(null, run, { type: 'beacon' }).handled, false);
});

test('three counted beacons without actual synchronization cannot open the airlock', () => {
  const run = runFixture(); run.beaconsStabilized = 3;
  run.enemies = [{ kind: 'Champion de Trame', hp: 0 }];
  assert.equal(openNexusFieldReturn(run.fieldOperation, run), run.fieldOperation);
  const marker = run.loot[0]; run.px = marker.wx; run.py = marker.wy;
  assert.equal(interactNexusFieldReturn(run.fieldOperation, run, marker).reason, 'objectives_pending');
  assert.equal(getNexusFieldRunProof(run.fieldOperation), null);
});

test('actual relay synchronization and shielded Champion damage open a return phase without ending or rewarding the run', () => {
  const run = runFixture(); synchronizeRelays(run);
  assert.equal(openNexusFieldReturn(run.fieldOperation, run), run.fieldOperation, 'Champion still required');
  neutralizeChampion(run);
  assert.equal(run.phase, 'running'); assert.equal(run.rewards, undefined);
  assert.equal(getNexusFieldRunProof(run.fieldOperation), null);
  assert.equal(getNexusFieldObjective(run.fieldOperation, run, 'en').status, 'return');
  assert.deepEqual(getNexusFieldReturnMarker(run.fieldOperation), { ...run.loot[0], label: 'Sas · transmettre', color: '#9ff3ce' });
});

test('return requires the real run marker, live owner, nearby position and an unpaused scene', () => {
  const run = runFixture(); synchronizeRelays(run); neutralizeChampion(run);
  const operation = run.fieldOperation, marker = run.loot[0];
  assert.equal(interactNexusFieldReturn(operation, run, marker).reason, 'out_of_range');
  run.px = NEXUS_FIELD_RETURN_POINT.wx; run.py = NEXUS_FIELD_RETURN_POINT.wy;
  for (const altered of [{ ...run, runId: 'another' }, { ...run, heroId: 'another' }, { ...run, hp: 0 }, { ...run, phase: 'ended' }]) {
    assert.equal(interactNexusFieldReturn(operation, altered, marker).completed, false);
  }
  assert.equal(interactNexusFieldReturn(operation, run, { ...marker }).reason, 'wrong_run');
  assert.equal(interactNexusFieldReturn(operation, run, marker, { paused: true }).reason, 'paused');
  assert.equal(interactNexusFieldReturn(operation, { ...run, paused: true }, marker).reason, 'paused');
  assert.equal(interactNexusFieldReturn(operation, { ...run, px: marker.wx + 1.25 }, marker).reason, 'out_of_range');
  assert.equal(interactNexusFieldReturn(operation, { ...run, px: NaN }, marker).reason, 'out_of_range');
  const returned = interactNexusFieldReturn(operation, run, marker);
  assert.equal(returned.completed, true);
  assert.equal(interactNexusFieldReturn(returned.operation, run, marker).reason, 'already_returned');
});

test('nearby caches and weapon drops remain interactable before the locked or open airlock', () => {
  const run = runFixture(); run.px = NEXUS_FIELD_RETURN_POINT.wx; run.py = NEXUS_FIELD_RETURN_POINT.wy;
  const marker = run.loot[0], weapon = { id: 'drop', type: 'weapon', ...NEXUS_FIELD_RETURN_POINT };
  const ammo = { id: 'ammo', type: 'normal', effect: 'ammo', ...NEXUS_FIELD_RETURN_POINT };
  run.loot.push(weapon, ammo);
  assert.equal(getExtinctionLootTarget(run), weapon);
  weapon.used = true; assert.equal(getExtinctionLootTarget(run), ammo);
  ammo.used = true; assert.equal(getExtinctionLootTarget(run), marker);
  assert.equal(getExtinctionLootTarget({ ...run, phase: 'ended' }), null);
});

test('a normal successful report keeps its existing rewards and does not create an operation receipt', () => {
  const run = returnedRun(), report = reportFor(run); delete report.fieldOperation;
  const next = applyExtinctionReport({}, report);
  assert.equal(next.extinctionCareer.runs, 1); assert.equal(next.extinctionCareer.wins, 1);
  assert.equal(next.extinctionCareer.xp, report.rewards.modeXp);
  assert.equal(getNexusFieldCompletion(next.extinctionCareer), null);
});

test('the existing run receipt stores one first return and rejects duplicate deliveries without extra XP', () => {
  const reconnaissance = earnedReport(), run = returnedRun(reconnaissance), report = reportFor(run);
  const progress = { mosaicReconnaissance: reconnaissance, retained: 'old-field', extinctionCareer: { xp: 5, custom: 'keep' } };
  const next = applyExtinctionReport(progress, report);
  const receipt = getNexusFieldCompletion(next.extinctionCareer);
  assert.equal(receipt.runId, run.runId); assert.equal(receipt.relays, 3);
  assert.deepEqual(receipt.evidenceIds, getNexusFieldBriefing(reconnaissance).evidenceIds);
  assert.equal(next.extinctionCareer.xp, 245); assert.equal(next.extinctionCareer.runs, 1);
  assert.equal(next.extinctionCareer.custom, 'keep'); assert.equal(next.retained, 'old-field');
  assert.equal(next.mosaicReconnaissance, reconnaissance);
  assert.equal(applyExtinctionReport(next, report), next);
  const replay = { ...report, runId: 'next-run', fieldOperation: { ...report.fieldOperation, runId: 'next-run' } };
  const replayed = applyExtinctionReport(next, replay);
  assert.equal(replayed.extinctionCareer.runs, 2);
  assert.equal(getNexusFieldCompletion(replayed.extinctionCareer).runId, run.runId, 'first return remains the archived receipt');
});

test('abandon, defeat, wrong-source and incomplete proofs cannot close the City intervention', () => {
  const reconnaissance = earnedReport(), run = returnedRun(reconnaissance), report = reportFor(run);
  for (const altered of [
    { ...report, reason: 'abandoned' }, { ...report, result: 'defeat' }, { ...report, mode: 'hunt' },
    { ...report, fieldOperation: { ...report.fieldOperation, status: 'return' } },
    { ...report, fieldOperation: { ...report.fieldOperation, runId: 'other' } },
    { ...report, fieldOperation: { ...report.fieldOperation, witnessId: 'other' } },
    { ...report, fieldOperation: { ...report.fieldOperation, evidenceIds: ['other'] } },
    { ...report, fieldOperation: { ...report.fieldOperation, relays: 2 } }
  ]) assert.equal(getNexusFieldCompletion(applyExtinctionReport({ mosaicReconnaissance: reconnaissance }, altered).extinctionCareer), null);
  assert.equal(getNexusFieldCompletion(applyExtinctionReport({}, report).extinctionCareer), null, 'no source report');
});

test('save round trip and absence of DLC definitions retain operation and older record identities', () => {
  const reconnaissance = earnedReport();
  reconnaissance.dossiers['absent-dlc'] = { universe: 'Absent DLC', residentId: 'old-witness', exhibitId: 'old-proof', completed: true };
  const report = reportFor(returnedRun(reconnaissance));
  const activityProgress = applyExtinctionReport({ mosaicReconnaissance: reconnaissance,
    extinctionCareer: { fieldReturns: { 'older-operation': { id: 'old-id', witnessId: 'old-witness' } } } }, report);
  const save = sanitizeSaveCore(JSON.parse(JSON.stringify({ gold: 100, inventory: ['owned'], activityProgress })));
  assert.deepEqual(save.activityProgress.mosaicReconnaissance, reconnaissance);
  assert.deepEqual(save.activityProgress.extinctionCareer.fieldReturns['older-operation'], { id: 'old-id', witnessId: 'old-witness' });
  assert.equal(getNexusFieldCompletion(save.activityProgress.extinctionCareer).id, NEXUS_FIELD_OPERATION_ID);
  assert.equal(save.gold, 100); assert.deepEqual(save.inventory, ['owned']);
});

test('finish, abandonment or recovery cleanup removes the run marker while preserving ordinary loot and the retained proof', () => {
  const run = returnedRun(), proof = getNexusFieldRunProof(run.fieldOperation);
  const ordinary = { id: 'kept', type: 'normal', wx: 1, wy: 2 }; run.loot.push(ordinary);
  clearNexusFieldOperation(run);
  assert.equal(run.fieldOperation, null);
  assert.equal(run.loot.some(item => item.type === 'field-return'), false);
  assert.equal(run.loot.includes(ordinary), true);
  assert.equal(proof.status, 'returned');
  const loot = run.loot; clearNexusFieldOperation(run); assert.equal(run.loot, loot);
});

test('the real Hub renders the operation locked when the report or the owned combat roster is missing', async () => {
  const [{ createServer }, React, { renderToStaticMarkup }] = await Promise.all([
    import('./fixtures/ssrTestServer.mjs'), import('react'), import('react-dom/server')
  ]);
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom',
    optimizeDeps: { noDiscovery: true, entries: [], include: [] }, logLevel: 'error' });
  try {
    const { default: HubScreen } = await server.ssrLoadModule('/src/components/HubScreen.jsx');
    const props = { lang: 'en', initialTab: 'battleRoyale', playerProfile: { name: 'QA' },
      gold: 0, breachShards: 0, eventTokens: 0, unlockedHeroes: ['player_anchor'], heroLevels: {},
      activeTeam: [], completedStages: [], inventory: [], equippedGear: {}, equippedEventItems: {},
      heroTalents: {}, heroSkins: {}, activityProgress: {}, portalCollection: {}, disabledAssets: {},
      audioSettings: { muted: true }, onGoToPortal() {}, onLaunchStage() {} };
    const render = changes => renderToStaticMarkup(React.createElement(HubScreen, { ...props, ...changes }));
    for (const changes of [{}, { unlockedHeroes: [], activityProgress: { mosaicReconnaissance: earnedReport() } }]) {
      const html = render(changes);
      assert.match(html, /<input[^>]*data-field-operation="true"[^>]*disabled=""/);
      assert.match(html, /OPERATION LOCKED/);
      assert.doesNotMatch(html, /<input[^>]*data-field-operation="true"[^>]*checked=""/);
    }
    const ready = render({ activityProgress: { mosaicReconnaissance: earnedReport() } });
    assert.match(ready, /data-field-access="available"/);
    assert.doesNotMatch(ready, /<input[^>]*data-field-operation="true"[^>]*disabled=""/);
    assert.doesNotMatch(ready, /<input[^>]*data-field-operation="true"[^>]*checked=""/,
      'normal FPS navigation does not opt into the operation');
  } finally { await server.close(); }
});
