// The Batman Who Laughs — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Murder Machine',
      weapon: 'nanobat_technology',
      special: 'Alfred Protocol',
      phases: ['Uses nanotechnological weapons and armored strikes', 'Reconfigures the body with the documented Alfred AI combat protocol'],
      lore: {
        fr: 'Murder Machine est le Batman corrompu de Terre -44.',
        en: 'Murder Machine is the corrupted Batman of Earth -44.'
      },
      referenceUrl: 'https://www.dc.com/comics/dark-nights-metal-2017/dark-nights-metal-dark-knights-rising',
      visualAnchor: 'Exact Dark Nights Metal Murder Machine, blue-gray cybernetic Batman body, red optics, angular armor and no Joker grin.'
    },
    {
      name: 'Dawnbreaker',
      weapon: 'corrupted_power_ring',
      special: 'Black Light Constructs',
      phases: ['Uses corrupted Green Lantern constructs and flight', 'Extinguishes arena light and releases the documented black void constructs'],
      lore: {
        fr: 'Dawnbreaker remplace l essaim de Dark Robins comme boss individuel.',
        en: 'Dawnbreaker replaces the Dark Robin swarm as an individual boss.'
      },
      referenceUrl: 'https://www.dc.com/comics/dark-nights-metal-2017/dark-nights-metal-dark-knights-rising',
      visualAnchor: 'Exact corrupted Green Lantern Batman suit, glowing ring, pale face and black-green void constructs from Dark Nights Metal.'
    }
  ]);
}
