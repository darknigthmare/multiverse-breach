import React, { useId, useLayoutEffect, useRef } from 'react';
import { CATALOG_PAGE_SIZES, paginateCatalog } from '../game/catalogPagination.js';
import { archiveSearchText } from '../game/universeArchiveView.js';

function ArchivePages({ page, lang, title, controlsId, onPage, position }) {
  const fr = lang === 'fr';
  return <nav className="universe-archive-pages" aria-label={`${title} · Pages`} data-archive-pagination={position}>
    <p aria-live={position === 'top' ? 'polite' : 'off'} aria-atomic="true">
      {page.first}–{page.last} / {page.total} · Page {page.page} / {page.pageCount}
      {page.total !== page.sourceTotal && <span> · {page.sourceTotal} {fr ? 'au total' : 'in total'}</span>}
    </p>
    <div>
      {[
        [1, '«', fr ? 'Première page' : 'First page', page.page === 1],
        [page.page - 1, '‹', fr ? 'Page précédente' : 'Previous page', page.page === 1],
        [page.page + 1, '›', fr ? 'Page suivante' : 'Next page', page.page === page.pageCount],
        [page.pageCount, '»', fr ? 'Dernière page' : 'Last page', page.page === page.pageCount]
      ].map(([target, glyph, label, disabled]) => <button key={label} type="button" aria-label={label} aria-controls={controlsId} disabled={disabled} onClick={() => onPage(target)}>{glyph}</button>)}
    </div>
  </nav>;
}

export default function UniverseArchiveCatalog({ catalogId, title, entries, lang, view = {}, onViewChange, children, getSearchText = archiveSearchText, emptyMessage }) {
  const uid = useId();
  const heading = useRef(null);
  const search = useRef(null);
  const focusPage = useRef(false);
  const page = paginateCatalog(entries, { ...view, getSearchText });
  const fr = lang === 'fr';
  const resultsId = `${uid}-results`;
  // Commit focus with the page update. A deferred frame could otherwise steal
  // focus back after this reader closes or a different dialog opens.
  useLayoutEffect(() => {
    if (!focusPage.current) return;
    focusPage.current = false;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [page.page, page.pageSize, view.query]);
  const onPage = next => {
    if (next === page.page) return;
    focusPage.current = true;
    onViewChange({ page: next });
  };
  return <section className="universe-archive-catalog" data-archive-catalog={catalogId} aria-labelledby={`${uid}-title`}>
    <h3 id={`${uid}-title`} ref={heading} tabIndex={0}>{title} <span>({entries.length})</span></h3>
    <div className="universe-archive-filters">
      <label htmlFor={`${uid}-search`}>
        <span>{fr ? 'Rechercher' : 'Search'} — {title}</span>
        <input ref={search} id={`${uid}-search`} type="search" value={view.query || ''} onChange={event => onViewChange({ query: event.target.value })} placeholder={fr ? 'Nom, description, origine…' : 'Name, description, origin…'} aria-controls={resultsId} />
      </label>
      <button type="button" className="universe-archive-clear" disabled={!view.query} onClick={() => { onViewChange({ query: '' }); search.current?.focus({ preventScroll: true }); }}>{fr ? 'Effacer' : 'Clear'}</button>
      <label htmlFor={`${uid}-size`}>
        <span>{fr ? 'Par page' : 'Per page'}</span>
        <select id={`${uid}-size`} aria-label={`${title} · ${fr ? 'Par page' : 'Per page'}`} value={page.pageSize} onChange={event => onViewChange({ pageSize: Number(event.target.value) })} aria-controls={resultsId}>
          {CATALOG_PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </div>
    <ArchivePages page={page} title={title} lang={lang} controlsId={resultsId} onPage={onPage} position="top" />
    <div id={resultsId} className="universe-archive-entries">
      {page.items.length ? children(page.items) : <p className="universe-archive-empty">{entries.length ? (fr ? 'Aucun résultat. Modifie ou efface la recherche.' : 'No results. Change or clear the search.') : emptyMessage || (fr ? 'Aucune entrée indexée dans ce catalogue.' : 'No entries indexed in this catalogue.')}</p>}
    </div>
    {page.pageCount > 1 && <ArchivePages page={page} title={title} lang={lang} controlsId={resultsId} onPage={onPage} position="bottom" />}
  </section>;
}
