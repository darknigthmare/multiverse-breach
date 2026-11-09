import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import UniverseArchiveReader from '../../src/components/UniverseArchiveReader.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { archiveUniverse, emptyUniverse, denseArchive, emptyArchive, archiveProgress, archivePresentation } from './universeArchiveData.mjs';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const qa = { state: null, closed: 0 };
window.__archiveQA = qa;
export function Fixture() {
  const [open, setOpen] = useState(false);
  const [universe, setUniverse] = useState(archiveUniverse);
  const [section, setSection] = useState('signatures');
  const archive = universe === archiveUniverse ? denseArchive : emptyArchive;
  useEffect(() => { qa.state = { universe, section, open, progress: archiveProgress, source: denseArchive }; }, [universe, section, open]);
  return <>
    <GameDisplayPreferencesSync />
    <GameSystemMenu lang={lang} />
    <main style={{ padding: 48 }}>
      <h1>{lang === 'fr' ? 'Vérification des dossiers univers' : 'Universe dossier verification'}</h1>
      <p>{lang === 'fr' ? 'Données et illustrations synthétiques — cette scène ne représente pas du contenu livré.' : 'Synthetic records and illustrations — this scene does not represent delivered content.'}</p>
      <button data-testid="open-archive" type="button" onClick={() => { setUniverse(archiveUniverse); setSection('signatures'); setOpen(true); }}>{lang === 'fr' ? 'Ouvrir le dossier' : 'Open dossier'}</button>
    </main>
    {open && <UniverseArchiveReader archive={archive} lang={lang} section={section} onSectionChange={setSection} onClose={() => { qa.closed += 1; setOpen(false); }} universes={[archiveUniverse, emptyUniverse]} onUniverseChange={setUniverse} {...archiveProgress} presentation={{ ...archivePresentation(lang), isOriginal: archive.lore.isOriginal }} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
