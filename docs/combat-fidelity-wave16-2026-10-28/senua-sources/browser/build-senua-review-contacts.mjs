// Technical QA crops of observed browser pixels only. No published sprite changes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {base,fingerprint} from './collect-senua-evidence.mjs';
import {validateFreeze} from '../../closure-support.mjs';
assert.ok(process.argv.includes('--after-final-browser'),'Complete all six final browser flows first');
const freeze=validateFreeze(),evidencePath=base+'/senua-evidence.json',evidence=JSON.parse(await fs.readFile(evidencePath,'utf8'));
assert.equal(evidence.passed,true);assert.equal(evidence.preliminary,false);assert.equal(evidence.allBrowserWindowsClosed,true);assert.ok(Date.parse(evidence.execution.startedAt)>=Date.parse(freeze.createdAt));
const directory=base+'/review-final';await fs.mkdir(directory,{recursive:true});const artifacts=[],sourceCaptures=[];
for(const name of ['core','physical-ledge']){
 const source=base+'/senua-'+name+'.png',bound=evidence.captures.find(c=>c.path===source);assert.ok(bound);const actual=await fingerprint(source);assert.equal(actual.sha256,bound.sha256);const m=await sharp(source).metadata();const rowHeight=name==='core'?180:160,rowsPerPage=name==='core'?7:10;assert.equal(m.height%rowHeight,0);
 for(let top=0,index=0;top<m.height;top+=rowHeight*rowsPerPage,index++){
  const height=Math.min(rowHeight*rowsPerPage,m.height-top),target=directory+'/'+name+'-'+index+'.png';await sharp(source).extract({left:0,top,width:m.width,height}).png().toFile(target);artifacts.push(await fingerprint(target));sourceCaptures.push({...actual,inspectedViaContactSheet:target,tile:{x:0,y:0,width:m.width,height},sourceCrop:{x:0,y:top,width:m.width,height},firstSourceRow:top/rowHeight,sourceRows:height/rowHeight});
 }
}
for(const capture of evidence.captures.filter(c=>!['senua-core.png','senua-physical-ledge.png'].some(name=>c.path.endsWith('/'+name)))){const actual=await fingerprint(capture.path);assert.equal(actual.sha256,capture.sha256);artifacts.push(actual);}
const result={generatedAt:new Date().toISOString(),preliminary:false,sourceReport:await fingerprint(evidencePath),scope:'Lossless rectangular crops of real browser captures, with no resize, anatomy change, redraw or claim that this preparation itself is a visual inspection.',actualCapturesInspected:0,artifacts,sourceCaptures};await fs.writeFile(base+'/senua-review-contacts.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({preparedImages:artifacts.length,sourceCaptures:sourceCaptures.length,actualCapturesInspected:0}));
