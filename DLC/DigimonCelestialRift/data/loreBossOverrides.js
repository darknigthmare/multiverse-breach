// Digimon Celestial Rift — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Lucemon Falldown Mode',
      weapon: 'light_and_dark_energy',
      special: 'Paradise Lost',
      phases: ['Uses alternating light and dark energy attacks', 'Unleashes the documented Paradise Lost technique at low health'],
      lore: {
        fr: 'Lucemon Falldown Mode unit les pouvoirs de la lumiere et des tenebres.',
        en: 'Lucemon Falldown Mode combines the powers of light and darkness.'
      },
      referenceUrl: 'https://digimon.net/reference_en/detail.php?directory_name=lucemonfalldownmode',
      visualAnchor: 'Exact official Digimon Reference Book design, blond humanoid demon, black-white wings, markings and proportions.'
    },
    {
      name: 'Ordinemon',
      weapon: 'dark_energy_and_wings',
      special: 'End-of-World Collapse',
      phases: ['Uses huge wing sweeps and dark energy spheres', 'Destabilizes into a wider collapse pattern after the central body is exposed'],
      lore: {
        fr: 'Ordinemon est la fusion corrompue de Raguelmon et Ophanimon Falldown Mode.',
        en: 'Ordinemon is the corrupted fusion of Raguelmon and Ophanimon Falldown Mode.'
      },
      referenceUrl: 'https://digimon.net/reference_en/detail.php?directory_name=ordinemon',
      visualAnchor: 'Exact official Ordinemon design, immense black-white body, multiple wings, central feminine form and documented markings.'
    }
  ]);
}
