import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { getDlcInstallationSummary } from '../../src/game/dlcInstallation.js';
import { createExtinctionRelayOperation } from '../../src/game/extinctionRelayOperation.js';
import { buildMosaicReconnaissanceDossier, normalizeMosaicReconnaissance, startMosaicReconnaissance } from '../../src/game/mosaicReconnaissance.js';
import '../../src/index.css';
const lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'fr';
window.__installation=getDlcInstallationSummary();
window.__newFieldContracts=()=>({
  relay:createExtinctionRelayOperation({enabled:true,runId:'browser-contract'}),
  recon:startMosaicReconnaissance(normalizeMosaicReconnaissance(),buildMosaicReconnaissanceDossier({
    district:{id:'browser',universe:'Nexus'},residents:[{id:'owned',universe:'Nexus'}],
    exhibits:[{id:'one',universe:'Nexus'},{id:'two',universe:'Nexus'}],anchor:{id:'anchor',action:'anchor',universe:'Nexus'}
  })).progress
});
export function Fixture(){
  const [value,setValue]=useState('');
  return <><GameDisplayPreferencesSync /><main style={{padding:24}}><h1>Multiverse — Système</h1>
    <button type="button">Action de fond</button></main>
    <GameSystemMenu lang={lang}><label>Draft account field<input data-testid="retained-field" value={value} onChange={event=>setValue(event.target.value)} /></label></GameSystemMenu></>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
