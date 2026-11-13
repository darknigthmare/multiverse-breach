import assert from 'node:assert/strict';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';
import { EngineFighter } from '../src/game/engineFighter.js';
import { EngineSmash } from '../src/game/engineSmash.js';
import { samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { REVIEWED_KOTOR_I_REVAN_CORRECTION as reviewed } from '../src/game/canonicalSpriteQuarantine.js';

const noop = () => {};
const particles = { add: noop };
const revan = getHeroById('darth_revan');
const other = getHeroById('han_solo');
const advance = (engine, seconds) => {
  for (let i = 0; i < Math.ceil(seconds * 60); i++) engine.update(1 / 60);
};
const toPhase = (engine, phase) => {
  for (let i = 0; i < 1200 && engine.getSnapshot().phase !== phase; i++) engine.update(1 / 60);
  assert.equal(engine.getSnapshot().phase, phase);
};
const fighter = (side = 'player', complete = noop) => new EngineFighter(960, 540,
  [side === 'player' ? revan : other], [side === 'cpu' ? revan : other], particles, noop, complete,
  { opponentControl: 'p2', roundsToWin: 1 });

test('a KO opponent keeps defeat during the outro rather than standing up and running away', () => {
  const engine = fighter();
  engine.countdown = 0;
  engine.getActive('cpu').currentHp = 0;
  engine.endRound('victory');
  toPhase(engine, 'outro');
  const entries = engine.getSnapshot().presentation.entries;
  assert.equal(entries.find(entry => entry.side === 'player').actorPhase, 'outro');
  assert.equal(entries.find(entry => entry.side === 'cpu').actorPhase, 'defeat');
  assert.equal(engine.getActive('cpu').currentHp, 0);
  const ko = entries.find(entry => entry.side === 'cpu');
  assert.equal(ko.script.sample.progress, 1, 'the KO must hold its completed defeat, not restart the fall');
  advance(engine, .5);
  const later = engine.getSnapshot().presentation.entries.find(entry => entry.side === 'cpu');
  assert.deepEqual(later.script.sample.asset, ko.script.sample.asset);
  assert.equal(later.script.sample.progress, 1);
  engine.dispose();
});

for (const side of ['player', 'cpu']) {
  test(`Fighter uses the reviewed clip for Revan on ${side}, freezes it while paused and completes once`, () => {
    const completed = [];
    const engine = fighter(side, (...args) => completed.push(args));
    const row = () => engine.getSnapshot().presentation.entries.find(entry => entry.side === side);
    assert.equal(engine.getSnapshot().phase, 'intro');
    assert.equal(row().script.sample.asset.sheet, reviewed.sheet);
    assert.equal(row().script.sample.asset.row, 1);
    const hp = ['player', 'cpu'].map(camp => engine.getActive(camp).currentHp);
    assert.equal(engine.triggerSideAction(side, 'super'), false);
    advance(engine, .35);
    const paused = engine.getSnapshot();
    engine.setPaused(true);
    advance(engine, 1);
    assert.deepEqual(engine.getSnapshot().presentation, paused.presentation);
    assert.equal(engine.timer, 99);
    assert.deepEqual(['player', 'cpu'].map(camp => engine.getActive(camp).currentHp), hp);
    engine.setPaused(false);
    toPhase(engine, 'countdown');
    assert.equal(completed.length, 0);
    engine.countdown = 0;
    const losing = side === 'player' ? 'cpu' : 'player';
    engine.getActive(losing).currentHp = 0;
    engine.endRound(side === 'player' ? 'victory' : 'defeat');
    toPhase(engine, 'victory');
    assert.equal(row().actorPhase, 'victory');
    assert.equal(row().script.sample.asset.sheet, reviewed.sheet);
    assert.equal(row().script.sample.asset.row, 0);
    assert.equal(completed.length, 0);
    toPhase(engine, 'outro');
    assert.equal(row().script.sample.asset.sheet, reviewed.sheet);
    const remaining = engine.presentation.remaining;
    engine.setPaused(true);
    advance(engine, 1);
    assert.equal(engine.presentation.remaining, remaining);
    engine.setPaused(false);
    advance(engine, 5);
    assert.equal(completed.length, 1);
    assert.equal(engine.finish('defeat'), false);
    advance(engine, 3);
    assert.equal(completed.length, 1);
    assert.equal(engine.getActive(losing).currentHp, 0);
    engine.dispose();
    assert.equal(engine.presentation, null);
    assert.deepEqual(engine.presentationQueue, []);
    assert.equal(engine.onComplete, null);
  });
}

test('leaving during the clip disposes the engine without completing a match', () => {
  const completed = [];
  const engine = fighter('player', result => completed.push(result));
  advance(engine, .25);
  engine.dispose();
  advance(engine, 20);
  assert.deepEqual(completed, []);
  assert.equal(engine.presentation, null);
  assert.deepEqual(engine.presentationQueue, []);
  assert.equal(engine.disposed, true);
});

test('the first round remains unrewarded and a living opponent may still exit after a timeout', () => {
  const completed = [];
  const engine = new EngineFighter(960, 540, [revan], [other], particles, noop,
    result => completed.push(result), { opponentControl: 'p2', roundsToWin: 2 });
  engine.countdown = 0;
  engine.endRound('victory');
  assert.equal(engine.finished, false);
  assert.equal(engine.getSnapshot().phase, 'roundResult');
  assert.equal(completed.length, 0);
  assert.deepEqual(engine.getSummary().rewards, { gold: 0, shards: 0, seasonXp: 0 });
  advance(engine, 2);
  engine.countdown = 0;
  engine.endRound('victory', true);
  toPhase(engine, 'outro');
  assert.ok(engine.getActive('cpu').currentHp > 0);
  assert.ok(engine.getSnapshot().presentation.entries.every(entry => entry.actorPhase === 'outro'));
  engine.dispose();
});

for (const side of ['player', 'cpu']) test(`Smash samples the same base16 for ${side} without changing collision positions`, () => {
  const engine = new EngineSmash(960, 540, [side === 'player' ? revan : other], { customRoster: [side === 'cpu' ? revan : other] }, particles, noop, noop,
    { universe: 'Star Wars', mode: 'Smash', forceBaseArena: true, disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const before = { x: actor.x, y: actor.y, currentHp: actor.currentHp };
  assert.equal(actor.state, 'intro');
  const view = engine.getMeleeVisualActor(actor);
  assert.equal(view.presentationPhase, 'intro');
  assert.equal(view.presentationFrame.row, 1);
  assert.equal(Math.sign(view.x - actor.x), -Math.sign(actor.facing));
  assert.deepEqual({ x: actor.x, y: actor.y, currentHp: actor.currentHp }, before);
  engine.advancePreMatchLock(500);
  const elapsed = actor.stateElapsed;
  const a = engine.getMeleeVisualActor(actor);
  const b = engine.getMeleeVisualActor(actor);
  assert.deepEqual(a.presentationFrame, b.presentationFrame);
  assert.equal(actor.stateElapsed, elapsed);
  engine.setPaused(true);
  for (let i = 0; i < 30; i++) engine.update();
  assert.equal(actor.stateElapsed, elapsed);
  engine.setPaused(false);
  engine.setMeleeOutcomeStates(side === 'player' ? 'victory' : 'defeat');
  const winner = engine.getMeleeVisualActor(actor);
  assert.equal(winner.presentationPhase, 'victory');
  assert.equal(winner.presentationFrame.row, 0);
  assert.equal(actor.state, 'victory');
  assert.equal(samplePresentationScript(actor.meleePresentation.presentationScript, 0).asset.sheet, reviewed.sheet);
  engine.tickMeleeOutcomeStates();
  assert.ok(actor.stateElapsed > 0);
  engine.dispose();
  assert.equal(engine.disposed, true);
  assert.equal(actor.action, null);
});
