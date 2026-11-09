import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
export const base='docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser';
export const UI_KINDS=Object.freeze(['movement','attack','guard','charge','photo','gyrodisk']);
export const UI_CASES=Object.freeze(UI_KINDS.flatMap(kind=>['player','cpu'].map(side=>kind+'-'+side)));
export const FLOW_IDS=Object.freeze(['core','physical-ledge',...UI_CASES]);
async function list(dir){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())out.push(...await list(p));else out.push(p);}return out;}
const archive=path.dirname(base),registries=['src/game/combat/characterJadeMotionWave17.generated.json','src/game/combat/characterJadeActionWave17.generated.json','src/game/combat/characterJadeGyrodiskWave17.generated.json'];
const entries=(await Promise.all(registries.map(async p=>JSON.parse(await fs.readFile(p,'utf8'))))).flatMap(r=>r.entries);
export const resourcePaths=[...new Set([...(await list('src')),...(await list(archive)).filter(p=>!p.includes('/browser/')&&!p.endsWith('.log')&&!p.endsWith('.md')&&!p.endsWith('.csv')),...(await list(base)).filter(p=>p.endsWith('.mjs')),...entries.map(e=>'public'+e.sheet),'package.json','package-lock.json','vite.config.js','index.html','scripts/jadeNativeAssetsWave17.test.mjs','scripts/jadeStaffContactWave17.test.mjs','scripts/jadeMeleeWave17.test.mjs'])].sort();
export async function fingerprint(p){const b=await fs.readFile(p);return{path:p,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};}
export async function resourceSnapshot(){return Promise.all(resourcePaths.map(fingerprint));}
export async function beginBrowserReceipt(url){return{startedAt:new Date().toISOString(),harness:await fingerprint(path.relative(process.cwd(),fileURLToPath(url))),resourcesBefore:await resourceSnapshot()};}
export async function closeBrowserWithReceipt(browser,receipt,observedReport,reportPath,preliminary=false){
 const contextsBeforeClose=browser.contexts().length,pagesBeforeClose=browser.contexts().reduce((n,c)=>n+c.pages().length,0);await browser.close();const browserClosedAt=new Date().toISOString();assert.equal(browser.isConnected(),false);assert.equal(browser.contexts().length,0);
 const resourcesAfter=await resourceSnapshot(),old=new Map(receipt.resourcesBefore.map(r=>[r.path,r.sha256])),changedPaths=resourcesAfter.filter(r=>old.get(r.path)!==r.sha256).map(r=>r.path),stable=changedPaths.length===0;
 const closure={schemaVersion:1,startedAt:receipt.startedAt,browserClosedAt,finishedAt:new Date().toISOString(),harness:receipt.harness.path,harnessSha256:receipt.harness.sha256,preliminary,phase:preliminary?'preliminary':'final',allBrowserWindowsClosed:true,contextsBeforeClose,pagesBeforeClose,browserConnectedAfterClose:false,resourcesBefore:receipt.resourcesBefore,resourcesAfter,productionInputsStableDuringRun:stable,changedPaths,receiptOrigin:'await-browser-close-and-post-close-input-hash'};
 await fs.writeFile(reportPath.replace(/-result\.json$/,'-closure.json'),JSON.stringify({passed:!!observedReport?.passed,...closure},null,2)+'\n');if(!preliminary)assert.deepEqual(resourcesAfter,receipt.resourcesBefore,'Frozen production changed during browser flow');
 if(observedReport){assert.equal(observedReport.passed,true);assert.deepEqual(observedReport.pageErrors,[]);await fs.writeFile(reportPath,JSON.stringify({...observedReport,...closure,source1to1Verified:false},null,2)+'\n');console.log(JSON.stringify({passed:true,report:reportPath,preliminary,productionInputsStableDuringRun:stable,browserClosedAt}));}
}
