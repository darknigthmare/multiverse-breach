// Recheck current production geometry, source RGBA and the manually inspected
// artifacts before the artist merges these coordinates into the live registry.
// This helper reads only; review crops never become new native poses.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../../../../',import.meta.url)),directory=path.dirname(fileURLToPath(import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const anchors=JSON.parse(fs.readFileSync(path.join(directory,'anchors-measured.json')));
const reviews=JSON.parse(fs.readFileSync(path.join(directory,'reviews.json')));
const registry=JSON.parse(fs.readFileSync(path.join(root,'src/game/combat/characterAnimationsWave15PartB.generated.json')));
const targetIds=['killer_instinct_jago_epee','magicka_blue_wizard_foudre','magicka_red_wizard_feu','magicka_yellow_wizard_froid','metal_slug_marco_rossi','metal_slug_tarma_roving','metal_slug_eri_kasamoto','borderlands_2_salvador_gunzerking','turok_tal_set_turok','turok_joshua_fireseed_turok'];
let checkedPoints=0,checkedArtifacts=0;
for(const [id,points]of Object.entries(anchors)){
  assert.ok(targetIds.includes(id),id);const review=reviews.entries[id];assert.ok(review,id);assert.deepEqual(points,review.points);
  assert.equal(review.actualPhysicalPointsMeasured,8);assert.equal(review.actuallyViewedWith,'view_image');assert.equal(review.productionImageChanged,false);
  const asset=registry.entries.find(entry=>entry.heroId===id);assert.ok(asset,id);
  const bytes=fs.readFileSync(path.join(root,'public'+asset.sheet));assert.equal(sha(bytes),asset.sha256);assert.equal(asset.sha256,review.sourceSha256);
  const geometry={sheet:asset.sheet,sha256:asset.sha256,frameWidth:asset.frameWidth,frameHeight:asset.frameHeight,columns:asset.columns,rows:asset.rows,phases:asset.phases,normalization:asset.normalization};
  assert.equal(sha(JSON.stringify(geometry)),review.inputGeometrySha256,id+': geometry changed after measurement');
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const phase of ['super','fatality']){
    assert.equal(points[phase].length,4);assert.equal(asset.phases[phase].row,review.phaseRows[phase]);
    for(const [col,point]of points[phase].entries()){
      assert.ok(Number.isInteger(point.x)&&Number.isInteger(point.y)&&point.x>=0&&point.x<256&&point.y>=0&&point.y<256);
      const o=((asset.phases[phase].row*256+point.y)*info.width+col*256+point.x)*4,rgba=[...data.subarray(o,o+4)];
      const probe=review.probes.find(row=>row.phase===phase&&row.col===col);assert.ok(probe);assert.deepEqual(rgba,probe.rgba,id+'/'+phase+'/'+col);assert.ok(rgba[3]>0);checkedPoints++;
    }
  }
  for(const artifact of review.artifacts){
    const bytes=fs.readFileSync(path.join(root,artifact.path));assert.equal(sha(bytes),artifact.sha256);assert.equal(bytes.length,artifact.bytes);checkedArtifacts++;
  }
}
assert.equal(Object.keys(anchors).length,reviews.measuredCharacters);assert.equal(checkedPoints,reviews.measuredPoints);
if(process.argv.includes('--require-all-ten'))assert.deepEqual(Object.keys(anchors).sort(),targetIds.sort());
console.log(JSON.stringify({allTenComplete:Object.keys(anchors).length===10,reviewedCharacters:Object.keys(anchors).length,targetCharacters:10,checkedPoints,expectedAllPoints:80,checkedArtifacts,productionWrites:0,source1to1Verified:false}));
