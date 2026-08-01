import React, { useEffect, useMemo, useState } from 'react';
import CollectibleCard from '../cards/CollectibleCard';

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
  const filteredDefinitions = useMemo(() => definitions.filter(definition => {
    const entry = cards[definition.id];
    if (selectedUniverse !== 'all' && definition.universe !== selectedUniverse) return false;
    if (rarity !== 'all' && definition.rarityId !== rarity) return false;
    if (kind !== 'all' && definition.kind !== kind) return false;
    if (canonStatus !== 'all' && definition.canonStatus !== canonStatus) return false;
    if (ownedOnly && !entry) return false;
    if (favoritesOnly && !entry?.favorite) return false;
    if (!query) return true;
    return definition.searchText?.includes(query);
  }), [canonStatus, cards, definitions, favoritesOnly, kind, ownedOnly, query, rarity, selectedUniverse]);
  const pageCount = Math.max(1, Math.ceil(filteredDefinitions.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleDefinitions = filteredDefinitions.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE
  );

  useEffect(() => {
    setPage(0);
  }, [canonStatus, favoritesOnly, kind, ownedOnly, query, rarity, selectedUniverse]);

  return (
    <section className="tcg-binder" aria-labelledby="tcg-binder-title">
      <div className="tcg-binder-heading">
        <div>
          <span>{lang === 'fr' ? 'CLASSEUR DE TRAME' : 'THREAD BINDER'}</span>
          <h3 id="tcg-binder-title">
            {selectedUniverse === 'all'
              ? (lang === 'fr' ? 'Toutes les archives' : 'All archives')
              : selectedUniverse}
          </h3>
        </div>
        <strong>{filteredDefinitions.filter(definition => cards[definition.id]).length}/{filteredDefinitions.length}</strong>
      </div>

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
        <div className="tcg-empty-state">
          {lang === 'fr'
            ? 'Aucune carte ne correspond a ces filtres.'
            : 'No card matches these filters.'}
        </div>
      )}

      <nav className="tcg-pagination" aria-label={lang === 'fr' ? 'Pages du classeur' : 'Binder pages'}>
        <button type="button" onClick={() => setPage(current => Math.max(0, current - 1))} disabled={safePage === 0}>
          {lang === 'fr' ? 'PAGE PRECEDENTE' : 'PREVIOUS PAGE'}
        </button>
        <span>{safePage + 1} / {pageCount}</span>
        <button type="button" onClick={() => setPage(current => Math.min(pageCount - 1, current + 1))} disabled={safePage >= pageCount - 1}>
          {lang === 'fr' ? 'PAGE SUIVANTE' : 'NEXT PAGE'}
        </button>
      </nav>
    </section>
  );
}
