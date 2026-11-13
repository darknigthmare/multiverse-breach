// War of the Worlds — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Tripod Harvester',
      weapon: 'heat_ray_and_probe_tentacles',
      special: 'Human Harvest',
      phases: ['Uses tripod movement, heat rays and a separate probe-tentacle sweep', 'Exposes weakened shields and organic understructure after contamination'],
      lore: {
        fr: 'Le Tripod regroupe les mecanismes de sonde et de recolte du film de Spielberg.',
        en: 'The Tripod combines the probe and harvesting mechanisms from Spielberg s film.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/war-of-the-worlds',
      visualAnchor: 'Exact 2005 Tripod, three long legs, cobra-like head, blue-white heat ray, hanging basket and articulated probe tentacle; entire machine visible.'
    }
  ]);
}
