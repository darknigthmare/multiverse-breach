import React, { useState } from 'react';
import ArchiveDrawer from './collection/ArchiveDrawer.jsx';
import GameDisplaySettings from './GameDisplaySettings.jsx';
import './game-system.css';

export default function GameSystemMenu({ lang = 'fr', children }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className="game-system-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-label={lang === 'fr' ? 'Système : audio, affichage, compte et sauvegardes' : 'System: audio, display, account and saves'} title={lang === 'fr' ? 'Menu système' : 'System menu'}>
      <span aria-hidden="true">☰</span>
    </button>
    {open && <ArchiveDrawer title={lang === 'fr' ? 'SYSTÈME' : 'SYSTEM'} lang={lang} onClose={() => setOpen(false)} className="game-system-menu">
      <div className="game-system-controls">{children}</div>
      <GameDisplaySettings lang={lang} />
    </ArchiveDrawer>}
  </>;
}
