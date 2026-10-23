import { STAGE_ANIMATION_WAVE_11, WAVE_11_MODE_REFERENCE_SCENES, drawStageAnimationWave11 } from './stageAnimationCatalogWave11.js';
import { STAGE_ANIMATION_WAVE_10, WAVE_10_MODE_REFERENCE_SCENES, drawStageAnimationWave10 } from './stageAnimationCatalogWave10.js';
import { getUniverseStageAtmosphereDefault } from './stageAtmosphereUniverseDefaults.js';
import { STAGE_ANIMATION_WAVE_2, WAVE_2_MODE_REFERENCE_SCENES, drawStageAnimationWave2 } from './stageAnimationCatalogWave2.js';
import { STAGE_ANIMATION_WAVE_3, WAVE_3_MODE_REFERENCE_SCENES, drawStageAnimationWave3 } from './stageAnimationCatalogWave3.js';
import { STAGE_ANIMATION_WAVE_4, WAVE_4_MODE_REFERENCE_SCENES, drawStageAnimationWave4 } from './stageAnimationCatalogWave4.js';
import { STAGE_ANIMATION_WAVE_5, WAVE_5_MODE_REFERENCE_SCENES, drawStageAnimationWave5 } from './stageAnimationCatalogWave5.js';
import { STAGE_ANIMATION_WAVE_6, WAVE_6_MODE_REFERENCE_SCENES, drawStageAnimationWave6 } from './stageAnimationCatalogWave6.js';
import { STAGE_ANIMATION_WAVE_9, WAVE_9_MODE_REFERENCE_SCENES, drawStageAnimationWave9 } from './stageAnimationCatalogWave9.js';
import { STAGE_ANIMATION_WAVE_8, WAVE_8_MODE_REFERENCE_SCENES, drawStageAnimationWave8 } from './stageAnimationCatalogWave8.js';
import { STAGE_ANIMATION_WAVE_7, WAVE_7_MODE_REFERENCE_SCENES, drawStageAnimationWave7 } from './stageAnimationCatalogWave7.js';

// A container being a still image does not make a documented sprite atlas a
// still prop. Only explicit four-phase effect rows are played as frames here.
// Existing OpenAI project art is not footage or frame data from the source work.
const profile = definition => Object.freeze({
  ...definition,
  universes: Object.freeze(definition.universes),
  localBackdrops: Object.freeze(definition.localBackdrops || {}),
  ...(definition.atlas ? { atlas: Object.freeze({ ...definition.atlas, frameOrder: Object.freeze(definition.atlas.frameOrder) }) } : {}),
  sourceVisualValidation: 'not-validated-1:1',
  gameplayEffect: 'none'
});
const patch = (path, x, y, width, height, motion = 'glow') => Object.freeze({ path, region: Object.freeze({ x, y, width, height }), motion });
const portalAtlas = (slug, x, y, size, frameOrder = [2, 2, 2, 3, 0, 0, 1, 1]) => ({
  path: `/visuals/cosmetics/openai/universes/${slug}/portal-effects-atlas.webp`,
  columns: 4, rows: 1, frameCount: 4, x, y, size, frameOrder,
  provenance: 'existing-openai-project-cosmetic-atlas',
  originalPurpose: 'dormant-opening-open-collapse effect sequence',
  stageUse: 'decorative background aperture; no teleport or hazard'
});

export const STAGE_ANIMATION_PROFILES = Object.freeze([
  profile({
    id: 'ff7-reactor-mako-circulation', universes: ['Final Fantasy VII'], scenePattern: /mako|reactor|r[eé]acteur/i,
    sourceWork: 'Final Fantasy VII — Mako Reactor 1', sourceReference: 'https://na.finalfantasy.com/titles/finalfantasy7',
    sourceScene: 'Mako Reactor 1 — conduites et cuve sous les passerelles', mechanism: 'mako-circulation', color: '#79d3ac', periodSeconds: 9,
    renderingKind: 'static-backdrop-compositing-and-authored-mechanism',
    localBackdrops: {
      Combat: patch('/backgrounds/lore-stages/final-fantasy-vii/combat.webp', 0.4, 0.46, 0.2, 0.17),
      Melee: patch('/backgrounds/lore-stages/final-fantasy-vii/melee.webp', 0.35, 0.5, 0.35, 0.23),
      RPG: patch('/backgrounds/lore-stages/final-fantasy-vii/rpg.webp', 0.27, 0.05, 0.43, 0.25),
      Tactics: patch('/backgrounds/lore-stages/final-fantasy-vii/tactics.webp', 0.36, 0.15, 0.3, 0.28)
    }
  }),
  profile({
    id: 'dbz-cell-games-cloud-drift', universes: ['Dragon Ball Z'], scenePattern: /cell games|jeu.*cell/i,
    sourceWork: 'Dragon Ball Z — Cell Games', sourceReference: 'https://en.dragon-ball-official.com/news/01_1258.html',
    sourceScene: 'Cell Games — nuages au-dessus de la plaine rocheuse', mechanism: 'cell-games-clouds', color: '#d8e6e9', periodSeconds: 75,
    renderingKind: 'static-backdrop-compositing-and-authored-mechanism',
    localBackdrops: { Combat: patch('/backgrounds/lore-stages/dragon-ball-z/combat.webp', 0.26, 0.09, 0.45, 0.12, 'clouds'), Tactics: patch('/backgrounds/lore-stages/dragon-ball-z/tactics.webp', 0.21, 0.07, 0.48, 0.1, 'clouds') }
  }),
  profile({
    id: 'dbz-namek-water-refraction', universes: ['Dragon Ball Z'], scenePattern: /namek/i,
    sourceWork: 'Dragon Ball Z — Planet Namek', sourceReference: 'https://en.dragon-ball-official.com/',
    sourceScene: 'Namek — plans d’eau turquoise sous les trois soleils immobiles', mechanism: 'namek-water', color: '#a7dac9', periodSeconds: 11,
    renderingKind: 'static-backdrop-compositing-and-authored-mechanism',
    localBackdrops: { Melee: patch('/backgrounds/lore-stages/dragon-ball-z/melee.webp', 0.12, 0.5, 0.76, 0.13, 'water') }
  }),
  profile({
    id: 'dbz-time-chamber-hourglasses', universes: ['Dragon Ball Z'], scenePattern: /time chamber|(?:salle|chambre).*(esprit|temps)|hyperbolic/i,
    sourceWork: 'Dragon Ball Z — Hyperbolic Time Chamber', sourceReference: 'https://en.dragon-ball-official.com/',
    sourceScene: 'Chambre du temps — sabliers de l’entrée', mechanism: 'time-chamber-hourglasses', color: '#c9b788', periodSeconds: 24,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'naruto-forest-canopy-wind', universes: ['Naruto'], scenePattern: /forest of death|for[eê]t.*mort|chunin.*forest/i,
    sourceWork: 'Naruto — Chunin Exams, Forest of Death', sourceReference: 'https://naruto-official.com/en/anime/naruto1',
    sourceScene: 'Forêt de la Mort — mouvement limité à la canopée éloignée', mechanism: 'forest-canopy', color: '#91b88e', periodSeconds: 13,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'naruto-valley-waterfall-current', universes: ['Naruto', 'Naruto Shippuden'], scenePattern: /valley of the end|vall[eé]e.*fin/i,
    sourceWork: 'Naruto / Naruto Shippuden — Valley of the End', sourceReference: 'https://naruto-official.com/en/anime/naruto1',
    sourceScene: 'Vallée de la Fin — cascade entre les statues et remous du bassin', mechanism: 'valley-waterfall', color: '#b7d5dd', periodSeconds: 8,
    renderingKind: 'static-backdrop-compositing-and-authored-mechanism',
    localBackdrops: { Melee: patch('/backgrounds/lore-stages/naruto/melee.webp', 0.45, 0.32, 0.11, 0.23, 'waterfall') }
  }),
  profile({
    id: 'matrix-operator-terminal-refresh', universes: ['The Matrix', 'Matrix'], scenePattern: /nebuchadnezzar|operator|op[eé]rateur|terminal|poste/i,
    sourceWork: 'The Matrix (1999) — Nebuchadnezzar operator consoles', sourceReference: 'https://www.warnerbros.com/movies/matrix',
    sourceScene: 'Nebuchadnezzar — rafraîchissement des écrans de l’opérateur', mechanism: 'matrix-terminals', color: '#85c798', periodSeconds: 10,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'matrix-authored-digital-curtain', universes: ['The Matrix', 'Matrix'], scenePattern: /digital|pipeline|code|construct|simulation/i,
    sourceWork: 'The Matrix — code de la simulation ; pipeline hybride authored dans le projet', sourceReference: 'public/visuals/cosmetics/openai/universes/the-matrix/reference-dossier.json',
    sourceScene: 'Pipeline numérique du projet — rideaux de code aux bords du lieu', mechanism: 'matrix-code-curtain', color: '#80c797', periodSeconds: 12,
    renderingKind: 'authored-mechanism', sourceSceneStatus: 'project-scene-adaptation', localBackdrops: {}
  }),
  profile({
    id: 'doom-uac-mars-cooling-cycle', universes: ['Doom'], scenePattern: /uac|mars|sas|cooling|refroid/i,
    sourceWork: 'DOOM (2016) — UAC Mars installations', sourceReference: 'https://doom.bethesda.net/',
    sourceScene: 'UAC Mars — ventilation mécanique et voyants de refroidissement', mechanism: 'uac-cooling-fans', color: '#b6b1a0', periodSeconds: 7,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'doom-nekravol-chain-and-gate-cycle', universes: ['Doom'], scenePattern: /nekravol|argent|infernal|hell.*gate|porte.*enfer/i,
    sourceWork: 'DOOM Eternal — Nekravol ; adaptation de portail du projet', sourceReference: 'https://doom.bethesda.net/',
    sourceScene: 'Nekravol — chaînes et ouverture infernale strictement décoratives', mechanism: 'argent-chains', color: '#c18b73', periodSeconds: 40,
    renderingKind: 'local-effect-atlas-and-authored-mechanism', atlas: portalAtlas('doom', 0.79, 0.31, 0.24), localBackdrops: {}
  }),
  profile({
    id: 'halo-truth-and-reconciliation-gravity-lift', universes: ['Halo'], scenePattern: /truth.*reconciliation|canyon.*(?:nuit|nocturne)|night.*canyon/i,
    sourceWork: 'Halo: Combat Evolved — The Truth and Reconciliation', sourceReference: 'https://www.halowaypoint.com/',
    sourceScene: 'Canyon nocturne — faisceau de l’ascenseur gravitationnel Covenant', mechanism: 'covenant-gravity-lift', color: '#b5a3d1', periodSeconds: 10,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'halo-installation04-forerunner-beacons', universes: ['Halo'], scenePattern: /forerunner|control room|installation 04.*(ring|anneau)|salle.*contr[oô]le/i,
    sourceWork: 'Halo: Combat Evolved — Installation 04 Forerunner structures', sourceReference: 'https://www.halowaypoint.com/',
    sourceScene: 'Installation 04 — signaux des colonnes et projection géométrique Forerunner', mechanism: 'forerunner-beacons', color: '#95cfba', periodSeconds: 15,
    renderingKind: 'static-backdrop-compositing-and-authored-mechanism',
    localBackdrops: { Tactics: patch('/backgrounds/halo-tactics-openai.png', 0.06, 0.23, 0.12, 0.28) }
  }),
  profile({
    id: 'stargate-sgc-four-phase-event-horizon', universes: ['Stargate'], scenePattern: /sgc|gate|porte|abydos/i,
    sourceWork: 'Stargate — horizon des événements ; atlas original du projet', sourceReference: 'public/visuals/cosmetics/openai/universes/stargate/reference-dossier.json',
    sourceScene: 'Salle de la Porte — dormant, ouverture, ouvert, fermeture', mechanism: 'stargate-chevron-sequence', color: '#a7cddd', periodSeconds: 40,
    renderingKind: 'local-effect-atlas-and-authored-mechanism', atlas: portalAtlas('stargate', 0.78, 0.31, 0.3), localBackdrops: {}
  }),
  profile({
    id: 'portal-aperture-wall-aperture-phases', universes: ['Portal'], scenePattern: /aperture|test|chambre|enrichment/i,
    sourceWork: 'Portal — chambres Aperture ; effet cosmétique original du projet', sourceReference: 'public/visuals/cosmetics/openai/universes/portal/reference-dossier.json',
    sourceScene: 'Chambre d’essai — ouverture de fond adaptée, sans traversée de gameplay', mechanism: 'aperture-wall-circuit', color: '#a7c7d6', periodSeconds: 32,
    renderingKind: 'local-effect-atlas-and-authored-mechanism', atlas: portalAtlas('portal', 0.83, 0.32, 0.25), localBackdrops: {}
  }),
  profile({
    id: 'rick-morty-garage-portal-phases', universes: ['Rick & Morty'], scenePattern: /garage|smith|portal|portail/i,
    sourceWork: 'Rick and Morty — garage des Smith ; portail original du projet', sourceReference: 'public/visuals/cosmetics/openai/universes/rick-morty/reference-dossier.json',
    sourceScene: 'Garage — quatre phases de l’aperture de fond, sans entrée de personnage', mechanism: 'garage-portal-controller', color: '#bfce7d', periodSeconds: 36,
    renderingKind: 'local-effect-atlas-and-authored-mechanism', atlas: portalAtlas('rick-morty', 0.8, 0.31, 0.25), localBackdrops: {}
  }),
  profile({
    id: 'daft-punk-alive-led-sequencer', universes: ['Daft Punk'], scenePattern: /alive|pyramid|led/i,
    sourceWork: 'Daft Punk — Alive 2007, pyramide LED', sourceReference: 'https://www.daftpunktour.com/',
    sourceScene: 'Alive 2007 — rangées LED sur les faces de la pyramide', mechanism: 'alive-led-grid', color: '#a3bdce', periodSeconds: 16,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  profile({
    id: 'demon-slayer-infinity-background-screens', universes: ['Demon Slayer'], scenePattern: /infinity castle|ch[aâ]teau.*infini|tatami/i,
    sourceWork: 'Demon Slayer — Infinity Castle', sourceReference: 'https://kimetsu.com/anime/mugenjyohen_movie/',
    sourceScene: 'Château de l’Infini — panneaux de bois coulissants du plan éloigné', mechanism: 'infinity-sliding-screens', color: '#bfa58c', periodSeconds: 18,
    renderingKind: 'authored-mechanism', localBackdrops: {}
  }),
  ...STAGE_ANIMATION_WAVE_2.map(profile),
  ...STAGE_ANIMATION_WAVE_3.map(profile),
  ...STAGE_ANIMATION_WAVE_4.map(profile),
  ...STAGE_ANIMATION_WAVE_5.map(profile),
  ...STAGE_ANIMATION_WAVE_6.map(profile),
  ...STAGE_ANIMATION_WAVE_7.map(profile),
  ...STAGE_ANIMATION_WAVE_8.map(profile),
  ...STAGE_ANIMATION_WAVE_9.map(profile),
  ...STAGE_ANIMATION_WAVE_10.map(profile),
  ...STAGE_ANIMATION_WAVE_11.map(profile)
]);

const MODE_ALIASES = Object.freeze({ Combat: 'Combat', Fighter: 'Combat', Melee: 'Melee', Smash: 'Melee', RPG: 'RPG', Tactics: 'Tactics' });
// Known mode-specific backdrops keep their own places. Other values declare a
// documented reference scene, not proof that every local image depicts it.
// Defaults apply only before a concrete stage name/description/location is given.
const MODE_REFERENCE_SCENES = Object.freeze({
  ...WAVE_2_MODE_REFERENCE_SCENES,
  ...WAVE_3_MODE_REFERENCE_SCENES,
  ...WAVE_4_MODE_REFERENCE_SCENES,
  ...WAVE_5_MODE_REFERENCE_SCENES,
  ...WAVE_6_MODE_REFERENCE_SCENES,
  ...WAVE_7_MODE_REFERENCE_SCENES,
  ...WAVE_8_MODE_REFERENCE_SCENES,
  ...WAVE_9_MODE_REFERENCE_SCENES,
  ...WAVE_10_MODE_REFERENCE_SCENES,
  ...WAVE_11_MODE_REFERENCE_SCENES,
  'Final Fantasy VII': { Combat: 'Mako Reactor 1', Melee: 'Mako Reactor 1', RPG: 'Mako Reactor 1', Tactics: 'Mako Reactor 1' },
  'Dragon Ball Z': { Combat: 'Cell Games', Melee: 'Namek battlefield', RPG: 'Hyperbolic Time Chamber', Tactics: 'Cell Games' },
  Naruto: { Combat: 'Chunin Exams Forest of Death', Melee: 'Valley of the End', RPG: 'Chunin Exams arena', Tactics: 'Konoha rooftops' },
  'Naruto Shippuden': { Melee: 'Valley of the End' },
  Halo: { Tactics: 'Installation 04 Ring' },
  'Daft Punk': { Combat: 'Alive 2007 LED pyramid', Melee: 'Alive 2007 LED pyramid', RPG: 'Alive 2007 LED pyramid', Tactics: 'Alive 2007 LED pyramid' },
  'Demon Slayer': { Combat: 'Infinity Castle', Melee: 'Infinity Castle', RPG: 'Mount Natagumo', Tactics: 'Entertainment District' }
});
const textValue = value => typeof value === 'string' ? value : value && typeof value === 'object' ? [value.fr, value.en].filter(item => typeof item === 'string').join(' ') : '';
const wrap = (value, limit = 1) => ((value % limit) + limit) % limit;

export function getStageAnimationProfile(stageOrUniverse = {}) {
  const stage = typeof stageOrUniverse === 'string' ? { universe: stageOrUniverse } : stageOrUniverse || {};
  if (!stage.universe) return null;
  const mode = MODE_ALIASES[stage.mode] || 'Combat';
  const stageName = textValue(stage.name);
  const concreteName = /^A\.R\.C\.A\. Impact Arena\s*-/i.test(stageName) ? '' : stageName;
  const concreteScene = [concreteName, textValue(stage.description), textValue(stage.location)].filter(Boolean).join(' ');
  const defaultScene = MODE_REFERENCE_SCENES[stage.universe]?.[mode] || getUniverseStageAtmosphereDefault(stage.universe)?.location || '';
  const scene = concreteScene || defaultScene;
  if (!scene) return null;
  const definition = STAGE_ANIMATION_PROFILES.find(item => item.universes.includes(stage.universe) && item.scenePattern.test(scene) && !item.excludedScenePattern?.test(scene));
  if (!definition) return null;
  const activeLocalBackdrop = definition.localBackdrops[mode] || null;
  return Object.freeze({
    ...definition, universe: stage.universe, mode, scene,
    selection: concreteScene ? 'stage-scene' : 'reference-scene-without-explicit-location',
    activeLocalBackdrop,
    localAssetPaths: Object.freeze([...(activeLocalBackdrop ? [activeLocalBackdrop.path] : []), ...(definition.atlas ? [definition.atlas.path] : [])]),
    assetUse: definition.atlas ? 'play-four-existing-project-effect-frames' : activeLocalBackdrop ? 'animate-a-region-of-the-existing-static-backdrop' : 'draw-an-authored-scene-mechanism',
    enabled: !stage.disableStageAtmosphere && !stage.disableStageAnimations
  });
}

export function getStageAnimationFrame(stageOrUniverse, elapsedSeconds = 0, { reducedMotion = false } = {}) {
  const animation = getStageAnimationProfile(stageOrUniverse);
  if (!animation) return null;
  const stage = typeof stageOrUniverse === 'object' && stageOrUniverse ? stageOrUniverse : {};
  const seconds = reducedMotion || stage.reducedMotion ? 0 : Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  const progress = wrap(seconds, animation.periodSeconds) / animation.periodSeconds;
  const frameIndex = animation.atlas ? animation.atlas.frameOrder[Math.min(animation.atlas.frameOrder.length - 1, Math.floor(progress * animation.atlas.frameOrder.length))] : null;
  return Object.freeze({
    profileId: animation.id, elapsedSeconds: seconds, progress, phase: progress * Math.PI * 2,
    frameIndex, frameCount: animation.atlas?.frameCount || 0,
    sourceVisualValidation: animation.sourceVisualValidation
  });
}

const imageCache = new Map();
const imageEntry = path => {
  if (!path || typeof Image === 'undefined') return null;
  const cached = imageCache.get(path);
  if (cached) return cached.status === 'ready' ? cached : null;
  const image = new Image();
  const entry = { image, status: 'loading' };
  image.decoding = 'async';
  image.onload = () => { entry.status = 'ready'; };
  image.onerror = () => { entry.status = 'error'; };
  image.src = path;
  if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) entry.status = 'ready';
  imageCache.set(path, entry);
  return entry.status === 'ready' ? entry : null;
};
const strokePath = (ctx, points) => {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.stroke();
};
const polygon = (ctx, points) => {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fill();
};

function drawBackdropPatch(ctx, animation, frame, width, height) {
  const spec = animation.activeLocalBackdrop;
  const entry = imageEntry(spec?.path);
  if (!entry) return false;
  const image = entry.image;
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  const targetRatio = width / height;
  const sw = iw / ih > targetRatio ? ih * targetRatio : iw;
  const sh = iw / ih > targetRatio ? ih : iw / targetRatio;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  const region = spec.region;
  const rx = region.x * iw;
  const ry = region.y * ih;
  const rw = region.width * iw;
  const rh = region.height * ih;
  const dx = (rx - sx) / sw * width;
  const dy = (ry - sy) / sh * height;
  const dw = rw / sw * width;
  const dh = rh / sh * height;
  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();
  ctx.globalCompositeOperation = spec.motion === 'glow' ? 'screen' : 'source-over';
  ctx.globalAlpha = spec.motion === 'glow' ? 0.035 + (1 + Math.sin(frame.phase)) * 0.025 : 0.1;
  const offsetX = spec.motion === 'clouds' ? Math.sin(frame.phase) * width * 0.006 : spec.motion === 'water' ? Math.sin(frame.phase) * width * 0.0015 : 0;
  const offsetY = spec.motion === 'waterfall' ? frame.progress * height * 0.009 : 0;
  ctx.drawImage(image, rx, ry, rw, rh, dx + offsetX, dy + offsetY, dw, dh);
  ctx.restore();
  return true;
}

function drawLocalAtlas(ctx, animation, frame, width, height) {
  const atlas = animation.atlas;
  const entry = imageEntry(atlas?.path);
  if (!entry) return false;
  const image = entry.image;
  const frameWidth = image.naturalWidth / atlas.columns;
  const frameHeight = image.naturalHeight / atlas.rows;
  const size = Math.min(width * atlas.size, height * atlas.size * 1.5);
  ctx.globalAlpha = 0.18;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, frame.frameIndex * frameWidth, 0, frameWidth, frameHeight, width * atlas.x - size / 2, height * atlas.y - size / 2, size, size);
  return true;
}

function drawMechanism(ctx, animation, frame, width, height) {
  const phase = frame.phase;
  const seconds = frame.elapsedSeconds;
  ctx.strokeStyle = animation.color;
  ctx.fillStyle = animation.color;
  ctx.lineWidth = Math.max(1, width / 1000);
  if (animation.animationWave === 11 && drawStageAnimationWave11(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 10 && drawStageAnimationWave10(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 9 && drawStageAnimationWave9(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 8 && drawStageAnimationWave8(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 7 && drawStageAnimationWave7(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 6 && drawStageAnimationWave6(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 5 && drawStageAnimationWave5(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 4 && drawStageAnimationWave4(ctx, animation, frame, width, height)) return;
  if (animation.animationWave === 3 && drawStageAnimationWave3(ctx, animation, frame, width, height)) return;
  if (animation.animationProvenance && drawStageAnimationWave2(ctx, animation, frame, width, height)) return;
  switch (animation.mechanism) {
    case 'mako-circulation':
      for (let tube = 0; tube < 3; tube++) {
        const x = width * (0.43 + tube * 0.07);
        ctx.globalAlpha = 0.065;
        ctx.strokeRect(x, height * 0.24, width * 0.026, height * 0.28);
        for (let bubble = 0; bubble < 5; bubble++) {
          const progress = wrap(frame.progress + bubble / 5 + tube * 0.17);
          ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.14;
          ctx.beginPath();
          ctx.ellipse(x + width * 0.013, height * (0.5 - progress * 0.23), width * 0.004, height * 0.006, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;
    case 'cell-games-clouds':
      for (let cloud = 0; cloud < 4; cloud++) {
        const x = width * wrap(cloud * 0.29 + frame.progress * 0.08);
        const y = height * (0.13 + cloud % 2 * 0.075);
        ctx.globalAlpha = 0.045;
        for (let lobe = 0; lobe < 3; lobe++) {
          ctx.beginPath();
          ctx.ellipse(x + lobe * width * 0.021, y - Math.sin(lobe) * height * 0.012, width * 0.034, height * 0.016, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    case 'namek-water':
      for (let stream = 0; stream < 7; stream++) {
        ctx.globalAlpha = 0.085;
        strokePath(ctx, Array.from({ length: 14 }, (_, index) => [width * (0.04 + index * 0.07), height * (0.42 + stream * 0.018 + Math.sin(index * 0.8 + phase + stream) * 0.005)]));
      }
      break;
    case 'time-chamber-hourglasses':
      for (const side of [0.08, 0.92]) {
        const x = width * side;
        const y = height * 0.19;
        const half = width * 0.014;
        const bottom = y + height * 0.15;
        ctx.globalAlpha = 0.12;
        strokePath(ctx, [[x - half, y], [x + half, y], [x - half, bottom], [x + half, bottom], [x - half, y]]);
        const level = 0.3 + Math.sin(phase) * 0.07;
        polygon(ctx, [[x - half * 0.75, bottom - height * level * 0.1], [x, bottom - height * 0.045], [x + half * 0.75, bottom - height * level * 0.1]]);
        for (let grain = 0; grain < 4; grain++) ctx.fillRect(x, y + height * (0.065 + wrap(frame.progress + grain / 4) * 0.045), 1, 1);
      }
      break;
    case 'forest-canopy':
      for (let branch = 0; branch < 6; branch++) {
        const x = width * (branch < 3 ? 0.04 + branch * 0.035 : 0.88 + (branch - 3) * 0.035);
        const sway = Math.sin(phase + branch * 0.8) * width * 0.006;
        const y = height * (0.12 + branch % 3 * 0.055);
        ctx.globalAlpha = 0.12;
        strokePath(ctx, [[x, y], [x + sway, y + height * 0.085]]);
        for (let leaf = 0; leaf < 3; leaf++) polygon(ctx, [[x + sway, y + leaf * height * 0.025], [x + sway + width * 0.014, y + height * (0.015 + leaf * 0.025)], [x + sway, y + height * (0.025 + leaf * 0.025)]]);
      }
      break;
    case 'valley-waterfall':
      for (let stream = 0; stream < 11; stream++) {
        const x = width * (0.46 + stream * 0.008);
        const progress = wrap(frame.progress * 2 + stream * 0.13);
        ctx.globalAlpha = 0.085;
        strokePath(ctx, [[x, height * (0.26 + progress * 0.16)], [x + width * 0.001, height * (0.33 + progress * 0.16)]]);
      }
      for (let ripple = 0; ripple < 3; ripple++) {
        ctx.globalAlpha = 0.09 * (1 - wrap(frame.progress + ripple / 3));
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.51, width * (0.025 + wrap(frame.progress + ripple / 3) * 0.1), height * 0.008, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'matrix-terminals':
      for (let panel = 0; panel < 3; panel++) {
        const x = width * (0.08 + panel * 0.32);
        const y = height * (0.18 + panel % 2 * 0.08);
        ctx.globalAlpha = 0.13;
        ctx.strokeRect(x, y, width * 0.18, height * 0.16);
        for (let column = 0; column < 7; column++) for (let row = 0; row < 4; row++) {
          const progress = wrap(frame.progress + column * 0.1 + panel * 0.2 + row * 0.25);
          ctx.globalAlpha = 0.025 + progress * 0.09;
          ctx.fillRect(x + width * (0.012 + column * 0.023), y + height * (0.02 + row * 0.03), width * 0.009, height * 0.006);
        }
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x + width * 0.008, y + height * (0.015 + frame.progress * 0.13), width * 0.164, Math.max(1, height * 0.002));
      }
      break;
    case 'matrix-code-curtain':
      for (let column = 0; column < 12; column++) {
        const x = width * (column < 6 ? 0.035 + column * 0.018 : 0.84 + (column - 6) * 0.018);
        for (let glyph = 0; glyph < 7; glyph++) {
          const progress = wrap(frame.progress + column * 0.17 + glyph * 0.045);
          const y = height * (0.1 + progress * 0.43);
          ctx.globalAlpha = 0.04 + (1 - progress) * 0.1;
          strokePath(ctx, [[x, y], [x + 3, y], [x + 3, y + 5], [x + 1, y + 3], [x + 5, y + 3]]);
        }
      }
      break;
    case 'uac-cooling-fans':
      for (const side of [0.15, 0.85]) {
        const x = width * side;
        const y = height * 0.3;
        const radius = height * 0.055;
        ctx.globalAlpha = 0.13;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
        for (let blade = 0; blade < 5; blade++) {
          const a = phase + blade * Math.PI * 2 / 5;
          polygon(ctx, [[x, y], [x + Math.cos(a) * radius * 0.85, y + Math.sin(a) * radius * 0.85], [x + Math.cos(a + 0.5) * radius * 0.65, y + Math.sin(a + 0.5) * radius * 0.65]]);
        }
        ctx.globalAlpha = 0.08 + Math.sin(phase) * 0.025;
        ctx.fillRect(x - radius, y + radius * 1.4, radius * 2, height * 0.005);
      }
      break;
    case 'argent-chains':
      for (const side of [0.08, 0.13, 0.87, 0.92]) for (let link = 0; link < 11; link++) {
        ctx.globalAlpha = 0.11;
        ctx.beginPath();
        ctx.ellipse(width * side, height * (0.1 + wrap(link / 11 + frame.progress * 0.4) * 0.42), width * 0.0027, height * 0.007, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'covenant-gravity-lift': {
      const x = width * 0.79;
      ctx.globalAlpha = 0.035;
      polygon(ctx, [[x - width * 0.018, height * 0.16], [x + width * 0.018, height * 0.16], [x + width * 0.07, height * 0.54], [x - width * 0.07, height * 0.54]]);
      for (let ring = 0; ring < 7; ring++) {
        const progress = wrap(frame.progress + ring / 7);
        ctx.globalAlpha = 0.12 * Math.sin(progress * Math.PI);
        ctx.beginPath(); ctx.ellipse(x, height * (0.53 - progress * 0.35), width * (0.065 - progress * 0.044), height * 0.008, 0, 0, Math.PI * 2); ctx.stroke();
      }
      break;
    }
    case 'forerunner-beacons':
      for (const side of [0.12, 0.83, 0.92]) {
        const x = width * side;
        ctx.globalAlpha = 0.1;
        strokePath(ctx, [[x - width * 0.008, height * 0.45], [x - width * 0.008, height * 0.23], [x, height * 0.2], [x + width * 0.008, height * 0.23], [x + width * 0.008, height * 0.45]]);
        ctx.globalAlpha = 0.09 + Math.sin(phase + side * 5) * 0.025;
        ctx.fillRect(x - width * 0.002, height * (0.25 + frame.progress * 0.12), width * 0.004, height * 0.06);
      }
      {
        const cx = width * 0.76;
        const cy = height * 0.23;
        const points = Array.from({ length: 4 }, (_, index) => [cx + Math.cos(phase + index * Math.PI / 2) * width * 0.03, cy + Math.sin(phase + index * Math.PI / 2) * height * 0.015]);
        ctx.globalAlpha = 0.14;
        strokePath(ctx, [...points, points[0]]);
        for (const point of points) strokePath(ctx, [point, [cx, cy - height * 0.06]]);
      }
      break;
    case 'stargate-chevron-sequence':
    case 'aperture-wall-circuit':
    case 'garage-portal-controller': {
      const atlas = animation.atlas;
      const cx = width * atlas.x;
      const cy = height * atlas.y;
      const radius = height * atlas.size * 0.4;
      ctx.globalAlpha = 0.1;
      for (let ring = 0; ring < 3; ring++) {
        const progress = wrap(frame.progress + ring / 3);
        ctx.beginPath(); ctx.ellipse(cx, cy, radius * (0.65 + progress * 0.35), radius * (0.72 + progress * 0.35), 0, 0, Math.PI * 2); ctx.stroke();
      }
      if (animation.mechanism === 'stargate-chevron-sequence') for (let chevron = 0; chevron < 7; chevron++) {
        const a = chevron / 7 * Math.PI * 2 - Math.PI / 2;
        ctx.globalAlpha = chevron <= Math.floor(frame.progress * 7) ? 0.17 : 0.035;
        ctx.fillRect(cx + Math.cos(a) * radius - 2, cy + Math.sin(a) * radius - 2, 4, 4);
      }
      else {
        ctx.globalAlpha = 0.09;
        strokePath(ctx, [[cx - radius * 1.5, cy], [cx - radius, cy], [cx - radius, cy + radius], [cx - radius * 0.3, cy + radius]]);
        ctx.fillRect(cx - radius * 1.6, cy - 2 + Math.sin(phase) * 2, 4, 4);
      }
      break;
    }
    case 'alive-led-grid': {
      const topX = width * 0.5;
      const topY = height * 0.14;
      for (let row = 1; row < 10; row++) {
        const extent = width * 0.18 * row / 10;
        const y = topY + height * 0.36 * row / 10;
        for (let cell = 0; cell < row; cell++) {
          const active = (cell + row + Math.floor(seconds * 0.5)) % 4 === 0;
          ctx.globalAlpha = active ? 0.14 : 0.035;
          ctx.fillRect(topX - extent + extent * 2 * cell / row, y, extent * 1.5 / row, height * 0.008);
        }
      }
      ctx.globalAlpha = 0.1;
      strokePath(ctx, [[topX - width * 0.18, height * 0.5], [topX, topY], [topX + width * 0.18, height * 0.5]]);
      break;
    }
    case 'infinity-sliding-screens':
      for (const side of [0.06, 0.85]) {
        const x = width * (side + Math.sin(phase) * (side < 0.5 ? -0.012 : 0.012));
        ctx.globalAlpha = 0.1;
        ctx.strokeRect(x, height * 0.13, width * 0.1, height * 0.39);
        for (let slat = 1; slat < 5; slat++) strokePath(ctx, [[x, height * (0.13 + slat * 0.065)], [x + width * 0.1, height * (0.13 + slat * 0.065)]]);
        strokePath(ctx, [[x + width * 0.05, height * 0.13], [x + width * 0.05, height * 0.52]]);
      }
      break;
  }
}

/** Before actors, collision surfaces, event telegraphs and HUD; no game state. */
export function renderStageAnimation(ctx, { stage = {}, width, height, elapsedSeconds = 0, reducedMotion = false } = {}) {
  const animation = getStageAnimationProfile(stage);
  if (!ctx || !animation?.enabled || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) return false;
  const frame = getStageAnimationFrame(stage, elapsedSeconds, { reducedMotion });
  ctx.save();
  try {
    ctx.beginPath();
    ctx.rect(0, height * 0.065, width, height * 0.55);
    ctx.clip();
    ctx.globalCompositeOperation = 'source-over';
    drawMechanism(ctx, animation, frame, width, height);
    drawBackdropPatch(ctx, animation, frame, width, height);
    drawLocalAtlas(ctx, animation, frame, width, height);
  } finally {
    ctx.restore();
  }
  return true;
}
