import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCustomEnemyCatalog, buildCustomEnemyData, makeCustomEnemyId } from '../src/game/customBattle.js';
import { ENEMIES_DB, getFinalePolicyForUniverse } from '../src/game/enemies.js';
import { EngineRpg } from '../src/game/engineRpg.js';
import { getExpandedStages } from '../src/game/expandedUniverses.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { getOriginalCampaignBossSecondary, getOriginalCampaignEnemySecondary } from '../src/game/originalCampaignEnemyActions.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';
import { getRpgActionProfile, getRpgCombatantAbility } from '../src/game/rpgTargeting.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';

const stages = getExpandedStages();
const catalog = buildCustomEnemyCatalog();
const roster = ORIGINAL_UNIVERSE_DEFINITIONS.map(world => {
  const mission = world.stages.find(stage => stage.mode === 'RPG');
  const stage = stages.find(stage => stage.universe === world.universe && stage.stageKey === mission.stageKey);
  const enemies = ENEMIES_DB[world.universe];
  const boss = [...enemies.bosses, enemies.worldBoss].find(enemy => enemy.id === mission.bossId);
  return { world, stage, boss, enemies };
});
const noop = () => {};
const place = (unit, x, y) => Object.assign(unit, { x, y, homeX: x, homeY: y });
const ticks = (engine, count) => { for (let i = 0; i < count; i++) engine.update(); };

function makeBattle({ world, stage, boss, enemies }, campaign = false) {
  const heroes = HEROES_DB.filter(hero => hero.universe === world.universe);
  const kind = boss.production.isWorldBoss ? 'worldBoss' : 'boss';
  const enemyData = campaign ? {
    ...resolveStageEnemyData({ ...enemies, stage }),
    finalePolicy: stage.finalePolicy || getFinalePolicyForUniverse(world.universe)
  } : buildCustomEnemyData([makeCustomEnemyId(world.universe, kind, boss.name)], catalog);
  const layout = campaign ? stage : { ...stage, customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const engine = new EngineRpg(1040, 520, heroes, enemyData, { add: noop }, noop, noop, layout);
  if (campaign) {
    // Enter the designated boss wave through the ordinary progression path.
    for (let i = 1; i < engine.maxWaves && !engine.enemies.some(enemy => enemy.id === boss.id); i++) {
      engine.enemies.forEach(enemy => { enemy.currentHp = 0; });
      engine.update();
    }
  }
  const source = engine.enemies.find(enemy => enemy.id === boss.id);
  assert.ok(source, `${boss.id} did not enter the ${campaign ? 'campaign' : 'custom'} battle`);
  assert.equal(source.isBoss, true);
  assert.equal(Boolean(source.isWorldBoss), boss.production.isWorldBoss);
  place(source, 660, 300);
  place(engine.heroes[0], 550, 300);
  place(engine.heroes[1], 575, 312);
  place(engine.heroes[2], 320, 510);
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = 0; });
  engine.enemyGlobalRecovery = 0;
  source.atb = 100;
  return { engine, source };
}

test('one new secondary is attached to the actual RPG boss of each original world', () => {
  assert.equal(roster.length, 20);
  assert.equal(roster.filter(({ boss }) => boss.production.isWorldBoss).length, 19);
  assert.equal(new Set(roster.map(({ boss }) => getOriginalCampaignBossSecondary(boss).name)).size, 20);
  for (const { stage, boss, enemies } of roster) {
    assert.equal(stage.mode, 'RPG');
    assert.equal(stage.bossId, boss.id);
    const secondary = getOriginalCampaignBossSecondary(boss);
    assert.equal(secondary.cd, 3);
    assert.deepEqual(getRpgCombatantAbility(boss, 'secondary'), secondary);
    for (const other of [...enemies.monsters, ...enemies.bosses, enemies.worldBoss]) {
      if (other.id !== boss.id) assert.equal(getOriginalCampaignBossSecondary(other), null);
    }
    for (const slot of ['simple', 'defense', 'special', 'summon']) {
      assert.deepEqual(getRpgActionProfile(boss, slot, 'enemy'), getRpgActionProfile({ ...boss, secondary: null }, slot, 'enemy'));
    }
  }
  const ordinaryEnemies = Object.entries(ENEMIES_DB).flatMap(([universe, units]) => units.monsters.map(unit => ({ ...unit, universe })));
  assert.equal(ordinaryEnemies.filter(getOriginalCampaignEnemySecondary).length, 120);
});

test('altered source signals and explicit secondaries retain their previous RPG behavior', () => {
  const { boss } = roster[0];
  const lookalikes = [
    { id: 'other' }, { name: 'A different actor' }, { weapon: 'rifle' }, { universe: 'Other universe' },
    { sourceUniverse: 'Other universe' }, { sourceId: 'other' }, { sourceHeroId: 'other' },
    { isBoss: false }, { isWorldBoss: false }, { combatRole: 'commander' }, { production: null },
    { production: { ...boss.production, isWorldBoss: false } },
    { special: { ...boss.special, en: 'A different signature' } }, { special: { ...boss.special, targeting: {} } }
  ];
  for (const mismatch of lookalikes) {
    const actor = { ...boss, ...mismatch };
    assert.equal(getOriginalCampaignBossSecondary(actor), null);
    assert.equal(getRpgActionProfile(actor, 'secondary', 'enemy').name, 'Strong attack');
  }
  const supplied = { name: 'Custom bolt', type: 'bullet', dmg: 1, cd: 2 };
  assert.equal(getRpgCombatantAbility({ ...boss, secondary: supplied }, 'secondary'), supplied);
  assert.equal(getRpgCombatantAbility({ ...boss, secondary: null }, 'secondary'), null);
  assert.equal(getRpgCombatantAbility({ ...boss, rpgAttacks: { secondary: { shape: 'line' } } }, 'secondary'), null);
});

for (const encounter of roster) test(`${encounter.boss.name} uses the same second attack in campaign CPU and custom P2`, () => {
  const secondary = getOriginalCampaignBossSecondary(encounter.boss);
  for (const campaign of [false, true]) {
    const { engine, source } = makeBattle(encounter, campaign);
    try {
      const profile = engine.getActionContext(source, 'secondary', 'enemy').profile;
      assert.equal(profile.action, secondary);
      const intended = profile.effect === 'buff' ? [source]
        : engine.heroes.slice(0, profile.shape === 'single' ? 1 : 2);
      const startingHp = engine.heroes.map(hero => hero.currentHp);

      if (campaign) {
        assert.equal(engine.opponentControl, 'cpu');
        engine.update();
      } else {
        assert.equal(engine.beginTargeting(source, 'secondary', 'enemy'), true);
        if (profile.effect === 'damage' && profile.delivery !== 'radial') {
          assert.equal(engine.selectTarget(engine.heroes[0].battleId), true);
        }
        const preview = engine.getTargetingState();
        assert.equal(preview.abilityName, secondary.name);
        assert.equal(preview.valid, true);
        assert.deepEqual(new Set(preview.previewTargetIds), new Set(intended.map(unit => unit.battleId)));
        assert.equal(source.atb, 100);
        assert.equal(source.cooldown, 0);
        assert.equal(engine.confirmTargeting(), true);
        assert.equal(engine.confirmTargeting(), false);
      }
      assert.equal(source.atb, 0);
      assert.equal(source.cooldown, 180);
      assert.equal(source.specialCharge, 20);
      const impactTick = profile.delivery === 'melee' ? 12 : 18;
      ticks(engine, impactTick - 1);
      assert.equal(source.rpgBuffTicks || 0, 0);
      assert.deepEqual(engine.heroes.map(hero => hero.currentHp), startingHp);
      assert.ok(engine.heroes.every(hero => Object.values(hero.statusEffects).every(ticks => ticks === 0)));
      ticks(engine, 1);
      if (profile.effect === 'buff') {
        assert.equal(source.rpgBuffMultiplier, 1.19);
        assert.ok(source.rpgBuffTicks > 0);
      }
      for (const [index, hero] of engine.heroes.entries()) {
        assert.equal(hero.currentHp < startingHp[index], intended.includes(hero) && secondary.dmg > 0, hero.name);
        for (const status of Object.keys(hero.statusEffects)) {
          assert.equal(hero.statusEffects[status] > 0, intended.includes(hero) && status === secondary.statusEffect, `${hero.name} ${status}`);
        }
      }
      const hpAfterImpact = engine.heroes.map(hero => hero.currentHp);
      ticks(engine, 24);
      assert.deepEqual(engine.heroes.map(hero => hero.currentHp), hpAfterImpact);
      assert.equal(source.actionPending, false);
    } finally {
      engine.dispose();
    }
  }
});
