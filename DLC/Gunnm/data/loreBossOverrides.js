// Gunnm — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Makaku',
      weapon: 'extendable_cyborg_arm',
      special: 'Kinuba Body Crush',
      phases: ['Fights as the exposed Makaku head-core with an extendable arm', 'Uses the stolen Kinuba gladiator body for crushing attacks'],
      lore: {
        fr: 'Makaku vole le corps de Kinuba et devient un adversaire cyborg massif.',
        en: 'Makaku steals Kinuba s body and becomes a massive cyborg opponent.'
      },
      referenceUrl: 'https://archive.kodansha.us/volume/battle-angel-alita-3/index.html',
      visualAnchor: 'Exact grotesque Makaku head-core and the stolen Kinuba Motorball gladiator body, with the canonical extendable arm.'
    },
    {
      name: 'Jashugan',
      weapon: 'machine_clash',
      special: 'Motorball Champion Overload',
      phases: ['Uses Machine Clash punches, dashes and counters', 'Suffers terminal neural overload while maintaining the final combo'],
      lore: {
        fr: 'Jashugan combat comme champion de Motorball avec la technique Machine Clash.',
        en: 'Jashugan fights as the Motorball champion using the Machine Clash technique.'
      },
      referenceUrl: 'https://battleangel.fandom.com/wiki/Jashugan',
      visualAnchor: 'Exact Motorball champion cyborg body, broad armor, face and arena silhouette from Gunnm.'
    }
  ]);
}
