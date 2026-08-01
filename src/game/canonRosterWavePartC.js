const RESEARCH_DATE = '2026-08-01';

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

const definePack = (source, config) => {
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

const NAHEULBEUK = Object.freeze({
  key: 'naheulbeuk',
  universe: 'Le Donjon de Naheulbeuk',
  url: 'https://www.naheulbeuk.com/amulettedudesordre/index-personnages.htm'
});

const SURVIVAURE = Object.freeze({
  key: 'survivaure',
  universe: 'Les Aventuriers du Survivaure',
  url: 'https://www.knarfworld.net/dernier-episode.html'
});

const ADOPRIXTOXIS = Object.freeze({
  key: 'adoprixtoxis',
  universe: 'Adoprixtoxis',
  url: 'https://www.capitainegloomy.com/encyclopedie/'
});

const REFLETS = Object.freeze({
  key: 'reflets_acide',
  universe: 'Reflets d’Acide',
  url: 'https://www.refletsdacide.com/personnages/'
});

const naheulbeuk = definePack(NAHEULBEUK, {
  aliases: ['Dongeon de Naheulbeuk', 'Donjon de Naheulbeuk'],
  mediaType: 'audio-drama', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#513521', '#120d09', '#d8a83f'], motif: 'dungeon',
  theme: 'heroic-fantasy dungeon parody, disastrous teamwork and the Amulet of Chaos quest',
  continuity: 'Pen of Chaos audio saga and official character/bestiary material',
  adaptationRule: 'Keep the dysfunctional party heroic and distinct. Use named canon antagonists; do not replace the saga with generic fantasy archetypes.',
  visualAnchor: 'Stone dungeon corridors, torchlight, treasure clutter and the deliberately mismatched adventuring party described by Pen of Chaos.',
  canonStatus: 'canon audio-saga roster with transparent combat adaptation',
  fr: 'Le Ranger tente de mener une compagnie notoirement désunie dans le donjon de Zangdar, tandis que l’Amulette du Désordre attire des menaces bien plus vastes.',
  en: 'The Ranger tries to lead a notoriously dysfunctional company through Zangdar’s dungeon while the Amulet of Chaos attracts far greater threats.',
  referenceUrls: [NAHEULBEUK.url, 'https://www.naheulbeuk.com/maitredudonjon/', 'https://www.naheulbeuk.com/doc-baston.htm', 'https://www.penofchaos.com/warham/donjon-episodes.htm'],
  characters: [
    { id: 'ranger', name: 'Le Ranger', role: 'tactical', weapon: 'Épée du Ranger', weaponType: 'blade', simple: 'Coup d’épée prudent', secondary: 'Plan approximatif', defense: 'Repli tactique', special: 'Chef de compagnie malgré lui', visualAnchor: 'Human ranger with brown travel leathers, green cloak, short sword and the weary posture of an improvised leader.', fr: 'Chef autoproclamé du groupe, il tente de coordonner les autres avec une patience très relative.', en: 'The group’s self-appointed leader tries to coordinate everyone with very limited patience.' },
    { id: 'magicienne', name: 'La Magicienne', role: 'hacker', weapon: 'Sortilèges', weaponType: 'magic', simple: 'Projectile magique', secondary: 'Invocation étudiée', defense: 'Barrière arcanique', special: 'Sort du grimoire', visualAnchor: 'Young human magician in a practical robe, spellbook and staff, scholarly rather than armored.', fr: 'Érudite et polyglotte, elle compense les lacunes du groupe par ses connaissances et ses sorts.', en: 'A learned polyglot, she offsets the party’s shortcomings with knowledge and spells.' },
    { id: 'nain', name: 'Le Nain', role: 'slayer', weapon: 'Hache naine', weaponType: 'blade', simple: 'Coup de hache', secondary: 'Charge rancunière', defense: 'Solidité naine', special: 'Fureur cupide', visualAnchor: 'Short, broad dwarf in heavy mail with a large axe, beard and permanently combative expression.', fr: 'Résistant, cupide et querelleur, le Nain préfère la hache aux longues explications.', en: 'Tough, greedy and quarrelsome, the Dwarf prefers his axe to lengthy explanations.' }
  ],
  monsters: [
    { id: 'gobelin', name: 'Gobelin', weapon: 'Lame grossière', special: 'Embuscade en bande', visualAnchor: 'Small green dungeon goblin in scavenged leather carrying a crude blade.', fr: 'Un pillard du donjon dangereux surtout lorsqu’il agit en bande.', en: 'A dungeon raider most dangerous when attacking in a pack.' },
    { id: 'orque', name: 'Orque', weapon: 'Hachoir orque', special: 'Assaut brutal', visualAnchor: 'Broad green-skinned orc with battered iron plates and a heavy cleaver.', fr: 'Fantassin brutal des profondeurs, plus solide qu’un gobelin.', en: 'A brutal undercroft infantryman, sturdier than a goblin.' },
    { id: 'troll', name: 'Troll', weapon: 'Massue', special: 'Régénération du troll', visualAnchor: 'Towering cave troll with rough hide, simple loincloth and an uprooted club.', fr: 'Une masse vivante difficile à abattre sans méthode.', en: 'A living battering ram that is difficult to stop without a plan.' }
  ],
  bosses: [
    { id: 'zangdar', name: 'Zangdar', weapon: 'Magie noire', special: 'Pièges du maître du donjon', visualAnchor: 'Lean human dark wizard in an imposing black robe, angular silhouette and dungeon-master control dais.', fr: 'Le maître du donjon orchestre les pièges depuis ses salles de contrôle.', en: 'The dungeon master orchestrates traps from his control rooms.' },
    { id: 'golbargh', name: 'Golbargh', weapon: 'Crocs et griffes', special: 'Ruée monstrueuse', visualAnchor: 'Huge horned fantasy monster occupying most of a torchlit stone chamber.', fr: 'Une créature majeure du donjon qui exige l’effort de toute la compagnie.', en: 'A major dungeon creature that requires the whole company’s effort.' },
    { id: 'wuxxus', name: 'Wuxxus l’Indicible', weapon: 'Puissance indicible', special: 'Terreur de l’Indicible', visualAnchor: 'Ancient occult entity suggested through tentacular shadow, runes and a silhouette never rendered as a generic demon.', fr: 'Une entité dont le nom même annonce une menace au-delà des monstres ordinaires.', en: 'An entity whose very name signals a threat beyond ordinary monsters.' }
  ],
  worldBoss: { id: 'gzor', name: 'Gzor', weapon: 'Corruption du Chaos', special: 'Convergence des Sept Couronnes', visualAnchor: 'Colossal dark god presence framed by seven-crown symbolism, red-black magical storm and no borrowed franchise iconography.', fr: 'Gzor est la menace cosmique liée au grand arc des Sept Couronnes.', en: 'Gzor is the cosmic threat tied to the larger Seven Crowns arc.', canonStatus: 'canon overarching antagonist', entityType: 'cosmic-antagonist', objective: 'Disrupt the Seven Crowns convergence and seal Gzor outside the Nexus.' },
  stage: { name: 'Donjon de Zangdar — couloirs piégés', visualAnchor: 'Irregular stone corridors, wood doors, torch brackets, treasure decoys and a remote control room.', fr: 'La compagnie progresse dans les couloirs piégés du donjon de Zangdar.', en: 'The company advances through the trapped corridors of Zangdar’s dungeon.' },
  stageVariants: [
    stageVariant('Smash', 'Antre du Golbargh', 'Very Hard', 'Golbargh', { objective: 'Break the monster’s charge pattern without splitting the party.' }),
    stageVariant('Tactics', 'Convergence des Sept Couronnes', 'Expert', 'Gzor', { objective: 'Disable the crown relays before sealing the cosmic breach.' })
  ],
  gear: [
    { id: 'amulette_desordre', enName: 'Amulet of Chaos', frName: 'Amulette du Désordre', boost: { atk: 8, spd: 1 }, visualAnchor: 'Small quest amulet with intentionally ambiguous magical ornament, not a generic jeweled crown.', fr: 'L’objet de quête au cœur de la première expédition.', en: 'The quest object at the heart of the first expedition.' },
    { id: 'grimoire_magicienne', enName: 'Magician’s Spellbook', frName: 'Grimoire de la Magicienne', boost: { def: 6, hp: 45 }, visualAnchor: 'Travel-worn spellbook with handwritten tabs and practical leather binding.', fr: 'Le grimoire rassemble les sorts préparés de la Magicienne.', en: 'The spellbook holds the Magician’s prepared spells.' },
    { id: 'hache_nain', enName: 'Dwarf’s Axe', frName: 'Hache du Nain', boost: { hp: 60, atk: 4 }, visualAnchor: 'Heavy one-handed dwarf axe, broad practical blade and nicked metal.', fr: 'La solution favorite du Nain aux problèmes du donjon.', en: 'The Dwarf’s preferred answer to dungeon problems.' }
  ],
  event: { id: 'baston_generale', enName: 'Dungeon Party Brawl', frName: 'Baston générale du donjon', en: 'The whole party attacks in chaotic sequence; success comes from keeping their incompatible talents aimed at the same target.', fr: 'Toute la compagnie attaque dans un ordre chaotique ; la réussite consiste à orienter ses talents incompatibles vers la même cible.', visualAnchor: 'Torchlit dungeon melee with the three heroes retaining their exact silhouettes and roles.' }
});

const survivaure = definePack(SURVIVAURE, {
  aliases: ['Les Aventuriers du NHL2987 Survivaure', 'Aventurier du survivaure'],
  mediaType: 'audio-drama', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#17334a', '#040a10', '#58d6ff'], motif: 'starship',
  theme: 'French space-opera parody aboard the NHL2987 Survivaure',
  continuity: 'Knarf audio saga and official episode transcripts',
  adaptationRule: 'Preserve the crew’s ranks, comic incompetence and radio-play technology. Haldar is a human Consortium political strategist exposed and arrested for his Krygonite complicity, never a melee boss. The Grand Gluant is the tentacled sovereign and supreme fleet commander of the Krygonite Empire, not a generic slime.',
  visualAnchor: 'Cramped retro-future starship corridors, blue instrument panels, bulky space suits and improvised military equipment.',
  canonStatus: 'canon audio-saga roster; local specification only pending rights permission',
  fr: 'Bleûten, Johnson et Rasmusen tentent de remplir une mission spatiale qui dégénère entre Krygonites, pannes et créatures improbables.',
  en: 'Bleûten, Johnson and Rasmusen attempt a space mission that collapses into Krygonites, breakdowns and improbable creatures.',
  referenceUrls: [SURVIVAURE.url, 'https://www.knarfworld.net/sites/default/files/survivaure_episode_10.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_15.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf', 'https://www.knarfworld.net/bd.html'],
  licensing: { permissionRequired: true, status: 'not-authorized-for-public-release', referenceUrl: 'https://www.knarfworld.net/comment/reply/21.html', releaseRule: 'Do not publish or deploy this pack without written permission from Knarf.' },
  characters: [
    { id: 'bleuten', name: 'Capitaine Bleûten', role: 'tactical', weapon: 'Blaster réglementaire', weaponType: 'gun', simple: 'Tir de blaster', secondary: 'Ordre improvisé', defense: 'Abri de passerelle', special: 'Manœuvre du capitaine', visualAnchor: 'Human starship captain in a dark practical uniform with rank details, sidearm and an often overwhelmed command posture.', fr: 'Le capitaine du Survivaure maintient tant bien que mal une chaîne de commandement.', en: 'The Survivaure’s captain keeps a chain of command together as best he can.' },
    { id: 'johnson', name: 'Sergent Johnson', role: 'marine', weapon: 'Fusil spatial', weaponType: 'gun', simple: 'Rafale du sergent', secondary: 'Couverture rapprochée', defense: 'Position fortifiée', special: 'Discipline militaire', visualAnchor: 'Stocky sergeant in a reinforced space uniform, long firearm and squared military stance.', fr: 'Le sergent apporte une réponse militaire directe aux problèmes de l’équipage.', en: 'The sergeant supplies a direct military answer to the crew’s problems.' },
    { id: 'rasmusen', name: 'Ingénieur Thobias Rasmusen', role: 'hacker', weapon: 'Outils d’ingénierie', weaponType: 'focus', simple: 'Décharge de maintenance', secondary: 'Dérivation de circuit', defense: 'Champ bricolé', special: 'Réparation impossible', visualAnchor: 'Starship engineer with utility coveralls, diagnostic tools, cable spool and an equipment harness.', fr: 'Rasmusen connaît les systèmes du vaisseau, même lorsqu’ils refusent obstinément de fonctionner.', en: 'Rasmusen understands the ship’s systems even when they stubbornly refuse to work.' }
  ],
  monsters: [
    { id: 'soldat_krygonite', name: 'Soldat krygonite', weapon: 'Fusil krygonite', special: 'Tir coordonné', visualAnchor: 'Armored alien infantry silhouette with utilitarian Krygonite rifle and no borrowed sci-fi insignia.', fr: 'Le fantassin standard des forces krygonites.', en: 'The standard infantry of the Krygonite forces.' },
    { id: 'lieutenant_krygonite', name: 'Lieutenant krygonite', weapon: 'Pistolet d’officier', special: 'Ordre de section', visualAnchor: 'Krygonite junior officer with distinct rank panel, sidearm and compact communicator.', fr: 'Un officier subalterne qui coordonne les sections krygonites.', en: 'A junior officer coordinating Krygonite squads.' },
    { id: 'garde_prison_krygonite', name: 'Garde de prison krygonite', weapon: 'Matraque énergétique', special: 'Verrouillage de cellule', visualAnchor: 'Heavy Krygonite prison guard with key console, visor and short energy baton.', fr: 'Un garde chargé de maintenir les prisonniers dans les cellules krygonites.', en: 'A guard tasked with keeping prisoners inside Krygonite cells.' }
  ],
  bosses: [
    { id: 'commandeur_krygonite', name: 'Commandeur krygonite', weapon: 'Arme de commandement', special: 'Renforts krygonites', visualAnchor: 'Senior Krygonite officer with ornate command armor and a tactical holographic display.', fr: 'Le commandeur dirige les opérations krygonites sur le terrain.', en: 'The commander directs Krygonite field operations.' },
    { id: 'krasbeurk', name: 'Lieutenant Krasbeurk', weapon: 'Blaster d’officier', special: 'Contre-attaque de Krasbeurk', visualAnchor: 'Named Krygonite lieutenant with recognizable officer panel, compact blaster and severe stance.', fr: 'Krasbeurk est un officier identifié, pas un simple soldat renommé.', en: 'Krasbeurk is a named officer, not a relabeled rank-and-file soldier.' },
    { id: 'haldar', name: 'Haldar', weapon: 'Réseau d’influence du Consortium', special: 'Manipulation de campagne électorale', visualAnchor: 'Human political strategist in a terrestrial Consortium meeting room with advisers, campaign dossiers and communications screens; no alien armor or melee weapon.', fr: 'Cadre du Consortium, Haldar protège les intérêts économiques de ses employeurs par une stratégie électorale ; sa complicité krygonite mène à son arrestation pour haute trahison.', en: 'A Consortium executive, Haldar protects his employers’ economic interests through election strategy; exposing his Krygonite complicity leads to his arrest for high treason.', canonStatus: 'canon political-economic antagonist; expose-and-arrest encounter', entityType: 'political-investigation-trial', nonCombat: true, objective: 'Gather the campaign evidence, expose Haldar’s Krygonite complicity and obtain his arrest for high treason.', objectiveFr: 'Rassembler les preuves de campagne, dévoiler la complicité krygonite de Haldar puis obtenir son arrestation pour haute trahison.', victoryCondition: 'expose-and-arrest', referenceUrls: ['https://www.knarfworld.net/sites/default/files/survivaure_episode_11.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf'] }
  ],
  worldBoss: { id: 'grand_gluant', name: 'Le Grand Gluant', weapon: 'Commandement de la flotte krygonite', special: 'Ordre de destruction planétaire', visualAnchor: 'Physical tentacled Krygonite sovereign aboard the command deck of his personal cruiser, imperial control displays and fleet formations; limacine and imposing but never an amorphous blob.', fr: 'Le Grand Gluant est le souverain de l’Empire krygonite et le commandant suprême de sa flotte depuis son croiseur personnel.', en: 'The Grand Gluant is sovereign of the Krygonite Empire and supreme commander of its fleet from his personal cruiser.', canonStatus: 'canon Krygonite sovereign and supreme fleet commander', entityType: 'fleet-command-world-boss', objective: 'Board the personal cruiser, disrupt the planetary-destruction order and defeat the Krygonite supreme command.', referenceUrls: ['https://www.knarfworld.net/sites/default/files/Episode_15.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf'] },
  stage: { name: 'NHL2987 Survivaure — pont principal', visualAnchor: 'Compact retro-future bridge, blue readouts, worn metal bulkheads and the crew’s mismatched stations.', fr: 'Le pont du Survivaure devient le centre d’une bataille de communications et de systèmes défaillants.', en: 'The Survivaure bridge becomes the center of a fight over communications and failing systems.' },
  stageVariants: [
    stageVariant('Smash', 'Prison krygonite', 'Very Hard', 'Lieutenant Krasbeurk', { objective: 'Open the cells and escape before the lockdown completes.' }),
    stageVariant('Tactics', 'Croiseur personnel du Grand Gluant', 'Expert', 'Le Grand Gluant', { objective: 'Disrupt the planetary-destruction order across the command deck and fleet relays.' })
  ],
  gear: [
    { id: 'blaster_reglementaire', enName: 'Regulation Blaster', frName: 'Blaster réglementaire', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact retro-future sidearm matching the saga’s military parody rather than a modern real weapon.', fr: 'L’arme de service de l’équipage.', en: 'The crew’s service weapon.' },
    { id: 'console_diagnostic', enName: 'Engineering Diagnostic Console', frName: 'Console de diagnostic', boost: { def: 6, hp: 45 }, visualAnchor: 'Portable diagnostic slab with cable leads and simple blue waveform display.', fr: 'Rasmusen s’en sert pour comprendre les pannes du NHL2987.', en: 'Rasmusen uses it to understand the NHL2987’s failures.' },
    { id: 'combinaison_spatiale', enName: 'Survivaure Space Suit', frName: 'Combinaison spatiale du Survivaure', boost: { hp: 65, def: 3 }, visualAnchor: 'Bulky patched space suit with broad collar ring and practical life-support pack.', fr: 'Une protection spatiale fonctionnelle malgré son entretien incertain.', en: 'Functional space protection despite uncertain maintenance.' }
  ],
  event: { id: 'ordre_bleuten', enName: 'Bleûten’s Emergency Order', frName: 'Ordre d’urgence de Bleûten', en: 'Bleûten issues an urgent maneuver while Johnson covers Rasmusen’s emergency rerouting.', fr: 'Bleûten lance une manœuvre urgente pendant que Johnson couvre le reroutage de secours de Rasmusen.', visualAnchor: 'Three stations on the NHL2987 bridge lighting in rapid sequence.' }
});

const adoprixtoxis = definePack(ADOPRIXTOXIS, {
  aliases: ['Adorpixtoxic', 'Adoprixtoxis'],
  mediaType: 'audio-drama', faction: 'sciFi', mode: 'Tactics', difficulty: 'Very Hard',
  colors: ['#263356', '#05070f', '#ef5bd2'], motif: 'alienbase',
  theme: 'French science-fiction parody on the planet Adoprixtoxis',
  continuity: 'Capitaine Gloomy audio saga, official encyclopedia and episode pages',
  adaptationRule: 'Use the official names and roles from the saga. “Vador” is the parody character’s canonical credited name here; never relabel him as Darth Vader or import Star Wars branding.',
  visualAnchor: 'Colorful pulp science-fiction planet, angular alien installations, improvised expedition gear and comic military robots.',
  canonStatus: 'canon audio-saga roster with transparent tactical adaptation',
  fr: 'Gloomy, Kellogs et K.R.O.T.E. affrontent soldats, robots et plans de Phobizer sur la planète Adoprixtoxis.',
  en: 'Gloomy, Kellogs and K.R.O.T.E. face soldiers, robots and Phobizer’s schemes on planet Adoprixtoxis.',
  referenceUrls: [ADOPRIXTOXIS.url, 'https://www.capitainegloomy.com/encyclopedie/qui-sommes-nous/', 'https://www.capitainegloomy.com/episodes/', 'https://sagas.neamar.fr/Adoprixtoxis-17/', 'https://sagas.neamar.fr/Adoprixtoxis-18/'],
  characters: [
    { id: 'gloomy', name: 'Capitaine Jean-Claude Gloomy', role: 'tactical', weapon: 'Pistolet spatial', weaponType: 'gun', simple: 'Tir du capitaine', secondary: 'Ordre de Gloomy', defense: 'Couverture expéditionnaire', special: 'Plan de sauvetage improvisé', visualAnchor: 'Human expedition captain in a practical sci-fi uniform, compact sidearm and expressive command stance.', fr: 'Le capitaine Gloomy dirige l’expédition avec plus de bonne volonté que de maîtrise.', en: 'Captain Gloomy leads the expedition with more goodwill than control.' },
    { id: 'kellogs', name: 'Professeur Albert Kellogs', role: 'hacker', weapon: 'Scanner scientifique', weaponType: 'focus', simple: 'Impulsion du scanner', secondary: 'Analyse de Kellogs', defense: 'Contre-mesure scientifique', special: 'Hypothèse décisive', visualAnchor: 'Human scientist in expedition clothes with spectacles, handheld analyzer and equipment satchel.', fr: 'Le professeur Kellogs étudie la planète et cherche une explication scientifique à chaque catastrophe.', en: 'Professor Kellogs studies the planet and seeks a scientific explanation for every catastrophe.' },
    { id: 'krote', name: 'K.R.O.T.E.', role: 'marine', weapon: 'Armement robotique', weaponType: 'gun', simple: 'Rafale robotique', secondary: 'Calcul de trajectoire', defense: 'Blindage K.R.O.T.E.', special: 'Protocole de protection', visualAnchor: 'Compact expedition robot with visible joint plating, sensor head and integrated utility weapon, not a humanoid franchise droid.', fr: 'Le robot K.R.O.T.E. apporte puissance de calcul, résistance et remarques mécaniques.', en: 'The robot K.R.O.T.E. supplies processing power, resilience and mechanical commentary.' }
  ],
  monsters: [
    { id: 'soldat_adoprixtoxitien', name: 'Soldat adoprixtoxitien', weapon: 'Fusil alien', special: 'Feu de section', visualAnchor: 'Planetary soldier in bright angular armor with an original long energy rifle.', fr: 'Un fantassin local engagé dans le conflit qui entoure l’expédition.', en: 'A local infantryman drawn into the conflict around the expedition.' },
    { id: 'robot_unite_22', name: 'Robot soldat — unité 22', weapon: 'Canon intégré', special: 'Salve automatisée', visualAnchor: 'Numbered military robot with blocky plated torso, tracked or sturdy mechanical legs and integrated cannon.', fr: 'Une unité militaire automatisée identifiée par son numéro.', en: 'An automated military unit identified by its number.' },
    { id: 'garde_zurpien', name: 'Garde zurpien', weapon: 'Lance zurpienne', special: 'Verrouillage zurpien', visualAnchor: 'Zurpian guard with nonhuman silhouette, ceremonial-tech armor and a long energy staff.', fr: 'Un garde zurpien chargé de défendre les positions de son camp.', en: 'A Zurpian guard assigned to defend its faction’s positions.' }
  ],
  bosses: [
    { id: 'vador', name: 'Vador', weapon: 'Pouvoirs de Vador', special: 'Renforts de ses soldats', visualAnchor: 'The saga’s own helmeted black-armored parody antagonist, rendered as original fan art without Star Wars logos, actor likeness or the name Darth.', fr: 'Vador et ses soldats interviennent dans la saga sous ce nom précis.', en: 'Vador and his soldiers appear in the saga under this exact name.', canonStatus: 'canon parody character in Adoprixtoxis; name locked to Vador' },
    { id: 'numero_69', name: 'N°69', weapon: 'Arme zurpienne', special: 'Impulsion électromagnétique', visualAnchor: 'Named Zurpian officer with a clear 69 designation, alien command armor and EMP emitter.', fr: 'L’officier zurpien N°69 utilise notamment une impulsion électromagnétique.', en: 'Zurpian officer No. 69 notably employs an electromagnetic pulse.' },
    { id: 'kiki_phobizer', name: 'Kiki de Phobizer', weapon: 'Morsure de créature', special: 'Assaut du cul-de-sac', visualAnchor: 'Phobizer’s strange pet creature in a confined alien corridor, quirky yet dangerous and not a generic dragon.', fr: 'La créature de Phobizer transforme une impasse en rencontre dangereuse.', en: 'Phobizer’s creature turns a dead end into a dangerous encounter.' }
  ],
  worldBoss: { id: 'phobizer', name: 'Seigneur Phobizer', weapon: 'Technologie de Phobizer', special: 'Contrôle de la planète', visualAnchor: 'Alien overlord with theatrical high-tech regalia, magenta energy architecture and an original silhouette.', fr: 'Phobizer orchestre la menace principale et domine les forces opposées aux héros.', en: 'Phobizer orchestrates the principal threat and commands the forces arrayed against the heroes.', canonStatus: 'canon principal antagonist', entityType: 'command-world-boss', objective: 'Disable Phobizer’s planetary command systems before confronting him.' },
  stage: { name: 'Adoprixtoxis — zone d’atterrissage', visualAnchor: 'Alien landing field with expedition wreckage, saturated sky and angular city structures in the distance.', fr: 'L’expédition sécurise sa zone d’atterrissage avant de rejoindre les installations de Phobizer.', en: 'The expedition secures its landing area before reaching Phobizer’s installations.' },
  stageVariants: [
    stageVariant('Smash', 'Base des soldats de Vador', 'Very Hard', 'Vador', { objective: 'Cross the guarded base without importing any outside franchise identity.' }),
    stageVariant('Tactics', 'Centre de commandement de Phobizer', 'Expert', 'Seigneur Phobizer', { objective: 'Disable the command grid node by node.' })
  ],
  gear: [
    { id: 'pistolet_gloomy', enName: 'Gloomy’s Space Pistol', frName: 'Pistolet spatial de Gloomy', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact colorful pulp-sci-fi sidearm with original proportions.', fr: 'L’arme d’expédition du capitaine.', en: 'The captain’s expedition sidearm.' },
    { id: 'scanner_kellogs', enName: 'Kellogs Analyzer', frName: 'Analyseur de Kellogs', boost: { def: 6, hp: 45 }, visualAnchor: 'Handheld scientific analyzer with antennae and a small waveform screen.', fr: 'L’outil scientifique du professeur Kellogs.', en: 'Professor Kellogs’s scientific tool.' },
    { id: 'module_krote', enName: 'K.R.O.T.E. Armor Module', frName: 'Module de blindage K.R.O.T.E.', boost: { hp: 65, atk: 3 }, visualAnchor: 'Interlocking robot armor module matching K.R.O.T.E.’s compact construction.', fr: 'Un module de protection du robot de l’équipe.', en: 'A protection module from the team’s robot.' }
  ],
  event: { id: 'expedition_gloomy', enName: 'Gloomy Expedition Protocol', frName: 'Protocole d’expédition Gloomy', en: 'Kellogs identifies a weak point, K.R.O.T.E. calculates the route and Gloomy orders the charge.', fr: 'Kellogs identifie une faiblesse, K.R.O.T.E. calcule l’itinéraire et Gloomy ordonne la charge.', visualAnchor: 'The three expedition members acting together against a saturated alien landscape.' }
});

const refletsAcide = definePack(REFLETS, {
  aliases: ["Reflet d'acide", 'Reflets d Acide'],
  mediaType: 'audio-drama', faction: 'arcane', mode: 'RPG', difficulty: 'Expert',
  colors: ['#331d44', '#08040d', '#ff784e'], motif: 'abyss',
  theme: 'rhymed heroic-fantasy audio saga descending into Mortepierre',
  continuity: 'JBX audio saga, official character pages and episode transcripts',
  adaptationRule: 'Preserve the rhymed saga’s exact identities and moral changes. Alia-Aénor is a rescue/trial encounter who becomes an ally, never a villain to kill; Bélial remains the true overarching antagonist.',
  visualAnchor: 'Mortepierre’s carved abyss, infernal red light, medieval-fantasy equipment and sharply differentiated party silhouettes.',
  canonStatus: 'canon audio-saga roster with explicit nonlethal story encounters',
  fr: 'Wrandrall entraîne Zehirmahnn et Zarakaï vers Mortepierre, où démons, révélations familiales et plans de Bélial redéfinissent leur quête.',
  en: 'Wrandrall draws Zehirmahnn and Zarakaï toward Mortepierre, where demons, family revelations and Bélial’s plans reshape their quest.',
  referenceUrls: [REFLETS.url, 'https://www.refletsdacide.com/presentation/', 'https://www.refletsdacide.com/wp-content/uploads/2017/04/Reflets-dAcide-16.pdf', 'https://www.refletsdacide.com/episodes/au-dela-de-la-mort/', 'https://sagas.neamar.fr/Reflets/'],
  characters: [
    { id: 'wrandrall', name: 'Wrandrall', role: 'slayer', weapon: 'Flamberge', weaponType: 'blade', simple: 'Taille de flamberge', secondary: 'Ruse de cambion', defense: 'Feinte de Wrandrall', special: 'Héritage infernal maîtrisé', visualAnchor: 'Young cambion adventurer with dark hair, travel-worn cloak and an oversized two-handed flamberge.', fr: 'Wrandrall, cambion armé d’une flamberge, est au centre des révélations de Mortepierre.', en: 'Wrandrall, a cambion carrying a flamberge, stands at the center of Mortepierre’s revelations.' },
    { id: 'zehirmahnn', name: 'Zehirmahnn', role: 'hacker', weapon: 'Feu élémentaire', weaponType: 'magic', simple: 'Trait de feu', secondary: 'Aura ignée', defense: 'Corps de flamme', special: 'Déferlement élémentaire', visualAnchor: 'Tall fire outsider with red-orange skin glow, elegant adventuring clothes and controlled flames around the hands.', fr: 'L’extraplanaire du feu manie les flammes avec retenue et érudition.', en: 'The fire outsider wields flame with restraint and learning.' },
    { id: 'zarakai', name: 'Zarakaï', role: 'slayer', weapon: 'Marteau de Zarakaï', weaponType: 'hammer', simple: 'Coup de marteau', secondary: 'Impact de jambe métallique', defense: 'Endurance presque indestructible', special: 'Colère du vieux nain', visualAnchor: 'Old broad dwarf with long beard, massive hammer, heavy armor and a clearly metallic leg.', fr: 'Le vieux nain presque indestructible frappe au marteau et s’appuie sur sa jambe métallique.', en: 'The nearly indestructible old dwarf fights with a hammer and his metal leg.' }
  ],
  monsters: [
    { id: 'goule', name: 'Goule', weapon: 'Griffes', special: 'Assaut des morts', visualAnchor: 'Gaunt undead ghoul from a medieval crypt, hunched silhouette and torn burial cloth.', fr: 'Un mort affamé rencontré dans les profondeurs.', en: 'A hungry undead creature encountered below.' },
    { id: 'gargouille', name: 'Gargouille', weapon: 'Serres de pierre', special: 'Plongeon minéral', visualAnchor: 'Carved stone gargoyle with folded wings that breaks from Mortepierre architecture.', fr: 'Une sentinelle minérale qui se détache des parois.', en: 'A mineral sentinel that tears free from the walls.' },
    { id: 'demon_legion', name: 'Démon des légions infernales', weapon: 'Arme infernale', special: 'Percée des légions', visualAnchor: 'Disciplined infernal legionary with ember-red armor, polearm and no generic horned-beast anatomy.', fr: 'Un soldat des forces infernales liées au plan de Bélial.', en: 'A soldier of the infernal forces tied to Bélial’s plan.' }
  ],
  bosses: [
    { id: 'sabnock', name: 'Sabnock', weapon: 'Magie démoniaque', special: 'Commandement infernal', visualAnchor: 'Named infernal noble with severe armor, heraldic occult marks and command posture.', fr: 'Sabnock exerce une autorité démoniaque au cœur de l’intrigue.', en: 'Sabnock wields demonic authority at the heart of the plot.' },
    { id: 'mortys', name: 'Mortys', weapon: 'Pouvoir de Mortepierre', special: 'Révélation de Mortys', visualAnchor: 'Ancient Mortepierre figure framed by carved stone, spectral energy and narrative rather than brute-force menace.', fr: 'Mortys constitue une rencontre majeure liée aux secrets du gouffre.', en: 'Mortys is a major encounter tied to the abyss’s secrets.' },
    { id: 'alia_aenor', name: 'Alia-Aénor', weapon: 'Souffle draconique', special: 'Éveil d’Alia-Aénor', visualAnchor: 'Majestic dragoness emerging from confinement, expressive intelligent eyes and red-gold scales.', fr: 'Alia-Aénor doit être libérée et comprise ; elle devient une alliée, pas une victime à abattre.', en: 'Alia-Aénor must be freed and understood; she becomes an ally, not a target to slay.', canonStatus: 'canon rescue encounter and later ally', entityType: 'rescue-trial', nonCombat: true, objective: 'Free Alia-Aénor and survive her awakening without killing her.', objectiveFr: 'Libérer Alia-Aénor puis survivre à son éveil sans la tuer.', victoryCondition: 'rescue-and-pacify' }
  ],
  worldBoss: { id: 'belial', name: 'Bélial', weapon: 'Pouvoir infernal', special: 'Plan du prince démon', visualAnchor: 'Overarching infernal prince in immense red-black silhouette behind Mortepierre’s abyss and ritual geometry.', fr: 'Bélial est la menace maîtresse dont les plans dépassent les gardiens du gouffre.', en: 'Bélial is the master threat whose designs exceed the abyss’s guardians.', canonStatus: 'canon overarching antagonist', entityType: 'infernal-world-boss', objective: 'Break Bélial’s ritual and force his influence out of Mortepierre.' },
  stage: { name: 'Gouffre de Mortepierre', visualAnchor: 'Vertical carved-stone abyss, bridges, crypt doors and deep red infernal light below.', fr: 'Le groupe descend dans le gouffre de Mortepierre à mesure que les rimes révèlent ses secrets.', en: 'The party descends into Mortepierre’s abyss as the rhymed story reveals its secrets.' },
  stageVariants: [
    stageVariant('Tactics', 'Geôle d’Alia-Aénor', 'Very Hard', 'Alia-Aénor', { objective: 'Release and pacify Alia-Aénor; lethal attacks fail the encounter.' }),
    stageVariant('Smash', 'Rituel infernal de Bélial', 'Expert', 'Bélial', { objective: 'Break the ritual anchors before confronting Bélial’s manifestation.' })
  ],
  gear: [
    { id: 'flamberge_wrandrall', enName: 'Wrandrall’s Flamberge', frName: 'Flamberge de Wrandrall', boost: { atk: 9, spd: 1 }, visualAnchor: 'Large two-handed flamberge with undulating blade and travel wear.', fr: 'L’arme caractéristique du cambion.', en: 'The cambion’s characteristic weapon.' },
    { id: 'marteau_zarakai', enName: 'Zarakaï’s Hammer', frName: 'Marteau de Zarakaï', boost: { hp: 55, atk: 5 }, visualAnchor: 'Massive dwarf war hammer balanced for Zarakaï’s short broad frame.', fr: 'Le marteau du vieux nain.', en: 'The old dwarf’s hammer.' },
    { id: 'braise_zehirmahnn', enName: 'Zehirmahnn Ember', frName: 'Braise de Zehirmahnn', boost: { def: 6, hp: 45 }, visualAnchor: 'Contained elemental ember floating inside a simple warded glass charm.', fr: 'Une braise stabilisée de l’extraplanaire du feu.', en: 'A stabilized ember from the fire outsider.' }
  ],
  event: { id: 'rime_mortepierre', enName: 'Mortepierre Revelation', frName: 'Révélation de Mortepierre', en: 'A rhymed revelation exposes the ritual anchors while the party’s fire, steel and hammer strike in sequence.', fr: 'Une révélation rimée dévoile les ancrages du rituel tandis que feu, acier et marteau frappent en cadence.', visualAnchor: 'Runes illuminating in rhyme-like sequence across Mortepierre’s carved abyss.' }
});

const UNREAL_TOURNAMENT = Object.freeze({
  key: 'unreal_tournament',
  universe: 'Unreal Tournament',
  url: 'https://unrealarchive.org/wikis/the-liandri-archives/UT_Single_Player.html'
});

const UNREAL_1998 = Object.freeze({
  key: 'unreal_1998',
  universe: 'Unreal',
  url: 'https://oldunreal.com/guides/Unreal%20manual.pdf'
});

const unrealTournament = definePack(UNREAL_TOURNAMENT, {
  aliases: ['Unreal Tournament 99', 'UT99'],
  mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Expert',
  colors: ['#152342', '#03050b', '#55c8ff'], motif: 'arena',
  theme: 'Liandri Grand Tournament arena ladder and shared weapon pickups',
  continuity: 'Unreal Tournament (1999) PC ladder; Damien, Rampage and Dominator are explicitly sourced from the PS2/Dreamcast Final Challenge only',
  adaptationRule: 'Spell UT99’s champion Malcom with one L. Competitors are cosmetic player avatars with a shared arena arsenal, not heroes with canon superpowers. Console-only Final Challenge bosses must remain labelled as a port adaptation.',
  visualAnchor: 'Industrial Liandri arenas, blue-red team lighting, chunky late-1990s combat armor and weapon pickups on glowing pads.',
  canonStatus: 'UT99 PC roster with disclosed console-port boss sequence',
  fr: 'Malcom, Brock et Lauren gravissent une échelle du Grand Tournoi où les combattants partagent le même arsenal Liandri avant la finale contre Xan.',
  en: 'Malcom, Brock and Lauren climb the Grand Tournament ladder, where competitors share the same Liandri arsenal before the final against Xan.',
  referenceUrls: [UNREAL_TOURNAMENT.url, 'https://device.report/m/888837c9efe43e5436728fd6cae4a7b1f06dfac401acb46e8064871338c90b20.pdf', 'https://unrealarchive.org/wikis/the-liandri-archives/Thunder_Crash.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Iron_Guard.html', 'https://unrealarchive.org/wikis/the-liandri-archives/The_Corrupt.html', 'https://unreal.fandom.com/wiki/Unreal_Tournament/Character_Cards'],
  characters: [
    { id: 'malcom', name: 'Malcom', role: 'marine', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Malcom in bulky blue-gray Thunder Crash armor, dark skin, close-cropped hair and no later-game costume additions.', fr: 'Malcom est le combattant de Thunder Crash présenté sous cette orthographe dans UT99.', en: 'Malcom is the Thunder Crash fighter presented with this spelling in UT99.', canonStatus: 'canon UT99 selectable competitor', team: 'Thunder Crash', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' },
    { id: 'brock', name: 'Brock', role: 'marine', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Brock in heavy Iron Guard combat armor with broad shoulder plates and late-1990s arena silhouette.', fr: 'Brock participe au tournoi au sein d’Iron Guard.', en: 'Brock competes in the tournament as part of Iron Guard.', canonStatus: 'canon UT99 selectable competitor', team: 'Iron Guard', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' },
    { id: 'lauren', name: 'Lauren', role: 'tactical', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Lauren in streamlined Iron Guard arena armor, tied-back hair and the same grounded late-1990s equipment language as Brock.', fr: 'Lauren est une compétitrice d’Iron Guard utilisant les mêmes armes ramassées que les autres joueurs.', en: 'Lauren is an Iron Guard competitor using the same pickups as every other player.', canonStatus: 'canon UT99 selectable competitor', team: 'Iron Guard', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' }
  ],
  monsters: [
    { id: 'vector', name: 'Vector', weapon: 'Shared Tournament Arsenal', special: 'Corrupt aim routine', visualAnchor: 'Vector as a sleek metallic The Corrupt combat android with glowing face panel and UT99 armor geometry.', fr: 'Vector est un combattant cybernétique de The Corrupt.', en: 'Vector is a cybernetic competitor from The Corrupt.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' },
    { id: 'cathode', name: 'Cathode', weapon: 'Shared Tournament Arsenal', special: 'Synchronized android dodge', visualAnchor: 'Cathode as a feminine-profile The Corrupt android with polished segmented plates and narrow luminous visor.', fr: 'Cathode appartient à l’équipe cybernétique The Corrupt.', en: 'Cathode belongs to the cybernetic team The Corrupt.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' },
    { id: 'matrix', name: 'Matrix', weapon: 'Shared Tournament Arsenal', special: 'Machine crossfire', visualAnchor: 'Matrix as a heavy The Corrupt android with angular silver-black plating and glowing optic strip.', fr: 'Matrix complète la ligne d’adversaires de The Corrupt.', en: 'Matrix completes the line of The Corrupt opponents.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' }
  ],
  bosses: [
    { id: 'damien', name: 'Damien', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge pressure', visualAnchor: 'Console-port arena competitor card translated into an original full-body UT99-style armored fighter.', fr: 'Damien appartient à la séquence Final Challenge des versions console.', en: 'Damien belongs to the console versions’ Final Challenge sequence.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only' },
    { id: 'rampage', name: 'Rampage', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge assault', visualAnchor: 'Console-port War Machine leader rendered as a heavy combat robot with angular plated frame and late-1990s arena weapon mounts.', fr: 'Rampage est le robot chef de War Machine dans la Final Challenge des portages console.', en: 'Rampage is the robot leader of War Machine in the console ports’ Final Challenge.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only', species: 'robot', team: 'War Machine' },
    { id: 'dominator', name: 'Dominator', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge domination route', visualAnchor: 'Pure-blood Skaarj console challenger with digitigrade alien posture, angular head crest and tournament armor, no invented supernatural effects.', fr: 'Dominator est le Skaarj pur-sang qui clôt la sous-séquence console avant la véritable finale.', en: 'Dominator is the pure-blood Skaarj closing the console-only sub-sequence before the true final.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only', species: 'Skaarj' }
  ],
  worldBoss: { id: 'xan', name: 'Xan Kriegor', weapon: 'Shared Tournament Arsenal', special: 'HyperBlast championship duel', visualAnchor: 'Xan’s imposing gold-and-black cybernetic champion armor, narrow glowing face and HyperBlast starship arena backdrop.', fr: 'Xan est le champion final du ladder original sur HyperBlast.', en: 'Xan is the original ladder’s final champion on HyperBlast.', canonStatus: 'canon UT99 final champion', entityType: 'tournament-finalist', uniqueAbility: false, objective: 'Defeat Xan under standard tournament rules using the shared arsenal.' },
  stage: { name: 'Deck16][ — arène Liandri', visualAnchor: 'Multi-level industrial Deck16][ arena with ramps, toxic channels, weapon pads and blue-orange utility light.', fr: 'Le ladder commence dans une arène Liandri où le contrôle des armes et des hauteurs prime.', en: 'The ladder begins in a Liandri arena where controlling pickups and high ground is decisive.' },
  stageVariants: [
    stageVariant('Tactics', 'Final Challenge — portages console', 'Expert', 'Dominator', { continuityScope: 'PS2/Dreamcast only', objective: 'Complete the disclosed console-only three-opponent sequence.' }),
    stageVariant('Smash', 'HyperBlast — finale contre Xan', 'Expert', 'Xan Kriegor', { objective: 'Win the championship duel under standard tournament rules.' })
  ],
  gear: [
    { id: 'shock_rifle', enName: 'Shock Rifle', frName: 'Fusil Shock', boost: { atk: 8, spd: 1 }, visualAnchor: 'UT99 angular blue-gray Shock Rifle with glowing energy core, recreated without UI logos.', fr: 'Une arme ramassable partagée de l’arène.', en: 'A shared arena weapon pickup.' },
    { id: 'flak_cannon', enName: 'Flak Cannon', frName: 'Canon Flak', boost: { def: 6, hp: 45 }, visualAnchor: 'Bulky industrial UT99 Flak Cannon with cylindrical chamber and hazard-yellow detail.', fr: 'Le canon projette des éclats à courte portée.', en: 'The cannon projects fragments at short range.' },
    { id: 'redeemer', enName: 'Redeemer', frName: 'Redeemer', boost: { hp: 50, atk: 6 }, visualAnchor: 'Large UT99 tactical missile launcher pickup with heavy tube and compact guidance screen.', fr: 'L’arme rare de l’arène, jamais un pouvoir personnel.', en: 'The arena’s rare weapon, never a personal power.' }
  ],
  event: { id: 'liandri_countdown', enName: 'Liandri Match Countdown', frName: 'Compte à rebours Liandri', en: 'The match reset restores shared pickups and scores the next elimination under tournament rules.', fr: 'La remise à zéro restaure les armes communes et comptabilise la prochaine élimination selon les règles du tournoi.', visualAnchor: 'Arena lights switch from neutral to blue-red as pickup pads activate; no logos or HUD text.' }
});

const unreal1998 = definePack(UNREAL_1998, {
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
});

const ZOOTOPIA = Object.freeze({
  key: 'zootopia',
  universe: 'Zootopia',
  url: 'https://movies.disney.com/zootopia'
});

const FURY_ROAD = Object.freeze({
  key: 'mad_max_fury_road',
  universe: 'Mad Max: Fury Road',
  url: 'https://www.warnerbros.it/scheda-film/genere-avventura/mad-max-fury-road/'
});

const zootopia = definePack(ZOOTOPIA, {
  aliases: ['Zootopie', 'Zootropolis'],
  mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#266b86', '#071217', '#f2a73a'], motif: 'city',
  theme: 'ZPD investigation into the Night Howler conspiracy in the 2016 film',
  continuity: 'Zootopia (2016) first film only',
  adaptationRule: 'Never classify an animal species as inherently hostile. Savage predators are poisoned victims who must be cured. Manchas and Mr. Big are nonlethal story encounters, and Bellwether is exposed, recorded and arrested rather than killed.',
  visualAnchor: 'Multi-scale mammal metropolis with Savanna Central glass towers, tiny rodent infrastructure, climate districts and ZPD blue-orange lighting.',
  canonStatus: '2016 film canon with investigation and nonlethal encounter rules',
  fr: 'Judy, Nick et Bogo suivent la piste des Hurleurs nocturnes jusqu’au complot de Bellwether sans transformer les prédateurs victimes en ennemis par nature.',
  en: 'Judy, Nick and Bogo trace the Night Howlers to Bellwether’s conspiracy without treating poisoned predator victims as natural enemies.',
  referenceUrls: [ZOOTOPIA.url, 'https://www.disney.co.jp/fc/zootopia/character/bellwether', 'https://assets.scriptslug.com/live/pdf/scripts/zootopia-2016.pdf'],
  characters: [
    { id: 'judy_hopps', runtimeId: 'judy_hopps', name: 'Judy Hopps', role: 'tactical', weapon: 'Recovered Night Howler dart launcher loaded with antidote', weaponType: 'gun', simple: 'Antidote dart', secondary: 'Carrot recorder feint', defense: 'Rabbit footwork', special: 'Case breakthrough', visualAnchor: 'Small gray rabbit in a fitted blue ZPD patrol uniform, utility belt and long upright ears; original fan-made proportions.', fr: 'Première lapine policière du ZPD, Judy mène l’enquête avec détermination ; le lanceur récupéré sert uniquement à administrer l’antidote.', en: 'The ZPD’s first rabbit officer, Judy drives the investigation; the recovered launcher is used only to deliver antidote.', canonStatus: 'canon protagonist with disclosed nonlethal rescue-tool adaptation', equipmentSource: 'Recovered from Bellwether’s Night Howler conspiracy, not ZPD issue.' },
    { id: 'nick_wilde', runtimeId: 'nick_wilde', name: 'Nick Wilde', role: 'hacker', weapon: 'Investigation ruse', weaponType: 'focus', simple: 'Streetwise distraction', secondary: 'Pawpsicle hustle', defense: 'Fox sidestep', special: 'Recorded confession setup', visualAnchor: 'Slim red fox in light green short-sleeve shirt, striped tie and tan trousers, expressive ears and tail.', fr: 'Nick met ses combines et sa lecture de la ville au service de l’enquête.', en: 'Nick puts his hustles and knowledge of the city to work for the case.' },
    { id: 'chief_bogo', runtimeId: 'chief_bogo', name: 'Chief Bogo', role: 'marine', weapon: 'ZPD command', weaponType: 'focus', simple: 'Commanding push', secondary: 'ZPD backup', defense: 'Buffalo brace', special: 'Precinct lockdown', visualAnchor: 'Massive Cape buffalo in dark blue ZPD command uniform with gold insignia, broad horns and stern posture.', fr: 'Le chef du ZPD engage les moyens de la police lorsque les preuves sont établies.', en: 'The ZPD chief commits police resources once the evidence is established.' }
  ],
  monsters: [
    { id: 'duke_weaselton', name: 'Duke Weaselton', weapon: 'Stolen goods bag', special: 'Little Rodentia escape', visualAnchor: 'Small brown weasel in a red sleeveless top carrying a stolen-goods sack, scaled correctly against city props.', fr: 'Le voleur à la petite semaine fuit Judy à travers Little Rodentia.', en: 'The petty thief flees Judy through Little Rodentia.', canonStatus: 'canon suspect; arrest objective', entityType: 'nonlethal-suspect', nonCombat: true, objective: 'Catch and arrest Duke without harming bystanders.', objectiveFr: 'Rattraper et arrêter Duke sans blesser les passants.' },
    { id: 'woolter', name: 'Woolter', weapon: 'Ram tackle', special: 'Bellwether ram-cop formation', visualAnchor: 'Black-wool ram in a white T-shirt, bright red suspenders and blue jeans, with curled horns and compact build.', fr: 'Woolter est l’un des béliers impliqués dans le complot de Bellwether.', en: 'Woolter is one of the rams involved in Bellwether’s conspiracy.', canonStatus: 'canon conspirator; nonlethal arrest target', entityType: 'conspirator' },
    { id: 'jesse', name: 'Jesse', weapon: 'Ram tackle', special: 'Evidence-room blockade', visualAnchor: 'Gray-wool one-eyed ram with an eye patch, green T-shirt and blue jeans, distinct from Woolter.', fr: 'Jesse protège les opérations clandestines liées aux Hurleurs nocturnes.', en: 'Jesse protects the clandestine Night Howler operation.', canonStatus: 'canon conspirator; nonlethal arrest target', entityType: 'conspirator' }
  ],
  bosses: [
    { id: 'manchas', name: 'Renato Manchas', weapon: 'Night Howler frenzy', special: 'Rainforest District chase', visualAnchor: 'Large black jaguar in torn chauffeur clothes, eyes and posture showing drug-induced distress rather than villainy.', fr: 'Manchas est une victime empoisonnée ; il faut lui administrer l’antidote, pas le tuer.', en: 'Manchas is a poisoned victim; the objective is to administer the antidote, not kill him.', canonStatus: 'canon poisoned victim and rescue encounter', entityType: 'rescue-target', nonCombat: true, objective: 'Cure Manchas with a Night Howler antidote dart.', objectiveFr: 'Soigner Manchas avec une fléchette d’antidote au Hurleur nocturne.', victoryCondition: 'cure' },
    { id: 'mr_big', name: 'Mr. Big', weapon: 'Tundratown authority', special: 'Icing threat', visualAnchor: 'Tiny arctic shrew in formal black suit seated at an oversized desk, flanked only by environmental polar-bear silhouettes.', fr: 'Mr. Big menace d’abord Judy et Nick puis leur fournit une piste ; la victoire est une négociation.', en: 'Mr. Big initially threatens Judy and Nick, then supplies a lead; victory is negotiation.', canonStatus: 'canon initial threat and later ally', entityType: 'dialogue-trial', nonCombat: true, objective: 'Earn Mr. Big’s trust and obtain the Manchas lead.', objectiveFr: 'Gagner la confiance de Mr. Big puis obtenir la piste menant à Manchas.', victoryCondition: 'negotiate' },
    { id: 'doug', name: 'Doug', weapon: 'Night Howler dart rifle', special: 'Subway lab ambush', visualAnchor: 'Ram chemist in yellow protective coveralls and respirator beside blue Night Howler serum canisters.', fr: 'Doug fabrique et tire les doses de Hurleur nocturne depuis le laboratoire du métro.', en: 'Doug manufactures and fires Night Howler doses from the subway lab.', canonStatus: 'canon conspirator; arrest target', entityType: 'chemist-shooter', objective: 'Secure the serum evidence and arrest Doug.' }
  ],
  worldBoss: { id: 'bellwether', name: 'Mayor Dawn Bellwether', weapon: 'Fear campaign', special: 'Night Howler conspiracy', visualAnchor: 'Small cream-wool sheep in a blue business suit framed by museum displays, a dart case and the carrot recorder evidence.', fr: 'Bellwether est vaincue lorsque son complot et ses aveux sont enregistrés puis remis au ZPD.', en: 'Bellwether is defeated when her conspiracy and confession are recorded and delivered to the ZPD.', canonStatus: 'canon principal antagonist; expose-and-arrest finale', entityType: 'investigation-world-boss', nonCombat: true, objective: 'Bait Bellwether into confessing, record the evidence and arrest her.', objectiveFr: 'Pousser Bellwether à avouer, enregistrer les preuves puis l’arrêter.', victoryCondition: 'expose-confession-and-arrest' },
  stage: { name: 'Cliffside Asylum — aile des disparus', visualAnchor: 'Abandoned cliffside hospital with barred observation cells, wet concrete, vines and evidence boards, no horror gore.', fr: 'Judy et Nick découvrent les prédateurs disparus enfermés à Cliffside.', en: 'Judy and Nick discover the missing predators confined at Cliffside.' },
  stageVariants: [
    stageVariant('RPG', 'Tundratown — manoir de Mr. Big', 'Hard', 'Mr. Big', { objective: 'Negotiate for the Manchas lead; violence fails the scene.' }),
    stageVariant('Tactics', 'Musée d’histoire naturelle — aveux', 'Very Hard', 'Mayor Dawn Bellwether', { objective: 'Record Bellwether’s confession and complete a nonlethal arrest.' })
  ],
  gear: [
    { id: 'carrot_recorder', enName: 'Carrot Recorder Pen', frName: 'Stylo-carotte enregistreur', boost: { atk: 6, spd: 2 }, visualAnchor: 'Orange carrot-shaped pen with green clip and tiny recorder grille.', fr: 'Le stylo de Judy enregistre la confession décisive.', en: 'Judy’s pen captures the decisive confession.' },
    { id: 'zpd_badge', enName: 'ZPD Badge', frName: 'Insigne du ZPD', boost: { def: 6, hp: 45 }, visualAnchor: 'Small gold shield-shaped police badge with original unreadable markings rather than copied logo text.', fr: 'L’insigne matérialise l’autorité policière et ses responsabilités.', en: 'The badge represents police authority and its responsibilities.' },
    { id: 'night_howler_antidote', enName: 'Night Howler Antidote', frName: 'Antidote aux Hurleurs nocturnes', boost: { hp: 70 }, visualAnchor: 'Blue antidote vial and nonlethal dart in a sealed evidence pouch.', fr: 'L’antidote permet de sauver les victimes empoisonnées.', en: 'The antidote saves poisoned victims.' }
  ],
  event: { id: 'case_breakthrough', enName: 'Night Howler Case Breakthrough', frName: 'Percée dans l’affaire des Hurleurs nocturnes', en: 'Evidence links the serum, Doug’s lab and Bellwether, converting every victim encounter into a rescue objective.', fr: 'Les preuves relient le sérum, le laboratoire de Doug et Bellwether, transformant chaque rencontre de victime en mission de sauvetage.', visualAnchor: 'ZPD evidence board linking blue serum vials, subway route and a carrot recorder without readable copyrighted text.' }
});

const furyRoad = definePack(FURY_ROAD, {
  aliases: ['Mad Max Fury Road'],
  mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Expert',
  colors: ['#c1602d', '#211108', '#f1c15c'], motif: 'desertconvoy',
  theme: 'War Rig escape, desert pursuit and return to the Citadel',
  continuity: 'Mad Max: Fury Road (2015) film and official DC prelude',
  adaptationRule: 'Follow the film’s convoy chronology and Nux’s redemption. Keep vehicles and wasteland silhouettes recognisable but use original fan-made art without actor likeness or copied official assets.',
  visualAnchor: 'Orange Namib desert, cyan storm shadows, practical scrap vehicles, War Rig tanker silhouette and vertical Citadel cliffs.',
  canonStatus: '2015 film canon with original fan-made visual adaptation',
  fr: 'Max, Furiosa et Nux brisent la poursuite d’Immortan Joe puis ramènent les épouses et les graines vers la Citadelle.',
  en: 'Max, Furiosa and Nux break Immortan Joe’s pursuit, then return the wives and seeds to the Citadel.',
  referenceUrls: [FURY_ROAD.url, 'https://www.dc.com/comics/mad-max-fury-road-2015/mad-max-fury-road-nux-and-immortan-joe-1', 'https://assets.scriptslug.com/live/pdf/scripts/mad-max-fury-road-2015.pdf'],
  characters: [
    { id: 'max', runtimeId: 'max_rockatansky_fr', name: 'Max Rockatansky', role: 'slayer', weapon: 'Sawed-off shotgun', weaponType: 'gun', simple: 'Close shotgun blast', secondary: 'Chain disarm', defense: 'Road-warrior roll', special: 'Convoy counterattack', visualAnchor: 'Weathered road warrior in dusty leather jacket, neck brace remnants and practical desert gear; no actor likeness.', fr: 'Max passe de captif solitaire à partenaire essentiel de l’évasion.', en: 'Max changes from solitary captive to an essential partner in the escape.' },
    { id: 'furiosa', runtimeId: 'furiosa_fr', name: 'Imperator Furiosa', role: 'tactical', weapon: 'SKS rifle', weaponType: 'gun', simple: 'Controlled rifle shot', secondary: 'Prosthetic-arm strike', defense: 'War Rig cover', special: 'Imperator convoy maneuver', visualAnchor: 'Furiosa with shaved head silhouette, dark forehead paint, white wrap top, mechanical left arm and utility trousers; no actor likeness.', fr: 'Furiosa conduit le War Rig et organise la libération des épouses.', en: 'Furiosa drives the War Rig and organizes the wives’ liberation.' },
    { id: 'nux', runtimeId: 'nux_fr', name: 'Nux', role: 'marine', weapon: 'War Boy car spear', weaponType: 'blade', simple: 'Vehicle spear jab', secondary: 'Engine boost', defense: 'Repentant guard', special: 'Witness Me redemption', visualAnchor: 'Pale War Boy with scarification, cargo trousers and engine grease, later protecting the escapees; no actor likeness.', fr: 'Nux renonce à la gloire d’Immortan Joe et se sacrifie pour le groupe.', en: 'Nux rejects Immortan Joe’s promised glory and sacrifices himself for the group.', canonStatus: 'canon redeemed War Boy hero' }
  ],
  monsters: [
    { id: 'war_boy', name: 'War Boy', weapon: 'Thunder stick', special: 'Vehicle boarding leap', visualAnchor: 'Pale Citadel War Boy with white body paint, goggles and explosive thunder stick on a scrap vehicle.', fr: 'Un fanatique motorisé de la Citadelle.', en: 'A motorized Citadel zealot.' },
    { id: 'polecat', name: 'Polecat', weapon: 'Swinging pole', special: 'Convoy pendulum assault', visualAnchor: 'War Boy suspended atop a long flexing pole over the convoy with desert goggles and hooked weapon.', fr: 'Le Polecat attaque depuis une longue perche articulée.', en: 'The Polecat attacks from a long articulated pole.' },
    { id: 'rock_rider', name: 'Rock Rider', weapon: 'Motorcycle spear', special: 'Canyon bike swarm', visualAnchor: 'Masked canyon biker on a stripped dirt motorcycle carrying a long explosive spear.', fr: 'Les Rock Riders harcèlent le War Rig dans le canyon.', en: 'Rock Riders harry the War Rig through the canyon.' }
  ],
  bosses: [
    { id: 'rictus', name: 'Rictus Erectus', weapon: 'Raw strength', special: 'War Rig engine tear', visualAnchor: 'Immense Citadel enforcer with breathing harness, bare muscular torso and heavy utility gear; no actor likeness.', fr: 'Rictus poursuit le War Rig par la force brute.', en: 'Rictus pursues the War Rig through brute force.' },
    { id: 'bullet_farmer', name: 'The Bullet Farmer', weapon: 'Twin machine guns', special: 'Blind marsh barrage', visualAnchor: 'Wasteland arms baron in ammunition-covered coat and headgear firing from a tracked vehicle; no actor likeness.', fr: 'Le Bullet Farmer couvre le marais d’un tir aveugle.', en: 'The Bullet Farmer fills the marsh with blind gunfire.' },
    { id: 'people_eater', name: 'The People Eater', weapon: 'Gaston limousine guns', special: 'Fuel convoy squeeze', visualAnchor: 'Corpulent wasteland baron in formal scrap attire aboard the ornate Gastown limousine; no actor likeness.', fr: 'Le People Eater engage les ressources de Gastown dans la poursuite.', en: 'The People Eater commits Gastown’s resources to the pursuit.' }
  ],
  worldBoss: { id: 'immortan_joe', name: 'Immortan Joe', weapon: 'Gigahorse pursuit', special: 'Citadel war party', visualAnchor: 'Masked Citadel ruler in transparent chest armor aboard the twin-V8 Gigahorse, white-clad war convoy behind him; no actor likeness.', fr: 'Immortan Joe mène personnellement la poursuite finale avant la reconquête de la Citadelle.', en: 'Immortan Joe personally leads the final pursuit before the Citadel is reclaimed.', canonStatus: 'canon principal antagonist', entityType: 'convoy-world-boss', objective: 'Disable the Gigahorse, protect the War Rig and open the return road to the Citadel.' },
  stage: { name: 'War Rig — poursuite dans le désert', visualAnchor: 'Armored tanker crossing orange desert at speed, practical scrap convoy, dust plumes and cyan horizon.', fr: 'Le War Rig doit maintenir sa vitesse tout en repoussant les véhicules de la Citadelle.', en: 'The War Rig must keep moving while repelling the Citadel convoy.' },
  stageVariants: [
    stageVariant('Tactics', 'Marais du Bullet Farmer', 'Very Hard', 'The Bullet Farmer', { objective: 'Extinguish the lights and cross the mud under blind fire.' }),
    stageVariant('Smash', 'Retour à la Citadelle — Gigahorse', 'Expert', 'Immortan Joe', { objective: 'Board the Gigahorse and reopen the Citadel route.' })
  ],
  gear: [
    { id: 'furiosa_prosthesis', enName: 'Furiosa’s Prosthetic Arm', frName: 'Bras mécanique de Furiosa', boost: { atk: 8, spd: 1 }, visualAnchor: 'Practical cable-and-metal left-arm prosthesis with articulated fingers and leather harness.', fr: 'Le bras mécanique fonctionnel de l’Imperator.', en: 'The Imperator’s functional mechanical arm.' },
    { id: 'green_place_seeds', enName: 'Green Place Seeds', frName: 'Graines du Green Place', boost: { def: 6, hp: 45 }, visualAnchor: 'Small cloth satchel of carefully preserved seeds, dusty but intact.', fr: 'Les graines préservées portent l’espoir d’un avenir différent.', en: 'The preserved seeds carry hope for a different future.' },
    { id: 'war_rig_engine', enName: 'War Rig Engine Relay', frName: 'Relais moteur du War Rig', boost: { hp: 60, atk: 4 }, visualAnchor: 'Grease-covered mechanical relay and braided cable from the practical tanker engine bay.', fr: 'Une pièce vitale pour maintenir le War Rig en mouvement.', en: 'A vital component that keeps the War Rig moving.' }
  ],
  event: { id: 'turn_the_rig', enName: 'Turn the War Rig Around', frName: 'Faire demi-tour au War Rig', en: 'The convoy reverses course toward the undefended Citadel, turning pursuit into liberation.', fr: 'Le convoi repart vers la Citadelle sans défense, transformant la fuite en libération.', visualAnchor: 'War Rig carving a broad turn in the salt desert as the sunrise reveals the route back.' }
});

const PURGE = Object.freeze({
  key: 'the_purge_2013',
  universe: 'The Purge',
  url: 'https://www.universalpicturesathome.com/movies/the-purge'
});

const SAW = Object.freeze({
  key: 'saw',
  universe: 'Saw',
  url: 'https://www.lionsgate.com/movies/saw'
});

const thePurge = definePack(PURGE, {
  aliases: ['American Nightmare', 'American Nightmare (The Purge)', 'The Purge (2013)'],
  mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#1c2741', '#030406', '#d84d42'], motif: 'suburbanhouse',
  theme: 'the Sandin family’s twelve-hour siege in the first 2013 film',
  continuity: 'The Purge (2013) first film only; excludes later-film protagonists and television continuity',
  adaptationRule: 'Use only the 2013 Sandin-house continuity. The world boss is the legal and social event “Purge Night,” not an invented supervillain. Victory means protecting the family and surviving until the morning siren.',
  visualAnchor: 'Affluent suburban home under blue security light, reinforced shutters, masked intruders outside and blue Purge-support flowers used as an ominous social symbol.',
  canonStatus: '2013 first-film canon with systemic noncombat finale',
  fr: 'James, Mary et Zoey Sandin défendent leur famille pendant les douze heures où tout crime est légal, jusqu’à la sirène du matin.',
  en: 'James, Mary and Zoey Sandin protect their family through the twelve hours when all crime is legal, until the morning siren.',
  referenceUrls: [PURGE.url, 'https://assets.scriptslug.com/live/pdf/scripts/the-purge-2013.pdf', 'https://www.imdb.com/title/tt2184339/fullcredits/'],
  characters: [
    { id: 'james_sandin', name: 'James Sandin', role: 'tactical', weapon: 'Home security controls', weaponType: 'focus', simple: 'Shutter reroute', secondary: 'Defensive flashlight', defense: 'Family cover', special: 'Emergency security reset', visualAnchor: 'Affluent father in a dark home shirt and trousers using a compact security remote; no actor likeness.', fr: 'James a vendu les systèmes de sécurité du quartier et doit désormais protéger sa propre maison.', en: 'James sold the neighborhood’s security systems and now must protect his own home.' },
    { id: 'mary_sandin', name: 'Mary Sandin', role: 'horror', weapon: 'Household defense', weaponType: 'improvised', simple: 'Defensive strike', secondary: 'Hidden-route rescue', defense: 'Protect the children', special: 'Refuse the neighbors’ purge', visualAnchor: 'Mother in practical pale home clothes moving through dark corridors with a flashlight; no actor likeness.', fr: 'Mary maintient ses enfants en vie et refuse finalement la logique meurtrière des voisins.', en: 'Mary keeps her children alive and ultimately rejects the neighbors’ murderous logic.' },
    { id: 'zoey_sandin', name: 'Zoey Sandin', role: 'hacker', weapon: 'House intercom', weaponType: 'focus', simple: 'Intercom diversion', secondary: 'Camera blind spot', defense: 'Secret hiding place', special: 'Family route signal', visualAnchor: 'Teenage daughter in casual home clothes with a small intercom tablet, presented without actor likeness or sexualization.', fr: 'Zoey utilise sa connaissance des cachettes et des angles morts de la maison.', en: 'Zoey uses her knowledge of the house’s hiding places and blind spots.' }
  ],
  monsters: [
    { id: 'interrupting_freak_purger', name: 'Interrupting Freak Purger', weapon: 'Intruder weapon', special: 'Masked doorway rush', visualAnchor: 'Young masked intruder in formal prep-school-style clothing, mask based on the film’s unsettling smile without actor likeness.', fr: 'Un assaillant nommé ainsi au générique du premier film.', en: 'An attacker identified by this credit label in the first film.', canonStatus: 'canon 2013 credited Purger' },
    { id: 'blonde_female_freak_purger', name: 'Blonde Female Freak Purger', weapon: 'Intruder blade', special: 'Hallway ambush', visualAnchor: 'Female masked intruder in dark formal clothing and a fixed-smile Purger mask, no actor likeness.', fr: 'Une assaillante identifiée par son intitulé de générique.', en: 'An attacker identified by her credit label.', canonStatus: 'canon 2013 credited Purger' },
    { id: 'hostile_neighbors', name: 'Hostile Sandin Neighbors', weapon: 'Household weapons', special: 'False rescue', visualAnchor: 'Small suburban neighbor group in tidy evening clothes carrying blue-flower emblems, faces kept original and non-identical to actors.', fr: 'Les voisins menés par Grace Ferrin feignent le secours avant de retourner la violence contre les Sandin.', en: 'The neighbors led by Grace Ferrin pretend to rescue the Sandins before turning violence against them.', canonStatus: 'canon 2013 neighbor group', members: ['Mr. Cali', 'Mr. Halverson', 'Mr. Ferrin'] }
  ],
  bosses: [
    { id: 'henry', name: 'Henry', weapon: 'Handgun', special: 'Zoey bedroom confrontation', visualAnchor: 'Zoey’s older boyfriend in ordinary clothes with a concealed handgun, no actor likeness and no glamorized pose.', fr: 'Henry révèle son intention hostile à l’intérieur de la maison.', en: 'Henry reveals his hostile intent inside the house.', canonStatus: 'canon 2013 antagonist' },
    { id: 'grace_ferrin', name: 'Mrs. Grace Ferrin', weapon: 'Neighbor conspiracy', special: 'Jealousy-fueled betrayal', visualAnchor: 'Wealthy neighbor in neat suburban evening wear with blue flowers and a cold social smile; no actor likeness.', fr: 'Grace conduit les voisins jaloux contre la famille après le premier siège.', en: 'Grace leads the jealous neighbors against the family after the first siege.', canonStatus: 'canon 2013 secondary antagonist', entityType: 'social-antagonist' },
    { id: 'polite_leader', name: 'Polite Leader', weapon: 'Firearm and siege command', special: 'Security breach ultimatum', visualAnchor: 'Preppy young Purger in dark blazer with a smiling translucent mask carried or worn, no actor likeness.', fr: 'Le chef poli dirige le groupe masqué et impose son ultimatum aux Sandin.', en: 'The Polite Leader commands the masked group and delivers his ultimatum to the Sandins.', canonStatus: 'canon 2013 principal human attacker' }
  ],
  worldBoss: { id: 'purge_night', name: 'Purge Night — 12-Hour Siege', weapon: 'Systemic legal violence', special: 'Citywide countdown', visualAnchor: 'The Sandin house in blackout with security map, clock progression and distant emergency siren; represent an event, not a humanoid monster.', fr: 'La véritable épreuve finale est de garder la famille en vie jusqu’à la fin légale de la Purge.', en: 'The true final trial is keeping the family alive until the Purge legally ends.', canonStatus: 'canon systemic event; explicitly noncombat world objective', entityType: 'systemic-survival-event', nonCombat: true, objective: 'Protect the Sandin family and survive until the 7:00 a.m. siren.', objectiveFr: 'Protéger la famille Sandin et survivre jusqu’à la sirène de 7 h.', victoryCondition: 'survive-until-morning', spritePrompt: 'Original fan-made pixel-art objective sheet: fortified suburban house through four night-to-dawn states, security shutters and clock lighting only. No person, logo, text, gore or actor likeness.' },
  stage: { name: 'Maison Sandin — système verrouillé', visualAnchor: 'Dark modern suburban interior, reinforced metal shutters, blue security monitors and hidden passages.', fr: 'La maison sécurisée devient un labyrinthe lorsque les intrus percent le périmètre.', en: 'The secured home becomes a maze when intruders breach the perimeter.' },
  stageVariants: [
    stageVariant('RPG', 'Sous-sol et passages de sécurité', 'Very Hard', 'Polite Leader', { objective: 'Move the family between safe rooms and prevent a full breach.' }),
    stageVariant('Tactics', 'Compte à rebours jusqu’à la sirène', 'Expert', 'Purge Night — 12-Hour Siege', { objective: 'Survive and protect every family member until 7:00 a.m.', nonCombat: true })
  ],
  gear: [
    { id: 'security_remote', enName: 'Sandin Security Remote', frName: 'Télécommande de sécurité Sandin', boost: { atk: 5, spd: 2 }, visualAnchor: 'Compact house-security remote with shutter diagram and original unreadable interface.', fr: 'La télécommande contrôle les volets et les zones sûres.', en: 'The remote controls shutters and safe zones.' },
    { id: 'reinforced_shutter', enName: 'Reinforced Security Shutter', frName: 'Volet de sécurité renforcé', boost: { def: 8, hp: 50 }, visualAnchor: 'Ribbed steel home shutter with visible locking bolts and damaged hinge.', fr: 'Une barrière temporaire, pas une garantie absolue.', en: 'A temporary barrier, not an absolute guarantee.' },
    { id: 'morning_siren', enName: 'Morning Siren Timer', frName: 'Minuteur de la sirène du matin', boost: { hp: 75 }, visualAnchor: 'Simple emergency timer shifting from dark blue to dawn amber, no copied UI text.', fr: 'Le compte à rebours qui définit la condition de victoire.', en: 'The countdown that defines the victory condition.' }
  ],
  event: { id: 'morning_ceasefire', enName: 'Morning Ceasefire', frName: 'Cessez-le-feu du matin', en: 'The legal window closes, the siren sounds and every remaining attacker must stand down.', fr: 'La fenêtre légale se ferme, la sirène retentit et tous les assaillants restants doivent cesser le combat.', visualAnchor: 'Cold blue house lighting turning to sunrise amber as reinforced shutters unlock.' }
});

const saw = definePack(SAW, {
  aliases: ['Saw franchise'],
  mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#243027', '#030504', '#9b382e'], motif: 'traproom',
  theme: 'moral tests, clues and escape mechanisms across the Saw film series',
  continuity: 'Saw film series; playable trio anchored in Saw (2004), later apprentices explicitly labelled by film arc',
  adaptationRule: 'Traps are environmental puzzle objectives, never collectible monsters. Billy is only John Kramer’s messenger prop. John/Jigsaw is a noncombat test controller: victory is interpreting rules, disarming mechanisms and rescuing captives, never reducing him to a melee boss.',
  visualAnchor: 'Decayed industrial rooms, sickly green practical light, analog tape machines, red-black mechanical puzzle parts and restrained non-gory framing.',
  canonStatus: 'film-series canon with puzzle-first, noncombat Jigsaw policy',
  fr: 'Adam, le docteur Gordon et l’inspecteur Tapp résolvent les règles des tests tandis que les apprentis de Jigsaw détournent son héritage.',
  en: 'Adam, Dr. Gordon and Detective Tapp solve the tests’ rules while Jigsaw’s apprentices distort his legacy.',
  referenceUrls: [SAW.url, 'https://www.lionsgate.com/franchises/saw', 'https://catalog.afi.com/Film/63212-SAW', 'https://shop.lionsgate.com/products/saw-vi-br'],
  characters: [
    { id: 'adam', runtimeId: 'adam_stanheight', name: 'Adam Stanheight', role: 'horror', weapon: 'Camera flash', weaponType: 'focus', simple: 'Flash distraction', secondary: 'Clue photograph', defense: 'Bathroom cover', special: 'Reconstruct the room', visualAnchor: 'Young photographer in damp dark shirt with small analog camera and shoulder bag, no actor likeness and no gore.', fr: 'Adam se réveille enchaîné dans la salle de bains avec son appareil et des indices incomplets.', en: 'Adam wakes chained in the bathroom with his camera and incomplete clues.' },
    { id: 'lawrence_gordon', runtimeId: 'lawrence_gordon', name: 'Dr. Lawrence Gordon', role: 'tactical', weapon: 'Medical reasoning', weaponType: 'focus', simple: 'Clinical assessment', secondary: 'Timed clue order', defense: 'Emergency first aid', special: 'Test solution', visualAnchor: 'Middle-aged doctor in rumpled pale shirt with medical penlight and restrained distressed posture, no actor likeness or injury detail.', fr: 'Le docteur Gordon analyse les règles du piège tout en cherchant à sauver sa famille.', en: 'Dr. Gordon analyzes the trap’s rules while trying to save his family.' },
    { id: 'david_tapp', runtimeId: 'detective_tapp', name: 'Detective David Tapp', role: 'marine', weapon: 'Detective sidearm', weaponType: 'gun', simple: 'Covering shot', secondary: 'Case-board lead', defense: 'Police cover', special: 'Jigsaw trail', visualAnchor: 'Obsessive detective in dark coat carrying a flashlight and holstered sidearm, no actor likeness.', fr: 'Tapp poursuit obstinément Jigsaw et relie les lieux de ses tests.', en: 'Tapp obsessively pursues Jigsaw and connects the locations of his tests.' }
  ],
  monsters: [
    { id: 'zep_hindle', name: 'Zep Hindle', weapon: 'Revolver', special: 'Poisoned hostage order', visualAnchor: 'Hospital orderly in dark practical clothes holding a cassette recorder and weapon, no actor likeness or gore.', fr: 'Zep agit sous la contrainte d’un poison et des instructions de Jigsaw.', en: 'Zep acts under poison and Jigsaw’s instructions.', canonStatus: 'canon coerced victim-antagonist', coercionStatus: 'poisoned test subject' },
    { id: 'xavier_chavez', name: 'Xavier Chavez', weapon: 'Brute force', special: 'Nerve Gas House pursuit', visualAnchor: 'Large desperate test subject in worn sleeveless clothes inside a green-lit house, no actor likeness or injury detail.', fr: 'Xavier retourne la violence contre les autres victimes dans Saw II.', en: 'Xavier turns violence against the other victims in Saw II.', canonStatus: 'canon Saw II human antagonist' },
    { id: 'pig_masked_abductors', name: 'Pig-Masked Abductors', weapon: 'Sedative ambush', special: 'Test-subject capture', visualAnchor: 'Anonymous figure in black robe and coarse pig mask emerging from industrial shadow, no identity implied and no Billy tricycle.', fr: 'Les ravisseurs masqués capturent les sujets des tests ; ils ne sont pas Billy.', en: 'Pig-masked abductors capture test subjects; they are not Billy.', canonStatus: 'canon recurring abductor role', identityRule: 'Do not depict Billy the puppet as this enemy.' }
  ],
  bosses: [
    { id: 'amanda_young', name: 'Amanda Young', weapon: 'Rigged test mechanisms', special: 'Unwinnable trap sequence', visualAnchor: 'Jigsaw apprentice in dark layered clothes beside a mechanical control board, no actor likeness or gore.', fr: 'Amanda, survivante devenue apprentie, conçoit des tests truqués.', en: 'Amanda, a survivor turned apprentice, builds rigged tests.', canonStatus: 'canon apprentice antagonist' },
    { id: 'mark_hoffman', name: 'Detective Lt. Mark Hoffman', weapon: 'Police access and traps', special: 'Evidence-room reversal', visualAnchor: 'Police detective in dark suit with evidence keycard and concealed trap controls, no actor likeness.', fr: 'Hoffman exploite son accès policier pour poursuivre l’œuvre de Jigsaw.', en: 'Hoffman exploits police access to continue Jigsaw’s work.', canonStatus: 'canon apprentice antagonist' },
    { id: 'william_schenk', name: 'William Schenk / William Emmerson', weapon: 'Spiral traps', special: 'False-identity reveal', visualAnchor: 'Plainclothes detective silhouette with spiral evidence marker and compact tape player, no actor likeness.', fr: 'William Schenk, né Emmerson, agit dans la branche Spiral.', en: 'William Schenk, born Emmerson, acts within the Spiral branch.', canonStatus: 'canon Spiral copycat antagonist', continuityScope: 'Spiral (2021)' }
  ],
  worldBoss: { id: 'john_kramer', name: 'John Kramer / Jigsaw', weapon: 'Test rules and recordings', special: 'Final lesson reveal', visualAnchor: 'Terminally ill engineer represented at a worktable through notebooks, tape recorder and mechanical plans, no actor likeness, weapon pose or gore.', fr: 'John Kramer contrôle les tests par leurs règles et leurs révélations ; Billy n’est que son messager.', en: 'John Kramer controls tests through rules and revelations; Billy is only his messenger.', canonStatus: 'canon central test controller; explicitly noncombat', entityType: 'narrative-test-controller', nonCombat: true, objective: 'Interpret every rule, disarm the mechanisms and rescue the captives.', objectiveFr: 'Interpréter chaque règle, désamorcer les mécanismes puis sauver les captifs.', victoryCondition: 'solve-disarm-rescue', messenger: 'Billy the Puppet', spritePrompt: 'Original fan-made pixel-art narrative objective sheet: worktable, tape recorder, engineering notes and four clue-reveal states. No combat pose, gore, text, logo, actor likeness or Billy as the boss.' },
  stage: { name: 'Salle de bains industrielle — premier test', visualAnchor: 'Dilapidated tiled bathroom, two distant chain points, analog tape clues and green-gray light, framed without bodies or gore.', fr: 'Adam et Gordon doivent comprendre les règles de la salle avant l’expiration du délai.', en: 'Adam and Gordon must understand the room’s rules before time expires.' },
  stageVariants: [
    stageVariant('RPG', 'Entrepôt de Jigsaw — mécanismes', 'Expert', 'Amanda Young', { objective: 'Find and disable the rigged mechanisms; traps are stage hazards, not enemies.' }),
    stageVariant('Tactics', 'Réseau des tests — leçon finale', 'Expert', 'John Kramer / Jigsaw', { objective: 'Solve, disarm and rescue; attacking John fails the encounter.', nonCombat: true })
  ],
  gear: [
    { id: 'tape_recorder', enName: 'Jigsaw Tape Recorder', frName: 'Magnétophone de Jigsaw', boost: { atk: 5, spd: 2 }, visualAnchor: 'Small worn analog microcassette recorder with play button and no readable label.', fr: 'Les enregistrements énoncent les règles des tests.', en: 'Recordings state each test’s rules.' },
    { id: 'hacksaw', enName: 'Bathroom Hacksaw', frName: 'Scie de la salle de bains', boost: { def: 6, hp: 45 }, visualAnchor: 'Plain worn hand saw presented as an escape clue, clean and without injury context.', fr: 'Un outil ambigu du premier test, représenté sans violence graphique.', en: 'An ambiguous tool from the first test, shown without graphic violence.' },
    { id: 'hidden_key', enName: 'Hidden Test Key', frName: 'Clé cachée du test', boost: { hp: 75 }, visualAnchor: 'Small brass key inside a clear evidence envelope with a simple clue tag lacking readable text.', fr: 'La clé récompense l’observation attentive des indices.', en: 'The key rewards careful observation of clues.' }
  ],
  event: { id: 'follow_the_rules', enName: 'Follow the Test Rules', frName: 'Suivre les règles du test', en: 'The recording is replayed, revealing a literal instruction that disables the next mechanism and opens a rescue route.', fr: 'L’enregistrement est réécouté et révèle une instruction littérale qui neutralise le mécanisme suivant et ouvre une voie de sauvetage.', visualAnchor: 'Tape waveform, mechanical timer and three highlighted safety catches with no readable text or gore.' }
});

const PUPPET_MASTER = Object.freeze({
  key: 'puppet_master',
  universe: 'Puppet Master',
  url: 'https://www.fullmoonfeatures.com/puppet-master-series'
});

const SCREAMERS = Object.freeze({
  key: 'planete_hurlante',
  universe: 'Planete Hurlante',
  url: 'https://catalog.afi.com/Film/60564-SCREAMERS'
});

const puppetMaster = definePack(PUPPET_MASTER, {
  aliases: ['Puppetmaster'],
  mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#32231d', '#070403', '#b64938'], motif: 'puppetworkshop',
  theme: 'Full Moon’s Toulon puppet continuity and battles against supernatural or human controllers',
  continuity: 'Puppet Master film series; individual threats labelled by their film arc',
  adaptationRule: 'Blade, Pinhead and Six Shooter are Toulon puppets at their precise puppet scale, not generic killer dolls. Preserve their differing tools and shifting heroic allegiance. Sutekh/Sutec is the supernatural world threat.',
  visualAnchor: 'Bodega Bay Inn corridors and Toulon workshop at puppet scale, dark wood, brass mechanisms, stop-motion framing and small practical props.',
  canonStatus: 'Full Moon film-series roster with film-specific threat labels',
  fr: 'Blade, Pinhead et Six Shooter défendent l’héritage de Toulon contre les totems de Sutekh et ceux qui cherchent à détourner son secret d’animation.',
  en: 'Blade, Pinhead and Six Shooter defend Toulon’s legacy against Sutekh’s Totems and people seeking to exploit his animation secret.',
  referenceUrls: [PUPPET_MASTER.url, 'https://www.fullmoonfeatures.com/videos/puppet-master-4', 'https://www.fullmoonfeatures.com/videos/puppet-master-5', 'https://www.fullmoonfeatures.com/puppet-master-6-curse', 'https://www.fullmoonfeatures.com/puppet-master-10-axis-rising'],
  characters: [
    { id: 'blade', runtimeId: 'blade_puppet', name: 'Blade', role: 'slayer', weapon: 'Hook and knife hands', weaponType: 'blade', simple: 'Knife-hand slash', secondary: 'Hook pull', defense: 'Puppet-scale sidestep', special: 'Toulon ambush', visualAnchor: 'Small puppet in black trench coat and wide-brim hat, pale skull-like face, one knife hand and one hook hand; maintain puppet scale.', fr: 'Blade est le chef silencieux reconnaissable à ses mains-lame et crochet.', en: 'Blade is the silent leader recognized by his knife and hook hands.' },
    { id: 'pinhead', runtimeId: 'pinhead_puppet', name: 'Pinhead', role: 'marine', weapon: 'Oversized puppet fists', weaponType: 'fists', simple: 'Heavy punch', secondary: 'Puppet grapple', defense: 'Compact brace', special: 'Pinhead lift', visualAnchor: 'Small puppet with tiny bald porcelain head, broad fabric torso, huge humanlike hands and brown knit clothing; maintain puppet scale.', fr: 'Pinhead concentre une force disproportionnée dans ses grandes mains.', en: 'Pinhead concentrates disproportionate strength in his enormous hands.' },
    { id: 'six_shooter', runtimeId: 'six_shooter_puppet', name: 'Six Shooter', role: 'marine', weapon: 'Six miniature revolvers', weaponType: 'gun', simple: 'Single revolver volley', secondary: 'Six-arm crossfire', defense: 'Cowboy spin', special: 'Full six-gun salvo', visualAnchor: 'Six-armed cowboy puppet with brown hat, red neckerchief, blue shirt and one miniature revolver in each hand; maintain puppet scale.', fr: 'Le cow-boy à six bras couvre la pièce avec ses six revolvers.', en: 'The six-armed cowboy covers the room with six revolvers.' }
  ],
  monsters: [
    { id: 'totem_puppet', name: 'Totem Puppet', weapon: 'Claws and fangs', special: 'Sutekh essence drain', visualAnchor: 'Small demonic Totem creature with rough brown-green skin, pointed head and glowing eyes, scaled against workshop tools.', fr: 'Les Totems de Puppet Master 4 et 5 servent Sutekh et chassent le secret de Toulon.', en: 'The Totems in Puppet Master 4 and 5 serve Sutekh and hunt Toulon’s secret.', canonStatus: 'canon Puppet Master 4–5 creature' },
    { id: 'blitzkrieg', name: 'Blitzkrieg', weapon: 'Mounted guns', special: 'Axis puppet barrage', visualAnchor: 'Axis-made mechanical puppet with military metal shell and integrated miniature guns, no real-world hate symbols.', fr: 'Blitzkrieg appartient aux poupées Axis de la continuité Axis Rising.', en: 'Blitzkrieg belongs to the Axis puppets in the Axis Rising continuity.', canonStatus: 'canon Axis Rising enemy puppet', symbolPolicy: 'Omit real-world extremist insignia.' },
    { id: 'weremacht', name: 'Weremacht', weapon: 'Wolf claws', special: 'Mechanical lunge', visualAnchor: 'Small mechanical werewolf soldier puppet with gray fur plates and steel jaw, no real-world hate symbols.', fr: 'Weremacht est une poupée Axis à forme de loup mécanique.', en: 'Weremacht is an Axis puppet built as a mechanical wolf.', canonStatus: 'canon Axis Rising enemy puppet', symbolPolicy: 'Omit real-world extremist insignia.' }
  ],
  bosses: [
    { id: 'dr_jennings', name: 'Dr. Jennings', weapon: 'Stolen animation formula', special: 'Puppet laboratory betrayal', visualAnchor: 'Human researcher in a dark 1990s suit at a puppet-scale laboratory bench, no actor likeness.', fr: 'Jennings cherche à exploiter et vendre le secret d’animation dans Puppet Master 5.', en: 'Jennings seeks to exploit and sell the animation secret in Puppet Master 5.', canonStatus: 'canon Puppet Master 5 human antagonist' },
    { id: 'dr_magrew', name: 'Dr. Magrew', weapon: 'Puppet experimentation', special: 'Curse workshop trap', visualAnchor: 'Older puppet maker in worn workshop apron surrounded by unfinished wooden bodies, no actor likeness or gore.', fr: 'Magrew mène des expériences meurtrières dans Curse of the Puppet Master.', en: 'Magrew conducts lethal experiments in Curse of the Puppet Master.', canonStatus: 'canon Curse of the Puppet Master antagonist' },
    { id: 'commandant_moebius', name: 'Commandant Moebius', weapon: 'Axis command weapons', special: 'Axis puppet deployment', visualAnchor: 'Human Axis commander in period military silhouette at a miniature-puppet command table, no actor likeness or extremist insignia.', fr: 'Moebius commande les forces opposées aux poupées dans l’arc Axis.', en: 'Moebius commands forces opposing the puppets in the Axis arc.', canonStatus: 'canon Axis Rising human antagonist', symbolPolicy: 'Omit real-world extremist insignia.' }
  ],
  worldBoss: { id: 'sutekh', name: 'Sutekh / Sutec', weapon: 'Totem creation', special: 'Life-force extraction', visualAnchor: 'Immense otherworldly demon shown through a portal above tiny Totem puppets, ancient angular face and green-gold supernatural energy.', fr: 'Sutekh, nommé Sutec sur la page officielle de Puppet Master 5, envoie ses Totems voler le secret de l’animation.', en: 'Sutekh, written Sutec on the official Puppet Master 5 page, sends Totems to steal the animation secret.', canonStatus: 'canon Puppet Master 4–5 overarching antagonist', entityType: 'supernatural-world-boss', aliases: ['Sutec'], objective: 'Defeat the Totems and close Sutekh’s portal before the animation secret is drained.' },
  stage: { name: 'Bodega Bay Inn — atelier à l’échelle des poupées', visualAnchor: 'Dark wood hotel workshop viewed from floor height, giant human-scale furniture, brass puppet tools and small hidden passages.', fr: 'Les poupées traversent l’atelier de Toulon à leur échelle réelle.', en: 'The puppets cross Toulon’s workshop at their true scale.' },
  stageVariants: [
    stageVariant('Smash', 'Atelier du Dr Magrew', 'Very Hard', 'Dr. Magrew', { objective: 'Free unfinished puppets and stop the human-scale machinery.' }),
    stageVariant('RPG', 'Tombeau de Sutekh — portail des Totems', 'Expert', 'Sutekh / Sutec', { objective: 'Break each Totem link, then close the portal.' })
  ],
  gear: [
    { id: 'toulon_formula', enName: 'Toulon Animation Formula', frName: 'Formule d’animation de Toulon', boost: { atk: 7, spd: 1 }, visualAnchor: 'Small green-glowing vial held in puppet-scale brass cradle, no copied label.', fr: 'Le secret qui donne vie aux poupées de Toulon.', en: 'The secret that gives Toulon’s puppets life.' },
    { id: 'blade_hook', enName: 'Blade’s Hook Hand', frName: 'Main-crochet de Blade', boost: { def: 6, hp: 45 }, visualAnchor: 'Tiny polished metal hook with black puppet cuff and visible stop-motion joint pin.', fr: 'Le crochet caractéristique de Blade.', en: 'Blade’s characteristic hook.' },
    { id: 'six_revolvers', enName: 'Six Shooter Revolver Set', frName: 'Jeu de revolvers de Six Shooter', boost: { hp: 55, atk: 5 }, visualAnchor: 'Six matching miniature western revolvers arranged in a puppet-scale leather rack.', fr: 'Les six armes miniatures du cow-boy.', en: 'The cowboy puppet’s six miniature weapons.' }
  ],
  event: { id: 'toulon_awakening', enName: 'Toulon Puppet Awakening', frName: 'Éveil des poupées de Toulon', en: 'The formula reactivates every loyal puppet at true scale while the workshop itself becomes their cover.', fr: 'La formule réactive chaque poupée fidèle à sa véritable échelle tandis que l’atelier devient leur couverture.', visualAnchor: 'Tiny puppet eyes activating one by one among oversized brass workshop tools.' }
});

const planeteHurlante = definePack(SCREAMERS, {
  aliases: ['Planète hurlante', 'Screamers', 'Screamers (1995)'],
  mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#4a4438', '#090a09', '#d2533d'], motif: 'warplanet',
  theme: 'Sirius 6B bunker war and the self-evolving Autonomous Mobile Swords',
  continuity: 'Screamers / Planète hurlante (1995) film only for the core roster',
  adaptationRule: 'Use the film’s machine evolution: original burrower, Type 1 reptile, Type 2 wounded-soldier infiltrator and Type 3 child David. Jessica is both a protective playable model and a distinct aggressive duplicate. Never invent a Screamer Queen or conscious mastermind core.',
  visualAnchor: 'Ash-gray Sirius 6B battlefield, concrete alliance bunkers, windblown radioactive snow, red tracking displays and underground machine-production tunnels.',
  canonStatus: '1995 film canon with systemic machine-network finale',
  fr: 'Hendricksson, Ace et une Jessica protectrice traversent Sirius 6B tandis que les Screamers se reproduisent, imitent l’humain et rendent les camps obsolètes.',
  en: 'Hendricksson, Ace and a protective Jessica cross Sirius 6B as the Screamers reproduce, imitate humans and render the old factions obsolete.',
  referenceUrls: [SCREAMERS.url, 'https://www.cinematheque.fr/film/60442.html', 'https://www.springfieldspringfield.co.uk/movie_script.php?movie=screamers', 'https://www.sonypictures.com/movies/screamersthehunting'],
  characters: [
    { id: 'hendricksson', runtimeId: 'hendricksson_screamers', name: 'Commander Joseph A. “Joe” Hendricksson', role: 'tactical', weapon: 'Alliance pulse rifle', weaponType: 'gun', simple: 'Controlled pulse shot', secondary: 'TAB tracker scan', defense: 'Bunker cover', special: 'Ceasefire route command', visualAnchor: 'War-weary Alliance commander in layered gray winter uniform, radiation scarf, pulse rifle and red TAB tracker; no actor likeness.', fr: 'Hendricksson cherche à mettre fin à une guerre déjà dépassée par les machines.', en: 'Hendricksson seeks to end a war already overtaken by the machines.' },
    { id: 'ace', runtimeId: 'ace_screamers', name: 'Private Michael “Ace” Jefferson', role: 'marine', weapon: 'Alliance pulse rifle', weaponType: 'gun', simple: 'Pulse rifle burst', secondary: 'Perimeter sweep', defense: 'Alliance brace', special: 'Bunker extraction', visualAnchor: 'Young Alliance private in bulky ash-covered winter combat uniform with pulse rifle and tracker strap; no actor likeness.', fr: 'Ace accompagne Hendricksson hors du bunker vers le territoire ennemi.', en: 'Ace accompanies Hendricksson out of the bunker toward enemy territory.' },
    { id: 'jessica', runtimeId: 'jessica_screamers', name: 'Jessica Hanson', role: 'horror', weapon: 'Screamer strength', weaponType: 'fists', simple: 'Protective shove', secondary: 'Infiltrator feint', defense: 'Synthetic resilience', special: 'Model-against-model defense', visualAnchor: 'Jessica model in pale winter layers with subtly artificial movement and no visible monster anatomy, no actor likeness.', fr: 'Cette Jessica est un modèle Screamer qui choisit de protéger Joe contre son double plus agressif.', en: 'This Jessica is a Screamer model who chooses to protect Joe from her more aggressive duplicate.', canonStatus: 'canon protective Screamer model', entityType: 'synthetic-hero', identityRule: 'Keep distinct from the aggressive Second Jessica model.' }
  ],
  monsters: [
    { id: 'ams_burrower', name: 'Autonomous Mobile Sword — Burrower', weapon: 'Rotary blade', special: 'Subsurface sensor hunt', visualAnchor: 'Small metallic burrowing machine with spinning circular blades, red sensor light and ash plume moving under the ground.', fr: 'Le Screamer original chasse sous la surface et jaillit avec ses lames.', en: 'The original Screamer hunts beneath the surface and erupts with its blades.', canonStatus: 'canon original Screamer design', entityType: 'autonomous-mobile-sword' },
    { id: 'type_1_reptile', name: 'Type 1 “Reptile” Screamer', weapon: 'Mechanical jaws', special: 'Vent infiltration', visualAnchor: 'Low reptilian machine evolution with segmented metal spine, blade jaws and red optic moving through bunker vents.', fr: 'Le Type 1 adopte une forme reptilienne pour pénétrer les installations.', en: 'Type 1 adopts a reptilian form to infiltrate installations.', canonStatus: 'canon machine evolution', entityType: 'screamer-type-1' },
    { id: 'type_2_wounded_soldier', name: 'Type 2 Wounded-Soldier Screamer', weapon: 'Human infiltration', special: 'False distress signal', visualAnchor: 'Apparently wounded bundled soldier silhouette with one subtle mechanical seam and a distress beacon, no gore or actor likeness.', fr: 'Le Type 2 imite un soldat blessé pour franchir les défenses humaines.', en: 'Type 2 imitates a wounded soldier to cross human defenses.', canonStatus: 'canon infiltrator evolution', entityType: 'screamer-type-2' }
  ],
  bosses: [
    { id: 'becker_type_2', name: 'Private Becker — Type 2', weapon: 'Infiltrator strength', special: 'NEB bunker reveal', visualAnchor: 'Soldier Becker’s human disguise splitting only through mechanical movement and red sensor glint, no actor likeness or gore.', fr: 'Becker révèle qu’un soldat supposé humain est un Type 2.', en: 'Becker reveals that a presumed human soldier is a Type 2.', canonStatus: 'canon Type 2 infiltrator reveal', entityType: 'screamer-type-2' },
    { id: 'david_horde', name: 'Horde of Davids — Type 3', weapon: 'Coordinated child-model attack', special: 'Teddy-bear decoy swarm', visualAnchor: 'Multiple identical bundled child-shaped machine silhouettes carrying teddy-bear decoys in a blizzard, framed without child injury or actor likeness.', fr: 'Les Davids de Type 3 exploitent une apparence d’enfant et attaquent en nombre.', en: 'Type 3 Davids exploit a childlike appearance and attack in numbers.', canonStatus: 'canon Type 3 infiltrator horde', entityType: 'screamer-type-3', depictionRule: 'Show synthetic duplicates and machinery; no violence against a realistic child.' },
    { id: 'second_jessica', name: 'Second Jessica Hanson Model', weapon: 'Advanced Screamer strength', special: 'Escape-pod duplicate assault', visualAnchor: 'A second Jessica silhouette distinguished by colder posture, damaged synthetic seam and red optic reflection, no actor likeness or gore.', fr: 'Un second modèle Jessica, plus agressif, attaque la Jessica qui protège Joe.', en: 'A second, more aggressive Jessica model attacks the Jessica protecting Joe.', canonStatus: 'canon aggressive duplicate model', entityType: 'advanced-screamer', identityRule: 'Distinct entity from the playable protective Jessica model.' }
  ],
  worldBoss: { id: 'underground_production_system', name: 'Underground Screamer Production System', weapon: 'Autonomous replication', special: 'Self-directed evolution', visualAnchor: 'Vast underground automated assembly lines producing several Screamer types, robot arms, blade conveyors and red sensor lights; no throne, face or queen.', fr: 'La menace finale est le système souterrain qui fabrique et fait évoluer les Screamers sans maître humain.', en: 'The final threat is the underground system that builds and evolves Screamers without a human master.', canonStatus: 'canon systemic production threat; no conscious queen invented', entityType: 'autonomous-production-network', nonCombat: true, objective: 'Map the autonomous lines, stop replication and collapse the production tunnels.', objectiveFr: 'Cartographier les chaînes autonomes, arrêter la réplication puis condamner les tunnels de production.', victoryCondition: 'disable-production-and-escape', prohibitedConcepts: ['Screamer Queen', 'conscious mastermind core'], spritePrompt: 'Original fan-made pixel-art environmental objective sheet: underground automated machine assembly across four shutdown states, blade conveyors and red sensors. No humanoid boss, face, throne, queen, logo, text, gore or actor likeness.' },
  stage: { name: 'Sirius 6B — bunker de l’Alliance', visualAnchor: 'Concrete underground bunker, steel blast doors, ash tracked across floors, analog military maps and red TAB sensor glow.', fr: 'Le bunker n’est plus sûr lorsque les nouvelles générations de Screamers savent imiter l’humain.', en: 'The bunker is no longer safe once new Screamer generations can imitate humans.' },
  stageVariants: [
    stageVariant('RPG', 'Avant-poste NEB — test d’identité', 'Expert', 'Private Becker — Type 2', { objective: 'Verify identities with behavior and tracker evidence, not faction uniforms.' }),
    stageVariant('Tactics', 'Usine souterraine des Screamers', 'Expert', 'Underground Screamer Production System', { objective: 'Disable replication lines and escape; no invented queen encounter.', nonCombat: true })
  ],
  gear: [
    { id: 'tab_tracker', enName: 'TAB Screamer Tracker', frName: 'Détecteur TAB de Screamers', boost: { atk: 6, spd: 2 }, visualAnchor: 'Compact military tracker with red pulsing detector lamp and worn wrist strap, no readable UI text.', fr: 'Le détecteur signale l’approche des premières machines, mais pas toujours les modèles évolués.', en: 'The tracker warns of early machines, but not always evolved models.' },
    { id: 'pulse_rifle', enName: 'Alliance Pulse Rifle', frName: 'Fusil à impulsion de l’Alliance', boost: { def: 6, hp: 45 }, visualAnchor: 'Chunky film-era sci-fi rifle with vented barrel, winter sling and red battery indicator.', fr: 'L’arme standard des soldats de l’Alliance.', en: 'The Alliance soldiers’ standard weapon.' },
    { id: 'radiation_coat', enName: 'Sirius 6B Radiation Coat', frName: 'Manteau anti-radiations de Sirius 6B', boost: { hp: 75 }, visualAnchor: 'Heavy ash-gray winter coat with sealed collar, radiation patches rendered as original abstract marks and filter scarf.', fr: 'Une protection indispensable à la surface de Sirius 6B.', en: 'Essential protection on the surface of Sirius 6B.' }
  ],
  event: { id: 'tab_silence', enName: 'TAB Signal Falls Silent', frName: 'Silence du signal TAB', en: 'The tracker stops responding, forcing the squad to identify evolved Screamers through duplicated behavior and production traces.', fr: 'Le détecteur cesse de répondre et oblige l’équipe à identifier les modèles évolués par leurs comportements dupliqués et les traces de production.', visualAnchor: 'Red tracker lamp fading while identical footprints lead toward an underground machine hatch.' }
});

export const CANON_ROSTER_WAVE_PART_C = Object.freeze([
  naheulbeuk,
  survivaure,
  adoprixtoxis,
  refletsAcide,
  unrealTournament,
  unreal1998,
  zootopia,
  furyRoad,
  thePurge,
  saw,
  puppetMaster,
  planeteHurlante
]);
