import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const assets=JSON.parse(readFileSync('/workspace/multiverse-breach/docs/combat-fidelity-wave5-2026-10-20/validation.json','utf8')).distAssets;
 await page.goto('http://127.0.0.1:5191/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.getElementById('root')?.textContent.trim().length>30);
 const result=await page.evaluate(async assets=>{
  const dimensions=await Promise.all(assets.map(({sheet})=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({sheet,width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('Missing production image: '+sheet));image.src=sheet;})));
  return {title:document.title,rootMounted:document.getElementById('root').children.length>0,bodyTextLength:document.body.textContent.trim().length,imageCount:dimensions.length,images:dimensions};
 },assets);
 assert.equal(result.rootMounted,true);assert.equal(result.imageCount,111);assert.deepEqual(errors,[]);
 for(const actual of result.images){const expected=assets.find(asset=>asset.sheet===actual.sheet);assert.equal(actual.width,expected.width,actual.sheet);assert.equal(actual.height,expected.height,actual.sheet);}
 console.log(JSON.stringify({...result,errors}));
}finally{await browser.close();}
