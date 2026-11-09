import test from 'node:test';
import assert from 'node:assert/strict';
import { createSignatureSpiritSwarm, SPIRIT_RULES } from '../src/game/signatureSpiritSwarm.js';

const unit = (id, x = 0, y = 200) => ({ id, currentHp: 10000, state: 'idle', x, y, special: { name: 'Wraithverge' } });
const definition = { key: 'parias', hits: 4, summonAgent: 'wraithverge-spirit', color: '#abc' };
function setup(mode = 'Smash', count = 1) {
  const owner = unit('parias'), targets = Array.from({ length: count }, (_, i) => unit(`target${i}`, 200 + i * 20));
  const hits = [], e = { heroes: [owner], enemies: targets, paused: false, gameOver: false, disposed: false,
    applyDamage(a, b, damage, kb) { hits.push({ a, b, damage, kb }); b.currentHp = Math.max(0, b.currentHp - damage); },
    playSfx() {} };
  const sideOf = a => e.heroes.includes(a) ? 'player' : e.enemies.includes(a) ? 'enemy' : null;
  const enemiesOf = a => sideOf(a) === 'player' ? e.enemies : sideOf(a) === 'enemy' ? e.heroes : [];
  const action = owner.special;
  const manager = createSignatureSpiritSwarm(e, { mode, sideOf, enemiesOf,
    validAction: (a, move, key) => a.special === move && (a !== owner || move === action) && key === 'parias' });
  return { e, owner, targets, hits, manager };
}
const tick = (s, n = 1) => { for (let i = 0; i < n; i++) s.manager.advance(); };
const launch = (s, list = s.targets) => s.manager.launch(s.owner, list, definition, 400);

for (const mode of ['RPG', 'Smash']) {
  test(`${mode}: four spirits are distinct, cost-neutral entities outside the combat roster`, () => {
    const s = setup(mode); assert.equal(launch(s), true); const states = s.manager.snapshot();
    assert.equal(states.length, 4); assert.equal(new Set(states.map(x => x.serial)).size, 4);
    assert.equal(new Set(states.map(x => x.heading)).size, 4); assert.equal(s.e.heroes.length, 1); assert.equal(s.e.enemies.length, 1);
    assert.equal(s.hits.length, 0); assert.equal(s.owner.state, 'idle');
    assert.equal(launch(s), false); assert.equal(s.manager.has(s.owner), true);
  });
  test(`${mode}: release does not deal damage; four contacts share exactly one budget`, () => {
    const s = setup(mode); launch(s); tick(s, SPIRIT_RULES.emergence);
    assert.equal(s.hits.length, 0); tick(s, 100);
    assert.equal(s.hits.length, 4); assert.equal(s.hits.reduce((sum, h) => sum + h.damage, 0), 400);
    assert.equal(s.targets[0].currentHp, 9600); assert.equal(s.manager.snapshot().length, 0);
    tick(s, 300); assert.equal(s.hits.length, 4);
  });
  test(`${mode}: independent target slots retain their initial cyclic distribution`, () => {
    const s = setup(mode, 3); launch(s); tick(s, 150);
    assert.deepEqual(s.targets.map(t => s.hits.filter(h => h.b === t).length), [2, 1, 1]);
  });
  test(`${mode}: steering follows a moving target instead of applying a timed hit`, () => {
    const s = setup(mode); launch(s); tick(s, 8); const old = s.manager.snapshot();
    s.targets[0].y += 80; tick(s); const next = s.manager.snapshot();
    assert.ok(next.some((x, i) => x.heading !== old[i].heading));
    for (const x of next) assert.ok(Math.abs(x.heading - old.find(y => y.serial === x.serial).heading) <= SPIRIT_RULES.turn + 1e-10);
    tick(s, 150); assert.equal(s.hits.length, 4);
  });
  test(`${mode}: pause, targeting wait and match lock stop entity age and movement`, () => {
    for (const kind of ['paused', 'isTargetingPaused', 'isMatchInputLocked']) {
      const s = setup(mode); launch(s); tick(s, 10); const before = s.manager.snapshot();
      s.e[kind] = kind === 'paused' ? true : () => true; tick(s, 100);
      assert.deepEqual(s.manager.snapshot(), before); assert.equal(s.hits.length, 0);
      s.e[kind] = kind === 'paused' ? false : () => false; tick(s);
      assert.equal(s.manager.snapshot()[0].age, before[0].age + 1);
    }
  });
  test(`${mode}: spirits pass through a solid platform rather than becoming solid missiles`, () => {
    const s = setup(mode); s.owner.y = 100; s.targets[0].y = 300;
    s.e.platforms = [{ x1: -100, x2: 1000, y: 200, passThrough: false }];
    launch(s); tick(s, 150); assert.equal(s.hits.length, 4);
  });
  test(`${mode}: the native damage dispatcher, including immunity, remains authoritative`, () => {
    const s = setup(mode); const hp = s.targets[0].currentHp; s.e.applyDamage = (...args) => s.hits.push(args);
    launch(s); tick(s, 150); assert.equal(s.hits.length, 4); assert.equal(s.targets[0].currentHp, hp);
  });
  test(`${mode}: a lost slot is never retargeted to a replacement or another survivor`, () => {
    const s = setup(mode, 2); launch(s); s.manager.onKnockout(s.targets[0]);
    s.targets[0].currentHp = 10000; s.e.enemies.push(unit('replacement', 100)); tick(s, 150);
    assert.equal(s.hits.length, 2); assert.ok(s.hits.every(h => h.b === s.targets[1]));
  });
  test(`${mode}: immediate owner KO and revival cannot restore an old swarm`, () => {
    const s = setup(mode); launch(s); s.owner.currentHp = 0; s.manager.onKnockout(s.owner);
    s.owner.currentHp = 10000; tick(s, 200); assert.equal(s.hits.length, 0); assert.equal(s.manager.has(s.owner), false);
  });
}
for (const property of ['currentHp', 'x', 'y']) for (const value of [NaN, Infinity, '200']) {
  test(`invalid ${property} ${String(value)} is rejected before launch`, () => {
    const s = setup(); s.owner[property] = value; assert.equal(launch(s), false); assert.equal(s.manager.snapshot().length, 0);
  });
}
for (const value of [NaN, Infinity, -1, 0, '400']) test(`invalid damage ${String(value)} is rejected`, () => {
  const s = setup(); assert.equal(s.manager.launch(s.owner, s.targets, definition, value), false);
});
test('invalid group inputs, duplicate targets, allies and noncombatants are rejected atomically', () => {
  for (const bad of [null, [], [unit('unknown')]]) { const s = setup(); assert.equal(launch(s, bad), false); }
  const s = setup(); assert.equal(launch(s, [s.targets[0], s.targets[0]]), false); assert.equal(launch(s, [s.owner]), false);
  s.targets[0].nonCombat = true; assert.equal(launch(s), false); assert.equal(s.manager.has(s.owner), false);
});
for (const change of ['removed', 'camp', 'action', 'dead', 'noncombat', 'position']) test(`owner ${change} clears its entities`, () => {
  const s = setup(); launch(s);
  if (change === 'removed') s.e.heroes = [];
  if (change === 'camp') { s.e.heroes = []; s.e.enemies.push(s.owner); }
  if (change === 'action') s.owner.special = { name: 'Other' };
  if (change === 'dead') s.owner.state = 'dead';
  if (change === 'noncombat') s.owner.nonCombat = true;
  if (change === 'position') s.owner.x = NaN;
  tick(s, 200); assert.equal(s.manager.snapshot().length, 0); assert.equal(s.hits.length, 0);
});
test('a nonlethal hit after release does not erase an independently flying summon', () => {
  const s = setup(); launch(s); s.owner.state = 'hit'; tick(s, 100); assert.equal(s.hits.length, 4);
});
test('a target without valid position is removed without contaminating other spirits', () => {
  const s = setup('Smash', 2); launch(s); s.targets[0].x = NaN; tick(s, 150);
  assert.equal(s.hits.length, 2); assert.equal(s.manager.snapshot().length, 0);
});
test('all spirits expire if their confirmed target outruns them', () => {
  const s = setup(); launch(s);
  for (let i = 0; i <= SPIRIT_RULES.lifetime; i++) { s.targets[0].x += 30; tick(s); }
  assert.equal(s.manager.snapshot().length, 0); assert.equal(s.hits.length, 0);
});
test('a target crossing the entire spirit segment cannot tunnel through the swept collision', () => {
  const s = setup(); s.targets[0].x = 200; launch(s); tick(s, 10); s.targets[0].x = -200; tick(s);
  assert.ok(s.hits.length > 0); assert.ok(s.hits.length <= 4);
});
test('recursive KO during first contact cancels the remaining pending contacts', () => {
  const s = setup(); s.e.applyDamage = (a, b, damage) => {
    s.hits.push({ a, b, damage }); s.manager.onKnockout(a); a.currentHp = 10000;
  };
  launch(s); tick(s, 150); assert.equal(s.hits.length, 1); assert.equal(s.manager.has(s.owner), false);
});
test('recursive target KO and revival cannot consume the remaining slots', () => {
  const s = setup(); s.e.applyDamage = (a, b, damage) => {
    s.hits.push({ a, b, damage }); s.manager.onKnockout(b); b.currentHp = 10000;
  };
  launch(s); tick(s, 150); assert.equal(s.hits.length, 1);
});
test('game over and disposal purge all groups and prevent restart', () => {
  for (const kind of ['gameOver', 'disposed', 'manager']) {
    const s = setup(); launch(s);
    if (kind === 'manager') s.manager.dispose(); else s.e[kind] = true;
    tick(s); assert.equal(s.manager.snapshot().length, 0); assert.equal(launch(s), false);
  }
});
test('group cap cannot be exceeded and one expired group frees exactly one slot', () => {
  const s = setup();
  const owners = Array.from({ length: SPIRIT_RULES.maxGroups + 1 }, (_, i) => unit(`owner-${i}`));
  s.e.heroes.push(...owners);
  for (let i = 0; i < owners.length; i++) assert.equal(s.manager.launch(owners[i], s.targets, definition, 400), i < SPIRIT_RULES.maxGroups);
  assert.equal(s.manager.snapshot().length, 64); s.manager.onKnockout(owners[0]);
  assert.equal(s.manager.launch(owners.at(-1), s.targets, definition, 400), true); assert.equal(s.manager.snapshot().length, 64);
});
test('snapshot callers and renderers cannot mutate the simulation clock', () => {
  const s = setup(); launch(s); tick(s, 8); const before = s.manager.snapshot();
  const snapshot = s.manager.snapshot(); snapshot[0].x = 99999; snapshot.splice(1);
  const calls = [], ctx = new Proxy({}, { get: (_, key) => (...args) => calls.push([key, ...args]), set: () => true });
  s.manager.draw(ctx); s.manager.draw(ctx, { reducedMotion: true });
  assert.deepEqual(s.manager.snapshot(), before); assert.ok(calls.some(([key]) => key === 'restore'));
});

for (const mode of ['RPG', 'Smash']) test(`${mode}: close moving targets cannot trap a spirit in an endless orbit`, () => {
  const s = setup(mode); s.targets[0].x = 35;
  const damage = s.e.applyDamage;
  s.e.applyDamage = (...args) => { damage(...args); s.targets[0].y += 10; };
  launch(s); tick(s, SPIRIT_RULES.lifetime + 1);
  assert.equal(s.hits.length, 4, 'finite displacement after contact must remain interceptable');
  assert.equal(s.manager.snapshot().length, 0);
});
