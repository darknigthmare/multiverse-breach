const MEDIA_LINES = {
  game: {
    fr: 'A.R.C.A. traite cette Trame comme une architecture de regles: routes, ressources et routines de combat peuvent etre ancrees sans nier leur origine.',
    en: 'A.R.C.A. treats this Thread as a rules architecture: routes, resources, and combat routines can be anchored without denying their origin.'
  },
  movie: {
    fr: 'La breche conserve un montage cinematographique: les symboles arrivent comme des plans courts, violents et impossibles a ignorer.',
    en: 'The breach keeps a cinematic cut: symbols arrive as short, violent shots that cannot be ignored.'
  },
  series: {
    fr: 'La Trame fonctionne par episodes: le Nexus isole les lieux recurrents, les loyautes mouvantes et les menaces qui savent revenir.',
    en: 'The Thread works in episodes: the Nexus isolates recurring places, shifting loyalties, and threats that know how to return.'
  },
  manga: {
    fr: 'La compression garde une logique d arc: rivalites, transformations et serments montent en intensite a chaque faille.',
    en: 'Compression keeps an arc logic: rivalries, transformations, and vows escalate with every breach.'
  },
  music: {
    fr: 'Le Nexus ne capture pas une personne civile: il stabilise une Persona de Resonance nee d une empreinte culturelle, visuelle et sonore.',
    en: 'The Nexus does not capture a civilian person: it stabilizes a Resonance Persona born from a cultural, visual, and sonic imprint.'
  }
};

const MODE_LINES = {
  RPG: {
    fr: 'Protocole Resonance: l escouade avance comme dans une confrontation de boss, avec endurance, soins et pics de signature.',
    en: 'Resonance Protocol: the cell advances like a boss confrontation, with endurance, healing, and signature spikes.'
  },
  Tactics: {
    fr: 'Grille d Ancrage: le terrain devient une carte de positions, de tempo et de cases ressources a sceller.',
    en: 'Anchor Grid: the field becomes a map of positions, tempo, and resource tiles to seal.'
  },
  Smash: {
    fr: 'Arene d Impact: la faille explose en lecture rapide, portee par artefacts, projections et ultimes de terrain.',
    en: 'Impact Arena: the breach bursts into a fast read driven by artifacts, knockback, and stage ultimates.'
  }
};

const DIFFICULTY_LINES = {
  Easy: { fr: 'Point d entree stable pour ouvrir l archive sans trop de corruption.', en: 'Stable entry point for opening the archive without heavy corruption.' },
  Medium: { fr: 'Signal plus dense: le boss commence a contester les lois du Nexus.', en: 'Denser signal: the boss starts contesting Nexus laws.' },
  Hard: { fr: 'Compression dangereuse: les recompenses montent parce que la Trame resiste activement.', en: 'Dangerous compression: rewards rise because the Thread actively resists.' },
  'Very Hard': { fr: 'Zone critique: une erreur de lecture peut donner l avantage au Sans-Auteur.', en: 'Critical zone: one bad read can give the Authorless the advantage.' },
  Expert: { fr: 'Faille experte: A.R.C.A. exige une escouade construite et des reliques synchronisees.', en: 'Expert breach: A.R.C.A. expects a built squad and synchronized relics.' },
  'Final World Boss': { fr: 'Noyau final: toutes les archives precedentes servent de contre-poids narratif.', en: 'Final core: every prior archive acts as narrative counterweight.' }
};

const statWords = {
  hp: { fr: 'survie', en: 'survival' },
  atk: { fr: 'pression offensive', en: 'offensive pressure' },
  def: { fr: 'ancrage defensif', en: 'defensive anchoring' },
  spd: { fr: 'tempo', en: 'tempo' }
};

const CORE_UNIVERSE_SIGNATURES = {
  'Nexus de Convergence': {
    faction: 'unknown',
    theme: 'Atrium A.R.C.A., signatures d Ancre, Eclats d Origine et memoire stable entre plusieurs Trames',
    stageName: 'Atrium Nexus',
    bossName: 'Ombre du Sans-Auteur'
  },
  'Gears of War': {
    faction: 'sciFi',
    theme: 'guerre de tranchées industrielle, couverture lourde, Horde Locuste et fraternite COG sous pression',
    stageName: 'Front Sera',
    bossName: 'General Locuste'
  },
  Halo: {
    faction: 'sciFi',
    theme: 'anneaux Forerunner, doctrine UNSC, Covenant, boucliers Spartan et guerre cosmique ancienne',
    stageName: 'Anneau Forerunner',
    bossName: 'Scarab Covenant'
  },
  Alien: {
    faction: 'sciFi',
    theme: 'couloirs Weyland-Yutani, horreur spatiale, acide, ruche et survie contre le specimen parfait',
    stageName: 'Derelict Hive',
    bossName: 'Reine Xenomorphe'
  },
  Predator: {
    faction: 'sciFi',
    theme: 'chasse Yautja, honneur rituel, camouflage, plasma et trophees preleves sur les proies dignes',
    stageName: 'Terrain de chasse Yautja',
    bossName: 'Champion Yautja'
  },
  'Resident Evil': {
    faction: 'horror',
    theme: 'confinement Umbrella, virus, commissariat, tyrans, ressources rares et survie biohazard',
    stageName: 'Zone Biohazard',
    bossName: 'Tyran Umbrella'
  },
  'Silent Hill': {
    faction: 'horror',
    theme: 'brouillard, culpabilite, rouille, symboles personnels et cauchemars qui jugent les survivants',
    stageName: 'Rue de brouillard',
    bossName: 'Juge de rouille'
  },
  'Dino Crisis': {
    faction: 'horror',
    theme: 'Troisieme Energie, couloirs de laboratoire, predateurs prehistoriques et alarmes de confinement',
    stageName: 'Complexe Third Energy',
    bossName: 'Raptor Alpha'
  },
  'The Matrix': {
    faction: 'cyber',
    theme: 'simulation verte, agents, choix impossible, bullet time et code qui ment pour maintenir une prison',
    stageName: 'Matrice racine',
    bossName: 'Agent Racine'
  },
  Stargate: {
    faction: 'sciFi',
    theme: 'reseau de Portes, SGC, chevrons, Goa uld, Anciens et exploration militaire sous iris',
    stageName: 'Salle de Porte',
    bossName: 'Seigneur Goa uld'
  },
  'Half-Life': {
    faction: 'cyber',
    theme: 'cascade de resonance, Black Mesa, Xen, HEV, silence scientifique et invasion dimensionnelle',
    stageName: 'Black Mesa rupture',
    bossName: 'Strider de Resonance'
  },
  Portal: {
    faction: 'cyber',
    theme: 'salles de test Aperture, portails, cubes, tourelles, sarcasme de laboratoire et logique mortelle',
    stageName: 'Chambre de test',
    bossName: 'Noyau Aperture'
  },
  'Metal Gear': {
    faction: 'tactical',
    theme: 'infiltration, armes autonomes, conspirations militaires, codec et duels de soldats legende',
    stageName: 'Operation furtive',
    bossName: 'Metal Gear fantome'
  },
  Payday: {
    faction: 'tactical',
    theme: 'braquage, masques, otages, foreuse thermique, plans qui derapent et pression policiere',
    stageName: 'Casse sous alarme',
    bossName: 'Assaut final'
  },
  Vocaloid: {
    faction: 'stage',
    theme: 'idole virtuelle, scene holographique, choeurs synthetiques et memoire collective numerique',
    stageName: 'Scene holographique',
    bossName: 'Choeur fantome'
  },
  'Yu-Gi-Oh': {
    faction: 'tactical',
    theme: 'duels, cartes, invocations, phases, pieges et destin scelle par une main bien jouee',
    stageName: 'Arene de duel',
    bossName: 'Duelliste Sans-Auteur'
  },
  'Guilty Gear': {
    faction: 'tactical',
    theme: 'tension de duel, gears, rock metal, attaques explosives et rivalites a haute vitesse',
    stageName: 'Scene Gear',
    bossName: 'Gear de Tension'
  },
  BlazBlue: {
    faction: 'tactical',
    theme: 'Azure, grimoires, boucles temporelles, drives arcaniques et villes de combat animees',
    stageName: 'Cite Azure',
    bossName: 'Noyau Azure'
  },
  'Slender Man': {
    faction: 'horror',
    theme: 'pages perdues, foret statique, silhouette impossible et peur qui efface les reperes',
    stageName: 'Bois statique',
    bossName: 'Silhouette blanche'
  },
  Chucky: {
    faction: 'horror',
    theme: 'poupee tueuse, humour noir, possession, jouets pieges et violence domestique miniature',
    stageName: 'Atelier de jouets',
    bossName: 'Poupee possedee'
  },
  Hellraiser: {
    faction: 'horror',
    theme: 'configuration du Lament, chaines, Cenobites, douleur rituelle et pactes infernaux',
    stageName: 'Labyrinthe Cenobite',
    bossName: 'Oracle des Chaines'
  },
  'Mass Effect': {
    faction: 'sciFi',
    theme: 'Spectres, relais cosmodésiques, equipage inter-especes, biotique et guerre de civilisation',
    stageName: 'Relais galactique',
    bossName: 'Moissonneur fantome'
  },
  Fallout: {
    faction: 'apocalypse',
    theme: 'wasteland retrofuturiste, abris, radiations, factions de survie et ironie nucleaire',
    stageName: 'Abri fissure',
    bossName: 'Seigneur Mutant'
  },
  Doom: {
    faction: 'horror',
    theme: 'portails infernaux, Mars, demons, metal violent et rage de purification absolue',
    stageName: 'Base UAC infernale',
    bossName: 'Cyberdemon Nexus'
  },
  Unreal: {
    faction: 'tactical',
    theme: 'tournois de sang galactiques, arènes rapides, armes lisibles et spectacle de combat',
    stageName: 'Tournoi Liandri',
    bossName: 'Champion Unreal'
  },
  'Harry Potter': {
    faction: 'arcane',
    theme: 'sorcellerie secrete, baguettes, maisons, sortileges, reliques et guerre contre l ombre',
    stageName: 'Chateau sorcier',
    bossName: 'Mage noir'
  },
  'Star Wars': {
    faction: 'sciFi',
    theme: 'Force, Jedi, Sith, sabres, bataille spatiale et destin d une galaxie ancienne',
    stageName: 'Temple stellaire',
    bossName: 'Seigneur Sith'
  },
  'Scary Movie': {
    faction: 'horror',
    theme: 'parodie horrifique, gags de slasher, logique absurde et peur detournee par le chaos comique',
    stageName: 'Plateau de parodie',
    bossName: 'Tueur rate'
  },
  'Dead Space': {
    faction: 'horror',
    theme: 'Ishimura, Monolithe, demembrement strategique, vide industriel et folie necromorphe',
    stageName: 'Coursive Ishimura',
    bossName: 'Monolithe vivant'
  },
  'Rick & Morty': {
    faction: 'cyber',
    theme: 'portails improvises, science cynique, realites jetables et consequences multiverselles absurdes',
    stageName: 'Garage dimensionnel',
    bossName: 'Conseil instable'
  },
  'Digital Circus': {
    faction: 'cyber',
    theme: 'cirque numerique, avatars pieges, couleurs trompeuses et anxiete codee en spectacle',
    stageName: 'Piste abstraite',
    bossName: 'Maitre de piste glitch'
  },
  Digimon: {
    faction: 'cyber',
    theme: 'monde digital, partenaires monstres, evolutions, symboles et conflit entre donnees vivantes',
    stageName: 'Portail digital',
    bossName: 'Mega rupture'
  },
  Saw: {
    faction: 'horror',
    theme: 'pieges moraux, chronometres, choix impossibles et survie mesuree par sacrifice',
    stageName: 'Atelier du Jugement',
    bossName: 'Marionnette du Verdict'
  },
  'Ghost in the Shell': {
    faction: 'cyber',
    theme: 'cybercerveaux, Section 9, identite numerique, corps augmentes et fantomes dans le reseau',
    stageName: 'Reseau Section 9',
    bossName: 'Puppet Core'
  },
  'Mad Max': {
    faction: 'apocalypse',
    theme: 'desert post-apocalyptique, moteurs, convois, eau rare et survie par vitesse brute',
    stageName: 'Route furieuse',
    bossName: 'Seigneur du convoi'
  }
};

export const getUniverseSignature = (universe, lore) => ({
  universe,
  faction: lore?.faction || CORE_UNIVERSE_SIGNATURES[universe]?.faction || 'unknown',
  theme: lore?.theme || CORE_UNIVERSE_SIGNATURES[universe]?.theme || lore?.desc?.fr || universe,
  stageName: lore?.stageName || CORE_UNIVERSE_SIGNATURES[universe]?.stageName || universe,
  bossName: lore?.bossName || CORE_UNIVERSE_SIGNATURES[universe]?.bossName || universe,
  worldBoss: lore?.worldBoss || CORE_UNIVERSE_SIGNATURES[universe]?.worldBoss || lore?.bossName || CORE_UNIVERSE_SIGNATURES[universe]?.bossName || universe
});

const universeLexicon = (signature, lang = 'fr') => {
  const theme = signature.theme || signature.universe;
  return lang === 'fr'
    ? `Signature source: ${theme}.`
    : `Source signature: ${theme}.`;
};

const FACTION_LINES = {
  sciFi: {
    fr: 'Famille Alliance du Nexus: cette Trame sert a tenir des fronts, evacuer des civils et transformer la technologie en rempart narratif.',
    en: 'Nexus Alliance family: this Thread holds fronts, evacuates civilians, and turns technology into narrative armor.'
  },
  horror: {
    fr: 'Famille Effaces: la peur y retire les noms avant les corps; A.R.C.A. exige temoins, lampes, protocoles et memoire froide.',
    en: 'Erased family: fear removes names before bodies; A.R.C.A. demands witnesses, lamps, protocols, and cold memory.'
  },
  arcane: {
    fr: 'Famille Archivistes: magie, mythes et pactes y deviennent des methodes de stabilisation si leurs regles sont respectees.',
    en: 'Archivist family: magic, myths, and pacts become stabilization methods when their rules are respected.'
  },
  cyber: {
    fr: 'Famille Zone 404: le code, l identite et la permission y sont des champs de bataille plus dangereux que la matiere.',
    en: 'Zone 404 family: code, identity, and permission are battlefields more dangerous than matter.'
  },
  tactical: {
    fr: 'Famille Libres-Fractures: contrats, duels, operations et coups precis transforment le chaos en avantage lisible.',
    en: 'Free-Fractures family: contracts, duels, operations, and precise strikes turn chaos into readable advantage.'
  },
  apocalypse: {
    fr: 'Famille Trone Brise: les mondes deja ruines savent survivre, mais risquent toujours de confondre victoire et domination.',
    en: 'Broken Throne family: already-ruined worlds know survival, but may confuse victory with domination.'
  },
  stage: {
    fr: 'Famille Scene Fantome: musique, humour, spectacle et personas transforment la memoire collective en signal de combat.',
    en: 'Ghost Stage family: music, comedy, spectacle, and personas turn collective memory into combat signal.'
  },
  unknown: {
    fr: 'Famille non classee: A.R.C.A. maintient l archive ouverte jusqu a ce que la Trame revele sa vraie loi.',
    en: 'Unclassified family: A.R.C.A. keeps the archive open until the Thread reveals its true law.'
  }
};

const listStats = (boost = {}, lang = 'fr') => {
  const entries = Object.entries(boost);
  if (!entries.length) return lang === 'fr' ? 'signature stable' : 'stable signature';
  return entries.map(([key, value]) => `+${value} ${statWords[key]?.[lang] || key.toUpperCase()}`).join(' / ');
};

export const getUniverseLoreDescription = ({
  universe,
  lang = 'fr',
  lore,
  faction,
  cleared = false,
  heroCount = 0,
  enemyCount = 0,
  relicCount = 0,
  stageCount = 0,
  arcCount = 0
}) => {
  const signature = getUniverseSignature(universe, lore);
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const factionLine = FACTION_LINES[faction || signature.faction] || FACTION_LINES.unknown;
  const base = lore?.desc?.[lang] || (lang === 'fr'
    ? 'Archive partielle: la Trame emet encore trop de bruit pour une lecture definitive.'
    : 'Partial archive: the Thread still emits too much noise for a definitive reading.');
  const status = cleared
    ? (lang === 'fr'
      ? 'Statut: coordonnees stabilisees, mais la Trame reste vivante et peut encore generer des echos.'
      : 'Status: coordinates stabilized, but the Thread remains alive and can still generate echoes.')
    : (lang === 'fr'
      ? 'Statut: coordonnees instables; chaque mission sert a distinguer son origine de la corruption du Sans-Auteur.'
      : 'Status: coordinates unstable; each mission separates its origin from Authorless corruption.');
  const inventory = lang === 'fr'
    ? `Index A.R.C.A.: ${heroCount} signature(s), ${enemyCount} menace(s), ${relicCount} relique(s), ${stageCount} faille(s), ${arcCount} arc(s) lies.`
    : `A.R.C.A. index: ${heroCount} signature(s), ${enemyCount} threat(s), ${relicCount} relic(s), ${stageCount} breach(es), ${arcCount} linked arc(s).`;

  return `${base} ${universeLexicon(signature, lang)} ${media[lang]} ${factionLine[lang]} ${status} ${inventory}`.trim();
};

export const getStageLoreDescription = ({
  stage,
  lang = 'fr',
  lore,
  modifier,
  sourceClears = 0,
  sourceTotal = 0,
  bossIntel
}) => {
  if (!stage) return '';

  if (stage.characterArc) {
    return lang === 'fr'
      ? `${stage.displayName.fr} est une mission personnelle: ${stage.characterArc.intro.fr} Le Nexus force ${bossIntel?.name || stage.bossName} a reveler la contradiction qui menace cette signature. Trace promise: ${stage.rewardItemName.fr}, une marque identitaire gravee dans l archive vivante du heros.`
      : `${stage.displayName.en} is a personal mission: ${stage.characterArc.intro.en} The Nexus forces ${bossIntel?.name || stage.bossName} to reveal the contradiction threatening this signature. Promised trace: ${stage.rewardItemName.en}, an identity mark engraved into the hero living archive.`;
  }

  if (stage.fusionMission) {
    const sources = stage.sourceUniverses?.join(' / ') || stage.universe;
    return lang === 'fr'
      ? `${stage.displayName.fr} fusionne ${sources}. ${stage.fusionMission.decor.fr} Les sources stabilisees (${sourceClears}/${sourceTotal}) determinent la securite d ouverture; ${stage.bossName} agit comme verrou hybride. Trace promise: ${stage.rewardItemName.fr}, une preuve que plusieurs lois d origine peuvent coexister sans devenir bruit blanc.`
      : `${stage.displayName.en} fuses ${sources}. ${stage.fusionMission.decor.en} Stabilized sources (${sourceClears}/${sourceTotal}) determine opening safety; ${stage.bossName} acts as the hybrid lock. Promised trace: ${stage.rewardItemName.en}, proof that several origin laws can coexist without becoming white noise.`;
  }

  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const signature = getUniverseSignature(stage.universe, lore);
  const mode = MODE_LINES[stage.mode] || MODE_LINES.RPG;
  const difficulty = DIFFICULTY_LINES[stage.difficulty] || DIFFICULTY_LINES.Medium;
  const loreDesc = lore?.desc?.[lang] || '';
  const modifierLine = modifier?.name?.[lang]
    ? (lang === 'fr'
      ? `Anomalie active: ${modifier.name[lang]} - ${modifier.desc?.[lang] || 'effet inconnu mais mesurable par A.R.C.A.'}`
      : `Active anomaly: ${modifier.name[lang]} - ${modifier.desc?.[lang] || 'unknown but measurable A.R.C.A. effect.'}`)
    : '';
  return lang === 'fr'
    ? `${stage.name} est le point de rupture de ${stage.universe}: ${loreDesc} ${universeLexicon(signature, 'fr')} Le decor cle est ${signature.stageName}; ${bossIntel?.name || stage.bossName || signature.bossName} incarne la distorsion locale de ${signature.worldBoss || signature.bossName}. ${media.fr} ${mode.fr} Objectif lore: neutraliser le noyau hostile, recuperer ${stage.goldPrize} or / ${stage.shardPrize} fragments et verrouiller les coordonnees avant que le Sans-Auteur transforme cette Trame en bruit blanc. ${difficulty.fr} ${modifierLine}`.trim()
    : `${stage.name} is the rupture point for ${stage.universe}: ${loreDesc} ${universeLexicon(signature, 'en')} The key setpiece is ${signature.stageName}; ${bossIntel?.name || stage.bossName || signature.bossName} embodies the local distortion of ${signature.worldBoss || signature.bossName}. ${media.en} ${mode.en} Lore objective: neutralize the hostile core, recover ${stage.goldPrize} gold / ${stage.shardPrize} shards, and lock coordinates before the Authorless turns this Thread into white noise. ${difficulty.en} ${modifierLine}`.trim();
};

export const getGearLoreDescription = ({ item, lang = 'fr', lore }) => {
  if (!item) return '';
  const signature = getUniverseSignature(item.universe, lore);
  const stats = listStats(item.boost, lang);
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const upgradeLine = item.isUpgraded
    ? (lang === 'fr'
      ? ' Version +: la relique a absorbe un echo deja scelle; son signal frappe plus fort, mais A.R.C.A. surveille sa derive.'
      : ' Plus version: the relic absorbed an already-sealed echo; its signal strikes harder, but A.R.C.A. watches its drift.')
    : '';
  return lang === 'fr'
    ? `${item.name.fr} vient de ${item.universe}. ${universeLexicon(signature, 'fr')} A.R.C.A. l utilise comme ancre materielle: elle rappelle au porteur les lois de ${signature.stageName} quand une zone tente de les effacer. Resonance mesuree: ${stats}. ${media.fr}${upgradeLine}`
    : `${item.name.en} comes from ${item.universe}. ${universeLexicon(signature, 'en')} A.R.C.A. uses it as a material anchor: it reminds the carrier of ${signature.stageName} laws when a zone tries to erase them. Measured resonance: ${stats}. ${media.en}${upgradeLine}`;
};

export const getEventLoreDescription = ({ item, lang = 'fr', universe, lore }) => {
  if (!item) return '';
  const source = item.universe || universe;
  const signature = getUniverseSignature(source, lore);
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const base = item.desc?.[lang] || '';
  return lang === 'fr'
    ? `${item.name.fr} est un declencheur evenementiel de ${source}. ${base} ${universeLexicon(signature, 'fr')} A.R.C.A. ne l equipe pas comme une arme permanente: il ouvre une fenetre courte ou les lois de la Trame source reprennent le dessus sur la breche, souvent autour de ${signature.stageName}. ${media.fr} Utilisation melee: impact immediat et spectaculaire. Utilisation tactique: equivalent a une carte operationnelle a poser au bon tour.`
    : `${item.name.en} is a ${source} event trigger. ${base} ${universeLexicon(signature, 'en')} A.R.C.A. does not equip it as a permanent weapon: it opens a short window where source-Thread laws override the breach, often around ${signature.stageName}. ${media.en} Melee use: immediate, spectacular impact. Tactics use: an operational card to play on the right turn.`;
};

export const getBattleItemLoreDescription = ({ item, lang = 'fr', lore }) => {
  if (!item) return '';
  const signature = getUniverseSignature(item.universe, lore);
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const tier = item.tier === 'ultimate'
    ? (lang === 'fr' ? 'item ultime' : 'ultimate item')
    : item.tier === 'summon'
      ? (lang === 'fr' ? 'invocation PNJ temporaire' : 'temporary NPC summon')
      : (lang === 'fr' ? 'objet ramassable' : 'pickup item');
  return lang === 'fr'
    ? `${item.name.fr} est un ${tier} lie a ${item.universe}. ${item.desc?.fr || ''} ${universeLexicon(signature, 'fr')} Son role evoque ${signature.stageName} et la menace ${signature.worldBoss || signature.bossName}. ${media.fr} En melee, ${item.melee?.fr || 'son effet se declenche au ramassage.'} En tactique, ${item.tactics?.fr || 'il devient une ressource de case ou de carte.'}`
    : `${item.name.en} is a ${tier} tied to ${item.universe}. ${item.desc?.en || ''} ${universeLexicon(signature, 'en')} Its role echoes ${signature.stageName} and the ${signature.worldBoss || signature.bossName} threat. ${media.en} In melee, ${item.melee?.en || 'its effect triggers on pickup.'} In tactics, ${item.tactics?.en || 'it becomes a tile or card resource.'}`;
};

export const getEnemyLoreDescription = ({ enemy, universe, lang = 'fr', lore, type = 'menace' }) => {
  if (!enemy) return '';
  const signature = getUniverseSignature(universe, lore);
  const role = type === 'worldBoss'
    ? (lang === 'fr' ? 'noyau final local' : 'local final core')
    : type === 'boss'
      ? (lang === 'fr' ? 'champion de faille' : 'breach champion')
      : (lang === 'fr' ? 'menace de terrain' : 'field threat');
  const special = enemy.special
    ? (lang === 'fr' ? `Son pattern signale: ${enemy.special}.` : `Its pattern reads: ${enemy.special}.`)
    : '';
  return lang === 'fr'
    ? `${enemy.name} est une ${role} de ${universe}. Signature source: ${signature.theme}. A.R.C.A. le classe comme deformation active de ${signature.stageName}: il porte la pression de ${signature.worldBoss || signature.bossName} sans effacer les lois de sa Trame. ${special}`.trim()
    : `${enemy.name} is a ${role} from ${universe}. Source signature: ${signature.theme}. A.R.C.A. classifies it as an active deformation of ${signature.stageName}: it carries pressure from ${signature.worldBoss || signature.bossName} without erasing its Thread laws. ${special}`.trim();
};
