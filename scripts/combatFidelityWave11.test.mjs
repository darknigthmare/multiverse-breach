import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';
import { HEROES_DB } from '../src/game/heroes.js';
import { ABILITIES_WAVE11 } from '../src/game/combat/abilities/abilitiesWave11.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../src/game/combat/characterAnimationCatalog.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { getMeleeAnimationFrame, getMeleeAnimationManifest, validateMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { MELEE_STATES, MELEE_TRANSITION_DATA } from '../src/game/melee/meleeStateMachine.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteStateResolution } from '../src/game/spriteAssets.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationFrame, getStageAnimationProfile, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { getCharacterFormFrame } from '../src/game/combat/characterFormState.js';
import { getSummonAnimationAssets, resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { supportsNativeSuperWave11, projectNativeSuperAnchorWave11, getNativeSuperVisualStateWave11, drawNativeSuperVisualsWave11 } from '../src/game/combat/nativeSuperVisualsWave11.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 } from '../src/game/combat/combatSourceDefinitionsWave11.js';
import { getCharacterFormAssets } from '../src/game/combat/characterFormCatalog.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const stateRows = entry => Array.isArray(entry.states)
  ? entry.states.map((state, row) => [state, { row, frames: entry.columns }]) : Object.entries(entry.states);
const projectReference = path => path.startsWith('public/') ? path : `public${path}`;

const old = json('docs/combat-fidelity-wave11-2026-10-23/baseline.json');
const runtimeBaseline = json('docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json');
const stageBaseline = json('docs/combat-fidelity-wave11-2026-10-23/stage-baseline.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const partPaths = ['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterAnimationsWave11Part${part}.generated.json`);
const wave11Ids = Object.values(json('docs/combat-fidelity-wave11-2026-10-23/batch-plan-before.json').parts).flat();
const nativeIds = wave11Ids.filter(id => !['harry_potter', 'hermione_granger', 'snape'].includes(id));
const blockedIds = ['harry_potter', 'hermione_granger', 'snape'];
const fullIds = nativeIds.filter(id => !blockedIds.includes(id));
const baseIds = fullIds;
const fullMeleeIds = ['buffy_summers', 'arthur_kaamelott'];
const fullPrefix = id => ({ buffy_summers: 'buffy', arthur_kaamelott: 'arthur' })[id];
const fullMeleePaths = fullMeleeIds.flatMap(id => ['Motion', 'Combat'].map(kind => `src/game/combat/${fullPrefix(id)}Melee${kind}.generated.json`));

const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const noop = () => {};
let vite, drawPixelSprite, EngineFighter, EngineSmash, EngineRpg;
const engines = [];
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
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

test('the frozen W10 assets,372 PNGs,80 registries and ten detailed manifests remain exactly immutable', () => {
  assert.equal(sha256(read('docs/combat-fidelity-wave11-2026-10-23/baseline.json')), 'e01a284de619f69710a4d87aaa841b203af91f210dc969cd5ec1b65f4c012b4b');
  assert.equal(sha256(read('docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json')), '51bd0c86ea4ece733aa204ac21085f5bd992912dabddaccac952d7f31f8646fb');
  assert.equal(sha256(read('docs/combat-fidelity-wave11-2026-10-23/stage-baseline.json')), 'b950b641d8ae75f0978a4854baf60735ce103b4c26bcf5a2f03c0633e594a12d');
  assert.equal(old.meleeBindings.nativePresentationHeroes,155); assert.equal(runtimeBaseline.characterAssets.length,157);
  for(const prior of runtimeBaseline.characterAssets){assert.equal(sha256(read(`public${prior.sheet}`)),prior.sha256);assert.deepEqual(resolveCharacterAnimationAsset(hero(prior.heroId)),prior);}
  assert.equal(Object.keys(runtimeBaseline.manifests).length,10);
  for(const[id,prior]of Object.entries(runtimeBaseline.manifests))assert.deepEqual(getMeleeAnimationManifest(id),prior,id);
  const pngs=new Map();let registries=0;
  for(const path of Object.keys(old.inputHashes).filter(p=>p.endsWith('.generated.json'))){
    assert.equal(sha256(read(path)),old.inputHashes[path],path);const data=json(path);if(Array.isArray(data.entries))registries++;
    for(const entry of data.entries||[])if(entry.sheet&&entry.sha256){assert.equal(sha256(read(`public${entry.sheet}`)),entry.sha256);if(pngs.has(entry.sheet))assert.equal(pngs.get(entry.sheet),entry.sha256);pngs.set(entry.sheet,entry.sha256);}
  }
  assert.equal(registries,80);assert.equal(pngs.size,372);assert.equal(old.baseSpriteCorrections.entries.length,103);
  for(const e of old.baseSpriteCorrections.entries){assert.equal(getHeroSpriteSheetSrc(hero(e.heroId),'rpg'),e.sheet);const layout=getSpriteSheetLayout(e.sheet);assert.equal(layout.columns,4);assert.equal(layout.rows,4);}
  const added=[...partPaths,...['A','B','C','D'].map(p=>`src/game/combat/characterSpriteCorrectionsWave11Part${p}.generated.json`),...fullMeleePaths,'src/game/combat/summonAnimationsWave11.generated.json'].flatMap(p=>json(p).entries);
  assert.equal(added.length,93);for(const e of added){assert.equal(pngs.has(e.sheet),false,e.sheet);assert.equal(sha256(read(`public${e.sheet}`)),e.sha256);pngs.set(e.sheet,e.sha256);}assert.equal(pngs.size,465);
});

test('the runtime union preserves157 old records and adds exactly37 complete32 atlases, excluding three explicit refusals', async () => {
  const entries = partPaths.flatMap(path => json(path).entries), allHashes = new Set();
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(nativeIds));
  const priorIds = [...runtimeBaseline.characterAssets.map(entry => entry.heroId), ...nativeIds];
  const preserved = getCharacterAnimationAssets().filter(entry => priorIds.includes(entry.heroId));
  assert.deepEqual(sorted(preserved.map(entry => entry.heroId)), sorted(priorIds));
  assert.equal(preserved.length, 194);
  assert.equal(new Set(getCharacterAnimationAssets().map(entry => entry.heroId)).size, getCharacterAnimationAssets().length);
  for (const entry of entries) {
    assert.equal(hero(entry.heroId).universe, entry.universe);
    for (const key of ['sourceHeroId', 'sourceId']) assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'instance-p2', [key]: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }), null);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), sourceHeroId: 'unregistered-source' }), null);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    const expected = phases;
    assert.equal(entry.frames, expected.length * 4); assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(expected)); expected.forEach((phase, row) => assert.equal(entry.phases[phase].row, row));
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.phases));
    for (const [phase, actual] of hashes) {
      const review = entry.visualValidation.phaseReviews.find(value => value.phase === phase);
      assert.deepEqual(actual, review.frameHashes, `${entry.heroId}:${phase}: stale pixel review`);
      for (const digest of actual) { assert.equal(allHashes.has(digest), false, `${entry.heroId}: reused bitmap`); allHashes.add(digest); }
    }
  }
  assert.equal(allHashes.size, 1184);
  assert.equal(entries.filter(entry => entry.frames === 32 && Object.keys(entry.phases).length === 8).length, fullIds.length);
  assert.equal(preserved.filter(entry => entry.frames === 32 && Object.keys(entry.phases).length === 8).length, 192);
  for (const part of ['a', 'b', 'c', 'd']) {
    const provenance = json(`docs/combat-fidelity-wave11-2026-10-23/part-${part}-provenance.json`);
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
      const authoredScale = entry.normalization.rows[spec.row].renderScale ?? 1;
      assert.ok(Math.abs(draw[8] - 90 * authoredScale) < 1e-8); assert.ok(Math.abs(draw[9] - 90 * authoredScale) < 1e-8);
      assert.ok(Math.abs(draw[7] + 244 * 90 / 256 * authoredScale) < 1e-8);
      assert.ok(a.calls.some(call => call[0] === 'scale' && call[1] === facing)); assert.equal(a.depth, 0); assert.equal(b.depth, 0);
      assert.deepEqual(actor, before); columns.add(frame.col); draws++;
    }
    assert.equal(columns.size, 4, `${entry.heroId}:${phase}: inaccessible native cell`);
  }
  assert.equal(draws, 2368);
}));

test('all37 new base layouts contain592 real cells and render every native cell with baseline244 and its authored row scale', async () => {
  const entries = ['A', 'B', 'C', 'D'].flatMap(part => json(`src/game/combat/characterSpriteCorrectionsWave11Part${part}.generated.json`).entries);
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(baseIds));
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
    // The complete45-state melee atlases take priority over their coarse bases;
    // those new16-cell sheets remain the actual RPG bodies.
    if (fullMeleeIds.includes(entry.heroId)) assert.equal(getHeroSpriteSheetSrc(hero(entry.heroId), 'melee'), getMeleeAnimationManifest(entry.heroId).animations.idle.sheet);
    for (const context of fullMeleeIds.includes(entry.heroId) ? ['rpg'] : ['melee', 'rpg']) {
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
  assert.equal(unique.size, 592); assert.equal(draws, 2304);
});

test('all164 prior character presentation recipes remain exactly immutable', () => {
  assert.equal(Object.keys(runtimeBaseline.presentations).length, 164);
  for (const [id, prior] of Object.entries(runtimeBaseline.presentations)) assert.deepEqual(CHARACTER_PRESENTATIONS[id], prior, id);
  const historicalIds = [...Object.keys(runtimeBaseline.presentations), ...wave11Ids];
  assert.equal(new Set(historicalIds).size, 204);
  const rosterPresentations = Object.keys(CHARACTER_PRESENTATIONS).filter(id => historicalIds.includes(id) && roster.has(id));
  assert.equal(rosterPresentations.length, 203);
  assert.equal(rosterPresentations.reduce((count, id) => count + Object.keys(CHARACTER_PRESENTATIONS[id].phases).length, 0), 1421);
  for (const id of wave11Ids) for (const phase of PRESENTATION_PHASES) {
    const script = resolvePresentationScript(hero(id), phase); assert.ok(script); assert.equal(script.heroId, id);
    assert.equal(script.universe, hero(id).universe); assert.equal(script.provenance.canonicalSequence, false);
  }
});

test('new Fighter scenes freeze on zero simulation time and drawing never changes match resources or outcome', () => fakeImages(() => {
  for (const id of wave11Ids) {
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

test('the401 stage mechanisms preserve all321 prior definitions and their exact recorded render operations', () => {
  assert.equal(STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 11).length, 401); assert.equal(stageBaseline.profiles.length, 321);
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

test('all23 prior summon bodies stay immutable and the eight new partners resolve only their exact triplets', () => {
  const entries = getSummonAnimationAssets();
  for (const prior of runtimeBaseline.summonAssets) {
    assert.deepEqual(entries.find(entry => entry.key === prior.key), prior);
    assert.equal(sha256(read(`public${prior.sheet}`)), prior.sha256);
  }
  const added = json('src/game/combat/summonAnimationsWave11.generated.json').entries;
  assert.equal(added.length, 7);
  const historicalKeys = new Set([...runtimeBaseline.summonAssets, ...added].map(entry => entry.key));
  assert.equal(entries.filter(entry => historicalKeys.has(entry.key)).length, 30);
  assert.equal(new Set(added.map(entry => entry.performerHeroId)).size, 7);
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


test('the forty native visual helpers are deterministic projections and never mutate combat state', () => {
  for (const id of wave11Ids) for (const facing of [1, -1]) for (const progress of [0.1, 0.4, 0.6, 0.9]) {
    const profile = resolveCombatAbility(hero(id), 'special'), actor = { ...hero(id), id: 'visual-p2', sourceHeroId: id, x: 300, y: 400, currentHp: 73, meter: 44 },
      action = { elapsed: progress, duration: 1, hitAt: 0.45, facing }, target = { x: 300 + facing * 160, y: 400, currentHp: 82 };
    const input = { actor, profile, action, target, height: 80, contactVisual: { confirmed: true, x: target.x, y: target.y } }, before = structuredClone(input);
    const state = getNativeSuperVisualStateWave11(input); assert.ok(state); assert.equal(state.family, 'native-wave11'); assert.equal(state.gameplayEffect, 'none');
    const a = recorder(), b = recorder(); drawNativeSuperVisualsWave11(a, state); drawNativeSuperVisualsWave11(b, getNativeSuperVisualStateWave11(input));
    assert.deepEqual(a.calls, b.calls); assert.equal(a.depth, 0); assert.equal(b.depth, 0); assert.deepEqual(input, before);
    assert.equal(getNativeSuperVisualStateWave11({ ...input, profile: { ...profile, name: 'Unrelated QA action' } }), null);
  }
});

for (const id of fullMeleeIds) {
  const chrisPaths = ['Motion','Combat'].map(kind => `src/game/combat/${fullPrefix(id)}Melee${kind}.generated.json`);
test(`${id} has six real native atlases with45 exclusive rows,180 distinct poses and no unused-row fiction`, async () => {
  const entries = chrisPaths.flatMap(path => json(path).entries), unique = new Set(); assert.equal(entries.length, 6);
  assert.deepEqual(sorted(entries.flatMap(entry => stateRows(entry).map(([state]) => state))), sorted(MELEE_STATES));
  for (const entry of entries) {
    assert.equal(entry.heroId, id); assert.equal(entry.universe, hero(id).universe);
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
  const manifest = getMeleeAnimationManifest(id); assert.ok(manifest); assert.equal(manifest.dedicatedStateRows, true);
  assert.equal(manifest.source1to1Verified, false); assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
  assert.equal(new Set(MELEE_STATES.map(state => `${manifest.animations[state].sheet}:${manifest.animations[state].row}`)).size, 45);
  for (const state of MELEE_STATES) {
    const animation = manifest.animations[state]; assert.equal(animation.frameCount, 4);
    assert.deepEqual(animation.events, []); assert.deepEqual(animation.hitboxes, []); assert.deepEqual(animation.rootMotion, []);
    assert.ok(entries.some(entry => entry.sheet === animation.sheet && stateRows(entry).some(([name, spec]) => name === state && spec.row === animation.row)));
  }
});

test(`${id}: all45 states draw actual cells on both sides, keep loop/transition clocks and freeze on pause`, () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest(id); assert.ok(manifest);
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
      const actor = { ...hero(id), id: 'p2-copy', sourceHeroId: id, state, stateElapsed: elapsed }, original = structuredClone(actor);
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
  assert.equal(getHeroMeleeAnimationFrame({ ...hero(id), universe: 'Unrelated QA universe' }, 0), null);
  assert.notEqual(getHeroSpriteSheetSrc({ ...hero(id), universe: 'Unrelated QA universe', state: 'idle' }, 'melee'), manifest.animations.idle.sheet);
}));

test(`${id} keeps real190px standing calibration and source-wide stature factors in actual draw rectangles`, async () => {
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
    assert.equal(roi.height, calibration.sourceBodyHeight);
    const standingHeight = calibration.sourceStandingBodyHeight ?? calibration.sourceBodyHeight;
    if (standingHeight !== roi.height) { assert.match(calibration.standingEquivalentMethod, /anatomical|crown.*hip|path/i); assert.ok(calibration.anatomicalPath); }
    assert.ok(Math.abs(standingHeight * calibration.scale * (calibration.renderScale ?? 1) - 190) < 0.01);
    assert.ok(Math.abs(actualHeight * calibration.scale * (calibration.renderScale ?? 1) - calibration.sourceBodyHeight * calibration.scale * (calibration.renderScale ?? 1)) <= 3);
    const prior = calibrations.get(source); if (prior) assert.equal(prior, calibration.scale * (calibration.renderScale ?? 1));
    calibrations.set(source, calibration.scale * (calibration.renderScale ?? 1));
  }
  assert.ok(calibrations.size >= 6);
  for (const entry of entries.filter(entry => entry.normalization.rows)) for (const row of entry.normalization.rows) fakeImages(() => {
    const scale = row.renderScale ?? 1, manifest = getMeleeAnimationManifest(id), spec = manifest.animations[row.state];
    const actor = { ...hero(id), id: 'full-native-p2', sourceHeroId: id, state: row.state, stateElapsed: 0.01 / spec.fps };
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 0, -1, 256, 'melee');
    const draw = ctx.calls.find(call => call[0] === 'drawImage'); assert.equal(draw[1].src, entry.sheet);
    assert.equal(draw[8], 256 * scale); assert.equal(draw[9], 256 * scale);
    const frame = getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000);
    const anchorY = frame.anchor?.y * 256 || 244;
    assert.ok(Math.abs(draw[7] + anchorY * scale) < 1e-8, `${row.state}: authored body/hand anchor must scale with the whole cell`);
    assert.equal(ctx.depth, 0);
  });
});

test(`${id} ordinary actions follow runtime impact clocks while the full super uses its separate atlas`, () => fakeImages(() => {
  assert.equal(resolveCombatAbility(hero(id), 'special').effect, 'damage');
  const manifest = getMeleeAnimationManifest(id); assert.ok(manifest);
  for (const state of ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'ledgeAttack']) {
    const action = { elapsed: 0.309, duration: 0.9, hitAt: 0.31 };
    assert.equal(getMeleeAnimationFrame(manifest, state, 309, { action }).frame, 1);
    assert.equal(getMeleeAnimationFrame(manifest, state, 310, { action: { ...action, elapsed: 0.31 } }).frame, 2);
    assert.equal(getMeleeAnimationFrame(manifest, state, 900, { action: { ...action, elapsed: 0.9 } }).frame, 3);
  }
  const full = resolveCharacterAnimationAsset(hero(id));
  for (const action of [{ type: 'super', elapsed: 0.6, duration: 1, hitAt: 0.4 }, { superProfile: {}, elapsed: 0.6, duration: 1, hitAt: 0.4 }]) {
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, { ...hero(id), state: 'special', action }, 0, 1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, full.sheet);
  }
}));


}

test('all40 selected source versions and four-slot kits match independent W11 identities and support roles', () => {
  const kits=Object.values(COMBAT_ABILITY_OVERRIDES),slots=['simple','secondary','defense'];
  assert.equal(Object.keys(ABILITIES_WAVE11).length,16);assert.equal(kits.length,1491);assert.equal(kits.reduce((n,k)=>n+slots.filter(s=>k[s]).length,0),4369);assert.equal(kits.filter(k=>slots.every(s=>k[s])).length,1418);assert.equal(kits.filter(k=>!slots.every(s=>k[s])).length,73);
  assert.deepEqual(sorted(Object.keys(COMBAT_SOURCE_DEFINITIONS_WAVE11)),sorted(wave11Ids));let damage=0,support=0;
  for(const id of wave11Ids){const h=hero(id),before=structuredClone(h),def=COMBAT_SOURCE_DEFINITIONS_WAVE11[id],superAction=resolveCombatAbility(h,'special');
    for(const slot of [...slots,'special']){const a=resolveCombatAbility(h,slot);assert.equal(a.sourceHeroId,id);assert.equal(a.universe,h.universe);assert.equal(a.provenance.canonicalVerified,false);assert.equal(a.provenance.networkVerified,false);assert.doesNotMatch(a.name,/Signature Strike|Breach Technique|Signature Guard|Origin Burst/i);assert.ok(Number.isFinite(a.duration)&&a.duration>a.hitAt&&a.hitAt>=0);if(a.effect==='damage')assert.ok(a.multiplier>0);else assert.equal(a.multiplier,0);}
    assert.equal(superAction.name,def.name);assert.equal(superAction.universe,def.universe);assert.equal(superAction.effect,def.effect);assert.equal(superAction.delivery,def.delivery);assert.equal(CHARACTER_PRESENTATIONS[id].sourceAction,def.name);assert.equal(supportsNativeSuperWave11(superAction),true);
    for(const patch of[{universe:'Wrong QA universe'},{name:'Wrong QA action'},{sourceHeroId:'unknown-source'},{effect:superAction.effect==='damage'?'buff':'damage'},{delivery:superAction.delivery==='melee'?'projectile':'melee'}])assert.equal(supportsNativeSuperWave11({...superAction,...patch}),false);
    if(def.effect==='damage')damage++;else{support++;assert.equal(superAction.multiplier,0);assert.equal(superAction.delivery,'support');}assert.deepEqual(h,before);
  }
  assert.equal(damage,23);assert.equal(support,17);
  for(const id of ['claptrap_borderlands','nux','toast_mm','capable_mm']){const a=resolveCombatAbility(hero(id),'special');assert.notEqual(a.effect,'damage');assert.equal(a.multiplier,0);assert.doesNotMatch(a.name,/funzerker|vaulthunter|valhalla|healing/i);}
  assert.equal(resolveCombatAbility(hero('roland_bl'),'special').delivery,'projectile');assert.match(resolveCombatAbility(hero('roland_bl'),'secondary').name,/Scorpio/);assert.doesNotMatch(resolveCombatAbility(hero('roland_bl'),'special').name,/turret|tourelle|Crimson Raiders/i);
  assert.equal(resolveCombatAbility(hero('brick_bl'),'special').delivery,'melee');assert.doesNotMatch(resolveCombatAbility(hero('brick_bl'),'special').name,/Slab|axe/i);
  assert.match(resolveCombatAbility(hero('furiosa'),'special').name,/Furiosa/);assert.equal(resolveCombatAbility(hero('capable_mm'),'special').effect,'guard');assert.equal(resolveCombatAbility(hero('toast_mm'),'special').effect,'buff');
});

test('Janine exposes only six accepted phases and uses declared existing-pose fallbacks for the two refused phases', () => fakeImages(() => {
  const h=hero('janine_gb'),asset=resolveCharacterAnimationAsset(h);assert.equal(asset.frames,24);assert.equal(asset.rows,6);
  assert.deepEqual(sorted(Object.keys(asset.phases)),sorted(phases.filter(p=>!['super','fatality'].includes(p))));
  assert.equal(['A','B','C','D'].flatMap(p=>json(`src/game/combat/characterSpriteCorrectionsWave11Part${p}.generated.json`).entries).some(e=>e.heroId===h.id),false);
  const sheet=getHeroSpriteSheetSrc(h,'rpg'),layout=getSpriteSheetLayout(sheet);assert.equal(sheet,asset.sheet);assert.equal(layout.adaptedPresentationFallback,true);
  for(const phase of ['super','fatality']){const actor={...h,presentationPhase:phase,presentationProgress:.55,currentHp:73,meter:44},before=structuredClone(actor),ctx=recorder();assert.equal(getCharacterAnimationFrame(actor),null);drawPixelSprite(ctx,200,400,actor,0,1,96,'rpg');const draw=ctx.calls.find(c=>c[0]==='drawImage');assert.ok(draw);assert.equal(draw[1].src,asset.sheet);assert.ok(draw[3]>=0&&draw[3]<asset.height);assert.deepEqual(actor,before);assert.equal(ctx.depth,0);}
}));

for(const id of fullMeleeIds)test(`${id}:12 real palms and wrists remain attached to both actual ledges without mutating physics`,async()=>{
  const entry=json(`src/game/combat/${fullPrefix(id)}MeleeCombat.generated.json`).entries.find(e=>e.id===`${fullPrefix(id)}-ledge`),manifest=getMeleeAnimationManifest(id),proof=json(`docs/combat-fidelity-wave11-2026-10-23/${fullPrefix(id)}-sources/hand-measurements.json`),rgba=await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer(),platform={x1:150,x2:620,y:170};
  assert.equal(proof.requiredPalms,12);assert.equal(proof.requiredWrists,12);assert.equal(proof.requiredContacts,11);let measured=0,attached=0;
  for(const state of ['ledgeCatch','ledgeHang','ledgeClimb']){const rows=entry.normalization.contactAnchorMeasurements[state];assert.deepEqual(rows.map(p=>p.frame),[0,1,2,3]);assert.deepEqual(rows,proof.states[state]);
    for(const m of rows){for(const p of [m,m.wrist]){assert.ok(p);let visible=0;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(rgba[((entry.states[state].row*256+p.y+dy)*1024+m.frame*256+p.x+dx)*4+3]>24)visible++;assert.ok(visible>=60,`${id}:${state}:${m.frame}: palm/cuff not on actual body`);assert.equal(visible,p.visibleNeighborhood9x9,`${id}:${state}:${m.frame}: stale pixel count`);}measured++;
      if(!m.contact)continue;for(const side of ['left','right'])fakeImages(()=>{const actor={...hero(id),id:'runtime-full-p2',sourceHeroId:id,state,stateElapsed:(m.frame+.01)/manifest.animations[state].fps,...(state==='ledgeClimb'?{meleeLedgeVisual:{side,platform}}:{ledge:{side,platform}})},before=structuredClone(actor),ctx=recorder();drawPixelSprite(ctx,340,440,actor,0,side==='left'?-1:1,96,'melee');const draw=ctx.calls.find(c=>c[0]==='drawImage'),move=ctx.calls.find(c=>c[0]==='translate'),flip=ctx.calls.find(c=>c[0]==='scale')[1];assert.equal(draw[1].src,entry.sheet);assert.equal(draw[2],m.frame*256);assert.equal(draw[3],entry.states[state].row*256);assert.ok(Math.abs(move[1]+flip*(draw[6]+m.x*draw[8]/256)-(side==='left'?platform.x1:platform.x2))<1e-8);assert.ok(Math.abs(move[2]+draw[7]+m.y*draw[9]/256-platform.y)<1e-8);assert.equal(flip,side==='left'?1:-1);assert.deepEqual(actor,before);assert.equal(ctx.depth,0);});attached++;
    }
  }assert.equal(measured,12);assert.equal(attached,11);
});

test('measured physical origins match actual scaled native draw rectangles on both sides, while supports and recovery stay inactive',async()=>{
  const anchors=Object.assign({},...['A','B','C','D'].map(p=>json(`src/game/combat/nativeSuperAnchorsWave11Part${p}.generated.json`)));let measured=0,projected=0;
  for(const id of wave11Ids){const asset=resolveCharacterAnimationAsset(hero(id));if(!asset){assert.ok(blockedIds.includes(id));for(const phase of ['super','fatality'])assert.ok((anchors[id]?.[phase]||[]).every(p=>p===null));continue;}const raw=await sharp(read(`public${asset.sheet}`)).ensureAlpha().raw().toBuffer();
    const definition=COMBAT_SOURCE_DEFINITIONS_WAVE11[id];
    if(definition.effect==='damage'&&['projectile','beam'].includes(definition.delivery))for(const phase of ['fatality','super']) { assert.equal(anchors[id]?.[phase]?.length,4,`${id}:${phase}: missing physical-origin table`); assert.ok(anchors[id][phase].some(Boolean),`${id}:${phase}: no measured physical origin`); }
    if(definition.effect!=='damage')for(const phase of ['fatality','super'])assert.ok((anchors[id]?.[phase]||[]).every(p=>p===null),`${id}: support must not acquire an offensive muzzle`);
    for(const phase of ['fatality','super'])for(let col=0;col<4;col++){const point=anchors[id]?.[phase]?.[col]??null,spec=asset.phases[phase];if(!spec){assert.equal(point,null);continue;}
      if(point){assert.equal(Array.isArray(point),false);assert.ok(Number.isInteger(point.x)&&Number.isInteger(point.y));assert.ok(point.x>=4&&point.x<252&&point.y>=4&&point.y<252);let visible=0;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(raw[((spec.row*256+point.y+dy)*1024+col*256+point.x+dx)*4+3]>24)visible++;assert.ok(visible>=8,`${id}:${phase}:${col}: origin outside native subject`);assert.ok(raw[((spec.row*256+point.y)*1024+col*256+point.x)*4+3]>24,`${id}:${phase}:${col}: origin center is transparent`);measured++;}
      for(const facing of[1,-1])fakeImages(()=>{const progress=[0,.3,.6,1][col],actor={...hero(id),id:'native-origin-p2',sourceHeroId:id,x:300,y:400,presentationPhase:phase,presentationProgress:progress,presentationImpactProgress:.5,facing,currentHp:73,meter:44},before=structuredClone(actor),frame=getCharacterAnimationFrame(actor);assert.equal(frame.col,col);const origin=projectNativeSuperAnchorWave11(actor,progress,.5,256),ctx=recorder();drawPixelSprite(ctx,actor.x,actor.y,actor,0,facing,256,'melee');const draw=ctx.calls.find(c=>c[0]==='drawImage'),move=ctx.calls.find(c=>c[0]==='translate');assert.equal(draw[1].src,asset.sheet);if(!point)assert.equal(origin,null);else{assert.ok(origin);assert.ok(Math.abs(origin.x-(move[1]+facing*(draw[6]+point.x*draw[8]/256)))<1e-8);assert.ok(Math.abs(origin.y-(move[2]+draw[7]+point.y*draw[9]/256))<1e-8);projected++;}assert.equal(projectNativeSuperAnchorWave11({...actor,universe:'Unrelated QA universe'},progress,.5,256),null);assert.deepEqual(actor,before);assert.equal(ctx.depth,0);});
    }
  }assert.ok(measured>=40);assert.equal(projected,measured*2);
  const proofs=json('docs/combat-fidelity-wave11-2026-10-23/part-c-muzzle-measurements.json').measurements;assert.equal(proofs.length,24);
  for(const proof of proofs){const asset=resolveCharacterAnimationAsset(hero(proof.heroId)),raw=await sharp(read(`public${asset.sheet}`)).ensureAlpha().raw().toBuffer(),roi=Buffer.alloc(9*9*4);assert.deepEqual(anchors[proof.heroId][proof.phase][proof.column],proof.point);assert.equal(asset.sha256,proof.normalizedPngSha256);let i=0,metal=0;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const at=((asset.phases[proof.phase].row*256+proof.point.y+dy)*1024+proof.column*256+proof.point.x+dx)*4;raw.copy(roi,i++*4,at,at+4);const[r,g,b,a]=raw.subarray(at,at+4);if(a>24&&Math.max(r,g,b)<150&&Math.max(r,g,b)-Math.min(r,g,b)<65)metal++;}assert.equal(sha256(roi),proof.rgbaSha256);assert.ok(metal>=4);assert.equal(raw[((asset.phases[proof.phase].row*256+proof.point.y)*1024+proof.column*256+proof.point.x)*4+3],proof.centerAlpha);}
  for(const id of['claptrap_borderlands','nux','toast_mm','capable_mm'])for(const p of['super','fatality'])assert.ok((anchors[id]?.[p]||[]).every(v=>v===null));
});

test('all93 newly retained PNGs contain2248 distinct real RGBA cells across presentations, bases,45-state sheets and partners',async()=>{
  const presentations=partPaths.flatMap(p=>json(p).entries),bases=['A','B','C','D'].flatMap(p=>json(`src/game/combat/characterSpriteCorrectionsWave11Part${p}.generated.json`).entries),full=fullMeleePaths.flatMap(p=>json(p).entries),partners=json('src/game/combat/summonAnimationsWave11.generated.json').entries;
  const groups=[...presentations.map(e=>[e,Object.entries(e.phases)]),...bases.map(e=>[e,stateRows(e)]),...full.map(e=>[e,stateRows(e)]),...partners.map(e=>[e,Object.entries(e.phases)])],hashes=new Set();let cells=0;
  assert.equal(groups.length,93);assert.equal(new Set(groups.map(([e])=>e.sheet)).size,93);
  for(const[e,rows]of groups){const bytes=read(`public${e.sheet}`);assert.equal(sha256(bytes),e.sha256);const{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true}),fw=e.frameWidth??e.dimensions.cellWidth,fh=e.frameHeight??e.dimensions.cellHeight;assert.equal(info.width,fw*4);assert.equal(info.height,e.height??e.dimensions.height);
    for(const[label,spec]of rows)for(let col=0;col<4;col++){const rgba=Buffer.alloc(fw*fh*4);let visible=0;for(let y=0;y<fh;y++)for(let x=0;x<fw;x++){const at=((spec.row*fh+y)*info.width+col*fw+x)*4,a=data[at+3];if(a>0)data.copy(rgba,(y*fw+x)*4,at,at+4);if(a>24)visible++;if(x<10||x>=fw-10||y<10||y>=fh-10)assert.equal(a,0,`${e.id}:${label}:${col}: crop at cell border`);}assert.ok(visible>300);const digest=`${fw}x${fh}:`+sha256(rgba);assert.equal(hashes.has(digest),false,`${e.id}:${label}:${col}: reused exact native cell`);hashes.add(digest);cells++;}
  }assert.equal(cells,2248);assert.equal(hashes.size,2248);
});

test('real Buffy and Arthur land from the last3px of a moving fall, preserve all four landing cells and keep P1/P2 velocity responsive',()=>fakeImages(()=>{
  for(const id of fullMeleeIds)for(const side of ['p1','p2'])for(const direction of [-1,1]){
    const h=hero(id),opponent=hero('cloud_ff7'),engine=new EngineSmash(960,540,[h],{monsters:[opponent],bosses:[],customRoster:[opponent]},{add:noop},noop,noop,{universe:h.universe,mode:'Smash',disableHazards:true,customBattle:{opponentControl:'p2',singleRoster:true}});engines.push(engine);engine.syncPreMatchFromServer(3000);engine.ensureLocalVersusLeaders();engine.platforms=[{x1:0,x2:960,y:engine.groundY,type:'ground'}];
    const actor=side==='p1'?engine.getActiveHero():engine.getActiveOpponent(),target=side==='p1'?engine.getActiveOpponent():engine.getActiveHero();
    // P2 must also use the assigned native identity, not a Cloud-only fixture.
    Object.assign(actor,h,{id:`${id}-${side}`,sourceHeroId:id,isLeader:true,state:'fall',stateElapsed:.2,x:400,y:engine.groundY-2.45,vx:0,vy:7.9,facing:direction,action:null,currentHp:100});
    const hp=actor.currentHp,keys=direction<0?{left:true}:{right:true},move=()=>{engine.updateLocalVersusMovement(actor,target,keys,side);engine.updateLocalVersusActor(actor);};
    assert.ok(engine.isOnGround(actor),'legacy near-ground jump tolerance remains unchanged');
    engine.updateLocalVersusMovement(actor,target,keys,side);assert.equal(actor.state,'fall','horizontal movement must not replace fall before collision');assert.equal(actor.vx,direction*4);assert.equal(actor.facing,direction);
    engine.updateLocalVersusActor(actor);assert.equal(actor.state,'land');assert.equal(actor.y,engine.groundY);assert.equal(actor.vy,0);const startX=actor.x,columns=new Set();
    for(let tick=0;tick<6;tick++){
      assert.equal(actor.state,'land');const ctx=recorder(),frame=getHeroMeleeAnimationFrame(actor,actor.stateElapsed*1000);drawPixelSprite(ctx,actor.x,actor.y,actor,0,direction,96,'melee');const draw=ctx.calls.find(c=>c[0]==='drawImage');assert.equal(draw[1].src,getMeleeAnimationManifest(id).animations.land.sheet);assert.equal(draw[2],frame.col*256);assert.equal(draw[3],getMeleeAnimationManifest(id).animations.land.row*256);columns.add(frame.col);assert.equal(ctx.depth,0);move();
    }
    assert.deepEqual(sorted(columns),[0,1,2,3]);assert.equal(actor.vx,direction*4);assert.ok((actor.x-startX)*direction>0);for(let tick=0;tick<4;tick++)move();assert.equal(actor.state,'run');assert.equal(actor.currentHp,hp);
  }
}));

test('three explicit refusals stay uncounted and defensive legacy reuse never becomes a new offensive native phase',()=>fakeImages(()=>{
  const blocked=json('docs/combat-fidelity-wave11-2026-10-23/part-a-rejected-requests.json');
  assert.deepEqual(sorted(blocked.missingVisualHeroIds),sorted(blockedIds));
  assert.equal(blocked.noRefusalBypass,true);assert.equal(blocked.noAliasReplacement,true);
  const newAssets=partPaths.flatMap(p=>json(p).entries),newBases=['A','B','C','D'].flatMap(p=>json(`src/game/combat/characterSpriteCorrectionsWave11Part${p}.generated.json`).entries);
  for(const id of blockedIds){assert.equal(newAssets.some(e=>e.heroId===id),false);assert.equal(newBases.some(e=>e.heroId===id),false);assert.equal(resolveCharacterAnimationAsset(hero(id)),null);for(const phase of phases)assert.equal(getCharacterAnimationFrame({...hero(id),presentationPhase:phase,presentationProgress:.6}),null);}
  for(const id of ['hermione_granger','snape']){
    const h=hero(id),profile=resolveCombatAbility(h,'special'),sheet=getHeroSpriteSheetSrc(h,'rpg'),layout=getSpriteSheetLayout(sheet);assert.equal(profile.effect,'guard');assert.equal(profile.multiplier,0);assert.equal(layout.adaptedLegacyFallback,true);assert.equal(layout.countedAsDedicatedBase16,false);assert.equal(layout.countedAsDedicatedSuperOrFinale,false);
    for(const phase of ['super','fatality'])for(const progress of [0,.3,.6,1])for(const facing of [1,-1]){
      const actor={...h,id:'blocked-runtime-p2',sourceHeroId:id,x:200,y:400,currentHp:73,meter:44,state:'special',stateElapsed:progress,presentationPhase:phase,presentationProgress:progress},before=structuredClone(actor),ctx=recorder();drawPixelSprite(ctx,actor.x,actor.y,actor,progress*60,facing,256,'rpg');const draw=ctx.calls.find(c=>c[0]==='drawImage');assert.ok(draw);assert.equal(draw[1].src,sheet);assert.equal(draw[3],0,'guard reuses safe idle row, never old firing artwork');if(id==='snape')assert.equal(draw[2],0,'only the accepted non-rifle first cell is reused');
      const input={actor,profile,action:{elapsed:progress,duration:1,hitAt:.45,facing},target:{x:350,y:400},height:90},visual=getNativeSuperVisualStateWave11(input),fx=recorder();assert.ok(visual);assert.equal(visual.supportive,true);assert.equal(visual.nativeMuzzleActive,false);drawNativeSuperVisualsWave11(fx,visual);assert.equal(fx.calls.filter(c=>c[0]==='lineTo').length,0);assert.deepEqual(actor,before);assert.equal(ctx.depth,0);assert.equal(fx.depth,0);
    }
  }
}));

test('Part C body scales reproduce human standing190 and small monowheel120 while retaining the measured native posture ratios',async()=>{
  for(const kind of ['characterAnimations','characterSpriteCorrections'])for(const e of json(`src/game/combat/${kind}Wave11PartC.generated.json`).entries){
    const target=e.heroId==='claptrap_borderlands'?120:190;
    for(const row of e.normalization.rows){const review=row.statureReview;assert.equal(review.targetStandingBodyHeight,target);assert.equal(review.excludesWeaponEffects,true);assert.equal(review.measurementKind,'visual-body-roi');assert.equal(sha256(read(review.nativeComparableSource)),review.nativeComparableSourceSha256);assert.equal(sha256(read(review.nativeReferenceSource)),review.nativeReferenceSourceSha256);assert.ok(row.renderScale>=.5&&row.renderScale<=3);
      const b=review.bodyBounds,{data,info}=await sharp(read(`public${e.sheet}`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});let top=256,bottom=-1;for(let y=b[1];y<b[1]+b[3];y++)for(let x=b[0];x<b[0]+b[2];x++)if(data[((row.row*256+y)*info.width+review.sourceComparableColumn*256+x)*4+3]>24){top=Math.min(top,y);bottom=Math.max(bottom,y);}assert.equal(bottom-top+1,review.normalizedBodyHeight);
      const expected=review.referenceBodyHeight*review.referenceRenderScale*review.nativeComparableBodyHeight/review.nativeReferenceBodyHeight;assert.ok(Math.abs(row.renderScale*review.normalizedBodyHeight-expected)<1e-8);
    }
    const ref=e.normalization.rows.find(r=>(r.phase||r.state)===(e.states?'idle':e.heroId==='furiosa'?'outro':'intro'));assert.ok(Math.abs(ref.renderScale*ref.statureReview.normalizedBodyHeight-target)<1e-8);
    if(!e.states&&['nux','toast_mm','capable_mm'].includes(e.heroId)){const crouch=e.normalization.rows.find(r=>r.phase==='super');assert.ok(crouch.renderScale*crouch.statureReview.normalizedBodyHeight<170,'real support kneel stays naturally shorter');}
  }
});

test('real RPG Dumbledore uses calm reused poses for beneficial basics and guard on both sides, while his native firestorm stays available',()=>fakeImages(()=>{
  const make=side=>{
    const own=[hero('dumbledore'),hero('xander_buffy')],opponents=[hero('cloud_ff7')],players=side==='player'?own:opponents,enemies=side==='enemy'?own:opponents;
    const engine=new EngineRpg(1200,540,players,{monsters:enemies,bosses:[],customRoster:enemies},{add:noop},noop,noop,{universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(engine);engine.autoBattle=false;
    const allies=side==='player'?engine.heroes:engine.enemies,targets=side==='player'?engine.enemies:engine.heroes,actor=allies[0];
    for(const u of [...allies,...targets])Object.assign(u,{state:'idle',actionPending:false,atb:100,cooldown:0,specialCharge:100,currentHp:1000,maxHp:1000,y:330});
    actor.x=side==='player'?250:900;allies[1].x=actor.x+(side==='player'?70:-70);targets.forEach(u=>{u.x=actor.x+(side==='player'?160:-160);});
    const emitterCalls=[],emit=engine.emitTargetedProjectile.bind(engine);
    engine.emitTargetedProjectile=(...args)=>{emitterCalls.push(args);return emit(...args);};
    const commit=slot=>side==='player'?engine.triggerAbility(actor,slot):engine.triggerEnemyAbility(actor,slot);
    const draw=()=>{const ctx=recorder();if(side==='player')engine.drawRpgHero(ctx,actor,0);else engine.drawRpgEnemy(ctx,actor,0);assert.equal(ctx.depth,0);return ctx.calls.find(c=>c[0]==='drawImage');};
    return{engine,actor,targets,commit,draw,emitterCalls};
  };
  for(const side of['player','enemy'])for(const slot of['simple','secondary','defense']){
    const{engine,actor,targets,commit,draw,emitterCalls}=make(side),profile=resolveCombatAbility(hero('dumbledore'),slot),before=targets.map(t=>t.currentHp);
    assert.notEqual(profile.effect,'damage');assert.equal(profile.multiplier,0);assert.equal(commit(slot),true,`${side}/${slot}: legal allied action rejected`);assert.equal(actor.state,slot==='defense'?'defense':'support');
    const d=draw(),sheet=getHeroSpriteSheetSrc(hero('dumbledore'),'rpg'),layout=getSpriteSheetLayout(sheet),resolution=getSpriteStateResolution(actor.state,layout);assert.equal(d[1].src,sheet);assert.equal(d[3],0,'beneficial action must never select the old fire attack row');assert.equal(resolution.dedicated,false);assert.equal(resolution.row,0);assert.ok(layout.adaptedSupportStates.includes(actor.state));
    for(let tick=0;tick<120;tick++)engine.advanceActions();assert.equal(emitterCalls.length,0,`${side}/${slot}: beneficial basic/guard must not call the physical projectile emitter`);assert.deepEqual(targets.map(t=>t.currentHp),before);if(profile.effect==='buff')assert.ok(actor.rpgBuffTicks>0);else assert.ok(actor.rpgGuardTicks>0);
  }
  for(const side of['player','enemy']){
    const{actor,commit,draw}=make(side),asset=resolveCharacterAnimationAsset(hero('dumbledore'));assert.equal(resolveCombatAbility(hero('dumbledore'),'special').effect,'damage');assert.equal(commit('special'),true,`${side}: in-range firestorm rejected`);assert.equal(actor.state,'special');actor.stateTimer=Math.floor(actor.rpgSpecialDurationTicks*.4);const d=draw();assert.equal(d[1].src,asset.sheet);assert.equal(d[3],asset.phases.super.row*256);assert.equal(d[4],256);assert.equal(d[5],256);
  }
}));
