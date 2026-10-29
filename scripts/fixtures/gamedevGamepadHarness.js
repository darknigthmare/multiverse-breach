import { createGamepadFixture } from 'virtual:gamedev-gamepad-reader';
import React from 'react';
import { createRoot } from 'react-dom/client';
import HeldControlButton from '../../src/components/HeldControlButton.jsx';

const input = createGamepadFixture();
const held = { player: false, cpu: false };
const nativeProbe = () => {
  try {
    if (typeof navigator.getGamepads !== 'function') return { available: false };
    return { available: true, ok: true, slots: navigator.getGamepads().length };
  } catch (error) {
    return { available: true, ok: false, error: error.name };
  }
};
const sample = (frames = 0) => {
  let inputs = null, actors = null, readError = null;
  try { ({ inputs, actors } = frames ? input.advance(frames) : input.sample()); }
  catch (error) { readError = { name: error.name, message: error.message }; }
  const state = { native: nativeProbe(), inputs, actors, readError };
  document.getElementById('state').textContent = JSON.stringify(state, null, 2);
  return state;
};

for (const [eventName, down] of [['keydown', true], ['keyup', false]]) {
  window.addEventListener(eventName, event => {
    if (['KeyQ', 'ArrowRight'].includes(event.code)) event.preventDefault();
    input.key(event.code, down);
    sample();
  });
}
for (const [side, action] of [['player', 'shield'], ['cpu', 'chargedAttack']]) {
  document.getElementById(`touch-${side}`).addEventListener('click', () => {
    held[side] = !held[side];
    input.touch(side, action, held[side]);
    sample();
  });
}
createRoot(document.getElementById('actual-controls')).render(
  React.createElement(HeldControlButton, {
    id: 'actual-touch-charge',
    onInput(source, phase) { input.touchEvent('chargedAttack', phase, source); sample(); },
    style: { minWidth: 220, minHeight: 70, margin: 16 }
  }, 'Hold actual charge control')
);
window.__gamedevGamepads = {
  sample, nativeProbe,
  clear: () => input.clear(),
  advance: frames => sample(frames),
  touch(side, action, down) { input.touch(side, action, down); return sample(); }
};
sample();
