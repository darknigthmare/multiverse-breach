import React from 'react';

const EFFECT_LABELS = { damage: ['Dégâts estimés', 'Estimated damage'], heal: ['Soin', 'Healing'], revive: ['Réanimation', 'Revive'], guard: ['Protection', 'Protection'], buff: ['Renforcement', 'Buff'], cleanse: ['Purification', 'Cleanse'] };
const STATUS_LABELS = { infected: ['Infection', 'Infection'], glitched: ['Glitch', 'Glitch'], radiated: ['Radiations', 'Radiation'] };
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
              {targeting.sourceHits > 1 && <div>
                {fr ? `${targeting.sourceHits} contacts` : `${targeting.sourceHits} contacts`}
                {targeting.sourceDistribution === 'random'
                  ? (fr ? ' répartis aléatoirement dans le groupe ; la fourchette concerne chaque cible.' : ' randomly distributed across the group; ranges apply per target.')
                  : targeting.sourceDistribution === 'cycle'
                    ? (fr ? ' répartis dans le groupe, sans remplacement des cibles perdues.' : ' distributed across the group, without replacing lost targets.')
                    : (fr ? ' successifs sur les cibles confirmées.' : ' successive contacts on confirmed targets.')}
              </div>}
              {' · '}{wait ? (fr ? 'Combat en attente' : 'Combat waiting') : (fr ? 'Combat actif' : 'Combat active')}
            </div>
          </div>
          {targeting.sourceProfile?.protectionTicks > 0 && <p data-support-preview="stock-uber" style={{ fontSize: 12, lineHeight: 1.5 }}>
            {fr ? 'Protège le Medic et une seule cible alliée pendant huit secondes de simulation. Ne soigne pas et ne ressuscite pas. La liaison cesse pour une cible hors de portée ; le recul et les dangers du monde restent actifs.'
              : 'Protects the Medic and one allied target for eight simulation seconds. Does not heal or revive. An out-of-range target loses the link; knockback and world hazards remain active.'}
          </p>}
          {targeting.sourceProfile && <details data-source-profile={targeting.sourceProfile.key}
            style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.5 }}>
            <summary>{fr ? 'Fiche de la capacité utilisée' : 'Current ability source'}</summary>
            <div>{targeting.sourceProfile.universe}{targeting.sourceProfile.continuity ? ` · ${targeting.sourceProfile.continuity}` : ''}</div>
            {targeting.sourceProfile.summonAgent && <div>{fr
              ? 'Quatre spectres poursuivent les cibles confirmées. Les dégâts exigent un contact ; leur portée de poursuite et leur durée sont limitées. Une cible perdue ne sera pas remplacée.'
              : 'Four spirits pursue confirmed targets. Damage requires contact; pursuit and lifetime are bounded. Lost targets are not replaced.'}</div>}
            {targeting.sourceProfile.summonName && <div>{fr ? 'Invocation : ' : 'Summon: '}{targeting.sourceProfile.summonName}</div>}
            <div>{fr ? 'Coût : une ATB pleine et 100 % de charge spéciale, une seule fois après confirmation.' : 'Cost: full ATB and 100% special charge, once after confirmation.'}</div>
            <div>{fr ? 'Famille d’attaque documentée ; dégâts, portée, contacts et animation adaptés au Nexus.' : 'Documented attack family; damage, range, contacts and animation adapted for the Nexus.'}</div>
            {targeting.sourceProfile.referenceUrl?.startsWith('https://') && <a href={targeting.sourceProfile.referenceUrl}
              target="_blank" rel="noopener noreferrer" style={{ color: '#a2ecff' }}>
              {fr ? 'Consulter la référence' : 'Read the source reference'}
            </a>}
          </details>}
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
                    {estimate.amount > 0 || estimate.max > 0 ? ` ${estimate.min === estimate.max ? estimate.amount : `${estimate.min}–${estimate.max}`}` : ''}
                    {estimate.blockedByUber && <div>{fr ? 'ÜberCharge : dégâts bloqués.' : 'ÜberCharge: damage blocked.'}</div>}
                    {estimate.cleansedStatuses?.length > 0 && <div>
                      {fr ? 'Purification : ' : 'Cleanse: '}
                      {estimate.cleansedStatuses.map(status => STATUS_LABELS[status]?.[locale] || status).join(', ')}
                    </div>}
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
