import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const lobby = resolve(root, 'src/components/CustomBattleMode.jsx');
const stubs = {
  './GameCanvas': '\0custom-lobby-game', './FighterMode': '\0custom-lobby-fighter', '../game/renderer': '\0custom-lobby-sprite'
};
const resolvedStubs = new Set();
await build({ root, configFile: false, publicDir: false, base: './', plugins: [{
  name: 'custom-lobby-contract-fixture',
  // Intercept these three imports before Vite's filesystem resolver. A normal
  // plugin runs too late and silently builds the real combat children instead.
  enforce: 'pre',
  resolveId(id, importer) {
    if (importer !== lobby || !stubs[id]) return null;
    resolvedStubs.add(id);
    return stubs[id];
  },
  load(id) {
    if (id === stubs['../game/renderer']) return `export function drawPixelSprite(ctx, x, y, hero) { ctx.fillStyle = hero.primaryColor; ctx.fillRect(x - 8, y - 32, 16, 40); }`;
    if (id !== stubs['./GameCanvas'] && id !== stubs['./FighterMode']) return null;
    const fighter = id === stubs['./FighterMode'];
    return `import React, { useEffect } from 'react';
      export default function BattleHandoff(props) {
        useEffect(() => { window.__customLobbyQA.handoff = ${fighter ? '{ mode: "Fighter", config: props.customConfig }' : '{ mode: props.stage.mode, stage: props.stage, team: props.activeTeam, custom: props.customBattle }'}; }, [props]);
        return React.createElement('section', {className: 'custom-lobby-battle-fixture', 'data-testid': 'battle-handoff'},
          React.createElement('h2', {}, 'Battle handoff fixture'),
          React.createElement('button', {type: 'button', onClick: () => ${fighter ? 'props.onExit()' : "props.onBattleEnd('quit')"}}, 'Return to preparation'));
      }`;
  },
  generateBundle(_options, bundle) {
    for (const id of Object.keys(stubs)) {
      if (!resolvedStubs.has(id)) this.error(`Custom lobby fixture did not substitute ${id}`);
    }
    const source = Object.values(bundle).filter(file => file.type === 'chunk').map(file => file.code).join('\n');
    if (!source.includes('Battle handoff fixture') || !source.includes('Return to preparation')) {
      this.error('Custom lobby fixture is missing its battle handoff controls');
    }
  }
}, react()], build: { outDir: resolve(root, '.tmp/custom-battle-lobby'), emptyOutDir: true,
  rollupOptions: { input: resolve(root, 'scripts/fixtures/custom-battle-lobby.html') }
} });
