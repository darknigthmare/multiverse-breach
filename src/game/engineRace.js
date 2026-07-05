const MIRELLE_KART_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-mirelle-complete';

export const RACE_ASSETS = {
  kartDirections: `${MIRELLE_KART_BASE}/arca-mirelle-kart-directions.png`,
  kartActions: `${MIRELLE_KART_BASE}/arca-mirelle-kart-actions.png`,
  kartItems: `${MIRELLE_KART_BASE}/arca-mirelle-kart-items.png`,
  hudIcons: `${MIRELLE_KART_BASE}/arca-mirelle-hud-icons.png`,
  hudAvatar: `${MIRELLE_KART_BASE}/arca-mirelle-hud-avatar.png`,
  hudGarage: `${MIRELLE_KART_BASE}/arca-mirelle-kart-hud-garage.png`,
  trackNexus: `${MIRELLE_KART_BASE}/arca-mirelle-kart-track-nexus.png`
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const KART_ITEM_FRAMES = {
  boost: { col: 0, row: 0 },
  projectile: { col: 6, row: 1 },
  shield: { col: 3, row: 0 },
  trap: { col: 4, row: 2 },
  anchor: { col: 5, row: 0 },
  mirror: { col: 0, row: 4 },
  pulse: { col: 5, row: 2 },
  cache: { col: 0, row: 0 }
};

const OBJECTIVE_LABELS = {
  podium: 'Finir dans le podium',
  beatRival: 'Battre le rival cible',
  collectFragments: 'Recuperer les fragments',
  closePortals: 'Fermer les portails',
  timeLimit: 'Sceller avant surcharge'
};

const buildTrackFragments = (track) => {
  const waypoints = track.waypoints || [];
  if (waypoints.length < 4) return [];
  const count = Math.min(8, Math.max(4, Math.floor(waypoints.length * 0.65)));
  return Array.from({ length: count }, (_, index) => {
    const point = waypoints[(index * 2 + 1) % waypoints.length];
    const next = waypoints[(index * 2 + 2) % waypoints.length] || waypoints[0];
    const laneAngle = Math.atan2(next.y - point.y, next.x - point.x) + Math.PI / 2;
    const offset = (index % 2 === 0 ? -1 : 1) * Math.min(26, track.roadWidth * 0.24);
    return {
      x: point.x + Math.cos(laneAngle) * offset,
      y: point.y + Math.sin(laneAngle) * offset,
      r: 24,
      collected: false,
      value: 1
    };
  });
};

export const KART_GARAGE_UPGRADES = {
  engine: {
    label: { fr: 'Noyau moteur', en: 'Engine core' },
    maxLevel: 5,
    cost: level => 18 + level * 14,
    stat: 'maxSpeed'
  },
  grip: {
    label: { fr: 'Tissage grip', en: 'Grip weave' },
    maxLevel: 5,
    cost: level => 16 + level * 12,
    stat: 'turnRate'
  },
  capacitor: {
    label: { fr: 'Capaciteur turbo', en: 'Turbo capacitor' },
    maxLevel: 5,
    cost: level => 20 + level * 15,
    stat: 'boost'
  },
  stabilizer: {
    label: { fr: 'Stabilisateur', en: 'Stabilizer' },
    maxLevel: 5,
    cost: level => 14 + level * 10,
    stat: 'hazardResist'
  }
};

const drawSheetFrame = (ctx, image, columns, rows, col, row, dx, dy, dw, dh) => {
  if (!image?.complete || !image.naturalWidth) return false;
  const frameW = image.naturalWidth / columns;
  const frameH = image.naturalHeight / rows;
  ctx.drawImage(image, col * frameW, row * frameH, frameW, frameH, dx, dy, dw, dh);
  return true;
};

const angleDelta = (from, to) => {
  let delta = (to - from + Math.PI) % TAU - Math.PI;
  if (delta < -Math.PI) delta += TAU;
  return delta;
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const closestPointOnPath = (points = [], x, y, roadWidth = 100) => {
  if (points.length < 2) return { x, y, distance: 0, factor: 1 };
  let best = { x: points[0].x, y: points[0].y, distance: Infinity, factor: 0, segment: 0 };
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const lengthSq = vx * vx + vy * vy || 1;
    const t = clamp(((x - a.x) * vx + (y - a.y) * vy) / lengthSq, 0, 1);
    const px = a.x + vx * t;
    const py = a.y + vy * t;
    const d = Math.hypot(x - px, y - py);
    if (d < best.distance) {
      best = { x: px, y: py, distance: d, factor: clamp(1 - d / (roadWidth * 0.9), 0, 1), segment: i };
    }
  }
  return best;
};

export const KART_TRACK_LAYOUTS = {
  nexus_archive_loop: {
    id: 'nexus_archive_loop',
    name: { fr: 'Boucle Archive A.R.C.A.', en: 'A.R.C.A. Archive Loop' },
    family: 'nexus',
    difficulty: 1,
    tags: ['starter', 'wide', 'classic'],
    objective: { type: 'podium', targetRank: 3 },
    start: { x: 480, y: 474, angle: -Math.PI / 2 },
    laps: 3,
    roadWidth: 118,
    offroadDrag: 0.91,
    checkpoints: [
      { x: 480, y: 466, r: 90 },
      { x: 205, y: 300, r: 86 },
      { x: 480, y: 104, r: 92 },
      { x: 758, y: 300, r: 86 }
    ],
    waypoints: [
      { x: 480, y: 456 },
      { x: 322, y: 430 },
      { x: 178, y: 308 },
      { x: 235, y: 174 },
      { x: 480, y: 100 },
      { x: 722, y: 176 },
      { x: 785, y: 310 },
      { x: 640, y: 432 }
    ],
    boostPads: [
      { x: 336, y: 420, angle: -0.1 },
      { x: 626, y: 178, angle: 2.7 },
      { x: 750, y: 320, angle: 1.72 }
    ],
    surfaceZones: [
      { type: 'jump', x: 336, y: 420, r: 34, angle: -0.1 },
      { type: 'slow', x: 206, y: 300, r: 46 },
      { type: 'portal', x: 626, y: 178, r: 32, exit: { x: 704, y: 246, angle: 1.72 }, cooldown: 0 }
    ],
    itemBoxes: [
      { x: 254, y: 244, respawn: 0 },
      { x: 480, y: 122, respawn: 0 },
      { x: 704, y: 246, respawn: 0 },
      { x: 526, y: 438, respawn: 0 }
    ],
    hazards: [
      { x: 480, y: 300, r: 46, phase: 0 },
      { x: 178, y: 332, r: 28, phase: 1.3 },
      { x: 776, y: 284, r: 28, phase: 2.1 }
    ]
  },
  nexus_suture_eight: {
    id: 'nexus_suture_eight',
    name: { fr: 'Huit de Suture Nexus', en: 'Nexus Suture Eight' },
    family: 'nexus',
    difficulty: 2,
    tags: ['figureEight', 'technical', 'crossing'],
    objective: { type: 'beatRival', rivalId: 'loom', rivalName: 'Loom-07' },
    start: { x: 480, y: 474, angle: -Math.PI / 2 },
    laps: 3,
    roadWidth: 104,
    offroadDrag: 0.88,
    checkpoints: [
      { x: 480, y: 458, r: 78 },
      { x: 236, y: 308, r: 76 },
      { x: 480, y: 276, r: 82 },
      { x: 724, y: 180, r: 76 },
      { x: 480, y: 112, r: 80 },
      { x: 236, y: 180, r: 76 },
      { x: 480, y: 276, r: 82 },
      { x: 724, y: 308, r: 76 }
    ],
    waypoints: [
      { x: 480, y: 458 },
      { x: 316, y: 424 },
      { x: 210, y: 318 },
      { x: 290, y: 214 },
      { x: 480, y: 276 },
      { x: 670, y: 180 },
      { x: 752, y: 278 },
      { x: 642, y: 396 },
      { x: 480, y: 276 },
      { x: 316, y: 162 },
      { x: 480, y: 92 },
      { x: 642, y: 164 }
    ],
    boostPads: [
      { x: 490, y: 286, angle: -0.2 },
      { x: 640, y: 392, angle: -2.4 },
      { x: 330, y: 160, angle: 0.1 }
    ],
    surfaceZones: [
      { type: 'slow', x: 480, y: 276, r: 46 },
      { type: 'jump', x: 640, y: 392, r: 34, angle: -2.4 },
      { type: 'portal', x: 330, y: 160, r: 30, exit: { x: 690, y: 310, angle: 2.5 }, cooldown: 0 }
    ],
    itemBoxes: [
      { x: 270, y: 312, respawn: 0 },
      { x: 480, y: 124, respawn: 0 },
      { x: 690, y: 310, respawn: 0 },
      { x: 480, y: 284, respawn: 0 }
    ],
    hazards: [
      { x: 480, y: 276, r: 34, phase: 0.4 },
      { x: 236, y: 202, r: 24, phase: 1.8 },
      { x: 724, y: 250, r: 24, phase: 2.7 }
    ]
  },
  anchor_market_dash: {
    id: 'anchor_market_dash',
    name: { fr: 'Marche des Ancres', en: 'Anchor Market Dash' },
    family: 'nexus',
    difficulty: 2,
    tags: ['shortcut', 'urban', 'items'],
    objective: {
      type: 'collectFragments',
      required: 3,
      markers: [
        { x: 214, y: 254, r: 28 },
        { x: 604, y: 210, r: 28 },
        { x: 742, y: 188, r: 28 },
        { x: 400, y: 448, r: 28 }
      ]
    },
    start: { x: 440, y: 488, angle: -Math.PI / 2 },
    laps: 4,
    roadWidth: 96,
    offroadDrag: 0.86,
    checkpoints: [
      { x: 440, y: 468, r: 72 },
      { x: 210, y: 422, r: 70 },
      { x: 196, y: 178, r: 70 },
      { x: 486, y: 116, r: 78 },
      { x: 760, y: 184, r: 72 },
      { x: 706, y: 408, r: 72 }
    ],
    waypoints: [
      { x: 440, y: 468 },
      { x: 270, y: 462 },
      { x: 180, y: 382 },
      { x: 206, y: 198 },
      { x: 340, y: 126 },
      { x: 520, y: 102 },
      { x: 736, y: 164 },
      { x: 792, y: 300 },
      { x: 710, y: 420 },
      { x: 540, y: 454 }
    ],
    shortcuts: [
      { from: { x: 276, y: 392 }, to: { x: 604, y: 208 }, risk: 'hazard' }
    ],
    surfaceZones: [
      { type: 'slow', x: 410, y: 300, r: 54 },
      { type: 'jump', x: 604, y: 210, r: 34, angle: -0.9 },
      { type: 'portal', x: 276, y: 392, r: 30, exit: { x: 604, y: 208, angle: -0.35 }, cooldown: 0 }
    ],
    boostPads: [
      { x: 278, y: 456, angle: -0.8 },
      { x: 760, y: 306, angle: 1.95 },
      { x: 590, y: 438, angle: 3.05 }
    ],
    itemBoxes: [
      { x: 214, y: 254, respawn: 0 },
      { x: 494, y: 116, respawn: 0 },
      { x: 742, y: 188, respawn: 0 },
      { x: 604, y: 210, respawn: 0 },
      { x: 400, y: 448, respawn: 0 }
    ],
    hazards: [
      { x: 410, y: 300, r: 26, phase: 0.2 },
      { x: 586, y: 222, r: 25, phase: 1.4 },
      { x: 760, y: 364, r: 22, phase: 2.6 }
    ]
  },
  fragment_frostway: {
    id: 'fragment_frostway',
    name: { fr: 'Glissade des Fragments', en: 'Fragment Frostway' },
    family: 'nexus',
    difficulty: 3,
    tags: ['slippery', 'wide', 'survival'],
    objective: { type: 'timeLimit', seconds: 92 },
    start: { x: 520, y: 486, angle: -Math.PI / 2 },
    laps: 3,
    roadWidth: 126,
    offroadDrag: 0.83,
    surfaceZones: [
      { type: 'ice', x: 236, y: 236, r: 92 },
      { type: 'ice', x: 726, y: 350, r: 86 },
      { type: 'jump', x: 576, y: 96, r: 34, angle: 0.3 },
      { type: 'slow', x: 186, y: 354, r: 42 }
    ],
    checkpoints: [
      { x: 520, y: 462, r: 82 },
      { x: 230, y: 384, r: 84 },
      { x: 238, y: 178, r: 82 },
      { x: 526, y: 94, r: 84 },
      { x: 772, y: 240, r: 82 },
      { x: 716, y: 430, r: 82 }
    ],
    waypoints: [
      { x: 520, y: 462 },
      { x: 320, y: 450 },
      { x: 184, y: 354 },
      { x: 230, y: 190 },
      { x: 394, y: 108 },
      { x: 566, y: 92 },
      { x: 758, y: 196 },
      { x: 800, y: 348 },
      { x: 704, y: 450 }
    ],
    boostPads: [
      { x: 286, y: 438, angle: -0.65 },
      { x: 576, y: 96, angle: 0.3 },
      { x: 718, y: 430, angle: -2.7 }
    ],
    itemBoxes: [
      { x: 230, y: 230, respawn: 0 },
      { x: 518, y: 96, respawn: 0 },
      { x: 736, y: 348, respawn: 0 },
      { x: 440, y: 456, respawn: 0 }
    ],
    hazards: [
      { x: 186, y: 354, r: 30, phase: 0.8 },
      { x: 764, y: 226, r: 32, phase: 2.2 },
      { x: 760, y: 394, r: 24, phase: 3.1 }
    ]
  },
  portal_hairpin_ritual: {
    id: 'portal_hairpin_ritual',
    name: { fr: 'Rituel des Virages-Portails', en: 'Portal Hairpin Ritual' },
    family: 'nexus',
    difficulty: 3,
    tags: ['hairpin', 'hazard', 'technical'],
    objective: {
      type: 'closePortals',
      required: 2,
      markers: [
        { x: 150, y: 128, r: 34 },
        { x: 688, y: 346, r: 34 }
      ]
    },
    start: { x: 456, y: 492, angle: -Math.PI / 2 },
    laps: 3,
    roadWidth: 92,
    offroadDrag: 0.84,
    checkpoints: [
      { x: 456, y: 468, r: 70 },
      { x: 202, y: 430, r: 68 },
      { x: 254, y: 220, r: 68 },
      { x: 154, y: 122, r: 64 },
      { x: 522, y: 86, r: 74 },
      { x: 806, y: 164, r: 68 },
      { x: 692, y: 344, r: 70 },
      { x: 806, y: 438, r: 66 }
    ],
    waypoints: [
      { x: 456, y: 468 },
      { x: 252, y: 468 },
      { x: 178, y: 402 },
      { x: 254, y: 222 },
      { x: 146, y: 128 },
      { x: 314, y: 92 },
      { x: 520, y: 84 },
      { x: 748, y: 116 },
      { x: 820, y: 174 },
      { x: 686, y: 344 },
      { x: 816, y: 440 },
      { x: 612, y: 466 }
    ],
    boostPads: [
      { x: 252, y: 220, angle: -1.2 },
      { x: 520, y: 88, angle: 0.02 },
      { x: 688, y: 344, angle: -1.9 }
    ],
    surfaceZones: [
      { type: 'portal', x: 150, y: 128, r: 34, exit: { x: 806, y: 164, angle: 0.45 }, cooldown: 0 },
      { type: 'portal', x: 688, y: 346, r: 34, exit: { x: 456, y: 468, angle: -Math.PI / 2 }, cooldown: 0 },
      { type: 'slow', x: 236, y: 398, r: 42 },
      { type: 'jump', x: 520, y: 88, r: 32, angle: 0.02 }
    ],
    itemBoxes: [
      { x: 190, y: 132, respawn: 0 },
      { x: 474, y: 86, respawn: 0 },
      { x: 806, y: 164, respawn: 0 },
      { x: 806, y: 438, respawn: 0 }
    ],
    hazards: [
      { x: 236, y: 398, r: 24, phase: 0 },
      { x: 150, y: 128, r: 26, phase: 1.2 },
      { x: 820, y: 172, r: 28, phase: 2.1 },
      { x: 688, y: 346, r: 26, phase: 2.8 }
    ]
  },
  overload_bossway: {
    id: 'overload_bossway',
    name: { fr: 'Anneau de Surcharge', en: 'Overload Bossway' },
    family: 'nexus',
    difficulty: 4,
    tags: ['bossArena', 'hazard', 'wide'],
    objective: { type: 'timeLimit', seconds: 78 },
    start: { x: 480, y: 482, angle: -Math.PI / 2 },
    laps: 2,
    roadWidth: 140,
    offroadDrag: 0.87,
    checkpoints: [
      { x: 480, y: 462, r: 94 },
      { x: 174, y: 300, r: 92 },
      { x: 480, y: 88, r: 96 },
      { x: 786, y: 300, r: 92 }
    ],
    waypoints: [
      { x: 480, y: 462 },
      { x: 286, y: 430 },
      { x: 154, y: 304 },
      { x: 286, y: 148 },
      { x: 480, y: 84 },
      { x: 674, y: 148 },
      { x: 806, y: 304 },
      { x: 674, y: 430 }
    ],
    boostPads: [
      { x: 284, y: 430, angle: -0.25 },
      { x: 480, y: 86, angle: 0.2 },
      { x: 676, y: 430, angle: -2.9 }
    ],
    surfaceZones: [
      { type: 'slow', x: 480, y: 300, r: 92 },
      { type: 'jump', x: 284, y: 430, r: 38, angle: -0.25 },
      { type: 'jump', x: 676, y: 430, r: 38, angle: -2.9 },
      { type: 'portal', x: 480, y: 86, r: 34, exit: { x: 480, y: 462, angle: -Math.PI / 2 }, cooldown: 0 }
    ],
    itemBoxes: [
      { x: 178, y: 300, respawn: 0 },
      { x: 480, y: 92, respawn: 0 },
      { x: 784, y: 300, respawn: 0 },
      { x: 480, y: 300, respawn: 0 }
    ],
    hazards: [
      { x: 480, y: 300, r: 64, phase: 0 },
      { x: 300, y: 152, r: 30, phase: 1.1 },
      { x: 660, y: 448, r: 30, phase: 2.3 }
    ]
  }
};

export const RACE_TRACKS = KART_TRACK_LAYOUTS;

export class EngineRace {
  constructor(width, height, onFinish = () => {}, trackId = 'nexus_archive_loop', garageUpgrades = {}) {
    this.width = width;
    this.height = height;
    this.onFinish = onFinish;
    this.trackId = trackId;
    this.garageUpgrades = garageUpgrades || {};
    this.garageStats = this.computeGarageStats(this.garageUpgrades);
    this.track = this.createTrackState(trackId);
    this.images = {};
    Object.entries(RACE_ASSETS).forEach(([key, src]) => {
      const image = new Image();
      image.src = src;
      this.images[key] = image;
    });
    this.keys = {};
    this.reset();
  }

  computeGarageStats(upgrades = {}) {
    const engine = upgrades.engine || 0;
    const grip = upgrades.grip || 0;
    const capacitor = upgrades.capacitor || 0;
    const stabilizer = upgrades.stabilizer || 0;
    return {
      maxSpeedBonus: engine * 8,
      accelBonus: engine * 7,
      turnBonus: grip * 0.11,
      gripBonus: grip * 0.04,
      boostBonus: capacitor * 0.1,
      hazardResist: clamp(stabilizer * 0.08, 0, 0.38)
    };
  }

  updateGarage(upgrades = {}) {
    this.garageUpgrades = upgrades || {};
    this.garageStats = this.computeGarageStats(this.garageUpgrades);
  }

  createTrackState(trackId = this.trackId) {
    const baseTrack = RACE_TRACKS[trackId] || RACE_TRACKS.nexus_archive_loop;
    const track = {
      ...baseTrack,
      checkpoints: baseTrack.checkpoints.map(point => ({ ...point })),
      waypoints: baseTrack.waypoints.map(point => ({ ...point })),
      boostPads: baseTrack.boostPads.map(pad => ({ ...pad })),
      itemBoxes: baseTrack.itemBoxes.map(box => ({ ...box, respawn: 0 })),
      hazards: baseTrack.hazards.map(hazard => ({ ...hazard })),
      surfaceZones: (baseTrack.surfaceZones || []).map(zone => ({ ...zone })),
      fragmentPickups: (baseTrack.fragmentPickups || buildTrackFragments(baseTrack)).map(fragment => ({ ...fragment, collected: false })),
      shortcuts: (baseTrack.shortcuts || []).map(shortcut => ({
        ...shortcut,
        from: { ...shortcut.from },
        to: { ...shortcut.to }
      })),
      objective: baseTrack.objective ? {
        ...baseTrack.objective,
        markers: (baseTrack.objective.markers || []).map(marker => ({ ...marker, collected: false }))
      } : null
    };
    return this.normalizeTrackObjects(track);
  }

  normalizeTrackObjects(track) {
    const snapToRoad = (point, threshold = 0.52) => {
      const road = closestPointOnPath(track.waypoints, point.x, point.y, track.roadWidth);
      if (road.distance <= track.roadWidth * threshold) return { ...point, roadAnchor: road.segment };
      return { ...point, x: road.x, y: road.y, roadAnchor: road.segment };
    };
    return {
      ...track,
      boostPads: track.boostPads.map(pad => snapToRoad(pad, 0.45)),
      itemBoxes: track.itemBoxes.map(box => snapToRoad(box, 0.5)),
      hazards: track.hazards.map(hazard => hazard.temporary ? hazard : snapToRoad(hazard, 0.5)),
      fragmentPickups: (track.fragmentPickups || []).map(fragment => snapToRoad(fragment, 0.55)),
      surfaceZones: (track.surfaceZones || []).map(zone => {
        const anchored = snapToRoad(zone, zone.type === 'portal' ? 0.65 : 0.55);
        return zone.exit ? { ...anchored, exit: { ...zone.exit } } : anchored;
      }),
      objective: track.objective ? {
        ...track.objective,
        markers: (track.objective.markers || []).map(marker => snapToRoad(marker, 0.55))
      } : null
    };
  }

  createObjectiveState() {
    const objective = this.track.objective || { type: 'podium', targetRank: 3 };
    return {
      ...objective,
      complete: false,
      failed: false,
      collected: 0,
      label: OBJECTIVE_LABELS[objective.type] || 'Objectif de course'
    };
  }

  setTrack(trackId) {
    if (!RACE_TRACKS[trackId] || trackId === this.trackId) return;
    this.trackId = trackId;
    this.reset();
  }

  reset() {
    this.track = this.createTrackState();
    const start = this.track.start || { x: 480, y: 474, angle: -Math.PI / 2 };
    this.time = 0;
    this.countdown = 2.6;
    this.startBoostWindow = false;
    this.finished = false;
    this.finishReported = false;
    this.message = 'Synchronisation de depart';
    this.messageTimer = 2;
    this.particles = [];
    this.projectiles = [];
    this.fragmentsCollected = 0;
    this.slipstreamTimer = 0;
    this.objective = this.createObjectiveState();
    this.player = this.createKart({
      id: 'mirelle',
      name: 'Mirelle Suture',
      color: '#39c5bb',
      x: start.x,
      y: start.y,
      angle: start.angle,
      ai: false,
      laneOffset: 0,
      maxSpeed: 266 + this.garageStats.maxSpeedBonus,
      accel: 320 + this.garageStats.accelBonus,
      turnRate: 3.2 + this.garageStats.turnBonus
    });
    this.opponents = [
      this.createKart({ id: 'bastion', name: 'Bastion Korr', color: '#ffb15c', x: start.x - 40, y: start.y + 28, angle: start.angle, ai: true, laneOffset: -26, maxSpeed: 244 }),
      this.createKart({ id: 'loom', name: 'Loom-07', color: '#d9b6ff', x: start.x + 42, y: start.y + 30, angle: start.angle, ai: true, laneOffset: 22, maxSpeed: 252 }),
      this.createKart({ id: 'sable', name: 'Sable Vey', color: '#e74c3c', x: start.x, y: start.y + 58, angle: start.angle, ai: true, laneOffset: 8, maxSpeed: 238 })
    ];
  }

  createKart({ id, name, color, x, y, angle, ai, laneOffset, maxSpeed = 266, accel = 320, turnRate = 3.2 }) {
    return {
      id,
      name,
      color,
      x,
      y,
      angle,
      speed: 0,
      ai,
      laneOffset,
      maxSpeed,
      accel,
      turnRate,
      drift: 0,
      driftCharge: 0,
      boost: 0,
      air: 0,
      portalCooldown: 0,
      spin: 0,
      shield: 0,
      item: null,
      lap: 0,
      checkpoint: 0,
      progress: 0,
      waypoint: 1,
      rank: 1,
      finished: false,
      finishTime: null,
      hitCooldown: 0,
      itemCooldown: 0
    };
  }

  setInput(keys = {}) {
    this.keys = keys;
  }

  useItem() {
    this.useKartItem(this.player);
  }

  useKartItem(kart) {
    if (!kart?.item || this.finished || this.countdown > 0 || kart.itemCooldown > 0) return false;
    const item = kart.item;
    kart.item = null;
    kart.itemCooldown = 1.1;
    if (item === 'boost') {
      kart.boost = Math.max(kart.boost, 1.45 + (kart.ai ? 0 : this.garageStats.boostBonus));
      kart.speed = Math.max(kart.speed, 215);
      if (!kart.ai) this.showMessage('Suture de vitesse: boost instable');
      this.spawnParticles(kart.x, kart.y, '#39c5bb', 18);
      return true;
    }
    if (item === 'shield') {
      kart.shield = 4;
      if (!kart.ai) this.showMessage('Voile de garde actif');
      return true;
    }
    if (item === 'trap') {
      const back = {
        x: kart.x - Math.cos(kart.angle) * 34,
        y: kart.y - Math.sin(kart.angle) * 34
      };
      this.track.hazards.push({ ...back, r: 24, phase: this.time, temporary: 8, ownerId: kart.id });
      if (!kart.ai) this.showMessage('Noeud de trame largue');
      return true;
    }
    if (item === 'anchor') {
      kart.spin = 0;
      kart.hitCooldown = Math.max(kart.hitCooldown, 0.65);
      kart.shield = Math.max(kart.shield, 1.6);
      kart.speed = Math.max(kart.speed, 155);
      this.spawnParticles(kart.x, kart.y, '#d8fffb', 16);
      if (!kart.ai) this.showMessage('Balise d ancrage: trajectoire stabilisee');
      return true;
    }
    if (item === 'mirror') {
      const target = this.findMirrorSwapTarget(kart);
      if (target) {
        const swap = { x: kart.x, y: kart.y, angle: kart.angle, speed: kart.speed };
        kart.x = target.x;
        kart.y = target.y;
        kart.angle = target.angle;
        kart.speed = Math.max(target.speed * 0.9, 120);
        target.x = swap.x;
        target.y = swap.y;
        target.angle = swap.angle;
        target.speed = Math.max(swap.speed * 0.72, 90);
        kart.portalCooldown = 1.2;
        target.portalCooldown = 1.2;
        this.spawnParticles(kart.x, kart.y, '#39c5bb', 20);
        this.spawnParticles(target.x, target.y, '#39c5bb', 20);
        if (!kart.ai) this.showMessage('Faille miroir: permutation de trajectoire');
      }
      return true;
    }
    if (item === 'pulse') {
      const victims = [this.player, ...this.opponents].filter(other => other.id !== kart.id && distance(kart, other) < 150);
      victims.forEach(other => {
        if (other.shield > 0) {
          other.shield = 0;
        } else {
          other.spin = Math.max(other.spin, 0.65);
          other.speed *= 0.62;
          other.hitCooldown = Math.max(other.hitCooldown, 0.8);
        }
        this.spawnParticles(other.x, other.y, '#9b59b6', 12);
      });
      if (!kart.ai) this.showMessage('Onde de freinage: zone perturbee');
      return true;
    }
    this.projectiles.push({
      x: kart.x + Math.cos(kart.angle) * 28,
      y: kart.y + Math.sin(kart.angle) * 28,
      vx: Math.cos(kart.angle) * 420,
      vy: Math.sin(kart.angle) * 420,
      life: 1.4,
      color: '#ffeb3b',
      ownerId: kart.id
    });
    if (!kart.ai) this.showMessage('Aiguille de resonance lancee');
    return true;
  }

  findMirrorSwapTarget(kart) {
    const racers = [this.player, ...this.opponents].filter(other => other.id !== kart.id && !other.finished);
    if (!racers.length) return null;
    const ahead = racers
      .filter(other => other.progress >= kart.progress)
      .sort((a, b) => a.progress - b.progress || distance(kart, a) - distance(kart, b))[0];
    return ahead || racers.sort((a, b) => distance(kart, a) - distance(kart, b))[0];
  }

  update(dt) {
    dt = clamp(dt, 0, 1 / 30);
    this.time += dt;
    const previousCountdown = this.countdown;
    this.countdown = Math.max(0, this.countdown - dt);
    if (previousCountdown > 0 && this.countdown === 0 && this.startBoostWindow) {
      this.player.boost = Math.max(this.player.boost, 0.95);
      this.player.speed = Math.max(this.player.speed, 176);
      this.spawnParticles(this.player.x, this.player.y, '#ffeb3b', 20);
      this.showMessage('Depart ancre: impulsion parfaite');
    }
    this.messageTimer = Math.max(0, this.messageTimer - dt);
    if (this.finished) {
      this.updateParticles(dt);
      return;
    }
    this.track.hazards = this.track.hazards
      .map(hazard => {
        if (hazard.baseX === undefined) {
          hazard.baseX = hazard.x;
          hazard.baseY = hazard.y;
        }
        const road = this.getClosestRoadPoint(hazard.baseX, hazard.baseY);
        const currentWp = this.track.waypoints[road.segment];
        const nextWp = this.track.waypoints[(road.segment + 1) % this.track.waypoints.length];
        const dx = nextWp.x - currentWp.x;
        const dy = nextWp.y - currentWp.y;
        const len = Math.hypot(dx, dy) || 1;
        const normalX = -dy / len;
        const normalY = dx / len;
        
        const amp = (this.track.roadWidth || 104) * 0.36;
        const speed = 2.2 + (hazard.phase || 0) * 0.42;
        const offset = Math.sin(this.time * speed + (hazard.phase || 0)) * amp;
        
        return {
          ...hazard,
          x: hazard.baseX + normalX * offset,
          y: hazard.baseY + normalY * offset,
          temporary: hazard.temporary ? hazard.temporary - dt : undefined
        };
      })
      .filter(hazard => !hazard.temporary || hazard.temporary > 0);
    this.track.itemBoxes.forEach(box => { box.respawn = Math.max(0, box.respawn - dt); });
    this.updateKart(this.player, dt);
    this.opponents.forEach(kart => this.updateAiKart(kart, dt));
    this.updateProjectiles(dt);
    this.resolveKartCollisions();
    this.updateProgressAndRanks();
    this.updateObjectiveState();
    this.updateParticles(dt);
    if (this.player.finished && !this.finishReported) {
      this.finishReported = true;
      this.finished = true;
      this.onFinish(this.getRaceSummary());
    }
  }

  updateKart(kart, dt) {
    kart.hitCooldown = Math.max(0, kart.hitCooldown - dt);
    kart.shield = Math.max(0, kart.shield - dt);
    kart.spin = Math.max(0, kart.spin - dt);
    kart.boost = Math.max(0, kart.boost - dt);
    kart.air = Math.max(0, kart.air - dt);
    kart.portalCooldown = Math.max(0, kart.portalCooldown - dt);
    kart.itemCooldown = Math.max(0, kart.itemCooldown - dt);
    if (kart.finished) {
      kart.speed *= 0.985;
      kart.x += Math.cos(kart.angle) * kart.speed * dt;
      kart.y += Math.sin(kart.angle) * kart.speed * dt;
      return;
    }
    if (this.countdown > 0) {
      kart.speed *= 0.94;
      if (!kart.ai && this.countdown < 0.72 && this.countdown > 0.18 && this.getPlayerInput().accel) {
        this.startBoostWindow = true;
      }
      return;
    }
    const input = kart.ai ? kart.aiInput : this.getPlayerInput();
    const trackFactor = this.getTrackFactor(kart.x, kart.y);
    const onTrack = trackFactor > 0.52;
    const surface = this.getSurfaceAt(kart.x, kart.y);
    const accel = input.accel ? kart.accel : input.brake ? -kart.accel * 0.62 : 0;
    kart.speed += accel * dt;
    const maxSpeed = kart.maxSpeed + (kart.boost > 0 ? 118 : 0);
    kart.speed = clamp(kart.speed, -88, maxSpeed);
    const drag = surface === 'ice' ? 0.994 : surface === 'slow' ? 0.952 : onTrack ? 0.99 : Math.max(this.track.offroadDrag, 0.965);
    kart.speed *= Math.pow(drag, dt * 60);
    if (kart.spin > 0) kart.speed *= 0.965;
    const driftHeld = input.drift && Math.abs(kart.speed) > 80;
    kart.drift = clamp(kart.drift + (driftHeld ? dt * 1.6 : -dt * 2.3), 0, 1);
    kart.driftCharge = driftHeld ? clamp(kart.driftCharge + dt, 0, 2.4) : kart.driftCharge;
    const grip = clamp((surface === 'ice' ? 0.68 : 1) + (kart.ai ? 0 : this.garageStats.gripBonus), 0.62, 1.22);
    const turnPower = (0.55 + clamp(Math.abs(kart.speed) / 220, 0, 1) * 0.85) * (kart.drift ? 1.35 : 1) * grip;
    kart.angle += input.turn * kart.turnRate * turnPower * dt * (kart.speed >= 0 ? 1 : -1);
    
    if (driftHeld && kart.drift > 0.12) {
      let sparkColor = null;
      if (kart.driftCharge > 1.75) {
        sparkColor = '#9b59b6'; // Purple
      } else if (kart.driftCharge > 1.1) {
        sparkColor = '#e67e22'; // Orange
      } else if (kart.driftCharge > 0.65) {
        sparkColor = '#3498db'; // Blue
      }
      if (sparkColor && Math.random() < 0.35) {
        const rearX = kart.x - Math.cos(kart.angle) * 12;
        const rearY = kart.y - Math.sin(kart.angle) * 12;
        this.spawnDriftSpark(rearX, rearY, sparkColor);
      }
    }

    if (!driftHeld && kart.drift > 0.72) {
      const turbo = kart.driftCharge > 1.75 ? 1.05 : kart.driftCharge > 1.1 ? 0.78 : 0.55;
      kart.boost = Math.max(kart.boost, turbo + (kart.ai ? 0 : this.garageStats.boostBonus));
      this.spawnParticles(kart.x, kart.y, kart.color, 10);
      if (!kart.ai) this.showMessage(turbo > 1 ? 'Mini-turbo violet' : turbo > 0.65 ? 'Mini-turbo orange' : 'Mini-turbo bleu');
      kart.driftCharge = 0;
    } else if (!driftHeld && kart.drift <= 0.08) {
      kart.driftCharge = 0;
    }
    kart.x += Math.cos(kart.angle) * kart.speed * dt;
    kart.y += Math.sin(kart.angle) * kart.speed * dt;
    this.applyTrackBounds(kart);
    this.applyBoostPads(kart);
    this.applySurfaceZones(kart);
    this.applyHazards(kart);
    this.collectTrackFragments(kart);
    this.collectItem(kart);
    if (!kart.ai) this.applySlipstream();
    this.updateCheckpoints(kart);
  }

  updateAiKart(kart, dt) {
    const target = this.track.waypoints[kart.waypoint];
    const previous = this.track.waypoints[(kart.waypoint + this.track.waypoints.length - 1) % this.track.waypoints.length];
    const laneAngle = Math.atan2(target.y - previous.y, target.x - previous.x) + Math.PI / 2;
    const targetWithLane = {
      x: target.x + Math.cos(laneAngle) * kart.laneOffset,
      y: target.y + Math.sin(laneAngle) * kart.laneOffset
    };
    if (distance(kart, targetWithLane) < 72) {
      kart.waypoint = (kart.waypoint + 1) % this.track.waypoints.length;
    }
    const desired = Math.atan2(targetWithLane.y - kart.y, targetWithLane.x - kart.x);
    const delta = angleDelta(kart.angle, desired);
    const difficultyWave = Math.sin(this.time * 0.9 + kart.laneOffset) * 0.16;
    kart.aiInput = {
      accel: true,
      brake: Math.abs(delta) > 1.25 && kart.speed > 185,
      turn: clamp(delta * 1.35 + difficultyWave, -1, 1),
      drift: Math.abs(delta) > 0.62 && kart.speed > 145
    };
    if (this.shouldAiUseItem(kart, delta)) {
      this.useKartItem(kart);
    }
    this.updateKart(kart, dt);
  }

  shouldAiUseItem(kart, turnDelta) {
    if (!kart.item || kart.itemCooldown > 0 || this.countdown > 0) return false;
    const nearPlayer = distance(kart, this.player) < 175;
    if (kart.item === 'boost') return kart.rank >= 2 && Math.abs(turnDelta) < 0.7;
    if (kart.item === 'shield' || kart.item === 'anchor') return kart.rank === 1 || kart.hitCooldown > 0;
    if (kart.item === 'trap') return this.player.progress <= kart.progress && nearPlayer;
    if (kart.item === 'pulse') return nearPlayer;
    if (kart.item === 'mirror') return kart.rank >= 3 || this.player.progress > kart.progress + 0.15;
    return this.player.progress >= kart.progress - 0.08;
  }

  getPlayerInput() {
    return {
      accel: Boolean(this.keys.up || this.keys.w),
      brake: Boolean(this.keys.down || this.keys.s),
      turn: (this.keys.left || this.keys.a ? -1 : 0) + (this.keys.right || this.keys.d ? 1 : 0),
      drift: Boolean(this.keys.space)
    };
  }

  applyTrackBounds(kart) {
    kart.x = clamp(kart.x, 34, this.width - 34);
    kart.y = clamp(kart.y, 34, this.height - 34);
    const road = this.getClosestRoadPoint(kart.x, kart.y);
    if (road.factor < 0.16) {
      kart.x = lerp(kart.x, road.x, 0.08);
      kart.y = lerp(kart.y, road.y, 0.08);
      kart.speed *= 0.975;
    }
  }

  getPointOnRoad(angle) {
    const waypoints = this.track.waypoints;
    const index = Math.floor((((angle + TAU) % TAU) / TAU) * waypoints.length) % waypoints.length;
    return waypoints[index] || { x: this.width / 2, y: this.height / 2 };
  }

  getTrackFactor(x, y) {
    return this.getClosestRoadPoint(x, y).factor;
  }

  getClosestRoadPoint(x, y) {
    return closestPointOnPath(this.track.waypoints || [], x, y, this.track.roadWidth);
  }

  getSurfaceAt(x, y) {
    const zone = (this.track.surfaceZones || []).find(surface => distance({ x, y }, surface) < surface.r);
    return zone?.type || 'road';
  }

  applySurfaceZones(kart) {
    (this.track.surfaceZones || []).forEach(zone => {
      if (distance(kart, zone) > zone.r) return;
      if (zone.type === 'jump' && kart.air <= 0) {
        kart.air = 0.56;
        kart.boost = Math.max(kart.boost, 0.42 + (kart.ai ? 0 : this.garageStats.boostBonus * 0.55));
        kart.speed = Math.max(kart.speed, 188);
        this.spawnParticles(kart.x, kart.y, '#d8fffb', 10);
        if (!kart.ai) this.showMessage('Tremplin de faille: trick boost');
      }
      if (zone.type === 'portal' && kart.portalCooldown <= 0 && zone.exit) {
        kart.x = zone.exit.x;
        kart.y = zone.exit.y;
        kart.angle = zone.exit.angle ?? kart.angle;
        kart.portalCooldown = 1.8;
        kart.boost = Math.max(kart.boost, 0.38 + (kart.ai ? 0 : this.garageStats.boostBonus * 0.45));
        this.spawnParticles(kart.x, kart.y, '#39c5bb', 18);
        if (!kart.ai) this.showMessage('Portail court traverse');
      }
    });
  }

  applyBoostPads(kart) {
    this.track.boostPads.forEach(pad => {
      if (distance(kart, pad) < 34) {
        kart.boost = Math.max(kart.boost, 0.65 + (kart.ai ? 0 : this.garageStats.boostBonus * 0.5));
        kart.speed = Math.max(kart.speed, 205);
      }
    });
  }

  applyHazards(kart) {
    this.track.hazards.forEach(hazard => {
      const activeRadius = hazard.r + Math.sin(this.time * 3.2 + hazard.phase) * 6;
      if (distance(kart, hazard) < activeRadius && kart.hitCooldown <= 0) {
        if (kart.shield > 0) {
          kart.shield = 0;
          this.spawnParticles(kart.x, kart.y, '#d9b6ff', 14);
        } else {
          const resist = kart.ai ? 0 : this.garageStats.hazardResist;
          kart.speed *= -0.25 + resist * 0.18;
          kart.spin = Math.max(0.28, 0.72 - resist);
          kart.hitCooldown = Math.max(0.55, 1.15 - resist);
          this.spawnParticles(kart.x, kart.y, '#e74c3c', 18);
        }
      }
    });
  }

  collectItem(kart) {
    this.track.itemBoxes.forEach(box => {
      if (box.respawn <= 0 && distance(kart, box) < 32) {
        box.respawn = 5.5;
        kart.item = this.rollItem(kart);
        this.spawnParticles(box.x, box.y, '#ffeb3b', 12);
        if (!kart.ai) this.showMessage(`Cache recuperee: ${this.getItemName(kart.item)}`);
      }
    });
  }

  collectTrackFragments(kart) {
    if (kart.ai) return;
    (this.track.fragmentPickups || []).forEach(fragment => {
      if (fragment.collected || distance(kart, fragment) >= fragment.r) return;
      fragment.collected = true;
      this.fragmentsCollected += fragment.value || 1;
      kart.boost = Math.max(kart.boost, 0.18 + this.garageStats.boostBonus * 0.35);
      this.spawnParticles(fragment.x, fragment.y, '#ffeb3b', 10);
      this.showMessage(`Fragment de piste ${this.fragmentsCollected}/${this.track.fragmentPickups.length}`);
    });
  }

  applySlipstream() {
    const target = this.opponents.find(kart => {
      const dx = kart.x - this.player.x;
      const dy = kart.y - this.player.y;
      const forward = Math.cos(this.player.angle) * dx + Math.sin(this.player.angle) * dy;
      const lateral = Math.abs(-Math.sin(this.player.angle) * dx + Math.cos(this.player.angle) * dy);
      return forward > 32 && forward < 150 && lateral < 38 && Math.abs(angleDelta(this.player.angle, kart.angle)) < 0.62;
    });
    if (target && this.player.speed > 120) {
      this.slipstreamTimer = Math.min(1.6, this.slipstreamTimer + 1 / 60);
      if (this.slipstreamTimer > 0.72) {
        this.player.boost = Math.max(this.player.boost, 0.3 + this.garageStats.boostBonus * 0.45);
        this.player.speed = Math.max(this.player.speed, 190);
      }
    } else {
      this.slipstreamTimer = Math.max(0, this.slipstreamTimer - 0.04);
    }
  }

  rollItem(kart) {
    const pool = kart.rank >= 3
      ? ['boost', 'boost', 'projectile', 'shield', 'trap', 'anchor', 'mirror', 'pulse']
      : ['projectile', 'shield', 'trap', 'boost', 'anchor', 'pulse'];
    return pool[Math.floor((this.time * 997 + kart.x + kart.y) % pool.length)];
  }

  getItemName(item) {
    return {
      boost: 'Suture de vitesse',
      shield: 'Voile de garde',
      trap: 'Noeud de trame',
      projectile: 'Aiguille de resonance',
      anchor: 'Balise d ancrage',
      mirror: 'Faille miroir',
      pulse: 'Onde de freinage'
    }[item] || 'Cache';
  }

  updateCheckpoints(kart) {
    const current = this.track.checkpoints[kart.checkpoint];
    if (current && distance(kart, current) < current.r) {
      kart.checkpoint += 1;
      if (kart.checkpoint >= this.track.checkpoints.length) {
        kart.checkpoint = 0;
        kart.lap += 1;
        if (!kart.ai) this.showMessage(kart.lap >= this.track.laps ? 'Dernier verrou scelle' : `Tour ${kart.lap + 1}/${this.track.laps}`);
        if (kart.lap >= this.track.laps) {
          kart.finished = true;
          kart.finishTime = this.time;
        }
      }
    }
  }

  updateProgressAndRanks() {
    const racers = [this.player, ...this.opponents];
    racers.forEach(kart => {
      const nextCheckpoint = kart.checkpoint / this.track.checkpoints.length;
      kart.progress = kart.lap + nextCheckpoint;
    });
    racers
      .slice()
      .sort((a, b) => b.progress - a.progress || b.speed - a.speed)
      .forEach((kart, index) => { kart.rank = index + 1; });
  }

  updateObjectiveState() {
    if (!this.objective || this.objective.complete || this.objective.failed) return;
    if (this.objective.type === 'collectFragments') {
      (this.objective.markers || []).forEach(marker => {
        if (!marker.collected && distance(this.player, marker) < marker.r) {
          marker.collected = true;
          this.objective.collected += 1;
          this.spawnParticles(marker.x, marker.y, '#ffeb3b', 18);
          this.showMessage(`Fragment recupere ${this.objective.collected}/${this.objective.required}`);
        }
      });
      this.objective.complete = this.objective.collected >= this.objective.required;
      return;
    }
    if (this.objective.type === 'closePortals') {
      (this.objective.markers || []).forEach(marker => {
        if (!marker.collected && distance(this.player, marker) < marker.r) {
          marker.collected = true;
          this.objective.collected += 1;
          this.spawnParticles(marker.x, marker.y, '#39c5bb', 18);
          this.showMessage(`Portail ferme ${this.objective.collected}/${this.objective.required}`);
        }
      });
      this.objective.complete = this.objective.collected >= this.objective.required;
      return;
    }
    if (this.objective.type === 'timeLimit') {
      this.objective.failed = this.time > this.objective.seconds && !this.player.finished;
      this.objective.complete = this.player.finished && this.time <= this.objective.seconds;
      if (this.objective.failed) this.showMessage('Surcharge atteinte: objectif secondaire perdu');
      return;
    }
    if (this.objective.type === 'beatRival') {
      const rival = this.opponents.find(kart => kart.id === this.objective.rivalId);
      this.objective.complete = this.player.finished && (!rival || this.player.rank < rival.rank);
      this.objective.failed = this.player.finished && !this.objective.complete;
      return;
    }
    if (this.objective.type === 'podium') {
      this.objective.complete = this.player.finished && this.player.rank <= (this.objective.targetRank || 3);
      this.objective.failed = this.player.finished && !this.objective.complete;
    }
  }

  getObjectiveStatus() {
    if (!this.objective) return 'Objectif libre';
    if (this.objective.type === 'collectFragments' || this.objective.type === 'closePortals') {
      return `${this.objective.label}: ${this.objective.collected}/${this.objective.required}`;
    }
    if (this.objective.type === 'timeLimit') {
      return `${this.objective.label}: ${Math.max(0, this.objective.seconds - this.time).toFixed(0)}s`;
    }
    if (this.objective.type === 'beatRival') {
      return `${this.objective.label}: ${this.objective.rivalName || this.objective.rivalId}`;
    }
    return this.objective.label;
  }

  updateProjectiles(dt) {
    this.projectiles.forEach(projectile => {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;
      [this.player, ...this.opponents].forEach(kart => {
        if (kart.id === projectile.ownerId) return;
        if (projectile.life > 0 && distance(projectile, kart) < 28 && kart.hitCooldown <= 0) {
          if (kart.shield > 0) {
            kart.shield = 0;
            kart.hitCooldown = 0.45;
          } else {
            kart.speed *= 0.22;
            kart.spin = 0.8;
            kart.hitCooldown = 1.2;
          }
          projectile.life = 0;
          this.spawnParticles(kart.x, kart.y, '#ffeb3b', 16);
        }
      });
    });
    this.projectiles = this.projectiles.filter(projectile => projectile.life > 0);
  }

  resolveKartCollisions() {
    const racers = [this.player, ...this.opponents];
    for (let i = 0; i < racers.length; i += 1) {
      for (let j = i + 1; j < racers.length; j += 1) {
        const a = racers[i];
        const b = racers[j];
        const d = distance(a, b);
        if (d > 0 && d < 34) {
          const nx = (a.x - b.x) / d;
          const ny = (a.y - b.y) / d;
          const push = (34 - d) * 0.5;
          a.x += nx * push;
          a.y += ny * push;
          b.x -= nx * push;
          b.y -= ny * push;
          const transfer = (a.speed - b.speed) * 0.12;
          a.speed -= transfer;
          b.speed += transfer;
        }
      }
    }
  }

  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * TAU + this.time;
      const speed = 35 + (i % 5) * 17;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.35 + (i % 4) * 0.08,
        color
      });
    }
  }

  spawnDriftSpark(x, y, color) {
    const angle = this.player.angle + Math.PI + (Math.random() - 0.5) * 1.2;
    const speed = 25 + Math.random() * 30;
    this.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.2 + Math.random() * 0.15,
      color
    });
  }

  updateParticles(dt) {
    this.particles.forEach(particle => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    });
    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  showMessage(message) {
    this.message = message;
    this.messageTimer = 2;
  }

  getRaceSummary() {
    const time = this.player.finishTime || this.time;
    const rank = this.player.rank;
    const objectiveComplete = Boolean(this.objective?.complete);
    const grade = rank === 1 && objectiveComplete && time < 88 ? 'S' : rank === 1 && objectiveComplete ? 'A' : rank <= 2 ? 'B' : 'C';
    const gradeMultiplier = { S: 1.9, A: 1.45, B: 1.08, C: 0.78 }[grade] || 0.7;
    const objectiveMultiplier = objectiveComplete ? 1.22 : 0.82;
    const trackFactor = 1 + (this.track.difficulty || 1) * 0.22;
    const trackFragments = this.fragmentsCollected || 0;
    const fragments = Math.max(6, Math.round(12 * gradeMultiplier * objectiveMultiplier * trackFactor));
    const xp = Math.max(18, Math.round(42 * gradeMultiplier * objectiveMultiplier * trackFactor));
    const garageParts = Math.max(4, Math.round(8 * gradeMultiplier * objectiveMultiplier + (rank === 1 ? 5 : 0) + trackFragments * 0.6));
    return {
      mode: 'Race',
      trackId: this.track.id,
      trackName: this.track.name.fr,
      pilot: this.player.name,
      time,
      rank,
      grade,
      laps: this.track.laps,
      objective: this.getObjectiveStatus(),
      objectiveComplete,
      trackFragments,
      rewards: {
        fragments: fragments + trackFragments,
        xp,
        garageParts,
        unlockHint: objectiveComplete && grade !== 'C' ? 'Progression garage stabilisee' : 'Objectif incomplet: recompense reduite'
      }
    };
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawRaceCameraBackdrop(ctx);
    this.drawRearRoad(ctx);
    this.drawProjectedRaceObjects(ctx);
    this.drawRearPlayerKart(ctx);
    this.drawSlipstreamWindLines(ctx);
    this.drawHud(ctx);
  }

  drawSlipstreamWindLines(ctx) {
    if (this.slipstreamTimer <= 0.72) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(57, 197, 187, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([40, 110]);
    const offset = (this.time * 980) % 150;
    
    // Left side lines
    for (let i = 0; i < 4; i += 1) {
      const y = 140 + i * 86;
      ctx.beginPath();
      ctx.moveTo(offset, y);
      ctx.lineTo(offset + 320, y + (i - 1.5) * 20);
      ctx.stroke();
    }
    
    // Right side lines
    for (let i = 0; i < 4; i += 1) {
      const y = 140 + i * 86;
      ctx.beginPath();
      ctx.moveTo(this.width - offset, y);
      ctx.lineTo(this.width - offset - 320, y + (i - 1.5) * 20);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawRaceCameraBackdrop(ctx) {
    const trackId = this.trackId || '';
    let skyColor1 = '#020106';
    let skyColor2 = '#081527';
    let skyColor3 = '#13242c';
    let skyColor4 = '#05030a';
    let gridColor1 = 'rgba(57,197,187,0.14)';
    let gridColor2 = 'rgba(255,235,59,0.12)';

    if (trackId.includes('void') || trackId.includes('glitch')) {
      // Volcanic / Danger theme
      skyColor1 = '#090101';
      skyColor2 = '#2a0a0e';
      skyColor3 = '#420f12';
      skyColor4 = '#080101';
      gridColor1 = 'rgba(231,76,60,0.18)';
      gridColor2 = 'rgba(230,126,34,0.14)';
    } else if (trackId.includes('portal') || trackId.includes('ritual')) {
      // Void / Portal theme
      skyColor1 = '#000808';
      skyColor2 = '#0a2e2f';
      skyColor3 = '#0f4244';
      skyColor4 = '#010c0d';
      gridColor1 = 'rgba(57,197,187,0.22)';
      gridColor2 = 'rgba(46,204,113,0.14)';
    } else {
      // Synthwave / Neon Classic theme
      skyColor1 = '#08010f';
      skyColor2 = '#1b022b';
      skyColor3 = '#2c043e';
      skyColor4 = '#04010a';
      gridColor1 = 'rgba(57,197,187,0.18)';
      gridColor2 = 'rgba(241,12,241,0.12)';
    }

    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, skyColor1);
    sky.addColorStop(0.34, skyColor2);
    sky.addColorStop(0.58, skyColor3);
    sky.addColorStop(1, skyColor4);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    const horizon = this.getRaceCameraHorizon();
    const trackImage = this.images.trackNexus;
    if (trackImage?.complete && trackImage.naturalWidth) {
      ctx.globalAlpha = 0.12;
      ctx.drawImage(trackImage, 0, -this.height * 0.42, this.width, this.height * 1.7);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = gridColor1;
    for (let i = 0; i < 9; i += 1) {
      const x = (i / 8) * this.width;
      ctx.beginPath();
      ctx.moveTo(this.width / 2, horizon + 8);
      ctx.lineTo(x, this.height);
      ctx.lineTo(x + 1, this.height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = gridColor2;
    ctx.lineWidth = 1;
    for (let y = horizon + 24; y < this.height; y += 34) {
      const width = (y - horizon) * 1.9;
      ctx.beginPath();
      ctx.moveTo(this.width / 2 - width, y);
      ctx.lineTo(this.width / 2 + width, y);
      ctx.stroke();
    }
  }

  getRaceCameraHorizon() {
    return this.height * 0.34;
  }

  getRoadCurveOffset(depthT) {
    const upcoming = this.track.waypoints[this.player.waypoint] || this.track.waypoints[0];
    const desired = Math.atan2(upcoming.y - this.player.y, upcoming.x - this.player.x);
    const delta = angleDelta(this.player.angle, desired);
    const driftPull = this.player.drift * Math.sign(delta || 1) * 0.18;
    return (delta * 0.72 + driftPull) * depthT * depthT * 190;
  }

  drawRearRoad(ctx) {
    const segments = this.getProjectedTrackSegments();
    if (segments.length < 2) {
      this.drawFallbackRearRoad(ctx);
      return;
    }

    const horizon = this.getRaceCameraHorizon();

    // Draw background sky/ground first
    ctx.fillStyle = '#090812';
    ctx.fillRect(0, 0, this.width, horizon);
    ctx.fillStyle = '#0f121d';
    ctx.fillRect(0, horizon, this.width, this.height - horizon);

    ctx.save();
    segments
      .slice()
      .sort((a, b) => b.depth - a.depth)
      .forEach(segment => {
        const width = segment.width;
        const normalX = segment.normalX;
        const normalY = segment.normalY;

        // Left and right edges of start point A
        const axL = segment.a.x - normalX * width * 0.5;
        const ayL = segment.a.y - normalY * width * 0.5;
        const axR = segment.a.x + normalX * width * 0.5;
        const ayR = segment.a.y + normalY * width * 0.5;

        // Left and right edges of end point B
        const bxL = segment.b.x - normalX * width * 0.5;
        const byL = segment.b.y - normalY * width * 0.5;
        const bxR = segment.b.x + normalX * width * 0.5;
        const byR = segment.b.y + normalY * width * 0.5;

        // Draw main road surface polygon
        ctx.fillStyle = segment.index % 2 === 0 ? '#272b39' : '#303443';
        ctx.beginPath();
        ctx.moveTo(axL, ayL);
        ctx.lineTo(bxL, byL);
        ctx.lineTo(bxR, byR);
        ctx.lineTo(axR, ayR);
        ctx.closePath();
        ctx.fill();

        // Draw red/white rumble strip borders
        const borderW = Math.max(3, width * 0.055);
        ctx.fillStyle = segment.index % 2 === 0 ? '#e74c3c' : '#ffffff';

        // Left border
        ctx.beginPath();
        ctx.moveTo(axL - borderW, ayL);
        ctx.lineTo(bxL - borderW, byL);
        ctx.lineTo(bxL, byL);
        ctx.lineTo(axL, ayL);
        ctx.closePath();
        ctx.fill();

        // Right border
        ctx.beginPath();
        ctx.moveTo(axR, ayR);
        ctx.lineTo(bxR, byR);
        ctx.lineTo(bxR + borderW, byR);
        ctx.lineTo(axR + borderW, ayR);
        ctx.closePath();
        ctx.fill();

        // Draw center dashed yellow line
        if (segment.index % 2 === 0) {
          ctx.strokeStyle = '#ffeb3b';
          ctx.lineWidth = Math.max(1.5, width * 0.016);
          ctx.beginPath();
          ctx.moveTo(segment.a.x, segment.a.y);
          ctx.lineTo(segment.b.x, segment.b.y);
          ctx.stroke();
        }
      });

    const startProjection = this.projectToRearCamera(this.track.start || this.track.waypoints[0]);
    if (startProjection) this.drawProjectedFinishLine(ctx, startProjection);
    ctx.restore();
  }

  getProjectedTrackSegments() {
    const points = this.track.waypoints || [];
    if (points.length < 2) return [];
    const samples = [];
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const length = Math.max(1, distance(point, next));
      const steps = Math.max(3, Math.ceil(length / 38));
      for (let step = 0; step < steps; step += 1) {
        const t = step / steps;
        samples.push({
          x: lerp(point.x, next.x, t),
          y: lerp(point.y, next.y, t),
          segmentIndex: index
        });
      }
    });

    const projected = samples.map(sample => ({
      source: sample,
      p: this.projectToRearCamera(sample)
    }));
    const segments = [];
    for (let i = 0; i < projected.length; i += 1) {
      const current = projected[i];
      const next = projected[(i + 1) % projected.length];
      if (!current.p || !next.p) continue;
      if (Math.abs(current.p.forward - next.p.forward) > 130) continue;
      const dx = next.p.x - current.p.x;
      const dy = next.p.y - current.p.y;
      const len = Math.hypot(dx, dy) || 1;
      const scale = (current.p.scale + next.p.scale) * 0.5;
      const perspectiveT = (current.p.t + next.p.t) * 0.5;
      segments.push({
        a: current.p,
        b: next.p,
        width: this.getRearRoadVisualWidth(scale, perspectiveT),
        depth: (current.p.forward + next.p.forward) * 0.5,
        index: current.source.segmentIndex,
        normalX: -dy / len,
        normalY: dx / len
      });
    }
    return segments;
  }

  getRearRoadVisualWidth(scale, perspectiveT) {
    const cameraWidthBoost = lerp(1.35, 3.35, perspectiveT ** 0.85);
    return clamp(this.track.roadWidth * scale * cameraWidthBoost, 42, this.width * 0.92);
  }

  drawProjectedFinishLine(ctx, p) {
    const width = Math.max(64, this.getRearRoadVisualWidth(p.scale, p.t) * 0.82);
    const height = Math.max(6, 7 * p.scale);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(-0.04 + Math.sin(this.time * 2) * 0.01);
    ctx.fillStyle = 'rgba(255,255,255,0.84)';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    const cells = 12;
    for (let i = 0; i < cells; i += 1) {
      if (i % 2 === 0) ctx.fillRect(-width / 2 + (i * width) / cells, -height / 2, width / cells, height);
    }
    ctx.restore();
  }

  drawFallbackRearRoad(ctx) {
    const horizon = this.getRaceCameraHorizon();
    const centerX = this.width / 2;
    const roadBottom = this.height + 32;
    const segments = 18;
    for (let i = segments; i > 0; i -= 1) {
      const t0 = (i - 1) / segments;
      const t1 = i / segments;
      const y0 = lerp(horizon, roadBottom, t0 ** 1.65);
      const y1 = lerp(horizon, roadBottom, t1 ** 1.65);
      const w0 = lerp(42, 470, t0 ** 1.08);
      const w1 = lerp(42, 470, t1 ** 1.08);
      const c0 = centerX + this.getRoadCurveOffset(t0);
      const c1 = centerX + this.getRoadCurveOffset(t1);
      ctx.fillStyle = i % 2 === 0 ? '#303443' : '#272b39';
      ctx.beginPath();
      ctx.moveTo(c0 - w0, y0);
      ctx.lineTo(c0 + w0, y0);
      ctx.lineTo(c1 + w1, y1);
      ctx.lineTo(c1 - w1, y1);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(57,197,187,0.72)';
    ctx.lineWidth = 4;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      for (let i = 0; i <= segments; i += 1) {
        const t = i / segments;
        const y = lerp(horizon, roadBottom, t ** 1.65);
        const w = lerp(42, 470, t ** 1.08);
        const c = centerX + this.getRoadCurveOffset(t);
        if (i === 0) ctx.moveTo(c + side * w, y);
        else ctx.lineTo(c + side * w, y);
      }
      ctx.stroke();
    });

    ctx.strokeStyle = 'rgba(255,235,59,0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([24, 26]);
    ctx.beginPath();
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const y = lerp(horizon, roadBottom, t ** 1.65);
      const c = centerX + this.getRoadCurveOffset(t);
      if (i === 0) ctx.moveTo(c, y);
      else ctx.lineTo(c, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillRect(centerX - 76, roadBottom - 110, 152, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.58)';
    for (let i = 0; i < 12; i += 1) {
      ctx.fillRect(centerX - 76 + i * 13, roadBottom - 110, 6, 8);
    }
  }

  projectToRearCamera(point) {
    const dx = point.x - this.player.x;
    const dy = point.y - this.player.y;
    const forward = Math.cos(this.player.angle) * dx + Math.sin(this.player.angle) * dy;
    const lateral = -Math.sin(this.player.angle) * dx + Math.cos(this.player.angle) * dy;
    if (forward < 18 || forward > 690) return null;
    const t = 1 - clamp(forward / 690, 0, 1);
    const horizon = this.getRaceCameraHorizon();
    const y = lerp(horizon + 4, this.height - 86, t ** 1.58);
    const roadHalf = lerp(42, 390, t ** 1.08);
    const x = this.width / 2 + lateral * (roadHalf / 125);
    const scale = lerp(0.22, 1.42, t ** 1.12);
    if (x < -120 || x > this.width + 120) return null;
    return { x, y, scale, t, forward, lateral };
  }

  drawProjectedRaceObjects(ctx) {
    const projected = [];
    (this.track.surfaceZones || []).forEach(zone => {
      const p = this.projectToRearCamera(zone);
      if (p) projected.push({ type: 'surface', p, source: zone });
    });
    (this.objective?.markers || []).forEach(marker => {
      if (marker.collected) return;
      const p = this.projectToRearCamera(marker);
      if (p) projected.push({ type: 'objective', p, source: marker });
    });
    this.track.boostPads.forEach(pad => {
      const p = this.projectToRearCamera(pad);
      if (p) projected.push({ type: 'boost', p, source: pad });
    });
    this.track.itemBoxes.forEach(box => {
      if (box.respawn > 0) return;
      const p = this.projectToRearCamera(box);
      if (p) projected.push({ type: 'item', p, source: box });
    });
    (this.track.fragmentPickups || []).forEach(fragment => {
      if (fragment.collected) return;
      const p = this.projectToRearCamera(fragment);
      if (p) projected.push({ type: 'fragment', p, source: fragment });
    });
    this.track.hazards.forEach(hazard => {
      const p = this.projectToRearCamera(hazard);
      if (p) projected.push({ type: 'hazard', p, source: hazard });
    });
    this.projectiles.forEach(projectile => {
      const p = this.projectToRearCamera(projectile);
      if (p) projected.push({ type: 'projectile', p, source: projectile });
    });
    this.opponents.forEach(kart => {
      const p = this.projectToRearCamera(kart);
      if (p) projected.push({ type: 'opponent', p, source: kart });
    });
    projected
      .sort((a, b) => a.p.forward - b.p.forward)
      .forEach(entry => {
        if (entry.type === 'opponent') this.drawProjectedOpponent(ctx, entry.source, entry.p);
        if (entry.type === 'surface') this.drawProjectedSurfaceZone(ctx, entry.source, entry.p);
        if (entry.type === 'objective') this.drawProjectedObjectiveMarker(ctx, entry.source, entry.p);
        if (entry.type === 'boost') this.drawProjectedBoostPad(ctx, entry.p);
        if (entry.type === 'item') this.drawProjectedItemBox(ctx, entry.p);
        if (entry.type === 'fragment') this.drawProjectedTrackFragment(ctx, entry.p);
        if (entry.type === 'hazard') this.drawProjectedHazard(ctx, entry.source, entry.p);
        if (entry.type === 'projectile') this.drawProjectedProjectile(ctx, entry.source, entry.p);
      });
    this.drawParticles(ctx);
  }

  drawProjectedBoostPad(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale * 0.42);
    ctx.fillStyle = 'rgba(57,197,187,0.34)';
    ctx.strokeStyle = '#39c5bb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-38, -16, 76, 32, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d8fffb';
    ctx.fillRect(-24, -4, 48, 8);
    ctx.restore();
  }

  drawProjectedSurfaceZone(ctx, zone, p) {
    const colors = {
      ice: ['rgba(168,247,239,0.16)', '#a8f7ef'],
      slow: ['rgba(160,70,255,0.14)', '#9b59b6'],
      jump: ['rgba(255,235,59,0.14)', '#ffeb3b'],
      portal: ['rgba(57,197,187,0.14)', '#39c5bb']
    };
    const [fill, stroke] = colors[zone.type] || ['rgba(255,255,255,0.1)', '#d8fffb'];
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale * 0.42);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(18, zone.r * 0.86), Math.max(8, zone.r * 0.34), 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    if (zone.type === 'jump') {
      ctx.fillStyle = stroke;
      ctx.fillRect(-18, -3, 36, 6);
    }
    if (zone.type === 'portal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(12, zone.r * 0.42), Math.max(5, zone.r * 0.2), 0, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawProjectedItemBox(ctx, p) {
    const pulse = 1 + Math.sin(this.time * 5) * 0.08;
    ctx.save();
    ctx.translate(p.x, p.y - 20 * p.scale);
    ctx.scale(p.scale * pulse, p.scale * pulse);
    const frame = Math.floor(this.time * 6) % 4;
    if (!drawSheetFrame(ctx, this.images.kartItems, 7, 6, frame, 0, -24, -24, 48, 48)) {
      ctx.rotate(this.time * 1.3);
      ctx.fillStyle = 'rgba(255,235,59,0.22)';
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 3;
      ctx.fillRect(-18, -18, 36, 36);
      ctx.strokeRect(-18, -18, 36, 36);
      ctx.fillStyle = '#ffeb3b';
      ctx.font = 'bold 22px Share Tech Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', 0, 8);
    }
    ctx.restore();
  }

  drawProjectedTrackFragment(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y - 18 * p.scale);
    ctx.scale(p.scale, p.scale);
    ctx.rotate(this.time * 1.8);
    ctx.fillStyle = 'rgba(255,235,59,0.22)';
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 14);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawProjectedObjectiveMarker(ctx, marker, p) {
    const isPortal = this.objective?.type === 'closePortals';
    ctx.save();
    ctx.translate(p.x, p.y - 24 * p.scale);
    ctx.scale(p.scale, p.scale);
    ctx.globalAlpha = 0.85 + Math.sin(this.time * 8) * 0.1;
    ctx.strokeStyle = isPortal ? '#39c5bb' : '#ffeb3b';
    ctx.fillStyle = isPortal ? 'rgba(57,197,187,0.2)' : 'rgba(255,235,59,0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isPortal ? '#a8f7ef' : '#ffeb3b';
    ctx.font = 'bold 18px Share Tech Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isPortal ? 'P' : 'F', 0, 7);
    ctx.restore();
  }

  drawProjectedHazard(ctx, hazard, p) {
    const activeRadius = (hazard.r + Math.sin(this.time * 3.2 + hazard.phase) * 6) * p.scale;
    ctx.fillStyle = 'rgba(231,76,60,0.2)';
    ctx.strokeStyle = hazard.temporary ? '#ffeb3b' : '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, activeRadius * 1.35, activeRadius * 0.48, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }

  drawProjectedProjectile(ctx, projectile, p) {
    ctx.save();
    ctx.translate(p.x, p.y - 18 * p.scale);
    ctx.scale(p.scale, p.scale);
    ctx.rotate(Math.atan2(projectile.vy, projectile.vx));
    if (!drawSheetFrame(ctx, this.images.kartItems, 7, 6, 6, 1, -30, -12, 60, 24)) {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  drawProjectedOpponent(ctx, kart, p) {
    ctx.save();
    ctx.translate(p.x, p.y - 20 * p.scale);
    ctx.scale(p.scale, p.scale);
    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.beginPath();
    ctx.ellipse(0, 30, 28, 8, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = kart.color;
    ctx.strokeStyle = '#050307';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-22, -22, 44, 56, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#111723';
    ctx.fillRect(-14, -12, 28, 20);
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(-16, 24, 32, 6);
    if (kart.boost > 0) {
      ctx.fillStyle = kart.color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(-16, 34);
      ctx.lineTo(0, 66);
      ctx.lineTo(16, 34);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.fillStyle = '#d8fffb';
    ctx.font = `${Math.max(8, 10 * p.scale)}px Share Tech Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(kart.name, p.x, p.y - 62 * p.scale);
  }

  drawRearPlayerKart(ctx) {
    const isDrifting = this.player.drift > 0.12;
    const sprite = this.images.kartDirections;
    const centerX = this.width / 2 + clamp(this.player.drift * Math.sign(this.getPlayerInput().turn || 0) * 34, -34, 34);
    const baseY = this.height - 92;
    const kartW = 218;
    const kartH = 142;
    if (sprite?.complete && sprite.naturalWidth) {
      const cols = 4;
      const rows = 4;
      const frameW = sprite.naturalWidth / cols;
      const frameH = sprite.naturalHeight / rows;
      const turn = this.getPlayerInput().turn || 0;
      const row = 1;
      const col = this.player.spin > 0
        ? 3
        : turn < -0.25 || (isDrifting && turn < 0)
          ? 0
          : turn > 0.25 || (isDrifting && turn > 0)
            ? 3
            : Math.floor(this.time * (this.player.boost > 0 ? 10 : 5)) % 2 + 1;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, col * frameW, row * frameH, frameW, frameH, centerX - kartW / 2, baseY - kartH + 8, kartW, kartH);
      this.drawRearKartActionOverlay(ctx, centerX, baseY, kartW, kartH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#39c5bb';
      ctx.strokeStyle = '#050307';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(centerX - 58, baseY - 88, 116, 98, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10131c';
      ctx.fillRect(centerX - 36, baseY - 64, 72, 36);
    }
    if (this.player.boost > 0) {
      ctx.save();
      const fireGrad = ctx.createLinearGradient(centerX, baseY + 8, centerX, this.height + 60);
      fireGrad.addColorStop(0, 'rgba(57, 197, 187, 0.95)');
      fireGrad.addColorStop(0.35, 'rgba(57, 197, 187, 0.55)');
      fireGrad.addColorStop(1, 'rgba(57, 197, 187, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      const wobble = Math.sin(this.time * 26) * 12;
      ctx.moveTo(centerX - 36, baseY + 8);
      ctx.lineTo(centerX + wobble, this.height + 50);
      ctx.lineTo(centerX + 36, baseY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    if (this.player.air > 0) {
      ctx.strokeStyle = 'rgba(255,235,59,0.78)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY - 58, 102, 50, 0, 0, TAU);
      ctx.stroke();
    }
    if (this.player.shield > 0) {
      ctx.save();
      const grad = ctx.createRadialGradient(centerX, baseY - 42, 20, centerX, baseY - 42, 120);
      grad.addColorStop(0, 'rgba(155, 89, 182, 0.02)');
      grad.addColorStop(0.75, 'rgba(155, 89, 182, 0.16)');
      grad.addColorStop(1, 'rgba(217, 182, 255, 0.86)');
      ctx.fillStyle = grad;
      ctx.strokeStyle = 'rgba(217, 182, 255, 0.92)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#9b59b6';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY - 42, 122 + Math.sin(this.time * 9.5) * 4, 76 + Math.cos(this.time * 9.5) * 4, 0, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  drawRearKartActionOverlay(ctx, centerX, baseY, kartW = 218, kartH = 142) {
    const actions = this.images.kartActions;
    if (!actions?.complete || !actions.naturalWidth) return;
    const turn = this.getPlayerInput().turn || 0;
    let row = -1;
    if (this.player.spin > 0) row = 4;
    else if (this.player.boost > 0) row = 1;
    else if (this.player.drift > 0.18) row = 2;
    if (row < 0) return;
    const col = this.player.spin > 0
      ? Math.floor(this.time * 12) % 4
      : turn < -0.2
        ? 0
        : turn > 0.2
          ? 3
          : Math.floor(this.time * 8) % 4;
    ctx.save();
    ctx.globalAlpha = this.player.spin > 0 ? 0.9 : 0.76;
    ctx.imageSmoothingEnabled = false;
    drawSheetFrame(ctx, actions, 4, 6, col, row, centerX - kartW * 0.53, baseY - kartH + 3, kartW * 1.06, kartH * 1.06);
    ctx.restore();
  }

  drawTopDownMinimap(ctx) {
    ctx.fillStyle = 'rgba(2,1,8,0.78)';
    ctx.fillRect(this.width - 172, 16, 150, 94);
    ctx.strokeStyle = 'rgba(255,235,59,0.45)';
    ctx.strokeRect(this.width - 172, 16, 150, 94);
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.width - 172, 16, 150, 94);
    ctx.clip();
    ctx.translate(this.width - 172, 16);
    ctx.scale(150 / this.width, 94 / this.height);
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    this.track.waypoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
    if (this.track.shortcuts?.length) {
      ctx.strokeStyle = 'rgba(57,197,187,0.55)';
      ctx.lineWidth = 10;
      this.track.shortcuts.forEach(shortcut => {
        ctx.beginPath();
        ctx.moveTo(shortcut.from.x, shortcut.from.y);
        ctx.lineTo(shortcut.to.x, shortcut.to.y);
        ctx.stroke();
      });
    }
    (this.track.surfaceZones || []).forEach(zone => {
      ctx.fillStyle = zone.type === 'ice'
        ? 'rgba(168,247,239,0.62)'
        : zone.type === 'slow'
          ? 'rgba(155,89,182,0.62)'
          : zone.type === 'portal'
            ? 'rgba(57,197,187,0.62)'
            : 'rgba(255,235,59,0.62)';
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, Math.max(12, zone.r * 0.34), 0, TAU);
      ctx.fill();
    });
    (this.objective?.markers || []).forEach(marker => {
      if (marker.collected) return;
      ctx.fillStyle = this.objective.type === 'closePortals' ? '#39c5bb' : '#ffeb3b';
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 18, 0, TAU);
      ctx.fill();
    });
    (this.track.fragmentPickups || []).forEach(fragment => {
      if (fragment.collected) return;
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(fragment.x, fragment.y, 10, 0, TAU);
      ctx.fill();
    });
    [this.player, ...this.opponents].forEach(kart => {
      ctx.fillStyle = kart.color;
      ctx.beginPath();
      ctx.arc(kart.x, kart.y, kart.id === 'mirelle' ? 18 : 12, 0, TAU);
      ctx.fill();
    });
    ctx.restore();
  }

  drawBackdrop(ctx) {
    const gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 80, this.width / 2, this.height / 2, 620);
    gradient.addColorStop(0, '#13242c');
    gradient.addColorStop(0.45, '#070b16');
    gradient.addColorStop(1, '#020106');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    const trackImage = this.images.trackNexus;
    if (trackImage?.complete && trackImage.naturalWidth) {
      ctx.globalAlpha = 0.16;
      ctx.drawImage(trackImage, 0, 0, this.width, this.height);
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = 'rgba(57,197,187,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + Math.sin(this.time + x) * 8, this.height);
      ctx.stroke();
    }
  }

  drawTrack(ctx) {
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2 + 4);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1f2230';
    ctx.lineWidth = 154;
    ctx.beginPath();
    ctx.ellipse(0, 0, 286, 188, 0, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = '#303443';
    ctx.lineWidth = 118;
    ctx.beginPath();
    ctx.ellipse(0, 0, 286, 188, 0, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,235,59,0.32)';
    ctx.setLineDash([18, 18]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 286, 188, 0, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(57,197,187,0.58)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 364, 266, 0, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 208, 110, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(442, 452, 76, 6);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    for (let i = 0; i < 8; i += 1) {
      ctx.fillRect(442 + i * 10, 452, 5, 6);
    }
  }

  drawObjects(ctx) {
    (this.track.surfaceZones || []).forEach(zone => {
      ctx.save();
      ctx.translate(zone.x, zone.y);
      ctx.fillStyle = zone.type === 'ice'
        ? 'rgba(168,247,239,0.16)'
        : zone.type === 'slow'
          ? 'rgba(155,89,182,0.15)'
          : zone.type === 'portal'
            ? 'rgba(57,197,187,0.16)'
            : 'rgba(255,235,59,0.14)';
      ctx.strokeStyle = zone.type === 'ice'
        ? '#a8f7ef'
        : zone.type === 'slow'
          ? '#9b59b6'
          : zone.type === 'portal'
            ? '#39c5bb'
            : '#ffeb3b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, zone.r, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    this.track.boostPads.forEach(pad => {
      ctx.save();
      ctx.translate(pad.x, pad.y);
      ctx.rotate(pad.angle);
      ctx.fillStyle = 'rgba(57,197,187,0.35)';
      ctx.strokeStyle = '#39c5bb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-32, -12, 64, 24, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d8fffb';
      ctx.fillRect(-18, -3, 36, 6);
      ctx.restore();
    });
    this.track.itemBoxes.forEach(box => {
      if (box.respawn > 0) return;
      const pulse = 1 + Math.sin(this.time * 5) * 0.08;
      ctx.save();
      ctx.translate(box.x, box.y);
      ctx.scale(pulse, pulse);
      const frame = Math.floor(this.time * 6) % 4;
      if (!drawSheetFrame(ctx, this.images.kartItems, 7, 6, frame, 0, -18, -18, 36, 36)) {
        ctx.rotate(this.time * 1.6);
        ctx.fillStyle = 'rgba(255,235,59,0.18)';
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 2;
        ctx.fillRect(-14, -14, 28, 28);
        ctx.strokeRect(-14, -14, 28, 28);
        ctx.fillStyle = '#ffeb3b';
        ctx.font = 'bold 17px Share Tech Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('?', 0, 6);
      }
      ctx.restore();
    });
    this.track.hazards.forEach(hazard => {
      const activeRadius = hazard.r + Math.sin(this.time * 3.2 + hazard.phase) * 6;
      ctx.fillStyle = 'rgba(231,76,60,0.14)';
      ctx.strokeStyle = hazard.temporary ? '#ffeb3b' : '#e74c3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, activeRadius, 0, TAU);
      ctx.fill();
      ctx.stroke();
    });
    this.projectiles.forEach(projectile => {
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(Math.atan2(projectile.vy, projectile.vx));
      if (!drawSheetFrame(ctx, this.images.kartItems, 7, 6, 6, 1, -22, -9, 44, 18)) {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  drawKart(ctx, kart) {
    ctx.save();
    ctx.translate(kart.x, kart.y);
    ctx.rotate(kart.angle + Math.PI / 2 + (kart.spin > 0 ? Math.sin(this.time * 26) * kart.spin : 0));
    const isPlayer = kart.id === 'mirelle';
    const sprite = isPlayer ? this.images.kartDirections : null;
    if (isPlayer && sprite?.complete && sprite.naturalWidth) {
      const cols = 4;
      const rows = 4;
      const frameW = sprite.naturalWidth / cols;
      const frameH = sprite.naturalHeight / rows;
      const directionIndex = Math.round((((kart.angle % TAU) + TAU) % TAU) / (TAU / rows)) % rows;
      const motionFrame = Math.floor(this.time * (kart.boost > 0 ? 12 : 7)) % cols;
      ctx.drawImage(sprite, motionFrame * frameW, directionIndex * frameH, frameW, frameH, -29, -34, 58, 68);
    } else {
      ctx.fillStyle = kart.color;
      ctx.strokeStyle = '#050307';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-18, -28, 36, 56, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10131c';
      ctx.fillRect(-12, -14, 24, 18);
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(-10, -30, 20, 6);
    }
    if (kart.boost > 0) {
      ctx.fillStyle = kart.color;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.moveTo(-16, 28);
      ctx.lineTo(0, 58 + Math.sin(this.time * 30) * 8);
      ctx.lineTo(16, 28);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (kart.air > 0) {
      ctx.strokeStyle = 'rgba(255,235,59,0.74)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 38, 24, 0, 0, TAU);
      ctx.stroke();
    }
    if (kart.shield > 0) {
      ctx.strokeStyle = 'rgba(217,182,255,0.86)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = kart.ai ? '#aaa' : '#d8fffb';
    ctx.font = 'bold 10px Share Tech Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(kart.name, kart.x, kart.y - 34);
  }

  drawParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.globalAlpha = clamp(particle.life * 2.4, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;
  }

  drawHud(ctx) {
    const player = this.player;
    const hudX = 14;
    const hudY = 78;
    ctx.fillStyle = 'rgba(2,1,8,0.78)';
    ctx.fillRect(hudX, hudY, 250, 148);
    ctx.strokeStyle = 'rgba(57,197,187,0.45)';
    ctx.strokeRect(hudX, hudY, 250, 148);
    drawSheetFrame(ctx, this.images.hudIcons, 5, 7, 0, 0, hudX + 8, hudY + 10, 34, 34);
    ctx.font = 'bold 15px Share Tech Mono, monospace';
    ctx.fillStyle = '#39c5bb';
    ctx.fillText(`A.R.C.A. RACE // ${player.rank}/4`, hudX + 50, hudY + 24);
    ctx.font = '12px Share Tech Mono, monospace';
    ctx.fillStyle = '#d8fffb';
    ctx.fillText(`Tour ${Math.min(player.lap + 1, this.track.laps)}/${this.track.laps}`, hudX + 50, hudY + 46);
    ctx.fillText(`Vitesse ${Math.round(Math.abs(player.speed))}`, hudX + 50, hudY + 66);
    ctx.fillText(`Cache ${player.item ? this.getItemName(player.item) : 'vide'}`, hudX + 50, hudY + 86);
    ctx.fillText(`Fragments piste ${this.fragmentsCollected}/${this.track.fragmentPickups.length}`, hudX + 50, hudY + 106);
    ctx.fillStyle = '#8aa5a5';
    ctx.font = '10px Share Tech Mono, monospace';
    ctx.fillText(this.track.name.fr.toUpperCase().slice(0, 28), hudX + 14, hudY + 122);
    if (player.item) {
      const itemFrame = KART_ITEM_FRAMES[player.item] || KART_ITEM_FRAMES.cache;
      drawSheetFrame(ctx, this.images.kartItems, 7, 6, itemFrame.col, itemFrame.row, hudX + 204, hudY + 62, 34, 34);
    } else {
      drawSheetFrame(ctx, this.images.hudIcons, 5, 7, 1, 6, hudX + 204, hudY + 62, 34, 34);
    }
    const turboRatio = clamp(player.driftCharge / 2.4, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(hudX + 14, hudY + 110, 224, 5);
    ctx.fillStyle = turboRatio > 0.72 ? '#d9b6ff' : turboRatio > 0.45 ? '#ffb15c' : '#39c5bb';
    ctx.fillRect(hudX + 14, hudY + 110, 224 * turboRatio, 5);
    ctx.fillStyle = '#8aa5a5';
    ctx.font = '9px Share Tech Mono, monospace';
    ctx.fillText(player.air > 0 ? 'TRICK BOOST' : this.slipstreamTimer > 0.72 ? 'ASPIRATION ACTIVE' : this.startBoostWindow && this.countdown > 0 ? 'FENETRE DEPART PARFAIT' : 'CHARGE MINI-TURBO', hudX + 14, hudY + 136);
    ctx.fillStyle = this.objective?.complete ? '#39c5bb' : this.objective?.failed ? '#e74c3c' : '#d8fffb';
    ctx.font = '10px Share Tech Mono, monospace';
    ctx.fillText(this.getObjectiveStatus().slice(0, 34), hudX + 14, hudY + 144);

    this.drawTopDownMinimap(ctx);

    if (this.countdown > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#ffeb3b';
      ctx.font = 'bold 54px Share Tech Mono, monospace';
      ctx.textAlign = 'center';
      const label = this.countdown > 1 ? Math.ceil(this.countdown).toString() : 'ANCRE';
      ctx.fillText(label, this.width / 2, this.height / 2);
      ctx.textAlign = 'left';
    }
    if (this.messageTimer > 0) {
      ctx.fillStyle = 'rgba(2,1,8,0.82)';
      ctx.strokeStyle = '#39c5bb';
      ctx.lineWidth = 1;
      ctx.fillRect(300, 26, 360, 42);
      ctx.strokeRect(300, 26, 360, 42);
      ctx.fillStyle = '#d8fffb';
      ctx.font = 'bold 13px Share Tech Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.message, 480, 52);
      ctx.textAlign = 'left';
    }
  }
}
