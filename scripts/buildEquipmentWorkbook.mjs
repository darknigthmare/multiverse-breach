/** Run the equipment workbook builder with the managed spreadsheet runtime.
 * The temporary module directory keeps artifact dependencies out of the game.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.length < 5 || args.length > 6) {
  throw new Error('Usage: node scripts/buildEquipmentWorkbook.mjs DATA.json CANON.json COMPARISON.json OUTPUT.xlsx PREVIEW_DIR [PREVIOUS.xlsx]');
}
const runtimeNode = process.env.CODEX_PRIMARY_RUNTIME_NODE;
const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
if (!runtimeNode || !runtimeModules) {
  throw new Error('CODEX_PRIMARY_RUNTIME_NODE and CODEX_PRIMARY_RUNTIME_NODE_MODULES are required for @oai/artifact-tool.');
}
await fs.access(runtimeNode);
await fs.access(path.join(runtimeModules, '@oai', 'artifact-tool'));
const toolDir = fileURLToPath(new URL('../docs/excel/tools/', import.meta.url));
const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'multiverse-equipment-builder-'));
try {
  await fs.symlink(runtimeModules, path.join(staging, 'node_modules'), 'dir');
  for (const name of ['build_equipment_workbook.mjs', 'read_equipment_progress.mjs', 'equipment_progress.mjs']) {
    await fs.copyFile(path.join(toolDir, name), path.join(staging, name));
  }
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(runtimeNode, ['--expose-gc', '--max-old-space-size=3072',
      path.join(staging, 'build_equipment_workbook.mjs'), ...args.map(arg => path.resolve(arg))],
    { cwd: staging, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => signal ? reject(new Error('Workbook builder stopped: ' + signal)) : resolve(code));
  });
  process.exitCode = exitCode;
} finally {
  await fs.rm(staging, { recursive: true, force: true });
}
