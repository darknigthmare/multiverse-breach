import { drawStageAnimationWave11, getStageAnimationWave11Geometry } from './stageAnimationCatalogWave11.js';

// Empty setting studies for ten roster universes that previously had no scene
// mechanism. The named location establishes the setting; this project's
// outlines, dimensions and cyclic timing are original gameplay presentation.
// No official animation, character, equipment, hazard or collision is added.
const scene = (id, universe, sourceWork, sourceReference, sourceScene, scenePattern, excludedScenePattern, color, periodSeconds, blueprint) => Object.freeze({
  id, universes: Object.freeze([universe]), sourceWork, sourceReference, sourceScene,
  scenePattern, excludedScenePattern, continuity: sourceWork, mechanism: id, color, periodSeconds,
  blueprint: Object.freeze(blueprint.map(part => Object.freeze(part))),
  animationWave: 15, localBackdrops: Object.freeze({}), renderingKind: 'authored-mechanism',
  sourceAccess: 'Documented setting reference; this new architectural study has not been verified against official frames or exact prop geometry.',
  sceneEvidence: 'Empty location study. The source work identifies the setting; visible outlines, scale, weather, maintenance and wind cycles are project adaptations. A location name is not proof of exact source geometry or animation.',
  animationProvenance: 'authored-scene-architecture-landscape-geometry-and-timing',
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  gameplayEffect: 'none', sourceVisualValidation: 'not-validated-1:1',
  source1to1Verified: false, networkVerified: false, fidelityVerified: false, officialSourceFrames: false
});

export const STAGE_ANIMATION_WAVE_15 = Object.freeze([
  scene('w15-hexen-seven-portals-gate', 'Hexen', 'Hexen: Beyond Heretic (1995), Seven Portals hub',
    'https://en.wikipedia.org/wiki/Hexen:_Beyond_Heretic', 'Seven Portals — Hexen 1995 empty stone threshold', /seven portals|sept portails/i,
    /hexen ii|hexen 2|1997|heretic ii|destroyed/i, '#a6a396', 18,
    [['arch', -.25, -.25, .5, .5], ['portcullis', -.18, -.17, .36, .34, .08, 6], ['steps', -.29, .22, .58, .07, 4]]),
  scene('w15-mdk2-jim-dandy-observation', 'MDK', 'MDK 2 (2000), Jim Dandy orbital ship',
    'https://en.wikipedia.org/wiki/MDK_2', 'Jim Dandy — MDK 2 empty observation aperture', /jim dandy.*(?:mdk.?2|observation)|mdk.?2.*jim dandy/i,
    /minecrawler|new atlanta|destroyed/i, '#a4bcc4', 26,
    [['octagon', 0, -.03, .21, .2], ['dial', .27, -.04, .06, 0, 7], ['bars', -.17, -.18, .34, .3, 3], ['air', -.16, .05, .32, .09, 3, .7]]),
  scene('w15-sof-new-york-subway-vent', 'Soldier of Fortune', 'Soldier of Fortune (2000), New York subway opening',
    'https://en.wikipedia.org/wiki/Soldier_of_Fortune_(video_game)', 'New York subway — Soldier of Fortune 2000 empty ventilation bay', /new york.*subway|sof 2000.*subway/i,
    /double helix|payback|2002|2007|destroyed/i, '#aaa99d', 12,
    [['box', -.25, -.22, .5, .42], ['fan', -.09, -.02, .105, 0, 5], ['bars', -.22, -.19, .44, .36, 8], ['beam', -.3, .21, .6, .025]]),
  scene('w15-gtfo-complex-bulkhead', 'GTFO', 'GTFO (2021 release), the underground Complex',
    'https://gtfothegame.com/', 'The Complex — GTFO empty bulkhead maintenance section', /(?:the )?complex.*bulkhead|gtfo.*bulkhead|complexe.*cloison/i,
    /surface settlement|outdoor meadow|destroyed/i, '#8daba2', 21,
    [['box', -.28, -.23, .56, .46], ['split', -.21, -.18, .42, .36, .07], ['bars', -.2, -.17, .4, .34, 4], ['air', -.13, .07, .26, .12, 3, .5]]),
  scene('w15-yakuza-kamurocho-rooftop-wind', 'Like a Dragon', 'Yakuza (2005), Kamurocho and Millennium Tower',
    'https://en.wikipedia.org/wiki/Yakuza_(video_game)', 'Kamurocho Millennium Tower — Yakuza 2005 empty rooftop wind study', /kamurocho.*millennium.*2005|yakuza 2005.*rooftop/i,
    /infinite wealth|hawaii|yokohama|2019|2020|2024|destroyed/i, '#a3adb7', 23,
    [['beam', -.32, .17, .64, .035], ['bars', -.29, -.03, .58, .19, 8], ['polecloth', -.2, -.25, .12, .13, .025], ['air', -.12, -.15, .43, .16, 4, .8]]),
  scene('w15-ki-tigers-lair-water', 'Killer Instinct', 'Killer Instinct (2013), Jago Tiger’s Lair arena',
    'https://en.wikipedia.org/wiki/Killer_Instinct_(2013_video_game)', 'Tiger’s Lair — Killer Instinct 2013 empty temple water study', /tiger.?s lair.*2013|ki 2013.*temple water/i,
    /1994|1995|1996|destroyed/i, '#a6b9a9', 19,
    [['arch', -.28, -.24, .56, .43], ['flow', -.055, -.15, .11, .32, 6], ['pool', -.25, .16, .5, .055, 3], ['steps', -.3, .21, .6, .055, 3]]),
  scene('w15-magicka-aldreheim-cloth', 'Magicka', 'Magicka (2011), Castle Aldrheim',
    'https://en.wikipedia.org/wiki/Magicka', 'Castle Aldrheim — Magicka 2011 empty hall banners', /aldrheim.*2011|magicka 2011.*hall/i,
    /magicka 2\b|2015|wizard wars|destroyed/i, '#b6ac8e', 25,
    [['arch', -.26, -.23, .52, .46], ['cloth', -.21, -.2, .13, .29, .035], ['cloth', .08, -.2, .13, .29, -.025], ['steps', -.29, .22, .58, .055, 3]]),
  scene('w15-goemon-lostn-town-wind', "Goemon's Great Adventure", "Goemon’s Great Adventure / Dero Dero Dōchū (1998 Japan, 1999 international), Lost’n Town",
    'https://en.wikipedia.org/wiki/Goemon%27s_Great_Adventure', 'Lost’n Town — Goemon N64 empty fabric entrance', /lost.?n town.*(?:goemon|n64)|goemon.*lost.?n town/i,
    /mystical ninja|space pirate|destroyed/i, '#b6ab91', 22,
    [['box', -.26, -.22, .52, .43], ['cloth', -.21, -.18, .12, .27, .025], ['cloth', -.06, -.18, .12, .27, -.02], ['cloth', .09, -.18, .12, .27, .035], ['beam', -.29, .22, .58, .025]]),
  scene('w15-evolve-shear-forest-draft', 'Evolve', 'Evolve (2015), planet Shear',
    'https://en.wikipedia.org/wiki/Evolve_(video_game)', 'Shear — Evolve 2015 empty forest ravine draft', /shear.*2015.*(?:forest|ravine)|evolve.*shear.*ravine/i,
    /earth|stage 2|destroyed/i, '#91ac98', 29,
    [['bank', -.34, .01, .24, .18, 1], ['bank', .12, .01, .24, .18, -1], ['branch', -.26, .12, .19, .35, 4, .055], ['air', -.18, -.13, .45, .2, 5, 1.1]]),
  scene('w15-kf2-burning-paris-gutter', 'Killing Floor 2', 'Killing Floor 2 (2016), Burning Paris map',
    'https://en.wikipedia.org/wiki/Killing_Floor_2', 'Burning Paris — Killing Floor 2 empty rain gutter study', /burning paris|paris en flammes/i,
    /killing floor 3|2025|destroyed/i, '#b3aaa0', 17,
    [['box', -.23, -.23, .46, .32], ['cross', -.2, -.2, .4, .25], ['gutter', -.27, -.11, .54, .28], ['drip', .22, .13, .035, .12, 4]])
]);

export const getStageAnimationWave15Geometry = getStageAnimationWave11Geometry;
export const drawStageAnimationWave15 = drawStageAnimationWave11;
