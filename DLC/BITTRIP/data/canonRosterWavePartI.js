// BIT.TRIP — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'bit_trip', universe: 'BIT.TRIP', aliases: ['BIT.TRIP series'], allNonCombat: true,
    continuity: 'CommanderVideo BIT.TRIP series continuity',
    adaptationRule: 'Translate every confrontation into rhythm, deflection, running or dodge Trials. Preserve the abstract pixel grammar and never invent a combat arsenal.',
    visualAnchor: 'Black voids, rainbow pixel trails, crisp white beats, retro rectangular avatars and synchronized geometric machinery.',
    referenceUrl: 'https://www.rerunner.game/presskit', colors: ['#111111', '#020202', '#f3e84f'], motif: 'beat', mode: 'Trial', difficulty: 'Expert',
    heroes: [
      { id: 'commander_video', name: 'CommanderVideo', visualAnchor: 'Small black rectangular pixel runner with white square eye and horizontal rainbow trail.' },
      { id: 'commandgirl_video', name: 'CommandGirlVideo', visualAnchor: 'Small dark rectangular pixel runner with white eye, distinct bright accent pixels and rainbow trail.' },
      { id: 'radbot', name: 'Radbot', visualAnchor: 'Compact friendly retro robot made of dark square pixels with a bright central face panel.' }
    ],
    enemies: ['Hostile Beats', 'Timbletot Gear', 'Void Orb'], bosses: ['Timbletot Flying Machine', 'Lava Rig', 'Timbletot Mech'],
    worldBoss: { id: 'mingrawn_timbletot', name: 'Mingrawn Timbletot', visualAnchor: 'Large retro geometric antagonist machine made of black-white blocks and rainbow-reactive nodes.' },
    gear: ['BIT.TRIP Paddle', 'Rainbow Cape', 'Gold Bar'], stages: ['BIT.TRIP BEAT Grid', 'RUNNER Rhythm Road', 'FATE Final Pattern'],
    event: { id: 'perfect_chain', name: 'Perfect Rhythm Chain', frName: 'Chaîne rythmique parfaite' }
  });
}
