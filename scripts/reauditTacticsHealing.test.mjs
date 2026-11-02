import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Tactics, heroes, support;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics: Tactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  support = await vite.ssrLoadModule('/src/game/tacticsSupport.js');
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
const ordinary = id => ({ id, name: id, universe: 'QA', stats: { hp: 200, atk: 20, def: 0, spd: 10 },
  hp: 200, atk: 20, def: 0, spd: 10, simple: { name: 'QA strike', type: 'melee', dmg: 1 } });
function fixture(side = 'hero', patch = {}) {
  const source = { ...structuredClone(heroes.find(h => h.id === 'aerith_ff7')), ...patch };
  const cell = [source, ordinary('patient'), ordinary('third')];
  const rivals = [ordinary('foe'), ordinary('other-foe')];
  const roster = (side === 'enemy' ? cell : rivals).map(h => ({ ...h, hp: h.stats.hp, atk: h.stats.atk, def: h.stats.def, spd: h.stats.spd }));
  const effects = [], sounds = [];
  const e = new Tactics(960, 540, side === 'hero' ? cell : rivals,
    { customRoster: roster, monsters: roster, bosses: [] }, { add: (...args) => effects.push(args) },
    sound => sounds.push(sound), () => {}, { universe: 'Final Fantasy VII', mode: 'Tactics', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); e.tiles = []; e.obstacles = []; e.protectedArtifact = null; e.escortUnit = null; e.objective = 'rout';
  e.cols = 10; e.rows = 8; e.autoBattle = false;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 1, state: 'idle', stateTimer: 0, specialCharge: 0 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 3, state: 'idle', stateTimer: 0, specialCharge: 0 }));
  const allies = side === 'hero' ? e.heroes : e.enemies, opponents = side === 'hero' ? e.enemies : e.heroes;
  const [caster, patient, third] = allies; caster.specialCharge = 100; caster.cooldown = 100;
  e.turnQueue = [{ unit: caster, type: side }]; e.startTurn();
  return { e, caster, patient, third, allies, opponents, effects, sounds, source, side };
}
const select = f => { assert.equal(f.e.selectAction('special'), true); };
const cast = (f, target = f.patient) => { select(f); return f.e.handleCellClick(target.gridX, target.gridY); };
const resolve = e => { for (let i = 0; i < 30; i++) e.advanceScheduledActions(); };
for (const side of ['hero', 'enemy']) {
  test(`${side}: Aerith has a named healing profile and never an offensive preview`, () => {
    const f = fixture(side); f.patient.currentHp = 1;
    const p = support.getTacticsSupportProfile(f.caster, 'special');
    assert.equal(p?.name, 'Healing Wind'); assert.equal(p?.effect, 'heal'); assert.equal(p?.shape, 'group');
    assert.equal(f.e.getDamagePreview(f.caster, f.opponents[0], 'special').damage, 0);
  });
  test(`${side}: native confirmation heals living allies, spends once and never hits opponents`, () => {
    const f = fixture(side); f.caster.currentHp -= 30; f.patient.currentHp = 1; f.third.currentHp -= 20;
    const enemyHP = f.opponents.map(u => u.currentHp); const hp = f.patient.currentHp;
    const result = cast(f); assert.equal(result.handled, true); assert.equal(result.type, 'support');
    assert.equal(f.patient.currentHp - hp, Math.round(f.patient.maxHp * 0.5));
    assert.equal(f.caster.currentHp, f.caster.maxHp); assert.equal(f.third.currentHp, f.third.maxHp);
    assert.equal(f.caster.specialCharge, 0); assert.equal(f.e.turnsElapsed, 1);
    assert.deepEqual(f.opponents.map(u => u.currentHp), enemyHP);
    const after = f.patient.currentHp;
    assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.equal(f.patient.currentHp, after); assert.equal(f.e.turnsElapsed, 1);
  });
}
for (const side of ['hero', 'enemy']) {
  test(`${side}: full health or only capped radiation cannot spend a tactical limit`, () => {
    const f = fixture(side); f.patient.statusEffects.radiated = 999; f.patient.currentHp = f.patient.maxHp * 0.5;
    select(f); assert.equal(f.e.getSupportState().choices.length, 0);
    assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.equal(f.caster.specialCharge, 100); assert.equal(f.e.turnsElapsed, 0);
    assert.equal(f.e.trySupportAI(), false);
  });
  test(`${side}: the radiation cap and living-only rule do not cleanse, revive or damage`, () => {
    const f = fixture(side); f.patient.currentHp = 1;
    f.patient.statusEffects = { radiated: 999, infected: 999, glitched: 999, haste: 300 };
    f.third.currentHp = 0; f.third.state = 'dead'; f.caster.currentHp -= 10;
    const statuses = JSON.stringify(f.patient.statusEffects);
    cast(f); assert.equal(f.patient.currentHp, f.patient.maxHp * 0.5);
    assert.equal(f.third.currentHp, 0); assert.equal(f.third.state, 'dead');
    assert.equal(JSON.stringify(f.patient.statusEffects), statuses);
  });
  test(`${side}: five-cell reach is inclusive and six-cell allies are left untouched`, () => {
    const f = fixture(side); f.caster.gridX = 1; f.patient.gridX = 6; f.third.gridX = 7;
    f.patient.currentHp = 1; f.third.currentHp = 1;
    assert.equal(cast(f).handled, true); assert.equal(f.patient.currentHp, 101); assert.equal(f.third.currentHp, 1);
  });
  test(`${side}: a wall blocks the confirmed recipient without charging or ending the turn`, () => {
    const f = fixture(side); f.patient.gridX = 3; f.third.gridX = 4; f.patient.currentHp = 1;
    select(f); f.e.obstacles = [{ type: 'barrier', gridX: 2, gridY: f.caster.gridY, hp: 100 }];
    assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.equal(f.patient.currentHp, 1); assert.equal(f.caster.specialCharge, 100); assert.equal(f.e.turnsElapsed, 0);
  });
  test(`${side}: group source healing rejects empty cells and enemy anchors`, () => {
    const f = fixture(side); f.patient.currentHp = 1;
    for (const anchor of [f.opponents[0], { gridX: 4, gridY: f.caster.gridY }]) {
      assert.deepEqual(support.resolveTacticsSupport(f.e, f.caster, 'special', anchor), []);
      assert.deepEqual(f.e.performSupportAction(f.caster, anchor, 'special'), []);
    }
    assert.equal(f.patient.currentHp, 1); assert.equal(f.caster.specialCharge, 100);
  });
  test(`${side}: stale healed target is not a free anchor for a different wounded ally`, () => {
    const f = fixture(side); f.patient.currentHp = 1; select(f);
    f.patient.currentHp = f.patient.maxHp; f.third.currentHp = 1;
    assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.equal(f.caster.specialCharge, 100); assert.equal(f.third.currentHp, 1);
    assert.ok(f.e.getSupportState().choices.some(choice => choice.unit === f.third));
    assert.equal(f.e.handleCellClick(f.third.gridX, f.third.gridY).handled, true);
  });
  test(`${side}: pause and cancellation preserve all HP, movement and resources`, () => {
    const f = fixture(side); f.patient.currentHp = 1; f.e.movementSpent = 1; select(f);
    f.e.setPaused(true); assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.equal(f.patient.currentHp, 1); assert.equal(f.caster.specialCharge, 100);
    f.e.setPaused(false); assert.equal(f.e.cancelSelectedAction(), true);
    assert.equal(f.e.movementSpent, 1); assert.equal(f.e.turnsElapsed, 0);
  });
  test(`${side}: noncombatants and dead-marked positive-HP allies cannot receive Healing Wind`, () => {
    const f = fixture(side); f.patient.currentHp = 1; f.patient.nonCombat = true;
    f.third.currentHp = 1; f.third.state = 'dead'; f.caster.currentHp -= 10;
    assert.equal(cast(f, f.caster).handled, true);
    assert.equal(f.patient.currentHp, 1); assert.equal(f.third.currentHp, 1);
  });
  test(`${side}: preview and real fractional HP agree while presentation is rounded`, () => {
    const f = fixture(side); f.patient.currentHp = f.patient.maxHp - 39.35;
    const expected = f.patient.maxHp - f.patient.currentHp;
    const p = f.e.getDamagePreview(f.caster, f.patient, 'special');
    assert.equal(p.damage, 0); assert.equal(p.healing, expected);
    cast(f); assert.equal(f.patient.currentHp, f.patient.maxHp);
    assert.ok(f.effects.some(args => args[7] === 'text' && args[8] === '+39 HP'));
    assert.ok(f.sounds.includes('heal'));
  });
  for (const charge of [99, NaN, Infinity, '100']) test(`${side}: invalid limit ${String(charge)} is not spent`, () => {
    const f = fixture(side); f.patient.currentHp = 1; select(f); f.caster.specialCharge = charge;
    assert.equal(f.e.handleCellClick(f.patient.gridX, f.patient.gridY).handled, false);
    assert.ok(Object.is(f.caster.specialCharge, charge)); assert.equal(f.patient.currentHp, 1);
  });
  test(`${side}: delayed native AI heals once and pauses without consuming its limit`, () => {
    const f = fixture(side); f.patient.currentHp = 1; f.third.currentHp = 10;
    assert.equal(f.e.trySupportAI(), true); assert.equal(f.caster.specialCharge, 100);
    f.e.setPaused(true); resolve(f.e); assert.equal(f.patient.currentHp, 1);
    f.e.setPaused(false); resolve(f.e); assert.equal(f.patient.currentHp, 101); assert.equal(f.third.currentHp, 110);
    assert.equal(f.caster.specialCharge, 0); assert.equal(f.e.turnsElapsed, 1);
    resolve(f.e); assert.equal(f.patient.currentHp, 101);
  });
  for (const edit of ['skill', 'power', 'identity', 'patient-life', 'caster-life', 'dispose']) {
    test(`${side}: pending source heal is invalidated by ${edit} without using its replacement`, () => {
      const f = fixture(side); f.patient.currentHp = 1;
      assert.equal(f.e.trySupportAI(), true);
      if (edit === 'skill') f.caster.special = { ...f.caster.special };
      if (edit === 'power') f.caster.special.healRatio = 0.9;
      if (edit === 'identity') f.caster.universe = 'Wrong incarnation';
      if (edit === 'patient-life') f.e.invalidateActorActions(f.patient);
      if (edit === 'caster-life') f.e.invalidateActorActions(f.caster);
      if (edit === 'dispose') f.e.dispose();
      resolve(f.e); assert.equal(f.patient.currentHp, 1); assert.equal(f.caster.specialCharge, 100);
    });
  }
}
for (const patch of [
  { id: 'unknown', name: 'Aerith Gainsborough' }, { universe: 'Final Fantasy VIII' },
  { special: { name: 'Authored custom attack', type: 'beam', dmg: 3 } },
  { tacticsAttacks: { special: { effect: 'heal', shape: 'single', range: 2 } } },
]) test(`unverified/custom identity is not rewritten: ${JSON.stringify(patch)}`, () => {
  const f = fixture('hero', patch);
  assert.notEqual(f.caster.special?.sourceSignatureKey, 'aerith_ff7');
});
test('source reads and battle preparation never alter the catalogue or caller definition', () => {
  const source = heroes.find(h => h.id === 'aerith_ff7'), before = JSON.stringify(source);
  const f = fixture(); const own = JSON.stringify(f.source);
  support.getTacticsSupportProfile(source, 'special');
  f.patient.currentHp = 1; cast(f);
  assert.equal(JSON.stringify(source), before); assert.equal(JSON.stringify(f.source), own);
});
for (const flag of ['tacticsProfile', 'tactics', 'attackProfile']) test(`explicit ${flag} remains authoritative`, () => {
  const a = structuredClone(heroes.find(h => h.id === 'aerith_ff7'));
  a.special[flag] = { effect: 'heal', targetSide: 'ally', shape: 'single', range: 2, healRatio: 0.1 };
  const f = fixture('hero', { special: a.special });
  const profile = support.getTacticsSupportProfile(f.caster, 'special');
  assert.equal(profile.shape, 'single'); assert.equal(profile.range, 2); assert.equal(profile.healRatio, 0.1);
  assert.equal(profile.sourceSignatureKey, undefined);
});

for (const side of ['hero', 'enemy']) test(`${side}: a newly injured ally offered by the live panel can receive an ordinary heal`, () => {
  const f = fixture(side); f.patient.currentHp = 1; f.caster.cooldown = 0;
  f.caster.secondary = { name: 'QA single heal', type: 'heal', dmg: 1, cd: 3 };
  assert.equal(f.e.selectAction('secondary'), true);
  f.patient.currentHp = f.patient.maxHp; f.third.currentHp = 1;
  assert.ok(f.e.getSupportState().choices.some(choice => choice.unit === f.third));
  const result = f.e.handleCellClick(f.third.gridX, f.third.gridY);
  assert.equal(result.handled, true, JSON.stringify(result)); assert.ok(f.third.currentHp > 1);
  assert.equal(f.patient.currentHp, f.patient.maxHp); assert.equal(f.e.turnsElapsed, 1);
});
