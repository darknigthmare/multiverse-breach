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
const old = json('docs/combat-fidelity-wave3-2026-10-18/baseline.json');
const runtimeBaseline = json('docs/combat-fidelity-wave3-2026-10-18/runtime-baseline.json');
const stageBaseline = json('docs/combat-fidelity-wave3-2026-10-18/stage-baseline.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const partPaths = ['A', 'B', 'C'].map(part => `src/game/combat/characterAnimationsWave3Part${part}.generated.json`);
const wave3Ids = ['lightning_ff13', 'fang_ff13', 'vanille_ff13', 'snow_ff13', 'sazh_ff13', 'hope_ff13', 'noctis_ff15', 'gladiolus_ff15', 'ignis_ff15', 'prompto_ff15', 'lunafreya_ff15'];
const tifaPaths = ['src/game/combat/tifaMeleeMotion.generated.json', 'src/game/combat/tifaMeleeCombat.generated.json'];
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
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); }
    get src() { return this._src; }
  };
  try { return callback(); } finally { globalThis.Image = OriginalImage; }
};

const tifaMelee = () => {
  const tifa = hero('tifa_ff7');
  const engine = new EngineSmash(960, 540, [tifa], { monsters: [tifa], bosses: [], customRoster: [tifa] },
    { add: noop }, noop, noop, { universe: tifa.universe, mode: 'Smash', disableHazards: true,
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
const normalizedName = value => String(value).normalize('NFKC').replace(/[’‘]/g, "'");

test('wave3 baselines,16 preceding native atlases and the complete Cloud runtime manifest remain immutable', () => {
  assert.equal(sha256(read('docs/combat-fidelity-wave3-2026-10-18/baseline.json')), '991473c72581f59e39aa4c7a0b7b38432fe0b3e895dc0f3c25ec624f6bf5bd8f');
  assert.equal(sha256(read('docs/combat-fidelity-wave3-2026-10-18/runtime-baseline.json')), 'efc5199de4d5a772521d98e71d0527e85121c2077468968eb5ec5ea89044e89a');
  assert.equal(old.meleeBindings.nativePresentationHeroes, 16); assert.equal(runtimeBaseline.assets.length, 16);
  const unchanged = [
    'src/game/combat/characterAnimations.generated.json', 'src/game/combat/characterAnimationsWave2PartA.generated.json',
    'src/game/combat/characterAnimationsWave2PartB.generated.json', 'src/game/combat/cloudMeleeMotion.generated.json',
    'src/game/combat/cloudMeleeCombat.generated.json', 'src/game/combat/characterSpriteCorrections.generated.json',
    'src/game/combat/characterSpriteCorrectionsWave2.generated.json',
    'docs/combat-fidelity-2026-10-18/character-animation-provenance.json',
    'docs/combat-fidelity-wave2-2026-10-18/part-a-provenance.json', 'docs/combat-fidelity-wave2-2026-10-18/part-b-provenance.json'
  ];
  for (const file of unchanged) assert.equal(sha256(read(file)), old.inputHashes[file], file);
  for (const entry of runtimeBaseline.assets) {
    assert.equal(sha256(read(`public${entry.sheet}`)), entry.sha256, entry.heroId);
    assert.deepEqual(resolveCharacterAnimationAsset(hero(entry.heroId)), entry, entry.heroId);
  }
  assert.deepEqual(getMeleeAnimationManifest('cloud_ff7'), runtimeBaseline.cloudManifest, 'the generic native-manifest builder changed Cloud');
});

test('eleven new FF13/15 atlases contain352 independently hashed native poses and exact identity/provenance bindings', async () => {
  const entries = partPaths.flatMap(path => json(path).entries);
  assert.deepEqual(sorted(entries.map(entry => entry.heroId)), sorted(wave3Ids));
  assert.equal(getCharacterAnimationAssets().filter(entry => [...runtimeBaseline.assets.map(asset => asset.heroId), ...wave3Ids].includes(entry.heroId)).length, 27);
  const allHashes = new Set();
  for (const entry of entries) {
    assert.equal(hero(entry.heroId).universe, entry.universe);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'p2-instance', sourceHeroId: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), id: 'p2-instance', sourceId: entry.heroId }).sheet, entry.sheet);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), universe: 'Unrelated QA universe' }), null);
    assert.equal(resolveCharacterAnimationAsset({ ...hero(entry.heroId), sourceHeroId: 'unregistered-source' }), null);
    assert.equal(entry.visualValidation.canon1to1Verified, false); assert.equal(entry.visualValidation.networkVerified, false);
    assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(phases));
    phases.forEach((phase, row) => assert.equal(entry.phases[phase].row, row));
    const { hashes } = await inspectAtlas(entry, Object.entries(entry.phases));
    for (const [phase, actual] of hashes) {
      const review = entry.visualValidation.phaseReviews.find(value => value.phase === phase);
      assert.deepEqual(actual, review.frameHashes, `${entry.heroId}:${phase}: stale pixel review`);
      actual.forEach(digest => { assert.equal(allHashes.has(digest), false, `${entry.heroId}: reused RGBA artwork`); allHashes.add(digest); });
    }
  }
  assert.equal(allHashes.size, 352);
  for (const part of ['a', 'b', 'c']) {
    const provenance = json(`docs/combat-fidelity-wave3-2026-10-18/part-${part}-provenance.json`);
    assert.equal(provenance.model, null); assert.equal(provenance.generationId, null); assert.equal(provenance.canon1to1Verified, false);
    for (const source of provenance.sources) {
      assert.equal(source.model, null); assert.equal(source.generationId, null);
      assert.equal(sha256(read(source.archivedPath || source.path)), source.sha256);
      if (source.referenceImage && source.referencedSourceSha256) assert.equal(sha256(read(source.referenceImage)), source.referencedSourceSha256);
      assert.ok(source.prompt?.length > 100 || source.promptFile);
    }
  }
});

test('all88 new presentation phases reach the real drawImage rectangles on both sides and hold clocks during pause', () => fakeImages(() => {
  let draws = 0;
  for (const entry of partPaths.flatMap(path => json(path).entries)) for (const [phase, spec] of Object.entries(entry.phases)) {
    for (const facing of [1, -1]) {
      const columns = new Set();
      for (const progress of [0, 0.3, 0.6, 1]) {
        const actor = { ...hero(entry.heroId), id: 'runtime-p2', sourceHeroId: entry.heroId, presentationPhase: phase, presentationProgress: progress };
        const frame = getCharacterAnimationFrame(actor); const before = structuredClone(actor);
        const a = recorder(), b = recorder();
        drawPixelSprite(a, 160, 350, actor, 0, facing, 90, 'melee');
        drawPixelSprite(b, 160, 350, actor, 60000, facing, 90, 'melee');
        const draw = a.calls.find(call => call[0] === 'drawImage');
        assert.ok(draw); assert.equal(draw[1].src, entry.sheet); assert.equal(draw[2], frame.col * 256);
        assert.equal(draw[3], spec.row * 256); assert.equal(draw[4], 256); assert.equal(draw[5], 256);
        assert.deepEqual(b.calls.find(call => call[0] === 'drawImage'), draw, 'wall time advanced a frozen simulation pose');
        assert.ok(a.calls.some(call => call[0] === 'scale' && call[1] === facing));
        assert.deepEqual(actor, before); assert.equal(a.depth, 0); assert.equal(b.depth, 0); columns.add(frame.col); draws++;
      }
      assert.equal(columns.size, 4, `${entry.heroId}:${phase}`);
    }
    assert.equal(getCharacterAnimationFrame(hero(entry.heroId), { phase: 'super', progress: 0.419, impactProgress: 0.42 }).col, 1);
    assert.equal(getCharacterAnimationFrame(hero(entry.heroId), { phase: 'super', progress: 0.42, impactProgress: 0.42 }).col, 2);
  }
  assert.equal(draws, 704);
}));

test('four new wave3 identities add28 phases while all47 earlier character profiles are preserved exactly', () => {
  assert.equal(Object.keys(runtimeBaseline.presentations).length, 47);
  // Three FF15 IDs already had authored profiles before this wave: adding their
  // dedicated art does not create extra identities or permit silent rewrites.
  const throughWave3Ids = new Set([...Object.keys(runtimeBaseline.presentations), 'snow_ff13', 'sazh_ff13', 'hope_ff13', 'prompto_ff15']);
  assert.equal(Object.keys(CHARACTER_PRESENTATIONS).filter(id => throughWave3Ids.has(id)).length, 51);
  for (const [id, original] of Object.entries(runtimeBaseline.presentations)) {
    const current = CHARACTER_PRESENTATIONS[id];
    if (['vincent_ff7', 'sakura_haruno_young'].includes(id)) {
      // Wave4 supplies these two formerly missing bodies/clone images. Preserve
      // the actual recipes and identity, while allowing the explicit delivery
      // notes and missing-asset markers to describe the delivered artwork.
      const legacy = { ...current, sourceReference: original.sourceReference,
        phases: Object.fromEntries(Object.entries(current.phases).map(([phase, spec]) => [phase,
          { ...spec, sourceReference: original.phases[phase].sourceReference, missingAssets: original.phases[phase].missingAssets }])) };
      assert.deepEqual(legacy, original, `${id}: an unrelated recipe changed`);
      for (const spec of Object.values(current.phases)) assert.deepEqual(spec.missingAssets, []);
    } else assert.deepEqual(current, original, `${id}: an existing scene changed`);
  }
  const actions = { snow_ff13: 'Sovereign Fist', sazh_ff13: 'Cold Blood', hope_ff13: 'Last Resort', prompto_ff15: 'Trigger Happy' };
  let scripts = 0;
  for (const [id, action] of Object.entries(actions)) for (const phase of PRESENTATION_PHASES) {
    assert.equal(normalizedName(CHARACTER_PRESENTATIONS[id].sourceAction), normalizedName(action));
    const actor = hero(id), script = resolvePresentationScript(actor, phase);
    assert.equal(script.universe, actor.universe); assert.equal(script.provenance.canonicalSequence, false);
    const samples = [0, 0.2, 0.4, 0.6, 0.8, 1].map(t => samplePresentationScript(script, script.duration * t));
    assert.ok(new Set(samples.map(sample => `${sample.asset.sheet}:${sample.asset.row}:${sample.asset.col}`)).size > 1);
    assert.equal(script.heroId, id); scripts++;
  }
  assert.equal(scripts, 28);
  assert.equal(resolveCombatAbility(hero('lunafreya_ff15'), 'special').effect, 'heal');
});

test('new FF13/15 result scenes freeze on zero simulation time and never replay combat effects', () => fakeImages(() => {
  for (const id of wave3Ids) {
    let completed = 0;
    const engine = new EngineFighter(960, 540, [hero(id)], [hero('cloud_ff7')], { add: noop }, noop, () => { completed++; }, { opponentControl: 'p2' });
    engines.push(engine);
    const snapshot = () => JSON.stringify({ hp: [engine.getActive('player').currentHp, engine.getActive('cpu').currentHp],
      meter: [engine.getActive('player').meter, engine.getActive('cpu').meter], wins: engine.roundWins, result: engine.result, projectiles: engine.projectiles });
    const original = snapshot();
    for (const phase of PRESENTATION_PHASES) {
      const queuePhase = ['roundVictory', 'roundDefeat'].includes(phase) ? 'roundResult' : phase === 'defeat' ? 'victory' : phase;
      const winner = ['roundDefeat', 'defeat'].includes(phase) ? 'cpu' : 'player';
      engine.presentationQueue = []; engine.queuePresentation(queuePhase, winner); engine.presentation = engine.presentationQueue.shift();
      engine.presentation.remaining = engine.presentation.duration * 0.43;
      const remaining = engine.presentation.remaining;
      const a = recorder(); engine.drawCharacterPresentation(a, 0);
      engine.updatePresentation(0);
      const b = recorder(); engine.drawCharacterPresentation(b, 60000);
      assert.equal(engine.presentation.remaining, remaining);
      const drawn = ctx => ctx.calls.filter(call => call[0] === 'drawImage');
      assert.ok(drawn(a).some(call => call[1].src.includes('combat-character-animations-wave3')));
      assert.deepEqual(drawn(a), drawn(b)); assert.equal(a.depth, 0); assert.equal(b.depth, 0);
    }
    assert.equal(snapshot(), original, `${id}: a presentation changed combat state`); assert.equal(completed, 0);
  }
}));

test('Cloud,Tifa and Snow presentation samples identify exactly the native rectangles actually drawn by EngineFighter', () => fakeImages(() => {
  let matched = 0;
  for (const id of ['cloud_ff7', 'tifa_ff7', 'snow_ff13']) {
    const engine = new EngineFighter(960, 540, [hero(id)], [hero('cloud_ff7')], { add: noop }, noop, noop, { opponentControl: 'p2' });
    engines.push(engine);
    for (const phase of PRESENTATION_PHASES) {
      const queuePhase = ['roundVictory', 'roundDefeat'].includes(phase) ? 'roundResult' : phase === 'defeat' ? 'victory' : phase;
      engine.presentationQueue = []; engine.queuePresentation(queuePhase, ['roundDefeat', 'defeat'].includes(phase) ? 'cpu' : 'player');
      engine.presentation = engine.presentationQueue.shift();
      const participant = engine.presentation.entries.find(entry => entry.side === 'player');
      assert.equal(participant.actorPhase, phase);
      for (const progress of [0, 0.3, 0.6, 1]) {
        engine.presentation.remaining = engine.presentation.duration * (1 - progress);
        const sample = samplePresentationScript(participant.script, engine.presentation.duration - engine.presentation.remaining);
        assert.equal(sample.asset.kind, 'native-generated-character-animation');
        const native = getCharacterAnimationFrame(hero(id), { phase, progress: sample.progress });
        assert.equal(sample.asset.sheet, native.asset.sheet); assert.equal(sample.asset.row, native.row); assert.equal(sample.asset.col, native.col);
        const ctx = recorder(); engine.drawCharacterPresentation(ctx, 60000);
        assert.ok(ctx.calls.some(call => call[0] === 'drawImage' && call[1].src === sample.asset.sheet
          && call[2] === sample.asset.col * 256 && call[3] === sample.asset.row * 256 && call[4] === 256 && call[5] === 256), `${id}/${phase}/${progress}: sampled asset differs from actual drawImage`);
        assert.equal(ctx.depth, 0); matched++;
      }
    }
  }
  assert.equal(matched, 84);
}));

test('Tifa has45 exclusive native states,180 distinct poses, source hashes and no unused-row fiction', async () => {
  const entries = tifaPaths.flatMap(path => json(path).entries);
  assert.equal(entries.length, 6);
  assert.deepEqual(sorted(entries.flatMap(entry => stateRows(entry).map(([state]) => state))), sorted(MELEE_STATES));
  const allHashes = new Set();
  for (const entry of entries) {
    assert.equal(entry.heroId, 'tifa_ff7'); assert.equal(entry.universe, 'Final Fantasy VII');
    assert.equal(entry.provenance.model, null); assert.equal(entry.provenance.generationId, null);
    assert.equal(entry.provenance.nativeArtwork || entry.provenance.nativeGeneratedArtwork, true);
    assert.equal(entry.provenance.canonicalVerified ?? entry.provenance.canonicalAnimationVerified, false);
    const { hashes, rgba } = await inspectAtlas(entry, stateRows(entry));
    for (const row of hashes.values()) for (const digest of row) { assert.equal(allHashes.has(digest), false, `${entry.id}: reused bitmap`); allHashes.add(digest); }
    for (let row = entry.activeRows ?? stateRows(entry).length; row < 8; row++) {
      for (let pixel = row * 256 * 1024; pixel < (row + 1) * 256 * 1024; pixel++) assert.equal(rgba[pixel * 4 + 3], 0);
    }
  }
  assert.equal(allHashes.size, 180);
  const manifest = getMeleeAnimationManifest('tifa_ff7'); assert.ok(manifest);
  assert.equal(manifest.dedicatedStateRows, true); assert.equal(manifest.source1to1Verified, false);
  assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
  assert.equal(new Set(MELEE_STATES.map(state => `${manifest.animations[state].sheet}:${manifest.animations[state].row}`)).size, 45);
  for (const state of MELEE_STATES) {
    const animation = manifest.animations[state];
    assert.equal(animation.frameCount, 4); assert.deepEqual(animation.events, []); assert.deepEqual(animation.hitboxes, []); assert.deepEqual(animation.rootMotion, []);
    assert.ok(entries.some(entry => entry.sheet === animation.sheet && stateRows(entry).some(([name, spec]) => name === state && spec.row === animation.row)));
  }
  for (const generation of json(tifaPaths[0]).generations) {
    assert.equal(generation.model, null); assert.equal(generation.generationId, null);
    assert.equal(sha256(read(generation.sourceImage)), generation.sha256);
    assert.equal(sha256(read(generation.prompt)), generation.promptSha256);
    for (const reference of generation.referencedImages) assert.equal(sha256(read(reference.path)), reference.sha256);
    if (generation.rejected) assert.equal(generation.retainedPoses, 0);
  }
});

test('Tifa ordinary Beat Rush rows stay separate from full-meter Final Heaven and simulation impacts', () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest('tifa_ff7'); assert.ok(manifest);
  assert.equal(resolveCombatAbility(hero('tifa_ff7'), 'secondary').name, 'Beat Rush');
  assert.equal(resolveCombatAbility(hero('tifa_ff7'), 'special').name, 'Final Heaven');
  const entries = tifaPaths.flatMap(path => json(path).entries);
  for (const state of ['special', 'chargeRelease']) {
    const entry = entries.find(value => stateRows(value).some(([name]) => name === state));
    const row = entry.normalization.rows.find(value => value.state === state);
    assert.match(row.visualReview.action, /Beat Rush/); assert.match(row.visualReview.action, /physical|fist|punch/i);
    const actor = { ...hero('tifa_ff7'), id: 'tifa-p2', sourceHeroId: 'tifa_ff7', state, stateElapsed: 0.309,
      action: { elapsed: 0.309, duration: 0.9, hitAt: 0.31, abilityProfile: resolveCombatAbility(hero('tifa_ff7'), 'secondary') } };
    assert.equal(getHeroMeleeAnimationFrame(actor, 309).frame, 1);
    actor.action.elapsed = 0.31;
    assert.equal(getHeroMeleeAnimationFrame(actor, 310).frame, 2);
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 0, -1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, entry.sheet);
  }
  const finalAsset = resolveCharacterAnimationAsset(hero('tifa_ff7'));
  for (const actor of [
    { ...hero('tifa_ff7'), state: 'special', presentationPhase: 'super', presentationProgress: 0.6 },
    { ...hero('tifa_ff7'), state: 'special', action: { type: 'super', elapsed: 0.6, duration: 1, hitAt: 0.4 } },
    { ...hero('tifa_ff7'), state: 'special', action: { superProfile: {}, elapsed: 0.6, duration: 1, hitAt: 0.4 } }
  ]) {
    const ctx = recorder(); drawPixelSprite(ctx, 200, 400, actor, 60000, 1, 96, 'melee');
    assert.equal(ctx.calls.find(call => call[0] === 'drawImage')[1].src, finalAsset.sheet);
  }
}));

test('all45 Tifa states draw their actual atlas rectangles on both sides and obey native state clocks', () => fakeImages(() => {
  const manifest = getMeleeAnimationManifest('tifa_ff7'); assert.ok(manifest);
  for (const state of MELEE_STATES) {
    const spec = manifest.animations[state];
    const end = getMeleeAnimationFrame(manifest, state, 100000);
    assert.ok(end.col >= 0 && end.col < 4);
    if (spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, 0).col, getMeleeAnimationFrame(manifest, state, 4 / spec.fps * 1000).col);
    else assert.equal(end.frame, 3, state);
    if (MELEE_TRANSITION_DATA[state] && !spec.loop) assert.equal(getMeleeAnimationFrame(manifest, state, MELEE_TRANSITION_DATA[state].duration * 1000 - 0.01).frame, 3);
    for (const facing of [1, -1]) {
      const actor = { ...hero('tifa_ff7'), id: 'runtime-tifa', sourceHeroId: 'tifa_ff7', state, stateElapsed: 0.08 };
      const frame = getHeroMeleeAnimationFrame(actor, 80), original = structuredClone(actor), a = recorder(), b = recorder();
      drawPixelSprite(a, 200, 400, actor, 0, facing, 96, 'melee'); drawPixelSprite(b, 200, 400, actor, 60000, facing, 96, 'melee');
      const draw = a.calls.find(call => call[0] === 'drawImage'); assert.ok(draw, state);
      assert.equal(draw[1].src, frame.animation.sheet); assert.equal(draw[2], frame.col * 256); assert.equal(draw[3], frame.row * 256);
      assert.equal(draw[4], 256); assert.equal(draw[5], 256); assert.deepEqual(draw, b.calls.find(call => call[0] === 'drawImage'));
      assert.ok(a.calls.some(call => call[0] === 'scale' && call[1] === facing)); assert.deepEqual(actor, original);
    }
  }
  assert.equal(getHeroMeleeAnimationFrame({ ...hero('tifa_ff7'), universe: 'Unrelated QA universe' }, 0), null);
  assert.notEqual(getHeroSpriteSheetSrc({ ...hero('tifa_ff7'), universe: 'Unrelated QA universe', state: 'idle' }, 'melee'), manifest.animations.idle.sheet);
}));

test('Tifa measured ledge anchors contain real red glove pixels and attach on both physical edges', async () => {
  const entry = json(tifaPaths[1]).entries.find(value => value.id === 'tifa-ledge');
  const rgba = await sharp(read(`public${entry.sheet}`)).ensureAlpha().raw().toBuffer();
  const manifest = getMeleeAnimationManifest('tifa_ff7'); assert.ok(manifest);
  const platform = { x1: 150, x2: 620, y: 170 };
  let contacts = 0, attached = 0;
  for (const [state, measurements] of Object.entries(entry.normalization.contactAnchorMeasurements)) for (const measurement of measurements) {
    if (!measurement.contact) continue;
    let visible = 0, red = 0;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const offset = ((entry.states[state].row * 256 + measurement.y + dy) * 1024 + measurement.frame * 256 + measurement.x + dx) * 4;
      const [r, g, b, alpha] = rgba.subarray(offset, offset + 4);
      if (alpha > 24) { visible++; if (r > 55 && r > g * 1.12 && r > b * 1.12) red++; }
    }
    assert.ok(visible >= 60 && red >= 20, `${state}/${measurement.frame}: contact is not on the drawn red glove`); contacts++;
    if (!['ledgeCatch', 'ledgeHang', 'ledgeClimb'].includes(state)) continue;
    for (const side of ['left', 'right']) fakeImages(() => {
      const actor = { ...hero('tifa_ff7'), id: 'tifa-p2-copy', sourceHeroId: 'tifa_ff7', state,
        stateElapsed: (measurement.frame + 0.01) / manifest.animations[state].fps,
        ...(state === 'ledgeClimb' ? { meleeLedgeVisual: { side, platform } } : { ledge: { side, platform } }) };
      const original = structuredClone(actor), ctx = recorder();
      drawPixelSprite(ctx, 340, 440, actor, 0, side === 'left' ? -1 : 1, 96, 'melee');
      const draw = ctx.calls.find(call => call[0] === 'drawImage'), translation = ctx.calls.find(call => call[0] === 'translate');
      const flip = ctx.calls.find(call => call[0] === 'scale')[1];
      assert.equal(draw[2], measurement.frame * 256); assert.equal(draw[3], entry.states[state].row * 256);
      const x = translation[1] + flip * (draw[6] + measurement.x * draw[8] / 256), y = translation[2] + draw[7] + measurement.y * draw[9] / 256;
      assert.equal(x, side === 'left' ? platform.x1 : platform.x2); assert.equal(y, platform.y);
      assert.equal(flip, side === 'left' ? 1 : -1); assert.deepEqual(actor, original); assert.equal(ctx.depth, 0);
    });
    attached++;
  }
  assert.equal(contacts, 15); assert.equal(attached, 11);
});

test('Tifa P1/P2 climbing follows moving platforms and drawing never changes its physical coordinates', () => fakeImages(() => {
  for (const axis of ['x', 'y']) for (const side of ['left', 'right']) {
    const engine = tifaMelee(), actor = side === 'left' ? engine.getActiveHero() : engine.getActiveOpponent();
    const platform = { x1: 150, x2: 620, y: 170, baseX1: 150, baseX2: 620, baseY: 170, motion: { axis, range: 40, periodMs: 2800, phase: 0 } };
    engine.platforms = [platform]; engine.mobilePlatformElapsedMs = 0;
    Object.assign(actor, { state: 'ledgeHang', stateElapsed: 0.2, x: side === 'left' ? 143 : 627, y: 196, vx: 0, vy: 0, ledge: { side, platform } });
    assert.equal(engine.triggerMeleeAction(side === 'left' ? 'player' : 'cpu', 'Climb'), true); assert.equal(actor.state, 'ledgeClimb');
    const start = { x: actor.x, y: actor.y }; actor.stateElapsed = 0.18;
    engine.mobilePlatformElapsedMs = 200; engine.updateDynamicPlatforms();
    const dx = platform.x1 - platform.baseX1, dy = platform.y - platform.baseY;
    assert.ok(Math.abs(axis === 'x' ? dx : dy) > 10); assert.equal(actor.x, start.x + dx); assert.equal(actor.y, start.y + dy);
    const before = structuredClone(actor), ctx = recorder();
    drawPixelSprite(ctx, actor.x, actor.y, actor, 0, side === 'left' ? -1 : 1, 72, 'melee');
    const translation = ctx.calls.find(call => call[0] === 'translate');
    assert.equal(translation[1], side === 'left' ? platform.x1 : platform.x2); assert.equal(translation[2], platform.y);
    assert.deepEqual(actor, before); assert.equal(ctx.depth, 0);
  }
}));

test('Tifa P1/P2 held movement preserves airborne, landing and turning animation clocks', () => {
  for (const side of ['p1', 'p2']) for (const state of ['jumpRise', 'fall', 'land', 'turn']) {
    const engine = tifaMelee(), actor = side === 'p1' ? engine.getActiveHero() : engine.getActiveOpponent();
    const target = side === 'p1' ? engine.getActiveOpponent() : engine.getActiveHero();
    const airborne = ['jumpRise', 'fall'].includes(state);
    Object.assign(actor, { state: airborne ? state : state === 'land' ? 'fall' : 'idle', stateElapsed: 0.08,
      y: airborne ? engine.groundY - 160 : state === 'land' ? engine.groundY - 5 : engine.groundY,
      vy: airborne ? state === 'jumpRise' ? -9 : 1 : state === 'land' ? 8 : 0, facing: state === 'turn' ? -1 : 1 });
    if (!airborne) moveTick(engine, actor, target, side);
    assert.equal(actor.state, state);
    const initialX = actor.x, hp = actor.currentHp, columns = new Set([getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col]);
    for (let tick = 0; tick < (airborne ? 10 : 5); tick++) {
      moveTick(engine, actor, target, side); assert.equal(actor.state, state, `${side}/${state}: held input reset the native state`);
      columns.add(getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000).col);
    }
    assert.ok(actor.x > initialX); assert.equal(actor.currentHp, hp); assert.ok(columns.size > 1);
    if (!airborne) assert.equal(columns.size, 4);
  }
});

test('the65 stage mechanisms preserve all41 prior definitions and their independently recorded draw geometry', () => {
  assert.equal(STAGE_ANIMATION_PROFILES.filter(profile => !profile.animationWave || profile.animationWave <= 3).length, 65); assert.equal(stageBaseline.profiles.length, 41);
  const draw = (stage, time) => {
    const operations = []; let depth = 0;
    const ctx = new Proxy({}, { get(_, key) { return (...args) => { if (key === 'save') depth++; if (key === 'restore') depth--; operations.push([key, ...args]); }; },
      set(_, key, value) { operations.push([key, value]); return true; } });
    assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds: time }), true);
    assert.equal(depth, 0); return operations;
  };
  for (const original of stageBaseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(profile => profile.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, value) => value instanceof RegExp ? value.toString() : value)), original.definition);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(sha256(JSON.stringify(draw(original.stage, sample.time))), sample.sha256);
  }
  for (const profile of STAGE_ANIMATION_PROFILES.filter(profile => !runtimeBaseline.stages.some(oldStage => oldStage.id === profile.id))) {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode: 'Melee' }, before = structuredClone(stage);
    assert.notDeepEqual(draw(stage, 0), draw(stage, profile.periodSeconds * 0.23));
    assert.deepEqual(getStageAnimationFrame(stage, 5, { reducedMotion: true }), getStageAnimationFrame(stage, 500, { reducedMotion: true }));
    assert.deepEqual(stage, before); assert.equal(profile.gameplayEffect, 'none');
  }
});

test('the audit preserves wave3 native presentations and both complete45-state heroes without certifying source animation fidelity', () => {
  const report = measureCombatFidelity();
  assert.equal(report.meleeBindings.nativePresentationHeroIds.filter(id => [...runtimeBaseline.assets.map(asset => asset.heroId), ...wave3Ids].includes(id)).length, 27);
  for (const id of ['cloud_ff7', 'tifa_ff7']) {
    const details = report.meleeBindings.detailedManifestCoverage.find(entry => entry.id === id);
    assert.equal(details.states, 45); assert.equal(details.uniqueSheetRows, 45); assert.equal(details.boundFrames, 180);
    assert.deepEqual(details.statesWithoutNativeFile, []);
  }
  assert.equal(report.source1to1Verified, false);
  assert.equal(report.meleeBindings.source1to1UnverifiedHeroes, HEROES_DB.length);
});

