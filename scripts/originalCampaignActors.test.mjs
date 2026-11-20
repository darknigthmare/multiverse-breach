import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
import { getHeroSpriteSheetSrc, getEnemySpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';

const evidence = JSON.parse(await readFile(new URL('../docs/assets/p0-p1-p2-continuation-06-2026-11-20/roster/reference-review.json', import.meta.url), 'utf8'));
const storm = 'kemet_devoured_sun:tempete_rouge_avatar_d_isfet';
const orbital = 'helios_56:moonbase_warden';
const oblique = 'ilyr_concordat:cuirasse_nul_oblique';
const changedSpecials = new Set([storm, orbital, oblique]);
const originalActor = ({ actorId, universe, kind }) => {
  const roster = ENEMIES_DB[universe];
  const group = kind === 'hero' ? HEROES_DB.filter(actor => actor.universe === universe)
    : kind === 'enemy' ? roster.monsters
      : kind === 'boss' ? roster.bosses : [roster.worldBoss];
  return group.find(actor => actor?.id === actorId);
};

function makeRpg(universe, enemyIds) {
  const catalog = buildCustomEnemyCatalog().filter(entry => entry.universe === universe && enemyIds.includes(entry.data.id));
  const data = buildCustomEnemyData(enemyIds.map(id => catalog.find(entry => entry.data.id === id).id), catalog);
  const engine = new EngineRpg(1040, 520, HEROES_DB.filter(actor => actor.universe === universe), data,
    { add() {} }, () => {}, () => {}, {
      mode: 'RPG', universe, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  installSignatureDirector(engine, { mode: 'RPG' });
  return engine;
}

function place(coordinates) {
  for (const [actor, x, y] of coordinates) Object.assign(actor, { x, y, homeX: x, homeY: y });
}

function confirm(engine, source) {
  assert.equal(source.atb, 100);
  assert.equal(source.specialCharge, 100);
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(engine.confirmTargeting(), false);
  assert.equal(source.atb, 0);
  assert.equal(source.specialCharge, 0);
}

function tick(engine, count) {
  for (let frame = 0; frame < count; frame++) engine.update();
}

test('seventy original actors match their documented incarnation and exact game-sheet route', () => {
  assert.equal(evidence.length, 70);
  assert.equal(new Set(evidence.map(row => row.actorKey)).size, 70);
  for (const row of evidence) {
    const actor = originalActor(row);
    assert.ok(actor, row.actorKey);
    assert.equal(wardrobeActorKey(actor), row.actorKey);
    const design = getOriginalActorDesign(actor);
    assert.equal(design?.kind, row.kind, row.actorId);
    const audit = buildActorFidelityBacklog(actor, { kind: row.kind });
    assert.equal(audit.incarnationEvidence, 'ORIGINAL_DESIGN_CONTRACT');
    assert.equal(audit.sourceScope, 'ORIGINAL_DESIGN');
    assert.equal(audit.artApproved, false);
    assert.equal(audit.tasks.filter(task => ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING'].includes(task.code)).length, 0);
    assert.ok(audit.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'));
    const sprite = row.kind === 'hero' ? getHeroSpriteSheetSrc({ ...actor, state: 'idle' }, 'auto') : getEnemySpriteSheetSrc(actor);
    assert.equal('public' + sprite, row.sourcePath);
    const layout = getSpriteSheetLayout(sprite);
    assert.deepEqual([layout.columns, layout.rows], row.layout);
    for (const concept of getOriginalCostumes(actor)) {
      assert.equal(concept.sourceAnchor, design.visualAnchor);
      assert.equal(concept.equippable, false);
    }
  }
});

test('twenty-eight original boss actions resolve their names and retain the exact source and custom override', () => {
  const bosses = evidence.filter(({ kind }) => kind === 'boss' || kind === 'worldBoss');
  assert.equal(bosses.length, 28);
  for (const row of bosses) {
    const actor = originalActor(row);
    const profile = getRpgActionProfile(actor, 'special', 'enemy');
    const design = getOriginalActorDesign(actor);
    assert.equal(profile.name, design.rpgMove.name);
    assert.deepEqual([profile.action.fr, profile.action.en], [actor.special.fr, actor.special.en]);
    assert.equal(actor.special.name, undefined);
    if (!changedSpecials.has(actor.id)) {
      const before = getRpgActionProfile(actor, 'special', 'enemy', {}, actor.special);
      const { action: _action, name: _name, ...mechanics } = profile;
      const { action: _oldAction, name: _oldName, ...oldMechanics } = before;
      assert.deepEqual(mechanics, oldMechanics, actor.id);
    }
    const custom = { name: 'Custom attack', type: 'projectile', dmg: 2, targeting: { shape: 'line' } };
    assert.equal(getRpgActionProfile(actor, 'special', 'enemy', {}, custom).action, custom);
  }
  const actor = originalActor(bosses.find(({ actorId }) => actorId === storm));
  const variants = [
    { ...actor, id: 'unrelated-id' },
    { ...actor, universe: 'Other universe' },
    { ...actor, name: 'Alternate incarnation' },
    { ...actor, special: { ...actor.special, en: 'Modified encounter' } },
    { ...actor, rpgAttacks: { special: { shape: 'cone' } } }
  ];
  for (const variant of variants) assert.equal(getRpgCombatantAbility(variant, 'special'), variant.special);
});

test('the nine original heroes still resolve their native RPG and Mêlée supers and same-world invocations', () => {
  const heroes = evidence.filter(({ kind }) => kind === 'hero');
  assert.equal(heroes.length, 9);
  for (const row of heroes) {
    const actor = structuredClone(originalActor(row));
    prepareSourceSignature(actor);
    const melee = resolveMeleeSuper(actor);
    const rpg = getRpgActionProfile(actor, 'special');
    const summon = resolveUniverseSummon(actor);
    assert.equal(melee.sourceHeroId, actor.id);
    assert.equal(rpg.sourceHeroId, actor.id);
    assert.equal(rpg.name, melee.name);
    assert.ok(summon);
    assert.equal(summon.performer.universe, actor.universe);
    assert.equal(summon.performer.id, summon.sourceHeroId);
  }
});

test('the red storm selects and hits both targets beside Isfet, never the distant hero', () => {
  const engine = makeRpg('Kemet: The Devoured Sun', [storm]);
  try {
    const [source] = engine.enemies;
    const [first, second, distant] = engine.heroes;
    place([[source, 700, 320], [first, 545, 320], [second, 625, 405], [distant, 230, 320]]);
    source.atb = source.specialCharge = 100;
    const hp = engine.heroes.map(actor => actor.currentHp);
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    const preview = engine.getTargetingState();
    assert.equal(preview.delivery, 'radial');
    assert.equal(preview.abilityName, 'Sable d’Isfet');
    assert.deepEqual(preview.previewTargetIds, [first.battleId, second.battleId]);
    confirm(engine, source);
    tick(engine, 17);
    assert.deepEqual(engine.heroes.map(actor => actor.currentHp), hp);
    tick(engine, 1);
    assert.ok(first.currentHp < hp[0] && second.currentHp < hp[1]);
    assert.equal(distant.currentHp, hp[2]);
  } finally {
    engine.dispose();
  }
});

test('the lunar warden changes the orbit preview with selection and strikes the confirmed area', () => {
  const engine = makeRpg('Helios 56', [orbital]);
  try {
    const [source] = engine.enemies;
    const [first, second, distant] = engine.heroes;
    place([[source, 850, 280], [first, 440, 300], [second, 470, 365], [distant, 225, 300]]);
    source.atb = source.specialCharge = 100;
    const hp = engine.heroes.map(actor => actor.currentHp);
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    assert.equal(engine.selectTarget(distant.battleId), true);
    const lone = engine.getTargetingState();
    assert.equal(lone.shape, 'area');
    assert.deepEqual(lone.previewTargetIds, [distant.battleId]);
    assert.equal(engine.selectTarget(second.battleId), true);
    const pair = engine.getTargetingState();
    assert.equal(pair.abilityName, 'Frappe orbitale du Silo');
    assert.deepEqual(pair.previewTargetIds, [first.battleId, second.battleId]);
    confirm(engine, source);
    tick(engine, 17);
    assert.deepEqual(engine.heroes.map(actor => actor.currentHp), hp);
    tick(engine, 1);
    assert.ok(first.currentHp < hp[0] && second.currentHp < hp[1]);
    assert.equal(distant.currentHp, hp[2]);
  } finally {
    engine.dispose();
  }
});

test('the oblique screens guard nearby allies only and their damage reduction expires', () => {
  const engine = makeRpg('Ilyr Concordat', [oblique, 'ilyr_concordat:drone_nul_paleen', 'ilyr_concordat:archonte_sevrix']);
  try {
    const [source, nearby, distant] = engine.enemies;
    const [striker] = engine.heroes;
    place([[source, 760, 300], [nearby, 840, 360], [distant, 510, 300]]);
    source.atb = source.specialCharge = 100;
    const hp = engine.heroes.map(actor => actor.currentHp);
    assert.equal(engine.beginTargeting(source, 'special', 'enemy'), true);
    const preview = engine.getTargetingState();
    assert.equal(preview.effect, 'guard');
    assert.equal(preview.abilityName, 'Écrans obliques');
    assert.deepEqual(preview.previewTargetIds, [source.battleId, nearby.battleId]);
    confirm(engine, source);
    tick(engine, 17);
    assert.ok(!nearby.rpgGuardTicks);
    tick(engine, 1);
    assert.ok(source.rpgGuardTicks > 0 && nearby.rpgGuardTicks > 0);
    assert.equal(nearby.rpgGuardReduce, 0.4);
    assert.ok(!distant.rpgGuardTicks);
    assert.deepEqual(engine.heroes.map(actor => actor.currentHp), hp);
    assert.ok(engine.heroes.every(actor => !actor.rpgGuardTicks));
    const guarded = nearby.currentHp;
    engine.applyDamage(striker, nearby, 100);
    const reducedDamage = guarded - nearby.currentHp;
    tick(engine, 180);
    assert.equal(nearby.rpgGuardTicks, 0);
    const exposed = nearby.currentHp;
    engine.applyDamage(striker, nearby, 100);
    assert.ok(reducedDamage > 0 && exposed - nearby.currentHp > reducedDamage);
  } finally {
    engine.dispose();
  }
});
