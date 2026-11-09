// Actual portal, dossier, pagination and preferences. The parent save is local
// to this fixture; failed/deferred rotation persistence is deliberate.
import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import PortalScreen from '../../src/components/PortalScreen.jsx';
import PortalBoosterDossier from '../../src/components/PortalBoosterDossier.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { denseBanner, denseCandidates, denseDetail, denseKindLabels, denseKindOrder, denseOwned, denseRarities } from './portalDenseCatalogData.mjs';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const empty = Object.freeze([]);
const disabledAssets = Object.freeze({});
const completedStages = Object.freeze(['qa-stage-1', 'qa-stage-2', 'qa-stage-3', 'qa-stage-4', 'qa-stage-5', 'qa-stage-6']);
const initialStats = Object.freeze({ totalPulls: 17, duplicateStreak: 3, history: [{ id: 'qa-preserved-opening' }] });
const initialCollection = Object.freeze({ cards: { 'qa-absent-dlc-card': { copies: 2, favorite: true, seen: true } }, profileTitles: ['qa-absent-dlc-title'] });
const qa = { state: null, rotationRequests: [], selected: [], closed: 0, backs: 0, candidates: denseCandidates };
window.__portalCatalogQA = qa;

export function Artwork() {
  return <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true"><rect width="100" height="100" fill="#13323b" /><path d="M50 10 90 50 50 90 10 50Z" fill="#90e3cf" /></svg>;
}

export function Fixture() {
  const [shards, setShards] = useState(1234);
  const [stats, setStats] = useState(initialStats);
  const [collection, setCollection] = useState(initialCollection);
  const [heroes, setHeroes] = useState(empty);
  const [inventory, setInventory] = useState(empty);
  const [dossier, setDossier] = useState(false);
  useEffect(() => { qa.state = { gold: 5000, breachShards: shards, portalStats: stats, portalCollection: collection, unlockedHeroes: heroes, inventory }; }, [shards, stats, collection, heroes, inventory]);
  return <>
    <GameDisplayPreferencesSync />
    <GameSystemMenu lang={lang} />
    {params.get('surface') === 'dossier'
      ? <main style={{ padding: 48 }}><h1>{lang === 'fr' ? 'Dossier de contrôle' : 'Verification dossier'}</h1><button type="button" data-testid="open-dense-dossier" onClick={() => setDossier(true)}>{lang === 'fr' ? 'OUVRIR LE DOSSIER' : 'OPEN DOSSIER'}</button></main>
      : <PortalScreen lang={lang} gold={5000} breachShards={shards} setBreachShards={setShards} portalStats={stats} setPortalStats={setStats}
        portalCollection={collection} setPortalCollection={setCollection} unlockedHeroes={heroes} setUnlockedHeroes={setHeroes}
        inventory={inventory} setInventory={setInventory} hiddenUniverses={empty} disabledAssets={disabledAssets} completedStages={completedStages}
        onRerollRotation={request => new Promise(resolve => { qa.rotationRequests.push(structuredClone(request)); qa.finishRotation = resolve; })}
        onBack={() => { qa.backs += 1; }} />}
    {dossier && <PortalBoosterDossier banner={denseBanner} candidates={denseCandidates} lang={lang} available selected={false}
      duplicateStreak={3} pityLimit={6} isCandidateOwned={denseOwned} kindLabels={denseKindLabels} kindOrder={denseKindOrder} rarities={denseRarities}
      Artwork={Artwork} getRewardDetail={denseDetail} onSelect={id => { qa.selected.push(id); setDossier(false); }}
      onClose={() => { qa.closed += 1; setDossier(false); }} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
