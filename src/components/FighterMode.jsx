import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EngineFighter } from '../game/engineFighter';
import { ParticleSystem, drawUniverseBackground, preloadSpriteSheetSrcs } from '../game/renderer';
import { getRecentUniverseLevelProfile } from '../game/recentUniverseLevels';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout } from '../game/spriteAssets';
import { getUnlockableById } from '../game/universeUnlockables';
import sound from '../game/soundEngine';

const CONTROL_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'q', 'Q', 'd', 'D', 'a', 'A', 'w', 'W', 'z', 'Z', 's', 'S',
  'j', 'J', 'k', 'K', 'l', 'L', 'i', 'I', 'u', 'U', 'o', 'O',
  '1', '2', '3', ' ', 'Shift'
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

function Lineup({ lang, heroes, side, snapshot, onTag }) {
  const stateById = snapshot?.fighters || [];
  return (
    <div className={`fighter-lineup fighter-lineup-${side}`}>
      {heroes.map((hero, index) => {
        const state = stateById[index];
        const hpPct = state ? Math.max(0, Math.min(100, (state.currentHp / state.maxHp) * 100)) : 100;
        const isPlayer = side === 'player';
        return (
          <button
            key={`${side}-${hero.id}-${index}`}
            type="button"
            className={`${state?.active ? 'active' : ''} ${state?.ko ? 'ko' : ''}`}
            disabled={!isPlayer || !state || state.ko || state.active || snapshot.tagCooldown > 0}
            onClick={() => onTag?.(index)}
            title={isPlayer
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
  onMatchComplete
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const inputRef = useRef({});
  const onMatchCompleteRef = useRef(onMatchComplete);
  const [difficulty, setDifficulty] = useState('standard');
  const [opponentSeed, setOpponentSeed] = useState(1);
  const [matchNonce, setMatchNonce] = useState(0);
  const [matchStarted, setMatchStarted] = useState(false);
  const [summary, setSummary] = useState(null);
  const [snapshot, setSnapshot] = useState(emptySnapshot);

  useEffect(() => {
    onMatchCompleteRef.current = onMatchComplete;
  }, [onMatchComplete]);

  const hiddenSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const ownedArchives = useMemo(() => (
    (Array.isArray(portalCollection.archives) ? portalCollection.archives : [])
      .filter(archive => archive?.id && !hiddenSet.has(archive.universe))
  ), [hiddenSet, portalCollection.archives]);
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
  const activeArchive = useMemo(
    () => ownedArchives.find(archive => archive.id === customLoadout.archive) || null,
    [customLoadout.archive, ownedArchives]
  );
  const activeBattleMusic = useMemo(
    () => ownedBattleMusic.find(track => track.id === customLoadout.battleMusic) || null,
    [customLoadout.battleMusic, ownedBattleMusic]
  );
  const activeStageMusic = useMemo(
    () => ownedStageMusic.find(track => track.id === customLoadout.stageMusic) || null,
    [customLoadout.stageMusic, ownedStageMusic]
  );
  const activeFieldSuper = useMemo(
    () => ownedFieldSupers.find(fieldSuper => fieldSuper.id === customLoadout.fieldSuper) || null,
    [customLoadout.fieldSuper, ownedFieldSupers]
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
    const selected = activeTeam
      .map(id => heroes.find(hero => hero.id === id))
      .filter(hero => hero && (hero.id === 'player_anchor' || unlockedSet.has(hero.id)))
      .slice(0, 3);
    const fallback = heroes.find(hero => unlockedSet.has(hero.id)) || heroes[0];
    return (selected.length ? selected : [fallback].filter(Boolean))
      .map(hero => scaleHeroForFight(hero, heroLevels[hero.id] || 1));
  }, [activeTeam, heroLevels, heroes, unlockedSet]);

  const averageLevel = useMemo(() => Math.max(1, Math.round(
    playerHeroes.reduce((total, hero) => total + (hero.fighterLevel || 1), 0) / Math.max(1, playerHeroes.length)
  )), [playerHeroes]);

  const opponentHeroes = useMemo(() => {
    const selectedIds = new Set(playerHeroes.map(hero => hero.id));
    let pool = heroes.filter(hero => !selectedIds.has(hero.id));
    if (pool.length < playerHeroes.length) pool = heroes;
    const sorted = [...pool].sort((left, right) => {
      const leftScore = hashValue(`${opponentSeed}-${left.id}`);
      const rightScore = hashValue(`${opponentSeed}-${right.id}`);
      return leftScore - rightScore;
    });
    return sorted.slice(0, Math.max(1, playerHeroes.length)).map(hero => scaleHeroForFight(hero, averageLevel));
  }, [averageLevel, heroes, opponentSeed, playerHeroes]);

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
    inputRef.current = {};
    setSummary(null);
    setSnapshot(emptySnapshot);
    preloadSpriteSheetSrcs([
      ...playerHeroes.map(hero => getHeroSpriteSheetSrc(hero, 'melee')),
      ...opponentHeroes.map(hero => getHeroSpriteSheetSrc(hero, 'melee'))
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
        const resolved = { ...report, result };
        setSummary(resolved);
        setSnapshot(engine.getSnapshot());
        sound.setStageMusicState(result, { ...battleMusicStage, result });
        onMatchCompleteRef.current?.(resolved);
      },
      {
        difficulty,
        universe: arenaUniverse,
        levelProfile: arenaLevelProfile,
        fieldSuper: activeFieldSuper
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
      engine.setInput(inputRef.current);
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
      inputRef.current = {};
    };
    const onKeyDown = event => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      const key = event.key.toLowerCase();
      if (['arrowleft', 'q', 'a'].includes(key)) inputRef.current.left = true;
      else if (['arrowright', 'd'].includes(key)) inputRef.current.right = true;
      else if (['arrowdown', 's'].includes(key)) inputRef.current.down = true;
      else if (key === 'shift' || key === 'i') inputRef.current.guard = true;
      if (event.repeat) return;
      if (['arrowup', 'w', 'z', ' '].includes(key)) engine.triggerPlayerAction('jump');
      else if (key === 'j') engine.triggerPlayerAction('light');
      else if (key === 'k') engine.triggerPlayerAction('heavy');
      else if (key === 'l') engine.triggerPlayerAction('special');
      else if (key === 'u') engine.triggerPlayerAction('super');
      else if (key === 'o') engine.triggerFieldSuper();
      else if (['1', '2', '3'].includes(key)) engine.triggerPlayerAction('tag', Number(key) - 1);
    };
    const onKeyUp = event => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      const key = event.key.toLowerCase();
      if (['arrowleft', 'q', 'a'].includes(key)) inputRef.current.left = false;
      else if (['arrowright', 'd'].includes(key)) inputRef.current.right = false;
      else if (['arrowdown', 's'].includes(key)) inputRef.current.down = false;
      else if (key === 'shift' || key === 'i') inputRef.current.guard = false;
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
      inputRef.current = {};
    };
  }, [
    activeBattleMusic,
    activeFieldSuper,
    arenaLevelProfile,
    arenaUniverse,
    battleMusicStage,
    difficulty,
    matchNonce,
    matchStarted,
    opponentHeroes,
    playerHeroes
  ]);

  const startMatch = () => {
    if (!playerHeroes.length || !opponentHeroes.length) return;
    setSummary(null);
    setSnapshot(emptySnapshot);
    setMatchNonce(value => value + 1);
    setMatchStarted(true);
    sound.playSfx('special');
  };

  const returnToLobby = () => {
    setMatchStarted(false);
    setSummary(null);
    setSnapshot(emptySnapshot);
    inputRef.current = {};
    sound.playSfx('click');
  };

  const rerollOpponents = () => {
    setOpponentSeed(value => value + 1);
    sound.playSfx('coin');
  };

  const triggerAction = action => {
    engineRef.current?.triggerPlayerAction(action);
  };

  const triggerFieldSuper = () => {
    engineRef.current?.triggerFieldSuper();
  };

  const setHeldInput = (key, active) => {
    inputRef.current[key] = active;
  };

  const playerSnapshot = snapshot.player || emptySnapshot.player;
  const cpuSnapshot = snapshot.cpu || emptySnapshot.cpu;
  const fieldSuperCharge = Math.max(0, Math.min(100, Number(snapshot.fieldSuperCharge) || 0));
  const fieldSuperReady = Boolean(
    activeFieldSuper
    && !snapshot.fieldSuperUsed
    && fieldSuperCharge >= 100
    && snapshot.phase === 'running'
  );

  if (!matchStarted) {
    return (
      <section className="fighter-mode-shell" aria-labelledby="fighter-mode-title">
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
            <span className="fighter-section-label">{lang === 'fr' ? 'CELLULE ECHO' : 'ECHO CELL'}</span>
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
            <span className="fighter-section-label">{lang === 'fr' ? 'PRESSION IA' : 'AI PRESSURE'}</span>
            <div className="fighter-difficulty-control" role="group" aria-label={lang === 'fr' ? 'Difficulte du duel' : 'Fight difficulty'}>
              {DIFFICULTIES.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={difficulty === option.id ? 'active' : ''}
                  onClick={() => { setDifficulty(option.id); sound.playSfx('click'); }}
                  title={option.desc[lang]}
                >
                  {option.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="fighter-preflight-actions">
            <button type="button" className="btn-retro" onClick={rerollOpponents} title={lang === 'fr' ? 'Genere une nouvelle cellule adverse parmi les univers actifs.' : 'Generate another opponent cell from active universes.'}>
              {lang === 'fr' ? 'AUTRES ADVERSAIRES' : 'NEW OPPONENTS'}
            </button>
            <button type="button" className="btn-retro fighter-launch-button" onClick={startMatch} disabled={!playerHeroes.length || !opponentHeroes.length}>
              {lang === 'fr' ? 'OUVRIR L ARENE' : 'OPEN THE ARENA'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fighter-mode-shell fighter-mode-active" aria-labelledby="fighter-mode-title">
      <header className="fighter-battle-header">
        <div>
          <span>ARENE D IMPACT A.R.C.A. / {arenaUniverse}</span>
          <strong>{arenaLevelProfile?.combat?.name || (lang === 'fr' ? 'Duel de convergence' : 'Convergence Duel')}</strong>
        </div>
        <div>
          <b>{snapshot.timer}s</b>
          <small>{snapshot.phase === 'running' ? (lang === 'fr' ? 'DUEL ACTIF' : 'LIVE FIGHT') : snapshot.phase.toUpperCase()}</small>
        </div>
        <button type="button" className="btn-retro" onClick={returnToLobby}>{lang === 'fr' ? 'QUITTER' : 'LEAVE'}</button>
      </header>

      <div className="fighter-battle-grid">
        <div className="fighter-canvas-panel">
          <canvas
            ref={canvasRef}
            width="960"
            height="540"
            className="fighter-mode-canvas"
            aria-label={lang === 'fr' ? 'Arene de combat A.R.C.A. jouable' : 'Playable A.R.C.A. fighting arena'}
          />
          {summary && (
            <div className={`fighter-result-banner ${summary.result}`}>
              <div>
                <strong>{summary.result === 'victory' ? (lang === 'fr' ? 'VICTOIRE DE CELLULE' : 'CELL VICTORY') : (lang === 'fr' ? 'REPLI DE CELLULE' : 'CELL RETREAT')}</strong>
                <span>RANG {summary.grade} / {summary.score} PTS / COMBO {summary.maxCombo}</span>
              </div>
              <div>
                {summary.result === 'victory' && <span>+{summary.rewards.gold} OR / +{summary.rewards.shards} FRAGMENTS</span>}
                <button type="button" className="btn-retro" onClick={startMatch}>{lang === 'fr' ? 'REVANCHE' : 'REMATCH'}</button>
                <button type="button" className="btn-retro" onClick={returnToLobby}>{lang === 'fr' ? 'CELLULES' : 'CELLS'}</button>
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
            <Lineup lang={lang} heroes={playerHeroes} side="player" snapshot={playerSnapshot} onTag={index => engineRef.current?.triggerPlayerAction('tag', index)} />
          </section>
          <section>
            <div className="fighter-side-heading">
              <span>{lang === 'fr' ? 'CELLULE ADVERSE' : 'OPPONENT CELL'}</span>
              <b>{cpuSnapshot.fighters.filter(fighter => !fighter.ko).length}/{cpuSnapshot.fighters.length}</b>
            </div>
            <Lineup lang={lang} heroes={opponentHeroes} side="cpu" snapshot={cpuSnapshot} />
          </section>
          <section>
            <div className="fighter-side-heading">
              <span>{lang === 'fr' ? 'SUPER DE TERRAIN / O' : 'FIELD SUPER / O'}</span>
              <b>
                {!activeFieldSuper
                  ? (lang === 'fr' ? 'VIDE' : 'EMPTY')
                  : snapshot.fieldSuperUsed
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
              onClick={triggerFieldSuper}
              style={{ width: '100%', marginTop: 8 }}
            >
              {lang === 'fr' ? 'DECLENCHER LE TERRAIN [O]' : 'TRIGGER FIELD [O]'}
            </button>
          </section>
          <section className="fighter-control-list">
            <span>{lang === 'fr' ? 'COMMANDES' : 'CONTROLS'}</span>
            <div><b>Q/D</b><small>{lang === 'fr' ? 'Deplacement' : 'Move'}</small></div>
            <div><b>Z / UP</b><small>{lang === 'fr' ? 'Saut' : 'Jump'}</small></div>
            <div><b>S / DOWN</b><small>{lang === 'fr' ? 'Accroupi' : 'Crouch'}</small></div>
            <div><b>J / K</b><small>{lang === 'fr' ? 'Leger / lourd' : 'Light / heavy'}</small></div>
            <div><b>L / U</b><small>{lang === 'fr' ? 'Special / rupture' : 'Special / rupture'}</small></div>
            <div><b>O</b><small>{lang === 'fr' ? 'Super de terrain' : 'Field super'}</small></div>
            <div><b>I / SHIFT</b><small>{lang === 'fr' ? 'Garde' : 'Guard'}</small></div>
            <div><b>1 / 2 / 3</b><small>Tag</small></div>
          </section>
        </aside>
      </div>

      <div className="fighter-touch-controls" aria-label={lang === 'fr' ? 'Commandes tactiles de combat' : 'Touch fighting controls'}>
        <div>
          <button type="button" title={lang === 'fr' ? 'Gauche' : 'Left'} onPointerDown={() => setHeldInput('left', true)} onPointerUp={() => setHeldInput('left', false)} onPointerCancel={() => setHeldInput('left', false)} onPointerLeave={() => setHeldInput('left', false)}>&larr;</button>
          <button type="button" title={lang === 'fr' ? 'Accroupi' : 'Crouch'} onPointerDown={() => setHeldInput('down', true)} onPointerUp={() => setHeldInput('down', false)} onPointerCancel={() => setHeldInput('down', false)} onPointerLeave={() => setHeldInput('down', false)}>&darr;</button>
          <button type="button" title={lang === 'fr' ? 'Saut' : 'Jump'} onClick={() => triggerAction('jump')}>&uarr;</button>
          <button type="button" title={lang === 'fr' ? 'Droite' : 'Right'} onPointerDown={() => setHeldInput('right', true)} onPointerUp={() => setHeldInput('right', false)} onPointerCancel={() => setHeldInput('right', false)} onPointerLeave={() => setHeldInput('right', false)}>&rarr;</button>
          <button type="button" title={lang === 'fr' ? 'Garde' : 'Guard'} onPointerDown={() => setHeldInput('guard', true)} onPointerUp={() => setHeldInput('guard', false)} onPointerCancel={() => setHeldInput('guard', false)} onPointerLeave={() => setHeldInput('guard', false)}>G</button>
        </div>
        <div>
          <button type="button" onClick={() => triggerAction('light')}>J</button>
          <button type="button" onClick={() => triggerAction('heavy')}>K</button>
          <button type="button" onClick={() => triggerAction('special')}>L</button>
          <button type="button" onClick={() => triggerAction('super')}>U</button>
          <button type="button" disabled={!fieldSuperReady} onClick={triggerFieldSuper}>O</button>
        </div>
      </div>
    </section>
  );
}
