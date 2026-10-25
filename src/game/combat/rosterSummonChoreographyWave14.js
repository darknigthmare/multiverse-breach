import { projectNativeSummonEffectOriginWave13 } from './rosterSummonChoreographyWave13.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 as sources } from './combatSourceDefinitionsWave14.js';

const performers = [
  [
    "lotr-aragorn-wave14",
    "aragorn_lotr",
    "Aragorn",
    "melee"
  ],
  [
    "lotr-legolas-wave14",
    "legolas_lotr",
    "Legolas",
    "bow"
  ],
  [
    "darksouls-solaire-wave14",
    "dark_souls_solaire",
    "Solaire",
    "support"
  ],
  [
    "halo-noble-six-wave14",
    "noble_six",
    "Noble Six",
    "shot"
  ],
  [
    "masseffect-mordin-wave14",
    "mordin",
    "Mordin Solus",
    "omnitool"
  ],
  [
    "tombraider-lara-wave14",
    "lara_croft_tr",
    "Lara Croft",
    "bow"
  ]
];
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE14 = Object.freeze(performers.map(([id, heroId, entityName, role], index) => Object.freeze({
  id: id + '-native', universe: sources[heroId].universe, entityName,
  actionName: sources[heroId].name,
  sourceReference: sources[heroId].sourceWork + '. Real same-universe roster reinforcement with sixteen newly drawn native poses. Bounded engine adaptation, not certified source frames.',
  path: role === 'melee' ? 'roster-blade-rush' : 'roster-cover-fire',
  arrival: .30 + index * .009, travelTicks: 21 + index % 4, holdTicks: 28 + index % 4,
  scale: 1, maxSize: role === 'support' ? 112 : 132, offsetX: 82 + index * 2,
  preparation: `roster-wave14-${heroId}-ready`, attack: `roster-wave14-${heroId}-${role}`,
  recovery: 'roster-ground-return', muzzle: Object.freeze([0, -.45]),
  ...(role === 'melee' ? { contactDistance: 48 } : {}),
  fidelity: 'authored-native-roster-motion-adaptation'
})));
const ids = new Set(performers.map(([id]) => id));
const offensive = new Set(performers.filter(([, , , role]) => role !== 'support').map(([id]) => id));
export const usesConfirmedSummonContactWave14 = asset => offensive.has(asset?.id);
export function projectNativeSummonEffectOriginWave14(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave13(choreography, asset, frame);
  if (!projected || !ids.has(asset?.id)) return projected;
  return { ...projected, nativeMuzzleActive: !!asset.effectAnchors?.[frame?.phase]?.[frame?.col] };
}
export function drawRosterSummonCueWave14(ctx, state, cue) {
  if (!cue?.kind?.startsWith('roster-wave14-')) return false;
  // Native poses supply the ranger blade, physical bows, MA37 and wrist omni-tool.
  // Solaire’s shield support has no offensive cue, lightning or magical shield.
  if (cue.stage === 'preparation' || cue.kind.endsWith('-support')) return true;
  ctx.strokeStyle = '#ffe0a1'; ctx.lineWidth = 2;
  if (cue.stage === 'travel' && ['-shot', '-bow', '-omnitool'].some(role => cue.kind.endsWith(role)) && state.nativeMuzzleActive) {
    const progress = Math.max(0, Math.min(1, cue.progress));
    const center = { x: state.target.x, y: state.target.y - state.height * .095 };
    const x = state.origin.x + (center.x - state.origin.x) * progress;
    const y = state.origin.y + (center.y - state.origin.y) * progress;
    ctx.beginPath();
    if (cue.kind.endsWith('-omnitool')) { ctx.strokeStyle = '#ff9a42'; ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2); }
    else { ctx.moveTo(x - state.side * (cue.kind.endsWith('-bow') ? 10 : 6), y); ctx.lineTo(x, y); }
    ctx.stroke();
  } else if (cue.stage === 'contact') {
    for (const target of state.targets) {
      ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
        5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  return true;
}
