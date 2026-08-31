import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getRewardCatalogPage } from '../game/portalCatalogView';
import { getBoosterFreeDrawRates } from '../game/portalBoosterEngine';
import { getBoosterPrice } from '../game/portalBoosterEconomy';
import { getPortalBoosterArt, getPortalBoosterPackArt } from '../game/portalBoosterCatalog';
import { getOcBoosterContentUpdate } from '../game/ocBoosterContentUpdates';
import { resolvePortalBoosterEditorialWave } from '../game/portalBoosterEditorialWaves';

const localize = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
const rateLabel = (rate, lang) => `${((Number(rate) || 0) * 100).toLocaleString(lang, { maximumFractionDigits: 4 })}% ${lang === 'fr' ? 'par slot libre' : 'per free slot'}`;

export default function PortalBoosterDossier({ banner, candidates, lang, available, selected, duplicateStreak, pityLimit, isCandidateOwned, onSelect, onClose, kindLabels, kindOrder, rarities, Artwork, getRewardDetail }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(24);
  const [kind, setKind] = useState('all');
  const [page, setPage] = useState(0);
  const rates = useMemo(() => getBoosterFreeDrawRates(candidates), [candidates]);
  const update = useMemo(() => resolvePortalBoosterEditorialWave({
    packId: banner.id,
    universe: banner.universe,
    candidates,
    authoredUpdate: getOcBoosterContentUpdate(banner.id)
  }), [banner.id, banner.universe, candidates]);
  const featuredIds = useMemo(() => new Set(update?.featuredCardIds || update?.newCardIds || []), [update]);
  const orderedCandidates = useMemo(() => [...candidates].sort((a, b) => (
    Number(featuredIds.has(b.id)) - Number(featuredIds.has(a.id))
  )), [candidates, featuredIds]);
  const rewardPage = useMemo(() => getRewardCatalogPage(orderedCandidates, { query, kind, page, pageSize }), [orderedCandidates, query, kind, page, pageSize]);
  const kindCounts = useMemo(() => candidates.reduce((counts, reward) => {
    counts[reward.kind] = (counts[reward.kind] || 0) + 1;
    return counts;
  }, {}), [candidates]);
  const art = getPortalBoosterPackArt(banner.id) || getPortalBoosterArt(banner.universe);
  const ownedCount = candidates.filter(isCandidateOwned).length;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = [...(dialogRef.current?.querySelectorAll('button:not(:disabled), input, select, a[href], [tabindex="0"]') || [])];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown, true);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="booster-art-lightbox" style={{ '--portal-color': banner.color }} onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={dialogRef} className="booster-art-preview-dialog booster-dossier-dialog" role="dialog" aria-modal="true" aria-labelledby="booster-dossier-title" data-booster-dossier={banner.id} style={{ width: 'min(1120px, calc(100vw - 36px))', display: 'flex', flexDirection: 'column' }}>
        <header>
          <div>
            <span>{lang === 'fr' ? 'DOSSIER COMPLET · CONSULTATION SANS ACHAT' : 'COMPLETE DOSSIER · NO PURCHASE ON PREVIEW'}</span>
            <strong id="booster-dossier-title" style={{ whiteSpace: 'normal' }}>{localize(banner.label, lang)}</strong>
          </div>
          <button ref={closeRef} type="button" className="booster-art-preview-close" onClick={onClose} aria-label={lang === 'fr' ? 'Fermer le dossier du booster' : 'Close booster dossier'}>×</button>
        </header>
        <div style={{ minHeight: 0, overflowY: 'auto', padding: '4px 6px 12px', overscrollBehavior: 'contain' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 20 }}>
            {art && <img src={art} alt={localize(banner.label, lang)} style={{ width: '100%', height: 300, objectFit: 'contain' }} />}
            <div>
              <p>{localize(banner.desc, lang)}</p>
              <p>{localize(banner.meta, lang)}</p>
              <div className="portal-focus-stats">
                <span>{banner.universe}</span>
                <span>{ownedCount}/{candidates.length} {lang === 'fr' ? 'cartes obtenues' : 'owned cards'}</span>
                <span>{getBoosterPrice(banner)} {lang === 'fr' ? 'Fragments' : 'Shards'}</span>
                <span>{available ? (lang === 'fr' ? 'DISPONIBLE' : 'AVAILABLE') : (lang === 'fr' ? 'HORS ROTATION · APERÇU' : 'OFF ROTATION · PREVIEW')}</span>
              </div>
              {update && <p data-content-update={update.id}>
                <strong>{lang === 'fr' ? 'MISE EN AVANT' : 'SPOTLIGHT'} V{update.version}</strong> · <time dateTime={update.releasedAt}>{update.releasedAt}</time><br />
                {localize(update.summary, lang)}
              </p>}
              <div className="portal-rate-grid">
                {Object.values(rarities).map(rarity => <span key={rarity.id} style={{ '--rarity-color': rarity.color }}>{rarity.label[lang]} / {rarity.weight}%</span>)}
              </div>
              <p>{lang === 'fr'
                ? `GARANTIES : 5 cartes / 1 personnage / 1 Rare ou mieux${banner.guaranteeNonHeroRare ? ' hors personnage' : ''}.`
                : `GUARANTEES: 5 cards / 1 character / 1 Rare or better${banner.guaranteeNonHeroRare ? ' non-character reward' : ''}.`}</p>
              <p>{duplicateStreak >= pityLimit
                ? (lang === 'fr' ? 'Compas Nexus actif : le personnage garanti cherche une signature absente.' : 'Nexus Compass active: the guaranteed character seeks a missing signature.')
                : (lang === 'fr' ? `Compas Nexus dans ${pityLimit - duplicateStreak} écho(s) de personnage.` : `Nexus Compass in ${pityLimit - duplicateStreak} character echo(es).`)}</p>
              <small>{lang === 'fr' ? 'Aucune mission ni aucun mode ne se débloque par achat. Remboursement des échos plafonné à 70 % du prix payé.' : 'Purchases never unlock missions or modes. Echo refunds are capped at 70% of the paid price.'}</small>
            </div>
          </div>
          <section aria-labelledby="booster-dossier-rewards-title" style={{ marginTop: 22 }}>
            <h3 id="booster-dossier-rewards-title">{lang === 'fr' ? 'CATALOGUE COMPLET DES CARTES' : 'COMPLETE CARD CATALOG'} ({candidates.length})</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder={lang === 'fr' ? 'Nom ou univers...' : 'Name or universe...'} aria-label={lang === 'fr' ? 'Rechercher dans toutes les cartes du booster' : 'Search every card in this booster'} style={{ flex: '1 1 200px', minWidth: 0, padding: 10 }} />
              <select value={kind} onChange={event => { setKind(event.target.value); setPage(0); }} aria-label={lang === 'fr' ? 'Type de carte' : 'Card type'} style={{ maxWidth: '100%', padding: 10 }}>
                <option value="all">{lang === 'fr' ? 'TOUS LES TYPES' : 'ALL TYPES'} ({candidates.length})</option>
                {kindOrder.filter(id => kindCounts[id]).map(id => <option key={id} value={id}>{kindLabels[id]?.[lang] || id} ({kindCounts[id]})</option>)}
              </select>
            </div>
            <p className="booster-drop-rate-note">{lang === 'fr'
              ? 'Probabilité par slot libre, avant retrait des cartes déjà tirées. Les garanties et le Compas Nexus peuvent modifier le tirage. Toutes les cartes sont consultables dans les pages ci-dessous.'
              : 'Probability per free slot, before removing previously drawn cards. Guarantees and the Nexus Compass may alter the draw. Every card is accessible through the pages below.'}</p>
            <div className="booster-reward-manifest-grid" style={{ maxHeight: 'none', overflow: 'visible', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))' }}>
              {rewardPage.items.map(reward => <article key={reward.id} className="booster-reward-manifest-group" style={{ padding: 10, minWidth: 0 }}>
                <div style={{ height: 112, overflow: 'hidden', display: 'grid', placeItems: 'center' }}><Artwork reward={reward} lang={lang} /></div>
                <h4 style={{ margin: '8px 0', overflowWrap: 'anywhere' }}>{localize(reward.name, lang)}</h4>
                <small>{kindLabels[reward.kind]?.[lang] || reward.kind} · {reward.universe}</small>
                <p style={{ fontSize: 11 }}>{getRewardDetail(reward, lang)}</p>
                <p style={{ color: reward.rarity.color, fontSize: 11 }}>{localize(reward.rarity.label, lang)} · {rateLabel(rates.get(reward.id), lang)}</p>
                <small>{isCandidateOwned(reward) ? (lang === 'fr' ? 'OBTENUE' : 'OWNED') : (lang === 'fr' ? 'À OBTENIR' : 'NOT OWNED')}{featuredIds.has(reward.id) ? (lang === 'fr' ? ' · SÉLECTION' : ' · FEATURED') : ''}</small>
              </article>)}
            </div>
            {rewardPage.total === 0 && <p role="status">{lang === 'fr' ? 'Aucune carte ne correspond à ces filtres.' : 'No cards match these filters.'}</p>}
            <nav aria-label={lang === 'fr' ? 'Pages du catalogue de cartes' : 'Card catalog pages'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
              <label>{lang === 'fr' ? 'Cartes par page ' : 'Cards per page '}<select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(0); }}>{[12, 24, 48].map(size => <option key={size} value={size}>{size}</option>)}</select></label>
              <button type="button" className="btn-retro" disabled={rewardPage.page === 0} onClick={() => setPage(rewardPage.page - 1)}>{lang === 'fr' ? 'PRÉCÉDENT' : 'PREVIOUS'}</button>
              <span aria-live="polite">{rewardPage.start}–{rewardPage.end}/{rewardPage.total} · {rewardPage.page + 1}/{rewardPage.pageCount}</span>
              <button type="button" className="btn-retro" disabled={rewardPage.page + 1 >= rewardPage.pageCount} onClick={() => setPage(rewardPage.page + 1)}>{lang === 'fr' ? 'SUIVANT' : 'NEXT'}</button>
            </nav>
          </section>
        </div>
        <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #284047', paddingTop: 10 }}>
          <button type="button" className="btn-retro" onClick={onClose}>{lang === 'fr' ? 'RETOUR AU CATALOGUE' : 'BACK TO CATALOG'}</button>
          <button type="button" className="btn-retro" disabled={!available} onClick={() => onSelect(banner.id)} data-select-previewed-booster={banner.id}>
            {!available ? (lang === 'fr' ? 'HORS ROTATION' : 'OFF ROTATION') : selected ? (lang === 'fr' ? 'REVENIR AU BOOSTER SÉLECTIONNÉ' : 'RETURN TO SELECTED BOOSTER') : (lang === 'fr' ? 'SÉLECTIONNER SANS ACHETER' : 'SELECT WITHOUT BUYING')}
          </button>
        </footer>
      </section>
    </div>, document.body
  );
}
