import React from 'react';
const PHASES = { prepare: ['Préparation', 'Preparing'], reveal: ['Manifestation', 'Manifesting'], impact: ['Impacts', 'Impacts'], return: ['Retour au combat', 'Returning to battle'] };
const KINDS = { support: ['Soutien', 'Support'], summon: ['Invocation', 'Summon'], personal: ['Super personnel', 'Personal super'], orbital: ['Appui orbital', 'Orbital support'], vehicle: ['Renfort motorisé', 'Vehicle support'], turret: ['Sentinelles', 'Sentries'], creature: ['Déploiement biologique', 'Creature deployment'], barrier: ['Couverture', 'Cover'], archive: ['Protocole A.R.C.A.', 'A.R.C.A. protocol'] };
export default function SignatureSequencePanel({ state, lang = 'fr' }) {
  if (!state) return null;
  const l = lang === 'fr' ? 0 : 1;
  return <section className="glass-panel signature-sequence" aria-label={l ? 'Signature sequence' : 'Séquence signature'}
    data-signature-phase={state.phase} style={{ padding: 12, marginBlock: 10, borderColor: state.color, overflowWrap: 'anywhere' }}>
    <strong>{KINDS[state.kind]?.[l] || state.kind} — {state.name}</strong>
    <p style={{ fontSize: 12, marginBlock: 6 }}>{state.actorName} · {state.universe}</p>
    <span>{state.projectile === 'returning-disc'
      ? (state.hit > 0 ? (l ? 'Disc released — damage only on collision' : 'Disque lancé — dégâts uniquement au contact')
        : (l ? 'Preparing the throw' : 'Préparation du lancer'))
      : <>{PHASES[state.phase]?.[l]} · {state.hit}/{state.hits}</>}</span>
    <progress aria-label={l ? 'Sequence progress' : 'Progression de la séquence'} value={state.tick} max={state.duration} style={{ width: '100%' }} />
    <small style={{ display: 'block', fontSize: 10 }}>{state.fidelity === 'project-original'
      ? (l ? 'Original Nexus ability.' : 'Capacité originale du Nexus.')
      : (l ? 'Nexus adaptation; exact source choreography not yet certified.' : 'Adaptation Nexus ; chorégraphie source exacte non certifiée.')}</small>
  </section>;
}
