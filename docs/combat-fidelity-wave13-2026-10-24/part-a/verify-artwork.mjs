import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const ROOT=path.resolve(import.meta.dirname,'../../..'),DIR='docs/combat-fidelity-wave13-2026-10-24/part-a';
const read=p=>fs.readFile(path.resolve(ROOT,p)),json=async p=>JSON.parse(await read(p));
const hash=b=>createHash('sha256').update(b).digest('hex'),sort=a=>[...a].sort();
const plan=await json('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json');
const records=await json(DIR+'/generation-records.json'),before=await json(DIR+'/first-seven-images-before-completion.json');
const historical=await json('docs/combat-fidelity-wave12-2026-10-23/validation.json'),historicalAudit=await json('docs/combat-fidelity-wave12-2026-10-23/current.json');
assert.deepEqual(sort(records.records.map(r=>r.heroId)),sort(plan.parts.A));
assert.equal(records.records.length,20);assert.deepEqual(records.remainingHeroIds,[]);assert.deepEqual(records.blockedHeroIds,[]);
assert.ok(records.records.every(r=>r.reviewed===true));

const registries=[['native','src/game/combat/characterAnimationsWave13PartA.generated.json',8],['base','src/game/combat/characterSpriteCorrectionsWave13PartA.generated.json',4]];
const nativeCellHashes=new Set(),visibleCellHashes=new Set(),assets=[],inputHashes={};
for(const[kind,file,rows]of registries) {
 const bytes=await read(file),registry=JSON.parse(bytes);inputHashes[file]=hash(bytes);
 assert.equal(registry.entries.length,20);assert.deepEqual(sort(registry.entries.map(e=>e.heroId)),sort(plan.parts.A));
 for(const entry of registry.entries) {
  const png=await read('public'+entry.sheet);assert.equal(hash(png),entry.sha256);assert.equal(entry.frames,rows*4);
  assert.equal(entry.width,1024);assert.equal(entry.height,rows*256);assert.equal(entry.columns,4);assert.equal(entry.rows,rows);
  assert.equal(entry.visualValidation.allFramesReviewed,true);assert.equal(entry.visualValidation.source1to1Verified,false);
  const{data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,entry.width);assert.equal(info.height,entry.height);assert.equal(info.channels,4);
  for(let row=0;row<rows;row++)for(let col=0;col<4;col++) {
   const cell=Buffer.alloc(256*256*4),visible=Buffer.alloc(cell.length);let count=0;
   for(let y=0;y<256;y++)for(let x=0;x<256;x++) {
    const from=((row*256+y)*1024+col*256+x)*4,to=(y*256+x)*4,alpha=data[from+3];
    if(alpha>0)data.copy(cell,to,from,from+4);if(alpha>24){count++;data.copy(visible,to,from,from+4);}
    if(x<10||y<10||x>=246||y>=246)assert.equal(alpha,0,entry.heroId+': nontransparent margin');
   }
   assert.ok(count>300);const digest=hash(cell),visibleDigest=hash(visible);
   assert.equal(nativeCellHashes.has(digest),false,entry.heroId+': duplicate retained RGBA cell');
   assert.equal(visibleCellHashes.has(visibleDigest),false,entry.heroId+': pose differs only in weak-alpha background');
   nativeCellHashes.add(digest);visibleCellHashes.add(visibleDigest);
  }
  assets.push({heroId:entry.heroId,kind,sheet:entry.sheet,sha256:entry.sha256,width:entry.width,height:entry.height,poses:entry.frames});
 }
}
assert.equal(assets.length,40);assert.equal(nativeCellHashes.size,960);assert.equal(visibleCellHashes.size,960);

const selectedSourceCells=new Set(),sourceFiles=new Set();let sourceCount=0,observedDrawings=0;
for(const record of records.records) {
 assert.equal(hash(await read(record.referenceArchive)),record.referenceAssetSha256);
 for(const source of record.sources) {
  assert.equal(hash(await read(source.archivedPath)),source.sha256);sourceFiles.add(source.archivedPath);sourceCount++;
  assert.equal((await read(source.promptFile)).toString().trimEnd(),source.prompt.trimEnd());
  const regionBytes=await read(source.importRegionsFile);assert.equal(hash(regionBytes),source.importRegionsSha256);
  const regions=JSON.parse(regionBytes),{data,info}=await sharp(await read(source.archivedPath)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  observedDrawings+=regions.sourceBodiesObserved;const seen=new Set();
  for(const row of regions.sequences)for(const region of row) {
   for(const name of['upper','lower','leftSeam','rightSeam']) {
    const boundary=region[name];if(!boundary||seen.has(boundary.sha256))continue;seen.add(boundary.sha256);
    assert.equal(hash(Buffer.from(new Int32Array(boundary.path).buffer)),boundary.sha256);
    assert.equal(boundary.crossedVisiblePixels,0);
    for(let i=0;i<boundary.path.length;i++) {
     const vertical=name==='leftSeam'||name==='rightSeam',x=vertical?boundary.path[i]:i,y=vertical?region.top+i:boundary.path[i];
     if(vertical&&(region.upper&&y<region.upper.path[x]||region.lower&&y>=region.lower.path[x]))continue;
     assert.ok(data[(y*info.width+x)*4+3]<=24,'Source boundary crosses visible artwork');
    }
   }
  }
 }
 for(const selection of[...record.nativeSelections,...record.baseSelections]) {
  const source=record.sources[selection.source],regions=JSON.parse(await read(source.importRegionsFile));
  for(const region of regions.sequences[selection.row]) {
   const key=source.sha256+':'+region.physicalRow+':'+region.physicalColumn;
   assert.equal(selectedSourceCells.has(key),false,'A native drawing was reused for two delivered cells');selectedSourceCells.add(key);
  }
 }
}
assert.equal(selectedSourceCells.size,960);assert.equal(sourceFiles.size,22);
for(const old of before.images)assert.equal(hash(await read('public'+old.sheet)),old.sha256,'First seven public images changed');
for(const old of historical.distAssets)assert.equal(hash(await read('public'+old.sheet)),old.sha256,'Historical W12 PNG changed');
for(const registry of historicalAudit.assetInventory.registries)assert.equal(hash(await read(registry)),historicalAudit.inputHashes[registry],'Historical registry changed');

const anchors=await json('src/game/combat/nativeSuperAnchorsWave13PartA.generated.json');let measuredAnchors=0;
assert.deepEqual(sort(Object.keys(anchors)),['hicks','ripley']);
for(const[id,phases]of Object.entries(anchors)) {
 const asset=assets.find(a=>a.heroId===id&&a.kind==='native'),{data,info}=await sharp(await read('public'+asset.sheet)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(const[phase,points]of Object.entries(phases)) {assert.equal(points.length,4);for(const[col,p]of points.entries()){assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));const row=phase==='super'?7:4;assert.ok(data[((row*256+p.y)*info.width+col*256+p.x)*4+3]>24);measuredAnchors++;}}
}
assert.equal(measuredAnchors,16);
for(const name of['builder.mjs','source-regions.mjs','prepare-records.mjs','verify-artwork.mjs'])inputHashes[DIR+'/'+name]=hash(await read(DIR+'/'+name));
const result={schemaVersion:1,passed:true,source1to1Verified:false,characters:20,native32Poses:640,base16Poses:320,totalNativeDrawings:960,globallyDistinctRgbaCells:nativeCellHashes.size,globallyDistinctVisibleCells:visibleCellHashes.size,newPngFiles:assets.length,originalNativeSourcesUsed:sourceFiles.size,observedSourceDrawings:observedDrawings,uniqueSelectedSourceDrawings:selectedSourceCells.size,measuredM41aAnchors:measuredAnchors,historicalPngPreserved:historical.distAssets.length,historicalRegistriesPreserved:historicalAudit.assetInventory.registries.length,firstPublicPngPreserved:before.images.length,nativeAlphaNeverRepainted:true,seamsNeverCrossVisiblePixels:true,assets,inputHashes};
const target=DIR+'/verification.json';if(process.argv.includes('--check'))assert.deepEqual(await json(target),result);else await fs.writeFile(path.resolve(ROOT,target),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:true,characters:20,poses:960,png:40,historicalPng:result.historicalPngPreserved,historicalRegistries:result.historicalRegistriesPreserved,measuredAnchors,check:process.argv.includes('--check')}));
