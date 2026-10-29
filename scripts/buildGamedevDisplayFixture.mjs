import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = resolve(root, '.tmp/gamedev-display');

// Compile the real GameCanvas touch mapping and callbacks without importing
// its renderer or asset library. Missing markers fail the fixture build.
const touchModule = 'virtual:gamedev-melee-touch';
const touchModuleId = `\0${touchModule}`;
const touchFixture = {
  name: 'gamedev-melee-touch-fixture',
  resolveId(id) { if (id === touchModule) return touchModuleId; },
  async load(id) {
    if (id !== touchModuleId) return null;
    const source = await readFile(resolve(root, 'src/components/GameCanvas.jsx'), 'utf8');
    const section = (start, end) => {
      const first = source.indexOf(start);
      const last = source.indexOf(end, first + start.length);
      if (first < 0 || last < 0) throw new Error(`Missing GameCanvas fixture boundary: ${start}`);
      return source.slice(first, last);
    };
    return `
      import { useRef } from 'react';
      import { createSceneInputs } from '/src/game/sceneInputs.js';
      import { MELEE_ACTIONS, MELEE_REMAPPABLE_SLOTS } from '/src/game/melee/meleeInputMap.js';
      ${section('const MELEE_TOUCH_SLOTS = ', 'const getStableNumericSeed = ')}
      export function useMeleeTouchFixture() {
        ${section('  const meleeTouchHeldRef = useRef(', '  const meleeNeutralGateRef = ')}
        ${section('  const handleMeleeTouchAction = ', '  const clearMeleeControls = ')}
        return {
          onInput: handleMeleeTouchAction,
          snapshot: () => getTouchMeleeSnapshot(new Set(Object.keys(meleeTouchHeldRef.current.player.snapshot()))),
          clear: () => { meleeTouchHeldRef.current.player.clear(); meleeTouchHeldRef.current.cpu.clear(); }
        };
      }
    `;
  }
};

// Compile only the real preference/input controls and their fixtures. The public
// asset library and the application's production prebuild are separate checks.
await build({
  root,
  configFile: false,
  plugins: [touchFixture, react()],
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: { input: ['gamedev-display', 'gamedev-storage', 'gamedev-inputs'].map(name => resolve(root, `scripts/fixtures/${name}.html`)) }
  }
});
