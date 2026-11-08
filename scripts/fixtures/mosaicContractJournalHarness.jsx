import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import '../../src/components/HubImmersion.css';
import MosaicCharacterMissions from '../../src/components/MosaicCharacterMissions.jsx';
import ImmersiveDrawer from '../../src/components/ImmersiveDrawer.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { startMosaicCharacterMission, resolveMosaicCharacterMission } from '../../src/game/mosaicCharacterMissions.js';
import { journalCases, journalHeroes, journalProgress, prerequisiteCase, followupCase } from './mosaicContractJournalData.mjs';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const qa = { state: null, calls: [], closed: 0, source: journalCases, prerequisiteId: prerequisiteCase.id, followupId: followupCase.id };
window.__contractJournalQA = qa;

export function Fixture() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(() => journalProgress({ prerequisiteComplete: params.get('prerequisite') === 'complete' }));
  useEffect(() => { qa.state = { open, progress }; }, [open, progress]);
  return <>
    <GameDisplayPreferencesSync /><GameSystemMenu lang={lang} />
    <main style={{ padding: 48 }}><h1>{lang === 'fr' ? 'Recette du journal de Cité' : 'City journal verification'}</h1>
      <p>{lang === 'fr' ? 'Catalogue dense synthétique, checkpoints préparés et deux vrais contrats d’Ancre. Aucun compte ou déplacement en ville.' : 'Dense synthetic catalogue, prepared checkpoints and two actual Anchor contracts. No account or City movement.'}</p>
      <button type="button" data-testid="open-contract-journal" onClick={() => setOpen(true)}>{lang === 'fr' ? 'Ouvrir le journal' : 'Open journal'}</button>
    </main>
    <ImmersiveDrawer open={open} onClose={() => { qa.closed += 1; setOpen(false); }} lang={lang} className="mosaic-terminal-drawer"
      title={lang === 'fr' ? 'Terminal de poche A.R.C.A.' : 'A.R.C.A. pocket terminal'} scrollLabel={lang === 'fr' ? 'Journal et services de la Cité' : 'City journal and services'}>
      <div className="nexus-play-copy"><MosaicCharacterMissions missions={journalCases} heroes={journalHeroes} lang={lang} progress={progress}
        onAccept={id => { qa.calls.push({ type: 'accept', id }); const result = startMosaicCharacterMission(progress, journalCases.find(item => item.id === id), lang); if (result.changed) setProgress(result.progress); return result; }}
        onApproach={id => qa.calls.push({ type: 'approach', id })}
        onResolve={(id, choice) => { qa.calls.push({ type: 'resolve', id, choice }); const result = resolveMosaicCharacterMission(progress, journalCases.find(item => item.id === id), choice, lang); if (result.changed) setProgress(result.progress); return result; }}
      /></div>
    </ImmersiveDrawer>
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
