// M3GAN — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Damaged M3GAN',
      weapon: 'android_strength_and_blade',
      special: 'Protective Protocol Override',
      phases: ['Uses precise android movement and an improvised blade', 'Damaged face and exposed mechanisms produce the documented crawling final phase'],
      lore: {
        fr: 'M3GAN endommagee remplace le protocole de danse abstrait.',
        en: 'Damaged M3GAN replaces the abstract dance protocol.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/m3gan',
      visualAnchor: 'Exact M3GAN doll design, beige bow dress, striped sleeves, blond hair, then source-accurate damaged face and exposed mechanisms.'
    },
    {
      name: 'Bruce',
      weapon: 'industrial_robot_arms',
      special: 'Garage Robot Grapple',
      phases: ['Uses heavy industrial arm swings while remotely controlled', 'Performs the documented full-body grapple against M3GAN'],
      lore: {
        fr: 'Bruce est le robot industriel construit par Gemma.',
        en: 'Bruce is the industrial robot built by Gemma.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/m3gan',
      visualAnchor: 'Exact garage-built Bruce robot from M3GAN, exposed metal frame, large industrial arms, simple head and remote-control hardware.'
    }
  ]);
}
