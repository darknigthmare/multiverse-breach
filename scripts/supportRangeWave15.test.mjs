import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { isValHealingBurstProfile, healingBurstWithinRange } from '../src/game/combat/combatHealingBurstWave15.js';
let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveCombatAbility, tickMeleeCombatActor;
const engines = [], noop = () => {};
const dummy = id => ({ id, name: id, universe: 'W15 healing fixtures', weaponType: 'fists', stats: { hp: 1000, atk: 10, def: 5, spd: 5 },
  simple: { name: 'Fixture strike', type: 'melee', dmg: 1 }, secondary: { name: 'Fixture secondary', type: 'melee', dmg: 1 },
  defense: { name: 'Fixture guard', type: 'guard', reduce: .5 }, special: { name: 'Fixture special', type: 'melee', dmg: 1 } });
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js')); ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js')); ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ tickMeleeCombatActor } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.())); after(async () => { await vite?.close(); });
function fixture(mode, side) {
  const val = heroes.find(hero => hero.id === 'evolve_val'); assert.ok(val);
  const own = [val, dummy('near-ally'), dummy('far-ally')], opposition = [dummy('untouched-enemy')];
  const players = side === 'player' ? own : opposition, opponents = side === 'player' ? opposition : own;
  const options = { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const engine = mode === 'fighter' ? new EngineFighter(1200, 500, players, opponents, { add: noop }, noop, noop, { opponentControl: 'p2' })
    : new (mode === 'rpg' ? EngineRpg : EngineSmash)(1200, 500, players, { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop, options);
  engines.push(engine);
  if (mode === 'rpg') engine.autoBattle = false; else if (mode === 'melee') engine.syncPreMatchFromServer(3000); else { engine.countdown = 0; engine.presentation = null; }
  const camp = side === 'player' ? 'player' : mode === 'rpg' ? 'enemy' : 'cpu';
  const allies = mode === 'fighter' ? engine.getTeam(camp).fighters : side === 'player' ? engine.heroes : engine.enemies;
  const enemies = mode === 'fighter' ? engine.getTeam(camp === 'player' ? 'cpu' : 'player').fighters : side === 'player' ? engine.enemies : engine.heroes;
  const actor = allies[0], facing = side === 'player' ? 1 : -1;
  for (const [index, ally] of allies.entries()) {
    ally.currentHp = 500; ally.maxHp = 1000; ally.x = 500 + facing * [0, 120, 230][index]; ally.y = mode === 'rpg' ? 350 : engine.groundY;
    ally.homeX = ally.x; ally.homeY = ally.y; ally.state = 'idle'; ally.action = null; ally.atb = -10000; ally.vx = ally.vy = 0;
  }
  for (const enemy of enemies) { enemy.currentHp = enemy.maxHp = 1000; enemy.atb = -10000; enemy.state = 'idle'; enemy.x = 1000; }
  actor.atb = actor.meter = actor.specialCharge = 100; actor.facing = facing;
  return { mode, side, camp, actor, allies, enemies, engine, facing, profile: resolveCombatAbility(actor, 'special') };
}
const hp = units => units.map(unit => unit.currentHp);
const meter = c => c.mode === 'fighter' ? c.actor.meter : c.actor.specialCharge;
function commit(c) {
  if (c.mode === 'fighter') return c.engine.triggerSideAction(c.camp, 'super');
  if (c.mode === 'melee') return c.engine.triggerMeleeSuper(c.actor);
  if (!c.engine.beginTargeting(c.actor, 'special', c.camp)) return false;
  return c.engine.confirmTargeting();
}
function advance(c, seconds) {
  if (c.mode === 'rpg') { for (let n = 0; n < Math.ceil(seconds * 60); n++) c.engine.update(); return; }
  for (let elapsed = 0; elapsed < seconds - 1e-9;) {
    const dt = Math.min(1 / 60, seconds - elapsed);
    if (c.mode === 'fighter') { c.engine.updateActions(dt); c.engine.updateProjectiles(dt); }
    else tickMeleeCombatActor(c.actor, dt, { resolveActionHit: (source, action) => c.engine.resolveMeleeActionHit(source, action) });
    elapsed += dt;
  }
}

test('W15 HealingBurst is exactly Val nearby group/self healing, separated from Medgun and enemy control', () => {
  const c = fixture('rpg', 'player');
  assert.equal(c.profile.name, 'Soin du Healing Burst de Val'); assert.equal(c.profile.range, 220);
  assert.equal(c.profile.effect, 'heal'); assert.equal(c.profile.delivery, 'support'); assert.equal(c.profile.shape, 'group');
  assert.equal(c.profile.targetSide, 'ally'); assert.equal(c.profile.excludeSelf, false); assert.equal(c.profile.multiplier, 0);
  assert.equal(isValHealingBurstProfile(c.profile), true);
  for (const change of [{ sourceHeroId: 'other' }, { universe: 'other' }, { effect: 'damage' }, { shape: 'single' }, { targetSide: 'enemy' }, { multiplier: 1 }, { excludeSelf: true }])
    assert.equal(isValHealingBurstProfile({ ...c.profile, ...change }), false);
  assert.equal(healingBurstWithinRange(c.actor, c.allies[1], c.profile), true);
  assert.equal(healingBurstWithinRange(c.actor, c.allies[2], c.profile), false);
});
for (const mode of ['rpg', 'melee', 'fighter']) for (const side of ['player', 'opponent']) {
  test(`W15 ${mode} ${side}: real220px HealingBurst heals self and near allies once, excludes horizontal/diagonal outsiders and preserves enemy HP`, () => {
    for (const geometry of ['horizontal', 'diagonal']) {
      const c = fixture(mode, side), { actor, allies, enemies } = c;
      if (geometry === 'diagonal') { allies[2].x = actor.x + c.facing * 170; allies[2].y = actor.y + 170; allies[2].homeX = allies[2].x; allies[2].homeY = allies[2].y; }
      const before = hp(allies), enemyHp = hp(enemies);
      assert.equal(commit(c), true); assert.equal(meter(c), 0);
      advance(c, .2); assert.deepEqual(hp(allies), before); assert.deepEqual(hp(enemies), enemyHp);
      advance(c, .4); assert.ok(allies[0].currentHp > before[0]); assert.ok(allies[1].currentHp > before[1]);
      assert.equal(allies[2].currentHp, before[2], geometry + ': outside ally healed'); assert.deepEqual(hp(enemies), enemyHp);
      const after = hp(allies); advance(c, 2); assert.deepEqual(hp(allies), after, 'burst repeated'); assert.deepEqual(hp(enemies), enemyHp);
    }
  });
  test(`W15 ${mode} ${side}: an ally moving out of220px during startup is not healed remotely`, () => {
    const c = fixture(mode, side), { actor, allies } = c; assert.equal(commit(c), true);
    allies[1].x = allies[1].homeX = actor.x + c.facing * 360;
    advance(c, .6); assert.ok(actor.currentHp > 500); assert.equal(allies[1].currentHp, 500); assert.equal(allies[2].currentHp, 500);
  });
}
