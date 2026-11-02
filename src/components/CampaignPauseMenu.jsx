import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AudioControl from './AudioControl.jsx';
import NetworkStatusBadge from './NetworkStatusBadge.jsx';
import GameDisplaySettings from './GameDisplaySettings.jsx';
import { activateModal } from './collection/modalIsolation.js';
import './game-system.css';

export default function CampaignPauseMenu({ lang = 'fr', stage, audioSettings, onChangeAudioSetting, onToggleMute, isOnline, onResume, onRetreat }) {
  const [tab, setTab] = useState('pause');
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const resumeRef = useRef(null);
  const callbackRef = useRef(onResume);
  callbackRef.current = onResume;
  const titleId = useId();
  const fr = lang === 'fr';
  useEffect(() => activateModal({
    overlay: overlayRef.current, dialog: dialogRef.current, initialFocus: resumeRef.current,
    onClose: () => callbackRef.current()
  }), []);

  return createPortal(<div className="campaign-pause-overlay" ref={overlayRef}>
    <section className="campaign-pause-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <div className="game-system-kicker">A.R.C.A. / {stage.mode}</div>
      <h2 id={titleId}>{fr ? 'MISSION EN PAUSE' : 'MISSION PAUSED'}</h2>
      <p>{stage.displayName?.[lang] || stage.name || stage.universe}</p>
      <nav className="campaign-pause-tabs" aria-label={fr ? 'Menu de pause' : 'Pause menu'}>
        {['pause', 'options', 'help'].map(id => <button type="button" key={id} className="btn-retro" aria-pressed={tab === id} onClick={() => setTab(id)}>
          {id === 'pause' ? (fr ? 'Mission' : 'Mission') : id === 'options' ? 'Options' : (fr ? 'Commandes' : 'Controls')}
        </button>)}
      </nav>
      {tab === 'pause' && <p className="campaign-help">{fr ? 'Le terrain, les adversaires et les chronomètres sont suspendus. Reprends la mission quand tu es prêt.' : 'The battlefield, opponents and timers are suspended. Resume when you are ready.'}</p>}
      {tab === 'options' && <>
        <div className="game-system-controls"><AudioControl lang={lang} muted={audioSettings.muted} onToggleMute={onToggleMute} /><NetworkStatusBadge lang={lang} isOnline={isOnline} /></div>
        <GameDisplaySettings lang={lang} />
        <fieldset className="game-display-settings"><legend>{fr ? 'Audio' : 'Audio'}</legend>
          {['musicVolume', 'sfxVolume'].map(key => <label className="game-range-setting" key={key}>
            <span>{key === 'musicVolume' ? (fr ? 'Musique' : 'Music') : (fr ? 'Effets' : 'Effects')}</span>
            <input type="range" min="0" max="1" step="0.05" value={audioSettings[key] ?? 0.7} onChange={event => onChangeAudioSetting(key, Number(event.target.value))} />
            <output>{Math.round((audioSettings[key] ?? 0.7) * 100)}%</output>
          </label>)}
        </fieldset>
      </>}
      {tab === 'help' && <div className="campaign-help">
        <p>{fr ? 'Échap : pause ou reprise. Les aides, le briefing et les commandes détaillées sont accessibles depuis le HUD du combat.' : 'Escape: pause or resume. Help, briefing and detailed controls are available from the battle HUD.'}</p>
        <p>{stage.mode === 'Tactics'
          ? (fr ? 'Sélectionne une unité, puis une case ou une cible. Les zones de portée, le zoom, le déplacement de caméra et les actions de mission restent disponibles dans le terrain et son panneau tactique.' : 'Select a unit, then a tile or target. Range indicators, zoom, camera movement and mission actions remain available on the battlefield and tactical panel.')
          : stage.mode === 'Smash'
            ? (fr ? 'Le menu Commandes du combat contient les mouvements, la manette, le remappage et les commandes tactiles. Le tiroir Arsenal conserve les capacités de chaque héros.' : 'The battle Controls menu contains moves, gamepad settings, remapping and touch controls. The Arsenal drawer retains each hero’s abilities.')
            : (fr ? 'Sélectionne un héros, une action et sa cible. L’attente de ciblage, les artefacts, le mode Auto et la vitesse restent accessibles dans le HUD.' : 'Select a hero, action and target. Targeting wait, artifacts, Auto mode and speed remain available in the HUD.')}</p>
      </div>}
      <div className="campaign-pause-actions">
        <button type="button" className="btn-retro game-dialog-primary" ref={resumeRef} onClick={onResume}>{fr ? 'REPRENDRE' : 'RESUME'}</button>
        <button type="button" className="btn-retro" onClick={onRetreat}>{fr ? 'REPLI VERS LE NEXUS' : 'RETREAT TO NEXUS'}</button>
      </div>
    </section>
  </div>, document.body);
}
