// Ecco the Dolphin — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Vortex Drone',
      weapon: 'organic_projectiles_and_suction',
      special: 'Vortex Shell Opening',
      phases: ['Charges underwater and fires organic projectiles', 'Opens the biomechanical shell to expose a vulnerable core'],
      lore: {
        fr: 'Le drone Vortex appartient a l espece extraterrestre qui attaque les oceans.',
        en: 'The Vortex drone belongs to the alien species attacking the oceans.'
      },
      referenceUrl: 'https://eccothedolphin.fandom.com/wiki/Vortex',
      visualAnchor: 'Faithful high-detail expansion of the original aquatic biomechanical Vortex sprite, preserving anatomy and palette.'
    },
    {
      name: 'Medusa',
      weapon: 'electric_tentacles',
      special: 'Current Lock',
      phases: ['Uses tentacle sweeps and electrical pulses', 'Creates a strong current while briefly exposing the bell core'],
      lore: {
        fr: 'Medusa est une meduse geante du monde d Ecco.',
        en: 'Medusa is a giant jellyfish from Ecco s world.'
      },
      referenceUrl: 'https://eccothedolphin.fandom.com/wiki/Medusa',
      visualAnchor: 'Faithful game Medusa silhouette with translucent bell, long tentacles and original colors, without armor or humanoid features.'
    }
  ]);
}
