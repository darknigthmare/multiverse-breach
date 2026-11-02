import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {SENUA_MELEE_MANIFEST} from '../src/game/melee/senuaMeleeManifest.js';
import motion from '../src/game/combat/characterSenuaMotionWave16.generated.json' with {type:'json'};
import action from '../src/game/combat/characterSenuaActionWave16.generated.json' with {type:'json'};
const dir='docs/combat-fidelity-wave16-2026-10-28/senua-sources',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const entries=[...motion.entries,...action.entries];
test('Senua180 delivered cells are bounded, source-hashed, distinct and match six PNGs',async()=>{
 assert.equal(entries.length,6);assert.equal(new Set(entries.flatMap(e=>e.stateOrder)).size,45);const poses=[];
 for(const e of entries){const bytes=await fs.readFile('public'+e.sheet),m=await sharp(bytes).metadata();assert.equal(sha(bytes),e.sha256);assert.equal(m.width,1024);assert.equal(m.height,2048);assert.equal(e.visualValidation.source1to1Verified,false);assert.equal(e.provenance.canonicalVerified,false);assert.equal(e.frames,e.stateOrder.length*4);
 for(const f of e.normalization.frames){poses.push(f.sourceFrameRgbaSha256);assert.ok(f.destinationRect.x>=10&&f.destinationRect.y>=10);assert.ok(f.destinationRect.x+f.destinationRect.width<=246);assert.equal(f.destinationRect.y+f.destinationRect.height,244);const source=e.sourceImages.find(s=>s.path===f.sourceImage);assert.ok(f.sourceRect.x>0&&f.sourceRect.y>0);assert.ok(f.sourceRect.x+f.sourceRect.width<source.dimensions.width);assert.ok(f.sourceRect.y+f.sourceRect.height<source.dimensions.height);}}
 assert.equal(poses.length,180);assert.equal(new Set(poses).size,180);
});
test('Senua actual236 observed bodies preserve twelve real calls, seven clipped candidates and all excluded rows',async()=>{
 const calls=JSON.parse(await fs.readFile(dir+'/actual-tool-calls.json','utf8')),plan=JSON.parse(await fs.readFile(dir+'/packing-plan.json','utf8'));
 assert.equal(calls.length,12);assert.equal(calls.reduce((n,c)=>n+c.observedSegmentedBodies,0),236);assert.equal(calls.reduce((n,c)=>n+c.observedNativePoses,0),229);
 for(const c of calls){assert.equal(sha(await fs.readFile(c.savedSource)),c.sourceSha256);assert.equal(sha(await fs.readFile(c.promptFile)),c.promptFileSha256);assert.equal(c.model,null);assert.equal(c.jobId,null);assert.equal(c.source1to1Verified,false);assert.ok(c.arguments.referenced_image_paths.every(p=>p.endsWith('senua-b48-appearance.png')||p.endsWith('senua-motion-a.native.png')));assert.ok(Date.parse(c.completedAt)>=Date.parse(c.startedAt));}
 assert.ok(plan.atlases.flatMap(a=>a.discardedRows).some(r=>r.state==='crouchCharge'&&/lacks gripped sword/.test(r.reason)));assert.ok(plan.atlases.flatMap(a=>a.discardedRows).some(r=>r.state==='ledgeClimb'));
});
test('twelve measured Senua palms and wrists bind eleven real contacts and climb lowers hand relative to body',async()=>{
 const hands=JSON.parse(await fs.readFile(dir+'/hand-measurements.json','utf8')),points=Object.values(hands.states).flat();assert.equal(points.length,12);assert.equal(points.filter(p=>p.contact).length,11);for(const p of points){assert.ok(p.visibleNeighborhood9x9>=30);assert.ok(p.wrist.visibleNeighborhood9x9>=30);assert.ok(p.sourceVisibleNeighborhood9x9>=30);}
 for(const state of ['ledgeCatch','ledgeHang','ledgeClimb']){assert.equal(SENUA_MELEE_MANIFEST.anchorByFrame[state].length,4);for(const[i,p]of hands.states[state].entries()){const a=SENUA_MELEE_MANIFEST.anchorByFrame[state][i];assert.equal(a.x,p.normalizedX);assert.equal(a.y,p.normalizedY);assert.equal(a.attachToLedge,p.contact);}}
 const p=hands.states.ledgeClimb;assert.ok(p[3].sourcePalm.y-p[0].sourcePalm.y>140);assert.ok(p.every(x=>x.sourceImage.endsWith('senua-ledge-corrective.native.png')));
});
