// Reconstruct W11 runtime records from its immutable committed catalog and
// byte-pinned historical registries, never from the already-expanded W12 map.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('../../../',import.meta.url),prefix='docs/combat-fidelity-wave12-2026-10-23/';
const read=p=>fs.readFile(new URL(p,root)),json=async p=>JSON.parse(await read(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const before=await json(prefix+'historical-assets-before.json');
for(const record of before.registries)assert.equal(sha(await read(record.path)),record.sha256,record.path+': historical registry changed');
for(const record of before.png)assert.equal(sha(await read('public'+record.sheet)),record.sha256,record.sheet+': historical PNG changed');
const commit='bb0301258f88839f9a7a24b1e610d175ab2acf7f';
const catalogPath='src/game/combat/characterAnimationCatalog.js';
const source=execFileSync('git',['show',commit+':'+catalogPath],{cwd:fileURLToPath(root),maxBuffer:1024*1024}).toString();
const relocated=source.replace(/from '(\.\/[^']+)'/g,(_match,spec)=>'from '+JSON.stringify(new URL(spec,new URL('src/game/combat/',root)).href));
const historical=await import('data:text/javascript;base64,'+Buffer.from(relocated).toString('base64'));
const characterAssets=JSON.parse(JSON.stringify(historical.getCharacterAnimationAssets()));
assert.equal(characterAssets.length,194);
const characterRegistryFiles=before.registries.filter(r=>/src\/game\/combat\/characterAnimations(?:Wave(?:[2-9]|10|11)(?:Part[A-D])?)?\.generated\.json$/.test(r.path));
const baseRegistryFiles=before.registries.filter(r=>/src\/game\/combat\/characterSpriteCorrections(?:Wave(?:[2-9]|10|11)(?:Part[A-D])?)?\.generated\.json$/.test(r.path));
const baseAssets=(await Promise.all(baseRegistryFiles.map(async r=>(await json(r.path)).entries))).flat();
assert.equal(baseAssets.length,140);assert.equal(new Set(baseAssets.map(a=>a.heroId)).size,140);
const result={schemaVersion:1,date:'2026-10-23',wave:12,basis:'W11 committed catalog + unchanged historical registry bytes',historicalFromCommit:commit,catalogSource:{path:catalogPath,sha256:sha(Buffer.from(source))},characterAssets,baseAssets,characterRegistryFiles,baseRegistryFiles,historicalPngFiles:before.png,historicalRegistryFiles:before.registries,source1to1Verified:false};
await fs.writeFile(new URL(prefix+'runtime-baseline.json',root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({historicalCharacters:194,historicalBases:140,characterRegistryFiles:characterRegistryFiles.length,baseRegistryFiles:baseRegistryFiles.length,historicalPngs:before.png.length,historicalRegistries:before.registries.length}));
