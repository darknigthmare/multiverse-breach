const MEDIA_LINES = {
  game: {
    fr: 'A.R.C.A. traite cette Trame comme un systeme jouable: regles, ressources et routines de combat peuvent etre stabilisees.',
    en: 'A.R.C.A. treats this Thread as a playable system: rules, resources, and combat routines can be stabilized.'
  },
  movie: {
    fr: 'La breche conserve un montage cinematographique: chaque symbole devient un signal court, violent et lisible.',
    en: 'The breach keeps a cinematic cut: every symbol becomes a short, violent, readable signal.'
  },
  series: {
    fr: 'La Trame fonctionne par episodes: le Nexus isole les factions, les lieux recurrents et les menaces qui reviennent.',
    en: 'The Thread works in episodes: the Nexus isolates recurring factions, places, and returning threats.'
  },
  manga: {
    fr: 'La compression garde une logique d arc: pouvoirs, rivalites et transformations montent en intensite a chaque faille.',
    en: 'Compression keeps an arc logic: powers, rivalries, and transformations escalate with every breach.'
  },
  music: {
    fr: 'Le Nexus ne capture pas une personne civile: il stabilise une Persona de Resonance nee de l impact culturel et sonore.',
    en: 'The Nexus does not capture a civilian person: it stabilizes a Resonance Persona born from cultural and sonic impact.'
  }
};

const MODE_LINES = {
  RPG: {
    fr: 'Mode RPG: l escouade avance comme dans une confrontation de boss, avec endurance, soins et pics de competence.',
    en: 'RPG mode: the squad advances like a boss confrontation, with endurance, healing, and skill spikes.'
  },
  Tactics: {
    fr: 'Mode Tactics: le terrain devient une grille d ancrage ou placement, tempo et cases ressource decident du combat.',
    en: 'Tactics mode: the field becomes an anchor grid where placement, tempo, and resource tiles decide the fight.'
  },
  Smash: {
    fr: 'Mode Smash: la faille explose en arene rapide, lisible par objets, projections et ultimes de terrain.',
    en: 'Smash mode: the breach bursts into a fast arena driven by pickups, knockback, and stage ultimates.'
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

const listStats = (boost = {}, lang = 'fr') => {
  const entries = Object.entries(boost);
  if (!entries.length) return lang === 'fr' ? 'signature stable' : 'stable signature';
  return entries.map(([key, value]) => `+${value} ${statWords[key]?.[lang] || key.toUpperCase()}`).join(' / ');
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
      ? `${stage.displayName.fr} est une mission personnelle: ${stage.characterArc.intro.fr} Le Nexus force ${bossIntel?.name || stage.bossName} a reveler la contradiction qui menace ce personnage. Recompense: ${stage.rewardItemName.fr}, une trace identitaire qui servira aux skins, titres et passifs personnels.`
      : `${stage.displayName.en} is a personal mission: ${stage.characterArc.intro.en} The Nexus forces ${bossIntel?.name || stage.bossName} to reveal the contradiction threatening this character. Reward: ${stage.rewardItemName.en}, an identity trace for skins, titles, and personal passives.`;
  }

  if (stage.fusionMission) {
    const sources = stage.sourceUniverses?.join(' / ') || stage.universe;
    return lang === 'fr'
      ? `${stage.displayName.fr} fusionne ${sources}. ${stage.fusionMission.decor.fr} Les sources stabilisees (${sourceClears}/${sourceTotal}) determinent la securite d ouverture; ${stage.bossName} agit comme verrou hybride. Recompense: ${stage.rewardItemName.fr}, utile pour craft, skins et arcs fusion.`
      : `${stage.displayName.en} fuses ${sources}. ${stage.fusionMission.decor.en} Stabilized sources (${sourceClears}/${sourceTotal}) determine opening safety; ${stage.bossName} acts as the hybrid lock. Reward: ${stage.rewardItemName.en}, useful for craft, skins, and fusion arcs.`;
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
      ? ' Version +: la relique a ete recompressee avec un doublon de cache, donc son effet est plus brutal mais plus instable.'
      : ' Plus version: the relic was recompressed with a duplicate cache, making the effect stronger but less stable.')
    : '';
  return lang === 'fr'
    ? `${item.name.fr} vient de ${item.universe} et n est pas un simple bonus de stats: A.R.C.A. l utilise comme ancre materielle pour rappeler les lois de son monde d origine. Effet gameplay: ${stats}. ${media.fr} Dans le lore Multiverse Breach, cette relique aide le porteur a imposer sa logique locale quand une zone tente de l effacer.${upgradeLine}`
    : `${item.name.en} comes from ${item.universe} and is not just a stat bonus: A.R.C.A. uses it as a material anchor to recall origin-world laws. Gameplay effect: ${stats}. ${media.en} In Multiverse Breach lore, this relic helps the carrier impose local logic when a zone tries to erase it.${upgradeLine}`;
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
