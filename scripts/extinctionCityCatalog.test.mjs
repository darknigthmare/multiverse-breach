import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { buildCatalog } from './extinction-city/catalog.mjs';
const catalog = buildCatalog('80a54ea5bf203b7991c213775bd3c7ec4d8b3fba',(existsSync('TRACKED_FILES.txt')?readFileSync('TRACKED_FILES.txt','utf8'):execFileSync('git',['ls-files'],{encoding:'utf8',maxBuffer:32*1024*1024})).split('\n'));
test('all resolved characters are preserved in both modes',()=>{
 assert.equal(catalog.counts.heroes,1912);
 assert.equal(catalog.tables.Heros_Extinction.rows.length,1912);
 assert.equal(catalog.tables.Cite_personnages.rows.length,1912);
});
test('all threat occurrences including final boss and finale policies are explicit',()=>{
 assert.equal(catalog.tables.Ennemis_FPS.rows.length,1518);
 assert.equal(catalog.tables.Boss_FPS.rows.length,1507);
 assert.equal(catalog.tables.Finales_et_politiques.rows.length,129);
 const scene=readFileSync('src/components/HubScreen.jsx','utf8');
 for(const row of catalog.tables.Runtime_Extinction.rows)assert.ok(scene.includes("kind: '"+row[0]+"'"),row[0]);
});
test('each universe has separate mode and city zone contracts',()=>{
 assert.equal(catalog.counts.universes,525);
 assert.equal(catalog.tables.Modes_par_univers.rows.length,525);
 assert.equal(catalog.tables.Cite_zones.rows.length,525);
});
test('noncombat identities do not get four FPS combat actions',()=>{
 assert.equal(catalog.counts.nonCombat,101);
 assert.equal(catalog.tables.Actions_FPS.rows.length,catalog.counts.combatants);
 assert.equal(catalog.counts.personalFpsBindings,3);
 assert.equal(catalog.counts.actionEntries,7244);
 assert.equal(catalog.tables.Projectiles_FPS.rows.reduce((n,r)=>n+r.slice(3,6).filter(Boolean).length,0),4494);
});
test('rows have stable unique keys, correct widths and no invented validation',()=>{
 for (const [name,table] of Object.entries(catalog.tables)) {
  assert.ok(table.rows.every(r=>r.length===table.headers.length),name);
  if(name!=='Sources') assert.equal(new Set(table.rows.map(r=>name==='Assets_FPS'?r[0]+'::'+r[3]:r[0])).size,table.rows.length,name);
  assert.ok(!table.rows.some(r=>r.includes('Validé')),name);
 }
});
test('source revision is pinned and invalid revisions are rejected',()=>{
 assert.equal(catalog.sourceCommit.length,40);
 assert.throws(()=>buildCatalog('main',[]));
});

test('source-bound Nexus progress never certifies all roster actions or individual world art',()=>{
 assert.equal(catalog.counts.runtimeSignatureHeroes,7);
 assert.equal(catalog.counts.runtimeSignatureActions,28);
 const actions=catalog.tables.Actions_FPS.rows;
 assert.equal(actions.filter(r=>r[7].startsWith('Partiel — 4 actions')).length,7);
 assert.ok(actions.filter(r=>r[7].startsWith('À adapter')).length>1700);
 const relics=catalog.tables.Cite_props.rows.filter(r=>r[0].startsWith('gear::'));
 assert.equal(relics.length,catalog.counts.cityExhibitRecords);
 assert.ok(relics.every(r=>r[7]==='Partiel'&&r[6].includes('modèle personnel encore à produire')));
});
