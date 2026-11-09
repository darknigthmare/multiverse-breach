import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import HeldControlButton from '../../src/components/HeldControlButton.jsx';
import SceneHoldButton from '../../src/components/SceneHoldButton.jsx';
import MeleeControlsPanel from '../../src/components/MeleeControlsPanel.jsx';
import CombatDrawer from '../../src/components/CombatDrawer.jsx';
import { createFighterHeldInputs } from '../../src/game/fighterControlOwnership.js';
import { createSceneInputs } from '../../src/game/sceneInputs.js';
import { createDefaultMeleeInputMaps, replaceMeleeBinding, toEngineHeldInput } from '../../src/game/melee/meleeInputMap.js';
import { useMeleeTouchFixture } from 'virtual:gamedev-melee-touch';

export default function InputHarness() {
  const [, refresh] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maps, setMaps] = useState(createDefaultMeleeInputMaps);
  const fighter = useRef(null);
  if (!fighter.current) fighter.current = createFighterHeldInputs();
  const scene = useRef(null);
  if (!scene.current) scene.current = createSceneInputs(['forward']);
  const melee = useMeleeTouchFixture();
  const update = () => refresh(value => value + 1);
  const snapshot = melee.snapshot();
  const held = toEngineHeldInput(snapshot);
  return <main style={{ padding: 16, maxWidth: 860, margin: 'auto', color: '#edf8ff', background: '#10151f', fontFamily: 'sans-serif' }}>
    <style>{`body { margin: 0; background: #10151f; } button, input { font: inherit; } .fixture-controls { display:flex; flex-wrap:wrap; gap:16px; margin-bottom:12px; } .fixture-controls button { min-height:36px; } dialog { max-width:720px; width:90vw; max-height:85vh; overflow:auto; background:#10151f; color:#edf8ff; } dialog::backdrop { background:#0009; }`}</style>
    <h1 style={{ fontSize: 20 }}>Held input fixture</h1>
    <p>Real controls and input callbacks; no simulation or renderer is mounted.</p>
    <div className="fixture-controls">
      <label><input data-testid="disable-controls" type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Disable controls</label>
      <label><input data-testid="mount-controls" type="checkbox" checked={mounted} onChange={event => setMounted(event.target.checked)} /> Mount controls</label>
      <button type="button" data-testid="reset-scene" onClick={() => { melee.clear(); fighter.current.clear(); scene.current.clear(); update(); }}>Reset scene registry</button>
      <button type="button" data-testid="focus-target">Focus target</button>
      <button type="button" data-testid="open-settings" onClick={() => setSettingsOpen(true)}>Open settings</button>
    </div>
    <output data-testid="input-state" data-guard={String(held.guard)} data-charge={String(snapshot.actions.ChargedAttack)}
      data-horizontal={snapshot.horizontal} data-fighter-left={String(Boolean(fighter.current.snapshot().player.left))}
      data-scene-forward={String(Boolean(scene.current.snapshot().forward))}
      data-disabled={String(disabled)} data-mounted={String(mounted)} data-settings-open={String(settingsOpen)}
      style={{ display: 'block', padding: 8, minHeight: 20 }}>{JSON.stringify({ ...held, charge: snapshot.actions.ChargedAttack })}</output>
    {mounted && <>
      <HeldControlButton data-testid="fighter-left" disabled={disabled}
        style={{ minHeight: 46, minWidth: 180, marginBlock: 10 }}
        onInput={(source, phase) => { fighter.current.setTouch('player', 'left', phase === 'down', source); update(); }}>
        Fighter left
      </HeldControlButton>
      <SceneHoldButton data-testid="scene-forward" action="forward" disabled={disabled}
        style={{ minHeight: 46, minWidth: 180, marginBlock: 10 }}
        onInput={(source, action, active) => {
          if (active) scene.current.hold(source, action);
          else scene.current.release(source);
          update();
        }}>
        Scene forward
      </SceneHoldButton>
      <MeleeControlsPanel presentation="touch" maps={maps} disabled={disabled}
        onTouchAction={(...args) => { melee.onInput(...args); update(); }} />
    </>}
    <CombatDrawer open={settingsOpen} modal title="Commandes" onClose={() => setSettingsOpen(false)}>
      <MeleeControlsPanel presentation="settings" maps={maps}
        onRemap={(side, slot, code) => setMaps(previous => replaceMeleeBinding(previous, side, slot, code))}
        onReset={() => setMaps(createDefaultMeleeInputMaps())} />
    </CombatDrawer>
  </main>;
}

createRoot(document.getElementById('root')).render(<InputHarness />);
