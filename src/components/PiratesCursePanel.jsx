import React from 'react';
import './CanonRescuePanel.css';

export default function PiratesCursePanel({ encounter, hero, lang = 'fr', paused = false, targeting = false, onCommand }) {
  if (!encounter?.bossId) return null;
  const fr = lang === 'fr';
  const ready = Boolean(hero && hero.currentHp > 0 && hero.atb >= 100 && hero.state === 'idle'
    && !hero.actionPending && !paused && !targeting && !encounter.commandPending && !encounter.ritualPending);
  const cursed = encounter.curseActive === true;
  const commands = [
    { key: 'collectFinalCoins', action: 'collect-final-coins', phase: 'coins', label: fr ? 'Rassembler les deux dernières pièces' : 'Collect the final two coins' },
    { key: 'coordinateWill', action: 'coordinate-will', phase: 'offerings', label: fr ? 'Coordonner Will et Jack' : 'Coordinate Will and Jack' },
    { key: 'restoreChest', action: 'restore-chest', phase: 'restore', label: fr ? 'Faire restituer les pièces par Will' : 'Have Will restore the coins' }
  ];
  const heading = cursed
    ? (fr ? 'Briser la malédiction aztèque' : 'Break the Aztec curse')
    : (fr ? 'Malédiction levée : Barbossa est mortel' : 'Curse lifted: Barbossa is mortal');
  const instruction = encounter.phase === 'coins'
    ? (fr ? 'Rassemblez les deux dernières pièces : celle de Will et celle prise par Jack pendant le duel.' : 'Collect the final two coins: Will’s coin and the one Jack takes during the duel.')
    : encounter.phase === 'offerings'
      ? (fr ? 'Coordonnez les offrandes de Will et Jack. Un autre membre de l’escouade ne peut pas remplacer leur paiement.' : 'Coordinate Will and Jack’s offerings. Another squad member cannot replace their payment.')
      : encounter.phase === 'restore'
        ? (fr ? 'Jack tire sur Barbossa, puis Will remet les deux pièces au coffre. La levée de la malédiction rend la blessure mortelle.' : 'Jack shoots Barbossa, then Will returns both coins to the chest. Lifting the curse makes the wound fatal.')
        : (fr ? 'Le tir de Jack termine le duel avec Barbossa. Les autres pirates deviennent mortels.' : 'Jack’s shot ends the duel with Barbossa. The other pirates become mortal.');
  const pending = Boolean(encounter.commandPending || encounter.ritualPending);
  const guidance = pending
    ? (fr ? 'Action en cours…' : 'Action in progress…')
    : paused
      ? (fr ? 'Reprenez le combat pour agir.' : 'Resume the battle to act.')
      : targeting
        ? (fr ? 'Terminez ou annulez le ciblage en cours.' : 'Finish or cancel the current targeting action.')
        : !ready && cursed
          ? (fr ? 'Sélectionnez un héros vivant et disponible avec son ATB pleine.' : 'Select an available living hero with full ATB.')
          : null;
  return (
    <section className="canon-rescue-panel canon-rescue-panel-pirates" aria-label={fr ? 'Isla de Muerta : malédiction de Barbossa' : 'Isla de Muerta: Barbossa’s curse'}>
      <strong>{heading}</strong>
      <p>{instruction}</p>
      <p>{fr
        ? 'Will Turner, fils de Bootstrap Bill Turner, et Jack Sparrow fournissent leurs offrandes de sang. Votre escouade coordonne ces assistants. Les offrandes ne retirent pas de PV à votre équipe. Si Jack de 2003 est vivant dans l’escouade, prendre sa pièce le rend immortel jusqu’à la restitution ; Will et les autres héros restent mortels.'
        : 'Will Turner, son of Bootstrap Bill Turner, and Jack Sparrow provide their blood offerings. Your squad coordinates these assistants. The offerings do not cost squad HP. If playable 2003 Jack is alive in the squad, taking his coin makes him immortal until restitution; Will and other heroes remain mortal.'}</p>
      {cursed && <p>{fr
        ? 'Barbossa et ses pirates maudits survivent aux coups tant que le trésor et les paiements ne sont pas restitués.'
        : 'Barbossa and his cursed pirates survive attacks until the treasure and payments are restored.'}</p>}
      {encounter.cursedHeroIds?.length > 0 && <p>{fr ? "Jack jouable est maudit : ses PV sont protégés jusqu’à la restitution." : "Playable Jack is cursed: his HP is protected until restitution."}</p>}
      <div className="canon-rescue-panel-status" aria-live="polite">
        {fr ? 'Pièces rendues au coffre' : 'Coins restored to the chest'} : {encounter.returnedPieces ?? 0}/{encounter.totalPieces ?? 882}
        {' · '}{encounter.finalCoinsCollected ? (fr ? 'Deux dernières pièces rassemblées' : 'Final two coins collected') : (fr ? 'Deux dernières pièces manquantes' : 'Final two coins missing')}
        {encounter.willBloodReady && encounter.jackBloodReady && <>{' · '}{fr ? 'Offrandes de Will et Jack prêtes' : 'Will and Jack’s offerings ready'}</>}
      </div>
      <div className="canon-rescue-panel-actions canon-rescue-panel-actions-three">
        {commands.map(command => {
          const enabled = ready && cursed && encounter.phase === command.phase && encounter.commands?.[command.key] === true;
          return <button key={command.action} type="button" disabled={!enabled} onClick={() => { if (enabled) onCommand?.(command.action); }}>{command.label}</button>;
        })}
      </div>
      {guidance && <small>{guidance}</small>}
    </section>
  );
}
