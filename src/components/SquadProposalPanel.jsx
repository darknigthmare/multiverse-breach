import React from 'react';
import './SquadProposalPanel.css';

const localized = (name, lang) => typeof name === 'string' ? name : name?.[lang] || name?.fr || name?.en || '—';

export default function SquadProposalPanel({ proposal, lang, heroes, getGearDisplay, valid, onConfirm, onCancel }) {
  if (!proposal) return null;
  const french = lang === 'fr';
  const heroName = heroId => localized(heroes.find(hero => hero.id === heroId)?.name || heroId, lang);
  return (
    <section className="squad-proposal" aria-label={french ? 'Proposition à confirmer' : 'Proposal to confirm'}>
      <h4>{proposal.kind === 'gear' ? (french ? 'PROPOSITION DE RELIQUES' : 'RELIC PROPOSAL') : (french ? 'PROPOSITION D’ÉQUIPE' : 'TEAM PROPOSAL')}</h4>
      <p>{french ? 'Aucun changement appliqué. La réserve, les ressources et l’inventaire ne sont pas modifiés par cette prévisualisation.' : 'No changes applied. This preview does not change the reserve, resources or inventory.'}</p>
      <div className="squad-proposal-score">
        <span>{french ? 'Préparation avant' : 'Readiness before'}: <strong>{proposal.beforeReadiness.score}%</strong></span>
        <span>{french ? 'Préparation proposée' : 'Proposed readiness'}: <strong>{proposal.afterReadiness.score}%</strong></span>
      </div>
      <p>{french ? 'La préparation A.R.C.A. décrit la composition et l’équipement, pas une probabilité de victoire.' : 'A.R.C.A. readiness describes team composition and equipment, not the probability of victory.'}</p>
      {proposal.kind === 'gear' ? (
        <div className="squad-proposal-table">
          <table>
            <thead><tr><th>{french ? 'Héros' : 'Hero'}</th><th>{french ? 'Avant' : 'Before'}</th><th>{french ? 'Après confirmation' : 'After confirmation'}</th></tr></thead>
            <tbody>{proposal.team.map(heroId => <tr key={heroId}>
              <th scope="row">{heroName(heroId)}</th>
              <td>{localized(getGearDisplay(proposal.before[heroId])?.name, lang)}</td>
              <td>{localized(getGearDisplay(proposal.after[heroId])?.name, lang)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      ) : (
        <div className="squad-proposal-teams">
          <div><strong>{french ? 'Équipe actuelle' : 'Current team'}</strong><ol>{proposal.beforeTeam.map(heroId => <li key={heroId}>{heroName(heroId)}</li>)}</ol></div>
          <div><strong>{french ? 'Équipe proposée' : 'Proposed team'}</strong><ol>{proposal.team.map(heroId => <li key={heroId}>{heroName(heroId)}</li>)}</ol></div>
        </div>
      )}
      <div className="squad-proposal-stats">{['hp', 'atk', 'def', 'spd'].map(stat => <span key={stat}>{stat.toUpperCase()}: {proposal.beforeStats[stat]} → {proposal.afterStats[stat]}</span>)}</div>
      {proposal.kind === 'team' && proposal.exact ? <p>{french ? 'Maximum exact de la formule affichée parmi les équipes légales possédées, à contraintes identiques.' : 'Exact maximum of the displayed formula among owned legal teams under the same constraints.'}</p> : null}
      {proposal.kind === 'team' && !proposal.anchorPreserved ? <p>{french ? 'L’Ancre est remplacée uniquement pour respecter les conditions de la mission sélectionnée.' : 'The Anchor is replaced only to respect the selected mission requirements.'}</p> : null}
      {proposal.partial ? <p>{french ? 'Moins de trois héros éligibles sont possédés : proposition incomplète, mais légale.' : 'Fewer than three eligible heroes are owned: this proposal is incomplete but legal.'}</p> : null}
      {!valid ? <p role="status">{french ? 'La collection ou l’équipe a changé. Annule puis recalcule cette proposition.' : 'The collection or team changed. Cancel and recalculate this proposal.'}</p> : null}
      {!proposal.changed ? <p>{french ? 'Aucun changement nécessaire.' : 'No change required.'}</p> : null}
      <div className="squad-proposal-actions">
        <button type="button" className="btn-retro" disabled={!valid || !proposal.changed} onClick={onConfirm}>{french ? 'CONFIRMER CES CHANGEMENTS' : 'CONFIRM THESE CHANGES'}</button>
        <button type="button" className="btn-retro" onClick={onCancel}>{french ? 'ANNULER SANS MODIFIER' : 'CANCEL WITHOUT CHANGES'}</button>
      </div>
    </section>
  );
}
