import { drawCosmeticAtlasFrame } from '../game/renderer';
import {
  getGameCanvasCosmeticAtlas,
  getGameCanvasCosmeticDurationMs,
  getGameCanvasCosmeticFacing,
  getGameCanvasCosmeticFrame,
  supportsGameCanvasCosmeticPresentation
} from '../game/gameCanvasCosmeticPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { EngineSmash } from '../game/engineSmash';
import { EngineRpg } from '../game/engineRpg';
import { EngineTactics } from '../game/engineTactics';
import { EngineNonCombatTrial } from '../game/nonCombatTrial';
import { ParticleSystem, drawItemIcon, drawPixelSprite, drawUniverseBackground, drawSynergyOverlay, preloadMeleeSpriteSheetSrcs, preloadSpriteSheetSrcs } from '../game/renderer';
import sound from '../game/soundEngine';
import { HEROES_DB as BASE_HEROES_DB, EVENT_ITEMS_DB, EQUIP_ITEMS_DB } from '../game/heroes';
import {
  getBossesForUniverse,
  getFinalePolicyForUniverse,
  getFinalGameBoss,
  getMonstersForUniverse,
  getWorldBossForUniverse
} from '../game/enemies';
import { getTranslation } from '../game/translation';
import { EXPANDED_STAGE_ID_BY_UNIVERSE } from '../game/expandedUniverses';
import { FACTION_RULES, applyFactionBonuses } from '../game/factionProgression';
import { createPlayerHero } from '../game/playerHero';
import { SKIN_CATALOG } from '../game/narrativeSystems';
import { getBattleItemPoolForStage } from '../game/battleItems';
import { getEnemySpriteSheetSrc, getHeroSpriteSheetSrc, getItemSpriteSrc } from '../game/spriteAssets';
import { getSmashPickupPositions } from '../game/smashArenas';
import { getTacticsPickupPositions } from '../game/tacticsBattlefields';
import { resolveStageEnemyData } from '../game/stageEnemyResolver';
import { getSpecialEventRewardById } from '../game/specialEvents';
import GameHudThemeLayer from './GameHudThemeLayer';
import MeleeControlsPanel from './MeleeControlsPanel';
import {
  MELEE_ACTIONS,
  createDefaultMeleeInputMaps,
  diffMeleeActionEdges,
  getMeleeActionsForCode,
  loadMeleeInputMaps,
  mergeMeleeInputSnapshots,
  readGamepadMeleeInput,
  readKeyboardMeleeInput,
  replaceMeleeBinding,
  saveMeleeInputMaps,
  toEngineHeldInput
} from '../game/melee/meleeInputMap';

const getTouchMeleeSnapshot = heldSlots => {
  const held = heldSlots instanceof Set ? heldSlots : new Set();
  const horizontal = (held.has('moveRight') ? 1 : 0) - (held.has('moveLeft') ? 1 : 0);
  const vertical = held.has('crouch') ? 1 : 0;
  const actions = Object.fromEntries(Object.values(MELEE_ACTIONS).map(action => [action, false]));
  actions[MELEE_ACTIONS.moveHorizontal] = horizontal !== 0;
  actions[MELEE_ACTIONS.moveVertical] = vertical !== 0;
  actions[MELEE_ACTIONS.jump] = held.has('jump');
  actions[MELEE_ACTIONS.crouch] = held.has('crouch');
  actions[MELEE_ACTIONS.attackLight] = held.has('attackLight');
  actions[MELEE_ACTIONS.chargedAttack] = held.has('chargedAttack');
  actions[MELEE_ACTIONS.special] = held.has('special');
  actions[MELEE_ACTIONS.shield] = held.has('shield');
  actions[MELEE_ACTIONS.taunt] = held.has('taunt');
  return { horizontal, vertical, actions };
};

const getStableNumericSeed = (value) => {
  let numericValue = Number.NaN;
  try {
    numericValue = Number(value);
  } catch {
    numericValue = Number.NaN;
  }
  const rawSeed = Number.isFinite(numericValue)
    ? Math.trunc(Math.abs(numericValue))
    : String(value || '').split('').reduce(
        (total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0,
        17
      );
  return (rawSeed >>> 0) || 1;
};

function CosmeticAtlasPresentation({ mode, type, side = 'player', cosmetic }) {
  const canvasRef = useRef(null);
  const atlas = getGameCanvasCosmeticAtlas(type, cosmetic);
  const durationMs = getGameCanvasCosmeticDurationMs(type, cosmetic);
  const supported = supportsGameCanvasCosmeticPresentation(mode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!supported || !atlas || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrameId = 0;
    let startedAt = null;
    const draw = timestamp => {
      if (startedAt === null) startedAt = timestamp;
      const elapsedMs = Math.min(durationMs, Math.max(0, timestamp - startedAt));
      const frame = getGameCanvasCosmeticFrame(atlas, elapsedMs, durationMs);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCosmeticAtlasFrame(
        ctx,
        atlas,
        frame,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width - 20,
        canvas.height - 20,
        {
          facing: getGameCanvasCosmeticFacing(type, side),
          glowColor: cosmetic?.color || (type === 'ko' ? '#ffea00' : '#39c5bb'),
          glowBlur: type === 'ko' ? 30 : 24
        }
      );
      if (elapsedMs < durationMs) animationFrameId = requestAnimationFrame(draw);
    };
    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [atlas, cosmetic?.color, durationMs, side, supported, type]);

  if (!supported || !atlas) return null;
  return (
    <canvas
      ref={canvasRef}
      className="game-canvas-cosmetic-atlas"
      data-cosmetic-atlas-type={type}
      data-cosmetic-atlas-source={atlas.sheet}
      width="256"
      height="256"
      aria-label={`${cosmetic?.name?.en || cosmetic?.name?.fr || cosmetic?.universe || type} animation`}
      role="img"
    />
  );
}

export default function GameCanvas({ lang, playerProfile, activeTeam, stage, heroLevels, equippedGear, equippedEventItems, heroTalents, heroSkins, completedStages, reputationProgress = {}, collectionBonusCount = 0, hiddenUniverses = [], disabledAssets = {}, customBattle = null, hudTheme = null, onBattleEnd, onSessionComplete, sessionPaused = false, dedicatedSession = false }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sessionPausedRef = useRef(sessionPaused);
  const battlePickupsRef = useRef([]);
  const battleItemPoolRef = useRef([]);
  const nextBattleItemDropRef = useRef(520);
  const keysPressed = useRef({});
  const meleePressedCodesRef = useRef(new Set());
  const meleePreviousInputRef = useRef({ player: null, cpu: null });
  const meleeTouchHeldRef = useRef({ player: new Set(), cpu: new Set() });
  const meleeNeutralGateRef = useRef({ player: false, cpu: false });
  const tacticsCameraPointerRef = useRef({
    active: false,
    pointerId: null,
    lastClientX: 0,
    lastClientY: 0,
    travel: 0,
    moved: false
  });
  const suppressTacticsClickRef = useRef(false);
  const lastAnomalyWaveRef = useRef(-1);
  const bootClearedRef = useRef(false);
  const battleCompletionHandledRef = useRef(false);
  const battleCompletedRef = useRef(false);
  const battleItemLogTimerRef = useRef(null);
  const battleAnomalyTimerRef = useRef(null);
  const customPresentationTimerRef = useRef(null);
  const knockoutActorStateRef = useRef({
    heroes: new Map(),
    enemies: new Map()
  });
  const customFieldSuperRef = useRef({
    player: { charge: 0, used: false },
    opponent: { charge: 0, used: false }
  });
  const customAssistRef = useRef({
    player: { used: false },
    opponent: { used: false }
  });
  
  const [activeHeroId, setActiveHeroId] = useState(activeTeam[0]);
  const [teamState, setTeamState] = useState([]);
  const [opponentState, setOpponentState] = useState([]);
  const [activeOpponentId, setActiveOpponentId] = useState('');
  const [bossState, setBossState] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null); // tactics
  const [autoBattle, setAutoBattle] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1 | 2
  const [battleCompleted, setBattleCompleted] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleSummary, setBattleSummary] = useState(null);
  const [battleAnomaly, setBattleAnomaly] = useState(null);
  const [battlePickups, setBattlePickups] = useState([]);
  const [battleItemLog, setBattleItemLog] = useState(null);
  const [combatBooting, setCombatBooting] = useState(true);
  const [combatRuntimeError, setCombatRuntimeError] = useState(null);
  const [spriteBootStatus, setSpriteBootStatus] = useState(null);
  const [customFieldSuperState, setCustomFieldSuperState] = useState(customFieldSuperRef.current);
  const [customAssistState, setCustomAssistState] = useState(customAssistRef.current);
  const [customPresentation, setCustomPresentation] = useState(null);
  const [preMatchAnnouncement, setPreMatchAnnouncement] = useState(null);
  const preMatchCueRef = useRef(null);
  const [meleeInputMaps, setMeleeInputMaps] = useState(() => loadMeleeInputMaps());
  const meleeInputMapsRef = useRef(meleeInputMaps);
  meleeInputMapsRef.current = meleeInputMaps;
  
  const [activeSynergies, setActiveSynergies] = useState([]);
  const applySkin = (hero) => {
    const skin = SKIN_CATALOG[heroSkins?.[hero.id]];
    return skin ? { ...hero, ...skin.colors, activeSkin: skin } : hero;
  };
  const HEROES_DB = [createPlayerHero(playerProfile), ...BASE_HEROES_DB].map(applySkin);
  const disabledHeroSet = new Set(disabledAssets.heroes || []);
  const disabledEnemySet = new Set(disabledAssets.enemies || []);
  const disabledGearSet = new Set(disabledAssets.gear || []);
  const hiddenUniverseSet = new Set(hiddenUniverses || []);
  const battleConfig = customBattle || stage.customBattle || null;
  battleCompletedRef.current = battleCompleted;

  const handleMeleeRemap = (side, slot, code) => {
    setMeleeInputMaps(previous => saveMeleeInputMaps(
      replaceMeleeBinding(previous, side, slot, code)
    ));
  };

  const handleResetMeleeInputs = () => {
    setMeleeInputMaps(saveMeleeInputMaps(createDefaultMeleeInputMaps()));
  };

  const handleMeleeTouchAction = (slot, phase) => {
    const held = meleeTouchHeldRef.current.player;
    if (phase === 'down') held.add(slot);
    else held.delete(slot);
  };

  const clearMeleeControls = () => {
    engineRef.current?.clearMeleeInputState?.('player');
    engineRef.current?.clearMeleeInputState?.('cpu');
    keysPressed.current = {};
    meleePressedCodesRef.current.clear();
    meleePreviousInputRef.current = { player: null, cpu: null };
    meleeTouchHeldRef.current.player.clear();
    meleeTouchHeldRef.current.cpu.clear();
    meleeNeutralGateRef.current = { player: true, cpu: true };
  };

  // Une pause pilotee par le shell vide les controles sans reconstruire le moteur.
  useEffect(() => {
    sessionPausedRef.current = sessionPaused;
    engineRef.current?.setPaused?.(sessionPaused);
    if (!sessionPaused) return;
    clearMeleeControls();
    tacticsCameraPointerRef.current = {
      active: false,
      pointerId: null,
      lastClientX: 0,
      lastClientY: 0,
      travel: 0,
      moved: false
    };
    suppressTacticsClickRef.current = false;
  }, [sessionPaused]);
  const arenaStage = ['Smash', 'Tactics'].includes(stage.mode) && hiddenUniverseSet.has(stage.universe)
    ? { ...stage, forceBaseArena: true, dlcSuppressedArena: true }
    : stage;
  const getEnemyAdminKey = (universe, enemy) => `${universe}::${enemy?.name || 'unknown'}`;

  const syncBattlePickups = (nextPickups) => {
    battlePickupsRef.current = nextPickups;
    setBattlePickups(nextPickups);
  };

  const clearManagedTimer = (timerRef) => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const scheduleBattleItemLogClear = (durationMs) => {
    clearManagedTimer(battleItemLogTimerRef);
    const timerId = window.setTimeout(() => {
      if (battleItemLogTimerRef.current !== timerId) return;
      battleItemLogTimerRef.current = null;
      setBattleItemLog(null);
    }, durationMs);
    battleItemLogTimerRef.current = timerId;
  };

  const scheduleBattleAnomalyClear = (durationMs) => {
    clearManagedTimer(battleAnomalyTimerRef);
    const timerId = window.setTimeout(() => {
      if (battleAnomalyTimerRef.current !== timerId) return;
      battleAnomalyTimerRef.current = null;
      setBattleAnomaly(null);
    }, durationMs);
    battleAnomalyTimerRef.current = timerId;
  };

  const countNewKnockouts = (camp, actors) => {
    const actorStates = knockoutActorStateRef.current[camp];
    let knockouts = 0;
    actors.forEach(actor => {
      const alive = actor.currentHp > 0;
      const wasAlive = actorStates.has(actor) ? actorStates.get(actor) : alive;
      if (wasAlive && !alive) knockouts++;
      actorStates.set(actor, alive);
    });
    return knockouts;
  };

  const createStagePickups = (currentStage) => {
    if (currentStage.disableItems || currentStage.customBattle?.items === false) return [];
    const pool = getBattleItemPoolForStage(currentStage);
    const tiers = ['pickup', 'pickup', 'pickup', 'summon', 'ultimate'];
    const smashPositions = currentStage.mode === 'Smash'
      ? getSmashPickupPositions(arenaStage, canvasRef.current?.width || 760, canvasRef.current?.height || 360)
      : null;
    const tacticsPositions = currentStage.mode === 'Tactics'
      ? getTacticsPickupPositions(arenaStage)
      : null;
    const positions = currentStage.mode === 'Tactics'
      ? tacticsPositions
      : smashPositions || [
        { x: 170, y: 218 },
        { x: 305, y: 146 },
        { x: 442, y: 218 },
        { x: 640, y: 178 },
        { x: 520, y: 300 }
      ];
    const resolvedPositions = currentStage.mode === 'Tactics' && engineRef.current
      ? positions.map(pos => ({
        ...pos,
        x: engineRef.current.gridStartX + pos.gridX * engineRef.current.cellW + engineRef.current.cellW / 2,
        y: engineRef.current.gridStartY + pos.gridY * engineRef.current.cellH + engineRef.current.cellH / 2
      }))
      : positions;

    return tiers.map((tier, index) => {
      const tierPool = pool.filter(item => item.tier === tier);
      const stageSeed = getStableNumericSeed(currentStage.id);
      const item = tierPool[(stageSeed + index) % Math.max(1, tierPool.length)] || pool[index % Math.max(1, pool.length)];
      const fallbackPosition = resolvedPositions[index]
        || resolvedPositions[resolvedPositions.length - 1]
        || { x: 170 + index * 70, y: currentStage.mode === 'Tactics' ? 250 : 218 };
      return item ? { ...item, ...fallbackPosition, pickupId: `${item.id}_${index}`, used: false } : null;
    }).filter(Boolean);
  };

  const spawnBattleItemDrop = (engine, animTime) => {
    if (stage.disableItems || !engine || battlePickupsRef.current.filter(item => !item.used).length >= 8) return;
    const pool = battleItemPoolRef.current.length ? battleItemPoolRef.current : getBattleItemPoolForStage(stage);
    const tierRoll = animTime % 10;
    const tier = tierRoll === 0 ? 'ultimate' : tierRoll <= 2 ? 'summon' : 'pickup';
    const tierPool = pool.filter(item => item.tier === tier);
    const stageSeed = getStableNumericSeed(stage.id);
    const item = tierPool[(animTime + stageSeed) % Math.max(1, tierPool.length)] || pool[(animTime + stageSeed) % Math.max(1, pool.length)];
    if (!item) return;
    const arenaPickups = stage.mode === 'Smash' && engine.arena?.pickups?.length ? engine.arena.pickups : null;
    const tacticsPickups = stage.mode === 'Tactics'
      ? getTacticsPickupPositions(arenaStage).map(pos => ({
        x: engine.gridStartX + pos.gridX * engine.cellW + engine.cellW / 2,
        y: engine.gridStartY + pos.gridY * engine.cellH + engine.cellH / 2
      }))
      : null;
    const dropPos = arenaPickups
      ? arenaPickups[(animTime + battlePickupsRef.current.length) % arenaPickups.length]
      : tacticsPickups?.[(animTime + battlePickupsRef.current.length) % tacticsPickups.length] || null;
    const drop = {
      ...item,
      pickupId: `${item.id}_drop_${animTime}`,
      x: dropPos?.x || 90 + ((animTime * 37) % Math.max(180, engine.width - 180)),
      y: dropPos?.y || (stage.mode === 'RPG' ? 150 + ((animTime * 17) % 120) : 130 + ((animTime * 19) % 190)),
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
      .filter(h => h && !disabledHeroSet.has(h.id) && !hiddenUniverseSet.has(h.universe))
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

    const factionTeamUniverses = activeTeam
      .map(id => HEROES_DB.find(h => h.id === id))
      .filter(h => h && !disabledHeroSet.has(h.id) && !hiddenUniverseSet.has(h.universe))
      .map(h => h.universe);
    stats = applyFactionBonuses(stats, {
      teamUniverses: factionTeamUniverses,
      heroUniverse: hero.universe,
      stage,
      reputationProgress
    }).stats;

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
      const gear = EQUIP_ITEMS_DB.find(it => it.id === baseGearId)
        || getSpecialEventRewardById(baseGearId);
      if (gear && gear.boost && !hiddenUniverseSet.has(gear.universe)) {
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
    if (stage.arcaAdaptation) {
      stats.hp = Math.round(stats.hp * 1.05);
    }
    if ((stage.heroInstability?.[hero.id] || 0) > 0) {
      stats.hp = Math.max(1, Math.round(stats.hp * 0.95));
      stats.atk = Math.max(1, Math.round(stats.atk * 0.95));
      stats.def = Math.max(1, Math.round(stats.def * 0.95));
      stats.spd = Math.max(1, Math.round(stats.spd * 0.95));
    }
    return stats;
  };

  const getEnemiesData = () => {
    if (stage.nonCombatTrial) {
      return {
        monsters: [],
        bosses: [],
        worldBoss: null,
        customRoster: [],
        finalePolicy: stage.finalePolicy || stage.nonCombatTrial.policy || null,
        nonCombatTrial: stage.nonCombatTrial
      };
    }
    if (battleConfig?.enemyData) {
      const cloneList = list => (Array.isArray(list) ? list.map(enemy => ({ ...enemy })) : []);
      const monsters = cloneList(battleConfig.enemyData.monsters);
      const bosses = cloneList(battleConfig.enemyData.bosses);
      const customRoster = cloneList(battleConfig.enemyData.customRoster);
      return {
        ...battleConfig.enemyData,
        monsters: monsters.length ? monsters : customRoster,
        bosses: bosses.length ? bosses : customRoster.map(enemy => ({ ...enemy, isBoss: true })),
        customRoster,
        worldBoss: battleConfig.enemyData.worldBoss ? { ...battleConfig.enemyData.worldBoss } : null
      };
    }
    const sourceUniverse = stage.finalGameBoss ? 'Matrix' : stage.universe;
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
      const finalePolicy = stage.finalePolicy || getFinalePolicyForUniverse(stage.universe);
      const baseMonsters = ensureList(stage.universe, filterEnemyList(stage.universe, getMonstersForUniverse(stage.universe)));
      const baseBosses = ensureList(stage.universe, filterEnemyList(stage.universe, getBossesForUniverse(stage.universe)), true);
      return {
        monsters: fusedMonsters.length ? fusedMonsters : baseMonsters.map(enemy => scaleEnemy(enemy)),
        bosses: fusedBosses.length ? fusedBosses : baseBosses.map(enemy => scaleEnemy(enemy, true)),
        finalePolicy,
        worldBoss: primaryBoss
          ? (disabledEnemySet.has(getEnemyAdminKey(stage.universe, primaryBoss))
              ? scaleEnemy(fallbackEnemy(stage.universe, true), true)
              : scaleEnemy({
                  ...primaryBoss,
                  name: stage.bossName || primaryBoss.name,
                  hp: Math.round((primaryBoss.hp || 1000) * 1.18),
                  atk: Math.round((primaryBoss.atk || 20) * 1.12)
                }, true))
          : null
      };
    }

    if (stage.finalGameBoss) {
      // Final Boss Stage
      return {
        monsters: ensureList('Matrix', filterEnemyList('Matrix', getMonstersForUniverse('Matrix'))).map(enemy => scaleEnemy(enemy)),
        bosses: ensureList('Matrix', filterEnemyList('Matrix', getBossesForUniverse('Matrix')), true).map(enemy => scaleEnemy(enemy, true)),
        worldBoss: scaleEnemy(getFinalGameBoss(), true)
      };
    }
    const monsters = ensureList(stage.universe, filterEnemyList(stage.universe, getMonstersForUniverse(stage.universe)));
    const bosses = ensureList(stage.universe, filterEnemyList(stage.universe, getBossesForUniverse(stage.universe)), true);
    const universeWorldBoss = getWorldBossForUniverse(stage.universe);
    const worldBoss = universeWorldBoss
      ? (disabledEnemySet.has(getEnemyAdminKey(stage.universe, universeWorldBoss))
          ? fallbackEnemy(stage.universe, true)
          : universeWorldBoss)
      : null;
    const finalePolicy = stage.finalePolicy || getFinalePolicyForUniverse(stage.universe);
    const resolvedEnemyData = resolveStageEnemyData({
      stage,
      monsters,
      bosses,
      worldBoss,
      fallbackMonster: fallbackEnemy(stage.universe),
      fallbackBoss: fallbackEnemy(stage.universe, true)
    });
    return {
      monsters: resolvedEnemyData.monsters.map(enemy => scaleEnemy(enemy)),
      bosses: resolvedEnemyData.bosses.map(enemy => scaleEnemy(enemy, true)),
      finalePolicy,
      worldBoss: resolvedEnemyData.worldBoss
        ? scaleEnemy(resolvedEnemyData.worldBoss, true)
        : null
    };
  };

  const flattenEnemiesData = (enemyData) => {
    if (Array.isArray(enemyData)) return enemyData;
    if (!enemyData || typeof enemyData !== 'object') return [];
    return [
      ...(Array.isArray(enemyData.monsters) ? enemyData.monsters : []),
      ...(Array.isArray(enemyData.bosses) ? enemyData.bosses : []).map(enemy => ({ ...enemy, isBoss: true })),
      ...(enemyData.worldBoss ? [{ ...enemyData.worldBoss, isBoss: true, isWorldBoss: true }] : [])
    ];
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
    ctx.shadowBlur = 0;
    ctx.restore();

    const iconDrawn = drawItemIcon(ctx, item.x, item.y, item, animTime, size * 1.72);
    if (!iconDrawn) {
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Share Tech Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, item.x, item.y + 3);
      ctx.restore();
    }
  };

  const hasSymmetricBattleItemEffect = effect => (
    ['damage', 'summonDamage', 'ultimateDamage', 'heal', 'shield', 'charge']
      .some(key => Number(effect?.[key]) > 0)
  );

  const resolveBattleItemSides = (engine, requestedSide = 'player') => {
    const opponentTriggered = requestedSide === 'opponent'
      && battleConfig?.opponentControl === 'p2';
    const allies = opponentTriggered ? engine?.enemies || [] : engine?.heroes || [];
    const targets = opponentTriggered ? engine?.heroes || [] : engine?.enemies || [];
    const activeAlly = opponentTriggered
      ? stage.mode === 'Smash'
        ? engine.getActiveOpponent?.()
        : stage.mode === 'RPG'
          ? engine.getSelectedEnemy?.()
          : engine.activeUnitType === 'enemy'
            ? engine.activeUnit
            : allies.find(actor => actor.currentHp > 0)
      : stage.mode === 'Smash'
        ? engine.getActiveHero?.()
        : stage.mode === 'RPG'
          ? engine.getSelectedHero?.()
          : engine.activeUnitType === 'hero'
            ? engine.activeUnit
            : allies.find(actor => actor.currentHp > 0);

    return {
      allies,
      targets,
      activeAlly,
      opponentTriggered,
      resolvedSide: opponentTriggered ? 'opponent' : 'player'
    };
  };

  const damageActorsByBattleItem = (engine, actors, amount, color, label) => {
    if (!Array.isArray(actors) || Number(amount) <= 0) return;
    actors.forEach(actor => {
      if (actor.currentHp > 0) {
        const bossFactor = actor.isBoss ? 1.25 : 1;
        actor.currentHp = Math.max(0, actor.currentHp - Math.round(Number(amount) * bossFactor));
        if (actor.currentHp <= 0) actor.state = 'dead';
        engine.particles?.add(actor.x || 360, (actor.y || 160) - 14, 0, -1, color, 6, 32, 'spark');
      }
    });
    engine.particles?.add(engine.width * 0.5, engine.height * 0.28, 0, -1, color, 4, 52, 'text', label);
  };

  const supportActorsByBattleItem = (engine, actors, activeActor, effect, color) => {
    if (!Array.isArray(actors)) return;
    actors.forEach(actor => {
      if (actor.currentHp <= 0) return;
      const maxHp = actor.maxHp || actor.stats?.hp || actor.hp || actor.currentHp;
      if (effect.heal) actor.currentHp = Math.min(maxHp, actor.currentHp + Number(effect.heal));
      if (effect.shield) actor.currentHp = Math.min(maxHp, actor.currentHp + Number(effect.shield));
      if (effect.charge && typeof actor.specialCharge === 'number') {
        const charge = actor === activeActor ? Number(effect.charge) : Math.ceil(Number(effect.charge) * 0.45);
        actor.specialCharge = Math.min(100, actor.specialCharge + charge);
      }
      engine.particles?.add(actor.x || 120, (actor.y || 180) - 18, 0, -1, color, 4, 26, 'spark');
    });
  };

  const activateBattleItem = (pickup, source = 'manual', requestedSide = 'player') => {
    if (sessionPausedRef.current) return;
    if (!pickup || pickup.used || !engineRef.current || battleCompletedRef.current) return;
    const engine = engineRef.current;
    if (stage.mode === 'Smash' && engine.isMatchInputLocked?.()) return;
    const effect = pickup.effect || {};
    const color = pickup.color || '#39c5bb';
    const {
      allies,
      targets,
      activeAlly,
      opponentTriggered,
      resolvedSide
    } = resolveBattleItemSides(engine, requestedSide);
    const symmetricEffect = hasSymmetricBattleItemEffect(effect);

    if (stage.mode === 'RPG') {
      if (!activeAlly || activeAlly.currentHp <= 0 || activeAlly.atb < 100) {
        setBattleItemLog({
          id: pickup.pickupId,
          color,
          text: lang === 'fr'
            ? 'Commande RPG indisponible: attends que le combattant actif ait son ATB pleine.'
            : 'RPG command unavailable: wait until the active fighter has full ATB.'
        });
        scheduleBattleItemLogClear(2600);
        sound.playSfx('click');
        return;
      }
      activeAlly.atb = 0;
      activeAlly.state = pickup.tier === 'ultimate' ? 'attack' : 'defense';
      activeAlly.stateTimer = pickup.tier === 'ultimate' ? 34 : 22;
      if (!opponentTriggered || symmetricEffect) {
        activeAlly.specialCharge = Math.min(100, (activeAlly.specialCharge || 0) + 6);
      }
    }
    if (
      stage.mode === 'Tactics'
      && !engine.applyTacticalBattleItem?.(
        pickup,
        source,
        resolvedSide === 'opponent' ? 'enemy' : 'hero'
      )
    ) return;

    const nextPickups = battlePickupsRef.current.map(item =>
      item.pickupId === pickup.pickupId
        ? { ...item, used: true, source, triggerSide: resolvedSide }
        : item
    );
    syncBattlePickups(nextPickups);

    // Unknown future effects are intentionally consumed without gameplay impact for P2.
    // This prevents an asymmetric fallback from silently buffing P1 or damaging P2.
    if (stage.mode !== 'Tactics' && (!opponentTriggered || symmetricEffect)) {
      if (effect.damage) damageActorsByBattleItem(engine, targets, effect.damage, color, 'ITEM HIT');
      if (effect.summonDamage) damageActorsByBattleItem(engine, targets, effect.summonDamage, color, 'ASSIST');
      if (effect.ultimateDamage) damageActorsByBattleItem(engine, targets, effect.ultimateDamage, color, 'ULTIMATE');
      supportActorsByBattleItem(engine, allies, activeAlly, effect, color);
    }
    if (stage.mode === 'Smash' && typeof engine.itemTriggers === 'number') {
      engine.itemTriggers++;
    }

    const neutralNote = opponentTriggered && !symmetricEffect
      ? (lang === 'fr' ? ' Effet P2 inconnu: signal neutre.' : ' Unknown P2 effect: neutral signal.')
      : '';
    setBattleItemLog({
      id: pickup.pickupId,
      color,
      text: lang === 'fr'
        ? `${pickup.name.fr}: ${(stage.mode === 'RPG' ? pickup.rpg : stage.mode === 'Tactics' ? pickup.tactics : pickup.melee)?.fr || pickup.desc?.fr || ''}${neutralNote}`
        : `${pickup.name.en}: ${(stage.mode === 'RPG' ? pickup.rpg : stage.mode === 'Tactics' ? pickup.tactics : pickup.melee)?.en || pickup.desc?.en || ''}${neutralNote}`
    });
    scheduleBattleItemLogClear(4200);
    sound.playSfx(pickup.tier === 'ultimate' ? 'levelup' : pickup.tier === 'summon' ? 'portal' : 'confirm');
  };

  const activateFirstBattleItem = () => {
    const next = battlePickupsRef.current.find(item => !item.used);
    activateBattleItem(next, 'shortcut');
  };

  const activateTacticalPickupAtCell = (gridX, gridY) => {
    const pickup = battlePickupsRef.current.find(item =>
      !item.used && item.gridX === gridX && item.gridY === gridY
    );
    if (!pickup) return false;
    const triggerSide = battleConfig?.opponentControl === 'p2'
      && engineRef.current?.activeUnitType === 'enemy'
      ? 'opponent'
      : 'player';
    activateBattleItem(pickup, 'tactics-step', triggerSide);
    return true;
  };

  const checkBattleItemPickupCollision = (engine) => {
    if (stage.mode !== 'Smash' || !engine?.getActiveHero) return;
    const activeHero = engine.getActiveHero();
    const candidates = activeHero?.currentHp > 0
      ? [{ actor: activeHero, side: 'player' }]
      : [];
    if (battleConfig?.opponentControl === 'p2') {
      const activeOpponent = engine.getActiveOpponent?.();
      if (activeOpponent?.currentHp > 0) {
        candidates.push({ actor: activeOpponent, side: 'opponent' });
      }
    }
    if (!candidates.length) return;

    battlePickupsRef.current.forEach(item => {
      if (item.used) return;
      const collision = candidates
        .map(candidate => ({
          ...candidate,
          distance: Math.hypot(
            (candidate.actor.x || 0) - item.x,
            (candidate.actor.y || 0) - item.y
          )
        }))
        .filter(candidate => candidate.distance < 34)
        .sort((a, b) => a.distance - b.distance)[0];
      if (collision) activateBattleItem(item, 'pickup', collision.side);
    });
  };

  const showCustomPresentation = (type, cosmetic, side = 'player', durationMs = 1200) => {
    if (!cosmetic) return;
    clearManagedTimer(customPresentationTimerRef);
    setCustomPresentation({
      id: `${type}-${side}-${Date.now()}`,
      type,
      side,
      cosmetic
    });
    const timerId = window.setTimeout(() => {
      if (customPresentationTimerRef.current !== timerId) return;
      setCustomPresentation(null);
      customPresentationTimerRef.current = null;
    }, Math.max(500, durationMs));
    customPresentationTimerRef.current = timerId;
  };

  const activateCustomAssist = (side = 'player') => {
    if (sessionPausedRef.current) return false;
    const assist = battleConfig?.cosmetics?.npcAssist;
    const engine = engineRef.current;
    if (stage.mode === 'Smash' && engine?.isMatchInputLocked?.()) return false;
    if (side === 'opponent' && battleConfig?.opponentControl !== 'p2') return false;
    const {
      allies: alliedActors,
      targets: targetActors,
      activeAlly,
      resolvedSide
    } = resolveBattleItemSides(engine, side);
    const sideState = customAssistRef.current[resolvedSide];
    if (!assist || !engine || battleCompletedRef.current || sideState.used) return false;
    const attacker = activeAlly || alliedActors.find(actor => actor.currentHp > 0);
    if (!attacker || attacker.currentHp <= 0) return false;
    const effect = assist.effect || {};
    const color = assist.color || '#39c5bb';
    const damage = Math.max(0, Math.round(Number(effect.damage) || 0));
    sideState.used = true;

    alliedActors?.forEach(actor => {
      if (actor.currentHp <= 0) return;
      const maxHp = actor.maxHp || actor.stats?.hp || actor.hp || actor.currentHp;
      actor.currentHp = Math.min(
        maxHp,
        actor.currentHp + Math.max(0, Math.round(maxHp * (effect.healRatio || 0)))
      );
      engine.particles?.add(actor.x || engine.width * 0.24, (actor.y || engine.height / 2) - 16, 0, -1, color, 5, 28, 'spark');
    });
    targetActors?.forEach(actor => {
      if (actor.currentHp <= 0 || damage <= 0) return;
      if (stage.mode === 'RPG') {
        engine.applyDamage(attacker, actor, damage);
      } else if (stage.mode === 'Tactics') {
        engine.applyDamage(attacker, actor, damage, null, { actionType: 'simple' });
      } else if (stage.mode === 'Smash') {
        engine.applyDamage(attacker, actor, damage, 10);
      }
    });

    customAssistRef.current = {
      ...customAssistRef.current,
      [resolvedSide]: { ...sideState }
    };
    setCustomAssistState({
      player: { ...customAssistRef.current.player },
      opponent: { ...customAssistRef.current.opponent }
    });
    showCustomPresentation(
      'assist',
      assist,
      resolvedSide,
      assist.visual?.durationMs || 1300
    );
    setBattleItemLog({
      id: `custom-assist-${resolvedSide}`,
      color,
      text: `${resolvedSide === 'opponent' ? 'P2 — ' : 'P1 — '}${assist.name?.[lang] || assist.name?.fr || 'NPC Assist'}`
    });
    scheduleBattleItemLogClear(3600);
    sound.playSfx('portal');
    sound.playSfx('confirm');
    return true;
  };

  const activateCustomFieldSuper = (side = 'player') => {
    if (sessionPausedRef.current) return false;
    const fieldSuper = battleConfig?.fieldSuper;
    const engine = engineRef.current;
    if (stage.mode === 'Smash' && engine?.isMatchInputLocked?.()) return false;
    const resolvedSide = side === 'opponent' ? 'opponent' : 'player';
    const sideState = customFieldSuperRef.current[resolvedSide];
    if (!fieldSuper || !engine || battleCompletedRef.current || sideState.used || sideState.charge < 100) return false;
    const alliedActors = resolvedSide === 'player' ? engine.heroes : engine.enemies;
    const targetActors = resolvedSide === 'player' ? engine.enemies : engine.heroes;
    const effect = fieldSuper.effect || {};
    const color = fieldSuper.color || '#ffeb3b';
    sideState.used = true;
    sideState.charge = 0;
    alliedActors?.forEach(actor => {
      if (actor.currentHp <= 0) return;
      const maxHp = actor.maxHp || actor.stats?.hp || actor.hp || actor.currentHp;
      actor.currentHp = Math.min(maxHp, actor.currentHp + Math.round(maxHp * (effect.healRatio || 0)));
    });
    targetActors?.forEach(actor => {
      if (actor.currentHp <= 0) return;
      actor.currentHp = Math.max(0, actor.currentHp - Math.round(effect.damage || 36));
      if (actor.currentHp <= 0) actor.state = 'dead';
      engine.particles?.add(actor.x || engine.width / 2, (actor.y || engine.height / 2) - 18, 0, -1, color, 8, 36, 'spark');
    });
    engine.particles?.add(
      engine.width / 2,
      engine.height * 0.24,
      0,
      -1,
      color,
      5,
      72,
      'text',
      fieldSuper.name?.[lang] || fieldSuper.name?.fr || 'FIELD SUPER'
    );
    customFieldSuperRef.current = {
      ...customFieldSuperRef.current,
      [resolvedSide]: { ...sideState }
    };
    setCustomFieldSuperState({
      player: { ...customFieldSuperRef.current.player },
      opponent: { ...customFieldSuperRef.current.opponent }
    });
    setBattleItemLog({
      id: `field-super-${resolvedSide}`,
      color,
      text: `${resolvedSide === 'opponent' ? 'P2 — ' : ''}${fieldSuper.name?.[lang] || fieldSuper.name?.fr || 'Field Super'}`
    });
    scheduleBattleItemLogClear(3600);
    sound.playSfx('portal');
    sound.playSfx('special');
    return true;
  };

  useEffect(() => {
    clearManagedTimer(battleItemLogTimerRef);
    clearManagedTimer(battleAnomalyTimerRef);
    clearManagedTimer(customPresentationTimerRef);
    setCombatBooting(true);
    setCombatRuntimeError(null);
    setSpriteBootStatus(null);
    setBattleCompleted(false);
    battleCompletedRef.current = false;
    setBattleResult(null);
    setBattleSummary(null);
    setBattleAnomaly(null);
    setBattleItemLog(null);
    setBossState(null);
    setTeamState([]);
    setOpponentState([]);
    setActiveOpponentId('');
    setEventItemUsed(false);
    keysPressed.current = {};
    lastAnomalyWaveRef.current = -1;
    bootClearedRef.current = false;
    battleCompletionHandledRef.current = false;
    knockoutActorStateRef.current = {
      heroes: new Map(),
      enemies: new Map()
    };
    customAssistRef.current = {
      player: { used: false },
      opponent: { used: false }
    };
    setCustomAssistState({
      player: { ...customAssistRef.current.player },
      opponent: { ...customAssistRef.current.opponent }
    });
    setCustomPresentation(null);
    setPreMatchAnnouncement(null);
    preMatchCueRef.current = null;
    customFieldSuperRef.current = {
      player: { charge: battleConfig?.fieldSuper ? 20 : 0, used: false },
      opponent: {
        charge: battleConfig?.fieldSuper && battleConfig?.opponentControl === 'p2' ? 20 : 0,
        used: false
      }
    };
    setCustomFieldSuperState({
      player: { ...customFieldSuperRef.current.player },
      opponent: { ...customFieldSuperRef.current.opponent }
    });
    const configuredBattleMusic = battleConfig?.battleMusic?.musicStage
      ? battleConfig.battleMusic
      : null;
    const configuredStageMusic = battleConfig?.stageMusic?.musicStage
      ? battleConfig.stageMusic
      : null;
    const configuredCombatMusic = configuredBattleMusic || configuredStageMusic;
    const battleMusicStage = configuredCombatMusic?.musicStage
      ? {
          ...configuredCombatMusic.musicStage,
          name: configuredCombatMusic.name?.[lang]
            || configuredCombatMusic.name?.fr
            || configuredCombatMusic.musicStage.name
        }
      : arenaStage;
    sound.playStageBgm(battleMusicStage, configuredCombatMusic?.state || 'battle');

    const enemyData = getEnemiesData();
    const enemyList = flattenEnemiesData(enemyData);
    let squadHeroes = activeTeam.map(id => {
      const base = HEROES_DB.find(h => h.id === id);
      if (!base || disabledHeroSet.has(base.id) || hiddenUniverseSet.has(base.universe)) return null;
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
    if (enemyList.length === 0 && !stage.nonCombatTrial) {
      setCombatRuntimeError(lang === 'fr'
        ? 'Aucune menace valide dans cette breche. Verifie les assets ennemis actifs dans ADMIN.'
        : 'No valid threat in this breach. Check active enemy assets in ADMIN.');
      setCombatBooting(false);
      sound.stopBgm();
      return undefined;
    }
    const battleItemPool = stage.disableItems ? [] : getBattleItemPoolForStage(stage);
    const heroSpriteContext = stage.mode === 'Tactics' ? 'tactics' : stage.mode === 'Smash' ? 'melee' : 'rpg';
    const spriteSources = [
      ...squadHeroes.map(hero => getHeroSpriteSheetSrc(hero, heroSpriteContext)),
      ...enemyList.map(getEnemySpriteSheetSrc),
      ...battleItemPool.map(getItemSpriteSrc)
    ].filter(Boolean);
    setSpriteBootStatus(lang === 'fr'
      ? `Plaquettes OpenAI: ${spriteSources.length} sprites indexes avant rendu final.`
      : `OpenAI sheets: ${spriteSources.length} sprites indexed before final render.`);
    preloadSpriteSheetSrcs(spriteSources);
    if (stage.mode === 'Smash') {
      squadHeroes.forEach(hero => preloadMeleeSpriteSheetSrcs(hero));
    }
    const activeCategoriesCount = squadHeroes.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {});
    const deployedUniverses = squadHeroes.map(hero => hero.universe);
    const activeFactionRuleIds = new Set(squadHeroes.flatMap(hero => (
      applyFactionBonuses({}, {
        teamUniverses: deployedUniverses,
        heroUniverse: hero.universe,
        stage,
        reputationProgress
      }).activeRules.map(rule => rule.id)
    )));
    const activeFactionSyns = FACTION_RULES
      .filter(rule => activeFactionRuleIds.has(rule.id))
      .map(rule => rule.id);
    const activeSyns = [...new Set([
      ...['marine', 'slayer', 'horror', 'hacker', 'tactical'].filter(cat => (activeCategoriesCount[cat] || 0) >= 2),
      ...activeFactionSyns
    ])];
    setActiveSynergies(activeSyns);
    if (activeSyns.length > 0) {
      sound.playSfx('levelup');
    }
    const particles = new ParticleSystem();
    const canvas = canvasRef.current;
    if (!canvas) {
      setCombatRuntimeError(lang === 'fr'
        ? 'Canvas de combat indisponible. Retourne au hub puis relance la breche.'
        : 'Combat canvas unavailable. Return to the hub and launch the breach again.');
      return undefined;
    }
    const width = canvas.width;
    const height = canvas.height;

    const handleBattleComplete = (result, summary = null) => {
      if (battleCompletionHandledRef.current) return;
      battleCompletionHandledRef.current = true;
      battleCompletedRef.current = true;
      setBattleCompleted(true);
      setBattleResult(result);
      setBattleSummary(summary);
      sound.stopBgm();
      onSessionComplete?.(result, summary);
    };

    // Non-combat trials deliberately bypass every combat engine: their
    // objective objects never become actors with health or attack values.
    if (stage.nonCombatTrial) {
      const trialStage = {
        ...stage,
        drawTrialHero: (ctx, hero, animTime) => drawPixelSprite(
          ctx,
          hero.x,
          hero.y,
          hero,
          animTime,
          hero.facing,
          72,
          'melee'
        )
      };
      engineRef.current = new EngineNonCombatTrial(width, height, squadHeroes, stage.finalePolicy || stage.nonCombatTrial, particles, (type) => sound.playSfx(type), handleBattleComplete, trialStage);
    } else if (stage.mode === 'Smash') {
      engineRef.current = new EngineSmash(width, height, squadHeroes, enemyData, particles, (type) => sound.playSfx(type), handleBattleComplete, arenaStage);
    } else if (stage.mode === 'RPG') {
      engineRef.current = new EngineRpg(width, height, squadHeroes, enemyData, particles, (type) => sound.playSfx(type), handleBattleComplete, arenaStage);
      engineRef.current.isFinalBoss = Boolean(stage.finalGameBoss);
    } else if (stage.mode === 'Tactics') {
      engineRef.current = new EngineTactics(width, height, squadHeroes, enemyData, particles, (type) => sound.playSfx(type), handleBattleComplete, arenaStage);
      engineRef.current.isFinalBoss = Boolean(stage.finalGameBoss);
    }
    if (!engineRef.current) {
      setCombatRuntimeError(lang === 'fr'
        ? `Mode de combat non reconnu: ${stage.mode}.`
        : `Unknown combat mode: ${stage.mode}.`);
      sound.stopBgm();
      return undefined;
    }
    engineRef.current.setPaused?.(sessionPausedRef.current);
    if (stage.mode === 'Smash') {
      const initialPreMatch = engineRef.current.getPreMatchState?.(lang) || null;
      preMatchCueRef.current = initialPreMatch
        ? `${initialPreMatch.state}:${initialPreMatch.cueId}`
        : null;
      setPreMatchAnnouncement(initialPreMatch);
    }

    knockoutActorStateRef.current = {
      heroes: new Map((engineRef.current.heroes || []).map(actor => [
        actor,
        actor.currentHp > 0
      ])),
      enemies: new Map((engineRef.current.enemies || []).map(actor => [
        actor,
        actor.currentHp > 0
      ]))
    };
    battleItemPoolRef.current = battleItemPool;
    nextBattleItemDropRef.current = stage.mode === 'Tactics' ? 999999 : 520;
    syncBattlePickups(createStagePickups(stage));
    setBattleItemLog(null);
    sound.playSfx('portal');
    if (battleConfig?.cosmetics?.introPose) {
      showCustomPresentation(
        'intro',
        battleConfig.cosmetics.introPose,
        'player',
        battleConfig.cosmetics.introPose.animation?.durationMs || 1500
      );
    }

    const handleKeyDown = (e) => {
      if (sessionPausedRef.current || e.defaultPrevented) return;
      keysPressed.current[e.key] = true;
      keysPressed.current[e.code] = true;
      meleePressedCodesRef.current.add(e.code);
      const isCustomP2 = battleConfig?.opponentControl === 'p2';
      if (battleConfig?.fieldSuper && e.code === 'KeyT') activateCustomFieldSuper('player');
      if (battleConfig?.fieldSuper && isCustomP2 && e.code === 'KeyO') activateCustomFieldSuper('opponent');
      if (battleConfig?.cosmetics?.npcAssist && e.code === 'KeyY') activateCustomAssist('player');
      if (battleConfig?.cosmetics?.npcAssist && isCustomP2 && e.code === 'KeyP') activateCustomAssist('opponent');
      if ((e.key === 'o' || e.key === 'O') && stage.mode !== 'Tactics' && !isCustomP2) activateFirstBattleItem();
      if (stage.mode === 'Smash' && engineRef.current) {
        const maps = meleeInputMapsRef.current;
        const boundActions = [
          ...getMeleeActionsForCode(e.code, maps.player),
          ...(isCustomP2 ? getMeleeActionsForCode(e.code, maps.cpu) : [])
        ];
        const editableTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName);
        if (boundActions.length && !editableTarget) e.preventDefault();
        if (isCustomP2 && ['Digit7', 'Digit8', 'Digit9'].includes(e.code)) {
          const opponent = engineRef.current.enemies?.[Number(e.code.slice(-1)) - 7];
          if (opponent) engineRef.current.setActiveOpponent?.(opponent.runtimeId || opponent.id || opponent.name);
        }

        if (e.code === 'Digit1') engineRef.current.setActiveHero(activeTeam[0]);
        if (e.code === 'Digit2' && activeTeam[1]) engineRef.current.setActiveHero(activeTeam[1]);
        if (e.code === 'Digit3' && activeTeam[2]) engineRef.current.setActiveHero(activeTeam[2]);
      }
      if (stage.mode === 'RPG' && isCustomP2 && engineRef.current) {
        if (e.code === 'KeyJ') engineRef.current.triggerEnemyAbility?.('simple');
        if (e.code === 'KeyK') engineRef.current.triggerEnemyAbility?.('secondary');
        if (e.code === 'KeyL') engineRef.current.triggerEnemyAbility?.('defense');
        if (e.code === 'KeyI') engineRef.current.triggerEnemyAbility?.('special');
        if (['Digit7', 'Digit8', 'Digit9'].includes(e.code)) {
          const enemy = engineRef.current.enemies?.[Number(e.code.slice(-1)) - 7];
          if (enemy) engineRef.current.selectEnemy?.(enemy.runtimeId || enemy.id || enemy.name);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
      keysPressed.current[e.code] = false;
      meleePressedCodesRef.current.delete(e.code);
    };

    const clearMeleeInput = () => {
      clearMeleeControls();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) clearMeleeInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearMeleeInput);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const readMeleeInput = (side) => {
      const maps = meleeInputMapsRef.current;
      const map = side === 'cpu' ? maps.cpu : maps.player;
      const keyboard = readKeyboardMeleeInput(meleePressedCodesRef.current, map);
      const gamepads = typeof navigator !== 'undefined' && navigator.getGamepads
        ? navigator.getGamepads()
        : [];
      const gamepad = readGamepadMeleeInput(gamepads?.[side === 'cpu' ? 1 : 0]);
      const touch = getTouchMeleeSnapshot(meleeTouchHeldRef.current[side]);
      return mergeMeleeInputSnapshots(keyboard, gamepad, touch);
    };

    const dispatchMeleeInputEdges = (engine, side, current) => {
      if (meleeNeutralGateRef.current[side]) {
        const hasInput = Math.abs(Number(current?.horizontal) || 0) > 0.35
          || Math.abs(Number(current?.vertical) || 0) > 0.35
          || Object.values(current?.actions || {}).some(Boolean);
        meleePreviousInputRef.current[side] = current;
        if (!hasInput) meleeNeutralGateRef.current[side] = false;
        return true;
      }
      const previous = meleePreviousInputRef.current[side];
      const edges = diffMeleeActionEdges(previous, current);
      meleePreviousInputRef.current[side] = current;

      edges.pressed.forEach(action => {
        if (action === MELEE_ACTIONS.chargedAttack) {
          engine.beginChargedMeleeAttack?.(side);
        } else if (action === MELEE_ACTIONS.shield) {
          engine.setMeleeShield?.(side, true);
        } else if (action === MELEE_ACTIONS.pause) {
          // The shell owns the pause menu. A custom binding is bridged to its
          // existing Escape contract while physical Escape remains untouched.
          if (!meleePressedCodesRef.current.has('Escape')) {
            window.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Escape',
              code: 'Escape',
              bubbles: true
            }));
          }
        } else if ([
          MELEE_ACTIONS.attackLight,
          MELEE_ACTIONS.special,
          MELEE_ACTIONS.taunt,
          MELEE_ACTIONS.jump,
          MELEE_ACTIONS.climb,
          MELEE_ACTIONS.drop,
          MELEE_ACTIONS.ledgeAttack
        ].includes(action)) {
          engine.triggerMeleeAction?.(side, action);
        }
      });

      edges.released.forEach(action => {
        if (action === MELEE_ACTIONS.chargedAttack) engine.releaseChargedMeleeAttack?.(side);
        if (action === MELEE_ACTIONS.shield) engine.setMeleeShield?.(side, false);
      });
      return false;
    };

    let animTime = 0;
    let combatTime = 0;
    let previousFrameTimestamp = null;
    let frameId;

    const tick = (frameTimestamp = performance.now()) => {
      try {
        const frameDeltaMs = previousFrameTimestamp === null
          ? 1000 / 60
          : Math.max(0, Math.min(100, frameTimestamp - previousFrameTimestamp));
        previousFrameTimestamp = frameTimestamp;
        if (sessionPausedRef.current) {
          frameId = requestAnimationFrame(tick);
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('2D context unavailable');
        }
        const renderUniverse = arenaStage.forceBaseArena || arenaStage.dlcSuppressedArena
          ? 'Nexus de Convergence'
          : stage.universe;
        const usingOpenAiBackdrop = drawUniverseBackground(ctx, renderUniverse, width, height, stage.mode);
        if (!bootClearedRef.current) {
          bootClearedRef.current = true;
          setCombatBooting(false);
        }

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
          let meleeHeldP1 = keysPressed.current;
          let meleeHeldP2 = {};
          if (stage.mode === 'Smash') {
            const playerInput = readMeleeInput('player');
            const playerNeutralGated = dispatchMeleeInputEdges(engine, 'player', playerInput);
            meleeHeldP1 = playerNeutralGated ? {} : toEngineHeldInput(playerInput);
            if (battleConfig?.opponentControl === 'p2') {
              const opponentInput = readMeleeInput('cpu');
              const opponentNeutralGated = dispatchMeleeInputEdges(engine, 'cpu', opponentInput);
              meleeHeldP2 = opponentNeutralGated ? {} : toEngineHeldInput(opponentInput);
            }
          }
          const actorsObservedDuringUpdate = {
            heroes: new Set(engine.heroes || []),
            enemies: new Set(engine.enemies || [])
          };
          const loops = speedMultiplierRef.current;
          const updateLoops = stage.mode === 'Smash' && engine.isPreMatchLocked?.() ? 1 : loops;
          let matchInputLocked = false;
          for (let l = 0; l < updateLoops; l++) {
            engine.update(meleeHeldP1, meleeHeldP2, {
              preMatchDeltaMs: frameDeltaMs,
              stageDeltaMs: frameDeltaMs
            });
            (engine.heroes || []).forEach(actor => actorsObservedDuringUpdate.heroes.add(actor));
            (engine.enemies || []).forEach(actor => actorsObservedDuringUpdate.enemies.add(actor));
          }
          matchInputLocked = stage.mode === 'Smash' && engine.isMatchInputLocked?.();
          if (stage.mode === 'Smash') {
            const nextPreMatch = engine.getPreMatchState?.(lang) || null;
            const cueKey = nextPreMatch ? `${nextPreMatch.state}:${nextPreMatch.cueId}` : null;
            if (cueKey && cueKey !== preMatchCueRef.current) {
              preMatchCueRef.current = cueKey;
              setPreMatchAnnouncement(nextPreMatch);
              if (nextPreMatch.cueId === '3') {
                clearManagedTimer(customPresentationTimerRef);
                setCustomPresentation(current => current?.type === 'intro' ? null : current);
              }
            }
          }
          if (battleConfig?.fieldSuper && !matchInputLocked) {
            const chargeSides = battleConfig.opponentControl === 'p2'
              ? ['player', 'opponent']
              : ['player'];
            chargeSides.forEach(side => {
              const fieldState = customFieldSuperRef.current[side];
              if (!fieldState.used) fieldState.charge = Math.min(100, fieldState.charge + 0.055 * loops);
            });
            if (animTime % 12 === 0) {
              setCustomFieldSuperState({
                player: { ...customFieldSuperRef.current.player },
                opponent: { ...customFieldSuperRef.current.opponent }
              });
            }
          }
          if (battleConfig?.cosmetics?.koEffect) {
            const knockedOutHeroes = countNewKnockouts(
              'heroes',
              [...actorsObservedDuringUpdate.heroes]
            );
            const knockedOutEnemies = countNewKnockouts(
              'enemies',
              [...actorsObservedDuringUpdate.enemies]
            );
            if (knockedOutHeroes > 0 || knockedOutEnemies > 0) {
              const presentationSide = knockedOutHeroes > 0 && knockedOutEnemies > 0
                ? 'both'
                : knockedOutEnemies > 0
                  ? 'player'
                  : 'opponent';
              showCustomPresentation(
                'ko',
                battleConfig.cosmetics.koEffect,
                presentationSide,
                battleConfig.cosmetics.koEffect.visual?.durationMs || 900
              );
            }
          }
          particles.update();

          engine.draw(ctx, animTime, lang);
          if (stage.mode !== 'RPG' && !matchInputLocked) {
            battlePickupsRef.current.forEach(item => {
              const tacticalScreen = stage.mode === 'Tactics'
                && Number.isFinite(item.gridX)
                && Number.isFinite(item.gridY)
                ? engine.gridToScreen?.(item.gridX, item.gridY)
                : null;
              drawBattleItemPickup(
                ctx,
                tacticalScreen ? { ...item, ...tacticalScreen } : item,
                animTime
              );
            });
          }
          if (!matchInputLocked) checkBattleItemPickupCollision(engine);
          if (!matchInputLocked && stage.mode !== 'Tactics' && combatTime > nextBattleItemDropRef.current) {
            spawnBattleItemDrop(engine, combatTime);
            nextBattleItemDropRef.current = combatTime + (stage.mode === 'Smash' ? 540 : 780);
          }
          particles.draw(ctx);
          drawSynergyOverlay(ctx, activeSynergies, width, height, animTime);

          const anomalyRate = stage.isSurvival ? 420 : 720;
          const anomalyWave = Math.floor(combatTime / anomalyRate);
          if (!matchInputLocked && !stage.disableHazards && combatTime > 180 && anomalyWave !== lastAnomalyWaveRef.current && combatTime % anomalyRate < 2) {
            lastAnomalyWaveRef.current = anomalyWave;
            const anomaly = BATTLE_ANOMALIES[
              (getStableNumericSeed(stage.id) + anomalyWave) % BATTLE_ANOMALIES.length
            ];
            setBattleAnomaly(anomaly);
            scheduleBattleAnomalyClear(3600);

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
          setOpponentState([...(engine.enemies || [])]);
          const selectedOpponent = stage.mode === 'RPG'
            ? engine.getSelectedEnemy?.()
            : stage.mode === 'Tactics' && engine.activeUnitType === 'enemy'
              ? engine.activeUnit
              : stage.mode === 'Smash'
                ? engine.getActiveOpponent?.()
                : null;
          setActiveOpponentId(selectedOpponent?.runtimeId || selectedOpponent?.id || selectedOpponent?.name || '');
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

        if (!(stage.mode === 'Smash' && engineRef.current?.isMatchInputLocked?.())) combatTime++;
        animTime++;
        frameId = requestAnimationFrame(tick);
      } catch (error) {
        console.error('Combat render loop failed', error);
        setCombatBooting(false);
        setCombatRuntimeError(lang === 'fr'
          ? 'La simulation de breche a ete interrompue. Retourne au hub puis relance le combat.'
          : 'The breach simulation was interrupted. Return to the hub and launch combat again.');
        sound.stopBgm();
      }
    };

    tick();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearMeleeInput);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(frameId);
      clearManagedTimer(battleItemLogTimerRef);
      clearManagedTimer(battleAnomalyTimerRef);
      clearManagedTimer(customPresentationTimerRef);
      knockoutActorStateRef.current = {
        heroes: new Map(),
        enemies: new Map()
      };
      engineRef.current?.dispose?.();
      engineRef.current = null;
      sound.stopBgm();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeTeam]);

  const handleCanvasClick = (e) => {
    if (sessionPausedRef.current) return;
    if (stage.mode !== 'Tactics' || !engineRef.current) return;
    if (suppressTacticsClickRef.current) {
      suppressTacticsClickRef.current = false;
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const engine = engineRef.current;
    const grid = engine.screenToGrid?.(clickX, clickY) || {
      x: Math.floor((clickX - engine.gridStartX) / engine.cellW),
      y: Math.floor((clickY - engine.gridStartY) / engine.cellH)
    };
    const gridC = grid.x;
    const gridR = grid.y;

    if (gridC >= 0 && gridC < engine.cols && gridR >= 0 && gridR < engine.rows) {
      const result = engine.handleCellClick(gridC, gridR);
      if (result?.type === 'move') activateTacticalPickupAtCell(gridC, gridR);
    }
  };

  const handleTacticsPointerDown = (e) => {
    if (sessionPausedRef.current) return;
    if (stage.mode !== 'Tactics' || e.button !== 0 || !engineRef.current) return;
    suppressTacticsClickRef.current = false;
    tacticsCameraPointerRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      travel: 0,
      moved: false
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleTacticsPointerMove = (e) => {
    if (sessionPausedRef.current) return;
    const pointer = tacticsCameraPointerRef.current;
    if (
      stage.mode !== 'Tactics'
      || !pointer.active
      || pointer.pointerId !== e.pointerId
      || !engineRef.current
    ) return;
    if ((e.buttons & 1) === 0) {
      finishTacticsPointer(e, false);
      return;
    }

    const deltaClientX = e.clientX - pointer.lastClientX;
    const deltaClientY = e.clientY - pointer.lastClientY;
    pointer.lastClientX = e.clientX;
    pointer.lastClientY = e.clientY;
    pointer.travel += Math.hypot(deltaClientX, deltaClientY);
    if (pointer.travel <= 4) return;

    pointer.moved = true;
    const rect = canvasRef.current.getBoundingClientRect();
    engineRef.current.panCameraBy?.(
      deltaClientX * (canvasRef.current.width / rect.width),
      deltaClientY * (canvasRef.current.height / rect.height)
    );
    e.preventDefault();
  };

  const finishTacticsPointer = (e, suppressClick = true) => {
    const pointer = tacticsCameraPointerRef.current;
    if (!pointer.active || pointer.pointerId !== e.pointerId) return;
    suppressTacticsClickRef.current = suppressClick && pointer.moved;
    tacticsCameraPointerRef.current = {
      active: false,
      pointerId: null,
      lastClientX: 0,
      lastClientY: 0,
      travel: 0,
      moved: false
    };
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const cancelTacticsPointer = (e) => {
    finishTacticsPointer(e, false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (stage.mode !== 'Tactics' || !canvas) return undefined;
    const handleWheel = (event) => {
      if (sessionPausedRef.current) return;
      if (!engineRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const anchorX = (event.clientX - rect.left) * (canvas.width / rect.width);
      const anchorY = (event.clientY - rect.top) * (canvas.height / rect.height);
      engineRef.current.zoomCameraAt?.(
        event.deltaY < 0 ? 1.12 : 1 / 1.12,
        anchorX,
        anchorY
      );
      event.preventDefault();
    };
    // Native non-passive input prevents the page from scrolling while the
    // pointer is zooming the tactical battlefield.
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [stage.mode]);

  const handleActiveHeroAbility = (type) => {
    if (sessionPausedRef.current) return;
    if (!engineRef.current || battleCompleted) return;
    const engine = engineRef.current;

    if (stage.mode === 'Smash') {
      const activeH = engine.getActiveHero();
      engine.triggerAbility(activeH, type);
    } else if (stage.mode === 'RPG') {
      const activeEnemy = engine.getSelectedEnemy?.();
      if (battleConfig?.opponentControl === 'p2' && activeEnemy?.atb >= 100) {
        engine.triggerEnemyAbility?.(activeEnemy, type);
      } else {
        const activeH = engine.getSelectedHero();
        engine.triggerAbility(activeH, type);
      }
    } else if (stage.mode === 'Tactics') {
      const canControlEnemy = battleConfig?.opponentControl === 'p2' && engine.activeUnitType === 'enemy';
      if ((!canControlEnemy && engine.activeUnitType !== 'hero') || engine.actionPhase === 'enemy_ai' || engine.actionPhase === 'end') return;
      engine.selectAction?.(type);
      setSelectedAction(engine.selectedAction);
    }
  };

  const handleCancelTacticsAction = () => {
    if (sessionPausedRef.current) return;
    if (stage.mode !== 'Tactics' || !engineRef.current || battleCompleted) return;
    if (engineRef.current.cancelSelectedAction?.()) {
      setSelectedAction(engineRef.current.selectedAction);
      sound.playSfx('click');
    }
  };

  // Trigger Combat Event Item
  const handleActivateEventItem = () => {
    if (sessionPausedRef.current) return;
    if (!engineRef.current || eventItemUsed || battleCompleted) return;
    if (stage.mode === 'Smash' && engineRef.current.isMatchInputLocked?.()) return;

    const activeHero = HEROES_DB.find(h => h.id === activeHeroId);
    if (!activeHero || hiddenUniverseSet.has(activeHero.universe)) return;

    const eventId = equippedEventItems[activeHero.id];
    if (!eventId) return;

    const eventDetails = EVENT_ITEMS_DB[activeHero.universe];
    if (!eventDetails) return;

    // Trigger effect in engine
    if (engineRef.current.triggerCombatEvent(eventDetails.effect) === true) {
      setEventItemUsed(true);
    }
  };

  const swapActiveHero = (id) => {
    if (sessionPausedRef.current) return;
    if (!engineRef.current) return;
    if (stage.mode === 'Smash') {
      engineRef.current.setActiveHero(id);
    } else if (stage.mode === 'RPG') {
      if (battleConfig?.opponentControl === 'p2' && opponentState.some(enemy => (
        (enemy.runtimeId || enemy.id || enemy.name) === id
      ))) {
        engineRef.current.selectEnemy?.(id);
      } else {
        engineRef.current.selectHero(id);
      }
    }
  };

  const activeOpponentObj = opponentState.find(enemy => (
    (enemy.runtimeId || enemy.id || enemy.name) === activeOpponentId
  )) || opponentState.find(enemy => enemy.currentHp > 0);
  const opponentHasCommand = battleConfig?.opponentControl === 'p2' && (
    (stage.mode === 'RPG' && activeOpponentObj?.atb >= 100)
    || (stage.mode === 'Tactics' && engineRef.current?.activeUnitType === 'enemy')
  );
  const activeHeroObj = opponentHasCommand
    ? activeOpponentObj
    : teamState.find(h => h.id === activeHeroId) || teamState[0];
  const getCombatantMove = (combatant, type) => {
    if (combatant?.[type]) return combatant[type];
    const baseDamage = Math.max(1, Number(combatant?.atk) || 8);
    if (type === 'secondary') return { name: combatant?.special || 'Frappe lourde', dmg: 1.45, cd: 4 };
    if (type === 'defense') return { name: 'Garde', dur: 1.6, reduce: 0.55 };
    if (type === 'special') return { name: combatant?.special || 'Rupture ennemie', dmg: 2.4 };
    return { name: combatant?.weapon || 'Attaque', dmg: Math.max(0.7, baseDamage / 10) };
  };

  const toggleAuto = () => {
    if (sessionPausedRef.current) return;
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
  const activeHeroUniverseEnabled = activeHeroStatic && !hiddenUniverseSet.has(activeHeroStatic.universe);
  const equippedEventId = activeHeroUniverseEnabled ? equippedEventItems[activeHeroStatic.id] : null;
  const equippedEvent = activeHeroUniverseEnabled ? EVENT_ITEMS_DB[activeHeroStatic.universe] : null;
  const preMatchLocked = stage.mode === 'Smash'
    && !stage.nonCombatTrial
    && preMatchAnnouncement?.locked !== false;
  const victoryRewardText = stage.isCustomBattle
    ? (lang === 'fr'
        ? 'Simulation terminee. Aucun Or, Fragment, Jeton ou progression de campagne n est attribue.'
        : 'Simulation complete. No Gold, Shards, Tokens, or campaign progression is awarded.')
    : stage.nonCombatTrial
      ? (lang === 'fr'
          ? `Épreuve réussie ! Obtenu +${stage.goldPrize} Or & +${stage.shardPrize} Fragments${stage.tokenPrize ? ` & +${stage.tokenPrize} Jetons` : ''}.`
          : `Trial complete! Earned +${stage.goldPrize} Gold & +${stage.shardPrize} Shards${stage.tokenPrize ? ` & +${stage.tokenPrize} Tokens` : ''}.`)
      : lang === 'fr'
      ? `Brèche fermée ! Obtenu +${stage.goldPrize} Or & +${stage.shardPrize} Fragments${stage.tokenPrize ? ` & +${stage.tokenPrize} Jetons` : ''}.`
      : `Rift closed! Earned +${stage.goldPrize} Gold & +${stage.shardPrize} Shards${stage.tokenPrize ? ` & +${stage.tokenPrize} Tokens` : ''}.`;

  const usedBattleItems = battlePickups.filter(item => item.used).length;
  const smashResultLines = battleSummary?.mode === 'Smash'
    ? [
      `${lang === 'fr' ? 'Arene' : 'Arena'}: ${battleSummary.arenaLabel?.[lang] || battleSummary.arenaId}`,
      `${lang === 'fr' ? 'Rang' : 'Grade'} ${battleSummary.grade} | Score ${battleSummary.score} | Objectif ${battleSummary.objectivePct}%`,
      `${lang === 'fr' ? 'Menaces neutralisees' : 'Threats neutralized'}: ${battleSummary.defeatedEnemies} | ${lang === 'fr' ? 'Artefacts' : 'Artifacts'}: ${battleSummary.itemTriggers} | ${lang === 'fr' ? 'Risques terrain' : 'Terrain hits'}: ${battleSummary.hazardHits}`
    ]
    : [];
  const tacticsResultLines = battleSummary?.mode === 'Tactics'
    ? [
      `${lang === 'fr' ? 'Terrain' : 'Battlefield'}: ${battleSummary.battlefieldLabel?.[lang] || battleSummary.battlefieldId}`,
      `${lang === 'fr' ? 'Rang' : 'Grade'} ${battleSummary.grade} | Score ${battleSummary.score} | Objectif ${battleSummary.objectivePct}%`,
      `${battleSummary.objectiveText?.[lang] || battleSummary.objective} | ${lang === 'fr' ? 'Tours' : 'Turns'}: ${battleSummary.turnsElapsed}`,
      `${lang === 'fr' ? 'Menaces neutralisees' : 'Threats neutralized'}: ${battleSummary.defeatedEnemies} | ${lang === 'fr' ? 'Agents debout' : 'Standing agents'}: ${battleSummary.survivingHeroes}`,
      `${battleSummary.missionProfile?.label?.[lang] || battleSummary.missionProfile?.tier || 'Profile'} | ${lang === 'fr' ? 'Renforts' : 'Reinforcements'}: ${battleSummary.reinforcementsCalled || 0} | ${lang === 'fr' ? 'Surtensions' : 'Surges'}: ${battleSummary.hazardPulses || 0}`,
      `${lang === 'fr' ? 'Artefacts tactiques' : 'Tactical artifacts'}: ${battleSummary.tacticalItemsUsed || 0} | ${lang === 'fr' ? 'Impact' : 'Impact'}: ${battleSummary.tacticalItemImpact || 0}`
    ]
    : [];
  const trialResultLines = battleSummary?.mode === 'Trial'
    ? [
      `${lang === 'fr' ? 'Épreuve' : 'Trial'}: ${battleSummary.trialType}`,
      `${lang === 'fr' ? 'Rang' : 'Grade'} ${battleSummary.grade} | Score ${battleSummary.score} | ${lang === 'fr' ? 'Objectif' : 'Objective'} ${battleSummary.progressPct}%`,
      battleSummary.objective?.[lang] || battleSummary.objective?.fr || battleSummary.objective?.en,
      `${lang === 'fr' ? 'Interactions réussies' : 'Successful interactions'}: ${battleSummary.successfulInteractions}/${battleSummary.interactions} | ${lang === 'fr' ? 'Erreurs' : 'Mistakes'}: ${battleSummary.mistakes}`
    ].filter(Boolean)
    : [];
  const totalBattleItems = battlePickups.length;
  const unstableTeamCount = activeTeam.filter(heroId => (stage.heroInstability?.[heroId] || 0) > 0).length;
  const smashObjective = stage.mode === 'Smash'
    ? engineRef.current?.getObjectiveText?.(lang)
    : null;
  const battleObjective = stage.nonCombatTrial
    ? `${lang === 'fr' ? 'Directive A.R.C.A. épreuve' : 'A.R.C.A. trial directive'}: ${smashObjective || stage.nonCombatTrial.objective?.[lang] || stage.nonCombatTrial.objective?.fr || stage.nonCombatTrial.objective?.en}`
    : stage.mode === 'Tactics'
    ? `${lang === 'fr' ? 'Directive A.R.C.A. tactique' : 'A.R.C.A. tactics directive'}: ${engineRef.current?.getObjectiveText?.(lang) || (lang === 'fr' ? 'securiser la grille et garder l escouade lisible.' : 'secure the grid and keep the squad readable.')}`
    : stage.mode === 'Smash'
      ? `${lang === 'fr' ? 'Directive A.R.C.A. melee' : 'A.R.C.A. melee directive'}: ${smashObjective || (lang === 'fr' ? 'tenir les vagues, recuperer les artefacts et briser le champion.' : 'hold the waves, recover artifacts, and break the champion.')}`
      : (lang === 'fr' ? 'Directive A.R.C.A.: synchroniser l ATB, declencher les reliques et fermer la breche.' : 'A.R.C.A. directive: sync ATB, trigger relics, and close the breach.');
  const modeSignal = stage.nonCombatTrial
    ? (lang === 'fr'
        ? 'Épreuve: aucun adversaire ni barre de vie; accomplis uniquement l’objectif du stage.'
        : 'Trial: no opponent or health bar; complete only the stage objective.')
    : stage.mode === 'Tactics'
    ? (lang === 'fr' ? 'Tactique: les items deviennent des ressources de carte.' : 'Tactics: items behave as map resources.')
    : stage.mode === 'Smash'
      ? (lang === 'fr' ? 'Melee: les drops se ramassent dans l arene ou via le panneau.' : 'Melee: drops can be collected in-arena or from the panel.')
      : (lang === 'fr' ? 'RPG: les reliques soutiennent le tempo ATB.' : 'RPG: relics support ATB tempo.');

  return (
    <div className={`battle-screen ${hudTheme ? 'game-hud-themed-interface' : ''}`} style={{
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
      <GameHudThemeLayer theme={hudTheme} mode={stage.mode} />
      {/* Top Bar */}
      <div className="battle-top-bar" style={{
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
            {lang === 'fr' ? 'Univers' : 'Universe'}: {stage.sourceUniverses?.join(' / ') || stage.universe} ({stage.mode.toUpperCase()})
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
          {stage.arcaAdaptation && (
            <div style={{ fontSize: '10px', color: '#2ecc71', marginTop: '3px' }}>
              {stage.nonCombatTrial
                ? (lang === 'fr'
                  ? 'A.R.C.A. conserve les données de la tentative précédente pour relire l objectif.'
                  : 'A.R.C.A. retains the previous attempt data to clarify the objective.')
                : (lang === 'fr'
                  ? `Adaptation A.R.C.A.: ${stage.bossName} scanne, +5% HP equipe.`
                  : `A.R.C.A. adaptation: ${stage.bossName} scanned, +5% team HP.`)}
            </div>
          )}
          {unstableTeamCount > 0 && !stage.nonCombatTrial && (
            <div style={{ fontSize: '10px', color: '#ffeb3b', marginTop: '3px' }}>
              {lang === 'fr'
                ? `Instabilite de repli: ${unstableTeamCount} heros a -5% stats pendant cette mission.`
                : `Retreat instability: ${unstableTeamCount} hero(es) at -5% stats for this mission.`}
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
              title={lang === 'fr' ? 'Active ou desactive les actions automatiques en combat.' : 'Toggle automatic combat actions.'}
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
            title={lang === 'fr' ? 'Passe la vitesse du combat entre normal et x2.' : 'Switch combat speed between normal and x2.'}
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

          {!dedicatedSession && (
            <button
              onClick={() => onBattleEnd('quit')}
              className="btn-retro"
              title={stage.isCustomBattle
                ? (lang === 'fr' ? 'Quitte la simulation sans modifier la progression et retourne a sa configuration.' : 'Leave the simulation without changing progression and return to setup.')
                : stage.nonCombatTrial
                  ? (lang === 'fr' ? 'Quitte l épreuve et retourne au hub. La tentative reste inachevée.' : 'Leave the trial and return to the hub. The attempt remains incomplete.')
                  : (lang === 'fr' ? 'Quitte le combat et retourne au hub. La mission compte comme abandon.' : 'Leave combat and return to the hub. The mission counts as a retreat.')}
              style={{ borderColor: '#e74c3c', color: '#e74c3c', fontSize: '11px', padding: '6px 12px' }}
            >
              {stage.isCustomBattle
                ? (lang === 'fr' ? '← CONFIGURATION' : '← SETUP')
                : getTranslation(lang, 'retreat')}
            </button>
          )}
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
        <div style={{ fontSize: '11px', color: '#d9f7f5', lineHeight: 1.35 }}>
          <strong style={{ color: '#39c5bb' }}>{stage.bossName || stage.universe}</strong>
          {' - '}
          {battleObjective}
          <div style={{ marginTop: '3px', color: '#9fb9bd', fontSize: '10px' }}>{modeSignal}</div>
        </div>
        <div style={{ fontSize: '10px', color: '#ffeb3b', textAlign: 'center' }}>
          {lang === 'fr' ? 'Artefacts' : 'Artifacts'} {usedBattleItems}/{totalBattleItems}
        </div>
        <div style={{ fontSize: '10px', color: '#39c5bb', textAlign: 'center' }}>
          SFX {sound.muted ? 'OFF' : 'ON'} / {stage.mode}
        </div>
      </div>

      {battleConfig?.fieldSuper && (
        <div style={{
          width: '100%',
          maxWidth: '1120px',
          display: 'grid',
          gridTemplateColumns: battleConfig.opponentControl === 'p2' ? '1fr 1fr' : '1fr',
          gap: 8,
          marginBottom: 10
        }}>
          {[
            { side: 'player', label: 'P1', key: 'T' },
            ...(battleConfig.opponentControl === 'p2' ? [{ side: 'opponent', label: 'P2', key: 'O' }] : [])
          ].map(entry => {
            const state = customFieldSuperState[entry.side] || { charge: 0, used: false };
            const ready = !state.used && state.charge >= 100 && !battleCompleted && !preMatchLocked;
            return (
              <button
                type="button"
                key={entry.side}
                className="btn-retro"
                onClick={() => activateCustomFieldSuper(entry.side)}
                disabled={!ready}
                style={{
                  padding: '8px 10px',
                  borderColor: ready ? (battleConfig.fieldSuper.color || '#ffeb3b') : '#34454b',
                  color: ready ? '#fff' : '#789096',
                  background: ready ? `${battleConfig.fieldSuper.color || '#ffeb3b'}22` : 'rgba(0,0,0,0.28)'
                }}
              >
                {entry.label} / {battleConfig.fieldSuper.name?.[lang] || battleConfig.fieldSuper.name?.fr || 'FIELD SUPER'}
                {' — '}
                {preMatchLocked
                  ? 'PRE-MATCH'
                  : state.used
                    ? (lang === 'fr' ? 'UTILISE' : 'USED')
                    : `${Math.round(state.charge)}% [${entry.key}]`}
              </button>
            );
          })}
        </div>
      )}

      {battleConfig?.cosmetics?.npcAssist && (
        <div style={{
          width: '100%',
          maxWidth: '1120px',
          display: 'grid',
          gridTemplateColumns: battleConfig.opponentControl === 'p2' ? '1fr 1fr' : '1fr',
          gap: 8,
          marginBottom: 10
        }}>
          {[
            { side: 'player', label: 'P1', key: 'Y' },
            ...(battleConfig.opponentControl === 'p2' ? [{ side: 'opponent', label: 'P2', key: 'P' }] : [])
          ].map(entry => {
            const used = customAssistState[entry.side]?.used;
            return (
              <button
                type="button"
                key={entry.side}
                className="btn-retro"
                onClick={() => activateCustomAssist(entry.side)}
                disabled={used || battleCompleted || preMatchLocked}
                style={{
                  padding: '8px 10px',
                  borderColor: used ? '#34454b' : (battleConfig.cosmetics.npcAssist.color || '#39c5bb'),
                  color: used ? '#789096' : '#fff',
                  background: used ? 'rgba(0,0,0,0.28)' : `${battleConfig.cosmetics.npcAssist.color || '#39c5bb'}22`
                }}
              >
                {entry.label} / {battleConfig.cosmetics.npcAssist.name?.[lang] || battleConfig.cosmetics.npcAssist.name?.fr || 'NPC ASSIST'}
                {' — '}
                {preMatchLocked
                  ? 'PRE-MATCH'
                  : used
                    ? (lang === 'fr' ? 'UTILISE' : 'USED')
                    : `[${entry.key}]`}
              </button>
            );
          })}
        </div>
      )}

      {/* Canvas */}
      <div style={{
        position: 'relative',
        border: '3px solid #39c5bb',
        boxShadow: '0 0 20px rgba(57, 197, 187, 0.4)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#020005',
        marginBottom: '15px',
        width: '100%',
        maxWidth: '1280px'
      }}>
        <div className="crt-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }} />

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}
        >
          {preMatchAnnouncement
            ? preMatchAnnouncement.cueId === 'coordinates'
              ? `${preMatchAnnouncement.cue}. ${preMatchAnnouncement.message}`
              : preMatchAnnouncement.cue
            : ''}
        </div>

        {preMatchAnnouncement?.locked && (
          <div className="melee-pre-match-cue-layer" aria-hidden="true">
            <strong>{preMatchAnnouncement.cue}</strong>
            <span>
              {preMatchAnnouncement.cueId === 'coordinates'
                ? preMatchAnnouncement.message
                : `A.R.C.A. / ${preMatchAnnouncement.source}`}
            </span>
          </div>
        )}

        {preMatchAnnouncement?.canSkip && (
          <button
            type="button"
            className="btn-retro melee-pre-match-skip"
            onClick={() => {
              if (!engineRef.current?.skipPreMatch?.()) return;
              clearMeleeControls();
              sound.playSfx('confirm');
            }}
            title={lang === 'fr'
              ? 'Ignore le compte a rebours uniquement pour cette session d entrainement.'
              : 'Skip the countdown for this training session only.'}
          >
            {lang === 'fr' ? 'PASSER EN ENTRAINEMENT' : 'SKIP IN TRAINING'}
          </button>
        )}

        <canvas
          ref={canvasRef}
          width="1040"
          height="460"
          onClick={handleCanvasClick}
          onPointerDown={handleTacticsPointerDown}
          onPointerMove={handleTacticsPointerMove}
          onPointerUp={finishTacticsPointer}
          onPointerCancel={cancelTacticsPointer}
          onLostPointerCapture={cancelTacticsPointer}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            cursor: stage.mode === 'Tactics'
              ? selectedAction
                ? 'crosshair'
                : 'grab'
              : 'default',
            touchAction: stage.mode === 'Tactics' ? 'none' : 'auto'
          }}
        />

        {customPresentation && (
          <div
            className="custom-battle-presentation"
            data-presentation-type={customPresentation.type}
            data-presentation-style={customPresentation.cosmetic.style || 'standard'}
            style={{
              '--presentation-color': customPresentation.cosmetic.color || '#39c5bb',
              '--presentation-duration': `${customPresentation.cosmetic.animation?.durationMs || customPresentation.cosmetic.visual?.durationMs || 1200}ms`
            }}
          >
            <div>
              <CosmeticAtlasPresentation
                mode={stage.mode}
                type={customPresentation.type}
                side={customPresentation.side}
                cosmetic={customPresentation.cosmetic}
              />
              <small>
                {customPresentation.side === 'both'
                  ? `P1 + ${battleConfig?.opponentControl === 'p2' ? 'P2' : 'CPU'}`
                  : customPresentation.side === 'opponent'
                    ? (battleConfig?.opponentControl === 'p2' ? 'P2' : 'CPU')
                    : 'P1'} // {
                  customPresentation.type === 'ko'
                    ? 'K.-O.'
                    : customPresentation.type === 'assist'
                      ? 'ASSIST'
                      : (lang === 'fr' ? 'POSE D INTRODUCTION' : 'INTRODUCTION POSE')
                }
              </small>
              <strong>
                {customPresentation.cosmetic.name?.[lang]
                  || customPresentation.cosmetic.name?.fr
                  || customPresentation.cosmetic.universe}
              </strong>
            </div>
          </div>
        )}

        {(combatBooting || combatRuntimeError) && !battleCompleted && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: combatRuntimeError ? 'rgba(2,0,5,0.92)' : 'rgba(2,0,5,0.62)',
            padding: '18px',
            textAlign: 'center'
          }}>
            <div style={{
              maxWidth: '520px',
              padding: '14px 18px',
              border: `1px solid ${combatRuntimeError ? '#e74c3c' : '#39c5bb'}`,
              background: 'rgba(0,0,0,0.72)',
              borderRadius: '6px',
              boxShadow: combatRuntimeError ? '0 0 18px rgba(231,76,60,0.25)' : '0 0 18px rgba(57,197,187,0.25)'
            }}>
              <div style={{ color: combatRuntimeError ? '#e74c3c' : '#39c5bb', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {combatRuntimeError
                  ? (lang === 'fr' ? 'SIGNAL DE BRECHE INSTABLE' : 'UNSTABLE BREACH SIGNAL')
                  : (lang === 'fr' ? 'SYNCHRONISATION DU COMBAT' : 'SYNCING COMBAT')}
              </div>
              <div style={{ color: '#ddd', fontSize: '11px', lineHeight: 1.45 }}>
                {combatRuntimeError || (lang === 'fr'
                  ? 'A.R.C.A. charge le decor, les signatures d escouade et les artefacts de terrain.'
                  : 'A.R.C.A. is loading the scene, squad signatures, and field artifacts.')}
              </div>
              {!combatRuntimeError && spriteBootStatus && (
                <div style={{ color: '#ffeb3b', fontSize: '10px', lineHeight: 1.35, marginTop: '7px' }}>
                  {spriteBootStatus}
                </div>
              )}
              {combatRuntimeError && (
                <button
                  onClick={() => onBattleEnd('quit')}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Retourne au hub apres une erreur de chargement du combat.' : 'Return to the hub after a combat loading error.'}
                  style={{ marginTop: '12px', borderColor: '#e74c3c', color: '#e74c3c', fontSize: '11px', padding: '7px 14px' }}
                >
                  {lang === 'fr' ? 'RETOUR HUB' : 'RETURN HUB'}
                </button>
              )}
            </div>
          </div>
        )}

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
            {battleResult === 'victory' && battleConfig?.cosmetics?.victoryPose && (
              <div
                className="custom-battle-victory-pose"
                data-pose-style={battleConfig.cosmetics.victoryPose.style || 'standard'}
                style={{
                  '--presentation-color': battleConfig.cosmetics.victoryPose.color || '#2ecc71',
                  '--presentation-duration': `${battleConfig.cosmetics.victoryPose.animation?.durationMs || 1800}ms`
                }}
              >
                <CosmeticAtlasPresentation
                  mode={stage.mode}
                  type="victory"
                  side="player"
                  cosmetic={battleConfig.cosmetics.victoryPose}
                />
                <small>{lang === 'fr' ? 'POSE DE VICTOIRE EQUIPEE' : 'EQUIPPED VICTORY POSE'}</small>
                <strong>
                  {battleConfig.cosmetics.victoryPose.name?.[lang]
                    || battleConfig.cosmetics.victoryPose.name?.fr
                    || battleConfig.cosmetics.victoryPose.universe}
                </strong>
              </div>
            )}
            {[...trialResultLines, ...smashResultLines, ...tacticsResultLines].length > 0 && (
              <div style={{
                width: 'min(520px, 92%)',
                margin: '0 0 24px 0',
                padding: '12px 14px',
                border: '1px solid rgba(57,197,187,0.45)',
                background: 'rgba(4,18,28,0.72)',
                textAlign: 'left',
                color: '#dff',
                fontSize: '11px',
                lineHeight: 1.7
              }}>
                {[...trialResultLines, ...smashResultLines, ...tacticsResultLines].map(line => <div key={line}>{line}</div>)}
              </div>
            )}
            <button
              onClick={() => onBattleEnd(battleResult, {
                battleItemsUsed: battlePickupsRef.current.filter(item => item.used).length,
                battleItemsTotal: battlePickupsRef.current.length,
                battleSummary
              })}
              className="btn-retro"
              title={stage.isCustomBattle
                ? (lang === 'fr' ? 'Ferme le resultat et retourne a la configuration du combat custom.' : 'Close the result and return to custom battle setup.')
                : (lang === 'fr' ? 'Valide le resultat du combat, applique les recompenses ou la defaite, puis retourne au hub.' : 'Confirm the combat result, apply rewards or defeat, then return to the hub.')}
              style={{
                fontSize: '16px',
                padding: '10px 26px',
                background: battleResult === 'victory' ? '#2ecc71' : '#e74c3c',
                color: '#fff',
                borderColor: '#fff'
              }}
            >
              {stage.isCustomBattle
                ? (lang === 'fr' ? 'RETOUR CONFIGURATION' : 'BACK TO SETUP')
                : getTranslation(lang, 'returnToHub')}
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
              const isDead = !stage.nonCombatTrial && h.currentHp <= 0;
              return (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => !isDead && swapActiveHero(h.id)}
                  disabled={isDead || preMatchLocked}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: isSelected ? 'rgba(57, 197, 187, 0.15)' : 'rgba(0,0,0,0.3)',
                    border: isSelected ? '1px solid #39c5bb' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    cursor: isDead || preMatchLocked ? 'default' : 'pointer',
                    opacity: isDead ? 0.4 : 1,
                    color: '#fff',
                    font: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    {h.name.split(' ')[0]} {isSelected && '◀'}
                  </span>
                  <span style={{ fontSize: '11px', color: isDead ? '#e74c3c' : '#2ecc71' }}>
                    {stage.nonCombatTrial
                      ? (lang === 'fr' ? 'ACTIF' : 'ACTIVE')
                      : isDead ? 'KO' : `${h.currentHp}/${h.stats.hp} HP`}
                  </span>
                </button>
              );
            })}
          </div>

          {battleConfig?.opponentControl === 'p2' && opponentState.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,138,80,0.25)' }}>
              <div style={{ fontSize: 10, color: '#ff8a50', marginBottom: 7 }}>P2 / {lang === 'fr' ? 'MENACES' : 'THREATS'}</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {opponentState.map((enemy, index) => {
                  const runtimeId = enemy.runtimeId || enemy.id || enemy.name;
                  const selected = runtimeId === activeOpponentId;
                  return (
                    <button
                      type="button"
                      key={`${runtimeId}-${index}`}
                      onClick={() => stage.mode === 'RPG' && enemy.currentHp > 0 && swapActiveHero(runtimeId)}
                      className="btn-retro"
                      disabled={enemy.currentHp <= 0 || stage.mode === 'Tactics'}
                      style={{
                        padding: '6px 8px',
                        borderColor: selected ? '#ff8a50' : '#493b37',
                        color: enemy.currentHp > 0 ? '#ffd4bd' : '#6b4e46',
                        textAlign: 'left',
                        fontSize: 9
                      }}
                    >
                      {index + 7}. {enemy.name} — {Math.max(0, Math.round(enemy.currentHp || 0))}/{Math.round(enemy.maxHp || enemy.hp || 1)} HP
                      {typeof enemy.atb === 'number' ? ` / ATB ${Math.round(enemy.atb)}%` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {stage.mode === 'RPG' && (
            <button
              onClick={toggleAuto}
              className="btn-retro"
              title={lang === 'fr' ? 'Active ou desactive les actions automatiques en RPG.' : 'Toggle automatic RPG actions.'}
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
              disabled={eventItemUsed || battleCompleted || preMatchLocked}
              className="btn-retro"
              title={preMatchLocked
                ? (lang === 'fr' ? 'Indisponible pendant le pre-match.' : 'Unavailable during pre-match.')
                : eventItemUsed
                ? (lang === 'fr' ? 'Objet evenementiel deja utilise pendant ce combat.' : 'Event item already used in this combat.')
                : (lang === 'fr' ? 'Active l objet evenementiel equipe une seule fois pendant ce combat.' : 'Activate the equipped event item once during this combat.')}
              style={{
                marginTop: '10px',
                width: '100%',
                fontSize: '10px',
                padding: '8px',
                borderColor: eventItemUsed || preMatchLocked ? '#444' : '#ff4500',
                background: eventItemUsed || preMatchLocked ? 'transparent' : 'rgba(255, 69, 0, 0.12)',
                color: eventItemUsed || preMatchLocked ? '#777' : '#ff8c00',
                boxShadow: eventItemUsed || preMatchLocked ? 'none' : '0 0 10px rgba(255, 69, 0, 0.25)',
                fontWeight: 'bold',
                cursor: eventItemUsed || preMatchLocked ? 'not-allowed' : 'pointer'
              }}
            >
              🌟 {preMatchLocked
                ? (lang === 'fr' ? 'PRE-MATCH VERROUILLE' : 'PRE-MATCH LOCKED')
                : eventItemUsed
                  ? getTranslation(lang, 'eventUsed')
                  : equippedEvent.name[lang].toUpperCase()}
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
                {stage.mode === 'RPG'
                  ? (lang === 'fr' ? 'Commandes de relique' : 'Relic commands')
                  : (lang === 'fr' ? 'Artefacts de terrain' : 'Field artifacts')}
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {battlePickups.map(item => (
                  <button
                    key={item.pickupId}
                    onClick={() => stage.mode !== 'Tactics' && activateBattleItem(
                      item,
                      'panel',
                      opponentHasCommand ? 'opponent' : 'player'
                    )}
                    disabled={item.used || battleCompleted || preMatchLocked || stage.mode === 'Tactics' || (stage.mode === 'RPG' && (!activeHeroObj || activeHeroObj.atb < 100))}
                    className="btn-retro"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '9px',
                      padding: '6px',
                      borderColor: item.used ? '#333' : item.color,
                      color: item.used ? '#555' : '#fff',
                      background: item.used ? 'rgba(0,0,0,0.18)' : `${item.color}14`,
                      opacity: item.used ? 0.55 : stage.mode === 'Tactics' ? 0.78 : stage.mode === 'RPG' && (!activeHeroObj || activeHeroObj.atb < 100) ? 0.52 : 1,
                      cursor: stage.mode === 'Tactics' ? 'default' : undefined
                    }}
                    title={stage.mode === 'Tactics'
                      ? (lang === 'fr'
                        ? 'En tactique, deplace une unite sur la case de cet artefact pour le declencher.'
                        : 'In tactics, move a unit onto this artifact tile to trigger it.')
                      : stage.mode === 'RPG'
                        ? item.rpg?.[lang]
                        : item.melee?.[lang]}
                  >
                    <img
                      src={getItemSpriteSrc(item)}
                      alt=""
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                      style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'contain',
                        imageRendering: 'pixelated',
                        verticalAlign: 'middle',
                        marginRight: '6px'
                      }}
                    />
                    <span style={{ color: item.color, fontWeight: 'bold' }}>
                      {item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : item.role.toUpperCase()}
                    </span>
                    {' - '}
                    {item.name[lang]}
                  </button>
                ))}
              </div>
              {stage.mode === 'Tactics' && (
                <div style={{ fontSize: '8px', color: '#aaa', marginTop: '7px', lineHeight: 1.4 }}>
                  {lang === 'fr'
                    ? 'Declenchement par entree sur case uniquement.'
                    : 'Triggered only by stepping onto the tile.'}
                </div>
              )}
              {stage.mode === 'RPG' && (
                <div style={{ fontSize: '8px', color: '#aaa', marginTop: '7px', lineHeight: 1.4 }}>
                  {lang === 'fr'
                    ? 'Commande de relique: utilisable seulement quand le combattant actif a son ATB pleine.'
                    : 'Relic command: usable only when the active fighter has full ATB.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div>
          {activeHeroObj ? (
            <>
              <div style={{ display: stage.mode === 'Smash' ? 'none' : 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: activeHeroObj.primaryColor || activeHeroObj.color || '#ff8a50' }}>
                  {opponentHasCommand ? 'P2 / ' : ''}{activeHeroObj.name.toUpperCase()} ACTIONS
                </span>
                {stage.mode === 'Tactics' && (
                  <span style={{ fontSize: '9px', color: '#ffb300' }}>
                    {selectedAction
                      ? `${lang === 'fr' ? 'VISEE' : 'TARGETING'}: ${getCombatantMove(activeHeroObj, selectedAction).name}`
                      : (lang === 'fr' ? 'MODE DEPLACEMENT' : 'MOVEMENT MODE')}
                  </span>
                )}
              </div>

              <div style={{ display: stage.mode === 'Smash' ? 'none' : 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => handleActiveHeroAbility('simple')}
                  disabled={preMatchLocked || activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'simple' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                  title={lang === 'fr' ? 'Utilise l attaque de base du heros actif.' : 'Use the active hero basic attack.'}
                >
                  ⚔️ {getCombatantMove(activeHeroObj, 'simple').name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Basic Action</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('secondary')}
                  disabled={preMatchLocked || activeHeroObj.currentHp <= 0 || activeHeroObj.cooldown > 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'secondary' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                  title={lang === 'fr' ? 'Utilise la competence secondaire si elle n est pas en recharge.' : 'Use the secondary skill if it is not on cooldown.'}
                >
                  ⚡ {getCombatantMove(activeHeroObj, 'secondary').name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>
                    {activeHeroObj.cooldown > 0 ? `COOLDOWN (${Math.ceil(activeHeroObj.cooldown/60)}s)` : 'Skill Action'}
                  </div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('defense')}
                  disabled={preMatchLocked || activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'defense' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                  title={lang === 'fr' ? 'Utilise une action defensive: reduction de degats, protection ou posture tactique.' : 'Use a defensive action: damage reduction, protection, or tactical stance.'}
                >
                  🛡️ {getCombatantMove(activeHeroObj, 'defense').name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Shield Defense</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('special')}
                  disabled={preMatchLocked || activeHeroObj.currentHp <= 0 || activeHeroObj.specialCharge < 100 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className="btn-special"
                  title={lang === 'fr' ? 'Utilise l attaque speciale quand la jauge speciale est a 100%.' : 'Use the special attack when the special gauge reaches 100%.'}
                  style={{
                    boxShadow: activeHeroObj.specialCharge >= 100 ? `0 0 15px ${activeHeroObj.primaryColor || activeHeroObj.color || '#ff8a50'}` : 'none',
                    borderColor: activeHeroObj.specialCharge >= 100 ? '#fff' : '#444',
                    background: activeHeroObj.specialCharge >= 100 ? (activeHeroObj.primaryColor || activeHeroObj.color || '#ff8a50') : 'rgba(0,0,0,0.4)',
                    color: '#fff'
                  }}
                >
                  🔥 {getCombatantMove(activeHeroObj, 'special').name.toUpperCase()}
                  <div style={{ fontSize: '8px', color: '#fff', marginTop: '2px' }}>
                    {activeHeroObj.specialCharge < 100 ? `SPECIAL CHARGE: ${Math.round(activeHeroObj.specialCharge)}%` : 'READY!'}
                  </div>
                </button>

                {stage.mode === 'Tactics' && selectedAction && (
                  <button
                    type="button"
                    onClick={handleCancelTacticsAction}
                    className="btn-retro"
                    title={lang === 'fr'
                      ? 'Annule la visee non confirmee et revient au deplacement avec les AP restants.'
                      : 'Cancel unconfirmed targeting and return to movement with remaining AP.'}
                    style={{
                      gridColumn: 'span 2',
                      padding: '8px 12px',
                      background: 'rgba(41, 128, 185, 0.34)',
                      borderColor: '#4fc3f7',
                      color: '#dff6ff',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {lang === 'fr' ? 'ANNULER LA VISEE / DEPLACEMENT' : 'CANCEL TARGETING / MOVE'}
                  </button>
                )}

                {stage.mode === 'Tactics' && (
                  <button
                    onClick={() => {
                      if (engineRef.current) {
                        engineRef.current.endActiveTurn();
                        sound.playSfx('confirm');
                      }
                    }}
                    className="btn-retro"
                    title={lang === 'fr' ? 'Termine le tour du heros actif sans autre action.' : 'End the active hero turn without another action.'}
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
                <div style={{ marginTop: '12px' }}>
                  <MeleeControlsPanel
                    lang={lang}
                    trial={Boolean(stage.nonCombatTrial)}
                    maps={meleeInputMaps}
                    localP2={battleConfig?.opponentControl === 'p2'}
                    onRemap={handleMeleeRemap}
                    onReset={handleResetMeleeInputs}
                    runtimeActor={teamState.find(hero => hero.id === activeHeroId) || teamState[0]}
                    onTouchAction={handleMeleeTouchAction}
                  />
                </div>
              )}
              {stage.mode === 'Tactics' && (
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '12px', textAlign: 'center' }}>
                  {lang === 'fr'
                    ? <>Bouge sur une case <span style={{ color: '#2ecc71' }}>verte</span> ou choisis une attaque pour rester en place. Reclique l attaque ou utilise <strong>ANNULER LA VISEE</strong> avant confirmation. Maintiens le clic et glisse pour la camera; molette pour zoomer. <span style={{ color: '#4fc3f7' }}>COVER</span> reduit les tirs.</>
                    : <>Move on a <span style={{ color: '#2ecc71' }}>green</span> cell or pick an attack to hold position. Click it again or use <strong>CANCEL TARGETING</strong> before confirming. Hold and drag to pan; use the wheel to zoom. <span style={{ color: '#4fc3f7' }}>COVER</span> reduces shots.</>}
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
