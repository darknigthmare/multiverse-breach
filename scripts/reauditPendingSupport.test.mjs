import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Tactics;
const engines = [];
const hero = id => ({ id, name: id, universe: 'Nexus de Convergence',
  stats: { hp: 200, atk: 30, def: 0, spd: 10 },
  simple: { name: 'Strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Heal', type: 'heal', dmg: 1, cd: 3 },
  special: { name: 'Greater heal', type: 'heal', dmg: 2 },
  defense: { name: 'Guard', type: 'shield', dur: 1, reduce: 0.4 } });
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics: Tactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
function fixture(side = 'hero', action = 'secondary') {
  const enemies = ['e1', 'e2', 'e3'].map(id => ({ ...hero(id), hp: 200, atk: 30, def: 0, spd: 1 }));
  const e = new Tactics(760, 420, ['p1', 'p2', 'p3'].map(hero),
    { customRoster: enemies, monsters: enemies, bosses: [] }, { add() {} }, () => {}, () => {},
    { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e);
  e.tiles = []; e.obstacles = []; e.escortUnit = null; e.protectedArtifact = null; e.objective = 'rout';
  e.missionProfile = { ...e.missionProfile, pressure: 0, reinforcementEvery: 0, hazardPulseEvery: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 1, specialCharge: 0 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 3, specialCharge: 0 }));
  const allies = side === 'hero' ? e.heroes : e.enemies;
  const [caster, patient, third] = allies;
  patient.currentHp = 50;
  if (action === 'special') { caster.specialCharge = 100; caster.cooldown = 100; }
  e.turnQueue = [{ unit: caster, type: side }]; e.startTurn();
  assert.equal(e.trySupportAI(), true); assert.equal(e.actionPhase, 'resolving');
  return { e, caster, patient, third };
}
const resolve = e => { for (let i = 0; i < 30; i++) e.advanceScheduledActions(); };
for (const side of ['hero', 'enemy']) {
  test(`${side}: replacing the committed support skill cannot execute its replacement`, () => {
    const { e, caster, patient } = fixture(side);
    caster.secondary = { ...caster.secondary, name: 'Different heal', dmg: 4, cd: 10 };
    resolve(e);
    assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0); assert.equal(caster.specialCharge, 0);
  });
  test(`${side}: in-place support power changes invalidate the windup`, () => {
    const { e, caster, patient } = fixture(side);
    caster.secondary.dmg = 4;
    resolve(e);
    assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
  });
  test(`${side}: same-object patient death and immediate revival cannot recover a pending heal`, () => {
    const { e, caster, patient } = fixture(side);
    e.applyDamage((side === 'hero' ? e.enemies : e.heroes)[0], patient, 1e6);
    assert.equal(patient.currentHp, 0);
    Object.assign(patient, { currentHp: 50, state: 'idle', stateTimer: 0 });
    resolve(e);
    assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
  });
  for (const value of [Infinity, '100']) test(`${side}: invalid queued special charge ${String(value)} is not spendable`, () => {
    const { e, caster, patient } = fixture(side, 'special');
    caster.specialCharge = value;
    resolve(e);
    assert.equal(patient.currentHp, 50); assert.equal(caster.specialCharge, value);
  });
  for (const value of [-Infinity, '0']) test(`${side}: invalid queued cooldown ${String(value)} does not cast`, () => {
    const { e, caster, patient } = fixture(side);
    caster.cooldown = value;
    resolve(e);
    assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, value);
  });
  test(`${side}: unchanged support still heals once, charges once and ends its turn`, () => {
    const { e, caster, patient } = fixture(side);
    resolve(e);
    assert.equal(patient.currentHp, 80); assert.equal(caster.cooldown, 180);
    assert.equal(caster.specialCharge, 20); assert.equal(e.turnsElapsed, 1);
    resolve(e); assert.equal(patient.currentHp, 80); assert.equal(e.turnsElapsed, 1);
  });
}
for (const side of ['hero', 'enemy']) {
  for (const edit of ['range', 'cleanses', 'duration', 'effect', 'cooldown', 'source']) {
    test(`${side}: a committed ${edit} cannot be replaced in place`, () => {
      const { e, caster, patient } = fixture(side);
      if (edit === 'range') caster.secondary.tacticsRange = 4;
      if (edit === 'cleanses') caster.secondary.cleanses = ['infected'];
      if (edit === 'duration') caster.secondary.duration = 8;
      if (edit === 'effect') caster.secondary.type = 'shield';
      if (edit === 'cooldown') caster.secondary.cd = 8;
      if (edit === 'source') caster.universe = 'Other';
      resolve(e);
      assert.equal(patient.currentHp, 50); assert.equal(patient.tacticsGuardTicks || 0, 0);
      assert.equal(caster.cooldown, 0); assert.equal(caster.specialCharge, 0);
    });
  }
  test(`${side}: a cloned equal skill still represents a different commitment`, () => {
    const { e, caster, patient } = fixture(side);
    caster.secondary = { ...caster.secondary };
    resolve(e); assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
  });
  test(`${side}: the entire source team switching camps cancels its old cast`, () => {
    const { e, caster, patient, third } = fixture(side);
    const from = side === 'hero' ? 'heroes' : 'enemies', to = side === 'hero' ? 'enemies' : 'heroes';
    const team = [caster, patient, third];
    e[from] = e[from].filter(u => !team.includes(u)); e[to].push(...team);
    resolve(e); assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
  });
  test(`${side}: healing re-evaluates real missing HP instead of freezing the preview amount`, () => {
    const { e, caster, patient } = fixture(side);
    patient.currentHp = 195;
    resolve(e); assert.equal(patient.currentHp, 200); assert.equal(caster.cooldown, 180);
  });
  test(`${side}: paused cast resumes once; injury to another ally does not redirect it`, () => {
    const { e, caster, patient, third } = fixture(side);
    e.setPaused(true); third.currentHp = 1;
    resolve(e); assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
    e.setPaused(false); resolve(e);
    assert.equal(patient.currentHp, 80); assert.equal(third.currentHp, 1);
  });
  test(`${side}: unrelated recipient lifetime changes do not cancel a valid single heal`, () => {
    const { e, caster, patient, third } = fixture(side);
    e.invalidateActorActions(third);
    resolve(e); assert.equal(patient.currentHp, 80); assert.equal(caster.cooldown, 180);
  });
}
