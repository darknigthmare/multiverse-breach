// Borderlands — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Handsome Jack',
      weapon: 'hyperion_pistol_and_digi_clones',
      special: 'Hyperion Doppelganger',
      phases: ['Uses a Hyperion pistol, shield and digi-clones', 'Damaged shield reveals the exact face mask and a faster final firing pattern'],
      lore: {
        fr: 'Handsome Jack est represente directement, pas comme un echo.',
        en: 'Handsome Jack is represented directly rather than as an echo.'
      },
      referenceUrl: 'https://borderlands.2k.com/',
      visualAnchor: 'Exact Borderlands 2 Handsome Jack, Hyperion coat, blue shirt, facial mask seams, heterochromia and Hyperion pistol.'
    }
  ]);
}
