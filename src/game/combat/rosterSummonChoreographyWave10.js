import { projectNativeSummonEffectOriginWave9 } from './rosterSummonChoreographyWave9.js';

export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE10 = [
  {
    "id": "matrix-trinity-native",
    "universe": "The Matrix",
    "entityName": "Trinity",
    "actionName": "Salve aux deux Beretta",
    "sourceReference": "The Matrix Reloaded (2003). Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.3,
    "travelTicks": 20,
    "holdTicks": 28,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 82,
    "preparation": "roster-wave10-trinity-ready",
    "attack": "roster-wave10-trinity-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "stargate-tealc-native",
    "universe": "Stargate",
    "entityName": "Teal'c",
    "actionName": "Tir de lance Jaffa",
    "sourceReference": "Stargate SG-1 season 4 (2000–2001). Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.309,
    "travelTicks": 21,
    "holdTicks": 29,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 84,
    "preparation": "roster-wave10-tealc-ready",
    "attack": "roster-wave10-tealc-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "half-life-alyx-native",
    "universe": "Half-Life",
    "entityName": "Alyx Vance",
    "actionName": "Tir du pistolet d’Alyx",
    "sourceReference": "Half-Life 2 (2004). Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.318,
    "travelTicks": 22,
    "holdTicks": 30,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 86,
    "preparation": "roster-wave10-alyx-ready",
    "attack": "roster-wave10-alyx-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "fallout-nick-native",
    "universe": "Fallout",
    "entityName": "Nick Valentine",
    "actionName": "Tir du revolver artisanal de Nick",
    "sourceReference": "Fallout 4 (2015). Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.327,
    "travelTicks": 23,
    "holdTicks": 31,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 88,
    "preparation": "roster-wave10-nick-ready",
    "attack": "roster-wave10-nick-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "aliens-hicks-native",
    "universe": "Aliens",
    "entityName": "Corporal Hicks",
    "actionName": "Rafale M41A de Hicks",
    "sourceReference": "Aliens (1986). Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.336,
    "travelTicks": 24,
    "holdTicks": 28,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 90,
    "preparation": "roster-wave10-hicks-ready",
    "attack": "roster-wave10-hicks-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "payday-chains-native",
    "universe": "Payday",
    "entityName": "Chains",
    "actionName": "Couverture lourde de Chains",
    "sourceReference": "PAYDAY 2 (2013), KSP-equipped Enforcer loadout. Real same-universe roster partner; native body and physical equipment. One authored accepted impact; no repeated damage or post-impact ballistic stream.",
    "path": "roster-cover-fire",
    "arrival": 0.345,
    "travelTicks": 25,
    "holdTicks": 29,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 92,
    "preparation": "roster-wave10-chains-ready",
    "attack": "roster-wave10-chains-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "ghostbusters-egon-native",
    "universe": "Ghostbusters",
    "entityName": "Egon Spengler",
    "actionName": "Lecture du PKE Meter",
    "sourceReference": "Ghostbusters (1984). Real same-universe roster partner; native body and physical equipment. Support gestures and information only, never a damaging scan or volley.",
    "path": "roster-cover-fire",
    "arrival": 0.354,
    "travelTicks": 26,
    "holdTicks": 30,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 94,
    "preparation": "roster-wave10-egon-ready",
    "attack": "roster-wave10-egon-support",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "left4dead-coach-native",
    "universe": "Left 4 Dead",
    "entityName": "Coach",
    "actionName": "Consignes de Coach",
    "sourceReference": "Left 4 Dead 2 (2009). Real same-universe roster partner; native body and physical equipment. Support gestures and information only, never a damaging scan or volley.",
    "path": "roster-cover-fire",
    "arrival": 0.363,
    "travelTicks": 27,
    "holdTicks": 31,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 96,
    "preparation": "roster-wave10-coach-ready",
    "attack": "roster-wave10-coach-support",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  }
].map(entry => Object.freeze({ ...entry, fidelity: 'authored-native-roster-motion-adaptation', muzzle: Object.freeze(entry.muzzle) }));

const ids = new Set(ROSTER_SUMMON_CHOREOGRAPHIES_WAVE10.map(entry => entry.id.replace(/-native$/, '')));
const offensive = new Set(['matrix-trinity','stargate-tealc','half-life-alyx','fallout-nick','aliens-hicks','payday-chains']);
export const usesConfirmedSummonContactWave10 = asset => offensive.has(asset?.id);
export function projectNativeSummonEffectOriginWave10(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave9(choreography, asset, frame);
  return ids.has(asset?.id) ? { ...projected, nativeMuzzleActive: !!asset.effectAnchors?.[frame?.phase]?.[frame?.col] } : projected;
}
export function drawRosterSummonCueWave10(ctx, state, cue) {
  if (!cue.kind.startsWith('roster-wave10-')) return false;
  if (cue.stage === 'preparation') return true;
  if (cue.kind.endsWith('-support')) {
    // UI acknowledgement under the native support performer; no magical scan,
    // voice wave, projectile, shield body or new equipment is constructed.
    if (cue.stage === 'contact') {
      ctx.strokeStyle = '#bad1ab'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(state.performer.x, state.performer.y - 2,
        10 + state.attackProgress * 3, 3, 0, 0, Math.PI * 2); ctx.stroke();
    }
    return true;
  }
  ctx.strokeStyle = cue.kind.includes('tealc') ? '#ffbb62' : '#ffe0a1'; ctx.lineWidth = 2;
  if (cue.stage === 'travel' && state.nativeMuzzleActive) {
    const progress = Math.max(0, Math.min(1, cue.progress));
    const center = { x: state.target.x, y: state.target.y - state.height * 0.095 };
    const x = state.origin.x + (center.x - state.origin.x) * progress;
    const y = state.origin.y + (center.y - state.origin.y) * progress;
    ctx.beginPath(); ctx.moveTo(x - state.side * 6, y); ctx.lineTo(x, y); ctx.stroke();
  } else if (cue.stage === 'contact') {
    // The engines supply only HP-lowering accepted-hit snapshots here.
    for (const target of state.targets) {
      ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
        5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  return true;
}
