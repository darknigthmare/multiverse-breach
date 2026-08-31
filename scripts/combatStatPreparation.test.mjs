import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { getEffectiveCombatDefense, resolveArchetypeCombatStats } from '../src/game/combatStatPreparation.js';

let vite;
let heroDatabase;
let gearDatabase;
let synergies;
let calculateRpgDamage;
let enginesByMode;
const engines = [];
const source = name => readFileSync(new URL(`../src/components/${name}.jsx`, import.meta.url), 'utf8');
const hubSource = source('HubScreen');
const canvasSource = source('GameCanvas');
const fixtureHero = (id, category) => ({
  id, name: id, category, universe: 'Nexus de Convergence', weaponType: 'blade',
  primaryColor: '#39c5bb', secondaryColor: '#ffffff',
  stats: { hp: 1000, atk: 100, def: 20, spd: 20 },
  simple: { name: 'Hit', type: 'melee', dmg: 1 },
  secondary: { name: 'Hit+', type: 'bullet', dmg: 2, cd: 3 },
  defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 2 },
  special: { name: 'Burst', type: 'melee', dmg: 3 }
});
const environment = (heroes, changes = {}) => ({
  HEROES_DB: heroes, EQUIP_ITEMS_DB: gearDatabase, activeTeam: heroes.map(hero => hero.id), heroLevels: {}, heroTalents: {},
  equippedGear: {}, completedStages: [], UNIVERSE_TO_STAGE_ID: {},
  disabledHeroSet: new Set(), hiddenUniverseSet: new Set(), disabledGearSet: new Set(),
  stage: {}, selectedBriefingStage: {}, applyFactionBonuses: stats => ({ stats }),
  reputationProgress: {}, activityProgress: { reputationProgress: {} }, collectionBonusCount: 0,
  getSpecialEventRewardById: () => null, isGearContentPackVisible: () => true, isAssetDisabled: () => false,
  ...changes
});
const compileStats = (text, endMarker, context) => {
  const start = text.indexOf('const getHeroStats =');
  const end = text.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start);
  return new Function(...Object.keys(context), text.slice(start, end) + '\nreturn getHeroStats;')(...Object.values(context));
};
const prepareCanvasSquad = context => {
  const getHeroStats = compileStats(canvasSource, 'const getEnemiesData =', context);
  const start = canvasSource.indexOf('let squadHeroes = activeTeam.map');
  const end = canvasSource.indexOf('if (enemyList.length === 0', start);
  assert.ok(start >= 0 && end > start);
  const values = { ...context, getHeroStats };
  return new Function(...Object.keys(values), canvasSource.slice(start, end) + '\nreturn squadHeroes;')(...Object.values(values));
};
const makeEngine = (mode, heroes) => {
  const enemy = { ...fixtureHero('enemy', 'other'), stats: undefined, hp: 10000, atk: 10, def: 20, spd: 1 };
  const instance = new enginesByMode[mode](760, 420, heroes, { monsters: [enemy], bosses: [], customRoster: [enemy] },
    { add() {}, update() {}, draw() {} }, () => {}, () => {},
    { id: 'stats-regression', universe: 'Nexus de Convergence', mode, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(instance);
  return instance;
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const [{ EngineRpg }, { EngineTactics }, { EngineSmash }, heroes, targeting] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js'), vite.ssrLoadModule('/src/game/engineTactics.js'),
    vite.ssrLoadModule('/src/game/engineSmash.js'), vite.ssrLoadModule('/src/game/heroes.js'), vite.ssrLoadModule('/src/game/rpgTargeting.js')
  ]);
  enginesByMode = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash };
  heroDatabase = heroes.HEROES_DB;
  gearDatabase = heroes.EQUIP_ITEMS_DB;
  synergies = heroes.SYNERGIES_DB;
  calculateRpgDamage = targeting.calculateRpgDamage;
});
after(async () => {
  engines.forEach(engine => engine.dispose?.());
  await vite?.close();
});

test('archetype helper is immutable, category-specific and preserves unrelated stats', () => {
  const original = { ...fixtureHero('raw', 'marine'), stats: { hp: 100, atk: 10, def: 5, spd: 6, crit: 0.15, dodge: 0.2, resistance: 0.1, chargeRate: 1.4 } };
  const snapshot = structuredClone(original);
  const stats = resolveArchetypeCombatStats(original, synergies);
  assert.equal(stats.hp, 125);
  assert.equal(stats.atk, 10);
  assert.equal(stats.spd, 6);
  for (const key of ['crit', 'dodge', 'resistance', 'chargeRate']) assert.equal(stats[key], original.stats[key]);
  assert.deepEqual(original, snapshot);
  assert.deepEqual(resolveArchetypeCombatStats({ ...original, archetypeSynergiesPrepared: true }, synergies), original.stats);
});

for (const mode of ['RPG', 'Tactics', 'Smash']) {
  test(`${mode} actual GameCanvas preparation matches Hub and applies each category synergy once`, () => {
    for (const category of ['marine', 'slayer', 'horror', 'hacker', 'tactical']) {
      const roster = [fixtureHero('a', category), fixtureHero('b', category), fixtureHero('outside', 'other')];
      const context = environment(roster);
      const getHubStats = compileStats(hubSource, 'const getUpgradeCost =', context);
      const prepared = prepareCanvasSquad(context);
      prepared.forEach(hero => assert.equal(hero.archetypeSynergiesPrepared, true));
      const snapshot = structuredClone(prepared);
      const engine = makeEngine(mode, prepared);
      engine.heroes.forEach((hero, index) => {
        assert.deepEqual(hero.stats, getHubStats(roster[index]), `${category}:${hero.id}`);
        assert.equal(hero.maxHp, hero.stats.hp);
        assert.equal(hero.currentHp, hero.stats.hp);
      });
      assert.deepEqual(engine.heroes[2].stats, roster[2].stats, 'off-category member received an unrelated bonus');
      assert.deepEqual(prepared, snapshot, 'engine mutated caller stats');
    }
  });

  test(`${mode} raw constructor callers still receive the matching category bonus once`, () => {
    for (const category of ['marine', 'slayer', 'horror', 'hacker', 'tactical']) {
      const raw = [fixtureHero('a', category), fixtureHero('b', category), fixtureHero('outside', 'other')];
      const original = structuredClone(raw);
      const first = makeEngine(mode, raw);
      first.heroes.forEach((hero, index) => {
        assert.deepEqual(hero.stats, resolveArchetypeCombatStats(raw[index], synergies));
        assert.equal(hero.archetypeSynergiesPrepared, true);
      });
      const second = makeEngine(mode, first.heroes);
      second.heroes.forEach((hero, index) => assert.deepEqual(hero.stats, first.heroes[index].stats, 'marked runtime was multiplied a second time'));
      assert.deepEqual(raw, original);
    }
  });
}

test('real Bastion/Sable/Nova preparation DEF remains 13/11/6 inside RPG', () => {
  const roster = ['arca_bastion', 'arca_sable', 'arca_nova'].map(id => heroDatabase.find(hero => hero.id === id));
  const engine = makeEngine('RPG', prepareCanvasSquad(environment(roster)));
  assert.deepEqual(engine.heroes.map(hero => hero.stats.def), [13, 11, 6]);
});

test('Hub relic plus collection order matches battle, including upgrades and disabled gear', () => {
  const bastion = heroDatabase.find(hero => hero.id === 'arca_bastion');
  for (const gearId of ['nexus_anchor_coil', 'nexus_anchor_coil_plus']) for (const disabled of [false, true]) {
    const context = environment([bastion], {
      equippedGear: { arca_bastion: gearId }, collectionBonusCount: 10,
      disabledGearSet: new Set(disabled ? ['nexus_anchor_coil'] : []),
      isAssetDisabled: (kind, id) => disabled && kind === 'gear' && id === 'nexus_anchor_coil'
    });
    const hub = compileStats(hubSource, 'const getUpgradeCost =', context)(bastion);
    const canvas = compileStats(canvasSource, 'const getEnemiesData =', context)(bastion);
    assert.deepEqual(hub, canvas);
    if (gearId === 'nexus_anchor_coil' && !disabled) assert.deepEqual(hub, { hp: 234, atk: 16, def: 18, spd: 5 });
    if (disabled) assert.equal(canvas.hp, 180, 'disabled gear suppressed the unrelated collection bonus');
  }
});

test('Critical Edge ATK boost is prepared once and DEF penetration has no other side effects', () => {
  const raw = fixtureHero('edge', 'slayer');
  const prepared = prepareCanvasSquad(environment([raw], { heroTalents: { edge: 'critical_edge' } }));
  assert.equal(prepared[0].stats.atk, 120);
  assert.equal(makeEngine('RPG', prepared).heroes[0].stats.atk, 120);
  const defender = { stats: { def: 20 }, battleItemShield: 40, state: 'defense', defense: { reduce: 0.4 } };
  const before = structuredClone(defender);
  assert.equal(getEffectiveCombatDefense(defender), 20);
  assert.equal(getEffectiveCombatDefense(defender, { talent: 'critical_edge' }), 16);
  assert.equal(getEffectiveCombatDefense({ def: 20 }, { talent: 'critical_edge' }), 16);
  assert.deepEqual(defender, before);
  assert.match(hubSource, /ignore 20% de DEF \(RPG\/Tactics\/Mêlée\)/);
  assert.match(hubSource, /separate Fighter mode excluded/);
});

for (const mode of ['RPG', 'Tactics', 'Smash']) test(`${mode} direct-hit penetration keeps guard, cover, shield and variance exactly once for both camps`, () => {
  const savedRandom = Math.random;
  Math.random = () => 0.5;
  try {
    for (const side of ['player', 'enemy']) for (const talent of [null, 'critical_edge']) for (const protectedHit of [false, true]) {
      const engine = makeEngine(mode, [fixtureHero('attacker', 'other')]);
      const attacker = side === 'player' ? engine.heroes[0] : engine.enemies[0];
      const defender = side === 'player' ? engine.enemies[0] : engine.heroes[0];
      attacker.talent = talent;
      defender.stats = { ...defender.stats, hp: 10000, def: 20 };
      delete defender.def;
      defender.maxHp = defender.currentHp = 10000;
      defender.state = protectedHit ? 'defense' : 'idle';
      defender.defense = { reduce: 0.4 };
      defender.battleItemShield = protectedHit ? 30 : 0;
      if (mode === 'Tactics') {
        engine.getCoverReduction = () => protectedHit ? 0.25 : 0;
        engine.getFacingBonus = () => ({ bonus: 0 });
        engine.getTerrainDamageModifier = () => ({ multiplier: 1, labels: [] });
      }
      const def = talent ? 16 : 20;
      const guard = protectedHit ? 0.6 : 1;
      const cover = mode === 'Tactics' && protectedHit ? 0.75 : 1;
      const mitigation = mode === 'RPG' ? 100 / (100 + def) : mode === 'Tactics' ? 1 - Math.min(0.3, def / 100) : Math.max(0.72, 1 - def * 0.01);
      const expected = Math.max(0, Math.round(200 * guard * cover * mitigation) - (protectedHit ? 30 : 0));
      engine.applyDamage(attacker, defender, 200);
      assert.equal(10000 - defender.currentHp, expected, `${side}/${talent}/${protectedHit}`);
      assert.equal(defender.stats.def, 20, 'penetration permanently changed target DEF');
      if (protectedHit) assert.equal(defender.battleItemShield, 0);
    }
  } finally { Math.random = savedRandom; }
});

test('RPG target preview uses the same penetration and shield-aware variance as its actual hit', () => {
  const savedRandom = Math.random;
  Math.random = () => 0.5;
  try {
    const prepared = prepareCanvasSquad(environment([fixtureHero('edge', 'slayer')], { heroTalents: { edge: 'critical_edge' } }));
    const engine = makeEngine('RPG', prepared);
    const actor = engine.heroes[0];
    const target = engine.enemies[0];
    target.state = 'defense'; target.stateTimer = 90; target.defense = { reduce: 0.4 }; target.battleItemShield = 20;
    actor.atb = 100; actor.state = 'idle';
    assert.equal(engine.beginTargeting(actor, 'simple'), true);
    const preview = engine.getTargetingState().estimates[0];
    assert.equal(preview.amount, calculateRpgDamage(target, 120, 1, true, actor));
    assert.equal(preview.min, calculateRpgDamage(target, 120, 0.9, true, actor));
    assert.equal(preview.max, calculateRpgDamage(target, 120, 1.1, true, actor));
    const hp = target.currentHp;
    assert.equal(engine.confirmTargeting(), true);
    for (let tick = 0; tick < 12; tick++) engine.update();
    assert.equal(hp - target.currentHp, preview.amount);
  } finally { Math.random = savedRandom; }
});
