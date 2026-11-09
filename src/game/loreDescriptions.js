// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/loreDescriptions.js';
import * as dlcHalo from '../../DLC/Halo/data/loreDescriptions.js';
import * as dlcAlien from '../../DLC/Alien/data/loreDescriptions.js';
import * as dlcPredator from '../../DLC/Predator/data/loreDescriptions.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/loreDescriptions.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/loreDescriptions.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/loreDescriptions.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/loreDescriptions.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/loreDescriptions.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/loreDescriptions.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/loreDescriptions.js';
import * as dlcStargate from '../../DLC/Stargate/data/loreDescriptions.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/loreDescriptions.js';
import * as dlcPortal from '../../DLC/Portal/data/loreDescriptions.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/loreDescriptions.js';
import * as dlcPayday from '../../DLC/Payday/data/loreDescriptions.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/loreDescriptions.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/loreDescriptions.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/loreDescriptions.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/loreDescriptions.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/loreDescriptions.js';
import * as dlcChucky from '../../DLC/Chucky/data/loreDescriptions.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/loreDescriptions.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/loreDescriptions.js';
import * as dlcFallout from '../../DLC/Fallout/data/loreDescriptions.js';
import * as dlcDoom from '../../DLC/Doom/data/loreDescriptions.js';
import * as dlcUnreal from '../../DLC/Unreal/data/loreDescriptions.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/loreDescriptions.js';
import * as dlcStarWars from '../../DLC/StarWars/data/loreDescriptions.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/loreDescriptions.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/loreDescriptions.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/loreDescriptions.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/loreDescriptions.js';
import * as dlcDigimon from '../../DLC/Digimon/data/loreDescriptions.js';
import * as dlcSaw from '../../DLC/Saw/data/loreDescriptions.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/loreDescriptions.js';
import * as dlcMadMax from '../../DLC/MadMax/data/loreDescriptions.js';

import { getSignatureCodex, getSignatureSummary, signatureText } from './signatureCodex.js';
import { FEATURED_ENEMY_LORE, FEATURED_GEAR_LORE, FEATURED_STAGE_LORE } from './featuredUniversePacks';
import { getCanonicalArchiveEnemyLore, getCanonicalArchiveStageLore } from './canonicalArchiveLore.js';

const localizedValue = signatureText;

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
  'Gears of War': dlcGearsOfWar.createCoreUniverseSignatures(),
  Halo: dlcHalo.createCoreUniverseSignatures(),
  Alien: dlcAlien.createCoreUniverseSignatures(),
  Predator: dlcPredator.createCoreUniverseSignatures(),
  'Resident Evil': dlcResidentEvil.createCoreUniverseSignatures(),
  'Silent Hill': dlcSilentHill.createCoreUniverseSignatures(),
  'Dino Crisis': dlcDinoCrisis.createCoreUniverseSignatures(),
  'The Matrix': dlcTheMatrix.createCoreUniverseSignatures(),
  Buckethead: dlcBuckethead.createCoreUniverseSignatures(),
  'System of a Down': dlcSystemOfADown.createCoreUniverseSignatures(),
  Kaamelott: dlcKaamelott.createCoreUniverseSignatures(),
  Stargate: dlcStargate.createCoreUniverseSignatures(),
  'Half-Life': dlcHalfLife.createCoreUniverseSignatures(),
  Portal: dlcPortal.createCoreUniverseSignatures(),
  'Metal Gear': dlcMetalGear.createCoreUniverseSignatures(),
  Payday: dlcPayday.createCoreUniverseSignatures(),
  Vocaloid: dlcVocaloid.createCoreUniverseSignatures(),
  'Yu-Gi-Oh': dlcYuGiOh.createCoreUniverseSignatures(),
  'Guilty Gear': dlcGuiltyGear.createCoreUniverseSignatures(),
  BlazBlue: dlcBlazBlue.createCoreUniverseSignatures(),
  'Slender Man': dlcSlenderMan.createCoreUniverseSignatures(),
  Chucky: dlcChucky.createCoreUniverseSignatures(),
  Hellraiser: dlcHellraiser.createCoreUniverseSignatures(),
  'Mass Effect': dlcMassEffect.createCoreUniverseSignatures(),
  Fallout: dlcFallout.createCoreUniverseSignatures(),
  Doom: dlcDoom.createCoreUniverseSignatures(),
  Unreal: dlcUnreal.createCoreUniverseSignatures(),
  'Harry Potter': dlcHarryPotter.createCoreUniverseSignatures(),
  'Star Wars': dlcStarWars.createCoreUniverseSignatures(),
  'Scary Movie': dlcScaryMovie.createCoreUniverseSignatures(),
  'Dead Space': dlcDeadSpace.createCoreUniverseSignatures(),
  'Rick & Morty': dlcRickMorty.createCoreUniverseSignatures(),
  'Digital Circus': dlcDigitalCircus.createCoreUniverseSignatures(),
  Digimon: dlcDigimon.createCoreUniverseSignatures(),
  Saw: dlcSaw.createCoreUniverseSignatures(),
  'Ghost in the Shell': dlcGhostInTheShell.createCoreUniverseSignatures(),
  'Mad Max': dlcMadMax.createCoreUniverseSignatures()
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
    if (stage.escort?.heroId) {
      const objectives = (stage.characterArc.missions || []).map(item => localizedValue(item, lang)).join(' ');
      return `${localizedValue(stage.displayName, lang, stage.name)}: ${localizedValue(stage.characterArc.intro, lang)} ${objectives} ${lang === 'fr' ? 'Trace promise' : 'Promised trace'}: ${localizedValue(stage.rewardItemName, lang)}.`;
    }
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

  if (stage.originalContent && stage.campaignDependency === 'originalCampaign') {
    const name = stage.displayName?.[lang] || stage.name;
    const setting = stage.setting?.[lang] || stage.setting?.fr || '';
    const objective = stage.objective?.[lang] || stage.objective?.fr || stage.objectiveType;
    const common = stage.production?.layout?.common || {};
    const tacticalDetails = lang === 'fr'
      ? `${common.heroSpawns?.length || 0} points d entree, ${common.lightCover?.length || 0} couverts legers, ${common.heavyCover?.length || 0} couvert lourd et ${common.traps?.length || 0} piege telegraphie.`
      : `${common.heroSpawns?.length || 0} entry points, ${common.lightCover?.length || 0} light covers, ${common.heavyCover?.length || 0} heavy cover, and ${common.traps?.length || 0} telegraphed trap.`;
    return lang === 'fr'
      ? `${name} appartient integralement a la Trame originale ${stage.universe}. Terrain: ${setting} Objectif d arc: ${objective} Menace finale: ${bossIntel?.name || stage.bossName}. Layout v2: ${tacticalDetails} Recompense: ${stage.goldPrize} or / ${stage.shardPrize} fragments.`
      : `${name} belongs entirely to the original ${stage.universe} Thread. Terrain: ${setting} Arc objective: ${objective} Final threat: ${bossIntel?.name || stage.bossName}. Layout v2: ${tacticalDetails} Reward: ${stage.goldPrize} gold / ${stage.shardPrize} shards.`;
  }

  const canonicalLore = getCanonicalArchiveStageLore(stage);
  if (canonicalLore) {
    const sourceLine = lang === 'fr' ? 'Référence' : 'Reference';
    const rewardLine = lang === 'fr'
      ? `Récompense de stabilisation : ${stage.goldPrize} or / ${stage.shardPrize} fragments.`
      : `Stabilization reward: ${stage.goldPrize} gold / ${stage.shardPrize} shards.`;
    return `${sourceLine} : ${stage.incarnation}. ${localizedValue(canonicalLore.lore, lang)} Adaptation Breach : ${localizedValue(canonicalLore.adaptation, lang)} ${rewardLine}`;
  }

  const media = MEDIA_LINES[lore?.mediaType] || MEDIA_LINES.game;
  const signature = getUniverseSignature(stage.universe, lore);
  const mode = MODE_LINES[stage.mode] || MODE_LINES.RPG;
  const difficulty = DIFFICULTY_LINES[stage.difficulty] || DIFFICULTY_LINES.Medium;
  const featuredLore = FEATURED_STAGE_LORE[stage.universe]?.[stage.mode]?.[lang];
  if (featuredLore) {
    return lang === 'fr'
      ? `${featuredLore} ${mode.fr} Noyau indexe: ${bossIntel?.name || stage.bossName || signature.bossName}. Recompense de stabilisation: ${stage.goldPrize} or / ${stage.shardPrize} fragments. ${difficulty.fr}`
      : `${featuredLore} ${mode.en} Indexed core: ${bossIntel?.name || stage.bossName || signature.bossName}. Stabilization reward: ${stage.goldPrize} gold / ${stage.shardPrize} shards. ${difficulty.en}`;
  }
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
  const featuredLore = FEATURED_GEAR_LORE[item.id]?.[lang];
  const itemNote = featuredLore ? `${featuredLore} ` : item.desc?.[lang] ? `${item.desc[lang]} ` : '';
  const upgradeLine = item.isUpgraded
    ? (lang === 'fr'
      ? ' Version +: la relique a absorbe un echo deja scelle; son signal frappe plus fort, mais A.R.C.A. surveille sa derive.'
      : ' Plus version: the relic absorbed an already-sealed echo; its signal strikes harder, but A.R.C.A. watches its drift.')
    : '';
  return lang === 'fr'
    ? `${item.name.fr} vient de ${item.universe}. ${itemNote}${universeLexicon(signature, 'fr')} A.R.C.A. l utilise comme ancre materielle: elle rappelle au porteur les lois de ${signature.stageName} quand une zone tente de les effacer. Resonance mesuree: ${stats}. ${media.fr}${upgradeLine}`
    : `${item.name.en} comes from ${item.universe}. ${itemNote}${universeLexicon(signature, 'en')} A.R.C.A. uses it as a material anchor: it reminds the carrier of ${signature.stageName} laws when a zone tries to erase them. Measured resonance: ${stats}. ${media.en}${upgradeLine}`;
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

const getEnemyBaseLoreDescription = ({ enemy, universe, lang = 'fr', lore, type = 'menace' }) => {
  if (!enemy) return '';
  const canonicalLore = getCanonicalArchiveEnemyLore(universe, enemy);
  if (canonicalLore) {
    const sourceLine = lang === 'fr' ? 'Référence' : 'Reference';
    const technique = localizedValue(enemy.special, lang);
    const gameTechnique = technique
      ? `${lang === 'fr' ? 'Technique en jeu' : 'In-game technique'} : ${technique}.`
      : '';
    return `${canonicalLore.name}. ${sourceLine} : ${canonicalLore.incarnation}. ${localizedValue(canonicalLore.lore, lang)} ${gameTechnique}`.trim();
  }
  const signature = getUniverseSignature(universe, lore);
  const role = type === 'worldBoss'
    ? (lang === 'fr' ? 'noyau final local' : 'local final core')
    : type === 'boss'
      ? (lang === 'fr' ? 'champion de faille' : 'breach champion')
      : (lang === 'fr' ? 'menace de terrain' : 'field threat');
  const specialText = localizedValue(enemy.special, lang);
  const special = specialText
    ? (lang === 'fr' ? `Son pattern signale: ${specialText}.` : `Its pattern reads: ${specialText}.`)
    : '';
  const featuredLore = FEATURED_ENEMY_LORE[universe]?.[enemy.name]?.[lang];
  if (featuredLore) return `${featuredLore} ${special}`.trim();
  return lang === 'fr'
    ? `${enemy.name} est une ${role} de ${universe}. Signature source: ${signature.theme}. A.R.C.A. le classe comme deformation active de ${signature.stageName}: il porte la pression de ${signature.worldBoss || signature.bossName} sans effacer les lois de sa Trame. ${special}`.trim()
    : `${enemy.name} is a ${role} from ${universe}. Source signature: ${signature.theme}. A.R.C.A. classifies it as an active deformation of ${signature.stageName}: it carries pressure from ${signature.worldBoss || signature.bossName} without erasing its Thread laws. ${special}`.trim();
};


export const getEnemyLoreDescription = (options) => {
  if (!options?.enemy) return '';
  const actor = { ...options.enemy, universe: options.enemy.universe || options.universe };
  const codex = getSignatureCodex(actor);
  const enemy = codex ? { ...options.enemy, special: codex.name } : options.enemy;
  const lore = getEnemyBaseLoreDescription({ ...options, enemy });
  return codex ? `${lore} ${getSignatureSummary(codex, options.lang)}` : lore;
};
