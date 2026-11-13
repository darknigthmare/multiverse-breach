// Real lobby and catalogue/rule functions. Only the two battle children and the
// sprite drawing imported by the lobby are replaced at build time. This fixture
// verifies preparation and the handoff contract, not combat or artwork fidelity.
import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CustomBattleMode from '../../src/components/CustomBattleMode.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { buildCustomEnemyCatalog } from '../../src/game/customBattle.js';
import '../../src/index.css';
import './customBattleLobbyHarness.css';

const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
const heroes = Object.freeze(Array.from({ length: 32 }, (_, index) => ({
  id: `qa-lobby-${String(index + 1).padStart(2, '0')}`,
  name: index === 30 ? 'Éclaireuse aux nombreux titres du quartier des Archives' : `Signature ${index + 1}`,
  universe: 'Nexus de Convergence', primaryColor: '#62e2cf', secondaryColor: '#ffe48c', weaponType: 'melee',
  stats: { hp: 160, atk: 15, def: 8, spd: 8 }
})));
const unlockedHeroes = heroes.map(hero => hero.id);
const activeTeam = [heroes[0].id];
const archive = {
  id: 'qa-archive', universe: 'Nexus de Convergence', name: { fr: 'Arène de vérification', en: 'Verification arena' },
  image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="360" height="220"%3E%3Crect width="360" height="220" fill="%230d343a"/%3E%3C/svg%3E'
};
window.__customLobbyQA = { starts: 0, reports: [], catalog: buildCustomEnemyCatalog().map(({ id, name, universe }) => ({ id, name, universe })), heroes };

export function Fixture() {
  const [collection, setCollection] = useState({ archives: [archive], customBattlePreset: { playerTeamIds: activeTeam } });
  const [exitRequest, setExitRequest] = useState(0);
  const [mounted, setMounted] = useState(true);
  useEffect(() => { window.__customLobbyQA.collection = collection; }, [collection]);
  return <>
    <GameDisplayPreferencesSync />
    <GameSystemMenu lang={lang} />
    <main className="custom-lobby-fixture">
      {mounted && <CustomBattleMode lang={lang} heroes={heroes} unlockedHeroes={unlockedHeroes} activeTeam={activeTeam}
        portalCollection={collection} setPortalCollection={setCollection} dedicatedSession sessionExitRequest={exitRequest}
        onSessionStart={() => { window.__customLobbyQA.starts += 1; }}
        onSessionEnd={report => { window.__customLobbyQA.reports.push(report); }} />}
      <details className="custom-lobby-qa-controls"><summary>QA controls</summary>
        <button type="button" onClick={() => setExitRequest(value => value + 1)}>Request session exit</button>
        <button type="button" onClick={() => setMounted(value => !value)}>{mounted ? 'Unmount lobby' : 'Remount lobby'}</button>
      </details>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
