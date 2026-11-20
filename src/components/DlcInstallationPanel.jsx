import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { DLC_PACK_MANIFESTS } from '../../DLC/index.js';
import { getDlcInstallationSummary, isDlcPackInstalled } from '../game/dlcInstallation.js';
import { getDlcInstallationCatalogPage, getDlcPackContentKinds } from '../game/dlcInstallationCatalog.js';
import './DlcInstallationPanel.css';

const CONTENT_LABELS = {
  heroes: { fr: 'Personnages', en: 'Characters' },
  enemies: { fr: 'Adversaires', en: 'Enemies' },
  stages: { fr: 'Scènes et missions', en: 'Stages and missions' },
  lore: { fr: 'Archives', en: 'Archives' },
  items: { fr: 'Objets', en: 'Items' },
  wardrobe: { fr: 'Tenues et apparences', en: 'Wardrobe and appearances' }
};

function PackRecord({ pack, included, lang }) {
  const fr = lang === 'fr';
  const artworkOnly = pack.registration === 'artwork-only';
  const contentKinds = getDlcPackContentKinds(pack);
  return <li data-pack-id={pack.id} data-included={included}>
    <details className="dlc-installation-record" data-pack-id={pack.id} data-included={included}>
      <summary>
        <span className="dlc-installation-record-heading">
          <strong>{pack.universe}</strong>
          <span className="system-pack-state" data-included={included}>{included ? (fr ? 'Inclus' : 'Included') : (fr ? 'Non inclus' : 'Not included')}</span>
        </span>
        <span className="dlc-installation-record-type">{artworkOnly ? (fr ? 'Illustrations uniquement' : 'Artwork only') : (fr ? 'Dossier d’univers' : 'Universe dossier')}</span>
        <span className="dlc-installation-record-hint">{fr ? 'Consulter le contenu et son inclusion' : 'Inspect content and inclusion'}</span>
      </summary>
      <div className="dlc-installation-record-body">
        <p>{included
          ? (fr ? 'Ce pack fait partie de cette édition.' : 'This pack is included in this edition.')
          : (fr ? 'Ce pack ne fait pas partie de cette édition. Vos possessions, votre progression et vos préférences le concernant restent sauvegardées.' : 'This pack is not part of this edition. Your possessions, progress and preferences for it remain saved.')}</p>
        {artworkOnly ? <p className="dlc-installation-artwork-note">{fr ? 'Ce dossier contient des illustrations. Il ne déclare pas d’univers jouable.' : 'This dossier contains artwork. It does not declare a playable universe.'}</p> : <>
          {contentKinds.length > 0 && <div>
            <h4>{fr ? 'Contenus déclarés' : 'Declared content'}</h4>
            <ul className="dlc-installation-content-kinds">{contentKinds.map(kind => <li key={kind}>{CONTENT_LABELS[kind][lang] || CONTENT_LABELS[kind].en}</li>)}</ul>
          </div>}
          <p className="dlc-installation-record-note">{fr ? 'Les contenus inclus restent soumis aux déblocages de progression et aux choix de réserve dans la Régulation A.R.C.A.' : 'Included content remains subject to progression unlocks and reserve choices in A.R.C.A. Regulation.'}</p>
        </>}
      </div>
    </details>
  </li>;
}

export default function DlcInstallationPanel({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const headingId = useId();
  const searchId = useId();
  const filterId = useId();
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const pageRequested = useRef(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const summary = getDlcInstallationSummary();
  const catalog = getDlcInstallationCatalogPage(DLC_PACK_MANIFESTS, { query, filter, page, isPackIncluded: isDlcPackInstalled });
  useLayoutEffect(() => {
    if (!pageRequested.current) return;
    pageRequested.current = false;
    const firstRecord = listRef.current?.querySelector('summary');
    firstRecord?.focus({ preventScroll: true });
    firstRecord?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [catalog.page]);
  const changePage = next => {
    pageRequested.current = true;
    setPage(next);
  };
  const editionName = summary.mode === 'all' ? (fr ? 'Édition complète' : 'Complete edition')
    : summary.mode === 'base' ? (fr ? 'Édition de base' : 'Base edition')
      : (fr ? 'Édition sélectionnée' : 'Selected edition');
  const editionDescription = summary.mode === 'all'
    ? (fr ? 'Tous les packs du registre sont inclus dans cette édition.' : 'Every pack in the registry is included in this edition.')
    : summary.mode === 'base'
      ? (fr ? 'La campagne A.R.C.A. reste disponible. Les packs d’univers du registre ne sont pas livrés avec cette édition.' : 'The A.R.C.A. campaign remains available. Universe packs from the registry are not delivered with this edition.')
      : (fr ? 'Cette édition contient la sélection de packs indiqués comme inclus ci-dessous.' : 'This edition contains the selection of packs marked as included below.');
  const allIncludedEmpty = filter === 'missing' && summary.mode === 'all';
  const baseIncludedEmpty = filter === 'installed' && summary.mode === 'base';
  const reset = () => {
    setQuery(''); setFilter('all'); setPage(0);
    searchRef.current?.focus();
  };
  return <section className="system-pack-panel dlc-installation-panel" aria-labelledby={headingId} data-edition-mode={summary.mode}>
    <header className="dlc-installation-edition">
      <p className="dlc-installation-kicker">{fr ? 'A.R.C.A. · Registre des contenus' : 'A.R.C.A. · Content registry'}</p>
      <h3 id={headingId}>{editionName}</h3>
      <p className="system-edition-count"><strong>{summary.installedCount} / {summary.availableCount}</strong> {fr ? 'packs inclus' : 'included packs'}</p>
    </header>
    <details className="dlc-installation-guidance">
      <summary>{fr ? 'Vos données sont conservées' : 'Your saved data is preserved'}</summary>
      <p>{editionDescription}</p>
      <p>{fr ? 'L’inclusion décrit le contenu de cette édition. Les déblocages et la mise en réserve se règlent séparément. Les possessions et préférences des packs absents restent sauvegardées.' : 'Inclusion describes the content of this edition. Unlocks and reserve choices are handled separately. Possessions and preferences for absent packs remain saved.'}</p>
    </details>
    <div className="system-pack-filters dlc-installation-filters">
      <label htmlFor={searchId}><span>{fr ? 'Rechercher un univers' : 'Search a universe'}</span>
        <input ref={searchRef} id={searchId} type="search" value={query} placeholder={fr ? 'Nom de l’univers ou du pack' : 'Universe or pack name'} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
      <label htmlFor={filterId}><span>{fr ? 'Afficher les packs' : 'Show packs'}</span>
        <select id={filterId} value={filter} onChange={event => { setFilter(event.target.value); setPage(0); }}>
          <option value="all">{fr ? 'Tous les packs' : 'All packs'}</option>
          <option value="installed">{fr ? 'Inclus' : 'Included'}</option>
          <option value="missing">{fr ? 'Non inclus' : 'Not included'}</option>
          <option value="artwork">{fr ? 'Illustrations uniquement' : 'Artwork only'}</option>
        </select></label>
      <button type="button" className="dlc-installation-action dlc-installation-reset" disabled={!query && filter === 'all' && page === 0} onClick={reset}>{fr ? 'Réinitialiser les filtres' : 'Reset filters'}</button>
    </div>
    <p className="dlc-installation-results" role="status" aria-live="polite" aria-atomic="true">
      {fr ? `${catalog.start}–${catalog.end} / ${catalog.total} résultat(s) · Page ${catalog.page + 1} sur ${catalog.pageCount}` : `${catalog.start}–${catalog.end} / ${catalog.total} result(s) · Page ${catalog.page + 1} of ${catalog.pageCount}`}
    </p>
    {catalog.total === 0 ? <div className="dlc-installation-empty">
      <h4>{allIncludedEmpty ? (fr ? 'Tous les packs sont inclus' : 'Every pack is included') : baseIncludedEmpty ? (fr ? 'Aucun pack DLC inclus' : 'No DLC packs included') : (fr ? 'Aucun univers trouvé' : 'No universes found')}</h4>
      <p>{allIncludedEmpty ? (fr ? 'L’édition complète ne contient aucun pack absent. Retrouvez les dossiers dans le registre complet.' : 'The complete edition has no absent packs. Browse their dossiers in the full registry.')
        : baseIncludedEmpty ? (fr ? 'La campagne A.R.C.A. reste disponible dans l’édition de base. Consultez le registre pour découvrir les packs des autres éditions.' : 'The A.R.C.A. campaign remains available in the base edition. Browse the registry to inspect packs from other editions.')
          : (fr ? 'Essayez un autre nom ou réinitialisez la recherche et les filtres.' : 'Try another name or reset the search and filters.')}</p>
      <button type="button" className="dlc-installation-action" onClick={reset}>{fr ? 'Voir tous les packs' : 'Show all packs'}</button>
    </div> : <>
      <ul ref={listRef} className="system-pack-list dlc-installation-list">{catalog.items.map(pack => <PackRecord key={pack.id} pack={pack} included={isDlcPackInstalled(pack.id)} lang={lang} />)}</ul>
      <nav className="system-pack-pagination dlc-installation-pagination" aria-label={fr ? 'Pages des packs' : 'Pack pages'}>
        <span aria-hidden="true">{fr ? 'Page' : 'Page'} {catalog.page + 1} / {catalog.pageCount}</span>
        <button type="button" className="dlc-installation-action" disabled={catalog.page === 0} onClick={() => changePage(catalog.page - 1)}>{fr ? 'Précédent' : 'Previous'}</button>
        <button type="button" className="dlc-installation-action" disabled={catalog.page + 1 >= catalog.pageCount} onClick={() => changePage(catalog.page + 1)}>{fr ? 'Suivant' : 'Next'}</button>
      </nav>
    </>}
    <p className="dlc-installation-delivery-note">{fr ? 'Ce registre décrit les packs livrés avec l’édition. Il ne télécharge ni n’installe de contenu pendant une partie.' : 'This registry describes the packs delivered with the edition. It does not download or install content during a run.'}</p>
  </section>;
}
