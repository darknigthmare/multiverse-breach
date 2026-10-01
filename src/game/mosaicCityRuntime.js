export const MOSAIC_CITY_ART = '/images/campaign-oc/chapter-01-atrium-v1.png';
export const MOSAIC_INTERACTION_RANGE = Object.freeze({ portal: 72, npc: 58, zone: 72 });
export const MOSAIC_WELCOME = Object.freeze({
  title: { fr: 'Une ville qui se souvient', en: 'A city that remembers' },
  lines: {
    fr: [
      'Mirelle : « Le Nexus garde la mémoire des mondes que nous traversons. A.R.C.A. relie leurs traces sans effacer ce qui les distingue. »',
      '« Je reste ton repère dans l’Atrium. Approche une balise pour t’orienter, ou la table des missions pour choisir ta prochaine destination. »',
      '« Prends ton temps, Ancre. Tu peux parcourir les quartiers disponibles, revenir et reprendre ton chemin. »'
    ],
    en: [
      'Mirelle: “The Nexus remembers the worlds we travel through. A.R.C.A. connects their traces without erasing what makes them distinct.”',
      '“I remain your guide in the Atrium. Approach a beacon to find your bearings, or the mission table to choose your next destination.”',
      '“Take your time, Anchor. You can explore the available districts, return, and continue your journey.”'
    ]
  }
});

// Discovery follows the already-filtered hero catalog and actual ownership.
// Rendering a small page of portals must never truncate this authorization list.
export const getMosaicUniverseCatalog = (heroes = [], unlockedIds = []) => {
  const owned = new Set(unlockedIds);
  return [...new Set(heroes.filter(hero => hero && owned.has(hero.id) && typeof hero.universe === 'string' && hero.universe.trim()).map(hero => hero.universe))]
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
};

const searchable = value => String(value || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export const getMosaicDestinationView = (universes = [], { query = '', page = 0, pageSize = 9 } = {}) => {
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 9;
  const needle = searchable(query).trim();
  const filtered = universes.filter(universe => searchable(universe).includes(needle));
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.max(0, Math.min(pageCount - 1, Number.isFinite(page) ? Math.floor(page) : 0));
  return { items: filtered.slice(currentPage * size, (currentPage + 1) * size), total: universes.length, matching: filtered.length, page: currentPage, pageCount };
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const getMosaicZoneAnchor = zone => ({ x: zone.x + zone.w / 2, y: zone.y + zone.h / 2 });
export const MOSAIC_PERSON_FOOT_OFFSET = 24;
export const MOSAIC_PERSON_RADIUS = 14;

// Only raised scenery has a solid footprint. Roads, fog, rings and the
// translucent district outlines are floor markings, not invisible walls.
export const getMosaicScenery = district => district?.universe && district.place?.type === 'city'
  ? Array.from({ length: 9 }, (_, index) => {
    const y = 250 + (index % 3) * 28;
    const h = 250 - (index % 2) * 44;
    return { type: 'building', id: `building-${index}`, x: 120 + index * 185, y, w: 105, h };
  })
  : [];

export const getMosaicDrawDepth = entry => entry.type === 'building'
  ? entry.y + entry.h
  : entry.type === 'terminal'
    ? getMosaicZoneAnchor(entry.zone).y + 18
    : entry.y + MOSAIC_PERSON_FOOT_OFFSET;

export const getMosaicSceneObstacles = (district, zones = []) => [
  ...getMosaicScenery(district).map(building => ({
    id: building.id, x: building.x, y: building.y + building.h - 18 - MOSAIC_PERSON_FOOT_OFFSET, w: building.w, h: 18
  })),
  ...zones.filter(zone => zone.action && zone.action !== 'talk').map(zone => {
    const anchor = getMosaicZoneAnchor(zone);
    return { id: `terminal-${zone.id}`, x: anchor.x - 22, y: anchor.y + 8 - MOSAIC_PERSON_FOOT_OFFSET, w: 44, h: 10 };
  })
];

const expandedObstacle = obstacle => ({
  left: obstacle.x - MOSAIC_PERSON_RADIUS,
  right: obstacle.x + obstacle.w + MOSAIC_PERSON_RADIUS,
  top: obstacle.y - MOSAIC_PERSON_RADIUS,
  bottom: obstacle.y + obstacle.h + MOSAIC_PERSON_RADIUS
});
const obstaclePenetration = (point, obstacle) => {
  const { left, right, top, bottom } = expandedObstacle(obstacle);
  return Math.max(0, Math.min(point.x - left, right - point.x, point.y - top, bottom - point.y));
};
export const isMosaicPositionBlocked = (point, obstacles = []) => obstacles.some(obstacle => obstaclePenetration(point, obstacle) > 0);

export const findMosaicWalkablePosition = (point, district, obstacles = []) => {
  const bounded = clampMosaicPosition(point, district);
  if (!isMosaicPositionBlocked(bounded, obstacles)) return bounded;
  const candidates = obstacles.flatMap(obstacle => {
    const { left, right, top, bottom } = expandedObstacle(obstacle);
    return [
      { x: left - 1, y: bounded.y }, { x: right + 1, y: bounded.y },
      { x: bounded.x, y: top - 1 }, { x: bounded.x, y: bottom + 1 },
      { x: left - 1, y: top - 1 }, { x: right + 1, y: top - 1 },
      { x: left - 1, y: bottom + 1 }, { x: right + 1, y: bottom + 1 }
    ];
  }).map(candidate => clampMosaicPosition(candidate, district))
    .filter(candidate => !isMosaicPositionBlocked(candidate, obstacles))
    .sort((a, b) => Math.hypot(a.x - bounded.x, a.y - bounded.y) - Math.hypot(b.x - bounded.x, b.y - bounded.y));
  return candidates[0] || null;
};

// Visibility paths use the same expanded floor footprints as movement. This
// keeps tapping a portal or terminal useful after adding scenery collisions.
export const isMosaicSegmentClear = (from, to, obstacles = []) => !obstacles.some(obstacle => {
  const { left, right, top, bottom } = expandedObstacle(obstacle);
  let enter = 0;
  let leave = 1;
  for (const [start, delta, min, max] of [[from.x, to.x - from.x, left, right], [from.y, to.y - from.y, top, bottom]]) {
    if (Math.abs(delta) < 1e-9) {
      if (start <= min || start >= max) return false;
    } else {
      const first = (min - start) / delta;
      const last = (max - start) / delta;
      enter = Math.max(enter, Math.min(first, last));
      leave = Math.min(leave, Math.max(first, last));
      if (enter >= leave) return false;
    }
  }
  return enter < leave && leave > 0 && enter < 1;
});

export const planMosaicPath = (from, destination, district, obstacles = []) => {
  const target = findMosaicWalkablePosition(destination, district, obstacles);
  if (!target) return [];
  if (isMosaicSegmentClear(from, target, obstacles)) return [target];
  const corners = obstacles.flatMap(obstacle => {
    const { left, right, top, bottom } = expandedObstacle(obstacle);
    return [{ x: left - 1, y: top - 1 }, { x: right + 1, y: top - 1 }, { x: left - 1, y: bottom + 1 }, { x: right + 1, y: bottom + 1 }];
  }).filter(point => {
    const bounded = clampMosaicPosition(point, district);
    return bounded.x === point.x && bounded.y === point.y && !isMosaicPositionBlocked(point, obstacles);
  });
  const nodes = [from, target, ...corners];
  const costs = nodes.map(() => Infinity);
  const previous = nodes.map(() => -1);
  const visited = new Set();
  costs[0] = 0;
  while (visited.size < nodes.length) {
    let nearest = -1;
    for (let index = 0; index < nodes.length; index++) {
      if (!visited.has(index) && (nearest === -1 || costs[index] < costs[nearest])) nearest = index;
    }
    if (nearest === -1 || !Number.isFinite(costs[nearest])) break;
    if (nearest === 1) {
      const path = [];
      for (let index = 1; index !== 0; index = previous[index]) path.unshift(nodes[index]);
      return path;
    }
    visited.add(nearest);
    for (let index = 0; index < nodes.length; index++) {
      if (visited.has(index) || !isMosaicSegmentClear(nodes[nearest], nodes[index], obstacles)) continue;
      const cost = costs[nearest] + Math.hypot(nodes[index].x - nodes[nearest].x, nodes[index].y - nodes[nearest].y);
      if (cost < costs[index]) { costs[index] = cost; previous[index] = nearest; }
    }
  }
  return [];
};

export const clampMosaicPosition = (point, district) => ({
  x: clamp(point.x, 34, Math.max(34, district.worldW - 34)),
  y: clamp(point.y, 58, Math.max(58, district.worldH - 50))
});

export const getMosaicInteractionTargets = ({ portals = [], npcs = [], zones = [] } = {}) => [
  ...portals.map(target => ({ type: 'portal', id: target.id, target, x: target.x, y: target.y })),
  ...npcs.map(target => ({ type: 'npc', id: target.hero.id, target, x: target.x, y: target.y })),
  ...zones.filter(target => target.action && target.action !== 'talk')
    .map(target => ({ type: 'zone', id: target.id, target, ...getMosaicZoneAnchor(target) }))
];

export const resolveMosaicInteraction = (player, scene, preferred = null) => {
  const targets = getMosaicInteractionTargets(scene);
  return targets
    .filter(entry => !preferred || (entry.type === preferred.type && entry.id === preferred.id))
    .map(entry => ({ ...entry, distance: Math.hypot(entry.x - player.x, entry.y - player.y) }))
    .filter(entry => entry.distance <= MOSAIC_INTERACTION_RANGE[entry.type])
    .sort((a, b) => a.distance - b.distance)[0] || null;
};

// Update in elapsed time, not display frames. Axis sliding avoids walking
// through NPC bodies; every substep remains bounded even on a delayed frame.
export const advanceMosaicPlayer = (state, district, elapsedMs = 1000 / 60) => {
  const seconds = clamp(Number(elapsedMs) || 0, 0, 50) / 1000;
  const keys = state.keys || {};
  let dx = Number(Boolean(keys.arrowright || keys.d)) - Number(Boolean(keys.arrowleft || keys.a || keys.q));
  let dy = Number(Boolean(keys.arrowdown || keys.s)) - Number(Boolean(keys.arrowup || keys.w || keys.z));
  if (dx || dy) {
    state.destination = null;
    state.destinationRoute = null;
    state.pendingInteraction = null;
  }
  let remaining = Infinity;
  if (state.destination && !dx && !dy) {
    const requested = clampMosaicPosition(state.destination, district);
    if (!state.destinationRoute || state.destinationRoute.x !== requested.x || state.destinationRoute.y !== requested.y) {
      state.destinationRoute = { ...requested, points: planMosaicPath(state.player, requested, district, state.obstacles || []) };
    }
    while (state.destinationRoute.points.length && Math.hypot(state.destinationRoute.points[0].x - state.player.x, state.destinationRoute.points[0].y - state.player.y) <= 0.5) state.destinationRoute.points.shift();
    const destination = state.destinationRoute.points[0];
    if (!destination) {
      state.destination = null;
      state.destinationRoute = null;
      state.pendingInteraction = null;
      state.player.state = 'idle';
      return 0;
    }
    dx = destination.x - state.player.x;
    dy = destination.y - state.player.y;
    remaining = Math.hypot(dx, dy);
    if (remaining <= 0.5) state.destination = null;
  }
  const distance = Math.min(remaining, Math.max(0, state.player.speed || 2.35) * 60 * seconds);
  const length = Math.hypot(dx, dy);
  const from = { x: state.player.x, y: state.player.y };
  if (length > 0 && distance > 0) {
    dx = dx / length * distance;
    dy = dy / length * distance;
    const steps = Math.max(1, Math.ceil(distance / 10));
    const canMove = point => !(state.obstacles || []).some(obstacle => {
      const after = obstaclePenetration(point, obstacle);
      return after > 0 && after >= obstaclePenetration(state.player, obstacle);
    }) && !(state.npcs || []).some(npc => {
      const before = Math.hypot(npc.x - state.player.x, npc.y - state.player.y);
      const after = Math.hypot(npc.x - point.x, npc.y - point.y);
      return after < 28 && after < before;
    });
    for (let index = 0; index < steps; index++) {
      const horizontal = clampMosaicPosition({ x: state.player.x + dx / steps, y: state.player.y }, district);
      if (canMove(horizontal)) state.player.x = horizontal.x;
      const vertical = clampMosaicPosition({ x: state.player.x, y: state.player.y + dy / steps }, district);
      if (canMove(vertical)) state.player.y = vertical.y;
    }
  }
  const moved = Math.hypot(state.player.x - from.x, state.player.y - from.y);
  if (Math.abs(state.player.x - from.x) > 0.01) state.player.facing = Math.sign(state.player.x - from.x);
  state.player.state = moved > 0.01 ? 'run' : 'idle';
  if (state.destination && Math.hypot(state.destinationRoute.points[0].x - state.player.x, state.destinationRoute.points[0].y - state.player.y) <= 0.5) {
    state.destinationRoute.points.shift();
    if (!state.destinationRoute.points.length) state.destination = null;
  }
  if (state.destination && distance > 0 && moved < 0.01) state.destination = null;
  if (!state.destination) state.destinationRoute = null;
  return moved;
};

export const createMosaicGuide = (saved = {}) => {
  const source = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  const distance = Number.isFinite(source.distance) ? Math.max(0, Math.min(70, source.distance)) : 0;
  const moved = source.moved === true || distance >= 70;
  const interacted = moved && source.interacted === true;
  const objectiveOpened = interacted && source.objectiveOpened === true;
  return {
    version: 1, distance: moved ? 70 : distance, moved, interacted, objectiveOpened,
    status: objectiveOpened ? 'completed' : ['paused', 'skipped'].includes(source.status) ? source.status : 'active',
    welcomeSeen: source.welcomeSeen === true
  };
};
export const advanceMosaicGuide = (guide, event, amount = 0) => {
  if (guide.status && guide.status !== 'active') return guide;
  if (event === 'move' && !guide.moved) {
    const distance = Math.min(70, guide.distance + Math.max(0, Number.isFinite(amount) ? amount : 0));
    if (distance === guide.distance) return guide;
    return { ...guide, distance, moved: distance >= 70 };
  }
  if (event === 'interact' && guide.moved && !guide.interacted) return { ...guide, interacted: true };
  if (event === 'objective' && guide.moved) return { ...guide, interacted: true, objectiveOpened: true, status: 'completed' };
  return guide;
};
export const transitionMosaicGuide = (guide, command) => {
  if (command === 'restart') return createMosaicGuide({ welcomeSeen: guide.welcomeSeen });
  if (command === 'welcome-read') return { ...guide, welcomeSeen: true };
  if (command === 'pause' && guide.status === 'active') return { ...guide, status: 'paused' };
  if (command === 'skip' && guide.status !== 'completed') return { ...guide, status: 'skipped' };
  if (command === 'resume') return { ...guide, status: guide.objectiveOpened ? 'completed' : 'active' };
  return guide;
};
export const getMosaicGuideStep = guide => !guide.moved ? 'move' : !guide.interacted ? 'interact' : !guide.objectiveOpened ? 'objective' : 'done';
