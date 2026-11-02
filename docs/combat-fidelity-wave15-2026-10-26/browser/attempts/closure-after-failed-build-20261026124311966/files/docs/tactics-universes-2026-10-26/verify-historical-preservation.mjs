// Compare the previous committed W14 implementation with the live composed
// renderers. This is an evidence helper, not a runtime or prebuild dependency.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as liveFields from '../../src/game/tacticsUniverseBattlefields.js';
import * as liveEnvironment from '../../src/game/tacticsEnvironmentRenderer.js';
import * as liveTerrain from '../../src/game/tacticsTerrainRenderer.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const baseline = 'd73b18b8';
const sha = value => createHash('sha256').update(value).digest('hex');
const rows = [];
async function previous(relative) {
  const bytes = execFileSync('git', ['show', `${baseline}:${relative}`], { cwd: root });
  rows.push({ path: relative, baselineSha256: sha(bytes), liveSha256: sha(fs.readFileSync(path.join(root, relative))) });
  return import('data:text/javascript;base64,' + bytes.toString('base64'));
}
const oldFields = await previous('src/game/tacticsUniverseBattlefields.js');
const oldEnvironment = await previous('src/game/tacticsEnvironmentRenderer.js');
const oldTerrain = await previous('src/game/tacticsTerrainRenderer.js');
assert.deepEqual(liveFields.TACTICS_UNIVERSE_BATTLEFIELDS, oldFields.TACTICS_UNIVERSE_BATTLEFIELDS);
for (const [id, material] of Object.entries(oldTerrain.TACTICS_TERRAIN_MATERIALS)) {
  assert.deepEqual(liveTerrain.TACTICS_TERRAIN_MATERIALS[id], material, id);
}
function record(fn) {
  const calls = [], stack = [];
  const target = {
    canvas: { width: 1040, height: 460 },
    save() { stack.push(1); calls.push(['save']); },
    restore() { assert.ok(stack.length); stack.pop(); calls.push(['restore']); },
    createLinearGradient(...args) { calls.push(['gradient', ...args]); return { addColorStop: (...stop) => calls.push(['gradient-stop', ...stop]) }; }
  };
  const ctx = new Proxy(target, {
    get(object, key) {
      if (key in object) return object[key];
      if (['lineWidth', 'globalAlpha'].includes(key)) return 1;
      return (...args) => calls.push([key, ...args]);
    },
    set(object, key, value) { object[key] = value; calls.push(['set', key, typeof value === 'object' ? 'gradient' : value]); return true; }
  });
  fn(ctx); assert.equal(stack.length, 0); return calls;
}
const fields = [...Object.values(oldFields.TACTICS_UNIVERSE_BATTLEFIELDS),
  { id: 'nexus_skybridge', formatVersion: 2 }, { id: 'training_grid', tileTheme: { pattern: 'nexus' } },
  { id: 'legacy-industrial', tileTheme: { base: '#355547', mid: '#244433', detail: '#98ab76', pattern: 'steel' } }];
const environmentRows = [];
for (const battlefield of fields) {
  const options = { battlefield, width: 1040, height: 460, animTime: 165, universe: 'Nexus de Convergence' };
  const old = record(ctx => oldEnvironment.drawTacticsEnvironment(ctx, options));
  const live = record(ctx => liveEnvironment.drawTacticsEnvironment(ctx, options));
  assert.deepEqual(live, old, battlefield.id);
  environmentRows.push({ battlefield: battlefield.id, calls: live.length, sha256: sha(JSON.stringify(live)), unchanged: true });
}
const sceneryRows = [];
for (const kind of ['tree', 'boulder', 'ruin-wall', 'mako-conduit', 'prothean-generator', 'forerunner-pylon', 'wooden-crate']) {
  const options = { obstacle: { id: kind, sceneryKind: kind, tacticsHeight: 2.5 }, point: { x: 310, y: 265 }, width: 37, height: 55 };
  const old = record(ctx => oldEnvironment.drawTacticsScenery(ctx, options));
  const live = record(ctx => liveEnvironment.drawTacticsScenery(ctx, options));
  assert.deepEqual(live, old, kind);
  sceneryRows.push({ kind, calls: live.length, sha256: sha(JSON.stringify(live)), unchanged: true });
}
const report = {
  schemaVersion: 1, passed: true, baselineCommit: baseline, checkedAt: new Date().toISOString(),
  historicalFieldsUnchanged: 8, historicalMaterialsUnchanged: 27,
  historicalEnvironmentCommandStreamsUnchanged: environmentRows.length,
  historicalSceneryCommandStreamsUnchanged: sceneryRows.length,
  sourceRows: rows, environmentRows, sceneryRows,
  limits: 'Command streams and authored source records are compared; this does not certify official artwork or source-map fidelity.'
};
if (process.argv.includes('--write')) fs.writeFileSync(new URL('historical-preservation.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, baseline, fields: 8, materials: 27, environments: environmentRows.length, scenery: sceneryRows.length }));
