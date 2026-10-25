import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { before, after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveCombatPresentation, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE14 } from './combatFidelityHistoricalCohortWave14.mjs';
import { ABILITIES_WAVE12, ABILITY_REVISIONS_WAVE12 } from '../src/game/combat/abilities/abilitiesWave12.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12 as definitions } from '../src/game/combat/combatSourceDefinitionsWave12.js';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../src/game/combat/characterAnimationCatalog.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { supportsNativeSuperWave12, projectNativeSuperAnchorWave12, getNativeSuperVisualStateWave12, drawNativeSuperVisualsWave12 } from '../src/game/combat/nativeSuperVisualsWave12.js';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteStateResolution } from '../src/game/spriteAssets.js';
import { getSummonAnimationAssets, resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { getMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const plan = json('docs/combat-fidelity-wave12-2026-10-23/batch-plan-before.json');
const authoredBefore = json('docs/combat-fidelity-wave12-2026-10-23/authored-before.json');
const historical = json('docs/combat-fidelity-wave12-2026-10-23/historical-assets-before.json');
const ids = Object.values(plan.parts).flat();
const blocked = new Set(['morty']);
const deliveredIds = ids.filter(id => !blocked.has(id));
const roster = new Map(HEROES_DB.map(h => [h.id, h]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };
const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const partEntries = kind => ['A', 'B', 'C', 'D'].flatMap(part => json(`src/game/combat/${kind}Wave12Part${part}.generated.json`).entries);
const noop = () => {};
let vite, EngineRpg, EngineFighter;
const engines = [];
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

test('W12 source identities retain the frozen forty characters, nineteen additions and twenty-one version revisions', () => {
  assert.equal(ids.length, 40); assert.equal(new Set(ids).size, 40);
  assert.deepEqual(sorted(Object.keys(definitions)), sorted(ids));
  assert.deepEqual(sorted(Object.keys(ABILITIES_WAVE12)), sorted(authoredBefore.selectedNewIds));
  assert.deepEqual(sorted(Object.keys(ABILITY_REVISIONS_WAVE12)), sorted(authoredBefore.selectedRevisionIds));
  assert.equal(authoredBefore.selectedNewIds.length, 19); assert.equal(authoredBefore.selectedRevisionIds.length, 21);
  assert.equal(hero('annie_knowby').weaponType, 'book', 'Annie reads passages; no staff is introduced');
  const wave13NewIds = new Set(json('docs/combat-fidelity-wave13-2026-10-24/ability-baseline-before.json').newAbilityIds);
  assert.equal(wave13NewIds.size, 18);
  assert.deepEqual(sorted(Object.keys(HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE14).filter(id => !wave13NewIds.has(id))), sorted([...authoredBefore.allAuthoredIds, ...authoredBefore.selectedNewIds]));
  for (const row of plan.heroes) {
    const h = hero(row.hero.id), d = definitions[h.id];
    assert.equal(h.universe, row.hero.universe); assert.equal(d.universe, h.universe);
    assert.equal(h.weaponType, d.weaponType); assert.ok(d.sourceWork && d.sourceReference.startsWith('https://'));
    assert.notEqual(d.source1to1Verified, true);
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      assert.deepEqual(h[slot], row.hero[slot], h.id + ': source catalog action changed');
      const action = resolveCombatAbility(h, slot);
      assert.equal(action.sourceHeroId, h.id); assert.equal(action.universe, h.universe);
      assert.doesNotMatch(action.name, /Signature Strike|Breach Technique|Signature Guard|Origin Burst/i);
      assert.equal(action.provenance.canonicalVerified, false); assert.equal(action.provenance.networkVerified, false);
      assert.ok(action.duration > action.hitAt && action.hitAt >= 0);
      if (action.effect === 'damage') assert.ok(action.multiplier > 0);
      else { assert.equal(action.multiplier, 0); assert.notEqual(action.targetSide, 'enemy'); }
    }
    const special = resolveCombatAbility(h, 'special');
    assert.equal(special.name, d.name); assert.equal(special.effect, d.effect); assert.equal(special.delivery, d.delivery);
    assert.equal(CHARACTER_PRESENTATIONS[h.id].sourceAction, d.name);
  }
});

test('W12 preserves all 465 historical PNG files and 93 registry metadata files byte for byte', () => {
  assert.equal(historical.png.length, 465); assert.equal(historical.registries.length, 93);
  for (const entry of historical.registries) assert.equal(sha(read(entry.path)), entry.sha256, entry.path);
  for (const entry of historical.png) {
    const bytes = read('public' + entry.sheet);
    assert.equal(sha(bytes), entry.sha256, entry.sheet);
    assert.equal(bytes.readUInt32BE(16), entry.width); assert.equal(bytes.readUInt32BE(20), entry.height);
  }
});

test('W12 validates source-specific supers strictly and projections cannot manufacture accepted contacts', () => {
  let offense = 0, support = 0;
  const ctx = new Proxy({ globalAlpha: 1 }, { get: (target, key) => key in target ? target[key] : noop, set: (target, key, value) => { target[key] = value; return true; } });
  for (const id of ids) {
    const h = hero(id), profile = resolveCombatAbility(h, 'special');
    assert.equal(supportsNativeSuperWave12(profile), true);
    if (profile.effect === 'damage') offense++; else support++;
    for (const patch of [{ sourceHeroId: 'unknown' }, { universe: 'Wrong universe' }, { name: 'Unrelated action' },
      { effect: profile.effect === 'damage' ? 'guard' : 'damage' }, { delivery: profile.delivery === 'melee' ? 'projectile' : 'melee' }]) {
      assert.equal(supportsNativeSuperWave12({ ...profile, ...patch }), false);
    }
    for (const facing of [-1, 1]) {
      const actor = { ...h, id: 'battle-instance', sourceHeroId: id, x: 400, y: 330, currentHp: 73, meter: 44, facing };
      const original = structuredClone(actor), action = { elapsed: 0.6, duration: 1.1, hitAt: 0.451, facing };
      const state = getNativeSuperVisualStateWave12({ actor, profile, action, target: { x: 400 + facing * 60, y: 330 }, contactVisual: { confirmed: false } });
      assert.ok(state); assert.equal(state.family, 'native-wave12'); assert.equal(state.contactEligible, false);
      assert.equal(state.gameplayEffect, 'none'); drawNativeSuperVisualsWave12(ctx, state); assert.deepEqual(actor, original);
      const accepted = getNativeSuperVisualStateWave12({ actor, profile, action, target: null, contactVisual: { confirmed: true, x: 450, y: 330 } });
      assert.equal(accepted.contactEligible, profile.effect === 'damage');
    }
  }
  assert.equal(offense, 24); assert.equal(support, 16);
});

test('W12 native finales never fall through to invented generic body auras or unconfirmed attack effects', () => {
  const calls = [];
  const ctx = new Proxy({ globalAlpha: 1 }, {
    get: (target, key) => key in target ? target[key] : (...args) => calls.push([key, ...args]),
    set: (target, key, value) => { target[key] = value; return true; }
  });
  for (const id of ids) for (const facing of [-1, 1]) {
    const identity = resolveCombatPresentation(hero(id), 'fatality');
    const script = resolvePresentationScript(hero(id), 'fatality');
    for (const progress of [0.3, 0.6, 0.9]) {
      const sample = samplePresentationScript(script, script.duration * progress);
      EngineFighter.prototype.drawScriptedPresentationEffect.call({ width: 1200 }, ctx, sample, identity, 400, 330, facing, 'fatality');
    }
  }
  assert.deepEqual(calls, [], 'Only the separately rendered native poses describe these cinematic actions');
});

test('W12 native presentation and base atlases have complete unique pixels, transparent margins and valid source hashes', async () => {
  const native = partEntries('characterAnimations'), bases = partEntries('characterSpriteCorrections');
  assert.deepEqual(sorted(native.map(e => e.heroId)), sorted(deliveredIds));
  assert.deepEqual(sorted(bases.map(e => e.heroId)), sorted(deliveredIds));
  const hashesByHero = new Map();
  for (const entry of [...native, ...bases]) {
    const bytes = read('public' + entry.sheet), isNative = !!entry.phases;
    assert.equal(sha(bytes), entry.sha256); assert.equal(entry.universe, hero(entry.heroId).universe);
    assert.equal(entry.frames, isNative ? 32 : 16); assert.equal(entry.columns, 4); assert.equal(entry.rows, isNative ? 8 : 4);
    assert.equal(entry.frameWidth, 256); assert.equal(entry.frameHeight, 256);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 1024); assert.equal(info.height, isNative ? 2048 : 1024);
    assert.equal(sha(read(entry.sourceImage)), entry.sourceImageSha256 ?? entry.sourceHash);
    if (isNative) assert.deepEqual(sorted(Object.keys(entry.phases)), sorted(phases));
    const hashes = hashesByHero.get(entry.heroId) || new Set();
    for (let row = 0; row < entry.rows; row++) for (let col = 0; col < 4; col++) {
      const rgba = Buffer.alloc(256 * 256 * 4); let visible = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const source = ((row * 256 + y) * info.width + col * 256 + x) * 4;
        if (data[source + 3] > 24) visible++;
        if (x < 10 || y < 10 || x >= 246 || y >= 246) assert.equal(data[source + 3], 0, `${entry.heroId}/${row}/${col}: crop at border`);
        data.copy(rgba, (y * 256 + x) * 4, source, source + 4);
      }
      assert.ok(visible > 300, `${entry.heroId}/${row}/${col}: empty pose`);
      const digest = sha(rgba); assert.equal(hashes.has(digest), false, entry.heroId + ': repeated native pixels'); hashes.add(digest);
    }
    hashesByHero.set(entry.heroId, hashes);
  }
  assert.ok([...hashesByHero.values()].every(hashes => hashes.size === 48));
  for (const id of deliveredIds) for (const phase of phases) for (const progress of [0, 0.3, 0.6, 1]) {
    const h = hero(id), frame = getCharacterAnimationFrame(h, { phase, progress });
    assert.equal(frame.asset.heroId, id); assert.equal(frame.phase, phase); assert.equal(frame.frames, 4);
    assert.equal(resolveCharacterAnimationAsset({ ...h, id: 'runtime-p2', sourceHeroId: id }).heroId, id);
  }
  assert.equal(native.length * 32 + bases.length * 16, 1872);
});

test('W12 projectile anchors follow real native pixels and mirror with both player camps', async () => {
  const entries = new Map(partEntries('characterAnimations').map(e => [e.heroId, e]));
  const anchors = Object.assign({}, ...['A', 'B', 'C', 'D'].map(part => json(`src/game/combat/nativeSuperAnchorsWave12Part${part}.generated.json`)));
  for (const id of ids.filter(id => definitions[id].delivery === 'projectile')) {
    const entry = entries.get(id), { data, info } = await sharp(read('public' + entry.sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const phase of ['super', 'fatality']) {
      assert.ok(Array.isArray(anchors[id]?.[phase]), id); assert.equal(anchors[id][phase].length, 4);
      assert.ok(anchors[id][phase][1] || anchors[id][phase][2], id + ': no aimed native origin');
      for (let col = 0; col < 4; col++) {
        const a = anchors[id][phase][col]; if (!a) continue;
        assert.ok(a.x >= 0 && a.x < 256 && a.y >= 0 && a.y < 256);
        const index = ((entry.phases[phase].row * 256 + Math.round(a.y)) * info.width + col * 256 + Math.round(a.x)) * 4;
        assert.ok(data[index + 3] > 24, id + ': origin is outside the native weapon');
        const h = hero(id), actor = { ...h, x: 400, y: 330, presentationPhase: phase, presentationFrame: { col } };
        const right = projectNativeSuperAnchorWave12({ ...actor, action: { facing: 1 } }, 0.4, 0.41, 90);
        const left = projectNativeSuperAnchorWave12({ ...actor, action: { facing: -1 } }, 0.4, 0.41, 90);
        assert.ok(Math.abs(right.x + left.x - 800) < 1e-8); assert.equal(right.y, left.y);
      }
    }
  }
});

test('Morty refusal remains absent from native delivery and support reuses one calm historical cell', () => {
  const h = hero('morty'), layout = getSpriteSheetLayout(getHeroSpriteSheetSrc(h, 'rpg'));
  assert.equal(resolveCharacterAnimationAsset(h), null);
  assert.equal(getCharacterAnimationAssets().some(e => e.heroId === 'morty'), false);
  assert.equal(layout.adaptedLegacyFallback, true); assert.equal(layout.fixedColumn, 0);
  assert.equal(layout.countedAsDedicatedBase16, false); assert.equal(layout.countedAsDedicatedSuperOrFinale, false);
  for (const state of ['support', 'special', 'defense']) {
    const frame = getSpriteStateResolution(state, layout);
    assert.equal(frame.row, 0); assert.equal(frame.dedicated, false);
  }
  for (const phase of PRESENTATION_PHASES) {
    const script = resolvePresentationScript(h, phase);
    assert.ok(script.missingAssets.includes('native-all-phase-artwork'));
    for (const progress of [0, 0.3, 0.7, 1]) {
      const sample = samplePresentationScript(script, script.duration * progress);
      assert.equal(sample.asset.row, 0); assert.equal(sample.asset.col, 0); assert.equal(sample.asset.dedicatedPhaseAsset, false);
    }
  }
});

test('seven real same-universe native RPG partners preserve all thirty earlier atlases', () => {
  const entries = json('src/game/combat/summonAnimationsWave12.generated.json').entries;
  const historicalKeys = new Set(json('docs/combat-fidelity-wave13-2026-10-24/baseline.json').entities.nativeAnimationEntries.map(entry => entry.key));
  assert.equal(entries.length, 7); assert.equal(historicalKeys.size, 37);
  assert.equal(getSummonAnimationAssets().filter(entry => historicalKeys.has(entry.key)).length, 37);
  const callers = ['james_s', 'dylan', 'anna_predator', 'annie_knowby', 'carver', 'fry_futurama', 'rick'];
  for (const id of callers) {
    const descriptor = resolveUniverseSummon(hero(id)), asset = resolveSummonAnimationAsset(descriptor);
    assert.ok(asset); assert.equal(asset.universe, hero(id).universe); assert.notEqual(asset.performerHeroId, id);
    assert.equal(asset.frames, 16); assert.equal(sha(read('public' + asset.sheet)), asset.sha256);
    assert.equal(resolveSummonAnimationAsset({ ...descriptor, universe: 'Wrong universe' }), null);
    assert.equal(resolveSummonAnimationAsset({ ...descriptor, action: { ...descriptor.action, name: 'Wrong action' } }), null);
  }
  assert.equal(resolveUniverseSummon(hero('rick')).action.targeting.effect, 'guard');
});

test('all W12 beneficial basic actions use support state and never fire a generic projectile at allies', () => {
  let checked = 0;
  for (const id of ids) for (const side of ['player', 'enemy']) for (const slot of ['simple', 'secondary', 'defense']) {
    const profile = resolveCombatAbility(hero(id), slot); if (profile.effect === 'damage') continue;
    const own = [hero(id), hero('xander_buffy')], other = [hero('cloud_ff7')];
    const players = side === 'player' ? own : other, enemies = side === 'enemy' ? own : other;
    const engine = new EngineRpg(1200, 540, players, { monsters: enemies, bosses: [], customRoster: enemies }, { add: noop }, noop, noop,
      { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
    engines.push(engine); engine.autoBattle = false;
    const allies = side === 'player' ? engine.heroes : engine.enemies, targets = side === 'player' ? engine.enemies : engine.heroes, actor = allies[0];
    for (const unit of [...allies, ...targets]) Object.assign(unit, { state: 'idle', actionPending: false, atb: 100, cooldown: 0, specialCharge: 100, currentHp: 1000, maxHp: 1000, y: 330 });
    actor.x = side === 'player' ? 250 : 900; allies[1].x = actor.x + (side === 'player' ? 70 : -70);
    targets.forEach(unit => { unit.x = actor.x + (side === 'player' ? 160 : -160); });
    const emissions = []; engine.emitTargetedProjectile = (...args) => emissions.push(args);
    const hp = targets.map(target => target.currentHp);
    assert.equal(side === 'player' ? engine.triggerAbility(actor, slot) : engine.triggerEnemyAbility(actor, slot), true, `${id}/${side}/${slot}`);
    assert.equal(actor.state, slot === 'defense' ? 'defense' : 'support');
    for (let tick = 0; tick < 120; tick++) engine.advanceActions();
    assert.equal(emissions.length, 0, `${id}/${side}/${slot}: generic offensive emission`);
    assert.deepEqual(targets.map(target => target.currentHp), hp); checked++;
  }
  assert.ok(checked > 100, 'Exercise both camps and every beneficial basic/defense slot');
});

test('Isaac has forty-five distinct native Melee state rows, preserving the earlier twelve complete manifests', () => {
  const manifest = getMeleeAnimationManifest('isaac');
  assert.ok(manifest); assert.equal(manifest.universe, 'Dead Space'); assert.notEqual(manifest.source1to1Verified, true);
  const rows = new Set();
  for (const state of MELEE_STATES) {
    const entry = manifest.animations[state]; assert.ok(entry, state); assert.equal(entry.frameCount, 4);
    assert.ok(entry.row >= 0 && entry.row < manifest.rows); rows.add(entry.sheet + ':' + entry.row);
  }
  assert.equal(rows.size, 45);
  const previous = json('docs/combat-fidelity-wave12-2026-10-23/isaac-sources/previous-twelve-manifests-before.json');
  for (const [id, original] of Object.entries(previous.manifests || previous)) assert.deepEqual(getMeleeAnimationManifest(id), original, id);
});
