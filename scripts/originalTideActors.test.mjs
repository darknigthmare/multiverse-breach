import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { getOriginalActorDesign } from '../src/game/originalActorDesigns.js';
import { getOriginalCostumes, wardrobeActorKey } from '../src/game/wardrobe.js';
import { getRpgActionProfile, getRpgCombatantAbility } from '../src/game/rpgTargeting.js';
import { resolveMeleeSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { installSignatureDirector } from '../src/game/signatureDirector.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../src/game/customBattle.js';
import { prepareSourceSignature } from '../src/game/signatureSourceKits.js';

const worlds = ['The Crownless Sea', 'The Drowned Testament', 'Valedor: The Shattered Crown', 'Mythos Primordia'];
const valedor = worlds[2];
const heroes = HEROES_DB.filter(actor => worlds.includes(actor.universe));
const enemies = worlds.flatMap(universe => {
  const { monsters, bosses, worldBoss } = ENEMIES_DB[universe];
  return [
    ...(universe === worlds[3] ? [] : [
      ...monsters.map(actor => ({ actor, kind: 'enemy' })),
      ...bosses.map(actor => ({ actor, kind: 'boss' }))
    ]),
    { actor: worldBoss, kind: 'worldBoss' }
  ];
});
const roster = [...heroes.map(actor => ({ actor, kind: 'hero' })), ...enemies];
const lighthouse = 'drowned_testament:le_phare_qui_regarde';
const queen = 'valedor_shattered_crown:reine_des_ronces';
const lighthouseDefinition = enemies.find(({ actor }) => actor.id === lighthouse).actor;
const noop = () => {};
const stage = { mode: 'RPG', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };

function makeRpg(universe, enemyIds, opponentControl = 'p2') {
  const catalog = buildCustomEnemyCatalog().filter(entry => entry.universe === universe && enemyIds.includes(entry.data.id));
  const data = buildCustomEnemyData(enemyIds.map(id => catalog.find(entry => entry.data.id === id).id), catalog);
  const particles = [];
  const engine = new EngineRpg(1040, 520, heroes.filter(actor => actor.universe === universe), data,
    { add: (...args) => particles.push(args) }, noop, noop, { ...stage, universe, customBattle: { ...stage.customBattle, opponentControl } });
  installSignatureDirector(engine, { mode: 'RPG' });
  return { engine, particles };
}

test('forty original actors use their own version and reference in the inventory and wardrobe', () => {
  assert.equal(roster.length, 40);
  assert.equal(new Set(roster.map(({ actor }) => wardrobeActorKey(actor))).size, 40);
  for (const { actor, kind } of roster) {
    const design = getOriginalActorDesign(actor);
    assert.equal(design?.kind, kind, actor.id);
    const audit = buildActorFidelityBacklog(actor, { kind });
    assert.equal(audit.incarnationEvidence, 'ORIGINAL_DESIGN_CONTRACT');
    assert.equal(audit.sourceScope, 'ORIGINAL_DESIGN');
    assert.equal(audit.artApproved, false);
    assert.ok(!audit.tasks.some(task => ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING'].includes(task.code)));
    assert.ok(audit.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'));
    for (const concept of getOriginalCostumes(actor)) {
      assert.equal(concept.sourceAnchor, design.visualAnchor);
      assert.equal(concept.equippable, false);
    }
  }
});

test('thirteen boss names resolve while the original prose, unrelated encounters and custom actions remain intact', () => {
  const bosses = enemies.filter(({ kind }) => kind !== 'enemy');
  assert.equal(bosses.length, 13);
  for (const { actor } of bosses) {
    const profile = getRpgActionProfile(actor, 'special', 'enemy');
    assert.equal(getRpgCombatantAbility(actor, 'special').name, profile.name);
    assert.equal(profile.name, getOriginalActorDesign(actor).rpgMove.name);
    assert.deepEqual([profile.action.fr, profile.action.en], [actor.special.fr, actor.special.en]);
    assert.equal(actor.special.name, undefined);
    assert.equal(profile.shape, actor.id === lighthouse ? 'line' : actor.id === queen ? 'group' : 'single');
    assert.equal(profile.effect, actor.id === queen ? 'guard' : 'damage');
    assert.equal(profile.multiplier, actor.id === queen ? 0 : 1);
  }
  const unchanged = [
    { ...lighthouseDefinition, id: 'foreign_tower' }, { ...lighthouseDefinition, universe: worlds[0] },
    { ...lighthouseDefinition, name: 'Tour de test' },
    { ...lighthouseDefinition, special: { ...lighthouseDefinition.special, en: 'Custom description' } },
    { ...lighthouseDefinition, special: { ...lighthouseDefinition.special, targeting: { shape: 'cone' } } }
  ];
  for (const actor of unchanged) assert.equal(getRpgCombatantAbility(actor, 'special'), actor.special);
  const custom = { name: 'Custom alert', type: 'beam', dmg: 2, targeting: { shape: 'single' } };
  assert.equal(getRpgActionProfile(lighthouseDefinition, 'special', 'enemy', {}, custom).action, custom);
});

test('prepared heroes retain their own RPG and Mêlée supers and a same-world invocation performer', () => {
  assert.equal(heroes.length, 12);
  for (const source of heroes) {
    const actor = structuredClone(source);
    prepareSourceSignature(actor);
    const profile = resolveMeleeSuper(actor);
    const rpg = getRpgActionProfile(actor, 'special');
    const summon = resolveUniverseSummon(actor);
    assert.equal(profile.sourceHeroId, actor.id);
    assert.equal(rpg.sourceHeroId, actor.id);
    assert.equal(rpg.name, profile.name);
    assert.ok(summon);
    assert.equal(summon.performer.universe, actor.universe);
    assert.equal(summon.performer.id, summon.sourceHeroId);
  }
});

test('the lighthouse selects, previews and strikes a line that stays clear of the offset hero', () => {
  const { engine, particles } = makeRpg(lighthouseDefinition.universe, [lighthouse]);
  try {
    const source = engine.getSelectedEnemy(), [near, far, offset] = engine.heroes;
    [[source, 880, 320], [near, 510, 320], [far, 280, 320], [offset, 280, 450]].forEach(([actor, x, y]) => {
      Object.assign(actor, { x, y, homeX: x, homeY: y });
    });
    source.atb = source.specialCharge = 100;
    const before = engine.heroes.map(actor => actor.currentHp);
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    assert.equal(engine.selectTarget(far.battleId), true);
    const preview = engine.getTargetingState();
    assert.equal(preview.abilityName, 'Faisceau du Phare');
    assert.equal(preview.profile.action.type, 'beam');
    assert.deepEqual(preview.previewTargetIds, [near.battleId, far.battleId]);
    assert.equal(source.atb, 100);
    assert.equal(source.specialCharge, 100);
    assert.equal(engine.confirmTargeting(), true);
    assert.equal(engine.confirmTargeting(), false);
    assert.equal(source.atb, 0);
    assert.equal(source.specialCharge, 0);
    for (let tick = 0; tick < 17; tick++) engine.update();
    assert.deepEqual(engine.heroes.map(actor => actor.currentHp), before);
    engine.update();
    assert.ok(near.currentHp < before[0]);
    assert.ok(far.currentHp < before[1]);
    assert.equal(offset.currentHp, before[2]);
    assert.equal(particles.filter(call => call.at(-1) === 'FAISCEAU DU PHARE!').length, 1);
  } finally {
    engine.dispose();
  }
});

test('the Briar Queen guards her side after confirmation and the guard reduces real incoming damage', () => {
  const allyId = 'valedor_shattered_crown:dragon_du_pic_creux';
  const deadId = 'valedor_shattered_crown:chevalier_creux';
  const { engine } = makeRpg(valedor, [queen, allyId, deadId]);
  try {
    const [source, ally, excluded] = engine.enemies;
    const striker = engine.heroes[0];
    excluded.currentHp = 0;
    excluded.state = 'dead';
    source.atb = source.specialCharge = 100;
    const heroHp = engine.heroes.map(actor => actor.currentHp);
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    assert.equal(engine.getTargetingState().abilityName, 'Forêt défensive');
    assert.deepEqual(engine.getTargetingState().previewTargetIds, [source.battleId, ally.battleId]);
    assert.equal(engine.confirmTargeting(), true);
    assert.equal(source.atb, 0);
    assert.equal(source.specialCharge, 0);
    assert.equal(source.rpgBriarGuardPreparing, true);
    assert.equal(source.rpgBriarGuardApplied, undefined);
    for (let tick = 0; tick < 17; tick++) engine.update();
    assert.equal(Boolean(ally.rpgGuardTicks), false);
    assert.equal(source.rpgBriarGuardApplied, undefined);
    engine.update();
    assert.ok(source.rpgGuardTicks > 0 && ally.rpgGuardTicks > 0);
    assert.equal(source.rpgBriarGuardApplied, true);
    assert.equal(ally.rpgBriarGuardApplied, undefined);
    assert.equal(ally.rpgGuardReduce, 0.4);
    assert.equal(Boolean(excluded.rpgGuardTicks), false);
    assert.ok(engine.heroes.every(hero => !hero.rpgGuardTicks));
    assert.deepEqual(engine.heroes.map(actor => actor.currentHp), heroHp);
    const initial = ally.currentHp;
    engine.applyDamage(striker, ally, 100);
    const protectedDamage = initial - ally.currentHp;
    for (let tick = 0; tick < 180; tick++) engine.update();
    assert.equal(ally.rpgGuardTicks, 0);
    const unguarded = ally.currentHp;
    engine.applyDamage(striker, ally, 100);
    assert.ok(protectedDamage > 0 && unguarded - ally.currentHp > protectedDamage);
  } finally {
    engine.dispose();
  }
});

test('another guard can overwrite the Queen’s protection without borrowing her wreaths', () => {
  const allyId = 'valedor_shattered_crown:dragon_du_pic_creux';
  const { engine } = makeRpg(valedor, [queen, allyId]);
  try {
    const [source, ally] = engine.enemies;
    source.atb = source.specialCharge = 100;
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    assert.equal(engine.confirmTargeting(), true);
    for (let tick = 0; tick < 18; tick++) engine.update();
    assert.equal(source.rpgBriarGuardApplied, true);
    const borrowedGuard = getRpgActionProfile(ally, 'special', 'enemy', {}, {
      name: 'Forêt défensive', type: 'shield', targeting: { effect: 'guard', targetSide: 'ally', shape: 'group', duration: 8, reduce: 0.3 }
    });
    engine.applyRpgImpact(ally, borrowedGuard, [source], '#ff7700', 'special');
    assert.equal(source.rpgGuardTicks, 480);
    assert.equal(source.rpgGuardReduce, 0.3);
    assert.equal(source.rpgBriarGuardApplied, false);
  } finally {
    engine.dispose();
  }
});

test('the Queen’s CPU cast uses the same animation commitment through an interrupted and a completed turn', () => {
  const { engine } = makeRpg(valedor, [queen], 'cpu');
  try {
    const [source] = engine.enemies;
    source.summonUsed = true;
    const ready = () => {
      source.atb = source.specialCharge = 100;
      engine.enemyGlobalRecovery = 0;
    };
    ready();
    engine.update();
    assert.equal(source.rpgBriarGuardPreparing, true);
    assert.equal(source.actionPending, true);
    engine.cancelActorActions(source);
    for (let tick = 0; tick < 80; tick++) engine.update();
    assert.equal(Boolean(source.rpgBriarGuardApplied), false);
    assert.equal(Boolean(source.rpgGuardTicks), false);
    ready();
    engine.update();
    assert.equal(source.actionPending, true);
    for (let tick = 0; tick < 18; tick++) engine.update();
    assert.equal(source.rpgBriarGuardApplied, true);
    assert.ok(source.rpgGuardTicks > 0);
  } finally {
    engine.dispose();
  }
});
