import React, { useEffect, useRef } from 'react';
import CollectibleCard from '../cards/CollectibleCard';

const getText = (value, lang, fallback = '') => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || fallback;
};

export default function CardDetailModal({ lang = 'fr', definition, entry, onClose, onUpdateCard }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!definition || !entry) return null;

  const lore = getText(definition.lore, lang, lang === 'fr'
    ? 'Dossier de lore a valider avant production finale.'
    : 'Lore record awaiting validation before final production.');
  const provenance = entry.provenance?.at(-1) || entry.provenance || null;

  return (
    <div
      className="tcg-card-detail-overlay"
      onMouseDown={event => event.target === event.currentTarget && onClose?.()}
    >
      <section className="tcg-card-detail" role="dialog" aria-modal="true" aria-labelledby="tcg-card-detail-title">
        <button ref={closeRef} type="button" className="tcg-close-button" onClick={onClose}>
          {lang === 'fr' ? 'FERMER' : 'CLOSE'}
        </button>
        <div className="tcg-card-detail-layout">
          <CollectibleCard definition={definition} entry={entry} lang={lang} />
          <div className="tcg-card-detail-copy">
            <span>{definition.universe} / #{String(definition.number || 0).padStart(3, '0')}</span>
            <h2 id="tcg-card-detail-title">{getText(definition.name, lang, definition.id)}</h2>
            <div className="tcg-card-detail-badges">
              <span>{definition.rarityId}</span>
              <span>{definition.kind}</span>
              <span>{definition.canonStatus}</span>
              <span>{definition.ageGate}</span>
            </div>
            <p>{lore}</p>
            <dl>
              <div><dt>{lang === 'fr' ? 'Copies' : 'Copies'}</dt><dd>{entry.copies || 1}</dd></div>
              <div><dt>{lang === 'fr' ? 'Maitrise' : 'Mastery'}</dt><dd>{entry.masteryLevel || 0}/3</dd></div>
              <div><dt>{lang === 'fr' ? 'Finitions' : 'Finishes'}</dt><dd>{(entry.finishesOwned || ['standard']).join(', ')}</dd></div>
              <div><dt>{lang === 'fr' ? 'Premiere obtention' : 'First obtained'}</dt><dd>{entry.firstObtainedAt || 'LEGACY'}</dd></div>
              <div><dt>{lang === 'fr' ? 'Provenance' : 'Source'}</dt><dd>{provenance?.pack || provenance?.packId || provenance?.source || 'A.R.C.A.'}</dd></div>
              <div><dt>{lang === 'fr' ? 'Art' : 'Art'}</dt><dd>{definition.art?.source || 'project'} / {definition.visualStatus || 'draft'}</dd></div>
            </dl>
            <button
              type="button"
              className={`tcg-favorite-button ${entry.favorite ? 'is-favorite' : ''}`}
              aria-pressed={Boolean(entry.favorite)}
              onClick={() => onUpdateCard?.(definition.id, { favorite: !entry.favorite })}
            >
              {entry.favorite ? '★ ' : '☆ '}
              {lang === 'fr' ? (entry.favorite ? 'RETIRER DES FAVORIS' : 'AJOUTER AUX FAVORIS') : (entry.favorite ? 'REMOVE FAVORITE' : 'ADD FAVORITE')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
