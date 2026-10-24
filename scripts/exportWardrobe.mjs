import fs from 'node:fs';
import path from 'node:path';
import {HEROES_DB} from '../src/game/heroes.js';
import {ENEMIES_DB} from '../src/game/enemies.js';
import {createPlayerHero} from '../src/game/playerHero.js';
import {getOfficialCostumes,getOriginalCostumes,getWardrobeCoverage,wardrobeActorKey} from '../src/game/wardrobe.js';
import {OFFICIAL_WARDROBE} from '../src/game/wardrobeOfficial.js';
const [outArg,sourceBaseCommit]=process.argv.slice(2);
if(!outArg || !/^[a-f0-9]{40}$/.test(sourceBaseCommit||''))throw new Error('Usage: exportWardrobe.mjs OUT_DIR BASE_COMMIT');
const out=path.resolve(outArg);fs.mkdirSync(out,{recursive:true});
const actors=[createPlayerHero(),...HEROES_DB].map(a=>({...a,kind:'hero'}));
for(const [u,r] of Object.entries(ENEMIES_DB))for(const [key,kind] of [['monsters','enemy'],['bosses','boss'],['worldBoss','worldBoss']])for(const a of key==='worldBoss'?(r[key]?[r[key]]:[]):r[key]||[])actors.push({...a,universe:a.universe||u,kind});
const official=[],original=[],coverage=[];
for(const actor of actors){
  const base={actorKey:wardrobeActorKey(actor),actorId:actor.id||'',actorName:actor.name,universe:actor.universe,kind:actor.kind};
  official.push(...getOfficialCostumes(actor).map(c=>({...base,...c})));
  original.push(...getOriginalCostumes(actor).map(c=>({...base,...c})));
  coverage.push({...base,...getWardrobeCoverage(actor),effectSelection:actor.kind==='hero'?'HERO_SHEET':'READ_ONLY_ARCHIVE',
    incarnation:actor.incarnation||'',visualAnchor:actor.visualAnchor||'',bodyFit:'REVIEW_REQUIRED'});
}
const summary={sourceBaseCommit,catalogueVersion:'R5',actors:actors.length,heroes:actors.filter(a=>a.kind==='hero').length,
 officialDesigns:OFFICIAL_WARDROBE.length,officialActorBindings:official.length,actorsWithOfficial:coverage.filter(c=>c.official>0).length,
 actorsAwaitingOfficialResearch:coverage.filter(c=>!c.official).length,originalParametricBriefs:original.filter(c=>c.designMethod==='PARAMETRIC_BRIEF').length,
 characterSpecificBriefs:original.filter(c=>c.designMethod==='CHARACTER_SPECIFIC_BRIEF').length,
 fullCostumeSheetsProduced:0,artisticApprovals:0,sharedGroundEffects:3,
 note:'Source-backed outfit inventory and original design briefs. Full costume artwork is pending; procedural effects are separate. This is not a complete official-costume census.'};
for(const [name,value] of Object.entries({summary,coverage,official,original}))fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify(value,null,2)+'\n');
const cell=v=>'"'+String(v??'').replace(/^[\s\u0000-\u001f]*[=+@-]/,m=>"'"+m).replaceAll('"','""')+'"';
const csv=(rows,keys)=>'\uFEFF'+[keys,...rows.map(r=>keys.map(k=>typeof r[k]==='object'?JSON.stringify(r[k]):r[k]))].map(r=>r.map(cell).join(';')).join('\r\n')+'\r\n';
fs.writeFileSync(path.join(out,'coverage.csv'),csv(coverage,['actorKey','actorId','actorName','universe','kind','official','originalConcepts','sourceResearch','completedCostumes','effectSelection','bodyFit']));
fs.writeFileSync(path.join(out,'official.csv'),csv(official,['id','actorId','actorName','universe','name','sourceWork','sourceUrl','nature','artworkStatus','artApproval','equippable']));
console.log(JSON.stringify(summary,null,2));
