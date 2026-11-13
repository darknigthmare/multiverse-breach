// Overlord Anime — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Shalltear Bloodfallen - Mind-Controlled',
      weapon: 'spuit_lance_and_vampire_magic',
      special: 'Einherjar',
      phases: ['Uses the Spuit Lance, blood magic and defensive skills', 'Summons Einherjar and enters the armored true-vampire combat phase'],
      lore: {
        fr: 'Shalltear ne devient boss que durant son controle mental.',
        en: 'Shalltear becomes a boss only during her mind-controlled encounter.'
      },
      referenceUrl: 'https://overlordmaruyama.fandom.com/wiki/Shalltear_Bloodfallen',
      visualAnchor: 'Exact anime Shalltear with silver hair and red eyes, then canonical crimson full plate and Spuit Lance; no generic succubus traits.'
    },
    {
      name: 'Clementine',
      weapon: 'stilettos',
      special: 'Black Scripture Trophy Rush',
      phases: ['Uses rapid stiletto thrusts and martial movement', 'Displays adventurer plates and commits to a frantic speed combo'],
      lore: {
        fr: 'Clementine est une ancienne membre de la Black Scripture devenue meurtriere.',
        en: 'Clementine is a former Black Scripture member turned murderer.'
      },
      referenceUrl: 'https://overlordmaruyama.fandom.com/wiki/Clementine',
      visualAnchor: 'Exact anime Clementine, short blond hair, black-red outfit covered with adventurer plates and paired stilettos.'
    }
  ]);
}
