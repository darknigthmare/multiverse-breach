// Alien Resurrection — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Alien Queen Clone',
      weapon: 'claws_tail_and_egg_sac',
      special: 'Captured Queen Breakout',
      phases: ['Fights restrained with claws and tail while attached to the reproductive structure', 'Breaks containment for a short mobile final phase'],
      lore: {
        fr: 'La reine clone est l individu captif de l Auriga avant la naissance du Newborn.',
        en: 'The cloned queen is the captive Auriga specimen before the Newborn is born.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-resurrection',
      visualAnchor: 'Exact Alien Resurrection Queen clone, ridged crown, brown-black biomechanical body and altered reproductive anatomy from the film.'
    },
    {
      name: 'Dr. Mason Wren',
      weapon: 'sidearm_and_security_control',
      special: 'Auriga Containment Order',
      phases: ['Uses a sidearm and activates containment defenses', 'Attempts an armed escape after the systems fail'],
      lore: {
        fr: 'Wren dirige les experiences illegales de l Auriga.',
        en: 'Wren directs the Auriga s illegal experiments.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-resurrection',
      visualAnchor: 'Exact J. E. Freeman likeness, United Systems Military science uniform and film sidearm; no android or alien mutation.'
    }
  ]);
}
