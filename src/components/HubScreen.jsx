import React, { useState } from 'react';
import { HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB, SYNERGIES_DB } from '../game/heroes';
import { getTranslation } from '../game/translation';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import sound from '../game/soundEngine';
import { LORE_DB } from '../game/lore';
import { ENEMIES_DB, getFinalGameBoss } from '../game/enemies';
import { EXPANDED_EVENT_SHOP_ITEMS, EXPANDED_FACTION_UNIVERSES, EXPANDED_STAGE_ID_BY_UNIVERSE, getExpandedStages } from '../game/expandedUniverses';

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
      desc: { fr: 'Les ennemis sont plus rapides, les shards augmentent.', en: 'Enemies move faster, breach shards increase.' },
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

  const handleLevelUp = (heroId) => {
    const cost = getUpgradeCost(heroId);
    if (gold < cost) return;

    setGold(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    sound.playSfx('levelup');
  };

  const handleLevelUpPotion = (heroId) => {
    const cost = 20;
    if (breachShards < cost) return;

    setBreachShards(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    sound.playSfx('levelup');
  };

  const autoEquipRelics = () => {
    sound.playSfx('confirm');
    const availableRelics = EQUIP_ITEMS_DB.filter(r => inventory.includes(r.id));
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
  };

  const toggleActiveHero = (heroId) => {
    if (activeTeam.includes(heroId)) {
      if (activeTeam.length > 1) {
        setActiveTeam(prev => prev.filter(id => id !== heroId));
        sound.playSfx('click');
      }
    } else {
      if (activeTeam.length < 3) {
        setActiveTeam(prev => [...prev, heroId]);
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
    setEquippedEventItems(prev => ({
      ...prev,
      [heroId]: itemId
    }));
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
    if (eventTokens < item.tokenCost || inventory.includes(item.id)) return;

    setEventTokens(prev => prev - item.tokenCost);
    setInventory(prev => [...prev, item.id]);
    sound.playSfx('levelup');
  };

  const handleFuseRelic = (baseItemId) => {
    if (gold < 150) return;

    const instancesIndices = [];
    inventory.forEach((invId, idx) => {
      if (invId === baseItemId) {
        instancesIndices.push(idx);
      }
    });

    if (instancesIndices.length < 3) return;

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
  };

  const selectedHero = HEROES_DB.find(h => h.id === selectedHeroId) || HEROES_DB[0];
  const selectedHeroStats = getHeroStats(selectedHero);

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
    if (!gearId) return '';
    const isUpgraded = gearId.endsWith('_plus');
    const baseId = isUpgraded ? gearId.replace('_plus', '') : gearId;
    const item = EQUIP_ITEMS_DB.find(it => it.id === baseId);
    if (!item) return '';
    return isUpgraded ? `${item.name[lang]} +` : item.name[lang];
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
    const index = Math.abs(Math.floor((stage.id * 17 + missionSeed) % BREACH_MODIFIERS.length));
    return BREACH_MODIFIERS[index];
  };

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
    <div style={{
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
            {lang === 'fr' ? 'Filtrer par Média :' : 'Filter by Media :'}
          </span>
          <button
            onClick={() => { setMediaFilter('all'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'all' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'all' ? '#ffea00' : '#444' }}
          >
            🌍 {lang === 'fr' ? 'TOUT' : 'ALL'}
          </button>
          <button
            onClick={() => { setMediaFilter('game'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'game' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'game' ? '#3498db' : '#444' }}
          >
            🕹️ {lang === 'fr' ? 'JEUX VIDÉO' : 'VIDEO GAMES'}
          </button>
          <button
            onClick={() => { setMediaFilter('movie'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'movie' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'movie' ? '#e74c3c' : '#444' }}
          >
            🎬 {lang === 'fr' ? 'FILMS & SÉRIES' : 'MOVIES & TV'}
          </button>
          <button
            onClick={() => { setMediaFilter('manga'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'manga' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'manga' ? '#9b59b6' : '#444' }}
          >
            📚 {lang === 'fr' ? 'MANGA & WEB' : 'MANGA & WEB'}
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
              {lang === 'fr' ? 'SCAN DE BRÈCHES' : 'BREACH SCAN'}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px', color: '#aaa', fontSize: '12px' }}>
              <span>
                {lang === 'fr'
                  ? `${clearedVisibleCount}/${missionPool.length} brèches filtrées stabilisées · 5 cibles proposées`
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
                        {isCompleted && <span style={{ color: '#2ecc71', fontSize: '11px', fontWeight: 'bold' }}>✓ CLEARED</span>}
                      </div>

                      <div style={{ fontSize: '12px', color: '#bbb', marginTop: '4px' }}>
                        Universe: <strong style={{ color: '#fff' }}>{stage.universe}</strong> | World Boss: <strong style={{ color: '#e74c3c' }}>{stage.bossName}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8fa5aa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {getBreachBrief(stage)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {modifier.desc[lang]}
                      </div>
                      <div style={{ fontSize: '11px', color: '#ffeb3b', marginTop: '4px' }}>
                        Reward: {preparedStage.goldPrize} gold | {preparedStage.shardPrize} shards {preparedStage.tokenPrize ? `| +${preparedStage.tokenPrize} tokens` : ''}
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
                    {isStageUnlocked(selectedBriefingStage) ? getTranslation(lang, 'deploySquad') : 'LOCKED'}
                  </button>
                  <button onClick={() => setBriefingStageId(null)} className="btn-retro" style={{ padding: '6px 12px', fontSize: '10px', borderColor: '#555' }}>
                    CLOSE
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
                  {finalStageUnlocked ? getTranslation(lang, 'deploySquad') : (lang === 'fr' ? 'VERROUILLÉ' : 'LOCKED')}
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
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{hero.name}</div>
                        <span style={{ fontSize: '10px', color: '#888' }}>{hero.universe}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>{selectedHero.name}</h2>
                    <span style={{ fontSize: '11px', padding: '2px 8px', background: selectedHero.primaryColor, borderRadius: '3px', marginTop: '4px', display: 'inline-block' }}>
                      {selectedHero.universe}
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', color: '#39c5bb', fontWeight: 'bold' }}>
                    {getTranslation(lang, 'levelLabel')} {heroLevels[selectedHero.id] || 1}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', marginTop: '15px' }}>
                  <div style={{ background: '#04020a', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <canvas id="detailCanvas" width="100" height="100" ref={(el) => {
                      if (!el) return;
                      const ctx = el.getContext('2d');
                      ctx.clearRect(0, 0, 100, 100);
                      drawPixelSprite(ctx, 50, 70, selectedHero, 0, 1);
                    }} />
                  </div>

                  <div>
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
          <div className="glass-panel" style={{ padding: '20px' }}>
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
                          <button onClick={() => unequipItem(selectedHero.id)} className="btn-retro" style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>EMPTY WEAPON SLOT</div>
                      )}
                    </div>

                    {/* Event item slot */}
                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px dashed #333' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{getTranslation(lang, 'eventItem')}</div>
                      {equippedEventItems[selectedHero.id] ? (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', margin: '4px 0' }}>
                            {EVENT_ITEMS_DB[selectedHero.universe]?.name[lang]}
                          </div>
                          <button onClick={() => unequipEventItem(selectedHero.id)} className="btn-retro" style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>EMPTY EVENT SLOT</div>
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
                                Universe: {item.universe} | Boost: +
                                {Object.keys(item.boost).map(k => `${k.toUpperCase()} ${item.boost[k]}`).join(', ')}
                              </span>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipItem(selectedHero.id, item.id)}
                                disabled={isEquippedElsewhere}
                                className="btn-retro"
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                              >
                                {isEquippedElsewhere ? 'EQUIPPED ON OTHER' : getTranslation(lang, 'equipBtn')}
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
                              <span style={{ fontSize: '10px', color: '#aaa' }}>{item.desc[lang]}</span>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipEventItem(selectedHero.id, item.id)}
                                disabled={!matchesUniverse}
                                className="btn-retro"
                                style={{ fontSize: '11px', padding: '4px 10px', borderColor: matchesUniverse ? '#ff4500' : '#444', color: matchesUniverse ? '#ff4500' : '#444' }}
                              >
                                {matchesUniverse ? getTranslation(lang, 'equipBtn') : 'WRONG UNIVERSE'}
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
                                    {item.name[lang]} ({copies} owned)
                                  </div>
                                  <span style={{ fontSize: '10px', color: '#aaa' }}>
                                    Target: {item.name[lang]} + (Double stats bonus)
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
              Spend your 🎫 **Event Tokens** (dropped from world bosses) to acquire high-tier gear and special combat event triggers!
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
                        {item.isCombatEvent ? `Active combat spell trigger.` : `Relic Gear | Boosts stats.`}
                      </div>
                    </div>

                    <div style={{ marginTop: '15px', textAlign: 'right' }}>
                      <button
                        onClick={() => buyShopItem(item)}
                        disabled={eventTokens < item.tokenCost || owned}
                        className="btn-retro"
                        style={{ fontSize: '12px', padding: '5px 12px', borderColor: owned ? '#2ecc71' : '#e74c3c', color: owned ? '#2ecc71' : '#e74c3c' }}
                      >
                        {owned ? 'OWNED' : `BUY`}
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
