import { buff, defend, shot, area } from './rules.js';

const superAction = (action, color) => ({ ...action, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, sourceWork, sourceReference, sourceUrl, simple, secondary, defense, special) => ({
  sourceHeroId, universe: 'Mass Effect', sourceWork, sourceReference, sourceUrl,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special
});

// The selected Shepard is a ME2 Soldier. His class power is personal and never
// grants another caller biotics, a Sentinel shield, or a shared slowed clock.
export const ABILITIES_WAVE9_PART_B = Object.freeze({
  shepard: kit('shepard', 'Mass Effect 2 (2010), male default Shepard, Soldier',
    'ME2 Soldier has Adrenaline Rush and Concussive Shot and can use the M-8 Avenger assault rifle. Adrenaline Rush is adapted to a short bounded personal attack buff; the global simulation clock is unchanged. Concussive Shot is the ordinary single-target combat shot, not the optional Concussive Blast area evolution. Cover is personal physical protection. No ME3 omni-blade, Adept Singularity, Sentinel Tech Armor, Mako attack or inherited caller class power.',
    'https://guides.gamercorner.net/me2/classes/soldier',
    shot('Tir du M-8 Avenger', 1.1, { range: 640 }),
    buff('Adrenaline Rush', { targetSide: 'self', shape: 'single', range: 1, duration: 3, buffMultiplier: 1.12 }),
    defend('Couvert N7 de Shepard', 0.45),
    superAction(shot('Concussive Shot', 5.1, { range: 640 }), '#72aee8')),
  garrus: kit('garrus', 'Mass Effect 2 (2010), Garrus after Archangel recruitment',
    'ME2 Garrus uses assault and sniper rifles. His powers are Concussive Shot, Overload, Turian Rebel and loyalty Armor-Piercing Ammo. The selected super is the ordinary single-target Concussive Shot from his weapon, not an invented Killbox or a proximity mine. Overload is his real tech attack, adapted to one electrical impact without changing its identity to biotics. Personal cover does not grant an allied shield.',
    'https://guides.gamercorner.net/me2/party-members/garrus',
    shot('Tir de précision de Garrus', 1, { range: 640 }),
    shot('Overload', 1.8, { range: 600 }),
    defend('Couvert de Garrus', 0.45),
    superAction(shot('Concussive Shot', 4.6, { range: 640 }), '#8fc4f4')),
  liara: kit('liara', 'Mass Effect 2: Lair of the Shadow Broker (2010)',
    'DLC squad Liara has Singularity, Warp, Asari Scientist and Stasis, and uses heavy pistols or submachine guns. The selected M-3 Predator supplies her basic shot, Warp her secondary biotic projectile, and Singularity her localized biotic field. The field and its duration, damage and crowd control are bounded gameplay adaptations; no Shadow Broker data storm, electronic attack, ME1 Barrier loadout or instant environmental execution is asserted.',
    'https://guides.gamercorner.net/me2/party-members/liara',
    shot('Tir du M-3 Predator de Liara', 1, { range: 520 }),
    shot('Warp', 1.8, { range: 600 }),
    defend('Couvert de Liara', 0.45),
    superAction(area('Singularity', 4.6, { range: 640, areaRadius: 115 }), '#84a9ff'))
});

// Existing authored records keep their source identity. These are explicit
// corrections to the selected version/evolution and personal protection scope.
export const ABILITY_REVISIONS_WAVE9_PART_B = Object.freeze({
  tali: {
    universe: 'Mass Effect', sourceWork: 'Mass Effect 2 (2010)',
    sourceUrl: 'https://www.gamebanshee.com/masseffect2/powers/combatdrone.php',
    versionNote: 'Selected ME2 sealed purple enviro-suit. Combat Drone is a genuine tech projection; its Attack Drone evolution damages the target with an electrical shock. One finite shock is condensed here. Explosive Drone is a different evolution that explodes when destroyed, so the ordinary deployment is not an instantaneous group explosion. No unsealed face, alien pet, magical summon or transferred quarian biology.',
    special: superAction(shot('Drone de combat de Tali', 4.5, { range: 570 }), '#c08de8')
  },
  wrex: {
    universe: 'Mass Effect', sourceWork: 'Mass Effect (2007)',
    sourceUrl: 'https://www.gamerguides.com/mass-effect-1-legendary-edition/guide/talents/biotic/',
    versionNote: 'Selected ME1 heavy red krogan armor. Barrier surrounds and strengthens its own user, Wrex; the project adapts the temporary personal shields to bounded self guard. It is not a group shield, heal or damage attack. Legendary Edition reference describes the original ME1 talent semantics, not original2007 frame equivalence.',
    special: superAction(defend('Barrière biotique de Wrex', 0.45, { duration: 4 }), '#8da8f5')
  }
});
