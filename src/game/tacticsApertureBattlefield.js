// A dedicated Portal 2 tactical sector. Geometry, stairs and A.R.C.A. recovery
// markers are authored for this mode; no official chamber layout is claimed.
const id = 'portal2_maintenance_shaft_tactics';
const flat = z => [z, z, z, z];
const labels = {
  'aperture-panel': { fr: 'Panneaux clairs de la chambre', en: 'Light chamber panels' },
  'aperture-frame': { fr: 'Ossature sombre de maintenance', en: 'Dark maintenance framing' },
  'aperture-grate': { fr: 'Caillebotis de service', en: 'Service grating' }
};
const surfaces = new Map();
function put(x, y, z = 0, materialId = 'aperture-panel', extra = {}) {
  const s = { id: `${id}:ground:${x}:${y}`, x, y, z, cornerZ: flat(z), materialId,
    materialLabel: labels[materialId], layerId: 'ground', shape: 'flat', type: 'normal',
    solidBottom: -2, walkable: true, ...extra };
  surfaces.set(`${x}:${y}`, s); return s;
}
for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) put(x, y);
function patch(x0, y0, x1, y1, z, material, extra = {}) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, z, material, extra);
}
function stairs(x, y, low, high) {
  put(x, y, (low + high) / 2, 'aperture-grate', {
    shape: 'stairs', direction: 'east', stepCount: 5,
    cornerZ: [low, high, high, low], moveCost: 2
  });
}
patch(5, 4, 10, 9, -1.5, 'aperture-grate');
patch(3, 2, 12, 2, 3, 'aperture-panel');
stairs(1, 2, 0, 1.5); stairs(2, 2, 1.5, 3);
stairs(13, 2, 3, 1.5); stairs(14, 2, 1.5, 0);
stairs(4, 8, 0, -1.5); stairs(11, 8, -1.5, 0);
const bridges = [];
for (let y = 3; y <= 8; y++) bridges.push({
  id: `${id}:bridge:8:${y}`, x: 8, y, z: 3, cornerZ: flat(3),
  materialId: 'aperture-grate', materialLabel: labels['aperture-grate'],
  layerId: 'bridge', shape: 'slab', type: 'normal',
  solidBottom: 2.72, thickness: .28, walkable: true, coverEdges: {}
});
Object.assign(surfaces.get('8:8'), { type: 'artifact', label: 'Repère A.R.C.A. du niveau de service' });
Object.assign(bridges.at(-1), { type: 'artifact', label: 'Repère A.R.C.A. de la passerelle' });
const ref = (x, y, layer = 'ground') => {
  const s = layer === 'bridge' ? bridges.find(v => v.x === x && v.y === y) : surfaces.get(`${x}:${y}`);
  if (!s) throw new Error(`Missing Aperture support ${x},${y}/${layer}`);
  return { x, y, z: s.z, surfaceId: s.id };
};
const scenery = (key, x, y, name, kind, height = 2) => ({
  ...ref(x, y), gridX: x, gridY: y, id: `${id}:${key}`, name,
  type: 'barrier', sceneryKind: kind, materialId: 'aperture-frame',
  tacticsHeight: height, hp: 120, maxHp: 120, color: '#4d565b'
});
const field = {
  id, formatVersion: 2, modeExclusive: 'Tactics', layoutId: `${id}:authored-sector-v1`,
  label: { fr: 'Portal 2 — chambre et puits de maintenance', en: 'Portal 2 — Chamber and Maintenance Shaft' },
  rows: 12, cols: 16, objective: 'artifact', objectiveTarget: 2,
  tileTheme: 'aperture-maintenance', links: [],
  tags: ['vertical', 'universeSector', 'modeExclusive', 'maintenanceShaft', 'stackedRecovery', 'stairs'],
  sourceUniverse: 'Portal',
  source: {
    universe: 'Portal', work: 'Portal 2 (2011)',
    period: 'Portal 2 reconstructed Aperture test-chamber and exposed maintenance architecture; no Portal (2007) chamber layout',
    location: 'Aperture Science Enrichment Center — chamber panels and exposed maintenance shaft',
    reference: 'https://www.thinkwithportals.com/about.php',
    sourceReference: 'https://store.steampowered.com/app/620/Portal_2/',
    source1to1Verified: false, canonicalLayoutVerified: false, networkVerified: true,
    adaptation: 'Original Tactics geometry, access stairs and A.R.C.A. recovery markers. Solid metal catwalks, not Hard Light Bridges or Excursion Funnels. Portals, gels and moving machinery are not simulated by this sector.'
  },
  scenario: {
    fr: 'Récupérer les deux repères A.R.C.A. au même emplacement horizontal : passerelle haute et fond du puits. Les escaliers conduisent à chaque niveau ; le tablier ne se traverse pas verticalement.',
    en: 'Recover two A.R.C.A. markers at the same horizontal position: upper catwalk and shaft floor. Stairs reach each level; the deck cannot be crossed vertically.',
    features: ['stacked-recovery-markers', 'two-gallery-stair-approaches', 'lower-service-stairs', 'solid-catwalk-underpass']
  },
  tacticsPresentation: { id, biome: 'aperture-maintenance', weather: 'clear', architecture: 'aperture-maintenance',
    skyline: 'Light segmented chamber panels, dark support frames and exposed service catwalks' },
  surfaces: [...surfaces.values(), ...bridges],
  tiles: [...surfaces.values(), ...bridges].filter(s => s.type !== 'normal').map(s => ({
    surfaceId: s.id, x: s.x, y: s.y, type: s.type, label: s.label
  })),
  heroSpawns: [ref(0, 5), ref(0, 6), ref(0, 7)],
  monsterSpawns: [ref(12, 5), ref(12, 6), ref(12, 7)],
  bossSpawns: [ref(13, 0), ref(13, 9)], worldBossSpawn: ref(14, 5),
  extractionZone: [ref(14, 8)],
  pickupSpawns: [ref(1, 8), ref(4, 2), ref(8, 6, 'bridge'), ref(6, 7), ref(12, 9)],
  obstacles: [
    scenery('north-frame', 5, 1, 'Ossature du puits', 'aperture-support', 3),
    scenery('service-frame', 6, 6, 'Support de maintenance', 'aperture-support', 2.5),
    scenery('panel-stack', 11, 4, 'Panneaux de chambre déposés', 'aperture-panels', 1.7)
  ]
};
function freeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(freeze); return Object.freeze(value);
}
export const TACTICS_APERTURE_BATTLEFIELD = freeze(field);
