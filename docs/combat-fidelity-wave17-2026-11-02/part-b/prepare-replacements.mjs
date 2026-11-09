import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {getHeroSpriteSheetSrc} from '../../../src/game/spriteAssets.js';
import {guard,defend} from '../../../src/game/combat/abilities/rules.js';
import {COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_B as priorDefs} from '../../../src/game/combat/combatSourceDefinitionsWave17PartB.js';
import {ABILITIES_WAVE17_PART_B as priorKits} from '../../../src/game/combat/abilities/abilitiesWave17PartB.js';
const D='docs/combat-fidelity-wave17-2026-11-02/part-b',P='docs/combat-fidelity-wave17-2026-11-02/';
const sha=b=>createHash('sha256').update(b).digest('hex');
const amendment=JSON.parse(fs.readFileSync(P+'batch-amendments-before-generation.json'));
const defs={...priorDefs},kits={...priorKits},entries=[];
const choices={
 dana_barrett_gb:{sourceWork:'Ghostbusters (1984), non-possessed Dana Barrett, orchestra musician',appearance:'Adult human woman with shoulder-length dark-brown curly hair, practical gray blazer over light blouse, modest dark pleated skirt and dark shoes; ordinary musician, never the orange Zuul dress or possessed form',weapon:'ordinary music folder; trained cellist but no instrument used as a weapon or magical emitter',simple:'Dana indique le passage libre',secondary:'Dana avertit les autres du danger',defense:'Dana se retire derrière la porte',special:'Dana guide le retour vers la sortie',sourceReference:'https://ghostbusters.fandom.com/wiki/Dana_Barrett'},
 louis_tully_gb:{sourceWork:'Ghostbusters (1984), non-possessed Louis Tully in blue tracksuit',appearance:'Adult human accountant, short curly dark hair, large square dark-framed glasses, blue zipped tracksuit with pale trim and white athletic shoes; ordinary neighbor, no Vinz Clortho possession or Ghostbusters II uniform',weapon:'empty hands and practical warning gestures; no proton pack or supernatural power',simple:'Louis signale la porte ouverte',secondary:'Louis prévient les voisins',defense:'Louis se replie derrière la porte',special:'Louis indique la sortie de l’immeuble',sourceReference:'https://www.gbfans.com/wiki/characters/louis-tully'}
};
for(const replacement of amendment.replacements.filter(r=>r.part==='B')){
 const id=replacement.replacementId,c=choices[id],hero=replacement.replacementHero;
 const notes='Separate unrelated human support replacement. Source role is ordinary and non-possessed. New simplified sprite costume and practical four-pose choreography remain adapted illustrations, not official source frames or certified source comparison. Protection is a bounded navigation adaptation, never healing or possessed damage.';
 const e={heroId:id,id,name:c.special,displayName:hero.name,universe:hero.universe,...c,kind:'support',weaponType:'support',actionName:c.special,effect:'guard',delivery:'support',pose:'Perform a practical warning or indicate the available exit, empty hands except the declared ordinary music folder for Dana. No damage, no healing, no supernatural aura or possessed form.',bodyHeight:190,source1to1Verified:false,networkVerified:false,canonicalVerified:false,notes,gameplayAdaptation:true};
 const asset=getHeroSpriteSheetSrc(hero),bytes=fs.readFileSync('public'+asset);fs.writeFileSync(D+'/references/'+id+'.png',bytes);
 e.referenceAsset=asset;e.referenceAssetSha256=sha(bytes);e.referenceArchive=D+'/references/'+id+'.png';
 entries.push(e);defs[id]={...e,sourceDescription:c.sourceWork+'. '+c.weapon+'. '+notes,continuityNote:notes};
 kits[id]={sourceHeroId:id,universe:hero.universe,sourceWork:c.sourceWork,sourceReference:c.sourceWork+'. '+c.weapon+'. '+notes,sourceUrl:c.sourceReference,identityBasis:'canonical-role',canonicalVerified:false,networkVerified:false,gameplayAdaptation:true,source1to1Verified:false,simple:guard(c.simple,{reduce:.2}),secondary:{cd:6,...guard(c.secondary,{reduce:.25})},defense:defend(c.defense,.3),special:{...guard(c.special,{reduce:.3,duration:2}),meterCost:100,animationDuration:1.1,hitAt:.451,color:hero.color}};
}
const plan={schemaVersion:1,wave:17,part:'B',createdAt:new Date().toISOString(),beforeImageGeneration:true,amendment:P+'batch-amendments-before-generation.json',amendmentSha256:sha(fs.readFileSync(P+'batch-amendments-before-generation.json')),entries,source1to1Verified:false};
fs.writeFileSync(D+'/source-plan-replacements.json',JSON.stringify(plan,null,2)+'\n');
fs.writeFileSync('src/game/combat/combatSourceDefinitionsWave17PartB.js','//42 reviewed identities: 40 effective drawings follow the pre-generation replacement annex.\nexport const COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_B=Object.freeze('+JSON.stringify(defs,null,2)+');\n');
fs.writeFileSync('src/game/combat/abilities/abilitiesWave17PartB.js','//42 reviewed source kits; 40 effective drawing targets. Existing named secondary/defense records are preserved with scoped capability markers.\nexport const ABILITIES_WAVE17_PART_B=Object.freeze('+JSON.stringify(kits,null,2)+');\n');
fs.writeFileSync(D+'/source-plan-replacements-receipt.json',JSON.stringify({recordedAt:new Date().toISOString(),beforeImageGeneration:true,path:D+'/source-plan-replacements.json',sha256:sha(fs.readFileSync(D+'/source-plan-replacements.json')),ids:entries.map(e=>e.id)},null,2)+'\n');
console.log(JSON.stringify({reviewedDefinitions:Object.keys(defs).length,reviewedKits:Object.keys(kits).length,newExplicitSlots:81}));
