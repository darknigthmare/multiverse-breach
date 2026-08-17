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

const SOURCES = Object.freeze({
  gex: Object.freeze({ key: 'gex', universe: 'Gex', url: 'https://gextrilogy.com/' }),
  spyro: Object.freeze({ key: 'spyro', universe: 'Spyro', url: 'https://www.spyrothedragon.com/pl/spyroreignitedtrilogy' }),
  rayman: Object.freeze({ key: 'rayman', universe: 'Rayman', url: 'https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman' }),
  nier: Object.freeze({ key: 'nier', universe: 'NieR', url: 'https://www.jp.square-enix.com/nierautomata/' }),
  discipline: Object.freeze({ key: 'discipline', universe: 'Discipline: The Record of a Crusade', url: 'https://www.mobygames.com/game/106070/discipline-the-record-of-a-crusade/' }),
  bibleBlack: Object.freeze({ key: 'bible_black', universe: 'Bible Black', url: 'https://www.mobygames.com/game/27648/bible-black-the-game/' }),
  hotlineMiami: Object.freeze({ key: 'hotline_miami', universe: 'Hotline Miami', url: 'https://www.hotlinemiami.com/' }),
  spaceMarine: Object.freeze({ key: 'space_marine', universe: 'Warhammer 40,000: Space Marine', url: 'https://www.warhammer-community.com/en-gb/articles/wr3d2srg/who-is-lieutenant-titus-the-long-and-glorious-history-of-the-space-marine-2-hero/' }),
  backToTheFuture: Object.freeze({ key: 'back_to_the_future', universe: 'Back to the Future', url: 'https://www.backtothefuture.com/movies/backtothefuture1' }),
  terminator: Object.freeze({ key: 'terminator', universe: 'Terminator', url: 'https://skydance.com/news/linda-hamilton-set-return-terminator-franchise/' }),
  robocop: Object.freeze({ key: 'robocop', universe: 'RoboCop', url: 'https://www.mgm.com/' }),
  walkingDead: Object.freeze({ key: 'walking_dead_telltale', universe: 'The Walking Dead — Telltale', url: 'https://help.skybound.com/support/solutions/folders/30000056389' }),
  horizon: Object.freeze({ key: 'horizon_zero_dawn', universe: 'Horizon Zero Dawn', url: 'https://www.playstation.com/en-us/editorial/horizon-zero-dawn-the-story-so-far/' })
});

const gex = definePack(SOURCES.gex, {
  aliases: ['Gex Trilogy', 'Gex the Gecko'], mediaType: 'game-franchise', faction: 'tech', mode: 'RPG', difficulty: 'Hard',
  colors: ['#3f8c39', '#10180e', '#d8bd43'], motif: 'television',
  theme: 'channel-surfing platform adventures inside the Media Dimension',
  continuity: 'Crystal Dynamics Gex trilogy as preserved in the official Gex Trilogy collection',
  adaptationRule: 'Gex is the only frontline fighter. Agent Xtra and Alfred remain canon support allies; do not sexualise Xtra, imitate a performer, or turn Alfred into a generic ninja turtle. Rez and named trilogy bosses retain their television-world identities.',
  visualAnchor: '1990s cathode-ray televisions opening into themed channels, remote controls, saturated low-poly sets and Gex’s green gecko silhouette.',
  canonStatus: 'canon trilogy anthology with support allies transparently adapted as playable specialists',
  fr: 'Gex replonge dans la Dimension Média avec l’aide à distance de l’Agent Xtra et de son majordome Alfred pour couper le signal de Rez.',
  en: 'Gex dives back into the Media Dimension with remote support from Agent Xtra and his butler Alfred to cut Rez’s signal.',
  referenceUrls: [SOURCES.gex.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Manual/formated/Gex_3-_Deep_Cover_Gecko_-_1999_-_Eidos_Interactive.pdf'],
  characters: [
    { id: 'gex', name: 'Gex', role: 'slayer', weapon: 'Tail whip', weaponType: 'fists', secondary: 'Tongue grab', defense: 'Wall-cling evade', special: 'Channel-surfing tailspin', visualAnchor: 'Small anthropomorphic green gecko with cream belly, expressive brow, long whipping tail and bare clawed feet; no costume unless a level-specific disguise is named.', fr: 'Le gecko téléphage traverse les écrans grâce à sa queue, sa langue et son adhérence aux murs.', en: 'The television-obsessed gecko crosses screens using his tail, tongue and wall grip.' },
    { id: 'agent_xtra', name: 'Agent Xtra', role: 'hacker', weapon: 'Mission uplink', weaponType: 'focus', secondary: 'Channel intelligence', defense: 'Encrypted relay', special: 'Media Dimension override', visualAnchor: 'Original stylised secret agent shown through a compact video communicator, practical dark-red field jacket and earpiece; no live-action performer likeness, glamour pose or sexualisation.', fr: 'Partenaire de mission de Gex, Xtra fournit les renseignements et doit être sauvée de Rez dans Deep Cover Gecko.', en: 'Gex’s mission partner supplies intelligence and must be rescued from Rez in Deep Cover Gecko.', canonStatus: 'canon mission partner adapted as noncombat support', nonCombat: true, objective: 'Guide Gex through the channel grid and maintain the secure uplink.' },
    { id: 'alfred', name: 'Alfred', role: 'tactical', weapon: 'Butler’s mission console', weaponType: 'focus', secondary: 'Secret-level briefing', defense: 'Island security', special: 'Emergency channel route', visualAnchor: 'Small elderly anthropomorphic tortoise butler in a neat black tailcoat, round spectacles and white gloves, carrying a compact console; no martial-arts redesign.', fr: 'Le fidèle majordome tortue de Gex l’assiste depuis son île et signale les urgences.', en: 'Gex’s loyal tortoise butler assists from the island and reports emergencies.', canonStatus: 'canon butler adapted as noncombat tactical support', nonCombat: true, objective: 'Unlock secret routes and coordinate extraction from the Media Dimension.' }
  ],
  monsters: [
    { id: 'rezling', name: 'Rezling', weapon: 'Channel-static claws', special: 'Television spawn', visualAnchor: 'Small purple-black Media Dimension creature built from angular 1990s game geometry and flickering scanline highlights.', fr: 'Un sbire engendré par le signal corrompu de Rez.', en: 'A minion spawned by Rez’s corrupted signal.', canonStatus: 'canon recurring Rez minion' },
    { id: 'mecha_rezling', name: 'Mecha Rezling', weapon: 'Mechanical pounce', special: 'Static discharge', visualAnchor: 'Compact metal Rezling variant with green CRT glow, exposed rivets and a low-poly jaw.', fr: 'Une variante mécanique renforcée des créatures de Rez.', en: 'A reinforced mechanical variant of Rez’s creatures.', canonStatus: 'canon trilogy enemy variant' },
    { id: 'rez_trooper', name: 'Rez Trooper', weapon: 'Media blaster', special: 'Channel ambush', visualAnchor: 'Cartoon television-world guard with angular purple armour, antenna pack and original abstract screen emblem.', fr: 'Un garde de chaîne chargé de bloquer les téléviseurs de sortie.', en: 'A channel guard assigned to block exit televisions.', canonStatus: 'canon-derived Media Dimension enemy class' }
  ],
  bosses: [
    { id: 'flatulator', name: 'The Flatulator', weapon: 'Toxic gas bursts', special: 'Waste-plant pressure wave', visualAnchor: 'Bulky mutant boss from the first Gex framed by pipes, toxic green vapor and chunky 2D-game proportions.', fr: 'Le boss des installations toxiques du premier Gex sature l’arène de gaz.', en: 'The first Gex game’s toxic-facility boss fills the arena with gas.' },
    { id: 'mooshoo_pork', name: 'Mooshoo Pork', weapon: 'Sumo charges', special: 'Arena shockwave', visualAnchor: 'Massive cartoon pig sumo boss in a television martial-arts set, preserving the exaggerated Gex 2 silhouette without ethnic caricature.', fr: 'Le boss de la chaîne Kung Fu Theater impose des charges de sumo.', en: 'The Kung Fu Theater channel boss attacks with sumo charges.', canonStatus: 'canon Gex: Enter the Gecko boss' },
    { id: 'mecha_rez', name: 'Mecha Rez', weapon: 'Mechanical tail and missiles', special: 'Channel Z overload', visualAnchor: 'Huge robotic Rez replica with angular purple shell, green-lit joints and CRT-era launch pods.', fr: 'La réplique mécanique de Rez défend Channel Z.', en: 'Rez’s mechanical replica defends Channel Z.', canonStatus: 'canon Gex: Enter the Gecko final machine' }
  ],
  worldBoss: { id: 'rez', name: 'Rez', weapon: 'Media Dimension control', special: 'Total channel takeover', visualAnchor: 'Tall purple cybernetic reptilian overlord emerging from a wall of cathode-ray screens, angular red eyes and long segmented tail.', fr: 'L’ennemi juré de Gex tente une nouvelle fois de prendre le contrôle de la Dimension Média.', en: 'Gex’s archenemy once again attempts to control the Media Dimension.', canonStatus: 'canon trilogy principal antagonist', objective: 'Break Rez’s channel relays and eject his signal from every television gateway.' },
  stage: { name: 'Media Dimension — Hub des téléviseurs', visualAnchor: 'Dark floating hub lined with glowing CRT portals, remote-control pedestals and separate horror, cartoon and science-fiction channels.', fr: 'Chaque téléviseur ouvre une chaîne thématique contrôlée par Rez.', en: 'Each television opens a themed channel controlled by Rez.' },
  stageVariants: [stageVariant('RPG', 'Kung Fu Theater', 'Hard', 'Mooshoo Pork', { objective: 'Use tail timing to redirect the sumo charges.' }), stageVariant('Tactics', 'Channel Z — coupure du signal', 'Expert', 'Rez', { objective: 'Disable every broadcast relay before confronting Rez.' })],
  gear: [
    { id: 'red_remote', enName: 'Red Remote', frName: 'Télécommande rouge', boost: { atk: 6, spd: 2 }, visualAnchor: 'Chunky red 1990s television remote with one glowing green button and no readable branding.', fr: 'Une télécommande de progression qui ouvre de nouvelles chaînes.', en: 'A progression remote that opens new channels.' },
    { id: 'paw_coin', enName: 'Gex Paw Coin', frName: 'Pièce-patte de Gex', boost: { hp: 55, def: 3 }, visualAnchor: 'Round golden collectible embossed with an original three-toed gecko paw.', fr: 'Un objet de collecte dissimulé dans les niveaux.', en: 'A collectible hidden throughout the levels.' },
    { id: 'firefly', enName: 'Firefly Power-up', frName: 'Bonus luciole', boost: { hp: 45, atk: 4 }, visualAnchor: 'Small warm-yellow cartoon firefly encased in a transparent television pickup bubble.', fr: 'Une luciole confère temporairement une capacité à Gex.', en: 'A firefly temporarily grants Gex an ability.' }
  ],
  event: { id: 'prime_time', enName: 'Prime-Time Channel Sweep', frName: 'Balayage des chaînes en prime time', en: 'Gex clears three television genres in sequence while Xtra and Alfred keep the exit frequency stable.', fr: 'Gex nettoie trois genres télévisés à la suite tandis que Xtra et Alfred stabilisent la fréquence de sortie.', visualAnchor: 'Three CRT portals changing from horror to cartoon to science fiction around Gex’s exact green silhouette.' }
});

const spyro = definePack(SOURCES.spyro, {
  aliases: ['Spyro Reignited Trilogy', 'Spyro the Dragon'], mediaType: 'game-franchise', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#6b3dc1', '#161028', '#f0a52e'], motif: 'dragonrealm', theme: 'dragon platforming across the Dragon Realms, Avalar and Forgotten Worlds',
  continuity: 'Spyro Reignited Trilogy’s remastered versions of the original three Insomniac games',
  adaptationRule: 'Keep Spyro quadrupedal and small, Sparx dragonfly-sized and Hunter an Avalar ally. Gnorcs, Riptocs and Rhynocs belong to their respective games; the anthology roster never pretends all three invasions occurred simultaneously.',
  visualAnchor: 'Bright fantasy homeworlds, stone portals, gems, dragon eggs and Spyro’s small purple quadrupedal dragon silhouette.',
  canonStatus: 'official Reignited Trilogy anthology with game-of-origin labels',
  fr: 'Spyro, Sparx et Hunter traversent trois aventures restaurées pour libérer les dragons, sauver Avalar et récupérer les œufs volés.',
  en: 'Spyro, Sparx and Hunter cross three restored adventures to free the dragons, save Avalar and recover the stolen eggs.',
  referenceUrls: [SOURCES.spyro.url, 'https://support.activision.com/spyro'],
  characters: [
    { id: 'spyro', name: 'Spyro', role: 'slayer', weapon: 'Dragon flame', weaponType: 'magic', secondary: 'Horn charge', defense: 'Wing glide', special: 'Superflame sweep', visualAnchor: 'Small quadrupedal purple dragon with yellow-orange curved horns, orange wing membranes, golden belly scales and a compact charge posture.', fr: 'Spyro utilise son souffle, ses cornes et son vol plané pour protéger les royaumes.', en: 'Spyro uses flame, horns and gliding to protect the realms.' },
    { id: 'sparx', name: 'Sparx', role: 'hacker', weapon: 'Dragonfly shield', weaponType: 'focus', secondary: 'Gem pickup', defense: 'Colour-state guard', special: 'Dragonfly barrier', visualAnchor: 'Tiny golden-yellow dragonfly with four translucent wings, blue eyes and a glow no larger than Spyro’s head.', fr: 'Sparx protège Spyro et indique son état de santé par sa couleur.', en: 'Sparx protects Spyro and shows his health through colour.', canonStatus: 'canon companion adapted as support hero' },
    { id: 'hunter', name: 'Hunter', role: 'tactical', weapon: 'Bow and arrow', weaponType: 'gun', secondary: 'Athletic leap', defense: 'Cheetah sidestep', special: 'Avalar target volley', visualAnchor: 'Tall slim yellow cheetah with black spots, red-brown utility vest, bow and eager athletic stance.', fr: 'L’athlète d’Avalar guide Spyro et relève ses propres défis.', en: 'Avalar’s athlete guides Spyro and takes on challenges of his own.' }
  ],
  monsters: [
    { id: 'gnorc', name: 'Gnorc Warrior', weapon: 'Club', special: 'Dragon Realm patrol', visualAnchor: 'Stocky green Gnorc with underbite, brown jerkin and crude wooden club from Spyro the Dragon.', fr: 'Un soldat de l’armée créée par Gnasty Gnorc.', en: 'A soldier from Gnasty Gnorc’s conjured army.', canonStatus: 'canon Spyro the Dragon enemy class' },
    { id: 'riptoc', name: 'Riptoc', weapon: 'Spear', special: 'Avalar ambush', visualAnchor: 'Small orange-red reptilian Riptoc in simple metal cap carrying an oversized spear.', fr: 'Un sbire reptilien de Ripto dans Avalar.', en: 'One of Ripto’s reptilian minions in Avalar.', canonStatus: 'canon Spyro 2 enemy class' },
    { id: 'rhynoc', name: 'Rhynoc', weapon: 'Mallet', special: 'Egg guard', visualAnchor: 'Broad blue-gray rhinoceros guard in red vest with cartoon mallet and Forgotten Worlds proportions.', fr: 'Un garde de l’armée de la Sorcière chargé des œufs volés.', en: 'A guard in the Sorceress’s army assigned to the stolen eggs.', canonStatus: 'canon Year of the Dragon enemy class' }
  ],
  bosses: [
    { id: 'toasty', name: 'Toasty', weapon: 'Scythe disguise', special: 'Sheep reveal', visualAnchor: 'Tall scarecrow-like robed figure with pumpkin-orange head and scythe, revealing the canonical sheep disguise beneath.', fr: 'Le premier grand duel dévoile un mouton caché sous un épouvantail.', en: 'The first major duel reveals a sheep hidden beneath a scarecrow.', canonStatus: 'canon Spyro the Dragon boss' },
    { id: 'gulp', name: 'Gulp', weapon: 'Body slam', special: 'Arena weapon swallow', visualAnchor: 'Huge quadrupedal green-blue Riptoc beast with orange back plates, broad jaw and Ripto-arena scale.', fr: 'La monture massive de Ripto transforme les objets de l’arène en attaques.', en: 'Ripto’s massive mount turns arena objects into attacks.', canonStatus: 'canon Spyro 2 boss' },
    { id: 'spike', name: 'Spike', weapon: 'Magma club', special: 'Lava arena blast', visualAnchor: 'Towering muscular red Rhynoc with horn, metal shoulder guards and oversized flaming club.', fr: 'La Sorcière fait grandir Spike pour défendre son territoire volcanique.', en: 'The Sorceress enlarges Spike to defend her volcanic territory.', canonStatus: 'canon Year of the Dragon boss' }
  ],
  worldBoss: { id: 'sorceress', name: 'The Sorceress', weapon: 'Forgotten Worlds magic', special: 'Saucer and spell barrage', visualAnchor: 'Tall blue reptilian sorceress in red-purple robes with gold staff, framed by stolen dragon eggs and a lava arena.', fr: 'La Sorcière commande les Rhynocs et vole les œufs de dragon pour préserver sa magie.', en: 'The Sorceress commands the Rhynocs and steals dragon eggs to preserve her magic.', canonStatus: 'canon Year of the Dragon principal antagonist', objective: 'Recover the remaining dragon eggs and defeat the Sorceress in her true arena sequence.' },
  stage: { name: 'Artisans — colline des portails', visualAnchor: 'Green Artisans grassland with stone dragon pedestals, waterfall, gem trails and portal archways.', fr: 'Le monde des Artisans sert de porte d’entrée aux royaumes de dragons.', en: 'The Artisans homeworld serves as the gateway to the Dragon Realms.' },
  stageVariants: [stageVariant('RPG', 'Avalar — arène de Gulp', 'Very Hard', 'Gulp', { objective: 'Intercept dropped items before Gulp swallows them.' }), stageVariant('Smash', 'Forgotten Worlds — antre de la Sorcière', 'Expert', 'The Sorceress', { objective: 'Use every vehicle phase and recover the guarded eggs.' })],
  gear: [
    { id: 'dragon_talisman', enName: 'Avalar Talisman', frName: 'Talisman d’Avalar', boost: { atk: 6, spd: 2 }, visualAnchor: 'Small original sun-shaped gold talisman with turquoise inlay and no text.', fr: 'Les talismans rouvrent le passage entre les mondes d’Avalar.', en: 'Talismans reopen passage between Avalar’s worlds.' },
    { id: 'dragon_egg', enName: 'Dragon Egg', frName: 'Œuf de dragon', boost: { hp: 65, def: 2 }, visualAnchor: 'Large cream dragon egg with purple spots resting in a padded stone nest.', fr: 'Un œuf volé à récupérer dans les Forgotten Worlds.', en: 'A stolen egg to recover in the Forgotten Worlds.' },
    { id: 'superflame', enName: 'Superflame Power-up', frName: 'Bonus Superflamme', boost: { atk: 8 }, visualAnchor: 'Winged stone power-up gate glowing orange-purple around a flame crystal.', fr: 'Une porte temporaire amplifie le souffle de Spyro.', en: 'A temporary gate amplifies Spyro’s breath.' }
  ],
  event: { id: 'three_realms', enName: 'Three-Realm Dragon Run', frName: 'Course des trois royaumes', en: 'Spyro links one Dragon Realm, one Avalar world and one Forgotten World without losing Sparx’s protection.', fr: 'Spyro enchaîne un royaume des dragons, un monde d’Avalar et un Forgotten World sans perdre la protection de Sparx.', visualAnchor: 'Three adjacent stone portals with exact Gnorc, Riptoc and Rhynoc silhouettes kept in their own worlds.' }
});

const rayman = definePack(SOURCES.rayman, {
  aliases: ['Rayman franchise', 'Rayman Legends'], mediaType: 'game-franchise', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#6e4ab5', '#102538', '#f1c541'], motif: 'dreamglade', theme: 'limbless platforming through the Glade of Dreams and magical paintings',
  continuity: 'Ubisoft mainline Rayman games, presented as a labelled franchise anthology rather than one merged incident',
  adaptationRule: 'Preserve Rayman’s limbless floating hands and feet, Globox’s large blue frog-like body and Barbara’s Rayman Legends barbarian silhouette. Named villains retain their game of origin; Rabbids are not substituted for the mainline bestiary.',
  visualAnchor: 'Painterly Glade of Dreams, floating platforms, Electoons, lum trails, plum trees and theatrical portals.',
  canonStatus: 'canon mainline-franchise anthology with cross-game Nexus team',
  fr: 'Rayman, Globox et Barbara bondissent entre les tableaux de la Croisée des Rêves pour empêcher Mr Dark d’étendre son ombre.',
  en: 'Rayman, Globox and Barbara leap between Glade of Dreams paintings to stop Mr Dark from spreading his shadow.',
  referenceUrls: [SOURCES.rayman.url, 'https://www.ubisoft.com/en-us/games/rayman-legends', 'https://news.ubisoft.com/en-us/article/mqXBE5x8Kcn2NzNmrJclL/rayman-legends-definitive-edition-out-now-on-nintendo-switch'],
  characters: [
    { id: 'rayman', name: 'Rayman', role: 'slayer', weapon: 'Telescopic fist', weaponType: 'fists', secondary: 'Hair helicopter', defense: 'Limbless roll', special: 'Charged fist storm', visualAnchor: 'Limbless hero with floating white-gloved hands and yellow shoes, blond hair crest, purple torso with white ring and red neckerchief.', fr: 'Le héros sans bras ni jambes frappe à distance et plane avec ses cheveux.', en: 'The limbless hero punches at range and glides with his hair.' },
    { id: 'globox', name: 'Globox', role: 'marine', weapon: 'Globox slap', weaponType: 'fists', secondary: 'Rain dance', defense: 'Blue-body brace', special: 'Glade belly bounce', visualAnchor: 'Very large rounded blue frog-like friend with pale belly, long arms, tiny feet and broad friendly smile.', fr: 'Le meilleur ami de Rayman apporte sa force, sa maladresse et une loyauté absolue.', en: 'Rayman’s best friend brings strength, clumsiness and absolute loyalty.' },
    { id: 'barbara', name: 'Barbara', role: 'tactical', weapon: 'Battle axe', weaponType: 'blade', secondary: 'Axe rebound', defense: 'Viking roll', special: 'Princess rescue rush', visualAnchor: 'Small orange-haired barbarian princess with winged helmet, green tunic, striped leggings and one broad double-headed axe; practical cartoon design without sexualisation.', fr: 'La princesse guerrière de Rayman Legends manie sa hache avec agilité.', en: 'The warrior princess from Rayman Legends wields her axe with agility.' }
  ],
  monsters: [
    { id: 'antitoon', name: 'Antitoon', weapon: 'Dark-energy touch', special: 'Protoon disruption', visualAnchor: 'Small dark-purple spiky creature with round white eyes and floating cartoon hands from the original Rayman.', fr: 'Mr Dark transforme l’équilibre du monde en créant les Antitoons.', en: 'Mr Dark disrupts the world’s balance through the Antitoons.', canonStatus: 'canon Rayman enemy' },
    { id: 'hoodlum', name: 'Hoodlum', weapon: 'Armoured punch', special: 'Black Lum swarm', visualAnchor: 'Tall cloth-wrapped purple-red Hoodlum with long arms, hood and stitched cartoon armour from Rayman 3.', fr: 'Les Lums noirs forment les soldats Hoodlums.', en: 'Black Lums form the Hoodlum soldiers.', canonStatus: 'canon Rayman 3 enemy class' },
    { id: 'lividstone', name: 'Lividstone', weapon: 'Shield and spear', special: 'Painting ambush', visualAnchor: 'Small dark-blue stone-like warrior with horned helmet, wooden shield and spear from Rayman Origins and Legends.', fr: 'Un habitant cauchemardesque qui patrouille les mondes des tableaux.', en: 'A nightmarish inhabitant patrolling the painting worlds.', canonStatus: 'canon Origins/Legends enemy class' }
  ],
  bosses: [
    { id: 'space_mama', name: 'Space Mama', weapon: 'Rolling pin and laser washer', special: 'Theatrical stage change', visualAnchor: 'Large opera-viking cartoon boss with red hair, horned helmet, rolling pin and washing-machine laser prop on a theatrical set.', fr: 'Space Mama transforme le duel en représentation à plusieurs décors.', en: 'Space Mama turns the duel into a multi-set performance.', canonStatus: 'canon original Rayman boss' },
    { id: 'razorbeard', name: 'Admiral Razorbeard', weapon: 'Robo-Pirate fleet', special: 'Grolgoth deployment', visualAnchor: 'Small angular red-brown Robo-Pirate admiral with oversized metal hat aboard the mechanical Grolgoth cockpit.', fr: 'L’amiral des Robo-Pirates envahit la Croisée des Rêves dans Rayman 2.', en: 'The Robo-Pirate admiral invades the Glade of Dreams in Rayman 2.', canonStatus: 'canon Rayman 2 principal antagonist adapted as boss' },
    { id: 'reflux', name: 'Reflux', weapon: 'Knaaren staff', special: 'Leptys transformation', visualAnchor: 'Towering pale-green Knaaren champion with red markings, heavy staff and later winged Leptys-energy silhouette.', fr: 'Le champion Knaaren absorbe la puissance du Leptys dans Rayman 3.', en: 'The Knaaren champion absorbs the Leptys’s power in Rayman 3.', canonStatus: 'canon Rayman 3 antagonist' }
  ],
  worldBoss: { id: 'mr_dark', name: 'Mr Dark', weapon: 'Great Protoon theft', special: 'Dark transformation gauntlet', visualAnchor: 'Mysterious short cloaked magician with huge black hat, white gloves, hidden face and glowing yellow eyes in Candy Château.', fr: 'Mr Dark vole le Grand Protoon et dérègle la Croisée des Rêves dans le premier jeu.', en: 'Mr Dark steals the Great Protoon and throws the Glade of Dreams out of balance in the first game.', canonStatus: 'canon original Rayman principal antagonist', objective: 'Recover the Great Protoon and survive Mr Dark’s canonical transformation gauntlet.' },
  stage: { name: 'Croisée des Rêves — galerie des tableaux', visualAnchor: 'Ancient tree hall filled with living paintings, floating lum chains, carved Teensy doors and mossy platforms.', fr: 'Les tableaux vivants ouvrent des passages vers les mondes mythiques.', en: 'Living paintings open passages into mythical worlds.' },
  stageVariants: [stageVariant('RPG', 'Le Sommet d’Outre-Nuées', 'Very Hard', 'Reflux', { objective: 'Break the Leptys energy anchors during each transformation.' }), stageVariant('Smash', 'Candy Château — Grand Protoon', 'Expert', 'Mr Dark', { objective: 'Complete the transformation gauntlet and restore the Great Protoon.' })],
  gear: [
    { id: 'great_protoon', enName: 'Great Protoon', frName: 'Grand Protoon', boost: { hp: 60, atk: 5 }, visualAnchor: 'Large glowing pink-gold energy sphere with orbiting smaller motes and no face or text.', fr: 'Le noyau d’équilibre recherché dans le premier Rayman.', en: 'The balance core sought in the original Rayman.' },
    { id: 'purple_lum', enName: 'Purple Lum', frName: 'Lum violet', boost: { spd: 3, def: 3 }, visualAnchor: 'Tiny violet winged lum with a bright core and curved hook-like trail.', fr: 'Un Lum violet permet de se balancer au-dessus du vide.', en: 'A purple Lum enables swinging across gaps.' },
    { id: 'plum', enName: 'Walking Plum', frName: 'Prune mobile', boost: { hp: 55, def: 4 }, visualAnchor: 'Large round purple plum with green leaf, bouncy cartoon surface and no face.', fr: 'Une prune sert de projectile ou de plateforme rebondissante.', en: 'A plum serves as a projectile or bouncing platform.' }
  ],
  event: { id: 'lum_king', enName: 'Lum King Chain', frName: 'Chaîne du roi Lum', en: 'The team awakens a Lum King and collects a perfect timed trail through a living painting.', fr: 'L’équipe réveille un roi Lum puis collecte une traînée parfaite en rythme dans un tableau vivant.', visualAnchor: 'Golden Lum King with crown-like glow leading a curved trail through a painterly Glade level.' }
});

const nier = definePack(SOURCES.nier, {
  aliases: ['NieR:Automata', 'Nier'], mediaType: 'game-franchise', faction: 'sciFi', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#bdb7a6', '#171713', '#e6dfc9'], motif: 'machinewar', theme: 'YoRHa androids confronting machine lifeforms and the meaning of their endless proxy war',
  continuity: 'NieR:Automata game continuity, with no anime-only substitutions; franchise title retained as the requested portal name',
  adaptationRule: 'Use official game 2B, 9S and A2 silhouettes with restrained, non-sexual framing. Machine lifeforms remain rounded industrial machines; N2 is the Machine Network’s Red Girls projection, not a generic evil child or fantasy demon.',
  visualAnchor: 'Desaturated overgrown city ruins, pale concrete, black YoRHa uniforms, Pod drones and rounded rust-brown machine lifeforms.',
  canonStatus: 'canon NieR:Automata roster and locations',
  fr: '2B, 9S et A2 affrontent les formes de vie mécaniques tandis que le réseau machine remet en cause le récit même de la guerre.',
  en: '2B, 9S and A2 confront machine lifeforms while the Machine Network calls the war’s very narrative into question.',
  referenceUrls: [SOURCES.nier.url, 'https://na.store.square-enix-games.com/nier_-automata-game-of-the-yorha-edition', 'https://nierautomata-anime-en.com/character/'],
  characters: [
    { id: '2b', runtimeId: 'yorha_2b', name: 'YoRHa No. 2 Type B — 2B', role: 'slayer', weapon: 'Virtuous Contract', weaponType: 'blade', secondary: 'Pod 042 barrage', defense: 'Perfect evade', special: 'Bunker black-box burst', visualAnchor: 'Adult combat android in structured black YoRHa dress uniform, white bobbed hair, black eye visor, thigh-high boots and one white-black katana; practical battle stance, no glamour framing.', fr: 'L’androïde de combat 2B exécute les missions YoRHa avec une discipline qui masque un cycle douloureux.', en: 'Combat android 2B carries out YoRHa missions with discipline that conceals a painful cycle.' },
    { id: '9s', runtimeId: 'yorha_9s', name: 'YoRHa No. 9 Type S — 9S', role: 'hacker', weapon: 'Cruel Oath', weaponType: 'blade', secondary: 'Hacking intrusion', defense: 'Scanner evade', special: 'Network breach', visualAnchor: 'Young-adult scanner android with short white hair, black eye visor, structured black shorts uniform, tall boots, scanner satchel and compact black-white sword.', fr: 'Le scanner 9S associe reconnaissance, piratage et curiosité envers les machines.', en: 'Scanner 9S combines reconnaissance, hacking and curiosity about machines.' },
    { id: 'a2', runtimeId: 'yorha_a2', name: 'YoRHa Type A No. 2 — A2', role: 'horror', weapon: 'Type-4O Blade', weaponType: 'blade', secondary: 'Berserk mode', defense: 'Prototype dash', special: 'Type A assault', visualAnchor: 'Adult rogue prototype android with very long white hair, weathered black combat bodysuit remnants, black boots and large pale-edged sword; non-sexual battle framing.', fr: 'Le prototype A2 a déserté YoRHa et combat selon sa propre compréhension de la guerre.', en: 'Prototype A2 deserted YoRHa and fights according to her own understanding of the war.' }
  ],
  monsters: [
    { id: 'small_stubby', name: 'Small Stubby Machine', weapon: 'Tin-arm swing', special: 'Machine group rush', visualAnchor: 'Short rounded rust-brown machine with cylindrical head, glowing yellow eyes, thin pipe arms and tiny wheel-like feet.', fr: 'La petite forme de vie mécanique constitue l’unité la plus reconnaissable du réseau.', en: 'The small machine lifeform is the Network’s most recognizable unit.' },
    { id: 'medium_biped', name: 'Medium Biped Machine', weapon: 'Heavy metal fists', special: 'Armoured spin', visualAnchor: 'Broad rust-brown machine biped with round yellow-eyed head, thick industrial arms and boiler-like torso.', fr: 'Une machine bipède moyenne renforcée pour le combat rapproché.', en: 'A medium biped machine reinforced for close combat.' },
    { id: 'flying_unit', name: 'Flying Machine Lifeform', weapon: 'Energy projectiles', special: 'Aerial ring barrage', visualAnchor: 'Rounded rusted machine suspended beneath twin industrial turbines with yellow optic strip and geometric projectile rings.', fr: 'Une unité volante sature le ciel de projectiles géométriques.', en: 'A flying unit fills the sky with geometric projectiles.' }
  ],
  bosses: [
    { id: 'adam', name: 'Adam', weapon: 'Adaptive machine combat', special: 'Copied technique evolution', visualAnchor: 'Adult pale machine-network humanoid with short white hair, dark fitted trousers and luminous geometric network patterns; no sexual framing.', fr: 'Adam étudie les androïdes et adapte son corps aux combats successifs.', en: 'Adam studies androids and adapts his body through successive fights.' },
    { id: 'simone', name: 'Simone / Beauvoir', weapon: 'Opera-machine appendages', special: 'Hacking theatre', visualAnchor: 'Colossal amusement-park opera machine with red skirt-like armour, gold theatre lights, multiple mechanical arms and a round machine face; no copied poster art.', fr: 'La machine d’opéra Simone transforme le théâtre en projectile et espace de piratage.', en: 'Opera machine Simone turns the theatre into a projectile and hacking arena.' },
    { id: 'eve', name: 'Eve', weapon: 'Machine-network constructs', special: 'Logic-virus rage', visualAnchor: 'Adult pale machine-network humanoid with short white hair, black geometric markings and floating blocks of corrupted city material.', fr: 'La perte d’Adam pousse Eve à utiliser tout le réseau dans une rage destructrice.', en: 'Adam’s loss drives Eve to weaponize the entire Network in destructive rage.' }
  ],
  worldBoss: { id: 'n2', name: 'N2 — The Red Girls', weapon: 'Machine Network consensus', special: 'Tower data recursion', visualAnchor: 'Twin abstract red-haired adult-coded network projections in simple red dresses, composed of red data pixels above the Tower; no realistic children, glamour framing or fantasy magic.', fr: 'N2 est la projection consciente du réseau des formes de vie mécaniques au sommet de la Tour.', en: 'N2 is the conscious projection of the machine lifeform network at the top of the Tower.', canonStatus: 'canon Machine Network projection', entityType: 'network-world-boss', objective: 'Break the Tower recursion and force the Machine Network’s internal contradiction to resolve.' },
  stage: { name: 'Ruines de la ville — camp de la Résistance', visualAnchor: 'Collapsed pale tower blocks overtaken by grass and trees, shallow water, rusted highways and canvas Resistance shelters.', fr: 'Les androïdes traversent une ville reconquise par la végétation et les machines.', en: 'The androids cross a city reclaimed by vegetation and machines.' },
  stageVariants: [stageVariant('Smash', 'Parc d’attractions — théâtre de Simone', 'Very Hard', 'Simone / Beauvoir', { objective: 'Alternate physical defence and hacking-space rescues.' }), stageVariant('Tactics', 'La Tour — récursion du réseau', 'Expert', 'N2 — The Red Girls', { objective: 'Interrupt recursive data branches before the Tower launch.' })],
  gear: [
    { id: 'virtuous_contract', enName: 'Virtuous Contract', frName: 'Contrat vertueux', boost: { atk: 8 }, visualAnchor: 'Slim white-and-black YoRHa katana with square guard, black wrapping and pale geometric etching without readable text.', fr: 'La petite épée blanche emblématique de 2B.', en: '2B’s emblematic white small sword.' },
    { id: 'pod_042', enName: 'Pod 042', frName: 'Pod 042', boost: { def: 5, spd: 2 }, visualAnchor: 'Compact floating gray Pod drone with rectangular body, two articulated tool arms and one central optic.', fr: 'Le Pod 042 fournit tirs, communications et programmes utilitaires.', en: 'Pod 042 supplies fire, communications and utility programs.' },
    { id: 'hacking_unit', enName: 'Scanner Hacking Unit', frName: 'Unité de piratage Scanner', boost: { hp: 45, atk: 4 }, visualAnchor: 'Small black-and-gold scanner module projecting a monochrome geometric hacking grid.', fr: 'Le module de 9S ouvre un espace de piratage dans les systèmes adverses.', en: '9S’s module opens a hacking space inside hostile systems.' }
  ],
  event: { id: 'ending_e', enName: 'Network-Credit Rescue', frName: 'Sauvetage au-delà du réseau', en: 'The Pods reject the expected deletion and reconstruct the three androids through a cooperative projectile trial.', fr: 'Les Pods refusent l’effacement attendu et reconstruisent les trois androïdes par une épreuve coopérative de projectiles.', visualAnchor: 'Abstract monochrome data space with three Pod lights protecting fragmented android memories; no real-world credits or text.' }
});

const noDamageAction = name => Object.freeze({ name, type: 'status', dmg: 0 });

const discipline = definePack(SOURCES.discipline, {
  aliases: ['Discipline H game', 'Discipline: Record of a Crusade'], mediaType: 'visual-novel', faction: 'horror', mode: 'Trial', difficulty: 'Hard',
  colors: ['#4e6377', '#11171d', '#d4b777'], motif: 'academyarchive', theme: 'a strictly non-sexual institutional mystery at Saint Arcadia',
  continuity: '2002 Active Software game, reduced to public metadata, named cast and Saint Arcadia institutional setting',
  adaptationRule: 'STRICT SAFE ADAPTATION: omit every sexual, erotic, nude, exploitative or abuse-related element. All named people are investigators, witnesses or accountable adults in dialogue-only trials. No person is attacked, sexualised or represented as an enemy; only records, locks, hearings and institutional evidence are used.',
  visualAnchor: 'Quiet turn-of-the-century private-academy corridors, blue-gray uniforms, administration ledgers, security consoles and sealed archive rooms; every person fully clothed and neutrally framed.',
  canonStatus: 'heavily sanitised non-sexual investigation adaptation; no adult material reproduced',
  fr: 'Takurou, Saori et Ruri rassemblent des dossiers à Saint Arcadia afin d’éclaircir une dissimulation institutionnelle sans aucun affrontement physique.',
  en: 'Takurou, Saori and Ruri gather records at Saint Arcadia to clarify an institutional cover-up without any physical confrontation.',
  referenceUrls: [SOURCES.discipline.url, 'https://www.animecharactersdatabase.com/source.php?id=1668&tab=Characters'],
  characters: [
    { id: 'takurou_hayami', name: 'Takurou Hayami', role: 'hacker', weapon: 'Archive index', weaponType: 'focus', simple: noDamageAction('Cross-reference ledger'), secondary: noDamageAction('Witness chronology'), defense: 'Leave interview', special: noDamageAction('Complete evidence map'), visualAnchor: 'Fully clothed young-adult transfer student with short dark hair, conservative blue-gray academy uniform, notebook and neutral investigator posture.', fr: 'L’étudiant transféré sert ici uniquement de point de vue pour l’enquête documentaire.', en: 'The transfer student serves only as the viewpoint for the documentary investigation.', canonStatus: 'canon protagonist in strictly nonsexual reinterpretation', nonCombat: true },
    { id: 'saori_otokawa', name: 'Saori Otokawa', role: 'tactical', weapon: 'Witness notebook', weaponType: 'focus', simple: noDamageAction('Record statement'), secondary: noDamageAction('Verify timetable'), defense: 'Pause interview', special: noDamageAction('Corroborated account'), visualAnchor: 'Fully clothed young-adult Saint Arcadia student in conservative blue-gray uniform, tidy dark hair and notebook; neutral portrait, no body emphasis.', fr: 'Saori participe comme témoin et enquêtrice, jamais comme cible ni adversaire.', en: 'Saori participates as witness and investigator, never as target or adversary.', canonStatus: 'canon named student adapted as noncombat investigator', nonCombat: true },
    { id: 'ruri_nonomiya', name: 'Ruri Nonomiya', role: 'hacker', weapon: 'Records terminal', weaponType: 'focus', simple: noDamageAction('Search archive'), secondary: noDamageAction('Restore file'), defense: 'Lock terminal', special: noDamageAction('Audit trail export'), visualAnchor: 'Fully clothed young-adult Saint Arcadia student in conservative academy jacket at a beige records terminal; neutral pose, no sexualisation.', fr: 'Ruri restaure les traces administratives effacées de l’académie.', en: 'Ruri restores deleted administrative traces from the academy.', canonStatus: 'canon named student adapted as noncombat records specialist', nonCombat: true }
  ],
  monsters: [
    { id: 'archive_index', name: 'Saint Arcadia Archive Index', weapon: 'Misfiled catalogue', special: 'Chronology mismatch', visualAnchor: 'Tall card-catalogue cabinet, sealed blue folders and brass date stamps across four organisation states; no person.', fr: 'Une épreuve de classement remet les dossiers dans leur chronologie.', en: 'A cataloguing trial restores records to chronological order.', canonStatus: 'fan-made environmental trial grounded in the canon school setting', entityType: 'archive-trial', nonCombat: true, objective: 'Sort the records and identify the missing index sequence.', objectiveFr: 'Classer les dossiers et identifier la séquence manquante.', victoryCondition: 'catalogue-complete' },
    { id: 'security_checkpoint', name: 'Saint Arcadia Security Checkpoint', weapon: 'Access protocol', special: 'Identity verification', visualAnchor: 'Empty academy reception desk with analog camera monitor, brass visitor bell and three access cards; no guard or weapon.', fr: 'Le groupe doit justifier son accès sans menacer le personnel.', en: 'The group must justify access without threatening staff.', canonStatus: 'fan-made dialogue trial grounded in the academy setting', entityType: 'access-trial', nonCombat: true, objective: 'Present authorised records and obtain archive access through dialogue.', objectiveFr: 'Présenter les autorisations et obtenir l’accès aux archives par le dialogue.', victoryCondition: 'access-authorised' },
    { id: 'sealed_wing', name: 'Sealed Academy Wing', weapon: 'Locked route', special: 'Power-routing puzzle', visualAnchor: 'Empty blue-gray academy corridor with locked fire doors, fuse cabinet and emergency map without readable text.', fr: 'Une aile condamnée devient une épreuve de remise sous tension et d’orientation.', en: 'A sealed wing becomes a power-restoration and navigation trial.', canonStatus: 'fan-made environmental trial', entityType: 'navigation-trial', nonCombat: true, objective: 'Restore safe lighting and open the archive route.', objectiveFr: 'Rétablir l’éclairage sécurisé puis ouvrir la route des archives.', victoryCondition: 'route-open' }
  ],
  bosses: [
    { id: 'reina_hearing', name: 'Reina Morimoto — Administration Hearing', weapon: 'Institutional testimony', special: 'Document challenge', visualAnchor: 'Fully clothed adult academy administrator seated at a formal hearing table with ledgers and recording lamp; no glamour or aggressive pose.', fr: 'Reina est interrogée dans une audience formelle fondée sur les pièces du dossier.', en: 'Reina is questioned in a formal hearing based on documentary evidence.', canonStatus: 'canon named administrator adapted as noncombat hearing', entityType: 'dialogue-trial', nonCombat: true, objective: 'Present the verified chronology and obtain a recorded answer.', objectiveFr: 'Présenter la chronologie vérifiée et obtenir une réponse enregistrée.', victoryCondition: 'testimony-recorded' },
    { id: 'leona_interview', name: 'Leona Morimoto — Recorded Interview', weapon: 'Conflicting account', special: 'Timeline reconciliation', visualAnchor: 'Fully clothed adult-coded academy figure in conservative dark blazer across a neutral interview table, voice recorder visible; no body emphasis.', fr: 'Leona participe à une confrontation de témoignages, jamais à un combat.', en: 'Leona takes part in a testimony confrontation, never a fight.', canonStatus: 'canon named character adapted as noncombat interview', entityType: 'dialogue-trial', nonCombat: true, objective: 'Reconcile conflicting statements without intimidation.', objectiveFr: 'Réconcilier les déclarations contradictoires sans intimidation.', victoryCondition: 'account-reconciled' },
    { id: 'records_vault', name: 'Morimoto Group Records Vault', weapon: 'Encrypted filing system', special: 'Audit-lock cascade', visualAnchor: 'Corporate records room with locked beige cabinets, magnetic tapes and amber terminal lights across four solved states; no person.', fr: 'Le coffre documentaire exige un audit méthodique plutôt qu’une effraction violente.', en: 'The records vault requires a methodical audit rather than violent entry.', canonStatus: 'fan-made environmental trial grounded in the named organisation', entityType: 'records-trial', nonCombat: true, objective: 'Follow the authorised audit trail and recover the missing institutional records.', objectiveFr: 'Suivre la piste d’audit autorisée et récupérer les dossiers manquants.', victoryCondition: 'audit-complete' }
  ],
  worldBoss: { id: 'institutional_coverup', name: 'Saint Arcadia Institutional Cover-Up', weapon: 'Fragmented records', special: 'Accountability hearing', visualAnchor: 'Environmental objective sheet of academy, administration office and corporate archive connected by evidence threads over four reveal states; no person, text or suggestive content.', fr: 'La finale consiste à rendre l’ensemble des faits vérifiables et à transmettre le dossier aux autorités compétentes.', en: 'The finale makes the complete record verifiable and transfers it to the proper authorities.', canonStatus: 'strictly safe fan-made systemic finale', entityType: 'investigation-world-trial', nonCombat: true, objective: 'Complete the evidence chain, protect every witness and submit the accountability report.', objectiveFr: 'Achever la chaîne de preuves, protéger chaque témoin et transmettre le rapport.', victoryCondition: 'report-submitted', spritePrompt: 'Original fan-made pixel-art environmental objective sheet: academy archive, administration office and records vault across four investigation states. No person, nudity, eroticism, sexual content, abuse, violence, logo or text.' },
  stage: { name: 'Saint Arcadia — archives administratives', visualAnchor: 'Empty blue-gray academy archive with fully closed folders, brass lamps and neutral investigation board without readable text.', fr: 'Une enquête documentaire entièrement non violente se déroule dans les archives.', en: 'An entirely nonviolent documentary investigation unfolds in the archives.', canonStatus: 'safe fan-made Trial stage grounded in the canon location' },
  stageVariants: [stageVariant('Trial', 'Aile scellée — remise sous tension', 'Hard', 'Sealed Academy Wing', { objective: 'Restore safe access; no combat or confrontation.', nonCombat: true }), stageVariant('Trial', 'Audience de responsabilité', 'Expert', 'Saint Arcadia Institutional Cover-Up', { objective: 'Submit a complete evidence chain while protecting every witness.', nonCombat: true })],
  gear: [
    { id: 'archive_key', enName: 'Archive Access Key', frName: 'Clé d’accès aux archives', boost: { def: 5, spd: 1 }, visualAnchor: 'Plain brass academy key on blue rectangular tag with no readable writing.', fr: 'Une clé autorisée ouvre les salles documentaires.', en: 'An authorised key opens the records rooms.' },
    { id: 'witness_notebook', enName: 'Witness Notebook', frName: 'Carnet de témoignages', boost: { hp: 50, def: 3 }, visualAnchor: 'Closed navy notebook with elastic strap and blank numbered tabs.', fr: 'Le carnet conserve uniquement les déclarations consenties.', en: 'The notebook keeps only consented statements.' },
    { id: 'audit_tape', enName: 'Audit Backup Tape', frName: 'Bande de sauvegarde d’audit', boost: { hp: 45, spd: 2 }, visualAnchor: 'Beige magnetic backup cartridge in transparent evidence sleeve without text.', fr: 'Une sauvegarde restaure la chronologie administrative.', en: 'A backup restores the administrative chronology.' }
  ],
  event: { id: 'open_archive', enName: 'Open-Archive Review', frName: 'Révision des archives ouvertes', en: 'Every clue is checked in a calm supervised session; completing the record ends the Trial.', fr: 'Chaque indice est vérifié dans une séance calme et supervisée ; la complétion du dossier termine l’épreuve.', visualAnchor: 'Neutral academy reading room with three fully clothed investigators, closed folders and warm desk lamps; no suggestive imagery.' }
});

const bibleBlack = definePack(SOURCES.bibleBlack, {
  aliases: ['Bible Black: The Game'], mediaType: 'visual-novel', faction: 'horror', mode: 'Trial', difficulty: 'Expert',
  colors: ['#4b214c', '#0c090e', '#c7a04a'], motif: 'occultarchive', theme: 'strictly non-sexual occult investigation and grimoire containment',
  continuity: '2000 Active Software game’s school, black-magic book, twelve-year mystery and named cast only',
  adaptationRule: 'STRICT SAFE ADAPTATION: reproduce no sexual, erotic, nude, exploitative or abuse-related material. Every student and adult is fully clothed, neutral and noncombatant. The adaptation concerns only investigation, occult records, rescue, containment and accountability; no person is ever an enemy or combat target.',
  visualAnchor: 'After-hours Japanese school corridors, locked basement archive, old black grimoire, chalk wards and warm flashlight pools; no bodies, nudity, suggestive pose or ritual harm.',
  canonStatus: 'heavily sanitised non-sexual occult Trial adaptation; adult material entirely omitted',
  fr: 'Taki Minase, Kurumi Imari et Hiroko Takashiro retracent l’origine d’un grimoire dangereux afin de le contenir sans blesser personne.',
  en: 'Taki Minase, Kurumi Imari and Hiroko Takashiro trace a dangerous grimoire’s origin in order to contain it without harming anyone.',
  referenceUrls: [SOURCES.bibleBlack.url, 'https://www.animecharactersdatabase.com/allchars.php?id=1892'],
  characters: [
    { id: 'taki_minase', name: 'Taki Minase', role: 'hacker', weapon: 'Occult index cards', weaponType: 'focus', simple: noDamageAction('Compare spell symbols'), secondary: noDamageAction('Trace book history'), defense: 'Close grimoire', special: noDamageAction('Containment notation'), visualAnchor: 'Fully clothed dark-haired school investigator in conservative buttoned uniform, carrying index cards and flashlight; neutral pose, no body emphasis.', fr: 'Minase cherche ici à comprendre et enfermer le livre, sans jamais en utiliser les effets interdits.', en: 'Here Minase seeks to understand and seal the book, never to use its prohibited effects.', canonStatus: 'canon protagonist in strictly nonsexual investigation adaptation', nonCombat: true },
    { id: 'kurumi_imari', name: 'Kurumi Imari', role: 'tactical', weapon: 'Protective ward notes', weaponType: 'focus', simple: noDamageAction('Ward alignment'), secondary: noDamageAction('Safe-route marking'), defense: 'Step outside ward', special: noDamageAction('Fire-seal preparation'), visualAnchor: 'Fully clothed dark-haired school investigator in conservative long-sleeved uniform, holding ward notes; practical neutral framing, no sexualisation.', fr: 'Imari aide à protéger l’équipe et à neutraliser le grimoire.', en: 'Imari helps protect the team and neutralise the grimoire.', canonStatus: 'canon protagonist ally in strictly nonsexual rescue adaptation', nonCombat: true },
    { id: 'hiroko_takashiro', name: 'Hiroko Takashiro', role: 'hacker', weapon: 'Twelve-year archive', weaponType: 'focus', simple: noDamageAction('Restore archive entry'), secondary: noDamageAction('Historical reconstruction'), defense: 'Suspend procedure', special: noDamageAction('Counter-ritual proof'), visualAnchor: 'Fully clothed adult art teacher in conservative blazer and long skirt at an archive table, glasses, file box and neutral professional posture.', fr: 'Takashiro apporte les connaissances historiques nécessaires à la fermeture du cercle.', en: 'Takashiro supplies the historical knowledge needed to close the circle.', canonStatus: 'canon adult ally adapted as noncombat historian', nonCombat: true }
  ],
  monsters: [
    { id: 'basement_seal', name: 'Basement Archive Seal', weapon: 'Rotating ward rings', special: 'Symbol-order puzzle', visualAnchor: 'Empty brick basement door with three chalk ward rings and brass lock across four solved states; no person or readable text.', fr: 'Le sceau du sous-sol exige d’ordonner les symboles sans forcer la porte.', en: 'The basement seal requires ordering symbols without forcing the door.', canonStatus: 'fan-made environmental Trial grounded in the canon basement', entityType: 'occult-lock-trial', nonCombat: true, objective: 'Align the ward rings and open the archive safely.', objectiveFr: 'Aligner les cercles de protection et ouvrir les archives sans danger.', victoryCondition: 'seal-aligned' },
    { id: 'occult_records', name: 'Misfiled Occult Records', weapon: 'Broken chronology', special: 'Twelve-year reconstruction', visualAnchor: 'Dusty school archive shelves, closed black folders and date tabs forming a four-step chronology; no person.', fr: 'Des dossiers épars permettent de reconstruire l’incident ancien sans le représenter.', en: 'Scattered files reconstruct the old incident without depicting it.', canonStatus: 'safe documentary Trial abstraction', entityType: 'archive-trial', nonCombat: true, objective: 'Reconstruct the twelve-year chronology from safe documentary evidence.', objectiveFr: 'Reconstruire les douze années à partir de preuves documentaires sûres.', victoryCondition: 'chronology-complete' },
    { id: 'grimoire_ward', name: 'Unstable Grimoire Ward', weapon: 'Fading chalk boundary', special: 'Containment re-inking', visualAnchor: 'Closed black grimoire centered inside an empty chalk circle, four candle-safe electric lamps and progressively restored boundary lines.', fr: 'La protection autour du livre doit être restaurée avant toute consultation.', en: 'The ward around the book must be restored before any consultation.', canonStatus: 'safe occult-containment Trial', entityType: 'containment-trial', nonCombat: true, objective: 'Restore the complete boundary while keeping the grimoire closed.', objectiveFr: 'Restaurer toute la frontière en gardant le grimoire fermé.', victoryCondition: 'ward-restored' }
  ],
  bosses: [
    { id: 'saeki_interview', name: 'Kaori Saeki — Archive Interview', weapon: 'Conflicting club records', special: 'Membership chronology', visualAnchor: 'Fully clothed school witness in conservative uniform at a supervised library table with closed club ledger; neutral pose, no suggestive framing.', fr: 'Saeki est un témoin à écouter, jamais une ennemie à combattre.', en: 'Saeki is a witness to hear, never an enemy to fight.', canonStatus: 'canon named student adapted as noncombat witness', entityType: 'dialogue-trial', nonCombat: true, objective: 'Verify the club chronology through a supervised interview.', objectiveFr: 'Vérifier la chronologie du club dans un entretien supervisé.', victoryCondition: 'statement-verified' },
    { id: 'kitami_hearing', name: 'Reika Kitami — Evidence Hearing', weapon: 'Occult claim', special: 'Documentary rebuttal', visualAnchor: 'Fully clothed adult school nurse in conservative white medical coat at a formal evidence hearing, record boxes visible; no glamour, weapon or aggressive pose.', fr: 'Les actes occultes de Kitami sont établis par des preuves lors d’une audience non violente.', en: 'Kitami’s occult actions are established through evidence in a nonviolent hearing.', canonStatus: 'canon adult occult antagonist adapted as expose-and-contain Trial', entityType: 'accountability-trial', nonCombat: true, objective: 'Present the complete evidence record and prevent further access to the grimoire.', objectiveFr: 'Présenter l’ensemble des preuves et empêcher tout nouvel accès au grimoire.', victoryCondition: 'evidence-accepted-and-access-revoked' },
    { id: 'ceremony_reconstruction', name: 'Twelve-Year Ceremony Reconstruction', weapon: 'Missing symbol sequence', special: 'Counter-ward derivation', visualAnchor: 'Empty archive room model with miniature floor plan, safe electric lamps and symbolic tiles across four reconstruction states; no person or harmful scene.', fr: 'La reconstitution reste purement documentaire et révèle le contre-sceau.', en: 'The reconstruction remains purely documentary and reveals the counter-ward.', canonStatus: 'safe environmental abstraction of the canon twelve-year mystery', entityType: 'reconstruction-trial', nonCombat: true, objective: 'Derive the counter-ward without reenacting any harmful event.', objectiveFr: 'Déduire le contre-sceau sans rejouer aucun événement dangereux.', victoryCondition: 'counterward-derived' }
  ],
  worldBoss: { id: 'walpurgis_containment', name: 'Walpurgis Night Occult Containment', weapon: 'Expanding ward failure', special: 'Schoolwide seal sequence', visualAnchor: 'Environmental objective sheet of a closed black grimoire, school basement and rooftop ward beacons through four containment states; no person, ritual harm, nudity or text.', fr: 'La finale est une opération de confinement : le livre reste fermé, toutes les protections sont restaurées et chacun est évacué.', en: 'The finale is a containment operation: the book stays closed, every ward is restored and everyone is evacuated.', canonStatus: 'strictly safe systemic occult finale', entityType: 'containment-world-trial', nonCombat: true, objective: 'Evacuate every person, restore the schoolwide wards and permanently seal the grimoire.', objectiveFr: 'Évacuer chaque personne, restaurer les protections de l’école et sceller définitivement le grimoire.', victoryCondition: 'evacuate-ward-and-seal', spritePrompt: 'Original fan-made pixel-art environmental objective sheet: closed black grimoire, empty school basement and ward beacons across four containment states. No person, nudity, eroticism, sexual content, abuse, violence, logo or text.' },
  stage: { name: 'École — sous-sol des archives occultes', visualAnchor: 'Empty old school basement with brick walls, closed storage cabinets, flashlight pools and one sealed grimoire inside a complete chalk boundary.', fr: 'Le sous-sol devient un stage Trial d’enquête et de confinement, sans combat.', en: 'The basement becomes a noncombat investigation and containment Trial stage.', canonStatus: 'safe fan-made Trial stage grounded in the canon school basement' },
  stageVariants: [stageVariant('Trial', 'Archives — chronologie des douze années', 'Hard', 'Twelve-Year Ceremony Reconstruction', { objective: 'Derive the counter-ward from records only.', nonCombat: true }), stageVariant('Trial', 'Nuit de Walpurgis — fermeture du sceau', 'Expert', 'Walpurgis Night Occult Containment', { objective: 'Evacuate, restore wards and seal the closed book.', nonCombat: true })],
  gear: [
    { id: 'sealed_grimoire', enName: 'Sealed Black Grimoire', frName: 'Grimoire noir scellé', boost: { def: 7, hp: 30 }, visualAnchor: 'Closed plain black book wrapped in three pale ward bands, resting in a transparent archive case; no symbols or text.', fr: 'Le livre n’est utilisable qu’en tant qu’objet à confiner.', en: 'The book is usable only as an object to contain.', canonStatus: 'canon object represented only in sealed safe state' },
    { id: 'counterward_cards', enName: 'Counter-Ward Cards', frName: 'Cartes de contre-sceau', boost: { spd: 2, def: 4 }, visualAnchor: 'Three cream index cards with original abstract geometric ward diagrams and blank tabs.', fr: 'Les cartes mémorisent l’ordre sécurisé des protections.', en: 'The cards preserve the safe ward order.' },
    { id: 'archive_flashlight', enName: 'Archive Flashlight', frName: 'Lampe des archives', boost: { hp: 55, spd: 1 }, visualAnchor: 'Simple silver flashlight with warm beam, wrist strap and no branding.', fr: 'Une lampe permet de lire les indices sans ouvrir le livre.', en: 'A flashlight reveals clues without opening the book.' }
  ],
  event: { id: 'seal_review', enName: 'Supervised Seal Review', frName: 'Révision supervisée du sceau', en: 'The three investigators verify every boundary, close the archive and log the sealed object without exposing anyone to danger.', fr: 'Les trois enquêteurs vérifient chaque frontière, ferment les archives et consignent l’objet scellé sans exposer quiconque au danger.', visualAnchor: 'Three fully clothed investigators viewed from behind at a supervised archive desk, sealed case and warm lamps; no suggestive or harmful imagery.' }
});

const hotlineMiami = definePack(SOURCES.hotlineMiami, {
  aliases: ['Hotline Miami franchise', 'Hotline Miami 1 & 2'], mediaType: 'game-franchise', faction: 'horror', mode: 'Smash', difficulty: 'Expert',
  colors: ['#ef2d8f', '#12091a', '#31e3dd'], motif: 'neoncrime', theme: 'surreal ultraviolence, unreliable viewpoints and the conspiracy behind coded phone calls',
  continuity: 'Hotline Miami and Hotline Miami 2: Wrong Number game continuity',
  adaptationRule: 'Use top-down neon crime-game silhouettes, animal masks and unreliable visions without gore. Jacket, Biker and Richter retain distinct masks and motives. 50 Blessings is a systemic conspiracy uncovered through evidence, never a giant logo-creature.',
  visualAnchor: '1980s Miami interiors seen from a steep top-down angle, cyan-magenta neon, patterned carpets, answering machines and rubber animal masks.',
  canonStatus: 'canon two-game roster with non-gory visual adaptation',
  fr: 'Jacket, Biker et Richter suivent puis remontent les appels codés qui relient la mafia russe à la manipulation de 50 Blessings.',
  en: 'Jacket, Biker and Richter follow and then trace the coded calls connecting the Russian Mafia killings to 50 Blessings’ manipulation.',
  referenceUrls: [SOURCES.hotlineMiami.url, 'https://store.steampowered.com/app/219150/Hotline_Miami/', 'https://store.steampowered.com/app/274170/Hotline_Miami_2_Wrong_Number/'],
  characters: [
    { id: 'jacket', name: 'Jacket', role: 'slayer', weapon: 'Baseball bat', weaponType: 'fists', secondary: 'Richard-mask focus', defense: 'Door slam', special: 'One-floor clear', visualAnchor: 'Silent adult man in cream-and-yellow varsity jacket, blue jeans, white sneakers and brown rooster mask carried or worn; steep top-down battle composition, no gore.', fr: 'L’opérateur silencieux reçoit des messages sur son répondeur et frappe la mafia russe.', en: 'The silent operative receives answering-machine messages and strikes the Russian Mafia.' },
    { id: 'biker', name: 'Biker', role: 'slayer', weapon: 'Cleaver and throwing knives', weaponType: 'blade', secondary: 'Knife throw', defense: 'Motorcycle-helmet parry', special: 'Phone Hom breach', visualAnchor: 'Adult man in cyan open vest, white trousers, gloves and bright blue motorcycle helmet, holding cleaver and small knives; no gore.', fr: 'Biker refuse les appels et cherche leur origine dans Phone Hom.', en: 'Biker rejects the calls and searches for their source inside Phone Hom.' },
    { id: 'richter', name: 'Richter', role: 'tactical', weapon: 'Silenced firearm', weaponType: 'gun', secondary: 'Rat-mask infiltration', defense: 'Tape-record route', special: 'Message evidence escape', visualAnchor: 'Adult man in dark green jacket, brown trousers and gray rat mask, compact firearm lowered between encounters; no gore.', fr: 'Richter obéit sous pression tout en conservant les enregistrements de ses appels.', en: 'Richter complies under pressure while retaining recordings of his calls.' }
  ],
  monsters: [
    { id: 'mobster_melee', name: 'Russian Mobster — Melee', weapon: 'Lead pipe', special: 'Room rush', visualAnchor: 'Adult mob guard in white suit trousers and dark shirt carrying a pipe, top-down neon silhouette and no blood.', fr: 'Un garde de la mafia russe attaque au corps à corps.', en: 'A Russian Mafia guard attacks at close range.' },
    { id: 'mobster_gunman', name: 'Russian Mobster — Gunman', weapon: 'Shotgun', special: 'Corridor sightline', visualAnchor: 'Adult mob gunman in pale suit jacket holding blocky shotgun across patterned corridor, steep top-down view and no gore.', fr: 'Le tireur contrôle les longues lignes de vue.', en: 'The gunman controls long sightlines.' },
    { id: 'mob_enforcer', name: 'Russian Mafia Enforcer', weapon: 'Heavy fists', special: 'Armoured rush', visualAnchor: 'Large adult mob enforcer in rolled-sleeve dark shirt and pale trousers with broad top-down silhouette; no gore or body horror.', fr: 'Un colosse de la mafia absorbe les attaques légères.', en: 'A massive Mafia enforcer absorbs light attacks.' }
  ],
  bosses: [
    { id: 'bodyguard', name: 'The Bodyguard', weapon: 'Twin blades', special: 'Panther-room counterattack', visualAnchor: 'Adult woman in black formal combat suit wielding two short blades in the Father’s penthouse, steep top-down view, practical pose and no sexualisation or gore.', fr: 'La garde personnelle du Père protège le penthouse.', en: 'The Father’s personal bodyguard protects the penthouse.', canonStatus: 'canon Hotline Miami boss' },
    { id: 'the_father', name: 'The Father', weapon: 'Russian Mafia command', special: 'Penthouse standoff', visualAnchor: 'Older adult Russian Mafia patriarch in dark suit behind a broad wooden desk, ashtray and balcony lights, no actor likeness or gore.', fr: 'Le patriarche de la mafia attend Jacket au sommet de son quartier général.', en: 'The Mafia patriarch awaits Jacket atop his headquarters.' },
    { id: 'the_son', name: 'The Son', weapon: 'Firearm and drug-fuelled rush', special: 'Apocalypse hallucination', visualAnchor: 'Adult Russian Mafia heir in white suit with teal shirt amid distorted rainbow-neon office geometry, no gore or drug glamour.', fr: 'Le Fils mène les derniers vestiges de la mafia dans Wrong Number.', en: 'The Son leads the Mafia’s remaining forces in Wrong Number.', canonStatus: 'canon Hotline Miami 2 antagonist' }
  ],
  worldBoss: { id: 'fifty_blessings', name: '50 Blessings Call Network', weapon: 'Coerced coded calls', special: 'Political-conspiracy reveal', visualAnchor: 'Environmental objective sheet of answering machines, phone switchboard, puzzle fragments and safe evidence tapes across four reveal states; no flag, logo-creature, gore or person.', fr: 'Biker rassemble les fragments de mot de passe et dévoile le réseau qui orchestre les appels.', en: 'Biker gathers password fragments and exposes the network orchestrating the calls.', canonStatus: 'canon systemic conspiracy adapted as noncombat investigation finale', entityType: 'investigation-world-boss', nonCombat: true, objective: 'Recover every password fragment, decrypt the Phone Hom computer and expose the call network.', objectiveFr: 'Récupérer chaque fragment, déchiffrer l’ordinateur de Phone Hom et dévoiler le réseau d’appels.', victoryCondition: 'decrypt-and-expose', spritePrompt: 'Original fan-made pixel-art environmental objective sheet: answering machine, phone switchboard, puzzle fragments and evidence tapes across four reveal states. No humanoid boss, logos, flags, text, gore or extremist iconography.' },
  stage: { name: 'Miami 1989 — immeuble néon', visualAnchor: 'Steep top-down floor plan with magenta-cyan rooms, patterned carpet, white doors, ringing beige phone and parked car outside.', fr: 'Chaque étage exige une lecture instantanée des portes et lignes de vue.', en: 'Each floor demands immediate reading of doors and sightlines.' },
  stageVariants: [stageVariant('Smash', 'Penthouse du Père', 'Expert', 'The Father', { objective: 'Clear the guarded route and survive the canonical standoff without gore.' }), stageVariant('Trial', 'Phone Hom — déchiffrement', 'Expert', '50 Blessings Call Network', { objective: 'Collect puzzle fragments, decrypt and expose the call network.', nonCombat: true })],
  gear: [
    { id: 'richard_mask', enName: 'Richard Rooster Mask', frName: 'Masque de coq Richard', boost: { atk: 7, spd: 1 }, visualAnchor: 'Brown rubber rooster mask with red comb and round black eye holes, displayed without any wearer.', fr: 'Le masque de coq accompagne les visions de Jacket.', en: 'The rooster mask accompanies Jacket’s visions.' },
    { id: 'answering_machine', enName: 'Coded Answering Machine', frName: 'Répondeur à messages codés', boost: { def: 5, hp: 40 }, visualAnchor: 'Beige 1980s answering machine with blinking red lamp, blank cassette window and no readable numbers.', fr: 'Le répondeur reçoit les appels déguisés en petits travaux.', en: 'The answering machine receives calls disguised as errands.' },
    { id: 'puzzle_fragment', enName: 'Password Puzzle Fragment', frName: 'Fragment de mot de passe', boost: { spd: 2, hp: 45 }, visualAnchor: 'Single lavender pixel-puzzle tile inside clear evidence sleeve, abstract marks only and no text.', fr: 'Les fragments assemblés permettent de déchiffrer l’ordinateur.', en: 'Assembled fragments allow the computer to be decrypted.' }
  ],
  event: { id: 'rewind_floor', enName: 'Rewind the Floor', frName: 'Rembobiner l’étage', en: 'A failed route rewinds instantly, letting all three operatives compare paths through the same neon floor.', fr: 'Un trajet raté se rembobine immédiatement et permet aux trois opérateurs de comparer leurs routes dans le même étage néon.', visualAnchor: 'Top-down neon floor duplicated into three clean route overlays, no text, bodies or gore.' }
});

const spaceMarine = definePack(SOURCES.spaceMarine, {
  aliases: ['Space Marine', 'Warhammer 40K Space Marine'], mediaType: 'game', faction: 'sciFi', mode: 'Smash', difficulty: 'Expert',
  colors: ['#174b91', '#090c10', '#d8b13e'], motif: 'forgeworld', theme: 'Ultramarines defending forge world Graia from Waaagh! Grimskull and Nemeroth’s Chaos incursion',
  continuity: 'Warhammer 40,000: Space Marine (2011) game and Games Workshop’s official Graia recap',
  adaptationRule: 'Titus is the Graia-era Ultramarines Captain, accompanied by Veteran Sergeant Sidonus and Battle-Brother Leandros. Preserve blue power-armour scale, Ork scrap engineering and Nemeroth’s Chaos identity; omit real-world hate symbols and do not blend in Space Marine 2 Tyranid events.',
  visualAnchor: 'Vast industrial Graia manufactorums, cathedral-scale machinery, blue Ultramarines armour, green Orks and purple Warp energy.',
  canonStatus: 'canon Liberation of Graia roster',
  fr: 'Titus, Sidonus et Leandros brisent l’invasion ork de Graia avant d’affronter la tentative d’ascension démoniaque de Nemeroth.',
  en: 'Titus, Sidonus and Leandros break Graia’s Ork invasion before confronting Nemeroth’s attempted daemon ascension.',
  referenceUrls: [SOURCES.spaceMarine.url, 'https://www.warhammer-community.com/en-gb/articles/Okza2M6v/exemplary-battles-of-the-41st-millennium-recreate-an-iconic-scenario-with-lieutenant-titus/', 'https://assets.warhammer-community.com/white-dwarf-498---titus-ojckypvgiu-5addutz7ng.pdf'],
  characters: [
    { id: 'titus', name: 'Captain Demetrian Titus', role: 'marine', weapon: 'Chainsword and bolt pistol', weaponType: 'blade', secondary: 'Fury execution', defense: 'Iron Halo brace', special: 'Ultramarines shock assault', visualAnchor: 'Very tall adult Ultramarines Captain in massive cobalt-blue Mark VII power armour, white-blue captain helm at belt, gold trim, red purity seals, chainsword and bolt pistol; original heraldic marks, no actor likeness.', fr: 'Le capitaine Titus résiste à l’énergie du Warp et dirige la défense de Graia.', en: 'Captain Titus resists Warp energy and leads Graia’s defence.' },
    { id: 'sidonus', name: 'Veteran Sergeant Sidonus', role: 'marine', weapon: 'Bolter', weaponType: 'gun', secondary: 'Veteran covering fire', defense: 'Power-armour guard', special: 'Graia command-squad volley', visualAnchor: 'Very tall scarred adult Ultramarines Veteran Sergeant in cobalt power armour with white-red veteran details, service studs and heavy bolter; no actor likeness.', fr: 'Sidonus apporte l’expérience d’un vétéran de nombreuses campagnes.', en: 'Sidonus brings the experience of a veteran of many campaigns.' },
    { id: 'leandros', name: 'Battle-Brother Leandros', role: 'tactical', weapon: 'Boltgun', weaponType: 'gun', secondary: 'Codex formation', defense: 'Tactical brace', special: 'Command-squad crossfire', visualAnchor: 'Very tall younger-adult Ultramarines battle-brother in clean cobalt power armour with white squad marking and standard boltgun; no actor likeness.', fr: 'Leandros applique strictement le Codex Astartes pendant la mission.', en: 'Leandros follows the Codex Astartes strictly during the mission.' }
  ],
  monsters: [
    { id: 'ork_boy', name: 'Ork Boy', weapon: 'Choppa', special: 'Waaagh rush', visualAnchor: 'Huge muscular green Ork in scrap-metal shoulder plates, rough brown trousers and oversized cleaver-like choppa; original glyph shapes.', fr: 'Le fantassin ork charge au cri de Waaagh.', en: 'The Ork infantryman charges with a Waaagh.' },
    { id: 'shoota_boy', name: 'Shoota Boy', weapon: 'Scrap shoota', special: 'Inaccurate barrage', visualAnchor: 'Green Ork gunner in riveted scrap armour wielding a chunky improvised firearm with pipes and drum magazine.', fr: 'Un Boy équipé d’une arme ork bruyante et imprécise.', en: 'A Boy armed with a loud, inaccurate Ork gun.' },
    { id: 'chaos_marine', name: 'Chosen of Nemeroth Chaos Space Marine', weapon: 'Corrupted bolter', special: 'Warp-armour advance', visualAnchor: 'Very tall corrupted power-armoured warrior in dark crimson-black plates with brass edges and purple Warp cracks; original abstract icon, no hate symbols.', fr: 'Un Space Marine du Chaos de la bande de guerre de Nemeroth.', en: 'A Chaos Space Marine from Nemeroth’s warband.' }
  ],
  bosses: [
    { id: 'ork_nob', name: 'Grimskull’s Ork Nob', weapon: 'Power klaw', special: 'Nob shockwave', visualAnchor: 'Enormous green Ork officer in layered yellow-black scrap armour with hydraulic power claw and tusked jaw.', fr: 'Un Nob massif ouvre la voie à son Warboss.', en: 'A massive Nob clears the way for his Warboss.', canonStatus: 'canon-derived elite Ork class' },
    { id: 'chaos_sorcerer', name: 'Chosen Chaos Sorcerer', weapon: 'Warp staff', special: 'Daemon-host summons', visualAnchor: 'Dark crimson-black power-armoured sorcerer with brass-edged horned helm, purple force staff and restrained Warp flames; no real-world symbols.', fr: 'Un sorcier des Élus verrouille les relais du Fléau.', en: 'A sorcerer of the Chosen locks the Psychic Scourge relays.', canonStatus: 'canon-derived Chosen elite encounter' },
    { id: 'grimskull', name: 'Warboss Grimskull', weapon: 'Power klaw and shoota', special: 'Waaagh! Grimskull', visualAnchor: 'Colossal green Ork Warboss in yellow-black industrial scrap armour, enormous hydraulic claw, shoulder-mounted weapon and broad tusked grin.', fr: 'Grimskull dirige l’invasion ork de Graia et revendique sa source d’énergie.', en: 'Grimskull leads Graia’s Ork invasion and claims its power source.' }
  ],
  worldBoss: { id: 'nemeroth', name: 'Chaos Lord Nemeroth — Daemon Ascension', weapon: 'Warp sorcery and power claw', special: 'Orbital Spire ascension', visualAnchor: 'Towering dark-armoured Chaos Lord at Graia’s orbital spire, brass claw, purple Warp wings forming during ascension and industrial city far below; no borrowed demon design.', fr: 'Nemeroth utilise la source d’énergie et le Fléau pour tenter de s’élever au rang de démon.', en: 'Nemeroth uses the Power Source and Psychic Scourge to attempt daemon ascension.', canonStatus: 'canon game principal antagonist and final encounter', objective: 'Reach the orbital spire and stop Nemeroth before his ascension completes.' },
  stage: { name: 'Graia — Manufactorum Ajakis', visualAnchor: 'Cathedral-scale forge hall with bronze machine columns, blue-white foundry light, weapon conveyors and Ork scrap barricades.', fr: 'Le manufactorum de Graia devient le front principal contre les Orks.', en: 'Graia’s manufactorum becomes the main front against the Orks.' },
  stageVariants: [stageVariant('Smash', 'Graia — pont de Grimskull', 'Expert', 'Warboss Grimskull', { objective: 'Break the Warboss’s armour between power-klaw charges.' }), stageVariant('RPG', 'Flèche orbitale — ascension', 'Expert', 'Chaos Lord Nemeroth — Daemon Ascension', { objective: 'Climb the collapsing spire and interrupt every Warp phase.' })],
  gear: [
    { id: 'chainsword', enName: 'Astartes Chainsword', frName: 'Épée tronçonneuse Astartes', boost: { atk: 8 }, visualAnchor: 'Oversized one-handed cobalt-and-steel chainsword with toothed blade, gold grip guard and original abstract insignia.', fr: 'L’arme de mêlée emblématique du capitaine Titus.', en: 'Captain Titus’s emblematic melee weapon.' },
    { id: 'bolter', enName: 'Astartes Boltgun', frName: 'Bolter Astartes', boost: { def: 4, atk: 5 }, visualAnchor: 'Massive cobalt-blue blocky rifle with box magazine, wide barrel and gold metal panels, no copied chapter logo.', fr: 'Le bolter tire des projectiles autopropulsés.', en: 'The boltgun fires self-propelled rounds.' },
    { id: 'power_source', enName: 'Graia Power Source', frName: 'Source d’énergie de Graia', boost: { hp: 60, spd: 1 }, visualAnchor: 'Compact industrial device with dark metal rings around intense blue-purple energy core and insulated handles.', fr: 'La source recherchée par les défenseurs, Grimskull et Nemeroth.', en: 'The source sought by the defenders, Grimskull and Nemeroth.' }
  ],
  event: { id: 'liberation_graia', enName: 'Liberation of Graia', frName: 'Libération de Graia', en: 'The command squad crosses an Ork-held manufactorum, secures the Titan Invictus and races to the orbital spire.', fr: 'L’escouade de commandement traverse le manufactorum ork, sécurise le Titan Invictus puis fonce vers la flèche orbitale.', visualAnchor: 'Three blue-armoured Ultramarines at correct superhuman scale between Ork scrap barricades and Graia’s cathedral machines.' }
});

const backToTheFuture = definePack(SOURCES.backToTheFuture, {
  aliases: ['Retour vers le futur', 'Back to the Future trilogy'], mediaType: 'movie-franchise', faction: 'tech', mode: 'Trial', difficulty: 'Hard',
  colors: ['#e48a2b', '#102338', '#57d8ef'], motif: 'timetravel', theme: 'Hill Valley time-travel problem solving across 1885, 1955, 1985 and 2015',
  continuity: 'Robert Zemeckis and Bob Gale film trilogy',
  adaptationRule: 'Every stage is a noncombat timing, chase, dialogue or repair Trial. Marty, Doc and Jennifer keep film-era clothing but no actor likeness. The Tannens are pursuers to outwit or lawfully stop, never damage-sponge combat enemies; the timeline is the systemic finale.',
  visualAnchor: 'Hill Valley courthouse square, clock tower, stainless DeLorean time machine, orange fire trails, hoverboards and era-specific storefronts.',
  canonStatus: 'canon film-trilogy characters and setpieces adapted exclusively as noncombat Trials',
  fr: 'Marty, Doc et Jennifer réparent une chaîne d’événements qui traverse quatre époques de Hill Valley sans combattre ses habitants.',
  en: 'Marty, Doc and Jennifer repair a chain of events across four Hill Valley eras without fighting its residents.',
  referenceUrls: [SOURCES.backToTheFuture.url, 'https://www.backtothefuture.com/movies/production-notes-1985', 'https://www.backtothefuture.com/movies/faq'],
  characters: [
    { id: 'marty', runtimeId: 'marty_mcfly', name: 'Marty McFly', role: 'tactical', weapon: 'Skateboard route', weaponType: 'focus', simple: noDamageAction('Skateboard slalom'), secondary: noDamageAction('Guitar timing cue'), defense: 'Dodge pursuit', special: noDamageAction('Clock-tower cable run'), visualAnchor: 'Fully clothed teenage time traveller in red-orange padded vest, denim jacket, jeans and white sneakers with skateboard; stylised original face, no actor likeness.', fr: 'Marty improvise dans chaque époque pour préserver sa famille et revenir en 1985.', en: 'Marty improvises in each era to preserve his family and return to 1985.', nonCombat: true },
    { id: 'doc', runtimeId: 'emmett_brown', name: 'Dr. Emmett “Doc” Brown', role: 'hacker', weapon: 'Time-circuit tools', weaponType: 'focus', simple: noDamageAction('Circuit diagnosis'), secondary: noDamageAction('Temporal calculation'), defense: 'Insulated gloves', special: noDamageAction('1.21-gigawatt synchronisation'), visualAnchor: 'Fully clothed elderly eccentric scientist in white protective coveralls, tool belt and wild white hair beside time circuits; stylised original face, no actor likeness.', fr: 'Doc conçoit la machine temporelle et calcule les solutions impossibles.', en: 'Doc builds the time machine and calculates impossible solutions.', nonCombat: true },
    { id: 'jennifer', runtimeId: 'jennifer_parker', name: 'Jennifer Parker', role: 'tactical', weapon: 'Timeline notes', weaponType: 'focus', simple: noDamageAction('Era comparison'), secondary: noDamageAction('Family-record check'), defense: 'Keep cover identity', special: noDamageAction('2015 route correction'), visualAnchor: 'Fully clothed teenage Hill Valley student in practical denim jacket, patterned trousers and sneakers carrying folded timeline notes; stylised original face, no actor likeness or glamour pose.', fr: 'Jennifer aide à repérer les divergences familiales entre 1985 et 2015.', en: 'Jennifer helps identify family divergences between 1985 and 2015.', nonCombat: true }
  ],
  monsters: [
    { id: 'biff_gang_pursuit', name: 'Biff’s 1955 Gang Pursuit', weapon: 'Convertible chase route', special: 'Manure-truck timing', visualAnchor: 'Environmental chase sheet of black 1940s-style convertible, skateboard route and manure truck across four positions; occupants only as distant silhouettes, no actor likeness.', fr: 'La poursuite se gagne en choisissant l’itinéraire qui envoie le véhicule dans le camion de fumier sans blesser personne.', en: 'The chase is won by choosing the route that sends the car into the manure truck without harming anyone.', canonStatus: 'canon chase setpiece adapted as environmental Trial', entityType: 'chase-trial', nonCombat: true, objective: 'Complete the skateboard route and end the pursuit safely.', objectiveFr: 'Terminer la route en skateboard et mettre fin à la poursuite sans danger.', victoryCondition: 'safe-chase-complete' },
    { id: 'griff_hoverboard_pursuit', name: 'Griff’s 2015 Hoverboard Pursuit', weapon: 'Hoverboard formation', special: 'Courthouse pond trap', visualAnchor: 'Environmental objective sheet of four colourful hoverboards orbiting courthouse square and shallow pond; riders as tiny distant silhouettes only.', fr: 'Marty doit retourner la formation de Griff contre elle-même et laisser la police intervenir.', en: 'Marty must turn Griff’s formation against itself and let police intervene.', canonStatus: 'canon 2015 chase adapted as noncombat Trial', entityType: 'chase-trial', nonCombat: true, objective: 'Escape the hoverboard formation and trigger a lawful arrest without injury.', objectiveFr: 'Échapper à la formation et provoquer une arrestation légale sans blessure.', victoryCondition: 'escape-and-arrest' },
    { id: 'locomotive_timing', name: '1885 Locomotive Timing Window', weapon: 'Accelerating boiler', special: 'Bridge-gap countdown', visualAnchor: 'Steam locomotive pushing the DeLorean toward an unfinished railway bridge, coloured boiler logs and four speed states; no person.', fr: 'Une épreuve de vitesse synchronise la locomotive, les bûches colorées et le pont inachevé.', en: 'A timing Trial synchronises the locomotive, coloured logs and unfinished bridge.', canonStatus: 'canon 1885 setpiece adapted as environmental Trial', entityType: 'timing-trial', nonCombat: true, objective: 'Reach temporal speed before the unfinished bridge while preserving the extraction plan.', objectiveFr: 'Atteindre la vitesse temporelle avant le pont inachevé en préservant l’extraction.', victoryCondition: 'time-speed-reached' }
  ],
  bosses: [
    { id: 'biff_1955', name: 'Biff Tannen — 1955 Chase', weapon: 'History-altering intimidation', special: 'Courthouse-square pursuit', visualAnchor: 'Fully clothed teenage bully in dark leather jacket beside a black convertible at a chase starting line; stylised original face, no actor likeness or combat pose.', fr: 'Biff est évité puis arrêté par les conséquences de sa propre conduite, jamais frappé comme un boss à points de vie.', en: 'Biff is outwitted and stopped by the consequences of his own conduct, never fought as an HP boss.', canonStatus: 'canon antagonist adapted as noncombat chase Trial', entityType: 'chase-boss-trial', nonCombat: true, objective: 'Recover the almanac evidence and end the pursuit safely.', objectiveFr: 'Récupérer la preuve de l’almanach et terminer la poursuite sans danger.', victoryCondition: 'evidence-recovered' },
    { id: 'griff_2015', name: 'Griff Tannen — 2015 Arrest Trap', weapon: 'Hoverboard pursuit', special: 'Glass-wall misdirection', visualAnchor: 'Fully clothed young-adult future bully in purple helmet and colourful protective street gear on hoverboard, stylised face and no actor likeness.', fr: 'Griff doit être entraîné dans un piège de trajectoire puis remis à la police.', en: 'Griff must be drawn into a route trap and handed to police.', canonStatus: 'canon antagonist adapted as noncombat arrest Trial', entityType: 'route-boss-trial', nonCombat: true, objective: 'Redirect the pursuit and let police make the arrest.', objectiveFr: 'Rediriger la poursuite et laisser la police procéder à l’arrestation.', victoryCondition: 'lawful-arrest' },
    { id: 'mad_dog_1885', name: 'Buford “Mad Dog” Tannen — 1885 Standoff', weapon: 'Intimidating standoff', special: 'Stove-plate feint', visualAnchor: 'Fully clothed adult Old West outlaw in dust coat and hat facing a distant stove-door silhouette on Main Street; stylised original face, firearm holstered, no actor likeness.', fr: 'Marty gagne le duel par une ruse défensive et permet l’arrestation de Buford.', en: 'Marty wins the standoff through a defensive trick and enables Buford’s arrest.', canonStatus: 'canon antagonist adapted as noncombat timing Trial', entityType: 'standoff-trial', nonCombat: true, objective: 'Use the defensive plate trick, disarm the situation and enable arrest.', objectiveFr: 'Utiliser la plaque défensive, désamorcer la situation et permettre l’arrestation.', victoryCondition: 'outwit-disarm-arrest' }
  ],
  worldBoss: { id: 'timeline_collapse', name: 'Hill Valley Timeline Collapse', weapon: 'Cascading paradoxes', special: 'Four-era convergence', visualAnchor: 'Environmental objective sheet of Hill Valley courthouse across 1885, 1955, 1985-A and 2015 connected by DeLorean fire trails and fading clock hands; no person or text.', fr: 'L’épreuve finale restaure l’histoire correcte en résolvant les dépendances entre quatre époques.', en: 'The final Trial restores the correct history by resolving dependencies across four eras.', canonStatus: 'canon-inspired systemic time-travel finale', entityType: 'timeline-world-trial', nonCombat: true, objective: 'Restore the McFly timeline, remove the almanac divergence and return each traveller safely.', objectiveFr: 'Restaurer la chronologie McFly, supprimer la divergence de l’almanach et ramener chaque voyageur.', victoryCondition: 'timeline-restored', spritePrompt: 'Original fan-made pixel-art environmental objective sheet: Hill Valley courthouse across four eras, clock hands and DeLorean fire trails. No person, logo, text or combat imagery.' },
  stage: { name: 'Hill Valley 1955 — tour de l’horloge', visualAnchor: 'Rain-soaked courthouse square, stopped clock at 10:04, overhead cable route and stainless DeLorean waiting below.', fr: 'Le stage principal synchronise l’éclair, le câble et la DeLorean.', en: 'The main stage synchronises the lightning strike, cable and DeLorean.' },
  stageVariants: [stageVariant('Trial', 'Hill Valley 2015 — poursuite en hoverboard', 'Hard', 'Griff Tannen — 2015 Arrest Trap', { objective: 'Escape and enable a lawful arrest.', nonCombat: true }), stageVariant('Trial', 'Convergence des quatre époques', 'Expert', 'Hill Valley Timeline Collapse', { objective: 'Resolve every era dependency and restore the timeline.', nonCombat: true })],
  gear: [
    { id: 'flux_capacitor', enName: 'Flux Capacitor', frName: 'Convecteur temporel', boost: { atk: 6, spd: 2 }, visualAnchor: 'Y-shaped glowing tube assembly inside brushed-metal case with bolts and amber wiring, no labels or text.', fr: 'Le cœur en Y rend le voyage temporel possible.', en: 'The Y-shaped core makes time travel possible.' },
    { id: 'hoverboard', enName: '2015 Hoverboard', frName: 'Hoverboard de 2015', boost: { spd: 4 }, visualAnchor: 'Bright pink floating board with pale foot pads and original abstract cyan pattern, no brand text.', fr: 'La planche volante permet de franchir les rues sans roues.', en: 'The flying board crosses streets without wheels.' },
    { id: 'sports_almanac', enName: 'Sports Almanac Evidence', frName: 'Almanach sportif — preuve', boost: { hp: 45, def: 4 }, visualAnchor: 'Closed gray paperback inside transparent evidence sleeve, blank cover with abstract ball shapes and no readable title.', fr: 'L’almanach est conservé comme preuve de la divergence puis détruit dans la chronologie correcte.', en: 'The almanac is held as evidence of the divergence, then destroyed in the correct timeline.' }
  ],
  event: { id: 'lightning_strike', enName: '10:04 Lightning Synchronisation', frName: 'Synchronisation de l’éclair à 22 h 04', en: 'Doc connects the cable while Marty accelerates the DeLorean through the courthouse route at the exact moment.', fr: 'Doc relie le câble pendant que Marty lance la DeLorean sur la route du tribunal au moment exact.', visualAnchor: 'Clock tower lightning, taut overhead cable and DeLorean beneath, with characters only as tiny safe silhouettes.' }
});

const terminator = definePack(SOURCES.terminator, {
  aliases: ['The Terminator', 'Terminator franchise'], mediaType: 'movie-franchise', faction: 'sciFi', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#58616a', '#06080a', '#d3262d'], motif: 'futurewar', theme: 'time-displaced resistance against Skynet and its infiltration machines',
  continuity: 'James Cameron’s The Terminator and Terminator 2: Judgment Day timeline, treated as two labelled missions',
  adaptationRule: 'Sarah is the human centre of the story, Kyle is the 2029 Resistance volunteer and the playable T-800 is explicitly the reprogrammed T2 protector, distinct from the 1984 assassin. Endoskeletons use chrome industrial anatomy and red optics; no performer likeness is reproduced.',
  visualAnchor: 'Blue-black Future War ruins, chrome endoskeletons with red optics, 1980s Los Angeles, Cyberdyne laboratories and industrial steelworks.',
  canonStatus: 'canon T1–T2 film-duology roster with identity labels',
  fr: 'Sarah Connor, Kyle Reese et le T-800 protecteur ferment la boucle qui permettrait à Skynet d’assurer sa propre création.',
  en: 'Sarah Connor, Kyle Reese and the protector T-800 close the loop that would allow Skynet to ensure its own creation.',
  referenceUrls: ['https://skydance.com/news/linda-hamilton-set-return-terminator-franchise/', 'https://www.terminator2d.com/', 'https://skydance.com/film/terminator-genisys/'],
  characters: [
    { id: 'sarah_connor', name: 'Sarah Connor', role: 'tactical', weapon: 'Pump-action shotgun', weaponType: 'gun', secondary: 'Prepared escape route', defense: 'Covering roll', special: 'No-fate counterattack', visualAnchor: 'Fully clothed adult resistance survivor with long practical hair, dark field jacket over gray shirt, cargo trousers and pump-action shotgun; muscular but not sexualised, original face and no actor likeness.', fr: 'Sarah passe de cible de 1984 à stratège déterminée qui refuse le destin de Skynet.', en: 'Sarah grows from Skynet’s 1984 target into a determined strategist who rejects its future.' },
    { id: 'kyle_reese', name: 'Kyle Reese', role: 'marine', weapon: 'Sawn-off shotgun', weaponType: 'gun', secondary: 'Pipe-bomb throw', defense: 'Future-war cover', special: 'Temporal-guardian assault', visualAnchor: 'Fully clothed adult Resistance soldier in worn gray-green field coat, layered shirt, utility trousers, shotgun and homemade charges; exhausted original face, no actor likeness.', fr: 'Le soldat de la Résistance se porte volontaire pour protéger Sarah en 1984.', en: 'The Resistance soldier volunteers to protect Sarah in 1984.' },
    { id: 't800_protector', runtimeId: 't800_protector_t2', name: 'T-800 Model 101 — T2 Protector', role: 'marine', weapon: 'Winchester shotgun', weaponType: 'gun', secondary: 'Endoskeleton strength', defense: 'Living-tissue guard', special: 'Hasta-la-vista strike', visualAnchor: 'Adult-sized protector cyborg in black leather biker jacket, dark trousers and boots, holding lever-action shotgun; damaged areas reveal chrome endoskeleton and one red optic, original face with no performer likeness.', fr: 'Un T-800 reprogrammé par la Résistance protège John et apprend la valeur de la vie humaine.', en: 'A Resistance-reprogrammed T-800 protects John and learns the value of human life.', canonStatus: 'canon T2 reprogrammed protector; distinct from 1984 assassin', identityRule: 'Never reuse the T1 assassin runtime identity.' }
  ],
  monsters: [
    { id: 't800_endoskeleton', name: 'T-800 Endoskeleton Unit', weapon: 'Westinghouse plasma rifle', special: 'Red-optic target lock', visualAnchor: 'Tall chrome humanoid combat endoskeleton with exposed hydraulic joints, skull-like metal cranium and two red optics in blue-black ruins.', fr: 'L’unité d’infanterie de Skynet avance dans les ruines de 2029.', en: 'Skynet’s infantry unit advances through the ruins of 2029.' },
    { id: 'hk_aerial', name: 'Hunter-Killer Aerial', weapon: 'Twin plasma cannons', special: 'Searchlight sweep', visualAnchor: 'Large armored black-chrome Skynet aircraft with flat angular wings, twin engines, red sensor slit and blue searchlight over ruins.', fr: 'Le chasseur aérien recherche les survivants sous ses projecteurs.', en: 'The aerial hunter searches for survivors beneath its lights.' },
    { id: 'hk_tank', name: 'Hunter-Killer Tank', weapon: 'Tracked plasma cannons', special: 'Rubble advance', visualAnchor: 'Massive chrome-black tracked machine with raised turret, twin red sensors and two plasma cannons crushing through concrete ruins.', fr: 'Le char Hunter-Killer verrouille les accès au complexe Skynet.', en: 'The Hunter-Killer tank locks the approaches to the Skynet complex.' }
  ],
  bosses: [
    { id: 't800_assassin_1984', name: 'T-800 Model 101 — 1984 Assassin', weapon: 'Hardballer pistol and endoskeleton strength', special: 'Police-station pursuit', visualAnchor: 'Adult-sized 1984 infiltrator in gray jacket, dark trousers and boots; late phase reveals chrome endoskeleton and red optics, stylised original human disguise with no actor likeness or gore.', fr: 'Le T-800 envoyé en 1984 poursuit Sarah jusqu’à perdre son enveloppe humaine.', en: 'The T-800 sent to 1984 pursues Sarah until its human covering is lost.', canonStatus: 'canon T1 assassin; distinct from playable T2 protector', identityRule: 'Never present as the protector T-800.' },
    { id: 't1000', name: 'T-1000', weapon: 'Mimetic-polyalloy blades', special: 'Liquid-metal recovery', visualAnchor: 'Slender adult infiltrator in fully buttoned police-style uniform, body transitioning into smooth silver liquid-metal forms and blade arms; original face, no actor likeness or gore.', fr: 'Le prototype en métal liquide copie les apparences et se reconstitue après les impacts.', en: 'The liquid-metal prototype copies appearances and reforms after impacts.' },
    { id: 'cyberdyne_vault', name: 'Cyberdyne CPU Evidence Vault', weapon: 'Timed security lockdown', special: 'Chip-and-arm extraction', visualAnchor: 'Environmental objective sheet of secure laboratory vault, chrome CPU fragment and robot arm evidence across four shutdown states; no person or readable text.', fr: 'Le groupe doit extraire puis détruire les éléments qui mèneraient à Skynet.', en: 'The group must extract and then destroy the components that would lead to Skynet.', canonStatus: 'canon-object environmental Trial', entityType: 'sabotage-trial', nonCombat: true, objective: 'Recover the CPU and arm evidence, evacuate staff and safely destroy the lab records.', objectiveFr: 'Récupérer le processeur et le bras, évacuer le personnel et détruire les données.', victoryCondition: 'evidence-destroyed' }
  ],
  worldBoss: { id: 'skynet_defense_grid', name: 'Skynet Defense Grid', weapon: 'Global machine command network', special: 'Time-displacement contingency', visualAnchor: 'Vast underground machine network of red-lit server columns, defense map lights, HK assembly lines and time-displacement rings; no humanoid face, throne or logo.', fr: 'Skynet est une intelligence distribuée : la finale neutralise sa grille de défense et sa dernière contingence temporelle.', en: 'Skynet is a distributed intelligence: the finale neutralises its defense grid and final time-displacement contingency.', canonStatus: 'canon systemic antagonist adapted as infrastructure world boss', entityType: 'network-world-boss', objective: 'Breach the defense grid, shut down HK command and secure the time-displacement equipment.' },
  stage: { name: 'Los Angeles 2029 — ruines de la Résistance', visualAnchor: 'Nighttime concrete ruins under cold blue plasma fire, crushed vehicles, underground Resistance shelter and distant HK searchlights.', fr: 'La Résistance progresse sous les patrouilles de Hunter-Killers.', en: 'The Resistance advances beneath Hunter-Killer patrols.' },
  stageVariants: [stageVariant('Tactics', 'Los Angeles 1984 — usine automatisée', 'Very Hard', 'T-800 Model 101 — 1984 Assassin', { objective: 'Use factory machines and the hydraulic press to stop the exposed endoskeleton.' }), stageVariant('RPG', 'Complexe Skynet — grille de défense', 'Expert', 'Skynet Defense Grid', { objective: 'Disable command, HK assembly and time-displacement systems in order.' })],
  gear: [
    { id: 'plasma_rifle', enName: 'Resistance Plasma Rifle', frName: 'Fusil plasma de la Résistance', boost: { atk: 8 }, visualAnchor: 'Chunky dark-gray future rifle with vented barrel, blue-white plasma chamber and fabric sling, no branding.', fr: 'Une arme du champ de bataille de 2029.', en: 'A weapon from the 2029 battlefield.' },
    { id: 'cpu_evidence', enName: 'T-800 CPU Evidence', frName: 'Processeur T-800 — preuve', boost: { def: 6, hp: 35 }, visualAnchor: 'Small chrome neural-net processor with red crystal center sealed inside transparent evidence case, no text.', fr: 'Le processeur récupéré en 1984 accélérerait la création de Skynet.', en: 'The processor recovered in 1984 would accelerate Skynet’s creation.' },
    { id: 'pipe_bomb', enName: 'Kyle’s Pipe Bomb', frName: 'Bombe artisanale de Kyle', boost: { atk: 5, spd: 2 }, visualAnchor: 'Short capped metal pipe with cloth wrapping, simple mechanical timer and no exposed explosive material.', fr: 'Kyle assemble des charges avec les moyens de 1984.', en: 'Kyle assembles charges from 1984 materials.' }
  ],
  event: { id: 'no_fate', enName: 'No Fate but What We Make', frName: 'Pas de destin sauf celui que nous forgeons', en: 'Sarah links the 1984 evidence, the 1995 Cyberdyne raid and the 2029 grid assault into one causality-breaking operation.', fr: 'Sarah relie les preuves de 1984, le raid de 1995 et l’assaut de 2029 en une opération qui brise la causalité.', visualAnchor: 'Three separate era panels connected by a fading red Skynet signal, with no actor likeness or copied film frame.' }
});

const robocop = definePack(SOURCES.robocop, {
  aliases: ['RoboCop franchise', 'Robocop'], mediaType: 'movie-franchise', faction: 'tech', mode: 'Tactics', difficulty: 'Very Hard',
  colors: ['#7c9daf', '#0a1117', '#c62c32'], motif: 'ocpdetroit', theme: 'cyborg policing and corporate corruption in Old Detroit',
  continuity: 'Orion’s original RoboCop film trilogy, with threats labelled by film',
  adaptationRule: 'Alex Murphy’s identity remains central beneath the silver-blue armour. Lewis and Reed are human police allies; no actor likeness. ED-209, RoboCop 2/Cain and Otomo retain distinct film designs. Dick Jones is exposed and arrested through evidence rather than promoted to a giant combat monster.',
  visualAnchor: 'Rainy Old Detroit, silver-blue cyborg armour, OCP glass towers, police precinct fluorescents and heavy stop-motion machines.',
  canonStatus: 'canon original-film-trilogy anthology with lawful-arrest objectives',
  fr: 'RoboCop, Lewis et le sergent Reed défendent Old Detroit contre les gangs, les machines défectueuses et les projets d’OCP.',
  en: 'RoboCop, Lewis and Sergeant Reed defend Old Detroit from gangs, malfunctioning machines and OCP projects.',
  referenceUrls: ['https://www.mgm.com/', 'https://www.criterion.com/films/542-robocop', 'https://www.mgm.com/movies/robocop-2'],
  characters: [
    { id: 'robocop', runtimeId: 'alex_murphy_robocop', name: 'Alex Murphy / RoboCop', role: 'marine', weapon: 'Auto-9', weaponType: 'gun', secondary: 'Targeting burst', defense: 'Titanium-armour guard', special: 'Prime-directive sweep', visualAnchor: 'Very tall silver-blue armored police cyborg with black ribbed joints, exposed lower human face, blue visor slit, right-thigh holster and three-round-burst pistol; original face, no actor likeness.', fr: 'La mémoire et le jugement d’Alex Murphy persistent sous la programmation de RoboCop.', en: 'Alex Murphy’s memory and judgement persist beneath RoboCop’s programming.' },
    { id: 'anne_lewis', name: 'Officer Anne Lewis', role: 'tactical', weapon: 'Police sidearm', weaponType: 'gun', secondary: 'Partner covering fire', defense: 'Patrol-car cover', special: 'Metro West response', visualAnchor: 'Fully clothed adult Detroit police officer in practical dark navy patrol uniform, short hair, ballistic vest and sidearm; original face, no actor likeness or sexualisation.', fr: 'Lewis reconnaît Murphy et reste son alliée la plus constante.', en: 'Lewis recognises Murphy and remains his most constant ally.' },
    { id: 'warren_reed', name: 'Sergeant Warren Reed', role: 'tactical', weapon: 'Precinct command', weaponType: 'focus', secondary: 'Police coordination', defense: 'Evacuation order', special: 'Metro West reinforcement', visualAnchor: 'Fully clothed older adult precinct sergeant in dark navy shirt, duty belt and rolled command papers at Metro West desk; original face, no actor likeness.', fr: 'Reed maintient le commissariat malgré les pressions d’OCP et la grève.', en: 'Reed holds the precinct together despite OCP pressure and the strike.', canonStatus: 'canon police ally adapted as tactical support' }
  ],
  monsters: [
    { id: 'boddicker_gunman', name: 'Boddicker Gang Gunman', weapon: 'Submachine gun', special: 'Steel-mill ambush', visualAnchor: 'Adult Old Detroit criminal in fully clothed work jacket, cargo trousers and compact blocky firearm among steel-mill pipes; no actor likeness or gore.', fr: 'Un homme armé du gang de Boddicker utilise l’aciérie comme couverture.', en: 'A Boddicker gang gunman uses the steel mill for cover.' },
    { id: 'nuke_gang_thug', name: 'Nuke Gang Thug', weapon: 'Improvised firearm', special: 'Arcade raid', visualAnchor: 'Fully clothed adult street criminal in colorful 1990 jacket and protective pads with firearm lowered between attacks; no drug glamour, actor likeness or gore.', fr: 'Un membre du gang de Cain saccage Old Detroit.', en: 'A member of Cain’s gang raids Old Detroit.', canonStatus: 'canon RoboCop 2 enemy class' },
    { id: 'ocp_mercenary', name: 'OCP Rehab Mercenary', weapon: 'Assault rifle', special: 'Urban-clearance formation', visualAnchor: 'Adult corporate paramilitary in gray-black enclosed tactical armour, blank visor and blocky rifle; original abstract patch, no real-world insignia.', fr: 'Une unité privée intervient pour le programme Rehab dans RoboCop 3.', en: 'A private unit deploys for the Rehab program in RoboCop 3.', canonStatus: 'canon RoboCop 3 enemy class' }
  ],
  bosses: [
    { id: 'clarence_boddicker', name: 'Clarence Boddicker', weapon: 'Cobra assault cannon', special: 'Steel-mill trap', visualAnchor: 'Fully clothed adult Old Detroit crime boss in glasses, dark vest and work trousers near steel-mill machinery, stylised original face with no actor likeness or gore.', fr: 'Boddicker dirige le gang protégé par Dick Jones.', en: 'Boddicker leads the gang protected by Dick Jones.' },
    { id: 'ed209', name: 'ED-209', weapon: 'Twin autocannons', special: 'Staircase malfunction', visualAnchor: 'Huge top-heavy blue-gray enforcement droid with chicken-like armored legs, boxy sensor head and twin multi-barrel arm cannons, correct stop-motion proportions.', fr: 'Le prototype lourd d’OCP compense mal sa puissance par une mobilité défaillante.', en: 'OCP’s heavy prototype poorly balances its firepower with flawed mobility.' },
    { id: 'otomo', name: 'Otomo Android', weapon: 'Katana', special: 'Synthetic duplicate attack', visualAnchor: 'Adult-sized fully clothed corporate android in neat dark business suit wielding katana, subtle mechanical seams after damage; original face, no actor likeness or ethnic caricature.', fr: 'Les androïdes Otomo de Kanemitsu défendent le projet Delta City.', en: 'Kanemitsu’s Otomo androids defend the Delta City project.', canonStatus: 'canon RoboCop 3 android opponent' }
  ],
  worldBoss: { id: 'robocop2_cain', name: 'RoboCop 2 / Cain', weapon: 'Heavy cannons and hydraulic claws', special: 'OCP tower rampage', visualAnchor: 'Towering irregular blue-gray cyborg machine with Cain’s human brain case hidden within, multiple hydraulic legs, sensor stalks, claw arms and large shoulder gun; no exposed brain detail or gore.', fr: 'OCP place l’esprit de Cain dans le massif prototype RoboCop 2, qui échappe à tout contrôle.', en: 'OCP installs Cain’s mind in the massive RoboCop 2 prototype, which escapes all control.', canonStatus: 'canon RoboCop 2 final machine', objective: 'Separate Cain from civilians, disable the heavy chassis and secure the control module.' },
  stage: { name: 'Old Detroit — aciérie abandonnée', visualAnchor: 'Rainy derelict steel mill with rusted gantries, hanging chains, puddles, furnace glow and police spotlights.', fr: 'L’ancienne aciérie sert de repaire au gang de Boddicker.', en: 'The old steel mill serves as Boddicker’s gang hideout.' },
  stageVariants: [stageVariant('Tactics', 'OCP Tower — démonstration ED-209', 'Very Hard', 'ED-209', { objective: 'Exploit the droid’s turn radius and staircase limitation.' }), stageVariant('Smash', 'Civic Centrum — RoboCop 2', 'Expert', 'RoboCop 2 / Cain', { objective: 'Evacuate civilians, isolate the chassis and secure its control module.' })],
  gear: [
    { id: 'auto9', enName: 'Auto-9', frName: 'Auto-9', boost: { atk: 8 }, visualAnchor: 'Long-barrel black three-round-burst machine pistol with angular compensator and enlarged trigger guard, no branding.', fr: 'L’arme de service logée dans la cuisse de RoboCop.', en: 'RoboCop’s service weapon stored in his thigh holster.' },
    { id: 'cobra_cannon', enName: 'Cobra Assault Cannon', frName: 'Canon d’assaut Cobra', boost: { atk: 6, def: 3 }, visualAnchor: 'Oversized dark-green anti-materiel rifle with long vented barrel and wide rectangular receiver, no text.', fr: 'Une arme lourde capable d’endommager les machines OCP.', en: 'A heavy weapon capable of damaging OCP machines.' },
    { id: 'data_spike', enName: 'RoboCop Data Spike', frName: 'Pointe de données RoboCop', boost: { hp: 50, spd: 2 }, visualAnchor: 'Retractable chrome three-sided interface spike extending from a silver-blue armored fist, shown without injury.', fr: 'L’interface permet à RoboCop d’accéder aux systèmes OCP.', en: 'The interface lets RoboCop access OCP systems.' }
  ],
  event: { id: 'directive_four', enName: 'Directive Four Override', frName: 'Neutralisation de la Directive Quatre', en: 'Murphy links Boddicker’s confession to Dick Jones, survives the OCP lockout and presents the evidence to the board.', fr: 'Murphy relie les aveux de Boddicker à Dick Jones, résiste au verrouillage OCP et présente les preuves au conseil.', visualAnchor: 'Silver-blue RoboCop at OCP boardroom threshold, evidence recorder lit and every human kept as distant safe silhouette.' }
});

const walkingDead = definePack(SOURCES.walkingDead, {
  aliases: ['The Walking Dead game', 'Telltale’s The Walking Dead'], mediaType: 'game-franchise', faction: 'horror', mode: 'RPG', difficulty: 'Expert',
  colors: ['#5a5b47', '#11120e', '#b5543f'], motif: 'graphicblack', theme: 'choice-driven survival and guardianship across Clementine’s Telltale journey',
  continuity: 'The Walking Dead: The Telltale Definitive Series, with each character and antagonist labelled by season',
  adaptationRule: 'Use the games’ Graphic Black inked style, not TV actor likenesses. Lee, Clementine and Kenny form an anthology team, not a rewritten resurrection. Walkers are the only combat enemies; living antagonists are dialogue, escape, rescue or lawful-restraint Trials and victims/noncombatants are never targets.',
  visualAnchor: 'Hand-inked Graphic Black Georgia roads, abandoned Savannah blocks, walkers in silhouette, Clementine’s cap and choice-driven dialogue framing.',
  canonStatus: 'canon Telltale/Skybound game-series anthology with noncombat living-person encounters',
  fr: 'Lee, Clementine et Kenny protègent leur groupe à travers des choix difficiles, des hordes de rôdeurs et des communautés dangereuses.',
  en: 'Lee, Clementine and Kenny protect their group through difficult choices, walker herds and dangerous communities.',
  referenceUrls: ['https://help.skybound.com/support/solutions/folders/30000056389', 'https://community.telltale.com/discussion/50296/meet-the-walking-dead-survivors-lee-and-clementine', 'https://www.skybound.com/clementine'],
  characters: [
    { id: 'lee_everett', name: 'Lee Everett', role: 'tactical', weapon: 'Fire axe', weaponType: 'blade', secondary: 'Guardian’s call', defense: 'Door brace', special: 'Savannah rescue route', visualAnchor: 'Fully clothed adult survivor in blue-gray button shirt with rolled sleeves, dark trousers, backpack strap and fire axe, rendered in heavy inked Graphic Black style; original face, no gore.', fr: 'Lee devient le protecteur et le guide de Clementine au début de l’épidémie.', en: 'Lee becomes Clementine’s protector and guide at the outbreak’s beginning.', canonStatus: 'canon Season One protagonist represented as anthology memory ally' },
    { id: 'clementine', runtimeId: 'clementine_final_season', name: 'Clementine — Final Season', role: 'tactical', weapon: 'Survival knife', weaponType: 'blade', secondary: 'AJ guidance', defense: 'Walker-step evade', special: 'Ericson defence plan', visualAnchor: 'Fully clothed older-teen survivor in weathered blue baseball cap with white D mark, dark denim jacket, gray shirt, practical trousers and boots, inked Graphic Black style; no sexualisation or gore.', fr: 'Devenue protectrice à son tour, Clementine cherche un foyer durable pour AJ.', en: 'Now a protector herself, Clementine seeks a lasting home for AJ.', canonStatus: 'canon Final Season protagonist; age-appropriate nonsexual depiction' },
    { id: 'kenny', name: 'Kenny', role: 'marine', weapon: 'Crowbar', weaponType: 'fists', secondary: 'Boat-route push', defense: 'Group cover', special: 'Family-first breakthrough', visualAnchor: 'Fully clothed adult survivor with brown moustache, worn tan cap, beige work shirt, jeans and crowbar, heavy inked Graphic Black style; original face, no gore.', fr: 'Kenny place sa famille et son groupe au centre de chacune de ses décisions.', en: 'Kenny places family and group at the centre of every decision.', canonStatus: 'canon Seasons One–Two ally represented in anthology roster' }
  ],
  monsters: [
    { id: 'walker', name: 'Walker', weapon: 'Grab and bite', special: 'Slow crowd pressure', visualAnchor: 'Decayed adult walker in torn but fully covering everyday clothes, gray-green skin and ink-black shadowed face; no exposed organs, blood or gore.', fr: 'Un rôdeur isolé devient mortel lorsqu’il bloque une issue.', en: 'A lone walker becomes deadly when it blocks an exit.' },
    { id: 'lurker', name: 'Hidden Lurker', weapon: 'Floor-level grab', special: 'Blind-corner ambush', visualAnchor: 'Adult walker silhouette partly hidden beneath abandoned car, fully clothed with gray hands visible; inked Graphic Black style and no gore.', fr: 'Un rôdeur immobile attend dans un angle mort.', en: 'A motionless walker waits in a blind spot.' },
    { id: 'armoured_walker', name: 'Armoured Walker', weapon: 'Protected grapple', special: 'Helmet deflection', visualAnchor: 'Adult walker in intact riot helmet and padded protective uniform, gray hands and ink-black visor, no police logo, gore or exposed anatomy.', fr: 'Un équipement intact protège encore la tête du rôdeur.', en: 'Intact equipment still protects the walker’s head.' }
  ],
  bosses: [
    { id: 'the_stranger', name: 'The Stranger — Motel Room Rescue', weapon: 'Hostage dialogue', special: 'Past-choice accusations', visualAnchor: 'Fully clothed adult man seated across a motel-room table with radio and locked door, face obscured by Graphic Black hatching; no weapon pose, child danger or gore.', fr: 'Lee doit maintenir le dialogue, ouvrir une voie sûre et ramener Clementine.', en: 'Lee must maintain dialogue, open a safe route and bring Clementine back.', canonStatus: 'canon Season One antagonist adapted as rescue/dialogue Trial', entityType: 'rescue-trial', nonCombat: true, objective: 'Keep Clementine safe, de-escalate the room and complete the rescue.', objectiveFr: 'Protéger Clementine, apaiser la situation et terminer le sauvetage.', victoryCondition: 'deescalate-and-rescue' },
    { id: 'carver', name: 'William Carver — Howe’s Escape', weapon: 'Settlement control', special: 'Lockdown order', visualAnchor: 'Fully clothed adult settlement leader in dark field jacket at Howe’s office desk, keys and PA console visible; original face, no actor likeness, weapon or gore.', fr: 'Le groupe échappe au contrôle de Carver en ouvrant les accès et en évacuant tous les prisonniers.', en: 'The group escapes Carver’s control by opening routes and evacuating every prisoner.', canonStatus: 'canon Season Two antagonist adapted as noncombat escape Trial', entityType: 'escape-trial', nonCombat: true, objective: 'Unlock Howe’s routes, free detainees and escape without executing anyone.', objectiveFr: 'Ouvrir les accès de Howe’s, libérer les détenus et partir sans exécuter personne.', victoryCondition: 'free-and-escape' },
    { id: 'lilly', name: 'Lilly — Delta Boat Rescue', weapon: 'Raid command', special: 'Prisoner-transfer countdown', visualAnchor: 'Fully clothed adult Delta commander in dark tactical coat on boat bridge with radio and route map, Graphic Black style; original face, no actor likeness or gore.', fr: 'Clementine libère les captifs et immobilise le bateau sans faire de Lilly une cible à abattre.', en: 'Clementine frees the captives and disables the boat without turning Lilly into a kill target.', canonStatus: 'canon Final Season antagonist adapted as rescue/sabotage Trial', entityType: 'rescue-trial', nonCombat: true, objective: 'Free every captive, disable the boat and evacuate safely.', objectiveFr: 'Libérer chaque captif, immobiliser le bateau et évacuer sans danger.', victoryCondition: 'captives-evacuated' }
  ],
  worldBoss: { id: 'savannah_herd', name: 'Savannah Walker Herd', weapon: 'Citywide crowd pressure', special: 'Breach-route convergence', visualAnchor: 'Environmental objective sheet of inked Savannah streets filling with fully clothed walker silhouettes across four density states, rooftop route and open evacuation gate; no gore.', fr: 'La horde est une menace systémique à traverser et détourner, pas une créature géante inventée.', en: 'The herd is a systemic threat to cross and redirect, not an invented giant creature.', canonStatus: 'canon systemic walker threat adapted as survival world boss', entityType: 'herd-world-boss', objective: 'Open the rooftop route, redirect the herd and evacuate the complete group.' },
  stage: { name: 'Savannah — rues en Graphic Black', visualAnchor: 'Abandoned Georgia street in high-contrast ink style, boarded storefronts, rooftops, fallen street signs and distant walker silhouettes without gore.', fr: 'Les choix d’itinéraire et le bruit déterminent le mouvement de la horde.', en: 'Route choices and noise determine the herd’s movement.' },
  stageVariants: [stageVariant('Trial', 'Howe’s Hardware — évasion', 'Very Hard', 'William Carver — Howe’s Escape', { objective: 'Free detainees and escape; living people are never combat targets.', nonCombat: true }), stageVariant('Tactics', 'Savannah — convergence de la horde', 'Expert', 'Savannah Walker Herd', { objective: 'Redirect the herd and evacuate everyone.' })],
  gear: [
    { id: 'clementine_cap', enName: 'Clementine’s Cap', frName: 'Casquette de Clementine', boost: { hp: 55, def: 3 }, visualAnchor: 'Weathered blue baseball cap with pale front panel and original simple white D-shaped stitch, displayed alone.', fr: 'La casquette accompagne Clementine durant toute sa croissance.', en: 'The cap accompanies Clementine throughout her growth.' },
    { id: 'walkie_talkie', enName: 'Clementine’s Walkie-Talkie', frName: 'Talkie-walkie de Clementine', boost: { spd: 2, def: 4 }, visualAnchor: 'Small gray-black handheld radio with long antenna, green status lamp and blank speaker grid.', fr: 'Le talkie-walkie relie Lee à Clementine et devient un indice dangereux.', en: 'The walkie-talkie links Lee to Clementine and becomes a dangerous clue.' },
    { id: 'fire_axe', enName: 'Lee’s Fire Axe', frName: 'Hache d’incendie de Lee', boost: { atk: 7, hp: 30 }, visualAnchor: 'Practical red-headed fire axe with wooden handle, wear marks and no blood.', fr: 'Lee utilise cette hache contre les rôdeurs et les portes bloquées.', en: 'Lee uses this axe against walkers and blocked doors.' }
  ],
  event: { id: 'choice_echoes', enName: 'Choice Echoes', frName: 'Échos des choix', en: 'Three earlier decisions reappear as route constraints; the team must protect every survivor rather than optimise a kill count.', fr: 'Trois décisions antérieures reviennent comme contraintes d’itinéraire ; l’équipe protège chaque survivant au lieu d’optimiser un nombre d’éliminations.', visualAnchor: 'Three blank dialogue-choice panels reflected in an inked road sign, survivors kept as safe distant silhouettes.' }
});

const horizonZeroDawn = definePack(SOURCES.horizon, {
  aliases: ['Horizon zéro dans', 'Horizon Zero Dawn Remastered'], mediaType: 'game', faction: 'tech', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#4b8aa0', '#111916', '#e8812d'], motif: 'machinewilds', theme: 'machine hunting, Old World discovery and stopping HADES at Meridian',
  continuity: 'Guerrilla’s Horizon Zero Dawn main game finale, with no Forbidden West plot substitutions',
  adaptationRule: 'Aloy uses the Focus, hunter bow and override spear; Varl is a Nora warrior and Erend an Oseram Vanguard ally. Machines preserve their animal-inspired industrial silhouettes and component logic. HADES is a rogue extinction protocol enclosed in a machine core and stopped via Master Override, not a demon.',
  visualAnchor: 'Lush post-post-apocalyptic wilderness over concrete ruins, tribal textiles, blue Focus holograms and animal-shaped industrial machines.',
  canonStatus: 'canon Horizon Zero Dawn roster and Battle for Meridian',
  fr: 'Aloy, Varl et Erend unissent Nora, Oseram et Carja pour repousser l’Éclipse et interrompre le signal d’extinction de HADES.',
  en: 'Aloy, Varl and Erend unite Nora, Oseram and Carja to repel the Eclipse and interrupt HADES’ extinction signal.',
  referenceUrls: [SOURCES.horizon.url, 'https://www.playstation.com/en-us/games/horizon-zero-dawn/', 'https://www.guerrilla-games.com/read/horizon-zero-dawn-complete-edition-is-out-now-on-pc'],
  characters: [
    { id: 'aloy', name: 'Aloy', role: 'tactical', weapon: 'Hunter Bow', weaponType: 'gun', secondary: 'Focus component scan', defense: 'Hunter roll', special: 'Master Override strike', visualAnchor: 'Fully clothed adult machine hunter with long braided red hair, layered practical Nora leather-and-blue textile armour, blue Focus triangle at right temple, hunter bow and override spear; original face, no actor likeness or sexualisation.', fr: 'La chercheuse Nora utilise son Focus pour comprendre les machines et les secrets du Projet Zero Dawn.', en: 'The Nora Seeker uses her Focus to understand machines and Project Zero Dawn’s secrets.' },
    { id: 'varl', name: 'Varl', role: 'marine', weapon: 'Nora spear', weaponType: 'blade', secondary: 'Brave covering strike', defense: 'Nora guard', special: 'All-Mother defence', visualAnchor: 'Fully clothed adult Nora warrior with dark braided hair, blue-white face paint, layered fur-and-leather Brave armour and long spear; original face, no actor likeness.', fr: 'Le guerrier Nora aide Aloy à défendre la Terre Sacrée puis Meridian.', en: 'The Nora warrior helps Aloy defend the Sacred Land and then Meridian.' },
    { id: 'erend', name: 'Erend', role: 'marine', weapon: 'Oseram hammer', weaponType: 'fists', secondary: 'Vanguard smash', defense: 'Oseram plate guard', special: 'Meridian wallbreaker', visualAnchor: 'Fully clothed broad adult Oseram Vanguard with braided brown beard and mohawk, layered steel-and-leather armour, blue scarf and enormous forge hammer; original face, no actor likeness.', fr: 'Le capitaine de l’avant-garde Oseram met son marteau au service de Meridian.', en: 'The Oseram Vanguard captain puts his hammer to Meridian’s defence.' }
  ],
  monsters: [
    { id: 'watcher', name: 'Watcher', weapon: 'Optic flash', special: 'Pack alarm', visualAnchor: 'Small bipedal green-gray machine shaped like a vigilant theropod, one large blue-white eye, cable tail and exposed canisters.', fr: 'La machine sentinelle alerte les unités proches.', en: 'The sentinel machine alerts nearby units.' },
    { id: 'scrapper', name: 'Scrapper', weapon: 'Grinding jaws', special: 'Radar scan', visualAnchor: 'Low quadrupedal yellow-gray scavenger machine with hyena-like profile, circular jaw grinder, back radar dish and sparking salvage canister.', fr: 'Le Scrapper recycle les carcasses et détecte les chasseurs.', en: 'The Scrapper recycles carcasses and detects hunters.' },
    { id: 'sawtooth', name: 'Sawtooth', weapon: 'Metal fangs and claws', special: 'Predator leap', visualAnchor: 'Large white-gray saber-toothed cat machine with yellow armour plates, red cable muscles and long curved metal fangs.', fr: 'Le Sawtooth est une machine de combat rapide inspirée d’un félin.', en: 'The Sawtooth is a fast feline-inspired combat machine.' }
  ],
  bosses: [
    { id: 'corruptor', name: 'Corruptor', weapon: 'Tail spike and corruption cables', special: 'Machine override pulse', visualAnchor: 'Ancient black-gray Faro war machine with four spider-like legs, red corruption cables, angular sensor head and long override tail.', fr: 'L’ancien robot de guerre corrompt les machines de GAIA.', en: 'The ancient war robot corrupts GAIA’s machines.' },
    { id: 'thunderjaw', name: 'Thunderjaw', weapon: 'Disc launchers and tail', special: 'Tyrant-machine barrage', visualAnchor: 'Enormous white-gray tyrannosaur machine with yellow plates, blue canisters, twin back disc launchers, jaw cannons and cable tail.', fr: 'Le Thunderjaw combine blindage lourd, canons et composants détachables.', en: 'The Thunderjaw combines heavy armour, cannons and detachable components.' },
    { id: 'deathbringer', name: 'HADES Deathbringer', weapon: 'Heavy cannons and missiles', special: 'Spire siege barrage', visualAnchor: 'Colossal ancient Faro tracked war machine with black-gray armour, red heat vents, raised multi-cannon turret and six heavy legs at Meridian’s Spire.', fr: 'HADES réactive un Deathbringer colossal pour défendre son signal au Méridien.', en: 'HADES reactivates a colossal Deathbringer to defend its signal at Meridian.', canonStatus: 'canon final Battle for Meridian machine' }
  ],
  worldBoss: { id: 'hades', name: 'HADES Extinction Protocol', weapon: 'Faro Swarm reactivation signal', special: 'Spire broadcast', visualAnchor: 'Black angular machine-core skull enclosing a red-black AI energy mass at Meridian’s Spire, signal tendrils reaching a dormant metal-devil silhouette; no demonic anatomy.', fr: 'HADES tente d’utiliser la Flèche pour réveiller l’Essaim de Faro et éteindre toute vie.', en: 'HADES attempts to use the Spire to awaken the Faro Swarm and extinguish all life.', canonStatus: 'canon rogue GAIA sub-function adapted as override objective', entityType: 'ai-world-boss', nonCombat: true, objective: 'Defeat the guarding Deathbringer, then apply the Master Override and interrupt the Spire signal.', objectiveFr: 'Vaincre le Deathbringer de garde puis appliquer le Contrôle Maître et interrompre le signal.', victoryCondition: 'master-override-applied', spritePrompt: 'Original fan-made pixel-art objective sheet: HADES machine-core enclosure and Meridian Spire across four signal-shutdown states. No humanoid boss, demon, logo, text or actor likeness.' },
  stage: { name: 'Meridian — la Flèche', visualAnchor: 'Sunlit mesa city of sandstone and timber, tall ancient metallic Spire, Carja banners with original abstract sun patterns and machine siege below.', fr: 'Les tribus alliées défendent Meridian pendant qu’Aloy rejoint HADES.', en: 'The allied tribes defend Meridian while Aloy reaches HADES.' },
  stageVariants: [stageVariant('Tactics', 'Terrain de chasse — Thunderjaw', 'Very Hard', 'Thunderjaw', { objective: 'Tear off disc launchers and use exposed elemental canisters.' }), stageVariant('Trial', 'Flèche de Meridian — Contrôle Maître', 'Expert', 'HADES Extinction Protocol', { objective: 'Apply the Master Override after the Deathbringer is disabled.', nonCombat: true })],
  gear: [
    { id: 'focus', enName: 'Aloy’s Focus', frName: 'Focus d’Aloy', boost: { spd: 2, atk: 5 }, visualAnchor: 'Tiny blue triangular augmented-reality device projecting translucent component outlines, displayed without a face.', fr: 'Le Focus révèle données anciennes et faiblesses des machines.', en: 'The Focus reveals Old World data and machine weaknesses.' },
    { id: 'hunter_bow', enName: 'Nora Hunter Bow', frName: 'Arc de chasse Nora', boost: { atk: 7, def: 2 }, visualAnchor: 'Layered wood-and-metal recurve bow wrapped in blue Nora cord with detachable elemental arrow bundle.', fr: 'L’arc polyvalent d’Aloy cible les composants.', en: 'Aloy’s versatile bow targets components.' },
    { id: 'master_override', enName: 'Master Override', frName: 'Contrôle Maître', boost: { hp: 55, def: 5 }, visualAnchor: 'Small gold-black triangular override module mounted to a practical spearhead, glowing blue at the interface.', fr: 'L’outil conçu par Elisabet Sobeck permet de neutraliser les sous-fonctions rebelles.', en: 'Elisabet Sobeck’s tool can neutralise rogue sub-functions.' }
  ],
  event: { id: 'battle_meridian', enName: 'Battle for Meridian', frName: 'Bataille de Meridian', en: 'Varl and Erend hold the walls while Aloy strips the Deathbringer’s weapons and applies the Master Override to HADES.', fr: 'Varl et Erend tiennent les remparts tandis qu’Aloy arrache les armes du Deathbringer puis applique le Contrôle Maître à HADES.', visualAnchor: 'Meridian Spire above allied tribal defenders and an accurately componentised Deathbringer, all in original fan-made composition.' }
});

export const CANON_ROSTER_WAVE_PART_E = Object.freeze([
  gex,
  spyro,
  rayman,
  nier,
  discipline,
  bibleBlack,
  hotlineMiami,
  spaceMarine,
  backToTheFuture,
  terminator,
  robocop,
  walkingDead,
  horizonZeroDawn
]);
