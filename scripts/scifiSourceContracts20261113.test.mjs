import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { getRpgActionProfile } from '../src/game/rpgTargeting.js';
import { prepareSourceSignature, resolveSourceSignature } from '../src/game/signatureSourceKits.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';

const dir = new URL('../docs/assets/p0-p1-p2-continuation-2026-11-13/scifi-lot-040/', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('source-contracts-040.json', dir), 'utf8'));
const reservation = JSON.parse(readFileSync(new URL('reservation-040.json', dir), 'utf8'));
const before = new Map(JSON.parse(readFileSync(new URL('runtime-before.json', dir), 'utf8')).map(row => [row.actorKey, row]));
const actorFor = row => row.kind === 'hero'
  ? HEROES_DB.find(actor => actor.id === row.actorId && actor.universe === row.universe)
  : { ...ENEMIES_DB[row.universe].monsters.find(actor => actor.name === row.actorName), universe: row.universe };
const slots = ['simple', 'secondary', 'defense', 'special'];
const mechanics = profile => Object.fromEntries([
  'effect', 'delivery', 'targetSide', 'excludeSelf', 'shape', 'range', 'areaRadius', 'lineWidth', 'coneAngle',
  'maxTargets', 'multiplier', 'duration', 'healRatio', 'guardReduce', 'buffMultiplier', 'reviveRatio',
  'cleanses', 'statusEffect', 'effectDuration', 'hitAt', 'meterCost'
].filter(key => profile[key] !== undefined).map(key => [key, profile[key]]));

test('the reserved cohort contains forty exact existing identities and no visual approvals', () => {
  assert.equal(fixture.actors.length, 40);
  assert.equal(new Set(fixture.actors.map(row => row.actorKey)).size, 40);
  assert.deepEqual(fixture.actors.map(row => row.actorKey), reservation.actors.map(row => row.actorKey));
  assert.equal(fixture.actors.filter(row => row.kind === 'hero').length, 25);
  assert.equal(fixture.artApproved, false);
  assert.equal(fixture.source1to1Verified, false);
});

for (const row of fixture.actors) test(`source contract: ${row.actorKey}`, () => {
  const actor = actorFor(row);
  assert.ok(actor, row.actorKey);
  assert.equal(actor.id || '', row.actorId);
  assert.equal(actor.name, row.actorName);
  assert.equal(actor.universe, row.universe);
  for (const [key, value] of Object.entries(row.contract)) assert.deepEqual(actor[key], value, key);
  assert.equal(actor.visualReviewStatus, 'pending');
  assert.equal(actor.source1to1Verified, false);
  assert.equal(actor.artApproved, false);
  assert.equal(new URL(actor.referenceUrl).protocol, 'https:');
  const audit = buildActorFidelityBacklog(actor, { kind: row.kind });
  for (const code of ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING']) {
    assert.ok(!audit.tasks.some(task => task.code === code), code);
  }
  assert.equal(audit.artApproved, false);
  assert.equal(audit.completeness, 'OPEN_NOT_EXHAUSTIVE');
  assert.ok(audit.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'));
});

for (const row of fixture.actors.filter(row => row.kind === 'hero' && !['buck', 'cortana_fragment'].includes(row.actorId))) {
  test(`authored runtime semantics remain unchanged: ${row.actorId}`, () => {
    const actor = actorFor(row), original = before.get(row.actorKey);
    for (const slot of slots) {
      assert.deepEqual(mechanics(resolveCombatAbility(actor, slot)), mechanics(original.abilities[slot]), slot);
      // Re-evaluate the frozen old actor through the same unchanged resolver.
      // JSON snapshots turn an unbounded maxTargets Infinity into null.
      const now = getRpgActionProfile(actor, slot), old = getRpgActionProfile(original.actor, slot);
      for (const key of ['effect', 'shape', 'targetSide', 'range', 'maxTargets', 'areaRadius', 'guardReduce', 'buffMultiplier']) {
        assert.deepEqual(now[key], old[key], `RPG ${slot}/${key}`);
      }
    }
  });
}

test('Cortana, Eli and Kleiner never turn their support instructions into damaging rays', () => {
  for (const id of ['cortana', 'cortana_fragment', 'eli_vance', 'kleiner']) {
    const actor = HEROES_DB.find(hero => hero.id === id);
    for (const slot of slots) {
      const profile = resolveCombatAbility(actor, slot);
      assert.ok(['buff', 'guard'].includes(profile.effect), `${id}/${slot}`);
      assert.equal(profile.multiplier, 0, `${id}/${slot}`);
      assert.notEqual(getRpgActionProfile(actor, slot).targetSide, 'enemy', `${id}/${slot}`);
    }
  }
});

test('the historical Buck entry uses his ODST firearm instead of an invented orbital area strike', () => {
  const actor = HEROES_DB.find(hero => hero.id === 'buck');
  const scoped = HEROES_DB.find(hero => hero.id === 'buck_odst');
  assert.equal(actor.incarnation, scoped.incarnation);
  assert.deepEqual(actor.equipment, scoped.equipment);
  for (const slot of slots) assert.deepEqual(mechanics(resolveCombatAbility(actor, slot)), mechanics(resolveCombatAbility(scoped, slot)));
  const special = getRpgActionProfile(actor, 'special');
  assert.equal(special.shape, 'single');
  assert.equal(special.effect, 'damage');
});

test('ME2 Soldier and squad class boundaries remain distinct from other editions', () => {
  const hero = id => HEROES_DB.find(actor => actor.id === id);
  assert.equal(getRpgActionProfile(hero('shepard'), 'secondary').effect, 'buff');
  assert.equal(getRpgActionProfile(hero('shepard'), 'secondary').targetSide, 'self');
  assert.equal(getRpgActionProfile(hero('shepard'), 'special').shape, 'single');
  assert.equal(getRpgActionProfile(hero('garrus'), 'special').shape, 'single');
  assert.equal(getRpgActionProfile(hero('wrex'), 'special').effect, 'guard');
  assert.equal(getRpgActionProfile(hero('wrex'), 'special').targetSide, 'self');
  assert.equal(getRpgActionProfile(hero('tali'), 'special').shape, 'single');
  assert.equal(hero('alyx_vance').defense.name.includes('Gravity Glove'), false);
});

test('legacy enemy signature identities still resolve after source contracts', () => {
  const bullsquid = actorFor(fixture.actors.find(row => row.actorName === 'Acid-Spitting Bullsquid'));
  const houndeye = actorFor(fixture.actors.find(row => row.actorName === 'Houndeye Pack'));
  assert.equal(resolveSourceSignature(bullsquid)?.name, 'Bullsquid Spit');
  assert.equal(resolveSourceSignature(houndeye)?.name, 'Houndeye Sonic Blast');
  assert.equal(actorFor(fixture.actors.find(row => row.actorName === 'Collector Drone')).weapon, 'gun');
});

test('catalogue alignment never silently swaps an invocation performer or its delivered sheet', () => {
  const soldierRelayRestorations = new Set(['garrus', 'liara', 'tali', 'wrex']);
  const view = summon => summon && ({
    id: summon.id, entityName: summon.entityName, sourceHeroId: summon.sourceHeroId,
    performerId: summon.performer?.id, slot: summon.sourceAbility?.slot,
    sheet: summon.entityRender?.asset?.sheet
  });
  for (const row of fixture.actors.filter(row => row.kind === 'hero')) {
    const old = resolveUniverseSummon(before.get(row.actorKey).actor);
    const current = resolveUniverseSummon(actorFor(row));
    if (soldierRelayRestorations.has(row.actorId)) {
      assert.equal(old.action.name, 'Adrenaline Rush', row.actorId);
      assert.equal(old.sourceAbility.slot, 'secondary', row.actorId);
      assert.equal(current.action.name, 'Concussive Shot', row.actorId);
      assert.deepEqual(view(current), { ...view(old), id: `${row.actorId}:reinforcement:shepard:special`, slot: 'special' }, row.actorId);
      continue;
    }
    assert.deepEqual(view(current), view(old), row.actorId);
  }
});

test('all twenty-five battle-local preparations preserve accepted signatures and reviewed profiles', () => {
  for (const row of fixture.actors.filter(row => row.kind === 'hero')) {
    const previous = structuredClone(before.get(row.actorKey).actor);
    const current = structuredClone(actorFor(row));
    const previousSignature = prepareSourceSignature(previous);
    const currentSignature = prepareSourceSignature(current);
    assert.equal(currentSignature?.key ?? null, previousSignature?.key ?? null, row.actorId);
    assert.equal(current.sourceSignature?.key ?? null, previous.sourceSignature?.key ?? null, row.actorId);
    if (previousSignature) assert.deepEqual(current.special, previous.special, `${row.actorId}: complete prepared special`);
    if (['buck', 'cortana_fragment'].includes(row.actorId)) continue; // Explicit gameplay corrections tested above.
    for (const slot of slots) {
      assert.deepEqual(mechanics(resolveCombatAbility(current, slot)), mechanics(resolveCombatAbility(previous, slot)), `${row.actorId}/${slot}`);
      const old = getRpgActionProfile(previous, slot), now = getRpgActionProfile(current, slot);
      for (const key of ['effect', 'shape', 'targetSide', 'range', 'maxTargets', 'areaRadius', 'guardReduce', 'buffMultiplier']) {
        assert.deepEqual(now[key], old[key], `prepared RPG ${row.actorId}/${slot}/${key}`);
      }
    }
  }
});

test('Arbiter declaration rejects altered source identity, custom actions and incomplete markers', () => {
  const actor = HEROES_DB.find(hero => hero.id === 'arbiter');
  assert.equal(resolveSourceSignature(actor)?.key, 'arbiter');
  const old = structuredClone(before.get('["Halo","id:arbiter"]').actor);
  assert.equal(resolveSourceSignature(old)?.key, 'arbiter', 'historical raw source still works');
  const changes = [
    copy => { copy.id = 'foreign_arbiter'; },
    copy => { copy.universe = 'Foreign continuity'; },
    copy => { copy.incarnation = 'Halo 3'; },
    copy => { copy.weaponType = 'gun'; },
    copy => { copy.sourceContractRevision = 'foreign-lot'; },
    copy => { copy.special.name += ' custom'; },
    copy => { copy.special.dmg = 99; },
    copy => { copy.special.targeting = { shape: 'group' }; },
    copy => { copy.special.rpgProfile = { effect: 'damage' }; },
    copy => { delete copy.sourceSignatureDeclaration; },
    ...Object.keys(actor.sourceSignatureDeclaration).map(key => copy => { copy.sourceSignatureDeclaration[key] += ' altered'; }),
    copy => { copy.sourceSignatureDeclaration.extra = 'unexpected'; }
  ];
  for (const change of changes) {
    const custom = structuredClone(actor); change(custom);
    assert.equal(resolveSourceSignature(custom), null, String(change));
  }
});
