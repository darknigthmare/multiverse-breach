import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createServer } from 'vite';
import { combatBuffSource, getCharacterFormFrame } from '../src/game/combat/characterFormState.js';
import { getNativeSuperVisualStateWave4, drawNativeSuperVisualsWave4 } from '../src/game/combat/nativeSuperVisualsWave4.js';
import { getCharacterSuperVisualState, drawCharacterSuperVisuals } from '../src/game/combat/characterSuperVisuals.js';

let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, drawPixelSprite, getCharacterAnimationFrame, getHeroSpriteSheetSrc;
const engines = [], noop = () => {}, particles = { add: noop };
const dummy = id => ({
  id, name: id, universe: 'Party super regression', category: 'test', weaponType: 'melee',
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
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?forms-wave4'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?forms-wave4'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?forms-wave4'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ getCharacterAnimationFrame } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  ({ getHeroSpriteSheetSrc } = await vite.ssrLoadModule('/src/game/spriteAssets.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

const buff = context => context.mode === 'rpg'
  ? { remaining: context.actor.rpgBuffTicks / 60, source: context.actor.rpgBuffSource, multiplier: context.actor.rpgBuffMultiplier }
  : context.mode === 'fighter'
    ? { remaining: context.actor.superBuffSeconds, source: context.actor.superBuffSource, multiplier: context.actor.superBuffMultiplier }
    : context.actor.meleeSuperSupport;
const profileFor = context => resolveMeleeSuper(context.actor);
const form = actor => getCharacterFormFrame(actor, { elapsedSeconds: 19 });

test('Part I techniques retain their authored identity and Sakura supports only herself', () => {
  for (const [id, name] of [['naruto_uzumaki_young', 'Rasengan'], ['sasuke_uchiha_young', 'Chidori']]) {
    const profile = resolveMeleeSuper(hero(id));
    assert.equal(profile.universe, 'Naruto'); assert.equal(profile.name, name);
    assert.equal(profile.effect, 'damage'); assert.equal(profile.delivery, 'melee');
    assert.equal(profile.shape, 'single'); assert.equal(profile.maxTargets, 1);
  }
  for (const id of ['sakura_haruno_young', 'vincent_ff7']) {
    const profile = resolveMeleeSuper(hero(id));
    assert.equal(profile.effect, 'buff'); assert.equal(profile.delivery, 'support');
    assert.equal(profile.targetSide, 'self'); assert.equal(profile.shape, 'single');
  }
});

for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`${mode} ${side} Rasengan and Chidori spend100 once and strike one selected close opponent once`, () => {
    for (const id of ['naruto_uzumaki_young', 'sasuke_uchiha_young']) {
      const context = make(mode, side, id), { actor, targets, engine } = context;
      const original = hp(targets), hits = [], method = mode === 'fighter' ? 'applyHit' : 'applyDamage';
      const apply = engine[method].bind(engine);
      engine[method] = (source, target, ...rest) => { if (source === actor && targets.includes(target)) hits.push(target); return apply(source, target, ...rest); };
      setMeter(context, 99); assert.equal(commit(context), false); assert.equal(meter(context), 99);
      setMeter(context, 100); assert.equal(commit(context, mode === 'rpg' ? 1 : 0), true);
      assert.equal(meter(context), 0); assert.equal(commit(context), false);
      advance(context, 0.1); assert.deepEqual(hp(targets), original); pause(context);
      advance(context, 2);
      const chosen = targets[mode === 'rpg' ? 1 : 0];
      assert.deepEqual(hits, [chosen]);
      targets.forEach((target, index) => assert.equal(target.currentHp < original[index], target === chosen));
      const result = hp(targets); advance(context, 2); assert.deepEqual(hp(targets), result);
    }
  });
  test(`${mode} ${side} Bunshin creates only the source self buff with no ally healing or hostile impact`, () => {
    const context = make(mode, side, 'sakura_haruno_young', true), { actor, allies, targets, engine } = context;
    actor.currentHp = actor.maxHp * 0.6; allies[1].currentHp = allies[1].maxHp * 0.4;
    const before = hp([...allies, ...targets]);
    let damage = 0; const method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
    engine[method] = (...args) => { damage++; return apply(...args); };
    assert.equal(commit(context), true); assert.equal(meter(context), 0);
    advance(context, 0.1); assert.ok(!buff(context)?.remaining); pause(context); advance(context, 1.1);
    assert.deepEqual(hp([...allies, ...targets]), before); assert.equal(damage, 0);
    assert.ok(buff(context).remaining > 0); assert.equal(buff(context).multiplier ?? buff(context).buffMultiplier, profileFor(context).buffMultiplier);
    assert.deepEqual(buff(context).source, { sourceHeroId: 'sakura_haruno_young', universe: 'Naruto', name: 'Bunshin no Jutsu', slot: 'special' });
    assert.ok(!allies[1].rpgBuffTicks && !allies[1].superBuffSeconds && !allies[1].meleeSuperSupport);
    assert.equal(form(actor), null, 'an illusion self buff became Vincent’s physical form');
  });
  test(`${mode} ${side} Chaos starts at its single source impact, pauses and expires on the existing buff clock`, () => {
    const context = make(mode, side, 'vincent_ff7', true), { actor, allies, targets } = context;
    const original = hp([...allies, ...targets]);
    setMeter(context, 99); assert.equal(commit(context), false); assert.equal(meter(context), 99); assert.equal(form(actor), null);
    setMeter(context, 100); assert.equal(commit(context), true); assert.equal(meter(context), 0); assert.equal(commit(context), false);
    advance(context, 0.1); assert.equal(form(actor), null); pause(context);
    let impactBudget = 100;
    while (!buff(context)?.remaining && impactBudget-- > 0) advance(context, 1 / 60);
    assert.ok(impactBudget > 0, 'Chaos never reached its authoritative source buff impact');
    const impactView = mode === 'rpg' ? context.engine.getRpgPresentationActor(actor) : actor;
    assert.equal(form(impactView)?.state, 'idle', 'the support transformation super selected an offensive attack body row');
    assert.equal(form({ ...impactView, state: 'hit' })?.state, 'hit', 'support super presentation overrode a real hit reaction');
    advance(context, 0.8);
    assert.ok(buff(context).remaining > 0); assert.equal(buff(context).multiplier ?? buff(context).buffMultiplier, profileFor(context).buffMultiplier);
    assert.deepEqual(buff(context).source, { sourceHeroId: 'vincent_ff7', universe: 'Final Fantasy VII', name: 'Chaos', slot: 'special' });
    assert.equal(form(actor)?.id, 'vincent-chaos'); assert.equal(form(actor).presentationOnly, false);
    assert.deepEqual(hp([...allies, ...targets]), original); assert.equal(form(allies[1]), null);
    pause(context);
    if (mode === 'fighter') for (let i = 0; i < 400; i++) context.engine.updatePassive(1 / 60);
    else advance(context, 7);
    assert.equal(form(actor), null); assert.ok(!buff(context)?.remaining);
    assert.deepEqual(hp([...allies, ...targets]), original);
    const fresh = make(mode, side, 'vincent_ff7'); assert.equal(form(fresh.actor), null, 'fresh battle retained a previous buff or form');
  });
  test(`${mode} ${side} Chaos cannot survive a knockout or an interrupted startup`, () => {
    const interrupted = make(mode, side, 'vincent_ff7');
    assert.equal(commit(interrupted), true); advance(interrupted, 0.1);
    interrupted.actor.currentHp = 0; interrupted.actor.state = 'dead';
    advance(interrupted, 2); assert.equal(form(interrupted.actor), null); assert.ok(!buff(interrupted)?.remaining);
    const active = make(mode, side, 'vincent_ff7'); assert.equal(commit(active), true); advance(active, 1.1);
    assert.equal(form(active.actor)?.id, 'vincent-chaos');
    active.actor.currentHp = 0; active.actor.state = 'dead'; assert.equal(form(active.actor), null);
    if (mode === 'fighter') {
      active.engine.resetForNextRound();
      assert.equal(form(active.engine.getActive(active.engineSide)), null);
      assert.equal(active.engine.getActive(active.engineSide).superBuffSeconds, 0);
    }
  });
}

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`${mode} ${side} Part I contact supers preserve their committed facing, finite range and vertical reach`, () => {
  for (const id of ['naruto_uzumaki_young', 'sasuke_uchiha_young']) for (const scenario of ['behind', 'range', 'height']) {
    const context = make(mode, side, id), { actor, targets, facing } = context, profile = profileFor(context);
    assert.equal(commit(context), true);
    targets.forEach((target, index) => {
      target.x = actor.x + facing * (scenario === 'behind' ? -100 - index * 10 : scenario === 'range' ? profile.range + 100 + index * 10 : 100 + index * 10);
      if (scenario === 'height') target.y -= 220;
    });
    const original = hp(targets); advance(context, 3); assert.deepEqual(hp(targets), original, `${id}:${scenario}`);
  }
});

test('Chaos form accepts only its exact actor, source, special slot and living buff clock', () => {
  const actor = { ...hero('vincent_ff7'), currentHp: 100, state: 'idle', stateElapsed: 0 };
  const source = combatBuffSource(actor, resolveMeleeSuper(actor));
  assert.deepEqual(source, { sourceHeroId: 'vincent_ff7', universe: 'Final Fantasy VII', name: 'Chaos', slot: 'special' });
  for (const clock of ['melee', 'fighter', 'rpg']) {
    const unit = { ...actor };
    const set = value => {
      if (clock === 'melee') unit.meleeSuperSupport = { effect: 'buff', remaining: 5, source: value };
      else if (clock === 'fighter') { unit.superBuffSeconds = 5; unit.superBuffSource = value; }
      else { unit.rpgBuffTicks = 300; unit.rpgBuffSource = value; }
    };
    set(source); assert.equal(form(unit)?.id, 'vincent-chaos');
    for (const alteration of [{ sourceHeroId: 'cloud_ff7' }, { universe: 'Other universe' }, { name: 'Chaos imitation' }, { slot: 'secondary' }]) {
      set({ ...source, ...alteration }); assert.equal(form(unit), null);
    }
    set(source);
    for (const alteration of [{ id: 'cloud_ff7' }, { universe: 'Other universe' }, { currentHp: 0 }, { state: 'dead' }, { state: 'defeat' }]) assert.equal(form({ ...unit, ...alteration }), null);
    assert.equal(form({ ...unit, id: 'local-alias', sourceHeroId: 'vincent_ff7' })?.id, 'vincent-chaos');
    for (const phase of ['intro', 'outro', 'roundVictory', 'roundDefeat', 'victory', 'defeat']) assert.equal(form({ ...unit, presentationPhase: phase }), null);
    if (clock === 'melee') { unit.meleeSuperSupport.effect = 'guard'; assert.equal(form(unit), null); unit.meleeSuperSupport.remaining = 0; }
    if (clock === 'fighter') unit.superBuffSeconds = 0;
    if (clock === 'rpg') unit.rpgBuffTicks = 0;
    assert.equal(form(unit), null);
  }
});

test('Chaos finale projects four attack poses only inside its finite interval without applying a buff or changing any clock', () => {
  const actor = { ...hero('vincent_ff7'), currentHp: 100, state: 'victory', presentationPhase: 'fatality', rpgBuffTicks: 0, superBuffSeconds: 0, meleeSuperSupport: null };
  for (const [index, progress] of [0.29, 0.43, 0.57, 0.72].entries()) {
    actor.presentationProgress = progress; const before = JSON.stringify(actor);
    assert.deepEqual(form(actor), { id: 'vincent-chaos', state: 'attack', row: 2, col: index, progress: (progress - 0.28) / 0.54, presentationOnly: true });
    for (let i = 0; i < 100; i++) form(actor);
    assert.equal(JSON.stringify(actor), before);
  }
  for (const progress of [0, 0.279, 0.82, 1, 4]) { actor.presentationProgress = progress; assert.equal(form(actor), null); }
});

const nativeKinds = {
  redxiii_ff7: 'cosmo-flare', yuffie_ff7: 'creation-beam', vincent_ff7: 'chaos-transform',
  naruto_uzumaki_young: 'rasengan-contact', sasuke_uchiha_young: 'chidori-contact',
  sakura_haruno_young: 'clone-smoke', piccolo_dbz: 'spiral-beam', kakashi_war: 'ocular-distortion'
};
const visualOptions = (id, progress, facing) => {
  const actor = { ...hero(id), x: 600, y: 350, currentHp: 1000, state: 'special', stateTimer: 15 };
  const profile = resolveMeleeSuper(actor);
  return { actor, profile, action: { duration: profile.duration, elapsed: progress * profile.duration, hitAt: profile.hitAt, facing },
    target: { x: 600 + facing * 450, y: 350, currentHp: 1000 }, height: 100 };
};

test('all8 native Wave4 identities require their exact source and preserve canvas, clocks, HP and deterministic paused geometry', () => {
  for (const [id, kind] of Object.entries(nativeKinds)) for (const facing of [1, -1]) for (const progress of [0.15, 0.55, 0.85]) {
    const options = visualOptions(id, progress, facing), before = JSON.stringify(options);
    const state = getNativeSuperVisualStateWave4(options);
    assert.equal(state?.kind, kind); assert.equal(state.family, 'native-wave4');
    assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    assert.deepEqual(getCharacterSuperVisualState(options), state);
    const original = recorder(); assert.equal(drawNativeSuperVisualsWave4(original.ctx, state), true); original.assertBalanced();
    assert.ok(original.calls.some(call => call[0] === 'stroke'));
    const repeated = recorder(); assert.equal(drawCharacterSuperVisuals(repeated.ctx, getCharacterSuperVisualState(options)), true); repeated.assertBalanced();
    assert.deepEqual(repeated.calls, original.calls); assert.equal(JSON.stringify(options), before);
    assert.deepEqual(getNativeSuperVisualStateWave4({ ...options, actor: { ...options.actor, id: 'local-copy', sourceHeroId: id } }), state);
    for (const altered of [
      { ...options, actor: { ...options.actor, id: 'unrelated-character' } },
      { ...options, actor: { ...options.actor, sourceHeroId: 'unrelated-character' } },
      { ...options, actor: { ...options.actor, universe: 'Other universe' } },
      { ...options, profile: { ...options.profile, universe: 'Other universe' } },
      { ...options, profile: { ...options.profile, sourceHeroId: 'unrelated-character' } },
      { ...options, profile: { ...options.profile, name: 'Generic signature' } }
    ]) assert.equal(getNativeSuperVisualStateWave4(altered), null, id);
  }
  for (const id of ['sakura_haruno_young', 'vincent_ff7']) {
    const options = visualOptions(id, 0.55, 1);
    assert.equal(getNativeSuperVisualStateWave4({ ...options, profile: { ...options.profile, effect: 'damage' } }), null);
  }
  assert.equal(drawNativeSuperVisualsWave4(recorder().ctx, null), false);
});

test('Rasengan and Chidori stay attached to the hand while Bunshin smoke and Chaos aura stay beside their own actor', () => {
  for (const id of ['naruto_uzumaki_young', 'sasuke_uchiha_young', 'sakura_haruno_young', 'vincent_ff7']) for (const facing of [1, -1]) {
    const options = visualOptions(id, 0.55, facing), state = getNativeSuperVisualStateWave4(options), first = recorder();
    drawNativeSuperVisualsWave4(first.ctx, state); first.assertBalanced();
    const movedTarget = recorder(); drawNativeSuperVisualsWave4(movedTarget.ctx, getNativeSuperVisualStateWave4({ ...options, target: { x: options.actor.x - facing * 700, y: 40 } }));
    assert.deepEqual(movedTarget.calls, first.calls, `${id} acquired an enemy-following ranged effect`);
    assert.equal(first.calls.some(call => call[0] === 'drawImage'), false, 'the cosmetic helper replaced the native body or spawned an attacking clone');
    for (const call of first.calls) if (['moveTo', 'lineTo', 'ellipse'].includes(call[0])) assert.ok(Math.abs(call[1] - options.actor.x) < options.height * 0.8, `${id}: detached effect`);
    if (id === 'sakura_haruno_young') {
      assert.deepEqual(state.target, { x: options.actor.x, y: options.actor.y });
      assert.equal(first.calls.filter(call => call[0] === 'ellipse').length, 6);
      assert.equal(first.calls.some(call => call[0] === 'lineTo'), false, 'Bunshin acquired an offensive beam or slash');
    }
  }
});

test('Kamui distortion stays on the target with no eye-to-target ray; Piccolo keeps a finite beam and spiral', () => {
  for (const facing of [1, -1]) {
    const kamui = visualOptions('kakashi_war', 0.55, facing), recorded = recorder();
    drawNativeSuperVisualsWave4(recorded.ctx, getNativeSuperVisualStateWave4(kamui)); recorded.assertBalanced();
    assert.equal(recorded.calls.filter(call => call[0] === 'moveTo').length, 3);
    for (const call of recorded.calls) if (['moveTo', 'lineTo'].includes(call[0])) assert.ok(Math.abs(call[1] - kamui.target.x) < 60);
    const beam = visualOptions('piccolo_dbz', 0.6, facing), active = recorder();
    drawNativeSuperVisualsWave4(active.ctx, getNativeSuperVisualStateWave4(beam));
    assert.equal(active.calls.filter(call => call[0] === 'lineTo').length, 65, 'Piccolo lost the beam plus64 segment spiral');
    const ended = recorder(); beam.action.elapsed = beam.action.duration;
    drawNativeSuperVisualsWave4(ended.ctx, getNativeSuperVisualStateWave4(beam));
    assert.equal(ended.calls.some(call => call[0] === 'lineTo'), false); ended.assertBalanced();
  }
});

const withReadyNativeImages = callback => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 2048;
    set src(value) { this._src = value; this.currentSrc = value; this.naturalHeight = /chaos|combat-character-corrections-wave4/i.test(value) ? 1024 : 2048; this.onload?.(); }
    get src() { return this._src; }
  };
  try { callback(); } finally { globalThis.Image = OriginalImage; }
};

for (const side of ['player', 'opponent']) test(`Chaos native body ${side} uses its actual four state rows in all3 modes, with pure finite finale projection`, () => withReadyNativeImages(() => {
  for (const mode of ['rpg', 'melee', 'fighter']) {
    const context = make(mode, side, 'vincent_ff7'), { actor, facing } = context;
    assert.equal(commit(context), true); advance(context, 1.1); assert.equal(form(actor)?.id, 'vincent-chaos');
    const original = JSON.stringify(actor), originalPhysical = physical(actor);
    const states = [
      { state: 'idle', action: null, stateElapsed: 0.25 },
      { state: 'walk', action: null, stateElapsed: 0.25 },
      { state: 'attack', action: { type: 'light', duration: 1, elapsed: 0.6, hitAt: 0.4 } },
      { state: 'hit', action: null, stateElapsed: 0.25 }
    ];
    for (const [row, statePatch] of states.entries()) for (let col = 0; col < 4; col++) {
      const patch = { ...statePatch, rpgSpecialVisual: null, presentationPhase: null, stateElapsed: (col + 0.2) / (row === 1 ? 12 : 8),
        action: row === 2 ? { ...statePatch.action, elapsed: [0.1, 0.3, 0.6, 0.95][col] } : null };
      const view = { ...actor, ...patch }, expected = form(view), snapshot = JSON.stringify(view);
      assert.equal(expected.row, row); assert.equal(expected.col, col);
      const drawn = recorder(); drawPixelSprite(drawn.ctx, view.x, view.y, view, 9000, facing, 100, 'melee');
      const image = drawn.calls.find(call => call[0] === 'drawImage');
      assert.ok(image, `${mode}:${patch.state}: native form body was not drawn`);
      assert.match(image[1].src, /chaos[^/]*\.png$/i);
      assert.equal(image[2], expected.col * 256); assert.equal(image[3], row * 256);
      assert.equal(image[4], 256); assert.equal(image[5], 256);
      drawn.assertBalanced(); assert.equal(JSON.stringify(view), snapshot);
      const paused = recorder(); drawPixelSprite(paused.ctx, view.x, view.y, view, 9000, facing, 100, 'melee');
      assert.deepEqual(paused.calls, drawn.calls); paused.assertBalanced();
    }
    const humanColumns = [];
    for (const progress of [0, 0.075, 0.15, 0.225, 0.29, 0.43, 0.57, 0.72, 0.82, 1]) {
      const view = { ...actor, action: null, state: 'victory', presentationPhase: 'fatality', presentationProgress: progress,
        rpgBuffTicks: 0, superBuffSeconds: 0, meleeSuperSupport: null };
      const snapshot = JSON.stringify(view), expected = form(view), drawn = recorder();
      drawPixelSprite(drawn.ctx, view.x, view.y, view, 99000, facing, 100, 'melee');
      const image = drawn.calls.find(call => call[0] === 'drawImage'); assert.ok(image);
      if (expected) {
        assert.match(image[1].src, /chaos[^/]*\.png$/i); assert.equal(image[2], expected.col * 256); assert.equal(image[3], 2 * 256);
      } else {
        const human = getCharacterAnimationFrame(view); assert.ok(human);
        assert.doesNotMatch(image[1].src, /chaos[^/]*\.png$/i); assert.equal(image[2], human.col * 256); assert.equal(image[3], 4 * 256);
        if (progress < 0.28) humanColumns.push(human.col);
      }
      assert.equal(JSON.stringify(view), snapshot); drawn.assertBalanced();
    }
    assert.deepEqual(humanColumns, [0, 1, 2, 3], 'the Chaos phase cut off a human transformation preparation pose');
    assert.equal(JSON.stringify(actor), original); assert.deepEqual(physical(actor), originalPhysical);
  }
}));

const geometry = calls => calls.filter(call => ['moveTo', 'lineTo', 'ellipse', 'arc'].includes(call[0]));
for (const side of ['player', 'opponent']) test(`Melee ${side} Wave4 target visuals use the actual foe and retain their confirmed impact after movement or death`, () => {
  for (const id of ['kakashi_war', 'yuffie_ff7', 'piccolo_dbz', 'redxiii_ff7']) for (const outcome of ['moved', 'dead']) {
    const context = make('melee', side, id), { engine, actor, targets, facing } = context;
    targets[0].x = actor.x + facing * 130;
    targets[0].currentHp = outcome === 'dead' ? 1 : targets[0].maxHp;
    targets[1].x = actor.x - facing * 400;
    targets[2].currentHp = 0; targets[2].state = 'dead';
    const confirmed = { x: targets[0].x, y: targets[0].y }, survivorHp = targets[1].currentHp;
    assert.equal(commit(context), true);
    const action = actor.action, profile = action.superProfile;
    assert.equal(profile.sourceHeroId, id); assert.equal(action.impactPoint, undefined);
    advance(context, action.hitAt * 0.4);
    const expectedWindup = recorder(), actualWindup = recorder();
    drawCharacterSuperVisuals(expectedWindup.ctx, getCharacterSuperVisualState({ actor, profile, action, target: confirmed }));
    engine.drawMeleeSuper(actualWindup.ctx, actor);
    assert.deepEqual(geometry(actualWindup.calls), geometry(expectedWindup.calls), `${id}: windup used the fallback distance rather than the real target`);
    if (id === 'kakashi_war') {
      const centres = actualWindup.calls.filter(call => call[0] === 'moveTo'); assert.equal(centres.length, 3);
      centres.forEach(call => { assert.equal(call[1], confirmed.x); assert.equal(call[2], confirmed.y - 72 * 0.42); });
    }
    expectedWindup.assertBalanced(); actualWindup.assertBalanced();
    advance(context, action.hitAt - action.elapsed + 0.001);
    assert.deepEqual(action.impactPoint, { x: confirmed.x, y: confirmed.y - 30 });
    assert.equal(targets[1].currentHp, survivorHp);
    assert.equal(targets[0].currentHp === 0, outcome === 'dead');
    targets[0].x = actor.x - facing * 700; targets[0].y = actor.y + 80;
    targets[1].x = actor.x + facing * 350;
    assert.equal(engine.getMeleeSuperTargets(actor, profile, facing)[0], targets[1]);
    advance(context, action.hitAt + (action.duration - action.hitAt) * 0.3 - action.elapsed);
    const snapshot = JSON.stringify({ actor, targets, stats: engine.stats });
    const expected = recorder(), actual = recorder(), wrong = recorder();
    drawCharacterSuperVisuals(expected.ctx, getCharacterSuperVisualState({ actor, profile, action, target: confirmed }));
    drawCharacterSuperVisuals(wrong.ctx, getCharacterSuperVisualState({ actor, profile, action, target: targets[1] }));
    engine.drawMeleeSuper(actual.ctx, actor);
    assert.deepEqual(geometry(actual.calls), geometry(expected.calls), `${id}: rendering abandoned the confirmed impact point`);
    assert.notDeepEqual(geometry(actual.calls), geometry(wrong.calls), `${id}: regression fixture must distinguish a newly eligible enemy`);
    if (['yuffie_ff7', 'piccolo_dbz'].includes(id)) {
      const endpoint = actual.calls.find(call => call[0] === 'lineTo'); assert.ok(endpoint);
      assert.equal(endpoint[1], confirmed.x); assert.equal(endpoint[2], confirmed.y - 72 * 0.42);
    }
    const paused = recorder(); engine.drawMeleeSuper(paused.ctx, actor); assert.deepEqual(paused.calls, actual.calls);
    assert.equal(JSON.stringify({ actor, targets, stats: engine.stats }), snapshot);
    assert.deepEqual(action.impactPoint, { x: confirmed.x, y: confirmed.y - 30 });
    for (const recorded of [expected, actual, wrong, paused]) recorded.assertBalanced();
    advance(context, action.duration); assert.equal(targets[1].currentHp, survivorHp); assert.equal(meter(context), 0);
  }
});

for (const side of ['player', 'opponent']) test(`RPG ${side} Chaos uses its stable real actor clock through idle and fresh support projections without mutating combat state`, () => withReadyNativeImages(() => {
  const context = make('rpg', side, 'vincent_ff7'), { engine, actor } = context;
  assert.equal(Object.hasOwn(actor, 'stateElapsed'), false, 'the fixture must exercise the actual fallback animation clock');
  assert.equal(commit(context), true); advance(context, 1.1);
  assert.equal(actor.state, 'idle'); assert.equal(form(actor)?.id, 'vincent-chaos');
  const draw = animTime => {
    const snapshot = JSON.stringify({ actor, allies: context.allies, targets: context.targets, queue: engine.actionQueue });
    const recorded = recorder(); recorded.ctx.save();
    if (side === 'player') engine.drawRpgHero(recorded.ctx, actor, animTime);
    else engine.drawRpgEnemy(recorded.ctx, actor, animTime);
    recorded.ctx.restore(); recorded.assertBalanced();
    const native = recorded.calls.find(call => call[0] === 'drawImage');
    assert.ok(native); assert.match(native[1].src, /chaos[^/]*\.png$/i); assert.equal(native[3], 0);
    assert.equal(JSON.stringify({ actor, allies: context.allies, targets: context.targets, queue: engine.actionQueue }), snapshot);
    assert.equal(Object.hasOwn(actor, 'stateElapsed'), false);
    assert.equal(Object.hasOwn(actor, 'animationClockSource'), false, 'a cosmetic clock owner leaked into the authoritative actor');
    return { col: native[2] / 256, calls: recorded.calls };
  };
  for (const phase of ['idle', 'support-super']) {
    if (phase === 'support-super') {
      actor.atb = 100; setMeter(context, 100); assert.equal(commit(context), true);
      const view = engine.getRpgPresentationActor(actor);
      assert.notEqual(view, actor); assert.equal(view.presentationPhase, 'super'); assert.equal(view.animationClockSource, actor);
      assert.equal(view.stateElapsed, undefined);
    }
    const columns = [];
    for (const animTime of [0, 10, 20, 30]) {
      const rendered = draw(animTime); columns.push(rendered.col);
      engine.setPaused(true);
      for (let i = 0; i < 20; i++) engine.update();
      const paused = draw(animTime); assert.deepEqual(paused.calls, rendered.calls);
      engine.setPaused(false);
    }
    assert.deepEqual(columns, [0, 1, 2, 0], `${phase}: fresh cosmetic projections reset or advanced the body clock`);
  }
}));

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
for (const id of ['redxiii_ff7', 'vincent_ff7']) test(`${id} Wave4 base correction has16 native transparent poses and draws all4 states/columns in both facings`, async () => {
  const registry = JSON.parse(await readFile(new URL('../src/game/combat/characterSpriteCorrectionsWave4.generated.json', import.meta.url), 'utf8'));
  const entry = registry.entries.find(item => item.heroId === id); assert.ok(entry);
  assert.equal(entry.universe, 'Final Fantasy VII'); assert.equal(entry.rows, 4); assert.equal(entry.columns, 4); assert.equal(entry.frames, 16);
  assert.equal(entry.canon1to1Verified, false); assert.equal(entry.model, null); assert.equal(entry.generationId, null);
  const bytes = await readFile(new URL(`../public${entry.sheet}`, import.meta.url));
  assert.equal(sha256(bytes), entry.sha256);
  assert.equal(sha256(await readFile(new URL(`../${entry.sourceImage}`, import.meta.url))), entry.sourceImageSha256);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024); assert.equal(info.height, 1024); assert.equal(info.channels, 4);
  const hashes = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
    const visible = Buffer.alloc(256 * 256 * 4); let pixels = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const index = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[index + 3];
      if (alpha > 0) data.copy(visible, (y * 256 + x) * 4, index, index + 4);
      if (alpha > 4) pixels++;
      if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, `${id}:${row}:${col}: visible outer frame margin`);
    }
    assert.ok(pixels > 300 && pixels < 45000, `${id}:${row}:${col}: empty pose or opaque background panel`);
    hashes.push(sha256(visible));
  }
  assert.equal(new Set(hashes).size, 16, 'a native base pose was duplicated');
  withReadyNativeImages(() => {
    for (const context of ['rpg', 'melee']) for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) for (let col = 0; col < 4; col++) for (const facing of [1, -1]) {
      const timelineFrame = col * 10 + 0.5;
      const actor = { ...hero(id), x: 400, y: 350, currentHp: 1000, state, action: null, stateElapsed: timelineFrame / 60, facing };
      assert.equal(getHeroSpriteSheetSrc(actor, context), entry.sheet, `${context}:${state}: old base sheet remained selected`);
      const snapshot = JSON.stringify(actor), drawn = recorder();
      drawPixelSprite(drawn.ctx, actor.x, actor.y, actor, timelineFrame, facing, 100, context);
      const native = drawn.calls.find(call => call[0] === 'drawImage'); assert.ok(native);
      assert.equal(native[1].src, entry.sheet); assert.equal(native[2], col * 256); assert.equal(native[3], row * 256);
      assert.equal(native[4], 256); assert.equal(native[5], 256);
      assert.ok(drawn.calls.some(call => call[0] === 'scale' && call[1] === facing && call[2] === 1));
      assert.equal(JSON.stringify(actor), snapshot); drawn.assertBalanced();
      const paused = recorder(); drawPixelSprite(paused.ctx, actor.x, actor.y, actor, timelineFrame, facing, 100, context);
      assert.deepEqual(paused.calls, drawn.calls); paused.assertBalanced();
    }
  });
});

