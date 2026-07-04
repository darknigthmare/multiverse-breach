import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import sound from './game/soundEngine';
import AudioControl from './components/AudioControl';
import AuthPanel from './components/AuthPanel';
import { getTranslation } from './game/translation';
import { EQUIP_ITEMS_DB } from './game/heroes';
import { getOpenAiBackdropSrc } from './game/renderer';
import { getStoredSession, loadCloudSave, saveCloudSave, signInAccount, signOutAccount, signUpAccount, storeSession } from './game/cloudSave';
import { PLAYER_HERO_ID } from './game/playerHero';
import { DEFAULT_HIDDEN_UNIVERSES, isBaseGameUniverse } from './game/dlcConfig';

const SAVE_KEY = 'multiverse_breach_save_v2';
const TUTORIAL_COMPANION_IDS = ['arca_mirelle', 'arca_bastion'];
const HubScreen = React.lazy(() => import('./components/HubScreen'));
const PortalScreen = React.lazy(() => import('./components/PortalScreen'));
const GameCanvas = React.lazy(() => import('./components/GameCanvas'));

const DEFAULT_SAVE = {
  lang: 'fr',
  gold: 200,
  breachShards: 150,
  eventTokens: 10,
  playerProfile: { name: 'Ancre' },
  unlockedHeroes: [PLAYER_HERO_ID],
  heroLevels: { [PLAYER_HERO_ID]: 1 },
  activeTeam: [PLAYER_HERO_ID],
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
    lastSeenDay: '',
    defeatIntel: {},
    heroInstability: {},
    riftJournal: [],
    tutorialCompanionsUnlocked: false
  },
  inventory: ['nexus_anchor_coil'],
  equippedGear: {
    [PLAYER_HERO_ID]: null
  },
  equippedEventItems: {
    [PLAYER_HERO_ID]: null
  },
  hiddenUniverses: DEFAULT_HIDDEN_UNIVERSES,
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

const appendUnique = (items = [], additions = []) => {
  const next = [...items];
  additions.forEach(item => {
    if (!next.includes(item)) next.push(item);
  });
  return next;
};

const normalizeSavePayload = (save = {}) => {
  const merged = { ...DEFAULT_SAVE, ...save };
  const legacyStarterIds = ['freeman', 'masterchief'];
  const hasOnlyLegacyStarterProgress = (
    (merged.portalStats?.pulls || 0) === 0
    && (merged.completedStages || []).length === 0
    && (merged.activityProgress?.lifetimeWins || 0) === 0
  );
  const hadHiddenUniverseData = Object.prototype.hasOwnProperty.call(save, 'hiddenUniverses');
  const mergedUnlockedHeroes = Array.isArray(merged.unlockedHeroes) ? merged.unlockedHeroes : [];
  const normalizedUnlockedHeroes = hasOnlyLegacyStarterProgress
    ? mergedUnlockedHeroes.filter(heroId => !legacyStarterIds.includes(heroId))
    : mergedUnlockedHeroes;
  const unlockedHeroes = normalizedUnlockedHeroes.includes(PLAYER_HERO_ID)
    ? normalizedUnlockedHeroes
    : [PLAYER_HERO_ID, ...normalizedUnlockedHeroes];
  const mergedActiveTeam = Array.isArray(merged.activeTeam) ? merged.activeTeam : [];
  const normalizedActiveTeam = hasOnlyLegacyStarterProgress
    ? mergedActiveTeam.filter(heroId => !legacyStarterIds.includes(heroId))
    : mergedActiveTeam;
  const activeTeam = normalizedActiveTeam.includes(PLAYER_HERO_ID)
    ? normalizedActiveTeam.slice(0, 3)
    : [PLAYER_HERO_ID, ...normalizedActiveTeam.filter(id => id !== PLAYER_HERO_ID)].slice(0, 3);
  const shouldUseStoredHiddenUniverses = hadHiddenUniverseData
    && Array.isArray(merged.hiddenUniverses)
    && !(hasOnlyLegacyStarterProgress && merged.hiddenUniverses.length === 0);
  const hiddenUniverses = shouldUseStoredHiddenUniverses
    ? merged.hiddenUniverses
    : DEFAULT_HIDDEN_UNIVERSES;
  return {
    ...merged,
    playerProfile: { ...DEFAULT_SAVE.playerProfile, ...(merged.playerProfile || {}) },
    unlockedHeroes,
    activeTeam,
    heroLevels: { ...DEFAULT_SAVE.heroLevels, ...(merged.heroLevels || {}) },
    heroTalents: merged.heroTalents || {},
    heroSkins: merged.heroSkins || {},
    hiddenUniverses: hiddenUniverses.filter(universe => !isBaseGameUniverse(universe)),
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

const getContactIntel = (stage, lang) => {
  const modifierName = stage?.modifier?.name?.[lang] || stage?.modifier?.id || (lang === 'fr' ? 'anomalie non classee' : 'unclassified anomaly');
  const source = stage?.sourceUniverses?.join(' / ') || stage?.universe || (lang === 'fr' ? 'Trame inconnue' : 'Unknown Thread');
  return lang === 'fr'
    ? `Donnees de contact: ${stage?.bossName || 'noyau hostile'} / ${source} / modificateur ${modifierName}. A.R.C.A. annonce une adaptation +5% HP sur la prochaine tentative.`
    : `Contact data: ${stage?.bossName || 'hostile core'} / ${source} / ${modifierName} modifier. A.R.C.A. grants +5% HP adaptation on the next attempt.`;
};

const getMissionNarrative = (stage, lang, isOutro, victory) => {
  if (stage.fusionMission) {
    if (!isOutro) return stage.fusionMission.decor[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.displayName.fr} est stabilisee. ${stage.rewardItemName.fr} rejoint l armurerie Nexus comme trace de recomposition.`
        : `${stage.displayName.en} is stabilized. ${stage.rewardItemName.en} enters the Nexus armory as a recomposition trace.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste dangereuse: les univers sources continuent de se contaminer.`
        : `${stage.displayName.en} remains dangerous: source universes keep contaminating each other.`);
  }
  if (stage.characterArc) {
    if (!isOutro) return stage.characterArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.characterArc.outro.fr} ${stage.rewardItemName.fr} rejoint les archives personnelles comme signature stabilisee.`
        : `${stage.characterArc.outro.en} ${stage.rewardItemName.en} joins the personal archive as a stabilized signature.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste inachevee: la signature personnelle du heros n est pas encore assez stable.`
        : `${stage.displayName.en} remains unfinished: the hero personal signature is not stable enough yet.`);
  }
  if (stage.trioArc) {
    if (!isOutro) return stage.trioArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.trioArc.outro.fr} ${stage.rewardItemName.fr} est gravee comme trace de cellule trio.`
        : `${stage.trioArc.outro.en} ${stage.rewardItemName.en} is engraved as a trio-cell trace.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} reste instable: la cellule trio n a pas encore trouve son rythme commun.`
        : `${stage.displayName.en} remains unstable: the trio cell has not found its shared rhythm yet.`);
  }
  if (stage.universeArc) {
    if (!isOutro) return stage.universeArc.intro[lang];
    return victory
      ? (lang === 'fr'
        ? `${stage.universeArc.outro.fr} ${stage.rewardItemName.fr} rejoint les archives d arcs univers.`
        : `${stage.universeArc.outro.en} ${stage.rewardItemName.en} joins the universe-arc archives.`)
      : (lang === 'fr'
        ? `${stage.displayName.fr} resiste encore: les univers sources ne resonneront pas ensemble sans nouvelle intervention.`
        : `${stage.displayName.en} still resists: its source universes will not resonate together without another intervention.`);
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
      : (lang === 'fr' ? 'REPLI D ANCRE' : 'ANCHOR RETREAT')
    : (lang === 'fr' ? 'SEQUENCE NARRATIVE' : 'NARRATIVE SEQUENCE');
  const modeLine = stage.mode === 'RPG'
    ? (lang === 'fr' ? 'L escouade avance selon le protocole Resonance: initiative, charges et rupture du noyau.' : 'The squad advances under the Resonance protocol: initiative, charges, and core rupture.')
    : stage.mode === 'Tactics'
      ? (lang === 'fr' ? 'Le champ se decoupe en lignes d ancrage: chaque zone devient une decision de survie.' : 'The field splits into anchor lanes: every zone becomes a survival decision.')
      : (lang === 'fr' ? 'La breche explose en arene d impact ou les signatures frappent avant dissolution.' : 'The breach bursts into an impact arena where signatures strike before dissolution.');
  const narrativeLine = getMissionNarrative(stage, lang, isOutro, victory);
  const preparedBrief = Array.isArray(stage.launchBrief) ? stage.launchBrief.join(' ') : '';
  const preparedOutcome = Array.isArray(stage.outcomePreview) ? stage.outcomePreview.join(' ') : '';
  const introText = lang === 'fr'
    ? `${narrativeLine} ${preparedBrief || `Les archives du Nexus detectent ${stage.bossName}, lie au pattern "${modifierName}". ${modeLine} Objectif: verrouiller les coordonnees avant que la Singularity absorbe ce lore.`}`
    : `${narrativeLine} ${preparedBrief || `Nexus archives detect ${stage.bossName}, tied to the "${modifierName}" pattern. ${modeLine} Objective: lock the coordinates before the Singularity absorbs this lore.`}`;
  const outroText = victory
    ? (lang === 'fr'
      ? `${narrativeLine} ${preparedOutcome || `Les donnees de ${stage.bossName} rejoignent le codex, la signature ${rarity} est indexee et les caches sont transferees a l armurerie.`}`
      : `${narrativeLine} ${preparedOutcome || `${stage.bossName} data enters the codex, ${rarity} signature is indexed, and caches are transferred to the armory.`}`)
    : (lang === 'fr'
      ? `${narrativeLine} ${preparedOutcome || `L escouade conserve les donnees de contact, mais ${stage.bossName} garde le controle local du signal.`}`
      : `${narrativeLine} ${preparedOutcome || `The squad keeps contact data, but ${stage.bossName} still controls the local signal.`}`);

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
                {lang === 'fr' ? 'Transmission de stabilisation A.R.C.A.' : 'A.R.C.A. stabilization transmission'}
              </strong>
              <span>
                {lang === 'fr'
                  ? `Rapport de mission: ${stage.mode} / ${stage.universe} / cible ${stage.bossName}.`
                  : `Mission report: ${stage.mode} / ${stage.universe} / target ${stage.bossName}.`}
              </span>
              <span>
                {lang === 'fr'
                  ? `Ressources: +${rewardSummary.gold} or / +${rewardSummary.shards} fragments${rewardSummary.tokens ? ` / +${rewardSummary.tokens} jetons` : ''}.`
                  : `Resources: +${rewardSummary.gold} gold / +${rewardSummary.shards} shards${rewardSummary.tokens ? ` / +${rewardSummary.tokens} tokens` : ''}.`}
              </span>
              <span>
                {victory
                  ? (lang === 'fr'
                    ? 'Impact durable: la coordonnee est scellee, ses archives alimentent les arcs, collections et bonus Nexus.'
                    : 'Long-term impact: the coordinate is sealed, feeding arcs, collections, and Nexus bonuses.')
                  : (lang === 'fr'
                    ? 'Impact durable: la coordonnee reste ouverte, mais les donnees de contact ameliorent la prochaine tentative.'
                    : 'Long-term impact: the coordinate stays open, but contact data improves the next attempt.')}
              </span>
              <span>
                {lang === 'fr'
                  ? `Artefacts de terrain actives: ${rewardSummary.battleItemsUsed}.`
                  : `Field artifacts activated: ${rewardSummary.battleItemsUsed}.`}
              </span>
              {rewardSummary.firstClear && (
                <span>{lang === 'fr' ? 'Prime de premiere stabilisation gravee dans la Trame.' : 'First-stabilization prime engraved into the Thread.'}</span>
              )}
              {rewardSummary.consolation && (
                <span>{lang === 'fr' ? 'Cache de repli attribuee: la tentative progresse meme sans victoire.' : 'Retreat cache granted: the attempt still progresses without victory.'}</span>
              )}
              {rewardSummary.contactIntel && (
                <span>{rewardSummary.contactIntel}</span>
              )}
              {rewardSummary.adaptation && (
                <span>{lang === 'fr' ? 'Adaptation A.R.C.A.: prochaine tentative sur cette faille, +5% HP equipe.' : 'A.R.C.A. adaptation: next attempt on this rift, +5% team HP.'}</span>
              )}
              {rewardSummary.instability && (
                <span>{lang === 'fr' ? 'Instabilite douce: heros deployes a -5% stats pendant 1 mission.' : 'Soft instability: deployed heroes suffer -5% stats for 1 mission.'}</span>
              )}
              {rewardSummary.rewardItemName && (
                <span>{lang === 'fr' ? `Trace speciale archivee: ${rewardSummary.rewardItemName}.` : `Special trace archived: ${rewardSummary.rewardItemName}.`}</span>
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

function NexusLoadingScreen({ lang, label }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle, #0e0722 0%, #03010b 100%)',
      color: '#39c5bb',
      fontFamily: '"Share Tech Mono", monospace',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        padding: '18px 22px',
        border: '1px solid rgba(57,197,187,0.35)',
        background: 'rgba(0,0,0,0.42)',
        borderRadius: '6px',
        boxShadow: '0 0 22px rgba(57,197,187,0.18)'
      }}>
        <div style={{ fontSize: '12px', color: '#ffeb3b', marginBottom: '8px', textTransform: 'uppercase' }}>
          {lang === 'fr' ? 'Synchronisation A.R.C.A.' : 'A.R.C.A. Sync'}
        </div>
        <div style={{ fontSize: '15px' }}>
          {label || (lang === 'fr' ? 'Chargement de la Trame...' : 'Loading Thread...')}
        </div>
      </div>
    </div>
  );
}

class CombatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Combat screen failed', error);
  }

  render() {
    const { error } = this.state;
    const { lang, onBack, children } = this.props;
    if (!error) return children;
    return (
      <div className="narrative-screen">
        <div className="narrative-backdrop" style={{ backgroundImage: 'linear-gradient(90deg, rgba(2,1,8,0.82), rgba(2,1,8,0.94))' }}>
          <div className="narrative-rift" />
          <div className="narrative-copy">
            <div className="narrative-kicker">{lang === 'fr' ? 'DIAGNOSTIC COMBAT' : 'COMBAT DIAGNOSTIC'}</div>
            <h1>{lang === 'fr' ? 'Simulation interrompue' : 'Simulation interrupted'}</h1>
            <p>
              {lang === 'fr'
                ? 'A.R.C.A. a coupe la breche avant un ecran noir complet. Retourne au hub puis relance la mission.'
                : 'A.R.C.A. cut the breach before a full black screen. Return to the hub and launch the mission again.'}
            </p>
            <div className="narrative-intel">{error.message}</div>
            <button onClick={onBack} className="btn-retro narrative-button">
              {lang === 'fr' ? 'RETOUR AU HUB' : 'RETURN TO HUB'}
            </button>
          </div>
        </div>
      </div>
    );
  }
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
      ? 'Signature detectee. La trace locale reste active, cloud disponible.'
      : 'Trace locale active. Ancre une signature pour synchroniser.'
  ));
  const collectionBonusCount = inventory.filter(itemId => (
    itemId.startsWith('collection_reward_')
    || itemId.startsWith('arc_reward_')
    || itemId.startsWith('arc_')
    || itemId.startsWith('fusion_')
  )).length;

  const getCurrentSave = useCallback(() => ({
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
  }), [lang, gold, breachShards, eventTokens, playerProfile, unlockedHeroes, heroLevels, activeTeam, completedStages, heroTalents, heroSkins, hiddenUniverses, disabledAssets, portalStats, publicProfile, activityProgress, inventory, equippedGear, equippedEventItems]);

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
        setCloudStatus(lang === 'fr' ? 'Trace Nexus synchronisee dans le cloud.' : 'Nexus trace synced to cloud.');
      } catch (err) {
        setCloudStatus(`${lang === 'fr' ? 'Synchronisation Nexus impossible' : 'Nexus sync failed'}: ${err.message}`);
      }
    }, 1200);

    return () => window.clearTimeout(cloudSaveTimerRef.current);
  }, [getCurrentSave, account, lang]);

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
    setUnlockedHeroes(prev => appendUnique(prev.includes(PLAYER_HERO_ID) ? prev : [PLAYER_HERO_ID, ...prev], TUTORIAL_COMPANION_IDS));
    setHeroLevels(prev => ({
      ...prev,
      [PLAYER_HERO_ID]: prev[PLAYER_HERO_ID] || 1,
      ...Object.fromEntries(TUTORIAL_COMPANION_IDS.map(heroId => [heroId, prev[heroId] || 1]))
    }));
    setActiveTeam(prev => {
      const withPlayer = prev.includes(PLAYER_HERO_ID) ? prev : [PLAYER_HERO_ID, ...prev];
      return appendUnique(withPlayer, TUTORIAL_COMPANION_IDS).slice(0, 3);
    });
    setActivityProgress(prev => ({
      ...prev,
      tutorialCompanionsUnlocked: true
    }));
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
      consolation: false,
      contactIntel: null,
      adaptation: false,
      instability: false
    };
    const createRiftJournalEntry = (entryResult, extra = {}) => {
      const source = activeStage.sourceUniverses?.join(' / ') || activeStage.universe;
      const title = activeStage.displayName?.[lang] || activeStage.name || activeStage.universe;
      return {
        id: `${activeStage.id}-${Date.now()}-${entryResult}`,
        at: new Date().toISOString(),
        stageId: activeStage.id,
        result: entryResult,
        universe: activeStage.universe,
        source,
        title,
        text: entryResult === 'victory'
          ? (lang === 'fr'
            ? `A.R.C.A. archive ${title}: ${activeStage.bossName} neutralise, coordonnee ${source} scellee, consequence inscrite dans la Trame Nexus.`
            : `A.R.C.A. archives ${title}: ${activeStage.bossName} neutralized, ${source} coordinate sealed, consequence written into the Nexus Thread.`)
          : (lang === 'fr'
            ? `Repli sur ${title}: ${activeStage.bossName} conserve le signal local, mais A.R.C.A. garde les donnees de contact pour la prochaine tentative.`
            : `Retreat on ${title}: ${activeStage.bossName} keeps the local signal, but A.R.C.A. stores contact data for the next attempt.`),
        ...extra
      };
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
        defeatIntel: Object.fromEntries(
          Object.entries(prev.defeatIntel || {}).filter(([stageId]) => String(stageId) !== String(activeStage.id))
        ),
        heroInstability: Object.fromEntries(
          Object.entries(prev.heroInstability || {})
            .map(([heroId, value]) => [heroId, activeTeam.includes(heroId) ? Math.max(0, (Number(value) || 0) - 1) : Number(value) || 0])
            .filter(([, value]) => value > 0)
        ),
        modeWins: {
          ...(prev.modeWins || {}),
          [activeStage.mode]: (prev.modeWins?.[activeStage.mode] || 0) + 1,
          any: (prev.modeWins?.any || 0) + 1
        },
        riftJournal: [
          createRiftJournalEntry('victory', {
            firstClear,
            rewardItemName: summary.rewardItemName,
            rewards: { gold: summary.gold, shards: summary.shards, tokens: summary.tokens }
          }),
          ...(prev.riftJournal || [])
        ].slice(0, 12)
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
      summary.contactIntel = getContactIntel(activeStage, lang);
      summary.adaptation = true;
      summary.instability = true;
      summary.gold = Math.max(8, Math.round(activeStage.goldPrize * 0.18));
      summary.shards = Math.max(4, Math.round(activeStage.shardPrize * 0.22));
      setGold(prev => prev + summary.gold);
      setBreachShards(prev => prev + summary.shards);

      const { dayKey, weekKey } = getProgressKeys();
      setActivityProgress(prev => ({
        ...prev,
        dayKey,
        weekKey,
        defeatIntel: {
          ...(prev.defeatIntel || {}),
          [activeStage.id]: {
            stageId: activeStage.id,
            universe: activeStage.universe,
            sourceUniverses: activeStage.sourceUniverses || null,
            bossName: activeStage.bossName,
            modifierId: activeStage.modifier?.id || null,
            modifierName: activeStage.modifier?.name || null,
            attempts: ((prev.defeatIntel || {})[activeStage.id]?.attempts || 0) + 1,
            scannedAt: new Date().toISOString()
          }
        },
        heroInstability: {
          ...Object.fromEntries(
            Object.entries(prev.heroInstability || {})
              .filter(([heroId]) => !activeTeam.includes(heroId))
              .map(([heroId, value]) => [heroId, Math.max(0, Number(value) || 0)])
              .filter(([, value]) => value > 0)
          ),
          ...Object.fromEntries(activeTeam.map(heroId => [heroId, 1]))
        },
        itemActivations: (prev.dayKey === dayKey ? (prev.itemActivations || 0) : 0) + battleItemsUsed,
        weeklyItemActivations: (prev.weekKey === weekKey ? (prev.weeklyItemActivations || 0) : 0) + battleItemsUsed,
        lifetimeAttempts: (prev.lifetimeAttempts || 0) + 1,
        seasonXp: (prev.seasonXp || 0) + 12 + (battleItemsUsed * 2),
        riftJournal: [
          createRiftJournalEntry('defeat', {
            contactIntel: summary.contactIntel,
            rewards: { gold: summary.gold, shards: summary.shards, tokens: 0 }
          }),
          ...(prev.riftJournal || [])
        ].slice(0, 12)
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
      window.alert(lang === 'fr' ? 'Trace Nexus copiee dans le presse-papiers.' : 'Nexus trace copied to clipboard.');
    } catch {
      window.prompt(lang === 'fr' ? 'Copie ta trace Nexus :' : 'Copy your Nexus trace:', raw);
    }
  };

  const importSave = () => {
    const raw = window.prompt(lang === 'fr' ? 'Colle ta trace Nexus exportee :' : 'Paste exported Nexus trace:');
    if (!raw) return;
    try {
      applySave(JSON.parse(raw));
      sound.playSfx('levelup');
    } catch {
      window.alert(lang === 'fr' ? 'Trace Nexus invalide.' : 'Invalid Nexus trace.');
    }
  };

  const resetSave = () => {
    if (!window.confirm(lang === 'fr' ? 'Purger completement la trace Nexus ?' : 'Fully purge Nexus trace?')) return;
    window.localStorage.removeItem(SAVE_KEY);
    applySave(DEFAULT_SAVE);
    sound.playSfx('click');
  };

  const applyCloudSession = async (session, shouldLoadCloud = true) => {
    storeSession(session);
    setAccount(session);
    setCloudStatus(lang === 'fr' ? 'Signature ancree. Verification de l archive Nexus...' : 'Signature anchored. Checking Nexus archive...');

    if (!shouldLoadCloud) return;

    const row = await loadCloudSave(session);
    if (row?.payload) {
      skipNextCloudSaveRef.current = true;
      applySave(row.payload);
      setCloudStatus(lang === 'fr' ? 'Archive Nexus chargee.' : 'Nexus archive loaded.');
    } else {
      await saveCloudSave(session, getCurrentSave());
      setCloudStatus(lang === 'fr' ? 'Nouvelle archive Nexus gravee depuis cette trace.' : 'New Nexus archive engraved from this trace.');
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
      setCloudStatus(lang === 'fr' ? 'Signature creee. Confirme ton email puis ancre-la.' : 'Signature created. Confirm your email, then anchor it.');
      sound.playSfx('levelup');
      return;
    }
    await applyCloudSession(session, false);
    await saveCloudSave(session, getCurrentSave());
    setCloudStatus(lang === 'fr' ? 'Signature creee et trace gravee dans le Nexus.' : 'Signature created and trace engraved into the Nexus.');
    sound.playSfx('levelup');
  };

  const handleSignOut = async () => {
    const current = account;
    storeSession(null);
    setAccount(null);
    setCloudStatus(lang === 'fr' ? 'Signature detachee. Trace locale active.' : 'Signature detached. Local trace active.');
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
      setCloudStatus(lang === 'fr' ? 'Aucune archive Nexus trouvee.' : 'No Nexus archive found.');
      return;
    }
    skipNextCloudSaveRef.current = true;
    applySave(row.payload);
    setCloudStatus(lang === 'fr' ? 'Archive Nexus chargee.' : 'Nexus archive loaded.');
    sound.playSfx('coin');
  };

  const handleSaveCloud = async () => {
    if (!account) return;
    await saveCloudSave(account, getCurrentSave());
    setCloudStatus(lang === 'fr' ? 'Trace envoyee dans le cloud.' : 'Trace uploaded to cloud.');
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
        title={lang === 'fr' ? 'Change la langue de l interface entre francais et anglais.' : 'Switch the interface language between English and French.'}
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
        <button onClick={exportSave} className="btn-retro" title={lang === 'fr' ? 'Telecharge un fichier JSON contenant ta sauvegarde locale.' : 'Download a JSON file containing your local save.'} style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#39c5bb' }}>
          EXPORT TRACE
        </button>
        <button onClick={importSave} className="btn-retro" title={lang === 'fr' ? 'Importe un fichier de sauvegarde JSON et remplace la progression locale.' : 'Import a JSON save file and replace local progress.'} style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#ffeb3b', color: '#ffeb3b' }}>
          IMPORT TRACE
        </button>
        <button onClick={resetSave} className="btn-retro" title={lang === 'fr' ? 'Remet a zero la progression locale apres confirmation.' : 'Reset local progress after confirmation.'} style={{ fontSize: '10px', padding: '6px 9px', borderColor: '#e74c3c', color: '#e74c3c' }}>
          PURGE
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
                  ? 'Ton profil n est pas un formulaire externe: c est une signature d Ancre. Le Nexus l utilise pour retenir tes stabilisations, tes cellules, tes reliques, les Trames deja scellees et les choix qui pourront plus tard soutenir d autres Ancres sans casser la memoire.'
                  : 'Your profile is not an external form: it is an Anchored signature. The Nexus uses it to retain stabilizations, cells, relics, sealed Threads, and choices that can later support other Anchors without breaking memory.'}
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
                  ? 'A.R.C.A. ne t envoie plus seul: le tutoriel forme une cellule de depart avec deux signatures originales du Nexus avant la premiere vraie breche.'
                    : 'A.R.C.A. no longer sends you alone: the tutorial forms a starter cell with two original Nexus signatures before the first true breach.'
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
                  ? 'Ce nom devient ta premiere signature d Ancre et le heros central de la cellule.'
                  : 'This name becomes your first Anchor signature and the central hero of the cell.'}
              </span>
            </div>

            <div style={{
              margin: '0 auto 20px',
              maxWidth: '620px',
              padding: '12px 14px',
              border: '1px solid rgba(255,235,59,0.28)',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, rgba(255,235,59,0.08), rgba(57,197,187,0.06))',
              color: '#dffcff',
              fontSize: '12px',
              lineHeight: 1.45,
              textAlign: 'left'
            }}>
              <strong style={{ color: '#ffeb3b' }}>
                {lang === 'fr' ? 'Deblocage tutoriel A.R.C.A.' : 'A.R.C.A. tutorial unlock'}
              </strong>
              <br />
              {lang === 'fr'
                ? 'Mirelle Suture stabilise les blessures de Trame. Bastion Korr tient la ligne quand une faille force l ouverture. Ils rejoignent ta cellule de depart apres validation du profil.'
                : 'Mirelle Suture stabilizes Thread wounds. Bastion Korr holds the line when a rift forces itself open. They join your starter cell after profile validation.'}
            </div>

            <button
              onClick={startOperation}
              className="btn-retro"
              title={lang === 'fr' ? 'Cree ton profil joueur et ouvre le hub principal.' : 'Create your player profile and open the main hub.'}
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
        <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Ouverture du controle Nexus...' : 'Opening Nexus control...'} />}>
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
        </Suspense>
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
        <CombatErrorBoundary
          key={activeStage.id}
          lang={lang}
          onBack={() => {
            sound.stopBgm();
            setCurrentScreen('hub');
            setActiveStage(null);
          }}
        >
          <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Chargement du moteur de combat...' : 'Loading combat engine...'} />}>
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
          </Suspense>
        </CombatErrorBoundary>
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
        <Suspense fallback={<NexusLoadingScreen lang={lang} label={lang === 'fr' ? 'Ouverture du portail...' : 'Opening portal...'} />}>
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
            completedStages={completedStages}
            onBack={() => { sound.playSfx('click'); setCurrentScreen('hub'); }}
          />
        </Suspense>
      )}
    </>
  );
}

export default App;
