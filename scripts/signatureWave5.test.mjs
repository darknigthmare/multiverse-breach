import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, kits, prepare, resolve, heroes, enemies, EngineRpg, EngineSmash, install;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ SIGNATURE_SOURCE_KITS: kits, prepareSourceSignature: prepare, resolveSourceSignature: resolve } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => vite?.close());
const template = d => d.actorId ? heroes.find(a => a.id === d.actorId)
  : [...enemies[d.universe].monsters, ...enemies[d.universe].bosses, enemies[d.universe].worldBoss].filter(Boolean).find(a => a.name === d.enemyName);
const tick = (e, n = 1) => { for (let i = 0; i < n; i++) e.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
function make(key = 'hexen_parias', mode = 'RPG', side = 'player') {
  const d = kits[key], source = { ...structuredClone(template(d)), universe: d.universe };
  source.stats ||= { hp: source.hp, atk: source.atk, def: source.def || 0, spd: source.spd || 1 };
  const fixture = { id: 'wave5-fixture', name: 'Wave5 target', universe: d.universe, hp: 30000, atk: 1, spd: 1,
    stats: { hp: 30000, atk: 1, def: 0, spd: 1 }, simple: { name: 'Test', type: 'melee', dmg: 1 } };
  const lead = side === 'player' ? source : fixture;
  const foe = side === 'enemy' ? { ...source, hp: source.stats.hp, atk: source.stats.atk } : fixture;
  const e = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [lead],
    { customRoster: [foe], monsters: [foe], bosses: [] }, { add() {} }, () => {}, () => {},
    { universe: d.universe, mode, disableHazards: true, disableSignatureAI: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  e.syncPreMatchFromServer?.(3000); e.completeMeleeIntros?.();
  for (const a of [...e.heroes, ...e.enemies]) Object.assign(a, { currentHp: 30000, maxHp: 30000,
    state: 'idle', stateTimer: 0, action: null, actionPending: false, charging: false, guarding: false,
    ledge: null, atb: 0, specialCharge: 0, vx: 0, vy: 0, y: e.groundY || 260 });
  e.heroes[0].x = 160; e.heroes[0].facing = 1; e.enemies[0].x = 460; e.enemies[0].facing = -1;
  const actor = side === 'player' ? e.heroes[0] : e.enemies[0], target = side === 'player' ? e.enemies[0] : e.heroes[0];
  actor.atb = 100; actor.specialCharge = 100;
  install(e, { mode }); engines.push(e); return { e, actor, target, d, mode, side };
}
const trigger = s => s.mode === 'RPG' ? s.e.executeRpgAction(s.e.getActionContext(s.actor, 'special', s.side), [s.target.battleId])
  : s.side === 'player' ? s.e.triggerAbility(s.actor, 'special') : s.e.triggerOpponentAbility('special');

test('six RE identities exist; all 112 previous source definitions remain registered', () => {
  assert.equal(Object.values(kits).filter(d => d.wave === 5).length, 6);
  assert.equal(Object.values(kits).filter(d => !d.wave || d.wave < 5).length, 112);
  for (const d of Object.values(kits).filter(d => d.wave === 5)) {
    const original = template(d); assert.ok(original, d.key);
    const before = JSON.stringify(original), a = { ...original, universe: d.universe };
    assert.equal(resolve(a), d); prepare(a); assert.equal(a.special.name, d.name); assert.equal(JSON.stringify(original), before);
    assert.equal(d.delivery, 'melee'); assert.equal(d.canonicalFidelityApproved, false);
    assert.equal(prepare({ ...original, universe: 'Other' }), null);
    assert.equal(prepare({ ...original, universe: d.universe, nonCombat: true }), null);
    assert.equal(prepare({ ...original, universe: d.universe, special: { name: 'Custom', dmg: 1 } }), null);
  }
});
test('only the two explicit Wraithverge wielders receive independent spirits', () => {
  assert.deepEqual(Object.values(kits).filter(d => d.summonAgent).map(d => d.key).sort(), ['Hexen::Traductus', 'hexen_parias']);
  for (const key of ['hexen_parias', 'Hexen::Traductus']) assert.equal(kits[key].hits, 4);
  assert.equal(kits.hexen_daedolon.summonAgent, undefined);
  assert.equal(kits.hexen_baratus.summonAgent, undefined);
});
for (const mode of ['RPG', 'Smash']) for (const side of ['player', 'enemy']) {
  test(`${mode}/${side}: manifestation releases four spirits, not four instant hits`, () => {
    const s = make('hexen_parias', mode, side), { e, actor, target, d } = s;
    const hp = target.currentHp, hits = [], damage = e.applyDamage;
    e.applyDamage = (...args) => { if (args[0] === actor && args[1] === target) hits.push(args[2]); return damage(...args); };
    assert.equal(trigger(s), true); assert.equal(actor.specialCharge, 0);
    if (mode === 'RPG') assert.equal(actor.atb, 0);
    tick(e, d.windupTicks + d.revealTicks);
    assert.equal(hits.length, 0); assert.equal(target.currentHp, hp); assert.equal(e.signatureDirector.getSummonState().length, 4);
    assert.equal(e.signatureDirector.freezesWorld, false);
    const before = e.signatureDirector.getSummonState(); e.paused = true; tick(e, 100);
    assert.deepEqual(e.signatureDirector.getSummonState(), before); e.paused = false;
    tick(e, 150); assert.equal(hits.length, 4); assert.ok(target.currentHp < hp);
    assert.equal(e.signatureDirector.getSummonState().length, 0); assert.equal(actor.actionPending, false);
  });
  for (const who of ['actor', 'target']) test(`${mode}/${side}: immediate ${who} KO and resurrection cancels the old spirits`, () => {
    const s = make('hexen_parias', mode, side); trigger(s); tick(s.e, s.d.windupTicks + s.d.revealTicks);
    const victim = s[who], attacker = who === 'actor' ? s.target : s.actor;
    s.e.applyDamage(attacker, victim, 1000000); victim.currentHp = victim.maxHp; victim.state = 'idle';
    assert.equal(s.e.signatureDirector.getSummonState().length, 0);
    const hp = s.target.currentHp; tick(s.e, 200); assert.equal(s.target.currentHp, hp);
  });
}
test('RPG preview identifies collision-based summons without spending resources', () => {
  const s = make(); assert.equal(s.e.beginTargeting(s.actor, 'special'), true);
  const state = s.e.getTargetingState(); assert.equal(state.sourceProfile.summonAgent, 'wraithverge-spirit');
  assert.ok(state.estimates.every(entry => entry.min === 0), 'a spirit can miss before lifetime expiry');
  assert.equal(state.sourceHits, 4); assert.equal(s.actor.atb, 100); assert.equal(s.actor.specialCharge, 100);
  s.e.cancelTargeting(); assert.equal(s.actor.atb, 100);
});
test('the active swarm prevents a fresh cast after cinematic release', () => {
  const s = make(); trigger(s); tick(s.e, s.d.windupTicks + s.d.revealTicks);
  // Hold simulation paused while checking the ownership snapshot, then unpause
  // and move the target far away so the original spirits remain alive.
  s.target.x = 10000; tick(s.e, 49); s.actor.atb = s.actor.specialCharge = 100;
  assert.equal(s.e.signatureDirector.busy, false); assert.ok(s.e.signatureDirector.getSummonState().length);
  assert.equal(trigger(s), false); assert.equal(s.actor.atb, 100); assert.equal(s.actor.specialCharge, 100);
});

for (const field of ['x', 'y']) test(`RPG rejects invalid summon position ${field} before resource consumption`, () => {
  const s = make(); s.actor[field] = NaN;
  assert.equal(trigger(s), false); assert.equal(s.actor.atb, 100); assert.equal(s.actor.specialCharge, 100);
  assert.equal(s.e.signatureDirector.getSummonState().length, 0);
});

for (const mode of ['RPG', 'Smash']) test(`${mode}: the release marker never clears a later hit reaction`, () => {
  const s = make('hexen_parias', mode); assert.equal(trigger(s), true);
  tick(s.e, s.d.windupTicks + s.d.revealTicks);
  assert.equal(s.e.signatureDirector.snapshot().hits, 1, 'the cinematic has a single release, not four later executor calls');
  assert.equal(s.e.signatureDirector.snapshot().summonCount, 4);
  s.actor.state = 'hit'; s.actor.stateTimer = 80;
  tick(s.e, 20);
  assert.equal(s.actor.state, 'hit', 'presentation reset a genuine reaction after releasing control');
});
