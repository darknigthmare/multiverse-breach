// Stargate — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'RepliCarter',
      weapon: 'replicator_nanites',
      special: 'Nanite Reassembly',
      phases: ['Uses Samantha Carter s human-form Replicator strength and nanite blades', 'Breaks into metallic blocks and reassembles once'],
      lore: {
        fr: 'Les deux variantes de Replicator Carter sont fusionnees en une seule RepliCarter.',
        en: 'The two Replicator Carter variants are merged into one RepliCarter.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/RepliCarter',
      visualAnchor: 'Exact Amanda Tapping likeness as RepliCarter, dark SG-1-era clothing and body transitions into small metallic Replicator blocks.'
    },
    {
      name: 'First',
      weapon: 'replicator_blocks_and_blade',
      special: 'Human-Form Reassembly',
      phases: ['Uses human-form strength and a blade formed from Replicator material', 'Body separates into blocks and reforms behind the target'],
      lore: {
        fr: 'First remplace le faux concept de reine Replicator.',
        en: 'First replaces the invented Replicator Queen concept.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/First',
      visualAnchor: 'Exact pale human-form Replicator known as First, simple dark clothing and metallic block decomposition; no insect queen anatomy.'
    }
  ]);
}
