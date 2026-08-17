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
    nonCombat = false,
    objective,
    objectiveFr,
    victoryCondition,
    ...provenance
  } = definition;

  const common = {
    ...provenance,
    output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or cross-franchise costume.`
  };

  if (nonCombat) {
    return Object.freeze([runtimeId, name, 'trial', fidelity(
      source,
      visualAnchor,
      lore(fr, en),
      canonStatus,
      {
        ...common,
        nonCombat: true,
        trialType: 'Trial',
        entityType: provenance.entityType || 'non-combat-character-trial',
        objective: objective || `Complete ${typeof special === 'object' ? special.name : special} through interaction without combat.`,
        objectiveFr: objectiveFr || `Terminer l'objectif de ${name} par l'exploration et l'interaction, sans combat.`,
        victoryCondition: victoryCondition || `complete-${slugify(id)}-objective`,
        spritePrompt: `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Show four readable objective states. No combat pose, weapon, opponent bar, official artwork, logo, text or actor likeness.`
      }
    )]);
  }

  return Object.freeze([runtimeId, name, role, fidelity(
    source,
    visualAnchor,
    lore(fr, en),
    canonStatus,
    {
      ...common,
      weapon,
      weaponType,
      stats: Object.freeze({ ...stats }),
      simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'magic' ? 'energy' : weaponType === 'focus' ? 'status' : 'melee', dmg: weaponType === 'focus' ? 0 : 1.0 }),
      secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
      defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
      special: move(special, { type: 'origin_aoe', dmg: 4.0 })
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
    phases = weapon && special ? [`Uses ${weapon}`, `Escalates with ${special}`] : [],
    nonCombat = false,
    objective,
    objectiveFr,
    victoryCondition,
    ...extra
  } = definition;

  if (nonCombat) {
    return Object.freeze({
      id: `${source.key}_${id}`,
      name,
      ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
        output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Show four readable objective states. No humanoid opponent, combat pose, health bar, official artwork, logo or text.`
      }),
      nonCombat: true,
      trialType: 'Trial',
      objective,
      objectiveFr,
      victoryCondition,
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

const SOLDIER_OF_FORTUNE = Object.freeze({ key: 'soldier_of_fortune', universe: 'Soldier of Fortune', url: 'https://www.gog.com/en/game/soldier_of_fortune_platinum_edition' });
const EXTREME_GHOSTBUSTERS = Object.freeze({ key: 'extreme_ghostbusters', universe: 'Extreme Ghostbusters', url: 'https://www.sonypictures.com/tv/extremeghostbustersthecompleteseries' });
const HEART_OF_DARKNESS = Object.freeze({ key: 'heart_of_darkness', universe: 'Heart of Darkness', url: 'https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf' });
const RIVAL_SCHOOLS = Object.freeze({ key: 'rival_schools', universe: 'Rival Schools', url: 'https://game.capcom.com/cfn/sfv/column-130231?lang=en' });
const MEDIEVIL = Object.freeze({ key: 'medievil', universe: 'MediEvil', url: 'https://www.playstation.com/en-gb/games/medievil/' });
const JERSEY_DEVIL = Object.freeze({ key: 'jersey_devil', universe: 'Jersey Devil', url: 'https://www.videogamemanual.com/ps1/Jersey%20Devil%20%28USA%29.pdf' });
const GOEMON = Object.freeze({ key: 'goemons_great_adventure', universe: "Goemon's Great Adventure", url: 'https://world-of-nintendo.com/manuals/nintendo_64/goemon_great_adventure.shtml' });
const MDK = Object.freeze({ key: 'mdk', universe: 'MDK', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/38460/manuals/Manual%20-%20English.pdf' });
const TAIL_CONCERTO = Object.freeze({ key: 'tail_concerto', universe: 'Tail Concerto', url: 'https://www.mobygames.com/game/8483/tail-concerto/' });
const REDNECK_RAMPAGE = Object.freeze({ key: 'redneck_rampage', universe: 'Redneck Rampage', url: 'https://steamcdn-a.akamaihd.net/steam/apps/565550/manuals/Redneck_Rampage.pdf' });
const HEXEN = Object.freeze({ key: 'hexen', universe: 'Hexen', url: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/manual/Formated/Hexen-_Beyond_Heretic_-_1997_-_GT_Interactive_Software.pdf' });
const DUKE_NUKEM = Object.freeze({ key: 'duke_nukem', universe: 'Duke Nukem', url: 'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_DOS/manual/Formated/Duke_Nukem_3D.pdf' });
const MARATHON = Object.freeze({ key: 'marathon_classic', universe: 'Marathon', url: 'https://marathon.bungie.org/story/_files/Marathon_Manual.pdf' });

const soldierOfFortune = definePack(SOLDIER_OF_FORTUNE, {
  aliases: ['Soldier of Fortunes', 'Soldier of Fortune (2000)', 'SoF'],
  mediaType: 'video-game', faction: 'modern', mode: 'Tactics', difficulty: 'Very Hard',
  colors: ['#344238', '#090c0a', '#d5a34a'], motif: 'covertops',
  theme: 'The Shop covert missions to recover four stolen nuclear warheads',
  continuity: 'Soldier of Fortune (2000) / Platinum Edition only',
  adaptationRule: 'Keep John Mullins, Hawk, Sam Gladstone, The Shop, The Order and the four-warhead pursuit in the first game. Sabre dies in a cutscene and Sam is mission control: both are Trials, never fabricated arena fighters. Avoid gore, real extremist insignia and real-person likenesses.',
  visualAnchor: 'Turn-of-the-millennium covert gear, olive tactical webbing, dark transit tunnels, snowy missile facilities and compact Shop briefings.',
  canonStatus: '2000 Raven game canon with non-graphic original fan adaptation',
  fr: 'John Mullins et Hawk poursuivent quatre ogives volées pour The Shop tandis que Sam Gladstone relie les indices qui mènent à l’Ordre de Sergei Dekker.',
  en: 'John Mullins and Hawk pursue four stolen warheads for The Shop while Sam Gladstone connects the evidence leading to Sergei Dekker’s Order.',
  referenceUrls: [SOLDIER_OF_FORTUNE.url, 'https://segaretro.org/images/c/cf/SoldierofFortune_DC_US_Manual.pdf', 'https://media.gdcvault.com/GD_Mag_Archives/GDM_September_2000.pdf'],
  characters: [
    { id: 'john_mullins', name: 'John Mullins', role: 'tactical', weapon: 'Shop carbine', weaponType: 'gun', simple: 'Controlled burst', secondary: 'Flashpak entry', defense: 'Lean from cover', special: 'Shop assault plan', visualAnchor: 'Older covert operator with close-cropped gray hair, green-black field clothes, tactical vest and carbine; no likeness to the real consultant.', fr: 'Agent de terrain de The Shop chargé de retrouver les ogives.', en: 'The Shop field operative assigned to recover the warheads.' },
    { id: 'hawk_parsons', name: 'Aaron “Hawk” Parsons', role: 'marine', weapon: 'Shop rifle', weaponType: 'gun', simple: 'Covering fire', secondary: 'Partner advance', defense: 'Tactical brace', special: 'Hawk crossfire', visualAnchor: 'Tall Black covert operative in dark field jacket, body armor and rifle; original face, no voice-actor likeness.', fr: 'Partenaire de Mullins et second agent de terrain de The Shop.', en: 'Mullins’s partner and The Shop’s second field operative.' },
    { id: 'sam_gladstone', name: 'Sam Gladstone', role: 'trial', nonCombat: true, objective: 'Decode Shop intelligence and identify the next warhead route.', objectiveFr: 'Décoder les renseignements de The Shop et identifier la prochaine route des ogives.', victoryCondition: 'briefing-chain-complete', visualAnchor: 'Bookshop proprietor at a cluttered back-room intelligence desk with paper maps, telephone and evidence board; original face.', fr: 'Libraire et contact de The Shop, Sam transmet les briefings plutôt que de combattre.', en: 'A bookseller and Shop contact, Sam delivers briefings rather than fighting.', canonStatus: 'canon non-combat mission-control ally' }
  ],
  monsters: [
    { id: 'ministry_gunman', name: 'Ministry of Sin Gunman', weapon: 'Submachine gun', special: 'Subway hostage crossfire', visualAnchor: 'Street gang gunman in mismatched dark layers and improvised armor, with no real extremist markings or gore.', fr: 'Un homme de main de Sabre rencontré dans le métro de New York.', en: 'One of Sabre’s gunmen encountered in the New York subway.', canonStatus: 'canon mission enemy archetype' },
    { id: 'order_commando', name: 'The Order Commando', weapon: 'Assault rifle', special: 'Warhead perimeter defense', visualAnchor: 'Paramilitary commando in olive winter equipment and anonymous original insignia.', fr: 'Un commando de l’Ordre affecté aux transferts d’ogives.', en: 'An Order commando assigned to warhead transfers.', canonStatus: 'canon faction enemy archetype' },
    { id: 'order_sniper', name: 'The Order Sniper', weapon: 'Sniper rifle', special: 'Long-range ambush', visualAnchor: 'Cold-weather sniper silhouette on industrial scaffolding, abstract unit patch and no gore.', fr: 'Un tireur de l’Ordre qui verrouille les itinéraires industriels.', en: 'An Order marksman locking down industrial routes.', canonStatus: 'canon mission enemy archetype' }
  ],
  bosses: [
    { id: 'general_amu', name: 'General Mohammed Amu', weapon: 'Command sidearm', special: 'Palace guard deployment', visualAnchor: 'Fictional military general in decorated olive uniform inside a fortified palace, original face and no real-state emblems.', fr: 'Le général Amu intervient dans l’étape irakienne de la piste nucléaire.', en: 'General Amu appears during the Iraqi leg of the nuclear trail.', canonStatus: 'canon fictional antagonist' },
    { id: 'sabre_pursuit', name: 'Sabre / Wilhelm Dekker — Rooftop Pursuit', nonCombat: true, objective: 'Corner Sabre and recover his Order intelligence before his scripted fall.', objectiveFr: 'Coincer Sabre et récupérer ses renseignements sur l’Ordre avant sa chute scénarisée.', victoryCondition: 'evidence-recovered', visualAnchor: 'Rainy New York rooftop chase with a broad tattooed gang leader kept at a distance, no fall impact or extremist symbols.', fr: 'Sabre est poursuivi puis meurt dans une cinématique ; il n’est pas transformé en sac à PV.', en: 'Sabre is pursued and then dies in a cutscene; he is not turned into a health-bar opponent.', canonStatus: 'canon cutscene pursuit represented as Trial' },
    { id: 'warhead_transfer', name: 'Fourth Warhead Transfer', nonCombat: true, objective: 'Secure the fourth nuclear warhead and disarm its transfer system.', objectiveFr: 'Sécuriser la quatrième ogive nucléaire et désarmer son système de transfert.', victoryCondition: 'warhead-secured', visualAnchor: 'Armored warhead cradle in a German underground launch facility across four disarm states.', fr: 'La récupération de l’ultime ogive est un objectif de mission, pas une créature.', en: 'Recovering the final warhead is a mission objective, not a creature.', canonStatus: 'canon mission objective' }
  ],
  worldBoss: { id: 'sergei_dekker', name: 'Sergei Dekker', weapon: 'Heavy command weapon', special: 'Missile-silo turret network', visualAnchor: 'Exiled Order commander in red-black armored field uniform on launch-silo catwalks, original face and no extremist insignia.', fr: 'Le fondateur de l’Ordre attend Mullins dans le complexe final allemand.', en: 'The Order’s founder awaits Mullins in the final German complex.', canonStatus: 'canon final antagonist' },
  stage: { name: 'Métro de New York — prise d’otages', visualAnchor: 'Wet tiled platforms, stopped subway train, police lights beyond gates and civilians behind cover.', fr: 'Mullins et Hawk ouvrent l’enquête en libérant le métro.', en: 'Mullins and Hawk begin the investigation by freeing the subway.' },
  stageVariants: [
    stageVariant('Tactics', 'Toits de New York — filature de Sabre', 'Hard', 'Sabre / Wilhelm Dekker — Rooftop Pursuit', { nonCombat: true, trialType: 'Trial', objective: 'Maintain pursuit and collect Order evidence; no fake duel.' }),
    stageVariant('Tactics', 'Complexe de lancement allemand', 'Expert', 'Sergei Dekker', { objective: 'Secure the last warhead, cross the silo and stop Dekker.' })
  ],
  gear: [
    { id: 'shop_goggles', enName: 'Shop Night-Vision Goggles', frName: 'Lunettes nocturnes de The Shop', boost: { spd: 2, def: 4 }, visualAnchor: 'Compact green-lensed tactical goggles with worn elastic strap.', fr: 'Équipement de vision utilisé lors des infiltrations sombres.', en: 'Vision equipment used during dark infiltrations.' },
    { id: 'flashpak', enName: 'Flashpak', frName: 'Flashpak', boost: { atk: 5, spd: 1 }, visualAnchor: 'Small cylindrical tactical flash device with safety lever, no readable brand.', fr: 'Un outil d’entrée pour désorienter une pièce.', en: 'An entry tool used to disorient a room.' },
    { id: 'plastic_explosive', enName: 'Plastic Explosive Charge', frName: 'Charge d’explosif plastique', boost: { atk: 8 }, visualAnchor: 'Rectangular demolition charge with timer and coiled wire, no text.', fr: 'Une charge réservée aux objectifs destructibles.', en: 'A charge reserved for destructible objectives.' }
  ],
  event: { id: 'shop_briefing', enName: 'The Shop Briefing Chain', frName: 'Chaîne de briefings de The Shop', en: 'Sam links each recovered clue to the next continent while the four warhead indicators are cleared one by one.', fr: 'Sam relie chaque indice au continent suivant pendant que les quatre indicateurs d’ogive sont neutralisés un à un.', visualAnchor: 'Back-room bookshop map with four abstract warhead markers extinguishing in sequence.', canonStatus: 'canon mission-chain Trial', nonCombat: true }
});

const extremeGhostbusters = definePack(EXTREME_GHOSTBUSTERS, {
  aliases: ['Extreme Ggostbuster', 'Extrême Ghostbusters', 'Extreme Ghostbusters: The Complete Series'],
  mediaType: 'animated-series', faction: 'occult', mode: 'RPG', difficulty: 'Hard',
  colors: ['#362b47', '#08070d', '#8be35b'], motif: 'firehouse',
  theme: 'Egon’s next-generation New York team containing episodic supernatural threats',
  continuity: 'Extreme Ghostbusters 1997 animated series',
  adaptationRule: 'Use the 1997 students and Egon-era equipment. Ghosts are trapped or banished according to each episode, not killed. Keep Garrett’s sports wheelchair integral and capable; omit actor likenesses and the franchise logo.',
  visualAnchor: 'Gritty 1990s New York, angular dark uniforms, green ectoplasm, Ecto-1 and rebuilt proton equipment in Firehouse 23.',
  canonStatus: 'Sony animated-series canon with capture-focused combat adaptation',
  fr: 'Kylie, Eduardo et Garrett appliquent les cours d’Egon sur le terrain lorsque les phénomènes surnaturels reviennent à New York.',
  en: 'Kylie, Eduardo and Garrett put Egon’s classes into practice when supernatural activity returns to New York.',
  referenceUrls: [EXTREME_GHOSTBUSTERS.url, 'https://www.spookcentral.tk/media/sclib/egb_script_grundelesque.pdf', 'https://www.spookcentral.tk/media/sclib/egb_script_dreams_1997-03-24.pdf'],
  characters: [
    { id: 'kylie_griffin', name: 'Kylie Griffin', role: 'hacker', weapon: 'Proton pistol', weaponType: 'gun', simple: 'Proton pistol pulse', secondary: 'Occult counter-sign', defense: 'Trap-pack roll', special: 'Spirit Guide seal', visualAnchor: 'Small goth occult expert with black bob, dark fitted field uniform, compact proton pistol and backpack ghost trap.', fr: 'Experte de l’occulte qui porte un pistolet à protons et le piège dorsal.', en: 'The team’s occult expert, carrying a proton pistol and backpack trap.' },
    { id: 'eduardo_rivera', name: 'Eduardo Rivera', role: 'slayer', weapon: 'Proton pack', weaponType: 'gun', simple: 'Proton stream', secondary: 'Improvised distraction', defense: 'Firehouse sidestep', special: 'Rivera containment sweep', visualAnchor: 'Lean young Latino Ghostbuster with long dark hair, red shirt under asymmetrical dark gear and rebuilt proton pack; original face.', fr: 'Le sceptique sarcastique du groupe se montre fiable lorsque l’équipe est menacée.', en: 'The team’s sarcastic skeptic proves dependable when the others are threatened.' },
    { id: 'garrett_miller', name: 'Garrett Miller', role: 'marine', weapon: 'Proton pack', weaponType: 'gun', simple: 'Wheelchair proton sweep', secondary: 'Athletic ram turn', defense: 'Wheel pivot', special: 'Adrenaline containment run', visualAnchor: 'Muscular young athlete in a rugged custom sports wheelchair, dark Ghostbuster field jacket and proton pack mounted without obscuring the chair.', fr: 'Athlète téméraire, Garrett manœuvre son fauteuil avec autant d’assurance que le matériel à protons.', en: 'A fearless athlete, Garrett handles his wheelchair as confidently as the proton gear.', representationRule: 'Never depict the wheelchair as damage, weakness or temporary equipment.' }
  ],
  monsters: [
    { id: 'mole_people_parasite', name: 'Mole-People Power Parasite', weapon: 'Electrical drain', special: 'Grid feeding', visualAnchor: 'Pale subterranean paranormal parasite wrapped around power cables beneath Manhattan.', fr: 'Une menace des tunnels qui se nourrit du réseau électrique.', en: 'A tunnel threat feeding on the electrical grid.', canonStatus: 'canon episodic supernatural threat' },
    { id: 'grease_entity', name: 'Living Grease Entity', weapon: 'Adhesive sludge', special: 'Kitchen-spread surge', visualAnchor: 'Amber-black animated grease mass crawling through industrial kitchen vents, no food branding.', fr: 'Une masse surnaturelle de graisse vivante qui envahit les conduits.', en: 'A supernatural living grease mass spreading through vents.', canonStatus: 'canon Grease episode entity' },
    { id: 'fear_manifestation', name: 'Fear Manifestation', weapon: 'Phobia projection', special: 'Personal nightmare form', visualAnchor: 'Abstract shifting shadow composed of several angular phobia silhouettes, no realistic victim harm.', fr: 'La créature de Fear Itself prend la forme de peurs personnelles.', en: 'The Fear Itself creature takes the shape of personal fears.', canonStatus: 'canon episodic entity' }
  ],
  bosses: [
    { id: 'grundel', name: 'The Grundel', weapon: 'Childhood corruption', special: 'Grundelesque disguise', visualAnchor: 'Tall gaunt folklore ghost with long coatlike shadow, clawed silhouette and cold blue eyes; no child victim shown.', fr: 'Le Grundel revient en exploitant les failles d’une famille.', en: 'The Grundel returns by exploiting fractures within a family.', canonStatus: 'canon recurring Ghostbusters entity' },
    { id: 'tempus', name: 'Tempus', weapon: 'Time displacement', special: 'Future-New-York rewrite', visualAnchor: 'Clockwork spectral figure framed by fractured New York timelines and amber temporal arcs.', fr: 'Tempus projette l’équipe dans un futur où les fantômes dominent la ville.', en: 'Tempus throws the team into a future where ghosts dominate the city.', canonStatus: 'canon Ghost Apocalyptic Future antagonist' },
    { id: 'achira', name: 'Achira', weapon: 'Plague aura', special: 'Subway awakening', visualAnchor: 'Ancient angular demon rising through green vapor beneath an abandoned subway platform.', fr: 'Le démon réveillé au début de la série provoque le retour de l’activité paranormale.', en: 'The demon awakened at the start of the series triggers the return of paranormal activity.', canonStatus: 'canon Darkness at Noon antagonist', aliases: ['Akira'] }
  ],
  worldBoss: { id: 'samhain', name: 'Samhain', weapon: 'Night eternal', special: 'Ghost army release', visualAnchor: 'Pumpkin-headed spectral lord in tattered dark robes above the Firehouse containment glow, distinct from any generic jack-o-lantern mascot.', fr: 'Samhain revient lorsque les deux générations de Ghostbusters se réunissent.', en: 'Samhain returns when both Ghostbuster generations reunite.', canonStatus: 'canon Back in the Saddle overarching return threat' },
  stage: { name: 'Firehouse 23 — unité de confinement', visualAnchor: 'Brick firehouse basement with angular 1990s containment machinery, green warning glow and wheelchair-accessible ramps.', fr: 'Le retour des phénomènes met sous pression l’ancienne unité de confinement.', en: 'The paranormal resurgence puts the old containment unit under pressure.' },
  stageVariants: [
    stageVariant('RPG', 'Métro condamné — réveil d’Achira', 'Very Hard', 'Achira', { objective: 'Seal plague vents, cross the abandoned platform and trap Achira.' }),
    stageVariant('Tactics', 'New York d’Halloween — nuit de Samhain', 'Expert', 'Samhain', { objective: 'Restore the containment relays while both teams hold the ghost army.' })
  ],
  gear: [
    { id: 'proton_pistol', enName: 'Kylie’s Proton Pistol', frName: 'Pistolet à protons de Kylie', boost: { atk: 6, spd: 2 }, visualAnchor: 'Compact angular proton sidearm with green power cell and dark hand guard.', fr: 'La variante compacte utilisée par Kylie.', en: 'The compact proton variant used by Kylie.' },
    { id: 'backpack_trap', enName: 'Backpack Ghost Trap', frName: 'Piège à fantômes dorsal', boost: { def: 7, hp: 35 }, visualAnchor: 'Dark backpack trap with hinged intake and green containment lamp.', fr: 'Kylie transporte le piège principal sur son dos.', en: 'Kylie carries the main ghost trap on her back.' },
    { id: 'spirit_guide', enName: 'Spengler’s Spirit Guide', frName: 'Guide des esprits de Spengler', boost: { hp: 50, def: 4 }, visualAnchor: 'Thick battered occult reference book with abstract clasps and handwritten tabs, no readable title.', fr: 'Le manuel d’Egon aide Kylie à identifier les entités.', en: 'Egon’s manual helps Kylie identify entities.' }
  ],
  event: { id: 'two_generations', enName: 'Two Ghostbuster Generations', frName: 'Deux générations de Ghostbusters', en: 'Roland rebuilds the containment route while Egon coordinates the original and Extreme teams against Samhain.', fr: 'Roland reconstruit la route de confinement tandis qu’Egon coordonne les équipes originale et Extreme contre Samhain.', visualAnchor: 'Firehouse workshop with old and new proton silhouettes converging around a repaired containment relay.' }
});

const heartOfDarkness = definePack(HEART_OF_DARKNESS, {
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
});

const rivalSchools = definePack(RIVAL_SCHOOLS, {
  aliases: ['Rival School', 'Rival Schools: United by Fate', 'Project Justice'],
  mediaType: 'video-game', faction: 'martial', mode: 'Smash', difficulty: 'Very Hard',
  colors: ['#1c4677', '#080b12', '#f1c54b'], motif: 'schoolyard',
  theme: 'school teams investigating kidnappings, brainwashing and the Imawano conspiracies',
  continuity: 'Rival Schools: United by Fate and Project Justice game continuity',
  adaptationRule: 'Preserve Taiyo High’s Batsu–Hinata–Kyosuke team, school-specific uniforms and team-up attacks. Akira, Roy and Shoma are sporting rivals, not evil minions. Label Raizo’s brainwashing and Demon Hyo’s possession instead of flattening either man into a generic villain.',
  visualAnchor: 'Bright Japanese school grounds, bold 1990s Capcom silhouettes, team-up impacts and uniforms unique to each academy.',
  canonStatus: 'Capcom two-game continuity with rivals separated from villains',
  fr: 'Batsu, Hinata et Kyosuke réunissent les écoles pour enquêter sur les enlèvements puis sur la crise qui divise les équipes dans Project Justice.',
  en: 'Batsu, Hinata and Kyosuke unite the schools to investigate the kidnappings and later the crisis dividing teams in Project Justice.',
  referenceUrls: ['https://game.capcom.com/cfn/sfv/column-130231?lang=en', 'https://captown.capcom.com/fr/museums/histories', 'https://news.capcomusa.com/lets/browse/capcom-fighting-collection-2-game-spotlights'],
  characters: [
    { id: 'batsu', name: 'Batsu Ichimonji', role: 'slayer', weapon: 'Ichimonji martial arts', weaponType: 'fists', simple: 'Guts Bullet', secondary: 'Air Guts Bullet', defense: 'Taiyo counter', special: 'Maximum Batsu', visualAnchor: 'Fiery Japanese high-school fighter with spiky dark hair, open blue Taiyo jacket, chain-mail shirt and red gloves.', fr: 'Élève transféré de Taiyo qui recherche sa mère enlevée.', en: 'Taiyo transfer student searching for his kidnapped mother.' },
    { id: 'hinata', name: 'Hinata Wakaba', role: 'tactical', weapon: 'Ken Masters correspondence martial arts', weaponType: 'fists', simple: 'Rengekiken', secondary: 'Shōyōken', defense: 'Cheerful evade', special: 'Taiyo team-up', visualAnchor: 'Energetic schoolgirl martial artist with short brown hair, blue blazer, yellow bow and practical skirt-over-shorts movement.', fr: 'Hinata rejoint immédiatement l’enquête et maîtrise un style martial appris par correspondance.', en: 'Hinata immediately joins the investigation and masters a correspondence-taught martial art.' },
    { id: 'kyosuke', name: 'Kyosuke Kagami', role: 'tactical', weapon: 'Kagami martial arts', weaponType: 'fists', simple: 'Cross Cutter', secondary: 'Shadow Cut Kick', defense: 'Disciplinary parry', special: 'Final Symphony', visualAnchor: 'Calm silver-haired Taiyo morals-committee student with round glasses, buttoned blue uniform and precise kicking stance.', fr: 'Le stratège du trio est lié aux Imawano et choisit finalement Taiyo contre Hyo.', en: 'The trio’s strategist is tied to the Imawano and ultimately chooses Taiyo over Hyo.' }
  ],
  monsters: [
    { id: 'akira_rival', name: 'Akira Kazama — Rival Match', weapon: 'Motorcycle-style martial arts', special: 'Daigo team-up', visualAnchor: 'Teen biker martial artist in white skull motorcycle helmet and dark Gedo riding gear, no realistic school violence.', fr: 'Akira affronte les équipes pendant sa propre enquête ; elle n’est pas une sbire.', en: 'Akira faces teams during her own investigation; she is not a minion.', canonStatus: 'canon rival fighter, not villain' },
    { id: 'roy_rival', name: 'Roy Bromwell — Rival Match', weapon: 'American football strikes', special: 'Pacific team-up', visualAnchor: 'Blond Pacific High athlete in red-white varsity uniform with football-inspired stance.', fr: 'Roy représente Pacific High dans un affrontement interscolaire.', en: 'Roy represents Pacific High in an interschool match.', canonStatus: 'canon rival fighter, not villain' },
    { id: 'shoma_rival', name: 'Shoma Sawamura — Rival Match', weapon: 'Baseball bat techniques', special: 'Gorin team-up', visualAnchor: 'Hot-blooded teen baseball player in white-blue Gorin uniform, cap and stylized wooden bat.', fr: 'Shoma est un rival sportif de Gorin, pas un ennemi moral.', en: 'Shoma is a sporting Gorin rival, not a moral enemy.', canonStatus: 'canon rival fighter, not villain' }
  ],
  bosses: [
    { id: 'raizo_brainwashed', name: 'Raizo Imawano — Brainwashed', weapon: 'Imawano claw style', special: 'Justice High power rush', visualAnchor: 'Massive Justice High principal with swept gray hair, dark formal uniform and clawed martial stance, eyes marked by mind control.', fr: 'Raizo est présenté comme responsable avant que son contrôle mental et Hyo ne soient révélés.', en: 'Raizo appears responsible before his mind control and Hyo’s role are revealed.', canonStatus: 'canon brainwashed apparent boss' },
    { id: 'hyo', name: 'Hyo Imawano', weapon: 'Imawano sword arts', special: 'True-mastermind assault', visualAnchor: 'Tall white-haired swordsman in immaculate black Justice uniform with long katana and severe posture.', fr: 'Hyo est le véritable organisateur de la crise du premier jeu.', en: 'Hyo is the true organizer of the first game’s crisis.', canonStatus: 'canon United by Fate true boss' },
    { id: 'kurow', name: 'Kurow Kirishima', weapon: 'Wire and knife techniques', special: 'Project Justice school manipulation', visualAnchor: 'Pale teen conspirator with dark tied hair, black-purple school clothes, thin wire and concealed knives.', fr: 'Kurow manipule les écoles dans Project Justice.', en: 'Kurow manipulates the schools in Project Justice.', canonStatus: 'canon Project Justice antagonist' }
  ],
  worldBoss: { id: 'demon_hyo', name: 'Demon Hyo — Mugen Possession', weapon: 'Possessed Imawano blade', special: 'Mugen spirit eruption', visualAnchor: 'Hyo’s uniform and sword overwhelmed by red-violet ancestral spirit energy, visibly the possessed Hyo rather than a generic demon.', fr: 'Dans la finale de Project Justice, l’esprit de Mugen possède Hyo.', en: 'In Project Justice’s finale, Mugen’s spirit possesses Hyo.', canonStatus: 'canon possessed final form', identityRule: 'Keep distinct from unpossessed Hyo boss entry.' },
  stage: { name: 'Taiyo High — cour du tournoi', visualAnchor: 'Sunny school courtyard, blue Taiyo banners as original abstract motifs, chain-link fence and cheering students.', fr: 'Les équipes se retrouvent dans la cour pour un duel en formation.', en: 'Teams meet in the courtyard for a formation match.' },
  stageVariants: [
    stageVariant('Smash', 'Justice High — salle du proviseur', 'Very Hard', 'Raizo Imawano — Brainwashed', { objective: 'Break Raizo’s control state, then reveal the real mastermind.' }),
    stageVariant('Smash', 'Project Justice — sanctuaire Imawano', 'Expert', 'Demon Hyo — Mugen Possession', { objective: 'Unite three school teams and sever Mugen’s possession.' })
  ],
  gear: [
    { id: 'taiyo_gloves', enName: 'Batsu’s Red Gloves', frName: 'Gants rouges de Batsu', boost: { atk: 6, spd: 1 }, visualAnchor: 'Pair of fingerless red martial gloves beside a blue uniform cuff.', fr: 'Les gants du style direct de Batsu.', en: 'The gloves of Batsu’s direct fighting style.' },
    { id: 'kyosuke_glasses', enName: 'Kyosuke’s Glasses', frName: 'Lunettes de Kyosuke', boost: { def: 5, spd: 2 }, visualAnchor: 'Thin round silver glasses with one reflected team formation.', fr: 'Les lunettes caractéristiques du tacticien de Taiyo.', en: 'The Taiyo tactician’s characteristic glasses.' },
    { id: 'team_vigor', enName: 'Team Vigor Emblem', frName: 'Emblème de vigueur d’équipe', boost: { hp: 55, atk: 3 }, visualAnchor: 'Original three-part interlocking school-team charm, no Capcom or school logo.', fr: 'Une adaptation matérielle de la jauge qui alimente les attaques en équipe.', en: 'A physical adaptation of the gauge powering team-up attacks.', canonStatus: 'transparent gameplay-system adaptation' }
  ],
  event: { id: 'team_up', enName: 'Taiyo Team-Up Attack', frName: 'Attaque combinée de Taiyo', en: 'Batsu calls Hinata and Kyosuke into a precise three-person formation, echoing Rival Schools’ defining team mechanic.', fr: 'Batsu appelle Hinata et Kyosuke dans une formation à trois qui reprend la mécanique fondatrice de Rival Schools.', visualAnchor: 'Three distinct Taiyo silhouettes entering from separate screen edges into one impact frame.' }
});

const medievil = definePack(MEDIEVIL, {
  aliases: ['Médiéval', 'Medieval', 'MediEvil franchise'],
  mediaType: 'video-game', faction: 'gothic', mode: 'RPG', difficulty: 'Hard',
  colors: ['#273c35', '#060807', '#cfb85b'], motif: 'gallowmere',
  theme: 'Sir Daniel Fortesque earning the heroism his legend falsely claimed',
  continuity: 'MediEvil (1998/2019 remake) with Kiya tagged from MediEvil 2 and Al-Zalam from Resurrection',
  adaptationRule: '“médiéval” is resolved as Sony’s MediEvil. Sir Dan remains the one-eyed jawless skeleton hero. Kiya’s and Al-Zalam’s entries retain their stated sequel/remake arcs; Al-Zalam is a non-combat guide Trial. Never merge Zarok with generic necromancers.',
  visualAnchor: 'Crooked storybook Gallowmere graveyards, green moonlight, exaggerated gothic stone and Sir Dan’s asymmetrical skeleton silhouette.',
  canonStatus: 'franchise roster with every cross-title entity explicitly tagged',
  fr: 'Sir Dan se relève par accident avec l’armée de Zarok et obtient enfin la chance de mériter sa place au Hall des Héros.',
  en: 'Sir Dan is accidentally raised with Zarok’s army and finally gets the chance to earn his place in the Hall of Heroes.',
  referenceUrls: [MEDIEVIL.url, 'https://blog.playstation.com/2012/09/07/behind-the-classics-medievil/', 'https://blog.playstation.com/2018/10/31/medievil-story-trailer-reveals-sir-daniels-origin-story/'],
  characters: [
    { id: 'sir_dan', runtimeId: 'sir_daniel_fortesque', name: 'Sir Daniel Fortesque', role: 'slayer', weapon: 'Broadsword', weaponType: 'blade', simple: 'Sword swing', secondary: 'Detached-arm throw', defense: 'Silver-shield block', special: 'Hero of Gallowmere charge', visualAnchor: 'Tall one-eyed jawless skeleton knight in dented silver armor, single horned shoulder, red plume and broad sword.', fr: 'Chevalier mort trop tôt dont la fausse légende devient une véritable quête de rédemption.', en: 'A knight who died too soon and turns his false legend into a real redemption quest.' },
    { id: 'kiya', name: 'Kiya', role: 'tactical', weapon: 'Ancient Egyptian blades', weaponType: 'blade', simple: 'Kiya slash', secondary: 'Mummy-princess leap', defense: 'Royal guard turn', special: 'MediEvil 2 alliance', visualAnchor: 'Reawakened ancient Egyptian princess in wrapped royal linen, turquoise-gold ornaments and paired curved blades, no sexualization.', fr: 'Princesse momifiée et alliée de Dan dans MediEvil 2.', en: 'A mummified princess and Dan’s ally in MediEvil 2.', canonStatus: 'canon MediEvil 2 ally' },
    { id: 'al_zalam', name: 'Al-Zalam — Guidance Route', role: 'trial', nonCombat: true, objective: 'Reveal hidden Resurrection routes and translate Zarok’s magical barriers.', objectiveFr: 'Révéler les routes cachées de Resurrection et traduire les barrières magiques de Zarok.', victoryCondition: 'guidance-route-complete', visualAnchor: 'Tiny blue-green genie spirit emerging from Sir Dan’s hollow skull beside route glyphs.', fr: 'Le génie de Resurrection vit dans le crâne de Dan et le guide sans devenir un combattant inventé.', en: 'The Resurrection genie lives in Dan’s skull and guides him without becoming an invented fighter.', canonStatus: 'canon MediEvil: Resurrection non-combat guide' }
  ],
  monsters: [
    { id: 'zombie', name: 'Gallowmere Zombie', weapon: 'Clawed hands', special: 'Graveyard rise', visualAnchor: 'Green-gray storybook corpse in torn peasant clothes rising from crooked soil, no gore.', fr: 'Un mort de Gallowmere relevé par la magie de Zarok.', en: 'A Gallowmere corpse raised by Zarok’s magic.' },
    { id: 'imp', name: 'Imp', weapon: 'Claws', special: 'Gear theft', visualAnchor: 'Small red-brown winged imp carrying an oversized stolen shield through a gothic hall.', fr: 'Un petit démon qui vole l’équipement de Dan.', en: 'A small demon that steals Dan’s equipment.' },
    { id: 'headless_zombie', name: 'Headless Zombie', weapon: 'Heavy swing', special: 'Unlife advance', visualAnchor: 'Broad headless undead soldier in corroded Gallowmere armor, stylized and gore-free.', fr: 'Un soldat sans tête réanimé dans l’armée de Zarok.', en: 'A headless soldier reanimated in Zarok’s army.' }
  ],
  bosses: [
    { id: 'stained_glass_demon', name: 'Stained Glass Demon', weapon: 'Glass shard volley', special: 'Cathedral-window reform', visualAnchor: 'Blue-red horned demon assembled from luminous cathedral glass above a dark mausoleum floor.', fr: 'Une figure de vitrail qui quitte sa fenêtre pour attaquer Dan.', en: 'A stained-glass figure that leaves its window to attack Dan.' },
    { id: 'pumpkin_king', name: 'Pumpkin King', weapon: 'Vine lashes', special: 'Pumpkin-field awakening', visualAnchor: 'Huge crowned pumpkin rooted in tangled green vines under a sickly moon.', fr: 'Le souverain végétal corrompu du champ de citrouilles.', en: 'The corrupted plant sovereign of the pumpkin field.' },
    { id: 'lord_kardok', name: 'Lord Kardok', weapon: 'Mounted lance', special: 'Skeletal cavalry charge', visualAnchor: 'Armored skeletal champion on a skeletal horse in Zarok’s arena, gold-black plate and long lance.', fr: 'Le champion de Zarok affronte Dan avant le sorcier.', en: 'Zarok’s champion faces Dan before the sorcerer.' }
  ],
  worldBoss: { id: 'zarok', name: 'Zarok', weapon: 'Necromancy', special: 'Monster-form transformation', visualAnchor: 'Gaunt green-skinned sorcerer in long red-black robes with crooked staff, transforming into his final serpentine monster form.', fr: 'Le sorcier qui ressuscite son armée et, par accident, Sir Dan.', en: 'The sorcerer who raises his army and accidentally raises Sir Dan.' },
  stage: { name: 'Cimetière de Gallowmere', visualAnchor: 'Crooked tombstones, thorny trees, green fog, mausoleum doors and the distant Hilltop Mausoleum.', fr: 'Dan quitte sa crypte au milieu des morts relevés.', en: 'Dan leaves his crypt among the risen dead.' },
  stageVariants: [
    stageVariant('RPG', 'Mausolée de la Colline — vitrail vivant', 'Very Hard', 'Stained Glass Demon', { objective: 'Return reflected shards to expose the glass heart.' }),
    stageVariant('RPG', 'Repaire de Zarok — arène de rédemption', 'Expert', 'Zarok', { objective: 'Protect the spectral heroes, defeat Kardok and survive Zarok’s transformation.' })
  ],
  gear: [
    { id: 'dans_sword', enName: 'Dan’s Broadsword', frName: 'Épée large de Dan', boost: { atk: 7 }, visualAnchor: 'Worn broad knight sword with simple crossguard and Gallowmere age marks.', fr: 'L’arme emblématique de Sir Dan.', en: 'Sir Dan’s emblematic weapon.' },
    { id: 'silver_shield', enName: 'Silver Shield', frName: 'Bouclier d’argent', boost: { def: 8 }, visualAnchor: 'Round silver shield with dents and an original abstract lionlike boss mark.', fr: 'Un bouclier solide mais destructible.', en: 'A strong but breakable shield.' },
    { id: 'chalice', enName: 'Chalice of Souls', frName: 'Calice des âmes', boost: { hp: 60, def: 3 }, visualAnchor: 'Golden gothic chalice filled with soft green soul light, no text.', fr: 'Le calice qui ouvre l’accès au Hall des Héros lorsqu’il est rempli.', en: 'The chalice that opens the Hall of Heroes once filled.' }
  ],
  event: { id: 'hall_of_heroes', enName: 'Hall of Heroes Recognition', frName: 'Reconnaissance du Hall des Héros', en: 'The spectral heroes finally acknowledge Dan after the chalices and Gallowmere are secured.', fr: 'Les héros spectraux reconnaissent enfin Dan après la sécurisation des calices et de Gallowmere.', visualAnchor: 'Jawless Sir Dan beneath luminous statues raising their cups in a vast golden hall.', canonStatus: 'canon redemption event' }
});

const jerseyDevil = definePack(JERSEY_DEVIL, {
  aliases: ['Devil', 'Jersey Devil (1997)', 'Jersey Devil game'],
  mediaType: 'video-game', faction: 'cartoon', mode: 'RPG', difficulty: 'Hard',
  colors: ['#39285c', '#09060e', '#f08a28'], motif: 'halloweentown',
  theme: 'the Jersey Devil freeing Jersey City from Dr. Knarf’s mutant army',
  continuity: 'Behaviour Interactive / Megatoon Jersey Devil (PlayStation and PC)',
  adaptationRule: 'The ambiguous request “devil” is resolved as Jersey Devil because it sits among mascot platform games. The original has one silent playable hero: hostages and city police remain non-combat rescue/arrest Trials, never invented sidekick fighters. Preserve Knarf’s named assistant Dennis and mutant bestiary.',
  visualAnchor: 'Late-1990s cartoon Halloween city, purple batlike hero, orange pumpkins, crooked museum and oversized mutant vegetables.',
  canonStatus: 'single-game canon with transparent solo-hero limitation',
  fr: 'Le Jersey Devil libère les otages de Jersey City et remonte la piste de Dennis jusqu’au laboratoire du Dr Knarf.',
  en: 'The Jersey Devil frees Jersey City’s hostages and follows Dennis’s trail to Dr. Knarf’s laboratory.',
  referenceUrls: [JERSEY_DEVIL.url, 'https://www.gamesdatabase.org/game/sony-playstation/jersey-devil.aspx/', 'https://www.mobygames.com/game/14697/jersey-devil/'],
  characters: [
    { id: 'jersey_devil', name: 'Jersey Devil', role: 'slayer', weapon: 'Tail whip', weaponType: 'fists', simple: 'Punch', secondary: 'Jumping tail spin', defense: 'Wing glide', special: 'Nitro-powered tail sweep', visualAnchor: 'Small silent purple devil mascot with huge pointed ears, long tail, tiny black wings, white gloves and dark superhero-like body suit; no Batman emblem.', fr: 'Le héros silencieux frappe, tournoie et plane avec ses petites ailes.', en: 'The silent hero punches, spins and glides with his small wings.' },
    { id: 'hostage_rescue', name: 'Jersey City Hostage Rescue', role: 'trial', nonCombat: true, objective: 'Find each cage switch and release every canonical hostage in the district.', objectiveFr: 'Trouver chaque interrupteur de cage et libérer tous les otages canoniques du quartier.', victoryCondition: 'all-hostages-released', visualAnchor: 'Cartoon city residents in hanging cages with clear switch-to-cage routes across four rescue states.', fr: 'Les habitants en cage sont des objectifs de sauvetage, jamais des combattants.', en: 'The caged residents are rescue objectives, never fighters.', canonStatus: 'canon collectible rescue Trial' },
    { id: 'police_arrest', name: 'Jersey City Police Arrest Route', role: 'trial', nonCombat: true, objective: 'Open the forest-lair exit so city police can arrest Dr. Knarf after his defeat.', objectiveFr: 'Ouvrir la sortie du repaire forestier pour que la police puisse arrêter le Dr Knarf après sa défaite.', victoryCondition: 'knarf-in-custody', visualAnchor: 'Cartoon police wagon approaching Knarf’s ruined forest lab through an opened gate, no weapons or combat pose.', fr: 'La police arrête Knarf dans la conclusion ; elle n’est pas inventée comme équipe jouable.', en: 'Police arrest Knarf in the ending; they are not invented as a playable squad.', canonStatus: 'canon ending-resolution Trial' }
  ],
  monsters: [
    { id: 'mutant_pumpkin', name: 'Mutant Pumpkin', weapon: 'Thrown bomb', special: 'Rolling chase', visualAnchor: 'Grinning orange humanoid pumpkin mutant with leafy limbs and a small cartoon bomb.', fr: 'Une citrouille mutante de l’armée de Knarf.', en: 'A mutant pumpkin from Knarf’s army.' },
    { id: 'giant_carrot', name: 'Giant Carrot', weapon: 'Body slam', special: 'Little-carrot scatter', visualAnchor: 'Towering orange carrot with green top, cartoon eyes and several tiny carrot offshoots.', fr: 'Une carotte géante qui libère de petites carottes lorsqu’elle est frappée.', en: 'A giant carrot that sheds small carrots when struck.' },
    { id: 'pterodactyl', name: 'Knarf Pterodactyl', weapon: 'Aerial bite', special: 'Museum dive', visualAnchor: 'Cartoon prehistoric flying reptile with green-brown hide circling museum rafters.', fr: 'Une créature préhistorique lâchée par les expériences de Knarf.', en: 'A prehistoric creature released by Knarf’s experiments.' }
  ],
  bosses: [
    { id: 'dennis', name: 'Dennis the Pumpkin-Head', weapon: 'Wooden mallet', special: 'Dizzy tornado charge', visualAnchor: 'Tall lanky humanoid with oversized orange pumpkin head, striped clothes and wooden mallet, visibly Knarf’s clumsy assistant.', fr: 'Dennis, l’assistant de Knarf, revient dans plusieurs rencontres.', en: 'Dennis, Knarf’s assistant, returns in several encounters.', canonStatus: 'canon recurring boss and assistant' },
    { id: 'skeleton_dinosaur', name: 'Skeleton Dinosaur', weapon: 'Bone jaws', special: 'Museum fossil charge', visualAnchor: 'Reanimated cartoon dinosaur museum skeleton under moonlit exhibition glass, no gore.', fr: 'Un fossile animé protège le parcours du musée.', en: 'An animated fossil guards the museum route.', canonStatus: 'canon game boss' },
    { id: 'giant_octopus', name: 'Giant Octopus', weapon: 'Tentacles', special: 'Seaport platform sweep', visualAnchor: 'Huge purple-green cartoon octopus emerging among dock pylons and cargo cranes.', fr: 'Le poulpe géant verrouille la progression du port.', en: 'The giant octopus locks down the seaport route.', canonStatus: 'canon game boss' }
  ],
  worldBoss: { id: 'dr_knarf', name: 'Dr. Knarf', weapon: 'Mutagen bottles', special: 'Forest-lab machine barrage', visualAnchor: 'Wild-haired cartoon mad scientist in white coat and green gloves operating a crooked laboratory contraption, original face.', fr: 'Le savant qui a créé les légumes mutants et terrorise la ville.', en: 'The scientist who created the mutant vegetables and terrorizes the city.' },
  stage: { name: 'Jersey City — musée nocturne', visualAnchor: 'Cartoon stone museum, giant fossil halls, purple night sky, pumpkin lamps and Knarf-letter locks.', fr: 'Dennis entraîne le héros dans le musée rempli d’expériences.', en: 'Dennis leads the hero into a museum filled with experiments.' },
  stageVariants: [
    stageVariant('Trial', 'Jersey City — réseau de cages', 'Hard', 'Jersey City Hostage Rescue', { nonCombat: true, trialType: 'Trial', objective: 'Find switches and free all residents before leaving the district.' }),
    stageVariant('RPG', 'Forêt de Knarf — laboratoire final', 'Very Hard', 'Dr. Knarf', { objective: 'Cross the mutant forest, defeat Dennis and stop Knarf’s machine.' })
  ],
  gear: [
    { id: 'nitro_bottle', enName: 'Nitroglycerin Bottle', frName: 'Bouteille de nitroglycérine', boost: { atk: 7 }, visualAnchor: 'Round cartoon chemistry bottle with orange liquid, cork and an original abstract hazard mark.', fr: 'Le nitro détruit les installations de Knarf et augmente la puissance.', en: 'Nitro destroys Knarf’s installations and increases power.' },
    { id: 'golden_pumpkin', enName: 'Golden Pumpkin', frName: 'Citrouille dorée', boost: { hp: 65 }, visualAnchor: 'Small polished golden pumpkin with curled green stem and warm glow.', fr: 'La citrouille dorée restaure le héros.', en: 'The golden pumpkin restores the hero.' },
    { id: 'devil_tail', enName: 'Devil Tail', frName: 'Queue de Devil', boost: { spd: 2, def: 4 }, visualAnchor: 'Purple curved collectible tail with pointed tip floating above a small pedestal.', fr: 'La queue violette est un objet de vie supplémentaire.', en: 'The purple tail is an extra-life collectible.' }
  ],
  event: { id: 'knarf_letters', enName: 'KNARF Lock Hunt', frName: 'Chasse aux verrous KNARF', en: 'Five letter tokens open each Knarf lock while cages and nitro crates make the district route fully clearable.', fr: 'Cinq jetons-lettres ouvrent chaque verrou de Knarf tandis que cages et caisses de nitro rendent le quartier entièrement nettoyable.', visualAnchor: 'Five abstract letter-shaped token silhouettes slotting into a crooked laboratory gate; no copied UI font.', canonStatus: 'canon collection-loop adaptation' }
});

const goemonsGreatAdventure = definePack(GOEMON, {
  aliases: ["Goémon d’aventure", 'Goemon Great Adventure', 'Mystical Ninja 2 Starring Goemon'],
  mediaType: 'video-game', faction: 'clockwork', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#243c6b', '#080b10', '#e8c447'], motif: 'edo',
  theme: 'Goemon’s gang crossing ghost-infested Edo to stop Dochuki',
  continuity: "Goemon's Great Adventure / Ganbare Goemon: Dero Dero Dōchū (Nintendo 64)",
  adaptationRule: 'The spelling “Goémon d’aventure” is resolved to Goemon’s Great Adventure. Use only this game’s manual roster, five-area structure, Entry Passes, day/night ghosts and two-Impact giant-robot system. Dochuki is Underworld boss summoned by Bismaru, not a generic demon.',
  visualAnchor: 'Colorful side-view Edo roads, lantern towns, night ghosts, comic clockwork castles and giant kabuki robots.',
  canonStatus: 'Nintendo 64 game canon grounded in its English manual',
  fr: 'Goemon, Ebisumaru et Yae récupèrent la machine du Sage et affrontent l’armée de poupées d’argile qui prépare la prise de pouvoir de Dochuki.',
  en: 'Goemon, Ebisumaru and Yae recover Wiseman’s machine and confront the Clay Doll Army enabling Dochuki’s takeover.',
  referenceUrls: [GOEMON.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Nintendo_N64/Manual/formated/Goemon-s_Great_Adventure_-_1999_-_Konami.pdf'],
  characters: [
    { id: 'goemon', name: 'Goemon', role: 'slayer', weapon: 'Family pipe', weaponType: 'fists', simple: 'Pipe strike', secondary: 'Wave coin', defense: 'Double jump', special: 'Flame coin', visualAnchor: 'Blue-haired Edo hero in red ninja-style outfit, white wrist wraps, sandals and long kiseru-like family pipe.', fr: 'Le héros impulsif combat avec la pipe transmise dans sa famille.', en: 'The impulsive hero fights with the pipe handed down through his family.' },
    { id: 'ebisumaru', name: 'Ebisumaru', role: 'marine', weapon: 'Magic mallet', weaponType: 'fists', simple: 'Mallet swing', secondary: 'Gesyunnin stars', defense: 'Hip attack', special: 'Mini-Ebisu transformation', visualAnchor: 'Round blue-clad comic ninja with white hood, red nose, sandals and oversized wooden magic mallet.', fr: 'Le partenaire rond et imprévisible dispose du maillet et de techniques uniques.', en: 'The round unpredictable partner uses a mallet and unique techniques.' },
    { id: 'yae', name: 'Yae', role: 'tactical', weapon: 'Katana', weaponType: 'blade', simple: 'Katana slash', secondary: 'Yae bazooka', defense: 'Mermaid dive', special: 'Lock-on bazooka', visualAnchor: 'Green-haired Secret Special Investigations ninja in purple-red practical shinobi clothes with katana and compact bazooka, no sexualization.', fr: 'Ninja d’investigation, Yae apporte katana, bazooka et magie de sirène.', en: 'An investigations ninja, Yae brings katana, bazooka and mermaid magic.' }
  ],
  monsters: [
    { id: 'clay_doll', name: 'Clay Doll Army Cavalry', weapon: 'Clay spear', special: 'Soul-embedded rush', visualAnchor: 'Small ochre mud-doll cavalry with paperlike armor and visible cracks, comic rather than realistic.', fr: 'Les âmes intégrées aux poupées d’argile forment l’armée de Bismaru.', en: 'Souls embedded in clay dolls form Bismaru’s army.', canonStatus: 'canon manual faction' },
    { id: 'night_ghost', name: 'Night Road Ghost', weapon: 'Ectoplasmic touch', special: 'Night-cycle swarm', visualAnchor: 'Playful translucent blue-white Edo ghost hovering over a lantern road after sunset.', fr: 'Les routes deviennent plus dangereuses lorsque les fantômes apparaissent la nuit.', en: 'Roads become more dangerous when ghosts appear at night.', canonStatus: 'canon manual stage enemy archetype' },
    { id: 'clockwork_patrol', name: 'Clockwork Castle Patrol', weapon: 'Mechanical blade', special: 'Trap synchronization', visualAnchor: 'Compact colorful Edo clockwork soldier with brass gears and lacquered blue armor.', fr: 'Un automate affecté aux châteaux piégés.', en: 'An automaton assigned to trapped castles.', canonStatus: 'canon stage enemy archetype' }
  ],
  bosses: [
    { id: 'kabuki_64', name: 'Kabuki 64', weapon: 'Kabuki blade', special: 'Underworld return', visualAnchor: 'Huge theatrical kabuki automaton with white-red face paint, towering black hair and clockwork joints.', fr: 'Kabuki revient des profondeurs pour se venger de Goemon.', en: 'Kabuki returns from the abyss to take revenge on Goemon.', canonStatus: 'canon manual boss' },
    { id: 'obisumaru', name: 'Obisumaru', weapon: 'Dirty-trick arsenal', special: 'Ebisumaru rivalry feint', visualAnchor: 'Showy comic ninja rival echoing Ebisumaru’s round shape in contrasting orange-black clothes.', fr: 'Le rival éternel d’Ebisumaru excelle dans les coups bas.', en: 'Ebisumaru’s eternal rival excels at dirty tricks.', canonStatus: 'canon manual rival boss' },
    { id: 'bismaru', name: 'Bismaru', weapon: 'Summoning machine controls', special: 'Clay Doll deployment', visualAnchor: 'Eccentric future traveler in ornate pink-purple Edo-future costume at a ghost-summoning clockwork console.', fr: 'Bismaru vole la machine du Sage et invoque Dochuki.', en: 'Bismaru steals Wiseman’s machine and summons Dochuki.', canonStatus: 'canon summoner antagonist' }
  ],
  worldBoss: { id: 'dochuki', name: 'Dochuki', weapon: 'Underworld power', special: 'Earth-and-Underworld takeover', visualAnchor: 'Massive purple-red Underworld sovereign with ancient ghost-war armor, horned silhouette and clockwork portal behind him.', fr: 'Le chef du Monde souterrain, autrefois emprisonné après une guerre entre fantômes.', en: 'The Underworld boss once imprisoned after an inter-ghost war.', canonStatus: 'canon final antagonist described by manual' },
  stage: { name: 'Route d’Edo — cycle jour/nuit', visualAnchor: 'Side-view rice fields, wooden bridges, red lanterns and a sky transitioning from gold to ghostly indigo.', fr: 'La même route change de population et de danger lorsque la nuit tombe.', en: 'The same road changes population and danger when night falls.' },
  stageVariants: [
    stageVariant('RPG', 'Château de Kabuki 64', 'Very Hard', 'Kabuki 64', { objective: 'Collect Entry Passes, cross the trap rooms and stop Kabuki 64.' }),
    stageVariant('Smash', 'Robot géant — Impact et Miss Impact', 'Expert', 'Dochuki', { objective: 'Alternate both Impact controls, fill the Blast Gauge and close Dochuki’s machine portal.' })
  ],
  gear: [
    { id: 'chain_pipe', enName: 'Goemon’s Chain Pipe', frName: 'Pipe-chaîne de Goemon', boost: { atk: 6, spd: 1 }, visualAnchor: 'Long red-brown smoking pipe extending on a linked metal chain.', fr: 'La pipe peut s’allonger pour frapper et briser des blocs-étoiles.', en: 'The pipe extends to strike and break Star Blocks.' },
    { id: 'entry_pass', enName: 'Entry Pass', frName: 'Laissez-passer', boost: { hp: 40, def: 4 }, visualAnchor: 'Small Edo travel pass with original abstract seal and no readable characters.', fr: 'Les laissez-passer ouvrent les étapes de porte.', en: 'Entry Passes open gate stages.' },
    { id: 'gold_armor', enName: 'Gold Armor', frName: 'Armure d’or', boost: { def: 8 }, visualAnchor: 'Compact lacquered gold Edo armor pickup on a small cushion.', fr: 'L’armure d’or repousse trois attaques selon le manuel.', en: 'Gold Armor repels three attacks according to the manual.' }
  ],
  event: { id: 'repeat_coop', enName: 'Impact Repeat Cooperative Attack', frName: 'Attaque coopérative répétée d’Impact', en: 'Goemon Impact and Miss Impact alternate cockpit and field controls to build the manual’s cooperative combo.', fr: 'Goemon Impact et Miss Impact alternent commandes de cockpit et de terrain pour construire le combo coopératif du manuel.', visualAnchor: 'Two giant clockwork robots passing the control baton before a synchronized punch-and-kick impact.', canonStatus: 'canon manual giant-robot mechanic' }
});

const mdk = definePack(MDK, {
  aliases: ['MDR', 'MDK franchise', 'MDK 2'],
  mediaType: 'video-game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#293d50', '#05080a', '#e84f4f'], motif: 'streamrider',
  theme: 'Kurt, Max and Dr. Hawkins repelling the second Streamrider invasion',
  continuity: 'MDK 2, continuing directly after MDK; first-game facts tagged as prologue',
  adaptationRule: 'The ambiguous “mdr” is resolved as MDK from the surrounding 1990s game list. Use MDK2’s three playable heroes exactly: Kurt’s Coil Suit, Max’s four gun arms and Hawkins’s item combinations. Streamrider enemy names follow the official manual.',
  visualAnchor: 'Surreal silver-blue alien megastructures, Coil Suit ribbon chute, oversized comic weapons and bright energy streams.',
  canonStatus: 'MDK2 canon with official manual anchors',
  fr: 'Kurt Hectic, Max et le Dr Fluke Hawkins quittent le Jim Dandy pour arrêter la nouvelle invasion organisée comme divertissement impérial.',
  en: 'Kurt Hectic, Max and Dr. Fluke Hawkins leave the Jim Dandy to stop a renewed invasion staged as imperial entertainment.',
  referenceUrls: [MDK.url, 'https://www.gog.com/en/game/mdk_2', 'https://www.gog.com/en/game/mdk'],
  characters: [
    { id: 'kurt_hectic', name: 'Kurt Hectic', role: 'tactical', weapon: 'Coil Suit chain gun', weaponType: 'gun', simple: 'Chain-gun burst', secondary: 'Sniper shot', defense: 'Ribbon Chute glide', special: 'Coil Suit precision run', visualAnchor: 'Reluctant janitor hero in sleek black-silver Coil Suit with long pointed helmet, arm chain gun and red ribbon parachute.', fr: 'Le concierge réticent combine tir continu, précision et vol plané.', en: 'The reluctant janitor combines sustained fire, precision and gliding.' },
    { id: 'max', runtimeId: 'max_mdk', name: 'Max', role: 'marine', weapon: 'Four simultaneous guns', weaponType: 'gun', simple: 'Four-gun volley', secondary: 'Jetpack strafe', defense: 'Robotic-dog brace', special: 'Atomic jetpack barrage', visualAnchor: 'Six-legged robotic dog standing on two legs with four weapon-bearing arms, long canine head and steel-blue body.', fr: 'Le chien robot de Hawkins peut porter quatre armes à la fois.', en: 'Hawkins’s robotic dog can carry four weapons at once.' },
    { id: 'dr_hawkins', name: 'Dr. Fluke Hawkins', role: 'hacker', weapon: 'Combined inventions', weaponType: 'focus', simple: 'Inventory combination', secondary: 'Explosive loaf', defense: 'Improvised shield device', special: 'Unlikely invention chain', visualAnchor: 'Eccentric elderly scientist with white hair tufts, round goggles, blue coat and one odd household item in each hand.', fr: 'Physiquement fragile, Hawkins résout ses niveaux en combinant des objets.', en: 'Physically frail, Hawkins solves his levels by combining items.' }
  ],
  monsters: [
    { id: 'conehead', name: 'Conehead', weapon: 'Psychic attack', special: 'Barrier-passing pulse', visualAnchor: 'Small alien worker with elongated cone head, bright work suit and visible psychic wave.', fr: 'La classe ouvrière Streamrider répond par une attaque psychique lorsqu’elle est provoquée.', en: 'The Streamrider working class responds with a psychic attack when provoked.', canonStatus: 'canon official-manual enemy' },
    { id: 'bottrock', name: 'Bottrock', weapon: 'Energy cannon', special: 'Concussive grenade leap', visualAnchor: 'Agile alien shock trooper with squat armored body, energy cannon and grenade belt.', fr: 'Le fantassin de choc mobile des Streamriders.', en: 'The Streamriders’ mobile shock trooper.', canonStatus: 'canon official-manual enemy' },
    { id: 'birdbrain', name: 'Birdbrain', weapon: 'Sentry blaster', special: 'Flying pursuit', visualAnchor: 'Irritable winged alien sentry with beaked head and compact blaster.', fr: 'Une sentinelle volante tenace.', en: 'A tenacious flying sentry.', canonStatus: 'canon official-manual enemy' }
  ],
  bosses: [
    { id: 'bfb', name: 'BFB', weapon: 'Giant-brain energy', special: 'Regenerating shield', visualAnchor: 'Comically top-heavy alien with enormous exposed stylized brain, tiny body and spherical force shield, no gore.', fr: 'L’extraterrestre à très grand cerveau oppose son intelligence à Hawkins.', en: 'The very-big-brained alien pits its intelligence against Hawkins.', canonStatus: 'canon MDK2 boss' },
    { id: 'badmax', name: 'BadMax', weapon: 'Tracking lasers', special: 'Shield-and-heal cycle', visualAnchor: 'Oversized hostile mechanical dog modeled after Max, dark red steel, laser emitters and broad force shield.', fr: 'Une imitation hostile et agrandie de Max créée par BFB.', en: 'A hostile enlarged imitation of Max created by BFB.', canonStatus: 'canon MDK2 boss' },
    { id: 'shwang_shwing', name: 'Shwang Shwing', weapon: 'Alien heavy strikes', special: 'Warship pursuit', visualAnchor: 'Huge cocky Streamrider lieutenant with pink shades, broad green body and damaged wheelchair-mounted return form kept mechanical.', fr: 'Le bras droit impérial annonce que l’invasion n’est pas terminée.', en: 'The imperial right-hand alien reveals that the invasion is not over.', canonStatus: 'canon recurring MDK2 boss', aliases: ['Shwang Shwing', 'Shwing Shwang'] }
  ],
  worldBoss: { id: 'zizzy_ballooba', name: 'Emperor Zizzy Ballooba', weapon: 'Imperial energy', special: 'Palace reality assault', visualAnchor: 'Gigantic legless green alien emperor with crownlike headpiece, broad grin and surreal palace chamber, no copied logo.', fr: 'Le souverain de Swizzle Firma attaque la Terre pour tromper son ennui.', en: 'The ruler of Swizzle Firma attacks Earth to relieve his boredom.', canonStatus: 'canon MDK2 final boss' },
  stage: { name: 'Jim Dandy — seconde alerte d’invasion', visualAnchor: 'Eccentric orbital laboratory with blue metal corridors, household-item workbench and Earth behind panoramic glass.', fr: 'La célébration de la première victoire est interrompue par un nouveau Minecrawler.', en: 'Celebration of the first victory is interrupted by another Minecrawler.' },
  stageVariants: [
    stageVariant('Tactics', 'Minecrawler d’Edmonton', 'Very Hard', 'Shwang Shwing', { objective: 'Infiltrate the last Minecrawler, destroy its control point and identify the second invasion.' }),
    stageVariant('RPG', 'Palais de Swizzle Firma', 'Expert', 'Emperor Zizzy Ballooba', { objective: 'Choose Kurt, Max or Hawkins and reach Zizzy through the hero-specific route.' })
  ],
  gear: [
    { id: 'coil_suit', enName: 'Coil Suit', frName: 'Coil Suit', boost: { atk: 5, def: 5 }, visualAnchor: 'Black-silver armored suit module with integrated chain gun, sniper optic and folded red ribbon chute.', fr: 'L’invention de Hawkins portée par Kurt.', en: 'Hawkins’s invention worn by Kurt.' },
    { id: 'atomic_jetpack', enName: 'Atomic Jetpack', frName: 'Jetpack atomique', boost: { spd: 3, hp: 35 }, visualAnchor: 'Compact twin-cylinder atomic jetpack sized for Max with blue exhaust glow.', fr: 'La variante de jetpack de Max qui se recharge.', en: 'Max’s recharging jetpack variant.' },
    { id: 'explosive_loaf', enName: 'Explosive Loaf', frName: 'Pain explosif', boost: { atk: 7 }, visualAnchor: 'Cartoon loaf wired to a tiny Hawkins detonator, no brand or text.', fr: 'Une combinaison improbable des objets de Hawkins.', en: 'One of Hawkins’s unlikely item combinations.', canonStatus: 'canon gameplay combination' }
  ],
  event: { id: 'three_routes', enName: 'Three Routes to Zizzy', frName: 'Trois routes vers Zizzy', en: 'Kurt sneaks, Max blasts and Hawkins improvises through three distinct palace routes before the same confrontation.', fr: 'Kurt s’infiltre, Max arrose et Hawkins improvise sur trois routes distinctes du palais avant la même confrontation.', visualAnchor: 'Palace split into sniper, four-gun and invention lanes converging on one surreal chamber.', canonStatus: 'canon level-ten choice event' }
});

const tailConcerto = definePack(TAIL_CONCERTO, {
  aliases: ['Tail Concerto', 'Little Tail Bronx: Tail Concerto'],
  mediaType: 'video-game', faction: 'skyisland', mode: 'RPG', difficulty: 'Hard',
  colors: ['#5aa7cf', '#102337', '#f3cf5d'], motif: 'policerobo',
  theme: 'Waffle’s police pursuit becoming a rescue of Alicia and Prairie',
  continuity: 'Tail Concerto (PlayStation) only',
  adaptationRule: 'Waffle arrests Black Cat kittens non-lethally with bubbles and transport. Kittens are capture Trials, never evil HP fodder. Alicia changes sides for the Iron Giant finale; Fool’s manipulation and the Giant’s core are kept distinct.',
  visualAnchor: 'Bright floating Prairie islands, anime airships, Caninu and Felineko citizens, Police Robo walker and cat-shaped mecha.',
  canonStatus: 'single-game Little Tail Bronx canon with non-lethal arrest rules',
  fr: 'L’officier Waffle poursuit le gang des Chats Noirs, retrouve Alicia et découvre que Fool utilise les cinq cristaux pour réveiller le Géant de Fer.',
  en: 'Officer Waffle pursues the Black Cats, reunites with Alicia and learns Fool is using five crystals to awaken the Iron Giant.',
  referenceUrls: [TAIL_CONCERTO.url, 'https://gamefaqs.gamespot.com/ps/198882-tail-concerto/faqs/17187', 'https://littletail.wiki/Tail_Concerto'],
  characters: [
    { id: 'waffle', name: 'Waffle Ryebread', role: 'tactical', weapon: 'Police Robo bubble blaster', weaponType: 'focus', simple: 'Bubble capture', secondary: 'Extendable-arm grab', defense: 'Police Robo hover', special: 'Transporter arrest sweep', visualAnchor: 'Cream-furred Caninu police officer in blue short-sleeved uniform and backward cap piloting a round blue-gray Police Robo walker.', fr: 'Policier Caninu qui privilégie l’arrestation et le sauvetage.', en: 'A Caninu police officer focused on arrest and rescue.', captureRule: 'All kitten captures are non-lethal.' },
    { id: 'alicia', name: 'Alicia Pris', role: 'slayer', weapon: 'Black Cat mecha controls', weaponType: 'focus', simple: 'Mecha command', secondary: 'Skull-bomb redirect', defense: 'Balloon retreat', special: 'Iron-Giant rescue alliance', visualAnchor: 'Orange-haired Felineko gang leader with black eyepatch, red flight jacket, black shorts over opaque leggings and cat-eared aviator cap; practical, non-sexualized design.', fr: 'Cheffe du gang et amie d’enfance de Waffle, manipulée par Fool avant la finale.', en: 'The gang leader and Waffle’s childhood friend, manipulated by Fool before the finale.', canonStatus: 'canon boss-then-ally' },
    { id: 'cyan', name: 'Cyan Garland', role: 'marine', weapon: 'Royal Guard saber', weaponType: 'blade', simple: 'Guard saber cut', secondary: 'Airship cover', defense: 'Royal brace', special: 'Prairie evacuation guard', visualAnchor: 'Tall Caninu royal guard in blue-white formal armor, cape, saber and airship harness.', fr: 'Garde royal qui assiste le sauvetage final de Prairie.', en: 'A royal guard who assists Prairie’s final rescue.', canonStatus: 'canon finale ally' }
  ],
  monsters: [
    { id: 'red_vest_kitten', name: 'Red-Vest Kitten Capture', nonCombat: true, objective: 'Catch the fast kitten in a bubble and transport it safely to headquarters.', objectiveFr: 'Capturer le chaton rapide dans une bulle et le transporter sans danger au quartier général.', victoryCondition: 'safe-capture', visualAnchor: 'Small Felineko kitten in red vest dodging a transparent blue bubble across four capture states.', fr: 'Le chaton rapide est arrêté, pas blessé.', en: 'The fast kitten is arrested, not harmed.', canonStatus: 'canon non-lethal capture target' },
    { id: 'blue_overalls_kitten', name: 'Blue-Overalls Kitten Vehicle Stop', nonCombat: true, objective: 'Disable the kitten’s small vehicle, then bubble-transport the unharmed driver.', objectiveFr: 'Désactiver le petit véhicule du chaton puis transporter le conducteur indemne dans une bulle.', victoryCondition: 'vehicle-disabled-safe-capture', visualAnchor: 'Small kitten in blue overalls leaving a stopped toy-like gang vehicle for a capture bubble.', fr: 'Le conducteur est extrait de son véhicule puis arrêté sans violence.', en: 'The driver is removed from the vehicle and arrested without harm.', canonStatus: 'canon non-lethal capture target' },
    { id: 'black_shirt_kitten', name: 'Black-Shirt Kitten Bomb Disposal', nonCombat: true, objective: 'Contain every skull bomb and capture the kitten after the fuse line is safe.', objectiveFr: 'Contenir toutes les bombes-crâne et capturer le chaton une fois les mèches sécurisées.', victoryCondition: 'bombs-contained-safe-capture', visualAnchor: 'Small kitten in black shirt beside stylized skull bombs being enclosed by blue police bubbles.', fr: 'Le lanceur de bombes devient une épreuve de désamorçage et d’arrestation.', en: 'The bomb thrower becomes a disposal-and-arrest Trial.', canonStatus: 'canon non-lethal capture target' }
  ],
  bosses: [
    { id: 'cat_mecha_1', name: 'Black Cat Mecha-I', weapon: 'Skull bombs', special: 'Two-handed balloon charge', visualAnchor: 'Round cat-faced balloon mecha with two huge grab arms, tiny walking bombs and Pris sisters visible in the cockpit.', fr: 'Le premier mecha renvoie ses propres bombes lorsqu’elles sont saisies.', en: 'The first mecha is hit by its own bombs when they are caught.' },
    { id: 'cat_mecha_3', name: 'Black Cat Mecha-III', weapon: 'Cat-bomb cannon', special: 'Six-legged tank stomp', visualAnchor: 'Large six-legged cat tank with central cannon, balloon rigging and three-sister cockpit.', fr: 'Le troisième mecha combine canon, pattes et arène ouverte.', en: 'The third mecha combines cannon, legs and an open arena.' },
    { id: 'fool', name: 'Fool', weapon: 'Relic manipulation', special: 'Five-crystal betrayal', visualAnchor: 'Sly purple-clad Felineko relic merchant with tall hat, crystal satchel and theatrical grin, original fan-made face.', fr: 'Le marchand de reliques pousse Alicia à réunir les cristaux.', en: 'The relic merchant pushes Alicia to gather the crystals.', canonStatus: 'canon true manipulator antagonist' }
  ],
  worldBoss: { id: 'iron_giant_core', name: 'Iron Giant Core Shutdown', nonCombat: true, objective: 'Reach Alicia, remove the five-crystal activation and destroy only the Giant’s control core before evacuating.', objectiveFr: 'Atteindre Alicia, retirer l’activation des cinq cristaux et détruire uniquement le noyau de contrôle avant l’évacuation.', victoryCondition: 'core-disabled-allies-evacuated', visualAnchor: 'Ancient colossal Iron Giant interior, five colored crystal sockets and central core across four shutdown states, no humanoid opponent.', fr: 'Le Géant est neutralisé depuis son noyau pendant le sauvetage d’Alicia.', en: 'The Giant is disabled from its core while Alicia is rescued.', canonStatus: 'canon environmental finale Trial' },
  stage: { name: 'Resaca — intervention du Police Robo', visualAnchor: 'Sunny floating-island town with canals, small balloons, Black Cat vehicles and Police Robo capture lanes.', fr: 'Waffle ouvre l’affaire en protégeant Resaca et en arrêtant les chatons.', en: 'Waffle opens the case by protecting Resaca and arresting kittens.' },
  stageVariants: [
    stageVariant('Trial', 'Forteresse des Chats Noirs — arrestations sûres', 'Hard', 'Black-Shirt Kitten Bomb Disposal', { nonCombat: true, trialType: 'Trial', objective: 'Disable vehicles, dispose of bombs and transport every kitten safely.' }),
    stageVariant('Trial', 'Géant de Fer — noyau ancestral', 'Expert', 'Iron Giant Core Shutdown', { nonCombat: true, trialType: 'Trial', objective: 'Rescue Alicia, remove the five crystals and shut down the core.' })
  ],
  gear: [
    { id: 'police_robo', enName: 'Police Robo', frName: 'Police Robo', boost: { def: 7, hp: 45 }, visualAnchor: 'Round blue-gray two-legged police walker with extendable arms, bubble nozzle and transporter lamp.', fr: 'Le véhicule de patrouille de Waffle.', en: 'Waffle’s patrol vehicle.' },
    { id: 'bubble_blaster', enName: 'Bubble Blaster', frName: 'Lanceur de bulles', boost: { atk: 3, spd: 2 }, visualAnchor: 'Police Robo nozzle generating a soft transparent blue capture sphere.', fr: 'L’outil d’arrestation non létal.', en: 'The non-lethal arrest tool.', canonStatus: 'canon non-lethal tool' },
    { id: 'blue_crystal', enName: 'Blue Crystal Pendant', frName: 'Pendentif au cristal bleu', boost: { hp: 55, def: 4 }, visualAnchor: 'Small blue crystal pendant tied with a simple childhood cord.', fr: 'Le pendentif rappelle le lien d’enfance entre Waffle et Alicia.', en: 'The pendant recalls Waffle and Alicia’s childhood bond.' }
  ],
  event: { id: 'pris_alliance', enName: 'Pris Sisters Alliance', frName: 'Alliance des sœurs Pris', en: 'Alicia, Flare and Stare turn the Black Cats’ machines toward the evacuation route while Waffle enters the Iron Giant.', fr: 'Alicia, Flare et Stare orientent les machines des Chats Noirs vers l’évacuation pendant que Waffle entre dans le Géant de Fer.', visualAnchor: 'Three distinct Pris sisters directing balloons away from the Iron Giant as Police Robo enters the core route.', canonStatus: 'canon finale alliance' }
});

const redneckRampage = definePack(REDNECK_RAMPAGE, {
  aliases: ['Hillbilly Rampage', 'Rendez-vous Rampage', 'rendez-vous rampage', 'Redneck Rampage Collection'],
  mediaType: 'video-game', faction: 'alien', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#684228', '#120b07', '#d9c452'], motif: 'hickston',
  theme: 'Leonard crossing alien-cloned Hickston to recover Bessie and find Bubba',
  continuity: 'Redneck Rampage (1997), with collection references kept separate from Rides Again',
  adaptationRule: '“Hillbilly Rampage” is normalized to Redneck Rampage, the Xatrix/Interplay game—not the unrelated arcade city-destruction series. Never import that series’ roster or lore. Leonard is the playable fighter; Bubba is a canonical level-exit/search Trial and Bessie a rescue Trial. Keep the adaptation non-graphic and omit sexualized Alien Vixen imagery.',
  visualAnchor: 'Rural Hickston farms, meat plant, trailer yards, alien machinery, Leonard’s suspenders and grotesque comic clones in a Build-engine palette.',
  canonStatus: '1997 game canon with adult humor softened for project-safe fan art',
  fr: 'Leonard traverse Hickston envahie par des extraterrestres qui ont cloné les habitants et enlevé la truie Bessie, tout en retrouvant Bubba à la sortie des niveaux.',
  en: 'Leonard crosses alien-invaded Hickston, whose residents were cloned and prize pig Bessie abducted, while finding Bubba at level exits.',
  referenceUrls: [REDNECK_RAMPAGE.url, 'https://www.gog.com/en/game/redneck_rampage_collection', 'https://store.steampowered.com/app/580940/Redneck_Rampage_Rides_Again/'],
  characters: [
    { id: 'leonard', name: 'Leonard', role: 'slayer', weapon: 'Scattergun', weaponType: 'gun', simple: 'Scattergun blast', secondary: 'Dynamite throw', defense: 'Hickston sidestep', special: 'Alien-homestead sweep', visualAnchor: 'Lean fictional Arkansas farmhand with red cap, yellow undershirt, blue denim overalls, boots and battered scattergun; original face.', fr: 'Le combattant jouable part récupérer Bessie.', en: 'The playable fighter sets out to recover Bessie.' },
    { id: 'bubba_route', name: 'Find Bubba — Level Exit', role: 'trial', nonCombat: true, objective: 'Locate Bubba after clearing the route and trigger the canonical comic level exit without an opponent bar.', objectiveFr: 'Retrouver Bubba après avoir dégagé la route et déclencher la sortie comique canonique sans barre d’adversaire.', victoryCondition: 'bubba-found-exit-triggered', visualAnchor: 'Large friendly farmhand Bubba waiting at a route exit beside a crowbar icon shown only as slapstick signal, no impact.', fr: 'Bubba sert de repère de sortie et de compagnon à retrouver, pas de faux combattant.', en: 'Bubba is a level-exit marker and companion to find, not a fake fighter.', canonStatus: 'canon non-combat level-exit Trial' },
    { id: 'bessie_rescue', name: 'Bessie Rescue', role: 'trial', nonCombat: true, objective: 'Trace the alien abduction route and return prize pig Bessie safely to Leonard and Bubba.', objectiveFr: 'Suivre la route d’enlèvement extraterrestre et ramener la truie Bessie saine et sauve à Leonard et Bubba.', victoryCondition: 'bessie-home-safe', visualAnchor: 'Friendly prize pig in an alien holding pen progressing through four safe rescue states.', fr: 'Bessie est le véritable objectif de sauvetage du jeu.', en: 'Bessie is the game’s true rescue objective.', canonStatus: 'canon non-combat rescue objective' }
  ],
  monsters: [
    { id: 'skinny_old_coot', name: 'Skinny Old Coot Clone', weapon: 'Shotgun', special: 'Hickston ambush', visualAnchor: 'Gaunt cloned local in patched rural clothes and floppy hat, exaggerated comic proportions and no gore.', fr: 'Un habitant cloné par les envahisseurs.', en: 'A local cloned by the invaders.', canonStatus: 'canon manual enemy' },
    { id: 'billy_ray', name: 'Billy Ray Jeter Clone', weapon: 'Heavy farm tool', special: 'Thick-skulled rush', visualAnchor: 'Huge cloned hillbilly in stained overalls and boots, original comic face and no gore.', fr: 'Le manuel décrit Billy Ray comme un clone particulièrement solide.', en: 'The manual describes Billy Ray as a particularly tough clone.', canonStatus: 'canon manual enemy' },
    { id: 'alien_hulk_guard', name: 'Alien Hulk Guard', weapon: 'Integrated alien guns', special: 'Backup-battery recharge', visualAnchor: 'Large half-creature half-machine alien guard with green armor, multiple built-in weapons and glowing battery pack.', fr: 'Le garde extraterrestre cybernétique se recharge s’il n’est pas arrêté.', en: 'The cybernetic alien guard recharges if not stopped.', canonStatus: 'canon manual enemy' }
  ],
  bosses: [
    { id: 'sheriff_hobbes', name: 'Sheriff Lester T. Hobbes', weapon: 'Sheriff’s shotgun', special: 'Extreme county ambush', visualAnchor: 'Broad fictional county sheriff in tan uniform, dark sunglasses and oversized hat, original face and no real police badge.', fr: 'Le shérif Hobbes applique sa propre justice extrême.', en: 'Sheriff Hobbes enforces his own extreme justice.', canonStatus: 'canon named manual enemy' },
    { id: 'assface', name: 'Assface', weapon: 'Alien heavy attack', special: 'Hickston boss rush', visualAnchor: 'Large grotesque but non-graphic alien-mutant boss with lopsided head, brown-green hide and mechanical harness.', fr: 'Le premier boss nommé du jeu original.', en: 'The original game’s first named boss.', canonStatus: 'canon game boss' },
    { id: 'flying_saucer', name: 'Alien Flying Saucer', weapon: 'Energy beam', special: 'Abduction tractor field', visualAnchor: 'Rusty silver-green flying saucer hovering above a Hickston barn with a yellow tractor beam.', fr: 'Le vaisseau relie les enlèvements à la base des envahisseurs.', en: 'The craft connects the abductions to the invaders’ base.', canonStatus: 'canon manual enemy vehicle' }
  ],
  worldBoss: { id: 'queen_vixen', name: 'Queen Vixen', weapon: 'Alien command energy', special: 'Mothership defense', visualAnchor: 'Regal non-sexualized alien invasion queen in full green-purple biomechanical armor with broad crownlike head crest and command console.', fr: 'La souveraine extraterrestre dirige l’invasion et constitue la finale du jeu.', en: 'The alien sovereign directs the invasion and is the game’s finale.', canonStatus: 'canon final boss', depictionRule: 'Full practical armor; no fetishwear or sexualized pose.' },
  stage: { name: 'Hickston — ferme clonée', visualAnchor: 'Dry Arkansas farm, red barn, pig pens, patched trailers and a hovering saucer behind cornfields.', fr: 'La piste de Bessie commence dans une ferme remplie de voisins clonés.', en: 'Bessie’s trail begins at a farm filled with cloned neighbors.' },
  stageVariants: [
    stageVariant('Trial', 'Hickston — retrouver Bubba', 'Hard', 'Find Bubba — Level Exit', { nonCombat: true, trialType: 'Trial', objective: 'Clear a safe path, locate Bubba and trigger the comic exit without fighting him.' }),
    stageVariant('RPG', 'Vaisseau-mère — enclos de Bessie', 'Expert', 'Queen Vixen', { objective: 'Open Bessie’s pen, disable the tractor field and stop Queen Vixen.' })
  ],
  gear: [
    { id: 'crowbar', enName: 'Crowbar', frName: 'Pied-de-biche', boost: { atk: 5, spd: 1 }, visualAnchor: 'Worn red-brown farm crowbar with chipped paint, no blood.', fr: 'Outil de mêlée et signal comique de sortie de niveau.', en: 'A melee tool and comic level-exit signal.' },
    { id: 'dynamite_crossbow', enName: 'Dynamite Crossbow', frName: 'Arbalète à dynamite', boost: { atk: 8 }, visualAnchor: 'Improvised wooden crossbow carrying one red dynamite bolt, no live animal projectile.', fr: 'Une arme bricolée de Rides Again intégrée comme objet de franchise.', en: 'A Rides Again improvised weapon included as franchise gear.', canonStatus: 'canon Rides Again gear' },
    { id: 'hip_waders', enName: 'Hip Waders', frName: 'Cuissardes', boost: { spd: 2, def: 5 }, visualAnchor: 'Pair of tall patched green waders with heavy farm boots.', fr: 'Les cuissardes accélèrent les déplacements dans les zones boueuses.', en: 'The waders speed movement through muddy areas.' }
  ],
  event: { id: 'bessie_trail', enName: 'Bessie Abduction Trail', frName: 'Piste de l’enlèvement de Bessie', en: 'Alien tractor traces, cloned neighbors and each Bubba exit marker connect Hickston to the mothership pen.', fr: 'Les traces de rayon tracteur, les voisins clonés et chaque repère de sortie Bubba relient Hickston à l’enclos du vaisseau-mère.', visualAnchor: 'Farm map progressing from pig pen through cloned town to a saucer holding bay.', canonStatus: 'canon rescue-chain adaptation', nonCombat: true }
});

const hexen = definePack(HEXEN, {
  aliases: ['Hexen: Beyond Heretic', 'Hexen franchise'],
  mediaType: 'video-game', faction: 'arcane', mode: 'RPG', difficulty: 'Expert',
  colors: ['#33402a', '#070807', '#8cbf57'], motif: 'chaossphere',
  theme: 'the three survivors of Cronos breaking Korax’s corrupted order',
  continuity: 'Hexen: Beyond Heretic (1995) game and official manual',
  adaptationRule: 'Use exactly the manual’s three class heroes, their ultimate weapons, hub structure and corrupted leaders. Zedek, Traductus and Menelkir are former human leaders granted Unlife by Korax; Korax is the second Serpent Rider and sole world boss.',
  visualAnchor: 'Oppressive Cronos fortresses, mossy stone hubs, green magic, medieval machinery and three sharply different class silhouettes.',
  canonStatus: 'Hexen game canon grounded in Raven/GT manual text',
  fr: 'Baratus, Parias et Daedolon sont les seuls humains à échapper au pouvoir de Korax et jurent d’abattre leurs anciens dirigeants corrompus.',
  en: 'Baratus, Parias and Daedolon are the only humans to escape Korax’s power and swear to destroy their corrupted former leaders.',
  referenceUrls: [HEXEN.url, 'https://store.steampowered.com/app/2360/HeXen_Beyond_Heretic/', 'https://www.gog.com/en/game/hexen_beyond_heretic'],
  characters: [
    { id: 'baratus', name: 'Baratus', role: 'marine', weapon: 'Timon’s Axe', weaponType: 'blade', simple: 'Axe cut', secondary: 'Hammer of Retribution', defense: 'Legion armor brace', special: 'Quietus assembly', visualAnchor: 'Powerful Legion warrior in heavy brown-steel armor, bare muscular arms, horned helm and broad enchanted axe.', fr: 'Guerrier de la Légion, le plus rapide et le plus robuste au contact.', en: 'A Legion warrior, fastest and strongest at close range.' },
    { id: 'parias', name: 'Parias', role: 'tactical', weapon: 'Serpent Staff', weaponType: 'magic', simple: 'Mace of Contrition', secondary: 'Firestorm', defense: 'Healing prayer', special: 'Wraithverge assembly', visualAnchor: 'Stern Church cleric in green-gold battle robes, steel pauldrons and serpent-headed staff.', fr: 'Clerc de l’Église qui combine entraînement militaire et magie sacrée.', en: 'A Church cleric combining military training and sacred magic.' },
    { id: 'daedolon', name: 'Daedolon', role: 'hacker', weapon: 'Arc of Death', weaponType: 'magic', simple: 'Sapphire Wand', secondary: 'Frost Shards', defense: 'Mystic ward', special: 'Bloodscourge assembly', visualAnchor: 'Lean Arcanum mage in deep blue robe, pointed hood, glowing hands and crystal-tipped staff.', fr: 'Mage de l’Arcanum doté de la plus grande portée magique.', en: 'An Arcanum mage with the greatest magical reach.' }
  ],
  monsters: [
    { id: 'ettin', name: 'Ettin', weapon: 'Twin clubs', special: 'Corrupted Legion rush', visualAnchor: 'Two-headed broad green-brown former legionnaire with one crude club in each hand.', fr: 'Ce qui reste de légionnaires transformés par Korax.', en: 'What remains of legionnaires transformed by Korax.' },
    { id: 'centaur', name: 'Centaur', weapon: 'Sword', special: 'Missile-reflecting shield', visualAnchor: 'Armored reptilian centaur-shaped front-line soldier with bronze shield and curved sword.', fr: 'Un soldat de première ligne capable de renvoyer les projectiles.', en: 'A front-line soldier capable of reflecting missiles.' },
    { id: 'dark_bishop', name: 'Dark Bishop', weapon: 'Jade seeking projectiles', special: 'Phase teleport', visualAnchor: 'Floating corrupted church leader in dark green robe, gold mask and circling jade magic.', fr: 'Un dirigeant de l’Église transformé en serviteur magique.', en: 'A Church leader transformed into a magical servant.' }
  ],
  bosses: [
    { id: 'zedek', name: 'Zedek', weapon: 'Corrupted Quietus', special: 'Undead Legion mastery', visualAnchor: 'Former Legion marshal in black-red Unlife armor with broken Quietus-like runeblade.', fr: 'L’ancien maréchal de la Légion devenu pion de Korax.', en: 'The former Legion marshal turned into Korax’s pawn.', canonStatus: 'canon manual corrupted leader' },
    { id: 'traductus', name: 'Traductus', weapon: 'Corrupted Wraithverge', special: 'Unlife church storm', visualAnchor: 'Grand Patriarch in decayed green-gold vestments wielding a spectral holy symbol.', fr: 'L’ancien Grand Patriarche bloque la route de Parias.', en: 'The former Grand Patriarch blocks Parias’s path.', canonStatus: 'canon manual corrupted leader' },
    { id: 'menelkir', name: 'Menelkir', weapon: 'Corrupted Bloodscourge', special: 'Crystal Dais sorcery', visualAnchor: 'Tall undead Arch-Mage in midnight blue robes with red runic staff and crystal-dais aura.', fr: 'L’ancien Archimage manie une magie que le manuel dit presque indestructible.', en: 'The former Arch-Mage wields magic the manual calls almost indestructible.', canonStatus: 'canon manual corrupted leader' }
  ],
  worldBoss: { id: 'korax', name: 'Korax', weapon: 'Chaos Sphere corruption', special: 'Serpent Rider legion summon', visualAnchor: 'Enormous six-armed brown-green Serpent Rider with horned skull face and Chaos Sphere energy in a black stone stronghold.', fr: 'Deuxième des trois Cavaliers Serpents, Korax contrôle et déforme Cronos.', en: 'Second of the three Serpent Riders, Korax controls and warps Cronos.', canonStatus: 'canon final boss' },
  stage: { name: 'Seven Portals — premier Hub de Cronos', visualAnchor: 'Central mossy courtyard with seven sealed stone portals, gears, switches and green-lit runes.', fr: 'Le Hub impose des retours entre sous-niveaux pour ouvrir la route.', en: 'The Hub requires revisiting sublevels to open the route.' },
  stageVariants: [
    stageVariant('RPG', 'Nécropole — trois dirigeants sans vie', 'Expert', 'Menelkir', { objective: 'Defeat Zedek, Traductus and Menelkir with each class’s recovered ultimate weapon.' }),
    stageVariant('RPG', 'Dark Crucible — forteresse de Korax', 'Expert', 'Korax', { objective: 'Solve the final hub locks and break the Chaos Sphere’s summons.' })
  ],
  gear: [
    { id: 'quietus', enName: 'Quietus', frName: 'Quietus', boost: { atk: 8 }, visualAnchor: 'Completed warrior runesword with three visibly joined dark-steel pieces and green-red edge glow.', fr: 'L’arme ultime assemblée de Baratus.', en: 'Baratus’s assembled ultimate weapon.' },
    { id: 'wraithverge', enName: 'Wraithverge', frName: 'Wraithverge', boost: { hp: 50, def: 5 }, visualAnchor: 'Completed cleric holy symbol with skulllike but original silver-green shape and circling spirits.', fr: 'Le symbole sacré ultime de Parias.', en: 'Parias’s ultimate holy symbol.' },
    { id: 'bloodscourge', enName: 'Bloodscourge', frName: 'Bloodscourge', boost: { atk: 6, spd: 2 }, visualAnchor: 'Completed mage staff with dark shaft, split horned head and contained red-green orb.', fr: 'Le bâton ultime de Daedolon.', en: 'Daedolon’s ultimate staff.' }
  ],
  event: { id: 'three_orders_fall', enName: 'The Three Orders Fall', frName: 'Chute des trois Ordres', en: 'The Legion, Church and Arcanum survivors recover their weapon pieces and confront the leaders who surrendered Cronos.', fr: 'Les survivants de la Légion, de l’Église et de l’Arcanum récupèrent leurs armes puis affrontent les dirigeants qui ont livré Cronos.', visualAnchor: 'Three class-colored weapon silhouettes joining above the Seven Portals hub.' }
});

const dukeNukem = definePack(DUKE_NUKEM, {
  aliases: ['Duke Nukem franchise', 'Duke Nukem 3D', 'Duke Nukem Forever'],
  mediaType: 'video-game', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard',
  colors: ['#333b45', '#08090b', '#df3f38'], motif: 'edf',
  theme: 'Duke and EDF allies repelling the Cycloid invasion',
  continuity: 'Duke Nukem 3D: Atomic Edition core threats; Captain Dylan and EDF ally explicitly tagged from Duke Nukem Forever',
  adaptationRule: 'Keep Duke’s red tank, blond flattop, sunglasses and 3D arsenal. Dylan and the EDF trooper are DNF allies, not retroactively inserted into 3D scenes. Remove sexualized environments, captured-woman imagery and actor likenesses while preserving the alien-defense plot.',
  visualAnchor: '1990s Los Angeles action-movie ruins, red EDF accents, chunky alien technology, hazard stripes and oversized Build-engine weapons.',
  canonStatus: 'franchise composite with title-specific tags and project-safe presentation',
  fr: 'Duke repousse les envahisseurs de Los Angeles puis coordonne une percée avec Dylan et les soldats EDF lorsque les Cycloïdes reviennent.',
  en: 'Duke repels the Los Angeles invasion and later coordinates a breakthrough with Dylan and EDF soldiers when the Cycloids return.',
  referenceUrls: [DUKE_NUKEM.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_Xbox_360/Manual/formated/Duke_Nukem_Forever_-_2011_-_2K_Games.pdf', 'https://www.gog.com/en/game/duke_nukem_3d_atomic_edition'],
  characters: [
    { id: 'duke', runtimeId: 'duke_nukem', name: 'Duke Nukem', role: 'marine', weapon: 'Mighty Boot and pistol', weaponType: 'gun', simple: 'Pistol burst', secondary: 'Mighty Boot', defense: 'Jetpack evade', special: 'Devastator salvo', visualAnchor: 'Muscular blond action hero with flattop, opaque sunglasses, red sleeveless combat top, blue trousers, black boots and large sci-fi pistol; original face.', fr: 'Le héros central de la franchise et combattant de terrain.', en: 'The franchise’s central hero and field fighter.' },
    { id: 'captain_dylan', name: 'Captain Dylan', role: 'marine', weapon: 'EDF assault rifle', weaponType: 'gun', simple: 'EDF burst', secondary: 'Dam route cover', defense: 'Squad brace', special: 'Captain’s portal push', visualAnchor: 'Fictional EDF captain in gray-red combat armor with beret, rifle and original face; no voice-actor likeness.', fr: 'Vieil ami de Duke et capitaine EDF rencontré au barrage dans Forever.', en: 'Duke’s old friend and an EDF captain encountered at the dam in Forever.', canonStatus: 'canon Duke Nukem Forever combat ally' },
    { id: 'edf_trooper', name: 'EDF Trooper', role: 'tactical', weapon: 'EDF carbine', weaponType: 'gun', simple: 'Carbine fire', secondary: 'Alien-tech scan', defense: 'Portable EDF cover', special: 'Squad extraction', visualAnchor: 'Anonymous Earth Defense Force soldier in full gray armor, red shoulder lights, opaque visor and compact carbine.', fr: 'Un soldat EDF représentatif des alliés armés de Forever.', en: 'An EDF soldier representing the armed allies in Forever.', canonStatus: 'canon allied faction archetype' }
  ],
  monsters: [
    { id: 'assault_trooper', name: 'Assault Trooper', weapon: 'Laser pistol', special: 'Jetpack flank', visualAnchor: 'Brown-green Cycloid infantry alien in dark harness with red visor and compact laser pistol.', fr: 'Le fantassin cycloïde de base.', en: 'The basic Cycloid infantryman.' },
    { id: 'pig_cop', name: 'Pig Cop', weapon: 'Shotgun', special: 'Police-car ambush', visualAnchor: 'Large alien-mutated boar officer in blue tactical uniform with abstract badge, shotgun and no real police insignia.', fr: 'Un officier transformé par les extraterrestres.', en: 'An officer transformed by the aliens.' },
    { id: 'octabrain', name: 'Octabrain', weapon: 'Psychic blast', special: 'Tentacle flight', visualAnchor: 'Floating orange-brown brainlike alien with one eye and trailing tentacles, stylized and non-gory.', fr: 'Une créature volante qui attaque par impulsion psychique.', en: 'A floating creature attacking with psychic pulses.' }
  ],
  bosses: [
    { id: 'battlelord', name: 'Battlelord', weapon: 'Chaingun and grenade launcher', special: 'Abyss canyon barrage', visualAnchor: 'Giant tan alien warlord in spiked black armor with integrated chaingun-grenade weapon.', fr: 'Le commandant géant qui clôt L.A. Meltdown.', en: 'The giant commander ending L.A. Meltdown.' },
    { id: 'overlord', name: 'Overlord', weapon: 'Rocket launcher', special: 'Lunar reactor assault', visualAnchor: 'Huge pale-green one-eyed alien with metal lower body and shoulder rocket system inside a moon reactor.', fr: 'Le chef de l’assaut lunaire.', en: 'The leader of the lunar assault.' },
    { id: 'cycloid_emperor', name: 'Cycloid Emperor', weapon: 'Cycloid rockets', special: 'Hollywood stadium barrage', visualAnchor: 'Towering one-eyed horned emperor with brown hide, black mechanical legs and twin arm launchers in a ruined stadium.', fr: 'L’empereur cycloïde conduit l’invasion de Duke Nukem 3D.', en: 'The Cycloid Emperor leads the Duke Nukem 3D invasion.' }
  ],
  worldBoss: { id: 'alien_queen', name: 'Alien Queen', weapon: 'Acid spit', special: 'The Birth hive summon', visualAnchor: 'Colossal brown-green alien queen with elongated armored body and egglike hive chamber, no captive people or sexual imagery.', fr: 'La Reine extraterrestre est la finale de l’épisode The Birth.', en: 'The Alien Queen is the finale of The Birth episode.', canonStatus: 'canon Atomic Edition final boss' },
  stage: { name: 'Hollywood Holocaust — Los Angeles occupée', visualAnchor: 'Ruined cinema rooftops, red night sky, EDF barricades, burning alien craft and no adult signage.', fr: 'Duke revient à Los Angeles au début de l’invasion.', en: 'Duke returns to Los Angeles at the invasion’s start.' },
  stageVariants: [
    stageVariant('Smash', 'Stadium — Cycloid Emperor', 'Very Hard', 'Cycloid Emperor', { objective: 'Break the rocket cadence and clear the stadium invasion node.' }),
    stageVariant('RPG', 'The Birth — ruche de la Reine', 'Expert', 'Alien Queen', { objective: 'Destroy hive relays and stop the Queen without depicting captives.' })
  ],
  gear: [
    { id: 'devastator', enName: 'Devastator', frName: 'Devastator', boost: { atk: 8 }, visualAnchor: 'Pair of compact black-red wrist rocket launchers with multiple small barrels.', fr: 'L’arme à salves de roquettes de Duke 3D.', en: 'Duke 3D’s rapid rocket-salvo weapon.' },
    { id: 'jetpack', enName: 'Jetpack', frName: 'Jetpack', boost: { spd: 3, def: 3 }, visualAnchor: 'Chunky gray twin-thruster jetpack with red controls and folded harness.', fr: 'Le jetpack ouvre les routes verticales.', en: 'The jetpack opens vertical routes.' },
    { id: 'shrink_ray', enName: 'Shrink Ray', frName: 'Rayon réducteur', boost: { atk: 5, spd: 2 }, visualAnchor: 'Bulky silver-blue ray gun with green coil and flared emitter, no logo.', fr: 'Une arme extraterrestre retournée contre les envahisseurs.', en: 'Alien technology turned against the invaders.' }
  ],
  event: { id: 'edf_breakthrough', enName: 'EDF Dam Breakthrough', frName: 'Percée EDF au barrage', en: 'Dylan’s squad opens a brief route while Duke carries the push toward the portal controls.', fr: 'L’escouade de Dylan ouvre brièvement la route pendant que Duke progresse vers les commandes du portail.', visualAnchor: 'Gray-red EDF formation creating a corridor through alien fire at a concrete dam.', canonStatus: 'canon-inspired DNF squad event' }
});

const marathon = definePack(MARATHON, {
  aliases: ['Classic Marathon', 'Marathon trilogy', 'Marathon (1994)'],
  mediaType: 'video-game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#24463d', '#030706', '#65e69b'], motif: 'terminal',
  theme: 'the Security Officer surviving Pfhor invasion, AI manipulation and collapsing timelines',
  continuity: 'Bungie’s classic Marathon trilogy (Marathon, Marathon 2: Durandal, Marathon Infinity), not the 2026 extraction game',
  adaptationRule: 'Use classic green terminal language, UESC Marathon, Pfhor, S’pht and trilogy weapons. The trilogy has few conventional bosses: named command systems and the W’rkncacnter are represented as objective/containment Trials with no fake body or HP. Do not import 2026 Runners or factions.',
  visualAnchor: 'Green-black terminals, angular UESC colony-ship corridors, purple Pfhor technology, motion-sensor arcs and vacuum windows.',
  canonStatus: 'classic trilogy canon with systemic finales encoded as Trials',
  fr: 'L’Officier de sécurité défend le Marathon, libère les S’pht avec Blake et traverse les réalités d’Infinity pour empêcher l’éveil du W’rkncacnter.',
  en: 'The Security Officer defends the Marathon, helps Blake free the S’pht and crosses Infinity’s realities to prevent the W’rkncacnter’s release.',
  referenceUrls: [MARATHON.url, 'https://marathon.bungie.org/story/manuals/Marathon_2_Manual.pdf', 'https://marathon.bungie.org/story/manuals/Marathon_Infinity_Manual.pdf', 'https://store.steampowered.com/app/2398450/Classic_Marathon/'],
  characters: [
    { id: 'security_officer', name: 'UESC Marathon Security Officer', role: 'marine', weapon: 'MA-75B assault rifle', weaponType: 'gun', simple: 'MA-75B burst', secondary: 'SPNKR rocket', defense: 'Motion-sensor dodge', special: 'Mjolnir reflex overdrive', visualAnchor: 'Anonymous armored cyborg security officer in green-black UESC combat suit, gold opaque visor and compact assault rifle; no modern Marathon Runner gear.', fr: 'Le protagoniste cyborg sans nom qui traverse les trois jeux classiques.', en: 'The unnamed cyborg protagonist who crosses all three classic games.', canonStatus: 'canon classic-trilogy protagonist' },
    { id: 'robert_blake', name: 'Robert Blake', role: 'tactical', weapon: 'UESC rifle', weaponType: 'gun', simple: 'Human survivor fire', secondary: 'Prisoner rally', defense: 'Lh’owon cover', special: 'Survivor extraction order', visualAnchor: 'Human resistance leader in worn green UESC uniform with rifle, communicator and original face.', fr: 'Blake commande les survivants humains et s’oppose à la domination de Durandal.', en: 'Blake leads the human survivors and resists Durandal’s control.', canonStatus: 'canon Marathon 2 human ally' },
    { id: 'sphtkr_defender', name: 'S’pht’Kr Defender', role: 'hacker', weapon: 'S’pht energy staff', weaponType: 'magic', simple: 'Energy arc', secondary: 'Compiler disruption', defense: 'S’pht phase ward', special: 'Eleventh Clan liberation surge', visualAnchor: 'Tall cybernetic S’pht ally in angular blue-green exoskeleton with floating energy nodes and staff.', fr: 'Un combattant du onzième clan S’pht revenu libérer Lh’owon.', en: 'A warrior of the eleventh S’pht clan returned to liberate Lh’owon.', canonStatus: 'canon allied faction representative' }
  ],
  monsters: [
    { id: 'pfhor_fighter', name: 'Pfhor Fighter', weapon: 'Shock staff', special: 'Slave-raider rush', visualAnchor: 'Tall narrow purple-armored Pfhor infantry alien with breathing mask and shock staff.', fr: 'Le fantassin standard de l’empire esclavagiste Pfhor.', en: 'The standard infantry of the slave-raiding Pfhor empire.' },
    { id: 'pfhor_hunter', name: 'Pfhor Hunter', weapon: 'Shoulder energy weapon', special: 'Heavy armor advance', visualAnchor: 'Broad Pfhor heavy soldier in dark purple plated armor with shoulder cannon and masked face.', fr: 'Un soldat lourd Pfhor protégé par une armure renforcée.', en: 'A Pfhor heavy soldier protected by reinforced armor.' },
    { id: 'compiler', name: 'S’pht Compiler — Enslaved', weapon: 'Energy bolt', special: 'Pfhor network phase', visualAnchor: 'Floating cybernetic S’pht Compiler in blue-purple shell with central eye light and shackling control nodes.', fr: 'Un S’pht réduit en esclavage et forcé de servir de compilateur aux Pfhor.', en: 'An enslaved S’pht forced to serve the Pfhor as a Compiler.', canonStatus: 'canon enslaved enemy; liberation context required', adaptationRule: 'Frame defeat as breaking Pfhor control whenever the mission permits.' }
  ],
  bosses: [
    { id: 'juggernaut', name: 'Pfhor Juggernaut', weapon: 'Twin cannons', special: 'Armored hover barrage', visualAnchor: 'Huge hovering Pfhor war machine with purple-black armor, two cannons and red sensor vents.', fr: 'La plus imposante machine de guerre régulière Pfhor.', en: 'The most imposing regular Pfhor war machine.', canonStatus: 'canon elite threat used as encounter boss' },
    { id: 'tfear_countdown', name: 'Admiral Tfear — Trih Xeem Countdown', nonCombat: true, objective: 'Decode Tfear’s command transmission and prevent the trih xeem from forcing Lh’owon’s star into nova.', objectiveFr: 'Décoder la transmission de commandement de Tfear et empêcher le trih xeem de forcer l’étoile de Lh’owon en nova.', victoryCondition: 'nova-device-interrupted', visualAnchor: 'Pfhor high-command transmission terminal linked to a star-scale nova device across four countdown states, no admiral body invented.', fr: 'Le commandement de Tfear est affronté par ses ordres et son dispositif, pas par un duel absent du jeu.', en: 'Tfear’s command is confronted through his orders and device, not a duel absent from the game.', canonStatus: 'canon command objective represented as Trial' },
    { id: 'tycho_core', name: 'Tycho Network Core', nonCombat: true, objective: 'Reroute hostile Tycho instructions, free survivor access and isolate the corrupted core.', objectiveFr: 'Dériver les instructions hostiles de Tycho, libérer l’accès des survivants et isoler le noyau corrompu.', victoryCondition: 'tycho-isolated', visualAnchor: 'Red-purple Marathon AI terminal network progressing from hostile lock to isolated core, no humanoid AI avatar.', fr: 'Tycho est une intelligence de terminaux et reste une épreuve de réseau.', en: 'Tycho is a terminal intelligence and remains a network Trial.', canonStatus: 'canon antagonistic AI system' }
  ],
  worldBoss: { id: 'wrkncacnter', name: 'W’rkncacnter Containment', nonCombat: true, objective: 'Navigate the stable timeline, prevent its release and escape before the star-collapse branch consumes Lh’owon.', objectiveFr: 'Parcourir la chronologie stable, empêcher sa libération et fuir avant que la branche d’effondrement stellaire ne consume Lh’owon.', victoryCondition: 'entity-contained-stable-timeline-reached', visualAnchor: 'Cosmic presence suggested only by impossible red-black geometry behind a collapsing star and green timeline terminals, no invented creature body.', fr: 'Infinity traite le W’rkncacnter comme une puissance cosmique à contenir à travers les réalités.', en: 'Infinity treats the W’rkncacnter as a cosmic power to contain across realities.', canonStatus: 'canon cosmic containment finale Trial', prohibitedConcepts: ['humanoid W’rkncacnter boss', 'health-bar duel'] },
  stage: { name: 'UESC Marathon — ponts envahis', visualAnchor: 'Green-gray colony-ship corridors, vacuum windows, purple Pfhor breaches and green terminal alcoves.', fr: 'L’invasion coupe les ponts du vaisseau et laisse l’Officier dépendre des terminaux de Leela et Durandal.', en: 'The invasion cuts through the ship and leaves the Officer dependent on Leela’s and Durandal’s terminals.' },
  stageVariants: [
    stageVariant('Tactics', 'Lh’owon — libération du onzième clan', 'Expert', 'Pfhor Juggernaut', { objective: 'Open the S’pht routes and hold the returning S’pht’Kr landing zone.' }),
    stageVariant('Trial', 'Infinity — chronologie stable', 'Expert', 'W’rkncacnter Containment', { nonCombat: true, trialType: 'Trial', objective: 'Compare terminal branches, interrupt the nova path and reach containment.' })
  ],
  gear: [
    { id: 'ma75b', enName: 'MA-75B Assault Rifle', frName: 'Fusil d’assaut MA-75B', boost: { atk: 6, spd: 1 }, visualAnchor: 'Green-gray bullpup rifle with top magazine and compact under-barrel grenade tube.', fr: 'L’arme automatique UESC emblématique.', en: 'The emblematic UESC automatic weapon.' },
    { id: 'spnkr', enName: 'SPNKR-X17 Launcher', frName: 'Lanceur SPNKR-X17', boost: { atk: 8 }, visualAnchor: 'Long green-black twin-tube rocket launcher with blocky sight and no readable label.', fr: 'Le lance-roquettes lourd de la trilogie.', en: 'The trilogy’s heavy rocket launcher.' },
    { id: 'motion_sensor', enName: 'Motion Sensor', frName: 'Détecteur de mouvement', boost: { def: 5, spd: 2 }, visualAnchor: 'Circular green radar device with simple arcs and red contact dots, no copied UI text.', fr: 'Le radar circulaire qui révèle les contacts proches.', en: 'The circular radar revealing nearby contacts.' }
  ],
  event: { id: 'terminal_split', enName: 'Leela–Durandal Terminal Split', frName: 'Divergence des terminaux Leela–Durandal', en: 'Green terminal routes offer conflicting AI orders, forcing the squad to compare mission outcomes before committing.', fr: 'Les routes de terminaux verts proposent des ordres d’IA contradictoires et obligent l’équipe à comparer les conséquences avant de s’engager.', visualAnchor: 'Two green-black terminal columns branching toward defense and abduction routes, with Tycho’s red signal intruding.', canonStatus: 'canon-inspired systemic Trial', nonCombat: true }
});

export const CANON_ROSTER_WAVE_PART_F = Object.freeze([
  soldierOfFortune,
  extremeGhostbusters,
  heartOfDarkness,
  rivalSchools,
  medievil,
  jerseyDevil,
  goemonsGreatAdventure,
  mdk,
  tailConcerto,
  redneckRampage,
  hexen,
  dukeNukem,
  marathon
]);
