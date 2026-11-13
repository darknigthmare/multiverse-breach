// The Last of Us — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'tess_tlou', name: 'Tess', cat: 'tactical', color: '#6d5f4f', simpleName: 'Smuggler Pistol', secondaryName: 'Capitol Last Stand', defenseName: 'Quarantine Cover', specialName: 'Infected Delay Sacrifice' },
    { id: 'tommy_tlou', name: 'Tommy Miller', cat: 'marine', color: '#566573', simpleName: 'Rifle Patrol Shot', secondaryName: 'Jackson Ambush', defenseName: 'Settlement Guard', specialName: 'Sniper Overwatch' },
    { id: 'dina_tlou2', name: 'Dina', cat: 'tactical', color: '#8d6e63', simpleName: 'Switchblade Feint', secondaryName: 'Horseback Escape', defenseName: 'Theater Hideout', specialName: 'Seattle Support Route' },
    { id: 'abby_tlou2', name: 'Abby Anderson', cat: 'marine', color: '#5d6d7e', simpleName: 'WLF Rifle Burst', secondaryName: 'Hammer Counter', defenseName: 'Aquarium Route Guard', specialName: 'Seraphite Island Breakout' }
  ]);
}
