import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EngineRace, KART_GARAGE_UPGRADES, RACE_ASSETS, RACE_TRACKS } from '../game/engineRace';

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

const DEFAULT_KART_CAREER = {
  xp: 0,
  fragments: 0,
  garageParts: 0,
  upgrades: { engine: 0, grip: 0, capacitor: 0, stabilizer: 0 },
  bestTimes: {},
  completedObjectives: {}
};

const loadKartCareer = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_KART_CAREER;
  try {
    const parsed = JSON.parse(localStorage.getItem('multiverse-breach-kart-career') || 'null');
    return {
      ...DEFAULT_KART_CAREER,
      ...(parsed || {}),
      upgrades: { ...DEFAULT_KART_CAREER.upgrades, ...(parsed?.upgrades || {}) },
      bestTimes: parsed?.bestTimes || {},
      completedObjectives: parsed?.completedObjectives || {}
    };
  } catch {
    return DEFAULT_KART_CAREER;
  }
};

const saveKartCareer = career => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('multiverse-breach-kart-career', JSON.stringify(career));
};

export default function RaceMode({ lang = 'fr', playerProfile }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const keysRef = useRef({});
  const keyPulseRef = useRef({});
  const autoAccelerateRef = useRef(true);
  const [trackId, setTrackId] = useState(null);
  const [pilotId, setPilotId] = useState(null);
  const [raceStarted, setRaceStarted] = useState(false);
  const [career, setCareer] = useState(loadKartCareer);
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

  const trackList = useMemo(() => Object.values(RACE_TRACKS).sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id)), []);
  const track = trackId ? RACE_TRACKS[trackId] : null;
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
    if (!raceStarted || !track) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const engine = new EngineRace(960, 540, raceSummary => {
      setCareer(prev => {
        const rewards = raceSummary.rewards || { fragments: 0, xp: 0, garageParts: 0 };
        const previousBest = prev.bestTimes?.[raceSummary.trackId];
        const nextCareer = {
          ...prev,
          xp: prev.xp + rewards.xp,
          fragments: prev.fragments + rewards.fragments,
          garageParts: prev.garageParts + rewards.garageParts,
          bestTimes: {
            ...prev.bestTimes,
            [raceSummary.trackId]: previousBest ? Math.min(previousBest, raceSummary.time) : raceSummary.time
          },
          completedObjectives: {
            ...prev.completedObjectives,
            [raceSummary.trackId]: Boolean(prev.completedObjectives?.[raceSummary.trackId] || raceSummary.objectiveComplete)
          }
        };
        saveKartCareer(nextCareer);
        return nextCareer;
      });
      setSummary(raceSummary);
      setSnapshot(prev => ({ ...prev, grade: raceSummary.grade, rank: raceSummary.rank, time: raceSummary.time }));
    }, trackId, career.upgrades);
    engineRef.current = engine;
    let animationId = 0;
    let last = performance.now();
    let snapshotTimer = 0;

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
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
        setSnapshot({
          rank: engine.player.rank,
          lap: Math.min(engine.player.lap + 1, engine.track.laps),
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
      engineRef.current = null;
    };
  }, [career.upgrades, raceStarted, track, trackId]);

  const resetRace = () => {
    keysRef.current = {};
    setSummary(null);
    engineRef.current?.reset();
  };

  const selectTrack = (nextTrackId) => {
    keysRef.current = {};
    setSummary(null);
    setTrackId(nextTrackId);
  };

  const startRace = () => {
    if (!pilotId || !trackId) return;
    keysRef.current = {};
    keyPulseRef.current = {};
    setSummary(null);
    setSnapshot({ rank: 1, lap: 1, speed: 0, item: null, time: 0, grade: null, objective: '', raceState: 'countdown', trackFactor: 1 });
    setRaceStarted(true);
  };

  const returnToGrid = () => {
    keysRef.current = {};
    keyPulseRef.current = {};
    setRaceStarted(false);
    setSummary(null);
  };

  const activateVirtualKey = (key, active) => {
    keysRef.current[key] = active;
    if (active) keyPulseRef.current[key] = performance.now() + 540;
  };

  const pulseVirtualKey = (key) => {
    keyPulseRef.current[key] = performance.now() + 680;
  };

  const triggerItem = () => {
    engineRef.current?.useItem();
  };

  const triggerBoost = () => {
    if (engineRef.current) engineRef.current.player.boost = Math.max(engineRef.current.player.boost, 0.28);
  };

  const recoverPlayer = () => {
    engineRef.current?.recoverPlayer();
  };

  const buyUpgrade = (upgradeId) => {
    const config = KART_GARAGE_UPGRADES[upgradeId];
    if (!config) return;
    setCareer(prev => {
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
      saveKartCareer(nextCareer);
      engineRef.current?.updateGarage(nextCareer.upgrades);
      return nextCareer;
    });
  };

  const selectedBestTime = career.bestTimes?.[trackId];

  if (!raceStarted) {
    return (
      <div className="race-mode-shell">
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
              <span>{track ? (track.name[lang] || track.name.fr) : (lang === 'fr' ? 'Circuit requis' : 'Track required')}</span>
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
            <span className="race-preflight-label">{lang === 'fr' ? '2. CIRCUIT' : '2. TRACK'}</span>
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
    <div className="race-mode-shell">
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
            <span>{track.name[lang] || track.name.fr}</span>
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
            <strong>{lang === 'fr' ? 'Chassis Suture / cache A.R.C.A.' : 'Suture chassis / A.R.C.A. cache'}</strong>
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
            <button type="button" className="btn-retro" onClick={returnToGrid}>{lang === 'fr' ? 'CHANGER LA GRILLE' : 'CHANGE GRID'}</button>
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
            <button type="button" className="btn-retro" onClick={resetRace}>{lang === 'fr' ? 'RELANCER' : 'RESTART'}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
