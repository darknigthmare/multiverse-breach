import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { NIHILANTH_ENCOUNTER_BALANCE } from '../src/game/canonNihilanthEncounter.js';
import { drawNihilanthEncounter } from '../src/game/canonNihilanthEncounterPresentation.js';

let vite;
let EngineSmash;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?nihilanth-mechanics'));
});
after(async () => { await vite?.close(); });

function makeEngine({ stage = CANON_PRIORITY_STAGES.xenNihilanth, heroId = 'arca_mirelle', boss = true } = {}) {
  const hero = getHeroById(heroId);
  const cues = [];
  const completion = [];
  const particles = [];
  const configuration = { ...stage, disableHazards: true, stageEventIntensity: 'off' };
  const data = resolveStageEnemyData({ stage: configuration, ...ENEMIES_DB[configuration.universe] });
  const engine = new EngineSmash(960, 540, [hero], data,
    { add: (...args) => particles.push(args) }, cue => cues.push(cue),
    (...args) => completion.push(args), configuration);
  engine.syncPreMatchFromServer(3000);
  engine.completeMeleeIntros();
  Object.assign(engine.heroes[0], { maxHp: 50000, currentHp: 50000 });
  engine.testEvidence = { cues, completion, particles, data };
  if (boss && !stage.customBattle) {
    while (engine.wave < engine.maxWaves) {
      engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, stateTimer: 0, state: 'dead' }));
      engine.update();
      assert.equal(engine.gameOver, false, 'a regular wave incorrectly completes the finale');
    }
  }
  return engine;
}

const advance = (engine, ticks) => { for (let tick = 0; tick < ticks; tick++) engine.update(); };
function destroyCrystals(engine) {
  for (const crystal of engine.nihilanthEncounter.crystals) {
    assert.equal(engine.applyEncounterDamage(crystal, 1000), true);
  }
}
function exposeBrain(engine) {
  destroyCrystals(engine);
  engine.applyDamage(engine.heroes[0], engine.nihilanthEncounter.boss, 100000, 0);
  advance(engine, 240);
  assert.equal(engine.nihilanthEncounter.headOpen, true);
}

test('Nihilanth interactions attach only when the actual source boss wave arrives', () => {
  const engine = makeEngine({ boss: false });
  assert.equal(engine.nihilanthEncounter.phase, 'waiting');
  assert.equal(engine.nihilanthEncounter.boss, null);
  assert.equal(engine.getEncounterTargets().length, engine.enemies.length);
  assert.match(engine.getObjectiveText(), /boss/i);
  assert.equal(engine.applyEncounterDamage(engine.enemies[0], 99), false);
});

test('the source finale keeps its saved stage, rewards, boss identity and base statistics', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  assert.equal(engine.stage.id, 10);
  assert.equal(engine.stage.goldPrize, 75);
  assert.equal(engine.stage.shardPrize, 25);
  assert.equal(runtime.boss.name, 'Alien Nihilanth Core');
  assert.equal(runtime.boss.canonicalName, 'Nihilanth');
  assert.equal(runtime.boss.maxHp, engine.testEvidence.data.bosses[0].hp);
  assert.equal(runtime.boss.atk, engine.testEvidence.data.bosses[0].atk);
  assert.equal(runtime.crystals.length, 3);
  assert.equal(runtime.energySpheres, 20);
  assert.equal(engine.getEncounterTargets().length, 4);
  assert.match(engine.getObjectiveText(), /cristaux.*0\/3/i);
});

test('a normal legacy melee attack destroys a nearby healing crystal instead of an invisible metadata objective', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const crystal = engine.nihilanthEncounter.crystals[0];
  Object.assign(hero, { x: crystal.x - 20, y: crystal.y, facing: 1, state: 'idle' });
  hero.stats = { ...hero.stats, atk: 200 };
  engine.triggerAbility(hero, 'simple');
  assert.equal(crystal.currentHp, 0);
  assert.equal(crystal.state, 'dead');
  assert.equal(engine.defeatedEnemies, 0, 'a crystal is not an extra enemy kill');
  assert.ok(!engine.getEncounterTargets().includes(crystal));
  assert.match(engine.getObjectiveText(), /1\/3/);
});

test('a directional source-locked ranged attack selects and damages a real crystal', () => {
  const engine = makeEngine({ heroId: 'han_solo' });
  const hero = engine.heroes[0];
  const crystal = engine.nihilanthEncounter.crystals[0];
  Object.assign(hero, { x: crystal.x - 40, y: crystal.y, facing: 1, state: 'idle', cooldown: 0 });
  assert.equal(engine.triggerAbility(hero, 'secondary'), true);
  assert.ok(crystal.currentHp < crystal.maxHp);
  assert.equal(engine.nihilanthEncounter.boss.currentHp, engine.nihilanthEncounter.boss.maxHp);
});

test('the committed Melee action pipeline reaches destructible crystals', () => {
  const engine = makeEngine();
  const hero = engine.heroes[0];
  const crystal = engine.nihilanthEncounter.crystals[1];
  Object.assign(hero, { x: crystal.x - 20, y: crystal.y, facing: 1, state: 'idle' });
  hero.stats = { ...hero.stats, atk: 200 };
  assert.equal(engine.resolveMeleeActionHit(hero, {
    id: 'light', range: 60, base: 10, knockback: 10, guardDamage: 8, powerScale: 1
  }), 1);
  assert.equal(crystal.currentHp, 0);
});

test('body damage is real but cannot deliver a lethal hit before or after the head opens', () => {
  const engine = makeEngine();
  const boss = engine.nihilanthEncounter.boss;
  const before = boss.currentHp;
  const dealt = engine.applyDamage(engine.heroes[0], boss, 100000, 0);
  assert.equal(boss.currentHp, 1);
  assert.equal(dealt, before - 1);
  assert.equal(engine.gameOver, false);
  exposeBrain(engine);
  engine.applyDamage(engine.heroes[0], boss, 100000, 0);
  assert.equal(boss.currentHp, 1, 'an open head must still be aimed at rather than granting body kill');
});

test('orange spheres absorb into a damaged boss, restore 5 percent max HP and are consumed', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  engine.applyDamage(engine.heroes[0], runtime.boss, 200, 0);
  const afterDamage = runtime.boss.currentHp;
  const beforeSpheres = runtime.energySpheres;
  const elapsedRemainder = runtime.elapsedTicks % NIHILANTH_ENCOUNTER_BALANCE.healEveryTicks;
  advance(engine, NIHILANTH_ENCOUNTER_BALANCE.healEveryTicks - elapsedRemainder);
  assert.equal(runtime.boss.currentHp, afterDamage + runtime.boss.maxHp / 20);
  assert.equal(runtime.energySpheres, beforeSpheres - 1);
  assert.equal(runtime.spheresAbsorbed, 1);
  assert.equal(runtime.totalHealing, runtime.boss.maxHp / 20);
});

test('a surviving crystal restores depleted spheres and the head remains closed', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  engine.applyEncounterDamage(runtime.crystals[0], 1000);
  engine.applyEncounterDamage(runtime.crystals[1], 1000);
  engine.applyDamage(engine.heroes[0], runtime.boss, 100000, 0);
  advance(engine, 240);
  assert.ok(runtime.spheresRecharged > 0);
  assert.equal(runtime.headOpen, false);
  assert.equal(runtime.crystals[2].currentHp, runtime.crystals[2].maxHp);
});

test('destroying all crystals removes recharging, weakens the reserve and opens a targetable brain', () => {
  const engine = makeEngine();
  exposeBrain(engine);
  const runtime = engine.nihilanthEncounter;
  assert.equal(runtime.spheresRecharged, 0);
  assert.ok(runtime.spheresAbsorbed >= 10);
  assert.equal(runtime.phase, 'brain');
  assert.ok(engine.getEncounterTargets().includes(runtime.brain));
  assert.ok(runtime.brain.y < runtime.boss.y - 60);
  assert.match(engine.getObjectiveText(), /plateformes.*cerveau/i);
});

test('an untouched closed-head encounter cannot be skipped by hitting its hidden brain', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  const hp = runtime.boss.currentHp;
  assert.equal(engine.applyDamage(engine.heroes[0], runtime.brain, 100000, 0), 0);
  assert.equal(runtime.boss.currentHp, hp);
  assert.equal(runtime.weakpointHits, 0);
  assert.equal(engine.applyEncounterDamage(runtime.brain, 100000), true);
  assert.equal(runtime.boss.currentHp, hp);
});

test('external battle items and supers respect the body restriction and may hit the exposed weak point', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  assert.equal(engine.applyEncounterDamage(runtime.boss, 100000, { kind: 'battleItem' }), true);
  assert.equal(runtime.boss.currentHp, 1);
  assert.equal(engine.applyEncounterDamage(engine.heroes[0], 10), false);
  exposeBrain(engine);
  assert.equal(engine.applyEncounterDamage(runtime.brain, 100000, { kind: 'customSuper' }), true);
  assert.equal(runtime.boss.currentHp, 0);
  assert.equal(runtime.weakpointHits, 1);
});

test('a source-locked ranged attack from the head platform can land the lethal brain hit', () => {
  const engine = makeEngine({ heroId: 'han_solo' });
  exposeBrain(engine);
  const runtime = engine.nihilanthEncounter;
  const hero = engine.heroes[0];
  Object.assign(hero, { x: runtime.brain.x - 30, y: runtime.brain.y, facing: 1,
    state: 'idle', stateTimer: 0, cooldown: 0 });
  hero.stats = { ...hero.stats, atk: 10000 };
  assert.equal(engine.triggerAbility(hero, 'secondary'), true);
  assert.equal(runtime.boss.currentHp, 0);
  assert.equal(runtime.boss.state, 'dead');
  assert.equal(runtime.weakpointHits, 1);
  assert.equal(engine.defeatedEnemies, 1);
  advance(engine, 65);
  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'victory');
  const summary = engine.getCombatSummary('victory');
  assert.equal(summary.canonicalEncounter.crystalsDestroyed, 3);
  assert.equal(summary.canonicalEncounter.headOpen, true);
  assert.equal(summary.canonicalEncounter.weakpointHits, 1);
});

test('time and destruction of the three crystals alone cannot award victory', () => {
  const engine = makeEngine();
  destroyCrystals(engine);
  engine.objectiveTick = 100000;
  engine.updateArenaObjective();
  engine.updateObjectiveBattleState();
  advance(engine, 120);
  assert.equal(engine.gameOver, false);
  assert.equal(engine.nihilanthEncounter.headOpen, false, 'untouched full energy is not prematurely vulnerable');
  assert.equal(engine.nihilanthEncounter.boss.currentHp, engine.nihilanthEncounter.boss.maxHp);
});

test('Nihilanth levitates and is not removed by ground physics or knockback ringouts', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  const boss = runtime.boss;
  Object.assign(boss, { x: -999, y: engine.height + 200, vx: -100, vy: 100 });
  engine.applyPhysics(boss);
  assert.equal(boss.x, runtime.anchor.x);
  assert.equal(boss.y, runtime.anchor.y);
  assert.equal(boss.currentHp, boss.maxHp);
  advance(engine, 200);
  assert.ok(Math.abs(boss.y - runtime.anchor.y) <= 3);
  assert.equal(boss.x, runtime.anchor.x);
});

test('purple energy projectiles travel through the arena and damage the hero rather than a generic melee strike', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  const hero = engine.heroes[0];
  Object.assign(hero, { x: runtime.boss.x - 70, y: runtime.boss.y, vx: 0, vy: 0, state: 'idle' });
  const hp = hero.currentHp;
  advance(engine, 130);
  assert.equal(hero.currentHp, hp, 'the legacy melee AI dealt damage before the projectile');
  advance(engine, 45);
  assert.ok(hero.currentHp < hp);
  assert.ok(engine.damageTaken > 0);
  assert.ok(engine.testEvidence.cues.includes('shoot'));
});

test('the source Queen stage retains its existing generic damage and ringout rules', () => {
  const engine = makeEngine({ stage: CANON_PRIORITY_STAGES.hadleysQueen });
  assert.equal(engine.nihilanthEncounter, null);
  const queen = engine.enemies[0];
  assert.equal(engine.applyEncounterDamage(queen, 100000), false);
  engine.applyDamage(engine.heroes[0], queen, 100000, 0);
  assert.equal(queen.currentHp, 0);
  assert.ok(!('canonicalEncounter' in engine.getCombatSummary()));
});

test('custom battles using stage 10 do not acquire crystals or campaign restrictions', () => {
  const stage = { ...CANON_PRIORITY_STAGES.xenNihilanth,
    customBattle: { singleRoster: true, opponentControl: 'cpu' } };
  const engine = makeEngine({ stage });
  assert.equal(engine.nihilanthEncounter, null);
  assert.deepEqual(engine.getEncounterTargets(), engine.enemies);
  assert.equal(engine.applyEncounterDamage(engine.enemies[0], 1000), false);
});

test('interactive crystals, orange spheres, the exposed brain and purple attacks are actually drawn with restored state', () => {
  const engine = makeEngine();
  exposeBrain(engine);
  const runtime = engine.nihilanthEncounter;
  // Keep one display crystal to exercise its geometry without altering the
  // already checked encounter sequence in the other tests.
  runtime.crystals[0].currentHp = 20;
  runtime.projectiles.push({ x: 400, y: 200 });
  const operations = [];
  const ctx = new Proxy({}, {
    get: (object, key) => key in object ? object[key] : (...args) => operations.push([key, ...args]),
    set: (object, key, value) => { object[key] = value; return true; }
  });
  drawNihilanthEncounter(ctx, runtime, 42, 960, 540, 'fr');
  assert.ok(operations.some(([method, label]) => method === 'fillText' && /CRISTAL 1/.test(label)));
  assert.ok(operations.some(([method, label]) => method === 'fillText' && /CERVEAU EXPOSE/.test(label)));
  assert.ok(operations.some(([method, x, y]) => method === 'arc' && x === 400 && y === 200));
  assert.equal(operations.filter(([method]) => method === 'save').length,
    operations.filter(([method]) => method === 'restore').length);
});

test('the actual EngineSmash draw path includes the encounter markers', () => {
  const engine = makeEngine();
  const operations = [];
  const ctx = new Proxy({}, {
    get: (object, key) => key in object ? object[key] : (...args) => {
      operations.push([key, ...args]);
      if (key === 'measureText') return { width: 80 };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return { addColorStop() {} };
      return undefined;
    },
    set: (object, key, value) => { object[key] = value; return true; }
  });
  engine.draw(ctx, 42, 'fr');
  assert.equal(operations.filter(([method, label]) => method === 'fillText' && /^CRISTAL [123]$/.test(label)).length, 3);
  assert.ok(!operations.some(([method, label]) => method === 'fillText' && /CERVEAU EXPOSE/.test(label)));
  exposeBrain(engine);
  operations.length = 0;
  engine.draw(ctx, 88, 'fr');
  assert.ok(operations.some(([method, label]) => method === 'fillText' && /CERVEAU EXPOSE/.test(label)));
  assert.ok(!operations.some(([method, label]) => method === 'fillText' && /^CRISTAL [123]$/.test(label)));
  assert.equal(operations.filter(([method]) => method === 'save').length,
    operations.filter(([method]) => method === 'restore').length);
});

test('direct external damage preserves its fixed HP amount without armor, variance or movement changes', () => {
  const engine = makeEngine();
  const boss = engine.nihilanthEncounter.boss;
  boss.def = 100;
  boss.stats = { def: 100 };
  boss.vx = 2;
  boss.vy = 3;
  const hp = boss.currentHp;
  assert.equal(engine.applyEncounterDamage(boss, 37, { directDamage: true, kind: 'field-super' }), true);
  assert.equal(boss.currentHp, hp - 37);
  assert.equal(boss.vx, 2);
  assert.equal(boss.vy, 3);
  assert.equal(engine.damageDealt, 37);
});

test('a direct nonlethal field effect leaves the exposed brain and boss at one synchronized HP', () => {
  const engine = makeEngine();
  exposeBrain(engine);
  const runtime = engine.nihilanthEncounter;
  assert.equal(engine.applyEncounterDamage(runtime.brain, 100000, {
    directDamage: true, kind: 'anomaly', nonlethal: true
  }), true);
  assert.equal(runtime.boss.currentHp, 1);
  assert.equal(runtime.brain.currentHp, 1);
  assert.equal(runtime.brain.state, 'idle');
  assert.equal(engine.gameOver, false);
  assert.equal(engine.defeatedEnemies, 0);
});

test('direct battle item shields absorb once after head protection, while field effects retain their legacy shield behavior', () => {
  const engine = makeEngine();
  const runtime = engine.nihilanthEncounter;
  const boss = runtime.boss;
  boss.battleItemShield = 50;
  const hp = boss.currentHp;
  engine.applyEncounterDamage(runtime.brain, 100, {
    directDamage: true, kind: 'battle-item', absorbBattleItemShield: true
  });
  assert.equal(boss.currentHp, hp);
  assert.equal(boss.battleItemShield, 50, 'a hidden brain must not consume the body shield');
  engine.applyEncounterDamage(boss, 70, {
    directDamage: true, kind: 'battle-item', absorbBattleItemShield: true
  });
  assert.equal(boss.battleItemShield, 0);
  assert.equal(boss.currentHp, hp - 20);
  boss.battleItemShield = 100;
  engine.applyEncounterDamage(boss, 37, { directDamage: true, kind: 'field-super' });
  assert.equal(boss.currentHp, hp - 57);
  assert.equal(boss.battleItemShield, 100);
});

test('a direct lethal weakpoint hit synchronizes the proxy and cannot count a second corpse kill', () => {
  const engine = makeEngine();
  exposeBrain(engine);
  const runtime = engine.nihilanthEncounter;
  const before = runtime.brain.currentHp;
  engine.applyEncounterDamage(runtime.brain, 100000, { directDamage: true, kind: 'battle-item' });
  assert.equal(runtime.boss.currentHp, 0);
  assert.equal(runtime.brain.currentHp, 0);
  assert.equal(runtime.brain.state, 'dead');
  assert.equal(before - runtime.brain.currentHp, before);
  assert.equal(engine.defeatedEnemies, 1);
  assert.deepEqual(engine.getEncounterTargets().filter(target => target.encounterKind === 'brain'), []);
  assert.equal(engine.applyDamage(engine.heroes[0], runtime.brain, 100000), 0);
  engine.applyEncounterDamage(runtime.brain, 100000, { directDamage: true });
  assert.equal(engine.defeatedEnemies, 1);
});

test('external damage cannot affect an encounter after the match is over', () => {
  const engine = makeEngine();
  const boss = engine.nihilanthEncounter.boss;
  const hp = boss.currentHp;
  engine.gameOver = true;
  engine.applyEncounterDamage(boss, 100000, { directDamage: true });
  assert.equal(boss.currentHp, hp);
});

test('continued attacks after crystal destruction can open the head while orange spheres still remain', () => {
  const engine = makeEngine();
  destroyCrystals(engine);
  const runtime = engine.nihilanthEncounter;
  const hero = engine.heroes[0];
  Object.assign(hero, { x: runtime.boss.x - 25, y: runtime.boss.y, facing: 1, state: 'idle' });
  hero.stats = { ...hero.stats, atk: 10000 };
  assert.match(engine.getObjectiveText(), /affaiblissez.*réduisez sa réserve/i);
  assert.match(engine.getObjectiveText('en'), /weaken.*reduce its reserve/i);
  for (let tick = 0; tick < NIHILANTH_ENCOUNTER_BALANCE.headOpeningTicks; tick++) {
    if (tick % 15 === 0) engine.triggerAbility(hero, 'simple');
    engine.update();
  }
  assert.equal(runtime.headOpen, true);
  assert.ok(runtime.energySpheres > 0, 'opening must not require zero energy spheres');
  assert.ok(runtime.energySpheres < 20);
  assert.equal(runtime.spheresRecharged, 0);
  assert.ok(engine.getEncounterTargets().includes(runtime.brain));
});
