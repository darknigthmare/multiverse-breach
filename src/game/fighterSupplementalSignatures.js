// Individually approved MODE ADAPTATIONS of existing source profiles. No source
// abilities, characters, unlocks, equipment or graphical assets are added here.
// The two original cohorts (39 close/30 ranged) stay stable for compatibility.
import { resolveSourceSignature } from './signatureSourceKits.js';

export const FIGHTER_SUPPLEMENTAL_RANGED_KEYS = Object.freeze([
  'leia_organa', 'leia',
  'Star Wars::Stormtrooper Patrol', 'Star Wars::Stormtrooper Squad',
  'Star Wars::Stormtrooper Fireteam', 'Star Wars::Droideka Shield Droid',
  'Star Wars::Droideka Shield Unit', 'doom_marine_classic',
  'The Predator::Assassin Predator / Upgrade Predator',
  'Halo::Covenant Grunt', 'Halo::Elite Minor', 'Quake::Makron — Quake II'
]);
export const FIGHTER_SUPPLEMENTAL_MELEE_KEYS = Object.freeze(['zell_ff8']);
export const FIGHTER_SUPPLEMENTAL_KEYS = Object.freeze([
  ...FIGHTER_SUPPLEMENTAL_RANGED_KEYS, ...FIGHTER_SUPPLEMENTAL_MELEE_KEYS
]);
const ranged = new Set(FIGHTER_SUPPLEMENTAL_RANGED_KEYS);
const melee = new Set(FIGHTER_SUPPLEMENTAL_MELEE_KEYS);

// Their shots are bounded, scheduled direct contacts, not physical missiles.
// The existing scheduler enforces target identity, life, position and direction
// on every contact and splits the DEFENDED native budget, including guard.
export function getFighterSupplementalDefinition(actor) {
  if (actor?.fighterAttacks?.super || actor?.special?.fighterProfile) return null;
  const d = resolveSourceSignature(actor);
  if (!d || d.kind !== 'personal' || d.effect !== 'damage'
    || d.projectile || d.summonAgent || d.protection
    || !(d.delivery === 'ranged' && ranged.has(d.key)
      || d.delivery === 'melee' && melee.has(d.key))
    || !Number.isFinite(d.range) || d.range <= 0
    || !Number.isInteger(d.hits) || d.hits < 1 || d.hits > 32
    || !Number.isFinite(d.hitGapTicks) || d.hitGapTicks <= 0) return null;
  const minRange = d.minRange ?? 0;
  return Number.isFinite(minRange) && minRange >= 0 && minRange < d.range ? d : null;
}
