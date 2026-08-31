import React from 'react';

const EFFECT_LABELS = { damage: ['Dégâts estimés', 'Estimated damage'], heal: ['Soin', 'Healing'], revive: ['Réanimation', 'Revive'], guard: ['Protection', 'Protection'], buff: ['Renforcement', 'Buff'], cleanse: ['Purification', 'Cleanse'] };
const SHAPE_LABELS = { single: ['Une cible', 'Single target'], multi: ['Cibles choisies', 'Selected targets'], group: ['Tout le groupe valide', 'All valid group members'], area: ['Zone autour de la cible', 'Area around target'], line: ['Ligne vers la cible', 'Line toward target'], cone: ['Cône vers la cible', 'Cone toward target'] };

export default function RpgTargetingPanel({ targeting, lang, paused, wait, onWaitChange, onSelect, onConfirm, onCancel }) {
  const fr = lang === 'fr';
  const locale = fr ? 0 : 1;
  return (
    <section aria-label={fr ? 'Ciblage RPG' : 'RPG targeting'} style={{ marginBottom: 12 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, marginBottom: 10 }}>
        <input type="checkbox" checked={wait} disabled={paused} onChange={event => onWaitChange(event.target.checked)} />
        {fr ? 'Attendre pendant le choix des cibles' : 'Wait while selecting targets'}
      </label>
      {targeting && (
        <div style={{ padding: 12, border: '1px solid #39c5bb', borderRadius: 6, background: '#112b30' }}>
          <div role="status" style={{ marginBottom: 8 }}>
            <strong>{targeting.side === 'enemy' ? 'P2 · ' : ''}{targeting.actorName} — {targeting.abilityName}</strong>
            <div style={{ fontSize: 12, marginTop: 5 }}>
              {SHAPE_LABELS[targeting.shape]?.[locale]}
              {targeting.shape === 'multi' ? ` (${targeting.selectedTargetIds.length}/${targeting.maxTargets})` : ''}
              {' · '}{wait ? (fr ? 'Combat en attente' : 'Combat waiting') : (fr ? 'Combat actif' : 'Combat active')}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {targeting.eligibleTargets.map(target => {
              const affected = targeting.previewTargetIds.includes(target.id);
              const selected = targeting.selectedTargetIds.includes(target.id);
              const estimate = targeting.estimates?.find(entry => entry.id === target.id);
              return (
                <button key={target.id} type="button" className="btn-retro" disabled={paused}
                  aria-pressed={selected || (targeting.shape === 'group' && affected)} onClick={() => onSelect(target.id)}
                  style={{ padding: '8px 10px', textAlign: 'left', borderColor: affected ? '#8effbd' : '#53636b', background: affected ? '#184731' : '#17232d' }}>
                  <span>{affected ? '✓ ' : ''}{target.name}</span>
                  <div style={{ fontSize: 10, marginTop: 4 }}>{target.dead ? 'KO' : `${Math.round(target.hp)}/${Math.round(target.maxHp)} HP`}</div>
                  {affected && estimate && <div style={{ fontSize: 10, marginTop: 4 }}>
                    {EFFECT_LABELS[estimate.effect]?.[locale] || estimate.effect}
                    {estimate.amount > 0 ? ` ${estimate.min === estimate.max ? estimate.amount : `${estimate.min}–${estimate.max}`}` : ''}
                  </div>}
                </button>
              );
            })}
          </div>
          {!targeting.valid && <p role="status" style={{ fontSize: 12, color: '#ffd48c' }}>
            {fr ? 'Choisis une cible valide. Si elle est devenue indisponible, annule ou change de cible : aucune ressource ne sera dépensée.' : 'Choose a valid target. If it became unavailable, cancel or select another: no resources will be spent.'}
          </p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            <button type="button" className="btn-retro" disabled={paused || !targeting.valid} onClick={onConfirm}>{fr ? 'Confirmer les cibles' : 'Confirm targets'}</button>
            <button type="button" className="btn-retro" disabled={paused} onClick={onCancel}>{fr ? 'Annuler sans coût' : 'Cancel without cost'}</button>
          </div>
        </div>
      )}
    </section>
  );
}
