import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
let vite;
let EngineSmash;

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?smash-objective-resolution'));
});

after(async () => {
  await vite?.close();
});

const makeHero = () => ({
  id: 'player_anchor',
  name: 'Player Anchor',
  universe: 'Nexus de Convergence',
  category: 'anchor',
  primaryColor: '#39c5bb',
  secondaryColor: '#ffea00',
  stats: { hp: 180, atk: 18, def: 9, spd: 8 },
  simple: { name: 'Test Strike', dmg: 1 },
  secondary: { name: 'Test Burst', dmg: 1.3, cd: 3 },
  defense: { name: 'Test Guard', reduce: 0.4, dur: 1 },
  special: { name: 'Test Rupture', dmg: 1.8 }
});

const makeThreat = () => ({
  id: 'objective-threat',
  name: 'Objective Threat',
  universe: 'Nexus de Convergence',
  hp: 160,
  atk: 16,
  def: 7,
  spd: 8,
  color: '#e74c3c',
  weapon: 'melee'
});

const makeProtectEngine = (sfx = []) => {
  const threat = makeThreat();
  const engine = new EngineSmash(
    760,
    420,
    [makeHero()],
    { monsters: [threat], bosses: [], worldBoss: null, customRoster: [threat] },
    { add() {} },
    cue => sfx.push(cue),
    () => {},
    {
      id: 'smash-objective-resolution',
      universe: 'Nexus de Convergence',
      mode: 'Smash',
      customBattle: { opponentControl: 'cpu', singleRoster: true }
    }
  );
  engine.arena.objective = 'protect';
  engine.objectiveTarget = 1;
  return engine;
};

test('protect objective gives artifact destruction priority on a simultaneous terminal frame', () => {
  const sfx = [];
  const engine = makeProtectEngine(sfx);
  engine.objectiveProgress = 1;
  engine.artifactHp = 0;
  engine.updateObjectiveBattleState();

  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'defeat');
  assert.equal(engine.getActiveHero().state, 'defeat');
  assert.deepEqual(sfx, ['defeat']);
});

test('party wipe resolves before a protect objective can win the same update', () => {
  const sfx = [];
  const engine = makeProtectEngine(sfx);
  engine.isFixedCustomRoster = false;
  engine.syncPreMatchFromServer(3000);
  engine.getActiveHero().currentHp = 0;
  engine.objectiveProgress = 1;
  engine.artifactHp = 100;

  engine.update({}, {});

  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'defeat');
  assert.equal(engine.getActiveHero().state, 'defeat');
  assert.deepEqual(sfx, ['defeat']);
});
