import test from 'node:test';
import assert from 'node:assert/strict';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { freezeCanonRosterPart } from '../src/game/canonRosterPackFactory.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { buildActorFidelityBacklog, indexActorContinuities } from '../src/game/actorFidelityBacklog.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { getRpgCombatantAbility, getRpgActionProfile } from '../src/game/rpgTargeting.js';
import * as quakeSignatures from '../DLC/Quake/data/signatureSourceWave2.js';

const universes = ['Unreal', 'Unreal Tournament', 'Unreal Tournament 2004', 'Quake'];
const packs = CANON_ROSTER_WAVE.filter(pack => universes.includes(pack.universe));
const actors = HEROES_DB.filter(actor => universes.includes(actor.universe)).map(actor => ({ actor, kind: 'hero' }));
for (const universe of universes) {
  const roster = ENEMIES_DB[universe];
  for (const [field, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
    for (const actor of field === 'worldBoss' ? [roster.worldBoss] : roster[field]) actors.push({ actor: { ...actor, universe }, kind });
  }
}

test('thirty-nine sourced actors retain an individual edition; unresolved Necris is not approved', () => {
  assert.equal(actors.length, 40);
  const index = indexActorContinuities(packs);
  for (const { actor, kind } of actors) {
    if (actor.id === 'unreal_tournament_2004_necris') {
      assert.equal(actor.incarnation, undefined);
      continue;
    }
    assert.equal(typeof actor.incarnation, 'string', actor.id);
    assert.match(actor.incarnation, /(?:1996|1997|1998|1999|2000|2004|2005)/, actor.id);
    const row = buildActorFidelityBacklog(actor, { kind, continuityIndex: index,
      rasterProbes: [{ path: '/fixture-only.png', status: 'PRESENT_IN_GIT', present: true, columns: 4, rows: 4 }] });
    assert.equal(row.incarnationEvidence, 'ACTOR_DECLARED', actor.id);
    assert.ok(!row.tasks.some(task => task.code === 'PACK_CONTINUITY_PRECISION'), actor.id);
    assert.ok(row.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'), actor.id);
    assert.equal(row.artApproved, false);
  }
});

test('UT2004 catalogue projects the existing authored weapon actions without inventing personal powers', () => {
  const pack = packs.find(value => value.universe === 'Unreal Tournament 2004');
  const [gorge, sapphire, frostbite] = [pack.hero, ...pack.allies].map(tuple => tuple[3]);
  for (const hero of [gorge, sapphire, frostbite]) {
    assert.equal(hero.weaponType, 'gun');
    assert.doesNotMatch(hero.special.name, /Juggernaut Charge|Adrenaline Burst|Redeemer/);
    assert.equal(hero.special.type, 'projectile');
    assert.equal(hero.defense.type, 'guard');
  }
  for (const actor of HEROES_DB.filter(actor => actor.universe === 'Unreal Tournament 2004')) {
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      const combat = resolveCombatAbility(actor, slot);
      assert.equal(actor[slot].name, combat.name, `${actor.id}:${slot}`);
      assert.equal(actor[slot].name, getRpgCombatantAbility(actor, slot).name, `${actor.id}:${slot}`);
      assert.equal(actor[slot].type, combat.sourceAbility.type, `${actor.id}:${slot}`);
      assert.equal(actor[slot].dmg, combat.sourceAbility.dmg, `${actor.id}:${slot}`);
    }
  }
  for (const actor of [...pack.monsters, ...pack.bosses, pack.worldBoss]) {
    if (actor.id === 'unreal_tournament_2004_necris') continue;
    assert.ok(!/Razik|Blade Rush|Skaarj Roar|Overcharge|Champion Adrenaline|Predator Leap/.test(`${actor.weapon} ${actor.special}`), actor.name);
    assert.match(actor.canonStatus, /shared.*pickup/i);
  }
});

test('Quake Gladiator is the 1997 model in both actor and prepared signature', () => {
  const gladiator = ENEMIES_DB.Quake.monsters.find(actor => actor.id === 'quake_franchise_gladiator');
  assert.match(gladiator.incarnation, /Quake II \(1997\)/);
  assert.doesNotMatch(gladiator.incarnation, /Quake 4/);
  assert.equal(gladiator.continuityScope, 'Quake II (1997)');
  const definitions = Object.values(quakeSignatures).filter(value => typeof value === 'function')
    .map(create => create({ hero: (...args) => args, enemy: (...args) => args }));
  const signature = definitions.find(args => args[7]?.enemyId === 'quake_franchise_gladiator');
  assert.equal(signature[7].requiredContinuity, 'Quake II (1997)');
});

test('source arena firearm names retain ranged RPG targeting while real bites remain contact attacks', () => {
  const roster = ENEMIES_DB['Unreal Tournament 2004'];
  for (const actor of [...roster.monsters, ...roster.bosses, roster.worldBoss]) {
    const profile = getRpgActionProfile({ ...actor, universe: 'Unreal Tournament 2004' }, 'simple', 'enemy');
    assert.equal(profile.delivery, 'ranged', actor.id);
    assert.ok(profile.range > 100, actor.id);
    assert.equal(profile.targetSide, 'enemy', actor.id);
  }
  const bite = getRpgActionProfile({ id: 'contact', universe: 'Doom', weapon: 'bite' }, 'simple', 'enemy');
  assert.equal(bite.delivery, 'melee');
  const support = getRpgActionProfile({ id: 'support', universe: 'Halo', weapon: 'terminal', simple: { name: 'Console support', type: 'support', dmg: 0, effect: 'buff', targetSide: 'ally' } }, 'simple', 'enemy');
  assert.equal(support.effect, 'buff');
  assert.equal(support.targetSide, 'ally');
});

test('pack factory preserves actor source declarations without accepting arbitrary identity overrides', () => {
  const sample = {
    key: 'contract_fixture', universe: 'Contract Fixture', referenceUrl: 'https://example.test/pack', continuity: 'Fixture (2004)',
    adaptationRule: 'Keep fixture actors distinct.', visualAnchor: 'Fixture figures in a test arena.',
    heroes: Array.from({ length: 3 }, (_, i) => ({ id: `h${i}`, name: `Hero ${i}`, incarnation: 'Fixture (2004) actor model', referenceUrl: 'https://example.test/hero', artApproved: true })),
    enemies: Array.from({ length: 3 }, (_, i) => ({ id: `e${i}`, name: `Enemy ${i}`, incarnation: 'Fixture (2004) opponent model', referenceUrl: 'https://example.test/enemy', artApproved: true })),
    bosses: Array.from({ length: 3 }, (_, i) => ({ id: `b${i}`, name: `Boss ${i}` })),
    worldBoss: { id: 'world', name: 'World' }, gear: Array.from({ length: 3 }, (_, i) => ({ id: `g${i}`, name: `Gear ${i}` })),
    stages: Array.from({ length: 3 }, (_, i) => ({ name: `Stage ${i}` })), event: { id: 'event', name: 'Event' }
  };
  const [pack] = freezeCanonRosterPart([sample]);
  assert.equal(pack.hero[0], 'contract_fixture_h0');
  assert.equal(pack.hero[3].incarnation, sample.heroes[0].incarnation);
  assert.equal(pack.hero[3].referenceUrl, sample.heroes[0].referenceUrl);
  assert.equal(pack.monsters[0].incarnation, sample.enemies[0].incarnation);
  assert.equal(pack.monsters[0].referenceUrl, sample.enemies[0].referenceUrl);
  assert.equal(Object.hasOwn(pack.hero[3], 'artApproved'), false);
  assert.equal(Object.hasOwn(pack.monsters[0], 'artApproved'), false);
});
