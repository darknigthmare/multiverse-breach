import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveCombatAbility } from '../src/game/combatIdentity.js';
import { prepareSourceSignature } from '../src/game/signatureSourceKits.js';
import { installSignatureDirector } from '../src/game/signatureDirector.js';
import { buildActorFidelityBacklog } from '../src/game/actorFidelityBacklog.js';
import { getHeroSpriteSheetSrc, getEnemySpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { EngineSmash } from '../src/game/engineSmash.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { assertCatalogActionEdition, HAMMOND_PULSE_RIFLE_SOURCE_ERRATUM_20261113,
  assertHammondPulseRifleSourceField } from './combatCanonicalEditionFixtures.mjs';
import { GEARS_DEADSPACE_CATALOG_EDITIONS_20261113 } from './gearsDeadSpaceCatalogEditions20261113.mjs';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 as sources } from '../src/game/combat/combatSourceDefinitionsWave15.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { HAMMOND_AUTHORING_SOURCE_ERRATUM_20261113, projectHammondSourceAuthoringForHistory } from './gearsDeadSpaceHammondAuthoringErratum20261113.mjs';
import { projectAbilitiesBeforeWave17, HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17, WAVE17_REVIEWED_IDS } from './combatFidelityHistoricalCohortWave17.mjs';
import * as gears from '../DLC/GearsOfWar/data/actorSourceContracts.js';
import * as dead from '../DLC/DeadSpace/data/actorSourceContracts.js';

const folder = new URL('../docs/assets/p0-p1-p2-continuation-02-2026-11-13/gears-deadspace-040/', import.meta.url);
const before = JSON.parse(gunzipSync(fs.readFileSync(new URL('baseline-runtime.json.gz', folder))));
const rows = before.rows;
const clone = value => structuredClone(value);
const current = row => row.kind === 'hero' ? HEROES_DB.find(hero => hero.id === row.actor.id && hero.universe === row.actor.universe)
  : { ...(row.kind === 'worldBoss' ? ENEMIES_DB[row.actor.universe].worldBoss
    : ENEMIES_DB[row.actor.universe][row.kind === 'boss' ? 'bosses' : 'monsters'].find(actor => actor.name === row.actor.name)), universe: row.actor.universe };
const semantic = profile => profile && Object.fromEntries(Object.entries(profile).filter(([key]) => !['sourceAbility', 'provenance'].includes(key)));

test('exact forty actors keep IDs/stats/raster bindings and hold unresolved Infector Pod source work open', () => {
  assert.equal(before.sourceCommit, '98991b161d0116dd9fa8d52d42f2337a243f2091');
  assert.equal(rows.length, 40); assert.equal(new Set(rows.map(row => row.actorKey)).size, 40);
  assert.equal(rows.filter(row => row.kind === 'hero').length, 15);
  for (const row of rows) {
    const actor = current(row);
    for (const key of ['id', 'name', 'universe', 'stats', 'hp', 'atk', 'def', 'spd', 'color', 'primaryColor', 'category']) assert.deepEqual(actor[key], row.actor[key], `${row.actorKey}:${key}`);
    assert.equal(actor.source1to1Verified, false); assert.equal(actor.artApproved, false);
    if (row.kind === 'hero') {
      for (const mode of ['auto', 'rpg', 'melee']) assert.equal(getHeroSpriteSheetSrc(actor, mode), getHeroSpriteSheetSrc(row.actor, mode), `${row.actor.id}:${mode}`);
      assert.deepEqual(getCharacterAnimationAssets(actor), getCharacterAnimationAssets(row.actor), row.actor.id);
    } else assert.equal(getEnemySpriteSheetSrc(actor), getEnemySpriteSheetSrc(row.actor), row.actor.name);
    const next = buildActorFidelityBacklog(actor, { kind: row.kind, rasterProbes: row.backlog.rasterProbes });
    const codes = next.tasks.map(task => task.code);
    for (const code of row.backlog.tasks.map(task => task.code).filter(code => !['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING', 'GENERIC_TECHNIQUE_NAMES'].includes(code))) assert.ok(codes.includes(code), `${row.actor.name}: retain ${code}`);
    if (actor.name === 'Necromorph Infector Pod') {
      for (const code of ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING']) assert.ok(codes.includes(code));
      assert.doesNotMatch(actor.special, /T[- ]Virus/i);
    } else for (const code of ['INCARNATION_UNSPECIFIED', 'VISUAL_CONTRACT_MISSING', 'REFERENCE_MISSING']) assert.equal(codes.includes(code), false, `${row.actor.name}:${code}`);
    assert.deepEqual(next.missingRasterPaths, row.backlog.missingRasterPaths);
  }
});

test('all 160 slot lookups and their prepared counterparts preserve semantic profiles and source kit identity', () => {
  let count = 0;
  for (const row of rows) {
    const actor = current(row), prepared = clone(actor), oldPrepared = clone(row.actor);
    assert.equal(prepareSourceSignature(prepared)?.key || null, row.sourceKitKey);
    assert.equal(prepareSourceSignature(oldPrepared)?.key || null, row.sourceKitKey);
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      assert.deepEqual(semantic(resolveCombatAbility(actor, slot)), semantic(row.resolved[slot]), `${row.actor.name}:${slot}`);
      assert.deepEqual(semantic(resolveCombatAbility(prepared, slot)), semantic(row.preparedResolved[slot]), `${row.actor.name}:${slot}:prepared`);
      count++;
    }
  }
  assert.equal(count, 160);
});

test('fourteen exact catalog projections retain historical action objects and reject altered sources/actions', () => {
  assert.equal(Object.keys(GEARS_DEADSPACE_CATALOG_EDITIONS_20261113).length, 14);
  for (const [id, edition] of Object.entries(GEARS_DEADSPACE_CATALOG_EDITIONS_20261113)) {
    const actor = HEROES_DB.find(hero => hero.id === id);
    for (const [slot, record] of Object.entries(edition.slots)) {
      assertCatalogActionEdition(actor, slot, record.historical);
      assert.throws(() => assertCatalogActionEdition({ ...actor, incarnation: 'Other version' }, slot, record.historical));
      assert.throws(() => assertCatalogActionEdition({ ...actor, universe: 'Other universe' }, slot, record.historical));
      assert.throws(() => assertCatalogActionEdition({ ...actor, sourceFidelityAudit: 'unreviewed' }, slot, record.historical));
      for (const [field, value] of [['name', 'Other action'], ['type', 'magic'], ['dmg', -1], ['targeting', { shape: 'group' }], ['extra', true]]) assert.throws(() => assertCatalogActionEdition({ ...actor, [slot]: { ...actor[slot], [field]: value } }, slot, record.historical), `${id}/${slot}/${field}`);
      assert.throws(() => assertCatalogActionEdition(actor, slot, { ...record.historical, name: 'Altered historical name' }));
    }
  }
  const old = rows.find(row => row.actor.id === 'hammond_ds').actor, actor = HEROES_DB.find(hero => hero.id === 'hammond_ds');
  for (const slot of ['simple', 'secondary', 'defense', 'special']) assert.deepEqual(actor[slot], old[slot], 'Historical duplicate must not silently acquire Zach W15 mechanics');
});

test('Hammond source erratum corrects only weapon/pose and refuses unknown fields, editions and tampered historical labels', () => {
  const correction = HAMMOND_PULSE_RIFLE_SOURCE_ERRATUM_20261113;
  assert.deepEqual(Object.keys(correction.historical).filter(key => JSON.stringify(correction.historical[key]) !== JSON.stringify(correction.current[key])), ['weapon', 'pose']);
  for (const field of ['weapon', 'pose']) {
    assertHammondPulseRifleSourceField('zach_hammond', sources.zach_hammond, correction.historical, field);
    assert.throws(() => assertHammondPulseRifleSourceField('hammond_ds', sources.zach_hammond, correction.historical, field));
    assert.throws(() => assertHammondPulseRifleSourceField('zach_hammond', { ...sources.zach_hammond, [field]: 'Other weapon' }, correction.historical, field));
    assert.throws(() => assertHammondPulseRifleSourceField('zach_hammond', { ...sources.zach_hammond, sourceWork: 'Dead Space 2023' }, correction.historical, field));
    assert.throws(() => assertHammondPulseRifleSourceField('zach_hammond', sources.zach_hammond, { ...correction.historical, [field]: 'Altered old source' }, field));
  }
  assert.throws(() => assertHammondPulseRifleSourceField('zach_hammond', sources.zach_hammond, correction.historical, 'damage'));
  assert.equal(sources.zach_hammond.weapon, 'SWS Motorized Pulse Rifle');
  assert.ok(HEROES_DB.find(hero => hero.id === 'zach_hammond').equipment.includes('SWS Motorized Pulse Rifle'));
  assert.equal(ENEMIES_DB['Dead Space'].monsters.find(actor => actor.name === 'Exploder Necromorph').weapon, 'explosive_sac');
});

test('private contracts fail closed for unknown identities and keep neighboring actors unchanged', () => {
  for (const api of [gears, dead]) for (const id of ['constructor', '__proto__', 'unregistered']) {
    assert.throws(() => api.sourceHeroContract(id)); assert.throws(() => api.sourceEnemyContract(id));
  }
  assert.throws(() => gears.sourceHeroContract('isaac')); assert.throws(() => dead.sourceHeroContract('marcus'));
  const actor = { name: 'Unselected monster', hp: 12 }, roster = { monsters: [actor] };
  assert.equal(dead.applySourceEnemyContracts(roster).monsters[0], actor);
  assert.equal(gears.applySourceEnemyContracts(roster).monsters[0], actor);
});

test('historical authoring retains exact 211-V wording while only the fully pinned current Hammond source prose is normalized', () => {
  const { historical, current: corrected } = HAMMOND_AUTHORING_SOURCE_ERRATUM_20261113;
  assert.deepEqual(Object.keys(historical).filter(key => JSON.stringify(historical[key]) !== JSON.stringify(corrected[key])), ['sourceReference']);
  assert.match(historical.sourceReference, /211-V plasma pulse rifle/);
  assert.match(corrected.sourceReference, /SWS Motorized Pulse Rifle/);
  assert.deepEqual(projectHammondSourceAuthoringForHistory(corrected, historical), historical);
  assert.deepEqual(projectHammondSourceAuthoringForHistory(historical, historical), historical);
  for (const edit of [
    actor => { actor.simple.dmg = -1; }, actor => { actor.special.targeting.shape = 'group'; },
    actor => { actor.sourceReference += ' Unreviewed addition'; }, actor => { actor.universe = 'Other'; },
    actor => { actor.sourceWork = 'Dead Space 2023'; }, actor => { actor.sourceHeroId = 'hammond_ds'; },
    actor => { actor.source1to1Verified = true; }, actor => { actor.extra = true; }
  ]) { const altered = clone(corrected); edit(altered); assert.throws(() => projectHammondSourceAuthoringForHistory(altered, historical)); }
  assert.throws(() => projectHammondSourceAuthoringForHistory(corrected, { ...historical, sourceReference: 'Altered history' }));
  const current = { ...COMBAT_ABILITY_OVERRIDES }, oldLabels = { ...current, zach_hammond: historical };
  assert.deepEqual(projectAbilitiesBeforeWave17(current), projectAbilitiesBeforeWave17(oldLabels), 'All historical records remain identical after the exact provenance-only correction');
  assert.deepEqual(projectAbilitiesBeforeWave17(HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17), HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17);
  const outsider = Object.keys(HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17).find(id => id !== 'zach_hammond' && !WAVE17_REVIEWED_IDS.has(id));
  const changed = clone(current[outsider]); changed.sourceReference += ' Foreign mutation';
  assert.throws(() => projectAbilitiesBeforeWave17({ ...current, [outsider]: changed }), /outside the W17 cohort/);
});

const foe = { id: 'gd-contract-target', name: 'Contract fixture', universe: 'Nexus de Convergence', hp: 50000, atk: 1, spd: 1, def: 0, color: '#777' };
function make(template, mode) {
  const stage = { universe: 'Nexus de Convergence', mode, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const engine = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [clone(template)], { customRoster: [foe], monsters: [foe], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  engine.syncPreMatchFromServer?.(3000); engine.completeMeleeIntros?.();
  Object.assign(engine.heroes[0], { state: 'idle', atb: 100, specialCharge: 100, action: null, cooldown: 0, x: 200, y: 250, facing: 1 });
  Object.assign(engine.enemies[0], { x: 240, y: 250 });
  engine.enemyGlobalRecovery = 99999;
  installSignatureDirector(engine, { mode });
  return engine;
}
const ticks = (engine, count) => { for (let i = 0; i < count; i++) engine.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
function execute(template, mode, slot) {
  const engine = make(template, mode), actor = engine.heroes[0], target = engine.enemies[0];
  try {
    const contacts = [], native = engine.applyDamage;
    engine.applyDamage = (...args) => { contacts.push(args[2]); return native(...args); };
    actor.currentHp = Math.max(1, actor.maxHp - 20);
    let started;
    if (mode === 'RPG') {
      const context = engine.getActionContext(actor, slot, 'player');
      const side = resolveCombatAbility(actor, slot).targetSide;
      const selected = side === 'enemy' ? target : actor;
      started = engine.executeRpgAction(context, [selected.battleId]);
      assert.equal(actor.atb, 0, 'RPG action must reserve one ATB budget');
      assert.equal(engine.executeRpgAction(context, [selected.battleId]), false, 'Reserved RPG action cannot execute twice');
    } else {
      started = engine.triggerAbility(actor, slot);
      assert.equal(engine.triggerAbility(actor, slot), false, 'Reserved melee super cannot execute twice');
    }
    assert.equal(started, true, `${template.id}:${mode}:${slot}`);
    if (slot === 'special') assert.equal(actor.specialCharge, 0, 'One special meter budget must be reserved');
    ticks(engine, 160);
    return { contacts, actorHp: actor.currentHp, targetHp: target.currentHp,
      charge: actor.specialCharge, cooldown: actor.cooldown, state: actor.state,
      guard: actor.rpgGuardTicks || actor.guardTicks || 0, buff: actor.rpgBuffTicks || 0 };
  } finally { engine.dispose(); }
}

test('real RPG executions retain all sixty authored slot outcomes before and after projection', () => {
  const random = Math.random; Math.random = () => 0.5;
  try {
    for (const row of rows.filter(row => row.kind === 'hero')) for (const slot of ['simple', 'secondary', 'defense', 'special']) assert.deepEqual(execute(current(row), 'RPG', slot), execute(row.actor, 'RPG', slot), `${row.actor.id}:${slot}`);
  } finally { Math.random = random; }
});

test('real melee supers retain damage/support, resource use and cleanup for all fifteen heroes', () => {
  const random = Math.random; Math.random = () => 0.5;
  try {
    for (const row of rows.filter(row => row.kind === 'hero')) assert.deepEqual(execute(current(row), 'Smash', 'special'), execute(row.actor, 'Smash', 'special'), row.actor.id);
  } finally { Math.random = random; }
});

test('General RAAM keeps the original Lightmass train incarnation and native Kryll damage gate', () => {
  const stage = CANON_PRIORITY_STAGES.lightmassTrain;
  const data = resolveStageEnemyData({ stage, ...ENEMIES_DB['Gears of War'] });
  const engine = new EngineRpg(760, 420, [HEROES_DB.find(hero => hero.id === 'marcus')], data,
    { add() {} }, () => {}, () => {}, stage);
  try {
    engine.wave = 2; engine.spawnWave(); engine.enemyGlobalRecovery = 99999;
    const target = engine.enemies.find(enemy => enemy.name === 'General RAAM');
    assert.ok(target); assert.equal(target.incarnation, 'Gears of War (2006) - Lightmass Bomb train');
    const hp = target.currentHp;
    engine.applyDamage(engine.heroes[0], target, 100);
    assert.equal(target.currentHp, hp, 'Source declarations must not disable the native Kryll protection');
  } finally { engine.dispose(); }
});
