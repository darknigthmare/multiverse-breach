import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { supportsPartySuper, samplePartySuperMotion, getPartySuperVisualState, drawPartySuperVisuals } from '../src/game/combat/partySuperVisuals.js';
import { getCharacterSuperVisualState, drawCharacterSuperVisuals, sampleCharacterSuperMotion } from '../src/game/combat/characterSuperVisuals.js';

let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, drawPixelSprite, getCharacterAnimationFrame;
const engines = [], noop = () => {}, particles = { add: noop };
const identities = {
  lightning_ff13: 'Army of One', fang_ff13: 'Highwind', vanille_ff13: 'Death', snow_ff13: 'Sovereign Fist',
  sazh_ff13: 'Cold Blood', hope_ff13: 'Last Resort', noctis_ff15: 'Armiger', gladiolus_ff15: 'Dawnhammer',
  ignis_ff15: 'Overwhelm', prompto_ff15: 'Trigger Happy', lunafreya_ff15: 'Oracle’s Blessing'
};
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
  const close = ['snow_ff13', 'fang_ff13'].includes(heroId) ? [100, 115, -350] : [160, 175, -350];
  targets.forEach((unit, i) => { unit.x = actor.x + facing * close[i]; });
  return { mode, side, engineSide, engine, actor, allies, targets, facing };
}
function commit(context, index = 0) {
  const { mode, engine, actor, engineSide } = context;
  if (mode === 'fighter') return engine.triggerSideAction(engineSide, 'super');
  if (mode === 'melee') return engineSide === 'player' ? engine.triggerAbility(actor, 'special') : engine.triggerOpponentAbility('special');
  if (!engine.beginTargeting(actor, 'special', engineSide)) return false;
  if (engine.getTargetingState().shape === 'single') assert.equal(engine.selectTarget(context.targets[index].battleId), true);
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
const segments = calls => calls.flatMap((item, index) => item[0] === 'moveTo' && calls[index + 1]?.[0] === 'lineTo' ? [[item, calls[index + 1]]] : []);
const visualOptions = (heroId, progress, facing = 1) => {
  const actor = { ...hero(heroId), x: 400, y: 350, vx: 0, vy: 0, currentHp: 1000, meter: 0 };
  const profile = resolveMeleeSuper(actor);
  return { actor, profile, action: { elapsed: profile.duration * progress, duration: profile.duration, hitAt: profile.hitAt, facing }, target: { x: 400 + facing * 180, y: 350, currentHp: 1000 }, height: 100 };
};

before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?party-wave3'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?party-wave3'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?party-wave3'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ getCharacterAnimationFrame } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

test('source targeting separates Army of One and Death from Highwind and Sovereign Fist', () => {
  for (const id of ['lightning_ff13', 'vanille_ff13', 'sazh_ff13']) {
    const profile = resolveMeleeSuper(hero(id)); assert.equal(profile.shape, 'single'); assert.equal(profile.maxTargets, 1); assert.equal(profile.targetSide, 'enemy');
  }
  assert.equal(resolveMeleeSuper(hero('vanille_ff13')).sourceAbility.type, 'dark');
  for (const id of ['fang_ff13', 'snow_ff13']) { const profile = resolveMeleeSuper(hero(id)); assert.equal(profile.shape, 'area'); assert.equal(profile.delivery, 'melee'); }
});

for (const heroId of ['lightning_ff13', 'vanille_ff13', 'fang_ff13']) test(`RPG ${identities[heroId]} preview retains its real single or area target rule`, () => {
  const context = make('rpg', 'player', heroId);
  assert.equal(context.engine.beginTargeting(context.actor, 'special'), true);
  assert.equal(context.engine.selectTarget(context.targets[0].battleId), true);
  const preview = context.engine.getTargetingState();
  assert.equal(preview.effect, 'damage');
  assert.deepEqual(preview.previewTargetIds, context.targets.slice(0, heroId === 'fang_ff13' ? 2 : 1).map(x => x.battleId));
  assert.equal(context.actor.specialCharge, 100); context.engine.cancelTargeting();
});

for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`${mode} Cold Blood ${side} spends one full gauge and hits one close opponent once through pause`, () => {
    const context = make(mode, side, 'sazh_ff13'), { engine, actor, targets } = context;
    const before = hp(targets);
    setMeter(context, 99); assert.equal(commit(context), false); assert.equal(meter(context), 99);
    setMeter(context, 100);
    const damageTargets = [], method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
    engine[method] = (source, target, ...rest) => { if (source === actor && targets.includes(target)) damageTargets.push(target); return apply(source, target, ...rest); };
    assert.equal(commit(context, mode === 'rpg' ? 1 : 0), true);
    assert.equal(meter(context), 0); assert.equal(commit(context), false);
    advance(context, 0.1); assert.deepEqual(hp(targets), before); pause(context); assert.equal(meter(context), 0);
    advance(context, 2);
    const selected = mode === 'rpg' ? 1 : 0;
    assert.deepEqual(damageTargets, [targets[selected]], 'visual volley or area profile added an extra damage event');
    targets.forEach((target, index) => assert.equal(target.currentHp < before[index], index === selected));
    const after = hp(targets); advance(context, 1); assert.deepEqual(hp(targets), after);
    if (mode !== 'fighter') assert.equal(meter(context), 0);
  });
  test(`${mode} Cold Blood ${side} cannot finish an interrupted startup`, () => {
    const context = make(mode, side, 'sazh_ff13'), { engine, actor, targets } = context;
    assert.equal(commit(context), true); advance(context, 0.1);
    const before = hp(targets);
    if (mode === 'rpg') { actor.currentHp = 0; actor.state = 'dead'; }
    else if (mode === 'melee') engine.applyDamage(targets[0], actor, 1, 0);
    else engine.applyHit(targets[0], actor, { type: 'light', base: 1, guardDamage: 0, knockback: 0 });
    advance(context, 3); assert.deepEqual(hp(targets), before); assert.ok(meter(context) < 100);
    if (mode === 'fighter') assert.equal(engine.projectiles.length, 0);
  });
  test(`${mode} Sovereign Fist ${side} covers both nearby foes where that mode fields multiple active opponents`, () => {
    const context = make(mode, side, 'snow_ff13'), before = hp(context.targets);
    assert.equal(commit(context), true); assert.equal(meter(context), 0); advance(context, 2);
    const count = mode === 'fighter' ? 1 : 2;
    context.targets.forEach((target, index) => assert.equal(target.currentHp < before[index], index < count));
    const after = hp(context.targets); advance(context, 1); assert.deepEqual(hp(context.targets), after);
  });
  test(`${mode} Lunafreya ${side} restores a living ally with one charge and no hostile damage`, () => {
    const context = make(mode, side, 'lunafreya_ff15', true), { actor, allies, targets } = context;
    const patient = allies[1]; patient.currentHp = patient.maxHp * 0.2;
    const before = { patient: patient.currentHp, actor: actor.currentHp, opponents: hp(targets) };
    assert.equal(commit(context), true); assert.equal(meter(context), 0); advance(context, 0.1); pause(context);
    advance(context, 2);
    assert.equal(patient.currentHp, Math.min(patient.maxHp, before.patient + patient.maxHp * 0.4));
    assert.equal(actor.currentHp, before.actor); assert.deepEqual(hp(targets), before.opponents);
    const healed = patient.currentHp; advance(context, 1); assert.equal(patient.currentHp, healed);
    assert.equal(meter(context), 0);
  });
}

for (const mode of ['melee', 'fighter']) for (const side of ['player', 'opponent']) test(`${mode} Cold Blood ${side} preserves committed facing, finite range and projectile height`, () => {
  for (const scenario of ['behind', 'range', 'height']) {
    const context = make(mode, side, 'sazh_ff13'), { actor, targets, facing } = context;
    assert.equal(commit(context), true);
    const profile = resolveMeleeSuper(actor);
    targets.forEach((target, i) => { target.x = actor.x + facing * (scenario === 'behind' ? -150 - i * 15 : scenario === 'range' ? profile.range + 30 + i * 15 : 160 + i * 15); if (scenario === 'height') target.y -= 200; });
    const before = hp(targets); advance(context, 3); assert.deepEqual(hp(targets), before, scenario); assert.equal(meter(context), 0);
  }
});

test('all eleven party visual identities require matching source ID, universe and technique and leave canvas/gameplay unchanged', () => {
  for (const [id, name] of Object.entries(identities)) for (const facing of [1, -1]) {
    const options = visualOptions(id, 0.55, facing), { actor, profile } = options;
    assert.equal(profile.name, name); assert.equal(supportsPartySuper(profile), true);
    const before = JSON.stringify(options);
    const state = getPartySuperVisualState(options); assert.ok(state); assert.equal(state.heroId, id); assert.equal(state.family, 'party');
    assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    const recorded = recorder(); assert.equal(drawCharacterSuperVisuals(recorded.ctx, state), true); recorded.assertBalanced();
    assert.deepEqual(getCharacterSuperVisualState(options), state);
    assert.deepEqual(getPartySuperVisualState({ ...options, actor: { ...actor, id: 'local-copy', sourceHeroId: id } }), state);
    assert.equal(JSON.stringify(options), before);
    for (const altered of [
      { ...options, actor: { ...actor, id: 'unrelated-source' } },
      { ...options, actor: { ...actor, sourceHeroId: 'unrelated-source' } },
      { ...options, actor: { ...actor, universe: 'Other universe' } },
      { ...options, profile: { ...profile, universe: 'Other universe' } },
      { ...options, profile: { ...profile, name: 'Other technique' } }
    ]) assert.equal(getPartySuperVisualState(altered), null, id);
  }
  const luna = visualOptions('lunafreya_ff15', 0.5);
  assert.equal(getPartySuperVisualState({ ...luna, profile: { ...luna.profile, effect: 'damage' } }), null);
  assert.equal(drawPartySuperVisuals(recorder().ctx, null), false);
});

test('Snow and Fang body motion peaks in flight and lands exactly on hitAt without modifying a combatant', () => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class { complete = true; naturalWidth = 1024; naturalHeight = 2048; set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); } get src() { return this._src; } };
  try {
    for (const id of ['snow_ff13', 'fang_ff13']) for (const facing of [1, -1]) {
      const options = visualOptions(id, 0), profile = options.profile, impact = profile.hitAt / profile.duration;
      const actor = { ...options.actor, presentationPhase: 'super', presentationImpactProgress: impact };
      const before = physical(actor);
      for (const progress of [0, impact / 2, impact, 0.95, 1]) {
        actor.presentationProgress = progress;
        const args = { heroId: id, universe: profile.universe, phase: 'super', progress, impactProgress: impact, height: 100 };
        const motion = samplePartySuperMotion(args);
        assert.deepEqual(sampleCharacterSuperMotion(args), motion);
        assert.equal(motion.x, 0);
        if (progress === impact / 2) assert.ok(motion.y < -80);
        else assert.equal(Math.abs(motion.y), 0, 'rendered body failed to land on the authoritative impact');
        const recorded = recorder(); drawPixelSprite(recorded.ctx, actor.x, actor.y, actor, 999999, facing, 100, 'melee');
        assert.ok(recorded.calls.some(call => call[0] === 'translate' && call[1] === actor.x && Math.abs(call[2] - (actor.y + motion.y)) < 1e-9), `${id}:${facing}:${progress}: native body motion ${JSON.stringify(recorded.calls.filter(call => call[0] === 'translate'))}, expected ${actor.y + motion.y}`);
        assert.ok(recorded.calls.some(call => call[0] === 'drawImage'));
        recorded.assertBalanced(); assert.deepEqual(physical(actor), before);
      }
    }
  } finally { globalThis.Image = OriginalImage; }
});

test('Cold Blood and Army of One show all17 and11 finite visual events, including the final one, without extra gameplay hits', () => {
  for (const [id, count] of [['sazh_ff13', 17], ['lightning_ff13', 11]]) for (const facing of [1, -1]) {
    let events = 0;
    for (let index = 0; index < count; index++) {
      const options = visualOptions(id, 0, facing), { action } = options;
      action.elapsed = action.hitAt + (action.duration - action.hitAt) * (index + 0.25) / count;
      const before = JSON.stringify(options);
      const recorded = recorder(); const state = getPartySuperVisualState(options); drawPartySuperVisuals(recorded.ctx, state);
      const strokes = segments(recorded.calls);
      const characteristic = strokes.filter(([start, end]) => id === 'sazh_ff13' ? Math.abs(end[2] - start[2]) < 1e-9 : Math.abs(end[2] - start[2] - 30 * options.height / 72) < 1e-9);
      assert.equal(characteristic.length, 1, `${id}: event ${index + 1}/${count} missing or repeated`); events++;
      const paused = recorder(); drawPartySuperVisuals(paused.ctx, getPartySuperVisualState(options)); assert.deepEqual(paused.calls, recorded.calls);
      assert.equal(JSON.stringify(options), before); recorded.assertBalanced(); paused.assertBalanced();
    }
    assert.equal(events, count);
    for (const progress of [0, 0.1, 1, 3]) {
      const options = visualOptions(id, progress, facing), recorded = recorder(); drawPartySuperVisuals(recorded.ctx, getPartySuperVisualState(options));
      assert.equal(segments(recorded.calls).length, 0, 'a finite volley became a persistent ray'); recorded.assertBalanced();
    }
  }
});

test('Last Resort has eight distinct rising/falling orbs and finite impact rings, never an Eidolon or gameplay mutation', () => {
  for (const facing of [1, -1]) for (const fraction of [0.2, 0.5, 0.9]) {
    const options = visualOptions('hope_ff13', 0, facing); options.action.elapsed = options.action.hitAt * fraction;
    const before = JSON.stringify(options), recorded = recorder(); drawPartySuperVisuals(recorded.ctx, getPartySuperVisualState(options));
    const orbs = recorded.calls.filter(call => call[0] === 'arc'); assert.equal(orbs.length, 8);
    assert.equal(new Set(orbs.map(call => `${call[1]},${call[2]}`)).size, 8);
    assert.equal(recorded.calls.some(call => ['drawImage', 'fillRect'].includes(call[0])), false);
    assert.equal(JSON.stringify(options), before); recorded.assertBalanced();
  }
  const end = visualOptions('hope_ff13', 1), recorded = recorder(); drawPartySuperVisuals(recorded.ctx, getPartySuperVisualState(end));
  assert.equal(recorded.calls.some(call => ['arc', 'ellipse'].includes(call[0])), false); recorded.assertBalanced();
});

test('Armiger orbits weapon silhouettes while Oracle blessing remains a cosmetic allied support motif', () => {
  const options = visualOptions('noctis_ff15', 0.25), before = JSON.stringify(options), first = recorder();
  const state = getPartySuperVisualState(options); assert.equal(state.kind, 'royal-arm-orbit'); drawPartySuperVisuals(first.ctx, state);
  assert.equal(segments(first.calls).length, 10); assert.equal(first.calls.some(call => ['drawImage', 'arc'].includes(call[0])), false);
  const later = recorder(); drawPartySuperVisuals(later.ctx, getPartySuperVisualState({ ...options, action: { ...options.action, elapsed: options.action.duration * 0.5 } }));
  assert.notDeepEqual(segments(first.calls), segments(later.calls)); assert.equal(JSON.stringify(options), before);
  first.assertBalanced(); later.assertBalanced();
  for (const side of ['player', 'opponent']) {
    const context = make('fighter', side, 'lunafreya_ff15', true), { engine, actor, allies, targets } = context;
    allies[1].currentHp = allies[1].maxHp * 0.75;
    assert.equal(commit(context), true); advance(context, 0.1);
    for (const afterImpact of [false, true]) {
      if (afterImpact) { advance(context, 0.4); assert.equal(allies[1].currentHp, allies[1].maxHp); }
      const snapshot = JSON.stringify({ allies, targets, stats: engine.stats, projectiles: engine.projectiles });
      const recorded = recorder(); engine.drawPersonalSuper(recorded.ctx, actor);
      const ring = recorded.calls.find(call => call[0] === 'ellipse'); assert.ok(ring);
      assert.equal(ring[1], allies[1].x, 'Oracle blessing changed anchors or was drawn on the hostile opponent');
      assert.notEqual(ring[1], targets[0].x);
      assert.equal(JSON.stringify({ allies, targets, stats: engine.stats, projectiles: engine.projectiles }), snapshot); recorded.assertBalanced();
    }
  }
});

for (const side of ['player', 'opponent']) test(`RPG decisive Snow and Fang impacts ${side} project a grounded native recovery while the ended simulation stays frozen`, () => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class { complete = true; naturalWidth = 1024; naturalHeight = 2048; set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); } get src() { return this._src; } };
  try {
    for (const heroId of ['snow_ff13', 'fang_ff13']) {
      const context = make('rpg', side, heroId), { engine, actor, targets } = context;
      targets[0].currentHp = 1;
      targets.slice(1).forEach(target => { target.currentHp = 0; target.state = 'dead'; });
      let impacts = 0, completed = 0;
      const applyImpact = engine.applyRpgImpact.bind(engine);
      engine.applyRpgImpact = (source, ...args) => { if (source === actor) impacts++; return applyImpact(source, ...args); };
      engine.onComplete = () => { completed++; };
      assert.equal(commit(context), true);
      assert.equal(meter(context), 0);
      let budget = 100;
      while (!engine.gameOver && budget-- > 0) engine.update();
      assert.equal(engine.gameOver, true, `${heroId}: lethal impact did not finish the battle`);
      assert.equal(targets[0].currentHp, 0);
      assert.equal(impacts, 1);
      assert.equal(actor.actionPending, false);
      assert.equal(engine.actionQueue.length, 0);
      assert.equal(actor.state, 'special');
      const timerProgress = (actor.rpgSpecialDurationTicks - actor.stateTimer) / actor.rpgSpecialDurationTicks;
      assert.ok(timerProgress < actor.rpgSpecialImpactProgress, 'the fixture must reproduce the pre-impact timer frozen by the decisive hit');
      const frozen = JSON.stringify({ heroes: engine.heroes, enemies: engine.enemies, queue: engine.actionQueue });
      const wallTimers = [...engine.timers];
      const renderRecovery = () => {
        const sourceActor = JSON.stringify(actor);
        const view = engine.getRpgPresentationActor(actor);
        assert.notEqual(view, actor);
        assert.equal(view.presentationPhase, 'super');
        assert.equal(view.presentationProgress, 1);
        assert.equal(view.stateTimer, actor.stateTimer, 'the projection rewrote the frozen source timer');
        const frame = getCharacterAnimationFrame(view);
        assert.ok(frame); assert.equal(frame.phase, 'super'); assert.equal(frame.col, 3);
        const height = 72 * engine.getDepthScale(actor.y);
        const motion = sampleCharacterSuperMotion({ heroId, universe: actor.universe, phase: frame.phase,
          progress: frame.progress, impactProgress: frame.impactProgress, height });
        assert.equal(Math.abs(motion.y), 0);
        const recorded = recorder();
        recorded.ctx.save();
        if (side === 'player') engine.drawRpgHero(recorded.ctx, actor, 999999);
        else engine.drawRpgEnemy(recorded.ctx, actor, 999999);
        engine.drawRpgCharacterSuperEffects(recorded.ctx);
        recorded.ctx.restore(); recorded.assertBalanced();
        const native = recorded.calls.find(call => call[0] === 'drawImage');
        assert.ok(native, 'the real RPG renderer did not draw a native recovery pose');
        assert.match(native[1].src, new RegExp(`/combat-character-animations-wave3/${heroId}\\.png$`));
        assert.equal(native[2], 3 * 256); assert.equal(native[3], 7 * 256);
        assert.ok(recorded.calls.some(call => call[0] === 'translate' && call[1] === actor.x && Math.abs(call[2] - actor.y) < 1e-9));
        assert.equal(JSON.stringify(actor), sourceActor, 'rendering changed the authoritative actor');
      };
      renderRecovery(); pause(context); renderRecovery();
      for (let i = 0; i < 100; i++) {
        engine.update();
        if (i % 20 === 0) renderRecovery();
      }
      pause(context); renderRecovery();
      assert.equal(JSON.stringify({ heroes: engine.heroes, enemies: engine.enemies, queue: engine.actionQueue }), frozen);
      assert.deepEqual([...engine.timers], wallTimers);
      assert.equal(impacts, 1, 'the ended action generated a second fatal impact');
      assert.equal(completed, 0, 'the 100-update regression unexpectedly ran past the outcome delay');
    }
  } finally { globalThis.Image = OriginalImage; }
});

for (const side of ['player', 'opponent']) test(`Melee Cold Blood ${side} keeps its confirmed visual impact point after a kill while another opponent survives`, () => {
  const context = make('melee', side, 'sazh_ff13'), { engine, actor, targets, facing } = context;
  targets[0].x = actor.x + facing * 150;
  targets[1].x = actor.x + facing * 350;
  targets[0].currentHp = 1;
  targets[2].currentHp = 0; targets[2].state = 'dead';
  const confirmed = { x: targets[0].x, y: targets[0].y };
  const survivorHp = targets[1].currentHp;
  assert.equal(commit(context), true);
  const action = actor.action;
  assert.equal(action.impactPoint, undefined);
  advance(context, action.hitAt - 0.001);
  assert.equal(action.impactPoint, undefined); assert.equal(targets[0].currentHp, 1);
  advance(context, 0.002);
  assert.equal(targets[0].currentHp, 0);
  assert.deepEqual(action.impactPoint, { x: confirmed.x, y: confirmed.y - 30 });
  assert.equal(targets[1].currentHp, survivorHp);
  assert.equal(engine.getMeleeSuperTargets(actor, action.superProfile, action.facing)[0], targets[1], 'the survivor must be a viable later target to reproduce the old visual retargeting');
  const q = (2 + 0.25) / 17;
  const elapsed = action.hitAt + (action.duration - action.hitAt) * q;
  advance(context, elapsed - action.elapsed);
  const snapshot = JSON.stringify({ actor, targets });
  const expected = recorder();
  drawCharacterSuperVisuals(expected.ctx, getCharacterSuperVisualState({ actor, profile: action.superProfile, action, target: confirmed }));
  const actual = recorder(); engine.drawMeleeSuper(actual.ctx, actor);
  assert.equal(segments(actual.calls).length, 1, 'the chosen release instant should contain one of the17 visible tracers');
  assert.deepEqual(segments(actual.calls), segments(expected.calls), 'the volley visually retargeted from the confirmed impact to a living neighbour');
  const wrong = recorder(); drawCharacterSuperVisuals(wrong.ctx, getCharacterSuperVisualState({ actor, profile: action.superProfile, action, target: targets[1] }));
  assert.notDeepEqual(segments(actual.calls), segments(wrong.calls));
  assert.equal(JSON.stringify({ actor, targets }), snapshot);
  const paused = recorder(); engine.drawMeleeSuper(paused.ctx, actor); assert.deepEqual(paused.calls, actual.calls);
  actual.assertBalanced(); expected.assertBalanced(); wrong.assertBalanced(); paused.assertBalanced();
  advance(context, action.duration);
  assert.equal(targets[1].currentHp, survivorHp, 'cosmetic release tracers damaged the surviving neighbour');
  assert.equal(meter(context), 0);
});

for (const side of ['player', 'opponent']) test(`Fighter Sazh, Prompto and Irvine ${side} keep finite forward visual aim after the opponent crosses or leaves range`, () => {
  for (const heroId of ['sazh_ff13', 'prompto_ff15', 'irvine_ff8']) for (const scenario of ['behind', 'out-of-range']) {
    const context = make('fighter', side, heroId), { engine, actor, targets, facing } = context;
    const profile = resolveMeleeSuper(actor);
    const initialDistance = scenario === 'behind' ? 160 : profile.range + 100;
    targets[0].x = actor.x + facing * initialDistance;
    actor.facing = -facing;
    const originalHp = hp(targets);
    assert.equal(commit(context), true);
    const action = actor.action;
    assert.equal(action.facing, facing);
    assert.equal(meter(context), 0);
    const aimDistance = Math.min(profile.range, initialDistance);
    const confirmedAim = { x: actor.x + facing * aimDistance, y: actor.y };
    targets[0].x = actor.x + facing * (scenario === 'behind' ? -150 : profile.range + 300);
    const count = heroId === 'prompto_ff15' ? 12 : 17;
    const releaseSamples = [(2 + 0.25) / count, heroId === 'irvine_ff8' ? 0.49 : (count - 1 + 0.49) / count];
    for (const q of releaseSamples) {
      const elapsed = action.hitAt + (action.duration - action.hitAt) * q;
      engine.updateActions(elapsed - action.elapsed);
      assert.equal(engine.projectiles.length, 1);
      const projectile = engine.projectiles[0];
      assert.equal(Math.sign(projectile.vx), facing);
      assert.equal(projectile.originX, actor.x);
      assert.equal(projectile.maxRange, profile.range);
      assert.ok((projectile.x - actor.x) * facing > 0);
      const beforeRender = JSON.stringify({ actor, targets, projectiles: engine.projectiles, stats: engine.stats });
      const actual = recorder(); engine.drawPersonalSuper(actual.ctx, actor);
      const drawn = segments(actual.calls); assert.ok(drawn.length, `${heroId}:${scenario}: release sample did not contain a visible tracer`);
      const expected = recorder();
      drawCharacterSuperVisuals(expected.ctx, getCharacterSuperVisualState({ actor, profile: action.identity, action, target: confirmedAim, height: 142 }));
      assert.deepEqual(drawn, segments(expected.calls), `${heroId}: visual aim followed the opponent after commitment`);
      for (const [start, end] of drawn) for (const point of [start, end]) {
        const forward = (point[1] - actor.x) * facing;
        assert.ok(forward >= -1e-9, `${heroId}: tracer moved behind the committed facing`);
        assert.ok(forward <= profile.range + 40, `${heroId}: tracer exceeded the finite projectile range and its small visual fringe`);
      }
      for (const call of actual.calls.filter(call => call[0] === 'arc')) {
        const forward = (call[1] - actor.x) * facing;
        assert.ok(forward - call[3] >= -1e-9); assert.ok(forward + call[3] <= profile.range + 40);
      }
      const paused = recorder(); engine.drawPersonalSuper(paused.ctx, actor); assert.deepEqual(paused.calls, actual.calls);
      for (let i = 0; i < 60; i++) { engine.updateActions(0); engine.updateProjectiles(0); }
      assert.equal(JSON.stringify({ actor, targets, projectiles: engine.projectiles, stats: engine.stats }), beforeRender, 'cosmetic rendering or zero-delta pause mutated the fight');
      assert.deepEqual(hp(targets), originalHp);
      actual.assertBalanced(); expected.assertBalanced(); paused.assertBalanced();
    }
    advance(context, 3);
    assert.deepEqual(hp(targets), originalHp, 'a locked forward projectile retargeted a crossed or distant opponent');
    assert.equal(engine.projectiles.length, 0); assert.equal(meter(context), 0);
  }
});
