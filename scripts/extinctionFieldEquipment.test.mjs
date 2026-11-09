import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { getExtinctionFighterProfile } from '../src/game/extinctionFighterProfiles.js';
import { createExtinctionProtocolState, activateExtinctionProtocol, fireExtinctionPickupWeapon,
  tickExtinctionProtocols } from '../src/game/extinctionSignatures.js';
import { equipExtinctionFieldPickup, holsterExtinctionFieldWeapon, restoreExtinctionFieldWeapon,
  getExtinctionFieldWeaponReadout, clearExtinctionFieldEquipment } from '../src/game/extinctionFieldEquipment.js';

const weapon = type => ({ type, name: { shotgun: 'Shotgun', plasma: 'Plasma Rifle', rocket: 'Rocket Launcher' }[type],
  maxAmmo: { shotgun: 8, plasma: 60, rocket: 4 }[type],
  fireRate: { shotgun: 1.5, plasma: .45, rocket: 2.4 }[type],
  dmgMult: { shotgun: 2.1, plasma: .65, rocket: 4.5 }[type], spread: .1 });
const make = () => {
  const actor = HEROES_DB.find(hero => hero.id === 'masterchief');
  return { phase: 'running', t: 100, runId: 'field-equipment-test', heroId: actor.id, hp: 120, maxHp: 120,
    px: 0, py: 0, angle: 0, ammo: 17, maxAmmo: 24, reserveAmmo: 41, reloadPulse: 0,
    weapon: { type: 'pistol', ammo: 17, maxAmmo: 24, resource: 'ammo' }, fieldWeapon: null,
    enemies: [{ id: 'threat', kind: 'Traqueur', wx: 0, wy: 5, hp: 500, maxHp: 500, size: 1 }],
    protocols: createExtinctionProtocolState(getExtinctionFighterProfile(actor).signature, 'field-equipment-test') };
};
const withField = () => {
  const state = make();
  assert.equal(equipExtinctionFieldPickup(state, weapon('plasma')).equipped, true);
  return state;
};
const withStored = () => { const state = withField(); assert.equal(holsterExtinctionFieldWeapon(state), true); return state; };

test('one carried weapon preserves spent ammunition, personal actions and a projectile across V/B/V', () => {
  const state = make();
  assert.equal(activateExtinctionProtocol(state, 'simple').activated, true);
  const hpAfterPersonal = state.enemies[0].hp;
  const personal = { ammo: state.ammo, reserve: state.reserveAmmo };
  const protocols = structuredClone(state.protocols);
  assert.equal(equipExtinctionFieldPickup(state, weapon('rocket')).equipped, true);
  assert.deepEqual(state.protocols, protocols);
  assert.equal(fireExtinctionPickupWeapon(state).fired, true);
  const projectile = state.protocols.projectiles[0], emitted = structuredClone(projectile);
  const afterFire = structuredClone(state.protocols), lastFireTime = state.lastFireTime;
  assert.equal(state.ammo, 3);
  assert.equal(holsterExtinctionFieldWeapon(state), true);
  assert.equal(state.weapon.type, 'pistol'); assert.equal(state.ammo, personal.ammo); assert.equal(state.reserveAmmo, personal.reserve);
  assert.deepEqual(state.protocols, afterFire); assert.equal(state.lastFireTime, lastFireTime);
  assert.equal(state.fieldWeapon.weapon.ammo, 3); assert.equal(state.fieldWeapon.reserveAmmo, 8);
  assert.equal(restoreExtinctionFieldWeapon(state), true);
  assert.equal(state.weapon.type, 'rocket'); assert.equal(state.ammo, 3); assert.equal(state.reserveAmmo, 8);
  assert.equal(state.fieldWeapon, null); assert.equal(state.personalKit.weapon.ammo, personal.ammo);
  assert.deepEqual(projectile, emitted); assert.deepEqual(state.protocols, afterFire);
  assert.equal(fireExtinctionPickupWeapon(state).reason, 'cooldown', 'switching cannot bypass shot cadence');
  assert.equal(holsterExtinctionFieldWeapon(state), true);
  for (let i = 0; i < 24; i++) { state.t++; tickExtinctionProtocols(state); }
  assert.ok(state.enemies[0].hp < hpAfterPersonal, 'the real rocket still impacts after its weapon is holstered');
  assert.equal(state.ammo, personal.ammo); assert.equal(state.fieldWeapon.weapon.ammo, 3);
});

test('each weapon keeps its own reload deadline; active ticks age both and pause ages neither', () => {
  const state = make(); state.reloadPulse = 36;
  equipExtinctionFieldPickup(state, weapon('shotgun'));
  // The established pickup rule keeps the active reload; later field reloads
  // may have a different deadline from the stored personal kit.
  state.t += 10; state.reloadPulse = 36; state.weapon.ammo = 7; state.ammo = 7; state.reserveAmmo = 9;
  assert.equal(holsterExtinctionFieldWeapon(state), true);
  assert.equal(state.reloadPulse, 26); assert.equal(getExtinctionFieldWeaponReadout(state).reloadTicks, 36);
  state.paused = true;
  const frozen = structuredClone(state);
  for (let i = 0; i < 300; i++) tickExtinctionProtocols(state);
  assert.equal(restoreExtinctionFieldWeapon(state), false); assert.deepEqual(state, frozen);
  assert.equal(getExtinctionFieldWeaponReadout(state).canRestore, false);
  state.paused = false; state.t += 25; state.reloadPulse = 1;
  assert.equal(restoreExtinctionFieldWeapon(state), true);
  assert.equal(state.reloadPulse, 11); assert.equal(state.ammo, 7); assert.equal(state.reserveAmmo, 9);
  assert.equal(holsterExtinctionFieldWeapon(state), true); assert.equal(state.reloadPulse, 1);
  state.t += 20; state.reloadPulse = 0;
  assert.equal(getExtinctionFieldWeaponReadout(state).reloadTicks, 0);
  assert.equal(restoreExtinctionFieldWeapon(state), true); assert.equal(state.reloadPulse, 0);
  assert.equal(state.ammo, 7); assert.equal(state.reserveAmmo, 9, 'elapsed recharge never grants new reserve or ammunition');
});

test('new pickups replace exactly the active or holstered field weapon and announce its name', () => {
  for (const holstered of [false, true]) {
    const state = withField(); state.weapon.ammo = 2; state.ammo = 2; state.reserveAmmo = 13;
    if (holstered) {
      holsterExtinctionFieldWeapon(state);
      activateExtinctionProtocol(state, 'simple');
    }
    const personalAmmo = holstered ? state.ammo : state.personalKit.weapon.ammo;
    const result = equipExtinctionFieldPickup(state, weapon('shotgun'));
    assert.deepEqual(result, { equipped: true, weaponName: 'Shotgun', replacedWeaponName: 'Plasma Rifle' });
    assert.equal(state.weapon.type, 'shotgun'); assert.equal(state.ammo, 8); assert.equal(state.reserveAmmo, 16);
    assert.equal(state.fieldWeapon, null); assert.equal(restoreExtinctionFieldWeapon(state), false);
    assert.equal(holsterExtinctionFieldWeapon(state), true);
    assert.equal(state.ammo, personalAmmo, 'replacement cannot refill the personal kit');
    assert.equal(state.reserveAmmo, 41); assert.equal(state.fieldWeapon.weapon.type, 'shotgun');
    assert.equal(restoreExtinctionFieldWeapon(state), true); assert.equal(state.weapon.type, 'shotgun');
  }
});

test('paused, dead, ended, foreign-owner, foreign-profile and invalid-clock actions refuse without mutation', () => {
  const invalid = [
    state => { state.paused = true; }, state => { state.hp = 0; }, state => { state.phase = 'ended'; },
    state => { state.heroId = 'predator'; }, state => { state.runId = 'another-run'; },
    state => { state.protocols.ownerId = 'predator'; }, state => { state.protocols.runId = 'another-run'; },
    state => { state.protocols.profile = { ...state.protocols.profile, heroId: 'predator' }; },
    state => { state.t = -1; }, state => { state.t = NaN; },
    state => { state.reserveAmmo = -1; }, state => { state.weapon.ammo = state.weapon.maxAmmo + 1; },
    state => { state.reloadPulse = -1; }, state => { state.reloadPulse = NaN; }, state => { state.reloadPulse = '36'; }
  ];
  for (const mutate of invalid) {
    for (const [prepare, act] of [[withField, holsterExtinctionFieldWeapon], [withStored, restoreExtinctionFieldWeapon],
      [withField, state => equipExtinctionFieldPickup(state, weapon('rocket')).equipped]]) {
      const state = prepare(); mutate(state); const before = structuredClone(state);
      assert.equal(act(state), false); assert.deepEqual(state, before);
    }
  }
});

test('a stale or corrupt stored record never crosses heroes or runs and never overwrites the active kit', () => {
  const invalid = [
    record => { record.heroId = 'predator'; }, record => { record.runId = 'previous-run'; },
    record => { record.storedAtTick = 101; }, record => { record.reloadReadyAtTick = 99; },
    record => { record.reloadReadyAtTick = Infinity; }, record => { record.weapon.type = 'pistol'; },
    record => { record.weapon.ammo = -1; }, record => { record.reserveAmmo = NaN; }
  ];
  for (const mutate of invalid) {
    const state = withStored(); mutate(state.fieldWeapon); const before = structuredClone(state);
    assert.equal(getExtinctionFieldWeaponReadout(state), null);
    assert.equal(restoreExtinctionFieldWeapon(state), false); assert.deepEqual(state, before);
  }
  for (const mutate of [kit => { kit.heroId = 'predator'; }, kit => { kit.runId = 'previous-run'; },
    kit => { kit.weapon.ammo = -1; }, kit => { kit.reloadReadyAtTick = 99; }]) {
    const state = withField(); mutate(state.personalKit); const before = structuredClone(state);
    assert.equal(holsterExtinctionFieldWeapon(state), false); assert.deepEqual(state, before);
    assert.equal(equipExtinctionFieldPickup(state, weapon('rocket')).equipped, false); assert.deepEqual(state, before);
  }
});

test('invalid pickups are refused before mutation and valid source definitions are not modified', () => {
  for (const incoming of [null, { type: 'pistol', maxAmmo: 24 }, { type: 'rocket', maxAmmo: -1 },
    { type: 'plasma', maxAmmo: Infinity }, { type: 'shotgun', maxAmmo: Number.MAX_SAFE_INTEGER }]) {
    const state = withStored(), before = structuredClone(state);
    assert.equal(equipExtinctionFieldPickup(state, incoming).equipped, false); assert.deepEqual(state, before);
  }
  const state = withStored(), incoming = Object.freeze(weapon('rocket'));
  assert.equal(equipExtinctionFieldPickup(state, incoming).equipped, true);
  state.weapon.ammo--; assert.equal(incoming.ammo, undefined);
});

test('empty field weapons remain recoverable, readouts are detached and cleanup is idempotent', () => {
  const state = withField(); state.ammo = 0; state.weapon.ammo = 0; state.reserveAmmo = 0;
  holsterExtinctionFieldWeapon(state);
  const before = structuredClone(state), readout = getExtinctionFieldWeaponReadout(state);
  assert.equal(readout.ammo, 0); assert.equal(readout.reserveAmmo, 0); assert.equal(readout.canRestore, true);
  readout.ammo = 60; readout.name = 'foreign weapon'; assert.deepEqual(state, before);
  restoreExtinctionFieldWeapon(state); assert.equal(fireExtinctionPickupWeapon(state).reason, 'ammo');
  holsterExtinctionFieldWeapon(state);
  const protocols = structuredClone(state.protocols), personal = { ...state.weapon };
  clearExtinctionFieldEquipment(state); clearExtinctionFieldEquipment(state);
  assert.equal(state.fieldWeapon, null); assert.equal(restoreExtinctionFieldWeapon(state), false);
  assert.deepEqual(state.protocols, protocols); assert.deepEqual(state.weapon, personal); assert.equal(state.rewards, undefined);
});
