import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const lint = fileURLToPath(new URL('../node_modules/oxlint/bin/oxlint', import.meta.url));
function check(source) {
  const dir = mkdtempSync(join(tmpdir(), 'multiverse-undefined-'));
  try {
    const config = join(dir, 'oxlint.json');
    writeFileSync(config, JSON.stringify({ env: { browser: true, builtin: true }, globals: { __MULTIVERSE_BUILD__: 'readonly' }, rules: { 'no-undef': 'error' } }));
    const path = source === null ? 'src' : join(dir, 'regression.js');
    if (source !== null) writeFileSync(path, source);
    return spawnSync(process.execPath, [lint, '--config', config, '--deny', 'no-undef', '--no-ignore', '--format', 'json', path],
      { cwd: root, encoding: 'utf8', timeout: 30000 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test('browser runtime sources have no unresolved identifiers with browser globals enabled', () => {
  const result = check(null);
  assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
});
test('undefined-identifier gate rejects the caught matchInputLocked regression', () => {
  const result = check('export function renderPickups() { return !matchInputLocked; }');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /matchInputLocked/);
  assert.match(result.stdout, /no-undef/);
});
