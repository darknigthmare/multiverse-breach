import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, Tactics;
const engines = [];
const unit = id => ({ id, name: id, universe: 'QA', weapon: 'gun', weaponType: 'gun',
  stats: { hp: 400, atk: 40, def: 0, spd: 1 }, hp: 400, atk: 40, def: 0, spd: 1,
  simple: { name: 'QA shot', type: 'bullet', dmg: 1, tacticsProfile: { shape: 'single', range: 6 } },
  secondary: { name: 'QA heavy shot', type: 'bullet', dmg: 2, cd: 3, tacticsProfile: { shape: 'single', range: 6 } },
  special: { name: 'QA limit shot', type: 'bullet', dmg: 3, tacticsProfile: { shape: 'single', range: 6 } },
  defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 1 } });
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics: Tactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
function fixture(side = 'hero', action = 'simple') {
  const roster = ['e0', 'e1', 'e2'].map(unit);
  const e = new Tactics(760, 420, ['p0', 'p1', 'p2'].map(unit), { customRoster: roster, monsters: roster, bosses: [] },
    { add() {} }, () => {}, () => {}, { universe: 'QA', mode: 'Tactics', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); e.timers.clear(); e.tiles = []; e.obstacles = []; e.escortUnit = null; e.protectedArtifact = null;
  e.objective = 'rout'; e.cols = 10; e.rows = 8; e.autoBattle = false;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: 1, gridY: 1 + i * 2, currentHp: 400,
    state: 'idle', stateTimer: 0, cooldown: 100, specialCharge: 0 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: 3, gridY: 1 + i * 2, currentHp: 400,
    state: 'idle', stateTimer: 0, cooldown: 100, specialCharge: 0 }));
  const allies = side === 'hero' ? e.heroes : e.enemies, foes = side === 'hero' ? e.enemies : e.heroes;
  const actor = allies[0], target = foes[0];
  if (action === 'secondary') actor.cooldown = 0;
  if (action === 'special') actor.specialCharge = 100;
  e.turnQueue = [{ unit: actor, type: side }]; e.startTurn(); e.timers.clear();
  e.movementBudget = 0; e.movementSpent = 0;
  return { e, side, actor, target, allies, foes, action: side === 'enemy' ? 'simple' : action };
}
function launch(f) {
  if (f.side === 'hero') f.e.runHeroAI(); else f.e.runEnemyAI();
  assert.equal(f.e.actionPhase, 'resolving'); assert.ok(f.e.timers.size > 0);
}
function settle(e) { for (let i = 0; i < 31; i++) e.advanceScheduledActions(); }
for (const side of ['hero', 'enemy']) {
  test(`${side}: delayed shot cannot follow the confirmed victim through KO and immediate revival`, () => {
    const f = fixture(side); launch(f);
    f.e.applyDamage(f.allies[1], f.target, 100000); assert.equal(f.target.currentHp, 0);
    Object.assign(f.target, { currentHp: 250, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(f.target.currentHp, 250); assert.equal(f.e.turnsElapsed, 1);
  });
  for (const edit of ['action', 'power', 'profile', 'caster-identity', 'target-identity', 'caster-side']) {
    test(`${side}: pending attack rejects changed ${edit}`, () => {
      const f = fixture(side); launch(f);
      if (edit === 'action') f.actor.simple = { ...f.actor.simple };
      if (edit === 'power') f.actor.simple.dmg = 5;
      if (edit === 'profile') f.actor.simple.tacticsProfile.range = 7;
      if (edit === 'caster-identity') f.actor.sourceId = 'new-identity';
      if (edit === 'target-identity') f.target.sourceUniverse = 'new-universe';
      if (edit === 'caster-side') { f.allies.splice(0, 1); f.foes.push(f.actor); }
      const hp = f.target.currentHp; settle(f.e);
      assert.equal(f.target.currentHp, hp); assert.equal(f.actor.specialCharge, 0);
    });
  }
  test(`${side}: ordinary shot retains its real impact and one turn completion`, () => {
    const f = fixture(side); launch(f); const hp = f.target.currentHp; settle(f.e);
    assert.ok(f.target.currentHp < hp); assert.equal(f.e.turnsElapsed, 1);
    const after = f.target.currentHp; settle(f.e); assert.equal(f.target.currentHp, after);
  });
}
for (const value of [NaN, Infinity, '100']) test(`hero: invalid special meter ${String(value)} during windup is not consumed`, () => {
  const f = fixture('hero', 'special'); launch(f); f.actor.specialCharge = value;
  settle(f.e); assert.equal(f.target.currentHp, 400); assert.ok(Object.is(f.actor.specialCharge, value));
});
for (const value of [NaN, -Infinity, '0']) test(`hero: invalid cooldown ${String(value)} during windup is not consumed`, () => {
  const f = fixture('hero', 'secondary'); launch(f); f.actor.cooldown = value;
  settle(f.e); assert.equal(f.target.currentHp, 400); assert.ok(Object.is(f.actor.cooldown, value));
});
for (const side of ['hero', 'enemy']) {
  test(`${side}: pause preserves the windup and resume hits only once`, () => {
    const f = fixture(side); launch(f); const ticks = [...f.e.timers][0].ticks;
    f.e.setPaused(true); settle(f.e); assert.equal([...f.e.timers][0].ticks, ticks); assert.equal(f.target.currentHp, 400);
    f.e.setPaused(false); settle(f.e); assert.ok(f.target.currentHp < 400); assert.equal(f.e.turnsElapsed, 1);
  });
  test(`${side}: a newly blocking wall cancels the shot without an unrelated fallback`, () => {
    const f = fixture(side); launch(f);
    f.e.obstacles.push({ type: 'barrier', gridX: 2, gridY: 1, hp: 300 });
    settle(f.e); assert.equal(f.target.currentHp, 400); assert.equal(f.e.obstacles[0].hp, 300);
  });
  test(`${side}: moving the confirmed victim away never redirects to a new unit`, () => {
    const f = fixture(side); launch(f); const replacement = f.foes[1];
    Object.assign(replacement, { gridX: f.target.gridX, gridY: f.target.gridY }); f.target.gridY = 7;
    settle(f.e); assert.equal(f.target.currentHp, 400); assert.equal(replacement.currentHp, 400);
  });
  test(`${side}: a same-ID replacement object does not inherit the shot`, () => {
    const f = fixture(side); launch(f); const replacement = { ...f.target };
    f.foes[0] = replacement; settle(f.e); assert.equal(replacement.currentHp, 400);
  });
  test(`${side}: caster KO cancels its action without resurrection restoring it`, () => {
    const f = fixture(side); launch(f); f.e.applyDamage(f.foes[1], f.actor, 100000);
    Object.assign(f.actor, { currentHp: 400, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.equal(f.target.currentHp, 400);
  });
  test(`${side}: disposal prevents the delayed attack and any result`, () => {
    const f = fixture(side); launch(f); f.e.dispose(); settle(f.e);
    assert.equal(f.target.currentHp, 400); assert.equal(f.e.timers.size, 0);
  });
  test(`${side}: live defence still reduces a valid pending shot`, () => {
    const f = fixture(side); launch(f);
    f.target.tacticsGuardTicks = 100; f.target.tacticsGuardReduce = 0.9;
    settle(f.e); assert.ok(f.target.currentHp < 400 && f.target.currentHp > 390);
  });
  test(`${side}: a translated display name preserves a stable source identity`, () => {
    const f = fixture(side); f.target.canonicalName = 'Original'; launch(f); f.target.name = 'Nom traduit';
    settle(f.e); assert.ok(f.target.currentHp < 400);
  });
  test(`${side}: an ID-less canonical target cannot become another character`, () => {
    const f = fixture(side); f.target.id = undefined; f.target.sourceId = undefined;
    f.target.canonicalName = 'Original'; launch(f); f.target.canonicalName = 'Someone else';
    settle(f.e); assert.equal(f.target.currentHp, 400);
  });
  test(`${side}: an area shot ignores a new secondary victim but keeps its confirmed main target`, () => {
    const f = fixture(side); f.actor.simple.tacticsProfile = { shape: 'area', range: 6, areaRadius: 1 };
    f.foes[1].gridY = 2; launch(f);
    const replacement = { ...f.foes[1], id: 'new-arrival' }; f.foes[1] = replacement;
    settle(f.e); assert.ok(f.target.currentHp < 400); assert.equal(replacement.currentHp, 400);
  });
  test(`${side}: changed life of an area secondary target does not cancel the other impacts`, () => {
    const f = fixture(side); f.actor.simple.tacticsProfile = { shape: 'area', range: 6, areaRadius: 1 };
    f.foes[1].gridY = 2; launch(f);
    f.e.applyDamage(f.allies[1], f.foes[1], 100000);
    Object.assign(f.foes[1], { currentHp: 250, state: 'idle', stateTimer: 0 });
    settle(f.e); assert.ok(f.target.currentHp < 400); assert.equal(f.foes[1].currentHp, 250);
  });
  test(`${side}: player selection and confirmation refuse an invalid multiplier without spending`, () => {
    const f = fixture(side, 'special'); f.actor.specialCharge = 100;
    assert.equal(f.e.selectAction('special'), true); f.actor.special.dmg = Infinity;
    const result = f.e.handleCellClick(f.target.gridX, f.target.gridY);
    assert.equal(result.handled, false); assert.equal(f.target.currentHp, 400);
    assert.equal(f.actor.specialCharge, 100); assert.equal(f.e.turnsElapsed, 0);
  });
  test(`${side}: an authored zero recharge remains zero after manual firing`, () => {
    const f = fixture(side, 'secondary'); f.actor.cooldown = 0; f.actor.secondary.cd = 0;
    assert.equal(f.e.selectAction('secondary'), true);
    assert.equal(f.e.handleCellClick(f.target.gridX, f.target.gridY).handled, true);
    assert.equal(f.actor.cooldown, 0); assert.ok(f.target.currentHp < 400);
  });
  for (const value of [Infinity, NaN, -1, '3']) test(`${side}: invalid authored recharge ${String(value)} is refused before selection`, () => {
    const f = fixture(side, 'secondary'); f.actor.cooldown = 0; f.actor.secondary.cd = value;
    assert.equal(f.e.selectAction('secondary'), false); assert.equal(f.actor.cooldown, 0); assert.equal(f.e.turnsElapsed, 0);
  });
}
for (const value of [NaN, Infinity, '100']) test(`P2: enemy normalization must not convert invalid meter ${String(value)} to usable points`, () => {
  const f = fixture('enemy'); f.actor.specialCharge = value;
  assert.equal(f.e.selectAction('special'), false); assert.ok(Object.is(f.actor.specialCharge, value));
});
for (const value of [NaN, -Infinity, '0']) test(`P2: enemy normalization must not turn invalid recharge ${String(value)} into a ready action`, () => {
  const f = fixture('enemy'); f.actor.cooldown = value;
  assert.equal(f.e.selectAction('secondary'), false); assert.ok(Object.is(f.actor.cooldown, value));
});
for (const action of ['secondary', 'special']) test(`hero: valid ${action} spends its native cost once`, () => {
  const f = fixture('hero', action); launch(f); settle(f.e); assert.ok(f.target.currentHp < 400);
  assert.equal(action === 'special' ? f.actor.specialCharge : f.actor.cooldown, action === 'special' ? 0 : 180);
  assert.equal(f.e.turnsElapsed, 1);
});
