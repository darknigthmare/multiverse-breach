// Isolated QA entry, never imported by the production application.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CardDetailModal from '../../src/components/collection/CardDetailModal.jsx';
import PortalBoosterDossier from '../../src/components/PortalBoosterDossier.jsx';
import { HEROES_DB } from '../../src/game/heroes.js';
import { createCardDefinitionFromPortalCandidate } from '../../src/game/cards/cardCatalog.js';
import { getSignatureCodex } from '../../src/game/signatureCodex.js';
import '../../src/index.css';
import '../../src/components/collection/collection.css';
const query = new URLSearchParams(location.search);
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const view = query.get('view') === 'booster' ? 'booster' : 'card';
const hero = HEROES_DB.find(h => h.id === query.get('actor')) || HEROES_DB.find(h => h.id === 'cloud_ff7');
const codex = getSignatureCodex(hero);
const candidate = { id: `hero:${hero.id}`, rewardId: hero.id, kind: 'hero', universe: hero.universe,
  rarity: { id: 'rare', weight: 10 }, name: { fr: hero.name, en: hero.name },
  lore: { fr: `Biographie conservée. ${codex?.legacyName || 'Texte sans contrat'}.`, en: `Biography preserved. ${codex?.legacyName || 'Text without contract'}.` }, data: { hero } };
const definition = createCardDefinitionFromPortalCandidate(candidate).definition;
const saved = JSON.stringify({ fixture: 'codex-qa', currency: 123, inventory: ['unchanged'] });
localStorage.setItem('codex-qa-only', saved);
const audit = { changes: [], selections: [], closes: 0, source: JSON.stringify(hero), expected: codex?.name,
  storage: JSON.stringify(Object.entries(localStorage)), hero };
window.__codexAudit = audit;
const banner = {id:'qa-codex',universe:hero.universe,label:{fr:'Booster QA',en:'QA booster'},desc:'Synthetic fixture',color:'#39c5bb',price:100};
function Artwork() { return <span>QA — existing reward data, no new artwork</span>; }
const getDetail = reward => reward.lore[lang];
export default function Harness() {
  const [opened, setOpened] = useState(false);
  const [entry, setEntry] = useState({ copies: 2, finishesOwned: ['standard'], provenance: { source: 'QA object provenance' }, favorite: false });
  const close = () => { audit.closes++;setOpened(false); };
  return <main style={{padding:16}}><h1>Isolated codex QA — real collection and booster dialogs</h1>
    <button id="qa-open" onClick={()=>setOpened(true)}>Open QA</button><button id="qa-outside">Outside</button>
    {opened && (view === 'booster' ? <PortalBoosterDossier banner={banner} candidates={[candidate]} lang={lang}
      available={false} selected={false} duplicateStreak={0} pityLimit={10} isCandidateOwned={()=>false}
      onSelect={id=>audit.selections.push(id)} onClose={close} kindLabels={{hero:{fr:'Personnage',en:'Character'}}}
      kindOrder={['hero']} rarities={{rare:{id:'rare',color:'#ddd',weight:10,label:{fr:'Rare',en:'Rare'}}}}
      Artwork={Artwork} getRewardDetail={getDetail} />
      : <CardDetailModal definition={definition} entry={entry} lang={lang} onClose={close}
        onUpdateCard={(id,patch)=>{audit.changes.push({id,patch});setEntry(e=>({...e,...patch}));}} />)}
  </main>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
