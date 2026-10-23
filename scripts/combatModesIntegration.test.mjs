import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let vite;
let EngineFighter;
let EngineRpg;
let EngineSmash;
let HEROES_DB;
let tickMeleeCombatActor;
let grantBattleItemShield;
const engines = [];
const noop = () => {};
const particles = { add: noop };

before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ grantBattleItemShield } = await vite.ssrLoadModule('/src/game/battleItemShield.js'));
});
after(async () => {
  engines.forEach(engine => engine.dispose?.());
  await vite?.close();
});

const hero = id => {
  const found = HEROES_DB.find(value => value.id === id);
  assert.ok(found, `missing real roster ID: ${id}`);
  return found;
};
const keep = engine => { engines.push(engine); return engine; };
const fighter = (player, opponent, options = {}, complete = noop) => {
  const engine = keep(new EngineFighter(900, 500, player, opponent, particles, noop, complete, { opponentControl: 'p2', ...options }));
  engine.countdown = 0;
  return engine;
};
const rpg = (player, opponent) => {
  const engine = keep(new EngineRpg(900, 500, player, { monsters: opponent, bosses: [], customRoster: opponent }, particles, noop, noop, {
    universe: 'Nexus de Convergence', customBattle: { opponentControl: 'p2', singleRoster: true }
  }));
  engine.autoBattle = false;
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = 100; unit.specialCharge = 100; });
  return engine;
};
const stepFighterAction = (engine, count = 75) => { for (let i = 0; i < count; i++) engine.updateActions(1 / 60); };
const stepRpg = (engine, count) => { for (let i = 0; i < count; i++) engine.update(); };
const fixedRandom = callback => {
  const original = Math.random;
  Math.random = () => 0.5;
  try { return callback(); } finally { Math.random = original; }
};

for (const side of ['player', 'cpu']) test(`Fighter authored Rebecca super heals the correct ${side} team once`, () => {
  const support = [hero('rebecca_chambers'), hero('leon'), hero('jill')];
  const engine = fighter(side === 'player' ? support : [hero('solbadguy')], side === 'cpu' ? support : [hero('solbadguy')]);
  const team = engine.getTeam(side).fighters;
  const opponent = engine.getOpponent(side);
  const enemyHp = opponent.currentHp;
  team[0].currentHp -= 80;
  team[1].currentHp -= 60;
  team[2].currentHp = 0;
  team[2].state = 'dead';
  team[0].meter = 100;
  assert.equal(engine.tryAction(side, 'super'), true);
  assert.equal(team[0].action.identity.name, 'First Aid');
  assert.equal(team[0].action.effect, 'heal');
  assert.equal(team[0].meter, 0);
  stepFighterAction(engine);
  assert.ok(team[0].currentHp > team[0].maxHp - 80);
  assert.ok(team[1].currentHp > team[1].maxHp - 60);
  assert.ok(team[0].currentHp <= team[0].maxHp);
  assert.ok(team[1].currentHp <= team[1].maxHp);
  assert.equal(team[2].currentHp, 0);
  assert.equal(opponent.currentHp, enemyHp);
  const healed = team.map(unit => unit.currentHp);
  stepFighterAction(engine);
  assert.deepEqual(team.map(unit => unit.currentHp), healed);
});

test('Fighter P2 canonical super respects facing guard and spends one activation', () => {
  const execute = guarded => {
    const engine = fighter([hero('leon')], [hero('solbadguy')]);
    const actor = engine.getActive('cpu');
    const target = engine.getActive('player');
    actor.x = 460;
    target.x = 380;
    target.facing = 1;
    target.guarding = guarded;
    actor.meter = 100;
    assert.equal(engine.tryAction('cpu', 'super'), true);
    assert.equal(actor.action.identity.name, 'Tyrant Rave');
    assert.equal(actor.meter, 0);
    assert.equal(engine.tryAction('cpu', 'super'), false);
    const hp = target.currentHp;
    stepFighterAction(engine);
    const damage = hp - target.currentHp;
    assert.ok(damage > 0 && damage < hp);
    const after = target.currentHp;
    stepFighterAction(engine);
    assert.equal(target.currentHp, after);
    assert.ok(actor.meter >= 0 && actor.meter <= 100);
    return damage;
  };
  assert.ok(execute(true) < execute(false));
});

test('Fighter counter-hit cancels an uncommitted super and dispose blocks impacts', () => {
  const engine = fighter([hero('solbadguy')], [hero('leon')]);
  const actor = engine.getActive('player');
  const target = engine.getActive('cpu');
  actor.x = 380;
  target.x = 460;
  actor.meter = 100;
  assert.equal(engine.tryAction('player', 'super'), true);
  const hp = target.currentHp;
  const counter = { type: 'light', base: 4, knockback: 20, guardDamage: 4, facing: -1 };
  engine.applyHit(target, actor, counter);
  assert.equal(actor.action, null);
  stepFighterAction(engine);
  assert.equal(target.currentHp, hp);
  engine.dispose();
  const playerHp = actor.currentHp;
  engine.applyHit(target, actor, counter);
  assert.equal(actor.currentHp, playerHp);
  assert.equal(engine.tryAction('player', 'super'), false);
});

test('Fighter canonical projectile preserves launch direction and its finite launch range', () => {
  const engine = fighter([hero('jill')], [hero('leon')]);
  const actor = engine.getActive('cpu');
  const target = engine.getActive('player');
  actor.x = 760;
  target.x = 240;
  target.facing = 1;
  target.guarding = true;
  actor.meter = 100;
  assert.equal(engine.tryAction('cpu', 'super'), true);
  stepFighterAction(engine);
  assert.equal(engine.projectiles.length, 1);
  actor.x = 100;
  actor.facing = 1;
  const hp = target.currentHp;
  for (let i = 0; i < 100; i++) engine.updateProjectiles(1 / 60);
  assert.ok(target.currentHp < hp);
  assert.equal(target.guard, 58, 'guard follows the incoming shot after the owner crosses');
  const after = target.currentHp;
  for (let i = 0; i < 100; i++) engine.updateProjectiles(1 / 60);
  assert.equal(target.currentHp, after);

  const ranged = fighter([hero('leon')], [hero('jill')]);
  const shooter = ranged.getActive('player');
  const outside = ranged.getActive('cpu');
  shooter.x = 100;
  shooter.meter = 100;
  assert.equal(ranged.tryAction('player', 'super'), true);
  outside.x = shooter.x + shooter.action.range + 1;
  const outsideHp = outside.currentHp;
  stepFighterAction(ranged);
  for (let i = 0; i < 120; i++) ranged.updateProjectiles(1 / 60);
  assert.equal(outside.currentHp, outsideHp);
  assert.equal(ranged.projectiles.length, 0);
});

test('Fighter timeout final omits fatality and reports a P2 win once after outro', () => {
  const reports = [];
  const engine = fighter([hero('leon')], [hero('solbadguy')], { roundsToWin: 1 }, (...args) => reports.push(args));
  engine.getActive('player').currentHp = 1;
  engine.timer = 0.001;
  engine.update(1 / 60);
  assert.equal(engine.finished, true);
  assert.equal(engine.winnerSide, 'cpu');
  assert.equal(engine.roundWins.cpu, 1);
  assert.equal(engine.presentation.phase, 'victory');
  assert.deepEqual(engine.presentationQueue.map(scene => scene.phase), ['outro']);
  assert.equal(reports.length, 0);
  for (let i = 0; i < 650; i++) engine.update(1 / 60);
  assert.equal(reports.length, 1);
  assert.equal(reports[0][0], 'defeat');
  assert.equal(reports[0][1].winnerSide, 'cpu');
  assert.equal(reports[0][1].rewards.gold, 0);
  assert.equal(engine.endRound('victory'), false);
  for (let i = 0; i < 100; i++) engine.update(1 / 60);
  assert.equal(reports.length, 1);
});

test('authored Rebecca support is preserved by the Melee runtime and its HP cap', () => {
  const roster = [hero('solbadguy')];
  const engine = keep(new EngineSmash(900, 500, [hero('rebecca_chambers'), hero('leon')],
    { monsters: roster, bosses: [], customRoster: roster }, particles, noop, noop,
    { universe: 'Resident Evil', mode: 'Smash', disableHazards: true, customBattle: { opponentControl: 'p2', singleRoster: true } }));
  engine.syncPreMatchFromServer(3000);
  const actor = engine.heroes[0];
  const ally = engine.heroes[1];
  [...engine.heroes, ...engine.enemies].forEach((unit, index) => { unit.state = 'idle'; unit.x = 200 + index * 40; unit.y = engine.groundY; });
  actor.currentHp = actor.maxHp - 10;
  ally.currentHp = ally.maxHp - 70;
  actor.specialCharge = 100;
  const hostileHp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.triggerAbility(actor, 'special'), true);
  assert.equal(actor.action.superProfile.name, 'First Aid');
  for (let i = 0; i < 90; i++) tickMeleeCombatActor(actor, 1 / 60, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
  assert.equal(actor.currentHp, actor.maxHp);
  assert.ok(ally.currentHp > ally.maxHp - 70 && ally.currentHp <= ally.maxHp);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hostileHp);
});

test('RPG P2 Pelican impact waits through pause and respects guard plus item shield once', () => fixedRandom(() => {
  const engine = rpg([hero('leon'), hero('jill')], [hero('masterchief')]);
  const actor = engine.enemies[0];
  const protectedUnit = engine.heroes[0];
  protectedUnit.state = 'defense';
  protectedUnit.stateTimer = 500;
  grantBattleItemShield(protectedUnit, protectedUnit.maxHp);
  const shieldBefore = protectedUnit.battleItemShield;
  const hp = engine.heroes.map(unit => unit.currentHp);
  assert.equal(engine.summon(actor, 'enemy'), true);
  assert.equal(engine.getTargetingState().summon.entityName, 'D77-TC Pelican');
  assert.equal(engine.getTargetingState().summon.kind, 'reinforcement');
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(actor.atb, 0);
  assert.equal(actor.specialCharge, 0);
  assert.equal(actor.summonUsed, true);
  const impactTick = engine.activeSummon.impactTick;
  engine.setPaused(true);
  stepRpg(engine, impactTick + 20);
  assert.equal(engine.activeSummon.tick, 0);
  assert.deepEqual(engine.heroes.map(unit => unit.currentHp), hp);
  engine.setPaused(false);
  stepRpg(engine, impactTick - 1);
  assert.deepEqual(engine.heroes.map(unit => unit.currentHp), hp);
  stepRpg(engine, 1);
  assert.equal(protectedUnit.currentHp, hp[0]);
  assert.ok(protectedUnit.battleItemShield < shieldBefore && protectedUnit.battleItemShield >= 0);
  assert.ok(engine.heroes[1].currentHp < hp[1] && engine.heroes[1].currentHp >= 0);
  const after = engine.heroes.map(unit => unit.currentHp);
  const shieldAfter = protectedUnit.battleItemShield;
  stepRpg(engine, engine.activeSummon.durationTicks - impactTick);
  assert.equal(engine.activeSummon, null);
  assert.equal(engine.enemyActionLock, false);
  assert.deepEqual(engine.heroes.map(unit => unit.currentHp), after);
  assert.equal(protectedUnit.battleItemShield, shieldAfter);
  actor.atb = 100;
  actor.specialCharge = 100;
  assert.equal(engine.summon(actor, 'enemy'), false, 'one invocation per actor and battle');
}));

test('RPG P2 medical invocation keeps ally healing, radiation cap and dead-unit exclusion', () => {
  const engine = rpg([hero('leon')], [hero('arca_loom'), hero('arca_mirelle'), hero('arca_bastion')]);
  const [actor, patient, dead] = engine.enemies;
  actor.currentHp = actor.maxHp - 40;
  patient.currentHp = patient.maxHp * 0.5 - 5;
  patient.statusEffects.radiated = 400;
  dead.currentHp = 0;
  dead.state = 'dead';
  const opponentHp = engine.heroes[0].currentHp;
  const before = actor.currentHp;
  assert.equal(engine.summon(actor, 'enemy'), true);
  assert.equal(engine.getTargetingState().effect, 'heal');
  assert.equal(engine.getTargetingState().eligibleTargets.every(unit => unit.side === 'enemy'), true);
  assert.deepEqual(engine.getTargetingState().previewTargetIds, [patient.battleId]);
  assert.equal(engine.confirmTargeting(), true);
  const impact = engine.activeSummon.impactTick;
  stepRpg(engine, impact);
  assert.equal(actor.currentHp, before, 'the medical drone retains its single ally target');
  assert.equal(patient.currentHp, patient.maxHp * 0.5);
  assert.equal(dead.currentHp, 0);
  assert.equal(engine.heroes[0].currentHp, opponentHp);
});

test('RPG canonical Stand keeps the confirmed identity when that target dies during arrival', () => {
  const engine = rpg([hero('jotaro_kujo')], [hero('leon'), hero('jill')]);
  const actor = engine.heroes[0];
  const [selected, survivor] = engine.enemies;
  assert.equal(engine.summon(actor), true);
  assert.equal(engine.getTargetingState().summon.entityName, 'Star Platinum');
  assert.equal(engine.selectTarget(selected.battleId), true);
  assert.equal(engine.confirmTargeting(), true);
  selected.currentHp = 0;
  selected.state = 'dead';
  const hp = survivor.currentHp;
  stepRpg(engine, engine.activeSummon.durationTicks);
  assert.equal(selected.currentHp, 0);
  assert.equal(survivor.currentHp, hp);
  assert.equal(engine.activeSummon, null);
});

test('RPG disposal before an invocation impact cancels the scene and all delayed damage', () => {
  const engine = rpg([hero('doomslayer')], [hero('leon'), hero('jill')]);
  assert.equal(engine.summon(engine.heroes[0]), true);
  assert.equal(engine.confirmTargeting(), true);
  const hp = engine.enemies.map(unit => unit.currentHp);
  engine.dispose();
  stepRpg(engine, 400);
  assert.equal(engine.activeSummon, null);
  assert.equal(engine.actionQueue.length, 0);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
});
