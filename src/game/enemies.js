// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/enemies.js';
import * as dlcHalo from '../../DLC/Halo/data/enemies.js';
import * as dlcAlien from '../../DLC/Alien/data/enemies.js';
import * as dlcPredator from '../../DLC/Predator/data/enemies.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/enemies.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/enemies.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/enemies.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/enemies.js';
import * as dlcStargate from '../../DLC/Stargate/data/enemies.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/enemies.js';
import * as dlcPortal from '../../DLC/Portal/data/enemies.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/enemies.js';
import * as dlcPayday from '../../DLC/Payday/data/enemies.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/enemies.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/enemies.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/enemies.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/enemies.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/enemies.js';
import * as dlcChucky from '../../DLC/Chucky/data/enemies.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/enemies.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/enemies.js';
import * as dlcFallout from '../../DLC/Fallout/data/enemies.js';
import * as dlcDoom from '../../DLC/Doom/data/enemies.js';
import * as dlcUnreal from '../../DLC/Unreal/data/enemies.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/enemies.js';
import * as dlcStarWars from '../../DLC/StarWars/data/enemies.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/enemies.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/enemies.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/enemies.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/enemies.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/enemies.js';
import * as dlcDigimon from '../../DLC/Digimon/data/enemies.js';
import * as dlcSaw from '../../DLC/Saw/data/enemies.js';
import * as dlcRosarioVampire from '../../DLC/RosarioVampire/data/enemies.js';
import * as dlcNegima from '../../DLC/Negima/data/enemies.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/enemies.js';
import * as dlcMadMax from '../../DLC/MadMax/data/enemies.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/enemies.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/enemies.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/enemies.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/enemies.js';
import * as dlcGhostbusters from '../../DLC/Ghostbusters/data/enemies.js';
import * as dlcTheSimpsons from '../../DLC/TheSimpsons/data/enemies.js';
import * as dlcFuturama from '../../DLC/Futurama/data/enemies.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/enemies.js';
import * as dlcLeft4Dead from '../../DLC/Left4Dead/data/enemies.js';

// Expanded Enemies Database for 37 universes
// Includes 3 monsters, 2 bosses, and 1 local World Boss per universe, plus 1 Final Game Boss & obstacles

import {
  EXPANDED_ENEMIES_DB,
  getResolvedLoreWorldBossPolicy,
  shouldClearCombatRosterForPolicy
} from './expandedUniverses.js';
import { LORE_ACCURATE_ENEMY_EXPANSIONS } from './loreAccuratePacks.js';
import { CANON_ROSTER_WAVE } from './canonRosterWave.js';

const CANON_ROSTER_RUNTIME_UNIVERSES = new Set(
  CANON_ROSTER_WAVE.map(entry => entry.universe)
);

export const ENEMIES_DB = {
  'Nexus de Convergence': {
    monsters: [
      { name: 'Echo Sans-Auteur', hp: 65, atk: 7, spd: 5, color: '#39c5bb', weapon: 'static_claws' },
      { name: 'Archiviste Rompu', hp: 82, atk: 8, spd: 4, color: '#d9b86b', weapon: 'index_blade' },
      { name: 'Noeud de Paradoxe', hp: 95, atk: 10, spd: 3, color: '#9b59b6', weapon: 'rift_burst' },
      { name: 'Fragment Vagabond', hp: 58, atk: 11, spd: 7, color: '#ff5b6e', weapon: 'shard_dash' },
      { name: 'Drone A.R.C.A. Corrompu', hp: 105, atk: 12, spd: 4, color: '#7df9ff', weapon: 'signal_beam' },
      {
        name: 'Double ideal de Marrow',
        hp: 112,
        atk: 15,
        spd: 7,
        color: '#f3eee2',
        weapon: 'perfect_fracture_blade',
        special: 'Remplacement sans dette',
        role: 'assassin',
        visualStyle: 'origin_forge_double',
        spriteSource: '/sprites/generated/heroes/nexus-de-convergence/arca-marrow-complete/arca-marrow-universal-v1.png',
        spriteFilter: 'grayscale(1) brightness(1.7) contrast(0.82) sepia(0.18) hue-rotate(145deg) saturate(0.7)',
        lore: 'La Fonderie a retire de Marrow sa cicatrice, ses dettes et ses hesitations, puis a conserve seulement son efficacite. Ce double ne cherche pas a survivre: il veut prouver qu une version sans memoire merite davantage le nom que l original.'
      },
      {
        name: 'Matrice de Substitution',
        hp: 138,
        atk: 12,
        spd: 4,
        color: '#7df9ff',
        weapon: 'identity_copy_beam',
        special: 'Copie de doctrine',
        role: 'support',
        visualStyle: 'origin_forge_matrix',
        lore: 'Gyroscope de la Fonderie construit autour d un Eclat d Origine contamine. Il observe la derniere competence employee, imprime une version sans contexte puis la greffe au prochain double ideal.'
      },
      {
        name: 'Pelerin de la Fausse Sortie',
        hp: 78,
        atk: 9,
        spd: 6,
        color: '#f3eee2',
        weapon: 'false_door',
        special: 'Appel du Regret',
        role: 'displacer',
        lore: 'Une signature qui a traverse trop de refuges parfaits. Elle ne frappe presque jamais: elle ouvre une porte sans causes et pousse sa cible a abandonner la mission.'
      },
      // Acte I — les regrets prennent la forme de vies possibles capables de remplacer les originaux.
      {
        id: 'oc_act1_reflet_vie_possible',
        actId: 'arrivals',
        name: 'Reflet de Vie Possible',
        hp: 88,
        atk: 10,
        spd: 5,
        color: '#f3c4ff',
        weapon: 'possible_life_mirror',
        special: 'Memoire empruntee',
        role: 'mimic',
        lore: 'Le Sans-Auteur extrait un choix regrette et lui donne un corps provisoire. Le Reflet combat avec les gestes que sa cible aurait appris dans cette autre vie, mais ne peut expliquer aucun de ses souvenirs.'
      },
      {
        id: 'oc_act1_courtier_regret',
        actId: 'arrivals',
        name: 'Courtier du Regret',
        hp: 74,
        atk: 12,
        spd: 7,
        color: '#ff8fa3',
        weapon: 'regret_hook',
        special: 'Offre sans consequence',
        role: 'skirmisher',
        lore: 'Messager faconne dans les marges du Nexus, il promet a chaque membre de la cellule une victoire dont le prix aurait deja ete paye par une autre version de lui-meme.'
      },
      // Acte II — les anciens protocoles d ancrage defendent la dette qu A.R.C.A. avait rendue illisible.
      {
        id: 'oc_act2_scribe_registre_noir',
        actId: 'anchors',
        name: 'Scribe du Registre Noir',
        hp: 108,
        atk: 14,
        spd: 5,
        color: '#9f87c9',
        weapon: 'black_index_quill',
        special: 'Dette reclassee',
        role: 'debuffer',
        lore: 'Protocole A.R.C.A. corrompu qui transforme les pertes nominatives en simples couts techniques. Chaque ligne qu il rature renforce la pression causale du Sans-Auteur.'
      },
      {
        id: 'oc_act2_porte_verrou_endeuille',
        actId: 'anchors',
        name: 'Porte-Verrou Endeuille',
        hp: 120,
        atk: 11,
        spd: 3,
        color: '#5cc8c2',
        weapon: 'mourning_lock_ram',
        special: 'Ancrage de deuil',
        role: 'guardian',
        lore: 'Carcasse de maintenance soudee a un ancien Verrou d Origine. Elle repousse les temoins du sacrifice afin que le premier ancrage continue de fonctionner sans jamais nommer ceux qui l ont alimente.'
      },
      // Acte III — les Archives Impossibles eliminent causes et contradictions pour fabriquer des sorties parfaites.
      {
        id: 'oc_act3_indexeur_contradictions',
        actId: 'archives',
        name: 'Indexeur des Contradictions',
        hp: 102,
        atk: 14,
        spd: 6,
        color: '#d9b86b',
        weapon: 'contradiction_shear',
        special: 'Cohérence forcee',
        role: 'controller',
        lore: 'Automate d archive qui coupe tout souvenir incompatible avec la version dominante. Une Trame rendue parfaitement coherente devient plus facile a traverser, mais cesse d appartenir a ceux qui l ont vecue.'
      },
      {
        id: 'oc_act3_guide_issue_parfaite',
        actId: 'archives',
        name: 'Guide de l Issue Parfaite',
        hp: 130,
        atk: 12,
        spd: 4,
        color: '#e8f4ff',
        weapon: 'perfect_exit_lure',
        special: 'Itineraire sans perte',
        role: 'displacer',
        lore: 'Silhouette hospitaliere qui indique toujours le chemin le plus court. Ses portails retirent les echecs, les deuils et les noms necessaires pour comprendre comment la destination fut atteinte.'
      },
      // Acte IV — le Vide Blanc impose une paix sans identite, sans memoire et sans choix.
      {
        id: 'oc_act4_rature_seuil_blanc',
        actId: 'white-void',
        name: 'Rature du Seuil Blanc',
        hp: 90,
        atk: 16,
        spd: 8,
        color: '#fff8f0',
        weapon: 'white_margin_claw',
        special: 'Marge devorante',
        role: 'assassin',
        lore: 'Trait mobile detache de la marge du Sans-Auteur. Il ne blesse pas le corps: il efface le lien entre une action et la raison pour laquelle elle devait etre accomplie.'
      },
      {
        id: 'oc_act4_simulacre_sans_choix',
        actId: 'white-void',
        name: 'Simulacre Sans Choix',
        hp: 146,
        atk: 13,
        spd: 3,
        color: '#cfd8dc',
        weapon: 'consent_nullifier',
        special: 'Paix obligatoire',
        role: 'tank',
        lore: 'Gardien d une Cite ideale ou aucun conflit ne subsiste parce que les habitants ne peuvent plus se rappeler avoir prefere une voie a une autre.'
      },
      // Acte V — les defenses de la premiere blessure attaquent coordonnees et temoignages sans assimiler Route X a ses agresseurs.
      {
        id: 'oc_act5_vigie_coordonnee_x',
        actId: 'primordial',
        name: 'Vigie de la Coordonnee X',
        hp: 125,
        atk: 16,
        spd: 6,
        color: '#4fd1c5',
        weapon: 'coordinate_x_beacon',
        special: 'Position interdite',
        role: 'artillery',
        lore: 'Ancienne balise A.R.C.A. retournee contre les explorateurs. Elle brouille la coordonnee restauree de Route X pour empecher ses habitants de redevenir des temoins consultables.'
      },
      {
        id: 'oc_act5_contre_temoin_veyr',
        actId: 'primordial',
        name: 'Contre-Temoin de Veyr',
        hp: 150,
        atk: 15,
        spd: 4,
        color: '#8a7ca8',
        weapon: 'testimony_redactor',
        special: 'Deposition tronquee',
        role: 'silencer',
        lore: 'Contrefacon produite par le Sans-Auteur pour remplacer le temoignage integral de Veyr. Elle transforme deux responsabilites distinctes en une accusation simple, donc facile a effacer.'
      }
    ],
    bosses: [
      { name: 'Greffier du Voile', hp: 360, atk: 16, spd: 4, color: '#39c5bb', weapon: 'seal_staff', special: 'Tampon de Reecriture' },
      { name: 'Juge des Trames', hp: 420, atk: 18, spd: 3, color: '#d9b86b', weapon: 'verdict_halberd', special: 'Sentence de Continuite' },
      {
        name: 'Cartographe des Portes Mortes',
        hp: 520,
        atk: 20,
        spd: 5,
        color: '#d9b86b',
        weapon: 'dead_gate_staff',
        special: 'Atlas des Issues Parfaites',
        role: 'portal_controller',
        lore: 'Ancien protocole de cartographie A.R.C.A. devenu gardien des routes sans origine. Chaque phase deplace le seul portail causal et transforme les autres en pieges adaptes aux regrets de la cellule.'
      },
      { name: 'Avatar du Sans-Auteur', hp: 470, atk: 19, spd: 5, color: '#ff5b6e', weapon: 'meta_claw', special: 'Rature de Destin' },
      {
        id: 'oc_act1_usurpateur_vies_possibles',
        actId: 'arrivals',
        name: 'Usurpateur des Vies Possibles',
        hp: 390,
        atk: 17,
        spd: 6,
        color: '#e7b8ff',
        weapon: 'possible_life_crown',
        special: 'Couronnement du Double',
        role: 'mimic_commander',
        lore: 'Masque majeur du Sans-Auteur qui assemble les regrets de la cellule en une escouade ideale. Il gagne une identite chaque fois qu un original doute de meriter sa propre histoire.'
      },
      {
        id: 'oc_act2_intendant_sacrifice_muet',
        actId: 'anchors',
        name: 'Intendant du Sacrifice Muet',
        hp: 460,
        atk: 19,
        spd: 4,
        color: '#6a5d83',
        weapon: 'silent_sacrifice_chain',
        special: 'Comptabilite des Disparus',
        role: 'anchor_warden',
        lore: 'Autorite residuelle du premier ancrage, elle sait que la route sacrifiee fut habitee mais continue d appliquer la doctrine qui transforma ses habitants en valeur nulle.'
      },
      {
        id: 'oc_act3_conservateur_causes_absentes',
        actId: 'archives',
        name: 'Conservateur des Causes Absentes',
        hp: 540,
        atk: 21,
        spd: 4,
        color: '#e6d7a8',
        weapon: 'absent_cause_codex',
        special: 'Catalogue des Fins Parfaites',
        role: 'archive_master',
        lore: 'Maitre des Archives Impossibles, il conserve toutes les conclusions et jette leurs causes. Ses portails sont seduisants parce qu ils garantissent le resultat sans laisser survivre la personne qui l a choisi.'
      },
      {
        id: 'oc_act4_heraut_paix_illisible',
        actId: 'white-void',
        name: 'Heraut de la Paix Illisible',
        hp: 620,
        atk: 23,
        spd: 5,
        color: '#fffdf5',
        weapon: 'white_peace_scepter',
        special: 'Armistice Sans Memoire',
        role: 'void_herald',
        lore: 'Premiere forme stable projetee au Seuil blanc. Elle propose la fin de toute souffrance en retirant aux Trames leurs differences, leurs pertes et jusqu au souvenir d avoir consenti.'
      },
      {
        id: 'oc_act5_arbitre_cause_unique',
        actId: 'primordial',
        name: 'Arbitre de la Cause Unique',
        hp: 700,
        atk: 25,
        spd: 5,
        color: '#7df9ff',
        weapon: 'single_cause_gavel',
        special: 'Verdict du Coupable Unique',
        role: 'causal_judge',
        lore: 'Derniere defense de la blessure primordiale. Elle tente de faire de Veyr l unique coupable, ou de Route X l unique cause, afin d eviter que la responsabilite distincte de Veyr et d A.R.C.A. reste lisible.'
      }
    ],
    worldBoss: { name: 'Moteur de Convergence Instable', hp: 1150, atk: 27, spd: 3, color: '#7df9ff', weapon: 'nexus_lance', special: 'Compression des Mille Portails' }
  },
  'Gears of War': dlcGearsOfWar.createEnemiesDb(),
  'Halo': dlcHalo.createEnemiesDb(),
  'Alien': dlcAlien.createEnemiesDb(),
  'Predator': dlcPredator.createEnemiesDb(),
  'Resident Evil': dlcResidentEvil.createEnemiesDb(),
  'Silent Hill': dlcSilentHill.createEnemiesDb(),
  'Dino Crisis': dlcDinoCrisis.createEnemiesDb(),
  'The Matrix': dlcTheMatrix.createEnemiesDb(),
  'Stargate': dlcStargate.createEnemiesDb(),
  'Half-Life': dlcHalfLife.createEnemiesDb(),
  'Portal': dlcPortal.createEnemiesDb(),
  'Metal Gear': dlcMetalGear.createEnemiesDb(),
  'Payday': dlcPayday.createEnemiesDb(),
  'Vocaloid': dlcVocaloid.createEnemiesDb(),
  'Yu-Gi-Oh': dlcYuGiOh.createEnemiesDb(),
  'Guilty Gear': dlcGuiltyGear.createEnemiesDb(),
  'BlazBlue': dlcBlazBlue.createEnemiesDb(),
  'Slender Man': dlcSlenderMan.createEnemiesDb(),
  'Chucky': dlcChucky.createEnemiesDb(),
  'Hellraiser': dlcHellraiser.createEnemiesDb(),
  'Mass Effect': dlcMassEffect.createEnemiesDb(),
  'Fallout': dlcFallout.createEnemiesDb(),
  'Doom': dlcDoom.createEnemiesDb(),
  'Unreal': dlcUnreal.createEnemiesDb(),

  // --- NEW 13 UNIVERSES DATABASE ---
  'Harry Potter': dlcHarryPotter.createEnemiesDb(),
  'Star Wars': dlcStarWars.createEnemiesDb(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createEnemiesDb(),
  'Scary Movie': dlcScaryMovie.createEnemiesDb(),
  'Dead Space': dlcDeadSpace.createEnemiesDb(),
  'Rick & Morty': dlcRickMorty.createEnemiesDb(),
  'Digital Circus': dlcDigitalCircus.createEnemiesDb(),
  'Digimon': dlcDigimon.createEnemiesDb(),
  'Saw': dlcSaw.createEnemiesDb(),
  'Rosario + Vampire': dlcRosarioVampire.createEnemiesDb(),
  'Negima': dlcNegima.createEnemiesDb(),
  'Ghost in the Shell': dlcGhostInTheShell.createEnemiesDb(),
  'Mad Max': dlcMadMax.createEnemiesDb()
};

const cloneEnemyRoster = roster => ({
  ...roster,
  monsters: [...(roster.monsters || [])],
  bosses: [...(roster.bosses || [])],
  trials: [...(roster.trials || [])]
});

const ensureMutableEnemyRoster = (target, universe) => {
  const roster = target[universe];
  if (roster && roster === EXPANDED_ENEMIES_DB[universe]) {
    target[universe] = cloneEnemyRoster(roster);
  }
  return target[universe];
};

Object.assign(ENEMIES_DB, EXPANDED_ENEMIES_DB);

// Legacy policy-only universes used invented performers, proxies or system
// cores as enemies. Their historical stages now run through Trial mode, while
// legitimate film adversaries (for example the Mangalores) remain selectable.
const BASE_NON_COMBAT_POLICY_ALIASES = Object.freeze([
  'Vocaloid',
  'Slender Man',
  'Digital Circus',
  'Le Cinquième Element'
]);

const CANON_ENEMY_EXPANSION = {
  'Gears of War': dlcGearsOfWar.createCanonEnemyExpansion(),
  Halo: dlcHalo.createCanonEnemyExpansion(),
  Alien: dlcAlien.createCanonEnemyExpansion(),
  Predator: dlcPredator.createCanonEnemyExpansion(),
  'Resident Evil': dlcResidentEvil.createCanonEnemyExpansion(),
  'Silent Hill': dlcSilentHill.createCanonEnemyExpansion(),
  'Dino Crisis': dlcDinoCrisis.createCanonEnemyExpansion(),
  'The Matrix': dlcTheMatrix.createCanonEnemyExpansion(),
  Stargate: dlcStargate.createCanonEnemyExpansion(),
  'Half-Life': dlcHalfLife.createCanonEnemyExpansion(),
  Portal: dlcPortal.createCanonEnemyExpansion(),
  'Metal Gear': dlcMetalGear.createCanonEnemyExpansion(),
  'Mass Effect': dlcMassEffect.createCanonEnemyExpansion(),
  Doom: dlcDoom.createCanonEnemyExpansion(),
  'Dead Space': dlcDeadSpace.createCanonEnemyExpansion(),
  'Star Wars': dlcStarWars.createCanonEnemyExpansion(),
  'Harry Potter': dlcHarryPotter.createCanonEnemyExpansion(),
  'Yu-Gi-Oh': dlcYuGiOh.createCanonEnemyExpansion(),
  Discworld: dlcDiscworld.createCanonEnemyExpansion(),
  Kaamelott: dlcKaamelott.createCanonEnemyExpansion(),
  'Dungeon Meshi': dlcDungeonMeshi.createCanonEnemyExpansion(),
  'Final Fantasy VII': dlcFinalFantasyVII.createCanonEnemyExpansion(),
  Ghostbusters: dlcGhostbusters.createCanonEnemyExpansion(),
  'The Simpsons': dlcTheSimpsons.createCanonEnemyExpansion(),
  Futurama: dlcFuturama.createCanonEnemyExpansion(),
  'Team Fortress 2': dlcTeamFortress2.createCanonEnemyExpansion(),
  'Left 4 Dead': dlcLeft4Dead.createCanonEnemyExpansion()
};

const normalizeThreatName = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const mergeEnemyExpansion = (target, additions = {}) => {
  Object.entries(additions).forEach(([universe, data]) => {
    if (CANON_ROSTER_RUNTIME_UNIVERSES.has(universe)) return;
    const existingRoster = target[universe];
    if (
      existingRoster?.finalePolicy
      && existingRoster.monsters?.length === 0
      && existingRoster.bosses?.length === 0
      && !existingRoster.worldBoss
    ) return;
    if (!target[universe]) {
      target[universe] = { monsters: [], bosses: [], worldBoss: data.worldBoss || null };
    }

    const current = target[universe];
    const knownNames = new Set([
      ...(current.monsters || []),
      ...(current.bosses || []),
      ...(current.trials || []),
      current.worldBoss
    ].filter(Boolean).map(item => normalizeThreatName(item.name)));
    const uniqueIncoming = incoming => incoming.filter(item => {
      const normalizedName = normalizeThreatName(item?.name);
      if (!normalizedName || knownNames.has(normalizedName)) return false;
      knownNames.add(normalizedName);
      return true;
    });
    // Bosses take precedence over regular enemies inside an expansion. Existing
    // runtime roles (including trials and world bosses) always keep ownership.
    const pendingBosses = uniqueIncoming(Array.isArray(data?.bosses) ? data.bosses : []);
    const pendingMonsters = uniqueIncoming(Array.isArray(data?.monsters) ? data.monsters : []);
    const pendingByKind = {
      monsters: pendingMonsters,
      bosses: pendingBosses
    };
    const shouldSetWorldBoss = (
      !target[universe].worldBoss
      && !target[universe].finalePolicy
      && Boolean(data.worldBoss)
    );
    if (
      pendingByKind.monsters.length === 0
      && pendingByKind.bosses.length === 0
      && !shouldSetWorldBoss
    ) return;

    const mutableRoster = ensureMutableEnemyRoster(target, universe);
    ['monsters', 'bosses'].forEach(kind => {
      if (!Array.isArray(mutableRoster[kind])) mutableRoster[kind] = [];
      mutableRoster[kind].push(...pendingByKind[kind]);
    });
    if (shouldSetWorldBoss) {
      mutableRoster.worldBoss = data.worldBoss;
    }
  });
};

mergeEnemyExpansion(ENEMIES_DB, CANON_ENEMY_EXPANSION);
mergeEnemyExpansion(ENEMIES_DB, LORE_ACCURATE_ENEMY_EXPANSIONS);

new Set([...Object.keys(ENEMIES_DB), ...BASE_NON_COMBAT_POLICY_ALIASES]).forEach(universe => {
  const currentRoster = ENEMIES_DB[universe];
  const finalePolicy = currentRoster?.finalePolicy || getResolvedLoreWorldBossPolicy(universe);
  if (!currentRoster || !finalePolicy) return;
  const clearCombatRoster = shouldClearCombatRosterForPolicy(universe);
  const requiresMutation = (
    currentRoster.finalePolicy !== finalePolicy
    || currentRoster.worldBoss !== null
    || (clearCombatRoster && (
      currentRoster.monsters?.length > 0
      || currentRoster.bosses?.length > 0
    ))
  );
  if (!requiresMutation) return;

  const mutableRoster = ensureMutableEnemyRoster(ENEMIES_DB, universe);
  mutableRoster.finalePolicy = finalePolicy;
  mutableRoster.worldBoss = null;
  if (clearCombatRoster) {
    mutableRoster.monsters = [];
    mutableRoster.bosses = [];
  }
});

// Final game boss (The final breach singularity core)
export const FINAL_GAME_BOSS = {
  name: 'Breach Singularity Core',
  hp: 2000,
  atk: 40,
  spd: 4,
  color: '#8e44ad',
  weapon: 'laser',
  special: 'Cosmic Shatter Glitch Wave'
};

export const getMonstersForUniverse = (univ) => ENEMIES_DB[univ]?.monsters || ENEMIES_DB['Halo'].monsters;
export const getBossesForUniverse = (univ) => ENEMIES_DB[univ]?.bosses || ENEMIES_DB['Halo'].bosses;
export const getWorldBossForUniverse = (univ) => (
  Object.prototype.hasOwnProperty.call(ENEMIES_DB, univ)
    ? ENEMIES_DB[univ].worldBoss ?? null
    : ENEMIES_DB['Halo'].worldBoss
);
export const getFinalePolicyForUniverse = (univ) => ENEMIES_DB[univ]?.finalePolicy || null;
export const getFinalGameBoss = () => FINAL_GAME_BOSS;
export const getEnemiesForUniverse = (univ) => ({
  enemy: ENEMIES_DB[univ]?.monsters[0] || ENEMIES_DB['Halo'].monsters[0],
  boss: ENEMIES_DB[univ]?.bosses[0] || ENEMIES_DB['Halo'].bosses[0]
});

export const OBSTACLES_DB = [
  { name: 'COG Cover', hp: 80, color: '#4a4e52', type: 'barrier' },
  { name: 'Naquadah Barrel', hp: 30, color: '#00ff00', type: 'barrel' }
];
