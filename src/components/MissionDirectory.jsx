import React, { useId, useRef, useState } from 'react';
import { getTranslation } from '../game/translation';
import { getMissionDirectoryView, getMissionDirectoryBlockReason, missionDirectoryText, MISSION_DIRECTORY_STATUSES } from '../game/missionDirectoryView.js';
import './MissionDirectory.css';

const labels = {
  fr: { all: 'Toutes', available: 'Ouvertes', completed: 'Stabilisées', composition: 'Cellule', locked: 'Scellées' },
  en: { all: 'All', available: 'Open', completed: 'Stabilized', composition: 'Squad', locked: 'Sealed' }
};
const statusLabels = { fr: { available: 'Ouverte', completed: 'Stabilisée', composition: 'Cellule requise', locked: 'Scellée' },
  en: { available: 'Open', completed: 'Stabilized', composition: 'Squad required', locked: 'Sealed' } };

export default function MissionDirectory({ lang = 'fr', stages, completedStages, isStageUnlocked, getMissionDeployment,
  onOpenBriefing, onLaunch, getStageModifier, getStageArc, getLootRarity, getRichBreachBrief, getStageRewardPreview,
  getNonCombatStageDetails, getRiftDossierArtSrc, accent = '#39c5bb', emptyBackdrop, query = '', onQueryChange,
  statusFilter = 'all', onStatusFilterChange }) {
  const id = useId(), searchRef = useRef(null), resultsRef = useRef(null);
  const [pagination, setPagination] = useState({ key: '', page: 1 });
  const fr = lang === 'fr', locale = fr ? 'fr' : 'en';
  const viewKey = `${query}|${statusFilter}|${stages.length}|${stages[0]?.id}`;
  const view = getMissionDirectoryView({ stages, completedStages, isStageUnlocked, getMissionDeployment,
    query, statusFilter, page: pagination.key === viewKey ? pagination.page : 1 });
  const focusVisible = node => { node?.focus({ preventScroll: true }); node?.scrollIntoView({ block: 'end', behavior: 'instant' }); };
  const reset = () => { onQueryChange(''); onStatusFilterChange('all'); setPagination({ key: '', page: 1 }); focusVisible(searchRef.current); };
  const changePage = page => {
    setPagination({ key: viewKey, page });
    requestAnimationFrame(() => focusVisible(resultsRef.current));
  };
  return <section className="mission-directory mission-directory-workspace" style={{ '--operations-accent': accent }} aria-labelledby={`${id}-heading`}>
    <header className="mission-directory-head">
      <div><span className="mission-directory-kicker">{fr ? 'A.R.C.A. / COORDONNÉES DE ROUTE' : 'A.R.C.A. / ROUTE COORDINATES'}</span>
        <h4 id={`${id}-heading`}>{fr ? 'Missions de cette route' : 'Missions on this route'}</h4>
        <p>{fr ? 'Consulte un dossier, prépare ta cellule, puis déploie-la lorsque les prérequis sont réunis.' : 'Inspect a dossier, prepare your squad, then deploy when its requirements are met.'}</p></div>
    </header>
    <div className="mission-directory-controls">
      <label><span>{fr ? 'Rechercher une mission' : 'Find a mission'}</span><input ref={searchRef} type="search" value={query}
        onChange={event => onQueryChange(event.target.value)} placeholder={fr ? 'Nom, univers, boss, mode ou numéro…' : 'Name, universe, boss, mode or number…'} /></label>
      <label><span>{fr ? 'État des coordonnées' : 'Coordinate status'}</span><select value={statusFilter} onChange={event => onStatusFilterChange(event.target.value)}>
        {MISSION_DIRECTORY_STATUSES.map(status => <option key={status} value={status}>{labels[locale][status]} · {view.counts[status]}</option>)}
      </select></label>
      <button type="button" className="mission-directory-button" onClick={reset}>{fr ? 'Réinitialiser' : 'Reset'}</button>
    </div>
    <div className="mission-directory-results" ref={resultsRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
      {view.first}–{view.last} / {view.total} {fr ? 'missions' : 'missions'}
      <span>{fr ? 'Les filtres conservent ta progression et ta cellule.' : 'Filters preserve your progress and squad.'}</span>
    </div>
    {view.pageCount > 1 && <nav className="mission-directory-pages" aria-label={fr ? 'Pages de missions' : 'Mission pages'}>
      <button type="button" className="mission-directory-button" disabled={view.page <= 1} onClick={() => changePage(view.page - 1)}>{fr ? 'Page précédente' : 'Previous page'}</button>
      <span>{fr ? 'Page' : 'Page'} {view.page} / {view.pageCount}</span>
      <button type="button" className="mission-directory-button" disabled={view.page >= view.pageCount} onClick={() => changePage(view.page + 1)}>{fr ? 'Page suivante' : 'Next page'}</button>
    </nav>}
    {view.total ? <div className="mission-directory-list">{view.items.map(row => {
      const { stage, completed, unlocked, canDeploy } = row;
      const modifier = getStageModifier(stage), rarity = getLootRarity(stage), arc = getStageArc(stage);
      const nonCombat = getNonCombatStageDetails(stage, lang), rewards = getStageRewardPreview(stage) || [];
      const reason = getMissionDirectoryBlockReason(row, lang), reasonId = `${id}-reason-${stage.id}`;
      const backdrop = getRiftDossierArtSrc(stage, emptyBackdrop || '/images/missions/fusion-rifts.webp');
      return <article key={stage.id} data-mission-id={stage.id} data-mission-status={row.status}
        className={`mission-directory-entry ${completed ? 'is-complete' : ''} ${!unlocked ? 'is-locked' : ''} ${unlocked && !canDeploy ? 'is-composition' : ''}`}>
        <div className="mission-directory-art" style={{ backgroundImage: `linear-gradient(180deg, #08141b00, #08141be8), url("${backdrop}")` }}>
          <span>#{stage.id}</span><b>{statusLabels[locale][row.status]}</b>
        </div>
        <div className="mission-directory-copy">
          <div className="mission-directory-title"><div><span>{stage.sourceUniverses?.join(' / ') || stage.universe}</span>
            <h5>{stage.displayName?.[lang] || stage.name}</h5></div><em>{stage.mode === 'Tactics' && fr ? 'Tactique' : stage.mode}</em></div>
          <div className="mission-directory-meta"><span>{nonCombat ? (fr ? 'Épreuve' : 'Trial') : (fr ? 'Menace' : 'Threat')}: <strong>{nonCombat?.title || stage.bossName}</strong></span>
            <span>{rewards.slice(0, 2).join(' / ')}</span></div>
          <details className="mission-directory-transmission"><summary>{fr ? 'Lire la transmission' : 'Read transmission'}</summary><p>{getRichBreachBrief(stage)}</p>
            <div className="mission-directory-tags"><span style={{ '--tag-color': modifier.color }}>{modifier.name[lang]}</span><span style={{ '--tag-color': rarity.color }}>{rarity.label}</span>
              {arc && <span style={{ '--tag-color': arc.color }}>{missionDirectoryText(arc.title, lang)}</span>}</div></details>
          {reason && <p className="mission-directory-reason" id={reasonId}>{reason}</p>}
        </div>
        <div className="mission-directory-actions">
          <button type="button" className="mission-directory-button" onClick={() => onOpenBriefing(stage)} aria-label={`${fr ? 'Briefing de' : 'Briefing for'} ${stage.displayName?.[lang] || stage.name}`}>Briefing</button>
          <button type="button" className="mission-directory-button mission-directory-launch" disabled={!canDeploy}
            aria-describedby={reason ? reasonId : undefined} onClick={() => { if (canDeploy) onLaunch(stage); }}>
            {canDeploy ? getTranslation(lang, 'deploySquad') : statusLabels[locale][unlocked ? 'composition' : 'locked']}</button>
        </div>
      </article>;
    })}</div> : <div className="mission-directory-empty"><strong>{fr ? 'Aucune mission ne correspond' : 'No matching mission'}</strong>
      <p>{fr ? 'Essaie un nom, un numéro ou un autre état.' : 'Try a name, a number or a different status.'}</p>
      <button type="button" className="mission-directory-button" onClick={reset}>{fr ? 'Afficher toutes les missions' : 'Show all missions'}</button></div>}
  </section>;
}
