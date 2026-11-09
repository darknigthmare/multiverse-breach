// Haydee — Safe Adaptation — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'haydee_safe', universe: 'Haydee — Safe Adaptation', aliases: ['Haydee'],
    continuity: 'Haydee (2016) artificial complex',
    adaptationRule: 'Preserve the white synthetic helmet and color-zone puzzle identity while redesigning every body as a fully covered, nonsexualized utility android. No fetish framing, exposed anatomy or sexual pose.',
    visualAnchor: 'Sterile white-black industrial rooms, colored access zones, grid vents, security robots and fully covered synthetic exploration suits.',
    referenceUrl: 'https://store.steampowered.com/app/530890/Haydee/', colors: ['#d9e0e5', '#11161b', '#d44a4a'], motif: 'access-card', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
    heroes: [
      { id: 'green_loadout', name: 'Haydee — Green-Zone Loadout', role: 'tactical', weapon: 'Service pistol', weaponType: 'gun', visualAnchor: 'Fully covered white-gray utility android suit, smooth opaque helmet, green access lights and compact pistol.' },
      { id: 'red_loadout', name: 'Haydee — Red-Zone Loadout', role: 'marine', weapon: 'Magnum', weaponType: 'gun', visualAnchor: 'Fully covered reinforced white-black utility android suit, opaque helmet and red access lights.' },
      { id: 'blue_loadout', name: 'Haydee — Blue-Zone Loadout', role: 'hacker', weapon: 'Remote mine tool', visualAnchor: 'Fully covered slim white-gray technical android suit, opaque helmet and blue access lights.' }
    ],
    enemies: ['Slasher', 'Walker', 'Automated Trap Grid'],
    bosses: [
      { id: 'red_zone_pursuit', name: 'Red Zone Pursuit', nonCombat: true, visualAnchor: 'Timed red-door route with moving security beams and closing shutters.' },
      { id: 'black_zone_ambush', name: 'Black Zone Ambush', nonCombat: true, visualAnchor: 'Dark ventilation route with sensor lights and safe cover markers.' },
      { id: 'blue_zone_exit', name: 'Blue Zone Exit Protocol', nonCombat: true, visualAnchor: 'Blue-card circuitry and four exit-lock states from sealed to open.' }
    ],
    worldBoss: { id: 'complex_core', name: 'Artificial Complex Core', nonCombat: true, visualAnchor: 'White industrial control core with red, green and blue access circuits resolving into an open exit.' },
    gear: ['Green Keycard', 'Night Visor', 'Remote Mine'], stages: ['Green Zone Access', 'Red-Black Security Route', 'Blue Zone Exit'],
    event: { id: 'access_reset', name: 'Access Reset', frName: 'Réinitialisation des accès' }
  });
}
