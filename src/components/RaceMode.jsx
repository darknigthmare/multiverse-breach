import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EngineRace, KART_GARAGE_UPGRADES, RACE_ASSETS, RACE_TRACKS } from '../game/engineRace';
import { COMBAT_STEP_MS, createFixedStepClock } from '../game/fixedStepClock';
import { createRaceKeyboardState, createRaceRunGuard, createRaceTouchState } from '../game/raceSessionControls.js';
import { applyRaceResult, normalizeKartCareer } from '../game/kartCareer';
import sound from '../game/soundEngine';
import { getUnlockableById } from '../game/universeUnlockables';
import { resolveActiveHudTheme } from '../game/cosmeticVisualAssets';
import GameHudThemeLayer from './GameHudThemeLayer';
import ImmersiveDrawer from './ImmersiveDrawer.jsx';
import { getKartRoster } from '../game/kart/kartRoster.js';
import { applyKartLivery } from '../game/kart/kartLivery.js';
import { KartRenderer3D } from '../game/kart/kartRenderer3D.js';
import { isUniverseInstalled } from '../game/dlcInstallation.js';
import KartSpritePreview from './KartSpritePreview.jsx';
import './HubImmersion.css';
import './RaceKart3D.css';

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
  unlockedHeroes = null,
  onSessionStart,
  onSessionEnd,
  onPauseRequest,
  sessionPaused = false,
  sessionExitRequest = 0,
  dedicatedSession = false
}) {
  const canvasRef = useRef(null);
  const worldCanvasRef = useRef(null);
  const worldHudRef = useRef(null);
  const touchControlsRef = useRef(null);
  const engineRef = useRef(null);
  const rendererRef = useRef(null);
  const keysRef = useRef({});
  const keyboardStateRef = useRef(null);
  if (!keyboardStateRef.current) keyboardStateRef.current = createRaceKeyboardState();
  const keyPulseRef = useRef({});
  const touchStateRef = useRef(null);
  if (!touchStateRef.current) touchStateRef.current = createRaceTouchState();
  const runGuardRef = useRef(null);
  const autoAccelerateRef = useRef(true);
  const raceMusicStateRef = useRef('grid');
  const onSessionEndRef = useRef(onSessionEnd);
  const sessionPausedRef = useRef(sessionPaused);
  const simulationClockRef = useRef(null);
  const sessionExitRequestRef = useRef(sessionExitRequest);
  const [raceMenuOpen, setRaceMenuOpen] = useState(false);
  const closeRaceMenu = useCallback(() => setRaceMenuOpen(false), []);
  const [trackId, setTrackId] = useState(null);
  const [pilotId, setPilotId] = useState(null);
  const [renderMode, setRenderMode] = useState('3d');
  const [cameraMode, setCameraMode] = useState('chase');
  const [pilotQuery, setPilotQuery] = useState('');
  const [pilotUniverse, setPilotUniverse] = useState('');
  const [pilotPage, setPilotPage] = useState(0);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackUniverse, setTrackUniverse] = useState('');
  const [trackPage, setTrackPage] = useState(0);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceNonce, setRaceNonce] = useState(0);
  const [runtimeError, setRuntimeError] = useState(false);
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
  const garageUpgradesRef = useRef(garageUpgrades);
  garageUpgradesRef.current = garageUpgrades;
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

  const activeHudTheme = resolveActiveHudTheme(portalCollection);
  const hiddenUniverseSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const roster = useMemo(() => getKartRoster({ hiddenUniverses, playerProfile }), [hiddenUniverses, playerProfile]);
  const rosterUniverses = useMemo(() => [...new Set(roster.map(pilot => pilot.universe))].sort((a, b) => a.localeCompare(b)), [roster]);
  const ownedPilotIds = useMemo(() => new Set(unlockedHeroes == null
    ? roster.map(pilot => pilot.heroId)
    : ['arca_mirelle', 'player_anchor', ...unlockedHeroes]), [roster, unlockedHeroes]);
  const pilotSpec = useMemo(() => roster.find(pilot => pilot.heroId === pilotId) || null, [roster, pilotId]);
  const filteredPilots = useMemo(() => roster.filter(pilot => (!pilotUniverse || pilot.universe === pilotUniverse)
    && `${pilot.name} ${pilot.universe}`.toLocaleLowerCase().includes(pilotQuery.toLocaleLowerCase()))
    .sort((a, b) => Number(ownedPilotIds.has(b.heroId)) - Number(ownedPilotIds.has(a.heroId))
      || Number(b.heroId === 'arca_mirelle') - Number(a.heroId === 'arca_mirelle')
      || a.name.localeCompare(b.name)), [roster, pilotUniverse, pilotQuery, ownedPilotIds]);
  const pilotPages = Math.max(1, Math.ceil(filteredPilots.length / 12));
  const visiblePilots = filteredPilots.slice(Math.min(pilotPage, pilotPages - 1) * 12, (Math.min(pilotPage, pilotPages - 1) + 1) * 12);
  const trackList = useMemo(() => Object.values(RACE_TRACKS)
    .filter(option => !hiddenUniverseSet.has(option.universe || 'Nexus de Convergence') && isUniverseInstalled(option.universe || 'Nexus de Convergence'))
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id)), [hiddenUniverseSet]);
  const trackUniverses = useMemo(() => [...new Set(trackList.map(option => option.universe || 'Nexus de Convergence'))].sort((a, b) => a.localeCompare(b)), [trackList]);
  const filteredTracks = useMemo(() => trackList.filter(option => (!trackUniverse || (option.universe || 'Nexus de Convergence') === trackUniverse)
    && `${option.name?.fr} ${option.name?.en} ${option.universe || 'Nexus de Convergence'}`.toLocaleLowerCase().includes(trackQuery.toLocaleLowerCase())), [trackList, trackUniverse, trackQuery]);
  const trackPages = Math.max(1, Math.ceil(filteredTracks.length / 12));
  const visibleTracks = filteredTracks.slice(Math.min(trackPage, trackPages - 1) * 12, (Math.min(trackPage, trackPages - 1) + 1) * 12);
  const ownedKarts = useMemo(() => (
    (portalCollection.karts || [])
      .map(id => getUnlockableById('kart', id))
      .filter(kart => kart && !hiddenUniverseSet.has(kart.universe))
  ), [hiddenUniverseSet, portalCollection.karts]);
  const selectedKart = ownedKarts.find(kart => kart.id === portalCollection.activeKart) || null;
  const displayedKartSpec = useMemo(() => applyKartLivery(pilotSpec, selectedKart), [pilotSpec, selectedKart]);
  const selectedKartName = pilotSpec?.kartName?.[lang] || pilotSpec?.kartName?.fr
    || (lang === 'fr' ? 'Kart personnel' : 'Personal kart');
  const track = trackId ? RACE_TRACKS[trackId] : null;
  const canLaunch = Boolean(pilotSpec && ownedPilotIds.has(pilotSpec.heroId) && trackList.some(option => option.id === trackId));
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
  // Parent callbacks and collection objects may change without starting a race.
  // A setup is captured at launch/restart; garage upgrades intentionally stay live.
  const raceSetupRef = useRef(null);
  raceSetupRef.current = { raceMusicStage, selectedKart, pilotSpec, renderMode, cameraMode, lang };
  useEffect(() => { if (engineRef.current) engineRef.current.lang = lang; }, [lang]);
  useEffect(() => { rendererRef.current?.setCameraMode(cameraMode); }, [cameraMode]);
  const updateCareerRef = useRef(updateCareer);
  updateCareerRef.current = updateCareer;

  const pilotName = playerProfile?.name?.trim() || (lang === 'fr' ? 'Ancre' : 'Anchor');
  const controlRows = useMemo(() => [
    { label: 'Accel.', value: lang === 'fr' ? 'Z/W ou flèche haut' : 'W/Z or Up arrow' },
    { label: lang === 'fr' ? 'Frein' : 'Brake', value: lang === 'fr' ? 'S ou flèche bas' : 'S or Down arrow' },
    { label: lang === 'fr' ? 'Virage' : 'Steer', value: lang === 'fr' ? 'Q/D ou flèches' : 'A/D or arrow keys' },
    { label: 'Drift', value: lang === 'fr' ? 'Espace' : 'Space' },
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
    sessionPausedRef.current = sessionPaused || raceMenuOpen;
    simulationClockRef.current?.reset();
    if (sessionPaused || raceMenuOpen) {
      keyboardStateRef.current.clear();
      keysRef.current = {};
      keyPulseRef.current = {};
      touchStateRef.current.clear();
    }
  }, [sessionPaused, raceMenuOpen]);

  // Le retour au hub n'est applique qu'apres confirmation dans le menu pause.
  useEffect(() => {
    if (sessionExitRequestRef.current === sessionExitRequest) return;
    sessionExitRequestRef.current = sessionExitRequest;
    runGuardRef.current?.dispose();
    touchStateRef.current.clear();
    setRaceMenuOpen(false);
    keyboardStateRef.current.clear();
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
    if (!raceStarted || !RACE_TRACKS[trackId]) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const { raceMusicStage, selectedKart, pilotSpec, renderMode, cameraMode } = raceSetupRef.current;
    const runGuard = createRaceRunGuard();
    runGuardRef.current = runGuard;
    setRuntimeError(false);
    const engine = new EngineRace(960, 540, raceSummary => {
      if (!runGuard.claim()) return;
      updateCareerRef.current(prev => applyRaceResult(prev, raceSummary));
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
    }, trackId, garageUpgradesRef.current, selectedKart, pilotSpec);
    engine.lang = raceSetupRef.current.lang;
    engineRef.current = engine;
    const rendererFailure = error => {
      if (!runGuard.isActive()) return;
      console.error('Kart 3D renderer unavailable', error);
      runGuard.dispose();
      keyboardStateRef.current.clear();
      keysRef.current = {};
      keyPulseRef.current = {};
      touchStateRef.current.clear();
      engine.setInput({});
      sound.stopBgm();
      setRaceMenuOpen(false);
      setRuntimeError(true);
    };
    if (renderMode === '3d') {
      try {
        const renderer = new KartRenderer3D(worldCanvasRef.current, { cameraMode, onError: rendererFailure });
        engine.renderer3D = renderer;
        rendererRef.current = renderer;
      } catch (error) { rendererFailure(error); }
    }
    raceMusicStateRef.current = 'grid';
    if (runGuard.isActive()) sound.playStageBgm(raceMusicStage, 'grid');
    let animationId = 0;
    const simulationClock = createFixedStepClock();
    simulationClockRef.current = simulationClock;
    let snapshotTimer = 0;

    const loop = (now) => {
      if (!runGuard.isActive()) return;
      try {
        const steps = simulationClock.advance(now, { paused: sessionPausedRef.current || document.hidden });
        const dt = steps * COMBAT_STEP_MS / 1000;
        if (sessionPausedRef.current || document.hidden) {
          animationId = requestAnimationFrame(loop);
          return;
        }
        const pulseKeys = Object.fromEntries(
          Object.entries(keyPulseRef.current).filter(([, expiresAt]) => expiresAt > now).map(([key]) => [key, true])
        );
        const mergedInputs = { ...keysRef.current, ...touchStateRef.current.snapshot(), ...pulseKeys };
        engine.setInput({
          ...mergedInputs,
          autoAccel: autoAccelerateRef.current,
          manualAccel: Boolean(mergedInputs.up || mergedInputs.w)
        });
        for (let step = 0; step < steps; step += 1) engine.update(COMBAT_STEP_MS / 1000);
        const ctx = canvas.getContext('2d');
        if (engine.renderer3D && snapshotTimer === 0) {
          const viewport = canvas.getBoundingClientRect();
          const hud = worldHudRef.current?.getBoundingClientRect();
          const controls = touchControlsRef.current?.getBoundingClientRect();
          engine.overlayViewport = {
            width: viewport.width,
            height: viewport.height,
            top: Math.max(12, (hud?.bottom || viewport.top) - viewport.top + 12),
            bottom: Math.max(12, viewport.bottom - (controls?.top || viewport.bottom) + 12)
          };
        }
        engine.draw(ctx, dt);
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
            trackFactor: telemetry.trackFactor,
            missingDrivers: engine.renderer3D?.getTelemetry().drivers.filter(driver => driver.status === 'missing').length || 0
          });
        }
        animationId = requestAnimationFrame(loop);
      } catch (error) {
        console.error('Race render loop failed', error);
        runGuard.dispose();
        keyboardStateRef.current.clear();
        keysRef.current = {};
        keyPulseRef.current = {};
        touchStateRef.current.clear();
        engine.setInput({});
        sound.stopBgm();
        setRaceMenuOpen(false);
        setRuntimeError(true);
      }
    };
    animationId = requestAnimationFrame(loop);

    const onKeyDown = (event) => {
      if (event.repeat || event.defaultPrevented || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName) || event.target?.isContentEditable || event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if ([' ', 'Enter'].includes(event.key) && event.target?.closest?.('button, [role="button"]')) return;
      if (event.key === 'Enter' && event.target?.closest?.('a[href]')) return;
      if (!runGuard.isActive() || sessionPausedRef.current || document.hidden || engine.finished) return;
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
      keyboardStateRef.current.hold(event, key);
      keysRef.current = keyboardStateRef.current.snapshot();
    };
    const onKeyUp = (event) => {
      // A key can be released over a field or with a different character.
      // Its physical owner still has to be removed before filtering UI input.
      keyboardStateRef.current.release(event);
      keysRef.current = keyboardStateRef.current.snapshot();
      if (!CONTROL_KEYS.has(event.key)) return;
      if (sessionPausedRef.current || engine.finished || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName) || event.target?.isContentEditable || event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if ([' ', 'Enter'].includes(event.key) && event.target?.closest?.('button, [role="button"]')) return;
      if (event.key === 'Enter' && event.target?.closest?.('a[href]')) return;
      event.preventDefault();
    };
    const clearInputs = () => {
      keyboardStateRef.current.clear();
      keysRef.current = {};
      keyPulseRef.current = {};
      touchStateRef.current.clear();
    };
    const onVisibilityChange = () => {
      simulationClockRef.current?.reset();
      if (document.hidden) clearInputs();
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('blur', clearInputs);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      runGuard.dispose();
      engine.setInput({});
      keyboardStateRef.current.clear();
      keysRef.current = {};
      keyPulseRef.current = {};
      touchStateRef.current.clear();
      if (runGuardRef.current === runGuard) runGuardRef.current = null;
      cancelAnimationFrame(animationId);
      if (simulationClockRef.current === simulationClock) simulationClockRef.current = null;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputs);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sound.stopBgm();
      engine.dispose?.();
      rendererRef.current = null;
      engineRef.current = null;
    };
  }, [raceStarted, trackId, raceNonce]);

  useEffect(() => { engineRef.current?.updateGarage(garageUpgrades); }, [garageUpgrades]);

  const resetRace = () => {
    if (sessionPausedRef.current) return;
    keyboardStateRef.current.clear();
    keysRef.current = {};
    keyPulseRef.current = {};
    if (summary) onSessionStart?.();
    setSummary(null);
    runGuardRef.current?.dispose();
    touchStateRef.current.clear();
    setRuntimeError(false);
    setSnapshot({ rank: 1, lap: 1, speed: 0, item: null, time: 0, grade: null, objective: '', raceState: 'countdown', trackFactor: 1 });
    setRaceNonce(value => value + 1);
    raceMusicStateRef.current = 'grid';
    sound.playStageBgm(raceMusicStage, 'grid');
  };

  const selectTrack = (nextTrackId) => {
    if (sessionPausedRef.current) return;
    keyboardStateRef.current.clear();
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
    if (sessionPausedRef.current || !pilotId || !trackId || !canLaunch) return;
    onSessionStart?.();
    keyboardStateRef.current.clear();
    keysRef.current = {};
    keyPulseRef.current = {};
    setSummary(null);
    setSnapshot({ rank: 1, lap: 1, speed: 0, item: null, time: 0, grade: null, objective: '', raceState: 'countdown', trackFactor: 1 });
    setRaceStarted(true);
  };

  const returnToGrid = () => {
    if (sessionPausedRef.current) return;
    runGuardRef.current?.dispose();
    touchStateRef.current.clear();
    setRuntimeError(false);
    onSessionEndRef.current?.({ reason: 'acknowledged' });
    keyboardStateRef.current.clear();
    keysRef.current = {};
    keyPulseRef.current = {};
    setRaceStarted(false);
    setSummary(null);
  };

  const touchControlProps = key => ({
    onPointerDown: event => {
      if (event.button !== 0 || sessionPausedRef.current || engineRef.current?.finished || !runGuardRef.current?.isActive()) return;
      if (touchStateRef.current.hold(event.pointerId, key)) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
    },
    onPointerUp: event => {
      touchStateRef.current.release(event.pointerId);
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: event => touchStateRef.current.release(event.pointerId),
    onLostPointerCapture: event => touchStateRef.current.release(event.pointerId)
  });

  const pulseVirtualKey = (key) => {
    if (sessionPausedRef.current || engineRef.current?.finished || !runGuardRef.current?.isActive()) return;
    keyPulseRef.current[key] = performance.now() + 680;
  };

  const triggerItem = () => {
    if (sessionPausedRef.current) return;
    engineRef.current?.useItem();
  };

  const recoverPlayer = () => {
    if (sessionPausedRef.current) return;
    engineRef.current?.recoverPlayer();
  };

  const buyUpgrade = (upgradeId) => {
    if (sessionPaused) return;
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
      return nextCareer;
    });
  };

  const selectedBestTime = career.bestTimes?.[trackId];

  const raceSystemPanel = <ImmersiveDrawer open={raceMenuOpen} onClose={closeRaceMenu} lang={lang} title={lang === 'fr' ? 'Garage & carnet de course' : 'Garage & race log'}>
    <p>{lang === 'fr' ? 'Choisis ton pilote et son kart personnel. Drifte pour charger le turbo, prends les objets sur la piste et franchis les tours face aux adversaires.' : 'Choose your driver and personal kart. Drift to charge a turbo, collect track items and complete laps against rivals.'}</p>
    {renderMode === '3d' && <label className="kart-camera-setting">{lang === 'fr' ? 'Caméra' : 'Camera'}
      <select value={cameraMode} onChange={event => setCameraMode(event.target.value)}>
        <option value="chase">{lang === 'fr' ? 'Poursuite 3D' : '3D chase'}</option>
        <option value="overview">{lang === 'fr' ? 'Vue aérienne 3D' : '3D overview'}</option>
      </select>
    </label>}
    {raceStarted && <p role="status">{lang === 'fr' ? 'Course en pause. Les améliorations conservent la course en cours.' : 'Race paused. Upgrades preserve the current race.'}</p>}
          <div className="race-career-card">
            <span>{lang === 'fr' ? 'Carriere kart' : 'Kart career'}</span>
            <div className="race-career-grid">
              <strong>{career.garageParts}</strong><small>parts</small>
              <strong>{career.fragments}</strong><small>fragments</small>
              <strong>{career.xp}</strong><small>XP</small>
              <strong>{selectedBestTime ? formatRaceTime(selectedBestTime) : '--'}</strong><small>{lang === 'fr' ? 'record' : 'best'}</small>
            </div>
          </div>
          <div className="race-garage-card">
            <span>{lang === 'fr' ? 'Garage Nexus' : 'Nexus garage'}</span>
            {displayedKartSpec && <KartSpritePreview spec={displayedKartSpec} kind="kart" className="kart-garage-preview" />}
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
            <strong>{track ? (track.name[lang] || track.name.fr) : (lang === 'fr' ? 'Choisir un circuit' : 'Choose a track')}</strong>
            <small>{track?.tags.join(' / ')} / D{track?.difficulty || '--'} / {track?.laps || '--'} {lang === 'fr' ? 'tours' : 'laps'}</small>
            {raceStarted && !dedicatedSession && (
              <button type="button" className="btn-retro" onClick={() => { closeRaceMenu(); onSessionEndRef.current?.({ reason: 'acknowledged' }); setRaceStarted(false); setSummary(null); }}>{lang === 'fr' ? 'CHANGER LA GRILLE' : 'CHANGE GRID'}</button>
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
    <label className="race-assist-toggle"><input type="checkbox" checked={autoAccelerate} onChange={event => setAutoAccelerate(event.target.checked)} />{lang === 'fr' ? 'Accélération assistée' : 'Assisted acceleration'}</label>
  </ImmersiveDrawer>;

  if (!raceStarted) {
    return (
      <div className={`race-mode-shell race-preflight-shell ${activeHudTheme ? 'game-hud-themed-interface' : ''}`}>
        {raceSystemPanel}
        <div className="race-preflight-utilities"><button type="button" className="btn-retro" onClick={() => setRaceMenuOpen(true)} aria-haspopup="dialog">{lang === 'fr' ? 'GARAGE · CARRIÈRE · COMMANDES' : 'GARAGE · CAREER · CONTROLS'}</button></div>
        <GameHudThemeLayer theme={activeHudTheme} mode="kart" />
        <div className="race-mode-header">
          <div>
            <div className="portal-focus-kicker">{lang === 'fr' ? 'GRILLE DE DEPART / PREPARATION' : 'STARTING GRID / PREPARATION'}</div>
            <h3>{lang === 'fr' ? 'Kart · Grand Prix des univers' : 'Kart · Universe Grand Prix'}</h3>
            <p>
              {lang === 'fr'
                ? 'Ton personnage au volant, son kart et les routes de son univers. Choisis ta grille de départ.'
                : 'Your character at the wheel, their kart and the roads of their universe. Choose your starting grid.'}
            </p>
          </div>
          <div className="race-mode-pilot">
            {pilotSpec && <KartSpritePreview spec={pilotSpec} />}
            <div>
              <strong>{pilotSpec?.name || (lang === 'fr' ? 'Pilote requis' : 'Pilot required')}</strong>
              <span>{selectedKartName}</span>
            </div>
          </div>
        </div>

        <div className="race-preflight-grid">
          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '1. PILOTE' : '1. PILOT'}</span>
            <div className="kart-catalog-filters">
              <input type="search" value={pilotQuery} onChange={event => { setPilotQuery(event.target.value); setPilotPage(0); }} placeholder={lang === 'fr' ? 'Rechercher un personnage…' : 'Search characters…'} aria-label={lang === 'fr' ? 'Rechercher un pilote' : 'Search drivers'} />
              <select value={pilotUniverse} onChange={event => { setPilotUniverse(event.target.value); setPilotPage(0); }} aria-label={lang === 'fr' ? 'Univers des pilotes' : 'Driver universe'}>
                <option value="">{lang === 'fr' ? 'Tous les univers' : 'All universes'}</option>
                {rosterUniverses.map(universe => <option key={universe}>{universe}</option>)}
              </select>
            </div>
            <div className="kart-driver-grid">
              {visiblePilots.map(pilot => <button key={pilot.id} type="button" data-pilot-id={pilot.heroId}
                className={`race-pilot-option ${pilot.heroId === pilotId ? 'active' : ''}`}
                aria-pressed={pilot.heroId === pilotId} disabled={!ownedPilotIds.has(pilot.heroId)}
                onClick={() => setPilotId(pilot.heroId)}>
                <KartSpritePreview spec={pilot} />
                <span><strong>{pilot.name}</strong><small>{pilot.universe}</small>
                  {!ownedPilotIds.has(pilot.heroId) && <small>{lang === 'fr' ? 'À débloquer dans la collection' : 'Unlock in your collection'}</small>}
                </span>
              </button>)}
            </div>
            {!visiblePilots.length && <p role="status">{lang === 'fr' ? 'Aucun pilote trouvé.' : 'No drivers found.'}</p>}
            <div className="kart-catalog-pagination" aria-label={lang === 'fr' ? 'Pages des pilotes' : 'Driver pages'}>
              <button type="button" disabled={pilotPage <= 0} onClick={() => setPilotPage(page => Math.max(0, page - 1))}>{lang === 'fr' ? 'Précédents' : 'Previous'}</button>
              <span>{Math.min(pilotPage + 1, pilotPages)} / {pilotPages} · {filteredPilots.length}</span>
              <button type="button" disabled={pilotPage >= pilotPages - 1} onClick={() => setPilotPage(page => Math.min(pilotPages - 1, page + 1))}>{lang === 'fr' ? 'Suivants' : 'Next'}</button>
            </div>
          </section>

          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '2. CHÂSSIS ET LIVRÉE' : '2. CHASSIS AND LIVERY'}</span>
            <p className="race-preflight-description">{lang === 'fr' ? 'Le châssis appartient au pilote. Vos karts de collection apportent leur peinture ; les améliorations du garage règlent les performances.' : 'The pilot keeps their personal chassis. Collection karts provide their paint; garage upgrades determine performance.'}</p>
            <div className="race-preflight-karts" role="group" aria-label={lang === 'fr' ? 'Livrée active' : 'Active livery'}>
              <button
                type="button"
                className={`race-kart-option ${!selectedKart ? 'active' : ''}`}
                onClick={() => selectKart(null)}
                aria-pressed={!selectedKart}
              >
                {pilotSpec && <KartSpritePreview spec={pilotSpec} kind="kart" />}
                <strong>{pilotSpec?.kartName?.[lang] || pilotSpec?.kartName?.fr || (lang === 'fr' ? 'Kart du personnage' : 'Character kart')}</strong>
                <small>{lang === 'fr' ? 'Châssis et couleurs du personnage' : 'Character chassis and colors'}</small>
              </button>
              {ownedKarts.map(kart => (
                <button
                  key={kart.id}
                  type="button"
                  className={`race-kart-option ${selectedKart?.id === kart.id ? 'active' : ''}`}
                  onClick={() => selectKart(kart.id)}
                  aria-pressed={selectedKart?.id === kart.id}
                >
                  {pilotSpec && <KartSpritePreview spec={applyKartLivery(pilotSpec, kart)} kind="kart" />}
                  <strong>{kart.name[lang] || kart.name.fr}</strong>
                  <small>{lang === 'fr' ? `Livrée ${kart.universe} · châssis personnel` : `${kart.universe} livery · personal chassis`}</small>
                </button>
              ))}
            </div>
            <fieldset className="kart-presentation-choice">
              <legend>{lang === 'fr' ? 'Vue de course' : 'Race presentation'}</legend>
              <label><input type="radio" name="kart-render-mode" value="3d" checked={renderMode === '3d'} onChange={() => setRenderMode('3d')} /> 3D</label>
              <label><input type="radio" name="kart-render-mode" value="2d" checked={renderMode === '2d'} onChange={() => setRenderMode('2d')} /> {lang === 'fr' ? '2D · sprites' : '2D · sprites'}</label>
            </fieldset>
          </section>

          <section className="race-preflight-section">
            <span className="race-preflight-label">{lang === 'fr' ? '3. CIRCUIT' : '3. TRACK'}</span>
            <div className="kart-catalog-filters">
              <input type="search" value={trackQuery} onChange={event => { setTrackQuery(event.target.value); setTrackPage(0); }} placeholder={lang === 'fr' ? 'Rechercher un circuit…' : 'Search tracks…'} aria-label={lang === 'fr' ? 'Rechercher un circuit' : 'Search tracks'} />
              <select value={trackUniverse} onChange={event => { setTrackUniverse(event.target.value); setTrackPage(0); }} aria-label={lang === 'fr' ? 'Univers des circuits' : 'Track universe'}>
                <option value="">{lang === 'fr' ? 'Tous les univers' : 'All universes'}</option>
                {trackUniverses.map(universe => <option key={universe}>{universe}</option>)}
              </select>
              {pilotSpec && <button type="button" onClick={() => { setTrackUniverse(pilotSpec.universe); setTrackQuery(''); setTrackPage(0); }}>{lang === 'fr' ? 'Univers du pilote' : 'Driver’s universe'}</button>}
            </div>
            <div className="race-preflight-tracks">
              {visibleTracks.map(trackOption => (
                <button key={trackOption.id} type="button" data-track-id={trackOption.id} className={`race-track-option ${trackOption.id === trackId ? 'active' : ''}`} aria-pressed={trackOption.id === trackId} onClick={() => selectTrack(trackOption.id)} title={trackOption.description?.[lang] || trackOption.description?.fr}>
                  <strong>{trackOption.name[lang] || trackOption.name.fr}</strong>
                  <span>{trackOption.universe || 'Nexus de Convergence'}</span>
                  <small>{lang === 'fr' ? 'Difficulté' : 'Difficulty'} {trackOption.difficulty} · {trackOption.laps} {lang === 'fr' ? 'tours' : 'laps'}</small>
                  {trackOption.fidelityStatus && <small className="kart-track-status">{trackOption.fidelityStatus === 'prototype-unverified'
                    ? (lang === 'fr' ? 'Prototype · décors à détailler' : 'Prototype · scenery in progress')
                    : (lang === 'fr' ? 'Adaptation · fidélité à valider' : 'Adaptation · fidelity under review')}</small>}
                </button>
              ))}
            </div>
            {!visibleTracks.length && <p role="status">{lang === 'fr' ? 'Aucun circuit trouvé.' : 'No tracks found.'}</p>}
            <div className="kart-catalog-pagination" aria-label={lang === 'fr' ? 'Pages des circuits' : 'Track pages'}>
              <button type="button" disabled={trackPage <= 0} onClick={() => setTrackPage(page => Math.max(0, page - 1))}>{lang === 'fr' ? 'Précédents' : 'Previous'}</button>
              <span>{Math.min(trackPage + 1, trackPages)} / {trackPages} · {filteredTracks.length}</span>
              <button type="button" disabled={trackPage >= trackPages - 1} onClick={() => setTrackPage(page => Math.min(trackPages - 1, page + 1))}>{lang === 'fr' ? 'Suivants' : 'Next'}</button>
            </div>
          </section>
        </div>

        <div className="race-preflight-launch">
          <div>
            <span>{lang === 'fr' ? 'Pilote' : 'Pilot'}: <strong>{pilotSpec?.name || '--'}</strong></span>
            <span>{lang === 'fr' ? 'Kart' : 'Kart'}: <strong>{selectedKartName}</strong></span>
            <span>{lang === 'fr' ? 'Circuit' : 'Track'}: <strong>{track ? (track.name[lang] || track.name.fr) : '--'}</strong></span>
          </div>
          <label className="race-assist-toggle" title={lang === 'fr' ? 'Maintient automatiquement l acceleration; le frein et les virages restent manuels.' : 'Automatically holds acceleration; braking and steering stay manual.'}>
            <input type="checkbox" checked={autoAccelerate} onChange={event => setAutoAccelerate(event.target.checked)} />
            <span>{lang === 'fr' ? 'ACCELERATION ASSISTEE' : 'ASSISTED ACCELERATION'}</span>
          </label>
          <button type="button" className="btn-retro" disabled={!canLaunch} onClick={startRace} title={lang === 'fr' ? 'Demarre apres avoir choisi pilote et circuit.' : 'Start after choosing a pilot and track.'}>
            {lang === 'fr' ? 'VALIDER LA GRILLE' : 'CONFIRM GRID'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`race-mode-shell ${renderMode === '3d' ? 'race-world-3d' : ''} ${activeHudTheme ? 'game-hud-themed-interface' : ''}`}>
      <GameHudThemeLayer theme={activeHudTheme} mode="kart" />
      {raceSystemPanel}
      <div ref={worldHudRef} className="race-world-hud" inert={Boolean(summary || runtimeError)}>
        <div><strong>{track.name[lang] || track.name.fr}</strong><small>{pilotSpec?.name} · {selectedKartName} · {pilotName}</small></div>
        <button type="button" className="btn-retro" onClick={() => setRaceMenuOpen(true)} aria-haspopup="dialog">{lang === 'fr' ? 'GARAGE / COMMANDES' : 'GARAGE / CONTROLS'}</button>
        {!dedicatedSession && onPauseRequest && <button type="button" className="btn-retro" onClick={onPauseRequest}>PAUSE</button>}
        <div className="race-telemetry" role="region" aria-label={lang === 'fr' ? 'Telemetrie de course' : 'Race telemetry'}>
          <div className="race-stat-grid">
            <div><span>{lang === 'fr' ? 'Position' : 'Position'}</span><strong>{snapshot.rank}/4</strong></div>
            <div><span>{lang === 'fr' ? 'Tour' : 'Lap'}</span><strong>{snapshot.lap}/{track.laps}</strong></div>
            <div><span>{lang === 'fr' ? 'Vitesse' : 'Speed'}</span><strong>{snapshot.speed}</strong></div>
            <div><span>{lang === 'fr' ? 'Temps' : 'Time'}</span><strong>{formatRaceTime(snapshot.time)}</strong></div>
          </div>
          <div className="race-objective-card">
            <span>{lang === 'fr' ? 'Objectif A.R.C.A.' : 'A.R.C.A. objective'}</span>
            <strong>{snapshot.objective || (track.objective?.type || 'podium')}</strong>
            <small className={snapshot.trackFactor > 0.34 ? 'race-anchor-ok' : 'race-anchor-alert'}>
              {lang === 'fr' ? 'Ancrage piste' : 'Track lock'}: {Math.round(snapshot.trackFactor * 100)}%
            </small>
          </div>
        </div>
      </div>

      <div className="race-mode-grid">
        <div className="race-canvas-panel">
          {renderMode === '3d' && <canvas key={raceNonce} ref={worldCanvasRef} width="960" height="540" className="race-webgl-canvas" aria-hidden="true" />}
          <canvas
            ref={canvasRef}
            width="960"
            height="540"
            className="race-mode-canvas"
            tabIndex={summary || runtimeError ? -1 : 0}
            aria-label={lang === 'fr' ? 'Circuit kart jouable A.R.C.A.' : 'Playable A.R.C.A. kart circuit'}
            data-race-state={snapshot.raceState}
            data-speed={snapshot.speed}
            data-lap={snapshot.lap}
            data-track-factor={snapshot.trackFactor.toFixed(2)}
            data-render-mode={renderMode}
            data-pilot-id={pilotSpec?.heroId}
          />
          <p className="gameplay-live-status" role="status" aria-live="polite">
            {lang === 'fr'
              ? `Course ${snapshot.raceState}. Position ${snapshot.rank} sur 4. Tour ${snapshot.lap} sur ${track.laps}.`
              : `Race ${snapshot.raceState}. Position ${snapshot.rank} of 4. Lap ${snapshot.lap} of ${track.laps}.`}
          </p>
          {snapshot.missingDrivers > 0 && <p className="kart-visual-status" role="status">{lang === 'fr' ? 'Une image de pilote n’a pas pu être chargée.' : 'A driver image could not be loaded.'}</p>}
          {runtimeError && !summary && <div className="race-result-banner" role="alert" data-race-runtime-error>
            <strong>{lang === 'fr' ? 'COURSE INTERROMPUE' : 'RACE INTERRUPTED'}</strong>
            <span>{lang === 'fr' ? 'Le rendu s’est arrêté. Recommence ou choisis la vue 2D depuis la grille. Aucun nouveau résultat n’a été attribué.' : 'Rendering stopped. Restart or choose the 2D view on the grid. No new result has been awarded.'}</span>
            <button type="button" autoFocus className="btn-retro" onClick={resetRace}>{lang === 'fr' ? 'RECOMMENCER LA COURSE' : 'RESTART RACE'}</button>
            <button type="button" className="btn-retro" onClick={returnToGrid}>{lang === 'fr' ? 'RETOUR À LA GRILLE' : 'BACK TO GRID'}</button>
          </div>}
          {summary && (
            <div className="race-result-banner" role="region" aria-label={lang === 'fr' ? 'Bilan de course' : 'Race results'}>
              <strong>{lang === 'fr' ? 'COURSE STABILISEE' : 'RACE STABILIZED'} // {summary.grade}</strong>
              <span>
                {lang === 'fr'
                  ? `Position ${summary.rank}/4 - Temps ${formatRaceTime(summary.time)} - Objectif ${summary.objectiveComplete ? 'OK' : 'rate'}`
                  : `Position ${summary.rank}/4 - Time ${formatRaceTime(summary.time)} - Objective ${summary.objectiveComplete ? 'OK' : 'failed'}`}
              </span>
              <span>
                +{summary.rewards?.garageParts || 0} parts / +{summary.rewards?.fragments || 0} fragments / +{summary.rewards?.xp || 0} XP
              </span>
              <button type="button" autoFocus className="btn-retro" onClick={resetRace}>
                {lang === 'fr' ? 'RELANCER' : 'RESTART'}
              </button>
              <button type="button" className="btn-retro" onClick={returnToGrid}>
                {lang === 'fr' ? 'CHANGER DE CIRCUIT' : 'CHANGE TRACK'}
              </button>
            </div>
          )}
        </div>

        <aside className="race-side-panel" inert={Boolean(summary || runtimeError)}>
          <div className="race-hud-dock">
            <div className="race-cache-card">
              <span>{lang === 'fr' ? 'Cache active' : 'Active cache'}</span>
              <strong>{snapshot.item || (lang === 'fr' ? 'vide' : 'empty')}</strong>
              <img className="race-cache-strip" src={RACE_ASSETS.kartItems} alt={lang === 'fr' ? 'Plaquette objets kart de Mirelle' : 'Mirelle kart item sheet'} />
              <button
                type="button"
                className="btn-retro"
                onClick={triggerItem}
                disabled={!snapshot.item || snapshot.raceState !== 'running'}
              >
                {snapshot.item ? (lang === 'fr' ? 'UTILISER' : 'USE') : (lang === 'fr' ? 'CACHE VIDE' : 'EMPTY CACHE')}
              </button>
            </div>
            <div ref={touchControlsRef} className="race-touch-controls">
              <button type="button" className="btn-retro" onClick={event => { if (event.detail === 0) pulseVirtualKey('up'); }} {...touchControlProps('up')}>ACC</button>
              <button type="button" className="btn-retro" onClick={event => { if (event.detail === 0) pulseVirtualKey('left'); }} {...touchControlProps('left')}>{lang === 'fr' ? 'GAUCHE' : 'LEFT'}</button>
              <button type="button" className="btn-retro" onClick={event => { if (event.detail === 0) pulseVirtualKey('right'); }} {...touchControlProps('right')}>{lang === 'fr' ? 'DROITE' : 'RIGHT'}</button>
              <button type="button" className="btn-retro" onClick={event => { if (event.detail === 0) pulseVirtualKey('space'); }} {...touchControlProps('space')}>DRIFT</button>
              <button type="button" className="btn-retro" onClick={event => { if (event.detail === 0) pulseVirtualKey('down'); }} {...touchControlProps('down')}>{lang === 'fr' ? 'FREIN' : 'BRAKE'}</button>
              <button type="button" className="btn-retro" onClick={recoverPlayer}>{lang === 'fr' ? 'REANCRER' : 'RECOVER'}</button>
              {summary && <button type="button" className="btn-retro" onClick={resetRace}>{lang === 'fr' ? 'RELANCER' : 'RESTART'}</button>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

