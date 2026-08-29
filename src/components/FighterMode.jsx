import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EngineFighter, resolveFighterCosmetics } from '../game/engineFighter';
import { ParticleSystem, drawUniverseBackground, preloadSpriteSheetSrcs } from '../game/renderer';
import { getRecentUniverseLevelProfile } from '../game/recentUniverseLevels';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout } from '../game/spriteAssets';
import { getUnlockableById } from '../game/universeUnlockables';
import { resolveActiveHudTheme } from '../game/cosmeticVisualAssets';
import sound from '../game/soundEngine';
import GameHudThemeLayer from './GameHudThemeLayer';

const CONTROL_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'q', 'Q', 'd', 'D', 'a', 'A', 'w', 'W', 'z', 'Z', 's', 'S',
  'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'r', 'R', 't', 'T',
  'y', 'Y',
  'j', 'J', 'k', 'K', 'l', 'L', 'i', 'I', 'u', 'U', 'o', 'O',
  'p', 'P', 'm', 'M', '1', '2', '3', '7', '8', '9', ' ', 'Shift'
]);

const DIFFICULTIES = [
  { id: 'training', label: { fr: 'ENTRAINEMENT', en: 'TRAINING' }, desc: { fr: 'IA lisible, degats reduits.', en: 'Readable AI, reduced damage.' } },
  { id: 'standard', label: { fr: 'STANDARD', en: 'STANDARD' }, desc: { fr: 'Pression et garde equilibrees.', en: 'Balanced pressure and guard.' } },
  { id: 'expert', label: { fr: 'EXPERT', en: 'EXPERT' }, desc: { fr: 'Reactions rapides, punition forte.', en: 'Fast reactions, heavy punishment.' } }
];

const emptySnapshot = {
  phase: 'idle',
  timer: 99,
  countdown: 3,
  announcement: '',
  combo: 0,
  maxCombo: 0,
  fieldSuperCharge: 0,
  fieldSuperUsed: false,
  fieldSuperId: null,
  opponentFieldSuperCharge: 0,
  opponentFieldSuperUsed: false,
  opponentFieldSuperId: null,
  assistCharge: 0,
  assistUsed: false,
  assistId: null,
  opponentAssistCharge: 0,
  opponentAssistUsed: false,
  opponentAssistId: null,
  opponentControl: 'cpu',
  fieldSupers: {
    player: { charge: 0, used: false, id: null },
    opponent: { charge: 0, used: false, id: null }
  },
  assists: {
    player: { charge: 0, used: false, ready: false, id: null },
    opponent: { charge: 0, used: false, ready: false, id: null }
  },
  cosmeticEvents: {
    intro: { active: false, remaining: 0, playerId: null, opponentId: null },
    assistId: null,
    koEffectId: null,
    victoryPoseId: null
  },
  player: { activeIndex: 0, tagCooldown: 0, fighters: [] },
  cpu: { activeIndex: 0, tagCooldown: 0, fighters: [] }
};

const hashValue = (value) => String(value).split('').reduce((total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0, 5381);

const getLocalizedName = (entry, lang, fallback = '') => (
  entry?.name?.[lang]
  || entry?.name?.fr
  || entry?.name?.en
  || entry?.name
  || fallback
);

const resolveOwnedUnlockables = (kind, ids, hiddenSet) => (
  [...new Set(Array.isArray(ids) ? ids : [])]
    .map(id => getUnlockableById(kind, id))
    .filter(item => item && !hiddenSet.has(item.universe))
);

const scaleHeroForFight = (hero, level = 1) => {
  const safeLevel = Math.max(1, Number(level) || 1);
  const statFactor = 1 + (safeLevel - 1) * 0.1;
  return {
    ...hero,
    fighterLevel: safeLevel,
    stats: {
      hp: Math.round(hero.stats.hp * statFactor),
      atk: Math.round(hero.stats.atk * statFactor),
      def: Math.round(hero.stats.def * statFactor),
      spd: Math.round(hero.stats.spd * (1 + (safeLevel - 1) * 0.03))
    }
  };
};

function FighterPortrait({ hero, active = false, ko = false }) {
  const src = getHeroSpriteSheetSrc(hero, 'melee');
  const layout = getSpriteSheetLayout(src);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => { if (!cancelled) setLoaded(true); };
    image.onerror = () => { if (!cancelled) setLoaded(false); };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);
  const initials = String(hero?.name || '?').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span
      className={`fighter-portrait ${active ? 'active' : ''} ${ko ? 'ko' : ''}`}
      style={{
        backgroundImage: loaded ? `url("${src}")` : 'none',
        backgroundSize: `${layout.columns * 100}% ${layout.rows * 100}%`,
        backgroundPosition: '0 0',
        color: hero?.secondaryColor || '#39c5bb'
      }}
      aria-hidden="true"
    >
      {!loaded && <b>{initials}</b>}
    </span>
  );
}

function Lineup({ lang, heroes, side, snapshot, onTag, interactive = side === 'player' }) {
  const stateById = snapshot?.fighters || [];
  return (
    <div className={`fighter-lineup fighter-lineup-${side}`}>
      {heroes.map((hero, index) => {
        const state = stateById[index];
        const hpPct = state ? Math.max(0, Math.min(100, (state.currentHp / state.maxHp) * 100)) : 100;
        return (
          <button
            key={`${side}-${hero.id}-${index}`}
            type="button"
            className={`${state?.active ? 'active' : ''} ${state?.ko ? 'ko' : ''}`}
            disabled={!interactive || !state || state.ko || state.active || snapshot.tagCooldown > 0}
            onClick={() => onTag?.(index)}
            title={interactive
              ? (lang === 'fr' ? `Appelle ${hero.name} dans l arene.` : `Tag ${hero.name} into the arena.`)
              : (lang === 'fr' ? 'Equipe adverse controlee par A.R.C.A.' : 'Opponent team controlled by A.R.C.A.')}
          >
            <FighterPortrait hero={hero} active={state?.active} ko={state?.ko} />
            <span>
              <strong>{hero.name}</strong>
              <small>{state?.ko ? 'KO' : `LV ${hero.fighterLevel || 1}`}</small>
              <i><b style={{ width: `${hpPct}%` }} /></i>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FighterLoadoutSelect({
  label,
  value,
  onChange,
  options,
  defaultLabel,
  emptyLabel
}) {
  return (
    <label style={{ minWidth: 0, display: 'grid', gap: 6 }}>
      <span className="fighter-section-label">{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value || null)}
        style={{
          width: '100%',
          minHeight: 38,
          padding: '8px 10px',
          border: '1px solid rgba(57, 197, 187, 0.32)',
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.58)',
          color: '#e8ffff',
          font: "10px 'Share Tech Mono', monospace"
        }}
      >
        <option value="">{defaultLabel}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      <small style={{ color: '#8fa8ad', fontSize: 9 }}>
        {options.length ? `${options.length} ${options.length > 1 ? 'signatures' : 'signature'}` : emptyLabel}
      </small>
    </label>
  );
}

function FighterAssistPanel({
  lang,
  playerLabel,
  keyLabel,
  assist,
  state,
  ready,
  onTrigger
}) {
  const charge = Math.max(0, Math.min(100, Number(state?.charge) || 0));
  return (
    <section>
      <div className="fighter-side-heading">
        <span>{playerLabel} / {keyLabel}</span>
        <b>
          {!assist
            ? (lang === 'fr' ? 'VIDE' : 'EMPTY')
            : state?.used
              ? (lang === 'fr' ? 'UTILISE' : 'USED')
              : `${Math.floor(charge)}%`}
        </b>
      </div>
      <strong style={{ display: 'block', margin: '8px 0 6px', color: assist?.color || '#8fa8ad', fontSize: 10 }}>
        {assist
          ? getLocalizedName(assist, lang, assist.universe)
          : (lang === 'fr' ? 'Aucun assist equipe' : 'No assist equipped')}
      </strong>
      <div
        role="progressbar"
        aria-label={playerLabel}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.floor(charge)}
        style={{ height: 7, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.1)' }}
      >
        <i
          style={{
            width: `${charge}%`,
            height: '100%',
            display: 'block',
            background: assist?.color || '#8fa8ad',
            boxShadow: ready ? `0 0 12px ${assist?.color || '#39c5bb'}` : 'none'
          }}
        />
      </div>
      <button
        type="button"
        className="btn-retro"
        disabled={!ready}
        onClick={onTrigger}
        style={{ width: '100%', marginTop: 8 }}
      >
        {lang === 'fr' ? `APPELER L ASSIST [${keyLabel}]` : `CALL ASSIST [${keyLabel}]`}
      </button>
    </section>
  );
}

export default function FighterMode({
  lang = 'fr',
  heroes = [],
  unlockedHeroes = [],
  activeTeam = [],
  heroLevels = {},
  fighterCareer = {},
  portalCollection = {},
  setPortalCollection = () => {},
  hiddenUniverses = [],
  disabledAssets = {},
  onMatchComplete,
  customConfig = null,
  onExit,
  onSessionStart,
  onSessionEnd,
  sessionPaused = false,
  sessionExitRequest = 0,
  dedicatedSession = false
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const inputRef = useRef({ player: {}, cpu: {} });
  const onMatchCompleteRef = useRef(onMatchComplete);
  const onSessionEndRef = useRef(onSessionEnd);
  const sessionPausedRef = useRef(sessionPaused);
  const sessionExitRequestRef = useRef(sessionExitRequest);
  const [difficulty, setDifficulty] = useState('standard');
  const [opponentSeed, setOpponentSeed] = useState(1);
  const [matchNonce, setMatchNonce] = useState(0);
  const [matchStarted, setMatchStarted] = useState(Boolean(customConfig?.autoStart));
  const [summary, setSummary] = useState(null);
  const [snapshot, setSnapshot] = useState(emptySnapshot);
  const isCustomBattle = Boolean(customConfig);
  const activeHudTheme = resolveActiveHudTheme(portalCollection);
  const opponentControl = customConfig?.opponentControl === 'p2' ? 'p2' : 'cpu';
  const fighterCosmetics = useMemo(
    () => resolveFighterCosmetics(customConfig?.cosmetics),
    [customConfig?.cosmetics]
  );
  const configuredDifficulty = DIFFICULTIES.some(option => option.id === customConfig?.difficulty)
    ? customConfig.difficulty
    : difficulty;

  useEffect(() => {
    onMatchCompleteRef.current = onMatchComplete;
  }, [onMatchComplete]);

  useEffect(() => {
    onSessionEndRef.current = onSessionEnd;
  }, [onSessionEnd]);

  // Le shell du hub pilote la pause sans reconstruire le moteur du duel.
  useEffect(() => {
    sessionPausedRef.current = sessionPaused;
    if (sessionPaused) inputRef.current = { player: {}, cpu: {} };
  }, [sessionPaused]);

  // Une demande de sortie confirmee depuis le menu pause ramene le duel au lobby.
  useEffect(() => {
    if (sessionExitRequestRef.current === sessionExitRequest) return;
    sessionExitRequestRef.current = sessionExitRequest;
    setMatchStarted(false);
    setSummary(null);
    setSnapshot(emptySnapshot);
    inputRef.current = { player: {}, cpu: {} };
    onSessionEndRef.current?.({ reason: 'abandoned' });
  }, [sessionExitRequest]);

  useEffect(() => {
    if (customConfig?.autoStart) setMatchStarted(true);
  }, [customConfig?.autoStart]);

  const hiddenSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const disabledStageSet = useMemo(
    () => new Set((disabledAssets.stages || []).map(String)),
    [disabledAssets.stages]
  );
  const ownedArchives = useMemo(() => (
    (Array.isArray(portalCollection.archives) ? portalCollection.archives : [])
      .filter(archive => (
        archive?.id
        && !hiddenSet.has(archive.universe)
        && !disabledStageSet.has(String(archive.id))
      ))
  ), [disabledStageSet, hiddenSet, portalCollection.archives]);
  const ownedBattleMusic = useMemo(
    () => resolveOwnedUnlockables('battleMusic', portalCollection.battleMusic, hiddenSet),
    [hiddenSet, portalCollection.battleMusic]
  );
  const ownedStageMusic = useMemo(
    () => resolveOwnedUnlockables('stageMusic', portalCollection.stageMusic, hiddenSet),
    [hiddenSet, portalCollection.stageMusic]
  );
  const ownedFieldSupers = useMemo(
    () => resolveOwnedUnlockables('fieldSuper', portalCollection.fieldSupers, hiddenSet),
    [hiddenSet, portalCollection.fieldSupers]
  );
  const customLoadout = portalCollection.customLoadout || {};
  const configValue = (key, fallback) => (
    customConfig && Object.prototype.hasOwnProperty.call(customConfig, key)
      ? customConfig[key]
      : fallback
  );
  const selectedArchiveId = configValue('archiveId', customLoadout.archive);
  const selectedBattleMusicId = configValue('battleMusicId', customLoadout.battleMusic);
  const selectedStageMusicId = configValue('stageMusicId', customLoadout.stageMusic);
  const selectedFieldSuperId = configValue('fieldSuperId', customLoadout.fieldSuper);
  const activeArchive = useMemo(
    () => ownedArchives.find(archive => archive.id === selectedArchiveId) || null,
    [ownedArchives, selectedArchiveId]
  );
  const activeBattleMusic = useMemo(
    () => ownedBattleMusic.find(track => track.id === selectedBattleMusicId) || null,
    [ownedBattleMusic, selectedBattleMusicId]
  );
  const activeStageMusic = useMemo(
    () => ownedStageMusic.find(track => track.id === selectedStageMusicId) || null,
    [ownedStageMusic, selectedStageMusicId]
  );
  const activeFieldSuper = useMemo(
    () => ownedFieldSupers.find(fieldSuper => fieldSuper.id === selectedFieldSuperId) || null,
    [ownedFieldSupers, selectedFieldSuperId]
  );

  const updateCustomLoadout = (slot, id) => {
    setPortalCollection(previous => ({
      ...(previous || {}),
      customLoadout: {
        ...(previous?.customLoadout || {}),
        [slot]: id || null
      }
    }));
    sound.playSfx('click');
  };

  const unlockedSet = useMemo(() => new Set(unlockedHeroes), [unlockedHeroes]);
  const playerHeroes = useMemo(() => {
    const configuredIds = Array.isArray(customConfig?.playerTeamIds)
      ? customConfig.playerTeamIds
      : [];
    const sourceIds = configuredIds.length ? configuredIds : activeTeam;
    const selected = sourceIds
      .map(id => heroes.find(hero => hero.id === id))
      .filter(hero => hero && (
        configuredIds.length
        || hero.id === 'player_anchor'
        || unlockedSet.has(hero.id)
      ))
      .slice(0, 3);
    const fallback = heroes.find(hero => unlockedSet.has(hero.id)) || heroes[0];
    return (selected.length ? selected : [fallback].filter(Boolean))
      .map(hero => scaleHeroForFight(hero, heroLevels[hero.id] || 1));
  }, [activeTeam, customConfig?.playerTeamIds, heroLevels, heroes, unlockedSet]);

  const averageLevel = useMemo(() => Math.max(1, Math.round(
    playerHeroes.reduce((total, hero) => total + (hero.fighterLevel || 1), 0) / Math.max(1, playerHeroes.length)
  )), [playerHeroes]);

  const opponentHeroes = useMemo(() => {
    const configuredIds = Array.isArray(customConfig?.opponentTeamIds)
      ? customConfig.opponentTeamIds
      : [];
    if (configuredIds.length) {
      return configuredIds
        .map(id => heroes.find(hero => hero.id === id))
        .filter(Boolean)
        .slice(0, 3)
        .map(hero => scaleHeroForFight(hero, heroLevels[hero.id] || averageLevel));
    }
    const selectedIds = new Set(playerHeroes.map(hero => hero.id));
    let pool = heroes.filter(hero => !selectedIds.has(hero.id));
    if (pool.length < playerHeroes.length) pool = heroes;
    const sorted = [...pool].sort((left, right) => {
      const leftScore = hashValue(`${opponentSeed}-${left.id}`);
      const rightScore = hashValue(`${opponentSeed}-${right.id}`);
      return leftScore - rightScore;
    });
    return sorted.slice(0, Math.max(1, playerHeroes.length)).map(hero => scaleHeroForFight(hero, averageLevel));
  }, [averageLevel, customConfig?.opponentTeamIds, heroLevels, heroes, opponentSeed, playerHeroes]);

  const arenaUniverse = useMemo(() => (
    activeArchive?.universe
      || playerHeroes.find(hero => getRecentUniverseLevelProfile(hero.universe))?.universe
      || opponentHeroes.find(hero => getRecentUniverseLevelProfile(hero.universe))?.universe
      || playerHeroes.find(hero => hero.universe)?.universe
      || opponentHeroes.find(hero => hero.universe)?.universe
      || 'Nexus de Convergence'
  ), [activeArchive, opponentHeroes, playerHeroes]);
  const arenaLevelProfile = useMemo(() => getRecentUniverseLevelProfile(arenaUniverse), [arenaUniverse]);
  const fighterMusicStage = useMemo(() => ({
    id: `fighter-${arenaUniverse}-${opponentHeroes.map(hero => hero.id).join('-') || 'echo'}`,
    name: arenaLevelProfile?.combat?.name || `A.R.C.A. Impact Arena - ${arenaUniverse}`,
    universe: arenaUniverse,
    mode: 'Fighter',
    bossName: opponentHeroes.length === 1 ? opponentHeroes[0]?.name : '',
    tags: ['duel', 'loreArena']
  }), [arenaLevelProfile, arenaUniverse, opponentHeroes]);
  const battleMusicStage = useMemo(() => (
    activeBattleMusic
      ? {
          ...activeBattleMusic.musicStage,
          name: getLocalizedName(activeBattleMusic, lang, activeBattleMusic.musicStage?.name),
          bossName: opponentHeroes.length === 1 ? opponentHeroes[0]?.name : ''
        }
      : fighterMusicStage
  ), [activeBattleMusic, fighterMusicStage, lang, opponentHeroes]);
  const lobbyMusicStage = useMemo(() => (
    activeStageMusic
      ? {
          ...activeStageMusic.musicStage,
          name: getLocalizedName(activeStageMusic, lang, activeStageMusic.musicStage?.name)
        }
      : {
          ...fighterMusicStage,
          id: `fighter-lobby-${fighterMusicStage.id}`,
          tags: ['customStage', 'loreArena']
        }
  ), [activeStageMusic, fighterMusicStage, lang]);

  useEffect(() => {
    if (matchStarted) return undefined;
    sound.playStageBgm(lobbyMusicStage, activeStageMusic?.state || 'grid');
    return () => sound.stopBgm();
  }, [activeStageMusic, lobbyMusicStage, matchStarted]);

  useEffect(() => {
    if (!matchStarted || !playerHeroes.length || !opponentHeroes.length) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    inputRef.current = { player: {}, cpu: {} };
    setSummary(null);
    setSnapshot(emptySnapshot);
    const cosmeticSpriteSheets = ['player', 'cpu'].flatMap(side => (
      Object.values(fighterCosmetics[side] || {})
        .map(cosmetic => cosmetic?.animation?.sheet || cosmetic?.visual?.sheet)
        .filter(Boolean)
    ));
    preloadSpriteSheetSrcs([
      ...playerHeroes.map(hero => getHeroSpriteSheetSrc(hero, 'melee')),
      ...opponentHeroes.map(hero => getHeroSpriteSheetSrc(hero, 'melee')),
      ...cosmeticSpriteSheets
    ]);

    const particles = new ParticleSystem();
    const engine = new EngineFighter(
      canvas.width,
      canvas.height,
      playerHeroes,
      opponentHeroes,
      particles,
      type => sound.playSfx(type),
      (result, report) => {
        const resolved = {
          ...report,
          result,
          rewards: isCustomBattle
            ? { gold: 0, shards: 0, seasonXp: 0 }
            : report.rewards
        };
        setSummary(resolved);
        setSnapshot(engine.getSnapshot());
        sound.setStageMusicState(result, { ...battleMusicStage, result });
        onMatchCompleteRef.current?.(resolved);
        onSessionEndRef.current?.({ reason: 'completed', report: resolved });
      },
      {
        difficulty: configuredDifficulty,
        opponentControl,
        universe: arenaUniverse,
        levelProfile: arenaLevelProfile,
        fieldSuper: activeFieldSuper,
        fieldSupers: {
          player: activeFieldSuper,
          opponent: opponentControl === 'p2' ? activeFieldSuper : null
        },
        cosmetics: fighterCosmetics
      }
    );
    engineRef.current = engine;
    sound.playStageBgm(battleMusicStage, activeBattleMusic?.state || 'battle');

    let animationId = 0;
    let last = performance.now();
    let snapshotClock = 0;
    const loop = now => {
      const dt = Math.min(0.034, Math.max(0, (now - last) / 1000));
      last = now;
      if (sessionPausedRef.current) {
        animationId = requestAnimationFrame(loop);
        return;
      }
      engine.setSideInput('player', inputRef.current.player);
      engine.setSideInput('cpu', inputRef.current.cpu);
      engine.update(dt);
      particles.update();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawUniverseBackground(ctx, arenaUniverse, canvas.width, canvas.height, 'Combat');
        engine.draw(ctx, now / 16.67);
        particles.draw(ctx);
      }
      snapshotClock += dt;
      if (snapshotClock >= 0.1) {
        snapshotClock = 0;
        setSnapshot(engine.getSnapshot());
      }
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);

    const clearInputs = () => {
      inputRef.current = { player: {}, cpu: {} };
    };
    const setHeldInputForSide = (side, control, active) => {
      inputRef.current[side][control] = active;
    };
    const onKeyDown = event => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      if (sessionPausedRef.current) return;
      const key = event.key.toLowerCase();

      if (key === 'q') setHeldInputForSide('player', 'left', true);
      else if (key === 'd') setHeldInputForSide('player', 'right', true);
      else if (key === 's') setHeldInputForSide('player', 'down', true);
      else if (key === 'e') setHeldInputForSide('player', 'guard', true);

      if (opponentControl === 'p2') {
        if (key === 'arrowleft') setHeldInputForSide('cpu', 'left', true);
        else if (key === 'arrowright') setHeldInputForSide('cpu', 'right', true);
        else if (key === 'arrowdown') setHeldInputForSide('cpu', 'down', true);
        else if (key === 'u') setHeldInputForSide('cpu', 'guard', true);
      } else {
        if (['arrowleft', 'a'].includes(key)) setHeldInputForSide('player', 'left', true);
        else if (key === 'arrowright') setHeldInputForSide('player', 'right', true);
        else if (key === 'arrowdown') setHeldInputForSide('player', 'down', true);
        else if (key === 'shift' || key === 'i') setHeldInputForSide('player', 'guard', true);
      }

      if (event.repeat) return;

      if (key === 'z') engine.triggerSideAction('player', 'jump');
      else if (key === 'f') engine.triggerSideAction('player', 'light');
      else if (key === 'g') engine.triggerSideAction('player', 'heavy');
      else if (key === 'h') engine.triggerSideAction('player', 'special');
      else if (key === 'r') engine.triggerSideAction('player', 'super');
      else if (key === 't') engine.triggerFieldSuper('player');
      else if (key === 'y') engine.triggerAssist('player');
      else if (['1', '2', '3'].includes(key)) engine.triggerSideAction('player', 'tag', Number(key) - 1);

      if (opponentControl === 'p2') {
        if (key === 'arrowup') engine.triggerSideAction('cpu', 'jump');
        else if (key === 'p') engine.triggerSideAction('cpu', 'light');
        else if (key === 'm') engine.triggerSideAction('cpu', 'heavy');
        else if (key === 'l') engine.triggerSideAction('cpu', 'special');
        else if (key === 'o') engine.triggerSideAction('cpu', 'super');
        else if (key === 'i') engine.triggerFieldSuper('cpu');
        else if (key === 'k') engine.triggerAssist('cpu');
        else if (['7', '8', '9'].includes(key)) engine.triggerSideAction('cpu', 'tag', Number(key) - 7);
      } else {
        if (['arrowup', 'w', ' '].includes(key)) engine.triggerPlayerAction('jump');
        else if (key === 'j') engine.triggerPlayerAction('light');
        else if (key === 'k') engine.triggerPlayerAction('heavy');
        else if (key === 'l') engine.triggerPlayerAction('special');
        else if (key === 'u') engine.triggerPlayerAction('super');
        else if (key === 'o') engine.triggerFieldSuper();
      }
    };
    const onKeyUp = event => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      const key = event.key.toLowerCase();

      if (key === 'q') setHeldInputForSide('player', 'left', false);
      else if (key === 'd') setHeldInputForSide('player', 'right', false);
      else if (key === 's') setHeldInputForSide('player', 'down', false);
      else if (key === 'e') setHeldInputForSide('player', 'guard', false);

      if (opponentControl === 'p2') {
        if (key === 'arrowleft') setHeldInputForSide('cpu', 'left', false);
        else if (key === 'arrowright') setHeldInputForSide('cpu', 'right', false);
        else if (key === 'arrowdown') setHeldInputForSide('cpu', 'down', false);
        else if (key === 'u') setHeldInputForSide('cpu', 'guard', false);
      } else {
        if (['arrowleft', 'a'].includes(key)) setHeldInputForSide('player', 'left', false);
        else if (key === 'arrowright') setHeldInputForSide('player', 'right', false);
        else if (key === 'arrowdown') setHeldInputForSide('player', 'down', false);
        else if (key === 'shift' || key === 'i') setHeldInputForSide('player', 'guard', false);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) clearInputs();
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('blur', clearInputs);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputs);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sound.stopBgm();
      engineRef.current = null;
      inputRef.current = { player: {}, cpu: {} };
    };
  }, [
    activeBattleMusic,
    activeFieldSuper,
    arenaLevelProfile,
    arenaUniverse,
    battleMusicStage,
    configuredDifficulty,
    fighterCosmetics,
    isCustomBattle,
    matchNonce,
    matchStarted,
    opponentControl,
    opponentHeroes,
    playerHeroes
  ]);

  const startMatch = () => {
    if (sessionPausedRef.current || !playerHeroes.length || !opponentHeroes.length) return;
    onSessionStart?.();
    setSummary(null);
    setSnapshot(emptySnapshot);
    setMatchNonce(value => value + 1);
    setMatchStarted(true);
    sound.playSfx('special');
  };

  const returnToLobby = () => {
    if (sessionPausedRef.current) return;
    setMatchStarted(false);
    setSummary(null);
    setSnapshot(emptySnapshot);
    inputRef.current = { player: {}, cpu: {} };
    sound.playSfx('click');
    const exitHandler = typeof customConfig?.onExit === 'function'
      ? customConfig.onExit
      : onExit;
    if (typeof exitHandler === 'function') exitHandler();
  };

  const rerollOpponents = () => {
    setOpponentSeed(value => value + 1);
    sound.playSfx('coin');
  };

  const triggerAction = (action, side = 'player') => {
    if (sessionPausedRef.current) return;
    engineRef.current?.triggerSideAction(side, action);
  };

  const triggerFieldSuper = (side = 'player') => {
    if (sessionPausedRef.current) return;
    engineRef.current?.triggerFieldSuper(side);
  };

  const triggerAssist = (side = 'player') => {
    if (sessionPausedRef.current) return;
    engineRef.current?.triggerAssist(side);
  };

  const setHeldInput = (key, active, side = 'player') => {
    if (sessionPausedRef.current) {
      inputRef.current = { player: {}, cpu: {} };
      return;
    }
    inputRef.current[side][key] = active;
  };

  const triggerTag = (index, side = 'player') => {
    if (sessionPausedRef.current) return;
    if (side === 'player') {
      engineRef.current?.triggerPlayerAction('tag', index);
      return;
    }
    engineRef.current?.triggerSideAction(side, 'tag', index);
  };

  const playerSnapshot = snapshot.player || emptySnapshot.player;
  const cpuSnapshot = snapshot.cpu || emptySnapshot.cpu;
  const playerFieldState = snapshot.fieldSupers?.player || {
    charge: snapshot.fieldSuperCharge,
    used: snapshot.fieldSuperUsed,
    id: snapshot.fieldSuperId
  };
  const opponentFieldState = snapshot.fieldSupers?.opponent || {
    charge: snapshot.opponentFieldSuperCharge,
    used: snapshot.opponentFieldSuperUsed,
    id: snapshot.opponentFieldSuperId
  };
  const fieldSuperCharge = Math.max(0, Math.min(100, Number(playerFieldState.charge) || 0));
  const opponentFieldSuperCharge = Math.max(0, Math.min(100, Number(opponentFieldState.charge) || 0));
  const fieldSuperReady = Boolean(
    activeFieldSuper
    && !playerFieldState.used
    && fieldSuperCharge >= 100
    && snapshot.phase === 'running'
  );
  const opponentFieldSuperReady = Boolean(
    opponentControl === 'p2'
    && activeFieldSuper
    && !opponentFieldState.used
    && opponentFieldSuperCharge >= 100
    && snapshot.phase === 'running'
  );
  const playerAssist = fighterCosmetics.player.npcAssist;
  const opponentAssist = fighterCosmetics.cpu.npcAssist;
  const playerAssistState = snapshot.assists?.player || {
    charge: snapshot.assistCharge,
    used: snapshot.assistUsed,
    id: snapshot.assistId
  };
  const opponentAssistState = snapshot.assists?.opponent || {
    charge: snapshot.opponentAssistCharge,
    used: snapshot.opponentAssistUsed,
    id: snapshot.opponentAssistId
  };
  const playerAssistReady = Boolean(
    playerAssist
    && !playerAssistState.used
    && Number(playerAssistState.charge) >= 100
    && snapshot.phase === 'running'
  );
  const opponentAssistReady = Boolean(
    opponentControl === 'p2'
    && opponentAssist
    && !opponentAssistState.used
    && Number(opponentAssistState.charge) >= 100
    && snapshot.phase === 'running'
  );

  if (!matchStarted) {
    return (
      <section className={`fighter-mode-shell ${activeHudTheme ? 'game-hud-themed-interface' : ''}`} aria-labelledby="fighter-mode-title">
        <GameHudThemeLayer theme={activeHudTheme} mode="combat" />
        <header className="fighter-mode-header">
          <div>
            <span>PROTOCOLE DUEL A.R.C.A.</span>
            <h3 id="fighter-mode-title">{lang === 'fr' ? 'Combat de resonance' : 'Resonance Fighter'}</h3>
            <p>{lang === 'fr'
              ? 'Une seule arene plane. Une signature active par camp. Les remplacements gardent leurs PV et entrent manuellement ou apres un K.-O.'
              : 'One flat arena. One active signature per side. Bench fighters keep their health and enter manually or after a K.O.'}</p>
          </div>
          <div className="fighter-career-summary">
            <span>{lang === 'fr' ? 'ARCHIVE DUEL' : 'FIGHT ARCHIVE'}</span>
            <strong>{fighterCareer.wins || 0}V / {fighterCareer.losses || 0}D</strong>
            <small>{lang === 'fr' ? 'Meilleur combo' : 'Best combo'}: {fighterCareer.bestCombo || 0}</small>
          </div>
        </header>

        <div className="fighter-versus-grid">
          <section>
            <span className="fighter-section-label">{lang === 'fr' ? 'CELLULE JOUEUR' : 'PLAYER CELL'}</span>
            <Lineup lang={lang} heroes={playerHeroes} side="player" snapshot={{ fighters: [], tagCooldown: 0 }} />
          </section>
          <div className="fighter-versus-mark" aria-hidden="true">VS</div>
          <section>
            <span className="fighter-section-label">
              {opponentControl === 'p2'
                ? (lang === 'fr' ? 'CELLULE JOUEUR 2' : 'PLAYER 2 CELL')
                : (lang === 'fr' ? 'CELLULE ECHO CPU' : 'CPU ECHO CELL')}
            </span>
            <Lineup lang={lang} heroes={opponentHeroes} side="cpu" snapshot={{ fighters: [], tagCooldown: 0 }} />
          </section>
        </div>

        <section
          aria-label={lang === 'fr' ? 'Deblocages du combat custom' : 'Custom battle unlockables'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 12,
            padding: 14,
            border: '1px solid rgba(255, 69, 0, 0.24)',
            borderRadius: 6,
            background: 'rgba(3, 4, 10, 0.72)'
          }}
        >
          <FighterLoadoutSelect
            label={lang === 'fr' ? 'STAGE CUSTOM' : 'CUSTOM STAGE'}
            value={activeArchive?.id || ''}
            onChange={id => updateCustomLoadout('archive', id)}
            options={ownedArchives.map(archive => ({
              id: archive.id,
              label: `${archive.universe} / ${archive.mode || (lang === 'fr' ? 'Stage' : 'Stage')}`
            }))}
            defaultLabel={lang === 'fr' ? 'NEXUS / ARENE AUTO' : 'NEXUS / AUTO ARENA'}
            emptyLabel={lang === 'fr' ? 'Stage a obtenir dans les boosters.' : 'Find a stage in boosters.'}
          />
          <FighterLoadoutSelect
            label={lang === 'fr' ? 'MUSIQUE DU COMBAT' : 'BATTLE MUSIC'}
            value={activeBattleMusic?.id || ''}
            onChange={id => updateCustomLoadout('battleMusic', id)}
            options={ownedBattleMusic.map(track => ({
              id: track.id,
              label: getLocalizedName(track, lang, track.universe)
            }))}
            defaultLabel={lang === 'fr' ? 'AUTO / IMPACT A.R.C.A.' : 'AUTO / A.R.C.A. IMPACT'}
            emptyLabel={lang === 'fr' ? 'Piste a obtenir dans les boosters.' : 'Find a track in boosters.'}
          />
          <FighterLoadoutSelect
            label={lang === 'fr' ? 'MUSIQUE DU STAGE / LOBBY' : 'STAGE / LOBBY MUSIC'}
            value={activeStageMusic?.id || ''}
            onChange={id => updateCustomLoadout('stageMusic', id)}
            options={ownedStageMusic.map(track => ({
              id: track.id,
              label: getLocalizedName(track, lang, track.universe)
            }))}
            defaultLabel={lang === 'fr' ? 'AUTO / SIGNAL NEXUS' : 'AUTO / NEXUS SIGNAL'}
            emptyLabel={lang === 'fr' ? 'Theme a obtenir dans les boosters.' : 'Find a theme in boosters.'}
          />
          <FighterLoadoutSelect
            label={lang === 'fr' ? 'SUPER DE TERRAIN' : 'FIELD SUPER'}
            value={activeFieldSuper?.id || ''}
            onChange={id => updateCustomLoadout('fieldSuper', id)}
            options={ownedFieldSupers.map(fieldSuper => ({
              id: fieldSuper.id,
              label: getLocalizedName(fieldSuper, lang, fieldSuper.universe)
            }))}
            defaultLabel={lang === 'fr' ? 'AUCUN / EMPLACEMENT LIBRE' : 'NONE / EMPTY SLOT'}
            emptyLabel={lang === 'fr' ? 'Super a obtenir dans les boosters.' : 'Find a super in boosters.'}
          />
        </section>

        <div className="fighter-preflight-bar">
          <div>
            {opponentControl === 'p2' ? (
              <>
                <span className="fighter-section-label">{lang === 'fr' ? 'CONTROLE ADVERSE' : 'OPPONENT CONTROL'}</span>
                <strong style={{ color: '#ff8c00' }}>{lang === 'fr' ? 'JOUEUR 2 LOCAL' : 'LOCAL PLAYER 2'}</strong>
              </>
            ) : (
              <>
                <span className="fighter-section-label">{lang === 'fr' ? 'PRESSION IA' : 'AI PRESSURE'}</span>
                <div className="fighter-difficulty-control" role="group" aria-label={lang === 'fr' ? 'Difficulte du duel' : 'Fight difficulty'}>
                  {DIFFICULTIES.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      className={configuredDifficulty === option.id ? 'active' : ''}
                      onClick={() => { setDifficulty(option.id); sound.playSfx('click'); }}
                      title={option.desc[lang]}
                    >
                      {option.label[lang]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="fighter-preflight-actions">
            {!customConfig?.opponentTeamIds?.length && opponentControl === 'cpu' && (
              <button type="button" className="btn-retro" onClick={rerollOpponents} title={lang === 'fr' ? 'Genere une nouvelle cellule adverse parmi les univers actifs.' : 'Generate another opponent cell from active universes.'}>
                {lang === 'fr' ? 'AUTRES ADVERSAIRES' : 'NEW OPPONENTS'}
              </button>
            )}
            <button type="button" className="btn-retro fighter-launch-button" onClick={startMatch} disabled={!playerHeroes.length || !opponentHeroes.length}>
              {lang === 'fr' ? 'OUVRIR L ARENE' : 'OPEN THE ARENA'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`fighter-mode-shell fighter-mode-active ${activeHudTheme ? 'game-hud-themed-interface' : ''}`} aria-labelledby="fighter-mode-title">
      <GameHudThemeLayer theme={activeHudTheme} mode="combat" />
      <header className="fighter-battle-header">
        <div>
          <span>ARENE D IMPACT A.R.C.A. / {arenaUniverse}</span>
          <strong>{arenaLevelProfile?.combat?.name || (lang === 'fr' ? 'Duel de convergence' : 'Convergence Duel')}</strong>
        </div>
        <div>
          <b>{snapshot.phase === 'countdown' ? snapshot.countdown : snapshot.timer}s</b>
          <small>
            {opponentControl === 'p2'
              ? (lang === 'fr' ? 'P2 LOCAL' : 'LOCAL P2')
              : snapshot.phase === 'countdown'
                ? (lang === 'fr' ? 'ANCRAGE' : 'SYNC')
              : snapshot.phase === 'running'
                ? (lang === 'fr' ? 'DUEL ACTIF' : 'LIVE FIGHT')
                : snapshot.phase.toUpperCase()}
          </small>
        </div>
        {!dedicatedSession && (
          <button type="button" className="btn-retro" onClick={returnToLobby}>
            {isCustomBattle
              ? (lang === 'fr' ? 'RETOUR CONFIGURATION' : 'BACK TO SETUP')
              : (lang === 'fr' ? 'QUITTER' : 'LEAVE')}
          </button>
        )}
      </header>

      <div className="fighter-battle-grid">
        <div className="fighter-canvas-panel">
          <canvas
            ref={canvasRef}
            width="960"
            height="540"
            className="fighter-mode-canvas"
            aria-label={lang === 'fr' ? 'Arene de combat A.R.C.A. jouable' : 'Playable A.R.C.A. fighting arena'}
            data-fighter-phase={snapshot.phase}
            data-fighter-timer={snapshot.timer}
            data-player-active={playerSnapshot.activeIndex}
            data-opponent-active={cpuSnapshot.activeIndex}
          />
          <p className="gameplay-live-status" role="status" aria-live="polite">
            {lang === 'fr'
              ? `Duel ${snapshot.phase}. ${snapshot.timer} secondes. ${playerSnapshot.fighters.filter(fighter => !fighter.ko).length} signatures joueur et ${cpuSnapshot.fighters.filter(fighter => !fighter.ko).length} signatures adverses encore actives.`
              : `Fight ${snapshot.phase}. ${snapshot.timer} seconds. ${playerSnapshot.fighters.filter(fighter => !fighter.ko).length} player signatures and ${cpuSnapshot.fighters.filter(fighter => !fighter.ko).length} opponent signatures remain.`}
          </p>
          {summary && (
            <div
              className={`fighter-result-banner ${summary.result}`}
              data-victory-pose={summary.victoryPose?.style || 'standard'}
              style={{
                borderColor: summary.victoryPose?.color || undefined,
                boxShadow: summary.victoryPose
                  ? `inset 0 0 42px ${summary.victoryPose.color || '#39c5bb'}22`
                  : undefined
              }}
            >
              <div>
                <strong>
                  {summary.result === 'victory'
                    ? (opponentControl === 'p2'
                        ? (lang === 'fr' ? 'VICTOIRE JOUEUR 1' : 'PLAYER 1 VICTORY')
                        : (lang === 'fr' ? 'VICTOIRE DE CELLULE' : 'CELL VICTORY'))
                    : opponentControl === 'p2'
                      ? (lang === 'fr' ? 'VICTOIRE JOUEUR 2' : 'PLAYER 2 VICTORY')
                      : (lang === 'fr' ? 'REPLI DE CELLULE' : 'CELL RETREAT')}
                </strong>
                <span>RANG {summary.grade} / {summary.score} PTS / COMBO {summary.maxCombo} / {summary.duration}s</span>
                {summary.victoryPose && (
                  <small style={{ display: 'block', marginTop: 5, color: summary.victoryPose.color || '#39c5bb' }}>
                    {getLocalizedName(summary.victoryPose, lang, lang === 'fr' ? 'Pose de victoire' : 'Victory pose')}
                  </small>
                )}
              </div>
              <div>
                {isCustomBattle
                  ? <span>{lang === 'fr' ? 'SIMULATION / AUCUN GAIN DE CAMPAGNE' : 'SIMULATION / NO CAMPAIGN REWARDS'}</span>
                  : summary.result === 'victory' && <span>+{summary.rewards.gold} OR / +{summary.rewards.shards} FRAGMENTS</span>}
                <button type="button" className="btn-retro" onClick={startMatch}>{lang === 'fr' ? 'REVANCHE' : 'REMATCH'}</button>
                <button type="button" className="btn-retro" onClick={returnToLobby}>
                  {isCustomBattle
                    ? (lang === 'fr' ? 'CONFIGURATION' : 'SETUP')
                    : (lang === 'fr' ? 'CELLULES' : 'CELLS')}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="fighter-side-panel">
          <section>
            <div className="fighter-side-heading">
              <span>{lang === 'fr' ? 'REMPLACANTS' : 'TAG ROSTER'}</span>
              <b>{playerSnapshot.tagCooldown > 0 ? `${playerSnapshot.tagCooldown.toFixed(1)}s` : 'READY'}</b>
            </div>
            <Lineup lang={lang} heroes={playerHeroes} side="player" snapshot={playerSnapshot} onTag={index => triggerTag(index)} />
          </section>
          <section>
            <div className="fighter-side-heading">
              <span>{lang === 'fr' ? 'CELLULE ADVERSE' : 'OPPONENT CELL'}</span>
              <b>{cpuSnapshot.fighters.filter(fighter => !fighter.ko).length}/{cpuSnapshot.fighters.length}</b>
            </div>
            <Lineup
              lang={lang}
              heroes={opponentHeroes}
              side="cpu"
              snapshot={cpuSnapshot}
              interactive={opponentControl === 'p2'}
              onTag={index => triggerTag(index, 'cpu')}
            />
          </section>
          <section>
            <div className="fighter-side-heading">
              <span>{lang === 'fr' ? 'SUPER TERRAIN J1 / T' : 'P1 FIELD SUPER / T'}</span>
              <b>
                {!activeFieldSuper
                  ? (lang === 'fr' ? 'VIDE' : 'EMPTY')
                  : playerFieldState.used
                    ? (lang === 'fr' ? 'UTILISE' : 'USED')
                    : `${Math.floor(fieldSuperCharge)}%`}
              </b>
            </div>
            <strong style={{ display: 'block', margin: '8px 0 6px', color: activeFieldSuper?.color || '#8fa8ad', fontSize: 10 }}>
              {activeFieldSuper
                ? getLocalizedName(activeFieldSuper, lang, activeFieldSuper.universe)
                : (lang === 'fr' ? 'Aucun super equipe' : 'No field super equipped')}
            </strong>
            <div
              role="progressbar"
              aria-label={lang === 'fr' ? 'Charge du super de terrain' : 'Field super charge'}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.floor(fieldSuperCharge)}
              style={{ height: 7, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.1)' }}
            >
              <i
                style={{
                  width: `${fieldSuperCharge}%`,
                  height: '100%',
                  display: 'block',
                  background: activeFieldSuper?.color || '#8fa8ad',
                  boxShadow: fieldSuperReady ? `0 0 12px ${activeFieldSuper?.color || '#ffea00'}` : 'none'
                }}
              />
            </div>
            <button
              type="button"
              className="btn-retro"
              disabled={!fieldSuperReady}
              onClick={() => triggerFieldSuper('player')}
              style={{ width: '100%', marginTop: 8 }}
            >
              {lang === 'fr' ? 'DECLENCHER LE TERRAIN [T]' : 'TRIGGER FIELD [T]'}
            </button>
          </section>
          {opponentControl === 'p2' && (
            <section>
              <div className="fighter-side-heading">
                <span>{lang === 'fr' ? 'SUPER TERRAIN J2 / I' : 'P2 FIELD SUPER / I'}</span>
                <b>
                  {!activeFieldSuper
                    ? (lang === 'fr' ? 'VIDE' : 'EMPTY')
                    : opponentFieldState.used
                      ? (lang === 'fr' ? 'UTILISE' : 'USED')
                      : `${Math.floor(opponentFieldSuperCharge)}%`}
                </b>
              </div>
              <strong style={{ display: 'block', margin: '8px 0 6px', color: activeFieldSuper?.color || '#8fa8ad', fontSize: 10 }}>
                {activeFieldSuper
                  ? getLocalizedName(activeFieldSuper, lang, activeFieldSuper.universe)
                  : (lang === 'fr' ? 'Aucun super equipe' : 'No field super equipped')}
              </strong>
              <div
                role="progressbar"
                aria-label={lang === 'fr' ? 'Charge du super de terrain joueur 2' : 'Player 2 field super charge'}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.floor(opponentFieldSuperCharge)}
                style={{ height: 7, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <i
                  style={{
                    width: `${opponentFieldSuperCharge}%`,
                    height: '100%',
                    display: 'block',
                    background: activeFieldSuper?.color || '#8fa8ad',
                    boxShadow: opponentFieldSuperReady ? `0 0 12px ${activeFieldSuper?.color || '#ffea00'}` : 'none'
                  }}
                />
              </div>
              <button
                type="button"
                className="btn-retro"
                disabled={!opponentFieldSuperReady}
                onClick={() => triggerFieldSuper('cpu')}
                style={{ width: '100%', marginTop: 8 }}
              >
                {lang === 'fr' ? 'DECLENCHER LE TERRAIN [I]' : 'TRIGGER FIELD [I]'}
              </button>
            </section>
          )}
          {playerAssist && (
            <FighterAssistPanel
              lang={lang}
              playerLabel={lang === 'fr' ? 'ASSIST J1' : 'P1 ASSIST'}
              keyLabel="Y"
              assist={playerAssist}
              state={playerAssistState}
              ready={playerAssistReady}
              onTrigger={() => triggerAssist('player')}
            />
          )}
          {opponentControl === 'p2' && opponentAssist && (
            <FighterAssistPanel
              lang={lang}
              playerLabel={lang === 'fr' ? 'ASSIST J2' : 'P2 ASSIST'}
              keyLabel="K"
              assist={opponentAssist}
              state={opponentAssistState}
              ready={opponentAssistReady}
              onTrigger={() => triggerAssist('cpu')}
            />
          )}
          <section className="fighter-control-list">
            <span>{opponentControl === 'p2' ? (lang === 'fr' ? 'COMMANDES J1' : 'P1 CONTROLS') : (lang === 'fr' ? 'COMMANDES' : 'CONTROLS')}</span>
            <div><b>ZQSD</b><small>{lang === 'fr' ? 'Mouvement' : 'Move'}</small></div>
            <div><b>E</b><small>{lang === 'fr' ? 'Garde' : 'Guard'}</small></div>
            <div><b>F / G</b><small>{lang === 'fr' ? 'Leger / lourd' : 'Light / heavy'}</small></div>
            <div><b>H / R</b><small>{lang === 'fr' ? 'Special / rupture' : 'Special / rupture'}</small></div>
            <div><b>T</b><small>{lang === 'fr' ? 'Super de terrain' : 'Field super'}</small></div>
            {playerAssist && <div><b>Y</b><small>{lang === 'fr' ? 'Assist PNJ' : 'NPC assist'}</small></div>}
            <div><b>1 / 2 / 3</b><small>Tag</small></div>
          </section>
          {opponentControl === 'p2' && (
            <section className="fighter-control-list">
              <span>{lang === 'fr' ? 'COMMANDES J2' : 'P2 CONTROLS'}</span>
              <div><b>FLECHES</b><small>{lang === 'fr' ? 'Mouvement' : 'Move'}</small></div>
              <div><b>U</b><small>{lang === 'fr' ? 'Garde' : 'Guard'}</small></div>
              <div><b>P / M</b><small>{lang === 'fr' ? 'Leger / lourd' : 'Light / heavy'}</small></div>
              <div><b>L / O</b><small>{lang === 'fr' ? 'Special / rupture' : 'Special / rupture'}</small></div>
              <div><b>I</b><small>{lang === 'fr' ? 'Super de terrain' : 'Field super'}</small></div>
              {opponentAssist && <div><b>K</b><small>{lang === 'fr' ? 'Assist PNJ' : 'NPC assist'}</small></div>}
              <div><b>7 / 8 / 9</b><small>Tag</small></div>
            </section>
          )}
        </aside>
      </div>

      <div
        className="fighter-touch-controls"
        data-opponent-control={opponentControl}
        aria-label={lang === 'fr' ? 'Commandes tactiles de combat' : 'Touch fighting controls'}
      >
        <div
          aria-label={lang === 'fr' ? 'Mouvements tactiles J1' : 'P1 touch movement'}
          style={{ gridTemplateColumns: 'repeat(5, minmax(44px, 1fr))' }}
        >
          <span style={{ gridColumn: '1 / -1', color: '#39c5bb', fontSize: 9 }}>J1 / P1</span>
          <button type="button" title={lang === 'fr' ? 'Gauche' : 'Left'} onPointerDown={() => setHeldInput('left', true)} onPointerUp={() => setHeldInput('left', false)} onPointerCancel={() => setHeldInput('left', false)} onPointerLeave={() => setHeldInput('left', false)}>&larr;</button>
          <button type="button" title={lang === 'fr' ? 'Accroupi' : 'Crouch'} onPointerDown={() => setHeldInput('down', true)} onPointerUp={() => setHeldInput('down', false)} onPointerCancel={() => setHeldInput('down', false)} onPointerLeave={() => setHeldInput('down', false)}>&darr;</button>
          <button type="button" title={lang === 'fr' ? 'Saut' : 'Jump'} onClick={() => triggerAction('jump')}>&uarr;</button>
          <button type="button" title={lang === 'fr' ? 'Droite' : 'Right'} onPointerDown={() => setHeldInput('right', true)} onPointerUp={() => setHeldInput('right', false)} onPointerCancel={() => setHeldInput('right', false)} onPointerLeave={() => setHeldInput('right', false)}>&rarr;</button>
          <button type="button" title={lang === 'fr' ? 'Garde [E]' : 'Guard [E]'} onPointerDown={() => setHeldInput('guard', true)} onPointerUp={() => setHeldInput('guard', false)} onPointerCancel={() => setHeldInput('guard', false)} onPointerLeave={() => setHeldInput('guard', false)}>E</button>
        </div>
        <div aria-label={lang === 'fr' ? 'Actions tactiles J1' : 'P1 touch actions'}>
          <span style={{ gridColumn: '1 / -1', color: '#39c5bb', fontSize: 9 }}>
            {lang === 'fr' ? 'ACTIONS J1' : 'P1 ACTIONS'}
          </span>
          <button type="button" title={lang === 'fr' ? 'Attaque legere [F]' : 'Light attack [F]'} onClick={() => triggerAction('light')}>F</button>
          <button type="button" title={lang === 'fr' ? 'Attaque lourde [G]' : 'Heavy attack [G]'} onClick={() => triggerAction('heavy')}>G</button>
          <button type="button" title={lang === 'fr' ? 'Special [H]' : 'Special [H]'} onClick={() => triggerAction('special')}>H</button>
          <button type="button" title={lang === 'fr' ? 'Rupture [R]' : 'Rupture [R]'} onClick={() => triggerAction('super')}>R</button>
          <button type="button" title={lang === 'fr' ? 'Super de terrain [T]' : 'Field super [T]'} disabled={!fieldSuperReady} onClick={() => triggerFieldSuper('player')}>T</button>
          {playerAssist && <button type="button" title={lang === 'fr' ? 'Assist PNJ [Y]' : 'NPC assist [Y]'} disabled={!playerAssistReady} onClick={() => triggerAssist('player')}>Y</button>}
        </div>
        {opponentControl === 'p2' && (
          <>
            <div
              aria-label={lang === 'fr' ? 'Mouvements tactiles J2' : 'P2 touch movement'}
              style={{ gridTemplateColumns: 'repeat(5, minmax(44px, 1fr))' }}
            >
              <span style={{ gridColumn: '1 / -1', color: '#ff8c50', fontSize: 9 }}>J2 / P2</span>
              <button type="button" title={lang === 'fr' ? 'J2 gauche' : 'P2 left'} onPointerDown={() => setHeldInput('left', true, 'cpu')} onPointerUp={() => setHeldInput('left', false, 'cpu')} onPointerCancel={() => setHeldInput('left', false, 'cpu')} onPointerLeave={() => setHeldInput('left', false, 'cpu')}>&larr;</button>
              <button type="button" title={lang === 'fr' ? 'J2 accroupi' : 'P2 crouch'} onPointerDown={() => setHeldInput('down', true, 'cpu')} onPointerUp={() => setHeldInput('down', false, 'cpu')} onPointerCancel={() => setHeldInput('down', false, 'cpu')} onPointerLeave={() => setHeldInput('down', false, 'cpu')}>&darr;</button>
              <button type="button" title={lang === 'fr' ? 'J2 saut' : 'P2 jump'} onClick={() => triggerAction('jump', 'cpu')}>&uarr;</button>
              <button type="button" title={lang === 'fr' ? 'J2 droite' : 'P2 right'} onPointerDown={() => setHeldInput('right', true, 'cpu')} onPointerUp={() => setHeldInput('right', false, 'cpu')} onPointerCancel={() => setHeldInput('right', false, 'cpu')} onPointerLeave={() => setHeldInput('right', false, 'cpu')}>&rarr;</button>
              <button type="button" title={lang === 'fr' ? 'Garde J2 [U]' : 'P2 guard [U]'} onPointerDown={() => setHeldInput('guard', true, 'cpu')} onPointerUp={() => setHeldInput('guard', false, 'cpu')} onPointerCancel={() => setHeldInput('guard', false, 'cpu')} onPointerLeave={() => setHeldInput('guard', false, 'cpu')}>U</button>
            </div>
            <div aria-label={lang === 'fr' ? 'Actions tactiles J2' : 'P2 touch actions'}>
              <span style={{ gridColumn: '1 / -1', color: '#ff8c50', fontSize: 9 }}>
                {lang === 'fr' ? 'ACTIONS J2' : 'P2 ACTIONS'}
              </span>
              <button type="button" title={lang === 'fr' ? 'Attaque legere J2 [P]' : 'P2 light attack [P]'} onClick={() => triggerAction('light', 'cpu')}>P</button>
              <button type="button" title={lang === 'fr' ? 'Attaque lourde J2 [M]' : 'P2 heavy attack [M]'} onClick={() => triggerAction('heavy', 'cpu')}>M</button>
              <button type="button" title={lang === 'fr' ? 'Special J2 [L]' : 'P2 special [L]'} onClick={() => triggerAction('special', 'cpu')}>L</button>
              <button type="button" title={lang === 'fr' ? 'Rupture J2 [O]' : 'P2 rupture [O]'} onClick={() => triggerAction('super', 'cpu')}>O</button>
              <button type="button" title={lang === 'fr' ? 'Super de terrain J2 [I]' : 'P2 field super [I]'} disabled={!opponentFieldSuperReady} onClick={() => triggerFieldSuper('cpu')}>I</button>
              {opponentAssist && <button type="button" title={lang === 'fr' ? 'Assist PNJ J2 [K]' : 'P2 NPC assist [K]'} disabled={!opponentAssistReady} onClick={() => triggerAssist('cpu')}>K</button>}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
