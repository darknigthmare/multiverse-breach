import React from 'react';
import { CATALOG_PAGE_SIZES } from '../game/catalogPagination.js';

// The caller owns the query and page so opening a dossier cannot discard them.
// Page numbers are zero-based here, matching the reward catalogue contract.
export default function PortalCatalogPager({ lang, label, controlsId, page, pageCount, start, end, total, pageSize, onPageChange, onPageSizeChange, position = 'top' }) {
  const fr = lang === 'fr';
  return <nav className="portal-catalog-pager" aria-label={`${label} · Pages`} data-pagination-position={position}>
    <p className="portal-catalog-range" aria-live={position === 'top' ? 'polite' : 'off'} aria-atomic="true">
      {start}–{end} / {total} · Page {page + 1} / {pageCount}
    </p>
    {position === 'top' && <label className="portal-page-size">
      <span>{fr ? 'Par page' : 'Per page'}</span>
      <select aria-label={`${label} · ${fr ? 'Par page' : 'Per page'}`} value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))}>
        {CATALOG_PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
      </select>
    </label>}
    <div className="portal-catalog-page-buttons">
      {[
        { target: 0, glyph: '«', name: fr ? 'Première page' : 'First page', disabled: page === 0 },
        { target: page - 1, glyph: '‹', name: fr ? 'Page précédente' : 'Previous page', disabled: page === 0 },
        { target: page + 1, glyph: '›', name: fr ? 'Page suivante' : 'Next page', disabled: page + 1 >= pageCount },
        { target: pageCount - 1, glyph: '»', name: fr ? 'Dernière page' : 'Last page', disabled: page + 1 >= pageCount }
      ].map(control => <button key={control.name} type="button" className="btn-retro" aria-controls={controlsId} aria-label={control.name} title={control.name} disabled={control.disabled} onClick={() => onPageChange(control.target)}>{control.glyph}</button>)}
    </div>
  </nav>;
}
