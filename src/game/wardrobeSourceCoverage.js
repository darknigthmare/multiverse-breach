/** Exact catalogue-scope accounting. This never judges pixels or unlocks artwork. */
export function assessNamedCostumeScope(actor,scope,definitions) {
 if(!scope || !Array.isArray(scope.expectedItems) || !scope.expectedItems.length || !Array.isArray(definitions))
  throw new TypeError('Nonempty named source manifest and definitions required.');
 const exactFields=['nature','component','sourceWork','sourceMode'];
 const expected=new Map();
 for(const item of scope.expectedItems) {
  if(!item || typeof item.key!=='string' || !item.key || typeof item.name!=='string' || !item.name || expected.has(item.key))
   throw new TypeError('Named scope requires unique keys and exact source names.');
  for(const field of exactFields)if(Object.hasOwn(item,field)&&(typeof item[field]!=='string'||!item[field].trim()))
   throw new TypeError(`Invalid named scope field: ${field}`);
  expected.set(item.key,item);
 }
 const sameActor=actor?.universe===scope.universe && actor?.id===scope.actorId;
 const candidates=sameActor?definitions.filter(e=>e.universe===scope.universe&&e.actorIds?.includes(scope.actorId)):[];
 const missing=[],duplicates=[],conflicts=[];let matched=0;
 for(const [key,item] of expected) {
  const rows=candidates.filter(e=>e.key===key);
  if(!rows.length){missing.push(key);continue;}
  if(rows.length!==1){duplicates.push(key);continue;}
  const e=rows[0];
  if(e.name?.en!==item.name || e.sourceUrl!==scope.sourceUrl || e.coverageScopeId!==scope.id
    || exactFields.some(field=>Object.hasOwn(item,field)&&e[field]!==item[field])){conflicts.push(key);continue;}
  matched++;
 }
 return {scopeId:scope.id,sourceUrl:scope.sourceUrl,boundary:scope.boundary,checkedOn:scope.checkedOn,
  expected:expected.size,matched,missing,duplicates,conflicts,
  status:!sameActor?'ACTOR_MISMATCH':missing.length||duplicates.length||conflicts.length?'NAMED_SCOPE_INCOMPLETE':'NAMED_SCOPE_COMPLETE',
  allCharacterCostumesResearched:false,artApproved:false,equippable:false};
}
