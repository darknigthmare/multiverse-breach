// Hell House LLC — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Andrew Tully',
      weapon: 'abaddon_ritual_and_hanging_rope',
      special: 'Hotel Sacrifice',
      phases: ['Uses ritual symbols and apparition displacements', 'Recreates the documented hanging imagery as a timed supernatural attack'],
      lore: {
        fr: 'Andrew Tully est le proprietaire lie au culte de l Abaddon.',
        en: 'Andrew Tully is the owner tied to the Abaddon cult.'
      },
      referenceUrl: 'https://www.terrorfilms.net/film/hell-house-llc',
      visualAnchor: 'Exact Andrew Tully likeness and period hotel clothing from the film, with the documented hanging-rope apparition.'
    },
    {
      name: 'Abaddon Clown Mannequin',
      weapon: 'stalking_and_knife',
      special: 'Camera Blind-Spot Advance',
      phases: ['Moves only between camera blind spots and changes pose', 'Produces the documented knife and advances during short light failures'],
      lore: {
        fr: 'Le mannequin clown de l Abaddon devient une rencontre visuelle, pas un piege d escalier abstrait.',
        en: 'The Abaddon clown mannequin becomes a visual encounter rather than an abstract stairwell trap.'
      },
      referenceUrl: 'https://www.terrorfilms.net/film/hell-house-llc',
      visualAnchor: 'Exact black-white-red clown mannequin from Hell House LLC, bald cap, painted grin, black costume and stiff mannequin posture.'
    }
  ]);
}
