// Hellblade: Senua’s Sacrifice — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'hellblade', universe: 'Hellblade: Senua’s Sacrifice', aliases: ['Hellblade'],
    continuity: 'Hellblade: Senua’s Sacrifice (2017)',
    adaptationRule: 'Treat psychosis respectfully as Senua’s lived perception, not as villainy. Druth and Dillion are memory/guidance Trials, never fighters. Use mythic silhouettes without actor likeness.',
    visualAnchor: 'Storm-dark Norse shores, charred wood, carved runes, blue mist, torch orange and Senua’s braided warrior silhouette with original face.',
    referenceUrl: 'https://ninjatheory.com/games/', referenceUrls: ['https://ninjatheory.com/games/', 'https://blog.playstation.com/2017/06/06/hellblade-senuas-sacrifice-from-ninja-theory-launches-august-8-on-ps4/'], colors: ['#263741', '#090b0c', '#dc743b'], motif: 'rune', faction: 'horror', mode: 'RPG', difficulty: 'Hard',
    heroes: [
      { id: 'senua', name: 'Senua', role: 'slayer', weapon: 'Forged sword', visualAnchor: 'Pict warrior with dark braided hair, blue-black face paint, fur-and-leather layers, short sword and original non-actor face.' },
      { id: 'druth', name: 'Druth', nonCombat: true, objective: 'Reveal the Northmen lore stones and guide Senua through the fire route.', visualAnchor: 'Warm ember memory silhouette in tattered traveler layers, original face, no weapon.' },
      { id: 'dillion', name: 'Dillion', nonCombat: true, objective: 'Complete the memory alignment that opens the final bridge.', visualAnchor: 'Calm blue memory silhouette in simple Pict clothing, original face, no weapon.' }
    ],
    enemies: ['Northman Raider', 'Shield Northman', 'Dark Rot Manifestation'], bosses: ['Surtr', 'Valravn', 'Garm'],
    worldBoss: { id: 'hela', name: 'Hela', visualAnchor: 'Towering half-shadowed Norse death figure with antlerlike crown, black robes and blue mist; original face.' },
    gear: ['Senua’s Sword', 'Druth Lorestone', 'Mirror Focus'], stages: ['Shipwreck Shore', 'Valravn’s Illusion Maze', 'Bridge to Helheim'],
    event: { id: 'furies_alignment', name: 'Furies Alignment', frName: 'Alignement des voix' }
  });
}
