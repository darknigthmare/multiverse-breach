import React from 'react';
import './SignatureCodexPanel.css';
import { getSignatureCodex, getSignatureSummary } from '../game/signatureCodex.js';

// The compact booster manifest has legacy 8px/nowrap paragraph rules.
// Override them on the full dossier itself, not on unrelated compact cards.
const paragraphStyle = { fontSize: 12, lineHeight: 1.6, whiteSpace: 'normal',
  overflow: 'visible', textOverflow: 'clip', margin: '10px 0' };

export default function SignatureCodexPanel({ actor, lang = 'fr', codex: supplied }) {
  const codex = supplied || getSignatureCodex(actor);
  if (!codex) return null;
  const fr = lang === 'fr';
  const physical = codex.projectile === 'returning-disc';
  const spirits = codex.summonAgent === 'wraithverge-spirit';
  const support = codex.protection === 'stock-uber';
  let behavior;
  if (spirits) behavior = fr
    ? 'Quatre spectres autonomes dans les deux modes. Dégâts uniquement à la collision ; les cibles perdues ne sont pas remplacées.'
    : 'Four autonomous spirits in both modes. Damage only on collision; lost targets are not replaced.';
  else if (physical) behavior = fr
    ? 'Disque à trajectoire réelle en mêlée : un impact possible à l’aller, retour inoffensif. En RPG : contact abstrait.'
    : 'Physical disc in melee: one possible outbound hit, harmless return. RPG uses an abstract contact.';
  else if (support) behavior = fr
    ? `Protection du Medic et d’un patient au maximum, ${codex.durationTicks / 60} secondes actives. Ni soin, ni résurrection, ni immunité à tous les dangers.`
    : `Protects the Medic and at most one patient for ${codex.durationTicks / 60} active seconds. No healing, revival or immunity to every hazard.`;
  else if (codex.effect === 'heal') behavior = fr
    ? 'Soigne les alliés vivants admissibles, respecte le plafond d’irradiation ; ne purifie pas et ne ressuscite pas.'
    : 'Heals eligible living allies, respecting the radiation cap; does not cleanse or revive.';
  else behavior = fr
    ? `${codex.hits} contact(s) prévu(s) ; ${codex.distribution === 'random' ? 'répartition aléatoire sur les cibles confirmées' : codex.distribution === 'cycle' ? 'répartition cyclique sur les cibles confirmées' : 'sur les cibles admissibles'}. Portée et défenses restent applicables.`
    : `${codex.hits} planned contact(s); ${codex.distribution === 'random' ? 'randomly distributed over confirmed targets' : codex.distribution === 'cycle' ? 'cycled over confirmed targets' : 'on eligible targets'}. Range and defenses still apply.`;
  return <details data-signature-codex={codex.key} style={{ marginBlock: 10, padding: 10,
    border: '1px solid #365c65', borderRadius: 6, overflowWrap: 'anywhere', fontSize: 12, lineHeight: 1.6 }}>
    <summary>{fr ? 'Capacité réellement intégrée' : 'Integrated combat ability'} — {codex.name}</summary>
    <p style={paragraphStyle}>{getSignatureSummary(codex, lang)}</p>
    <p style={paragraphStyle}>{codex.universe}{codex.continuity ? ` · ${codex.continuity}` : ''}</p>
    {codex.summonName && <p style={paragraphStyle}>{fr ? 'Invocation associée : ' : 'Associated summon: '}{codex.summonName}</p>}
    <p style={paragraphStyle}>{behavior}</p>
    <p style={paragraphStyle}>{fr ? 'Ces informations décrivent le contrat de base, pas un aperçu des dégâts de ton équipement ni un déblocage offert.'
      : 'This is the base contract, not a damage preview for your equipment or a free unlock.'}</p>
    {codex.referenceUrl && <a href={codex.referenceUrl} target="_blank" rel="noopener noreferrer"
      style={{ color: '#a2ecff' }}>{fr ? 'Référence de la capacité' : 'Ability reference'}</a>}
  </details>;
}
