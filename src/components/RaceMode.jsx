import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EngineRace, RACE_ASSETS, RACE_TRACKS } from '../game/engineRace';

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
  'E'
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

export default function RaceMode({ lang = 'fr', playerProfile }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const keysRef = useRef({});
  const [summary, setSummary] = useState(null);
  const [snapshot, setSnapshot] = useState({
    rank: 1,
    lap: 1,
    speed: 0,
    item: null,
    time: 0,
    grade: null
  });

  const track = RACE_TRACKS.nexus_archive_loop;
  const pilotName = playerProfile?.name?.trim() || (lang === 'fr' ? 'Ancre' : 'Anchor');
  const controlRows = useMemo(() => [
    { label: lang === 'fr' ? 'Accel.' : 'Accel.', value: 'Z/W ou fleche haut' },
    { label: lang === 'fr' ? 'Frein' : 'Brake', value: 'S ou fleche bas' },
    { label: lang === 'fr' ? 'Virage' : 'Steer', value: 'Q/D ou fleches' },
    { label: 'Drift', value: 'Espace' },
    { label: lang === 'fr' ? 'Objet' : 'Item', value: 'E' }
  ], [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const engine = new EngineRace(960, 540, raceSummary => {
      setSummary(raceSummary);
      setSnapshot(prev => ({ ...prev, grade: raceSummary.grade, rank: raceSummary.rank, time: raceSummary.time }));
    });
    engineRef.current = engine;
    let animationId = 0;
    let last = performance.now();
    let snapshotTimer = 0;

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (keysRef.current.shift) {
        engine.player.boost = Math.max(engine.player.boost, 0.22);
        keysRef.current.shift = false;
      }
      engine.setInput(keysRef.current);
      engine.update(dt);
      const ctx = canvas.getContext('2d');
      engine.draw(ctx);
      snapshotTimer += dt;
      if (snapshotTimer > 0.12) {
        snapshotTimer = 0;
        setSnapshot({
          rank: engine.player.rank,
          lap: Math.min(engine.player.lap + 1, engine.track.laps),
          speed: Math.round(Math.abs(engine.player.speed)),
          item: engine.player.item,
          time: engine.player.finishTime || engine.time,
          grade: engine.player.finished ? engine.getRaceSummary().grade : null
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
      keysRef.current[key] = true;
    };
    const onKeyUp = (event) => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      keysRef.current[normalizeKey(event.key)] = false;
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const resetRace = () => {
    keysRef.current = {};
    setSummary(null);
    engineRef.current?.reset();
  };

  const activateVirtualKey = (key, active) => {
    keysRef.current[key] = active;
  };

  const triggerItem = () => {
    engineRef.current?.useItem();
  };

  const triggerBoost = () => {
    if (engineRef.current) engineRef.current.player.boost = Math.max(engineRef.current.player.boost, 0.28);
  };

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
          />
          {summary && (
            <div className="race-result-banner">
              <strong>{lang === 'fr' ? 'COURSE STABILISEE' : 'RACE STABILIZED'} // {summary.grade}</strong>
              <span>
                {lang === 'fr'
                  ? `Position ${summary.rank}/4 - Temps ${formatRaceTime(summary.time)}`
                  : `Position ${summary.rank}/4 - Time ${formatRaceTime(summary.time)}`}
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
          <div className="race-cache-card">
            <span>{lang === 'fr' ? 'Cache active' : 'Active cache'}</span>
            <strong>{snapshot.item || (lang === 'fr' ? 'vide' : 'empty')}</strong>
            <button type="button" className="btn-retro" onClick={triggerItem}>
              {lang === 'fr' ? 'UTILISER' : 'USE'}
            </button>
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
            <button type="button" className="btn-retro" onPointerDown={() => activateVirtualKey('up', true)} onPointerUp={() => activateVirtualKey('up', false)} onPointerLeave={() => activateVirtualKey('up', false)}>ACC</button>
            <button type="button" className="btn-retro" onPointerDown={() => activateVirtualKey('left', true)} onPointerUp={() => activateVirtualKey('left', false)} onPointerLeave={() => activateVirtualKey('left', false)}>GAUCHE</button>
            <button type="button" className="btn-retro" onPointerDown={() => activateVirtualKey('right', true)} onPointerUp={() => activateVirtualKey('right', false)} onPointerLeave={() => activateVirtualKey('right', false)}>DROITE</button>
            <button type="button" className="btn-retro" onPointerDown={() => activateVirtualKey('space', true)} onPointerUp={() => activateVirtualKey('space', false)} onPointerLeave={() => activateVirtualKey('space', false)}>DRIFT</button>
            <button type="button" className="btn-retro" onClick={triggerBoost}>BOOST</button>
            <button type="button" className="btn-retro" onClick={resetRace}>{lang === 'fr' ? 'RESET' : 'RESET'}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
