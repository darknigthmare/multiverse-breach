// SCP Foundation — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'SCP-682',
      weapon: 'adaptive_claws_and_jaws',
      special: 'Adaptive Regeneration',
      phases: ['Uses massive bites, claw sweeps and tail strikes', 'Regenerates once with a visible adaptation tied to the received damage type'],
      lore: {
        fr: 'SCP-682 est un reptile hostile extremement difficile a detruire.',
        en: 'SCP-682 is an extremely hostile reptile that is very difficult to destroy.'
      },
      referenceUrl: 'https://scp-wiki.wikidot.com/scp-682',
      visualAnchor: 'Original interpretation constrained by the SCP article: huge emaciated reptilian organism, damaged hide and adaptive tissue, no borrowed game armor.'
    },
    {
      name: 'SCP-096',
      weapon: 'claws_and_unstoppable_charge',
      special: 'Face-Viewed Rage',
      phases: ['Remains passive while its face is not exposed', 'Enters the canonical unstoppable rage and charge after the trigger'],
      lore: {
        fr: 'SCP-096 devient violent lorsqu une personne voit son visage.',
        en: 'SCP-096 becomes violent when someone views its face.'
      },
      referenceUrl: 'https://scp-wiki.wikidot.com/scp-096',
      visualAnchor: 'Original interpretation constrained by the SCP article: extremely thin pale humanoid, very long arms, distressed posture and obscured face.'
    }
  ]);
}
