import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { getHeroById } from '../src/game/heroes.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { RAAM_ENCOUNTER_RULES, isCanonRaamStage } from '../src/game/canonRaamEncounter.js';

const stage = CANON_PRIORITY_STAGES.lightmassTrain;
const engines = [];
let vite;
let EngineRpg;

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?canon-raam-runtime'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

const makeEngine = ({ stageOverride = {}, bossWave = true, readyHeroes = true, heroes = ['marcus', 'han_solo'] } = {}) => {
  const selectedStage = { ...stage, ...stageOverride };
  const data = resolveStageEnemyData({ stage: selectedStage, ...ENEMIES_DB['Gears of War'] });
  const calls = [];
  const sounds = [];
  const completions = [];
  const engine = new EngineRpg(760, 420, heroes.map(getHeroById), data,
    { add: (...args) => calls.push(args) }, sound => sounds.push(sound), result => completions.push(result), selectedStage);
  engines.push(engine);
  if (bossWave) { engine.wave = 2; engine.spawnWave(); }
  engine.enemyGlobalRecovery = 99999;
  if (readyHeroes) engine.heroes.forEach(hero => { hero.atb = 100; });
  return Object.assign(engine, { calls, sounds, completions });
};
const boss = engine => engine.enemies.find(enemy => enemy.name === 'General RAAM');
const advance = (engine, ticks) => { for (let index = 0; index < ticks; index++) engine.update(); };
const ready = actor => { actor.state = 'idle'; actor.stateTimer = 0; actor.atb = 100; actor.actionPending = false; };
const startSwarm = (engine, target = engine.heroes[0]) => {
  const raam = boss(engine);
  ready(raam);
  engine.enemyGlobalRecovery = 0;
  assert.equal(engine.executeRpgAction(engine.getActionContext(raam, 'secondary', 'enemy'), [target.battleId]), true);
  engine.enemyGlobalRecovery = 99999;
};

test('the mechanic is restricted to the canonical 2006 campaign stage, excluding custom and other universes', () => {
  assert.equal(isCanonRaamStage(stage), true);
  for (const override of [{ id: 2 }, { universe: 'Halo' }, { mode: 'Smash' }, { customBattle: {} }, { enemyRosterExclusive: false }, { canonicalBossName: 'Skorge' }]) {
    assert.equal(isCanonRaamStage({ ...stage, ...override }), false);
  }
});

test('the original Locust assault wave has no RAAM controls or damage immunity', () => {
  const engine = makeEngine({ bossWave: false });
  assert.equal(engine.getRaamEncounterState(), null);
  assert.equal(engine.triggerRaamEncounterAction('frag'), false);
  assert.ok(engine.applyDamage(engine.heroes[0], engine.enemies[0], 30) > 0);
  assert.equal(engine.applyEncounterDamage(engine.enemies[0], 30), false);
});

test('shielded RAAM ignores ordinary hits, item shield use, status application and lifesteal', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  const hero = engine.heroes[0];
  hero.talent = 'lifedrain';
  hero.currentHp = 40;
  raam.battleItemShield = 55;
  const hp = raam.currentHp;
  assert.equal(engine.applyDamage(hero, raam, 999, 'infected'), 0);
  assert.equal(raam.currentHp, hp);
  assert.equal(raam.battleItemShield, 55);
  assert.equal(raam.statusEffects.infected, 0);
  assert.equal(hero.currentHp, 40);
});

test('manual attack preview displays zero damage while Kryll cover RAAM', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  assert.equal(engine.beginTargeting(hero, 'simple'), true);
  const estimate = engine.getTargetingState().estimates[0];
  assert.deepEqual([estimate.amount, estimate.min, estimate.max], [0, 0, 0]);
  assert.equal(estimate.blockedByKryll, true);
  assert.equal(hero.atb, 100);
});

test('a confirmed ordinary attack still spends its resources but cannot bypass the shield', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  const hp = raam.currentHp;
  assert.equal(engine.beginTargeting(engine.heroes[0], 'simple'), true);
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(engine.heroes[0].atb, 0);
  advance(engine, 18);
  assert.equal(raam.currentHp, hp);
});

test('no idle duration or HP threshold creates an automatic vulnerability window', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  raam.currentHp = 1;
  advance(engine, 2000);
  assert.equal(engine.getRaamEncounterState().phase, 'shielded');
  assert.equal(engine.applyDamage(engine.heroes[0], raam, 500), 0);
});

test('a real frag command disperses Kryll only on impact and allows subsequent selected attacks', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  const hero = engine.heroes[0];
  const stats = structuredClone(hero.stats);
  const hp = raam.currentHp;
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), true);
  assert.equal(engine.getRaamEncounterState().grenadesRemaining, 3);
  assert.equal(engine.getRaamEncounterState().shieldActive, true);
  assert.equal(hero.atb, 0);
  assert.equal(hero.actionPending, true);
  advance(engine, 18);
  assert.equal(engine.getRaamEncounterState().phase, 'exposed');
  assert.ok(raam.currentHp < hp);
  assert.ok(engine.applyDamage(engine.heroes[1], raam, 20) > 0);
  assert.deepEqual(hero.stats, stats);
  assert.ok(engine.sounds.includes('explosion'));
});

test('the frag window ends by Kryll returning without modifying RAAM saved maximum health', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  const maxHp = raam.maxHp;
  assert.equal(engine.triggerRaamEncounterAction('frag'), true);
  advance(engine, 18 + RAAM_ENCOUNTER_RULES.grenadeExposureTicks);
  assert.equal(engine.getRaamEncounterState().phase, 'shielded');
  assert.equal(raam.maxHp, maxHp);
  assert.equal(engine.applyDamage(engine.heroes[1], raam, 30), 0);
});

test('grenades are bounded by the original four-grenade capacity and cannot become infinite', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  for (let index = 0; index < 4; index++) {
    ready(hero);
    assert.equal(engine.triggerRaamEncounterAction('frag', hero), true);
    advance(engine, 30);
  }
  ready(hero);
  assert.equal(engine.getRaamEncounterState().grenadesRemaining, 0);
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), false);
  assert.equal(hero.atb, 100);
});

test('unready, dead, paused and targeting heroes cannot spend environmental resources', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  hero.atb = 99;
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), false);
  ready(hero);
  hero.currentHp = 0;
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), false);
  hero.currentHp = hero.maxHp;
  engine.setPaused(true);
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), false);
  engine.setPaused(false);
  assert.equal(engine.beginTargeting(hero, 'simple'), true);
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), false);
  assert.equal(engine.getRaamEncounterState().grenadesRemaining, 4);
});

test('an unknown command cannot spend ATB or change formation', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const position = [hero.x, hero.y, hero.homeX, hero.homeY];
  assert.equal(engine.triggerRaamEncounterAction('summon-uv-turret', hero), false);
  assert.equal(hero.atb, 100);
  assert.deepEqual([hero.x, hero.y, hero.homeX, hero.homeY], position);
});

test('RAAM sending Kryll is an actual single-target swarm and exposes him without grenades', () => {
  const engine = makeEngine();
  const hp = engine.heroes.map(hero => hero.currentHp);
  startSwarm(engine, engine.heroes[1]);
  assert.equal(engine.getRaamEncounterState().phase, 'kryll-out');
  assert.equal(engine.getRaamEncounterState().swarmTargetId, engine.heroes[1].battleId);
  assert.equal(engine.getRaamEncounterState().grenadesRemaining, 4);
  assert.ok(engine.applyDamage(engine.heroes[0], boss(engine), 20) > 0);
  advance(engine, RAAM_ENCOUNTER_RULES.swarmHitInterval);
  assert.equal(engine.heroes[0].currentHp, hp[0]);
  assert.ok(engine.heroes[1].currentHp < hp[1]);
  assert.ok(!engine.calls.some(call => call[7] === 'laser_line'), 'Kryll cannot look like a gun beam');
});

test('selected lit cover is spatial, protects from the swarm and is distinct from generic defense', () => {
  const lit = makeEngine();
  const shade = makeEngine();
  const litHero = lit.heroes[0];
  const shadeHero = shade.heroes[0];
  const startingX = litHero.x;
  assert.equal(lit.triggerRaamEncounterAction('take-light-cover', litHero), true);
  assert.notEqual(litHero.x, startingX);
  assert.equal(lit.getRaamEncounterState().heroes[0].inLightCover, true);
  advance(lit, 20);
  assert.equal(litHero.state, 'idle');
  shadeHero.state = 'defense';
  shadeHero.stateTimer = 9999;
  const litHp = litHero.currentHp;
  const shadeHp = shadeHero.currentHp;
  startSwarm(lit, litHero);
  startSwarm(shade, shadeHero);
  advance(lit, RAAM_ENCOUNTER_RULES.swarmHitInterval * 2);
  advance(shade, RAAM_ENCOUNTER_RULES.swarmHitInterval * 2);
  assert.equal(litHero.currentHp, litHp);
  assert.ok(shadeHero.currentHp < shadeHp, 'generic guard in darkness incorrectly repelled Kryll');
});

test('leaving the actual light restores swarm exposure without changing saved hero stats', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const stats = structuredClone(hero.stats);
  const formation = [hero.homeX, hero.homeY];
  assert.equal(engine.triggerRaamEncounterAction('take-light-cover', hero), true);
  advance(engine, 20);
  ready(hero);
  assert.equal(engine.triggerRaamEncounterAction('leave-light-cover', hero), true);
  assert.deepEqual([hero.homeX, hero.homeY], formation);
  assert.deepEqual(hero.stats, stats);
  assert.equal(engine.getRaamEncounterState().heroes[0].inLightCover, false);
  startSwarm(engine, hero);
  const hp = hero.currentHp;
  advance(engine, RAAM_ENCOUNTER_RULES.swarmHitInterval);
  assert.ok(hero.currentHp < hp);
});

test('Troika remains harmful in lit cover, which only reduces its bullets', () => {
  const open = makeEngine();
  const lit = makeEngine();
  lit.triggerRaamEncounterAction('take-light-cover', lit.heroes[0]);
  advance(lit, 20);
  const openDamage = open.applyDamage(boss(open), open.heroes[0], 40, null, { kind: 'troika' });
  const litDamage = lit.applyDamage(boss(lit), lit.heroes[0], 40, null, { kind: 'troika' });
  assert.ok(litDamage > 0);
  assert.ok(litDamage < openDamage);
});

test('a melee fighter temporarily outside lit cover is vulnerable to Kryll despite retaining cover orders', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  engine.triggerRaamEncounterAction('take-light-cover', hero);
  advance(engine, 20);
  engine.positionForMelee(hero, boss(engine));
  assert.equal(hero.raamLightCover, true);
  assert.equal(engine.getRaamEncounterState().heroes[0].inLightCover, false);
  assert.ok(engine.applyDamage(boss(engine), hero, 20, null, { kind: 'kryll' }) > 0);
  engine.returnToFormation(hero);
  assert.equal(engine.getRaamEncounterState().heroes[0].inLightCover, true);
});

test('Kryll return after their actual attack and restore immunity', () => {
  const engine = makeEngine();
  engine.triggerRaamEncounterAction('take-light-cover', engine.heroes[0]);
  advance(engine, 20);
  startSwarm(engine);
  advance(engine, RAAM_ENCOUNTER_RULES.swarmTicks);
  assert.equal(engine.getRaamEncounterState().phase, 'shielded');
  assert.equal(engine.getRaamEncounterState().swarmTargetId, null);
  assert.equal(engine.applyDamage(engine.heroes[1], boss(engine), 999), 0);
});

test('target death returns the swarm instead of silently acquiring a different hero', () => {
  const engine = makeEngine();
  startSwarm(engine, engine.heroes[0]);
  const otherHp = engine.heroes[1].currentHp;
  engine.heroes[0].currentHp = 0;
  advance(engine, 1);
  assert.equal(engine.getRaamEncounterState().swarmTargetId, null);
  assert.equal(engine.getRaamEncounterState().phase, 'shielded');
  assert.equal(engine.heroes[1].currentHp, otherHp);
});

test('pause and manual targeting freeze grenade impacts and exposure duration', () => {
  const engine = makeEngine();
  engine.triggerRaamEncounterAction('frag', engine.heroes[0]);
  engine.setPaused(true);
  advance(engine, 200);
  assert.equal(engine.getRaamEncounterState().shieldActive, true);
  engine.setPaused(false);
  assert.equal(engine.beginTargeting(engine.heroes[1], 'simple'), true);
  advance(engine, 200);
  assert.equal(engine.getRaamEncounterState().shieldActive, true);
  engine.cancelTargeting();
  advance(engine, 18);
  const exposure = engine.getRaamEncounterState().exposureTicks;
  engine.setPaused(true);
  advance(engine, 200);
  assert.equal(engine.getRaamEncounterState().exposureTicks, exposure);
});

test('the external damage gate handles blocked and exposed RAAM but leaves all unrelated enemies to existing code', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  const hp = raam.currentHp;
  assert.equal(engine.applyEncounterDamage(raam, 500, { kind: 'crossover-explosion' }), true);
  assert.equal(raam.currentHp, hp);
  assert.equal(engine.getRaamEncounterState().shieldActive, true);
  assert.equal(engine.applyEncounterDamage(engine.heroes[0], 500), false);
  startSwarm(engine);
  assert.equal(engine.applyEncounterDamage(raam, 20, { kind: 'pickup', attacker: engine.heroes[0] }), true);
  assert.ok(raam.currentHp < hp);
});

test('existing damage-over-time cannot circumvent a returned Kryll shield', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  raam.statusEffects.infected = 61;
  const hp = raam.currentHp;
  advance(engine, 1);
  assert.equal(raam.currentHp, hp);
  assert.equal(raam.statusEffects.infected, 60);
});

test('nonlethal external anomalies remain nonlethal after attacker buffs and damage variance', () => {
  const engine = makeEngine();
  startSwarm(engine);
  const raam = boss(engine);
  raam.currentHp = 10;
  const hero = engine.heroes[0];
  hero.rpgBuffTicks = 100;
  hero.rpgBuffMultiplier = 5;
  assert.equal(engine.applyEncounterDamage(raam, 9, { attacker: hero, kind: 'anomaly', nonlethal: true }), true);
  assert.equal(raam.currentHp, 1);
  assert.notEqual(raam.state, 'dead');
});

test('external direct damage preserves the precomputed fixed loss and only absorbs an item shield when requested', () => {
  const engine = makeEngine();
  startSwarm(engine);
  const raam = boss(engine);
  const hero = engine.heroes[0];
  hero.rpgBuffTicks = 100;
  hero.rpgBuffMultiplier = 5;
  raam.def = 999;
  raam.battleItemShield = 20;
  const hp = raam.currentHp;
  assert.equal(engine.applyEncounterDamage(raam, 17, { directDamage: true, attacker: hero }), true);
  assert.equal(raam.currentHp, hp - 17);
  assert.equal(raam.battleItemShield, 20);
  assert.equal(engine.applyEncounterDamage(raam, 30, { directDamage: true, absorbBattleItemShield: true, attacker: hero }), true);
  assert.equal(raam.currentHp, hp - 27);
  assert.equal(raam.battleItemShield, 0);
  raam.currentHp = 5;
  assert.equal(engine.applyEncounterDamage(raam, 200, { directDamage: true, nonlethal: true }), true);
  assert.equal(raam.currentHp, 1);
});

test('direct item damage cannot consume an unrelated pickup shield while Kryll already block the attack', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  raam.battleItemShield = 50;
  const hp = raam.currentHp;
  assert.equal(engine.applyEncounterDamage(raam, 90, { directDamage: true, absorbBattleItemShield: true }), true);
  assert.equal(raam.currentHp, hp);
  assert.equal(raam.battleItemShield, 50);
});

test('CPU RAAM actually alternates Troika and Kryll attacks rather than waiting for a never-charged generic special', () => {
  const engine = makeEngine();
  const raam = boss(engine);
  ready(raam);
  engine.enemyGlobalRecovery = 0;
  advance(engine, 1);
  assert.equal(engine.getRaamEncounterState().attackCount, 1);
  assert.equal(engine.getRaamEncounterState().phase, 'shielded');
  advance(engine, 40);
  ready(raam);
  engine.enemyGlobalRecovery = 0;
  advance(engine, 1);
  assert.equal(engine.getRaamEncounterState().attackCount, 2);
  assert.equal(engine.getRaamEncounterState().phase, 'kryll-out');
  assert.equal(raam.specialCharge < 100, true);
});

test('automatic solo Marcus can defeat RAAM after grenade ammunition is exhausted without modified combat stats', t => {
  t.mock.method(Math, 'random', () => 0.5);
  const engine = makeEngine({ heroes: ['marcus'] });
  engine.autoBattle = true;
  engine.raamEncounter.grenadesRemaining = 0;
  engine.enemyGlobalRecovery = 70;
  const raam = boss(engine);
  const savedMaxHp = raam.maxHp;
  const savedHeroStats = structuredClone(engine.heroes[0].stats);
  for (let index = 0; index < 100000 && !engine.gameOver; index++) engine.update();
  assert.equal(raam.currentHp, 0, 'a squad without grenades cannot finish the source vulnerability loop');
  assert.equal(raam.maxHp, savedMaxHp);
  assert.deepEqual(engine.heroes[0].stats, savedHeroStats);
  assert.ok(engine.heroes[0].currentHp > 0);
  assert.equal(engine.gameOver, true);
  advance(engine, 121);
  assert.deepEqual(engine.completions, ['victory']);
});

test('the solo frag thrower can naturally recharge ATB and land a follow-up hit before Kryll reform', () => {
  const engine = makeEngine({ heroes: ['marcus'] });
  const hero = engine.heroes[0];
  const raam = boss(engine);
  assert.equal(engine.triggerRaamEncounterAction('frag', hero), true);
  advance(engine, 18);
  const afterGrenade = raam.currentHp;
  for (let index = 0; index < 700 && !engine.canUseAction(hero, 'simple'); index++) engine.update();
  assert.equal(engine.getRaamEncounterState().shieldActive, false);
  assert.equal(engine.triggerAbility(hero, 'simple', [raam.battleId]), true);
  advance(engine, 18);
  assert.ok(raam.currentHp < afterGrenade);
});

test('the original Marcus and Dom duo can complete both campaign waves automatically from constructor state', t => {
  t.mock.method(Math, 'random', () => 0.5);
  const engine = makeEngine({ heroes: ['marcus', 'dom'], bossWave: false, readyHeroes: false });
  engine.enemyGlobalRecovery = 70;
  engine.autoBattle = true;
  const stats = engine.heroes.map(hero => structuredClone(hero.stats));
  for (let index = 0; index < 100000 && !engine.gameOver; index++) engine.update();
  assert.equal(engine.wave, 2);
  assert.equal(engine.enemies.find(enemy => enemy.name === 'General RAAM').currentHp, 0);
  assert.ok(engine.heroes.every(hero => hero.currentHp > 0));
  assert.deepEqual(engine.heroes.map(hero => hero.stats), stats);
  advance(engine, 121);
  assert.deepEqual(engine.completions, ['victory']);
});

test('other campaign stages and a custom RAAM matchup retain ordinary damage and lack environmental commands', () => {
  for (const stageOverride of [{ id: 99 }, { customBattle: { singleRoster: false } }]) {
    const engine = makeEngine({ stageOverride });
    assert.equal(engine.raamEncounter, null);
    assert.equal(engine.getRaamEncounterState(), null);
    assert.equal(engine.triggerRaamEncounterAction('take-light-cover'), false);
    assert.ok(engine.applyDamage(engine.heroes[0], boss(engine), 20) > 0);
    assert.equal(engine.applyEncounterDamage(boss(engine), 20), false);
  }
});
