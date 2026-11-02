import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWave16Protection, advanceWave16Protection, resolveWave16ProtectedHit,
  isWave16ProtectionProfile, MUGMAN_INVULNERABILITY_SECONDS } from '../src/game/combat/combatProtectionWave16.js';

const actor = (id, universe = 'Cuphead', runtime = id) => ({ id, sourceHeroId: id, battleId: runtime, universe, currentHp: 100, state: 'idle' });
const profiles = {
  mugman: { sourceHeroId: 'cuphead_mugman', universe: 'Cuphead', effect: 'guard', delivery: 'support', shape: 'single',
    targetSide: 'self', multiplier: 0, invulnerabilityKind: 'mugman-super-art-ii', duration: 4.85 },
  chalice: { sourceHeroId: 'cuphead_ms_chalice', universe: 'Cuphead', effect: 'guard', delivery: 'support', shape: 'single',
    targetSide: 'self', multiplier: 0, shieldKind: 'shield-pal-one-hit', shieldHits: 1 },
  hakumen: { sourceHeroId: 'hakumen_bb', universe: 'BlazBlue', effect: 'guard', delivery: 'support', shape: 'single',
    targetSide: 'self', multiplier: 0, counterKind: 'yukikaze', counterRequiresIncomingContact: true,
    counterWindowDuration: 1.1, counterMultiplier: 4.8 }
};
const hit = (owner, extra = {}) => ({ accepted: true, hostile: true, damage: 20,
  targetRuntimeId: owner, attackerRuntimeId: 'opponent-1', attackerAlive: true, delivery: 'melee', ...extra });

test('source identities, universe, self target and zero-damage profile gate every protection', () => {
  const mugman = actor('cuphead_mugman');
  assert.ok(isWave16ProtectionProfile(profiles.mugman));
  for (const changed of [{ sourceHeroId: 'cuphead_cuphead' }, { universe: 'foreign' }, { effect: 'damage' },
    { multiplier: 1 }, { shape: 'group' }, { targetSide: 'ally' }, { invulnerabilityKind: 'ordinary-guard' }]) {
    assert.equal(createWave16Protection(mugman, { ...profiles.mugman, ...changed }), null);
  }
  assert.equal(createWave16Protection(actor('cuphead_cuphead'), profiles.mugman), null);
  assert.equal(createWave16Protection(mugman, profiles.mugman, { target: actor('cuphead_mugman', 'Cuphead', 'other-camp') }), null);
  assert.equal(createWave16Protection({ ...mugman, currentHp: 0 }, profiles.mugman), null);
});

test('Mugman uses4.85seconds after activation, pause freezes it and expiry ends immunity', () => {
  const state = createWave16Protection(actor('cuphead_mugman'), profiles.mugman);
  assert.equal(state.duration, MUGMAN_INVULNERABILITY_SECONDS);
  assert.equal(createWave16Protection(actor('cuphead_mugman'), profiles.mugman, { duration: 3 }), null);
  assert.strictEqual(advanceWave16Protection(state, 99, { paused: true }), state);
  const active = advanceWave16Protection(state, 4.8);
  assert.equal(resolveWave16ProtectedHit(active, hit(state.ownerRuntimeId)).blocked, true);
  const ended = advanceWave16Protection(active, .06);
  assert.equal(ended.active, false);
  assert.equal(resolveWave16ProtectedHit(ended, hit(state.ownerRuntimeId)).blocked, false);
  assert.equal(state.remaining, 4.85);
});

test('Mugman relay is admitted only for Cuphead caller and an explicit same-universe Mugman performer', () => {
  const caller = actor('cuphead_cuphead');
  const relay = { ...profiles.mugman, sourceHeroId: caller.sourceHeroId, kind: 'reinforcement',
    performer: actor('cuphead_mugman'), targetSide: 'self' };
  assert.ok(createWave16Protection(caller, relay, { relay: true }));
  assert.equal(createWave16Protection(caller, relay), null);
  for (const changed of [{ kind: 'entity' }, { performer: actor('cuphead_ms_chalice') },
    { performer: actor('cuphead_mugman', 'foreign') }, { shape: 'group' }, { sourceHeroId: 'any-caller' }]) {
    assert.equal(createWave16Protection(caller, { ...relay, ...changed }, { relay: true }), null);
  }
});

test('Shield Pal persists without a timer, rejects stacking and absorbs only the first damaging hit', () => {
  const owner = actor('cuphead_ms_chalice');
  const first = createWave16Protection(owner, profiles.chalice);
  assert.equal(first.remaining, null); assert.equal(first.charges, 1);
  assert.strictEqual(advanceWave16Protection(first, 10000), first);
  assert.equal(createWave16Protection(owner, profiles.chalice, { existingState: first }), null);
  const captured = resolveWave16ProtectedHit(first, hit(owner.battleId));
  assert.equal(captured.blocked, true); assert.equal(captured.state.charges, 0);
  assert.equal(resolveWave16ProtectedHit(captured.state, hit(owner.battleId)).blocked, false);
  assert.equal(first.charges, 1);
});

test('healing, friendly, rejected, immune and wrong-floor-owner events consume no Shield Pal', () => {
  const owner = actor('cuphead_ms_chalice');
  const state = createWave16Protection(owner, profiles.chalice);
  for (const extra of [{ damage: 0 }, { damage: -20 }, { damage: Infinity }, { damage: NaN }, { hostile: false },
    { accepted: false }, { alreadyBlocked: true }, { immune: true }, { targetRuntimeId: 'other-floor-unit' },
    { attackerRuntimeId: owner.battleId }, { ownerAlive: false }]) {
    const result = resolveWave16ProtectedHit(state, hit(owner.battleId, extra));
    assert.equal(result.blocked, false); assert.equal(result.consumed, false); assert.strictEqual(result.state, state);
  }
});

test('Yukikaze arms without damage and requests one physical counter after a hostile strike', () => {
  const owner = actor('hakumen_bb', 'BlazBlue'), before = structuredClone(owner);
  const state = createWave16Protection(owner, profiles.hakumen);
  assert.deepEqual(owner, before);
  const result = resolveWave16ProtectedHit(state, hit(owner.battleId));
  assert.equal(result.blocked, true); assert.equal(result.consumed, true);
  assert.equal(result.counter.targetRuntimeId, 'opponent-1');
  assert.equal(result.counter.requiresPhysicalContact, true);
  assert.equal(result.counter.damageApplied, false); assert.equal(result.counter.teleport, false);
  assert.equal(resolveWave16ProtectedHit(result.state, hit(owner.battleId)).blocked, false);
  assert.deepEqual(owner, before);
});

test('Yukikaze also captures projectiles without locking their owners or applying remote damage', () => {
  const owner = actor('hakumen_bb', 'BlazBlue');
  const state = createWave16Protection(owner, profiles.hakumen);
  const result = resolveWave16ProtectedHit(state, hit(owner.battleId, { delivery: 'projectile', attackerRuntimeId: 'distant-shooter' }));
  assert.equal(result.blocked, true); assert.equal(result.counter.captureWasProjectile, true);
  assert.equal(result.counter.projectileOwnerLocked, false); assert.equal(result.counter.canEvade, true);
  assert.equal(result.counter.damageApplied, false); assert.equal(result.counter.requiresPhysicalContact, true);
});

test('Yukikaze does not catch throws, command grabs, unblockables or contacts outside its live window', () => {
  const owner = actor('hakumen_bb', 'BlazBlue'), state = createWave16Protection(owner, profiles.hakumen);
  for (const extra of [{ delivery: 'throw' }, { isThrow: true }, { isGrab: true }, { attackKind: 'command-grab' },
    { unblockable: true }, { damage: 0 }, { accepted: false }, { delivery: 'support' }]) {
    assert.equal(resolveWave16ProtectedHit(state, hit(owner.battleId, extra)).blocked, false);
  }
  assert.equal(resolveWave16ProtectedHit(advanceWave16Protection(state, 1.1), hit(owner.battleId)).blocked, false);
});

test('an expired or dead projectile owner is never replaced by a different counter target', () => {
  const owner = actor('hakumen_bb', 'BlazBlue'), state = createWave16Protection(owner, profiles.hakumen);
  const result = resolveWave16ProtectedHit(state, hit(owner.battleId, { delivery: 'projectile', attackerAlive: false }));
  assert.equal(result.blocked, true); assert.equal(result.counter, null); assert.equal(result.state.active, false);
});

test('death clears each protection, invalid time cannot extend it, and no caller objects are mutated', () => {
  for (const [key, id, universe] of [['mugman', 'cuphead_mugman', 'Cuphead'], ['chalice', 'cuphead_ms_chalice', 'Cuphead'], ['hakumen', 'hakumen_bb', 'BlazBlue']]) {
    const owner = actor(id, universe), state = createWave16Protection(owner, profiles[key]);
    for (const seconds of [-1, NaN, Infinity]) assert.strictEqual(advanceWave16Protection(state, seconds), state);
    const dead = advanceWave16Protection(state, 0, { ownerAlive: false, paused: true });
    assert.equal(dead.active, false); assert.equal(resolveWave16ProtectedHit(dead, hit(owner.battleId)).blocked, false);
    assert.equal(owner.currentHp, 100); assert.equal(state.active, true);
  }
});

test('the opponent runtime sourceId is admitted without guessing its prefixed runtime identifier', () => {
  for (const [key, id, universe] of [['mugman', 'cuphead_mugman', 'Cuphead'], ['chalice', 'cuphead_ms_chalice', 'Cuphead'], ['hakumen', 'hakumen_bb', 'BlazBlue']]) {
    const opponent = { id: 'p2:' + id + ':0', sourceId: id, universe, currentHp: 100 };
    const state = createWave16Protection(opponent, profiles[key]);
    assert.ok(state); assert.equal(state.ownerRuntimeId, opponent.id);
    assert.equal(createWave16Protection({ ...opponent, sourceId: 'unrelated' }, profiles[key]), null);
  }
});
