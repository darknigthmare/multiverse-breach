import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../src/game/combat/characterAnimationCatalog.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { getMeleeAnimationFrame, getMeleeAnimationManifest, validateMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { MELEE_STATES, MELEE_TRANSITION_DATA } from '../src/game/melee/meleeStateMachine.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationFrame, getStageAnimationProfile, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { measureCombatFidelity } from './combatFidelityAudit.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const stateRows = entry => Array.isArray(entry.states)
  ? entry.states.map((state, row) => [state, { row, frames: entry.columns }]) : Object.entries(entry.states);
const projectReference = path => path.startsWith('public/') ? path : `public${path}`;
const old = json('docs/combat-fidelity-wave2-2026-10-18/baseline.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const partPaths = ['src/game/combat/characterAnimationsWave2PartA.generated.json', 'src/game/combat/characterAnimationsWave2PartB.generated.json'];
const ff8Ids = ['squall_ff8', 'rinoa_ff8', 'quistis_ff8', 'seifer_ff8', 'laguna_ff8', 'zell_ff8', 'selphie_ff8', 'irvine_ff8'];
const cloudPaths = ['src/game/combat/cloudMeleeMotion.generated.json', 'src/game/combat/cloudMeleeCombat.generated.json'];
const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const firstMechanismIds = [
  'ff7-reactor-mako-circulation', 'dbz-cell-games-cloud-drift', 'dbz-namek-water-refraction', 'dbz-time-chamber-hourglasses',
  'naruto-forest-canopy-wind', 'naruto-valley-waterfall-current', 'matrix-operator-terminal-refresh', 'matrix-authored-digital-curtain',
  'doom-uac-mars-cooling-cycle', 'doom-nekravol-chain-and-gate-cycle', 'halo-truth-and-reconciliation-gravity-lift',
  'halo-installation04-forerunner-beacons', 'stargate-sgc-four-phase-event-horizon', 'portal-aperture-wall-aperture-phases',
  'rick-morty-garage-portal-phases', 'daft-punk-alive-led-sequencer', 'demon-slayer-infinity-background-screens'
];
const noop = () => {};
let vite, drawPixelSprite, EngineFighter, EngineSmash;
const engines = [];
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

const recorder = () => {
  const calls = [], stack = [];
  let properties = { globalAlpha: 1, globalCompositeOperation: 'source-over' };
  return new Proxy({}, {
    get(_target, key) {
      if (key === 'calls') return calls;
      if (key === 'depth') return stack.length;
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      if (key === 'measureText') return text => ({ width: String(text).length * 7 });
      return (...args) => { args.filter(arg => typeof arg === 'number').forEach(arg => assert.ok(Number.isFinite(arg), `${String(key)} received NaN/Infinity`)); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value)); properties[key] = value; calls.push(['set', key, value]); return true; }
  });
};

async function inspectAtlas(entry, rowLabels) {
  const bytes = read(`public${entry.sheet}`);
  assert.equal(sha256(bytes), entry.sha256, entry.sheet);
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1024); assert.equal(metadata.height, entry.height ?? entry.dimensions.height); assert.equal(metadata.hasAlpha, true);
  assert.equal(entry.frameWidth ?? entry.dimensions.cellWidth, 256); assert.equal(entry.frameHeight ?? entry.dimensions.cellHeight, 256);
  assert.equal(sha256(read(entry.sourceImage)), entry.sourceImageSha256 ?? entry.sourceHash);
  assert.equal(sha256(read(projectReference(entry.referenceAsset))), entry.referenceAssetSha256 ?? entry.referenceHash);
  if (entry.archivedReferenceAsset) assert.equal(sha256(read(entry.archivedReferenceAsset)), entry.referenceAssetSha256 ?? entry.referenceHash);
  for (const source of entry.sourceImages || []) assert.equal(sha256(read(source.path)), source.sha256);
  for (const row of entry.normalization.rows || []) if (row.sourceImage) assert.equal(sha256(read(row.sourceImage)), row.sourceImageSha256);
  const rgba = await sharp(bytes).ensureAlpha().raw().toBuffer();
  const hashes = new Map();
  for (const [label, spec] of rowLabels) {
    const row = spec.row;
    assert.ok(Number.isInteger(row) && row >= 0 && row < entry.rows, label);
    assert.equal(spec.frames, 4, label);
    const rowHashes = [];
    for (let col = 0; col < 4; col++) {
      const frame = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        const alpha = rgba[offset + 3];
        if (alpha > 4) visible++;
        if (alpha > 0) rgba.copy(frame, (y * 256 + x) * 4, offset, offset + 4);
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${entry.id}:${label}:${col}: visible crop`);
      }
      assert.ok(visible > 300, `${entry.id}:${label}:${col}: empty native pose`);
      rowHashes.push(sha256(frame));
    }
    assert.equal(new Set(rowHashes).size, 4, `${entry.id}:${label}: repeated cells`);
    hashes.set(label, rowHashes);
  }
  return { hashes, rgba };
}

const fakeImages = callback => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 2048;
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); }
    get src() { return this._src; }
  };
  try { return callback(); } finally { globalThis.Image = OriginalImage; }
};

const cloudMelee = () => {
  const cloud = hero('cloud_ff7');
  const engine = new EngineSmash(960, 540, [cloud], { monsters: [cloud], bosses: [], customRoster: [cloud] },
    { add: noop }, noop, noop, { universe: cloud.universe, mode: 'Smash', disableHazards: true,
      customBattle: { opponentControl: 'p2', singleRoster: true } });
  engines.push(engine); engine.syncPreMatchFromServer(3000); engine.ensureLocalVersusLeaders();
  engine.platforms = [{ x1: 0, x2: 960, y: engine.groundY }];
  for (const [index, actor] of [...engine.heroes, ...engine.enemies].entries()) Object.assign(actor,
    { state: 'idle', stateElapsed: 0, x: 300 + index * 300, y: engine.groundY, vx: 0, vy: 0, facing: 1, action: null });
  return engine;
};

const moveTick = (engine, actor, target, side, keys = { right: true }) => {
  engine.updateLocalVersusMovement(actor, target, keys, side);
  engine.updateLocalVersusActor(actor);
};

test('the pre-integration snapshot and the first eight generated atlases remain immutable', () => {
  assert.equal(sha256(read('docs/combat-fidelity-wave2-2026-10-18/baseline.json')), 'b0e84c1e8dc8fdb7af93a373091438cd06400aaab1f57c93b16beb14951457b6');
  assert.equal(old.meleeBindings.nativePresentationHeroes, 8);
  assert.deepEqual(old.meleeBindings.dedicatedManifestHeroes, []);
  assert.equal(old.presentations.scriptedHeroes, 41);
  assert.equal(old.stages.sceneMechanismDefinitions, 17);
  for (const path of ['src/game/combat/characterAnimations.generated.json', 'docs/combat-fidelity-2026-10-18/character-animation-provenance.json']) assert.equal(sha256(read(path)), old.inputHashes[path], path);
  for (const entry of old.meleeBindings.nativePresentationEntries) assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256, entry.heroId);
});

test('eight new FF8 identities join the runtime union with256 actual distinct poses and exact sources', async () => {
  const newEntries = partPaths.flatMap(path => json(path).entries);
  assert.deepEqual(sorted(newEntries.map(entry => entry.heroId)), sorted(ff8Ids));
  const union = getCharacterAnimationAssets();
  assert.deepEqual(sorted(union.filter(entry => [...old.meleeBindings.nativePresentationHeroIds, ...ff8Ids].includes(entry.heroId)).map(entry => entry.heroId)), sorted([...old.meleeBindings.nativePresentationHeroIds, ...ff8Ids]));
  const allPixels = new Set();
  for (const entry of newEntries) {
    assert.equal(entry.universe, 'Final Fantasy VIII'); assert.equal(hero(entry.heroId).universe, entry.universe);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'p2-copy', sourceHeroId: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }), null);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(phases));
    phases.forEach((phase, row) => assert.equal(entry.phases[phase].row, row));
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.phases));
    for (const [phase, actual] of hashes) {
      const review = entry.visualValidation.phaseReviews.find(value => value.phase === phase);
      assert.deepEqual(actual, review.frameHashes, `${entry.heroId}:${phase}: pixel review is stale`);
      actual.forEach(hash => { assert.equal(allPixels.has(hash), false, 'two FF8 cells use the same RGBA bitmap'); allPixels.add(hash); });
    }
  }
  assert.equal(allPixels.size, newEntries.length * 32);
  for (const part of ['a', 'b']) {
    const provenance = json(`docs/combat-fidelity-wave2-2026-10-18/part-${part}-provenance.json`);
    assert.equal(provenance.model, null); assert.equal(provenance.generationId, null);
    assert.equal(provenance.canon1to1Verified, false); assert.equal(provenance.networkVerified, false);
    for (const source of provenance.sources) {
      assert.equal(source.model, null); assert.equal(source.generationId, null);
      assert.equal(sha256(read(source.archivedPath || source.path)), source.sha256);
    }
  }
});

test('all FF8 phases draw the new native source rectangles on both sides and synchronize super contact', () => fakeImages(() => {
  for (const entry of partPaths.flatMap(path => json(path).entries)) for (const [phase, spec] of Object.entries(entry.phases)) {
    for (const facing of [1, -1]) {
      const columns = new Set();
      for (const progress of [0, 0.3, 0.6, 1]) {
        const actor = { ...hero(entry.heroId), id: 'runtime-p2', sourceHeroId: entry.heroId, presentationPhase: phase, presentationProgress: progress };
        const frame = getCharacterAnimationFrame(actor);
        const ctx = recorder(); drawPixelSprite(ctx, 160, 350, actor, 0, facing, 90, 'melee');
        const draw = ctx.calls.find(call => call[0] === 'drawImage');
        assert.ok(draw); assert.equal(draw[1].src, entry.sheet); assert.equal(draw[2], frame.col * 256); assert.equal(draw[3], spec.row * 256);
        assert.equal(draw[4], 256); assert.equal(draw[5], 256); assert.equal(ctx.depth, 0);
        assert.ok(ctx.calls.some(call => call[0] === 'scale' && call[1] === facing)); columns.add(frame.col);
      }
      assert.equal(columns.size, 4, `${entry.heroId}:${phase}`);
    }
    const actor = hero(entry.heroId);
    assert.equal(getCharacterAnimationFrame(actor, { phase: 'super', progress: 0.419, impactProgress: 0.42 }).col, 1);
    assert.equal(getCharacterAnimationFrame(actor, { phase: 'super', progress: 0.42, impactProgress: 0.42 }).col, 2);
  }
}));

test('five missing FF8 presentations preserve the41 existing profiles and use their own source techniques', () => {
  for (const entry of old.presentations.entries) for (const phase of entry.phases) {
    const current = CHARACTER_PRESENTATIONS[entry.id].phases[phase.phase];
    assert.equal(current.id, phase.scriptId); assert.equal(current.effect.kind, phase.effectKind);
    if (entry.id === 'rinoa_ff8') {
      assert.match(phase.sourceReference, /Angelo manque/);
      assert.match(current.sourceReference, /illustrations natives/);
      assert.deepEqual(current.missingAssets, [], 'the integrated Angelo artwork is still reported missing');
    } else if (['vincent_ff7', 'sakura_haruno_young'].includes(entry.id)) {
      assert.deepEqual(current.missingAssets, [], 'wave4 artwork is still reported missing');
      assert.match(current.sourceReference, /atlas natif|illustrations natives/);
    } else assert.equal(current.sourceReference, phase.sourceReference);
  }
  const actions = { seifer_ff8: 'No Mercy', laguna_ff8: 'Desperado', zell_ff8: 'My Final Heaven', selphie_ff8: 'The End', irvine_ff8: 'Hyper Shot' };
  for (const [id, action] of Object.entries(actions)) {
    assert.equal(CHARACTER_PRESENTATIONS[id].sourceAction, action);
    for (const phase of PRESENTATION_PHASES) {
      const script = resolvePresentationScript(hero(id), phase);
      assert.equal(script.universe, 'Final Fantasy VIII'); assert.equal(script.provenance.canonicalSequence, false);
      const samples = [0, 0.2, 0.4, 0.6, 0.8, 1].map(progress => samplePresentationScript(script, script.duration * progress));
      assert.ok(new Set(samples.map(value => `${value.asset.sheet}:${value.asset.row}:${value.asset.col}`)).size > 1);
    }
  }
  const calm = resolvePresentationScript(hero('selphie_ff8'), 'fatality');
  assert.equal(calm.effect.kind, 'the-end-meadow'); assert.ok(calm.beats.every(beat => beat.state === 'idle'));
  assert.ok(calm.beats.every(beat => beat.x === 0), 'The End became a physical attack');
});

test('new FF8 presentation rendering never changes HP, meter, outcome or projectiles', () => fakeImages(() => {
  for (const id of ['seifer_ff8', 'laguna_ff8', 'zell_ff8', 'selphie_ff8', 'irvine_ff8']) {
    let completed = 0;
    const engine = new EngineFighter(960, 540, [hero(id)], [hero('cloud_ff7')], { add: noop }, noop, () => { completed++; }, { opponentControl: 'p2' });
    engines.push(engine);
    const snapshot = () => JSON.stringify({ hp: [engine.getActive('player').currentHp, engine.getActive('cpu').currentHp],
      meters: [engine.getActive('player').meter, engine.getActive('cpu').meter], wins: engine.roundWins, result: engine.result, projectiles: engine.projectiles });
    const original = snapshot();
    for (const phase of PRESENTATION_PHASES) {
      const queuePhase = ['roundVictory', 'roundDefeat'].includes(phase) ? 'roundResult' : phase === 'defeat' ? 'victory' : phase;
      const winner = ['roundDefeat', 'defeat'].includes(phase) ? 'cpu' : 'player';
      engine.presentationQueue = []; engine.queuePresentation(queuePhase, winner); engine.presentation = engine.presentationQueue.shift();
      for (const progress of [0.3, 0.7]) {
        engine.presentation.remaining = engine.presentation.duration * (1 - progress);
        const ctx = recorder(); engine.drawCharacterPresentation(ctx, 0); assert.equal(ctx.depth, 0);
        assert.ok(ctx.calls.some(call => call[0] === 'drawImage'));
      }
    }
    assert.equal(snapshot(), original, `${id}: rendering mutated the match`); assert.equal(completed, 0);
  }
}));

test('Seifer’s corrected base costume has16 real poses and is routed separately from his32 presentation poses', async () => {
  const entries = json('src/game/combat/characterSpriteCorrectionsWave2.generated.json').entries;
  assert.deepEqual(entries.map(entry => entry.heroId), ['seifer_ff8']);
  const entry = entries[0];
  assert.equal(entry.universe, 'Final Fantasy VIII'); assert.equal(entry.width, 1024); assert.equal(entry.height, 1024);
  assert.equal(entry.model, null); assert.equal(entry.generationId, null); assert.equal(entry.canon1to1Verified, false);
  assert.match(entry.sourceReference, /pale coat|manteau/i); assert.match(entry.sourceReference, /Hyperion/);
  assert.equal(sha256(read(entry.referenceImage)), entry.referenceAssetSha256);
  const { hashes } = await inspectAtlas(entry, Object.entries(entry.states));
  assert.equal(new Set([...hashes.values()].flat()).size, 16);
  for (const state of ['idle', 'run', 'attack', 'hit']) {
    assert.equal(getHeroSpriteSheetSrc({ ...hero('seifer_ff8'), state }, 'melee'), entry.sheet);
    assert.notEqual(getHeroSpriteSheetSrc({ ...hero('seifer_ff8'), state, universe: 'Unrelated QA universe' }, 'melee'), entry.sheet);
  }
  assert.notEqual(resolveCharacterAnimationAsset(hero('seifer_ff8')).sheet, entry.sheet);
});

test('Cloud’s complete manifest binds45 distinct native rows and180 genuinely different visible cells', async () => {
  const entries = cloudPaths.flatMap(path => json(path).entries);
  assert.equal(entries.length, 6);
  const rows = entries.flatMap(entry => stateRows(entry).map(([state]) => state));
  assert.deepEqual(sorted(rows), sorted(MELEE_STATES)); assert.equal(new Set(rows).size, 45);
  const pixelHashes = new Set();
  for (const entry of entries) {
    assert.equal(entry.heroId, 'cloud_ff7'); assert.equal(entry.universe, 'Final Fantasy VII');
    assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
    assert.equal(entry.provenance.nativeArtwork || entry.provenance.nativeGeneratedArtwork, true);
    assert.equal(entry.provenance.canonicalVerified ?? entry.provenance.canonicalAnimationVerified, false);
    const { hashes, rgba } = await inspectAtlas(entry, stateRows(entry));
    for (const actual of hashes.values()) actual.forEach(hash => { assert.equal(pixelHashes.has(hash), false, `${entry.id}: a state reuses an earlier bitmap`); pixelHashes.add(hash); });
    for (let row = entry.activeRows ?? stateRows(entry).length; row < 8; row++) for (let pixel = row * 256 * 1024; pixel < (row + 1) * 256 * 1024; pixel++) assert.equal(rgba[pixel * 4 + 3], 0, 'unused rows were presented as additional state art');
  }
  assert.equal(pixelHashes.size, 180);
  const manifest = getMeleeAnimationManifest('cloud_ff7'); assert.ok(manifest);
  assert.equal(manifest.dedicatedStateRows, true); assert.equal(manifest.source1to1Verified, false);
  assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
  assert.equal(new Set(MELEE_STATES.map(state => `${manifest.animations[state].sheet}:${manifest.animations[state].row}`)).size, 45);
  for (const state of MELEE_STATES) {
    const animation = manifest.animations[state];
    assert.equal(animation.frameCount, 4); assert.deepEqual(animation.events, []); assert.deepEqual(animation.hitboxes, []); assert.deepEqual(animation.rootMotion, []);
    assert.ok(entries.some(entry => entry.sheet === animation.sheet && stateRows(entry).some(([name, spec]) => name === state && spec.row === animation.row)));
  }
  assert.equal(resolveCombatAbility(hero('cloud_ff7'), 'secondary').name, 'Braver');
  const specialAtlas = entries.find(entry => stateRows(entry).some(([state]) => state === 'special'));
  assert.match(specialAtlas.sourceReference, /Braver/i);
  assert.doesNotMatch(specialAtlas.sourceReference.split('The earlier')[0], /Cross.slash/i);
  for (const state of ['special', 'chargeRelease']) {
    const atlas = entries.find(entry => stateRows(entry).some(([name]) => name === state));
    const row = atlas.normalization.rows.find(value => value.state === state);
    assert.match(row.visualReview.action, /Braver/i, `${state}: active artwork must depict the authored secondary`);
    assert.match(row.sourceImage, /braver/i, `${state}: superseded Cross-slash artwork remained active`);
    assert.equal(row.sourceRow, state === 'special' ? 0 : 1);
  }
  for (const generation of json(cloudPaths[0]).generations) {
    assert.equal(generation.model, null); assert.equal(generation.generationId, null);
    assert.equal(sha256(read(generation.sourceImage)), generation.sha256);
    assert.equal(sha256(read(generation.prompt)), generation.promptSha256);
    for (const reference of generation.referencedImages) assert.equal(sha256(read(reference.path)), reference.sha256);
    if (generation.rejected) assert.equal(generation.retainedPoses, 0);
  }
  const archive = json('docs/combat-fidelity-wave2-2026-10-18/cloud-sources/source-archive-manifest.json');
  assert.equal(archive.model, null); assert.equal(archive.generationId, null);
  for (const record of archive.records) {
    const bytes = read(record.path); assert.equal(bytes.length, record.bytes); assert.equal(sha256(bytes), record.sha256);
  }
});

test('all45 Cloud states reach the real renderer; explicit presentations and full Omnislash remain separate', () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest('cloud_ff7'); assert.ok(manifest);
  for (const state of MELEE_STATES) for (const facing of [1, -1]) {
    const actor = { ...hero('cloud_ff7'), state, stateElapsed: 0.08 };
    const frame = getHeroMeleeAnimationFrame(actor, 80); const ctx = recorder();
    const before = JSON.stringify(actor); drawPixelSprite(ctx, 200, 400, actor, 4.8, facing, 96, 'melee');
    const draw = ctx.calls.find(call => call[0] === 'drawImage'); assert.ok(draw, state);
    assert.equal(draw[1].src, frame.animation.sheet, `${state}: automatic presentation concealed the core state`);
    assert.equal(draw[2], frame.col * 256); assert.equal(draw[3], frame.row * 256); assert.equal(draw[4], 256); assert.equal(draw[5], 256);
    assert.equal(JSON.stringify(actor), before); assert.equal(ctx.depth, 0);
  }
  const oldAsset = resolveCharacterAnimationAsset(hero('cloud_ff7'));
  for (const actor of [
    { ...hero('cloud_ff7'), state: 'special', presentationPhase: 'super', presentationProgress: 0.6 },
    { ...hero('cloud_ff7'), state: 'special', action: { type: 'super', elapsed: 0.6, duration: 1, hitAt: 0.4 } },
    { ...hero('cloud_ff7'), state: 'special', action: { superProfile: {}, elapsed: 0.6, duration: 1, hitAt: 0.4 } }
  ]) {
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 36, 1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, oldAsset.sheet, 'Braver core state replaced the full Omnislash');
  }
}));

test('Cloud clocks loop, complete transitions and hold attack preparation until the actual impact', () => {
  const manifest = getMeleeAnimationManifest('cloud_ff7'); assert.ok(manifest);
  for (const state of MELEE_STATES) {
    const spec = manifest.animations[state];
    const final = getMeleeAnimationFrame(manifest, state, 100000);
    assert.ok(final.col >= 0 && final.col < 4);
    if (spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, 0).col, getMeleeAnimationFrame(manifest, state, 4 / spec.fps * 1000).col, state);
    else assert.equal(final.frame, 3, `${state}: non-looping state never settles`);
    if (MELEE_TRANSITION_DATA[state] && !spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, MELEE_TRANSITION_DATA[state].duration * 1000 - 0.01).frame, 3, `${state}: runtime transition cuts off the last pose`);
  }
  for (const state of ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'ledgeAttack']) {
    const action = { duration: 0.9, hitAt: 0.31, elapsed: 0.309 };
    const original = JSON.stringify(action);
    assert.equal(getMeleeAnimationFrame(manifest, state, 309, { action }).frame, 1, `${state}: contact before impact`);
    assert.equal(getMeleeAnimationFrame(manifest, state, 310, { action: { ...action, elapsed: 0.31 } }).frame, 2, state);
    assert.equal(getMeleeAnimationFrame(manifest, state, 900, { action: { ...action, elapsed: 0.9 } }).frame, 3, state);
    assert.equal(JSON.stringify(action), original);
  }
});

test('Cloud’s measured hanging hands contain real pixels and attach to either physical platform edge', async () => {
  const entry = json('src/game/combat/cloudMeleeCombat.generated.json').entries.find(value => value.id === 'cloud-ledge');
  const rgba = await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer();
  const manifest = getMeleeAnimationManifest('cloud_ff7');
  const platform = { x1: 150, x2: 620, y: 170 };
  let attached = 0;
  for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) {
    const row = entry.states[state].row;
    for (const measurement of entry.normalization.contactAnchorMeasurements[state]) {
      if (!measurement.contact) continue;
      let visibleContact = 0;
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const pixel = ((row * 256 + measurement.y + dy) * 1024 + measurement.frame * 256 + measurement.x + dx) * 4;
        if (rgba[pixel + 3] > 24) visibleContact++;
      }
      assert.ok(visibleContact >= 60, `${state}:${measurement.frame}: anchor is in empty alpha rather than the measured glove`);
      for (const side of ['left', 'right']) fakeImages(() => {
        const elapsed = (measurement.frame + 0.01) / manifest.animations[state].fps;
        const actor = { ...hero('cloud_ff7'), id: 'copy-p2', sourceHeroId: 'cloud_ff7', state, stateElapsed: elapsed,
          ...(state === 'ledgeClimb' ? { meleeLedgeVisual: { side, platform } } : { ledge: { side, platform } }) };
        const original = JSON.stringify(actor), ctx = recorder();
        drawPixelSprite(ctx, 340, 440, actor, 0, side === 'left' ? -1 : 1, 96, 'melee');
        const draw = ctx.calls.find(call => call[0] === 'drawImage');
        const translation = ctx.calls.find(call => call[0] === 'translate');
        const flip = ctx.calls.find(call => call[0] === 'scale')[1];
        assert.equal(draw[2], measurement.frame * 256); assert.equal(draw[3], row * 256);
        const contactX = translation[1] + flip * (draw[6] + measurement.x * draw[8] / 256);
        const contactY = translation[2] + draw[7] + measurement.y * draw[9] / 256;
        assert.equal(contactX, side === 'left' ? platform.x1 : platform.x2);
        assert.equal(contactY, platform.y);
        assert.equal(flip, side === 'left' ? 1 : -1, 'a hanging P2 faced away from its actual ledge');
        assert.equal(JSON.stringify(actor), original); assert.equal(ctx.depth, 0);
      });
      attached++;
    }
  }
  assert.equal(attached, 11);
});

test('real P1 and P2 climbing keeps measured hands on a horizontally or vertically moving ledge without moving physics during drawing', () => fakeImages(() => {
  for (const axis of ['x', 'y']) for (const side of ['left', 'right']) {
    const engine = cloudMelee();
    const actor = side === 'left' ? engine.getActiveHero() : engine.getActiveOpponent();
    const platform = { x1: 150, x2: 620, y: 170, baseX1: 150, baseX2: 620, baseY: 170,
      motion: { axis, range: 40, periodMs: 2800, phase: 0 } };
    engine.platforms = [platform]; engine.mobilePlatformElapsedMs = 0;
    Object.assign(actor, { state: 'ledgeHang', stateElapsed: 0.2, x: side === 'left' ? 143 : 627, y: 196,
      vx: 0, vy: 0, ledge: { side, platform } });
    assert.equal(engine.triggerMeleeAction(side === 'left' ? 'player' : 'cpu', 'Climb'), true);
    assert.equal(actor.state, 'ledgeClimb'); assert.equal(actor.ledge, null);
    const start = { x: actor.x, y: actor.y };
    actor.stateElapsed = 0.18;
    engine.mobilePlatformElapsedMs = 200; engine.updateDynamicPlatforms();
    const dx = platform.x1 - platform.baseX1, dy = platform.y - platform.baseY;
    assert.ok(Math.abs(axis === 'x' ? dx : dy) > 10, 'the fixture did not actually move the platform');
    assert.equal(actor.x, start.x + dx); assert.equal(actor.y, start.y + dy);
    const before = JSON.stringify(actor), ctx = recorder();
    drawPixelSprite(ctx, actor.x, actor.y, actor, 0, side === 'left' ? -1 : 1, 72, 'melee');
    const translation = ctx.calls.find(call => call[0] === 'translate');
    assert.equal(translation[1], side === 'left' ? platform.x1 : platform.x2, 'climbing hands stayed at the old horizontal edge');
    assert.equal(translation[2], platform.y, 'climbing hands stayed at the old platform height');
    assert.equal(JSON.stringify(actor), before, 'the visual correction changed simulation coordinates');
    assert.equal(ctx.depth, 0);
  }
}));

test('real P1 and P2 horizontal movement preserves airborne state clocks and advances the native poses', () => {
  for (const side of ['p1', 'p2']) for (const state of ['jumpRise', 'fall']) {
    const engine = cloudMelee();
    const actor = side === 'p1' ? engine.getActiveHero() : engine.getActiveOpponent();
    const target = side === 'p1' ? engine.getActiveOpponent() : engine.getActiveHero();
    Object.assign(actor, { state, stateElapsed: 0.08, y: engine.groundY - 160, vy: state === 'jumpRise' ? -9 : 1 });
    const initialX = actor.x, hp = actor.currentHp, columns = new Set();
    for (let tick = 0; tick < 10; tick++) {
      moveTick(engine, actor, target, side);
      assert.equal(actor.state, state, `${side}: horizontal input replaced the airborne pose`);
      assert.ok(actor.stateElapsed >= 0.08 + (tick + 1) / 60 - 1e-8, `${side}: input restarted the animation every tick`);
      columns.add(getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col);
    }
    assert.ok(actor.x > initialX); assert.ok(columns.size > 1); assert.equal(actor.currentHp, hp);
  }
});

test('real P1 and P2 landing keeps all four native landing poses while horizontal motion remains responsive', () => {
  for (const side of ['p1', 'p2']) {
    const engine = cloudMelee();
    const actor = side === 'p1' ? engine.getActiveHero() : engine.getActiveOpponent();
    const target = side === 'p1' ? engine.getActiveOpponent() : engine.getActiveHero();
    Object.assign(actor, { state: 'fall', stateElapsed: 0.2, y: engine.groundY - 5, vy: 8 });
    moveTick(engine, actor, target, side);
    assert.equal(actor.state, 'land'); assert.equal(actor.y, engine.groundY); assert.equal(actor.vy, 0);
    const initialX = actor.x, columns = new Set([getHeroMeleeAnimationFrame(actor, 0).col]);
    for (let tick = 0; tick < 5; tick++) {
      moveTick(engine, actor, target, side);
      assert.equal(actor.state, 'land', `${side}: held movement cut off the landing transition`);
      columns.add(getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col);
    }
    assert.equal(columns.size, 4); assert.ok(actor.x > initialX);
    for (let tick = 0; tick < 4; tick++) moveTick(engine, actor, target, side);
    assert.equal(actor.state, 'run'); assert.equal(actor.vx, 4);
  }
});

test('real P1 and P2 turns emit a complete native transition without delaying velocity or facing', () => {
  for (const side of ['p1', 'p2']) {
    const engine = cloudMelee();
    const actor = side === 'p1' ? engine.getActiveHero() : engine.getActiveOpponent();
    const target = side === 'p1' ? engine.getActiveOpponent() : engine.getActiveHero();
    actor.facing = -1;
    const initialX = actor.x, columns = new Set();
    engine.updateLocalVersusMovement(actor, target, { right: true }, side);
    assert.equal(actor.state, 'turn'); assert.equal(actor.vx, 4); assert.equal(actor.facing, 1);
    columns.add(getHeroMeleeAnimationFrame(actor, 0).col);
    for (let tick = 0; tick < 5; tick++) {
      moveTick(engine, actor, target, side);
      assert.equal(actor.state, 'turn'); columns.add(getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col);
    }
    assert.equal(columns.size, 4); assert.ok(actor.x > initialX);
    for (let tick = 0; tick < 4; tick++) moveTick(engine, actor, target, side);
    assert.equal(actor.state, 'run'); assert.equal(actor.facing, 1);
  }
});

test('the next scene mechanisms preserve the first17 and animate real draw geometry/styles on simulation time', () => {
  for (const id of firstMechanismIds) assert.ok(STAGE_ANIMATION_PROFILES.some(profile => profile.id === id));
  const newProfiles = STAGE_ANIMATION_PROFILES.filter(profile => !firstMechanismIds.includes(profile.id));
  assert.ok(STAGE_ANIMATION_PROFILES.length >= old.stages.sceneMechanismDefinitions + 24);
  assert.ok(new Set(newProfiles.flatMap(profile => profile.universes).filter(universe => HEROES_DB.some(hero => hero.universe === universe))).size >= 12);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(profile => profile.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const profile of newProfiles) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode: 'Melee' };
    assert.equal(getStageAnimationProfile(stage)?.id, profile.id); assert.equal(profile.gameplayEffect, 'none');
    assert.equal(getStageAnimationProfile({ ...stage, universe: 'Unrelated QA universe' }), null);
    for (const local of getStageAnimationProfile(stage).localAssetPaths) assert.ok(existsSync(new URL(`public${local}`, root)));
    const a = recorder(), b = recorder();
    renderStageAnimation(a, { stage, width: 960, height: 540, elapsedSeconds: 0 });
    renderStageAnimation(b, { stage, width: 960, height: 540, elapsedSeconds: profile.periodSeconds * 0.29 });
    assert.notDeepEqual(a.calls, b.calls, `${profile.id}: no visible clock change`);
    assert.equal(a.depth, 0); assert.equal(b.depth, 0);
    assert.deepEqual(getStageAnimationFrame(stage, 20, { reducedMotion: true }), getStageAnimationFrame(stage, 800, { reducedMotion: true }));
  }
});

test('the wave2 audit counts actual runtime assets and a real full manifest while retaining unverified status', () => {
  const report = measureCombatFidelity();
  assert.equal(report.wave2Baseline.sha256, sha256(read('docs/combat-fidelity-wave2-2026-10-18/baseline.json')));
  assert.equal(report.meleeBindings.nativePresentationHeroes, getCharacterAnimationAssets().filter(entry => entry.frames === 32).length);
  assert.ok(report.meleeBindings.fullDetailedMeleeManifestHeroes.includes('cloud_ff7'));
  const cloud = report.meleeBindings.detailedManifestCoverage.find(entry => entry.id === 'cloud_ff7');
  assert.equal(cloud.states, 45); assert.equal(cloud.uniqueSheetRows, 45); assert.equal(cloud.boundFrames, 180);
  assert.deepEqual(cloud.statesWithoutNativeFile, []);
  assert.equal(report.meleeBindings.heroesWithoutFullDetailedMeleeManifest, HEROES_DB.length - report.meleeBindings.fullDetailedMeleeManifestHeroes.length);
  assert.equal(report.meleeBindings.source1to1UnverifiedHeroes, HEROES_DB.length);
  assert.equal(report.source1to1Verified, false);
});
