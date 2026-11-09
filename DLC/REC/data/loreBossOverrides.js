// REC — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Infected Manu',
      weapon: 'infected_bite_and_grapple',
      special: 'Stairwell Ambush',
      phases: ['Rushes through the apartment corridor with feral grapples', 'Continues after being staggered and attempts a direct bite'],
      lore: {
        fr: 'Manu est contamine dans l immeuble mis en quarantaine.',
        en: 'Manu is infected inside the quarantined apartment building.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Rec_(film)',
      visualAnchor: 'Exact Manu firefighter clothing and likeness from REC, blood and infection makeup only as shown in the film.'
    },
    {
      name: 'Infected Jennifer',
      weapon: 'feral_claws_and_bite',
      special: 'Feral Infection Leap',
      phases: ['Moves unpredictably and attacks from low angles', 'Uses a fast leap and bite after a short stun window'],
      lore: {
        fr: 'Jennifer est une enfant infectee, pas une creature surnaturelle en armure.',
        en: 'Jennifer is an infected child, not a supernatural armored creature.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Rec_(film)',
      visualAnchor: 'Exact child clothing and infection makeup from REC, feral posture, no demonic anatomy and no added weapon.'
    }
  ]);
}
