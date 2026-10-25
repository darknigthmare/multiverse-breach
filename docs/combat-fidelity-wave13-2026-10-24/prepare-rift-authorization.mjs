import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../../src/game/spriteAssets.js';
const root=new URL('../../',import.meta.url),directory=new URL('./',import.meta.url);
assert.ok(process.argv.includes('--all-reference-owners-finished'));
const read=file=>fs.readFileSync(new URL(file,root)),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const plan=JSON.parse(fs.readFileSync(new URL('batch-plan-before.json',directory))),roster=new Map(HEROES_DB.map(hero=>[hero.id,hero]));
const ids=Object.values(plan.parts).flat();assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);
const references=ids.map(id=>{const hero=roster.get(id);assert.ok(hero);const sheet=getHeroSpriteSheetSrc(hero,'rpg');return {id,sheet,sha256:sha(read('public'+sheet)),kind:sheet.includes('-wave13-')?'dedicated-base16':'retained-historical-reference'};});
assert.equal(references.filter(reference=>reference.kind==='dedicated-base16').length,35);
const result={schemaVersion:1,authorized:true,authorizedBy:'/root',createdAt:new Date().toISOString(),referenceInputsFrozen:true,
  basis:'All35 W13 base16 PNGs and5 historical references are complete and frozen by their owners. The package is frozen. Only the reference refresh steps1–2 may run before final browser closure; steps3–5 require the separate root gate.',
  packageSha256:sha(read('package.json')),references};
const output=new URL('rift-refresh/authorization.json',directory);assert.equal(fs.existsSync(output),false,'Do not replace an executed authorization');
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({authorized:true,references:references.length,newReferences:35,createdAt:result.createdAt}));
