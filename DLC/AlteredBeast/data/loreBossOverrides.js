// Altered Beast — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Aggar',
      weapon: 'severed_head_projectiles',
      special: 'Head Volley',
      phases: ['Throws severed heads in measured arcs', 'Accelerates the volley and adds a close-range body strike'],
      lore: {
        fr: 'Aggar est le premier boss d Altered Beast.',
        en: 'Aggar is the first boss of Altered Beast.'
      },
      referenceUrl: 'https://www.sega.com/games/altered-beast',
      visualAnchor: 'Faithful high-detail expansion of Aggar s arcade sprite, swollen gray humanoid body and detachable head projectiles.'
    },
    {
      name: 'Crocodile Worm',
      weapon: 'jaws_and_body_charge',
      special: 'Crocodile-Worm Lunge',
      phases: ['Uses long-body sweeps and crocodilian bites', 'Chains faster lunges after the body armor cracks'],
      lore: {
        fr: 'Crocodile Worm conserve exactement son anatomie hybride du jeu.',
        en: 'Crocodile Worm keeps its exact hybrid anatomy from the game.'
      },
      referenceUrl: 'https://alteredbeast.fandom.com/wiki/Crocodile_Worm',
      visualAnchor: 'Faithful high-detail expansion of the arcade hybrid, elongated worm body, crocodile head, original palette and no added limbs.'
    }
  ]);
}
