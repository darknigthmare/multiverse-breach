// Harry Potter — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'harry_potter',
    universe: 'Harry Potter',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Hogwarts Battle of the Astronomy Tower',
    boss: 'Voldemort Horcrux Convergence',
    cast: [
      ['harry_potter', 'Harry Potter', 'slayer'],
      ['hermione_granger', 'Hermione Granger', 'hacker'],
      ['ron_weasley', 'Ron Weasley', 'tactical']
    ],
    enemies: ['Death Eater', 'Dementor', 'Acromantula', 'Basilisk Spawn'],
    bosses: ['Bellatrix Lestrange', 'Lord Voldemort'],
    gear: [
      ['elder_wand', 'Elder Wand Echo', 'Echo de la Baguette de Sureau'],
      ['invisibility_cloak', 'Invisibility Cloak', 'Cape d invisibilite'],
      ['marauders_map', 'Marauder s Map', 'Carte du Maraudeur']
    ],
    event: ['patronus', 'Mass Patronus', 'Patronus collectif', 'A wave of Patronuses drives fear entities from every allied lane.', 'Une vague de Patronus chasse les entites de peur de toutes les lignes alliees.'],
    origin: ['Hogwarts stands at the center of a hidden magical society, a war against Voldemort, and a struggle over choice, sacrifice, and inherited power.', 'Poudlard se trouve au centre d une societe magique cachee, d une guerre contre Voldemort et d un conflit sur le choix, le sacrifice et le pouvoir herite.'],
    breach: ['Horcrux fragments treat portal anchors as new containers, so the trio must destroy soul echoes without damaging the memories that stabilize Mosaic City.', 'les fragments d Horcruxe traitent les ancres de portail comme de nouveaux receptacles, et le trio doit detruire les echos d ame sans blesser les souvenirs qui stabilisent la Cite-Mosaique.'],
    motif: 'castle',
    colors: ['#201a2d', '#040305', '#d2ae54']
  }));
}
