import React from 'react';
import './NexusFieldBriefing.css';

const localized = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';

export default function NexusFieldBriefing({ access, completion, heroes = [], exhibits = [], lang = 'fr', children }) {
  const briefing = access?.briefing;
  const witness = briefing && heroes.find(hero => hero.id === briefing.witnessId);
  return <section className="nexus-field-briefing" data-field-access={access?.reason || 'report_required'}
    aria-label={lang === 'fr' ? 'Intervention Nexus' : 'Nexus field operation'}>
    <span className="nexus-field-kicker">{lang === 'fr' ? 'CITÉ → EXTINCTION' : 'CITY → EXTINCTION'}</span>
    <h3>{lang === 'fr' ? 'Retour des témoins' : 'Witness return'}</h3>
    <p>{lang === 'fr'
      ? 'Mets le rapport du Nexus à l’épreuve : synchronise trois relais, neutralise le Champion, puis ramène le relevé au sas vert avec E / LOOT. La Marge reste active pendant le retour.'
      : 'Put the Nexus report to the test: synchronize three relays, defeat the Champion, then bring the record to the green airlock with E / LOOT. The Margin remains active during the return.'}</p>
    {!access?.available && <p className="nexus-field-lock" role="status">{access?.reason === 'roster_required'
      ? (lang === 'fr' ? 'Une signature combattante possédée est nécessaire pour intervenir.' : 'An owned combat signature is required to deploy.')
      : (lang === 'fr' ? 'Termine d’abord la reconnaissance du quartier Nexus et transmets son rapport à l’ancre locale.' : 'First complete the Nexus district reconnaissance and submit its report at the local anchor.')}</p>}
    {briefing && <details className="nexus-field-source">
      <summary>{lang === 'fr' ? 'Rapport source et preuves conservées' : 'Source report and retained evidence'}</summary>
      <p>{lang === 'fr' ? 'Témoin' : 'Witness'} : {witness?.name || briefing.witnessId}</p>
      <ul>{briefing.evidenceIds.map(id => <li key={id}>{localized(exhibits.find(item => item.id === id)?.name, lang) || id}</li>)}</ul>
    </details>}
    {completion && <p className="nexus-field-completion" data-field-completed>
      {lang === 'fr' ? 'Relevé confirmé au sas · première intervention archivée.' : 'Record confirmed at the airlock · first operation archived.'}
    </p>}
    <small>{lang === 'fr'
      ? 'Récompenses habituelles d’Extraction. Un abandon laisse le rapport de la Cité disponible pour une nouvelle tentative.'
      : 'Standard Extraction rewards. Abandoning leaves the City report available for another attempt.'}</small>
    {children && <div className="nexus-field-actions">{children}</div>}
  </section>;
}
