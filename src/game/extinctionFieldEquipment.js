/** One local field weapon alongside the hero's personal kit.
 * Pickups are shared Nexus field equipment, never additions to a guest's canon.
 * Reload deadlines use active simulation ticks, exactly like the personal kit.
 * No save, roster, reward, ability cooldown or projectile is changed here.
 */
import { rememberExtinctionPersonalKit, restoreExtinctionPersonalKit } from './extinctionFighterProfiles.js';

const FIELD_NAMES = Object.freeze({ shotgun: 'Shotgun', plasma: 'Plasma Rifle', rocket: 'Rocket Launcher' });
const stock = value => Number.isSafeInteger(value) && value >= 0;
const magazine = weapon => Boolean(weapon && stock(weapon.ammo) && stock(weapon.maxAmmo)
  && weapon.maxAmmo > 0 && weapon.ammo <= weapon.maxAmmo);
const fieldWeapon = weapon => Boolean(weapon && Object.hasOwn(FIELD_NAMES, weapon.type) && magazine(weapon));
const name = weapon => typeof weapon?.name === 'string' && weapon.name.trim() ? weapon.name : FIELD_NAMES[weapon?.type] || '';
const owner = state => Boolean(state && state.phase === 'running' && state.heroId && state.runId
  && state.protocols?.ownerId === state.heroId && state.protocols.runId === state.runId
  && state.protocols.profile?.heroId === state.heroId && stock(state.t));
const live = state => owner(state) && !state.paused && Number.isFinite(state.hp) && state.hp > 0;
const deadline = state => state.t + (state.reloadPulse ?? 0);
const retained = (state, record, isField) => Boolean(owner(state) && record
  && record.heroId === state.heroId && record.runId === state.runId
  && (isField ? fieldWeapon(record.weapon) : record.weapon?.type === 'pistol' && magazine(record.weapon))
  && stock(record.reserveAmmo) && stock(record.storedAtTick) && stock(record.reloadReadyAtTick)
  && state.t >= record.storedAtTick && record.reloadReadyAtTick >= record.storedAtTick);
const current = state => magazine(state.weapon) && stock(state.reserveAmmo)
  && stock(state.reloadPulse ?? 0) && stock(deadline(state));

/** Read-only HUD data. A paused run can display its slot, but cannot equip it. */
export function getExtinctionFieldWeaponReadout(state) {
  const stored = state?.fieldWeapon;
  if (state?.weapon?.type !== 'pistol' || !retained(state, stored, true)) return null;
  return { type: stored.weapon.type, name: name(stored.weapon), ammo: stored.weapon.ammo,
    maxAmmo: stored.weapon.maxAmmo, reserveAmmo: stored.reserveAmmo,
    reloadTicks: Math.max(0, stored.reloadReadyAtTick - state.t), canRestore: live(state) && current(state) };
}

/** V: keep the exact field weapon, then restore the actual personal stock. */
export function holsterExtinctionFieldWeapon(state) {
  if (!live(state) || !fieldWeapon(state.weapon) || !current(state) || !retained(state, state.personalKit, false)) return false;
  const stored = { heroId: state.heroId, runId: state.runId, weapon: { ...state.weapon },
    reserveAmmo: state.reserveAmmo, storedAtTick: state.t, reloadReadyAtTick: deadline(state) };
  if (!restoreExtinctionPersonalKit(state)) return false;
  state.fieldWeapon = stored;
  return true;
}

/** B: store the now-used personal kit and retrieve the one carried field weapon. */
export function restoreExtinctionFieldWeapon(state) {
  const stored = state?.fieldWeapon;
  if (!getExtinctionFieldWeaponReadout(state)?.canRestore || !rememberExtinctionPersonalKit(state)) return false;
  state.weapon = { ...stored.weapon };
  state.ammo = state.weapon.ammo;
  state.maxAmmo = state.weapon.maxAmmo;
  state.reserveAmmo = stored.reserveAmmo;
  state.reloadPulse = Math.max(0, stored.reloadReadyAtTick - state.t);
  state.fieldWeapon = null;
  return true;
}

/** A new pickup replaces the single field slot, whether active or holstered.
 * Returns the displaced name so collection can explicitly announce replacement.
 * The existing pickup magazine/reserve and active reload rules stay unchanged.
 */
export function equipExtinctionFieldPickup(state, weaponData) {
  const failure = { equipped: false, weaponName: '', replacedWeaponName: '' };
  const incoming = weaponData && { ...weaponData, ammo: weaponData.maxAmmo };
  if (!live(state) || !fieldWeapon(incoming) || !stock(incoming.maxAmmo * 2) || !current(state)) return failure;
  const personalActive = state.weapon.type === 'pistol';
  if (!personalActive && (!fieldWeapon(state.weapon) || !retained(state, state.personalKit, false))) return failure;
  const displaced = personalActive
    ? retained(state, state.fieldWeapon, true) ? state.fieldWeapon.weapon : null
    : state.weapon;
  if (personalActive && !rememberExtinctionPersonalKit(state)) return failure;
  state.weapon = incoming;
  state.ammo = incoming.ammo;
  state.maxAmmo = incoming.maxAmmo;
  state.reserveAmmo = incoming.maxAmmo * 2;
  state.fieldWeapon = null;
  return { equipped: true, weaponName: name(incoming), replacedWeaponName: name(displaced) };
}

/** Run-local equipment must never be retained on completion, exit or recovery. */
export function clearExtinctionFieldEquipment(state) {
  if (state) state.fieldWeapon = null;
}
