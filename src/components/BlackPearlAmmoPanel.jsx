import React from 'react';
import { getBlackPearlSourceAmmunition } from '../game/canonBlackPearlSourceKits.js';
import './CanonRescuePanel.css';

export default function BlackPearlAmmoPanel({ hero, mode, lang = 'fr', side = 'P1', paused = false, inputLocked = false, busy = false, hasTarget = false, curseActive = false, onShoot }) {
  const policy = getBlackPearlSourceAmmunition(hero);
  if (!policy) return null;
  const fr = lang === 'fr';
  const remaining = Number.isFinite(hero.sourceAmmoRemaining) ? Math.max(0, hero.sourceAmmoRemaining) : 0;
  const ready = mode === 'Smash' && hero.currentHp > 0 && remaining > 0 && !(hero.cooldown > 0)
    && !paused && !inputLocked && !busy && hasTarget && !curseActive;
  return (
    <section className="canon-rescue-panel" aria-label={fr ? 'Balle réservée de Jack' : 'Jack’s reserved shot'}>
      <strong>{mode === 'Smash' ? `${side} · ` : ''}{fr ? 'Pistolet à silex : balle réservée' : 'Flintlock pistol: reserved shot'}</strong>
      <p aria-live="polite">{fr ? 'Balle restante' : 'Remaining shot'} : {remaining}/{policy.maxShots}</p>
      {curseActive && <p>{fr ? 'Conservée pour le duel avec Barbossa.' : 'Reserved for the Barbossa duel.'}</p>}
      {mode === 'Smash' && <div className="canon-rescue-panel-actions">
        <button type="button" disabled={!ready} onClick={() => { if (ready) onShoot?.(); }}>
          {fr ? 'Tirer la balle réservée' : 'Fire the reserved shot'}
        </button>
      </div>}
      {mode === 'Smash' && remaining > 0 && !hasTarget && <small>{fr
        ? 'Placez un adversaire à portée devant Jack pour tirer.'
        : 'Bring an opponent into range in front of Jack to fire.'}</small>}
      {remaining === 0 && <small>{fr
        ? 'Balle utilisée. Continuez à l’épée ; la réserve revient à la prochaine bataille.'
        : 'Shot used. Continue with the sword; the reserve returns in the next battle.'}</small>}
    </section>
  );
}
