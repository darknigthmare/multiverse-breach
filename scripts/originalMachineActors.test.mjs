import assert from 'node:assert/strict';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { getOriginalMachineActorDesign } from '../src/game/originalMachineActorDesigns.js';
import { getOriginalCostumes, wardrobeActorKey } from '../src/game/wardrobe.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { getRpgActionProfile, getRpgCombatantAbility } from '../src/game/rpgTargeting.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { installSignatureDirector } from '../src/game/signatureDirector.js';
import { resolveMeleeSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../src/game/customBattle.js';
import { prepareSourceSignature } from '../src/game/signatureSourceKits.js';

const worlds = ['The Aether Crown', 'Meridian Clockwork', 'Iron Tempest', 'Helios 56'];
const heroes = HEROES_DB.filter(actor => worlds.includes(actor.universe));
const encounters = worlds.flatMap(universe => {
  const { monsters, bosses, worldBoss } = ENEMIES_DB[universe];
  return [
    ...(universe === 'Helios 56' ? [] : [
      ...monsters.map(actor => ({ actor, kind: 'enemy' })),
      ...bosses.map(actor => ({ actor, kind: 'boss' }))
    ]),
    { actor: worldBoss, kind: 'worldBoss' }
  ];
});
const records = [...heroes.map(actor => ({ actor, kind: 'hero' })), ...encounters];
const stages = { universe: 'Iron Tempest', mode: 'RPG', disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2' } };
const rail = encounters.find(({ actor }) => actor.id === 'iron_tempest:rail_cannon_behemoth').actor;

test('forty exact project actors share the same design target in the audit and wardrobe', () => {
  assert.equal(records.length, 40);
  assert.equal(new Set(records.map(({ actor }) => wardrobeActorKey(actor))).size, 40);
  for (const { actor, kind } of records) {
    const design = getOriginalMachineActorDesign(actor);
    assert.equal(design?.kind, kind, actor.id);
    const review = buildActorFidelityBacklog(actor, { kind });
    assert.equal(review.incarnationEvidence, 'ORIGINAL_DESIGN_CONTRACT');
    assert.equal(review.sourceScope, 'ORIGINAL_DESIGN');
    assert.equal(review.artApproved, false);
    assert.equal(review.completeness, 'OPEN_NOT_EXHAUSTIVE');
    assert.ok(review.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'));
    assert.ok(!review.tasks.some(task => ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING'].includes(task.code)));
    const concepts = getOriginalCostumes(actor);
    assert.ok(concepts.length > 0);
    for (const concept of concepts) {
      assert.equal(concept.sourceAnchor, design.visualAnchor);
      assert.equal(concept.equippable, false);
    }
  }
});

test('thirteen original boss previews use short source labels with historical strength', () => {
  const bosses = encounters.filter(({ kind }) => kind !== 'enemy');
  assert.equal(bosses.length, 13);
  for (const { actor } of bosses) {
    const { action, name, shape, effect, targetSide, multiplier } = getRpgActionProfile(actor, 'special', 'enemy');
    assert.equal(name, getOriginalMachineActorDesign(actor).rpgMove.name);
    assert.equal(getRpgCombatantAbility(actor, 'special').name, name);
    assert.equal(action.fr, actor.special.fr);
    assert.equal(action.en, actor.special.en);
    assert.equal(effect, 'damage');
    assert.equal(shape, actor === rail ? 'line' : 'single');
    assert.equal(multiplier, 1);
    assert.equal(targetSide, 'enemy');
    assert.equal(actor.special.name, undefined);
  }
});

test('a custom action, foreign universe or borrowed boss identity cannot receive the rail line', () => {
  for (const actor of [
    { ...rail, id: 'rival_cannon' },
    { ...rail, universe: 'Foreign original' },
    { ...rail, name: 'Other Rail-Cannon Behemoth' },
    { ...rail, special: { ...rail.special, en: 'Custom translated action' } },
    { ...rail, special: { ...rail.special, dmg: 2 } }
  ]) {
    const profile = getRpgActionProfile(actor, 'special', 'enemy');
    assert.equal(profile.action, actor.special);
    assert.equal(profile.shape, 'single');
  }
  const custom = { name: 'Custom armor salvo', type: 'projectile', dmg: 2, targeting: { shape: 'single' } };
  assert.equal(getRpgActionProfile(rail, 'special', 'enemy', {}, custom).action, custom);
  assert.equal(getRpgCombatantAbility({ ...rail, special: custom }, 'special'), custom);
});

test('the twelve heroes keep their own prepared super names and same-universe invocation owners', () => {
  assert.equal(heroes.length, 12);
  for (const template of heroes) {
    const actor = structuredClone(template);
    prepareSourceSignature(actor);
    const melee = resolveMeleeSuper(actor);
    assert.equal(melee.sourceHeroId, template.id);
    const special = getRpgActionProfile(actor, 'special');
    assert.equal(special.sourceHeroId, template.id);
    assert.equal(special.name, melee.name);
    assert.doesNotMatch(special.name, /Origin Burst|Signature Strike|Breach Technique/i);
    const summon = resolveUniverseSummon(actor);
    assert.ok(summon);
    assert.equal(summon.performer.universe, template.universe);
    assert.equal(summon.performer.id, summon.sourceHeroId);
  }
});

test('the Rail-Cannon previews two aligned units and spends once on the confirmed projectile line', () => {
  const enemy = buildCustomEnemyCatalog().find(entry => entry.data.id === rail.id && entry.universe === rail.universe);
  const enemyData = buildCustomEnemyData([enemy.id], [enemy]);
  const squad = heroes.filter(actor => actor.universe === rail.universe);
  const effects = [];
  const engine = new EngineRpg(1040, 520, squad, enemyData, { add: (...args) => effects.push(args) }, () => {}, () => {}, stages);
  installSignatureDirector(engine, { mode: 'RPG' });
  try {
    const caster = engine.getSelectedEnemy();
    const [near, far, outside] = engine.heroes;
    [[caster, 880, 325], [near, 510, 325], [far, 280, 325], [outside, 280, 440]].forEach(([actor, x, y]) => {
      Object.assign(actor, { x, y, homeX: x, homeY: y });
    });
    const hp = engine.heroes.map(hero => hero.currentHp);
    caster.atb = 100;
    caster.specialCharge = 100;
    assert.equal(engine.beginTargeting(caster, 'special', 'enemy'), true);
    assert.equal(engine.selectTarget(far.battleId), true);
    const preview = engine.getTargetingState();
    assert.equal(preview.abilityName, 'Tir transversal');
    assert.equal(preview.shape, 'line');
    assert.equal(preview.profile.action.type, 'projectile');
    assert.deepEqual(preview.previewTargetIds, [near.battleId, far.battleId]);
    assert.equal(caster.atb, 100);
    assert.equal(caster.specialCharge, 100);
    assert.deepEqual(engine.heroes.map(hero => hero.currentHp), hp);
    assert.equal(engine.confirmTargeting(), true);
    assert.equal(caster.atb, 0);
    assert.equal(caster.specialCharge, 0);
    assert.equal(engine.confirmTargeting(), false);
    for (let tick = 0; tick < 17; tick++) engine.update();
    assert.deepEqual(engine.heroes.map(hero => hero.currentHp), hp);
    engine.update();
    assert.ok(near.currentHp < hp[0]);
    assert.ok(far.currentHp < hp[1]);
    assert.equal(outside.currentHp, hp[2]);
    const after = engine.heroes.map(hero => hero.currentHp);
    for (let tick = 0; tick < 25; tick++) engine.update();
    assert.deepEqual(engine.heroes.map(hero => hero.currentHp), after);
    assert.equal(effects.filter(call => call.at(-1) === 'TIR TRANSVERSAL!').length, 1);
  } finally {
    engine.dispose();
  }
});
