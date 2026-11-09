import fs from 'node:fs';
import assert from 'node:assert/strict';
const P='docs/combat-fidelity-wave17-2026-11-02/';
export function readBatchLineageB(){
 const plan=JSON.parse(fs.readFileSync(P+'batch-plan-before.json'));
 const amendmentPaths=fs.readdirSync(P).filter(f=>/^batch-amendments(?:-\d+)?-before-generation\.json$/.test(f)).sort((a,b)=>(Number(a.match(/amendments-(\d+)/)?.[1])||1)-(Number(b.match(/amendments-(\d+)/)?.[1])||1)).map(f=>P+f);
 const amendments=amendmentPaths.map(p=>JSON.parse(fs.readFileSync(p)));
 let effectiveIds=[...plan.parts.B];const reviewedRows=[...plan.heroes.filter(r=>r.part==='B')];
 for(const a of amendments)for(const r of a.replacements.filter(r=>r.part==='B')){
  assert.ok(effectiveIds.includes(r.withheldId),r.withheldId+' must be an existing effective B identity');
  effectiveIds=effectiveIds.map(id=>id===r.withheldId?r.replacementId:id);
  reviewedRows.push({hero:r.replacementHero,part:'B',priorAuthored:r.priorAuthored,alreadyAuthored:r.alreadyAuthored});
 }
 assert.equal(effectiveIds.length,40);assert.equal(new Set(effectiveIds).size,40);
 return{plan,amendments,amendmentPaths,effectiveIds,reviewedRows};
}
