import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, EngineRpg, EngineSmash, install, kits, prepare, resolve, heroes, enemies, healing, chargeTicks;
const active = [];
const fixture = { id: 'source-test-target', name: 'QA target', universe: 'Nexus de Convergence', hp: 20000, atk: 1, def: 0, spd: 1, color: '#888', stats: { hp: 20000, atk: 1, def: 0, spd: 1 }, simple: { name: 'QA', type: 'melee', dmg: 1 }, defense: { reduce: 0, dur: 1 } };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  ({ SIGNATURE_SOURCE_KITS: kits, prepareSourceSignature: prepare, resolveSourceSignature: resolve } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ getCombatHealingAmount: healing } = await vite.ssrLoadModule('/src/game/combatHealing.js'));
  ({ SOURCE_ENEMY_CHARGE_TICKS: chargeTicks } = await vite.ssrLoadModule('/src/game/signatureSourceRuntime.js'));
});
afterEach(() => active.splice(0).forEach(engine => engine.dispose()));
after(async () => vite?.close());
const template = d => {
  if (d.actorId) return structuredClone(heroes.find(hero => hero.id === d.actorId));
  const data = enemies[d.universe];
  const actor = [...data.monsters, ...data.bosses, data.worldBoss].filter(Boolean).find(enemy => enemy.name === d.enemyName);
  return { ...structuredClone(actor), universe: d.universe, isBoss: data.bosses.includes(actor) || data.worldBoss === actor,
    stats: { hp: actor.hp, atk: actor.atk, def: actor.def || 0, spd: actor.spd || 1 },
    simple: { name: 'Attack', type: 'melee', dmg: 1 }, defense: { reduce: 0, dur: 1 } };
};
const make = (d, mode = 'RPG', side = 'player', cpu = false) => {
  const source = template(d);
  const stage = { universe: d.universe, mode, disableHazards: true, customBattle: { singleRoster: true, opponentControl: cpu ? 'cpu' : 'p2' } };
  const leader = side === 'player' ? source : structuredClone(fixture);
  const opponent = side === 'enemy' ? source : structuredClone(fixture);
  const engine = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [leader], { customRoster: [opponent], monsters: [opponent], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  engine.syncPreMatchFromServer?.(3000);engine.completeMeleeIntros?.();
  for (const actor of [...engine.heroes, ...engine.enemies]) Object.assign(actor, { state: 'idle', stateTimer: 0, action: null, actionPending: false, charging: false, guarding: false, atb: 100, specialCharge: 100, vx: 0, vy: 0, y: 260 });
  engine.heroes[0].x = 240;engine.heroes[0].facing = 1;engine.enemies[0].x = 240 + Math.max(30, (d.minRange || 0) + 10);engine.enemies[0].facing = -1;
  install(engine, { mode });active.push(engine);
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const target = side === 'player' ? engine.enemies[0] : engine.heroes[0];
  return { engine, actor, target };
};
const ticks = (engine, count) => { for (let i = 0; i < count; i++) engine.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
const duration = d => d.windupTicks + d.revealTicks + (d.hits - 1) * d.hitGapTicks + d.outroTicks;
const trigger = ({ engine, actor }, mode, side = 'player') => mode === 'RPG'
  ? engine.executeRpgAction(engine.getActionContext(actor, 'special', side), engine.chooseDefaultTargets(engine.getActionContext(actor, 'special', side)))
  : side === 'player' ? engine.triggerAbility(actor, 'special') : engine.triggerOpponentAbility('special');

test('every authored identity exists and resolves only within its exact source universe', () => {
  assert.equal(Object.values(kits).filter(kit => kit.wave !== 2).length, 39);
  assert.ok(Object.keys(kits).length >= 39);
  for (const d of Object.values(kits)) {
    const actor = template(d);const before = JSON.stringify(actor);assert.equal(resolve(actor), d, d.key);
    assert.equal(resolve({ ...actor, universe: 'Wrong universe' }), null, d.key);
    assert.equal(resolve({ ...actor, nonCombat: true }), null, d.key);
    assert.equal(resolve({ ...actor, special: { name: 'Custom ability', dmg: 2 } }), null, d.key);
    assert.equal(JSON.stringify(actor), before, 'resolver mutated its argument');
    assert.ok(d.referenceUrl.startsWith('https://'));assert.equal(d.canonicalFidelityApproved, false);
    assert.equal(Object.isFrozen(d), true);
  }
});
test('runtime preparation never mutates catalog actions and respects custom profiles', () => {
  const source = heroes.find(h => h.id === 'cloud_ff7');const action = source.special;
  const actor = { ...source };prepare(actor);assert.notEqual(actor.special, action);assert.equal(source.special, action);
  assert.match(action.name, /Origin Burst/);assert.equal(actor.special.name, 'Omnislash');
  assert.equal(prepare(actor), kits.cloud_ff7);assert.equal(actor.special.dmg, action.dmg);
  for (const profile of [{ special: { ...action, smashProfile: { range: 30 } } }, { smashAttacks: { special: {} } }, { rpgAttacks: { special: {} } }, { canonCombatPresentation: true }]) {
    const custom = { ...source, ...profile };const special = custom.special;assert.equal(prepare(custom), null);assert.equal(custom.special, special);
  }
});
test('unknown names and prototype-like IDs cannot acquire a source action', () => {
  for (const id of ['constructor', '__proto__', '', 'unknown']) assert.equal(resolve({ id, name: 'Cloud Strife', universe: 'Final Fantasy VII', special: { name: 'Cloud Strife Origin Burst', dmg: 4 } }), null);
});

test('all registered source kits execute in both engines on each side', async t => {
  for (const d of Object.values(kits)) for (const mode of ['RPG', 'Smash']) for (const side of ['player', 'enemy']) {
    await t.test(`${d.key} / ${mode} / ${side}`, () => {
      const setup = make(d, mode, side);const { engine, actor, target } = setup;
      assert.equal(actor.special.sourceSignatureKey, d.key);
      if (d.effect === 'heal') actor.currentHp = Math.floor(actor.maxHp / 4);
      const targetBefore = target.currentHp;
      const before = d.effect === 'heal' ? actor.currentHp : target.currentHp;
      const contacts = [];const damage = engine.applyDamage;engine.applyDamage = (...args) => { contacts.push(args);return damage(...args); };
      assert.equal(trigger(setup, mode, side), true, 'did not start');assert.equal(actor.specialCharge, 0);
      if (mode === 'RPG') assert.equal(actor.atb, 0);
      assert.equal(trigger(setup, mode, side), false, 'second input accepted');
      ticks(engine, d.windupTicks + d.revealTicks - 1);assert.equal(contacts.length, 0);
      ticks(engine, (d.hits - 1) * d.hitGapTicks + 1);
      if (d.effect === 'heal') { assert.ok(actor.currentHp > before);assert.equal(target.currentHp, targetBefore); }
      else { assert.equal(contacts.length, d.hits);assert.ok(target.currentHp < before); }
      ticks(engine, d.outroTicks - 1);assert.equal(actor.specialCharge, 0);assert.equal(engine.signatureDirector.busy, true);
      ticks(engine, 1);assert.equal(engine.signatureDirector.busy, false);assert.equal(actor.actionPending, false);
    });
  }
});
for (const mode of ['RPG', 'Smash']) {
  test(`${mode}: full party heals only recoverable HP; no cleanse or resurrection`, () => {
    const { engine, actor, target } = make(kits.aerith_ff7, mode);
    actor.currentHp = actor.maxHp * 0.2;
    const ally = { ...actor, id: 'ally', battleId: 'ally', runtimeId: 'ally', x: 235, maxHp: 200, currentHp: 40, statusEffects: { radiated: 500, infected: 500 } };
    const dead = { ...ally, id: 'dead', runtimeId: 'dead', battleId: 'dead', currentHp: 0, state: 'dead' };
    const enemyHp = target.currentHp;engine.heroes.push(ally, dead);
    const amount = healing(ally, 100);assert.equal(trigger({ engine, actor }, mode), true);ticks(engine, duration(kits.aerith_ff7));
    assert.equal(ally.currentHp, 40 + amount);assert.equal(ally.statusEffects.infected, 500);assert.equal(ally.statusEffects.radiated, 500);
    assert.equal(dead.currentHp, 0);assert.equal(target.currentHp, enemyHp);
  });
  test(`${mode}: full-health healing does not spend ATB or meter`, () => {
    const setup = make(kits.aerith_ff7, mode);assert.equal(trigger(setup, mode), false);
    assert.equal(setup.actor.atb, 100);assert.equal(setup.actor.specialCharge, 100);
  });
  test(`${mode}: pause, KO and revival never continue an old source action`, () => {
    const { engine, actor, target } = make(kits.cloud_ff7, mode);
    assert.equal(trigger({ engine, actor }, mode), true);ticks(engine, 12);engine.paused = true;
    const frame = engine.signatureDirector.snapshot();ticks(engine, 500);assert.deepEqual(engine.signatureDirector.snapshot(), frame);
    engine.paused = false;engine.applyDamage(target, actor, 100000);assert.equal(engine.signatureDirector.busy, false);
    actor.currentHp = actor.maxHp;actor.state = 'idle';engine.paused = true;
    const hp = target.currentHp;ticks(engine, 300);assert.equal(target.currentHp, hp);assert.equal(actor.actionPending, false);
  });
  test(`${mode}: mid-sequence replacement cancels without executing the replacement`, () => {
    const { engine, actor, target } = make(kits.cloud_ff7, mode);
    trigger({ engine, actor }, mode);ticks(engine, kits.cloud_ff7.windupTicks + kits.cloud_ff7.revealTicks);
    const hp = target.currentHp;actor.special = { name: 'Replacement', dmg: 99999 };
    ticks(engine, 1);assert.equal(engine.signatureDirector.busy, false);assert.equal(target.currentHp, hp);assert.equal(actor.actionPending, false);
  });
  test(`${mode}: new target never inherits a reserved multi-hit plan`, () => {
    const { engine, actor, target } = make(kits.cloud_ff7, mode);
    trigger({ engine, actor }, mode);engine.enemies = [{ ...target, id: 'replacement', battleId: 'replacement', runtimeId: 'replacement' }];
    const hp = engine.enemies[0].currentHp;ticks(engine, duration(kits.cloud_ff7));assert.equal(engine.enemies[0].currentHp, hp);
  });
  test(`${mode}: teardown during a source sequence releases only owned locks`, () => {
    const setup = make(kits.lightning_ff13, mode);trigger(setup, mode);setup.engine.dispose();
    assert.equal(setup.actor.actionPending, false);assert.notEqual(setup.actor.state, 'signature');
    const hp = setup.target.currentHp;ticks(setup.engine, 300);assert.equal(setup.target.currentHp, hp);
  });
}
test('melee contact attacks cannot hit distant or rear targets', () => {
  const setup = make(kits.naruto_uzumaki_young, 'Smash');setup.target.x = 650;
  assert.equal(trigger(setup, 'Smash'), false);assert.equal(setup.actor.specialCharge, 100);
  setup.target.x = setup.actor.x - 30;assert.equal(trigger(setup, 'Smash'), false);
});
test('P2 source super cannot transfer its reservation to another active enemy', () => {
  const setup = make(kits.goku_dbz, 'Smash', 'enemy');const { engine, actor } = setup;
  assert.equal(trigger(setup, 'Smash', 'enemy'), true);
  const replacement = { ...actor, id: 'other', sourceId: 'vegeta_dbz', specialCharge: 100, state: 'idle' };
  engine.enemies.push(replacement);engine.activeOpponentId = replacement.id;
  ticks(engine, 1);assert.equal(engine.signatureDirector.busy, false);assert.equal(replacement.specialCharge, 100);assert.equal(actor.actionPending, false);
});
test('authored monster AI charges on simulation time, never for P2 or while paused', () => {
  const d = kits['Doom::Imp Fireballer'];const { engine, actor, target } = make(d, 'Smash', 'enemy', true);
  actor.specialCharge = 0;actor.x = target.x + 130;actor.y = target.y;
  engine.paused = true;ticks(engine, 100);assert.equal(actor.specialCharge, 0);engine.paused = false;
  ticks(engine, 1);assert.ok(actor.specialCharge > 0 && actor.specialCharge <= 100 / chargeTicks + 0.001);
  // Give it the last fraction only; normal CPU movement and attack rules still run.
  actor.specialCharge = 100;actor.state = 'idle';actor.action = null;actor.cooldown = 9999;
  actor.x = target.x + 120;actor.y = target.y = engine.arena.groundY;actor.vy = target.vy = 0;ticks(engine, 1);
  assert.equal(engine.signatureDirector.busy, true);assert.equal(actor.specialCharge, 0);
  const p2 = make(d, 'Smash', 'enemy');p2.actor.specialCharge = 0;ticks(p2.engine, 20);assert.equal(p2.actor.specialCharge, 0);
});
test('source preparation includes a new wave without changing an existing custom action', () => {
  const { engine, actor } = make(kits.cloud_ff7);
  actor.special = { name: 'custom', dmg: 3 };
  const fresh = { ...template(kits.goku_dbz), id: 'goku_dbz', runtimeId: 'new-wave', battleId: 'new-wave', currentHp: 100, maxHp: 100, atb: 0, state: 'idle', x: 600, y: 250 };
  engine.enemies.push(fresh);engine.paused = true;ticks(engine, 1);
  assert.equal(actor.special.name, 'custom');assert.equal(fresh.special.name, 'Kamehameha');
});

test('random multihit preview shows a per-target range, not full damage on everyone', () => {
  const { engine, actor, target } = make(kits.cloud_ff7);
  const second = { ...target, id: 'second', battleId: 'second', runtimeId: 'second', x: 320 };
  engine.enemies.push(second);
  assert.equal(engine.beginTargeting(actor, 'special'), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.sourceHits, 15);assert.equal(preview.sourceDistribution, 'random');
  assert.equal(preview.estimates.length, 2);assert.ok(preview.estimates.every(entry => entry.min === 0 && entry.amount < entry.max));
  const shield = 200;target.battleItemShield = shield;
  assert.equal(engine.getTargetingState().estimates[0].max, 0);assert.equal(target.battleItemShield, shield);
  engine.cancelTargeting();assert.equal(actor.specialCharge, 100);assert.equal(actor.atb, 100);
});
