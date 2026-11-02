import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
let vite, EngineFighter, EngineSmash, HEROES_DB, ENEMIES_DB, tickMeleeCombatActor, advanceSourceCombatStatusesWave16, sampleProtectionEntityVisualWave16;
const noop = () => {}, engines = [], originalImage = globalThis.Image;
const dummy = () => ({ id: 'w16-adversarial-target', name: 'Adversarial target', universe: 'Fixture',
  stats: { hp: 10000, atk: 10, def: 2, spd: 1 }, simple: { name: 'Strike', type: 'melee', dmg: 1 },
  defense: { name: 'Guard', type: 'guard', reduce: .4, dur: 1 }, special: { name: 'Strike', type: 'melee', dmg: 1 } });
before(async () => {
  globalThis.Image = class { complete = true; naturalWidth = 1024; naturalHeight = 2048; };
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: { ignored: ['**/*'] } } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ advanceSourceCombatStatusesWave16 } = await vite.ssrLoadModule('/src/game/combat/sourceCombatRuntimeWave16.js'));
  ({ sampleProtectionEntityVisualWave16 } = await vite.ssrLoadModule('/src/game/combat/protectionEntityRuntimeWave16.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); globalThis.Image = originalImage; });
function make(mode, id, side, slig = false) {
  const own = HEROES_DB.find(hero => hero.id === id); assert.ok(own);
  const enemy = slig ? ENEMIES_DB.Oddworld.monsters.find(enemy => enemy.id === 'oddworld_slig') : dummy();
  assert.ok(enemy);
  const actorEnemy = slig ? { ...enemy, stats: { hp: enemy.hp, atk: enemy.atk, def: enemy.def || 0, spd: enemy.spd } } : enemy;
  const players = side === 'player' ? [own] : [actorEnemy], opponents = side === 'enemy' ? [own] : [actorEnemy];
  const engine = mode === 'fighter' ? new EngineFighter(1100, 600, players, opponents, { add: noop }, noop, noop, { opponentControl: 'p2' })
    : new EngineSmash(1100, 600, players, { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop,
      { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine); if (mode === 'fighter') engine.countdown = 0; else engine.syncPreMatchFromServer(3000);
  const actor = mode === 'fighter' ? engine.getActive(side === 'player' ? 'player' : 'cpu') : (side === 'player' ? engine.heroes : engine.enemies)[0];
  const target = mode === 'fighter' ? engine.getOpponent(actor.side) : (side === 'player' ? engine.enemies : engine.heroes)[0];
  actor.x = 400; target.x = 500; actor.y = target.y = mode === 'fighter' ? engine.groundY : 400; actor.facing = 1; target.facing = -1;
  for (const body of [actor, target]) { body.currentHp = body.maxHp = 10000; body.state = 'idle'; body.action = null; body.specialCharge = 100; body.meter = 100; }
  const actors = [actor, target], seenProtectionFrames = new Set();
  const step = (seconds, statuses = true) => { for (let n = 0; n < Math.ceil(seconds * 60); n++) {
    if (statuses) advanceSourceCombatStatusesWave16(actors, 1 / 60);
    if (mode === 'fighter') engine.updateActions(1 / 60);
    else for (const body of actors) tickMeleeCombatActor(body, 1 / 60, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    const visual = actor.sourceProtectionEntityWave16;
    if (visual && !visual.awaitingCasterRecovery) { const frame = sampleProtectionEntityVisualWave16(visual); if (frame) seenProtectionFrames.add(frame.index); }
  } };
  const cast = () => mode === 'fighter' ? engine.tryAction(actor.side, 'super') : engine.triggerMeleeSuper(actor);
  const strike = (delivery = 'melee') => mode === 'fighter' ? engine.applyHit(target, actor, { type: 'light', base: 10, range: 100, guardDamage: 1, knockback: 0, delivery }, delivery === 'projectile')
    : engine.applyDamage(target, actor, 10, 0, null, 1, { delivery });
  return { engine, actor, target, actors, step, cast, strike, mode, seenProtectionFrames };
}
for (const mode of ['fighter', 'melee']) for (const side of ['player', 'enemy']) {
  test(`${mode}/${side}: Mugman invulnerability blocks damage, keeps a paused clock, then expires`, () => {
    const c = make(mode, 'cuphead_mugman', side); assert.equal(c.cast(), true); c.step(c.actor.action.hitAt + .02);
    assert.equal(c.actor.sourceProtectionWave16?.active, true); const hp = c.actor.currentHp;
    c.strike(); assert.equal(c.actor.currentHp, hp);
    const frozen = c.actor.sourceProtectionWave16; advanceSourceCombatStatusesWave16(c.actors, 20, { paused: true });
    assert.deepEqual(c.actor.sourceProtectionWave16, frozen);
    c.step(5); c.strike(); assert.ok(c.actor.currentHp < hp);
  });
  test(`${mode}/${side}: Shield Pal persists, refuses stacking and consumes exactly one damaging contact`, () => {
    const c = make(mode, 'cuphead_ms_chalice', side); assert.equal(c.cast(), true); c.step(1.5);
    assert.equal(c.actor.sourceProtectionWave16?.charges, 1); c.step(30);
    assert.equal(c.actor.sourceProtectionWave16.active, true); c.actor.meter = c.actor.specialCharge = 100;
    assert.equal(c.cast(), false); const hp = c.actor.currentHp;
    c.actor.battleItemShield = 1000; c.strike(); assert.equal(c.actor.currentHp, hp);
    assert.equal(c.actor.sourceProtectionWave16.charges, 1); assert.ok(c.actor.battleItemShield < 1000);
    c.actor.battleItemShield = 0;
    if (mode === 'fighter') {
      c.engine.applyHit(c.target,c.actor,{type:'light',base:10,guardDamage:1,knockback:0,sequenceParent:{},sequenceFraction:1e-12});
    } else {
      c.engine.applyDamage(c.target,c.actor,10,0,null,1,{sequenceParent:{},sequenceFraction:1e-12});
      c.actor.guarding = true; c.actor.perfectShieldWindow = .1; c.strike();
      c.actor.guarding = false; c.actor.perfectShieldWindow = 0;
    }
    assert.equal(c.actor.sourceProtectionWave16.charges, 1); assert.equal(c.actor.currentHp, hp);
    c.strike(); assert.equal(c.actor.currentHp, hp); assert.equal(c.actor.sourceProtectionWave16.active, false);
    c.strike(); assert.ok(c.actor.currentHp < hp);
    assert.equal(c.actor.sourceProtectionEntityWave16.absorptionCount, 1);
    c.step(1); assert.equal(c.actor.sourceProtectionEntityWave16.active, false);
    assert.deepEqual([...c.seenProtectionFrames].sort((a,b) => a-b), Array.from({length:16},(_,index) => index));
  });
  test(`${mode}/${side}: Yukikaze arms without damage, catches a real projectile and can miss its escaping owner`, () => {
    const c = make(mode, 'hakumen_bb', side), hp = c.target.currentHp;
    assert.equal(c.cast(), true); c.step(c.actor.action.hitAt + .01);
    assert.equal(c.actor.sourceProtectionWave16?.active, true); assert.equal(c.target.currentHp, hp);
    const ownerHp = c.actor.currentHp; c.strike('projectile'); assert.equal(c.actor.currentHp, ownerHp);
    assert.equal(c.actor.action?.sourceCounterWave16, true); const startX = c.actor.x;
    c.target.x = 1000; c.step(.4); assert.equal(c.target.currentHp, hp); assert.ok(Math.abs(c.actor.x - startX) <= 140.001);
  });
  test(`${mode}/${side}: Paralyzer requires explicit admission and immobilizes with no lift or damage`, () => {
    const c = make(mode, 'akane_tsunemori', side), hp = c.target.currentHp, y = c.target.y;
    assert.equal(c.cast(), false); assert.equal(mode === 'fighter' ? c.actor.meter : c.actor.specialCharge, 100);
    c.target.paralyzerEligible = true; assert.equal(c.cast(), true); c.step(c.actor.action.hitAt + .02);
    assert.equal(c.target.sourceControlWave16?.kind, 'paralyzer'); assert.equal(c.target.currentHp, hp); assert.equal(c.target.y, y);
    c.actor.currentHp = 0; advanceSourceCombatStatusesWave16(c.actors, .1); assert.equal(c.target.sourceControlWave16.active, true);
  });
  test(`${mode}/${side}: Abe controls the actual canonical Slig and releases original ownership without friendly fire`, () => {
    const c = make(mode, 'oddworld_abe_possession', side, true), storedSide = c.target.side, hp = c.target.currentHp;
    assert.equal(c.target.sourceEnemyId, 'oddworld_slig'); assert.equal(c.target.species, 'slig');
    assert.equal(c.cast(), true); c.step(c.actor.action.hitAt + .02);
    assert.equal(c.target.sourceControlWave16?.inputProxy?.controllerRuntimeId, c.actor.battleId || c.actor.runtimeId || c.actor.id);
    assert.equal(c.target.currentHp, hp); assert.equal(c.target.side, storedSide); c.step(.3);
    assert.equal(c.actor.sourcePossessionBodyWave16, c.target);
    if (mode === 'fighter') { assert.equal(c.engine.tryJump(c.target), false); assert.equal(c.engine.triggerSideAction(c.target.side, 'heavy'), false); }
    else { assert.equal(c.engine.triggerMeleeAction(side === 'player' ? 'cpu' : 'player', 'AttackLight'), false);
      assert.equal(c.engine.beginChargedMeleeAttack(side === 'player' ? 'cpu' : 'player'), false); }
    const commandSide = mode === 'fighter' ? c.actor.side : side === 'player' ? 'player' : 'cpu';
    assert.equal(mode === 'fighter' ? c.engine.tryAction(commandSide, 'light') : c.engine.triggerMeleeAction(commandSide, 'AttackLight'), true);
    assert.equal(c.target.action?.sourceSligRifle, true); c.step(.3);
    const shots = mode === 'fighter' ? c.engine.projectiles : c.engine.sourceRifleProjectilesWave16;
    assert.ok(shots?.length > 0); const ownerHp = c.actor.currentHp;
    for (let n = 0; n < 90; n++) { if (mode === 'fighter') c.engine.updateProjectiles(1 / 60); else c.engine.updateSourceRifleProjectilesWave16(); }
    assert.equal(c.actor.currentHp, ownerHp);
    assert.equal(mode === 'fighter' ? c.engine.tryAction(commandSide, 'super') : c.engine.triggerMeleeAction(commandSide, 'Special'), true);
    assert.equal(c.target.sourceControlWave16.active, false); assert.equal(c.target.side, storedSide);
  });
}
for (const side of ['player', 'enemy']) {
  test(`melee/${side}: Mugman blocks actual infection and stage damage without curing status or protecting a ring out`, () => {
    const c = make('melee', 'cuphead_mugman', side); assert.equal(c.cast(), true); c.step(1.5);
    c.actor.y = c.engine.arena.groundY; c.actor.statusEffects.infected = 61;
    const hp = c.actor.currentHp; c.engine.updateLocalVersusActor(c.actor);
    assert.equal(c.actor.currentHp, hp); assert.equal(c.actor.statusEffects.infected, 60);
    c.engine.hazardsDisabled = false; c.engine.arena.hazards = [{ x1: c.actor.x - 5, x2: c.actor.x + 5, y: c.actor.y, damage: 9, cadence: 120 }];
    c.engine.hazardTick = 119; c.engine.applyArenaHazards(); assert.equal(c.actor.currentHp, hp);
    c.engine.paused = true; const frozen = JSON.stringify(c.actor); for (let n = 0; n < 60; n++) c.engine.update(); assert.equal(JSON.stringify(c.actor), frozen); c.engine.paused = false;
    advanceSourceCombatStatusesWave16(c.actors, 5); c.actor.statusEffects.infected = 61; c.engine.updateLocalVersusActor(c.actor); assert.ok(c.actor.currentHp < hp);
    const falling = make('melee', 'cuphead_mugman', side); assert.equal(falling.cast(), true); falling.step(1.5);
    falling.actor.y = falling.engine.height + 100; falling.actor.vy = 0; falling.actor.recoveryLock = 999;
    falling.engine.applyPhysics(falling.actor); assert.equal(falling.actor.currentHp, 0);
  });
  test(`melee/${side}: Shield Pal keeps its charge through infection and zero damage, then absorbs one actual positive hazard contact`, () => {
    const c = make('melee', 'cuphead_ms_chalice', side); assert.equal(c.cast(), true); c.step(1.5);
    c.actor.y = c.engine.arena.groundY; c.actor.statusEffects.infected = 61; const hp = c.actor.currentHp;
    c.engine.updateLocalVersusActor(c.actor); assert.ok(c.actor.currentHp < hp); assert.equal(c.actor.sourceProtectionWave16.charges, 1);
    c.engine.hazardsDisabled = false; const hazard = { x1: c.actor.x - 5, x2: c.actor.x + 5, y: c.actor.y, damage: 0, cadence: 120 }; c.engine.arena.hazards = [hazard];
    c.engine.hazardTick = 119; c.engine.applyArenaHazards(); assert.equal(c.actor.sourceProtectionWave16.charges, 1);
    hazard.damage = 9; const before = c.actor.currentHp; c.engine.hazardTick = 119; c.engine.applyArenaHazards();
    assert.equal(c.actor.currentHp, before); assert.equal(c.actor.sourceProtectionWave16.charges, 0);
    c.engine.hazardTick = 119; c.engine.applyArenaHazards(); assert.ok(c.actor.currentHp < before);
  });
}
