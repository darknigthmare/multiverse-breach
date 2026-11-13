// Sanctum — definitions consumed by src/game/canonRosterWavePartD.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSanctum() {
  return (Object.freeze({ key: 'sanctum', universe: 'Sanctum', url: 'https://coffeestain.com/game/sanctum-2/' }));
}

export function createSanctum2({ SANCTUM, definePack, stageVariant }) {
  return (definePack(SANCTUM, {
  aliases: ['Sanctum franchise', 'Sanctum 2', 'Coffee Stain Sanctum'],
  mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#163849', '#071116', '#59efff'], motif: 'coredefense',
  theme: 'first-person tower defense, Core Guardian cooperation and the Lume war on LOEK III',
  continuity: 'Sanctum 2 base campaign, with Road to Elysion explicitly labelled for Fiskeplaske',
  adaptationRule: 'Keep the FPS/tower-defense hybrid central: every battle path must be shaped with towers before the Lumes reach an oxygen-producing Core. Preserve the four named Guardian classes and label DLC creatures instead of blending them into generic aliens.',
  canonStatus: 'Sanctum 2 canon roster with one labelled Road to Elysion boss',
  fr: 'Skye, Sweet et SiMo construisent un labyrinthe de tours autour des Cores tandis que les Lumes changent de trajectoire, d’armure et d’altitude.',
  en: 'Skye, Sweet and SiMo build a tower maze around the Cores while the Lumes change path, armor and altitude.',
  referenceUrls: [SANCTUM.url, 'https://coffeestain.com/game/sanctum/', 'https://store.steampowered.com/app/210770/Sanctum_2/', 'https://sanctum.fandom.com/wiki/Enemies'],
  visualAnchor: 'White-and-teal industrial platforms, luminous oxygen Cores, grid-built walls and towers, with Lumes retaining their distinct silhouettes and weak points.',
  characters: [
    { id: 'skye_autumn', name: 'Skye Autumn', role: 'marine', weapon: 'Assault Rifle', weaponType: 'gun', simple: 'Assault Rifle burst', secondary: 'Double-jump firing line', defense: 'Core Guardian sidestep', special: 'Sustained weak-point focus', visualAnchor: 'Tall red-haired Core Guardian in white-and-charcoal combat armor, compact assault rifle and confident forward stance; no official render copied.', fr: 'Chef d’escouade et héroïne du premier Sanctum, Skye excelle au fusil d’assaut et maintient la pression sur une même cible.', en: 'Squad leader and the first Sanctum hero, Skye excels with the assault rifle and sustained fire on one target.', canonStatus: 'canon Sanctum 1–2 protagonist' },
    { id: 'sweet_autumn', name: 'Sweet Autumn', role: 'slayer', weapon: 'REX Launcher', weaponType: 'gun', simple: 'REX grenade', secondary: 'Explosive radius control', defense: 'Guardian blast step', special: 'Core-lane bombardment', visualAnchor: 'Skye’s younger sister with shorter red hair, lighter Core Guardian armor and a bulky orange-accented REX grenade launcher; distinct silhouette from Skye.', fr: 'Sweet, la sœur cadette de Skye, utilise le REX Launcher pour contrôler les groupes de Lumes.', en: 'Skye’s younger sister Sweet uses the REX Launcher to control grouped Lumes.', canonStatus: 'canon Sanctum 2 playable Core Guardian' },
    { id: 'simo', name: 'SiMo UNIT 025-58', role: 'hacker', weapon: 'Sniper Rifle', weaponType: 'gun', simple: 'Precision shot', secondary: 'Robotic target solution', defense: 'Gyro-stabilized brace', special: 'Long-lane weak-point lock', visualAnchor: 'Slender white industrial Core Guardian robot with a single blue optic, long precision rifle and narrow articulated limbs; not a humanoid in armor.', fr: 'SiMo est un robot de soutien conçu pour éliminer les points faibles à très longue portée.', en: 'SiMo is a support robot designed to eliminate weak points at extreme range.', canonStatus: 'canon Sanctum 2 playable Core Guardian', entityType: 'core-guardian-robot' }
  ],
  monsters: [
    { id: 'walker', name: 'Walker', weapon: 'Heavy forelimb strikes', special: 'Armored core advance', visualAnchor: 'Broad six-limbed bioluminescent Lume with a low armored brow, massive front legs and exposed orange rear weak point.', fr: 'Le Walker est le Lume terrestre de référence : lent, massif et orienté vers le Core.', en: 'The Walker is the baseline ground Lume: slow, massive and fixed on the Core.', entityType: 'lume-ground-unit' },
    { id: 'runner', name: 'Runner', weapon: 'High-speed impact', special: 'Tower-maze sprint', visualAnchor: 'Small low-running Lume with elongated rear legs, cyan bioluminescent markings and a compact unarmored body.', fr: 'Le Runner sacrifie l’armure pour traverser rapidement les couloirs de tours.', en: 'The Runner trades armor for speed through tower lanes.', entityType: 'lume-fast-unit' },
    { id: 'hoverer', name: 'Hoverer', weapon: 'Aerial collision', special: 'Ignores ground maze', visualAnchor: 'Floating manta-shaped Lume with a hard pale frontal shell and a luminous vulnerable back, clearly airborne above the grid.', fr: 'Le Hoverer survole les obstacles terrestres et impose une défense antiaérienne.', en: 'The Hoverer flies over ground obstacles and demands anti-air defense.', entityType: 'lume-air-unit' }
  ],
  bosses: [
    { id: 'hoverer_queen', name: 'Hoverer Queen', weapon: 'Armored aerial charge', special: 'Rear weak-point rotation', visualAnchor: 'Enormous floating Lume queen with an invulnerable plated face, broad fin wings and a luminous exposed rear surface.', fr: 'La reine Hoverer ne peut être blessée que lorsqu’une défense coordonnée atteint son dos.', en: 'The Hoverer Queen can only be hurt when coordinated defenses reach her back.', canonStatus: 'canon Sanctum 2 base-game boss' },
    { id: 'super_heavy', name: 'Super Heavy', weapon: 'Crushing armored advance', special: 'Extreme frontal armor', visualAnchor: 'Colossal quadrupedal Lume enclosed in layered slate armor, tiny orange weak seams and feet that fill an entire tower lane.', fr: 'Le Super Heavy avance sous une armure extrême qui exige concentration de feu et amplification.', en: 'The Super Heavy advances under extreme armor that demands focused fire and amplification.', canonStatus: 'canon Sanctum 2 base-game boss' },
    { id: 'fiskeplaske', name: 'Fiskeplaske', weapon: 'Aquatic body slam', special: 'Tiny exposed weak point', visualAnchor: 'Huge pale aquatic Lume moving through a flooded defense lane, fishlike body and one small clearly exposed weak point.', fr: 'Fiskeplaske est le boss de Road to Elysion, presque invulnérable hors de son minuscule point faible.', en: 'Fiskeplaske is the Road to Elysion boss, nearly invulnerable outside its tiny weak point.', canonStatus: 'canon Road to Elysion DLC boss', continuityScope: 'Sanctum 2: Road to Elysion' }
  ],
  worldBoss: { id: 'walker_patriarch', name: 'Walker Patriarch', weapon: 'Patriarch charge', special: 'Final Core breach', visualAnchor: 'Towering elder Walker with a crownlike armored carapace, huge forward limbs, orange bioluminescent rear plates and scale exceeding standard Walkers.', fr: 'Le Walker Patriarch conclut la campagne de base et concentre la pression de toute la horde sur le dernier Core.', en: 'The Walker Patriarch closes the base campaign and focuses the entire horde’s pressure on the final Core.', canonStatus: 'canon Sanctum 2 base-campaign final boss', entityType: 'lume-patriarch', objective: 'Build a viable maze, expose the rear weak point and keep the oxygen Core intact.' },
  stage: { name: 'The Facility — The Gate', visualAnchor: 'Broad LOEK III facility entrance with a glowing Core, modular square floor tiles, construction holograms and several branching Lume lanes.', fr: 'La porte de la Facility devient un plan de défense à construire avant chaque vague.', en: 'The Facility gate becomes a defense plan to construct before every wave.' },
  stageVariants: [
    stageVariant('Tactics', 'The Gate — défense du Core', 'Expert', 'Walker Patriarch', { objective: 'Build and rebuild the tower maze between waves, then focus the Patriarch’s rear weak point.' }),
    stageVariant('RPG', 'Road to Elysion — chenal inondé', 'Expert', 'Fiskeplaske', { objective: 'Route the aquatic boss past amplifiers and hit only its exposed weak point.' })
  ],
  gear: [
    { id: 'assault_rifle', enName: 'Core Guardian Assault Rifle', frName: 'Fusil d’assaut des Core Guardians', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact white-and-charcoal automatic rifle with cyan power strip and no readable branding.', fr: 'L’arme automatique de Skye récompense le tir soutenu sur un point faible.', en: 'Skye’s automatic weapon rewards sustained fire on a weak point.' },
    { id: 'amp_spire', enName: 'AMP Spire', frName: 'Flèche AMP', boost: { def: 6, hp: 45 }, visualAnchor: 'Tall three-pronged amplifier tower with cyan rings projected across adjacent grid tiles.', fr: 'La flèche amplifie les dégâts des défenses qui couvrent sa zone.', en: 'The spire amplifies defenses covering its area.' },
    { id: 'gatling_tower', enName: 'Gatling Tower', frName: 'Tour Gatling', boost: { hp: 55, atk: 5 }, visualAnchor: 'Squat modular turret on a square grid base with twin rotating barrels and cyan targeting lamp.', fr: 'Une tour rapide destinée aux longues lignes du labyrinthe.', en: 'A fast tower made for long maze sightlines.' }
  ],
  event: { id: 'core_maze_rebuild', enName: 'Core Maze Rebuild', frName: 'Reconstruction du labyrinthe du Core', en: 'Between two Lume waves, the Guardians recover resources and redraw the maze without ever blocking the legal path to the Core.', fr: 'Entre deux vagues de Lumes, les Guardians récupèrent des ressources et redessinent le labyrinthe sans jamais fermer la route légale vers le Core.', visualAnchor: 'Three Guardians placing translucent tower blueprints around a luminous Core while the next wave glows in the distance.' }
}));
}
