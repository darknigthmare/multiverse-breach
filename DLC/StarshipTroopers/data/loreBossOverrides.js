// Starship Troopers — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Tanker Bug',
      weapon: 'incendiary_acid',
      special: 'Burrowed Fire Burst',
      phases: ['Burrows and erupts with armored body slams', 'Opens the head plates and projects the canonical incendiary fluid'],
      lore: {
        fr: 'Le Tanker Bug est une caste lourde arachnide du film.',
        en: 'The Tanker Bug is a heavy Arachnid caste from the film.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/starshiptroopers',
      visualAnchor: 'Exact massive orange-brown Tanker Bug anatomy from the 1997 film, plated head, six-limbed stance and no cybernetics.'
    },
    {
      name: 'Plasma Bug',
      weapon: 'plasma_barrage',
      special: 'Orbital Plasma Launch',
      phases: ['Uses slow armored turns and close-range leg sweeps', 'Raises the abdomen and launches a documented blue plasma burst'],
      lore: {
        fr: 'Le Plasma Bug sert d artillerie antiaerienne aux Arachnides.',
        en: 'The Plasma Bug serves as the Arachnids anti-air artillery.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/starshiptroopers',
      visualAnchor: 'Exact towering blue-black Plasma Bug from the film, long legs, swollen luminous abdomen and launch posture.'
    }
  ]);
}
