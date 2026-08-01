import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CG_CATALOG } from '../../game/cg/cgCatalog';
import {
  CG_FAMILIES,
  filterCgCatalogByRegulation,
  isCgUnlocked,
  resolveCgMedia
} from '../../game/cg/cgSchema';
import './cgGallery.css';

export const CG_FAVORITES_STORAGE_KEY = 'multiverse-breach-cg-gallery-favorites-v1';

const FAMILY_LABELS = Object.freeze({
  Canon: { fr: 'CANON', en: 'CANON' },
  Nexus: { fr: 'NEXUS', en: 'NEXUS' },
  'Fan Art': { fr: 'FAN ART', en: 'FAN ART' },
  'What If': { fr: 'WHAT IF', en: 'WHAT IF' }
});

const TYPE_LABELS = Object.freeze({
  characterSolo: { fr: 'Personnage seul', en: 'Character solo' },
  weaponSolo: { fr: 'Arme / objet', en: 'Weapon / item' },
  decorSolo: { fr: 'Décor', en: 'Environment' },
  coherentScene: { fr: 'Scène narrative', en: 'Narrative scene' },
  actionScene: { fr: 'Scène d’action', en: 'Action scene' },
  introPose: { fr: 'Pose d’arrivée', en: 'Intro pose' },
  victoryPose: { fr: 'Pose de victoire', en: 'Victory pose' },
  defeatPose: { fr: 'Pose de repli', en: 'Defeat pose' },
  beachFamily: { fr: 'Plage familiale', en: 'Family beach' },
  maidService: { fr: 'Tenue de service', en: 'Service outfit' },
  affection: { fr: 'Affection amicale', en: 'Friendly affection' },
  goofy: { fr: 'Gag fidèle', en: 'Faithful gag' },
  alignmentSwap: { fr: 'Alignement inversé', en: 'Alignment swap' },
  genderSwap: { fr: 'Genre inversé', en: 'Gender swap' },
  iconicOutfitSwap: { fr: 'Tenue iconique inversée', en: 'Iconic outfit swap' },
  zombieVersion: { fr: 'Infection / corruption', en: 'Infection / corruption' },
  futureExperienced: { fr: 'Futur expérimenté', en: 'Experienced future' },
  firstStep: { fr: 'Premiers pas', en: 'First step' }
});

const RARITY_LABELS = Object.freeze({
  stable: { fr: 'Stable', en: 'Stable' },
  rare: { fr: 'Rare', en: 'Rare' },
  epic: { fr: 'Épique', en: 'Epic' },
  anomaly: { fr: 'Anomalie', en: 'Anomaly' }
});

const getText = (value, lang, fallback = '') => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || fallback;
};

const uniqueOptions = (entries, key, labelKey, lang) => Array.from(
  new Map(entries.map((entry) => [entry[key], getText(entry[labelKey], lang, entry[key])])).entries()
).map(([value, label]) => ({ value, label }))
  .sort((left, right) => left.label.localeCompare(right.label, lang));

const loadFavoriteIds = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = JSON.parse(window.localStorage.getItem(CG_FAVORITES_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(stored) ? stored.map(String) : []);
  } catch {
    return new Set();
  }
};

const isExternalReference = (reference) => /^https?:\/\//i.test(reference);
const clampZoom = (value) => Math.min(3, Math.max(1, Number(value) || 1));
const EMPTY_LIST = Object.freeze([]);
const PANEL_ID = 'cg-gallery-family-panel';
const getFamilyTabId = (family) => `cg-gallery-family-${family.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
const getImageAlt = (entry, title, locale) => {
  if (entry.rightsClass === 'project-original') {
    return locale === 'fr'
      ? `${title}, création originale du projet avec OpenAI`
      : `${title}, original OpenAI project creation`;
  }
  return locale === 'fr'
    ? `${title}, fan-art OpenAI original non officiel`
    : `${title}, original unofficial OpenAI fan art`;
};

export default function CgGallery({
  lang = 'fr',
  entries = CG_CATALOG,
  unlockedHeroes = EMPTY_LIST,
  hiddenUniverses = EMPTY_LIST,
  disabledHeroIds = EMPTY_LIST,
  onClose
}) {
  const locale = lang === 'en' ? 'en' : 'fr';
  const fullCatalog = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const catalog = useMemo(() => filterCgCatalogByRegulation(fullCatalog, {
    hiddenUniverses,
    disabledHeroes: disabledHeroIds
  }), [disabledHeroIds, fullCatalog, hiddenUniverses]);
  const closeLightboxRef = useRef(null);
  const familyTabRefs = useRef(new Map());
  const lightboxRef = useRef(null);
  const lightboxTriggerRef = useRef(null);
  const [activeFamily, setActiveFamily] = useState('Canon');
  const [universeFilter, setUniverseFilter] = useState('all');
  const [characterFilter, setCharacterFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [publishedAtFilter, setPublishedAtFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds);
  const [selectedCgId, setSelectedCgId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [compareWithBase, setCompareWithBase] = useState(false);

  const progression = useMemo(() => ({
    unlockedHeroes: Array.isArray(unlockedHeroes) ? unlockedHeroes : []
  }), [unlockedHeroes]);

  const galleryEntries = useMemo(() => catalog.map((entry) => ({
    definition: entry,
    unlocked: isCgUnlocked(entry, progression),
    media: resolveCgMedia(entry, progression)
  })), [catalog, progression]);

  const universeOptions = useMemo(
    () => uniqueOptions(catalog, 'universeKey', 'universeName', locale),
    [catalog, locale]
  );
  const characterOptions = useMemo(
    () => uniqueOptions(catalog, 'characterId', 'characterName', locale),
    [catalog, locale]
  );
  const typeOptions = useMemo(() => Array.from(new Set(catalog.map((entry) => entry.type)))
    .map((value) => ({ value, label: getText(TYPE_LABELS[value], locale, value) })), [catalog, locale]);
  const rarityOptions = useMemo(() => Array.from(new Set(catalog.map((entry) => entry.rarity)))
    .map((value) => ({ value, label: getText(RARITY_LABELS[value], locale, value) })), [catalog, locale]);
  const publishedAtOptions = useMemo(() => Array.from(new Set(catalog.map((entry) => entry.publishedAt)))
    .sort((left, right) => right.localeCompare(left)), [catalog]);

  const filteredEntries = useMemo(() => galleryEntries.filter(({ definition }) => {
    if (definition.family !== activeFamily) return false;
    if (universeFilter !== 'all' && definition.universeKey !== universeFilter) return false;
    if (characterFilter !== 'all' && definition.characterId !== characterFilter) return false;
    if (typeFilter !== 'all' && definition.type !== typeFilter) return false;
    if (rarityFilter !== 'all' && definition.rarity !== rarityFilter) return false;
    if (publishedAtFilter !== 'all' && definition.publishedAt !== publishedAtFilter) return false;
    if (favoritesOnly && !favoriteIds.has(definition.id)) return false;
    return true;
  }), [
    activeFamily,
    characterFilter,
    favoriteIds,
    favoritesOnly,
    galleryEntries,
    publishedAtFilter,
    rarityFilter,
    typeFilter,
    universeFilter
  ]);

  const selectedRecord = selectedCgId
    ? galleryEntries.find(({ definition }) => definition.id === selectedCgId) || null
    : null;
  const selectedCg = selectedRecord?.definition || null;
  const selectedMedia = selectedRecord?.media || null;
  const baseComparisonRecord = selectedCg?.type === 'characterSolo'
    ? null
    : galleryEntries.find(({ definition }) => (
        definition.characterId === selectedCg?.characterId && definition.type === 'characterSolo'
      )) || null;
  const baseComparisonCg = baseComparisonRecord?.definition || null;
  const baseComparisonMedia = baseComparisonRecord?.media || null;
  const unlockedCount = galleryEntries.filter((entry) => entry.unlocked).length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const serializableIds = [...favoriteIds].filter((cgId) => fullCatalog.some((entry) => entry.id === cgId));
    try {
      window.localStorage.setItem(CG_FAVORITES_STORAGE_KEY, JSON.stringify(serializableIds));
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }, [favoriteIds, fullCatalog]);

  useEffect(() => {
    if (selectedCgId && !selectedMedia?.imagePath) setSelectedCgId(null);
  }, [selectedCgId, selectedMedia]);

  useEffect(() => {
    if (!selectedCg || !selectedMedia?.imagePath || typeof document === 'undefined') return undefined;
    const previousOverflow = document.body.style.overflow;
    const trigger = lightboxTriggerRef.current;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedCgId(null);
        return;
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(lightboxRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []).filter((element) => !element.hidden && element.getClientRects().length > 0);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !lightboxRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom((current) => clampZoom(current + 0.25));
      }
      if (event.key === '-') {
        event.preventDefault();
        setZoom((current) => clampZoom(current - 0.25));
      }
      if (event.key === '0') {
        event.preventDefault();
        setZoom(1);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeLightboxRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [selectedCg, selectedMedia?.imagePath]);

  const toggleFavorite = (cgId) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(cgId)) next.delete(cgId);
      else next.add(cgId);
      return next;
    });
  };

  const openLightbox = (record, trigger) => {
    if (!record.unlocked || !record.media.imagePath) return;
    lightboxTriggerRef.current = trigger || null;
    setZoom(1);
    setCompareWithBase(false);
    setSelectedCgId(record.definition.id);
  };

  const handleFamilyKeyDown = (event, family) => {
    const currentIndex = CG_FAMILIES.indexOf(family);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % CG_FAMILIES.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + CG_FAMILIES.length) % CG_FAMILIES.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = CG_FAMILIES.length - 1;
    else return;

    event.preventDefault();
    const nextFamily = CG_FAMILIES[nextIndex];
    setActiveFamily(nextFamily);
    familyTabRefs.current.get(nextFamily)?.focus();
  };

  const closeLightbox = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement === lightboxRef.current) {
      void document.exitFullscreen?.();
    }
    setSelectedCgId(null);
    setZoom(1);
    setCompareWithBase(false);
  };

  const toggleFullscreen = () => {
    if (typeof document === 'undefined' || !lightboxRef.current) return;
    if (document.fullscreenElement === lightboxRef.current) {
      void document.exitFullscreen?.();
    } else {
      void lightboxRef.current.requestFullscreen?.();
    }
  };

  const resetFilters = () => {
    setUniverseFilter('all');
    setCharacterFilter('all');
    setTypeFilter('all');
    setRarityFilter('all');
    setPublishedAtFilter('all');
    setFavoritesOnly(false);
  };

  return (
    <section className="cg-gallery" aria-labelledby="cg-gallery-title">
      <header className="cg-gallery__header">
        <div>
          <span className="cg-gallery__eyebrow">A.R.C.A. / CG ARCHIVE</span>
          <h1 id="cg-gallery-title">{locale === 'fr' ? 'Galerie CG' : 'CG Gallery'}</h1>
          <p>
            {locale === 'fr'
              ? 'Illustrations originales du projet créées avec OpenAI. Les fan-arts sont non officiels et ne reproduisent aucun visuel éditeur.'
              : 'Original project illustrations created with OpenAI. Fan art is unofficial and does not reproduce publisher artwork.'}
          </p>
        </div>
        <div className="cg-gallery__header-actions">
          <span>{unlockedCount}/{catalog.length} {locale === 'fr' ? 'déverrouillées' : 'unlocked'}</span>
          {onClose ? (
            <button type="button" className="cg-gallery__secondary-button" onClick={onClose}>
              {locale === 'fr' ? 'FERMER' : 'CLOSE'}
            </button>
          ) : null}
        </div>
      </header>

      <nav className="cg-gallery__tabs" role="tablist" aria-label={locale === 'fr' ? 'Familles de CG' : 'CG families'}>
        {CG_FAMILIES.map((family) => (
          <button
            key={family}
            type="button"
            role="tab"
            id={getFamilyTabId(family)}
            aria-controls={PANEL_ID}
            aria-selected={activeFamily === family}
            tabIndex={activeFamily === family ? 0 : -1}
            className={activeFamily === family ? 'is-active' : ''}
            onClick={() => setActiveFamily(family)}
            onKeyDown={(event) => handleFamilyKeyDown(event, family)}
            ref={(node) => {
              if (node) familyTabRefs.current.set(family, node);
              else familyTabRefs.current.delete(family);
            }}
          >
            {getText(FAMILY_LABELS[family], locale, family)}
          </button>
        ))}
      </nav>

      <div className="cg-gallery__filters" aria-label={locale === 'fr' ? 'Filtres de galerie' : 'Gallery filters'}>
        <label>
          <span>{locale === 'fr' ? 'UNIVERS' : 'UNIVERSE'}</span>
          <select value={universeFilter} onChange={(event) => setUniverseFilter(event.target.value)}>
            <option value="all">{locale === 'fr' ? 'Tous' : 'All'}</option>
            {universeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>{locale === 'fr' ? 'PERSONNAGE' : 'CHARACTER'}</span>
          <select value={characterFilter} onChange={(event) => setCharacterFilter(event.target.value)}>
            <option value="all">{locale === 'fr' ? 'Tous' : 'All'}</option>
            {characterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>TYPE</span>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">{locale === 'fr' ? 'Tous' : 'All'}</option>
            {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>{locale === 'fr' ? 'RARETÉ' : 'RARITY'}</span>
          <select value={rarityFilter} onChange={(event) => setRarityFilter(event.target.value)}>
            <option value="all">{locale === 'fr' ? 'Toutes' : 'All'}</option>
            {rarityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>DATE</span>
          <select value={publishedAtFilter} onChange={(event) => setPublishedAtFilter(event.target.value)}>
            <option value="all">{locale === 'fr' ? 'Toutes' : 'All'}</option>
            {publishedAtOptions.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="cg-gallery__favorite-filter">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
          />
          <span>{locale === 'fr' ? 'FAVORIS' : 'FAVORITES'}</span>
        </label>
        <button type="button" className="cg-gallery__reset" onClick={resetFilters}>
          {locale === 'fr' ? 'RÉINITIALISER' : 'RESET'}
        </button>
      </div>

      <div className="cg-gallery__result-heading">
        <strong>{getText(FAMILY_LABELS[activeFamily], locale, activeFamily)}</strong>
        <span>{filteredEntries.length} {locale === 'fr' ? 'résultat(s)' : 'result(s)'}</span>
      </div>

      <div
        id={PANEL_ID}
        className="cg-gallery__grid"
        role="tabpanel"
        aria-labelledby={getFamilyTabId(activeFamily)}
      >
        {filteredEntries.map((record) => {
          const entry = record.definition;
          const favorite = favoriteIds.has(entry.id);
          const characterName = getText(entry.characterName, locale, entry.characterId);
          const title = getText(entry.title, locale, characterName);
          return (
            <article
              key={entry.id}
              className={`cg-gallery-card ${record.unlocked ? 'is-unlocked' : 'is-locked'}`}
              data-cg-family={entry.family}
              data-cg-type={entry.type}
              data-cg-character={entry.characterId}
              data-cg-unlocked={record.unlocked ? 'true' : 'false'}
            >
              <button
                type="button"
                className="cg-gallery-card__open"
                disabled={!record.unlocked}
                onClick={(event) => openLightbox(record, event.currentTarget)}
                aria-label={record.unlocked
                  ? `${locale === 'fr' ? 'Ouvrir' : 'Open'} ${title}`
                  : `${title}, ${locale === 'fr' ? 'verrouillé' : 'locked'}`}
              >
                <span className="cg-gallery-card__media">
                  {record.media.thumbnailPath ? (
                    <img
                      src={record.media.thumbnailPath}
                      alt={getImageAlt(entry, title, locale)}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  ) : (
                    <span className="cg-gallery-card__lock" aria-hidden="true">
                      <b>◇</b>
                      <small>{locale === 'fr' ? 'HÉROS REQUIS' : 'HERO REQUIRED'}</small>
                    </span>
                  )}
                </span>
                <span className="cg-gallery-card__copy">
                  <small>{getText(entry.universeName, locale, entry.universeKey)}</small>
                  <strong>{characterName}</strong>
                  <span>{getText(TYPE_LABELS[entry.type], locale, entry.type)} / {getText(RARITY_LABELS[entry.rarity], locale, entry.rarity)}</span>
                </span>
              </button>
              <button
                type="button"
                className={`cg-gallery-card__favorite ${favorite ? 'is-favorite' : ''}`}
                aria-pressed={favorite}
                aria-label={favorite
                  ? (locale === 'fr' ? `Retirer ${title} des favoris` : `Remove ${title} from favorites`)
                  : (locale === 'fr' ? `Ajouter ${title} aux favoris` : `Add ${title} to favorites`)}
                onClick={() => toggleFavorite(entry.id)}
              >
                {favorite ? '★' : '☆'}
              </button>
              {!record.unlocked ? (
                <p className="cg-gallery-card__unlock-note">
                  {locale === 'fr' ? 'Déverrouiller le héros dans la progression.' : 'Unlock the hero through progression.'}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="cg-gallery__empty" role="status">
          <strong>{locale === 'fr' ? 'Aucune CG publiée dans cette vue.' : 'No CG published in this view.'}</strong>
          <span>{locale === 'fr' ? 'Les variantes non canoniques restent absentes tant qu’elles ne sont pas validées.' : 'Non-canonical variants remain absent until approved.'}</span>
        </div>
      ) : null}

      {selectedCg && selectedMedia?.imagePath ? (
        <div
          ref={lightboxRef}
          className="cg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cg-lightbox-title"
          onMouseDown={(event) => event.target === event.currentTarget && closeLightbox()}
        >
          <section className="cg-lightbox__panel">
            <header className="cg-lightbox__toolbar">
              <div>
                <span>{getText(selectedCg.universeName, locale, selectedCg.universeKey)}</span>
                <strong id="cg-lightbox-title">{getText(selectedCg.title, locale, selectedCg.id)}</strong>
              </div>
              <div className="cg-lightbox__controls">
                {baseComparisonMedia?.imagePath ? (
                  <button
                    type="button"
                    aria-pressed={compareWithBase}
                    onClick={() => setCompareWithBase((current) => !current)}
                  >
                    {compareWithBase
                      ? (locale === 'fr' ? 'VARIANTE SEULE' : 'VARIANT ONLY')
                      : (locale === 'fr' ? 'COMPARER À CG01' : 'COMPARE TO CG01')}
                  </button>
                ) : null}
                <button type="button" onClick={() => setZoom((current) => clampZoom(current - 0.25))} disabled={zoom <= 1} aria-label={locale === 'fr' ? 'Réduire le zoom' : 'Zoom out'}>−</button>
                <button type="button" onClick={() => setZoom(1)} aria-label={locale === 'fr' ? 'Réinitialiser le zoom' : 'Reset zoom'}>{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={() => setZoom((current) => clampZoom(current + 0.25))} disabled={zoom >= 3} aria-label={locale === 'fr' ? 'Augmenter le zoom' : 'Zoom in'}>+</button>
                <button type="button" onClick={toggleFullscreen}>{locale === 'fr' ? 'PLEIN ÉCRAN' : 'FULLSCREEN'}</button>
                <button ref={closeLightboxRef} type="button" onClick={closeLightbox}>{locale === 'fr' ? 'FERMER' : 'CLOSE'}</button>
              </div>
            </header>

            <div className="cg-lightbox__layout">
              <div className={`cg-lightbox__viewport ${compareWithBase ? 'is-comparing' : ''}`}>
                {compareWithBase && baseComparisonMedia?.imagePath ? (
                  <div className="cg-lightbox__comparison">
                    <figure>
                      <img
                        src={baseComparisonMedia.imagePath}
                        alt={getImageAlt(baseComparisonCg, getText(baseComparisonCg.title, locale), locale)}
                        style={{ '--cg-lightbox-zoom': zoom }}
                        decoding="async"
                        draggable="false"
                      />
                      <figcaption>CG01 / BASE</figcaption>
                    </figure>
                    <figure>
                      <img
                        src={selectedMedia.imagePath}
                        alt={getImageAlt(selectedCg, getText(selectedCg.title, locale), locale)}
                        style={{ '--cg-lightbox-zoom': zoom }}
                        decoding="async"
                        draggable="false"
                      />
                      <figcaption>{getText(TYPE_LABELS[selectedCg.type], locale, selectedCg.type)}</figcaption>
                    </figure>
                  </div>
                ) : (
                  <img
                    src={selectedMedia.imagePath}
                    alt={getImageAlt(selectedCg, getText(selectedCg.title, locale), locale)}
                    style={{ '--cg-lightbox-zoom': zoom }}
                    decoding="async"
                    draggable="false"
                  />
                )}
              </div>

              <aside className="cg-lightbox__details">
                <div className="cg-lightbox__badges">
                  <span>{selectedCg.family}</span>
                  <span>{getText(TYPE_LABELS[selectedCg.type], locale, selectedCg.type)}</span>
                  <span>{getText(RARITY_LABELS[selectedCg.rarity], locale, selectedCg.rarity)}</span>
                  <span>{selectedCg.contentRating}</span>
                </div>
                <p className="cg-lightbox__notice">
                  {selectedCg.rightsClass === 'project-original'
                    ? (locale === 'fr' ? 'Création originale du projet.' : 'Original project creation.')
                    : (locale === 'fr' ? 'Fan-art original non officiel. Cette illustration n’est pas un visuel éditeur.' : 'Original unofficial fan art. This illustration is not publisher artwork.')}
                </p>
                <section>
                  <h2>{locale === 'fr' ? 'Résumé du prompt' : 'Prompt summary'}</h2>
                  <p>{getText(selectedCg.promptSummary, locale)}</p>
                </section>
                <dl>
                  <div><dt>{locale === 'fr' ? 'Continuité' : 'Continuity'}</dt><dd>{selectedCg.continuityId}</dd></div>
                  <div><dt>{locale === 'fr' ? 'Statut' : 'Status'}</dt><dd>{selectedCg.canonStatus}</dd></div>
                  <div><dt>{locale === 'fr' ? 'Âge' : 'Age'}</dt><dd>{selectedCg.ageStatus}</dd></div>
                  <div><dt>{locale === 'fr' ? 'Consentement' : 'Consent'}</dt><dd>{selectedCg.consentStatus}</dd></div>
                  <div><dt>Date</dt><dd>{selectedCg.publishedAt}</dd></div>
                  <div><dt>{locale === 'fr' ? 'Crédits' : 'Credits'}</dt><dd>{getText(selectedCg.credits, locale)}</dd></div>
                  <div><dt>Prompt ID</dt><dd>{selectedCg.promptId}</dd></div>
                </dl>
                <section>
                  <h2>{locale === 'fr' ? 'Références documentaires' : 'Documentary references'}</h2>
                  <ul className="cg-lightbox__references">
                    {selectedCg.sourceRefs.map((reference) => (
                      <li key={reference}>
                        {isExternalReference(reference) ? (
                          <a href={reference} target="_blank" rel="noreferrer noopener">{reference}</a>
                        ) : <code>{reference}</code>}
                      </li>
                    ))}
                  </ul>
                </section>
                <button
                  type="button"
                  className={`cg-lightbox__favorite ${favoriteIds.has(selectedCg.id) ? 'is-favorite' : ''}`}
                  aria-pressed={favoriteIds.has(selectedCg.id)}
                  onClick={() => toggleFavorite(selectedCg.id)}
                >
                  {favoriteIds.has(selectedCg.id) ? '★ ' : '☆ '}
                  {locale === 'fr' ? 'FAVORI' : 'FAVORITE'}
                </button>
              </aside>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
