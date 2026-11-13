// Kazaam — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Malik',
      weapon: 'handgun_and_henchmen',
      special: 'Nightclub Ambush',
      phases: ['Uses armed henchmen and aimed handgun fire', 'Fights alone with desperate close-range shots after his cover breaks'],
      lore: {
        fr: 'Malik est le criminel qui menace Max et son pere.',
        en: 'Malik is the criminal who threatens Max and his father.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Kazaam',
      visualAnchor: 'Exact Marshall Manesh likeness, dark 1990s suit, moustache and film handgun; no genie power.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Kazaam', 'CA')],
    fr: 'Les hommes de Malik restent des ennemis standards; aucun second boss precis n est justifie.',
    en: 'Malik s men remain standard enemies; no precise second boss is justified.'
  }));
}
