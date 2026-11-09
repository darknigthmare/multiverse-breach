import React from 'react';
import './ExtinctionAimReadout.css';

/** Keep the command usable during a miss: feedback never gates an attack. */
export default function ExtinctionPrimaryAction({ readout, paused = false, onFire, lang = 'fr' }) {
  const command = readout?.command || 'ACTION';
  const detail = paused ? (lang === 'fr' ? 'Action suspendue.' : 'Action paused.') : readout?.detail || '';
  return <button type="button" className="btn-retro extinction-primary-action extinction-aim-action" data-primary-action
    data-fps-aim-kind={readout?.kind} data-fps-aim-source={readout?.source}
    data-fps-aim-state={paused ? 'paused' : readout?.condition}
    data-fps-aim-target={readout?.targetId ?? undefined} onClick={onFire}
    aria-label={`${command} · ${readout?.name || ''}. ${detail}`}
    title={`${readout?.name || ''}. ${detail}`}>
    <span>{command}</span>
    <small data-fps-aim-hint aria-live="off">{paused ? (lang === 'fr' ? 'PAUSE' : 'PAUSED') : readout?.label}</small>
  </button>;
}
