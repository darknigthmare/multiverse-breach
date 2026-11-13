import React, { useMemo, useState } from 'react';
import CatalogPagination from './CatalogPagination';
import { paginateCatalog } from '../game/catalogPagination';

// Keep archive access decisions in the Hub. This view only searches and pages
// the records it receives, without changing progress or revealing hidden arcs.
export default function HubCodexRecords({ id, title, lang, records, children }) {
  const [view, setView] = useState({ query: '', page: 1, pageSize: 12 });
  const page = useMemo(() => paginateCatalog(records, {
    ...view, getSearchText: record => typeof record === 'string' ? record : [record.id, record.title?.[lang], record.universe, record.universes?.join(' '), record.intro?.[lang], record.premise?.[lang]].filter(Boolean).join(' ')
  }), [records, view, lang]);
  return (
    <section aria-label={title}>
      <CatalogPagination catalogId={id} title={title} lang={lang} page={page} query={view.query} collapsibleFilters
        onQueryChange={query => setView(previous => ({ ...previous, query, page: 1 }))}
        onPageChange={next => setView(previous => ({ ...previous, page: next }))}
        onPageSizeChange={pageSize => setView(previous => ({ ...previous, pageSize, page: 1 }))} />
      <div className="hub-codex-records-grid">{page.items.map(children)}</div>
    </section>
  );
}
