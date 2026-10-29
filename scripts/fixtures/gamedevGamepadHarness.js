import { createGamepadFixture } from 'virtual:gamedev-gamepad-reader';

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
const sample = () => {
  let inputs = null, readError = null;
  try { inputs = input.read(); }
  catch (error) { readError = { name: error.name, message: error.message }; }
  const state = { native: nativeProbe(), inputs, readError };
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
window.__gamedevGamepads = { sample, nativeProbe };
sample();
