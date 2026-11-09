// Assassin's Creed — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'assassins_creed',
    universe: 'Assassin\'s Creed',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Assassin s Creed',
    stage: 'Abstergo Animus Memory Corridor',
    boss: 'Templar Grand Master Sequence',
    cast: [
      ['ezio_auditore_ac', 'Ezio Auditore', 'slayer'],
      ['desmond_miles_ac', 'Desmond Miles', 'hacker'],
      ['kassandra_ac', 'Kassandra', 'tactical']
    ],
    enemies: ['Templar Guard', 'Abstergo Security', 'Animus Corruption'],
    bosses: ['Cesare Borgia', 'Rodrigo Borgia'],
    gear: [
      ['hidden_blade', 'Hidden Blade', 'Lame secrete'],
      ['apple_eden', 'Apple of Eden', 'Pomme d Eden'],
      ['animus_key', 'Animus Memory Key', 'Cle memoire de l Animus']
    ],
    event: ['leap_faith', 'Leap of Faith Assassination', 'Assassinat par saut de la foi', 'An Eagle Vision scan exposes the command target before a synchronized aerial strike.', 'Un scan de Vision d Aigle revele la cible de commandement avant une frappe aerienne synchronisee.'],
    origin: ['Assassins and Templars fight across history over freedom, control, Pieces of Eden, and memories reconstructed by the Animus.', 'Assassins et Templiers s affrontent a travers l histoire pour la liberte, le controle, les Fragments d Eden et les souvenirs reconstruits par l Animus.'],
    breach: ['Abstergo records entire universes as genetic memories, while Desmond detects the Authorless hiding in synchronization gaps.', 'Abstergo enregistre des univers entiers comme memoires genetiques, tandis que Desmond detecte le Sans-Auteur dans les ruptures de synchronisation.'],
    motif: 'castle',
    colors: ['#182328', '#030506', '#d14c43']
  }));
}
