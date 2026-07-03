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
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const factionLine = FACTION_LINES[faction] || FACTION_LINES.unknown;
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

  return `${base} ${media[lang]} ${factionLine[lang]} ${status} ${inventory}`.trim();
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
  const mode = MODE_LINES[stage.mode] || MODE_LINES.RPG;
  const difficulty = DIFFICULTY_LINES[stage.difficulty] || DIFFICULTY_LINES.Medium;
  const loreDesc = lore?.desc?.[lang] || '';
  const modifierLine = modifier?.name?.[lang]
    ? (lang === 'fr'
      ? `Anomalie active: ${modifier.name[lang]} - ${modifier.desc?.[lang] || 'effet inconnu mais mesurable par A.R.C.A.'}`
      : `Active anomaly: ${modifier.name[lang]} - ${modifier.desc?.[lang] || 'unknown but measurable A.R.C.A. effect.'}`)
    : '';
  return lang === 'fr'
    ? `${stage.name} est le point de rupture de ${stage.universe}: ${loreDesc} ${media.fr} ${mode.fr} Objectif lore: neutraliser ${bossIntel?.name || stage.bossName}, recuperer ${stage.goldPrize} or / ${stage.shardPrize} fragments et verrouiller les coordonnees avant que le Sans-Auteur transforme cette Trame en bruit blanc. ${difficulty.fr} ${modifierLine}`.trim()
    : `${stage.name} is the rupture point for ${stage.universe}: ${loreDesc} ${media.en} ${mode.en} Lore objective: neutralize ${bossIntel?.name || stage.bossName}, recover ${stage.goldPrize} gold / ${stage.shardPrize} shards, and lock coordinates before the Authorless turns this Thread into white noise. ${difficulty.en} ${modifierLine}`.trim();
};

export const getGearLoreDescription = ({ item, lang = 'fr', lore }) => {
  if (!item) return '';
  const stats = listStats(item.boost, lang);
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const upgradeLine = item.isUpgraded
    ? (lang === 'fr'
      ? ' Version +: la relique a absorbe un echo deja scelle; son signal frappe plus fort, mais A.R.C.A. surveille sa derive.'
      : ' Plus version: the relic absorbed an already-sealed echo; its signal strikes harder, but A.R.C.A. watches its drift.')
    : '';
  return lang === 'fr'
    ? `${item.name.fr} vient de ${item.universe}. A.R.C.A. l utilise comme ancre materielle: elle rappelle au porteur les lois de son monde d origine quand une zone tente de les effacer. Resonance mesuree: ${stats}. ${media.fr}${upgradeLine}`
    : `${item.name.en} comes from ${item.universe}. A.R.C.A. uses it as a material anchor: it reminds the carrier of origin-world laws when a zone tries to erase them. Measured resonance: ${stats}. ${media.en}${upgradeLine}`;
};

export const getEventLoreDescription = ({ item, lang = 'fr', universe, lore }) => {
  if (!item) return '';
  const source = item.universe || universe;
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const base = item.desc?.[lang] || '';
  return lang === 'fr'
    ? `${item.name.fr} est un declencheur evenementiel de ${source}. ${base} A.R.C.A. ne l equipe pas comme une arme permanente: il ouvre une fenetre courte ou le lore original reprend le dessus sur la breche. ${media.fr} Utilisation melee: impact immediat et spectaculaire. Utilisation tactique: equivalent a une carte operationnelle a poser au bon tour.`
    : `${item.name.en} is a ${source} event trigger. ${base} A.R.C.A. does not equip it as a permanent weapon: it opens a short window where original lore overrides the breach. ${media.en} Melee use: immediate, spectacular impact. Tactics use: an operational card to play on the right turn.`;
};

export const getBattleItemLoreDescription = ({ item, lang = 'fr', lore }) => {
  if (!item) return '';
  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const tier = item.tier === 'ultimate'
    ? (lang === 'fr' ? 'item ultime' : 'ultimate item')
    : item.tier === 'summon'
      ? (lang === 'fr' ? 'invocation PNJ temporaire' : 'temporary NPC summon')
      : (lang === 'fr' ? 'objet ramassable' : 'pickup item');
  return lang === 'fr'
    ? `${item.name.fr} est un ${tier} lie a ${item.universe}. ${item.desc?.fr || ''} ${media.fr} En melee, ${item.melee?.fr || 'son effet se declenche au ramassage.'} En tactique, ${item.tactics?.fr || 'il devient une ressource de case ou de carte.'}`
    : `${item.name.en} is a ${tier} tied to ${item.universe}. ${item.desc?.en || ''} ${media.en} In melee, ${item.melee?.en || 'its effect triggers on pickup.'} In tactics, ${item.tactics?.en || 'it becomes a tile or card resource.'}`;
};
