import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, heroes, enemies, kits, prepare, resolve, EngineRpg, EngineSmash, install, createSupport;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ SIGNATURE_SOURCE_KITS: kits, prepareSourceSignature: prepare, resolveSourceSignature: resolve } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  ({ createSignatureMedicSupport: createSupport } = await vite.ssrLoadModule('/src/game/signatureMedicSupport.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => vite?.close());
const template = d => d.actorId ? heroes.find(a => a.id === d.actorId)
  : [...enemies[d.universe].monsters, ...enemies[d.universe].bosses, enemies[d.universe].worldBoss].filter(Boolean).find(a => a.name === d.enemyName);
const ticks = (e, n = 1) => { for (let i = 0; i < n; i++) e.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
const duration = d => d.windupTicks + d.revealTicks + (d.hits - 1) * d.hitGapTicks + d.outroTicks;
const make = (mode = 'RPG', key = 'team_fortress_2_medic', side = 'player', teamSize = 3) => {
  const d = kits[key], source = structuredClone(template(d));
  source.universe = d.universe;
  source.stats ||= { hp: source.hp, atk: source.atk, def: source.def || 0, spd: source.spd || 1 };
  const ally = index => ({ id: `ally-${index}`, name: `Patient ${index}`, universe: d.universe,
    stats: { hp: 1000, atk: 1, def: 0, spd: 1 }, simple: { name: 'Fixture', type: 'melee', dmg: 1 }, defense: { reduce: 0, dur: 1 } });
  const foe = { id: 'wave3-foe', name: 'Wave 3 target', universe: d.universe, hp: 20000, atk: 1, def: 0, spd: 1 };
  const roster = side === 'player' ? [source, ...Array.from({ length: teamSize - 1 }, (_, i) => ally(i))] : [ally(0)];
  const opponents = side === 'enemy' ? [{ ...source, hp: source.stats.hp, atk: source.stats.atk }] : [foe];
  const e = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, roster,
    { customRoster: opponents, monsters: opponents, bosses: [] }, { add() {} }, () => {}, () => {},
    { mode, universe: d.universe, disableHazards: true, disableSignatureAI: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  e.syncPreMatchFromServer?.(3000); e.completeMeleeIntros?.();
  for (const a of [...e.heroes, ...e.enemies]) Object.assign(a, { state: 'idle', stateTimer: 0, action: null,
    actionPending: false, charging: false, guarding: false, ledge: null, atb: 0, specialCharge: 0, vx: 0, vy: 0, y: 260 });
  e.heroes.forEach((a, i) => Object.assign(a, { x: 200 + 45 * i, facing: 1 }));
  e.enemies.forEach(a => Object.assign(a, { x: 250, facing: -1 }));
  const actor = side === 'player' ? e.heroes[0] : e.enemies[0];
  actor.atb = 100; actor.specialCharge = 100;
  install(e, { mode }); engines.push(e);
  return { e, actor, patient: e.heroes[1] || actor, other: e.heroes[2], foe: side === 'player' ? e.enemies[0] : e.heroes[0], d };
};
const trigger = ({ e, actor, patient }, mode, side = 'player') => mode === 'RPG'
  ? e.executeRpgAction(e.getActionContext(actor, 'special', side), [(side === 'player' ? patient : actor).battleId])
  : side === 'player' ? e.triggerAbility(actor, 'special') : e.triggerOpponentAbility('special');
const activate = mode => {
  const setup = make(mode); assert.equal(trigger(setup, mode), true); ticks(setup.e, duration(setup.d)); return setup;
};

test('wave 3 adds eight checked identities and leaves the original 88 unchanged', () => {
  assert.equal(Object.values(kits).filter(d => d.wave === 3).length, 8);
  assert.equal(Object.values(kits).filter(d => d.wave !== 3).length, 88);
  for (const d of Object.values(kits).filter(d => d.wave === 3)) {
    const original = template(d); assert.ok(original, d.key);
    const actor = { ...original, universe: d.universe }; const raw = JSON.stringify(original);
    assert.equal(resolve(actor), d); assert.equal(prepare(actor), d); assert.equal(resolve(actor), d);
    assert.equal(JSON.stringify(original), raw);
    assert.ok(d.referenceUrl.startsWith('https://')); assert.equal(d.canonicalFidelityApproved, false);
    assert.equal(Object.isFrozen(d), true);
    assert.equal(resolve({ ...actor, universe: 'Wrong universe', sourceUniverse: 'Wrong universe' }), null);
    assert.equal(prepare({ ...original, universe: d.universe, special: { name: 'Custom', dmg: 2 } }), null);
    for (const flag of ['nonCombat', 'combatEnabled', 'combatEligible']) {
      assert.equal(prepare({ ...original, universe: d.universe, [flag]: flag === 'nonCombat' }), null);
    }
  }
});
test('all eight profiles execute in both engines and both sides', async t => {
  for (const d of Object.values(kits).filter(row => row.wave === 3)) for (const mode of ['RPG', 'Smash']) for (const side of ['player', 'enemy']) {
    await t.test(`${d.key} / ${mode} / ${side}`, () => {
      const s = make(mode, d.key, side, 1); const { e, actor, foe } = s;
      const contacts = []; const apply = e.applyDamage; e.applyDamage = (...args) => { contacts.push(args); return apply(...args); };
      const context = mode === 'RPG' ? e.getActionContext(actor, 'special', side) : null;
      const start = mode === 'RPG' ? e.executeRpgAction(context, e.chooseDefaultTargets(context))
        : side === 'player' ? e.triggerAbility(actor, 'special') : e.triggerOpponentAbility('special');
      const hp = foe.currentHp; assert.equal(start, true); assert.equal(actor.specialCharge, 0);
      ticks(e, duration(d)); assert.equal(e.signatureDirector.busy, false); assert.equal(actor.actionPending, false);
      if (d.protection) { assert.equal(contacts.length, 0); assert.equal(foe.currentHp, hp); assert.equal(e.signatureDirector.getSupportState().length, 1); }
      else { assert.equal(contacts.length, d.hits); assert.ok(foe.currentHp < hp); }
    });
  }
});
for (const mode of ['RPG', 'Smash']) {
  test(`${mode}: stock Uber protects only Medic and the selected patient, without healing`, () => {
    const s = activate(mode); const { e, actor, patient, other, foe } = s;
    assert.equal(e.signatureDirector.getSupportState().length, 1);
    const saved = [actor, patient, other].map(a => a.currentHp);
    const shield = patient.battleItemShield = 30;
    assert.equal(e.applyDamage(foe, actor, 20, 10), 0);
    assert.equal(e.applyDamage(foe, patient, 20, 10), 0);
    assert.equal(patient.battleItemShield, shield);
    e.applyDamage(foe, other, 20, 10);
    assert.equal(actor.currentHp, saved[0]); assert.equal(patient.currentHp, saved[1]); assert.ok(other.currentHp < saved[2]);
    assert.equal(actor.specialCharge, 0);
    if (mode === 'Smash') assert.notEqual(patient.vx, 0, 'Uber removed knockback');
  });
  test(`${mode}: no protection before manifestation and an interruption spends no second charge`, () => {
    const s = make(mode); assert.equal(trigger(s, mode), true);
    ticks(s.e, 10); s.e.applyDamage(s.foe, s.actor, 10);
    assert.equal(s.e.signatureDirector.busy, false); assert.equal(s.e.signatureDirector.getSupportState().length, 0);
    assert.equal(s.actor.specialCharge, 0); assert.equal(s.actor.actionPending, false);
  });
  test(`${mode}: protection lasts exactly 480 gameplay ticks and freezes during pause`, () => {
    const { e, actor, patient, foe } = activate(mode);
    assert.equal(e.signatureDirector.getSupportState()[0].ticks, 480);
    e.setPaused(true); ticks(e, 1000); assert.equal(e.signatureDirector.getSupportState()[0].ticks, 480);
    e.setPaused(false); ticks(e, 479); assert.equal(e.signatureDirector.getSupportState()[0].ticks, 1);
    const hp = patient.currentHp; assert.equal(e.applyDamage(foe, patient, 10, 0), 0);
    ticks(e); assert.equal(e.signatureDirector.getSupportState().length, 0);
    e.applyDamage(foe, patient, 50, 0); assert.ok(patient.currentHp < hp);
    assert.equal(actor.actionPending, false);
  });
  test(`${mode}: removal, KO and revival of a patient cannot transfer a beam`, () => {
    const { e, actor, patient, other, foe } = activate(mode);
    patient.currentHp = 0; patient.state = 'dead';
    assert.equal(e.signatureDirector.getSupportState()[0].patientId, undefined);
    patient.currentHp = patient.maxHp; patient.state = 'idle';
    const hp = patient.currentHp; e.applyDamage(foe, patient, 50, 0); assert.ok(patient.currentHp < hp);
    const before = other.currentHp; e.applyDamage(foe, other, 50, 0); assert.ok(other.currentHp < before);
    assert.equal(e.applyDamage(foe, actor, 10, 0), 0);
  });
  test(`${mode}: an out-of-range patient disconnects without silent reacquisition`, () => {
    const { e, actor, patient, foe } = activate(mode);
    patient.x = actor.x + 321;
    assert.equal(e.signatureDirector.getSupportState()[0].patientName, null);
    patient.x = actor.x + 40;
    const hp = patient.currentHp; e.applyDamage(foe, patient, 50, 0); assert.ok(patient.currentHp < hp);
    assert.equal(e.applyDamage(foe, actor, 10, 0), 0);
  });
  test(`${mode}: Medic attack ends only his own protection, never keeps a free attack shield`, () => {
    const { e, actor, patient, foe } = activate(mode);
    e.applyDamage(actor, foe, 20, 0);
    assert.equal(e.signatureDirector.getSupportState().length, 0);
    const hp = patient.currentHp; e.applyDamage(foe, patient, 50, 0); assert.ok(patient.currentHp < hp);
  });
  test(`${mode}: protection does not block unknown environment damage`, () => {
    const { e, actor } = activate(mode); const hp = actor.currentHp;
    e.applyDamage({ x: 0, y: 260, stats: { atk: 1 } }, actor, 20, 0);
    assert.ok(actor.currentHp < hp);
  });
  test(`${mode}: caster KO, side change, weapon change and disposal clean owned links`, () => {
    for (const change of ['ko', 'side', 'weapon', 'identity', 'universe', 'dispose']) {
      const { e, actor } = activate(mode);
      if (change === 'ko') actor.currentHp = 0;
      if (change === 'side') { e.heroes = e.heroes.filter(a => a !== actor); e.enemies.push(actor); }
      if (change === 'weapon') actor.medigunType = 'kritzkrieg';
      if (change === 'identity') actor.sourceId = 'unrelated';
      if (change === 'universe') actor.sourceUniverse = 'Wrong universe';
      if (change === 'dispose') e.dispose();
      assert.equal(e.signatureDirector.getSupportState().length, 0, change);
    }
  });
  test(`${mode}: Kritzkrieg, Quick-Fix and Vaccinator never acquire stock invulnerability`, () => {
    for (const weapon of ['kritzkrieg', 'quick-fix', 'vaccinator']) {
      const s = make(mode); s.actor.medigunType = weapon;
      assert.equal(trigger(s, mode), false); assert.equal(s.actor.specialCharge, 100);
      assert.equal(s.e.signatureDirector.getSupportState().length, 0);
    }
  });
  test(`${mode}: duplicate activation while active does not overwrite or extend the beam`, () => {
    const s = activate(mode); const first = s.e.signatureDirector.getSupportState();
    s.actor.atb = 100; s.actor.specialCharge = 100;
    assert.equal(trigger(s, mode), false); assert.equal(s.actor.specialCharge, 100);
    assert.deepEqual(s.e.signatureDirector.getSupportState(), first);
  });
}
test('Smash self-only activation remains possible with an out-of-range teammate', () => {
  const s = make('Smash'); s.patient.x = 750; s.other.x = 730;
  assert.equal(trigger(s, 'Smash'), true); ticks(s.e, duration(s.d));
  assert.equal(s.e.signatureDirector.getSupportState()[0].patientId, s.actor.id);
});
test('RPG invalid far patient is absent from targeting and cannot consume resources', () => {
  const s = make(); s.patient.x = s.actor.x + 321;
  const context = s.e.getActionContext(s.actor, 'special', 'player');
  assert.equal(context.eligibleTargets.includes(s.patient), false);
  assert.equal(s.e.executeRpgAction(context, [s.patient.battleId]), false);
  assert.equal(s.actor.atb, 100); assert.equal(s.actor.specialCharge, 100);
});
test('RPG manual self selection is not silently replaced with another ally', () => {
  const s = make(); const context = s.e.getActionContext(s.actor, 'special', 'player');
  assert.equal(s.e.executeRpgAction(context, [s.actor.battleId]), true); ticks(s.e, duration(s.d));
  assert.equal(s.e.signatureDirector.getSupportState()[0].patientId, s.actor.battleId);
  const hp = s.patient.currentHp; s.e.applyDamage(s.foe, s.patient, 30); assert.ok(s.patient.currentHp < hp);
});
test('RPG an enemy attack preview reflects stock protection without spending it', () => {
  const { e, patient, foe } = activate('RPG'); foe.atb = 100;
  assert.equal(e.beginTargeting(foe, 'simple', 'enemy'), true);
  const before = e.signatureDirector.getSupportState();
  const preview = e.previewTargets([patient.battleId]); const estimate = preview.estimates.find(a => a.id === patient.battleId);
  assert.equal(estimate.blockedByUber, true); assert.equal(estimate.amount, 0); assert.equal(estimate.max, 0);
  assert.deepEqual(e.signatureDirector.getSupportState(), before); e.cancelTargeting();
});
test('two Medic links stay independent, removing one never removes the other', () => {
  const s = make(); const caster2 = { ...s.actor, sourceId: 'team_fortress_2_medic', id: 'other-medic', battleId: 'other-medic', runtimeId: 'other-medic' };
  s.e.heroes.push(caster2); const support = createSupport(s.e, 'RPG');
  assert.equal(support.grant(s.actor, s.patient, s.d), true);
  assert.equal(support.grant(caster2, s.patient, s.d), true);
  support.release(s.actor); assert.equal(support.protects(s.patient), true); assert.equal(support.protects(s.actor), false);
  support.release(caster2); assert.equal(support.protects(s.patient), false);
});
test('pure support rejects noncombat, dead, foreign, unpositioned and malformed links', () => {
  const s = make(); const support = createSupport(s.e, 'RPG');
  for (const fields of [{ currentHp: 0 }, { nonCombat: true }, { combatEligible: false }, { x: NaN }, { x: Infinity }]) {
    const copy = { ...s.patient, ...fields }; s.e.heroes.push(copy);
    assert.equal(support.grant(s.actor, copy, s.d), false);
  }
  assert.equal(support.grant(s.actor, s.foe, s.d), false);
  assert.equal(support.grant(s.actor, s.patient, { ...s.d, range: NaN }), false);
  assert.equal(support.grant(s.actor, s.patient, { ...s.d, key: '__proto__' }), false);
});
test('Dog basic gun is corrected only when the exact generic action remains uncustomized', () => {
  const dog = heroes.find(a => a.id === 'dog_hl2'); const baseline = JSON.stringify(dog);
  const actor = { ...dog }; prepare(actor); assert.equal(actor.simple.type, 'melee'); assert.equal(actor.weaponType, 'fists');
  assert.notEqual(actor.simple, dog.simple); assert.equal(JSON.stringify(dog), baseline);
  for (const action of [{ ...dog.simple, name: 'Custom' }, { ...dog.simple, rpgProfile: { effect: 'heal' } }, { ...dog.simple, smashProfile: { range: 42 } }]) {
    const custom = { ...dog, simple: action }; prepare(custom); assert.equal(custom.simple, action);
  }
});
test('Makron is restricted to its Quake II identity and never grants Jorg or Korax a generic finisher', () => {
  const d = kits['Quake::Makron — Quake II']; const actor = { ...template(d), universe: 'Quake' };
  assert.equal(resolve(actor), d);
  assert.equal(resolve({ ...actor, continuityScope: 'Quake 4 (2005)' }), null);
  assert.equal(resolve({ ...actor, sourceId: 'jorg' }), null);
  assert.equal(kits['Hexen::Korax'], undefined);
});
