import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import RegulationImagePreview from '../../src/components/RegulationImagePreview.jsx';
import PortalLab from '../../src/components/admin/PortalLab.jsx';
import ImmersiveDrawer from '../../src/components/ImmersiveDrawer.jsx';
import MosaicGuidePanel from '../../src/components/MosaicGuidePanel.jsx';
import GameDisplaySettings, { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import '../../src/index.css';
import '../../src/components/MosaicCityHub.css';
import '../../src/components/HubImmersion.css';

const parameters = new URLSearchParams(location.search);
const lang = parameters.get('lang') === 'en' ? 'en' : 'fr';
const fr = lang === 'fr';
const guideTitle = fr ? 'Rejoins une signature' : 'Reach a signature';
const guideBody = fr ? 'Approche une personne ou une borne, puis utilise INTERAGIR. Le terminal conserve toutes les instructions pendant que tu explores la Cité.' : 'Approach a person or terminal, then use INTERACT. The terminal keeps the complete instructions while you explore the City.';
const qa = { pauses: 0, previewsClosed: 0, labsClosed: 0, terminalsClosed: 0, inputEvents: [] };
const preview = { title: fr ? 'Aperçu de contrôle' : 'Control preview', src: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="#13354b"/><circle cx="160" cy="120" r="70" fill="#72ded4"/></svg>') };
const galleryPreview = {
  title: fr ? 'Archives de reconnaissance — Les expéditions de la Cité-Mosaïque' : 'Reconnaissance archives — The Mosaic City expeditions',
  subtitle: fr ? 'Consulte chaque planche du dossier. Toutes les légendes restent lisibles lorsque le texte est agrandi ; le contenu défile dans cette fenêtre.' : 'Inspect every sheet in the dossier. All captions remain readable with enlarged text; the content scrolls inside this window.',
  sheets: Array.from({ length: 9 }, (_, index) => ({ src: preview.src, id: `control-sheet-${index}`, label: `${fr ? 'Planche de reconnaissance' : 'Reconnaissance sheet'} ${index + 1}` }))
};
const longUniverse = fr ? 'Trame de contrôle — Archives des expéditions de la Cité-Mosaïque' : 'Control Thread — Archives of the Mosaic City expeditions';
const labUniverses = Object.freeze([longUniverse]);

export function Menus() {
  const [terminal, setTerminal] = useState(false);
  const [image, setImage] = useState(false);
  const [lab, setLab] = useState(false);
  qa.closeAll = () => flushSync(() => { setImage(false); setLab(false); setTerminal(false); });
  return <main style={{ padding: 24 }}>
    <h1>{fr ? 'Contrats des menus' : 'Menu contracts'}</h1>
    <button type="button" data-testid="open-terminal" onClick={() => setTerminal(true)}>{fr ? 'Ouvrir le terminal' : 'Open terminal'}</button>
    <button type="button" data-testid="background-action">{fr ? 'Action de fond' : 'Background action'}</button>
    <ImmersiveDrawer open={terminal} title={fr ? 'Terminal de contrôle' : 'Control terminal'} lang={lang} onClose={() => { qa.terminalsClosed += 1; setTerminal(false); }}>
      <button type="button" data-testid="open-preview" onClick={() => setImage(true)}>{fr ? 'Ouvrir la prévisualisation' : 'Open preview'}</button>
      <button type="button" data-testid="open-gallery" onClick={() => setImage('gallery')}>{fr ? 'Ouvrir le dossier illustré' : 'Open illustrated dossier'}</button>
      <button type="button" data-testid="open-lab" onClick={() => setLab(true)}>{fr ? 'Ouvrir le laboratoire' : 'Open laboratory'}</button>
      <GameDisplaySettings lang={lang} />
    </ImmersiveDrawer>
    <RegulationImagePreview preview={image === 'gallery' ? galleryPreview : image ? preview : null} lang={lang} onClose={() => { qa.previewsClosed += 1; setImage(false); }} />
    <PortalLab isOpen={lab} initialUniverse="Nexus de Convergence" universes={labUniverses} lang={lang} onClose={() => { qa.labsClosed += 1; setLab(false); }} />
  </main>;
}

export function Guide() {
  const [terminal, setTerminal] = useState(false);
  useEffect(() => {
    const observe = event => qa.inputEvents.push({ type: event.type, key: event.key.toLowerCase() });
    window.addEventListener('keydown', observe);
    window.addEventListener('keyup', observe);
    return () => { window.removeEventListener('keydown', observe); window.removeEventListener('keyup', observe); };
  }, []);
  return <div className="hub-screen is-dedicated-game">
    <div className="hub-tab-workspace"><div className="mosaic-rpg-panel">
      <div className="mosaic-world-hud"><div className="mosaic-world-column"><div className="mosaic-location"><span>CITÉ-MOSAÏQUE</span><strong>{fr ? 'Atrium de convergence' : 'Convergence Atrium'}</strong><small>{fr ? 'Ancre locale' : 'Local anchor'}</small></div>
        <MosaicGuidePanel lang={lang} title={guideTitle} body={guideBody} step="interact" onPause={() => { qa.pauses += 1; }} onOpenDetails={() => setTerminal(true)} />
      </div><button type="button" className="btn-retro" onClick={() => setTerminal(true)}>TERMINAL · JOURNAL</button></div>
      <div className="mosaic-rpg-stage">
        <div data-testid="world-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 42, height: 42, background: '#ffd96e' }} />
        <div className="mosaic-mobile-pad mosaic-world-controls">{['←', '↑', '↓', '→', fr ? 'INTERAGIR' : 'INTERACT'].map(label => <button type="button" key={label}>{label}</button>)}</div>
      </div>
    </div></div>
    <ImmersiveDrawer open={terminal} title={fr ? 'Guide complet de la Cité' : 'Complete City guide'} lang={lang} onClose={() => setTerminal(false)}><h3>{guideTitle}</h3><p>{guideBody}</p></ImmersiveDrawer>
  </div>;
}

document.body.style.margin = '0';
window.__menuQA = qa;
createRoot(document.getElementById('root')).render(<React.StrictMode><GameDisplayPreferencesSync />{parameters.get('surface') === 'guide' ? <Guide /> : <Menus />}</React.StrictMode>);
