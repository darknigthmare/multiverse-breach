import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_A as originalDefs} from '../../../src/game/combat/combatSourceDefinitionsWave17PartA.js';
import {ABILITIES_WAVE17_PART_A as originalKits} from '../../../src/game/combat/abilities/abilitiesWave17PartA.js';
const p='docs/combat-fidelity-wave17-2026-11-02/part-a/';
const defs=structuredClone(originalDefs),kits=structuredClone(originalKits);
const raw=fs.readFileSync(p+'source-plan.json');
const errata={schemaVersion:1,createdAt:new Date().toISOString(),sourcePlanSha256:createHash('sha256').update(raw).digest('hex'),entries:[
 {heroId:'rayman_rayman',generationAlreadyStartedForThisHero:true,priorRawSourceRetained:true,reason:'Rayman Legends charged punch is a short-range physical fist attack. The initial projectile interpretation is withdrawn. Its three fist-only release drawings are incomplete body poses and cannot be delivered. Corrective poses must retain the complete limbless torso, shoes and both hands.',previous:{effect:'damage',delivery:'projectile'},intended:{effect:'damage',delivery:'melee',range:130},nativeCorrectionRequired:true},
 {heroId:'tail_concerto_waffle',generationAlreadyStartedForThisHero:false,reason:'A Police Robo bubble captures without HP damage. Explicit live target eligibility is mandatory; one1.25second /1turn crossover duration is declared rather than asserted as original-game timing.',intended:{effect:'control',delivery:'control',controlKind:'bubble-capture',nonlethal:true,requiresExplicitTargetEligibility:true,duration:1.25,tacticsTurns:1},runtimeImplementation:'src/game/combat/sourceBubbleCaptureWave17.js'},
 {heroId:'beyond_good_evil_jade',generationAlreadyStartedForThisHero:false,reason:'Actual official2003 Steam screenshot inspected: green forehead headband, uncovered short black hair, green lipstick and blue-green trousers. No cap or beige trousers.',sourceImage:'docs/combat-fidelity-wave17-2026-11-02/jade-sources/research/steam-official-screen-0.jpg',intended:{additionalAppearance:'green lipstick; green forehead headband, no cap; blue-green trousers'}}
]};
const file=p+'source-plan-errata-before-corrective-generation.json';
if(!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify(errata,null,2)+'\n');
const recorded=JSON.parse(fs.readFileSync(file));assert.deepEqual(recorded.entries,errata.entries);
defs.rayman_rayman.delivery='melee';defs.rayman_rayman.ordinaryAction={...kits.rayman_rayman.simple};
defs.rayman_rayman.sourceDescription='Rayman Legends charged punch is a physical short-range strike of his floating white-gloved fist. It does not fire a long-range energy orb. The complete torso, shoes and both independent hands remain visible through the native release.';
for(const slot of ['secondary','special'])kits.rayman_rayman[slot]={...kits.rayman_rayman[slot],type:'melee',targeting:{...kits.rayman_rayman[slot].targeting,delivery:'melee',range:130}};
kits.rayman_rayman.sourceReference='Rayman Legends (2013). '+defs.rayman_rayman.sourceDescription;
defs.beyond_good_evil_jade.appearance+=' Green lipstick, as seen in the inspected official2003 screenshot.';
for(const slot of ['simple','special'])kits.tail_concerto_waffle[slot]={...kits.tail_concerto_waffle[slot],targeting:{...kits.tail_concerto_waffle[slot].targeting,controlKind:'bubble-capture',duration:1.25,tacticsTurns:1,nonlethal:true,requiresExplicitTargetEligibility:true}};
defs.tail_concerto_waffle.controlKind='bubble-capture';
defs.tail_concerto_waffle.sourceContract={...defs.tail_concerto_waffle.sourceContract,controlKind:'bubble-capture',nonlethal:true,requiresExplicitTargetEligibility:true,duration:1.25,tacticsTurns:1};
fs.writeFileSync('src/game/combat/combatSourceDefinitionsWave17PartA.js','// Frozen source plan plus append-only pre-correction erratum, including physical Rayman punch and nonlethal Police Robo bubble.\nexport const COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_A = Object.freeze('+JSON.stringify(defs,null,2)+');\n');
fs.writeFileSync('src/game/combat/abilities/abilitiesWave17PartA.js','//31 new kits,9 revisions; source-plan erratum records physical fist and nonlethal capture corrections.\nexport const ABILITIES_WAVE17_PART_A = Object.freeze('+JSON.stringify(kits,null,2)+');\n');
console.log(JSON.stringify({errata:recorded.entries.length,originalPlanUnchanged:true}));
