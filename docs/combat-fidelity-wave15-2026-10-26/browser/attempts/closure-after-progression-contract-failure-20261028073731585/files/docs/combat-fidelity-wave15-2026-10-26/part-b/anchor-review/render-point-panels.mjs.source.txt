// Enlarge original source pixels around manually selected physical emitters.
// Red crosshairs belong only to QA copies, never the production image.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const directory = path.dirname(fileURLToPath(import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const [id, inputRelative] = process.argv.slice(2); assert.ok(id && inputRelative);
const input = JSON.parse(fs.readFileSync(path.resolve(root, inputRelative))); assert.equal(input.id, id);
const pointsFile = path.join(directory, 'points-draft.json'), pointBytes = fs.readFileSync(pointsFile);
const points = JSON.parse(pointBytes)[id]; assert.ok(points);
const sheet = fs.readFileSync(path.join(root, 'public' + input.sheet)); assert.equal(sha(sheet), input.sheetSha256);
const panels = [], probes = [];
for (const [phaseIndex, phase] of ['super', 'fatality'].entries()) {
  assert.equal(points[phase].length, 4);
  for (const [col, point] of points[phase].entries()) {
    assert.ok(Number.isInteger(point.x) && Number.isInteger(point.y) && point.x >= 0 && point.x < 256 && point.y >= 0 && point.y < 256);
    const record = input.crops.find(row => row.phase === phase && row.col === col); assert.ok(record);
    const bytes = fs.readFileSync(path.join(root, record.path)); assert.equal(sha(bytes), record.sha256);
    const raw = await sharp(bytes).ensureAlpha().raw().toBuffer();
    const at = (x,y) => [...raw.subarray((y*256+x)*4,(y*256+x)*4+4)];
    const rgba = at(point.x, point.y); assert.ok(rgba[3] > 0, `${id}/${phase}/${col}: point is not on source pixels`);
    const left = Math.max(0, Math.min(192, point.x - 32)), top = Math.max(0, Math.min(192, point.y - 32));
    const crop = await sharp(bytes).extract({ left, top, width: 64, height: 64 }).resize(256,256,{kernel:'nearest'}).flatten({background:'#283749'}).png().toBuffer();
    const x = (point.x-left)*4+2, y = (point.y-top)*4+2;
    const marker = Buffer.from(`<svg width="256" height="256"><path d="M${x-7},${y}H${x-2}M${x+2},${y}H${x+7}M${x},${y-7}V${y-2}M${x},${y+2}V${y+7}" stroke="#ff625f" stroke-width="1.4" fill="none"/></svg>`);
    const panel = await sharp(crop).composite([{input:marker,left:0,top:0}]).png().toBuffer();
    panels.push({input:panel,left:col*256,top:phaseIndex*256});
    probes.push({phase,col,row:record.row,...point,rgba,sourceCell:record,
      sourceWindow:{left,top,width:64,height:64},opaqueNeighbors3x3:Array.from({length:9},(_,n)=>at(Math.max(0,Math.min(255,point.x+n%3-1)),Math.max(0,Math.min(255,point.y+Math.floor(n/3)-1)))[3]).filter(alpha=>alpha>0).length});
  }
}
const png = await sharp({create:{width:1024,height:512,channels:4,background:'#283749'}}).composite(panels).png().toBuffer();
const output = path.dirname(path.resolve(root,inputRelative)), stem = 'point-review-' + sha(JSON.stringify(points)).slice(0,12);
const panelFile = path.join(output,stem+'.png'); fs.writeFileSync(panelFile,png);
const report={schemaVersion:1,id,status:'awaiting-visual-inspection',createdAt:new Date().toISOString(),sheet:input.sheet,sheetSha256:input.sheetSha256,
  geometrySha256:input.geometrySha256,points,probes,pointsDraftSha256:sha(pointBytes),
  input:{path:inputRelative,sha256:sha(fs.readFileSync(path.resolve(root,inputRelative)))},
  reviewPanel:{path:path.relative(root,panelFile),sha256:sha(png),bytes:png.length},
  method:'Manually selected physical emitter coordinates on the current256px production cells; exact source RGBA and original alpha are probed. Enlargement and red crosshairs are review artifacts only. No generic body-centre point is inferred.'};
const reportFile=path.join(output,stem+'.json');fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({id,report:path.relative(root,reportFile),panel:report.reviewPanel.path,points}));
