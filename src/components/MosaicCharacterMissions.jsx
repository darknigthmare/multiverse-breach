import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { getMosaicCharacterMissionStep, localizeCityMission } from '../game/mosaicCharacterMissions.js';
import { CITY_CONTRACT_FILTERS, cityContractStatusLabel, getCityContractJournal } from '../game/mosaicContractJournal.js';
import './MosaicCharacterMissions.css';

const WIDE_JOURNAL = '(min-width: 960px)';

export default function MosaicCharacterMissions({ missions, progress, heroes, lang, onAccept, onApproach, onResolve }) {
  const fr = lang === 'fr';
  const uid = useId();
  const [selectedId, setSelectedId] = useState(progress.activeId || progress.lastMissionId || '');
  const [feedback, setFeedback] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [directoryOpen, setDirectoryOpen] = useState(() => typeof window === 'undefined' || window.matchMedia(WIDE_JOURNAL).matches);
  const objectiveRef = useRef(null);
  const readerRef = useRef(null);
  const searchRef = useRef(null);
  const directoryRef = useRef(null);
  const directoryToggleRef = useRef(null);
  const pageRef = useRef(null);
  const pendingFocus = useRef(null);
  const journal = getCityContractJournal({ missions, progress, heroes, lang, query, status, page });
  const entry = journal.entries.find(item => item.mission.id === selectedId)
    || journal.entries.find(item => item.mission.id === progress.activeId) || journal.entries[0];
  const mission = entry?.mission;
  const objective = entry?.objective;
  const tracked = journal.entries.find(item => item.mission.id === progress.activeId);
  const complete = Object.values(progress.records).filter(item => item.completed).length;

  // Commit focus with the new content. No deferred frame may recapture focus
  // after the terminal closes or a newer dialog takes ownership.
  useLayoutEffect(() => {
    const target = pendingFocus.current === 'objective' ? objectiveRef.current
      : pendingFocus.current === 'directory' ? pageRef.current : pendingFocus.current === 'reader' ? readerRef.current : null;
    pendingFocus.current = null;
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [mission?.id, objective?.index, objective?.status, journal.page, directoryOpen]);

  useEffect(() => {
    const viewport = window.matchMedia(WIDE_JOURNAL);
    const resize = () => {
      if (!viewport.matches && directoryRef.current?.contains(document.activeElement)) directoryToggleRef.current?.focus({ preventScroll: true });
      setDirectoryOpen(viewport.matches);
    };
    viewport.addEventListener('change', resize);
    return () => viewport.removeEventListener('change', resize);
  }, []);

  const selectMission = (id, focus = false) => {
    setSelectedId(id);
    setFeedback('');
    if (!focus) return;
    if (!window.matchMedia(WIDE_JOURNAL).matches) setDirectoryOpen(false);
    if (id === mission?.id) {
      readerRef.current?.focus({ preventScroll: true });
      readerRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else pendingFocus.current = 'reader';
  };
  const goToPage = next => {
    pendingFocus.current = 'directory';
    setPage(next);
  };
  const clearFilters = () => {
    setQuery(''); setStatus('all'); setPage(1);
    searchRef.current?.focus({ preventScroll: true });
  };

  return <section className="mosaic-character-missions" aria-labelledby={`${uid}-title`}>
    <header className="mosaic-contract-heading">
      <div><span className="mosaic-contract-kicker">A.R.C.A. · {fr ? 'JOURNAL DE TERRAIN' : 'FIELD JOURNAL'}</span><h3 id={`${uid}-title`}>{fr ? 'CONTRATS DES HABITANTS' : 'RESIDENT CONTRACTS'}</h3></div>
      <p>{journal.counts.completed}/{missions.length} {fr ? 'transmis dans ce quartier' : 'submitted in this district'}</p>
    </header>
    {!mission ? <p>{fr ? 'Les contrats disponibles dépendent du quartier, de ses habitants possédés et des contenus installés. Retrouve leurs auteurs dans le Nexus ou dans les quartiers qui proposent des contrats. Les étapes déjà réalisées restent conservées.' : 'Available contracts depend on the district, its owned residents and installed content. Find their authors in the Nexus or districts offering contracts. Completed steps remain saved.'}</p> : <>
      {tracked && <button type="button" className="mosaic-contract-tracked" data-city-contract-tracked onClick={() => selectMission(tracked.mission.id, true)}>
        <span>{fr ? 'DOSSIER SUIVI' : 'TRACKED CASE'} · {tracked.objective.index}/{tracked.objective.total}</span>
        <strong>{tracked.heroName} · {tracked.title}</strong><span>{fr ? 'Retrouver l’objectif' : 'View objective'} →</span>
      </button>}
      <div className="mosaic-contract-workspace" data-directory-open={directoryOpen}>
        <details className="mosaic-contract-directory" open={directoryOpen} onToggle={event => setDirectoryOpen(event.currentTarget.open)}>
          <summary ref={directoryToggleRef}>{fr ? 'Trouver un contrat' : 'Find a contract'} <span>{missions.length}</span></summary>
          <div ref={directoryRef} className="mosaic-contract-directory-content">
            <h4 ref={pageRef} tabIndex={-1}>{fr ? 'Dossiers du quartier' : 'District cases'}</h4>
            <label htmlFor={`${uid}-search`}><span>{fr ? 'Rechercher un contrat' : 'Search contracts'}</span>
              <input ref={searchRef} id={`${uid}-search`} type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }}
                aria-controls={`${uid}-results`} placeholder={fr ? 'Personnage, titre, sujet…' : 'Character, title, subject…'} />
            </label>
            <div className="mosaic-contract-filters" role="group" aria-label={fr ? 'État des contrats' : 'Contract status'}>
              {CITY_CONTRACT_FILTERS.filter(key => key !== 'unavailable' || journal.counts.unavailable > 0).map(key => <button type="button" key={key}
                aria-pressed={status === key} aria-controls={`${uid}-results`} data-city-contract-filter={key}
                onClick={() => { setStatus(key); setPage(1); }}><span>{cityContractStatusLabel(key, lang)}</span><span>{journal.counts[key]}</span></button>)}
            </div>
            <p className="mosaic-contract-match-count" role="status" data-city-contract-results>{journal.first}–{journal.last} / {journal.total} · Page {journal.page}/{journal.pageCount}</p>
            <ul id={`${uid}-results`} className="mosaic-contract-list">
              {journal.items.map(item => <li key={item.mission.id}><button type="button" data-city-contract-result={item.mission.id}
                aria-pressed={mission.id === item.mission.id} onClick={() => selectMission(item.mission.id, true)}>
                <strong>{item.heroName}</strong><span>{item.title}</span><small><span>{item.statusLabel}</span><span>{item.objective.index}/{item.objective.total}</span></small>
              </button></li>)}
            </ul>
            {!journal.total && <p data-city-contract-empty>{fr ? 'Aucun contrat ne correspond. Change les filtres ou efface la recherche ; ton dossier consulté reste ouvert.' : 'No matching contracts. Change filters or clear the search; your current case remains open.'}</p>}
            {(query || status !== 'all') && <button type="button" className="mosaic-contract-clear" onClick={clearFilters}>{fr ? 'Effacer les filtres' : 'Clear filters'}</button>}
            {journal.pageCount > 1 && <nav className="mosaic-contract-pages" aria-label={fr ? 'Pages des contrats' : 'Contract pages'}>
              <button type="button" disabled={journal.page === 1} onClick={() => goToPage(journal.page - 1)} aria-controls={`${uid}-results`}>{fr ? 'Précédent' : 'Previous'}</button>
              <button type="button" disabled={journal.page === journal.pageCount} onClick={() => goToPage(journal.page + 1)} aria-controls={`${uid}-results`}>{fr ? 'Suivant' : 'Next'}</button>
            </nav>}
          </div>
        </details>
        <article className="mosaic-contract-reader" aria-labelledby={`${uid}-case-title`} data-city-contract-reader={mission.id}>
          <label><span>{fr ? 'Dossier consulté · accès direct' : 'Current case · quick selection'}</span>
            <select data-city-contract-select value={mission.id} onChange={event => selectMission(event.target.value)}>
              {journal.entries.map(item => <option key={item.mission.id} value={item.mission.id}>{item.heroName} · {item.title} · {item.statusLabel}</option>)}
            </select>
          </label>
          <div className="mosaic-contract-identity"><strong>{entry.heroName}</strong><span data-city-contract-status={objective.status}>{entry.statusLabel}</span>
            {mission.chapter > 1 && <span>{fr ? 'Chapitre' : 'Chapter'} {mission.chapter}</span>}</div>
          <h4 id={`${uid}-case-title`} ref={readerRef} tabIndex={-1}>{entry.title}</h4>
          <p>{localizeCityMission(mission.premise, lang)}</p>
          {objective.originResolution && <aside className="mosaic-contract-origin"><strong>{fr ? 'Décision du dossier précédent' : 'Previous case decision'}</strong><p>{objective.originResolution}</p></aside>}
          <div className="mosaic-contract-objective">
            <span>{objective.status === 'locked' ? (fr ? 'CONDITION D’ACCÈS' : 'ACCESS REQUIREMENT') : objective.status === 'completed' ? (fr ? 'DOSSIER TRANSMIS' : 'CASE SUBMITTED') : (fr ? 'PROCHAINE ÉTAPE' : 'NEXT STEP')}</span>
            <p role="status" ref={objectiveRef} tabIndex={-1} data-city-contract-objective data-contract-id={mission.id} data-step={objective.step?.id || (objective.status === 'completed' ? 'done' : objective.status)}>
              {objective.index}/{objective.total} · {objective.text}
            </p>
            <progress value={objective.index} max={Math.max(1, objective.total)} aria-label={fr ? 'Étapes consignées' : 'Recorded steps'} />
          </div>
          {objective.status === 'locked' && objective.prerequisite && journal.entries.some(item => item.mission.id === objective.prerequisite.missionId) && <button type="button" data-city-contract-prerequisite onClick={() => selectMission(objective.prerequisite.missionId, true)}>
            {fr ? 'CONSULTER LE DOSSIER PRÉALABLE' : 'READ THE PREREQUISITE CASE'}
          </button>}
          {objective.status === 'active' && objective.step?.type === 'decision' ? <fieldset>
            <legend>{fr ? 'Conclusion à inscrire' : 'Conclusion to record'}</legend>
            {objective.step.choices.map(item => <button type="button" className="btn-retro" key={item.id}
              data-city-contract-choice={item.id} onClick={() => {
                const result = onResolve(mission.id, item.id);
                setFeedback(result?.feedback || '');
                if (result?.changed) pendingFocus.current = 'objective';
              }}>{localizeCityMission(item.label, lang)}</button>)}
          </fieldset> : objective.status === 'active' ? <button type="button" className="btn-retro mosaic-contract-action" data-city-contract-approach onClick={() => onApproach(mission.id)}>
            {fr ? 'REJOINDRE CETTE ÉTAPE' : 'APPROACH THIS STEP'}
          </button> : ['available', 'paused'].includes(objective.status) ? <button type="button" className="btn-retro mosaic-contract-action" data-city-contract-accept onClick={() => {
            setFeedback('');
            const result = onAccept(mission.id);
            if (result?.changed) pendingFocus.current = 'objective';
          }}>
            {objective.status === 'paused' ? (fr ? 'REPRENDRE LE CONTRAT' : 'RESUME CONTRACT') : (fr ? 'ACCEPTER LE CONTRAT' : 'ACCEPT CONTRACT')}
          </button> : null}
          {objective.resolution && objective.status !== 'completed' && <p>{objective.resolution}</p>}
          {feedback && <p role="status" data-city-contract-feedback>{feedback}</p>}
          {tracked && tracked.mission.id !== mission.id && <p className="mosaic-contract-consultation">{fr ? 'La consultation ne change pas le dossier suivi. Accepter ou reprendre ce contrat mettra l’autre en pause, en conservant ses étapes.' : 'Reading does not change the tracked case. Accepting or resuming this contract will pause the other and retain its steps.'}</p>}
          <details className="mosaic-contract-evidence" key={mission.id}>
            <summary>{fr ? 'Étapes et preuves' : 'Steps and evidence'} <span>{objective.index}/{objective.total}</span></summary>
            <ol>{mission.steps.map((_, index) => {
              const step = getMosaicCharacterMissionStep(progress, mission, index);
              const done = index < objective.index;
              return <li key={step.id} data-complete={done} aria-current={index === objective.index ? 'step' : undefined}>
                {localizeCityMission(step.text, lang)}{done && <strong>{fr ? ' — fait' : ' — done'}</strong>}
                {done && step.finding && <p>{localizeCityMission(step.finding, lang)}</p>}
              </li>;
            })}</ol>
          </details>
        </article>
      </div>
    </>}
    {progress.activeId && !tracked && <p>{fr ? 'Un contrat est suivi dans un autre quartier ou attend le retour de son contenu. Sa progression est conservée.' : 'A tracked contract belongs to another district or awaits its content’s return. Its progress is retained.'}</p>}
    <small>{complete} {fr ? 'dossier(s) transmis au total. Les preuves et choix restent dans le journal.' : 'case(s) submitted in total. Evidence and choices remain in the journal.'}</small>
  </section>;
}
