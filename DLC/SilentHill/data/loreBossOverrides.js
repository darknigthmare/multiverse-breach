// Silent Hill — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Incubus',
      weapon: 'divine_lightning',
      special: 'Bad-Ending Final Manifestation',
      phases: ['Uses aerial divine lightning from above the ritual chamber', 'Accelerates the lightning pattern after its wings and torso are visibly damaged'],
      lore: {
        fr: 'Incubus est verrouille sur la manifestation finale de la branche correspondante de Silent Hill.',
        en: 'Incubus is locked to the matching final manifestation branch of Silent Hill.'
      },
      referenceUrl: 'https://www.konami.com/games/silenthill/',
      visualAnchor: 'Exact dark winged Incubus from the original Silent Hill final battle, horned humanoid demon anatomy and no Incubator elements.'
    },
    {
      name: 'Scarlet',
      weapon: 'porcelain_claws',
      special: 'Doll Body Break',
      phases: ['Moves as the tall porcelain doll and uses long-limbed swipes', 'Cracked porcelain reveals the canonical spider-like final movement'],
      lore: {
        fr: 'Scarlet est la manifestation de la fille du juge Holloway.',
        en: 'Scarlet is the manifestation of Judge Holloway s daughter.'
      },
      referenceUrl: 'https://silenthill.fandom.com/wiki/Scarlet',
      visualAnchor: 'Exact Silent Hill Homecoming porcelain doll boss, red dress, elongated limbs, cracked face and documented spider-like phase.'
    }
  ]);
}
