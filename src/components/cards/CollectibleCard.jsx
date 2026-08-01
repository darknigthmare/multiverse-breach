import React from 'react';
import CardFoilLayer from './CardFoilLayer';

const RARITY_LABELS = Object.freeze({
  stable: { fr: 'Stable', en: 'Stable' },
  rare: { fr: 'Rare', en: 'Rare' },
  epic: { fr: 'Epique', en: 'Epic' },
  anomaly: { fr: 'Anomalie', en: 'Anomaly' }
});

const CANON_LABELS = Object.freeze({
  canon: 'CANON',
  'canon-inspired': 'CANON INSPIRE',
  'nexus-variant': 'NEXUS',
  'what-if': 'WHAT IF'
});

const getText = (value, lang, fallback = '') => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || fallback;
};

function CollectibleCard({ definition, entry, lang = 'fr', onSelect }) {
  const owned = Boolean(entry);
  const name = owned
    ? getText(definition.name, lang, definition.id)
    : (lang === 'fr' ? 'CARTE INCONNUE' : 'UNKNOWN CARD');
  const rarityId = definition.rarityId || 'stable';
  const rarityLabel = RARITY_LABELS[rarityId]?.[lang] || rarityId;
  const finishId = entry?.finishesOwned?.at(-1) || 'standard';
  const art = definition.art || {};
  const artSrc = art.thumbnail || art.image || art.sheet || null;
  const visualStatus = definition.visualStatus || 'draft';

  return (
    <button
      type="button"
      className={`tcg-card tcg-card-${rarityId} ${owned ? 'is-owned' : 'is-unknown'} ${entry?.seen === false ? 'is-new' : ''}`}
      style={{
        '--tcg-primary': definition.visualTheme?.palettePrimary || definition.color || '#39c5bb',
        '--tcg-secondary': definition.visualTheme?.paletteSecondary || '#111827',
        '--tcg-accent': definition.visualTheme?.accent || definition.color || '#ffcf5a',
        '--tcg-focal-x': `${Math.round((art.focalPoint?.x ?? 0.5) * 100)}%`,
        '--tcg-focal-y': `${Math.round((art.focalPoint?.y ?? 0.42) * 100)}%`
      }}
      onClick={() => owned && onSelect?.(definition.id)}
      disabled={!owned}
      aria-label={owned
        ? `${name}, ${rarityLabel}, ${definition.universe}`
        : `${lang === 'fr' ? 'Emplacement inconnu' : 'Unknown slot'} ${definition.number}`}
      data-card-id={definition.id}
      data-card-owned={owned ? 'true' : 'false'}
    >
      <span className="tcg-card-frame" aria-hidden="true" />
      <span className="tcg-card-topline">
        <span>#{String(definition.number || 0).padStart(3, '0')}</span>
        <span>{owned ? (definition.kind || 'archive').toUpperCase() : '???'}</span>
        <span>{owned ? rarityLabel : '—'}</span>
      </span>

      <span className="tcg-card-art">
        {owned && artSrc ? (
          <img
            src={artSrc}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <span className="tcg-card-silhouette" aria-hidden="true">
            {owned ? (definition.kind || '?').slice(0, 1).toUpperCase() : '?'}
          </span>
        )}
        {owned && !artSrc && (
          <small className="tcg-card-draft-art">
            {lang === 'fr' ? 'ART A PRODUIRE' : 'ART TO PRODUCE'}
          </small>
        )}
      </span>

      <span className="tcg-card-copy">
        <strong>{name}</strong>
        <small>{owned ? definition.universe : `#${String(definition.number || 0).padStart(3, '0')}`}</small>
      </span>

      {owned ? (
        <span className="tcg-card-meta">
          <span>{CANON_LABELS[definition.canonStatus] || 'ARCHIVE'}</span>
          <span>{entry.copies || 1}x / M{entry.masteryLevel || 0}</span>
          {entry.favorite ? <span aria-label={lang === 'fr' ? 'Favorite' : 'Favorite'}>★</span> : null}
        </span>
      ) : (
        <span className="tcg-card-meta"><span>A.R.C.A.</span><span>NON INDEXEE</span></span>
      )}

      {owned && visualStatus !== 'pilot' ? (
        <span className="tcg-card-visual-status">DRAFT</span>
      ) : null}
      {owned && entry?.seen === false ? <span className="tcg-card-new-badge">NEW</span> : null}
      {owned ? <CardFoilLayer finishId={finishId} /> : null}
    </button>
  );
}

export default React.memo(CollectibleCard);
