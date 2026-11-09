import { drawStageAnimationWave16, getStageAnimationWave16Geometry } from './stageAnimationCatalogWave16.js';

// Ten empty local studies planned before production. Named settings are source
// facts; these outlines, ordinary-wind/maintenance cycles and dimensions are
// original adaptations. No actor, sound recording, collision or hazard is added.
const scene = (id, universe, sourceWork, sourceReference, sourceScene, scenePattern, excludedScenePattern, color, periodSeconds, blueprint) => Object.freeze({
  id, universes: Object.freeze([universe]), sourceWork, sourceReference, sourceScene,
  scenePattern, excludedScenePattern, continuity: sourceWork, mechanism: id, color, periodSeconds,
  blueprint: Object.freeze(blueprint.map(part => Object.freeze(part))),
  animationWave: 17, localBackdrops: Object.freeze({}), renderingKind: 'authored-mechanism',
  sourceAccess: 'Location references and search receipts documented in the pre-production W17 stage plan; exact props and source animation frames unverified.',
  sceneEvidence: 'Empty original architectural or landscape study at the declared work and location. Geometry, palette, dimensions and looping ordinary-wind or maintenance timing are adapted. No official frames, recorded soundtrack or exact set measurements are claimed.',
  animationProvenance: 'authored-scene-architecture-landscape-geometry-and-timing',
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  gameplayEffect: 'none', sourceVisualValidation: 'not-validated-1:1',
  source1to1Verified: false, networkVerified: false, fidelityVerified: false, officialSourceFrames: false
});

export const STAGE_ANIMATION_WAVE_17 = Object.freeze([
  scene('w17-tomba-dwarf-village-awning', 'Tomba', 'Tomba! (1997)',
    'https://tomba.fandom.com/wiki/Dwarf_Village', 'Dwarf Village — original 1997 empty timber doorway and cloth awning', /dwarf village.*(?:1997|original).*(?:awning|cloth)|tomba 1997.*dwarf.*cloth/i,
    /tomba.?2|1999|special edition|2024|destroyed/i, '#c4b28e', 23,
    [['roof', -.3, -.22, .6, .16], ['box', -.24, -.06, .48, .27], ['awning', -.28, -.03, .56, .1, 5, .014], ['beam', -.33, .22, .66, .025]]),
  scene('w17-spyro-summer-forest-water', 'Spyro', 'Spyro Reignited Trilogy, Spyro 2: Ripto’s Rage! (2018)',
    'https://www.gamepressure.com/spyro-reignited-trilogy/summer-forest/z5bb0a', 'Summer Forest — Reignited 2018 empty stone bank and pool ripples', /summer forest.*(?:reignited|2018).*(?:pool|ripples|stone bank)/i,
    /playstation 1999|original 1999|autumn plains|winter tundra|skylanders|destroyed/i, '#a9c9a1', 19,
    [['pool', -.3, .02, .6, .17, 4], ['sea', -.26, .06, .52, .09, 3, .8], ['bank', -.33, -.05, .21, .19, 1], ['bridge', .09, -.04, .23, .1, 2], ['reeds', -.31, -.08, .07, .14, 3]]),
  scene('w17-rayman-castle-rock-pennants', 'Rayman', 'Rayman Legends (2013)',
    'https://raymanpc.com/wiki/en/Castle_Rock', 'Castle Rock — original 2013 empty battlement, cordage and pennants', /castle rock.*(?:2013|original).*(?:battlement|pennant|cordage)/i,
    /8.bit|living dead party|retold|2026|destroyed/i, '#c2b59a', 17,
    [['arch', -.25, -.22, .5, .44], ['bars', -.29, -.25, .58, .075, 7], ['guy', -.25, -.16, .5, .03, .016], ['polecloth', -.31, -.2, .13, .12, .021], ['polecloth', .22, -.2, .1, .1, -.017], ['steps', -.31, .2, .62, .04, 3]]),
  scene('w17-bge-mammago-maintenance-vent', 'Beyond Good & Evil', 'Beyond Good & Evil (2003)',
    'https://www.mobygames.com/game/11290/beyond-good-evil/screenshots/windows/781618/', 'Mammago Garage — original 2003 empty maintenance bay and ventilation', /mammago.*2003.*(?:maintenance bay|ventilation)|garage mammago.*2003.*ventilation/i,
    /anniversary|2024|beyond good.*evil 2|lighthouse|beluga|tow|remorqu|destroyed/i, '#a8b8ab', 14,
    [['gantry', -.28, -.22, .56, .42], ['lift', -.19, -.13, .38, .29, .12], ['fan', .2, -.08, .07, 0, 5], ['bars', -.25, -.19, .14, .12, 4], ['beam', -.33, .22, .66, .025]]),
  scene('w17-sanctum-brightholme-vent', 'Sanctum', 'Sanctum 2: Ruins of Brightholme (2013 DLC)',
    'https://store.steampowered.com/app/237050/Sanctum_2_Ruins_of_Brightholme/', 'Ruins of Brightholme — 2013 empty maintenance wall and ventilation bay', /ruins of brightholme.*2013.*(?:maintenance|ventilation)/i,
    /sanctum 1|2011|elysion|pursuit|last stand|destroyed/i, '#b5ae96', 12,
    [['box', -.29, -.23, .58, .44], ['fan', -.14, -.035, .095, 0, 6], ['gutter', -.01, -.19, .24, .31], ['air', -.02, .05, .27, .08, 3, .7], ['bars', -.25, .12, .5, .07, 6]]),
  scene('w17-hotd-curien-foyer-drapes', 'House of the Dead', 'The House of the Dead, original SEGA Model 2 arcade (1996 copyright / 1997 release)',
    'https://www.mobygames.com/game/1218/the-house-of-the-dead/', 'Curien Mansion — original Model 2 empty foyer and upper drapes', /curien mansion.*(?:model 2|1996|1997).*(?:empty foyer|foyer drapes)/i,
    /remake|2022|scarlet dawn|overkill|destroyed/i, '#b6a49e', 29,
    [['arch', -.3, -.22, .6, .44], ['cross', -.14, -.2, .28, .22], ['cloth', -.28, -.17, .13, .31, .018], ['cloth', .15, -.17, .13, .31, -.022], ['steps', -.31, .19, .62, .06, 4]]),
  scene('w17-bioshock-welcome-water-window', 'BioShock', 'BioShock (2007)',
    'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_Xbox_360/Manual/formated/BioShock_-_2007_-_2K_Games.pdf', 'Welcome to Rapture — original 2007 empty docking window and arrival-water refraction', /welcome to rapture.*2007.*(?:arrival.water|window.*refraction|empty docking window)/i,
    /bioshock 2|infinite|2010|remastered|2016|winch|treuil|destroyed/i, '#92bcc3', 16,
    [['arch', -.31, -.23, .62, .45], ['cross', -.26, -.17, .52, .28], ['sea', -.24, -.12, .48, .17, 4, 1.2], ['ripples', .1, -.02, .09, .045, 3], ['tiles', -.3, .2, .6, .035, 8]]),
  scene('w17-nemesis-engine-room2-vent', 'Nemesis — Awaken Realms', 'Nemesis, original core board game (2018)',
    'https://awakenrealms.com/images/download/Nemesis/ENG/RULEBOOK_280x280mm_bleed3mm_28pages_PRINT.pdf', 'Nemesis Engine Room 2 — core 2018 empty maintenance vent and access frame', /nemesis.*engine room.?2.*2018.*maintenance vent/i,
    /lockdown|retaliation|aftermath|engine room.?1|engine room.?3|destroyed/i, '#abb7b5', 15,
    [['octagon', 0, -.02, .27, .22], ['fan', .11, -.04, .085, 0, 4], ['gutter', -.22, -.16, .18, .3], ['air', -.19, .06, .29, .075, 2, .55], ['beam', -.31, .23, .62, .02]]),
  scene('w17-dandadan-ayase-talisman-gate', 'Dandadan', 'DAN DA DAN television anime, Season 1 (2024)',
    'https://anime-dandadan.com/en/', 'Ayase residence — season 1 2024 empty talisman gate and paper in ordinary wind', /ayase (?:house|residence).*season 1.*2024.*talisman gate/i,
    /season [234]|2025|2026|kumamori|evil eye|destroyed/i, '#c9bca1', 26,
    [['beam', -.31, -.16, .62, .03], ['pile', -.25, -.16, .025, .38], ['pile', .225, -.16, .025, .38], ['guy', -.25, -.12, .5, .012, .008], ['talisman-paper', -.2, -.11, .4, .18, 5], ['ground', -.33, .23, .66, .02]]),
  scene('w17-zootopia-station-garden', 'Zootopia', 'Zootopia (2016)',
    'https://disneyanimation.com/films/zootopia/', 'Savanna Central Station — original 2016 empty garden canopy and atrium foliage', /savanna central station.*2016.*(?:garden canopy|empty atrium foliage)/i,
    /zootopia 2|2025|marsh market|rainforest|theme park|escalator|destroyed/i, '#afc2a6', 31,
    [['arch', -.32, -.23, .64, .45], ['roof', -.28, -.2, .56, .15], ['bars', -.26, -.15, .52, .09, 7], ['branch', -.2, .18, .18, .2, 3, .035], ['leaf-drift', -.08, -.04, .36, .2, 4], ['beam', -.33, .22, .66, .025]])
]);

export function getStageAnimationWave17Geometry(animation, progress, width, height) {
  const angle = Math.PI * 2 * progress;
  return getStageAnimationWave16Geometry(animation, progress, width, height).map(part => {
    if (part.kind !== 'talisman-paper') return part;
    return { ...part, strips: Array.from({ length: part.options[0] }, (_, index) => {
      const x = part.x + part.w * (index + .5) / part.options[0], sway = Math.sin(angle + index * .55) * part.h * .055;
      const w = part.w / part.options[0] * .23;
      return [[x - w, part.y], [x + w, part.y], [x + w + sway, part.y + part.h], [x - w + sway, part.y + part.h]];
    }) };
  });
}

export function drawStageAnimationWave17(ctx, animation, frame, width, height) {
  if (!animation.blueprint) return false;
  drawStageAnimationWave16(ctx, { ...animation, blueprint: animation.blueprint.filter(part => part[0] !== 'talisman-paper') }, frame, width, height);
  ctx.strokeStyle = animation.color; ctx.globalAlpha = .16;
  ctx.lineWidth = Math.max(.7, Math.min(width, height) * .0018);
  for (const part of getStageAnimationWave17Geometry(animation, frame.progress, width, height)) {
    if (part.kind !== 'talisman-paper') continue;
    for (const points of part.strips) {
      ctx.beginPath(); ctx.moveTo(...points[0]);
      for (const point of points.slice(1)) ctx.lineTo(...point);
      ctx.closePath(); ctx.stroke();
    }
  }
  return true;
}
