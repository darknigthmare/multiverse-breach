import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// The optional API policy stays in the current GameCanvas reader/helper, not
// in a copied test implementation. Missing source boundaries fail the build.
export default function createGamedevGamepadFixturePlugin(root, {
  gameCanvasPath = resolve(root, 'src/components/GameCanvas.jsx')
} = {}) {
  const virtualId = 'virtual:gamedev-gamepad-reader';
  return {
    name: 'gamedev-gamepad-reader-fixture',
    resolveId(id) { if (id === virtualId) return '\0' + virtualId; },
    async load(id) {
      if (id !== '\0' + virtualId) return;
      const source = await readFile(gameCanvasPath, 'utf8');
      const section = (start, end) => {
        const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
        if (first < 0 || last <= first) throw new Error(`Missing GameCanvas gamepad fixture boundary: ${start}`);
        return source.slice(first, last);
      };
      return `
        import { createSceneInputs } from '/src/game/sceneInputs.js';
        import { readBrowserGamepads } from '/src/game/browserGamepads.js';
        import {
          MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS, createDefaultMeleeInputMaps,
          readGamepadMeleeInput, readKeyboardMeleeInput, mergeMeleeInputSnapshots
        } from '/src/game/melee/meleeInputMap.js';
        ${section('const getTouchMeleeSnapshot = ', 'const getStableNumericSeed = ')}
        export function createGamepadFixture() {
          const meleeInputMapsRef = { current: createDefaultMeleeInputMaps() };
          const meleePressedCodesRef = { current: new Set() };
          const meleeTouchHeldRef = { current: Object.fromEntries(['player', 'cpu'].map(side =>
            [side, createSceneInputs(MELEE_REMAPPABLE_SLOTS.map(slot => slot.id))])) };
          ${section('    const readMeleeInput = ', '    const dispatchMeleeInputEdges = ')}
          return {
            read: () => ({ player: readMeleeInput('player'), cpu: readMeleeInput('cpu') }),
            key(code, down) { if (down) meleePressedCodesRef.current.add(code); else meleePressedCodesRef.current.delete(code); },
            touch(side, action, down) {
              const input = meleeTouchHeldRef.current[side];
              if (down) input.hold('fixture-touch', action); else input.release('fixture-touch');
            }
          };
        }
      `;
    }
  };
}
