import React, { useState, useEffect, useRef } from 'react';
import sound from './game/soundEngine';
import HubScreen from './components/HubScreen';
import PortalScreen from './components/PortalScreen';
import GameCanvas from './components/GameCanvas';
import AudioControl from './components/AudioControl';
import AuthPanel from './components/AuthPanel';
import { getTranslation } from './game/translation';
import { EQUIP_ITEMS_DB } from './game/heroes';
import { getOpenAiBackdropSrc } from './game/renderer';
import { getStoredSession, loadCloudSave, saveCloudSave, signInAccount, signOutAccount, signUpAccount, storeSession } from './game/cloudSave';
import { PLAYER_HERO_ID } from './game/playerHero';

const SAVE_KEY = 'multiverse_breach_save_v2';

const DEFAULT_SAVE = {
  lang: 'fr',
  gold: 200,
  breachShards: 150,
  eventTokens: 10,
  playerProfile: { name: 'Ancre' },
  unlockedHeroes: [PLAYER_HERO_ID, 'freeman', 'masterchief'],
  heroLevels: { [PLAYER_HERO_ID]: 1, freeman: 1, masterchief: 1, leon: 1 },
  activeTeam: [PLAYER_HERO_ID, 'freeman', 'masterchief'],
  completedStages: [],
  heroTalents: {},
  heroSkins: {},
  portalStats: { pulls: 0, duplicateStreak: 0, history: [] },
  publicProfile: { shareCode: null, title: 'Ancre Prime', visibility: 'private' },
  activityProgress: {
    dayKey: '',
    weekKey: '',
    claimedDaily: [],
    claimedWeekly: [],
    claimedMilestones: [],
    modeWins: {},
    itemActivations: 0,
    weeklyItemActivations: 0,
    dailyWins: 0,
    weeklyWins: 0,
    dailyModeWins: {},
    weeklyModeWins: {},
    lifetimeWins: 0,
    lifetimeAttempts: 0,
    seasonXp: 0,
    loginStreak: 0,
    lastSeenDay: ''
  },
  inventory: ['cog_armor', 'green_herb', 'hev_battery'],
  equippedGear: {
    [PLAYER_HERO_ID]: null,
    freeman: 'hev_battery',
    masterchief: null,
    leon: 'green_herb'
  },
  equippedEventItems: {
    [PLAYER_HERO_ID]: null,
    freeman: 'evt_hl_snarks',
    masterchief: 'evt_halo_warthog',
    leon: 'evt_re_cure'
  },
  hiddenUniverses: [],
  disabledAssets: {
    heroes: [],
    enemies: [],
    gear: [],
    stages: []
  }
};

const loadSave = () => {
  if (typeof window === 'undefined') return DEFAULT_SAVE;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw);
    return normalizeSavePayload(parsed);
  } catch {
    return DEFAULT_SAVE;
  }
};

const saveGame = (payload) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
};

const normalizeSavePayload = (save = {}) => {
  const merged = { ...DEFAULT_SAVE, ...save };
  const unlockedHeroes = merged.unlockedHeroes.includes(PLAYER_HERO_ID)
    ? merged.unlockedHeroes
    : [PLAYER_HERO_ID, ...merged.unlockedHeroes];
  const activeTeam = merged.activeTeam.includes(PLAYER_HERO_ID)
    ? merged.activeTeam
    : [PLAYER_HERO_ID, ...merged.activeTeam.filter(id => id !== PLAYER_HERO_ID)].slice(0, 3);
  return {
    ...merged,
    playerProfile: { ...DEFAULT_SAVE.playerProfile, ...(merged.playerProfile || {}) },
    unlockedHeroes,
    activeTeam,
    heroLevels: { ...DEFAULT_SAVE.heroLevels, ...(merged.heroLevels || {}) },
    heroTalents: merged.heroTalents || {},
    heroSkins: merged.heroSkins || {},
    hiddenUniverses: Array.isArray(merged.hiddenUniverses) ? merged.hiddenUniverses : [],
    disabledAssets: {
      heroes: Array.isArray(merged.disabledAssets?.heroes) ? merged.disabledAssets.heroes : [],
      enemies: Array.isArray(merged.disabledAssets?.enemies) ? merged.disabledAssets.enemies : [],
      gear: Array.isArray(merged.disabledAssets?.gear) ? merged.disabledAssets.gear : [],
      stages: Array.isArray(merged.disabledAssets?.stages) ? merged.disabledAssets.stages : []
    },
    portalStats: { ...DEFAULT_SAVE.portalStats, ...(merged.portalStats || {}), history: (merged.portalStats?.history || []).slice(0, 20) },
    publicProfile: { ...DEFAULT_SAVE.publicProfile, ...(merged.publicProfile || {}) },
    activityProgress: { ...DEFAULT_SAVE.activityProgress, ...(merged.activityProgress || {}) },
    equippedGear: { ...DEFAULT_SAVE.equippedGear, ...(merged.equippedGear || {}) },
    equippedEventItems: { ...DEFAULT_SAVE.equippedEventItems, ...(merged.equippedEventItems || {}) }
  };
};

const getProgressKeys = (date = new Date()) => {
  const dayKey = date.toISOString().slice(0, 10);
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((date - startOfYear) / 86400000) + startOfYear.getUTCDay() + 1) / 7);
  return { dayKey, weekKey: `${date.getUTCFullYear()}-W${weekNumber}` };
};

const getNextLoginStreak = (lastSeenDay, dayKey, currentStreak = 0) => {
  if (!lastSeenDay) return 1;
  if (lastSeenDay === dayKey) return currentStreak || 1;
  const last = new Date(`${lastSeenDay}T00:00:00Z`).getTime();
  const today = new Date(`${dayKey}T00:00:00Z`).getTime();
  return today - last === 86400000 ? (currentStreak || 0) + 1 : 1;
};

const getMissionNarrative = (stage, lang, isOutro, victory) => {
  if (stage.fusionMission) {
    if (!isOutro) return stage.fusionMission.decor[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.displayName.fr} est stabilisee. ${stage.rewardItemName.fr} rejoint l inventaire Nexus comme cle de craft et de skin.`
        : `${stage.displayName.en} is stabilized. ${stage.rewardItemName.en} enters the Nexus inventory as a craft and skin key.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste dangereuse: les univers sources continuent de se contaminer.`
        : `${stage.displayName.en} remains dangerous: source universes keep contaminating each other.`);
  }
  if (stage.characterArc) {
    if (!isOutro) return stage.characterArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.characterArc.outro.fr} ${stage.rewardItemName.fr} rejoint les archives personnelles comme apparence Nexus.`
        : `${stage.characterArc.outro.en} ${stage.rewardItemName.en} joins the personal archive as a Nexus appearance.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste inachevee: la signature personnelle du heros n est pas encore assez stable.`
        : `${stage.displayName.en} remains unfinished: the hero personal signature is not stable enough yet.`);
  }
  const lines = {
    'Alien': {
      intro: { fr: 'Le signal MU/TH/UR grince dans les couloirs. Chaque porte ouverte peut nourrir la ruche.', en: 'The MU/TH/UR signal grinds through the corridors. Every opened door can feed the hive.' },
      victory: { fr: 'La ruche recule, mais l acide grave encore les murs du Nexus.', en: 'The hive falls back, but acid still etches the Nexus walls.' }
    },
    'Predator': {
      intro: { fr: 'Les capteurs thermiques balayent la zone. Le clan attend une chasse digne du trophée.', en: 'Thermal sensors sweep the zone. The clan waits for a trophy-worthy hunt.' },
      victory: { fr: 'Le trophée est refusé à la breche: l honneur reste du cote de l escouade.', en: 'The breach is denied its trophy: honor stays with the squad.' }
    },
    'Stargate': {
      intro: { fr: 'Le vortex verrouille sept chevrons et projette le Nexus dans une coordonnee ancienne.', en: 'The vortex locks seven chevrons and throws the Nexus into ancient coordinates.' },
      victory: { fr: 'L iris se referme sur le signal hostile. La porte est stable.', en: 'The iris closes over the hostile signal. The gate is stable.' }
    },
    'Kaamelott': {
      intro: { fr: 'La Table Ronde tente un plan simple. Le Nexus detecte aussitot douze interpretations contradictoires.', en: 'The Round Table attempts a simple plan. The Nexus instantly detects twelve contradictory readings.' },
      victory: { fr: 'La breche capitule avant le prochain debat strategique.', en: 'The breach yields before the next strategic debate.' }
    },
    'Discworld': {
      intro: { fr: 'La magie octarine fuit entre deux regles de realite. Meme le Nexus hesite a classer le phenomene.', en: 'Octarine magic leaks between two rules of reality. Even the Nexus hesitates to classify it.' },
      victory: { fr: 'La realite est remise a peu pres droite, ce qui suffit pour aujourd hui.', en: 'Reality is set approximately straight, which is enough for today.' }
    },
    'Doom': {
      intro: { fr: 'Les sceaux infernaux cèdent. La seule diplomatie possible tient dans le canon.', en: 'Infernal seals fail. The only possible diplomacy fits inside a barrel.' },
      victory: { fr: 'Le front infernal est brise. Le Nexus archive la violence comme methode de stabilisation.', en: 'The infernal front breaks. The Nexus archives violence as a stabilization method.' }
    },
    'Hazbin Hotel': {
      intro: { fr: 'Le cabaret infernal transforme la breche en numero de redemption impossible.', en: 'The infernal cabaret turns the breach into an impossible redemption number.' },
      victory: { fr: 'Le rideau tombe, et meme la Singularity manque son rappel.', en: 'The curtain falls, and even the Singularity misses its encore.' }
    }
  };
  const profile = lines[stage.universe];
  if (profile) {
    if (!isOutro) return profile.intro[lang];
    return victory ? profile.victory[lang] : (lang === 'fr' ? `${stage.universe} reste instable, mais son pattern narratif est maintenant isole.` : `${stage.universe} remains unstable, but its narrative pattern is now isolated.`);
  }
  if (!isOutro) {
    return lang === 'fr'
      ? `Le Nexus isole une signature propre a ${stage.universe}. La scene se charge de symboles locaux avant l impact.`
      : `The Nexus isolates a signature unique to ${stage.universe}. The scene fills with local symbols before impact.`;
  }
  return victory
    ? (lang === 'fr' ? `${stage.universe} rejoint les archives actives du Nexus avec une signature stabilisee.` : `${stage.universe} joins the active Nexus archives with a stabilized signature.`)
    : (lang === 'fr' ? `${stage.universe} resiste encore, mais la prochaine ouverture sera plus lisible.` : `${stage.universe} still resists, but the next opening will be easier to read.`);
};

function MissionNarrativeScreen({ lang, stage, result, rewardSummary, onContinue }) {
  const isOutro = Boolean(result);
  const victory = result === 'victory';
  const backdrop = getOpenAiBackdropSrc(stage.universe, stage.mode);
  const modifierName = stage.modifier?.name?.[lang] || stage.modifier?.id || (lang === 'fr' ? 'Anomalie inconnue' : 'Unknown anomaly');
  const modifierDesc = stage.modifier?.desc?.[lang] || '';
  const rarity = stage.lootRarity?.label || 'Common';
  const title = isOutro
    ? victory
      ? (lang === 'fr' ? 'BRECHE STABILISEE' : 'BREACH STABILIZED')
      : (lang === 'fr' ? 'REPLI TACTIQUE' : 'TACTICAL RETREAT')
    : (lang === 'fr' ? 'SEQUENCE NARRATIVE' : 'NARRATIVE SEQUENCE');
  const modeLine = stage.mode === 'RPG'
    ? (lang === 'fr' ? 'L escouade avance en formation RPG, comme une confrontation de boss cinematique.' : 'The squad advances in RPG formation, like a cinematic boss confrontation.')
    : stage.mode === 'Tactics'
      ? (lang === 'fr' ? 'Le champ se decoupe en lignes tactiques: chaque case devient une decision de survie.' : 'The field splits into tactical lanes: every tile becomes a survival decision.')
      : (lang === 'fr' ? 'La breche explose en arene rapide, proche d un combat crossover de super-heros.' : 'The breach bursts into a fast arena, close to a superhero crossover battle.');
  const narrativeLine = getMissionNarrative(stage, lang, isOutro, victory);
  const introText = lang === 'fr'
    ? `${narrativeLine} Les archives du Nexus detectent ${stage.bossName}, lie au pattern "${modifierName}". ${modeLine} Objectif: verrouiller les coordonnees avant que la Singularity absorbe ce lore.`
    : `${narrativeLine} Nexus archives detect ${stage.bossName}, tied to the "${modifierName}" pattern. ${modeLine} Objective: lock the coordinates before the Singularity absorbs this lore.`;
  const outroText = victory
    ? (lang === 'fr'
      ? `${narrativeLine} Les donnees de ${stage.bossName} rejoignent le codex, la rarete ${rarity} est indexee et les recompenses sont transferees au hub.`
      : `${narrativeLine} ${stage.bossName} data enters the codex, ${rarity} rarity is indexed, and rewards are transferred to the hub.`)
    : (lang === 'fr'
      ? `${narrativeLine} L escouade conserve les donnees de contact, mais ${stage.bossName} garde le controle local du signal.`
      : `${narrativeLine} The squad keeps contact data, but ${stage.bossName} still controls the local signal.`);

  return (
    <div className="narrative-screen">
      <div className="narrative-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,1,8,0.35), rgba(2,1,8,0.82)), url(${backdrop || ''})` }}>
        <div className="narrative-rift" />
        <div className="narrative-scanline" />
        <div className="narrative-copy">
          <div className="narrative-kicker">{title}</div>
          <h1>{stage.displayName?.[lang] || stage.universe}</h1>
          <h2>{stage.sourceUniverses ? stage.sourceUniverses.join(' / ') : stage.name}</h2>
          <p>{isOutro ? outroText : introText}</p>
          {isOutro && rewardSummary && (
            <div className="narrative-intel" style={{ display: 'grid', gap: '6px' }}>
              <strong style={{ color: rewardSummary.result === 'victory' ? '#2ecc71' : '#ffeb3b' }}>
                {lang === 'fr' ? 'Rapport gameplay A.R.C.A.' : 'A.R.C.A. gameplay report'}
              </strong>
              <span>
                {lang === 'fr'
                  ? `Ressources: +${rewardSummary.gold} or / +${rewardSummary.shards} fragments${rewardSummary.tokens ? ` / +${rewardSummary.tokens} jetons` : ''}.`
                  : `Resources: +${rewardSummary.gold} gold / +${rewardSummary.shards} shards${rewardSummary.tokens ? ` / +${rewardSummary.tokens} tokens` : ''}.`}
              </span>
              <span>
                {lang === 'fr'
                  ? `Artefacts de terrain actives: ${rewardSummary.battleItemsUsed}.`
                  : `Field artifacts activated: ${rewardSummary.battleItemsUsed}.`}
              </span>
              {rewardSummary.firstClear && (
                <span>{lang === 'fr' ? 'Bonus premiere stabilisation applique.' : 'First stabilization bonus applied.'}</span>
              )}
              {rewardSummary.consolation && (
                <span>{lang === 'fr' ? 'Cache de repli attribuee: la tentative progresse meme sans victoire.' : 'Retreat cache granted: the attempt still progresses without victory.'}</span>
              )}
              {rewardSummary.rewardItemName && (
                <span>{lang === 'fr' ? `Recompense speciale: ${rewardSummary.rewardItemName}.` : `Special reward: ${rewardSummary.rewardItemName}.`}</span>
              )}
              {rewardSummary.droppedItemName && (
                <span>{lang === 'fr' ? `Relique recuperee: ${rewardSummary.droppedItemName}.` : `Relic recovered: ${rewardSummary.droppedItemName}.`}</span>
              )}
            </div>
          )}
          <div className="narrative-tags">
            <span>{stage.mode}</span>
            <span>{modifierName}</span>
            <span>{stage.bossName}</span>
          </div>
          {modifierDesc && <div className="narrative-intel">{modifierDesc}</div>}
          <button onClick={onContinue} className="btn-retro narrative-button">
            {isOutro
              ? (lang === 'fr' ? 'RETOUR AU HUB' : 'RETURN TO HUB')
              : (lang === 'fr' ? 'LANCER LA MISSION' : 'LAUNCH MISSION')}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const initialSave = loadSave();
  const cloudSaveTimerRef = useRef(null);
  const skipNextCloudSaveRef = useRef(false);
  const [lang, setLang] = useState(initialSave.lang); // FR default as requested, EN toggle
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [gold, setGold] = useState(initialSave.gold);
  const [breachShards, setBreachShards] = useState(initialSave.breachShards);
  const [eventTokens, setEventTokens] = useState(initialSave.eventTokens);
  const [playerProfile, setPlayerProfile] = useState(initialSave.playerProfile);
  const [unlockedHeroes, setUnlockedHeroes] = useState(initialSave.unlockedHeroes);
  const [heroLevels, setHeroLevels] = useState(initialSave.heroLevels);
  const [activeTeam, setActiveTeam] = useState(initialSave.activeTeam);
  const [completedStages, setCompletedStages] = useState(initialSave.completedStages);
  const [activeStage, setActiveStage] = useState(null);
  const [lastBattleResult, setLastBattleResult] = useState(null);
  const [lastBattleSummary, setLastBattleSummary] = useState(null);
  const [heroTalents, setHeroTalents] = useState(initialSave.heroTalents); // heroId -> talentId
  const [heroSkins, setHeroSkins] = useState(initialSave.heroSkins);
  const [hiddenUniverses, setHiddenUniverses] = useState(initialSave.hiddenUniverses);
  const [disabledAssets, setDisabledAssets] = useState(initialSave.disabledAssets);
  const [portalStats, setPortalStats] = useState(initialSave.portalStats);
  const [publicProfile, setPublicProfile] = useState(initialSave.publicProfile);
  const [activityProgress, setActivityProgress] = useState(initialSave.activityProgress);

  // Inventory & Equipment
  const [inventory, setInventory] = useState(initialSave.inventory);
  const [equippedGear, setEquippedGear] = useState(initialSave.equippedGear);
  // Equipped Event Items (1 slot per hero)
  const [equippedEventItems, setEquippedEventItems] = useState(initialSave.equippedEventItems);
  const [account, setAccount] = useState(() => getStoredSession());
  const [cloudStatus, setCloudStatus] = useState(() => (
    getStoredSession()
      ? 'Compte detecte. La progression locale reste active, cloud disponible.'
      : 'Progression locale. Connecte un compte pour synchroniser.'
  ));
  const collectionBonusCount = inventory.filter(itemId => (
    itemId.startsWith('collection_reward_')
    || itemId.startsWith('arc_reward_')
    || itemId.startsWith('arc_')
    || itemId.startsWith('fusion_')
  )).length;

  const getCurrentSave = () => ({
    lang,
    gold,
    breachShards,
    eventTokens,
    playerProfile,
    unlockedHeroes,
    heroLevels,
    activeTeam,
    completedStages,
    heroTalents,
    heroSkins,
    hiddenUniverses,
    disabledAssets,
    portalStats,
    publicProfile,
    activityProgress,
    inventory,
    equippedGear,
    equippedEventItems
  });

  useEffect(() => {
    const payload = getCurrentSave();
    saveGame(payload);

    if (!account?.access_token) return;
    if (skipNextCloudSaveRef.current) {
      skipNextCloudSaveRef.current = false;
      return;
    }

    window.clearTimeout(cloudSaveTimerRef.current);
    cloudSaveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveCloudSave(account, payload);
        setCloudStatus(lang === 'fr' ? 'Progression synchronisee dans le cloud.' : 'Progress synced to cloud.');
      } catch (err) {
        setCloudStatus(`${lang === 'fr' ? 'Sync cloud impossible' : 'Cloud sync failed'}: ${err.message}`);
      }
    }, 1200);

    return () => window.clearTimeout(cloudSaveTimerRef.current);
  }, [lang, gold, breachShards, eventTokens, playerProfile, unlockedHeroes, heroLevels, activeTeam, completedStages, heroTalents, heroSkins, hiddenUniverses, disabledAssets, portalStats, publicProfile, activityProgress, inventory, equippedGear, equippedEventItems, account]);

  useEffect(() => {
    const { dayKey, weekKey } = getProgressKeys();
    setActivityProgress(prev => {
      if (prev.lastSeenDay === dayKey && prev.dayKey === dayKey && prev.weekKey === weekKey) return prev;
      return {
        ...prev,
        dayKey,
        weekKey,
        claimedDaily: prev.dayKey === dayKey ? (prev.claimedDaily || []) : [],
        claimedWeekly: prev.weekKey === weekKey ? (prev.claimedWeekly || []) : [],
        itemActivations: prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0,
        weeklyItemActivations: prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0,
        dailyWins: prev.dayKey === dayKey ? (prev.dailyWins || 0) : 0,
        weeklyWins: prev.weekKey === weekKey ? (prev.weeklyWins || 0) : 0,
        dailyModeWins: prev.dayKey === dayKey ? (prev.dailyModeWins || {}) : {},
        weeklyModeWins: prev.weekKey === weekKey ? (prev.weeklyModeWins || {}) : {},
        loginStreak: getNextLoginStreak(prev.lastSeenDay, dayKey, prev.loginStreak),
        lastSeenDay: dayKey
      };
    });
  }, []);

  // Play ambient music
  useEffect(() => {
    sound.init();
    if (currentScreen === 'intro' || currentScreen === 'hub') {
      sound.playBgm('hub');
    }
    return () => {
      sound.stopBgm();
    };
  }, [currentScreen]);

  const startOperation = () => {
    sound.playSfx('levelup');
    setPlayerProfile(prev => ({ ...prev, name: String(prev?.name || '').trim() || 'Ancre' }));
    setUnlockedHeroes(prev => prev.includes(PLAYER_HERO_ID) ? prev : [PLAYER_HERO_ID, ...prev]);
    setActiveTeam(prev => prev.includes(PLAYER_HERO_ID) ? prev : [PLAYER_HERO_ID, ...prev].slice(0, 3));
    setCurrentScreen('hub');
  };

  const handleLaunchStage = (stage) => {
    sound.playSfx('special');
    setActiveStage(stage);
    setLastBattleResult(null);
    setLastBattleSummary(null);
    setCurrentScreen('missionIntro');
  };

  const handleBattleEnd = (result, report = {}) => {
    const battleItemsUsed = report.battleItemsUsed || 0;
    const firstClear = result === 'victory'
      && activeStage
      && !activeStage.isSurvival
      && !completedStages.includes(activeStage.id);
    const summary = {
      result,
      gold: 0,
      shards: 0,
      tokens: 0,
      battleItemsUsed,
      firstClear,
      droppedItemName: null,
      rewardItemName: null,
      consolation: false
    };

    if (result === 'victory' && activeStage) {
      // Award rewards
      const firstClearGold = firstClear ? 25 : 0;
      const firstClearShards = firstClear ? 10 : 0;
      const itemMasteryTokens = battleItemsUsed >= 3 ? 1 : 0;
      const seasonRewardBonus = Math.min(0.18, Math.floor((activityProgress.seasonXp || 0) / 500) * 0.02);
      summary.gold = Math.round(activeStage.goldPrize * (1 + seasonRewardBonus)) + firstClearGold;
      summary.shards = Math.round(activeStage.shardPrize * (1 + seasonRewardBonus)) + firstClearShards;
      summary.tokens = (activeStage.tokenPrize || 0) + itemMasteryTokens;
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);
      
      if (summary.tokens > 0) {
        setEventTokens(prev => prev + summary.tokens);
      }

      if (firstClear) {
        setCompletedStages(prev => [...prev, activeStage.id]);
      }

      if (activeStage.rewardItemId) {
        setInventory(prev => prev.includes(activeStage.rewardItemId) ? prev : [...prev, activeStage.rewardItemId]);
        summary.rewardItemName = activeStage.rewardItemName?.[lang] || activeStage.rewardItemName?.en || activeStage.rewardItemId;
      }

      const { dayKey, weekKey } = getProgressKeys();
      const seasonGain = 35
        + (firstClear ? 20 : 0)
        + (battleItemsUsed * 4)
        + (activeStage.isSurvival ? 15 : 0)
        + (activeStage.id === 38 ? 100 : 0);
      setActivityProgress(prev => ({
        ...prev,
        dayKey,
        weekKey,
        itemActivations: (prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0) + battleItemsUsed,
        weeklyItemActivations: (prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0) + battleItemsUsed,
        dailyWins: (prev.dayKey === dayKey ? (prev.dailyWins || 0) : 0) + 1,
        weeklyWins: (prev.weekKey === weekKey ? (prev.weeklyWins || 0) : 0) + 1,
        dailyModeWins: {
          ...(prev.dayKey === dayKey ? (prev.dailyModeWins || {}) : {}),
          [activeStage.mode]: ((prev.dayKey === dayKey ? prev.dailyModeWins?.[activeStage.mode] : 0) || 0) + 1,
          any: ((prev.dayKey === dayKey ? prev.dailyModeWins?.any : 0) || 0) + 1
        },
        weeklyModeWins: {
          ...(prev.weekKey === weekKey ? (prev.weeklyModeWins || {}) : {}),
          [activeStage.mode]: ((prev.weekKey === weekKey ? prev.weeklyModeWins?.[activeStage.mode] : 0) || 0) + 1,
          any: ((prev.weekKey === weekKey ? prev.weeklyModeWins?.any : 0) || 0) + 1
        },
        lifetimeWins: (prev.lifetimeWins || 0) + 1,
        lifetimeAttempts: (prev.lifetimeAttempts || 0) + 1,
        seasonXp: (prev.seasonXp || 0) + seasonGain,
        modeWins: {
          ...(prev.modeWins || {}),
          [activeStage.mode]: (prev.modeWins?.[activeStage.mode] || 0) + 1,
          any: (prev.modeWins?.any || 0) + 1
        }
      }));

      // Check if they dropped a random relic/item from the stage's universe
      const disabledGear = new Set(disabledAssets.gear || []);
      const universeGear = EQUIP_ITEMS_DB.filter(item => item.universe === activeStage.universe && !disabledGear.has(item.id));
      const rarityDropBonus = {
        common: 0,
        rare: 0.12,
        epic: 0.22,
        legendary: 0.32,
        anomaly: 0.42
      };
      const rarityId = activeStage.lootRarity?.id || 'common';
      if (universeGear.length > 0 && Math.random() < 0.6 + (rarityDropBonus[rarityId] || 0)) {
        const drop = universeGear[Math.floor(Math.random() * universeGear.length)];
        const dropId = ['legendary', 'anomaly'].includes(rarityId) ? `${drop.id}_plus` : drop.id;
        const alreadyOwnedCommon = rarityId === 'common' && inventory.includes(drop.id);
        if (!alreadyOwnedCommon) {
          summary.droppedItemName = `${drop.name?.[lang] || drop.name?.en || drop.id}${dropId.endsWith('_plus') ? ' +' : ''}`;
        }
        setInventory(prev => {
          if (rarityId === 'common' && prev.includes(drop.id)) return prev;
          return [...prev, dropId];
        });
      }
    } else if (result === 'defeat' && activeStage) {
      summary.consolation = true;
      summary.gold = Math.max(8, Math.round(activeStage.goldPrize * 0.18));
      summary.shards = Math.max(4, Math.round(activeStage.shardPrize * 0.22));
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);

      const { dayKey, weekKey } = getProgressKeys();
      setActivityProgress(prev => ({
        ...prev,
        dayKey,
        weekKey,
        itemActivations: (prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0) + battleItemsUsed,
        weeklyItemActivations: (prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0) + battleItemsUsed,
        lifetimeAttempts: (prev.lifetimeAttempts || 0) + 1,
        seasonXp: (prev.seasonXp || 0) + 12 + (battleItemsUsed * 2)
      }));
    }
    setLastBattleSummary(result === 'quit' ? null : summary);
    setLastBattleResult(result);
    setCurrentScreen('missionOutro');
  };

  const closeMissionOutro = () => {
    setCurrentScreen('hub');
    setActiveStage(null);
    setLastBattleResult(null);
    setLastBattleSummary(null);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    setLang(nextLang);
    sound.playSfx('coin');
  };

  const applySave = (save) => {
    const merged = normalizeSavePayload(save);
    setLang(merged.lang);
    setGold(merged.gold);
    setBreachShards(merged.breachShards);
    setEventTokens(merged.eventTokens);
    setPlayerProfile(merged.playerProfile || DEFAULT_SAVE.playerProfile);
    setUnlockedHeroes(merged.unlockedHeroes);
    setHeroLevels(merged.heroLevels);
    setActiveTeam(merged.activeTeam);
    setCompletedStages(merged.completedStages);
    setHeroTalents(merged.heroTalents);
    setHeroSkins(merged.heroSkins || {});
    setHiddenUniverses(merged.hiddenUniverses || []);
    setDisabledAssets(merged.disabledAssets || DEFAULT_SAVE.disabledAssets);
    setPortalStats(merged.portalStats || DEFAULT_SAVE.portalStats);
    setPublicProfile(merged.publicProfile || DEFAULT_SAVE.publicProfile);
    setActivityProgress(merged.activityProgress || DEFAULT_SAVE.activityProgress);
    setInventory(merged.inventory);
    setEquippedGear(merged.equippedGear);
    setEquippedEventItems(merged.equippedEventItems);
    setActiveStage(null);
    setLastBattleResult(null);
    setCurrentScreen('hub');
  };

  const exportSave = async () => {
    const raw = JSON.stringify(getCurrentSave());
    try {
      await navigator.clipboard.writeText(raw);
      window.alert(lang === 'fr' ? 'Sauvegarde copiee dans le presse-papiers.' : 'Save copied to clipboard.');
    } catch {
      window.prompt(lang === 'fr' ? 'Copie ta sauvegarde :' : 'Copy your save:', raw);
    }
  };

  const importSave = () => {
    const raw = window.prompt(lang === 'fr' ? 'Colle ta sauvegarde exportee :' : 'Paste exported save:');
    if (!raw) return;
    try {
      applySave(JSON.parse(raw));
      sound.playSfx('levelup');
    } catch {
      window.alert(lang === 'fr' ? 'Sauvegarde invalide.' : 'Invalid save.');
    }
  };

  const resetSave = () => {
    if (!window.confirm(lang === 'fr' ? 'Reset complet de la progression ?' : 'Fully reset progression?')) return;
    window.localStorage.removeItem(SAVE_KEY);
    applySave(DEFAULT_SAVE);
    sound.playSfx('click');
  };

  const applyCloudSession = async (session, shouldLoadCloud = true) => {
    storeSession(session);
    setAccount(session);
    setCloudStatus(lang === 'fr' ? 'Compte connecte. Verification de la sauvegarde cloud...' : 'Account connected. Checking cloud save...');

    if (!shouldLoadCloud) return;

    const row = await loadCloudSave(session);
    if (row?.payload) {
      skipNextCloudSaveRef.current = true;
      applySave(row.payload);
      setCloudStatus(lang === 'fr' ? 'Sauvegarde cloud chargee.' : 'Cloud save loaded.');
    } else {
      await saveCloudSave(session, getCurrentSave());
      setCloudStatus(lang === 'fr' ? 'Nouvelle sauvegarde cloud creee depuis cette progression.' : 'New cloud save created from this progression.');
    }
  };

  const handleSignIn = async (email, password) => {
    const session = await signInAccount(email, password);
    await applyCloudSession(session, true);
    sound.playSfx('levelup');
  };

  const handleSignUp = async (email, password) => {
    const session = await signUpAccount(email, password);
    if (!session?.access_token) {
      setCloudStatus(lang === 'fr' ? 'Compte cree. Confirme ton email puis connecte-toi.' : 'Account created. Confirm your email, then sign in.');
      sound.playSfx('levelup');
      return;
    }
    await applyCloudSession(session, false);
    await saveCloudSave(session, getCurrentSave());
    setCloudStatus(lang === 'fr' ? 'Compte cree et progression envoyee dans le cloud.' : 'Account created and progress uploaded to cloud.');
    sound.playSfx('levelup');
  };

  const handleSignOut = async () => {
    const current = account;
    storeSession(null);
    setAccount(null);
    setCloudStatus(lang === 'fr' ? 'Deconnecte. Progression locale active.' : 'Signed out. Local progress active.');
    if (current?.access_token) {
      try {
        await signOutAccount(current);
      } catch {
        // Local sign-out should still complete if the remote token already expired.
      }
    }
    sound.playSfx('click');
  };

  const handleLoadCloud = async () => {
    if (!account) return;
    const row = await loadCloudSave(account);
    if (!row?.payload) {
      setCloudStatus(lang === 'fr' ? 'Aucune sauvegarde cloud trouvee.' : 'No cloud save found.');
      return;
    }
    skipNextCloudSaveRef.current = true;
    applySave(row.payload);
    setCloudStatus(lang === 'fr' ? 'Sauvegarde cloud chargee.' : 'Cloud save loaded.');
    sound.playSfx('coin');
  };

  const handleSaveCloud = async () => {
    if (!account) return;
    await saveCloudSave(account, getCurrentSave());
    setCloudStatus(lang === 'fr' ? 'Progression envoyee dans le cloud.' : 'Progress uploaded to cloud.');
    sound.playSfx('coin');
  };

  return (
    <>
      {/* Global Mute/Audio Button */}
      <AudioControl />
      <AuthPanel
        lang={lang}
        account={account}
        cloudStatus={cloudStatus}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
        onLoadCloud={handleLoadCloud}
        onSaveCloud={handleSaveCloud}
      />

      {/* Floating Language Switcher in bottom right */}
      <button
        onClick={toggleLanguage}
        className="global-lang-control"
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          zIndex: 100,
          background: 'rgba(20, 20, 30, 0.75)',
          border: '1px solid #ff4500',
          borderRadius: '4px',
          color: '#ff4500',
          padding: '8px 12px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(255, 69, 0, 0.3)',
          backdropFilter: 'blur(4px)'
        }}
      >
        🌐 {lang.toUpperCase()}
      </button>

      <div className="global-save-controls" style={{
        position: 'fixed',
        bottom: '15px',
        left: '15px',
        zIndex: 100,
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      }}>
        <button onClick={exportSave} className="btn-retro" style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#39c5bb' }}>
          EXPORT SAVE
        </button>
        <button onClick={importSave} className="btn-retro" style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#ffeb3b', color: '#ffeb3b' }}>
          IMPORT
        </button>
        <button onClick={resetSave} className="btn-retro" style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#e74c3c', color: '#e74c3c' }}>
          RESET
        </button>
      </div>

      {/* Screen Router */}
      {currentScreen === 'intro' && (
        <div className="intro-container" style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle, #100826 0%, #020006 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: '"Share Tech Mono", monospace'
        }}>
          <div className="intro-portal" style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            border: '2px dotted rgba(57, 197, 187, 0.15)',
            boxShadow: '0 0 40px rgba(155, 89, 182, 0.1)',
            zIndex: 0,
            animation: 'spin 10s linear infinite'
          }} />

          <div className="intro-card" style={{ zIndex: 1, maxWidth: '780px', padding: '30px' }}>
            <h1 className="cyber-title" style={{
              fontSize: '40px',
              marginBottom: '10px',
              textShadow: '0 0 15px #39c5bb',
              lineHeight: '1.2'
            }}>
              {getTranslation(lang, 'title')}
            </h1>
            <h3 style={{ color: '#ff4500', letterSpacing: '3px', marginBottom: '30px', fontSize: '13px' }}>
              {getTranslation(lang, 'subtitle')}
            </h3>

            <div className="intro-lore-panel" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(57, 197, 187, 0.2)',
              borderRadius: '6px',
              padding: '24px',
              textAlign: 'justify',
              lineHeight: '22px',
              fontSize: '14px',
              color: '#ccc',
              marginBottom: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              <div className="intro-lore-kicker">
                {lang === 'fr' ? 'Signal A.R.C.A. - Creation de profil Ancre' : 'A.R.C.A. signal - Anchored profile creation'}
              </div>
              <p style={{ marginTop: 0 }}>
                {getTranslation(lang, 'introText1')}
              </p>
              <p>
                {getTranslation(lang, 'introText2')}
              </p>
              <div className="intro-arca-transmission">
                <span>
                  {lang === 'fr'
                    ? 'Signal vital detecte. Identite instable, mais intacte.'
                    : 'Life signal detected. Identity unstable, but intact.'}
                </span>
                <span>
                  {lang === 'fr'
                    ? 'Tu n es pas quelque part. Tu es entre plusieurs realites a la fois.'
                    : 'You are not somewhere. You are between several realities at once.'}
                </span>
                <span>
                  {lang === 'fr'
                    ? 'Parce que tu es encore entier, le Nexus peut t ancrer.'
                    : 'Because you are still whole, the Nexus can anchor you.'}
                </span>
              </div>
              <p style={{ marginBottom: 0 }}>
                {lang === 'fr'
                  ? 'Ton profil n est pas un simple compte: c est une signature d Ancre. Le Nexus l utilise pour retenir tes victoires, tes equipes, tes reliques, les Trames deja stabilisees et les choix qui pourront plus tard soutenir le multijoueur sans casser ta progression.'
                  : 'Your profile is not just an account: it is an Anchored signature. The Nexus uses it to retain victories, teams, relics, stabilized Threads, and choices that can later support multiplayer without breaking progression.'}
              </p>
            </div>

            <div className="intro-profile-grid">
              {[
                {
                  title: lang === 'fr' ? '1. Le Voile cede' : '1. The Veil breaks',
                  text: lang === 'fr'
                    ? 'La Premiere Breche ne melange pas les univers au hasard: elle tord leurs lois, leurs boss et leurs symboles en zones jouables mais instables.'
                    : 'The First Breach does not mix universes at random: it bends their laws, bosses, and symbols into playable but unstable zones.'
                },
                {
                  title: lang === 'fr' ? '2. Les signatures' : '2. The signatures',
                  text: lang === 'fr'
                    ? 'Chaque heros garde sa Trame d origine, puis subit une Compression de Resonance qui rend son pouvoir jouable sans effacer son identite.'
                    : 'Each hero keeps an origin Thread, then undergoes Resonance Compression so their power becomes playable without erasing identity.'
                },
                {
                  title: lang === 'fr' ? '3. L Ancre' : '3. The Anchor',
                  text: lang === 'fr'
                    ? 'Ton role est de rassembler les Eclats d Origine, stabiliser les Trames et empecher le Sans-Auteur de transformer le multivers en page blanche.'
                    : 'Your role is to gather Origin Shards, stabilize Threads, and stop the Authorless from turning the multiverse into a blank page.'
                },
                {
                  title: lang === 'fr' ? '4. Premiere route' : '4. First route',
                  text: lang === 'fr'
                    ? 'Commence par une breche facile, equipe une relique, teste un item de terrain, puis consulte Collection pour voir ce que chaque victoire ouvre.'
                    : 'Start with an easy breach, equip a relic, test a field item, then check Collection to see what each victory opens.'
                }
              ].map(entry => (
                <div className="intro-profile-step" key={entry.title}>
                  <strong>{entry.title}</strong>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>

            <div className="intro-player-identity">
              <label htmlFor="player-name-input">
                {lang === 'fr' ? 'Nom du heros Ancre' : 'Anchored hero name'}
              </label>
              <input
                id="player-name-input"
                value={playerProfile.name}
                maxLength={22}
                onChange={(event) => setPlayerProfile(prev => ({ ...prev, name: event.target.value }))}
                placeholder={lang === 'fr' ? 'Ton pseudo' : 'Your nickname'}
              />
              <span>
                {lang === 'fr'
                  ? 'Ce pseudo devient ton premier heros jouable et ta signature de sauvegarde.'
                  : 'This nickname becomes your first playable hero and save signature.'}
              </span>
            </div>

            <button
              onClick={startOperation}
              className="btn-retro"
              style={{
                fontSize: '18px',
                padding: '12px 36px',
                background: '#39c5bb',
                color: '#111',
                boxShadow: '0 0 20px rgba(57,197,187,0.5)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {getTranslation(lang, 'initButton')}
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'hub' && (
        <HubScreen
          lang={lang}
          playerProfile={playerProfile}
          publicProfile={publicProfile}
          setPublicProfile={setPublicProfile}
          gold={gold}
          setGold={setGold}
          breachShards={breachShards}
          setBreachShards={setBreachShards}
          eventTokens={eventTokens}
          setEventTokens={setEventTokens}
          unlockedHeroes={unlockedHeroes}
          heroLevels={heroLevels}
          setHeroLevels={setHeroLevels}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
          completedStages={completedStages}
          inventory={inventory}
          setInventory={setInventory}
          equippedGear={equippedGear}
          setEquippedGear={setEquippedGear}
          equippedEventItems={equippedEventItems}
          setEquippedEventItems={setEquippedEventItems}
          heroTalents={heroTalents}
          setHeroTalents={setHeroTalents}
          heroSkins={heroSkins}
          setHeroSkins={setHeroSkins}
          hiddenUniverses={hiddenUniverses}
          setHiddenUniverses={setHiddenUniverses}
          disabledAssets={disabledAssets}
          setDisabledAssets={setDisabledAssets}
          activityProgress={activityProgress}
          setActivityProgress={setActivityProgress}
          onLaunchStage={handleLaunchStage}
          onGoToPortal={() => { sound.playSfx('click'); setCurrentScreen('portal'); }}
        />
      )}

      {currentScreen === 'missionIntro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          onContinue={() => {
            sound.playSfx('special');
            setCurrentScreen('battle');
          }}
        />
      )}

      {currentScreen === 'battle' && activeStage && (
        <GameCanvas
          lang={lang}
          playerProfile={playerProfile}
          activeTeam={activeTeam}
          stage={activeStage}
          heroLevels={heroLevels}
          equippedGear={equippedGear}
          equippedEventItems={equippedEventItems}
          heroTalents={heroTalents}
          heroSkins={heroSkins}
          completedStages={completedStages}
          collectionBonusCount={collectionBonusCount}
          disabledAssets={disabledAssets}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {currentScreen === 'missionOutro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          result={lastBattleResult}
          rewardSummary={lastBattleSummary}
          onContinue={closeMissionOutro}
        />
      )}

      {currentScreen === 'portal' && (
        <PortalScreen
          lang={lang}
          playerProfile={playerProfile}
          breachShards={breachShards}
          setBreachShards={setBreachShards}
          portalStats={portalStats}
          setPortalStats={setPortalStats}
          unlockedHeroes={unlockedHeroes}
          setUnlockedHeroes={setUnlockedHeroes}
          hiddenUniverses={hiddenUniverses}
          disabledAssets={disabledAssets}
          onBack={() => { sound.playSfx('click'); setCurrentScreen('hub'); }}
        />
      )}
    </>
  );
}

export default App;
