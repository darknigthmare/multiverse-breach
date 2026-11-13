// Spawn — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'The Violator',
      weapon: 'demonic_claws_and_bite',
      special: 'Clown-to-Violator Reveal',
      phases: ['Uses the obese blue-faced Clown disguise for taunts and close tricks', 'Reveals the long-headed skeletal demon for claw and bite attacks'],
      lore: {
        fr: 'Le Violator manipule Spawn sous l apparence de Clown avant de reveler sa forme demoniaque.',
        en: 'The Violator manipulates Spawn as Clown before revealing his demonic form.'
      },
      referenceUrl: 'https://www.spawn.com/characters/violator/',
      visualAnchor: 'Official Clown disguise followed by the canonical skeletal long-headed Violator demon silhouette, without mixing unrelated redesigns.'
    },
    {
      name: 'Chapel',
      weapon: 'mercenary_rifle_and_grenades',
      special: 'Skull-Face Suppression',
      phases: ['Uses rifle bursts and grenades from cover', 'Abandons cover for a heavy shoulder charge below 35 percent health'],
      lore: {
        fr: 'Chapel est lie a la mort d Al Simmons dans la continuite comics choisie.',
        en: 'Chapel is tied to Al Simmons s death in the selected comics continuity.'
      },
      referenceUrl: 'https://www.spawn.com/characters/chapel/',
      visualAnchor: 'The selected official-comic version of the massive mercenary, skull face paint, tactical armor and canonical rifle.'
    }
  ]);
}
