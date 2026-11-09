// Prey — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Prey',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Comanche Great Plains Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Feral Predator',
    title: { en: 'Prey', fr: 'Prey' },
    desc: {
      en: 'A stripped-down first hunt across the Great Plains, where observation, traps, and courage beat alien steel.',
      fr: 'Une premiere chasse brute dans les Grandes Plaines, ou observation, pieges et courage battent l acier alien.'
    },
    hero: { id: 'naru_prey', name: 'Naru', cat: 'tactical', color: '#8c6a45' },
    allies: [
      { id: 'taabe_prey', name: 'Taabe', cat: 'slayer', color: '#6f4e37' },
      {
        id: 'feral_predator', name: 'Feral Predator', cat: 'horror', color: '#6a5c44',
        incarnation: 'Prey (2022) - masked Feral Predator, intact default appearance',
        referenceUrl: 'https://www.20thcenturystudios.com/movies/prey',
        visualAnchor: 'The masked Feral Predator from Prey (2022): elongated pale cracked bone biomask, long dark tendrils, lean mottled tan-brown alien body, layered waist covering, wrapped ankles and bare clawed feet. Twin curved wrist blades belong to the anatomical right arm and the folding circular shield to the left. Keep the mask on; no classic silver biomask, diamond body net, shoulder plasma caster, human boots or action-figure joints.',
        canonStatus: 'source-locked-gameplay-adaptation',
        visualReviewStatus: 'pending',
        equipment: ['Bone biomask', 'Right-wrist twin blades', 'Left-forearm folding shield']
      }
    ],
    monsters: ['Feral Trap Drone', 'Cloaked River Stalker', 'Shield Hunter'],
    bosses: ['Bear Hunt Echo', 'Feral Predator'],
    worldBoss: 'Feral Predator',
    gear: [
      ['prey_rope_axe', 'Rope Tomahawk', 'Tomahawk corde', { atk: 9, spd: 2 }],
      ['prey_orange_flower', 'Cooling Orange Flower', 'Fleur orange refroidissante', { def: 6, hp: 50 }],
      ['prey_bone_mask', 'Feral Bone Mask', 'Masque osseux Feral', { atk: 7, def: 5 }]
    ],
    event: ['evt_prey_mud', 'Mud Camouflage Trap', 'Piege camouflage de boue', 'The squad cloaks briefly and counterattacks from ambush.', 'L escouade se camoufle brievement et contre-attaque en embuscade.'],
    decor: { sky: ['#22391d', '#060903'], floor: 'rgba(94, 129, 64, 0.19)', grid: 'rgba(230, 175, 83, 0.24)', motif: 'forest', accent: '#e6af53' }
  });
}
