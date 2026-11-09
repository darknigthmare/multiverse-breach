// Isolated QA: real React view and engine; seeded career, no account or save.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RaceMode from '../../src/components/RaceMode.jsx';
import { EngineRace } from '../../src/game/engineRace.js';
import '../../src/index.css';
import './combatHarness.css';
const lang = globalThis.__raceQaLang || (new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr');
const audit = { engine: null, engines: [], exits: [], starts: 0, resets: 0, revision: 0, collection: null };
window.__raceLifecycle = audit;
const reset = EngineRace.prototype.reset;
EngineRace.prototype.reset = function (...args) {
  if (!audit.engines.includes(this)) audit.engines.push(this);
  audit.engine = this;
  audit.resets += 1;
  return reset.apply(this, args);
};
audit.snapshot = () => {
  const e = audit.engine;
  return { engine: audit.engines.indexOf(e), resets: audit.resets, time: e.time,
    lap: e.player.lap, x: e.player.x, y: e.player.y, keys: { ...e.keys },
    upgrades: { ...e.garageUpgrades }, reported: e.finishReported };
};
audit.finish = () => {
  const e = audit.engine;
  e.countdown = 0;
  e.raceState = 'running';
  e.player.finished = true;
  e.player.finishTime = Math.max(1, e.time);
  e.update(1 / 60);
};
export default function Harness() {
  const [collection, setCollection] = useState({ karts: [], raceCareer: { garageParts: 300 } });
  const [paused, setPaused] = useState(false);
  const [dedicated, setDedicated] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [revision, setRevision] = useState(0);
  audit.collection = collection;
  audit.revision = revision;
  return <>
    <header className="combat-qa-toolbar">
      <p>Race QA: seeded career, real controls, no progression writes.</p>
      <button id="qa-render" onClick={() => setRevision(v => v + 1)}>Render</button>
      <button id="qa-pause" onClick={() => setPaused(v => !v)}>Pause</button>
      <button id="qa-unmount" onClick={() => setMounted(false)}>Unmount</button>
    </header>
    <main className={`hub-screen ${dedicated ? 'is-dedicated-game' : ''}`} style={{ paddingTop: 60 }}>
      {mounted && <RaceMode lang={lang} playerProfile={{ name: 'QA' }}
        portalCollection={{ ...collection }} setPortalCollection={updater => setCollection(updater)}
        hiddenUniverses={[]} sessionPaused={paused} dedicatedSession={dedicated}
        onSessionStart={() => { audit.starts++; setDedicated(true); }}
        onSessionEnd={report => { audit.exits.push(report); if (report.reason !== 'completed') setDedicated(false); }} />}
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
