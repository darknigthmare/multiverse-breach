import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Fighter;
const engines = [];
const actor = id => ({ id, name: id, universe: 'Nexus de Convergence', stats: { hp: 200, atk: 18, def: 5, spd: 10 } });
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
function fixture(side) {
  const outcomes = [];
  const e = new Fighter(900, 500, ['p0', 'p1', 'p2'].map(actor), ['c0', 'c1', 'c2'].map(actor),
    { add() {} }, () => {}, (...args) => outcomes.push(args), { opponentControl: 'p2' });
  engines.push(e); e.countdown = 0;
  const [active, stale, reserve] = e.getTeam(side).fighters;
  e.applyHit(e.getOpponent(side), active, { type: 'super', base: 10000, knockback: 0, guardDamage: 0 });
  assert.equal(active.currentHp, 0); e.hitStop = 0;
  return { e, active, stale, reserve, outcomes };
}
for (const side of ['player', 'cpu']) {
  test(`${side}: forced replacement skips a dead reserve even with stale positive HP`, () => {
    const { e, stale, reserve } = fixture(side);
    stale.state = 'dead'; stale.currentHp = 10;
    for (let i = 0; i < 65; i++) e.update(1 / 60);
    assert.equal(e.getActive(side), reserve); assert.equal(e.finished, false);
  });
  test(`${side}: team with no living reserve finishes instead of waiting for the timer`, () => {
    const { e, stale, reserve, outcomes } = fixture(side);
    for (const u of [stale, reserve]) { u.state = 'dead'; u.currentHp = 10; }
    for (let i = 0; i < 140; i++) e.update(1 / 60);
    assert.equal(e.finished, true); assert.equal(outcomes.length, 1);
    assert.equal(outcomes[0][0], side === 'player' ? 'defeat' : 'victory');
  });
  test(`${side}: terminal completion stops resolving the opposite side in the same tick`, () => {
    const { e, stale, reserve } = fixture(side);
    stale.currentHp = 0; reserve.currentHp = 0;
    const otherSide = side === 'player' ? 'cpu' : 'player';
    const other = e.getActive(otherSide);
    Object.assign(other, { currentHp: 0, state: 'dead', koDelay: 0.001, vx: 50, vy: 30 });
    const victim = e.getActive(side); victim.koDelay = 0.001;
    e.resolveKnockouts(1 / 60);
    const position = { x: other.x, y: other.y, vx: other.vx, vy: other.vy, delay: other.koDelay };
    e.resolveKnockouts(1 / 60);
    assert.deepEqual({ x: other.x, y: other.y, vx: other.vx, vy: other.vy, delay: other.koDelay }, position);
  });
}
for (const side of ['player', 'cpu']) {
  test(`${side}: expired KO recovery works with the actual roster slot, not actor.index`, () => {
    const { e, active, stale, reserve } = fixture(side);
    stale.currentHp = 0; reserve.index = 99; active.koDelay = 0;
    e.resolveKnockouts(1 / 60); assert.equal(e.getActive(side), reserve);
    assert.equal(e.stats[side].tags, 0);
    const snapshot = e.getSnapshot()[side];
    assert.equal(snapshot.fighters[2].active, true); assert.equal(snapshot.fighters[0].active, false);
  });
  test(`${side}: passive regeneration does not revive a dead reserve with stale HP`, () => {
    const { e, stale } = fixture(side);
    stale.state = 'dead'; stale.currentHp = 10;
    e.updatePassive(1); assert.equal(stale.state, 'dead'); assert.equal(stale.currentHp, 10);
  });
  test(`${side}: a stale corpse supplies neither health advantage nor a living roster entry`, () => {
    const { e, stale, reserve } = fixture(side);
    stale.state = 'dead'; stale.currentHp = stale.maxHp;
    assert.equal(e.getTeamHealthRatio(side), reserve.currentHp / (reserve.maxHp * 3));
    assert.equal(e.getSnapshot()[side].fighters[1].ko, true);
    if (side === 'player') assert.equal(e.getSummary().survivingFighters, 1);
  });
  for (const reason of ['pause', 'impact', 'countdown', 'finished', 'disposed']) test(`${side}: direct knockout updates respect ${reason}`, () => {
    const { e, active } = fixture(side);
    active.koDelay = 0.005;
    if (reason === 'pause') e.setPaused(true);
    if (reason === 'impact') e.hitStop = 0.1;
    if (reason === 'countdown') e.countdown = 1;
    if (reason === 'finished') e.finish('victory');
    if (reason === 'disposed') e.dispose();
    const before = JSON.stringify([e.teams, e.stats, e.result]);
    e.resolveKnockouts(1 / 60);
    assert.equal(JSON.stringify([e.teams, e.stats, e.result]), before);
  });
}
