import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Input ownership stays in the current GameCanvas reader/dispatcher and the
// engine's charge/shield methods, not a copied test policy. The fixture supplies
// two actors and React-shaped refs; it does not mount the full combat engine.
export default function createGamedevGamepadFixturePlugin(root, {
  gameCanvasPath = resolve(root, 'src/components/GameCanvas.jsx'),
  enginePath = resolve(root, 'src/game/engineSmash.js')
} = {}) {
  const virtualId = 'virtual:gamedev-gamepad-reader';
  return {
    name: 'gamedev-gamepad-reader-fixture',
    resolveId(id) { if (id === virtualId) return '\0' + virtualId; },
    async load(id) {
      if (id !== '\0' + virtualId) return;
      const source = await readFile(gameCanvasPath, 'utf8');
      const engineSource = await readFile(enginePath, 'utf8');
      const section = (start, end, text = source) => {
        const first = text.indexOf(start), last = text.indexOf(end, first + start.length);
        if (first < 0 || last <= first) throw new Error(`Missing GameCanvas gamepad fixture boundary: ${start}`);
        return text.slice(first, last);
      };
      // The older comparison source predates this listener. The browser's
      // disconnect-event regression still fails if a current source omits it.
      const disconnectListener = source.includes('    const handleGamepadDisconnected = ')
        ? section('    const handleGamepadDisconnected = ', "    window.addEventListener('keydown'")
          + "window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);"
        : '';
      return `
        import { createSceneInputs } from '/src/game/sceneInputs.js';
        import { readBrowserGamepads } from '/src/game/browserGamepads.js';
        import { createMeleeGamepadInput } from '/src/game/melee/meleeGamepadInput.js';
        import {
          MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS, createDefaultMeleeInputMaps,
          diffMeleeActionEdges, readGamepadMeleeInput, readKeyboardMeleeInput, mergeMeleeInputSnapshots
        } from '/src/game/melee/meleeInputMap.js';
        import {
          initializeMeleeActorRuntime, beginMeleeCharge, releaseMeleeCharge,
          cancelMeleeCharge, beginMeleeShield, releaseMeleeShield, cancelMeleeHeldInputs,
          tickMeleeCombatActor
        } from '/src/game/melee/meleeCombatRuntime.js';
        ${section('const MELEE_TOUCH_SLOTS = ', 'const getStableNumericSeed = ')}
        export function createGamepadFixture() {
          const useRef = current => ({ current });
          const keysPressed = { current: {} };
          const meleeInputMapsRef = { current: createDefaultMeleeInputMaps() };
          ${section('  const meleePressedCodesRef = ', '  const tacticsCameraPointerRef = ')}
          const actors = Object.fromEntries(['player', 'cpu'].map(side => [side,
            initializeMeleeActorRuntime({ id: 'player_anchor', currentHp: 100, state: 'idle' })]));
          const hits = { player: 0, cpu: 0 };
          class FixtureEngine {
            getMeleeActor(side) { return actors[side]; }
            isMatchInputLocked() { return false; }
            ${section('  beginChargedMeleeAttack(', '  resolveMeleeActionHit(', engineSource)}
          }
          const engine = new FixtureEngine();
          const engineRef = { current: engine };
          ${section('  const handleMeleeTouchAction = ', '  const clearMeleeControls = ')}
          ${section('  const clearMeleeControls = ', '  // Une pause pilotee')}
          ${disconnectListener}
          ${section('    const readMeleeInput = ', '    let animTime = ')}
          const sample = () => {
            const inputs = { player: readMeleeInput('player'), cpu: readMeleeInput('cpu') };
            for (const side of ['player', 'cpu']) dispatchMeleeInputEdges(engine, side, inputs[side]);
            return {
              inputs,
              actors: Object.fromEntries(['player', 'cpu'].map(side => [side, {
                charging: actors[side].charging, chargeHoldSeconds: actors[side].chargeHoldSeconds,
                guarding: actors[side].guarding, state: actors[side].state,
                action: actors[side].action?.id || null, hits: hits[side]
              }]))
            };
          };
          return {
            sample,
            touchEvent: handleMeleeTouchAction,
            clear: clearMeleeControls,
            advance(frames) {
              for (let frame = 0; frame < frames; frame++) {
                sample();
                for (const side of ['player', 'cpu']) tickMeleeCombatActor(actors[side], 1 / 60, {
                  resolveActionHit() { hits[side]++; return 1; }
                });
              }
              return sample();
            },
            key(code, down) { if (down) meleePressedCodesRef.current.add(code); else meleePressedCodesRef.current.delete(code); },
            touch(side, action, down) {
              const input = meleeTouchHeldRef.current[side];
              if (down) input.hold('fixture-touch:' + action, action); else input.release('fixture-touch:' + action);
            }
          };
        }
      `;
    }
  };
}
