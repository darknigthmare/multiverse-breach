import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { after, afterEach, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { getTacticsEscortBriefing, getTacticsEscortPose, resolveTacticsEscort } from '../src/game/tacticsEscort.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const noop = () => {};
const engines = [];
let vite;
let EngineTactics;
before(async () => {
  vite = await createServer({ root: projectRoot, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?escort-regressions'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

const makeEngine = () => {
  const hero = {
    id: 'escort-test-hero', name: 'Escort Test', universe: 'Portal', category: 'escort-test',
    stats: { hp: 180, atk: 18, def: 9, spd: 15 },
    simple: { name: 'Strike', dmg: 1 }, secondary: { name: 'Burst', dmg: 1.3, cd: 3 },
    defense: { name: 'Guard', reduce: 0.4, dur: 1 }, special: { name: 'Rupture', dmg: 1.8 }
  };
  const threat = { id: 'escort-threat', name: 'Threat', universe: 'Portal', hp: 200, atk: 16, def: 7, spd: 8, weapon: 'melee' };
  const engine = new EngineTactics(960, 540, [hero], { monsters: [threat], bosses: [], customRoster: [threat] }, { add: noop }, noop, noop, {
    id: 'escort-regression', universe: 'Portal', tacticsBattlefieldId: 'nexus_escort_route',
    customBattle: { opponentControl: 'p2', singleRoster: true }
  });
  engines.push(engine);
  engine.cols = 7;
  engine.rows = 5;
  engine.obstacles = [];
  engine.tiles = [];
  engine.protectedArtifact = null;
  engine.battlefield = { ...engine.battlefield, extractionZone: [{ x: 4, y: 2 }] };
  Object.assign(engine.heroes[0], { gridX: 1, gridY: 2 });
  Object.assign(engine.enemies[0], { gridX: 6, gridY: 0 });
  Object.assign(engine.escortUnit, { gridX: 2, gridY: 2 });
  engine.syncActorsToCamera();
  return engine;
};

test('universe role is an explicit provisional representation, not a renamed canon identity', () => {
  const escort = resolveTacticsEscort({ universe: 'Portal' });
  assert.equal(escort.name.fr, 'Sujet de test a evacuer');
  assert.equal(escort.sourceHeroName, 'Chell');
  assert.equal(escort.provisional, true);
  assert.match(escort.representation.fr, /Representation provisoire.*Chell/);
  assert.match(getTacticsEscortBriefing({ universe: 'Portal' }, 'en'), /Test subject to evacuate.*Portal.*Provisional representation.*Chell/);
});

test('mission hero and origin universe override keep the actual canonical name by default', () => {
  const escort = resolveTacticsEscort({ universe: 'Halo', escort: { universe: 'Portal', heroId: 'chell' } });
  assert.equal(escort.universe, 'Portal');
  assert.deepEqual(escort.name, { fr: 'Chell', en: 'Chell' });
  assert.equal(escort.provisional, false);
  assert.equal(escort.identitySource, 'mission');
});

test('mission-local identities and unknown hero ids preserve explicit provisional provenance', () => {
  const escort = resolveTacticsEscort({ universe: 'Portal', escort: { heroId: 'chell', name: { fr: 'Temoin 07', en: 'Witness 07' }, role: 'Technicien' } });
  assert.equal(escort.name.en, 'Witness 07');
  assert.equal(escort.role.fr, 'Technicien');
  assert.equal(escort.provisional, true);
  assert.match(escort.representation.en, /Chell/);
  assert.equal(resolveTacticsEscort({ universe: 'Portal', escort: { heroId: 'unknown' } }).provisional, true);
});

test('mapped universe roles only reuse existing bitmap files', () => {
  for (const universe of ['Half-Life', 'Portal', 'Stargate', 'Halo', 'Star Wars', 'Resident Evil', 'Harry Potter', 'Nexus de Convergence', 'Unknown Test']) {
    const escort = resolveTacticsEscort({ universe });
    assert.ok(existsSync(path.join(projectRoot, 'public', escort.spritePath)), `${universe}: ${escort.spritePath}`);
    assert.equal(escort.universe, universe);
    assert.equal(escort.provisional, true);
  }
});

test('escort uses its real sprite identity and joins the actor depth order', () => {
  const engine = makeEngine();
  const escort = engine.escortUnit;
  assert.equal(escort.id, 'chell');
  assert.equal(escort.name, 'Sujet de test a evacuer');
  assert.equal(escort.identity.provisional, true);
  assert.equal(escort.stats.atk, 0);
  assert.notEqual(escort.stats, escort.identity.spriteHero.stats);
  Object.assign(engine.heroes[0], { gridY: 4 });
  const order = engine.getTacticsDrawOrder();
  assert.ok(order.indexOf(order.find(entry => entry.type === 'enemy')) < order.indexOf(order.find(entry => entry.type === 'escort')));
  assert.ok(order.indexOf(order.find(entry => entry.type === 'escort')) < order.indexOf(order.find(entry => entry.type === 'hero')));
  assert.match(engine.getObjectiveText('en'), /Test subject to evacuate/);
  assert.equal(engine.getCombatSummary().escortIdentity.sourceHeroId, 'chell');
});

test('escort routes around cover even when the first step moves away from extraction', () => {
  const engine = makeEngine();
  engine.tiles = [0, 1, 2, 3].map(y => ({ x: 3, y, type: 'blocked' }));
  engine.advanceEscortUnit();
  assert.equal(engine.escortUnit.gridX, 2);
  assert.equal(engine.escortUnit.gridY, 3);
  assert.equal(engine.escortUnit.state, 'run');
  assert.deepEqual(engine.getFacingVector(engine.escortUnit), { x: 0, y: 1 });
});

test('escort waits without a nearby hero and without an open route', () => {
  const engine = makeEngine();
  Object.assign(engine.heroes[0], { gridX: 0, gridY: 0 });
  engine.advanceEscortUnit();
  assert.equal(engine.escortUnit.gridX, 2);
  Object.assign(engine.heroes[0], { gridX: 1, gridY: 2 });
  engine.tiles = [0, 1, 2, 3, 4].map(y => ({ x: 3, y, type: 'blocked' }));
  engine.advanceEscortUnit();
  assert.equal(engine.escortUnit.gridX, 2);
  assert.equal(engine.escortUnit.gridY, 2);
});

test('clearing hostiles does not replace the escort extraction objective', () => {
  const engine = makeEngine();
  engine.enemies.forEach(enemy => { enemy.currentHp = 0; });
  engine.update();
  assert.equal(engine.gameOver, false);
  assert.equal(engine.escortUnit.extracted, false);
  Object.assign(engine.escortUnit, { gridX: 4, gridY: 2 });
  engine.updateTacticsObjective();
  assert.equal(engine.gameOver, true);
  assert.equal(engine.battleResult, 'victory');
  assert.equal(engine.escortUnit.extracted, true);
  assert.deepEqual({ x: engine.escortUnit.x, y: engine.escortUnit.y }, engine.getUnitScreenPosition(4, 2));
});

test('escort hurt pose recovers and extraction falls back only to an authored sprite row', () => {
  const engine = makeEngine();
  engine.escortUnit.state = 'hit';
  engine.escortUnit.stateTimer = 2;
  engine.update();
  assert.equal(engine.escortUnit.state, 'hit');
  engine.update();
  assert.equal(engine.escortUnit.state, 'idle');
  assert.equal(getTacticsEscortPose({ ...engine.escortUnit, extracted: true }), 'idle', 'Chell has no dedicated extraction row');
});

test('automatic heroes continue following the escort after clearing hostiles', () => {
  const engine = makeEngine();
  engine.enemies.forEach(enemy => { enemy.currentHp = 0; });
  Object.assign(engine.heroes[0], { gridX: 0, gridY: 2 });
  engine.activeUnit = engine.heroes[0];
  engine.activeUnitType = 'hero';
  engine.calculateMovementRange();
  engine.runHeroAI();
  assert.equal(engine.heroes[0].gridX, 1);
  assert.equal(engine.escortUnit.gridX, 3);
  assert.equal(engine.gameOver, false);
});

test('escort renderer no longer substitutes a generic N rectangle and displays the provenance warning', () => {
  const source = readFileSync(path.join(projectRoot, 'src/game/engineTactics.js'), 'utf8');
  assert.doesNotMatch(source, /fillText\('N',/);
  assert.match(source, /REPRESENTATION PROVISOIRE/);
  assert.match(source, /type: 'escort'/);
});
