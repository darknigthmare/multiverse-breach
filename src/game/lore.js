// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/lore.js';
import * as dlcHalo from '../../DLC/Halo/data/lore.js';
import * as dlcAlien from '../../DLC/Alien/data/lore.js';
import * as dlcPredator from '../../DLC/Predator/data/lore.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/lore.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/lore.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/lore.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/lore.js';
import * as dlcStargate from '../../DLC/Stargate/data/lore.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/lore.js';
import * as dlcPortal from '../../DLC/Portal/data/lore.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/lore.js';
import * as dlcPayday from '../../DLC/Payday/data/lore.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/lore.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/lore.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/lore.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/lore.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/lore.js';
import * as dlcChucky from '../../DLC/Chucky/data/lore.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/lore.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/lore.js';
import * as dlcFallout from '../../DLC/Fallout/data/lore.js';
import * as dlcDoom from '../../DLC/Doom/data/lore.js';
import * as dlcUnreal from '../../DLC/Unreal/data/lore.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/lore.js';
import * as dlcStarWars from '../../DLC/StarWars/data/lore.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/lore.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/lore.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/lore.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/lore.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/lore.js';
import * as dlcDigimon from '../../DLC/Digimon/data/lore.js';
import * as dlcSaw from '../../DLC/Saw/data/lore.js';
import * as dlcRosarioVampire from '../../DLC/RosarioVampire/data/lore.js';
import * as dlcNegima from '../../DLC/Negima/data/lore.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/lore.js';
import * as dlcMadMax from '../../DLC/MadMax/data/lore.js';

import { EXPANDED_LORE_DB } from './expandedUniverses';
import { SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB } from './solarOppositesSirenStarWarsPack.js';

export const NEXUS_CANON = {
  name: { en: 'Nexus of Convergence', fr: 'Nexus de Convergence' },
  playerRole: { en: 'Anchored One', fr: 'Ancre' },
  guide: 'A.R.C.A.',
  antagonist: { en: 'The Authorless', fr: 'Le Sans-Auteur' },
  breachEvent: { en: 'First Breach', fr: 'Premiere Breche' },
  twistFigure: { en: 'Veyr, Cartographer of Ruptures', fr: 'Veyr, Cartographe des Ruptures' }
};

export const CORE_CODEX_ENTRIES = [
  {
    id: 'veil',
    category: { en: 'Foundation', fr: 'Fondation' },
    title: { en: 'The Veil', fr: 'Le Voile' },
    desc: {
      en: 'The Veil was the membrane separating each Thread of reality. Since the First Breach, it no longer closes cleanly: it frays, leaks rules, and lets impossible worlds touch.',
      fr: 'Le Voile etait la membrane qui separait chaque Trame de realite. Depuis la Premiere Breche, il ne se referme plus proprement: il s effiloche, laisse fuir les regles et permet a des mondes impossibles de se toucher.'
    }
  },
  {
    id: 'threads',
    category: { en: 'Multiverse Law', fr: 'Loi multiverselle' },
    title: { en: 'Threads', fr: 'Les Trames' },
    desc: {
      en: 'A Thread is a complete universe with an origin, internal laws, symbols, heroes, and anchor figures. Multiverse Breach never treats a crossover as random: every arrival is a damaged Thread seeking stability.',
      fr: 'Une Trame est un univers complet avec une origine, des lois internes, des symboles, des heros et des figures d ancrage. Multiverse Breach ne traite jamais un crossover comme un hasard: chaque arrivee est une Trame blessee qui cherche une stabilite.'
    }
  },
  {
    id: 'first-breach',
    category: { en: 'Cataclysm', fr: 'Cataclysme' },
    title: { en: 'The First Breach', fr: 'La Premiere Breche' },
    desc: {
      en: 'Also called the Night of a Thousand Portals, the First Breach shattered the Veil and collapsed many Threads into the Nexus of Convergence. It was not a natural disaster: someone opened the wound.',
      fr: 'Aussi appelee Nuit des Mille Portails, la Premiere Breche a fracture le Voile et projete de nombreuses Trames dans le Nexus de Convergence. Ce n etait pas une catastrophe naturelle: quelqu un a ouvert la blessure.'
    }
  },
  {
    id: 'arca',
    category: { en: 'Archive AI', fr: 'IA d archive' },
    title: { en: 'A.R.C.A.', fr: 'A.R.C.A.' },
    desc: {
      en: 'The Archive of Resonance for Anomalous Continuities records heroes, bosses, relics, and world-laws before they are rewritten. A.R.C.A. guides the player because the player signature remains unusually whole.',
      fr: 'L Archive de Resonance des Continuites Anormales enregistre les heros, boss, reliques et lois de monde avant leur reecriture. A.R.C.A. guide le joueur car sa signature reste etrangement entiere.'
    }
  },
  {
    id: 'anchored',
    category: { en: 'Player Role', fr: 'Role joueur' },
    title: { en: 'The Anchored Ones', fr: 'Les Ancres' },
    desc: {
      en: 'An Anchored One can hold several incompatible realities without dissolving. This is why the player can command displaced heroes, bind relics, and keep a coherent Nexus trace across unstable breaches.',
      fr: 'Un Ancre peut contenir plusieurs realites incompatibles sans se dissoudre. C est pour cela que le joueur peut commander des heros deplaces, lier des reliques et garder une trace Nexus coherente entre des breches instables.'
    }
  },
  {
    id: 'origin-shards',
    category: { en: 'Nexus Matter', fr: 'Matiere Nexus' },
    title: { en: 'Origin Shards', fr: 'Eclats d Origine' },
    desc: {
      en: 'Origin Shards are fragments of coherent history recovered after a breach. A.R.C.A. uses them to anchor signatures, infuse relics, engrave Nexus traces, and one day let several Anchored Ones share the same stabilized memory.',
      fr: 'Les Eclats d Origine sont des fragments d histoire coherente recuperes apres une breche. A.R.C.A. les utilise pour ancrer les signatures, infuser les reliques, graver les traces Nexus et, plus tard, permettre a plusieurs Ancres de partager une meme memoire stabilisee.'
    }
  },
  {
    id: 'compression',
    category: { en: 'Nexus Law', fr: 'Loi Nexus' },
    title: { en: 'Resonance Compression', fr: 'Compression de Resonance' },
    desc: {
      en: 'Compression of Resonance explains why legendary figures fight on equal playable scale. The Nexus reduces impossible power gaps while preserving signature abilities, roles, and weaknesses.',
      fr: 'La Compression de Resonance explique pourquoi des figures mythiques combattent a une echelle jouable commune. Le Nexus reduit les ecarts de puissance impossibles tout en preservant les capacites, roles et faiblesses signatures.'
    }
  },
  {
    id: 'personas',
    category: { en: 'Media Rule', fr: 'Regle media' },
    title: { en: 'Resonance Personas', fr: 'Personas de Resonance' },
    desc: {
      en: 'Music, web, and cultural icons appear as symbolic Resonance Personas: avatars born from collective impact, not ordinary civilians pulled into combat by accident.',
      fr: 'Les icones musicales, web et culturelles apparaissent comme des Personas de Resonance: des avatars symboliques nes de leur impact collectif, pas de simples civils tires au hasard dans le combat.'
    }
  },
  {
    id: 'authorless',
    category: { en: 'Threat', fr: 'Menace' },
    title: { en: 'The Authorless', fr: 'Le Sans-Auteur' },
    desc: {
      en: 'The Authorless is the causal pressure of Route X, the inhabited route sacrificed during the First Breach and then stripped of names by A.R.C.A. Veyr passage gave that pressure form and access to the multiverse; it did not summon an external entity. It removes meaning, origin, memory, and choice until no Thread can resist.',
      fr: 'Le Sans-Auteur est la pression causale de la Route X, route habitee sacrifiee pendant la Premiere Breche puis privee de noms par A.R.C.A. Le passage de Veyr a donne une forme et un acces multiversel a cette pression; il n a pas invoque une entite exterieure. Elle retire le sens, l origine, la memoire et le choix jusqu a ce qu aucune Trame ne puisse resister.'
    }
  },
  {
    id: 'veyr',
    category: { en: 'Hidden Truth', fr: 'Verite cachee' },
    title: { en: 'Veyr, Cartographer of Ruptures', fr: 'Veyr, Cartographe des Ruptures' },
    desc: {
      en: 'Veyr was an Archivist who tried to build a peaceful Nexus between worlds. He opened the First Breach knowing one route would fall. Route X became causal pressure when A.R.C.A. erased its names; Veyr passage gave that pressure form and access, but did not import a being from outside the multiverse.',
      fr: 'Veyr etait un Archiviste qui voulait creer un Nexus de paix entre les mondes. Il ouvrit la Premiere Breche en sachant qu une route tomberait. La Route X devint une pression causale quand A.R.C.A. effaca ses noms; le passage de Veyr donna une forme et un acces a cette pression, sans importer un etre venu de l exterieur du multivers.'
    }
  }
];

export const NARRATIVE_ACTS = [
  {
    id: 'prologue',
    title: { en: 'Prologue - The Sky Breaks', fr: 'Prologue - Le ciel se brise' },
    text: {
      en: 'A.R.C.A. detects a living signal inside the Nexus. The Anchor forms Cell ZERO and restores the first Lock of Name.',
      fr: 'A.R.C.A. detecte un signal vivant dans le Nexus. L Ancre forme la cellule ZERO et restaure le premier Verrou du Nom.'
    }
  },
  {
    id: 'arrivals',
    title: { en: 'Act I - The Lives That Arrive', fr: 'Acte I - Les vies qui arrivent' },
    text: {
      en: 'Contradictory memories and possible lives reveal how the Authorless turns regret into attractive replacements.',
      fr: 'Les memoires contradictoires et les vies possibles revelent comment le Sans-Auteur transforme le regret en remplacements seduisants.'
    }
  },
  {
    id: 'anchors',
    title: { en: 'Act II - The War of Anchors', fr: 'Acte II - La Guerre des Ancrages' },
    text: {
      en: 'The Black Ledger exposes the route sacrificed to stabilize the first anchors. A.R.C.A. must acknowledge its debt instead of turning it into a weapon.',
      fr: 'Le Registre noir expose la route sacrifiee pour stabiliser les premiers ancrages. A.R.C.A. doit reconnaitre sa dette au lieu d en faire une arme.'
    }
  },
  {
    id: 'archives',
    title: { en: 'Act III - The Impossible Archives', fr: 'Acte III - Les Archives Impossibles' },
    text: {
      en: 'Perfect portals offer lives without failure. Cell ZERO preserves the only causal passage because it still carries names, losses, and contradictions.',
      fr: 'Les portails parfaits offrent des vies sans echec. La cellule ZERO conserve le seul passage causal parce qu il transporte encore noms, pertes et contradictions.'
    }
  },
  {
    id: 'white-void',
    title: { en: 'Act IV - The White Void', fr: 'Acte IV - Le Vide Blanc' },
    text: {
      en: 'The Authorless takes form at the White Threshold. The Anchor records and bounds it rather than repeating the original erasure; its first coordinate reveals Route X.',
      fr: 'Le Sans-Auteur prend forme au Seuil blanc. L Ancre l inscrit et le limite au lieu de repeter l effacement originel; sa premiere coordonnee revele la Route X.'
    }
  },
  {
    id: 'primordial',
    title: { en: 'Act V - The Primordial Breach', fr: 'Acte V - La Breche Primordiale' },
    text: {
      en: 'Route X recovers its names, Veyr and A.R.C.A. answer for their distinct decisions, and the squad reaches the first wound to choose whether to seal, converge, break, or surrender the multiverse.',
      fr: 'La Route X retrouve ses noms, Veyr et A.R.C.A. repondent de leurs decisions distinctes, puis l escouade atteint la premiere blessure et choisit entre sceller, faire converger, rompre ou abandonner le multivers.'
    }
  }
];

export const LORE_DB = {
  'Nexus de Convergence': {
    mediaType: 'game',
    title: { en: 'Nexus of Convergence', fr: 'Nexus de Convergence' },
    desc: {
      en: 'Stable hub formed after the First Breach. It is not a normal universe, but the Atrium where Anchored Ones, A.R.C.A., displaced heroes, and recovered Origin Shards can coexist without immediate collapse.',
      fr: 'Hub stable forme apres la Premiere Breche. Ce n est pas un univers normal, mais l Atrium ou les Ancres, A.R.C.A., les heros deplaces et les Eclats d Origine recuperes peuvent coexister sans effondrement immediat.'
    }
  },
  'Gears of War': dlcGearsOfWar.createLoreDb(),
  'Halo': dlcHalo.createLoreDb(),
  'Alien': dlcAlien.createLoreDb(),
  'Predator': dlcPredator.createLoreDb(),
  'Resident Evil': dlcResidentEvil.createLoreDb(),
  'Silent Hill': dlcSilentHill.createLoreDb(),
  'Dino Crisis': dlcDinoCrisis.createLoreDb(),
  'The Matrix': dlcTheMatrix.createLoreDb(),
  'Stargate': dlcStargate.createLoreDb(),
  'Half-Life': dlcHalfLife.createLoreDb(),
  'Portal': dlcPortal.createLoreDb(),
  'Metal Gear': dlcMetalGear.createLoreDb(),
  'Payday': dlcPayday.createLoreDb(),
  'Vocaloid': dlcVocaloid.createLoreDb(),
  'Yu-Gi-Oh': dlcYuGiOh.createLoreDb(),
  'Guilty Gear': dlcGuiltyGear.createLoreDb(),
  'BlazBlue': dlcBlazBlue.createLoreDb(),
  'Slender Man': dlcSlenderMan.createLoreDb(),
  'Chucky': dlcChucky.createLoreDb(),
  'Hellraiser': dlcHellraiser.createLoreDb(),
  'Mass Effect': dlcMassEffect.createLoreDb(),
  'Fallout': dlcFallout.createLoreDb(),
  'Doom': dlcDoom.createLoreDb(),
  'Unreal': dlcUnreal.createLoreDb(),
  'Harry Potter': dlcHarryPotter.createLoreDb(),
  'Star Wars': dlcStarWars.createLoreDb(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createLoreDb(),
  'Scary Movie': dlcScaryMovie.createLoreDb(),
  'Dead Space': dlcDeadSpace.createLoreDb(),
  'Rick & Morty': dlcRickMorty.createLoreDb(),
  'Digital Circus': dlcDigitalCircus.createLoreDb(),
  'Digimon': dlcDigimon.createLoreDb(),
  'Saw': dlcSaw.createLoreDb(),
  'Rosario + Vampire': dlcRosarioVampire.createLoreDb(),
  'Negima': dlcNegima.createLoreDb(),
  'Ghost in the Shell': dlcGhostInTheShell.createLoreDb(),
  'Mad Max': dlcMadMax.createLoreDb()
};

Object.assign(LORE_DB, EXPANDED_LORE_DB, SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB);
