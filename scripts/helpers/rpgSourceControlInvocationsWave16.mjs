import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';

let vite, EngineRpg, HEROES_DB, ENEMIES_DB, resolveUniverseSummon;
const engines = [], noop = () => {};
const cases = [
  ['oddworld_munch_telecommande', 'oddworld_abe_possession', 'possession'],
  ['oddworld_stranger_live_ammo', 'oddworld_abe_possession', 'possession'],
  ['shinya_kogami', 'akane_tsunemori', 'paralyzer'],
  ['nobuchika_ginoza', 'akane_tsunemori', 'paralyzer'],
];
const identity = actor => ({ id: actor.id, sourceHeroId: actor.sourceHeroId, sourceId: actor.sourceId,
  universe: actor.universe, side: actor.side, team: actor.team, heroTeam: actor.heroTeam });
const cost = actor => ({ atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed });
const tick = (engine, n = 1) => { for (let i = 0; i < n; i++) engine.update(); };
const hero = id => { const result = HEROES_DB.find(actor => actor.id === id); assert.ok(result, id); return result; };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, watch: null } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });

function fixture([callerId, performerId, kind], side) {
  const data = kind === 'possession'
    ? structuredClone(ENEMIES_DB.Oddworld.monsters.find(actor => actor.id === 'oddworld_slig'))
    : { ...hero('shinya_kogami'), paralyzerEligible: true };
  const target = { ...data, stats: data.stats || { hp: data.hp, atk: data.atk, def: data.def || 5, spd: data.spd || 5 } };
  const own = [hero(callerId)], other = [target, hero('noble_six')];
  const players = side === 'player' ? own : other, opponents = side === 'enemy' ? own : other;
  const engine = new EngineRpg(760, 420, players, { monsters: opponents, bosses: [], customRoster: opponents },
    { add: noop }, noop, noop, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine); engine.autoBattle = false; engine.enemyGlobalRecovery = 100000;
  const allies = side === 'player' ? engine.heroes : engine.enemies;
  const targets = side === 'player' ? engine.enemies : engine.heroes;
  for (const actor of [...engine.heroes, ...engine.enemies]) {
    actor.atb = -100000; actor.specialCharge = 100; actor.currentHp = actor.maxHp = 100000;
    actor.state = 'idle'; actor.actionPending = false; actor.statusEffects = { infected: 0, glitched: 0, radiated: 0 };
  }
  const actor = allies[0], body = targets[0]; actor.x = actor.homeX = side === 'player' ? 200 : 500;
  actor.y = actor.homeY = 277; actor.atb = 100;
  targets.forEach((unit, index) => { unit.x = unit.homeX = actor.x + (side === 'player' ? 1 : -1) * (180 + index * 80); unit.y = unit.homeY = 277; });
  return { engine, actor, body, targets, side, callerId, performerId, kind };
}
function commit(f) {
  assert.equal(f.engine.summon(f.actor, f.side), true);
  assert.equal(f.engine.confirmTargeting(), true);
  assert.deepEqual(cost(f.actor), { atb: 0, charge: 0, used: true });
  assert.equal(f.engine.confirmTargeting(), false);
  return f.engine.getSummonSceneState();
}
function finish(f) {
  const duration = f.engine.getSummonSceneState().durationTicks;
  tick(f.engine, duration);
  assert.equal(f.engine.getSummonSceneState(), null);
}

for (const spec of cases) for (const side of ['player', 'enemy']) test(`source invocation ${spec[0]} ${side}: real performer, post-scene control, costs and cleanup`, () => {
  const f = fixture(spec, side), { engine, actor, body, targets, kind, performerId } = f;
  const originalIdentity = identity(actor), bodyIdentity = identity(body), originalTeam = [...targets];
  const descriptor = resolveUniverseSummon(actor);
  assert.equal(descriptor.performer.id, performerId); assert.equal(descriptor.sourceHeroId, performerId);
  assert.equal(descriptor.action.sourceHeroId, performerId); assert.equal(descriptor.performer.universe, actor.universe);
  const profile = engine.getActionContext(actor, 'summon', side).profile;
  assert.ok(engine.getRpgInvocationControlSourceWave16(actor, profile));
  for (const field of ['action-source', 'declared-action-source', 'kind', 'role', 'performer-universe']) {
    const forged = { ...profile, action: { ...profile.action }, summon: { ...profile.summon,
      action: { ...profile.summon.action }, performer: { ...profile.summon.performer } } };
    if (field === 'action-source') forged.action.sourceHeroId = 'wrong';
    if (field === 'declared-action-source') forged.summon.action.sourceHeroId = 'wrong';
    if (field === 'kind') forged.summon.kind = 'summon';
    if (field === 'role') forged.summon.performerRole = 'entity';
    if (field === 'performer-universe') forged.summon.performer.universe = 'wrong';
    assert.equal(engine.getRpgInvocationControlSourceWave16(actor, forged), null, field);
  }
  const before = cost(actor);
  const invalid = kind === 'possession'
    ? [{ sourceEnemyId: 'wrong' }, { universe: 'wrong' }, { species: 'wrong' }, { possessionEligible: false }]
    : [{ paralyzerEligible: false }];
  for (const patch of [...invalid, { isBoss: true }, { controlImmune: true }, { invulnerable: 5 }, { currentHp: 0 }, { x: 5000 }]) {
    const prior = Object.fromEntries(Object.keys(patch).map(key => [key, body[key]])); Object.assign(body, patch);
    assert.equal(engine.summon(actor, side), false, JSON.stringify(patch));
    assert.deepEqual(cost(actor), before); assert.equal(engine.targeting, null); Object.assign(body, prior);
  }
  assert.equal(engine.summon(actor, side), true); assert.deepEqual(cost(actor), before);
  assert.equal(engine.cancelTargeting(), true); assert.deepEqual(cost(actor), before);
  const hp = body.currentHp, y = body.y;
  const scene = commit(f), pausedState = JSON.stringify(body.sourceControlWave16 || null);
  engine.setPaused(true); tick(engine, 60); assert.equal(engine.getSummonSceneState().tick, 0);
  assert.equal(JSON.stringify(body.sourceControlWave16 || null), pausedState); engine.setPaused(false);
  if (kind === 'possession') {
    assert.equal(body.sourceControlWave16.phase, 'channeling');
    tick(engine, 65); assert.equal(body.sourceControlWave16.phase, 'channeling');
    tick(engine, scene.durationTicks - 65);
  } else finish(f);
  assert.equal(engine.getSummonSceneState(), null);
  tick(engine);
  assert.equal(body.sourceControlWave16.active, true);
  assert.equal(body.sourceControlWave16.sourceHeroId, performerId);
  assert.deepEqual(body.sourceControlWave16.sourceInvocationWave16, { callerId: actor.battleId,
    callerHeroId: spec[0], performerId, universe: actor.universe, actionName: descriptor.action.name, kind });
  assert.equal(body.currentHp, hp); assert.equal(body.y, y);
  assert.deepEqual(identity(actor), originalIdentity); assert.deepEqual(identity(body), bodyIdentity);
  assert.deepEqual(side === 'player' ? engine.enemies : engine.heroes, originalTeam);
  const activeRemaining = body.sourceControlWave16.remaining;
  engine.setPaused(true); tick(engine, 60); assert.equal(body.sourceControlWave16.remaining, activeRemaining); engine.setPaused(false);
  if (kind === 'possession') {
    assert.equal(body.sourceControlWave16.phase, 'active'); assert.ok(activeRemaining > 1.9);
    body.atb = 100; body.specialCharge = 0;
    const command = engine.getRpgPossessionCommandState(side); assert.equal(command.controllerId, actor.battleId);
    assert.equal(command.bodyId, body.battleId); assert.equal(command.ready, true);
    assert.equal(engine.beginPossessedTargeting(actor.battleId, side), true);
    assert.equal(engine.getTargetingState().actorId, body.battleId);
    assert.equal(engine.cancelTargeting(), true); assert.equal(body.atb, 100);
    const victim = targets[1], hpBefore = victim.currentHp;
    assert.equal(engine.beginPossessedTargeting(actor.battleId, side), true);
    assert.equal(engine.confirmTargeting(), true); assert.equal(body.atb, 0);
    const paid = cost(actor); tick(engine, 45);
    assert.ok(victim.currentHp < hpBefore, 'actual Slig rifle must hit its original ally');
    assert.equal(actor.specialCharge, paid.charge); assert.equal(actor.summonUsed, true);
    assert.equal(engine.releaseRpgPossession(actor.battleId, side), true);
    assert.equal(engine.getRpgPossessionCommandState(side), null); assert.equal(body.sourceControlWave16.active, false);
  } else {
    assert.equal(body.sourceControlWave16.kind, 'paralyzer'); assert.equal(body.sourceControlWave16.immobilize, true);
    assert.equal(engine.getRpgPossessionCommandState(side), null);
    tick(engine, 95); assert.equal(body.sourceControlWave16.active, false);
    assert.equal(body.currentHp, hp); assert.equal(body.y, y);
  }
  assert.deepEqual(identity(actor), originalIdentity);

  // Each real caller is also exercised against death/removal on both sides,
  // both before impact and after the summoned performer has left the scene.
  for (const afterScene of [false, true]) for (const removal of ['dead', 'removed']) {
    const c = fixture(spec, side); commit(c); if (afterScene) finish(c);
    if (removal === 'dead') c.actor.currentHp = 0;
    else { const team = side === 'player' ? c.engine.heroes : c.engine.enemies; team.splice(team.indexOf(c.actor), 1); }
    tick(c.engine, 220);
    assert.equal(c.engine.getSummonSceneState(), null);
    assert.equal(c.body.sourceControlWave16?.active || false, false);
    assert.equal(c.engine.getRpgPossessionCommandState(side), null);
  }
  if (kind === 'possession') {
    const c = fixture(spec, side); commit(c); tick(c.engine, 20); c.actor.currentHp -= 1; tick(c.engine, 220);
    assert.equal(c.body.sourceControlWave16.active, false, 'a damaged channel must never restart at delayed impact');
    assert.equal(c.engine.getRpgPossessionCommandState(side), null);
    const dead = fixture(spec, side); commit(dead); finish(dead); dead.body.atb = 100;
    dead.actor.currentHp = 0;
    const paid = cost(dead.actor), bodyCost = cost(dead.body);
    assert.equal(dead.engine.getRpgPossessionCommandState(side), null, 'dead owner cannot expose a command before the next update');
    assert.equal(dead.engine.beginPossessedTargeting(dead.actor.battleId, side), false);
    assert.equal(dead.engine.beginTargeting(dead.body, 'simple', side), false);
    assert.deepEqual(cost(dead.actor), paid); assert.deepEqual(cost(dead.body), bodyCost);
    tick(dead.engine); assert.equal(dead.body.sourceControlWave16.active, false);
  }
});
