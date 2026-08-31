import React, { useId } from 'react';
import { CATALOG_PAGE_SIZES } from '../game/catalogPagination';
import './CatalogPagination.css';

export default function CatalogPagination({ catalogId, title, lang = 'fr', page, query, onQueryChange, onPageChange, onPageSizeChange, filters = [] }) {
  const inputId = useId();
  const french = lang === 'fr';
  return (
    <section className="catalog-pagination" data-catalog={catalogId} aria-label={title}>
      <label className="catalog-search" htmlFor={inputId}>
        <span>{french ? 'Rechercher' : 'Search'} — {title}</span>
        <input id={inputId} type="search" value={query} onChange={event => onQueryChange(event.target.value)} placeholder={french ? 'Nom, univers, rôle…' : 'Name, universe, role…'} />
      </label>
      <div className="catalog-filters">
        {filters.map(filter => (
          <label key={filter.id}>
            <span>{filter.label}</span>
            <select value={filter.value} onChange={event => filter.onChange(event.target.value)}>
              {filter.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ))}
        <label>
          <span>{french ? 'Par page' : 'Per page'}</span>
          <select value={page.pageSize} onChange={event => onPageSizeChange(Number(event.target.value))}>
            {CATALOG_PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>
      <div className="catalog-page-status" aria-live="polite" aria-atomic="true">
        {page.first}–{page.last} / {page.total} {french ? 'résultats' : 'results'}
        {page.total !== page.sourceTotal ? ' (' + page.sourceTotal + ' ' + (french ? 'au total' : 'total') + ')' : ''}
      </div>
      <nav className="catalog-page-controls" aria-label={'Pagination — ' + title}>
        <button type="button" className="btn-retro" onClick={() => onPageChange(1)} disabled={page.page <= 1} aria-label={french ? 'Première page' : 'First page'}>«</button>
        <button type="button" className="btn-retro" onClick={() => onPageChange(page.page - 1)} disabled={page.page <= 1} aria-label={french ? 'Page précédente' : 'Previous page'}>‹</button>
        <span>Page {page.page} / {page.pageCount}</span>
        <button type="button" className="btn-retro" onClick={() => onPageChange(page.page + 1)} disabled={page.page >= page.pageCount} aria-label={french ? 'Page suivante' : 'Next page'}>›</button>
        <button type="button" className="btn-retro" onClick={() => onPageChange(page.pageCount)} disabled={page.page >= page.pageCount} aria-label={french ? 'Dernière page' : 'Last page'}>»</button>
      </nav>
      {page.total === 0 ? <p className="catalog-empty">{french ? 'Aucun résultat. Modifie la recherche ou les filtres.' : 'No results. Change the search or filters.'}</p> : null}
    </section>
  );
}
