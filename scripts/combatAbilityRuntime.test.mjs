import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let vite, EngineSmash, EngineRpg, HEROES_DB, tickMeleeCombatActor, resolveCombatAbility;
const engines = [];
const noop = () => {};
const hero = id => {
  const found = HEROES_DB.find(candidate => candidate.id === id);
  assert.ok(found, id);
  return found;
};
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({ resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); });

function smash(callerId, side) {
  const caller = hero(callerId), other = hero('leon');
  const players = side === 'player' ? [caller, other] : [other];
  const opponents = side === 'enemy' ? [caller, other] : [other];
  const engine = new EngineSmash(900, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop,
    { universe: caller.universe, mode: 'Smash', disableHazards: true, customBattle: { opponentControl: 'p2', singleRoster: true } });
  engine.syncPreMatchFromServer(3000);
  const allies = side === 'player' ? engine.heroes : engine.enemies;
  const enemies = side === 'player' ? engine.enemies : engine.heroes;
  const actor = allies[0];
  [...allies, ...enemies].forEach(unit => { unit.state = 'idle'; unit.y = engine.groundY; unit.vx = 0; unit.vy = 0; unit.specialCharge = 0; });
  actor.x = side === 'player' ? 200 : 600; actor.facing = side === 'player' ? 1 : -1;
  allies.slice(1).forEach(unit => { unit.x = actor.x - actor.facing * 30; });
  enemies.forEach((unit, index) => { unit.x = actor.x + actor.facing * (160 + index * 30); });
  engines.push(engine);
  return { engine, actor, allies, enemies, inputSide: side === 'player' ? 'player' : 'cpu' };
}
function advanceMelee(engine, actor, ticks) {
  for (let i = 0; i < ticks; i++) tickMeleeCombatActor(actor, 1 / 60, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
}

for (const side of ['player', 'enemy']) {
  test(`Melee ${side} civilian basic attack performs its authored support and cannot punch an opponent`, () => {
    const { engine, actor, allies, enemies, inputSide } = smash('saul_goodman', side);
    const hp = enemies.map(unit => unit.currentHp);
    assert.equal(resolveCombatAbility(actor, 'simple').effect, 'buff');
    assert.equal(engine.triggerMeleeAction(inputSide, 'AttackLight'), true);
    assert.equal(actor.action.abilityProfile.name, 'Argument juridique de Saul');
    const pending = actor.action;
    const startupTicks = Math.ceil(actor.action.hitAt * 60);
    advanceMelee(engine, actor, startupTicks - 1);
    assert.equal(allies.some(unit => unit.meleeSuperSupport), false, 'support fired before startup');
    advanceMelee(engine, actor, 2);
    assert.deepEqual(enemies.map(unit => unit.currentHp), hp);
    assert.ok(allies.every(unit => unit.meleeSuperSupport?.effect === 'buff'));
    assert.equal(engine.resolveMeleeActionHit(actor, pending), 0, 'duplicate basic support applied twice');
    assert.ok(actor.specialCharge > 0 && actor.specialCharge < 100);
  });

  test(`Melee ${side} basic firearm reaches a distant target within its actual range once`, () => {
    const { engine, actor, enemies, inputSide } = smash('rick_deckard_br', side);
    const hp = enemies[0].currentHp;
    assert.equal(engine.triggerMeleeAction(inputSide, 'AttackLight'), true);
    const action = actor.action;
    assert.equal(action.abilityProfile.delivery, 'projectile');
    assert.ok(Math.abs(enemies[0].x - actor.x) > 88, 'test must exceed a generic fist range');
    const startupTicks = Math.ceil(actor.action.hitAt * 60);
    advanceMelee(engine, actor, startupTicks - 1);
    assert.equal(enemies[0].currentHp, hp);
    advanceMelee(engine, actor, 2);
    assert.ok(enemies[0].currentHp < hp);
    const after = enemies[0].currentHp;
    assert.equal(engine.resolveMeleeActionHit(actor, action), 0);
    advanceMelee(engine, actor, 60);
    assert.equal(enemies[0].currentHp, after);
  });

  test(`Melee ${side} medical secondary heals an ally and shares the legacy command path`, () => {
    const { engine, actor, allies, enemies } = smash('sarah_bowman_dotd', side);
    const ally = allies[1];
    ally.currentHp = Math.max(1, ally.maxHp - 40);
    const before = ally.currentHp;
    const hostileHp = enemies.map(unit => unit.currentHp);
    const started = side === 'player' ? engine.triggerAbility(actor, 'secondary') : engine.triggerOpponentAbility('secondary');
    assert.equal(started, true);
    assert.equal(actor.action.abilityProfile.effect, 'heal');
    assert.ok(actor.cooldown > 0);
    advanceMelee(engine, actor, 20);
    assert.ok(ally.currentHp > before && ally.currentHp <= ally.maxHp);
    assert.deepEqual(enemies.map(unit => unit.currentHp), hostileHp);
    assert.equal(side === 'player' ? engine.triggerAbility(actor, 'secondary') : engine.triggerOpponentAbility('secondary'), false);
  });
}

test('Melee authored support snapshots its action and interruption prevents a late heal', () => {
  const { engine, actor, allies, enemies } = smash('sarah_bowman_dotd', 'player');
  allies[1].currentHp = Math.max(1, allies[1].maxHp - 40);
  const hp = allies[1].currentHp;
  assert.equal(engine.triggerAbility(actor, 'secondary'), true);
  const action = actor.action;
  actor.action = null;
  actor.state = 'hitStun';
  assert.equal(engine.resolveMeleeActionHit(actor, action), 0);
  advanceMelee(engine, actor, 90);
  assert.equal(allies[1].currentHp, hp);
  assert.ok(enemies.every(unit => unit.currentHp === unit.maxHp));
});

test('RPG authored basic melee approaches the real target and follows its declared impact tick', () => {
  const source = hero('cloud_ff7'), opponent = hero('leon');
  const engine = new EngineRpg(760, 420, [source], { monsters: [opponent], bosses: [], customRoster: [opponent] }, { add: noop }, noop, noop,
    { universe: source.universe, customBattle: { opponentControl: 'p2', singleRoster: true } });
  engines.push(engine);
  const actor = engine.heroes[0], target = engine.enemies[0];
  actor.atb = 100; target.atb = -1000;
  const profile = resolveCombatAbility(actor, 'simple');
  const hp = target.currentHp;
  assert.ok(Math.abs(actor.x - target.x) > profile.range);
  assert.equal(engine.triggerAbility(actor, 'simple'), true);
  assert.equal(actor.atb, 0);
  const impactTicks = Math.ceil(profile.sourceAbility.hitAt * 60);
  for (let i = 0; i < impactTicks - 1; i++) engine.update();
  assert.equal(target.currentHp, hp);
  engine.update();
  assert.ok(target.currentHp < hp);
  assert.equal(source.simple.name, hero('cloud_ff7').simple.name);
});

test('RPG custom healing defense keeps healing semantics and does not damage opponents', () => {
  const base = hero('cloud_ff7');
  const actorData = { ...base, id: 'custom-medic', universe: 'Custom medical defense', defense: { name: 'Medical respite', type: 'heal', dmg: 0, healRatio: 0.2, dur: 1 } };
  const opponent = hero('leon');
  const engine = new EngineRpg(760, 420, [actorData], { monsters: [opponent], bosses: [], customRoster: [opponent] }, { add: noop }, noop, noop,
    { universe: actorData.universe, customBattle: { opponentControl: 'p2', singleRoster: true } });
  engines.push(engine);
  const actor = engine.heroes[0];
  actor.currentHp = Math.max(1, actor.maxHp - 30); actor.atb = 100;
  const before = actor.currentHp, enemyHp = engine.enemies[0].currentHp;
  assert.equal(engine.triggerAbility(actor, 'defense'), true);
  assert.ok(actor.currentHp > before);
  assert.equal(engine.enemies[0].currentHp, enemyHp);
  assert.equal(actor.atb, 0);
});

for (const side of ['player', 'enemy']) {
  test(`Melee ${side} Mei Zhen's ancestor guides allies without attacking as a soldier`, () => {
    const { engine, actor, allies, enemies } = smash('mei_zhen', side);
    const before = enemies.map(unit => unit.currentHp);
    assert.equal(engine.triggerAuthoredMeleeAbility(actor, 'secondary'), true);
    assert.equal(actor.action.abilityProfile.name, 'Pas de l’Ancêtre');
    assert.equal(actor.action.abilityProfile.effect, 'buff');
    assert.equal(actor.action.abilityProfile.multiplier, 0);
    advanceMelee(engine, actor, 60);
    assert.deepEqual(enemies.map(unit => unit.currentHp), before);
    assert.ok(allies.every(unit => unit.meleeSuperSupport?.effect === 'buff'));
  });

  test(`Melee ${side} Leo's secondary and super heal others while excluding the wounded caster`, () => {
    for (const slot of ['secondary', 'special']) {
      const { engine, actor, allies, enemies } = smash('leo_charmed', side);
      actor.currentHp = actor.maxHp * 0.1;
      allies[1].currentHp = allies[1].maxHp * 0.6;
      actor.specialCharge = 100;
      const before = { self: actor.currentHp, ally: allies[1].currentHp, enemy: enemies[0].currentHp };
      assert.equal(slot === 'special' ? engine.triggerMeleeSuper(actor) : engine.triggerAuthoredMeleeAbility(actor, slot), true);
      assert.equal((actor.action.superProfile || actor.action.abilityProfile).excludeSelf, true);
      advanceMelee(engine, actor, 90);
      assert.equal(actor.currentHp, before.self);
      assert.ok(allies[1].currentHp > before.ally);
      assert.equal(enemies[0].currentHp, before.enemy);
    }
  });

  test(`RPG ${side} Leo cannot select or heal himself with his secondary or super`, () => {
    for (const slot of ['secondary', 'special']) {
      const team = [hero('leo_charmed'), hero('leon')], opponent = [hero('cloud_ff7')];
      const engine = new EngineRpg(760, 420, side === 'player' ? team : opponent,
        { monsters: side === 'enemy' ? team : opponent, bosses: [], customRoster: side === 'enemy' ? team : opponent },
        { add: noop }, noop, noop, { universe: team[0].universe, customBattle: { opponentControl: 'p2', singleRoster: true } });
      engines.push(engine);
      const allies = side === 'player' ? engine.heroes : engine.enemies;
      const actor = allies[0], ally = allies[1];
      [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = -1000; });
      actor.atb = 100; actor.specialCharge = 100;
      actor.currentHp = actor.maxHp * 0.1; ally.currentHp = ally.maxHp * 0.6;
      const before = { self: actor.currentHp, ally: ally.currentHp };
      assert.equal(engine.beginTargeting(actor, slot, side), true);
      assert.equal(engine.getTargetingState().eligibleTargets.some(target => target.id === actor.battleId), false);
      assert.equal(engine.selectTarget(actor.battleId), false);
      assert.equal(engine.selectTarget(ally.battleId), true);
      assert.equal(engine.confirmTargeting(), true);
      for (let ticks = 0; actor.actionPending && ticks < 180; ticks++) engine.update();
      assert.equal(actor.actionPending, false);
      assert.equal(actor.currentHp, before.self);
      assert.ok(ally.currentHp > before.ally);
    }
  });
}
