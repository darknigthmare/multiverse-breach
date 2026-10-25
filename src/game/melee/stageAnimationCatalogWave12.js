import { drawStageAnimationWave11, getStageAnimationWave11Geometry } from './stageAnimationCatalogWave11.js';

// Additional concrete locations for this batch. Existing scene defaults and
// historical profiles retain priority. Geometry/timing are authored studies,
// not official source frames, hazards or changes to the Tactics terrain grid.
const scene = (id, universe, sourceWork, sourceReference, sourceScene, scenePattern, color, periodSeconds, blueprint, excludedScenePattern) => Object.freeze({
  id, universes: Object.freeze([universe]), sourceWork, sourceReference, sourceScene, scenePattern,
  excludedScenePattern, mechanism: id, color, periodSeconds,
  blueprint: Object.freeze(blueprint.map(part => Object.freeze(part))),
  animationWave: 12, continuity: sourceWork,
  sourceAccess: 'Setting reference; exact dimensions and mechanical cycles are not source verified.',
  sceneEvidence: 'This empty architectural or landscape study uses the named source location. Its outlines, scale, repeating maintenance cycles and timing are adapted for this project; no body, equipment, vehicle or official frame is reconstructed.',
  renderingKind: 'authored-mechanism', localBackdrops: Object.freeze({}),
  animationProvenance: 'authored-scene-architecture-landscape-geometry-and-timing',
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1', fidelityVerified: false, officialSourceFrames: false, gameplayEffect: 'none'
});
export const STAGE_ANIMATION_WAVE_12 = Object.freeze([
  scene('w12-midwich-clock-study', 'Silent Hill', 'Silent Hill (1999), original Midwich school',
    'https://en.wikipedia.org/wiki/Silent_Hill_(video_game)', 'Midwich — 1999 empty courtyard clock study', /midwich.*clock|midwich.*horloge/i,
    '#b7a58e', 32, [['tower', -.16, -.24, .32, .44], ['clock', 0, -.06, .085, 0, 12], ['ground', -.3, .22, .6, .025]], /remake|2024|movie|film|destroyed/i),
  scene('w12-midwich-stairwell-draft', 'Silent Hill', 'Silent Hill (1999), original Midwich school',
    'https://en.wikipedia.org/wiki/Silent_Hill_(video_game)', 'Midwich — 1999 empty stairwell window draft', /midwich.*stairwell|midwich.*escalier/i,
    '#9ca6a2', 21, [['box', -.22, -.23, .44, .4], ['cross', -.2, -.21, .4, .36], ['cloth', -.17, -.19, .12, .32, .025], ['steps', -.27, .18, .54, .09, 5]], /remake|2024|movie|film|destroyed/i),
  scene('w12-edward-city-channel', 'Dino Crisis', 'Dino Crisis 2 (2000), Edward City',
    'https://en.wikipedia.org/wiki/Dino_Crisis_2', 'Edward City — 2000 empty water channel', /edward city.*channel|edward city.*canal/i,
    '#95b5b1', 15, [['box', -.31, -.1, .62, .25], ['flow', -.27, .01, .54, .08, 5], ['bars', -.31, -.13, .62, .09, 8]], /dino crisis 3|space|remake|destroyed/i),
  scene('w12-edward-city-industrial-vent', 'Dino Crisis', 'Dino Crisis 2 (2000), Edward City',
    'https://en.wikipedia.org/wiki/Dino_Crisis_2', 'Edward City — 2000 empty industrial ventilation section', /edward city.*ventilation|edward city.*vent/i,
    '#a2b6aa', 12, [['box', -.24, -.2, .48, .4], ['fan', 0, 0, .13, 0, 5], ['bars', -.2, -.16, .4, .32, 7]], /dino crisis 3|space|remake|destroyed/i),
  scene('w12-predator2-rooftop-rain', 'Predator', 'Predator 2 (1990), Los Angeles',
    'https://en.wikipedia.org/wiki/Predator_2', 'Los Angeles 1990 — empty rooftop rain gutter', /los angeles 1990.*gutter|los angeles 1990.*goutti[eè]re/i,
    '#b0a591', 17, [['beam', -.32, -.13, .64, .035], ['gutter', -.27, -.1, .54, .25], ['drip', .21, .1, .05, .14, 4]], /1987|prey|2022|predators 2010|destroyed/i),
  scene('w12-predator2-apartment-blinds', 'Predator', 'Predator 2 (1990), Los Angeles',
    'https://en.wikipedia.org/wiki/Predator_2', 'Los Angeles 1990 — empty apartment window blinds', /los angeles 1990.*blinds|los angeles 1990.*store/i,
    '#bba893', 23, [['box', -.23, -.21, .46, .42], ['shutter', -.19, -.17, .38, .34, .1, 7], ['beam', -.28, .22, .56, .02]], /1987|prey|2022|predators 2010|destroyed/i),
  scene('w12-kandar-portcullis-study', 'Evil Dead', 'Army of Darkness (1992), Castle Kandar',
    'https://en.wikipedia.org/wiki/Army_of_Darkness', 'Castle Kandar — 1992 empty portcullis maintenance study', /castle kandar.*portcullis|kandar.*herse/i,
    '#b9a889', 18, [['arch', -.26, -.24, .52, .48], ['portcullis', -.2, -.16, .4, .34, .1, 8], ['steps', -.3, .22, .6, .07, 4]], /1981|2013|rise|ash vs evil dead|destroyed/i),
  scene('w12-kandar-courtyard-cloth', 'Evil Dead', 'Army of Darkness (1992), Castle Kandar',
    'https://en.wikipedia.org/wiki/Army_of_Darkness', 'Castle Kandar — 1992 empty courtyard cloth draft', /castle kandar.*cloth|kandar.*[eé]toffe/i,
    '#b6a094', 24, [['arch', -.29, -.22, .58, .44], ['cloth', -.22, -.18, .13, .34, .035], ['cloth', .09, -.18, .13, .34, -.03], ['ground', -.31, .23, .62, .02]], /1981|2013|rise|ash vs evil dead|destroyed/i),
  scene('w12-tau-volantis-hatch', 'Dead Space', 'Dead Space 3 (2013), Tau Volantis facility',
    'https://en.wikipedia.org/wiki/Dead_Space_3', 'Tau Volantis — 2013 empty facility hatch section', /tau volantis.*hatch|tau volantis.*sas/i,
    '#91b6c5', 16, [['octagon', 0, 0, .2, .2], ['split', -.14, -.16, .28, .32, .08], ['bars', -.12, -.13, .24, .26, 4], ['beam', -.27, .22, .54, .025]], /ishimura|remake|2023|destroyed/i),
  scene('w12-tau-volantis-ice-draft', 'Dead Space', 'Dead Space 3 (2013), Tau Volantis exterior',
    'https://en.wikipedia.org/wiki/Dead_Space_3', 'Tau Volantis — 2013 empty exterior ice and wind', /tau volantis.*ice.*wind|tau volantis.*glace/i,
    '#a6c2d0', 26, [['ice', -.31, -.24, .62, .12, 9], ['air', -.27, -.04, .54, .17, 4, 1.2], ['ground', -.32, .2, .64, .035]], /ishimura|remake|2023|destroyed/i),
  scene('w12-planet-express-office-vent', 'Futurama', 'Futurama, original Fox seasons (1999–2003), Planet Express',
    'https://en.wikipedia.org/wiki/Planet_Express', 'Planet Express — classic office ventilation section', /planet express.*office.*vent|planet express.*bureau.*vent/i,
    '#9cbeb1', 14, [['box', -.23, -.19, .46, .38], ['fan', 0, 0, .125, 0, 4], ['bars', -.19, -.15, .38, .3, 7]], /hulu|2023|revival|destroyed/i),
  scene('w12-planet-express-meeting-window', 'Futurama', 'Futurama, original Fox seasons (1999–2003), Planet Express',
    'https://en.wikipedia.org/wiki/Planet_Express', 'Planet Express — classic empty meeting-room window', /planet express.*meeting.*window|planet express.*r[eé]union.*fen[eê]tre/i,
    '#9bb5be', 22, [['box', -.26, -.2, .52, .4], ['cross', -.23, -.17, .46, .34], ['cloth', -.21, -.15, .12, .3, .025], ['beam', -.3, .22, .6, .025]], /hulu|2023|revival|destroyed/i),
  scene('w12-smith-house-garage-door', 'Rick & Morty', 'Rick and Morty, season 2 (2015), Smith house',
    'https://en.wikipedia.org/wiki/Rick_and_Morty_season_2', 'Smith house — season 2 empty garage shutter section', /smith house.*season 2.*shutter|smith.*saison 2.*porte/i,
    '#abb69c', 19, [['arch', -.3, -.22, .6, .44], ['shutter', -.25, -.17, .5, .34, .12, 9], ['beam', -.33, .23, .66, .025]], /season [13456789]|saison [13456789]|phoenixperson|destroyed/i),
  scene('w12-smith-house-window-draft', 'Rick & Morty', 'Rick and Morty, season 2 (2015), Smith house',
    'https://en.wikipedia.org/wiki/Rick_and_Morty_season_2', 'Smith house — season 2 empty living-room window', /smith house.*season 2.*window|smith.*saison 2.*fen[eê]tre/i,
    '#b7b79f', 25, [['box', -.23, -.22, .46, .44], ['cross', -.2, -.19, .4, .38], ['cloth', -.18, -.17, .12, .34, .03], ['cloth', .06, -.17, .12, .34, -.025]], /season [13456789]|saison [13456789]|phoenixperson|destroyed/i)
]);

// Reuse a physical geometry library; the new scene definitions are explicit.
export const getStageAnimationWave12Geometry = getStageAnimationWave11Geometry;
export const drawStageAnimationWave12 = drawStageAnimationWave11;
