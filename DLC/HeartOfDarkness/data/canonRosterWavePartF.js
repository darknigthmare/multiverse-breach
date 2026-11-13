// Heart of Darkness — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeartOfDarkness() {
  return (Object.freeze({ key: 'heart_of_darkness', universe: 'Heart of Darkness', url: 'https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf' }));
}

export function createHeartOfDarkness2({ HEART_OF_DARKNESS, definePack, stageVariant }) {
  return (definePack(HEART_OF_DARKNESS, {
  aliases: ['Harry of Darkness', 'Heart of Darkness (1998)', 'Cœur des ténèbres'],
  mediaType: 'video-game', faction: 'dream', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#191c45', '#03030a', '#e64b68'], motif: 'eclipse',
  theme: 'Andy’s nightmare journey to rescue Whisky through the Darklands',
  continuity: 'Amazing Studio / Interplay Heart of Darkness (1998)',
  adaptationRule: '“Harry of Darkness” is normalized to Heart of Darkness. Andy is the sole combat-capable protagonist; Whisky and the Amigos remain rescue/support Trials with no invented attacks or stats. The black-hole Heart is destroyed through the magic-rock plan, never a living HP boss.',
  visualAnchor: 'Hand-painted cinematic alien jungle, eclipse sky, pink magic rock, blue life energy and black shadow creatures.',
  canonStatus: '1998 game canon with rescue entities preserved as non-combat Trials',
  fr: 'Andy traverse un monde de cauchemar pour délivrer son chien Whisky et aider les Amigos à renverser le Maître des Ténèbres.',
  en: 'Andy crosses a nightmare world to free his dog Whisky and help the Amigos overthrow the Master of Darkness.',
  referenceUrls: [HEART_OF_DARKNESS.url, 'https://www.oldgames.sk/en/game/heart-of-darkness/download/8808/', 'https://www.mobygames.com/game/262/heart-of-darkness/'],
  characters: [
    { id: 'andy', name: 'Andy', role: 'hacker', weapon: 'Life-magic bolts', weaponType: 'magic', simple: 'Life bolt', secondary: 'Magic-rock shard', defense: 'Somersault escape', special: 'Meteor light surge', visualAnchor: 'Small red-haired boy adventurer in plain red shirt, dark trousers and round glasses, firing blue-white life magic; no realistic injury.', fr: 'Un garçon inventif qui transforme sa peur du noir en détermination pour sauver Whisky.', en: 'An inventive boy who turns his fear of the dark into determination to save Whisky.', depictionRule: 'Stylized family-safe peril only; no realistic child harm.' },
    { id: 'whisky_rescue', name: 'Whisky — Rescue Route', role: 'trial', nonCombat: true, objective: 'Reach Whisky’s cage and open a safe return route.', objectiveFr: 'Atteindre la cage de Whisky et ouvrir une route de retour sûre.', victoryCondition: 'whisky-rescued', visualAnchor: 'Small friendly brown dog waiting in a shadow-lair cage across four rescue states.', fr: 'Le chien d’Andy est l’objectif du voyage, pas un combattant inventé.', en: 'Andy’s dog is the journey’s rescue objective, not an invented fighter.', canonStatus: 'canon non-combat rescue ally' },
    { id: 'amigo_evacuation', name: 'Amigo Evacuation', role: 'trial', nonCombat: true, objective: 'Guide the Amigos out of the shadow pens and reunite their village.', objectiveFr: 'Guider les Amigos hors des enclos d’ombre et réunir leur village.', victoryCondition: 'amigos-safe', visualAnchor: 'Small pale friendly alien people moving from dark cages toward a luminous village, no combat pose.', fr: 'Les Amigos aident Andy et doivent être protégés pendant l’évasion.', en: 'The Amigos help Andy and must be protected during the escape.', canonStatus: 'canon friendly-people escort Trial' }
  ],
  monsters: [
    { id: 'shadow_crawler', name: 'Crawling Shadow', weapon: 'Ground grapple', special: 'Ledge ambush', visualAnchor: 'Low ink-black creature with long arms and bright eyes crawling under a rocky ledge.', fr: 'Une ombre rampante qui se dissimule sous les prises.', en: 'A crawling shadow hiding beneath ledges.' },
    { id: 'flying_shadow', name: 'Flying Shadow', weapon: 'Dive and fireball', special: 'Airborne flank', visualAnchor: 'Winged black silhouette with thin limbs and emberlike projectile above the alien jungle.', fr: 'Une ombre volante qui harcèle Andy dans les hauteurs.', en: 'A flying shadow harassing Andy at height.' },
    { id: 'shadow_spider', name: 'Shadow Spider', weapon: 'Bite', special: 'Slippery green secretion', visualAnchor: 'Angular black spider clinging to a cavern wall and dripping stylized green slime.', fr: 'Une araignée d’ombre qui rend les parois dangereuses.', en: 'A shadow spider making cavern walls treacherous.' }
  ],
  bosses: [
    { id: 'armored_shadow', name: 'Armored Shadow Warrior', weapon: 'Shadow fireball', special: 'Rock-guard formation', visualAnchor: 'Large black warrior silhouette encased in rough purple stone armor, glowing eyes and no gore.', fr: 'Un garde renforcé du domaine du Maître.', en: 'A reinforced guard of the Master’s domain.' },
    { id: 'vicious_servant', name: 'Vicious Servant — First Encounter', weapon: 'Massive claws', special: 'Bridge pursuit', visualAnchor: 'Huge hunched shadow servant with broad clawed arms, pink-lit eyes and a later hint of hesitation.', fr: 'Le Serviteur Vicieux poursuit d’abord Andy avant de se retourner contre son maître.', en: 'The Vicious Servant first pursues Andy before turning against its master.', canonStatus: 'canon boss-then-ally encounter' },
    { id: 'master_darkness', name: 'Master of Darkness', weapon: 'Double shadow fireballs', special: 'Shadow-horde command', visualAnchor: 'Tall crowned silhouette of pure darkness with red eyes and sweeping cloak-shape inside the lair.', fr: 'Le maître enlève Whisky et asservit les Amigos depuis son repaire.', en: 'The Master abducts Whisky and enslaves the Amigos from his lair.' }
  ],
  worldBoss: { id: 'heart_black_hole', name: 'The Heart of Darkness — Black-Hole Collapse', nonCombat: true, objective: 'Complete the magic-rock circuit and collapse the black hole while the Servant holds the route.', objectiveFr: 'Compléter le circuit de la roche magique et effondrer le trou noir pendant que le Serviteur tient la route.', victoryCondition: 'heart-collapsed-and-escape', visualAnchor: 'Central black hole ringed by pink magic-rock fragments across four collapse states, no face or humanoid body.', fr: 'Le Cœur est le trou noir au centre du repaire, neutralisé par le plan de la roche magique.', en: 'The Heart is the black hole at the lair’s center, neutralized by the magic-rock plan.', canonStatus: 'canon environmental finale Trial; not a creature' },
  stage: { name: 'Darklands — village des Amigos sous l’éclipse', visualAnchor: 'Layered blue alien cliffs, luminous plants, eclipse corona and small pale Amigo dwellings.', fr: 'Le village est pris entre la lumière de la roche et l’invasion des ombres.', en: 'The village is caught between the magic rock’s light and the shadow invasion.' },
  stageVariants: [
    stageVariant('Trial', 'Enclos des Amigos — évacuation', 'Hard', 'Amigo Evacuation', { nonCombat: true, trialType: 'Trial', objective: 'Open cages and route every Amigo to the lit shelter.' }),
    stageVariant('Trial', 'Repaire — effondrement du Cœur', 'Expert', 'The Heart of Darkness — Black-Hole Collapse', { nonCombat: true, trialType: 'Trial', objective: 'Assemble the magic-rock circuit and escape the collapse.' })
  ],
  gear: [
    { id: 'homemade_ship', enName: 'Andy’s Homemade Ship', frName: 'Vaisseau artisanal d’Andy', boost: { spd: 3, def: 3 }, visualAnchor: 'Child-built riveted flying machine with round cockpit and mismatched home-made controls.', fr: 'L’invention qui conduit Andy dans les Darklands.', en: 'The invention that carries Andy into the Darklands.' },
    { id: 'plasma_cannon', enName: 'Andy’s Plasma Cannon', frName: 'Canon à plasma d’Andy', boost: { atk: 7 }, visualAnchor: 'Bulky child-made energy cannon with blue coils and simple shoulder brace, no brand.', fr: 'L’arme technologique d’Andy avant la magie de vie.', en: 'Andy’s technological weapon before life magic.' },
    { id: 'magic_rock_shard', enName: 'Magic-Rock Shard', frName: 'Éclat de roche magique', boost: { hp: 45, def: 5 }, visualAnchor: 'Irregular pink crystal fragment radiating blue-white life tendrils.', fr: 'Un fragment de la roche qui nourrit la magie de vie.', en: 'A fragment of the rock that powers life magic.' }
  ],
  event: { id: 'servant_rebellion', enName: 'The Servant Changes Sides', frName: 'Le Serviteur change de camp', en: 'The Vicious Servant protects Andy’s route while the Amigos complete the magic-rock plan.', fr: 'Le Serviteur Vicieux protège la route d’Andy pendant que les Amigos complètent le plan de la roche magique.', visualAnchor: 'Huge servant silhouette shielding tiny Andy and Amigos from the Master’s fireballs.', canonStatus: 'canon finale event' }
}));
}
