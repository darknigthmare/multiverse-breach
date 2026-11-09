// Alien — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Xenomorph Drone', hp: 80, atk: 12, spd: 6, color: '#1a1d24', weapon: 'tail' },
      { name: 'Skittering Facehugger', hp: 40, atk: 14, spd: 8, color: '#d2b48c', weapon: 'grab' },
      { name: 'Runner Alien', hp: 75, atk: 10, spd: 7, color: '#2c3539', weapon: 'claws' }
    ],
    bosses: [
      {
        name: 'Alien Queen', hp: 600, atk: 22, spd: 5, color: '#090b0e', weapon: 'claws', special: 'Inner Jaw Lunge',
        canonicalName: 'Alien Queen',
        incarnation: 'Aliens (1986)',
        equipment: ['Inner jaw', 'Clawed main arms', 'Long bladed tail'],
        referenceUrl: 'https://en.wikipedia.org/wiki/Aliens_(film)',
        visualAnchor: 'Black biomechanical Queen with broad crown-shaped head crest, two long main arms and two small chest arms, digitigrade legs and a long tail. No Predalien mandibles or acid-spitting attack absent from the 1986 film.',
        visualReviewStatus: 'pending'
      },
      { name: 'Xenomorph Praetorian', hp: 500, atk: 19, spd: 4, color: '#111317', weapon: 'tail', special: 'Tail Impale Sweep' }
    ],
    worldBoss: { name: 'Predalien Monstrosity', hp: 1250, atk: 29, spd: 5, color: '#302f26', weapon: 'claws', special: 'Mouth Inner-Jaw Strike' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Chestburster Echo', hp: 45, atk: 13, spd: 8, color: '#d0b08a', weapon: 'inner_jaw' },
      { name: 'Warrior Xenomorph', hp: 105, atk: 14, spd: 6, color: '#0b0d12', weapon: 'acid_claws' },
      { name: 'Egg Chamber Sac', hp: 95, atk: 8, spd: 2, color: '#3e342b', weapon: 'facehugger_spawn' },
      { name: 'Synthetic Ash Protocol', hp: 115, atk: 12, spd: 5, color: '#e8e8df', weapon: 'corporate_override' }
    ],
    bosses: [
      { name: 'Big Chap Stalker', hp: 560, atk: 22, spd: 7, color: '#05070a', weapon: 'tail', special: 'Vent Shaft Ambush' },
      { name: 'Weyland-Yutani Retrieval Team', hp: 510, atk: 19, spd: 5, color: '#2f3f46', weapon: 'containment_rifles', special: 'Specimen Recovery Order' }
    ]
  });
}
