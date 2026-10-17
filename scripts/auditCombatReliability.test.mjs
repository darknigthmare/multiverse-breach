import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { applyCombatHealing } from '../src/game/combatHealing.js';
let vite;
let EngineTactics;
const engines = [];
const createEngine = () => {
  const hero = { id: 'audit-hero', name: 'Audit Hero', universe: 'Nexus de Convergence', category: 'audit',
    stats: { hp: 1000, atk: 100, def: 0, spd: 20 }, simple: { name: 'Strike', type: 'melee', dmg: 1 },
    secondary: { name: 'Shot', type: 'bullet', cd: 2, dmg: 2 }, special: { name: 'Burst', dmg: 3 },
    defense: { name: 'Guard', reduce: 0.4, dur: 2 } };
  const enemy = { id: 'audit-enemy', name: 'Audit Enemy', hp: 10000, atk: 10, def: 0, spd: 1, weapon: 'melee' };
  const engine = new EngineTactics(760, 420, [hero], { monsters: [enemy], bosses: [], customRoster: [enemy] },
    { add() {} }, () => {}, () => {}, { universe: 'Nexus de Convergence', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine);
  engine.objective = 'survive'; engine.objectiveTarget = 10000;
  engine.tiles = []; engine.obstacles = []; engine.timers.clear();
  return engine;
};
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

test('600 ms tactical actions resolve after exactly 36 simulation updates', () => {
  const engine = createEngine(); let hits = 0;
  engine.schedule(() => { hits++; }, 600);
  for (let i = 0; i < 35; i++) engine.update();
  assert.equal(hits, 0); engine.update(); assert.equal(hits, 1);
  for (let i = 0; i < 50; i++) engine.update();
  assert.equal(hits, 1);
});

test('pause preserves remaining time, x2 uses twice as many simulation steps', () => {
  const engine = createEngine(); let done = false;
  engine.schedule(() => { done = true; }, 600);
  for (let i = 0; i < 10; i++) engine.update();
  engine.setPaused(true);
  for (let i = 0; i < 1000; i++) engine.update();
  assert.equal(done, false);
  assert.equal([...engine.timers][0].ticks, 26);
  engine.setPaused(false);
  for (let frame = 0; frame < 12; frame++) { engine.update(); engine.update(); }
  assert.equal(done, false); engine.update(); assert.equal(done, false); engine.update(); assert.equal(done, true);
});

test('callbacks queued by callbacks wait for the next tick and disposal cancels all', () => {
  const engine = createEngine(); const events = [];
  engine.schedule(() => { events.push('first'); engine.schedule(() => events.push('second'), 0); }, 0);
  engine.update(); assert.deepEqual(events, ['first']);
  engine.update(); assert.deepEqual(events, ['first', 'second']);
  engine.schedule(() => events.push('late'), 0); engine.dispose(); engine.advanceScheduledActions();
  assert.deepEqual(events, ['first', 'second']); assert.equal(engine.timers.size, 0);
});

test('terminal completion cancels later callbacks in the same scheduled batch', () => {
  const engine = createEngine(); let hit = false;
  engine.schedule(() => engine.completeBattle('victory'), 0);
  engine.schedule(() => { hit = true; }, 0);
  engine.advanceScheduledActions();
  assert.equal(hit, false); assert.equal(engine.timers.size, 0);
});

test('barrels damage all eight adjacent cells but not a unit two tiles away', () => {
  const engine = createEngine();
  const cells = [[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  engine.heroes = cells.map(([x,y], index) => ({ ...engine.heroes[0], id: `h${index}`, gridX: 3+x, gridY: 2+y, currentHp: 1000 }));
  engine.enemies[0].gridX = 5; engine.enemies[0].gridY = 2;
  const farHp = engine.enemies[0].currentHp;
  engine.triggerBarrelExplosion(3, 2);
  assert.ok(engine.heroes.every(hero => hero.currentHp < 1000));
  assert.equal(engine.enemies[0].currentHp, farHp);
});

test('barrel chain propagates horizontally, vertically and diagonally once', () => {
  const engine = createEngine();
  engine.obstacles = [
    { type: 'barrel', gridX: 2, gridY: 2, hp: 0 },
    { type: 'barrel', gridX: 3, gridY: 2, hp: 100 },
    { type: 'barrier', gridX: 2, gridY: 3, hp: 150 },
    { type: 'barrier', gridX: 1, gridY: 1, hp: 150 },
    { type: 'barrel', gridX: 4, gridY: 2, hp: 100 }
  ];
  engine.triggerBarrelExplosion(2, 2);
  assert.deepEqual(engine.obstacles.map(o => o.hp), [0, 0, 50, 50, 100]);
  assert.equal(engine.timers.size, 1);
  for (let i = 0; i < 12; i++) engine.advanceScheduledActions();
  assert.equal(engine.obstacles[4].hp, 0); assert.equal(engine.timers.size, 1);
  for (let i = 0; i < 12; i++) engine.advanceScheduledActions();
  assert.equal(engine.timers.size, 0);
});

test('tactical pickup healing respects radiation and counts only actual healing', () => {
  const engine = createEngine(); const hero = engine.heroes[0];
  hero.currentHp = 480; hero.statusEffects.radiated = 100;
  engine.applyTacticalBattleItem({ effect: { heal: 100 }, gridX: hero.gridX, gridY: hero.gridY });
  assert.equal(hero.currentHp, 500); assert.equal(engine.tacticalItemImpact, 20);
  hero.currentHp = 800;
  engine.applyTacticalBattleItem({ effect: { heal: 100 }, gridX: hero.gridX, gridY: hero.gridY });
  assert.equal(hero.currentHp, 800); assert.equal(engine.tacticalItemImpact, 20);
});

test('tactical healing tiles respect radiation without damaging a hero above cap', () => {
  const engine = createEngine(); const hero = engine.heroes[0];
  engine.tiles = [{ x: hero.gridX, y: hero.gridY, type: 'heal' }];
  hero.currentHp = 499; hero.statusEffects.radiated = 100;
  engine.applyStartTileEffect(hero); assert.equal(hero.currentHp, 500);
  hero.currentHp = 800; engine.applyStartTileEffect(hero); assert.equal(hero.currentHp, 800);
});

test('tactical drain and damage statistics use actual loss, not overkill', () => {
  const engine = createEngine(); const hero = engine.heroes[0]; const enemy = engine.enemies[0];
  hero.talent = 'lifedrain'; hero.currentHp = 480; hero.statusEffects.radiated = 100;
  enemy.currentHp = 10;
  engine.applyDamage(hero, enemy, 10000, null, { ignoreCover: true });
  assert.equal(hero.currentHp, 481); assert.equal(engine.damageDealt, 10);
  enemy.currentHp = 1000; hero.currentHp = 800;
  engine.applyDamage(hero, enemy, 100, null, { ignoreCover: true });
  assert.equal(hero.currentHp, 800);
});

const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const supportStart = source.indexOf('const supportActorsByBattleItem =');
const supportEnd = source.indexOf('const activateBattleItem =', supportStart);
const support = new Function('applyCombatHealing', 'grantBattleItemShield', `${source.slice(supportStart, supportEnd)};return supportActorsByBattleItem;`)(applyCombatHealing, () => {});
test('actual GameCanvas pickup support respects radiation, non-revival and charge', () => {
  const actors = [480,800,0].map(currentHp => ({ currentHp, maxHp: 1000, statusEffects: { radiated: 100 }, specialCharge: 0 }));
  support({}, actors, actors[0], { heal: 100, charge: 10 }, '#fff');
  assert.deepEqual(actors.map(actor => actor.currentHp), [500,800,0]);
  assert.deepEqual(actors.map(actor => actor.specialCharge), [10,5,0]);
});

test('the escort briefing uses the engine escortUnit and roster is memoized', () => {
  assert.match(source, /engineRef\.current\?\.escortUnit &&/);
  assert.match(source, /const HEROES_DB = useMemo\(/);
  assert.doesNotMatch(source, /currentHp = Math\.min\(maxHp, actor\.currentHp \+/);
});
