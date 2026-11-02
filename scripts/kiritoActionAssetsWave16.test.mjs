import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {HEROES_DB} from '../src/game/heroes.js';
import {resolveMeleeSuper} from '../src/game/combatIdentity.js';
import {getCharacterActionAnimationAssetsWave16,getSourceActionAnimationFrameWave16,getCharacterAnimationFrame} from '../src/game/combat/characterAnimationCatalog.js';
const hero=HEROES_DB.find(h=>h.id==='kirito_sao'),profile=resolveMeleeSuper(hero),entry=getCharacterActionAnimationAssetsWave16().find(e=>e.id==='kirito-starburst-stream-wave16');
test('Kirito uses sixteen real action cells within active contacts and four separate native32 preparation/recovery cells',()=>{
 assert.ok(entry);const before=JSON.stringify({hero,profile}),cells=new Set();for(let i=0;i<16;i++){const frame=getSourceActionAnimationFrameWave16(hero,profile,.8+i*.15+.001,'super');assert.equal(frame.index,i);assert.equal(frame.row,Math.floor(i/4));assert.equal(frame.col,i%4);assert.equal(frame.asset.sheet,entry.sheet);cells.add(frame.row+':'+frame.col);}assert.equal(cells.size,16);
 for(const[elapsed,col]of [[.3,0],[.5,1],[.7,2],[3.2,3]]){const frame=getCharacterAnimationFrame({...hero,state:'special',action:{superProfile:profile,duration:3.5,hitAt:.8,elapsed}},{phase:'super'});assert.equal(frame.col,col);assert.equal(frame.asset.frames,32);assert.notEqual(frame.asset.sheet,entry.sheet);}
 assert.equal(getSourceActionAnimationFrameWave16(hero,profile,.799,'super'),null);assert.equal(getSourceActionAnimationFrameWave16(hero,profile,3.14,'super'),null);assert.equal(getSourceActionAnimationFrameWave16(hero,{...profile,universe:'Foreign continuity'},1,'super'),null);assert.equal(getSourceActionAnimationFrameWave16({...hero,id:'cloud_ff7',universe:'Final Fantasy VII'},profile,1,'super'),null);assert.ok(getSourceActionAnimationFrameWave16({...hero,id:'cpu:kirito',sourceHeroId:'kirito_sao'},profile,1,'super'));assert.equal(JSON.stringify({hero,profile}),before);
});
test('all sixteen published Kirito contacts are source-bound physical blade pixels with both real swords visible',async()=>{
 const bytes=await fs.readFile('public'+entry.sheet),digest=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(digest,entry.sha256);const{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,1024);assert.equal(info.height,1024);assert.equal(entry.contactAnchors.length,16);assert.equal(new Set(entry.normalization.frames.map(f=>f.sourceRawRgbaSha256)).size,16);assert.equal(entry.visualValidation.packedContactImageActuallyOpened,true);
 for(const[i,c]of entry.contactAnchors.entries()){assert.equal(c.index,i);assert.equal(c.visuallyReviewed,true);assert.ok(['elucidator','dark-repulser'].includes(c.blade));assert.notEqual(c.blade,c.otherBlade.name);for(const p of [c,c.otherBlade]){assert.ok(p.sourceVisibleNeighborhood9x9>=25);assert.ok(p.packedVisibleNeighborhood9x9>=12);assert.ok(data[((c.row*256+p.point.y)*info.width+c.col*256+p.point.x)*4+3]>24);}assert.equal(entry.normalization.frames[i].actualSolidSoleBaseline,244);assert.equal(entry.normalization.frames[i].solidPixelsExcludedByRoi,0);}
 assert.equal(entry.normalization.calibration.firstPoseIsStanding,false);assert.equal(entry.source1to1Verified,false);
});
