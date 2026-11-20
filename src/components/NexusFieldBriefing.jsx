import React, { useId } from 'react';
import './NexusFieldBriefing.css';

const localized = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';

const steps = [
  {
    id: 'relays',
    title: { fr: 'Sécuriser trois relais', en: 'Secure three relays' },
    instruction: {
      fr: 'Active chaque balise avec E / LOOT. Reste trois secondes dans le périmètre, puis utilise de nouveau E / LOOT pour la stabiliser.',
      en: 'Activate each beacon with E / LOOT. Stay inside its perimeter for three seconds, then use E / LOOT again to secure it.'
    }
  },
  {
    id: 'champion',
    title: { fr: 'Neutraliser le Champion', en: 'Defeat the Champion' },
    instruction: { fr: 'Élimine le Champion de Trame et les autres hostiles.', en: 'Eliminate the Thread Champion and the remaining hostiles.' }
  },
  {
    id: 'airlock',
    title: { fr: 'Transmettre au sas', en: 'Report at the airlock' },
    instruction: {
      fr: 'Suis le losange vert au radar et transmets le relevé avec E / LOOT. La Marge reste active pendant le retour.',
      en: 'Follow the green diamond on the radar and transmit the record with E / LOOT. The Margin stays active on the way back.'
    }
  }
];

export default function NexusFieldBriefing({ access, completion, heroes = [], exhibits = [], lang = 'fr', renderAction }) {
  const id = useId();
  const french = lang === 'fr';
  const briefing = access?.briefing;
  const witness = briefing && heroes.find(hero => hero.id === briefing.witnessId);
  const statusId = `${id}-status`;
  const status = access?.available ? (french ? 'Rapport de la Cité validé.' : 'City report verified.')
    : access?.reason === 'roster_required'
      ? (french ? 'Débloque une signature combattante pour intervenir.' : 'Unlock a combat signature to deploy.')
      : (french ? 'Termine la reconnaissance du quartier Nexus et transmets son rapport à l’ancre locale.' : 'Complete the Nexus district reconnaissance and submit its report at the local anchor.');

  return (
    <section className="nexus-field-briefing" data-field-access={access?.reason || 'report_required'} aria-labelledby={`${id}-title`}>
      <header>
        <span className="nexus-field-kicker">{french ? 'CITÉ → EXTINCTION' : 'CITY → EXTINCTION'}</span>
        <h3 id={`${id}-title`}>{french ? 'Retour des témoins' : 'Witness return'}</h3>
      </header>
      <div className="nexus-field-actions">
        <p id={statusId} className="nexus-field-status" role="status">{status}</p>
        {renderAction?.(statusId)}
      </div>
      {completion && <p className="nexus-field-completion" data-field-completed>
        {french ? 'Relevé confirmé au sas · première intervention archivée.' : 'Record confirmed at the airlock · first operation archived.'}
      </p>}
      <ol className="nexus-field-steps" aria-label={french ? 'Ordre des objectifs' : 'Objective order'}>
        {steps.map(step => <li key={step.id}>
          <strong>{localized(step.title, lang)}</strong>
          <span>{localized(step.instruction, lang)}</span>
        </li>)}
      </ol>
      {briefing && <details className="nexus-field-source">
        <summary>{french ? 'Rapport et preuves de la Cité' : 'City report and evidence'}</summary>
        <p>{french ? 'Témoin' : 'Witness'} · {localized(witness?.name, lang) || briefing.witnessId}</p>
        <ul>{briefing.evidenceIds.map(evidenceId => <li key={evidenceId}>
          {localized(exhibits.find(item => item.id === evidenceId)?.name, lang) || evidenceId}
        </li>)}</ul>
      </details>}
      <p className="nexus-field-terms">{french
        ? 'Récompenses habituelles d’Extraction. En cas d’abandon, le rapport reste disponible pour une nouvelle tentative.'
        : 'Standard Extraction rewards. If you abort, the report stays available for another attempt.'}</p>
    </section>
  );
}
