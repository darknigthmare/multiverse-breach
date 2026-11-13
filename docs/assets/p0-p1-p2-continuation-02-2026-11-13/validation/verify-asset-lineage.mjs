import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { listGitAssetSources } from '../../../../scripts/dlcAssetPaths.mjs';
const before = '98991b161d0116dd9fa8d52d42f2337a243f2091';
const after = '3b892a7ec9eb1dbebf24af040cd8283311178f85';
const tree = revision => new Map(execFileSync('git', ['ls-tree', '-r', '-z', revision], {
  encoding: 'utf8', maxBuffer: 32 * 1024 * 1024
}).split('\0').filter(Boolean).map(row => {
  const [header, file] = row.split('\t'); return [file, header.split(' ')[2]];
}));
const oldTree = tree(before), newTree = tree(after), sources = listGitAssetSources(process.cwd());
const retained = [], added = [];
for (const file of sources) {
  assert.ok(newTree.has(file), file);
  if (oldTree.has(file)) {
    assert.equal(newTree.get(file), oldTree.get(file), `Existing canonical media changed: ${file}`);
    retained.push([file, oldTree.get(file)]);
  } else added.push({ path: file, gitBlobOid: newTree.get(file) });
}
assert.equal(retained.length, 19583); assert.equal(added.length, 2);
assert.deepEqual(added.map(row => row.path).sort(), [
  'DLC/Doom/assets/sprites/generated/bosses/doom/imp-fireballer.png',
  'DLC/Doom/assets/sprites/generated/bosses/doom/mancubus-flame-tank.png'
]);
const result = { before, after, existingAssetBlobOidsUnchanged: retained.length, totalAssetSources: sources.length,
  retainedPathOidListSha256: createHash('sha256').update(JSON.stringify(retained)).digest('hex'),
  added, checksPassed: true,
  scope: 'Canonical Git object continuity only; no old payload reread, LFS hydration or repeat of the earlier 15GB media audit. New PNGs have separate decode/game-scale/signature receipts. The temporary C-Rex public mirror is not a new Git asset.' };
fs.writeFileSync(new URL('./asset-byte-lineage.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
