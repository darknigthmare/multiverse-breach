import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from './combatSourceDefinitionsWave16.js';
// Pure admission is shared with Node audits. Drawing dependencies belong only
// to the visual module; source identity and selected mechanics stay inspectable.
export const NATIVE_SUPER_DEFINITIONS_WAVE16 = Object.freeze(Object.fromEntries(
  Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE16).map(([id, entry]) => [id,
    Object.freeze([entry.universe, entry.name, entry.kind, entry.effect, entry.delivery, entry.weaponType])])));
export const supportsNativeSuperWave16 = profile => {
  const entry = NATIVE_SUPER_DEFINITIONS_WAVE16[profile?.sourceHeroId];
  return !!entry && profile.universe === entry[0] && profile.name === entry[1]
    && (profile.effect === entry[3] && profile.delivery === entry[4]
      || profile.sourceHeroId === 'hakumen_bb' && profile.counterTriggered === true
        && profile.effect === 'damage' && profile.delivery === 'melee');
};
export const supportsTrackedProjectileVisualWave16 = profile => supportsNativeSuperWave16(profile)
  && profile.effect === 'damage' && profile.delivery === 'projectile';
