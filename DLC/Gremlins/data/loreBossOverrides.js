// Gremlins — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Mohawk - Spider Gremlin',
      weapon: 'claws_web_and_bite',
      special: 'Spider Gremlin Metamorphosis',
      phases: ['Uses Mohawk s bipedal Gremlin form and claw attacks', 'Transforms into the canonical multi-legged Spider Gremlin with web and leap attacks'],
      lore: {
        fr: 'Mohawk utilise le serum genetique pour devenir le Spider Gremlin.',
        en: 'Mohawk uses the genetic serum to become the Spider Gremlin.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/gremlins-2-new-batch',
      visualAnchor: 'Exact white mohawk, dark Gremlin face and practical Spider Gremlin body with the film s multiple legs and webbing.'
    },
    {
      name: 'Brain Gremlin',
      weapon: 'serum_and_sidearm',
      special: 'New Batch Command',
      phases: ['Uses serum flasks and commands other Gremlins', 'Draws the film sidearm when isolated'],
      lore: {
        fr: 'Le Brain Gremlin acquiert intelligence, parole et vetements apres le serum.',
        en: 'The Brain Gremlin gains intelligence, speech and clothing after taking the serum.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/gremlins-2-new-batch',
      visualAnchor: 'Exact practical-puppet anatomy, glasses, suit, tie and expressive face from Gremlins 2.'
    }
  ]);
}
