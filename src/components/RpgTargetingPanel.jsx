import React from 'react';
import { getRpgSourceEffectPresentation, getRpgSourceStatusPresentation } from '../game/rpgTargetingPresentation.js';

const EFFECT_LABELS = { damage: ['Dégâts estimés', 'Estimated damage'], heal: ['Soin', 'Healing'], revive: ['Réanimation', 'Revive'], guard: ['Protection', 'Protection'], buff: ['Renforcement', 'Buff'], cleanse: ['Purification', 'Cleanse'], control: ['Immobilisation', 'Immobilize'] };
const SHAPE_LABELS = { single: ['Une cible', 'Single target'], multi: ['Cibles choisies', 'Selected targets'], group: ['Tout le groupe valide', 'All valid group members'], area: ['Zone autour de la cible', 'Area around target'], line: ['Ligne vers la cible', 'Line toward target'], cone: ['Cône vers la cible', 'Cone toward target'] };

export default function RpgTargetingPanel({ targeting, lang, paused, wait, onWaitChange, onSelect, onConfirm, onCancel,
  possessionCommands = [], sourceStatusActors = [], onPossessedTargeting, onReleasePossession }) {
  const fr = lang === 'fr';
  const locale = fr ? 0 : 1;
  const controlling = targeting?.effect === 'control';
  const controlDuration = Number(targeting?.profile?.controlDuration);
  const sourceEffect = getRpgSourceEffectPresentation(targeting, lang);
  return (
    <section aria-label={fr ? 'Ciblage RPG' : 'RPG targeting'} style={{ marginBottom: 12 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, marginBottom: 10 }}>
        <input type="checkbox" checked={wait} disabled={paused} onChange={event => onWaitChange(event.target.checked)} />
        {fr ? 'Attendre pendant le choix des cibles' : 'Wait while selecting targets'}
      </label>
      <div aria-label={fr?'États source actifs':'Active source effects'} style={{fontSize:12,marginBottom:8}}>
        {sourceStatusActors.map(actor=>({actor,label:getRpgSourceStatusPresentation(actor,lang)})).filter(entry=>entry.label).map(({actor,label})=>
          <div key={actor.battleId||actor.runtimeId||actor.id}>{actor.name} · {label}</div>)}
      </div>
      {!targeting && possessionCommands.map(command => <div key={command.controllerId} style={{padding:10,marginBottom:8,border:'1px solid #69deba',borderRadius:6}}>
        <strong>{command.side==='enemy'?'P2':'P1'} · {command.bodyName}</strong>
        <div style={{fontSize:12,marginTop:4}}>{fr?'Possédé par':'Possessed by'} {command.controllerName} · {fr?'ATB du Slig':'Slig ATB'} {Math.floor(command.atb)} / 100</div>
        <div style={{fontSize:11,marginTop:4}}>{fr?'Coût initial déjà payé. Abe reste immobile et chante ; le Slig conserve son corps et son camp.':'Initial cost already paid. Abe remains still and chants; the Slig keeps its body and side.'}</div>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button type="button" className="btn-retro" disabled={paused||!command.ready} onClick={()=>onPossessedTargeting?.(command.controllerId,command.side)}>{command.actionName}</button>
          <button type="button" className="btn-retro" disabled={paused} onClick={()=>onReleasePossession?.(command.controllerId,command.side)}>{fr?'Libérer le Slig':'Release the Slig'}</button>
        </div>
      </div>)}
      {targeting && (
        <div style={{ padding: 12, border: '1px solid #39c5bb', borderRadius: 6, background: '#112b30' }}>
          <div role="status" style={{ marginBottom: 8 }}>
            <strong>{targeting.side === 'enemy' ? 'P2 · ' : ''}{targeting.actorName} — {targeting.abilityName}</strong>
            <div style={{ fontSize: 12, marginTop: 5 }}>
              {SHAPE_LABELS[targeting.shape]?.[locale]}
              {targeting.shape === 'multi' ? ` (${targeting.selectedTargetIds.length}/${targeting.maxTargets})` : ''}
              {' · '}{wait ? (fr ? 'Combat en attente' : 'Combat waiting') : (fr ? 'Combat actif' : 'Combat active')}
            </div>
            {targeting.summon && <div style={{ fontSize: 12, marginTop: 7, color: '#ffd48c' }}>
              {targeting.summon.kind === 'reinforcement' ? (fr ? 'Renfort' : 'Reinforcement') : (fr ? 'Invocation' : 'Summon')}
              {' · '}{targeting.summon.entityName}
              {' · '}{fr ? '100 ATB + 100 charge spéciale · Une fois par personnage et combat. Coût à la confirmation.' : '100 ATB + 100 special charge · Once per character per battle. Cost on confirmation.'}
            </div>}
            {sourceEffect && <div style={{ fontSize: 12, marginTop: 7, color: '#d0e8ff' }}>
              <strong>{sourceEffect.label}</strong>
              <div style={{ marginTop: 4 }}>{sourceEffect.detail}</div>
            </div>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {targeting.eligibleTargets.map(target => {
              const affected = targeting.previewTargetIds.includes(target.id);
              const selected = targeting.selectedTargetIds.includes(target.id);
              const estimate = targeting.estimates?.find(entry => entry.id === target.id);
              return (
                <button key={target.id} type="button" className="btn-retro" disabled={paused}
                  aria-pressed={selected || (targeting.shape === 'group' && affected)} onClick={() => onSelect(target.id)}
                  style={{ padding: '8px 10px', textAlign: 'left', borderColor: affected ? (controlling ? '#d0acff' : '#8effbd') : '#53636b', background: affected ? (controlling ? '#332146' : '#184731') : '#17232d' }}>
                  <span>{affected ? '✓ ' : ''}{target.name}</span>
                  <div style={{ fontSize: 10, marginTop: 4 }}>{target.dead ? 'KO' : `${Math.round(target.hp)}/${Math.round(target.maxHp)} HP`}</div>
                  {affected && estimate && <div style={{ fontSize: 10, marginTop: 4 }}>
                    {sourceEffect?.label || EFFECT_LABELS[estimate.effect]?.[locale] || estimate.effect}
                    {estimate.amount > 0 && !sourceEffect?.hideDamageEstimate ? ` ${estimate.min === estimate.max ? estimate.amount : `${estimate.min}–${estimate.max}`}` : ''}
                    {!sourceEffect && estimate.effect === 'control' && Number.isFinite(controlDuration) && controlDuration > 0 ? ` · ${controlDuration.toLocaleString(fr ? 'fr-FR' : 'en-US')} s` : ''}
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
