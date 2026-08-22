import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EngineRace, KART_GARAGE_UPGRADES, RACE_ASSETS, RACE_TRACKS } from '../game/engineRace';
import { applyRaceResult, normalizeKartCareer } from '../game/kartCareer';
import sound from '../game/soundEngine';
import { getUnlockableById } from '../game/universeUnlockables';
import { resolveActiveHudTheme } from '../game/cosmeticVisualAssets';
import GameHudThemeLayer from './GameHudThemeLayer';

const CONTROL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'z',
  'q',
  'a',
  's',
  'd',
  'W',
  'Z',
  'Q',
  'A',
  'S',
  'D',
  ' ',
  'Shift',
  'e',
  'E',
  'r',
  'R'
]);

const normalizeKey = (key) => {
  if (key === 'ArrowUp') return 'up';
  if (key === 'ArrowDown') return 'down';
  if (key === 'ArrowLeft') return 'left';
  if (key === 'ArrowRight') return 'right';
  if (key === ' ') return 'space';
  if (key === 'Shift') return 'shift';
  if (key.toLowerCase() === 'z') return 'up';
  if (key.toLowerCase() === 'q') return 'left';
  return key.toLowerCase();
};

const formatRaceTime = seconds => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safe / 60);
  const remaining = safe - minutes * 60;
  return `${minutes}:${remaining.toFixed(2).padStart(5, '0')}`;
};

export default function RaceMode({
  lang = 'fr',
  playerProfile,
  portalCollection = {},
  setPortalCollection,
  hiddenUniverses = [],
  onSessionStart,
  onSessionEnd,
  sessionPaused = false,
  sessionExitRequest = 0,
  dedicatedSession = false
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const keysRef = useRef({});
  const keyPulseRef = useRef({});
  const autoAccelerateRef = useRef(true);
  const raceMusicStateRef = useRef('grid');
  const onSessionEndRef = useRef(onSessionEnd);
  const sessionPausedRef = useRef(sessionPaused);
  const sessionExitRequestRef = useRef(sessionExitRequest);
  const [trackId, setTrackId] = useState(null);
  const [pilotId, setPilotId] = useState(null);
  const [raceStarted, setRaceStarted] = useState(false);
  const [summary, setSummary] = useState(null);
  const [autoAccelerate, setAutoAccelerate] = useState(true);
  const [snapshot, setSnapshot] = useState({
    rank: 1,
    lap: 1,
    speed: 0,
    item: null,
    time: 0,
    grade: null,
    objective: '',
    raceState: 'idle',
    trackFactor: 1
  });

  const career = useMemo(
    () => normalizeKartCareer(portalCollection.raceCareer),
    [portalCollection.raceCareer]
  );
  const garageUpgrades = useMemo(() => ({
    engine: career.upgrades.engine,
    grip: career.upgrades.grip,
    capacitor: career.upgrades.capacitor,
    stabilizer: career.upgrades.stabilizer
  }), [
    career.upgrades.engine,
    career.upgrades.grip,
    career.upgrades.capacitor,
    career.upgrades.stabilizer
  ]);
  const updateCareer = useCallback(updater => {
    setPortalCollection?.(previous => {
      const currentCareer = normalizeKartCareer(previous?.raceCareer);
      const nextCareer = typeof updater === 'function' ? updater(currentCareer) : updater;
      return {
        ...previous,
        raceCareer: normalizeKartCareer(nextCareer)
      };
    });
  }, [setPortalCollection]);

  const trackList = useMemo(() => Object.values(RACE_TRACKS).sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id)), []);
  const activeHudTheme = resolveActiveHudTheme(portalCollection);
  const hiddenUniverseSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const ownedKarts = useMemo(() => (
    (portalCollection.karts || [])
      .map(id => getUnlockableById('kart', id))
      .filter(kart => kart && !hiddenUniverseSet.has(kart.universe))
  ), [hiddenUniverseSet, portalCollection.karts]);
  const selectedKart = ownedKarts.find(kart => kart.id === portalCollection.activeKart) || null;
  const selectedKartName = selectedKart?.name?.[lang]
    || selectedKart?.name?.fr
    || (lang === 'fr' ? 'Chassis Suture Nexus' : 'Nexus Suture Chassis');
  const track = trackId ? RACE_TRACKS[trackId] : null;
  const raceMusicStage = useMemo(() => {
    if (!track) {
      return {
        id: 'race-grid-nexus',
        name: 'A.R.C.A. Kart Starting Grid',
        universe: 'Nexus de Convergence',
        mode: 'Race',
        tags: ['grid', 'loreArena']
      };
    }
    const bossArena = track.tags?.includes('bossArena');
    return {
      id: `race-${track.id}`,
      name: track.name?.fr || track.id,
      universe: track.universe || 'Nexus de Convergence',
      sourceUniverses: track.sourceUniverses,
      mode: 'Race',
      family: track.family,
      tags: [...(track.tags || []), 'loreArena'],
      isBoss: bossArena,
      bossName: bossArena ? 'A.R.C.A. Overload Core' : ''
    };
  }, [track]);
  const pilotName = playerProfile?.name?.trim() || (lang === 'fr' ? 'Ancre' : 'Anchor');
  const controlRows = useMemo(() => [
    { label: lang === 'fr' ? 'Accel.' : 'Accel.', value: 'Z/W ou fleche haut' },
    { label: lang === 'fr' ? 'Frein' : 'Brake', value: 'S ou fleche bas' },
    { label: lang === 'fr' ? 'Virage' : 'Steer', value: 'Q/D ou fleches' },
    { label: 'Drift', value: 'Espace' },
    { label: lang === 'fr' ? 'Objet' : 'Item', value: 'E' },
    { label: lang === 'fr' ? 'Reancrer' : 'Recover', value: 'R' }
  ], [lang]);

  useEffect(() => {
    autoAccelerateRef.current = autoAccelerate;
  }, [autoAccelerate]);

  useEffect(() => {
    onSessionEndRef.current = onSessionEnd;
  }, [onSessionEnd]);

  // La pause du shell dedie gele la course et vide les commandes maintenues.
  useEffect(() => {
    sessionPausedRef.current = sessionPaused;
    if (sessionPaused) {
      keysRef.current = {};
      keyPulseRef.current = {};
    }
  }, [sessionPaused]);

  // Le retour au hub n'est applique qu'apres confirmation dans le menu pause.
  useEffect(() => {
    if (sessionExitRequestRef.current === sessionExitRequest) return;
    sessionExitRequestRef.current = sessionExitRequest;
    keysRef.current = {};
    keyPulseRef.current = {};
    setRaceStarted(false);
    setSummary(null);
    onSessionEndRef.current?.({ reason: 'abandoned' });
  }, [sessionExitRequest]);

  useEffect(() => {
    if (raceStarted) return undefined;
    raceMusicStateRef.current = 'grid';
    sound.playStageBgm(raceMusicStage, 'grid');
    return () => sound.stopBgm();
  }, [raceMusicStage, raceStarted]);

  useEffect(() => {
    if (!raceStarted || !track) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const engine = new EngineRace(960, 540, raceSummary => {
      updateCareer(prev => applyRaceResult(prev, raceSummary));
      setSummary(raceSummary);
      setSnapshot(prev => ({ ...prev, grade: raceSummary.grade, rank: raceSummary.rank, time: raceSummary.time }));
      raceMusicStateRef.current = 'result';
      sound.setStageMusicState('result', {
        ...raceMusicStage,
        raceState: 'finished',
        rank: raceSummary.rank,
        result: raceSummary.rank === 1 ? 'victory' : 'complete'
      });
      onSessionEndRef.current?.({ reason: 'completed', report: raceSummary });
    }, trackId, garageUpgrades, selectedKart);
    engineRef.current = engine;
    raceMusicStateRef.current = 'grid';
    sound.playStageBgm(raceMusicStage, 'grid');
    let animationId = 0;
    let last = performance.now();
    let snapshotTimer = 0;

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (sessionPausedRef.current) {
        animationId = requestAnimationFrame(loop);
        return;
      }
      const pulseKeys = Object.fromEntries(
        Object.entries(keyPulseRef.current).filter(([, expiresAt]) => expiresAt > now).map(([key]) => [key, true])
      );
      if (keysRef.current.shift) {
        engine.player.boost = Math.max(engine.player.boost, 0.22);
        keysRef.current.shift = false;
      }
      const mergedInputs = { ...keysRef.current, ...pulseKeys };
      engine.setInput({
        ...mergedInputs,
        autoAccel: autoAccelerateRef.current,
        manualAccel: Boolean(mergedInputs.up || mergedInputs.w)
      });
      engine.update(dt);
      const ctx = canvas.getContext('2d');
      engine.draw(ctx);
      snapshotTimer += dt;
      if (snapshotTimer > 0.12) {
        snapshotTimer = 0;
        const telemetry = engine.getTelemetry();
        const displayedLap = Math.min(engine.player.lap + 1, engine.track.laps);
        const nextMusicState = telemetry.raceState === 'finished'
          ? 'result'
          : telemetry.raceState === 'running' && displayedLap >= engine.track.laps
            ? 'lastLap'
            : telemetry.raceState === 'running'
              ? 'race'
              : 'grid';
        if (raceMusicStateRef.current !== nextMusicState) {
          raceMusicStateRef.current = nextMusicState;
          sound.setStageMusicState(nextMusicState, {
            ...raceMusicStage,
            raceState: telemetry.raceState,
            lap: displayedLap,
            bossActive: nextMusicState === 'lastLap' && raceMusicStage.isBoss
          });
        }
        setSnapshot({
          rank: engine.player.rank,
          lap: displayedLap,
          speed: Math.round(Math.abs(engine.player.speed)),
          item: engine.player.item,
          time: engine.player.finishTime || engine.time,
          grade: engine.player.finished ? engine.getRaceSummary().grade : null,
          objective: engine.getObjectiveStatus(),
          raceState: telemetry.raceState,
          trackFactor: telemetry.trackFactor
        });
      }
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);

    const onKeyDown = (event) => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      if (sessionPausedRef.current) return;
      const key = normalizeKey(event.key);
      if (key === 'e') {
        engine.useItem();
        return;
      }
      if (key === 'r') {
        engine.recoverPlayer();
        return;
      }
      keysRef.current[key] = true;
    };
    const onKeyUp = (event) => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      keysRef.current[normalizeKey(event.key)] = false;
    };
    const clearInputs = () => {
      keysRef.current = {};
      keyPulseRef.current = {};
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
    };
  }, [garageUpgrades, raceMusicStage, raceStarted, selectedKart, track, trackId, updateCareer]);

  const resetRace = () => {
    if (sessionPausedRef.current) return;
    keysRef.current = {};
    if (summary) onSessionStart?.();
    setSummary(null);
    engineRef.current?.reset();
    raceMusicStateRef.current = 'grid';
    sound.playStageBgm(raceMusicStage, 'grid');
  };

  const selectTrack = (nextTrackId) => {
    if (sessionPausedRef.current) return;
    keysRef.current = {};
    setSummary(null);
    setTrackId(nextTrackId);
  };

  const selectKart = (kartId) => {
    if (sessionPausedRef.current) return;
    setPortalCollection?.(previous => ({
      ...previous,
      activeKart: kartId
    }));
    sound.playSfx('click');
  };

  const startRace = () => {
    if (sessionPausedRef.current || !pilotId || !trackId) return;
    onSessionStart?.();
    keysRef.current = {};
    keyPulseRef.current = {};
    setSummary(null);
    setSnapshot({ rank: 1, lap: 1, speed: 0, item: null, time: 0, grade: null, objective: '', raceState: 'countdown', trackFactor: 1 });
    setRaceStarted(true);
  };

  const returnToGrid = () => {
    if (sessionPausedRef.current) return;
    keysRef.current = {};
    keyPulseRef.current = {};
    setRaceStarted(false);
    setSummary(null);
  };

  const activateVirtualKey = (key, active) => {
    if (sessionPausedRef.current) {
      keysRef.current = {};
      keyPulseRef.current = {};
      return;
    }
    keysRef.current[key] = active;
    if (active) keyPulseRef.current[key] = performance.now() + 540;
  };

  const pulseVirtualKey = (key) => {
    if (sessionPausedRef.current) return;
    keyPulseRef.current[key] = performance.now() + 680;
  };

  const triggerItem = () => {
    if (sessionPausedRef.current) return;
    engineRef.current?.useItem();
  };

  const triggerBoost = () => {
    if (sessionPausedRef.current) return;
    if (engineRef.current) engineRef.current.player.boost = Math.max(engineRef.current.player.boost, 0.28);
  };

  const recoverPlayer = () => {
    if (sessionPausedRef.current) return;
    engineRef.current?.recoverPlayer();
  };

  const buyUpgrade = (upgradeId) => {
    if (sessionPausedRef.current) return;
    const config = KART_GARAGE_UPGRADES[upgradeId];
    if (!config) return;
    updateCareer(prev => {
      const currentLevel = prev.upgrades[upgradeId] || 0;
      if (currentLevel >= config.maxLevel) return prev;
      const cost = config.cost(currentLevel);
      if (prev.garageParts < cost) return prev;
      const nextCareer = {
        ...prev,
        garageParts: prev.garageParts - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1
        }
      };
      engineRef.current?.updateGarage(nextCareer.upgrades);
      return nextCareer;
    });
  };

  const selectedBestTime = career.bestTimes?.[trackId];

  if (!raceStarted) {
    return (
      <div className={`race-mode-shell ${activeHudTheme ? 'game-hud-themed-interface' : ''}`}>
        <GameHudThemeLayer theme={activeHudTheme} mode="kart" />
        <div className="race-mode-header">
          <div>
            <div className="portal-focus-kicker">{lang === 'fr' ? 'GRILLE DE DEPART / PREPARATION' : 'STARTING GRID / PREPARATION'}</div>
            <h3>{lang === 'fr' ? 'Configurer la course A.R.C.A.' : 'Configure the A.R.C.A. race'}</h3>
            <p>
              {lang === 'fr'
                ? 'Choisis explicitement ton pilote et ton circuit. Le moteur reste coupe jusqu a la validation de la grille.'
                : 'Explicitly choose your pilot and track. The engine stays offline until the grid is confirmed.'}
            </p>
          </div>
          <div className="race-mode-pilot">
            <img className="race-mode-pilot-icon" src={RACE_ASSETS.hudAvatar} alt="Mirelle kart HUD" />
            <div>
              <strong>{pilotId ? 'Mirelle Suture' : (lang === 'fr' ? 'Pilote requis' : 'Pilot required')}</strong>
              <span>{selectedKartName}</span>
            </div>
          </div>
        </div>

        <div className="race-preflight-grid">
          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '1. PILOTE' : '1. PILOT'}</span>
            <button type="button" className={`race-pilot-option ${pilotId === 'mirelle' ? 'active' : ''}`} onClick={() => setPilotId('mirelle')}>
              <img src={RACE_ASSETS.hudAvatar} alt="Mirelle Suture" />
              <span><strong>Mirelle Suture</strong><small>{lang === 'fr' ? 'Chassis Suture / equilibre' : 'Suture chassis / balanced'}</small></span>
            </button>
          </section>

          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '2. CHASSIS' : '2. CHASSIS'}</span>
            <div className="race-preflight-karts" role="group" aria-label={lang === 'fr' ? 'Kart actif' : 'Active kart'}>
              <button
                type="button"
                className={`race-kart-option ${!selectedKart ? 'active' : ''}`}
                onClick={() => selectKart(null)}
                aria-pressed={!selectedKart}
              >
                <span style={{ '--kart-color': '#39c5bb' }} aria-hidden="true">K</span>
                <strong>{lang === 'fr' ? 'Chassis Suture Nexus' : 'Nexus Suture Chassis'}</strong>
                <small>{lang === 'fr' ? 'Kart de base / performances garage' : 'Base kart / garage performance'}</small>
              </button>
              {ownedKarts.map(kart => (
                <button
                  key={kart.id}
                  type="button"
                  className={`race-kart-option ${selectedKart?.id === kart.id ? 'active' : ''}`}
                  onClick={() => selectKart(kart.id)}
                  aria-pressed={selectedKart?.id === kart.id}
                >
                  <span style={{ '--kart-color': kart.color }} aria-hidden="true">K</span>
                  <strong>{kart.name[lang] || kart.name.fr}</strong>
                  <small>{kart.desc[lang] || kart.desc.fr}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '3. CIRCUIT' : '3. TRACK'}</span>
            <div className="race-preflight-tracks">
              {trackList.map(trackOption => (
                <button key={trackOption.id} type="button" className={`race-track-option ${trackOption.id === trackId ? 'active' : ''}`} onClick={() => selectTrack(trackOption.id)}>
                  <strong>{trackOption.name[lang] || trackOption.name.fr}</strong>
                  <small>{trackOption.tags.join(' / ')} / D{trackOption.difficulty} / {trackOption.laps} {lang === 'fr' ? 'tours' : 'laps'}</small>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="race-preflight-launch">
          <div>
            <span>{lang === 'fr' ? 'Pilote' : 'Pilot'}: <strong>{pilotId ? 'Mirelle Suture' : '--'}</strong></span>
            <span>{lang === 'fr' ? 'Kart' : 'Kart'}: <strong>{selectedKartName}</strong></span>
            <span>{lang === 'fr' ? 'Circuit' : 'Track'}: <strong>{track ? (track.name[lang] || track.name.fr) : '--'}</strong></span>
          </div>
          <label className="race-assist-toggle" title={lang === 'fr' ? 'Maintient automatiquement l acceleration; le frein et les virages restent manuels.' : 'Automatically holds acceleration; braking and steering stay manual.'}>
            <input type="checkbox" checked={autoAccelerate} onChange={event => setAutoAccelerate(event.target.checked)} />
            <span>{lang === 'fr' ? 'ACCELERATION ASSISTEE' : 'ASSISTED ACCELERATION'}</span>
          </label>
          <button type="button" className="btn-retro" disabled={!pilotId || !trackId} onClick={startRace} title={lang === 'fr' ? 'Demarre apres avoir choisi pilote et circuit.' : 'Start after choosing a pilot and track.'}>
            {lang === 'fr' ? 'VALIDER LA GRILLE' : 'CONFIRM GRID'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`race-mode-shell ${activeHudTheme ? 'game-hud-themed-interface' : ''}`}>
      <GameHudThemeLayer theme={activeHudTheme} mode="kart" />
      <div className="race-mode-header">
        <div>
          <div className="portal-focus-kicker">{lang === 'fr' ? 'PROTOCOLE COURSE / TEST NEXUS' : 'RACE PROTOCOL / NEXUS TEST'}</div>
          <h3>{lang === 'fr' ? 'Circuit A.R.C.A. Kart' : 'A.R.C.A. Kart Circuit'}</h3>
          <p>
            {lang === 'fr'
              ? `Pilote ${pilotName}, Mirelle ouvre la premiere plaquette jouable en camera arriere: conduite, drift, objets, checkpoints et adversaires IA. La vue de dessus reste limitee a la mini-map.`
              : `Pilot ${pilotName}, Mirelle opens the first playable rear-camera sheet: driving, drift, items, checkpoints, and AI rivals. Top-down view stays limited to the minimap.`}
          </p>
        </div>
        <div className="race-mode-pilot">
          <img className="race-mode-pilot-icon" src={RACE_ASSETS.hudAvatar} alt="Mirelle kart HUD" />
          <div>
            <strong>Mirelle Suture</strong>
            <span>{selectedKartName}</span>
          </div>
        </div>
      </div>

      <div className="race-mode-grid">
        <div className="race-canvas-panel">
          <canvas
            ref={canvasRef}
            width="960"
            height="540"
            className="race-mode-canvas"
            aria-label={lang === 'fr' ? 'Circuit kart jouable A.R.C.A.' : 'Playable A.R.C.A. kart circuit'}
            data-race-state={snapshot.raceState}
            data-speed={snapshot.speed}
            data-lap={snapshot.lap}
            data-track-factor={snapshot.trackFactor.toFixed(2)}
          />
          {summary && (
            <div className="race-result-banner">
              <strong>{lang === 'fr' ? 'COURSE STABILISEE' : 'RACE STABILIZED'} // {summary.grade}</strong>
              <span>
                {lang === 'fr'
                  ? `Position ${summary.rank}/4 - Temps ${formatRaceTime(summary.time)} - Objectif ${summary.objectiveComplete ? 'OK' : 'rate'}`
                  : `Position ${summary.rank}/4 - Time ${formatRaceTime(summary.time)} - Objective ${summary.objectiveComplete ? 'OK' : 'failed'}`}
              </span>
              <span>
                +{summary.rewards?.garageParts || 0} parts / +{summary.rewards?.fragments || 0} fragments / +{summary.rewards?.xp || 0} XP
              </span>
              <button type="button" className="btn-retro" onClick={resetRace}>
                {lang === 'fr' ? 'RELANCER' : 'RESTART'}
              </button>
            </div>
          )}
        </div>

        <aside className="race-side-panel">
          <div className="race-stat-grid">
            <div><span>{lang === 'fr' ? 'Position' : 'Position'}</span><strong>{snapshot.rank}/4</strong></div>
            <div><span>{lang === 'fr' ? 'Tour' : 'Lap'}</span><strong>{snapshot.lap}/{track.laps}</strong></div>
            <div><span>{lang === 'fr' ? 'Vitesse' : 'Speed'}</span><strong>{snapshot.speed}</strong></div>
            <div><span>{lang === 'fr' ? 'Temps' : 'Time'}</span><strong>{formatRaceTime(snapshot.time)}</strong></div>
          </div>
          <div className="race-career-card">
            <span>{lang === 'fr' ? 'Carriere kart' : 'Kart career'}</span>
            <div className="race-career-grid">
              <strong>{career.garageParts}</strong><small>parts</small>
              <strong>{career.fragments}</strong><small>fragments</small>
              <strong>{career.xp}</strong><small>XP</small>
              <strong>{selectedBestTime ? formatRaceTime(selectedBestTime) : '--'}</strong><small>{lang === 'fr' ? 'record' : 'best'}</small>
            </div>
          </div>
          <div className="race-objective-card">
            <span>{lang === 'fr' ? 'Objectif A.R.C.A.' : 'A.R.C.A. objective'}</span>
            <strong>{snapshot.objective || (track.objective?.type || 'podium')}</strong>
            <small className={snapshot.trackFactor > 0.34 ? 'race-anchor-ok' : 'race-anchor-alert'}>
              {lang === 'fr' ? 'Ancrage piste' : 'Track lock'}: {Math.round(snapshot.trackFactor * 100)}%
            </small>
          </div>
          <div className="race-cache-card">
            <span>{lang === 'fr' ? 'Cache active' : 'Active cache'}</span>
            <strong>{snapshot.item || (lang === 'fr' ? 'vide' : 'empty')}</strong>
            <img className="race-cache-strip" src={RACE_ASSETS.kartItems} alt={lang === 'fr' ? 'Plaquette objets kart de Mirelle' : 'Mirelle kart item sheet'} />
            <button type="button" className="btn-retro" onClick={triggerItem}>
              {lang === 'fr' ? 'UTILISER' : 'USE'}
            </button>
          </div>
          <div className="race-garage-card">
            <span>{lang === 'fr' ? 'Garage Nexus' : 'Nexus garage'}</span>
            <img src={RACE_ASSETS.hudGarage} alt={lang === 'fr' ? 'Garage et HUD kart de Mirelle' : 'Mirelle kart garage and HUD'} />
            <strong>{selectedKartName}</strong>
            <div className="race-upgrade-list">
              {Object.entries(KART_GARAGE_UPGRADES).map(([upgradeId, upgrade]) => {
                const level = career.upgrades[upgradeId] || 0;
                const cost = upgrade.cost(level);
                const capped = level >= upgrade.maxLevel;
                return (
                  <button
                    key={upgradeId}
                    type="button"
                    className="race-upgrade-row"
                    disabled={capped || career.garageParts < cost}
                    onClick={() => buyUpgrade(upgradeId)}
                  >
                    <span>{upgrade.label[lang] || upgrade.label.fr}</span>
                    <strong>{level}/{upgrade.maxLevel}</strong>
                    <small>{capped ? 'MAX' : `${cost} parts`}</small>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="race-track-selector">
            <span>{lang === 'fr' ? 'Grille engagee' : 'Grid engaged'}</span>
            <strong>{track.name[lang] || track.name.fr}</strong>
            <small>{track.tags.join(' / ')} / D{track.difficulty} / {track.laps} {lang === 'fr' ? 'tours' : 'laps'}</small>
            {!dedicatedSession && (
              <button type="button" className="btn-retro" onClick={returnToGrid}>{lang === 'fr' ? 'CHANGER LA GRILLE' : 'CHANGE GRID'}</button>
            )}
          </div>
          <div className="race-control-list">
            {controlRows.map(row => (
              <div key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <div className="race-touch-controls">
            <button type="button" className="btn-retro" onClick={() => pulseVirtualKey('up')} onPointerDown={() => activateVirtualKey('up', true)} onPointerUp={() => activateVirtualKey('up', false)} onPointerCancel={() => activateVirtualKey('up', false)} onPointerLeave={() => activateVirtualKey('up', false)}>ACC</button>
            <button type="button" className="btn-retro" onClick={() => pulseVirtualKey('left')} onPointerDown={() => activateVirtualKey('left', true)} onPointerUp={() => activateVirtualKey('left', false)} onPointerCancel={() => activateVirtualKey('left', false)} onPointerLeave={() => activateVirtualKey('left', false)}>GAUCHE</button>
            <button type="button" className="btn-retro" onClick={() => pulseVirtualKey('right')} onPointerDown={() => activateVirtualKey('right', true)} onPointerUp={() => activateVirtualKey('right', false)} onPointerCancel={() => activateVirtualKey('right', false)} onPointerLeave={() => activateVirtualKey('right', false)}>DROITE</button>
            <button type="button" className="btn-retro" onClick={() => pulseVirtualKey('space')} onPointerDown={() => activateVirtualKey('space', true)} onPointerUp={() => activateVirtualKey('space', false)} onPointerCancel={() => activateVirtualKey('space', false)} onPointerLeave={() => activateVirtualKey('space', false)}>DRIFT</button>
            <button type="button" className="btn-retro" onClick={triggerBoost}>BOOST</button>
            <button type="button" className="btn-retro" onClick={recoverPlayer}>{lang === 'fr' ? 'REANCRER' : 'RECOVER'}</button>
            {summary && <button type="button" className="btn-retro" onClick={resetRace}>{lang === 'fr' ? 'RELANCER' : 'RESTART'}</button>}
          </div>
        </aside>
      </div>
    </div>
  );
}
