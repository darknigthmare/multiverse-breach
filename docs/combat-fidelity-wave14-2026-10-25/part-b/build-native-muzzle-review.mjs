// Landmarks were read on the retained 256px cell grids, then snapped only to an
// existing neutral barrel-contour pixel. This does not move, paint or emit art.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const DOCS = 'docs/combat-fidelity-wave14-2026-10-25/part-b';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.resolve(ROOT, relative));
const registryFile = 'src/game/combat/characterAnimationsWave14PartB.generated.json';
const registry = JSON.parse(read(registryFile));
const landmarks = {
 noble_six: {fatality:[[210,128],[211,105],[187,91],[206,120]],super:[[212,133],[217,129],[188,128],[201,138]]},
 buck_odst: {fatality:[[191,143],[205,103],[193,95],[207,109]],super:[[198,114],[206,108],[193,113],[201,110]]},
 kelly_087: {fatality:[[202,117],[187,151],[202,111],[198,108]],super:[[202,121],[191,158],[201,120],[202,121]]},
 linda_058: {fatality:[[208,208],[211,152],[211,144],[207,193]],super:[[209,165],[211,146],[212,149],[207,177]]},
 ashley_williams: {fatality:[[195,138],[198,109],[187,108],[199,127]],super:[[201,133],[198,129],[186,132],[199,129]]},
 anya_stroud: {fatality:[[204,124],[206,98],[186,94],[204,103]],super:[[204,120],[202,119],[185,113],[202,123]]},
 carmine_cog: {fatality:[[213,115],[213,108],[198,106],[212,114]],super:[[205,151],[212,123],[190,111],[206,134]]},
 kait_diaz: {fatality:[[209,149],[205,146],[201,135],[208,159]],super:[[213,142],[186,123],[205,134],[191,143]]},
 boone_fnv: {fatality:[[190,200],[217,134],[203,113],[204,171]],super:[[200,166],[205,143],[196,134],[190,199]]},
 courier_six: {fatality:[[189,186],[208,115],[207,110],[207,124]],super:[[209,134],[215,129],[201,131],[191,176]]},
 no_mans_sky_traveller: {fatality:[[186,121],[197,133],[193,122],[182,157]],super:[[188,130],[185,145],[189,119],[180,150]]},
 mordin: {fatality:[[189,106],[187,118],[183,128],[164,151]],super:[[183,130],[190,129],[173,117],[160,160]]}
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
        const toolEmitter=['mordin','no_mans_sky_traveller'].includes(heroId);
        if(alpha<160 || (!toolEmitter && (Math.max(...rgb)>220 || Math.max(...rgb)-Math.min(...rgb)>65)))continue;
        if(heroId==='mordin' && !(rgb[0]>120 && rgb[0]>rgb[1]*1.15 && rgb[1]>30 && rgb[2]<140))continue;
        const distance=Math.hypot(x-seedX,y-seedY);
        if(!best || distance<best.distance)best={x,y,distance,rgba:[...rgb,alpha]};
      }
      assert.ok(best && best.distance<=8, heroId+'/'+phase+'/'+column+': no real neutral barrel pixel close to reviewed tip');
      const anchor={x:best.x,y:best.y};
      anchors[heroId][phase].push(anchor);
      measurements.push({heroId,phase,column,row,anchor,manualGridLandmark:{x:seedX,y:seedY},
        nearestNativeBarrelPixel:best,emitterKind:heroId==='mordin'?'wrist-omni-tool':heroId==='no_mans_sky_traveller'?'multi-tool-emitter':'physical-firearm-barrel', sourceImage:entry.normalization.rows[row].sourceImage, sourceImageSha256:entry.normalization.rows[row].sourceImageSha256, sourceRow:entry.normalization.rows[row].sourceRow,sourceColumn:entry.normalization.rows[row].sourceColumns[column], sourceScale:entry.normalization.rows[row].scale,rowRenderScale:entry.normalization.rows[row].renderScale, sourceFrameBounds:entry.normalization.rows[row].frameBounds[column],sourceCellSize:256,opposingCellAnchor:{x:256-anchor.x,y:anchor.y},
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
const outputPath='src/game/combat/nativeSuperAnchorsWave14PartB.generated.json';
fs.writeFileSync(path.resolve(ROOT,outputPath),JSON.stringify(anchors,null,2)+'\n');
const report={schemaVersion:1,part:'B',passed:true,heroes:Object.keys(anchors).length,measurements:measurements.length,
  sourceCellSize:256,nativeAnatomyUnchanged:true,allAnchorsUseExistingNativePixels:true,physicalFirearmHeroes:10,toolEmitterHeroes:2,source1to1Verified:false,
  method:'Manual measurements from retained 256px native cell grids, snapped within8px to existing native barrel contour or explicitly identified omni-tool/multi-tool emitter RGBA pixels; weapon class is recorded per point. No generated muzzle point, static body origin, paint or duplicated drawing. Reflect X for the opposite camp; world placement still comes from the engine and measured renderScale.',
  registry:outputPath,registrySha256:sha(read(outputPath)),inputHashes,rows:measurements,
  reviewNotes:'Yellow cross contacts are inspection overlays only and are not production sprites. Physical projectile flight/contact and both camps are verified by the independent runtime/browser harness, not inferred here from anchor existence.'};
fs.writeFileSync(path.resolve(ROOT,DOCS,'native-muzzle-review.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,heroes:report.heroes,points:report.measurements,registry:outputPath,
  maxManualSnapDistance:Math.max(...measurements.map(row=>row.nearestNativeBarrelPixel.distance))}));
