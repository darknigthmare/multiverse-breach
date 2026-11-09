import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, kits, resolve, prepare, heroes, enemies, EngineRpg, EngineSmash, install;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ SIGNATURE_SOURCE_KITS: kits, resolveSourceSignature: resolve, prepareSourceSignature: prepare } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
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
const ticks = (e, n) => { for (let i = 0; i < n; i++) e.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
const make = (key, mode = 'Smash') => {
  const d = kits[key], source = structuredClone(template(d));
  source.universe = d.universe;
  source.stats ||= { hp: source.hp, atk: source.atk, def: source.def || 0, spd: source.spd || 1 };
  const foe = { id: 'wave2-foe', name: 'Wave 2 fixture', universe: d.universe, hp: 20000, atk: 1, def: 0, spd: 1 };
  const stage = { mode, universe: d.universe, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const e = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [source], { customRoster: [foe], monsters: [foe], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  e.syncPreMatchFromServer?.(3000); e.completeMeleeIntros?.();
  for (const a of [...e.heroes, ...e.enemies]) Object.assign(a, { state: 'idle', action: null, actionPending: false, atb: 100, specialCharge: 100, charging: false, guarding: false, ledge: null, x: 200, y: 260 });
  e.heroes[0].facing = 1; e.enemies[0].x = 260;
  install(e, { mode }); engines.push(e); return e;
};

test('wave 2 adds 49 explicit identities and retains all 39 original definitions', () => {
  const rows = Object.values(kits).filter(d => d.wave === 2);
  assert.equal(rows.length, 49);
  assert.equal(rows.filter(d => d.actorId).length, 19);
  assert.equal(rows.filter(d => d.enemyName).length, 30);
  assert.equal(Object.values(kits).filter(d => !d.wave || d.wave === 2).length, 88);
  assert.equal(new Set(rows.map(d => d.key)).size, 49);
  for (const d of rows) {
    assert.ok(template(d), d.key);
    assert.equal(Object.isFrozen(d), true);
    assert.equal(d.canonicalFidelityApproved, false);
    assert.ok(d.referenceUrl.startsWith('https://'));
    assert.ok(d.hits > 0 && Number.isInteger(d.hits));
    assert.ok(d.range > (d.minRange || 0));
  }
});
test('prepared identities reject a changed source ID or Quake continuity', () => {
  for (const d of Object.values(kits).filter(d => d.wave === 2)) {
    const a = { ...structuredClone(template(d)), universe: d.universe };
    prepare(a);
    assert.equal(resolve(a), d);
    if (d.enemyId) assert.equal(resolve({ ...a, sourceId: 'unrelated-enemy' }), null, d.key);
    if (d.requiredContinuity) {
      assert.equal(resolve({ ...a, continuityScope: 'Quake 4 (2005)' }), null, d.key);
      assert.equal(resolve({ ...a, continuityScope: undefined }), null, d.key);
    }
  }
});
test('wave 2 does not overwrite shared actions, custom source profiles or noncombatants', () => {
  for (const d of Object.values(kits).filter(d => d.wave === 2)) {
    const original = template(d), before = JSON.stringify(original);
    const actor = { ...original, universe: d.universe };
    prepare(actor);
    assert.equal(JSON.stringify(original), before, d.key);
    for (const flag of [{ nonCombat: true }, { combatEnabled: false }, { combatEligible: false }, { nonCombatTrial: {} }, { canonCombatPresentation: true }]) {
      const copy = { ...original, universe: d.universe, ...flag };
      const action = copy.special;
      assert.equal(prepare(copy), null, d.key); assert.equal(copy.special, action);
    }
    const custom = { ...original, universe: d.universe, special: { name: 'Custom action', dmg: 3 } };
    assert.equal(prepare(custom), null, d.key);
  }
});
test('boss puzzles and genuine support mechanics are not replaced with damage supers', () => {
  for (const [universe, names] of Object.entries({
    Quake: ['Chthon', 'Shub-Niggurath'],
    Hexen: ['Korax'], 'Team Fortress 2': ['Sentry Buster', 'Tank Robot']
  })) {
    const pool = enemies[universe];
    for (const actor of [...pool.monsters, ...pool.bosses, pool.worldBoss].filter(Boolean)) {
      if (names.some(name => actor.name.includes(name))) assert.equal(resolve({ ...actor, universe }), null, actor.name);
    }
  }
  const medic = heroes.find(a => a.id === 'team_fortress_2_medic'); assert.ok(medic);
  const actor = { ...medic };
  assert.equal(prepare(actor).effect, 'guard'); assert.equal(actor.special.dmg, 0);
  assert.equal(kits['Quake::Makron — Quake II'].requiredContinuity, 'Quake II (1997)');
});
test('Gladiator dead zone refuses a close shot without spending the meter', () => {
  const e = make('Quake::Strogg Gladiator'), a = e.heroes[0];
  e.enemies[0].x = a.x + 41;
  assert.equal(e.signatureDirector.superReadiness(a).reason, 'no-target');
  assert.equal(e.triggerAbility(a, 'special'), false); assert.equal(a.specialCharge, 100);
  e.enemies[0].x = a.x + 42;
  assert.equal(e.triggerAbility(a, 'special'), true);
});
test('an invalid nearest target does not hide a farther valid railgun target', () => {
  const e = make('Quake::Strogg Gladiator'), a = e.heroes[0], close = e.enemies[0];
  close.x = a.x + 10;
  const far = { ...close, id: 'far', runtimeId: 'far', battleId: 'far', x: a.x + 100 };
  e.enemies.push(far);
  assert.equal(e.triggerAbility(a, 'special'), true);
  const hp = close.currentHp;
  ticks(e, 54);
  assert.equal(close.currentHp, hp); assert.ok(far.currentHp < hp);
});
test('moving into the dead zone after confirmation causes a miss, never a redirected shot', () => {
  const e = make('Quake::Strogg Gladiator'), a = e.heroes[0], target = e.enemies[0];
  assert.equal(e.triggerAbility(a, 'special'), true); target.x = a.x + 10;
  const hp = target.currentHp; ticks(e, 78);
  assert.equal(target.currentHp, hp); assert.equal(a.specialCharge, 0); assert.equal(a.actionPending, false);
});
for (const key of ['hexen_parias', 'leia', 'aerith_ff7']) test(`RPG source card reflects ${key} without consuming resources`, () => {
  const e = make(key, 'RPG'), a = e.heroes[0];
  if (key === 'aerith_ff7') a.currentHp = 1;
  assert.equal(e.beginTargeting(a, 'special'), true);
  const preview = e.getTargetingState();
  assert.equal(preview.sourceProfile.key, key);
  assert.equal(preview.sourceProfile.referenceUrl, kits[key].referenceUrl);
  assert.equal(preview.sourceProfile.summonName, kits[key].summonName || null);
  assert.equal(preview.sourceHits, kits[key].hits);
  assert.equal(a.atb, 100); assert.equal(a.specialCharge, 100);
  assert.equal(preview.sourceProfile.fidelity, 'source-described-adaptation');
});

test('RPG P2 source enemies materialize only their existing native secondary fallback', async () => {
  const { getRpgActionProfile } = await vite.ssrLoadModule('/src/game/rpgTargeting.js');
  for (const d of Object.values(kits).filter(row => row.enemyName)) for (const authored of [false, true]) {
    const source = { ...structuredClone(template(d)), universe: d.universe };
    if (authored) source.secondary = { name: 'Custom secondary', type: 'melee', dmg: 2, cd: 7 };
    const sourceBefore = JSON.stringify(source);
    const hero = structuredClone(heroes.find(a => a.id === 'cloud_ff7'));
    const stage = { mode: 'RPG', universe: d.universe, customBattle: { singleRoster: true, opponentControl: 'p2' } };
    const e = new EngineRpg(760, 420, [hero], { customRoster: [source], monsters: [source], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
    engines.push(e);
    const actor = e.enemies[0], existing = actor.secondary;
    const before = getRpgActionProfile(actor, 'secondary', 'enemy', e);
    install(e, { mode: 'RPG' });
    assert.equal(typeof actor.secondary?.name, 'string', d.key);
    assert.deepEqual(getRpgActionProfile(actor, 'secondary', 'enemy', e), before, d.key);
    if (existing) assert.equal(actor.secondary, existing, d.key);
    assert.equal(JSON.stringify(source), sourceBefore, 'catalog fallback was written back');
  }
});
test('missing hero secondary actions are not granted by enemy presentation normalization', () => {
  const e = make('leia', 'RPG');
  // A fresh battle-local hero can intentionally lack a secondary. Source
  // preparation must not give it the enemy-only default command.
  const actor = { ...structuredClone(heroes.find(a => a.id === 'leia')), secondary: null,
    id: 'leia', runtimeId: 'new-hero', battleId: 'new-hero', state: 'idle', currentHp: 100, maxHp: 100, atb: 0 };
  e.heroes.push(actor); e.setPaused(true); ticks(e, 1);
  assert.equal(actor.secondary, null);
});
