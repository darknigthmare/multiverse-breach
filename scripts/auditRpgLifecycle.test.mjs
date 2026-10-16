import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';

let vite, EngineRpg, targeting, booster;
const engines = [];
const hero = (id, secondary = { type: 'bullet', dmg: 1, cd: 3 }) => ({
  id, name: id, category: 'regression', universe: 'Nexus de Convergence',
  stats: { hp: 200, atk: 20, def: 0, spd: 1 }, primaryColor: '#39c5bb',
  simple: { type: 'melee', dmg: 1 }, secondary,
  special: { type: 'revive', reviveRatio: 0.3 }, defense: { type: 'shield', dur: 1, reduce: 0.4 }
});
const make = (options = {}) => {
  const enemies = [hero('enemy-a'), hero('enemy-b')].map(h => ({ ...h, stats: undefined, hp: 300, atk: 20, spd: 1 }));
  const calls = [];
  const engine = new EngineRpg(760, 420, [hero('caster', options.secondary), hero('patient'), hero('medic')],
    { customRoster: enemies, monsters: enemies, bosses: [] }, { add: (...args) => calls.push(args) }, () => {},
    result => calls.push(['complete', result]), { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = 100; unit.specialCharge = 100; });
  engine.enemyGlobalRecovery = 0;
  engine.calls = calls;
  engines.push(engine);
  return engine;
};
const ticks = (engine, count) => { for (let i = 0; i < count; i++) engine.update(); };
const costs = actor => [actor.atb, actor.cooldown, actor.specialCharge];
const ready = actor => { actor.state = 'idle'; actor.stateTimer = 0; actor.atb = 100; actor.cooldown = 0; actor.specialCharge = 100; };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  targeting = await vite.ssrLoadModule('/src/game/rpgTargeting.js');
  booster = await vite.ssrLoadModule('/src/game/portalBoosterEngine.js');
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });

for (const side of ['player', 'enemy']) test(`RPG ${side}: a dead caster's old attack cannot return with a resurrection`, () => {
  const e = make(); const allies = side === 'player' ? e.heroes : e.enemies;
  const opponents = side === 'player' ? e.enemies : e.heroes;
  const caster = allies[0], target = opponents[0], medic = allies[1];
  // Revive arrives on tick 18, old attack would arrive on tick 19.
  e.scheduleAction(() => {
    assert.equal(e.executeRpgAction(e.getActionContext(caster, 'secondary', side), [target.battleId]), true);
    e.applyDamage(target, caster, 10000);
    assert.equal(caster.currentHp, 0);
    assert.equal(e.executeRpgAction(e.getActionContext(medic, 'special', side), [caster.battleId]), true);
  }, 0);
  // Both casts use ranged/support delivery. Make the revive land first explicitly.
  ticks(e, 1);
  const queued = e.actionQueue.find(action => action.actor === medic) || e.actionQueue.at(-1);
  queued.ticks = 1;
  ticks(e, 1);
  assert.ok(caster.currentHp > 0);
  const hp = target.currentHp;
  ticks(e, 25);
  assert.equal(target.currentHp, hp, 'a pre-death cast dealt damage after revival');
  assert.equal(caster.actionPending, false);
});

for (const side of ['player', 'enemy']) test(`RPG ${side}: removed combatants cannot deliver queued impacts`, () => {
  const e = make(); const caster = side === 'player' ? e.heroes[0] : e.enemies[0];
  const target = side === 'player' ? e.enemies[0] : e.heroes[0];
  assert.equal(e.executeRpgAction(e.getActionContext(caster, 'secondary', side), [target.battleId]), true);
  if (side === 'player') e.heroes = e.heroes.filter(h => h !== caster);
  else e.enemies = e.enemies.filter(h => h !== caster);
  const hp = target.currentHp;
  ticks(e, 20);
  assert.equal(target.currentHp, hp);
  assert.equal(caster.actionPending, false);
  if (side === 'enemy') assert.equal(e.enemyActionLock, false);
});

test('RPG stale target contexts cannot spend ATB, cooldown or charge', () => {
  const e = make(); const caster = e.heroes[0], target = e.enemies[0];
  const context = e.getActionContext(caster, 'secondary');
  target.currentHp = 0; target.state = 'dead';
  const before = costs(caster);
  assert.equal(e.executeRpgAction(context, [target.battleId]), false);
  assert.deepEqual(costs(caster), before);
});

test('RPG callback cancellation applies to callbacks already due on this tick', () => {
  const e = make(); const caster = e.heroes[0], enemy = e.enemies[0];
  e.scheduleAction(() => {
    e.applyDamage(enemy, caster, 10000);
    caster.currentHp = 60; caster.state = 'idle';
  }, 300);
  e.triggerAbility(caster, 'secondary', [enemy.battleId]);
  const hp = enemy.currentHp;
  ticks(e, 18);
  assert.equal(enemy.currentHp, hp);
});

test('RPG direct negative damage cannot stagger or weaken a target', () => {
  const e = make(); const attacker = e.heroes[0], defender = e.enemies[0];
  attacker.talent = 'suppressing_fire'; defender.def = 30;
  const before = structuredClone(defender);
  assert.equal(e.applyDamage(attacker, defender, -5), 0);
  assert.deepEqual(defender, before);
});

for (const status of ['infected', 'glitched', 'radiated']) test(`RPG reapplying ${status} cannot shorten a stronger existing duration`, () => {
  const e = make(); const defender = e.enemies[0];
  defender.statusEffects[status] = 900;
  e.applyDamage(e.heroes[0], defender, 1, status);
  assert.equal(defender.statusEffects[status], 900);
});

for (const hp of [NaN, Infinity, '0']) test(`RPG invalid HP ${String(hp)} cannot enter a revival target set`, () => {
  const e = make(); e.heroes[1].currentHp = hp;
  assert.deepEqual(e.getActionContext(e.heroes[0], 'special').eligibleTargets, []);
});

test('RPG revival preview agrees with the minimum one-HP recovery', () => {
  const e = make(); const caster = e.heroes[0], patient = e.heroes[1];
  caster.special = { type: 'revive', reviveRatio: 0.01 }; patient.maxHp = 20; patient.currentHp = 0; patient.state = 'dead';
  assert.equal(e.beginTargeting(caster, 'special'), true);
  assert.equal(e.getTargetingState().estimates[0].amount, 1);
  assert.equal(e.confirmTargeting(), true); ticks(e, 18); assert.equal(patient.currentHp, 1);
});

test('RPG heal plus cleanse may target an irradiated ally already at the healing cap', () => {
  const e = make({ secondary: { type: 'heal', dmg: 2, cd: 3, cleanses: true } });
  const caster = e.heroes[0], patient = e.heroes[1]; patient.currentHp = 100; patient.statusEffects.radiated = 300;
  assert.equal(e.beginTargeting(caster, 'secondary'), true);
  assert.deepEqual(e.getTargetingState().previewTargetIds, [patient.battleId]);
  assert.equal(e.confirmTargeting(), true); ticks(e, 18);
  assert.equal(patient.currentHp, 100, 'existing heal-then-cleanse ordering must stay compatible');
  assert.equal(patient.statusEffects.radiated, 0);
});

test('RPG selective cleansing removes only the authored statuses', () => {
  const e = make({ secondary: { type: 'cleanse', cd: 3, cleanses: ['infected'] } });
  const patient = e.heroes[1]; patient.statusEffects = { infected: 500, radiated: 500, glitched: 0, positiveAura: 600 };
  assert.equal(e.triggerAbility(e.heroes[0], 'secondary', [patient.battleId]), true);
  ticks(e, 18);
  assert.equal(patient.statusEffects.infected, 0);
  assert.ok(patient.statusEffects.radiated > 0);
  assert.equal(patient.statusEffects.positiveAura, 600);
});

test('RPG a cleanse cannot spend an action on a status it does not remove', () => {
  const e = make({ secondary: { type: 'cleanse', cd: 3, cleanses: ['infected'] } });
  e.heroes[1].statusEffects.radiated = 300;
  assert.equal(e.triggerAbility(e.heroes[0], 'secondary'), false);
  assert.equal(e.heroes[0].atb, 100);
});

test('RPG automatic healing uses recoverable HP and preserves manual choice', () => {
  const e = make({ secondary: { type: 'heal', cd: 3, dmg: 2 } });
  const patient = e.heroes[1], other = e.heroes[2];
  patient.currentHp = 90; patient.statusEffects.radiated = 300; other.currentHp = 150;
  assert.equal(e.beginTargeting(e.heroes[0], 'secondary'), true);
  assert.deepEqual(e.getTargetingState().selectedTargetIds, [other.battleId]);
  assert.equal(e.selectTarget(patient.battleId), true);
  assert.equal(e.confirmTargeting(), true); ticks(e, 18); assert.equal(patient.currentHp, 100);
});

for (const value of [null, 12, {}]) test(`RPG malformed selected target input ${JSON.stringify(value)} fails closed`, () => {
  const e = make(); const context = e.getActionContext(e.heroes[0], 'secondary');
  assert.equal(targeting.resolveRpgTargets({ ...context, selectedTargetIds: value }).valid, false);
});

test('RPG invalidated action profiles clear targeting rather than crash the HUD', () => {
  const e = make(); e.beginTargeting(e.heroes[0], 'secondary'); delete e.heroes[0].secondary;
  assert.equal(e.getTargetingState(), null);
  assert.equal(e.targeting, null);
});

test('RPG buff and guard expire without changing prepared stats', () => {
  const e = make({ secondary: { type: 'buff', duration: 0.1, buffMultiplier: 1.5, cd: 3 } });
  const actor = e.heroes[0], target = e.heroes[1], before = { ...target.stats };
  e.triggerAbility(actor, 'secondary', [target.battleId]); ticks(e, 18);
  assert.ok(target.rpgBuffTicks > 0); ticks(e, 7); assert.equal(target.rpgBuffTicks, 0); assert.deepEqual(target.stats, before);
  ready(actor); actor.secondary = { type: 'shield', reduce: 0.6, duration: 0.1, cd: 3 };
  e.triggerAbility(actor, 'secondary', [target.battleId]); ticks(e, 18); assert.ok(target.rpgGuardTicks > 0);
  ticks(e, 7); assert.equal(target.rpgGuardTicks, 0); assert.deepEqual(target.stats, before);
});

test('RPG complete is reported once and clears all pending actions', () => {
  const e = make(); e.scheduleAction(() => assert.fail('post-battle callback ran'), 10000);
  e.enemies.forEach(enemy => { enemy.currentHp = 0; enemy.state = 'dead'; });
  ticks(e, 300);
  assert.deepEqual(e.calls.filter(call => call[0] === 'complete'), [['complete', 'victory']]);
  assert.equal(e.actionQueue.length, 0);
});

test('Booster hero streak counts trailing duplicates in reveal order and ignores cosmetics', () => {
  assert.equal(typeof booster.advanceBoosterHeroStreak, 'function');
  const update = booster.advanceBoosterHeroStreak;
  assert.equal(update(4, [{ kind: 'skin', wasDuplicate: true }]), 4);
  assert.equal(update(4, [{ kind: 'hero', wasDuplicate: true }]), 5);
  assert.equal(update(4, [{ kind: 'hero', wasDuplicate: false }, { kind: 'hero', wasDuplicate: true }]), 1);
  assert.equal(update(4, [{ kind: 'hero', wasDuplicate: true }, { kind: 'hero', wasDuplicate: false }]), 0);
  assert.equal(update(NaN, []), 0);
  const source = readFileSync(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /duplicateStreak:\s*advanceBoosterHeroStreak\(previous\?\.duplicateStreak, rewards\)/);
});
