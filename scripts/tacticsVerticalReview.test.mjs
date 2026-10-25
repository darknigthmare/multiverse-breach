import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';

let vite, EngineTactics;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ logLevel: 'silent', appType: 'custom', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?independent-vertical-review'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
const hero = index => ({
  id: `review-unit-${index}`, name: `Review unit ${index}`, universe: 'Nexus de Convergence', category: 'review',
  stats: { hp: 250, atk: 35, def: 0, spd: 20 }, weaponType: 'rifle',
  simple: { name: 'Physical shot', dmg: 1, targeting: { effect: 'damage', delivery: 'projectile', shape: 'single', range: 840 }, tactics: { range: 6, delivery: 'ranged', minRange: 0 } },
  secondary: { name: 'Secondary shot', dmg: 1.2, cd: 4 },
  defense: { name: 'Guard', reduce: 0.4, dur: 1 },
  special: { name: 'Special shot', dmg: 1.8 }
});
const revive = (shape = 'single') => ({
  name: 'Declared return', dmg: 0, cd: 4,
  targeting: { effect: 'revive', delivery: 'support', targetSide: 'ally', shape, range: 840, reviveRatio: 0.4 },
  tactics: { range: 6, maxTargets: 6 }
});
const make = (field = 'nexus_skybridge', count = 2) => {
  const enemies = [{ id: 'review-enemy', name: 'Review enemy', hp: 250, atk: 10, def: 0, spd: 1, weapon: 'melee' }];
  const e = new EngineTactics(1050, 700, Array.from({ length: count }, (_, index) => hero(index)),
    { monsters: enemies, bosses: [], customRoster: enemies }, { add: noop }, noop, noop,
    { universe: 'Nexus de Convergence', tacticsBattlefieldId: field, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e);
  return e;
};
const place = (e, unit, id) => {
  const surface = e.terrain.byId.get(id);
  Object.assign(unit, { surfaceId: id, gridX: surface.x, gridY: surface.y, gridZ: surface.z });
  e.syncActorsToCamera();
};
const active = (e, unit) => {
  e.activeUnit = unit; e.activeUnitType = 'hero'; e.actionPhase = 'move';
  e.movementBudget = 0; e.movementSpent = 0;
  e.selectedAction = null; e.selectedActionExplicit = false;
};

test('automatic revival keeps the selected dead ally through final action validation', () => {
  const e = make(), [healer, ally] = e.heroes;
  healer.special = revive(); healer.specialCharge = 100;
  place(e, healer, 'ground:0:0'); place(e, ally, 'ground:1:0'); ally.currentHp = 0;
  active(e, healer); e.runHeroAI();
  assert.equal(ally.currentHp, 100);
  assert.equal(healer.specialCharge, 0);
});

test('an automatic attacker killed by its landing terrain cannot fire posthumously', () => {
  const e = make('cyber_catwalks'), attacker = e.heroes[0], target = e.enemies[0];
  place(e, attacker, 'ground:5:3'); place(e, target, 'ground:6:3');
  attacker.currentHp = 5; attacker.cooldown = 1; attacker.specialCharge = 0;
  active(e, attacker); e.runHeroAI();
  assert.equal(attacker.currentHp, 0);
  assert.equal(target.currentHp, target.maxHp);
});

test('losing the moving active unit releases its turn while another ally is still alive', () => {
  const e = make(), actor = e.heroes[0];
  place(e, actor, 'ground:0:3'); place(e, e.heroes[1], 'ground:0:1');
  active(e, actor); e.movementBudget = 2; e.calculateMovementRange();
  assert.equal(e.handleSurfaceClick('stairs:1:3').handled, true);
  actor.currentHp = 0; e.update();
  assert.equal(actor.terrainMotion, undefined);
  assert.notEqual(e.actionPhase, 'moving', 'a dead actor must not leave every command locked in the movement phase');
});

test('group revival cannot create two living bodies on one vacated surface', () => {
  const e = make('nexus_skybridge', 3), [healer, first, second] = e.heroes;
  healer.secondary = revive('group'); healer.cooldown = 0;
  place(e, healer, 'ground:0:0'); place(e, first, 'ground:1:0'); place(e, second, 'ground:1:0');
  first.currentHp = second.currentHp = 0;
  active(e, healer); e.actionPhase = 'action';
  assert.equal(e.selectAction('secondary'), true);
  assert.equal(e.handleSurfaceClick('ground:1:0').handled, true);
  assert.equal([first, second].filter(unit => unit.currentHp > 0).length, 1);
});

test('a valid elevated line anchor cannot extend damage beyond the declared spatial reach', () => {
  const e = make(), attacker = e.heroes[0], target = e.enemies[0];
  attacker.simple.tactics = { range: 4, shape: 'line', delivery: 'ranged', minRange: 1, pierceUnits: true };
  place(e, attacker, 'ground:0:3'); place(e, e.heroes[1], 'ground:0:1'); place(e, target, 'bridge:4:3');
  const anchor = { gridX: 3, gridY: 3, surfaceId: 'stairs:3:3' };
  const profile = e.getAttackProfile(attacker, 'simple');
  assert.equal(e.canAttackCell(attacker, anchor, profile), true);
  assert.ok(e.getAttackDistance(attacker, target, profile) > profile.range);
  active(e, attacker); e.actionPhase = 'action'; e.selectAction('simple');
  const charge = attacker.specialCharge;
  assert.equal(e.handleSurfaceClick(anchor.surfaceId).handled, false);
  assert.equal(target.currentHp, target.maxHp);
  assert.equal(attacker.specialCharge, charge);
});

test('a unit killed by its start-of-turn terrain cannot act or spend resources', () => {
  const e = make('cyber_catwalks'), actor = e.heroes[0], target = e.enemies[0];
  place(e, actor, 'ground:5:3'); place(e, target, 'ground:6:3');
  actor.currentHp = 5; actor.specialCharge = 100;
  e.turnQueue = [{ unit: actor, type: 'hero' }, { unit: e.heroes[1], type: 'hero' }];
  e.startTurn();
  assert.equal(actor.currentHp, 0);
  e.selectAction('special');
  assert.equal(e.handleSurfaceClick(target.surfaceId).handled, false);
  assert.equal(target.currentHp, target.maxHp);
  assert.equal(actor.specialCharge, 100);
});

for (const [type, objective, keyName] of [['portalSpawn', 'portals', 'sealedPortalKeys'], ['artifact', 'artifact', 'collectedArtifactKeys']]) {
  test(`${objective} retain separate objective identities on two surfaces at one XY`, () => {
    const e = make(), actor = e.heroes[0];
    e.objective = objective; e.objectiveTarget = 2;
    e.terrain.byId.get('ground:4:3').type = type;
    e.terrain.byId.get('bridge:4:3').type = type;
    place(e, actor, 'ground:4:3'); e.applyStartTileEffect(actor);
    place(e, actor, 'bridge:4:3'); e.applyStartTileEffect(actor);
    assert.deepEqual([...e[keyName]].sort(), ['bridge:4:3', 'ground:4:3']);
    assert.equal(e.objectiveProgress, 2);
    assert.equal(e.battleResult, 'victory');
  });
}
