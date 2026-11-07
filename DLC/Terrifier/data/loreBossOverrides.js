// Terrifier — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Possessed Victoria Heyes',
      weapon: 'glass_shard_and_demonic_strength',
      special: 'Entity Possession',
      phases: ['Uses erratic close movement and a shard weapon', 'Reveals the documented possession state without becoming Art the Clown'],
      lore: {
        fr: 'Victoria possedee remplace le piege abstrait de l allee.',
        en: 'Possessed Victoria replaces the abstract alley trap.'
      },
      referenceUrl: 'https://terrifier3.com/',
      visualAnchor: 'Exact Samantha Scaffidi likeness as scarred Victoria in Terrifier 3, source clothing, facial prosthetics and possession makeup.'
    }
  ]);
}
