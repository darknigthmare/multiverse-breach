import assert from 'node:assert/strict';
import test from 'node:test';
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { resolveCombatAbility, resolveUniverseSummon } = await import('../src/game/combatIdentity.js');
const { getRpgActionProfile } = await import('../src/game/rpgTargeting.js');
const { prepareSourceSignature } = await import('../src/game/signatureSourceKits.js');
const { buildActorFidelityBacklog } = await import('../src/game/actorFidelityBacklog.js');
const { wardrobeActorKey } = await import('../src/game/wardrobe.js');
const { EngineRpg } = await import('../src/game/engineRpg.js');
const { createDlcProfileTransformer } = await import('./dlcProfileTransform.mjs');
const { applyPortalHeroSourceContracts } = await import('../DLC/Portal/data/sourceContracts20261113.js');
const { applyLeft4DeadExpandedSourceContracts } = await import('../DLC/Left4Dead/data/sourceContracts20261113.js');

const root = new URL('../', import.meta.url);
const folder = new URL('../docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('source-contracts-040.json', folder)));
const reservation = JSON.parse(readFileSync(new URL('reserved-actors.json', folder)));
const revive = (_key, value) => value?.$auditNumber === 'Infinity' ? Infinity : value?.$auditNumber === '-Infinity' ? -Infinity : value?.$auditNumber === 'NaN' ? NaN : value;
const baseline = JSON.parse(gunzipSync(readFileSync(new URL('runtime-before.json.gz', folder))), revive).rows;
const before = new Map(baseline.map(row => [row.actorKey, row]));
const slots = ['simple', 'secondary', 'defense', 'special'];
const changed = new Set(fixture.intentionalGameplayChanges);
const invocationChanged = new Set(fixture.intentionalInvocationCorrections);
const findActor = row => {
  if (row.kind === 'hero') return HEROES_DB.find(actor => actor.id === row.actorId && actor.universe === row.universe);
  const roster = ENEMIES_DB[row.universe];
  const actor = row.kind === 'worldBoss' ? roster.worldBoss
    : roster[row.kind === 'boss' ? 'bosses' : 'monsters'].find(actor => actor.name === row.actorName);
  return actor && { ...actor, universe: row.universe };
};
const semantic = profile => profile && Object.fromEntries(Object.entries(profile).filter(([key]) => !['sourceAbility', 'provenance'].includes(key)));
const snapshot = value => JSON.parse(JSON.stringify(value, (_key, item) => typeof item === 'number' && !Number.isFinite(item)
  ? { $auditNumber: String(item) } : item), revive);
const summonView = summon => summon && ({ id: summon.id, kind: summon.kind, entityName: summon.entityName,
  sourceHeroId: summon.sourceHeroId, performerId: summon.performer?.id, slot: summon.sourceAbility?.slot,
  sheet: summon.entityRender?.asset?.sheet, assetKind: summon.entityRender?.kind });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('the forty reserved source identities retain stable IDs, stats, saves and open artwork gates', () => {
  assert.equal(fixture.actors.length, 40);
  assert.equal(new Set(fixture.actors.map(row => row.actorKey)).size, 40);
  assert.deepEqual(fixture.actors.map(row => row.actorKey), reservation.actors.map(row => row.actorKey));
  assert.equal(fixture.actors.filter(row => row.kind === 'hero').length, 16);
  for (const row of fixture.actors) {
    const actor = findActor(row), old = before.get(row.actorKey).actor;
    assert.ok(actor, row.actorKey);
    assert.equal(wardrobeActorKey(actor), row.actorKey);
    for (const key of ['id', 'name', 'universe', 'category', 'stats', 'hp', 'atk', 'def', 'spd', 'color', 'primaryColor', 'secondaryColor']) {
      assert.deepEqual(actor[key], old[key], `${row.actorKey}/${key}`);
    }
    assert.equal(actor.artApproved, false);
    assert.equal(actor.source1to1Verified, false);
    assert.equal(actor.visualReviewStatus, 'pending');
    assert.equal(actor.sourceRoleContract.sourceSceneReview, 'OPEN');
    assert.equal(buildActorFidelityBacklog(actor, { kind: row.kind }).artApproved, false);
  }
});

for (const row of fixture.actors) test(`bounded source target: ${row.actorKey}`, () => {
  const actor = findActor(row);
  for (const [key, value] of Object.entries(row.contract)) assert.deepEqual(actor[key], value, key);
  const audit = buildActorFidelityBacklog(actor, { kind: row.kind });
  if (!row.openSourceIdentity) {
    for (const code of ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING']) assert.equal(audit.tasks.some(task => task.code === code), false, code);
    assert.ok(audit.tasks.some(task => task.code === 'REFERENCE_SCENE_REVIEW'));
  } else {
    assert.equal(actor.sourceRoleContract.canonicalEntityStatus, 'UNRESOLVED_LEGACY_ADAPTATION');
    assert.ok(audit.tasks.some(task => task.code === 'VISUAL_CONTRACT_MISSING'));
    assert.ok(audit.tasks.some(task => task.code === 'REFERENCE_MISSING'));
  }
  assert.ok(audit.tasks.some(task => task.code === 'ANIMATION_AND_VISUAL_REVIEW'));
  assert.ok(audit.tasks.some(task => task.code === 'OFFICIAL_COSTUME_RESEARCH'));
  for (const evidence of actor.sourceReferenceEvidence) {
    assert.equal(hash(readFileSync(new URL(evidence.path, root))), evidence.sha256);
    assert.equal(evidence.imageInspected, false);
    assert.match(evidence.scope, /text only/);
  }
});

test('all forty preparations retain their signature selection; 38 native and complete RPG profiles remain exact', () => {
  for (const row of fixture.actors) {
    const old = before.get(row.actorKey), actor = structuredClone(findActor(row));
    const previousActor = structuredClone(old.actor);
    prepareSourceSignature(previousActor);
    const selected = prepareSourceSignature(actor);
    assert.equal(selected, null, row.actorKey);
    assert.equal(old.selectedLegacySignature, null, row.actorKey);
    for (const slot of slots) {
      if (changed.has(row.actorId)) continue;
      assert.deepEqual(semantic(resolveCombatAbility(actor, slot)), semantic(old.prepared[slot].combat), `${row.actorKey}/${slot}/prepared combat`);
      const side = row.kind === 'hero' ? 'player' : 'enemy';
      // JSON omits own undefined fields. Compare complete live profiles as
      // well as the frozen serialized result, preserving non-finite numbers.
      const previousRpg = getRpgActionProfile(previousActor, slot, side);
      assert.deepEqual(getRpgActionProfile(actor, slot, side), previousRpg, `${row.actorKey}/${slot}/complete prepared RPG`);
      assert.deepEqual(snapshot(previousRpg), old.prepared[slot].rpgProfile, `${row.actorKey}/${slot}/frozen RPG`);
      assert.deepEqual(semantic(resolveCombatAbility(findActor(row), slot)), semantic(old.unprepared[slot].combat), `${row.actorKey}/${slot}/combat`);
    }
  }
});

test('all ten Portal heroes are zero-damage support and the two old offensive proxies are demonstrably corrected', () => {
  for (const row of fixture.actors.filter(row => row.kind === 'hero' && row.universe === 'Portal')) {
    const actor = findActor(row);
    for (const slot of slots) {
      const combat = resolveCombatAbility(actor, slot), rpg = getRpgActionProfile(actor, slot);
      assert.equal(combat.multiplier, 0, `${row.actorId}/${slot}`);
      assert.ok(['buff', 'guard'].includes(combat.effect));
      assert.ok(['ally', 'self'].includes(combat.targetSide));
      assert.ok(['buff', 'guard'].includes(rpg.effect));
      assert.notEqual(rpg.targetSide, 'enemy');
    }
  }
  for (const id of changed) {
    const row = fixture.actors.find(row => row.actorId === id);
    assert.ok(before.get(row.actorKey).unprepared.simple.combat.multiplier > 0, id);
    assert.equal(findActor(row).weaponType, 'none');
  }
});

test('raw generic alignment preserves Bill secondary and the unaffected invocation IDs, performers and assets', () => {
  for (const row of fixture.actors) {
    const actor = findActor(row);
    if (!invocationChanged.has(row.actorId)) assert.deepEqual(summonView(resolveUniverseSummon(actor)), summonView(before.get(row.actorKey).summon), row.actorKey);
    if (row.kind !== 'hero') continue;
    const generic = buildActorFidelityBacklog(actor).tasks.some(task => task.code === 'GENERIC_TECHNIQUE_NAMES');
    assert.equal(generic, row.actorId === 'bill_l4d', row.actorId);
  }
  const bill = HEROES_DB.find(actor => actor.id === 'bill_l4d');
  assert.deepEqual(bill.secondary, before.get('["Left 4 Dead","id:bill_l4d"]').actor.secondary);
  assert.equal(resolveUniverseSummon(HEROES_DB.find(actor => actor.id === 'zoey_l4d')).sourceAbility.slot, 'special');
});

test('hazards, dialogue cores and recordings cannot be mistaken for newly verified canonical bodies', () => {
  const portal = name => findActor(fixture.actors.find(row => row.actorName === name));
  for (const name of ['Excursion Funnel Hazard', 'Neurotoxin Vent System', 'Gel Pump Hazard']) {
    assert.equal(portal(name).sourceRoleContract.entityKind, 'environmental-system');
    assert.match(portal(name).sourceRoleContract.sourceGameplayBoundary, /adaptation|OPEN/);
  }
  for (const name of ['Fact Core Logic Snare', 'Space Core Vacuum Loop']) assert.equal(portal(name).sourceRoleContract.entityKind, 'dialogue-core');
  for (const name of ['Sentry Drone Sphere', 'Cave Johnson Recording Core', 'Aperture Cooperative Test Core']) {
    const actor = portal(name);
    assert.equal(actor.incarnation, undefined);
    assert.equal(actor.referenceUrl, undefined);
    assert.equal(actor.visualAnchor, undefined);
    assert.equal(actor.sourceRoleContract.canonicalEntityStatus, 'UNRESOLVED_LEGACY_ADAPTATION');
  }
  const pool = findActor(fixture.actors.find(row => row.actorName === 'Spitter Acid Pool'));
  assert.equal(pool.sourceRoleContract.entityKind, 'environmental-hazard');
  assert.match(pool.visualAnchor, /no independent humanoid/);
  assert.match(pool.sourceRoleContract.sourceGameplayBoundary, /OPEN/);
});

const noop = () => {};
const dummy = id => ({ id, name: id, universe: 'Nexus de Convergence', category: 'tactical', primaryColor: '#777777',
  stats: { hp: 10000, atk: 1, def: 0, spd: 1 }, hp: 10000, atk: 1, spd: 1,
  simple: { name: 'Fixture strike', type: 'melee', dmg: 1 } });
function makeRpg(id, side) {
  const caller = HEROES_DB.find(actor => actor.id === id), own = [caller, dummy('portal-source-ally')], others = [dummy('portal-source-foe')];
  const players = side === 'player' ? own : others, enemies = side === 'enemy' ? own : others;
  const engine = new EngineRpg(960, 540, structuredClone(players), { monsters: structuredClone(enemies), bosses: [], customRoster: structuredClone(enemies) },
    { add: noop }, noop, noop, { universe: 'Portal', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false; engine.enemyGlobalRecovery = 99999;
  for (const unit of [...engine.heroes, ...engine.enemies]) Object.assign(unit, {
    currentHp: 10000, maxHp: 10000, atb: 100, specialCharge: 100, cooldown: 0, state: 'idle', stateTimer: 0, actionPending: false
  });
  return { engine, actor: (side === 'player' ? engine.heroes : engine.enemies)[0] };
}

for (const id of invocationChanged) for (const side of ['player', 'enemy']) test(`real RPG one-spend Chell support and cleanup: ${id}/${side}`, () => {
  const template = HEROES_DB.find(actor => actor.id === id), descriptor = resolveUniverseSummon(template);
  assert.equal(template.sourceInvocationContract.performerHeroId, 'chell');
  assert.ok(template.sourceInvocationContract.sourceSceneContext.length > 100);
  assert.equal(template.sourceInvocationContract.sameCanonicalCombatSceneClaimed, false);
  assert.equal(descriptor.kind, 'reinforcement');
  assert.equal(descriptor.performer.id, 'chell');
  assert.equal(descriptor.performer.incarnation, HEROES_DB.find(actor => actor.id === 'chell').incarnation);
  assert.equal(descriptor.entityName, 'Chell');
  assert.equal(descriptor.sourceAbility.slot, 'secondary');
  assert.equal(descriptor.action.dmg, 0);
  assert.equal(descriptor.action.targeting.effect, 'guard');
  assert.equal(descriptor.provenance.canonicalEntity, false);
  assert.equal(descriptor.entityRender?.asset, undefined, 'reuse the roster performer, without inventing a new entity sheet');
  const old = before.get(fixture.actors.find(row => row.actorId === id).actorKey).summon;
  assert.equal(old.entityName, 'Turret Summon');
  assert.match(old.entityRender.asset.sheet, /portal-turret/);
  assert.notEqual(descriptor.id, old.id, 'the binding correction is explicit');
  const { engine, actor } = makeRpg(id, side);
  try {
    const hp = () => [...engine.heroes, ...engine.enemies].map(unit => unit.currentHp);
    const originalHp = hp(), impacts = [];
    const nativeImpact = engine.applyRpgImpact;
    engine.applyRpgImpact = function(...args) { if (args[4] === 'summon') impacts.push(args[1].effect); return nativeImpact.apply(this, args); };
    assert.equal(engine.summon(actor, side), true);
    assert.equal(engine.confirmTargeting(), true);
    assert.ok(engine.activeSummon);
    assert.equal(actor.atb, 0);
    assert.equal(actor.specialCharge, 0);
    assert.equal(actor.summonUsed, true);
    assert.equal(engine.summon(actor, side), false);
    for (let tick = 0; tick < 360 && engine.activeSummon; tick += 1) engine.update();
    assert.equal(engine.activeSummon, null);
    assert.deepEqual(impacts, ['guard'], 'the actual impact must occur once');
    assert.deepEqual(hp(), originalHp, 'neither allies nor opponents take support damage');
    assert.equal(actor.actionPending, false);
    assert.equal(actor.state, 'idle');
    actor.atb = actor.specialCharge = 100;
    assert.equal(engine.summon(actor, side), false, 'refilling meters cannot bypass the once-per-battle flag');
    engine.dispose();
    assert.equal(engine.targeting, null);
    assert.equal(engine.activeSummon, null);
    assert.equal(engine.timers.size, 0);
    assert.equal(engine.actionQueue.length, 0);
    assert.equal(engine.enemyActionLock, false);
  } finally { engine.dispose(); }
});

for (const id of invocationChanged) test(`real RPG disposal cancels pending Chell impact: ${id}`, () => {
  const { engine, actor } = makeRpg(id, 'player');
  const hp = [...engine.heroes, ...engine.enemies].map(unit => unit.currentHp), impacts = [];
  const original = engine.applyRpgImpact;
  engine.applyRpgImpact = function(...args) { if (args[4] === 'summon') impacts.push(args[1].effect); return original.apply(this, args); };
  try {
    assert.equal(engine.summon(actor), true);
    assert.equal(engine.confirmTargeting(), true);
    engine.update();
    assert.equal(engine.activeSummon.impacted, false);
    engine.dispose();
    for (let tick = 0; tick < 240; tick += 1) engine.update();
    assert.deepEqual(impacts, []);
    assert.deepEqual([...engine.heroes, ...engine.enemies].map(unit => unit.currentHp), hp);
    assert.equal(engine.activeSummon, null);
    assert.equal(engine.targeting, null);
    assert.equal(engine.timers.size, 0);
    assert.equal(actor.actionPending, false);
  } finally { engine.dispose(); }
});

test('private source helpers are absent from base profiles, retained only in their own selected packs, and immutable', () => {
  const manifests = ['Portal', 'Left4Dead'].map(directory => JSON.parse(readFileSync(new URL(`DLC/${directory}/manifest.json`, root))));
  const base = createDlcProfileTransformer({ root: fileURLToPath(root), manifests, installedPackIds: [] });
  const selected = createDlcProfileTransformer({ root: fileURLToPath(root), manifests, installedPackIds: ['portal'] });
  for (const [index, directory] of ['Portal', 'Left4Dead'].entries()) {
    const declaration = manifests[index].modules.filter(module => module.path === 'data/sourceContracts20261113.js');
    assert.equal(declaration.length, 1);
    assert.equal(Object.hasOwn(declaration[0], 'runtimeAdapter'), false);
    const file = fileURLToPath(new URL(`DLC/${directory}/data/sourceContracts20261113.js`, root)), source = readFileSync(file, 'utf8');
    assert.throws(() => base.transform(source, file), /Excluded DLC module/);
    if (directory === 'Portal') assert.equal(selected.transform(source, file), null);
    else assert.throws(() => selected.transform(source, file), /Excluded DLC module/);
  }
  const foreign = { id: 'chell', universe: 'Foreign continuity', stats: { hp: 17 } };
  assert.equal(applyPortalHeroSourceContracts(foreign), foreign);
  const source = { id: 'chell', stats: { hp: 17 } }, unchanged = structuredClone(source);
  const first = applyPortalHeroSourceContracts(source), second = applyPortalHeroSourceContracts(source);
  first.equipment.push('unreviewed mutation');
  assert.deepEqual(source, unchanged);
  assert.equal(second.equipment.includes('unreviewed mutation'), false);
  const unknownRecord = { hero: ['other', 'Other', 'tactical'], allies: [], monsters: ['Unreserved'], bosses: ['Tank'] };
  assert.deepEqual(applyLeft4DeadExpandedSourceContracts(unknownRecord), unknownRecord);
});
