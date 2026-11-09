import React from 'react';

const EFFECTS = {
  heal: { fr: 'Soin', en: 'Heal' }, revive: { fr: 'Résurrection', en: 'Revive' },
  cleanse: { fr: 'Purification', en: 'Cleanse' }, buff: { fr: 'Renforcement', en: 'Buff' },
  guard: { fr: 'Protection', en: 'Protection' }
};
const STATUSES = { infected: { fr: 'infection', en: 'infection' }, glitched: { fr: 'glitch', en: 'glitch' }, radiated: { fr: 'radiations', en: 'radiation' } };

export default function TacticsSupportPanel({ state, lang, locked, onTarget }) {
  if (!state) return null;
  const locale = lang === 'fr' ? 'fr' : 'en';
  return <section aria-label={locale === 'fr' ? 'Soutien tactique' : 'Tactical support'} className="glass-panel"
    style={{ padding: 10, marginBottom: 12, borderColor: '#2ecc71' }}>
    <strong>{EFFECTS[state.effect]?.[locale]} — {state.name}</strong>
    <p style={{ fontSize: 11, lineHeight: 1.5 }}>
      {locale === 'fr' ? 'Choisis une cible ici ou une case verte sur le terrain. La validation consomme cette action.'
        : 'Choose a target here or a green battlefield cell. Confirming spends this action.'}
      {state.protection === 'stock-uber' && (locale === 'fr'
        ? ' Medic et un patient maximum : 8 secondes actives, portée de 3 cases et ligne de vue. Aucun soin. Attaquer interrompt le lien.'
        : 'Medic and at most one patient: 8 active seconds, 3-cell range and line of sight. No healing. Attacking ends the link.')}
      {state.sourceSignatureKey === 'aerith_ff7' && (locale === 'fr'
        ? ' Healing Wind : jusqu’à 50 % des PV maximum de chaque allié vivant, portée de 5 cases et ligne de vue. Respecte les radiations ; ni purification ni résurrection.'
        : ' Healing Wind: up to 50% of each living ally’s maximum HP, within 5 cells and line of sight. Respects radiation; no cleanse or revival.')}
      {state.group && (locale === 'fr' ? ' Effet de groupe sur les alliés admissibles à portée.' : 'Group effect on eligible allies in range.')}
    </p>
    {!state.choices.length && <p role="status">{locale === 'fr' ? 'Aucune cible admissible à portée. Une résurrection exige une case libre.' : 'No eligible target in range. Revival requires a free cell.'}</p>}
    <div style={{ display: 'grid', gap: 6 }}>
      {state.choices.map(({ unit, targets }) => {
        const amount = targets.reduce((sum, entry) => sum + entry.amount, 0);
        const cleanses = [...new Set(targets.flatMap(entry => entry.cleanses))];
        return <button type="button" className="btn-action" disabled={locked}
          key={unit.runtimeId || unit.id || `${unit.gridX}:${unit.gridY}`}
          onClick={() => onTarget(unit.gridX, unit.gridY)}>
          {unit.name} — {state.group ? `${targets.length} ${locale === 'fr' ? 'alliés' : 'allies'} · ` : ''}
          {amount > 0 ? `+${Math.round(amount)} ${locale === 'fr' ? 'PV' : 'HP'}` : EFFECTS[state.effect]?.[locale]}
          {cleanses.length > 0 && <span style={{ display: 'block', fontSize: 11 }}>{locale === 'fr' ? 'Retire : ' : 'Removes: '}{cleanses.map(key => STATUSES[key]?.[locale] || key).join(', ')}</span>}
        </button>;
      })}
    </div>
  </section>;
}
