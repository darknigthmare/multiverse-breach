// Alien: Covenant — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'David 8',
      weapon: 'laboratory_control_and_flute',
      special: 'Engineer Lab Release',
      phases: ['Uses laboratory doors, specimens and deceptive movement', 'Reveals the exact android identity and fights with inhuman precision'],
      lore: {
        fr: 'David est le createur des experiences du laboratoire de la cite des Ingenieurs.',
        en: 'David is the creator of the experiments in the Engineer city laboratory.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-covenant',
      visualAnchor: 'Exact Michael Fassbender likeness as David 8, long blond hair, dark Engineer-city clothing and the canonical flute.'
    },
    {
      name: 'Praetomorph',
      weapon: 'claws_tail_and_inner_jaw',
      special: 'Cargo Bay Assault',
      phases: ['Uses rapid charges, tail stabs and inner-jaw attacks', 'Becomes more aggressive during the documented cargo-bay ejection sequence'],
      lore: {
        fr: 'Le xenomorphe de Covenant est nomme Praetomorph pour ce roster.',
        en: 'The Covenant xenomorph is labeled Praetomorph for this roster.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-covenant',
      visualAnchor: 'Exact 2017 Covenant creature, long limbs, black sinewy skin, smooth dome, inner jaw and tail; no 1986 Warrior ribbing.'
    }
  ]);
}
