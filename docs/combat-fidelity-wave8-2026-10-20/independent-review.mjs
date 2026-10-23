// Independent regression replay for the four material visual defects found in
// review. It writes this report only; production code and atlases are read-only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';
import { HEROES_DB } from '../../src/game/heroes.js';
import { resolveMeleeSuper, resolveUniverseSummon } from '../../src/game/combatIdentity.js';
import { WAVE_8_PRESENTATION_DEFINITIONS } from '../../src/game/combat/presentationCatalogWave8.js';
import { getCharacterAnimationFrame } from '../../src/game/combat/characterAnimationCatalog.js';
import { getNativeSuperVisualStateWave8 as getState, drawNativeSuperVisualsWave8 as draw } from '../../src/game/combat/nativeSuperVisualsWave8.js';
import { resolveSummonAnimationAsset, getSummonAnimationFrame } from '../../src/game/combat/summonAnimationCatalog.js';
import { getSummonChoreographyState } from '../../src/game/combat/summonChoreography.js';
import { projectNativeSummonEffectOrigin } from '../../src/game/combat/rosterSummonChoreographyWave8.js';

const root = new URL('../../', import.meta.url), read = path => fs.readFileSync(new URL(path, root));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const hero = id => { const h = HEROES_DB.find(entry => entry.id === id); assert.ok(h, id); return h; };
const close = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-8, `${label}: ${a} != ${b}`);
const checks = [];
function recorder() {
  const calls = [], stack = []; let properties = { globalAlpha: 0.71, strokeStyle: '#123456', fillStyle: '#654321', lineWidth: 7 };
  const initial = { ...properties };
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => stack.push({ ...properties });
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); };
      return (...args) => {
        for (const a of args) if (typeof a === 'number') assert.ok(Number.isFinite(a), String(key));
        calls.push([key, ...args]);
      };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), String(key)); properties[key] = value; return true; }
  });
  return { ctx, calls, finish() { assert.equal(stack.length, 0); assert.deepEqual(properties, initial); } };
}
function visual(id, facing, progress, options = {}) {
  const actor = { ...hero(id), x: 500, y: 340, ...options.actor }, profile = resolveMeleeSuper(actor);
  const action = { duration: profile.duration, hitAt: profile.hitAt, elapsed: profile.duration * progress, facing, ...options.action };
  const target = { x: actor.x + facing * 100, y: actor.y, ...options.target };
  const input = { actor, profile, action, target, height: 72, contactVisual: { confirmed: false }, ...options };
  // Options can supply actor/action fragments without replacing their identity.
  input.actor = actor; input.action = action; input.target = target;
  const before = JSON.stringify(input), state = getState(input); assert.ok(state, id);
  const capture = recorder(); draw(capture.ctx, state); capture.finish();
  assert.equal(JSON.stringify(input), before, `${id}: visual projection mutated its inputs`);
  return { state, calls: capture.calls, input };
}

// 1. Starfire: the non-Fighter clock now contains an actual visible flight
// projection, whereas Fighter's real projectile position keeps priority.
let starfireCases = 0;
for (const facing of [-1, 1]) {
  const profile = resolveMeleeSuper(hero('starfire_tt')), impact = profile.hitAt / profile.duration, launch = impact * 0.55;
  const charge = visual('starfire_tt', facing, launch * 0.9);
  assert.equal(charge.calls.filter(call => call[0] === 'moveTo').length, 0); starfireCases++;
  for (const t of [0.2, 0.55, 0.999999]) {
    const { state, calls } = visual('starfire_tt', facing, launch + (impact - launch) * t);
    const orb = calls.find(call => call[0] === 'ellipse'); assert.ok(orb);
    close(orb[1], state.origin.x + (state.target.x - state.origin.x) * t, 'Starfire flight x');
    close(orb[2], state.origin.y + (state.target.y - 72 * 0.42 - state.origin.y) * t, 'Starfire flight y');
    assert.equal(calls.filter(call => call[0] === 'lineTo').length, 1); starfireCases++;
  }
  const contact = { confirmed: true, x: 500 + facing * 100, y: 340 };
  const hit = visual('starfire_tt', facing, impact, { contactVisual: contact });
  const impactRing = hit.calls.find(call => call[0] === 'ellipse'); assert.ok(impactRing);
  close(impactRing[1], contact.x); close(impactRing[2], contact.y - 72 * 0.42); starfireCases++;
  const miss = visual('starfire_tt', facing, 0.7);
  assert.equal(miss.calls.filter(call => ['moveTo', 'lineTo', 'ellipse'].includes(call[0])).length, 0); starfireCases++;
  const tracked = visual('starfire_tt', facing, 0.7, { projectileVisual: { phase: 'flight', x: 741, y: 211, elapsed: 0.15, travelProgress: 0.4 } });
  const physicalOrb = tracked.calls.find(call => call[0] === 'ellipse');
  close(physicalOrb[1], 741); close(physicalOrb[2], 211); starfireCases++;
}
checks.push({ id: 'starfire-flight-clock', cases: starfireCases, passed: true, scope: 'Pure Smash/RPG action-clock projection plus exact-position priority of the Fighter physical-projectile contract; no new gameplay event.' });

// 2. Monsoon: every fragment approaches contact before the engine hit, then
// remains at/scatters around the confirmed hit point. Misses have no target FX.
let monsoonCases = 0;
for (const facing of [-1, 1]) {
  const profile = resolveMeleeSuper(hero('monsoon_mgr')), impact = profile.hitAt / profile.duration, launch = impact * 0.55;
  for (const travel of [0.2, 0.6, 0.999999]) {
    const { state, calls } = visual('monsoon_mgr', facing, launch + (impact - launch) * travel);
    const rectangles = calls.filter(call => call[0] === 'strokeRect'); assert.equal(rectangles.length, 4);
    for (const [index, call] of rectangles.entries()) {
      const t = travel ** (1 + index * 0.12);
      close(call[1] + 3, state.origin.x + (state.target.x - state.origin.x) * t, 'Monsoon flight x');
      close(call[2] + 2, state.origin.y + (state.target.y - 72 * 0.42 - state.origin.y) * t + Math.sin(t * Math.PI) * (index - 1.5) * 8, 'Monsoon flight y');
    }
    monsoonCases++;
  }
  const contact = { confirmed: true, x: 500 + facing * 100, y: 340 };
  const hit = visual('monsoon_mgr', facing, impact, { contactVisual: contact });
  const rectangles = hit.calls.filter(call => call[0] === 'strokeRect'); assert.equal(rectangles.length, 4);
  for (const r of rectangles) { close(r[1] + 3, contact.x); close(r[2] + 2, contact.y - 72 * 0.42); } monsoonCases++;
  const late = visual('monsoon_mgr', facing, 0.8, { contactVisual: contact });
  for (const r of late.calls.filter(call => call[0] === 'strokeRect')) assert.ok(Math.hypot(r[1] + 3 - contact.x, r[2] + 2 - (contact.y - 72 * 0.42)) <= 18 + 1e-8); monsoonCases++;
  const miss = visual('monsoon_mgr', facing, 0.8);
  assert.equal(miss.calls.filter(call => ['strokeRect', 'ellipse'].includes(call[0])).length, 0); monsoonCases++;
}
checks.push({ id: 'monsoon-pre-impact-arrival', cases: monsoonCases, passed: true, scope: 'Four pre-impact fragments, exact hit-time arrival, contact-only late scatter, and no target accents after a miss/shield rejection.' });

// 3. These native-cell orifice centers were selected independently during the
// visual review, using the actual opening rather than the surrounding halo.
const measuredAnchors = {
  super: [{ x: 202, y: 118 }, { x: 164, y: 117 }, { x: 158, y: 119 }, null],
  fatality: [null, { x: 189, y: 121 }, { x: 160, y: 120 }, null]
};
const cyborg = hero('cyborg_tt'), cyborgFrame = getCharacterAnimationFrame(cyborg, { phase: 'super', progress: 0.55 });
const cyborgAsset = cyborgFrame.asset;
const { data: cyborgPixels, info: cyborgInfo } = await sharp(fileURLToPath(new URL(`public${cyborgAsset.sheet}`, root))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let cyborgCases = 0, sampledOpaqueOrifices = 0;
for (const phase of ['super', 'fatality']) for (let col = 0; col < 4; col++) for (const facing of [-1, 1]) for (const height of [72, 142, 208]) {
  const progress = [0.1, 0.35, 0.6, 0.9][col];
  const actor = { presentationPhase: phase, presentationFrame: { row: cyborgAsset.phases[phase].row, col }, x: 357, y: 314 };
  const { state, calls, input } = visual('cyborg_tt', facing, progress, { actor, height, applyMotion: false, contactVisual: { confirmed: true, x: 357 + facing * 100, y: 314 } });
  const frame = getCharacterAnimationFrame(input.actor, { phase, progress, impactProgress: state.impactProgress }), anchor = measuredAnchors[phase][col];
  assert.equal(state.nativeMuzzleActive, !!anchor);
  if (anchor) {
    const scale = height / 256 * frame.asset.normalization.rows[frame.row].renderScale;
    close(state.origin.x, 357 + (anchor.x - 128) * scale * facing, 'Cyborg muzzle x');
    close(state.origin.y, 314 + (anchor.y - 244) * scale, 'Cyborg muzzle y');
    const pixel = (((frame.row * 256 + anchor.y) * cyborgInfo.width) + col * 256 + anchor.x) * 4;
    assert.ok(cyborgPixels[pixel + 3] > 80, `${phase}/${col}: measured orifice is transparent`); sampledOpaqueOrifices++;
    if (state.release) {
      const ray = calls.find(call => call[0] === 'moveTo'); assert.ok(ray);
      close(ray[1], state.origin.x); close(ray[2], state.origin.y);
    }
  } else {
    assert.equal(calls.filter(call => ['moveTo', 'lineTo'].includes(call[0])).length, 0, 'inactive cannon emits a ray');
    for (const ring of calls.filter(call => call[0] === 'ellipse')) close(ring[1], state.target.x, 'inactive cannon may retain only contact light');
  }
  cyborgCases++;
}
// Replay the real Fighter method, not only the helper, to verify that finale
// phase/column data reaches the projection with the already-moved scene origin.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
try {
  const { EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js');
  const engine = Object.create(EngineFighter.prototype); engine.width = 1200;
  const profile = resolveMeleeSuper(cyborg);
  for (const facing of [-1, 1]) {
    const capture = recorder(), row = cyborgAsset.phases.fatality.row, col = 2;
    engine.drawScriptedPresentationEffect(capture.ctx, { effect: { active: true, kind: 'sonic-cannon' }, asset: { row, col }, progress: 0.6, y: 0 },
      profile, 357, 314, facing, 'fatality');
    capture.finish();
    const ray = capture.calls.find(call => call[0] === 'moveTo'); assert.ok(ray);
    const scale = 208 / 256 * cyborgAsset.normalization.rows[row].renderScale;
    close(ray[1], 357 + (160 - 128) * scale * facing); close(ray[2], 314 + (120 - 244) * scale); cyborgCases++;
  }
} finally { await vite.close(); }
checks.push({ id: 'cyborg-native-muzzle-projection', cases: cyborgCases, passed: true, sampledOpaqueOrifices, measuredNativeCellAnchors: measuredAnchors,
  scope: 'Both native phases, four columns, both facings and three heights; real baseline/renderScale, already-moved scene coordinates, inactive-cannon suppression, and the actual Fighter presentation method.' });

// 4. Both directional guards now mirror their opening; supportive projections
// stay local and never acquire enemy contact points even if one is supplied.
let guardCases = 0;
for (const id of ['raven_tt', 'saejima_yakuza']) {
  const right = visual(id, 1, 0.6), left = visual(id, -1, 0.6);
  const r = right.calls.find(call => call[0] === 'arc'), l = left.calls.find(call => call[0] === 'arc'); assert.ok(r && l);
  close(l[4] - r[4], Math.PI); close(l[5] - r[5], Math.PI);
  for (const t of [0, 0.2, 0.5, 0.9, 1]) {
    const ra = r[4] + (r[5] - r[4]) * (1 - t), la = l[4] + (l[5] - l[4]) * t;
    close(Math.cos(la), -Math.cos(ra)); close(Math.sin(la), Math.sin(ra));
  }
  guardCases += 2;
}
for (const id of ['raven_tt', 'saejima_yakuza', 'senshi_meshi', 'chilchuck_meshi', 'falin_meshi']) for (const facing of [-1, 1]) {
  const { state } = visual(id, facing, 0.7, { contactVisual: { confirmed: true, x: 1000, y: 111 } });
  assert.equal(state.supportive, true); assert.equal(state.contactEligible, false); assert.deepEqual(state.target, state.ground); guardCases++;
}
checks.push({ id: 'support-guard-facing', cases: guardCases, passed: true, scope: 'Raven/Saejima arc opening mirrors exactly, with all five support roles rejecting enemy contact anchors.' });

// Additional independent probes: all twenty helpers remain finite and pure;
// exact roster partners still resolve, and their wide-cell origin mirrors.
let purityCases = 0, canvasCommands = 0;
for (const [id] of WAVE_8_PRESENTATION_DEFINITIONS) for (const facing of [-1, 1]) for (const p of [0, 0.1, 0.2, 0.3, 0.409, 0.41, 0.5, 0.75, 1]) {
  const r = visual(id, facing, p, { contactVisual: { confirmed: p >= 0.5, x: 500 + facing * 100, y: 340 } });
  canvasCommands += r.calls.length; purityCases++;
}
let rosterCases = 0;
for (const id of ['robin_tt', 'majima_yakuza', 'blade_wolf_mgr', 'marcille_meshi']) {
  const actor = { ...hero(id), x: 140, y: 330, homeX: 140, homeY: 330 }, descriptor = resolveUniverseSummon(actor), asset = resolveSummonAnimationAsset(descriptor);
  assert.ok(asset); assert.equal(asset.bodySource, 'roster-performer'); assert.equal(asset.frameWidth, 512); assert.equal(asset.frameHeight, 256);
  for (const changed of [{ universe: 'Wrong' }, { kind: 'summon' }, { performerRole: 'caller' }, { performer: { ...descriptor.performer, id: 'wrong', sourceHeroId: 'wrong' } }, { sourceHeroId: 'wrong' }]) assert.equal(resolveSummonAnimationAsset({ ...descriptor, ...changed }), null);
  rosterCases += 6;
  if (id === 'robin_tt') for (const side of ['player', 'enemy']) for (const tick of [0, 20, 40, 55, 65, 80, 90, 99, 110, 130, 150, 170, 191]) {
    const scene = { actor, descriptor, tick, durationTicks: 192, impactTick: 99, side, targets: [{ x: 600, y: 330 }] };
    const before = JSON.stringify(scene), choreography = getSummonChoreographyState(scene, { width: 760, height: 420 }), frame = getSummonAnimationFrame(scene, choreography);
    assert.ok(frame); const projected = projectNativeSummonEffectOrigin(choreography, asset, frame), anchor = asset.effectAnchors[frame.phase][frame.col];
    if (anchor) {
      close(projected.origin.x, choreography.performer.x + (anchor.x - 256) / 256 * choreography.performer.size * choreography.side);
      close(projected.origin.y, choreography.performer.y + (anchor.y - 244) / 256 * choreography.performer.size);
    } else assert.equal(projected.visuals.some(visual => visual.kind.startsWith('roster-sonic-')), false);
    assert.equal(JSON.stringify(scene), before); rosterCases++;
  }
}
checks.push({ id: 'finite-pure-and-strict-identities', cases: purityCases + rosterCases, pureVisualCases: purityCases, recordedCanvasCommands: canvasCommands,
  exactRosterCases: rosterCases, passed: true, scope: 'Finite coordinates, balanced Canvas state, immutable inputs, exact same-universe partner identity, and separate Cyborg512x256 muzzle projection.' });

const sourcePaths = [
  'src/game/combat/abilities/abilitiesWave8.js', 'src/game/combat/abilities/catalog.js', 'src/game/combat/presentationCatalogWave8.js',
  'src/game/combat/nativeSuperVisualsWave8.js', 'src/game/combat/characterSuperVisuals.js', 'src/game/combat/characterAnimationCatalog.js',
  'src/game/combat/characterAnimationsWave8PartA.generated.json', 'src/game/combat/rosterSummonChoreographyWave8.js',
  'src/game/combat/summonAnimationCatalog.js', 'src/game/combat/summonAnimationsWave8.generated.json', 'src/game/combat/summonChoreography.js',
  'src/game/engineRpg.js', 'src/game/engineFighter.js', 'src/game/engineSmash.js', 'src/game/renderer.js',
  'docs/combat-fidelity-wave8-2026-10-20/independent-review.mjs'
];
const report = {
  schemaVersion: 1, date: '2026-10-20', kind: 'independent-wave8-visual-regression-review', reviewer: '/root/review_wave8', passed: true,
  reproduction: 'node docs/combat-fidelity-wave8-2026-10-20/independent-review.mjs --check',
  scope: 'Read-only production review and deterministic helper/Fighter-method replay. No full browser flow, gameplay-suite result or source-frame certification is claimed here.',
  fixedDefects: ['Missing Starfire flight outside the physical Fighter projectile path', 'Monsoon fragments arriving after the damage tick', 'Cyborg32 beam beginning away from the real native cannon orifice', 'Directional support guard opening not mirrored for P2'],
  checks, sourceHashes: Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))])),
  nativeCyborgSheet: { path: `public${cyborgAsset.sheet}`, sha256: sha(read(`public${cyborgAsset.sheet}`)) },
  modifiedProductionFiles: [], source1to1Verified: false
};
const output = new URL('independent-review.json', import.meta.url), encoded = JSON.stringify(report, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(output, 'utf8'), encoded, 'independent report is stale');
else fs.writeFileSync(output, encoded);
console.log(JSON.stringify({ passed: report.passed, check: process.argv.includes('--check'), reviewDomains: checks.length, cases: checks.reduce((n, c) => n + c.cases, 0), sourceHashes: sourcePaths.length }));
