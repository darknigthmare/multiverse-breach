// Prey — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Grizzly Bear',
      weapon: 'claws_and_bite',
      special: 'Riverbank Charge',
      phases: ['Charges, swipes and bites with realistic animal movement', 'Uses the documented riverbank mauling pattern before retreating from the Feral Predator'],
      lore: {
        fr: 'L ours est une rencontre animale distincte de la progression du Feral Predator.',
        en: 'The bear is an animal encounter distinct from the Feral Predator progression.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/prey',
      visualAnchor: 'Realistic exact film-scale brown grizzly, wet muddy fur and source-visible wounds only; no armor or mutation.'
    }
  ]);
}
