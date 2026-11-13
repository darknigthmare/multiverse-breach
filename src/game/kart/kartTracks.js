import { HEROES_DB } from '../heroes.js';
import { EXPANDED_UNIVERSES } from '../expandedUniverses.js';
import { STAGE_LORE_PROFILES } from '../stageLoreProfiles.js';
import { isUniverseInstalled } from '../dlcInstallation.js';
import originalManifest from '../originalUniversesManifest.json' with { type: 'json' };
import {
  KART_CURATED_TRACK_DESIGNS, KART_OC_LAYOUT_BY_MOTIF, KART_OC_THEME_BY_MOTIF,
  KART_THEME_LANDMARKS, KART_THEME_PALETTES
} from './kartTrackDesigns.js';

export { KART_CURATED_TRACK_DESIGNS } from './kartTrackDesigns.js';

const SOURCE_BASE = 'https://github.com/darknigthmare/multiverse-breach/blob/master/';
const expandedByUniverse = new Map(EXPANDED_UNIVERSES.map(universe => [universe.universe, universe]));
const originalByUniverse = new Map(originalManifest.universes.map(universe => [universe.universe, universe]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const stableHash = value => {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** Stable even if a universe is inserted, hidden, or removed from a distribution. */
export const getKartUniverseTrackId = universe => {
  const slug = String(universe).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 74) || 'universe';
  return `kart-${slug}-${stableHash(universe).toString(16).padStart(8, '0')}`;
};

// All coordinates belong to EngineRace's 960 x 540 simulation. Renderers must use
// these segments as-is; visually smoothing a corner would move the actual road.
export const KART_COURSE_LAYOUTS = Object.freeze({
  atrium: [[480, 432], [325, 423], [210, 365], [153, 272], [205, 174], [320, 116], [480, 101], [642, 120], [755, 181], [812, 278], [747, 377], [624, 428]],
  coast: [[480, 435], [308, 420], [181, 359], [126, 268], [172, 161], [305, 109], [465, 102], [642, 116], [782, 178], [833, 286], [746, 398], [611, 440]],
  canyon: [[480, 440], [332, 435], [191, 387], [128, 293], [178, 183], [275, 115], [405, 105], [526, 149], [650, 112], [787, 163], [832, 266], [765, 365], [666, 426], [566, 403]],
  freighter: [[480, 442], [323, 442], [208, 385], [145, 299], [145, 190], [249, 115], [420, 104], [571, 104], [725, 146], [815, 232], [815, 339], [704, 428], [599, 442]],
  service: [[480, 440], [338, 440], [207, 389], [139, 289], [174, 175], [286, 111], [434, 112], [562, 144], [706, 125], [808, 218], [813, 340], [697, 418], [585, 437]],
  lagoon: [[480, 435], [343, 410], [202, 373], [134, 280], [181, 169], [308, 112], [438, 140], [571, 109], [728, 137], [816, 228], [808, 338], [684, 422], [585, 443]],
  dial: [[480, 442], [325, 418], [209, 346], [169, 231], [260, 147], [410, 101], [553, 101], [697, 159], [788, 263], [742, 372], [622, 431]],
  grove: [[480, 440], [352, 418], [237, 389], [145, 304], [158, 207], [252, 129], [384, 104], [513, 130], [649, 109], [775, 177], [820, 280], [749, 383], [626, 431]],
  temple: [[480, 435], [313, 435], [211, 382], [151, 284], [208, 182], [313, 122], [480, 102], [647, 123], [753, 205], [812, 315], [730, 414], [611, 437]],
  harbor: [[480, 442], [332, 442], [195, 388], [132, 293], [167, 197], [267, 120], [394, 107], [490, 164], [588, 161], [687, 112], [804, 171], [831, 275], [751, 363], [635, 430]],
  fortress: [[480, 440], [345, 440], [224, 402], [148, 321], [145, 214], [229, 133], [354, 103], [508, 103], [658, 105], [779, 166], [815, 279], [777, 389], [636, 437]],
  reactor: [[480, 441], [342, 423], [227, 370], [168, 272], [222, 168], [342, 111], [480, 109], [617, 130], [754, 180], [810, 283], [746, 379], [619, 423]],
  quarry: [[480, 440], [340, 440], [205, 390], [132, 288], [182, 178], [295, 113], [443, 111], [583, 118], [725, 146], [809, 236], [813, 340], [704, 408], [590, 437]],
  laboratory: [[480, 440], [344, 440], [224, 394], [148, 315], [146, 211], [222, 134], [351, 104], [490, 104], [633, 111], [762, 159], [815, 260], [795, 367], [680, 426], [586, 440]],
  village: [[480, 439], [346, 425], [220, 387], [147, 292], [173, 191], [284, 118], [429, 106], [562, 121], [701, 145], [799, 221], [818, 332], [722, 408], [603, 437]]
});

export const KART_TRACK_FIDELITY_LABELS = Object.freeze({
  'adaptation-unverified': { fr: 'Décor adapté — fidélité à vérifier', en: 'Adapted environment — fidelity unverified' },
  'original-unverified': { fr: 'Décor OC — validation visuelle ouverte', en: 'Original environment — visual review open' },
  'prototype-unverified': { fr: 'Prototype — décor source à produire', en: 'Prototype — source environment pending' }
});

const colorHex = (value, fallback) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

const inferTheme = ({ lore, expanded }) => {
  const text = [lore?.visualAnchor, lore?.canonicalName, expanded?.visualAnchor,
    expanded?.stageName, expanded?.decor?.motif, expanded?.theme, expanded?.faction].filter(Boolean).join(' ').toLowerCase();
  const themes = [
    ['ocean', /abyss|submerged|underwater|ocean|coral|drowned|aquatic/],
    ['clockwork', /clock|horloge|cadran|chronobank|astrarium/],
    ['voxel', /voxel|minecraft/],
    ['snow', /arctic|antarctic|snow|ice station|tundra|frozen|neige/],
    ['desert', /desert|sandstone|pyramid|dune|abydos|egypt/],
    ['coast', /harbor|harbour|pirate|island|coast|shore|port sans|beach/],
    ['forest', /forest|jungle|grove|garden|canopy|arbres|world-tree|torii/],
    ['castle', /castle|citadel|cathedral|gothic|château|kingdom|palace|acad[eé]mie|academy/],
    ['infernal', /infernal|hell|lava|volcan|mordor|inferno/],
    ['laboratory', /laboratory|research|medical|laboratoire|aperture|clinic/],
    ['industrial', /industrial|factory|facility|reactor|freighter|foundry|hangar|warfront|power station/],
    ['ruins', /ruin|temple|marble|forum|labyrinth|ancient/],
    ['orbital', /orbit|space|starship|starbase|starfield|cosmos/],
    ['stage', /music|concert|stage|rhythm|performance|theater|théâtre|studio|festival/],
    ['city', /city|town|rue|metro|cyber|street|urban|road/]
  ];
  return themes.find(([, pattern]) => pattern.test(text))?.[0] || 'nexus';
};

const samplePath = (points, fraction) => {
  const lengths = points.map((point, index) => Math.hypot(
    points[(index + 1) % points.length].x - point.x,
    points[(index + 1) % points.length].y - point.y
  ));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = clamp(fraction, 0, 0.999999) * total;
  for (let index = 0; index < points.length; index += 1) {
    if (distance > lengths[index] && index < points.length - 1) { distance -= lengths[index]; continue; }
    const a = points[index];
    const b = points[(index + 1) % points.length];
    const t = distance / Math.max(1, lengths[index]);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  return { ...points[0], angle: 0 };
};

/** A solid landmark never describes a drivable route or an invisible obstacle. */
export const isKartLandmarkClearOfRoad = (landmark, track, extraMargin = 20) => {
  const margin = track.roadWidth / 2 + extraMargin;
  const halfX = (landmark.width || 38) * (landmark.scale || 1) / 2 + margin;
  const halfZ = (landmark.depth || 38) * (landmark.scale || 1) / 2 + margin;
  const cosine = Math.cos(landmark.rotation || 0);
  const sine = Math.sin(landmark.rotation || 0);
  const localPoint = point => {
    const x = point.x - landmark.x;
    const z = point.y - landmark.z;
    return [x * cosine - z * sine, x * sine + z * cosine];
  };
  const crossesFootprint = (a, b) => {
    let from = 0;
    let to = 1;
    for (let axis = 0; axis < 2; axis += 1) {
      const extent = axis === 0 ? halfX : halfZ;
      const delta = b[axis] - a[axis];
      if (Math.abs(delta) < 1e-9) {
        if (Math.abs(a[axis]) > extent) return false;
      } else {
        const p = (-extent - a[axis]) / delta;
        const q = (extent - a[axis]) / delta;
        from = Math.max(from, Math.min(p, q));
        to = Math.min(to, Math.max(p, q));
        if (from > to) return false;
      }
    }
    return from <= to;
  };
  return !track.waypoints.some((point, index) => crossesFootprint(
    localPoint(point), localPoint(track.waypoints[(index + 1) % track.waypoints.length])
  ));
};

const settleLandmark = (landmark, track) => {
  // Keep deliberate silhouettes but shrink their floor footprint if it clips the
  // road. Height is preserved; a cathedral remains tall, without occupying tarmac.
  let settled = { ...landmark, scale: landmark.scale || 1, collision: false };
  for (let step = 0; step < 10 && !isKartLandmarkClearOfRoad(settled, track); step += 1) {
    settled = { ...settled, width: settled.width * 0.86, depth: settled.depth * 0.86 };
  }
  if (!isKartLandmarkClearOfRoad(settled, track)) {
    const x = settled.x < 480 ? -90 : 1050;
    settled = { ...settled, x };
  }
  return Object.freeze(settled);
};

const themeLayout = { nexus: 'atrium', coast: 'coast', industrial: 'service', desert: 'canyon',
  forest: 'grove', snow: 'quarry', city: 'village', castle: 'fortress', ruins: 'temple',
  infernal: 'reactor', ocean: 'lagoon', clockwork: 'dial', orbital: 'laboratory', stage: 'atrium', voxel: 'quarry', laboratory: 'laboratory' };

const makeProvisionalLandmarks = (theme, seed, colors, labels = []) => {
  const kinds = KART_THEME_LANDMARKS[theme];
  const positions = [[480, 265], [320, 267], [655, 265]];
  return positions.map(([x, z], index) => ({
    kind: kinds[index], label: labels[index] || 'Volume de composition à détailler', x, z,
    width: index === 0 ? 102 : 62, depth: index === 0 ? 84 : 58,
    height: 72 + ((seed >>> (index * 5)) % 5) * 18,
    color: colors.shoulder, accent: colors.accent, rotation: 0
  }));
};

const addTracksideLandmarks = (track, environment, seed, count) => {
  const result = [];
  const kinds = KART_THEME_LANDMARKS[environment.theme];
  for (let index = 0; index < count; index += 1) {
    const fraction = (index + 0.35) / count;
    const anchor = samplePath(track.waypoints, fraction);
    const side = index % 2 ? 1 : -1;
    const offset = track.roadWidth / 2 + 38 + ((seed >>> (index % 20)) % 4) * 8;
    const candidate = {
      kind: kinds[index % kinds.length], label: 'Décor latéral',
      x: anchor.x - Math.sin(anchor.angle) * offset * side,
      z: anchor.y + Math.cos(anchor.angle) * offset * side,
      width: 22 + (index % 3) * 5, height: 28 + (index % 4) * 13, depth: 24,
      color: environment.shoulder, accent: environment.accent, rotation: -anchor.angle,
      collision: false, decorative: true
    };
    // Failed candidates are omitted rather than placed over another part of road.
    if (isKartLandmarkClearOfRoad(candidate, track)) result.push(Object.freeze(candidate));
  }
  return result;
};

const sourceReferences = (design, lore, expanded, original) => [...new Set([
  ...(design?.references || []), ...(lore?.referenceUrls || []),
  ...(expanded?.referenceUrls || []), ...(expanded?.referenceUrl ? [expanded.referenceUrl] : []),
  ...(original ? [`${SOURCE_BASE}src/game/originalUniversesManifest.json`] : []),
  `${SOURCE_BASE}src/game/heroes.js`
].filter(value => typeof value === 'string' && /^https:\/\//.test(value)))];

const makeCourse = (universe, heroes) => {
  const seed = stableHash(universe);
  const design = KART_CURATED_TRACK_DESIGNS[universe];
  const lore = STAGE_LORE_PROFILES[universe];
  const expanded = expandedByUniverse.get(universe);
  const original = originalByUniverse.get(universe);
  const theme = design?.theme || KART_OC_THEME_BY_MOTIF[original?.visual?.motif] || inferTheme({ lore, expanded });
  const colors = { ...KART_THEME_PALETTES[theme], ...(design?.palette || {}) };
  if (original) {
    colors.sky = colorHex(original.visual.colors.sky[0], colors.sky);
    colors.fog = colors.sky;
    colors.ground = colorHex(original.visual.colors.floor, colors.ground);
    colors.shoulder = colorHex(original.visual.colors.grid, colors.shoulder);
    colors.accent = colorHex(original.visual.colors.accent, colors.accent);
  } else if (!design) {
    colors.sky = colorHex(expanded?.decor?.sky?.[0], colors.sky);
    colors.fog = colors.sky;
    colors.accent = colorHex(expanded?.decor?.accent, colors.accent);
  }
  const layouts = Object.keys(KART_COURSE_LAYOUTS);
  const layoutKey = design?.layout || KART_OC_LAYOUT_BY_MOTIF[original?.visual?.motif]
    || (seed % 3 === 0 ? layouts[seed % layouts.length] : themeLayout[theme]);
  const waypoints = KART_COURSE_LAYOUTS[layoutKey].map(([x, y], index) => {
    // Authored layouts stay literal. Prototypes receive bounded deterministic
    // offsets; no random seed can make two sections cross or move the start grid.
    const dx = !design && index !== 0 ? ((seed >>> (index % 18)) % 9) - 4 : 0;
    const dy = !design && index !== 0 ? ((seed >>> ((index + 5) % 18)) % 7) - 3 : 0;
    return Object.freeze({ x: x + dx, y: y + dy });
  });
  const peaceful = expanded?.stageMeta?.nonCombat === true
    || expanded?.nonCombat === true || expanded?.mode === 'Trial'
    || heroes.every(hero => hero.nonCombat === true || hero.mode === 'Trial');
  const difficulty = design?.difficulty || (original ? 2 : 1 + seed % 3);
  const roadWidth = design?.roadWidth || 92 + (seed % 3) * 4;
  const isOriginal = Boolean(design?.original || original || expanded?.originalContent);
  const fidelityStatus = design ? (isOriginal ? 'original-unverified' : 'adaptation-unverified')
    : original ? 'original-unverified' : 'prototype-unverified';
  const sourceLocation = design?.place || original?.stages?.[0]?.name?.fr
    || (!lore?.generationBlocked && (lore?.canonicalName || expanded?.stageName)) || null;
  const name = design ? { fr: design.name[0], en: design.name[1] }
    : original ? { fr: `${original.stages[0].name.fr} — Circuit`, en: `${original.stages[0].name.en || original.stages[0].name.fr} — Circuit` }
      : { fr: `${universe} — Piste d’essai`, en: `${universe} — Test Circuit` };
  const track = {
    id: getKartUniverseTrackId(universe), name, universe, sourceUniverses: [universe],
    family: 'universe', layoutKey, difficulty, laps: 3, roadWidth, offroadDrag: 0.9,
    tags: ['universe', theme, design ? 'authored-layout' : 'prototype', ...(peaceful ? ['scenic-rally'] : ['classic'])],
    sourceLocation, continuity: design?.continuity || expanded?.continuity || expanded?.canonProfile?.continuity || '',
    description: {
      fr: design?.description || (original
        ? `Parcours de course original dans ${sourceLocation}, avec la palette et les repères de la bible de ${universe}.`
        : `Piste de conduite dédiée à ${universe}. Le tracé et les volumes sont provisoires ; les détails du lieu de référence restent à produire.`),
      en: design ? `${design.place}. Original kart adaptation; visual fidelity remains unverified.`
        : original ? `Original race route through ${sourceLocation}, using ${universe}'s project palette and locations.`
          : `Driving prototype for ${universe}. Source-specific environment details are still pending.`
    },
    objective: { type: 'podium', targetRank: 3 },
    start: { ...waypoints[0], angle: Math.atan2(waypoints[1].y - waypoints[0].y, waypoints[1].x - waypoints[0].x) },
    waypoints,
    checkpoints: [0, 0.25, 0.5, 0.75].map(fraction => ({ ...samplePath(waypoints, fraction), r: Math.min(68, roadWidth * 0.62) })),
    boostPads: [0.12, 0.49, 0.80].map(fraction => ({ ...samplePath(waypoints, fraction) })),
    itemBoxes: peaceful ? [] : [0.20, 0.43, 0.69, 0.90].map(fraction => ({ ...samplePath(waypoints, fraction), respawn: 0 })),
    // Hazards are placed away from the starting grid; their small footprint leaves
    // a passing lane when the existing engine moves them across the road.
    hazards: peaceful ? [] : [0.34, 0.73].map((fraction, index) => ({
      ...samplePath(waypoints, fraction), r: 14 + Math.min(4, difficulty), phase: index * 1.7
    })),
    surfaceZones: peaceful || theme === 'laboratory' ? [] : [{
      ...samplePath(waypoints, 0.61), type: theme === 'snow' ? 'ice' : 'slow', r: 21
    }],
    raceRules: { contactItems: !peaceful, hazards: !peaceful, sourceNonCombat: peaceful },
    fidelityStatus, fidelityReviewed: false, referenceReconstruction: false
  };
  const references = sourceReferences(design, lore, expanded, original);
  const landmarks = design?.landmarks || makeProvisionalLandmarks(theme, seed, colors,
    original?.stages?.map(stage => stage.name.fr) || []);
  const environment = {
    ...colors, theme, sourceLocation, fidelityStatus,
    references, referenceEvidence: design?.checkedReference || (isOriginal
      ? 'Palette et noms lus dans le canon original du projet ; formes 3D à valider.'
      : 'Ancres et références héritées du catalogue du projet ; pas de comparaison graphique validée.'),
    sourceVisualAnchor: lore?.visualAnchor || expanded?.visualAnchor || original?.visual?.motif || '',
    referenceResearchBlocked: Boolean(lore?.generationBlocked),
    landmarks: landmarks.map(landmark => settleLandmark(landmark, track))
  };
  environment.landmarks.push(...addTracksideLandmarks(track, environment, seed, design ? 26 : 18));
  track.environment = Object.freeze({ ...environment, landmarks: Object.freeze(environment.landmarks) });
  return Object.freeze(track);
};

/**
 * Injectable catalog construction makes DLC exclusion testable without rewriting
 * distribution files. No direct DLC module is imported from this new subsystem.
 */
export function createKartUniverseTracks({ heroes = HEROES_DB, hiddenUniverses = [], isInstalled = isUniverseInstalled } = {}) {
  const hidden = new Set(Array.isArray(hiddenUniverses) ? hiddenUniverses : []);
  const grouped = new Map();
  for (const hero of heroes) {
    if (!hero?.id || !hero.universe || hidden.has(hero.universe) || !isInstalled(hero.universe)) continue;
    if (!grouped.has(hero.universe)) grouped.set(hero.universe, []);
    grouped.get(hero.universe).push(hero);
  }
  const tracks = {};
  for (const [universe, entries] of grouped) {
    const track = makeCourse(universe, entries);
    tracks[track.id] = track;
  }
  return Object.freeze(tracks);
}

let installedTracks;
export function getKartUniverseTracks({ hiddenUniverses = [] } = {}) {
  if (!installedTracks) installedTracks = createKartUniverseTracks();
  if (!hiddenUniverses?.length) return installedTracks;
  const hidden = new Set(hiddenUniverses);
  return Object.fromEntries(Object.entries(installedTracks).filter(([, track]) => !hidden.has(track.universe)));
}

/** Legacy Nexus tracks keep their IDs, physics and saves, with the same 3D theme. */
export function getKartTrackEnvironment(track) {
  if (track?.environment) return track.environment;
  const legacyBase = {
    waypoints: track?.waypoints || KART_COURSE_LAYOUTS.atrium.map(([x, y]) => ({ x, y })),
    roadWidth: track?.roadWidth || 108
  };
  const design = KART_CURATED_TRACK_DESIGNS['Nexus de Convergence'];
  return {
    ...KART_THEME_PALETTES.nexus, theme: 'nexus', sourceLocation: design.place,
    fidelityStatus: 'original-unverified', references: design.references,
    landmarks: design.landmarks.map(landmark => settleLandmark(landmark, legacyBase))
  };
}

export function getKartTrackCoverage(tracks = getKartUniverseTracks()) {
  const entries = Object.values(tracks);
  return {
    tracks: entries.length, universes: new Set(entries.map(track => track.universe)).size,
    authored: entries.filter(track => track.tags.includes('authored-layout')).length,
    original: entries.filter(track => track.fidelityStatus === 'original-unverified').length,
    prototypes: entries.filter(track => track.fidelityStatus === 'prototype-unverified').length,
    peaceful: entries.filter(track => track.raceRules.sourceNonCombat).length,
    fidelityVerified: entries.filter(track => track.fidelityReviewed === true).length
  };
}
