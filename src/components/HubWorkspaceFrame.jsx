import React, { useId } from 'react';
import './HubWorkspaceFrame.css';

const SECTIONS = {
  inventory: ['02 / INTENDANCE', '02 / LOGISTICS', 'Arsenal', 'Armory', 'Prépare les reliques de chaque membre avant le déploiement.', 'Prepare each member’s relics before deployment.'],
  shop: ['02 / INTENDANCE', '02 / LOGISTICS', 'Comptoir des Trames', 'Thread exchange', 'Échange tes ressources contre un équipement ou une trace disponible.', 'Exchange your resources for available equipment or a trace.'],
  roster: ['01 / COMMANDEMENT', '01 / COMMAND', 'Résonance héroïque', 'Hero resonance', 'Retrouve tes alliés, leurs talents et leur équipement.', 'Review your allies, their talents and equipment.'],
  party: ['01 / COMMANDEMENT', '01 / COMMAND', 'Escouade de déploiement', 'Deployment squad', 'Compose ton équipe active et prépare ses relais.', 'Compose your active team and prepare its reserves.'],
  anchorProfile: ['01 / COMMANDEMENT', '01 / COMMAND', 'Dossier de l’Ancre', 'Anchor dossier', 'Identité, apparence et soutien de ton personnage.', 'Your character’s identity, appearance and support.'],
  codex: ['04 / ARCHIVES', '04 / ARCHIVES', 'Mémoires du Nexus', 'Nexus memories', 'Consulte le canon, les arcs et les univers accessibles à ton parcours.', 'Explore the canon, arcs and universes available along your journey.'],
  admin: ['04 / RÉGULATION', '04 / REGULATION', 'Registre des Trames', 'Thread register', 'Choisis les univers actifs. Leur mise en réserve conserve tes données.', 'Choose active universes. Placing them in reserve preserves your data.']
};

export default function HubWorkspaceFrame({ section, lang = 'fr', metrics = [], actions, children }) {
  const headingId = useId();
  const copy = SECTIONS[section] || SECTIONS.codex;
  const french = lang === 'fr';
  return (
    <section className={`hub-workspace hub-workspace--${section}`} aria-labelledby={headingId}>
      <header className="hub-workspace-heading">
        <div className="hub-workspace-title">
          <span className="hub-workspace-kicker">A.R.C.A. / {copy[french ? 0 : 1]}</span>
          <h2 id={headingId}>{copy[french ? 2 : 3]}</h2>
          <p>{copy[french ? 4 : 5]}</p>
        </div>
        {actions ? <div className="hub-workspace-actions">{actions}</div> : null}
      </header>
      {metrics.length > 0 ? (
        <dl className="hub-workspace-metrics">
          {metrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`} data-tone={metric.tone || 'neutral'}>
              <dt>{metric.label}</dt><dd>{metric.value}</dd>
              {metric.detail ? <p>{metric.detail}</p> : null}
            </div>
          ))}
        </dl>
      ) : null}
      <div className="hub-workspace-body">{children}</div>
    </section>
  );
}
