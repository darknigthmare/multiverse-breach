# Reproduire le miroir QA ponctuel du Rex

Le test historique lit encore un vrai fichier sous `public/`. Sa source existe
dans Git sous `DLC/GodzillaTheAnimatedSeries/assets/`, sans être matérialisée
dans ce checkout sparse. Le miroir temporaire a permis **5/5 tests ciblés**, puis
**96/96 dans la suite complète**. Il a ensuite été supprimé avec contrôle de
son inode et de son SHA : [création](crustaceous-rex-local-mirror.json),
[test ciblé](crustaceous-rex-local-test.json),
[nettoyage](crustaceous-rex-local-mirror-cleanup.json).
Il ne s’agit ni d’une nouvelle livraison artistique ni d’une animation.

Depuis la racine du dépôt, avec Node 22 et les dépendances déjà installées,
cette commande reproduit uniquement les mêmes octets locaux, avec un budget
temporaire de 8 MiB et sans autoriser de fetch LFS :

```sh
taskset --cpu-list 0,1 node --max-old-space-size=2048 --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { copyFile, lstat, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createDlcBatchAssetSource } from './scripts/dlcBatchAssetSource.mjs';
const previous = JSON.parse(await readFile('docs/assets/p0-p1-p2-continuation-02-2026-11-13/validation/crustaceous-rex-local-mirror.json'));
const target = previous.publicMirror;
try { await lstat(target); throw new Error('Existing mirror: do not overwrite'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const provider = await createDlcBatchAssetSource({ repoRoot: process.cwd(),
  revision: previous.sourceRevision, parentTmpDir: '/tmp',
  maxBytes: 8 * 1024 * 1024, maxAssetBytes: 8 * 1024 * 1024, allowLfsFetch: false });
try {
  const receipt = await provider.materialize(previous.sourcePath, {
    expectedSha256: previous.after.sha256, expectedBytes: previous.after.bytes });
  assert.equal(receipt.sourceKind, 'git-blob');
  assert.equal(receipt.gitBlobOid, previous.source.gitBlobOid);
  await provider.verify(receipt);
  const bytes = await readFile(receipt.path);
  const image = sharp(bytes, { failOn: 'error', limitInputPixels: 33_554_432 });
  const metadata = await image.metadata(); await image.stats();
  assert.deepEqual([metadata.format, metadata.width, metadata.height, metadata.channels], ['png', 1254, 1254, 4]);
  let parent = process.cwd();
  for (const component of target.split('/').slice(0, -1)) {
    parent = path.join(parent, component);
    try { await mkdir(parent); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    const stat = await lstat(parent);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
  }
  await copyFile(receipt.path, target, constants.COPYFILE_EXCL);
  const stat = await lstat(target), copied = await readFile(target);
  const sha256 = createHash('sha256').update(copied).digest('hex');
  assert.ok(stat.isFile() && !stat.isSymbolicLink());
  assert.equal(sha256, previous.after.sha256);
  assert.equal(copied.length, previous.after.bytes);
  console.log({ target, sha256, bytes: stat.size, dev: String(stat.dev), ino: String(stat.ino) });
  await provider.cleanup([receipt]);
} finally { await provider.close(); }
JS

node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 scripts/crustaceousRexSprite.test.mjs
```

Conserver les nouvelles valeurs `dev/ino/SHA` affichées pour cette reproduction.
Après les tests, retirer seulement cette copie si son identité et ses octets
correspondent toujours ; le reçu du premier passage décrit un inode désormais
supprimé. Aucun `assets:prepare` global ni média canonique/private n’est
nécessairement matérialisé par cette commande ciblée.
