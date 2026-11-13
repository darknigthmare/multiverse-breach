// No Man's Sky — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'no_mans_sky', universe: "No Man's Sky", aliases: ['No Mans Sky', 'NMS'],
    continuity: 'Atlas, Artemis and Sentinel storylines across the current No Man’s Sky universe.',
    adaptationRule: 'Prioritize exploration, scanning and Sentinel combat; procedural travellers stay helmeted and original, avoiding any single player-avatar claim.',
    visualAnchor: 'Vivid procedural planets, red Atlas geometry, turquoise Traveller technology and orange Sentinel optics.',
    referenceUrl: 'https://www.nomanssky.com/atlas-rises-update/',
    referenceUrls: ['https://www.nomanssky.com/atlas-rises-update/', 'https://www.nomanssky.com/sentinel-update/'],
    heroes: [hero('traveller', 'The Traveller', 'Helmeted explorer in an orange-and-white exosuit with backpack, visor and Multi-Tool.', 'Multi-Tool Bolt', 'Terrain Manipulator', { role: 'tactical' }), hero('nada', 'Priest Entity Nada', 'Korvax entity with faceted machine head, long dark robe and teal chest lights.', 'Anomaly Beacon', 'Reality Shelter', { role: 'hacker', nonCombat: true, objective: 'Calibrate the Space Anomaly reality beacon.', objectiveFr: 'Calibrer la balise de réalité de l’Anomalie spatiale.' }), hero('polo', 'Specialist Polo', 'Short stocky Gek specialist in padded yellow-brown exploration gear with wide amphibian head.', 'Discovery Scanner', 'Anomaly Coordinates', { role: 'trial', nonCombat: true, objective: 'Scan and catalogue three anomalous discoveries.', objectiveFr: 'Scanner et cataloguer trois découvertes anormales.' })],
    enemies: [threat('sentinel_drone', 'Sentinel Drone', 'Small floating orange-white enforcement drone with central red lens.', 'Rapid Laser', 'Repair Beam'), threat('corrupted_sentinel', 'Corrupted Sentinel', 'Purple crystalline drone with jagged corrupted plating and violet eye.', 'Corrupted Bolt', 'Crystal Burst'), threat('biological_horror', 'Biological Horror', 'Lean black insectoid quadruped with pale claws and no humanoid traits.', 'Claw Rush', 'Acid Spit')],
    bosses: [threat('quadruped', 'Sentinel Quadruped', 'Low four-legged armored machine with orange eye and hard angular shell.', 'Pounce Beam', 'Armor Lock'), threat('hardframe', 'Sentinel Hardframe', 'Tall orange-white bipedal combat mech with broad shoulders and jet pack.', 'Hardframe Cannon', 'Jump Slam'), threat('walker', 'Sentinel Walker', 'Towering four-legged red-and-white machine with exposed glowing brain core.', 'Walker Laser', 'Mortar Barrage')],
    worldBoss: threat('capital_ship', 'Sentinel Capital Ship', 'Huge black-and-orange Sentinel freighter with geometric hull and many laser emplacements.', 'Capital Laser', 'Interceptor Swarm'),
    gear: [gear('multi_tool', 'Traveller Multi-Tool', 'Compact red-and-gray scanning tool with short barrel.', { atk: 3, def: 0, spd: 2 }), gear('atlas_pass', 'AtlasPass', 'Small red-and-black geometric access card without readable text.', { atk: 0, def: 2, spd: 3 }), gear('walker_brain', 'Walker Brain', 'Glowing orange machine core in white armor fragments.', { atk: 2, def: 4, spd: 0 })],
    stages: [stage('Paradise Planet Survey', 'Lush alien grass, floating rocks, ringed planet and scanning waypoints.', { nonCombat: true, objective: 'Scan fauna, flora and minerals without harming wildlife.' }), stage('Sentinel Pillar', 'Tall orange-black archive pillar guarded by drones.'), stage('Atlas Interface', 'Monumental black chamber dominated by a luminous red diamond.', { nonCombat: true, objective: 'Align the Atlas glyph sequence and reach the interface.' })],
    event: event('sixteen', 'The Meaning of Sixteen', 'Red Atlas glyphs repeat through portals while reality fragments into glass-like layers.')
  });
}
