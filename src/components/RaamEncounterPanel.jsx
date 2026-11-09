import React from 'react';
import { rpgUnitId } from '../game/rpgTargeting';
import './RaamEncounterPanel.css';

export default function RaamEncounterPanel({ encounter, hero, lang = 'fr', paused = false, targeting = false, onCommand }) {
  if (!encounter?.bossId) return null;
  const fr = lang === 'fr';
  const heroCover = encounter.heroes?.find(entry => entry.id === rpgUnitId(hero))?.inLightCover === true;
  const ready = Boolean(hero && hero.currentHp > 0 && hero.atb >= 100 && hero.state === 'idle' && !paused && !targeting);
  const canUse = command => ready && encounter.commands?.[command] === true;
  return (
    <section className="raam-encounter-panel" aria-label={fr ? 'Train Lightmass : RAAM et Kryll' : 'Lightmass train: RAAM and Kryll'}>
      <strong>{encounter.shieldActive
        ? (fr ? 'RAAM protégé par les Kryll' : 'RAAM protected by Kryll')
        : (fr ? 'RAAM exposé : attaquez maintenant' : 'RAAM exposed: attack now')}</strong>
      <p>{fr
        ? 'Dispersez les Kryll avec une grenade frag. Les zones éclairées protègent de l’essaim, pas des tirs de la Troika.'
        : 'Disperse the Kryll with a frag grenade. Lit cover protects from the swarm, not Troika gunfire.'}</p>
      <div className="raam-encounter-panel-status" aria-live="polite">
        {fr ? 'Grenades frag' : 'Frag grenades'} : {encounter.grenadesRemaining || 0}
        {' · '}{heroCover ? (fr ? 'À couvert dans la lumière' : 'In lit cover') : (fr ? 'Hors de la lumière' : 'Outside lit cover')}
      </div>
      <div className="raam-encounter-panel-actions">
        <button type="button" disabled={!canUse('frag') || encounter.grenadesRemaining <= 0} onClick={() => onCommand?.('frag')}>
          {fr ? 'Lancer une grenade frag' : 'Throw frag grenade'}
        </button>
        <button type="button" disabled={!canUse(heroCover ? 'leaveLightCover' : 'takeLightCover')} onClick={() => onCommand?.(heroCover ? 'leave-light-cover' : 'take-light-cover')}>
          {heroCover ? (fr ? 'Quitter la lumière' : 'Leave lit cover') : (fr ? 'Rejoindre la lumière' : 'Take lit cover')}
        </button>
      </div>
      {!ready && <small>{fr ? 'Sélectionnez un héros prêt, avec son ATB pleine.' : 'Select a ready hero with full ATB.'}</small>}
    </section>
  );
}
