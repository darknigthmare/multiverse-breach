import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Fighter, heroes;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
const ordinary = id => ({ id, name: id, universe: 'QA', stats: { hp: 200, atk: 18, def: 5, spd: 10 } });
function fixture(side = 'player', custom = {}) {
  const source = { ...structuredClone(heroes.find(h => h.id === 'aerith_ff7')), ...custom };
  const team = [source, ordinary('patient'), ordinary('third')];
  const other = [ordinary('foe')];
  const effects = [];
  const e = new Fighter(960, 540, side === 'player' ? team : other, side === 'cpu' ? team : other,
    { add: (...args) => effects.push(args) }, () => {}, () => {}, { opponentControl: 'p2' });
  engines.push(e); e.countdown = 0;
  const caster = e.getActive(side), patient = e.getTeam(side).fighters[1], foe = e.getOpponent(side);
  caster.meter = 100; caster.x = 350; foe.x = 415;
  return { e, caster, patient, foe, effects, source, side };
}
for (const side of ['player', 'cpu']) {
  test(`${side}: Healing Wind heals living teammates rather than damaging an opponent`, () => {
    const { e, caster, patient, foe } = fixture(side);
    caster.currentHp = caster.maxHp - 80; patient.currentHp = patient.maxHp - 120;
    const enemyHp = foe.currentHp;
    assert.equal(e.tryAction(side, 'super'), true); assert.equal(caster.meter, 0);
    e.updateActions(0.46);
    assert.equal(foe.currentHp, enemyHp);
    assert.equal(caster.currentHp, caster.maxHp); assert.equal(patient.currentHp, patient.maxHp);
    assert.equal(e.stats[side].damage, 0); assert.equal(caster.meter, 0);
  });
  test(`${side}: a full team cannot waste its limit on an empty heal`, () => {
    const { e, caster } = fixture(side);
    assert.equal(e.tryAction(side, 'super'), false); assert.equal(caster.meter, 100);
    assert.equal(caster.action, null);
  });
}
for (const side of ['player', 'cpu']) {
  test(`${side}: one delayed effect, a single meter payment, and no damage-derived rewards`, () => {
    const { e, caster, patient, foe, source } = fixture(side);
    const catalogBefore = JSON.stringify(source);
    patient.currentHp -= 200;
    const before = JSON.stringify(e.stats);
    assert.equal(e.canUseSuper(side), true); assert.equal(e.getSnapshot()[side].superReady, true);
    assert.equal(e.getSnapshot()[side].superName, 'Healing Wind');
    e.tryAction(side, 'super'); const hp = patient.currentHp;
    assert.equal(e.getSnapshot()[side].superReady, false);
    assert.doesNotThrow(() => JSON.stringify(e.teams), 'pending actions must remain serializable');
    e.updateActions(0.44); assert.equal(patient.currentHp, hp);
    assert.equal(e.tryAction(side, 'super'), false);
    e.updateActions(0.02); const restored = patient.currentHp;
    assert.equal(restored - hp, Math.round(patient.maxHp * 0.5));
    e.updateActions(0.02); assert.equal(patient.currentHp, restored);
    assert.equal(caster.meter, 0); assert.equal(foe.meter, 0); assert.equal(JSON.stringify(e.stats), before);
    assert.equal(JSON.stringify(source), catalogBefore);
  });
  test(`${side}: radiation cap, other statuses and dead teammates stay intact`, () => {
    const { e, caster, patient } = fixture(side);
    const third = e.getTeam(side).fighters[2];
    patient.statusEffects = { radiated: 100, poisoned: 30 }; patient.currentHp = 1;
    third.currentHp = 0; third.state = 'dead'; caster.currentHp -= 20;
    e.tryAction(side, 'super'); e.updateActions(0.46);
    assert.equal(patient.currentHp, patient.maxHp * 0.5);
    assert.deepEqual(patient.statusEffects, { radiated: 100, poisoned: 30 });
    assert.equal(third.currentHp, 0); assert.equal(third.state, 'dead');
  });
  test(`${side}: recipient injury and recovery during windup use current recoverable HP`, () => {
    const { e, patient } = fixture(side); const third = e.getTeam(side).fighters[2];
    patient.currentHp -= 20; e.tryAction(side, 'super');
    patient.currentHp = patient.maxHp; third.currentHp -= 30; e.updateActions(0.46);
    assert.equal(patient.currentHp, patient.maxHp); assert.equal(third.currentHp, third.maxHp);
  });
  test(`${side}: dead-at-commit or life-invalidated recipients do not inherit a queued heal`, () => {
    const { e, caster, patient } = fixture(side); const third = e.getTeam(side).fighters[2];
    caster.currentHp -= 30; patient.currentHp = 0; patient.state = 'dead';
    e.tryAction(side, 'super');
    patient.currentHp = 10; patient.state = 'idle';
    e.invalidateFighterLife(third); third.currentHp = 10; third.state = 'idle';
    e.updateActions(0.46); assert.equal(patient.currentHp, 10); assert.equal(third.currentHp, 10);
    assert.equal(caster.currentHp, caster.maxHp);
  });
  test(`${side}: removed, substituted and side-switched recipients are never silently replaced`, () => {
    const { e, caster, patient } = fixture(side); const third = e.getTeam(side).fighters[2];
    caster.currentHp -= 30; patient.currentHp = 10; third.currentHp = 10;
    e.tryAction(side, 'super');
    const replacement = { ...patient, id: 'replacement', sourceId: 'replacement' };
    e.getTeam(side).fighters[1] = replacement; third.side = side === 'player' ? 'cpu' : 'player';
    e.updateActions(0.46); assert.equal(patient.currentHp, 10); assert.equal(replacement.currentHp, 10); assert.equal(third.currentHp, 10);
  });
  test(`${side}: interrupted preparation or caster KO cannot heal afterwards`, () => {
    for (const lethal of [false, true]) {
      const { e, caster, patient, foe } = fixture(side); patient.currentHp = 10;
      e.tryAction(side, 'super'); const token = caster.action.healing;
      e.applyHit(foe, caster, { type: 'heavy', base: lethal ? 10000 : 5, knockback: 0, guardDamage: 0 });
      if (lethal) { caster.currentHp = caster.maxHp; caster.state = 'idle'; }
      e.updateActions(1); assert.equal(patient.currentHp, 10); assert.equal(caster.action, null);
      if (lethal) assert.deepEqual(e.fighterHealing.apply(token), []);
    }
  });
  for (const change of ['identity', 'universe', 'action', 'in-place-ratio', 'mode-profile']) test(`${side}: ${change} change cancels the old healing effect`, () => {
    const { e, caster, patient } = fixture(side); patient.currentHp = 10;
    e.tryAction(side, 'super');
    if (change === 'identity') caster.sourceId = 'someone-else';
    if (change === 'universe') caster.sourceUniverse = 'Other';
    if (change === 'action') caster.special = { ...caster.special };
    if (change === 'in-place-ratio') caster.special.healRatio = 1;
    if (change === 'mode-profile') caster.special.fighterProfile = { effect: 'heal' };
    e.updateActions(0.46); assert.equal(patient.currentHp, 10);
  });
  test(`${side}: pause freezes preparation; completion and disposal discard it`, () => {
    const { e, patient, caster } = fixture(side); patient.currentHp = 10;
    e.tryAction(side, 'super'); e.updateActions(0.2); const elapsed = caster.action.elapsed;
    e.setPaused(true); e.updateActions(1); assert.equal(caster.action.elapsed, elapsed); assert.equal(patient.currentHp, 10);
    e.setPaused(false); e.updateActions(0.26); assert.ok(patient.currentHp > 10);
    for (const end of ['finish', 'dispose']) {
      const f = fixture(side); f.patient.currentHp = 10; f.e.tryAction(side, 'super');
      const token = f.caster.action.healing;
      if (end === 'finish') f.e.finish('victory'); else f.e.dispose();
      assert.deepEqual(f.e.fighterHealing.apply(token), []); f.e.updateActions(1); assert.equal(f.patient.currentHp, 10);
    }
  });
  test(`${side}: malformed or absent healing opportunities are refused without spending`, () => {
    for (const invalid of [NaN, Infinity, '10', 0]) {
      const { e, caster, patient } = fixture(side); patient.currentHp = invalid;
      assert.equal(e.canUseSuper(side), false); assert.equal(e.tryAction(side, 'super'), false); assert.equal(caster.meter, 100);
    }
  });
}
test('unknown incarnations, noncombatants and Fighter overrides never gain Healing Wind', () => {
  for (const patch of [{ universe: 'Other' }, { id: 'other' }, { nonCombat: true },
    { special: { name: 'Custom technique', dmg: 1 } }, { fighterAttacks: { super: { effect: 'heal' } } }]) {
    const { e, caster } = fixture('player', patch);
    assert.equal(e.fighterHealing.available(caster), false);
    assert.notEqual(caster.special?.sourceSignatureKey, 'aerith_ff7');
  }
});

for (const wounded of [false, true]) test(`CPU chooses ${wounded ? 'a useful heal' : 'a regular attack instead of an unavailable heal'}`, () => {
  const { e, caster, patient } = fixture('cpu');
  if (wounded) patient.currentHp -= 50;
  e.aiThink = 0; const random = Math.random;
  try { Math.random = () => 0; e.updateAi(1 / 60); } finally { Math.random = random; }
  assert.equal(caster.action?.type, wounded ? 'super' : 'light');
  assert.equal(caster.meter, wounded ? 0 : 100);
});
for (const side of ['player', 'cpu']) test(`${side}: a detached token from an interrupted action cannot apply healing`, () => {
  const { e, caster, patient, foe } = fixture(side); patient.currentHp = 10;
  e.tryAction(side, 'super'); const token = caster.action.healing;
  e.applyHit(foe, caster, { type: 'light', base: 5, knockback: 0, guardDamage: 0 });
  assert.equal(caster.action, null);
  assert.deepEqual(e.fighterHealing.apply(token), []);
  assert.equal(patient.currentHp, 10);
});
for (const side of ['player', 'cpu']) test(`${side}: fractional recovered HP keeps exact mechanics with rounded combat feedback`, () => {
  const { e, caster, effects } = fixture(side); caster.currentHp = caster.maxHp - 39.35065;
  e.tryAction(side, 'super'); e.updateActions(0.46);
  assert.equal(caster.currentHp, caster.maxHp);
  const labels = effects.filter(p => p[7] === 'text').map(p => p[8]);
  assert.ok(labels.includes('+39'));
  assert.ok(labels.every(value => !String(value).startsWith('+39.350')));
});
