import assert from 'node:assert/strict';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getNexusActorDesign } from '../src/game/nexusActorDesigns.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { getOriginalCostumes, wardrobeActorKey } from '../src/game/wardrobe.js';
import { getRpgActionProfile } from '../src/game/rpgTargeting.js';
import { resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { EngineSmash } from '../src/game/engineSmash.js';
import { tickMeleeCombatActor } from '../src/game/melee/meleeCombatRuntime.js';

const universe = 'Nexus de Convergence';
const roster = ENEMIES_DB[universe];
const anchor = createPlayerHero({ name: 'Ariane' });
const heroes = [anchor, ...HEROES_DB.filter(hero => hero.universe === universe)];
const enemies = [...roster.monsters, ...roster.bosses, roster.worldBoss];
const rows = [
  ...heroes.map(actor => ({ actor, kind: 'hero' })),
  ...roster.monsters.map(actor => ({ actor, kind: 'enemy' })),
  ...roster.bosses.map(actor => ({ actor, kind: 'boss' })),
  { actor: roster.worldBoss, kind: 'worldBoss' }
];
const dummy = { id: 'nexus-test-visitor', name: 'Visitor', universe, hp: 10000, atk: 5, spd: 5 };
const noop = () => {};
const stage = { universe, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };

test('all forty live Nexus identities retain individual original design and wardrobe anchors', () => {
  const keys = new Set();
  for (const { actor, kind } of rows) {
    const identity = { ...actor, universe };
    keys.add(wardrobeActorKey(identity));
    const design = getNexusActorDesign(identity);
    assert.equal(design?.kind, kind, actor.name);
    const audit = buildActorFidelityBacklog(identity, { kind });
    assert.equal(audit.sourceScope, 'ORIGINAL_DESIGN');
    assert.equal(audit.incarnationEvidence, 'ORIGINAL_DESIGN_CONTRACT');
    assert.ok(audit.incarnation.includes(design.name), actor.name);
    assert.ok(audit.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'), actor.name);
    assert.ok(audit.tasks.some(task => task.code === 'RASTER_SCOPE_UNRESOLVED'), actor.name);
    assert.equal(audit.artApproved, false);
    assert.equal(audit.completeness, 'OPEN_NOT_EXHAUSTIVE');
    assert.ok(!audit.tasks.some(task => ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING'].includes(task.code)), actor.name);
    for (const costume of getOriginalCostumes(identity)) {
      assert.equal(costume.sourceAnchor, design.visualAnchor);
      assert.equal(costume.fitStatus, 'MORPHOLOGY_REVIEW_REQUIRED');
      assert.equal(costume.equippable, false);
    }
  }
  assert.equal(rows.length, 40);
  assert.equal(keys.size, rows.length);
  const marrow = getNexusActorDesign(heroes.find(hero => hero.id === 'arca_marrow'));
  const double = getNexusActorDesign({ ...enemies.find(enemy => enemy.name === 'Double ideal de Marrow'), universe });
  assert.match(marrow.visualAnchor, /conserver la cicatrice/i);
  assert.match(double.visualAnchor, /cristal d’Origine remplace la cicatrice/);
});

test('original designs refuse a namesake, a foreign identity and a borrowed Anchor ID', () => {
  const tessera = heroes.find(hero => hero.id === 'arca_tessera');
  const namedEnemy = roster.monsters[0];
  for (const identity of [
    { ...anchor, isPlayer: false }, { ...anchor, universe: 'Imported universe' },
    { ...tessera, name: 'Tessera from a different record' }, { ...tessera, id: 'custom_tessera' },
    { ...tessera, universe: 'Imported universe' }, { ...namedEnemy, universe, id: 'unrelated_echo' }
  ]) assert.equal(getNexusActorDesign(identity), null);
  assert.equal(getNexusActorDesign(anchor)?.name, 'Ancre');
});

test('all twenty-three named enemy actions reach the RPG profile without rebalancing', () => {
  const namedEnemies = enemies.filter(enemy => typeof enemy.special === 'string');
  assert.equal(namedEnemies.length, 23);
  for (const enemy of namedEnemies) {
    const { name, effect, multiplier, shape, targetSide } = getRpgActionProfile({ ...enemy, universe }, 'special', 'enemy');
    assert.equal(name, enemy.special);
    assert.deepEqual({ effect, multiplier, shape, targetSide }, {
      effect: 'damage', multiplier: 1, shape: 'single', targetSide: 'enemy'
    }, enemy.name);
  }
  assert.equal(getRpgActionProfile(roster.monsters[0], 'special', 'enemy').name, 'Special');
  assert.equal(getRpgActionProfile(roster.monsters[0], 'special', 'enemy').shape, 'group');
  const namesake = { ...namedEnemies[0], universe: 'Archive étrangère' };
  const foreignProfile = getRpgActionProfile(namesake, 'special', 'enemy');
  assert.equal(foreignProfile.name, 'special');
  assert.equal(foreignProfile.action, namesake.special);
});

test('the RPG uses the real campaign boss name on its cast, charges once and hits only the selected player', () => {
  const boss = { ...roster.bosses[0], universe, isBoss: true };
  const particles = [];
  const engine = new EngineRpg(1040, 520, [anchor, heroes[1]],
    { monsters: [boss], bosses: [], customRoster: [boss] }, { add: (...args) => particles.push(args) }, noop, noop, stage);
  try {
    const source = engine.enemies[0];
    const [target, other] = engine.heroes;
    source.atb = 100;
    source.specialCharge = 100;
    const before = [target.currentHp, other.currentHp];
    assert.equal(engine.triggerEnemyAbility(source, 'special', [target.battleId]), true);
    assert.equal(source.atb, 0);
    assert.equal(source.specialCharge, 0);
    assert.equal(engine.triggerEnemyAbility(source, 'special', [target.battleId]), false);
    assert.equal(particles.filter(args => args.at(-1) === 'TAMPON DE REECRITURE!').length, 1);
    for (let step = 0; step < 17; step++) engine.update();
    assert.equal(target.currentHp, before[0]);
    engine.update();
    assert.ok(target.currentHp < before[0]);
    const afterImpact = target.currentHp;
    for (let step = 0; step < 30; step++) engine.update();
    assert.equal(target.currentHp, afterImpact);
    assert.equal(other.currentHp, before[1]);
  } finally {
    engine.dispose();
  }
});

test('the twelve existing Nexus callers retain their exact invocation owner and original effect', () => {
  const ownDeployments = new Map([
    ['arca_bastion', ['Balise Barricade', 'guard']],
    ['arca_loom', ['Drone de Suture', 'heal']],
    ['arca_tessera', ['Reflet Non Remplace', 'damage']],
    ['arca_nadir', ['Sonde de Retour', 'damage']]
  ]);
  for (const actor of heroes) {
    const expectedOwner = ownDeployments.has(actor.id) ? actor.id : 'arca_bastion';
    const [expectedName, expectedEffect] = ownDeployments.get(expectedOwner);
    const summon = resolveUniverseSummon(actor);
    assert.equal(summon.sourceHeroId, expectedOwner, actor.id);
    assert.equal(summon.performer.id, expectedOwner, actor.id);
    assert.equal(summon.sourceAbility.slot, 'secondary');
    assert.equal(summon.entityName, expectedName);
    assert.equal(summon.action.targeting.effect, expectedEffect);
  }
});

test('all twelve Nexus heroes can execute their named super through the normal Smash command', () => {
  for (const template of heroes) {
    const engine = new EngineSmash(1040, 520, [template],
      { monsters: [dummy], bosses: [], customRoster: [dummy] }, { add: noop }, noop, noop, { ...stage, mode: 'Smash' });
    try {
      engine.syncPreMatchFromServer(3000);
      const actor = engine.heroes[0];
      const target = engine.enemies[0];
      actor.x = 400;
      target.x = 500;
      actor.y = target.y = engine.arena.groundY;
      actor.facing = 1;
      actor.specialCharge = 100;
      actor.currentHp = actor.maxHp - 25;
      const before = [actor.currentHp, target.currentHp];
      assert.equal(engine.triggerMeleeAction('player', 'Special'), true, actor.id);
      assert.equal(actor.specialCharge, 0, actor.id);
      const action = actor.action;
      assert.equal(action?.superProfile?.name, template.special.name, actor.id);
      assert.equal(action.superProfile.sourceHeroId, template.id);
      assert.equal(engine.triggerMeleeAction('player', 'Special'), false);
      const advance = ticks => {
        for (let tick = 0; tick < ticks; tick++) tickMeleeCombatActor(actor, 1 / 60, {
          resolveActionHit: (source, committed) => engine.resolveMeleeActionHit(source, committed)
        });
      };
      advance(Math.ceil(action.hitAt * 60) - 1);
      assert.deepEqual([actor.currentHp, target.currentHp], before);
      advance(1);
      if (action.superProfile.effect === 'heal') {
        assert.ok(actor.currentHp > before[0], actor.id);
        assert.equal(target.currentHp, before[1]);
      } else {
        assert.equal(actor.currentHp, before[0]);
        assert.ok(target.currentHp < before[1], actor.id);
      }
      const afterImpact = [actor.currentHp, target.currentHp];
      advance(Math.ceil(action.duration * 60));
      assert.deepEqual([actor.currentHp, target.currentHp], afterImpact);
    } finally {
      engine.dispose();
    }
  }
});
