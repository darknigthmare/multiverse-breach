import assert from 'node:assert/strict';
import './helpers/rpgSourceControlInvocationsWave16.mjs';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import registry from '../src/game/combat/summonAnimationsWave16.generated.json' with { type: 'json' };
import { RPG_SUMMON_SPECS_WAVE16, ROSTER_REINFORCEMENTS_WAVE16, CANONICAL_SUMMONS_WAVE16 } from '../src/game/combat/rosterReinforcementsWave16.js';
import { projectSourceSummonChoreographyWave16 as place, projectNativeSummonEffectOriginWave16 as project,
  getFoxDevilNativeFrameWave16, projectFoxDevilMouthWave16, ROSTER_SUMMON_CHOREOGRAPHIES_WAVE16 } from '../src/game/combat/rosterSummonChoreographyWave16.js';
const root = new URL('../', import.meta.url), docs = 'docs/combat-fidelity-wave16-2026-10-28/';
const bytes = path => readFile(new URL(path, root));
const json = async path => JSON.parse(await bytes(path));
const sha = value => createHash('sha256').update(value).digest('hex');

test('seven independently generated subjects retain 112 distinct source poses, one refused identity and honest provenance', async () => {
  const proof = await json(docs + 'summon-provenance.json');
  assert.equal(registry.entries.length, 7); assert.equal(proof.nativePoses, 112);
  assert.equal(proof.actualNativeGenerationCalls, 8); assert.equal(proof.rosterPerformers, 6);
  assert.equal(proof.supernaturalEntityBodies, 1); assert.equal(proof.blockedNativePartnerRequests, 1);
  assert.equal(proof.excludedAttempts[0].key, 'robin');
  assert.equal(sha(await bytes(docs + 'rpg-tool-receipts/robin-error-verbatim.json')), 'e8533ce0f05261f7a16a74de812b783c430cf08a45da248a96e6486917d4b935');
  assert.equal(sha(await bytes(docs + 'rpg-sources/source-plan.json')), '688a2346df4de3d1b17f029070d2d98f1d4859b71d6bcb68c6a0586eb3f24b46');
  assert.equal(proof.source1to1Verified, false);
  for (const asset of registry.entries) {
    assert.equal(sha(await bytes('public' + asset.sheet)), asset.sha256);
    assert.equal(sha(await bytes(asset.sourceImage)), asset.sourceImageSha256);
    assert.equal(asset.visualValidation.distinctCells, 16);
    assert.equal(new Set(asset.visualValidation.phaseReviews.flatMap(phase => phase.frameHashes)).size, 16);
    assert.equal(asset.canon1to1Verified, false);
  }
});
test('all 55 historical native summon records and PNGs remain byte-identical', async () => {
  const old = await json(docs + 'rpg-historical-assets-before.json'); assert.equal(old.count, 55);
  for (const asset of old.entries) assert.equal(sha(await bytes('public' + asset.sheet)), asset.sha256, asset.id);
  assert.ok(!old.entries.some(asset => registry.entries.some(fresh => fresh.id === asset.id)));
});
test('every action uses the correct physical delivery and Mugman has exactly zero offensive or healing effect', () => {
  for (const spec of RPG_SUMMON_SPECS_WAVE16) {
    const action = spec.kind === 'summon' ? CANONICAL_SUMMONS_WAVE16[spec.callerId].action : ROSTER_REINFORCEMENTS_WAVE16[spec.callerId].actionOverride;
    assert.ok(action, spec.id);
    if (spec.nativeRole === 'support') {
      assert.equal(action.dmg, 0); assert.equal(action.targeting.effect, 'guard');
      assert.equal(action.targeting.delivery, 'support'); assert.equal(action.targeting.targetSide, 'self');
      assert.equal(action.targeting.invulnerabilityDuration, 4.85); assert.equal(action.targeting.minTargets, 1);
      assert.equal(action.targeting.maxTargets, 1); assert.equal(action.targeting.invulnerabilityKind, 'mugman-super-art-ii');
    } else {
      assert.equal(action.targeting.effect, 'damage'); assert.equal(action.targeting.targetSide, 'enemy');
      assert.equal(action.targeting.delivery, ['gun','hand'].includes(spec.nativeRole) ? 'projectile' : 'melee');
    }
  }
  assert.equal(ROSTER_REINFORCEMENTS_WAVE16.raven_tt.performerHeroId, 'starfire_tt');
  assert.equal(ROSTER_REINFORCEMENTS_WAVE16.raven_tt.actionOverride.color, '#5cff43');
  assert.equal(CANONICAL_SUMMONS_WAVE16.aki_hayakawa.entityName, 'Fox Devil');
});
test('all 36 anatomical anchor centers are inspected opaque source pixels, including the sixteen real Fox mouth poses', async () => {
  let count = 0;
  for (const asset of registry.entries) {
    const { data, info } = await sharp(await bytes('public' + asset.sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const [phase, anchors] of Object.entries(asset.effectAnchors || {})) for (const [col, anchor] of anchors.entries()) {
      assert.equal(anchor.visuallyReviewed, true); assert.equal(anchor.space, 'packed-native-pixels');
      const row = asset.phases[phase].row;
      const alpha = data[((row * 256 + anchor.y) * info.width + col * 512 + anchor.x) * 4 + 3];
      assert.ok(alpha > 24); assert.equal(alpha, anchor.centerAlpha); count++;
    }
  }
  assert.equal(count, 36);
  for (const phase of ['arrival','preparation','attack','recovery']) for (let column = 0; column < 4; column++) {
    const native = getFoxDevilNativeFrameWave16({ phase, column });
    assert.equal(native.frame.index, native.frame.row * 4 + column); assert.ok(native.mouthAnchor);
    const right = projectFoxDevilMouthWave16({ phase, column, x: 500, y: 420, facing: 1, size: 250 });
    const left = projectFoxDevilMouthWave16({ phase, column, x: 500, y: 420, facing: -1, size: 250 });
    assert.ok(Math.abs(right.x + left.x - 1000) < 1e-9); assert.equal(right.y, left.y);
  }
  assert.equal(getFoxDevilNativeFrameWave16({ column: 4 }), null);
  assert.equal(projectFoxDevilMouthWave16({ x: NaN, y: 0, size: 20 }), null);
});
test('native fist, gauntlet and mouth reach the accepted locked contact on both sides without mutating simulation', () => {
  for (const spec of RPG_SUMMON_SPECS_WAVE16.filter(value => ['melee','bite'].includes(value.nativeRole))) for (const side of [-1,1]) for (const rotation of [0,.15]) {
    const target = { battleId: 'accepted-target', x: side > 0 ? 800 : 240, y: 400 };
    const scene = { descriptor: { universe: spec.universe, entityName: spec.entityName, action: { name: spec.actionName } },
      choreography: { travelTicks: 20 }, tick: 100, durationTicks: 200, impactTick: 100,
      impacted: true, visualContacts: [target], targets: [{ battleId: 'moved', x: 20, y: 20 }] };
    const state = { performer: { x: 400, y: 400, size: spec.bodyHeight, facing: side, rotation },
      caller: { x: side > 0 ? 200 : 840, y: 400 }, side, width: 1040, height: 520,
      tick: 100, attackStartTick: 80, arrivalEndTick: 30, returnStartTick: 150,
      arrivalProgress: 1, travelProgress: 1, returnProgress: 0 };
    const original = JSON.stringify({ scene, state }), result = place(scene, state);
    assert.equal(JSON.stringify({ scene, state }), original);
    assert.equal(result.sourceNativeContact.targetId, 'accepted-target');
    assert.equal(result.sourceNativeContact.column, 2); assert.equal(result.sourceNativeContact.accepted, true);
    assert.ok(result.sourceNativeContact.distanceToTarget < 1e-8);
    assert.ok(Math.abs(result.origin.x - target.x) < 1e-8);
    assert.ok(Math.abs(result.origin.y - (target.y - 520 * .095)) < 1e-8);
  }
  const unchanged = { performer: { x: 1, y: 2 } };
  assert.equal(place({ descriptor: { universe: 'old' } }, unchanged), unchanged);
});
test('actual muzzle and palm projection release only at attack column two and preserve mirrored physical coordinates', () => {
  for (const asset of registry.entries) for (const side of [-1,1]) for (const phase of ['arrival','preparation','attack','recovery']) for (let col = 0; col < 4; col++) {
    const raw = { performer: { x: 400, y: 400, size: 190, facing: side, rotation: .1 }, visuals: [], origin: { x: 4, y: 7 } };
    const snapshot = JSON.stringify(raw), result = project(raw, asset, { phase, col });
    assert.equal(JSON.stringify(raw), snapshot);
    const anchor = asset.effectAnchors?.[phase]?.[col];
    assert.equal(result.nativeMuzzleActive, !!anchor && ['gun','hand'].includes(asset.nativeRole) && phase === 'attack' && col === 2);
    if (!anchor) continue;
    const dx = (anchor.x - 256) / 256 * 190 * side, dy = Math.round(190 / 2 - 244 / 256 * 190) - 190 / 2 + anchor.y / 256 * 190;
    assert.ok(Math.abs(result.origin.x - 400 - dx * Math.cos(.1) + dy * Math.sin(.1)) < 1e-8);
    assert.ok(Math.abs(result.origin.y - 400 - dx * Math.sin(.1) - dy * Math.cos(.1)) < 1e-8);
  }
  const bt = ROSTER_SUMMON_CHOREOGRAPHIES_WAVE16.find(entry => entry.id === 'bt_7274_tf2-wave16-native');
  const faye = ROSTER_SUMMON_CHOREOGRAPHIES_WAVE16.find(entry => entry.id === 'faye_valentine-wave16-native');
  assert.equal(bt.scale * registry.entries.find(entry => entry.id === 'bt_7274_tf2-wave16').normalization.bodyCalibration.outputBodyHeight, 570);
  assert.equal(faye.scale * registry.entries.find(entry => entry.id === 'faye_valentine-wave16').normalization.bodyCalibration.outputBodyHeight, 190);
});
test('large BT keeps its stature and all sixteen source silhouettes inside a short GameCanvas', () => {
  const asset = registry.entries.find(entry => entry.id === 'bt_7274_tf2-wave16');
  const size = 132 * 570 / asset.normalization.bodyCalibration.outputBodyHeight;
  for (const facing of [-1,1]) {
    const raw = { width:1040,height:460,performer:{x:facing>0?230:810,y:299,size,facing} };
    const placed = place({descriptor:{universe:asset.universe,entityName:asset.entityName,action:{name:asset.actionName}}},raw);
    assert.equal(placed.performer.size,size);assert.equal(placed.sourceNativeEnvelope.preservesStature,true);
    const yOffset=Math.round(size/2-244/256*size)-size/2;
    for(const row of asset.normalization.rows)for(const {output:b}of row.frameBounds){
      for(const x of[b.left,b.left+b.width]){const actual=placed.performer.x+(x-256)/256*size*facing;assert.ok(actual>=0&&actual<=1040);}
      for(const y of[b.top,b.top+b.height]){const actual=placed.performer.y+yOffset+y/256*size;assert.ok(actual>=0&&actual<=460);}
    }
  }
});
