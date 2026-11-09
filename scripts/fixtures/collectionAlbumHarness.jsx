// Real album, binder, card records, display preferences and milestone guard.
// The catalogue, artwork and parent collection are synthetic; no purchases,
// production reward delivery or cloud persistence are simulated as completed.
import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import CollectionHome from '../../src/components/collection/CollectionHome.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { claimSetMilestone } from '../../src/game/cards/cardCollectionEngine.js';
import './collectionAlbumHarness.css';

const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const nexus = 'Nexus de Convergence';
const universes = [nexus, ...Array.from({ length: 24 }, (_, index) => `Archives de contrôle ${String(index + 1).padStart(2, '0')} — Bibliothèque des quartiers de la Cité` )];
const artwork = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#102d39"/><path d="M120 35 190 120 120 205 50 120Z" fill="#5ce5ce"/><circle cx="120" cy="120" r="30" fill="#183d4c"/></svg>')}`;
const definitions = Object.freeze(universes.flatMap((universe, universeIndex) =>
  Array.from({ length: universeIndex === 0 ? 36 : 4 }, (_, index) => Object.freeze({
    id: `qa-album-${universeIndex}-${index + 1}`, universe, number: index + 1,
    name: index === 24 && universeIndex === 0
      ? { fr: 'Éclaireuse aux nombreux titres de la Bibliothèque des Trames', en: 'Pathfinder with many titles from the Thread Library' }
      : { fr: `Archive ${index + 1} du quartier ${universeIndex + 1}`, en: `Archive ${index + 1} from district ${universeIndex + 1}` },
    kind: index % 2 ? 'relic' : 'archive', rarityId: index % 3 ? 'stable' : 'rare',
    canonStatus: index % 4 ? 'nexus-variant' : 'canon', ageGate: 'all', visualStatus: 'draft',
    art: { image: artwork, source: 'synthetic-qa' },
    lore: { fr: 'Texte de contrôle de la fiche. Cette illustration géométrique ne représente pas un contenu de production.', en: 'Record verification text. This geometric illustration does not represent production artwork.' },
    tags: ['verification']
  }))));
const sets = Object.freeze(universes.map((universe, index) => Object.freeze({
  id: `qa-album-set-${index}`, universe,
  cardIds: definitions.filter(definition => definition.universe === universe).map(definition => definition.id),
  completionRewards: [10, 25, 50, 75, 90, 100].map(milestone => ({
    id: `qa-milestone-${milestone}`, milestone,
    label: { fr: `Palier ${milestone} — souvenir de la Bibliothèque`, en: `Milestone ${milestone} — Library keepsake` }
  }))
})));
const cards = Object.freeze(Object.fromEntries(definitions.filter(definition =>
  definition.universe === nexus ? definition.number <= 30 : definition.number <= 2
).map(definition => [definition.id, Object.freeze({
  copies: 4, masteryLevel: 3,
  finishesOwned: ['standard', 'holo-thread', 'portal-foil', 'negative-archive'],
  favorite: definition.id === 'qa-album-0-25' || definition.id === 'qa-album-0-2',
  seen: definition.id !== 'qa-album-0-25', firstObtainedAt: '2026-11-07T12:00:00.000Z',
  provenance: [{ source: 'Verification fixture', pack: 'Archives synthétiques de la Bibliothèque' }]
})])));
const initialCollection = Object.freeze({ cards, setProgress: {}, threadDust: 789, breachShards: 456, profileTitles: ['qa-original-title'] });
const history = Object.freeze(Array.from({ length: 102 }, (_, index) => ({
  cardId: `qa-history-${index + 1}`, at: `2026-11-07T12:${String(index % 60).padStart(2, '0')}:00.000Z`,
  name: `Archive historique ${index + 1}`, universe: universes[index % universes.length],
  pack: 'Booster de vérification — provenance conservée', rarityLabel: index % 2 ? 'Rare' : 'Stable',
  duplicate: index % 2 === 0, shardsReturned: 10
})));
window.__collectionAlbumQA = { updates: [], claims: [], definitions, initialCollection, collection: null };

export function Fixture() {
  const [open, setOpen] = useState(false);
  const [collection, setCollection] = useState(initialCollection);
  useEffect(() => { window.__collectionAlbumQA.collection = collection; }, [collection]);
  const updateCard = (id, patch) => {
    window.__collectionAlbumQA.updates.push({ id, patch });
    setCollection(previous => previous.cards[id]
      ? { ...previous, cards: { ...previous.cards, [id]: { ...previous.cards[id], ...patch } } }
      : previous);
  };
  const claimMilestone = (setDefinition, reward) => {
    const claim = claimSetMilestone({ portalCollection: collection, setDefinition, milestone: reward.milestone });
    window.__collectionAlbumQA.claims.push({ setId: setDefinition.id, milestone: reward.milestone, claimed: claim.claimed });
    if (claim.claimed) setCollection(claim.portalCollection);
  };
  return <>
    <GameDisplayPreferencesSync />
    <GameSystemMenu lang={lang} />
    <main className="collection-album-fixture">
      <h1>{lang === 'fr' ? 'Recette de l’Album' : 'Album verification'}</h1>
      <button type="button" data-testid="open-album" onClick={() => setOpen(true)}>{lang === 'fr' ? 'OUVRIR L’ALBUM' : 'OPEN ALBUM'}</button>
      <p>{lang === 'fr' ? 'Catalogue de contrôle : 132 cartes, 25 univers. Aucun achat.' : 'Verification catalogue: 132 cards, 25 universes. No purchases.'}</p>
    </main>
    {open && <CollectionHome lang={lang} definitions={definitions} sets={sets} cards={collection.cards}
      setProgress={collection.setProgress} history={history} onClose={() => setOpen(false)}
      onUpdateCard={updateCard} onClaimMilestone={claimMilestone} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
