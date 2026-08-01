import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import CardDetailModal from './CardDetailModal';
import UniverseBinder from './UniverseBinder';
import './collection.css';

const normalizeSearch = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase();

const getText = (value, lang, fallback = '') => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || fallback;
};

const getClaimedMilestones = (setProgress, setId) => (
  setProgress?.[setId]?.claimedMilestones || []
).map(value => Number(value));

export default function CollectionHome({
  lang = 'fr',
  definitions = [],
  sets = [],
  cards = {},
  setProgress = {},
  history = [],
  diagnostics = {},
  onClose,
  onUpdateCard,
  onClaimMilestone
}) {
  const closeRef = useRef(null);
  const [view, setView] = useState('library');
  const [selectedUniverse, setSelectedUniverse] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [query, setQuery] = useState('');
  const [rarity, setRarity] = useState('all');
  const [kind, setKind] = useState('all');
  const [canonStatus, setCanonStatus] = useState('all');
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearch(deferredQuery.trim());

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = event => {
      if (event.key === 'Escape' && !selectedCardId) onClose?.();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, selectedCardId]);

  const searchableDefinitions = useMemo(() => definitions.map(definition => ({
    ...definition,
    searchText: normalizeSearch([
      getText(definition.name, lang),
      definition.universe,
      definition.kind,
      definition.rarityId,
      definition.canonStatus,
      ...(definition.tags || [])
    ].join(' '))
  })), [definitions, lang]);
  const definitionById = useMemo(
    () => new Map(searchableDefinitions.map(definition => [definition.id, definition])),
    [searchableDefinitions]
  );
  const universeSummaries = useMemo(() => {
    const byUniverse = new Map();
    searchableDefinitions.forEach(definition => {
      const summary = byUniverse.get(definition.universe) || {
        universe: definition.universe,
        total: 0,
        owned: 0,
        anomalies: 0,
        favorites: 0,
        pilot: false
      };
      const entry = cards[definition.id];
      summary.total += 1;
      summary.owned += Number(Boolean(entry));
      summary.anomalies += Number(Boolean(entry && definition.rarityId === 'anomaly'));
      summary.favorites += Number(Boolean(entry?.favorite));
      summary.pilot ||= definition.visualStatus === 'pilot';
      byUniverse.set(definition.universe, summary);
    });
    return Array.from(byUniverse.values()).sort((a, b) => {
      if (b.favorites !== a.favorites) return b.favorites - a.favorites;
      if (b.owned !== a.owned) return b.owned - a.owned;
      return a.universe.localeCompare(b.universe, lang);
    });
  }, [cards, lang, searchableDefinitions]);
  const visibleUniverseSummaries = universeSummaries.filter(summary => (
    !normalizedQuery || normalizeSearch(summary.universe).includes(normalizedQuery)
  ));
  const ownedCount = searchableDefinitions.reduce(
    (total, definition) => total + Number(Boolean(cards[definition.id])),
    0
  );
  const anomalyCount = searchableDefinitions.reduce(
    (total, definition) => total + Number(Boolean(cards[definition.id] && definition.rarityId === 'anomaly')),
    0
  );
  const favoriteCount = Object.values(cards).filter(entry => entry?.favorite).length;
  const kindOptions = Array.from(new Set(searchableDefinitions.map(definition => definition.kind))).sort();
  const selectedCard = selectedCardId ? definitionById.get(selectedCardId) : null;
  const selectedEntry = selectedCardId ? cards[selectedCardId] : null;
  const activeSet = selectedUniverse === 'all'
    ? null
    : sets.find(set => set.universe === selectedUniverse) || null;
  const activeSetOwned = activeSet?.cardIds?.filter(cardId => cards[cardId]).length || 0;
  const activeSetTotal = activeSet?.cardIds?.length || 0;
  const activeSetRatio = activeSetTotal ? activeSetOwned / activeSetTotal : 0;
  const claimedMilestones = activeSet
    ? getClaimedMilestones(setProgress, activeSet.id)
    : [];
  const collisionCount = diagnostics.rewardIdentityCollisions?.length
    || diagnostics.collisions?.length
    || 0;

  const openBinder = universe => {
    setSelectedUniverse(universe);
    setView('binder');
  };
  const openCard = cardId => {
    setSelectedCardId(cardId);
    if (cards[cardId]?.seen === false) onUpdateCard?.(cardId, { seen: true });
  };

  return (
    <div className="tcg-album-overlay" data-tcg-album="open">
      <section className="tcg-album" role="dialog" aria-modal="true" aria-labelledby="tcg-album-title">
        <header className="tcg-album-header">
          <div>
            <span>A.R.C.A. / TCG ARCHIVE v1</span>
            <h1 id="tcg-album-title">{lang === 'fr' ? 'ALBUM DES TRAMES' : 'THREAD ALBUM'}</h1>
            <p>
              {lang === 'fr'
                ? 'Les cartes indexent les recompenses existantes sans modifier la puissance de combat.'
                : 'Cards index existing rewards without changing combat power.'}
            </p>
          </div>
          <button ref={closeRef} type="button" className="tcg-close-button" onClick={onClose}>
            {lang === 'fr' ? 'FERMER' : 'CLOSE'}
          </button>
        </header>

        <div className="tcg-album-stats" aria-label={lang === 'fr' ? 'Progression globale' : 'Global progress'}>
          <div><span>{lang === 'fr' ? 'CARTES' : 'CARDS'}</span><strong>{ownedCount}/{searchableDefinitions.length}</strong></div>
          <div><span>{lang === 'fr' ? 'TRAMES' : 'THREADS'}</span><strong>{universeSummaries.filter(summary => summary.owned > 0).length}/{universeSummaries.length}</strong></div>
          <div><span>{lang === 'fr' ? 'ANOMALIES' : 'ANOMALIES'}</span><strong>{anomalyCount}</strong></div>
          <div><span>{lang === 'fr' ? 'FAVORIS' : 'FAVORITES'}</span><strong>{favoriteCount}</strong></div>
        </div>

        {collisionCount > 0 ? (
          <div className="tcg-data-warning" role="status">
            {lang === 'fr'
              ? `${collisionCount} identite(s) de recompense ambigue(s) restent A VERIFIER; aucune signature canonique n'a ete inventee.`
              : `${collisionCount} ambiguous reward identity record(s) remain TO VERIFY; no canonical signature was invented.`}
          </div>
        ) : null}

        <nav className="tcg-album-tabs" aria-label={lang === 'fr' ? 'Vues de collection' : 'Collection views'}>
          {[
            ['library', lang === 'fr' ? 'BIBLIOTHEQUE' : 'LIBRARY'],
            ['binder', lang === 'fr' ? 'CLASSEUR' : 'BINDER'],
            ['history', lang === 'fr' ? 'HISTORIQUE' : 'HISTORY']
          ].map(([id, label]) => (
            <button key={id} type="button" className={view === id ? 'is-active' : ''} aria-pressed={view === id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="tcg-album-toolbar">
          <label className="tcg-search-field">
            <span>{lang === 'fr' ? 'RECHERCHE' : 'SEARCH'}</span>
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={lang === 'fr' ? 'Univers, carte, alias…' : 'Universe, card, alias…'}
            />
          </label>
          <label>
            <span>{lang === 'fr' ? 'RARETE' : 'RARITY'}</span>
            <select value={rarity} onChange={event => setRarity(event.target.value)}>
              <option value="all">{lang === 'fr' ? 'Toutes' : 'All'}</option>
              <option value="stable">Stable</option><option value="rare">Rare</option>
              <option value="epic">{lang === 'fr' ? 'Epique' : 'Epic'}</option><option value="anomaly">{lang === 'fr' ? 'Anomalie' : 'Anomaly'}</option>
            </select>
          </label>
          <label>
            <span>TYPE</span>
            <select value={kind} onChange={event => setKind(event.target.value)}>
              <option value="all">{lang === 'fr' ? 'Tous' : 'All'}</option>
              {kindOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>CANON</span>
            <select value={canonStatus} onChange={event => setCanonStatus(event.target.value)}>
              <option value="all">{lang === 'fr' ? 'Tous' : 'All'}</option>
              <option value="canon">Canon</option><option value="canon-inspired">Canon inspired</option>
              <option value="nexus-variant">Nexus</option><option value="what-if">What If</option>
            </select>
          </label>
          <label className="tcg-toggle"><input type="checkbox" checked={ownedOnly} onChange={event => setOwnedOnly(event.target.checked)} />{lang === 'fr' ? 'OBTENUES' : 'OWNED'}</label>
          <label className="tcg-toggle"><input type="checkbox" checked={favoritesOnly} onChange={event => setFavoritesOnly(event.target.checked)} />{lang === 'fr' ? 'FAVORIS' : 'FAVORITES'}</label>
        </div>

        <main className="tcg-album-content">
          {view === 'library' ? (
            <section aria-labelledby="tcg-library-title">
              <div className="tcg-section-title">
                <div><span>{lang === 'fr' ? 'INDEX GLOBAL' : 'GLOBAL INDEX'}</span><h2 id="tcg-library-title">{lang === 'fr' ? 'Classeurs d’univers' : 'Universe binders'}</h2></div>
                <strong>{visibleUniverseSummaries.length}</strong>
              </div>
              <div className="tcg-universe-grid">
                <button type="button" className="tcg-universe-tile tcg-universe-all" onClick={() => openBinder('all')}>
                  <span>NEXUS INDEX</span><strong>{lang === 'fr' ? 'TOUTES LES TRAMES' : 'ALL THREADS'}</strong><small>{ownedCount}/{searchableDefinitions.length}</small>
                </button>
                {visibleUniverseSummaries.map(summary => {
                  const progress = summary.total ? Math.round((summary.owned / summary.total) * 100) : 0;
                  return (
                    <button key={summary.universe} type="button" className="tcg-universe-tile" onClick={() => openBinder(summary.universe)}>
                      <span>{summary.pilot ? 'PILOTE VISUEL' : 'ARCHIVE DRAFT'}</span>
                      <strong>{summary.universe}</strong>
                      <small>{summary.owned}/{summary.total} / {progress}%</small>
                      <i aria-hidden="true"><b style={{ width: `${progress}%` }} /></i>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {view === 'binder' ? (
            <>
              <label className="tcg-universe-select">
                <span>{lang === 'fr' ? 'CLASSEUR' : 'BINDER'}</span>
                <select value={selectedUniverse} onChange={event => setSelectedUniverse(event.target.value)}>
                  <option value="all">{lang === 'fr' ? 'Toutes les Trames' : 'All Threads'}</option>
                  {universeSummaries.map(summary => <option key={summary.universe} value={summary.universe}>{summary.universe}</option>)}
                </select>
              </label>
              {activeSet ? (
                <section className="tcg-milestones" aria-labelledby="tcg-milestones-title">
                  <div><span>{lang === 'fr' ? 'PALIERS DU SET' : 'SET MILESTONES'}</span><strong id="tcg-milestones-title">{activeSetOwned}/{activeSetTotal}</strong></div>
                  <div className="tcg-milestone-list">
                    {(activeSet.completionRewards || []).map(reward => {
                      const threshold = Number(reward.milestone ?? reward.threshold ?? reward.percent ?? 0);
                      const claimed = claimedMilestones.includes(threshold);
                      const available = activeSetRatio >= threshold / 100;
                      return (
                        <button
                          key={reward.id || threshold}
                          type="button"
                          className={claimed ? 'is-claimed' : available ? 'is-available' : ''}
                          disabled={!available || claimed}
                          onClick={() => onClaimMilestone?.(activeSet, reward)}
                        >
                          <strong>{threshold}%</strong><span>{getText(reward.label, lang, reward.rewardType || reward.type || reward.id)}</span><small>{claimed ? (lang === 'fr' ? 'RECLAME' : 'CLAIMED') : available ? (lang === 'fr' ? 'RECLAMER' : 'CLAIM') : 'LOCKED'}</small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}
              <UniverseBinder
                lang={lang}
                definitions={searchableDefinitions}
                cards={cards}
                selectedUniverse={selectedUniverse}
                query={normalizedQuery}
                rarity={rarity}
                kind={kind}
                canonStatus={canonStatus}
                ownedOnly={ownedOnly}
                favoritesOnly={favoritesOnly}
                onSelectCard={openCard}
              />
            </>
          ) : null}

          {view === 'history' ? (
            <section className="tcg-opening-history" aria-labelledby="tcg-history-title">
              <div className="tcg-section-title"><div><span>A.R.C.A. LEDGER</span><h2 id="tcg-history-title">{lang === 'fr' ? '100 derniers tirages' : 'Last 100 pulls'}</h2></div><strong>{Math.min(100, history.length)}</strong></div>
              {history.length > 0 ? (
                <ol>
                  {history.slice(0, 100).map((entry, index) => (
                    <li key={`${entry.cardId || entry.rewardId}-${entry.at || 'legacy'}-${index}`}>
                      <span style={{ '--history-rarity': entry.rarityColor || '#9fb6bb' }}>{entry.rarityLabel || entry.rarity || 'Stable'}</span>
                      <strong>{entry.name || entry.rewardId || entry.cardId}</strong>
                      <small>{entry.universe || 'Nexus'} / {entry.pack || entry.packId || 'LEGACY'}</small>
                      <em>{entry.duplicate ? `ECHO +${entry.shardsReturned || 0}` : 'NEW'}</em>
                    </li>
                  ))}
                </ol>
              ) : <div className="tcg-empty-state">{lang === 'fr' ? 'Aucun tirage enregistre.' : 'No recorded pull.'}</div>}
            </section>
          ) : null}
        </main>

        {selectedCard && selectedEntry ? (
          <CardDetailModal
            lang={lang}
            definition={selectedCard}
            entry={selectedEntry}
            onClose={() => setSelectedCardId(null)}
            onUpdateCard={onUpdateCard}
          />
        ) : null}
      </section>
    </div>
  );
}
