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
  cache: { col: 0, row: 0 }
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

export const KART_TRACK_LAYOUTS = {
  nexus_archive_loop: {
    id: 'nexus_archive_loop',
    name: { fr: 'Boucle Archive A.R.C.A.', en: 'A.R.C.A. Archive Loop' },
    family: 'nexus',
    difficulty: 1,
    tags: ['starter', 'wide', 'classic'],
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
    start: { x: 520, y: 486, angle: -Math.PI / 2 },
    laps: 3,
    roadWidth: 126,
    offroadDrag: 0.83,
    surfaceZones: [
      { type: 'ice', x: 236, y: 236, r: 92 },
      { type: 'ice', x: 726, y: 350, r: 86 }
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
  constructor(width, height, onFinish = () => {}, trackId = 'nexus_archive_loop') {
    this.width = width;
    this.height = height;
    this.onFinish = onFinish;
    this.trackId = trackId;
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

  createTrackState(trackId = this.trackId) {
    const baseTrack = RACE_TRACKS[trackId] || RACE_TRACKS.nexus_archive_loop;
    return {
      ...baseTrack,
      checkpoints: baseTrack.checkpoints.map(point => ({ ...point })),
      waypoints: baseTrack.waypoints.map(point => ({ ...point })),
      boostPads: baseTrack.boostPads.map(pad => ({ ...pad })),
      itemBoxes: baseTrack.itemBoxes.map(box => ({ ...box, respawn: 0 })),
      hazards: baseTrack.hazards.map(hazard => ({ ...hazard })),
      surfaceZones: (baseTrack.surfaceZones || []).map(zone => ({ ...zone })),
      shortcuts: (baseTrack.shortcuts || []).map(shortcut => ({
        ...shortcut,
        from: { ...shortcut.from },
        to: { ...shortcut.to }
      }))
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
    this.finished = false;
    this.finishReported = false;
    this.message = 'Synchronisation de depart';
    this.messageTimer = 2;
    this.particles = [];
    this.projectiles = [];
    this.player = this.createKart({
      id: 'mirelle',
      name: 'Mirelle Suture',
      color: '#39c5bb',
      x: start.x,
      y: start.y,
      angle: start.angle,
      ai: false,
      laneOffset: 0
    });
    this.opponents = [
      this.createKart({ id: 'bastion', name: 'Bastion Korr', color: '#ffb15c', x: start.x - 40, y: start.y + 28, angle: start.angle, ai: true, laneOffset: -26, maxSpeed: 244 }),
      this.createKart({ id: 'loom', name: 'Loom-07', color: '#d9b6ff', x: start.x + 42, y: start.y + 30, angle: start.angle, ai: true, laneOffset: 22, maxSpeed: 252 }),
      this.createKart({ id: 'sable', name: 'Sable Vey', color: '#e74c3c', x: start.x, y: start.y + 58, angle: start.angle, ai: true, laneOffset: 8, maxSpeed: 238 })
    ];
  }

  createKart({ id, name, color, x, y, angle, ai, laneOffset, maxSpeed = 266 }) {
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
      accel: 320,
      turnRate: 3.2,
      drift: 0,
      boost: 0,
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
      hitCooldown: 0
    };
  }

  setInput(keys = {}) {
    this.keys = keys;
  }

  useItem() {
    if (!this.player.item || this.finished || this.countdown > 0) return;
    const item = this.player.item;
    this.player.item = null;
    if (item === 'boost') {
      this.player.boost = Math.max(this.player.boost, 1.45);
      this.showMessage('Suture de vitesse: boost instable');
      this.spawnParticles(this.player.x, this.player.y, '#39c5bb', 18);
      return;
    }
    if (item === 'shield') {
      this.player.shield = 4;
      this.showMessage('Voile de garde actif');
      return;
    }
    if (item === 'trap') {
      const back = {
        x: this.player.x - Math.cos(this.player.angle) * 34,
        y: this.player.y - Math.sin(this.player.angle) * 34
      };
      this.track.hazards.push({ ...back, r: 24, phase: this.time, temporary: 8 });
      this.showMessage('Noeud de trame largue');
      return;
    }
    this.projectiles.push({
      x: this.player.x + Math.cos(this.player.angle) * 28,
      y: this.player.y + Math.sin(this.player.angle) * 28,
      vx: Math.cos(this.player.angle) * 420,
      vy: Math.sin(this.player.angle) * 420,
      life: 1.4,
      color: '#ffeb3b'
    });
    this.showMessage('Aiguille de resonance lancee');
  }

  update(dt) {
    dt = clamp(dt, 0, 1 / 30);
    this.time += dt;
    this.countdown = Math.max(0, this.countdown - dt);
    this.messageTimer = Math.max(0, this.messageTimer - dt);
    if (this.finished) {
      this.updateParticles(dt);
      return;
    }
    this.track.hazards = this.track.hazards
      .map(hazard => hazard.temporary ? { ...hazard, temporary: hazard.temporary - dt } : hazard)
      .filter(hazard => !hazard.temporary || hazard.temporary > 0);
    this.track.itemBoxes.forEach(box => { box.respawn = Math.max(0, box.respawn - dt); });
    this.updateKart(this.player, dt);
    this.opponents.forEach(kart => this.updateAiKart(kart, dt));
    this.updateProjectiles(dt);
    this.resolveKartCollisions();
    this.updateProgressAndRanks();
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
    if (kart.finished) {
      kart.speed *= 0.985;
      kart.x += Math.cos(kart.angle) * kart.speed * dt;
      kart.y += Math.sin(kart.angle) * kart.speed * dt;
      return;
    }
    if (this.countdown > 0) {
      kart.speed *= 0.94;
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
    const drag = surface === 'ice' ? 0.994 : onTrack ? 0.988 : this.track.offroadDrag;
    kart.speed *= Math.pow(drag, dt * 60);
    if (kart.spin > 0) kart.speed *= 0.965;
    const driftHeld = input.drift && Math.abs(kart.speed) > 80;
    kart.drift = clamp(kart.drift + (driftHeld ? dt * 1.6 : -dt * 2.3), 0, 1);
    const grip = surface === 'ice' ? 0.68 : 1;
    const turnPower = (0.55 + clamp(Math.abs(kart.speed) / 220, 0, 1) * 0.85) * (kart.drift ? 1.35 : 1) * grip;
    kart.angle += input.turn * kart.turnRate * turnPower * dt * (kart.speed >= 0 ? 1 : -1);
    if (!driftHeld && kart.drift > 0.72) {
      kart.boost = Math.max(kart.boost, 0.55);
      this.spawnParticles(kart.x, kart.y, kart.color, 10);
    }
    kart.x += Math.cos(kart.angle) * kart.speed * dt;
    kart.y += Math.sin(kart.angle) * kart.speed * dt;
    this.applyTrackBounds(kart);
    this.applyBoostPads(kart);
    this.applyHazards(kart);
    this.collectItem(kart);
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
    this.updateKart(kart, dt);
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
    if (road.factor < 0.23) {
      kart.x = lerp(kart.x, road.x, 0.08);
      kart.y = lerp(kart.y, road.y, 0.08);
      kart.speed *= 0.955;
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
    const points = this.track.waypoints || [];
    if (points.length < 2) return { x: this.width / 2, y: this.height / 2, distance: 0, factor: 1 };
    let best = { x: points[0].x, y: points[0].y, distance: Infinity, factor: 0 };
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
        best = { x: px, y: py, distance: d, factor: clamp(1 - d / (this.track.roadWidth * 0.55), 0, 1) };
      }
    }
    return best;
  }

  getSurfaceAt(x, y) {
    const zone = (this.track.surfaceZones || []).find(surface => distance({ x, y }, surface) < surface.r);
    return zone?.type || 'road';
  }

  applyBoostPads(kart) {
    this.track.boostPads.forEach(pad => {
      if (distance(kart, pad) < 34) {
        kart.boost = Math.max(kart.boost, 0.65);
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
          kart.speed *= -0.25;
          kart.spin = 0.72;
          kart.hitCooldown = 1.15;
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

  rollItem(kart) {
    const pool = kart.rank >= 3 ? ['boost', 'boost', 'projectile', 'shield', 'trap'] : ['projectile', 'shield', 'trap', 'boost'];
    return pool[Math.floor((this.time * 997 + kart.x + kart.y) % pool.length)];
  }

  getItemName(item) {
    return {
      boost: 'Suture de vitesse',
      shield: 'Voile de garde',
      trap: 'Noeud de trame',
      projectile: 'Aiguille de resonance'
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

  updateProjectiles(dt) {
    this.projectiles.forEach(projectile => {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;
      this.opponents.forEach(kart => {
        if (projectile.life > 0 && distance(projectile, kart) < 28 && kart.hitCooldown <= 0) {
          kart.speed *= 0.22;
          kart.spin = 0.8;
          kart.hitCooldown = 1.2;
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
    const grade = rank === 1 && time < 88 ? 'S' : rank === 1 ? 'A' : rank === 2 ? 'B' : 'C';
    return {
      mode: 'Race',
      trackId: this.track.id,
      pilot: this.player.name,
      time,
      rank,
      grade,
      laps: this.track.laps
    };
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawRaceCameraBackdrop(ctx);
    this.drawRearRoad(ctx);
    this.drawProjectedRaceObjects(ctx);
    this.drawRearPlayerKart(ctx);
    this.drawHud(ctx);
  }

  drawRaceCameraBackdrop(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#020106');
    sky.addColorStop(0.34, '#081527');
    sky.addColorStop(0.58, '#13242c');
    sky.addColorStop(1, '#05030a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    const horizon = this.getRaceCameraHorizon();
    const trackImage = this.images.trackNexus;
    if (trackImage?.complete && trackImage.naturalWidth) {
      ctx.globalAlpha = 0.12;
      ctx.drawImage(trackImage, 0, -this.height * 0.42, this.width, this.height * 1.7);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = 'rgba(57,197,187,0.1)';
    for (let i = 0; i < 9; i += 1) {
      const x = (i / 8) * this.width;
      ctx.beginPath();
      ctx.moveTo(this.width / 2, horizon + 8);
      ctx.lineTo(x, this.height);
      ctx.lineTo(x + 1, this.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,235,59,0.1)';
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
    const curve = this.getRoadCurveOffset(t);
    const x = this.width / 2 + curve + lateral * (roadHalf / 125);
    const scale = lerp(0.22, 1.42, t ** 1.12);
    if (x < -120 || x > this.width + 120) return null;
    return { x, y, scale, t, forward, lateral };
  }

  drawProjectedRaceObjects(ctx) {
    const projected = [];
    this.track.boostPads.forEach(pad => {
      const p = this.projectToRearCamera(pad);
      if (p) projected.push({ type: 'boost', p, source: pad });
    });
    this.track.itemBoxes.forEach(box => {
      if (box.respawn > 0) return;
      const p = this.projectToRearCamera(box);
      if (p) projected.push({ type: 'item', p, source: box });
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
        if (entry.type === 'boost') this.drawProjectedBoostPad(ctx, entry.p);
        if (entry.type === 'item') this.drawProjectedItemBox(ctx, entry.p);
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
    const baseY = this.height - 74;
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
      ctx.drawImage(sprite, col * frameW, row * frameH, frameW, frameH, centerX - 136, baseY - 126, 272, 178);
      this.drawRearKartActionOverlay(ctx, centerX, baseY);
      ctx.restore();
    } else {
      ctx.fillStyle = '#39c5bb';
      ctx.strokeStyle = '#050307';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(centerX - 74, baseY - 106, 148, 126, 20);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10131c';
      ctx.fillRect(centerX - 46, baseY - 78, 92, 46);
    }
    if (this.player.boost > 0) {
      ctx.fillStyle = 'rgba(57,197,187,0.5)';
      ctx.beginPath();
      ctx.moveTo(centerX - 58, baseY + 14);
      ctx.lineTo(centerX, this.height + 42);
      ctx.lineTo(centerX + 58, baseY + 14);
      ctx.closePath();
      ctx.fill();
    }
    if (this.player.shield > 0) {
      ctx.strokeStyle = 'rgba(217,182,255,0.82)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY - 50, 150, 92, 0, 0, TAU);
      ctx.stroke();
    }
  }

  drawRearKartActionOverlay(ctx, centerX, baseY) {
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
    drawSheetFrame(ctx, actions, 4, 6, col, row, centerX - 142, baseY - 132, 284, 188);
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
    ctx.fillStyle = 'rgba(2,1,8,0.78)';
    ctx.fillRect(14, 14, 250, 106);
    ctx.strokeStyle = 'rgba(57,197,187,0.45)';
    ctx.strokeRect(14, 14, 250, 106);
    drawSheetFrame(ctx, this.images.hudIcons, 5, 7, 0, 0, 22, 24, 34, 34);
    ctx.font = 'bold 15px Share Tech Mono, monospace';
    ctx.fillStyle = '#39c5bb';
    ctx.fillText(`A.R.C.A. RACE // ${player.rank}/4`, 64, 38);
    ctx.font = '12px Share Tech Mono, monospace';
    ctx.fillStyle = '#d8fffb';
    ctx.fillText(`Tour ${Math.min(player.lap + 1, this.track.laps)}/${this.track.laps}`, 64, 60);
    ctx.fillText(`Vitesse ${Math.round(Math.abs(player.speed))}`, 64, 80);
    ctx.fillText(`Cache ${player.item ? this.getItemName(player.item) : 'vide'}`, 64, 100);
    ctx.fillStyle = '#8aa5a5';
    ctx.font = '10px Share Tech Mono, monospace';
    ctx.fillText(this.track.name.fr.toUpperCase().slice(0, 28), 28, 116);
    if (player.item) {
      const itemFrame = KART_ITEM_FRAMES[player.item] || KART_ITEM_FRAMES.cache;
      drawSheetFrame(ctx, this.images.kartItems, 7, 6, itemFrame.col, itemFrame.row, 218, 76, 34, 34);
    } else {
      drawSheetFrame(ctx, this.images.hudIcons, 5, 7, 1, 6, 218, 76, 34, 34);
    }

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
