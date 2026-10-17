// Test-only Vite page. Not an application entry point or a production debug hook.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../src/game/engineRpg.js';
import '../../src/index.css';

const audit = { engine: null, results: [], updates: 0 };
window.__rpgAudit = audit;
const original = EngineRpg.prototype.update;
EngineRpg.prototype.update = function (...args) {
  audit.engine = this;
  audit.updates++;
  return original.apply(this, args);
};
const withEvent = new URLSearchParams(location.search).has('events');
const team = ['player_anchor', 'arca_mirelle', 'arca_bastion'];
const enemy = { name: 'QA target', id: 'qa-target', hp: 500, atk: 5, def: 0, spd: 1, color: '#888888', universe: 'Nexus de Convergence' };
const stage = { id: 'qa-rpg-lifecycle', name: 'RPG synthetic fixture', universe: 'Nexus de Convergence', mode: 'RPG', disableItems: !withEvent,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: [enemy], monsters: [enemy], bosses: [], worldBoss: null } } };
export function Harness() {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(true);
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
  return <>
    <header style={{ padding: 12 }}>
      <span>QA: synthetic RPG fixture, production controls and renderer. </span>
      <button id="qa-pause" type="button" onClick={() => setPaused(value => !value)}>QA pause</button>
      <button type="button" onClick={() => setMounted(false)}>QA unmount</button>
    </header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA Anchor' }} activeTeam={team} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={withEvent ? { arca_mirelle: 'evt_re_cure' } : {}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      sessionPaused={paused} onBattleEnd={(...result) => audit.results.push(result)} onSessionComplete={(...result) => audit.results.push(result)} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
