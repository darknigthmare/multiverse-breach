// Chucky — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Chucky', fr: 'Chucky' },
    desc: {
      en: 'Charles Lee Ray transfers his soul into a Good Guy doll through Damballa voodoo, later splitting it across distinct dolls. Tiffany Valentine, Tiffany doll bodies and Jennifer Tilly remain separate identities, while the 2019 Buddi remake is an independent artificial-intelligence continuity. The leather-jacket bride and all-black human looks are canon-inspired 1998 Tiffany variants; dark-haired Wedding Belle, burned bald Tiffany, Street Siren, Synthetic Doll, Leather Mistress, Voluptuous Original and the two-piece swimwear forms are explicitly non-canon Nexus AU costumes for fictional Tiffany.',
      fr: 'Charles Lee Ray transfere son ame dans une poupee Good Guy par le vaudou de Damballa, puis la divise entre plusieurs corps distincts. Tiffany Valentine, les corps de poupee Tiffany et Jennifer Tilly restent des identites separees, tandis que le Buddi du remake de 2019 appartient a une continuite independante fondee sur une intelligence artificielle. La mariee a veste en cuir et la Tiffany humaine tout en noir sont des variantes inspirees du canon 1998; Dark-Haired Wedding Belle, Tiffany brulee et chauve, Street Siren, Synthetic Doll, Leather Mistress, Voluptuous Original et les formes en maillot deux pieces sont explicitement des costumes Nexus AU non canoniques pour la Tiffany fictive.'
    }
  });
}
