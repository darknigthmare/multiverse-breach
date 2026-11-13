// Flashback — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Morph Assassin',
      weapon: 'energy_pistol_and_disguise',
      special: 'Morph Reveal',
      phases: ['Fights in a human disguise with an energy pistol', 'Reveals the exact alien Morph form and attacks more quickly'],
      lore: {
        fr: 'Le Morph infiltre la societe humaine avant de reveler sa forme extraterrestre.',
        en: 'The Morph infiltrates human society before revealing its alien form.'
      },
      referenceUrl: 'https://www.microids.com/game-flashback/',
      visualAnchor: 'Faithful high-detail expansion of the original Flashback human disguise and documented Morph reveal, with the game energy pistol.'
    },
    {
      name: 'Master Brain',
      weapon: 'psionic_beams_and_modules',
      special: 'Core Exposure',
      phases: ['Uses control beams and linked defense modules', 'Exposes the central alien brain core after the modules are destroyed'],
      lore: {
        fr: 'Master Brain controle l installation alien finale.',
        en: 'Master Brain controls the final alien installation.'
      },
      referenceUrl: 'https://flashback.fandom.com/wiki/Master_Brain',
      visualAnchor: 'Faithful high-detail expansion of the original alien brain-computer sprite, cables, industrial housing and exposed central core.'
    }
  ]);
}
