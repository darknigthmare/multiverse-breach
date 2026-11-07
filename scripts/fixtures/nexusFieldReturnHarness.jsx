// The real Hub owns navigation, pause, reward guards and progression updates.
// Test preparation is limited to ownership and the initial City entry point.
import React, { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import HubScreen from '../../src/components/HubScreen.jsx';
import '../../src/index.css';
import './nexusFieldReturnHarness.css';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
const initialOwned = params.get('owned') === 'none' ? [] : ['player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova'];
const playerProfile = { name: 'QA' };
const completedStages = [];
const audioSettings = { muted: true, musicVolume: 0, sfxVolume: 0 };
const audit = { saves: [], reconnaissanceSaves: [], reports: [], services: [], media: [] };
window.__sceneQA = audit;

const NativeImage = window.Image;
window.Image = class extends NativeImage {
  set src(value) {
    const item = { src: value, loaded: false, failed: false }; audit.media.push(item);
    this.addEventListener('load', () => { item.loaded = this.naturalWidth > 0; }, { once: true });
    this.addEventListener('error', () => { item.failed = true; }, { once: true });
    super.src = value;
  }
  get src() { return super.src; }
};

const sceneRef = predicate => {
  const city = document.querySelector('.mosaic-rpg-panel');
  const node = city || document.querySelector('.extinction-panel');
  const key = node && Object.keys(node).find(name => name.startsWith('__reactFiber$'));
  let fiber = node?.[key];
  while (fiber && fiber.type?.name !== (city ? 'MosaicCityHub' : 'ExtinctionRoyale')) fiber = fiber.return;
  let hook = fiber?.memoizedState;
  while (hook) {
    const value = hook.memoizedState?.current;
    if (value && predicate(value)) return value;
    hook = hook.next;
  }
  return null;
};
audit.state = () => sceneRef(value => value.player && value.camera && value.npcs || value.phase && value.enemies && 'px' in value);
audit.hudLayout = () => sceneRef(value => value.fpsRadar && value.cityMinimap && Number.isFinite(value.unitsPerCssPixel));
audit.snapshot = () => {
  const state = audit.state();
  if (!state) return null;
  return state.player ? { t: state.t, player: { ...state.player }, camera: { ...state.camera },
    keys: { ...state.keys }, destination: state.destination,
    npcs: state.npcs.map(npc => ({ id: npc.hero.id, x: npc.x, y: npc.y })) }
    : { phase: state.phase, runId: state.runId, t: state.t, hp: state.hp, ammo: state.ammo,
      px: state.px, py: state.py, angle: state.angle, keys: { ...state.moveKeys }, result: state.result };
};
audit.prepareReplay = seed => {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff || audit.state()?.phase !== 'ready') {
    throw new Error('Seed only a ready FPS run with a uint32');
  }
  let value = seed, calls = 0;
  Math.random = () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ value >>> 15, value | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    calls++;
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
  audit.replayRandom = () => ({ algorithm: 'mulberry32-v1', seed, calls, state: value });
};

const initialModel = {
  gold: 0, breachShards: 0, eventTokens: 0, unlockedHeroes: initialOwned,
  heroLevels: {}, activeTeam: initialOwned.slice(0, 3), inventory: [], equippedGear: {},
  equippedEventItems: {}, heroTalents: {}, heroSkins: {}, activityProgress: {}, portalCollection: {},
  publicProfile: {}, hiddenUniverses: [], disabledAssets: {}
};

export function Harness() {
  const [model, setModel] = useState(initialModel);
  const [mounted, setMounted] = useState(true);
  const [revision, setRevision] = useState(0);
  const lastLocation = useRef(null), lastReconnaissance = useRef(null);
  const observedReports = useRef(new Set());
  const setters = useMemo(() => Object.fromEntries(Object.keys(initialModel).map(key => [
    `set${key[0].toUpperCase()}${key.slice(1)}`,
    update => setModel(previous => ({ ...previous, [key]: typeof update === 'function' ? update(previous[key]) : update }))
  ])), []);
  audit.activityProgress = model.activityProgress;
  audit.balances = { gold: model.gold, shards: model.breachShards };
  audit.reconnaissance = model.activityProgress.mosaicReconnaissance || null;
  audit.saved = model.activityProgress.mosaicLocation || null;
  audit.mounted = mounted; audit.revision = revision;
  audit.remount = () => setMounted(true);
  audit.rerender = () => setRevision(value => value + 1);
  audit.setLocation = location => {
    if (mounted || Object.keys(model.activityProgress.mosaicReconnaissance?.dossiers || {}).length) {
      throw new Error('Prepare the City entry only while unmounted and before accepting a report');
    }
    setters.setActivityProgress(previous => ({ ...previous, mosaicLocation: location }));
  };
  audit.setOwned = ids => {
    if (audit.state()?.phase === 'running') throw new Error('Do not change ownership during a run');
    setters.setUnlockedHeroes(ids);
  };
  useEffect(() => {
    const saved = model.activityProgress.mosaicLocation;
    if (saved && JSON.stringify(saved) !== lastLocation.current) {
      lastLocation.current = JSON.stringify(saved); audit.saves.push(structuredClone(saved));
    }
    const reconnaissance = model.activityProgress.mosaicReconnaissance;
    if (reconnaissance && JSON.stringify(reconnaissance) !== lastReconnaissance.current) {
      lastReconnaissance.current = JSON.stringify(reconnaissance); audit.reconnaissanceSaves.push(structuredClone(reconnaissance));
    }
    const report = model.activityProgress.extinctionCareer?.lastReport;
    if (report && !observedReports.current.has(report.runId)) {
      observedReports.current.add(report.runId); audit.reports.push(structuredClone(report));
    }
  }, [model.activityProgress]);
  return <>
    <aside className="nexus-field-qa" aria-label="Fixture controls">
      <button id="qa-unmount" type="button" onClick={() => setMounted(false)}>Unmount</button>
      <button id="qa-render" type="button" onClick={() => setRevision(value => value + 1)}>Render {revision}</button>
    </aside>
    {mounted && <HubScreen lang={lang} initialTab="mosaicHub" {...model} {...setters}
      playerProfile={playerProfile} completedStages={completedStages} audioSettings={audioSettings}
      onLaunchStage={() => { throw new Error('This fixture must not launch campaign stages'); }}
      onGoToPortal={() => { throw new Error('This fixture must remain in the City/FPS loop'); }} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
