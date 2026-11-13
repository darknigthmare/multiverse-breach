// Mars Attacks — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Martian Ambassador',
      weapon: 'martian_ray_gun',
      special: 'Congress Disintegration',
      phases: ['Uses measured ray-gun volleys and deceptive surrender gestures', 'Drops the diplomatic act and chains rapid disintegration shots'],
      lore: {
        fr: 'L ambassadeur martien transforme la rencontre diplomatique en massacre.',
        en: 'The Martian Ambassador turns the diplomatic encounter into a massacre.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/mars-attacks',
      visualAnchor: 'Exact exposed-brain Martian anatomy, transparent helmet, red cape, breathing apparatus and ray gun from the film.'
    },
    {
      name: 'Martian General',
      weapon: 'martian_command_pistol',
      special: 'Invasion Command',
      phases: ['Directs Martian soldiers while firing from range', 'Uses faster command-pistol bursts after his escort falls'],
      lore: {
        fr: 'Le general martien commande les forces d invasion sans mutation Nexus.',
        en: 'The Martian General commands the invasion forces without any Nexus mutation.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/mars-attacks',
      visualAnchor: 'Exact film Martian leader with glass helmet, ornate red command uniform, visible green skull-like face and compact ray pistol.'
    }
  ]);
}
