import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root=path.resolve(import.meta.dirname,'../../..'),base='docs/combat-fidelity-wave15-2026-10-26/part-a/',archive=base+'checks-before-baratus-held-axe-fix/';
const read=p=>fs.readFile(path.join(root,p)),json=async p=>JSON.parse(await read(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const before=await json(archive+'preservation-before.json'),bases=await json(archive+'base120-before.json');
const beforeRegistry=await json(archive+'characterAnimationsWave15PartA.generated.json'),afterRegistry=await json('src/game/combat/characterAnimationsWave15PartA.generated.json');
const correctedIds=['hexen_baratus','quake_franchise_ranger'],changedPngs=[],unchangedPngs=[];
for(const item of before.files.filter(e=>e.path.startsWith('public/'))){const current=sha(await read(item.path));if(current===item.sha256)unchangedPngs.push(item);else changedPngs.push({...item,afterSha256:current});}
assert.deepEqual(changedPngs.map(e=>e.path).sort(),correctedIds.map(id=>'public/sprites/generated/combat-character-animations-wave15-part-a/'+id+'.png').sort());
assert.equal(unchangedPngs.length,78);
for(const item of [...bases.registries,...bases.entries])assert.equal(sha(await read(item.path)),item.sha256,'Audited BASE16 changed: '+item.path);
assert.equal(bases.entries.length,120);assert.equal(bases.registries.length,3);
const rows=[];let unchangedEntries=0;
for(const old of beforeRegistry.entries){const current=afterRegistry.entries.find(e=>e.heroId===old.heroId);assert.ok(current);if(!correctedIds.includes(old.heroId)){assert.deepEqual(current,old);unchangedEntries++;continue;}
 const beforePath=archive+old.heroId+'-native-before.png',oldBytes=await read(beforePath),newBytes=await read('public'+current.sheet);assert.equal(sha(oldBytes),old.sha256);
 const stableCells=[],changedCells=[];
 for(let row=0;row<8;row++)for(let col=0;col<4;col++){
  const rectangle={left:col*256,top:row*256,width:256,height:256},a=await sharp(oldBytes).extract(rectangle).ensureAlpha().raw().toBuffer(),b=await sharp(newBytes).extract(rectangle).ensureAlpha().raw().toBuffer();
  const record={row,col,beforeRgbaSha256:sha(a),afterRgbaSha256:sha(b)};
  if(row===7){assert.ok(!a.equals(b),'Expected a genuinely new native SUPER pose');changedCells.push(record);}else{assert.ok(a.equals(b),'Unrelated native cell changed');stableCells.push(record);}
 }
 assert.equal(stableCells.length,28);assert.equal(changedCells.length,4);assert.deepEqual(current.normalization.rows.slice(0,7),old.normalization.rows.slice(0,7),'Original source scale/placement metadata changed');
 rows.push({heroId:old.heroId,beforeSheetSha256:old.sha256,afterSheetSha256:current.sha256,stableCells,changedCells,originalSevenRowGeometryIdentical:true,superRow:current.normalization.rows[7]});
}
assert.equal(unchangedEntries,38);
const immutablePaths=['src/game/combat/characterSpriteCorrectionsWave15PartA.generated.json','src/game/combat/nativeSuperAnchorsWave15PartA.generated.json',base+'base-provenance.json'];
for(const p of immutablePaths){const old=before.files.find(e=>e.path===p);assert.ok(old);assert.equal(sha(await read(p)),old.sha256,p+' changed');}
const report={schemaVersion:1,passed:true,correctedNativeOnlyIds:correctedIds,changedNativePngs:2,unchangedOtherPartAPngs:78,unchangedNativeRegistryEntries:38,unchangedNativeCellsPerCorrectedHero:28,newSuperCellsPerCorrectedHero:4,unchangedBasePngs:120,unchangedBaseRegistries:3,allBaseInputsByteIdentical:true,all256NativeAnchorsByteIdentical:true,oldSourceScalesAndPlacementUnchanged:true,beforeArchive:archive,changedPngs,unchangedPngs,baseInputs:bases,correctedEntries:rows,source1to1Verified:false};
const out=base+'held-axe-preservation.json';if(process.argv.includes('--check'))assert.deepEqual(await json(out),report);else await fs.writeFile(path.join(root,out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,check:process.argv.includes('--check'),changedNativePngs:2,unchangedPartAPngs:78,unchangedBasePngs:120,unchangedBaseRegistries:3,unchangedNativeRegistryEntries:38,stableNativeCells:56,newSuperCells:8,anchorsUnchanged:256}));
