import React, { useEffect, useState } from 'react';
import {
  DEFAULT_DISPLAY_PREFERENCES, DISPLAY_PREFERENCES_KEY, DISPLAY_PREFERENCES_EVENT,
  applyDisplayPreferences, normalizeDisplayPreferences, readDisplayPreferences, saveDisplayPreferences
} from '../game/displayPreferences.js';
import './game-system.css';

export function GameDisplayPreferencesSync() {
  useEffect(() => {
    const sync = event => {
      if (event?.type === 'storage' && event.key !== DISPLAY_PREFERENCES_KEY && event.key !== null) return;
      applyDisplayPreferences(event?.detail || readDisplayPreferences());
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(DISPLAY_PREFERENCES_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(DISPLAY_PREFERENCES_EVENT, sync);
    };
  }, []);
  return null;
}

export default function GameDisplaySettings({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const [preferences, setPreferences] = useState(readDisplayPreferences);
  const [fullscreen, setFullscreen] = useState(() => typeof document !== 'undefined' && Boolean(document.fullscreenElement));
  const [notice, setNotice] = useState('');
  const supportsFullscreen = typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function' && document.fullscreenEnabled !== false;

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    const syncPreferences = event => {
      if (event.type === 'storage' && event.key !== DISPLAY_PREFERENCES_KEY && event.key !== null) return;
      setPreferences(normalizeDisplayPreferences(event.detail || readDisplayPreferences()));
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    window.addEventListener(DISPLAY_PREFERENCES_EVENT, syncPreferences);
    window.addEventListener('storage', syncPreferences);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
      window.removeEventListener(DISPLAY_PREFERENCES_EVENT, syncPreferences);
      window.removeEventListener('storage', syncPreferences);
    };
  }, []);

  const change = patch => {
    const next = applyDisplayPreferences({ ...preferences, ...patch });
    setPreferences(next);
    const saved = saveDisplayPreferences(next);
    setNotice(saved.ok ? '' : (fr ? 'Réglages appliqués pour cette session. Leur enregistrement est indisponible.' : 'Settings applied for this session. They could not be saved.'));
    window.dispatchEvent(new CustomEvent(DISPLAY_PREFERENCES_EVENT, { detail: next }));
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice('');
    } catch {
      setNotice(fr ? 'Le navigateur ne permet pas le plein écran ici. Le jeu utilise toujours toute la surface disponible.' : 'Fullscreen is unavailable here. The game still fills the available viewport.');
    }
  };

  return <section className="game-display-settings" aria-label={fr ? 'Affichage et accessibilité' : 'Display and accessibility'}>
    <div className="game-setting-heading"><h3>{fr ? 'Affichage et interface' : 'Display and interface'}</h3>
      <button type="button" className="btn-retro" disabled={!supportsFullscreen && !fullscreen} onClick={toggleFullscreen}>
        {fullscreen ? (fr ? 'Quitter le plein écran' : 'Exit fullscreen') : (fr ? 'Plein écran' : 'Fullscreen')}
      </button>
    </div>
    {!supportsFullscreen && <p className="game-setting-note">{fr ? 'Le plein écran système est indisponible dans ce navigateur.' : 'System fullscreen is unavailable in this browser.'}</p>}
    <label className="game-range-setting"><span>{fr ? 'Taille du texte' : 'Text size'}</span>
      <input type="range" min="1" max="1.5" step="0.05" value={preferences.textScale} onChange={event => change({ textScale: event.target.value })} />
      <output>{Math.round(preferences.textScale * 100)} %</output>
    </label>
    <label className="game-range-setting"><span>{fr ? 'Taille du HUD' : 'HUD size'}</span>
      <input type="range" min="0.9" max="1.4" step="0.05" value={preferences.hudScale} onChange={event => change({ hudScale: event.target.value })} />
      <output>{Math.round(preferences.hudScale * 100)} %</output>
    </label>
    <label className="game-range-setting"><span>{fr ? 'Marge du HUD' : 'HUD margin'}</span>
      <input type="range" min="0" max="32" step="2" value={preferences.safeArea} onChange={event => change({ safeArea: event.target.value })} />
      <output>{preferences.safeArea} px</output>
    </label>
    <label className="game-toggle-setting"><input type="checkbox" checked={preferences.contrast === 'high'} onChange={event => change({ contrast: event.target.checked ? 'high' : 'standard' })} />
      <span>{fr ? 'Contraste renforcé des interfaces' : 'High contrast interface'}</span>
    </label>
    <label className="game-toggle-setting"><input type="checkbox" checked={preferences.motion === 'reduced'} onChange={event => change({ motion: event.target.checked ? 'reduced' : 'system' })} />
      <span>{fr ? 'Réduire les animations d’interface' : 'Reduce interface motion'}</span>
    </label>
    <p className="game-setting-note">{fr ? 'Les préférences du système pour les animations réduites restent respectées. Ces réglages ne modifient pas la progression.' : 'System reduced-motion preferences remain respected. These settings do not change progression.'}</p>
    <button type="button" className="btn-retro" onClick={() => change(DEFAULT_DISPLAY_PREFERENCES)}>{fr ? 'Réglages d’affichage par défaut' : 'Default display settings'}</button>
    <p className="game-setting-notice" role="status">{notice}</p>
  </section>;
}
