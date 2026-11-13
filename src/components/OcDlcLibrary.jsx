import React, { useId, useRef, useState } from 'react';
import { OC_DLC_PACKS, getOcDlcPackByUniverse, isOcDlcMissionUnlocked } from '../game/ocDlcPacks.js';
import { OC_DLC_SAVE_METADATA } from '../game/dlcContentIdentity.js';
import { isUniverseInstalled } from '../game/dlcInstallation.js';
import { getOpenAiBackdropSrc } from '../game/renderer.js';
import { filterOcDlcLibraryEntries, getOcDlcLibraryEntries } from '../game/ocDlcLibraryView.js';
import './OcDlcLibrary.css';

const text = (entry, lang) => typeof entry === 'string' ? entry : entry?.[lang] || entry?.fr || entry?.en || '';
const stateLabel = (state, fr) => state === 'active' ? (fr ? 'ACTIF' : 'ACTIVE') : state === 'reserve'
  ? (fr ? 'EN RÉSERVE' : 'IN RESERVE') : (fr ? 'NON INCLUS' : 'NOT INCLUDED');

export default function OcDlcLibrary({ lang, completedStages, hiddenUniverses, getStageByMissionId, onSetPackActive, onOpenBriefing }) {
  const fr = lang === 'fr';
  const uid = useId();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const search = useRef(null);
  const entries = getOcDlcLibraryEntries({ packs: OC_DLC_PACKS, metadata: OC_DLC_SAVE_METADATA,
    completedStages, hiddenUniverses, isInstalled: isUniverseInstalled, canOpenMission: isOcDlcMissionUnlocked,
    resolvePack: pack => getOcDlcPackByUniverse(pack.universe) || pack });
  const visible = filterOcDlcLibraryEntries(entries, { query, status });
  const reset = () => {
    setQuery(''); setStatus('all');
    search.current?.focus({ preventScroll: true });
    search.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  };
  const openMission = mission => onOpenBriefing(getStageByMissionId(mission.id) || mission);

  return <section className="oc-act-library" aria-labelledby={`${uid}-title`}>
    <header className="oc-act-heading">
      <span className="oc-act-kicker">{fr ? 'BIBLIOTHÈQUE / CRÉATIONS ORIGINALES' : 'LIBRARY / ORIGINAL CREATIONS'}</span>
      <h4 id={`${uid}-title`}>{fr ? 'Actes annexes autonomes' : 'Standalone side acts'}</h4>
      <p>{fr ? 'Des histoires à parcourir à ton rythme. Leur progression est indépendante de la campagne principale.' : 'Stories to explore at your own pace. Their progress is independent of the main campaign.'}</p>
      <details className="oc-act-guidance"><summary>{fr ? 'Choisir un acte, garder son avancée' : 'Choose an act, keep your progress'}</summary>
        <p>{fr ? 'Placer un acte en réserve masque ses missions sans effacer ta progression ni tes possessions. Un acte non inclus demande une édition qui contient ses données ; le menu ne télécharge pas de pack.' : 'Placing an act in reserve hides its missions without erasing your progress or possessions. An act that is not included requires an edition with its data; this menu does not download packs.'}</p>
      </details>
    </header>
    <div className="oc-act-controls">
      <label htmlFor={`${uid}-search`}><span>{fr ? 'Trouver un acte ou une mission' : 'Find an act or mission'}</span>
        <input ref={search} id={`${uid}-search`} type="search" value={query} aria-controls={`${uid}-results`}
          onChange={event => setQuery(event.target.value)} placeholder={fr ? 'Un titre, un univers…' : 'A title, a universe…'} />
      </label>
      <label><span>{fr ? 'Afficher' : 'Show'}</span><select value={status} onChange={event => setStatus(event.target.value)}>
        {['all', 'active', 'reserve', 'absent', 'completed'].map(key => <option key={key} value={key}>
          {key === 'all' ? (fr ? 'Tous les actes' : 'All acts') : key === 'completed' ? (fr ? 'Actes terminés' : 'Completed acts') : stateLabel(key, fr)}
          {' · '}{entries.filter(entry => key === 'all' || (key === 'completed' ? entry.complete : entry.state === key)).length}
        </option>)}
      </select></label>
      <button type="button" className="oc-act-button" onClick={reset}>{fr ? 'Réinitialiser' : 'Reset'}</button>
    </div>
    <p className="oc-act-results" role="status" aria-live="polite">{visible.length}/{entries.length} {fr ? 'actes affichés' : 'acts shown'}</p>
    <div id={`${uid}-results`} className="oc-act-grid">
      {visible.map(entry => {
        const { pack, included, active, savedReserve, completedCount, missionIds, complete, targetMission, targetUnlocked } = entry;
        const accent = pack.decor?.accent || pack.colors?.at(-1) || '#83e9de';
        const backdrop = entry.loaded ? getOpenAiBackdropSrc(pack.universe, 'RPG') || '/images/missions/campaign-oc.webp' : null;
        return <article key={pack.id} className="oc-act-card" data-oc-dlc-pack={pack.id} data-pack-active={active ? 'true' : 'false'}
          data-pack-installed={included ? 'true' : 'false'} style={{ '--oc-act-accent': accent }}>
          <header className="oc-act-cover" style={backdrop ? { backgroundImage: `linear-gradient(180deg, rgba(3,8,16,.35), rgba(3,8,16,.96)), url("${backdrop}")` } : undefined}>
            <div className="oc-act-badges"><span>{entry.loaded ? text(pack.actLabel, lang) : (fr ? 'DOSSIER CONSERVÉ' : 'PRESERVED RECORD')}</span>
              <strong data-oc-act-state={entry.state}>{stateLabel(entry.state, fr)}</strong></div>
            <span className="oc-act-universe">{pack.universe}</span>
            <h4>{text(pack.title, lang) || pack.universe}</h4>
          </header>
          <div className="oc-act-body">
            <p className="oc-act-description">{included ? text(pack.desc, lang) : (fr ? 'Cet acte n’est pas inclus dans cette édition. Ta progression et tes possessions sont conservées pour son retour.' : 'This act is not included in this edition. Your progress and possessions are retained for its return.')}</p>
            <div className="oc-act-progress"><span>{fr ? 'Progression de l’acte' : 'Act progress'}</span><strong>{completedCount}/{missionIds.length}</strong>
              <progress value={completedCount} max={Math.max(1, missionIds.length)} aria-label={`${fr ? 'Progression de' : 'Progress of'} ${text(pack.title, lang) || pack.universe}`} />
            </div>
            {included ? <>
              <div className="oc-act-primary-actions">
                <button type="button" className="oc-act-button oc-act-next" disabled={!targetUnlocked}
                  onClick={() => targetUnlocked && openMission(targetMission)} aria-describedby={!targetUnlocked ? `${uid}-${pack.id}-unavailable` : undefined}>
                  {complete ? (fr ? 'Revoir le briefing final' : 'Review the final briefing') : (fr ? 'Mission suivante' : 'Next mission')}
                </button>
                <button type="button" className="oc-act-button" data-oc-act-reserve onClick={() => onSetPackActive(pack.universe, !active)}>
                  {active ? (fr ? 'Placer en réserve' : 'Place in reserve') : (fr ? 'Activer cet acte' : 'Activate this act')}
                </button>
              </div>
              {!targetUnlocked && <p className="oc-act-explanation" id={`${uid}-${pack.id}-unavailable`}>
                {!active ? (fr ? 'Active cet acte pour reprendre ses missions.' : 'Activate this act to resume its missions.') : (fr ? 'La mission suivante est encore scellée.' : 'The next mission is still sealed.')}
              </p>}
              <details className="oc-act-missions" data-oc-act-missions>
                <summary>{fr ? 'Parcourir les missions' : 'Browse missions'} <span>{missionIds.length}</span></summary>
                <ol>{pack.missions.map((mission, index) => {
                  const completed = completedStages.some(id => String(id) === String(mission.id));
                  const unlocked = active && isOcDlcMissionUnlocked(mission, completedStages);
                  const reason = !active ? (fr ? 'Active cet acte pour ouvrir ses briefings.' : 'Activate this act to open its briefings.')
                    : (fr ? 'Termine la mission précédente de cet acte.' : 'Complete the previous mission in this act.');
                  const reasonId = `${uid}-oc-dlc-mission-${mission.id}-locked-reason`;
                  return <li key={mission.id}>
                    <button type="button" className="oc-act-button oc-act-mission" aria-disabled={!unlocked}
                      aria-describedby={!unlocked ? reasonId : undefined} data-oc-act-mission={mission.id}
                      onClick={() => { if (unlocked) openMission(mission); }}>
                      <span className="oc-act-mission-index" aria-hidden="true">{completed ? '✓' : String(index + 1).padStart(2, '0')}</span>
                      <span className="oc-act-mission-title">{text(mission.displayName || mission.name, lang)}</span>
                      <small>{fr && mission.mode === 'Tactics' ? 'Tactique' : mission.mode} · {completed ? (fr ? 'Terminée' : 'Completed') : unlocked ? (fr ? 'Ouverte' : 'Open') : (fr ? 'Scellée' : 'Sealed')}</small>
                    </button>
                    {!unlocked && <p id={reasonId} className="oc-act-explanation">{reason}</p>}
                  </li>;
                })}</ol>
              </details>
              <details className="oc-act-content"><summary>{fr ? 'Dans cet acte' : 'In this act'}</summary><dl>
                {[[fr ? 'Héros' : 'Heroes', pack.heroes.length], [fr ? 'Menaces' : 'Threats', pack.monsters.length + pack.bosses.length + (pack.worldBoss ? 1 : 0)],
                  [fr ? 'Reliques' : 'Relics', pack.gear.length + (pack.event ? 1 : 0)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl></details>
            </> : <p className="oc-act-explanation">{savedReserve ? (fr ? 'Préférence conservée : en réserve.' : 'Saved preference: in reserve.') : (fr ? 'Préférence conservée : actif au retour.' : 'Saved preference: active when restored.')}</p>}
          </div>
        </article>;
      })}
    </div>
    {!visible.length && <div className="oc-act-empty"><h4>{fr ? 'Aucun acte dans cette sélection' : 'No acts in this selection'}</h4>
      <p>{fr ? 'Modifie le titre recherché ou l’état affiché. Tes histoires et leur progression restent conservées.' : 'Change the search or displayed state. Your stories and their progress are retained.'}</p>
      <button type="button" className="oc-act-button" onClick={reset}>{fr ? 'Retrouver tous les actes' : 'Show all acts'}</button>
    </div>}
  </section>;
}
