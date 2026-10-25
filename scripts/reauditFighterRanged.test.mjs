import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
let vite, Fighter, heroes, enemies, kits, ranged, melee, codex;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ SIGNATURE_SOURCE_KITS: kits } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ranged = await vite.ssrLoadModule('/src/game/fighterRangedSignatures.js');
  melee = await vite.ssrLoadModule('/src/game/fighterMeleeSignatures.js');
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
function fixture(key = 'barret_ff7', side = 'player', override = null) {
  const source = structuredClone(override || sourceFor(kits[key]));
  const e = new Fighter(960, 540,
    side === 'player' ? [source, ordinary('p-reserve')] : [ordinary('p'), ordinary('p-reserve')],
    side === 'cpu' ? [source, ordinary('c-reserve')] : [ordinary('c'), ordinary('c-reserve')],
    { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  engines.push(e); e.countdown = 0;
  const a = e.getActive(side), b = e.getOpponent(side), d = kits[key];
  Object.assign(a, { x: 350, y: e.groundY, meter: 100, attackPower: 18 });
  Object.assign(b, { x: 350 + Math.max(60, (d.minRange || 0) + 10), y: e.groundY,
    currentHp: 10000, maxHp: 10000, defensePower: 10 });
  const hits = [], original = e.applyHit;
  e.applyHit = (...args) => {
    const amount = original.apply(e, args);
    if (args[0] === a && args[2]?.meleeContact && amount > 0) hits.push({ index: args[2].meleeContact.index, amount });
    return amount;
  };
  return { e, a, b, d, source, hits, side };
}
function advance(e, steps = 360) {
  // Scheduler-only isolation; real-loop recipes below retain native impact freezes.
  for (let i = 0; i < steps; i++) { e.hitStop = 0; e.updateActions(1 / 60); }
}
test('thirty explicit direct-fire profiles are disjoint from the 39 preserved melee profiles', () => {
  const keys = ranged.FIGHTER_RANGED_SIGNATURE_KEYS;
  assert.equal(keys.length, 30); assert.equal(new Set(keys).size, 30);
  assert.equal(melee.FIGHTER_MELEE_SIGNATURE_KEYS.length, 39);
  assert.ok(keys.every(k => !melee.FIGHTER_MELEE_SIGNATURE_KEYS.includes(k)));
  assert.ok(Object.isFrozen(keys));
  assert.equal(Object.keys(kits).length, 124, 'integration does not invent source definitions');
});
test('every listed hero/enemy runs its exact source contract on both camps', async t => {
  for (const key of ranged.FIGHTER_RANGED_SIGNATURE_KEYS) for (const side of ['player', 'cpu']) {
    await t.test(`${side}: ${key}`, () => {
      const { e, a, b, d, source, hits } = fixture(key, side), before = JSON.stringify(source);
      assert.equal(ranged.getFighterRangedDefinition(a), d); assert.equal(melee.getFighterContactDefinition(a), d);
      assert.equal(a.special.name, d.name); assert.equal(e.getSnapshot()[side].superName, d.name);
      b.x = a.x + d.range + 1;
      assert.equal(e.canUseSuper(side), false); assert.equal(e.tryAction(side, 'super'), false); assert.equal(a.meter, 100);
      b.x = a.x + Math.max(60, (d.minRange || 0) + 10);
      assert.equal(e.tryAction(side, 'super'), true); assert.equal(a.meter, 0);
      assert.equal(e.tryAction(side, 'super'), false); assert.equal(a.action.meleeSignature.delivery, 'ranged');
      const hp = b.currentHp; e.updateActions(.44); assert.equal(b.currentHp, hp);
      advance(e); assert.equal(hits.length, d.hits);
      assert.deepEqual(hits.map(h => h.index), Array.from({ length: d.hits }, (_, i) => i));
      assert.ok(Math.abs(hp - b.currentHp - 37.8) < 1e-8);
      assert.ok(Math.abs(e.stats[side].damage - 37.8) < 1e-8); assert.equal(a.action, null);
      assert.equal(JSON.stringify(source), before); assert.doesNotThrow(() => JSON.stringify(e.teams));
      assert.equal(e.projectiles.length, 0, 'direct-fire is not an autonomous projectile');
    });
  }
});
for (const side of ['player', 'cpu']) {
  for (const key of ['barret_ff7', 'irvine_ff8', 'Team Fortress 2::Robot Heavy']) {
    test(`${side}/${key}: exact contacts and conserved damage in the real update loop`, () => {
      const { e, a, b, d, hits } = fixture(key, side);
      assert.equal(e.tryAction(side, 'super'), true);
      for (let i = 0; i < 600; i++) e.update(1 / 60);
      assert.equal(hits.length, d.hits); assert.ok(Math.abs(e.stats[side].damage - 37.8) < 1e-8);
      assert.equal(a.action, null); assert.ok(b.currentHp > 0);
    });
  }
  test(`${side}: railgun minimum distance is enforced at commitment and impact`, () => {
    const { e, a, b, d, hits } = fixture('Quake::Strogg Gladiator', side);
    assert.ok(d.minRange > 0); b.x = a.x + d.minRange - 1;
    assert.equal(e.tryAction(side, 'super'), false); assert.equal(a.meter, 100);
    b.x = a.x + d.minRange; assert.equal(e.tryAction(side, 'super'), true);
    b.x = a.x + d.minRange - 1; advance(e); assert.equal(hits.length, 0); assert.equal(a.meter, 0);
  });
  for (const escape of ['distance', 'height', 'crossing', 'invulnerability']) {
    test(`${side}: ${escape} can evade the remaining burst without retargeting`, () => {
      const { e, a, b, hits } = fixture('irvine_ff8', side);
      assert.equal(e.tryAction(side, 'super'), true); e.updateActions(.46); assert.equal(hits.length, 1);
      if (escape === 'distance') b.x = 900;
      if (escape === 'height') b.y = a.y - 120;
      if (escape === 'crossing') b.x = a.x - 30;
      if (escape === 'invulnerability') b.invulnerable = 1;
      const hp = b.currentHp; advance(e); assert.equal(b.currentHp, hp); assert.equal(hits.length, 1);
      assert.equal(e.getTeam(b.side).fighters[1].currentHp, e.getTeam(b.side).fighters[1].maxHp);
    });
  }
  test(`${side}: low-damage minimum and guard pressure are split, not multiplied per shot`, () => {
    for (const guarded of [false, true]) {
      const { e, a, b } = fixture('barret_ff7', side); a.attackPower = .01; b.guarding = guarded; b.facing = -1;
      assert.equal(e.tryAction(side, 'super'), true); advance(e);
      assert.ok(Math.abs(e.stats[side].damage - (guarded ? .6 : 3)) < 1e-8);
      if (guarded) assert.ok(Math.abs(b.guard - 58) < 1e-8);
    }
  });
  for (const change of ['tag-return', 'target-ko', 'caster-ko', 'skill', 'power', 'incarnation', 'target-side', 'interrupt', 'finish', 'dispose']) {
    test(`${side}: ${change} invalidates committed direct-fire contacts`, () => {
      const { e, a, b, hits } = fixture('barret_ff7', side); e.tryAction(side, 'super');
      const token = a.action.meleeSignature;
      if (change === 'tag-return') {
        assert.equal(e.requestTag(b.side, 1), true); e.getTeam(b.side).tagCooldown = 0;
        assert.equal(e.requestTag(b.side, 0), true); Object.assign(b, { invulnerable: 0, x: 410 });
      }
      if (change === 'target-ko' || change === 'caster-ko') {
        const victim = change === 'target-ko' ? b : a, attacker = victim === b ? a : b;
        e.applyHit(attacker, victim, { type: 'heavy', base: 1e7, guardDamage: 0, knockback: 0 });
        assert.equal(victim.currentHp, 0); Object.assign(victim, { currentHp: 1000, state: 'idle', hitstun: 0 });
      }
      if (change === 'skill') a.special = { ...a.special };
      if (change === 'power') a.special.dmg = 100;
      if (change === 'incarnation') b.incarnation = 'Other life';
      if (change === 'target-side') b.side = side;
      if (change === 'interrupt') { a.action = null; a.state = 'idle'; }
      if (change === 'finish') e.finish('victory');
      if (change === 'dispose') e.dispose();
      const hp = b.currentHp; e.hitStop = 0; e.fighterMelee.advance(token); advance(e);
      assert.equal(b.currentHp, hp); assert.equal(hits.length, 0);
    });
  }
  test(`${side}: pause, impact freeze and repeated resolution do not advance or duplicate shots`, () => {
    const { e, a, b, hits, d } = fixture('barret_ff7', side); e.tryAction(side, 'super'); e.updateActions(.2);
    e.setPaused(true); e.updateActions(1); assert.equal(a.action.elapsed, .2);
    e.setPaused(false); e.hitStop = .2; e.updateActions(1); assert.equal(a.action.elapsed, .2);
    const token = a.action.meleeSignature; advance(e); const hp = b.currentHp;
    e.fighterMelee.advance(token); assert.equal(hits.length, d.hits); assert.equal(b.currentHp, hp);
  });
  test(`${side}: AI chooses a valid ranged super but not an out-of-range one`, () => {
    // Native AI owns cpu; both camps are covered for player-driven readiness above.
    if (side !== 'cpu') { const { e } = fixture(); assert.equal(e.canUseSuper(side), true); return; }
    for (const far of [false, true]) {
      const { e, a, b } = fixture('goku_dbz', side); if (far) b.x = 900; e.aiThink = 0;
      const random = Math.random;
      try { Math.random = () => 0; e.updateAi(1 / 60); } finally { Math.random = random; }
      if (far) assert.notEqual(a.action?.type, 'super'); else assert.ok(a.action?.meleeSignature);
    }
  });
}
test('custom Fighter profiles and unsupported identities are never replaced', () => {
  const original = sourceFor(kits.goku_dbz);
  for (const patch of [{ id: 'Other' }, { universe: 'Other' }, { nonCombat: true }, { combatEligible: false },
    { fighterAttacks: { super: {} } }, { special: { ...original.special, fighterProfile: {} } }, { special: { name: 'Custom' } }]) {
    const { a } = fixture('goku_dbz', 'player', { ...original, ...patch });
    assert.equal(ranged.getFighterRangedDefinition(a), null); assert.equal(a.special?.sourceSignatureKey, undefined);
  }
});
test('missiles, discs, summons, healing and melee do not gain direct-fire behavior', () => {
  for (const key of ['team_fortress_2_soldier', 'city_hunter', 'lightning_ff13', 'aerith_ff7', 'team_fortress_2_medic', 'cloud_ff7']) {
    const raw = structuredClone(heroes.find(h => h.id === key));
    assert.equal(ranged.prepareFighterRanged(raw), null); assert.equal(ranged.getFighterRangedDefinition(raw), null);
  }
});
for (const field of ['meter', 'currentHp', 'x', 'y']) test(`invalid ${field} cannot spend a direct-fire super`, () => {
  for (const value of [Infinity, NaN, '100']) {
    const { e, a } = fixture('goku_dbz'); a[field] = value;
    assert.equal(e.tryAction('player', 'super'), false); assert.equal(a.action, null);
  }
});
for (const lang of ['fr', 'en']) test(`${lang}: codex distinguishes direct fire from close combat and artistic approval`, () => {
  const original = sourceFor(kits.barret_ff7), before = JSON.stringify(original);
  const summary = codex.getSignatureSummary(codex.getSignatureCodex(original), lang);
  assert.match(summary, /Fighter/); assert.match(summary, /10/);
  assert.match(summary, lang === 'fr' ? /à distance/ : /ranged/);
  assert.match(summary, lang === 'fr' ? /pas de projectile autonome/ : /no autonomous projectile/);
  assert.match(summary, lang === 'fr' ? /non certifiées/ : /not certified/);
  assert.equal(JSON.stringify(original), before);
});
