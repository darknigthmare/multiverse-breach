// Alien 3 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Runner / Dragon Xenomorph',
      weapon: 'quadruped_charge_and_inner_jaw',
      special: 'Leadworks Thermal Shock',
      phases: ['Uses ceiling movement, quadruped charges and bites', 'Transitions through the documented molten-lead and sprinkler thermal-shock sequence'],
      lore: {
        fr: 'La poursuite de la fonderie devient une phase du Runner, pas un boss abstrait.',
        en: 'The leadworks chase becomes a Runner phase rather than an abstract boss.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien3',
      visualAnchor: 'Exact Alien 3 Runner, brown-black biomechanical hide, smooth dome, doglike quadruped posture, long tail and no dorsal tubes.'
    }
  ]);
}
