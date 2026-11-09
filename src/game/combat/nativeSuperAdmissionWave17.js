import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from './combatSourceDefinitionsWave17.js';

export const NATIVE_SUPER_DEFINITIONS_WAVE17 = Object.freeze(Object.fromEntries(
  Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE17).map(([id, source]) => [id,
    Object.freeze([source.universe, source.name, source.kind, source.effect, source.delivery, source.weaponType])])));
export function supportsNativeSuperWave17(profile) {
  const entry = NATIVE_SUPER_DEFINITIONS_WAVE17[profile?.sourceHeroId];
  return !!entry && profile.universe === entry[0] && profile.name === entry[1]
    && profile.effect === entry[3] && profile.delivery === entry[4];
}
export const supportsTrackedProjectileVisualWave17 = profile => supportsNativeSuperWave17(profile)
  && profile.effect === 'damage' && profile.delivery === 'projectile';
