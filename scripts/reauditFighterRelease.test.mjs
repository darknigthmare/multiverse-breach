// Release gate: real effects replace fragile source-string comparisons.
import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Fighter;
const engines = [];
const actor = id => ({ id, name: id, universe: 'QA', weaponType: 'rifle', stats: { hp: 200, atk: 18, def: 5, spd: 10 } });
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js')); });
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
function fixture(side) {
  const e = new Fighter(960, 540, ['p0', 'p1', 'p2', 'p3'].map(actor), ['c0', 'c1', 'c2', 'c3'].map(actor),
    { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  engines.push(e); e.countdown = 0;
  const a = e.getActive(side), b = e.getOpponent(side);
  a.x = 300; b.x = 364; a.facing = 1; b.facing = -1; return { e, a, b };
}
for (const side of ['player', 'cpu']) {
  test(`${side}: three-member roster starts with one active and tags the chosen slot`, () => {
    const { e, a } = fixture(side); const team = e.getTeam(side);
    assert.equal(team.fighters.length, 3); assert.equal(team.activeIndex, 0);
    assert.equal(e.getSnapshot()[side].fighters.filter(f => f.active).length, 1);
    assert.equal(e.requestTag(side, 2), true); assert.equal(e.getActive(side), team.fighters[2]);
    assert.notEqual(e.getActive(side), a); assert.equal(e.stats[side].tags, 1);
    assert.equal(e.requestTag(side, 1), false, 'tag cooldown must be enforced');
  });
  test(`${side}: three light commands build a combo and strike through the native dispatcher`, () => {
    const { e, a, b } = fixture(side); const damage = [];
    for (let i = 0; i < 3; i++) {
      const before = b.currentHp;
      assert.equal(e.tryAction(side, 'light'), true); assert.equal(a.comboStep, i + 1);
      e.updateActions(0.29); damage.push(before - b.currentHp); e.hitStop = 0;
    }
    assert.ok(damage[0] > 0 && damage[1] > damage[0] && damage[2] > damage[1]);
    assert.equal(e.stats[side].currentCombo, 3); assert.equal(e.stats[side].maxCombo, 3);
    e.updatePassive(1); assert.equal(a.comboWindow, 0); assert.equal(e.stats[side].currentCombo, 0);
  });
  test(`${side}: guard mitigates damage and exhausted guard breaks`, () => {
    const { e, a, b } = fixture(side); const hit = { type: 'light', base: 20, knockback: 10, guardDamage: 30 };
    const unguarded = e.applyHit(a, b, hit); e.hitStop = 0;
    b.currentHp = b.maxHp; b.guarding = true; b.guard = 20;
    const guarded = e.applyHit(a, b, hit);
    assert.ok(guarded > 0 && guarded < unguarded); assert.equal(b.guard, 0);
    assert.ok(b.guardBreak > 0); assert.equal(b.guarding, false);
  });
  test(`${side}: rupture needs 100 meter and costs it exactly once before impact`, () => {
    const { e, a, b } = fixture(side); a.meter = 99;
    assert.equal(e.tryAction(side, 'super'), false); assert.equal(a.meter, 99);
    a.meter = 100; assert.equal(e.tryAction(side, 'super'), true); assert.equal(a.meter, 0);
    assert.equal(e.tryAction(side, 'super'), false); const hp = b.currentHp;
    e.updateActions(0.46); assert.ok(b.currentHp < hp); const damaged = b.currentHp;
    e.updateActions(0.2); assert.equal(b.currentHp, damaged);
  });
  for (const crouching of [false, true]) test(`${side}: ranged projectile ${crouching ? 'passes over a crouched opponent' : 'hits a standing opponent'}`, () => {
    const { e, a, b } = fixture(side); b.x = 520; b.crouching = crouching; a.meter = 30;
    const hp = b.currentHp;
    assert.equal(e.tryAction(side, 'special'), true); assert.equal(a.meter, 0);
    e.updateActions(0.3); assert.equal(e.projectiles.length, 1); assert.equal(b.currentHp, hp);
    e.updateProjectiles(0.6);
    if (crouching) assert.equal(b.currentHp, hp); else assert.ok(b.currentHp < hp);
  });
}
