import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Rpg, install;
const engines = [];
const actor = id => ({ id, name: id, universe: 'QA', stats: { hp: 200, atk: 30, def: 0, spd: 1 },
  hp: 200, atk: 30, def: 0, spd: 1,
  simple: { name: 'QA shot', type: 'bullet', dmg: 1 },
  secondary: { name: 'QA heal', type: 'heal', dmg: 1, cd: 3 },
  special: { name: 'QA group heal', type: 'heal', healRatio: 0.5, dmg: 0 },
  defense: { name: 'QA guard', type: 'shield', reduce: 0.4, dur: 1 } });
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg: Rpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
function fixture(side = 'player', directed = true) {
  const roster = ['e0', 'e1', 'e2'].map(actor);
  const e = new Rpg(760, 420, ['p0', 'p1', 'p2'].map(actor), { customRoster: roster, monsters: roster, bosses: [] },
    { add() {} }, () => {}, () => {}, { universe: 'QA', mode: 'RPG', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e);
  if (directed) install(e, { mode: 'RPG' });
  const allies = side === 'enemy' ? e.enemies : e.heroes;
  const foes = side === 'enemy' ? e.heroes : e.enemies;
  const [caster, patient, third] = allies;
  Object.assign(caster, { atb: 100, specialCharge: 100, cooldown: 0 });
  patient.currentHp = 50;
  return { e, caster, patient, third, allies, foes, side };
}
function cast(f, type = 'secondary', target = f.patient) {
  assert.equal(f.e.executeRpgAction(f.e.getActionContext(f.caster, type, f.side), [target.battleId]), true);
}
const settle = e => { for (let i = 0; i < 24; i++) e.advanceActions(); };
for (const side of ['player', 'enemy']) {
  test(`${side}: committed heal cannot follow a patient through KO and immediate revival`, () => {
    const f = fixture(side); cast(f);
    f.e.applyDamage(f.foes[0], f.patient, 10000);
    assert.equal(f.patient.currentHp, 0);
    Object.assign(f.patient, { currentHp: 50, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(f.patient.currentHp, 50);
  });
  for (const edit of ['patient-side', 'caster-side', 'patient-identity', 'caster-identity', 'action-object', 'power', 'cleanse']) {
    test(`${side}: deferred heal rejects changed ${edit}`, () => {
      const f = fixture(side);
      f.caster.secondary.cleanses = ['infected'];
      f.patient.statusEffects = { infected: 100, radiated: 100, glitched: 100 };
      cast(f);
      if (edit === 'patient-side') { f.allies.splice(f.allies.indexOf(f.patient), 1); f.foes.push(f.patient); }
      if (edit === 'caster-side') { f.allies.splice(f.allies.indexOf(f.caster), 1); f.foes.push(f.caster); }
      if (edit === 'patient-identity') f.patient.sourceId = 'different-unit';
      if (edit === 'caster-identity') f.caster.sourceUniverse = 'different-universe';
      if (edit === 'action-object') f.caster.secondary = { ...f.caster.secondary };
      if (edit === 'power') f.caster.secondary.dmg = 3;
      if (edit === 'cleanse') f.caster.secondary.cleanses.push('radiated');
      settle(f.e);
      assert.equal(f.patient.currentHp, 50);
      assert.equal(f.patient.statusEffects.infected, 100);
      assert.equal(f.patient.statusEffects.radiated, 100);
      assert.equal(f.caster.atb, 0, 'a committed action is not refunded');
      assert.equal(f.caster.actionPending, false);
      assert.equal(f.e.enemyActionLock, false);
    });
  }
  for (const value of [NaN, Infinity, '100']) test(`${side}: invalid special meter ${String(value)} cannot start`, () => {
    const f = fixture(side); f.caster.specialCharge = value;
    assert.equal(f.e.canUseAction(f.caster, 'special', side), false);
    assert.equal(f.e.executeRpgAction(f.e.getActionContext(f.caster, 'special', side), [f.patient.battleId]), false);
    assert.equal(f.caster.atb, 100); assert.ok(Object.is(f.caster.specialCharge, value));
  });
  for (const value of [NaN, -Infinity, '0']) test(`${side}: invalid cooldown ${String(value)} cannot start`, () => {
    const f = fixture(side); f.caster.cooldown = value;
    assert.equal(f.e.canUseAction(f.caster, 'secondary', side), false);
    assert.equal(f.caster.atb, 100); assert.ok(Object.is(f.caster.cooldown, value));
  });
  test(`${side}: unmodified heal resolves once and keeps ordinary costs`, () => {
    const f = fixture(side); cast(f);
    assert.equal(f.caster.atb, 0); assert.equal(f.caster.cooldown, 180);
    settle(f.e); assert.equal(f.patient.currentHp, 80); settle(f.e); assert.equal(f.patient.currentHp, 80);
    assert.equal(f.caster.actionPending, false); assert.equal(f.e.enemyActionLock, false);
  });
}
for (const side of ['player', 'enemy']) {
  test(`${side}: an ordinary projectile cannot hit a new life of its confirmed target`, () => {
    const f = fixture(side), target = f.foes[0]; cast(f, 'simple', target);
    f.e.applyDamage(f.third, target, 10000); assert.equal(target.currentHp, 0);
    Object.assign(target, { currentHp: 80, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(target.currentHp, 80);
  });
  test(`${side}: a group heal skips a changed life without cancelling other confirmed allies`, () => {
    const f = fixture(side); f.third.currentHp = 20; cast(f, 'special');
    f.e.applyDamage(f.foes[0], f.patient, 10000);
    Object.assign(f.patient, { currentHp: 50, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(f.patient.currentHp, 50); assert.equal(f.third.currentHp, 120);
    assert.equal(f.caster.specialCharge, 0); assert.equal(f.caster.atb, 0);
  });
  test(`${side}: a newly inserted same-ID object cannot inherit a committed heal`, () => {
    const f = fixture(side); cast(f);
    const replacement = { ...f.patient };
    f.allies[f.allies.indexOf(f.patient)] = replacement;
    settle(f.e); assert.equal(replacement.currentHp, 50); assert.equal(f.patient.currentHp, 50);
  });
  test(`${side}: a confirmed dead target can still be revived normally`, () => {
    const f = fixture(side); f.caster.secondary = { name: 'QA revive', type: 'revive', reviveRatio: 0.3, cd: 3 };
    f.e.applyDamage(f.foes[0], f.patient, 10000); cast(f);
    settle(f.e); assert.equal(f.patient.currentHp, 60); assert.equal(f.patient.state, 'idle');
    assert.equal(f.patient.atb, 0); assert.equal(f.caster.cooldown, 180);
  });
  test(`${side}: a queued revival does not resurrect a second death`, () => {
    const f = fixture(side); f.caster.secondary = { name: 'QA revive', type: 'revive', reviveRatio: 0.3, cd: 3 };
    f.e.applyDamage(f.foes[0], f.patient, 10000); cast(f);
    // Use a second native caster to perform the earlier revival.
    Object.assign(f.third, { atb: 100, cooldown: 0, specialCharge: 0,
      secondary: { name: 'QA earlier revive', type: 'revive', reviveRatio: 0.3, cd: 3 } });
    if (side === 'enemy') { f.e.enemyActionLock = false; f.e.enemyActionOwner = null; }
    assert.equal(f.e.executeRpgAction(f.e.getActionContext(f.third, 'secondary', side), [f.patient.battleId]), true);
    const earlier = f.e.actorActions.get(f.third); earlier.ticks = 1;
    f.e.advanceActions(); assert.equal(f.patient.currentHp, 60);
    f.e.applyDamage(f.foes[0], f.patient, 10000); assert.equal(f.patient.currentHp, 0);
    settle(f.e); assert.equal(f.patient.currentHp, 0);
  });
  test(`${side}: caster KO and immediate revival cannot restore its pending action`, () => {
    const f = fixture(side); cast(f); f.e.applyDamage(f.foes[0], f.caster, 10000);
    Object.assign(f.caster, { currentHp: 100, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(f.patient.currentHp, 50); assert.equal(f.caster.actionPending, false);
    assert.equal(f.e.enemyActionLock, false);
  });
  test(`${side}: missing HP and attack buffs remain live, not frozen by the commitment`, () => {
    const f = fixture(side); cast(f); f.patient.currentHp = 195; f.caster.stats.atk = 50;
    f.caster.rpgBuffTicks = 100; f.caster.rpgBuffMultiplier = 1.5;
    settle(f.e); assert.equal(f.patient.currentHp, 200);
  });
  test(`${side}: fractional recoverable HP and radiation remain authoritative`, () => {
    const f = fixture(side); f.patient.currentHp = 98.75; f.patient.statusEffects.radiated = 120;
    cast(f); settle(f.e); assert.equal(f.patient.currentHp, 100);
    assert.equal(f.patient.statusEffects.radiated, 120);
  });
  test(`${side}: pause does not consume queued ticks and resume applies one impact`, () => {
    const f = fixture(side); cast(f); const ticks = f.e.actionQueue[0].ticks;
    f.e.setPaused(true); settle(f.e); assert.equal(f.e.actionQueue[0].ticks, ticks); assert.equal(f.patient.currentHp, 50);
    f.e.setPaused(false); settle(f.e); assert.equal(f.patient.currentHp, 80);
  });
  test(`${side}: disposal cancels every pending impact and cannot be resumed`, () => {
    const f = fixture(side); cast(f); f.e.dispose(); settle(f.e);
    assert.equal(f.patient.currentHp, 50); assert.equal(f.e.actionQueue.length, 0);
    assert.equal(f.e.actorActions.size, 0); assert.equal(f.e.enemyActionLock, false);
  });
  for (const value of [Infinity, NaN, -1, '3']) test(`${side}: invalid authored cooldown ${String(value)} is refused before spending`, () => {
    const f = fixture(side); f.caster.secondary.cd = value;
    assert.equal(f.e.executeRpgAction(f.e.getActionContext(f.caster, 'secondary', side), [f.patient.battleId]), false);
    assert.equal(f.caster.atb, 100); assert.equal(f.caster.cooldown, 0);
  });
  test(`${side}: an expired fractional cooldown remains usable`, () => {
    const f = fixture(side); f.caster.cooldown = -0.5; cast(f); settle(f.e);
    assert.equal(f.patient.currentHp, 80); assert.equal(f.caster.cooldown, 180);
  });
  test(`${side}: an infinite damage multiplier cannot consume the action`, () => {
    const f = fixture(side); f.caster.simple.dmg = Infinity;
    assert.equal(f.e.executeRpgAction(f.e.getActionContext(f.caster, 'simple', side), [f.foes[0].battleId]), false);
    assert.equal(f.caster.atb, 100);
  });
}
test('an invalid side cannot be treated as the player side', () => {
  const f = fixture(); assert.equal(f.e.canUseAction(f.caster, 'simple', 'not-a-side'), false);
  assert.equal(f.e.executeRpgAction({ ...f.e.getActionContext(f.caster, 'simple'), side: 'not-a-side' }, [f.foes[0].battleId]), false);
  assert.equal(f.caster.atb, 100);
});
test('the raw engine without a signature director enforces the same lifetime contract', () => {
  const f = fixture('player', false); cast(f); f.e.applyDamage(f.foes[0], f.patient, 10000);
  Object.assign(f.patient, { currentHp: 50, state: 'idle', stateTimer: 0 }); settle(f.e);
  assert.equal(f.patient.currentHp, 50);
});
test('manual targeting wait also suspends the direct scheduler', () => {
  const f = fixture(); cast(f); f.third.atb = 100;
  assert.equal(f.e.beginTargeting(f.third, 'simple'), true);
  const ticks = f.e.actionQueue[0].ticks; settle(f.e); assert.equal(f.e.actionQueue[0].ticks, ticks);
  assert.equal(f.e.cancelTargeting(), true); settle(f.e); assert.equal(f.patient.currentHp, 80);
});
for (const side of ['player', 'enemy']) {
  test(`${side}: a named target without a catalogue ID still has a source identity`, () => {
    const f = fixture(side); f.patient.id = undefined; f.patient.sourceId = undefined;
    f.patient.canonicalName = 'Original QA identity'; cast(f);
    f.patient.canonicalName = 'Different QA identity'; settle(f.e);
    assert.equal(f.patient.currentHp, 50);
  });
  test(`${side}: a display-name change preserves a stable canonical target identity`, () => {
    const f = fixture(side); f.patient.id = undefined; f.patient.sourceId = undefined;
    f.patient.canonicalName = 'Original QA identity'; cast(f);
    f.patient.name = 'Nom traduit'; settle(f.e); assert.equal(f.patient.currentHp, 80);
  });
}
