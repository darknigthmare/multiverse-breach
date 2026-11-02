import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { isSourceControlProfileWave16, isSourceControlTargetEligibleWave16,
  createSourceControlWave16, advanceSourceControlWave16 } from '../src/game/combat/combatControlWave16.js';

const profile = (kind = 'possession') => ({ sourceHeroId: kind === 'possession' ? 'oddworld_abe_possession' : 'akane_tsunemori',
  universe: kind === 'possession' ? 'Oddworld' : 'Psycho-Pass', effect: 'control', delivery: 'control', multiplier: 0,
  targetSide: 'enemy', shape: 'single', maxTargets: 1, controlKind: kind, controlDuration: kind === 'possession' ? 2 : 1.5,
  channelDuration: kind === 'possession' ? 1.1 : 0, authorization: 'sibyl-s1e21-exception', requiresExplicitTargetEligibility: true });
const actor = p => ({ id: p.sourceHeroId, battleId: 'player:0:' + p.sourceHeroId,
  sourceHeroId: p.sourceHeroId, universe: p.universe, currentHp: 100, state: 'idle', side: 'player' });
const sligDefinition = ENEMIES_DB.Oddworld.monsters.find(enemy => enemy.id === 'oddworld_slig');
const slig = () => ({ ...sligDefinition, sourceEnemyId: 'oddworld_slig', battleId: 'enemy:slig:0', currentHp: 100,
  side: 'enemy', state: 'idle', x: 250, y: 300 });
const admitted = (p = profile()) => createSourceControlWave16(actor(p), slig(), p, { hostile: true });

test('only the actual canonical Slig is annotated; its historical artwork and other Oddworld enemies remain separate', () => {
  assert.ok(sligDefinition); assert.equal(sligDefinition.species, 'slig'); assert.equal(sligDefinition.possessionEligible, true);
  const eligible = ENEMIES_DB.Oddworld.monsters.filter(enemy => enemy.possessionEligible);
  assert.deepEqual(eligible.map(enemy => enemy.id), ['oddworld_slig']);
  assert.ok(fs.existsSync(new URL('../public/sprites/generated/bosses/oddworld/slig.png', import.meta.url)));
});

test('typed profiles reject wrong identities, worlds, group targets, nonzero damage and unauthorized Dominators', () => {
  assert.equal(isSourceControlProfileWave16(profile()), true);
  assert.equal(isSourceControlProfileWave16(profile('paralyzer')), true);
  for (const change of [{ sourceHeroId: 'someone-else' }, { universe: 'foreign' }, { multiplier: 1 },
    { shape: 'group' }, { targetSide: 'ally' }, { maxTargets: 2 }, { controlKind: 'phaselock' }]) {
    assert.equal(isSourceControlProfileWave16({ ...profile(), ...change }), false);
  }
  assert.equal(isSourceControlProfileWave16({ ...profile('paralyzer'), authorization: 'invented-exception' }), false);
  assert.equal(isSourceControlProfileWave16({ ...profile('paralyzer'), requiresExplicitTargetEligibility: false }), false);
});

test('possession never infers eligibility from a name, humanoid body, species alone or a foreign Slig', () => {
  const p = profile();
  assert.equal(isSourceControlTargetEligibleWave16(p, slig()), true);
  for (const change of [{ sourceEnemyId: 'human-soldier', name: 'Slig' }, { species: 'human' }, { universe: 'Halo' },
    { possessionEligible: false }, { currentHp: 0 }, { isBoss: true }, { controlImmune: true }, { invulnerable: 1 },
    { sourceControlWave16: { active: true } }, { combatControl: { kind: 'phaselock', remaining: 1 } }]) {
    assert.equal(isSourceControlTargetEligibleWave16(p, { ...slig(), ...change }), false);
  }
});

test('the possession channel is interruptible and grants no input proxy before it completes', () => {
  const state = admitted(); assert.equal(state.phase, 'channeling'); assert.equal(state.inputProxy, null);
  const partial = advanceSourceControlWave16(state, .5); assert.ok(Math.abs(partial.channelRemaining - .6) < 1e-9);
  assert.equal(partial.remaining, 2); assert.equal(partial.inputProxy, null);
  assert.strictEqual(advanceSourceControlWave16(partial, 99, { paused: true }), partial);
  const cancelled = advanceSourceControlWave16(partial, .2, { sourceInterrupted: true });
  assert.equal(cancelled.active, false); assert.equal(cancelled.inputProxy, null);
  assert.equal(cancelled.endedBy, 'channel-interrupted');
});

test('actual source invulnerability rejects both controls while Shield Pal does not grant control immunity', () => {
  for (const kind of ['possession', 'paralyzer']) {
    const p = profile(kind), target = kind === 'possession' ? slig() : {
      id: 'shinya_kogami', battleId: 'enemy:kogami:0', universe: 'Psycho-Pass',
      currentHp: 100, paralyzerEligible: true
    };
    const source = actor(p), before = structuredClone(target);
    target.sourceProtectionWave16 = { active: true, kind: 'mugman-super-art-ii', remaining: 2 };
    assert.equal(isSourceControlTargetEligibleWave16(p, target), false);
    assert.equal(createSourceControlWave16(source, target, p, { hostile: true }), null);
    target.sourceProtectionWave16 = { active: false, kind: 'mugman-super-art-ii', remaining: 0 };
    assert.equal(isSourceControlTargetEligibleWave16(p, target), true);
    target.sourceProtectionWave16 = { active: true, kind: 'shield-pal-one-hit', charges: 1 };
    assert.equal(isSourceControlTargetEligibleWave16(p, target), true);
    delete target.sourceProtectionWave16; assert.deepEqual(target, before);
  }
});

test('a completed channel routes source inputs to the real Slig without changing faction, coordinates or HP', () => {
  const p = profile(), source = actor(p), target = slig(), before = structuredClone({ source, target });
  const state = createSourceControlWave16(source, target, p, { hostile: true });
  const active = advanceSourceControlWave16(state, 1.2);
  assert.equal(active.phase, 'active'); assert.ok(Math.abs(active.remaining - 1.9) < 1e-9);
  assert.equal(active.inputProxy.controllerRuntimeId, source.battleId);
  assert.equal(active.inputProxy.bodyRuntimeId, target.battleId); assert.equal(active.inputProxy.originalSide, 'enemy');
  assert.equal(active.inputProxy.changesFaction, false); assert.equal(active.immobilize, false); assert.equal(active.lift, 0);
  assert.deepEqual({ source, target }, before);
});

test('source death, manual release, expiry and target death clear the proxy and never select a replacement body', () => {
  const active = advanceSourceControlWave16(admitted(), 1.1);
  for (const options of [{ sourceAlive: false }, { released: true }, { targetAlive: false }, { sourceInterrupted: true }]) {
    const ended = advanceSourceControlWave16(active, 0, options);
    assert.equal(ended.active, false); assert.equal(ended.inputProxy, null);
  }
  const ended = advanceSourceControlWave16(active, 2);
  assert.equal(ended.endedBy, 'expired'); assert.equal(ended.inputProxy, null);
  assert.equal(ended.targetRuntimeId, active.targetRuntimeId);
});

test('Paralyzer requires an explicit eligible target and authorized source, never a guessed crime coefficient', () => {
  const p = profile('paralyzer'), source = actor(p), target = { id: 'shinya_kogami', sourceHeroId: 'shinya_kogami',
    battleId: 'enemy:kogami:0', species: 'human', universe: 'Psycho-Pass', currentHp: 100,
    state: 'idle', side: 'enemy', paralyzerEligible: true };
  assert.ok(createSourceControlWave16(source, target, p, { hostile: true }));
  assert.equal(createSourceControlWave16(source, { ...target, paralyzerEligible: false, crimeCoefficient: 999 }, p, { hostile: true }), null);
  assert.equal(createSourceControlWave16(source, target, { ...p, authorization: null }, { hostile: true }), null);
  assert.equal(createSourceControlWave16(source, target, p), null);
});

test('Paralyzer has no levitation or input proxy and persists after an already committed source is interrupted', () => {
  const p = profile('paralyzer'), source = actor(p), target = { id: 'shinya_kogami', sourceHeroId: 'shinya_kogami',
    battleId: 'enemy:kogami:0', universe: 'Psycho-Pass', currentHp: 100, paralyzerEligible: true };
  const state = createSourceControlWave16(source, target, p, { hostile: true });
  assert.equal(state.phase, 'active'); assert.equal(state.immobilize, true); assert.equal(state.lift, 0); assert.equal(state.inputProxy, null);
  const active = advanceSourceControlWave16(state, .5, { sourceAlive: false, sourceInterrupted: true });
  assert.equal(active.active, true); assert.equal(active.remaining, 1);
  const ended = advanceSourceControlWave16(active, 1);
  assert.equal(ended.active, false); assert.equal(ended.immobilize, false);
});

test('invalid clocks, cross-camp runtime IDs and wrong sources cannot acquire or prolong a control', () => {
  const state = admitted();
  for (const dt of [-1, NaN, Infinity]) assert.strictEqual(advanceSourceControlWave16(state, dt), state);
  const p = profile();
  assert.equal(createSourceControlWave16(actor(p), slig(), p, { hostile: true, sourceRuntimeId: 'same', targetRuntimeId: 'same' }), null);
  assert.equal(createSourceControlWave16({ ...actor(p), sourceHeroId: 'someone-else' }, slig(), p, { hostile: true }), null);
  assert.equal(createSourceControlWave16(actor(p), slig(), { ...p, controlDuration: 999 }, { hostile: true }), null);
});

test('opponent controllers use their explicit sourceId and retain a distinct runtime owner', () => {
  const p = profile(), source = { id: 'p2:abe:0', sourceId: p.sourceHeroId, universe: p.universe, currentHp: 100 };
  const state = createSourceControlWave16(source, slig(), p, { hostile: true });
  assert.ok(state); assert.equal(state.sourceRuntimeId, source.id);
  assert.equal(createSourceControlWave16({ ...source, sourceId: 'unrelated' }, slig(), p, { hostile: true }), null);
});
