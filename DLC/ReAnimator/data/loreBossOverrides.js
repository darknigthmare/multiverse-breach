// Re-Animator — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Dr. Carl Hill - Head and Body',
      weapon: 'telepathic_command_and_grapple',
      special: 'Headless Body Coordination',
      phases: ['The severed head issues telepathic commands while the body grapples', 'Head and body coordinate a faster final attack as one linked unit'],
      lore: {
        fr: 'Carl Hill controle son propre corps decapite apres reanimation.',
        en: 'Carl Hill controls his own decapitated body after reanimation.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Re-Animator',
      visualAnchor: 'Exact David Gale likeness, severed head and headless suited body from the 1985 film, represented as one linked boss.'
    },
    {
      name: 'Zombie Dean Halsey',
      weapon: 'undead_grapples',
      special: 'Reagent Frenzy',
      phases: ['Uses slow grabs and heavy body strikes', 'Reagent agitation causes a short uncontrolled frenzy'],
      lore: {
        fr: 'Le doyen Halsey est reanime par le serum de West.',
        en: 'Dean Halsey is reanimated by West s reagent.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Re-Animator',
      visualAnchor: 'Exact Robert Sampson likeness, damaged dean clothing and undead makeup from Re-Animator; no unrelated zombie mutation.'
    }
  ]);
}
