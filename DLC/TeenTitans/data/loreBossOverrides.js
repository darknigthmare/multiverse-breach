// Teen Titans — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Slade',
      weapon: 'staff_explosives_and_martial_arts',
      special: 'Apprentice Protocol',
      phases: ['Uses martial arts, staff strikes and compact explosives', 'Triggers the documented Apprentice pressure pattern without becoming a demon'],
      lore: {
        fr: 'Slade remplace l epreuve abstraite d apprenti.',
        en: 'Slade replaces the abstract apprentice trial.'
      },
      referenceUrl: 'https://www.warnerbros.com/tv/teen-titans',
      visualAnchor: 'Exact 2003 Teen Titans Slade, split orange-black mask, black-gray segmented armor, staff and series proportions.'
    }
  ]);
}
