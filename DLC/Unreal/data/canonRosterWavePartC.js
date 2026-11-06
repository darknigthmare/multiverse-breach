// Unreal — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUnreal1998() {
  return (Object.freeze({
  key: 'unreal_1998',
  universe: 'Unreal',
  url: 'https://oldunreal.com/guides/Unreal%20manual.pdf'
}));
}

export function createUnreal19982({ UNREAL_1998, definePack, stageVariant }) {
  return (definePack(UNREAL_1998, {
  aliases: ['Unreal (le jeu)', 'Unreal (1998)', 'Unreal Gold'],
  mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Expert',
  colors: ['#12283c', '#020508', '#4fc7b2'], motif: 'alienplanet',
  theme: 'Prisoner 849’s escape across Na Pali in the original 1998 campaign',
  continuity: 'Unreal (1998) base PC campaign only; excludes Return to Na Pali and Unreal Tournament',
  adaptationRule: 'Gina, Dante and Kurgan are selectable visual avatars for the same narrative role, Prisoner 849. They share weapons and have no separate canon biographies or exclusive abilities. Never mix Malcom or UT99 into this pack.',
  visualAnchor: 'Na Pali cliffs, waterfalls, ancient Nali stonework, rusted human technology and bioluminescent Skaarj interiors.',
  canonStatus: 'original 1998 base campaign; avatar-role adaptation explicitly disclosed',
  fr: 'Trois avatars sélectionnables représentent un même protagoniste, Prisoner 849, qui s’échappe du Vortex Rikers et traverse Na Pali jusqu’à la reine Skaarj.',
  en: 'Three selectable avatars represent the same protagonist, Prisoner 849, escaping the Vortex Rikers and crossing Na Pali to the Skaarj Queen.',
  referenceUrls: [UNREAL_1998.url, 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Dark_Arena.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Velora_Pass.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Demonlord%27s_Lair.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Skaarj_Queen.html'],
  characters: [
    { id: 'gina', name: 'Gina', role: 'marine', weapon: 'Shared Na Pali Arsenal', weaponType: 'gun', simple: 'Dispersion Pistol', secondary: 'Shared Weapon Pickup', defense: 'Prisoner 849 Dodge', special: 'Shared Na Pali Arsenal Cycle', visualAnchor: 'Original Unreal female prisoner avatar Gina in simple sci-fi survival clothing and late-1990s low-poly proportions.', fr: 'Gina est un avatar visuel possible de Prisoner 849.', en: 'Gina is one possible visual avatar for Prisoner 849.', canonStatus: 'canon selectable avatar for Prisoner 849', narrativeRole: 'Prisoner 849', sameProtagonistAs: ['Dante', 'Kurgan'], uniqueAbility: false },
    { id: 'dante', name: 'Dante', role: 'marine', weapon: 'Shared Na Pali Arsenal', weaponType: 'gun', simple: 'Dispersion Pistol', secondary: 'Shared Weapon Pickup', defense: 'Prisoner 849 Dodge', special: 'Shared Na Pali Arsenal Cycle', visualAnchor: 'Original Unreal male prisoner avatar Dante in utilitarian human clothing and late-1990s low-poly proportions.', fr: 'Dante est un autre habillage du même Prisoner 849.', en: 'Dante is another appearance for the same Prisoner 849.', canonStatus: 'canon selectable avatar for Prisoner 849', narrativeRole: 'Prisoner 849', sameProtagonistAs: ['Gina', 'Kurgan'], uniqueAbility: false },
    { id: 'kurgan', name: 'Kurgan', role: 'marine', weapon: 'Shared Na Pali Arsenal', weaponType: 'gun', simple: 'Dispersion Pistol', secondary: 'Shared Weapon Pickup', defense: 'Prisoner 849 Dodge', special: 'Shared Na Pali Arsenal Cycle', visualAnchor: 'Original Unreal male prisoner avatar Kurgan with rugged survival silhouette and late-1990s low-poly proportions.', fr: 'Kurgan est le troisième avatar retenu pour l’unique rôle de Prisoner 849.', en: 'Kurgan is the third retained avatar for the single Prisoner 849 role.', canonStatus: 'canon selectable avatar for Prisoner 849', narrativeRole: 'Prisoner 849', sameProtagonistAs: ['Gina', 'Dante'], uniqueAbility: false }
  ],
  monsters: [
    { id: 'skaarj_warrior', name: 'Skaarj Warrior', weapon: 'Razik claws', special: 'Skaarj leap', visualAnchor: 'Tall muscular Skaarj warrior with angular head crest, armored wrists and digitigrade alien posture.', fr: 'Le guerrier Skaarj est l’adversaire emblématique de Na Pali.', en: 'The Skaarj warrior is Na Pali’s emblematic opponent.' },
    { id: 'brute', name: 'Brute', weapon: 'Arm cannons', special: 'Twin projectile barrage', visualAnchor: 'Large round-bodied Brute with two integrated arm weapons and heavy planted stance.', fr: 'Le Brute avance en tirant avec ses deux armes de bras.', en: 'The Brute advances while firing its paired arm weapons.' },
    { id: 'krall', name: 'Krall', weapon: 'Staff', special: 'Krall squad rush', visualAnchor: 'Lean horned Krall warrior with staff, compact armor and recognizable forward-leaning gait.', fr: 'Le Krall combat au bâton et peut attaquer en groupe.', en: 'The Krall fights with a staff and can attack in groups.' }
  ],
  bosses: [
    { id: 'titan', name: 'Titan', weapon: 'Boulder throw', special: 'Titan ground quake', visualAnchor: 'Enormous gray-brown Titan with tiny head, massive arms and arena-filling stone bulk.', fr: 'Le Titan domine la Dark Arena par sa taille et ses rochers.', en: 'The Titan dominates the Dark Arena through size and thrown boulders.' },
    { id: 'stone_titan', name: 'Stone Titan', weapon: 'Stone fists', special: 'Velora Pass collapse', visualAnchor: 'Rock-textured Titan rising among Na Pali ruins, distinct from the flesh-toned Dark Arena Titan.', fr: 'Le Stone Titan garde le passage de Velora.', en: 'The Stone Titan guards Velora Pass.' },
    { id: 'warlord', name: 'Warlord', weapon: 'Infernal projectiles', special: 'Winged Demonlord assault', visualAnchor: 'Large winged Warlord with horned head, armored torso and firelit Demonlord’s Lair backdrop.', fr: 'Le Warlord règne sur le Demonlord’s Lair avant l’accès au vaisseau Skaarj.', en: 'The Warlord rules Demonlord’s Lair before access to the Skaarj ship.' }
  ],
  worldBoss: { id: 'queen', name: 'Skaarj Queen', weapon: 'Claws and acid projectiles', special: 'The Source final assault', visualAnchor: 'Towering Skaarj Queen with crown-like head structure, long limbs and the organic-metal chamber of The Source.', fr: 'La reine Skaarj est le boss final de la campagne originale à The Source.', en: 'The Skaarj Queen is the original campaign’s final boss at The Source.', canonStatus: 'canon 1998 final boss', entityType: 'campaign-final-boss', objective: 'Defeat the Queen and escape the Skaarj mothership.' },
  stage: { name: 'Vortex Rikers — pont-prison', visualAnchor: 'Crashed human prison ship, flickering blue emergency lights, broken cells and first glimpse of Na Pali outside.', fr: 'Prisoner 849 s’échappe du Vortex Rikers échoué.', en: 'Prisoner 849 escapes the wrecked Vortex Rikers.' },
  stageVariants: [
    stageVariant('Smash', 'Dark Arena de Na Pali', 'Very Hard', 'Titan', { objective: 'Read the Titan’s boulder arcs and survive the enclosed arena.' }),
    stageVariant('RPG', 'The Source — vaisseau-mère Skaarj', 'Expert', 'Skaarj Queen', { objective: 'Reach the Source, defeat the Queen and launch the escape pod.' })
  ],
  gear: [
    { id: 'dispersion_pistol', enName: 'Dispersion Pistol', frName: 'Pistolet à dispersion', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact original Unreal energy pistol with blue power glow and upgrade chamber.', fr: 'La première arme énergétique de Prisoner 849.', en: 'Prisoner 849’s first energy weapon.' },
    { id: 'automag', enName: 'Automag', frName: 'Automag', boost: { def: 6, hp: 45 }, visualAnchor: 'Original Unreal human automatic pistol with long dark slide and squared grip.', fr: 'Une arme humaine récupérée sur Na Pali.', en: 'A human weapon recovered on Na Pali.' },
    { id: 'asmd', enName: 'ASMD Shock Rifle', frName: 'Fusil Shock ASMD', boost: { hp: 50, atk: 6 }, visualAnchor: 'Original 1998 ASMD with forked energy front and blue-purple power core.', fr: 'Le fusil énergétique ASMD de la campagne originale.', en: 'The original campaign’s ASMD energy rifle.' }
  ],
  event: { id: 'nali_message', enName: 'Nali Translator Message', frName: 'Message du traducteur nali', en: 'A translated Nali message reveals a hidden route through the Skaarj occupation.', fr: 'Un message nali traduit révèle une voie cachée à travers l’occupation Skaarj.', visualAnchor: 'Small translator device illuminating carved Nali text in an ancient stone chamber.' }
}));
}
