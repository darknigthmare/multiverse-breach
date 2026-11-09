import React, { useMemo, useState } from 'react';
import { getWardrobeBoosterProgress } from '../game/wardrobeBoosterRewards.js';
import './WardrobeBoosterBonus.css';

const fold = value => String(value || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const PAGE_SIZE = 24;
export default function WardrobeBoosterBonus({ pool, inventory = [], lang = 'fr', award = null, receipt = false }) {
  const fr = lang !== 'en';
  const l = fr ? 'fr' : 'en';
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('all');
  const [showOwned, setShowOwned] = useState(false);
  const [page, setPage] = useState(0);
  const owned = useMemo(() => new Set(inventory), [inventory]);
  const progress = useMemo(() => getWardrobeBoosterProgress(pool, inventory), [pool, inventory]);
  const filtered = useMemo(() => pool.filter(row => (showOwned || !owned.has(row.id))
    && (origin === 'all' || row.origin === origin)
    && fold([row.actorName, row.universe, row.name.fr, row.name.en, row.sourceWork].join(' ')).includes(fold(query))),
  [pool, owned, origin, showOwned, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageIndex = Math.min(page, pages - 1);
  if (receipt) return <aside className="wardrobe-booster" aria-label={fr ? 'Bonus de tenue obtenu' : 'Outfit bonus received'}>
    <strong>{award ? (fr ? 'Droit de tenue débloqué — bonus gratuit' : 'Outfit entitlement unlocked — free bonus')
      : (fr ? 'Bonus de tenue : aucune entrée restante dans ce booster' : 'Outfit bonus: no remaining entry in this booster')}</strong>
    {award && <><h4>{award.actorName} — {award.name[l]}</h4><p>{award.universe} · {award.origin === 'OFFICIAL'
      ? (fr ? 'variante officielle documentée' : 'documented official variant') : (fr ? 'création originale' : 'original concept')}</p>
      <p>{fr ? 'Conservé dans le vestiaire. Graphismes à produire : non équipable. Aucun personnage, avantage ou statistique accordé.'
        : 'Saved in the wardrobe. Artwork pending: not equippable. No character, advantage or statistic granted.'}</p></>}
  </aside>;
  return <section className="wardrobe-booster" aria-label={fr ? 'Costumes dans ce booster' : 'Outfits in this booster'}>
    <h3>{fr ? 'Bonus de tenue du même univers' : 'Matching-universe outfit bonus'}</h3>
    <p>{fr ? 'Les cinq cartes et leur prix restent inchangés. Chaque ouverture, crédit gratuit compris, ajoute un droit de tenue non possédé de ce pool ; aucun doublon tant qu’il en reste.'
      : 'The five cards and their price are unchanged. Each opening, including free credits, adds one unowned outfit entitlement from this pool; no duplicates while any remain.'}</p>
    <p><strong>{progress.unlocked}/{progress.total}</strong> {fr ? 'débloqués' : 'unlocked'} · <strong>{progress.remaining}</strong> {fr ? 'restants' : 'remaining'}.
      {' '}{progress.remaining ? (fr ? `Chance par entrée manquante : 1/${progress.remaining} dans le bonus.` : `Chance per missing entry: 1/${progress.remaining} in the bonus.`)
        : (fr ? 'Pool terminé : pas de compensation monétaire supplémentaire.' : 'Pool complete: no extra currency compensation.')}</p>
    <p>{fr ? 'Ce sont des droits de tenue : les graphismes restent à produire. Pas de certification 1:1, pas de personnage débloqué, pas de remplacement des cartes ni de dilution de leurs taux.'
      : 'These are outfit entitlements: artwork is still pending. No 1:1 certification, character unlock, replacement of cards or dilution of their rates.'}</p>
    <details><summary>{fr ? 'Consulter les tenues et leurs porteurs' : 'Browse outfits and their wearers'} ({pool.length})</summary>
      <div className="wardrobe-booster__filters">
        <label>{fr ? 'Rechercher' : 'Search'}<input type="search" value={query} maxLength={160}
          onChange={e => { setQuery(e.target.value); setPage(0); }}/></label>
        <label>{fr ? 'Origine' : 'Origin'}<select value={origin} onChange={e => { setOrigin(e.target.value); setPage(0); }}>
          <option value="all">{fr ? 'Toutes' : 'All'}</option><option value="OFFICIAL">{fr ? 'Officielles' : 'Official'}</option>
          <option value="ORIGINAL">{fr ? 'Créations du jeu' : 'Game originals'}</option></select></label>
        <label><input type="checkbox" checked={showOwned} onChange={e => { setShowOwned(e.target.checked); setPage(0); }}/>
          {fr ? 'Inclure les droits possédés' : 'Include owned entitlements'}</label>
      </div>
      <p>{fr ? 'Le filtre sert à consulter : il ne change pas les chances du tirage.' : 'Filters are for browsing only: they do not alter draw odds.'}</p>
      <ul className="wardrobe-booster__list">{filtered.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE).map(row => <li key={row.id}>
        <strong>{row.actorName} — {row.name[l]}</strong><span>{row.universe} · {row.sourceWork || (fr ? 'Création Nexus' : 'Nexus original')}</span>
        <span>{owned.has(row.id) ? (fr ? 'Débloqué, graphismes en attente' : 'Unlocked, artwork pending')
          : (fr ? 'À débloquer, graphismes en attente' : 'Locked, artwork pending')}</span></li>)}</ul>
      {!filtered.length && <p role="status">{fr ? 'Aucune tenue pour ce filtre.' : 'No outfit matches this filter.'}</p>}
      <div className="wardrobe-booster__pages"><button type="button" disabled={!pageIndex} onClick={() => setPage(pageIndex - 1)}>{fr ? 'Précédent' : 'Previous'}</button>
        <span>{pageIndex + 1}/{pages}</span><button type="button" disabled={pageIndex + 1 >= pages} onClick={() => setPage(pageIndex + 1)}>{fr ? 'Suivant' : 'Next'}</button></div>
    </details>
  </section>;
}
