import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { SIGNATURE_WAVE6_ROWS, SIGNATURE_WAVE6_REFERENCES } from '../src/game/signatureSourceWave6.js';
let vite, heroes, enemies, kits, resolve, prepare, Rpg, Smash, install, codex;
const engines = [];
const keys = ['seifer_ff8', 'laguna_ff8', 'zell_ff8', 'irvine_ff8',
  'Final Fantasy VII::Midgar Zolom', 'Final Fantasy VII::Sweeper Machine'];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ SIGNATURE_SOURCE_KITS: kits, resolveSourceSignature: resolve, prepareSourceSignature: prepare } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({ EngineRpg: Rpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash: Smash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  ({ getSignatureCodex: codex } = await vite.ssrLoadModule('/src/game/signatureCodex.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => vite?.close());
function template(d) {
  if (d.actorId) return heroes.find(h => h.id === d.actorId);
  return { ...enemies[d.universe].monsters.find(a => a.name === d.enemyName), universe: d.universe };
}
const qa = id => ({ id, name: id, universe: 'Nexus de Convergence', hp: 20000, atk: 1, def: 0, spd: 1,
  stats: { hp: 20000, atk: 1, def: 0, spd: 1 }, simple: { name: 'QA strike', type: 'melee', dmg: 1 }, defense: { reduce: 0, dur: 1 } });
function fixture(key, mode, side = 'player', count = 1) {
  const d = kits[key], source = structuredClone(template(d));
  source.stats ||= { hp: source.hp, atk: source.atk, def: source.def || 0, spd: source.spd || 1 };
  const targets = Array.from({ length: count }, (_, i) => qa(`qa-${i}`));
  const squad = side === 'player' ? [source] : targets;
  const opponents = side === 'enemy' ? [source] : targets;
  const e = new (mode === 'RPG' ? Rpg : Smash)(760, 420, squad,
    { customRoster: opponents, monsters: opponents, bosses: [] }, { add() {} }, () => {}, () => {},
    { universe: d.universe, mode, disableHazards: true, disableSignatureAI: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e);e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();
  const actor = side === 'player' ? e.heroes[0] : e.enemies[0];
  const victims = side === 'player' ? e.enemies : e.heroes;
  for (const a of [...e.heroes, ...e.enemies]) Object.assign(a, { state: 'idle', stateTimer: 0,
    action: null, actionPending: false, charging: false, guarding: false, ledge: null,
    atb: 0, specialCharge: 0, vx: 0, vy: 0, y: 260, invulnTimer: 0 });
  Object.assign(actor, { x: 240, facing: 1, atb: 100, specialCharge: 100 });
  victims.forEach((a, i) => Object.assign(a, { x: 275 + i * 30, facing: -1 }));
  install(e, { mode });
  const calls = [], damage = e.applyDamage;
  e.applyDamage = (...args) => { if (args[0] === actor) calls.push({ target: args[1], amount: args[2] });return damage(...args); };
  const fire = () => mode === 'Smash' ? (side === 'player' ? e.triggerAbility(actor, 'special') : e.triggerOpponentAbility('special'))
    : e.executeRpgAction(e.getActionContext(actor, 'special', side), e.chooseDefaultTargets(e.getActionContext(actor, 'special', side)));
  return { e, d, actor, victims, calls, fire };
}
const tick = (e, n) => { for (let i = 0; i < n; i++) e.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
const impact = d => d.windupTicks + d.revealTicks;
const duration = d => impact(d) + (d.hits - 1) * d.hitGapTicks + d.outroTicks;

test('six new identities, bounded profiles and secondary-source evidence; historical rows are preserved', () => {
  assert.deepEqual(SIGNATURE_WAVE6_ROWS.map(d => d.key), keys);
  assert.equal(Object.values(kits).filter(d => !d.wave || d.wave <= 5).length, 118);
  assert.equal(Object.values(kits).filter(d => d.wave === 6).length, 6);
  assert.equal(new Set(SIGNATURE_WAVE6_ROWS.map(d => d.key)).size, 6);
  for (const d of SIGNATURE_WAVE6_ROWS) {
    assert.equal(Object.isFrozen(d), true);assert.equal(kits[d.key].canonicalFidelityApproved, false);
    assert.equal(d.evidenceLevel, 'secondary-gameplay-reference');
    assert.equal(kits[d.key].referenceUrl, SIGNATURE_WAVE6_REFERENCES[d.source]);
    assert.ok(kits[d.key].range > 0 && kits[d.key].range < 500);
  }
});
for (const key of keys) {
  test(`${key}: resolves an exact catalog identity without modifying shared data`, () => {
    const d = kits[key], raw = template(d), before = JSON.stringify(raw);
    assert.ok(raw.name);assert.equal(resolve(raw), d);assert.equal(codex(raw).name, d.name);
    const copy = { ...raw };prepare(copy);assert.notEqual(copy.special, raw.special);
    assert.equal(copy.special.sourceSignatureKey, key);assert.equal(JSON.stringify(raw), before);
    assert.equal(copy.special.rpgProfile.effect, 'damage');assert.equal(copy.special.smashProfile.range, d.range);
  });
  test(`${key}: refuses unrelated universes, noncombatants and custom moves`, () => {
    const raw = template(kits[key]);
    for (const patch of [{ universe: 'Other' }, { nonCombat: true }, { combatEligible: false },
      { special: { name: 'Custom', dmg: 12 } }, { special: { ...(raw.special || {}), rpgProfile: {} } }]) {
      assert.equal(resolve({ ...raw, ...patch }), null);
    }
  });
  for (const mode of ['RPG', 'Smash']) for (const side of ['player', 'enemy']) {
    test(`${key}/${mode}/${side}: deferred native impacts, one cost, pause and disposal`, () => {
      const { e, d, actor, victims, calls, fire } = fixture(key, mode, side);
      const hp = victims[0].currentHp;
      assert.equal(fire(), true);assert.equal(actor.specialCharge, 0);assert.equal(fire(), false);
      if (mode === 'RPG') assert.equal(actor.atb, 0);
      tick(e, impact(d) - 1);assert.equal(calls.length, 0);assert.equal(victims[0].currentHp, hp);
      e.setPaused(true);const frame = e.signatureDirector.snapshot();tick(e, 120);
      assert.deepEqual(e.signatureDirector.snapshot(), frame);assert.equal(calls.length, 0);
      e.setPaused(false);tick(e, duration(d) - impact(d) + 1);
      assert.equal(calls.length, d.hits);assert.ok(victims[0].currentHp < hp);
      assert.equal(e.signatureDirector.busy, false);assert.equal(actor.actionPending, false);
      assert.ok(calls.every(c => c.target === victims[0]));
      assert.ok(Math.abs(calls.reduce((sum, c) => sum + c.amount, 0) - (actor.stats?.atk ?? actor.atk) * actor.special.dmg) < 1e-8);
      e.dispose();const last = victims[0].currentHp;tick(e, 20);assert.equal(victims[0].currentHp, last);
    });
  }
}
for (const mode of ['RPG', 'Smash']) {
  test(`${mode}: group attacks preserve multiple confirmed victims without hitting allies`, () => {
    const { e, d, actor, victims, calls, fire } = fixture('laguna_ff8', mode, 'player', 3);
    const hp = actor.currentHp;
    assert.equal(fire(), true);tick(e, duration(d));
    assert.equal(new Set(calls.map(c => c.target)).size, victims.length);
    assert.equal(actor.currentHp, hp);assert.equal(calls.length, victims.length);
  });
  test(`${mode}: six Quick Shot contacts remain on one target, not the other two`, () => {
    const { e, d, victims, calls, fire } = fixture('irvine_ff8', mode, 'player', 3);
    assert.equal(fire(), true);tick(e, duration(d));
    assert.equal(calls.length, 6);assert.equal(new Set(calls.map(c => c.target)).size, 1);
    assert.equal(victims.filter(a => a.currentHp < a.maxHp).length, 1);
  });
  for (const side of ['player', 'enemy']) {
    test(`${mode}/${side}: a killed and immediately revived target cannot receive remaining old shots`, () => {
      const { e, d, victims, calls, fire } = fixture('irvine_ff8', mode, side, 2);
      assert.equal(fire(), true);tick(e, impact(d));assert.equal(calls.length, 1);
      const victim = calls[0].target, spare = victims.find(v => v !== victim), spareHp = spare.currentHp;
      e.applyDamage({ stats: { atk: 1 }, x: 20, y: 260 }, victim, 1e8, 0);assert.equal(victim.currentHp, 0);
      Object.assign(victim, { currentHp: victim.maxHp, state: 'idle', stateTimer: 0, invulnTimer: 0 });
      const restored = victim.currentHp;calls.length = 0;tick(e, duration(d) - impact(d));
      assert.equal(calls.length, 0);assert.equal(victim.currentHp, restored);assert.equal(spare.currentHp, spareHp);
    });
    test(`${mode}/${side}: a changed target incarnation does not inherit remaining contacts`, () => {
      const { e, d, calls, fire } = fixture('irvine_ff8', mode, side, 2);
      assert.equal(fire(), true);tick(e, impact(d));assert.equal(calls.length, 1);
      calls[0].target.incarnation = 'Different incarnation';calls.length = 0;
      tick(e, duration(d) - impact(d));assert.equal(calls.length, 0);
    });
  }
}
test('Smash: Zell cannot spend his limit on an opponent across the arena', () => {
  const { actor, victims, fire } = fixture('zell_ff8', 'Smash');victims[0].x = 700;
  assert.equal(fire(), false);assert.equal(actor.specialCharge, 100);
});
test('Smash: Quick Shot loses later contacts when the confirmed target leaves range', () => {
  const { e, d, actor, calls, fire } = fixture('irvine_ff8', 'Smash');
  assert.equal(fire(), true);tick(e, impact(d));assert.equal(calls.length, 1);
  calls[0].target.x = 730;tick(e, duration(d) - impact(d));assert.equal(calls.length, 1);assert.equal(actor.specialCharge, 0);
});
for (const mode of ['RPG', 'Smash']) {
  test(`${mode}: losing one group target preserves the other confirmed impacts`, () => {
    const { e, d, victims, calls, fire } = fixture('laguna_ff8', mode, 'player', 3);
    assert.equal(fire(), true);tick(e, 8);victims[0].incarnation = 'Replacement';
    tick(e, duration(d) - 8);assert.equal(calls.length, 2);
    assert.ok(calls.every(c => c.target !== victims[0]));
  });
  test(`${mode}: ordinary HP and defense changes do not invalidate a confirmed life`, () => {
    const { e, d, victims, calls, fire } = fixture('irvine_ff8', mode);
    assert.equal(fire(), true);victims[0].currentHp -= 30;
    if (victims[0].stats) victims[0].stats.def = 2; else victims[0].def = 2;
    tick(e, duration(d));assert.equal(calls.length, 6);
  });
  test(`${mode}: a fresh action may target a revived life without inheriting the old burst`, () => {
    const { e, d, actor, calls, fire } = fixture('irvine_ff8', mode, 'player', 2);
    assert.equal(fire(), true);tick(e, impact(d));const victim = calls[0].target;
    e.applyDamage({ stats: { atk: 1 }, x: 20, y: 260 }, victim, 1e8, 0);
    Object.assign(victim, { currentHp: victim.maxHp, state: 'idle', stateTimer: 0, invulnTimer: 0, x: 275 });
    tick(e, duration(d) - impact(d));assert.equal(calls.length, 1);
    Object.assign(actor, { state: 'idle', actionPending: false, stateTimer: 0, specialCharge: 100, atb: 100 });
    calls.length = 0;assert.equal(fire(), true);tick(e, duration(d));assert.equal(calls.length, 6);
  });
}
