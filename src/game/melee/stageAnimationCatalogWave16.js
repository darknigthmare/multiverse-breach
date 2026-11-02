import { drawStageAnimationWave11, getStageAnimationWave11Geometry } from './stageAnimationCatalogWave11.js';

// Ten empty, localized studies. All geometry and finite cycles are authored
// adaptations: they do not recreate source footage, actors or collision.
const scene = (id, universe, sourceWork, sourceReference, sourceScene, scenePattern, excludedScenePattern, color, periodSeconds, blueprint) => Object.freeze({
  id, universes: Object.freeze([universe]), sourceWork, sourceReference, sourceScene,
  scenePattern, excludedScenePattern, continuity: sourceWork, mechanism: id, color, periodSeconds,
  blueprint: Object.freeze(blueprint.map(part => Object.freeze(part))),
  animationWave: 16, localBackdrops: Object.freeze({}), renderingKind: 'authored-mechanism',
  sourceAccess: 'Documented setting reference, not a verified measurement of official props or animation frames.',
  sceneEvidence: 'Empty original architectural/landscape study adapted to this explicit work and location. The source identifies the setting; outlines, colors, dimensions and looping maintenance/wind timing remain project adaptations.',
  animationProvenance: 'authored-scene-architecture-landscape-geometry-and-timing',
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  gameplayEffect: 'none', sourceVisualValidation: 'not-validated-1:1',
  source1to1Verified: false, networkVerified: false, fidelityVerified: false, officialSourceFrames: false
});

export const STAGE_ANIMATION_WAVE_16 = Object.freeze([
  scene('w16-crash-warp-room-ring', 'Crash Bandicoot', 'Crash Bandicoot 3: Warped (1998)',
    'https://www.crashbandicoot.com/', 'Time Twister warp room — Warped 1998 empty portal arch and hanging mechanical ring', /time twister.*(?:ring|arch)|warped 1998.*warp room/i,
    /n.sane|2017|2007|crash 4|destroyed/i, '#aab9ac', 20,
    [['arch', -.29, -.23, .58, .45], ['orbit-ring', 0, -.015, .16, .15, 8], ['steps', -.32, .22, .64, .055, 3]]),
  scene('w16-ewj-new-junk-city-drain', 'Earthworm Jim', 'Earthworm Jim (1994)',
    'https://earthwormjim.fandom.com/wiki/New_Junk_City', 'New Junk City — Earthworm Jim 1994 empty junk pile drain and industrial fan', /new junk city.*(?:drain|fan)|earthworm jim 1994.*drain/i,
    /earthworm jim 2|earthworm jim 3d|1995|1999|destroyed/i, '#b4a78a', 13,
    [['box', -.27, -.22, .54, .4], ['fan', -.1, -.04, .095, 0, 5], ['gutter', -.24, -.16, .48, .31], ['drip', .19, .12, .02, .1, 3]]),
  scene('w16-monkey-melee-dock-cloth', 'Secret of Monkey Island', 'The Secret of Monkey Island (1990)',
    'https://monkeyisland.fandom.com/wiki/M%C3%AAl%C3%A9e_Island', 'Mêlée Island docks — Secret of Monkey Island 1990 empty mooring posts and wind cloth', /m[eê]l[eé]e.*dock.*(?:cloth|1990)|monkey island 1990.*mooring/i,
    /special edition|2009|return to monkey island|2022|destroyed/i, '#b4ad96', 24,
    [['beam', -.32, .11, .64, .03], ['pile', -.25, -.02, .03, .27], ['pile', .23, -.02, .03, .27], ['polecloth', -.19, -.24, .17, .13, .023], ['sea', -.34, .17, .68, .06, 2, .7]]),
  scene('w16-cuphead-inkwell-water', 'Cuphead', 'Cuphead (2017)',
    'https://studiomdhr.com/cuphead/', 'Inkwell Isle One — Cuphead 2017 empty brook and wooden footbridge', /inkwell isle one.*(?:brook|footbridge|ruisseau|pont)|cuphead 2017.*brook/i,
    /delicious last course|2022|isle (?:two|three|four)|destroyed/i, '#a8ba91', 17,
    [['bridge', -.28, -.04, .56, .14, 3], ['sea', -.33, .11, .66, .11, 3, .8], ['reeds', -.29, .02, .08, .16, 3]]),
  scene('w16-jsr-tokyo-to-tracks', 'Jet Set Radio', 'Jet Set Radio (2000)',
    'https://segaretro.org/Jet_Set_Radio', 'Tokyo-to — Jet Set Radio 2000 empty Shibuya-cho overhead line and street banner', /tokyo.to.*(?:banner|overhead line)|shibuya.cho.*street banner/i,
    /future|2002|jet set radio 3|destroyed/i, '#a7b6b0', 22,
    [['gantry', -.3, -.23, .6, .44], ['guy', -.28, -.19, .56, .01, .012], ['polecloth', -.21, -.21, .17, .13, .02], ['beam', -.33, .23, .66, .025]]),
  scene('w16-oddworld-rupture-farms-conveyor', 'Oddworld', 'Oddworld: Abe’s Oddysee (1997)',
    'https://www.oddworld.com/oddworldgames/abes-oddysee/', 'RuptureFarms — Abe’s Oddysee 1997 empty maintenance conveyor and vent bay', /rupture.?farms.*maintenance conveyor|abe.?s oddysee 1997.*vent bay/i,
    /new.n.tasty|2014|soulstorm|2021|exoddus|destroyed/i, '#a5ad94', 12,
    [['box', -.28, -.23, .56, .43], ['escalator', -.27, .12, .54, .025, 8], ['fan', .12, -.07, .075, 0, 4], ['bars', -.24, -.18, .48, .25, 5]]),
  scene('w16-dead-rising-willamette-skylight', 'Dead Rising', 'Dead Rising (2006)',
    'https://www.capcom-games.com/dead-rising/', 'Willamette Parkview Mall — Dead Rising 2006 empty atrium fan and cloth banner', /willamette.*atrium.*(?:fan|banner)|dead rising 2006.*atrium/i,
    /deluxe remaster|2024|dead rising [234]\b|destroyed/i, '#b0b8a7', 19,
    [['roof', -.31, -.24, .62, .18], ['fan', 0, -.015, .105, 0, 5], ['cloth', -.26, -.14, .11, .31, .015], ['cloth', .15, -.14, .11, .31, -.018], ['beam', -.32, .2, .64, .025]]),
  scene('w16-parasite-carnegie-curtain', 'Parasite Eve', 'Parasite Eve (1998)',
    'https://en.wikipedia.org/wiki/Parasite_Eve_(video_game)', 'Carnegie Hall — Parasite Eve 1998 empty stage curtain and auditorium ventilation', /carnegie hall.*(?:curtain|ventilation)|parasite eve 1998.*curtain/i,
    /parasite eve ii|third birthday|burning|fire|victim|destroyed/i, '#b7a29e', 27,
    [['arch', -.31, -.23, .62, .46], ['curtains', -.25, -.19, .5, .36, .085], ['air', -.2, .13, .4, .05, 2, .5], ['steps', -.32, .22, .64, .04, 2]]),
  scene('w16-bebop-ship-vent', 'Cowboy Bebop', 'Cowboy Bebop television series (1998)',
    'https://www.cowboy-bebop.net/', 'Bebop ship — Cowboy Bebop 1998 empty service deck ventilation hatch', /bebop.*(?:ventilation hatch|deck.*vent)|cowboy bebop 1998.*vent/i,
    /netflix|2021|swordfish|destroyed/i, '#a7b8b4', 15,
    [['octagon', 0, -.03, .24, .2], ['fan', -.08, -.025, .09, 0, 4], ['bars', -.2, -.16, .4, .27, 5], ['air', .03, .06, .18, .08, 3, .6]]),
  scene('w16-wakfu-sadida-leaves', 'Wakfu', 'Wakfu animated series, Season 1 (2008–2010)',
    'https://www.ankama.com/en/animations/wakfu', 'Sadida Kingdom — Wakfu season 1 empty canopy branch and drifting leaves', /sadida.*(?:season|saison) 1.*(?:branch|leaves|racines|canop)|wakfu season 1.*canopy/i,
    /(?:season|saison) [234]|nox.*attack|destroyed/i, '#9db78b', 29,
    [['branch', -.24, .18, .25, .35, 4, .045], ['branch', .12, .16, .2, .28, 3, -.035], ['leaf-drift', -.18, -.15, .42, .28, 5], ['ground', -.33, .21, .66, .025]])
]);

const TAU = Math.PI * 2;
const CUSTOM = new Set(['orbit-ring', 'leaf-drift']);

export function getStageAnimationWave16Geometry(animation, progress, width, height) {
  const angle = TAU * progress, unit = Math.min(width, height);
  return getStageAnimationWave11Geometry(animation, progress, width, height).map(g => {
    if (g.kind === 'orbit-ring') return { ...g, points: Array.from({ length: g.options[0] }, (_, i) => {
      const a = angle + TAU * i / g.options[0]; return [g.x + Math.cos(a) * g.w, g.y + Math.sin(a) * g.h];
    }) };
    if (g.kind === 'leaf-drift') return { ...g, leaves: Array.from({ length: g.options[0] }, (_, i) => ({
      x: g.x + g.w * (.5 + .4 * Math.sin(angle + i * .87)),
      y: g.y + g.h * ((i + .5) / g.options[0]) + g.h * .1 * Math.cos(angle + i),
      angle: .35 * Math.sin(angle + i * 1.1), radius: unit * (.008 + i % 2 * .002)
    })) };
    return g;
  });
}

export function drawStageAnimationWave16(ctx, animation, frame, width, height) {
  if (!animation.blueprint) return false;
  const plain = animation.blueprint.filter(part => !CUSTOM.has(part[0]));
  drawStageAnimationWave11(ctx, { ...animation, blueprint: plain }, frame, width, height);
  ctx.strokeStyle = animation.color; ctx.fillStyle = animation.color;
  ctx.globalAlpha = .16; ctx.lineWidth = Math.max(.7, Math.min(width, height) * .0018);
  for (const g of getStageAnimationWave16Geometry(animation, frame.progress, width, height)) {
    if (g.kind === 'orbit-ring') {
      ctx.beginPath(); ctx.ellipse(g.x, g.y, g.w, g.h, 0, 0, TAU); ctx.stroke();
      for (const [x, y] of g.points) { ctx.beginPath(); ctx.ellipse(x, y, Math.min(width, height) * .008, Math.min(width, height) * .008, 0, 0, TAU); ctx.stroke(); }
    } else if (g.kind === 'leaf-drift') {
      for (const leaf of g.leaves) {
        ctx.beginPath(); ctx.ellipse(leaf.x, leaf.y, leaf.radius, leaf.radius * .4, leaf.angle, 0, TAU); ctx.stroke();
      }
    }
  }
  return true;
}
