import React, { useId, useRef, useState } from 'react';
import { fieldOperationPreferenceStore } from '../game/fieldOperationPreferences.js';
import DlcInstallationPanel from './DlcInstallationPanel.jsx';
export { default as DlcInstallationPanel } from './DlcInstallationPanel.jsx';
import './GameSystemSections.css';

export function FieldOperationSettings({ lang = 'fr', store = fieldOperationPreferenceStore }) {
  const fr = lang === 'fr';
  const [state, setState] = useState(() => store.read());
  const change = (key, value) => setState(store.write({ ...state.value, [key]: value }));
  return <section className="system-field-settings">
    <h3>{fr ? 'Doctrine de terrain' : 'Field doctrine'}</h3>
    <p>{fr ? 'Ces choix s’appliquent aux nouveaux dossiers et aux prochaines parties. Un dossier déjà accepté conserve ses règles et sa progression.' : 'These choices apply to new dossiers and upcoming runs. Accepted dossiers retain their rules and progress.'}</p>
    <fieldset><legend>{fr ? 'Cité — reconnaissance' : 'City — reconnaissance'}</legend>
      <label><span>{fr ? 'Type d’enquête' : 'Investigation type'}</span><select value={state.value.reconnaissance} onChange={e => change('reconnaissance', e.target.value)}>
        <option value="standard">Standard</option>
        <option value="cross-check">{fr ? 'Enquête croisée' : 'Cross-check'}</option>
      </select></label>
      <p>{state.value.reconnaissance === 'cross-check'
        ? (fr ? 'Recueille le témoignage d’un habitant, examine deux reliques distinctes à portée, puis remets le rapport à l’ancre. Deux reliques accessibles sont nécessaires.' : 'Meet a resident, inspect two distinct relics in range, then report at the anchor. Two accessible relics are required.')
        : (fr ? 'Rencontre un habitant, examine une relique à portée puis transmets ton rapport à l’ancre locale.' : 'Meet a resident, inspect one relic in range, then report at the local anchor.')}</p>
    </fieldset>
    <fieldset><legend>{fr ? 'FPS — Relais sous pression' : 'FPS — Relay Under Pressure'}</legend>
      <label><span>{fr ? 'Périmètre du relais' : 'Relay perimeter'}</span><select value={state.value.relays} onChange={e => change('relays', e.target.value)}>
        <option value="standard">Standard</option>
        <option value="contested">{fr ? 'Périmètre contesté' : 'Contested perimeter'}</option>
      </select></label>
      <p>{fr ? 'Active Relais sous pression dans Solo Extraction. En mode contesté, un ennemi vivant à deux unités ou moins de la balise bloque sa synchronisation et sa validation finale. La progression déjà acquise est conservée.' : 'Enable Relay Under Pressure in Solo Extraction. In contested mode, a live hostile within two units of the beacon blocks synchronization and final confirmation. Earned progress is retained.'}</p>
    </fieldset>
    <button type="button" className="btn-retro" onClick={() => setState(store.write({ schemaVersion: 1 }))}>{fr ? 'Revenir aux règles standard' : 'Restore standard rules'}</button>
    <p role="status" className="game-setting-notice">{state.persisted
      ? (fr ? 'Préférences locales prêtes pour les prochaines opérations.' : 'Local preferences ready for upcoming operations.')
      : (fr ? 'Stockage indisponible : choix actifs pour cette session uniquement.' : 'Storage unavailable: choices apply to this session only.')}</p>
  </section>;
}

export default function GameSystemSections({ lang = 'fr', children }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef([]);
  const labels = lang === 'fr' ? ['Système', 'Packs DLC', 'Terrain'] : ['System', 'DLC packs', 'Field'];
  const keyDown = (event, index) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % labels.length
      : event.key === 'ArrowLeft' ? (index + labels.length - 1) % labels.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? labels.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); event.stopPropagation(); setActive(next); buttons.current[next]?.focus();
  };
  return <div className="system-sections">
    <div className="system-section-tabs" role="tablist" aria-label={lang === 'fr' ? 'Sections du système' : 'System sections'}>
      {labels.map((label, index) => <button key={index} ref={node => { buttons.current[index] = node; }} type="button" role="tab"
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index}
        tabIndex={active === index ? 0 : -1} onKeyDown={event => keyDown(event, index)} onClick={() => setActive(index)}>{label}</button>)}
    </div>
    {[children, <DlcInstallationPanel key="packs" lang={lang} />, <FieldOperationSettings key="field" lang={lang} />].map((content, index) =>
      <div key={index} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}>{content}</div>)}
  </div>;
}
