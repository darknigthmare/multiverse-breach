const RESEARCH_DATE = '2026-08-02';

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const lore = (fr, en) => Object.freeze({ fr, en });

const ROLE_STATS = Object.freeze({
  marine: Object.freeze({ hp: 130, atk: 10, def: 8, spd: 4 }),
  horror: Object.freeze({ hp: 115, atk: 11, def: 7, spd: 5 }),
  slayer: Object.freeze({ hp: 105, atk: 14, def: 5, spd: 6 }),
  hacker: Object.freeze({ hp: 100, atk: 12, def: 6, spd: 6 }),
  tactical: Object.freeze({ hp: 120, atk: 11, def: 7, spd: 4 })
});

const move = (value, defaults) => Object.freeze(
  typeof value === 'object' && value !== null
    ? { ...defaults, ...value }
    : { ...defaults, name: value }
);

const fidelity = (source, visualAnchor, authoredLore, canonStatus, extra = {}) => Object.freeze({
  referenceUrl: source.url,
  visualAnchor,
  canonStatus,
  lore: authoredLore,
  ...extra
});

const character = (source, definition) => {
  const {
    id,
    runtimeId = `${source.key}_${id}`,
    name,
    role,
    visualAnchor,
    fr,
    en,
    canonStatus = 'canon protagonist',
    weapon = 'signature action',
    weaponType = 'improvised',
    simple = weapon,
    secondary = `${name} signature technique`,
    defense = `${name} defensive action`,
    special = `${name} decisive action`,
    stats = ROLE_STATS[role] || ROLE_STATS.tactical,
    ...provenance
  } = definition;

  if (provenance.nonCombat === true) {
    return Object.freeze([runtimeId, name, role, fidelity(
      source,
      visualAnchor,
      lore(fr, en),
      canonStatus,
      {
        ...provenance,
        nonCombat: true,
        entityType: provenance.entityType || 'non-combat-character-trial',
        objective: provenance.objective || `Complete ${typeof special === 'object' ? special.name : special} through interaction without combat.`,
        objectiveFr: provenance.objectiveFr || `Terminer l'objectif de ${name} par l'exploration et l'interaction, sans combat.`,
        victoryCondition: provenance.victoryCondition || `complete-${slugify(id)}-objective`,
        output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental objective sheet, three-quarter RPG exploration view. ${name}. Preserve: ${visualAnchor} Show four readable interaction states, no attack pose, combat HUD, official artwork, logos, text, actor likeness or cross-franchise costume.`
      }
    )]);
  }

  return Object.freeze([runtimeId, name, role, fidelity(
    source,
    visualAnchor,
    lore(fr, en),
    canonStatus,
    {
      ...provenance,
      weapon,
      weaponType,
      stats: Object.freeze({ ...stats }),
      simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'magic' ? 'energy' : weaponType === 'focus' ? 'status' : 'melee', dmg: weaponType === 'focus' ? 0 : 1.0 }),
      secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
      defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
      special: move(special, { type: 'origin_aoe', dmg: 4.0 }),
      output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
      spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or cross-franchise costume.`
    }
  )]);
};

const threat = (source, definition) => {
  const {
    id,
    name,
    weapon,
    special,
    visualAnchor,
    fr,
    en,
    canonStatus = 'canon adversary',
    phases = [`Uses ${weapon}`, `Escalates with ${special}`],
    ...extra
  } = definition;

  if (extra.nonCombat === true) {
    return Object.freeze({
      id: `${source.key}_${id}`,
      name,
      ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
        output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental objective sheet, three-quarter RPG exploration view. ${name}. Preserve: ${visualAnchor} Show four readable interaction states, no attack pose, combat HUD, official artwork, logo, text, actor likeness or unrelated redesign.`
      }),
      ...extra
    });
  }

  return Object.freeze({
    id: `${source.key}_${id}`,
    name,
    weapon,
    special,
    phases: Object.freeze(phases),
    ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
      output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
      spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or unrelated redesign.`
    }),
    ...extra
  });
};

const gear = (source, definition) => Object.freeze([
  `${source.key}_${definition.id}`,
  definition.enName,
  definition.frName,
  Object.freeze({ ...definition.boost }),
  fidelity(source, definition.visualAnchor, lore(definition.fr, definition.en), definition.canonStatus || 'canon prop', {
    output: `/sprites/generated/gear/${slugify(source.universe)}/${source.key}_${definition.id}.png`
  })
]);

const event = (source, definition) => Object.freeze([
  `evt_${source.key}_${definition.id}`,
  definition.enName,
  definition.frName,
  definition.en,
  definition.fr,
  fidelity(source, definition.visualAnchor, lore(definition.fr, definition.en), definition.canonStatus || 'canon-inspired event')
]);

const stageMeta = (source, definition) => fidelity(
  source,
  definition.visualAnchor,
  lore(definition.fr, definition.en),
  definition.canonStatus || 'canon location'
);

const stageVariant = (mode, name, difficulty, bossName, metadata) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata
]);

const requiredTrialFields = Object.freeze(['entityType', 'objective', 'objectiveFr', 'victoryCondition']);

const validateTrialDefinition = (source, definition) => {
  if (definition.nonCombat !== true) return;
  const missing = requiredTrialFields.filter(field => !definition[field]);
  if (missing.length > 0) {
    throw new Error(`${source.universe} non-combat entity ${definition.name || definition.id} is missing: ${missing.join(', ')}.`);
  }
};

const definePack = (source, config) => {
  [...config.characters, ...config.monsters, ...config.bosses, config.worldBoss]
    .forEach(definition => validateTrialDefinition(source, definition));

  const characters = config.characters.map(definition => character(source, definition));
  const monsters = config.monsters.map(definition => threat(source, definition));
  const bosses = config.bosses.map(definition => threat(source, definition));
  const worldBoss = threat(source, config.worldBoss);

  if (characters.length !== 3 || monsters.length !== 3 || bosses.length !== 3 || config.gear.length !== 3) {
    throw new Error(`${source.universe} must expose exactly 3 heroes, 3 enemies, 3 bosses and 3 gear items.`);
  }

  return Object.freeze({
    key: source.key,
    universe: source.universe,
    aliases: Object.freeze(config.aliases || []),
    title: config.title || source.universe,
    titleFr: config.titleFr || source.universe,
    mediaType: config.mediaType,
    faction: config.faction,
    mode: config.mode,
    difficulty: config.difficulty,
    colors: Object.freeze(config.colors),
    motif: config.motif,
    theme: config.theme,
    continuity: config.continuity,
    researchDate: RESEARCH_DATE,
    referenceUrl: source.url,
    referenceUrls: Object.freeze(config.referenceUrls || [source.url]),
    visualAnchor: config.visualAnchor,
    canonStatus: config.canonStatus,
    lore: lore(config.fr, config.en),
    desc: lore(config.fr, config.en),
    canonProfile: Object.freeze({
      continuity: config.continuity,
      adaptationRule: config.adaptationRule
    }),
    fidelityNotes: config.adaptationRule,
    ...(config.licensing ? { licensing: Object.freeze(config.licensing) } : {}),
    hero: characters[0],
    allies: Object.freeze(characters.slice(1)),
    monsters: Object.freeze(monsters),
    bosses: Object.freeze(bosses),
    boss: bosses[2].name,
    worldBoss,
    stage: config.stage.name,
    stageMeta: stageMeta(source, config.stage),
    stageVariants: Object.freeze(config.stageVariants),
    gear: Object.freeze(config.gear.map(definition => gear(source, definition))),
    event: event(source, config.event)
  });
};

const SANCTUM = Object.freeze({ key: 'sanctum', universe: 'Sanctum', url: 'https://coffeestain.com/game/sanctum-2/' });
const GOAT_SIMULATOR = Object.freeze({ key: 'goat_simulator', universe: 'Goat Simulator', url: 'https://coffeestain.com/game/goat-simulator/' });
const QUAKE = Object.freeze({ key: 'quake_franchise', universe: 'Quake', url: 'https://bethesda.net/game/quake' });
const LIKE_A_DRAGON = Object.freeze({ key: 'like_a_dragon', universe: 'Like a Dragon', url: 'https://rggstudio.sega.com/games/' });
const ITALIAN_BRAINROT = Object.freeze({ key: 'italian_brainrot', universe: 'Italian Brainrot', url: 'https://apnews.com/article/7600d1faea12be53609f3c2092e02eb7' });
const LEGACY_OF_KAIN = Object.freeze({ key: 'legacy_of_kain', universe: 'Legacy of Kain', url: 'https://www.aspyr.com/games/soul-reaver' });
const PREY_2006 = Object.freeze({ key: 'prey_2006', universe: 'Prey (2006)', url: 'https://nxeassets.xbox.com/shaxam/0201/21/3a/213a78dd-eeef-42f8-979a-c8a2158160da.PDF?v=1' });
const BEYOND_GOOD_EVIL = Object.freeze({ key: 'beyond_good_evil', universe: 'Beyond Good & Evil', url: 'https://www.ubisoft.com/en-us/game/beyond-good-and-evil/20th-anniversary-edition' });
const METAL_HELLSINGER = Object.freeze({ key: 'metal_hellsinger', universe: 'Metal: Hellsinger', url: 'https://www.metalhellsinger.com/' });
const DEAD_BY_DAYLIGHT = Object.freeze({ key: 'dead_by_daylight', universe: 'Dead by Daylight', url: 'https://deadbydaylight.com/news/dbd-celebrates-10-years-in-the-fog/' });
const DANTES_INFERNO = Object.freeze({ key: 'dantes_inferno', universe: "Dante's Inferno", url: 'https://news.ea.com/press-releases/press-releases-details/2010/EA-Welcomes-Players-to-Hell-with-the-Release-of-Dantes-Inferno/default.aspx' });
const SHADOW_MAN = Object.freeze({ key: 'shadow_man', universe: 'Shadow Man', url: 'https://store.steampowered.com/app/1413870/Shadow_Man_Remastered/' });
const CROC = Object.freeze({ key: 'croc', universe: 'Croc: Legend of the Gobbos', url: 'https://store.steampowered.com/app/3043940/Croc_Legend_of_the_Gobbos/' });

const sanctum = definePack(SANCTUM, {
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
});

const goatSimulator = definePack(GOAT_SIMULATOR, {
  aliases: ['Goat Sumilator', 'Goat Simulator franchise', 'Goat Simulator 3'],
  mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard',
  colors: ['#4d6429', '#111507', '#d9ff58'], motif: 'goatsandbox',
  theme: 'deliberately unstable goat sandbox, stunt scoring, absurd playable forms and four-player chaos',
  continuity: 'Goat Simulator franchise anthology, with every GoatZ, MMO, Waste of Space and Goat Simulator 3 element labelled by source',
  adaptationRule: 'Do not invent serious goat mythology for a comedy sandbox. Pilgor and selectable Goat Types cause physics chaos; only creatures that actually attack are combat threats. Towers, instinct boards, stunt scores and the server crash are objectives rather than opponents.',
  visualAnchor: 'Sunny low-rise GoatVille and San Angora streets, exaggerated physics props, goat towers, ramps, score-combo debris and deliberately rough simulation framing.',
  canonStatus: 'canon playable forms and expansion threats in a transparently labelled franchise anthology',
  fr: 'Pilgor, Tall Goat et Tony Shark transforment San Angora en parcours de cascades jusqu’à faire céder les serveurs eux-mêmes.',
  en: 'Pilgor, Tall Goat and Tony Shark turn San Angora into a stunt course until the servers themselves give way.',
  referenceUrls: [GOAT_SIMULATOR.url, 'https://www.goatsimulator3.com/', 'https://www.goatsimulator3.com/updates/anniversary-update/', 'https://www.playstation.com/en-us/games/goat-simulator-3/', 'https://news.xbox.com/en-us/2022/06/10/udder-mayhem-awaits-in-goat-simulator-3-this-fall/'],
  characters: [
    { id: 'pilgor', name: 'Pilgor', role: 'slayer', weapon: 'Charged headbutt', weaponType: 'fists', simple: 'Goat headbutt', secondary: 'Tongue drag', defense: 'Ragdoll recovery', special: 'Physics combo catastrophe', visualAnchor: 'Gray female goat with backward-curving horns, rectangular pupils, long tongue and no costume by default.', fr: 'Pilgor est la chèvre protagoniste récurrente et la source principale du chaos physique.', en: 'Pilgor is the recurring goat protagonist and the main source of physics chaos.', canonStatus: 'canon Goat Simulator protagonist' },
    { id: 'tall_goat', name: 'Tall Goat', role: 'marine', weapon: 'Giraffe head swing', weaponType: 'fists', simple: 'Tall headbutt', secondary: 'Long-neck sweep', defense: 'High-step stumble', special: 'Giraffe ragdoll launch', visualAnchor: 'Full-size yellow-brown giraffe used as a selectable Goat Type, long neck and ossicones, framed with normal giraffe proportions.', fr: 'Tall Goat est la forme girafe jouable, volontairement classée comme une « chèvre » par le jeu.', en: 'Tall Goat is the playable giraffe form, deliberately classified as a goat by the game.', canonStatus: 'canon playable Goat Type' },
    { id: 'tony_shark', name: 'Tony Shark', role: 'tactical', weapon: 'Skateboard ram', weaponType: 'fists', simple: 'Board bump', secondary: 'Half-pipe grind', defense: 'Skateboard carve', special: 'Hammerhead aerial combo', visualAnchor: 'Hammerhead shark supported upright on a small skateboard, gray-blue body and comedic but readable balance pose.', fr: 'Tony Shark est un requin-marteau jouable qui se déplace sur un skateboard.', en: 'Tony Shark is a playable hammerhead shark that moves on a skateboard.', canonStatus: 'canon Goat Simulator 3 playable Goat Type' }
  ],
  monsters: [
    { id: 'goatz_zombie', name: 'GoatZ Zombie', weapon: 'Zombie grapple', special: 'Outbreak swarm', visualAnchor: 'Cartoon human zombie from the GoatZ expansion with green-gray skin, torn casual clothes and loose ragdoll posture; no gore.', fr: 'Les zombies de GoatZ propagent l’épidémie autour de la chèvre.', en: 'GoatZ zombies spread the outbreak around the goat.', canonStatus: 'canon GoatZ expansion enemy', continuityScope: 'GoatZ' },
    { id: 'mmo_sheep', name: 'Goat MMO Sheep', weapon: 'Ram charge', special: 'Fantasy herd rush', visualAnchor: 'Chunky white sheep from the MMO parody zone wearing a tiny low-fantasy collar and charging with curled horns.', fr: 'Les moutons hostiles appartiennent à la parodie Goat MMO Simulator.', en: 'The hostile sheep belong to the Goat MMO Simulator parody.', canonStatus: 'canon Goat MMO Simulator hostile creature', continuityScope: 'Goat MMO Simulator' },
    { id: 'abominana', name: 'Abominana', weapon: 'Banana-limb flail', special: 'Aggressive fruit rush', visualAnchor: 'Tall peeled-banana creature with gangly yellow limbs, blackened fruit tip and a deliberately absurd upright silhouette.', fr: 'Abominana est une créature-fruit agressive rencontrée dans Goat Simulator 3.', en: 'Abominana is an aggressive fruit creature encountered in Goat Simulator 3.', canonStatus: 'canon Goat Simulator 3 aggressive NPC', continuityScope: 'Goat Simulator 3' }
  ],
  bosses: [
    { id: 'old_goat', name: 'Old Goat', weapon: 'Colossal hoof crush', special: 'MMO arena shockwave', visualAnchor: 'Oversized ancient goat parody boss with long beard, giant curled horns and stone-ring arena scale.', fr: 'Old Goat est une rencontre majeure de la parodie MMO.', en: 'Old Goat is a major encounter in the MMO parody.', canonStatus: 'canon Goat MMO Simulator boss', continuityScope: 'Goat MMO Simulator' },
    { id: 'alien_queen', name: 'Alien Queen', weapon: 'Alien claw strike', special: 'Space-station brood', visualAnchor: 'Large purple-gray alien queen in a bright modular space-station bay, exaggerated comedy proportions and no borrowed film design.', fr: 'La reine extraterrestre appartient à l’extension Waste of Space.', en: 'The alien queen belongs to the Waste of Space expansion.', canonStatus: 'canon Waste of Space boss', continuityScope: 'Goat Simulator: Waste of Space' },
    { id: 'farmer', name: 'The Farmer', weapon: 'Developer platform traps', special: 'Server-room lockdown', visualAnchor: 'Bearded farmer in straw hat and work overalls controlling floating retro platforms and glowing server cubes; no realistic person likeness.', fr: 'Le Farmer devient le boss final méta de Goat Simulator 3 derrière la grande porte du château.', en: 'The Farmer becomes Goat Simulator 3’s meta final boss behind the castle gate.', canonStatus: 'canon Goat Simulator 3 final boss', continuityScope: 'Goat Simulator 3' }
  ],
  worldBoss: { id: 'server_crash', name: 'Goat Simulator Server Crash', visualAnchor: 'San Angora breaking into floating untextured grid chunks, unstable server cubes, frozen ragdoll props and a blue error glow without readable text.', fr: 'La fin transforme la stabilité du jeu en véritable objectif : il faut provoquer puis traverser l’effondrement sans prétendre combattre un ordinateur vivant.', en: 'The finale turns game stability into the objective: trigger and traverse the collapse without pretending to fight a living computer.', canonStatus: 'canon-inspired systemic finale based on Goat Simulator 3 server destruction', entityType: 'systemic-chaos-trial', nonCombat: true, objective: 'Complete the platform route, break the required server cubes and reach the rebooted San Angora.', objectiveFr: 'Terminer le parcours de plateformes, briser les cubes-serveurs requis puis atteindre San Angora redémarrée.', victoryCondition: 'complete-route-trigger-reboot', prohibitedConcepts: ['sentient server monster', 'serious goat cosmology'], spritePrompt: 'Original fan-made pixel-art environmental objective sheet: a cheerful goat sandbox breaking into four progressive server-crash states, floating grid chunks and frozen props. No humanoid monster, face, combat HUD, logo or readable error text.' },
  stage: { name: 'San Angora — Goat Tower district', visualAnchor: 'Sunny open-world island district with a ruined stone Goat Tower, ramps, parked vehicles, festival props and exaggerated physics debris.', fr: 'Le quartier de la Goat Tower sert de terrain libre pour cascades, instinct challenges et secrets.', en: 'The Goat Tower district is an open playground for stunts, instinct challenges and secrets.' },
  stageVariants: [
    stageVariant('Smash', 'Goat Castle — plateforme du Farmer', 'Very Hard', 'The Farmer', { objective: 'Clear the retro platform sequence and interrupt the Farmer’s server controls.' }),
    stageVariant('Tactics', 'San Angora — redémarrage instable', 'Expert', 'Goat Simulator Server Crash', { objective: 'Chain enough physics goals to reach the reboot without treating the crash as a creature.', objectiveFr: 'Enchaîner assez d’objectifs physiques pour atteindre le redémarrage sans traiter le crash comme une créature.', victoryCondition: 'complete-route-trigger-reboot', nonCombat: true })
  ],
  gear: [
    { id: 'jetpack', enName: 'Goat Jetpack', frName: 'Jetpack de chèvre', boost: { atk: 7, spd: 2 }, visualAnchor: 'Small twin-cylinder red jetpack strapped to a goat harness, unstable angled exhaust and no logo.', fr: 'Le jetpack transforme le déplacement en vol difficilement contrôlable.', en: 'The jetpack turns movement into barely controlled flight.' },
    { id: 'goat_tongue', enName: 'Goat Tongue', frName: 'Langue de chèvre', boost: { def: 5, hp: 55 }, visualAnchor: 'Long elastic pink goat tongue attached to a simple interaction harness icon, rendered without detached anatomy.', fr: 'La langue permet de lécher puis traîner presque tous les accessoires physiques.', en: 'The tongue can lick and drag almost any physics prop.', canonStatus: 'canon core mechanic represented as equipment' },
    { id: 'paraglider', enName: 'Paraglider', frName: 'Parapente', boost: { hp: 45, spd: 3 }, visualAnchor: 'Compact rainbow-free fabric paraglider on a goat back harness, curved neutral canopy and dangling control cords.', fr: 'Le parapente prolonge les cascades aériennes au-dessus de San Angora.', en: 'The paraglider extends aerial stunts above San Angora.' }
  ],
  event: { id: 'four_goat_sandbox', enName: 'Four-Goat Sandbox Combo', frName: 'Combo sandbox à quatre chèvres', en: 'Four Goat Types share one stunt score, chaining tongue drags, ramps and headbutts until the physics multiplier peaks.', fr: 'Quatre Goat Types partagent un score de cascade et enchaînent langue, rampes et coups de tête jusqu’au maximum du multiplicateur physique.', visualAnchor: 'Pilgor, Tall Goat and Tony Shark crossing the same sunny stunt line amid harmless flying props and no UI text.' }
});

const quake = definePack(QUAKE, {
  aliases: ['Quake game franchise', 'QUAKE', 'Quake II', 'Quake 4'],
  mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Expert',
  colors: ['#493b31', '#090706', '#e46b34'], motif: 'slipgate',
  theme: 'Slipgate counter-invasion, elder realms and the separate Strogg military science-fiction continuity',
  continuity: 'labelled franchise anthology: Quake (1996), Quake II (1997) and Quake 4 (2005); no claim that all three campaigns share one uninterrupted plot',
  adaptationRule: 'Keep Quake 1’s nameless Ranger and occult Slipgate realms separate from Quake II/4’s Stroggos war. Every hero, enemy, weapon and boss identifies its campaign; the Nexus is a network objective, never a magical extension of Shub-Niggurath.',
  visualAnchor: 'Brown stone Slipgate ruins, rusted military bases, orange lava, angular rune gates, then black-metal Strogg industry with green machine fluid and biomechanical implants.',
  canonStatus: 'canon protagonists and threats in a continuity-labelled franchise anthology',
  fr: 'Ranger, Bitterman et Matthew Kane affrontent chacun leur guerre : les royaumes de Shub d’un côté, la machine militaire strogg de l’autre.',
  en: 'Ranger, Bitterman and Matthew Kane each face their own war: Shub’s realms on one side and the Strogg military machine on the other.',
  referenceUrls: [QUAKE.url, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2310/manuals/QUAKE%20Manual.pdf?t=1572894215', 'https://bethesda.net/game/quakeii', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2330/manuals/manual_en.pdf?t=1660237210', 'https://store.steampowered.com/app/2210/Quake_4/'],
  characters: [
    { id: 'ranger', name: 'Ranger', role: 'slayer', weapon: 'Quake Shotgun', weaponType: 'gun', simple: 'Shotgun blast', secondary: 'Rocket jump', defense: 'Slipgate strafe', special: 'Rune-powered arsenal', visualAnchor: 'Muscular unnamed Slipgate operative in brown combat trousers, dull green chest armor, square boots and a compact double-barrel shotgun; helmetless and without Doom insignia.', fr: 'Seul survivant opérationnel de la contre-attaque Slipgate, Ranger traverse les quatre dimensions de Quake.', en: 'The only operative left for the Slipgate counterattack, Ranger crosses Quake’s four dimensions.', canonStatus: 'canon Quake (1996) protagonist', continuityScope: 'Quake (1996)' },
    { id: 'bitterman', name: 'Bitterman', role: 'marine', weapon: 'Quake II Blaster', weaponType: 'gun', simple: 'Blaster bolt', secondary: 'Railgun line shot', defense: 'Power Shield brace', special: 'Operation Alien Overlord strike', visualAnchor: 'Battle-worn human marine with close-cropped hair, tan bandolier over dark green armor and a yellow-orange Quake II blaster; no helmet logo.', fr: 'Bitterman survit au largage sur Stroggos et accomplit seul les objectifs d’Operation Alien Overlord.', en: 'Bitterman survives the drop on Stroggos and completes Operation Alien Overlord’s objectives alone.', canonStatus: 'canon Quake II protagonist', continuityScope: 'Quake II (1997)' },
    { id: 'matthew_kane', name: 'Corporal Matthew Kane', role: 'tactical', weapon: 'Quake 4 Machinegun', weaponType: 'gun', simple: 'Marine burst', secondary: 'Strogg implant overdrive', defense: 'Rhino Squad cover', special: 'Nexus infiltration', visualAnchor: 'Rhino Squad marine in heavy charcoal armor with amber lamps, partially Stroggified right-side implants and a rugged machinegun; no actor likeness.', fr: 'Kane poursuit l’offensive de Quake II, survit à la stroggification et utilise ses implants pour infiltrer le Nexus.', en: 'Kane continues Quake II’s offensive, survives Stroggification and uses his implants to infiltrate the Nexus.', canonStatus: 'canon Quake 4 protagonist', continuityScope: 'Quake 4 (2005)', entityType: 'partially-stroggified-marine' }
  ],
  monsters: [
    { id: 'ogre', name: 'Ogre', weapon: 'Chainsaw and grenade launcher', special: 'Castle grenade arc', visualAnchor: 'Hulking brown-skinned Quake ogre in a grimy apron, chainsaw mounted to one arm and grenade launcher in the other.', fr: 'L’Ogre garde les châteaux de Quake avec tronçonneuse et grenades.', en: 'The Ogre guards Quake’s castles with chainsaw and grenades.', canonStatus: 'canon Quake (1996) enemy', continuityScope: 'Quake (1996)' },
    { id: 'berserker', name: 'Strogg Berserker', weapon: 'Power hammer and spike arm', special: 'Long Strogg lunge', visualAnchor: 'Tall Quake II cyborg with raw muscular torso, metal legs, one piston hammer arm and one pointed blade arm.', fr: 'Le Berserker est un soldat strogg de mêlée reconstruit autour de deux bras-outils.', en: 'The Berserker is a Strogg melee soldier rebuilt around two tool-arms.', canonStatus: 'canon Quake II enemy', continuityScope: 'Quake II (1997)' },
    { id: 'gladiator', name: 'Strogg Gladiator', weapon: 'Railgun and cleaver', special: 'Precision rail shot', visualAnchor: 'Broad Quake II cyborg with dark steel legs, large shoulder railgun, one heavy cleaver arm and exposed organic upper body.', fr: 'Le Gladiator combine un railgun longue portée et une lame massive.', en: 'The Gladiator combines a long-range railgun with a massive blade.', canonStatus: 'canon Quake II/4 Strogg unit', continuityScope: 'Quake II and Quake 4' }
  ],
  bosses: [
    { id: 'chthon', name: 'Chthon', weapon: 'Lava fireballs', special: 'Rune-column electrocution puzzle', visualAnchor: 'Enormous horned molten creature rising waist-deep from a square lava chamber between two metal lightning columns.', fr: 'Chthon ne se bat pas au fusil : Ranger active les colonnes électriques de son arène.', en: 'Chthon is not fought with gunfire: Ranger activates the arena’s lightning columns.', canonStatus: 'canon Quake Episode 1 boss', continuityScope: 'Quake (1996)', entityType: 'arena-puzzle-boss', objective: 'Activate both rune columns and discharge the lightning mechanism into Chthon.' },
    { id: 'makron_q2', name: 'Makron — Quake II', weapon: 'BFG arm and railgun', special: 'Jorg exoskeleton assault', visualAnchor: 'Quake II Strogg warlord mounted inside the towering two-legged Jorg exoskeleton, red optic, integrated BFG arm and industrial cabling.', fr: 'Le Makron dirige les warlords strogg et affronte Bitterman depuis son exosquelette Jorg.', en: 'The Makron commands the Strogg warlords and confronts Bitterman in the Jorg exoskeleton.', canonStatus: 'canon Quake II final boss', continuityScope: 'Quake II (1997)' },
    { id: 'network_guardian', name: 'Network Guardian', weapon: 'Dark-matter projectiles', special: 'Nexus shield defense', visualAnchor: 'Massive Quake 4 Strogg guardian with broad armored torso, four heavy support limbs, blue-black energy cannons and network cables.', fr: 'Le Network Guardian protège l’accès au Nexus dans Quake 4.', en: 'The Network Guardian protects access to the Nexus in Quake 4.', canonStatus: 'canon Quake 4 boss', continuityScope: 'Quake 4 (2005)' }
  ],
  worldBoss: { id: 'shub_niggurath', name: 'Shub-Niggurath', weapon: 'Spawn and dimensional corruption', special: 'Telefrag-only finale', visualAnchor: 'Immense stationary black-brown horned mass with many short tentacles in a rune-lit pit, presented as the exact final entity’s silhouette rather than a humanoid goddess.', fr: 'La Hell-Mother conclut Quake ; Ranger doit téléporter son corps dans le sien plutôt que vider une barre de vie ordinaire.', en: 'The Hell-Mother closes Quake; Ranger must teleport his body into hers rather than drain an ordinary health bar.', canonStatus: 'canon Quake (1996) final boss', continuityScope: 'Quake (1996)', entityType: 'telefrag-world-boss', objective: 'Follow the roaming spike ball and enter the Slipgate at the instant it crosses Shub-Niggurath.', objectiveFr: 'Suivre la boule hérissée mobile puis franchir le Slipgate lorsqu’elle traverse Shub-Niggurath.', victoryCondition: 'telefrag' },
  stage: { name: 'Slipgate Complex — counter-invasion relay', visualAnchor: 'Low brown-stone military complex with green wall monitors, nail-gun crates, shallow toxic channels and one humming rune Slipgate.', fr: 'Le complexe militaire ouvre la contre-invasion vers les dimensions de Quake.', en: 'The military complex opens the counter-invasion into Quake’s dimensions.', continuityScope: 'Quake (1996)' },
  stageVariants: [
    stageVariant('RPG', 'Shub-Niggurath’s Pit — téléfrag', 'Expert', 'Shub-Niggurath', { objective: 'Time the Slipgate jump to the orbiting spike ball; ordinary damage cannot complete the finale.' }),
    stageVariant('Tactics', 'Stroggos — palais du Makron', 'Expert', 'Makron — Quake II', { objective: 'Survive the Jorg phase, then isolate the Makron from Strogg reinforcements.', continuityScope: 'Quake II (1997)' })
  ],
  gear: [
    { id: 'rocket_launcher', enName: 'Quake Rocket Launcher', frName: 'Lance-roquettes de Quake', boost: { atk: 10, spd: 1 }, visualAnchor: 'Compact rust-brown Quake launcher with square muzzle, top sight and no modern tactical accessories.', fr: 'L’arme emblématique de Ranger sert aussi au rocket jump.', en: 'Ranger’s iconic weapon also enables rocket jumps.', continuityScope: 'Quake (1996)' },
    { id: 'quad_damage', enName: 'Quad Damage', frName: 'Quad Damage', boost: { def: 5, hp: 55 }, visualAnchor: 'Small dark metal crate emitting a four-point blue energy aura, no readable letter or copied icon.', fr: 'Le bonus temporaire multiplie les dégâts et colore l’arme d’une lueur bleue.', en: 'The temporary power-up multiplies damage and casts a blue glow over the weapon.' },
    { id: 'railgun', enName: 'Strogg Railgun', frName: 'Railgun strogg', boost: { hp: 45, atk: 7 }, visualAnchor: 'Long angular black-metal Quake II railgun with bronze rails and a green power cell.', fr: 'Le railgun de la continuité strogg tire une ligne de haute précision.', en: 'The Strogg-continuity railgun fires a high-precision line.', continuityScope: 'Quake II/4' }
  ],
  event: { id: 'slipgate_anthology', enName: 'Slipgate Anthology Breach', frName: 'Brèche anthologique des Slipgates', en: 'A Nexus fault opens labelled routes to Quake’s elder realms and to Stroggos without pretending the two invasions share one commander.', fr: 'Une panne du Nexus ouvre des routes étiquetées vers les royaumes anciens de Quake et vers Stroggos sans prétendre que les deux invasions partagent un commandement.', visualAnchor: 'One rusted Slipgate splitting into a brown rune castle route and a black-metal Strogg factory route, with no merged creature design.', canonStatus: 'project crossover event preserving separate Quake continuities' }
});

const likeADragon = definePack(LIKE_A_DRAGON, {
  aliases: ['Yakuza', 'Yakuza game franchise', 'Ryū ga Gotoku', 'Like a Dragon franchise'],
  mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Expert',
  colors: ['#2b1720', '#070305', '#ff4264'], motif: 'kamurocho',
  theme: 'Japanese crime melodrama, street brawling, found family and intensely detailed city side activities',
  continuity: 'mainline Yakuza / Like a Dragon franchise anthology from Kazuma Kiryu’s saga through Ichiban Kasuga’s saga; each antagonist retains the game in which their rivalry matters',
  adaptationRule: 'Keep Kiryu, Ichiban and Majima’s distinct combat identities and moral codes. Use fictional clans and named rivals, never real criminal branding. Avoid actor likenesses and do not collapse Ichiban’s imagination-driven RPG presentation into literal magic.',
  visualAnchor: 'Dense Kamurocho and Isezaki Ijincho nightlife, wet asphalt, red lantern alleys, convenience-store light, bicycles as improvised weapons and dramatic shirtless boss-arena framing without tattoos copied as logos.',
  canonStatus: 'canon mainline characters and recurring challenge roster in a game-labelled anthology',
  fr: 'Kiryu, Ichiban et Majima traversent les guerres de clans comme les détours les plus absurdes de Kamurocho, sans jamais abandonner leurs proches.',
  en: 'Kiryu, Ichiban and Majima cross clan wars and Kamurocho’s strangest detours without abandoning the people close to them.',
  referenceUrls: [LIKE_A_DRAGON.url, 'https://likeadragon.sega.com/yakuza-like-a-dragon/home.html?lang=fr', 'https://gaiden.sega.com/index.html?lang=en', 'https://ryu-ga-gotoku.com/', 'https://store.steampowered.com/app/638970/Yakuza_0/'],
  characters: [
    { id: 'kazuma_kiryu', name: 'Kazuma Kiryu', role: 'slayer', weapon: 'Dragon of Dojima style', weaponType: 'fists', simple: 'Rush Combo', secondary: 'Essence of Finishing Blow', defense: 'Komaki parry', special: 'Tiger Drop', visualAnchor: 'Tall Japanese man with short swept-back black hair, light gray suit, open-collar dark red shirt and white loafers; no actor likeness and no exposed tattoo in default pose.', fr: 'Ancien quatrième président du clan Tojo, Kiryu protège sa famille choisie avec le style du Dragon de Dojima.', en: 'A former fourth chairman of the Tojo Clan, Kiryu protects his chosen family with the Dragon of Dojima style.', canonStatus: 'canon mainline protagonist' },
    { id: 'ichiban_kasuga', name: 'Ichiban Kasuga', role: 'tactical', weapon: 'Hero’s Bat', weaponType: 'fists', simple: 'Bat combo', secondary: 'Tag-team command', defense: 'Heroic guard', special: 'Essence of Friendship', visualAnchor: 'Japanese man with large unruly curly black hair, burgundy suit, open white shirt, gold chain and a baseball bat held like an RPG hero; no actor likeness.', fr: 'Ichiban transforme mentalement les bagarres en RPG et rassemble une équipe de laissés-pour-compte.', en: 'Ichiban imagines street fights as an RPG and gathers a party of society’s outcasts.', canonStatus: 'canon Like a Dragon saga protagonist', presentationRule: 'RPG effects represent Ichiban’s imagination, not literal spellcasting.' },
    { id: 'goro_majima', name: 'Goro Majima', role: 'horror', weapon: 'Mad Dog style dagger', weaponType: 'blade', simple: 'Dagger rush', secondary: 'Breaker spin', defense: 'Unpredictable sway', special: 'Mad Dog pounce', visualAnchor: 'Lean Japanese man in black leather trousers, open snakeskin-pattern jacket, black eyepatch over left eye and short tanto; no actor likeness or copied tattoo display.', fr: 'Le Mad Dog of Shimano alterne vitesse, feintes et style Breaker imprévisible.', en: 'The Mad Dog of Shimano alternates speed, feints and an unpredictable Breaker style.', canonStatus: 'canon playable protagonist, rival and ally depending on game' }
  ],
  monsters: [
    { id: 'tojo_street_tough', name: 'Tojo Clan Street Tough', weapon: 'Street brawler fists', special: 'Alley surround', visualAnchor: 'Low-ranking fictional Tojo brawler in an inexpensive dark suit with loosened tie, raised fists and no real-world insignia.', fr: 'Un homme de main du clan Tojo rencontré dans les conflits de rue de la saga.', en: 'A low-ranking Tojo Clan man encountered in the saga’s street conflicts.', canonStatus: 'canon faction archetype; unnamed rank-and-file', entityType: 'fictional-clan-brawler' },
    { id: 'omi_enforcer', name: 'Omi Alliance Enforcer', weapon: 'Reinforced baton', special: 'Sotenbori pressure line', visualAnchor: 'Broad fictional Omi enforcer in a charcoal suit, orange shirt and compact baton, clearly distinct from named characters.', fr: 'Un exécuteur de l’Alliance Omi chargé de tenir les rues de Sotenbori.', en: 'An Omi Alliance enforcer assigned to hold Sotenbori’s streets.', canonStatus: 'canon faction archetype; unnamed rank-and-file', entityType: 'fictional-clan-enforcer' },
    { id: 'jingweon_commando', name: 'Jingweon Commando', weapon: 'Tactical knife', special: 'Millennium Tower infiltration', visualAnchor: 'Masked fictional Jingweon commando in plain black tactical clothing with a short knife, no national military symbol or real unit markings.', fr: 'Un commando de la mafia fictive Jingweon impliqué dans l’assaut du Millennium Tower.', en: 'A commando of the fictional Jingweon Mafia involved in the Millennium Tower assault.', canonStatus: 'canon Yakuza 2 faction archetype', continuityScope: 'Yakuza 2 / Kiwami 2' }
  ],
  bosses: [
    { id: 'akira_nishikiyama', name: 'Akira Nishikiyama', weapon: 'Nishikiyama fighting style', special: 'Millennium Tower oath duel', visualAnchor: 'Japanese man with slicked-back dark hair, white suit over a black open-collar shirt, controlled boxing stance and no actor likeness or tattoo display.', fr: 'Frère juré de Kiryu devenu rival, Nishikiyama conclut le premier drame au Millennium Tower.', en: 'Kiryu’s sworn brother turned rival, Nishikiyama closes the first drama at Millennium Tower.', canonStatus: 'canon Yakuza / Kiwami principal rival', continuityScope: 'Yakuza / Yakuza Kiwami' },
    { id: 'ryuji_goda', name: 'Ryuji Goda', weapon: 'Dragon of Kansai brawling', special: 'Final dragon duel', visualAnchor: 'Very tall blond Japanese man in cream suit with burgundy shirt, massive bare-handed stance and no actor likeness or exposed tattoo.', fr: 'Le Dragon du Kansai cherche à prouver qu’il ne peut exister qu’un seul dragon.', en: 'The Dragon of Kansai seeks to prove that there can be only one dragon.', canonStatus: 'canon Yakuza 2 / Kiwami 2 principal rival', continuityScope: 'Yakuza 2 / Yakuza Kiwami 2' },
    { id: 'ryo_aoki', name: 'Ryo Aoki / Masato Arakawa', weapon: 'Political and underworld network', special: 'Coin-locker truth confrontation', visualAnchor: 'Young Japanese politician in tailored navy suit before a stark campaign stage and coin-locker motif, no actor likeness, weapon pose or real party branding.', fr: 'Masato Arakawa, devenu le gouverneur Ryo Aoki, manipule à la fois politique et pègre avant la confrontation avec Ichiban.', en: 'Masato Arakawa, now Governor Ryo Aoki, manipulates politics and the underworld before confronting Ichiban.', canonStatus: 'canon Yakuza: Like a Dragon principal antagonist', continuityScope: 'Yakuza: Like a Dragon', entityType: 'political-criminal-antagonist', objective: 'Defeat his remaining security detail, expose the conspiracy and reach Masato as Ichiban rather than execute him.' }
  ],
  worldBoss: { id: 'jo_amon', name: 'Jo Amon', weapon: 'Amon copy techniques', special: 'Recurring secret superboss arsenal', visualAnchor: 'Elite Japanese challenge fighter in a black suit, dark sunglasses and red tie, surrounded by neutral training spotlights rather than supernatural effects; no actor likeness.', fr: 'Jo Amon incarne le défi secret récurrent réservé au joueur qui maîtrise tout le système de combat.', en: 'Jo Amon embodies the recurring secret challenge reserved for players who master the entire combat system.', canonStatus: 'canon recurring Amon Clan secret superboss', entityType: 'challenge-world-boss', objective: 'Survive the full Amon technique rotation and win the optional mastery duel.' },
  stage: { name: 'Kamurocho — Millennium Tower rooftop', visualAnchor: 'Rain-slick rooftop above a dense red-and-blue nightlife grid, steel helipad rails and the illuminated fictional Millennium Tower crown.', fr: 'Le toit du Millennium Tower condense les serments, trahisons et duels décisifs de Kamurocho.', en: 'The Millennium Tower rooftop condenses Kamurocho’s decisive oaths, betrayals and duels.' },
  stageVariants: [
    stageVariant('Smash', 'Sotenbori — duel des deux dragons', 'Expert', 'Ryuji Goda', { objective: 'Win the bare-handed final rivalry without outside reinforcements.' }),
    stageVariant('Tactics', 'Survive Bar — défi karaoké', 'Hard', 'Karaoke Score Challenge', { objective: 'Complete the rhythm phrases and audience-response prompts; there is no opponent to attack.', objectiveFr: 'Terminer les phrases rythmiques et les réponses du public ; aucun adversaire ne doit être attaqué.', victoryCondition: 'reach-karaoke-score', nonCombat: true })
  ],
  gear: [
    { id: 'staminan_royale', enName: 'Staminan Royale', frName: 'Staminan Royale', boost: { hp: 85 }, visualAnchor: 'Small amber energy-drink bottle with red cap and an original unreadable cream label.', fr: 'Un objet de soin puissant vendu dans les commerces de la saga.', en: 'A powerful recovery item sold throughout the series.' },
    { id: 'heros_bat', enName: 'Hero’s Bat', frName: 'Batte du héros', boost: { atk: 8, spd: 1 }, visualAnchor: 'Well-used silver baseball bat wrapped near the handle, emitting only stylized imagination sparks and no text.', fr: 'Ichiban traite cette batte comme l’arme d’un héros de RPG.', en: 'Ichiban treats this bat as an RPG hero’s weapon.', canonStatus: 'canon Ichiban weapon with imagination-based presentation' },
    { id: 'demonfire_dagger', enName: 'Demonfire Dagger', frName: 'Dague Demonfire', boost: { def: 5, atk: 5 }, visualAnchor: 'Short tanto-like dagger with dark wrapped grip and warm orange reflection, no actual flame enchantment or symbol.', fr: 'La dague caractéristique du style Mad Dog de Majima.', en: 'The characteristic dagger of Majima’s Mad Dog style.' }
  ],
  event: { id: 'essence_found_family', enName: 'Essence of Found Family', frName: 'Essence de la famille choisie', en: 'Kiryu’s protection, Ichiban’s party commands and Majima’s disruption combine in one heat-action relay across Kamurocho.', fr: 'La protection de Kiryu, les ordres d’équipe d’Ichiban et les feintes de Majima s’enchaînent en une seule Heat Action à travers Kamurocho.', visualAnchor: 'Three distinct heroes converging in a wet neon alley, bicycles and traffic cones becoming improvised props without copied UI.' }
});

const italianBrainrot = definePack(ITALIAN_BRAINROT, {
  aliases: ['Brain rot universe', 'Italian Brain Rot', 'Italian Brainrot memes'],
  mediaType: 'internet-meme', faction: 'arcane', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#5c9d72', '#f2dfbd', '#e94343'], motif: 'surrealhybrid',
  theme: 'viral AI-generated animal-object hybrids, pseudo-Italian names and deliberately unstable community remixes',
  continuity: 'decentralized 2025 internet meme trend; no official owner, fixed plot, alignment chart or authoritative power hierarchy',
  adaptationRule: 'Treat recurring visual motifs as references, never as a licensed franchise canon. All hero, enemy and boss labels are project-only trial roles. Do not reproduce curse-laden, blasphemous or real-conflict audio; omit brand logos and redirect every military-shaped hybrid into harmless fictional navigation challenges.',
  visualAnchor: 'Surreal animal-object hybrids in sunny plazas, deserts, cafés and forests, translated into original pixel art while preserving each recurring silhouette rather than copying viral AI stills.',
  canonStatus: 'community meme figures with explicitly non-canon project roles and safety-sanitized audio',
  fr: 'Des hybrides viraux traversent des épreuves de rythme, de tri et de parcours dans un monde sans continuité officielle.',
  en: 'Viral hybrids cross rhythm, sorting and navigation trials in a world with no official continuity.',
  referenceUrls: [ITALIAN_BRAINROT.url, 'https://www.repubblica.it/tecnologia/2025/05/02/news/italian_brain_rot_meme_cosa_sono_video_social-424161999/', 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6920078'],
  characters: [
    { id: 'tralalero_tralala', name: 'Tralalero Tralala', role: 'tactical', visualAnchor: 'Large blue shark walking on three fin-legs, each ending in a generic bright blue trainer with no logo, on a sunny promenade.', fr: 'Le requin à trois jambes et baskets bleues est la figure la plus ancienne et la plus reconnaissable du courant.', en: 'The three-legged shark in blue trainers is the trend’s earliest and most recognizable figure.', canonStatus: 'recurring meme figure; protagonist role is project-only', entityType: 'obstacle-course-guide', nonCombat: true, objective: 'Complete the three-lane trainer course and collect every clean remix token.', objectiveFr: 'Terminer le parcours à trois voies et récupérer chaque jeton de remix neutre.', victoryCondition: 'complete-course-collect-tokens', prohibitedAudio: ['original curse-laden narration'] },
    { id: 'ballerina_cappuccina', name: 'Ballerina Cappuccina', role: 'hacker', visualAnchor: 'Graceful ballerina body in a modest cream tutu, white cappuccino cup for a head with foam surface and a simple smiling face, café-stage lighting.', fr: 'La ballerine à tête de cappuccino devient ici la meneuse d’une épreuve de rythme sans reprendre son audio viral.', en: 'The cappuccino-headed ballerina leads a rhythm trial here without reusing viral audio.', canonStatus: 'recurring meme figure; hero role is project-only', entityType: 'rhythm-trial-guide', nonCombat: true, objective: 'Match the original project beat pattern and finish the café recital.', objectiveFr: 'Suivre le motif rythmique original du projet puis terminer le récital du café.', victoryCondition: 'complete-rhythm-recital' },
    { id: 'lirili_larila', name: 'Lirilì Larilà', role: 'tactical', visualAnchor: 'Elephant head and legs fused to a tall cactus body, wearing oversized neutral tan slippers in a quiet desert.', fr: 'L’éléphant-cactus à pantoufles guide un parcours de traces dans le désert.', en: 'The slippered elephant-cactus guides a desert track puzzle.', canonStatus: 'recurring meme figure; hero role is project-only', entityType: 'desert-route-guide', nonCombat: true, objective: 'Read the cactus-shadow clues and trace the safe desert route.', objectiveFr: 'Lire les indices formés par les ombres de cactus puis tracer la route sûre du désert.', victoryCondition: 'solve-shadow-route' }
  ],
  monsters: [
    { id: 'brr_brr_patapim', name: 'Brr Brr Patapim', visualAnchor: 'Long-nosed forest creature combining a mossy tree trunk, large humanlike feet and sparse leafy branches, no realistic human face.', fr: 'Ce motif forestier devient un puzzle de ponts racinaires, pas un monstre à frapper.', en: 'This forest motif becomes a root-bridge puzzle, not a monster to hit.', canonStatus: 'recurring meme figure; enemy label is project-only', entityType: 'root-bridge-trial', nonCombat: true, objective: 'Rotate the root bridges until every traveler can cross the forest.', objectiveFr: 'Faire pivoter les ponts-racines jusqu’à ce que tous les voyageurs traversent la forêt.', victoryCondition: 'align-root-bridges' },
    { id: 'chimpanzini_bananini', name: 'Chimpanzini Bananini', visualAnchor: 'Small chimpanzee emerging from a peeled yellow banana body, friendly round ears and hands used for fruit sorting.', fr: 'L’hybride singe-banane impose une épreuve de tri rapide.', en: 'The chimp-banana hybrid presents a fast sorting trial.', canonStatus: 'recurring meme figure; enemy label is project-only', entityType: 'sorting-trial', nonCombat: true, objective: 'Sort the harmless fruit hybrids by shape before the conveyor resets.', objectiveFr: 'Trier les hybrides-fruits inoffensifs par forme avant le redémarrage du convoyeur.', victoryCondition: 'complete-shape-sort' },
    { id: 'bombombini_gusini', name: 'Bombombini Gusini', visualAnchor: 'Goose head and wings integrated into a small green fictional jet body with no weapons, flags, military insignia or real aircraft markings.', fr: 'L’oie-avion est neutralisée en validant des balises de vol fictives, sans attaque ni référence à un conflit réel.', en: 'The goose-plane is resolved through fictional flight beacons, with no attack or real-conflict reference.', canonStatus: 'recurring meme figure; adversary role is project-only and safety-adapted', entityType: 'flight-checkpoint-trial', nonCombat: true, objective: 'Guide Bombombini through every sky beacon and land on the comedy runway.', objectiveFr: 'Guider Bombombini à travers chaque balise puis atterrir sur la piste comique.', victoryCondition: 'complete-beacon-flight', depictionRule: 'No weapon load, bombing, flags or real-world target.' }
  ],
  bosses: [
    { id: 'cappuccino_assassino', name: 'Cappuccino Assassino', visualAnchor: 'Anthropomorphic takeaway coffee cup in a dark café apron, foam eyes and two blunt stirring sticks used only as rhythm batons.', fr: 'Le gobelet nommé « Assassino » devient un chef d’orchestre de percussion, pas un meurtrier canonique.', en: 'The cup named “Assassino” becomes a percussion conductor, not a canonical murderer.', canonStatus: 'recurring meme figure; nonviolent boss role is project-only', entityType: 'percussion-trial', nonCombat: true, objective: 'Repeat the four stirring-stick rhythms without missing a café cue.', objectiveFr: 'Répéter les quatre rythmes de touillettes sans manquer un signal du café.', victoryCondition: 'repeat-four-rhythms' },
    { id: 'bombardiro_crocodilo', name: 'Bombardiro Crocodilo', visualAnchor: 'Crocodile head integrated into a broad twin-prop fictional aircraft body, landing gear down, no bombs, weapons, flags or real aircraft markings.', fr: 'L’avion-crocodile controversé est converti en épreuve de déroutement entièrement fictive et sans cibles civiles.', en: 'The controversial crocodile-plane is converted into a wholly fictional rerouting trial with no civilian targets.', canonStatus: 'recurring meme figure; sanitized noncombat trial role only', entityType: 'safe-rerouting-trial', nonCombat: true, objective: 'Reroute the unarmed hybrid through empty sky gates and perform a safe landing.', objectiveFr: 'Rediriger l’hybride désarmé dans des portes célestes vides puis réussir un atterrissage sûr.', victoryCondition: 'reroute-and-land', depictionRule: 'No explosives, bombing, children, civilian target, conflict reference or original narration.' },
    { id: 'la_vaca_saturno_saturnita', name: 'La Vaca Saturno Saturnita', visualAnchor: 'Gentle cow with a complete Saturn-like ringed planet forming its torso, floating above an abstract starfield.', fr: 'La vache-planète règle une épreuve orbitale de masses et d’anneaux.', en: 'The cow-planet governs an orbital mass-and-ring puzzle.', canonStatus: 'recurring meme figure; boss role is project-only', entityType: 'orbital-puzzle-trial', nonCombat: true, objective: 'Balance the four orbiting tokens and stabilize the ring plane.', objectiveFr: 'Équilibrer les quatre jetons en orbite puis stabiliser le plan des anneaux.', victoryCondition: 'stabilize-orbits' }
  ],
  worldBoss: { id: 'viral_remix_loop', name: 'Viral Remix Loop', visualAnchor: 'An abstract scrolling tunnel of original pixel-art hybrid silhouettes, duplicated frames, color blocks and empty audio-wave shapes with no platform logo or readable text.', fr: 'Puisqu’il n’existe aucun grand méchant canonique, la finale consiste à sortir d’une boucle algorithmique de copies et à créer une séquence originale.', en: 'Because there is no canonical supreme villain, the finale is escaping an algorithmic copy loop by creating an original sequence.', canonStatus: 'project systemic finale; explicitly not a meme-canon character', entityType: 'systemic-remix-trial', nonCombat: true, objective: 'Identify repeated frames, discard unsafe audio cues and assemble one original four-scene sequence.', objectiveFr: 'Identifier les images répétées, écarter les signaux audio inadaptés puis assembler une séquence originale en quatre scènes.', victoryCondition: 'build-original-safe-sequence', prohibitedConcepts: ['official Brainrot canon', 'supreme Brainrot villain', 'copied viral audio'], spritePrompt: 'Original fan-made pixel-art environmental objective sheet: abstract viral remix tunnel in four progressive cleanup states, duplicated silhouette cards and neutral audio-wave shapes. No humanoid boss, platform logo, readable text, hateful symbol or copied meme still.' },
  stage: { name: 'Piazza del Remix — parcours surréaliste', visualAnchor: 'Original sunlit pseudo-Italian plaza with café umbrellas, desert arch, forest gate and floating animal-object silhouettes; no real landmark or brand.', fr: 'La place relie les différentes épreuves visuelles sans prétendre constituer un lieu canonique.', en: 'The plaza connects the visual trials without pretending to be a canonical place.', canonStatus: 'project-original stage based on the trend’s recurring settings' },
  stageVariants: [
    stageVariant('Tactics', 'Piste aérienne sans armes', 'Hard', 'Bombardiro Crocodilo', { objective: 'Guide both aircraft hybrids through empty checkpoints and land safely.', objectiveFr: 'Guider les deux hybrides-avions dans des balises vides puis atterrir sans danger.', victoryCondition: 'reroute-and-land', nonCombat: true }),
    stageVariant('RPG', 'Tunnel de la boucle virale', 'Expert', 'Viral Remix Loop', { objective: 'Remove copied and unsafe cues, then publish one original four-scene sequence.', objectiveFr: 'Retirer les signaux copiés ou inadaptés puis produire une séquence originale de quatre scènes.', victoryCondition: 'build-original-safe-sequence', nonCombat: true })
  ],
  gear: [
    { id: 'generic_blue_trainers', enName: 'Generic Blue Trainers', frName: 'Baskets bleues génériques', boost: { spd: 3, hp: 35 }, visualAnchor: 'Three matching bright blue trainers with white soles and absolutely no brand logo.', fr: 'Le motif visuel de Tralalero est conservé sans reprendre de marque.', en: 'Tralalero’s visual motif is preserved without reproducing a brand.', canonStatus: 'project-original safe prop based on recurring silhouette' },
    { id: 'cappuccino_tutu', enName: 'Cappuccino Recital Tutu', frName: 'Tutu du récital cappuccino', boost: { def: 6, hp: 40 }, visualAnchor: 'Modest cream ballet tutu displayed beside a plain white cappuccino cup and neutral foam swirl.', fr: 'Un accessoire original pour l’épreuve de danse du café.', en: 'An original prop for the café dance trial.', canonStatus: 'project-original safe prop' },
    { id: 'cactus_slippers', enName: 'Cactus Trail Slippers', frName: 'Pantoufles du sentier cactus', boost: { hp: 55, spd: 1 }, visualAnchor: 'Two oversized tan slippers with small stitched cactus pads and no human feet inside.', fr: 'Les pantoufles indiquent la route sûre par leurs traces.', en: 'The slippers mark the safe route through their tracks.', canonStatus: 'project-original safe prop based on recurring silhouette' }
  ],
  event: { id: 'safe_nonsense_remix', enName: 'Safe Nonsense Remix', frName: 'Remix absurde sécurisé', en: 'Every hybrid contributes one original instrumental cue; duplicated, offensive and real-conflict samples are filtered before the plaza sequence begins.', fr: 'Chaque hybride apporte un signal instrumental original ; les extraits copiés, offensants ou liés à un conflit réel sont filtrés avant la séquence de la place.', visualAnchor: 'Colorful hybrid silhouettes placing neutral beat tokens into a four-slot sequencer with no readable UI text.', canonStatus: 'project-original event; no viral audio reproduced' }
});

const legacyOfKain = definePack(LEGACY_OF_KAIN, {
  aliases: ['Légacy of Kain', 'Legacy of Kain franchise', 'Soul Reaver'],
  mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Expert',
  colors: ['#233a35', '#050807', '#61d2ad'], motif: 'nosgothpillars',
  theme: 'Nosgoth’s corrupted Pillars, vampiric destiny, time paradox and the Material/Spectral dual realm',
  continuity: 'classic Blood Omen, Soul Reaver 1–2 and Defiance timeline, stopping at Defiance; remaster visuals are references but later new continuities are excluded',
  adaptationRule: 'Preserve Kain and Raziel as morally complex co-protagonists whose conflict is manipulated by Moebius and the Elder God. Realm shifting is a navigation system, the physical and wraith Reavers remain distinct until Raziel’s sacrifice, and the Elder God is never reduced to a generic octopus.',
  visualAnchor: 'Gothic Nosgoth ruins, nine cracked Pillars, teal spectral distortion, weathered vampire citadels, the asymmetrical Soul Reaver and Raziel’s blue-gray wraith form.',
  canonStatus: 'classic game canon through Legacy of Kain: Defiance',
  fr: 'Kain, Raziel et Vorador déjouent les prophéties qui ont dressé vampires, Sarafan et Hylden les uns contre les autres.',
  en: 'Kain, Raziel and Vorador unravel prophecies that set vampires, Sarafan and Hylden against one another.',
  referenceUrls: [LEGACY_OF_KAIN.url, 'https://store.steampowered.com/curator/45219484-Legacy-of-Kain-Official/', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/224300/manuals/manual.pdf?t=1727994013', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/224920/manuals/manual.pdf?t=1684279050'],
  characters: [
    { id: 'kain', name: 'Kain', role: 'slayer', weapon: 'Soul Reaver', weaponType: 'blade', simple: 'Reaver slash', secondary: 'Telekinetic throw', defense: 'Mist evade', special: 'Scion of Balance', visualAnchor: 'Imperial Kain as an evolved pale vampire with long white hair, narrow crownlike forehead ridges, dark red-black segmented armor and the broad asymmetrical Soul Reaver.', fr: 'Kain refuse le sacrifice imposé aux Pillars et devient le Scion of Balance capable de briser le faux cycle.', en: 'Kain refuses the sacrifice demanded by the Pillars and becomes the Scion of Balance who can break the false cycle.', canonStatus: 'canon franchise protagonist and antihero' },
    { id: 'raziel', name: 'Raziel', role: 'horror', weapon: 'Wraith Blade', weaponType: 'magic', simple: 'Wraith claw', secondary: 'Telekinetic bolt', defense: 'Spectral shift', special: 'Soul Reaver convergence', visualAnchor: 'Blue-gray wing-torn vampire wraith with three-fingered claws, brown cowl covering the lower face, exposed ribs and a luminous teal Wraith Blade spiraling around one arm.', fr: 'Raziel revient comme dévoreur d’âmes et apprend à passer entre les royaumes matériel et spectral.', en: 'Raziel returns as a soul devourer and learns to shift between the Material and Spectral Realms.', canonStatus: 'canon Soul Reaver and Defiance co-protagonist', entityType: 'vampire-wraith' },
    { id: 'vorador', name: 'Vorador', role: 'marine', weapon: 'Ancient vampire claws', weaponType: 'fists', simple: 'Vampire claw', secondary: 'Blood-force wave', defense: 'Ancient resilience', special: 'Vampire citadel defense', visualAnchor: 'Ancient green-skinned vampire with long pointed ears, black swept hair, ornate bronze-red robes and powerful clawed hands.', fr: 'Vorador est un ancien vampire, mentor et allié intermittent dans l’histoire de Nosgoth.', en: 'Vorador is an ancient vampire, mentor and intermittent ally in Nosgoth’s history.', canonStatus: 'canon ancient vampire ally' }
  ],
  monsters: [
    { id: 'vampire_hunter', name: 'Vampire Hunter', weapon: 'Flamethrower and spear', special: 'Human Citadel patrol', visualAnchor: 'Human hunter in weathered brown coat and metal face guard carrying a compact flame projector and long stake-spear.', fr: 'Les chasseurs humains occupent les ruines et exploitent le feu contre les vampires.', en: 'Human hunters occupy the ruins and exploit fire against vampires.', canonStatus: 'canon Soul Reaver enemy archetype' },
    { id: 'sarafan_warrior_priest', name: 'Sarafan Warrior-Priest', weapon: 'Sarafan sword', special: 'Anti-vampire ward', visualAnchor: 'Armored human warrior-priest in ivory tabard, bronze plate, angular wing motif and straight ritual sword.', fr: 'Le guerrier-prêtre Sarafan sert la croisade menée contre les vampires.', en: 'The Sarafan warrior-priest serves the crusade against vampires.', canonStatus: 'canon Soul Reaver 2 enemy archetype' },
    { id: 'hylden_demon', name: 'Hylden Demon', weapon: 'Dimensional claws', special: 'Demon-realm portal', visualAnchor: 'Tall extra-dimensional Hylden creature with charcoal skin, long angular limbs, pale green fissures and no generic horned-demon anatomy.', fr: 'Les démons liés aux Hylden traversent les brèches dimensionnelles de Defiance.', en: 'Hylden-linked demons cross Defiance’s dimensional breaches.', canonStatus: 'canon Defiance extra-dimensional enemy' }
  ],
  bosses: [
    { id: 'moebius', name: 'Moebius the Time Streamer', weapon: 'Time Staff', special: 'Fatalistic timeline manipulation', visualAnchor: 'Gaunt elderly Guardian of Time in layered white and faded gold robes holding a green-glowing staff, backed by a brass chronoplast wheel; no actor likeness.', fr: 'Moebius manipule Kain et Raziel au service du Elder God en prétendant défendre une histoire immuable.', en: 'Moebius manipulates Kain and Raziel for the Elder God while claiming to defend immutable history.', canonStatus: 'canon recurring manipulator and Guardian of Time', entityType: 'timeline-antagonist', objective: 'Break the Time Staff ward and expose Moebius’s service to the Elder God.' },
    { id: 'turel', name: 'Turel', weapon: 'Telekinetic roar', special: 'Possessed brother confrontation', visualAnchor: 'Massive evolved vampire with dark gray hide, tall pointed ears, huge shoulders and spectral green possession marks inside an underground chamber.', fr: 'Turel, dernier frère de Raziel, est retrouvé possédé dans Defiance.', en: 'Turel, Raziel’s last brother, is found possessed in Defiance.', canonStatus: 'canon Defiance boss and possessed victim', entityType: 'possessed-vampire-boss' },
    { id: 'hylden_lord', name: 'The Hylden Lord', weapon: 'Flaming Hylden blade', special: 'Janos possession', visualAnchor: 'Tall angular Hylden ruler with pale gray-green skin, swept bone ridges, dark ceremonial armor and a narrow orange-flaming sword.', fr: 'Le seigneur Hylden exploite la brèche des Pillars et prend possession de Janos.', en: 'The Hylden Lord exploits the Pillars breach and possesses Janos.', canonStatus: 'canon Blood Omen 2 / Defiance overarching Hylden antagonist' }
  ],
  worldBoss: { id: 'elder_god', name: 'The Elder God', weapon: 'Spectral tentacles and soul wheel', special: 'Wheel of Fate consumption', visualAnchor: 'Colossal ancient spectral entity embedded beneath Nosgoth, layered circular maw-eyes and many thick teal-brown tendrils surrounding a Reaver forge; not a free-standing octopus.', fr: 'Le Elder God nourrit son cycle avec les âmes de Nosgoth et manipule Moebius comme Raziel jusqu’à ce que Kain puisse enfin le voir.', en: 'The Elder God feeds its cycle with Nosgoth’s souls and manipulates Moebius and Raziel until Kain can finally see it.', canonStatus: 'canon Defiance final antagonist and series-scale manipulator', entityType: 'spectral-world-boss', objective: 'Use the purified Soul Reaver to expose its eyes, repel the tendrils and bury the chamber.', objectiveFr: 'Utiliser la Soul Reaver purifiée pour exposer ses yeux, repousser les tentacules puis ensevelir la chambre.', victoryCondition: 'expose-strike-and-bury' },
  stage: { name: 'Vampire Citadel — Reaver Forge', visualAnchor: 'Circular ancient stone forge above teal spectral depth, carved vampire wings, elemental basins and the Elder God’s tendrils beyond cracked walls.', fr: 'La forge révèle les manipulations autour de la Reaver et du cycle des âmes.', en: 'The forge reveals the manipulations surrounding the Reaver and the cycle of souls.' },
  stageVariants: [
    stageVariant('RPG', 'Nosgoth — bascule matériel/spectral', 'Expert', 'Turel', { objective: 'Shift realms to redirect sound conduits and free Turel from possession before the final exchange.' }),
    stageVariant('Tactics', 'Chambre du Elder God', 'Expert', 'The Elder God', { objective: 'Expose each eye between tendril waves, then collapse the forge around the entity.' })
  ],
  gear: [
    { id: 'soul_reaver', enName: 'Soul Reaver', frName: 'Soul Reaver', boost: { atk: 10, def: 3 }, visualAnchor: 'Broad asymmetrical black-steel flamberge with hooked guard, bonelike central spine and muted teal energy after purification.', fr: 'L’épée dévoreuse d’âmes porte le paradoxe de Raziel et la purification finale de Kain.', en: 'The soul-devouring sword carries Raziel’s paradox and Kain’s final purification.' },
    { id: 'balance_emblem', enName: 'Balance Emblem', frName: 'Emblème de l’Équilibre', boost: { def: 7, hp: 45 }, visualAnchor: 'Ancient circular stone-and-bronze emblem divided into nine subtle Pillar segments around a central balance socket.', fr: 'L’emblème relie Kain à sa fonction de Guardian of Balance.', en: 'The emblem connects Kain to his role as Guardian of Balance.' },
    { id: 'time_streaming_device', enName: 'Time-Streaming Device', frName: 'Dispositif de voyage temporel', boost: { hp: 55, spd: 2 }, visualAnchor: 'Large brass chronoplast ring with radial gears, green crystal core and empty center showing temporal distortion.', fr: 'Le mécanisme de Moebius ouvre des routes vers les époques de Nosgoth.', en: 'Moebius’s mechanism opens routes into Nosgoth’s eras.' }
  ],
  event: { id: 'reaver_purification', enName: 'Reaver Purification', frName: 'Purification de la Reaver', en: 'Raziel’s sacrifice completes the blade, purifies Kain’s sight and exposes the Elder God hidden beneath the forge.', fr: 'Le sacrifice de Raziel complète la lame, purifie la vision de Kain et révèle le Elder God dissimulé sous la forge.', visualAnchor: 'Teal wraith energy entering the physical black Reaver while Kain’s vision reveals immense tendrils under the stone.', canonStatus: 'canon Defiance finale adaptation' }
});

const prey2006 = definePack(PREY_2006, {
  aliases: ['Prey 1', 'Prey 2006', 'Human Head Prey', 'Prey original'],
  mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Expert',
  colors: ['#4a2c28', '#080506', '#e58b55'], motif: 'spheregravity',
  theme: 'Domasi Tawodi’s abduction, spirit walking, impossible gravity and resistance inside the living Sphere',
  continuity: 'Human Head Studios and 3D Realms Prey released in 2006 only; Arkane’s 2017 game is explicitly excluded',
  adaptationRule: 'Tommy is the sole armed protagonist. Jen is a captive civilian and Enisi a spirit teacher, so both become rescue/guidance trials with no combat statistics or invented attacks. Preserve Cherokee-specific names and the game’s respectful ancestor guidance without fabricating ceremonies. The Sphere is a systemic harvest objective, not Arkane’s Talos I.',
  visualAnchor: 'Rust-red biomechanical Sphere corridors, blue gravity walkways crossing walls, organic portals, alien machinery, Tommy’s spirit bow and Oklahoma roadhouse memories.',
  canonStatus: 'Prey (2006) game and published manual canon; no Prey (2017) material',
  fr: 'Tommy apprend à quitter son corps pour traverser la Sphere, retrouver Jen et comprendre les enseignements d’Enisi.',
  en: 'Tommy learns to leave his body to cross the Sphere, find Jen and understand Enisi’s teachings.',
  referenceUrls: [PREY_2006.url, 'https://news.xbox.com/en-us/2006/10/10/prey-in-game-content/', 'https://ubm-twvideo01.s3.amazonaws.com/o1/gdconarrative/09/Patrick_Martin_2009.pdf', 'https://www.gamespot.com/articles/prey-walkthrough/1100-6154055/'],
  characters: [
    { id: 'tommy_tawodi', name: 'Domasi “Tommy” Tawodi', role: 'slayer', weapon: 'Spirit Bow', weaponType: 'magic', simple: 'Spirit arrow', secondary: 'Leech Gun charge', defense: 'Spirit walk', special: 'Death Walk return', visualAnchor: 'Young Cherokee garage mechanic with long tied-back black hair, dark work shirt, jeans, wrench at belt and a translucent orange spirit bow; no actor likeness or invented tribal costume.', fr: 'Tommy, mécanicien qui rejetait d’abord ses racines, utilise le spirit walk pour libérer les captifs de la Sphere.', en: 'Tommy, a mechanic who initially rejected his roots, uses spirit walk to free the Sphere’s captives.', canonStatus: 'canon Prey (2006) protagonist' },
    { id: 'jen', name: 'Jen', role: 'tactical', visualAnchor: 'Young Cherokee roadhouse owner with long dark hair, practical burgundy top and jeans, shown alive beside a locked organic passage with no weapon or restraint detail.', fr: 'Jen dirige le Roadhouse et reste une personne à retrouver, jamais une combattante inventée.', en: 'Jen runs the Roadhouse and remains someone to find, never an invented fighter.', canonStatus: 'canon captive civilian and Tommy’s partner', entityType: 'rescue-trial-ally', nonCombat: true, objective: 'Trace Jen’s route through the Sphere and reach her containment chamber.', objectiveFr: 'Suivre la route de Jen à travers la Sphere puis atteindre sa chambre de confinement.', victoryCondition: 'locate-and-reach-captive', depictionRule: 'No sexualization, gore or transformed-body imagery.' },
    { id: 'enisi', name: 'Enisi', role: 'hacker', visualAnchor: 'Tommy’s elderly Cherokee grandfather in a plain modern shirt and vest, seated by a small spirit-world fire with Talon’s translucent hawk silhouette nearby; no costume invention.', fr: 'Enisi enseigne à Tommy le spirit walk puis le guide depuis le Land of the Ancients.', en: 'Enisi teaches Tommy spirit walk and later guides him from the Land of the Ancients.', canonStatus: 'canon grandfather, teacher and spirit guide', entityType: 'spirit-guidance-trial', nonCombat: true, objective: 'Follow Enisi’s instructions, locate Talon and complete the spirit-walk route.', objectiveFr: 'Suivre les instructions d’Enisi, retrouver Talon puis terminer le parcours de spirit walk.', victoryCondition: 'complete-spirit-guidance', depictionRule: 'Use the modern character described by the manual; do not invent ceremonial dress.' }
  ],
  monsters: [
    { id: 'hunter', name: 'Sphere Hunter', weapon: 'Alien rifle', special: 'Portal flank', visualAnchor: 'Tall biomechanical alien infantry with pale sinewy limbs, dark red armor plates and a compact organic rifle.', fr: 'Le Hunter est le fantassin mobile de la Sphere et utilise ses portails pour encercler Tommy.', en: 'The Hunter is the Sphere’s mobile infantry and uses portals to flank Tommy.', canonStatus: 'canon Prey (2006) enemy' },
    { id: 'hound', name: 'Sphere Hound', weapon: 'Jaw charge', special: 'Wall-gravity pursuit', visualAnchor: 'Low muscular alien hound with armored brown-red back, split jaw and four clawed legs adapted to gravity walkways.', fr: 'Le Hound poursuit Tommy sur les surfaces où la gravité change.', en: 'The Hound pursues Tommy across gravity-shifting surfaces.', canonStatus: 'canon Prey (2006) enemy' },
    { id: 'harvester', name: 'Harvester', weapon: 'Organic projectile pods', special: 'Crawler release', visualAnchor: 'Bulky rust-red Sphere creature fused to a biomechanical pod launcher, with small crawler sacs and no human anatomy or gore.', fr: 'Le Harvester libère de petites créatures depuis son corps biomécanique.', en: 'The Harvester releases small creatures from its biomechanical body.', canonStatus: 'canon Prey (2006) enemy' }
  ],
  bosses: [
    { id: 'centurion', name: 'Centurion', weapon: 'Heavy alien cannon', special: 'Gravity-chamber assault', visualAnchor: 'Huge armored Sphere soldier with four stable legs, broad pale torso plates and a two-handed organic energy cannon.', fr: 'Le Centurion constitue une rencontre lourde qui verrouille les chambres de gravité.', en: 'The Centurion is a heavy encounter that locks down gravity chambers.', canonStatus: 'canon Prey (2006) heavyweight encounter' },
    { id: 'keeper', name: 'Keeper', weapon: 'Psychic force and claws', special: 'Sphere control node defense', visualAnchor: 'Tall gaunt Keeper with elongated pale head, dark biomechanical mantle, four thin arms and orange psychic conduits.', fr: 'Les Keepers contrôlent les opérations de la Sphere et défendent ses nœuds internes.', en: 'The Keepers control Sphere operations and defend its internal nodes.', canonStatus: 'canon Prey (2006) command enemy and boss' },
    { id: 'mother', name: 'Mother', weapon: 'Sphere energy beams', special: 'Mother’s Embrace node network', visualAnchor: 'Large former-human intelligence enclosed in a nonsexual biomechanical core shell, surrounded by six blue-to-orange energy windows and organic cables; no exposed body detail.', fr: 'Mother contrôle les drones et propose à Tommy de prendre sa place avant l’affrontement final.', en: 'Mother controls the drones and offers Tommy her place before the final confrontation.', canonStatus: 'canon Prey (2006) final antagonist', entityType: 'sphere-controller', depictionRule: 'Nonsexual biomechanical shell; no nudity or actor likeness.' }
  ],
  worldBoss: { id: 'sphere_harvest_system', name: 'The Sphere Harvest System', visualAnchor: 'Vast living starship interior with human rescue pods, branching organic conveyors, gravity rings and several shutdown nodes, framed without bodies or gore.', fr: 'Au-delà de Mother, le système de récolte entier doit être évacué puis envoyé vers le soleil ; il ne possède ni visage ni barre de vie.', en: 'Beyond Mother, the entire harvest system must be evacuated and driven into the sun; it has no face or health bar.', canonStatus: 'canon systemic ship threat adapted as a noncombat world objective', entityType: 'evacuation-and-navigation-trial', nonCombat: true, objective: 'Free the reachable captives, open Elhuit’s escape portals and set the Sphere on its solar destruction course.', objectiveFr: 'Libérer les captifs accessibles, ouvrir les portails d’évacuation d’Elhuit puis placer la Sphere sur sa trajectoire de destruction solaire.', victoryCondition: 'evacuate-set-course-and-escape', prohibitedConcepts: ['Talos I', 'Typhon', 'Prey 2017 characters'], spritePrompt: 'Original fan-made pixel-art environmental objective sheet: a living rust-red alien starship across four evacuation and solar-course states, gravity rings and rescue pods only. No humanoid boss, combat HUD, gore, logo, text or Prey 2017 imagery.' },
  stage: { name: 'The Sphere — gravity-walk chamber', visualAnchor: 'Biomechanical room whose blue gravity strip climbs from floor to wall and ceiling, with organic portal membranes and orange alien machinery.', fr: 'Les surfaces de la chambre changent l’orientation du combat et du parcours.', en: 'The chamber’s surfaces change the orientation of battle and traversal.' },
  stageVariants: [
    stageVariant('RPG', 'Mother’s Embrace — six conduits', 'Expert', 'Mother', { objective: 'Use spirit form to reverse each blue conduit, then confront Mother without sexualized imagery.' }),
    stageVariant('Tactics', 'Sphere — évacuation solaire', 'Expert', 'The Sphere Harvest System', { objective: 'Free captives, enable escape portals and enter the solar course before leaving.', objectiveFr: 'Libérer les captifs, activer les portails puis enclencher la trajectoire solaire avant de partir.', victoryCondition: 'evacuate-set-course-and-escape', nonCombat: true })
  ],
  gear: [
    { id: 'spirit_bow', enName: 'Spirit Bow', frName: 'Arc spirituel', boost: { atk: 8, spd: 1 }, visualAnchor: 'Translucent orange-gold bow and arrow formed from clean spirit light, displayed beside Tommy’s ordinary silhouette.', fr: 'L’arc n’existe qu’en spirit form et permet d’atteindre des commandes autrement protégées.', en: 'The bow exists only in spirit form and can reach otherwise protected controls.' },
    { id: 'leech_gun', enName: 'Leech Gun', frName: 'Leech Gun', boost: { def: 5, hp: 50 }, visualAnchor: 'Asymmetrical dark organic firearm with four small energy sockets showing neutral colored glows and no bodily gore.', fr: 'L’arme absorbe plusieurs types d’énergie de la Sphere.', en: 'The weapon absorbs several energy types from the Sphere.' },
    { id: 'tommy_wrench', enName: 'Tommy’s Wrench', frName: 'Clé de Tommy', boost: { hp: 65, atk: 4 }, visualAnchor: 'Large worn steel mechanic’s wrench with taped grip and a small roadhouse key ring, no blood.', fr: 'L’outil de mécanicien devient la première arme de Tommy après l’enlèvement.', en: 'The mechanic’s tool becomes Tommy’s first weapon after the abduction.' }
  ],
  event: { id: 'death_walk_return', enName: 'Death Walk Return', frName: 'Retour du Death Walk', en: 'Tommy’s spirit gathers red and blue wraith energy, restoring his body before the light path reaches its end.', fr: 'L’esprit de Tommy rassemble l’énergie rouge et bleue des wraiths pour restaurer son corps avant la fin du chemin lumineux.', visualAnchor: 'Tommy’s translucent spirit bow circling a distant resting body through red and blue motes, with no death or gore shown.', canonStatus: 'canon game mechanic adaptation' }
});

const beyondGoodEvil = definePack(BEYOND_GOOD_EVIL, {
  aliases: ['Beyond Good and Evil', 'BGE', 'Beyond Good & Evil 20th Anniversary Edition'],
  mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#215a63', '#081315', '#8fe65b'], motif: 'irisreport',
  theme: 'Hillys photojournalism, IRIS Network investigation, Alpha Sections propaganda and DomZ invasion',
  continuity: 'Beyond Good & Evil (2003) story as preserved by the 20th Anniversary Edition; Beyond Good & Evil 2 prequel material is excluded from the core roster',
  adaptationRule: 'Photography and evidence are equal to combat. Jade, Pey’j and Double H retain their exact team actions; Alpha Sections and DomZ remain separate but collaborating factions. Do not resolve Jade/Shauni mysteries beyond what the first game reveals.',
  visualAnchor: 'Teal Hillys canals, warm lighthouse interiors, chunky hovercrafts, green IRIS terminals, Alpha Sections’ black-white armor and bone-organic DomZ forms.',
  canonStatus: 'Beyond Good & Evil first-game canon, including 20th Anniversary presentation',
  fr: 'Jade, Pey’j et Double H photographient les enlèvements pour retourner Hillys contre la propagande des Sections Alpha.',
  en: 'Jade, Pey’j and Double H photograph the abductions to turn Hillys against Alpha Sections propaganda.',
  referenceUrls: [BEYOND_GOOD_EVIL.url, 'https://www.ubisoft.com/en-us/company/about-us/our-brands/beyond-good-evil', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/15130/manuals/manual_english.pdf?t=1718743204', 'https://store.ubisoft.com/us/beyond-evil-good-and-evil?lang=en_US'],
  characters: [
    { id: 'jade', name: 'Jade', role: 'tactical', weapon: 'Daï-Jo staff and camera', weaponType: 'fists', simple: 'Daï-Jo sweep', secondary: 'Gyrodisk shot', defense: 'IRIS roll', special: 'Photographic evidence reveal', visualAnchor: 'Young Hillyan photojournalist with tan skin, short black bob, green headband and lipstick, white cropped jacket over green top, loose green trousers, camera pouch and long dark Daï-Jo staff; no photoreal person.', fr: 'Jade est une photojournaliste qui rejoint le réseau IRIS pour prouver la collusion entre DomZ et Sections Alpha.', en: 'Jade is a photojournalist who joins the IRIS Network to prove collusion between the DomZ and Alpha Sections.', canonStatus: 'canon protagonist and IRIS agent Shauni' },
    { id: 'peyj', name: 'Pey’j', role: 'marine', weapon: 'Barranco D53 wrench', weaponType: 'fists', simple: 'Wrench swing', secondary: 'Jet-boots ground pound', defense: 'Mechanic brace', special: 'Hovercraft rescue repair', visualAnchor: 'Stocky anthropomorphic pig with pink skin, brown leather work vest, tool belt, goggles on forehead and enormous red-handled mechanic’s wrench.', fr: 'L’oncle adoptif de Jade est mécanicien, pilote et premier allié de l’enquête.', en: 'Jade’s adoptive uncle is a mechanic, pilot and the investigation’s first ally.', canonStatus: 'canon companion and IRIS ally' },
    { id: 'double_h', name: 'Double H', role: 'marine', weapon: 'HH-issue hammer', weaponType: 'fists', simple: 'Hammer strike', secondary: 'Bull Rush launch', defense: 'Carlson-and-Peeters guard', special: 'IRIS extraction charge', visualAnchor: 'Large human IRIS operative in blue-white armored suit with prominent square jaw, blue helmet panels and a heavy compact hammer; no actor likeness.', fr: 'Agent IRIS au code strict, Double H utilise sa charge pour projeter les ennemis et ouvrir la route à Jade.', en: 'An IRIS operative with a strict code, Double H uses his charge to launch enemies and clear Jade’s path.', canonStatus: 'canon companion and IRIS operative' }
  ],
  monsters: [
    { id: 'alpha_sections_guard', name: 'Alpha Sections Guard', weapon: 'Electro-baton', special: 'Barcode checkpoint patrol', visualAnchor: 'Tall Hillyan soldier in glossy black-and-ivory enclosed armor, single green visor line and compact electro-baton, no real-world insignia.', fr: 'Les gardes surveillent usines et abattoirs sous couverture de défense planétaire.', en: 'Guards patrol factories and slaughterhouses under the cover of planetary defense.', canonStatus: 'canon Alpha Sections enemy archetype' },
    { id: 'crochax', name: 'Crochax', weapon: 'Armored claw', special: 'Pearl-shell defense', visualAnchor: 'Large orange-red crustacean creature with one oversized armored claw, segmented legs and a luminous pearl protected under its shell.', fr: 'Le Crochax garde des perles dans les quartiers souterrains.', en: 'The Crochax guards pearls in the underground quarters.', canonStatus: 'canon Hillys creature and enemy' },
    { id: 'domz_reaper', name: 'DomZ Reaper', weapon: 'Spore scythes', special: 'Life-force drain', visualAnchor: 'Lean bone-and-dark-flesh DomZ creature with long hooked forelimbs, glowing inner pearl and no human anatomy or gore.', fr: 'Le Reaper est une forme DomZ mobile rencontrée dans l’usine.', en: 'The Reaper is a mobile DomZ form encountered in the factory.', canonStatus: 'canon DomZ enemy' }
  ],
  bosses: [
    { id: 'domz_robot', name: 'DomZ Robot', weapon: 'Cage legs and grabber arms', special: 'Pey’j team-action opening', visualAnchor: 'DomZ spore fused into a square industrial cage with two giant grabber arms as legs, pearl core exposed only after coordinated strikes.', fr: 'À l’usine, une créature DomZ fusionne avec une cage et exige l’action combinée de Jade et Double H.', en: 'At the factory, a DomZ creature fuses with a cage and requires Jade and Double H’s combined action.', canonStatus: 'canon factory boss' },
    { id: 'domz_sea_serpent', name: 'DomZ Sea Serpent', weapon: 'Aerial dive and energy shot', special: 'Hovercraft pursuit', visualAnchor: 'Long winged DomZ serpent with bony white segments, blue-green membrane fins and a glowing pearl weak point over Hillys water.', fr: 'Le serpent de mer DomZ attaque le hovercraft lors de plusieurs sorties.', en: 'The DomZ Sea Serpent attacks the hovercraft during several excursions.', canonStatus: 'canon recurring Hillys boss' },
    { id: 'general_kehck', name: 'General Kehck', weapon: 'Alpha Sections Spiderbot cannon', special: 'Canyon transmitter pursuit', visualAnchor: 'Alpha Sections commander enclosed in black-ivory armor at the center of a huge eight-legged flying Spiderbot, green cannon core and tow cable; no actor likeness.', fr: 'Kehck dirige la propagande et affronte Jade depuis son Spiderbot après la destruction du transmetteur lunaire.', en: 'Kehck directs the propaganda effort and confronts Jade from his Spiderbot after the lunar transmitter is destroyed.', canonStatus: 'canon Alpha Sections leader and boss' }
  ],
  worldBoss: { id: 'domz_high_priest', name: 'DomZ High Priest', weapon: 'Life-force drain and teleportation', special: 'Shauni reversal sequence', visualAnchor: 'Huge skeletal centipede-scorpion DomZ entity with three yellow eyes in a central skull, long bony limbs and black-violet energy above the Hillys moon altar.', fr: 'Le Grand Prêtre DomZ dirige l’armada et révèle que Jade, nommée Shauni, porte la source de son pouvoir.', en: 'The DomZ High Priest leads the armada and reveals that Jade, called Shauni, carries the source of his power.', canonStatus: 'canon first-game final antagonist', entityType: 'domz-world-boss', objective: 'Break the DomZ clones, adapt to reversed controls and return the stolen life force to the Hillyan captives.' },
  stage: { name: 'Old Slaughterhouses — IRIS infiltration', visualAnchor: 'Abandoned teal industrial canals, numbered loading bays, red laser grids, transport crates, hovercraft race tunnel and hidden camera sightlines.', fr: 'Jade infiltre les anciens abattoirs pour photographier le transfert des Hillyens capturés.', en: 'Jade infiltrates the old slaughterhouses to photograph the transfer of captured Hillyans.' },
  stageVariants: [
    stageVariant('Tactics', 'Old Slaughterhouses — rapport photographique', 'Very Hard', 'General Kehck', { objective: 'Photograph every transport proof, transmit the IRIS report and escape the Spiderbot pursuit.' }),
    stageVariant('RPG', 'Hillys Moon — DomZ altar', 'Expert', 'DomZ High Priest', { objective: 'Use team launches, resist reversed controls and free the captive life-force network.' })
  ],
  gear: [
    { id: 'jade_camera', enName: 'Jade’s Camera', frName: 'Appareil photo de Jade', boost: { atk: 5, spd: 2 }, visualAnchor: 'Compact green-and-black digital camera with round lens, wrist strap and an unreadable blank status screen.', fr: 'L’appareil documente animaux, codes et preuves pour le réseau IRIS.', en: 'The camera documents animals, codes and evidence for the IRIS Network.' },
    { id: 'dai_jo', enName: 'Daï-Jo Staff', frName: 'Bâton Daï-Jo', boost: { def: 6, hp: 45 }, visualAnchor: 'Long dark green-black staff with silver grip rings and a simple weighted end, no blade.', fr: 'Le bâton de Jade enchaîne balayages et frappes chargées.', en: 'Jade’s staff chains sweeps and charged strikes.' },
    { id: 'neutralizing_cannon', enName: 'Hovercraft Neutralizing Cannon', frName: 'Canon neutralisant du hovercraft', boost: { hp: 50, atk: 6 }, visualAnchor: 'Rounded blue-green hovercraft turret with two short barrels and a pearl-powered central lens.', fr: 'Mammago équipe le hovercraft pour neutraliser mines, serpents et machines.', en: 'Mammago equips the hovercraft to neutralize mines, serpents and machines.' }
  ],
  event: { id: 'iris_front_page', enName: 'IRIS Front-Page Report', frName: 'Une du réseau IRIS', en: 'Jade’s photographs replace Alpha propaganda on every Hillys screen and civilians open a safe route to the moon transmitter.', fr: 'Les photographies de Jade remplacent la propagande Alpha sur les écrans de Hillys et les habitants ouvrent une route sûre vers le transmetteur lunaire.', visualAnchor: 'Original green evidence photographs propagating across abstract blank city screens while Jade, Pey’j and Double H board the hovercraft; no readable article text.' }
});

const metalHellsinger = definePack(METAL_HELLSINGER, {
  aliases: ['Métalhell singer', 'Metal Hellsinger', 'Metal: Hellsinger VR'],
  mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Expert',
  colors: ['#481c1c', '#080303', '#ff663c'], motif: 'hellbeat',
  theme: 'rhythm FPS vengeance through eight Hells, Fury multiplier and the Unknown’s stolen voice',
  continuity: 'Metal: Hellsinger base-game story; Dream of the Beast weapons may be references but do not create additional lore protagonists',
  adaptationRule: 'Only the Unknown is a full-bodied armed protagonist. Paz is the canon talking skull weapon and narrator; the stolen Voice is a narrative objective with no combat stats. Bosses are Red Judge Aspects tied to named Hells, while the Red Judge herself remains the world threat.',
  visualAnchor: 'Red-black basalt Hells, bone-metal arenas, fire-lit beat pulses, the Unknown’s horns and tail, Paz’s one-eyed skull and geometric angelic Red Judge masks.',
  canonStatus: 'base-game canon with transparent objective adaptation for the stolen Voice',
  fr: 'L’Unknown tire, tranche et recharge sur le rythme tandis que Paz raconte leur montée vers la Red Judge et la voix dérobée.',
  en: 'The Unknown shoots, slashes and reloads on beat while Paz narrates their climb toward the Red Judge and the stolen Voice.',
  referenceUrls: [METAL_HELLSINGER.url, 'https://forums.funcom.com/t/f-a-q-and-information/194833', 'https://forums.funcom.com/t/metal-hellsinger-update-1-6-2023-03-29-dream-of-the-beast-dlc-release/224859', 'https://store.steampowered.com/app/1061910/Metal_Hellsinger/'],
  characters: [
    { id: 'unknown', name: 'The Unknown', role: 'slayer', weapon: 'Terminus blade and infernal firearms', weaponType: 'blade', simple: 'Terminus beat slash', secondary: 'Persephone beat shot', defense: 'Dash on beat', special: '16× Fury Hellsinger chorus', visualAnchor: 'Tall part-human part-demon woman with charcoal-red skin, long black hair, swept horns, narrow tail, black cropped battle clothing and the broad Terminus blade; no sexualized camera or copied render.', fr: 'Partiellement humaine et démoniaque, l’Unknown traverse les Hells pour reprendre sa voix.', en: 'Part human and part demon, the Unknown crosses the Hells to reclaim her voice.', canonStatus: 'canon protagonist' },
    { id: 'paz', name: 'Paz', role: 'hacker', weapon: 'Paz firebolts', weaponType: 'magic', simple: 'Skull firebolt', secondary: 'Beat crystal generation', defense: 'Narrator’s warning', special: 'Ultimate pulse of Paz', visualAnchor: 'Small floating horned skull with one bright orange central eye, cracked dark bone, metal jaw fittings and a warm ember aura; no body added.', fr: 'Paz est le crâne parlant, narrateur et arme qui accompagne l’Unknown.', en: 'Paz is the talking skull, narrator and weapon accompanying the Unknown.', canonStatus: 'canon sentient weapon and narrator', entityType: 'sentient-skull-weapon' },
    { id: 'stolen_voice', name: 'The Unknown’s Stolen Voice', role: 'tactical', visualAnchor: 'Abstract red-gold vocal waveform trapped inside four cracked black crystal rings, no mouth, body, lyrics or readable notation.', fr: 'La voix volée motive la traversée ; elle devient un objectif à restaurer, jamais une seconde combattante inventée.', en: 'The stolen voice motivates the journey; it becomes an objective to restore, never an invented second fighter.', canonStatus: 'canon narrative objective, explicitly not a separate lore character', entityType: 'voice-restoration-trial', nonCombat: true, objective: 'Recover the four memory shards and restore the Unknown’s Voice before entering Sheol.', objectiveFr: 'Récupérer les quatre fragments de mémoire puis restaurer la voix de l’Unknown avant d’entrer dans Sheol.', victoryCondition: 'collect-shards-restore-voice' }
  ],
  monsters: [
    { id: 'marionette', name: 'Marionette', weapon: 'Claw swipe', special: 'Beat-synchronized swarm', visualAnchor: 'Thin ash-black humanoid demon with elongated arms, ember cracks, faceless wedge head and simple crouched silhouette.', fr: 'La Marionette est le démon de base et alimente les séries de frappes rythmiques.', en: 'The Marionette is the baseline demon and feeds rhythmic hit streaks.', canonStatus: 'canon base-game enemy' },
    { id: 'cambion', name: 'Cambion', weapon: 'Burst-fire cannon arm', special: 'Rhythmic projectile burst', visualAnchor: 'Broad red-black demon with one oversized bone cannon arm, thick shoulder plates and glowing orange face slit.', fr: 'Le Cambion tire des rafales calées sur le rythme.', en: 'The Cambion fires bursts synchronized to the beat.', canonStatus: 'canon base-game enemy' },
    { id: 'behemoth', name: 'Behemoth', weapon: 'Ground slam', special: 'Arena shockwave', visualAnchor: 'Enormous squat basalt demon with thick forearms, molten orange seams and a low horned brow filling the arena lane.', fr: 'Le Behemoth transforme chaque temps fort en onde de choc.', en: 'The Behemoth turns each downbeat into a shockwave.', canonStatus: 'canon base-game enemy' }
  ],
  bosses: [
    { id: 'aspect_voke', name: 'Red Judge Aspect — Voke', weapon: 'Fire volley', special: 'First anguish gate', visualAnchor: 'Floating masked demonic Aspect with black-red layered wings, narrow ivory geometric faceplate and orange projectiles above Voke’s lava arena.', fr: 'Le premier Aspect apprend à lire les salves de boss sur le rythme.', en: 'The first Aspect teaches how to read boss volleys on the beat.', canonStatus: 'canon Red Judge Aspect boss', continuityScope: 'Voke' },
    { id: 'aspect_stygia', name: 'Red Judge Aspect — Stygia', weapon: 'Cold-fire projectiles', special: 'Stygia arena pattern', visualAnchor: 'Floating Red Judge Aspect with the same geometric mask but blue-violet wing membranes and cold ember rings in Stygia.', fr: 'L’Aspect de Stygia conserve l’identité de la Red Judge tout en changeant son motif d’arène.', en: 'The Stygia Aspect retains the Red Judge identity while changing its arena pattern.', canonStatus: 'canon Red Judge Aspect boss', continuityScope: 'Stygia' },
    { id: 'aspect_acheron', name: 'Red Judge Aspect — Acheron', weapon: 'Layered shockwave volley', special: 'Invulnerable beat phase', visualAnchor: 'Late-game Red Judge Aspect with large black-gold mask, six red wing blades and concentric shockwave rings over Acheron’s abyss.', fr: 'L’Aspect d’Acheron impose des phases invulnérables rythmées et des salves concentriques.', en: 'The Acheron Aspect imposes rhythmic invulnerable phases and concentric volleys.', canonStatus: 'canon Red Judge Aspect boss', continuityScope: 'Acheron' }
  ],
  worldBoss: { id: 'red_judge', name: 'The Red Judge', weapon: 'Hell sovereignty and anguish projectiles', special: 'Sheol final judgement', visualAnchor: 'Immense red-black ruler of Hell with angular ivory-gold mask, tall branching crown horns, layered blade-wings and a throne-scale silhouette in Sheol; no actor likeness.', fr: 'La Red Judge règne sur les Hells et a arraché la voix de l’Unknown.', en: 'The Red Judge rules the Hells and stripped the Unknown of her voice.', canonStatus: 'canon final antagonist', entityType: 'hell-sovereign-world-boss', objective: 'Maintain the beat through all judgement phases, break the anguish gates and reclaim the Voice.' },
  stage: { name: 'Sheol — Red Judge arena', visualAnchor: 'Vast circular black basalt arena suspended above red void, angular bone gates, ember beat rings and a distant geometric throne.', fr: 'Sheol conclut le voyage par une arène dont chaque salve suit la musique.', en: 'Sheol ends the journey in an arena where every volley follows the music.' },
  stageVariants: [
    stageVariant('Smash', 'Acheron — Aspect cadence', 'Expert', 'Red Judge Aspect — Acheron', { objective: 'Dodge invulnerable-phase rings, then answer every open beat with a precision attack.' }),
    stageVariant('RPG', 'Voice Vault — fragments vocaux', 'Very Hard', 'The Unknown’s Stolen Voice', { objective: 'Collect memory shards in tempo; there is no opponent or damage phase.', objectiveFr: 'Récupérer les fragments de mémoire en rythme ; il n’existe ni adversaire ni phase de dégâts.', victoryCondition: 'collect-shards-restore-voice', nonCombat: true })
  ],
  gear: [
    { id: 'terminus', enName: 'Terminus', frName: 'Terminus', boost: { atk: 9, spd: 1 }, visualAnchor: 'Wide dark-metal demon blade with broken cleaver profile, red-hot central groove and wrapped grip.', fr: 'L’épée de l’Unknown frappe et accumule son ultime sur le rythme.', en: 'The Unknown’s sword strikes and builds its ultimate on beat.' },
    { id: 'persephone', enName: 'Persephone', frName: 'Persephone', boost: { def: 5, hp: 50 }, visualAnchor: 'Heavy black-red double-barrel shotgun with squared bone-metal frame and orange chamber glow.', fr: 'Le shotgun récompense le tir rapproché exactement sur le temps.', en: 'The shotgun rewards close-range shots exactly on beat.' },
    { id: 'hounds', enName: 'The Hounds', frName: 'The Hounds', boost: { hp: 45, atk: 6 }, visualAnchor: 'Pair of compact matched black infernal pistols with hooked muzzles and red-gold cylinder glow.', fr: 'Les pistolets jumeaux maintiennent la cadence à moyenne portée.', en: 'The twin pistols maintain cadence at medium range.' }
  ],
  event: { id: 'sixteen_fury', enName: '16× Fury Chorus', frName: 'Refrain de Fury ×16', en: 'Perfectly timed attacks add the full vocal layer and open a brief chorus in which every reload and execution lands on beat.', fr: 'Les attaques parfaitement calées ajoutent la couche vocale complète et ouvrent un court refrain où recharges et exécutions tombent sur le temps.', visualAnchor: 'The Unknown and Paz surrounded by sixteen abstract ember beat marks while the arena’s instrument layers brighten, with no lyrics or text.' }
});

const deadByDaylight = definePack(DEAD_BY_DAYLIGHT, {
  aliases: ['Dead By Daylight', 'DBD'],
  mediaType: 'game', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#26282b', '#050506', '#be2633'], motif: 'fogtrial',
  theme: 'four-versus-one Trials in the Entity’s Fog, generator repair, rescue, chase and escape',
  continuity: 'Dead by Daylight original Behaviour Interactive roster only; licensed crossover Survivors, Killers and maps are excluded',
  adaptationRule: 'Survivors do not attack Killers: Dwight, Meg and Claudette are noncombat repair, chase and rescue trial roles with no HP/ATK package or invented weapons. Killers retain their asymmetric powers. The Entity cannot be punched or killed; the finale is repairing five generators, opening a gate and escaping its Trial.',
  visualAnchor: 'Cold blue-black Fog, rusted generators, red hook aura, worn rural and industrial Realm fragments, scratch marks and the original 2016 Survivor/Killer silhouettes.',
  canonStatus: 'original Dead by Daylight roster and Trial rules, no licensed crossover content',
  fr: 'Dwight, Meg et Claudette coopèrent pour réparer les générateurs, sauver les captifs et franchir les portes avant le sacrifice.',
  en: 'Dwight, Meg and Claudette cooperate to repair generators, rescue captives and pass through the gates before sacrifice.',
  referenceUrls: [DEAD_BY_DAYLIGHT.url, 'https://deadbydaylight.com/news/2v8-mode-everything-to-know/', 'https://deadbydaylight.com/news/from-dnd-to-dbd-new-player-handbook/', 'https://deadbydaylight.com/news/the-entity-unveiled/', 'https://deadbydaylight.com/game/maps/'],
  characters: [
    { id: 'dwight_fairfield', name: 'Dwight Fairfield', role: 'tactical', visualAnchor: 'Nervous young man with short brown hair, square black glasses, pale blue office shirt, loosened striped tie and dark trousers, crouched beside a generator; no actor likeness or weapon.', fr: 'Dwight coordonne les autres survivants et répare sous pression.', en: 'Dwight coordinates other Survivors and repairs under pressure.', canonStatus: 'canon original 2016 Survivor', entityType: 'cooperative-repair-trial', nonCombat: true, objective: 'Coordinate two cooperative generator repairs and leave no teammate behind.', objectiveFr: 'Coordonner deux réparations coopératives de générateur sans abandonner de partenaire.', victoryCondition: 'repair-cooperatively-and-regroup' },
    { id: 'meg_thomas', name: 'Meg Thomas', role: 'tactical', visualAnchor: 'Athletic young woman with tied-back dark auburn hair, red running jacket, gray athletic top and dark running trousers, vaulting a pallet with no weapon.', fr: 'Meg utilise sa vitesse pour attirer la poursuite loin des réparateurs.', en: 'Meg uses her speed to draw the chase away from repairers.', canonStatus: 'canon original 2016 Survivor', entityType: 'chase-and-escape-trial', nonCombat: true, objective: 'Complete the marked chase route, vault safely and return to the exit team.', objectiveFr: 'Terminer la route de poursuite balisée, franchir les obstacles puis rejoindre l’équipe à la sortie.', victoryCondition: 'complete-chase-route-and-regroup' },
    { id: 'claudette_morel', name: 'Claudette Morel', role: 'hacker', visualAnchor: 'Young Black botanist with natural textured hair, thin glasses, pink knit top under a brown utility jacket and dark jeans, kneeling with a med-kit and no weapon.', fr: 'Claudette identifie les plantes utiles et soigne discrètement les autres survivants.', en: 'Claudette identifies useful plants and quietly heals other Survivors.', canonStatus: 'canon original 2016 Survivor', entityType: 'healing-and-rescue-trial', nonCombat: true, objective: 'Find the medicinal plants, heal one injured Survivor and complete a safe unhook rescue.', objectiveFr: 'Trouver les plantes médicinales, soigner un survivant blessé puis réussir un sauvetage sûr au crochet.', victoryCondition: 'heal-rescue-and-escape' }
  ],
  monsters: [
    { id: 'trapper', name: 'The Trapper', weapon: 'The Cleaver and bear traps', special: 'MacMillan trap web', visualAnchor: 'Huge original Killer in torn charcoal work clothes, rusted metal-and-bone mask, broad cleaver and mechanical bear trap; no excessive gore.', fr: 'Evan MacMillan contrôle les passages avec ses pièges à mâchoires.', en: 'Evan MacMillan controls passages with his bear traps.', canonStatus: 'canon original 2016 Killer' },
    { id: 'wraith', name: 'The Wraith', weapon: 'Azarov’s Skull and Wailing Bell', special: 'Cloaked ambush', visualAnchor: 'Very tall thin original Killer with barklike gray skin, wrapped cloth mask, spine-and-skull club and small weathered bell.', fr: 'Le Wraith sonne sa cloche pour devenir presque invisible avant l’embuscade.', en: 'The Wraith rings his bell to become nearly invisible before ambushing.', canonStatus: 'canon original 2016 Killer' },
    { id: 'hillbilly', name: 'The Hillbilly', weapon: 'Hammer and chainsaw', special: 'Chainsaw sprint', visualAnchor: 'Powerful hunched original Killer in torn farm overalls, crudely repaired pale face covering, heavy hammer and industrial chainsaw; no gore.', fr: 'Le Hillbilly traverse rapidement les lignes droites avec sa tronçonneuse.', en: 'The Hillbilly crosses long straight lanes at speed with his chainsaw.', canonStatus: 'canon original 2016 Killer' }
  ],
  bosses: [
    { id: 'nurse', name: 'The Nurse', weapon: 'Bonesaw', special: 'Spencer’s Last Breath blink', visualAnchor: 'Floating woman Killer in worn 19th-century asylum dress, white cloth sack covering the head and small bonesaw, framed without gore.', fr: 'La Nurse traverse les obstacles par une série de blinks épuisants.', en: 'The Nurse crosses obstacles through a chain of exhausting blinks.', canonStatus: 'canon original Dead by Daylight Killer' },
    { id: 'huntress', name: 'The Huntress', weapon: 'Broad axe and hunting hatchets', special: 'Long-range hatchet throw', visualAnchor: 'Tall woman Killer in worn red-brown folk dress, cracked white hare mask, broad woodsman axe and several small hatchets; no gore.', fr: 'La Huntress force les survivants à lire les lignes de lancer entre les arbres.', en: 'The Huntress forces Survivors to read throwing lanes between trees.', canonStatus: 'canon original Dead by Daylight Killer' },
    { id: 'doctor', name: 'The Doctor', weapon: 'The Stick', special: 'Carter’s Spark madness field', visualAnchor: 'Broad man Killer in damaged dark medical coat, metal head apparatus holding an unnatural grin, electrified baton and blue-white static; no gore.', fr: 'Le Doctor révèle les positions et dérègle les interactions par ses décharges.', en: 'The Doctor reveals positions and disrupts interactions with electrical shocks.', canonStatus: 'canon original Dead by Daylight Killer' }
  ],
  worldBoss: { id: 'entity', name: 'The Entity’s Endless Trial', visualAnchor: 'A changing Fog Realm centered on five rusted generators, two powered exit gates and distant spiderlike black limbs reaching around hook structures, never a full humanoid body.', fr: 'L’Entity organise le cycle plutôt qu’un duel direct : réparer, sauver et s’échapper constitue la seule victoire temporaire.', en: 'The Entity organizes the cycle rather than a direct duel: repair, rescue and escape is the only temporary victory.', canonStatus: 'canon cosmic system and explicitly noncombat world objective', entityType: 'asymmetric-escape-trial', nonCombat: true, objective: 'Repair five generators, power an exit gate, rescue any hooked Survivor and escape the Trial.', objectiveFr: 'Réparer cinq générateurs, alimenter une porte de sortie, sauver tout survivant au crochet puis s’échapper de l’épreuve.', victoryCondition: 'repair-five-open-gate-and-escape', prohibitedConcepts: ['kill the Entity', 'Entity health bar', 'licensed Killer'], spritePrompt: 'Original fan-made pixel-art environmental objective sheet: one Fog Realm across four generator-to-exit states, rusted machinery, gate lights and distant spiderlike limbs. No humanoid boss, combat HUD, official art, logo, text, gore or licensed crossover imagery.' },
  stage: { name: 'MacMillan Estate — Coal Tower Trial', visualAnchor: 'Night industrial yard in heavy Fog, brick coal tower, rusted hooks, wooden pallets, red lockers and five scattered generators.', fr: 'Le Coal Tower devient une épreuve changeante fabriquée dans les souvenirs de l’Entity.', en: 'The Coal Tower becomes a changing Trial fabricated from memories by the Entity.' },
  stageVariants: [
    stageVariant('Tactics', 'Coal Tower — cinq générateurs', 'Expert', 'The Trapper', { objective: 'Repair five generators, identify the trapped routes and open one exit gate.' }),
    stageVariant('RPG', 'Fog Realm — évasion de l’Entity', 'Expert', 'The Entity’s Endless Trial', { objective: 'Repair, rescue and escape; attacking the Entity or Survivors fails the Trial.', objectiveFr: 'Réparer, sauver puis fuir ; attaquer l’Entity ou les survivants fait échouer l’épreuve.', victoryCondition: 'repair-five-open-gate-and-escape', nonCombat: true })
  ],
  gear: [
    { id: 'toolbox', enName: 'Mechanic’s Toolbox', frName: 'Boîte à outils de mécanicien', boost: { spd: 2, hp: 45 }, visualAnchor: 'Worn red metal toolbox with loose wrench, wire spool and blank unlabeled side.', fr: 'La boîte accélère temporairement réparation et sabotage de crochet.', en: 'The toolbox temporarily speeds repair and hook sabotage.' },
    { id: 'medkit', enName: 'Emergency Med-Kit', frName: 'Trousse de soins d’urgence', boost: { hp: 80 }, visualAnchor: 'Small worn green first-aid case with neutral white tape strips instead of a copied emblem.', fr: 'La trousse permet de soigner un survivant hors de la poursuite.', en: 'The kit heals a Survivor outside a chase.' },
    { id: 'flashlight', enName: 'Utility Flashlight', frName: 'Lampe torche utilitaire', boost: { def: 6, spd: 1 }, visualAnchor: 'Heavy yellow utility flashlight with ribbed grip and broad clean beam, no brand.', fr: 'Une lumière bien dirigée peut interrompre brièvement un Killer.', en: 'A carefully aimed beam can briefly interrupt a Killer.' }
  ],
  event: { id: 'last_generator', enName: 'Last Generator Stand', frName: 'Dernier générateur', en: 'Dwight coordinates the repair, Meg carries the chase away and Claudette completes the rescue as the final generator powers both gates.', fr: 'Dwight coordonne la réparation, Meg détourne la poursuite et Claudette termine le sauvetage lorsque le dernier générateur alimente les portes.', visualAnchor: 'Three original Survivors performing repair, chase and rescue in separate lanes linked by the same gate light; no combat pose.' }
});

const dantesInferno = definePack(DANTES_INFERNO, {
  aliases: ['Dante Inferno', "Dante’s Inferno game", "EA Dante's Inferno"],
  mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Expert',
  colors: ['#4b2118', '#080403', '#f5a23d'], motif: 'ninecircles',
  theme: 'Visceral Games’ action adaptation of Dante’s descent through the Nine Circles to recover Beatrice’s soul',
  continuity: 'Dante’s Inferno (2010) video game and its published manual, not the poem treated as a separate continuity',
  adaptationRule: 'Dante is the only armed hero. Beatrice is the soul to rescue and Virgil a guide, both represented as noncombat trials without invented attacks. Keep absolution and punishment as the game’s moral systems. Avoid the game’s sexualized Lust imagery in all project visuals and never use nudity.',
  visualAnchor: 'Black-red Nine Circles cliffs, chained platforms, the game’s crusader Dante with Death’s Scythe, Beatrice’s luminous cross and monumental infernal judges translated without nudity or gore.',
  canonStatus: '2010 video-game canon with strictly nonsexual project depiction',
  fr: 'Dante descend les neuf cercles avec la faux de Death tandis que Virgil le guide vers l’âme captive de Beatrice.',
  en: 'Dante descends the Nine Circles with Death’s Scythe while Virgil guides him toward Beatrice’s captive soul.',
  referenceUrls: [DANTES_INFERNO.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_Xbox_360/Manual/formated/Dante-s_Inferno_-_2010_-_Electronic_Arts.pdf', 'https://edizioni.multiplayer.it/wp-content/uploads/2010/09/dantesinferno.pdf'],
  characters: [
    { id: 'dante', name: 'Dante', role: 'slayer', weapon: 'Death’s Scythe and Holy Cross', weaponType: 'blade', simple: 'Scythe combo', secondary: 'Holy Cross burst', defense: 'Crusader guard', special: 'Redemption judgement', visualAnchor: 'Muscular crusader with short dark hair, bare upper torso covered by a large stitched cloth cross rather than exposed wounds, red waist cloth, metal arm guards and enormous curved bone-metal scythe; no gore or actor likeness.', fr: 'Le croisé Dante affronte ses fautes et les gardiens de chaque cercle pour rejoindre Beatrice.', en: 'The crusader Dante confronts his sins and each Circle’s guardians to reach Beatrice.', canonStatus: 'canon 2010 game protagonist', depictionRule: 'No skin-stitch gore; render the cross as an intact cloth panel.' },
    { id: 'beatrice', name: 'Beatrice Portinari', role: 'tactical', visualAnchor: 'Young woman’s luminous soul in a fully opaque long ivory medieval dress, dark braided hair and a small radiant cross, framed with dignity and no sexualization.', fr: 'Beatrice est l’âme que Lucifer cherche à épouser et que Dante tente de libérer.', en: 'Beatrice is the soul Lucifer seeks to marry and Dante tries to free.', canonStatus: 'canon captive soul and narrative objective', entityType: 'soul-rescue-trial', nonCombat: true, objective: 'Recover Beatrice’s three memory seals and free her soul from Lucifer’s pact.', objectiveFr: 'Récupérer les trois sceaux de mémoire de Beatrice puis libérer son âme du pacte de Lucifer.', victoryCondition: 'recover-seals-and-free-soul', depictionRule: 'Opaque modest dress, no nudity, bondage or sexualized framing.' },
    { id: 'virgil', name: 'Virgil', role: 'hacker', visualAnchor: 'Calm Roman poet guide in a full-length dark green-brown robe with laurel wreath, holding an unrolled route scroll and no weapon.', fr: 'Envoyé par Beatrice, Virgil explique les cercles et indique à Dante la prochaine route.', en: 'Sent by Beatrice, Virgil explains the Circles and points Dante toward the next route.', canonStatus: 'canon noncombat guide', entityType: 'dialogue-and-route-trial', nonCombat: true, objective: 'Find Virgil at the marked overlooks and correctly identify the route through each Circle.', objectiveFr: 'Retrouver Virgil aux belvédères indiqués puis identifier la bonne route dans chaque cercle.', victoryCondition: 'complete-guided-route' }
  ],
  monsters: [
    { id: 'damned_minion', name: 'Damned Minion', weapon: 'Infernal blade', special: 'Nine Circles swarm', visualAnchor: 'Lean ash-gray infernal soldier in broken crusader scraps with one crude black blade and ember eyes, no exposed wounds.', fr: 'Le Minion constitue l’adversaire infernal de base durant la descente.', en: 'The Minion is the baseline infernal adversary during the descent.', canonStatus: 'canon 2010 game enemy' },
    { id: 'throne_demon', name: 'Throne Demon', weapon: 'Flaming shield and axe', special: 'Shield charge', visualAnchor: 'Broad horned demon in dark iron plate carrying a round ember shield and short heavy axe, fully covered and without gore.', fr: 'Le Throne Demon bloque les attaques sacrées derrière son bouclier enflammé.', en: 'The Throne Demon blocks holy attacks behind its flaming shield.', canonStatus: 'canon 2010 game enemy' },
    { id: 'heretic', name: 'Heretic', weapon: 'Unholy staff', special: 'Suppression of holy powers', visualAnchor: 'Tall robed infernal caster in layered black-red vestments, narrow faceless hood and forked staff, no religious hate symbol.', fr: 'L’Heretic neutralise les pouvoirs sacrés tant qu’il reste dans l’arène.', en: 'The Heretic suppresses holy powers while it remains in the arena.', canonStatus: 'canon 2010 game enemy' }
  ],
  bosses: [
    { id: 'death', name: 'Death', weapon: 'Death’s Scythe', special: 'Opening soul duel', visualAnchor: 'Tall skeletal figure entirely wrapped in torn black robes, broad horned skull silhouette and enormous crescent scythe, no gore.', fr: 'Dante vainc Death au début du jeu et s’empare de sa faux.', en: 'Dante defeats Death at the start of the game and takes his scythe.', canonStatus: 'canon opening boss' },
    { id: 'king_minos', name: 'King Minos', weapon: 'Coiling tail and judge’s reach', special: 'Wheel of judgement arena', visualAnchor: 'Monumental blindfolded infernal judge with weathered stone-gray body, crownlike horns, long coiling tail and huge judgement wheel, framed without mutilation.', fr: 'Minos juge les damnés à l’entrée de Limbo et transforme son verdict en arène.', en: 'Minos judges the damned at Limbo’s entrance and turns his verdict into an arena.', canonStatus: 'canon Limbo boss', depictionRule: 'No facial injury or execution gore.' },
    { id: 'francesco', name: 'Francesco Portinari', weapon: 'Damned Crusader sword', special: 'Crusader shade summons', visualAnchor: 'Fallen crusader in dark plate and red cloth, multiple sealed sword hilts forming a symbolic burden on the back, one straight blade and no exposed wounds.', fr: 'Francesco, frère de Beatrice trahi par Dante, convoque les croisés damnés avant de pouvoir être absous.', en: 'Francesco, Beatrice’s brother betrayed by Dante, summons damned crusaders before he can be absolved.', canonStatus: 'canon Violence-circle boss and absolution target', entityType: 'absolution-boss' }
  ],
  worldBoss: { id: 'lucifer', name: 'Lucifer', weapon: 'Infernal power and deception', special: 'Frozen-lake final form', visualAnchor: 'Colossal winged dark-red fallen angel in a frozen black lake, crown horns, full armored waist covering and orange infernal aura; no nudity, explicit anatomy or gore.', fr: 'Lucifer manipule la croisade de Dante et le pacte de Beatrice pour tenter de sortir de Hell.', en: 'Lucifer manipulates Dante’s crusade and Beatrice’s pact in an attempt to escape Hell.', canonStatus: 'canon final antagonist', entityType: 'infernal-world-boss', objective: 'Break the pact seals, complete the redemption exchanges and bind Lucifer beneath the frozen lake.', depictionRule: 'Full opaque armor and loin covering; no explicit anatomy or sexualized framing.' },
  stage: { name: 'Gates of Hell — Charon descent', visualAnchor: 'Towering black-stone gate above red abyss, chains, rotating bone gears and the face-shaped living Charon vessel in the distance, no gore.', fr: 'Les portes ouvrent la route verticale vers les neuf cercles.', en: 'The gates open the vertical route through the Nine Circles.' },
  stageVariants: [
    stageVariant('RPG', 'Limbo — jugement de Minos', 'Very Hard', 'King Minos', { objective: 'Read the coiling-tail pattern and activate the judgement mechanism without graphic finishers.' }),
    stageVariant('Tactics', 'Treachery — pacte de Beatrice', 'Expert', 'Lucifer', { objective: 'Recover Beatrice’s seals before completing the frozen-lake binding.' })
  ],
  gear: [
    { id: 'deaths_scythe', enName: 'Death’s Scythe', frName: 'Faux de Death', boost: { atk: 10, spd: 1 }, visualAnchor: 'Enormous crescent black-metal scythe with pale bone spine and red inner edge, completely clean.', fr: 'Dante vole la faux après le duel d’ouverture et développe son arbre Punishment.', en: 'Dante steals the scythe after the opening duel and develops the Punishment tree.' },
    { id: 'holy_cross', enName: 'Holy Cross', frName: 'Croix sacrée', boost: { def: 7, hp: 40 }, visualAnchor: 'Small simple gold cross casting layered white rays, no denomination text or ornate relic box.', fr: 'La croix donnée par Beatrice projette le pouvoir sacré et développe Absolution.', en: 'The cross given by Beatrice projects holy power and develops Absolution.' },
    { id: 'beatrice_stone', enName: 'Beatrice Stone', frName: 'Pierre de Beatrice', boost: { hp: 70, def: 3 }, visualAnchor: 'Smooth pale memory stone held inside a small gold cross frame, with a soft ivory soul glow.', fr: 'Les pierres de Beatrice améliorent les possibilités d’absolution.', en: 'Beatrice Stones improve Dante’s absolution options.' }
  ],
  event: { id: 'absolution_path', enName: 'Path of Absolution', frName: 'Voie de l’Absolution', en: 'Dante chooses absolution for the marked shade, unlocking a holy route while Virgil records the consequence and Beatrice’s seal brightens.', fr: 'Dante choisit d’absoudre l’ombre marquée, ouvre une route sacrée tandis que Virgil consigne la conséquence et qu’un sceau de Beatrice s’illumine.', visualAnchor: 'White cross light opening one path beside a dark scythe path, with Virgil and Beatrice shown only as distant dignified guides.' }
});

const shadowMan = definePack(SHADOW_MAN, {
  aliases: ['Shadowman', 'Shadow Man Remastered', 'Shadow Man game'],
  mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Expert',
  colors: ['#28222c', '#050405', '#b25fba'], motif: 'deadsideasylum',
  theme: 'Michael LeRoi’s passage between Liveside and Deadside to stop Legion and the Five from opening the Asylum',
  continuity: 'Shadow Man (1999) as restored by Nightdive’s Remastered edition; 2econd Coming is excluded from the core story pack',
  adaptationRule: 'Michael/Shadow Man is the only combat hero. Mama Nettie is a Liveside priestess and Jaunty a Deadside gatekeeper, so both are guidance trials without attacks or stats. Preserve the Mask of Shadows, Luke’s teddy warp and the Five’s named Asylum domains; do not turn voodoo into generic spell effects.',
  visualAnchor: 'Purple-black Deadside wasteland, iron Asylum corridors, Louisiana church and swamp, bone gates, Luke’s teddy bear and Michael’s chest-mounted Mask of Shadows.',
  canonStatus: '1999 game canon with Nightdive-restored enemies and levels explicitly labelled',
  fr: 'Michael LeRoi franchit les Marrow Gates avec les indications de Nettie et Jaunty pour empêcher Legion d’ouvrir l’Asylum.',
  en: 'Michael LeRoi crosses the Marrow Gates with Nettie and Jaunty’s guidance to stop Legion from opening the Asylum.',
  referenceUrls: [SHADOW_MAN.url, 'https://nightdivestudios.com/?blackhole=4bc5fafc4d', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/251770/manuals/Manual.pdf?t=1644250638', 'https://www.gog.com/en/news/release_shadow_man_remastered'],
  characters: [
    { id: 'michael_leroi', name: 'Michael LeRoi / Shadow Man', role: 'horror', weapon: 'Shadow Gun', weaponType: 'gun', simple: 'Shadow Gun shot', secondary: 'Govi flame', defense: 'Deadside strafe', special: 'Mask of Shadows awakening', visualAnchor: 'Black Louisiana man with close-cropped hair, white skull paint around the eyes and mouth only in Shadow Man form, bare upper torso, brown trousers, glowing Mask of Shadows embedded at the chest and an organic black Shadow Gun; no actor likeness or stereotype costume.', fr: 'Michael devient Shadow Man à la nuit tombée et protège Liveside des menaces de Deadside.', en: 'Michael becomes Shadow Man after dark and protects Liveside from Deadside threats.', canonStatus: 'canon protagonist and current Shadow Man', depictionRule: 'Specific 1999 game design; no generic tribal accessories.' },
    { id: 'mama_nettie', name: 'Mama Nettie', role: 'hacker', visualAnchor: 'Older Black woman in a modest dark purple modern dress and head wrap inside a small Louisiana church, holding route notes and no weapon; no actor likeness.', fr: 'Nettie lie le Mask of Shadows à Michael et dirige l’enquête depuis Liveside sans être une combattante.', en: 'Nettie binds the Mask of Shadows to Michael and directs the investigation from Liveside without being a fighter.', canonStatus: 'canon voodoo priestess, mentor and Liveside guide', entityType: 'dialogue-and-lore-trial', nonCombat: true, objective: 'Return the marked Dark Souls to Nettie and identify the next Asylum route from her visions.', objectiveFr: 'Rapporter les Dark Souls marquées à Nettie puis identifier la prochaine route de l’Asylum grâce à ses visions.', victoryCondition: 'deliver-souls-and-select-route', depictionRule: 'No invented ritual violence, attack pose or stereotype props.' },
    { id: 'jaunty', name: 'Jaunty', role: 'tactical', visualAnchor: 'Small serpentine Deadside gatekeeper with a pale skull-like human head, brown top hat, narrow coat collar and long dark snake body beside the Marrow Gates; no gore.', fr: 'Jaunty garde les Marrow Gates et fournit à Michael informations et directions dans Deadside.', en: 'Jaunty guards the Marrow Gates and supplies Michael with information and directions in Deadside.', canonStatus: 'canon Deadside guide and gatekeeper', entityType: 'gate-navigation-trial', nonCombat: true, objective: 'Find Jaunty at each Marrow Gate and unlock the correct teddy-warp route.', objectiveFr: 'Retrouver Jaunty à chaque Marrow Gate puis ouvrir la bonne route de téléportation du teddy.', victoryCondition: 'unlock-correct-gate-route' }
  ],
  monsters: [
    { id: 'deadside_zombie', name: 'Deadside Zombie', weapon: 'Claws and bite', special: 'Cage ambush', visualAnchor: 'Low-poly-inspired gray-purple Deadside corpse creature in torn brown cloth with blunt clawed hands, framed without open wounds or gore.', fr: 'Le zombie est l’adversaire commun des cages et couloirs de Deadside.', en: 'The zombie is the common adversary in Deadside cages and corridors.', canonStatus: 'canon Shadow Man enemy' },
    { id: 'deadwing', name: 'Deadwing', weapon: 'Aerial claws', special: 'Deadside dive', visualAnchor: 'Large purple-black batlike Deadside creature with bony wing fingers, narrow skull face and no mammalian gore detail.', fr: 'Le Deadwing plonge depuis les hauteurs des temples et de l’Asylum.', en: 'The Deadwing dives from the heights of temples and the Asylum.', canonStatus: 'canon Shadow Man enemy' },
    { id: 'yort', name: 'Yort', weapon: 'Heavy claw strike', special: 'Restored-area charge', visualAnchor: 'Bulky restored Nightdive creature with dark ochre hide, long forearms, low horned head and purple Deadside fissures.', fr: 'Yort est un ennemi restauré dans Shadow Man Remastered.', en: 'Yort is an enemy restored in Shadow Man Remastered.', canonStatus: 'canon restored Remastered enemy', continuityScope: 'Shadow Man Remastered' }
  ],
  bosses: [
    { id: 'jack_the_ripper', name: 'Jack the Ripper', weapon: 'Retractable blades', special: 'London chamber pursuit', visualAnchor: 'Fictionalized Victorian killer in long black coat, pale mechanical face mask and two long wrist blades inside an industrial Asylum chamber; no real victim imagery or gore.', fr: 'L’architecte de l’Asylum appartient aux Five recrutés par Legion.', en: 'The Asylum’s architect belongs to the Five recruited by Legion.', canonStatus: 'canon fictionalized member of the Five', depictionRule: 'No real victim, gore or celebration of historical violence.' },
    { id: 'milton_pike', name: 'Milton T. Pike', weapon: 'Heavy shotgun', special: 'Mojave prison lockdown', visualAnchor: 'Large fictional convict in dark prison work clothes, metal shoulder brace and heavy shotgun inside an empty block; no actor likeness or gore.', fr: 'Pike règne sur son secteur carcéral de l’Asylum.', en: 'Pike rules his prison sector of the Asylum.', canonStatus: 'canon member of the Five' },
    { id: 'marco_cruz', name: 'Marco Cruz', weapon: 'Sonic equipment and firearm', special: 'Music-state true form', visualAnchor: 'Fictional nightclub killer in dark 1990s suit among oversized speakers and purple sonic rings, no actor likeness, corpse imagery or gore.', fr: 'Marco change de comportement lorsque la musique et les haut-parleurs de son domaine sont interrompus.', en: 'Marco changes behavior when the music and speakers in his domain are interrupted.', canonStatus: 'canon member of the Five' }
  ],
  worldBoss: { id: 'legion', name: 'Legion', weapon: 'Deadside corruption', special: 'Trueform apocalypse gate', visualAnchor: 'Immense one-yet-many demon in dark violet-black armorlike flesh, several fused mask faces, broad tendrils and the Asylum cathedral gate behind it; no gore.', fr: 'Legion rassemble les Five pour ouvrir l’Asylum et déclencher l’apocalypse entre Deadside et Liveside.', en: 'Legion gathers the Five to open the Asylum and trigger apocalypse between Deadside and Liveside.', canonStatus: 'canon principal and final antagonist', entityType: 'deadside-world-boss', objective: 'Recover enough Dark Souls, close the Asylum conduits and defeat Legion’s Trueform before the Eclipse gate opens.' },
  stage: { name: 'Deadside — Asylum Cathedral', visualAnchor: 'Vast iron-and-bone industrial cathedral over purple void, rotating cages, rusted walkways, bloodless violet channels and five sealed domain doors.', fr: 'La cathédrale de l’Asylum relie les domaines des Five au portail de Legion.', en: 'The Asylum Cathedral links the Five’s domains to Legion’s gate.' },
  stageVariants: [
    stageVariant('RPG', 'Marrow Gates — teddy routes', 'Very Hard', 'Jaunty', { objective: 'Use Luke’s teddy and Jaunty’s clues to choose the correct Deadside route.', objectiveFr: 'Utiliser le teddy de Luke et les indices de Jaunty pour choisir la bonne route de Deadside.', victoryCondition: 'unlock-correct-gate-route', nonCombat: true }),
    stageVariant('Tactics', 'Engine Block — Trueform Legion', 'Expert', 'Legion', { objective: 'Seal each Eclipse conduit before Legion reaches full Trueform.' })
  ],
  gear: [
    { id: 'shadow_gun', enName: 'Shadow Gun', frName: 'Shadow Gun', boost: { atk: 9, spd: 1 }, visualAnchor: 'Compact organic black-purple pistol grown around a pale bone grip, violet muzzle glow and no gore.', fr: 'L’arme principale de Shadow Man se renforce dans Deadside.', en: 'Shadow Man’s primary weapon grows stronger in Deadside.' },
    { id: 'lukes_teddy', enName: 'Luke’s Teddy Bear', frName: 'Ours en peluche de Luke', boost: { def: 6, hp: 50 }, visualAnchor: 'Small worn brown teddy bear with one stitched patch and soft purple warp glow, clean and intact.', fr: 'Le teddy de son frère permet à Michael de voyager entre des points de Deadside.', en: 'His brother’s teddy lets Michael travel between Deadside points.' },
    { id: 'violator', enName: 'Violator', frName: 'Violator', boost: { hp: 45, atk: 7 }, visualAnchor: 'Heavy brass-and-black four-barrel Deadside firearm with rotating central cylinder and purple chamber lights.', fr: 'Le Violator est une arme lourde dissimulée dans l’Asylum.', en: 'The Violator is a heavy weapon hidden in the Asylum.' }
  ],
  event: { id: 'eclipse_opening', enName: 'Eclipse Gate Opening', frName: 'Ouverture de la porte de l’Éclipse', en: 'Liveside darkens, Michael becomes Shadow Man and every recovered Dark Soul illuminates one route toward Legion’s sealed Engine Block.', fr: 'Liveside s’assombrit, Michael devient Shadow Man et chaque Dark Soul récupérée éclaire une route vers l’Engine Block scellé de Legion.', visualAnchor: 'Louisiana church silhouette under an eclipse mirrored against the purple Asylum, with the Mask of Shadows glowing at the crossing.' }
});

const croc = definePack(CROC, {
  aliases: ['Croc', 'Croc Legend of the Gobbos', 'Croc franchise'],
  mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#27672d', '#081408', '#ffd443'], motif: 'gobboisland',
  theme: 'colorful island platforming, Gobbo rescue, crystal collection and Baron Dante’s transformed Guardians',
  continuity: 'Croc: Legend of the Gobbos (1997) as preserved by Argonaut Games’ remaster; Croc 2 material is excluded from the core roster',
  adaptationRule: 'Croc is the sole combat-capable playable hero. Beany transports him and King Rufus is a captive, so both become navigation/rescue trials without attacks or stats. Guardians are transformed animals and should revert after defeat. Ballistic Meg is immortal and therefore an avoidance target, not a health-bar enemy.',
  visualAnchor: 'Bright low-poly-inspired islands, green Croc with tan backpack, fuzzy orange Gobbos, colored crystals, yellow Beany bird, purple Dantinis and Baron Dante’s blocky castle machinery.',
  canonStatus: 'first-game canon with remaster visual reference',
  fr: 'Croc traverse les cinq îles, libère les Gobbos et affronte les Guardians transformés avant le château de Baron Dante.',
  en: 'Croc crosses five islands, frees the Gobbos and faces transformed Guardians before Baron Dante’s castle.',
  referenceUrls: [CROC.url, 'https://www.gog.com/pressroom/croc-legend-of-the-gobbos-brings-the-party-to-pc-on-gog-with-classic-platforming-and-gobbo-rescuing-action/', 'https://oldgamesdownload.com/wp-content/uploads/Croc_Legend_of_the_Gobbos_PS_Manual_EN.pdf', 'https://www.gog.com/en/game/croc_legend_of_the_gobbos'],
  characters: [
    { id: 'croc', name: 'Croc', role: 'slayer', weapon: 'Tail spin and stomp', weaponType: 'fists', simple: 'Tail spin', secondary: 'Running jump stomp', defense: 'Quick side hop', special: 'Crystal Island combo', visualAnchor: 'Small cheerful green crocodile with cream belly, large amber eyes, five rounded back spikes, tan square backpack and red-brown shoes, no added clothing or weapon.', fr: 'Élevé par les Gobbos, Croc court, saute, grimpe, nage et frappe avec sa queue pour sauver sa famille.', en: 'Raised by the Gobbos, Croc runs, jumps, climbs, swims and tail-spins to save his family.', canonStatus: 'canon protagonist' },
    { id: 'beany_bird', name: 'Beany the Bird', role: 'hacker', visualAnchor: 'Tiny bright yellow magical bird with round body, two small wings, orange beak and feet, carrying a soft teleport sparkle beside Croc.', fr: 'Beany met Croc à l’abri puis le transporte entre les îles ; ce n’est pas une combattante.', en: 'Beany carries Croc to safety and transports him between islands; she is not a fighter.', canonStatus: 'canon magical transport ally', entityType: 'island-navigation-trial', nonCombat: true, objective: 'Activate the Beany Gong route and choose the next island landing point.', objectiveFr: 'Activer la route des Beany Gongs puis choisir le prochain point d’atterrissage insulaire.', victoryCondition: 'activate-gongs-and-travel' },
    { id: 'king_rufus', name: 'King Rufus', role: 'tactical', visualAnchor: 'Large orange-furred Gobbo king with rounded ears, cream muzzle, small gold crown and red royal vest, safely visible behind a colorful castle cage.', fr: 'Rufus adopte Croc puis est capturé avec son peuple par Baron Dante.', en: 'Rufus adopts Croc and is later captured with his people by Baron Dante.', canonStatus: 'canon adoptive father and rescue objective', entityType: 'royal-rescue-trial', nonCombat: true, objective: 'Find every cage switch and free King Rufus without dropping the collected crystals.', objectiveFr: 'Trouver chaque interrupteur de cage puis libérer King Rufus sans perdre les cristaux collectés.', victoryCondition: 'open-cage-and-rescue' }
  ],
  monsters: [
    { id: 'dantini', name: 'Dantini', weapon: 'Cartoon club', special: 'Impish patrol hop', visualAnchor: 'Small purple imp with round yellow eyes, two short horn ears, large hands and a simple brown club, matching the cheerful platform scale.', fr: 'Les Dantinis sont les petits sbires violets de Baron Dante.', en: 'Dantinis are Baron Dante’s small purple minions.', canonStatus: 'canon core enemy' },
    { id: 'jellyfish', name: 'Gobbo Island Jellyfish', weapon: 'Electric contact', special: 'Underwater patrol', visualAnchor: 'Translucent blue jellyfish with rounded square bell, four short tentacles and a soft yellow electric pulse in a bright underwater cave.', fr: 'La méduse patrouille les niveaux sous-marins et impose un timing de nage.', en: 'The jellyfish patrols underwater levels and imposes swimming timing.', canonStatus: 'canon first-game enemy' },
    { id: 'ballistic_meg', name: 'Ballistic Meg', visualAnchor: 'Thin bright pink immortal runner with small rounded head and long legs leaving a clean orange fire trail across a stone fairway.', fr: 'Ballistic Meg est immortelle ; Croc doit lire son aller-retour et traverser sa piste plutôt que l’attaquer.', en: 'Ballistic Meg is immortal; Croc must read her back-and-forth route and cross rather than attack.', canonStatus: 'canon immortal hazard', entityType: 'timed-crossing-trial', nonCombat: true, objective: 'Cross Ballistic Meg’s fairway during safe intervals and recover the Gobbo at the far side.', objectiveFr: 'Traverser la piste de Ballistic Meg pendant les intervalles sûrs puis récupérer le Gobbo opposé.', victoryCondition: 'cross-route-and-rescue', prohibitedConcepts: ['Ballistic Meg health bar', 'kill Ballistic Meg'] }
  ],
  bosses: [
    { id: 'tooty_feeble', name: 'Tooty the Feeble', weapon: 'Circular sprint charge', special: 'Three vulnerable recoveries', visualAnchor: 'Large yellow-green transformed duck Guardian with rounded bill, green crown feathers and yellow star marking on belly in a circular forest clearing.', fr: 'Baron Dante transforme un petit canard en premier Guardian de Forest Island.', en: 'Baron Dante transforms a small duck into Forest Island’s first Guardian.', canonStatus: 'canon first-game Guardian' },
    { id: 'neptuna', name: 'Neptuna', weapon: 'Trident and tail swipe', special: 'Underwater magic shot', visualAnchor: 'Large blue-green transformed tuna Guardian with long tail, fin crest and simple gold trident inside a circular underwater tank.', fr: 'Neptuna est le Guardian sous-marin de Desert Island.', en: 'Neptuna is Desert Island’s underwater Guardian.', canonStatus: 'canon first-game Guardian' },
    { id: 'cactus_jack', name: 'Cactus Jack', weapon: 'Cactus arm sweep', special: 'Desert arena roll', visualAnchor: 'Enormous transformed green cactus Guardian with rounded segmented arms, tan cowboy hat and large orange flower, no real-person reference.', fr: 'Cactus Jack est l’immense second Guardian de Desert Island.', en: 'Cactus Jack is Desert Island’s enormous second Guardian.', canonStatus: 'canon first-game Guardian' }
  ],
  worldBoss: { id: 'baron_dante', name: 'Baron Dante', weapon: 'Transformation magic', special: 'Crystal Dante final form', visualAnchor: 'Large blocky purple sorcerer with cream muzzle, small horn ears, red cape and gold-tipped staff inside his colorful mechanical castle, followed by a faceted crystal form.', fr: 'Le sorcier jaloux Baron Dante enlève les Gobbos et transforme les animaux des îles en Guardians.', en: 'The jealous sorcerer Baron Dante kidnaps the Gobbos and transforms island animals into Guardians.', canonStatus: 'canon principal antagonist and final boss', entityType: 'platform-world-boss', objective: 'Complete all three castle attack patterns, rescue Rufus and unlock the Crystal Dante encounter.' },
  stage: { name: 'Forest Island — Gobbo rescue route', visualAnchor: 'Bright green low-poly-inspired forest platforms over lava and water, gray stone doors, six Gobbo cages, colored crystals and one Beany Gong.', fr: 'La première île apprend à retrouver les six Gobbos et les cinq cristaux colorés de chaque route.', en: 'The first island teaches how to find six Gobbos and five colored crystals on each route.' },
  stageVariants: [
    stageVariant('RPG', 'Desert Island — Neptuna tank', 'Very Hard', 'Neptuna', { objective: 'Swim around each trident pattern and tail-spin only during the Guardian’s vulnerable recovery.' }),
    stageVariant('Tactics', 'Ballistic Meg’s Fairway', 'Hard', 'Ballistic Meg', { objective: 'Time three safe crossings and rescue the far-side Gobbo; Meg cannot be damaged.', objectiveFr: 'Synchroniser trois traversées sûres puis libérer le Gobbo opposé ; Meg ne peut pas subir de dégâts.', victoryCondition: 'cross-route-and-rescue', nonCombat: true })
  ],
  gear: [
    { id: 'croc_backpack', enName: 'Croc’s Backpack', frName: 'Sac à dos de Croc', boost: { hp: 65, def: 3 }, visualAnchor: 'Small square tan canvas backpack with one flap, brown straps and no badge or text.', fr: 'Rufus donne à Croc son sac caractéristique avant l’attaque.', en: 'Rufus gives Croc his characteristic backpack before the attack.' },
    { id: 'colored_crystals', enName: 'Five Colored Crystals', frName: 'Cinq cristaux colorés', boost: { atk: 6, spd: 2 }, visualAnchor: 'Five small clean faceted crystals in red, green, blue, yellow and violet arranged around an empty door socket.', fr: 'Les cinq cristaux ouvrent la porte du bonus où attend le sixième Gobbo.', en: 'The five crystals open the bonus door where the sixth Gobbo waits.' },
    { id: 'beany_gong', enName: 'Beany Gong', frName: 'Gong Beany', boost: { def: 6, hp: 45 }, visualAnchor: 'Round yellow bird-shaped gong on two green posts with a simple striker and four fading sound rings.', fr: 'Les gongs activent les routes et le puzzle du Secret Sentinel.', en: 'The gongs activate routes and the Secret Sentinel puzzle.' }
  ],
  event: { id: 'six_gobbo_rescue', enName: 'Six-Gobbo Rescue Chain', frName: 'Chaîne de sauvetage des six Gobbos', en: 'Croc collects five colored crystals, opens the bonus room and frees all six Gobbos before Beany carries the group onward.', fr: 'Croc rassemble cinq cristaux colorés, ouvre la salle bonus puis libère les six Gobbos avant que Beany transporte le groupe.', visualAnchor: 'Croc opening six bright clean cages as orange Gobbos bounce toward a yellow Beany Gong, with no UI text.' }
});

export const CANON_ROSTER_WAVE_PART_D = Object.freeze([
  sanctum,
  goatSimulator,
  quake,
  likeADragon,
  italianBrainrot,
  legacyOfKain,
  prey2006,
  beyondGoodEvil,
  metalHellsinger,
  deadByDaylight,
  dantesInferno,
  shadowMan,
  croc
]);
