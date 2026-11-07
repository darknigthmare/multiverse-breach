// Crypt of the NecroDancer — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'crypt_necrodancer', universe: 'Crypt of the NecroDancer', aliases: ['NecroDancer', 'Crypt of the Necrodancer'],
    continuity: 'Crypt of the NecroDancer base campaign and AMPLIFIED family storyline.',
    adaptationRule: 'Every action lands on the beat; retain readable voxel-like fantasy silhouettes and musical attacks, using only original fan-made art.',
    visualAnchor: 'A neon-lit grid crypt whose stone chambers pulse in blue, purple and gold on each musical beat.',
    referenceUrl: 'https://braceyourselfgames.com/crypt-of-the-necrodancer/',
    referenceUrls: ['https://braceyourselfgames.com/crypt-of-the-necrodancer/'],
    heroes: [
      hero('cadence', 'Cadence', 'Red-haired adventurer, blue tunic, brown boots, small dagger and glowing heart beat marker.', 'Dagger Beat', 'Golden Lute Resonance', { role: 'slayer' }),
      hero('melody', 'Melody', 'Older red-haired bard in practical purple adventuring clothes carrying the Golden Lute.', 'Lute Pulse', 'Family Refrain', { role: 'tactical' }),
      hero('aria', 'Aria', 'Elder musician in a dark purple dress and hood, holding a compact golden lute.', 'Lute Note', 'Aria Perfect Measure', { role: 'tactical' })
    ],
    enemies: [
      threat('skeleton', 'Skeleton', 'White dungeon skeleton with square skull, tiny sword and beat-ready stance.', 'Bone Sword', 'Rhythmic Step'),
      threat('zombie', 'Zombie', 'Green blocky undead in torn brown dungeon clothes, slow one-tile gait.', 'Heavy Swipe', 'Delayed Beat'),
      threat('red_dragon', 'Red Dragon', 'Large red-orange pixel dragon with broad wings and a bright fire-breath tell.', 'Fire Breath', 'Lane Sweep')
    ],
    bosses: [
      threat('king_conga', 'King Conga', 'Huge crowned gorilla conductor backed by an orderly conga line of undead.', 'Conga Slam', 'Undead Procession'),
      threat('death_metal', 'Death Metal', 'Armored skeletal reaper with microphone-scythe and blazing heavy-metal aura.', 'Microphone Scythe', 'Fireball Chorus'),
      threat('necrodancer', 'The NecroDancer', 'Pale caped dungeon master with tall collar, dark armor and luminous magic.', 'Necromantic Bolt', 'Crypt Tempo Shift')
    ],
    worldBoss: threat('golden_lute', 'Golden Lute', 'Gigantic sentient golden instrument occupying a musical boss grid.', 'Resonant String', 'Full-Grid Chord'),
    gear: [gear('golden_lute_fragment', 'Golden Lute Fragment', 'Small angular shard of radiant gold from the legendary instrument.', { atk: 4, def: 0, spd: 1 }), gear('ring_of_peace', 'Ring of Peace', 'Simple gold ring with a calm pale-blue pulse.', { atk: 0, def: 4, spd: 1 }), gear('glass_rapier', 'Glass Rapier', 'Fragile translucent rapier with a narrow cyan edge.', { atk: 5, def: 0, spd: 2 })],
    stages: [stage('Zone 1 Crypt', 'Blue-gray dungeon tiles, braziers, doors and a central beat grid.'), stage('King Conga Hall', 'Purple crypt ballroom with ordered enemy lanes and a raised royal platform.'), stage('Golden Lute Chamber', 'Black-and-gold musical sanctum where luminous strings divide the grid.')],
    event: event('all_zones', 'All Zones Medley', 'Five crypt biomes change palette and hazard pattern in synchrony with one continuous medley.')
  });
}
