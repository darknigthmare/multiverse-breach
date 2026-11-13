// Minecraft — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'minecraft',
    universe: 'Minecraft',
    mediaType: 'game',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Overworld Stronghold End Portal',
    boss: 'Ender Dragon',
    cast: [
      ['steve_minecraft', 'Steve', 'marine'],
      ['alex_minecraft', 'Alex', 'tactical'],
      ['villager_librarian_mc', 'Librarian Villager', 'hacker']
    ],
    enemies: ['Creeper', 'Skeleton Archer', 'Enderman', 'Piglin Brute'],
    bosses: ['Wither', 'Ender Dragon'],
    gear: [
      ['diamond_pickaxe', 'Diamond Pickaxe', 'Pioche en diamant'],
      ['totem', 'Totem of Undying', 'Totem d immortalite'],
      ['ender_pearl', 'Ender Pearl', 'Perle de l End']
    ],
    event: ['creative_build', 'Emergency Build', 'Construction d urgence', 'The squad instantly raises block cover, a bridge, and a redstone trap from collected materials.', 'L escouade construit instantanement une couverture, un pont et un piege redstone avec les materiaux collectes.'],
    origin: ['A block world of survival, mining, crafting, redstone, the Nether, and the End lets players reshape nearly every local rule.', 'Un monde cubique de survie, minage, artisanat, redstone, Nether et End permet aux joueurs de remodeler presque chaque regle locale.'],
    breach: ['chunks load beyond their universe boundary and begin replacing Mosaic City rooms with editable blocks and hostile spawn rules.', 'des chunks se chargent au-dela de leur univers et remplacent des salles de la Cite-Mosaique par des blocs editables et des regles d apparition hostiles.'],
    motif: 'wasteland',
    colors: ['#20341c', '#040704', '#68b84f']
  }));
}
