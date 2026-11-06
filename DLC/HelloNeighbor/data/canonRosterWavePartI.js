// Hello Neighbor — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'hello_neighbor', universe: 'Hello Neighbor', aliases: ['Hello Neighbor franchise'], allNonCombat: true,
    continuity: 'Hello Neighbor stealth-game continuity centered on Nicky Roth and the Peterson house',
    adaptationRule: 'Children solve stealth and fear Trials and are never attacked or represented as combatants. Mr. Peterson’s pursuit remains escape gameplay; no child injury.',
    visualAnchor: 'Tilted suburban house architecture, exaggerated red-yellow-blue props, surveillance devices, long shadows and toy-like stealth routes.',
    referenceUrl: 'https://www.helloneighborgame.com/home-en', referenceUrls: ['https://www.helloneighborgame.com/home-en', 'https://www.helloneighborgame.com/hn-mediakit'], colors: ['#4c6d84', '#17202a', '#e6b24e'], motif: 'keyhole', mode: 'Trial', difficulty: 'Hard',
    heroes: [
      { id: 'nicky_roth', name: 'Nicky Roth', visualAnchor: 'Fully clothed child stealth protagonist in blue cap, red shirt and backpack; safe cartoon proportions.' },
      { id: 'aaron_peterson', name: 'Aaron Peterson', visualAnchor: 'Fully clothed child in striped shirt and shorts, shown navigating toward safety, never injured.' },
      { id: 'quentin', name: 'Quentin', visualAnchor: 'Young adult investigative journalist in green jacket, messenger bag and original cartoon face.' }
    ],
    enemies: ['Security Camera', 'Bear Trap Route', 'Adaptive AI Pursuit'], bosses: ['Fear School', 'Fear Darkness', 'Fear Supermarket'],
    worldBoss: { id: 'shadow_man', name: 'The Thing / Shadow Man', visualAnchor: 'Huge abstract black shadow beyond a child-safe escape route, represented as fear geometry rather than a target.' },
    gear: ['Basement Key', 'Magnet Gun', 'Security Camera Monitor'], stages: ['Peterson House Infiltration', 'Fear Rooms', 'Basement Escape'],
    event: { id: 'house_rebuild', name: 'Adaptive House Rebuild', frName: 'Maison adaptative' }
  });
}
