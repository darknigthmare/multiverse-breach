import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
let EngineRpg;
let HEROES_DB;
let calculateRpgDamage;
const engines = [];
const noop = () => {};
const heroData = id => ({
  id, name: id, category: 'rpg-regression', weaponType: 'melee',
  primaryColor: '#39c5bb', secondaryColor: '#ff9900',
  stats: { hp: 240, atk: 30, def: 20, spd: 5 },
  simple: { name: 'Strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Shot', type: 'bullet', dmg: 1.5, cd: 3 },
  defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 2 },
  special: { name: 'Finisher', type: 'melee', dmg: 2 }
});
const enemyData = id => ({ ...heroData(id), stats: undefined, hp: 260, atk: 30, def: 20, spd: 5, weapon: 'melee' });
const makeEngine = (heroes = [heroData('one'), heroData('two'), heroData('three')], enemies = [enemyData('alpha'), enemyData('beta'), enemyData('gamma')], options = {}) => {
  const calls = [];
  const engine = new EngineRpg(760, 420, heroes, {
    monsters: enemies, bosses: [], customRoster: enemies
  }, { add: (...args) => calls.push(args) }, noop, noop, {
    universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: options.control || 'p2' }
  });
  engine.heroes.forEach(unit => { unit.atb = 100; unit.specialCharge = 100; });
  engine.enemies.forEach(unit => { unit.atb = 100; unit.specialCharge = 100; });
  engine.enemyGlobalRecovery = 0;
  engine.particleCalls = calls;
  engines.push(engine);
  return engine;
};
const tick = (engine, count = 20) => { for (let frame = 0; frame < count; frame++) engine.update(); };
const id = unit => unit.battleId;
const costs = unit => ({ atb: unit.atb, cooldown: unit.cooldown, charge: unit.specialCharge });

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?rpg-targeting-tests'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js?rpg-targeting-tests'));
  ({ calculateRpgDamage } = await vite.ssrLoadModule('/src/game/rpgTargeting.js?rpg-targeting-tests'));
});

after(async () => {
  engines.forEach(engine => engine.dispose());
  await vite?.close();
});

for (const side of ['player', 'enemy']) test('RPG explicit single target previews and hits only the selected identity for ' + side, () => {
  const engine = makeEngine();
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const opponents = side === 'player' ? engine.enemies : engine.heroes;
  const initialCosts = costs(actor);
  const hp = opponents.map(unit => unit.currentHp);
  assert.equal(engine.beginTargeting(id(actor), 'simple', side), true);
  assert.equal(engine.beginTargeting(id(actor), 'secondary', side), false, 'another command replaced the pending selection');
  assert.equal(engine.selectTarget(id(opponents[2])), true);
  assert.deepEqual(engine.getTargetingState().previewTargetIds, [id(opponents[2])]);
  assert.deepEqual(costs(actor), initialCosts);
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(actor.atb, 0);
  assert.equal(actor.facing, Math.sign(opponents[2].x - actor.x));
  tick(engine, 11);
  assert.deepEqual(opponents.map(unit => unit.currentHp), hp, 'melee impact arrived before tick 12');
  tick(engine, 1);
  assert.equal(opponents[0].currentHp, hp[0]);
  assert.equal(opponents[1].currentHp, hp[1]);
  assert.ok(opponents[2].currentHp < hp[2]);
  assert.equal(actor.x, actor.homeX);
  assert.equal(actor.y, actor.homeY);
  assert.equal(actor.facing, Math.sign(opponents[2].x - actor.homeX));
});

test('RPG invalid cooldown, charge, dead target and cancellation spend nothing', () => {
  const engine = makeEngine();
  const actor = engine.heroes[0];
  actor.cooldown = 40;
  actor.specialCharge = 99;
  const before = costs(actor);
  assert.equal(engine.triggerAbility(actor, 'secondary'), false);
  assert.equal(engine.triggerAbility(actor, 'special'), false);
  assert.deepEqual(costs(actor), before);
  assert.equal(engine.beginTargeting(actor, 'simple'), true);
  assert.equal(engine.cancelTargeting(), true);
  assert.deepEqual(costs(actor), before);
  assert.equal(engine.beginTargeting(actor, 'simple'), true);
  const selectedId = engine.getTargetingState().previewTargetIds[0];
  const selected = engine.enemies.find(unit => id(unit) === selectedId);
  selected.currentHp = 0;
  selected.state = 'dead';
  assert.equal(engine.confirmTargeting(), false);
  assert.deepEqual(costs(actor), before);
  assert.equal(engine.getTargetingState().valid, false);
  assert.deepEqual(engine.getTargetingState().previewTargetIds, []);
  engine.cancelTargeting();
});

test('RPG Patch de Trame heals a wounded ally and cannot target a hostile unit', () => {
  const mirelle = HEROES_DB.find(hero => hero.id === 'arca_mirelle');
  const engine = makeEngine([mirelle, heroData('patient'), heroData('healthy')]);
  const actor = engine.heroes[0];
  const patient = engine.heroes[1];
  patient.currentHp -= 80;
  const enemyHp = engine.enemies.map(unit => unit.currentHp);
  const initialHp = patient.currentHp;
  assert.equal(engine.beginTargeting(actor, 'secondary'), true);
  const state = engine.getTargetingState();
  assert.equal(state.effect, 'heal');
  assert.equal(state.shape, 'single');
  assert.deepEqual(state.eligibleTargets.map(unit => unit.id), [id(patient)]);
  assert.equal(engine.selectTarget(id(engine.enemies[0])), false);
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, 18);
  assert.ok(patient.currentHp > initialHp);
  assert.equal(patient.currentHp, initialHp + Math.round(actor.stats.atk * mirelle.secondary.dmg));
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), enemyHp);
});

test('RPG Ligne de Vie Nexus heals the eligible squad, not enemies or dead allies', () => {
  const loom = HEROES_DB.find(hero => hero.id === 'arca_loom');
  const engine = makeEngine([loom, heroData('wounded'), heroData('fallen')]);
  const actor = engine.heroes[0];
  actor.currentHp -= 70;
  engine.heroes[1].currentHp -= 70;
  engine.heroes[2].currentHp = 0;
  engine.heroes[2].state = 'dead';
  const enemyHp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.beginTargeting(actor, 'special'), true);
  assert.equal(engine.getTargetingState().shape, 'group');
  assert.deepEqual(engine.getTargetingState().previewTargetIds, engine.heroes.slice(0, 2).map(id));
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, 18);
  assert.ok(actor.currentHp > actor.maxHp - 70);
  assert.ok(engine.heroes[1].currentHp > engine.heroes[1].maxHp - 70);
  assert.equal(engine.heroes[2].currentHp, 0, 'heal was silently converted into revive');
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), enemyHp);
});

test('RPG medical summons, buffs and revive keep their support semantics', () => {
  const loom = HEROES_DB.find(hero => hero.id === 'arca_loom');
  const engine = makeEngine([loom, { ...heroData('buffer'), secondary: { type: 'buff', dmg: 1.1, cd: 3 } }, { ...heroData('reviver'), special: { type: 'revive', reviveRatio: 0.5 } }]);
  const actor = engine.heroes[0];
  actor.currentHp -= 50;
  assert.equal(engine.beginTargeting(actor, 'secondary'), true);
  assert.equal(engine.getTargetingState().effect, 'heal');
  engine.cancelTargeting();
  assert.equal(engine.beginTargeting(engine.heroes[1], 'secondary'), true);
  assert.equal(engine.getTargetingState().eligibleTargets.every(unit => unit.side === 'player'), true);
  engine.selectTarget(id(actor));
  engine.confirmTargeting();
  tick(engine, 18);
  assert.ok(actor.rpgBuffTicks > 0);
  assert.ok(actor.rpgBuffMultiplier > 1);
  actor.currentHp = 0;
  actor.state = 'dead';
  assert.equal(engine.beginTargeting(engine.heroes[2], 'special'), true);
  assert.deepEqual(engine.getTargetingState().previewTargetIds, [id(actor)]);
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, 18);
  assert.equal(actor.currentHp, Math.round(actor.maxHp * 0.5));
  assert.equal(actor.state, 'idle');
});

for (const shape of ['single', 'multi', 'group', 'area', 'line', 'cone']) test('RPG ' + shape + ' resolves identical preview and impact sets', () => {
  const attack = { name: shape, type: 'bullet', dmg: 1, cd: 3, rpgProfile: { shape, maxTargets: shape === 'multi' ? 2 : undefined, areaRadius: 65, lineWidth: 30, coneAngle: 30 } };
  const engine = makeEngine([{ ...heroData('geometry'), secondary: attack }]);
  const actor = engine.heroes[0];
  actor.x = actor.homeX = 100;
  actor.y = actor.homeY = 250;
  const positions = shape === 'line' || shape === 'cone' ? [[500, 250], [550, 260], [560, 380]] : [[500, 250], [540, 270], [700, 380]];
  engine.enemies.forEach((unit, index) => {
    unit.x = unit.homeX = positions[index][0];
    unit.y = unit.homeY = positions[index][1];
  });
  assert.equal(engine.beginTargeting(actor, 'secondary'), true);
  const expected = engine.getTargetingState().previewTargetIds;
  assert.equal(expected.length, shape === 'single' ? 1 : shape === 'group' ? 3 : 2);
  const hp = new Map(engine.enemies.map(unit => [id(unit), unit.currentHp]));
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, 18);
  const damaged = engine.enemies.filter(unit => unit.currentHp < hp.get(id(unit))).map(id);
  assert.deepEqual(damaged, expected);
});

test('RPG finite multi-target selection enforces its authored maximum', () => {
  const engine = makeEngine([{ ...heroData('multi'), special: { name: 'Two shots', type: 'bullet', dmg: 1, targetCount: 2 } }]);
  assert.equal(engine.beginTargeting(engine.heroes[0], 'special'), true);
  assert.equal(engine.getTargetingState().maxTargets, 2);
  assert.equal(engine.selectTarget(id(engine.enemies[2])), false);
  assert.equal(engine.selectTarget(id(engine.enemies[0])), true);
  assert.equal(engine.selectTarget(id(engine.enemies[2])), true);
  assert.deepEqual(engine.getTargetingState().previewTargetIds, [id(engine.enemies[1]), id(engine.enemies[2])]);
  engine.cancelTargeting();
});

test('RPG never retargets a queued action after target death and stops dead casters', () => {
  for (const deadActor of [false, true]) {
    const engine = makeEngine();
    const actor = engine.heroes[0];
    const target = engine.enemies[1];
    const hp = engine.enemies.map(unit => unit.currentHp);
    engine.triggerAbility(actor, 'simple', [id(target)]);
    const dead = deadActor ? actor : target;
    dead.currentHp = 0;
    dead.state = 'dead';
    tick(engine, 12);
    assert.equal(engine.enemies[0].currentHp, hp[0]);
    assert.equal(engine.enemies[2].currentHp, hp[2]);
    assert.equal(target.currentHp, deadActor ? hp[1] : 0);
    assert.equal(actor.actionPending, false);
  }
});

test('RPG wait/active mode freezes or advances all simulation action clocks explicitly', () => {
  const engine = makeEngine();
  engine.triggerEnemyAbility(engine.enemies[0], 'simple', [id(engine.heroes[1])]);
  const hp = engine.heroes[1].currentHp;
  const queueTicks = engine.actionQueue[0].ticks;
  engine.beginTargeting(engine.heroes[0], 'simple');
  tick(engine, 60);
  assert.equal(engine.actionQueue[0].ticks, queueTicks);
  assert.equal(engine.heroes[1].currentHp, hp);
  assert.equal(engine.isTargetingPaused(), true);
  engine.setTargetingWait(false);
  assert.equal(engine.isTargetingPaused(), false);
  tick(engine, 12);
  assert.ok(engine.heroes[1].currentHp < hp);
  engine.cancelTargeting();
});

test('RPG pause holds impacts at the exact simulation tick and dispose clears them', () => {
  const engine = makeEngine();
  const actor = engine.heroes[0];
  const target = engine.enemies[0];
  engine.triggerAbility(actor, 'secondary', [id(target)]);
  const hp = target.currentHp;
  tick(engine, 17);
  engine.setPaused(true);
  tick(engine, 100);
  assert.equal(target.currentHp, hp);
  engine.setPaused(false);
  tick(engine, 1);
  assert.ok(target.currentHp < hp);
  engine.dispose();
  assert.deepEqual(engine.actionQueue, []);
});

test('RPG ranged FX aims toward the selected target from either camp and never lunges', () => {
  for (const side of ['player', 'enemy']) {
    const engine = makeEngine();
    const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
    const target = side === 'player' ? engine.enemies[2] : engine.heroes[2];
    const start = { x: actor.x, y: actor.y };
    const context = engine.getActionContext(actor, 'secondary', side);
    engine.executeRpgAction(context, [id(target)]);
    const ray = engine.particleCalls.find(call => call[7] === 'laser_line');
    assert.ok(ray);
    assert.equal(Math.sign(ray[2]), Math.sign(target.x - actor.x));
    assert.equal(Math.sign(ray[3]), Math.sign(target.y - actor.y));
    assert.deepEqual({ x: actor.x, y: actor.y }, start);
  }
});

test('RPG clamps sprite and HP/ATB envelopes, including huge authored bosses', () => {
  const engine = makeEngine(undefined, [
    { ...enemyData('giant'), isBoss: true, isWorldBoss: true, renderHeight: 620, anchor: { x: 0.99, y: 0.99 } },
    { ...enemyData('edge'), isBoss: true, renderHeight: 450, anchor: { x: 0.01, y: 0.1 } }
  ]);
  for (const unit of [...engine.heroes, ...engine.enemies]) {
    const bounds = engine.getCombatantBounds(unit);
    assert.ok(unit.x - bounds.halfWidth >= 0, unit.name + ' clips left');
    assert.ok(unit.x + bounds.halfWidth <= engine.width, unit.name + ' clips right');
    assert.ok(unit.y - bounds.top >= 0, unit.name + ' clips top');
    assert.ok(unit.y + bounds.bottom <= engine.height, unit.name + ' clips bottom');
    assert.ok(unit.homeY >= engine.height * (engine.getFloorHorizon() + 0.08));
  }
});

test('RPG DEF and guard reduce damage exactly once and identically for both camps', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const enemy = engine.enemies[0];
  hero.stats.def = enemy.def = 25;
  hero.state = enemy.state = 'defense';
  hero.defense = enemy.defense = { reduce: 0.4 };
  assert.equal(calculateRpgDamage(hero, 100), 48);
  assert.equal(calculateRpgDamage(enemy, 100), 48);
  hero.rpgGuardTicks = 60;
  hero.rpgGuardReduce = 0.2;
  assert.equal(calculateRpgDamage(hero, 100), 48, 'support guard multiplied a second reduction');
  const random = Math.random;
  Math.random = () => 0.5;
  try {
    const heroHp = hero.currentHp;
    const enemyHp = enemy.currentHp;
    engine.applyDamage(enemy, hero, 100);
    engine.applyDamage(hero, enemy, 100);
    assert.equal(heroHp - hero.currentHp, 48);
    assert.equal(enemyHp - enemy.currentHp, 48);
  } finally { Math.random = random; }
});

test('RPG auto support eligibility falls back to an attack without spending an unusable heal', () => {
  const mirelle = HEROES_DB.find(hero => hero.id === 'arca_mirelle');
  const engine = makeEngine([mirelle]);
  const actor = engine.heroes[0];
  actor.specialCharge = 0;
  engine.autoBattle = true;
  tick(engine, 1);
  assert.equal(actor.actionPending, true);
  assert.equal(actor.cooldown, 0, 'auto consumed a heal cooldown while every ally was full');
  assert.equal(engine.targeting, null, 'auto opened manual UI');
  assert.equal(engine.getActionContext(actor, 'simple').profile.delivery, 'ranged', 'Mirelle bullet was treated as melee');
});
