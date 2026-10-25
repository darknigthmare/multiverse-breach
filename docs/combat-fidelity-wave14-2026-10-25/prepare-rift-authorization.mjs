// Prepare only the reference phase after root confirms all40 bases and package.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../../src/game/spriteAssets.js';
import { prefix, json, read, sha, fingerprint, writeReports } from './closure-support.mjs';
assert.ok(process.argv.includes('--all-reference-owners-finished'), 'Wait for the root package and40-reference freeze');
const plan=json(prefix+'batch-plan-before.json'),roster=new Map(HEROES_DB.map(hero=>[hero.id,hero]));
const ids=Object.values(plan.parts).flat();assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);
const entries=['A','B'].flatMap(part=>json('src/game/combat/characterSpriteCorrectionsWave14Part'+part+'.generated.json').entries);
const assets=new Map(entries.map(entry=>[entry.heroId,entry]));assert.equal(assets.size,40);
const references=ids.map(id=>{
 const hero=roster.get(id),entry=assets.get(id);assert.ok(hero&&entry,id);
 const sheet=getHeroSpriteSheetSrc(hero,'rpg');assert.equal(sheet,entry.sheet);assert.equal(entry.frames,16);
 const bytes=read('public'+sheet);assert.equal(sha(bytes),entry.sha256);assert.ok([4,6].includes(bytes[25]));
 return {id,sheet,sha256:sha(bytes),kind:'dedicated-base16'};
});
const preparation=json(prefix+'rift-refresh/preparation-only.json');
for(const snapshot of preparation.snapshots)assert.equal(sha(read(snapshot.snapshot)),snapshot.sha256);
const result={schemaVersion:2,wave:14,authorized:true,authorizedBy:'/root',createdAt:new Date().toISOString(),referenceInputsFrozen:true,
 basis:'All40 W14 base16 references and the package have finished. Only reference steps1–2 are released; final writes3–5 require the separate post-browser root gate.',
 packageSha256:sha(read('package.json')),references,preparation:fingerprint(prefix+'rift-refresh/preparation-only.json')};
const output=prefix+'rift-refresh/authorization.json';assert.equal(fs.existsSync(new URL(output,new URL('../../',import.meta.url))),false,'Never replace an executed authorization');
writeReports([[output,result]]);
console.log(JSON.stringify({authorized:!process.argv.includes('--check-only'),checkOnly:process.argv.includes('--check-only'),references:40,newReferences:40,createdAt:result.createdAt}));
