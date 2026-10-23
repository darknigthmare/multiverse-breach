import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { CANONICAL_COMBAT_OVERRIDES } from '../src/game/canonicalCombatOverrides.js';
import { CANONICAL_COMBAT_EXTENSIONS } from '../src/game/combatCanonExtensions.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { resolveCombatAbility, resolveCombatHeroSpriteActor, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { SUMMON_CHOREOGRAPHIES, getSummonChoreographyState, resolveSummonChoreography, drawSummonChoreographyEffects } from '../src/game/combat/summonChoreography.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteFrameForLayout, getSpriteStateResolution } from '../src/game/spriteAssets.js';
import { measureCombatFidelity } from './combatFidelityAudit.mjs';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../src/game/combat/characterAnimationCatalog.js';

const root = new URL('../', import.meta.url);
const json = path => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const baseline = json('docs/combat-fidelity-2026-10-18/baseline.json');
const firstCompletion = json('docs/combat-completion-2026-10-18/baseline.json');
const additionalCompletion = json('docs/combat-completion-2026-10-18/decisive-baseline.json');
const residualBaseline = json('docs/combat-fidelity-2026-10-18/residual-ability-baseline.json');
// This is a separate, lore-backed correction of a previously named action,
// not a new member of either immutable generic-slot baseline.
const loreCorrection = { id: 'mei_zhen', universe: 'Mandate of Nine Heavens', slots: ['secondary'] };
const entityRegistry = json('src/game/combat/entityAssets.generated.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const sorted = values => [...values].sort();
const sha256 = value => createHash('sha256').update(value).digest('hex');
const support = new Set(['heal', 'guard', 'buff', 'cleanse', 'revive']);
const generic = /Signature Strike|signature action|Breach Technique|signature technique|Signature Guard|defensive action/i;
const noop = () => {};
let vite;
let EngineRpg;
let drawPixelSprite;
const engines = [];
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });

// Drawing is observed as geometry, not accepted merely because a profile exists.
// Strict numeric checks catch NaN/Infinity that a permissive canvas stub hides.
const recorder = () => {
  const calls = [];
  const state = { globalAlpha: 1, globalCompositeOperation: 'source-over' };
  const stack = [];
  const methods = {
    save() { stack.push({ ...state }); calls.push(['save']); },
    restore() { assert.ok(stack.length, 'unbalanced canvas restore'); Object.assign(state, stack.pop()); calls.push(['restore']); },
    createLinearGradient() { return { addColorStop: noop }; },
    createRadialGradient() { return { addColorStop: noop }; },
    measureText(text) { return { width: String(text).length * 7 }; }
  };
  const ctx = new Proxy(methods, {
    get(target, key) {
      if (key === 'calls') return calls;
      if (key === 'depth') return stack.length;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return (...args) => { for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `invalid ${String(key)} coordinate`); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), `invalid canvas ${String(key)}`); state[key] = value; calls.push(['set', key, value]); return true; }
  });
  return ctx;
};
const makeRpg = (callerId, side = 'player') => {
  const ally = hero('cloud_ff7');
  const opponent = { ...hero(side === 'enemy' ? callerId : 'vegeta_dbz'), hp: 10000 };
  const engine = new EngineRpg(760, 420, [side === 'player' ? hero(callerId) : ally], {
    monsters: [opponent], bosses: [], customRoster: [opponent]
  }, { add: noop }, noop, noop, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false;
  [...engine.heroes, ...engine.enemies].forEach(actor => { actor.atb = 100; actor.specialCharge = 100; });
  engines.push(engine);
  return engine;
};
const tick = (engine, n) => { for (let index = 0; index < n; index++) engine.update(); };

test('the independent baseline preserves 4252 exact original slots and the original shared animations', () => {
  assert.equal(baseline.genericAbilitySlots.total, 4252);
  assert.deepEqual(baseline.genericAbilitySlots.counts, { simple: 1330, secondary: 1387, defense: 1535 });
  assert.equal(baseline.meleeAnimationBindings.counts.idleFallback, 80254);
  assert.equal(baseline.presentations.scriptedCharacterPairs, 0);
  assert.equal(baseline.entityChoreography.dedicatedEntityScripts, 0);
  for (const entry of baseline.genericAbilitySlots.entries) {
    assert.equal(hero(entry.id).universe, entry.universe);
    assert.deepEqual(hero(entry.id)[entry.slot], entry.originalAction, `${entry.id}:${entry.slot}: original catalog was overwritten`);
  }
});

test('the authored union separates1365 complete kits,72 original partial records and one lore correction', () => {
  const canonicalIds = Object.keys({ ...CANONICAL_COMBAT_OVERRIDES, ...CANONICAL_COMBAT_EXTENSIONS });
  assert.equal(canonicalIds.length, 85);
  const full = [...firstCompletion.genericCapabilities.map(entry => entry.id), ...additionalCompletion.map(entry => entry.id), ...canonicalIds];
  assert.equal(new Set(full).size, 1365, 'coverage cohorts overlap');
  assert.equal(residualBaseline.length, 72);
  assert.equal(residualBaseline.reduce((sum, entry) => sum + entry.missingSlots.length, 0), 114);
  for (const entry of residualBaseline) {
    assert.equal(entry.universe, hero(entry.id).universe);
    for (const slot of entry.missingSlots) assert.deepEqual(hero(entry.id)[slot], entry[slot], `${entry.id}:${slot}: residual source catalog was overwritten`);
  }
  const expected = [...full.map(id => ({ id, slots: ['simple', 'secondary', 'defense'] })),
    ...residualBaseline.map(entry => ({ id: entry.id, slots: entry.missingSlots })), loreCorrection];
  assert.equal(new Set(expected.map(entry => entry.id)).size, 1438, 'residual or lore-correction cohorts overlap a full kit');
  assert.equal(Object.keys(COMBAT_ABILITY_OVERRIDES).length, 1491, 'the1475 prior identities and16 explicit W11 source-role corrections must be imported');
  assert.deepEqual(sorted(Object.keys(COMBAT_ABILITY_OVERRIDES)), sorted([...expected.map(entry => entry.id), 'snake', 'raiden', 'otacon', 'luke', 'vader', 'han_solo', 'starfire_tt', 'beast_boy_tt', 'armstrong_mgr', 'mistral_mgr', 'monsoon_mgr', 'marcus', 'dom', 'cole', 'shepard', 'garrus', 'liara', 'motoko', 'batou', 'togusa', 'neo', 'trinity', 'morpheus', 'seraph', 'oneill', 'tealc', 'sam_carter', 'daniel_jackson', 'freeman', 'barney', 'alyx_vance', 'paladin', 'nick_v', 'dallas', 'wolf_pd', 'hoxton', 'janine_gb', 'spike_buffy', 'ronon_dex', 'elizabeth_weir', 'chloe_sgu', 'matt_scott_sgu', 'roland_bl', 'brick_bl', 'max', 'furiosa', 'nux', 'korben', 'leeloo', 'ruby_rhod', 'arthur_kaamelott', 'perceval_kaamelott', 'karadoc_kaamelott']));
  for (const { id, slots } of expected) {
    assert.deepEqual(sorted(['simple', 'secondary', 'defense'].filter(slot => COMBAT_ABILITY_OVERRIDES[id][slot])), sorted(slots), `${id}: a partial record overwrote a previously concrete action`);
    for (const slot of slots) {
      const record = COMBAT_ABILITY_OVERRIDES[id];
      const action = record[slot];
      assert.equal(record.universe, hero(id).universe, id);
      assert.ok(record.sourceWork && record.sourceReference && record.identityBasis, id);
      assert.ok(['canonical-technique', 'canonical-role', 'authored-universe-canon'].includes(record.identityBasis), `${id}: undeclared identity basis`);
      assert.equal(record.canonicalVerified, false, id);
      assert.equal(record.networkVerified, false, id);
      assert.doesNotMatch(action.name, generic, `${id}:${slot}`);
      if (slot === 'defense') assert.notEqual(action.name, `${hero(id).name} Guard`, `${id}: defense still uses the strict character-name placeholder`);
      const profile = resolveCombatAbility(hero(id), slot);
      assert.equal(profile.name, action.name, `${id}:${slot}: authored action is not actually resolved`);
      assert.equal(profile.sourceHeroId, id);
      assert.equal(profile.sourceAbility.sourceHeroId, id);
      assert.equal(profile.sourceAbility.slot, slot);
      assert.equal(profile.provenance.sourceUniverse, record.universe);
      assert.equal(profile.effect, action.targeting.effect, `${id}:${slot}`);
      assert.equal(profile.targetSide, action.targeting.targetSide, `${id}:${slot}`);
      assert.ok(Number.isFinite(profile.hitAt) && profile.hitAt > 0 && profile.hitAt < profile.duration, `${id}:${slot}`);
      assert.equal(profile.provenance.canonicalVerified, false, id);
      if (support.has(profile.effect)) {
        assert.equal(action.dmg, 0, `${id}:${slot}: support source contains damage`);
        assert.equal(profile.multiplier, 0, `${id}:${slot}: support resolves as damage`);
        assert.equal(profile.delivery, 'support', `${id}:${slot}`);
        assert.ok(['self', 'ally'].includes(profile.targetSide), `${id}:${slot}`);
      } else {
        assert.equal(profile.effect, 'damage', `${id}:${slot}`);
        assert.ok(action.dmg > 0 && profile.multiplier > 0, `${id}:${slot}`);
      }
      if (slot === 'secondary') assert.ok(action.cd > 0, id);
      if (slot === 'defense') assert.ok(action.reduce > 0 && action.reduce < 1 && action.dur > 0, id);
    }
  }
});

test('Mei Zhen’s ancestor message remains nonviolent in both the secondary and entity descriptors', () => {
  const manifest = json('src/game/originalUniversesManifest.json');
  const findLore = value => !value || typeof value !== 'object' ? []
    : [...(value.id === loreCorrection.id && typeof value.loreRole === 'string' ? [value] : []),
      ...Object.values(value).flatMap(findLore)];
  const records = findLore(manifest);
  assert.equal(records.length, 1);
  const source = records[0];
  assert.match(source.loreRole, /transmettre un message sans devenir des soldats/);
  assert.equal(source.universe, loreCorrection.universe);
  assert.deepEqual(hero(source.id).secondary, source.secondary, 'the original named but damaging source action was overwritten');
  const action = COMBAT_ABILITY_OVERRIDES[source.id].secondary;
  const profile = resolveCombatAbility(hero(source.id), 'secondary');
  assert.equal(action.name, source.secondary.name);
  assert.equal(action.dmg, 0);
  assert.equal(profile.effect, 'buff');
  assert.equal(profile.delivery, 'support');
  assert.equal(profile.multiplier, 0);
  assert.equal(profile.targetSide, 'ally');
  assert.ok(profile.buffMultiplier > 1);
  const invocation = resolveUniverseSummon(hero(source.id));
  assert.equal(invocation.entityName, source.secondary.name);
  assert.equal(invocation.sourceHeroId, source.id);
  assert.equal(invocation.action.targeting.effect, 'buff');
  assert.equal(invocation.action.dmg, 0, 'the entity descriptor still treats the ancestor as a soldier');
});

test('Mei Zhen’s ordinary and cinematic ancestor support changes buffs without harming either team', () => {
  for (const side of ['player', 'enemy']) for (const slot of ['secondary', 'summon']) {
    const engine = makeRpg(loreCorrection.id, side);
    const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
    const units = [...engine.heroes, ...engine.enemies];
    const hp = units.map(unit => unit.currentHp);
    assert.equal(engine.beginTargeting(actor, slot, side), true, `${side}:${slot}`);
    assert.equal(engine.confirmTargeting(), true);
    const scene = engine.getSummonSceneState();
    tick(engine, slot === 'summon' ? scene.impactTick : engine.actionQueue[0].ticks);
    assert.deepEqual(units.map(unit => unit.currentHp), hp, `${side}:${slot}: the ancestor dealt damage or supplied an unrelated heal`);
    assert.ok(actor.rpgBuffTicks > 0 && actor.rpgBuffMultiplier > 1, `${side}:${slot}: the ally support was only renamed`);
    if (slot === 'summon') {
      assert.equal(engine.getSummonSceneState().choreography.effect, 'buff');
      tick(engine, scene.durationTicks - scene.impactTick);
      assert.deepEqual(units.map(unit => unit.currentHp), hp);
    }
  }
});

test('ability runtime copies preserve sourceHeroId and isolate unrelated universes and caller mutation', () => {
  const original = JSON.stringify(COMBAT_ABILITY_OVERRIDES);
  for (const id of ['aerith_ff7', 'masterchief', 'naruto_uzumaki_young', 'rebecca_chambers']) {
    const source = hero(id);
    const instance = { ...source, id: 'p2-runtime-copy', sourceHeroId: id };
    for (const slot of ['simple', 'secondary', 'defense']) {
      const profile = resolveCombatAbility(instance, slot);
      assert.equal(profile.sourceHeroId, id);
      assert.equal(profile.sourceAbility.sourceHeroId, id);
      profile.sourceAbility.targeting.range = -123;
      assert.ok(resolveCombatAbility(source, slot).sourceAbility.targeting.range >= 0, `${id}:${slot}: caller mutated shared action`);
      const foreign = { ...instance, universe: 'Unrelated QA universe', [slot]: { name: 'Local QA action', type: 'melee', dmg: 1 } };
      assert.equal(resolveCombatAbility(foreign, slot).name, 'Local QA action');
    }
  }
  assert.equal(JSON.stringify(COMBAT_ABILITY_OVERRIDES), original);
});

test('medical abilities preserve who and what their source technique can actually help', () => {
  const cases = [
    ['evolve_val', 'simple', 'heal', 'ally', 'group'],
    ['hawken_technician_pilot', 'simple', 'guard', 'ally', 'single'],
    ['pubg_medic_survivor', 'secondary', 'heal', 'self', 'single'],
    ['aya_brea', 'secondary', 'heal', 'self', 'single'],
    ['the_forest_co_op_survivor_b', 'secondary', 'heal', 'self', 'single'],
    ['rinoa_ff8', 'secondary', 'heal', 'ally', 'single']
  ];
  for (const [id, slot, effect, targetSide, shape] of cases) {
    const profile = resolveCombatAbility(hero(id), slot);
    assert.equal(profile.effect, effect, `${id}: medical role changed`);
    assert.equal(profile.targetSide, targetSide, `${id}: technique gained unsupported recipients`);
    assert.equal(profile.shape, shape, `${id}: single-target technique became a group power`);
    assert.equal(profile.multiplier, 0, `${id}: medical/support action deals damage`);
    assert.equal(profile.delivery, 'support');
  }
});

test('45 engine states select bounded coarse poses and declare reuse instead of dedicated animation', () => {
  assert.equal(MELEE_STATES.length, 45);
  const layout = { columns: 4, rows: 4, rowByState: null };
  for (const state of MELEE_STATES) {
    const resolved = getSpriteStateResolution(state, layout);
    const frame = getSpriteFrameForLayout(state, 30, layout);
    assert.equal(resolved.row, frame.row, state);
    assert.ok(frame.row >= 0 && frame.row < 4 && frame.col >= 0 && frame.col < 4, state);
    assert.equal(resolved.dedicated, false, state);
    assert.equal(resolved.canonicalAnimationVerified, false, state);
  }
  for (const state of ['attackLight1', 'attackLight2', 'chargeRelease', 'aerialDown', 'ledgeAttack']) assert.equal(getSpriteStateResolution(state, layout).row, 2, `${state} still fell through to idle`);
  for (const state of ['jumpRise', 'fastFall', 'ledgeClimb']) assert.equal(getSpriteStateResolution(state, layout).row, 1, state);
  for (const state of ['shieldBreak', 'hitStun', 'defeat', 'dead']) assert.equal(getSpriteStateResolution(state, layout).row, 3, state);
  assert.equal(getSpriteStateResolution('attackLight1', layout).binding, 'adapted-existing-pose');
  assert.equal(getSpriteStateResolution('attackLight1', { columns: 4, rows: 2, rowByState: { idle: 0, attackLight1: 1 } }).dedicated, true);
  assert.equal(getSpriteStateResolution('attackLight1', { columns: 4, rows: 2, rowByState: { idle: 0, attackLight1: 1, attackLight2: 1 } }).dedicated, false, 'two aliases of one row are not two dedicated state assets');
});

test('every character script has seven real frame-selection sequences and bounded interpolation', () => {
  assert.equal(Object.keys(CHARACTER_PRESENTATIONS).length, 204);
  assert.equal(Object.keys(CHARACTER_PRESENTATIONS).filter(id => roster.has(id)).length, 203, 'player_anchor must not inflate roster coverage');
  for (const [id, record] of Object.entries(CHARACTER_PRESENTATIONS)) for (const phase of PRESENTATION_PHASES) {
    const actor = roster.get(id) || { id, universe: record.universe };
    const script = resolvePresentationScript(actor, phase);
    assert.equal(script.provenance.canonicalSequence, false, `${id}:${phase}`);
    assert.ok(script.sourceReference && script.beats.length >= 4);
    assert.equal(script.beats[0].at, 0);
    assert.equal(script.beats.at(-1).at, 1);
    assert.ok(script.beats.every((beat, index) => !index || beat.at > script.beats[index - 1].at));
    const frames = new Set();
    for (const fraction of [-1, 0, 0.2, 0.35, 0.5, 0.7, 0.85, 1, 2]) {
      const sample = samplePresentationScript(script, script.duration * fraction);
      const asset = sample.asset;
      assert.ok(existsSync(new URL(`public${asset.sheet}`, root)), `${id}:${phase}: missing selected file ${asset.sheet}`);
      assert.ok(Number.isInteger(asset.row) && asset.row >= 0 && asset.row < asset.rows, `${id}:${phase}`);
      assert.ok(Number.isInteger(asset.col) && asset.col >= 0 && asset.col < asset.columns, `${id}:${phase}`);
      assert.ok([sample.x, sample.y, sample.scale, sample.opacity, sample.progress].every(Number.isFinite));
      assert.ok(sample.opacity >= 0 && sample.opacity <= 1 && sample.scale > 0);
      frames.add(`${asset.sheet}:${asset.row}:${asset.col}`);
      assert.deepEqual(samplePresentationScript(script, script.duration * fraction), sample, 'wall clock/randomness changed a fixed sample');
    }
    if(id==='snape'){
      assert.equal(Object.hasOwn(json('docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json').presentations,id),false,'This is a new W11 fallback, never an exception for an old script');
      assert.equal(frames.size,1,'Blocked Snape intentionally reuses one accepted idle cell');
      const asset=samplePresentationScript(script,0).asset;
      assert.equal(asset.sheet,'/sprites/generated/heroes/harry-potter/snape.png');
      assert.equal(asset.row,0);assert.equal(asset.col,0);assert.equal(asset.dedicatedPhaseAsset,false);
      assert.equal(resolveCharacterAnimationAsset(actor),null);
    }else assert.ok(frames.size >= 2, `${id}:${phase}: script repeats a single selected cell`);
  }
});

test('named finales select distinct preparation/contact poses and support retains its own visual', () => {
  const goku = resolvePresentationScript(hero('goku_dbz'), 'fatality');
  const charging = samplePresentationScript(goku, goku.duration * 0.3);
  const firing = samplePresentationScript(goku, goku.duration * 0.65);
  assert.equal(charging.asset.row, 4);
  assert.equal(charging.asset.col, 1);
  assert.equal(firing.asset.row, 4);
  assert.equal(firing.asset.col, 2);
  assert.match(firing.asset.sheet, /combat-character-animations\/goku_dbz/);
  assert.equal(firing.effect.kind, 'kamehameha');
  const cloud = resolvePresentationScript(hero('cloud_ff7'), 'fatality');
  assert.notEqual(samplePresentationScript(cloud, cloud.duration * 0.18).x, samplePresentationScript(cloud, cloud.duration * 0.57).x);
  assert.equal(resolvePresentationScript(hero('aerith_ff7'), 'fatality').effect.kind, 'gospel');
  const clone = resolvePresentationScript({ ...hero('goku_dbz'), id: 'runtime', sourceHeroId: 'goku_dbz' }, 'fatality');
  clone.beats[0].x = 9999;
  assert.notEqual(resolvePresentationScript(hero('goku_dbz'), 'fatality').beats[0].x, 9999);
  assert.equal(resolvePresentationScript({ ...hero('goku_dbz'), universe: 'Naruto' }, 'fatality'), null);
});

const sceneFor = (entry, side = 'player', tick = 0) => ({
  descriptor: { universe: entry.universe, entityName: entry.entityName, action: { name: entry.actionName } },
  actor: { id: 'caller', x: side === 'enemy' ? 620 : 140, y: 330, currentHp: 500, atb: 0, specialCharge: 0 },
  targets: [{ id: 'victim', x: side === 'enemy' ? 160 : 600, y: 330, currentHp: 1000 }],
  side, tick, impactTick: 99, durationTicks: 192, profile: { effect: 'damage' }
});

test('all28 exact entities have four sampled phases and changing choreography beyond pose labels', () => {
  const historicalKeys=new Set(entityRegistry.entries.map(entry=>entry.key));
  const historical = Object.values(SUMMON_CHOREOGRAPHIES).filter(entry => historicalKeys.has([entry.universe,entry.entityName,entry.actionName].join('::')));
  assert.equal(historical.length, 28);
  assert.deepEqual(sorted(historical.map(entry => [entry.universe, entry.entityName, entry.actionName].join('::'))), sorted(entityRegistry.entries.map(entry => entry.key)));
  const signatures = new Set();
  for (const entry of entityRegistry.entries) {
    const spec = resolveSummonChoreography(sceneFor(entry).descriptor);
    assert.equal(spec.id, entry.id);
    assert.equal(resolveSummonChoreography({ ...sceneFor(entry).descriptor, universe: 'Wrong universe' }), null);
    const scene = sceneFor(entry);
    const original = JSON.stringify(scene);
    const initial = getSummonChoreographyState(scene, { width: 760, height: 420 });
    const ticks = [0, initial.arrivalEndTick, initial.attackStartTick, 98, 99, initial.returnStartTick + 1, 192];
    const samples = ticks.map(tick => getSummonChoreographyState({ ...scene, tick }, { width: 760, height: 420 }));
    assert.deepEqual(sorted(new Set(samples.map(sample => sample.poseIndex))), [0, 1, 2, 3]);
    assert.equal(samples[3].poseIndex, 1, `${entry.id}: attack pose before the authoritative hit`);
    assert.equal(samples[4].poseIndex, 2);
    assert.equal(samples.at(-1).performer.alpha, 0);
    for (const sample of samples) {
      assert.ok(Object.values(sample.performer).every(Number.isFinite), entry.id);
      assert.ok(sample.performer.alpha >= 0 && sample.performer.alpha <= 1);
      const ctx = recorder();
      drawSummonChoreographyEffects(ctx, sample, 'behind');
      drawSummonChoreographyEffects(ctx, sample, 'front');
      assert.equal(ctx.depth, 0, entry.id);
    }
    assert.ok(samples.some(sample => sample.visuals.some(visual => visual.stage === 'travel')), `${entry.id}: no attack before contact`);
    signatures.add(JSON.stringify(samples.map(sample => ({ performer: sample.performer, visuals: sample.visuals }))));
    assert.equal(JSON.stringify(scene), original, `${entry.id}: visual sampling changed combat state`);
  }
  assert.equal(signatures.size, 28, 'entities still share the same sampled movement and effects');
});

test('P2 choreography mirrors P1 geometry and keeps ally support visually distinct from explosions', () => {
  for (const entry of entityRegistry.entries) for (const tick of [0, 30, 75, 99, 145, 192]) {
    const a = getSummonChoreographyState(sceneFor(entry, 'player', tick), { width: 760, height: 420 });
    const b = getSummonChoreographyState(sceneFor(entry, 'enemy', tick), { width: 760, height: 420 });
    assert.ok(Math.abs(a.performer.x + b.performer.x - 760) < 1e-8, `${entry.id}:${tick}: mirror x`);
    assert.equal(a.performer.y, b.performer.y, `${entry.id}:${tick}: mirror y`);
    assert.equal(a.performer.facing, -b.performer.facing);
  }
  const medical = entityRegistry.entries.find(entry => entry.id === 'nexus-suture-drone');
  const scene = { ...sceneFor(medical, 'player', 99), profile: { effect: 'heal' } };
  const state = getSummonChoreographyState(scene);
  assert.equal(state.effect, 'heal');
  assert.ok(state.visuals.some(visual => visual.kind === 'medical-tether'));
  assert.ok(state.visuals.every(visual => !/explosion|blast|plasma/.test(visual.kind)));
});

test('scene-specific mechanisms use the concrete source scene, preserve universe and advance the draw', () => {
  assert.ok(STAGE_ANIMATION_PROFILES.length >= 17);
  for (const definition of STAGE_ANIMATION_PROFILES) {
    const stage = { universe: definition.universes[0], name: definition.sourceScene, mode: 'Melee' };
    const animation = getStageAnimationProfile(stage);
    assert.equal(animation?.id, definition.id, `${definition.id}: sourceScene does not select its own mechanism`);
    assert.equal(getStageAnimationProfile({ ...stage, universe: 'Unrelated QA universe' }), null);
    assert.equal(animation.gameplayEffect, 'none');
    assert.equal(animation.sourceVisualValidation, 'not-validated-1:1');
    for (const local of animation.localAssetPaths) assert.ok(existsSync(new URL(`public${local}`, root)), local);
    const first = recorder(); const next = recorder();
    assert.equal(renderStageAnimation(first, { stage, width: 960, height: 540, elapsedSeconds: 0 }), true);
    assert.equal(renderStageAnimation(next, { stage, width: 960, height: 540, elapsedSeconds: definition.periodSeconds * 0.31 }), true);
    assert.equal(first.depth, 0); assert.equal(next.depth, 0);
    assert.notDeepEqual(first.calls, next.calls, `${definition.id}: the renderer draws the same geometry and styles over time`);
    assert.deepEqual(getStageAnimationFrame(stage, 10, { reducedMotion: true }), getStageAnimationFrame(stage, 400, { reducedMotion: true }));
    assert.equal(renderStageAnimation(recorder(), { stage: { ...stage, disableStageAnimations: true }, width: 960, height: 540 }), false);
  }
});

for (const side of ['player', 'enemy']) test(`real ${side} summon exposes the choreography clock, freezes on pause and hits exactly once`, () => {
  const engine = makeRpg('cloud_ff7', side);
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const targets = side === 'player' ? engine.enemies : engine.heroes;
  const hp = targets.map(target => target.currentHp);
  assert.ok(resolveUniverseSummon(actor));
  assert.equal(engine.summon(actor, side), true);
  assert.equal(engine.confirmTargeting(), true);
  const scene = engine.getSummonSceneState();
  assert.equal(scene.choreography.id, 'ff7-ifrit');
  tick(engine, scene.impactTick - 1);
  const pre = engine.getSummonSceneState();
  assert.equal(pre.choreography.poseIndex, 1);
  assert.ok(pre.choreography.travelProgress > 0);
  assert.deepEqual(targets.map(target => target.currentHp), hp);
  engine.setPaused(true);
  tick(engine, 200);
  assert.deepEqual(engine.getSummonSceneState(), pre, 'paused animation advances independently of simulation');
  engine.setPaused(false);
  tick(engine, 1);
  const hit = targets.map(target => target.currentHp);
  assert.ok(hit.some((value, index) => value < hp[index]));
  assert.equal(engine.getSummonSceneState().choreography.poseIndex, 2);
  tick(engine, scene.durationTicks - scene.impactTick);
  assert.deepEqual(targets.map(target => target.currentHp), hit);
  assert.equal(engine.getSummonSceneState(), null);
});

test('RPG native-super progress uses the simulation timer and does not replace the invocation actor', () => {
  const engine = makeRpg('goku_dbz');
  const actor = engine.heroes[0];
  actor.state = 'special'; actor.stateTimer = 45; actor.rpgSpecialDurationTicks = 45;
  assert.equal(engine.getRpgPresentationActor(actor).presentationProgress, 0);
  actor.stateTimer = 20;
  assert.ok(engine.getRpgPresentationActor(actor).presentationProgress > 0.5);
  assert.equal(engine.getRpgPresentationActor(actor).presentationPhase, 'super');
  actor.stateTimer = 0;
  assert.equal(engine.getRpgPresentationActor(actor).presentationProgress, 1);
  engine.activeSummon = { sentinel: true };
  assert.equal(engine.getRpgPresentationActor(actor), actor);
  engine.activeSummon = null;
});

for (const side of ['player', 'enemy']) test(`real ${side} RPG super selects its contact bitmap on the authoritative impact tick`, () => {
  const engine = makeRpg('goku_dbz', side);
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const target = side === 'player' ? engine.enemies[0] : engine.heroes[0];
  target.maxHp = 10000; target.currentHp = 10000;
  assert.equal(engine.beginTargeting(actor, 'special', side), true);
  assert.equal(engine.confirmTargeting(), true);
  const untilImpact = engine.actionQueue[0].ticks;
  assert.ok(untilImpact > 1);
  assert.equal(getCharacterAnimationFrame(engine.getRpgPresentationActor(actor)).col, 0);
  tick(engine, untilImpact - 1);
  assert.equal(target.currentHp, 10000);
  assert.equal(getCharacterAnimationFrame(engine.getRpgPresentationActor(actor)).col, 1, 'contact pose is already visible before the hit');
  const beforePause = engine.getRpgPresentationActor(actor);
  engine.setPaused(true); tick(engine, 200);
  assert.deepEqual(engine.getRpgPresentationActor(actor), beforePause);
  engine.setPaused(false); tick(engine, 1);
  assert.ok(target.currentHp < 10000);
  assert.equal(getCharacterAnimationFrame(engine.getRpgPresentationActor(actor)).col, 2, 'contact pose missed the actual damage tick');
});

test('renderer presentationFrame overrides the actual source rectangle rather than only the label', () => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 1024;
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); }
    get src() { return this._src; }
  };
  try {
    const actor = { ...hero('naruto_uzumaki_young'), state: 'idle', presentationFrame: { row: 2, col: 3 } };
    const ctx = recorder();
    drawPixelSprite(ctx, 100, 200, actor, 0, 1, 72, 'melee');
    const draw = ctx.calls.find(call => call[0] === 'drawImage');
    assert.ok(draw, 'the real renderer never selected a bitmap');
    const layout = getSpriteSheetLayout(getHeroSpriteSheetSrc(actor, 'melee'));
    assert.equal(draw[2], 3 * 1024 / layout.columns);
    assert.equal(draw[3], 2 * 1024 / layout.rows);
    assert.equal(ctx.depth, 0);
  } finally { globalThis.Image = OriginalImage; }
});

test('eight exact character atlases contain256 nonempty native poses with real alpha and retained provenance hashes', async () => {
  const registry = json('src/game/combat/characterAnimations.generated.json');
  const expected = ['cloud_ff7', 'tifa_ff7', 'aerith_ff7', 'barret_ff7', 'goku_dbz', 'vegeta_dbz', 'naruto_six_paths', 'sasuke_rinnegan'];
  const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
  const provenance = json('docs/combat-fidelity-2026-10-18/character-animation-provenance.json');
  assert.equal(registry.source, 'OpenAI');
  assert.deepEqual(sorted(registry.entries.map(entry => entry.heroId)), sorted(expected));
  assert.equal(provenance.sources.length, 12, 'eight originals and four native identity/containment corrections must remain archived');
  assert.equal(provenance.canon1to1Verified, false);
  assert.equal(provenance.networkVerified, false);
  for (const source of provenance.sources) {
    assert.ok(expected.includes(source.heroId));
    assert.equal(sha256(readFileSync(new URL(source.archivedPath, root))), source.sha256, source.archivedPath);
  }
  const allAssets = new Set();
  for (const entry of registry.entries) {
    assert.equal(entry.universe, hero(entry.heroId).universe, entry.heroId);
    assert.equal(entry.width, 1024); assert.equal(entry.height, 2048);
    assert.equal(entry.columns, 4); assert.equal(entry.rows, 8); assert.equal(entry.frames, 32);
    assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(phases));
    assert.equal(entry.visualValidation.canon1to1Verified, false);
    assert.equal(entry.visualValidation.networkVerified, false);
    assert.equal(entry.visualValidation.adaptedChoreography, true);
    const bytes = readFileSync(new URL(`public${entry.sheet}`, root));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(sha256(bytes), entry.sha256, entry.heroId);
    assert.equal(allAssets.has(entry.sha256), false, 'two characters were assigned the same bitmap');
    allAssets.add(entry.sha256);
    assert.equal(sha256(readFileSync(new URL(entry.sourceImage, root))), entry.sourceImageSha256);
    assert.equal(sha256(readFileSync(new URL(`public${entry.referenceAsset}`, root))), entry.referenceAssetSha256);
    if (entry.originalSourceImage) assert.equal(sha256(readFileSync(new URL(entry.originalSourceImage, root))), entry.originalSourceImageSha256);
    for (const normalizedRow of entry.normalization.rows) {
      assert.equal(sha256(readFileSync(new URL(normalizedRow.sourceImage, root))), normalizedRow.sourceImageSha256);
      assert.equal(normalizedRow.sourceRow, entry.phases[normalizedRow.phase].row);
      if (entry.heroId === 'barret_ff7') assert.equal(normalizedRow.sourceImage,
        ['fatality', 'super'].includes(normalizedRow.phase) ? entry.sourceImage : entry.originalSourceImage,
        `${normalizedRow.phase}: the Barret correction replaced an unrelated original phase`);
    }
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 1024); assert.equal(metadata.height, 2048); assert.equal(metadata.hasAlpha, true);
    const rgba = await sharp(bytes).ensureAlpha().raw().toBuffer();
    const wholeSheetFrames = new Set();
    for (const [row, phase] of phases.entries()) {
      assert.equal(entry.phases[phase].row, row);
      assert.equal(entry.phases[phase].frames, 4);
      const actualHashes = [];
      for (let col = 0; col < 4; col++) {
        const frame = Buffer.alloc(256 * 256 * 4);
        let visible = 0;
        for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
          const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
          const alpha = rgba[offset + 3];
          if (alpha > 4) visible++;
          if (alpha > 0) rgba.copy(frame, (y * 256 + x) * 4, offset, offset + 4);
          if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${entry.heroId}:${phase}:${col}: bitmap touches another cell`);
        }
        assert.ok(visible > 300, `${entry.heroId}:${phase}:${col}: empty pose`);
        const digest = sha256(frame); actualHashes.push(digest); wholeSheetFrames.add(digest);
      }
      assert.equal(new Set(actualHashes).size, 4, `${entry.heroId}:${phase}: repeated cells were presented as animation`);
      const review = entry.visualValidation.phaseReviews.find(review => review.phase === phase);
      assert.deepEqual(review.frameHashes, actualHashes, `${entry.heroId}:${phase}: retained visual review does not describe these pixels`);
    }
    assert.equal(wholeSheetFrames.size, 32, `${entry.heroId}: phase rows reuse the same generated pose`);
  }
});

test('dedicated atlas phase and impact frames are selected by exact identity and the real renderer', () => {
  const registry = json('src/game/combat/characterAnimations.generated.json');
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 2048;
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); }
    get src() { return this._src; }
  };
  try {
    for (const entry of registry.entries) {
      const actor = { ...hero(entry.heroId), id: 'p2-copy', sourceHeroId: entry.heroId };
      assert.equal(resolveCharacterAnimationAsset(actor).heroId, entry.heroId);
      assert.equal(resolveCharacterAnimationAsset({ ...actor, universe: 'Unrelated QA universe' }), null);
      for (const [phase, spec] of Object.entries(entry.phases)) {
        const selected = new Set();
        for (const progress of [0, 0.3, 0.6, 1]) {
          const frame = getCharacterAnimationFrame(actor, { phase, progress });
          assert.equal(frame.asset.sheet, entry.sheet);
          assert.equal(frame.row, spec.row);
          assert.equal(frame.canonicalAnimationVerified, false);
          selected.add(frame.col);
          const ctx = recorder();
          drawPixelSprite(ctx, 100, 220, { ...actor, presentationPhase: phase, presentationProgress: progress }, 0, -1, 72, 'melee');
          const draw = ctx.calls.find(call => call[0] === 'drawImage');
          assert.ok(draw, `${entry.heroId}:${phase}: actual renderer bypassed the dedicated atlas`);
          assert.equal(draw[1].src, entry.sheet);
          assert.equal(draw[2], frame.col * 256);
          assert.equal(draw[3], frame.row * 256);
          assert.equal(draw[4], 256); assert.equal(draw[5], 256);
        }
        assert.equal(selected.size, 4, `${entry.heroId}:${phase}: dedicated phase never reaches all four poses`);
      }
      const before = getCharacterAnimationFrame(actor, { phase: 'super', progress: 0.42 - 0.001, impactProgress: 0.42 });
      const hit = getCharacterAnimationFrame(actor, { phase: 'super', progress: 0.42, impactProgress: 0.42 });
      assert.equal(before.col, 1, 'impact bitmap appears before the actual hit');
      assert.equal(hit.col, 2, 'impact bitmap does not coincide with the actual hit');
    }
  } finally { globalThis.Image = OriginalImage; }
});

test('Aria has a separately sourced dagger correction with16 actual base poses and exact-universe routing', async () => {
  const registry = json('src/game/combat/characterSpriteCorrections.generated.json');
  assert.deepEqual(registry.entries.map(entry => entry.heroId), ['crypt_necrodancer_aria']);
  const entry = registry.entries[0];
  assert.equal(entry.universe, hero(entry.heroId).universe);
  assert.equal(entry.canon1to1Verified, false);
  assert.match(entry.sourceReference, /dagger/i);
  const bytes = readFileSync(new URL(`public${entry.sheet}`, root));
  assert.equal(sha256(bytes), entry.sha256);
  assert.equal(sha256(readFileSync(new URL(entry.sourceImage, root))), entry.sourceImageSha256);
  assert.equal(sha256(readFileSync(new URL(entry.referenceImage, root))), entry.referenceAssetSha256);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1024); assert.equal(metadata.height, 1024); assert.equal(metadata.hasAlpha, true);
  const rgba = await sharp(bytes).ensureAlpha().raw().toBuffer();
  const hashes = new Set();
  for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    assert.equal(entry.states[state].row, row);
    for (let col = 0; col < 4; col++) {
      const frame = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4;
        const alpha = rgba[offset + 3];
        if (alpha > 4) visible++;
        if (alpha > 0) rgba.copy(frame, (y * 256 + x) * 4, offset, offset + 4);
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(alpha, 0, `${state}:${col}: correction is cropped`);
      }
      assert.ok(visible > 300, `${state}:${col}: empty Aria pose`);
      hashes.add(sha256(frame));
    }
    const actor = resolveCombatHeroSpriteActor({ ...hero(entry.heroId), id: 'p2-aria-runtime', sourceHeroId: entry.heroId, state });
    assert.equal(getHeroSpriteSheetSrc(actor, 'melee'), entry.sheet, `${state}: corrected sprite is not used by the runtime`);
    assert.notEqual(getHeroSpriteSheetSrc({ ...actor, universe: 'Unrelated QA universe' }, 'melee'), entry.sheet);
    assert.equal(getSpriteStateResolution(state, getSpriteSheetLayout(entry.sheet)).row, row);
  }
  assert.equal(hashes.size, 16, 'the correction repeats base poses');
});

test('the audit distinguishes raw names, effective names, missing dedicated art and unverified fidelity', () => {
  const report = measureCombatFidelity();
  assert.equal(report.abilities.rawHeuristicCandidateSlots, 4252, 'the original broad candidate catalog should remain measurable');
  assert.equal(report.abilities.baselineHeuristicCandidateSlots, 4252);
  assert.equal(report.abilities.baselineCandidateSlotsReplaced + report.abilities.effectiveHeuristicCandidateSlots, 4252);
  assert.equal(report.abilities.rawStrictGenericSlots, 4134);
  assert.deepEqual(report.abilities.rawStrictCounts, { simple: 1330, secondary: 1387, defense: 1417 });
  assert.equal(report.abilities.rawConcreteDefenseCandidatesForReview.length, 118);
  assert.equal(report.abilities.effectiveStrictGenericSlots, 0, 'strict generic slots remain in the effective runtime');
  assert.equal(report.abilities.authoredHeroes, 1491);
  assert.equal(report.abilities.authoredSlots, 4369);
  assert.equal(report.abilities.completeThreeSlotKits, 1418);
  assert.equal(report.abilities.partialSlotKits, 73);
  assert.equal(report.abilities.originalResidualCohort.heroes, 72);
  assert.equal(report.abilities.originalResidualCohort.slots, 114);
  assert.equal(report.abilities.separateLoreCorrections.heroes, 1);
  assert.equal(report.abilities.separateLoreCorrections.slots, 1);
  assert.deepEqual(report.abilities.separateLoreCorrections.entries.map(entry => entry.id), [loreCorrection.id]);
  assert.equal(report.abilities.unresolvedSlots, 0);
  assert.equal(report.presentations.scriptedHeroes, 203);
  assert.equal(report.presentations.scriptedPairs, 1421);
  assert.equal(report.entities.scriptedEntities, 28);
  assert.equal(report.entities.distinctSampledTrajectories, 28);
  assert.equal(report.characterPixelBaseline.summary.pixelHashedSheets, 1905);
  assert.equal(report.characterPixelBaseline.summary.nonIntegralGridSheets, 9);
  assert.equal(report.characterPixelBaseline.summary.sheetsWithExactRepeatedTiles, 0);
  assert.equal(report.source1to1Verified, false);
  assert.equal(report.meleeBindings.nativePresentationHeroes, getCharacterAnimationAssets().filter(entry => entry.frames === 32).length);
  assert.deepEqual(report.meleeBindings.nativePresentationPendingFiles, []);
  assert.equal(report.meleeBindings.heroesWithoutDedicatedPresentationAtlas, HEROES_DB.length - getCharacterAnimationAssets().filter(entry => entry.frames === 32).length, 'coarse aliases were counted as dedicated bitmap art');
  assert.equal(report.baseSpriteCorrections.poses, report.baseSpriteCorrections.heroes * 16);
  assert.deepEqual(report.baseSpriteCorrections.pendingFiles, []);
  assert.equal(report.baseSpriteCorrections.countedAsDedicatedPresentationAtlases, false);
});
