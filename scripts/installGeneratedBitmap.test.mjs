import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const cli = fileURLToPath(new URL('./installGeneratedBitmap.mjs', import.meta.url));
const output = '/sprites/generated/items/halo/fixture.png';

for (const withDlc of [false, true]) {
  test(`bitmap CLI writes the ${withDlc ? 'canonical DLC' : 'legacy public'} source and keeps ledger URLs and overwrite checks`, async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'generated-bitmap-source-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    const write = async (relative, contents) => {
      const file = path.join(root, relative);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, contents);
    };
    await write('public/sprites/generated/openai-sprite-prompts.jsonl', `${JSON.stringify({
      kind: 'item', id: 'fixture', universe: 'Halo', name: 'Synthetic test item', output, prompt: 'Synthetic test fixture only.'
    })}\n`);
    if (withDlc) {
      await write('DLC/Halo/manifest.json', JSON.stringify({ schemaVersion: 1, id: 'halo', universe: 'Halo', directory: 'DLC/Halo', assetManifest: 'assets.json' }));
      await write('DLC/Halo/assets.json', JSON.stringify({ schemaVersion: 1, universe: 'Halo', assets: [] }));
    }
    const source = await sharp({ create: { width: 64, height: 64, channels: 4, background: '#214b8fff' } }).png().toBuffer();
    await write('private/source.png', source);
    const args = [cli, '--source', path.join(root, 'private/source.png'), '--kind', 'item', '--id', 'fixture', '--generation-id', 'synthetic-test-generation'];
    const record = JSON.parse(execFileSync(process.execPath, args, { cwd: root, encoding: 'utf8' }));
    const destination = path.join(root, withDlc ? `DLC/Halo/assets${output}` : `public${output}`);
    const bytes = await fs.readFile(destination);
    assert.equal(record.output, output);
    assert.equal(record.image.sha256, hash(bytes));
    const ledger = JSON.parse((await fs.readFile(path.join(root, 'public/sprites/generated/openai-asset-ledger.jsonl'), 'utf8')).trim());
    assert.equal(ledger.output, output);
    assert.equal(ledger.image.sha256, hash(bytes));
    if (withDlc) await assert.rejects(fs.access(path.join(root, `public${output}`)), { code: 'ENOENT' });
    const repeat = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
    assert.equal(repeat.status, 1);
    assert.match(repeat.stderr, /Destination already exists/);
    assert.equal(hash(await fs.readFile(destination)), hash(bytes));
  });
}
