import React, { useEffect, useRef, useState } from 'react';
import { EngineSmash } from '../game/engineSmash';
import { EngineRpg } from '../game/engineRpg';
import { EngineTactics } from '../game/engineTactics';
import { ParticleSystem, drawUniverseBackground, drawSynergyOverlay } from '../game/renderer';
import sound from '../game/soundEngine';
import { HEROES_DB as BASE_HEROES_DB, EVENT_ITEMS_DB, EQUIP_ITEMS_DB } from '../game/heroes';
import { getMonstersForUniverse, getBossesForUniverse, getWorldBossForUniverse, getFinalGameBoss } from '../game/enemies';
import { getTranslation } from '../game/translation';
import { EXPANDED_FACTION_UNIVERSES, EXPANDED_STAGE_ID_BY_UNIVERSE } from '../game/expandedUniverses';
import { createPlayerHero } from '../game/playerHero';
import { SKIN_CATALOG } from '../game/narrativeSystems';
import { getBattleItemPoolForStage } from '../game/battleItems';

export default function GameCanvas({ lang, playerProfile, activeTeam, stage, heroLevels, equippedGear, equippedEventItems, heroTalents, heroSkins, completedStages, collectionBonusCount = 0, disabledAssets = {}, onBattleEnd }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const battlePickupsRef = useRef([]);
  const battleItemPoolRef = useRef([]);
  const nextBattleItemDropRef = useRef(520);
  const keysPressed = useRef({});
  const lastAnomalyWaveRef = useRef(-1);
  
  const [activeHeroId, setActiveHeroId] = useState(activeTeam[0]);
  const [teamState, setTeamState] = useState([]);
  const [bossState, setBossState] = useState(null);
  const [selectedAction, setSelectedAction] = useState('simple'); // tactics
  const [autoBattle, setAutoBattle] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1 | 2
  const [battleCompleted, setBattleCompleted] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleAnomaly, setBattleAnomaly] = useState(null);
  const [battlePickups, setBattlePickups] = useState([]);
  const [battleItemLog, setBattleItemLog] = useState(null);
  
  const [activeSynergies, setActiveSynergies] = useState([]);
  const applySkin = (hero) => {
    const skin = SKIN_CATALOG[heroSkins?.[hero.id]];
    return skin ? { ...hero, ...skin.colors, activeSkin: skin } : hero;
  };
  const HEROES_DB = [createPlayerHero(playerProfile), ...BASE_HEROES_DB].map(applySkin);
  const disabledHeroSet = new Set(disabledAssets.heroes || []);
  const disabledEnemySet = new Set(disabledAssets.enemies || []);
  const disabledGearSet = new Set(disabledAssets.gear || []);
  const getEnemyAdminKey = (universe, enemy) => `${universe}::${enemy?.name || 'unknown'}`;

  const syncBattlePickups = (nextPickups) => {
    battlePickupsRef.current = nextPickups;
    setBattlePickups(nextPickups);
  };

  const createStagePickups = (currentStage) => {
    const pool = getBattleItemPoolForStage(currentStage);
    const tiers = ['pickup', 'pickup', 'pickup', 'summon', 'ultimate'];
    const positions = currentStage.mode === 'Tactics'
      ? [
        { gridX: 2, gridY: 1, x: 210, y: 128 },
        { gridX: 3, gridY: 3, x: 270, y: 218 },
        { gridX: 4, gridY: 0, x: 330, y: 83 },
        { gridX: 4, gridY: 4, x: 330, y: 263 },
        { gridX: 5, gridY: 2, x: 390, y: 173 }
      ]
      : [
        { x: 170, y: 218 },
        { x: 305, y: 146 },
        { x: 442, y: 218 },
        { x: 640, y: 178 },
        { x: 520, y: 300 }
      ];

    return tiers.map((tier, index) => {
      const tierPool = pool.filter(item => item.tier === tier);
      const item = tierPool[(currentStage.id + index) % Math.max(1, tierPool.length)] || pool[index % Math.max(1, pool.length)];
      return item ? { ...item, ...positions[index], pickupId: `${item.id}_${index}`, used: false } : null;
    }).filter(Boolean);
  };

  const spawnBattleItemDrop = (engine, animTime) => {
    if (!engine || battlePickupsRef.current.filter(item => !item.used).length >= 8) return;
    const pool = battleItemPoolRef.current.length ? battleItemPoolRef.current : getBattleItemPoolForStage(stage);
    const tierRoll = animTime % 10;
    const tier = tierRoll === 0 ? 'ultimate' : tierRoll <= 2 ? 'summon' : 'pickup';
    const tierPool = pool.filter(item => item.tier === tier);
    const item = tierPool[(animTime + stage.id) % Math.max(1, tierPool.length)] || pool[(animTime + stage.id) % Math.max(1, pool.length)];
    if (!item) return;
    const drop = {
      ...item,
      pickupId: `${item.id}_drop_${animTime}`,
      x: 90 + ((animTime * 37) % Math.max(180, engine.width - 180)),
      y: stage.mode === 'RPG' ? 150 + ((animTime * 17) % 120) : 130 + ((animTime * 19) % 190),
      used: false,
      drop: true
    };
    syncBattlePickups([...battlePickupsRef.current, drop]);
    engine.particles?.add(drop.x, drop.y, 0, -1, drop.color, 5, 36, 'text', 'DROP');
  };
  
  const autoBattleRef = useRef(autoBattle);
  autoBattleRef.current = autoBattle;
  const speedMultiplierRef = useRef(speedMultiplier);
  speedMultiplierRef.current = speedMultiplier;
  
  // Track if active Event Item has been activated this fight
  const [eventItemUsed, setEventItemUsed] = useState(false);

  const BATTLE_ANOMALIES = [
    {
      id: 'cache',
      text: { fr: 'Cache instable: charge spéciale bonus.', en: 'Unstable cache: bonus special charge.' },
      color: '#ffeb3b'
    },
    {
      id: 'rift_burn',
      text: { fr: 'Surtension de faille: le boss subit des dégâts.', en: 'Rift surge: boss takes damage.' },
      color: '#ff4500'
    },
    {
      id: 'signal',
      text: { fr: 'Signal allié: boucliers renforcés.', en: 'Allied signal: shields reinforced.' },
      color: '#39c5bb'
    }
  ];

  const FACTION_RULES = [
    { stat: 'hp', universes: ['Halo', 'Gears of War', 'Mass Effect', 'Stargate', 'Alien', 'Predator', ...EXPANDED_FACTION_UNIVERSES.sciFi] },
    { stat: 'atk', universes: ['Silent Hill', 'Resident Evil', 'Dead Space', 'Hellraiser', 'Saw', ...EXPANDED_FACTION_UNIVERSES.horror] },
    { stat: 'spd', universes: ['The Matrix', 'Portal', 'Ghost in the Shell', 'Digital Circus', ...EXPANDED_FACTION_UNIVERSES.cyber] },
    { stat: 'def', universes: ['Harry Potter', 'Yu-Gi-Oh', 'Negima', 'Rosario + Vampire', 'BlazBlue', ...EXPANDED_FACTION_UNIVERSES.arcane] }
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

  // Map hero stats
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
    const squadCats = activeTeam
      .map(id => HEROES_DB.find(h => h.id === id))
      .filter(h => h && !disabledHeroSet.has(h.id))
      .map(h => h.category || '');
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
        .map(id => HEROES_DB.find(h => h.id === id))
        .filter(h => h && !disabledHeroSet.has(h.id))
        .map(h => h.universe)
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
      if (disabledGearSet.has(baseGearId)) return stats;
      const gear = EQUIP_ITEMS_DB.find(it => it.id === baseGearId);
      if (gear && gear.boost) {
        const factor = isUpgraded ? 2 : 1;
        if (gear.boost.hp) stats.hp += gear.boost.hp * factor;
        if (gear.boost.atk) stats.atk += gear.boost.atk * factor;
        if (gear.boost.def) stats.def += gear.boost.def * factor;
        if (gear.boost.spd) stats.spd += gear.boost.spd * factor;
      }
    }

    if (stage.modifier?.heroDef) {
      stats.def = Math.round(stats.def * stage.modifier.heroDef);
    }
    if (stage.modifier?.heroAtk) {
      stats.atk = Math.round(stats.atk * stage.modifier.heroAtk);
    }
    if (collectionBonusCount > 0) {
      const collectionFactor = 1 + Math.min(0.3, collectionBonusCount * 0.02);
      stats.hp = Math.round(stats.hp * collectionFactor);
      stats.atk = Math.round(stats.atk * collectionFactor);
      stats.def = Math.round(stats.def * collectionFactor);
      stats.spd = Math.round(stats.spd * collectionFactor);
    }
    return stats;
  };

  const getEnemiesData = () => {
    const sourceUniverse = stage.id === 38 ? 'Matrix' : stage.universe;
    const filterEnemyList = (universe, list) => list.filter(enemy => !disabledEnemySet.has(getEnemyAdminKey(universe, enemy)));
    const scaleEnemy = (enemy, isBoss = false) => {
      const modifier = stage.modifier || {};
      return {
        ...enemy,
        universe: sourceUniverse,
        hp: Math.round(enemy.hp * (isBoss ? (modifier.bossHp || 1) : 1)),
        atk: Math.round(enemy.atk * (modifier.enemyAtk || 1)),
        spd: Math.round(enemy.spd * (modifier.enemySpd || 1))
      };
    };
    const fallbackEnemy = (universe, isBoss = false) => ({
      name: isBoss ? 'Nexus Residue Sentinel' : 'Nexus Residue',
      universe,
      hp: isBoss ? 420 : 80,
      atk: isBoss ? 22 : 10,
      def: isBoss ? 12 : 5,
      spd: isBoss ? 6 : 8,
      color: '#39c5bb'
    });
    const ensureList = (universe, list, isBoss = false) => (
      list.length ? list : [fallbackEnemy(universe, isBoss)]
    );

    if (stage.sourceUniverses?.length) {
      const fusedMonsters = stage.sourceUniverses.flatMap(universe =>
        filterEnemyList(universe, getMonstersForUniverse(universe)).slice(0, 2).map(enemy => scaleEnemy({ ...enemy, universe }))
      );
      const fusedBosses = stage.sourceUniverses.flatMap(universe =>
        filterEnemyList(universe, getBossesForUniverse(universe)).slice(0, 1).map(enemy => scaleEnemy({ ...enemy, universe }, true))
      );
      const primaryBoss = getWorldBossForUniverse(stage.universe);
      const baseMonsters = ensureList(stage.universe, filterEnemyList(stage.universe, getMonstersForUniverse(stage.universe)));
      const baseBosses = ensureList(stage.universe, filterEnemyList(stage.universe, getBossesForUniverse(stage.universe)), true);
      return {
        monsters: fusedMonsters.length ? fusedMonsters : baseMonsters.map(enemy => scaleEnemy(enemy)),
        bosses: fusedBosses.length ? fusedBosses : baseBosses.map(enemy => scaleEnemy(enemy, true)),
        worldBoss: disabledEnemySet.has(getEnemyAdminKey(stage.universe, primaryBoss)) ? scaleEnemy(fallbackEnemy(stage.universe, true), true) : scaleEnemy({
          ...primaryBoss,
          name: stage.bossName || primaryBoss.name,
          hp: Math.round((primaryBoss.hp || 1000) * 1.18),
          atk: Math.round((primaryBoss.atk || 20) * 1.12)
        }, true)
      };
    }

    if (stage.id === 38) {
      // Final Boss Stage
      return {
        monsters: ensureList('Matrix', filterEnemyList('Matrix', getMonstersForUniverse('Matrix'))).map(enemy => scaleEnemy(enemy)),
        bosses: ensureList('Matrix', filterEnemyList('Matrix', getBossesForUniverse('Matrix')), true).map(enemy => scaleEnemy(enemy, true)),
        worldBoss: scaleEnemy(getFinalGameBoss(), true)
      };
    }
    const monsters = ensureList(stage.universe, filterEnemyList(stage.universe, getMonstersForUniverse(stage.universe)));
    const bosses = ensureList(stage.universe, filterEnemyList(stage.universe, getBossesForUniverse(stage.universe)), true);
    const worldBoss = getWorldBossForUniverse(stage.universe);
    return {
      monsters: monsters.map(enemy => scaleEnemy(enemy)),
      bosses: bosses.map(enemy => scaleEnemy(enemy, true)),
      worldBoss: disabledEnemySet.has(getEnemyAdminKey(stage.universe, worldBoss)) ? scaleEnemy(fallbackEnemy(stage.universe, true), true) : scaleEnemy({
        ...worldBoss,
        name: stage.bossName || worldBoss.name
      }, true)
    };
  };

  const drawBattleItemPickup = (ctx, item, animTime) => {
    if (item.used) return;
    const pulse = 1 + Math.sin(animTime * 0.08 + item.x) * 0.12;
    const size = item.tier === 'ultimate' ? 18 : item.tier === 'summon' ? 15 : 12;
    const label = item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : item.role.slice(0, 3).toUpperCase();

    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(animTime * 0.025);
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -size * pulse);
    ctx.lineTo(size * pulse, 0);
    ctx.lineTo(0, size * pulse);
    ctx.lineTo(-size * pulse, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.rotate(-animTime * 0.025);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Share Tech Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, 3);
    ctx.restore();
  };

  const damageEnemiesByBattleItem = (engine, amount, color, label) => {
    if (!engine?.enemies) return;
    engine.enemies.forEach(enemy => {
      if (enemy.currentHp > 0) {
        const bossFactor = enemy.isBoss ? 1.25 : 1;
        enemy.currentHp = Math.max(0, enemy.currentHp - Math.round(amount * bossFactor));
        engine.particles?.add(enemy.x || 360, (enemy.y || 160) - 14, 0, -1, color, 6, 32, 'spark');
      }
    });
    engine.particles?.add(engine.width * 0.5, engine.height * 0.28, 0, -1, color, 4, 52, 'text', label);
  };

  const supportHeroesByBattleItem = (engine, effect, color) => {
    if (!engine?.heroes) return;
    const activeHero = stage.mode === 'Smash'
      ? engine.getActiveHero?.()
      : stage.mode === 'RPG'
        ? engine.getSelectedHero?.()
        : engine.activeUnitType === 'hero'
          ? engine.activeUnit
          : engine.heroes.find(hero => hero.currentHp > 0);

    engine.heroes.forEach(hero => {
      if (hero.currentHp <= 0) return;
      if (effect.heal) hero.currentHp = Math.min(hero.maxHp || hero.stats.hp, hero.currentHp + effect.heal);
      if (effect.shield) hero.currentHp = Math.min(hero.maxHp || hero.stats.hp, hero.currentHp + effect.shield);
      if (effect.charge && typeof hero.specialCharge === 'number') {
        const charge = hero === activeHero ? effect.charge : Math.ceil(effect.charge * 0.45);
        hero.specialCharge = Math.min(100, hero.specialCharge + charge);
      }
      engine.particles?.add(hero.x || 120, (hero.y || 180) - 18, 0, -1, color, 4, 26, 'spark');
    });
  };

  const activateBattleItem = (pickup, source = 'manual') => {
    if (!pickup || pickup.used || !engineRef.current || battleCompleted) return;
    const engine = engineRef.current;
    const effect = pickup.effect || {};
    const color = pickup.color || '#39c5bb';
    const nextPickups = battlePickupsRef.current.map(item =>
      item.pickupId === pickup.pickupId ? { ...item, used: true, source } : item
    );
    syncBattlePickups(nextPickups);

    if (effect.damage) damageEnemiesByBattleItem(engine, effect.damage, color, 'ITEM HIT');
    if (effect.summonDamage) damageEnemiesByBattleItem(engine, effect.summonDamage, color, 'ASSIST');
    if (effect.ultimateDamage) damageEnemiesByBattleItem(engine, effect.ultimateDamage, color, 'ULTIMATE');
    supportHeroesByBattleItem(engine, effect, color);

    setBattleItemLog({
      id: pickup.pickupId,
      color,
      text: lang === 'fr'
        ? `${pickup.name.fr}: ${pickup.tactics.fr}`
        : `${pickup.name.en}: ${pickup.tactics.en}`
    });
    window.setTimeout(() => setBattleItemLog(null), 4200);
    sound.playSfx(pickup.tier === 'ultimate' ? 'levelup' : pickup.tier === 'summon' ? 'portal' : 'confirm');
  };

  const activateFirstBattleItem = () => {
    const next = battlePickupsRef.current.find(item => !item.used);
    activateBattleItem(next, 'shortcut');
  };

  const checkBattleItemPickupCollision = (engine) => {
    if (stage.mode !== 'Smash' || !engine?.getActiveHero) return;
    const activeHero = engine.getActiveHero();
    if (!activeHero || activeHero.currentHp <= 0) return;
    battlePickupsRef.current.forEach(item => {
      if (item.used) return;
      const dx = (activeHero.x || 0) - item.x;
      const dy = (activeHero.y || 0) - item.y;
      if (Math.hypot(dx, dy) < 34) activateBattleItem(item, 'pickup');
    });
  };

  useEffect(() => {
    sound.playBgm('battle');

    const enemies = getEnemiesData();
    let squadHeroes = activeTeam.map(id => {
      const base = HEROES_DB.find(h => h.id === id);
      if (!base || disabledHeroSet.has(base.id)) return null;
      const scaledStats = getHeroStats(base);
      return {
        ...base,
        stats: scaledStats,
        talent: heroTalents[id] || null
      };
    }).filter(Boolean);
    if (squadHeroes.length === 0) {
      const anchor = HEROES_DB[0];
      squadHeroes = [{ ...anchor, stats: getHeroStats(anchor), talent: null }];
    }
    const activeCategoriesCount = squadHeroes.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {});
    const activeSyns = ['marine', 'slayer', 'horror', 'hacker', 'tactical'].filter(cat => (activeCategoriesCount[cat] || 0) >= 2);
    setActiveSynergies(activeSyns);
    if (activeSyns.length > 0) {
      sound.playSfx('levelup');
    }
    const particles = new ParticleSystem();
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const handleBattleComplete = (result) => {
      setBattleCompleted(true);
      setBattleResult(result);
      sound.stopBgm();
      if (result === 'victory') {
        sound.playSfx('victory');
      } else {
        sound.playSfx('defeat');
      }
    };

    // Load correct mode engine
    if (stage.mode === 'Smash') {
      engineRef.current = new EngineSmash(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
    } else if (stage.mode === 'RPG') {
      engineRef.current = new EngineRpg(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
      engineRef.current.isFinalBoss = (stage.id === 38);
    } else if (stage.mode === 'Tactics') {
      engineRef.current = new EngineTactics(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
      engineRef.current.isFinalBoss = (stage.id === 38);
    }

    battleItemPoolRef.current = getBattleItemPoolForStage(stage);
    nextBattleItemDropRef.current = stage.mode === 'Tactics' ? 999999 : 520;
    syncBattlePickups(createStagePickups(stage));
    setBattleItemLog(null);

    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'o' || e.key === 'O') activateFirstBattleItem();
      if (stage.mode === 'Smash' && engineRef.current) {
        const activeH = engineRef.current.getActiveHero();
        if (e.key === 'j' || e.key === 'J') engineRef.current.triggerAbility(activeH, 'simple');
        if (e.key === 'k' || e.key === 'K') engineRef.current.triggerAbility(activeH, 'secondary');
        if (e.key === 'l' || e.key === 'L') engineRef.current.triggerAbility(activeH, 'defense');
        if (e.key === 'i' || e.key === 'I') engineRef.current.triggerAbility(activeH, 'special');
        
        if (e.key === '1') engineRef.current.setActiveHero(activeTeam[0]);
        if (e.key === '2' && activeTeam[1]) engineRef.current.setActiveHero(activeTeam[1]);
        if (e.key === '3' && activeTeam[2]) engineRef.current.setActiveHero(activeTeam[2]);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animTime = 0;
    let frameId;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      const usingOpenAiBackdrop = drawUniverseBackground(ctx, stage.universe, width, height, stage.mode);

      // Cyber grid lines
      if (!usingOpenAiBackdrop) {
        ctx.strokeStyle = 'rgba(57, 197, 187, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0); ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y); ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const engine = engineRef.current;
      if (engine) {
        engine.autoBattle = autoBattleRef.current;
        const loops = speedMultiplierRef.current;
        for (let l = 0; l < loops; l++) {
          engine.update(keysPressed.current);
        }
        particles.update();

        engine.draw(ctx, animTime);
        battlePickupsRef.current.forEach(item => drawBattleItemPickup(ctx, item, animTime));
        checkBattleItemPickupCollision(engine);
        if (stage.mode !== 'Tactics' && animTime > nextBattleItemDropRef.current) {
          spawnBattleItemDrop(engine, animTime);
          nextBattleItemDropRef.current = animTime + (stage.mode === 'Smash' ? 540 : 780);
        }
        particles.draw(ctx);
        drawSynergyOverlay(ctx, activeSynergies, width, height, animTime);

        const anomalyRate = stage.isSurvival ? 420 : 720;
        const anomalyWave = Math.floor(animTime / anomalyRate);
        if (animTime > 180 && anomalyWave !== lastAnomalyWaveRef.current && animTime % anomalyRate < 2) {
          lastAnomalyWaveRef.current = anomalyWave;
          const anomaly = BATTLE_ANOMALIES[(stage.id + anomalyWave) % BATTLE_ANOMALIES.length];
          setBattleAnomaly(anomaly);
          window.setTimeout(() => setBattleAnomaly(null), 3600);

          if (anomaly.id === 'cache') {
            engine.heroes.forEach(hero => {
              if (hero.currentHp > 0 && typeof hero.specialCharge === 'number') {
                hero.specialCharge = Math.min(100, hero.specialCharge + 25);
              }
            });
          } else if (anomaly.id === 'rift_burn') {
            const boss = engine.enemies.find(enemy => enemy.isBoss && enemy.currentHp > 0) || engine.enemies.find(enemy => enemy.currentHp > 0);
            if (boss) {
              boss.currentHp = Math.max(1, boss.currentHp - Math.max(20, Math.round((boss.maxHp || boss.currentHp) * 0.04)));
              particles.add(width * 0.5, height * 0.26, 0, -1, '#ff4500', 3, 55, 'text', 'RIFT BURN');
            }
          } else if (anomaly.id === 'signal') {
            engine.heroes.forEach(hero => {
              if (hero.currentHp > 0) {
                hero.currentHp = Math.min(hero.stats.hp, hero.currentHp + Math.max(8, Math.round(hero.stats.hp * 0.05)));
              }
            });
          }
        }

        setTeamState([...engine.heroes]);
        if (engine.enemies.length > 0) {
          // Find active boss/worldBoss
          const boss = engine.enemies.find(e => e.isBoss && e.currentHp > 0);
          if (boss) setBossState({ ...boss });
        }

        if (stage.mode === 'Smash') {
          setActiveHeroId(engine.activeHeroId);
        } else if (stage.mode === 'RPG') {
          setActiveHeroId(engine.selectedHeroId);
        } else if (stage.mode === 'Tactics') {
          setActiveHeroId(engine.activeUnit?.id || '');
          setSelectedAction(engine.selectedAction);
        }
      }

      animTime++;
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameId);
      sound.stopBgm();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeTeam]);

  const handleCanvasClick = (e) => {
    if (stage.mode !== 'Tactics' || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const engine = engineRef.current;
    const gridC = Math.floor((clickX - engine.gridStartX) / engine.cellW);
    const gridR = Math.floor((clickY - engine.gridStartY) / engine.cellH);

    if (gridC >= 0 && gridC < engine.cols && gridR >= 0 && gridR < engine.rows) {
      const tacticalItem = battlePickupsRef.current.find(item => !item.used && item.gridX === gridC && item.gridY === gridR);
      if (tacticalItem) {
        const activeHero = engine.activeUnitType === 'hero' ? engine.activeUnit : engine.heroes.find(hero => hero.currentHp > 0);
        const distance = activeHero ? Math.abs((activeHero.gridX || 0) - gridC) + Math.abs((activeHero.gridY || 0) - gridR) : 99;
        if (distance <= 3) {
          activateBattleItem(tacticalItem, 'tactics-tile');
          return;
        }
        setBattleItemLog({
          id: tacticalItem.pickupId,
          color: tacticalItem.color,
          text: lang === 'fr'
            ? 'Case trop eloignee: rapproche un heros tactique pour securiser la ressource.'
            : 'Tile too far: move a tactical hero closer to secure the resource.'
        });
        window.setTimeout(() => setBattleItemLog(null), 2600);
        return;
      }
      engine.handleCellClick(gridC, gridR);
    }
  };

  const handleActiveHeroAbility = (type) => {
    if (!engineRef.current || battleCompleted) return;
    const engine = engineRef.current;

    if (stage.mode === 'Smash') {
      const activeH = engine.getActiveHero();
      engine.triggerAbility(activeH, type);
    } else if (stage.mode === 'RPG') {
      const activeH = engine.getSelectedHero();
      engine.triggerAbility(activeH, type);
    } else if (stage.mode === 'Tactics') {
      engine.selectedAction = type;
      engine.calculateAttackRange();
      setSelectedAction(type);
    }
  };

  // Trigger Combat Event Item
  const handleActivateEventItem = () => {
    if (!engineRef.current || eventItemUsed || battleCompleted) return;

    const activeHero = HEROES_DB.find(h => h.id === activeHeroId);
    if (!activeHero) return;

    const eventId = equippedEventItems[activeHero.id];
    if (!eventId) return;

    const eventDetails = EVENT_ITEMS_DB[activeHero.universe];
    if (!eventDetails) return;

    // Trigger effect in engine
    engineRef.current.triggerCombatEvent(eventDetails.effect);
    setEventItemUsed(true);
  };

  const swapActiveHero = (id) => {
    if (!engineRef.current) return;
    if (stage.mode === 'Smash') {
      engineRef.current.setActiveHero(id);
    } else if (stage.mode === 'RPG') {
      engineRef.current.selectHero(id);
    }
  };

  const activeHeroObj = teamState.find(h => h.id === activeHeroId) || teamState[0];

  const toggleAuto = () => {
    const nextVal = !autoBattle;
    setAutoBattle(nextVal);
    if (engineRef.current) {
      engineRef.current.autoBattle = nextVal;
      if (nextVal && stage.mode === 'Tactics' && engineRef.current.activeUnitType === 'hero' && engineRef.current.actionPhase === 'move') {
        engineRef.current.runHeroAI();
      }
    }
  };

  // Check if active hero has an event item equipped
  const activeHeroStatic = HEROES_DB.find(h => h.id === activeHeroId);
  const equippedEventId = activeHeroStatic ? equippedEventItems[activeHeroStatic.id] : null;
  const equippedEvent = activeHeroStatic ? EVENT_ITEMS_DB[activeHeroStatic.universe] : null;
  const victoryRewardText = lang === 'fr'
    ? `Brèche fermée ! Obtenu +${stage.goldPrize} Or & +${stage.shardPrize} Fragments${stage.tokenPrize ? ` & +${stage.tokenPrize} Jetons` : ''}.`
    : `Rift closed! Earned +${stage.goldPrize} Gold & +${stage.shardPrize} Shards${stage.tokenPrize ? ` & +${stage.tokenPrize} Tokens` : ''}.`;

  const usedBattleItems = battlePickups.filter(item => item.used).length;
  const totalBattleItems = battlePickups.length;
  const battleObjective = stage.mode === 'Tactics'
    ? (lang === 'fr' ? 'Objectif: capturer les cases ressources, puis neutraliser le boss local.' : 'Objective: capture resource tiles, then neutralize the local boss.')
    : stage.mode === 'Smash'
      ? (lang === 'fr' ? 'Objectif: survivre aux vagues, ramasser les drops et casser le champion.' : 'Objective: survive waves, collect drops, and break the champion.')
      : (lang === 'fr' ? 'Objectif: gerer ATB, declencher items et finir la breche.' : 'Objective: manage ATB, trigger items, and close the breach.');

  return (
    <div className="battle-screen" style={{
      minHeight: '100vh',
      background: '#04020a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      padding: '20px 40px',
      fontFamily: '"Share Tech Mono", monospace',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* Top Bar */}
      <div style={{
        width: '100%',
        maxWidth: '1120px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#ff4500' }}>
            BREACH ZONE: {stage.name}
          </h2>
          <span style={{ fontSize: '11px', color: '#aaa' }}>
            Universe: {stage.sourceUniverses?.join(' / ') || stage.universe} ({stage.mode.toUpperCase()})
          </span>
          {stage.modifier && (
            <div style={{ fontSize: '10px', color: stage.modifier.color || '#ffeb3b', marginTop: '4px' }}>
              {stage.modifier.name?.[lang] || stage.modifier.id}: {stage.modifier.desc?.[lang] || ''}
            </div>
          )}
          {stage.isSurvival && (
            <div style={{ fontSize: '10px', color: '#ff8c00', marginTop: '3px' }}>
              {lang === 'fr' ? 'Mode survie: récompenses augmentées, anomalies plus fréquentes.' : 'Survival mode: higher rewards, more unstable anomalies.'}
            </div>
          )}
          {collectionBonusCount > 0 && (
            <div style={{ fontSize: '10px', color: '#2ecc71', marginTop: '3px' }}>
              {lang === 'fr'
                ? `Matrice Nexus: +${Math.min(30, collectionBonusCount * 2)}% toutes stats.`
                : `Nexus matrix: +${Math.min(30, collectionBonusCount * 2)}% all stats.`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {(stage.mode === 'RPG' || stage.mode === 'Tactics') && (
            <button
              onClick={toggleAuto}
              className="btn-retro"
              style={{
                borderColor: autoBattle ? '#2ecc71' : '#444',
                color: autoBattle ? '#2ecc71' : '#aaa',
                fontSize: '11px',
                padding: '6px 12px',
                background: autoBattle ? 'rgba(46, 204, 113, 0.15)' : 'rgba(0,0,0,0.3)'
              }}
            >
              🤖 {getTranslation(lang, 'btnAutoBattle')}
            </button>
          )}

          <button
            onClick={() => {
              sound.playSfx('click');
              setSpeedMultiplier(prev => (prev === 1 ? 2 : 1));
            }}
            className="btn-retro"
            style={{
              borderColor: speedMultiplier === 2 ? '#ffeb3b' : '#444',
              color: speedMultiplier === 2 ? '#ffeb3b' : '#aaa',
              fontSize: '11px',
              padding: '6px 12px',
              background: speedMultiplier === 2 ? 'rgba(255, 235, 59, 0.15)' : 'rgba(0,0,0,0.3)'
            }}
          >
            {getTranslation(lang, 'btnSpeedUp')}
          </button>

          <button onClick={() => onBattleEnd('quit')} className="btn-retro" style={{ borderColor: '#e74c3c', color: '#e74c3c', fontSize: '11px', padding: '6px 12px' }}>
            {getTranslation(lang, 'retreat')}
          </button>
        </div>
      </div>

      {/* Boss Health Bar Display */}
      {bossState && bossState.currentHp > 0 && (
        <div style={{ width: '100%', maxWidth: '1120px', marginBottom: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '4px', textTransform: 'uppercase' }}>
            {getTranslation(lang, 'bossWarning', { name: bossState.name })}
          </div>
          <div style={{ height: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid #e74c3c', borderRadius: '4px', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${(bossState.currentHp / bossState.maxHp) * 100}%`,
              background: 'linear-gradient(to right, #e74c3c, #ff3333)',
              boxShadow: '0 0 10px #e74c3c',
              transition: 'width 0.15s ease-out'
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '9px', fontWeight: 'bold' }}>
              {bossState.currentHp} / {bossState.maxHp} HP
            </div>
          </div>
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '1120px',
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px',
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(57,197,187,0.22)',
        borderRadius: '5px',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '11px', color: '#d9f7f5', lineHeight: 1.35 }}>{battleObjective}</div>
        <div style={{ fontSize: '10px', color: '#ffeb3b' }}>
          {lang === 'fr' ? 'Items' : 'Items'} {usedBattleItems}/{totalBattleItems}
        </div>
        <div style={{ fontSize: '10px', color: '#39c5bb' }}>{stage.mode}</div>
      </div>

      {/* Canvas */}
      <div style={{
        position: 'relative',
        border: '3px solid #39c5bb',
        boxShadow: '0 0 20px rgba(57, 197, 187, 0.4)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#020005',
        marginBottom: '15px'
      }}>
        <div className="crt-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }} />

        <canvas
          ref={canvasRef}
          width="1040"
          height="460"
          onClick={handleCanvasClick}
          style={{ display: 'block', width: '100%', height: 'auto', cursor: stage.mode === 'Tactics' ? 'crosshair' : 'default' }}
        />

        {battleAnomaly && !battleCompleted && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6,
            padding: '7px 14px',
            background: 'rgba(0,0,0,0.72)',
            border: `1px solid ${battleAnomaly.color}`,
            color: battleAnomaly.color,
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: `0 0 12px ${battleAnomaly.color}55`
          }}>
            {battleAnomaly.text[lang]}
          </div>
        )}

        {battleItemLog && !battleCompleted && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6,
            maxWidth: '86%',
            padding: '7px 12px',
            background: 'rgba(0,0,0,0.78)',
            border: `1px solid ${battleItemLog.color}`,
            color: '#fff',
            borderRadius: '4px',
            fontSize: '10px',
            lineHeight: 1.35,
            textAlign: 'center',
            boxShadow: `0 0 14px ${battleItemLog.color}44`
          }}>
            {battleItemLog.text}
          </div>
        )}

        {/* Victory/Defeat Overlay */}
        {battleCompleted && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <h1 className="cyber-title" style={{
              fontSize: '44px',
              color: battleResult === 'victory' ? '#2ecc71' : '#e74c3c',
              textShadow: battleResult === 'victory' ? '0 0 20px #2ecc71' : '0 0 20px #e74c3c',
              marginBottom: '20px'
            }}>
              {battleResult === 'victory' ? getTranslation(lang, 'victory') : getTranslation(lang, 'defeat')}
            </h1>
            <p style={{ fontSize: '15px', color: '#ccc', marginBottom: '30px' }}>
              {battleResult === 'victory'
                ? victoryRewardText
                : getTranslation(lang, 'defeatMsg')}
            </p>
            <button
              onClick={() => onBattleEnd(battleResult)}
              className="btn-retro"
              style={{
                fontSize: '16px',
                padding: '10px 26px',
                background: battleResult === 'victory' ? '#2ecc71' : '#e74c3c',
                color: '#fff',
                borderColor: '#fff'
              }}
            >
              {getTranslation(lang, 'returnToHub')}
            </button>
          </div>
        )}
      </div>

      {/* Control Panel / Actions Dashboard */}
      <div style={{
        width: '100%',
        maxWidth: '1120px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '20px',
        background: 'rgba(20, 15, 30, 0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '16px',
        boxSizing: 'border-box'
      }}>
        {/* Squad List */}
        <div style={{ borderRight: '1px solid #333', paddingRight: '15px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>{getTranslation(lang, 'teamSquad')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {teamState.map((h) => {
              const isSelected = h.id === activeHeroId;
              const isDead = h.currentHp <= 0;
              return (
                <div
                  key={h.id}
                  onClick={() => !isDead && swapActiveHero(h.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: isSelected ? 'rgba(57, 197, 187, 0.15)' : 'rgba(0,0,0,0.3)',
                    border: isSelected ? '1px solid #39c5bb' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    cursor: isDead ? 'default' : 'pointer',
                    opacity: isDead ? 0.4 : 1
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    {h.name.split(' ')[0]} {isSelected && '◀'}
                  </span>
                  <span style={{ fontSize: '11px', color: isDead ? '#e74c3c' : '#2ecc71' }}>
                    {isDead ? 'KO' : `${h.currentHp}/${h.stats.hp} HP`}
                  </span>
                </div>
              );
            })}
          </div>

          {stage.mode === 'RPG' && (
            <button
              onClick={toggleAuto}
              className="btn-retro"
              style={{
                marginTop: '12px',
                width: '100%',
                fontSize: '11px',
                padding: '6px',
                borderColor: autoBattle ? '#2ecc71' : '#ff4500',
                color: autoBattle ? '#2ecc71' : '#ff4500'
              }}
            >
              {getTranslation(lang, 'autoBattle')}: {autoBattle ? 'ON' : 'OFF'}
            </button>
          )}

          {/* Active Event Item triggering button */}
          {equippedEventId && equippedEvent && (
            <button
              onClick={handleActivateEventItem}
              disabled={eventItemUsed || battleCompleted}
              className="btn-retro"
              style={{
                marginTop: '10px',
                width: '100%',
                fontSize: '10px',
                padding: '8px',
                borderColor: eventItemUsed ? '#444' : '#ff4500',
                background: eventItemUsed ? 'transparent' : 'rgba(255, 69, 0, 0.12)',
                color: eventItemUsed ? '#555' : '#ff8c00',
                boxShadow: eventItemUsed ? 'none' : '0 0 10px rgba(255, 69, 0, 0.25)',
                fontWeight: 'bold',
                cursor: eventItemUsed ? 'not-allowed' : 'pointer'
              }}
            >
              🌟 {eventItemUsed ? getTranslation(lang, 'eventUsed') : equippedEvent.name[lang].toUpperCase()}
            </button>
          )}

          {battlePickups.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '10px',
              border: '1px solid rgba(57,197,187,0.28)',
              background: 'rgba(57,197,187,0.05)',
              borderRadius: '4px'
            }}>
              <div style={{ fontSize: '10px', color: '#39c5bb', fontWeight: 'bold', marginBottom: '7px', textTransform: 'uppercase' }}>
                {lang === 'fr' ? 'Items de terrain' : 'Stage items'}
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {battlePickups.map(item => (
                  <button
                    key={item.pickupId}
                    onClick={() => activateBattleItem(item, 'panel')}
                    disabled={item.used || battleCompleted}
                    className="btn-retro"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '9px',
                      padding: '6px',
                      borderColor: item.used ? '#333' : item.color,
                      color: item.used ? '#555' : '#fff',
                      background: item.used ? 'rgba(0,0,0,0.18)' : `${item.color}14`,
                      opacity: item.used ? 0.55 : 1
                    }}
                    title={item[stage.mode === 'Tactics' ? 'tactics' : 'melee']?.[lang]}
                  >
                    <span style={{ color: item.color, fontWeight: 'bold' }}>
                      {item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : item.role.toUpperCase()}
                    </span>
                    {' - '}
                    {item.name[lang]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div>
          {activeHeroObj ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: activeHeroObj.primaryColor }}>
                  {activeHeroObj.name.toUpperCase()} ACTIONS
                </span>
                {stage.mode === 'Tactics' && (
                  <span style={{ fontSize: '9px', color: '#ffb300' }}>
                    {selectedAction === 'defense' ? getTranslation(lang, 'tacticsAction') : getTranslation(lang, 'tacticsMove')}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => handleActiveHeroAbility('simple')}
                  disabled={activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'simple' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  ⚔️ {activeHeroObj.simple.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Basic Action</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('secondary')}
                  disabled={activeHeroObj.currentHp <= 0 || activeHeroObj.cooldown > 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'secondary' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  ⚡ {activeHeroObj.secondary.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>
                    {activeHeroObj.cooldown > 0 ? `COOLDOWN (${Math.ceil(activeHeroObj.cooldown/60)}s)` : 'Skill Action'}
                  </div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('defense')}
                  disabled={activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'defense' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  🛡️ {activeHeroObj.defense.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Shield Defense</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('special')}
                  disabled={activeHeroObj.currentHp <= 0 || activeHeroObj.specialCharge < 100 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className="btn-special"
                  style={{
                    boxShadow: activeHeroObj.specialCharge >= 100 ? `0 0 15px ${activeHeroObj.primaryColor}` : 'none',
                    borderColor: activeHeroObj.specialCharge >= 100 ? '#fff' : '#444',
                    background: activeHeroObj.specialCharge >= 100 ? activeHeroObj.primaryColor : 'rgba(0,0,0,0.4)',
                    color: '#fff'
                  }}
                >
                  🔥 {activeHeroObj.special.name.toUpperCase()}
                  <div style={{ fontSize: '8px', color: '#fff', marginTop: '2px' }}>
                    {activeHeroObj.specialCharge < 100 ? `SPECIAL CHARGE: ${Math.round(activeHeroObj.specialCharge)}%` : 'READY!'}
                  </div>
                </button>

                {stage.mode === 'Tactics' && (
                  <button
                    onClick={() => {
                      if (engineRef.current) {
                        engineRef.current.endActiveTurn();
                        sound.play('confirm');
                      }
                    }}
                    className="btn-retro"
                    style={{
                      gridColumn: 'span 2',
                      padding: '8px 12px',
                      background: '#c0392b',
                      borderColor: '#ff4d4d',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textShadow: '0 0 5px #ff4d4d',
                      marginTop: '4px'
                    }}
                  >
                    ⏭️ {lang === 'fr' ? 'FINIR LE TOUR' : 'END TURN'}
                  </button>
                )}
              </div>

              {stage.mode === 'Smash' && (
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '12px', textAlign: 'center' }}>
                  Move with <strong>W/A/S/D</strong>. Press <strong>J/K/L/I</strong>, collect diamonds, or press <strong>O</strong> for the next stage item. Swap heroes with <strong>1/2/3</strong>.
                </div>
              )}
              {stage.mode === 'Tactics' && (
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '12px', textAlign: 'center' }}>
                  Click highighted <span style={{ color: '#2ecc71' }}>green</span> cells to Move, select skill, then click target in <span style={{ color: '#e74c3c' }}>red</span> cells. Stage items act like one-use map resources.
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#777', padding: '30px' }}>NO HERO SELECTABLE</div>
          )}
        </div>
      </div>
    </div>
  );
}
