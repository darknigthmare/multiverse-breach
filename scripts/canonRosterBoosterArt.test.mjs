import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import test from 'node:test';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, '..');
const builderPath = path.join(repositoryRoot, 'scripts', 'buildCanonRosterBoosterArt.mjs');

test('the canon-roster builder cannot recreate derived sprite-composite placeholders', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [
      builderPath,
      '--force',
      "--universe=Avatar (Na'vi)"
    ], {
      cwd: repositoryRoot,
      maxBuffer: 1024 * 1024
    }),
    (error) => {
      const output = `${error.stderr || ''}\n${error.stdout || ''}`;
      assert.match(output, /Derived sprite-composite boosters are disabled/);
      assert.match(output, /independently generated and visually reviewed OpenAI foil-pack asset/);
      return true;
    }
  );
});
