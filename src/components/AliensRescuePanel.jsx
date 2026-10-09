import React from 'react';
import { aliensRescueHeroId, getAliensRescueObjectiveText } from '../game/canonAliensRescueEncounter';
import './CanonRescuePanel.css';

export default function AliensRescuePanel({ encounter, hero, lang = 'fr', paused = false, inputLocked = false, onCommand }) {
  if (encounter?.id !== 'aliens-1986-newt-rescue') return null;
  const fr = lang === 'fr';
  const heroId = aliensRescueHeroId(hero);
  const location = encounter.heroes?.find(entry => entry.id === heroId);
  const carrier = encounter.heroes?.find(entry => entry.id === encounter.carrierId);
  const ready = Boolean(hero && hero.currentHp > 0 && hero.state === 'idle'
    && !hero.actionPending && !paused && !inputLocked);
  const canRescue = ready && encounter.phase === 'rescue' && !encounter.rescued
    && location?.nearNewt === true && encounter.commands?.rescueNewt === true;
  const canEvacuate = ready && encounter.phase === 'escape' && encounter.rescued === true
    && heroId === encounter.carrierId && location?.nearExit === true && encounter.commands?.evacuate === true;
  const completed = encounter.complete === true || encounter.phase === 'complete';
  const status = completed
    ? (fr ? 'Newt sauvée · Évacuation réussie' : 'Newt rescued · Evacuation complete')
    : encounter.rescued
      ? (fr ? `Newt accompagne ${carrier?.name || 'son porteur'}` : `Newt is with ${carrier?.name || 'her carrier'}`)
      : location?.nearNewt
        ? (fr ? 'Près du repère NEWT' : 'Near the NEWT marker')
        : (fr ? 'Approchez du repère NEWT' : 'Approach the NEWT marker');
  const guidance = paused
    ? (fr ? 'Reprenez la mission pour agir.' : 'Resume the mission to act.')
    : inputLocked
      ? (fr ? 'Attendez le début du combat.' : 'Wait for the battle to begin.')
      : !hero || hero.currentHp <= 0
        ? (fr ? 'Sélectionnez un héros vivant.' : 'Select a living hero.')
        : !ready
          ? (fr ? 'Immobilisez le héros et attendez la fin de son action.' : 'Stop moving and wait for the hero’s action to finish.')
          : encounter.phase === 'search'
            ? (fr ? 'Traversez les vagues de la ruche pour atteindre le nid.' : 'Cross the hive waves to reach the nest.')
            : encounter.phase === 'escape' && heroId !== encounter.carrierId
              ? (fr ? 'Sélectionnez le porteur de Newt pour évacuer.' : 'Select Newt’s carrier to evacuate.')
              : encounter.phase === 'escape' && !location?.nearExit
                ? (fr ? 'Marchez avec Newt vers le repère ÉVACUATION, à gauche.' : 'Walk with Newt to the EVACUATE marker on the left.')
                : encounter.phase === 'rescue' && !location?.nearNewt
                  ? (fr ? 'Marchez vers le repère NEWT dans le nid, puis arrêtez-vous.' : 'Walk to the NEWT marker in the nest, then stop.')
                  : null;
  return (
    <section className="canon-rescue-panel canon-rescue-panel-aliens" aria-label={fr ? 'Aliens : sauvetage de Newt' : 'Aliens: Newt rescue'}>
      <strong>{fr ? 'Sauver Newt et évacuer le processeur' : 'Rescue Newt and evacuate the processor'}</strong>
      <p>{getAliensRescueObjectiveText({ ...encounter, complete: completed }, lang)}</p>
      <p>{fr
        ? 'Repoussez la Reine pour ouvrir le passage. Sa mort ne termine pas cette mission ; le duel au Power Loader sur le Sulaco se déroule plus tard.'
        : 'Repel the Queen to clear a path. Her death does not complete this mission; the power-loader duel aboard the Sulaco happens later.'}</p>
      <div className="canon-rescue-panel-status" aria-live="polite">{status}</div>
      <div className="canon-rescue-panel-actions">
        <button type="button" disabled={!canRescue || completed} onClick={() => { if (canRescue && !completed) onCommand?.('rescue-newt'); }}>
          {fr ? 'Libérer Newt' : 'Free Newt'}
        </button>
        <button type="button" disabled={!canEvacuate || completed} onClick={() => { if (canEvacuate && !completed) onCommand?.('evacuate'); }}>
          {fr ? 'Évacuer avec Newt' : 'Evacuate with Newt'}
        </button>
      </div>
      {!completed && guidance && <small>{guidance}</small>}
    </section>
  );
}
