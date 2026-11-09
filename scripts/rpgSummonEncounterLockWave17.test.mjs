import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
let vite, EngineRpg, getHeroById, ENEMIES_DB, resolveStageEnemyData, stages;
const engines = [];
before(async () => {
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent',
    server: { middlewareMode: true, watch: null, hmr: false } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ getHeroById } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ resolveStageEnemyData } = await vite.ssrLoadModule('/src/game/stageEnemyResolver.js'));
  const { CANON_PRIORITY_STAGES } = await vite.ssrLoadModule('/src/game/canonPriorityStages.js');
  const { getExpandedStages } = await vite.ssrLoadModule('/src/game/expandedUniverses.js');
  stages = { raam: CANON_PRIORITY_STAGES.lightmassTrain, pirates: getExpandedStages().find(stage => stage.id === 269) };
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
function fixture(encounter) {
  const stage = { ...stages[encounter], disableHazards: true };
  const data = resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] });
  const engine = new EngineRpg(760, 420, ['cloud_ff7', 'marcus'].map(getHeroById), data,
    { add() {} }, () => {}, () => {}, stage);
  engines.push(engine);
  if (encounter === 'raam') { engine.wave = 2; engine.spawnWave(); }
  engine.enemyGlobalRecovery = 99999;
  engine.heroes.forEach(unit => Object.assign(unit, { atb: 100, specialCharge: 100, cooldown: 0,
    state: 'idle', stateTimer: 0, actionPending: false }));
  const [caller, readyHero] = engine.heroes;
  assert.equal(engine.beginTargeting(caller, 'summon'), true);
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(engine.isSummonSceneActive(), true);
  engine.selectHero(readyHero.id);
  assert.equal(engine.getSelectedHero(), readyHero);
  return { engine, caller, readyHero };
}
function finishScene(engine) {
  let ticks = 0;
  while (engine.isSummonSceneActive() && ticks++ < 600) engine.update();
  assert.equal(engine.isSummonSceneActive(), false);
  assert.ok(ticks < 600);
}
for (const command of ['take-light-cover', 'frag']) test(`RAAM ${command} waits for an actual summon scene to finish without spending another ready hero's resources`, () => {
  const { engine, readyHero } = fixture('raam');
  const before = { atb: readyHero.atb, x: readyHero.x, y: readyHero.y,
    grenades: engine.raamEncounter.grenadesRemaining, queue: engine.actionQueue.length };
  assert.equal(engine.canUseRaamEncounterAction(readyHero), false);
  assert.equal(engine.getRaamEncounterState().commands.frag, false);
  assert.equal(engine.triggerRaamEncounterAction(command, readyHero), false);
  assert.deepEqual({ atb: readyHero.atb, x: readyHero.x, y: readyHero.y,
    grenades: engine.raamEncounter.grenadesRemaining, queue: engine.actionQueue.length }, before);
  finishScene(engine);
  assert.equal(engine.canUseRaamEncounterAction(readyHero), true);
  assert.equal(engine.triggerRaamEncounterAction(command, readyHero), true);
  assert.equal(readyHero.atb, 0);
  if (command === 'frag') assert.equal(engine.raamEncounter.grenadesRemaining, before.grenades - 1);
  else assert.notEqual(readyHero.x, before.x);
});
test('Pirates ritual coordination waits for an actual summon scene and resumes through the ordinary command impact', () => {
  const { engine, readyHero } = fixture('pirates'), encounter = engine.piratesCurseEncounter;
  const before = { atb: readyHero.atb, x: readyHero.x, y: readyHero.y,
    returned: encounter.returnedPieces, command: encounter.commandPending, ritual: encounter.ritualPending,
    coins: encounter.finalCoinsCollected, queue: engine.actionQueue.length };
  assert.equal(engine.canUsePiratesCurseAction(readyHero), false);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', readyHero), false);
  assert.deepEqual({ atb: readyHero.atb, x: readyHero.x, y: readyHero.y,
    returned: encounter.returnedPieces, command: encounter.commandPending, ritual: encounter.ritualPending,
    coins: encounter.finalCoinsCollected, queue: engine.actionQueue.length }, before);
  finishScene(engine);
  assert.equal(engine.canUsePiratesCurseAction(readyHero), true);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', readyHero), true);
  assert.equal(readyHero.atb, 0); assert.equal(encounter.commandPending, 'collect-final-coins');
  for (let i = 0; i < 18; i++) engine.update();
  assert.equal(encounter.finalCoinsCollected, true); assert.equal(encounter.commandPending, null);
});
