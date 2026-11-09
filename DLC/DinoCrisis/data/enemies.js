// Dino Crisis — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Ibis Island Velociraptor', hp: 85, atk: 11, spd: 7, color: '#3d5c3d', weapon: 'pack_bite' },
      { name: 'Pteranodon Facility Diver', hp: 65, atk: 9, spd: 8, color: '#7d6608', weapon: 'dive' },
      { name: 'Oviraptor Poison Spitter', hp: 75, atk: 9, spd: 6, color: '#884ea0', weapon: 'poison_spit' },
      { name: 'Compsognathus Swarm', hp: 55, atk: 7, spd: 8, color: '#6f8f45', weapon: 'swarm_bite' },
      { name: 'Third Energy Raptor Alpha', hp: 120, atk: 14, spd: 7, color: '#1f5f43', weapon: 'temporal_claw' }
    ],
    bosses: [
      { name: 'Tyrannosaurus Pursuer', hp: 640, atk: 24, spd: 4, color: '#3a1a18', weapon: 'jaw_crush', special: 'Facility Wall Breach' },
      { name: 'Giganotosaurus Edward City', hp: 680, atk: 25, spd: 4, color: '#273746', weapon: 'bite', special: 'Earth-Shaking Trample' },
      { name: 'Therizinosaurus Slasher', hp: 500, atk: 19, spd: 5, color: '#7f5a58', weapon: 'claws', special: 'Frenzy Claw Shred' }
    ],
    worldBoss: { name: 'Third Energy Tyrant Rex', hp: 1450, atk: 34, spd: 4, color: '#3a1a18', weapon: 'temporal_bite', special: 'Chronal Roar and Crushing Bite' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Allosaurus Corridor Hunter', hp: 130, atk: 16, spd: 5, color: '#5c3d2e', weapon: 'bite' },
      { name: 'Mosasaurus Pool Shadow', hp: 145, atk: 15, spd: 4, color: '#1f4d5a', weapon: 'water_drag' },
      { name: 'Third Energy Compsognathus Pack', hp: 70, atk: 9, spd: 8, color: '#6f8f45', weapon: 'swarm' }
    ],
    bosses: [
      { name: 'Dr. Kirk Security Override', hp: 480, atk: 17, spd: 5, color: '#7f8c8d', weapon: 'lab_lockdown', special: 'Third Energy Lockout' },
      { name: 'Plesiosaur Facility Breach', hp: 600, atk: 22, spd: 4, color: '#24546a', weapon: 'water_maw', special: 'Flooded Lab Ambush' }
    ]
  });
}
