// Virus — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Captain Robert Everton - Cyborg',
      weapon: 'industrial_machine_limbs',
      special: 'Ship-Machine Assimilation',
      phases: ['Uses integrated ship tools, cables and crushing limbs', 'Exposes more human-machine tissue and adds electrical strikes below 45 percent health'],
      lore: {
        fr: 'Everton est reconstruit par l intelligence alien avec les machines du navire.',
        en: 'Everton is rebuilt by the alien intelligence using the ship s machinery.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Virus_(1999_film)',
      visualAnchor: 'Recognizable Captain Everton face fused into greasy rusted ship machinery, exposed flesh, cables and asymmetrical industrial limbs.'
    },
    {
      name: 'Alexi - Machine Hybrid',
      weapon: 'cable_claws',
      special: 'Electrical Hull Ambush',
      phases: ['Crawls along the hull and attacks with cable claws', 'Overloads exposed machinery in a short electrical rage phase'],
      lore: {
        fr: 'Le corps d Alexi devient une construction hybride de chair et de pieces navales.',
        en: 'Alexi s body becomes a hybrid construction of flesh and ship components.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Virus_(1999_film)',
      visualAnchor: 'The film s corpse-machine hybrid aesthetic with rusted naval parts, human remains, segmented cables and practical-effects grime.'
    }
  ]);
}
