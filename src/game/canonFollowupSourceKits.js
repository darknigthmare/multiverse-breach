// Follow-up identity corrections are kept separate from the frozen P0 wave.
// Descriptions select an incarnation and physical props; no candidate source
// URL or existing/new artwork is certified as having passed a 1:1 review here.
const DAMAGE_ADAPTATION = 'Physical source-described action adapted to game damage; exact source choreography is not certified.';
const ACTION_KEYS = ['simple', 'secondary', 'defense', 'special'];
const MELEE_PROFILES = Object.freeze({ shape: 'single', delivery: 'melee' });
const melee = name => ({
  name, type: 'melee', canonStatus: DAMAGE_ADAPTATION,
  attackProfile: MELEE_PROFILES,
  tacticsProfile: { range: 1 },
  smashProfile: { range: 70, verticalRange: 35, shape: 'single', delivery: 'melee', maxTargets: 1 },
  canonPresentation: { kind: 'melee' }
});
const guard = name => ({ name, type: 'shield', canonStatus: DAMAGE_ADAPTATION });
const lock = details => ({
  canonCombatPresentation: true,
  canonicalFidelityApproved: false,
  canonStatus: 'Description-based incarnation and equipment correction; combat values and sequences are game adaptations, not a 1:1 fidelity approval.',
  sourceReviewStatus: 'description-based; independent source review pending',
  referenceReviewStatus: 'candidate URLs; not read or visually reviewed for this correction',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'Physical contact and targeting adapted to the game; exact source choreography and timings pending.',
  ...details,
  referenceUrl: details.referenceUrls[0],
  simpleName: details.simple.name,
  secondaryName: details.secondary.name,
  defenseName: details.defense.name,
  specialName: details.special.name
});

export const CANON_FOLLOWUP_SOURCE_KITS = Object.freeze({
  liquid_snake: lock({
    sourceUniverse: 'Metal Gear',
    incarnation: 'Metal Gear Solid (1998) - Liquid Snake, final bare-handed duel on REX',
    referenceUrls: ['https://metalgear.fandom.com/wiki/Liquid_Snake'],
    equipment: ['Bare Fists', 'Bare-Chested Final-Duel Outfit'],
    sourceAbilities: ['Bare-Handed Strikes', 'Close-Quarters Kicks'],
    visualAnchor: 'Liquid Snake in the final Metal Gear Solid (1998) duel on the wrecked REX: long blond hair, bare muscular torso, trousers and boots, bare fists. The final-duel silhouette has no coat, sunglasses or handheld firearm. Hind D belongs to a separate earlier encounter and is not support for this bare-handed kit.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#c1a380',
    primaryColor: '#c1a380', secondaryColor: '#6f6755',
    simple: melee('Final-Duel Punch'),
    secondary: melee('Close-Quarters Kick'),
    defense: guard('Bare-Handed Duel Guard'),
    special: melee('REX-Top Bare-Handed Rush'),
    loreLocalized: {
      fr: 'Cette incarnation de Liquid Snake vise le duel final à mains nues sur REX détruit dans Metal Gear Solid de 1998. Il affronte Solid Snake avec ses poings et ses coups de pied, torse nu. Son manteau, un fusil et un soutien du Hind D ne font pas partie de ce kit. Les gestes physiques, leurs dégâts et leurs enchaînements sont adaptés au jeu ; les descriptions et les URL candidates ne remplacent pas une comparaison indépendante avec le combat original.',
      en: 'This incarnation of Liquid Snake selects the final bare-handed duel atop the wrecked REX in Metal Gear Solid (1998). He faces Solid Snake with punches and kicks, bare-chested. A coat, firearm and Hind D support are not part of this kit. Physical actions, damage and sequences adapt the source to the game; descriptions and candidate URLs do not replace independent comparison with the original fight.'
    }
  }),
  mistral_mgr: lock({
    sourceUniverse: 'Metal Gear Rising',
    incarnation: 'Metal Gear Rising: Revengeance (2013) - Mistral with Dwarf Gekko arms and L’Étranger',
    referenceUrls: ['https://metalgear.fandom.com/wiki/Mistral'],
    equipment: ['L’Étranger Dwarf Gekko Polearm', 'Attached Articulated Dwarf Gekko Arms'],
    sourceAbilities: ['L’Étranger Polearm Strikes', 'Articulated Dwarf Gekko Arm Attacks'],
    visualAnchor: 'Mistral in Metal Gear Rising: Revengeance (2013): red hair, fitted cyborg body and articulated Dwarf Gekko arms attached around her upper body. L’Étranger is assembled from Dwarf Gekko parts; keep the polearm and multiple attached arms visible and distinct. A two-arm fist fighter or Monsoon-style magnetic body is not this selected presentation.',
    weapon: 'polearm', weaponType: 'polearm', weaponColor: '#a9adb3',
    primaryColor: '#a54c43', secondaryColor: '#535960',
    simple: melee('L’Étranger Polearm Thrust'),
    secondary: melee('Articulated Dwarf Gekko Arm Strike'),
    defense: guard('L’Étranger Polearm Guard'),
    special: melee('L’Étranger Close-Quarters Sweep'),
    loreLocalized: {
      fr: 'Mistral est une cyborg des Winds of Destruction dans Metal Gear Rising: Revengeance de 2013. Les bras articulés issus des Dwarf Gekko et la lance L’Étranger définissent cette présentation de son combat contre Raiden. Le kit utilise des frappes physiques de lance et de bras ; il ne lui attribue ni la segmentation magnétique de Monsoon, ni une possession, ni un rayon Nexus. La portée, la garde et les dégâts restent des adaptations, et la comparaison avec la source originale est en attente.',
      en: 'Mistral is a Winds of Destruction cyborg in Metal Gear Rising: Revengeance (2013). Articulated Dwarf Gekko arms and the assembled L’Étranger polearm define this presentation of her fight with Raiden. The kit uses physical polearm and arm strikes without granting Monsoon’s magnetic segmentation, possession or a Nexus beam. Reach, guarding and damage remain adaptations, and comparison with the original source is pending.'
    }
  }),
  true_ogre_tekken: lock({
    sourceUniverse: 'Tekken',
    incarnation: 'Tekken 3 (1997 arcade / 1998 PlayStation) - True Ogre, transformed beast form',
    referenceUrls: ['https://tekken.fandom.com/wiki/True_Ogre'],
    equipment: ['Bestial Claw', 'Serpent Arm', 'Horned Winged Beast Anatomy'],
    sourceAbilities: ['Claw Strikes', 'Serpent-Arm Strikes', 'Physical Beast Attacks'],
    visualAnchor: 'True Ogre in Tekken 3 is the transformed large horned and winged beast, with an asymmetric clawed limb and a distinct serpent arm. Preserve the bestial body and serpent anatomy instead of two ordinary humanoid fists. This is the transformed form, not green humanoid Ogre; there is no handheld weapon or newly invented divine equipment.',
    weapon: 'claws', weaponType: 'claws', weaponColor: '#b49c75',
    primaryColor: '#866849', secondaryColor: '#59624a',
    simple: melee('True Ogre Claw Strike'),
    secondary: melee('Serpent-Arm Strike'),
    defense: guard('Bestial Contact Guard'),
    special: melee('True Ogre Physical Rush'),
    loreLocalized: {
      fr: 'True Ogre est la forme bestiale transformée d’Ogre dans Tekken 3, sorti en arcade en 1997 puis sur PlayStation en 1998. Sa silhouette cornue et ailée et son bras serpent le distinguent de la forme humanoïde. Ce kit représente la griffe, le bras serpent et les contacts du corps, sans arme ajoutée ni origine divine inventée. Il ne prétend pas reproduire la liste complète des coups du jeu original ; les descriptions doivent encore être comparées à la source et les valeurs de combat restent adaptées.',
      en: 'True Ogre is Ogre’s transformed beast form in Tekken 3, released in arcades in 1997 and on PlayStation in 1998. The horned, winged silhouette and serpent arm distinguish it from humanoid Ogre. This kit represents the claw, serpent arm and bodily contact without adding a weapon or inventing a divine origin. It does not reproduce the complete original move list; descriptions still require source comparison and combat values remain adaptations.'
    }
  })
});

export const CANON_FOLLOWUP_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_FOLLOWUP_SOURCE_KITS));

export function applyCanonFollowupSourceKit(hero) {
  const source = Object.hasOwn(CANON_FOLLOWUP_SOURCE_KITS, hero?.id)
    ? CANON_FOLLOWUP_SOURCE_KITS[hero.id] : null;
  if (!source || (hero.universe && hero.universe !== source.sourceUniverse)) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    sourceAbilities: [...source.sourceAbilities], loreLocalized: { ...source.loreLocalized }
  };
  for (const key of ACTION_KEYS) {
    const action = { ...hero[key], ...source[key] };
    // Existing save identities and authored balance own damage and resources.
    for (const [field, value] of Object.entries(hero[key] || {})) {
      if (typeof value === 'number') action[field] = value;
    }
    for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile', 'canonPresentation']) {
      if (action[profile]) action[profile] = { ...action[profile] };
    }
    result[key] = action;
  }
  return result;
}
