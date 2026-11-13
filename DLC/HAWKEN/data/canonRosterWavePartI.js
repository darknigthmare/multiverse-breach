// HAWKEN — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'hawken', universe: 'HAWKEN', aliases: ['Hawken'],
    continuity: 'Original HAWKEN multiplayer game on Illal, not later unrelated projects',
    adaptationRule: 'The original game has pilots and chassis classes rather than a named hero trio; use representative pilot roles and canonical mech classes without inventing personal lore.',
    visualAnchor: 'Dusty Illal megacity ruins, rust-orange industrial towers, blue holographic systems and compact angular walking mechs.',
    referenceUrl: 'https://www.playhawken.com/game-guide', referenceUrls: ['https://www.playhawken.com/game-guide', 'https://blog.playstation.com/2016/06/27/hawken-launches-july-8-on-ps4/'], colors: ['#5c4937', '#111516', '#48b9de'], motif: 'mech', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
    heroes: [
      { id: 'crt_recruit', name: 'CR-T Recruit', role: 'marine', weapon: 'Assault rifle arm', visualAnchor: 'Compact CR-T biped mech in worn gray-orange plates, rectangular cockpit and rifle arm.' },
      { id: 'assault_pilot', name: 'Assault Pilot', role: 'tactical', weapon: 'Assault chassis autocannon', visualAnchor: 'Anonymous fully helmeted adult pilot presented beside a balanced gray-blue Assault mech.' },
      { id: 'technician_pilot', name: 'Technician Pilot', role: 'hacker', weapon: 'Helix Repair Torch', weaponType: 'focus', visualAnchor: 'Anonymous fully helmeted adult support pilot beside a slim yellow-gray Technician mech with repair beam.' }
    ],
    enemies: ['Prosk Rival Axe', 'Sentium Rival Axe', 'Siege Drone'], bosses: ['Bruiser', 'Rocketeer', 'Incinerator'],
    worldBoss: { id: 'siege_battleship', name: 'Siege Battleship', visualAnchor: 'Massive hovering angular carrier above Illal rooftops with shield nodes and no faction logo.' },
    gear: ['Repair Charge', 'Hologram Decoy', 'EMP Device'], stages: ['Bazaar — Team Assault', 'Last Eco — Missile Defense', 'Siege Battleship Route'],
    event: { id: 'illal_siege', name: 'Illal Siege', frName: 'Siège d’Illal' }
  });
}
