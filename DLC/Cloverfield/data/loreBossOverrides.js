// Cloverfield — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Clover Parasite Brood Alpha',
      weapon: 'claws_and_bite',
      special: 'Parasite Drop',
      phases: ['Scuttles low and attacks with rapid claw swipes', 'Leaps onto the target and attempts the film parasite bite'],
      lore: {
        fr: 'Un parasite tombe du grand Clover et dirige une petite couvee.',
        en: 'A parasite dropped by the adult Clover leads a small brood.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/cloverfield',
      visualAnchor: 'Exact pale spider-crab parasite anatomy from Cloverfield, multiple limbs, folded dorsal sacs and the film mouth structure.'
    },
    {
      name: 'Juvenile Clover',
      weapon: 'long_limbs_and_jaws',
      special: 'Juvenile City Stomp',
      phases: ['Uses long-limbed sweeps and head strikes at reduced scale', 'Performs a desperate full-body charge when staggered'],
      lore: {
        fr: 'La creature est representee comme un juvenile distinct du world boss adulte.',
        en: 'The creature is represented as a juvenile distinct from the adult world boss.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/cloverfield',
      visualAnchor: 'Recognizable juvenile Clover anatomy with gray hide, asymmetrical long limbs, small head and ventral parasite sacs; entire body visible.'
    }
  ]);
}
