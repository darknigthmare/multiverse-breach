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
import { getSummonAnimationAssets, resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { supportsNativeSuperWave9, projectNativeSuperAnchorWave9, getNativeSuperVisualStateWave9, drawNativeSuperVisualsWave9 } from '../src/game/combat/nativeSuperVisualsWave9.js';
import { getCharacterFormAssets } from '../src/game/combat/characterFormCatalog.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const stateRows = entry => Array.isArray(entry.states)
  ? entry.states.map((state, row) => [state, { row, frames: entry.columns }]) : Object.entries(entry.states);
const projectReference = path => path.startsWith('public/') ? path : `public${path}`;
const wave10NewKitIds = new Set(['neo','trinity','morpheus','seraph','oneill','tealc','sam_carter','daniel_jackson','freeman','barney','alyx_vance','paladin','nick_v','dallas','wolf_pd','hoxton','janine_gb']);
const wave11NewKitIds = new Set(['spike_buffy','ronon_dex','elizabeth_weir','chloe_sgu','matt_scott_sgu','roland_bl','brick_bl','max','furiosa','nux','korben','leeloo','ruby_rhod','arthur_kaamelott','perceval_kaamelott','karadoc_kaamelott']);
const old = json('docs/combat-fidelity-wave9-2026-10-22/baseline.json');
const runtimeBaseline = json('docs/combat-fidelity-wave9-2026-10-22/runtime-baseline.json');
const stageBaseline = json('docs/combat-fidelity-wave9-2026-10-22/stage-baseline.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const partPaths = ['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterAnimationsWave9Part${part}.generated.json`);
const wave9Ids = Object.values(json('docs/combat-fidelity-wave9-2026-10-22/batch-plan-before.json').parts).flat();
const nativeIds = wave9Ids;
const fullIds = nativeIds;
const chrisPaths = ['src/game/combat/chrisMeleeMotion.generated.json', 'src/game/combat/chrisMeleeCombat.generated.json'];
const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const noop = () => {};
let vite, drawPixelSprite, EngineFighter;
const engines = [];
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
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
  for (const row of entry.normalization.rows || []) if (row.sourceImage) assert.equal(sha256(read(row.sourceImage)), row.sourceImageSha256 ?? entry.sourceImages?.find(source => source.path === row.sourceImage)?.sha256);
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

test('the wave8 snapshot,97 existing native records and all seven prior45-state manifests remain immutable', () => {
  assert.equal(sha256(read('docs/combat-fidelity-wave9-2026-10-22/baseline.json')), 'd9e2073a47b691286fbf9c77916fca1d784cb9a88382af566d1403fcb982c182');
  assert.equal(sha256(read('docs/combat-fidelity-wave9-2026-10-22/runtime-baseline.json')), 'e44e776638781f847332663fd864d7e9f18443e9769fb783ef1a0c6995f96d9b');
  assert.equal(sha256(read('docs/combat-fidelity-wave9-2026-10-22/stage-baseline.json')), '65bbd0d26eadc53c83cad41503c3ed2dbc994b62ccdfcc0eda7f58c511a3a526');
  assert.equal(old.meleeBindings.nativePresentationHeroes, 96); assert.equal(runtimeBaseline.characterAssets.length, 97);
  for (const entry of runtimeBaseline.characterAssets) {
    assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256, entry.heroId);
    assert.deepEqual(resolveCharacterAnimationAsset(hero(entry.heroId)), entry);
  }
  assert.equal(Object.keys(runtimeBaseline.manifests).length, 7);
  for (const id of Object.keys(runtimeBaseline.manifests)) assert.deepEqual(getMeleeAnimationManifest(id), runtimeBaseline.manifests[id]);
  const preservedPngs = new Map();
  for (const path of Object.keys(old.inputHashes).filter(path => path.endsWith('.generated.json'))) {
    assert.equal(sha256(read(path)), old.inputHashes[path], path);
    for (const entry of json(path).entries || []) if (entry.sheet && entry.sha256) {
      assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256, `${path}: prior PNG changed`);
      if (preservedPngs.has(entry.sheet)) assert.equal(preservedPngs.get(entry.sheet), entry.sha256);
      preservedPngs.set(entry.sheet, entry.sha256);
    }
  }
  assert.equal(preservedPngs.size, 223);
  assert.equal(old.baseSpriteCorrections.entries.length, 44);
  for (const entry of old.baseSpriteCorrections.entries) {
    const actor = hero(entry.heroId); assert.equal(actor.universe, entry.universe);
    assert.equal(getHeroSpriteSheetSrc(actor, 'rpg'), entry.sheet, `${entry.heroId}: prior base rerouted`);
    const layout = getSpriteSheetLayout(entry.sheet); assert.equal(layout.columns, 4); assert.equal(layout.rows, 4);
  }
  const delivered = [...partPaths, ...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave9Part${part}.generated.json`),
    ...chrisPaths, 'src/game/combat/summonAnimationsWave9.generated.json'].flatMap(path => json(path).entries);
  for (const entry of delivered) {
    assert.equal(preservedPngs.has(entry.sheet), false, `${entry.sheet}: new native output overwrites a prior PNG`);
    assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256); preservedPngs.set(entry.sheet, entry.sha256);
  }
  assert.equal(preservedPngs.size, 273);

});

test('the runtime union preserves97 old records and adds20 complete32-pose atlases while retaining the old partial record', async () => {
  const entries = partPaths.flatMap(path => json(path).entries), allHashes = new Set();
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(nativeIds));
  const priorIds = [...runtimeBaseline.characterAssets.map(entry => entry.heroId), ...nativeIds];
  const preserved = getCharacterAnimationAssets().filter(entry => priorIds.includes(entry.heroId));
  assert.deepEqual(sorted(preserved.map(entry => entry.heroId)), sorted(priorIds));
  assert.equal(preserved.length, 117);
  assert.equal(new Set(getCharacterAnimationAssets().map(entry => entry.heroId)).size, getCharacterAnimationAssets().length);
  for (const entry of entries) {
    assert.equal(hero(entry.heroId).universe, entry.universe);
    for (const key of ['sourceHeroId', 'sourceId']) assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'instance-p2', [key]: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }), null);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), sourceHeroId: 'unregistered-source' }), null);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    const expected = entry.heroId === 'beast_boy_tt' ? ['fatality', 'super'] : phases;
    assert.equal(entry.frames, expected.length * 4); assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(expected)); expected.forEach((phase, row) => assert.equal(entry.phases[phase].row, row));
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.phases));
    for (const [phase, actual] of hashes) {
      const review = entry.visualValidation.phaseReviews.find(value => value.phase === phase);
      assert.deepEqual(actual, review.frameHashes, `${entry.heroId}:${phase}: stale pixel review`);
      for (const digest of actual) { assert.equal(allHashes.has(digest), false, `${entry.heroId}: reused bitmap`); allHashes.add(digest); }
    }
  }
  assert.equal(allHashes.size, 640);
  assert.equal(entries.filter(entry => entry.frames === 32 && Object.keys(entry.phases).length === 8).length, fullIds.length);
  assert.equal(preserved.filter(entry => entry.frames === 32 && Object.keys(entry.phases).length === 8).length, 116);
  for (const part of ['a', 'b', 'c', 'd']) {
    const provenance = json(`docs/combat-fidelity-wave9-2026-10-22/part-${part}-provenance.json`);
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
  assert.equal(draws, 1280);
}));

test('all20 new base layouts contain320 real cells and render every native cell with baseline244 and its authored row scale', async () => {
  const entries = ['A', 'B', 'C', 'D'].flatMap(part => json(`src/game/combat/characterSpriteCorrectionsWave9Part${part}.generated.json`).entries);
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(nativeIds));
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
    // Chris's complete45-state melee atlas intentionally takes priority over
    // his coarse base; his new16-cell sheet remains the actual RPG body.
    if (entry.heroId === 'chris_redfield') assert.equal(getHeroSpriteSheetSrc(hero('chris_redfield'), 'melee'), getMeleeAnimationManifest('chris_redfield').animations.idle.sheet);
    for (const context of entry.heroId === 'chris_redfield' ? ['rpg'] : ['melee', 'rpg']) {
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
  assert.equal(unique.size, 320); assert.equal(draws, 1248);
});

test('all104 prior character presentation recipes remain exactly immutable', () => {
  assert.equal(Object.keys(runtimeBaseline.presentations).length, 104);
  for (const [id, prior] of Object.entries(runtimeBaseline.presentations)) assert.deepEqual(CHARACTER_PRESENTATIONS[id], prior, id);
  const historicalIds = [...Object.keys(runtimeBaseline.presentations), ...wave9Ids];
  assert.equal(new Set(historicalIds).size, 124);
  const rosterPresentations = Object.keys(CHARACTER_PRESENTATIONS).filter(id => historicalIds.includes(id) && roster.has(id));
  assert.equal(rosterPresentations.length, 123);
  assert.equal(rosterPresentations.reduce((count, id) => count + Object.keys(CHARACTER_PRESENTATIONS[id].phases).length, 0), 861);
  for (const id of wave9Ids) for (const phase of PRESENTATION_PHASES) {
    const script = resolvePresentationScript(hero(id), phase); assert.ok(script); assert.equal(script.heroId, id);
    assert.equal(script.universe, hero(id).universe); assert.equal(script.provenance.canonicalSequence, false);
  }
});

test('new Fighter scenes freeze on zero simulation time and drawing never changes match resources or outcome', () => fakeImages(() => {
  for (const id of wave9Ids) {
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
      if (getCharacterAnimationFrame({ ...hero(id), presentationPhase: participant.actorPhase, presentationProgress: sample.progress })) assert.ok(a.calls.some(call => call[0] === 'drawImage' && call[1].src === sheet && call[2] === frame.col * 256
        && call[3] === frame.row * 256 && call[4] === 256 && call[5] === 256), `${id}:${phase}: script metadata disagrees with the actual rendered body`);
      assert.equal(engine.presentation.remaining, remaining); assert.equal(a.depth, 0); assert.equal(b.depth, 0);
      assert.deepEqual(a.calls.filter(call => call[0] === 'drawImage'), b.calls.filter(call => call[0] === 'drawImage'));
      assert.equal(snapshot(), initial, `${id}:${phase}: cosmetic scene changed gameplay`);
    }
    assert.equal(completed, 0);
  }
}));

test('Chris has six real native atlases with45 exclusive rows,180 distinct poses and no unused-row fiction', async () => {
  const entries = chrisPaths.flatMap(path => json(path).entries), unique = new Set(); assert.equal(entries.length, 6);
  assert.deepEqual(sorted(entries.flatMap(entry => stateRows(entry).map(([state]) => state))), sorted(MELEE_STATES));
  for (const entry of entries) {
    assert.equal(entry.heroId, 'chris_redfield'); assert.equal(entry.universe, 'Resident Evil');
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
  const manifest = getMeleeAnimationManifest('chris_redfield'); assert.ok(manifest); assert.equal(manifest.dedicatedStateRows, true);
  assert.equal(manifest.source1to1Verified, false); assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
  assert.equal(new Set(MELEE_STATES.map(state => `${manifest.animations[state].sheet}:${manifest.animations[state].row}`)).size, 45);
  for (const state of MELEE_STATES) {
    const animation = manifest.animations[state]; assert.equal(animation.frameCount, 4);
    assert.deepEqual(animation.events, []); assert.deepEqual(animation.hitboxes, []); assert.deepEqual(animation.rootMotion, []);
    assert.ok(entries.some(entry => entry.sheet === animation.sheet && stateRows(entry).some(([name, spec]) => name === state && spec.row === animation.row)));
  }
});

test('all45 Chris states draw actual cells on both sides, keep loop/transition clocks and freeze on pause', () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest('chris_redfield'); assert.ok(manifest);
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
      const actor = { ...hero('chris_redfield'), id: 'p2-copy', sourceHeroId: 'chris_redfield', state, stateElapsed: elapsed }, original = structuredClone(actor);
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
  assert.equal(getHeroMeleeAnimationFrame({ ...hero('chris_redfield'), universe: 'Unrelated QA universe' }, 0), null);
  assert.notEqual(getHeroSpriteSheetSrc({ ...hero('chris_redfield'), universe: 'Unrelated QA universe', state: 'idle' }, 'melee'), manifest.animations.idle.sheet);
}));

test('Chris keeps real190px standing calibration and source-wide stature factors in actual draw rectangles', async () => {
  const entries = chrisPaths.flatMap(path => json(path).entries);
  const calibrations = new Map();
  for (const entry of entries) for (const calibration of entry.normalization.sourceStatureCalibration || entry.normalization.sourceCalibrations || []) {
    const source = calibration.sourceImage;
    const roi = calibration.sourceBodyBounds || calibration.sourceRoi;
    const native = await sharp(read(source)).extract({ left: roi.x, top: roi.y, width: roi.width, height: roi.height }).ensureAlpha().raw().toBuffer();
    const occupiedRows = new Set();
    for (let y = 0; y < roi.height; y++) for (let x = 0; x < roi.width; x++) if (native[(y * roi.width + x) * 4 + 3] > 24) occupiedRows.add(y);
    const actualHeight = Math.max(...occupiedRows) - Math.min(...occupiedRows) + 1;
    // These are explicitly approximate visual body ROIs. Independently read
    // their pixels and bound endpoint uncertainty to three native pixels.
    assert.ok(roi.height - actualHeight <= 3, `${source}: declared body endpoints miss actual pixels`);
    assert.equal(roi.height, calibration.sourceStandingBodyHeight ?? calibration.sourceBodyHeight);
    assert.ok(Math.abs(roi.height * calibration.scale * (calibration.renderScale ?? 1) - 190) < 0.01);
    assert.ok(Math.abs(actualHeight * calibration.scale * (calibration.renderScale ?? 1) - 190) <= 3);
    const prior = calibrations.get(source); if (prior) assert.equal(prior, calibration.scale * (calibration.renderScale ?? 1));
    calibrations.set(source, calibration.scale * (calibration.renderScale ?? 1));
  }
  assert.ok(calibrations.size >= 6);
  for (const entry of entries.filter(entry => entry.normalization.rows)) for (const row of entry.normalization.rows) fakeImages(() => {
    const scale = row.renderScale ?? 1, manifest = getMeleeAnimationManifest('chris_redfield'), spec = manifest.animations[row.state];
    const actor = { ...hero('chris_redfield'), id: 'chris_redfield-p2', sourceHeroId: 'chris_redfield', state: row.state, stateElapsed: 0.01 / spec.fps };
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 0, -1, 256, 'melee');
    const draw = ctx.calls.find(call => call[0] === 'drawImage'); assert.equal(draw[1].src, entry.sheet);
    assert.equal(draw[8], 256 * scale); assert.equal(draw[9], 256 * scale);
    const frame = getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000);
    const anchorY = frame.anchor?.y * 256 || 244;
    assert.ok(Math.abs(draw[7] + anchorY * scale) < 1e-8, `${row.state}: authored body/hand anchor must scale with the whole cell`);
    assert.equal(ctx.depth, 0);
  });
});

test('Chris ordinary actions follow runtime impact clocks while the full super uses its separate atlas', () => fakeImages(() => {
  assert.equal(resolveCombatAbility(hero('chris_redfield'), 'secondary').name, 'Straight de Chris');
  assert.equal(resolveCombatAbility(hero('chris_redfield'), 'special').effect, 'damage');
  const manifest = getMeleeAnimationManifest('chris_redfield'); assert.ok(manifest);
  for (const state of ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'ledgeAttack']) {
    const action = { elapsed: 0.309, duration: 0.9, hitAt: 0.31 };
    assert.equal(getMeleeAnimationFrame(manifest, state, 309, { action }).frame, 1);
    assert.equal(getMeleeAnimationFrame(manifest, state, 310, { action: { ...action, elapsed: 0.31 } }).frame, 2);
    assert.equal(getMeleeAnimationFrame(manifest, state, 900, { action: { ...action, elapsed: 0.9 } }).frame, 3);
  }
  const full = resolveCharacterAnimationAsset(hero('chris_redfield'));
  for (const action of [{ type: 'super', elapsed: 0.6, duration: 1, hitAt: 0.4 }, { superProfile: {}, elapsed: 0.6, duration: 1, hitAt: 0.4 }]) {
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, { ...hero('chris_redfield'), state: 'special', action }, 0, 1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, full.sheet);
  }
}));

test('Chris ledge anchors sit on actual hand pixels and the real renderer attaches them to both edges', async () => {
  const entry = json(chrisPaths[1]).entries.find(value => value.id === 'chris-ledge'), manifest = getMeleeAnimationManifest('chris_redfield'); assert.ok(manifest);
  const rgba = await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer(), platform = { x1: 150, x2: 620, y: 170 };
  const proof = json('docs/combat-fidelity-wave9-2026-10-22/chris-sources/grip-pixel-checks.json');
  assert.equal(proof.requiredPalms, 12); assert.equal(proof.requiredWrists, 12); assert.equal(proof.acceptedContacts, 11);
  let attached = 0, measured = 0;
  for (const state of ['ledgeCatch', 'ledgeHang', 'ledgeClimb']) {
    const measurements = entry.normalization.contactAnchorMeasurements[state];
    assert.ok(Array.isArray(measurements), `${state}: missing native hand measurements`);
    assert.deepEqual(measurements.map(point => point.frame), [0, 1, 2, 3]);
    for (const measurement of measurements) {
    const checked = proof.contacts.find(check => check.state === state && check.frame === measurement.frame); assert.ok(checked);
    for (const [point, checkedRoi] of [[measurement, checked.palm], [measurement.wrist, checked.wrist]]) {
      assert.ok(point); assert.equal(sha256(read(checkedRoi.path)), checkedRoi.sha256);
      const roi = Buffer.alloc(9 * 9 * 4); let visible = 0, skin = 0, darkGlove = 0, pixel = 0;
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const offset = ((entry.states[state].row * 256 + point.y + dy) * 1024 + measurement.frame * 256 + point.x + dx) * 4;
        rgba.copy(roi, pixel++ * 4, offset, offset + 4);
        const [red, green, blue, alpha] = rgba.subarray(offset, offset + 4);
        if (alpha > 24) visible++;
        if (alpha > 24 && red > 85 && red > green + 12 && green > blue + 8) skin++;
        if (alpha > 24 && Math.max(red, green, blue) < 110 && Math.max(red, green, blue) - Math.min(red, green, blue) < 45) darkGlove++;
      }
      assert.ok(visible >= 60, `${state}/${measurement.frame}: hand or wrist is transparent`);
      assert.equal(visible, 81); assert.equal(skin, checkedRoi.skinPixels); assert.equal(darkGlove, checkedRoi.darkGlovePixels);
      assert.ok(darkGlove >= 40, `${state}/${measurement.frame}: expected actual black fingerless-glove or cuff pixels`);
      assert.equal(sha256(roi), checkedRoi.rgbaSha256, `${state}/${measurement.frame}: stale hand pixel proof`);
    }
    measured++;
    if (!measurement.contact) continue;
    for (const side of ['left', 'right']) fakeImages(() => {
      const actor = { ...hero('chris_redfield'), id: 'chris_redfield-p2', sourceHeroId: 'chris_redfield', state, stateElapsed: (measurement.frame + 0.01) / manifest.animations[state].fps,
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

test('the241 stage mechanisms preserve all201 prior definitions and their exact recorded render operations', () => {
  assert.equal(STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 9).length, 241); assert.equal(stageBaseline.profiles.length, 201);
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
  for (const profile of STAGE_ANIMATION_PROFILES.filter(profile => !stageBaseline.profiles.some(prior => prior.id === profile.id))) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode: 'Melee' }, before = structuredClone(stage);
    assert.equal(getStageAnimationProfile(stage)?.id, profile.id); assert.notDeepEqual(draw(stage, 0), draw(stage, profile.periodSeconds * 0.23));
    assert.deepEqual(getStageAnimationFrame(stage, 5, { reducedMotion: true }), getStageAnimationFrame(stage, 500, { reducedMotion: true }));
    assert.deepEqual(stage, before); assert.equal(profile.gameplayEffect, 'none');
  }
});



test('Beast Boy exposes only the eight accepted T-Rex poses and refused heroes retain declared fallbacks', () => fakeImages(() => {
  const partial = resolveCharacterAnimationAsset(hero('beast_boy_tt'));
  assert.equal(partial.frames, 8); assert.equal(partial.height, 512);
  assert.deepEqual(Object.keys(partial.phases), ['fatality', 'super']);
  for (const phase of phases.filter(name => !['fatality', 'super'].includes(name))) {
    const actor = { ...hero('beast_boy_tt'), presentationPhase: phase, presentationProgress: 0.6 };
    assert.equal(getCharacterAnimationFrame(actor), null);
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 0, 1, 96, 'melee');
    assert.ok(ctx.calls.some(call => call[0] === 'drawImage'));
    assert.ok(ctx.calls.filter(call => call[0] === 'drawImage').every(call => call[1].src !== partial.sheet));
    assert.equal(ctx.depth, 0);
  }
  for (const id of ['robin_tt', 'raven_tt', 'starfire_tt']) {
    assert.equal(resolveCharacterAnimationAsset(hero(id)), null);
    for (const phase of phases) assert.equal(getCharacterAnimationFrame({ ...hero(id), presentationPhase: phase, presentationProgress: 0.5 }), null);
  }
  assert.deepEqual(partial, runtimeBaseline.characterAssets.find(entry => entry.heroId === 'beast_boy_tt'));
}));

test('all eleven prior summon bodies stay immutable and the four new partners resolve only their exact triplets', () => {
  const entries = getSummonAnimationAssets();
  for (const prior of runtimeBaseline.summonAssets) {
    assert.deepEqual(entries.find(entry => entry.key === prior.key), prior);
    assert.equal(sha256(read(`public${prior.sheet}`)), prior.sha256);
  }
  const added = json('src/game/combat/summonAnimationsWave9.generated.json').entries;
  assert.equal(added.length, 4);
  const historicalKeys = new Set([...runtimeBaseline.summonAssets, ...added].map(entry => entry.key));
  assert.equal(entries.filter(entry => historicalKeys.has(entry.key)).length, 15);
  assert.deepEqual(sorted(added.map(entry => entry.performerHeroId)), sorted(json('docs/combat-fidelity-wave9-2026-10-22/batch-plan-before.json').plannedSummonPerformers));
  for (const entry of added) {
    assert.equal(entry.key, `${entry.universe}::${entry.entityName}::${entry.actionName}`);
    const descriptor = { ...entry, sourceHeroId: entry.performerHeroId, performerRole: 'reinforcement', performer: hero(entry.performerHeroId), action: { name: entry.actionName, sourceHeroId: entry.performerHeroId } };
    assert.equal(resolveSummonAnimationAsset(descriptor)?.sheet, entry.sheet);
    assert.equal(resolveSummonAnimationAsset({ ...descriptor, universe: 'Unrelated QA universe' }), null);
    assert.equal(resolveSummonAnimationAsset({ ...descriptor, action: { ...descriptor.action, name: 'Unrelated QA action' } }), null);
    assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256);
    assert.equal(sha256(read(entry.sourceImage)), entry.sourceImageSha256);
    assert.equal(entry.frames, 16); assert.equal(entry.canon1to1Verified, false);
  }
});


test('all twenty effective kits keep real equipment, support targets and exact source identities', () => {
  const authoredBeforeWave11 = json('docs/combat-fidelity-wave11-2026-10-23/authored-before.json');
  assert.equal(wave11NewKitIds.size, 16);
  assert.deepEqual(sorted(wave11NewKitIds), sorted(authoredBeforeWave11.selectedNewIds));
  for (const id of wave11NewKitIds) {
    assert.equal(authoredBeforeWave11.authoredHeroIds.includes(id), false, `${id}: W11 addition must be absent from the frozen prior catalog`);
    assert.equal(wave10NewKitIds.has(id), false, `${id}: W10 and W11 additions stay separate`);
    assert.equal(wave9Ids.includes(id), false, `${id}: no W9 kit may be excluded`);
    assert.ok(COMBAT_ABILITY_OVERRIDES[id], `${id}: new kit remains registered and covered by W11`);
  }
  const historicalEntries = Object.entries(COMBAT_ABILITY_OVERRIDES).filter(([id]) => !wave10NewKitIds.has(id) && !wave11NewKitIds.has(id));
  assert.deepEqual(sorted(historicalEntries.map(([id]) => id)), sorted(authoredBeforeWave11.authoredHeroIds.filter(id => !wave10NewKitIds.has(id))), 'The W9 perimeter retains every frozen prior ID except the explicit W10 additions');
  const kits = historicalEntries.map(([,kit]) => kit), slots = ['simple', 'secondary', 'defense'];
  assert.equal(kits.length, 1458); assert.equal(kits.reduce((n, kit) => n + slots.filter(slot => kit[slot]).length, 0), 4270);
  assert.equal(kits.filter(kit => slots.every(slot => kit[slot])).length, 1385);
  assert.equal(kits.filter(kit => !slots.every(slot => kit[slot])).length, 73);
  const supports = new Set(['baird', 'hoffman_cog', 'wrex', 'aramaki']); let damages = 0;
  for (const id of wave9Ids) {
    const h = hero(id), before = structuredClone(h), asset = resolveCharacterAnimationAsset(h);
    for (const slot of [...slots, 'special']) {
      const a = resolveCombatAbility(h, slot); assert.ok(a); assert.equal(a.sourceHeroId, id); assert.equal(a.universe, h.universe);
      assert.equal(a.provenance.canonicalVerified, false); assert.equal(a.provenance.networkVerified, false);
      assert.ok(!/Signature Strike|Breach Technique|Signature Guard|Origin Burst/i.test(a.name), `${id}:${slot}`);
      assert.ok(Number.isFinite(a.duration) && a.duration > a.hitAt && a.hitAt >= 0);
      if (a.effect === 'damage') assert.ok(a.multiplier > 0); else assert.equal(a.multiplier, 0);
      if (slot === 'defense') { assert.equal(a.effect, 'guard'); assert.equal(a.targetSide, 'self'); }
    }
    const superAction = resolveCombatAbility(h, 'special'); assert.equal(CHARACTER_PRESENTATIONS[id].sourceAction, superAction.name);
    if (asset.abilityName) assert.equal(asset.abilityName, superAction.name);
    assert.equal(supportsNativeSuperWave9(superAction), true);
    assert.equal(supportsNativeSuperWave9({ ...superAction, universe: 'Unrelated QA universe' }), false);
    assert.equal(supportsNativeSuperWave9({ ...superAction, name: 'Unrelated QA super' }), false);
    if (supports.has(id)) { assert.equal(superAction.multiplier, 0); assert.equal(superAction.delivery, 'support'); }
    else { assert.equal(superAction.effect, 'damage'); damages++; }
    assert.deepEqual(h, before);
  }
  assert.equal(damages, 16);
  for (const id of ['motoko', 'batou', 'togusa', 'saito_gits']) {
    const a = resolveCombatAbility(hero(id), 'special');
    assert.equal(a.delivery, 'projectile'); assert.equal(a.shape, 'single'); assert.equal(a.targetSide, 'enemy');
    assert.match(a.provenance.sourceWork, /Stand Alone Complex.*2002/);
  }
  for (const id of ['togusa', 'saito_gits']) {
    const a = resolveCombatAbility(hero(id), 'secondary'); assert.equal(a.effect, 'buff'); assert.equal(a.targetSide, 'self'); assert.equal(a.shape, 'single'); assert.equal(a.multiplier, 0);
  }
  for (const slot of ['simple', 'secondary', 'special']) {
    const a = resolveCombatAbility(hero('aramaki'), slot); assert.equal(a.effect, 'buff'); assert.equal(a.targetSide, 'ally'); assert.equal(a.shape, 'group'); assert.equal(a.multiplier, 0);
  }
  assert.equal(resolveCombatAbility(hero('wrex'), 'special').targetSide, 'self');
  assert.equal(resolveCombatAbility(hero('tali'), 'special').shape, 'single');
});

test('all measured native origins agree with the actual body draw rectangle on both sides and null recovery poses stay inactive', async () => {
  const anchors = Object.assign({}, ...['A', 'B', 'C', 'D'].map(part => json(`src/game/combat/nativeSuperAnchorsWave9Part${part}.generated.json`)));
  const supportIds = ['baird', 'hoffman_cog', 'wrex', 'aramaki'];
  assert.deepEqual(sorted(Object.keys(anchors)), sorted(wave9Ids.filter(id => !supportIds.includes(id))));
  let measured = 0, projections = 0;
  for (const id of wave9Ids) {
    const asset = resolveCharacterAnimationAsset(hero(id)), bytes = read(`public${asset.sheet}`), rgba = await sharp(bytes).ensureAlpha().raw().toBuffer();
    for (const phase of ['fatality', 'super']) for (let col = 0; col < 4; col++) {
      const point = anchors[id]?.[phase]?.[col] ?? null;
      if (point) {
        assert.equal(Array.isArray(point), false); assert.ok(Number.isInteger(point.x) && Number.isInteger(point.y));
        assert.ok(point.x >= 4 && point.x < 252 && point.y >= 4 && point.y < 252);
        let visible = 0; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (rgba[((asset.phases[phase].row * 256 + point.y + dy) * 1024 + col * 256 + point.x + dx) * 4 + 3] > 24) visible++;
        assert.ok(visible >= 8, `${id}:${phase}:${col}: measured origin is outside the actual native subject`); measured++;
      }
      for (const facing of [1, -1]) fakeImages(() => {
        const progress = [0, 0.3, 0.6, 1][col], actor = { ...hero(id), id: 'native-origin-p2', sourceHeroId: id, x: 300, y: 400,
          presentationPhase: phase, presentationProgress: progress, presentationImpactProgress: 0.5, facing, currentHp: 73, meter: 44 }, before = structuredClone(actor);
        const frame = getCharacterAnimationFrame(actor); assert.equal(frame.col, col);
        const projected = projectNativeSuperAnchorWave9(actor, progress, 0.5, 256), ctx = recorder();
        drawPixelSprite(ctx, actor.x, actor.y, actor, 0, facing, 256, 'melee');
        const draw = ctx.calls.find(call => call[0] === 'drawImage'), translate = ctx.calls.find(call => call[0] === 'translate');
        assert.equal(draw[1].src, asset.sheet); assert.equal(draw[2], col * 256); assert.equal(draw[3], asset.phases[phase].row * 256);
        if (!point) assert.equal(projected, null);
        else {
          assert.ok(projected, `${id}:${phase}:${col}: valid coordinates were silently rejected by the runtime helper`);
          assert.ok(Math.abs(projected.x - (translate[1] + facing * (draw[6] + point.x * draw[8] / 256))) < 1e-8);
          assert.ok(Math.abs(projected.y - (translate[2] + draw[7] + point.y * draw[9] / 256)) < 1e-8);
          projections++;
        }
        assert.equal(ctx.depth, 0); assert.deepEqual(actor, before);
        assert.equal(projectNativeSuperAnchorWave9({ ...actor, universe: 'Unrelated QA universe' }, progress, 0.5, 256), null);
      });
    }
  }
  assert.equal(measured, 78); assert.equal(projections, 156);
  const proofs = json('docs/combat-fidelity-wave9-2026-10-22/part-c-muzzle-review.json').measurements; assert.equal(proofs.length, 18);
  for (const proof of proofs) {
    assert.deepEqual(anchors[proof.heroId][proof.phase][proof.column], proof.point);
    const asset = resolveCharacterAnimationAsset(hero(proof.heroId)); assert.equal(asset.sha256, proof.sheetSha256);
    const raw = await sharp(read(`public${asset.sheet}`)).ensureAlpha().raw().toBuffer(), roi = Buffer.alloc(9 * 9 * 4); let pixel = 0, metal = 0;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const at = ((proof.row * 256 + proof.point.y + dy) * 1024 + proof.column * 256 + proof.point.x + dx) * 4;
      raw.copy(roi, pixel++ * 4, at, at + 4); const [r, g, b, a] = raw.subarray(at, at + 4);
      if (a > 24 && Math.max(r, g, b) < 170 && Math.max(r, g, b) - Math.min(r, g, b) < 85) metal++;
    }
    assert.equal(sha256(roi), proof.rgbaSha256); assert.equal(metal, proof.metalPixels); assert.ok(metal >= 4);
  }
});

test('the twenty native visual helpers are deterministic projections and never mutate combat state', () => {
  for (const id of wave9Ids) for (const facing of [1, -1]) for (const progress of [0.1, 0.4, 0.6, 0.9]) {
    const profile = resolveCombatAbility(hero(id), 'special'), actor = { ...hero(id), id: 'visual-p2', sourceHeroId: id, x: 300, y: 400, currentHp: 73, meter: 44 },
      action = { elapsed: progress, duration: 1, hitAt: 0.45, facing }, target = { x: 300 + facing * 160, y: 400, currentHp: 82 };
    const input = { actor, profile, action, target, height: 80, contactVisual: { confirmed: true, x: target.x, y: target.y } }, before = structuredClone(input);
    const state = getNativeSuperVisualStateWave9(input); assert.ok(state); assert.equal(state.family, 'native-wave9'); assert.equal(state.gameplayEffect, 'none');
    const a = recorder(), b = recorder(); drawNativeSuperVisualsWave9(a, state); drawNativeSuperVisualsWave9(b, getNativeSuperVisualStateWave9(input));
    assert.deepEqual(a.calls, b.calls); assert.equal(a.depth, 0); assert.equal(b.depth, 0); assert.deepEqual(input, before);
    assert.equal(getNativeSuperVisualStateWave9({ ...input, profile: { ...profile, name: 'Unrelated QA action' } }), null);
  }
});
