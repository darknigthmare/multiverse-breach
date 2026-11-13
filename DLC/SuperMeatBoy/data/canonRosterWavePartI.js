// Super Meat Boy — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'super_meat_boy', universe: 'Super Meat Boy', aliases: [], allNonCombat: true,
    continuity: 'Super Meat Boy (2010)',
    adaptationRule: 'Every threat is a platforming, chase or switch Trial. Cartoon hazards may reset the course but no injury, gore or combat target is depicted.',
    visualAnchor: 'Bold flat-color platform rooms, dark factory blocks, saw routes and tiny expressive cartoon silhouettes recreated as original fan art.',
    referenceUrl: 'https://www.team-meat.com/', colors: ['#9f2525', '#151112', '#f3d8b7'], motif: 'bandage', mode: 'Trial', difficulty: 'Expert',
    heroes: [
      { id: 'meat_boy', name: 'Meat Boy', visualAnchor: 'Tiny square red cartoon hero with simple eyes and smile, clean stylized surface without anatomical detail.' },
      { id: 'bandage_girl', name: 'Bandage Girl', visualAnchor: 'Tiny square pink cartoon hero with white bandage patch and simple friendly face.' },
      { id: 'brownie', name: 'Brownie', visualAnchor: 'Tiny square brown cartoon runner with clean geometric body and simple face.' }
    ],
    enemies: ['Dust Bunny Route', 'Fly Swarm Route', 'Oob Platform'], bosses: ['Lil Slugger Chase', 'C.H.A.D. Escape', 'Larries Lament Race'],
    worldBoss: { id: 'dr_fetus_finale', name: 'Dr. Fetus Finale', visualAnchor: 'Tiny suited jar-helmet villain operating a giant switchboard while the player routes toward the shutdown button.' },
    gear: ['Bandage Patch', 'Warp Zone Key', 'Commander Video Cartridge'], stages: ['The Forest', 'The Hospital', 'The End Escape'],
    event: { id: 'warp_zone', name: 'Warp Zone', frName: 'Zone de distorsion' }
  });
}
