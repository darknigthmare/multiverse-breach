// Actual pre-integration authored/completion records. The original frozen plan
// is retained, including its explicitly corrected alreadyAuthored metadata.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
const planBytes=fs.readFileSync(new URL('batch-plan-before.json',import.meta.url));
const plan=JSON.parse(planBytes);
const output=new URL('ability-baseline-before.json',import.meta.url);
if(fs.existsSync(output))throw new Error('The pre-integration measurement is immutable');
const server=await createServer({configFile:false,root:new URL('../../',import.meta.url).pathname,server:{middlewareMode:true},appType:'custom'});
try{
 const {COMBAT_ABILITY_OVERRIDES}=await server.ssrLoadModule('/src/game/combat/abilities/catalog.js');
 const {COMBAT_CAPABILITY_COMPLETION}=await server.ssrLoadModule('/src/game/combat/completion/catalog.js');
 const ids=Object.values(plan.parts).flat();
 const authored=Object.fromEntries(ids.filter(id=>COMBAT_ABILITY_OVERRIDES[id]).map(id=>[id,COMBAT_ABILITY_OVERRIDES[id]]));
 const completion=Object.fromEntries(ids.filter(id=>COMBAT_CAPABILITY_COMPLETION[id]).map(id=>[id,COMBAT_CAPABILITY_COMPLETION[id]]));
 const result={schemaVersion:1,measuredAt:new Date().toISOString(),phase:'before-wave13-integration',frozenPlanSha256:createHash('sha256').update(planBytes).digest('hex'),correction:'The frozen plan initial alreadyAuthored flags used a nonexistent accessor and are superseded only by this actual catalog measurement. Character selection, raw heroes, versions and reference hashes are unchanged.',revisionIds:Object.keys(authored),newAbilityIds:ids.filter(id=>!authored[id]),authored,completion};
 fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({revisionIds:result.revisionIds,newAbilityIds:result.newAbilityIds,completionRevisions:Object.keys(completion)}));
}finally{await server.close();}
