import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
import { grantBattleItemShield } from '../src/game/battleItemShield.js';
import { preparedLegacySignature } from './fixtures/preparedLegacySignature.mjs';
import { historicalWave10Actor } from './combatSourceVersionFixturesWave10.mjs';
let vite, heroes, kits, priority, identity, abilities, definitions10, superCatalogs, rpgProfiles, Rpg, Tactics, Fighter, Smash, install;
const engines=[];
before(async()=>{
  vite=await createServer({configFile:false,publicDir:false,appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null,hmr:false}});
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));
  ({SIGNATURE_SOURCE_KITS:kits}=await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  priority=await vite.ssrLoadModule('/src/game/combat/sourceKitPriority.js');
  identity=await vite.ssrLoadModule('/src/game/combatIdentity.js');
  rpgProfiles=await vite.ssrLoadModule('/src/game/rpgTargeting.js');
  ({COMBAT_ABILITY_OVERRIDES:abilities}=await vite.ssrLoadModule('/src/game/combat/abilities/catalog.js'));
  ({COMBAT_SOURCE_DEFINITIONS_WAVE10:definitions10}=await vite.ssrLoadModule('/src/game/combat/combatSourceDefinitionsWave10.js'));
  superCatalogs=[
    (await vite.ssrLoadModule('/src/game/canonicalCombatOverrides.js')).CANONICAL_COMBAT_OVERRIDES,
    (await vite.ssrLoadModule('/src/game/combatCanonExtensions.js')).CANONICAL_COMBAT_EXTENSIONS,
    (await vite.ssrLoadModule('/src/game/combat/completion/catalog.js')).COMBAT_CAPABILITY_COMPLETION
  ];
  ({EngineRpg:Rpg}=await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({EngineTactics:Tactics}=await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({EngineFighter:Fighter}=await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({EngineSmash:Smash}=await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({installSignatureDirector:install}=await vite.ssrLoadModule('/src/game/signatureDirector.js'));
});
afterEach(()=>engines.splice(0).forEach(e=>e.dispose()));
after(async()=>{await vite?.close();});
const hero=id=>structuredClone(heroes.find(h=>h.id===id));
const ally=id=>({id,name:id,universe:'Team Fortress 2',stats:{hp:1000,atk:10,def:0,spd:1},hp:1000,atk:10,def:0,spd:1,
  simple:{name:'Fixture strike',type:'melee',dmg:1},special:{name:'Fixture power',type:'bullet',dmg:2},defense:{name:'Guard',type:'shield',reduce:.4,dur:1}});
function make(mode,source,companions=[ally('patient'),ally('third')]){
  const own=[source,...companions], foes=[ally('foe')];let e;
  if(mode==='Fighter'){e=new Fighter(760,420,own,foes,{add(){}},()=>{},()=>{},{opponentControl:'p2'});e.countdown=0;e.getActive('player').meter=100;}
  else{const Engine={RPG:Rpg,Tactics,Smash}[mode];e=new Engine(760,420,own,{customRoster:foes,monsters:foes,bosses:[]},{add(){}},()=>{},()=>{},
    {mode,universe:'QA',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
    e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();e.enemyGlobalRecovery=99999;
    e.heroes.forEach((a,i)=>Object.assign(a,{state:'idle',stateTimer:0,action:null,actionPending:false,atb:0,specialCharge:0,x:200+i*45,y:260,gridX:1+i,gridY:2,facing:1}));
    e.enemies.forEach(a=>Object.assign(a,{state:'idle',stateTimer:0,action:null,actionPending:false,atb:-99999,x:420,y:260,gridX:6,gridY:2}));
    Object.assign(e.heroes[0],{atb:100,specialCharge:100});
    if(mode==='Tactics'){e.timers.clear();e.tiles=[];e.obstacles=[];e.escortUnit=null;e.protectedArtifact=null;e.objective='rout';e.cols=8;e.rows=5;
      Object.assign(e,{activeUnit:e.heroes[0],activeUnitType:'hero',actionPhase:'action',selectedAction:null,selectedActionExplicit:false});}
    else install(e,{mode});
  }
  engines.push(e);return e;
}
test('the default current Medic keeps its reviewed beam and never receives the old self-only Fighter adapter',()=>{
  const source=hero('team_fortress_2_medic');
  assert.equal(priority.hasSelectedCombatSource(source),true);assert.equal(priority.hasPreparedLegacyCombatSource(source),false);
  assert.equal(identity.resolveMeleeSuper(source).sourceMediGunWave17,true);
  const e=make('Fighter',source),actor=e.getActive('player');
  assert.equal(e.tryAction('player','super'),false);assert.equal(actor.meter,100);assert.equal(e.medicSupport.protects(actor),false);
});
for(const mode of ['RPG','Smash','Tactics','Fighter'])test(`${mode}: an explicitly prepared legacy Medic resolves its actual version without changing the default kit`,()=>{
  const raw=hero('team_fortress_2_medic'),prepared=preparedLegacySignature(raw,kits.team_fortress_2_medic);
  prepared.canonCombatPresentation=true; // An inherited current-canon marker cannot erase this explicit existing version.
  assert.equal(priority.hasPreparedLegacyCombatSource(prepared),true);assert.equal(priority.hasSelectedCombatSource(prepared),false);
  assert.equal(priority.hasSelectedCombatSource(prepared,'secondary'),true);
  assert.equal(identity.resolveMeleeSuper(prepared).name,prepared.special.name);
  assert.equal(identity.resolveMeleeSuper(prepared).sourceMediGunWave17,undefined);
  const e=make(mode,prepared);
  if(mode==='Fighter'){const caster=e.getActive('player');assert.equal(e.tryAction('player','super'),true);e.updateActions(1);assert.equal(e.medicSupport.protects(caster),true);}
  else if(mode==='Tactics'){const patient=e.heroes[1];assert.equal(e.sourceTacticsWave16.owns(e.heroes[0],'special'),false);
    assert.equal(e.selectAction('special'),true);assert.equal(e.handleCellClick(patient.gridX,patient.gridY).handled,true);assert.equal(e.medicSupport.protects(patient),true);}
  else{const caster=e.heroes[0],patient=e.heroes[1];assert.equal(mode==='RPG'?e.executeRpgAction(e.getActionContext(caster,'special'),[patient.battleId]):e.triggerAbility(caster,'special'),true);
    for(let i=0;i<110;i++)e.update({},{},{preMatchDeltaMs:1000/60,stageDeltaMs:1000/60});assert.equal(e.signatureDirector.getSupportState().length,1);}
  assert.equal(priority.hasSelectedCombatSource(raw),true);assert.equal(raw.special.sourceSignatureKey,undefined);
});
test('an unrelated key, unknown legacy definition, or crossed universe cannot select the legacy version',()=>{
  for(const source of [
    {...hero('team_fortress_2_medic'),special:{...hero('team_fortress_2_medic').special,sourceSignatureKey:'aerith_ff7'}},
    {...hero('kirito_sao'),special:{...hero('kirito_sao').special,sourceSignatureKey:'kirito_sao'}}
  ]){assert.equal(priority.hasPreparedLegacyCombatSource(source),false);assert.equal(priority.hasSelectedCombatSource(source),true);}
  const crossed=preparedLegacySignature(hero('team_fortress_2_medic'),kits.team_fortress_2_medic);crossed.universe='Other';
  assert.equal(priority.hasPreparedLegacyCombatSource(crossed),false);assert.equal(priority.hasSelectedCombatSource(crossed),false);
});
for(const id of ['ripley','darth_maul'])test(`${id}: the exact current incarnation retains all four raw actions while historical actors retain the reviewed source`,()=>{
  const current=hero(id);assert.equal(priority.prefersCurrentCanonCombatKit(current),true);
  for(const slot of ['simple','secondary','defense','special']){
    assert.equal(priority.hasSelectedCombatSource(current,slot),false);
    assert.equal(identity.resolveCombatAbility(current,slot).sourceAbility.name,current[slot].name);
    const historical=structuredClone(current);delete historical.incarnation;
    assert.equal(priority.hasSelectedCombatSource(historical,slot),true);
    assert.equal(identity.resolveCombatAbility(historical,slot).sourceAbility.name,abilities[id][slot].name);
  }
  const alias={...current,id:'runtime-alias',sourceHeroId:id};assert.equal(priority.prefersCurrentCanonCombatKit(alias),true);
  const incomplete=structuredClone(current);incomplete.equipment.pop();assert.equal(priority.prefersCurrentCanonCombatKit(incomplete),false);
});
for(const prepared of [false,true])test(`Tactics: an explicit ${prepared?'prepared legacy':'current'} Medic mode profile heals only the actual selected patient`,()=>{
  const raw=hero('team_fortress_2_medic'),source=prepared?preparedLegacySignature(raw,kits.team_fortress_2_medic):raw;
  source.special.tacticsProfile={effect:'heal',targetSide:'ally',shape:'single',range:2,healRatio:.1};
  const e=make('Tactics',source),caster=e.heroes[0],patient=e.heroes[1],third=e.heroes[2];patient.currentHp=100;third.currentHp=100;
  const profile=e.getAttackProfile(caster,'special');assert.equal(profile.shape,'single');assert.equal(profile.healRatio,.1);
  assert.equal(e.selectAction('special'),true);assert.equal(e.handleCellClick(patient.gridX,patient.gridY).handled,true);
  assert.equal(patient.currentHp,200);assert.equal(third.currentHp,100);assert.equal(caster.specialCharge,0);
  assert.equal(caster.sourceMediGunWave17,undefined);assert.equal(e.medicSupport.snapshot().length,0);
});

function beginOverhealedSourceCast() {
  const e=make('Tactics',hero('oken_dandadan'),[hero('team_fortress_2_medic'),ally('third')]);
  const [actor,medic]=e.heroes, target=e.enemies[0];
  e.missionProfile={...e.missionProfile,reinforcementEvery:0,hazardPulseEvery:0,pressure:0};
  Object.assign(target,{gridX:2,gridY:3});e.syncActorsToCamera();
  // Queue both real successor turns before beginning the beam. The second
  // Medic turn ends the beam through an actual defensive command.
  e.activeUnit=medic;e.activeUnitType='hero';e.actionPhase='action';
  e.turnQueue=[{unit:medic,type:'hero'},{unit:actor,type:'hero'}];
  assert.equal(e.selectAction('secondary'),true);
  assert.equal(e.handleCellClick(actor.gridX,actor.gridY).handled,true);
  let ticks=0;
  while((actor.currentHp<actor.maxHp*1.35||e.sourceTacticsWave16.action||e.actionPhase==='end')&&ticks++<300)e.update();
  assert.ok(ticks<300);assert.equal(e.activeUnit,medic);
  assert.equal(medic.sourceMediGunWave17.connected,true);assert.equal(actor.sourceMediGunOverhealWave17,true);
  assert.equal(e.selectAction('defense'),true);
  assert.equal(e.handleCellClick(medic.gridX,medic.gridY).handled,true);
  ticks=0;while((e.activeUnit!==actor||e.sourceTacticsWave16.action)&&ticks++<180)e.update();
  assert.ok(ticks<180);assert.equal(e.activeUnit,actor);assert.equal(medic.sourceMediGunWave17.connected,false);
  assert.ok(actor.currentHp>actor.maxHp);assert.equal(e.selectAction('special'),true);
  assert.equal(e.handleCellClick(target.gridX,target.gridY).handled,true);
  assert.equal(actor.specialCharge,0);
  return {e,actor,target,action:e.sourceTacticsWave16.action};
}
test('Tactics: real unmaintained Medi Gun overheal decay preserves an actual source windup through its release',()=>{
  const {e,actor,target,action}=beginOverhealedSourceCast(), hp=actor.currentHp, targetHp=target.currentHp;
  e.update();e.update();assert.ok(actor.currentHp<hp);assert.ok(actor.currentHp>actor.maxHp);
  assert.equal(actor.sourceDamageVersionWave16||0,0);assert.equal(e.sourceTacticsWave16.action,action);
  let ticks=0;while(e.sourceTacticsWave16.action&&ticks++<180)e.update();
  assert.ok(ticks<180);assert.equal(e.sourceTacticsWave16.action,null);
  assert.equal(actor.sourceOkarunAllOutUsesWave17,1);assert.equal(actor.specialCharge,0);assert.ok(target.currentHp<targetHp);
  assert.equal(e.sourceTacticsWave16.events.some(event=>event.event==='interrupted'&&event.targetId===actor.runtimeId),false);
});
test('Tactics: a real hit above maximum HP still interrupts the overhealed source cast without repeating its cost',()=>{
  const {e,actor,target}=beginOverhealedSourceCast(), targetHp=target.currentHp;
  e.update();e.update();assert.ok(actor.currentHp>actor.maxHp);
  const version=actor.sourceDamageVersionWave16||0;
  assert.ok(e.applyDamage(target,actor,1,null,{actionType:'simple'})>0);
  assert.ok(actor.currentHp>actor.maxHp);assert.ok(actor.sourceDamageVersionWave16>version);
  e.update();assert.equal(e.sourceTacticsWave16.action,null);
  for(let i=0;i<90;i++)e.update();
  assert.equal(actor.specialCharge,0);assert.equal(actor.sourceOkarunAllOutUsesWave17||0,0);assert.equal(target.currentHp,targetHp);
});

test('Tactics: zero and item-shielded hits neither mark actual HP damage nor interrupt the overhealed cast',()=>{
  const {e,actor,target,action}=beginOverhealedSourceCast();
  const version=actor.sourceDamageVersionWave16||0, hp=actor.currentHp;
  assert.equal(e.applyDamage(target,actor,0,null,{actionType:'simple'}),0);
  assert.ok(grantBattleItemShield(actor,50)>0);
  assert.equal(e.applyDamage(target,actor,10,null,{actionType:'simple'}),0);
  assert.equal(actor.currentHp,hp);assert.equal(actor.sourceDamageVersionWave16||0,version);
  e.update();e.update();assert.equal(e.sourceTacticsWave16.action,action);
  let ticks=0;while(e.sourceTacticsWave16.action&&ticks++<180)e.update();
  assert.ok(ticks<180);assert.equal(actor.sourceOkarunAllOutUsesWave17,1);assert.equal(actor.specialCharge,0);
});

test('current raw canonical actions and physical crew reinforcements retain their actual source metadata without certifying frames',()=>{
  for(const id of ['jack_sparrow_potc','will_turner_potc','elizabeth_swann_potc','raven_tt','starfire_tt']){
    const actor=hero(id),profile=identity.resolveCombatAbility(actor,'special');
    assert.equal(profile.sourceAbility.name,actor.special.name);
    assert.equal(profile.provenance.sourceWork,actor.incarnation);
    assert.equal(profile.provenance.sourceReference,actor.canonStatus);
    assert.equal(profile.provenance.sourceUrl,actor.referenceUrl);
    assert.equal(profile.provenance.identityAuthored,false);
    assert.equal(profile.provenance.source1to1Verified,false);assert.equal(profile.provenance.canonicalVerified,false);
  }
  for(const id of ['jack_sparrow_potc','will_turner_potc','elizabeth_swann_potc']){
    const summon=identity.resolveUniverseSummon(hero(id));
    assert.equal(summon.kind,'reinforcement');
    assert.equal(summon.action.name,summon.performer.special.name);
    assert.equal(summon.action.targeting.effect,'damage');assert.equal(summon.action.targeting.delivery,'melee');
    assert.equal(summon.provenance.sourceWork,summon.performer.incarnation);
    assert.equal(summon.provenance.sourceUrl,summon.performer.referenceUrl);
    assert.equal(summon.provenance.sourceReference,summon.performer.canonStatus);
    assert.equal(summon.provenance.identityAuthored,false);
    assert.doesNotMatch(summon.action.name,/Kraken|ghost|ship|Black Pearl Summon/i);
  }
});

test('RPG: known templates and earlier authored kits retain their source actions while unlisted actors retain supplied actions',()=>{
  const generic=/Origin Burst|Signature Strike|Breach Technique|decisive\s+action/i;
  let verified=0;
  for(const actor of heroes){
    if(!generic.test(actor.special?.name||'')||priority.hasSelectedCombatSource(actor,'special'))continue;
    const action=rpgProfiles.getRpgCombatantAbility(actor,'special');
    assert.ok(action,actor.id);assert.doesNotMatch(action.name,generic,actor.id);verified++;
  }
  assert.ok(verified>0);
  const concrete=hero('masterchief');
  assert.equal(priority.hasSelectedCombatSource(concrete,'secondary'),false);
  const authored=rpgProfiles.getRpgActionProfile(concrete,'secondary','player',{width:760,height:420});
  assert.equal(authored.name,'Grenade à plasma du Major');assert.equal(authored.range,480);
  assert.notEqual(authored.action.name,concrete.secondary.name);
  const unlisted={id:'explicit-unlisted-regression',universe:'QA',special:{name:'Origin Burst',type:'group',dmg:2}};
  assert.equal(rpgProfiles.getRpgCombatantAbility(unlisted,'special'),unlisted.special);
});

function beginActualRpgBeam() {
  const reviver={...ally('reviver'),secondary:{name:'Fixture native revival',type:'revive',reviveRatio:.3,dmg:0,cd:0}};
  const e=make('RPG',hero('team_fortress_2_medic'),[ally('patient'),reviver]);
  const [medic,patient,source]=e.heroes;patient.currentHp=50;
  const begin=target=>{
    assert.equal(e.beginTargeting(medic,'secondary'),true);
    assert.equal(e.selectTarget(target.battleId),true);assert.equal(e.confirmTargeting(),true);
    let ticks=0;while(!medic.sourceMediGunWave17?.connected&&ticks++<90)e.update();
    assert.ok(ticks<90);assert.equal(medic.sourceMediGunWave17.connected,true);
  };
  begin(patient);e.update();assert.ok(patient.currentHp>50);
  const restart=target=>{
    let ticks=0;while(!e.canUseAction(medic,'secondary')&&ticks++<900)e.update();
    assert.ok(ticks<900);begin(target);
    const hp=target.currentHp;e.update();assert.ok(target.currentHp>hp);
  };
  return {e,medic,patient,reviver:source,restart};
}
test('RPG: an actual Medi Gun channel cannot heal or relink to a replacement patient sharing the same runtime ID',()=>{
  const {e,medic,patient,restart}=beginActualRpgBeam();
  const replacement={...patient,stats:{...patient.stats},statusEffects:{...patient.statusEffects},currentHp:40};
  e.heroes[e.heroes.indexOf(patient)]=replacement;
  const oldHp=patient.currentHp;
  for(let i=0;i<6;i++)e.update();
  assert.equal(medic.sourceMediGunWave17.connected,false);assert.equal(replacement.currentHp,40);assert.equal(patient.currentHp,oldHp);
  restart(replacement);assert.equal(medic.sourceMediGunWave17.patientRuntimeId,replacement.runtimeId);
});
test('RPG: same-tick knockout and real revival impact invalidate the incoming beam before its next observer tick',()=>{
  const {e,medic,patient,reviver,restart}=beginActualRpgBeam();
  assert.ok(e.applyDamage(e.enemies[0],patient,100000)>0);assert.equal(patient.currentHp,0);
  assert.equal(medic.sourceMediGunWave17.connected,false,'knockout clears incoming ownership synchronously');
  const revival=e.getActionContext(reviver,'secondary');assert.ok(revival.eligibleTargets.includes(patient));
  // Exercise the real revival resolver before any world/channel update can
  // observe the intervening death; no HP counter or beam state is mocked.
  e.applyRpgImpact(reviver,revival.profile,[patient],'#ffffff','secondary');
  assert.ok(patient.currentHp>0);const hp=patient.currentHp;
  for(let i=0;i<6;i++)e.update();assert.equal(patient.currentHp,hp);assert.equal(medic.sourceMediGunWave17.connected,false);
  restart(patient);
});
test('current ordinary canonical dodges and shields are nonoffensive self-guard profiles',()=>{
  for(const id of ['saturnin_duck','lilo_pelekai','jack_sparrow_potc','raven_tt','starfire_tt']){
    const actor=hero(id);assert.ok(actor,id);
    const profile=identity.resolveCombatAbility(actor,'defense');
    assert.equal(profile.effect,'guard',id);assert.equal(profile.targetSide,'self',id);assert.equal(profile.delivery,'support',id);
    assert.equal(profile.multiplier,0,id);assert.equal(profile.sourceAbility.name,actor.defense.name,id);
    assert.deepEqual(profile.sourceAbility,{...actor.defense,slot:'defense',sourceHeroId:id},id);
  }
});
test('reviewed W10 basic-only revisions retain their exact authored supers without admitting unrelated catalog rows',()=>{
  const ids=['hicks_aliens','bishop_aliens','ripley_aliens','hudson_aliens','chains_pd','clover_pd','venkman_gb','stantz_gb','zeddemore_gb','spengler_gb','bill_l4d','ellis_l4d','coach_l4d','rochelle_l4d','nick_l4d'];
  for(const id of ids){
    // Ripley's real frozen W10 actor selects the earlier loader contact;
    // current source-locked P0 Ripley has a separately pinned supplied super.
    const actor=historicalWave10Actor(hero(id)),canonical=superCatalogs.map(catalog=>catalog[id]).find(Boolean),before=JSON.stringify([canonical,abilities[id]]);
    const selected=priority.resolveSelectedCombatSource(actor,'special'),profile=identity.resolveMeleeSuper(actor);
    assert.equal(abilities[id].special,undefined,id);assert.equal(abilities[id].versionRevision,'wave10-explicit-source-version',id);
    assert.ok(selected,id);assert.equal(selected.sourceWave,10,id);assert.equal(selected.action.name,definitions10[id].name,id);
    assert.equal(canonical.universe,actor.universe,id);assert.ok(canonical.sourceReference&&abilities[id].sourceReference,id);
    const sourceUrl=abilities[id].sourceUrl||canonical.sourceUrl;
    assert.equal(selected.authored.sourceUrl,sourceUrl,id+': preserve reviewed URL or canonical fallback');
    assert.equal(profile.provenance.sourceUrl,sourceUrl||actor.referenceUrl||actor.sourceUrl||actor.referenceUrls?.[0]||null,id+': resolved source URL');
    assert.equal(selected.authored.sourceWork,abilities[id].sourceWork,id+': selected source work');
    assert.equal(profile.provenance.sourceWork,abilities[id].sourceWork,id+': resolved selected source work');
    assert.equal(selected.authored.identityBasis,canonical.identityBasis,id+': retain original identity basis');
    assert.equal(profile.provenance.identityBasis,canonical.identityBasis,id+': resolved identity basis');
    assert.equal(profile.provenance.sourceUniverse,actor.universe,id);assert.equal(profile.provenance.identityAuthored,true,id);
    assert.deepEqual(selected.action,canonical.special,id+': provenance composition cannot replace the super action');
    assert.ok(selected.authored.sourceReference.startsWith(canonical.sourceReference),id+': original super source reference');
    assert.ok(selected.authored.sourceReference.includes(abilities[id].sourceReference),id+': selected basic-version source reference');
    assert.ok(profile.provenance.sourceReference.startsWith(canonical.sourceReference),id+': resolved original super source reference');
    assert.ok(profile.provenance.sourceReference.includes(abilities[id].sourceReference),id+': resolved selected basic-version source reference');
    assert.equal(JSON.stringify([canonical,abilities[id]]),before,id+': source reference composition must not mutate either catalog');
    assert.equal(profile.name,selected.action.name,id);assert.equal(profile.effect,definitions10[id].effect,id);
    assert.deepEqual(profile.sourceAbility,{...selected.action,slot:'special',sourceHeroId:id},id);
    assert.equal(priority.hasSelectedCombatSource({...actor,universe:'Other'}),false,id);
  }
  const hudson=identity.resolveMeleeSuper(hero('hudson_aliens')),hicks=identity.resolveMeleeSuper(hero('hicks_aliens'));
  assert.equal(hudson.effect,'buff');assert.equal(hudson.multiplier,0);assert.equal(hudson.targetSide,'ally');
  assert.equal(hicks.delivery,'projectile');assert.equal(hicks.range,640);assert.equal(hicks.multiplier,4.4);
  assert.equal(priority.hasSelectedCombatSource(hero('masterchief')),false,'an older authored super without reviewed native source is not admitted');
  assert.equal(priority.hasSelectedCombatSource(ally('unknown-reviewed-super')),false);
  const prepared=preparedLegacySignature(hero('hudson_aliens'),kits.hudson_aliens);
  assert.equal(priority.hasPreparedLegacyCombatSource(prepared),true);assert.equal(priority.hasSelectedCombatSource(prepared),false);
});


test('current source-locked Aliens Ripley supersedes only the metadata-only W10 special while historical sources and basics remain selected',()=>{
  const actor=hero('ripley_aliens'),before=structuredClone(actor);
  const assertCurrent=source=>{
    assert.equal(priority.resolveSelectedCombatSource(source,'special'),null);
    const profile=identity.resolveMeleeSuper(source);
    assert.equal(profile.name,'Power Loader Smash');assert.equal(profile.delivery,'melee');assert.equal(profile.shape,'area');assert.equal(profile.multiplier,source.special.dmg);
    assert.deepEqual(profile.sourceAbility,{...source.special,slot:'special',sourceHeroId:'ripley_aliens'});
    assert.equal(profile.provenance.identityAuthored,false);assert.equal(profile.provenance.sourceWork,actor.incarnation);
    assert.equal(profile.provenance.source1to1Verified,false);
    for(const slot of ['simple','secondary','defense']){
      const selected=priority.resolveSelectedCombatSource(source,slot);
      assert.ok(selected,slot);assert.equal(selected.sourceWave,10);assert.equal(selected.id,'ripley_aliens');
      assert.deepEqual(selected.action,abilities.ripley_aliens[slot]);
      assert.deepEqual(identity.resolveCombatAbility(source,slot).sourceAbility,{...selected.action,slot,sourceHeroId:'ripley_aliens'});
    }
  };
  assertCurrent(actor);
  assertCurrent({...actor,special:{...actor.special,dmg:7,animationDuration:1.4,hitAt:.6}});
  const configured={...actor,special:{...actor.special,dmg:6.5,rpgProfile:{shape:'single',range:222,delivery:'melee'},tacticsProfile:{range:4}}};
  assert.equal(priority.resolveSelectedCombatSource(configured,'special'),null);
  const configuredProfile=identity.resolveMeleeSuper(configured);
  assert.equal(configuredProfile.shape,'single');assert.equal(configuredProfile.range,222);assert.equal(configuredProfile.multiplier,6.5);
  assert.deepEqual(configuredProfile.sourceAbility,{...configured.special,slot:'special',sourceHeroId:'ripley_aliens'});
  for(const key of ['sourceHeroId','sourceId'])assertCurrent({...actor,id:'runtime-ripley-alias',[key]:'ripley_aliens'});
  const historical=historicalWave10Actor(actor),selected=priority.resolveSelectedCombatSource(historical,'special');
  assert.ok(selected);assert.equal(selected.sourceWave,10);assert.equal(selected.action.name,'P-5000 Power Loader');
  assert.equal(identity.resolveMeleeSuper(historical).name,'P-5000 Power Loader');
  for(const changed of [
    {...actor,incarnation:'Alien (1979) - Nostromo / Narcissus'},
    {...actor,equipment:actor.equipment.filter(item=>item!=='Caterpillar P-5000 power loader')},
    {...actor,canonStatus:'unreviewed-fixture'},
    {...actor,referenceUrl:undefined},
    {...actor,referenceUrl:42},
    {...actor,special:{...actor.special,name:'Unrelated loader action'}},
    {...actor,special:{...actor.special,type:'projectile'}}
  ])assert.equal(priority.resolveSelectedCombatSource(changed,'special')?.action.name,'P-5000 Power Loader','nonmatching metadata cannot claim the current-super exception');
  for(const changed of [
    {...actor,universe:'Alien'},
    {...actor,sourceUniverse:'Alien'},
    {...actor,id:'unknown-reviewed-super'},
    {...actor,sourceHeroId:'unknown-reviewed-super'}
  ])assert.equal(priority.resolveSelectedCombatSource(changed,'special'),null,'foreign or unknown identity cannot select the reviewed W10 super');
  assert.deepEqual(actor,before);
});


test('all four engines retain current Ripley’s raw special on their actual prepared actors while the three reviewed basics stay selected',()=>{
  const source=hero('ripley_aliens');
  for(const mode of ['RPG','Tactics','Smash','Fighter']){
    const e=make(mode,structuredClone(source)),actor=mode==='Fighter'?e.getActive('player'):e.heroes[0];
    assert.notEqual(actor,source,mode);assert.equal(actor.special.name,'Power Loader Smash',mode);assert.equal(actor.special.dmg,4.2,mode);
    assert.equal(actor.special.sourceSignatureKey,undefined,mode);assert.equal(priority.hasPreparedLegacyCombatSource(actor),false,mode);
    assert.equal(priority.hasSelectedCombatSource(actor,'special'),false,mode);
    for(const slot of ['simple','secondary','defense'])assert.equal(priority.hasSelectedCombatSource(actor,slot),true,mode+':'+slot);
    const profile=mode==='RPG'?e.getActionContext(actor,'special').profile
      :mode==='Smash'?e.getMeleeSuper(actor):mode==='Fighter'?e.getPersonalSuperSpec(actor).identity:null;
    const action=mode==='Tactics'?e.getActionDefinition(actor,'special'):mode==='RPG'?profile.action:profile.sourceAbility;
    if(mode==='Tactics'){
      const geometry=e.getAttackProfile(actor,'special');assert.equal(geometry.delivery,'melee');assert.equal(geometry.shape,'radial');
    }else{assert.equal(profile.name,'Power Loader Smash',mode);assert.equal(profile.multiplier,4.2,mode);}
    assert.equal(action.name,'Power Loader Smash',mode);assert.equal(action.type,'melee_aoe',mode);assert.equal(action.dmg,4.2,mode);
    assert.equal(action.sourceSignatureKey,undefined,mode);assert.notEqual(action.name,definitions10.ripley_aliens.name,mode);
    if(mode==='Fighter'){
      assert.equal(e.tryAction('player','super'),true);assert.equal(actor.action.identity.name,'Power Loader Smash');
      assert.equal(actor.action.identity.multiplier,4.2);assert.equal(actor.action.identity.sourceAbility.sourceSignatureKey,undefined);
    }
    assert.equal(actor.special.name,'Power Loader Smash',mode);assert.equal(actor.special.sourceSignatureKey,undefined,mode);
  }
});
