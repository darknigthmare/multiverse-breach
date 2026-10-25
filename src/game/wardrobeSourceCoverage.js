/** Exact catalogue-scope accounting. This never judges pixels or unlocks artwork. */
export function assessNamedCostumeScope(actor,scope,definitions) {
 if(!scope || !Array.isArray(scope.expectedItems) || !scope.expectedItems.length || !Array.isArray(definitions))
  throw new TypeError('Nonempty named source manifest and definitions required.');
 const expected=new Map();
 for(const item of scope.expectedItems) {
  if(!item || typeof item.key!=='string' || !item.key || typeof item.name!=='string' || !item.name || expected.has(item.key))
   throw new TypeError('Named scope requires unique keys and exact source names.');
  expected.set(item.key,item.name);
 }
 const sameActor=actor?.universe===scope.universe && actor?.id===scope.actorId;
 const candidates=sameActor?definitions.filter(e=>e.universe===scope.universe&&e.actorIds?.includes(scope.actorId)):[];
 const missing=[],duplicates=[],conflicts=[];let matched=0;
 for(const [key,name] of expected) {
  const rows=candidates.filter(e=>e.key===key);
  if(!rows.length){missing.push(key);continue;}
  if(rows.length!==1){duplicates.push(key);continue;}
  const e=rows[0];
  if(e.name?.en!==name || e.sourceUrl!==scope.sourceUrl || e.coverageScopeId!==scope.id){conflicts.push(key);continue;}
  matched++;
 }
 return {scopeId:scope.id,sourceUrl:scope.sourceUrl,boundary:scope.boundary,checkedOn:scope.checkedOn,
  expected:expected.size,matched,missing,duplicates,conflicts,
  status:!sameActor?'ACTOR_MISMATCH':missing.length||duplicates.length||conflicts.length?'NAMED_SCOPE_INCOMPLETE':'NAMED_SCOPE_COMPLETE',
  allCharacterCostumesResearched:false,artApproved:false,equippable:false};
}
