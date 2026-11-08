import React from 'react';
import { getExtinctionPrimaryInstruction } from '../game/extinctionFighterProfiles.js';
import './ExtinctionFighterBriefing.css';

const text = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
// Older roster projections also store category codes and generated action names
// in hero.weapon. They describe a kit, not a documented equipment item.
const legacyWeaponLabel = /^(?:gun|laser|slash|improvised)$| signature action$/i;

export default function ExtinctionFighterBriefing({ profile, lang = 'fr' }) {
  if (!profile?.eligible) return null;
  const fr = lang === 'fr';
  const primary = profile.signature?.actions.simple;
  const equipment = profile.equipment
    .filter(item => !item.reviewRequired && (item.provenance === 'hero.equipment'
      || (item.provenance === 'hero.weapon' && !legacyWeaponLabel.test(text(item.label, lang).trim()))))
    .map(item => text(item.label, lang)).filter(Boolean);
  return <section className="extinction-fighter-briefing" data-fighter-profile={profile.heroId} data-profile-status={profile.reviewStatus} data-fps-view-src={profile.view.src}
    aria-label={fr ? 'Équipement et vue du personnage' : 'Character equipment and view'}>
    <strong>{fr ? 'ÉQUIPEMENT ET VUE' : 'EQUIPMENT AND VIEW'}</strong>
    <p data-fps-loadout={equipment.length ? 'equipment' : 'primary-action'}>
      <span>{equipment.length ? (fr ? 'Équipement : ' : 'Equipment: ') : (fr ? 'Action principale du kit : ' : 'Kit primary action: ')}</span>
      <span data-fps-loadout-value>{equipment.length ? equipment.join(' · ') : text(primary?.name, lang)}</span>
    </p>
    <div className="extinction-fighter-facts">
      <span data-fps-view-status={profile.view.artStatus}>{profile.view.src
        ? fr ? 'Vue personnelle' : 'Personal view'
        : fr ? 'Vue schématique' : 'Schematic view'}</span>
      <span>{profile.resource.reload
        ? fr ? 'Stock de munitions · recharge R' : 'Ammunition stock · reload R'
        : fr ? 'Actions réutilisables après récupération' : 'Actions reusable after cooldown'}</span>
    </div>
    <p className="extinction-fighter-note">{getExtinctionPrimaryInstruction(primary, lang)}</p>
    <p className="extinction-fighter-note">{fr ? 'Après un ramassage, V permet de reprendre ton kit personnel avec son stock conservé.' : 'After a pickup, V restores your personal kit with its remaining stock.'}</p>
    {profile.ultimateCharge?.kind === 'evasion' && <p className="extinction-fighter-note" data-ultimate-charge="evasion">{text(profile.ultimateCharge.rule, lang)}</p>}
    {profile.source.incarnation && <details><summary>{fr ? 'Incarnation' : 'Incarnation'}</summary>
      <p>{profile.source.incarnation}</p>
    </details>}
  </section>;
}
