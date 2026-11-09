import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import CollectibleCard from '../cards/CollectibleCard';
import { getCardArtPresentation } from '../cards/cardArtPresentation.js';
import useModalDialog from './useModalDialog.js';
import { signatureText } from '../../game/signatureCodex.js';

const CardSignatureDetails = React.lazy(() => import('./CardSignatureDetails.jsx'));

const getText = signatureText;

export default function CardDetailModal({ lang = 'fr', definition, entry, onClose, onUpdateCard }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const visible = Boolean(definition && entry);
  useModalDialog({ open: visible, overlayRef, dialogRef, initialFocusRef: closeRef, onClose });

  if (!definition || !entry) return null;

  const lore = getText(definition.lore, lang, '');
  const artwork = getCardArtPresentation(definition.art);
  const provenance = Array.isArray(entry.provenance) ? entry.provenance.at(-1) : entry.provenance || null;

  const content = (
    <div
      ref={overlayRef}
      className="tcg-card-detail-overlay"
      onMouseDown={event => event.target === event.currentTarget && onClose?.()}
    >
      <section ref={dialogRef} tabIndex={-1} className="tcg-card-detail" role="dialog" aria-modal="true" aria-labelledby="tcg-card-detail-title">
        <header className="tcg-card-detail-header">
          <button ref={closeRef} type="button" className="tcg-close-button" onClick={onClose}>
            {lang === 'fr' ? 'FERMER' : 'CLOSE'}
          </button>
        </header>
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
            <React.Suspense fallback={<p>{lore}</p>}>
              <CardSignatureDetails definition={definition} lore={lore} lang={lang} />
            </React.Suspense>
            <dl>
              <div><dt>{lang === 'fr' ? 'Copies' : 'Copies'}</dt><dd>{entry.copies || 1}</dd></div>
              <div><dt>{lang === 'fr' ? 'Maitrise' : 'Mastery'}</dt><dd>{entry.masteryLevel || 0}/3</dd></div>
              <div><dt>{lang === 'fr' ? 'Finitions' : 'Finishes'}</dt><dd>{(entry.finishesOwned || ['standard']).join(', ')}</dd></div>
            </dl>
            <details className="tcg-card-provenance">
              <summary>{lang === 'fr' ? 'Informations, illustration et provenance' : 'Information, artwork and provenance'}</summary>
            <dl>
              <div><dt>{lang === 'fr' ? 'Premiere obtention' : 'First obtained'}</dt><dd>{entry.firstObtainedAt || 'LEGACY'}</dd></div>
              <div><dt>{lang === 'fr' ? 'Provenance' : 'Source'}</dt><dd>{provenance?.pack || provenance?.packId || provenance?.source || 'A.R.C.A.'}</dd></div>
              <div><dt>{lang === 'fr' ? 'Art' : 'Art'}</dt><dd>{definition.art?.source || 'project'} / {definition.visualStatus || 'draft'}</dd></div>
            </dl>
            {!lore && <p>{lang === 'fr' ? 'Le texte éditorial propre à cette carte reste à valider. Les dossiers de signature existants sont conservés ci-dessus.' : 'The editorial text for this card is awaiting validation. Existing signature records remain available above.'}</p>}
            {artwork.sheet && <figure>
              <img src={artwork.sheet} alt={lang === 'fr' ? 'Planche source complète des poses de cette carte' : 'Complete source pose sheet for this card'} loading="lazy" />
              <figcaption>{lang === 'fr' ? 'Planche source conservée. La carte présente une seule pose.' : 'Source sheet preserved. The card shows a single pose.'}</figcaption>
            </figure>}
            </details>
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
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}
