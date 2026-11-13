// The Dark Knight — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ REF, guard, lock, melee, ranged }) {
  return (lock({
    incarnation: 'The Dark Knight (2008) - Nolan s Bruce Wayne, segmented Batsuit',
    referenceUrls: [REF.darkKnight, REF.batman],
    equipment: ['Segmented Batsuit', 'Batarangs', 'Grapnel Gun', 'Utility Belt'],
    visualAnchor: 'Batman in The Dark Knight (2008): Christian Bale s Bruce Wayne in the black segmented armored Batsuit, narrow pointed ears, exposed mouth and jaw, black cape and gold utility belt. Batarangs and grapnel equipment; no ordinary pistol, Grim Knight rifle, Justice Buster, blue-gray animated suit or The Batman 2022 costume.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#2b2c30',
    primaryColor: '#24252a', secondaryColor: '#af914e',
    simple: melee('Batsuit Martial Strike'),
    secondary: ranged('Batarang Throw', 'projectile', '#72767d'),
    defense: guard('Armored Forearm Guard'),
    special: melee('Gotham Close-Quarters Takedown'),
    loreLocalized: {
      fr: 'Ce Batman est Bruce Wayne dans The Dark Knight de Nolan, sorti en 2008. Il agit avec Gordon et Harvey Dent face au Joker. Sa formation, son Batsuit segmente et ses gadgets expliquent son kit : combat martial, batarangs et protection. Le grapnel est un outil de deplacement, pas un pistolet a balles ; les chiffres de combat ne reproduisent pas le montage exact du film.',
      en: 'This Batman is Bruce Wayne in Nolan s The Dark Knight, released in 2008. He works with Gordon and Harvey Dent against the Joker. Training, his segmented Batsuit and gadgets explain the kit: martial combat, Batarangs and protection. The grapnel is a movement tool, not a bullet-firing pistol; combat numbers do not reproduce the film s exact choreography.'
    }
  }));
}
