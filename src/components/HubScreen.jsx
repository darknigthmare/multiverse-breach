import React, { useState } from 'react';
import { HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB, SYNERGIES_DB } from '../game/heroes';
import { getTranslation } from '../game/translation';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import sound from '../game/soundEngine';
import { CORE_CODEX_ENTRIES, LORE_DB, NARRATIVE_ACTS } from '../game/lore';
import { ENEMIES_DB, getFinalGameBoss } from '../game/enemies';
import { EXPANDED_EVENT_SHOP_ITEMS, EXPANDED_FACTION_UNIVERSES, EXPANDED_STAGE_ID_BY_UNIVERSE, getExpandedStages } from '../game/expandedUniverses';
import { getCharacterPlaque } from '../game/characterPlaques';

export default function HubScreen({
  lang,
  gold, setGold,
  breachShards, setBreachShards,
  eventTokens, setEventTokens,
  unlockedHeroes,
  heroLevels, setHeroLevels,
  activeTeam, setActiveTeam,
  completedStages,
  inventory, setInventory,
  equippedGear, setEquippedGear,
  equippedEventItems, setEquippedEventItems,
  heroTalents, setHeroTalents,
  onLaunchStage,
  onGoToPortal
}) {
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' | 'roster' | 'party' | 'inventory' | 'shop'
  const [selectedHeroId, setSelectedHeroId] = useState(unlockedHeroes[0]);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'game' | 'movie' | 'manga' | 'music'
  const [missionModeFilter, setMissionModeFilter] = useState('all'); // 'all' | 'RPG' | 'Tactics' | 'Smash'
  const [missionSeed, setMissionSeed] = useState(() => Date.now());
  const [showMissionArchive, setShowMissionArchive] = useState(false);
  const [briefingStageId, setBriefingStageId] = useState(null);
  const [nexusMessage, setNexusMessage] = useState(null);
  const collectionBonusCount = inventory.filter(itemId => itemId.startsWith('collection_reward_')).length;

  const BREACH_MODIFIERS = [
    {
      id: 'gravity',
      name: { fr: 'Gravité instable', en: 'Unstable Gravity' },
      desc: { fr: 'Les ennemis frappent plus fort, mais les récompenses montent.', en: 'Enemies hit harder, but rewards are higher.' },
      enemyAtk: 1.12,
      reward: 1.15,
      color: '#f39c12'
    },
    {
      id: 'boss_rage',
      name: { fr: 'Boss enragé', en: 'Enraged Boss' },
      desc: { fr: 'Le boss gagne des PV et charge plus vite ses attaques.', en: 'The boss gains HP and pressures the squad harder.' },
      bossHp: 1.18,
      reward: 1.25,
      color: '#e74c3c'
    },
    {
      id: 'naquadah',
      name: { fr: 'Résonance Naquadah', en: 'Naquadah Resonance' },
      desc: { fr: 'Les héros gagnent un léger bonus défensif.', en: 'Heroes gain a small defensive boost.' },
      heroDef: 1.1,
      reward: 1,
      color: '#39c5bb'
    },
    {
      id: 'thin_rift',
      name: { fr: 'Faille mince', en: 'Thin Rift' },
      desc: { fr: 'Les ennemis sont plus rapides, les Fragments augmentent.', en: 'Enemies move faster, breach Shards increase.' },
      enemySpd: 1.12,
      reward: 1.18,
      color: '#9b59b6'
    }
  ];

  const DAILY_CONTRACTS = [
    { id: 'rpg', mode: 'RPG', focus: 'ATB', text: { fr: 'Stabiliser une faille RPG', en: 'Stabilize one RPG breach' } },
    { id: 'tactics', mode: 'Tactics', focus: 'GRID', text: { fr: 'Gagner une mission tactique', en: 'Win one tactics mission' } },
    { id: 'smash', mode: 'Smash', focus: 'BURST', text: { fr: 'Fermer une brèche Smash', en: 'Close one Smash breach' } },
    { id: 'codex', mode: 'any', focus: 'LORE', text: { fr: 'Décrypter un nouveau boss dans le codex', en: 'Decrypt a new boss codex entry' } }
  ];

  const FACTION_RULES = [
    { id: 'sci_fi', stat: 'hp', label: 'Sci-Fi Marines', universes: ['Halo', 'Gears of War', 'Mass Effect', 'Stargate', 'Alien', 'Predator', ...EXPANDED_FACTION_UNIVERSES.sciFi], bonus: '+8% HP' },
    { id: 'horror', stat: 'atk', label: 'Horreur cosmique', universes: ['Silent Hill', 'Resident Evil', 'Dead Space', 'Hellraiser', 'Saw', ...EXPANDED_FACTION_UNIVERSES.horror], bonus: '+8% ATK' },
    { id: 'cyber', stat: 'spd', label: 'IA & Cyber', universes: ['The Matrix', 'Portal', 'Ghost in the Shell', 'Digital Circus', ...EXPANDED_FACTION_UNIVERSES.cyber], bonus: '+8% SPD' },
    { id: 'arcane', stat: 'def', label: 'Mages & Occulte', universes: ['Harry Potter', 'Yu-Gi-Oh', 'Negima', 'Rosario + Vampire', 'BlazBlue', ...EXPANDED_FACTION_UNIVERSES.arcane], bonus: '+8% DEF' }
  ];

  const LOOT_RARITIES = [
    { id: 'common', label: 'Commun', color: '#9aa0a6', threshold: 0 },
    { id: 'rare', label: 'Rare', color: '#3498db', threshold: 8 },
    { id: 'epic', label: 'Epique', color: '#9b59b6', threshold: 14 },
    { id: 'legendary', label: 'Legendaire', color: '#f1c40f', threshold: 18 },
    { id: 'anomaly', label: 'Anomalie', color: '#ff4500', threshold: 24 }
  ];

  // List of 37 stages (one per universe) + 1 final boss stage
  const STAGES = [
    { id: 1, name: 'Asphix Locust Outpost', universe: 'Gears of War', mode: 'RPG', difficulty: 'Easy', goldPrize: 40, shardPrize: 15, bossName: 'Brumak' },
    { id: 2, name: 'Installation 04 Ring', universe: 'Halo', mode: 'Tactics', difficulty: 'Easy', goldPrize: 40, shardPrize: 15, bossName: 'Scarab Mech' },
    { id: 3, name: 'LV-426 Colony Hive', universe: 'Alien', mode: 'Smash', difficulty: 'Easy', goldPrize: 45, shardPrize: 15, bossName: 'Predalien' },
    { id: 4, name: 'Val Verde Jungle Temple', universe: 'Predator', mode: 'RPG', difficulty: 'Easy', goldPrize: 50, shardPrize: 20, bossName: 'Bad Blood Alpha' },
    { id: 5, name: 'Raccoon City Police Dept', universe: 'Resident Evil', mode: 'Tactics', difficulty: 'Easy', goldPrize: 50, shardPrize: 20, bossName: 'Super Tyrant' },
    { id: 6, name: 'Toluca Lake Fog Sector', universe: 'Silent Hill', mode: 'RPG', difficulty: 'Medium', goldPrize: 60, shardPrize: 20, bossName: 'The God' },
    { id: 7, name: 'Ibis Dinosaur Facility', universe: 'Dino Crisis', mode: 'Smash', difficulty: 'Medium', goldPrize: 65, shardPrize: 25, bossName: 'Spinosaurus' },
    { id: 8, name: 'Zion Digital Pipeline', universe: 'The Matrix', mode: 'Tactics', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Deus Ex Machina' },
    { id: 9, name: 'Abydos Pyramids Breach', universe: 'Stargate', mode: 'RPG', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Anubis Flagship Nexus' },
    { id: 10, name: 'Anomalous Materials Lab', universe: 'Half-Life', mode: 'Smash', difficulty: 'Medium', goldPrize: 75, shardPrize: 25, bossName: 'Combine Strider' },
    { id: 11, name: 'Aperture Enrichment Center', universe: 'Portal', mode: 'RPG', difficulty: 'Medium', goldPrize: 80, shardPrize: 30, bossName: 'Central AI' },
    { id: 12, name: 'Shadow Moses Warehouse', universe: 'Metal Gear', mode: 'Tactics', difficulty: 'Hard', goldPrize: 90, shardPrize: 30, bossName: 'Metal Gear RAY' },
    { id: 13, name: 'First World Bank Vault', universe: 'Payday', mode: 'Smash', difficulty: 'Hard', goldPrize: 95, shardPrize: 30, bossName: 'SWAT Turret Van' },
    { id: 14, name: 'Neon Shibuya Stage', universe: 'Vocaloid', mode: 'RPG', difficulty: 'Hard', goldPrize: 100, shardPrize: 35, bossName: 'Stage Core' },
    { id: 15, name: 'Dominos Duel Arena', universe: 'Yu-Gi-Oh', mode: 'Tactics', difficulty: 'Hard', goldPrize: 110, shardPrize: 35, bossName: 'Obelisk Tormentor' },
    { id: 16, name: 'Babylon Gear Engine', universe: 'Guilty Gear', mode: 'Smash', difficulty: 'Hard', goldPrize: 120, shardPrize: 40, bossName: 'Megadeath Gear' },
    { id: 17, name: 'Kagutsuchi Hierarchical City', universe: 'BlazBlue', mode: 'RPG', difficulty: 'Hard', goldPrize: 125, shardPrize: 40, bossName: 'Mu-12 Core' },
    { id: 18, name: 'Black Forest Page Rift', universe: 'Slender Man', mode: 'Tactics', difficulty: 'Hard', goldPrize: 130, shardPrize: 40, bossName: 'Woods Nexus' },
    { id: 19, name: 'Good Guy Toy Warehouse', universe: 'Chucky', mode: 'Smash', difficulty: 'Hard', goldPrize: 140, shardPrize: 45, bossName: 'Assembly Core' },
    { id: 20, name: 'Labyrinth Cenobite Chamber', universe: 'Hellraiser', mode: 'RPG', difficulty: 'Very Hard', goldPrize: 150, shardPrize: 45, bossName: 'Leviathan God' },
    { id: 21, name: 'Citadel Presidium Hub', universe: 'Mass Effect', mode: 'Tactics', difficulty: 'Very Hard', goldPrize: 160, shardPrize: 50, bossName: 'Human-Reaper Larva' },
    { id: 22, name: 'New Vegas Strip Breach', universe: 'Fallout', mode: 'Smash', difficulty: 'Very Hard', goldPrize: 170, shardPrize: 50, bossName: 'Liberty Prime' },
    { id: 23, name: 'Nekravol Argent Tower', universe: 'Doom', mode: 'RPG', difficulty: 'Expert', goldPrize: 200, shardPrize: 60, bossName: 'Icon of Sin' },
    { id: 24, name: 'Liandri Tournament Grid', universe: 'Unreal', mode: 'Tactics', difficulty: 'Expert', goldPrize: 220, shardPrize: 70, bossName: 'Skaarj Warlord' },
    
    // --- NEW 13 STAGES ---
    { id: 25, name: 'Hogwarts Great Hall Breach', universe: 'Harry Potter', mode: 'RPG', difficulty: 'Easy', goldPrize: 45, shardPrize: 15, bossName: 'Lord Voldemort' },
    { id: 26, name: 'Death Star Trench Corridor', universe: 'Star Wars', mode: 'Smash', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Darth Vader' },
    { id: 27, name: 'Fhloston Paradise Cruise', universe: 'Le Cinquième Element', mode: 'Tactics', difficulty: 'Medium', goldPrize: 75, shardPrize: 25, bossName: 'The Ultimate Evil' },
    { id: 30, name: 'Rick\'s Garage Laboratory', universe: 'Rick & Morty', mode: 'Smash', difficulty: 'Hard', goldPrize: 110, shardPrize: 35, bossName: 'Federal Prison AI Core' },
    { id: 28, name: 'Cindy\'s Haunted Living Room', universe: 'Scary Movie', mode: 'RPG', difficulty: 'Medium', goldPrize: 60, shardPrize: 20, bossName: 'Ghostface Wassup Slasher' },
    { id: 29, name: 'USG Ishimura Mining Deck', universe: 'Dead Space', mode: 'Tactics', difficulty: 'Hard', goldPrize: 100, shardPrize: 30, bossName: 'Giant Hive Mind' },
    { id: 31, name: 'Digital Tent Theater', universe: 'Digital Circus', mode: 'RPG', difficulty: 'Medium', goldPrize: 65, shardPrize: 20, bossName: 'Caine Ringmaster AI' },
    { id: 32, name: 'File Island Binary Field', universe: 'Digimon', mode: 'Tactics', difficulty: 'Hard', goldPrize: 115, shardPrize: 35, bossName: 'Apocalymon Void Core' },
    { id: 33, name: 'Nerve Gas Bathroom Dungeon', universe: 'Saw', mode: 'Smash', difficulty: 'Hard', goldPrize: 100, shardPrize: 30, bossName: 'Jigsaw Classroom Trap Hub' },
    { id: 34, name: 'Yokai Academy Courtyard', universe: 'Rosario + Vampire', mode: 'RPG', difficulty: 'Hard', goldPrize: 120, shardPrize: 40, bossName: 'Alucard Dragon Colossus' },
    { id: 35, name: 'Mahora Academy Tree Breach', universe: 'Negima', mode: 'Tactics', difficulty: 'Hard', goldPrize: 125, shardPrize: 40, bossName: 'Mage of the Beginning God' },
    { id: 36, name: 'New Port City Network Node', universe: 'Ghost in the Shell', mode: 'Smash', difficulty: 'Hard', goldPrize: 130, shardPrize: 40, bossName: 'Think Tank Tachikoma Core' },
    { id: 37, name: 'Fury Road Desert Outpost', universe: 'Mad Max', mode: 'RPG', difficulty: 'Very Hard', goldPrize: 155, shardPrize: 45, bossName: 'The Gigahorse Interceptor Rig' },
    
    // 38th final stage
    { id: 38, name: 'Final Omniverse Singularity', universe: 'Matrix', mode: 'RPG', difficulty: 'Final World Boss', goldPrize: 500, shardPrize: 150, bossName: 'Breach Singularity Core' }
  ];
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...getExpandedStages());
  const NORMAL_STAGE_COUNT = STAGES.filter(stage => stage.id !== 38).length;
  const TOTAL_UNIVERSE_COUNT = Object.keys(LORE_DB).length;
  const FINAL_STAGE_REQUIRED_CLEARS = Math.max(18, Math.ceil(NORMAL_STAGE_COUNT * 0.45));
  const META_RANK_THRESHOLDS = {
    strike: Math.max(8, Math.ceil(NORMAL_STAGE_COUNT * 0.15)),
    veteran: Math.max(16, Math.ceil(NORMAL_STAGE_COUNT * 0.4)),
    omega: Math.max(24, Math.ceil(NORMAL_STAGE_COUNT * 0.65))
  };

  const STORY_CHAPTERS = [
    {
      id: 'first_lock',
      unlockClears: 0,
      name: { fr: 'Chapitre I - Premier verrou', en: 'Chapter I - First Lock' },
      desc: {
        fr: 'Les premieres breches sont instables mais lisibles. Le reseau cherche des mondes-pivots pour trianguler la Singularity.',
        en: 'The first breaches are unstable but readable. The network searches for anchor worlds to triangulate the Singularity.'
      },
      focus: { fr: 'Ouvrir les paliers Medium et Hard.', en: 'Open Medium and Hard tiers.' }
    },
    {
      id: 'faction_war',
      unlockClears: 6,
      name: { fr: 'Chapitre II - Guerre des signatures', en: 'Chapter II - Signature War' },
      desc: {
        fr: 'Les univers ne fuient plus seuls: des familles de breches commencent a resonner entre elles.',
        en: 'Worlds no longer leak alone: families of breaches begin resonating with each other.'
      },
      focus: { fr: 'Composer des equipes par faction et decrypter les boss locaux.', en: 'Build faction teams and decrypt local bosses.' }
    },
    {
      id: 'deep_archive',
      unlockClears: 12,
      name: { fr: 'Chapitre III - Archives profondes', en: 'Chapter III - Deep Archives' },
      desc: {
        fr: 'Les failles anciennes revelent des variantes de films, sagas et lignes temporelles qui se contredisent.',
        en: 'Older breaches reveal movie variants, sagas, and timelines that contradict each other.'
      },
      focus: { fr: 'Finir des collections de franchise pour gagner des caches.', en: 'Complete franchise collections to earn caches.' }
    },
    {
      id: 'singularity_wake',
      unlockClears: 20,
      name: { fr: 'Chapitre IV - Eveil de la Singularity', en: 'Chapter IV - Singularity Wake' },
      desc: {
        fr: 'Le noyau final absorbe les patterns de chasse, d horreur, de magie et de scene musicale.',
        en: 'The final core absorbs hunt, horror, magic, and music-stage patterns.'
      },
      focus: { fr: 'Stabiliser assez de breches pour forcer l ouverture finale.', en: 'Stabilize enough breaches to force the final opening.' }
    },
    {
      id: 'omniverse_endgame',
      unlockClears: FINAL_STAGE_REQUIRED_CLEARS,
      name: { fr: 'Chapitre V - Noyau Omniverse', en: 'Chapter V - Omniverse Core' },
      desc: {
        fr: 'Les archives convergent: chaque monde stabilise retire une couche de defense au Breach Singularity Core.',
        en: 'The archives converge: every stabilized world strips a defensive layer from the Breach Singularity Core.'
      },
      focus: { fr: 'Optimiser reliques, synergies et objets evenementiels.', en: 'Optimize relics, synergies, and event items.' }
    }
  ];

  const NARRATIVE_ARCS = [
    {
      id: 'xeno_yautja_war',
      color: '#7ee8dc',
      title: { fr: 'Guerre Xeno-Yautja', en: 'Xeno-Yautja War' },
      premise: {
        fr: 'Weyland-Yutani, les ruches xenomorphes et les clans Yautja contaminent les memes coordonnees de chasse.',
        en: 'Weyland-Yutani, xenomorph hives, and Yautja clans contaminate the same hunting coordinates.'
      },
      universes: ['Alien', 'Aliens', 'Alien 3', 'Alien Resurrection', 'Prometheus', 'Alien: Covenant', 'Alien: Romulus', 'Predator', 'Predator 2', 'Predators', 'The Predator', 'Prey', 'Predator: Killer of Killers', 'Predator: Badlands', 'Alien vs Predator', 'Aliens vs Predator: Requiem'],
      reward: { fr: 'Cache acide/plasma', en: 'Acid/plasma cache' }
    },
    {
      id: 'dark_gotham',
      color: '#d63b3b',
      title: { fr: 'Noeud Gotham noir', en: 'Dark Gotham Node' },
      premise: {
        fr: 'Les variantes Joker et Batman contaminent la logique morale des failles avec du metal noir et des toxines.',
        en: 'Joker and Batman variants corrupt breach morality with dark metal and toxins.'
      },
      universes: ['Joker New 52', 'The Batman Who Laughs'],
      reward: { fr: 'Intel peur/critique', en: 'Fear/crit intel' }
    },
    {
      id: 'stage_resonance',
      color: '#f1c40f',
      title: { fr: 'Resonance de scene', en: 'Stage Resonance' },
      premise: {
        fr: 'Les groupes et univers musicaux transforment les failles en arene rythmique et amplifient les anomalies.',
        en: 'Bands and music worlds turn breaches into rhythm arenas and amplify anomalies.'
      },
      universes: ['Vocaloid', 'Rammstein', 'System of a Down', 'Rob Zombie', 'Daft Punk', 'Oliver Tree'],
      reward: { fr: 'Bonus tempo et vitesse', en: 'Tempo and speed bonus' }
    },
    {
      id: 'arcane_paradox',
      color: '#d9b86b',
      title: { fr: 'Paradoxe arcane', en: 'Arcane Paradox' },
      premise: {
        fr: 'Magie absurde, quete du Graal, donjons et MMORPG francais se branchent sur les memes runes de stabilisation.',
        en: 'Absurd magic, Grail quests, dungeons, and French MMORPG codes connect to the same stabilization runes.'
      },
      universes: ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire'],
      reward: { fr: 'Cache rune et defense', en: 'Rune and defense cache' }
    },
    {
      id: 'hell_circus',
      color: '#ff5b6e',
      title: { fr: 'Cabaret infernal', en: 'Infernal Cabaret' },
      premise: {
        fr: 'Hazbin Hotel, Digital Circus et les univers d horreur transforment la redemption en spectacle de breche.',
        en: 'Hazbin Hotel, Digital Circus, and horror worlds turn redemption into breach theater.'
      },
      universes: ['Hazbin Hotel', 'Digital Circus', 'Hellraiser', 'Saw', 'Chucky', 'Silent Hill', 'Scary Movie'],
      reward: { fr: 'Cache controle et peur', en: 'Control and fear cache' }
    },
    {
      id: 'frontline_sci_fi',
      color: '#63d7ff',
      title: { fr: 'Front militaire sci-fi', en: 'Sci-Fi Military Front' },
      premise: {
        fr: 'Les soldats, pilotes, commandants et explorateurs spatiaux forment la ligne de defense principale contre le noyau.',
        en: 'Soldiers, pilots, commanders, and space explorers form the main defensive line against the core.'
      },
      universes: ['Gears of War', 'Halo', 'Stargate', 'Mass Effect', 'Star Wars', 'Le Cinquième Element'],
      reward: { fr: 'Cache tactique et blindage', en: 'Tactical and armor cache' }
    },
    {
      id: 'containment_labs',
      color: '#65d7de',
      title: { fr: 'Protocoles de confinement', en: 'Containment Protocols' },
      premise: {
        fr: 'Laboratoires, stations et incidents biologiques imposent une logique de survie, d isolement et de purge.',
        en: 'Labs, stations, and biological incidents force survival, isolation, and purge logic.'
      },
      universes: ['Resident Evil', 'Dino Crisis', 'Dead Space', 'Half-Life', 'Portal'],
      reward: { fr: 'Cache laboratoire et purge', en: 'Laboratory and purge cache' }
    },
    {
      id: 'cyber_reality',
      color: '#41ffac',
      title: { fr: 'Realites codees', en: 'Coded Realities' },
      premise: {
        fr: 'IA, realites virtuelles, cybercerveaux et mondes digitaux prouvent que la breche peut aussi corrompre le code.',
        en: 'AI, virtual realities, cyberbrains, and digital worlds prove the breach can also corrupt code.'
      },
      universes: ['The Matrix', 'Ghost in the Shell', 'Rick & Morty', 'Digimon'],
      reward: { fr: 'Cache cyber et vitesse', en: 'Cyber and speed cache' }
    },
    {
      id: 'duel_and_arena',
      color: '#e67e22',
      title: { fr: 'Duel, tournoi et braquage', en: 'Duel, Tournament, and Heist' },
      premise: {
        fr: 'Infiltration, cartes, arènes et braquages transforment les breches en defis de precision.',
        en: 'Infiltration, cards, arenas, and heists turn breaches into precision challenges.'
      },
      universes: ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'],
      reward: { fr: 'Cache technique et critique', en: 'Technique and critical cache' }
    },
    {
      id: 'wasteland_hellfront',
      color: '#ff4f2b',
      title: { fr: 'Front enfer et wasteland', en: 'Hell and Wasteland Front' },
      premise: {
        fr: 'Les mondes ruines, infernaux et motorises testent la capacite du reseau a survivre sans structure.',
        en: 'Ruined, hellish, and motorized worlds test whether the network can survive without structure.'
      },
      universes: ['Fallout', 'Doom', 'Mad Max'],
      reward: { fr: 'Cache apocalypse', en: 'Apocalypse cache' }
    },
    {
      id: 'urban_legends',
      color: '#cbd8c8',
      title: { fr: 'Legendes et icones d horreur', en: 'Horror Icons and Legends' },
      premise: {
        fr: 'Entites, tueurs, jeux pieges et cauchemars donnent au Multivers ses signatures de peur les plus lisibles.',
        en: 'Entities, killers, traps, and nightmares give the Multiverse its clearest fear signatures.'
      },
      universes: ['Slender Man', 'Resident Evil', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Scary Movie'],
      reward: { fr: 'Cache peur et controle', en: 'Fear and control cache' }
    }
  ];

  const COLLECTION_REWARDS = [
    {
      id: 'alien_saga',
      title: { fr: 'Saga Alien complete', en: 'Complete Alien Saga' },
      universes: ['Alien', 'Aliens', 'Alien 3', 'Alien Resurrection', 'Prometheus', 'Alien: Covenant', 'Alien: Romulus'],
      reward: { gold: 650, shards: 120, tokens: 4 },
      bonus: { fr: 'Cache Weyland-Yutani: ressources, Fragments et Jetons.', en: 'Weyland-Yutani cache: resources, Shards, and Tokens.' }
    },
    {
      id: 'predator_hunts',
      title: { fr: 'Chasses Predator completees', en: 'Completed Predator Hunts' },
      universes: ['Predator', 'Predator 2', 'Predators', 'The Predator', 'Prey', 'Predator: Killer of Killers', 'Predator: Badlands'],
      reward: { gold: 620, shards: 105, tokens: 4 },
      bonus: { fr: 'Cache Yautja: prime de chasse et trophees.', en: 'Yautja cache: hunt bounty and trophies.' }
    },
    {
      id: 'avp_crossfire',
      title: { fr: 'Croisement AVP verrouille', en: 'AVP Crossfire Locked' },
      universes: ['Alien vs Predator', 'Aliens vs Predator: Requiem'],
      reward: { gold: 280, shards: 60, tokens: 3 },
      bonus: { fr: 'Cache pyramide: bonus court mais intense.', en: 'Pyramid cache: short but intense bonus.' }
    },
    {
      id: 'music_wave',
      title: { fr: 'Onde musicale stabilisee', en: 'Stabilized Music Wave' },
      universes: ['Rammstein', 'System of a Down', 'Rob Zombie', 'Daft Punk', 'Oliver Tree', 'Vocaloid'],
      reward: { gold: 520, shards: 90, tokens: 3 },
      bonus: { fr: 'Cache backstage: tempo, Fragments et Jetons.', en: 'Backstage cache: tempo, Shards, and Tokens.' }
    },
    {
      id: 'arcane_table',
      title: { fr: 'Table arcane reunie', en: 'Arcane Table Reunited' },
      universes: ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire'],
      reward: { gold: 420, shards: 85, tokens: 3 },
      bonus: { fr: 'Cache grimoire: stabilisation magique durable.', en: 'Grimoire cache: durable magical stabilization.' }
    },
    {
      id: 'dark_stage',
      title: { fr: 'Scene sombre controlee', en: 'Dark Stage Controlled' },
      universes: ['Joker New 52', 'The Batman Who Laughs', 'Hazbin Hotel', 'Digital Circus'],
      reward: { gold: 430, shards: 80, tokens: 3 },
      bonus: { fr: 'Cache theatre noir: controle, peur et anomalie.', en: 'Dark theater cache: control, fear, and anomaly.' }
    },
    {
      id: 'sci_fi_command',
      title: { fr: 'Commandement sci-fi', en: 'Sci-Fi Command' },
      universes: ['Gears of War', 'Halo', 'Stargate', 'Mass Effect', 'Star Wars', 'Le Cinquième Element'],
      reward: { gold: 600, shards: 110, tokens: 4 },
      bonus: { fr: 'Cache commandement: ressources lourdes et fragments.', en: 'Command cache: heavy resources and fragments.' }
    },
    {
      id: 'containment_protocol',
      title: { fr: 'Confinement biologique', en: 'Biological Containment' },
      universes: ['Resident Evil', 'Dino Crisis', 'Dead Space', 'Half-Life', 'Portal'],
      reward: { gold: 520, shards: 95, tokens: 3 },
      bonus: { fr: 'Cache confinement: bonus de survie et purge.', en: 'Containment cache: survival and purge bonus.' }
    },
    {
      id: 'coded_realities',
      title: { fr: 'Realites codees', en: 'Coded Realities' },
      universes: ['The Matrix', 'Ghost in the Shell', 'Rick & Morty', 'Digimon'],
      reward: { gold: 460, shards: 85, tokens: 3 },
      bonus: { fr: 'Cache code: vitesse, hack et stabilisation digitale.', en: 'Code cache: speed, hacking, and digital stabilization.' }
    },
    {
      id: 'arena_specialists',
      title: { fr: 'Specialistes d arene', en: 'Arena Specialists' },
      universes: ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'],
      reward: { gold: 560, shards: 95, tokens: 4 },
      bonus: { fr: 'Cache precision: critique, duel et tactique.', en: 'Precision cache: critical, duel, and tactics.' }
    },
    {
      id: 'apocalypse_front',
      title: { fr: 'Front apocalypse', en: 'Apocalypse Front' },
      universes: ['Fallout', 'Doom', 'Mad Max'],
      reward: { gold: 380, shards: 75, tokens: 3 },
      bonus: { fr: 'Cache apocalypse: violence brute et endurance.', en: 'Apocalypse cache: raw violence and endurance.' }
    },
    {
      id: 'horror_roster',
      title: { fr: 'Registre des icones horrifiques', en: 'Horror Icon Registry' },
      universes: ['Slender Man', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Scary Movie'],
      reward: { gold: 500, shards: 90, tokens: 3 },
      bonus: { fr: 'Cache horreur: peur, controle et anomalies classees.', en: 'Horror cache: fear, control, and classified anomalies.' }
    }
  ];

  const BREACH_TIMELINE = [
    {
      id: 't0',
      unlockClears: 0,
      title: { fr: 'T0 - Detection initiale', en: 'T0 - Initial Detection' },
      text: {
        fr: 'Les premiers mondes servent de balises. Chaque victoire transforme une faille sauvage en coordonnee stable.',
        en: 'The first worlds act as beacons. Each win turns a wild breach into a stable coordinate.'
      }
    },
    {
      id: 't1',
      unlockClears: 6,
      title: { fr: 'T1 - Regroupement par signatures', en: 'T1 - Signature Grouping' },
      text: {
        fr: 'Les univers commencent a se regrouper: science-fiction militaire, horreur, cyber-realite et magie.',
        en: 'Universes begin clustering: military sci-fi, horror, cyber-reality, and magic.'
      }
    },
    {
      id: 't2',
      unlockClears: 12,
      title: { fr: 'T2 - Multiplication des variantes', en: 'T2 - Variant Multiplication' },
      text: {
        fr: 'Les films d une meme franchise ne sont plus des doublons: ce sont des timelines independantes avec leurs propres boss.',
        en: 'Films from the same franchise are no longer duplicates: they are independent timelines with their own bosses.'
      }
    },
    {
      id: 't3',
      unlockClears: 20,
      title: { fr: 'T3 - Resonance culturelle', en: 'T3 - Cultural Resonance' },
      text: {
        fr: 'Les mondes musicaux et comiques prouvent que la Singularity absorbe aussi les codes de scene, de ton et de mythe.',
        en: 'Music and comedy worlds prove the Singularity also absorbs stage, tone, and myth codes.'
      }
    },
    {
      id: 't4',
      unlockClears: FINAL_STAGE_REQUIRED_CLEARS,
      title: { fr: 'T4 - Ouverture du noyau', en: 'T4 - Core Opening' },
      text: {
        fr: 'Assez de coordonnees sont stabilisees pour attaquer le Breach Singularity Core sans perdre le reseau.',
        en: 'Enough coordinates are stabilized to strike the Breach Singularity Core without losing the network.'
      }
    }
  ];

  const UNIVERSE_MODIFIERS = {
    Alien: { id: 'acid_blood', name: { fr: 'Sang acide', en: 'Acid Blood' }, desc: { fr: 'Les ennemis laissent des residus acides: recompenses +20%, boss plus agressif.', en: 'Enemies leave acidic residue: rewards +20%, boss more aggressive.' }, bossHp: 1.08, reward: 1.2, color: '#8adbe6' },
    Aliens: { id: 'sentry_corridor', name: { fr: 'Couloir sentinelle', en: 'Sentry Corridor' }, desc: { fr: 'La ruche attaque en vagues: Fragments +22%, ennemis plus rapides.', en: 'The hive attacks in waves: Shards +22%, enemies faster.' }, enemySpd: 1.1, reward: 1.22, color: '#78e3e6' },
    Prometheus: { id: 'black_pathogen', name: { fr: 'Pathogene noir', en: 'Black Pathogen' }, desc: { fr: 'Le pathogene instabilise les deux camps: boss +12% PV, loot +25%.', en: 'The pathogen destabilizes both sides: boss +12% HP, loot +25%.' }, bossHp: 1.12, reward: 1.25, color: '#78dcd7' },
    Predator: { id: 'honor_hunt', name: { fr: 'Chasse honorable', en: 'Honor Hunt' }, desc: { fr: 'Le duel Yautja valorise les victoires propres: Jetons possibles sur stage pair.', en: 'The Yautja duel values clean victories: possible Tokens on even stages.' }, reward: 1.16, color: '#9bff62' },
    Prey: { id: 'mud_camouflage', name: { fr: 'Camouflage de boue', en: 'Mud Camouflage' }, desc: { fr: 'Les embuscades protegent l escouade: defense +10%, recompense +10%.', en: 'Ambushes protect the squad: defense +10%, reward +10%.' }, heroDef: 1.1, reward: 1.1, color: '#e6af53' },
    'Joker New 52': { id: 'joker_toxin', name: { fr: 'Toxine Joker', en: 'Joker Toxin' }, desc: { fr: 'La panique augmente les degats ennemis et la rarete du loot.', en: 'Panic raises enemy damage and loot rarity.' }, enemyAtk: 1.14, reward: 1.24, color: '#4cdc5e' },
    'The Batman Who Laughs': { id: 'dark_metal', name: { fr: 'Metal noir', en: 'Dark Metal' }, desc: { fr: 'Le Multivers Noir durcit le boss: PV +18%, cache +30%.', en: 'The Dark Multiverse hardens the boss: HP +18%, cache +30%.' }, bossHp: 1.18, reward: 1.3, color: '#d62121' },
    Discworld: { id: 'octarine_leak', name: { fr: 'Fuite octarine', en: 'Octarine Leak' }, desc: { fr: 'La magie absurde plie les regles: Fragments +18%, defense +5%.', en: 'Absurd magic bends rules: Shards +18%, defense +5%.' }, heroDef: 1.05, reward: 1.18, color: '#e7d476' },
    Kaamelott: { id: 'table_dispute', name: { fr: 'Conseil dispute', en: 'Council Dispute' }, desc: { fr: 'Les ordres contradictoires ralentissent le rythme mais augmentent l or.', en: 'Contradictory orders slow the rhythm but increase Gold.' }, reward: 1.17, color: '#d6b465' },
    'Dungeon Meshi': { id: 'monster_cuisine', name: { fr: 'Cuisine de monstre', en: 'Monster Cuisine' }, desc: { fr: 'Chaque combat nourrit l escouade: defense +8%, loot +12%.', en: 'Every fight feeds the squad: defense +8%, loot +12%.' }, heroDef: 1.08, reward: 1.12, color: '#e2c36a' },
    Noob: { id: 'bugged_respawn', name: { fr: 'Respawn bugge', en: 'Bugged Respawn' }, desc: { fr: 'Le code d Olydri deraille: recompenses +20%, ennemis plus rapides.', en: 'Olydri code glitches: rewards +20%, enemies faster.' }, enemySpd: 1.08, reward: 1.2, color: '#6ad5ff' },
    Rammstein: { id: 'feuerzone', name: { fr: 'Feuerzone', en: 'Feuerzone' }, desc: { fr: 'La scene industrielle brule fort: attaque ennemie +10%, Jetons plus rentables.', en: 'The industrial stage burns hard: enemy attack +10%, richer Tokens.' }, enemyAtk: 1.1, reward: 1.2, color: '#ff692d' },
    'System of a Down': { id: 'tempo_break', name: { fr: 'Cassure tempo', en: 'Tempo Break' }, desc: { fr: 'Les ruptures rythmiques accelerent le combat: vitesse ennemie +12%, Fragments +20%.', en: 'Rhythm breaks accelerate combat: enemy speed +12%, Shards +20%.' }, enemySpd: 1.12, reward: 1.2, color: '#f1c40f' },
    'Rob Zombie': { id: 'grindhouse_cut', name: { fr: 'Montage grindhouse', en: 'Grindhouse Cut' }, desc: { fr: 'Les plans horrifiques amplifient le chaos: loot +22%.', en: 'Horror cuts amplify chaos: loot +22%.' }, reward: 1.22, color: '#ffa943' },
    'Daft Punk': { id: 'alive_sync', name: { fr: 'Synchronisation Alive', en: 'Alive Sync' }, desc: { fr: 'La grille lumineuse cadence l equipe: defense +6%, vitesse ennemie +6%, recompense +18%.', en: 'The light grid paces the squad: defense +6%, enemy speed +6%, reward +18%.' }, heroDef: 1.06, enemySpd: 1.06, reward: 1.18, color: '#ffc740' },
    'Oliver Tree': { id: 'viral_stunt', name: { fr: 'Cascade virale', en: 'Viral Stunt' }, desc: { fr: 'La faille devient imprevisible: recompense +15%.', en: 'The breach becomes unpredictable: reward +15%.' }, reward: 1.15, color: '#ff6f3c' },
    'Hazbin Hotel': { id: 'redemption_song', name: { fr: 'Refrain redemption', en: 'Redemption Refrain' }, desc: { fr: 'Le cabaret infernal renforce les controles: defense +8%, loot +15%.', en: 'The infernal cabaret reinforces control: defense +8%, loot +15%.' }, heroDef: 1.08, reward: 1.15, color: '#ffd35c' },
    'Alien 3': { id: 'penal_hive', name: { fr: 'Ruche penitentiaire', en: 'Penal Hive' }, desc: { fr: 'Le couloir ferme durcit chaque rencontre: boss +14% PV, loot +20%.', en: 'The sealed corridor hardens every fight: boss +14% HP, loot +20%.' }, bossHp: 1.14, reward: 1.2, color: '#b66a3c' },
    'Alien Resurrection': { id: 'clone_lab', name: { fr: 'Laboratoire clone', en: 'Clone Lab' }, desc: { fr: 'Les specimens hybrides accelerent les vagues: vitesse ennemie +9%, loot +22%.', en: 'Hybrid specimens accelerate waves: enemy speed +9%, loot +22%.' }, enemySpd: 1.09, reward: 1.22, color: '#7bd9c6' },
    'Alien: Covenant': { id: 'covenant_spores', name: { fr: 'Spores Covenant', en: 'Covenant Spores' }, desc: { fr: 'Les spores contaminent la zone: attaque ennemie +10%, cache +24%.', en: 'Spores contaminate the zone: enemy attack +10%, cache +24%.' }, enemyAtk: 1.1, reward: 1.24, color: '#c7d79a' },
    'Alien: Romulus': { id: 'romulus_salvage', name: { fr: 'Sauvetage Romulus', en: 'Romulus Salvage' }, desc: { fr: 'La station abandonnee augmente les prises de risque: boss +10% PV, loot +26%.', en: 'The abandoned station raises risk: boss +10% HP, loot +26%.' }, bossHp: 1.1, reward: 1.26, color: '#7fd7ff' },
    'Predator 2': { id: 'city_hunt', name: { fr: 'Chasse urbaine', en: 'City Hunt' }, desc: { fr: 'La jungle devient verticale: ennemis +8% vitesse, recompense +18%.', en: 'The jungle goes vertical: enemies +8% speed, reward +18%.' }, enemySpd: 1.08, reward: 1.18, color: '#f0a14a' },
    Predators: { id: 'game_preserve', name: { fr: 'Reserve de chasse', en: 'Game Preserve' }, desc: { fr: 'Le terrain est choisi par les chasseurs: boss +15% PV, loot +25%.', en: 'The hunters choose the ground: boss +15% HP, loot +25%.' }, bossHp: 1.15, reward: 1.25, color: '#8fbf55' },
    'The Predator': { id: 'upgrade_hunt', name: { fr: 'Chasseur upgrade', en: 'Upgrade Hunter' }, desc: { fr: 'L hybridation booste les menaces: attaque +12%, recompense +24%.', en: 'Hybridization boosts threats: attack +12%, reward +24%.' }, enemyAtk: 1.12, reward: 1.24, color: '#d36b44' },
    'Predator: Killer of Killers': { id: 'legendary_trophies', name: { fr: 'Trophees legendaires', en: 'Legendary Trophies' }, desc: { fr: 'Chaque epoque apporte un champion: boss +16% PV, loot +28%.', en: 'Each era brings a champion: boss +16% HP, loot +28%.' }, bossHp: 1.16, reward: 1.28, color: '#e1c15b' },
    'Predator: Badlands': { id: 'badlands_trial', name: { fr: 'Epreuve Badlands', en: 'Badlands Trial' }, desc: { fr: 'Les terres hostiles favorisent la survie: defense +9%, loot +16%.', en: 'Hostile lands favor survival: defense +9%, loot +16%.' }, heroDef: 1.09, reward: 1.16, color: '#d88a45' },
    'Alien vs Predator': { id: 'temple_crossfire', name: { fr: 'Temple croise', en: 'Temple Crossfire' }, desc: { fr: 'Le temple oppose ruche et clan: boss +12% PV, attaque +8%, loot +30%.', en: 'The temple pits hive against clan: boss +12% HP, attack +8%, loot +30%.' }, bossHp: 1.12, enemyAtk: 1.08, reward: 1.3, color: '#92f56d' },
    'Aliens vs Predator: Requiem': { id: 'requiem_outbreak', name: { fr: 'Epidemie Requiem', en: 'Requiem Outbreak' }, desc: { fr: 'La ville contaminee deborde: ennemis +10% vitesse, loot +27%.', en: 'The infected town overflows: enemies +10% speed, loot +27%.' }, enemySpd: 1.1, reward: 1.27, color: '#b6d86d' },
    'Gears of War': { id: 'cover_grind', name: { fr: 'Ligne de couverture', en: 'Cover Line' }, desc: { fr: 'Les positions lourdes renforcent l escouade: defense +12%, loot +12%.', en: 'Heavy positions reinforce the squad: defense +12%, loot +12%.' }, heroDef: 1.12, reward: 1.12, color: '#c44f3f' },
    Halo: { id: 'spartan_drop', name: { fr: 'Drop Spartan', en: 'Spartan Drop' }, desc: { fr: 'Le deploiement orbital booste l assaut: attaque heros +8%, loot +15%.', en: 'Orbital deployment boosts assault: hero attack +8%, loot +15%.' }, heroAtk: 1.08, reward: 1.15, color: '#78c95b' },
    'Resident Evil': { id: 'biohazard_lockdown', name: { fr: 'Confinement biohazard', en: 'Biohazard Lockdown' }, desc: { fr: 'Les infectes frappent plus fort: attaque +9%, cache +18%.', en: 'The infected hit harder: attack +9%, cache +18%.' }, enemyAtk: 1.09, reward: 1.18, color: '#65c76b' },
    'Silent Hill': { id: 'fog_shift', name: { fr: 'Brouillard changeant', en: 'Shifting Fog' }, desc: { fr: 'Le brouillard ralentit la lecture du terrain: boss +10% PV, loot +19%.', en: 'The fog obscures the field: boss +10% HP, loot +19%.' }, bossHp: 1.1, reward: 1.19, color: '#c4c0ad' },
    'Dino Crisis': { id: 'raptor_alarm', name: { fr: 'Alerte raptor', en: 'Raptor Alarm' }, desc: { fr: 'Les predateurs foncent sur les failles: vitesse +11%, loot +18%.', en: 'Predators rush breaches: speed +11%, loot +18%.' }, enemySpd: 1.11, reward: 1.18, color: '#7bc96f' },
    'The Matrix': { id: 'bullet_time', name: { fr: 'Bullet time', en: 'Bullet Time' }, desc: { fr: 'Le code ralentit la menace: defense +10%, loot +14%.', en: 'Code slows the threat: defense +10%, loot +14%.' }, heroDef: 1.1, reward: 1.14, color: '#39ff8a' },
    Stargate: { id: 'iris_protocol', name: { fr: 'Protocole iris', en: 'Iris Protocol' }, desc: { fr: 'Les equipes SG verrouillent la breche: defense +12%, recompense +15%.', en: 'SG teams lock the breach: defense +12%, reward +15%.' }, heroDef: 1.12, reward: 1.15, color: '#6ed0ff' },
    'Half-Life': { id: 'resonance_cascade', name: { fr: 'Cascade de resonance', en: 'Resonance Cascade' }, desc: { fr: 'Les portails Xen destabilisent le combat: boss +12% PV, loot +22%.', en: 'Xen portals destabilize combat: boss +12% HP, loot +22%.' }, bossHp: 1.12, reward: 1.22, color: '#f58d38' },
    Portal: { id: 'test_chamber', name: { fr: 'Salle de test', en: 'Test Chamber' }, desc: { fr: 'La logique Aperture optimise les routes: defense +6%, loot +16%.', en: 'Aperture logic optimizes routes: defense +6%, loot +16%.' }, heroDef: 1.06, reward: 1.16, color: '#5cc7ff' },
    'Metal Gear': { id: 'stealth_ops', name: { fr: 'Operation furtive', en: 'Stealth Ops' }, desc: { fr: 'L infiltration reduit les pertes: defense +9%, loot +15%.', en: 'Infiltration reduces losses: defense +9%, loot +15%.' }, heroDef: 1.09, reward: 1.15, color: '#8aa178' },
    Payday: { id: 'heist_timer', name: { fr: 'Chrono braquage', en: 'Heist Timer' }, desc: { fr: 'Plus le risque monte, plus le butin suit: attaque ennemie +8%, loot +21%.', en: 'The higher the risk, the richer the take: enemy attack +8%, loot +21%.' }, enemyAtk: 1.08, reward: 1.21, color: '#3f8fd2' },
    Vocaloid: { id: 'synth_chorus', name: { fr: 'Choeur synthetique', en: 'Synthetic Chorus' }, desc: { fr: 'Le tempo numerique stabilise l equipe: defense +6%, loot +14%.', en: 'Digital tempo stabilizes the team: defense +6%, loot +14%.' }, heroDef: 1.06, reward: 1.14, color: '#43d6df' },
    'Yu-Gi-Oh': { id: 'duel_phase', name: { fr: 'Phase de duel', en: 'Duel Phase' }, desc: { fr: 'Chaque victoire charge le deck: attaque heros +9%, loot +16%.', en: 'Each win charges the deck: hero attack +9%, loot +16%.' }, heroAtk: 1.09, reward: 1.16, color: '#f1c24d' },
    'Guilty Gear': { id: 'tension_meter', name: { fr: 'Jauge tension', en: 'Tension Meter' }, desc: { fr: 'Les duels explosent en puissance: attaque +10%, loot +17%.', en: 'Duels explode in power: attack +10%, loot +17%.' }, heroAtk: 1.1, reward: 1.17, color: '#ef5646' },
    BlazBlue: { id: 'azure_drive', name: { fr: 'Drive azur', en: 'Azure Drive' }, desc: { fr: 'L anomalie azur durcit le boss: PV +11%, loot +20%.', en: 'The azure anomaly hardens the boss: HP +11%, loot +20%.' }, bossHp: 1.11, reward: 1.2, color: '#4da6ff' },
    'Slender Man': { id: 'page_hunt', name: { fr: 'Chasse aux pages', en: 'Page Hunt' }, desc: { fr: 'La peur brouille les reperes: ennemis +8% vitesse, loot +18%.', en: 'Fear scrambles bearings: enemies +8% speed, loot +18%.' }, enemySpd: 1.08, reward: 1.18, color: '#d9d9d9' },
    Chucky: { id: 'killer_doll', name: { fr: 'Poupee tueuse', en: 'Killer Doll' }, desc: { fr: 'Les attaques surprises augmentent la pression: attaque +10%, loot +18%.', en: 'Surprise attacks raise pressure: attack +10%, loot +18%.' }, enemyAtk: 1.1, reward: 1.18, color: '#e65b42' },
    Hellraiser: { id: 'lament_config', name: { fr: 'Configuration du Lament', en: 'Lament Configuration' }, desc: { fr: 'La douleur devient ressource: boss +15% PV, loot +25%.', en: 'Pain becomes resource: boss +15% HP, loot +25%.' }, bossHp: 1.15, reward: 1.25, color: '#d6b36a' },
    'Mass Effect': { id: 'spectre_authority', name: { fr: 'Autorite Spectre', en: 'Spectre Authority' }, desc: { fr: 'Le commandement galactique coordonne mieux l equipe: defense +8%, loot +17%.', en: 'Galactic command coordinates the team better: defense +8%, loot +17%.' }, heroDef: 1.08, reward: 1.17, color: '#4cb4ff' },
    Fallout: { id: 'wasteland_scavenge', name: { fr: 'Recup wasteland', en: 'Wasteland Scavenge' }, desc: { fr: 'Chaque ruine cache des ressources: loot +20%, ennemis +6% attaque.', en: 'Every ruin hides resources: loot +20%, enemies +6% attack.' }, enemyAtk: 1.06, reward: 1.2, color: '#d7c15a' },
    Doom: { id: 'rip_and_tear', name: { fr: 'Rip and tear', en: 'Rip and Tear' }, desc: { fr: 'L enfer recompense l agression: attaque heros +12%, boss +10% PV.', en: 'Hell rewards aggression: hero attack +12%, boss +10% HP.' }, heroAtk: 1.12, bossHp: 1.1, reward: 1.18, color: '#ff4c32' },
    Unreal: { id: 'u_damage', name: { fr: 'U-Damage', en: 'U-Damage' }, desc: { fr: 'Les arenes amplifient les pics de degats: attaque +11%, loot +15%.', en: 'Arenas amplify damage spikes: attack +11%, loot +15%.' }, heroAtk: 1.11, reward: 1.15, color: '#ff8b32' },
    'Harry Potter': { id: 'protective_charm', name: { fr: 'Charme protecteur', en: 'Protective Charm' }, desc: { fr: 'La magie defensive stabilise la breche: defense +11%, loot +14%.', en: 'Defensive magic stabilizes the breach: defense +11%, loot +14%.' }, heroDef: 1.11, reward: 1.14, color: '#b68cff' },
    'Star Wars': { id: 'force_balance', name: { fr: 'Equilibre de la Force', en: 'Force Balance' }, desc: { fr: 'La Force renforce les actions decisives: attaque +8%, defense +6%, loot +15%.', en: 'The Force reinforces decisive actions: attack +8%, defense +6%, loot +15%.' }, heroAtk: 1.08, heroDef: 1.06, reward: 1.15, color: '#ffe066' },
    'Le Cinquième Element': { id: 'divine_language', name: { fr: 'Langage divin', en: 'Divine Language' }, desc: { fr: 'Les quatre elements alignent l escouade: defense +8%, loot +16%.', en: 'The four elements align the squad: defense +8%, loot +16%.' }, heroDef: 1.08, reward: 1.16, color: '#ffb563' },
    'Scary Movie': { id: 'parody_logic', name: { fr: 'Logique parodique', en: 'Parody Logic' }, desc: { fr: 'L absurde casse la menace: defense +7%, loot +15%.', en: 'Absurdity breaks the threat: defense +7%, loot +15%.' }, heroDef: 1.07, reward: 1.15, color: '#f2f2a0' },
    'Dead Space': { id: 'necromorph_pressure', name: { fr: 'Pression necromorphe', en: 'Necromorph Pressure' }, desc: { fr: 'La station isolee augmente la violence: attaque +12%, loot +24%.', en: 'The isolated station increases violence: attack +12%, loot +24%.' }, enemyAtk: 1.12, reward: 1.24, color: '#d17a42' },
    'Rick & Morty': { id: 'portal_gun', name: { fr: 'Pistolet portail', en: 'Portal Gun' }, desc: { fr: 'Les detours dimensionnels boostent le rendement: loot +19%, boss +7% PV.', en: 'Dimensional detours boost yield: loot +19%, boss +7% HP.' }, bossHp: 1.07, reward: 1.19, color: '#67e86b' },
    'Digital Circus': { id: 'abstract_glitch', name: { fr: 'Glitch abstrait', en: 'Abstract Glitch' }, desc: { fr: 'La scene digitale instabilise les ennemis: vitesse +7%, loot +17%.', en: 'The digital stage destabilizes enemies: speed +7%, loot +17%.' }, enemySpd: 1.07, reward: 1.17, color: '#ff6edb' },
    Digimon: { id: 'digivolution_chain', name: { fr: 'Chaine digivolution', en: 'Digivolution Chain' }, desc: { fr: 'Chaque combat charge la forme suivante: attaque +9%, loot +16%.', en: 'Each fight charges the next form: attack +9%, loot +16%.' }, heroAtk: 1.09, reward: 1.16, color: '#ffb43d' },
    Saw: { id: 'trap_room', name: { fr: 'Salle de piege', en: 'Trap Room' }, desc: { fr: 'Les choix difficiles augmentent les gains: boss +9% PV, loot +22%.', en: 'Hard choices increase gains: boss +9% HP, loot +22%.' }, bossHp: 1.09, reward: 1.22, color: '#b54335' },
    'Rosario + Vampire': { id: 'monster_class', name: { fr: 'Classe monstre', en: 'Monster Class' }, desc: { fr: 'Les clans surnaturels protegent l equipe: defense +9%, loot +15%.', en: 'Supernatural clans protect the team: defense +9%, loot +15%.' }, heroDef: 1.09, reward: 1.15, color: '#f07ab7' },
    Negima: { id: 'magister_pactio', name: { fr: 'Pactio Magister', en: 'Magister Pactio' }, desc: { fr: 'Les pactes magiques renforcent les combos: attaque +8%, loot +15%.', en: 'Magic pacts strengthen combos: attack +8%, loot +15%.' }, heroAtk: 1.08, reward: 1.15, color: '#b59cff' },
    'Ghost in the Shell': { id: 'cyberbrain_sync', name: { fr: 'Synchro cybercerveau', en: 'Cyberbrain Sync' }, desc: { fr: 'La coordination cybernetique anticipe les vagues: defense +8%, loot +18%.', en: 'Cybernetic coordination anticipates waves: defense +8%, loot +18%.' }, heroDef: 1.08, reward: 1.18, color: '#7fe7d7' },
    'Mad Max': { id: 'war_rig_run', name: { fr: 'Convoi War Rig', en: 'War Rig Run' }, desc: { fr: 'La route impose la vitesse et la survie: ennemis +8% vitesse, loot +19%.', en: 'The road demands speed and survival: enemies +8% speed, loot +19%.' }, enemySpd: 1.08, reward: 1.19, color: '#d98a3d' }
  };

  // List of high-tier items in the Event Shop
  const EVENT_SHOP_ITEMS = [
    { id: 'millennium_puzzle', name: { en: 'Millennium Puzzle', fr: 'Puzzle du Millénium' }, boost: { hp: 100, atk: 10, def: 5 }, tokenCost: 3 },
    { id: 'bandana_infinite', name: { en: 'Infinite Bandana', fr: 'Bandana Infini' }, boost: { atk: 12 }, tokenCost: 3 },
    { id: 'crucible_guard', name: { en: 'Crucible Hilt', fr: 'Creuset de Chasse' }, boost: { atk: 18 }, tokenCost: 4 },
    { id: 'udamage_power', name: { en: 'Amplificateur U-Damage', fr: 'Double Dégâts U-Damage' }, boost: { atk: 15 }, tokenCost: 4 },
    // Event Items (usable in combat)
    { id: 'evt_fo_nuke', name: { en: 'Fat Man Nuke Launcher', fr: 'Fat Man Lance-Nuke' }, isCombatEvent: true, universe: 'Fallout', tokenCost: 5 },
    { id: 'evt_doom_quad', name: { en: 'Quad Damage Powerup', fr: 'Multiplicateur Quad Damage' }, isCombatEvent: true, universe: 'Doom', tokenCost: 6 },
    { id: 'evt_ut_redeemer', name: { en: 'Redeemer Missile Targeter', fr: 'Viseur de Missile Rédempteur' }, isCombatEvent: true, universe: 'Unreal', tokenCost: 8 },
    ...EXPANDED_EVENT_SHOP_ITEMS
  ];

  const UNIVERSE_TO_STAGE_ID = {
    'Gears of War': 1, 'Halo': 2, 'Alien': 3, 'Predator': 4, 'Resident Evil': 5,
    'Silent Hill': 6, 'Dino Crisis': 7, 'The Matrix': 8, 'Stargate': 9, 'Half-Life': 10,
    'Portal': 11, 'Metal Gear': 12, 'Payday': 13, 'Vocaloid': 14, 'Yu-Gi-Oh': 15,
    'Guilty Gear': 16, 'BlazBlue': 17, 'Slender Man': 18, 'Chucky': 19, 'Hellraiser': 20,
    'Mass Effect': 21, 'Fallout': 22, 'Doom': 23, 'Unreal': 24, 'Harry Potter': 25,
    'Star Wars': 26, 'Le Cinquième Element': 27, 'Scary Movie': 28, 'Dead Space': 29,
    'Rick & Morty': 30, 'Digital Circus': 31, 'Digimon': 32, 'Saw': 33, 'Rosario + Vampire': 34,
    'Negima': 35, 'Ghost in the Shell': 36, 'Mad Max': 37
  };

  Object.assign(UNIVERSE_TO_STAGE_ID, EXPANDED_STAGE_ID_BY_UNIVERSE);

  const getHeroStats = (hero) => {
    const lvl = heroLevels[hero.id] || 1;
    const multiplier = 1 + (lvl - 1) * 0.1;
    let stats = {
      hp: Math.round(hero.stats.hp * multiplier),
      atk: Math.round(hero.stats.atk * multiplier),
      def: Math.round(hero.stats.def * multiplier),
      spd: Math.round(hero.stats.spd * (1 + (lvl - 1) * 0.03))
    };

    // 1. Universe completion passive stat bonus (+5% all stats)
    const ustageId = UNIVERSE_TO_STAGE_ID[hero.universe];
    if (ustageId && completedStages && completedStages.includes(ustageId)) {
      stats.hp = Math.round(stats.hp * 1.05);
      stats.atk = Math.round(stats.atk * 1.05);
      stats.def = Math.round(stats.def * 1.05);
      stats.spd = Math.round(stats.spd * 1.05);
    }

    // 2. Deployed Synergy multipliers
    const squadCats = activeTeam.map(id => HEROES_DB.find(h => h.id === id)?.category || '');
    const activeCatsCount = squadCats.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const synergyActive = activeCatsCount[hero.category] >= 2;
    if (synergyActive) {
      if (hero.category === 'marine') stats.hp = Math.round(stats.hp * 1.25);
      if (hero.category === 'slayer') stats.atk = Math.round(stats.atk * 1.20);
      if (hero.category === 'horror') stats.spd = Math.round(stats.spd * 1.15);
      if (hero.category === 'hacker') stats.spd = Math.round(stats.spd * 1.20);
      if (hero.category === 'tactical') stats.def = Math.round(stats.def * 1.20);
    }

    FACTION_RULES.forEach(rule => {
      const activeCount = activeTeam
        .map(id => HEROES_DB.find(h => h.id === id)?.universe)
        .filter(universe => rule.universes.includes(universe)).length;
      if (activeCount >= 2 && rule.universes.includes(hero.universe)) {
        stats[rule.stat] = Math.round(stats[rule.stat] * 1.08);
      }
    });

    // 3. Talent Mod boosts
    if (heroTalents && heroTalents[hero.id]) {
      const talent = heroTalents[hero.id];
      if (talent === 'incendiary') stats.atk = Math.round(stats.atk * 1.10);
      if (talent === 'vanguard') stats.def = Math.round(stats.def * 1.15);
      if (talent === 'survival_instinct') stats.hp = Math.round(stats.hp * 1.20);
      if (talent === 'critical_edge') stats.atk = Math.round(stats.atk * 1.20);
      if (talent === 'hyper_velocity') stats.spd = Math.round(stats.spd * 1.15);
      if (talent === 'atb_overdrive') stats.spd = Math.round(stats.spd * 1.20);
      if (talent === 'guardian_plates') stats.hp = Math.round(stats.hp * 1.20);
    }

    if (collectionBonusCount > 0) {
      const collectionFactor = 1 + Math.min(0.3, collectionBonusCount * 0.02);
      stats.hp = Math.round(stats.hp * collectionFactor);
      stats.atk = Math.round(stats.atk * collectionFactor);
      stats.def = Math.round(stats.def * collectionFactor);
      stats.spd = Math.round(stats.spd * collectionFactor);
    }

    // 4. Add equipped gear boosts
    const gearId = equippedGear[hero.id];
    if (gearId) {
      const isUpgraded = gearId.endsWith('_plus');
      const baseGearId = isUpgraded ? gearId.replace('_plus', '') : gearId;
      const gear = EQUIP_ITEMS_DB.find(it => it.id === baseGearId);
      if (gear && gear.boost) {
        const factor = isUpgraded ? 2 : 1;
        if (gear.boost.hp) stats.hp += gear.boost.hp * factor;
        if (gear.boost.atk) stats.atk += gear.boost.atk * factor;
        if (gear.boost.def) stats.def += gear.boost.def * factor;
        if (gear.boost.spd) stats.spd += gear.boost.spd * factor;
      }
    }
    return stats;
  };

  const getUpgradeCost = (heroId) => {
    const currentLvl = heroLevels[heroId] || 1;
    return currentLvl * 60;
  };

  const notifyNexus = (message, tone = 'info') => {
    setNexusMessage({ message, tone, stamp: Date.now() });
    window.clearTimeout(notifyNexus.timeoutId);
    notifyNexus.timeoutId = window.setTimeout(() => setNexusMessage(null), 3200);
  };

  const getLockedReason = (stage) => {
    const required = getStageRequiredClears(stage);
    const missing = Math.max(0, required - completedStages.length);
    return lang === 'fr'
      ? `Coordonnees verrouillees: stabilise encore ${missing} breche${missing > 1 ? 's' : ''} pour ouvrir ${stage.universe}.`
      : `Coordinates locked: stabilize ${missing} more breach${missing > 1 ? 'es' : ''} to open ${stage.universe}.`;
  };

  const handleLevelUp = (heroId) => {
    const cost = getUpgradeCost(heroId);
    if (gold < cost) {
      notifyNexus(lang === 'fr' ? `Or insuffisant: ${cost} requis pour renforcer cette signature.` : `Not enough Gold: ${cost} required to reinforce this signature.`, 'warn');
      return;
    }

    setGold(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    notifyNexus(lang === 'fr' ? 'Signature heroique renforcee dans le Nexus.' : 'Heroic signature reinforced in the Nexus.', 'success');
    sound.playSfx('levelup');
  };

  const handleLevelUpPotion = (heroId) => {
    const cost = 20;
    if (breachShards < cost) {
      notifyNexus(lang === 'fr' ? 'Fragments insuffisants pour condenser une potion EXP.' : 'Not enough Shards to condense an EXP potion.', 'warn');
      return;
    }

    setBreachShards(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    notifyNexus(lang === 'fr' ? 'Potion convertie: niveau de signature augmente.' : 'Potion converted: signature level increased.', 'success');
    sound.playSfx('levelup');
  };

  const autoEquipRelics = () => {
    const availableRelics = EQUIP_ITEMS_DB.filter(r => inventory.includes(r.id));
    if (availableRelics.length === 0) {
      notifyNexus(lang === 'fr' ? 'Aucune relique standard disponible pour l auto-equipement.' : 'No standard relic available for auto-equip.', 'warn');
      sound.playSfx('click');
      return;
    }
    sound.playSfx('confirm');
    availableRelics.sort((a, b) => {
      const scoreA = (a.boost.atk || 0) * 1.5 + (a.boost.spd || 0) * 1.2 + (a.boost.def || 0) + (a.boost.hp || 0) * 0.1;
      const scoreB = (b.boost.atk || 0) * 1.5 + (b.boost.spd || 0) * 1.2 + (b.boost.def || 0) + (b.boost.hp || 0) * 0.1;
      return scoreB - scoreA;
    });

    const newEquipped = { ...equippedGear };
    activeTeam.forEach(heroId => {
      delete newEquipped[heroId];
    });

    let relicIdx = 0;
    activeTeam.forEach(heroId => {
      while (relicIdx < availableRelics.length) {
        const candidate = availableRelics[relicIdx];
        const isEquippedElsewhere = Object.keys(newEquipped).some(id => newEquipped[id] === candidate.id);
        if (!isEquippedElsewhere) {
          newEquipped[heroId] = candidate.id;
          relicIdx++;
          break;
        }
        relicIdx++;
      }
    });

    setEquippedGear(newEquipped);
    notifyNexus(lang === 'fr' ? 'Le Nexus a assigne les meilleures reliques a l escouade active.' : 'Nexus assigned the best relics to the active squad.', 'success');
  };

  const toggleActiveHero = (heroId) => {
    if (activeTeam.includes(heroId)) {
      if (activeTeam.length > 1) {
        setActiveTeam(prev => prev.filter(id => id !== heroId));
        sound.playSfx('click');
      } else {
        notifyNexus(lang === 'fr' ? 'Impossible: le Nexus exige au moins une unite active.' : 'Impossible: Nexus requires at least one active unit.', 'warn');
        sound.playSfx('click');
      }
    } else {
      if (activeTeam.length < 3) {
        setActiveTeam(prev => [...prev, heroId]);
        sound.playSfx('click');
      } else {
        notifyNexus(lang === 'fr' ? 'Escouade complete: retire une unite avant d en deployer une autre.' : 'Squad full: bench one unit before deploying another.', 'warn');
        sound.playSfx('click');
      }
    }
  };

  // Equip regular gear
  const equipItem = (heroId, itemId) => {
    setEquippedGear(prev => ({
      ...prev,
      [heroId]: itemId
    }));
    notifyNexus(lang === 'fr' ? 'Relique synchronisee avec la signature du heros.' : 'Relic synchronized with the hero signature.', 'success');
    sound.playSfx('levelup');
  };

  const unequipItem = (heroId) => {
    setEquippedGear(prev => ({
      ...prev,
      [heroId]: null
    }));
    sound.playSfx('click');
  };

  // Equip combat Event Item
  const equipEventItem = (heroId, itemId) => {
    const hero = HEROES_DB.find(h => h.id === heroId);
    const expectedEvent = hero ? EVENT_ITEMS_DB[hero.universe]?.id : null;
    if (expectedEvent !== itemId) {
      notifyNexus(lang === 'fr' ? 'Objet refuse: cette anomalie ne correspond pas au lore du heros.' : 'Item rejected: this anomaly does not match the hero lore.', 'warn');
      sound.playSfx('click');
      return;
    }
    setEquippedEventItems(prev => ({
      ...prev,
      [heroId]: itemId
    }));
    notifyNexus(lang === 'fr' ? 'Objet evenementiel arme pour la prochaine breche.' : 'Event item armed for the next breach.', 'success');
    sound.playSfx('levelup');
  };

  const unequipEventItem = (heroId) => {
    setEquippedEventItems(prev => ({
      ...prev,
      [heroId]: null
    }));
    sound.playSfx('click');
  };

  // Event shop purchase
  const buyShopItem = (item) => {
    if (inventory.includes(item.id)) {
      notifyNexus(lang === 'fr' ? 'Prototype deja indexe dans l inventaire.' : 'Prototype already indexed in inventory.', 'warn');
      return;
    }
    if (eventTokens < item.tokenCost) {
      notifyNexus(lang === 'fr' ? `Jetons insuffisants: ${item.tokenCost} requis pour ce prototype.` : `Not enough Event Tokens: ${item.tokenCost} required for this prototype.`, 'warn');
      return;
    }

    setEventTokens(prev => prev - item.tokenCost);
    setInventory(prev => [...prev, item.id]);
    notifyNexus(lang === 'fr' ? 'Prototype transfere dans l inventaire Nexus.' : 'Prototype transferred into Nexus inventory.', 'success');
    sound.playSfx('levelup');
  };

  const getCompletedUniversesCount = (universes) => {
    return universes.filter(universe => {
      const stageId = UNIVERSE_TO_STAGE_ID[universe];
      return stageId && completedStages.includes(stageId);
    }).length;
  };

  const isCollectionComplete = (collection) => getCompletedUniversesCount(collection.universes) === collection.universes.length;
  const getCollectionMarkerId = (collection) => `collection_reward_${collection.id}`;

  const claimCollectionReward = (collection) => {
    const markerId = getCollectionMarkerId(collection);
    if (inventory.includes(markerId)) {
      notifyNexus(lang === 'fr' ? 'Cache deja reclamee: le bonus passif reste actif.' : 'Cache already claimed: passive bonus remains active.', 'warn');
      return;
    }
    if (!isCollectionComplete(collection)) {
      notifyNexus(lang === 'fr' ? 'Collection incomplete: stabilise tous les mondes lies a cette franchise.' : 'Collection incomplete: stabilize every linked franchise world.', 'warn');
      return;
    }

    setGold(prev => prev + collection.reward.gold);
    setBreachShards(prev => prev + collection.reward.shards);
    setEventTokens(prev => prev + collection.reward.tokens);
    setInventory(prev => [...prev, markerId]);
    notifyNexus(lang === 'fr' ? 'Cache de franchise ouverte: bonus passif permanent ajoute.' : 'Franchise cache opened: permanent passive bonus added.', 'success');
    sound.playSfx('levelup');
  };

  const handleFuseRelic = (baseItemId) => {
    if (gold < 150) {
      notifyNexus(lang === 'fr' ? 'Fusion refusee: 150 Or requis pour stabiliser la relique +.' : 'Fusion refused: 150 Gold required to stabilize the relic +.', 'warn');
      return;
    }

    const instancesIndices = [];
    inventory.forEach((invId, idx) => {
      if (invId === baseItemId) {
        instancesIndices.push(idx);
      }
    });

    if (instancesIndices.length < 3) {
      notifyNexus(lang === 'fr' ? 'Fusion impossible: trois exemplaires identiques sont requis.' : 'Fusion impossible: three matching copies required.', 'warn');
      return;
    }

    setGold(prev => prev - 150);

    const indicesToRemove = instancesIndices.slice(0, 3);
    setInventory(prev => {
      const copy = [...prev];
      indicesToRemove.sort((a, b) => b - a).forEach(idx => {
        copy.splice(idx, 1);
      });
      copy.push(`${baseItemId}_plus`);
      return copy;
    });

    sound.playSfx('levelup');
    notifyNexus(lang === 'fr' ? 'Relique fusionnee: version + ajoutee a l inventaire.' : 'Relic fused: + version added to inventory.', 'success');
  };

  const selectedHero = HEROES_DB.find(h => h.id === selectedHeroId) || HEROES_DB[0];
  const selectedHeroStats = getHeroStats(selectedHero);
  const selectedPlaque = getCharacterPlaque(selectedHero);
  const selectedLore = LORE_DB[selectedHero.universe];
  const selectedOriginBase = selectedLore?.desc?.[lang] || (
    lang === 'fr'
      ? `Monde source indexe par le Nexus: ${selectedHero.universe}. Les archives locales restent partielles, mais la signature de ce personnage confirme une origine stable dans cette realite.`
      : `Source world indexed by the Nexus: ${selectedHero.universe}. Local archives remain partial, but this character signature confirms a stable origin in that reality.`
  );
  const selectedOriginLore = lang === 'fr'
    ? `Trame d origine: ${selectedHero.universe}. ${selectedOriginBase} A.R.C.A. conserve cette memoire pour que le heros ne devienne pas une copie vide pendant la Compression de Resonance.`
    : `Origin Thread: ${selectedHero.universe}. ${selectedOriginBase} A.R.C.A. preserves this memory so the hero does not become an empty copy during Resonance Compression.`;
  const breachRoleLore = {
    marine: {
      fr: 'Le Nexus l emploie comme point d ancrage: encaisser le premier choc, tenir la ligne et permettre aux signatures plus fragiles de charger leurs pouvoirs.',
      en: 'The Nexus uses this hero as an anchor: absorb the first impact, hold the line, and let more fragile signatures charge their powers.'
    },
    slayer: {
      fr: 'Son recodage favorise les ruptures courtes et violentes: entrer dans la breche, casser le champion local, puis repartir avant que le decor ne se referme.',
      en: 'The recode favors short violent ruptures: enter the breach, break the local champion, then leave before the scenery closes back in.'
    },
    horror: {
      fr: 'Sa valeur vient de la survie narrative: quand une breche tente d imposer peur, infection ou fatalite, cette signature sait rester debout assez longtemps pour inverser la scene.',
      en: 'The value comes from narrative survival: when a breach tries to impose fear, infection, or fate, this signature stays standing long enough to invert the scene.'
    },
    hacker: {
      fr: 'Le Nexus le branche aux couches instables du code-realite: analyser les regles locales, ralentir les anomalies et transformer une incoherence de lore en avantage tactique.',
      en: 'The Nexus plugs this hero into unstable code-reality layers: read local rules, slow anomalies, and turn lore inconsistency into tactical advantage.'
    },
    tactical: {
      fr: 'Son profil sert de chef de coupe: lire le terrain, prioriser les cibles et faire fonctionner ensemble des heros qui ne devraient jamais partager le meme champ de bataille.',
      en: 'The profile works as field command: read terrain, prioritize targets, and make heroes cooperate when they should never share the same battlefield.'
    }
  };
  const mediaPersonaLore = selectedLore?.mediaType === 'music'
    ? (lang === 'fr'
      ? ' Comme Persona de Resonance, sa presence vient de l impact culturel collectif: le Nexus stabilise un symbole vivant plutot qu un civil tire au hasard.'
      : ' As a Resonance Persona, the presence comes from collective cultural impact: the Nexus stabilizes a living symbol rather than a civilian pulled at random.')
    : '';
  const selectedBreachLore = lang === 'fr'
    ? `${selectedHero.name} n a pas ete arrache a sa Trame par hasard. Sa signature a resiste a la Premiere Breche assez longtemps pour qu A.R.C.A. la classe comme operateur ${selectedHero.category}. Dans notre lore, "${selectedHero.special?.name || selectedPlaque.role.fr}" n est pas seulement une competence: c est la maniere dont ce heros impose les lois de son monde d origine dans une breche que le Sans-Auteur tente de rendre muette. ${breachRoleLore[selectedHero.category]?.fr || breachRoleLore.tactical.fr}${mediaPersonaLore}`
    : `${selectedHero.name} was not pulled from the origin Thread by chance. The signature resisted the First Breach long enough for A.R.C.A. to classify it as a ${selectedHero.category} operator. In our lore, "${selectedHero.special?.name || selectedPlaque.role.en}" is not just a skill: it is how this hero forces origin-world laws into a breach the Authorless wants to silence. ${breachRoleLore[selectedHero.category]?.en || breachRoleLore.tactical.en}${mediaPersonaLore}`;

  const formatBoostText = (boost) => Object.keys(boost || {})
    .map(key => `+${boost[key]} ${key.toUpperCase()}`)
    .join(' / ');

  const getGearDisplay = (gearId) => {
    if (!gearId) return null;
    const isUpgraded = gearId.endsWith('_plus');
    const baseId = isUpgraded ? gearId.replace('_plus', '') : gearId;
    const item = EQUIP_ITEMS_DB.find(it => it.id === baseId);
    if (!item) return null;
    const factor = isUpgraded ? 2 : 1;
    const boost = Object.fromEntries(Object.entries(item.boost || {}).map(([key, value]) => [key, value * factor]));
    return {
      ...item,
      id: gearId,
      isUpgraded,
      boost,
      name: isUpgraded ? { en: `${item.name.en} +`, fr: `${item.name.fr} +` } : item.name
    };
  };

  const getGearLore = (item) => {
    if (!item) return '';
    const boostText = formatBoostText(item.boost);
    return lang === 'fr'
      ? `Relique synchronisee ${item.universe}. Bonus actif: ${boostText}. Le Nexus l utilise comme amplificateur d arme pour renforcer la signature de combat du heros.`
      : `${item.universe} synchronized relic. Active boost: ${boostText}. The Nexus uses it as a weapon amplifier to reinforce the hero combat signature.`;
  };

  const getEventLore = (item) => {
    if (!item) return '';
    const baseDesc = item.desc?.[lang] || '';
    return lang === 'fr'
      ? `${baseDesc} Declencheur evenementiel lie au monde ${selectedHero.universe}: il respecte le lore du heros et charge une action de breche unique.`
      : `${baseDesc} Event trigger tied to ${selectedHero.universe}: it respects the hero lore and charges a unique breach action.`;
  };

  const selectedEquippedGear = getGearDisplay(equippedGear[selectedHero.id]);
  const selectedEquippedEvent = equippedEventItems[selectedHero.id]
    ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[selectedHero.id])
    : null;

  // Filter items in inventory
  const getGearInInventory = () => {
    const list = [];
    inventory.forEach(invId => {
      const isUpgraded = invId.endsWith('_plus');
      const baseId = isUpgraded ? invId.replace('_plus', '') : invId;
      const baseItem = EQUIP_ITEMS_DB.find(it => it.id === baseId);
      if (baseItem) {
        list.push({
          ...baseItem,
          id: invId,
          isUpgraded: isUpgraded,
          name: isUpgraded ? {
            en: `${baseItem.name.en} +`,
            fr: `${baseItem.name.fr} +`
          } : baseItem.name
        });
      }
    });
    return list;
  };

  const getEquippedGearName = (gearId) => {
    const item = getGearDisplay(gearId);
    return item ? item.name[lang] : '';
  };

  const getEventItemsInInventory = () => {
    // Filter out standard keys that match active Event Items
    return Object.keys(EVENT_ITEMS_DB).map(key => EVENT_ITEMS_DB[key]).filter(it => inventory.includes(it.id) || ['evt_hl_snarks', 'evt_halo_warthog', 'evt_re_cure'].includes(it.id));
  };

  const getStageRequiredClears = (stage) => {
    if (stage.id === 38) return FINAL_STAGE_REQUIRED_CLEARS;
    if (stage.difficulty === 'Medium') return 2;
    if (stage.difficulty === 'Hard') return 6;
    if (stage.difficulty === 'Very Hard') return 12;
    if (stage.difficulty === 'Expert') return 16;
    return 0;
  };
  const isStageUnlocked = (stage) => completedStages.length >= getStageRequiredClears(stage);
  const getBreachBrief = (stage) => {
    const modeText = stage.mode === 'RPG'
      ? (lang === 'fr' ? 'assaut en profondeur' : 'deep strike')
      : stage.mode === 'Tactics'
        ? (lang === 'fr' ? 'contrôle tactique du terrain' : 'tactical field control')
        : (lang === 'fr' ? 'combat de plateforme rapide' : 'fast platform combat');
    return lang === 'fr'
      ? `Faille ${stage.universe}: ${modeText}. Neutralise ${stage.bossName} et stabilise les coordonnées.`
      : `${stage.universe} breach: ${modeText}. Neutralize ${stage.bossName} and stabilize the coordinates.`;
  };

  const getStageModifier = (stage) => {
    if (UNIVERSE_MODIFIERS[stage.universe]) return UNIVERSE_MODIFIERS[stage.universe];
    const index = Math.abs(Math.floor((stage.id * 17 + missionSeed) % BREACH_MODIFIERS.length));
    return BREACH_MODIFIERS[index];
  };

  const getStageArc = (stage) => NARRATIVE_ARCS.find(arc => arc.universes.includes(stage.universe));

  const getLootRarity = (stage) => {
    const score = completedStages.length + getStageRequiredClears(stage) + (stage.id === 38 ? 12 : 0);
    return [...LOOT_RARITIES].reverse().find(rarity => score >= rarity.threshold) || LOOT_RARITIES[0];
  };

  const getStageTokenPrize = (stage) => {
    if (stage.id === 38) return 20;
    if (stage.isSurvival) return 3;
    return stage.id % 2 === 0 ? 5 : 0;
  };

  const prepareStage = (stage) => {
    const modifier = getStageModifier(stage);
    const rarity = getLootRarity(stage);
    const rewardFactor = modifier.reward || 1;
    return {
      ...stage,
      modifier,
      lootRarity: rarity,
      goldPrize: Math.round(stage.goldPrize * rewardFactor),
      shardPrize: Math.round(stage.shardPrize * rewardFactor),
      tokenPrize: getStageTokenPrize(stage)
    };
  };

  const launchStage = (stage) => {
    if (!isStageUnlocked(stage)) {
      notifyNexus(getLockedReason(stage), 'warn');
      sound.playSfx('click');
      return;
    }
    onLaunchStage(prepareStage(stage));
  };

  const launchSurvival = () => {
    const base = missionDeck.find(stage => isStageUnlocked(stage)) || nextUnclearedStage || STAGES[0];
    const preparedBase = prepareStage(base);
    onLaunchStage({
      ...preparedBase,
      id: 9000 + base.id,
      name: lang === 'fr' ? `Survie de brèche: ${base.universe}` : `Breach Survival: ${base.universe}`,
      difficulty: 'Survival',
      isSurvival: true,
      goldPrize: Math.round(preparedBase.goldPrize * 1.4),
      shardPrize: Math.round(preparedBase.shardPrize * 1.35),
      tokenPrize: 3
    });
  };

  const selectedBriefingStage = briefingStageId
    ? STAGES.find(stage => stage.id === briefingStageId)
    : null;

  const todayIndex = Math.floor(Date.now() / 86400000);
  const dailyContracts = DAILY_CONTRACTS
    .map((contract, idx) => DAILY_CONTRACTS[(todayIndex + idx) % DAILY_CONTRACTS.length])
    .slice(0, 3);

  const activeFactionSynergies = FACTION_RULES.map(rule => {
    const count = activeTeam
      .map(id => HEROES_DB.find(hero => hero.id === id)?.universe)
      .filter(universe => rule.universes.includes(universe)).length;
    return { ...rule, count, active: count >= 2 };
  });

  const deployedHeroes = activeTeam
    .map(id => HEROES_DB.find(hero => hero.id === id))
    .filter(Boolean);
  const deployedStats = deployedHeroes.reduce((acc, hero) => {
    const stats = getHeroStats(hero);
    acc.hp += stats.hp;
    acc.atk += stats.atk;
    acc.def += stats.def;
    acc.spd += stats.spd;
    return acc;
  }, { hp: 0, atk: 0, def: 0, spd: 0 });
  const deployedCategories = deployedHeroes.reduce((acc, hero) => {
    acc[hero.category] = (acc[hero.category] || 0) + 1;
    return acc;
  }, {});
  const deployedSynergies = SYNERGIES_DB.filter(syn => (deployedCategories[syn.category] || 0) >= 2);
  const deployedFactionSynergies = activeFactionSynergies.filter(rule => rule.active);
  const equippedRelicCount = deployedHeroes.filter(hero => equippedGear[hero.id]).length;
  const equippedEventCount = deployedHeroes.filter(hero => equippedEventItems[hero.id]).length;
  const averageTeamLevel = deployedHeroes.length
    ? deployedHeroes.reduce((sum, hero) => sum + (heroLevels[hero.id] || 1), 0) / deployedHeroes.length
    : 0;
  const squadReadiness = Math.min(100, Math.round(
    (deployedHeroes.length / 3) * 38
    + Math.min(22, averageTeamLevel * 4)
    + deployedSynergies.length * 12
    + deployedFactionSynergies.length * 8
    + equippedRelicCount * 5
    + equippedEventCount * 3
  ));
  const squadGrade = squadReadiness >= 85 ? 'S'
    : squadReadiness >= 70 ? 'A'
      : squadReadiness >= 50 ? 'B'
        : 'C';
  const squadFocus = deployedStats.atk >= deployedStats.def && deployedStats.atk >= deployedStats.spd
    ? (lang === 'fr' ? 'Assaut direct' : 'Direct assault')
    : deployedStats.def >= deployedStats.spd
      ? (lang === 'fr' ? 'Ligne defensive' : 'Defensive line')
      : (lang === 'fr' ? 'Tempo rapide' : 'Fast tempo');
  const squadWarnings = [
    deployedHeroes.length < 3 && (lang === 'fr' ? 'Slot libre: ajoute un troisieme heros pour securiser les modes longs.' : 'Open slot: add a third hero to secure longer modes.'),
    deployedSynergies.length === 0 && (lang === 'fr' ? 'Aucune synergie archetype: double une categorie pour activer un bonus fort.' : 'No archetype synergy: double a category to activate a strong bonus.'),
    equippedRelicCount < deployedHeroes.length && (lang === 'fr' ? 'Relique manquante: auto-equipe pour convertir l inventaire en puissance directe.' : 'Missing relic: auto-equip to turn inventory into direct power.'),
    equippedEventCount === 0 && (lang === 'fr' ? 'Aucun objet evenementiel arme: les combats boss seront moins explosifs.' : 'No event item armed: boss fights will be less explosive.')
  ].filter(Boolean);
  const categoryLabels = {
    marine: { fr: 'Tank / front', en: 'Tank / front' },
    slayer: { fr: 'Burst degats', en: 'Burst damage' },
    horror: { fr: 'Survie / esquive', en: 'Survival / dodge' },
    hacker: { fr: 'Controle ATB', en: 'ATB control' },
    tactical: { fr: 'Defense / soutien', en: 'Defense / support' }
  };

  const currentChapter = [...STORY_CHAPTERS]
    .reverse()
    .find(chapter => completedStages.length >= chapter.unlockClears) || STORY_CHAPTERS[0];
  const nextChapter = STORY_CHAPTERS.find(chapter => completedStages.length < chapter.unlockClears);
  const arcProgress = NARRATIVE_ARCS.map(arc => ({
    ...arc,
    completed: getCompletedUniversesCount(arc.universes),
    total: arc.universes.length
  }));
  const collectionProgress = COLLECTION_REWARDS.map(collection => ({
    ...collection,
    completed: getCompletedUniversesCount(collection.universes),
    total: collection.universes.length,
    complete: isCollectionComplete(collection),
    claimed: inventory.includes(getCollectionMarkerId(collection))
  }));
  const timelineProgress = BREACH_TIMELINE.map(entry => ({
    ...entry,
    active: completedStages.length >= entry.unlockClears
  }));

  const totalHeroLevels = unlockedHeroes.reduce((sum, heroId) => sum + (heroLevels[heroId] || 1), 0);
  const metaRank = completedStages.length >= META_RANK_THRESHOLDS.omega
    ? 'Omega'
    : completedStages.length >= META_RANK_THRESHOLDS.veteran
      ? 'Veteran'
      : completedStages.length >= META_RANK_THRESHOLDS.strike
        ? 'Strike'
        : 'Initiate';
  const nextProgressGoal = completedStages.length < 2
    ? (lang === 'fr' ? 'Stabiliser 2 brèches pour ouvrir le palier Medium.' : 'Stabilize 2 breaches to open Medium tier.')
    : completedStages.length < 6
      ? (lang === 'fr' ? 'Atteindre 6 brèches pour débloquer le palier Hard.' : 'Reach 6 breaches to unlock Hard tier.')
      : completedStages.length < 12
        ? (lang === 'fr' ? 'Construire une équipe niveau 4+ avant le palier Very Hard.' : 'Build a level 4+ squad before Very Hard tier.')
        : completedStages.length < 16
          ? (lang === 'fr' ? 'Ouvrir le palier Expert et renforcer les reliques.' : 'Open the Expert tier and reinforce relics.')
          : completedStages.length < FINAL_STAGE_REQUIRED_CLEARS
            ? (lang === 'fr' ? `Stabiliser ${FINAL_STAGE_REQUIRED_CLEARS} brèches pour ouvrir le noyau final.` : `Stabilize ${FINAL_STAGE_REQUIRED_CLEARS} breaches to open the final core.`)
            : (lang === 'fr' ? 'Noyau final disponible: optimiser les builds et le codex.' : 'Final core available: optimize builds and codex.');

  const getBossIntel = (stage) => {
    if (stage.id === 38) return getFinalGameBoss();
    return ENEMIES_DB[stage.universe]?.worldBoss || ENEMIES_DB[stage.universe]?.bosses?.[0];
  };

  const finalStageUnlocked = completedStages.length >= getStageRequiredClears({ id: 38 });
  const visibleStages = STAGES.filter(stage => {
    if (stage.id === 38) return true;
    return mediaFilter === 'all' || LORE_DB[stage.universe]?.mediaType === mediaFilter;
  });
  const finalStage = STAGES.find(stage => stage.id === 38);
  const missionPool = visibleStages.filter(stage => stage.id !== 38 && (missionModeFilter === 'all' || stage.mode === missionModeFilter));
  const unlockedMissionPool = missionPool.filter(isStageUnlocked);
  const scanPool = unlockedMissionPool.length > 0 ? unlockedMissionPool : missionPool.slice(0, 1);
  const nextUnclearedStage = scanPool.find(stage => !completedStages.includes(stage.id)) || scanPool[0];
  const seededMissionScore = (stage) => {
    const raw = Math.sin(stage.id * 9301 + missionSeed * 49297) * 10000;
    return raw - Math.floor(raw);
  };
  const randomMissionDeck = scanPool
    .filter(stage => stage.id !== nextUnclearedStage?.id)
    .sort((a, b) => seededMissionScore(a) - seededMissionScore(b))
    .slice(0, 4);
  const missionDeck = [nextUnclearedStage, ...randomMissionDeck].filter(Boolean).slice(0, 5);
  const clearedVisibleCount = missionPool.filter(stage => completedStages.includes(stage.id)).length;

  return (
    <div className="hub-screen" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle, #0e0722 0%, #03010b 100%)',
      color: '#fff',
      padding: '20px 40px',
      fontFamily: '"Share Tech Mono", monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* HUD Header */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(57, 197, 187, 0.3)',
        marginBottom: '20px'
      }}>
        <div>
          <h1 className="cyber-title" style={{ fontSize: '24px', margin: 0, letterSpacing: '2px', textShadow: '0 0 10px #39c5bb' }}>
            {getTranslation(lang, 'hubTitle')}
          </h1>
          <span style={{ fontSize: '11px', color: '#ff4500' }}>{getTranslation(lang, 'sysStatus')}</span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ padding: '6px 12px', background: 'rgba(241, 196, 15, 0.1)', border: '1px solid #f1c40f', borderRadius: '4px', fontSize: '12px' }}>
            🪙 {getTranslation(lang, 'gold')}: <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>{gold}</span>
          </div>
          <div style={{ padding: '6px 12px', background: 'rgba(155, 89, 182, 0.1)', border: '1px solid #9b59b6', borderRadius: '4px', fontSize: '12px' }}>
            🌀 {getTranslation(lang, 'shards')}: <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>{breachShards}</span>
          </div>
          <div style={{ padding: '6px 12px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', borderRadius: '4px', fontSize: '12px' }}>
            🎫 {getTranslation(lang, 'tokens')}: <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{eventTokens}</span>
          </div>
        </div>
      </div>

      {nexusMessage && (
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          marginBottom: '14px',
          padding: '10px 12px',
          border: `1px solid ${nexusMessage.tone === 'success' ? '#2ecc71' : nexusMessage.tone === 'warn' ? '#f1c40f' : '#39c5bb'}`,
          background: nexusMessage.tone === 'success' ? 'rgba(46,204,113,0.08)' : nexusMessage.tone === 'warn' ? 'rgba(241,196,15,0.08)' : 'rgba(57,197,187,0.08)',
          color: nexusMessage.tone === 'success' ? '#d8ffe4' : nexusMessage.tone === 'warn' ? '#fff3b0' : '#c8f7f4',
          borderRadius: '4px',
          fontSize: '12px',
          lineHeight: 1.4
        }}>
          <strong>{lang === 'fr' ? 'Journal Nexus' : 'Nexus Log'}:</strong> {nexusMessage.message}
        </div>
      )}

      {/* Navigation tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px', width: '100%', maxWidth: '1000px' }}>
        <button
          onClick={() => { setActiveTab('missions'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'missions' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabMissions')}
        </button>
        <button
          onClick={() => { setActiveTab('roster'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'roster' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabRoster')}
        </button>
        <button
          onClick={() => { setActiveTab('party'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'party' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabParty')}
        </button>
        <button
          onClick={() => { setActiveTab('inventory'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'inventory' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabInventory')}
        </button>
        <button
          onClick={() => { setActiveTab('shop'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'shop' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabShop')}
        </button>
        <button
          onClick={() => { setActiveTab('codex'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'codex' ? 'active-tab' : ''}`}
        >
          {getTranslation(lang, 'tabCodex')}
        </button>
        <button
          onClick={onGoToPortal}
          className="btn-retro"
          style={{ marginLeft: 'auto', border: '1px solid #9b59b6', background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', fontSize: '13px' }}
        >
          {getTranslation(lang, 'btnPortal')}
        </button>
      </div>

      {/* Media Category Filter Bar */}
      {['missions', 'roster', 'codex'].includes(activeTab) && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', width: '100%', maxWidth: '1000px', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '4px', border: '1px solid #222', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginRight: '5px' }}>
            {lang === 'fr' ? 'Filtre d archives :' : 'Archive filter:'}
          </span>
          <button
            onClick={() => { setMediaFilter('all'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'all' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'all' ? '#ffea00' : '#444' }}
          >
            {lang === 'fr' ? 'TOUT' : 'ALL'}
          </button>
          <button
            onClick={() => { setMediaFilter('game'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'game' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'game' ? '#3498db' : '#444' }}
          >
            {lang === 'fr' ? 'JEUX VIDEO' : 'VIDEO GAMES'}
          </button>
          <button
            onClick={() => { setMediaFilter('movie'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'movie' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'movie' ? '#e74c3c' : '#444' }}
          >
            {lang === 'fr' ? 'FILMS & SERIES' : 'MOVIES & TV'}
          </button>
          <button
            onClick={() => { setMediaFilter('manga'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'manga' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'manga' ? '#9b59b6' : '#444' }}
          >
            {lang === 'fr' ? 'MANGA & WEB' : 'MANGA & WEB'}
          </button>
          <button
            onClick={() => { setMediaFilter('music'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'music' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'music' ? '#f1c40f' : '#444' }}
          >
            {lang === 'fr' ? 'MUSIQUE' : 'MUSIC'}
          </button>
        </div>
      )}

      {/* Tab bodies */}
      <div style={{ width: '100%', maxWidth: '1000px', flex: 1 }}>

        {/* Tab 1: Missions */}
        {activeTab === 'missions' && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#39c5bb' }}>
              {lang === 'fr' ? 'SCAN DE BRECHES' : 'BREACH SCAN'}
            </h3>
            <div style={{
              marginBottom: '12px',
              padding: '10px 12px',
              border: '1px solid rgba(57,197,187,0.24)',
              background: 'rgba(57,197,187,0.06)',
              color: '#c8f7f4',
              fontSize: '11px',
              lineHeight: 1.45,
              borderRadius: '4px'
            }}>
              {lang === 'fr'
                ? 'Liste courte et aleatoire: le hub propose 5 breches utiles seulement. Nouveau scan remanie les cibles; la carte et les archives gardent l acces complet.'
                : 'Short randomized list: the hub proposes only 5 useful breaches. New Scan rerolls targets; the map and archive keep full access.'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px', color: '#aaa', fontSize: '12px' }}>
              <span>
                {lang === 'fr'
                  ? `${clearedVisibleCount}/${missionPool.length} breches filtrees stabilisees - 5 cibles proposees`
                  : `${clearedVisibleCount}/${missionPool.length} filtered breaches stabilized · 5 proposed targets`}
              </span>
              <button
                onClick={() => { setMissionSeed(prev => prev + 1); sound.playSfx('click'); }}
                className="btn-retro"
                style={{ padding: '7px 12px', fontSize: '11px', borderColor: '#39c5bb' }}
              >
                {lang === 'fr' ? '↻ NOUVEAU SCAN' : '↻ NEW SCAN'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['all', 'RPG', 'Tactics', 'Smash'].map(mode => (
                <button
                  key={mode}
                  onClick={() => { setMissionModeFilter(mode); setMissionSeed(Date.now()); sound.playSfx('click'); }}
                  className={`btn-retro ${missionModeFilter === mode ? 'active-tab' : ''}`}
                  style={{
                    padding: '6px 10px',
                    fontSize: '10px',
                    borderColor: missionModeFilter === mode ? '#39c5bb' : '#444',
                    color: missionModeFilter === mode ? '#39c5bb' : '#aaa'
                  }}
                >
                  {mode === 'all' ? 'ALL' : mode.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.4fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#ffeb3b', marginBottom: '8px', fontWeight: 'bold' }}>
                  {lang === 'fr' ? 'FOCUS JOURNALIER' : 'DAILY FOCUS'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dailyContracts.map(contract => {
                    const done = contract.mode === 'any'
                      ? completedStages.length > 0
                      : missionPool.some(stage => stage.mode === contract.mode && completedStages.includes(stage.id));
                    return (
                      <div key={contract.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '10px', color: done ? '#2ecc71' : '#ccc' }}>
                        <span>{done ? 'OK' : 'TODO'} - {contract.text[lang]}</span>
                        <strong style={{ color: '#ffeb3b' }}>{contract.focus}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(57,197,187,0.16)', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#39c5bb', fontWeight: 'bold' }}>
                    {lang === 'fr' ? 'CARTE MULTIVERS' : 'MULTIVERSE MAP'}
                  </span>
                  <button onClick={launchSurvival} className="btn-retro" style={{ fontSize: '10px', padding: '4px 8px', borderColor: '#ff4500', color: '#ff8c00' }}>
                    {lang === 'fr' ? 'SURVIE' : 'SURVIVAL'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(20px, 1fr))', gap: '5px' }}>
                  {missionPool.map(stage => {
                    const isCompleted = completedStages.includes(stage.id);
                    const isLocked = !isStageUnlocked(stage);
                    return (
                      <button
                        key={stage.id}
                        onClick={() => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                        title={`${stage.universe} - ${stage.mode}`}
                        style={{
                          height: '20px',
                          borderRadius: '3px',
                          border: isCompleted ? '1px solid #2ecc71' : isLocked ? '1px solid #333' : '1px solid #39c5bb',
                          background: isCompleted ? '#2ecc7133' : isLocked ? '#111' : '#39c5bb22',
                          color: isLocked ? '#555' : '#ddd',
                          fontSize: '9px',
                          cursor: 'pointer'
                        }}
                      >
                        {stage.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1.4fr',
              gap: '12px',
              marginBottom: '14px'
            }}>
              <div style={{
                padding: '14px',
                background: 'rgba(57,197,187,0.06)',
                border: '1px solid rgba(57,197,187,0.22)',
                borderRadius: '5px'
              }}>
                <div style={{ fontSize: '10px', color: '#39c5bb', textTransform: 'uppercase', marginBottom: '5px' }}>
                  {lang === 'fr' ? 'Chapitre actif' : 'Active chapter'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
                  {currentChapter.name[lang]}
                </div>
                <div style={{ fontSize: '11px', color: '#c8d6d6', lineHeight: 1.45, marginBottom: '8px' }}>
                  {currentChapter.desc[lang]}
                </div>
                <div style={{ fontSize: '10px', color: '#ffeb3b' }}>
                  {currentChapter.focus[lang]}
                </div>
                {nextChapter && (
                  <div style={{ marginTop: '8px', fontSize: '10px', color: '#8fa5aa' }}>
                    {lang === 'fr'
                      ? `Prochain chapitre a ${nextChapter.unlockClears} breches stabilisees.`
                      : `Next chapter at ${nextChapter.unlockClears} stabilized breaches.`}
                  </div>
                )}
              </div>

              <div style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '5px'
              }}>
                <div style={{ fontSize: '10px', color: '#ffeb3b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {lang === 'fr' ? 'Arcs narratifs de faction' : 'Faction narrative arcs'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                  {arcProgress.map(arc => {
                    const ratio = arc.total ? arc.completed / arc.total : 0;
                    return (
                      <div key={arc.id} style={{
                        padding: '9px',
                        border: `1px solid ${ratio === 1 ? arc.color : 'rgba(255,255,255,0.08)'}`,
                        background: ratio === 1 ? `${arc.color}18` : 'rgba(0,0,0,0.16)',
                        borderRadius: '4px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '11px', color: arc.color }}>{arc.title[lang]}</strong>
                          <span style={{ fontSize: '10px', color: '#ddd' }}>{arc.completed}/{arc.total}</span>
                        </div>
                        <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                          <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: arc.color }} />
                        </div>
                        <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35 }}>{arc.premise[lang]}</div>
                        <div style={{ fontSize: '9px', color: '#888', marginTop: '5px' }}>{arc.reward[lang]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px',
              marginBottom: '14px',
              background: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,235,59,0.16)',
              borderRadius: '5px'
            }}>
              <div style={{ fontSize: '10px', color: '#ffeb3b', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Collections de franchise' : 'Franchise collections'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {collectionProgress.map(collection => {
                  const ratio = collection.total ? collection.completed / collection.total : 0;
                  return (
                    <div key={collection.id} style={{
                      padding: '10px',
                      border: collection.complete ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.08)',
                      background: collection.complete ? 'rgba(46,204,113,0.07)' : 'rgba(255,255,255,0.02)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                        <strong style={{ fontSize: '11px', color: collection.complete ? '#2ecc71' : '#ddd' }}>{collection.title[lang]}</strong>
                        <span style={{ fontSize: '10px', color: '#ffeb3b' }}>{collection.completed}/{collection.total}</span>
                      </div>
                      <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', margin: '7px 0' }}>
                        <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: collection.complete ? '#2ecc71' : '#ffeb3b' }} />
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35 }}>{collection.bonus[lang]}</div>
                      <div style={{ fontSize: '10px', color: '#d9d9d9', marginTop: '6px' }}>
                        +{collection.reward.gold} Or | +{collection.reward.shards} Fragments | +{collection.reward.tokens} Jetons
                      </div>
                      <div style={{ fontSize: '9px', color: '#2ecc71', marginTop: '4px' }}>
                        {lang === 'fr' ? 'Passif permanent: +2% toutes stats.' : 'Permanent passive: +2% all stats.'}
                      </div>
                      <button
                        onClick={() => claimCollectionReward(collection)}
                        disabled={!collection.complete || collection.claimed}
                        className="btn-retro"
                        style={{
                          marginTop: '8px',
                          padding: '5px 9px',
                          fontSize: '10px',
                          borderColor: collection.claimed ? '#2ecc71' : collection.complete ? '#ffeb3b' : '#444',
                          color: collection.claimed ? '#2ecc71' : collection.complete ? '#ffeb3b' : '#666'
                        }}
                      >
                        {collection.claimed
                          ? (lang === 'fr' ? 'RECLAME' : 'CLAIMED')
                          : collection.complete
                            ? (lang === 'fr' ? 'RECLAMER CACHE' : 'CLAIM CACHE')
                            : (lang === 'fr' ? 'INCOMPLET' : 'INCOMPLETE')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              {activeFactionSynergies.map(rule => (
                <div key={rule.id} style={{
                  padding: '8px 10px',
                  border: rule.active ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.08)',
                  background: rule.active ? 'rgba(46,204,113,0.08)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: rule.active ? '#d9ffe5' : '#888'
                }}>
                  <strong>{rule.label}</strong> {rule.count}/2 - {rule.bonus}
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '8px',
              marginBottom: '14px',
              padding: '10px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '5px'
            }}>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#39c5bb' }}>{lang === 'fr' ? 'Rang meta' : 'Meta rank'}:</strong> {metaRank}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#ffeb3b' }}>{lang === 'fr' ? 'Progression' : 'Progress'}:</strong> {completedStages.length}/{STAGES.length}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#9b59b6' }}>{lang === 'fr' ? 'Niveaux équipe' : 'Roster levels'}:</strong> {totalHeroLevels}
              </div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>
                {nextProgressGoal}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {missionDeck.map((stage) => {
                const isCompleted = completedStages.includes(stage.id);
                const requiredClears = getStageRequiredClears(stage);
                const isLocked = !isStageUnlocked(stage);
                const isPriority = stage.id === nextUnclearedStage?.id;
                const backdropSrc = getOpenAiBackdropSrc(stage.universe, stage.mode);
                const preparedStage = prepareStage(stage);
                const modifier = preparedStage.modifier;
                const rarity = preparedStage.lootRarity;
                const stageArc = getStageArc(stage);

                return (
                  <div key={stage.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    background: isLocked ? 'rgba(0,0,0,0.4)' : isCompleted ? 'rgba(46, 204, 113, 0.08)' : isPriority ? 'rgba(57,197,187,0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isLocked ? '1px solid #444' : isCompleted ? '1px solid #2ecc71' : isPriority ? '1px solid rgba(57,197,187,0.55)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '5px',
                    opacity: isLocked ? 0.45 : 1
                  }}>
                    {backdropSrc && (
                      <div style={{
                        width: '145px',
                        alignSelf: 'stretch',
                        minHeight: '94px',
                        flexShrink: 0,
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.32)), url(${backdropSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        imageRendering: 'pixelated'
                      }} />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          #{stage.id} {stage.name}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          padding: '1px 5px',
                          background: stage.mode === 'Smash' ? '#e74c3c' : stage.mode === 'RPG' ? '#3498db' : '#9b59b6',
                          borderRadius: '2px'
                        }}>
                          {stage.mode === 'Smash' ? getTranslation(lang, 'modeSmash') : stage.mode === 'RPG' ? getTranslation(lang, 'modeRpg') : getTranslation(lang, 'modeTactics')}
                        </span>
                        <span style={{ color: modifier.color, border: `1px solid ${modifier.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                          {modifier.name[lang]}
                        </span>
                        <span style={{ color: rarity.color, border: `1px solid ${rarity.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                          Loot {rarity.label}
                        </span>
                        {stageArc && (
                          <span style={{ color: stageArc.color, border: `1px solid ${stageArc.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                            {stageArc.title[lang]}
                          </span>
                        )}
                        {isCompleted && <span style={{ color: '#2ecc71', fontSize: '11px', fontWeight: 'bold' }}>✓ STABILISE</span>}
                      </div>

                      <div style={{ fontSize: '12px', color: '#bbb', marginTop: '4px' }}>
                        Univers: <strong style={{ color: '#fff' }}>{stage.universe}</strong> | Boss: <strong style={{ color: '#e74c3c' }}>{stage.bossName}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8fa5aa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {getBreachBrief(stage)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {modifier.desc[lang]}
                      </div>
                      <div style={{ fontSize: '11px', color: '#ffeb3b', marginTop: '4px' }}>
                        Recompense: {preparedStage.goldPrize} Or | {preparedStage.shardPrize} Fragments {preparedStage.tokenPrize ? `| +${preparedStage.tokenPrize} Jetons` : ''}
                      </div>
                    </div>

                    <div>
                      {isLocked ? (
                        <span style={{ fontSize: '11px', color: '#e74c3c' }}>
                          {lang === 'fr' ? `VERROU (${requiredClears} breches)` : `LOCK (${requiredClears} breaches)`}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button
                            onClick={() => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                            className="btn-retro"
                            style={{ padding: '6px 12px', borderColor: '#ffeb3b', color: '#ffeb3b', fontSize: '11px' }}
                          >
                            BRIEFING
                          </button>
                          <button
                            onClick={() => launchStage(stage)}
                            className="btn-retro"
                            style={{
                              padding: '8px 16px',
                              background: '#39c5bb',
                              color: '#111',
                              fontSize: '12px'
                            }}
                          >
                            {getTranslation(lang, 'deploySquad')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedBriefingStage && (
              <div style={{
                marginTop: '14px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '190px 1fr auto',
                gap: '14px',
                alignItems: 'stretch',
                background: 'rgba(0,0,0,0.34)',
                border: '1px solid rgba(255,235,59,0.28)',
                borderRadius: '6px'
              }}>
                <div style={{
                  minHeight: '120px',
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.35)), url(${getOpenAiBackdropSrc(selectedBriefingStage.universe, selectedBriefingStage.mode) || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  imageRendering: 'pixelated',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '4px'
                }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#ffeb3b', marginBottom: '5px' }}>
                    {lang === 'fr' ? 'BRIEFING TACTIQUE' : 'TACTICAL BRIEFING'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedBriefingStage.name}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '6px', lineHeight: 1.45 }}>
                    {getBreachBrief(selectedBriefingStage)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
                    Boss: <strong style={{ color: '#e74c3c' }}>{getBossIntel(selectedBriefingStage)?.name || selectedBriefingStage.bossName}</strong> - {getBossIntel(selectedBriefingStage)?.special || 'Unknown anomaly'}
                  </div>
                  <div style={{ fontSize: '11px', color: getStageModifier(selectedBriefingStage).color, marginTop: '6px' }}>
                    {getStageModifier(selectedBriefingStage).name[lang]}: {getStageModifier(selectedBriefingStage).desc[lang]}
                  </div>
                  {getStageArc(selectedBriefingStage) && (
                    <div style={{ fontSize: '11px', color: getStageArc(selectedBriefingStage).color, marginTop: '6px' }}>
                      {getStageArc(selectedBriefingStage).title[lang]}: {getStageArc(selectedBriefingStage).premise[lang]}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: getLootRarity(selectedBriefingStage).color, marginTop: '6px' }}>
                    {lang === 'fr' ? 'Rareté estimée' : 'Estimated rarity'}: {getLootRarity(selectedBriefingStage).label}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                  <button
                    onClick={() => launchStage(selectedBriefingStage)}
                    disabled={!isStageUnlocked(selectedBriefingStage)}
                    className="btn-retro"
                    style={{ padding: '8px 14px', background: isStageUnlocked(selectedBriefingStage) ? '#ffeb3b' : '#333', color: isStageUnlocked(selectedBriefingStage) ? '#111' : '#777' }}
                  >
                    {isStageUnlocked(selectedBriefingStage) ? getTranslation(lang, 'deploySquad') : 'VERROU'}
                  </button>
                  <button onClick={() => setBriefingStageId(null)} className="btn-retro" style={{ padding: '6px 12px', fontSize: '10px', borderColor: '#555' }}>
                    FERMER
                  </button>
                </div>
              </div>
            )}
            {finalStage && (
              <div style={{
                marginTop: '14px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                background: finalStageUnlocked ? 'rgba(255, 234, 0, 0.08)' : 'rgba(0,0,0,0.28)',
                border: finalStageUnlocked ? '1px solid rgba(255,234,0,0.45)' : '1px solid #333',
                borderRadius: '5px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: finalStageUnlocked ? '#ffea00' : '#888', marginBottom: '4px' }}>
                    {lang === 'fr' ? 'ANOMALIE FINALE' : 'FINAL ANOMALY'}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>#{finalStage.id} {finalStage.name}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
                    {finalStageUnlocked
                      ? (lang === 'fr' ? 'Noyau mondial disponible.' : 'World core available.')
                      : (lang === 'fr' ? `${Math.max(0, FINAL_STAGE_REQUIRED_CLEARS - completedStages.length)} brèches à stabiliser avant ouverture.` : `${Math.max(0, FINAL_STAGE_REQUIRED_CLEARS - completedStages.length)} breaches to stabilize before opening.`)}
                  </div>
                </div>
                <button
                  onClick={() => finalStageUnlocked && launchStage(finalStage)}
                  className="btn-retro"
                  disabled={!finalStageUnlocked}
                  style={{
                    padding: '8px 16px',
                    background: finalStageUnlocked ? '#ffea00' : 'rgba(255,255,255,0.04)',
                    color: finalStageUnlocked ? '#111' : '#777',
                    fontSize: '12px',
                    cursor: finalStageUnlocked ? 'pointer' : 'not-allowed'
                  }}
                >
                  {finalStageUnlocked ? getTranslation(lang, 'deploySquad') : (lang === 'fr' ? 'VERROUILLÉ' : 'VERROU')}
                </button>
              </div>
            )}
            <div style={{ marginTop: '14px' }}>
              <button
                onClick={() => { setShowMissionArchive(prev => !prev); sound.playSfx('click'); }}
                className="btn-retro"
                style={{ padding: '7px 11px', fontSize: '10px', borderColor: '#555' }}
              >
                {showMissionArchive
                  ? (lang === 'fr' ? 'MASQUER ARCHIVE COMPLETE' : 'HIDE FULL ARCHIVE')
                  : (lang === 'fr' ? `ARCHIVE COMPLETE (${missionPool.length})` : `FULL ARCHIVE (${missionPool.length})`)}
              </button>

              {showMissionArchive && (
                <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px', maxHeight: '34vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {missionPool.map(stage => {
                    const isCompleted = completedStages.includes(stage.id);
                    return (
                      <button
                        key={stage.id}
                        onClick={() => isStageUnlocked(stage) ? launchStage(stage) : setBriefingStageId(stage.id)}
                        className="btn-retro"
                        style={{
                          textAlign: 'left',
                          padding: '9px',
                          fontSize: '10px',
                          borderColor: isCompleted ? '#2ecc71' : 'rgba(255,255,255,0.12)',
                          color: isCompleted ? '#2ecc71' : '#ddd',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                      >
                        #{stage.id} {stage.universe}<br />
                        <span style={{ color: '#888' }}>{stage.mode} · {stage.difficulty}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Roster */}
        {activeTab === 'roster' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            {/* List */}
            <div className="glass-panel" style={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#39c5bb' }}>{getTranslation(lang, 'recountedHeroes')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {HEROES_DB.filter(h => unlockedHeroes.includes(h.id) && (mediaFilter === 'all' || LORE_DB[h.universe]?.mediaType === mediaFilter)).map((hero) => {
                  const isSelected = hero.id === selectedHeroId;
                  const isActive = activeTeam.includes(hero.id);
                  const lvl = heroLevels[hero.id] || 1;
                  const plaque = getCharacterPlaque(hero);
                  return (
                    <div
                      key={hero.id}
                      onClick={() => { setSelectedHeroId(hero.id); sound.playSfx('click'); }}
                      style={{
                        padding: '10px',
                        background: isSelected ? 'rgba(57, 197, 187, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid #39c5bb' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '9px', color: hero.primaryColor, fontWeight: 'bold', letterSpacing: '0.08em' }}>
                          {plaque.clearance} / {hero.universe}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hero.name}</div>
                        <span style={{ fontSize: '10px', color: '#888' }}>{plaque.role[lang]}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '11px', color: '#39c5bb' }}>LVL {lvl}</div>
                        {isActive && <span style={{ fontSize: '8px', color: '#2ecc71' }}>● {getTranslation(lang, 'activeLabel')}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            {selectedHero && (
              <div className="glass-panel" style={{ padding: '20px', border: `2px solid ${selectedHero.primaryColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      {selectedPlaque.clearance} / {selectedPlaque.rank[lang]}
                    </div>
                    <h2 style={{ margin: '2px 0 0 0', fontSize: '22px' }}>{selectedHero.name}</h2>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: selectedHero.primaryColor, borderRadius: '3px', display: 'inline-block' }}>
                        {selectedHero.universe}
                      </span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#bbb' }}>
                        {selectedPlaque.role[lang]}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#39c5bb', fontWeight: 'bold' }}>
                    {getTranslation(lang, 'levelLabel')} {heroLevels[selectedHero.id] || 1}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.1fr', gap: '20px', marginTop: '15px' }}>
                  <div style={{
                    background: '#04020a',
                    minHeight: '260px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid ${selectedHero.primaryColor}33`,
                    overflow: 'hidden'
                  }}>
                    <canvas id="detailCanvas" width="300" height="250" style={{ width: '100%', maxWidth: '340px', height: '250px' }} ref={(el) => {
                      if (!el) return;
                      const ctx = el.getContext('2d');
                      ctx.clearRect(0, 0, 300, 250);
                      drawPixelSprite(ctx, 150, 182, selectedHero, 0, 1, 178);
                    }} />
                  </div>

                  <div>
                    <div style={{ marginBottom: '10px', padding: '10px', border: `1px solid ${selectedHero.primaryColor}55`, background: `${selectedHero.primaryColor}10`, borderRadius: '4px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: '11px', lineHeight: 1.35 }}>
                        <span style={{ color: '#777', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Indicatif' : 'Callsign'}</span>
                        <strong style={{ color: '#fff' }}>{selectedPlaque.callSign}</strong>
                        <span style={{ color: '#777', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Origine' : 'Origin'}</span>
                        <span style={{ color: '#bbb' }}>{selectedPlaque.origin[lang]}</span>
                      </div>
                    </div>
                    <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '3px' }}>{getTranslation(lang, 'attributes')}</h4>
                    <div style={{ fontSize: '13px', lineHeight: '22px' }}>
                      <div>MAX HP: <strong style={{ color: '#2ecc71', float: 'right' }}>{selectedHeroStats.hp}</strong></div>
                      <div>ATTACK: <strong style={{ color: '#e74c3c', float: 'right' }}>{selectedHeroStats.atk}</strong></div>
                      <div>DEFENSE: <strong style={{ color: '#3498db', float: 'right' }}>{selectedHeroStats.def}</strong></div>
                      <div>SPEED: <strong style={{ color: '#f1c40f', float: 'right' }}>{selectedHeroStats.spd}</strong></div>
                    </div>
                    <button
                      onClick={() => handleLevelUp(selectedHero.id)}
                      disabled={gold < getUpgradeCost(selectedHero.id)}
                      className={`btn-retro ${gold < getUpgradeCost(selectedHero.id) ? 'btn-disabled' : ''}`}
                      style={{ width: '100%', fontSize: '12px', padding: '8px', marginTop: '12px' }}
                    >
                      {getTranslation(lang, 'levelUpBtn')} (🪙 {getUpgradeCost(selectedHero.id)})
                    </button>
                    <button
                      onClick={() => handleLevelUpPotion(selectedHero.id)}
                      disabled={breachShards < 20}
                      className={`btn-retro ${breachShards < 20 ? 'btn-disabled' : ''}`}
                      style={{ 
                        width: '100%', 
                        fontSize: '11px', 
                        padding: '6px', 
                        marginTop: '8px',
                        background: 'rgba(155, 89, 182, 0.15)',
                        borderColor: '#9b59b6',
                        color: '#9b59b6'
                      }}
                    >
                      {getTranslation(lang, 'btnUsePotion')} (🌀 20)
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Lore Breach Multiverse' : 'Breach Multiverse lore'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedBreachLore}
                    </div>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Doctrine BP' : 'BP Doctrine'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.4, marginBottom: '8px' }}>
                      {selectedPlaque.doctrine[lang]}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedPlaque.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '9px', padding: '2px 6px', border: `1px solid ${selectedHero.primaryColor}66`, color: '#ddd', borderRadius: '3px', background: `${selectedHero.primaryColor}12` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', border: `1px solid ${selectedHero.primaryColor}44`, background: `${selectedHero.primaryColor}0f`, borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Monde d origine' : 'Origin world'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedOriginLore}
                    </div>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#ff8c00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Dossier personnage' : 'Character dossier'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedPlaque.dossier[lang]}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="equip-lore-card">
                    <div className="equip-lore-label">{getTranslation(lang, 'weaponRelic')}</div>
                    {selectedEquippedGear ? (
                      <>
                        <strong>{selectedEquippedGear.name[lang]}</strong>
                        <span>{formatBoostText(selectedEquippedGear.boost)}</span>
                        <p>{getGearLore(selectedEquippedGear)}</p>
                      </>
                    ) : (
                      <p>{lang === 'fr' ? 'Aucune relique armee: le heros combat avec sa signature de base.' : 'No armed relic: the hero fights with the base signature.'}</p>
                    )}
                  </div>
                  <div className="equip-lore-card event">
                    <div className="equip-lore-label">{getTranslation(lang, 'eventItem')}</div>
                    {selectedEquippedEvent ? (
                      <>
                        <strong>{selectedEquippedEvent.name[lang]}</strong>
                        <span>{selectedHero.universe}</span>
                        <p>{getEventLore(selectedEquippedEvent)}</p>
                      </>
                    ) : (
                      <p>{lang === 'fr' ? 'Aucun objet evenementiel synchronise pour cette fiche.' : 'No event item synchronized for this profile.'}</p>
                    )}
                  </div>
                </div>

                {/* Talent Mods Panel */}
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 235, 59, 0.02)', border: '1px solid rgba(255, 235, 59, 0.15)', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ffea00', textTransform: 'uppercase', textShadow: '0 0 3px #ffea00' }}>
                    🧬 {lang === 'fr' ? 'MODS CYBERNÉTIQUES (TALENTS)' : 'CYBERNETIC MODS (TALENTS)'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {(() => {
                      let options = [];
                      if (selectedHero.category === 'marine') {
                        options = [
                          { id: 'incendiary', name: { en: 'Incendiary Ammo', fr: 'Balles Incendiaires' }, desc: { en: '+10% ATK & Burn', fr: '+10% ATQ & Brûlure' } },
                          { id: 'vanguard', name: { en: 'Vanguard Shielding', fr: 'Bouclier d\'Avant-Garde' }, desc: { en: '+15% DEF & Shield', fr: '+15% DÉF & Bouclier' } }
                        ];
                      } else if (selectedHero.category === 'horror') {
                        options = [
                          { id: 'lifedrain', name: { en: 'Nanite Lifesteal', fr: 'Vol de Vie Nanite' }, desc: { en: '+10% Lifesteal', fr: '+10% Vol de vie' } },
                          { id: 'survival_instinct', name: { en: 'Survival Instinct', fr: 'Instinct de Survie' }, desc: { en: '+20% Max HP boost', fr: '+20% PV Max' } }
                        ];
                      } else if (selectedHero.category === 'slayer') {
                        options = [
                          { id: 'critical_edge', name: { en: 'Critical Edge', fr: 'Lame Critique' }, desc: { en: '+20% ATK, pierce DEF', fr: '+20% ATQ, perce-DEF' } },
                          { id: 'hyper_velocity', name: { en: 'Hyper Velocity', fr: 'Hyper Vélocité' }, desc: { en: '+15% Action Speed', fr: '+15% Vitesse' } }
                        ];
                      } else if (selectedHero.category === 'hacker') {
                        options = [
                          { id: 'atb_overdrive', name: { en: 'ATB Overdrive', fr: 'Surrégime ATB' }, desc: { en: '+20% ATB speed rate', fr: '+20% Vitesse ATB' } },
                          { id: 'reality_warp', name: { en: 'Reality Warp', fr: 'Altération Réalité' }, desc: { en: 'Stun/Glitch chance', fr: 'Chance d\'étourdir' } }
                        ];
                      } else if (selectedHero.category === 'tactical') {
                        options = [
                          { id: 'suppressing_fire', name: { en: 'Suppressing Fire', fr: 'Tir de Suppression' }, desc: { en: 'Attacks reduce target DEF', fr: 'Attaques réduisent la DEF cible' } },
                          { id: 'guardian_plates', name: { en: 'Guardian Plates', fr: 'Blindage Gardien' }, desc: { en: '+20% HP stats boost', fr: '+20% PV Max' } }
                        ];
                      }

                      const activeTalent = heroTalents[selectedHero.id];

                      return options.map(opt => {
                        const isActive = activeTalent === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              sound.playSfx('confirm');
                              setHeroTalents(prev => ({
                                ...prev,
                                [selectedHero.id]: isActive ? null : opt.id
                              }));
                            }}
                            style={{
                              padding: '10px',
                              background: isActive ? 'rgba(255, 235, 59, 0.15)' : 'rgba(0,0,0,0.3)',
                              border: isActive ? '2px solid #ffea00' : '1px solid #333',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: isActive ? '#fff' : '#aaa' }}>{opt.name[lang]}</div>
                            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>{opt.desc[lang]}</div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Equipped items details */}
                <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid #222' }}>
                      <span style={{ fontSize: '10px', color: '#aaa' }}>{getTranslation(lang, 'weaponRelic')}</span>
                      <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#39c5bb', marginTop: '3px' }}>
                        {equippedGear[selectedHero.id] ? getEquippedGearName(equippedGear[selectedHero.id]) : 'NONE'}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid #222' }}>
                      <span style={{ fontSize: '10px', color: '#aaa' }}>{getTranslation(lang, 'eventItem')}</span>
                      <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff4500', marginTop: '3px' }}>
                        {equippedEventItems[selectedHero.id] ? EVENT_ITEMS_DB[selectedHero.universe]?.name[lang] : 'NONE'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Party Setup */}
        {activeTab === 'party' && (
          <>
          <div className="glass-panel squad-panel">
            <div className="squad-header">
              <div>
                <h3>{getTranslation(lang, 'teamDeployTitle')}</h3>
                <p>{getTranslation(lang, 'teamDeploySub')}</p>
              </div>
              <button
                onClick={autoEquipRelics}
                className="btn-retro"
                style={{ fontSize: '11px', padding: '7px 12px', background: 'rgba(57, 197, 187, 0.1)', borderColor: '#39c5bb', color: '#39c5bb' }}
              >
                {getTranslation(lang, 'btnAutoEquip')}
              </button>
            </div>

            <div className="squad-zone-title">
              <span>{lang === 'fr' ? 'Equipe active' : 'Active team'}</span>
              <small>{lang === 'fr' ? 'Les trois cartes qui partiront en mission.' : 'The three cards that will enter missions.'}</small>
            </div>
            <div className="squad-slot-grid">
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                const stats = hero ? getHeroStats(hero) : null;
                const gear = hero ? getGearDisplay(equippedGear[hero.id]) : null;
                const eventItem = hero && equippedEventItems[hero.id]
                  ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[hero.id])
                  : null;
                return (
                  <div key={idx} className={`squad-slot ${hero ? 'filled' : 'empty'}`} style={{ '--slot-color': hero?.primaryColor || '#444' }}>
                    {hero ? (
                      <>
                        <div className="squad-slot-top">
                          <span>Slot {idx + 1}</span>
                          <button onClick={() => toggleActiveHero(hero.id)} title={lang === 'fr' ? 'Retirer' : 'Remove'}>X</button>
                        </div>
                        <div className="squad-hero-row">
                          <div className="squad-hero-frame">
                            <canvas width="112" height="118" ref={(el) => {
                              if (!el) return;
                              const ctx = el.getContext('2d');
                              ctx.clearRect(0, 0, 112, 118);
                              drawPixelSprite(ctx, 56, 98, hero, 0, 1, 88);
                            }} />
                          </div>
                          <div className="squad-hero-info">
                            <strong>{hero.name}</strong>
                            <small>{hero.universe}</small>
                            <em>{categoryLabels[hero.category]?.[lang] || hero.category}</em>
                          </div>
                        </div>
                        <div className="squad-mini-stats">
                          <span>HP {stats.hp}</span>
                          <span>ATK {stats.atk}</span>
                          <span>DEF {stats.def}</span>
                          <span>SPD {stats.spd}</span>
                        </div>
                        <div className="squad-loadout-line">
                          <span>{gear ? gear.name[lang] : (lang === 'fr' ? 'Relique vide' : 'No relic')}</span>
                          <span>{eventItem ? eventItem.name[lang] : (lang === 'fr' ? 'Event vide' : 'No event')}</span>
                        </div>
                        <button
                          onClick={() => { setSelectedHeroId(hero.id); setActiveTab('inventory'); sound.playSfx('click'); }}
                          className="btn-retro"
                          style={{ fontSize: '10px', padding: '4px 8px', width: '100%', marginTop: '8px' }}
                        >
                          {lang === 'fr' ? 'GERER EQUIPEMENT' : 'MANAGE GEAR'}
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{getTranslation(lang, 'emptySlot')}</span>
                        <small>{lang === 'fr' ? 'Choisis une reserve ci-dessous.' : 'Pick a reserve below.'}</small>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="squad-zone-title">
              <span>{lang === 'fr' ? 'Synthese tactique' : 'Tactical summary'}</span>
              <small>{lang === 'fr' ? 'Lisibilite meta, synergies et points faibles.' : 'Meta readability, synergies, and weak points.'}</small>
            </div>
            <div className="squad-command-grid">
              <div className="squad-readiness-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Lecture meta' : 'Meta read'}</div>
                <div className="squad-grade-row">
                  <span className="squad-grade">{squadGrade}</span>
                  <div>
                    <strong>{squadReadiness}%</strong>
                    <small>{lang === 'fr' ? 'Preparation escouade' : 'Squad readiness'}</small>
                  </div>
                </div>
                <div className="squad-meter"><span style={{ width: `${squadReadiness}%` }} /></div>
                <p>{squadFocus}</p>
              </div>

              <div className="squad-stat-grid">
                <div><span>HP</span><strong>{deployedStats.hp}</strong></div>
                <div><span>ATK</span><strong>{deployedStats.atk}</strong></div>
                <div><span>DEF</span><strong>{deployedStats.def}</strong></div>
                <div><span>SPD</span><strong>{deployedStats.spd}</strong></div>
              </div>

              <div className="squad-plan-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Plan Nexus' : 'Nexus plan'}</div>
                <p>
                  {lang === 'fr'
                    ? `${deployedHeroes.length}/3 heros deployes, ${deployedSynergies.length + deployedFactionSynergies.length} bonus actifs, ${equippedRelicCount}/${deployedHeroes.length || 3} reliques armees.`
                    : `${deployedHeroes.length}/3 heroes deployed, ${deployedSynergies.length + deployedFactionSynergies.length} active bonuses, ${equippedRelicCount}/${deployedHeroes.length || 3} relics armed.`}
                </p>
                <span>{nextProgressGoal}</span>
              </div>
            </div>

            <div className="squad-slot-grid squad-legacy-hidden">
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                const stats = hero ? getHeroStats(hero) : null;
                const gear = hero ? getGearDisplay(equippedGear[hero.id]) : null;
                const eventItem = hero && equippedEventItems[hero.id]
                  ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[hero.id])
                  : null;
                return (
                  <div key={idx} className={`squad-slot ${hero ? 'filled' : 'empty'}`} style={{ '--slot-color': hero?.primaryColor || '#444' }}>
                    {hero ? (
                      <>
                        <div className="squad-slot-top">
                          <span>Slot {idx + 1}</span>
                          <button onClick={() => toggleActiveHero(hero.id)} title={lang === 'fr' ? 'Retirer' : 'Remove'}>X</button>
                        </div>
                        <strong>{hero.name}</strong>
                        <small>{hero.universe} - {categoryLabels[hero.category]?.[lang] || hero.category}</small>
                        <div className="squad-mini-stats">
                          <span>HP {stats.hp}</span>
                          <span>ATK {stats.atk}</span>
                          <span>DEF {stats.def}</span>
                          <span>SPD {stats.spd}</span>
                        </div>
                        <div className="squad-loadout-line">
                          <span>{gear ? gear.name[lang] : (lang === 'fr' ? 'Relique vide' : 'No relic')}</span>
                          <span>{eventItem ? eventItem.name[lang] : (lang === 'fr' ? 'Event vide' : 'No event')}</span>
                        </div>
                        <button
                          onClick={() => { setSelectedHeroId(hero.id); setActiveTab('inventory'); sound.playSfx('click'); }}
                          className="btn-retro"
                          style={{ fontSize: '10px', padding: '4px 8px', width: '100%', marginTop: '8px' }}
                        >
                          {lang === 'fr' ? 'GERER EQUIPEMENT' : 'MANAGE GEAR'}
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{getTranslation(lang, 'emptySlot')}</span>
                        <small>{lang === 'fr' ? 'Choisis une reserve ci-dessous.' : 'Pick a reserve below.'}</small>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="squad-meta-grid">
              <div className="squad-section-card">
                <div className="squad-section-title">{getTranslation(lang, 'synergiesTitle')}</div>
                {deployedSynergies.length === 0 && deployedFactionSynergies.length === 0 ? (
                  <p className="squad-muted">{getTranslation(lang, 'noSynergies')}</p>
                ) : (
                  <div className="squad-bonus-list">
                    {deployedSynergies.map(syn => (
                      <div key={syn.id}>
                        <strong>{getTranslation(lang, syn.key)}</strong>
                        <span>{getTranslation(lang, syn.descKey)}</span>
                      </div>
                    ))}
                    {deployedFactionSynergies.map(rule => (
                      <div key={rule.id}>
                        <strong>{rule.name[lang]}</strong>
                        <span>{rule.desc[lang]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="squad-section-card warning">
                <div className="squad-section-title">{lang === 'fr' ? 'Priorites meta' : 'Meta priorities'}</div>
                <div className="squad-warning-list">
                  {(squadWarnings.length ? squadWarnings : [lang === 'fr' ? 'Escouade stable: pousse les niveaux et vise les caches de collection.' : 'Stable squad: push levels and chase collection caches.']).map(item => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="squad-reserve-title">
              <h4>{getTranslation(lang, 'reserves')}</h4>
              <span>{lang === 'fr' ? 'Clique pour deployer ou retirer. Les cartes montrent la valeur actuelle avec bonus.' : 'Click to deploy or bench. Cards show current value with bonuses.'}</span>
            </div>
            <div className="squad-reserve-grid">
              {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map((hero) => {
                const isActive = activeTeam.includes(hero.id);
                const stats = getHeroStats(hero);
                const gear = getGearDisplay(equippedGear[hero.id]);
                const wouldPair = !isActive && deployedCategories[hero.category] === 1;
                return (
                  <div
                    key={hero.id}
                    onClick={() => toggleActiveHero(hero.id)}
                    className={`squad-reserve-card ${isActive ? 'active' : ''}`}
                    style={{ '--slot-color': hero.primaryColor }}
                  >
                    <div className="squad-reserve-head">
                      <strong>{hero.name}</strong>
                      <span>{isActive ? getTranslation(lang, 'deployed') : getTranslation(lang, 'standby')}</span>
                    </div>
                    <div className="squad-reserve-body">
                      <div className="squad-reserve-frame">
                        <canvas width="76" height="82" ref={(el) => {
                          if (!el) return;
                          const ctx = el.getContext('2d');
                          ctx.clearRect(0, 0, 76, 82);
                          drawPixelSprite(ctx, 38, 70, hero, 0, 1, 62);
                        }} />
                      </div>
                      <div>
                        <small>{hero.universe}</small>
                        <em>{categoryLabels[hero.category]?.[lang] || hero.category}</em>
                      </div>
                    </div>
                    <div className="squad-reserve-stats">
                      <span>ATK {stats.atk}</span>
                      <span>DEF {stats.def}</span>
                      <span>SPD {stats.spd}</span>
                    </div>
                    <div className="squad-reserve-tags">
                      <span>LVL {heroLevels[hero.id] || 1}</span>
                      {gear && <span>{gear.name[lang]}</span>}
                      {wouldPair && <span>{lang === 'fr' ? 'Synergie +' : 'Synergy +'}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#39c5bb' }}>{getTranslation(lang, 'teamDeployTitle')}</h3>
                <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>{getTranslation(lang, 'teamDeploySub')}</p>
              </div>
              <button
                onClick={autoEquipRelics}
                className="btn-retro"
                style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(57, 197, 187, 0.1)', borderColor: '#39c5bb', color: '#39c5bb' }}
              >
                {getTranslation(lang, 'btnAutoEquip')}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                return (
                  <div key={idx} style={{
                    height: '80px',
                    border: hero ? `2px solid ${hero.primaryColor}` : '2px dashed #444',
                    background: hero ? 'rgba(0,0,0,0.3)' : 'transparent',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}>
                    {hero ? (
                      <>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{hero.name}</div>
                        <span style={{ fontSize: '10px', color: '#888' }}>{hero.universe}</span>
                        <button
                          onClick={() => toggleActiveHero(hero.id)}
                          style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#555', fontSize: '12px' }}>{getTranslation(lang, 'emptySlot')}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Synergies */}
            <div style={{
              margin: '15px 0 25px 0',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid #333',
              borderRadius: '4px'
            }}>
              <div style={{ fontSize: '12px', color: '#ffea00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {getTranslation(lang, 'synergiesTitle')}
              </div>
              {(() => {
                const deployedHeroObjects = HEROES_DB.filter(h => activeTeam.includes(h.id));
                const activeCategoriesCount = deployedHeroObjects.reduce((acc, h) => {
                  acc[h.category] = (acc[h.category] || 0) + 1;
                  return acc;
                }, {});
                const activeTeamSynergies = SYNERGIES_DB.filter(syn => (activeCategoriesCount[syn.category] || 0) >= 2);

                if (activeTeamSynergies.length === 0) {
                  return <div style={{ fontSize: '11px', color: '#666' }}>{getTranslation(lang, 'noSynergies')}</div>;
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeTeamSynergies.map(syn => (
                      <div key={syn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2ecc71' }}>✔ {getTranslation(lang, syn.key)}</span>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>{getTranslation(lang, syn.descKey)}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px' }}>{getTranslation(lang, 'reserves')}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map((hero) => {
                const isActive = activeTeam.includes(hero.id);
                return (
                  <div
                    key={hero.id}
                    onClick={() => toggleActiveHero(hero.id)}
                    style={{
                      padding: '10px',
                      background: isActive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255,255,255,0.01)',
                      border: isActive ? '2px solid #2ecc71' : '1px solid #333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{hero.name}</div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>{hero.universe}</div>
                    <span style={{ fontSize: '9px', padding: '1px 4px', background: isActive ? '#2ecc71' : '#555', color: '#fff', borderRadius: '2px' }}>
                      {isActive ? getTranslation(lang, 'deployed') : getTranslation(lang, 'standby')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </>
        )}

        {/* Tab 4: Inventory & Equipment */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.2fr', gap: '20px' }}>
            {/* Recruited list */}
            <div className="glass-panel" style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#39c5bb' }}>{getTranslation(lang, 'equipTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map(h => {
                  const isSelected = h.id === selectedHeroId;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHeroId(h.id)}
                      style={{
                        padding: '10px',
                        background: isSelected ? 'rgba(57,197,187,0.12)' : 'rgba(0,0,0,0.2)',
                        border: isSelected ? '1px solid #39c5bb' : '1px solid #222',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{h.name}</div>
                      <span style={{ fontSize: '10px', color: '#888' }}>{h.universe}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory gear details */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              {selectedHero && (
                <>
                  <h3 style={{ margin: '0 0 12px 0', color: selectedHero.primaryColor }}>
                    {selectedHero.name.toUpperCase()} GEAR SLOTS
                  </h3>

                  {/* Equipped summary */}
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    {/* Weapon slot */}
                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px dashed #333' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{getTranslation(lang, 'weaponRelic')}</div>
                      {equippedGear[selectedHero.id] ? (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', margin: '4px 0' }}>
                            {getEquippedGearName(equippedGear[selectedHero.id])}
                          </div>
                          {selectedEquippedGear && (
                            <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '6px' }}>
                              {formatBoostText(selectedEquippedGear.boost)}<br />
                              {getGearLore(selectedEquippedGear)}
                            </div>
                          )}
                          <button onClick={() => unequipItem(selectedHero.id)} className="btn-retro" style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>AUCUNE RELIQUE</div>
                      )}
                    </div>

                    {/* Event item slot */}
                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px dashed #333' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{getTranslation(lang, 'eventItem')}</div>
                      {equippedEventItems[selectedHero.id] ? (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', margin: '4px 0' }}>
                            {selectedEquippedEvent?.name[lang]}
                          </div>
                          {selectedEquippedEvent && (
                            <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '6px' }}>
                              {getEventLore(selectedEquippedEvent)}
                            </div>
                          )}
                          <button onClick={() => unequipEventItem(selectedHero.id)} className="btn-retro" style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>AUCUN OBJET EVENEMENT</div>
                      )}
                    </div>
                  </div>

                  {/* List of items in Inventory */}
                  <h4 style={{ margin: '0 0 10px 0', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '13px' }}>
                    {getTranslation(lang, 'inventoryTitle')}
                  </h4>
                  {getGearInInventory().length === 0 && getEventItemsInInventory().length === 0 ? (
                    <div style={{ color: '#555', fontSize: '12px' }}>{getTranslation(lang, 'noItems')}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '35vh', overflowY: 'auto' }}>
                      {/* Weapon Gear */}
                      {getGearInInventory().map(item => {
                        const isEquippedElsewhere = Object.keys(equippedGear).some(id => equippedGear[id] === item.id);
                        const isEquippedOnSelf = equippedGear[selectedHero.id] === item.id;
                        
                        return (
                          <div key={item.id} style={{
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{item.name[lang]}</div>
                              <span style={{ fontSize: '10px', color: '#888' }}>
                                Univers: {item.universe} | Boost: {formatBoostText(item.boost)}
                              </span>
                              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginTop: '3px', maxWidth: '520px' }}>
                                {getGearLore(item)}
                              </div>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipItem(selectedHero.id, item.id)}
                                disabled={isEquippedElsewhere}
                                className="btn-retro"
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                              >
                                {isEquippedElsewhere ? 'ASSIGNEE' : getTranslation(lang, 'equipBtn')}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Event Items */}
                      {getEventItemsInInventory().map(item => {
                        // Event items match hero universe to be equipped
                        const matchesUniverse = item.id === EVENT_ITEMS_DB[selectedHero.universe]?.id;
                        const isEquippedOnSelf = equippedEventItems[selectedHero.id] === item.id;

                        return (
                          <div key={item.id} style={{
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderColor: matchesUniverse ? '#ff4500' : '#222'
                          }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff4500' }}>
                                🌟 {item.name[lang]}
                              </div>
                              <span style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, display: 'block', maxWidth: '520px' }}>
                                {getEventLore(item)}
                              </span>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipEventItem(selectedHero.id, item.id)}
                                disabled={!matchesUniverse}
                                className="btn-retro"
                                style={{ fontSize: '11px', padding: '4px 10px', borderColor: matchesUniverse ? '#ff4500' : '#444', color: matchesUniverse ? '#ff4500' : '#444' }}
                              >
                                {matchesUniverse ? getTranslation(lang, 'equipBtn') : 'LORE INCOMPATIBLE'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Relic Fusion Station */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ff9900', textTransform: 'uppercase', textShadow: '0 0 3px #ff9900' }}>
                      ⚙️ {lang === 'fr' ? 'NOYAU DE FUSION DE RELIQUES' : 'RELIC FUSION CORE'}
                    </h4>
                    {(() => {
                      const counts = {};
                      inventory.forEach(invId => {
                        if (!invId.endsWith('_plus')) {
                          counts[invId] = (counts[invId] || 0) + 1;
                        }
                      });
                      const fusables = EQUIP_ITEMS_DB.filter(it => (counts[it.id] || 0) >= 3);

                      if (fusables.length === 0) {
                        return (
                          <div style={{ fontSize: '11px', color: '#666', background: 'rgba(0,0,0,0.2)', padding: '10px', border: '1px dashed #222', borderRadius: '4px' }}>
                            {lang === 'fr' ? 'Accumulez 3 exemplaires de la même relique standard dans votre inventaire pour réaliser une fusion (+100% de bonus).' : 'Accumulate 3 copies of the same standard relic in your inventory to perform a fusion (+100% bonus boosts).'}
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {fusables.map(item => {
                            const copies = counts[item.id];
                            const canAfford = gold >= 150;
                            return (
                              <div key={item.id} style={{
                                padding: '10px 14px',
                                background: 'rgba(255, 153, 0, 0.03)',
                                border: '1px solid rgba(255, 153, 0, 0.2)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff9900' }}>
                                    {item.name[lang]} ({copies} possedes)
                                  </div>
                                  <span style={{ fontSize: '10px', color: '#aaa' }}>
                                    Cible: {item.name[lang]} + (bonus double)
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleFuseRelic(item.id)}
                                  disabled={!canAfford}
                                  className={`btn-retro ${!canAfford ? 'btn-disabled' : ''}`}
                                  style={{
                                    fontSize: '11px',
                                    padding: '5px 12px',
                                    borderColor: '#ff9900',
                                    color: '#ff9900',
                                    background: 'rgba(255, 153, 0, 0.1)'
                                  }}
                                >
                                  {lang === 'fr' ? `FUSIONNER (🪙 150)` : `FUSE (🪙 150)`}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Event Shop */}
        {activeTab === 'shop' && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#e74c3c' }}>
              {getTranslation(lang, 'tabShop')}
            </h3>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '20px' }}>
              {lang === 'fr' ? 'Depense tes jetons evenement pour acheter des prototypes, reliques rares et declencheurs de combat synchronises au Nexus.' : 'Spend Event Tokens on prototypes, rare relics, and combat triggers synchronized by the Nexus.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {EVENT_SHOP_ITEMS.map(item => {
                const owned = inventory.includes(item.id);
                return (
                  <div key={item.id} style={{
                    padding: '14px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: item.isCombatEvent ? '#ff4500' : '#39c5bb' }}>
                          {item.name[lang]}
                        </span>
                        <span style={{ fontSize: '12px', color: '#e74c3c' }}>🎫 {item.tokenCost}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
                        {item.isCombatEvent
                          ? (lang === 'fr' ? 'Declencheur de combat lie a un univers.' : 'Universe-linked combat trigger.')
                          : (lang === 'fr' ? 'Relique prototype - augmente les stats.' : 'Prototype relic - boosts stats.')}
                      </div>
                    </div>

                    <div style={{ marginTop: '15px', textAlign: 'right' }}>
                      <button
                        onClick={() => buyShopItem(item)}
                        disabled={eventTokens < item.tokenCost || owned}
                        className="btn-retro"
                        style={{ fontSize: '12px', padding: '5px 12px', borderColor: owned ? '#2ecc71' : '#e74c3c', color: owned ? '#2ecc71' : '#e74c3c' }}
                      >
                        {owned ? 'INDEXE' : (lang === 'fr' ? 'ACHETER' : 'BUY')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Codex & Lore */}
        {activeTab === 'codex' && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#ffeb3b', textShadow: '0 0 5px #ffeb3b' }}>
              📚 {lang === 'fr' ? 'ARCHIVES ET LORE DES UNIVERS' : 'MULTIVERSE CODEX & HISTORICAL RECORDS'}
            </h3>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '20px' }}>
              {lang === 'fr' 
                ? `Consultez les enregistrements historiques des anomalies détectées sur les ${TOTAL_UNIVERSE_COUNT} univers connus du Multivers.`
                : `Browse the historical logs of the spacetime anomalies detected across the ${TOTAL_UNIVERSE_COUNT} known universes of the Multiverse.`}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Canon du Nexus' : 'Nexus canon'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {CORE_CODEX_ENTRIES.map(entry => (
                  <div key={entry.id} style={{
                    padding: '12px',
                    border: '1px solid rgba(57,197,187,0.25)',
                    background: 'linear-gradient(135deg, rgba(57,197,187,0.08), rgba(155,89,182,0.05))',
                    borderRadius: '6px',
                    minHeight: '118px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <strong style={{ color: '#ffeb3b', fontSize: '12px' }}>{entry.title[lang]}</strong>
                      <span style={{ color: '#39c5bb', fontSize: '8px', textTransform: 'uppercase', border: '1px solid rgba(57,197,187,0.35)', padding: '2px 5px', borderRadius: '3px' }}>
                        {entry.category[lang]}
                      </span>
                    </div>
                    <div style={{ color: '#d8d8d8', fontSize: '10px', lineHeight: 1.45 }}>
                      {entry.desc[lang]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#ff8c00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Arc narratif principal' : 'Main story arc'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                {NARRATIVE_ACTS.map((act, index) => {
                  const visible = completedStages.length >= Math.max(0, index * 3);
                  return (
                    <div key={act.id} style={{
                      padding: '10px',
                      border: visible ? '1px solid rgba(255,140,0,0.35)' : '1px dashed #333',
                      background: visible ? 'rgba(255,140,0,0.05)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      opacity: visible ? 1 : 0.45
                    }}>
                      <div style={{ color: visible ? '#ff8c00' : '#666', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
                        {visible ? act.title[lang] : (lang === 'fr' ? 'Archive verrouillee' : 'Locked archive')}
                      </div>
                      <div style={{ color: visible ? '#ccc' : '#555', fontSize: '10px', lineHeight: 1.35 }}>
                        {visible ? act.text[lang] : (lang === 'fr' ? 'Stabilise plus de breches pour restaurer cette memoire.' : 'Stabilize more breaches to restore this memory.')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {timelineProgress.map(entry => (
                <div key={entry.id} style={{
                  padding: '10px',
                  border: entry.active ? '1px solid rgba(57,197,187,0.45)' : '1px dashed #333',
                  background: entry.active ? 'rgba(57,197,187,0.06)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  opacity: entry.active ? 1 : 0.55
                }}>
                  <div style={{ fontSize: '10px', color: entry.active ? '#39c5bb' : '#777', fontWeight: 'bold', marginBottom: '5px' }}>
                    {entry.title[lang]} {entry.active ? '' : `(${entry.unlockClears})`}
                  </div>
                  <div style={{ fontSize: '10px', color: entry.active ? '#ccc' : '#666', lineHeight: 1.35 }}>
                    {entry.text[lang]}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
              {(() => {
                const encryptString = (str) => {
                  return str.replace(/[a-zA-Z0-9àâäéèêëîïôöùûüûœçÀÆ]/g, '█');
                };

                return Object.keys(LORE_DB).filter(key => mediaFilter === 'all' || LORE_DB[key]?.mediaType === mediaFilter).map(key => {
                  const lore = LORE_DB[key];
                  const universeHeroes = HEROES_DB.filter(h => h.universe === key);
                  const ustageId = UNIVERSE_TO_STAGE_ID[key];
                  const isCleared = completedStages.includes(ustageId);
                  const bossIntel = ENEMIES_DB[key]?.worldBoss || ENEMIES_DB[key]?.bosses?.[0];
                  
                  return (
                    <div key={key} style={{
                      padding: '14px',
                      background: isCleared ? 'rgba(255,255,255,0.01)' : 'rgba(255,0,0,0.01)',
                      border: isCleared ? '1px solid #333' : '1px dashed #e74c3c66',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '13px', color: isCleared ? '#39c5bb' : '#555' }}>
                            {lore.title[lang]}
                          </span>
                          <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', color: '#aaa', textTransform: 'uppercase' }}>
                            {lore.mediaType === 'game' ? '🕹️ Game' : lore.mediaType === 'movie' ? '🎬 Movie' : lore.mediaType === 'music' ? (lang === 'fr' ? 'Musique' : 'Music') : '📚 Web / Manga'}
                          </span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 'bold', color: isCleared ? '#2ecc71' : '#e74c3c' }}>
                            {isCleared 
                              ? (lang === 'fr' ? '✔ DÉCRYPTÉ (+5% Stats)' : '✔ DECRYPTED (+5% Stats)') 
                              : (lang === 'fr' ? `🔒 CLASSIFIÉ (Niveau ${ustageId})` : `🔒 CLASSIFIED (Stage ${ustageId})`)}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: isCleared ? '#ccc' : '#555', lineHeight: '1.4', marginBottom: '10px', fontFamily: isCleared ? 'inherit' : 'Courier New', wordBreak: 'break-all' }}>
                          {isCleared ? lore.desc[lang] : encryptString(lore.desc[lang])}
                        </div>
                        {bossIntel && (
                          <div style={{
                            padding: '8px',
                            marginBottom: '10px',
                            border: isCleared ? '1px solid rgba(231,76,60,0.35)' : '1px solid #222',
                            background: isCleared ? 'rgba(231,76,60,0.06)' : 'rgba(0,0,0,0.22)',
                            borderRadius: '4px',
                            color: isCleared ? '#ddd' : '#555',
                            fontSize: '10px',
                            lineHeight: 1.35
                          }}>
                            <strong style={{ color: isCleared ? '#e74c3c' : '#555' }}>
                              {lang === 'fr' ? 'Boss décrypté' : 'Decrypted boss'}:
                            </strong> {isCleared ? bossIntel.name : encryptString(bossIntel.name)}
                            <br />
                            {isCleared ? `HP ${bossIntel.hp} | ATK ${bossIntel.atk} | ${bossIntel.special}` : encryptString('Classified boss pattern')}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', borderTop: '1px solid #222', paddingTop: '8px' }}>
                        {universeHeroes.map(h => (
                          <span key={h.id} style={{ fontSize: '8px', padding: '1px 5px', background: `${h.primaryColor}22`, border: `1px solid ${h.primaryColor}`, color: isCleared ? '#fff' : '#666', borderRadius: '3px' }}>
                            {h.name} ({h.category.toUpperCase()})
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
