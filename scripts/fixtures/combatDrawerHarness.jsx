// Isolated native-dialog regression fixture. No account, progression or game state.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CombatDrawer from '../../src/components/CombatDrawer.jsx';
import '../../src/components/combat-immersion.css';
const audit = { closes: 0, escapedToParent: 0 };
window.__drawerTransitions = audit;
export default function Harness() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [mounted, setMounted] = useState(true);
  return <main onKeyDown={event => { if (event.key === 'Escape') audit.escapedToParent += 1; }}>
    <button id="drawer-launcher" onClick={() => { setMounted(true); setOpen(true); setModal(false); }}>Open live commands</button>
    {mounted && <CombatDrawer open={open} modal={modal} title={modal ? 'Settings' : 'Live commands'} lang="en"
      onClose={() => { audit.closes += 1; setOpen(false); }}>
      <p>Live commands stay non-modal; settings pause and isolate the scene.</p>
      <button id="switch-mode" onClick={() => setModal(value => !value)}>{modal ? 'Back to commands' : 'Open settings'}</button>
      <label>Sample input <input id="drawer-input" /></label>
      <button id="drawer-unmount" onClick={() => setMounted(false)}>Unmount panel</button>
    </CombatDrawer>}
  </main>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
