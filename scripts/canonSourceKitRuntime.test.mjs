import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getHeroById } from '../src/game/heroes.js';
import { resolveCanonHeroAttackEffect } from '../src/game/canonHeroAttackEffects.js';
import { grantBattleItemShield } from '../src/game/battleItemShield.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const engines = [];
let vite;
let EngineRpg;
let EngineTactics;
const threats = Array.from({ length: 6 }, (_, index) => ({
  id: `canon-threat-${index}`, name: `Threat ${index}`, hp: 600,
  atk: 2, def: 0, spd: 1, weapon: 'melee', color: '#808080'
}));
const enemyData = { monsters: threats, bosses: [], customRoster: threats };
const makeEngine = (kind, id) => {
  const calls = [];
  const sounds = [];
  const Engine = kind === 'rpg' ? EngineRpg : EngineTactics;
  const engine = new Engine(760, 420, [getHeroById(id)], enemyData,
    { add: (...args) => calls.push(args) }, sound => sounds.push(sound), () => {}, {
      universe: 'Nexus de Convergence',
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine);
  engine.calls = calls;
  engine.sounds = sounds;
  engine.heroes[0].atb = 100;
  engine.heroes[0].specialCharge = 100;
  if (kind === 'rpg') engine.enemyGlobalRecovery = 9999;
  else {
    engine.cols = 10;
    engine.rows = 8;
    engine.tiles = [];
    engine.obstacles = [];
    engine.escortUnit = null;
    engine.protectedArtifact = null;
    engine.objective = 'rout';
    Object.assign(engine.heroes[0], { gridX: 2, gridY: 2 });
    const cells = [[3, 2], [5, 2], [2, 4], [4, 4], [8, 6], [7, 2]];
    engine.enemies.forEach((unit, index) => Object.assign(unit, { gridX: cells[index][0], gridY: cells[index][1] }));
    engine.activeUnit = engine.heroes[0];
    engine.activeUnitType = 'hero';
    engine.actionPhase = 'action';
    engine.selectedAction = null;
  }
  calls.length = 0;
  sounds.length = 0;
  return engine;
};
const advance = (engine, count = 18) => {
  for (let frame = 0; frame < count; frame++) engine.update();
};
const particleKinds = engine => engine.calls.map(call => call[7]);

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  [{ EngineRpg }, { EngineTactics }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js?canon-source-kit-runtime'),
    vite.ssrLoadModule('/src/game/engineTactics.js?canon-source-kit-runtime')
  ]);
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

for (const id of ['luke', 'vader']) test(`RPG ${id} telekinesis damages the chosen enemy without shooting an electrical beam`, () => {
  const engine = makeEngine('rpg', id);
  const hp = engine.enemies.map(unit => unit.currentHp);
  const target = engine.enemies[2];
  assert.equal(engine.triggerAbility(engine.heroes[0], 'secondary', [target.battleId]), true);
  assert.equal(particleKinds(engine).includes('laser_line'), false);
  assert.equal(engine.sounds.includes('shoot'), false);
  advance(engine);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 2));
});

test('RPG Vader Force choke damages one identity and produces no laser or group flash', () => {
  const engine = makeEngine('rpg', 'vader');
  const vader = engine.heroes[0];
  const target = engine.enemies[2];
  const hp = engine.enemies.map(unit => unit.currentHp);
  const restraints = () => engine.calls.filter(call => call[4] === '#aeb4b9' && call[7] === 'spark');
  assert.equal(engine.triggerAbility(vader, 'special', [target.battleId]), true);
  assert.equal(vader.rpgSpecialVisual, null, 'the ranged choke does not inherit the W13 melee saber visual');
  assert.equal(restraints().length, 0);
  assert.ok(!particleKinds(engine).some(kind => ['laser_line', 'glitch', 'music'].includes(kind)));
  assert.ok(!engine.sounds.includes('shoot'));
  advance(engine, 17);
  assert.equal(restraints().length, 0);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  advance(engine, 1);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 2));
  assert.deepEqual(restraints().map(call => call.slice(0, 2)), [[target.x, target.y - 30]]);
});

test('RPG Vader debris scatters on accepted impact and never on a replacement target', () => {
  for (const replaced of [false, true]) {
    const engine = makeEngine('rpg', 'vader');
    const vader = engine.heroes[0];
    const target = engine.enemies[2];
    const debris = () => engine.calls.filter(call => call[4] === '#aeb4b9' && call[7] === 'thrown_prop');
    assert.equal(engine.triggerAbility(vader, 'secondary', [target.battleId]), true);
    assert.equal(vader.cooldown, vader.secondary.cd * 60);
    assert.equal(debris().length, 0);
    assert.ok(!engine.calls.some(call => call[4] === '#aeb4b9'), 'the impact feedback is not emitted during windup');
    const replacement = { ...target };
    if (replaced) engine.enemies[2] = replacement;
    advance(engine);
    if (replaced) {
      assert.equal(replacement.currentHp, target.maxHp);
      assert.equal(debris().length, 0);
    } else {
      assert.ok(target.currentHp < target.maxHp);
      assert.equal(debris().length, 2);
      assert.ok(debris().every(call => Math.abs(call[0] - target.x) <= 10));
    }
    assert.ok(!particleKinds(engine).some(kind => ['laser_line', 'glitch', 'music'].includes(kind)));
  }
});

for (const id of ['bob_minions', 'kevin_minions']) test(`RPG ${id} launches a banana and keeps contact attacks free of guns`, () => {
  const engine = makeEngine('rpg', id);
  const target = engine.enemies[1];
  const hp = target.currentHp;
  assert.equal(engine.triggerAbility(engine.heroes[0], 'secondary', [target.battleId]), true);
  assert.ok(particleKinds(engine).includes('banana'));
  assert.ok(!particleKinds(engine).includes('laser_line'));
  assert.ok(!engine.sounds.includes('shoot'));
  advance(engine);
  assert.ok(target.currentHp < hp);
});

test('RPG Stuart plays musical notes rather than a laser projectile', () => {
  const engine = makeEngine('rpg', 'stuart_minions');
  const target = engine.enemies[1];
  const hp = target.currentHp;
  assert.equal(engine.triggerAbility(engine.heroes[0], 'secondary', [target.battleId]), true);
  assert.ok(particleKinds(engine).includes('music'));
  assert.ok(!particleKinds(engine).includes('laser_line'));
  advance(engine);
  assert.ok(target.currentHp < hp);
});

test('RPG Han blaster volley emits red bolts for its selected opponents up to its three-target cap', () => {
  const engine = makeEngine('rpg', 'han_solo');
  const hp = engine.enemies.map(unit => unit.currentHp);
  const indices = [0, 2];
  assert.equal(engine.triggerAbility(engine.heroes[0], 'special', indices.map(index => engine.enemies[index].battleId)), true);
  const bolts = engine.calls.filter(call => call[7] === 'laser_line');
  assert.equal(bolts.length, 2);
  assert.ok(bolts.every(call => call[4] === '#ff4136'));
  advance(engine);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], indices.includes(index)));
  const fullVolley = makeEngine('rpg', 'han_solo');
  assert.equal(fullVolley.triggerAbility(fullVolley.heroes[0], 'special', fullVolley.enemies.map(unit => unit.battleId)), true);
  assert.equal(fullVolley.calls.filter(call => call[7] === 'laser_line').length, 3);
});

for (const id of ['luke', 'bob_minions', 'kevin_minions']) test(`Tactics ${id} contact special cannot hit a distant opponent`, () => {
  const engine = makeEngine('tactics', id);
  const actor = engine.heroes[0];
  const hp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.selectAction('special'), true);
  assert.equal(engine.getAttackProfile(actor, 'special').range, 1);
  assert.equal(engine.handleCellClick(engine.enemies[1].gridX, engine.enemies[1].gridY).handled, false);
  assert.equal(actor.specialCharge, 100, 'a rejected distant strike spent charge');
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  assert.equal(engine.handleCellClick(engine.enemies[0].gridX, engine.enemies[0].gridY).handled, true);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 0));
  assert.ok(!particleKinds(engine).some(kind => ['laser_line', 'glitch'].includes(kind)));
});

test('Tactics Stuart guitar swing is contact-only while his sound attack uses musical notes', () => {
  const engine = makeEngine('tactics', 'stuart_minions');
  const actor = engine.heroes[0];
  assert.equal(engine.selectAction('simple'), true);
  assert.equal(engine.handleCellClick(5, 2).handled, false);
  assert.equal(engine.getAttackProfile(actor, 'simple').range, 1);
  assert.equal(engine.selectAction('secondary'), true);
  assert.equal(engine.handleCellClick(5, 2).handled, true);
  assert.ok(particleKinds(engine).includes('music'));
  assert.ok(!particleKinds(engine).includes('laser_line'));
});

test('Tactics Vader Force choke hits its selected distant target without damaging its neighbors', () => {
  const engine = makeEngine('tactics', 'vader');
  const hp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.selectAction('special'), true);
  assert.equal(engine.handleCellClick(5, 2).handled, true);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 1));
  assert.ok(!particleKinds(engine).some(kind => ['laser_line', 'glitch', 'music'].includes(kind)));
});

for (const [slot, range, expectedKind] of [['special', 5, 'spark'], ['secondary', 3, 'thrown_prop']]) {
  test(`Vertical Tactics Vader ${slot}: selected elevated surface owns the original command and accepted cue`, () => {
    for (const shielded of [false, true]) {
      const calls = [], sounds = [];
      const vader = getHeroById('vader');
      const engine = new EngineTactics(1040, 460, [vader], enemyData,
        { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, {
          universe: 'Nexus de Convergence', tacticsBattlefieldId: 'nexus_skybridge',
          customBattle: { singleRoster: true, opponentControl: 'p2' }
        });
      engines.push(engine);
      const [actor] = engine.heroes;
      const [target, underneath] = engine.enemies;
      const place = (unit, surfaceId) => {
        const surface = engine.terrain.byId.get(surfaceId);
        Object.assign(unit, { gridX: surface.x, gridY: surface.y, gridZ: surface.z, surfaceId });
      };
      place(actor, 'bridge:4:3');
      place(target, 'bridge:7:3');
      place(underneath, 'ground:7:3');
      engine.syncActorsToCamera();
      engine.obstacles = [];
      Object.assign(engine, { activeUnit: actor, activeUnitType: 'hero', actionPhase: 'action' });
      actor.specialCharge = 100;
      if (shielded) assert.ok(grantBattleItemShield(target, 500) > 0);
      const cues = () => calls.filter(call => call[4] === '#aeb4b9' && call[7] === expectedKind);
      const hp = engine.enemies.map(unit => unit.currentHp);
      const cueCount = slot === 'special' ? 1 : 2;
      calls.length = 0;
      sounds.length = 0;

      assert.equal(engine.getActionDefinition(actor, 'simple').name, vader.simple.name);
      assert.equal(engine.getActionDefinition(actor, 'defense').name, vader.defense.name);
      assert.equal(engine.getAttackProfile(actor, 'defense').guardReduce, vader.defense.reduce);
      assert.equal(engine.getActionDefinition(actor, slot).name, vader[slot].name);
      const { delivery, shape, maxTargets, multiplier } = engine.getAttackProfile(actor, slot);
      assert.deepEqual({ delivery, shape, maxTargets, multiplier }, { delivery: 'ranged', shape: 'single', maxTargets: 1, multiplier: vader[slot].dmg });
      assert.equal(engine.getAttackProfile(actor, slot).range, range);
      assert.equal(engine.selectAction(slot), true);
      assert.ok(engine.attackRange.some(cell => cell.surfaceId === target.surfaceId));
      assert.equal(engine.handleCellClick(7, 3, target.surfaceId).handled, true);
      assert.equal(target.currentHp < hp[0], !shielded);
      assert.deepEqual(engine.enemies.slice(1).map(unit => unit.currentHp), hp.slice(1));
      assert.equal(cues().length, shielded ? 0 : cueCount);
      const position = engine.getUnitScreenPosition(7, 3, target.surfaceId);
      assert.notEqual(position.y, engine.getUnitScreenPosition(7, 3, underneath.surfaceId).y);
      assert.ok(cues().every(call => Math.abs(call[0] - position.x) <= 8 && call[1] < position.y));
      assert.ok(!sounds.includes('shoot') && !sounds.includes('special'));
    }
  });
}

test('Tactics Han volley fires at up to three distinct visible opponents without cone or splash damage', () => {
  const engine = makeEngine('tactics', 'han_solo');
  const actor = engine.heroes[0];
  const hp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.selectAction('special'), true);
  const preview = engine.getAttackTargets(actor, engine.enemies[3], 'special', 'hero');
  assert.equal(preview.length, 3);
  assert.ok(preview.some(entry => entry.unit === engine.enemies[3]), 'the clicked target must have first priority');
  const selected = new Set(preview.map(entry => entry.unit));
  assert.equal(engine.handleCellClick(4, 4).handled, true);
  engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], selected.has(unit)));
  assert.equal(engine.calls.filter(call => call[7] === 'laser_line' && call[4] === '#ff4136').length, 3);
  assert.ok(!particleKinds(engine).includes('glitch'));
});

test('Tactics Han volley rejects distant and obstructed candidates for every individual shot', () => {
  const engine = makeEngine('tactics', 'han_solo');
  const actor = engine.heroes[0];
  engine.obstacles = [{ type: 'barrier', gridX: 3, gridY: 2, hp: 150 }];
  const target = engine.enemies[2];
  const preview = engine.getAttackTargets(actor, target, 'special', 'hero');
  assert.ok(!preview.some(entry => entry.unit === engine.enemies[1]), 'blocked enemy behind the barrier was selected');
  assert.ok(!preview.some(entry => entry.unit === engine.enemies[4]), 'out-of-range enemy was selected');
  assert.equal(engine.canAttackCell(actor, engine.enemies[4], 'special'), false);
  engine.applyProfiledAttack(actor, target, 'special', actor.stats.atk * actor.special.dmg, null, 'hero');
  assert.equal(engine.enemies[1].currentHp, engine.enemies[1].maxHp);
  assert.equal(engine.enemies[4].currentHp, engine.enemies[4].maxHp);
});

test('canonical presentation follows the original identity for custom P2 heroes and preserves generic kits', () => {
  const vader = getHeroById('vader');
  assert.equal(resolveCanonHeroAttackEffect({ ...vader, id: 'p2:vader', sourceId: 'vader' }, 'special').kind, 'forceChoke');
  assert.equal(resolveCanonHeroAttackEffect({ ...vader, id: 'p2:vader' }, 'special').kind, 'forceChoke');
  assert.equal(resolveCanonHeroAttackEffect({ ...vader, id: 'temporary:2', sourceHeroId: 'vader' }, 'special').confirmedImpact, true);
  assert.equal(resolveCanonHeroAttackEffect({ ...vader, incarnation: 'Death Star II (1983)' }, 'special').confirmedImpact, undefined);
  assert.equal(resolveCanonHeroAttackEffect({ id: 'unrelated', secondary: { type: 'gravity' } }, 'secondary'), null);
});
