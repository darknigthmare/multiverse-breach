import { UNBOUND_COSTUME_RESEARCH_R13 } from '../src/game/wardrobeOfficialR13.js';
import { UNBOUND_COSTUME_RESEARCH_R12 } from '../src/game/wardrobeOfficialR12.js';
import { UNBOUND_COSTUME_RESEARCH_R11 } from '../src/game/wardrobeOfficialR11.js';
import { UNBOUND_COSTUME_RESEARCH_R10 } from '../src/game/wardrobeOfficialR10.js';
import { UNBOUND_COSTUME_RESEARCH_R7 } from '../src/game/wardrobeOfficialR7.js';
import fs from 'node:fs';
import path from 'node:path';
import {HEROES_DB} from '../src/game/heroes.js';
import {ENEMIES_DB} from '../src/game/enemies.js';
import {createPlayerHero} from '../src/game/playerHero.js';
import {getOfficialCostumes,getOriginalCostumes,getWardrobeCoverage,getWardrobeResearchTargets,wardrobeActorKey,ALL_OFFICIAL_WARDROBE} from '../src/game/wardrobe.js';
const [outArg,sourceBaseCommit]=process.argv.slice(2);
if(!outArg || !/^[a-f0-9]{40}$/.test(sourceBaseCommit||''))throw new Error('Usage: exportWardrobe.mjs OUT_DIR BASE_COMMIT');
const out=path.resolve(outArg);fs.mkdirSync(out,{recursive:true});
const actors=[createPlayerHero(),...HEROES_DB].map(a=>({...a,kind:'hero'}));
for(const [u,r] of Object.entries(ENEMIES_DB))for(const [key,kind] of [['monsters','enemy'],['bosses','boss'],['worldBoss','worldBoss']])for(const a of key==='worldBoss'?(r[key]?[r[key]]:[]):r[key]||[])actors.push({...a,universe:a.universe||u,kind});
const official=[],original=[],coverage=[],research=[];
for(const actor of actors){
  const base={actorKey:wardrobeActorKey(actor),actorId:actor.id||'',actorName:actor.name,universe:actor.universe,kind:actor.kind};
  official.push(...getOfficialCostumes(actor).map(c=>({...base,...c})));
  original.push(...getOriginalCostumes(actor).map(c=>({...base,...c})));
  research.push(...getWardrobeResearchTargets(actor).map(c=>({...base,...c})));
  coverage.push({...base,...getWardrobeCoverage(actor),effectSelection:actor.kind==='hero'?'HERO_SHEET':'READ_ONLY_ARCHIVE',
    incarnation:actor.incarnation||'',visualAnchor:actor.visualAnchor||'',bodyFit:'REVIEW_REQUIRED'});
}
const unboundResearch=[...UNBOUND_COSTUME_RESEARCH_R7,...UNBOUND_COSTUME_RESEARCH_R10,...UNBOUND_COSTUME_RESEARCH_R11,...UNBOUND_COSTUME_RESEARCH_R12,...UNBOUND_COSTUME_RESEARCH_R13];
const summary={sourceBaseCommit,catalogueVersion:'R13',actors:actors.length,heroes:actors.filter(a=>a.kind==='hero').length,
 officialDesigns:ALL_OFFICIAL_WARDROBE.length,officialActorBindings:official.length,actorsWithOfficial:coverage.filter(c=>c.official>0).length,
 actorsAwaitingOfficialResearch:coverage.filter(c=>!c.official).length,originalParametricBriefs:original.filter(c=>c.designMethod==='PARAMETRIC_BRIEF').length,
 characterSpecificBriefs:original.filter(c=>c.designMethod==='CHARACTER_SPECIFIC_BRIEF').length,researchTargets:research.length,
 unboundCostumeCandidates:unboundResearch.length,
 fullCostumeSheetsProduced:0,artisticApprovals:0,sharedGroundEffects:3,
 note:'Source-backed outfit inventory and original design briefs. Full costume artwork is pending; procedural effects are separate. This is not a complete official-costume census.'};
for(const [name,value] of Object.entries({summary,coverage,official,original,research}))fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify(value,null,2)+'\n');
const cell=value=>{
  let text=String(value??'');
  const first=[...text].find(c=>c.charCodeAt(0)>31 && !/\s/.test(c));
  if(first && '=+@-'.includes(first))text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
};
const csv=(rows,keys)=>'\uFEFF'+[keys,...rows.map(r=>keys.map(k=>typeof r[k]==='object'?JSON.stringify(r[k]):r[k]))].map(r=>r.map(cell).join(';')).join('\r\n')+'\r\n';
fs.writeFileSync(path.join(out,'coverage.csv'),csv(coverage,['actorKey','actorId','actorName','universe','kind','official','originalConcepts','sourceResearch','completedCostumes','effectSelection','bodyFit','namedSourceScopes','allCharacterCostumesResearched']));
fs.writeFileSync(path.join(out,'official.csv'),csv(official,['id','actorId','actorName','universe','name','sourceWork','sourceUrl','nature','component','sourceMode','targetIncarnation','relatedDesignKey','wearerBinding','wearerEvidence','sourceAcquisition','artworkStatus','artApproval','equippable']));
fs.writeFileSync(path.join(out,'personal-designs.csv'),csv(original.filter(c=>c.designMethod==='CHARACTER_SPECIFIC_BRIEF'),['id','actorId','actorName','universe','name','brief','artworkStatus','artApproval','equippable']));
fs.writeFileSync(path.join(out,'research.csv'),csv(research,['entryId','actorName','universe','question','sourceUrl','status','officialConfirmed']));
fs.writeFileSync(path.join(out,'unbound-costumes.json'),JSON.stringify(unboundResearch,null,2)+'\n');
fs.writeFileSync(path.join(out,'unbound-costumes.csv'),csv(unboundResearch,['actorName','costume','universe','sourceWork','sourceUrl','sourceEvidence','status','equippable']));
console.log(JSON.stringify(summary,null,2));
