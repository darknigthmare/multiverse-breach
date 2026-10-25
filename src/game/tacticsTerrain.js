// Logical Tactics surfaces. Heights, movement and sight share this geometry;
// a material or drawing order never creates a traversable connection.
const EPSILON = 1e-7;
const DIRECTIONS = [
  { dx: 1, dy: 0, edge: 'east', opposite: 'west' },
  { dx: -1, dy: 0, edge: 'west', opposite: 'east' },
  { dx: 0, dy: 1, edge: 'south', opposite: 'north' },
  { dx: 0, dy: -1, edge: 'north', opposite: 'south' }
];
const number = (value, fallback) => Number.isFinite(value) ? value : fallback;
const cellKey = (x, y) => `${x},${y}`;
const coordinates = ref => ({ x: ref?.gridX ?? ref?.x, y: ref?.gridY ?? ref?.y });
const positive = (value, fallback) => Math.max(0.01, number(value, fallback));
const tileCost = type => ['high', 'heavyCover', 'hazard', 'portalSpawn'].includes(type) ? 2 : 1;

export function terrainSurfaceKey(ref) {
  return typeof ref === 'string' ? ref : ref?.surfaceId ?? ref?.id ?? null;
}

export function terrainSurfaceRef(surface) {
  return surface ? { x: surface.x, y: surface.y, z: surface.z, surfaceId: surface.id } : null;
}

export function getSurfacesAt(terrain, x, y) {
  return terrain?.byCell.get(cellKey(x, y)) || [];
}

// XY by itself is deliberately ambiguous under a bridge. A supplied id is
// authoritative; callers may opt into an exact altitude, never a hidden top tile.
export function getTerrainSurface(terrain, ref) {
  if (!terrain || ref == null) return null;
  if (typeof ref === 'string') return terrain.byId.get(ref) || null;
  if (ref.surfaceId !== undefined) return terrain.byId.get(ref.surfaceId) || null;
  if (ref.id && terrain.byId.has(ref.id)) return terrain.byId.get(ref.id);
  const { x, y } = coordinates(ref);
  const candidates = getSurfacesAt(terrain, x, y);
  if (Number.isFinite(ref.z ?? ref.gridZ)) {
    const z = ref.z ?? ref.gridZ;
    return candidates.find(surface => Math.abs(surface.z - z) < EPSILON) || null;
  }
  return candidates.length === 1 ? candidates[0] : null;
}

function normalizeSurface(source, legacy = false) {
  const x = source.x ?? source.gridX, y = source.y ?? source.gridY;
  if (!Number.isInteger(x) || !Number.isInteger(y)) throw new Error('Tactics surface coordinates must be integers');
  const nominalZ = number(source.z, 0);
  const cornerZ = source.cornerZ === undefined ? [nominalZ, nominalZ, nominalZ, nominalZ] : [...source.cornerZ];
  if (cornerZ.length !== 4 || !cornerZ.every(Number.isFinite)) throw new Error(`Invalid Tactics corner heights at ${x},${y}`);
  const z = cornerZ.reduce((sum, height) => sum + height, 0) / 4;
  const minZ = Math.min(...cornerZ), maxZ = Math.max(...cornerZ);
  const type = source.type || source.terrainClass || 'normal';
  const thickness = positive(source.thickness ?? source.solid?.thickness, source.shape === 'slab' ? 0.28 : 1);
  const solidBottom = number(source.solidBottom ?? source.bottomZ ?? source.solid?.bottomZ, minZ - thickness);
  if (solidBottom > minZ + EPSILON) throw new Error(`Tactics solid starts above its surface at ${x},${y}`);
  return {
    ...source, id: source.id || `${legacy ? 'legacy' : 'surface'}:${x}:${y}`,
    x, y, z, cornerZ, minZ, maxZ, type,
    materialId: source.materialId || (legacy ? 'legacy-ground' : 'nexus-floor'),
    layerId: source.layerId || (legacy ? 'legacy' : 'ground'),
    shape: source.shape || 'flat', solidBottom, bottomZ: solidBottom,
    thickness: maxZ - solidBottom,
    walkable: source.walkable !== false && source.traversal?.walkable !== false && type !== 'blocked',
    opaque: source.opaque !== false,
    moveCost: positive(source.moveCost ?? source.traversal?.moveCost, tileCost(type)),
    coverEdges: source.coverEdges || {}, legacyTerrainType: legacy ? type : undefined
  };
}

export function normalizeTacticsTerrain(battlefield = {}) {
  const rows = Math.max(1, Math.floor(number(battlefield.rows, 5)));
  const cols = Math.max(1, Math.floor(number(battlefield.cols ?? battlefield.columns, 8)));
  const vertical = Array.isArray(battlefield.surfaces);
  const legacyTiles = battlefield.tiles || [];
  const inputs = vertical ? battlefield.surfaces : Array.from({ length: rows * cols }, (_, index) => {
    const x = index % cols, y = Math.floor(index / cols);
    return { ...(legacyTiles.find(tile => tile.x === x && tile.y === y) || {}), x, y, z: 0 };
  });
  const surfaces = inputs.map(source => normalizeSurface(source, !vertical));
  const byId = new Map(), byCell = new Map(), links = new Map();
  for (const surface of surfaces) {
    if (surface.x < 0 || surface.y < 0 || surface.x >= cols || surface.y >= rows) throw new Error(`Tactics surface outside board: ${surface.id}`);
    if (byId.has(surface.id)) throw new Error(`Duplicate Tactics surface id: ${surface.id}`);
    byId.set(surface.id, surface);
    const key = cellKey(surface.x, surface.y);
    if (!byCell.has(key)) byCell.set(key, []);
    byCell.get(key).push(surface);
    links.set(surface.id, []);
  }
  for (const entries of byCell.values()) entries.sort((a, b) => a.z - b.z || a.id.localeCompare(b.id));
  const terrain = { vertical, rows, cols, surfaces, byId, byCell, links, maxStep: number(battlefield.maxStepHeight, 0.5), battlefieldId: battlefield.id || null };
  const addLink = (from, to, source, explicit) => {
    const kind = source.kind || 'walk';
    const xyDistance = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    if (explicit && ['walk', 'ramp', 'stairs'].includes(kind) && xyDistance !== 1) {
      throw new Error(`Tactics ${kind} link must join adjacent cells: ${from.id} -> ${to.id}`);
    }
    links.get(from.id).push({ ...source, from: from.id, to: to.id, kind, explicit, cost: source.cost === undefined ? null : positive(source.cost, 1) });
  };
  for (const source of battlefield.links || []) {
    const from = getTerrainSurface(terrain, source.from), to = getTerrainSurface(terrain, source.to);
    if (!from || !to) throw new Error(`Tactics link references a missing surface: ${source.from} -> ${source.to}`);
    addLink(from, to, source, true);
    if (!source.oneWay && source.bidirectional !== false) addLink(to, from, source, true);
  }
  for (const surface of surfaces) {
    for (const direction of DIRECTIONS) {
      for (const neighbor of getSurfacesAt(terrain, surface.x + direction.dx, surface.y + direction.dy)) {
        if (links.get(surface.id).some(link => link.to === neighbor.id)) continue;
        addLink(surface, neighbor, { kind: 'walk', edge: direction.edge, oppositeEdge: direction.opposite }, false);
      }
    }
  }
  return terrain;
}

export function getTerrainEdgeHeight(surface, edge) {
  const [nw, ne, se, sw] = surface.cornerZ;
  return ({ north: (nw + ne) / 2, east: (ne + se) / 2, south: (sw + se) / 2, west: (nw + sw) / 2 })[edge] ?? surface.z;
}

export function getTerrainHeightAt(surface, worldX = surface.x + 0.5, worldY = surface.y + 0.5) {
  const u = Math.max(0, Math.min(1, worldX - surface.x));
  const v = Math.max(0, Math.min(1, worldY - surface.y));
  if (surface.shape === 'stairs' && surface.direction) {
    const progression = ({ east: u, west: 1 - u, south: v, north: 1 - v })[surface.direction];
    const steps = Math.max(1, Math.round(number(surface.stepCount, 4)));
    return surface.minZ + Math.ceil(progression * steps - EPSILON) / steps * (surface.maxZ - surface.minZ);
  }
  const [nw, ne, se, sw] = surface.cornerZ;
  return nw * (1 - u) * (1 - v) + ne * u * (1 - v) + se * u * v + sw * (1 - u) * v;
}

function bodyHeight(unit = {}) {
  return positive(unit.tacticsHeight ?? unit.tacticsTraversal?.height ?? unit.tacticsFootprint?.bodyHeight, 1.6);
}

function footprintSurfaces(terrain, surface, unit) {
  const width = Math.max(1, Math.round(number(unit?.tacticsFootprint?.width, 1)));
  const height = Math.max(1, Math.round(number(unit?.tacticsFootprint?.height, 1)));
  if (width > terrain.cols || height > terrain.rows) return null;
  const startX = Math.max(0, Math.min(terrain.cols - width, surface.x - Math.floor((width - 1) / 2)));
  const startY = Math.max(0, Math.min(terrain.rows - height, surface.y - Math.floor((height - 1) / 2)));
  const supports = [];
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      const support = getSurfacesAt(terrain, x, y).find(candidate => Math.abs(candidate.z - surface.z) <= 0.5 + EPSILON && candidate.walkable);
      if (!support) return null;
      supports.push(support);
    }
  }
  return supports;
}

export function getTerrainUnitFootprint(terrain, ref, unit = {}) {
  const surface = getTerrainSurface(terrain, ref);
  return surface ? footprintSurfaces(terrain, surface, unit) : null;
}

export function canOccupyTerrainSurface(terrain, ref, options = {}) {
  const surface = getTerrainSurface(terrain, ref);
  if (!surface?.walkable) return false;
  const supports = footprintSurfaces(terrain, surface, options.unit);
  if (!supports) return false;
  const height = bodyHeight(options.unit);
  for (const support of supports) {
    if (options.isOccupied?.(support, options.unit)) return false;
    if (options.isBlocked?.(support, options.unit)) return false;
    const above = getSurfacesAt(terrain, support.x, support.y).filter(candidate => candidate.id !== support.id && candidate.maxZ > support.maxZ + EPSILON);
    if (above.some(candidate => candidate.solidBottom < support.maxZ + height - EPSILON)) return false;
  }
  return true;
}

function traversalAllowed(link, unit = {}) {
  const profile = unit.tacticsTraversal || {};
  if (link.disabled) return false;
  if (link.requires && !profile[link.requires]) return false;
  if (link.kind === 'jump' && profile.canJump !== true) return false;
  if (link.kind === 'drop' && profile.canDrop !== true) return false;
  if (['ladder', 'climb'].includes(link.kind) && profile.canClimb !== true) return false;
  return true;
}

export function getTerrainNeighbors(terrain, ref, options = {}) {
  const surface = getTerrainSurface(terrain, ref);
  if (!surface) return [];
  const maxStep = Math.max(0, number(options.unit?.tacticsTraversal?.maxStepHeight ?? options.maxStep, terrain.maxStep));
  const neighbors = [];
  for (const link of terrain.links.get(surface.id) || []) {
    const target = terrain.byId.get(link.to);
    if (!target || !traversalAllowed(link, options.unit)) continue;
    if (!link.explicit) {
      const edgeAllowed = (candidate, edge) => {
        if (candidate.traversal?.allowedEdges) return candidate.traversal.allowedEdges.includes(edge);
        if (!['stairs', 'ramp'].includes(candidate.shape)) return true;
        if (['east', 'west'].includes(candidate.direction)) return ['east', 'west'].includes(edge);
        if (['north', 'south'].includes(candidate.direction)) return ['north', 'south'].includes(edge);
        return true;
      };
      if (!edgeAllowed(surface, link.edge) || !edgeAllowed(target, link.oppositeEdge)) continue;
      const sourceHeight = getTerrainEdgeHeight(surface, link.edge);
      const targetHeight = getTerrainEdgeHeight(target, link.oppositeEdge);
      if (Math.abs(sourceHeight - targetHeight) > maxStep + EPSILON) continue;
    }
    if (options.allowLink?.(link, surface, target, options.unit) === false) continue;
    if (!canOccupyTerrainSurface(terrain, target, options)) continue;
    const cost = link.cost ?? positive(options.getMoveCost?.(target, options.unit), target.moveCost);
    neighbors.push({ surface: target, ...terrainSurfaceRef(target), cost, kind: link.kind, from: surface.id, to: target.id });
  }
  return neighbors;
}

export function reachableTerrainSurfaces(terrain, from, budget, options = {}) {
  const start = getTerrainSurface(terrain, from);
  if (!start || budget < 0 || Number.isNaN(budget)) return [];
  const initial = { ...terrainSurfaceRef(start), cost: 0, path: [start.id], transitions: [] };
  const best = new Map([[start.id, initial]]), queue = [initial];
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost || a.surfaceId.localeCompare(b.surfaceId));
    const current = queue.shift();
    if (current !== best.get(current.surfaceId)) continue;
    for (const neighbor of getTerrainNeighbors(terrain, current.surfaceId, options)) {
      const cost = current.cost + neighbor.cost;
      if (cost > budget + EPSILON || cost >= (best.get(neighbor.surfaceId)?.cost ?? Infinity) - EPSILON) continue;
      const next = {
        x: neighbor.x, y: neighbor.y, z: neighbor.z, surfaceId: neighbor.surfaceId, cost,
        path: [...current.path, neighbor.surfaceId],
        transitions: [...current.transitions, { from: current.surfaceId, to: neighbor.surfaceId, kind: neighbor.kind, cost: neighbor.cost }]
      };
      best.set(next.surfaceId, next); queue.push(next);
    }
  }
  return [...best.values()].sort((a, b) => a.cost - b.cost || a.surfaceId.localeCompare(b.surfaceId));
}

export function findTerrainPath(terrain, from, to, options = {}) {
  const destination = getTerrainSurface(terrain, to);
  if (!destination) return null;
  return reachableTerrainSurfaces(terrain, from, options.budget ?? Infinity, options)
    .find(entry => entry.surfaceId === destination.id) || null;
}

function clipAxis(origin, delta, low, high, interval) {
  if (Math.abs(delta) < EPSILON) return origin >= low - EPSILON && origin <= high + EPSILON;
  let a = (low - origin) / delta, b = (high - origin) / delta;
  if (a > b) [a, b] = [b, a];
  interval[0] = Math.max(interval[0], a); interval[1] = Math.min(interval[1], b);
  return interval[0] <= interval[1] + EPSILON;
}

function rayHitsSurface(start, delta, surface) {
  if (surface.shape === 'stairs' && surface.direction) {
    const steps = Math.max(1, Math.round(number(surface.stepCount, 4)));
    for (let step = 0; step < steps; step++) {
      const eastWest = ['east', 'west'].includes(surface.direction);
      const reverse = ['west', 'north'].includes(surface.direction);
      const offset = (reverse ? steps - step - 1 : step) / steps;
      const top = surface.minZ + (step + 1) / steps * (surface.maxZ - surface.minZ);
      if (rayHitsBox(start, delta, {
        x: surface.x + (eastWest ? offset : 0), y: surface.y + (eastWest ? 0 : offset),
        width: eastWest ? 1 / steps : 1, depth: eastWest ? 1 : 1 / steps,
        z: surface.solidBottom, height: top - surface.solidBottom
      })) return true;
    }
    return false;
  }
  const interval = [EPSILON, 1 - EPSILON];
  if (!clipAxis(start.x, delta.x, surface.x, surface.x + 1, interval)) return false;
  if (!clipAxis(start.y, delta.y, surface.y, surface.y + 1, interval)) return false;
  if (!clipAxis(start.z, delta.z, surface.solidBottom, Infinity, interval)) return false;
  const u = start.x - surface.x, v = start.y - surface.y;
  const [nw, ne, se, sw] = surface.cornerZ;
  const bx = ne - nw, by = sw - nw, mixed = nw - ne + se - sw;
  // Bilinear roof minus the ray is quadratic in the segment parameter.
  const a = mixed * delta.x * delta.y;
  const b = bx * delta.x + by * delta.y + mixed * (u * delta.y + v * delta.x) - delta.z;
  const c = nw + bx * u + by * v + mixed * u * v - start.z;
  const at = t => a * t * t + b * t + c;
  let maximum = Math.max(at(interval[0]), at(interval[1]));
  if (a < -EPSILON) {
    const vertex = -b / (2 * a);
    if (vertex > interval[0] && vertex < interval[1]) maximum = Math.max(maximum, at(vertex));
  }
  return maximum >= -EPSILON;
}

function rayHitsBox(start, delta, box) {
  const interval = [EPSILON, 1 - EPSILON];
  return clipAxis(start.x, delta.x, box.x, box.x + box.width, interval)
    && clipAxis(start.y, delta.y, box.y, box.y + box.depth, interval)
    && clipAxis(start.z, delta.z, box.z, box.z + box.height, interval);
}

export function terrainLineOfSight(terrain, from, to, options = {}) {
  const origin = getTerrainSurface(terrain, from), target = getTerrainSurface(terrain, to);
  if (!origin || !target) return false;
  const start = { x: origin.x + 0.5, y: origin.y + 0.5, z: origin.z + number(options.eyeHeight, 1.25) };
  const end = { x: target.x + 0.5, y: target.y + 0.5, z: target.z + number(options.targetHeight, 0.9) };
  const delta = { x: end.x - start.x, y: end.y - start.y, z: end.z - start.z };
  if (!options.pierceTerrain && terrain.surfaces.some(surface => surface.opaque && rayHitsSurface(start, delta, surface))) return false;
  if (!options.pierceObstacles) {
    for (const obstacle of options.obstacles || []) {
      if (obstacle.hp <= 0 || obstacle.currentHp <= 0 || obstacle.opaque === false) continue;
      const support = getTerrainSurface(terrain, obstacle);
      if (!support || support.id === target.id || support.id === origin.id) continue;
      const height = positive(obstacle.tacticsHeight ?? obstacle.height, 1.45);
      if (rayHitsBox(start, delta, { x: support.x + 0.05, y: support.y + 0.05, z: support.z, width: 0.9, depth: 0.9, height })) return false;
    }
  }
  if (options.blocksOnUnits && !options.pierceUnits) {
    for (const unit of options.units || []) {
      if (unit === from || unit === to || unit === from?._tacticsSourceUnit || unit.currentHp <= 0) continue;
      const support = getTerrainSurface(terrain, unit);
      if (!support || support.id === target.id || support.id === origin.id) continue;
      const width = Math.max(0.5, number(unit.tacticsFootprint?.width, 1) - 0.2);
      const depth = Math.max(0.5, number(unit.tacticsFootprint?.height, 1) - 0.2);
      if (rayHitsBox(start, delta, { x: support.x + 0.5 - width / 2, y: support.y + 0.5 - depth / 2, z: support.z, width, depth, height: bodyHeight(unit) })) return false;
    }
  }
  return true;
}

export function terrainAttackDistance(terrain, from, to, options = {}) {
  const a = getTerrainSurface(terrain, from), b = getTerrainSurface(terrain, to);
  if (!a || !b || Math.abs(a.z - b.z) > (options.maxVertical ?? Infinity) + EPSILON) return Infinity;
  const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y), dz = Math.abs(a.z - b.z);
  if (options.spatial || options.metric === 'spatial') return Math.hypot(dx, dy, dz);
  if (options.metric === 'chebyshev') return Math.max(dx, dy);
  return dx + dy;
}

export function terrainHeightAdvantage(terrain, from, to) {
  const a = getTerrainSurface(terrain, from), b = getTerrainSurface(terrain, to);
  const delta = a && b ? a.z - b.z : 0;
  return { delta, multiplier: delta >= 0.75 ? 1.15 : 1, labels: delta >= 0.75 ? ['HIGH'] : [] };
}

export function terrainCoverReduction(terrain, from, to) {
  const a = getTerrainSurface(terrain, from), b = getTerrainSurface(terrain, to);
  if (!a || !b) return 0;
  const dx = a.x - b.x, dy = a.y - b.y;
  const edge = Math.abs(dx) >= Math.abs(dy) ? dx >= 0 ? 'east' : 'west' : dy >= 0 ? 'south' : 'north';
  const cover = b.coverEdges[edge];
  const edgeCover = typeof cover === 'number' ? cover : cover ? number(cover.reduction, number(cover.height, 0) >= 1 ? 0.35 : 0.2) : 0;
  const tileCover = b.type === 'heavyCover' ? 0.35 : b.type === 'lightCover' ? 0.2 : 0;
  return Math.min(0.65, Math.max(0, edgeCover, tileCover));
}
