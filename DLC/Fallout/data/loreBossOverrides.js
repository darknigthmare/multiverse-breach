// Fallout — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Frank Horrigan',
      weapon: 'plasma_gun_and_power_armor',
      special: 'Enclave Final Stand',
      phases: ['Uses the integrated plasma weapon and armored melee strikes', 'Damaged armor exposes life-support failures without changing his identity'],
      lore: {
        fr: 'Frank Horrigan est l agent mutant de l Enclave affronte dans Fallout 2.',
        en: 'Frank Horrigan is the Enclave mutant agent fought in Fallout 2.'
      },
      referenceUrl: 'https://fallout.bethesda.net/',
      visualAnchor: 'Faithful high-detail Frank Horrigan, enormous mutant scale, black Enclave power armor, integrated plasma gun and helmet.'
    },
    {
      name: 'The Master',
      weapon: 'psychic_control_and_turrets',
      special: 'Cathedral Mind Assault',
      phases: ['Uses psychic pressure and linked Cathedral defenses', 'Exposes the fused human-computer biomass for the final exchange'],
      lore: {
        fr: 'The Master remplace Liberty Prime, qui n est pas un ennemi de cette confrontation.',
        en: 'The Master replaces Liberty Prime, who is not an enemy in this confrontation.'
      },
      referenceUrl: 'https://fallout.fandom.com/wiki/Master',
      visualAnchor: 'Exact Fallout 1 fused Master: human face embedded in flesh and computer machinery, cables, monitors and no mobile humanoid body.'
    }
  ]);
}
