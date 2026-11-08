import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { localizeCityMission } from '../game/mosaicCharacterMissions.js';
import { CITY_CONTRACT_FILTERS, cityContractStatusLabel, getCityContractJournal, getCityContractStory } from '../game/mosaicContractJournal.js';
import './MosaicCharacterMissions.css';

const WIDE_JOURNAL = '(min-width: 960px)';

export default function MosaicCharacterMissions({ missions, progress, heroes, lang, onAccept, onApproach, onResolve, onReplay }) {
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
  const story = getCityContractStory({ mission, objective, progress, heroes, lang });
  const tracked = journal.entries.find(item => item.mission.id === progress.activeId);
  const complete = Object.values(progress.records).filter(item => item.completed).length;
  const distinctFeedback = feedback && ![objective?.resolution, story?.latest?.dialogue, story?.latest?.finding].includes(feedback);
  const memoryFinding = story?.latest?.finding && ![story.latest.dialogue, objective?.resolution].includes(story.latest.finding) ? story.latest.finding : '';

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
      <div><span className="mosaic-contract-kicker">{fr ? 'LES VOIX DE LA CITÉ' : 'VOICES OF THE CITY'}</span><h3 id={`${uid}-title`}>{fr ? 'CARNET D’EXPÉDITION' : 'EXPEDITION JOURNAL'}</h3></div>
      <p>{journal.counts.completed}/{missions.length} {fr ? 'missions accomplies dans ce quartier' : 'missions completed in this district'}</p>
    </header>
    {!mission ? <p>{fr ? 'Les habitants de ce quartier n’ont rien à te demander pour le moment. Poursuis ton exploration ; tes autres aventures restent dans le carnet.' : 'The residents here have nothing to ask of you for now. Keep exploring; your other adventures remain in the journal.'}</p> : <>
      {tracked && <button type="button" className="mosaic-contract-tracked" data-city-contract-tracked onClick={() => selectMission(tracked.mission.id, true)}>
        <span>{fr ? 'EN CHEMIN AVEC' : 'ON THE TRAIL WITH'} {tracked.heroName}</span>
        <strong>{tracked.title}</strong><span className="mosaic-contract-tracked-next">{tracked.objective.text}</span>
        <span>{tracked.objective.index}/{tracked.objective.total} · {fr ? 'Reprendre le fil' : 'Pick up the thread'} →</span>
      </button>}
      <div className="mosaic-contract-workspace" data-directory-open={directoryOpen}>
        <details className="mosaic-contract-directory" open={directoryOpen} onToggle={event => setDirectoryOpen(event.currentTarget.open)}>
          <summary ref={directoryToggleRef}>{fr ? 'Parcourir le carnet' : 'Browse the journal'} <span>{missions.length}</span></summary>
          <div ref={directoryRef} className="mosaic-contract-directory-content">
            <h4 ref={pageRef} tabIndex={-1}>{fr ? 'Les histoires du quartier' : 'Stories from this district'}</h4>
            <label htmlFor={`${uid}-search`}><span>{fr ? 'Trouver une mission' : 'Find a mission'}</span>
              <input ref={searchRef} id={`${uid}-search`} type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }}
                aria-controls={`${uid}-results`} placeholder={fr ? 'Un nom, un lieu, un objet…' : 'A name, a place, an object…'} />
            </label>
            <div className="mosaic-contract-filters" role="group" aria-label={fr ? 'Avancée des missions' : 'Mission progress'}>
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
            {!journal.total && <p data-city-contract-empty>{fr ? 'Aucune mission ne correspond. Change les filtres ou efface la recherche ; la page que tu lis reste ouverte.' : 'No matching missions. Change filters or clear the search; the page you are reading stays open.'}</p>}
            {(query || status !== 'all') && <button type="button" className="mosaic-contract-clear" onClick={clearFilters}>{fr ? 'Effacer les filtres' : 'Clear filters'}</button>}
            {journal.pageCount > 1 && <nav className="mosaic-contract-pages" aria-label={fr ? 'Pages du carnet' : 'Journal pages'}>
              <button type="button" disabled={journal.page === 1} onClick={() => goToPage(journal.page - 1)} aria-controls={`${uid}-results`}>{fr ? 'Précédent' : 'Previous'}</button>
              <button type="button" disabled={journal.page === journal.pageCount} onClick={() => goToPage(journal.page + 1)} aria-controls={`${uid}-results`}>{fr ? 'Suivant' : 'Next'}</button>
            </nav>}
          </div>
        </details>
        <article className="mosaic-contract-reader" aria-labelledby={`${uid}-case-title`} data-city-contract-reader={mission.id}>
          <label><span>{fr ? 'Mission ouverte' : 'Open mission'}</span>
            <select data-city-contract-select value={mission.id} onChange={event => selectMission(event.target.value)}>
              {journal.entries.map(item => <option key={item.mission.id} value={item.mission.id}>{item.heroName} · {item.title} · {item.statusLabel}</option>)}
            </select>
          </label>
          <div className="mosaic-contract-identity"><strong>{entry.heroName}</strong><span data-city-contract-status={objective.status}>{entry.statusLabel}</span>
            {mission.chapter > 1 && <span>{fr ? 'Chapitre' : 'Chapter'} {mission.chapter}</span>}</div>
          <h4 id={`${uid}-case-title`} ref={readerRef} tabIndex={-1}>{entry.title}</h4>
          <p className="mosaic-contract-location" data-city-contract-location><span>{mission.universe}</span>{!objective.legacy && story.location && <strong>{story.location}</strong>}</p>
          {!objective.legacy && story.request && <figure className="mosaic-contract-request" data-city-contract-request>
            <figcaption>{fr ? 'Un mot de' : 'A word from'} <strong>{entry.heroName}</strong></figcaption>
            <blockquote><p>{story.request}</p></blockquote>
          </figure>}
          {!objective.legacy && <p className="mosaic-contract-premise">{localizeCityMission(mission.premise, lang)}</p>}
          {objective.legacy && <p className="mosaic-contract-legacy" data-city-contract-legacy>{fr ? 'Ta première visite reste conservée.' : 'Your first visit is kept safe.'}</p>}
          {objective.originResolution && <aside className="mosaic-contract-origin"><strong>{fr ? 'La dernière fois…' : 'Last time…'}</strong><p>{objective.originResolution}</p></aside>}
          <div className="mosaic-contract-objective" data-finished={objective.status === 'completed'}>
            <span>{objective.status === 'locked' ? (fr ? 'AVANT DE POURSUIVRE' : 'BEFORE YOU CONTINUE') : objective.status === 'completed' ? (fr ? 'CE QUE TON AIDE A CHANGÉ' : 'WHAT YOUR HELP CHANGED') : (fr ? 'TON PROCHAIN PAS' : 'YOUR NEXT STEP')} · {objective.index}/{objective.total}</span>
            <p role="status" ref={objectiveRef} tabIndex={-1} data-city-contract-objective data-contract-id={mission.id} data-step={objective.step?.id || (objective.status === 'completed' ? 'done' : objective.status)}>
              {objective.text}
            </p>
            {objective.step?.operation && <p className="mosaic-contract-on-location" data-city-contract-operation={objective.step.operation.kind}>
              <span>{fr ? 'Une fois sur place' : 'Once you get there'}</span>
              <strong>{localizeCityMission(objective.step.operation.label, lang)}</strong>
              <span>{localizeCityMission(objective.step.operation.propName, lang)}</span>
            </p>}
            <progress value={objective.index} max={Math.max(1, objective.total)} aria-label={fr ? 'Avancée de la mission' : 'Mission progress'} />
          </div>
          {objective.status === 'locked' && objective.prerequisite && journal.entries.some(item => item.mission.id === objective.prerequisite.missionId) && <button type="button" data-city-contract-prerequisite onClick={() => selectMission(objective.prerequisite.missionId, true)}>
            {fr ? 'REVENIR À L’HISTOIRE PRÉCÉDENTE' : 'RETURN TO THE PREVIOUS STORY'}
          </button>}
          {objective.status === 'active' && objective.step?.type === 'decision' ? <fieldset>
            <legend>{fr ? 'Que décides-tu ?' : 'What will you do?'}</legend>
            {objective.step.choices.map(item => <button type="button" className="btn-retro" key={item.id}
              data-city-contract-choice={item.id} onClick={() => {
                const result = onResolve(mission.id, item.id);
                setFeedback(result?.feedback || '');
                if (result?.changed) pendingFocus.current = 'objective';
              }}>{localizeCityMission(item.label, lang)}</button>)}
          </fieldset> : objective.status === 'active' ? <button type="button" className="btn-retro mosaic-contract-action" data-city-contract-approach onClick={() => onApproach(mission.id)}>
            {story.approach}
          </button> : ['available', 'paused'].includes(objective.status) ? <button type="button" className="btn-retro mosaic-contract-action" data-city-contract-accept onClick={() => {
            setFeedback('');
            const result = onAccept(mission.id);
            if (result?.changed) pendingFocus.current = 'objective';
          }}>
            {objective.status === 'paused' ? (fr ? 'REPRENDRE CETTE AVENTURE' : 'CONTINUE THIS ADVENTURE') : (fr ? 'DONNER UN COUP DE MAIN' : 'LEND A HAND')}
          </button> : null}
          {objective.canReplayStory && typeof onReplay === 'function' && <button type="button" className="mosaic-contract-replay" data-city-contract-replay onClick={() => {
            setFeedback('');
            const result = onReplay(mission.id);
            if (result?.changed) pendingFocus.current = 'objective';
          }}>{fr ? 'Rejouer cette aventure' : 'Replay this adventure'}</button>}
          {objective.resolution && objective.status !== 'completed' && <aside className="mosaic-contract-resolution" data-city-contract-resolution><strong>{fr ? 'Ton choix' : 'Your choice'}</strong><p>{objective.resolution}</p></aside>}
          {distinctFeedback && <p role="status" data-city-contract-feedback>{feedback}</p>}
          {(story?.latest?.dialogue || memoryFinding) && <aside className="mosaic-contract-memory" data-city-contract-memory={story.latest.id}>
            <strong>{fr ? 'Dernières nouvelles' : 'The latest'}</strong>
            {story.latest.dialogue && <figure><figcaption>{story.latest.speaker}</figcaption><blockquote><p>{story.latest.dialogue}</p></blockquote></figure>}
            {memoryFinding && <p>{memoryFinding}</p>}
          </aside>}
          {tracked && tracked.mission.id !== mission.id && <p className="mosaic-contract-consultation">{fr ? 'Tu peux lire sans changer de chemin. Si tu choisis cette aventure, tu reprendras l’autre là où tu l’as laissée.' : 'You can read without changing course. If you choose this adventure, you can return to the other where you left off.'}</p>}
          <details className="mosaic-contract-evidence" key={mission.id}>
            <summary>{fr ? 'Le chemin parcouru' : 'Your journey so far'} <span>{objective.index}/{objective.total}</span></summary>
            {story.history.length ? <ol>{story.history.map(step => {
              return <li key={step.id} data-complete={step.done} aria-current={step.index === objective.index ? 'step' : undefined}>
                {localizeCityMission(step.text, lang)}{step.done && <strong>{fr ? ' — accompli' : ' — done'}</strong>}
                {step.done && step.dialogue && <blockquote><p>{localizeCityMission(step.dialogue, lang)}</p><cite>{step.speaker}</cite></blockquote>}
                {step.done && step.finding && <p>{localizeCityMission(step.finding, lang)}</p>}
              </li>;
            })}</ol> : <p className="mosaic-contract-history-empty">{fr ? 'Tes rencontres et tes découvertes s’ajouteront ici au fil du voyage.' : 'Your encounters and discoveries will appear here as you travel.'}</p>}
          </details>
          {story.previousVisit && <details className="mosaic-contract-previous" key={`${mission.id}-previous`} data-city-contract-previous>
            <summary>{fr ? 'Ta première visite' : 'Your first visit'} <span>{story.previousVisit.steps.length}/{objective.total}</span></summary>
            <div className="mosaic-contract-previous-content">
              <h5>{story.previousVisit.title}</h5>
              <p>{story.previousVisit.completed ? (fr ? 'Une aventure déjà accomplie. Ces pages gardent ce que tu as vécu à l’époque.' : 'An adventure already completed. These pages keep what you experienced then.')
                : (fr ? 'Ces pages gardent le chemin de ta première visite, avant de repartir.' : 'These pages keep the journey of your first visit, before you set out again.')}</p>
              <ol>{story.previousVisit.steps.map(step => <li key={step.id}>
                {localizeCityMission(step.text, lang)}
                {step.dialogue && <blockquote><p>{localizeCityMission(step.dialogue, lang)}</p></blockquote>}
                {step.finding && <p>{localizeCityMission(step.finding, lang)}</p>}
              </li>)}</ol>
              {story.previousVisit.choice && <div><strong>{fr ? 'Ton choix à l’époque' : 'Your choice then'}</strong><p>{story.previousVisit.choice}</p><p>{story.previousVisit.resolution}</p></div>}
            </div>
          </details>}
        </article>
      </div>
    </>}
    {progress.activeId && !tracked && <p>{fr ? 'Une mission reste en cours ailleurs, ou attend le retour de son quartier. Tu la retrouveras là où tu l’as laissée.' : 'A mission is still underway elsewhere, or awaits its district’s return. You can pick it up where you left off.'}</p>}
    <small>{complete} {fr ? 'mission(s) accomplie(s). Ton chemin et tes choix restent dans ce carnet.' : 'mission(s) completed. Your journey and choices remain in this journal.'}</small>
  </section>;
}
