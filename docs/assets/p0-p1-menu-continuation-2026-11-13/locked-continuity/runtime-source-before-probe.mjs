import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { ENEMIES_DB } from 'file:///workspace/multiverse-breach/src/game/enemies.js';
import { getLoreWorldBossOverride } from 'file:///workspace/multiverse-breach/src/game/loreWorldBossOverrides.js';
import { buildActorFidelityBacklog } from 'file:///workspace/multiverse-breach/src/game/actorFidelityBacklog.js';
const statics=JSON.parse(fs.readFileSync('/tmp/p1-metadata-continuity-20261113/static-audit.json','utf8'));
const candidates=[...statics.selected,...statics.otherMatches];
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const before=hash(ENEMIES_DB);const rows=[];
for(const candidate of candidates){
 const actor=ENEMIES_DB[candidate.universe]?.worldBoss;
 const definition=getLoreWorldBossOverride(candidate.universe);
 if(!actor||!definition)throw Error('Missing real actor '+candidate.actorKey);
 for(const key of ['name','referenceUrl','visualAnchor','legacyWorldBossId','source','type'])if(actor[key]!==definition[key])throw Error('Source mismatch '+candidate.actorKey+'/'+key);
 if(JSON.stringify(actor.continuity)!==JSON.stringify(definition.continuity))throw Error('Continuity mismatch '+candidate.actorKey);
 if(actor.isWorldBoss!==true)throw Error('Missing boss role '+candidate.actorKey);
 const backlog=buildActorFidelityBacklog({...actor,universe:candidate.universe},{kind:'worldBoss'});
 if(!backlog.tasks.some(t=>t.code==='INCARNATION_UNSPECIFIED'))throw Error('No false missing task '+candidate.actorKey);
 rows.push({...candidate,runtimeActorId:actor.id??'',runtimeType:actor.type,runtimeWorldBoss:actor.isWorldBoss,continuity:actor.continuity,backlogActorKey:backlog.actorKey,incarnationEvidence:backlog.incarnationEvidence,backlogTaskCodes:backlog.tasks.map(t=>t.code),rawActorSha256:hash(actor),sourceContractMatched:true});
}
const ambiguous=rows.filter(r=>/manga\s*\/\s*anime|anime\s*\/\s*manga/i.test(r.continuity.label));
const reviewed=rows.filter(r=>!ambiguous.includes(r));
const result={node:process.version,scope:'Read-only actual runtime actors and source contracts; no data or art approval',matchingActiveActors:rows.length,ambiguous:ambiguous.map(r=>({actorKey:r.actorKey,label:r.continuity.label})),nonCompositeActors:reviewed.length,selectedCount:40,selected:reviewed.slice(0,40),otherVerifiedActors:reviewed.slice(40),beforeRuntimeSha256:before,afterRuntimeSha256:hash(ENEMIES_DB),unchanged:before===hash(ENEMIES_DB),source1to1Verified:false};
fs.writeFileSync('/tmp/p1-metadata-continuity-20261113/runtime-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({node:result.node,matching:rows.length,ambiguous:ambiguous.length,nonComposite:reviewed.length,selected:40,unchanged:result.unchanged}));
