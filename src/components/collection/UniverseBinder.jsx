import React, { useEffect, useMemo, useRef, useState } from 'react';
import CollectibleCard from '../cards/CollectibleCard';
import { matchesCollectionCard } from './collectionView.js';

const PAGE_SIZE = 12;

export default function UniverseBinder({
  lang = 'fr',
  definitions = [],
  cards = {},
  selectedUniverse = 'all',
  query = '',
  rarity = 'all',
  kind = 'all',
  canonStatus = 'all',
  ownedOnly = false,
  favoritesOnly = false,
  onSelectCard
}) {
  const [page, setPage] = useState(0);
  const headingRef = useRef(null);
  const pageFocusPending = useRef(false);
  const filteredDefinitions = useMemo(() => definitions.filter(definition => matchesCollectionCard(definition, cards, {
    selectedUniverse, rarity, kind, canonStatus, ownedOnly, favoritesOnly, query
  })), [canonStatus, cards, definitions, favoritesOnly, kind, ownedOnly, query, rarity, selectedUniverse]);
  const pageCount = Math.max(1, Math.ceil(filteredDefinitions.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleDefinitions = filteredDefinitions.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE
  );

  useEffect(() => {
    setPage(0);
  }, [canonStatus, favoritesOnly, kind, ownedOnly, query, rarity, selectedUniverse]);

  useEffect(() => {
    if (!pageFocusPending.current) return undefined;
    const frame = requestAnimationFrame(() => {
      pageFocusPending.current = false;
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [safePage]);

  const changePage = nextPage => {
    if (nextPage === safePage) return;
    pageFocusPending.current = true;
    setPage(nextPage);
  };
  const pagination = position => (
    <nav className="tcg-pagination" aria-label={lang === 'fr' ? 'Pages du classeur' : 'Binder pages'} data-pagination-position={position}>
      <button type="button" onClick={() => changePage(Math.max(0, safePage - 1))} disabled={safePage === 0}>
        {lang === 'fr' ? 'PAGE PRECEDENTE' : 'PREVIOUS PAGE'}
      </button>
      <span>{safePage + 1} / {pageCount}</span>
      <button type="button" onClick={() => changePage(Math.min(pageCount - 1, safePage + 1))} disabled={safePage >= pageCount - 1}>
        {lang === 'fr' ? 'PAGE SUIVANTE' : 'NEXT PAGE'}
      </button>
    </nav>
  );

  return (
    <section className="tcg-binder" aria-labelledby="tcg-binder-title">
      <div className="tcg-binder-heading">
        <div>
          <span>{lang === 'fr' ? 'CLASSEUR DE TRAME' : 'THREAD BINDER'}</span>
          <h3 ref={headingRef} id="tcg-binder-title" tabIndex={-1}>
            {selectedUniverse === 'all'
              ? (lang === 'fr' ? 'Toutes les archives' : 'All archives')
              : selectedUniverse}
          </h3>
        </div>
        <strong>{filteredDefinitions.filter(definition => cards[definition.id]).length}/{filteredDefinitions.length}</strong>
      </div>
      <p className="tcg-binder-range" role="status" aria-live="polite" aria-atomic="true">{lang === 'fr'
        ? `Cartes ${filteredDefinitions.length ? safePage * PAGE_SIZE + 1 : 0}–${Math.min((safePage + 1) * PAGE_SIZE, filteredDefinitions.length)} sur ${filteredDefinitions.length} · Page ${safePage + 1} sur ${pageCount}`
        : `Cards ${filteredDefinitions.length ? safePage * PAGE_SIZE + 1 : 0}–${Math.min((safePage + 1) * PAGE_SIZE, filteredDefinitions.length)} of ${filteredDefinitions.length} · Page ${safePage + 1} of ${pageCount}`}</p>
      {pagination('top')}

      {visibleDefinitions.length > 0 ? (
        <div className="tcg-card-grid" data-page-size={PAGE_SIZE}>
          {visibleDefinitions.map(definition => (
            <CollectibleCard
              key={definition.id}
              definition={definition}
              entry={cards[definition.id]}
              lang={lang}
              onSelect={onSelectCard}
            />
          ))}
        </div>
      ) : (
        <div className="tcg-empty-state" role="status">
          {lang === 'fr'
            ? 'Aucune carte ne correspond a ces filtres.'
            : 'No card matches these filters.'}
        </div>
      )}

      {pagination('bottom')}
    </section>
  );
}
