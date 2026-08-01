import React, {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST,
  getPortalVisual,
  resolvePortalVisual
} from '../../game/visuals/portalVisualCatalog';
import PortalAtlas from '../visuals/PortalAtlas';
import './portalLab.css';

const NOOP = () => {};
const EMPTY_UNIVERSES = Object.freeze([]);
const PENDING_REVIEW = Object.freeze({
  lore: false,
  composition: false,
  alpha: false,
  distinctFrames: false,
  approvedAt: null
});
const FRAME_PREVIEWS = Object.freeze([
  { phase: 'sealed', fr: '1. AMORCE', en: '1. DORMANT' },
  { phase: 'charging', fr: '2. OUVERTURE', en: '2. OPENING' },
  { phase: 'opening', fr: '3. MAXIMUM', en: '3. FULLY OPEN' },
  { phase: 'complete', fr: '4. STABLE', en: '4. STABLE' }
]);
const REVIEW_FIELDS = Object.freeze([
  { key: 'lore', fr: 'LORE', en: 'LORE' },
  { key: 'composition', fr: 'COMPOSITION', en: 'COMPOSITION' },
  { key: 'alpha', fr: 'ALPHA', en: 'ALPHA' },
  { key: 'distinctFrames', fr: 'FRAMES DISTINCTES', en: 'DISTINCT FRAMES' }
]);

const normalizeSearch = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase();

const formatApprovalDate = (value, locale) => {
  if (!value) return locale === 'fr' ? 'EN ATTENTE' : 'PENDING';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return String(value);
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp);
};

const makeProductionEntry = universe => Object.freeze({
  universe,
  slug: normalizeSearch(universe).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  continuityId: 'review-pending',
  status: 'production',
  promptVersion: 'pending',
  source: 'nexus-fallback',
  motifs: EMPTY_UNIVERSES,
  materials: EMPTY_UNIVERSES,
  palette: EMPTY_UNIVERSES,
  mustAvoid: EMPTY_UNIVERSES,
  officialReferenceUrls: EMPTY_UNIVERSES,
  review: PENDING_REVIEW,
  referenceDossier: null
});

function MetadataList({ label, values }) {
  if (!Array.isArray(values) || values.length === 0) return null;
  return (
    <div className="portal-lab__metadata-group">
      <dt>{label}</dt>
      <dd className="portal-lab__chips">
        {values.map(value => <span key={value}>{value}</span>)}
      </dd>
    </div>
  );
}

export default function PortalLab({
  isOpen = true,
  lang = 'fr',
  initialUniverse,
  universes = EMPTY_UNIVERSES,
  onClose = NOOP
}) {
  const locale = lang === 'en' ? 'en' : 'fr';
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUniverse, setSelectedUniverse] = useState(
    () => initialUniverse || PORTAL_VISUAL_MANIFEST[0]?.universe || PORTAL_FALLBACK_VISUAL.universe
  );
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearch(deferredQuery.trim());
  const labManifest = useMemo(() => {
    const entries = new Map(PORTAL_VISUAL_MANIFEST.map(entry => [entry.universe, entry]));
    entries.set(PORTAL_FALLBACK_VISUAL.universe, PORTAL_FALLBACK_VISUAL);
    universes.forEach(universe => {
      const name = String(universe || '').trim();
      if (name && !entries.has(name)) entries.set(name, makeProductionEntry(name));
    });
    return Array.from(entries.values()).sort((left, right) => (
      left.universe.localeCompare(right.universe, locale === 'fr' ? 'fr' : 'en')
    ));
  }, [locale, universes]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedUniverse(previous => {
      if (initialUniverse && labManifest.some(item => item.universe === initialUniverse)) {
        return initialUniverse;
      }
      if (labManifest.some(item => item.universe === previous)) return previous;
      return labManifest[0]?.universe || '';
    });
  }, [initialUniverse, isOpen, labManifest]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  const filteredManifest = useMemo(() => labManifest.filter(entry => {
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = normalizeSearch([
      entry.universe,
      entry.slug,
      entry.continuityId,
      ...(entry.motifs || []),
      ...(entry.materials || [])
    ].join(' '));
    return haystack.includes(normalizedQuery);
  }), [labManifest, normalizedQuery, statusFilter]);

  if (!isOpen) return null;

  const manifestEntry = labManifest.find(
    entry => entry.universe === selectedUniverse
  ) || labManifest[0] || null;
  const exactVisual = manifestEntry ? getPortalVisual(manifestEntry.universe) : null;
  const resolvedVisual = manifestEntry
    ? resolvePortalVisual(manifestEntry.universe)
    : null;
  const metadata = manifestEntry || resolvedVisual;
  const atlas = resolvedVisual?.atlas;
  const isApproved = metadata?.status === 'approved'
    && exactVisual
    && !resolvedVisual?.isFallback;
  const statusLabel = isApproved
    ? (locale === 'fr' ? 'APPROUVE' : 'APPROVED')
    : (locale === 'fr' ? 'PORTAIL EN PRODUCTION' : 'PORTAL IN PRODUCTION');

  const lab = (
    <div
      className="portal-lab-overlay"
      data-portal-lab-overlay="true"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="portal-lab"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="portal-lab__header">
          <div>
            <span className="portal-lab__eyebrow">A.R.C.A. / PORTAL LAB P3</span>
            <h2 id={titleId}>{locale === 'fr' ? 'Validation des portails de Trame' : 'Thread portal validation'}</h2>
            <p id={descriptionId}>
              {locale === 'fr'
                ? 'Controle lore, droits, transparence et progression des quatre frames avant approbation.'
                : 'Review lore, rights, transparency, and four-frame progression before approval.'}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="portal-lab__close"
            onClick={onClose}
            aria-label={locale === 'fr' ? 'Fermer Portal Lab' : 'Close Portal Lab'}
          >
            ×
          </button>
        </header>

        <div className="portal-lab__workspace">
          <aside className="portal-lab__sidebar" aria-label={locale === 'fr' ? 'Trames' : 'Threads'}>
            <label className="portal-lab__search">
              <span>{locale === 'fr' ? 'RECHERCHE' : 'SEARCH'}</span>
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={locale === 'fr' ? 'Univers, continuite, motif...' : 'Universe, continuity, motif...'}
              />
            </label>
            <label className="portal-lab__filter">
              <span>{locale === 'fr' ? 'ETAT' : 'STATUS'}</span>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                <option value="all">{locale === 'fr' ? 'TOUS' : 'ALL'}</option>
                <option value="approved">{locale === 'fr' ? 'APPROUVES' : 'APPROVED'}</option>
                <option value="production">{locale === 'fr' ? 'EN PRODUCTION' : 'IN PRODUCTION'}</option>
              </select>
            </label>
            <div className="portal-lab__results" aria-live="polite">
              {filteredManifest.length} {locale === 'fr' ? 'Trame(s)' : 'Thread(s)'}
            </div>
            <div className="portal-lab__universe-list">
              {filteredManifest.map(entry => (
                <button
                  type="button"
                  key={entry.universe}
                  className={entry.universe === metadata?.universe ? 'selected' : ''}
                  onClick={() => setSelectedUniverse(entry.universe)}
                  aria-current={entry.universe === metadata?.universe ? 'true' : undefined}
                >
                  <span>{entry.universe}</span>
                  <small data-status={entry.status}>
                    {entry.status === 'approved'
                      ? (locale === 'fr' ? 'APPROUVE' : 'APPROVED')
                      : (locale === 'fr' ? 'PRODUCTION' : 'PRODUCTION')}
                  </small>
                </button>
              ))}
              {filteredManifest.length === 0 ? (
                <p className="portal-lab__empty">
                  {locale === 'fr' ? 'Aucune Trame correspondante.' : 'No matching Thread.'}
                </p>
              ) : null}
            </div>
          </aside>

          <main className="portal-lab__inspection">
            {metadata && atlas ? (
              <>
                <div className="portal-lab__inspection-heading">
                  <div>
                    <span className="portal-lab__continuity">{metadata.continuityId || 'continuity-pending'}</span>
                    <h3>{metadata.universe}</h3>
                  </div>
                  <strong className="portal-lab__status" data-approved={isApproved ? 'true' : 'false'}>
                    {statusLabel}
                  </strong>
                </div>

                {!isApproved ? (
                  <p className="portal-lab__fallback-notice" role="status">
                    {locale === 'fr'
                      ? 'Aucun portail specifique approuve : la previsualisation utilise explicitement le portail Nexus.'
                      : 'No approved specific portal: this preview explicitly uses the Nexus portal.'}
                  </p>
                ) : null}

                <section className="portal-lab__visual-review" aria-label={locale === 'fr' ? 'Atlas et frames' : 'Atlas and frames'}>
                  <figure className="portal-lab__master-atlas">
                    <img
                      src={atlas.sheet}
                      alt={locale === 'fr'
                        ? `Atlas complet du portail ${metadata.universe}`
                        : `Full ${metadata.universe} portal atlas`}
                    />
                    <figcaption>
                      ATLAS {atlas.width}×{atlas.height} / {atlas.columns}×{atlas.rows} / {atlas.frames} FRAMES
                    </figcaption>
                  </figure>
                  <div className="portal-lab__frames">
                    {FRAME_PREVIEWS.map(framePreview => (
                      <figure key={framePreview.phase}>
                        <PortalAtlas
                          universe={metadata.universe}
                          openingPhase={framePreview.phase}
                          lang={locale}
                          label={`${metadata.universe}, ${framePreview[locale]}`}
                        />
                        <figcaption>{framePreview[locale]}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>

                <div className="portal-lab__data-grid">
                  <section className="portal-lab__panel">
                    <h4>{locale === 'fr' ? 'METADONNEES' : 'METADATA'}</h4>
                    <dl className="portal-lab__metadata">
                      <div><dt>UNIVERSE</dt><dd>{metadata.universe}</dd></div>
                      <div><dt>CONTINUITY</dt><dd>{metadata.continuityId || '—'}</dd></div>
                      <div><dt>PROMPT VERSION</dt><dd>{metadata.promptVersion || '—'}</dd></div>
                      <div><dt>SOURCE</dt><dd>{metadata.source || atlas.source || '—'}</dd></div>
                      <MetadataList label="MOTIFS" values={metadata.motifs} />
                      <MetadataList label="MATERIALS" values={metadata.materials} />
                      <MetadataList label="PALETTE" values={metadata.palette} />
                      <MetadataList label="MUST AVOID" values={metadata.mustAvoid} />
                    </dl>
                  </section>

                  <section className="portal-lab__panel">
                    <h4>{locale === 'fr' ? 'REVUE' : 'REVIEW'}</h4>
                    <div className="portal-lab__review-grid">
                      {REVIEW_FIELDS.map(field => {
                        const passed = metadata.review?.[field.key] === true;
                        return (
                          <span key={field.key} data-passed={passed ? 'true' : 'false'}>
                            <i aria-hidden="true">{passed ? '✓' : '!'}</i>
                            {field[locale]}
                          </span>
                        );
                      })}
                    </div>
                    <p className="portal-lab__approval-date">
                      <strong>{locale === 'fr' ? 'APPROBATION' : 'APPROVAL'}</strong>
                      {formatApprovalDate(metadata.review?.approvedAt, locale)}
                    </p>
                    {metadata.referenceDossier ? (
                      <a className="portal-lab__dossier-link" href={metadata.referenceDossier} target="_blank" rel="noreferrer">
                        {locale === 'fr' ? 'OUVRIR LE REFERENCE-DOSSIER.JSON' : 'OPEN REFERENCE-DOSSIER.JSON'}
                      </a>
                    ) : null}
                  </section>
                </div>

                <section className="portal-lab__sources portal-lab__panel">
                  <h4>{locale === 'fr' ? 'SOURCES OFFICIELLES OU VERIFIABLES' : 'OFFICIAL OR VERIFIABLE SOURCES'}</h4>
                  {metadata.officialReferenceUrls?.length ? (
                    <ul>
                      {metadata.officialReferenceUrls.map(url => (
                        <li key={url}>
                          <a href={url} target="_blank" rel="noreferrer">{url}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{locale === 'fr' ? 'Sources en attente de revue.' : 'Sources pending review.'}</p>
                  )}
                </section>
              </>
            ) : (
              <p className="portal-lab__empty">
                {locale === 'fr' ? 'Manifeste portail vide.' : 'Portal manifest is empty.'}
              </p>
            )}
          </main>
        </div>
      </section>
    </div>
  );

  return typeof document === 'undefined' ? lab : createPortal(lab, document.body);
}
