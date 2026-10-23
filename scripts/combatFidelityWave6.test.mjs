import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationFrame, getStageAnimationProfile, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { getCharacterFormFrame } from '../src/game/combat/characterFormState.js';
import { getCharacterFormAssets } from '../src/game/combat/characterFormCatalog.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const stateRows = entry => Array.isArray(entry.states)
  ? entry.states.map((state, row) => [state, { row, frames: entry.columns }]) : Object.entries(entry.states);
const projectReference = path => path.startsWith('public/') ? path : `public${path}`;
const old = json('docs/combat-fidelity-wave6-2026-10-20/baseline.json');
const runtimeBaseline = json('docs/combat-fidelity-wave6-2026-10-20/runtime-baseline.json');
const stageBaseline = json('docs/combat-fidelity-wave6-2026-10-20/stage-baseline.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const partPaths = ['A', 'B', 'C'].map(part => `src/game/combat/characterAnimationsWave6Part${part}.generated.json`);
const wave6Ids = ['sonic_hedgehog', 'miles_tails_prower', 'knuckles_echidna', 'jotaro_kujo', 'giorno_giovanna',
  'devil_may_cry_dante', 'devil_may_cry_nero', 'devil_may_cry_lady', 'skullgirls_parasoul', 'skullgirls_big_band',
  'snake', 'raiden', 'otacon', 'joseph_joestar', 'skullgirls_beowulf'];
const sonicPaths = ['src/game/combat/sonicMeleeMotion.generated.json', 'src/game/combat/sonicMeleeCombat.generated.json'];
const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
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
    set src(value) {
      this._src = value; this.currentSrc = value;
      try {
        const bytes = read(`public${value}`);
        if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
          this.naturalWidth = bytes.readUInt32BE(16); this.naturalHeight = bytes.readUInt32BE(20);
        }
      } catch { /* Non-PNG fallback assets are outside these atlas assertions. */ }
      this.onload?.();
    }
    get src() { return this._src; }
  };
  try { return callback(); } finally { globalThis.Image = OriginalImage; }
};

const sonicMelee = () => {
  const selected = hero('sonic_hedgehog');
  const engine = new EngineSmash(960, 540, [selected], { monsters: [selected], bosses: [], customRoster: [selected] },
    { add: noop }, noop, noop, { universe: selected.universe, mode: 'Smash', disableHazards: true,
      customBattle: { opponentControl: 'p2', singleRoster: true } });
  engines.push(engine); engine.syncPreMatchFromServer(3000); engine.ensureLocalVersusLeaders();
  engine.platforms = [{ x1: 0, x2: 960, y: engine.groundY }];
  for (const [index, actor] of [...engine.heroes, ...engine.enemies].entries()) Object.assign(actor,
    { state: 'idle', stateElapsed: 0, x: 300 + index * 300, y: engine.groundY, vx: 0, vy: 0, facing: 1, action: null });
  return engine;
};
const moveTick = (engine, actor, target, side, keys = { right: true }) => {
  engine.updateLocalVersusMovement(actor, target, keys, side); engine.updateLocalVersusActor(actor);
};

test('the wave5 snapshot,50 existing native assets and all four prior45-state manifests remain immutable', () => {
  assert.equal(sha256(read('docs/combat-fidelity-wave6-2026-10-20/baseline.json')), '1ee723f2bd4fe337e3f1ac44d15de0706f6ca1dd424c86f649fadc8f1f8fcc91');
  assert.equal(sha256(read('docs/combat-fidelity-wave6-2026-10-20/runtime-baseline.json')), 'c20f760d3338dd5531181c11b736d1bd5803675d6e41c221e9dffd094335ada4');
  assert.equal(sha256(read('docs/combat-fidelity-wave6-2026-10-20/stage-baseline.json')), 'f1eafca4d9f2bed22163ca8696acb0c9a7f9bad0a984afa75262503ded18c570');
  assert.equal(old.meleeBindings.nativePresentationHeroes, 50); assert.equal(runtimeBaseline.assets.length, 50);
  for (const entry of runtimeBaseline.assets) {
    assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256, entry.heroId);
    assert.deepEqual(resolveCharacterAnimationAsset(hero(entry.heroId)), entry);
  }
  for (const id of ['cloud_ff7', 'tifa_ff7', 'goku_dbz', 'vegeta_dbz']) assert.deepEqual(getMeleeAnimationManifest(id), runtimeBaseline.manifests[id]);
  for (const path of Object.keys(old.inputHashes).filter(path => /(?:characterAnimations(?:Wave\dPart[A-C])?|(?:cloud|tifa|goku|vegeta)Melee(?:Motion|Combat))\.generated\.json$/.test(path))) {
    assert.equal(sha256(read(path)), old.inputHashes[path], path);
  }
});

test('the runtime union preserves65 exact heroes and the15 new atlases contain480 real distinct native poses', async () => {
  const entries = partPaths.flatMap(path => json(path).entries), allHashes = new Set();
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(wave6Ids));
  const priorIds = [...runtimeBaseline.assets.map(entry => entry.heroId), ...wave6Ids];
  const preserved = getCharacterAnimationAssets().filter(entry => priorIds.includes(entry.heroId));
  assert.deepEqual(sorted(preserved.map(entry => entry.heroId)), sorted(priorIds));
  assert.equal(preserved.length, 65);
  assert.equal(new Set(getCharacterAnimationAssets().map(entry => entry.heroId)).size, getCharacterAnimationAssets().length);
  for (const entry of entries) {
    assert.equal(hero(entry.heroId).universe, entry.universe);
    for (const key of ['sourceHeroId', 'sourceId']) assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'instance-p2', [key]: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }), null);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), sourceHeroId: 'unregistered-source' }), null);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(phases)); phases.forEach((phase, row) => assert.equal(entry.phases[phase].row, row));
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.phases));
    for (const [phase, actual] of hashes) {
      const review = entry.visualValidation.phaseReviews.find(value => value.phase === phase);
      assert.deepEqual(actual, review.frameHashes, `${entry.heroId}:${phase}: stale pixel review`);
      for (const digest of actual) { assert.equal(allHashes.has(digest), false, `${entry.heroId}: reused bitmap`); allHashes.add(digest); }
    }
  }
  assert.equal(allHashes.size, 480);
  for (const part of ['a', 'b', 'c']) {
    const provenance = json(`docs/combat-fidelity-wave6-2026-10-20/part-${part}-provenance.json`);
    assert.equal(provenance.model, null); assert.equal(provenance.generationId, null); assert.equal(provenance.canon1to1Verified, false);
    for (const source of provenance.sources) {
      assert.equal(source.model, null); assert.equal(source.generationId, null);
      assert.equal(sha256(read(source.archivedPath || source.path)), source.sha256);
      assert.ok(source.prompt?.length > 100 || source.promptFile);
    }
  }
});

test('every new native phase draws all four actual cells on P1/P2 and freezes when only wall time advances', () => fakeImages(() => {
  let draws = 0;
  for (const entry of partPaths.flatMap(path => json(path).entries)) for (const [phase, spec] of Object.entries(entry.phases)) for (const facing of [1, -1]) {
    const columns = new Set(), progressValues = entry.heroId === 'vincent_ff7' && phase === 'fatality' ? [0, 0.075, 0.15, 0.225] : [0, 0.3, 0.6, 1];
    for (const progress of progressValues) {
      const actor = { ...hero(entry.heroId), id: 'runtime-p2', sourceHeroId: entry.heroId, currentHp: 100,
        presentationPhase: phase, presentationProgress: progress };
      const frame = getCharacterAnimationFrame(actor), before = structuredClone(actor), a = recorder(), b = recorder();
      drawPixelSprite(a, 160, 350, actor, 0, facing, 90, 'melee'); drawPixelSprite(b, 160, 350, actor, 60000, facing, 90, 'melee');
      const draw = a.calls.find(call => call[0] === 'drawImage'); assert.ok(draw);
      assert.equal(draw[1].src, entry.sheet); assert.equal(draw[2], frame.col * 256); assert.equal(draw[3], spec.row * 256);
      assert.equal(draw[4], 256); assert.equal(draw[5], 256); assert.deepEqual(b.calls.find(call => call[0] === 'drawImage'), draw);
      assert.ok(a.calls.some(call => call[0] === 'scale' && call[1] === facing)); assert.equal(a.depth, 0); assert.equal(b.depth, 0);
      assert.deepEqual(actor, before); columns.add(frame.col); draws++;
    }
    assert.equal(columns.size, 4, `${entry.heroId}:${phase}: inaccessible native cell`);
  }
  assert.equal(draws, 960);
}));

test('all six new base layouts contain96 real cells and render every native cell with baseline244 and its authored row scale', async () => {
  const entries = ['A', 'B', 'C'].flatMap(part => json(`src/game/combat/characterSpriteCorrectionsWave6Part${part}.generated.json`).entries);
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted([
    'miles_tails_prower', 'devil_may_cry_nero', 'devil_may_cry_lady', 'skullgirls_parasoul', 'joseph_joestar', 'skullgirls_beowulf'
  ]));
  const unique = new Set(); let draws = 0;
  for (const entry of entries) {
    assert.equal(hero(entry.heroId).universe, entry.universe);
    assert.equal(entry.normalization.baseline, 244);
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.deepEqual(sorted(Object.keys(entry.states)), ['attack', 'hit', 'idle', 'run']);
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.states));
    for (const [state, actual] of hashes) {
      assert.deepEqual(actual, entry.visualValidation.stateReviews.find(review => review.state === state).frameHashes);
      for (const digest of actual) { assert.equal(unique.has(digest), false); unique.add(digest); }
    }
    const layout = getSpriteSheetLayout(entry.sheet);
    assert.equal(layout.columns, 4); assert.equal(layout.rows, 4); assert.equal(layout.baseline, 244);
    for (const context of ['melee', 'rpg']) {
      for (const key of ['sourceHeroId', 'sourceId']) assert.equal(getHeroSpriteSheetSrc({ ...hero(entry.heroId), id: 'base-p2-copy', [key]: entry.heroId }, context), entry.sheet);
      assert.notEqual(getHeroSpriteSheetSrc({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }, context), entry.sheet);
      assert.notEqual(getHeroSpriteSheetSrc({ ...hero(entry.heroId), sourceHeroId: 'unregistered-source' }, context), entry.sheet);
      for (const [state, spec] of Object.entries(entry.states)) for (const facing of [1, -1]) for (let col = 0; col < 4; col++) fakeImages(() => {
        // Exercise ordinary state/clock selection, without forcing presentationFrame.
        // These four-row assets use the existing ten-tick coarse animation clock.
        const animTime = col * 10 + 0.1, actor = { ...hero(entry.heroId), id: 'base-p2-copy', sourceHeroId: entry.heroId,
          state, stateElapsed: animTime / 60, currentHp: 77, meter: 41 };
        const before = structuredClone(actor), ctx = recorder(), paused = recorder();
        drawPixelSprite(ctx, 200, 400, actor, context === 'melee' ? 0 : animTime, facing, 256, context);
        const draw = ctx.calls.find(call => call[0] === 'drawImage'); assert.ok(draw);
        assert.equal(draw[1].src, entry.sheet);
        assert.deepEqual(draw.slice(2, 6), [col * 256, spec.row * 256, 256, 256]);
        const row = entry.normalization.rows.find(value => value.state === state), scale = row.renderScale ?? 1;
        assert.ok(Math.abs((layout.renderScaleByRow[spec.row] ?? 1) - scale) < 1e-10);
        for (const [actual, expected] of draw.slice(6).map((value, index) => [value, [-128 * scale, -244 * scale, 256 * scale, 256 * scale][index]])) {
          assert.ok(Math.abs(actual - expected) < 1e-8, `${entry.heroId}:${state}: baseline or whole-cell stature scale was lost`);
        }
        assert.ok(ctx.calls.some(call => call[0] === 'scale' && call[1] === facing));
        if (context === 'melee') {
          drawPixelSprite(paused, 200, 400, actor, 60000, facing, 256, context);
          assert.deepEqual(paused.calls.find(call => call[0] === 'drawImage'), draw);
          assert.equal(paused.depth, 0);
        }
        assert.equal(ctx.depth, 0); assert.deepEqual(actor, before); draws++;
      });
    }
  }
  assert.equal(unique.size, 96); assert.equal(draws, 384);
});

test('all51 prior character presentation recipes remain exactly immutable', () => {
  assert.equal(Object.keys(runtimeBaseline.presentations).length, 51);
  for (const [id, prior] of Object.entries(runtimeBaseline.presentations)) assert.deepEqual(CHARACTER_PRESENTATIONS[id], prior, id);
  const throughWave6Ids = new Set([...Object.keys(runtimeBaseline.presentations), ...wave6Ids]);
  assert.equal(Object.keys(CHARACTER_PRESENTATIONS).filter(id => throughWave6Ids.has(id)).length, 66);
  const rosterPresentations = Object.keys(CHARACTER_PRESENTATIONS).filter(id => throughWave6Ids.has(id) && roster.has(id));
  assert.equal(rosterPresentations.length, 65);
  assert.equal(rosterPresentations.reduce((count, id) => count + Object.keys(CHARACTER_PRESENTATIONS[id].phases).length, 0), 455);
  for (const id of wave6Ids) for (const phase of PRESENTATION_PHASES) {
    const script = resolvePresentationScript(hero(id), phase); assert.ok(script); assert.equal(script.heroId, id);
    assert.equal(script.universe, hero(id).universe); assert.equal(script.provenance.canonicalSequence, false);
  }
});

test('new Fighter scenes freeze on zero simulation time and drawing never changes match resources or outcome', () => fakeImages(() => {
  for (const id of wave6Ids) {
    let completed = 0;
    const engine = new EngineFighter(960, 540, [hero(id)], [hero('cloud_ff7')], { add: noop }, noop, () => { completed++; }, { opponentControl: 'p2' }); engines.push(engine);
    const snapshot = () => JSON.stringify({ hp: [engine.getActive('player').currentHp, engine.getActive('cpu').currentHp],
      meter: [engine.getActive('player').meter, engine.getActive('cpu').meter], wins: engine.roundWins, result: engine.result, projectiles: engine.projectiles });
    const initial = snapshot();
    for (const phase of PRESENTATION_PHASES) {
      engine.presentationQueue = []; engine.queuePresentation(['roundVictory', 'roundDefeat'].includes(phase) ? 'roundResult' : phase === 'defeat' ? 'victory' : phase,
        ['roundDefeat', 'defeat'].includes(phase) ? 'cpu' : 'player'); engine.presentation = engine.presentationQueue.shift();
      engine.presentation.remaining = engine.presentation.duration * 0.43;
      const remaining = engine.presentation.remaining, a = recorder(), b = recorder();
      engine.drawCharacterPresentation(a, 0); engine.updatePresentation(0); engine.drawCharacterPresentation(b, 60000);
      const participant = engine.presentation.entries.find(entry => entry.side === 'player');
      const sample = samplePresentationScript(participant.script, engine.presentation.duration - engine.presentation.remaining);
      const form = getCharacterFormFrame({ ...engine.getActive('player'), presentationPhase: participant.actorPhase, presentationProgress: sample.progress });
      const sheet = form ? getCharacterFormAssets()[0].sheet : sample.asset.sheet, frame = form || sample.asset;
      assert.ok(a.calls.some(call => call[0] === 'drawImage' && call[1].src === sheet && call[2] === frame.col * 256
        && call[3] === frame.row * 256 && call[4] === 256 && call[5] === 256), `${id}:${phase}: script metadata disagrees with the actual rendered body`);
      assert.equal(engine.presentation.remaining, remaining); assert.equal(a.depth, 0); assert.equal(b.depth, 0);
      assert.deepEqual(a.calls.filter(call => call[0] === 'drawImage'), b.calls.filter(call => call[0] === 'drawImage'));
      assert.equal(snapshot(), initial, `${id}:${phase}: cosmetic scene changed gameplay`);
    }
    assert.equal(completed, 0);
  }
}));

test('Sonic has six real native atlases with45 exclusive rows,180 distinct poses and no unused-row fiction', async () => {
  const entries = sonicPaths.flatMap(path => json(path).entries), unique = new Set(); assert.equal(entries.length, 6);
  assert.deepEqual(sorted(entries.flatMap(entry => stateRows(entry).map(([state]) => state))), sorted(MELEE_STATES));
  for (const entry of entries) {
    assert.equal(entry.heroId, 'sonic_hedgehog'); assert.equal(entry.universe, 'Sonic');
    assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
    assert.equal(entry.provenance.nativeArtwork || entry.provenance.nativeGeneratedArtwork, true);
    assert.equal(entry.provenance.canonicalVerified ?? entry.provenance.canonicalAnimationVerified, false);
    const { hashes, rgba } = await inspectAtlas(entry, stateRows(entry));
    for (const values of hashes.values()) for (const digest of values) { assert.equal(unique.has(digest), false); unique.add(digest); }
    for (let row = entry.activeRows ?? stateRows(entry).length; row < 8; row++) for (let pixel = row * 256 * 1024; pixel < (row + 1) * 256 * 1024; pixel++) assert.equal(rgba[pixel * 4 + 3], 0);
    if (entry.visualValidation.stateRowsReviewed !== undefined) {
      assert.equal(entry.visualValidation.stateRowsReviewed, true); assert.equal(entry.visualValidation.fourNativePosesPerStateReviewed, true);
    } else assert.equal(entry.visualValidation.reviewed, true);
  }
  assert.equal(unique.size, 180);
  const manifest = getMeleeAnimationManifest('sonic_hedgehog'); assert.ok(manifest); assert.equal(manifest.dedicatedStateRows, true);
  assert.equal(manifest.source1to1Verified, false); assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
  assert.equal(new Set(MELEE_STATES.map(state => `${manifest.animations[state].sheet}:${manifest.animations[state].row}`)).size, 45);
  for (const state of MELEE_STATES) {
    const animation = manifest.animations[state]; assert.equal(animation.frameCount, 4);
    assert.deepEqual(animation.events, []); assert.deepEqual(animation.hitboxes, []); assert.deepEqual(animation.rootMotion, []);
    assert.ok(entries.some(entry => entry.sheet === animation.sheet && stateRows(entry).some(([name, spec]) => name === state && spec.row === animation.row)));
  }
});

test('all45 Sonic states draw actual cells on both sides, keep loop/transition clocks and freeze on pause', () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest('sonic_hedgehog'); assert.ok(manifest);
  let actualDraws = 0;
  for (const state of MELEE_STATES) {
    const spec = manifest.animations[state], end = getMeleeAnimationFrame(manifest, state, 100000);
    if (spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, 0).col, getMeleeAnimationFrame(manifest, state, 4 / spec.fps * 1000).col);
    else assert.equal(end.frame, 3);
    if (MELEE_TRANSITION_DATA[state] && !spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, MELEE_TRANSITION_DATA[state].duration * 1000 - 0.01).frame, 3);
    for (const facing of [1, -1]) {
      const reachedColumns = new Set();
      for (let index = 0; index < 4; index++) {
      const elapsed = (index + 0.05) / spec.fps;
      const actor = { ...hero('sonic_hedgehog'), id: 'p2-copy', sourceHeroId: 'sonic_hedgehog', state, stateElapsed: elapsed }, original = structuredClone(actor);
      const frame = getHeroMeleeAnimationFrame(actor, elapsed * 1000), a = recorder(), b = recorder();
      drawPixelSprite(a, 200, 400, actor, 0, facing, 96, 'melee'); drawPixelSprite(b, 200, 400, actor, 60000, facing, 96, 'melee');
      const draw = a.calls.find(call => call[0] === 'drawImage'); assert.ok(draw); assert.equal(draw[1].src, frame.animation.sheet);
      assert.equal(draw[2], frame.col * 256); assert.equal(draw[3], frame.row * 256); assert.equal(draw[4], 256); assert.equal(draw[5], 256);
      assert.deepEqual(draw, b.calls.find(call => call[0] === 'drawImage')); assert.deepEqual(actor, original); assert.equal(a.depth, 0);
      assert.equal(frame.animation.sheet, spec.sheet); assert.equal(frame.row, spec.row); reachedColumns.add(frame.col); actualDraws++;
      }
      assert.deepEqual(sorted(reachedColumns), [0, 1, 2, 3], `${state}/${facing}: a native cell is not rendered`);
    }
  }
  assert.equal(actualDraws, 360);
  assert.equal(getHeroMeleeAnimationFrame({ ...hero('sonic_hedgehog'), universe: 'Unrelated QA universe' }, 0), null);
  assert.notEqual(getHeroSpriteSheetSrc({ ...hero('sonic_hedgehog'), universe: 'Unrelated QA universe', state: 'idle' }, 'melee'), manifest.animations.idle.sheet);
}));

test('Sonic native pixels retain a190px standing body and genuinely smaller curled aerial poses', async () => {
  const entry = json(sonicPaths[0]).entries.find(value => value.id === 'sonic-motion-a');
  const rgba = await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer();
  const height = (state, col) => {
    const row = entry.states.indexOf(state); assert.ok(row >= 0);
    let top = 256, bottom = -1;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      if (rgba[((row * 256 + y) * 1024 + col * 256 + x) * 4 + 3] > 24) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
    }
    assert.ok(bottom > top); return bottom - top + 1;
  };
  const standing = height('idle', 0); assert.ok(standing >= 185 && standing <= 195, `standing body is ${standing}px`);
  for (const state of ['jumpRise', 'jumpApex']) for (let col = 0; col < 4; col++) {
    const curled = height(state, col);
    assert.ok(curled > 95 && curled < standing * 0.8, `${state}:${col}: native curl was inflated to standing height`);
  }
  // Source-level calibration is shared by poses, rather than a separate fit of
  // every cell to190px. Actual pixel bounds above independently enforce that.
  for (const calibration of entry.normalization.sourceStatureCalibration) {
    assert.equal(calibration.sameScaleForEveryPoseInSource, true);
    assert.equal(calibration.normalizedStandingBodyHeight, 190);
  }
});

test('Sonic ordinary HomingAttack contact follows runtime impacts while full LightSpeedAttack uses its separate atlas', () => fakeImages(() => {
  assert.equal(resolveCombatAbility(hero('sonic_hedgehog'), 'secondary').name, 'Homing Attack');
  assert.equal(resolveCombatAbility(hero('sonic_hedgehog'), 'special').name, 'Light Speed Attack');
  const manifest = getMeleeAnimationManifest('sonic_hedgehog'); assert.ok(manifest);
  for (const state of ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'ledgeAttack']) {
    const action = { elapsed: 0.309, duration: 0.9, hitAt: 0.31 };
    assert.equal(getMeleeAnimationFrame(manifest, state, 309, { action }).frame, 1);
    assert.equal(getMeleeAnimationFrame(manifest, state, 310, { action: { ...action, elapsed: 0.31 } }).frame, 2);
    assert.equal(getMeleeAnimationFrame(manifest, state, 900, { action: { ...action, elapsed: 0.9 } }).frame, 3);
  }
  const full = resolveCharacterAnimationAsset(hero('sonic_hedgehog'));
  for (const action of [{ type: 'super', elapsed: 0.6, duration: 1, hitAt: 0.4 }, { superProfile: {}, elapsed: 0.6, duration: 1, hitAt: 0.4 }]) {
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, { ...hero('sonic_hedgehog'), state: 'special', action }, 0, 1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, full.sheet);
  }
}));

test('Sonic ledge anchors sit on actual hand pixels and the real renderer attaches them to both edges', async () => {
  const entry = json(sonicPaths[1]).entries.find(value => value.id === 'sonic-ledge'), manifest = getMeleeAnimationManifest('sonic_hedgehog'); assert.ok(manifest);
  const rgba = await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer(), platform = { x1: 150, x2: 620, y: 170 };
  const proof = json('docs/combat-fidelity-wave6-2026-10-20/sonic-sources/grip-pixel-checks.json');
  assert.equal(proof.sha256, entry.sha256);
  let attached = 0, measured = 0;
  for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) {
    const measurements = entry.normalization.contactAnchorMeasurements[state];
    assert.ok(Array.isArray(measurements), `${state}: missing native hand measurements`);
    assert.deepEqual(measurements.map(point => point.frame), [0, 1, 2, 3]);
    for (const measurement of measurements) {
    const checked = proof.checks.find(check => check.state === state && check.frame === measurement.frame); assert.ok(checked);
    for (const [point, checkedRoi] of [[measurement, checked.palmRoi], [measurement.wrist, checked.wristRoi]]) {
      assert.ok(point); assert.equal(point.x, checkedRoi.x); assert.equal(point.y, checkedRoi.y);
      const roi = Buffer.alloc(9 * 9 * 4); let visible = 0, neutralBright = 0, pixel = 0;
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const offset = ((entry.states[state].row * 256 + point.y + dy) * 1024 + measurement.frame * 256 + point.x + dx) * 4;
        rgba.copy(roi, pixel++ * 4, offset, offset + 4);
        const [red, green, blue, alpha] = rgba.subarray(offset, offset + 4);
        if (alpha > 24) visible++;
        if (alpha > 24 && Math.min(red, green, blue) > 100 && Math.max(red, green, blue) - Math.min(red, green, blue) < 65) neutralBright++;
      }
      assert.ok(visible >= 60, `${state}/${measurement.frame}: hand or wrist is transparent`);
      assert.ok(neutralBright >= 30, `${state}/${measurement.frame}: expected white glove pixels`);
      assert.equal(sha256(roi), checkedRoi.rgbaSha256, `${state}/${measurement.frame}: stale hand pixel proof`);
    }
    measured++;
    if (!measurement.contact) continue;
    for (const side of ['left', 'right']) fakeImages(() => {
      const actor = { ...hero('sonic_hedgehog'), id: 'sonic-p2', sourceHeroId: 'sonic_hedgehog', state, stateElapsed: (measurement.frame + 0.01) / manifest.animations[state].fps,
        ...(state === 'ledgeClimb' ? { meleeLedgeVisual: { side, platform } } : { ledge: { side, platform } }) }, before = structuredClone(actor), ctx = recorder();
      drawPixelSprite(ctx, 340, 440, actor, 0, side === 'left' ? -1 : 1, 96, 'melee');
      const draw = ctx.calls.find(call => call[0] === 'drawImage'), translate = ctx.calls.find(call => call[0] === 'translate'), flip = ctx.calls.find(call => call[0] === 'scale')[1];
      assert.equal(draw[2], measurement.frame * 256); assert.equal(draw[3], entry.states[state].row * 256);
      assert.equal(translate[1] + flip * (draw[6] + measurement.x * draw[8] / 256), side === 'left' ? platform.x1 : platform.x2);
      assert.equal(translate[2] + draw[7] + measurement.y * draw[9] / 256, platform.y);
      assert.equal(flip, side === 'left' ? 1 : -1); assert.deepEqual(actor, before); assert.equal(ctx.depth, 0);
    });
    attached++;
    }
  }
  assert.equal(measured, 12);
  assert.equal(attached, 11, 'the reaching pre-contact pose must stay separate from physical attachment');
});

test('Sonic P1/P2 climbing follows moving platforms and live movement preserves air,land and turn clocks', () => fakeImages(() => {
  for (const axis of ['x', 'y']) for (const side of ['left', 'right']) {
    const engine = sonicMelee(), actor = side === 'left' ? engine.getActiveHero() : engine.getActiveOpponent();
    const platform = { x1: 150, x2: 620, y: 170, baseX1: 150, baseX2: 620, baseY: 170, motion: { axis, range: 40, periodMs: 2800, phase: 0 } };
    engine.platforms = [platform]; engine.mobilePlatformElapsedMs = 0;
    Object.assign(actor, { state: 'ledgeHang', stateElapsed: 0.2, x: side === 'left' ? 143 : 627, y: 196, vx: 0, vy: 0, ledge: { side, platform } });
    assert.equal(engine.triggerMeleeAction(side === 'left' ? 'player' : 'cpu', 'Climb'), true);
    actor.stateElapsed = 0.18; engine.mobilePlatformElapsedMs = 200; engine.updateDynamicPlatforms();
    const before = structuredClone(actor), ctx = recorder(); drawPixelSprite(ctx, actor.x, actor.y, actor, 0, 1, 72, 'melee');
    const translation = ctx.calls.find(call => call[0] === 'translate'); assert.equal(translation[1], side === 'left' ? platform.x1 : platform.x2); assert.equal(translation[2], platform.y);
    assert.deepEqual(actor, before);
  }
  for (const side of ['p1', 'p2']) for (const state of ['jumpRise', 'fall', 'land', 'turn']) {
    const engine = sonicMelee(), actor = side === 'p1' ? engine.getActiveHero() : engine.getActiveOpponent(), target = side === 'p1' ? engine.getActiveOpponent() : engine.getActiveHero();
    const air = ['jumpRise', 'fall'].includes(state);
    Object.assign(actor, { state: air ? state : state === 'land' ? 'fall' : 'idle', stateElapsed: 0.08,
      y: air ? engine.groundY - 160 : state === 'land' ? engine.groundY - 5 : engine.groundY, vy: air ? state === 'jumpRise' ? -9 : 1 : state === 'land' ? 8 : 0, facing: state === 'turn' ? -1 : 1 });
    if (!air) moveTick(engine, actor, target, side);
    const columns = new Set([getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col]), initialX = actor.x;
    for (let tick = 0; tick < (air ? 10 : 5); tick++) { moveTick(engine, actor, target, side); assert.equal(actor.state, state); columns.add(getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col); }
    assert.ok(actor.x > initialX); assert.ok(columns.size > 1); if (!air) assert.equal(columns.size, 4);
  }
}));

test('the137 stage mechanisms preserve all113 prior definitions and their exact recorded render operations', () => {
  assert.equal(STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 6).length, 137); assert.equal(stageBaseline.profiles.length, 113);
  const draw = (stage, time) => {
    const operations = []; let depth = 0;
    const ctx = new Proxy({}, { get(_, key) { return (...args) => { if (key === 'save') depth++; if (key === 'restore') depth--; operations.push([key, ...args]); }; },
      set(_, key, value) { operations.push([key, value]); return true; } });
    assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds: time }), true); assert.equal(depth, 0); return operations;
  };
  for (const original of stageBaseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(profile => profile.id === original.id); assert.ok(current);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, value) => value instanceof RegExp ? value.toString() : value)), original.definition);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(sha256(JSON.stringify(draw(original.stage, sample.time))), sample.sha256);
  }
  for (const profile of STAGE_ANIMATION_PROFILES.filter(profile => !runtimeBaseline.stages.some(prior => prior.id === profile.id))) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode: 'Melee' }, before = structuredClone(stage);
    assert.equal(getStageAnimationProfile(stage)?.id, profile.id); assert.notDeepEqual(draw(stage, 0), draw(stage, profile.periodSeconds * 0.23));
    assert.deepEqual(getStageAnimationFrame(stage, 5, { reducedMotion: true }), getStageAnimationFrame(stage, 500, { reducedMotion: true }));
    assert.deepEqual(stage, before); assert.equal(profile.gameplayEffect, 'none');
  }
});

