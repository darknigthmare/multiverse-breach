// Splatterhouse — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Biggy Man',
      weapon: 'dual_chainsaws',
      special: 'Double Chainsaw Rush',
      phases: ['Uses alternating chainsaw sweeps and short rushes', 'Chains both saws into an uninterrupted rage sequence'],
      lore: {
        fr: 'Biggy Man est le geant masque aux deux tronconneuses.',
        en: 'Biggy Man is the masked giant wielding two chainsaws.'
      },
      referenceUrl: 'https://splatterhouse.fandom.com/wiki/Biggy_Man',
      visualAnchor: 'Exact selected-game Biggy Man, massive human frame, sack-like mask and one chainsaw in each hand; preserve game palette.'
    },
    {
      name: 'Dr. Henry West',
      weapon: 'corrupted_science_and_mutation',
      special: 'West Mansion Mutation',
      phases: ['Uses documented laboratory hazards in human form', 'Reveals the specific corrupted form from the selected Splatterhouse continuity'],
      lore: {
        fr: 'Henry West est le savant lie aux horreurs du manoir.',
        en: 'Henry West is the scientist tied to the mansion s horrors.'
      },
      referenceUrl: 'https://splatterhouse.fandom.com/wiki/Dr._Henry_West',
      visualAnchor: 'Lock to one selected game continuity: exact Henry West clothing and documented mutation, with no cross-version costume mixing.'
    }
  ]);
}
