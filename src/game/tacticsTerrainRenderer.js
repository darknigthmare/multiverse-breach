// Shared terrain geometry for the playable Tactics board. Materials are drawn
// in world coordinates: they are original procedural game textures, not crops
// from the perspective-painted universe backgrounds or official source art.
const EPSILON = 1e-6;
const EDGES = ['north', 'east', 'south', 'west'];
const NEIGHBORS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const EDGE_CORNERS = [[0, 1], [1, 2], [2, 3], [3, 0]];
const OPPOSITE_CORNERS = [[3, 2], [0, 3], [1, 0], [2, 1]];

export const TACTICS_TERRAIN_MATERIALS = Object.freeze({
  'nexus-floor': { family: 'panel', top: '#284650', mid: '#203740', side: '#162c36', underside: '#101f2b', detail: '#6aa5ad', accent: '#69e0d1', edge: '#78b4ba' },
  'nexus-metal': { family: 'panel', top: '#42626a', mid: '#355057', side: '#243d47', underside: '#162b34', detail: '#85b5bc', accent: '#6ff0db', edge: '#9bc9cc' },
  'ancient-stone': { family: 'stone', top: '#8d8068', mid: '#7c715f', side: '#675d4f', underside: '#453e37', detail: '#b4a58a', accent: '#cbbd9c', edge: '#c6b79a' },
  'weathered-stone': { family: 'stone', top: '#777d70', mid: '#677265', side: '#515d52', underside: '#353f39', detail: '#a0aa91', accent: '#b4bf9f', edge: '#a7b19c' },
  grass: { family: 'grass', top: '#527252', mid: '#466748', side: '#635341', underside: '#3c352c', detail: '#7e9b63', accent: '#adba77', edge: '#819262' },
  earth: { family: 'earth', top: '#846448', mid: '#73543d', side: '#604630', underside: '#3f3025', detail: '#a17c55', accent: '#b69563', edge: '#af8c65' },
  'cyber-floor': { family: 'panel', top: '#30404f', mid: '#253642', side: '#1d2a36', underside: '#111c27', detail: '#638297', accent: '#6fdbd4', edge: '#7e9fae' },
  'cyber-grate': { family: 'grate', top: '#344b55', mid: '#233b45', side: '#23343e', underside: '#111f2a', detail: '#77939c', accent: '#71e5dc', edge: '#8ba8af' },
  'cyber-metal': { family: 'panel', top: '#4c5866', mid: '#3b4957', side: '#2c3848', underside: '#182533', detail: '#82909e', accent: '#7bdded', edge: '#9daeb9' },
  wood: { family: 'wood', top: '#8c6a43', mid: '#795937', side: '#644a32', underside: '#403124', detail: '#b28c59', accent: '#c6a06e', edge: '#c09b69' },
  water: { family: 'water', top: '#245c70', mid: '#1e4c60', side: '#173d51', underside: '#122b3d', detail: '#6ca2b4', accent: '#99c6d3', edge: '#75a7b4' },
  'nibel-rock': { family: 'rock', top: '#6b7177', mid: '#5b646b', side: '#46515a', underside: '#262f36', detail: '#a1abb1', accent: '#b6c0c4', edge: '#89979e' },
  'mako-metal': { family: 'panel', top: '#4f6462', mid: '#405653', side: '#303f40', underside: '#1c2b2b', detail: '#899c8b', accent: '#8dd5a2', edge: '#9ab2a8' },
  'steppe-grass': { family: 'grass', sideFamily: 'strata', top: '#729954', mid: '#668c49', side: '#80694c', underside: '#41392d', detail: '#a2ba6c', accent: '#ced58c', edge: '#94ae68' },
  'meadow-grass': { family: 'grass', sideFamily: 'strata', top: '#607e45', mid: '#55713d', side: '#756247', underside: '#3b3328', detail: '#91a563', accent: '#c5c989', edge: '#8c9d64' },
  'pine-earth': { family: 'earth', sideFamily: 'strata', top: '#5f5943', mid: '#514c39', side: '#4c4534', underside: '#2c2a23', detail: '#8c8060', accent: '#a99a6d', edge: '#7f805a' },
  'swamp-mud': { family: 'mud', sideFamily: 'strata', top: '#514f37', mid: '#444831', side: '#383e2d', underside: '#20281f', detail: '#7c8055', accent: '#a2a773', edge: '#777e52' },
  'shallow-water': { family: 'water', top: '#397870', mid: '#306c67', side: '#245752', underside: '#193b3a', detail: '#9dc4a4', accent: '#d0ddbb', edge: '#8cb7a0' },
  snow: { family: 'snow', sideFamily: 'snow', top: '#dce5e6', mid: '#cbd9dc', side: '#9baeb8', underside: '#5d7382', detail: '#f2f5eb', accent: '#ffffff', edge: '#eaf1ed' },
  'alpine-rock': { family: 'rock', top: '#858d93', mid: '#717e88', side: '#566675', underside: '#334654', detail: '#b9c1c4', accent: '#e0e7e6', edge: '#aebdc4' },
  'darkroot-moss': { family: 'grass', sideFamily: 'strata', top: '#425345', mid: '#35463b', side: '#42473d', underside: '#242e29', detail: '#6c8062', accent: '#a0ad83', edge: '#72876b' },
  'darkroot-stone': { family: 'rock', top: '#677166', mid: '#566358', side: '#404d46', underside: '#25342f', detail: '#929b85', accent: '#afbaa0', edge: '#879883' },
  basalt: { family: 'rock', top: '#514b49', mid: '#423f40', side: '#302f33', underside: '#1b2229', detail: '#81716a', accent: '#a18b79', edge: '#76675f' },
  lava: { family: 'lava', top: '#b94f25', mid: '#993a21', side: '#5b3026', underside: '#29282a', detail: '#f79d40', accent: '#ffd375', edge: '#dd7738' },
  'prothean-concrete': { family: 'stone', top: '#8e8171', mid: '#796e62', side: '#5a534e', underside: '#343534', detail: '#bbb09b', accent: '#d2c2a9', edge: '#aea18c' },
  'halo-grass': { family: 'grass', sideFamily: 'strata', top: '#688a57', mid: '#597b4c', side: '#70634f', underside: '#3e3a30', detail: '#99b278', accent: '#c2ca96', edge: '#8fa471' },
  'forerunner-alloy': { family: 'panel', top: '#8b9994', mid: '#748681', side: '#536763', underside: '#304641', detail: '#bbc6b9', accent: '#a7d0cc', edge: '#bccbc3' }
});

const lerp = (a, b, amount) => a + (b - a) * amount;
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const surfacesOf = terrain => terrain?.surfaces || [];
const cornersOf = surface => surface.cornerZ?.length === 4
  ? surface.cornerZ.map(value => finite(value, finite(surface.z)))
  : [0, 1, 2, 3].map(() => finite(surface.z));
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const bottomOf = surface => finite(surface.solidBottom, finite(surface.bottomZ,
  Math.min(...cornersOf(surface)) - finite(surface.thickness, 0.24)));
const materialOf = surface => TACTICS_TERRAIN_MATERIALS[surface.materialId]
  || TACTICS_TERRAIN_MATERIALS['nexus-floor'];
const surfaceId = surface => surface.id || surface.surfaceId || `${surface.x}:${surface.y}:${finite(surface.z)}`;

export function traceTerrainPolygon(ctx, polygon) {
  if (!polygon?.length) return;
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  for (let index = 1; index < polygon.length; index += 1) ctx.lineTo(polygon[index].x, polygon[index].y);
  ctx.closePath();
}

export function terrainPolygonContains(polygon, x, y) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i], b = polygon[j];
    const cross = (x - a.x) * (b.y - a.y) - (y - a.y) * (b.x - a.x);
    if (Math.abs(cross) < EPSILON && x >= Math.min(a.x, b.x) - EPSILON
      && x <= Math.max(a.x, b.x) + EPSILON && y >= Math.min(a.y, b.y) - EPSILON
      && y <= Math.max(a.y, b.y) + EPSILON) return true;
    if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

const polygonArea = polygon => polygon.reduce((area, point, index) => {
  const next = polygon[(index + 1) % polygon.length];
  return area + point.x * next.y - next.x * point.y;
}, 0) / 2;

export function getTerrainPolygonBounds(polygon) {
  const xs = polygon.map(point => point.x), ys = polygon.map(point => point.y);
  return { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) };
}

const isSurfaceVisible = (surface, options) => surface.visible !== false
  && (options.cutLevel == null || Math.min(...cornersOf(surface)) <= options.cutLevel + EPSILON)
  && (!options.visibleLayerIds || options.visibleLayerIds.has?.(surface.layerId)
    || options.visibleLayerIds.includes?.(surface.layerId));

function worldVertices(surface) {
  const z = cornersOf(surface);
  return [
    { x: surface.x, y: surface.y, z: z[0] },
    { x: surface.x + 1, y: surface.y, z: z[1] },
    { x: surface.x + 1, y: surface.y + 1, z: z[2] },
    { x: surface.x, y: surface.y + 1, z: z[3] }
  ];
}

export function getSurfacePolygon(surface, project, inset = 0) {
  const polygon = worldVertices(surface).map(point => project(point.x, point.y, point.z));
  if (!(inset > 0)) return polygon;
  const center = { x: mean(polygon.map(point => point.x)), y: mean(polygon.map(point => point.y)) };
  const bounds = getTerrainPolygonBounds(polygon);
  const ratio = Math.min(0.4, inset / Math.max(1, Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top)));
  return polygon.map(point => ({ x: lerp(point.x, center.x, ratio), y: lerp(point.y, center.y, ratio) }));
}

// Match shared edges by actual altitude, rather than joining the bridge to the
// different material on the ground at the same XY.
export function getSurfaceMaterialNeighbors(terrain, surface) {
  const result = {};
  const z = cornersOf(surface);
  for (let edge = 0; edge < 4; edge += 1) {
    const [dx, dy] = NEIGHBORS[edge], [a, b] = EDGE_CORNERS[edge], [na, nb] = OPPOSITE_CORNERS[edge];
    result[EDGES[edge]] = surfacesOf(terrain).find(candidate => {
      if (candidate === surface || candidate.x !== surface.x + dx || candidate.y !== surface.y + dy) return false;
      const neighborZ = cornersOf(candidate);
      return Math.abs(z[a] - neighborZ[na]) < EPSILON && Math.abs(z[b] - neighborZ[nb]) < EPSILON;
    }) || null;
  }
  return result;
}

function makeFace(surface, kind, vertices, project, extras = {}) {
  const polygon = vertices.map(point => project(point.x, point.y, point.z));
  return {
    id: `${surfaceId(surface)}:${kind}:${extras.edge || ''}:${extras.segment ?? ''}`,
    surfaceId: surfaceId(surface), surface, kind, edge: extras.edge || null,
    materialId: surface.materialId || 'nexus-floor', vertices, polygon, project,
    bounds: getTerrainPolygonBounds(polygon), zMin: Math.min(...vertices.map(point => point.z)),
    zMax: Math.max(...vertices.map(point => point.z)),
    depth: surface.y + 0.5 + mean(vertices.map(point => point.z)) * 0.0001,
    ...extras
  };
}

function stairInfo(surface) {
  const z = cornersOf(surface), low = Math.min(...z), high = Math.max(...z);
  const direction = surface.direction || (z[1] + z[2] > z[0] + z[3] ? 'east'
    : z[0] + z[3] > z[1] + z[2] ? 'west' : z[2] + z[3] > z[0] + z[1] ? 'south' : 'north');
  const steps = Math.max(2, Math.min(12, Math.round(surface.stepCount || 4)));
  return { low, high, direction, steps };
}

function surfaceTopFaces(surface, project) {
  const vertices = worldVertices(surface);
  if (surface.shape !== 'stairs') return [makeFace(surface, 'top', vertices, project)];
  const { low, high, direction, steps } = stairInfo(surface);
  if (high - low < EPSILON) return [makeFace(surface, 'top', vertices, project)];
  const faces = [];
  for (let step = 0; step < steps; step += 1) {
    const start = step / steps, end = (step + 1) / steps;
    const top = low + (high - low) * end, previousTop = low + (high - low) * start;
    let x0 = surface.x, x1 = surface.x + 1, y0 = surface.y, y1 = surface.y + 1;
    if (direction === 'east') { x0 += start; x1 = surface.x + end; }
    else if (direction === 'west') { x0 += 1 - end; x1 = surface.x + 1 - start; }
    else if (direction === 'south') { y0 += start; y1 = surface.y + end; }
    else { y0 += 1 - end; y1 = surface.y + 1 - start; }
    faces.push(makeFace(surface, 'top', [{ x: x0, y: y0, z: top }, { x: x1, y: y0, z: top }, { x: x1, y: y1, z: top }, { x: x0, y: y1, z: top }], project, { segment: step, stair: true }));
    const riser = direction === 'east' ? [{ x: x0, y: y1, z: top }, { x: x0, y: y0, z: top }]
      : direction === 'west' ? [{ x: x1, y: y0, z: top }, { x: x1, y: y1, z: top }]
        : direction === 'south' ? [{ x: x0, y: y0, z: top }, { x: x1, y: y0, z: top }]
          : [{ x: x1, y: y1, z: top }, { x: x0, y: y1, z: top }];
    const lower = [{ ...riser[1], z: previousTop }, { ...riser[0], z: previousTop }];
    const face = makeFace(surface, 'riser', [...riser, ...lower], project, { segment: step, edge: direction, stair: true });
    if (step > 0 && polygonArea(face.polygon) < -EPSILON) faces.push(face);
  }
  return faces;
}

function clipEdgePolygon(polygon, distance) {
  if (!polygon.length) return [];
  const result = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index], b = polygon[(index + 1) % polygon.length];
    const da = distance(a), db = distance(b), insideA = da >= -EPSILON, insideB = db >= -EPSILON;
    if (insideA) result.push(a);
    if (insideA !== insideB) {
      const amount = da / (da - db);
      result.push({ u: lerp(a.u, b.u, amount), z: lerp(a.z, b.z, amount) });
    }
  }
  const area = Math.abs(result.reduce((sum, point, index) => {
    const next = result[(index + 1) % result.length];
    return sum + point.u * next.z - next.u * point.z;
  }, 0)) / 2;
  return area > EPSILON ? result : [];
}

function edgeTopSegments(surface, edge) {
  const z = cornersOf(surface), [a, b] = EDGE_CORNERS[edge];
  if (surface.shape !== 'stairs') return [{ u0: 0, u1: 1, za: z[a], zb: z[b] }];
  const { low, high, steps, direction } = stairInfo(surface), vertices = worldVertices(surface);
  const progress = point => direction === 'east' ? point.x - surface.x
    : direction === 'west' ? 1 - point.x + surface.x
      : direction === 'south' ? point.y - surface.y : 1 - point.y + surface.y;
  const p0 = progress(vertices[a]), p1 = progress(vertices[b]);
  const at = value => low + (high - low) * Math.max(1, Math.ceil(value * steps - EPSILON)) / steps;
  if (Math.abs(p0 - p1) < EPSILON) return [{ u0: 0, u1: 1, za: at(p0), zb: at(p0) }];
  return Array.from({ length: steps }, (_, step) => {
    const u0 = step / steps, u1 = (step + 1) / steps, height = at(lerp(p0, p1, (u0 + u1) / 2));
    return { u0, u1, za: height, zb: height };
  });
}

function visibleEdgePolygons(terrain, surface, edge, options) {
  const [dx, dy] = NEIGHBORS[edge];
  const bottom = bottomOf(surface);
  let pieces = edgeTopSegments(surface, edge).map(segment => [
    { u: segment.u0, z: segment.za }, { u: segment.u1, z: segment.zb },
    { u: segment.u1, z: bottom }, { u: segment.u0, z: bottom }
  ]);
  const neighbors = surfacesOf(terrain).filter(candidate => candidate !== surface
    && candidate.x === surface.x + dx && candidate.y === surface.y + dy && isSurfaceVisible(candidate, options));
  for (const neighbor of neighbors) {
    const neighborBottom = bottomOf(neighbor);
    // Opposite edge runs in reverse world direction.
    const neighborSegments = edgeTopSegments(neighbor, (edge + 2) % 4).map(segment => ({
      u0: 1 - segment.u1, u1: 1 - segment.u0, za: segment.zb, zb: segment.za
    }));
    // Subtract the occupied strip of each adjacent solid. This also clips
    // crossing ramp edges and retains the wall beneath a thin adjacent slab.
    for (const segment of neighborSegments) {
      const topAt = u => lerp(segment.za, segment.zb, (u - segment.u0) / (segment.u1 - segment.u0));
      pieces = pieces.flatMap(piece => {
        const central = clipEdgePolygon(clipEdgePolygon(piece, point => point.u - segment.u0), point => segment.u1 - point.u);
        return [
          clipEdgePolygon(piece, point => segment.u0 - point.u),
          clipEdgePolygon(piece, point => point.u - segment.u1),
          clipEdgePolygon(central, point => neighborBottom - point.z),
          clipEdgePolygon(central, point => point.z - topAt(point.u))
        ].filter(candidate => candidate.length >= 3);
      });
    }
  }
  return pieces;
}

export function getTerrainDrawList(terrain, options = {}) {
  const project = options.project || ((x, y, z) => ({ x, y: y - z }));
  const faces = [];
  for (const surface of surfacesOf(terrain)) {
    if (!isSurfaceVisible(surface, options)) continue;
    const topVertices = worldVertices(surface), bottom = bottomOf(surface);
    const neighbors = getSurfaceMaterialNeighbors(terrain, surface);
    const underVertices = topVertices.map(point => ({ ...point, z: bottom }));
    if (Math.max(...cornersOf(surface)) > bottom + EPSILON) faces.push(makeFace(surface, 'underside', underVertices, project));
    faces.push(...surfaceTopFaces(surface, project).map(face => ({ ...face, neighbors })));
    for (let edge = 0; edge < 4; edge += 1) {
      const [a, b] = EDGE_CORNERS[edge];
      const textureVertices = [topVertices[a], topVertices[b], { ...topVertices[b], z: bottom }, { ...topVertices[a], z: bottom }];
      const texturePolygon = textureVertices.map(point => project(point.x, point.y, point.z));
      for (const [segment, piece] of visibleEdgePolygons(terrain, surface, edge, options).entries()) {
        const vertices = piece.map(point => ({ x: lerp(topVertices[a].x, topVertices[b].x, point.u), y: lerp(topVertices[a].y, topVertices[b].y, point.u), z: point.z }));
        const face = makeFace(surface, 'side', vertices, project, { edge: EDGES[edge], segment, textureVertices, texturePolygon });
        if (options.includeBackfaces || polygonArea(face.polygon) < -EPSILON) faces.push(face);
      }
      const cover = surface.coverEdges?.[EDGES[edge]];
      const coverHeight = typeof cover === 'number' ? cover : cover?.height;
      if (coverHeight > 0) {
        const aTop = { ...topVertices[a], z: topVertices[a].z + coverHeight };
        const bTop = { ...topVertices[b], z: topVertices[b].z + coverHeight };
        faces.push(makeFace(surface, 'railing', [aTop, bTop, topVertices[b], topVertices[a]], project, {
          edge: EDGES[edge], depth: (topVertices[a].y + topVertices[b].y) / 2,
          cameraFacing: polygonArea([aTop, bTop, topVertices[b], topVertices[a]].map(point => project(point.x, point.y, point.z))) < -EPSILON
        }));
      }
    }
  }
  const phase = face => face.kind === 'underside' ? 0 : face.kind === 'top' ? 1 : face.kind === 'railing' ? 3 : 2;
  return faces.sort((a, b) => a.surface.y - b.surface.y || finite(a.surface.z) - finite(b.surface.z)
    || a.surface.x - b.surface.x || phase(a) - phase(b) || (a.segment || 0) - (b.segment || 0));
}

const interpolateFace = (face, u, v) => {
  const [a, b, c, d] = face.texturePolygon || face.polygon;
  return { x: lerp(lerp(a.x, b.x, u), lerp(d.x, c.x, u), v), y: lerp(lerp(a.y, b.y, u), lerp(d.y, c.y, u), v) };
};
const faceLine = (ctx, face, u0, v0, u1, v1) => {
  const a = interpolateFace(face, u0, v0), b = interpolateFace(face, u1, v1);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
};
const faceRect = (ctx, face, u, v, width, height) => {
  traceTerrainPolygon(ctx, [interpolateFace(face, u, v), interpolateFace(face, u + width, v), interpolateFace(face, u + width, v + height), interpolateFace(face, u, v + height)]);
  ctx.fill();
};
const withAlpha = (hex, alpha) => {
  const value = hex.replace('#', '');
  return `rgba(${parseInt(value.slice(0, 2), 16)},${parseInt(value.slice(2, 4), 16)},${parseInt(value.slice(4, 6), 16)},${alpha})`;
};

function drawTopTexture(ctx, face, material, options) {
  const surface = face.surface;
  ctx.strokeStyle = withAlpha(material.detail, 0.55);
  ctx.fillStyle = withAlpha(material.detail, 0.24);
  const family = material.family;
  if (family === 'panel') {
    for (const [a, b, c, d] of [[0.08, 0.08, 0.92, 0.08], [0.92, 0.08, 0.92, 0.92], [0.92, 0.92, 0.08, 0.92], [0.08, 0.92, 0.08, 0.08]]) faceLine(ctx, face, a, b, c, d);
    ctx.strokeStyle = withAlpha(material.accent, 0.8);
    faceLine(ctx, face, 0.17, 0.8, 0.42, 0.8);
    if ((surface.x + surface.y) % 3 === 0) faceLine(ctx, face, 0.8, 0.18, 0.8, 0.42);
    for (const [u, v] of [[0.16, 0.16], [0.82, 0.16], [0.16, 0.82], [0.82, 0.82]]) faceRect(ctx, face, u, v, 0.035, 0.035);
  } else if (family === 'grate') {
    ctx.fillStyle = material.underside;
    for (let v = 0.14; v < 0.9; v += 0.18) for (let u = 0.12; u < 0.9; u += 0.15) faceRect(ctx, face, u, v, 0.07, 0.1);
    ctx.strokeStyle = withAlpha(material.detail, 0.75);
    faceLine(ctx, face, 0.04, 0.05, 0.96, 0.05); faceLine(ctx, face, 0.04, 0.95, 0.96, 0.95);
  } else if (family === 'stone') {
    // Quarter-cell joints continue in world units; alternating rows provide
    // ashlar masonry rather than stretching one stone over a whole cliff.
    for (const v of [0.03, 0.49, 0.98]) faceLine(ctx, face, 0, v, 1, v);
    const offset = (surface.x + surface.y) % 2 ? 0.32 : 0.68;
    faceLine(ctx, face, offset, 0.03, offset, 0.49);
    faceLine(ctx, face, 1 - offset, 0.49, 1 - offset, 0.98);
    ctx.strokeStyle = withAlpha(material.underside, 0.38);
    faceLine(ctx, face, 0.13, 0.24, 0.22, 0.28); faceLine(ctx, face, 0.75, 0.72, 0.83, 0.66);
  } else if (family === 'wood') {
    for (let v = 0.12; v < 1; v += 0.2) faceLine(ctx, face, 0, v, 1, v);
    for (const [u, v] of [[0.3, 0.05], [0.74, 0.45], [0.21, 0.85]]) faceLine(ctx, face, u, v, u, v + 0.16);
  } else if (family === 'rock') {
    const shift = ((surface.x * 13 + surface.y * 7) % 9) / 100;
    ctx.fillStyle = withAlpha(material.detail, 0.18);
    traceTerrainPolygon(ctx, [interpolateFace(face, 0.07, 0.16), interpolateFace(face, 0.62 + shift, 0.06), interpolateFace(face, 0.91, 0.38), interpolateFace(face, 0.41, 0.57)]); ctx.fill();
    ctx.strokeStyle = withAlpha(material.underside, 0.54);
    faceLine(ctx, face, 0.08, 0.73, 0.38 + shift, 0.44); faceLine(ctx, face, 0.38 + shift, 0.44, 0.73, 0.53);
    faceLine(ctx, face, 0.38 + shift, 0.44, 0.51, 0.13); faceLine(ctx, face, 0.73, 0.53, 0.9, 0.86);
    ctx.strokeStyle = withAlpha(material.accent, 0.31);
    faceLine(ctx, face, 0.13, 0.24, 0.44, 0.16); faceLine(ctx, face, 0.65, 0.76, 0.86, 0.62);
  } else if (family === 'snow') {
    ctx.fillStyle = withAlpha(material.detail, 0.45);
    for (let index = 0; index < 12; index += 1) {
      const u = 0.07 + ((surface.x * 19 + index * 17) % 86) / 100, v = 0.07 + ((surface.y * 23 + index * 29) % 86) / 100;
      faceRect(ctx, face, u, v, 0.05, 0.018);
    }
    ctx.strokeStyle = withAlpha(material.side, 0.4);
    faceLine(ctx, face, 0.08, 0.78, 0.46, 0.64); faceLine(ctx, face, 0.46, 0.64, 0.91, 0.7);
    ctx.strokeStyle = withAlpha(material.accent, 0.75); faceLine(ctx, face, 0.13, 0.28, 0.64, 0.16);
  } else if (family === 'lava') {
    const shift = Math.sin((options.animTime || 0) * 0.025 + surface.x + surface.y * 2) * 0.04;
    ctx.strokeStyle = material.accent; ctx.lineWidth *= 1.5;
    faceLine(ctx, face, 0.07, 0.2 + shift, 0.42, 0.37); faceLine(ctx, face, 0.42, 0.37, 0.91, 0.2 - shift);
    faceLine(ctx, face, 0.2, 0.91, 0.41, 0.53); faceLine(ctx, face, 0.41, 0.53, 0.77, 0.68 + shift);
    ctx.fillStyle = material.side;
    for (const [u, v] of [[0.17, 0.14], [0.61, 0.38], [0.74, 0.83]]) faceRect(ctx, face, u, v, 0.13, 0.09);
  } else if (family === 'grass' || family === 'earth' || family === 'mud') {
    const seed = surface.x * 17 + surface.y * 31;
    for (let index = 0; index < 14; index += 1) {
      const u = 0.08 + ((seed + index * 29) % 83) / 100, v = 0.08 + ((seed * 3 + index * 17) % 83) / 100;
      if (family === 'grass') { faceLine(ctx, face, u, v, u + 0.025, v - 0.055); faceLine(ctx, face, u + 0.025, v - 0.055, u + 0.05, v - 0.015); }
      else faceRect(ctx, face, u, v, family === 'mud' ? 0.08 : 0.045, 0.025);
    }
    if (family === 'mud') {
      ctx.strokeStyle = withAlpha(material.accent, 0.38);
      faceLine(ctx, face, 0.12, 0.45, 0.31, 0.49); faceLine(ctx, face, 0.61, 0.75, 0.84, 0.71);
    }
  } else if (family === 'water') {
    const shift = Math.sin((options.animTime || 0) * 0.04 + surface.x) * 0.025;
    for (const v of [0.22, 0.51, 0.79]) faceLine(ctx, face, 0.1 + shift, v, 0.8 + shift, v);
  }
  // Material breaks are attached to the touching edge at the same height.
  for (let edge = 0; edge < 4; edge += 1) {
    const neighbor = face.neighbors?.[EDGES[edge]];
    if (neighbor?.materialId === surface.materialId) continue;
    const [a, b] = EDGE_CORNERS[edge];
    ctx.strokeStyle = withAlpha(material.edge, neighbor ? 0.52 : 0.82);
    ctx.beginPath(); ctx.moveTo(face.polygon[a].x, face.polygon[a].y); ctx.lineTo(face.polygon[b].x, face.polygon[b].y); ctx.stroke();
  }
}

function drawSideTexture(ctx, face, material) {
  const textureVertices = face.textureVertices || face.vertices;
  const minZ = Math.min(...textureVertices.map(point => point.z)), maxZ = Math.max(...textureVertices.map(point => point.z));
  const family = material.sideFamily || material.family;
  const worldLine = (u0, z0, u1, z1) => {
    const first = textureVertices[0], second = textureVertices[1];
    const a = face.project(lerp(first.x, second.x, u0), lerp(first.y, second.y, u0), z0);
    const b = face.project(lerp(first.x, second.x, u1), lerp(first.y, second.y, u1), z1);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  };
  ctx.strokeStyle = withAlpha(material.detail, family === 'panel' || family === 'grate' ? 0.4 : 0.28);
  if (family === 'rock' || family === 'strata' || family === 'snow' || family === 'mud') {
    const seed = face.surface.x * 17 + face.surface.y * 29;
    for (let index = 0; index < 4; index += 1) {
      const u = 0.08 + ((seed + index * 23) % 82) / 100;
      const peak = maxZ - (maxZ - minZ) * (0.12 + index * 0.18);
      worldLine(u, peak, Math.min(0.98, u + 0.08), Math.max(minZ, peak - 0.45));
      if (index % 2) worldLine(u + 0.08, Math.max(minZ, peak - 0.45), Math.min(0.98, u + 0.25), Math.max(minZ, peak - 0.64));
    }
    ctx.strokeStyle = withAlpha(material.accent, family === 'snow' ? 0.65 : 0.26);
    for (let z = Math.ceil(minZ * 1.25) / 1.25; z < maxZ; z += 0.8) {
      worldLine(0, z, 0.4, Math.min(maxZ, z + 0.08)); worldLine(0.4, Math.min(maxZ, z + 0.08), 1, Math.max(minZ, z - 0.09));
    }
    if (family === 'strata' || family === 'snow') {
      ctx.strokeStyle = withAlpha(material.top, 0.82); ctx.lineWidth *= 1.7;
      faceLine(ctx, face, 0.01, 0.03, 0.99, 0.03);
    }
  } else if (family === 'stone' || family === 'grass' || family === 'earth') {
    // Horizontal courses use world Z. A three-level cliff receives six courses,
    // whereas a thin bridge receives only its real 0.28-level fascia.
    for (let z = Math.floor(minZ * 2) / 2; z <= maxZ + EPSILON; z += 0.5) {
      if (z < minZ || z > maxZ) continue;
      worldLine(0, z, 1, z);
      const u = (Math.round(z * 2) + face.surface.x + face.surface.y) % 2 ? 0.28 : 0.7;
      worldLine(u, z, u, Math.min(maxZ, z + 0.5));
    }
  } else if (family === 'wood') {
    for (let u = 0.2; u < 1; u += 0.2) faceLine(ctx, face, u, 0, u, 1);
  } else {
    for (let z = Math.ceil(minZ); z < maxZ; z += 1) {
      worldLine(0, z, 1, z);
    }
    faceLine(ctx, face, 0.09, 0.18, 0.09, 0.82); faceLine(ctx, face, 0.91, 0.18, 0.91, 0.82);
    ctx.strokeStyle = withAlpha(material.accent, 0.44);
    faceLine(ctx, face, 0.18, 0.3, 0.7, 0.3);
  }
}

export function drawTerrainFace(ctx, face, options = {}) {
  const material = { ...materialOf(face.surface), ...(options.materials?.[face.materialId] || {}) };
  if (face.kind === 'railing') {
    ctx.save();
    ctx.lineWidth = Math.max(1.2, options.lineWidth ? options.lineWidth * 2 : 1.8);
    ctx.strokeStyle = material.edge;
    faceLine(ctx, face, 0, 0.06, 1, 0.06); faceLine(ctx, face, 0, 0.48, 1, 0.48);
    for (const u of [0.04, 0.35, 0.65, 0.96]) faceLine(ctx, face, u, 0.04, u, 1);
    ctx.strokeStyle = withAlpha(material.accent, 0.6);
    ctx.lineWidth = 0.65;
    faceLine(ctx, face, 0, 0, 1, 0);
    ctx.restore();
    return;
  }
  ctx.save();
  traceTerrainPolygon(ctx, face.polygon);
  ctx.fillStyle = face.kind === 'underside' ? material.underside
    : face.kind === 'top' ? ((face.surface.x + face.surface.y) % 2 ? material.mid : material.top) : material.side;
  ctx.fill();
  ctx.clip();
  ctx.lineWidth = Math.max(0.6, options.lineWidth || 0.8);
  if (face.kind === 'top') drawTopTexture(ctx, face, material, options);
  else if (face.kind === 'underside') {
    ctx.strokeStyle = withAlpha(material.detail, 0.24);
    for (const v of [0.15, 0.85]) faceLine(ctx, face, 0, v, 1, v);
    faceLine(ctx, face, 0.5, 0, 0.5, 1);
  } else drawSideTexture(ctx, face, material);
  ctx.restore();
  ctx.save();
  traceTerrainPolygon(ctx, face.polygon);
  ctx.lineWidth = Math.max(0.6, options.lineWidth || 0.8);
  ctx.strokeStyle = face.kind === 'top' ? withAlpha(material.edge, 0.64) : 'rgba(5,12,20,0.55)';
  ctx.stroke();
  if (face.kind === 'top') {
    const highlights = options.highlightSurfaceIds;
    if (highlights?.has?.(face.surfaceId) || highlights?.includes?.(face.surfaceId)) {
      traceTerrainPolygon(ctx, face.polygon); ctx.fillStyle = 'rgba(74,211,145,0.23)'; ctx.fill();
      ctx.strokeStyle = '#7ce3ac'; ctx.lineWidth = 1.8; ctx.stroke();
    }
    if (options.drawSurfaceOverlay) {
      // The caller may draw a whole-cell path or label. Clip it to this actual
      // tread/top face so it cannot paint across the neighboring step, wall or
      // a different elevation that shares the same XY.
      ctx.save(); traceTerrainPolygon(ctx, face.polygon); ctx.clip();
      options.drawSurfaceOverlay(ctx, face.surface, face);
      ctx.restore();
    }
  }
  ctx.restore();
}

const boundsOverlap = (a, b) => a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;

// Terrain and actors share a painter graph. In particular, the ground actor is
// painted before the overhead bridge; the actor standing on that bridge is
// painted after it. Sorting only by sprite foot Y cannot make that distinction.
export function getTerrainSceneDrawList(terrain, options = {}) {
  const project = options.project || ((x, y, z) => ({ x, y: y - z }));
  const faces = getTerrainDrawList(terrain, options);
  const nodes = faces.map((face, index) => ({ ...face, type: 'face', sortIndex: index }));
  const actors = (options.actors || []).filter(actor => actor.visible !== false).map((actor, index) => {
    const surface = surfacesOf(terrain).find(candidate => surfaceId(candidate) === actor.surfaceId);
    const x = finite(actor.gridX, finite(actor.x, surface?.x || 0)), y = finite(actor.gridY, finite(actor.y, surface?.y || 0));
    const z = finite(actor.z, finite(surface?.z));
    if (options.cutLevel != null && z > options.cutLevel + EPSILON) return null;
    const foot = project(x + 0.5, y + 0.78, z), head = project(x + 0.5, y + 0.78, z + finite(actor.height, 1.7));
    const unitWidth = Math.abs(project(x + 0.9, y + 0.78, z).x - project(x + 0.1, y + 0.78, z).x);
    return { id: `actor:${actor.id || index}`, type: 'actor', actor, surfaceId: actor.surfaceId,
      x, y, z, bounds: actor.bounds || { left: foot.x - unitWidth / 2, right: foot.x + unitWidth / 2, top: Math.min(head.y, foot.y), bottom: foot.y },
      sortIndex: faces.length + index, depth: y + 0.78 };
  }).filter(Boolean);
  nodes.push(...actors);
  const edges = nodes.map(() => new Set()), incoming = nodes.map(() => 0);
  const connect = (before, after) => {
    if (before === after || edges[before].has(after)) return;
    edges[before].add(after); incoming[after] += 1;
  };
  const facesBySurface = new Map();
  faces.forEach((face, index) => {
    if (face.kind === 'railing') return;
    const previous = facesBySurface.get(face.surfaceId);
    if (previous != null) connect(previous, index);
    facesBySurface.set(face.surfaceId, index);
  });
  faces.forEach((face, index) => {
    if (face.kind !== 'railing') return;
    const support = facesBySurface.get(face.surfaceId);
    if (support != null) connect(support, index);
  });
  // Adjacent height layers at a shared XY remain in physical vertical order.
  const orderedSurfaces = surfacesOf(terrain).filter(surface => isSurfaceVisible(surface, options))
    .sort((a, b) => finite(a.z) - finite(b.z));
  for (let index = 0; index < orderedSurfaces.length; index += 1) {
    const lower = orderedSurfaces[index];
    for (const upper of orderedSurfaces.slice(index + 1)) {
      if (lower.x !== upper.x || lower.y !== upper.y) continue;
      const lastLower = facesBySurface.get(surfaceId(lower));
      const firstUpper = faces.findIndex(face => face.surfaceId === surfaceId(upper));
      if (lastLower != null && firstUpper >= 0) connect(lastLower, firstUpper);
    }
  }
  actors.forEach((actor, index) => {
    const actorIndex = faces.length + index;
    faces.forEach((face, faceIndex) => {
      if (!boundsOverlap(actor.bounds, face.bounds)) return;
      const sameCell = actor.x === face.surface.x && actor.y === face.surface.y;
      if (sameCell) {
        if (face.kind === 'railing' && face.surfaceId === actor.surfaceId) {
          if (face.cameraFacing) connect(actorIndex, faceIndex);
          else connect(faceIndex, actorIndex);
        } else if (face.zMax <= actor.z + EPSILON) connect(faceIndex, actorIndex);
        else if (face.zMin > actor.z + EPSILON || face.surfaceId !== actor.surfaceId) connect(actorIndex, faceIndex);
      } else if (actor.y + 0.78 >= face.surface.y + 1 - EPSILON) connect(faceIndex, actorIndex);
      else if (actor.y + 0.78 <= face.surface.y + EPSILON) connect(actorIndex, faceIndex);
    });
  });
  const priority = (a, b) => nodes[a].depth - nodes[b].depth || (nodes[a].z || nodes[a].zMin || 0) - (nodes[b].z || nodes[b].zMin || 0) || nodes[a].sortIndex - nodes[b].sortIndex;
  const queue = nodes.map((_, index) => index).filter(index => incoming[index] === 0).sort(priority);
  const result = [], used = new Set();
  while (queue.length) {
    const index = queue.shift();
    used.add(index); result.push(nodes[index]);
    for (const next of edges[index]) {
      incoming[next] -= 1;
      if (incoming[next] === 0) { queue.push(next); queue.sort(priority); }
    }
  }
  // A pathological intersecting map must stay drawable. Valid nonintersecting
  // battlefield geometry does not need this deterministic cycle fallback.
  if (result.length < nodes.length) result.push(...nodes.map((node, index) => ({ node, index })).filter(({ index }) => !used.has(index)).sort((a, b) => priority(a.index, b.index)).map(({ node }) => node));
  return result;
}

export function drawTacticsTerrain(ctx, terrain, options = {}) {
  const commands = options.actors?.length ? getTerrainSceneDrawList(terrain, options) : getTerrainDrawList(terrain, options);
  for (const command of commands) {
    if (command.type === 'actor') {
      if (options.drawActor) options.drawActor(ctx, command.actor);
      else command.actor.draw?.(ctx);
    } else drawTerrainFace(ctx, command, options);
  }
  return commands;
}

export function hitTestTacticsSurface(terrain, x, y, options = {}) {
  const faces = getTerrainDrawList(terrain, options);
  const matches = [], seen = new Set();
  for (const face of [...faces].reverse()) {
    if (face.kind === 'railing') continue;
    if (!terrainPolygonContains(face.polygon, x, y)) continue;
    if (face.kind !== 'top') {
      // A visible cliff is not a click through to an invisible tile behind it.
      if (!matches.length && !options.includeOccluded) return null;
      continue;
    }
    if (seen.has(face.surfaceId)) continue;
    seen.add(face.surfaceId); matches.push(face.surface);
    if (!options.includeOccluded) break;
  }
  if (!matches.length) return null;
  const index = ((Math.floor(options.cycleIndex || 0) % matches.length) + matches.length) % matches.length;
  return matches[index];
}
