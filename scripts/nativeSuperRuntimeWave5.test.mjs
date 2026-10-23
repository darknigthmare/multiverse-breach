import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createServer } from 'vite';
import { supportsNativeSuperWave5, getNativeSuperVisualStateWave5, drawNativeSuperVisualsWave5, sampleNativeSuperMotionWave5 } from '../src/game/combat/nativeSuperVisualsWave5.js';
import { sampleSummonAnimationFrame } from '../src/game/combat/summonAnimationState.js';
import { getCharacterSuperVisualState, drawCharacterSuperVisuals, sampleCharacterSuperMotion } from '../src/game/combat/characterSuperVisuals.js';

let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, drawPixelSprite, getCharacterAnimationFrame, getHeroSpriteSheetSrc;
let getSummonAnimationAssets, resolveSummonAnimationAsset, getSummonAnimationFrame;
const engines = [], noop = () => {}, particles = { add: noop };
const dummy = id => ({
  id, name: id, universe: 'Native wave5 regression', category: 'test', weaponType: 'melee',
  primaryColor: '#88aacc', secondaryColor: '#ddeeff', stats: { hp: 5000, atk: 20, def: 8, spd: 5 },
  simple: { name: 'Training strike', type: 'melee', dmg: 1 }, secondary: { name: 'Training shot', type: 'bullet', dmg: 1, cd: 3 },
  defense: { name: 'Training guard', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'Training finish', type: 'bullet', dmg: 2 }
});
const hero = id => { const h = heroes.find(x => x.id === id); assert.ok(h, id); return h; };
const hp = actors => actors.map(x => x.currentHp);
const physical = actor => ({ x: actor.x, y: actor.y, vx: actor.vx, vy: actor.vy, hp: actor.currentHp, state: actor.state });
const meter = context => context.mode === 'fighter' ? context.actor.meter : context.actor.specialCharge;
const setMeter = (context, value) => { if (context.mode === 'fighter') context.actor.meter = value; else context.actor.specialCharge = value; };

function make(mode, side, heroId, withAlly = false) {
  const own = [hero(heroId), ...(withAlly ? [dummy('allied-patient')] : [])];
  const opposing = [dummy('near-one'), dummy('near-two'), dummy('far-one')];
  const players = side === 'player' ? own : opposing;
  const opponents = side === 'opponent' ? own : opposing;
  let engine, engineSide, actor, allies, targets;
  if (mode === 'fighter') {
    engine = new EngineFighter(1800, 500, players, opponents, particles, noop, noop, { opponentControl: 'p2' });
    engine.countdown = 0; engineSide = side === 'player' ? 'player' : 'cpu';
    actor = engine.getActive(engineSide); allies = engine.getTeam(engineSide).fighters;
    targets = engine.getTeam(side === 'player' ? 'cpu' : 'player').fighters;
  } else {
    const data = { monsters: opponents, bosses: [], customRoster: opponents };
    const options = { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
    engine = mode === 'rpg' ? new EngineRpg(1800, 500, players, data, particles, noop, noop, options)
      : new EngineSmash(1800, 500, players, data, particles, noop, noop, { ...options, mode: 'Smash' });
    if (mode === 'rpg') engine.autoBattle = false;
    else engine.syncPreMatchFromServer(3000);
    engineSide = side === 'player' ? 'player' : mode === 'rpg' ? 'enemy' : 'cpu';
    allies = side === 'player' ? engine.heroes : engine.enemies;
    targets = side === 'player' ? engine.enemies : engine.heroes; actor = allies[0];
  }
  engines.push(engine);
  [...allies, ...targets].forEach(unit => {
    unit.maxHp = Math.max(1000, unit.maxHp); unit.currentHp = unit.maxHp;
    unit.state = 'idle'; unit.vx = 0; unit.vy = 0; unit.y = mode === 'rpg' ? 330 : engine.groundY;
    unit.atb = 100; unit.specialCharge = 100;
  });
  const facing = side === 'player' ? 1 : -1;
  actor.x = facing > 0 ? 200 : 1500; actor.facing = facing; actor.meter = 100;
  allies.slice(1).forEach((unit, i) => { unit.x = actor.x - facing * (80 + i * 15); });
  const close = [100, 115, -350];
  targets.forEach((unit, i) => { unit.x = actor.x + facing * close[i]; });
  return { mode, side, engineSide, engine, actor, allies, targets, facing };
}
function commit(context, index = 0) {
  const { mode, engine, actor, engineSide } = context;
  if (mode === 'fighter') return engine.triggerSideAction(engineSide, 'super');
  if (mode === 'melee') return engineSide === 'player' ? engine.triggerAbility(actor, 'special') : engine.triggerOpponentAbility('special');
  if (!engine.beginTargeting(actor, 'special', engineSide)) return false;
  if (engine.getTargetingState().shape === 'single' && engine.getTargetingState().profile.targetSide === 'enemy') assert.equal(engine.selectTarget(context.targets[index].battleId), true);
  context.expectedTargetIds = [...engine.getTargetingState().previewTargetIds];
  return engine.confirmTargeting();
}
function advance(context, seconds) {
  const { mode, engine, actor } = context;
  if (mode === 'rpg') { for (let i = 0; i < Math.round(seconds * 60); i++) engine.update(); return; }
  for (let elapsed = 0; elapsed < seconds - 1e-9;) {
    const dt = Math.min(1 / 60, seconds - elapsed);
    if (mode === 'fighter') { engine.updateActions(dt); engine.updateProjectiles(dt); }
    else tickMeleeCombatActor(actor, dt, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    elapsed += dt;
  }
}
function pause(context) {
  const { mode, engine, actor } = context;
  const before = JSON.stringify({ actor, hp: hp(context.targets), queue: engine.actionQueue, projectiles: engine.projectiles });
  if (mode === 'rpg') engine.setPaused(true);
  for (let i = 0; i < 120; i++) {
    if (mode === 'rpg') engine.update();
    else if (mode === 'fighter') { engine.updateActions(0); engine.updateProjectiles(0); }
    else tickMeleeCombatActor(actor, 0, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
  }
  if (mode === 'rpg') engine.setPaused(false);
  assert.equal(JSON.stringify({ actor, hp: hp(context.targets), queue: engine.actionQueue, projectiles: engine.projectiles }), before);
}
const recorder = () => {
  const calls = [], stack = []; let properties = { globalAlpha: 0.7, lineWidth: 9, strokeStyle: '#123456', fillStyle: '#654321' };
  const initial = { ...properties };
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key in properties) return properties[key];
      if (key === 'save') return () => { stack.push({ ...properties }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); properties = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { args.filter(arg => typeof arg === 'number').forEach(arg => assert.ok(Number.isFinite(arg), String(key))); calls.push([key, ...args]); };
    },
    set(_target, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value), String(key)); properties[key] = value; calls.push(['set', key, value]); return true; }
  });
  return { ctx, calls, assertBalanced: () => { assert.equal(stack.length, 0); assert.deepEqual(properties, initial); } };
};
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?native-wave5'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?native-wave5'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?native-wave5'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ getCharacterAnimationFrame } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  ({ getHeroSpriteSheetSrc } = await vite.ssrLoadModule('/src/game/spriteAssets.js'));
  ({ getSummonAnimationAssets, resolveSummonAnimationAsset, getSummonAnimationFrame } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

const nativeIds = ['boruto_uzumaki', 'sarada_uchiha', 'mitsuki_boruto', 'masterchief', 'johnson', 'arbiter', 'leon', 'jill', 'rebecca_chambers', 'doomslayer', 'doom_marine_classic', 'solbadguy', 'ky', 'arca_mirelle', 'arca_bastion'];
const offensiveIds = nativeIds.filter(id => id !== 'rebecca_chambers');

for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`${mode} ${side} Wave5 supers spend100 once and apply one authoritative impact per chosen opponent through pause`, () => {
    for (const id of offensiveIds) {
      const context = make(mode, side, id), { engine, actor, targets } = context;
      const original = hp(targets), hits = [], method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
      engine[method] = (source, target, ...args) => { if (source === actor && targets.includes(target)) hits.push(target); return apply(source, target, ...args); };
      const profile = resolveMeleeSuper(actor);
      const expected = mode === 'melee' ? engine.getMeleeSuperTargets(actor, profile, context.facing) : mode === 'fighter' ? [targets[0]] : null;
      setMeter(context, 99); assert.equal(commit(context), false, id); assert.equal(meter(context), 99);
      setMeter(context, 100); assert.equal(commit(context, profile.shape === 'single' ? 1 : 0), true, id);
      assert.equal(meter(context), 0); assert.equal(commit(context), false);
      advance(context, 0.1); assert.deepEqual(hp(targets), original, `${id}: damage before windup`); pause(context);
      advance(context, 2);
      const chosen = mode === 'rpg' ? targets.filter(target => context.expectedTargetIds.includes(target.battleId)) : expected;
      assert.ok(chosen.length > 0, id); assert.equal(new Set(hits).size, hits.length, `${id}: visual effects created repeated damage`);
      assert.deepEqual(new Set(hits), new Set(chosen), id);
      targets.forEach((target, i) => assert.equal(target.currentHp < original[i], chosen.includes(target), id));
      const after = hp(targets); advance(context, 2); assert.deepEqual(hp(targets), after, `${id}: delayed second impact`);
    }
  });
  test(`${mode} ${side} First Aid heals its allied patient once and never damages or heals an opponent`, () => {
    const context = make(mode, side, 'rebecca_chambers', true), { actor, allies, targets, engine } = context;
    allies[1].currentHp = allies[1].maxHp * 0.2;
    const original = hp([...allies, ...targets]), patient = allies[1], profile = resolveMeleeSuper(actor);
    let damage = 0; const method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
    engine[method] = (...args) => { damage++; return apply(...args); };
    assert.equal(profile.effect, 'heal'); assert.equal(profile.targetSide, 'ally');
    assert.equal(commit(context), true); assert.equal(meter(context), 0); advance(context, 0.1); pause(context); advance(context, 1.2);
    assert.equal(patient.currentHp, original[1] + patient.maxHp * profile.healRatio);
    assert.equal(actor.currentHp, original[0]); assert.deepEqual(hp(targets), original.slice(allies.length)); assert.equal(damage, 0);
    const healed = patient.currentHp; advance(context, 2); assert.equal(patient.currentHp, healed);
  });
}

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`${mode} ${side} Energy Sword, Sarada Chidori, Tyrant Rave and Ride the Lightning retain contact range and committed facing`, () => {
  for (const id of ['arbiter', 'sarada_uchiha', 'solbadguy', 'ky']) for (const scenario of ['behind', 'range', 'height']) {
    const context = make(mode, side, id), { actor, targets, facing } = context, profile = resolveMeleeSuper(actor);
    assert.equal(profile.delivery, 'melee'); assert.equal(commit(context), true);
    targets.forEach((target, index) => {
      target.x = actor.x + facing * (scenario === 'behind' ? -120 - index * 10 : scenario === 'range' ? profile.range + 150 + index * 10 : 100 + index * 10);
      if (scenario === 'height') target.y -= 220;
    });
    const original = hp(targets); advance(context, 3); assert.deepEqual(hp(targets), original, `${id}:${scenario}`); assert.equal(meter(context), 0);
  }
});

const visualOptions = (id, progress, facing = 1) => {
  const actor = { ...hero(id), x: 400, y: 350, currentHp: 1000, state: 'special' }, profile = resolveMeleeSuper(actor);
  return { actor, profile, action: { duration: profile.duration, elapsed: progress * profile.duration, hitAt: profile.hitAt, facing },
    target: { x: 400 + facing * 180, y: 350, currentHp: 1000 }, height: 100 };
};
const geometry = calls => calls.filter(call => ['moveTo', 'lineTo', 'ellipse', 'arc', 'quadraticCurveTo', 'fillRect'].includes(call[0]));

test('all15 Wave5 visual identities require exact source, universe, name and effect and never mutate gameplay or canvas', () => {
  for (const id of nativeIds) for (const facing of [1, -1]) for (const progress of [0.2, 0.55, 0.9]) {
    const options = visualOptions(id, progress, facing), original = JSON.stringify(options), profile = options.profile;
    assert.equal(supportsNativeSuperWave5(profile), true, id);
    const state = getNativeSuperVisualStateWave5(options); assert.ok(state, id); assert.equal(state.family, 'native-wave5');
    assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    const first = recorder(), paused = recorder();
    assert.equal(drawNativeSuperVisualsWave5(first.ctx, state), true);
    assert.deepEqual(getCharacterSuperVisualState(options), state); assert.equal(drawCharacterSuperVisuals(paused.ctx, getCharacterSuperVisualState(options)), true);
    assert.deepEqual(paused.calls, first.calls); first.assertBalanced(); paused.assertBalanced(); assert.equal(JSON.stringify(options), original);
    assert.deepEqual(getNativeSuperVisualStateWave5({ ...options, actor: { ...options.actor, id: 'local-alias', sourceHeroId: id } }), state);
    for (const alteration of [
      { ...options, actor: { ...options.actor, id: 'unrelated' } },
      { ...options, actor: { ...options.actor, sourceHeroId: 'unrelated' } },
      { ...options, actor: { ...options.actor, universe: 'Wrong universe' } },
      { ...options, profile: { ...profile, sourceHeroId: 'unrelated' } },
      { ...options, profile: { ...profile, universe: 'Wrong universe' } },
      { ...options, profile: { ...profile, name: 'Generic burst' } },
      { ...options, profile: { ...profile, effect: id === 'rebecca_chambers' ? 'damage' : 'heal' } }
    ]) assert.equal(getNativeSuperVisualStateWave5(alteration), null, id);
  }
  assert.equal(drawNativeSuperVisualsWave5(recorder().ctx, null), false);
});

test('Wave5 body approaches remain finite cosmetic offsets with no physical coordinates, clock or HP mutation', () => {
  for (const id of nativeIds) for (const facing of [1, -1]) {
    const options = visualOptions(id, 0.5, facing), before = JSON.stringify(options);
    const profile = options.profile, impact = profile.hitAt / profile.duration;
    for (const progress of [0, impact / 2, impact, 0.8, 1]) {
      const motion = sampleNativeSuperMotionWave5({ heroId: id, universe: profile.universe, phase: 'super', progress, impactProgress: impact, height: 100 });
      assert.equal(motion.y, 0); assert.ok(motion.x >= 0 && motion.x <= 65);
      if (['arbiter', 'sarada_uchiha', 'solbadguy', 'ky'].includes(id) && progress > 0 && progress < 1) assert.ok(motion.x > 0);
      else assert.equal(motion.x, 0);
      assert.deepEqual(sampleNativeSuperMotionWave5({ heroId: id, universe: 'Wrong universe', phase: 'super', progress, height: 100 }), { x: 0, y: 0 });
    }
    assert.equal(JSON.stringify(options), before);
  }
});

test('Vanishing Rasengan hides in flight, Mitsuki has2 winding strands, and contact motifs cannot become enemy-following rays', () => {
  for (const facing of [1, -1]) {
    const boruto = visualOptions('boruto_uzumaki', 0, facing), impact = boruto.profile.hitAt / boruto.profile.duration;
    for (const [fraction, visible] of [[0.3, true], [0.8, false], [0.99, true]]) {
      boruto.action.elapsed = boruto.action.hitAt * fraction; const recorded = recorder();
      drawNativeSuperVisualsWave5(recorded.ctx, getNativeSuperVisualStateWave5(boruto));
      assert.equal(recorded.calls.some(call => call[0] === 'ellipse'), visible); recorded.assertBalanced();
    }
    assert.ok(impact > 0);
    const snake = visualOptions('mitsuki_boruto', 0.6, facing), winding = recorder();
    drawNativeSuperVisualsWave5(winding.ctx, getNativeSuperVisualStateWave5(snake));
    assert.equal(winding.calls.filter(call => call[0] === 'lineTo').length, 64);
    assert.equal(winding.calls.filter(call => call[0] === 'moveTo').length, 2);
    for (const id of ['arbiter', 'sarada_uchiha', 'solbadguy', 'ky']) {
      const options = visualOptions(id, 0.6, facing), first = recorder(), moved = recorder();
      drawNativeSuperVisualsWave5(first.ctx, getNativeSuperVisualStateWave5(options));
      drawNativeSuperVisualsWave5(moved.ctx, getNativeSuperVisualStateWave5({ ...options, target: { x: options.actor.x - facing * 800, y: 20 } }));
      assert.deepEqual(geometry(first.calls), geometry(moved.calls), id); first.assertBalanced(); moved.assertBalanced();
    }
  }
});

for (const side of ['player', 'opponent']) test(`RPG ${side} Leon's human weapons never infect, while an explicit infectious witness still does`, () => {
  for (const slot of ['simple', 'secondary', 'special']) {
    const context = make('rpg', side, 'leon'), { engine, actor, targets, engineSide } = context;
    const original = hp(targets);
    assert.equal(engine.beginTargeting(actor, slot, engineSide), true);
    if (engine.getTargetingState().shape === 'single') assert.equal(engine.selectTarget(targets[0].battleId), true);
    assert.equal(engine.confirmTargeting(), true); advance(context, 1.5);
    assert.ok(targets[0].currentHp < original[0], slot);
    targets.forEach(target => assert.equal(target.statusEffects.infected, 0, slot));
  }
  const witness = make('rpg', side, 'leon'), { actor, engine, engineSide, targets } = witness;
  actor.id = 'explicit-infection-witness'; actor.universe = 'Status witness'; actor.sourceHeroId = 'explicit-infection-witness';
  actor.simple = { name: 'Declared infectious contact', type: 'melee', dmg: 1.5, statusEffect: 'infected', targeting: { effect: 'damage', delivery: 'melee', shape: 'single', targetSide: 'enemy', range: 500 } };
  assert.equal(engine.beginTargeting(actor, 'simple', engineSide), true); assert.equal(engine.selectTarget(targets[0].battleId), true); assert.equal(engine.confirmTargeting(), true);
  advance(witness, 0.5); assert.ok(targets[0].statusEffects.infected > 0, 'the fix removed explicit infection metadata globally');
});

test('Ifrit16 sampler prepares attack0/1 before impact,2 exactly at impact and3 after, with4 real phase rows and no mutation', () => {
  const scene = { tick: 0, durationTicks: 216, impactTick: 116, choreography: { travelTicks: 30 } };
  const asset = { id: 'ff7-ifrit-hellfire-16', key: 'Final Fantasy VII::Ifrit::Hellfire', rows: 4, sheet: '/ifrit16.png',
    phases: Object.fromEntries(['arrival', 'preparation', 'attack', 'recovery'].map((phase, row) => [phase, { row, frames: 4 }])) };
  const choreography = { arrivalEndTick: 38, returnStartTick: 168 };
  for (const [row, ticks] of [[0, [0, 10, 20, 30]], [1, [38, 50, 62, 74]], [2, [86, 110, 116, 151]], [3, [169, 181, 193, 216]]]) for (const [col, tick] of ticks.entries()) {
    scene.tick = tick; const before = JSON.stringify({ scene, asset, choreography });
    const frame = sampleSummonAnimationFrame(scene, asset, choreography); assert.equal(frame.row, row); assert.equal(frame.col, col);
    assert.equal(frame.index, row * 4 + col); assert.equal(frame.visualOnly, true); assert.equal(frame.source1to1Verified, false);
    assert.deepEqual(sampleSummonAnimationFrame(scene, asset, choreography), frame); assert.equal(JSON.stringify({ scene, asset, choreography }), before);
  }
  scene.tick = 115; assert.equal(sampleSummonAnimationFrame(scene, asset, choreography).col, 1);
  scene.tick = 116; assert.equal(sampleSummonAnimationFrame(scene, asset, choreography).col, 2);
  assert.equal(sampleSummonAnimationFrame(scene, null, choreography), null);
});

for (const side of ['player', 'opponent']) test(`Fighter ${side} Rebecca and Luna keep their committed wounded ally anchor after healing and fall back to self without a patient`, () => {
  for (const id of ['rebecca_chambers', 'lunafreya_ff15']) for (const hasPatient of [true, false]) {
    const context = make('fighter', side, id, hasPatient), { engine, actor, allies, targets } = context;
    const patient = hasPatient ? allies[1] : actor;
    if (hasPatient) patient.currentHp = patient.maxHp * 0.85;
    const enemies = hp(targets);
    assert.equal(commit(context), true); const action = actor.action;
    assert.equal(action.visualSupportTargetId, patient.id);
    for (const elapsed of [0.1, action.hitAt + 0.01]) {
      advance(context, elapsed - action.elapsed);
      const before = JSON.stringify({ actor, allies, targets, projectiles: engine.projectiles, stats: engine.stats });
      const actual = recorder(), expected = recorder();
      engine.drawPersonalSuper(actual.ctx, actor);
      drawCharacterSuperVisuals(expected.ctx, getCharacterSuperVisualState({ actor, profile: action.identity, action, target: patient, height: 142 }));
      assert.deepEqual(geometry(actual.calls), geometry(expected.calls)); actual.assertBalanced(); expected.assertBalanced();
      assert.equal(JSON.stringify({ actor, allies, targets, projectiles: engine.projectiles, stats: engine.stats }), before);
      assert.deepEqual(hp(targets), enemies);
    }
    assert.equal(patient.currentHp, patient.maxHp);
    assert.equal(action.visualSupportTargetId, patient.id);
  }
});

const withReadyNativeImages = callback => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 2048;
    set src(value) { this._src = value; this.currentSrc = value; this.naturalHeight = /summon-animations-wave5|combat-character-corrections-wave5/.test(value) ? 1024 : 2048; this.onload?.(); }
    get src() { return this._src; }
  };
  try { callback(); } finally { globalThis.Image = OriginalImage; }
};

test('native Wave5 contact bodies move only in renderer projection and return to their physical position', () => withReadyNativeImages(() => {
  for (const id of ['arbiter', 'sarada_uchiha', 'solbadguy', 'ky']) for (const facing of [1, -1]) {
    const profile = resolveMeleeSuper(hero(id)), impact = profile.hitAt / profile.duration;
    for (const progress of [0, impact / 2, impact, 0.8, 1]) {
      const actor = { ...hero(id), x: 400, y: 350, currentHp: 1000, vx: 0, vy: 0, state: 'special', presentationPhase: 'super', presentationProgress: progress, presentationImpactProgress: impact };
      const options = { heroId: id, universe: actor.universe, phase: 'super', progress, impactProgress: impact, height: 100 };
      const motion = sampleNativeSuperMotionWave5(options); assert.deepEqual(sampleCharacterSuperMotion(options), motion);
      const snapshot = JSON.stringify(actor), originalPhysical = physical(actor), recorded = recorder();
      drawPixelSprite(recorded.ctx, actor.x, actor.y, actor, 1000, facing, 100, 'melee');
      assert.ok(recorded.calls.some(call => call[0] === 'translate' && call[1] === actor.x + motion.x * facing && call[2] === actor.y));
      const native = recorded.calls.find(call => call[0] === 'drawImage'); assert.ok(native);
      assert.match(native[1].src, new RegExp(`/combat-character-animations-wave5/${id}\\.png$`));
      const frame = getCharacterAnimationFrame(actor); assert.equal(native[2], frame.col * 256); assert.equal(native[3], 7 * 256);
      assert.equal(JSON.stringify(actor), snapshot); assert.deepEqual(physical(actor), originalPhysical); recorded.assertBalanced();
    }
  }
}));

const costs = actor => ({ atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed });
const startIfrit = context => {
  const { engine, actor, engineSide } = context;
  assert.equal(engine.summon(actor, engineSide), true); assert.equal(engine.confirmTargeting(), true);
  const scene = engine.activeSummon; assert.ok(scene); assert.equal(scene.descriptor.entityName, 'Ifrit'); assert.equal(scene.descriptor.action.name, 'Hellfire');
  return scene;
};

for (const side of ['player', 'opponent']) test(`RPG ${side} Ifrit16 renders all16 native cells on the authoritative clock with one charge, one impact and paused queues`, () => withReadyNativeImages(() => {
  const context = make('rpg', side, 'cloud_ff7'), { engine, actor, engineSide, targets } = context;
  const originalCosts = costs(actor), originalHp = hp(targets);
  assert.equal(engine.summon(actor, engineSide), true); assert.deepEqual(costs(actor), originalCosts);
  assert.equal(engine.cancelTargeting(), true); assert.deepEqual(costs(actor), originalCosts);
  const scene = startIfrit(context); assert.deepEqual(costs(actor), { atb: 0, charge: 0, used: true });
  const asset = resolveSummonAnimationAsset(scene.descriptor); assert.ok(asset); assert.equal(asset.frames, 16); assert.equal(asset.normalization.baseline, 244);
  const state0 = engine.getSummonSceneState(), timing = state0.entityAnimationFrame; assert.ok(timing); assert.equal(state0.entityAnimationAssetId, asset.id);
  let impacts = 0, queued = 0; const apply = engine.applyRpgImpact.bind(engine);
  engine.applyRpgImpact = (source, ...args) => { if (source === actor) impacts++; return apply(source, ...args); };
  engine.scheduleAction(() => { queued++; }, 1000); const queueTicks = engine.actionQueue[0].ticks;
  const { arrivalEndTick: arrival, attackStartTick: attack, impactTick: impact, returnStartTick: returning } = timing, duration = scene.durationTicks;
  const samples = [
    ...Array.from({ length: 4 }, (_, col) => ({ row: 0, col, tick: Math.floor(arrival * (col + 0.1) / 4) })),
    ...Array.from({ length: 4 }, (_, col) => ({ row: 1, col, tick: Math.floor(arrival + (attack - arrival) * (col + 0.1) / 4) })),
    { row: 2, col: 0, tick: attack }, { row: 2, col: 1, tick: Math.floor(attack + (impact - attack) * 0.8) },
    { row: 2, col: 2, tick: impact }, { row: 2, col: 3, tick: Math.ceil(impact + (returning - impact) * 0.8) },
    ...Array.from({ length: 4 }, (_, col) => ({ row: 3, col, tick: Math.max(returning + 1, Math.floor(returning + (duration - returning) * (col + 0.15) / 4)) }))
  ];
  for (const sample of samples) {
    advance(context, (sample.tick - scene.tick) / 60);
    const view = engine.getSummonSceneState(), frame = view.entityAnimationFrame;
    assert.equal(frame.row, sample.row); assert.equal(frame.col, sample.col);
    assert.deepEqual(frame, getSummonAnimationFrame(scene, view.choreography));
    assert.equal(impacts, sample.tick >= impact ? 1 : 0); assert.equal(queued, 0); assert.equal(engine.actionQueue[0].ticks, queueTicks);
    const snapshot = JSON.stringify({ actor, targets, tick: scene.tick, view, queue: engine.actionQueue });
    const recorded = recorder(); engine.drawSummonScene(recorded.ctx); recorded.assertBalanced();
    const native = recorded.calls.find(call => call[0] === 'drawImage'); assert.ok(native);
    assert.equal(native[1].src, asset.sheet); assert.equal(native[2], sample.col * 256); assert.equal(native[3], sample.row * 256);
    assert.equal(native[4], 256); assert.equal(native[5], 256);
    assert.equal(JSON.stringify({ actor, targets, tick: scene.tick, view: engine.getSummonSceneState(), queue: engine.actionQueue }), snapshot);
    engine.setPaused(true); for (let i = 0; i < 30; i++) engine.update();
    const paused = recorder(); engine.drawSummonScene(paused.ctx); assert.deepEqual(paused.calls, recorded.calls); paused.assertBalanced(); engine.setPaused(false);
    assert.equal(JSON.stringify({ actor, targets, tick: scene.tick, view: engine.getSummonSceneState(), queue: engine.actionQueue }), snapshot);
  }
  const after = hp(targets); assert.ok(after.every((value, index) => value < originalHp[index]));
  advance(context, (duration - scene.tick) / 60); assert.equal(engine.activeSummon, null); assert.equal(actor.actionPending, false); assert.equal(impacts, 1);
  assert.equal(actor.x, actor.homeX); assert.equal(actor.y, actor.homeY); assert.equal(queued, 0);
  advance(context, 1.1); assert.deepEqual(hp(targets), after); assert.equal(impacts, 1); assert.equal(queued, 1);
  actor.atb = 100; actor.specialCharge = 100; assert.equal(engine.summon(actor, engineSide), false, 'a used invocation spent a second charge');
}));

for (const side of ['player', 'opponent']) test(`RPG ${side} Ifrit keeps confirmed target identities after death and cannot fire after interruption or disposal`, () => {
  const context = make('rpg', side, 'cloud_ff7'), { engine, targets } = context;
  targets[2].currentHp = 0; targets[2].state = 'dead';
  const scene = startIfrit(context), ids = engine.getSummonSceneState().targetIds;
  assert.deepEqual(ids, targets.slice(0, 2).map(target => target.battleId));
  targets[1].currentHp = 0; targets[1].state = 'dead'; targets[2].currentHp = targets[2].maxHp; targets[2].state = 'idle';
  const untouched = targets[2].currentHp; advance(context, scene.impactTick / 60);
  assert.deepEqual(engine.getSummonSceneState().targetIds, ids); assert.equal(targets[1].currentHp, 0); assert.equal(targets[2].currentHp, untouched);
  assert.ok(targets[0].currentHp < targets[0].maxHp);
  for (const end of ['dispose', 'gameOver', 'dead-caller']) {
    const interrupted = make('rpg', side, 'cloud_ff7'), e = interrupted.engine;
    startIfrit(interrupted); advance(interrupted, 0.1); const before = hp(interrupted.targets);
    if (end === 'dispose') e.dispose(); else if (end === 'gameOver') e.gameOver = true;
    else { interrupted.actor.currentHp = 0; interrupted.actor.state = 'dead'; }
    advance(interrupted, 6); assert.equal(e.activeSummon, null); assert.equal(interrupted.actor.actionPending, false); assert.equal(e.actionQueue.length, 0);
    assert.deepEqual(hp(interrupted.targets), before); assert.equal(interrupted.actor.specialCharge, 0);
  }
});

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
async function checkNativeGrid(entry, rows) {
  const bytes = await readFile(new URL(`../public${entry.sheet}`, import.meta.url)); assert.equal(sha256(bytes), entry.sha256);
  assert.equal(sha256(await readFile(new URL(`../${entry.sourceImage}`, import.meta.url))), entry.sourceImageSha256);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, rows * 256); assert.equal(info.channels, 4);
  const hashes = [];
  for (let row = 0; row < rows; row++) for (let col = 0; col < 4; col++) {
    const visible = Buffer.alloc(256 * 256 * 4); let pixels = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
      if (alpha > 0) data.copy(visible, (y * 256 + x) * 4, offset, offset + 4);
      if (alpha > 4) pixels++;
      if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, `${entry.id}:${row}:${col}: nontransparent margin`);
    }
    assert.ok(pixels > 300 && pixels < 45000, `${entry.id}:${row}:${col}: empty pose or opaque panel`); hashes.push(sha256(visible));
  }
  assert.equal(new Set(hashes).size, rows * 4, 'duplicated native pose pixels');
}

test('Ifrit native16 asset is strict and pixel-verified while Pelican retains the legacy4 fallback', async () => {
  const assets = getSummonAnimationAssets().filter(asset => asset.key === 'Final Fantasy VII::Ifrit::Hellfire'); assert.equal(assets.length, 1);
  const asset = assets[0]; assert.equal(asset.key, 'Final Fantasy VII::Ifrit::Hellfire'); assert.equal(asset.frames, 16);
  await checkNativeGrid(asset, 4);
  withReadyNativeImages(() => {
    const context = make('rpg', 'player', 'cloud_ff7'), scene = startIfrit(context), descriptor = scene.descriptor;
    assert.equal(resolveSummonAnimationAsset(descriptor), asset);
    for (const changed of [
      { ...descriptor, universe: 'Wrong universe' }, { ...descriptor, entityName: 'Shiva' },
      { ...descriptor, action: { ...descriptor.action, name: 'Other action' } }, { ...descriptor, kind: 'reinforcement' },
      { ...descriptor, entityRender: { ...descriptor.entityRender, asset: { ...descriptor.entityRender.asset, key: 'wrong' } } }
    ]) assert.equal(resolveSummonAnimationAsset(changed), null);
    const state = context.engine.getSummonSceneState();
    assert.equal(getSummonAnimationFrame({ ...scene, actor: { ...scene.actor, universe: 'Wrong universe' } }, state.choreography), null);
    const legacy = make('rpg', 'player', 'masterchief'); assert.equal(legacy.engine.summon(legacy.actor), true); assert.equal(legacy.engine.confirmTargeting(), true);
    const legacyScene = legacy.engine.activeSummon, view = legacy.engine.getSummonSceneState();
    assert.equal(legacyScene.descriptor.entityName, 'D77-TC Pelican'); assert.equal(resolveSummonAnimationAsset(legacyScene.descriptor), null);
    assert.equal(view.entityAnimationFrame, null); assert.equal(view.entityAnimationAssetId, null); assert.ok(view.entityFrame.index >= 0 && view.entityFrame.index < 4);
    const drawn = recorder(); legacy.engine.drawSummonScene(drawn.ctx); drawn.assertBalanced();
    const native = drawn.calls.find(call => call[0] === 'drawImage'); assert.ok(native); assert.equal(native[1].src, legacyScene.descriptor.entityRender.asset.sheet);
    assert.equal(native[3], 0);
  });
});

for (const id of ['leon', 'solbadguy', 'ky']) test(`${id} Wave5 corrected base loads and draws all16 verified native poses in both facings`, async () => {
  const registry = JSON.parse(await readFile(new URL('../src/game/combat/characterSpriteCorrectionsWave5.generated.json', import.meta.url), 'utf8'));
  const entry = registry.entries.find(item => item.heroId === id); assert.ok(entry); assert.equal(entry.frames, 16); await checkNativeGrid(entry, 4);
  withReadyNativeImages(() => {
    for (const context of ['rpg', 'melee']) for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) for (let col = 0; col < 4; col++) for (const facing of [1, -1]) {
      const timeline = col * 10 + 0.5, actor = { ...hero(id), x: 400, y: 350, state, currentHp: 1000, action: null, stateElapsed: timeline / 60, facing };
      assert.equal(getHeroSpriteSheetSrc(actor, context), entry.sheet);
      const snapshot = JSON.stringify(actor), drawn = recorder(); drawPixelSprite(drawn.ctx, actor.x, actor.y, actor, timeline, facing, 100, context);
      const native = drawn.calls.find(call => call[0] === 'drawImage'); assert.ok(native); assert.equal(native[1].src, entry.sheet);
      assert.equal(native[2], col * 256); assert.equal(native[3], row * 256); assert.equal(native[4], 256); assert.equal(native[5], 256);
      assert.ok(drawn.calls.some(call => call[0] === 'scale' && call[1] === facing && call[2] === 1));
      assert.equal(JSON.stringify(actor), snapshot); drawn.assertBalanced();
    }
  });
});

