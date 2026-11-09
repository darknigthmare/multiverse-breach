import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { register } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { createDlcSourceReader } from './dlcAuditSources.mjs';
import { LORE_ACCURATE_HERO_OVERRIDES } from '../src/game/loreAccuratePacks.js';

test('source audits follow declared adapter modules without borrowing unrelated definitions', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'dlc-audit-sources-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [file, source] of Object.entries({
    'src/game/heroes.js': 'shared hero builder',
    'src/game/enemies.js': 'shared enemy builder',
    'src/game/base.js': 'base content',
    'DLC/Example/data/heroes.js': 'relocated hero definition',
    'DLC/Example/data/enemies.js': 'unrelated enemy definition'
  })) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), source);
  }
  writeFileSync(path.join(root, 'DLC/Example/manifest.json'), JSON.stringify({
    schemaVersion: 1, id: 'example', universe: 'Example', directory: 'DLC/Example',
    registration: 'runtime', catalogOrder: 0, assetManifest: 'assets.json',
    modules: [
      { path: 'data/heroes.js', runtimeAdapter: 'src/game/heroes.js' },
      { path: 'data/enemies.js', runtimeAdapter: 'src/game/enemies.js' }
    ]
  }));
  const readSource = createDlcSourceReader({ root });
  assert.equal(readSource('src/game/heroes.js'), 'shared hero builder\nrelocated hero definition');
  assert.equal(readSource('src/game/enemies.js'), 'shared enemy builder\nunrelated enemy definition');
  assert.equal(readSource('src/game/base.js'), 'base content');
  assert.throws(() => readSource('src/game/missing.js'), { code: 'ENOENT' });
});

test('source audits recover the current Chucky definitions through package manifests', () => {
  const readSource = createDlcSourceReader();
  assert.match(readSource('src/game/loreAccuratePacks.js'), /hero\('jiji_dandadan', 'Jiji'/);
  assert.match(readSource('src/game/renderer.js'), /chucky-play-pals-breach-openai-v2\.png/);
  assert.match(readSource('src/game/cloudMeadowCharacters.js'), /CLOUD_MEADOW_CHARACTERS/);
});

test('renderer and signature loadout assertions inspect the assembled runtime values', async () => {
  register('./sourceSceneTestLoader.mjs', import.meta.url);
  const { OPENAI_BACKDROPS } = await import('../src/game/renderer.js');
  assert.equal(OPENAI_BACKDROPS.Smash.Chucky, '/backgrounds/chucky-play-pals-breach-openai-v2.png');
  for (const id of ['momo_ayase', 'oken_dandadan', 'aira_dandadan', 'inconnus_trio', 'pierre_rrr', 'odile_deray']) {
    const loadout = LORE_ACCURATE_HERO_OVERRIDES[id];
    assert.ok(loadout?.weaponType, `${id}: weapon type`);
    for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      assert.equal(typeof loadout[slot]?.name, 'string', `${id}: ${slot} name`);
      assert.ok(loadout[slot].name.trim(), `${id}: ${slot} must not be blank`);
    }
  }
});
