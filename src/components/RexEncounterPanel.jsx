import React from 'react';
import { rpgUnitId } from '../game/rpgTargeting';
import './RexEncounterPanel.css';

const validPool = (hp, maxHp) => Number.isFinite(hp) && Number.isFinite(maxHp)
  && maxHp > 0 && hp >= 0 && hp <= maxHp;

export default function RexEncounterPanel({ encounter, hero, lang = 'fr', paused = false, selectedAction, onSelectStinger }) {
  if (encounter?.id !== 'mgs1998_shadow_moses_rex'
    || !['radome', 'cockpit', 'complete'].includes(encounter.phase)) return null;
  const fr = lang === 'fr';
  const complete = encounter.phase === 'complete' || encounter.completed === true;
  const selected = (selectedAction === undefined ? encounter.selectedAction : selectedAction) === 'rex_stinger';
  const cell = encounter.targetCell;
  const validCell = Number.isInteger(cell?.x) && Number.isInteger(cell?.y) && cell.x >= 0 && cell.y >= 0;
  const cellLabel = validCell ? `${String.fromCharCode(65 + cell.x)}${cell.y + 1}` : null;
  const minRange = encounter.stingerProfile?.minRange;
  const range = encounter.stingerProfile?.range;
  const validRange = Number.isFinite(minRange) && Number.isFinite(range) && minRange >= 0 && range >= minRange;
  const validRadome = validPool(encounter.radomeHp, encounter.radomeMaxHp);
  const validCockpit = validPool(encounter.cockpitHp, encounter.cockpitMaxHp);
  const activeHero = Boolean(hero && rpgUnitId(hero) && rpgUnitId(hero) === encounter.activeHeroId
    && Number.isFinite(hero.currentHp) && hero.currentHp > 0);
  const ready = activeHero && !paused && !complete && validCell && validRange && validRadome && validCockpit
    && encounter.commands?.selectStinger === true;
  const heading = complete
    ? (fr ? 'Metal Gear REX désactivé' : 'Metal Gear REX disabled')
    : encounter.phase === 'cockpit'
      ? (fr ? 'Phase 2 : viser le cockpit ouvert' : 'Phase 2: target the open cockpit')
      : (fr ? 'Phase 1 : détruire le radome' : 'Phase 1: destroy the radome');
  const guidance = complete ? null
    : paused
      ? (fr ? 'Reprenez la mission pour agir.' : 'Resume the mission to act.')
      : !activeHero
        ? (fr ? 'Attendez le tour d’un héros vivant de votre escouade.' : 'Wait for a living squad hero’s turn.')
        : !validCell || !validRange || !validRadome || !validCockpit
          ? (fr ? 'La cible REX est indisponible.' : 'The REX target is unavailable.')
          : !ready
            ? (fr ? 'Attendez la fin de l’action en cours.' : 'Wait for the current action to finish.')
            : encounter.inRange === false
              ? selected
                ? (fr ? 'Annulez la visée pour vous déplacer à portée.' : 'Cancel targeting to move into range.')
                : (fr ? 'Placez le héros à portée avant de viser.' : 'Move the hero into range before targeting.')
              : encounter.lineOfSight === false
                ? selected
                  ? (fr ? 'Annulez la visée puis déplacez-vous pour dégager la ligne de vue.' : 'Cancel targeting, then move to clear the line of sight.')
                  : (fr ? 'Déplacez le héros pour dégager la ligne de vue.' : 'Move the hero to clear the line of sight.')
                : selected
                  ? (fr ? 'Cliquez maintenant sur la cellule de REX pour tirer au Stinger.' : 'Now click REX’s cell to fire the Stinger.')
                  : (fr ? 'Préparez le Stinger, puis cliquez sur la cellule de REX.' : 'Ready the Stinger, then click REX’s cell.');
  return (
    <section className="rex-encounter-panel" aria-label={fr ? 'Shadow Moses : radome et cockpit de REX' : 'Shadow Moses: REX radome and cockpit'}>
      <strong>{heading}</strong>
      <p>{complete
        ? (fr ? 'Liquid Snake survit à la destruction de REX. Son duel au corps à corps se déroule après cette mission.' : 'Liquid Snake survives REX’s destruction. His fistfight takes place after this mission.')
        : (fr ? 'Le Stinger est fourni pour cette mission. Visez le radome, puis le cockpit ouvert. Les attaques sur le blindage ne terminent pas la mission.' : 'A Stinger is supplied for this mission. Target the radome, then the open cockpit. Attacks on the armor do not complete the mission.')}</p>
      <dl className="rex-encounter-panel-pools">
        <div><dt>Radome</dt><dd>{validRadome ? `${encounter.radomeHp}/${encounter.radomeMaxHp}` : '—'}</dd></div>
        <div><dt>Cockpit</dt><dd>{validCockpit ? `${encounter.cockpitHp}/${encounter.cockpitMaxHp}` : '—'}</dd></div>
      </dl>
      {!complete && <div className="rex-encounter-panel-status" aria-live="polite">
        {validCell && <span>{fr ? 'Cellule de REX' : 'REX cell'} : {cellLabel}</span>}
        {validRange && <span>{fr ? 'Portée du Stinger' : 'Stinger range'} : {minRange}–{range} {fr ? 'cases · ligne de vue dégagée requise' : 'cells · clear line of sight required'}</span>}
        {encounter.inRange === true && encounter.lineOfSight === true && <span>{fr ? 'Cible à portée et ligne de vue dégagée' : 'Target in range with clear line of sight'}</span>}
      </div>}
      {encounter.grayFoxAssistance === true && <p className="rex-encounter-panel-lore">{fr
        ? 'Gray Fox aide à exposer le cockpit. Son intervention est résumée pour cette mission tactique.'
        : 'Gray Fox helps expose the cockpit. His intervention is summarized for this tactical mission.'}</p>}
      <button type="button" className="rex-encounter-panel-action" aria-pressed={selected && !complete} disabled={!ready}
        onClick={() => { if (ready) onSelectStinger?.(); }}>
        {selected && !complete
          ? (fr ? 'Annuler la visée du Stinger' : 'Cancel Stinger targeting')
          : (fr ? 'Préparer le Stinger' : 'Ready the Stinger')}
      </button>
      {guidance && <small>{guidance}</small>}
    </section>
  );
}
