// Run BEFORE combatFidelityAudit --write, after the production owner freezes.
// Output is subsequently hashed as evidence. Coverage writes only README / CSV.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {measureCombatFidelity} from '../../scripts/combatFidelityAudit.mjs';
import {getCharacterAnimationAssets} from '../../src/game/combat/characterAnimationCatalog.js';
import {getMeleeAnimationManifest} from '../../src/game/melee/meleeAnimationManifest.js';
import sharp from 'sharp';
import { historicalBaseline, validateInventory, validateFreeze, writeReports, expected } from './closure-support.mjs';
assert.ok(process.argv.includes('--after-production-freeze'), 'Wait for the root production-freeze signal');
const freeze = validateFreeze();
historicalBaseline();
const root=new URL('../../',import.meta.url),directory=new URL('./',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root)),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=JSON.parse(fs.readFileSync(new URL('baseline.json',directory)));
const current=measureCombatFidelity();
validateInventory(current);
assert.equal(current.batch.wave,14); assert.equal(current.batch.requestedCharacters,40);
const fresh=(entries,oldEntries,key)=>entries.filter(e=>!new Set(oldEntries.map(e=>e[key])).has(e[key]));
const nativeBySheet=new Map(getCharacterAnimationAssets().map(e=>[e.sheet,e]));
const baseBySheet=new Map(fs.readdirSync(new URL('src/game/combat/',root)).filter(p=>/^characterSpriteCorrections.*\.generated\.json$/.test(p)).flatMap(p=>JSON.parse(read('src/game/combat/'+p)).entries).map(e=>[e.sheet,e]));
const completeNative32=fresh(current.meleeBindings.nativePresentationEntries,baseline.meleeBindings.nativePresentationEntries,'heroId').map(e=>{const asset=nativeBySheet.get(e.sheet);assert.equal(asset.frames,32);return asset;});
const partialNative=fresh(current.meleeBindings.nativePartialPresentationEntries,baseline.meleeBindings.nativePartialPresentationEntries,'heroId');
const base16=fresh(current.baseSpriteCorrections.entries,baseline.baseSpriteCorrections.entries,'heroId').map(e=>{const asset=baseBySheet.get(e.sheet);assert.equal(asset.frames,16);return asset;});
const full45=fresh(current.meleeBindings.detailedManifestCoverage.filter(e=>e.complete),baseline.meleeBindings.detailedManifestCoverage.filter(e=>e.complete),'id');
const rosterReinforcement16=fresh(current.entities.nativeAnimationEntries,baseline.entities.nativeAnimationEntries,'key');
const sheets=[...new Set([...completeNative32,...partialNative,...base16,...rosterReinforcement16].map(e=>e.sheet).concat(full45.flatMap(e=>e.sheets)))].sort();
const newPoses=completeNative32.reduce((n,e)=>n+e.frames,0)+partialNative.reduce((n,e)=>n+e.frames,0)+base16.reduce((n,e)=>n+e.frames,0)+full45.reduce((n,e)=>n+e.boundFrames,0)+rosterReinforcement16.reduce((n,e)=>n+e.frames,0);
assert.ok(completeNative32.length<=expected.characters); assert.ok(base16.length<=expected.characters);
assert.equal(partialNative.length,0); assert.equal(full45.length,1); assert.equal(full45[0].id,expected.full45);
assert.equal(full45[0].boundFrames,180); assert.equal(rosterReinforcement16.length,expected.reinforcementAtlases);
assert.deepEqual([...completeNative32.map(e=>e.heroId)].sort(),[...base16.map(e=>e.heroId)].sort());
const selected=new Set(current.batch.actualCharacterIds);
for(const entry of [...completeNative32,...base16])assert.ok(selected.has(entry.heroId),entry.heroId);
// The published missing list must be bound to real current-wave refusal receipts.
const blockedNativeHeroIds=[...current.batch.remainingNativeCharacterIds];
const refusalEvidence=[];
for(const part of ['part-a','part-b']){
 const file=new URL(part+'/request-failures.json',directory);
 if(!fs.existsSync(file))continue;
 const record=JSON.parse(fs.readFileSync(file));
 for(const failure of record.failures||[]){
  if(!selected.has(failure.heroId)||failure.code!=='moderation_blocked')continue;
  for(const receipt of failure.receipts||[failure]){
   const bytes=read(receipt.receipt); const tool=JSON.parse(bytes);
   assert.equal(tool.code,'moderation_blocked');assert.equal(tool.imageReturned,false);assert.ok(tool.requestId);
   if(receipt.receiptSha256)assert.equal(sha(bytes),receipt.receiptSha256);
   refusalEvidence.push({heroId:failure.heroId,path:receipt.receipt,sha256:sha(bytes),requestId:tool.requestId});
  }
 }
}
assert.deepEqual([...new Set(refusalEvidence.map(e=>e.heroId))].sort(),[...blockedNativeHeroIds].sort());
assert.equal(completeNative32.length,expected.characters-blockedNativeHeroIds.length);
for(const asset of [...completeNative32,...partialNative,...base16,...rosterReinforcement16])assert.equal(sha(read('public'+asset.sheet)),asset.sha256,asset.sheet);
// Count only cells actually bound in production, including non-square RPG cells.
// The unused padding rows of the six full45 sheets never become new poses.
const cells = new Map();
for (const asset of [...completeNative32, ...partialNative, ...base16, ...rosterReinforcement16]) {
  const entry = nativeBySheet.get(asset.sheet) || baseBySheet.get(asset.sheet)
    || JSON.parse(read('src/game/combat/summonAnimationsWave14.generated.json')).entries.find(e => e.sheet === asset.sheet);
  assert.ok(entry, asset.sheet);
  const rows = entry.phases ? [...new Set(Object.values(entry.phases).map(p => p.row))] : Array.from({ length: entry.rows }, (_, i) => i);
  cells.set(entry.sheet, { width: entry.frameWidth, height: entry.frameHeight,
    cells: rows.flatMap(row => Array.from({ length: entry.columns }, (_, col) => ({ row, col }))) });
}
for (const hero of full45) {
  const manifest = getMeleeAnimationManifest(hero.id);
  for (const animation of Object.values(manifest.animations)) {
    const group = cells.get(animation.sheet) || { width: manifest.cellWidth, height: manifest.cellHeight, cells: [] };
    for (let i = 0; i < animation.frameCount; i++) group.cells.push({ row: animation.row, col: animation.startColumn + i });
    cells.set(animation.sheet, group);
  }
}
const distinctCells = new Set(); let checkedCells = 0;
for (const [sheet, group] of cells) {
  assert.ok(Number.isInteger(group.width) && Number.isInteger(group.height), sheet);
  const { data, info } = await sharp(read('public' + sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const { row, col } of group.cells) {
    const rgba = Buffer.alloc(group.width * group.height * 4);
    for (let y = 0; y < group.height; y++) {
      const offset = ((row * group.height + y) * info.width + col * group.width) * 4;
      data.copy(rgba, y * group.width * 4, offset, offset + group.width * 4);
    }
    const digest = sha(rgba); assert.equal(distinctCells.has(digest), false, `${sheet}/${row}/${col}: duplicate retained cell`);
    distinctCells.add(digest); checkedCells++;
  }
}
assert.equal(checkedCells, newPoses); assert.equal(distinctCells.size, newPoses);
validateFreeze();
const deliverables={schemaVersion:2,date:'2026-10-25',wave:14,source1to1Verified:false,completeNative32,partialNative,base16,full45,rosterReinforcement16,newPoses,newPngFiles:sheets.length,sheets,blockedNativeHeroIds,refusalEvidence,fallbackPartnerHeroIds:[],missingNativeRpgPartnerHeroIds:[],productionFreezeCreatedAt:freeze.createdAt,nativeRgbaCellsChecked:checkedCells,globallyDistinctNativeRgbaCells:distinctCells.size,countsDerivedFrom:'Delivered runtime entries, PNG SHA/dimensions/alpha, globally distinct retained RGBA cells, distinct manifest rows and immutable W13 baseline; no rejected image, old reused pose or screenshot counted.'};
writeReports([['docs/combat-fidelity-wave14-2026-10-25/deliverables.json',deliverables]]);
console.log(JSON.stringify({complete32:completeNative32.length,partialNative:partialNative.length,base16:base16.length,full45:full45.length,reinforcement16:rosterReinforcement16.length,newPoses,newPngFiles:sheets.length}));
