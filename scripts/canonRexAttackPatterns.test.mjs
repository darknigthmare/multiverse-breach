import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { prepareRexAttack, getRexAttackIntent, activateRexChaff, finishRexAttack } from '../src/game/canonRexAttackPatterns.js';
import { applyRexStingerDamage } from '../src/game/canonRexEncounter.js';

let vite, EngineTactics, RexEncounterPanel;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ default: RexEncounterPanel } = await vite.ssrLoadModule('/src/components/RexEncounterPanel.jsx'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

// Explicit geometry/action fixtures isolate footprint, timing and resource rules.
// Full natural manual/AI routes with authored stats remain in canonRexEncounter.test.mjs.
const makeEngine = (stage = CANON_PRIORITY_STAGES.shadowMoses, heroes = [getHeroById('snake')]) => {
  const particles = [];
  const engine = new EngineTactics(760, 420, heroes,
    resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] }),
    { add(...args) { particles.push(args); } }, () => {}, () => {}, stage);
  engines.push(engine);
  engine.timers.forEach(timer => clearTimeout(timer)); engine.timers.clear();
  engine.schedule = (callback, delay) => { if (delay === 400) callback(); return null; };
  engine.testParticles = particles;
  return engine;
};
const geometry = (engine, kind, phase = 'radome') => {
  const e = engine.rexEncounter;
  const hero = engine.heroes[0];
  e.phase = phase;
  e.body.gridX = 7; e.body.gridY = 3;
  hero.gridY = 3; hero.gridX = kind === 'stomp' ? 6 : kind === 'belly_laser' ? 5 : kind === 'machine_guns' ? 4 : 1;
  e.attackCount = kind === 'belly_laser' ? 1 : 0;
  e.attackIntent = prepareRexAttack(e, engine.heroes, engine.cols, engine.rows);
  assert.equal(e.attackIntent.kind, kind);
  return { e, hero };
};
const enemyTurn = engine => {
  engine.activeUnit = engine.rexEncounter.body;
  engine.activeUnitType = 'enemy'; engine.actionPhase = 'enemy_ai';
  return engine.runRexEnemyAI();
};
const heroTurn = engine => {
  engine.activeUnit = engine.heroes[0]; engine.activeUnitType = 'hero';
  engine.actionPhase = 'move'; engine.activeUnit.state = 'idle'; engine.activeUnit.stateTimer = 0;
};

for (const phase of ['radome', 'cockpit']) {
  for (const kind of ['machine_guns', 'missiles', 'belly_laser', 'stomp']) {
    test(`${phase}: ${kind} uses its real marked footprint and damages a living source-stat hero`, () => {
      const engine = makeEngine();
      const { e, hero } = geometry(engine, kind, phase);
      const before = hero.currentHp;
      const targetHp = { radome: e.radomeHp, cockpit: e.cockpitHp };
      assert.equal(enemyTurn(engine), true);
      assert.ok(hero.currentHp < before);
      assert.equal(e.lastAttack.kind, kind);
      assert.equal(e.lastAttack.hitCount, 1);
      assert.ok(e.lastAttack.damage > 0);
      assert.equal(e.body.currentHp, 720);
      assert.deepEqual({ radome: e.radomeHp, cockpit: e.cockpitHp }, targetHp);
      assert.equal(e.attackCount, kind === 'belly_laser' ? 2 : 1);
      assert.equal(e.body.gridX, 7); assert.equal(e.body.gridY, 3);
      assert.equal(e.lastAttack.tracking, kind === 'missiles' ? (phase === 'radome' ? 'radar' : 'manual') : null);
      assert.equal(engine.turnsElapsed, 1);
    });
  }
}

test('medium-range attack sequence alternates missiles and frontal guns rather than using the railgun', () => {
  const engine = makeEngine();
  const { e } = geometry(engine, 'missiles');
  assert.equal(e.body.weapon, 'rex_machine_gun');
  const sequence = [];
  for (let i = 0; i < 4; i++) {
    sequence.push(prepareRexAttack(e, engine.heroes, engine.cols, engine.rows).kind);
    finishRexAttack(e);
  }
  assert.deepEqual(sequence, ['missiles', 'machine_guns', 'missiles', 'machine_guns']);
});

test('laser is a three-cell line, guns a frontal footprint, and feet only threaten adjacency', () => {
  const engine = makeEngine();
  let { e } = geometry(engine, 'belly_laser');
  assert.deepEqual(e.attackIntent.cells, [{ x: 6, y: 3 }, { x: 5, y: 3 }, { x: 4, y: 3 }]);
  ({ e } = geometry(engine, 'machine_guns'));
  assert.ok(e.attackIntent.cells.length > 6);
  assert.ok(e.attackIntent.cells.every(cell => cell.x < e.body.gridX));
  ({ e } = geometry(engine, 'stomp'));
  assert.equal(e.attackIntent.cells.length, 4);
  assert.ok(e.attackIntent.cells.every(cell => Math.abs(cell.x - e.body.gridX) + Math.abs(cell.y - e.body.gridY) === 1));
});

test('moving normally out of the stored missile footprint avoids its damage; the lock never follows the hero', () => {
  const engine = makeEngine();
  const { e, hero } = geometry(engine, 'missiles');
  const locked = structuredClone(e.attackIntent);
  heroTurn(engine); engine.movementSpent = 0; engine.movementBudget = 2;
  engine.calculateMovementRange();
  const safe = engine.getReachableCells(hero, 2).find(cell => !locked.cells.some(p => p.x === cell.x && p.y === cell.y));
  assert.ok(safe);
  assert.equal(engine.handleCellClick(safe.x, safe.y).handled, true);
  assert.deepEqual(e.attackIntent, locked);
  const hp = hero.currentHp;
  enemyTurn(engine);
  assert.equal(hero.currentHp, hp); assert.equal(e.lastAttack.hitCount, 0);
});

test('the UI snapshot and the actual REX threat map expose the same cells, including chaff dispersal', () => {
  const engine = makeEngine();
  geometry(engine, 'missiles'); heroTurn(engine);
  for (const jammed of [false, true]) {
    if (jammed) assert.equal(activateRexChaff(engine.rexEncounter), true);
    engine.getEnemyThreatMap();
    const displayed = engine.getRexEncounterState().attackIntent.cells.map(p => `${p.x},${p.y}`).sort();
    assert.deepEqual([...engine.enemyThreatCells.get(engine.rexEncounter.body).keys()].sort(), displayed);
  }
});

test('chaff consumes one shared grenade and the hero turn, without HP payment, missile or target damage', () => {
  const engine = makeEngine(); geometry(engine, 'missiles'); heroTurn(engine);
  const hp = engine.activeUnit.currentHp;
  assert.equal(engine.triggerRexChaff(), true);
  assert.equal(engine.rexEncounter.chaffRemaining, 2); assert.equal(engine.rexEncounter.chaffAttacksRemaining, 2);
  assert.equal(engine.rexEncounter.chaffUsed, 1); assert.equal(engine.turnsElapsed, 1);
  assert.equal(engine.activeUnit.currentHp, hp); assert.equal(engine.rexEncounter.missileShots, 0);
  assert.equal(engine.rexEncounter.radomeHp, 360); assert.equal(engine.rexEncounter.cockpitHp, 360);
  assert.equal(engine.triggerRexChaff(), false, 'committed turn cannot spend another grenade');
  assert.equal(engine.rexEncounter.chaffRemaining, 2);
});

test('radar chaff leaves a dangerous missile impact instead of granting invulnerability', () => {
  const engine = makeEngine(); const { e, hero } = geometry(engine, 'missiles');
  assert.equal(activateRexChaff(e), true);
  const intent = getRexAttackIntent(e);
  assert.equal(intent.radarDispersed, true); assert.equal(intent.damageMultiplier, 1 / 3);
  assert.deepEqual(intent.cells, [{ x: hero.gridX, y: hero.gridY }]);
  const before = hero.currentHp;
  enemyTurn(engine);
  assert.ok(hero.currentHp < before); assert.ok(before - hero.currentHp < 15);
  assert.equal(e.lastAttack.radarDispersed, true);
});

for (const kind of ['machine_guns', 'belly_laser', 'stomp']) {
  test(`chaff does not disable ${kind} or stun REX`, () => {
    const engine = makeEngine(); const { e, hero } = geometry(engine, kind);
    const cells = structuredClone(e.attackIntent.cells);
    assert.equal(activateRexChaff(e), true);
    assert.deepEqual(getRexAttackIntent(e).cells, cells);
    assert.equal(getRexAttackIntent(e).radarDispersed, false);
    const hp = hero.currentHp; enemyTurn(engine);
    assert.ok(hero.currentHp < hp); assert.equal(e.attackCount, kind === 'belly_laser' ? 2 : 1);
    assert.equal(e.body.statusEffects.glitched, 0);
  });
}

test('opening the cockpit restores manual missile targeting despite an existing chaff cloud', () => {
  const engine = makeEngine(); const { e } = geometry(engine, 'missiles');
  activateRexChaff(e);
  assert.equal(getRexAttackIntent(e).radarDispersed, true);
  applyRexStingerDamage(e, 360);
  assert.equal(e.phase, 'cockpit'); assert.equal(e.chaffAttacksRemaining, 2);
  assert.equal(getRexAttackIntent(e).tracking, 'manual'); assert.equal(getRexAttackIntent(e).radarDispersed, false);
  assert.deepEqual(getRexAttackIntent(e).cells, e.attackIntent.cells);
  heroTurn(engine);
  assert.equal(engine.triggerRexChaff(), false);
  assert.equal(e.chaffRemaining, 2);
  enemyTurn(engine);
  assert.equal(e.lastAttack.tracking, 'manual'); assert.equal(e.lastAttack.radarDispersed, false);
});

test('only completed REX attacks age chaff; UI reads, renders and other turns do not reload or expire it', () => {
  const engine = makeEngine(); const { e } = geometry(engine, 'missiles');
  activateRexChaff(e);
  for (let i = 0; i < 30; i++) { engine.getRexEncounterState(); engine.getEnemyThreatMap(); }
  assert.equal(e.chaffAttacksRemaining, 2); assert.equal(e.chaffRemaining, 2);
  heroTurn(engine); engine.endActiveTurn();
  assert.equal(e.chaffAttacksRemaining, 2);
  enemyTurn(engine); assert.equal(e.chaffAttacksRemaining, 1);
  enemyTurn(engine); assert.equal(e.chaffAttacksRemaining, 0);
  assert.equal(e.chaffRemaining, 2);
});

test('three grenades remain finite across hero selections and cannot be refreshed while active or empty', () => {
  const engine = makeEngine(); const e = engine.rexEncounter;
  for (let i = 0; i < 3; i++) {
    assert.equal(activateRexChaff(e), true);
    assert.equal(activateRexChaff(e), false);
    finishRexAttack(e); finishRexAttack(e);
    heroTurn(engine); assert.equal(e.chaffRemaining, 2 - i);
  }
  assert.equal(activateRexChaff(e), false); assert.equal(engine.triggerRexChaff(), false);
  assert.equal(e.chaffRemaining, 0); assert.equal(e.chaffUsed, 3);
});

test('pause, dead/stale hero, committed action, enemy turn, completion and disposal reject chaff atomically', () => {
  for (const setup of [
    e => { e.paused = true; }, e => { e.activeUnit.currentHp = 0; },
    e => { e.activeUnit = { ...e.activeUnit }; }, e => { e.actionPhase = 'end'; },
    e => { e.activeUnitType = 'enemy'; }, e => { e.rexEncounter.complete = true; }, e => e.dispose()
  ]) {
    const engine = makeEngine(); heroTurn(engine); setup(engine);
    assert.equal(engine.triggerRexChaff(), false);
    assert.equal(engine.rexEncounter.chaffRemaining, 3); assert.equal(engine.turnsElapsed, 0);
  }
});

test('custom and other incarnations cannot gain a source REX grenade command or attack loop', () => {
  for (const patch of [{ customBattle: {} }, { isCustomBattle: true }, { incarnation: 'Metal Gear Solid 4' }]) {
    const engine = makeEngine({ ...CANON_PRIORITY_STAGES.shadowMoses, ...patch });
    assert.equal(engine.getRexEncounterState(), null); assert.equal(engine.triggerRexChaff(), false);
    assert.equal(engine.runRexEnemyAI(), false);
  }
});

test('a completed source encounter has no telegraph, no REX attack and no chaff renewal', () => {
  const engine = makeEngine(); const { e } = geometry(engine, 'missiles');
  applyRexStingerDamage(e, 360); applyRexStingerDamage(e, 360);
  const hp = engine.heroes[0].currentHp;
  assert.equal(getRexAttackIntent(e), null); assert.equal(enemyTurn(engine), false);
  assert.equal(engine.heroes[0].currentHp, hp); assert.equal(activateRexChaff(e), false);
});

test('real scheduled REX damage waits through pause and cannot resolve twice', async () => {
  const engine = makeEngine(); const { e, hero } = geometry(engine, 'missiles');
  engine.schedule = EngineTactics.prototype.schedule.bind(engine);
  const before = hero.currentHp;
  assert.equal(enemyTurn(engine), true); assert.equal(engine.runRexEnemyAI(), false);
  engine.paused = true;
  await new Promise(resolve => setTimeout(resolve, 460));
  assert.equal(hero.currentHp, before); assert.equal(e.attackCount, 0);
  engine.paused = false;
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.ok(hero.currentHp < before); assert.equal(e.attackCount, 1);
  assert.equal(engine.runRexEnemyAI(), false, 'resolved committed turn is not another attack');
});

const buttons = tree => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(buttons)
  : [...(tree.type === 'button' ? [tree] : []), ...buttons(tree.props?.children)];
for (const lang of ['fr', 'en']) {
  test(`${lang}: source panel displays exact warning cells, reserve, duration and a guarded chaff callback`, () => {
    const engine = makeEngine(); geometry(engine, 'missiles'); heroTurn(engine);
    const encounter = engine.getRexEncounterState();
    const props = { encounter, hero: engine.heroes[0], lang, onChaff: () => engine.triggerRexChaff() };
    const html = renderToStaticMarkup(React.createElement(RexEncounterPanel, props));
    assert.match(html, lang === 'fr' ? /Prochaine attaque de REX.*Salve de missiles/ : /Next REX attack.*Missile salvo/);
    assert.match(html, /B3, B4, B5/); assert.match(html, /3\/3/);
    assert.match(html, lang === 'fr' ? /utilise le tour/ : /uses the turn/);
    const chaff = buttons(RexEncounterPanel(props))[1];
    assert.equal(chaff.props.disabled, false); chaff.props.onClick();
    assert.equal(engine.rexEncounter.chaffRemaining, 2);
    const blocked = buttons(RexEncounterPanel({ ...props, paused: true }))[1];
    blocked.props.onClick(); assert.equal(engine.rexEncounter.chaffRemaining, 2);
  });
}

test('manual cockpit and a wrong active hero disable the chaff UI even with remaining grenades', () => {
  const engine = makeEngine(); geometry(engine, 'missiles', 'cockpit'); heroTurn(engine);
  const props = { encounter: engine.getRexEncounterState(), hero: engine.heroes[0], onChaff: () => assert.fail('must remain blocked') };
  const chaff = buttons(RexEncounterPanel(props))[1];
  assert.equal(chaff.props.disabled, true); chaff.props.onClick();
  const stale = buttons(RexEncounterPanel({ ...props, hero: { id: 'other', currentHp: 120 } }))[1];
  assert.equal(stale.props.disabled, true); stale.props.onClick();
});

for (const ids of [['will_turner_potc', 'elizabeth_swann_potc', 'jack_sparrow_potc'], ['marcus', 'ripley', 'freeman']]) {
  test(`natural AI squad ${ids.join('/')} completes the armed REX encounter without HP, position or damage overrides`, () => {
    const heroes = ids.map(id => getHeroById(id));
    assert.ok(heroes.every(Boolean));
    const engine = makeEngine(CANON_PRIORITY_STAGES.shadowMoses, heroes);
    // Skip only animation scheduling; normal movement, enemy attacks and damage run.
    engine.schedule = (callback, delay) => { if ([400, 500].includes(delay)) callback(); return null; };
    for (let i = 0; i < 100 && !engine.gameOver; i++) {
      if (engine.activeUnitType === 'hero') engine.runHeroAI(); else engine.runEnemyAI();
      for (let frame = 0; frame < 36 && !engine.gameOver; frame++) engine.update();
      engine.startTurn();
    }
    assert.equal(engine.battleResult, 'victory');
    assert.equal(engine.rexEncounter.phase, 'complete');
    assert.equal(engine.rexEncounter.body.currentHp, 720);
    assert.ok(engine.heroes.some(hero => hero.currentHp > 0));
    assert.equal(engine.getRexEncounterState().liquidSurvives, true);
    const jack = engine.heroes.find(hero => hero.id === 'jack_sparrow_potc');
    if (jack) assert.equal(jack.sourceAmmoRemaining, 1, 'mission Stinger never spends Jack’s personal bullet');
  });
}
