import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
let vite, EngineTactics, val;
const engines = [], noop = () => {};
const stop = e => { for (const timer of e.timers) clearTimeout(timer); e.timers.clear(); };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, watch: null } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?val-healing-w15'));
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  val = HEROES_DB.find(hero => hero.id === 'evolve_val'); assert.ok(val);
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => vite?.close());
const fixture = id => ({ id, name: id, universe: 'Nexus de Convergence', category: 'fixture', weaponType: 'rifle', primaryColor: '#70adbf',
  stats: { hp: 10000, atk: 20, def: 5, spd: 1 }, simple: { name: 'Fixture shot', type: 'bullet', dmg: 1 },
  secondary: { name: 'Fixture strong shot', type: 'bullet', dmg: 2, cd: 3 },
  special: { name: 'Fixture special', type: 'bullet', dmg: 3 }, defense: { name: 'Fixture guard', type: 'guard', dur: 1, reduce: .3 } });
function place(e, unit, x, y, layer = 'ground') {
  Object.assign(unit, { gridX: x, gridY: y });
  if (e.verticalTerrain) {
    const surface = e.terrain.byId.get(`${layer}:${x}:${y}`); assert.ok(surface);
    Object.assign(unit, { surfaceId: surface.id, gridZ: surface.z });
  }
  e.syncActorsToCamera();
}
function make(field, side) {
  const party = [val, fixture('near'), fixture('far')], opponents = [fixture('opponent-one'), fixture('opponent-two')];
  const players = side === 'hero' ? party : opponents, enemies = side === 'hero' ? opponents : party;
  const e = new EngineTactics(1050, 700, players, { monsters: enemies, bosses: [], customRoster: enemies }, { add: noop }, noop, noop,
    { mode: 'Tactics', universe: 'Nexus de Convergence', tacticsBattlefieldId: field, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); stop(e); e.obstacles = [];
  const own = side === 'hero' ? e.heroes : e.enemies, enemy = side === 'hero' ? e.enemies : e.heroes;
  const [actor, near, far] = own, y = e.verticalTerrain ? 5 : 2;
  place(e, actor, 2, y); place(e, near, 3, y + 1); place(e, far, 5, y);
  place(e, enemy[0], 3, y); place(e, enemy[1], 6, y);
  for (const unit of own) unit.currentHp = Math.round(unit.maxHp * .5);
  actor.specialCharge = 100; actor.cooldown = 0;
  e.activeUnit = actor; e.activeUnitType = side; e.actionPhase = 'move'; e.movementBudget = 2; e.movementSpent = 0;
  e.selectedAction = null; e.calculateMovementRange();
  return { e, actor, near, far, own, enemy, side, y };
}
const click = (e, unit) => e.handleCellClick(unit.gridX, unit.gridY, unit.surfaceId);

for (const field of ['training_grid', 'nexus_skybridge']) for (const side of ['hero', 'enemy']) {
  test(`${field}/${side}: Healing Burst is a bounded zero-damage two-cell group heal`, () => {
    const { e, actor, near, far } = make(field, side), p = e.getAttackProfile(actor, 'special');
    assert.equal(p.name, 'Soin du Healing Burst de Val'); assert.equal(p.effect, 'heal'); assert.equal(p.delivery, 'support');
    assert.equal(p.targetSide, 'ally'); assert.equal(p.shape, 'group'); assert.equal(p.range, 2); assert.equal(p.minRange, 0);
    assert.equal(p.multiplier, 0); assert.equal(p.healRatio, .28); assert.equal(e.getActionBaseDamage(actor, 'special'), 0);
    assert.ok(e.canAttackCell(actor, near, p)); assert.equal(e.canAttackCell(actor, far, p), false);
    assert.ok(Math.abs(e.getAttackDistance(actor, near, p) - Math.SQRT2) < .001);
  });
  test(`${field}/${side}: real self-target command heals only nearby allies, once, with one charge and turn`, () => {
    const { e, actor, near, far, enemy } = make(field, side), before = [actor, near, far, ...enemy].map(unit => unit.currentHp), turns = e.turnsElapsed;
    near.tacticsGuardTicks = 61; near.tacticsBuffTicks = 72;
    let damageCalls = 0; const applyDamage = e.applyDamage.bind(e); e.applyDamage = (...args) => { damageCalls++; return applyDamage(...args); };
    assert.equal(e.selectAction('special'), true);
    const result = click(e, actor); assert.equal(result.handled, true); stop(e);
    assert.deepEqual(result.targets.map(entry => entry.unit), [actor, near]);
    assert.equal(actor.currentHp, before[0] + Math.round(actor.maxHp * .28));
    assert.equal(near.currentHp, before[1] + Math.round(near.maxHp * .28));
    assert.equal(far.currentHp, before[2]); assert.deepEqual(enemy.map(unit => unit.currentHp), before.slice(3));
    assert.equal(damageCalls, 0); assert.equal(actor.specialCharge, 0); assert.equal(e.turnsElapsed, turns + 1);
    assert.equal(near.tacticsGuardTicks, 61); assert.equal(near.tacticsBuffTicks, 72);
    const hp = near.currentHp; assert.equal(click(e, actor).handled, false); assert.equal(near.currentHp, hp);
  });
  test(`${field}/${side}: stale, dead, removed, hostile, empty, healthy and paused anchors spend nothing`, () => {
    for (const mode of ['moved', 'dead', 'removed', 'hostile', 'empty', 'healthy', 'paused']) {
      const { e, actor, near, far, own, enemy, y } = make(field, side);
      actor.currentHp = actor.maxHp; far.currentHp = far.maxHp;
      assert.equal(e.selectAction('special'), true); const old = { ...near }, turns = e.turnsElapsed;
      let target = old;
      if (mode === 'moved') place(e, near, 6, y + 1);
      if (mode === 'dead') near.currentHp = 0;
      if (mode === 'removed') own.splice(own.indexOf(near), 1);
      if (mode === 'hostile') target = enemy[0];
      if (mode === 'empty') { place(e, near, 6, y + 1); target = old; }
      if (mode === 'healthy') near.currentHp = near.maxHp;
      if (mode === 'paused') e.setPaused(true);
      const hp = near.currentHp;
      assert.equal(click(e, target).handled, false, mode); assert.equal(near.currentHp, hp, mode);
      assert.equal(actor.specialCharge, 100, mode); assert.equal(e.turnsElapsed, turns, mode);
    }
  });
  test(`${field}/${side}: secondary cooldown and radiated HP cap are respected without cleansing or hidden damage`, () => {
    const { e, actor, near, far, enemy } = make(field, side);
    actor.currentHp = actor.maxHp; far.currentHp = far.maxHp;
    near.statusEffects.radiated = 150; near.statusEffects.infected = 99; near.currentHp = Math.round(near.maxHp * .4);
    actor.specialCharge = 23; const hp = enemy.map(unit => unit.currentHp), turns = e.turnsElapsed;
    assert.equal(e.selectAction('secondary'), true); assert.equal(click(e, actor).handled, true); stop(e);
    assert.equal(near.currentHp, near.maxHp * .5); assert.equal(near.statusEffects.radiated, 150); assert.equal(near.statusEffects.infected, 99);
    assert.equal(actor.cooldown, e.getActionDefinition(actor, 'secondary').cd * 60); assert.equal(actor.specialCharge, 48);
    assert.equal(e.turnsElapsed, turns + 1); assert.deepEqual(enemy.map(unit => unit.currentHp), hp);
  });
  test(`${field}/${side}: opaque obstructions prevent the local heal and out-of-range recipients never join it`, () => {
    const { e, actor, near, far, y } = make(field, side);
    actor.currentHp = actor.maxHp; place(e, near, 4, y);
    e.obstacles.push({ id: 'opaque-healing-wall', gridX: 3, gridY: y, surfaceId: e.verticalTerrain ? `ground:3:${y}` : undefined, hp: 100, maxHp: 100, type: 'barrier', tacticsHeight: 3 });
    const hp = [near.currentHp, far.currentHp];
    assert.deepEqual(e.applyProfiledAttack(actor, actor, 'special', 999999, null, side), []);
    assert.deepEqual([near.currentHp, far.currentHp], hp); assert.equal(actor.specialCharge, 100);
  });
  test(`${field}/${side}: the real AI uses Healing Burst on its own party and pays its special once`, async () => {
    const { e, actor, near, enemy } = make(field, side);
    actor.currentHp = actor.maxHp; e.movementBudget = 0;
    const hp = near.currentHp, hostileHp = enemy.map(unit => unit.currentHp), turns = e.turnsElapsed;
    if (side === 'hero') e.runHeroAI(); else e.runEnemyAI();
    if (e.verticalTerrain) { for (let n = 0; n < 150 && e.turnsElapsed === turns; n++) e.update(); }
    else await new Promise(resolve => setTimeout(resolve, 250));
    stop(e);
    assert.ok(near.currentHp > hp); assert.equal(actor.specialCharge, 0); assert.equal(e.turnsElapsed, turns + 1);
    assert.deepEqual(enemy.map(unit => unit.currentHp), hostileHp);
  });
}
for (const side of ['hero', 'enemy']) test(`flat/${side}: a healthy-party medic takes a defensive AI turn without spending her burst`, () => {
  const { e, actor, own } = make('training_grid', side);
  own.forEach(unit => { unit.currentHp = unit.maxHp; }); const turns = e.turnsElapsed;
  if (side === 'hero') e.runHeroAI(); else e.runEnemyAI(); stop(e);
  assert.equal(actor.specialCharge, 100); assert.equal(actor.state, 'defense'); assert.equal(e.turnsElapsed, turns + 1);
});
for (const side of ['hero', 'enemy']) test(`vertical/${side}: Healing Burst respects stacked supports, floor opacity and 3D distance`, () => {
  const { e, actor, near, far } = make('nexus_skybridge', side);
  actor.currentHp = actor.maxHp; far.currentHp = far.maxHp;
  place(e, actor, 4, 3); place(e, near, 4, 3, 'bridge');
  const hp = near.currentHp;
  assert.equal(e.canAttackCell(actor, near, 'special'), false);
  assert.deepEqual(e.applyProfiledAttack(actor, actor, 'special', 99999, null, side), []); assert.equal(near.currentHp, hp);
  const p = { ...e.getAttackProfile(actor, 'special'), pierceTerrain: true };
  assert.ok(e.getAttackDistance(actor, near, p) > 0);
  place(e, actor, 0, 6); place(e, near, 7, 3, 'bridge'); assert.equal(e.canAttackCell(actor, near, 'special'), false);
});
