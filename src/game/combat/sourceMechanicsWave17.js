import nativeWave17B from './characterAnimationsWave17PartB.generated.json' with {type:'json'};
import nativeAnchorsWave17B from './nativeSuperAnchorsWave17PartB.generated.json' with {type:'json'};
import { beginSourceBubbleCaptureWave17, advanceSourceBubbleCaptureWave17, isSourceBubbleCapturedWave17 } from './sourceBubbleCaptureWave17.js';
// Exact source contracts, independent of canvas and wall-clock time.
// Strengths, spatial units and turn/beat presentation remain explicit arena adaptations.
export const SOURCE_MECHANICS_WAVE17 = Object.freeze({
  lute: 'melody-golden-lute-cardinal-step', mediGun: 'tf2-stock-medi-gun', uber: 'tf2-stock-ubercharge'
});
export const sourceIdWave17 = actor => actor?.sourceHeroId || actor?.sourceId || actor?.heroId || actor?.id;
export const runtimeIdWave17 = actor => actor?.battleId || actor?.runtimeId || actor?.id;
const live = actor => !!actor && actor.currentHp > 0 && actor.state !== 'dead';
export const isMelodyWave17 = actor => sourceIdWave17(actor) === 'crypt_necrodancer_melody' && actor.universe === 'Crypt of the NecroDancer';
export const isMedicWave17 = actor => sourceIdWave17(actor) === 'team_fortress_2_medic' && actor.universe === 'Team Fortress 2';
const metadata = (profile, key) => profile?.[key] ?? profile?.targeting?.[key] ?? profile?.action?.targeting?.[key] ?? profile?.action?.[key];
export const isMediGunProfileWave17 = profile => profile?.sourceHeroId === 'team_fortress_2_medic'
  && profile.universe === 'Team Fortress 2' && ['Medi Gun du Medic','Faisceau de soin du Medi Gun'].includes(profile.name) && profile.effect === 'heal' && metadata(profile, 'sourceMediGunWave17') === true;
export const isUberProfileWave17 = profile => profile?.sourceHeroId === 'team_fortress_2_medic'
  && profile.universe === 'Team Fortress 2' && profile.name==='ÜberCharge du Medi Gun stock' && profile.effect === 'guard' && Number(profile.multiplier ?? profile.dmg) === 0
  && metadata(profile, 'sourceUberWave17') === true;
const cellEqual = (a, b) => a && b && a.x === b.x && a.y === b.y && (a.z || 0) === (b.z || 0);
const adjacent = (a, b) => a && b && (a.z || 0) === (b.z || 0) && Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

// An accepted physical step is the sole lute trigger. No stationary cast,
// diagonal, jump, teleport or unaccepted preview acquires damage.
export function resolveGoldenLuteStepWave17(actor, from, to, targets, { accepted = false, onBeat = true, sequence = 0 } = {}) {
  if (!isMelodyWave17(actor) || !live(actor) || !accepted || !onBeat || !adjacent(from, to)) return [];
  return ['departure', 'arrival'].flatMap((phase, index) => {
    const origin = index ? to : from;
    return targets.filter(entry => live(entry.actor) && entry.actor !== actor && entry.hostile === true && adjacent(origin, entry.cell))
      .map(entry => ({ actor: entry.actor, targetId: runtimeIdWave17(entry.actor), sourceId: runtimeIdWave17(actor),
        phase, origin: { ...origin }, from: { ...from }, to: { ...to }, sequence,
        mechanism: SOURCE_MECHANICS_WAVE17.lute, acceptedMovement: true }));
  });
}

// Beam identity stays outside serializable actors. A matching runtime ID on a
// replacement body cannot inherit a channel or its active protection.
const mediGunPatientByOwnerWave17 = new WeakMap(), mediGunOwnersByPatientWave17 = new WeakMap();
function unlinkMediGunPatientWave17(medic) {
  const patient = mediGunPatientByOwnerWave17.get(medic);
  const owners = patient && mediGunOwnersByPatientWave17.get(patient);
  if (owners) { owners.delete(medic); if (!owners.size) mediGunOwnersByPatientWave17.delete(patient); }
  mediGunPatientByOwnerWave17.delete(medic);
}
function pinnedMediGunPatientWave17(medic, actors) {
  const patient = mediGunPatientByOwnerWave17.get(medic), state = medic?.sourceMediGunWave17;
  return patient && actors.includes(patient) && runtimeIdWave17(patient) === state?.patientRuntimeId
    && runtimeIdWave17(medic) === state?.medicRuntimeId ? patient : null;
}

export function startMediGunBeamWave17(medic, patient, { allied = false, range = 220, lineOfSight = true } = {}) {
  if (!isMedicWave17(medic) || !live(medic) || !live(patient) || patient === medic || !allied || !lineOfSight
    || !Number.isFinite(range) || range <= 0 || Math.hypot(patient.x - medic.x, patient.y - medic.y) > range) return false;
  unlinkMediGunPatientWave17(medic);
  mediGunPatientByOwnerWave17.set(medic, patient);
  let owners = mediGunOwnersByPatientWave17.get(patient);
  if (!owners) mediGunOwnersByPatientWave17.set(patient, owners = new Set());
  owners.add(medic);
  medic.sourceMediGunWave17 = { kind: SOURCE_MECHANICS_WAVE17.mediGun, patientRuntimeId: runtimeIdWave17(patient),
    medicRuntimeId: runtimeIdWave17(medic), charge: Math.min(1, Math.max(0, medic.sourceMediGunWave17?.charge || 0)),
    range, connected: true, elapsed: 0, uberRemaining: 0, chargeBuilt: 0,patientX:patient.x,patientY:patient.y };
  return true;
}
export function stopMediGunBeamWave17(medic, reason = 'released') {
  unlinkMediGunPatientWave17(medic);
  const state = medic?.sourceMediGunWave17;
  if (!state) return;
  if(state.uberRemaining>0)state.charge=0; // A cancelled activation cannot bank its unused invulnerability.
  state.connected = false; state.uberRemaining = 0; state.endedBy = reason;
}
export function advanceMediGunBeamWave17(medic, actors, seconds, { allied, lineOfSight = () => true, paused = false } = {}) {
  const state = medic?.sourceMediGunWave17;
  if (!state || !state.connected || paused || !Number.isFinite(seconds) || seconds <= 0) return null;
  const patient = pinnedMediGunPatientWave17(medic, actors);
  if (!isMedicWave17(medic) || !live(medic) || !live(patient) || !actors.includes(medic) || !allied?.(medic, patient)
    || !state.connected || !lineOfSight(medic, patient) || medic.state === 'hit' || medic.hitstun > 0 || medic.rpgControlTicks > 0
    || medic.sourceControlWave16?.active || patient.sourceControlWave16?.active || isBubbleActorImmobilizedWave17(medic) || isBubbleActorImmobilizedWave17(patient)
    || Math.hypot(patient.x - medic.x, patient.y - medic.y) > state.range) {
    stopMediGunBeamWave17(medic, 'beam-invalid'); return null;
  }
  const dt = Math.min(seconds, .1); // Runtime callers use simulation steps, never offline elapsed time.
  state.elapsed += dt;state.patientX=patient.x;state.patientY=patient.y;
  if (state.uberRemaining > 0) { state.uberRemaining = Math.max(0, state.uberRemaining - dt); if(state.uberRemaining<1e-9)state.uberRemaining=0; state.charge = state.uberRemaining / 8; }
  else {
    const rate = patient.currentHp < patient.maxHp * 1.425 ? .025 : .0125;
    const before = state.charge; state.charge = Math.min(1, state.charge + rate * dt); state.chargeBuilt += state.charge - before;
  }
  // Stock baseline healing is24 HP/s. The source game's out-of-combat
  // healing ramp is not claimed by this local combat implementation.
  const beforeHp = patient.currentHp;
  patient.currentHp = Math.min(patient.maxHp * 1.5, patient.currentHp + 24 * dt);
  if(patient.currentHp>patient.maxHp)patient.sourceMediGunOverhealWave17=true;
  return { patient, healed: patient.currentHp - beforeHp, charge: state.charge, uberRemaining: state.uberRemaining };
}
export function findChargedMedicWave17(patient, allies) {
  return allies.find(medic => isMedicWave17(medic) && live(medic) && live(patient) && medic !== patient
    && medic.sourceMediGunWave17?.connected && pinnedMediGunPatientWave17(medic, allies) === patient
    && medic.sourceMediGunWave17.charge >= 1 - 1e-9 && !(medic.sourceMediGunWave17.uberRemaining > 0)
    && Math.hypot(patient.x - medic.x, patient.y - medic.y) <= medic.sourceMediGunWave17.range) || null;
}
export function activateUberChargeWave17(patient, allies) {
  const medic = findChargedMedicWave17(patient, allies);
  if (!medic) return null;
  medic.sourceMediGunWave17.charge = 1; medic.sourceMediGunWave17.uberRemaining = 8;
  medic.sourceMediGunWave17.activationCount = (medic.sourceMediGunWave17.activationCount || 0) + 1;
  return medic;
}
export function hasStockUberProtectionWave17(actor, actors, allied = () => false) {
  if (!live(actor)) return false;
  return actors.some(medic => {
    const state = medic.sourceMediGunWave17;
    if (!isMedicWave17(medic) || !live(medic) || !state?.connected || !(state.uberRemaining > 0) || medic.state==='hit' || medic.hitstun>0 || medic.rpgControlTicks>0 || medic.sourceControlWave16?.active || isBubbleActorImmobilizedWave17(medic)) return false;
    const patient = pinnedMediGunPatientWave17(medic, actors);
    return live(patient) && allied(medic, patient) && Math.hypot(patient.x - medic.x, patient.y - medic.y) <= state.range
      && (actor === medic || actor === patient);
  });
}

export function sourceCellWave17(actor, { grid = false, groundY = null, grounded = null, size = 64 } = {}) {
  const support=typeof grounded==='function'?grounded(actor):null;
  if(grounded&&!support)return null;
  if(support)return{x:Math.floor(actor.x/size),y:0,z:Number(support.y)||0};
  if (grid) return { x: actor.gridX, y: actor.gridY, z: Number(actor.gridZ) || 0 };
  if (!Number.isFinite(actor.x) || !Number.isFinite(actor.y) || groundY !== null && Math.abs(actor.y - groundY) > 2) return null;
  return { x: Math.floor(actor.x / size), y: groundY !== null ? 0 : Math.floor(actor.y / size), z: 0 };
}
export function advanceSourceMechanicsWave17(engine, teams, seconds, options = {}) {
  registerSourceWorldWave17(engine,teams);
  const actors = teams.flat().filter(Boolean);
  if(seconds>0)for(const actor of actors)if(isSourceKittenWave17(actor))actor.sourceKittenVisualSecondsWave17=(actor.sourceKittenVisualSecondsWave17||0)+seconds;
  advanceBubbleCapturesWave17(actors,seconds,{turnBased:options.grid===true});
  advancePhotographicEvidenceWave17(actors,seconds);
  for(const actor of actors){const action=actor.action,profile=action?.abilityProfile||action?.superProfile||action?.identity;if(action&&!action.sourceLuteMoveStartedWave17&&isMelodyWave17(actor)&&metadata(profile,'sourceGoldenLuteWave17')===true){action.sourceLuteMoveStartedWave17=true;beginForcedLuteStepWave17(actor,profile,action.facing||actor.facing);}}
  advanceForcedLuteStepsWave17(actors,seconds,{...options,width:engine.width});
  const allied = (a, b) => teams.some(team => team.includes(a) && team.includes(b));
  for(const actor of actors){if(!actor.sourceMediGunOverhealWave17||!(seconds>0)||!live(actor))continue;if(actor.currentHp<=actor.maxHp){actor.sourceMediGunOverhealWave17=false;continue;}
    const maintained=actors.some(medic=>isMedicWave17(medic)&&live(medic)&&medic.sourceMediGunWave17?.connected&&pinnedMediGunPatientWave17(medic,actors)===actor&&Math.hypot(medic.x-actor.x,medic.y-actor.y)<=medic.sourceMediGunWave17.range);
    if(!maintained){actor.currentHp=Math.max(actor.maxHp,actor.currentHp-actor.maxHp*.5/15*seconds);if(actor.currentHp<=actor.maxHp)actor.sourceMediGunOverhealWave17=false;}}
  for(const actor of actors){if(!isSourceKittenWave17(actor)||!live(actor)||isBubbleActorImmobilizedWave17(actor)||!(seconds>0)||options.grid)continue;
    const source=actors.find(unit=>sourceIdWave17(unit)==='tail_concerto_waffle'&&live(unit));
    if(!source)continue;
    const direction=actor.x<source.x?-1:1,position=Math.max(22,Math.min(engine.width-22,actor.x+direction*32*seconds));
    const moved=Math.abs(position-actor.x)>1e-9;actor.x=position;if(Number.isFinite(actor.homeX))actor.homeX=position;actor.facing=direction;actor.state=moved?'run':'idle';actor.stateTimer=2;actor.action=null;actor.actionPending=false;
  }
  for (const actor of actors) {
    const weaponAction=actor.action?.abilityProfile||actor.action?.superProfile||actor.action?.identity;
    if(actor.sourceMediGunWave17?.connected&&weaponAction&&!isMediGunProfileWave17(weaponAction))stopMediGunBeamWave17(actor,'another-command');
    if(actor.sourceKittenReleaseSecondsWave17>0&&seconds>0)actor.sourceKittenReleaseSecondsWave17=Math.max(0,actor.sourceKittenReleaseSecondsWave17-seconds);
    if (isMedicWave17(actor)) advanceMediGunBeamWave17(actor, actors, seconds, { allied });
    if (!isMelodyWave17(actor) || options.grid && actor.terrainMotion) continue;
    const next = sourceCellWave17(actor, options), prior = actor.sourceLuteCellWave17;
    actor.sourceLuteCellWave17 = next;
    if (!prior || !next || cellEqual(prior, next)) continue;
    const targets = actors.filter(unit => unit !== actor).map(unit => ({ actor: unit, hostile: !allied(actor, unit), cell: sourceCellWave17(unit, options) }));
    const sequence = (actor.sourceLuteStepSequenceWave17 || 0) + 1;
    actor.sourceLuteStepSequenceWave17 = sequence;
    const contacts = resolveGoldenLuteStepWave17(actor, prior, next, targets, { accepted: true, sequence });
    for (const contact of contacts) options.applyLute?.(actor, contact.actor, contact);
    actor.sourceLuteLastStepWave17 = { from: prior, to: next, contacts: contacts.map(({ actor: _, ...contact }) => contact), sequence };
  }
}
export function projectMediGunNozzleWave17(medic,height=72) {
  if(!isMedicWave17(medic)||!Number.isFinite(medic.x)||!Number.isFinite(medic.y)||!(height>0))return null;
  const asset=nativeWave17B.entries.find(entry=>entry.heroId==='team_fortress_2_medic'&&entry.universe==='Team Fortress 2');
  const point=nativeAnchorsWave17B.team_fortress_2_medic?.super?.[2];
  if(!asset||!point||!Number.isFinite(point.x)||!Number.isFinite(point.y))return null;
  const row=asset.phases.super.row,scale=height/256*Math.max(.5,Math.min(3,Number(asset.normalization?.rows?.[row]?.renderScale)||1));
  const beamFacing=Number.isFinite(medic.sourceMediGunWave17?.patientX)?(medic.sourceMediGunWave17.patientX<medic.x?-1:1):medic.facing;
  return{x:medic.x+(point.x-128)*scale*(beamFacing<0?-1:1),y:medic.y+(point.y-(asset.normalization?.baseline||244))*scale,
    nativePoint:{...point},row,col:2,sheet:asset.sheet,sheetSha256:asset.sha256,height,scale,source1to1Verified:false};
}
export function drawMediGunBeamsWave17(ctx, actors, {height=()=>72,exclude=null}={}) {
  for (const medic of actors) {
    const state = medic.sourceMediGunWave17;
    if (medic===exclude||!state?.connected || !isMedicWave17(medic) || !live(medic)) continue;
    const patient = pinnedMediGunPatientWave17(medic, actors);
    if (!live(patient) || Math.hypot(patient.x - medic.x, patient.y - medic.y) > state.range) continue;
    const origin=projectMediGunNozzleWave17(medic,typeof height==='function'?height(medic):height);
    if(!origin)continue;
    const patientHeight=typeof height==='function'?height(patient):height;
    ctx.save(); ctx.strokeStyle = state.uberRemaining > 0 ? '#ffb57c' : '#e85245'; ctx.lineWidth = state.uberRemaining > 0 ? 5 : 3;
    ctx.beginPath(); ctx.moveTo(origin.x,origin.y); ctx.lineTo(patient.x,patient.y-patientHeight*.38); ctx.stroke(); ctx.restore();
  }
}

// Native capture owns no lifted body or alternate faction. Keep object
// ownership outside serializable actors and resolve it again at input time.
const bubbleOwnersWave17 = new WeakMap(), worldsWave17 = new WeakMap();
export function registerSourceWorldWave17(engine, teams) {
  const current = () => engine.teams && engine.getActive
    ? [engine.getActive('player'),engine.getActive('cpu')].filter(Boolean)
    : [...(engine.heroes||[]),...(engine.enemies||[])];
  for(const actor of teams.flat())if(actor)worldsWave17.set(actor,current);
}
export function armBubbleCaptureWave17(source,target,profile,options={}) {
  const state=beginSourceBubbleCaptureWave17(source,target,profile,options);
  if(!state)return false;
  target.sourceBubbleCaptureWave17=state;target.sourceBubbleCaptureVisualSecondsWave17=0;bubbleOwnersWave17.set(target,source);return true;
}
export function isBubbleActorImmobilizedWave17(actor) {
  const state=actor?.sourceBubbleCaptureWave17,owner=actor&&bubbleOwnersWave17.get(actor);
  if(!state?.active||!owner)return false;
  const current=worldsWave17.get(actor)?.();
  return isSourceBubbleCapturedWave17(state,{sourceAlive:live(owner),targetAlive:live(actor),
    sourcePresent:!current||current.includes(owner),targetPresent:!current||current.includes(actor),
    sourceRuntimeId:runtimeIdWave17(owner),targetRuntimeId:runtimeIdWave17(actor)});
}
export function advanceBubbleCapturesWave17(actors, seconds, {turnBased=false}={}) {
  for(const actor of actors){const state=actor?.sourceBubbleCaptureWave17;if(!state?.active)continue;const owner=bubbleOwnersWave17.get(actor);
    if(seconds>0)actor.sourceBubbleCaptureVisualSecondsWave17=(actor.sourceBubbleCaptureVisualSecondsWave17||0)+seconds;
    actor.sourceBubbleCaptureWave17=advanceSourceBubbleCaptureWave17(state,turnBased?0:seconds,{sourceAlive:live(owner),targetAlive:live(actor),sourcePresent:actors.includes(owner),targetPresent:actors.includes(actor)});if(!actor.sourceBubbleCaptureWave17.active&&isSourceKittenWave17(actor))actor.sourceKittenReleaseSecondsWave17=.5;}
}
export function drawBubbleCapturesWave17(ctx,actors){for(const actor of actors){if(!isBubbleActorImmobilizedWave17(actor))continue;ctx.save();ctx.strokeStyle='#a7e5fc';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(actor.x,actor.y-25,24,34,0,0,Math.PI*2);ctx.stroke();ctx.restore();}}

export function isOkarunAllOutProfileWave17(profile) {
  return profile?.sourceHeroId==='oken_dandadan'&&profile.universe==='Dandadan'
    &&metadata(profile,'sourceOkarunAllOutWave17')===true&&metadata(profile,'maxAllOutUses')===2;
}
export function canUseOkarunAllOutWave17(actor,profile) {
  if(!isOkarunAllOutProfileWave17(profile))return true;
  return live(actor)&&sourceIdWave17(actor)==='oken_dandadan'&&actor.universe==='Dandadan'&&(Number(actor.sourceOkarunAllOutUsesWave17)||0)<2;
}
export function consumeOkarunAllOutWave17(actor,profile) {
  if(!canUseOkarunAllOutWave17(actor,profile))return false;
  if(isOkarunAllOutProfileWave17(profile))actor.sourceOkarunAllOutUsesWave17=(Number(actor.sourceOkarunAllOutUsesWave17)||0)+1;
  return true;
}

export function isJadeInformationProfileWave17(profile) {
  return profile?.sourceHeroId==='beyond_good_evil_jade'&&profile.universe==='Beyond Good & Evil'
    &&profile.name==='Jade photographie les preuves'&&metadata(profile,'informationOnly')===true&&Number(profile.multiplier??profile.dmg)===0;
}
export function revealPhotographicEvidenceWave17(source,target,profile,{hostile=false}={}) {
  if(!isJadeInformationProfileWave17(profile)||sourceIdWave17(source)!=='beyond_good_evil_jade'||!live(source)||!live(target)||!hostile||source===target)return false;
  target.sourcePhotographicEvidenceWave17={sourceHeroId:'beyond_good_evil_jade',sourceRuntimeId:runtimeIdWave17(source),targetRuntimeId:runtimeIdWave17(target),remaining:3,active:true,informationOnly:true};
  return true;
}
export function advancePhotographicEvidenceWave17(actors,seconds){for(const actor of actors){const state=actor.sourcePhotographicEvidenceWave17;if(!state?.active)continue;const source=actors.find(unit=>runtimeIdWave17(unit)===state.sourceRuntimeId);if(!live(source)||!live(actor)){state.active=false;state.remaining=0;continue;}if(seconds>0){state.remaining=Math.max(0,state.remaining-seconds);state.active=state.remaining>1e-9;}}}
export function drawPhotographicEvidenceWave17(ctx,actors){for(const actor of actors){if(!actor.sourcePhotographicEvidenceWave17?.active)continue;ctx.save();ctx.strokeStyle='#b8fff0';ctx.lineWidth=2;const x=actor.x-24,y=actor.y-58;ctx.beginPath();ctx.moveTo(x,y+10);ctx.lineTo(x,y);ctx.lineTo(x+10,y);ctx.moveTo(x+38,y);ctx.lineTo(x+48,y);ctx.lineTo(x+48,y+10);ctx.moveTo(x,y+38);ctx.lineTo(x,y+48);ctx.lineTo(x+10,y+48);ctx.moveTo(x+38,y+48);ctx.lineTo(x+48,y+48);ctx.lineTo(x+48,y+38);ctx.stroke();ctx.restore();}}

export function beginForcedLuteStepWave17(actor,profile,direction=actor?.facing||1){if(!isMelodyWave17(actor)||metadata(profile,'sourceGoldenLuteWave17')!==true)return false;actor.sourceForcedLuteStepWave17={remaining:64,direction:direction<0?-1:1};return true;}
export function advanceForcedLuteStepsWave17(actors,seconds,{groundY=null,grounded=null,width=Infinity}={}){if(!(seconds>0))return;for(const actor of actors){const step=actor.sourceForcedLuteStepWave17;if(!step)continue;if(!live(actor)||actor.hitstun>0||actor.rpgControlTicks>0||isBubbleActorImmobilizedWave17(actor)||grounded&&!grounded(actor)||groundY!==null&&Math.abs(actor.y-groundY)>2){delete actor.sourceForcedLuteStepWave17;continue;}const wanted=Math.min(step.remaining,192*seconds)*step.direction;
 const obstacle=actors.some(unit=>unit!==actor&&live(unit)&&Math.abs(unit.y-actor.y)<30&&Math.abs(unit.x-(actor.x+wanted))<42);
 if(obstacle||actor.x+wanted<20||actor.x+wanted>width-20){delete actor.sourceForcedLuteStepWave17;continue;}actor.x+=wanted;step.remaining-=Math.abs(wanted);if(step.remaining<=1e-9)delete actor.sourceForcedLuteStepWave17;}}

// A connected stock beam is carried by the real Medic's Medi Gun pose. The
// attack row of his base16 is a different stock weapon (Syringe Gun).
export function getSourceNativeSupportViewWave17(actor) {
  if(!isMedicWave17(actor)||!actor.sourceMediGunWave17?.connected||!live(actor))return actor;
  return {...actor,facing:Number.isFinite(actor.sourceMediGunWave17.patientX)?(actor.sourceMediGunWave17.patientX<actor.x?-1:1):actor.facing,state:'special',presentationPhase:'super',presentationProgress:.65,presentationImpactProgress:.41,
    presentationFrame:{row:7,col:2},sourceMedicBeamPoseWave17:true};
}

export const isSourceKittenWave17=actor=>actor?.universe==='Tail Concerto'&&(actor.sourceEnemyId||sourceIdWave17(actor))==='tail_concerto_red_vest_kitten';

export function clearSourceMechanicsWave17(actors,reason='dispose') {
 for(const actor of actors.filter(Boolean)){
  for(const owner of [...(mediGunOwnersByPatientWave17.get(actor)||[])])stopMediGunBeamWave17(owner,reason);
  stopMediGunBeamWave17(actor,reason);delete actor.sourceForcedLuteStepWave17;
  if(actor.sourceBubbleCaptureWave17?.active)actor.sourceBubbleCaptureWave17=advanceSourceBubbleCaptureWave17(actor.sourceBubbleCaptureWave17,0,{released:true});
  if(actor.sourcePhotographicEvidenceWave17){actor.sourcePhotographicEvidenceWave17.active=false;actor.sourcePhotographicEvidenceWave17.remaining=0;}
  actor.rpgGyrodiskActionWave17=null;actor.tacticsGyrodiskActionWave17=null;actor.sourceRpgLuteMoveWave17=null;}
}
