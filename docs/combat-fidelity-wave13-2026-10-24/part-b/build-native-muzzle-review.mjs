// Landmarks were read on the retained 256px cell grids, then snapped only to an
// existing neutral barrel-contour pixel. This does not move, paint or emit art.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const DOCS = 'docs/combat-fidelity-wave13-2026-10-24/part-b';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.resolve(ROOT, relative));
const registryFile = 'src/game/combat/characterAnimationsWave13PartB.generated.json';
const registry = JSON.parse(read(registryFile));
const landmarks = {
  meryl_mgs: { fatality:[[192,106],[191,99],[188,105],[186,138]], super:[[194,116],[192,115],[188,116],[186,123]] },
  ocelot_mgs: { fatality:[[207,100],[221,120],[183,113],[200,115]], super:[[214,134],[205,133],[198,134],[206,132]] },
  big_boss: { fatality:[[174,181],[214,106],[205,105],[174,180]], super:[[183,154],[218,142],[211,140],[188,211]] },
  joel_tlou: { fatality:[[148,181],[204,94],[199,79],[197,96]], super:[[208,90],[205,103],[199,96],[197,93]] },
  tess_tlou: { fatality:[[206,83],[210,86],[183,78],[206,82]], super:[[209,95],[194,94],[207,87],[207,99]] },
  tommy_tlou: { fatality:[[209,136],[220,144],[196,125],[205,145]], super:[[211,134],[208,143],[209,137],[201,151]] },
  dina_tlou2: { fatality:[[204,92],[204,98],[199,79],[202,97]], super:[[211,102],[209,102],[200,92],[205,99]] },
  abby_tlou2: { fatality:[[175,174],[191,112],[182,110],[183,115]], super:[[164,179],[181,130],[182,125],[180,128]] }
};
const anchors = {}, measurements = [], inputHashes = { [registryFile]:sha(read(registryFile)) };
for (const [heroId, phases] of Object.entries(landmarks)) {
  const entry = registry.entries.find(entry => entry.heroId === heroId);
  assert.ok(entry, heroId + ': retained source missing');
  const imagePath = 'public' + entry.sheet, bytes = read(imagePath);
  assert.equal(sha(bytes), entry.sha256);
  const {data,info} = await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  inputHashes[imagePath] = sha(bytes);
  anchors[heroId] = {};
  for (const [phase, points] of Object.entries(phases)) {
    const row = entry.phases[phase].row;
    anchors[heroId][phase] = [];
    for (const [column, [seedX, seedY]] of points.entries()) {
      let best = null;
      for (let y=Math.max(0,seedY-8);y<=Math.min(255,seedY+8);y++) for (let x=Math.max(0,seedX-8);x<=Math.min(255,seedX+8);x++) {
        const offset=((row*256+y)*info.width+column*256+x)*4;
        const rgb=[data[offset],data[offset+1],data[offset+2]],alpha=data[offset+3];
        if(alpha<160 || Math.max(...rgb)>220 || Math.max(...rgb)-Math.min(...rgb)>50)continue;
        const distance=Math.hypot(x-seedX,y-seedY);
        if(!best || distance<best.distance)best={x,y,distance,rgba:[...rgb,alpha]};
      }
      assert.ok(best && best.distance<=8, heroId+'/'+phase+'/'+column+': no real neutral barrel pixel close to reviewed tip');
      const anchor={x:best.x,y:best.y};
      anchors[heroId][phase].push(anchor);
      measurements.push({heroId,phase,column,row,anchor,manualGridLandmark:{x:seedX,y:seedY},
        nearestNativeBarrelPixel:best,sourceCellSize:256,opposingCellAnchor:{x:256-anchor.x,y:anchor.y},
        mirroredSameNativePixel:true,landmarkSource:DOCS+'/anchor-contacts/'+heroId+'-grid.png'});
    }
  }
  const gridFile=DOCS+'/anchor-contacts/'+heroId+'-grid.png';
  inputHashes[gridFile]=sha(read(gridFile));
  const circleSvg=['<svg width="1024" height="512" xmlns="http://www.w3.org/2000/svg">'];
  for(const [phase,row] of [['fatality',0],['super',1]])for(const [column,point]of anchors[heroId][phase].entries()){
    circleSvg.push('<circle cx="'+(column*256+point.x)+'" cy="'+(row*256+point.y)+'" r="5" fill="none" stroke="#ffec41" stroke-width="1.5"/>');
    circleSvg.push('<path d="M'+(column*256+point.x-8)+' '+(row*256+point.y)+'h16 M'+(column*256+point.x)+' '+(row*256+point.y-8)+'v16" stroke="#ffec41" stroke-width="1"/>');
  }
  circleSvg.push('</svg>');
  const annotated=DOCS+'/anchor-contacts/'+heroId+'-measured.png';
  await sharp(read(gridFile)).composite([{input:Buffer.from(circleSvg.join('')),left:0,top:0}]).png().toFile(path.resolve(ROOT,annotated));
}
const outputPath='src/game/combat/nativeSuperAnchorsWave13PartB.generated.json';
fs.writeFileSync(path.resolve(ROOT,outputPath),JSON.stringify(anchors,null,2)+'\n');
const report={schemaVersion:1,part:'B',passed:true,heroes:Object.keys(anchors).length,measurements:measurements.length,
  sourceCellSize:256,nativeAnatomyUnchanged:true,allAnchorsUseExistingBarrelPixels:true,source1to1Verified:false,
  method:'Manual measurements from retained 256px native cell grids, snapped within8px to existing neutral barrel-contour RGBA pixels. No generated muzzle point, static body origin, paint or duplicated drawing. Reflect X for the opposite camp; world placement still comes from the engine and measured renderScale.',
  registry:outputPath,registrySha256:sha(read(outputPath)),inputHashes,rows:measurements,
  reviewNotes:'Yellow cross contacts are inspection overlays only and are not production sprites. Physical projectile flight/contact and both camps are verified by the independent runtime/browser harness, not inferred here from anchor existence.'};
fs.writeFileSync(path.resolve(ROOT,DOCS,'native-muzzle-review.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,heroes:report.heroes,points:report.measurements,registry:outputPath,
  maxManualSnapDistance:Math.max(...measurements.map(row=>row.nearestNativeBarrelPixel.distance))}));
