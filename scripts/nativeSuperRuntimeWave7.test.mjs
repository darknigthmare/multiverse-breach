import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

let supportsNative, getVisual, drawVisual, getCharacterVisual, drawCharacterVisual, supportsTracked, sampleMotion, sampleCharacterMotion, preloadAssets, getSummonAssets, beginMeleeShield;
let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, resolveCombatAbility;
const observations = [], originalImage = globalThis.Image;
const engines = [], noop = () => {}, particles = { add: noop };
const dummy = id => ({
  id, name: id, universe: 'Native wave7 regression', category: 'test', weaponType: 'melee',
  primaryColor: '#88aacc', secondaryColor: '#ddeeff', stats: { hp: 5000, atk: 20, def: 8, spd: 5 },
  simple: { name: 'Training strike', type: 'melee', dmg: 1 }, secondary: { name: 'Training shot', type: 'bullet', dmg: 1, cd: 3 },
  defense: { name: 'Training guard', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'Training finish', type: 'bullet', dmg: 2 }
});
const hero = id => { const h = heroes.find(x => x.id === id); assert.ok(h, id); return h; };
const hp = actors => actors.map(x => x.currentHp);
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
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?native-wave7'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?native-wave7'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?native-wave7'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper, resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor, beginMeleeShield } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ supportsNativeSuperWave7: supportsNative, getNativeSuperVisualStateWave7: getVisual, drawNativeSuperVisualsWave7: drawVisual, sampleNativeSuperMotionWave7: sampleMotion, supportsTrackedProjectileVisualWave7: supportsTracked, preloadNativeSuperAssetsWave7: preloadAssets } = await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave7.js'));
  ({ getCharacterSuperVisualState: getCharacterVisual, drawCharacterSuperVisuals: drawCharacterVisual, sampleCharacterSuperMotion: sampleCharacterMotion } = await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js'));
  ({ getSummonAnimationAssets: getSummonAssets } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js'));
  const yamada = getSummonAssets().find(asset => asset.key === 'Guilty Gear::Yamada::Great Yamada Attack' && asset.kind === 'summon');
  assert.ok(yamada, 'Yamada must have a registered native summon atlas');
  const bytes = await readFile('public' + yamada.sheet), metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1024); assert.equal(metadata.height, 1024); assert.equal(metadata.channels, 4);
  // Node has no image decoder/canvas. The Image shim uses the dimensions of
  // the real PNG, while assertions inspect the actual runtime drawImage call.
  globalThis.Image = class {
    set src(value) { this._src = value; this.complete = value === yamada.sheet; this.naturalWidth = this.complete ? metadata.width : 0; this.naturalHeight = this.complete ? metadata.height : 0; }
    get src() { return this._src; }
  };
  observations.push({ case: 'Native Yamada PNG', path: 'public' + yamada.sheet, sha256: createHash('sha256').update(bytes).digest('hex'), width: metadata.width, height: metadata.height });
});
after(async () => {
  engines.forEach(engine => engine.dispose?.()); await vite?.close();
  if (originalImage === undefined) delete globalThis.Image; else globalThis.Image = originalImage;
  if (process.env.NATIVE_WAVE7_REPORT_PATH) {
    const sources = await Promise.all(['scripts/nativeSuperRuntimeWave7.test.mjs', 'src/game/engineRpg.js', 'src/game/engineSmash.js', 'src/game/engineFighter.js', 'src/game/combat/nativeSuperVisualsWave7.js', 'src/game/combat/characterSuperVisuals.js'].map(async path => ({ path, sha256: createHash('sha256').update(await readFile(path)).digest('hex') })));
    await writeFile(process.env.NATIVE_WAVE7_REPORT_PATH, JSON.stringify({ date: '2026-10-20',
      method: 'Real Vite SSR engines, accepted HP changes and canvas commands; Node Image shim uses actual PNG metadata, no browser or official fidelity claim.',
      coverage: { nativeIdentities: 18, offensiveSupers: 17, modes: ['rpg','melee','fighter'], sides: ['player','opponent'], contactSupers: 9, trackedPhysicalProjectilesFighter: ['noel','han_solo','leia_organa','may_gg'], newStarWarsOrdinaryKits: ['luke','vader','han_solo'], personalSoresu: 'obi_wan' }, sources, observations }, null, 2) + '\n');
  }
});

const nativeIds = ['ragna','jin','noel','rachel_bb','hazama_bb','luke','vader','han_solo','leia_organa','obi_wan','may_gg','dizzy_gg','millia_gg','axl_gg','baiken_gg','kenshin_himura','sanosuke_sagara','kaoru_kamiya'];
const offensiveIds = nativeIds.filter(id => id !== 'obi_wan');
const contactIds = ['ragna','luke','vader','millia_gg','axl_gg','baiken_gg','kenshin_himura','sanosuke_sagara','kaoru_kamiya'];
const trackedIds = ['noel','han_solo','leia_organa','may_gg'];
function commitSlot(c, slot) {
  if (c.mode === 'fighter') return c.engine.triggerSideAction(c.engineSide, { simple: 'light', secondary: 'special', defense: 'defense' }[slot]);
  if (c.mode === 'melee') return c.side === 'player' ? c.engine.triggerAbility(c.actor, slot) : c.engine.triggerOpponentAbility(slot);
  if (!c.engine.beginTargeting(c.actor, slot, c.engineSide)) return false;
  if (!c.engine.getTargetingState()) return true;
  if (c.engine.getTargetingState().profile.targetSide === 'enemy') assert.equal(c.engine.selectTarget(c.targets[0].battleId), true);
  return c.engine.confirmTargeting();
}
const snapshot = c => JSON.stringify({ actor: c.actor, allies: c.allies, targets: c.targets,
  queue: c.engine.actionQueue, projectiles: c.engine.projectiles, impacts: c.engine.projectileVisualImpacts,
  damageDealt: c.engine.damageDealt, damageTaken: c.engine.damageTaken, stats: c.engine.stats });
const render = c => {
  const record = recorder();
  if (c.mode === 'rpg') c.engine.drawRpgCharacterSuperEffects(record.ctx);
  else if (c.mode === 'melee') c.engine.drawMeleeSuper(record.ctx, c.actor);
  else c.engine.drawPersonalSuper(record.ctx, c.actor);
  record.assertBalanced(); return record.calls;
};
const actionOf = c => c.mode === 'rpg' ? c.actor.rpgSpecialVisual : c.actor.action;
const confirmedOf = c => actionOf(c)?.visualConfirmedContact;
const impactSeconds = c => c.mode === 'rpg' ? c.engine.actionQueue[0].ticks / 60 : c.actor.action.hitAt;
function atImpact(c) { advance(c, impactSeconds(c) + 0.001); }
const offensiveRings = calls => calls.filter(call => call[0] === 'ellipse');
function purePausedDraw(c) {
  const before = snapshot(c), first = render(c);
  for (let i = 0; i < 12; i++) assert.deepEqual(render(c), first);
  assert.equal(snapshot(c), before, 'Repeated rendering cannot change HP, actor, queues, projectiles or damage statistics');
  pause(c); assert.deepEqual(render(c), first); assert.equal(snapshot(c), before);
  return first;
}

test('18 explicit Wave7 identities dispatch purely, reject mixed identity and honor only supplied confirmed contacts', () => {
  for (const id of nativeIds) for (const facing of [1,-1]) for (const progress of [0.15,0.55,0.9]) {
    const actor = { ...hero(id), x: 500, y: 350, currentHp: 1000 }, profile = resolveMeleeSuper(actor);
    assert.equal(supportsNative(profile), true, id);
    assert.equal(supportsTracked(profile), trackedIds.includes(id), id);
    const options = { actor, profile, action: { duration: profile.duration, elapsed: progress * profile.duration, hitAt: profile.hitAt, facing },
      target: { x: actor.x + facing * 80, y: actor.y, currentHp: 1000 }, contactVisual: { confirmed: false } };
    const before = JSON.stringify(options), state = getVisual(options);
    assert.equal(state.family, 'native-wave7'); assert.equal(state.gameplayEffect, 'none'); assert.equal(state.source1to1Verified, false);
    assert.equal(state.contactEligible, false); assert.deepEqual(getCharacterVisual(options), state);
    const first = recorder(), second = recorder();
    assert.equal(drawVisual(first.ctx, state), true); assert.equal(drawCharacterVisual(second.ctx, getCharacterVisual(options)), true);
    first.assertBalanced(); second.assertBalanced(); assert.deepEqual(second.calls, first.calls);
    assert.equal(JSON.stringify(options), before);
    const movedDead = { ...options, target: { x: -9000, y: -3000, currentHp: 0 }, contactVisual: { confirmed: true, x: 620, y: 350 } };
    const accepted = getVisual(movedDead); assert.equal(accepted.contactEligible, true); assert.deepEqual(accepted.target, { x: 620, y: 350 });
    for (const contactVisual of [{ confirmed: false }, { confirmed: true, x: NaN, y: 350 }, { confirmed: true, x: 620, y: Infinity }]) {
      const rejected = getVisual({ ...options, contactVisual }); assert.equal(rejected.contactEligible, false);
      if (rejected.release) { const r = recorder(); drawVisual(r.ctx, rejected); r.assertBalanced(); assert.equal(offensiveRings(r.calls).length, 0); }
    }
    for (const invalid of [
      { actor: { ...actor, universe: 'Wrong' } }, { actor: { ...actor, id: 'wrong' } },
      { profile: { ...profile, name: 'Generic burst' } }, { profile: { ...profile, sourceHeroId: 'wrong' } },
      { profile: { ...profile, universe: 'Wrong' } }, { profile: { ...profile, effect: id === 'obi_wan' ? 'damage' : 'heal' } }
    ]) assert.equal(getVisual({ ...options, ...invalid }), null, id);
    assert.deepEqual(getVisual({ ...options, actor: { ...actor, id: 'local-p2', sourceHeroId: id } }), state);
    assert.deepEqual(sampleCharacterMotion({ heroId: id, universe: actor.universe, phase: 'super', progress }), sampleMotion({ heroId: id, universe: actor.universe, phase: 'super', progress }));
  }
  assert.equal(drawVisual(recorder().ctx, null), false);
});

for (const mode of ['rpg','melee','fighter']) for (const side of ['player','opponent']) {
  test(`${mode} ${side} all17 offensive supers spend once, pause before impact and damage only authoritative chosen targets`, () => {
    for (const id of offensiveIds) {
      const c = make(mode, side, id), { engine, actor, targets } = c, before = hp(targets), calls = [];
      const method = mode === 'fighter' ? 'applyHit' : 'applyDamage', apply = engine[method].bind(engine);
      engine[method] = (source, target, ...args) => { const oldHp = target.currentHp, result = apply(source, target, ...args); if (source === actor && target.currentHp < oldHp) calls.push(target); return result; };
      setMeter(c, 99); assert.equal(commit(c), false, id); assert.equal(meter(c), 99);
      setMeter(c, 100); assert.equal(commit(c), true, id); assert.equal(meter(c), 0); assert.equal(commit(c), false);
      const windup = Math.min(0.1, impactSeconds(c) / 2); advance(c, windup); assert.deepEqual(hp(targets), before, `${id} premature damage`);
      purePausedDraw(c); advance(c, 1.6);
      assert.ok(calls.length > 0, `${id} should hit`); assert.equal(new Set(calls).size, calls.length, `${id} double impact`);
      if (mode === 'rpg') assert.deepEqual(new Set(calls.map(target => target.battleId)), new Set(c.expectedTargetIds), id);
      const after = hp(targets); advance(c, 1.6); assert.deepEqual(hp(targets), after, `${id} replayed impact`);
    }
  });
}

for (const mode of ['melee','fighter']) for (const side of ['player','opponent']) {
  test(`${mode} ${side} all9 contact techniques reject misses, dead victims and return into range after resolution`, () => {
    for (const id of contactIds) for (const reason of ['range','behind','height','dead', ...(mode === 'fighter' ? ['invulnerable'] : ['perfect-shield'])]) {
      const c = make(mode, side, id), { actor, targets, facing } = c;
      assert.equal(commit(c), true); const action = actor.action;
      if (reason === 'range') targets.forEach(t => { t.x = actor.x + facing * (action.range + 400); });
      if (reason === 'behind') targets.forEach(t => { t.x = actor.x - facing * 100; });
      if (reason === 'height') targets.forEach(t => { t.y = actor.y - 220; });
      if (reason === 'dead') targets.forEach(t => { t.currentHp = 0; });
      if (reason === 'invulnerable') targets.forEach(t => { t.invulnerable = 10; });
      if (reason === 'perfect-shield') assert.equal(beginMeleeShield(targets[0]), true);
      const before = hp(targets);
      // Only the attacking action clock advances here; guard begins in its
      // genuine perfect-shield window at the authoritative collision call.
      atImpact(c); assert.deepEqual(hp(targets), before, `${id}:${reason}`);
      assert.equal(confirmedOf(c), undefined); assert.equal(offensiveRings(purePausedDraw(c)).length, 0);
      targets[0].x = actor.x + facing * 80; targets[0].y = actor.y;
      assert.equal(offensiveRings(render(c)).length, 0, 'A completed miss cannot be reacquired by rendering');
      advance(c, 0.02); assert.deepEqual(hp(targets), before);
    }
  });
  test(`${mode} ${side} accepted contacts lock the actual impact point through displacement and death`, () => {
    for (const id of contactIds) for (const lethal of [false,true]) {
      const c = make(mode, side, id), target = c.targets[0]; if (lethal) target.currentHp = 1;
      const beforeHp = target.currentHp, point = { x: target.x, y: target.y };
      assert.equal(commit(c), true); atImpact(c);
      assert.ok(target.currentHp < beforeHp); assert.deepEqual(confirmedOf(c), { confirmed: true, ...point });
      const first = purePausedDraw(c); assert.ok(offensiveRings(first).length > 0);
      target.x -= c.facing * 500; target.y -= 200;
      assert.deepEqual(render(c), first, 'Accepted point must not chase knockback or a dead target');
      const hpAfter = target.currentHp; advance(c, 0.01); assert.equal(target.currentHp, hpAfter);
    }
  });
}

for (const side of ['player','opponent']) test(`RPG ${side} all17 native supers suppress unaccepted contacts and preserve accepted coordinates`, () => {
  for (const id of offensiveIds) for (const reason of ['dead','protected','accepted']) {
    const c = make('rpg', side, id), { targets } = c;
    assert.equal(commit(c), true); assert.equal(confirmedOf(c), undefined);
    // RPG keeps its chosen object identities. Do not invent spatial misses or
    // invulnerability mechanics absent from that mode's scheduled targeting.
    if (reason === 'dead') targets.forEach(t => { t.currentHp = 0; });
    if (reason === 'protected') targets.forEach(t => { t.battleItemShield = 100000; });
    const before = hp(targets);
    // Keep other opponents alive so KO feedback does not end the match before
    // the pending cast is evaluated; only one chosen target is sufficient.
    if (reason === 'dead') { targets.at(-1).currentHp = targets.at(-1).maxHp; before[before.length - 1] = targets.at(-1).currentHp; }
    atImpact(c);
    if (reason !== 'accepted') {
      assert.deepEqual(hp(targets), before); assert.equal(confirmedOf(c), undefined);
      assert.equal(offensiveRings(purePausedDraw(c)).length, 0, `${id}:${reason} claimed contact without damage`);
    } else {
      const point = confirmedOf(c); assert.equal(point?.confirmed, true, id); assert.ok(targets.some((t, i) => t.currentHp < before[i]));
      const first = purePausedDraw(c); assert.ok(offensiveRings(first).length > 0);
      targets.forEach(t => { t.x += 500; t.y += 120; t.currentHp = 0; });
      assert.deepEqual(render(c), first, `${id} contact followed a moved/dead victim`);
    }
  }
});

for (const side of ['player','opponent']) test(`RPG ${side} a protected/dead first area target cannot hide or invent another accepted contact`, () => {
  for (const first of ['protected','dead']) {
    const c = make('rpg', side, 'rachel_bb'); assert.equal(commit(c), true);
    const selected = c.targets.filter(target => c.expectedTargetIds.includes(target.battleId)); assert.ok(selected.length >= 2);
    if (first === 'protected') selected[0].battleItemShield = 100000; else selected[0].currentHp = 0;
    const second = selected[1], point = { x: second.x, y: second.y }, before = second.currentHp;
    atImpact(c); assert.ok(second.currentHp < before); assert.deepEqual(confirmedOf(c), { confirmed: true, ...point });
    assert.ok(offensiveRings(purePausedDraw(c)).length > 0);
  }
});

for (const side of ['player','opponent']) test(`Fighter ${side} four native projectiles track physical flight and only accepted impacts, including the real Yamada PNG`, () => {
  for (const id of trackedIds) {
    const c = make('fighter', side, id), { engine, actor, targets, facing } = c, target = targets[0];
    target.x = actor.x + facing * 500; const hpBefore = target.currentHp;
    assert.equal(commit(c), true); advance(c, actor.action.hitAt - 0.01); assert.equal(engine.projectiles.length, 0);
    const startup = purePausedDraw(c);
    assert.equal(startup.some(call => call[0] === 'drawImage' || call[0] === 'lineTo'), false, `${id} must not draw a projectile or Yamada before its actual launch`);
    for (const ring of offensiveRings(startup)) assert.ok(Math.abs(ring[1] - actor.x) < 100, 'Startup accent stays local to the caster');
    advance(c, 0.02); assert.equal(engine.projectiles.length, 1); assert.equal(target.currentHp, hpBefore);
    const projectile = engine.projectiles[0], launchedX = projectile.x;
    assert.ok(projectile.visualElapsed >= 0); assert.equal(Math.sign(projectile.vx), facing);
    actor.facing = -facing; actor.x += facing * 600;
    const drawProjectile = () => { const r = recorder(); engine.drawProjectile(r.ctx, projectile); r.assertBalanced(); return r.calls; };
    const before = snapshot(c), flight = drawProjectile(); for (let i = 0; i < 12; i++) { engine.updateProjectiles(0); assert.deepEqual(drawProjectile(), flight); } assert.equal(snapshot(c), before);
    if (id === 'may_gg') {
      const asset = getSummonAssets().find(a => a.key === 'Guilty Gear::Yamada::Great Yamada Attack'); preloadAssets([actor]);
      const draw = flight.find(call => call[0] === 'drawImage'); assert.ok(draw, 'Actual Yamada projectile must draw native PNG pixels');
      assert.equal(draw[1].src, asset.sheet); assert.equal(draw[3], asset.phases.preparation.row * 256); assert.deepEqual(draw.slice(4,6), [256,256]);
      assert.ok(flight.some(call => call[0] === 'translate' && call[1] === projectile.x && call[2] === projectile.y));
      assert.ok(flight.some(call => call[0] === 'scale' && call[1] === facing));
    } else assert.ok(flight.some(call => call[0] === 'lineTo' && Math.sign(call[1] - projectile.x) === facing));
    let remaining = 240;
    while (!engine.projectileVisualImpacts.length && remaining-- > 0) { engine.updateActions(1/120); engine.updateProjectiles(1/120); }
    assert.ok(remaining > 0, id); assert.ok(Math.abs(projectile.x - launchedX) > 100); assert.ok(target.currentHp < hpBefore);
    assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 1);
    const impact = engine.projectileVisualImpacts[0], r = recorder(); engine.drawProjectileImpact(r.ctx, impact); r.assertBalanced();
    if (id === 'may_gg') { const draw = r.calls.find(call => call[0] === 'drawImage'); assert.equal(draw[3], getSummonAssets().find(a => a.key === 'Guilty Gear::Yamada::Great Yamada Attack').phases.attack.row * 256); }
    target.x -= facing * 500; const moved = recorder(); engine.drawProjectileImpact(moved.ctx, impact); moved.assertBalanced(); assert.deepEqual(moved.calls, r.calls);
    const hpAfter = target.currentHp; advance(c, 2); assert.equal(target.currentHp, hpAfter); assert.equal(engine.projectileVisualImpacts.length, 0);
    observations.push({ case: 'Tracked physical projectile', id, side, nativePng: id === 'may_gg', damage: hpBefore - hpAfter, impactPoint: { x: impact.x, y: impact.y } });
  }
});

for (const side of ['player','opponent']) test(`Fighter ${side} projectile misses and invulnerable/dead targets never create accepted impact art`, () => {
  for (const id of trackedIds) for (const reason of ['height','range','behind','dead','invulnerable']) {
    const c = make('fighter', side, id), { engine, actor, targets, facing } = c, target = targets[0];
    assert.equal(commit(c), true);
    if (reason === 'height') target.y -= 240;
    if (reason === 'range') target.x = actor.x + facing * (actor.action.range + 100);
    if (reason === 'behind') target.x = actor.x - facing * 100;
    if (reason === 'dead') target.currentHp = 0;
    if (reason === 'invulnerable') target.invulnerable = 10;
    const before = target.currentHp; advance(c, 2.5);
    assert.equal(target.currentHp, before, `${id}:${reason}`); assert.equal(engine.projectiles.length, 0); assert.equal(engine.projectileVisualImpacts.length, 0);
  }
});

for (const mode of ['rpg','melee','fighter']) for (const side of ['player','opponent']) test(`${mode} ${side} Star Wars loadouts and personal Soresu preserve effects without adding damage`, () => {
  for (const id of ['luke','vader','obi_wan']) {
    const c = make(mode, side, id, true), { actor, allies, targets } = c;
    for (const slot of ['simple','secondary']) {
      const p = resolveCombatAbility(actor, slot);
      assert.equal(p.effect, id === 'obi_wan' && slot === 'secondary' ? 'guard' : 'damage');
      assert.equal(p.healRatio, 0);
    }
    const defense = resolveCombatAbility(actor, 'defense'); assert.equal(defense.effect, 'guard'); assert.equal(defense.targetSide, 'self'); assert.equal(defense.multiplier, 0);
    if (id !== 'obi_wan') { assert.equal(resolveMeleeSuper(actor).delivery, 'melee'); continue; }
    const profile = resolveMeleeSuper(actor); assert.equal(profile.name, 'Soresu — défense au sabre'); assert.equal(profile.effect, 'guard'); assert.equal(profile.targetSide, 'self'); assert.equal(profile.multiplier, 0);
    actor.currentHp *= 0.6; const before = hp([...allies,...targets]); assert.equal(commit(c), true); assert.equal(meter(c), 0);
    advance(c, 0.1); const first = purePausedDraw(c); assert.equal(offensiveRings(first).length, 0); advance(c, 0.5);
    assert.deepEqual(hp([...allies,...targets]), before, 'Soresu is personal protection, not heal or attack');
    const active = mode === 'rpg' ? actor.rpgGuardTicks : mode === 'fighter' ? actor.superGuardSeconds : actor.meleeSuperSupport?.remaining;
    assert.ok(active > 0); for (const other of [...allies.slice(1),...targets]) assert.ok(!(other.rpgGuardTicks || other.superGuardSeconds || other.meleeSuperSupport));
  }
});

for (const mode of ['rpg','melee','fighter']) for (const side of ['player','opponent']) test(`${mode} ${side} Luke/Vader/Han ordinary kits execute their real damage and personal guard slots`, () => {
  for (const id of ['luke','vader','han_solo']) for (const slot of ['simple','secondary','defense']) {
    const c = make(mode, side, id, true), { engine, actor, allies, targets } = c;
    targets[0].x = actor.x + c.facing * 40; targets[1].x = actor.x + c.facing * 55;
    const profile = resolveCombatAbility(actor, slot), before = hp([...allies,...targets]);
    assert.ok(profile.provenance.sourceWork.startsWith('Star Wars'));
    assert.equal(profile.statusEffect, null); assert.equal(profile.healRatio, 0);
    assert.doesNotMatch(profile.name, /mind|mental|Kessel|Marche impériale/i);
    if (slot === 'secondary' && id === 'luke') { assert.equal(profile.name, 'Poussée de Force de Luke'); assert.equal(profile.delivery, 'area'); }
    if (slot === 'secondary' && id === 'vader') { assert.equal(profile.name, 'Étranglement de Force de Vader'); assert.equal(profile.shape, 'single'); }
    if (id === 'han_solo' && slot !== 'defense') assert.equal(profile.delivery, 'projectile');
    assert.equal(commitSlot(c, slot), true, `${id}:${slot}`);
    advance(c, slot === 'defense' ? 0.3 : 1.6);
    if (slot !== 'defense') {
      assert.ok(targets.some((target, i) => target.currentHp < before[allies.length + i]), `${id}:${slot} did not damage its opponent`);
      allies.forEach((ally, i) => assert.equal(ally.currentHp, before[i]));
      const hpAfter = hp(targets); advance(c, 0.5); assert.deepEqual(hp(targets), hpAfter);
    } else {
      assert.equal(profile.effect, 'guard'); assert.equal(profile.targetSide, 'self'); assert.equal(profile.multiplier, 0);
      assert.deepEqual(hp([...allies,...targets]), before, `${id} guard caused damage/healing`);
      const guardedHp = actor.currentHp, fresh = make(mode, side, id), originalRandom = Math.random;
      try {
        Math.random = () => 0.5;
        if (mode === 'fighter') {
          // Compare the same incoming direction to the authored personal guard.
          actor.facing = c.facing;
          const action = { type: 'light', base: 20, knockback: 0, guardDamage: 1, facing: -c.facing };
          engine.applyHit(targets[0], actor, action); fresh.engine.applyHit(fresh.targets[0], fresh.actor, action);
        } else {
          engine.applyDamage(targets[0], actor, 100); fresh.engine.applyDamage(fresh.targets[0], fresh.actor, 100);
        }
      } finally { Math.random = originalRandom; }
      const damage = guardedHp - actor.currentHp, plain = fresh.actor.maxHp - fresh.actor.currentHp;
      assert.ok(damage >= 0 && damage < plain, `${id} guard did not actually reduce damage`);
      allies.slice(1).forEach((ally, i) => assert.equal(ally.currentHp, before[i + 1]));
    }
  }
});

test('chosen BB/GG sourceWork and Rurouni weapon metadata remain explicit without a new balance claim', () => {
  for (const id of ['ragna','jin','noel','rachel_bb','hazama_bb','may_gg','dizzy_gg','millia_gg','axl_gg','baiken_gg']) {
    const p = resolveMeleeSuper(hero(id));
    assert.equal(p.provenance.sourceWork, p.universe === 'BlazBlue' ? 'BlazBlue: Continuum Shift Extend (2011)' : 'Guilty Gear Xrd REV 2 (2017)');
    assert.equal(p.provenance.canonicalVerified, false); assert.equal(p.provenance.networkVerified, false); assert.equal(p.provenance.gameplayAdaptation, true);
    assert.ok(p.multiplier > 0); assert.equal(p.meterCost, 100); assert.equal(p.effect, 'damage');
  }
  for (const [id, weapon] of [['kenshin_himura','sword'],['sanosuke_sagara','fists'],['kaoru_kamiya','bokken']]) assert.equal(hero(id).weaponType, weapon);
});

