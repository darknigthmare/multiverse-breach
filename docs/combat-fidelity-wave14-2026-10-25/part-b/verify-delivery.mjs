import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=path.resolve(import.meta.dirname,'../../..');
const directory='docs/combat-fidelity-wave14-2026-10-25/part-b';
const read=file=>fs.readFileSync(path.resolve(root,file));
const json=file=>JSON.parse(read(file));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const plan=json('docs/combat-fidelity-wave14-2026-10-25/batch-plan-before.json');
const records=json(directory+'/generation-records.json');
const failures=json(directory+'/request-failures.json');
const nativeFile='src/game/combat/characterAnimationsWave14PartB.generated.json';
const baseFile='src/game/combat/characterSpriteCorrectionsWave14PartB.generated.json';
const native=json(nativeFile),base=json(baseFile);
for(const entry of [...native.entries,...base.entries]){
  const source=plan.heroes.find(row=>row.hero.id===entry.heroId).source;
  for(const [field,key]of [['sourceWork','sourceWork'],['sourceAppearance','appearance'],['sourceWeapon','weapon'],['sourcePose','pose'],['sourceActionName','actionName'],['sourceEffect','effect'],['sourceDelivery','delivery'],['targetBodyHeight','bodyHeight']])assert.equal(entry[field],source[key],entry.heroId+': immutable source '+field);
}
const excluded=new Set(failures.failures.map(row=>row.heroId));
const expected=plan.parts.B.filter(id=>!excluded.has(id));
assert.deepEqual(native.entries.map(row=>row.heroId),expected);
assert.deepEqual(base.entries.map(row=>row.heroId),expected);
assert.equal(expected.length,20);assert.equal(excluded.size,0);
const hashes={},cells=[];
for(const [file,registry,frames]of [[nativeFile,native,32],[baseFile,base,16]]){
  hashes[file]=sha(read(file));
  for(const entry of registry.entries){
    const sheet='public'+entry.sheet,bytes=read(sheet);
    assert.equal(sha(bytes),entry.sha256);
    hashes[sheet]=sha(bytes);
    const{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(info.width,1024);assert.equal(info.height,frames/4*256);
    assert.equal(entry.visualValidation.source1to1Verified,false);
    for(let row=0;row<frames/4;row++)for(let c=0;c<4;c++){
      const rgba=Buffer.alloc(256*256*4);let solid=0;
      for(let y=0;y<256;y++)for(let x=0;x<256;x++){
        const offset=((row*256+y)*info.width+c*256+x)*4;
        if(data[offset+3])data.copy(rgba,(y*256+x)*4,offset,offset+4);
        if(data[offset+3]>24)solid++;
        if(x<10||y<10||x>=246||y>=246)assert.equal(data[offset+3],0,entry.heroId+': alpha margin');
      }
      assert.ok(solid>300);cells.push(sha(rgba));
    }
  }
}
assert.equal(cells.length,960);assert.equal(new Set(cells).size,960,'A complete retained RGBA pose was duplicated');
for(const entry of plan.heroes.filter(row=>row.part==='B')){
  assert.equal(sha(read('public'+entry.referenceAsset)),entry.referenceSha256);
}
for(const [folder,registry]of [['combat-character-animations-wave14-part-b',native],['combat-character-corrections-wave14-part-b',base]]){
  const published=fs.readdirSync(path.resolve(root,'public/sprites/generated',folder)).filter(file=>file.endsWith('.png')).sort();
  assert.deepEqual(published,registry.entries.map(row=>row.heroId+'.png').sort());
}
for(const record of records.records)for(const source of record.sources){
  assert.equal(sha(read(source.archivedPath)),source.sha256);
  assert.equal(sha(read(source.toolResultFile)),source.toolResultSha256);
  assert.equal(source.retainedDrawings+source.excludedDrawings,source.nativeDrawingsObserved);
}
const muzzle=json(directory+'/native-muzzle-review.json');
assert.equal(muzzle.passed,true);assert.equal(muzzle.heroes,12);assert.equal(muzzle.measurements,96);
assert.equal(muzzle.physicalFirearmHeroes,10);assert.equal(muzzle.toolEmitterHeroes,2);
for(const point of muzzle.rows){
  const entry=native.entries.find(row=>row.heroId===point.heroId),row=entry.normalization.rows[point.row];
  assert.equal(point.rowRenderScale,row.renderScale);assert.equal(point.sourceScale,row.scale);
  assert.equal(point.sourceRow,row.sourceRow);assert.equal(point.sourceColumn,row.sourceColumns[point.column]);
  assert.equal(point.sourceImageSha256,row.sourceImageSha256);
  assert.equal(point.emitterKind,point.heroId==='mordin'?'wrist-omni-tool':point.heroId==='no_mans_sky_traveller'?'multi-tool-emitter':'physical-firearm-barrel');
}
for(const[file,digest]of Object.entries(muzzle.inputHashes))assert.equal(sha(read(file)),digest,file+': muzzle input drift');
assert.equal(sha(read(muzzle.registry)),muzzle.registrySha256);
const result={schemaVersion:1,part:'B',passed:true,selected:20,completeNative32Heroes:20,base16Heroes:20,
  newPublicPng:40,uniqueRetainedRgbaCells:960,sourceImages:records.records.reduce((n,r)=>n+r.sources.length,0),
  nativeDrawingsObserved:records.records.flatMap(r=>r.sources).reduce((n,s)=>n+s.nativeDrawingsObserved,0),
  excludedNativeDrawings:records.records.flatMap(r=>r.sources).reduce((n,s)=>n+s.excludedDrawings,0),
  missingNativeHeroIds:[...excluded],historicalReferenceImagesPreserved:20,
  muzzleHeroes:12,muzzlePoints:96,physicalFirearmHeroes:10,toolEmitterHeroes:2,immutableSourcePlanFieldsExact:true,allSourceAndOutputHashesVerified:true,source1to1Verified:false,inputHashes:hashes};
fs.writeFileSync(path.resolve(root,directory,'delivery-check.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,(_,value)=>value===hashes?'[40PNG+2registries hashed]':value));
