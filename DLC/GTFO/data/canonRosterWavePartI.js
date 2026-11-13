// GTFO — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'gtfo', universe: 'GTFO', aliases: [],
    continuity: 'GTFO Rundown continuity and the Complex',
    adaptationRule: 'Use the four-prisoner tactical survival language and official creature silhouettes. Depict tension, biosecurity and extraction without gore.',
    visualAnchor: 'Pitch-dark underground research sectors, yellow work lights, red scan circles, industrial doors, biofoam and sealed prisoner gear.',
    referenceUrl: 'https://gtfothegame.com/prisoners', referenceUrls: ['https://gtfothegame.com/prisoners', 'https://gtfo.wiki.gg/wiki/Enemies'], colors: ['#3b433f', '#090b0c', '#e2a648'], motif: 'rundown', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'woods', name: 'Woods', role: 'marine', weapon: 'Assault rifle', weaponType: 'gun', visualAnchor: 'Adult prisoner in yellow-gray expedition layers, respirator at neck, rifle and original non-actor face.' },
      { id: 'dauda', name: 'Dauda', role: 'tactical', weapon: 'Burst rifle', weaponType: 'gun', visualAnchor: 'Adult prisoner in layered dark utility kit, headlamp, backpack and burst rifle; original face.' },
      { id: 'hackett', name: 'Hackett', role: 'hacker', weapon: 'Bio Tracker', weaponType: 'focus', visualAnchor: 'Adult prisoner in heavy utility vest with glowing bio-tracker screen and compact firearm; original face.' }
    ],
    enemies: ['Striker', 'Shooter', 'Scout'], bosses: ['Mother', 'Tank', 'Big Mother'],
    worldBoss: { id: 'kraken', name: 'Kraken', visualAnchor: 'Colossal pale creature silhouette spanning a flooded underground chamber, sealed anatomy and no gore.' },
    gear: ['Bio Tracker', 'C-Foam Launcher', 'Mine Deployer'],
    stages: ['The Complex — Security Scan', 'Rundown Reactor Startup', 'Prisoner Extraction'],
    event: { id: 'warden_order', name: 'Warden Order', frName: 'Ordre du Gardien' }
  });
}
