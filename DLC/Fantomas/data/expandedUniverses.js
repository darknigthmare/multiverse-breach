// Fantomas — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'fantomas',
    universe: 'Fantomas',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Paris Masked Crime Chase',
    boss: 'Fantomas Identity Vault',
    cast: [
      ['commissaire_juve_fantomas', 'Commissaire Juve', 'tactical'],
      ['fandor_fantomas', 'Jerome Fandor', 'hacker'],
      ['helene_fantomas', 'Helene', 'slayer']
    ],
    enemies: ['Masked Henchman', 'False Police Double', 'Gadget Ambusher'],
    bosses: ['Fantomas Disguise Chain', 'Fantomas Escape Machine'],
    gear: [
      ['mask_scanner', 'Fantomas Mask Scanner', 'Scanner de masque Fantomas'],
      ['cigar_gadget', 'Juve Cigar Gadget', 'Gadget-cigare de Juve'],
      ['press_camera', 'Fandor Press Camera', 'Appareil de presse de Fandor']
    ],
    event: ['juve_trap', 'Juve s Impossible Trap', 'Piege impossible de Juve', 'Juve closes every exit at once; even though Fantomas escapes, all lesser doubles are exposed.', 'Juve ferme toutes les sorties a la fois ; meme si Fantomas s echappe, tous ses doubles sont exposes.'],
    origin: ['Fantomas uses perfect disguises, theatrical crimes, and impossible escapes while Juve and Fandor chase him across France.', 'Fantomas emploie deguisements parfaits, crimes theatraux et evasions impossibles tandis que Juve et Fandor le poursuivent a travers la France.'],
    breach: ['his masks copy hero signatures well enough to enter restricted portals, turning identity verification into the central A.R.C.A. investigation.', 'ses masques copient assez bien les signatures de heros pour entrer dans les portails restreints, faisant de l identite l enquete centrale d A.R.C.A.'],
    motif: 'arcanecity',
    colors: ['#182430', '#030506', '#6fa5c9']
  }));
}
