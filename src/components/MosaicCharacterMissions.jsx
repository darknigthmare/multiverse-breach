import React, { useRef, useState } from 'react';
import { getMosaicCharacterMissionObjective, localizeCityMission } from '../game/mosaicCharacterMissions.js';
import './MosaicCharacterMissions.css';

export default function MosaicCharacterMissions({ missions, progress, heroes, lang, onAccept, onApproach, onResolve }) {
  const [selectedId, setSelectedId] = useState(progress.activeId || progress.lastMissionId || '');
  const [feedback, setFeedback] = useState('');
  const objectiveRef = useRef(null);
  const mission = missions.find(item => item.id === selectedId) || missions.find(item => item.id === progress.activeId) || missions[0];
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  const complete = Object.values(progress.records).filter(item => item.completed).length;
  const heroName = id => heroes.find(hero => hero.id === id)?.name || (id === 'player_anchor' ? (lang === 'fr' ? 'Ton Ancre' : 'Your Anchor') : id);
  return <section className="mosaic-character-missions" aria-label={lang === 'fr' ? 'Contrats des habitants' : 'Resident contracts'}>
    <h3>{lang === 'fr' ? 'CONTRATS DES HABITANTS' : 'RESIDENT CONTRACTS'}</h3>
    {!mission ? <p>{lang === 'fr' ? 'Les contrats disponibles dépendent du quartier, de ses habitants possédés et des contenus installés. Retrouve leurs auteurs dans le Nexus ou dans les quartiers qui proposent des contrats. Les étapes déjà réalisées restent conservées.' : 'Available contracts depend on the district, its owned residents and installed content. Find their authors in the Nexus or districts offering contracts. Completed steps remain saved.'}</p> : <>
      <label><span>{lang === 'fr' ? 'Choisir un contrat' : 'Choose a contract'}</span>
        <select data-city-contract-select value={mission.id} onChange={event => { setSelectedId(event.target.value); setFeedback(''); }}>
          {missions.map(item => <option key={item.id} value={item.id}>{heroName(item.heroId)} · {localizeCityMission(item.title, lang)}</option>)}
        </select>
      </label>
      <h4>{localizeCityMission(mission.title, lang)}</h4>
      <p>{localizeCityMission(mission.premise, lang)}</p>
      <ol>
        {mission.steps.map((step, index) => <li key={step.id} data-complete={index < objective.index}>
          {localizeCityMission(step.text, lang)}{index < objective.index && <strong>{lang === 'fr' ? ' — fait' : ' — done'}</strong>}
          {index < objective.index && step.finding && <p>{localizeCityMission(step.finding, lang)}</p>}
        </li>)}
      </ol>
      <p role="status" ref={objectiveRef} tabIndex={-1} data-city-contract-objective data-contract-id={mission.id} data-step={objective.step?.id || 'done'}>
        {objective.index}/{objective.total} · {objective.text}
      </p>
      {objective.status === 'active' && objective.step?.type === 'decision' ? <fieldset>
        <legend>{lang === 'fr' ? 'Conclusion à inscrire' : 'Conclusion to record'}</legend>
        {objective.step.choices.map(item => <button type="button" className="btn-retro" key={item.id}
          data-city-contract-choice={item.id} onClick={() => {
            const result = onResolve(mission.id, item.id);
            setFeedback(result?.feedback || '');
            if (result?.changed) requestAnimationFrame(() => objectiveRef.current?.focus());
          }}>{localizeCityMission(item.label, lang)}</button>)}
      </fieldset> : objective.status === 'active' ? <button type="button" className="btn-retro" data-city-contract-approach onClick={() => onApproach(mission.id)}>
        {lang === 'fr' ? 'REJOINDRE CETTE ÉTAPE' : 'APPROACH THIS STEP'}
      </button> : ['available', 'paused'].includes(objective.status) ? <button type="button" className="btn-retro" data-city-contract-accept onClick={() => { setFeedback(''); onAccept(mission.id); }}>
        {objective.status === 'paused' ? (lang === 'fr' ? 'REPRENDRE LE CONTRAT' : 'RESUME CONTRACT') : (lang === 'fr' ? 'ACCEPTER LE CONTRAT' : 'ACCEPT CONTRACT')}
      </button> : null}
      {objective.resolution && objective.status !== 'completed' && <p>{objective.resolution}</p>}
      {feedback && <p role="status" data-city-contract-feedback>{feedback}</p>}
    </>}
    {progress.activeId && !missions.some(item => item.id === progress.activeId) && <p>{lang === 'fr' ? 'Un contrat est suivi dans un autre quartier ou attend le retour de son contenu. Sa progression est conservée.' : 'A tracked contract belongs to another district or awaits its content’s return. Its progress is retained.'}</p>}
    <small>{complete} {lang === 'fr' ? 'dossier(s) transmis. Les preuves et choix restent dans le journal.' : 'case(s) submitted. Evidence and choices remain in the journal.'}</small>
  </section>;
}
