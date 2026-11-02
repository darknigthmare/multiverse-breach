import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
let vite, Fighter, heroes, enemies, kits, followup, contact, ranged, codex;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ SIGNATURE_SOURCE_KITS: kits } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  followup = await vite.ssrLoadModule('/src/game/fighterSupplementalSignatures.js');
  contact = await vite.ssrLoadModule('/src/game/fighterMeleeSignatures.js');
  ranged = await vite.ssrLoadModule('/src/game/fighterRangedSignatures.js');
  codex = await vite.ssrLoadModule('/src/game/signatureCodex.js');
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => vite?.close());
const ordinary = id => ({ id, name: id, universe: 'QA', stats: { hp: 1000, atk: 18, def: 10, spd: 8 } });
function sourceFor(d) {
  if (d.actorId) return heroes.find(h => h.id === d.actorId);
  const pool = enemies[d.universe];
  const a = [...(pool?.monsters || []), ...(pool?.bosses || []), pool?.worldBoss]
    .filter(Boolean).find(a => (a.canonicalName || a.name) === d.enemyName);
  assert.ok(a, d.key);
  return { ...a, universe: d.universe, id: a.id || d.enemyId || d.key,
    stats: a.stats || { hp: a.hp || 1000, atk: a.atk || 18, def: a.def || 10, spd: a.spd || 8 } };
}
function fixture(key, side = 'player') {
  const d = kits[key], source = structuredClone(sourceFor(d));
  const e = new Fighter(960, 540,
    side === 'player' ? [source, ordinary('p-reserve')] : [ordinary('p'), ordinary('p-reserve')],
    side === 'cpu' ? [source, ordinary('c-reserve')] : [ordinary('c'), ordinary('c-reserve')],
    { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  engines.push(e); e.countdown = 0;
  const a = e.getActive(side), b = e.getOpponent(side);
  Object.assign(a, { x: 350, y: e.groundY, meter: 100, attackPower: 18 });
  Object.assign(b, { x: 410, y: e.groundY, currentHp: 10000, maxHp: 10000, defensePower: 10 });
  const hits = [], original = e.applyHit;
  e.applyHit = (...args) => {
    const amount = original.apply(e, args);
    if (args[0] === a && args[2]?.meleeContact && amount > 0) hits.push({ index: args[2].meleeContact.index, amount });
    return amount;
  };
  return { e, a, b, d, source, hits, side };
}
const advance = (e, n = 600) => { for (let i = 0; i < n; i++) e.update(1 / 60); };
const firstHit = f => {
  assert.equal(f.e.tryAction(f.side, 'super'), true);
  for (let i = 0; i < 80 && !f.hits.length; i++) f.e.update(1 / 60);
  assert.equal(f.hits.length, 1);
};

test('thirteen distinct omissions supplement, not replace, both historical cohorts', () => {
  const old = [...contact.FIGHTER_MELEE_SIGNATURE_KEYS, ...ranged.FIGHTER_RANGED_SIGNATURE_KEYS];
  const next = followup.FIGHTER_SUPPLEMENTAL_KEYS;
  assert.equal(old.length, 69); assert.equal(next.length, 13);
  assert.equal(new Set([...old, ...next]).size, 82);
  assert.equal(followup.FIGHTER_SUPPLEMENTAL_RANGED_KEYS.length, 12);
  assert.deepEqual(followup.FIGHTER_SUPPLEMENTAL_MELEE_KEYS, ['zell_ff8']);
  assert.ok(Object.isFrozen(next)); assert.equal(Object.keys(kits).length, 124);
});
test('each omitted source actor is already in the authoritative roster, not a fabricated identity', async t => {
  for (const key of followup.FIGHTER_SUPPLEMENTAL_KEYS) await t.test(key, () => {
    const d = kits[key], raw = sourceFor(d), before = JSON.stringify(raw);
    assert.equal(followup.getFighterSupplementalDefinition(raw), d);
    assert.equal(JSON.stringify(raw), before);
    assert.equal(d.canonicalFidelityApproved, false);
    for (const override of [{ universe: 'Other' }, { nonCombat: true }, { combatEligible: false },
      { fighterAttacks: { super: { name: 'Authored super' } } },
      { special: { ...(typeof raw.special === 'object' ? raw.special : {}), fighterProfile: {} } }]) {
      assert.equal(followup.getFighterSupplementalDefinition({ ...raw, ...override }), null);
    }
  });
});
for (const side of ['player', 'cpu']) {
  test(`${side}: every added signature has real ordered contacts, bounded reach and one cost`, async t => {
    for (const key of followup.FIGHTER_SUPPLEMENTAL_KEYS) await t.test(key, () => {
      const f = fixture(key, side), { e, a, b, d, hits } = f;
      assert.equal(contact.getFighterContactDefinition(a), d);
      assert.equal(e.getSnapshot()[side].superName, d.name);
      b.x = a.x + d.range + 1;
      assert.equal(e.canUseSuper(side), false); assert.equal(e.tryAction(side, 'super'), false); assert.equal(a.meter, 100);
      b.x = a.x + 60;
      const bench = e.getTeam(side === 'player' ? 'cpu' : 'player').fighters[1];
      const benchHp = bench.currentHp, hp = b.currentHp;
      assert.equal(e.tryAction(side, 'super'), true); assert.equal(a.meter, 0);
      assert.equal(e.tryAction(side, 'super'), false);
      e.updateActions(.44); assert.equal(b.currentHp, hp);
      e.setPaused(true); const time = a.action.elapsed; advance(e, 30);
      assert.equal(a.action.elapsed, time); assert.equal(hits.length, 0);
      e.setPaused(false); advance(e);
      assert.equal(hits.length, d.hits);
      assert.deepEqual(hits.map(h => h.index), Array.from({ length: d.hits }, (_, i) => i));
      assert.ok(Math.abs(e.stats[side].damage - 37.8) < 1e-8);
      assert.equal(bench.currentHp, benchHp); assert.equal(a.action, null);
      assert.equal(e.projectiles.length, 0, 'scheduled impacts are not autonomous projectiles');
      assert.doesNotThrow(() => JSON.stringify(e.teams));
    });
  });
  for (const key of ['leia', 'doom_marine_classic', 'Halo::Elite Minor', 'Quake::Makron — Quake II']) {
    test(`${side}/${key}: an immediately revived victim loses old remaining contacts`, () => {
      const f = fixture(key, side); firstHit(f);
      f.e.applyHit(f.a, f.b, { type: 'super', base: 1e6, knockback: 0, guardDamage: 0 });
      assert.equal(f.b.currentHp, 0);
      Object.assign(f.b, { currentHp: 10000, state: 'idle', koDelay: 0, invulnerable: 0 });
      advance(f.e); assert.equal(f.hits.length, 1); assert.equal(f.b.currentHp, 10000);
    });
    test(`${side}/${key}: leaving range loses shots without retargeting or refund`, () => {
      const f = fixture(key, side); firstHit(f);
      f.b.x = 900; const hp = f.b.currentHp, earnedMeter = f.a.meter; advance(f.e);
      assert.equal(f.hits.length, 1); assert.equal(f.b.currentHp, hp); assert.equal(f.a.meter, earnedMeter);
    });
    test(`${side}/${key}: interrupting the action discards every remaining contact`, () => {
      const f = fixture(key, side); firstHit(f);
      f.e.applyHit(f.b, f.a, { type: 'heavy', base: 1, guardDamage: 0, knockback: 0 });
      const hp = f.b.currentHp, earnedMeter = f.a.meter; advance(f.e);
      assert.equal(f.hits.length, 1); assert.equal(f.b.currentHp, hp); assert.equal(f.a.meter, earnedMeter);
    });
  }
  test(`${side}: committed orientation is not a homing lock`, () => {
    const f = fixture('leia', side); firstHit(f); f.b.x = f.a.x - 65;
    advance(f.e); assert.equal(f.hits.length, 1);
  });
  test(`${side}: jumping away, immunity and guard still defend against the new contracts`, () => {
    for (const defence of ['height', 'immune', 'guard']) {
      const f = fixture('leia', side); assert.equal(f.e.tryAction(side, 'super'), true);
      if (defence === 'height') f.b.y = f.a.y - 200;
      if (defence === 'immune') f.b.invulnerable = 10;
      if (defence === 'guard') { f.b.guarding = true; f.b.facing = -1; }
      for (let i = 0; i < 100; i++) { f.e.hitStop = 0; f.e.updateActions(1 / 60); }
      if (defence === 'guard') assert.ok(f.e.stats[side].damage > 0 && f.e.stats[side].damage < 37.8);
      else assert.equal(f.hits.length, 0);
    }
  });
  test(`${side}: disposal prevents future hits without a campaign result`, () => {
    const f = fixture('leia', side); assert.equal(f.e.tryAction(side, 'super'), true);
    f.e.dispose(); advance(f.e); assert.equal(f.hits.length, 0); assert.equal(f.e.completionReported, false);
  });
}
test('the Quake II Makron is not silently applied to its Quake 4 incarnation', () => {
  const a = sourceFor(kits['Quake::Makron — Quake II']);
  assert.equal(followup.getFighterSupplementalDefinition({ ...a, continuityScope: 'Quake 4 (2005)' }), null);
});
test('missiles, autonomous summons, shields and unknown profiles remain outside this adaptation', () => {
  for (const key of ['city_hunter', 'hexen_parias', 'rinoa_ff8', 'team_fortress_2_soldier', 'Doom::Cyberdemon Lord', 'aerith_ff7', 'team_fortress_2_medic']) {
    assert.equal(followup.getFighterSupplementalDefinition(sourceFor(kits[key])), null);
  }
});
for (const lang of ['fr', 'en']) test(`${lang}: codex describes the runtime adaptation without mutating the catalog`, () => {
  for (const key of followup.FIGHTER_SUPPLEMENTAL_KEYS) {
    const a = sourceFor(kits[key]), before = JSON.stringify(a);
    const view = codex.getSignatureCodex(a), text = codex.getSignatureSummary(view, lang);
    assert.equal(view.fighterDelivery, kits[key].delivery);
    assert.match(text, /Fighter\s*:/);
    assert.match(text, lang === 'fr' ? /non certifiées/ : /not certified/);
    assert.equal(JSON.stringify(a), before);
    const custom = codex.getSignatureCodex({ ...a, fighterAttacks: { super: { name: 'Custom super' } } });
    assert.equal(custom.fighterDelivery, null);
    assert.doesNotMatch(codex.getSignatureSummary(custom, lang), /Fighter\s*:/);
  }
});

for (const side of ['player', 'cpu']) {
  for (const key of ['leia', 'zell_ff8']) test(`${side}/${key}: uncovered regression refuses a far-away super without spending`, () => {
    const f = fixture(key, side); f.b.x = 900;
    assert.equal(f.e.tryAction(side, 'super'), false); assert.equal(f.a.meter, 100);
  });
  test(`${side}/leia: uncovered regression executes three distinct defended impacts`, () => {
    const f = fixture('leia', side), calls = [], original = f.e.applyHit;
    f.e.applyHit = (...args) => { const result = original.apply(f.e, args); if(args[0] === f.a && args[2].type === 'super' && result > 0) calls.push(result);return result; };
    assert.equal(f.e.tryAction(side, 'super'), true); advance(f.e);
    assert.equal(calls.length, 3); assert.ok(Math.abs(calls.reduce((sum,n)=>sum+n,0)-37.8)<1e-8);
  });
}
