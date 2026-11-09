// Stargate Universe — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Nakai Commander',
      weapon: 'nakai_energy_weapon',
      special: 'Destiny Boarding Assault',
      phases: ['Uses Nakai energy fire and boarding-team movement', 'Calls one short reinforcement beam before a close-range final push'],
      lore: {
        fr: 'Le commandant Nakai remplace l equipe aliene abstraite.',
        en: 'The Nakai commander replaces the abstract alien boarding team.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/Nakai',
      visualAnchor: 'Exact blue-skinned Nakai anatomy, black biomechanical suit, facial structure and energy weapon from Stargate Universe.'
    },
    {
      name: 'Simeon',
      weapon: 'lucian_alliance_rifle',
      special: 'Destiny Manhunt',
      phases: ['Uses rifle fire, cover and planted distractions', 'Switches to a desperate close-range pursuit after being isolated'],
      lore: {
        fr: 'Simeon est le membre de l Alliance lucienne poursuivi par Rush.',
        en: 'Simeon is the Lucian Alliance member pursued by Rush.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/Simeon',
      visualAnchor: 'Exact Robert Knepper likeness, Lucian Alliance clothing, dark hair and SGU rifle; no Ancient technology.'
    }
  ]);
}
