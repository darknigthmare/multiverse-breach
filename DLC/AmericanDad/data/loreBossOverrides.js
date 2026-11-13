// American Dad — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Santa Claus',
      weapon: 'military_sleigh_arsenal',
      special: 'Christmas War Assault',
      phases: ['Uses firearms and armed Christmas reinforcements', 'Calls the documented combat sleigh for a final strafing pass'],
      lore: {
        fr: 'Le Pere Noel d American Dad mene une guerre recurrente contre les Smith.',
        en: 'American Dad s Santa Claus wages a recurring war against the Smith family.'
      },
      referenceUrl: 'https://americandad.fandom.com/wiki/Santa_Claus',
      visualAnchor: 'Exact American Dad Santa design, red suit, white beard, muscular build and documented military equipment.'
    },
    {
      name: 'Tearjerker',
      weapon: 'villain_lair_controls',
      special: 'Oscar Gold Scheme',
      phases: ['Uses lair traps and henchman commands', 'Abandons the control station for a theatrical final confrontation'],
      lore: {
        fr: 'Tearjerker est la persona de mechant Bond de Roger.',
        en: 'Tearjerker is Roger s Bond-villain persona.'
      },
      referenceUrl: 'https://americandad.fandom.com/wiki/Tearjerker',
      visualAnchor: 'Exact Tearjerker persona from American Dad, white villain suit, styled hair, glasses and series proportions.'
    }
  ]);
}
