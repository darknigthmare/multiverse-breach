// Secret of Monkey Island — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Largo LaGrande',
      weapon: 'pirate_cutlass',
      special: 'Scabb Island Embargo',
      phases: ['Uses a cutlass and dirty pirate tricks', 'Calls a short embargo guard wave before a final duel'],
      lore: {
        fr: 'Largo impose l embargo de Scabb Island au nom de LeChuck.',
        en: 'Largo enforces the Scabb Island embargo for LeChuck.'
      },
      referenceUrl: 'https://monkeyisland.fandom.com/wiki/Largo_LaGrande',
      visualAnchor: 'Faithful high-detail version of Largo LaGrande s selected game design, short pirate build, hat, coat and cutlass.'
    },
    {
      name: 'Sheriff Fester Shinetop',
      weapon: 'period_pistol',
      special: 'LeChuck Disguise Reveal',
      phases: ['Uses the sheriff disguise to arrest and restrain', 'Shows subtle documented LeChuck cues and fires the period pistol'],
      lore: {
        fr: 'Fester Shinetop est le deguisement de LeChuck sur Melee Island.',
        en: 'Fester Shinetop is LeChuck s disguise on Melee Island.'
      },
      referenceUrl: 'https://monkeyisland.fandom.com/wiki/Fester_Shinetop',
      visualAnchor: 'Exact bald sheriff disguise and original-game period outfit, with only source-accurate LeChuck reveal cues.'
    }
  ]);
}
