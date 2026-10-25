import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { ABILITIES_WAVE14, ABILITY_REVISIONS_WAVE14 } from '../src/game/combat/abilities/abilitiesWave14.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { COMBAT_CAPABILITY_COMPLETION } from '../src/game/combat/completion/catalog.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 as sources } from '../src/game/combat/combatSourceDefinitionsWave14.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES } from '../src/game/combat/presentationCatalog.js';
import { supportsNativeSuperWave14, supportsTrackedProjectileVisualWave14, getNativeSuperVisualStateWave14 } from '../src/game/combat/nativeSuperVisualsWave14.js';
const plan=JSON.parse(fs.readFileSync(new URL('../docs/combat-fidelity-wave14-2026-10-25/batch-plan-before.json',import.meta.url)));
const sorted=a=>[...a].sort(), ids=Object.values(plan.parts).flat(), roster=new Map(HEROES_DB.map(h=>[h.id,h]));
test('W14 uses the exact frozen40 source versions and separates12 new abilities from28 revisions',()=>{
 assert.equal(ids.length,40); assert.equal(new Set(ids).size,40); assert.equal(plan.parts.A.length,20); assert.equal(plan.parts.B.length,20);
 assert.deepEqual(sorted(Object.keys(sources)),sorted(ids));
 assert.deepEqual(sorted(Object.keys(ABILITIES_WAVE14)),sorted(plan.heroes.filter(e=>!e.alreadyAuthored).map(e=>e.hero.id)));
 assert.deepEqual(sorted(Object.keys(ABILITY_REVISIONS_WAVE14)),sorted(plan.heroes.filter(e=>e.alreadyAuthored).map(e=>e.hero.id)));
 assert.equal(Object.keys(ABILITIES_WAVE14).length,12);assert.equal(Object.keys(ABILITY_REVISIONS_WAVE14).length,28);
 assert.equal(Object.keys(COMBAT_ABILITY_OVERRIDES).length,1540);
 assert.equal(Object.keys(COMBAT_ABILITY_OVERRIDES).filter(id=>!Object.hasOwn(ABILITIES_WAVE14,id)).length,1528);
 for(const e of plan.heroes){const h=roster.get(e.hero.id),s=sources[h.id];for(const [key,value] of Object.entries(e.source))assert.deepEqual(s[key],value,h.id+': '+key);assert.equal(h.weaponType,s.weaponType);for(const slot of ['simple','secondary','defense','special'])assert.deepEqual(h[slot],e.hero[slot],h.id+': raw action retained');}
 assert.equal(sources.gimli_lotr.bodyHeight,150);assert.equal(sources.no_mans_sky_polo.bodyHeight,120);for(const id of ['space_marine_titus','space_marine_sidonus','space_marine_leandros'])assert.equal(sources[id].bodyHeight,220);
});
test('W14 resolves160 named slots with zero-damage support and exact special effects/delivery',()=>{
 let slots=0;for(const id of ids){const h=roster.get(id),s=sources[id];for(const slot of ['simple','secondary','defense','special']){const p=resolveCombatAbility(h,slot);slots++;assert.equal(p.sourceHeroId,id);assert.equal(p.provenance.sourceWork,s.sourceWork);assert.equal(p.provenance.canonicalVerified,false);assert.equal(p.provenance.networkVerified,false);assert.equal(p.provenance.identityAuthored,true);assert.doesNotMatch(p.name,/Signature Strike|Breach Technique|Origin Burst|Signature Guard/);assert.ok(p.hitAt>0&&p.hitAt<p.duration);if(p.effect==='damage'){assert.ok(p.multiplier>0);assert.equal(p.targetSide,'enemy');}else{assert.equal(p.multiplier,0);assert.equal(p.delivery,'support');assert.notEqual(p.targetSide,'enemy');}}
 const p=resolveCombatAbility(h,'special');assert.equal(p.name,s.actionName);assert.equal(p.effect,s.effect);assert.equal(p.delivery,s.delivery);assert.equal(supportsNativeSuperWave14(p),true);assert.equal(supportsTrackedProjectileVisualWave14(p),s.effect==='damage'&&s.delivery==='projectile');assert.equal(supportsNativeSuperWave14({...p,sourceHeroId:'foreign'}),false);
 const recipe=CHARACTER_PRESENTATIONS[id];assert.equal(recipe.sourceAction,s.actionName);assert.deepEqual(sorted(Object.keys(recipe.phases)),sorted(PRESENTATION_PHASES));}
 assert.equal(slots,160);assert.equal(resolveCombatAbility(roster.get('mordin'),'special').delivery,'projectile');assert.equal(roster.get('mordin').weaponType,'omnitool');assert.equal(resolveCombatAbility(roster.get('deus_ex_adam_jensen'),'special').delivery,'radial');
});
test('W14 keeps every prior authored/completion record inspectable and selects40 non-self same-universe partners',()=>{
 const completed=plan.heroes.filter(e=>e.priorCompletion);assert.equal(completed.length,26);
 for(const e of completed)assert.deepEqual(COMBAT_CAPABILITY_COMPLETION[e.hero.id],e.priorCompletion,e.hero.id+': immutable historical completion');
 for(const e of plan.heroes.filter(e=>e.alreadyAuthored)){const selected=COMBAT_ABILITY_OVERRIDES[e.hero.id];assert.equal(selected.versionRevision,'wave14-explicit-source-version');assert.equal(selected.priorSourceWork,e.priorAuthored.sourceWork);}
 for(const id of ids){const h=roster.get(id),d=resolveUniverseSummon(h);assert.equal(d.kind,'reinforcement');assert.equal(d.universe,h.universe);assert.notEqual(d.sourceHeroId,id);assert.ok(roster.has(d.sourceHeroId));assert.equal(d.provenance.partnerSelection,'wave14-explicit-source-version');assert.equal(d.action.name,resolveCombatAbility(roster.get(d.sourceHeroId),'special').name);assert.equal(resolveUniverseSummon({...h,universe:'Foreign continuity'})?.provenance.partnerSelection===d.provenance.partnerSelection,false);}
});
test('W14 radial feedback remains actor-centred at the accepted contact snapshot',()=>{
 const h=roster.get('deus_ex_adam_jensen'),p=resolveCombatAbility(h,'special');const s=getNativeSuperVisualStateWave14({actor:{...h,x:600,y:300,facing:-1},profile:p,action:{elapsed:.6,duration:1.1,hitAt:.451,facing:-1},target:{x:900,y:300},contactVisual:{confirmed:true,x:430,y:300,origin:{x:440,y:300}}});assert.deepEqual(s.ground,{x:440,y:300});assert.equal(s.projectileVisual,undefined);assert.deepEqual(s.target,{x:430,y:300});
});
