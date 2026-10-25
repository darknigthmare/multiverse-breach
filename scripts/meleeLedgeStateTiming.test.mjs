import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let vite, EngineSmash, ripley, runtime, sample;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ripley = (await vite.ssrLoadModule('/src/game/heroes.js')).HEROES_DB.find(hero => hero.id === 'ripley');
  runtime = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js');
  ({ getHeroMeleeAnimationFrame: sample } = await vite.ssrLoadModule('/src/game/spriteAssets.js'));
});
after(async () => { await vite?.close(); });

const prepare = (camp = 'player', side = 'left', action = 'drop') => {
  const engine = new EngineSmash(960, 900, [ripley], { customRoster: [ripley], monsters: [ripley], bosses: [] },
    { add() {} }, () => {}, () => {}, { universe: 'Alien', mode: 'Smash', difficulty: 'Training',
      skipPreMatchInTraining: true, disableItems: true, disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  const actor = camp === 'player' ? engine.heroes[0] : engine.enemies[0];
  const platform = { x1: 300, x2: 650, y: 320 };
  engine.platforms = [platform];
  Object.assign(actor, { x: side === 'left' ? 292 : 658, y: 346, vx: 0, vy: 1,
    currentHp: 100, maxHp: 100, state: 'fall', stateElapsed: .3, stateTimer: 0,
    action: null, meleePresentation: null, ledge: null, ledgeRegrabTimer: 0, ledgeActionTimer: 0 });
  engine.applyPhysics(actor);
  assert.equal(actor.state, 'ledgeCatch');
  for (let i = 0; i < 10; i++) runtime.tickMeleeCombatActor(actor, 1 / 60);
  assert.equal(actor.state, 'ledgeHang');
  assert.equal(runtime.performMeleeLedgeAction(actor, action), true);
  return { engine, actor, platform };
};

for (const camp of ['player', 'opponent']) for (const side of ['left', 'right']) for (const action of ['drop', 'jump']) {
  test(`${camp}/${side}/${action}: natural four-pose exit keeps gravity and then resumes air locomotion`, () => {
    const { engine, actor } = prepare(camp, side, action);
    const state = action === 'drop' ? 'ledgeDrop' : 'ledgeJump';
    const columns = new Set(), startY = actor.y, startVy = actor.vy;
    for (let i = 0; i < 30; i++) {
      assert.equal(actor.state, state);
      columns.add(sample(actor, actor.stateElapsed * 1000).col);
      assert.equal(runtime.isMeleeMovementLocked(actor), false);
      runtime.tickMeleeCombatActor(actor, 1 / 60);
      actor.vy += engine.gravity;
      engine.applyPhysics(actor);
      assert.equal(actor.ledge, null, 'existing cooldown prevents a regrab');
    }
    assert.deepEqual([...columns], [0, 1, 2, 3]);
    assert.notEqual(actor.y, startY);
    assert.ok(actor.vy > startVy, 'gravity must advance through all poses');
    runtime.tickMeleeCombatActor(actor, 1 / 60);
    actor.vy += engine.gravity; engine.applyPhysics(actor);
    assert.ok(['jumpRise', 'jumpApex', 'fall'].includes(actor.state));
  });
}

test('ledge exits allow steering, deliberate air jumps and damage without granting a guard', () => {
  for (const camp of ['player', 'opponent']) {
    const { engine, actor } = prepare(camp, 'left', 'jump');
    engine.updateLocalVersusMovement(actor, null, { left: true }, camp === 'player' ? 'p1' : 'p2');
    assert.ok(actor.vx < 0); assert.equal(actor.facing, -1); assert.equal(actor.state, 'ledgeJump');
    const attacker = camp === 'player' ? engine.enemies[0] : engine.heroes[0];
    const hp = actor.currentHp, damage = engine.applyDamage(attacker, actor, 12, 8);
    assert.ok(damage > 0); assert.equal(actor.currentHp, hp - damage);
    assert.ok(['hit', 'hitStun'].includes(actor.state), 'real damage immediately interrupts the exit');
    const jump = prepare(camp, 'left', 'jump');
    jump.engine.updateLocalVersusMovement(jump.actor, null, { jump: true }, camp === 'player' ? 'p1' : 'p2');
    assert.equal(jump.actor.state, 'jumpStart'); assert.equal(jump.actor.airJumps, 0);
    actor.state = 'hitStun'; actor.stateElapsed = 0;
    engine.applyPhysics(actor); assert.equal(actor.state, 'hitStun');
    assert.equal(runtime.absorbMeleeGuardHit(actor, { damage: 10 }).guarded, false);
  }
});

test('landing and a legal new ledge catch interrupt the visual interval immediately', () => {
  const { engine, actor, platform } = prepare('player', 'left', 'drop');
  Object.assign(actor, { x: 400, y: 319, vy: 2 });
  engine.applyPhysics(actor);
  assert.equal(actor.state, 'land'); assert.equal(actor.y, platform.y); assert.equal(actor.vy, 0);
  Object.assign(actor, { state: 'ledgeDrop', stateElapsed: .1, x: 292, y: 346, vx: 0, vy: 1, ledgeRegrabTimer: 0 });
  engine.applyPhysics(actor);
  assert.equal(actor.state, 'ledgeCatch'); assert.equal(actor.ledge.platform, platform);
});

test('an inactive local companion keeps the exit poses while its physical update continues', () => {
  const { engine, actor } = prepare('opponent', 'right', 'drop');
  actor.isLeader = false;
  const columns = new Set(), startY = actor.y;
  for (let i = 0; i < 29; i++) {
    columns.add(sample(actor, actor.stateElapsed * 1000).col);
    engine.updateLocalVersusActor(actor);
    assert.equal(actor.state, 'ledgeDrop');
  }
  assert.deepEqual([...columns], [0, 1, 2, 3]); assert.ok(actor.y > startY);
});
