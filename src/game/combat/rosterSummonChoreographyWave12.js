import { projectNativeSummonEffectOriginWave11 } from './rosterSummonChoreographyWave11.js';

// W12 additions only. Historical projection and scene geometry remain unchanged.
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE12 = [
  {
    "id": "silent-hill-cybil-native",
    "universe": "Silent Hill",
    "entityName": "Cybil Bennett",
    "actionName": "Tir de couverture de Cybil",
    "sourceReference": "Silent Hill (1999), agente de police de Brahms. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-cover-fire",
    "arrival": 0.3,
    "travelTicks": 21,
    "holdTicks": 28,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 82,
    "preparation": "roster-wave12-cybil-ready",
    "attack": "roster-wave12-cybil-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "dino-crisis-regina-native",
    "universe": "Dino Crisis",
    "entityName": "Regina",
    "actionName": "Tir précis de Regina",
    "sourceReference": "Dino Crisis (1999), tenue tactique d’origine. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-cover-fire",
    "arrival": 0.309,
    "travelTicks": 22,
    "holdTicks": 29,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 84,
    "preparation": "roster-wave12-regina-ready",
    "attack": "roster-wave12-regina-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "predator-dutch-native",
    "universe": "Predator",
    "entityName": "Dutch Schaefer",
    "actionName": "Rafale au M16 de Dutch",
    "sourceReference": "Predator (1987), Major Alan Dutch Schaefer. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-cover-fire",
    "arrival": 0.318,
    "travelTicks": 23,
    "holdTicks": 30,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 86,
    "preparation": "roster-wave12-dutch-ready",
    "attack": "roster-wave12-dutch-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "evil-dead-ash-native",
    "universe": "Evil Dead",
    "entityName": "Ash Williams",
    "actionName": "Enchaînement à la tronçonneuse d’Ash",
    "sourceReference": "Army of Darkness (1992), Ash Williams avant le retour à S-Mart. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-blade-rush",
    "arrival": 0.327,
    "travelTicks": 24,
    "holdTicks": 31,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 88,
    "preparation": "roster-wave12-ash-ready",
    "attack": "roster-wave12-ash-melee",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ],
    "contactDistance": 48
  },
  {
    "id": "dead-space-isaac-native",
    "universe": "Dead Space",
    "entityName": "Isaac Clarke",
    "actionName": "Tir ajusté du Plasma Cutter",
    "sourceReference": "Dead Space (2008), Isaac Clarke et RIG d’ingénieur niveau 3. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-cover-fire",
    "arrival": 0.336,
    "travelTicks": 21,
    "holdTicks": 28,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 90,
    "preparation": "roster-wave12-isaac-ready",
    "attack": "roster-wave12-isaac-shot",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  },
  {
    "id": "futurama-leela-native",
    "universe": "Futurama",
    "entityName": "Leela",
    "actionName": "Enchaînement de Leela",
    "sourceReference": "Futurama, série Fox originale (1999–2003), Leela pilote et combattante. Real same-universe roster reinforcement; sixteen newly drawn native poses. One engine-accepted impact only; visuals never add gameplay damage.",
    "path": "roster-ground-rush",
    "arrival": 0.345,
    "travelTicks": 24,
    "holdTicks": 29,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 92,
    "preparation": "roster-wave12-leela-ready",
    "attack": "roster-wave12-leela-melee",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ],
    "contactDistance": 38
  },
  {
    "id": "rickmorty-birdperson-native",
    "universe": "Rick & Morty",
    "entityName": "Birdperson",
    "actionName": "Garde ailée de Birdperson",
    "sourceReference": "Rick and Morty, saison 2 (2015), Birdperson avant sa transformation en Phoenixperson. Real same-universe roster reinforcement; sixteen newly drawn native poses. Physical wing guard, zero offensive damage, no beam or magical body.",
    "path": "roster-cover-fire",
    "arrival": 0.354,
    "travelTicks": 23,
    "holdTicks": 30,
    "scale": 1,
    "maxSize": 132,
    "offsetX": 94,
    "preparation": "roster-wave12-birdperson-ready",
    "attack": "roster-wave12-birdperson-support",
    "recovery": "roster-ground-return",
    "muzzle": [
      0,
      -0.45
    ]
  }
].map(entry => Object.freeze({ ...entry, fidelity: 'authored-native-roster-motion-adaptation', muzzle: Object.freeze(entry.muzzle) }));

const ids = new Set(ROSTER_SUMMON_CHOREOGRAPHIES_WAVE12.map(entry => entry.id.replace(/-native$/, '')));
const offensive = new Set(['silent-hill-cybil', 'dino-crisis-regina', 'predator-dutch', 'evil-dead-ash', 'dead-space-isaac', 'futurama-leela']);
export const usesConfirmedSummonContactWave12 = asset => offensive.has(asset?.id);
export function projectNativeSummonEffectOriginWave12(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave11(choreography, asset, frame);
  if (!projected || !ids.has(asset?.id)) return projected;
  return { ...projected, nativeMuzzleActive: !!asset.effectAnchors?.[frame?.phase]?.[frame?.col] };
}
export function drawRosterSummonCueWave12(ctx, state, cue) {
  if (!cue?.kind?.startsWith('roster-wave12-')) return false;
  // The native body performs preparation and biological wing guard. No code
  // draws a surrogate limb, protective wing, artificial wind or magical beam.
  if (cue.stage === 'preparation' || cue.kind.endsWith('-support')) return true;
  ctx.strokeStyle = cue.kind.includes('isaac') ? '#9adce5' : '#ffe0a1'; ctx.lineWidth = 2;
  if (cue.stage === 'travel' && cue.kind.endsWith('-shot') && state.nativeMuzzleActive) {
    const progress = Math.max(0, Math.min(1, cue.progress));
    const center = { x: state.target.x, y: state.target.y - state.height * 0.095 };
    const x = state.origin.x + (center.x - state.origin.x) * progress;
    const y = state.origin.y + (center.y - state.origin.y) * progress;
    ctx.beginPath(); ctx.moveTo(x - state.side * 6, y); ctx.lineTo(x, y); ctx.stroke();
  } else if (cue.stage === 'contact') {
    // Only engine-supplied HP-lowering accepted contact snapshots reach here.
    for (const target of state.targets) {
      ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
        5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  return true;
}
