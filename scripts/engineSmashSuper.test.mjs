import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let vite;
let EngineSmash;
let tickMeleeCombatActor;
let beginMeleeShield;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }
  });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?super-regressions'));
  ({ tickMeleeCombatActor, beginMeleeShield } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});

after(async () => { await vite?.close(); });

const fighter = (id, special = { name: 'Directed Beam', type: 'beam', dmg: 4.5 }) => ({
  id, name: id, universe: 'Test universe', category: 'test',
  stats: { hp: 600, atk: 20, def: 0, spd: 8 },
  simple: { name: 'Strike', dmg: 1 }, secondary: { name: 'Shot', dmg: 1.2, cd: 3 },
  defense: { name: 'Guard', reduce: 0.4, dur: 1 },
  special, primaryColor: '#40c0ff', secondaryColor: '#ffffff'
});

const createEngine = ({ special, opponentSpecial, p2 = false } = {}) => {
  const cues = [];
  const roster = [fighter('enemy-one', opponentSpecial ?? null), fighter('enemy-two', null), fighter('enemy-three', null)];
  const engine = new EngineSmash(900, 500, [fighter('hero', special), fighter('ally')],
    { monsters: roster, bosses: [], worldBoss: null, customRoster: roster },
    { add() {} }, cue => cues.push(cue), () => {},
    { id: 'super-tests', universe: 'Test universe', mode: 'Smash', disableHazards: true,
      customBattle: { opponentControl: p2 ? 'p2' : 'cpu', singleRoster: true } });
  engine.syncPreMatchFromServer(3000);
  [engine.heroes[0], engine.heroes[1], ...engine.enemies].forEach((actor, index) => {
    actor.x = [100, 115, 180, 240, 780][index];
    actor.y = engine.groundY;
    actor.vx = 0;
    actor.vy = 0;
    actor.state = 'idle';
  });
  engine.heroes[0].specialCharge = 100;
  return { engine, hero: engine.heroes[0], ally: engine.heroes[1], enemies: engine.enemies, cues };
};

const advance = (engine, actor, duration) => {
  for (let elapsed = 0; elapsed < duration - 1e-8;) {
    const step = Math.min(0.05, duration - elapsed);
    tickMeleeCombatActor(actor, step, { resolveActionHit: (source, action) => engine.resolveMeleeActionHit(source, action) });
    elapsed += step;
  }
};

const supportProfile = (effect, values = {}) => ({
  id: `test-${effect}`, name: `Test ${effect}`, universe: 'Test universe',
  effect, delivery: 'support', multiplier: 3, color: '#00ffaa', range: 260,
  duration: 0.8, hitAt: 0.3, meterCost: 100, sourceAbility: { dur: 0.5 },
  ...values
});

test('keyboard/touch special and legacy ability dispatch share one timed super and one meter spend', () => {
  const { engine, hero, enemies, cues } = createEngine();
  const hp = enemies[0].currentHp;
  assert.equal(engine.triggerMeleeAction('player', 'Special'), true);
  assert.equal(hero.action.id, 'super');
  const superAction = hero.action;
  assert.equal(hero.action.superProfile.name, 'Directed Beam');
  assert.equal(hero.specialCharge, 0);
  assert.equal(enemies[0].currentHp, hp, 'a super must respect its startup');
  assert.equal(engine.triggerAbility(hero, 'special'), false);
  advance(engine, hero, hero.action.hitAt - 0.01);
  assert.equal(enemies[0].currentHp, hp);
  advance(engine, hero, 0.02);
  assert.ok(enemies[0].currentHp < hp);
  const afterHit = enemies[0].currentHp;
  assert.equal(engine.resolveMeleeActionHit(hero, superAction), 0, 'a duplicate impact dispatch is ignored');
  advance(engine, hero, 1.5);
  assert.equal(enemies[0].currentHp, afterHit);
  assert.equal(hero.specialCharge, 0, 'super hits must not refund their activation cost');
  assert.equal(cues.filter(cue => cue === 'special').length, 1);
});

test('beam respects facing, finite range and height while projectile hits the nearest target', () => {
  const { engine, hero, enemies } = createEngine();
  enemies[2].x = 80;
  assert.equal(engine.triggerAbility(hero, 'special'), true);
  const range = hero.action.superProfile.range;
  assert.ok(Number.isFinite(range));
  enemies[1].x = hero.x + range + 1;
  const untouched = enemies.map(enemy => enemy.currentHp);
  advance(engine, hero, 1.5);
  assert.ok(enemies[0].currentHp < untouched[0]);
  assert.equal(enemies[1].currentHp, untouched[1]);
  assert.equal(enemies[2].currentHp, untouched[2]);

  const projectileMatch = createEngine({ special: { name: 'Magnum Shot', type: 'bullet', dmg: 4 } });
  assert.equal(projectileMatch.engine.triggerAbility(projectileMatch.hero, 'special'), true);
  assert.equal(projectileMatch.hero.action.superProfile.delivery, 'projectile');
  const secondHp = projectileMatch.enemies[1].currentHp;
  advance(projectileMatch.engine, projectileMatch.hero, 1.5);
  assert.ok(projectileMatch.enemies[0].currentHp < projectileMatch.enemies[0].maxHp);
  assert.equal(projectileMatch.enemies[1].currentHp, secondHp);

  const rocketMatch = createEngine({ special: { name: 'Rocket', type: 'rocket', dmg: 4 } });
  rocketMatch.engine.triggerAbility(rocketMatch.hero, 'special');
  advance(rocketMatch.engine, rocketMatch.hero, 1.5);
  assert.ok(rocketMatch.enemies[0].currentHp < rocketMatch.enemies[0].maxHp);
  assert.ok(rocketMatch.enemies[1].currentHp < rocketMatch.enemies[1].maxHp, 'an explosive projectile preserves its splash');
  assert.equal(rocketMatch.enemies[2].currentHp, rocketMatch.enemies[2].maxHp);
});

test('authored heal restores nearby living allies without damaging enemies or reviving', () => {
  const { engine, hero, ally, enemies } = createEngine({ special: { name: 'Life Line', type: 'heal', dmg: 3.2 } });
  hero.currentHp = 100;
  ally.currentHp = 0;
  ally.state = 'dead';
  const enemyHp = enemies[0].currentHp;
  assert.equal(engine.triggerAbility(hero, 'special'), true);
  assert.equal(hero.action.superProfile.effect, 'heal');
  advance(engine, hero, 1.5);
  assert.ok(hero.currentHp > 100);
  assert.ok(hero.currentHp <= hero.maxHp);
  assert.equal(ally.currentHp, 0);
  assert.equal(enemies[0].currentHp, enemyHp);
});

test('guard, buff, cleanse and revive retain their support effects and expire during simulation', () => {
  const { engine, hero, ally, enemies } = createEngine();
  assert.equal(engine.triggerMeleeSuper(hero, supportProfile('guard', { guardReduce: 1 })), true);
  advance(engine, hero, 0.31);
  const hp = ally.currentHp;
  engine.applyDamage(enemies[0], ally, 100, 0);
  assert.equal(ally.currentHp, hp);
  advance(engine, ally, 0.6);
  engine.applyDamage(enemies[0], ally, 100, 0);
  assert.ok(ally.currentHp < hp);

  const buffMatch = createEngine();
  buffMatch.engine.triggerMeleeSuper(buffMatch.hero, supportProfile('buff', { buffMultiplier: 2 }));
  advance(buffMatch.engine, buffMatch.hero, 0.31);
  assert.equal(buffMatch.ally.meleeSuperSupport.buffMultiplier, 2);
  advance(buffMatch.engine, buffMatch.ally, 0.6);
  assert.equal(buffMatch.ally.meleeSuperSupport, null);

  const cleanseMatch = createEngine();
  cleanseMatch.ally.statusEffects.infected = 100;
  cleanseMatch.ally.statusEffects.glitched = 100;
  cleanseMatch.engine.triggerMeleeSuper(cleanseMatch.hero, supportProfile('cleanse', { cleanses: ['infected'] }));
  advance(cleanseMatch.engine, cleanseMatch.hero, 1);
  assert.equal(cleanseMatch.ally.statusEffects.infected, 0);
  assert.equal(cleanseMatch.ally.statusEffects.glitched, 100);

  const reviveMatch = createEngine();
  reviveMatch.ally.currentHp = 0;
  reviveMatch.ally.state = 'dead';
  reviveMatch.engine.triggerMeleeSuper(reviveMatch.hero, supportProfile('revive', { reviveRatio: 0.4 }));
  advance(reviveMatch.engine, reviveMatch.hero, 1);
  assert.equal(reviveMatch.ally.currentHp, Math.round(reviveMatch.ally.maxHp * 0.4));
  assert.equal(reviveMatch.ally.state, 'idle');
  assert.equal(reviveMatch.enemies[0].currentHp, reviveMatch.enemies[0].maxHp);
});

test('interruption, pause input reset and outcome cannot produce a delayed second impact', () => {
  const interrupted = createEngine();
  interrupted.engine.triggerAbility(interrupted.hero, 'special');
  interrupted.engine.applyDamage(interrupted.enemies[0], interrupted.hero, 1, 0);
  assert.equal(interrupted.hero.action, null);
  advance(interrupted.engine, interrupted.hero, 1.5);
  assert.equal(interrupted.enemies[0].currentHp, interrupted.enemies[0].maxHp);
  assert.equal(interrupted.hero.specialCharge, 0);

  const paused = createEngine();
  paused.engine.triggerAbility(paused.hero, 'special');
  advance(paused.engine, paused.hero, 0.1);
  const elapsed = paused.hero.action.elapsed;
  paused.engine.clearMeleeInputState('player');
  tickMeleeCombatActor(paused.hero, 0);
  assert.equal(paused.hero.action.elapsed, elapsed);
  advance(paused.engine, paused.hero, 1.5);
  assert.ok(paused.enemies[0].currentHp < paused.enemies[0].maxHp);
  assert.equal(paused.hero.specialCharge, 0);

  const finished = createEngine();
  finished.engine.triggerAbility(finished.hero, 'special');
  finished.engine.gameOver = true;
  advance(finished.engine, finished.hero, 1.5);
  assert.equal(finished.enemies[0].currentHp, finished.enemies[0].maxHp);
});

test('perfect guard works on supers; missing abilities spend no meter for P2 or CPU', () => {
  const { engine, hero, enemies } = createEngine();
  engine.triggerAbility(hero, 'special');
  advance(engine, hero, hero.action.hitAt - 0.01);
  beginMeleeShield(enemies[0]);
  advance(engine, hero, 0.02);
  assert.equal(enemies[0].currentHp, enemies[0].maxHp);
  assert.equal(enemies[0].meleeMetrics.perfectShields, 1);

  const local = createEngine({ p2: true });
  local.enemies[0].specialCharge = 100;
  assert.equal(local.engine.triggerOpponentAbility('special'), false);
  assert.equal(local.engine.triggerMeleeAction('cpu', 'Special'), false);
  assert.equal(local.engine.tryCpuMeleeSuper(local.enemies[0]), false);
  assert.equal(local.enemies[0].specialCharge, 100);
});

test('CPU and local P2 can activate their own authored super with the same runtime', () => {
  const cpu = createEngine({ opponentSpecial: { name: 'CPU Beam', type: 'beam', dmg: 3 } });
  cpu.enemies[0].specialCharge = 100;
  assert.equal(cpu.engine.tryCpuMeleeSuper(cpu.enemies[0]), true);
  assert.equal(cpu.enemies[0].action.id, 'super');
  assert.equal(cpu.enemies[0].action.superProfile.name, 'CPU Beam');
  assert.equal(cpu.enemies[0].specialCharge, 0);
  advance(cpu.engine, cpu.enemies[0], 1.5);
  assert.ok(cpu.hero.currentHp < cpu.hero.maxHp);

  const local = createEngine({ p2: true, opponentSpecial: { name: 'P2 Beam', type: 'beam', dmg: 3 } });
  local.enemies[0].specialCharge = 100;
  assert.equal(local.engine.triggerOpponentAbility('special'), true);
  assert.equal(local.enemies[0].action.superProfile.name, 'P2 Beam');
  assert.equal(local.enemies[0].specialCharge, 0);
});

test('every fighter keeps its own intro duration and outcome while pending attacks are cleared', () => {
  const { engine, hero, ally, enemies } = createEngine();
  const actors = [hero, ally, ...enemies];
  actors.forEach(actor => {
    actor.state = 'intro';
    actor.stateElapsed = 0;
    assert.ok(actor.meleePresentation.name.includes(actor.name));
  });
  for (let frame = 0; frame < 60; frame++) assert.equal(engine.advanceMeleeIntro(), true);
  assert.equal(engine.isMeleeIntroActive(), true, 'the authored intro outlasts the old 0.4 second default');
  for (let frame = 0; frame < 60; frame++) engine.advanceMeleeIntro();
  assert.equal(engine.isMeleeIntroActive(), false);
  engine.triggerAbility(hero, 'special');
  engine.setMeleeOutcomeStates('defeat');
  assert.equal(hero.action, null);
  assert.equal(hero.state, 'defeat');
  assert.equal(ally.state, 'defeat');
  assert.equal(enemies[0].state, 'victory');
  assert.ok(enemies[0].meleePresentation.name.includes(enemies[0].name));
  engine.tickMeleeOutcomeStates();
  assert.ok(enemies[0].stateElapsed > 0);
});
